import {Shape} from './../shape/shape'
class ScaleControl {
  constructor (bus) {
    this.borderFrame = null
    this.bus = bus
    this.scaleShape = null
  }
  createBorderFrame (shape) {
    if (!this.isScaleShapeChanged()) return
    this.scaleShape = shape
    this.scaleShape.dragable = true
    const option = this.calcBorderFrameData(shape)
    this.drawBorderFrame(option)
  }
  calcBorderFrameData (scaleShape) {
    const len = 5
    return {
      x: scaleShape.Shape.x - len,
      y: scaleShape.Shape.y - len,
      w: scaleShape.Shape.w + len * 2,
      h: scaleShape.Shape.h + len * 2
    }
  }
  drawBorderFrame (drawData) {
    this.borderFrame = new Shape('borderFrame', drawData)
    this.bus.emit('add', this.borderFrame)
  }
  reset () {
    this.delete()
    if (this.scaleShape) {
      this.scaleShape.dragable = false
    }
    this.scaleShape = null
  }
  delete () {
    console.log('delete')
    this.bus.emit('delete', this.borderFrame)
  }
  isScaleShapeChanged (shape) {
    return this.scaleShape !== shape
  }
  isBorderFrameNeedMove (currentMoveItem) {
    return currentMoveItem === this.scaleShape
  }
  update () {
    console.log('update')
    const shape = this.scaleShape
    const option = this.calcBorderFrameData(shape)
    const changedProps = Object.keys(option)
    changedProps.forEach(prop => {
      this.borderFrame.Shape[prop] = option[prop]
    })
  }
}

export {ScaleControl}
