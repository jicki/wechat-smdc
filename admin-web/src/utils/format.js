/**
 * 格式化日期
 * @param {Date} date 日期
 * @param {String} fmt 格式
 * @returns {String} 格式化后的日期
 */
export function formatDate(date, fmt = 'yyyy-MM-dd HH:mm:ss') {
  if (!date) return ''
  
  // 处理日期字符串
  if (typeof date === 'string') {
    // 尝试直接创建日期对象
    let parsedDate = new Date(date)
    
    // 检查日期是否有效
    if (isNaN(parsedDate.getTime())) {
      // 如果无效，尝试替换 '-' 为 '/'
      parsedDate = new Date(date.replace(/-/g, '/'))
    }
    
    date = parsedDate
  }
  
  // 处理时间戳
  if (typeof date === 'number') {
    date = new Date(date)
  }
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', date)
    return 'Invalid date'
  }
  
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

/**
 * 格式化金额
 * @param {Number} money 金额
 * @param {Number} decimals 小数位数
 * @returns {String} 格式化后的金额
 */
export function formatMoney(money, decimals = 2) {
  if (!money && money !== 0) return ''
  money = parseFloat(money)
  return money.toFixed(decimals)
}

/**
 * 格式化订单状态
 * @param {Number} status 状态码
 * @returns {String} 状态名称
 */
export function formatOrderStatus(status) {
  const statusMap = {
    0: '待支付',
    1: '已支付',
    2: '已完成',
    3: '已取消'
  }
  return statusMap[status] || '未知状态'
}

/**
 * 格式化支付方式
 * @param {Number} payMethod 支付方式
 * @returns {String} 支付方式名称
 */
export function formatPayMethod(payMethod) {
  const payMethodMap = {
    0: '微信支付'
  }
  return payMethodMap[payMethod] || '未知方式'
} 