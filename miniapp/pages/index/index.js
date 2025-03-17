// 引入API和工具函数
const API = require('../../utils/api')
const { showToast, showLoading, hideLoading, getLocation } = require('../../utils/util')

Page({
  data: {
    restaurant: null,
    loading: true,
    userLocation: null,
    tableNo: null // 添加桌台号字段
  },

  onLoad: function (options) {
    console.log('首页onLoad开始执行')
    
    // 检查登录状态，如果未登录则直接返回，不执行后续代码
    if (!this.checkLoginStatus()) {
      return;
    }
    
    console.log('已登录，继续加载首页')
    // 获取餐厅信息
    this.getRestaurantInfo()
    
    // 获取用户位置
    this.getUserLocation()
    
    // 检查是否有桌台号参数
    this.checkTableNo(options)
    
    // 检查全局餐厅信息中是否有logo字段
    const app = getApp()
    if (app.globalData.selectedRestaurant && !app.globalData.selectedRestaurant.logo) {
      app.globalData.selectedRestaurant.logo = 'http://localhost:8080/uploads/restaurant-logo.jpg'
      if (this.data.restaurant) {
        this.setData({
          restaurant: app.globalData.selectedRestaurant
        })
      }
    }
  },
  
  onShow: function () {
    // 每次显示页面时检查登录状态，如果未登录则直接返回，不执行后续代码
    if (!this.checkLoginStatus()) {
      return;
    }
    
    // 获取全局桌台号
    const app = getApp()
    const tableNo = app.getTableNo()
    if (tableNo && tableNo !== this.data.tableNo) {
      this.setData({ tableNo })
    }
  },
  
  // 检查桌台号
  checkTableNo: function(options) {
    const app = getApp()
    let tableNo = null
    
    // 优先使用页面参数中的桌台号
    if (options && options.tableNo) {
      tableNo = options.tableNo
    } else {
      // 否则使用全局存储的桌台号
      tableNo = app.getTableNo()
    }
    
    if (tableNo) {
      this.setData({ tableNo })
      showToast(`已获取桌台号: ${tableNo}`, 'success')
    }
  },
  
  // 检查登录状态
  checkLoginStatus: function () {
    const app = getApp()
    console.log('首页检查登录状态 - 当前状态:', app.globalData.isLogin)
    
    // 检查是否已登录，如果未登录则跳转到登录页面
    if (!app.globalData.isLogin) {
      console.log('未登录，跳转到登录页面')
      // 使用redirectTo而不是navigateTo，强制跳转到登录页面
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return false; // 返回false表示未登录
    }
    
    console.log('已登录，用户信息:', app.globalData.userInfo)
    return true; // 返回true表示已登录
  },
  
  // 获取餐厅信息（单店模式，从后端获取餐厅信息）
  getRestaurantInfo: function () {
    showLoading('加载中')
    this.setData({ loading: true })
    
    // 调用API获取餐厅信息
    API.getRestaurantInfo()
      .then(restaurant => {
        if (!restaurant) {
          throw new Error('没有找到餐厅信息');
        }
        
        // 确保餐厅信息中包含logo字段
        if (!restaurant.logo) {
          restaurant.logo = 'http://localhost:8080/uploads/restaurant-logo.jpg'
        }
        
        // 保存到全局数据
        const app = getApp()
        app.globalData.selectedRestaurant = restaurant
        
        this.setData({
          restaurant: restaurant,
          loading: false
        })
        
        // 动态设置导航栏标题为餐厅名称
        if (restaurant.name) {
          wx.setNavigationBarTitle({
            title: restaurant.name
          })
        }
        
        hideLoading()
      })
      .catch(err => {
        console.error('获取餐厅信息失败:', err)
        
        // 如果API请求失败，使用Mock数据
        const mockData = require('../../mock/data.js')
        const restaurant = mockData.restaurants[0] // 使用川湘居作为固定餐厅
        
        // 确保餐厅信息中包含logo字段
        if (!restaurant.logo) {
          restaurant.logo = 'http://localhost:8080/uploads/restaurant-logo.jpg'
        }
        
        // 保存到全局数据
        const app = getApp()
        app.globalData.selectedRestaurant = restaurant
        
        this.setData({
          restaurant: restaurant,
          loading: false
        })
        
        // 动态设置导航栏标题为餐厅名称
        if (restaurant.name) {
          wx.setNavigationBarTitle({
            title: restaurant.name
          })
        }
        
        hideLoading()
        showToast('获取餐厅信息失败，使用默认数据')
      })
  },
  
  // 获取用户位置
  getUserLocation: function () {
    getLocation()
      .then(res => {
        const { latitude, longitude } = res
        this.setData({
          userLocation: {
            latitude,
            longitude
          }
        })
      })
      .catch(err => {
        showToast('获取位置信息失败，请检查位置权限')
      })
  },
  
  // 前往菜单页
  goToMenu: function () {
    const { restaurant, tableNo } = this.data
    let url = `/pages/menu/menu?id=${restaurant.id}`
    
    // 如果有桌台号，添加到URL参数中
    if (tableNo) {
      url += `&tableNo=${tableNo}`
    }
    
    wx.navigateTo({
      url: url
    })
  },
  
  // 拨打电话
  callRestaurant: function () {
    const { restaurant } = this.data
    wx.makePhoneCall({
      phoneNumber: restaurant.phone,
      fail: () => {
        showToast('拨打电话失败')
      }
    })
  },
  
  // 查看地图
  viewLocation: function () {
    const { restaurant } = this.data
    wx.openLocation({
      latitude: restaurant.latitude || 39.9087,
      longitude: restaurant.longitude || 116.3975,
      name: restaurant.name,
      address: restaurant.address,
      scale: 18
    })
  },
  
  // 跳转到测试页面
  goToTest: function () {
    const { tableNo } = this.data
    let url = '/pages/test/test'
    
    // 如果有桌台号，添加到URL参数中
    if (tableNo) {
      url += `?tableNo=${tableNo}`
    }
    
    wx.navigateTo({
      url: url
    })
  },
  
  // 下拉刷新
  onPullDownRefresh: function () {
    this.getRestaurantInfo()
    wx.stopPullDownRefresh()
  }
}) 