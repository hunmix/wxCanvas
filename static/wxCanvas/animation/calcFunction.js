// 动画循环
export function drawAnimationStep (callback) {
  setTimeout(() => {
    callback()
  }, 30)
}
export function judgePositionMethod () {
  console.log('我被调用了')
}
