import {commonUtils} from './commonUtils'
// 选中边框
class BorderFrame {
  constructor (drawData) {
    drawData.firstRender = false
    this.x = drawData.x || 0
    this.y = drawData.y || 0
    this.w = drawData.w
    this.h = drawData.h
    if (drawData.r) {
      this.w = drawData.r * 2
      this.h = drawData.r * 2
    }
    // this.left = drawData.left
    // this.right = drawData.right
    // this.top = drawData.top
    // this.bottom = drawData.bottom
    // this.locX = drawData.locX
    // this.locY = drawData.locY
    // this.fillMethod = drawData.fillMethod || 'fill'
    this.fillMethod = 'stroke'
    this.color = '#80cef5'
    // this.color = drawData.color
    this.type = 'borderFrame'
    this.scale = drawData.scale || null
    // -----------------------
    this.dragable = true
    this.rectsInfo = []
    this.distance = 5
    this.len = this.distance * 2
  }
  // 计算绘画数据
  calcInfo (scale) {
    console.log('scale')
    this.scale = scale
    this.firstRender = false
    this.x = this.x * scale.x
    this.y = this.y * scale.y
    this.w = this.w * scale.x
    this.h = this.h * scale.y
  }
  // 绘制路径
  createPath (ctx) {
    ctx.save()
    ctx.beginPath()
    ctx[this.fillMethod + 'Style'] = this.color
    ctx[this.fillMethod + 'Rect'](this.x, this.y, this.w, this.h)
    this._drawPoint(ctx)
    this._drawLine(ctx)
    this._drawCircle(ctx)
    ctx.closePath()
    ctx.restore()
  }
  _drawPoint (ctx) {
    const _this = this
    this._calcPointsPosition()
    console.log(this.rectsInfo)
    this.rectsInfo.forEach(point => {
      ctx.beginPath()
      ctx.strokeStyle = 'lightblue'
      ctx.fillStyle = point.activeColor || '#fff'
      ctx.fillRect(point.x, point.y, _this.len, _this.len)
      ctx.strokeRect(point.x, point.y, _this.len, _this.len)
      ctx.closePath()
    })
  }
  _calcPointsPosition () {
    console.log('in borderFrame :' + this.w)
    const pointLeftTop = {
      x: this.x - this.distance,
      y: this.y - this.distance,
      color: this.color
    }
    const pointRightTop = {
      x: this.x + this.w - this.distance,
      y: this.y - this.distance,
      color: this.color
    }
    const pointRightBottom = {
      x: this.x + this.w - this.distance,
      y: this.y + this.h - this.distance,
      color: this.color
    }
    const pointLeftBottom = {
      x: this.x - this.distance,
      y: this.y + this.h - this.distance,
      color: this.color
    }
    this.rectsInfo = [pointLeftTop, pointRightTop, pointRightBottom, pointLeftBottom]
  }
  _drawLine (ctx) {
    const lineOption = {
      x1: this.x + this.w / 2,
      y1: this.y,
      x2: this.x + this.w / 2,
      y2: this.y - 15
    }
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.moveTo(lineOption.x1, lineOption.y1)
    ctx.lineTo(lineOption.x2, lineOption.y2)
    ctx.stroke()
    ctx.closePath()
  }
  _drawCircle (ctx) {
    const circleOption = {
      x: this.x + this.w / 2,
      y: this.y - 20,
      r: this.len / 2
    }
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.strokeStyle = this.color
    ctx.arc(circleOption.x, circleOption.y, circleOption.r, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fill()
    ctx.closePath()
  }
  judgeRange (e) {
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    }
    // console.log('judge borderFrame range ')
    const _this = this
    const judgeInfo = []
    this.rectsInfo.forEach(rectInfo => {
      // 增加实际可点击范围，视图不变，不然根本点不着好吧= =
      judgeInfo.push({x: rectInfo.x - _this.len, y: rectInfo.y - _this.len, rightX: rectInfo.x + _this.len * 2, bottomY: rectInfo.y + _this.len * 2})
    })
    // console.log(judgeInfo)
    return judgeInfo.some((rectInfo, index) => {
      const isInCurrentRect = this.startPoint.x > rectInfo.x && this.startPoint.x < rectInfo.rightX && this.startPoint.y < rectInfo.bottomY && this.startPoint.y > rectInfo.y
      if (isInCurrentRect) {
        _this.startX = this.x
        _this.startY = this.y
        _this.rectsInfo[index].activeColor = 'lightblue'
        _this.movePoint = index
        console.log(index)
        console.log(_this.rectsInfo)
      }
      _this.rectsInfo[index].activeColor = '#fff'
      return isInCurrentRect
    })
  }
  getMovePointIndex () {
    return this.movePoint
  }
  collisionDetection (realSize) {
    const len = 5
    this.realSize = realSize
    // 碰撞检测
    if (this.x < 0) {
      this.x = -len
    }
    if (this.x + this.w > realSize.w) {
      this.x = realSize.w - this.w + len
    }
    if (this.y < 0) {
      this.y = -len
    }
    if (this.y + this.h > realSize.h) {
      this.y = realSize.h - this.h + len
    }
  }
  move (e) {
    // do nothing
  }
  // 更新自适应属性数据x,y,r,w,h等，直接更新or动画调用
  updateOption (option, calcScale) {
    // ----------------------可能会有问题-----------------------------------------------
    // let keyArr = Object.keys(option)
    // if (keyArr.length !== 0) {
    //   this.resetXY(keyArr)
    //   if (calcScale) {
    //     this.calcScaleValue(keyArr, option, this.scale)
    //   } else {
    //     this.calcScaleValue(keyArr, option, false)
    //   }
    //   this.getOptionValue(keyArr, option)
    // }
    // // 如果有left, right啥啥啥的，就重置同方向的定位属性，避免影响
    // this.resetAbsoluteInfo(keyArr, option)
    // this.judgeChangeProps(this.type, this.realSize, keyArr)
  }
}
BorderFrame.prototype = Object.assign(BorderFrame.prototype, commonUtils)
export {BorderFrame}
