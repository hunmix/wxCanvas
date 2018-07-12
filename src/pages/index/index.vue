<template>
  <section>
    <div class="button-box">
      <button @tap="handleBtnAdd">增加一个rect</button>
      <button @tap="handleBtnDelete">删除</button>
      <button @tap="handleBtnResume">恢复</button>
      <button @tap="handleBtnClear">清空</button>
      <button @tap="handleBtnDeleteYellowCircle">删圆</button>
    </div>
    <canvas class="canvas-cantainer"
      canvas-id="canvas" 
      :style="{width: canvasSize.width + 'px', height: canvasSize.height + 'px'}"
      @touchstart="handleTouchStart"
      @touchmove='handleTouchMove'
      @touchend='handleTouchEnd'
      @tap='handleTap'
    >
    </canvas>
    <input type="text" class="input" v-if="isShowInput" focus='true' @blur="handleBlur">
    <div class="bottom-box">
      <button @tap="handleChangeColor">变色</button>
      <button @tap="handleProgram">进度条</button>
      <button @tap="handleReset">重置</button>
      <button @tap="handleTest">保存</button>
    </div>
  </section>
</template>

<script>
import {WxCanvas, Shape} from './../../../static/wxCanvas/index'
export default {
  data () {
    return {
      // 初始设置
      config: {
        canvasWidth: 710, // 设计图canvas宽
        canvasHeight: 940, // 设计图canvas高
        uiWidth: 750, // 设计图屏幕宽
        uiHeight: 1334 // 设计图canvas屏幕高
      },
      wxCanvas: null,
      canvasSize: {
        width: null, // canvas真实宽,初始化时在wxCanvas对象上调用initCanvasInfo()获取
        height: null // canvas真实高
      },
      rectList: [],
      isShowInput: false
    }
  },
  mounted () {
    console.log('mounted')
    // let _this = this
    let ctx = wx.createCanvasContext('canvas', this)
    this.wxCanvas = new WxCanvas(ctx, this.config)
    this.canvasSize = this.wxCanvas.initCanvasInfo()
    let bg = new Shape('roundRect', {w: 710, h: 940, color: '#fff', r: 20, fillMethod: 'fill'})
    // let image = new Shape('image', {w: 710, h: 747, url: '/static/images/0.png', imgW: 710, imgH: 747})
    // let country1 = new Shape('text', {text: '德国', x: 186, y: 245, h: 34, fontSize: 18, color: '#fff', fillMethod: 'fill'})
    // let country2 = new Shape('text', {text: '巴拿马', x: 414, y: 246, h: 34, fontSize: 18, color: '#fff', fillMethod: 'fill'})
    // let score1 = new Shape('roundRect', {x: 213, y: 405, w: 106, h: 164, color: '#fff', r: 8, fillMethod: 'fill'})
    // let score2 = new Shape('roundRect', {x: 389, y: 405, w: 106, h: 164, color: '#fff', r: 8, fillMethod: 'fill'})
    // let circleImage = new Shape('circleImage', {x: 298, y: 677, r: 61, w: 200, h: 200, url: '/static/images/1.png'}, true)
    // this.text = new Shape('text', {text: '点击输入文字', fontSize: 18, x: 359.5, y: 831, h: 25.5, fillMethod: 'fill', color: '#000', align: 'center'}, true)
    // // let text2 = new Shape('text', {text: '看看谁是真正的预言家', x: 359.5, y: 856.5, h: 25.5, fillMethod: 'fill', color: '#000', align: 'center'})
    // let line = new Shape('line', {x1: 0, y1: 405, x2: 690, y2: 405, color: '#0f0', w: 10})
    this.wxCanvas.add(bg)
    // this.wxCanvas.add(image)
    // this.wxCanvas.add(country1)
    // this.wxCanvas.add(country2)
    // this.wxCanvas.add(score1)
    // this.wxCanvas.add(score2)
    // this.wxCanvas.add(circleImage)
    // this.wxCanvas.add(line)
    // this.text.bind('click', function () {
    //   console.log('click')
    //   that.isShowInput = true
    //   that.text.updateOption({text: ''}, false)
    //   that.wxCanvas.update()
    // })
    // this.wxCanvas.add(this.text)
    // ------------------------------------------------------------------------//
    let circle = new Shape('circle', {r: 60, color: 'red', fillMethod: 'fill', left: '10%', bottom: 0}, true)
    this.wxCanvas.add(circle)
    circle.bind('click', function () {
      circle.updateOption({locY: '50%', locX: '50%', r: 100}, true)
    })
    // circle.animate({r: '+100'}, 1000).start(1)
    // let circleImage = new Shape('circleImage', {r: 60, url: '/static/images/0.png', left: '10%', bottom: 0}, true)
    // this.wxCanvas.add(circleImage)
    // circleImage.bind('click', function () {
    //   circleImage.updateOption({locX: 'center', y: 0, r: 200}, true)
    //   _this.wxCanvas.update()
    //   console.log('click')
    // })
    // let rect = new Shape('rect', {w: 300, h: 300, color: 'red', locX: 'center', bottom: 0}, true)
    // this.wxCanvas.add(rect)
    // rect.bind('click', function () {
    //   rect.updateOption({right: '50%', bottom: 10, w: 100, h: 100}, true)
    //   _this.wxCanvas.update()
    //   console.log('click')
    // })
    // let image = new Shape('rect', {w: 100, h: 100, url: '/static/images/0.png', locX: 'center', bottom: 0}, true)
    // this.wxCanvas.add(image)
    // image.bind('click', function () {
    //   image.updateOption({left: 0, bottom: '50%', w: 100, h: 100}, true)
    //   _this.wxCanvas.update()
    //   console.log('click')
    // })
    // let roundRect = new Shape('roundRect', {w: 100, h: 100, r: 20, locX: 'center', bottom: 0}, true)
    // this.wxCanvas.add(roundRect)
    // roundRect.bind('click', function () {
    //   roundRect.updateOption({left: 0, bottom: 0, w: 100, h: 200}, true)
    //   _this.wxCanvas.update()
    //   console.log('click')
    // })
    // let text = new Shape('text', {text: '嘿嘿嘿', h: 30, fontSize: 12, locX: 'center', bottom: 0}, true)
    // this.wxCanvas.add(text)
    // text.bind('click', function () {
    //   text.updateOption({x: 120}, true)
    //   _this.wxCanvas.update()
    //   console.log('click')
    // })
  },
  methods: {
    // 触摸开始
    handleTouchStart (e) {
      this.wxCanvas.touchStart(e)
    },
    // 触摸移动
    handleTouchMove (e) {
      this.wxCanvas.touchMove(e)
    },
    // 触摸结束
    handleTouchEnd (e) {
      this.wxCanvas.touchEnd(e)
    },
    // 复制并增加方块
    // handleBtnAdd () {
    //   console.log(this.dadRect)
    //   let tempShape = this.dadRect.clone()
    //   let len = this.rectList.length
    //   if (len === 0) {
    //     tempShape.updateOption({x: this.dadRect.Shape.x + 55, color: '#000'}, false, false)
    //   } else {
    //     tempShape.updateOption({x: this.rectList[len - 1].Shape.x + 55, color: '#0f0'}, false, true)
    //   }
    //   this.rectList.push(tempShape)
    //   this.wxCanvas.add(tempShape)
    // },
    // 从图上删除最后一个图形
    handleBtnDelete () {
      this.wxCanvas.cancel(1)
    },
    // 从被删除的图形中恢复最后一个
    handleBtnResume () {
      this.wxCanvas.resume()
    },
    // 输入文字
    handleBlur (e) {
      let value = e.mp.detail.value
      console.log(value)
      if (value.trim() === '') {
        this.text.updateOption({text: '点击输入文字'}, false)
      } else {
        this.text.updateOption({text: value}, false)
      }
      this.wxCanvas.update()
      e.mp.detail.value = ''
      this.isShowInput = false
    },
    handleConfirm () {
      console.log('confirm')
    },
    // // 清除所有图形
    // handleBtnClear () {
    //   this.wxCanvas.clear()
    // },
    // // 删除黄色圆
    // handleBtnDeleteYellowCircle () {
    //   this.wxCanvas.delete(this.circle)
    // },
    // // 改变颜色
    // handleChangeColor () {
    //   if (this.circle.Shape.color === 'yellow') {
    //     this.circle.updateOption({color: '#000'}, false, false)
    //   } else {
    //     this.circle.updateOption({color: 'yellow'}, false, true)
    //   }
    //   this.wxCanvas.draw()
    // },
    // handleProgram () {
    //   let that = this
    //   let timer = setInterval(function () {
    //     if (that.program.Shape.w > that.canvasSize.width - 30) {
    //       clearInterval(timer)
    //       that.complete = new Shape('text', {text: '已完成', color: '#000', x: 300, y: 260, fillMethod: 'fill', h: 80, fontSize: 17})
    //       that.wxCanvas.add(that.complete)
    //     }
    //     that.program.updateOption({w: that.program.Shape.w + Math.random() * 10}, false)
    //     that.wxCanvas.draw()
    //     that.program.bind('click', function () {
    //       that.wxCanvas.delete(that.program)
    //       that.wxCanvas.delete(that.complete)
    //     })
    //   }, 30)
    // },
    // handleReset () {
    //   // this.program.updateOption({w: 0, x: 20}, true)
    //   // this.wxCanvas.delete(this.complete)
    //   this.wxCanvas.draw()
    // },
    handleTest () {
      this.wxCanvas.saveImage()
    }
  }
}
</script>

<style>
  .canvas-cantainer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    /* background: lightblue; */
  }
  .button-box{
    display: flex;
    justify-content: space-around;
  }
  .bottom-box {
    display: flex;
    justify-content: space-around;
    position: absolute;
    bottom: 10rpx;
    width: 100%;

  }
  button{
    background: lightblue;
    display: block;
    width: 150rpx;
    height: 100rpx;
    line-height: 100rpx;
  }
  .input{
    display: block;
    position: absolute;
    bottom: 200rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 220rpx;
    /* background: #000; */
    margin: 0 auto;
  }
</style>
