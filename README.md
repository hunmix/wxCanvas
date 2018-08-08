# wx-canvas
基于mpvue的canvas绘图工具，用于快速还原设计稿，自适应保证不同手机下视觉效果一致（canvas宽度与屏幕比例与设计图中canvas和屏幕比例一致，如果高度不够则定高宽度等比缩放），基本用法就是，按照设计稿的画就行了。
## 使用方法
### 1. 使用npm下载并引用（推荐，我把编译版单独的仓库删了，太懒了...)

```
npm install wx-canvas --save
```

```
import {WxCanvas, Shape} from 'wx-canvas'
```
### 2. 下载wxCanvas文件，并在项目中引入
可以在这个仓库下的/src/utils/wxCanvas.js 下面找到

```
// 比如我放在了/src/utils/wxCanvas
import {WxCanvas, Shape} from '/src/utils/wxCanvas'
```

----
### 创建一个canvas标签，需要拖动的话要绑定三个触摸事件
```
<template>
  <canvas canvas-id="canvas" 
    // 这里的canvasSize需要在data中预先定义，随便什么变量都ok
    :style="{width: canvasSize.width + 'px', height: canvasSize.height + 'px'}"
    @touchstart="handleTouchStart"
    @touchmove='handleTouchMove'
    @touchend='handleTouchEnd'
  >
  </canvas>
</template>
//methods中定义三个方法，并调用this.wxCanvas的相应方法
<script>
export default {
  methods: {
    handleTouchStart (e) {
      this.wxCanvas.touchStart(e)
    },
    handleTouchMove (e) {
      this.wxCanvas.touchMove(e)
    },
    touchend (e) {
      this.wxCanvas.touchEnd(e)
    }
  }
}
</script>
```
### 需要一个变量接收计算过的宽高值，并动态设置canvas宽高

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
### 传入配置参数，初始化wxCanvas对象
### WxCanvas（canvas爸爸）

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-:|
canvas | Object|是| canvas绘画上下文
config | Object|是| 初始配置，设计图宽高，canvas宽高，具体如下代码

```

let ctx = wx.createCanvasContext('canvas', this)
this.wxCanvas = new WxCanvas(ctx, {
  canvasWidth: 710, // 设计图canvas宽
  canvasHeight: 940, // 设计图canvas高
  uiWidth: 750, // 设计图屏幕宽
  uiHeight: 1334 // 设计图屏幕高
})
//开始时务必调用一下initCanvasInfo()方法并把值赋给canvasSize（可自定义）
this.canvasSize = this.wxCanvas.initCanvasInfo()
```

#### WxCanvas方法： 
#### saveImage() ：保存canvas到相册

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-:|
loadingText | String|否| loading时候的文字，不写默认没有loading
successText | String|否| 完成保存到相册时候的文字，不写默认没有提示
imagePreview | Boolean|否| 是否在保存后预览图片，默认false
failCallback| Function|否| 授权失败回调函数

```
this.wxCanvas.saveImage({loadingText: '保存中...', successText: '已保存到相册', imagePreview: true}, function{
  console.log('授权失败')
})
```

### Shape对象
参数 | 类型| 必填|说明
:-: | :-: | :-: |:-:|
type | String|是| 形状类型：rect,circle,roundRect,image,circleImage,text,line
drawData | Object|是| 形状参数，宽高，x，y，颜色，绘画方式之类的
dragable | Boolean|是| 是否可拖动，默认false

**创建一个可拖动的矩形**

```
let rect = new Shape('rect', {x: 100, y: 100, w: 100, h: 100, color: 'blue', fillMethod: 'fill'}, true)
```
**将矩形显示到canvas上**

```
this.wxCanvas.add(this.rect)
```
（此处应有图，然而并没有）
### Shape对象方法
#### clone() ：克隆形状

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-:|
无 | 无|无| 无

```
// 这样写就多了个和rect一样的双胞胎
let rect2 = rect.clone()
this.wxCanvas.add(this.rect2)
```
#### updateOption(): 更新属性

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-:|
option | Object|是| 要更新的属性
calcScale | Boolean|否| 更新的属性是否按照设计图来，即是否需对更新的属性进行等比缩放
dragable | Boolean|否| 是否可拖动，要定义此属性需要定义calcScale，反正就是这个东西得是，第三个参数

```
// 这样rect2就变红了,并且上下左右居中
rect2.updateOption({color: 'red, locX: 'center', locY: 'center'})
```
#### bind(): 绑定事件（现在只有点击事件可以绑定，而且没有取消的，嘻嘻）

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-:|
type | String|是| 事件类型（只有点击类型） click
method | Object|是| 回调函数

#### bind(): 绑定事件（现在只有点击事件可以绑定，而且没有取消的，嘻嘻）

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-:|
type | String|是| 事件类型（只有点击类型） click
method | Object|是| 回调函数
未完善的充满bug的功能

----

#### animate()：增加动画

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-|
option | Object|是| 现在只支持x, y, r, w, h, color的动画，而且不能自适应缩放- -只能px为单位。两种写法：'+10', '-10'or  10。增加10或者到10位置这样子。颜色支持rgb，rgba，16进制表示，支持[小程序官网的预定义颜色](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/color.html)
duration | Number|是| 持续时间

#### start()：开始动画

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-|
loopTime | Number|否| 循环次数，true为无限循环，默认1次
calcScale | Boolean|是| 是否按设计图缩放（未来可能的参数，现在不存在的）

```
// 效果就是先向右向下位移100，然后回到原位，然后循环两次，自行脑补...
rect.animate({x: '+100', y: '+100'}, 1000).animate({x: 100,y: 100}, 1000).start(2)
```

### 各种图形

#### 注：若方向不填则默认X,y的默认值，left，right，loc等优先级高于x，y
#### Circle: 圆

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-|
fillMethod | String|是| 'fill' or 'stroke'， 默认fill
color | String|是| 各种色值
x | Number|否| 默认0
y | Number|否| 默认0
r | Number|是| 10
left | Number, String|否| canvas**左边界**到图形左边距离，可选值：数字，百分比
right | Number, String|否| 同上，方向换一换
top | Number, String|否| 同上，方向换一换
bottom | Number, String|否| 同上，方向换一换
locX | Number, String|否| 图形**中点**到左边距离，可选值：数字，百分比, 'center'（居中，即50%）。
locY | Number, String|否| 图形**中点**到上边距离，可选值：数字，百分比, 'center'（居中，即50%）。

```
// 圆
let circle = new Shape('circle', {locX: 50%, y: 100, r: 10, fillMethod: 'fill', color: 'red'})
```

#### CircleImage: 圆形图片，放个头像啥的**(模拟器图片可能会超出圆，真机没问题)

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-|
url | String|是| 图片路径
imgH | Number|否| 图片高
imgW | Number|否| 图片宽
x | Number|否| 默认0
y | Number|否| 默认0
r | Number|是| 10
left | Number, String|否| canvas**左边界**到图形左边距离，可选值：数字，百分比
right | Number, String|否| 同上，方向换一换
top | Number, String|否| 同上，方向换一换
bottom | Number, String|否| 同上，方向换一换
locX | Number, String|否| 图形**中点**到左边距离，可选值：数字，百分比, 'center'（居中，即50%）。
locY | Number, String|否| 图形**中点**到上边距离，可选值：数字，百分比, 'center'（居中，即50%）。

```
// 圆形图片
let circleImage = new Shape('circleImage', {locX: 50%, y: 100, r: 10, url: 'XXX/XXX.png'})
```

#### Rect: 矩形

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-|
fillMethod | String|是| 'fill' or 'stroke'， 默认fill
color | String|是| 各种色值
x | Number|否| 默认0
y | Number|否| 默认0
w | Number|是| 宽
h | Number|是| 高
left | Number, String|否| canvas**左边界**到图形左边距离，可选值：数字，百分比
right | Number, String|否| 同上，方向换一换
top | Number, String|否| 同上，方向换一换
bottom | Number, String|否| 同上，方向换一换
locX | Number, String|否| 图形**中点**到左边距离，可选值：数字，百分比, 'center'（居中，即50%）。
locY | Number, String|否| 图形**中点**到上边距离，可选值：数字，百分比, 'center'（居中，即50%）。

```
// 矩形
let rect = new Shape('rect', {locX: 50%, y: 100, w: 10, h: 10, fillMethod: 'fill', color: 'blue'})
```

#### RoundRect: 圆角矩形

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-|
fillMethod | String|是| 'fill' or 'stroke'， 默认fill
color | String|是| 各种色值
x | Number|否| 默认0
y | Number|否| 默认0
w | Number|是| 宽
h | Number|是| 高
r | Number|否| 圆角弧度 默认0
left | Number, String|否| canvas**左边界**到图形左边距离，可选值：数字，百分比
right | Number, String|否| 同上，方向换一换
top | Number, String|否| 同上，方向换一换
bottom | Number, String|否| 同上，方向换一换
locX | Number, String|否| 图形**中点**到左边距离，可选值：数字，百分比, 'center'（居中，即50%）。
locY | Number, String|否| 图形**中点**到上边距离，可选值：数字，百分比, 'center'（居中，即50%）。

```
// 圆角矩形

let roundRect = new Shape('roundRect', {locX: 50%, y: 100, w: 50, h: 50, r: 10, fillMethod: 'fill', color: 'blue'})
```

#### Image: 图片

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-|
url | String|是| 图片路径
imgH | Number|否| 原图片高
imgW | Number|否| 原图片宽
x | Number|否| 默认0
y | Number|否| 默认0
w | Number|是| 绘画图片宽度
h | Number|是| 绘画图片高度
left | Number, String|否| canvas**左边界**到图形左边距离，可选值：数字，百分比
right | Number, String|否| 同上，方向换一换
top | Number, String|否| 同上，方向换一换
bottom | Number, String|否| 同上，方向换一换
locX | Number, String|否| 图形**中点**到左边距离，可选值：数字，百分比, 'center'（居中，即50%）。
locY | Number, String|否| 图形**中点**到上边距离，可选值：数字，百分比, 'center'（居中，即50%）。

```
// 图片
let image = new Shape('image', {locX: 50%, y: 100, w: 50, h: 50, url: 'XXX/XXX.png'})
```
#### Text: 文字

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-|
fillMethod|String|是|'fill' or 'stroke'， 默认fill
text | String|是| 文字内容
align | String|否| 对齐方式，可选值：'left', 'center', 'right'。默认'left'
fontSize | Number|否| 文字大小， 默认14
family | String|否| 字体，默认san-serlf
color | String|否| 文字颜色
x | Number|否| 默认0
y | Number|否| 默认0
h | Number|是| 设计图文字高度，用于计算位置= =算出来不是很准
left | Number, String|否| canvas**左边界**到图形左边距离，可选值：数字，百分比
right | Number, String|否| 同上，方向换一换
top | Number, String|否| 同上，方向换一换
bottom | Number, String|否| 同上，方向换一换
locX | Number, String|否| 图形**中点**到左边距离，可选值：数字，百分比, 'center'（居中，即50%）。
locY | Number, String|否| 图形**中点**到上边距离，可选值：数字，百分比, 'center'（居中，即50%）。

```
// 文字, 注意h必填
let text = new Shape('text', {text: '嘿嘿嘿', locX: 50%, y: 100, h: 30, fillMethod: 'fill', color: '#000'})
```

#### Line: 线条（不支持动画，拖动）

参数 | 类型| 必填|说明
:-: | :-: | :-: |:-|
fillMethod|String|是|'fill' or 'stroke'， 默认fill
color | String|否| 文字颜色
x1 | Number|是| 默认0， 第一个坐标点x坐标
y1 | Number|是| 默认0， 第一个坐标点y坐标
x2 | Number|是| 默认0， 第二个坐标点x坐标
y2 | Number|是| 默认0， 第二个坐标点y坐标
w | Number|否| 线段粗细， 默认1

```
// 图片
let line = new Shape('line', {x:0, y: 0, x2: 100, y2: 100, w: 3, fillMethod: 'fill', color: '#000'})
```

> **感谢dalao的源码，虽然并看不懂，但是还是给了很多帮助，地址在右边 [这是地址](https://github.com/bobiscool/wxDraw)**

### Over ， 一起来玩bug吧 ! 
