<template>
  <canvas class="canvas-cantainer"
    canvas-id="canvas" 
    :style="{width: canvasSize.width + 'px', height: canvasSize.height + 'px'}"
    @touchstart="handleTouchStart"
    @touchmove='handleTouchMove'
    @touchend='handleTouchEnd'
  >
  </canvas>
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
      }
    }
  },
  mounted () {
    let ctx = wx.createCanvasContext('canvas', this)
    this.wxCanvas = new WxCanvas(ctx, this.config)
    this.canvasSize = this.wxCanvas.initCanvasInfo()
    let circle = new Shape('circle', {x: 0, y: 0, r: 50, color: 'red', fillMethod: 'fill'}, true)
    let rect = new Shape('rect', {x: 100, y: 100, w: 100, h: 100, color: 'blue', fillMethod: 'fill'}, true)
    let image = new Shape('image', {x: 0, y: 0, w: 710, h: 747, imgW: 710, imgH: 747, url: '/static/images/0.png', fillMethod: 'fill'})
    let text = new Shape('text', {text: '德国', x: 186, y: 245, h: 34, w: 77, fillMethod: 'fill', fontSize: 17}, true)
    let roundRect = new Shape('roundRect', {x: 200, y: 200, h: 100, w: 100, r: 20, fillMethod: 'fill', color: '#fff'}, true)
    let circleImage = new Shape('circleImage', {url: '/static/images/1.png', x: 298, y: 677, h: 200, w: 200, r: 61, fillMethod: 'fill'}, true)
    this.wxCanvas.add(image)
    this.wxCanvas.add(rect)
    this.wxCanvas.add(circle)
    this.wxCanvas.add(text)
    this.wxCanvas.add(circleImage)
    this.wxCanvas.add(roundRect).draw()
  },
  methods: {
    handleTouchStart (e) {
      this.wxCanvas.touchStart(e)
    },
    handleTouchMove (e) {
      this.wxCanvas.touchMove(e)
    },
    handleTouchEnd (e) {
      this.wxCanvas.touchEnd(e)
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
</style>
