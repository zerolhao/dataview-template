import config from '@/config/index'
const { IS_REM, PAGE_SIZE } = config

export const randomString = function (
  length = 30,
  chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
) {
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}
export const randomNumber = function (max = 10, pre = 0) {
  return (Math.random() * max).toFixed(pre) - 0
}

export const getPageParams = function () {
  const width = document.documentElement.clientWidth || document.body.clientWidth
  const height = document.documentElement.clientHeight || document.body.clientHeight
  const min32Ratio = 3.2 // 3840/1080=3.555555555555556
  const curRatio = width / height
  const is32 = curRatio >= min32Ratio
  let scale = 1
  // if (is32) {
  //   // 原16：9兼容32
  //   // 32比例与16比例高度相同，因此scale相同，通过css自适应宽度来达到兼容
  //   scale = width / 2 / PAGE_SIZE
  // } else {
  //   scale = width / PAGE_SIZE
  // }
  scale = width / PAGE_SIZE
  // console.log('比例', curRatio)
  // console.log('width', width)
  // console.log('PAGE_SIZE', PAGE_SIZE)
  // console.log('scale', scale)
  return { scale, width, height, curRatio, is32 }
}
export const countPx = function (val) {
  if (!IS_REM) return val
  const { scale } = getPageParams()
  return val * scale
}
/*
 *  description: 在vue中使用的防抖函数
 *  param fn {Function}  函数
 *  param time {Number}    延迟时间
 *  return: 处理后的执行函数
 * use: methods: { clickHandler: debounce(function () {...}) }
 */
export const debounce = function (fn, time = 300) {
  let timeout = null
  return function () {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(fn.bind(this), time)
  }
}
// 数组分割n个一组
export const chunk = function (data = [], number = 3) {
  var result = []
  for (var i = 0, len = data.length; i < len; i += number) {
    result.push(data.slice(i, i + number))
  }
  return result
}

// 姓名脱敏
export const fmtName = function (val, empty = '/') {
  if (!val) return empty
  const len = val.length
  if (len === 2) {
    return val[0] + '*'
  } else {
    const str = new Array(len - 2).fill('*').join('')
    return val.replace(/^(.).+(.)$/, `$1${str}$2`)
  }
}
// 手机号脱敏
export const fmtPhone = function (val, empty = '/') {
  return (val && val.replace(/^(.{3}).+(.{4})$/, '$1****$2')) || empty
}
// 电话脱敏
export const fmtTel = function (val, empty = '/') {
  if (!val) return empty
  val += ''
  if (/^1[3-9]\d{9}$/.test(val)) {
    return val.replace(/^(.{3}).+(.{4})$/, '$1****$2')
  } else {
    const hasPrefix = val.indexOf('-') !== -1
    if (hasPrefix) return val.replace(/^(.{4}).+(.{4})$/, '$1****$2')
    else return val.replace(/^(.{3}).+(.{2})$/, '$1****$2')
  }
}
// 18位证号脱敏
export const fmtCode = function (val, empty = '/') {
  return (val && val.replace(/^(.{6}).+(.{4})$/, '$1****$2')) || empty
}
export const isEmpty = function (val, arr = ['', undefined, null]) {
  var b = false
  arr.forEach((key) => {
    if (val === key) b = true
  })
  return b
}
export const noEmpty = function (val, arr = ['', undefined, null]) {
  return !isEmpty(val, arr)
}

export const getQuery = function (variable) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return null
}

export const isPartChinese = (str) => {
  const reg = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi
  return !!reg.exec(str)
}

export const removeFaildLoadImg = (e) => {
  // console.log('img load err', e)
  // e.target.remove() // 会引起vue报错
  e.target.style = 'display:none'
}

// 案件状态
export const filterState = (state) => {
  if (state == 1) return '已上报'
  if (state == 2) return '处置中'
  if (state == 3) return '已完成'
  if (state == 4) return '已作废/归档'
  return '--'
}
// 案件流转的状态
export const filterStatus = (state) => {
  if (state == 1) return '核实反馈'
  if (state == 2) return '核验派单'
  if (state == 3) return '二级平台转派'
  if (state == 4) return '接单反馈'
  if (state == 5) return '处置反馈'
  if (state == 6) return '重新派单'
  if (state == 7) return '结案反馈'
  if (state == 8) return '预审反馈'
  if (state == 9) return '核查反馈'
  if (state == 10) return '归档(作废)反馈(作废)反馈'
  return '--'
}

/**
 * 获取文本的实际宽度
 *
 * @param {string} text - 要测量宽度的文本字符串
 * @param {Object} options - 可选参数对象
 * @param {number} options.size - 字体大小，默认值为14
 * @param {string} options.family - 字体族，默认值为'Microsoft YaHei'
 * @returns {number} 返回文本的实际宽度
 */
export const getActualWidthOfChars = (text, options = {}) => {
  const { size = 14, family = 'Microsoft YaHei' } = options
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = `${size}px ${family}`
  const metrics = ctx.measureText(text)
  const actual = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight)
  return Math.max(metrics.width, actual)
}

export const getUrlParam = (key) => {
  const url = decodeURI(window.location.href.replace(/^[^?]*\?/, ''))
  const regexp = new RegExp(`(^|&)${key}=([^&#]*)(&|$|)`, 'i')
  const paramMatch = url.match(regexp)

  return paramMatch ? paramMatch[2] : ''
}

export const getParamKey = (key) => {
  if (getUrlParam(key)) {
    return getUrlParam(key)
  }
  switch (key) {
    case 'userId':
      return `user_${Math.floor(Math.random() * 100000000)}`
    // return localStorage.getItem("userId");
    case 'roomId':
      // return Math.floor(Math.random() * 100000);
      return 45678
    case 'sdkAppId':
      return 1600103585
    case 'sdkSecretKey':
      return '4286756c159fcce5da53d3cdc5d1b73da01692b7e607b00a1c0f9be63e40b20a'
    default:
      return undefined
  }
}

export const docOnceClick = (fn) => {
  document.documentElement.addEventListener('click', fn, {
    once: true
  })
}

export default {
  randomString,
  randomNumber,
  getPageParams,
  countPx,
  debounce,
  chunk,
  fmtName,
  fmtPhone,
  fmtTel,
  fmtCode,
  isEmpty,
  noEmpty,
  getQuery,
  isPartChinese,
  removeFaildLoadImg,
  filterState,
  getActualWidthOfChars,
  getParamKey
}
