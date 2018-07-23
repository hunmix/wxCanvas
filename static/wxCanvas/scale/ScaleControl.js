import {Shape} from './../shape/shape'
class ScaleControl {
  constructor (bus, realSize) {
    this.borderFrame = null
    this.bus = bus
    this.scaleShape = null
    this.canTrans = false
    this.transformInfo = {}
    this.startPoint = null
    this.realSize = realSize
    this.fromBorderLen = 5
  }
  createBorderFrame (shape) {
    if (!this.isScaleShapeChanged()) return
    this.scaleShape = shape
    this.scaleShape.dragable = true
    console.log(shape)
    const option = this.calcBorderFrameData()
    this.drawBorderFrame(option)
  }
  // 计算缩放框的数据
  calcBorderFrameData (scaleShape = this.scaleShape.Shape) {
    const len = this.fromBorderLen
    const option = {
      x: scaleShape.x - len,
      y: scaleShape.y - len
    }
    if (scaleShape.type === 'text') {
      switch (scaleShape.align) {
        case 'center' :
          option.x = scaleShape.x - scaleShape.w / 2 - len
          break
        case 'right' :
          console.log('right')
          option.x = scaleShape.x - scaleShape.w - len
          console.log(option.x)
          break
      }
    }
    console.log('scaleControl :' + scaleShape)
    if (this._isCircleTypeShape()) {
      option.w = scaleShape.r * 2 + len * 2
      option.h = scaleShape.r * 2 + len * 2
      // -------------------------------------------------------
    } else if (this.scaleShape.Shape.type === 'text') {
      option.w = scaleShape.w + len * 2
      option.h = scaleShape.h + len * 2
      console.log('borderFrameData :' + option.w)
    } else {
      option.w = scaleShape.w + len * 2
      option.h = scaleShape.h + len * 2
    }
    console.log(option)
    return option
  }
  drawBorderFrame (drawData) {
    console.log(drawData)
    this.borderFrame = new Shape('borderFrame', drawData)
    this.bus.emit('add', this.borderFrame)
  }
  reset () {
    console.log('reset')
    this.delete()
    if (this.scaleShape) {
      this.scaleShape.dragable = false
    }
    this.scaleShape = null
  }
  delete () {
    console.log('delete')
    this.bus.emit('delete', this.borderFrame)
    this.borderFrame = null
  }
  isScaleShapeChanged (shape) {
    // console.log(this.scaleShape)
    // console.log(shape)
    console.log(this.scaleShape === shape)
    return this.scaleShape !== shape
  }
  isBorderFrameNeedMove (currentMoveItem) {
    return currentMoveItem === this.scaleShape
  }
  isTouchOnFrame (e) {
    // 边框不存在直接返回
    if (!this.borderFrame) { return false }
    console.log(this.borderFrame.isInShape(e))
    return this.borderFrame.isInShape(e)
  }
  update (updateData) {
    console.log('ScaleControl :')
    console.log(updateData)
    console.log('update')
    const shape = updateData || this.scaleShape.Shape
    console.log(updateData)
    const option = this.calcBorderFrameData(shape)
    console.log(option)
    const changedProps = Object.keys(option)
    changedProps.forEach(prop => {
      this.borderFrame.Shape[prop] = option[prop]
    })
  }
  canShapeTrans () {
    return this.canTrans
  }
  startTransfrom (e) {
    this.canTrans = true
    console.log(e)
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    }
  }
  stopTransfrom () {
    this.canTrans = false
  }
  // 计算缩放比例(待整理。。乱- -)
  handleTransEvent (e) {
    // 判断按在哪个移动点上面
    const movePointIndex = this.borderFrame.Shape.getMovePointIndex()
    console.log(movePointIndex)
    const movePoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    }
    const movedX = {
      x: movePoint.x - this.startPoint.x,
      y: movePoint.y - this.startPoint.y
    }
    // 根据点击不同的点来更改movedx的属性，计算缩放
    this._judgeLongerMoveLength(movePointIndex, movedX)
    this.startPoint = movePoint
    // 判断是否是圆形
    if (this._isCircleTypeShape()) {
      this.transformInfo.scale = {
        x: 1 + movedX.x / this.scaleShape.Shape.r,
        y: 1 + movedX.y / this.scaleShape.Shape.r
      }
    } else {
      this.transformInfo.scale = {
        x: 1 + movedX.x / (this.scaleShape.Shape.w / 2),
        y: 1 + movedX.y / (this.scaleShape.Shape.h / 2)
      }
    }
    // 根据移动最多的值进行缩放
    if (Math.abs(1 - this.transformInfo.scale.x) > Math.abs(1 - this.transformInfo.scale.y)) {
      this.transformInfo.scale.y = this.transformInfo.scale.x
    } else {
      this.transformInfo.scale.x = this.transformInfo.scale.y
    }
    // 设定缩放边界
    if (this._canShapeScale(this.transformInfo.scale)) {
      this.scaleShape.setTransformInfo(this.transformInfo)
      this.update()
    } else {
      this.scaleShape.setTransformInfo(null)
    }
  }
  // 该图形是否能缩放，到达边界没有
  _canShapeScale (scale) {
    console.log(this.realSize)
    if (this._isCircleTypeShape() && this._isCircleInBoundary(scale)) {
      return false
    } else if (this._isOtherShapeInBoundary(scale)) {
      return false
    } else {
      return true
    }
  }
  _isCircleInBoundary (scale) {
    return this.scaleShape.Shape.r * 2 * scale.x <= 10 || this.scaleShape.Shape.r * 2 * scale.x >= this.realSize.width - this.fromBorderLen * 2
  }
  _isOtherShapeInBoundary (scale) {
    return this.scaleShape.Shape.w * scale.x <= 10 || this.scaleShape.Shape.h * scale.y <= 10 || this.scaleShape.Shape.w * scale.x >= this.realSize.width - this.fromBorderLen * 2 || this.scaleShape.Shape.h * scale.y >= this.realSize.height - this.fromBorderLen * 2
  }
  _judgeLongerMoveLength (currentPoint, movedX) {
    switch (currentPoint) {
      case 0 :
        movedX.x = -movedX.x
        movedX.y = -movedX.y
        console.log('in 0')
        break
      case 1 :
        movedX.y = -movedX.y
        console.log('in 1')
        break
      case 2 :
        console.log('in 2')
        break
      case 3 :
        movedX.x = -movedX.x
        console.log('in 3')
        break
    }
  }
  _isCircleTypeShape () {
    return this.scaleShape.Shape.type === 'circle' || this.scaleShape.Shape.type === 'circleImage'
  }
  resetTransform () {
    this.transformInfo = {}
    this.scaleShape && this.scaleShape.resetTransInfo()
  }
}

export {ScaleControl}
