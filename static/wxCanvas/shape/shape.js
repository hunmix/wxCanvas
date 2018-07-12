import {Circle} from './circle'
import {CircleImage} from './circleImage'
import {Image} from './image.js'
import {Line} from './line'
import {Rect} from './rect'
import {RoundRect} from './roundRect'
import {Text} from './text'
import {Animation} from './../animation/animation'
// 图形
class Shape {
  constructor (type, drawData, dragable) {
    this.Shape = createShape[type](drawData)
    this.dragable = dragable
    this.animation = new Animation()
    this.eventList = {
      'click': [],
      'longpress': []
    }
  }
  draw (ctx, scale, realSize) {
    // 判断是否是第一次计算比例
    if (this.isNeedCalcRatio()) {
      this.Shape.calcInfo(scale)
      this.Shape.getAbsolutLocation(realSize)
    }
    // 碰撞判定
    this.Shape.collisionDetection(realSize)
    // 绘制路径
    this.Shape.createPath(ctx)
  }
  isNeedCalcRatio () {
    return this.Shape.firstRender
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
    console.log('bind')
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
    this.bus.emit('update')
  }
  animate (option, duration) {
    console.log('animate')
    this.animation.add(option, duration)
    return this
  }
  start (num) {
    this._beginAnimation()
  }
  _beginAnimation (duration) {
    let _this = this
    this.animation.animationStore.forEach(function (value) {
      let option = value[0]
      let duration = value[1]
      let num = 1
      let startTime = new Date().getTime()
      let timer = setInterval(function () {
        let animationOption = _this._calcAnimationInfo(option, duration, num)
        _this.updateOption(animationOption)
        num++
        if ((new Date().getTime() - startTime) >= duration) {
          clearInterval(timer)
          console.log('time end')
        }
      }, 30)
    })
  }
  _calcAnimationInfo (option, duration, num) {
    let pattern = /[+-]\d*/
    for (let key in option) {
      switch (key) {
        case 'r' :
          let value = option[key]
          if (isNaN(value)) {
            value = Number(value.match(pattern))
          }
          let oldR = this.Shape.r || 0
          let step = value / 1000 * 30
          option.r = oldR + step * num
          console.log(option.r)
          break
      }
    }
    return option
    // let num = Number(string.match(pattern))
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
  },
  'line': function (drawData) {
    return new Line(drawData)
  }
}

export {Shape}
