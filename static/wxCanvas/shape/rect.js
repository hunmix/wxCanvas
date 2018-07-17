import {commonUtils} from './commonUtils'
// 矩形
class Rect {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true
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
    this.fillMethod = drawData.fillMethod || 'fill'
    this.color = drawData.color
    this.type = 'rect'
    this.scale = drawData.scale || null
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.scale = scale
    this.firstRender = false
    this.x = this.x * scale.x
    this.y = this.y * scale.y
    this.w = this.w * scale.x
    this.h = this.h * scale.y
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
    ctx[this.fillMethod + 'Rect'](this.x, this.y, this.w, this.h)
    ctx.closePath()
    ctx.restore()
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
    this.realSize = realSize
    // 碰撞检测
    if (this.x < 0) {
      this.x = 0
    }
    if (this.x + this.w > realSize.w) {
      this.x = realSize.w - this.w
    }
    if (this.y < 0) {
      this.y = 0
    }
    if (this.y + this.h > realSize.h) {
      this.y = realSize.h - this.h
    }
  }
  move (e) {
    let movePoint = {
      x: e.mp.touches[0].x,
      y: e.mp.touches[0].y
    }
    this.offsetX = movePoint.x - this.startPoint.x
    this.offsetY = movePoint.y - this.startPoint.y
    this.x = this.startX + this.offsetX
    this.y = this.startY + this.offsetY
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
    // this.getAbsolutLocation(this.realSize)
    this.judgeChangeProps(this.type, this.realSize, keyArr)
    // this.resetAbsoluteLocationInfo(option)
  }
  // resetAbsoluteLocationInfo (option) {
  //   console.log(option)
  //   console.log('reset')
  //   if (option.left) {
  //     this.left = option.left
  //     this.right = undefined
  //     this.locX = undefined
  //   }
  //   if (option.right) {
  //     this.right = option.right
  //     this.left = undefined
  //     this.locX = undefined
  //   }
  //   if (option.top) {
  //     this.top = option.top
  //     this.bottom = undefined
  //     this.locY = undefined
  //   }
  //   if (option.bottom) {
  //     this.bottom = option.bottom
  //     this.top = undefined
  //     this.locY = undefined
  //   }
  //   if (option.locX) {
  //     this.locX = option.locX
  //     this.left = undefined
  //     this.right = undefined
  //   }
  //   if (option.locY) {
  //     this.locY = option.locY
  //     this.top = undefined
  //     this.bottom = undefined
  //   }
  //   this.getAbsolutLocation(this.realSize)
  // }
  // ---------待重写！---------------------------------------------------------------
  // 根据设置方法不同设置不同参数
  getAbsolutLocation (realSize) {
    let loc = null // 方向
    let size = null // realSize，屏幕真实宽or高
    let property = null // 改变x或y的值
    let type = null // 根据种类调用不同计算
    let rectProperty = null
    if (this.locX !== undefined) {
      loc = this.locX
      size = realSize.w
      property = 'x'
      rectProperty = 'w'
      type = 'locationX&Y'
      this.setLocPosition(loc, size, property, rectProperty, type)
    }
    if (this.locY !== undefined) {
      loc = this.locY
      size = realSize.h
      property = 'y'
      rectProperty = 'h'
      type = 'locationX&Y'
      this.setLocPosition(loc, size, property, rectProperty, type)
    }
    if (this.left !== undefined) {
      loc = this.left
      size = realSize.w
      property = 'x'
      rectProperty = 'w'
      type = 'left&top'
      this.setLocPosition(loc, size, property, rectProperty, type)
    }
    if (this.top !== undefined) {
      loc = this.top
      size = realSize.h
      property = 'y'
      rectProperty = 'h'
      type = 'left&top'
      this.setLocPosition(loc, size, property, rectProperty, type)
    }
    if (this.right !== undefined) {
      loc = this.right
      size = realSize.w
      property = 'x'
      rectProperty = 'w'
      type = 'right&bottom'
      this.setLocPosition(loc, size, property, rectProperty, type)
    }
    if (this.bottom !== undefined) {
      loc = this.bottom
      size = realSize.h
      property = 'y'
      rectProperty = 'h'
      type = 'right&bottom'
      this.setLocPosition(loc, size, property, rectProperty, type)
    }
  }
  // 计算x,y的值
  setLocPosition (loc, size, property, rectProperty, type) {
    switch (type) {
      case 'locationX&Y' :
        if (loc === 'center') {
          this[property] = size / 2 - this[rectProperty] / 2
        } else if (typeof loc === 'number') {
          this[property] = loc - this[rectProperty] / 2
        } else if (loc.indexOf('%') !== -1) {
          let num = this.getPercentNum(loc)
          this[property] = size * num / 100 - this[rectProperty] / 2
        }
        break
      case 'left&top' :
        if (typeof loc === 'number') {
          this[property] = loc
        } else if (loc.indexOf('%') !== -1) {
          let num = this.getPercentNum(loc)
          this[property] = size * num / 100
        }
        break
      case 'right&bottom' :
        if (typeof loc === 'number') {
          this[property] = size - this[rectProperty] - loc
        } else if (loc.indexOf('%') !== -1) {
          let num = this.getPercentNum(loc)
          this[property] = size - size * num / 100 - this[rectProperty]
        }
        break
    }
  }
  // 获取百分比的数字部分
  getPercentNum (value) {
    let len = value.length
    console.log(Number(value.substring(0, len - 1)))
    return Number(value.substring(0, len - 1))
  }
}
Rect.prototype = Object.assign(Rect.prototype, commonUtils)
export {Rect}
