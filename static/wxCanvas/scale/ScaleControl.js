import {Shape} from './../shape/shape'
import {getCalcProps} from './../mixins/commonUtils'
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
    const movePoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    }
    const movedX = {
      x: movePoint.x - this.startPoint.x,
      y: movePoint.y - this.startPoint.y
    }
    // 判断按在哪个移动点上面
    const movePointIndex = this.borderFrame.Shape.getMovePointIndex()
    if (movePointIndex === 4) {
      console.log('-----------rotate-------------')
      const centerPoint = this.scaleShape.Shape.centerPoint ? this.scaleShape.Shape.centerPoint : this._getCenterPoint()
      const deg = this._calcDegValue(centerPoint, movePoint)
      console.log(deg)
      this.transformInfo.rotate = deg
    } else {
      console.log(movePointIndex)
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
      if (!this._canShapeScale(this.transformInfo.scale)) {
        this.transformInfo.scale = null
      }
    }
    this.scaleShape.setTransformInfo(this.transformInfo)
    this.update()
  }
  // 判断在哪个象限
  _calcDegValue (centerPoint, movePoint) {
    let tan = null
    let deg = null
    const currentPoint = {
      x: Math.abs(movePoint.x - centerPoint.x),
      y: Math.abs(movePoint.y - centerPoint.y)
    }
    console.log('-----------------------------1111111111111----------------------------')
    if (movePoint.x > centerPoint.x && movePoint.y < centerPoint.y) {
      console.log('第一象限')
      tan = currentPoint.x / currentPoint.y
      deg = Math.atan(tan) / Math.PI * 180
    } else if (movePoint.x > centerPoint.x && movePoint.y > centerPoint.y) {
      console.log('第二象限')
      tan = currentPoint.y / currentPoint.x
      deg = Math.atan(tan) / Math.PI * 180 + 90
      console.log(Math.atan(tan) / Math.PI * 180)
    } else if (movePoint.x < centerPoint.x && movePoint.y > centerPoint.y) {
      console.log('第三象限')
      tan = currentPoint.x / currentPoint.y
      deg = Math.atan(tan) / Math.PI * 180 + 180
    } else if (movePoint.x < centerPoint.x && movePoint.y < centerPoint.y) {
      console.log('第四象限')
      tan = currentPoint.y / currentPoint.x
      deg = Math.atan(tan) / Math.PI * 180 + 270
    }
    console.log(deg)
    return deg
  }
  _getCenterPoint () {
    const currentShape = getCalcProps.getShapeType[this.scaleShape.Shape.type]
    let centerPoint = null
    if (currentShape === 'rect') {
      centerPoint = {
        x: this.scaleShape.Shape.x + this.scaleShape.Shape.w / 2,
        y: this.scaleShape.Shape.y + this.scaleShape.Shape.h / 2
      }
    } else if (currentShape === 'circle') {
      centerPoint = {
        x: this.scaleShape.Shape.x + this.scaleShape.Shape.r,
        y: this.scaleShape.Shape.y + this.scaleShape.Shape.r
      }
    } else if (currentShape === 'text') {
      console.log('太多等会写')
    }
    return centerPoint
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
