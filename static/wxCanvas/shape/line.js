import {commonUtils} from './commonUtils'
// 直线
class Line {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true
    this.x1 = drawData.x1 || 0
    this.y1 = drawData.y1 || 0
    this.x2 = drawData.x2 || 0
    this.y2 = drawData.y2 || 0
    this.w = drawData.w || 1
    this.fillMethod = drawData.fillMethod || 'stroke'
    this.color = drawData.color
    this.type = 'line'
    this.scale = drawData.scale || null
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.scale = scale
    this.firstRender = false
    this.x1 = this.x1 * scale.x
    this.y1 = this.y1 * scale.y
    this.x2 = this.x2 * scale.x
    this.y2 = this.y2 * scale.y
  }
  // 绘制路径
  createPath (ctx, sacle, realSize) {
    // if (this.firstRender) {
    //   this.calcInfo(sacle)
    // }
    // this.collisionDetection(realSize)
    ctx.save()
    ctx.beginPath()
    ctx[this.fillMethod + 'Style'] = this.color
    ctx.lineWidth = this.w
    ctx.moveTo(this.x1, this.y1)
    ctx.lineTo(this.x2, this.y2)
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }
  judgeRange (e) {
    return false
    // this.startPoint = {
    //   x: e.mp.changedTouches[0].x,
    //   y: e.mp.changedTouches[0].y
    // }
    // let rightX = this.x + this.w
    // let bottomY = this.y + this.h
    // let width = Math.abs(this.x2 - this.x1)
    // if (this.startPoint.x > this.x && this.startPoint.x < rightX && this.startPoint.y < bottomY && this.startPoint.y > this.y) {
    //   this.startX = this.x
    //   this.startY = this.y
    //   return true
    // } else {
    //   return false
    // }
  }
  collisionDetection (realSize) {
    this.realSize = realSize
    // 碰撞检测
    if (this.x1 < 0) {
      this.x1 = 0
    }
    if (this.x2 > realSize.w) {
      this.x2 = realSize.w
    }
    if (this.y1 < 0) {
      this.y1 = 0
    }
    if (this.y2 > realSize.h) {
      this.y2 = realSize.h
    }
  }
  // move (e) {
  //   let movePoint = {
  //     x: e.mp.touches[0].x,
  //     y: e.mp.touches[0].y
  //   }
  //   this.offsetX = movePoint.x - this.startPoint.x
  //   this.offsetY = movePoint.y - this.startPoint.y
  //   this.x = this.startX + this.offsetX
  //   this.y = this.startY + this.offsetY
  // }
  updateOption (option, calcScale) {
    // 待改= =先不动了
    for (let key in option) {
      if (calcScale) {
        console.log('in calc')
        switch (key) {
          case 'x1':
            this.x1 = option.x1 * this.scale.x
            continue
          case 'y1':
            this.y1 = option.y1 * this.scale.y
            continue
          case 'x2':
            this.x2 = option.x2 * this.scale.x
            continue
          case 'y2':
            this.y2 = option.y2 * this.scale.y
            continue
        }
      }
      this[key] = option[key]
    }
  }
  getAbsolutLocation () {
    console.log('我被调用了,但是我p事不干')
  }
}

Line.prototype = Object.assign(Line.prototype, commonUtils)

export {Line}
