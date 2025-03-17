// 格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 显示提示信息
const showToast = (title, icon = 'none') => {
  wx.showToast({
    title,
    icon,
    duration: 2000
  })
}

// 显示加载中
const showLoading = (title = '加载中') => {
  wx.showLoading({
    title,
    mask: true
  })
}

// 隐藏加载中
const hideLoading = () => {
  wx.hideLoading()
}

// 显示模态框
const showModal = (title, content, showCancel = true) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      showCancel,
      success(res) {
        if (res.confirm) {
          resolve(true)
        } else if (res.cancel) {
          resolve(false)
        }
      },
      fail() {
        reject(new Error('模态框显示失败'))
      }
    })
  })
}

// 获取当前位置
const getLocation = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 防抖函数
const debounce = (fn, delay = 500) => {
  let timer = null
  return function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}

// 节流函数
const throttle = (fn, delay = 500) => {
  let last = 0
  return function() {
    const now = Date.now()
    if (now - last > delay) {
      fn.apply(this, arguments)
      last = now
    }
  }
}

// 生成随机订单号
const generateOrderNo = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const random = Math.floor(Math.random() * 1000)
  
  return `${year}${formatNumber(month)}${formatNumber(day)}${formatNumber(hour)}${formatNumber(minute)}${formatNumber(second)}${formatNumber(random)}`
}

module.exports = {
  formatTime,
  showToast,
  showLoading,
  hideLoading,
  showModal,
  getLocation,
  debounce,
  throttle,
  generateOrderNo
} 