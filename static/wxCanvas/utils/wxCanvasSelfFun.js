// wxCanvas中用到的方法
const canvasFunction = {
  // touchStart,遍历store找到点击图形
  judgeCanMoveItem (e) {
    let len = this.store.store.length
    for (let i = len - 1; i > -1; i--) {
      let shape = this.store.store[i]
      if (shape.isInShape(e)) {
        shape.canDragable() && this._setMoveInfo(shape)
        // 点在框上就return
        if (this.scaleControl.isTouchOnFrame(e)) {
          this.scaleControl.startTransfrom(e)
          return
        }
        // 点击不在自定义图形上时清除边框
        this.scaleControl.isScaleShapeChanged(shape) && this.scaleControl.reset(this)
        return
      }
    }
    try {
      this.scaleControl.reset()
    } catch (err) {
      console.log(err)
    }
    console.log('emit reset')
  },
  _setMoveInfo (shape) {
    this.moveItem = shape
    this.canMove = true
  },
  // touchMove事件处理
  handleMoveEvent (e) {
    console.log('move')
    this.moveItem.move(e)
    this.scaleControl.isBorderFrameNeedMove(this.moveItem) && this.scaleControl.update()
  },
  // touchEnd点击事件处理
  handleClickEvent (e) {
    const len = this.store.store.length
    for (let i = len - 1; i > -1; i--) {
      const shape = this.store.store[i]
      if (shape.isInShape(e)) {
        console.log(shape)
        // 遍历点击事件
        this._isEventExist(shape) && this._ergodicEvents(shape)
        // 自定义边框处理
        this._shouldCreateBorderFrame(shape) && this.scaleControl.createBorderFrame(shape)
        return
      }
    }
  },
  _isEventExist (shape) {
    return shape.eventList['click'].length > 0
  },
  _shouldCreateBorderFrame (shape) {
    return this.scaleControl.isScaleShapeChanged(shape) && shape.scaleable
  },
  // 遍历所有点击事件
  _ergodicEvents (shape) {
    shape.eventList['click'].forEach((ele) => {
      ele(this)
    })
  }
}

export {canvasFunction}
