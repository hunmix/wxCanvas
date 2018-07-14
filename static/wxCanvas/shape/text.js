// 文字
class Text {
  constructor (drawData) {
    console.log(drawData)
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true
    this.text = drawData.text || '超级变变变'
    // this.width = ctx.measureText(drawData.text).width
    this.h = drawData.h
    this.x = drawData.x || 0
    this.w = null
    this.y = drawData.y || 0
    this.locX = drawData.locX
    this.locY = drawData.locY
    this.left = drawData.left
    this.right = drawData.right
    this.top = drawData.top
    this.bottom = drawData.bottom
    this.fontSize = drawData.fontSize || 14
    this.fillMethod = drawData.fillMethod || 'fill'
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
  // 绘制路径
  createPath (ctx, sacle, realSize) {
    console.log(this.y)
    this.ctx = ctx
    // if (this.firstRender) {
    //   this.calcInfo(sacle)
    // }
    // this.collisionDetection(realSize)
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
    this.realSize = realSize
    switch (this.align) {
      case 'center':
        this.leftX = this.x - this.w / 2
        if (this.leftX < 0) {
          this.x = this.w / 2
        }
        if (this.leftX + this.w > realSize.w) {
          this.x = realSize.w - this.w / 2
        }
        break
      case 'left':
        this.leftX = this.x
        this.leftX = this.x - this.w / 2
        if (this.leftX < 0) {
          this.x = 0
        }
        if (this.x + this.w > realSize.w) {
          this.x = realSize.w - this.w
        }
        break
      case 'right':
        this.leftX = this.x - this.w
        if (this.leftX < 0) {
          this.x = this.w
        }
        if (this.x > realSize.w) {
          this.x = realSize.w
        }
        break
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
  // 更新图形信息时候是否需要重新计算真实宽高
  updateOption (option, calcScale) {
    for (let key in option) {
      switch (key) {
        case 'x':
          this.x = option.x * this.scale.x
          this.locX = undefined
          this.left = undefined
          this.right = undefined
          break
      }
      if (calcScale) {
        switch (key) {
          case 'x':
            this.x = option.x * this.scale.x
            break
          case 'y':
            this.y = option.y * this.scale.y
            break
          case 'h':
            this.h = option.h * this.scale.x
            break
          default:
            this[key] = option[key]
        }
      } else {
        this[key] = option[key]
      }
      this.resetAbsoluteLocationInfo(option)
    }
  }
  resetAbsoluteLocationInfo (option) {
    if (option.left) {
      this.left = option.left
      this.right = undefined
      this.locX = undefined
    }
    if (option.right) {
      this.right = option.right
      this.left = undefined
      this.locX = undefined
    }
    if (option.top) {
      this.top = option.top
      this.bottom = undefined
      this.locY = undefined
    }
    if (option.bottom) {
      this.bottom = option.bottom
      this.top = undefined
      this.locY = undefined
    }
    if (option.locX) {
      this.locX = option.locX
      this.left = undefined
      this.right = undefined
    }
    if (option.locY) {
      this.locY = option.locY
      this.top = undefined
      this.bottom = undefined
    }
    this.getAbsolutLocation(this.realSize)
  }
  getAbsolutLocation (realSize) {
    if (this.locX !== undefined) {
      this.align = 'center'
      if (this.locX === 'center') {
        this.x = realSize.w / 2
      } else if (typeof this.locX === 'number') {
        this.x = this.locX
      } else if (this.locX.indexOf('%') !== -1) {
        let num = this.getPercentNum(this.locX)
        this.x = realSize.w * num / 100
      }
    }
    if (this.locY !== undefined) {
      if (this.locY === 'center') {
        this.y = realSize.h / 2 - this.h / 2
      } else if (typeof this.locY === 'number') {
        this.y = this.locY - this.h / 2
      } else if (this.locY.indexOf('%') !== -1) {
        let num = this.getPercentNum(this.locY)
        this.y = realSize.h * num / 100 - this.h / 2
      }
    }
    if (this.left !== undefined) {
      this.align = 'left'
      if (typeof this.left === 'number') {
        this.x = this.left
      } else if (this.left.indexOf('%') !== -1) {
        let num = this.getPercentNum(this.left)
        this.x = realSize.w * num / 100
      }
    }
    if (this.right !== undefined) {
      this.align = 'right'
      if (typeof this.right === 'number') {
        this.x = realSize.w - this.right
        console.log(this.x)
      } else if (this.right.indexOf('%') !== -1) {
        let num = this.getPercentNum(this.right)
        this.x = realSize.w - realSize.w * num / 100
      }
    }
    if (this.top !== undefined) {
      if (typeof this.top === 'number') {
        this.y = this.top
      } else if (this.top.indexOf('%') !== -1) {
        let num = this.getPercentNum(this.top)
        this.y = realSize.h * num / 100
      }
    }
    if (this.bottom !== undefined) {
      if (typeof this.bottom === 'number') {
        this.y = realSize.h - this.bottom - this.h
      } else if (this.bottom.indexOf('%') !== -1) {
        let num = this.getPercentNum(this.bottom)
        this.y = realSize.h - realSize.h * num / 100 - this.h
      }
    }
  }
  // 获取百分比的数字部分
  getPercentNum (value) {
    let len = value.length
    console.log(Number(value.substring(0, len - 1)))
    return Number(value.substring(0, len - 1))
  }
}

export {Text}
