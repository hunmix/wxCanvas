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
    this.m = pointsArray.length
    this.n = pointsArray[0].length
    this.matrixArray = pointsArray
  }
  // 矩阵乘法
  multi (matrix) {
    const Points = []
    if (matrix.m === this.n) {
      this.matrixArray.forEach(function (everyM, _index) { // 将每一行拎出来
        // console.log(everyM)
        Points.push([])
        // console.log(matrix.n)
        for (let i = 0; i < matrix.n; i++) { // 要乘多少次，即一列中有几个元素
          let result = 0
          everyM.forEach(function (_everN, index) { // 每一行的每一个 x matrix对应元素 然后加起来 = 一个结果
            result += _everN * matrix.matrixArray[index][i] // 最小城乘数因子
          })
          // //console.log(_p)
          Points[_index][i] = result // 把结果扔到新矩阵里面去
        }
      }, this)
      // 返回计算后的矩阵
      return new Matrix(Points)
    } else {
      // m和n不同时矩阵无法做乘法
      console.warn('矩阵无法相乘')
      return false
    }
  }
  // 矩阵加法
  add (matrix) {
    const Points = []
    if (matrix.m === this.m && matrix.n === this.n) {
      this.matrixArray.forEach(function (everyM, index) {
        Points.push([])
        everyM.forEach(function (_everN, _index) { // 每一行的每一个
          Points[index][_index] = _everN + matrix.matrixArray[index][_index] // 最小城乘数因子
        })
      })
      return new Matrix(Points)
    } else {
      // 矩阵规模不一样时无法相加，即m=m&&n=n
      console.warn('矩阵无法相加')
      return false
    }
  }
  // 矩阵减法
  sub (matrix) {
    const Points = []
    if (matrix.m === this.m && matrix.n === this.n) {
      this.matrixArray.forEach(function (everyM, index) {
        Points.push([])
        everyM.forEach(function (_everN, _index) { // 每一行的每一个
          Points[index].push(_everN - matrix.matrixArray[index][_index]) // 最小城乘数因子
        })
      })
      return new Matrix(Points)
    }
  }
}

export {Matrix}
