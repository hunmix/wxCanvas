// 爸爸类
class WxCanvas {
  constructor (canvas, config) {
    this.canvas = canvas
    this.store = new Store()
    this.info = new Info(config)
    this.canMove = false
    this.bus = new EventBus(canvas)
    this.bus.listen('update', this.update)
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
    this.draw()
    return this
  }
  draw () {
    let that = this
    this.store.store.forEach((item) => {
      item.draw(that.canvas, that.info.scale, that.info.realSize, this.bus)
    })
    this.canvas.draw()
  }
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
  touchMove (e) {
    this.isMouseMove = true
    if (this.canMove) {
      this.moveItem.move(e)
      this.draw()
    }
  }
  touchEnd (e) {
    // 点击事件回调函数
    if (this.isMouseMove === false) {
      let len = this.store.store.length
      for (let i = len - 1; i > -1; i--) {
        let shape = this.store.store[i]
        if (shape.isInShape(e) && !shape.canDragable()) {
          if (shape.eventList['click'].length > 0) {
            shape.eventList['click'].forEach((ele) => {
              ele(this)
            })
            return false
          }
        }
      }
    }
    this.canMove = false
  }
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
  // 待改--------------------------------------------------------------------------------
  // update () {
  //   this.draw()
  // }
}
// 事件总线
class EventBus {
  constructor () {
    this.eventList = []
  }
  listen (name, event) {
    console.log('listen')
    if (this.eventList.length) {
      this.eventList.forEach((ele) => {
        if (ele.name === name) {
          ele.thingsList.push(event)
          return false
        }
      })
    }
    this.eventList.push({
      name: name,
      thingsList: [event]
    })
    // console.log(this.eventList[0].thingsList[0])
  }
  emit (name) {
    console.log('emit')
    let tempArgs = arguments
    if (tempArgs.length < 1) {
      return false
    }
    var params = Array.prototype.slice.call(tempArgs, 1)
    console.log(params)
    this.eventList.forEach((ele) => {
      console.log(ele.name)
      console.log(name)
      if (ele.name === name) {
        ele.thingsList.forEach((ele) => {
          ele()
        })
      }
    })
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
    this.deleteItems = []
  }
  // 添加图形
  add (shape) {
    this.store.push(shape)
  }
  // 清空所有图形
  clear () {
    this.store = []
  }
  // 删除最后一个
  cancel () {
    if (this.store.length === 0) { return }
    let deleteItem = this.store.pop()
    this.deleteItems.push(deleteItem)
  }
  // 恢复最后一个删除的
  resume () {
    if (this.deleteItems.length === 0) { return }
    let shape = this.deleteItems.pop()
    this.store.push(shape)
  }
  // 删除特定元素
  delete (item) {
    let index = this.store.indexOf(item)
    if (index !== -1) {
      let deletedItem = this.store.splice(index, 1)[0]
      this.deleteItems.push(deletedItem)
    }
  }
}
// 图形
class Shape {
  constructor (type, drawData, dragable) {
    this.Shape = createShape[type](drawData)
    this.dragable = dragable
    this.eventList = {
      'click': []
    }
    this.bus = null
  }
  draw (ctx, scale, realSize, bus) {
    this.bus = bus
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
  bind (type, method) {
    if (this.eventList[type]) {
      this.eventList[type].push(method)
    }
  }
  clone () {
    let option = Object.assign({}, this.Shape)
    console.log(option)
    return new Shape(this.Shape.type, option, this.dragable)
  }
  updateOption (option, calcScale, dragable) {
    dragable === undefined ? this.dragable = this.dragable : this.dragable = dragable
    this.Shape.updateOption(option, calcScale)
    // this.bus.emit('update')
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
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true
    this.x = drawData.x
    this.y = drawData.y
    this.r = drawData.r
    this.color = drawData.color
    this.fillMethod = drawData.fillMethod || 'fill'
    this.offsetX = 0
    this.offsetY = 0
    this.type = 'circle'
    this.scale = drawData.scale || null
  }
  // 计算绘画数据
  calcInfo (scale) {
    // 待改---------------------------------------------------------------
    this.scale = scale
    console.log('got circle scale')
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
  updateOption (option) {
    for (let key in option) {
      switch (key) {
        case 'x':
          this.x = option.x * this.scale.x
          continue
        case 'y':
          this.y = option.y * this.scale.y
          continue
        case 'r':
          this.r = option.r * this.scale.x
          continue
      }
      this[key] = option[key]
    }
  }
}

// 矩形
class Rect {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true
    this.x = drawData.x
    this.y = drawData.y
    this.w = drawData.w
    this.h = drawData.h
    this.fillMethod = drawData.fillMethod || 'fill'
    this.color = drawData.color
    this.type = 'rect'
    this.scale = drawData.scale || null
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.scale = scale
    console.log(this)
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
  updateOption (option, calcScale) {
    for (let key in option) {
      if (calcScale) {
        switch (key) {
          case 'x':
            this.x = option.x * this.scale.x
            continue
          case 'y':
            this.y = option.y * this.scale.y
            continue
          case 'w':
            this.w = option.w * this.scale.x
            continue
          case 'h':
            this.h = option.h * this.scale.x
            continue
        }
      }
      this[key] = option[key]
    }
  }
}
// 图片
class Image {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true
    this.imgW = drawData.imgW
    this.imgH = drawData.imgH
    this.url = drawData.url
    this.x = drawData.x
    this.y = drawData.y
    this.w = drawData.w
    this.h = drawData.h
    this.type = 'image'
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
  updateOption (option, calcScale) {
    for (let key in option) {
      if (calcScale) {
        switch (key) {
          case 'x':
            this.x = option.x * this.scale.x
            continue
          case 'y':
            this.y = option.y * this.scale.y
            continue
          case 'w':
            this.w = option.w * this.scale.x
            continue
          case 'h':
            this.h = option.h * this.scale.x
            continue
        }
      }
      this[key] = option[key]
    }
  }
}
// 文字
class Text {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true
    this.text = drawData.text || '超级变变变'
    // this.width = ctx.measureText(drawData.text).width
    this.h = drawData.h
    this.x = drawData.x
    this.w = null
    this.y = drawData.y
    this.fontSize = drawData.fontSize || 14
    this.fillMethod = drawData.fillMethod
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
  updateOption (option, calcScale) {
    for (let key in option) {
      if (calcScale) {
        switch (key) {
          case 'x':
            this.x = option.x * this.scale.x
            continue
          case 'y':
            this.y = option.y * this.scale.y
            continue
          case 'h':
            this.h = option.h * this.scale.x
            continue
        }
      }
      this[key] = option[key]
    }
  }
}
// 圆角矩形
class RoundRect {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true
    this.r = drawData.r
    if (drawData.width < 2 * drawData.r) {
      this.r = drawData.width / 2
    }
    if (drawData.height < 2 * drawData.r) {
      this.r = drawData.height / 2
    }
    this.r = this.r || 0
    this.x = drawData.x || 0
    this.y = drawData.y || 0
    this.w = drawData.w
    this.h = drawData.h
    this.color = drawData.color || '#000'
    this.fillMethod = drawData.fillMethod || 'fill'
    this.type = 'roundRect'
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
  updateOption (option, calcScale) {
    for (let key in option) {
      if (calcScale) {
        switch (key) {
          case 'x':
            this.x = option.x * this.scale.x
            continue
          case 'y':
            this.y = option.y * this.scale.y
            continue
          case 'w':
            this.w = option.w * this.scale.x
            continue
          case 'h':
            this.h = option.h * this.scale.x
            continue
          case 'r':
            this.r = option.r * this.scale.x
            continue
        }
      }
      this[key] = option[key]
    }
  }
}
// 圆形图片
class CircleImage {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true
    this.x = drawData.x
    this.y = drawData.y
    this.r = drawData.r
    this.left = drawData.x
    this.top = drawData.y
    this.w = drawData.w
    this.h = drawData.h
    this.url = drawData.url
    this.type = 'circleImage'
    this.scale = drawData.scale || null
    console.log(drawData)
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
  updateOption (option) {
    for (let key in option) {
      switch (key) {
        case 'x':
          this.x = option.x * this.scale.x
          continue
        case 'y':
          this.y = option.y * this.scale.y
          continue
        case 'r':
          this.r = option.r * this.scale.x
          continue
      }
      this[key] = option[key]
    }
  }
}
export {WxCanvas, Shape}
