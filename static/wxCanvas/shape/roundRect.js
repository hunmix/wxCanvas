// import {commonUtils} from './../mixins/commonUtils'
import {extendsCommonMethods, commonUtils} from './../mixins/commonUtils'
// 圆角矩形
class RoundRect {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true
    this.r = drawData.r
    if (drawData.width < 2 * drawData.r) {
      this.r = drawData.width / 2
    }
    if (drawData.height < 2 * drawData.r) {
      this.r = drawData.height / 2
    }
    console.log(drawData.x || 0)
    this.r = this.r || 0
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
    this.color = drawData.color || '#000'
    this.fillMethod = drawData.fillMethod || 'fill'
    this.type = 'roundRect'
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
  createPath (ctx, transformInfo) {
    // if (this.firstRender) {
    //   this.calcInfo(sacle)
    // }
    // this.collisionDetection(realSize)
    ctx.save()
    ctx[this.fillMethod + 'Style'] = this.color
    transformInfo && this.handleTransform(ctx, transformInfo)
    ctx.beginPath()
    ctx.moveTo(this.x + this.r, this.y)
    ctx.lineTo(this.x + this.w - this.r, this.y)
    ctx.arc(this.x + this.w - this.r, this.y + this.r, this.r, 3 / 2 * Math.PI, 2 * Math.PI)
    ctx.lineTo(this.x + this.w, this.y + this.h - this.r)
    ctx.arc(this.x + this.w - this.r, this.y + this.h - this.r, this.r, 0, 1 / 2 * Math.PI)
    ctx.lineTo(this.x + this.r, this.y + this.h)
    ctx.arc(this.x + this.r, this.y + this.h - this.r, this.r, 1 / 2 * Math.PI, Math.PI)
    ctx.lineTo(this.x, this.y + this.r)
    ctx.arc(this.x + this.r, this.y + this.r, this.r, Math.PI, 3 / 2 * Math.PI)
    ctx.closePath()
    ctx[this.fillMethod]()
    ctx.restore()
    transformInfo && this.restProps(transformInfo)
  }
  // _restProps (transformInfo) {
  //   const changedLen = {
  //     w: this.w / 2 * transformInfo.scale.x,
  //     h: this.h / 2 * transformInfo.scale.y
  //   }
  //   const centerPoint = {
  //     x: this.x + this.w / 2,
  //     y: this.y + this.h / 2
  //   }
  //   this.x = centerPoint.x - changedLen.w
  //   this.y = centerPoint.y - changedLen.h
  //   this.w = this.w * transformInfo.scale.x
  //   this.h = this.h * transformInfo.scale.y
  // }
  // _handleTransform (ctx, transformInfo) {
  //   transformInfo.scale && this._scaleTransform(ctx, transformInfo.scale)
  // }
  // _scaleTransform (ctx, scaleInfo) {
  //   console.log(scaleInfo)
  //   const center = {
  //     x: (this.x + this.w / 2) * (1 - scaleInfo.x),
  //     y: (this.y + this.h / 2) * (1 - scaleInfo.y)
  //   }
  //   ctx.translate(center.x, center.y)
  //   ctx.scale(scaleInfo.x, scaleInfo.y)
  //   console.log(center.x, center.y)
  //   console.log(scaleInfo)
  // }
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
      console.log('in')
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
  // 更新图形信息时候是否需要重新计算真实宽高
  updateOption (option, calcScale) {
    // ----------------------可能会有问题-----------------------------------------------
    // 一坨方法放在commonUtils里面
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
// RoundRect.prototype = Object.assign(RoundRect.prototype, commonUtils)
extendsCommonMethods(RoundRect.prototype, commonUtils)
export {RoundRect}
