// app.js
App({
  onLaunch: function (options) {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 清除登录状态，确保每次启动都需要重新登录
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    this.globalData.isLogin = false
    this.globalData.userInfo = null
    console.log('已清除登录状态，需要重新登录')

    // 检查登录状态，但不自动登录
    this.checkLoginStatus()
    
    // 处理启动参数，检查是否有桌台号
    this.handleLaunchOptions(options)
    
    console.log('小程序启动，登录状态:', this.globalData.isLogin)
  },
  
  // 添加onShow方法处理小程序从后台切换到前台时的场景
  onShow: function(options) {
    // 处理启动参数，检查是否有桌台号
    this.handleLaunchOptions(options)
    
    // 处理页面分享参数
    this.handlePageShareOptions(options)
  },
  
  // 处理小程序启动参数
  handleLaunchOptions: function(options) {
    console.log('启动参数:', options)
    
    // 如果是扫码进入，尝试获取桌台号
    if (options.scene === 1047 || options.scene === 1048 || options.scene === 1049) {
      // 扫描小程序码、扫描二维码或长按图片识别二维码打开
      const query = options.query || {}
      if (query.tableNo) {
        // 保存桌台号到全局数据
        this.globalData.tableNo = query.tableNo
        console.log('获取到桌台号:', query.tableNo)
      }
    }
  },
  
  // 处理页面分享参数
  handlePageShareOptions: function(options) {
    console.log('分享参数:', options)
    
    // 如果是分享链接进入，尝试获取桌台号
    const query = options.query || {}
    if (query.tableNo) {
      // 保存桌台号到全局数据
      this.globalData.tableNo = query.tableNo
      console.log('获取到桌台号:', query.tableNo)
    }
  },

  checkLoginStatus: function (callback) {
    // 检查登录状态
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    
    console.log('检查登录状态 - token:', token ? '存在' : '不存在', 'userInfo:', userInfo ? '存在' : '不存在')
    
    if (token && userInfo) {
      this.globalData.isLogin = true
      this.globalData.userInfo = userInfo
      console.log('已登录，用户信息:', userInfo)
      
      // 如果有回调函数，执行回调
      if (typeof callback === 'function') {
        callback(true)
      }
      
      return true
    } else {
      this.globalData.isLogin = false
      console.log('未登录，需要登录')
      
      // 如果有回调函数，执行回调
      if (typeof callback === 'function') {
        callback(false)
      }
      
      return false
    }
  },
  
  // 添加MOCK登录方法
  mockLogin: function(callback) {
    console.log('尝试使用MOCK账户登录')
    const API = require('./utils/api')
    
    // 使用MOCK账户数据
    const mockUserData = {
      phone: 'admin',
      password: '123456'
    }
    
    // 调用登录API
    API.login(mockUserData)
      .then(res => {
        // 保存token
        wx.setStorageSync('token', res.token)
        
        // 保存用户信息
        wx.setStorageSync('userInfo', res.userInfo)
        
        // 更新全局登录状态
        this.globalData.isLogin = true
        this.globalData.userInfo = res.userInfo
        
        console.log('MOCK登录成功:', res.userInfo)
        
        // 如果有回调函数，执行回调
        if (typeof callback === 'function') {
          callback(true)
        }
      })
      .catch(err => {
        console.error('MOCK登录失败:', err)
        
        // 如果有回调函数，执行回调
        if (typeof callback === 'function') {
          callback(false)
        }
      })
  },

  globalData: {
    userInfo: null,
    isLogin: false,
    selectedRestaurant: null,
    tableNo: null, // 桌台号
    cart: {
      restaurantId: null,
      items: [],
      totalPrice: 0
    }
  },

  // 添加商品到购物车
  addToCart: function (item) {
    const cart = this.globalData.cart
    
    // 如果购物车为空或者餐厅ID不同，清空购物车
    if (cart.restaurantId !== item.restaurantId) {
      cart.items = []
      cart.totalPrice = 0
      cart.restaurantId = item.restaurantId
    }
    
    // 检查购物车中是否已有该商品
    const existItem = cart.items.find(cartItem => cartItem.id === item.id)
    
    if (existItem) {
      existItem.quantity += 1
    } else {
      cart.items.push({
        ...item,
        quantity: 1
      })
    }
    
    // 重新计算总价
    this.calculateCartTotal()
  },
  
  // 从购物车移除商品
  removeFromCart: function (itemId) {
    const cart = this.globalData.cart
    const index = cart.items.findIndex(item => item.id === itemId)
    
    if (index !== -1) {
      if (cart.items[index].quantity > 1) {
        cart.items[index].quantity -= 1
      } else {
        cart.items.splice(index, 1)
      }
      
      // 重新计算总价
      this.calculateCartTotal()
    }
  },
  
  // 计算购物车总价
  calculateCartTotal: function () {
    const cart = this.globalData.cart
    let total = 0
    
    cart.items.forEach(item => {
      total += item.price * item.quantity
    })
    
    cart.totalPrice = total
  },
  
  // 清空购物车
  clearCart: function () {
    this.globalData.cart = {
      restaurantId: null,
      items: [],
      totalPrice: 0
    }
  },
  
  // 设置桌台号
  setTableNo: function(tableNo) {
    this.globalData.tableNo = tableNo
  },
  
  // 获取桌台号
  getTableNo: function() {
    return this.globalData.tableNo
  },
  
  // 清除桌台号
  clearTableNo: function() {
    this.globalData.tableNo = null
  }
}) 