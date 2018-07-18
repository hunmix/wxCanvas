import {Circle} from './circle'
import {CircleImage} from './circleImage'
import {Image} from './image'
import {Line} from './line'
import {Rect} from './rect'
import {RoundRect} from './roundRect'
import {Text} from './text'
import {AnimationControl} from '../animation/animationControl'
import { EventBus } from '../eventBus/eventBus'
import {drawAnimationStep} from '../animation/calcFunction'
import {calcColorChange} from '../animation/calcColorChange'
// 图形
class Shape {
  constructor (type, drawData, dragable) {
    this.Shape = createShape[type](drawData)
    this.dragable = dragable
    this.watch = new AnimationControl()
    this._bus = new EventBus()
    this.animationStore = []
    this.completeAnimationStore = []
    this.eventList = {
      'click': [],
      'longpress': []
    }
  }
  draw (ctx, scale, realSize) {
    this.scale = scale
    this.realSize = realSize
    // 判断是否是第一次计算比例
    if (this.isNeedCalcRatio()) {
      let keyArr = Object.keys(this.Shape)
      this.Shape.calcInfo(scale)
      // 最后一个参数用来判断是否是第一次调用
      this.Shape.judgeChangeProps(this.Shape.type, realSize, keyArr)
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
    return new Shape(this.Shape.type, option, this.dragable)
  }
  updateOption (option, calcScale, dragable) {
    dragable === undefined ? this.dragable = this.dragable : this.dragable = dragable
    this.Shape.updateOption(option, calcScale)
    this.bus.emit('update')
  }
  // 将动画信息存到animationStore
  animate (option, duration = 1000) {
    console.log('duration')
    this.animationStore.push([option, duration])
    return this
  }
  start (loopTime, calcScale) {
    // 动画时禁止拖动, 这边可以放到watch里面，后面再改- -
    const tempDragable = this.dragable
    this.dragable = false
    let _this = this
    this.watch.running = true // 动画开始
    this.watch.setLoop(loopTime) // 设置循环次数
    this.watch.setStartTime() // 设置开始时间
    this.startOption = Object.assign({}, this.Shape) // 记录初始值
    console.log(this.startOption)
    function stepAnimation () { // 递归实现动画循环
      drawAnimationStep(stepAnimation)
      if (_this.watch.isRunning()) {
        _this._updateStep()
      } else {
        _this.dragable = tempDragable
      }
    }
    stepAnimation()
  }
  stop () {
    this.watch.stop()
  }
  // 没试过的-------------------------------------------------
  clearAnimation () {
    this.watch.stop()
    this.animationStore = []
    this.completeAnimationStore = []
  }
  // 更新动画
  _updateStep () {
    console.log(this.animationStore)
    let _this = this
    let goesByTime = this.watch.getGoesbyTime()
    let nowAnimation = this.animationStore[0]
    let duration = nowAnimation[1]
    let animationInfo = nowAnimation[0]
    let option = this._calcAnimationInfo(animationInfo, duration) // 处理动画数据，每一步动画移动的坐标, 处理数据都在里面
    this.updateOption(option)
    // 是否结束动画
    if (goesByTime >= duration) {
      console.log('-------------------超帅的step分割线--------------------')
      let completeAnimation = this.animationStore.shift()
      this.completeAnimationStore.push(completeAnimation)
      // 惊了，忘记是干嘛的了，大概是克隆了一份Shape的值，防止引用型变量被篡改
      this.tempOption = Object.assign({}, this.Shape)
      _this.watch.setStartTime()
      if (this.animationStore.length === 0) {
        // 循环是否结束，没结束则将已完成的动画push到animationStore再画一遍
        // 添加一个函数来判断， 过会改
        if (_this.watch.loop === true || --_this.watch.loop > 0) {
          this.updateOption(this.startOption) // 重新循环时重置初始属性
        } else if (--_this.watch.loop <= 0) {
          // 用_this.watch.stop()， 过会改
          _this.watch.running = false
        }
        // 把已完成动画扔回去，以便下一次start可以用
        this.completeAnimationStore.forEach((animationInfo) => {
          this.animationStore.push(animationInfo)
        })
        // 已完成动画置空
        this.completeAnimationStore = []
        // 中间点置空
        this.tempOption = null
      }
    }
  }

  /** 计算动画过程中变化的属性返回计算后的值
   * @param {Object} option 更改的属性
   * @param {Number} duration 动画持续时间
   * @returns {Object} 计算后的属性合集，扔在一个对象里面返回
   * @memberof Shape
   */
  _calcAnimationInfo (option, duration) {
    let _this = this
    let nowOption = {}
    let keys = Object.keys(option)
    keys.forEach((key) => {
      const goesbyRatio = _this.watch.getGoesbyTime() / duration
      const startValue = _this.tempOption ? _this.tempOption[key] : _this.startOption[key]
      // 颜色和距离宽高变动分开算
      if (key === 'color') {
        console.log(option[key])
        const rgbColor = calcColorChange(option[key], goesbyRatio, startValue)
        nowOption[key] = rgbColor
        // console.log(rgbColor)
      } else {
        const changedValue = _this._judgePositionMethod(option[key], goesbyRatio, startValue)
        nowOption[key] = changedValue
      }
    })
    console.log(nowOption)
    return nowOption
  }
  // 添加getCenterPosition方法获取原来中心点坐标在计算，一个想法，记录一哈
  /** 判断位置属性的改变方式计算出变更的单个属性值, 暂时只支持改变x, y的动画
   * @param {*} animationInfo 改变的属性值
   * @param {Number} goesbyRatio 经过的时间和动画持续时间的比值
   * @param {*} startValue shape初始状态，即初始属性，改变的属性相对初始属性变化
   * @returns 改变之后的单个属性值
   * @memberof Shape
   */
  _judgePositionMethod (animationInfo, goesbyRatio, startValue) {
    let num = null
    let changedLen = null
    if (typeof animationInfo === 'number') {
      changedLen = (animationInfo - startValue) * goesbyRatio
    } else if (animationInfo.indexOf('+') !== -1 || animationInfo.indexOf('-') !== -1) {
      num = this._getNumber(animationInfo)
      changedLen = num * goesbyRatio
    }
    // 本次要画的值
    const changedValue = startValue + changedLen
    return changedValue
  }
  // 获取属性数值，和图形方法重复了，待提取,卧槽用的地方好多啊= =再缓缓
  _getNumber (animationInfo) {
    let pattern = /[-+]\d*/
    return Number(animationInfo.match(pattern)[0])
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
