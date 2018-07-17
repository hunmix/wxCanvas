import {Shape} from './shape/shape'
import {Store} from './store/store'
import {Info} from './info/info'
import {EventBus} from './eventBus/eventBus'
// 爸爸类
class WxCanvas {
  constructor (canvas, config) {
    this.canvas = canvas // 绘画上下文对象
    this.store = new Store() // store对象，用于储存图形对象
    this.info = new Info(config) // info对象，初始化各种信息
    this.canMove = false // 是否能拖动标记
    this.bus = new EventBus() // 事件总线对象，没用到= =
    this.bus.listen('update', this, this.update)
  }
  // 获取canvas真实宽高，外部调用
  initCanvasInfo () {
    this.screen = this.info.getSystemInfo()
    this.info.initInfo()
    return {
      width: this.info.realWidth,
      height: this.info.realHeight
    }
  }
  add (shape) {
    shape.bus = this.bus
    shape.realSize = this.info.realSize
    this.store.add(shape)
    this.draw()
    return this
  }
  draw () {
    let that = this
    this.store.store.forEach((item) => {
      item.draw(that.canvas, that.info.scale, that.info.realSize)
    })
    this.canvas.draw()
  }
  // 外置触摸开始
  touchStart (e) {
    this.isMouseMove = false
    // ----------------------------------------------------------------
    let len = this.store.store.length
    for (let i = len - 1; i > -1; i--) {
      let shape = this.store.store[i]
      if (shape.canDragable() && shape.isInShape(e)) {
        this.moveItem = shape
        this.canMove = true
        return
      }
    }
  }
  // 外置触摸移动
  touchMove (e) {
    this.isMouseMove = true
    if (this.canMove) {
      this.moveItem.move(e)
      this.draw()
    }
  }
  // 触摸结束
  touchEnd (e) {
    this.canMove = false
    // 点击事件回调函数
    if (this.isMouseMove === false) {
      let len = this.store.store.length
      for (let i = len - 1; i > -1; i--) {
        let shape = this.store.store[i]
        if (shape.isInShape(e)) {
          if (shape.eventList['click'].length > 0) {
            shape.eventList['click'].forEach((ele) => {
              ele(this)
            })
            return false
          }
        }
      }
    }
  }
  // 清除所有图像，不可恢复
  clear () {
    this.store.clear()
    this.draw()
  }
  // 撤销
  cancel (cancelNum) {
    cancelNum = cancelNum || 1
    this.store.cancel(cancelNum)
    this.draw()
  }
  // 恢复
  resume () {
    this.store.resume()
    this.draw()
  }
  // 删除
  delete (item) {
    this.store.delete(item)
    this.draw()
  }
  update () {
    this.draw()
  }
  /* 保存图片，外部调用
  * @param {boolean} useShowLoading 是否使用提示
  * @param {string} loadingText 提示文字
  */
  saveImage (useShowLoading, loadingText = '保存中...') {
    console.log('save')
    useShowLoading && wx.showLoading({
      title: loadingText
    })
    var _this = this
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success () {
        _this._saveCanvasToPthotosAlbum(useShowLoading)
      },
      fail () {
        console.log('授权失败')
      }
    })
  }
  // 保存canvas到相册
  _saveCanvasToPthotosAlbum (useShowLoading) {
    let _this = this
    console.log(_this.canvas)
    // canvas转图片并获取路径
    wx.canvasToTempFilePath({
      canvasId: _this.canvas.canvasId,
      success: function (res) {
        console.log(res.tempFilePath)
        // 获取路径后保存图片到相册s
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success () {
            // 成功之后关掉loading并提示已保存
            if (useShowLoading) {
              wx.hideLoading()
              wx.showToast({
                title: '已保存到相册',
                icon: 'success',
                duration: 1000
              })
            }
          },
          fail (err) {
            if (useShowLoading) {
              wx.hideLoading()
            }
            console.warn(err)
          }
        })
      }
    })
  }
}

export {WxCanvas, Shape}
