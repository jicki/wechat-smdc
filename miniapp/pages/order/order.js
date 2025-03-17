// 引入API和工具函数
const API = require('../../utils/api')
const { showToast, showLoading, hideLoading, showModal } = require('../../utils/util')

Page({
  data: {
    orders: [],
    filteredOrders: [],
    loading: true,
    currentTab: 0, // 0: 全部订单, 1: 待支付, 2: 已完成, 3: 已取消
    tabs: ['全部', '待支付', '已完成', '已取消'],
    pageNum: 1,
    pageSize: 10,
    hasMore: true
  },

  onLoad: function (options) {
    // 获取全局应用实例
    const app = getApp()
    
    // 检查登录状态，确保用户已登录
    if (!app.globalData.isLogin) {
      // 如果未登录，跳转到登录页面
      console.log('订单页面：未登录，跳转到登录页面')
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }
    
    console.log('订单页面：已登录，加载订单列表')
    // 已登录，加载订单列表
    this.getOrderList()
  },
  
  onShow: function () {
    // 每次显示页面时重置页码并更新订单列表
    this.setData({
      pageNum: 1,
      hasMore: true
    })
    this.getOrderList(true)
  },
  
  // 获取订单列表
  getOrderList: function (refresh = false) {
    const { currentTab, pageNum, pageSize, orders } = this.data
    
    // 如果是刷新，显示加载中
    if (refresh || pageNum === 1) {
      showLoading('加载中')
      this.setData({ loading: true })
    }
    
    // 根据当前标签确定要请求的订单状态
    let status
    switch (currentTab) {
      case 0: // 全部
        status = undefined
        break
      case 1: // 待支付
        status = 0
        break
      case 2: // 已完成
        status = 1
        break
      case 3: // 已取消
        status = 2
        break
    }
    
    console.log('请求订单列表，状态:', status, '页码:', pageNum)
    
    // 调用API获取订单列表
    API.getOrderList(status)
      .then(result => {
        hideLoading()
        console.log('获取到的订单列表:', result)
        
        // 处理订单数据
        let newOrders = []
        if (result && result.records) {
          newOrders = result.records
        } else if (Array.isArray(result)) {
          newOrders = result
        }
        
        // 处理每个订单的数据格式
        newOrders = newOrders.map(order => this.processOrderData(order))
        
        // 如果是刷新或第一页，直接替换数据
        // 否则，追加到现有数据
        const updatedOrders = refresh || pageNum === 1 ? newOrders : [...orders, ...newOrders]
        
        // 判断是否还有更多数据
        const hasMore = newOrders.length === pageSize
        
        this.setData({
          orders: updatedOrders,
          loading: false,
          hasMore
        })
        
        // 立即过滤订单
        this.filterOrders()
      })
      .catch(err => {
        hideLoading()
        console.error('获取订单列表失败:', err)
        
        // 如果API请求失败，使用Mock数据
        const mockData = require('../../mock/order_data.js')
        let newOrders = mockData.orders || []
        
        // 处理每个订单的数据格式
        newOrders = newOrders.map(order => this.processOrderData(order))
        
        // 如果是刷新或第一页，直接替换数据
        // 否则，追加到现有数据
        const updatedOrders = refresh || pageNum === 1 ? newOrders : [...orders, ...newOrders]
        
        this.setData({
          orders: updatedOrders,
          loading: false,
          hasMore: false // 使用Mock数据时，假设没有更多数据
        })
        
        // 立即过滤订单
        this.filterOrders()
        
        showToast('获取订单列表失败，使用模拟数据')
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
    
    // 格式化时间，去掉T
    if (processedOrder.createTime && processedOrder.createTime.includes('T')) {
      processedOrder.createTime = processedOrder.createTime.replace('T', ' ').substring(0, 19)
    }
    if (processedOrder.payTime && processedOrder.payTime.includes('T')) {
      processedOrder.payTime = processedOrder.payTime.replace('T', ' ').substring(0, 19)
    }
    if (processedOrder.cancelTime && processedOrder.cancelTime.includes('T')) {
      processedOrder.cancelTime = processedOrder.cancelTime.replace('T', ' ').substring(0, 19)
    }
    
    return processedOrder
  },
  
  // 切换标签
  switchTab: function (e) {
    const { index } = e.currentTarget.dataset
    
    this.setData({
      currentTab: index,
      pageNum: 1,
      hasMore: true
    })
    
    // 切换标签后重新请求订单列表
    this.getOrderList(true)
  },
  
  // 过滤订单
  filterOrders: function() {
    const { orders } = this.data
    
    // 如果订单数据为空或不是数组，设置为空数组
    if (!orders || !Array.isArray(orders)) {
      console.log('订单数据为空或不是数组，设置为空数组')
      this.setData({
        filteredOrders: []
      })
      return
    }
    
    // 直接使用所有订单，因为已经在API请求时按状态过滤了
    this.setData({
      filteredOrders: orders
    })
  },
  
  // 查看订单详情
  viewOrderDetail: function (e) {
    const { orderno } = e.currentTarget.dataset
    console.log('查看订单详情，订单号:', orderno)
    
    wx.navigateTo({
      url: `/pages/order/detail?orderNo=${orderno}`
    })
  },
  
  // 支付订单
  payOrder: function (e) {
    // 阻止事件冒泡，防止触发viewOrderDetail
    e.stopPropagation && e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    
    const { orderno, id } = e.currentTarget.dataset
    console.log('去支付订单，订单号:', orderno, '订单ID:', id)
    console.log('支付按钮点击事件:', e)
    
    // 跳转到支付页面
    wx.navigateTo({
      url: `/pages/payment/payment?orderNo=${orderno}`
    })
    
    return false;
  },
  
  // 取消订单
  cancelOrder: function (e) {
    // 阻止事件冒泡，防止触发viewOrderDetail
    e.stopPropagation && e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    
    const { orderno, id } = e.currentTarget.dataset
    console.log('取消订单，订单号:', orderno, '订单ID:', id)
    console.log('取消按钮点击事件:', e)
    
    showModal('取消订单', '确定要取消该订单吗？')
      .then(res => {
        if (res) {
          showLoading('处理中')
          
          // 调用取消订单API，确保使用正确的参数格式
          API.cancelOrder(orderno)
            .then(() => {
              hideLoading()
              showToast('订单已取消', 'success')
              
              // 刷新订单列表
              this.setData({
                pageNum: 1,
                hasMore: true
              })
              this.getOrderList(true)
            })
            .catch(err => {
              hideLoading()
              console.error('取消订单失败:', err)
              showToast('取消订单失败: ' + (err.message || JSON.stringify(err)))
            })
        }
      })
      
    return false;
  },
  
  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      pageNum: 1,
      hasMore: true
    })
    this.getOrderList(true)
    wx.stopPullDownRefresh()
  },
  
  // 上拉加载更多
  onReachBottom: function () {
    const { hasMore, pageNum } = this.data
    
    if (hasMore) {
      this.setData({
        pageNum: pageNum + 1
      })
      this.getOrderList()
    }
  }
}) 