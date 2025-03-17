// 引入API和工具函数
const API = require('../../utils/api')
const { showToast, showLoading, hideLoading } = require('../../utils/util')

Page({
  data: {
    id: null,
    restaurant: null,
    loading: true,
    latitude: 0,
    longitude: 0,
    markers: []
  },

  onLoad: function (options) {
    const { id } = options
    
    if (!id) {
      showToast('参数错误')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }
    
    this.setData({ id })
    this.getRestaurantDetail(id)
  },
  
  // 获取餐厅详情
  getRestaurantDetail: function (id) {
    showLoading('加载中')
    this.setData({ loading: true })
    
    API.getRestaurantDetail(id)
      .then(res => {
        // 检查经纬度是否为有效数字
        const latitude = parseFloat(res.latitude) || 39.908;
        const longitude = parseFloat(res.longitude) || 116.397;
        
        this.setData({
          restaurant: res,
          loading: false,
          latitude: latitude,
          longitude: longitude,
          markers: [{
            id: 1,
            latitude: latitude,
            longitude: longitude,
            title: res.name,
            callout: {
              content: res.name,
              color: '#FF6B6B',
              fontSize: 12,
              borderRadius: 4,
              padding: 5,
              display: 'ALWAYS'
            },
            width: 30,
            height: 30
          }]
        })
        hideLoading()
      })
      .catch(err => {
        showToast('获取餐厅详情失败')
        this.setData({ loading: false })
        hideLoading()
      })
  },
  
  // 打电话
  makePhoneCall: function () {
    const { restaurant } = this.data
    if (!restaurant || !restaurant.phone) return
    
    wx.makePhoneCall({
      phoneNumber: restaurant.phone,
      fail: () => {
        showToast('拨打电话失败')
      }
    })
  },
  
  // 查看地图
  openLocation: function () {
    const { restaurant, latitude, longitude } = this.data
    if (!restaurant) return
    
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: restaurant.name,
      address: restaurant.address,
      scale: 18
    })
  },
  
  // 前往菜单页
  goToMenu: function () {
    const { id, restaurant } = this.data
    if (!id || !restaurant) return
    
    // 保存选中的餐厅到全局数据
    const app = getApp()
    app.globalData.selectedRestaurant = restaurant
    
    wx.navigateTo({
      url: `/pages/menu/menu?id=${id}`
    })
  }
}) 