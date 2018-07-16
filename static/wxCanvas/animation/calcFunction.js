// 动画循环
export function drawAnimationStep (callback) {
  setTimeout(() => {
    callback()
  }, 30)
}
