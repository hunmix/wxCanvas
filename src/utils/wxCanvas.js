// 爸爸类
class WxCanvas {
  constructor (canvas, config) {
    this.canvas = canvas
    this.store = new Store()
    this.info = new Info(config)
    this.canMove = false
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
    this.store.add(shape)
    return this
  }
  draw () {
    let that = this
    this.store.store.forEach((item) => {
      item.draw(that.canvas, that.info.scale, that.info.realSize)
    })
    this.canvas.draw()
  }
  touchStart (e) {
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
  touchMove (e) {
    if (this.canMove) {
      this.moveItem.move(e)
      this.draw()
    }
  }
  touchEnd (e) {
    this.canMove = false
  }
}

// 信息
class Info {
  constructor (config) {
    this.canvasSize = {
      width: config.canvasWidth,
      height: config.canvasHeight
    }
    this.uiInfo = {
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
// 存放shape实例
class Store {
  constructor () {
    this.store = []
  }
  // 添加图形
  add (shape) {
    this.store.push(shape)
  }
  // 清空所有图形
  clear () {
    this.store = []
  }
}
// 图形
class Shape {
  constructor (type, drawData, dragable) {
    this.Shape = createShape[type](drawData)
    this.dragable = dragable
  }
  draw (ctx, scale, realSize) {
    this.Shape.createPath(ctx, scale, realSize)
  }
  isInShape (e) {
    return this.Shape.judgeRange(e)
  }
  canDragable () {
    return this.dragable
  }
  move (e) {
    this.Shape.move(e)
  }
}
let createShape = {
  'circle': function (drawData) {
    return new Circle(drawData)
  },
  'rect': function (drawData) {
    return new Rect(drawData)
  },
  'image': function (drawData) {
    return new Image(drawData)
  },
  'text': function (drawData) {
    return new Text(drawData)
  },
  'roundRect': function (drawData) {
    return new RoundRect(drawData)
  },
  'circleImage': function (drawData) {
    return new CircleImage(drawData)
  }
}
// 圆
class Circle {
  constructor (drawData) {
    this.x = drawData.x
    this.y = drawData.y
    this.r = drawData.r
    this.color = drawData.color
    this.fillMethod = drawData.fillMethod
    this.offsetX = 0
    this.offsetY = 0
    this.type = 'circle'
    this.firstRender = true
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.firstRender = false
    this.x = this.x * scale.x
    this.y = this.y * scale.y
    this.r = this.r * scale.x
  }
  createPath (ctx, sacle, realSize) {
    if (this.firstRender) {
      this.calcInfo(sacle)
    }
    this.collisionDetection(realSize)
    ctx.save()
    ctx.beginPath()
    ctx[this.fillMethod + 'Style'] = this.color
    ctx.arc(this.x + this.r, this.y + this.r, this.r, 0, 2 * Math.PI)
    ctx[this.fillMethod]()
    ctx.closePath()
    ctx.restore()
  }
  judgeRange (e) {
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    }
    let len = Math.sqrt(Math.pow(this.startPoint.x - (this.x + this.r), 2) + Math.pow(this.startPoint.y - (this.y + this.r), 2))
    if (len < this.r) {
      this.startX = this.x
      this.startY = this.y
      return true
    } else {
      return false
    }
  }
  collisionDetection (realSize) {
    // 碰撞检测
    if (this.x + this.r * 2 > realSize.w) {
      this.x = realSize.w - this.r * 2
    }
    if (this.x < 0) {
      this.x = 0
    }
    if (this.y < 0) {
      this.y = 0
    }
    if (this.y + this.r * 2 > realSize.h) {
      this.y = realSize.h - this.r * 2
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
}

// 矩形
class Rect {
  constructor (drawData) {
    this.firstRender = true
    this.x = drawData.x
    this.y = drawData.y
    this.w = drawData.w
    this.h = drawData.h
    this.fillMethod = drawData.fillMethod
    this.color = drawData.color
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.firstRender = false
    this.x = this.x * scale.x
    this.y = this.y * scale.y
    this.w = this.w * scale.x
    this.h = this.h * scale.y
  }
  createPath (ctx, sacle, realSize) {
    if (this.firstRender) {
      this.calcInfo(sacle)
    }
    this.collisionDetection(realSize)
    ctx.save()
    ctx.beginPath()
    ctx[this.fillMethod + 'Style'] = this.color
    ctx[this.fillMethod + 'Rect'](this.x, this.y, this.w, this.h)
    ctx.closePath()
    ctx.restore()
  }
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
      return true
    } else {
      return false
    }
  }
  collisionDetection (realSize) {
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
}
// 图片
class Image {
  constructor (drawData) {
    this.firstRender = true
    this.imgW = drawData.imgW
    this.imgH = drawData.imgH
    this.url = drawData.url
    this.x = drawData.x
    this.y = drawData.y
    this.w = drawData.w
    this.h = drawData.h
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.firstRender = false
    this.x = this.x * scale.x
    this.y = this.y * scale.y
    this.w = this.w * scale.x
    this.h = this.h * scale.y
  }
  createPath (ctx, sacle, realSize) {
    if (this.firstRender) {
      this.calcInfo(sacle)
    }
    this.collisionDetection(realSize)
    ctx.save()
    ctx.drawImage(this.url, 0, 0, this.imgW, this.imgH, this.x, this.y, this.w, this.h)
    ctx.closePath()
    ctx.restore()
  }
  // 判断是否在图形范围内
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
      return true
    } else {
      return false
    }
  }
  collisionDetection (realSize) {
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
}
// 文字
class Text {
  constructor (drawData) {
    this.firstRender = true
    this.text = drawData.text || '超级变变变'
    // this.width = ctx.measureText(drawData.text).width
    this.h = drawData.h
    this.x = drawData.x
    this.w = null
    this.y = drawData.y
    this.fontSize = drawData.fontSize
    this.fillMethod = drawData.fillMethod
    this.color = drawData.color
    this.align = drawData.align || 'left'
    this.baseline = drawData.baseline
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.firstRender = false
    this.x = this.x * scale.x
    this.y = this.y * scale.y
    this.w = this.w * scale.x
    this.h = this.h * scale.y
  }
  createPath (ctx, sacle, realSize) {
    this.ctx = ctx
    if (this.firstRender) {
      this.calcInfo(sacle)
    }
    this.collisionDetection(realSize)
    ctx.save()
    ctx.textBaseline = this.baseline || 'normal' // normal：baseLine在文字底部，则y值为y+文字框高度
    ctx.setFontSize(this.fontSize)
    ctx.textAlign = this.align || 'left'
    ctx[this.fillMethod + 'Style'] = this.color
    ctx.closePath()
    ctx[this.fillMethod + 'Text'](this.text, this.x, this.y + this.h)
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
}
// 圆角矩形
class RoundRect {
  constructor (drawData) {
    this.firstRender = true
    this.r = drawData.r
    if (drawData.width < 2 * drawData.r) {
      this.r = drawData.width / 2
    }
    if (drawData.height < 2 * drawData.r) {
      this.r = drawData.height / 2
    }
    this.x = drawData.x || 0
    this.y = drawData.y || 0
    this.w = drawData.w
    this.h = drawData.h
    this.color = drawData.color || '#000'
    this.fillMethod = drawData.fillMethod
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.firstRender = false
    this.x = this.x * scale.x
    this.y = this.y * scale.y
    this.w = this.w * scale.x
    this.h = this.h * scale.y
    this.r = this.r * scale.x
  }
  createPath (ctx, sacle, realSize) {
    if (this.firstRender) {
      this.calcInfo(sacle)
    }
    this.collisionDetection(realSize)
    ctx.save()
    ctx[this.fillMethod + 'Style'] = this.color
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
  }
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
      return true
    } else {
      return false
    }
  }
  collisionDetection (realSize) {
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
}
// 圆形图片
class CircleImage {
  constructor (drawData) {
    this.firstRender = true
    this.x = drawData.x
    this.y = drawData.y
    this.r = drawData.r
    this.left = drawData.x
    this.top = drawData.y
    this.w = drawData.w
    this.h = drawData.h
    this.url = drawData.url
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.firstRender = false
    this.x = this.x * scale.x
    this.y = this.y * scale.y
    this.r = this.r * scale.x
  }
  createPath (ctx, sacle, realSize) {
    if (this.firstRender) {
      this.calcInfo(sacle)
    }
    this.collisionDetection(realSize)
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x + this.r, this.y + this.r, this.r, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(this.url, 0, 0, this.w, this.h, this.x, this.y, this.r * 2, this.r * 2)
    ctx.restore()
  }
  judgeRange (e) {
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    }
    let len = Math.sqrt(Math.pow(this.startPoint.x - (this.x + this.r), 2) + Math.pow(this.startPoint.y - (this.y + this.r), 2))
    if (len < this.r) {
      this.startX = this.x
      this.startY = this.y
      return true
    } else {
      return false
    }
  }
  collisionDetection (realSize) {
    // 碰撞检测
    if (this.x + this.r * 2 > realSize.w) {
      this.x = realSize.w - this.r * 2
    }
    if (this.x < 0) {
      this.x = 0
    }
    if (this.y < 0) {
      this.y = 0
    }
    if (this.y + this.r * 2 > realSize.h) {
      this.y = realSize.h - this.r * 2
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
}
export {WxCanvas, Shape}
