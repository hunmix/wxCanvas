import {Shape} from './shape/shape'
import {Store} from './store/store'
import {Info} from './info/info'
import {EventBus} from './eventBus/eventBus'
import {canvasFunction} from './utils/wxCanvasSelfFun'
import {ScaleControl} from './scale/ScaleControl'
import {extendsCommonMethods} from './mixins/commonUtils'
// 爸爸类
class WxCanvas {
  constructor (canvas, config) {
    this.canvas = canvas // 绘画上下文对象
    this.store = new Store() // store对象，用于储存图形对象
    this.info = new Info(config) // info对象，初始化各种信息
    this.canMove = false // 是否能拖动标记
    this.bus = new EventBus() // 事件总线对象
    this.scaleControl = new ScaleControl(this.bus, this.initCanvasInfo())
    this.bus.listen('update', this, this.update)
    this.bus.listen('add', this, this.add)
    this.bus.listen('delete', this, this.delete)
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
  add (shapes, callback) {
    if (shapes instanceof Array) {
      shapes.forEach(shape => {
        shape.bus = this.bus
        shape.realSize = this.info.realSize
        this.store.add(shape)
      })
    } else {
      shapes.bus = this.bus
      shapes.realSize = this.info.realSize
      this.store.add(shapes)
    }
    this.draw(callback)
    return this
  }
  draw (callback) {
    console.log(callback)
    let that = this
    this.store.store.forEach((item) => {
      // console.log(item)
      item.draw(that.canvas, that.info.scale, that.info.realSize)
    })
    callback ? this.canvas.draw(false, callback) : this.canvas.draw(false)
    console.log('draw complete')
  }
  // 外置触摸开始
  touchStart (e) {
    this.isMouseMove = false
    this.judgeCanMoveItem(e)
  }
  // 外置触摸移动
  touchMove (e) {
    this.isMouseMove = true
    this.canMove && this.handleMoveEvent(e)
    this.scaleControl.canShapeTrans() && this.scaleControl.handleTransEvent(e)
    // 全部画出来
    this.draw()
  }
  // 触摸结束
  touchEnd (e) {
    this.canMove = false
    // 点击事件回调函数
    this.isMouseMove === false && this.handleClickEvent(e)
    this.scaleControl.stopTransfrom()
    this.scaleControl.resetTransform()
  }
  // 清除所有图像，不可恢复
  clear () {
    this.store.clear()
    this.draw()
  }
  clearStore () {
    this.store.clear()
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
  update (data) {
    this.draw()
  }
  /* 保存图片，外部调用
  * @param {boolean} loadingText loading文字
  * @param {string} successText 成功文字
  * @param {Function} failCallback 授权失败回调函数
  */
  saveImage ({loadingText = null, successText = null, imagePreview = false}, callback = undefined) {
    console.log('save begin')
    loadingText && wx.showLoading({
      title: loadingText
    })
    this._saveCanvasToPthotosAlbum(imagePreview, successText, callback)
  }
  // 保存canvas到相册
  _saveCanvasToPthotosAlbum (imagePreview, successText, callback) {
    let _this = this
    console.log(_this.canvas)
    // canvas转图片并获取路径
    wx.canvasToTempFilePath({
      canvasId: _this.canvas.canvasId,
      success: function (res) {
        // 图片预览
        imagePreview && wx.previewImage({
          current: res.tempFilePath,
          urls: [res.tempFilePath]
        })
        console.log('canvasUrl :' + res.tempFilePath)
        // 获取路径后保存图片到相册s
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success () {
            console.log('save complete')
            wx.hideLoading()
            // 成功之后关掉loading并提示已保存
            if (successText) {
              wx.showToast({
                title: successText,
                icon: 'success',
                duration: 1000
              })
            }
            callback && callback(true)
          },
          fail (err) {
            wx.hideLoading()
            callback && callback(false)
            console.warn(err)
          }
        })
      }
    })
  }
}
//  感觉这样好像不太好 先这么滴吧
// WxCanvas.prototype = Object.assign(WxCanvas.prototype, canvasFunction)
extendsCommonMethods(WxCanvas.prototype, canvasFunction)

export {WxCanvas, Shape}
