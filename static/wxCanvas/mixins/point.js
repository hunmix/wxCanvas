import {Matrix} from './../matrix/matrix'
class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
  // 一般来说origin传图形中心坐标
  rotate (origin, angle) {
    const rad = angle * Math.PI / 180
    // 神tm不是translate和rotate形式，惊了！
    // (x： 0 y: 0, w： 100，h: 100)
    // (origin.x: 50, origin.y: 50) origin点
    // (tx: -50, ty: -50) 距x,y距离
    // origin对我来说就是，中心点坐标，
    if (origin) {
      let tx = -origin.x + this.x
      let ty = -origin.y + this.y
      let AtranslateMatrix = new Matrix([
        [origin.x],
        [origin.y]
      ]) // 平移
      let rotateMatrix = new Matrix([
        [Math.cos(rad), -Math.sin(rad)],
        [Math.sin(rad), Math.cos(rad)]
      ]) // 旋转
      console.log(Math.cos(angle), -Math.sin(angle))
      let getChangeMatrix = new Matrix([
        [tx], [ty]
      ])
      let _temMatrix = rotateMatrix.multi(getChangeMatrix).add(AtranslateMatrix)
      return _temMatrix.matrixArray
    }
  }
}

export {Point}
