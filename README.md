# wx-canvas
## 使用方法
**创建一个canvas标签，需要拖动的话要绑定三个触摸事件**
```
<canvas canvas-id="canvas" 
    :style="{width: canvasSize.width + 'px', height: canvasSize.height + 'px'}"
    @touchstart="handleTouchStart"
    @touchmove='handleTouchMove'
    @touchend='handleTouchEnd'
  >
</canvas>
```
**需要一个变量来动态改变canvas宽高**
```
export default {
  data () {
  return {
    wxCanvas: null,
    canvasSize: {
      width: null, // canvas真实宽,初始化时在wxCanvas对象上调用initCanvasInfo()获取
      height: null // canvas真实高
    }
  }
},
```
**传入配置参数，初始化wxCanvas对象**
**WxCanvas(context, config(设计图屏幕宽高和canvas宽高))**
```
let ctx = wx.createCanvasContext('canvas', this)
this.wxCanvas = new WxCanvas(ctx, {
  canvasWidth: 710, // 设计图canvas宽
  canvasHeight: 940, // 设计图canvas高
  uiWidth: 750, // 设计图屏幕宽
  uiHeight: 1334 // 设计图屏幕高
})
this.canvasSize = this.wxCanvas.initCanvasInfo()
```
**画一个矩形**
**Shape(type, drawInfo, dragable)**
```
let rect = new Shape('rect', {x: 100, y: 100, w: 100, h: 100, color: 'blue', fillMethod: 'fill'}, true)
this.wxCanvas.add(rect).draw()
```

**OVER bug存不存在不知道的 可能一筐吧**
