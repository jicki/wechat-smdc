// 引入API和工具函数
const API = require('../../utils/api')
const { showToast, showLoading, hideLoading, showModal } = require('../../utils/util')
// 使用专门的订单数据文件
const orderData = require('../../mock/order_data.js')

Page({
  data: {
    id: null,
    order: null,
    loading: true
  },

  onLoad: function (options) {
    const { orderNo } = options
    
    if (!orderNo) {
      showToast('参数错误')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }
    
    this.setData({ orderNo })
    this.getOrderDetail(orderNo)
  },
  
  // 获取订单详情
  getOrderDetail: function (orderNo) {
    console.log('开始获取订单详情，订单号:', orderNo)
    showLoading('加载中')
    this.setData({ loading: true })
    
    // 先尝试从全局数据获取订单信息
    const app = getApp()
    const pendingOrder = app.globalData.pendingOrder
    
    // 如果全局数据中有订单信息，并且订单号匹配，直接使用
    if (pendingOrder && pendingOrder.orderNo === orderNo) {
      console.log('从全局数据获取到订单信息:', pendingOrder)
      hideLoading()
      
      // 处理订单数据，确保兼容前端显示
      const processedOrder = this.processOrderData(pendingOrder)
      
      console.log('处理后的订单详情:', processedOrder)
      this.setData({
        order: processedOrder,
        loading: false
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
          this.setData({ loading: false })
          return
        }
        
        // 处理订单数据，确保兼容前端显示
        const processedOrder = this.processOrderData(order)
        
        console.log('处理后的订单详情:', processedOrder)
        this.setData({
          order: processedOrder,
          loading: false
        })
      })
      .catch(err => {
        hideLoading()
        console.error('获取订单详情失败:', err)
        showToast('获取订单详情失败')
        this.setData({ loading: false })
      })
  },
  
  // 处理订单数据，确保兼容前端显示
  processOrderData: function(order) {
    if (!order) return null
    
    // 创建一个新对象，避免修改原始数据
    const processedOrder = {...order}
    
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
    
    // 确保订单有桌台号字段
    if (!processedOrder.tableNo) {
      // 如果订单中没有桌台号，尝试从全局数据获取
      const app = getApp()
      const tableNo = app.getTableNo()
      if (tableNo) {
        processedOrder.tableNo = tableNo
      }
    }
    
    return processedOrder
  },
  
  // 去支付
  payOrder: function () {
    const { order } = this.data
    
    if (!order || order.status !== 'PENDING') {
      showToast('订单状态不正确')
      return
    }
    
    // 跳转到支付页面
    wx.navigateTo({
      url: `/pages/payment/payment?orderNo=${order.orderNo}`
    })
  },
  
  // 取消订单
  cancelOrder: function () {
    const { order } = this.data
    
    if (!order || order.status !== 'PENDING') {
      showToast('订单状态不正确')
      return
    }
    
    showModal('取消订单', '确定要取消该订单吗？')
      .then(res => {
        if (res) {
          showLoading('处理中')
          
          // 调用取消订单API，确保使用JSON格式发送数据
          API.cancelOrder(order.orderNo)
            .then(() => {
              hideLoading()
              
              // 更新订单状态
              const updatedOrder = { ...order }
              updatedOrder.status = 'CANCELLED'
              updatedOrder.cancelReason = '用户取消'
              updatedOrder.cancelTime = new Date().toLocaleString()
              
              this.setData({
                order: updatedOrder
              })
              
              showToast('订单已取消', 'success')
            })
            .catch(err => {
              hideLoading()
              console.error('取消订单失败:', err)
              showToast('取消订单失败: ' + (err.message || JSON.stringify(err)))
            })
        }
      })
  },
  
  // 复制订单号
  copyOrderId: function () {
    const { order } = this.data
    if (!order) {
      showToast('订单数据不存在')
      return
    }
    
    wx.setClipboardData({
      data: order.orderNo,
      success: function () {
        showToast('订单号已复制', 'success')
      }
    })
  },
  
  // 拨打电话
  makePhoneCall: function () {
    const { order } = this.data
    
    if (!order || !order.contactPhone) return
    
    wx.makePhoneCall({
      phoneNumber: order.contactPhone,
      fail: () => {
        showToast('拨打电话失败')
      }
    })
  },
  
  // 再来一单
  reorder: function () {
    const { order } = this.data
    
    if (!order) return
    
    // 跳转到餐厅菜单页
    wx.navigateTo({
      url: `/pages/menu/menu?id=${order.restaurantId}`
    })
  }
}) 