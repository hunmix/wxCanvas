import {commonUtils} from './commonUtils'
// 文字
class Text {
  constructor (drawData) {
    console.log(drawData)
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true
    this.text = drawData.text || '超级变变变'
    // this.width = ctx.measureText(drawData.text).width
    this.h = drawData.h
    this.x = drawData.x || 0
    this.w = null
    this.y = drawData.y || 0
    this.locX = drawData.locX
    this.locY = drawData.locY
    this.left = drawData.left
    this.right = drawData.right
    this.top = drawData.top
    this.bottom = drawData.bottom
    this.fontSize = drawData.fontSize || 14
    this.fillMethod = drawData.fillMethod || 'fill'
    this.color = drawData.color
    this.align = drawData.align || 'left'
    this.baseline = drawData.baseline || 'normal'
    this.type = 'text'
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
    console.log(this.y)
    this.ctx = ctx
    ctx.save()
    transformInfo && this.handleTransform(ctx, transformInfo)
    ctx.textBaseline = this.baseline || 'normal' // normal：baseLine在文字底部，则y值为y+文字框高度
    ctx.setFontSize(this.fontSize)
    ctx.textAlign = this.align || 'left'
    ctx[this.fillMethod + 'Style'] = this.color
    ctx.closePath()
    console.log(this.text, this.x, this.y + this.h)
    ctx[this.fillMethod + 'Text'](this.text, this.x, this.y + this.h)
    transformInfo && this.restProps(transformInfo)
    ctx.restore()
  }
  judgeRange (e) {
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    }
    // 获取文本宽度
    this.w = this.ctx.measureText(this.text).width
    switch (this.align) {
      case 'center':
        this.leftX = this.x - this.w / 2
        break
      case 'left':
        this.leftX = this.x
        break
      case 'right':
        this.leftX = this.x - this.w
        break
    }
    if (this.startPoint.x > this.leftX && this.startPoint.y > this.y && this.startPoint.x < this.leftX + this.w && this.startPoint.y < this.y + this.h) {
      this.startX = this.x
      this.startY = this.y
      return true
    } else {
      return false
    }
  }
  // 碰撞判定
  collisionDetection (realSize) {
    this.realSize = realSize
    switch (this.align) {
      case 'center':
        this.leftX = this.x - this.w / 2
        if (this.leftX < 0) {
          this.x = this.w / 2
        }
        if (this.leftX + this.w > realSize.w) {
          this.x = realSize.w - this.w / 2
        }
        break
      case 'left':
        this.leftX = this.x
        this.leftX = this.x
        if (this.leftX < 0) {
          this.x = 0
          console.log('000')
        }
        if (this.x + this.w > realSize.w) {
          this.x = realSize.w - this.w
        }
        break
      case 'right':
        this.leftX = this.x - this.w
        if (this.leftX < 0) {
          this.x = this.w
        }
        if (this.x > realSize.w) {
          this.x = realSize.w
        }
        break
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
    // this.getAbsolutLocation(this.realSize)
    this.judgeChangeProps(this.type, this.realSize, keyArr)
  }
}

Text.prototype = Object.assign(Text.prototype, commonUtils)

export {Text}
