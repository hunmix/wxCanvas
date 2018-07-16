export const commonUtils = {
  // 有xy的话则重置loc,left,right等等的值，避免更新x,y值时失效
  resetXY: function (keyArr) {
    // 只获取x,y的数组
    const arr = keyArr.filter(key => {
      return key === 'x' || key === 'y'
    })
    // 没有x,y直接返回
    if (arr.length === 0) return false
    const _this = this
    // 遍历数组初始化各种值
    arr.forEach(key => {
      resetPropsList[key].forEach(propName => {
        _this[propName] = undefined
      })
    })
  },
  // 属性计算
  calcScaleValue: function (keyArr, option, scale) {
    const _this = this
    const arr = keyArr.filter(key => {
      return ['x', 'y', 'h', 'w', 'r'].indexOf(key) !== -1
    })
    if (arr.length === 0) return false
    if (scale) {
      arr.forEach((key, index) => {
        let scaleKey = propsToSacle[key]
        _this[key] = option[key] * scale[scaleKey]
      })
    } else {
      arr.forEach(key => {
        _this[key] = option[key]
      })
    }
  },
  // 非计算属性
  getOptionValue: function (keyArr, option) {
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
  resetAbsoluteInfo: function (keyArr, option) {
    const _this = this
    let arr = keyArr.filter(key => {
      return ['left', 'right', 'top', 'bottom', 'locX', 'locY'].indexOf(key) !== -1
    })
    if (arr.length === 0) return false
    arr.forEach(key => {
      let resetAbsolutePropsArr = resetAbsoluteProps[key]
      _this[key] = option[key]
      resetAbsolutePropsArr.forEach(key => {
        _this[key] = undefined
        console.log('key' + ' : ' + _this[key])
      })
    })
  }
}
const resetPropsList = {
  'x': ['locX', 'left', 'right'],
  'y': ['locY', 'top', 'bottom']
}
const propsToSacle = {
  'x': 'x',
  'y': 'y',
  'r': 'x',
  'w': 'x',
  'h': 'y'
}
const resetAbsoluteProps = {
  'left': ['right', 'locX'],
  'right': ['left', 'locX'],
  'top': ['bottom', 'locY'],
  'bottom': ['top', 'locY'],
  'locX': ['left', 'right'],
  'locY': ['top', 'bottom']
}
