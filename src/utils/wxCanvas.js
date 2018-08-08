// export function calcMatrix (points, rotateMatrix) {
//   console.log(rotateMatrix)
//   console.log(points, rotateMatrix)
//   const arrLen = points[0].length
//   const newPoints = []
//   points.forEach((point) => {
//     let pointArr = []
//     for (let i = 0; i < arrLen; i++) {
//       let value = 0
//       rotateMatrix[i].forEach((matrix, index) => {
//         value += point[index] * matrix
//         console.log(value)
//       })
//       pointArr.push(value)
//     }
//     newPoints.push(pointArr)
//   })
//   console.log(newPoints)
//   return newPoints
// }
// 矩阵变换，加减乘除
class Matrix {
  // 接收一个数组
  constructor (pointsArray) {
    this.m = pointsArray.length;
    this.n = pointsArray[0].length;
    this.matrixArray = pointsArray;
  }
  // 矩阵乘法
  multi (matrix) {
    const Points = [];
    if (matrix.m === this.n) {
      this.matrixArray.forEach(function (everyM, _index) { // 将每一行拎出来
        // console.log(everyM)
        Points.push([]);
        // console.log(matrix.n)
        for (let i = 0; i < matrix.n; i++) { // 要乘多少次，即一列中有几个元素
          let result = 0;
          everyM.forEach(function (_everN, index) { // 每一行的每一个 x matrix对应元素 然后加起来 = 一个结果
            result += _everN * matrix.matrixArray[index][i]; // 最小城乘数因子
          });
          // //console.log(_p)
          Points[_index][i] = result; // 把结果扔到新矩阵里面去
        }
      }, this);
      // 返回计算后的矩阵
      return new Matrix(Points)
    } else {
      // m和n不同时矩阵无法做乘法
      console.warn('矩阵无法相乘');
      return false
    }
  }
  // 矩阵加法
  add (matrix) {
    const Points = [];
    if (matrix.m === this.m && matrix.n === this.n) {
      this.matrixArray.forEach(function (everyM, index) {
        Points.push([]);
        everyM.forEach(function (_everN, _index) { // 每一行的每一个
          Points[index][_index] = _everN + matrix.matrixArray[index][_index]; // 最小城乘数因子
        });
      });
      return new Matrix(Points)
    } else {
      // 矩阵规模不一样时无法相加，即m=m&&n=n
      console.warn('矩阵无法相加');
      return false
    }
  }
  // 矩阵减法
  sub (matrix) {
    const Points = [];
    if (matrix.m === this.m && matrix.n === this.n) {
      this.matrixArray.forEach(function (everyM, index) {
        Points.push([]);
        everyM.forEach(function (_everN, _index) { // 每一行的每一个
          Points[index].push(_everN - matrix.matrixArray[index][_index]); // 最小城乘数因子
        });
      });
      return new Matrix(Points)
    }
  }
}

class Point {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
  // 一般来说origin传图形中心坐标
  rotate (origin, angle) {
    const rad = angle * Math.PI / 180;
    // 神tm不是translate和rotate形式，惊了！
    // (x： 0 y: 0, w： 100，h: 100)
    // (origin.x: 50, origin.y: 50) origin点
    // (tx: -50, ty: -50) 距x,y距离
    // origin对我来说就是，中心点坐标，
    if (origin) {
      let tx = -origin.x + this.x;
      let ty = -origin.y + this.y;
      let AtranslateMatrix = new Matrix([
        [origin.x],
        [origin.y]
      ]); // 平移
      let rotateMatrix = new Matrix([
        [Math.cos(rad), -Math.sin(rad)],
        [Math.sin(rad), Math.cos(rad)]
      ]); // 旋转
      console.log(Math.cos(angle), -Math.sin(angle));
      let getChangeMatrix = new Matrix([
        [tx], [ty]
      ]);
      let _temMatrix = rotateMatrix.multi(getChangeMatrix).add(AtranslateMatrix);
      return _temMatrix.matrixArray
    }
  }
}

// import {Matrix} from './../matrix/matrix'
const commonUtils = {
  // 有xy的话则重置loc,left,right等等的值，避免更新x,y值时失效
  resetXY (keyArr) {
    // 只获取x,y的数组
    const arr = keyArr.filter(key => {
      return key === 'x' || key === 'y'
    });
    // 没有x,y直接返回
    if (arr.length === 0) return false
    const _this = this;
    // 遍历数组初始化各种值
    arr.forEach(key => {
      resetInfo.resetPropsList[key].forEach(propName => {
        _this[propName] = undefined;
      });
    });
  },
  // 属性计算
  calcScaleValue (keyArr, option, scale) {
    const _this = this;
    const arr = keyArr.filter(key => {
      return ['x', 'y', 'h', 'w', 'r'].indexOf(key) !== -1
    });
    if (arr.length === 0) return false
    if (scale) {
      arr.forEach((key, index) => {
        let scaleKey = resetInfo.propsToSacle[key];
        _this[key] = option[key] * scale[scaleKey];
      });
    } else {
      arr.forEach(key => {
        _this[key] = option[key];
      });
    }
  },
  // 非计算属性
  getOptionValue (keyArr, option) {
    // 除去计算属性
    const arr = keyArr.filter(key => {
      return ['x', 'y', 'h', 'w', 'r'].indexOf(key) === -1
    });
    const _this = this;
    arr.forEach(key => {
      _this[key] = option[key];
    });
  },
  // 重置x,y
  resetAbsoluteInfo (keyArr, option) {
    const _this = this;
    let arr = keyArr.filter(key => {
      return resetInfo.props.indexOf(key) !== -1
    });
    if (arr.length === 0) return false
    arr.forEach(key => {
      let resetAbsolutePropsArr = resetInfo.resetAbsoluteProps[key];
      _this[key] = option[key];
      resetAbsolutePropsArr.forEach(key => {
        _this[key] = undefined;
        console.log('key' + ' : ' + _this[key]);
      });
    });
  },
  // calcType 按哪种类型的图形计算位置
  // shapeProps 拥有哪些属性
  // arr 筛选进行更改的位置属性
  judgeChangeProps (type, realSize, keyArr) {
    const _this = this;
    let option = null;
    let calcType = getCalcProps.getShapeType[type];
    const shapeProps = getCalcProps[calcType];
    let arr = keyArr.filter(key => {
      return (resetInfo.props.indexOf(key) !== -1) && (_this[key] !== undefined)
    });
    console.log(arr);
    if (arr.length === 0) { return false }
    arr.forEach(loc => {
      // 注意引用变量！！！！！！
      option = Object.assign({}, shapeProps[loc]);
      console.log(shapeProps);
      console.log(option);
      option.loc = _this[option.loc];
      option.size = realSize[option.size];
      console.log(_this);
      console.log(option);
      calcPositionShape[calcType](option, _this);
    });
  },
  handleTransform (ctx, transformInfo) {
    console.log(`handleTransform : ${transformInfo.rotate}`);
    transformInfo.scale && this._scaleTransform(ctx, transformInfo.scale);
    // transformInfo.rotate && this._rotateTransform(ctx, transformInfo.rotate)
  },
  _scaleTransform (ctx, scaleInfo) {
    console.log(scaleInfo);
    let halfW = null;
    let halfH = null;
    const type = getCalcProps.getShapeType[this.type];
    if (type === 'circle') {
      halfW = this.r;
      halfH = this.r;
    } else {
      halfW = this.w / 2;
      halfH = this.h / 2;
    }
    const center = {
      x: (this.x + halfW) * (1 - scaleInfo.x),
      y: (this.y + halfH) * (1 - scaleInfo.y)
    };
    this.translateInfo = {
      center,
      scaleInfo
    };
    // ctx.translate(center.x, center.y)
    // ctx.scale(scaleInfo.x, scaleInfo.y)
    console.log(center.x, center.y);
    console.log(scaleInfo);
  },
  _rotateTransform (ctx, rotateInfo) {
    // wxDraw Point.js
    console.log('_rotateTransform');
    let halfW = null;
    let halfH = null;
    const type = getCalcProps.getShapeType[this.type];
    if (type === 'circle') {
      halfW = this.r;
      halfH = this.r;
    } else {
      halfW = this.w / 2;
      halfH = this.h / 2;
    }
    const center = {
      x: this.x + halfW,
      y: this.y + halfH
    };
    console.log(center);
    const points = [
      [this.x, this.y],
      [this.x + this.w, this.y],
      [this.x + this.w, this.y + this.h],
      [this.x, this.y + this.h]
    ];
    const newPoints = [];
    points.forEach(point => {
      newPoints.push(new Point(point[0], point[1]).rotate(center, rotateInfo));
    });
    console.log(newPoints);
    this.rotateInfo = {
      center: [center.x, center.y],
      rad: rotateInfo * Math.PI / 180
    };
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
      let halfW = null;
      let halfH = null;
      const type = getCalcProps.getShapeType[this.type];
      if (type === 'circle') {
        halfW = this.r;
        halfH = this.r;
      } else {
        halfW = this.w / 2;
        halfH = this.h / 2;
      }
      const changedLen = {
        w: halfW * transformInfo.scale.x,
        h: halfH * transformInfo.scale.y
      };
      const centerPoint = {
        x: this.x + halfW,
        y: this.y + halfH
      };
      // 根据align设置x
      if (type === 'text') {
        switch (this.align) {
          case 'right':
            centerPoint.x = this.x - halfW;
            this.x = centerPoint.x + changedLen.w;
            break
          case 'center':
            centerPoint.x = this.x;
            break
        }
      } else {
        this.x = centerPoint.x - changedLen.w;
        this.y = centerPoint.y - changedLen.h;
      }
      this.centerPoint = centerPoint;
      if (type === 'circle') {
        this.r = this.r * transformInfo.scale.x;
      } else if (type === 'text') {
        this.h = this.h * transformInfo.scale.y;
        // XXXXXXXXXXXXXXXXXXXXXXXXXXX
        this.w = this.ctx.measureText(this.text).width * transformInfo.scale.x;
        this.fontSize = this.fontSize * transformInfo.scale.x;
      } else {
        this.w = this.w * transformInfo.scale.x;
        this.h = this.h * transformInfo.scale.y;
      }
    } else {
      console.log('reset rotate');
    }
  }
};
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
};
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
};
const calcPositionShape = {
  'rect': function (option, _this) {
    const {loc, size, property, rectProperty, type} = option;
    switch (type) {
      case 'locationX&Y' :
        if (loc === 'center') {
          _this[property] = size / 2 - _this[rectProperty] / 2;
        } else if (typeof loc === 'number') {
          _this[property] = loc - _this[rectProperty] / 2;
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc);
          _this[property] = size * num / 100 - _this[rectProperty] / 2;
        }
        break
      case 'left&top' :
        if (typeof loc === 'number') {
          _this[property] = loc;
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc);
          _this[property] = size * num / 100;
        }
        break
      case 'right&bottom' :
        if (typeof loc === 'number') {
          _this[property] = size - _this[rectProperty] - loc;
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc);
          _this[property] = size - size * num / 100 - _this[rectProperty];
        }
        break
    }
  },
  'circle': function (option, _this) {
    let {loc, size, property, type} = option;
    switch (type) {
      case 'locationX&Y' :
        if (loc === 'center') {
          _this[property] = size / 2 - _this.r;
        } else if (typeof loc === 'number') {
          _this[property] = loc - _this.r;
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc);
          _this[property] = size * num / 100 - _this.r;
        }
        break
      case 'left&top' :
        if (typeof loc === 'number') {
          _this[property] = loc;
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc);
          _this[property] = size * num / 100;
        }
        break
      case 'right&bottom' :
        if (typeof loc === 'number') {
          _this[property] = size - _this.r * 2 - loc;
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc);
          _this[property] = size - size * num / 100 - _this.r * 2;
        }
        break
    }
  },
  'text': function (option, _this) {
    let {loc, size, property, type} = option;
    switch (type) {
      case 'locX' :
        _this.align = 'center';
        if (loc === 'center') {
          _this[property] = size / 2;
        } else if (typeof loc === 'number') {
          _this[property] = loc;
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc);
          _this[property] = size * num / 100;
        }
        break
      case 'locY' :
        if (loc === 'center') {
          _this[property] = size / 2 - _this.h / 2;
        } else if (typeof loc === 'number') {
          _this[property] = loc - _this.h / 2;
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc);
          _this[property] = size * num / 100 - _this.h / 2;
        }
        break
      case 'left' :
        _this.align = 'left';
        if (typeof loc === 'number') {
          _this[property] = loc;
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc);
          _this[property] = size * num / 100;
        }
        break
      case 'right' :
        _this.align = 'right';
        if (typeof loc === 'number') {
          _this[property] = size - loc;
          console.log(_this[property]);
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc);
          _this[property] = size - size * num / 100;
        }
        break
      case 'top' :
        if (typeof loc === 'number') {
          _this[property] = loc;
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc);
          _this[property] = size * num / 100;
        }
        break
      case 'bottom' :
        if (typeof loc === 'number') {
          _this[property] = size - loc - _this.h;
        } else if (loc.indexOf('%') !== -1) {
          let num = this._getPercentNum(loc);
          _this[property] = size - size * num / 100 - _this.h;
        }
        break
    }
  },
  // 获取百分比的数字部分
  _getPercentNum (value) {
    let len = value.length;
    console.log(Number(value.substring(0, len - 1)));
    return Number(value.substring(0, len - 1))
  }
};
function extendsCommonMethods (prototype, commonUtils) {
  for (const key in commonUtils) {
    prototype[key] = commonUtils[key];
  }
}

// import {commonUtils} from './../mixins/commonUtils'
// 圆
class Circle {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true;
    this.x = drawData.x || 0;
    this.y = drawData.y || 0;
    this.r = drawData.r || 10;
    this.color = drawData.color;
    this.fillMethod = drawData.fillMethod || 'fill';
    this.left = drawData.left;
    this.right = drawData.right;
    this.top = drawData.top;
    this.bottom = drawData.bottom;
    this.locX = drawData.locX;
    this.locY = drawData.locY;
    this.offsetX = 0;
    this.offsetY = 0;
    this.type = 'circle';
    this.scale = drawData.scale || null;
  }
  // 计算绘画数据
  calcInfo (scale) {
    // 待改---------------------------------------------------------------
    this.scale = scale;
    this.firstRender = false;
    this.x = this.x * scale.x;
    this.y = this.y * scale.y;
    this.r = this.r * scale.x;
  }
  // 绘制路径
  createPath (ctx, transformInfo) {
    console.log(transformInfo);
    ctx.save();
    ctx.beginPath();
    transformInfo && this.handleTransform(ctx, transformInfo);
    ctx[this.fillMethod + 'Style'] = this.color;
    ctx.arc(this.x + this.r, this.y + this.r, this.r, 0, 2 * Math.PI);
    ctx[this.fillMethod]();
    ctx.closePath();
    ctx.restore();
    transformInfo && this.restProps(transformInfo, this.type);
  }
  judgeRange (e) {
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    };
    const len = Math.sqrt(Math.pow(this.startPoint.x - (this.x + this.r), 2) + Math.pow(this.startPoint.y - (this.y + this.r), 2));
    if (len < this.r) {
      this.startX = this.x;
      this.startY = this.y;
      return true
    } else {
      return false
    }
  }
  collisionDetection (realSize) {
    this.realSize = realSize;
    // 碰撞检测
    if (this.x + this.r * 2 > realSize.w) {
      this.x = realSize.w - this.r * 2;
    }
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y + this.r * 2 > realSize.h) {
      this.y = realSize.h - this.r * 2;
    }
  }
  move (e) {
    let movePoint = {
      x: e.mp.touches[0].x,
      y: e.mp.touches[0].y
    };
    this.offsetX = movePoint.x - this.startPoint.x;
    this.offsetY = movePoint.y - this.startPoint.y;
    this.x = this.startX + this.offsetX;
    this.y = this.startY + this.offsetY;
  }
  updateOption (option, calcScale) {
    // 改变的数据里有xy则根据calcScale参数决定是否进行缩放计算，并将绝对定位属性置空，避免新的x,y属性失效
    // 一坨方法放在commonUtils里面
    let keyArr = Object.keys(option);
    if (keyArr.length !== 0) {
      this.resetXY(keyArr);
      if (calcScale) {
        this.calcScaleValue(keyArr, option, this.scale);
      } else {
        this.calcScaleValue(keyArr, option, false);
      }
      this.getOptionValue(keyArr, option);
    }
    // 如果有left, right啥啥啥的，就重置同方向的定位属性，避免影响
    this.resetAbsoluteInfo(keyArr, option);
    this.judgeChangeProps(this.type, this.realSize, keyArr);
  }
}
// Circle.prototype = Object.assign(Circle.prototype, commonUtils)
extendsCommonMethods(Circle.prototype, commonUtils);

// import {commonUtils} from './../mixins/commonUtils'
// 圆形图片
class CircleImage {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true;
    this.x = drawData.x || 0;
    this.y = drawData.y || 0;
    this.r = drawData.r || 10;
    this.left = drawData.x;
    this.top = drawData.y;
    this.left = drawData.left;
    this.right = drawData.right;
    this.top = drawData.top;
    this.bottom = drawData.bottom;
    this.locX = drawData.locX;
    this.locY = drawData.locY;
    this.imgW = drawData.imgW;
    this.imgH = drawData.imgH;
    this.url = drawData.url;
    this.type = 'circleImage';
    this.scale = drawData.scale || null;
    console.log(drawData);
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.scale = scale;
    this.firstRender = false;
    this.x = this.x * scale.x;
    this.y = this.y * scale.y;
    this.r = this.r * scale.x;
  }
  // 绘制路径
  createPath (ctx, transformInfo) {
    ctx.save();
    ctx.beginPath();
    transformInfo && this.handleTransform(ctx, transformInfo);
    ctx.arc(this.x + this.r, this.y + this.r, this.r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(this.url, 0, 0, this.imgW, this.imgH, this.x, this.y, this.r * 2, this.r * 2);
    ctx.restore();
    transformInfo && this.restProps(transformInfo, this.type);
  }
  // 判定范围
  judgeRange (e) {
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    };
    let len = Math.sqrt(Math.pow(this.startPoint.x - (this.x + this.r), 2) + Math.pow(this.startPoint.y - (this.y + this.r), 2));
    if (len < this.r) {
      this.startX = this.x;
      this.startY = this.y;
      return true
    } else {
      return false
    }
  }
  // 碰撞检测
  collisionDetection (realSize) {
    this.realSize = realSize;
    // 碰撞检测
    if (this.x + this.r * 2 > realSize.w) {
      this.x = realSize.w - this.r * 2;
    }
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y + this.r * 2 > realSize.h) {
      this.y = realSize.h - this.r * 2;
    }
  }
  // 移动计算
  move (e) {
    let movePoint = {
      x: e.mp.touches[0].x,
      y: e.mp.touches[0].y
    };
    this.offsetX = movePoint.x - this.startPoint.x;
    this.offsetY = movePoint.y - this.startPoint.y;
    this.x = this.startX + this.offsetX;
    this.y = this.startY + this.offsetY;
  }
  // 更新图形信息时候是否需要重新计算真实宽高
  updateOption (option, calcScale) {
    // 改变的数据里有xy则根据calcScale参数决定是否进行缩放计算，并将绝对定位属性置空，避免新的x,y属性失效
    // ----------------------可能会有问题-----------------------------------------------
    // 一坨方法放在commonUtils里面
    let keyArr = Object.keys(option);
    if (keyArr.length !== 0) {
      this.resetXY(keyArr);
      if (calcScale) {
        this.calcScaleValue(keyArr, option, this.scale);
      } else {
        this.calcScaleValue(keyArr, option, false);
      }
      this.getOptionValue(keyArr, option);
    }
    // 如果有left, right啥啥啥的，就重置同方向的定位属性，避免影响
    this.resetAbsoluteInfo(keyArr, option);
    // this.getAbsolutLocation(this.realSize)
    this.judgeChangeProps(this.type, this.realSize, keyArr);
  }
}

// CircleImage.prototype = Object.assign(CircleImage.prototype, commonUtils)
extendsCommonMethods(CircleImage.prototype, commonUtils);

// import {commonUtils} from './../mixins/commonUtils'
class Image {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true;
    this.imgW = drawData.imgW;
    this.imgH = drawData.imgH;
    this.url = drawData.url;
    this.x = drawData.x || 0;
    this.y = drawData.y || 0;
    this.w = drawData.w;
    this.h = drawData.h;
    this.left = drawData.left;
    this.right = drawData.right;
    this.top = drawData.top;
    this.bottom = drawData.bottom;
    this.locX = drawData.locX;
    this.locY = drawData.locY;
    this.type = 'image';
    this.scale = drawData.scale || null;
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.scale = scale;
    this.firstRender = false;
    this.x = this.x * scale.x;
    this.y = this.y * scale.y;
    this.w = this.w * scale.x;
    this.h = this.h * scale.y;
  }
  // 绘制路径
  createPath (ctx, transformInfo) {
    ctx.save();
    transformInfo && this.handleTransform(ctx, transformInfo);
    ctx.drawImage(this.url, 0, 0, this.imgW, this.imgH, this.x, this.y, this.w, this.h);
    ctx.closePath();
    ctx.restore();
    transformInfo && this.restProps(transformInfo);
  }
  // 判断是否在图形范围内
  judgeRange (e) {
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    };
    let rightX = this.x + this.w;
    let bottomY = this.y + this.h;
    if (this.startPoint.x > this.x && this.startPoint.x < rightX && this.startPoint.y < bottomY && this.startPoint.y > this.y) {
      this.startX = this.x;
      this.startY = this.y;
      return true
    } else {
      return false
    }
  }
  collisionDetection (realSize) {
    this.realSize = realSize;
    // 碰撞检测
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.w > realSize.w) {
      this.x = realSize.w - this.w;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y + this.h > realSize.h) {
      this.y = realSize.h - this.h;
    }
  }
  move (e) {
    let movePoint = {
      x: e.mp.touches[0].x,
      y: e.mp.touches[0].y
    };
    this.offsetX = movePoint.x - this.startPoint.x;
    this.offsetY = movePoint.y - this.startPoint.y;
    this.x = this.startX + this.offsetX;
    this.y = this.startY + this.offsetY;
  }
  // 更新图形信息时候是否需要重新计算真实宽高
  updateOption (option, calcScale) {
    // ----------------------可能会有问题-----------------------------------------------
    // 一坨方法放在commonUtils里面
    let keyArr = Object.keys(option);
    if (keyArr.length !== 0) {
      this.resetXY(keyArr);
      if (calcScale) {
        this.calcScaleValue(keyArr, option, this.scale);
      } else {
        this.calcScaleValue(keyArr, option, false);
      }
      this.getOptionValue(keyArr, option);
    }
    // 如果有left, right啥啥啥的，就重置同方向的定位属性，避免影响
    this.resetAbsoluteInfo(keyArr, option);
    // this.getAbsolutLocation(this.realSize)
    this.judgeChangeProps(this.type, this.realSize, keyArr);
  }
}

// Image.prototype = Object.assign(Image.prototype, commonUtils)
extendsCommonMethods(Image.prototype, commonUtils);

// import {commonUtils} from './../mixins/commonUtils'
// 直线
class Line {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true;
    this.x1 = drawData.x1 || 0;
    this.y1 = drawData.y1 || 0;
    this.x2 = drawData.x2 || 0;
    this.y2 = drawData.y2 || 0;
    this.w = drawData.w || 1;
    this.fillMethod = drawData.fillMethod || 'stroke';
    this.color = drawData.color;
    this.type = 'line';
    this.scale = drawData.scale || null;
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.scale = scale;
    this.firstRender = false;
    this.x1 = this.x1 * scale.x;
    this.y1 = this.y1 * scale.y;
    this.x2 = this.x2 * scale.x;
    this.y2 = this.y2 * scale.y;
  }
  // 绘制路径
  createPath (ctx, sacle, realSize) {
    ctx.save();
    ctx.beginPath();
    ctx[this.fillMethod + 'Style'] = this.color;
    ctx.lineWidth = this.w;
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
  judgeRange (e) {
    return false
    // this.startPoint = {
    //   x: e.mp.changedTouches[0].x,
    //   y: e.mp.changedTouches[0].y
    // }
    // let rightX = this.x + this.w
    // let bottomY = this.y + this.h
    // let width = Math.abs(this.x2 - this.x1)
    // if (this.startPoint.x > this.x && this.startPoint.x < rightX && this.startPoint.y < bottomY && this.startPoint.y > this.y) {
    //   this.startX = this.x
    //   this.startY = this.y
    //   return true
    // } else {
    //   return false
    // }
  }
  collisionDetection (realSize) {
    this.realSize = realSize;
    // 碰撞检测
    if (this.x1 < 0) {
      this.x1 = 0;
    }
    if (this.x2 > realSize.w) {
      this.x2 = realSize.w;
    }
    if (this.y1 < 0) {
      this.y1 = 0;
    }
    if (this.y2 > realSize.h) {
      this.y2 = realSize.h;
    }
  }
  // move (e) {
  //   let movePoint = {
  //     x: e.mp.touches[0].x,
  //     y: e.mp.touches[0].y
  //   }
  //   this.offsetX = movePoint.x - this.startPoint.x
  //   this.offsetY = movePoint.y - this.startPoint.y
  //   this.x = this.startX + this.offsetX
  //   this.y = this.startY + this.offsetY
  // }
  updateOption (option, calcScale) {
    // 待改= =先不动了
    for (let key in option) {
      if (calcScale) {
        console.log('in calc');
        switch (key) {
          case 'x1':
            this.x1 = option.x1 * this.scale.x;
            continue
          case 'y1':
            this.y1 = option.y1 * this.scale.y;
            continue
          case 'x2':
            this.x2 = option.x2 * this.scale.x;
            continue
          case 'y2':
            this.y2 = option.y2 * this.scale.y;
            continue
        }
      }
      this[key] = option[key];
    }
  }
  getAbsolutLocation () {
    console.log('我被调用了,但是我p事不干');
  }
}

// Line.prototype = Object.assign(Line.prototype, commonUtils)
extendsCommonMethods(Line.prototype, commonUtils);

// 矩形
class Rect {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true;
    this.x = drawData.x || 0;
    this.y = drawData.y || 0;
    this.w = drawData.w;
    this.h = drawData.h;
    this.left = drawData.left;
    this.right = drawData.right;
    this.top = drawData.top;
    this.bottom = drawData.bottom;
    this.locX = drawData.locX;
    this.locY = drawData.locY;
    this.fillMethod = drawData.fillMethod || 'fill';
    this.color = drawData.color;
    this.type = 'rect';
    this.scale = drawData.scale || null;
    this.scaleInfo = null;
    this.rotateInfo = null;
    this.translateInfo = null;
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.scale = scale;
    this.firstRender = false;
    this.x = this.x * scale.x;
    this.y = this.y * scale.y;
    this.w = this.w * scale.x;
    this.h = this.h * scale.y;
  }
  // 绘制路径
  createPath (ctx, transformInfo) {
    console.log('------------------------------------');
    console.log(transformInfo);
    ctx.save();
    transformInfo && this.handleTransform(ctx, transformInfo);
    console.log(this.rotateInfo);
    ctx.beginPath();
    console.log('-------------------------上次写到这里！-----------------------');
    console.log(this.translateInfo);
    // if (this.translateInfo) {
    //   ctx.translate(this.translateInfo.center.x, this.translateInfo.center.y)
    //   ctx.scale(this.translateInfo.scaleInfo.x, this.translateInfo.scaleInfo.y)
    // }
    // if (this.rotateInfo) {
    //   const x = this.rotateInfo.center[0]
    //   const y = this.rotateInfo.center[1]
    //   const rad = this.rotateInfo.rad
    //   ctx.translate(x, y)
    //   ctx.rotate(rad)
    //   console.log(rad)
    //   ctx.translate(-x, -y)
    // }
    ctx[this.fillMethod + 'Style'] = this.color;
    ctx[this.fillMethod + 'Rect'](this.x, this.y, this.w, this.h);
    ctx.closePath();
    ctx.restore();
    transformInfo && this.restProps(transformInfo);
  }
  judgeRange (e) {
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    };
    let rightX = this.x + this.w;
    let bottomY = this.y + this.h;
    if (this.startPoint.x > this.x && this.startPoint.x < rightX && this.startPoint.y < bottomY && this.startPoint.y > this.y) {
      this.startX = this.x;
      this.startY = this.y;
      return true
    } else {
      return false
    }
  }
  collisionDetection (realSize) {
    this.realSize = realSize;
    // 碰撞检测
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.w > realSize.w) {
      this.x = realSize.w - this.w;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y + this.h > realSize.h) {
      this.y = realSize.h - this.h;
    }
  }
  move (e) {
    let movePoint = {
      x: e.mp.touches[0].x,
      y: e.mp.touches[0].y
    };
    this.offsetX = movePoint.x - this.startPoint.x;
    this.offsetY = movePoint.y - this.startPoint.y;
    this.x = this.startX + this.offsetX;
    this.y = this.startY + this.offsetY;
  }
  // 更新自适应属性数据x,y,r,w,h等，直接更新or动画调用
  updateOption (option, calcScale) {
    // ----------------------可能会有问题-----------------------------------------------
    let keyArr = Object.keys(option);
    if (keyArr.length !== 0) {
      this.resetXY(keyArr);
      if (calcScale) {
        this.calcScaleValue(keyArr, option, this.scale);
      } else {
        this.calcScaleValue(keyArr, option, false);
      }
      this.getOptionValue(keyArr, option);
    }
    // 如果有left, right啥啥啥的，就重置同方向的定位属性，避免影响
    this.resetAbsoluteInfo(keyArr, option);
    this.judgeChangeProps(this.type, this.realSize, keyArr);
  }
}
// Rect.prototype = Object.assign(Rect.prototype, commonUtils)
extendsCommonMethods(Rect.prototype, commonUtils);

// import {commonUtils} from './../mixins/commonUtils'
// 圆角矩形
class RoundRect {
  constructor (drawData) {
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true;
    this.r = drawData.r;
    if (drawData.width < 2 * drawData.r) {
      this.r = drawData.width / 2;
    }
    if (drawData.height < 2 * drawData.r) {
      this.r = drawData.height / 2;
    }
    console.log(drawData.x || 0);
    this.r = this.r || 0;
    this.x = drawData.x || 0;
    this.y = drawData.y || 0;
    this.w = drawData.w;
    this.h = drawData.h;
    this.left = drawData.left;
    this.right = drawData.right;
    this.top = drawData.top;
    this.bottom = drawData.bottom;
    this.locX = drawData.locX;
    this.locY = drawData.locY;
    this.color = drawData.color || '#000';
    this.fillMethod = drawData.fillMethod || 'fill';
    this.type = 'roundRect';
    this.scale = drawData.scale || null;
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.scale = scale;
    this.firstRender = false;
    this.x = this.x * scale.x;
    this.y = this.y * scale.y;
    this.w = this.w * scale.x;
    this.h = this.h * scale.y;
  }
  // 绘制路径
  createPath (ctx, transformInfo) {
    // if (this.firstRender) {
    //   this.calcInfo(sacle)
    // }
    // this.collisionDetection(realSize)
    ctx.save();
    ctx[this.fillMethod + 'Style'] = this.color;
    transformInfo && this.handleTransform(ctx, transformInfo);
    ctx.beginPath();
    ctx.moveTo(this.x + this.r, this.y);
    ctx.lineTo(this.x + this.w - this.r, this.y);
    ctx.arc(this.x + this.w - this.r, this.y + this.r, this.r, 3 / 2 * Math.PI, 2 * Math.PI);
    ctx.lineTo(this.x + this.w, this.y + this.h - this.r);
    ctx.arc(this.x + this.w - this.r, this.y + this.h - this.r, this.r, 0, 1 / 2 * Math.PI);
    ctx.lineTo(this.x + this.r, this.y + this.h);
    ctx.arc(this.x + this.r, this.y + this.h - this.r, this.r, 1 / 2 * Math.PI, Math.PI);
    ctx.lineTo(this.x, this.y + this.r);
    ctx.arc(this.x + this.r, this.y + this.r, this.r, Math.PI, 3 / 2 * Math.PI);
    ctx.closePath();
    ctx[this.fillMethod]();
    ctx.restore();
    transformInfo && this.restProps(transformInfo);
  }
  // _restProps (transformInfo) {
  //   const changedLen = {
  //     w: this.w / 2 * transformInfo.scale.x,
  //     h: this.h / 2 * transformInfo.scale.y
  //   }
  //   const centerPoint = {
  //     x: this.x + this.w / 2,
  //     y: this.y + this.h / 2
  //   }
  //   this.x = centerPoint.x - changedLen.w
  //   this.y = centerPoint.y - changedLen.h
  //   this.w = this.w * transformInfo.scale.x
  //   this.h = this.h * transformInfo.scale.y
  // }
  // _handleTransform (ctx, transformInfo) {
  //   transformInfo.scale && this._scaleTransform(ctx, transformInfo.scale)
  // }
  // _scaleTransform (ctx, scaleInfo) {
  //   console.log(scaleInfo)
  //   const center = {
  //     x: (this.x + this.w / 2) * (1 - scaleInfo.x),
  //     y: (this.y + this.h / 2) * (1 - scaleInfo.y)
  //   }
  //   ctx.translate(center.x, center.y)
  //   ctx.scale(scaleInfo.x, scaleInfo.y)
  //   console.log(center.x, center.y)
  //   console.log(scaleInfo)
  // }
  judgeRange (e) {
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    };
    let rightX = this.x + this.w;
    let bottomY = this.y + this.h;
    if (this.startPoint.x > this.x && this.startPoint.x < rightX && this.startPoint.y < bottomY && this.startPoint.y > this.y) {
      this.startX = this.x;
      this.startY = this.y;
      console.log('in');
      return true
    } else {
      return false
    }
  }
  collisionDetection (realSize) {
    this.realSize = realSize;
    // 碰撞检测
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.w > realSize.w) {
      this.x = realSize.w - this.w;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y + this.h > realSize.h) {
      this.y = realSize.h - this.h;
    }
  }
  move (e) {
    let movePoint = {
      x: e.mp.touches[0].x,
      y: e.mp.touches[0].y
    };
    this.offsetX = movePoint.x - this.startPoint.x;
    this.offsetY = movePoint.y - this.startPoint.y;
    this.x = this.startX + this.offsetX;
    this.y = this.startY + this.offsetY;
  }
  // 更新图形信息时候是否需要重新计算真实宽高
  updateOption (option, calcScale) {
    // ----------------------可能会有问题-----------------------------------------------
    // 一坨方法放在commonUtils里面
    let keyArr = Object.keys(option);
    if (keyArr.length !== 0) {
      this.resetXY(keyArr);
      if (calcScale) {
        this.calcScaleValue(keyArr, option, this.scale);
      } else {
        this.calcScaleValue(keyArr, option, false);
      }
      this.getOptionValue(keyArr, option);
    }
    // 如果有left, right啥啥啥的，就重置同方向的定位属性，避免影响
    this.resetAbsoluteInfo(keyArr, option);
    this.judgeChangeProps(this.type, this.realSize, keyArr);
  }
}
// RoundRect.prototype = Object.assign(RoundRect.prototype, commonUtils)
extendsCommonMethods(RoundRect.prototype, commonUtils);

// import {commonUtils} from './../mixins/commonUtils'
// 文字
class Text {
  constructor (drawData) {
    console.log(drawData);
    drawData.firstRender === false ? this.firstRender = false : this.firstRender = true;
    this.text = drawData.text || '没有拿到文字';
    // this.width = ctx.measureText(drawData.text).width
    this.h = drawData.h;
    this.x = drawData.x || 0;
    this.w = null;
    this.y = drawData.y || 0;
    this.locX = drawData.locX;
    this.locY = drawData.locY;
    this.left = drawData.left;
    this.right = drawData.right;
    this.top = drawData.top;
    this.bottom = drawData.bottom;
    this.fontSize = drawData.fontSize || 14;
    this.family = drawData.family || 'sans-serif';
    this.fillMethod = drawData.fillMethod || 'fill';
    this.color = drawData.color;
    this.align = drawData.align || 'left';
    this.baseline = drawData.baseline || 'normal';
    this.type = 'text';
    this.scale = drawData.scale || null;
  }
  // 计算绘画数据
  calcInfo (scale) {
    this.scale = scale;
    this.firstRender = false;
    this.x = this.x * scale.x;
    this.y = this.y * scale.y;
    this.w = this.w * scale.x;
    this.h = this.h * scale.y;
  }
  // 绘制路径
  createPath (ctx, transformInfo) {
    console.log(this.y);
    this.ctx = ctx;
    ctx.save();
    transformInfo && this.handleTransform(ctx, transformInfo);
    ctx.textBaseline = this.baseline || 'normal'; // normal：baseLine在文字底部，则y值为y+文字框高度
    ctx.setFontSize(this.fontSize);
    ctx.font = `${this.fontSize}px ${this.family}`;
    ctx.textAlign = this.align || 'left';
    ctx[this.fillMethod + 'Style'] = this.color;
    ctx.closePath();
    console.log(this.text, this.x, this.y + this.h);
    ctx[this.fillMethod + 'Text'](this.text, this.x, this.y + this.h);
    transformInfo && this.restProps(transformInfo);
    ctx.restore();
  }
  judgeRange (e) {
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    };
    // 获取文本宽度
    this.w = this.ctx.measureText(this.text).width;
    switch (this.align) {
      case 'center':
        this.leftX = this.x - this.w / 2;
        break
      case 'left':
        this.leftX = this.x;
        break
      case 'right':
        this.leftX = this.x - this.w;
        break
    }
    if (this.startPoint.x > this.leftX && this.startPoint.y > this.y && this.startPoint.x < this.leftX + this.w && this.startPoint.y < this.y + this.h) {
      this.startX = this.x;
      this.startY = this.y;
      return true
    } else {
      return false
    }
  }
  // 碰撞判定
  collisionDetection (realSize) {
    this.realSize = realSize;
    switch (this.align) {
      case 'center':
        this.leftX = this.x - this.w / 2;
        if (this.leftX < 0) {
          this.x = this.w / 2;
        }
        if (this.leftX + this.w > realSize.w) {
          this.x = realSize.w - this.w / 2;
        }
        break
      case 'left':
        this.leftX = this.x;
        this.leftX = this.x;
        if (this.leftX < 0) {
          this.x = 0;
          console.log('000');
        }
        if (this.x + this.w > realSize.w) {
          this.x = realSize.w - this.w;
        }
        break
      case 'right':
        this.leftX = this.x - this.w;
        if (this.leftX < 0) {
          this.x = this.w;
        }
        if (this.x > realSize.w) {
          this.x = realSize.w;
        }
        break
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y + this.h > realSize.h) {
      this.y = realSize.h - this.h;
    }
  }
  move (e) {
    let movePoint = {
      x: e.mp.touches[0].x,
      y: e.mp.touches[0].y
    };
    this.offsetX = movePoint.x - this.startPoint.x;
    this.offsetY = movePoint.y - this.startPoint.y;
    this.x = this.startX + this.offsetX;
    this.y = this.startY + this.offsetY;
  }
  // 更新图形信息时候是否需要重新计算真实宽高
  updateOption (option, calcScale) {
    // ----------------------可能会有问题-----------------------------------------------
    // 一坨方法放在commonUtils里面
    let keyArr = Object.keys(option);
    if (keyArr.length !== 0) {
      this.resetXY(keyArr);
      if (calcScale) {
        this.calcScaleValue(keyArr, option, this.scale);
      } else {
        this.calcScaleValue(keyArr, option, false);
      }
      this.getOptionValue(keyArr, option);
    }
    // 如果有left, right啥啥啥的，就重置同方向的定位属性，避免影响
    this.resetAbsoluteInfo(keyArr, option);
    // this.getAbsolutLocation(this.realSize)
    this.judgeChangeProps(this.type, this.realSize, keyArr);
  }
}

// Text.prototype = Object.assign(Text.prototype, commonUtils)
extendsCommonMethods(Text.prototype, commonUtils);

// import {commonUtils} from './../mixins/commonUtils'
// 选中边框
class BorderFrame {
  constructor (drawData) {
    drawData.firstRender = false;
    this.x = drawData.x || 0;
    this.y = drawData.y || 0;
    this.w = drawData.w;
    this.h = drawData.h;
    if (drawData.r) {
      this.w = drawData.r * 2;
      this.h = drawData.r * 2;
    }
    // this.left = drawData.left
    // this.right = drawData.right
    // this.top = drawData.top
    // this.bottom = drawData.bottom
    // this.locX = drawData.locX
    // this.locY = drawData.locY
    // this.fillMethod = drawData.fillMethod || 'fill'
    this.fillMethod = 'stroke';
    this.color = '#80cef5';
    // this.color = drawData.color
    this.type = 'borderFrame';
    this.scale = drawData.scale || null;
    // -----------------------
    this.dragable = true;
    this.rectsInfo = [];
    this.distance = 5;
    this.len = this.distance * 2;
  }
  // 计算绘画数据
  calcInfo (scale) {
    console.log('scale');
    this.scale = scale;
    this.firstRender = false;
    this.x = this.x * scale.x;
    this.y = this.y * scale.y;
    this.w = this.w * scale.x;
    this.h = this.h * scale.y;
  }
  // 绘制路径
  createPath (ctx) {
    ctx.save();
    ctx.beginPath();
    ctx[this.fillMethod + 'Style'] = this.color;
    ctx[this.fillMethod + 'Rect'](this.x, this.y, this.w, this.h);
    this._drawPoint(ctx);
    this._drawLine(ctx);
    this._drawCircle(ctx);
    ctx.closePath();
    ctx.restore();
  }
  _drawPoint (ctx) {
    const _this = this;
    this._calcPointsPosition();
    console.log(this.rectsInfo);
    this.rectsInfo.forEach(point => {
      ctx.beginPath();
      ctx.strokeStyle = 'lightblue';
      ctx.fillStyle = point.activeColor || '#fff';
      ctx.fillRect(point.x, point.y, _this.len, _this.len);
      ctx.strokeRect(point.x, point.y, _this.len, _this.len);
      ctx.closePath();
    });
  }
  _calcPointsPosition () {
    console.log('in borderFrame :' + this.w);
    const pointLeftTop = {
      x: this.x - this.distance,
      y: this.y - this.distance,
      color: this.color
    };
    const pointRightTop = {
      x: this.x + this.w - this.distance,
      y: this.y - this.distance,
      color: this.color
    };
    const pointRightBottom = {
      x: this.x + this.w - this.distance,
      y: this.y + this.h - this.distance,
      color: this.color
    };
    const pointLeftBottom = {
      x: this.x - this.distance,
      y: this.y + this.h - this.distance,
      color: this.color
    };
    this.circleInfo = {
      x: this.x + this.w / 2,
      y: this.y - 20,
      r: this.len / 2
    };
    this.rectsInfo = [pointLeftTop, pointRightTop, pointRightBottom, pointLeftBottom];
  }
  _drawLine (ctx) {
    const lineOption = {
      x1: this.x + this.w / 2,
      y1: this.y,
      x2: this.x + this.w / 2,
      y2: this.y - 15
    };
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.moveTo(lineOption.x1, lineOption.y1);
    ctx.lineTo(lineOption.x2, lineOption.y2);
    ctx.stroke();
    ctx.closePath();
  }
  _drawCircle (ctx) {
    const circleOption = {
      x: this.x + this.w / 2,
      y: this.y - 20,
      r: this.len / 2
    };
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = '#fff';
    ctx.arc(circleOption.x, circleOption.y, circleOption.r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
  judgeRange (e) {
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    };
    return this._isInRectPoint() || this._isInCircle()
  }
  _isInRectPoint () {
    const _this = this;
    const judgeInfo = [];
    this.rectsInfo.forEach(rectInfo => {
      // 增加实际可点击范围，视图不变(手机上点太小，点中几率太小)
      judgeInfo.push({x: rectInfo.x - _this.len, y: rectInfo.y - _this.len, rightX: rectInfo.x + _this.len * 2, bottomY: rectInfo.y + _this.len * 2});
    });
    // console.log(judgeInfo)
    return judgeInfo.some((rectInfo, index) => {
      const isInCurrentRect = this.startPoint.x > rectInfo.x && this.startPoint.x < rectInfo.rightX && this.startPoint.y < rectInfo.bottomY && this.startPoint.y > rectInfo.y;
      if (isInCurrentRect) {
        _this.startX = this.x;
        _this.startY = this.y;
        _this.rectsInfo[index].activeColor = 'lightblue';
        console.log('------------------------------------');
        console.log(_this.rectsInfo);
        _this.movePoint = index;
        console.log(index);
        console.log(_this.rectsInfo);
      }
      _this.rectsInfo[index].activeColor = '#fff';
      return isInCurrentRect
    })
  }
  _isInCircle () {
    this.circleInfo = {
      x: this.x + this.w / 2 - this.len,
      y: this.y - 20 - this.len,
      r: this.len / 2
    };
    const circleJudgeInfo = {
      x: this.circleInfo.x - this.len,
      y: this.circleInfo.y - this.len,
      r: this.circleInfo.r + this.len
    };
    const len = Math.sqrt(Math.pow(this.startPoint.x - (circleJudgeInfo.x + circleJudgeInfo.r), 2) + Math.pow(this.startPoint.y - (circleJudgeInfo.y + circleJudgeInfo.r), 2));
    console.log(`len in borderFrame :${len}`);
    if (len < circleJudgeInfo.r) {
      this.movePoint = 4;
      return true
    } else {
      return false
    }
  }
  getMovePointIndex () {
    return this.movePoint
  }
  collisionDetection (realSize) {
    const len = 5;
    this.realSize = realSize;
    // 碰撞检测
    if (this.x < 0) {
      this.x = -len;
    }
    if (this.x + this.w > realSize.w) {
      this.x = realSize.w - this.w + len;
    }
    if (this.y < 0) {
      this.y = -len;
    }
    if (this.y + this.h > realSize.h) {
      this.y = realSize.h - this.h + len;
    }
  }
  move (e) {
    // do nothing
  }
  // 更新自适应属性数据x,y,r,w,h等，直接更新or动画调用
  updateOption (option, calcScale) {
    // ----------------------可能会有问题-----------------------------------------------
    // let keyArr = Object.keys(option)
    // if (keyArr.length !== 0) {
    //   this.resetXY(keyArr)
    //   if (calcScale) {
    //     this.calcScaleValue(keyArr, option, this.scale)
    //   } else {
    //     this.calcScaleValue(keyArr, option, false)
    //   }
    //   this.getOptionValue(keyArr, option)
    // }
    // // 如果有left, right啥啥啥的，就重置同方向的定位属性，避免影响
    // this.resetAbsoluteInfo(keyArr, option)
    // this.judgeChangeProps(this.type, this.realSize, keyArr)
  }
}
// BorderFrame.prototype = Object.assign(BorderFrame.prototype, commonUtils)
extendsCommonMethods(BorderFrame.prototype, commonUtils);

class AnimationControl {
  constructor () {
    this.running = false;
    this.loop = 1;
    this.index = 0;
    this.duration = 1000;
    this.startTime = null;
    this.goesbyTime = null;
  }
  isRunning () {
    return this.running
  }
  start () {
    this.running = true;
  }
  complete () {
    this.running = false;
  }
  getLoop () {
    return this.loop
  }
  isLoopContinue () {
    return (this.loop === true || --this.loop > 0)
  }
  getCurrentIndex () {
    return this.index
  }
  setLoop (loopTime) {
    this.loop = loopTime || 1;
    console.log(this.loop);
  }
  setStartTime (startTime) {
    this.startTime = new Date().getTime();
    console.log(this.startTime);
  }
  getGoesbyTime () {
    this.goesbyTime = new Date().getTime() - this.startTime;
    return this.goesbyTime
  }
  stop () {
    this.running = false;
  }
}

// 事件总线
class EventBus {
  constructor () {
    this.eventList = [];
  }
  // 监听事件
  listen (name, self, event, removeCallback) {
    let eventInfo = [self, event, removeCallback];
    let callbacks = this.eventList[name];
    if (Array.isArray(callbacks)) {
      callbacks.push(eventInfo);
    } else {
      this.eventList[name] = [eventInfo];
    }
  }
  remove (name, self) {
    let callbacks = this.eventList[name];
    if (Array.isArray(callbacks)) {
      this.eventList[name] = callbacks.filter((callbacks) => {
        let retain = callbacks[0] !== self;
        if (!retain) {
          let removeCallback = callbacks[2];
          if (typeof removeCallback === 'function') {
            removeCallback.call(self);
          }
        }
        return retain
      });
    }
  }
  // 触发事件
  emit (name, data) {
    let callbacks = this.eventList[name];
    if (Array.isArray(callbacks)) {
      callbacks.forEach((eventInfo) => {
        let _self = eventInfo[0];
        let callback = eventInfo[1];
        callback.call(_self, data);
      });
    }
  }
}

// 动画循环
function drawAnimationStep (callback) {
  setTimeout(() => {
    callback();
  }, 30);
}

function hex2rgb (hexValue) {
  // 如果是三位数的值则转化成6位
  const has3Num = /#[\da-fA-F]{3}$/.test(hexValue);
  if (has3Num) {
    const stack = hexValue.split('').slice(1);
    const len = stack.length;
    const arr = [];
    for (let i = 0; i < len; i++) {
      let tempValue = stack.pop();
      for (let i = 0; i < 2; i++) {
        arr.unshift(tempValue);
      }
    }
    let hexString = arr.join('');
    hexValue = `#${hexString}`;
  }
  const hexParrten = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i;
  const result = hexParrten.exec(hexValue);
  console.log(result);
  // 转化成rgb格式
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 1
  } : null
}
// rgb格式化
function formatRgb (rgbValue) {
  console.log(rgbValue);
  // const rgbPattern = /^[rR][gG][bB]\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
  const rgbPattern = /^[rR][gG][bB][aA]?\(\s*(\d{1,3}.?\d*)\s*,\s*(\d{1,3}.?\d*)\s*,\s*(\d{1,3}.?\d*)\s*,?\s*(0|1|0\.\d{1,2}|\.\d{1,2})?\s*\)\s*$/;
  const result = rgbPattern.exec(rgbValue);
  const alpha = /\.\d{1,2}/;
  console.log(result);
  // 透明度为.5之类数字的时候前面加0
  if (alpha.test(result[4])) {
    result[4] = `0${result[4]}`;
  }
  console.log(parseFloat(result[4]));
  return result ? {
    r: parseInt(result[1]),
    g: parseInt(result[2]),
    b: parseInt(result[3]),
    a: result[4] ? parseFloat(result[4]) : 1
  } : null
}

// 处理颜色渐变方面的计算

/** 处理颜色渐变
 * @param {String} animationInfo 要处理的颜色
 * @param {Number} goesbyRatio 已经经过的时间比值 goesbyTime / duration
 * @param {String} startOptionColor 开始时的颜色
 * @returns {String} 一个用rgba表示颜色的字符串
 */
function calcColorChange (animationInfo, goesbyRatio, startOptionColor) {
  console.log('startOptionColor');
  console.log(startOptionColor);
  const startColor = _getFormatRgb(startOptionColor);
  const currentColor = _getFormatRgb(animationInfo);
  console.log('before');
  console.log(currentColor); // right
  console.log('after');
  console.log(startColor); // wrong
  const changedColorStep = {
    cr: (currentColor.r - startColor.r) * goesbyRatio,
    cg: (currentColor.g - startColor.g) * goesbyRatio,
    cb: (currentColor.b - startColor.b) * goesbyRatio,
    ca: (currentColor.a - startColor.a) * goesbyRatio
  };
  const currentRgb = {
    r: (startColor.r + changedColorStep.cr).toFixed(2),
    g: (startColor.g + changedColorStep.cg).toFixed(2),
    b: (startColor.b + changedColorStep.cb).toFixed(2),
    a: (startColor.a + changedColorStep.ca).toFixed(2)
  };
  _roughHandle(currentRgb);
  return `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${currentRgb.a})`
}
// 暴力解决数值溢出的问题，先这么着= =后面再说
function _roughHandle (currentRgb) {
  const props = Object.keys(currentRgb);
  props.forEach(porp => {
    if (currentRgb[porp] > 255) {
      currentRgb[porp] = 255;
    } else if (currentRgb[porp] < 0) {
      currentRgb[porp] = 0;
    }
  });
}
/** 格式化，把所有颜色都他喵转换成rgba形式
 * @param {String} colorValue 颜色值
 * @returns {String} rgba形式的颜色
 */
function _getFormatRgb (colorValue) {
  console.log(colorValue);
  const hexPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
  // const rgbPattern = /[rR][gG][bB]\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)/
  const rgbPattern = /^[rR][gG][bB][aA]?\(\s*\d{1,3}.?\d*\s*,\s*\d{1,3}\.?\d*\s*,\s*\d{1,3}.?\d*\s*,?(\s*0|\s*1|\s*0\.\d{1,2}|\s*\.\d{1,2})?\s*\)\s*$/;
  let result = null;
  if (hexPattern.test(colorValue)) {
    result = hex2rgb(colorValue);
  } else if (rgbPattern.test(colorValue)) {
    result = formatRgb(colorValue);
  } else {
    result = getColorValue(colorValue);
  }
  console.log(result);
  return result
}

function getColorValue (colorValue) {
  console.log(colorValue);
  const colorName = colorValue.toLowerCase();
  const color = colorList[colorName];
  let result = null;
  if (color) {
    result = hex2rgb(color);
    console.log('in color');
    console.log(result);
  } else {
    console.warn('输入颜色不合法');
  }
  return result
}
const colorList = {
  'antiquewhite': '#FAEBD7',
  'aqua': '#00FFFF',
  'aquamarine': '#7FFFD4',
  'azure': '#F0FFFF',
  'beige': '#F5F5DC',
  'bisque': '#FFE4C4',
  'black': '#000000',
  'blanchedalmond': '#FFEBCD',
  'blue': '#0000FF',
  'blueViolet': '#8A2BE2',
  'brown': '#A52A2A',
  'burlywood': '#DEB887',
  'cadetblue': '#5F9EA0',
  'chartreuse': '#7FFF00',
  'chocolate': '#D2691E',
  'coral': '#FF7F50',
  'cornflowerblue': '#6495ED',
  'cornsilk': '#FFF8DC',
  'crimson': '#DC143C',
  'cyan': '#00FFFF',
  'darkblue': '#00008B',
  'darkcyan': '#008B8B',
  'darkgoldenrod': '#B8860B',
  'darkgray': '#A9A9A9',
  'darkgrey': '#A9A9A9',
  'darkgreen': '#006400',
  'darkkhaki': '#BDB76B',
  'darkmagenta': '#8B008B',
  'darkoliveGreen': '#556B2F',
  'darkorange': '#FF8C00',
  'darkorchid': '#9932CC',
  'darkred': '#8B0000',
  'darksalmon': '#E9967A',
  'darkseagreen': '#8FBC8F',
  'darkslateblue': '#483D8B',
  'darkslategray': '#2F4F4F',
  'darkslategrey': '#2F4F4F',
  'darkturquoise': '#00CED1',
  'darkviolet': '#9400D3',
  'deeppink': '#FF1493',
  'deepskyblue': '#00BFFF',
  'dimgray': '#696969',
  'dimgrey': '#696969',
  'dodgerblue': '#1E90FF',
  'fireBrick': '#B22222',
  'floralwhite': '#FFFAF0',
  'forestgreen': '#228B22',
  'fuchsia': '#FF00FF',
  'gainsboro': '#DCDCDC',
  'ghostwhite': '#F8F8FF',
  'gold': '#FFD700',
  'goldenrod': '#DAA520',
  'gray': '#808080',
  'grey': '#808080',
  'green': '#008000',
  'greenyellow': '#ADFF2F',
  'honeydew': '#F0FFF0',
  'hotPink': '#FF69B4',
  'indianred': '#CD5C5C',
  'indigo': '#4B0082',
  'ivory': '#FFFFF0',
  'khaki': '#F0E68C',
  'lavender': '#E6E6FA',
  'lavenderblush': '#FFF0F5',
  'lawngreen': '#7CFC00',
  'lemonchiffon': '#FFFACD',
  'lightblue': '#ADD8E6',
  'lightcoral': '#F08080',
  'lightcyan': '#E0FFFF',
  'lightgoldenrodyellow': '#FAFAD2',
  'lightgray': '#D3D3D3',
  'lightgrey': '#D3D3D3',
  'lightgreen': '#90EE90',
  'lightpink': '#FFB6C1',
  'lightsalmon': '#FFA07A',
  'lightseagreen': '#20B2AA',
  'lightskyblue': '#87CEFA',
  'lightslategray': '#778899',
  'lightslategrey': '#778899',
  'lightsteelblue': '#B0C4DE',
  'lightyellow': '#FFFFE0',
  'lime': '#00FF00',
  'limegreen': '#32CD32',
  'linen': '#FAF0E6',
  'magenta': '#FF00FF',
  'maroon': '#800000',
  'mediumaquamarine': '#66CDAA',
  'mediumblue': '#0000CD',
  'mediumorchid': '#BA55D3',
  'mediumpurple': '#9370DB',
  'mediumseagreen': '#3CB371',
  'mediumslateblue': '#7B68EE',
  'mediumspringgreen': '#00FA9A',
  'mediumturquoise': '#48D1CC',
  'mediumvioletRed': '#C71585',
  'midnightblue': '#191970',
  'mintcream': '#F5FFFA',
  'mistyrose': '#FFE4E1',
  'moccasin': '#FFE4B5',
  'navajowhite': '#FFDEAD',
  'navy': '#000080',
  'oldlace': '#FDF5E6',
  'olive': '#808000',
  'olivedrab': '#6B8E23',
  'orange': '#FFA500',
  'orangered': '#FF4500',
  'orchid': '#DA70D6',
  'palegoldenrod': '#EEE8AA',
  'palegreen': '#98FB98',
  'paleturquoise': '#AFEEEE',
  'palevioletred': '#DB7093',
  'papayawhip': '#FFEFD5',
  'peachpuff': '#FFDAB9',
  'peru': '#CD853F',
  'pink': '#FFC0CB',
  'plum': '#DDA0DD',
  'powderblue': '#B0E0E6',
  'purple': '#800080',
  'rebeccapurple': '#663399',
  'red': '#FF0000',
  'rosybrown': '#BC8F8F',
  'royalblue': '#4169E1',
  'saddlebrown': '#8B4513',
  'salmon': '#FA8072',
  'sandybrown': '#F4A460',
  'seagreen': '#2E8B57',
  'seashell': '#FFF5EE',
  'sienna': '#A0522D',
  'silver': '#C0C0C0',
  'skyblue': '#87CEEB',
  'slateblue': '#6A5ACD',
  'slategray': '#708090',
  'slategrey': '#708090',
  'snow': '#FFFAFA',
  'springgreen': '#00FF7F',
  'steelblue': '#4682B4',
  'tan': '#D2B48C',
  'teal': '#008080',
  'thistle': '#D8BFD8',
  'tomato': '#FF6347',
  'turquoise': '#40E0D0',
  'violet': '#EE82EE',
  'wheat': '#F5DEB3',
  'white': '#FFFFFF',
  'whitesmoke': '#F5F5F5',
  'yellow': '#FFFF00',
  'yellowgreen': '#9ACD32'

};

// 图形
class Shape {
  constructor (type, drawData, {dragable = false, scaleable = false} = {}) {
    console.log(arguments);
    this.Shape = createShape[type](drawData);
    this.dragable = dragable;
    this.scaleable = scaleable;
    this.transformInfo = null;
    this.watch = new AnimationControl();
    this._bus = new EventBus();
    this.animationStore = [];
    this.completeAnimationStore = [];
    this.eventList = {
      'click': [],
      'longpress': []
    };
    console.log(`---------------0-0-0-0---------------------------------`);
    console.log(`dragable : ${this.dragable}`);
    console.log(`scaleable : ${this.scaleable}`);
    // 为可自定义图形和borderFrame添加点击事件，这个点击事件，怪怪的 后面再说
    if (this.scaleable) {
      this.dragable = false;
    }
  }
  draw (ctx, scale, realSize) {
    this.scale = scale;
    this.realSize = realSize;
    // 判断是否是第一次计算比例
    if (this.isNeedCalcRatio()) {
      let keyArr = Object.keys(this.Shape);
      this.Shape.calcInfo(scale);
      // 最后一个参数用来判断是否是第一次调用
      this.Shape.judgeChangeProps(this.Shape.type, realSize, keyArr);
    }
    // 碰撞判定
    this.Shape.collisionDetection(realSize);
    // 绘制路径
    // transfromControl, transformInfo
    this.Shape.createPath(ctx, this.transformInfo);
    // this.Shape.restProps(this.transformInfo)
  }
  setTransformInfo (transformInfo) {
    this.transformInfo = transformInfo;
  }
  isNeedCalcRatio () {
    return this.Shape.firstRender
  }
  isInShape (e) {
    return this.Shape.judgeRange(e)
  }
  canDragable () {
    return this.dragable
  }
  move (e) {
    this.Shape.move(e);
  }
  bind (type, method) {
    console.log('bind');
    if (this.eventList[type]) {
      this.eventList[type].push(method);
    }
  }
  clone () {
    let option = Object.assign({}, this.Shape);
    return new Shape(this.Shape.type, option, this.dragable)
  }
  updateOption (option, calcScale, dragable) {
    dragable === undefined ? this.dragable = this.dragable : this.dragable = dragable;
    this.Shape.updateOption(option, calcScale);
    this.bus.emit('update');
  }
  // 将动画信息存到animationStore
  animate (option, duration = 1000) {
    console.log('duration');
    this.animationStore.push([option, duration]);
    return this
  }
  start (loopTime, calcScale) {
    console.log(`start : ${this.dragable}`);
    console.log(this.animationStore);
    const tempDragable = this.dragable;
    const tempScaleable = this.scaleable;
    this.dragable = false;
    this.scaleable = false;
    this.watch.running = true; // 动画开始
    this.watch.setLoop(loopTime); // 设置循环次数
    this.watch.setStartTime(); // 设置开始时间
    this.startOption = Object.assign({}, this.Shape); // 记录初始值
    this._loopAnimation(tempDragable, tempScaleable);
  }
  resetTransInfo () {
    this.transformInfo = null;
  }
  _loopAnimation (tempDragable, tempScaleable) {
    let _this = this;
    // 动画时禁止拖动, 这边可以放到watch里面，后面再改- -
    function stepAnimation () { // 实现动画循环
      // drawAnimationStep(stepAnimation)
      if (_this.watch.isRunning()) {
        _this._updateStep();
      } else {
        _this.dragable = tempDragable;
        _this.scaleable = tempScaleable;
        return false
      }
      drawAnimationStep(stepAnimation);
    }
    drawAnimationStep(stepAnimation);
  }
  stop () {
    this.watch.stop();
  }
  // 没试过的-------------------------------------------------
  clearAnimation () {
    this.watch.stop();
    this.animationStore = [];
    this.completeAnimationStore = [];
  }
  // 更新动画 step -> loop -> complete
  // _updateStep -> updateOption -> (stepComplete) -> _setStepAfterStepOption -> _isALoopComplete -> (loopComplete) -> _resetDataAfterALoopCompelte
  _updateStep () {
    console.log(this.animationStore);
    const goesByTime = this.watch.getGoesbyTime();
    const nowAnimation = this.animationStore[0];
    const duration = nowAnimation[1];
    const animationInfo = nowAnimation[0];
    const option = this._calcAnimationInfo(animationInfo, duration); // 处理动画数据，每一步动画移动的坐标, 处理数据都在里面
    this.updateOption(option);
    // 是否结束动画
    if (goesByTime >= duration) {
      this._setStepAfterStepOption();
      this._isALoopComplete(this.animationStore.length);
    }
  }
  _setStepAfterStepOption () {
    console.log('-------------------超帅的step分割线--------------------');
    // 将已完成的动画从动画仓库移动到已完成仓库
    const completeAnimation = this.animationStore.shift();
    this.completeAnimationStore.push(completeAnimation);
    // 惊了，忘记是干嘛的了，大概是克隆了一份Shape的值，防止引用型变量被篡改
    this.tempOption = Object.assign({}, this.Shape);
    this.watch.setStartTime();
  }
  _isALoopComplete (animationStoreLength) {
    if (animationStoreLength === 0) {
      // 循环是否结束，没结束则将已完成的动画push到animationStore再画一遍
      this.watch.isLoopContinue() ? this.updateOption(this.startOption) : this.watch.complete();
      this._resetDataAfterALoopCompelte();
    }
  }
  _resetDataAfterALoopCompelte () {
    // 把已完成动画扔回去，以便下一次start可以用
    this.completeAnimationStore.forEach((animationInfo) => {
      this.animationStore.push(animationInfo);
    });
    this.completeAnimationStore = [];
    // 中间点置空
    this.tempOption = null;
  }
  // -----------------------------------------------------------------------------------------------------------
  /** 计算动画过程中变化的属性返回计算后的值
   * @param {Object} option 更改的属性
   * @param {Number} duration 动画持续时间
   * @returns {Object} 计算后的属性合集，扔在一个对象里面返回
   * @memberof Shape
   */
  _calcAnimationInfo (option, duration) {
    let _this = this;
    let nowOption = {};
    let keys = Object.keys(option);
    keys.forEach((key) => {
      const goesbyRatio = _this.watch.getGoesbyTime() / duration;
      const startValue = _this.tempOption ? _this.tempOption[key] : _this.startOption[key];
      // 颜色和距离宽高变动分开算, 这边仿佛可以拆= =想不出函数名，留着先
      if (key === 'color') {
        console.log(startValue);
        const rgbColor = calcColorChange(option[key], goesbyRatio, startValue);
        nowOption[key] = rgbColor;
        // console.log(rgbColor)
      } else {
        const changedValue = _this._calcPositionValue(option[key], goesbyRatio, startValue);
        nowOption[key] = changedValue;
      }
    });
    console.log(nowOption);
    return nowOption
  }
  // 添加getCenterPosition方法获取原来中心点坐标在计算，一个想法，记录一哈
  /** 判断位置属性的改变方式计算出变更的单个属性值, 暂时只支持改变x, y的动画
   * @param {*} animationInfo 改变的属性值
   * @param {Number} goesbyRatio 经过的时间和动画持续时间的比值
   * @param {*} startValue shape初始状态，即初始属性，改变的属性相对初始属性变化
   * @returns 改变之后的单个属性值
   * @memberof Shape
   */
  _calcPositionValue (animationInfo, goesbyRatio, startValue) {
    let num = null;
    let changedLen = null;
    if (typeof animationInfo === 'number') {
      changedLen = (animationInfo - startValue) * goesbyRatio;
    } else if (animationInfo.indexOf('+') !== -1 || animationInfo.indexOf('-') !== -1) {
      num = this._getNumber(animationInfo);
      changedLen = num * goesbyRatio;
    }
    // 本次要画的值
    const changedValue = startValue + changedLen;
    return changedValue
  }
  // 获取属性数值，和图形方法重复了，待提取,卧槽用的地方好多啊= =再缓缓
  _getNumber (animationInfo) {
    let pattern = /[-+]\d*/;
    return Number(animationInfo.match(pattern)[0])
  }
}

let createShape = {
  'circle': function (drawData) {
    return new Circle(drawData)
  },
  'rect': function (drawData) {
    return new Rect(drawData)
  },
  'image': function (drawData) {
    return new Image(drawData)
  },
  'text': function (drawData) {
    return new Text(drawData)
  },
  'roundRect': function (drawData) {
    return new RoundRect(drawData)
  },
  'circleImage': function (drawData) {
    return new CircleImage(drawData)
  },
  'line': function (drawData) {
    return new Line(drawData)
  },
  'borderFrame': function (drawData) {
    return new BorderFrame(drawData)
  }
};

// 存放shape实例
class Store {
  constructor () {
    this.store = [];
    this.deleteItems = [];
  }
  // 添加图形
  add (shape) {
    this.store.push(shape);
  }
  // 清空所有图形
  clear () {
    this.store = [];
  }
  // 删除最后一个
  cancel () {
    if (this.store.length === 0) { return }
    let deleteItem = this.store.pop();
    this.deleteItems.push(deleteItem);
  }
  // 恢复最后一个删除的
  resume () {
    if (this.deleteItems.length === 0) { return }
    let shape = this.deleteItems.pop();
    this.store.push(shape);
  }
  // 删除特定元素
  delete (item) {
    let index = this.store.indexOf(item);
    if (index !== -1) {
      let deletedItem = this.store.splice(index, 1)[0];
      this.deleteItems.push(deletedItem);
    }
  }
}

// 信息
class Info {
  constructor (config) {
    this.canvasSize = { // 画布尺寸
      width: config.canvasWidth,
      height: config.canvasHeight
    };
    this.uiInfo = { // 设计图信息
      width: config.uiWidth,
      height: config.uiHeight
    };
  }
  // 获取设备信息
  getSystemInfo () {
    try {
      var res = wx.getSystemInfoSync();
      this.screen = {
        width: res.windowWidth,
        height: res.windowHeight
      };
      return this.screen
    } catch (e) {
      // Do something when catch error
      console.log('can\'t get systemInfo');
    }
  }
  // 初始数据
  initInfo () {
    console.log(this.canvasSize.width, this.canvasSize.height, this.uiInfo.width, this.uiInfo.height);
    this.canvasRatio = this.canvasSize.width / this.canvasSize.height; // 设计图canvas宽高比
    this.wRatio = this.canvasSize.width / this.uiInfo.width; // 设计图canvas和设计图宽度比
    this.hRatio = this.canvasSize.height / this.uiInfo.height; // 设计图canvas和设计图高度比
    this.realWidth = this.screen.width * this.wRatio; // 真实绘画宽度
    this.realHeight = this.realWidth / this.canvasRatio; // 真实绘画高度
    this.leftToCanvas = (this.screen.width - this.realWidth) / 2; // 屏幕距canvas左边距离
    this.topToCanvas = (this.screen.height - this.realHeight) / 2; // 屏幕距canvas右边距离
    // 高度不够定高宽度等比例缩放
    if (this.realHeight >= this.screen.height) {
      this.realHeight = this.screen.height * this.hRatio;
      this.realWidth = this.realHeight * this.canvasRatio;
    }
    this.realSize = {
      h: this.realHeight,
      w: this.realWidth
    };
    // canvas内元素缩放比
    this.scale = {
      x: this.realWidth / this.canvasSize.width,
      y: this.realHeight / this.canvasSize.height
    };
  }
}

// wxCanvas中用到的方法
const canvasFunction = {
  // touchStart,遍历store找到点击图形
  judgeCanMoveItem (e) {
    let len = this.store.store.length;
    for (let i = len - 1; i > -1; i--) {
      let shape = this.store.store[i];
      if (shape.isInShape(e)) {
        shape.canDragable() && this._setMoveInfo(shape);
        // 点在框上就return
        if (this.scaleControl.isTouchOnFrame(e)) {
          this.scaleControl.startTransfrom(e);
          return
        }
        // 点击不在自定义图形上时清除边框
        this.scaleControl.isScaleShapeChanged(shape) && this.scaleControl.reset(this);
        return
      }
    }
    try {
      this.scaleControl.reset();
    } catch (err) {
      console.log(err);
    }
    console.log('emit reset');
  },
  _setMoveInfo (shape) {
    this.moveItem = shape;
    this.canMove = true;
  },
  // touchMove事件处理
  handleMoveEvent (e) {
    console.log('move');
    this.moveItem.move(e);
    this.scaleControl.isBorderFrameNeedMove(this.moveItem) && this.scaleControl.update();
  },
  // touchEnd点击事件处理
  handleClickEvent (e) {
    const len = this.store.store.length;
    for (let i = len - 1; i > -1; i--) {
      const shape = this.store.store[i];
      if (shape.isInShape(e)) {
        console.log(shape);
        // 遍历点击事件
        this._isEventExist(shape) && this._ergodicEvents(shape);
        // 自定义边框处理
        this._shouldCreateBorderFrame(shape) && this.scaleControl.createBorderFrame(shape);
        return
      }
    }
  },
  _isEventExist (shape) {
    return shape.eventList['click'].length > 0
  },
  _shouldCreateBorderFrame (shape) {
    return this.scaleControl.isScaleShapeChanged(shape) && shape.scaleable
  },
  // 遍历所有点击事件
  _ergodicEvents (shape) {
    shape.eventList['click'].forEach((ele) => {
      ele(this);
    });
  }
};

class ScaleControl {
  constructor (bus, realSize) {
    this.borderFrame = null;
    this.bus = bus;
    this.scaleShape = null;
    this.canTrans = false;
    this.transformInfo = {};
    this.startPoint = null;
    this.realSize = realSize;
    this.fromBorderLen = 5;
  }
  createBorderFrame (shape) {
    if (!this.isScaleShapeChanged()) return
    this.scaleShape = shape;
    this.scaleShape.dragable = true;
    console.log(shape);
    const option = this.calcBorderFrameData();
    this.drawBorderFrame(option);
  }
  // 计算缩放框的数据
  calcBorderFrameData (scaleShape = this.scaleShape.Shape) {
    const len = this.fromBorderLen;
    const option = {
      x: scaleShape.x - len,
      y: scaleShape.y - len
    };
    if (scaleShape.type === 'text') {
      switch (scaleShape.align) {
        case 'center' :
          option.x = scaleShape.x - scaleShape.w / 2 - len;
          break
        case 'right' :
          console.log('right');
          option.x = scaleShape.x - scaleShape.w - len;
          console.log(option.x);
          break
      }
    }
    console.log('scaleControl :' + scaleShape);
    if (this._isCircleTypeShape()) {
      option.w = scaleShape.r * 2 + len * 2;
      option.h = scaleShape.r * 2 + len * 2;
      // -------------------------------------------------------
    } else if (this.scaleShape.Shape.type === 'text') {
      option.w = scaleShape.w + len * 2;
      option.h = scaleShape.h + len * 2;
      console.log('borderFrameData :' + option.w);
    } else {
      option.w = scaleShape.w + len * 2;
      option.h = scaleShape.h + len * 2;
    }
    console.log(option);
    return option
  }
  drawBorderFrame (drawData) {
    console.log(drawData);
    this.borderFrame = new Shape('borderFrame', drawData);
    this.bus.emit('add', this.borderFrame);
  }
  reset () {
    console.log('reset');
    this.delete();
    if (this.scaleShape) {
      this.scaleShape.dragable = false;
    }
    this.scaleShape = null;
  }
  delete () {
    console.log('delete');
    this.bus.emit('delete', this.borderFrame);
    this.borderFrame = null;
  }
  isScaleShapeChanged (shape) {
    // console.log(this.scaleShape)
    // console.log(shape)
    console.log(this.scaleShape === shape);
    return this.scaleShape !== shape
  }
  isBorderFrameNeedMove (currentMoveItem) {
    return currentMoveItem === this.scaleShape
  }
  isTouchOnFrame (e) {
    // 边框不存在直接返回
    if (!this.borderFrame) { return false }
    console.log(this.borderFrame.isInShape(e));
    return this.borderFrame.isInShape(e)
  }
  update (updateData) {
    console.log('ScaleControl :');
    console.log(updateData);
    console.log('update');
    const shape = updateData || this.scaleShape.Shape;
    console.log(updateData);
    const option = this.calcBorderFrameData(shape);
    console.log(option);
    const changedProps = Object.keys(option);
    changedProps.forEach(prop => {
      this.borderFrame.Shape[prop] = option[prop];
    });
  }
  canShapeTrans () {
    return this.canTrans
  }
  startTransfrom (e) {
    this.canTrans = true;
    console.log(e);
    this.startPoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    };
  }
  stopTransfrom () {
    this.canTrans = false;
  }
  // 计算缩放比例(待整理。。乱- -)
  handleTransEvent (e) {
    const movePoint = {
      x: e.mp.changedTouches[0].x,
      y: e.mp.changedTouches[0].y
    };
    const movedX = {
      x: movePoint.x - this.startPoint.x,
      y: movePoint.y - this.startPoint.y
    };
    // 判断按在哪个移动点上面
    const movePointIndex = this.borderFrame.Shape.getMovePointIndex();
    if (movePointIndex === 4) {
      console.log('-----------rotate-------------');
      const centerPoint = this.scaleShape.Shape.centerPoint ? this.scaleShape.Shape.centerPoint : this._getCenterPoint();
      const deg = this._calcDegValue(centerPoint, movePoint);
      console.log(deg);
      this.transformInfo.rotate = deg;
    } else {
      console.log(movePointIndex);
      // 根据点击不同的点来更改movedx的属性，计算缩放
      this._judgeLongerMoveLength(movePointIndex, movedX);
      this.startPoint = movePoint;
      // 判断是否是圆形
      if (this._isCircleTypeShape()) {
        this.transformInfo.scale = {
          x: 1 + movedX.x / this.scaleShape.Shape.r,
          y: 1 + movedX.y / this.scaleShape.Shape.r
        };
      } else {
        this.transformInfo.scale = {
          x: 1 + movedX.x / (this.scaleShape.Shape.w / 2),
          y: 1 + movedX.y / (this.scaleShape.Shape.h / 2)
        };
      }
      // 根据移动最多的值进行缩放
      if (Math.abs(1 - this.transformInfo.scale.x) > Math.abs(1 - this.transformInfo.scale.y)) {
        this.transformInfo.scale.y = this.transformInfo.scale.x;
      } else {
        this.transformInfo.scale.x = this.transformInfo.scale.y;
      }
      // 设定缩放边界
      if (!this._canShapeScale(this.transformInfo.scale)) {
        this.transformInfo.scale = null;
      }
    }
    this.scaleShape.setTransformInfo(this.transformInfo);
    this.update();
  }
  // 判断在哪个象限
  _calcDegValue (centerPoint, movePoint) {
    let tan = null;
    let deg = null;
    const currentPoint = {
      x: Math.abs(movePoint.x - centerPoint.x),
      y: Math.abs(movePoint.y - centerPoint.y)
    };
    console.log('-----------------------------1111111111111----------------------------');
    if (movePoint.x > centerPoint.x && movePoint.y < centerPoint.y) {
      console.log('第一象限');
      tan = currentPoint.x / currentPoint.y;
      deg = Math.atan(tan) / Math.PI * 180;
    } else if (movePoint.x > centerPoint.x && movePoint.y > centerPoint.y) {
      console.log('第二象限');
      tan = currentPoint.y / currentPoint.x;
      deg = Math.atan(tan) / Math.PI * 180 + 90;
      console.log(Math.atan(tan) / Math.PI * 180);
    } else if (movePoint.x < centerPoint.x && movePoint.y > centerPoint.y) {
      console.log('第三象限');
      tan = currentPoint.x / currentPoint.y;
      deg = Math.atan(tan) / Math.PI * 180 + 180;
    } else if (movePoint.x < centerPoint.x && movePoint.y < centerPoint.y) {
      console.log('第四象限');
      tan = currentPoint.y / currentPoint.x;
      deg = Math.atan(tan) / Math.PI * 180 + 270;
    }
    console.log(deg);
    return deg
  }
  _getCenterPoint () {
    const currentShape = getCalcProps.getShapeType[this.scaleShape.Shape.type];
    let centerPoint = null;
    if (currentShape === 'rect') {
      centerPoint = {
        x: this.scaleShape.Shape.x + this.scaleShape.Shape.w / 2,
        y: this.scaleShape.Shape.y + this.scaleShape.Shape.h / 2
      };
    } else if (currentShape === 'circle') {
      centerPoint = {
        x: this.scaleShape.Shape.x + this.scaleShape.Shape.r,
        y: this.scaleShape.Shape.y + this.scaleShape.Shape.r
      };
    } else if (currentShape === 'text') {
      console.log('太多等会写');
    }
    return centerPoint
  }
  // 该图形是否能缩放，到达边界没有
  _canShapeScale (scale) {
    console.log(this.realSize);
    if (this._isCircleTypeShape() && this._isCircleInBoundary(scale)) {
      return false
    } else if (this._isOtherShapeInBoundary(scale)) {
      return false
    } else {
      return true
    }
  }
  _isCircleInBoundary (scale) {
    return this.scaleShape.Shape.r * 2 * scale.x <= 10 || this.scaleShape.Shape.r * 2 * scale.x >= this.realSize.width - this.fromBorderLen * 2
  }
  _isOtherShapeInBoundary (scale) {
    return this.scaleShape.Shape.w * scale.x <= 10 || this.scaleShape.Shape.h * scale.y <= 10 || this.scaleShape.Shape.w * scale.x >= this.realSize.width - this.fromBorderLen * 2 || this.scaleShape.Shape.h * scale.y >= this.realSize.height - this.fromBorderLen * 2
  }
  _judgeLongerMoveLength (currentPoint, movedX) {
    switch (currentPoint) {
      case 0 :
        movedX.x = -movedX.x;
        movedX.y = -movedX.y;
        console.log('in 0');
        break
      case 1 :
        movedX.y = -movedX.y;
        console.log('in 1');
        break
      case 2 :
        console.log('in 2');
        break
      case 3 :
        movedX.x = -movedX.x;
        console.log('in 3');
        break
    }
  }
  _isCircleTypeShape () {
    return this.scaleShape.Shape.type === 'circle' || this.scaleShape.Shape.type === 'circleImage'
  }
  resetTransform () {
    this.transformInfo = {};
    this.scaleShape && this.scaleShape.resetTransInfo();
  }
}

// 爸爸类
class WxCanvas {
  constructor (canvas, config) {
    this.canvas = canvas; // 绘画上下文对象
    this.store = new Store(); // store对象，用于储存图形对象
    this.info = new Info(config); // info对象，初始化各种信息
    this.canMove = false; // 是否能拖动标记
    this.bus = new EventBus(); // 事件总线对象
    this.scaleControl = new ScaleControl(this.bus, this.initCanvasInfo());
    this.bus.listen('update', this, this.update);
    this.bus.listen('add', this, this.add);
    this.bus.listen('delete', this, this.delete);
  }
  // 获取canvas真实宽高，外部调用
  initCanvasInfo () {
    this.screen = this.info.getSystemInfo();
    this.info.initInfo();
    return {
      width: this.info.realWidth,
      height: this.info.realHeight
    }
  }
  add (shapes, callback) {
    if (shapes instanceof Array) {
      shapes.forEach(shape => {
        shape.bus = this.bus;
        shape.realSize = this.info.realSize;
        this.store.add(shape);
      });
    } else {
      shapes.bus = this.bus;
      shapes.realSize = this.info.realSize;
      this.store.add(shapes);
    }
    this.draw(callback);
    return this
  }
  draw (callback) {
    console.log(callback);
    let that = this;
    this.store.store.forEach((item) => {
      // console.log(item)
      item.draw(that.canvas, that.info.scale, that.info.realSize);
    });
    callback ? this.canvas.draw(false, callback) : this.canvas.draw(false);
    console.log('draw complete');
  }
  // 外置触摸开始
  touchStart (e) {
    this.isMouseMove = false;
    this.judgeCanMoveItem(e);
  }
  // 外置触摸移动
  touchMove (e) {
    this.isMouseMove = true;
    this.canMove && this.handleMoveEvent(e);
    this.scaleControl.canShapeTrans() && this.scaleControl.handleTransEvent(e);
    // 全部画出来
    this.draw();
  }
  // 触摸结束
  touchEnd (e) {
    this.canMove = false;
    // 点击事件回调函数
    this.isMouseMove === false && this.handleClickEvent(e);
    this.scaleControl.stopTransfrom();
    this.scaleControl.resetTransform();
  }
  // 清除所有图像，不可恢复
  clear () {
    this.store.clear();
    this.draw();
  }
  clearStore () {
    this.store.clear();
  }
  // 撤销
  cancel (cancelNum) {
    cancelNum = cancelNum || 1;
    this.store.cancel(cancelNum);
    this.draw();
  }
  // 恢复
  resume () {
    this.store.resume();
    this.draw();
  }
  // 删除
  delete (item) {
    this.store.delete(item);
    this.draw();
  }
  update (data) {
    this.draw();
  }
  /* 保存图片，外部调用
  * @param {boolean} loadingText loading文字
  * @param {string} successText 成功文字
  * @param {Function} failCallback 授权失败回调函数
  */
  saveImage ({loadingText = null, successText = null, imagePreview = false}, callback = undefined) {
    console.log('save begin');
    loadingText && wx.showLoading({
      title: loadingText
    });
    this._saveCanvasToPthotosAlbum(imagePreview, successText, callback);
  }
  // 保存canvas到相册
  _saveCanvasToPthotosAlbum (imagePreview, successText, callback) {
    let _this = this;
    console.log(_this.canvas);
    // canvas转图片并获取路径
    wx.canvasToTempFilePath({
      canvasId: _this.canvas.canvasId,
      success: function (res) {
        // 图片预览
        imagePreview && wx.previewImage({
          current: res.tempFilePath,
          urls: [res.tempFilePath]
        });
        console.log('canvasUrl :' + res.tempFilePath);
        // 获取路径后保存图片到相册s
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success () {
            console.log('save complete');
            wx.hideLoading();
            // 成功之后关掉loading并提示已保存
            if (successText) {
              wx.showToast({
                title: successText,
                icon: 'success',
                duration: 1000
              });
            }
            callback && callback(true);
          },
          fail (err) {
            wx.hideLoading();
            callback && callback(false);
            console.warn(err);
          }
        });
      }
    });
  }
}
//  感觉这样好像不太好 先这么滴吧
// WxCanvas.prototype = Object.assign(WxCanvas.prototype, canvasFunction)
extendsCommonMethods(WxCanvas.prototype, canvasFunction);

export { WxCanvas, Shape };
