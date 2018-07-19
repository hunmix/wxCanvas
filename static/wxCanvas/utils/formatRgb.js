export function hex2rgb (hexValue) {
  // 如果是三位数的值则转化成6位
  const has3Num = /#[\da-fA-F]{3}$/.test(hexValue)
  if (has3Num) {
    const stack = hexValue.split('').slice(1)
    const len = stack.length
    const arr = []
    for (let i = 0; i < len; i++) {
      let tempValue = stack.pop()
      for (let i = 0; i < 2; i++) {
        arr.unshift(tempValue)
      }
    }
    let hexString = arr.join('')
    hexValue = `#${hexString}`
  }
  const hexParrten = /^#?([a-fA-F\d]{2})([a-fA-F\d]{2})([a-fA-F\d]{2})$/i
  const result = hexParrten.exec(hexValue)
  console.log(result)
  // 转化成rgb格式
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 1
  } : null
}
// rgb格式化
export function formatRgb (rgbValue) {
  console.log(rgbValue)
  // const rgbPattern = /^[rR][gG][bB]\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
  const rgbPattern = /^[rR][gG][bB][aA]?\(\s*(\d{1,3}.?\d*)\s*,\s*(\d{1,3}.?\d*)\s*,\s*(\d{1,3}.?\d*)\s*,?\s*(0|1|0\.\d{1,2}|\.\d{1,2})?\s*\)\s*$/
  const result = rgbPattern.exec(rgbValue)
  const alpha = /\.\d{1,2}/
  console.log(result)
  // 透明度为.5之类数字的时候前面加0
  if (alpha.test(result[4])) {
    result[4] = `0${result[4]}`
  }
  console.log(parseFloat(result[4]))
  return result ? {
    r: parseInt(result[1]),
    g: parseInt(result[2]),
    b: parseInt(result[3]),
    a: result[4] ? parseFloat(result[4]) : 1
  } : null
}
