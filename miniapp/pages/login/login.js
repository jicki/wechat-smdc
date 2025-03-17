// 引入API和工具函数
const API = require('../../utils/api')
const { showToast, showLoading, hideLoading } = require('../../utils/util')

Page({
  data: {
    canIUseGetUserProfile: false,
    phoneNumber: '',
    isLogin: false
  },

  onLoad: function (options) {
    // 判断是否支持getUserProfile
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    
    // 检查是否已登录
    this.checkLoginStatus()
  },
  
  // 检查登录状态
  checkLoginStatus: function () {
    const app = getApp()
    if (app.globalData.isLogin) {
      this.setData({
        isLogin: true
      })
    }
  },
  
  // 获取用户信息
  getUserProfile: function () {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        const userInfo = res.userInfo
        // 保存用户信息
        this.setUserInfo(userInfo)
      },
      fail: (err) => {
        showToast('获取用户信息失败')
      }
    })
  },
  
  // 保存用户信息
  setUserInfo: function (userInfo) {
    const app = getApp()
    app.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
  },
  
  // 获取手机号
  getPhoneNumber: function (e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 实际项目中，这里需要将加密数据发送到服务端解密
      // 由于使用Mock数据，这里直接模拟登录成功
      this.mockLogin()
    } else {
      showToast('获取手机号失败')
    }
  },
  
  // 模拟登录
  mockLogin: function () {
    console.log('开始模拟登录流程')
    showLoading('登录中')
    
    // 使用MOCK账户数据
    const mockUserData = {
      phone: '13800138000',
      password: '123456'
    }
    
    console.log('使用模拟账户数据:', mockUserData)
    
    // 模拟登录请求
    API.login(mockUserData)
      .then(res => {
        hideLoading()
        console.log('登录成功，获取到的响应:', res)
        
        // 保存token
        wx.setStorageSync('token', res.token)
        console.log('已保存token:', res.token)
        
        // 保存用户信息
        this.setUserInfo(res.userInfo)
        console.log('已保存用户信息:', res.userInfo)
        
        // 更新全局登录状态
        const app = getApp()
        app.globalData.isLogin = true
        app.globalData.userInfo = res.userInfo
        console.log('已更新全局登录状态:', app.globalData.isLogin)
        
        // 更新页面状态
        this.setData({
          isLogin: true
        })
        
        // 显示登录成功提示
        showToast('登录成功', 'success')
        
        // 延迟跳转到首页
        setTimeout(() => {
          console.log('准备跳转到首页')
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }, 1500)
      })
      .catch(err => {
        hideLoading()
        console.error('登录失败:', err)
        console.error('错误详情:', JSON.stringify(err))
        showToast('登录失败，请重试')
      })
  },
  
  // 测试账号登录
  testLogin: function () {
    console.log('开始测试账号登录流程')
    showLoading('登录中')
    
    // 使用测试账户数据
    const testUserData = {
      phone: 'admin',
      password: '123456'
    }
    
    console.log('使用测试账户数据:', testUserData)
    
    // 调用登录API
    API.login(testUserData)
      .then(res => {
        hideLoading()
        console.log('登录成功，获取到的响应:', res)
        
        // 保存token
        wx.setStorageSync('token', res.token)
        console.log('已保存token:', res.token)
        
        // 保存用户信息
        this.setUserInfo(res.userInfo)
        console.log('已保存用户信息:', res.userInfo)
        
        // 更新全局登录状态
        const app = getApp()
        app.globalData.isLogin = true
        app.globalData.userInfo = res.userInfo
        console.log('已更新全局登录状态:', app.globalData.isLogin)
        
        // 更新页面状态
        this.setData({
          isLogin: true
        })
        
        // 显示登录成功提示
        showToast('登录成功', 'success')
        
        // 延迟跳转到首页
        setTimeout(() => {
          console.log('准备跳转到首页')
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }, 1500)
      })
      .catch(err => {
        hideLoading()
        console.error('登录失败:', err)
        console.error('错误详情:', JSON.stringify(err))
        showToast('登录失败，请重试')
      })
  },
  
  // 退出登录
  logout: function () {
    // 清除登录信息
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    
    // 更新全局登录状态
    const app = getApp()
    app.globalData.isLogin = false
    app.globalData.userInfo = null
    
    // 更新页面状态
    this.setData({
      isLogin: false
    })
    
    showToast('已退出登录')
  }
}) 