import {commonUtils} from './commonUtils'
// 圆形图片
class CircleImage {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true
    this.x = drawData.x || 0
    this.y = drawData.y || 0
    this.r = drawData.r || 10
    this.left = drawData.x
    this.top = drawData.y
    this.left = drawData.left
    this.right = drawData.right
    this.top = drawData.top
    this.bottom = drawData.bottom
    this.locX = drawData.locX
    this.locY = drawData.locY
    this.imgW = drawData.imgW
    this.imgH = drawData.imgH
    this.url = drawData.url
    this.type = 'circleImage'
    this.scale = drawData.scale || null
    console.log(drawData)
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.scale = scale
    this.firstRender = false
    this.x = this.x * scale.x
    this.y = this.y * scale.y
    this.r = this.r * scale.x
  }
  // 绘制路径
  createPath (ctx, sacle, realSize) {
    // if (this.firstRender) {
    //   this.calcInfo(sacle)
    // }
    // this.collisionDetection(realSize)
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x + this.r, this.y + this.r, this.r, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(this.url, 0, 0, this.imgW, this.imgH, this.x, this.y, this.r * 2, this.r * 2)
    ctx.restore()
  }
  // 判定范围
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
  // 碰撞检测
  collisionDetection (realSize) {
    this.realSize = realSize
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
  // 移动计算
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
  // 更新图形信息时候是否需要重新计算真实宽高
  updateOption (option, calcScale) {
    // 改变的数据里有xy则根据calcScale参数决定是否进行缩放计算，并将绝对定位属性置空，避免新的x,y属性失效
    // ----------------------可能会有问题-----------------------------------------------
    // 一坨方法放在commonUtils里面
    let keyArr = Object.keys(option)
    if (keyArr.length !== 0) {
      this.resetXY(keyArr)
      if (calcScale) {
        this.calcScaleValue(keyArr, option, this.scale)
      } else {
        this.calcScaleValue(keyArr, option, false)
      }
      this.getOptionValue(keyArr, option)
    }
    // 如果有left, right啥啥啥的，就重置同方向的定位属性，避免影响
    this.resetAbsoluteInfo(keyArr, option)
    // this.getAbsolutLocation(this.realSize)
    this.judgeChangeProps(this.type, this.realSize, keyArr)
  }
  // resetAbsoluteLocationInfo (option) {
  //   console.log('in reset :' + this.r)
  //   console.log('reset')
  //   if (option.left) {
  //     this.left = option.left
  //     this.right = undefined
  //     this.locX = undefined
  //   }
  //   if (option.right) {
  //     this.right = option.right
  //     this.left = undefined
  //     this.locX = undefined
  //   }
  //   if (option.top) {
  //     this.top = option.top
  //     this.bottom = undefined
  //     this.locY = undefined
  //   }
  //   if (option.bottom) {
  //     this.bottom = option.bottom
  //     this.top = undefined
  //     this.locY = undefined
  //   }
  //   if (option.locX) {
  //     this.locX = option.locX
  //     this.left = undefined
  //     this.right = undefined
  //   }
  //   if (option.locY) {
  //     this.locY = option.locY
  //     this.top = undefined
  //     this.bottom = undefined
  //   }
  //   this.getAbsolutLocation(this.realSize)
  // }
  // 根据设置方法不同设置不同参数
  // getAbsolutLocation (realSize) {
  //   let loc = null // 方向
  //   let size = null // realSize，屏幕真实宽or高
  //   let property = null // 改变x或y的值
  //   let type = null // 根据种类调用不同计算
  //   console.log(realSize)
  //   if (this.locX !== undefined) {
  //     loc = this.locX
  //     size = realSize.w
  //     property = 'x'
  //     type = 'locationX&Y'
  //     this.setLocPosition(loc, size, property, type)
  //   }
  //   if (this.locY !== undefined) {
  //     loc = this.locY
  //     size = realSize.h
  //     property = 'y'
  //     type = 'locationX&Y'
  //     this.setLocPosition(loc, size, property, type)
  //   }
  //   if (this.left !== undefined) {
  //     loc = this.left
  //     size = realSize.w
  //     property = 'x'
  //     type = 'left&top'
  //     this.setLocPosition(loc, size, property, type)
  //   }
  //   if (this.top !== undefined) {
  //     loc = this.top
  //     size = realSize.h
  //     property = 'y'
  //     type = 'left&top'
  //     this.setLocPosition(loc, size, property, type)
  //   }
  //   if (this.right !== undefined) {
  //     loc = this.right
  //     size = realSize.w
  //     property = 'x'
  //     type = 'right&bottom'
  //     this.setLocPosition(loc, size, property, type)
  //   }
  //   if (this.bottom !== undefined) {
  //     loc = this.bottom
  //     size = realSize.h
  //     property = 'y'
  //     type = 'right&bottom'
  //     this.setLocPosition(loc, size, property, type)
  //   }
  // }
  // // 计算x,y的值
  // setLocPosition (loc, size, property, type) {
  //   switch (type) {
  //     case 'locationX&Y' :
  //       if (loc === 'center') {
  //         this[property] = size / 2 - this.r
  //       } else if (typeof loc === 'number') {
  //         this[property] = loc - this.r
  //       } else if (loc.indexOf('%') !== -1) {
  //         let num = this.getPercentNum(loc)
  //         this[property] = size * num / 100 - this.r
  //       }
  //       break
  //     case 'left&top' :
  //       if (typeof loc === 'number') {
  //         this[property] = loc
  //       } else if (loc.indexOf('%') !== -1) {
  //         let num = this.getPercentNum(loc)
  //         this[property] = size * num / 100
  //       }
  //       break
  //     case 'right&bottom' :
  //       if (typeof loc === 'number') {
  //         this[property] = size - this.r * 2 - loc
  //       } else if (loc.indexOf('%') !== -1) {
  //         let num = this.getPercentNum(loc)
  //         this[property] = size - size * num / 100 - this.r * 2
  //       }
  //       break
  //   }
  // }
  // // 获取百分比的数字部分
  // getPercentNum (value) {
  //   let len = value.length
  //   console.log(Number(value.substring(0, len - 1)))
  //   return Number(value.substring(0, len - 1))
  // }
}

CircleImage.prototype = Object.assign(CircleImage.prototype, commonUtils)

export {CircleImage}
