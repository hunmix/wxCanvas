import {extendsCommonMethods, commonUtils} from './../mixins/commonUtils'
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
    this.scaleInfo = null
    this.rotateInfo = null
    this.translateInfo = null
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
  createPath (ctx, transformInfo) {
    console.log('------------------------------------')
    console.log(transformInfo)
    ctx.save()
    transformInfo && this.handleTransform(ctx, transformInfo)
    console.log(this.rotateInfo)
    ctx.beginPath()
    console.log('-------------------------上次写到这里！-----------------------')
    console.log(this.translateInfo)
    // if (this.translateInfo) {
    //   ctx.translate(this.translateInfo.center.x, this.translateInfo.center.y)
    //   ctx.scale(this.translateInfo.scaleInfo.x, this.translateInfo.scaleInfo.y)
    // }
    // if (this.rotateInfo) {
    //   const x = this.rotateInfo.center[0]
    //   const y = this.rotateInfo.center[1]
    //   const rad = this.rotateInfo.rad
    //   ctx.translate(x, y)
    //   ctx.rotate(rad)
    //   console.log(rad)
    //   ctx.translate(-x, -y)
    // }
    ctx[this.fillMethod + 'Style'] = this.color
    ctx[this.fillMethod + 'Rect'](this.x, this.y, this.w, this.h)
    ctx.closePath()
    ctx.restore()
    transformInfo && this.restProps(transformInfo)
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
    this.judgeChangeProps(this.type, this.realSize, keyArr)
  }
}
// Rect.prototype = Object.assign(Rect.prototype, commonUtils)
extendsCommonMethods(Rect.prototype, commonUtils)
export {Rect}
