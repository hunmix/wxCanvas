import {commonUtils} from './commonUtils'
// 选中边框
class BorderFrame {
  constructor (drawData) {
    drawData.firstRender = false
    this.x = drawData.x || 0
    this.y = drawData.y || 0
    this.w = drawData.w
    this.h = drawData.h
    this.left = drawData.left
    this.right = drawData.right
    this.top = drawData.top
    this.bottom = drawData.bottom
    this.locX = drawData.locX
    this.locY = drawData.locY
    // this.fillMethod = drawData.fillMethod || 'fill'
    this.fillMethod = 'stroke'
    this.color = '#80cef5'
    // this.color = drawData.color
    this.type = 'borderFrame'
    this.scale = drawData.scale || null
  }
  // 计算绘画数据
  calcInfo (scale) {
    console.log('scale')
    this.scale = scale
    this.firstRender = false
    this.x = this.x * scale.x
    this.y = this.y * scale.y
    this.w = this.w * scale.x
    this.h = this.h * scale.y
  }
  // 绘制路径
  createPath (ctx, sacle, realSize) {
    ctx.save()
    ctx.beginPath()
    ctx[this.fillMethod + 'Style'] = this.color
    ctx[this.fillMethod + 'Rect'](this.x, this.y, this.w, this.h)
    this._drawPoint(ctx)
    this._drawLine(ctx)
    this._drawCircle(ctx)
    ctx.closePath()
    ctx.restore()
  }
  _drawPoint (ctx) {
    const option = this._calcPointsPosition()
    console.log(option)
    option.forEach(point => {
      ctx.beginPath()
      ctx.strokeStyle = this.color
      ctx.fillStyle = '#fff'
      ctx.fillRect(point.x, point.y, 10, 10)
      ctx.strokeRect(point.x, point.y, 10, 10)
      ctx.closePath()
    })
  }
  _calcPointsPosition () {
    const len = 5
    const pointLeftTop = {
      x: this.x - len,
      y: this.y - len
    }
    const pointRightTop = {
      x: this.x + this.w - len,
      y: this.y - len
    }
    const pointRightBottom = {
      x: this.x + this.w - len,
      y: this.y + this.h - len
    }
    const pointLeftBottom = {
      x: this.x - len,
      y: this.y + this.h - len
    }
    return [pointLeftTop, pointRightTop, pointRightBottom, pointLeftBottom]
  }
  _drawLine (ctx) {
    const lineOption = {
      x1: this.x + this.w / 2,
      y1: this.y,
      x2: this.x + this.w / 2,
      y2: this.y - 15
    }
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.moveTo(lineOption.x1, lineOption.y1)
    ctx.lineTo(lineOption.x2, lineOption.y2)
    ctx.stroke()
    ctx.closePath()
  }
  _drawCircle (ctx) {
    const circleOption = {
      x: this.x + this.w / 2,
      y: this.y - 20,
      r: 5
    }
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.arc(circleOption.x, circleOption.y, circleOption.r, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.closePath()
  }
  judgeRange (e) {
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    }
    let rightX = this.x + this.w
    let bottomY = this.y + this.h
    if (this.startPoint.x > this.x && this.startPoint.x < rightX && this.startPoint.y < bottomY && this.startPoint.y > this.y) {
      this.startX = this.x
      this.startY = this.y
      return true
    } else {
      return false
    }
  }
  collisionDetection (realSize) {
    const len = 5
    this.realSize = realSize
    // 碰撞检测
    if (this.x < 0) {
      this.x = -len
    }
    if (this.x + this.w > realSize.w) {
      this.x = realSize.w - this.w + len
    }
    if (this.y < 0) {
      this.y = -len
    }
    if (this.y + this.h > realSize.h) {
      this.y = realSize.h - this.h + len
    }
  }
  move (e) {
    // let movePoint = {
    //   x: e.mp.touches[0].x,
    //   y: e.mp.touches[0].y
    // }
    // this.offsetX = movePoint.x - this.startPoint.x
    // this.offsetY = movePoint.y - this.startPoint.y
    // this.x = this.startX + this.offsetX
    // this.y = this.startY + this.offsetY
  }
  // 更新自适应属性数据x,y,r,w,h等，直接更新or动画调用
  updateOption (option, calcScale) {
    // ----------------------可能会有问题-----------------------------------------------
    let keyArr = Object.keys(option)
    if (keyArr.length !== 0) {
      this.resetXY(keyArr)
      if (calcScale) {
        this.calcScaleValue(keyArr, option, this.scale)
      } else {
        this.calcScaleValue(keyArr, option, false)
      }
      this.getOptionValue(keyArr, option)
    }
    // 如果有left, right啥啥啥的，就重置同方向的定位属性，避免影响
    this.resetAbsoluteInfo(keyArr, option)
    this.judgeChangeProps(this.type, this.realSize, keyArr)
  }
}
BorderFrame.prototype = Object.assign(BorderFrame.prototype, commonUtils)
export {BorderFrame}
