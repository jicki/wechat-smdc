// 引入API和工具函数
const API = require('../../utils/api')
const { showToast, showLoading, hideLoading } = require('../../utils/util')

Page({
  data: {
    order: null,
    paymentMethod: 'wxpay', // 默认微信支付
    loading: false,
    orderNo: '',
    tableNo: null // 添加桌台号字段
  },

  onLoad: function (options) {
    // 获取全局应用实例
    const app = getApp()
    
    // 检查登录状态，确保用户已登录
    if (!app.globalData.isLogin) {
      // 如果未登录，跳转到登录页面
      console.log('支付页面：未登录，跳转到登录页面')
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }
    
    console.log('支付页面：已登录，加载订单数据')
    // 已登录，加载订单数据
    // 获取订单号
    const { orderNo } = options
    if (orderNo) {
      this.setData({ orderNo })
      // 获取订单详情
      this.getOrderDetail(orderNo)
    } else {
      // 获取订单数据
      this.getOrderData()
    }
  },
  
  // 获取订单详情
  getOrderDetail: function(orderNo) {
    console.log('开始获取订单详情，订单号:', orderNo)
    showLoading('加载订单信息')
    
    // 先尝试从全局数据获取订单信息
    const app = getApp()
    const pendingOrder = app.globalData.pendingOrder
    
    // 如果全局数据中有订单信息，并且订单号匹配，直接使用
    if (pendingOrder && pendingOrder.orderNo === orderNo) {
      console.log('从全局数据获取到订单信息:', pendingOrder)
      hideLoading()
      
      // 处理订单数据，确保兼容前端显示
      const processedOrder = this.processOrderData(pendingOrder)
      
      // 获取桌台号
      const tableNo = processedOrder.tableNo || app.getTableNo()
      
      this.setData({
        order: processedOrder,
        tableNo,
        orderNo: processedOrder.orderNo
      })
      
      return
    }
    
    // 调用API获取订单详情
    API.getOrderDetail(orderNo)
      .then(order => {
        hideLoading()
        console.log('API返回的订单详情:', order)
        
        if (!order) {
          console.error('API返回的订单详情为空')
          showToast('未找到订单详情')
          return
        }
        
        // 处理订单数据，确保兼容前端显示
        const processedOrder = this.processOrderData(order)
        
        // 获取桌台号
        const tableNo = processedOrder.tableNo || app.getTableNo()
        
        this.setData({
          order: processedOrder,
          tableNo,
          orderNo: processedOrder.orderNo
        })
      })
      .catch(err => {
        hideLoading()
        console.error('获取订单详情失败:', err)
        showToast('获取订单详情失败')
      })
  },
  
  // 处理订单数据，确保兼容前端显示
  processOrderData: function(order) {
    if (!order) return null
    
    // 创建一个新对象，避免修改原始数据
    const processedOrder = {...order}
    
    // 确保订单ID和订单号都存在
    if (!processedOrder.orderNo) {
      processedOrder.orderNo = String(processedOrder.id)
    }
    if (!processedOrder.id) {
      processedOrder.id = processedOrder.orderNo
    }
    
    // 处理订单状态
    if (typeof processedOrder.status === 'number') {
      // 后端状态: 0-待支付 1-已完成 2-已取消
      switch(processedOrder.status) {
        case 0:
          processedOrder.status = 'PENDING'
          break
        case 1:
          processedOrder.status = 'COMPLETED'
          break
        case 2:
          processedOrder.status = 'CANCELLED'
          break
      }
    }
    
    // 处理订单详情
    if (processedOrder.orderDetails && Array.isArray(processedOrder.orderDetails)) {
      // 如果有orderDetails字段，将其转换为items格式以兼容前端显示
      processedOrder.items = processedOrder.orderDetails.map(detail => ({
        id: detail.dishId,
        name: detail.dishName,
        price: detail.dishPrice,
        quantity: detail.quantity,
        amount: detail.amount
      }))
    } else if (processedOrder.items && !processedOrder.orderDetails) {
      // 如果只有items字段，创建orderDetails字段
      processedOrder.orderDetails = processedOrder.items.map(item => ({
        dishId: item.id,
        dishName: item.name,
        dishPrice: item.price,
        quantity: item.quantity,
        amount: item.price * item.quantity
      }))
    }
    
    // 确保totalAmount字段存在
    if (!processedOrder.totalAmount && processedOrder.totalPrice) {
      processedOrder.totalAmount = processedOrder.totalPrice
    } else if (!processedOrder.totalPrice && processedOrder.totalAmount) {
      processedOrder.totalPrice = processedOrder.totalAmount
    }
    
    // 确保餐厅名称字段存在
    if (!processedOrder.restaurantName && processedOrder.shopName) {
      processedOrder.restaurantName = processedOrder.shopName
    }
    
    return processedOrder
  },
  
  // 获取订单数据
  getOrderData: function () {
    console.log('尝试从全局数据获取订单信息')
    const app = getApp()
    const pendingOrder = app.globalData.pendingOrder
    
    console.log('全局订单数据:', pendingOrder)
    
    if (!pendingOrder) {
      console.error('全局订单数据不存在')
      showToast('订单数据不存在')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }
    
    // 获取桌台号
    const tableNo = pendingOrder.tableNo || app.getTableNo()
    
    this.setData({
      order: pendingOrder,
      orderNo: pendingOrder.orderNo || pendingOrder.id,
      tableNo
    })
    
    console.log('已设置订单数据:', this.data.order)
  },
  
  // 选择支付方式
  selectPaymentMethod: function (e) {
    const { method } = e.currentTarget.dataset
    
    this.setData({
      paymentMethod: method
    })
  },
  
  // 提交支付
  submitPayment: function () {
    const { order, paymentMethod, tableNo, orderNo } = this.data
    
    if (!order) {
      showToast('订单数据不存在')
      return
    }
    
    // 检查订单号
    if (!orderNo) {
      showToast('订单号不存在')
      return
    }
    
    console.log('开始支付订单，使用订单号:', orderNo)
    
    // 显示加载中
    this.setData({ loading: true })
    showLoading('支付处理中')
    
    // 支付订单
    API.payOrder(orderNo)
      .then(res => {
        hideLoading()
        this.setData({ loading: false })
        
        console.log('支付成功，返回结果:', res)
        
        // 支付成功，清空购物车
        const app = getApp()
        app.clearCart()
        
        // 显示支付成功提示
        showToast('支付成功', 'success')
        
        // 跳转到订单页面
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/order/order'
          })
        }, 1500)
      })
      .catch(err => {
        hideLoading()
        this.setData({ loading: false })
        
        console.error('支付失败:', err)
        showToast('支付失败: ' + (err.message || JSON.stringify(err)))
      })
  },
  
  // 取消支付
  cancelPayment: function () {
    wx.navigateBack()
  }
}) 