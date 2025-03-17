// 引入工具函数
const { showToast } = require('./util')

// 基础URL，修改为实际的API地址
const BASE_URL = 'http://localhost:8080'

// 请求方法
const request = (url, method = 'GET', data = {}, showLoading = true) => {
  return new Promise((resolve, reject) => {
    if (showLoading) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    }
    
    // 获取本地存储的token
    const token = wx.getStorageSync('token')
    
    console.log(`发起请求: ${url}`, data);
    console.log(`请求方法: ${method}, 请求头: Authorization=${token ? `Bearer ${token}` : '无'}`);
    
    // 实际网络请求
    wx.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': method === 'GET' ? 'application/json' : 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        wx.hideLoading()
        
        console.log(`请求响应: ${url}`, res.data);
        console.log(`响应状态码: ${res.statusCode}`);
        
        // 处理响应
        if (res.statusCode === 200) {
          // 检查响应中是否包含code字段，如果没有，则认为是直接返回数据
          if (res.data.code === undefined) {
            resolve(res.data);
            return;
          }
          
          // 检查code是否为0或200（兼容不同的API返回格式）
          if (res.data.code === 0 || res.data.code === 200) {
            // 处理data可能是简单类型的情况（如数字、字符串等）
            const responseData = res.data.data;
            console.log(`响应数据类型: ${typeof responseData}, 值:`, responseData);
            resolve(responseData);
          } else {
            console.error(`请求失败: ${url}, 错误码: ${res.data.code}, 错误信息: ${res.data.message}`);
            showToast(res.data.message || '请求失败')
            reject(res.data)
          }
        } else {
          console.error(`请求失败: ${url}, 状态码: ${res.statusCode}`);
          showToast(`请求失败: ${res.statusCode}`)
          reject(res)
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.error(`请求失败: ${url}`, err);
        console.error(`请求详情: 方法=${method}, 数据=`, data);
        console.error(`错误详情:`, JSON.stringify(err));
        showToast('网络请求失败')
        
        // 如果网络请求失败，尝试使用Mock数据
        const mockResponse = getMockResponse(url, method, data)
        console.log(`尝试使用Mock数据: ${url}`, mockResponse);
        
        if (mockResponse.code === 0 && mockResponse.data) {
          console.log('使用Mock数据:', url)
          resolve(mockResponse.data)
        } else {
          console.error(`Mock数据也失败: ${url}`, mockResponse);
          reject(err)
        }
      }
    })
  })
}

// 获取Mock响应
const getMockResponse = (url, method, data) => {
  // 引入mock数据
  const mockData = require('../mock/data')
  
  // 根据URL和方法返回不同的Mock响应
  if (url.includes('/api/login') || url.includes('/api/user/login')) {
    // 检查是否是账号密码登录
    if (method === 'POST' && data && data.phone && data.password) {
      console.log('Mock账号密码登录:', data)
      // 检查是否是预设的mock账户
      if ((data.phone === '13800138000' && data.password === '123456') || 
          (data.phone === 'admin' && data.password === '123456')) {
        // 构建返回数据
        return {
          code: 0,
          message: 'success',
          data: {
            token: 'mock_token_' + Date.now(),
            userInfo: {
              id: 'user123',
              nickName: data.phone === 'admin' ? '管理员' : '测试用户',
              avatarUrl: '',
              phone: data.phone
            }
          }
        }
      } else {
        return {
          code: -1,
          message: '账号或密码错误',
          data: null
        }
      }
    } else {
      // 其他登录方式，返回默认mock数据
      return mockData.login
    }
  } else if (url.includes('/api/shop/info')) {
    // 单店模式，返回第一家餐厅
    const restaurant = mockData.restaurants[0]
    // 确保餐厅信息中包含logo字段
    if (!restaurant.logo) {
      restaurant.logo = 'http://localhost:8080/uploads/restaurant-logo.jpg'
    }
    return {
      code: 0,
      message: 'success',
      data: restaurant
    }
  } else if (url.includes('/api/shop/list')) {
    // 确保每个餐厅信息中包含logo字段
    const restaurants = mockData.restaurants.map(restaurant => {
      if (!restaurant.logo) {
        restaurant.logo = 'http://localhost:8080/uploads/restaurant-logo.jpg'
      }
      return restaurant
    })
    
    return {
      code: 0,
      message: 'success',
      data: restaurants
    }
  } else if (url.includes('/api/restaurant/list')) {
    return mockData.restaurantList
  } else if (url.includes('/api/restaurant/detail')) {
    const { id } = data
    const restaurant = mockData.restaurants.find(item => item.id == id)
    
    // 确保餐厅信息中包含logo字段
    if (restaurant && !restaurant.logo) {
      restaurant.logo = 'http://localhost:8080/uploads/restaurant-logo.jpg'
    }
    
    return {
      code: restaurant ? 0 : -1,
      message: restaurant ? 'success' : '餐厅不存在',
      data: restaurant
    }
  } else if (url.includes('/api/dish/list')) {
    // 如果提供了分类ID，则按分类过滤菜品
    if (data.categoryId) {
      const menus = mockData.menus.filter(item => item.categoryId == data.categoryId)
      return {
        code: 0,
        message: 'success',
        data: menus
      }
    } else {
      // 否则返回所有菜品
      return {
        code: 0,
        message: 'success',
        data: mockData.menus
      }
    }
  } else if (url.includes('/api/menu/list')) {
    const { restaurantId } = data
    const menus = mockData.menus.filter(item => item.restaurantId == restaurantId)
    const categories = mockData.categories.filter(item => item.restaurantId == restaurantId)
    
    return {
      code: 0,
      message: 'success',
      data: {
        menus,
        categories
      }
    }
  } else if (url.includes('/api/dish/category/list')) {
    return {
      code: 0,
      message: 'success',
      data: mockData.categories
    }
  } else if (url.includes('/api/order/create')) {
    // 生成一个新的订单ID
    const orderId = Date.now();
    
    // 模拟后端生成订单号的逻辑（通常包含日期、业务标识、随机数等）
    const orderNo = 'ORDER' + new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // 构建订单数据
    const newOrder = {
      id: orderId,
      orderNo: orderNo,
      userId: 'user123',
      restaurantId: data.shopId,
      restaurantName: data.shopName,
      status: 0, // 使用数字状态，与后端保持一致：0-待支付
      orderDetails: data.orderDetails || [],
      totalAmount: data.totalAmount,
      address: '北京市朝阳区建国路88号',
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      payTime: null,
      deliveryTime: null,
      remark: data.remark || '',
      paymentMethod: null,
      contactName: '张三',
      contactPhone: '13800138000',
      deliveryFee: 5,
      tableNo: data.tableNo || ''
    };
    
    // 将新订单添加到mock数据中
    mockData.orders.unshift(newOrder);
    
    console.log('创建新订单:', newOrder);
    
    // 返回与后端一致的格式：直接返回完整订单信息
    return {
      code: 0,
      message: 'success',
      data: newOrder
    };
  } else if (url.includes('/api/order/list') || url.includes('/api/order/page')) {
    // 确保返回订单列表数据
    console.log('Mock订单列表数据:', mockData.orders)
    return {
      code: 0,
      message: 'success',
      data: mockData.orders || []
    }
  } else if (url.includes('/api/order/detail')) {
    const { id } = data;
    console.log('查询订单详情，ID:', id);
    
    // 尝试通过id或orderNo查找订单
    let order = mockData.orders.find(item => 
      item.id === id || item.orderNo === id
    );
    
    // 确保返回订单详情数据
    console.log('Mock订单详情数据:', order);
    
    if (order) {
      return {
        code: 0,
        message: 'success',
        data: order
      };
    } else {
      console.error('未找到订单:', id);
      return {
        code: -1,
        message: '订单不存在',
        data: null
      };
    }
  } else if (url.includes('/api/order/pay')) {
    return mockData.payOrder
  } else if (url.includes('/api/restaurant/nearby')) {
    // ... existing code ...
  } else {
    // 默认返回空数据
    return {
      code: -1,
      message: '接口不存在',
      data: null
    }
  }
}

// API方法
module.exports = {
  // 用户登录
  login: (params) => {
    // 支持两种登录方式：微信code登录或手机号密码登录
    if (typeof params === 'string') {
      // 原有的微信code登录方式
      return request('/api/user/login', 'POST', { code: params })
    } else if (params && params.phone && params.password) {
      // 新增的手机号密码登录方式（用于mock账户）
      console.log('使用手机号密码登录:', params)
      return request('/api/user/login', 'POST', { 
        phone: params.phone, 
        password: params.password 
      })
    } else {
      // 参数错误
      return Promise.reject('登录参数错误')
    }
  },
  
  // 获取餐厅信息（单店模式）
  getRestaurantInfo: () => {
    return request('/api/shop/info')
  },
  
  // 获取餐厅列表（已废弃，保留兼容）
  getRestaurantList: () => {
    return request('/api/shop/list')
  },
  
  // 获取餐厅详情
  getRestaurantDetail: (id) => {
    return request('/api/shop/detail', 'GET', { id })
  },
  
  // 获取菜品分类列表
  getDishCategoryList: () => {
    return request('/api/dish/category/list')
  },
  
  // 获取菜单列表
  getMenuList: (categoryId) => {
    // 如果没有传递categoryId，则不包含该参数
    const params = categoryId ? { categoryId } : {}
    return request('/api/dish/list', 'GET', params)
  },
  
  // 创建订单
  createOrder: (data) => {
    return request('/api/order/create', 'POST', data)
  },
  
  // 获取订单列表
  getOrderList: (status) => {
    // 如果提供了状态参数，则添加到请求中
    const params = status !== undefined ? { status } : {}
    return request('/api/order/page', 'GET', params)
  },
  
  // 获取订单详情
  getOrderDetail: (orderNo) => {
    // 统一使用orderNo作为参数，调用detailByOrderNo接口
    return request('/api/order/detailByOrderNo', 'GET', { orderNo })
  },
  
  // 支付订单
  payOrder: (orderNo) => {
    return request('/api/order/pay', 'POST', { orderNo })
  },
  
  // 取消订单
  cancelOrder: (orderNo) => {
    // 使用JSON格式发送数据
    return request('/api/order/cancel', 'POST', { orderNo: orderNo })
  }
} 