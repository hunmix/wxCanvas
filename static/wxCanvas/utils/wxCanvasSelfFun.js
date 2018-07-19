// wxCanvas中用到的方法
const canvasFunction = {
  // touchEnd点击事件处理
  clickEvent (e) {
    const len = this.store.store.length
    for (let i = len - 1; i > -1; i--) {
      const shape = this.store.store[i]
      if (this._isInShapeAfterTouchEnd(e, shape)) {
        this.scaleControl.isScaleShapeChanged() && this.scaleControl.reset(this)
        shape.scaleable && this.scaleControl.createBorderFrame(shape)
        // shape.scaleable && this._drawBorderFrame(shape)
        this._ergodicEvents(shape)
        return false
      }
    }
    this.scaleControl.reset(this)
  },
  // 判断是否触发缩放事件
  _isInShapeAfterTouchEnd (e, shape) {
    const isInShape = shape.isInShape(e)
    const hasClickEvent = shape.eventList['click'].length > 0
    const canClickEmit = isInShape && hasClickEvent
    return canClickEmit
  },
  // 遍历所有点击事件
  _ergodicEvents (shape) {
    shape.eventList['click'].forEach((ele) => {
      ele(this)
    })
  }
}

export {canvasFunction}
