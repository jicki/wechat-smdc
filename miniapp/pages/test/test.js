Page({
  data: {
    tableNo: null,
    launchOptions: null,
    showOptions: null
  },

  onLoad: function (options) {
    console.log('测试页面 onLoad 参数:', options)
    
    // 获取全局桌台号
    const app = getApp()
    const tableNo = app.getTableNo()
    
    this.setData({ 
      tableNo,
      launchOptions: options
    })
    
    // 显示启动参数
    wx.showModal({
      title: '页面启动参数',
      content: JSON.stringify(options),
      showCancel: false
    })
  },
  
  onShow: function () {
    console.log('测试页面 onShow')
    
    // 获取全局桌台号
    const app = getApp()
    const tableNo = app.getTableNo()
    
    // 获取当前页面显示参数
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const showOptions = currentPage.options
    
    this.setData({ 
      tableNo,
      showOptions
    })
  },
  
  // 清除桌台号
  clearTableNo: function() {
    const app = getApp()
    app.clearTableNo()
    
    this.setData({
      tableNo: null
    })
    
    wx.showToast({
      title: '桌台号已清除',
      icon: 'success'
    })
  },
  
  // 设置测试桌台号
  setTestTableNo: function() {
    const app = getApp()
    const testTableNo = 'T99'
    app.setTableNo(testTableNo)
    
    this.setData({
      tableNo: testTableNo
    })
    
    wx.showToast({
      title: '已设置测试桌台号',
      icon: 'success'
    })
  },
  
  // 返回首页
  goToIndex: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
}) 