// 信息
class Info {
  constructor (config) {
    this.canvasSize = { // 画布尺寸
      width: config.canvasWidth,
      height: config.canvasHeight
    }
    this.uiInfo = { // 设计图信息
      width: config.uiWidth,
      height: config.uiHeight
    }
  }
  // 获取设备信息
  getSystemInfo () {
    try {
      var res = wx.getSystemInfoSync()
      this.screen = {
        width: res.windowWidth,
        height: res.windowHeight
      }
      return this.screen
    } catch (e) {
      // Do something when catch error
      console.log('can\'t get systemInfo')
    }
  }
  // 初始数据
  initInfo () {
    console.log(this.canvasSize.width, this.canvasSize.height, this.uiInfo.width, this.uiInfo.height)
    this.canvasRatio = this.canvasSize.width / this.canvasSize.height // 设计图canvas宽高比
    this.wRatio = this.canvasSize.width / this.uiInfo.width // 设计图canvas和设计图宽度比
    this.hRatio = this.canvasSize.height / this.uiInfo.height // 设计图canvas和设计图高度比
    this.realWidth = this.screen.width * this.wRatio // 真实绘画宽度
    this.realHeight = this.realWidth / this.canvasRatio // 真实绘画高度
    this.leftToCanvas = (this.screen.width - this.realWidth) / 2 // 屏幕距canvas左边距离
    this.topToCanvas = (this.screen.height - this.realHeight) / 2 // 屏幕距canvas右边距离
    // 高度不够定高宽度等比例缩放
    if (this.realHeight >= this.screen.height) {
      this.realHeight = this.screen.height * this.hRatio
      this.realWidth = this.realHeight * this.canvasRatio
    }
    this.realSize = {
      h: this.realHeight,
      w: this.realWidth
    }
    // canvas内元素缩放比
    this.scale = {
      x: this.realWidth / this.canvasSize.width,
      y: this.realHeight / this.canvasSize.height
    }
  }
}

export {Info}
