<template>
  <section>
    <div class="button-box">
      <button @tap="handleBtnAdd">增加一个rect</button>
      <button @tap="handleBtnDelete">删除</button>
      <button @tap="handleBtnResume">恢复</button>
      <button @tap="handleBtnClear">清空</button>
      <button @tap="handleBtnDeleteYellowCircle">改圆</button>
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
import {WxCanvas, Shape} from './../../../static/wxCanvas/index.js'
// import {WxCanvas, Shape} from './../../utils/wxCanvas'
// import {heihei} from './../../utils/test'
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
    // let _this = this
    let ctx = wx.createCanvasContext('canvas', this)
    this.wxCanvas = new WxCanvas(ctx, this.config)
    this.canvasSize = this.wxCanvas.initCanvasInfo()
    // this.roundRect = new Shape('roundRect', {w: 150, h: 150, color: 'green', left: 50, y: 100, r: 20}, true)
    // this.circleImage = new Shape('circleImage', {r: 50, x: 250, locY: 'center', url: '/static/images/0.png'}, {dragable: true, scaleable: true})
    // this.circle1 = new Shape('circle', {r: 50, locX: '80%', locY: '50%', color: 'red'})
    // this.roundRect = new Shape('roundRect', {r: 10, h: 150, w: 150, color: 'green', x: 50, y: 50})
    // this.image = new Shape('image', {w: 300, h: 200, url: '/static/images/0.png', imgW: 710, imgH: 747}, {dragable: true, scaleable: true})
    // this.circleImage = new Shape('circleImage', {x: 298, y: 677, r: 61, imgW: 200, imgH: 200, url: '/static/images/1.png'}, true)
    // this.text = new Shape('text', {text: '点击输入文字', fontSize: 18, right: '50%', bottom: '90%', h: 25.5, fillMethod: 'fill', color: '#000', align: 'center'}, {dragable: true, scaleable: true})
    // this.rect1 = this.rect.clone()
    // this.wxCanvas.add(this.image)
    // this.rect.animate({x: '+50', y: '+50'})
    // this.wxCanvas.add(this.circleImage)
    // this.wxCanvas.add(this.circle1)
    // this.wxCanvas.add(this.circle1)
    // this.wxCanvas.add(this.roundRect)
    // this.wxCanvas.add(this.image)
    // this.wxCanvas.add(this.circleImage)
    // this.circle = new Shape('circle', {r: 100, locX: 'center', locY: 'center', color: '#ccc', fillMethod: 'fill'}, {scaleable: true})
    this.rect = new Shape('rect', {w: 200, h: 200, locY: 'center', locX: 'center', color: 'red', fillMethod: 'fill'}, {dragable: true})
    this.roundRect = new Shape('roundRect', {w: 200, h: 200, locY: 'center', locX: 'center', r: 10, color: 'blue', fillMethod: 'fill'}, {dragable: true, scaleable: true})
    // this.wxCanvas.add(this.text)
    this.wxCanvas.add(this.rect)
    // this.wxCanvas.add(this.circle)
    this.wxCanvas.add(this.roundRect)
    // this.line = new Shape('line', {x1: 0, y1: 0, x2: 100, y2: 100, color: '#000'})
    // this.wxCanvas.add(this.line)
    this.rect.animate({color: 'rgba(0, 0,0,.1)', x: '+40', y: '+40', h: '+40', w: '+40'}).animate({color: 'red', x: '-40', y: '-40', h: '-40', w: '-40'}).start()
    this.roundRect.animate({color: 'blue', x: '+40', y: '+40', h: '+40', w: '+40'}).start(2)
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
    handleBtnDeleteYellowCircle () {
      this.circle1.updateOption({x: 100, y: 0})
    },
    handleProgram () {
      this.rect.stop()
    },
    handleReset () {
      console.log('reset')
      // this.circleImage.updateOption({locX: 'center', y: 100, r: 100})
      // this.program.updateOption({w: 0, x: 20}, true)
      // this.wxCanvas.delete(this.complete)
      this.text.updateOption({locX: '50%', locY: 'center', color: 'red', text: '嘿嘿嘿'}, false, false)
    },
    handleTest () {
      this.wxCanvas.saveImage(true)
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
