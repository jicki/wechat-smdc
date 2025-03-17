// 引入API和工具函数
const API = require('../../utils/api')
const { showToast, showLoading, hideLoading, showModal } = require('../../utils/util')

Page({
  data: {
    restaurantId: null,
    restaurant: null,
    allDishes: [], // 存储所有菜品
    categorizedDishes: {}, // 按分类存储菜品
    categories: [],
    loading: true,
    currentCategory: null,
    scrollIntoView: '',
    cartCount: 0,
    cartTotal: 0,
    isCartPanelShow: false,
    cartItems: [],
    tableNo: null, // 添加桌台号字段
    // 右侧菜单滚动时，记录当前显示的分类
    currentScrollCategory: null,
    categoryScrollTop: 0,
    isScrolling: false,
    foodList: []
  },

  onLoad: function (options) {
    const { id, tableNo } = options
    
    if (!id) {
      showToast('参数错误')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }
    
    // 获取全局数据中的餐厅信息
    const app = getApp()
    
    // 检查登录状态，确保用户已登录
    if (!app.globalData.isLogin) {
      // 如果未登录，跳转到登录页面
      console.log('菜单页面：未登录，跳转到登录页面')
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }
    
    console.log('菜单页面：已登录，加载菜单数据')
    // 已登录，加载菜单数据
    this.initMenuData(id, tableNo, app)
  },
  
  // 初始化菜单数据
  initMenuData: function(id, tableNo, app) {
    let restaurant = app.globalData.selectedRestaurant
    
    // 如果没有获取到餐厅信息，创建一个默认的餐厅信息
    if (!restaurant) {
      // 从Mock数据中获取餐厅信息
      const mockData = require('../../mock/data.js')
      restaurant = mockData.restaurants.find(item => item.id == id)
      
      // 如果仍然没有找到，创建一个默认的餐厅信息
      if (!restaurant) {
        restaurant = {
          id: id,
          name: '默认餐厅',
          address: '北京市朝阳区',
          phone: '010-12345678',
          rating: 4.5,
          ratingCount: 100,
          averagePrice: 50,
          promotion: '满100减20',
          description: '这是一家提供美味佳肴的餐厅，欢迎品尝我们的特色菜品。'
        }
      }
      
      // 保存到全局数据
      app.globalData.selectedRestaurant = restaurant
    }
    
    // 处理桌台号
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
    
    this.setData({
      restaurantId: id,
      restaurant: restaurant
    })
    
    // 获取菜单数据
    this.getMenuData(id)
    
    // 更新购物车数据
    this.updateCartData()
  },
  
  onShow: function () {
    // 每次显示页面时更新购物车数据
    this.updateCartData()
    
    // 检查全局桌台号是否有更新
    const app = getApp()
    const tableNo = app.getTableNo()
    if (tableNo && tableNo !== this.data.tableNo) {
      this.setData({ tableNo })
    }
  },
  
  onReady: function() {
    // 页面渲染完成后，计算每个分类的位置
    // 延迟一段时间，确保页面已经完全渲染
    setTimeout(() => {
      this.calculateCategoryPositions();
    }, 1000);
  },
  
  // 计算每个分类的位置
  calculateCategoryPositions: function() {
    console.log('计算分类位置...');
    const query = wx.createSelectorQuery();
    query.selectAll('.category-section').boundingClientRect();
    query.exec(res => {
      if (!res[0] || res[0].length === 0) {
        console.log('未找到分类区域元素');
        // 如果没有找到元素，延迟再试一次
        setTimeout(() => {
          this.calculateCategoryPositions();
        }, 500);
        return;
      }
      
      console.log('找到分类区域元素:', res[0].length);
      
      // 获取固定头部的高度
      const headerQuery = wx.createSelectorQuery();
      headerQuery.select('.fixed-header').boundingClientRect();
      headerQuery.exec(headerRes => {
        const headerHeight = headerRes[0] ? headerRes[0].height : 0;
        console.log('头部高度:', headerHeight);
        
        const sections = res[0];
        const foodList = sections.map(section => {
          const categoryId = parseInt(section.id.split('-')[1]);
          return {
            categoryId: categoryId,
            // 由于头部是固定定位，不需要减去头部高度
            top: section.top,
            height: section.height,
            bottom: section.bottom
          };
        });
        
        console.log('计算的foodList:', foodList);
        this.setData({ foodList });
      });
    });
  },
  
  // 获取菜单数据
  getMenuData: function (restaurantId) {
    showLoading('加载中')
    this.setData({ loading: true })
    
    // 先获取分类数据
    API.getDishCategoryList()
      .then(categories => {
        console.log('获取到分类数据:', categories);
        
        // 确保categories是数组
        if (!Array.isArray(categories)) {
          console.error('分类数据不是数组:', categories);
          categories = [];
        }
        
        // 保存分类数据
        this.setData({ categories })
        
        // 设置默认选中的分类
        const currentCategory = categories.length > 0 ? categories[0] : null
        this.setData({ 
          currentCategory,
          currentScrollCategory: currentCategory,
          categoryScrollTop: 0, // 初始化滚动位置
          foodList: categories.map((category, index) => ({
            id: category.id,
            name: category.name,
            top: index * 80, // Assuming each category item is 80px tall
            categoryId: category.id
          }))
        })
        
        // 获取所有菜品数据（一次性获取所有菜品）
        return API.getMenuList()
      })
      .then(dishes => {
        console.log('获取到菜品数据:', dishes);
        
        // 确保dishes是数组
        if (!Array.isArray(dishes)) {
          console.error('菜品数据不是数组:', dishes);
          dishes = [];
        }
        
        // 处理菜单数据
        this.processMenuData(dishes)
        hideLoading()
      })
      .catch(err => {
        console.error('获取菜单失败:', err)
        showToast('获取菜单失败，使用模拟数据')
        // 即使API请求失败，也调用processMenuData处理Mock数据
        this.processMenuData([])
        hideLoading()
      })
  },
  
  // 处理菜单数据
  processMenuData: function (dishes) {
    // 如果API返回的菜单数据为空，使用Mock数据
    if (!dishes || dishes.length === 0) {
      // 获取Mock数据
      const mockData = require('../../mock/data.js')
      
      // 使用Mock数据中的菜单
      dishes = mockData.menus.filter(item => item.restaurantId == this.data.restaurantId)
      
      // 如果过滤后仍然没有数据，使用所有菜单数据
      if (dishes.length === 0) {
        dishes = mockData.menus
      }
      
      // 获取分类信息
      let categories = mockData.categories.filter(item => item.restaurantId == this.data.restaurantId)
      
      // 如果没有找到对应餐厅的分类，使用默认分类
      if (categories.length === 0) {
        categories = [
          { id: 1, name: '热销', restaurantId: this.data.restaurantId },
          { id: 2, name: '特色菜', restaurantId: this.data.restaurantId },
          { id: 3, name: '主食', restaurantId: this.data.restaurantId },
          { id: 4, name: '小吃', restaurantId: this.data.restaurantId },
          { id: 5, name: '饮品', restaurantId: this.data.restaurantId }
        ]
      }
      
      // 更新分类数据
      this.setData({
        categories,
        currentCategory: categories[0],
        currentScrollCategory: categories[0]
      })
    }
    
    // 确保每个菜品都有分类
    dishes.forEach(dish => {
      // 如果没有分类ID，设置为第一个分类
      if (!dish.categoryId && this.data.categories.length > 0) {
        dish.categoryId = this.data.categories[0].id
      }
      
      // 初始化购物车数量
      dish.quantity = 0
    })
    
    // 更新购物车中菜品的数量
    const app = getApp()
    const cartItems = app.globalData.cart.items
    
    dishes.forEach(dish => {
      const cartItem = cartItems.find(item => item.id === dish.id)
      if (cartItem) {
        dish.quantity = cartItem.quantity
      }
    })
    
    // 按分类整理菜品
    const categorizedDishes = {}
    this.data.categories.forEach(category => {
      categorizedDishes[category.id] = dishes.filter(dish => dish.categoryId === category.id)
    })
    
    this.setData({
      allDishes: dishes,
      categorizedDishes,
      loading: false
    })
    
    // 数据加载完成后，重新计算分类位置
    setTimeout(() => {
      this.calculateCategoryPositions();
    }, 500);
  },
  
  // 右侧滚动时触发
  onFoodScroll: function(e) {
    // 如果正在滚动（由点击分类触发的滚动），则不处理
    if (this.data.isScrolling) return;
    
    const scrollTop = e.detail.scrollTop;
    console.log('滚动位置:', scrollTop);
    const foodList = this.data.foodList;
    
    if (!foodList || foodList.length === 0) {
      console.log('foodList为空，无法处理滚动');
      return;
    }
    
    // 根据滚动位置确定当前分类
    let currentCategoryId = null;
    
    // 处理滚动到底部的情况
    if (scrollTop + 600 >= foodList[foodList.length - 1].bottom) {
      // 如果滚动到接近底部，选择最后一个分类
      currentCategoryId = foodList[foodList.length - 1].categoryId;
    } else {
      // 找到第一个在视口内的分类
      for (let i = 0; i < foodList.length; i++) {
        const item = foodList[i];
        if (item.top <= scrollTop && (i === foodList.length - 1 || foodList[i + 1].top > scrollTop)) {
          currentCategoryId = item.categoryId;
          break;
        }
      }
      
      // 如果没有找到，使用第一个分类
      if (currentCategoryId === null && foodList.length > 0) {
        currentCategoryId = foodList[0].categoryId;
      }
    }
    
    console.log('当前分类ID:', currentCategoryId);
    
    // 如果找到了分类ID，并且与当前选中的分类不同
    if (currentCategoryId !== null && currentCategoryId !== (this.data.currentCategory ? this.data.currentCategory.id : null)) {
      // 找到对应的分类对象
      const category = this.data.categories.find(c => c.id === currentCategoryId);
      if (category) {
        console.log('切换到分类:', category.name);
        // 更新当前分类
        this.setData({
          currentCategory: category,
          currentScrollCategory: category
        });
        
        // 获取当前分类的索引
        const index = this.data.categories.findIndex(c => c.id === currentCategoryId);
        if (index !== -1) {
          // 滚动左侧菜单
          this.scrollLeftMenu(index);
        }
      }
    }
  },
  
  // 切换分类
  switchCategory: function (e) {
    const { category } = e.currentTarget.dataset
    
    this.setData({
      currentCategory: category,
      scrollIntoView: `category-${category.id}`,
      isScrolling: true // 标记正在滚动，防止onFoodScroll触发
    })
    
    // 延时重置滚动标记
    setTimeout(() => {
      this.setData({ isScrolling: false })
    }, 1000)
  },
  
  // 滚动左侧菜单到指定分类
  scrollLeftMenu: function (index) {
    console.log('滚动左侧菜单到索引:', index);
    // 计算需要滚动的高度
    const itemHeight = 80; // 每个分类项的高度（包括内边距和外边距）
    const scrollTop = index * itemHeight;
    
    // 设置滚动位置
    this.setData({
      categoryScrollTop: scrollTop
    });
  },
  
  // 添加到购物车
  addToCart: function (e) {
    const { item } = e.currentTarget.dataset
    
    // 调用全局方法添加到购物车
    const app = getApp()
    app.addToCart({
      ...item,
      restaurantId: this.data.restaurantId
    })
    
    // 更新购物车数据
    this.updateCartData()
    
    // 更新菜品数量
    this.updateDishQuantity(item.id, item.quantity + 1)
    
    // 显示提示
    showToast('已添加到购物车', 'success')
  },
  
  // 从购物车移除
  removeFromCart: function (e) {
    const { id } = e.currentTarget.dataset
    
    // 调用全局方法从购物车移除
    const app = getApp()
    app.removeFromCart(id)
    
    // 更新购物车数据
    this.updateCartData()
    
    // 更新菜品数量
    const item = this.findDishById(id)
    if (item && item.quantity > 0) {
      this.updateDishQuantity(id, item.quantity - 1)
    }
  },
  
  // 更新菜品数量
  updateDishQuantity: function (id, quantity) {
    // 更新allDishes中的数量
    const allDishes = this.data.allDishes.map(dish => {
      if (dish.id === id) {
        return { ...dish, quantity }
      }
      return dish
    })
    
    // 更新categorizedDishes中的数量
    const categorizedDishes = {}
    Object.keys(this.data.categorizedDishes).forEach(categoryId => {
      categorizedDishes[categoryId] = this.data.categorizedDishes[categoryId].map(dish => {
        if (dish.id === id) {
          return { ...dish, quantity }
        }
        return dish
      })
    })
    
    this.setData({
      allDishes,
      categorizedDishes
    })
  },
  
  // 根据ID查找菜品
  findDishById: function (id) {
    return this.data.allDishes.find(dish => dish.id === id)
  },
  
  // 更新购物车数据
  updateCartData: function () {
    const app = getApp()
    const cart = app.globalData.cart
    
    // 计算购物车中的商品总数
    let count = 0
    cart.items.forEach(item => {
      count += item.quantity
    })
    
    this.setData({
      cartCount: count,
      cartTotal: cart.totalPrice,
      cartItems: cart.items
    })
    
    // 如果购物车为空，关闭购物车面板
    if (count === 0 && this.data.isCartPanelShow) {
      this.toggleCartPanel()
    }
  },
  
  // 切换购物车面板显示状态
  toggleCartPanel: function () {
    // 如果购物车为空，不显示面板
    if (this.data.cartCount === 0) {
      showToast('购物车为空')
      return
    }
    
    this.setData({
      isCartPanelShow: !this.data.isCartPanelShow
    })
  },
  
  // 清空购物车
  clearCart: function () {
    showModal('清空购物车', '确定要清空购物车吗？')
      .then(res => {
        if (res) {
          const app = getApp()
          app.clearCart()
          
          // 更新购物车数据
          this.updateCartData()
          
          // 关闭购物车面板
          this.setData({
            isCartPanelShow: false
          })
          
          // 重置所有菜品的数量
          this.resetAllDishesQuantity()
          
          showToast('购物车已清空')
        }
      })
  },
  
  // 重置所有菜品的数量
  resetAllDishesQuantity: function () {
    // 更新allDishes中的数量
    const allDishes = this.data.allDishes.map(dish => {
      return { ...dish, quantity: 0 }
    })
    
    // 更新categorizedDishes中的数量
    const categorizedDishes = {}
    Object.keys(this.data.categorizedDishes).forEach(categoryId => {
      categorizedDishes[categoryId] = this.data.categorizedDishes[categoryId].map(dish => {
        return { ...dish, quantity: 0 }
      })
    })
    
    this.setData({
      allDishes,
      categorizedDishes
    })
  },
  
  // 去购物车页面
  goToCart: function () {
    if (this.data.cartCount === 0) {
      showToast('购物车为空')
      return
    }
    
    wx.navigateTo({
      url: '/pages/cart/cart'
    })
  }
}) 