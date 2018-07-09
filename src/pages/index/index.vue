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
    <div class="bottom-box">
      <button @tap="handleChangeColor">变色</button>
      <button @tap="handleProgram">进度条</button>
      <button @tap="handleReset">重置</button>
      <button @tap="handleTest">测试</button>
    </div>
  </section>
</template>

<script>
import {WxCanvas, Shape} from '../../utils/wxCanvas'
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
      rectList: []
    }
  },
  mounted () {
    let ctx = wx.createCanvasContext('canvas', this)
    this.wxCanvas = new WxCanvas(ctx, this.config)
    this.canvasSize = this.wxCanvas.initCanvasInfo()
    this.circle = new Shape('circle', {x: 50, y: 50, r: 50, color: 'yellow', fillMethod: 'fill'}, true)
    this.dadRect = new Shape('rect', {x: 0, y: 0, w: 100, h: 100, color: 'red', fillMethod: 'fill'}, false)
    this.program = new Shape('rect', {x: 20, y: 300, w: 0, h: 50, color: '#0f0', fillMethod: 'fill'}, false)
    this.wxCanvas.add(this.circle)
    this.wxCanvas.add(this.dadRect)
    this.wxCanvas.add(this.program)
    this.testRoundRect = new Shape('roundRect', {x: 150, y: 150, w: 100, h: 100, r: 20, color: '#f00', fillMethod: 'fill'}, true)
    this.testCircleImage = new Shape('circleImage', {x: 300, y: 500, url: '/static/images/0.png', w: 300, h: 300, r: 150}, true)
    this.testText = new Shape('text', {x: 0, y: 90, text: '嘿嘿嘿', h: 60, fontSize: 17, fillMethod: 'fill'}, true)
    this.testImage = new Shape('image', {x: 300, y: 90, h: 100, w: 100, fontSize: 17, url: '/static/images/0.png'}, true)
    this.wxCanvas.add(this.testRoundRect)
    this.wxCanvas.add(this.testText)
    this.wxCanvas.add(this.testCircleImage)
    this.wxCanvas.add(this.testImage)
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
    handleBtnAdd () {
      console.log(this.dadRect)
      let tempShape = this.dadRect.clone()
      let len = this.rectList.length
      if (len === 0) {
        tempShape.updateOption({x: this.dadRect.Shape.x + 55, color: '#000'}, false, false)
      } else {
        tempShape.updateOption({x: this.rectList[len - 1].Shape.x + 55, color: '#0f0'}, false, true)
      }
      this.rectList.push(tempShape)
      this.wxCanvas.add(tempShape)
    },
    // 从图上删除最后一个图形
    handleBtnDelete () {
      this.wxCanvas.cancel(1)
    },
    // 从被删除的图形中恢复最后一个
    handleBtnResume () {
      this.wxCanvas.resume()
    },
    // 清除所有图形
    handleBtnClear () {
      this.wxCanvas.clear()
    },
    // 删除黄色圆
    handleBtnDeleteYellowCircle () {
      this.wxCanvas.delete(this.circle)
    },
    // 改变颜色
    handleChangeColor () {
      if (this.circle.Shape.color === 'yellow') {
        this.circle.updateOption({color: '#000'}, false, false)
      } else {
        this.circle.updateOption({color: 'yellow'}, false, true)
      }
      this.wxCanvas.draw()
    },
    handleProgram () {
      let that = this
      let timer = setInterval(function () {
        if (that.program.Shape.w > that.canvasSize.width - 30) {
          clearInterval(timer)
          that.complete = new Shape('text', {text: '已完成', color: '#000', x: 300, y: 260, fillMethod: 'fill', h: 80, fontSize: 17})
          that.wxCanvas.add(that.complete)
        }
        that.program.updateOption({w: that.program.Shape.w + Math.random() * 10}, false)
        that.wxCanvas.draw()
        that.program.bind('click', function () {
          that.wxCanvas.delete(that.program)
          that.wxCanvas.delete(that.complete)
        })
      }, 30)
    },
    handleReset () {
      this.program.updateOption({w: 0, x: 20}, true)
      this.wxCanvas.delete(this.complete)
      this.wxCanvas.draw()
    },
    handleTest () {
      this.testRoundRect.updateOption({w: 300, h: 300, color: 'blue'}, true)
      this.testCircleImage.updateOption({url: '/static/images/1.png'})
      this.testText.updateOption({x: 200, y: 200, text: '哈哈哈'}, true)
      this.testImage.updateOption({url: '/static/images/1.png'}, true)
      this.wxCanvas.draw()
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
    background: lightblue;
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
</style>
