// import {Matrix} from './../matrix/matrix'
import {Point} from './point'
const commonUtils = {
  // 有xy的话则重置loc,left,right等等的值，避免更新x,y值时失效
  resetXY (keyArr) {
    // 只获取x,y的数组
    const arr = keyArr.filter(key => {
      return key === 'x' || key === 'y'
    })
    // 没有x,y直接返回
    if (arr.length === 0) return false
    const _this = this
    // 遍历数组初始化各种值
    arr.forEach(key => {
      resetInfo.resetPropsList[key].forEach(propName => {
        _this[propName] = undefined
      })
    })
  },
  // 属性计算
  calcScaleValue (keyArr, option, scale) {
    const _this = this
    const arr = keyArr.filter(key => {
      return ['x', 'y', 'h', 'w', 'r'].indexOf(key) !== -1
    })
    if (arr.length === 0) return false
    if (scale) {
      arr.forEach((key, index) => {
        let scaleKey = resetInfo.propsToSacle[key]
        _this[key] = option[key] * scale[scaleKey]
      })
    } else {
      arr.forEach(key => {
        _this[key] = option[key]
      })
    }
  },
  // 非计算属性
  getOptionValue (keyArr, option) {
    // 除去计算属性
    const arr = keyArr.filter(key => {
      return ['x', 'y', 'h', 'w', 'r'].indexOf(key) === -1
    })
    const _this = this
    arr.forEach(key => {
      _this[key] = option[key]
    })
  },
  // 重置x,y
  resetAbsoluteInfo (keyArr, option) {
    const _this = this
    let arr = keyArr.filter(key => {
      return resetInfo.props.indexOf(key) !== -1
    })
    if (arr.length === 0) return false
    arr.forEach(key => {
      let resetAbsolutePropsArr = resetInfo.resetAbsoluteProps[key]
      _this[key] = option[key]
      resetAbsolutePropsArr.forEach(key => {
        _this[key] = undefined
        console.log('key' + ' : ' + _this[key])
      })
    })
  },
  // calcType 按哪种类型的图形计算位置
  // shapeProps 拥有哪些属性
  // arr 筛选进行更改的位置属性
  judgeChangeProps (type, realSize, keyArr) {
    const _this = this
    let option = null
    let calcType = getCalcProps.getShapeType[type]
    const shapeProps = getCalcProps[calcType]
    let arr = keyArr.filter(key => {
      return (resetInfo.props.indexOf(key) !== -1) && (_this[key] !== undefined)
    })
    console.log(arr)
    if (arr.length === 0) { return false }
    arr.forEach(loc => {
      // 注意引用变量！！！！！！
      option = Object.assign({}, shapeProps[loc])
      console.log(shapeProps)
      console.log(option)
      option.loc = _this[option.loc]
      option.size = realSize[option.size]
      console.log(_this)
      console.log(option)
      calcPositionShape[calcType](option, _this)
    })
  },
  handleTransform (ctx, transformInfo) {
    console.log(`handleTransform : ${transformInfo.rotate}`)
    transformInfo.scale && this._scaleTransform(ctx, transformInfo.scale)
    // transformInfo.rotate && this._rotateTransform(ctx, transformInfo.rotate)
  },
  _scaleTransform (ctx, scaleInfo) {
    console.log(scaleInfo)
    let halfW = null
    let halfH = null
    const type = getCalcProps.getShapeType[this.type]
    if (type === 'circle') {
      halfW = this.r
      halfH = this.r
    } else {
      halfW = this.w / 2
      halfH = this.h / 2
    }
    const center = {
      x: (this.x + halfW) * (1 - scaleInfo.x),
      y: (this.y + halfH) * (1 - scaleInfo.y)
    }
    this.translateInfo = {
      center,
      scaleInfo
    }
    // ctx.translate(center.x, center.y)
    // ctx.scale(scaleInfo.x, scaleInfo.y)
    console.log(center.x, center.y)
    console.log(scaleInfo)
  },
  _rotateTransform (ctx, rotateInfo) {
    // wxDraw Point.js
    console.log('_rotateTransform')
    let halfW = null
    let halfH = null
    const type = getCalcProps.getShapeType[this.type]
    if (type === 'circle') {
      halfW = this.r
      halfH = this.r
    } else {
      halfW = this.w / 2
      halfH = this.h / 2
    }
    const center = {
      x: this.x + halfW,
      y: this.y + halfH
    }
    console.log(center)
    const points = [
      [this.x, this.y],
      [this.x + this.w, this.y],
      [this.x + this.w, this.y + this.h],
      [this.x, this.y + this.h]
    ]
    const newPoints = []
    points.forEach(point => {
      newPoints.push(new Point(point[0], point[1]).rotate(center, rotateInfo))
    })
    console.log(newPoints)
    this.rotateInfo = {
      center: [center.x, center.y],
      rad: rotateInfo * Math.PI / 180
    }
    // Matrix测试 :
    // const changeMatrix = new Matrix([
    //   [-50],
    //   [-50]
    // ])
    // const rotateMatrix = new Matrix([
    //   [Math.cos(180 * Math.PI / 180), -Math.sin(180 * Math.PI / 180)],
    //   [Math.sin(180 * Math.PI / 180), Math.cos(180 * Math.PI / 180)]
    // ])
    // const originMatrix = new Matrix([
    //   [50],
    //   [50]
    // ])
    // console.log(rotateMatrix.multi(changeMatrix).add(originMatrix).matrixArray)
    // ctx.translate(center.x, center.y)
    // ctx.rotate(rotateInfo)
    // ctx.translate(-center.x, -center.y)
  },
  restProps (transformInfo) {
    if (transformInfo.scale) {
      // 没有scale为null时报错，写了rotate一起改
      let halfW = null
      let halfH = null
      const type = getCalcProps.getShapeType[this.type]
      if (type === 'circle') {
        halfW = this.r
        halfH = this.r
      } else {
        halfW = this.w / 2
        halfH = this.h / 2
      }
      const changedLen = {
        w: halfW * transformInfo.scale.x,
        h: halfH * transformInfo.scale.y
      }
      const centerPoint = {
        x: this.x + halfW,
        y: this.y + halfH
      }
      // 根据align设置x
      if (type === 'text') {
        switch (this.align) {
          case 'right':
            centerPoint.x = this.x - halfW
            this.x = centerPoint.x + changedLen.w
            break
          case 'center':
            centerPoint.x = this.x
            break
        }
      } else {
        this.x = centerPoint.x - changedLen.w
        this.y = centerPoint.y - changedLen.h
      }
      this.centerPoint = centerPoint
      if (type === 'circle') {
        this.r = this.r * transformInfo.scale.x
      } else if (type === 'text') {
        this.h = this.h * transformInfo.scale.y
        // XXXXXXXXXXXXXXXXXXXXXXXXXXX
        this.w = this.ctx.measureText(this.text).width * transformInfo.scale.x
        this.fontSize = this.fontSize * transformInfo.scale.x
      } else {
        this.w = this.w * transformInfo.scale.x
        this.h = this.h * transformInfo.scale.y
      }
    } else {
      console.log('reset rotate')
    }
  }
}
// 各种查询表
const resetInfo = {
  props: ['left', 'right', 'top', 'bottom', 'locX', 'locY'],
  resetPropsList: {
    'x': ['locX', 'left', 'right'],
    'y': ['locY', 'top', 'bottom']
  },
  propsToSacle: {
    'x': 'x',
    'y': 'y',
    'r': 'x',
    'w': 'x',
    'h': 'y'
  },
  resetAbsoluteProps: {
    'left': ['right', 'locX'],
    'right': ['left', 'locX'],
    'top': ['bottom', 'locY'],
    'bottom': ['top', 'locY'],
    'locX': ['left', 'right'],
    'locY': ['top', 'bottom']
  }
}
const getCalcProps = {
  getShapeType: {
    'circle': 'circle',
    'circleImage': 'circle',
    'rect': 'rect',
    'roundRect': 'rect',
    'image': 'rect',
    'text': 'text'
  },
  'rect': {
    'locX': {
      'loc': 'locX',
      'size': 'w',
      'property': 'x',
      'rectProperty': 'w',
      'type': 'locationX&Y'
    },
    'locY': {
      'loc': 'locY',
      'size': 'h',
      'property': 'y',
      'rectProperty': 'h',
      'type': 'locationX&Y'
    },
    'left': {
      'loc': 'left',
      'size': 'w',
      'property': 'x',
      'rectProperty': 'w',
      'type': 'left&top'
    },
    'top': {
      'loc': 'top',
      'size': 'h',
      'property': 'y',
      'rectProperty': 'h',
      'type': 'left&top'
    },
    'right': {
      'loc': 'right',
      'size': 'w',
      'property': 'x',
      'rectProperty': 'w',
      'type': 'right&bottom'
    },
    'bottom': {
      'loc': 'bottom',
      'size': 'h',
      'property': 'y',
      'rectProperty': 'h',
      'type': 'right&bottom'
    }
  },
  'circle': {
    'locX': {
      'loc': 'locX',
      'size': 'w',
      'property': 'x',
      'type': 'locationX&Y'
    },
    'locY': {
      'loc': 'locY',
      'size': 'h',
      'property': 'y',
      'type': 'locationX&Y'
    },
    'left': {
      'loc': 'left',
      'size': 'w',
      'property': 'x',
      'type': 'left&top'
    },
    'top': {
      'loc': 'top',
      'size': 'h',
      'property': 'y',
      'type': 'left&top'
    },
    'right': {
      'loc': 'right',
      'size': 'w',
      'property': 'x',
      'type': 'right&bottom'
    },
    'bottom': {
      'loc': 'bottom',
      'size': 'h',
      'property': 'y',
      'type': 'right&bottom'
    }
  },
  'text': {
    'locX': {
      'loc': 'locX',
      'size': 'w',
      'property': 'x',
      'type': 'locX'
    },
    'locY': {
      'loc': 'locY',
      'size': 'h',
      'property': 'y',
      'type': 'locY'
    },
    'left': {
      'loc': 'left',
      'size': 'w',
      'property': 'x',
      'type': 'left'
    },
    'right': {
      'loc': 'right',
      'size': 'w',
      'property': 'x',
      'type': 'right'
    },
    'top': {
      'loc': 'top',
      'size': 'h',
      'property': 'y',
      'type': 'top'
    },
    'bottom': {
      'loc': 'bottom',
      'size': 'h',
      'property': 'y',
      'type': 'bottom'
    }
  }
}
const calcPositionShape = {
  'rect': function (option, _this) {
    const {loc, size, property, rectProperty, type} = option
    switch (type) {
      case 'locationX&Y' :
        if (loc === 'center') {
          _this[property] = size / 2 - _this[rectProperty] / 2
        } else if (typeof loc === 'number') {
          _this[property] = loc - _this[rectProperty] / 2
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc)
          _this[property] = size * num / 100 - _this[rectProperty] / 2
        }
        break
      case 'left&top' :
        if (typeof loc === 'number') {
          _this[property] = loc
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc)
          _this[property] = size * num / 100
        }
        break
      case 'right&bottom' :
        if (typeof loc === 'number') {
          _this[property] = size - _this[rectProperty] - loc
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc)
          _this[property] = size - size * num / 100 - _this[rectProperty]
        }
        break
    }
  },
  'circle': function (option, _this) {
    let {loc, size, property, type} = option
    switch (type) {
      case 'locationX&Y' :
        if (loc === 'center') {
          _this[property] = size / 2 - _this.r
        } else if (typeof loc === 'number') {
          _this[property] = loc - _this.r
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc)
          _this[property] = size * num / 100 - _this.r
        }
        break
      case 'left&top' :
        if (typeof loc === 'number') {
          _this[property] = loc
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc)
          _this[property] = size * num / 100
        }
        break
      case 'right&bottom' :
        if (typeof loc === 'number') {
          _this[property] = size - _this.r * 2 - loc
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc)
          _this[property] = size - size * num / 100 - _this.r * 2
        }
        break
    }
  },
  'text': function (option, _this) {
    let {loc, size, property, type} = option
    switch (type) {
      case 'locX' :
        _this.align = 'center'
        if (loc === 'center') {
          _this[property] = size / 2
        } else if (typeof loc === 'number') {
          _this[property] = loc
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc)
          _this[property] = size * num / 100
        }
        break
      case 'locY' :
        if (loc === 'center') {
          _this[property] = size / 2 - _this.h / 2
        } else if (typeof loc === 'number') {
          _this[property] = loc - _this.h / 2
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc)
          _this[property] = size * num / 100 - _this.h / 2
        }
        break
      case 'left' :
        _this.align = 'left'
        if (typeof loc === 'number') {
          _this[property] = loc
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc)
          _this[property] = size * num / 100
        }
        break
      case 'right' :
        _this.align = 'right'
        if (typeof loc === 'number') {
          _this[property] = size - loc
          console.log(_this[property])
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc)
          _this[property] = size - size * num / 100
        }
        break
      case 'top' :
        if (typeof loc === 'number') {
          _this[property] = loc
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc)
          _this[property] = size * num / 100
        }
        break
      case 'bottom' :
        if (typeof loc === 'number') {
          _this[property] = size - loc - _this.h
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc)
          _this[property] = size - size * num / 100 - _this.h
        }
        break
    }
  },
  // 获取百分比的数字部分
  _getPercentNum (value) {
    let len = value.length
    console.log(Number(value.substring(0, len - 1)))
    return Number(value.substring(0, len - 1))
  }
}
function extendsCommonMethods (prototype, commonUtils) {
  for (const key in commonUtils) {
    prototype[key] = commonUtils[key]
  }
}
export {
  commonUtils,
  getCalcProps,
  extendsCommonMethods
}
