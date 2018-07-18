// 处理颜色渐变方面的计算
import {hex2rgb, formatRgb} from '../utils/formatRgb'

/** 处理颜色渐变
 * @param {String} animationInfo 要处理的颜色
 * @param {Number} goesbyRatio 已经经过的时间比值 goesbyTime / duration
 * @param {String} startOptionColor 开始时的颜色
 * @returns {String} 一个用rgba表示颜色的字符串
 */
function calcColorChange (animationInfo, goesbyRatio, startOptionColor) {
  console.log(goesbyRatio)
  const startColor = _getFormatRgb(startOptionColor)
  const currentColor = _getFormatRgb(animationInfo)
  console.log(currentColor)
  const changedColorStep = {
    cr: (currentColor.r - startColor.r) * goesbyRatio,
    cg: (currentColor.g - startColor.g) * goesbyRatio,
    cb: (currentColor.b - startColor.b) * goesbyRatio,
    ca: (currentColor.a - startColor.a) * goesbyRatio
  }
  const currentRgb = {
    r: startColor.r + changedColorStep.cr,
    g: startColor.g + changedColorStep.cg,
    b: startColor.b + changedColorStep.cb,
    a: startColor.a + changedColorStep.ca
  }
  return `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${currentRgb.a})`
}

/** 格式化，把所有颜色都他喵转换成rgba形式
 * @param {String} colorValue 颜色值
 * @returns {String} rgba形式的颜色
 */
function _getFormatRgb (colorValue) {
  const hexPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
  // const rgbPattern = /[rR][gG][bB]\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)/
  const rgbPattern = /^[rR][gG][bB][aA]?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,?(\s*0|\s*1|\s*0\.\d{1,2}|\s*\.\d{1,2})?\s*\)\s*$/
  let result = null
  if (hexPattern.test(colorValue)) {
    result = hex2rgb(colorValue)
  } else if (rgbPattern.test(colorValue)) {
    result = formatRgb(colorValue)
  } else {
    result = getColorValue(colorValue)
  }
  console.log(result)
  return result
}

function getColorValue (colorValue) {
  const colorName = colorValue.toLowerCase()
  const color = colorList[colorName]
  let result = null
  if (color) {
    result = hex2rgb(color)
  } else {
    console.warn('输入颜色不合法')
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

}
export {calcColorChange}
