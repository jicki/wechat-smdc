// 引入工具函数和API
const { showToast, showModal } = require('../../utils/util')
const API = require('../../utils/api')

Page({
  data: {
    cart: {
      items: [],
      totalPrice: 0
    },
    restaurant: null,
    remark: '',
    tableNo: null // 添加桌台号字段
  },

  onLoad: function (options) {
    // 获取全局应用实例
    const app = getApp()
    
    // 检查登录状态，确保用户已登录
    if (!app.globalData.isLogin) {
      // 如果未登录，跳转到登录页面
      console.log('购物车页面：未登录，跳转到登录页面')
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }
    
    console.log('购物车页面：已登录，加载购物车数据')
    // 已登录，加载购物车数据
    this.initCartData(options, app)
  },
  
  onShow: function () {
    // 每次显示页面时更新购物车数据
    this.getCartData()
    
    // 检查全局桌台号是否有更新
    const app = getApp()
    const tableNo = app.getTableNo()
    if (tableNo && tableNo !== this.data.tableNo) {
      this.setData({ tableNo })
    }
  },
  
  // 初始化购物车数据
  initCartData: function(options, app) {
    // 处理桌台号
    const { tableNo } = options
    if (tableNo) {
      // 保存到全局数据
      app.setTableNo(tableNo)
      this.setData({ tableNo })
    } else {
      // 尝试从全局数据获取桌台号
      const globalTableNo = app.getTableNo()
      if (globalTableNo) {
        this.setData({ tableNo: globalTableNo })
      }
    }
    
    // 获取购物车数据
    this.getCartData()
  },
  
  // 获取购物车数据
  getCartData: function () {
    const app = getApp()
    const cart = app.globalData.cart
    const restaurant = app.globalData.selectedRestaurant
    
    // 如果购物车为空，提示用户并返回上一页
    if (!cart.items || cart.items.length === 0) {
      showToast('购物车为空')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }
    
    this.setData({
      cart,
      restaurant
    })
  },
  
  // 添加商品数量
  addItem: function (e) {
    const { id } = e.currentTarget.dataset
    const app = getApp()
    
    // 查找商品
    const item = this.data.cart.items.find(item => item.id === id)
    if (item) {
      app.addToCart(item)
      this.getCartData()
    }
  },
  
  // 减少商品数量
  removeItem: function (e) {
    const { id } = e.currentTarget.dataset
    const app = getApp()
    
    app.removeFromCart(id)
    this.getCartData()
  },
  
  // 清空购物车
  clearCart: function () {
    showModal('清空购物车', '确定要清空购物车吗？')
      .then(res => {
        if (res) {
          const app = getApp()
          app.clearCart()
          
          showToast('购物车已清空')
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      })
  },
  
  // 输入备注
  inputRemark: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  
  // 提交订单
  submitOrder: function () {
    const { cart, restaurant, remark, tableNo } = this.data
    const app = getApp()
    
    // 检查购物车是否为空
    if (!cart.items.length) {
      showToast('购物车为空，请先添加商品')
      return
    }
    
    // 检查是否有餐厅信息
    if (!restaurant) {
      showToast('餐厅信息不存在')
      return
    }
    
    // 确保应用处于登录状态
    if (!app.globalData.isLogin) {
      app.checkLoginStatus()
    }
    
    // 构建订单数据
    const orderData = {
      shopId: restaurant.id,
      shopName: restaurant.name,
      orderDetails: cart.items.map(item => ({
        dishId: item.id,
        dishName: item.name,
        quantity: item.quantity,
        dishPrice: item.price,
        amount: item.price * item.quantity
      })),
      totalAmount: cart.totalPrice,
      remark
    }
    
    // 如果有桌台号，则添加到订单数据中
    if (tableNo) {
      orderData.tableNo = tableNo
    }
    
    console.log('提交订单数据:', orderData)
    
    // 调用API创建订单
    wx.showLoading({ title: '提交订单中', mask: true })
    
    API.createOrder(orderData)
      .then(result => {
        wx.hideLoading()
        console.log('创建订单成功，返回数据:', result)
        
        // 处理不同类型的返回结果
        let orderDetail = null
        
        // 情况1: 后端直接返回完整订单信息
        if (result && typeof result === 'object' && result.id) {
          console.log('后端返回完整订单信息')
          orderDetail = result
          
          // 直接处理并跳转
          this.processOrderAndNavigate(orderDetail, app)
          return orderDetail
        }
        // 情况2: 后端只返回订单ID (数字)
        else if (typeof result === 'number' || (typeof result === 'string' && !isNaN(result))) {
          console.log('后端只返回订单ID:', result)
          const orderId = result
          
          // 需要额外请求订单详情
          return API.getOrderDetail(orderId)
            .then(detail => {
              if (!detail) {
                console.error('获取订单详情失败，返回数据为空')
                showToast('获取订单详情失败')
                return null
              }
              
              orderDetail = detail
              this.processOrderAndNavigate(orderDetail, app)
              return orderDetail
            })
            .catch(err => {
              console.error('获取订单详情失败:', err)
              
              // 即使获取详情失败，也可以使用基本订单数据
              const basicOrder = {
                ...orderData,
                id: orderId,
                orderNo: String(orderId),
                status: 0 // 待支付
              }
              
              this.processOrderAndNavigate(basicOrder, app)
              return null
            })
        }
        // 情况3: 无效返回
        else {
          console.error('创建订单返回数据格式错误:', result)
          showToast('创建订单失败，返回数据格式错误')
          return null
        }
      })
      .catch(err => {
        wx.hideLoading()
        console.error('创建订单失败:', err)
        showToast('创建订单失败，请重试')
      })
  },
  
  // 处理订单数据并跳转到支付页面
  processOrderAndNavigate: function(orderDetail, app) {
    // 将订单数据存储到全局变量，以便在支付页面使用
    app.globalData.pendingOrder = orderDetail
    
    console.log('存储到全局的订单数据:', app.globalData.pendingOrder)
    
    // 清空购物车
    app.clearCart()
    
    // 跳转到支付页面，使用订单号或订单ID
    const orderIdentifier = orderDetail.orderNo || orderDetail.id
    wx.navigateTo({
      url: `/pages/payment/payment?orderNo=${orderIdentifier}`
    })
  }
}) 