// Mock数据
const restaurants = [
  {
    id: 1,
    name: '川湘居',
    address: '北京市朝阳区建国路88号',
    phone: '010-12345678',
    businessHours: '10:00-22:00',
    rating: 4.8,
    ratingCount: 1024,
    averagePrice: 88,
    distance: 1.2,
    latitude: 39.9123,
    longitude: 116.4551,
    images: [],
    tags: ['川菜', '湘菜', '特色菜'],
    promotion: '满100减20',
    description: '正宗川湘菜，麻辣鲜香，欢迎品尝！'
  },
  {
    id: 2,
    name: '粤海渔村',
    address: '北京市海淀区中关村南大街5号',
    phone: '010-87654321',
    businessHours: '11:00-21:30',
    rating: 4.6,
    ratingCount: 856,
    averagePrice: 128,
    distance: 2.5,
    latitude: 39.9654,
    longitude: 116.3456,
    images: [],
    tags: ['粤菜', '海鲜', '家常菜'],
    promotion: '满200减30',
    description: '新鲜海鲜，粤式烹饪，尽享美味！'
  },
  {
    id: 3,
    name: '京味小馆',
    address: '北京市西城区西单北大街120号',
    phone: '010-66778899',
    businessHours: '09:30-20:30',
    rating: 4.5,
    ratingCount: 632,
    averagePrice: 68,
    distance: 3.8,
    latitude: 39.9087,
    longitude: 116.3675,
    images: [],
    tags: ['北京菜', '家常菜', '特色小吃'],
    promotion: '满50减10',
    description: '正宗老北京风味，百年传承，匠心制作！'
  }
]

// 菜单分类
const categories = [
  {
    id: 1,
    name: '热销',
    restaurantId: 1
  },
  {
    id: 2,
    name: '特色菜',
    restaurantId: 1
  },
  {
    id: 3,
    name: '主食',
    restaurantId: 1
  },
  {
    id: 4,
    name: '小吃',
    restaurantId: 1
  },
  {
    id: 5,
    name: '饮品',
    restaurantId: 1
  },
  {
    id: 6,
    name: '热销',
    restaurantId: 2
  },
  {
    id: 7,
    name: '海鲜',
    restaurantId: 2
  },
  {
    id: 8,
    name: '粤菜',
    restaurantId: 2
  },
  {
    id: 9,
    name: '主食',
    restaurantId: 2
  },
  {
    id: 10,
    name: '饮品',
    restaurantId: 2
  },
  {
    id: 11,
    name: '热销',
    restaurantId: 3
  },
  {
    id: 12,
    name: '北京菜',
    restaurantId: 3
  },
  {
    id: 13,
    name: '小吃',
    restaurantId: 3
  },
  {
    id: 14,
    name: '主食',
    restaurantId: 3
  },
  {
    id: 15,
    name: '饮品',
    restaurantId: 3
  }
]

// 菜单
const menus = [
  // 川湘居菜单
  {
    id: 1,
    name: '麻婆豆腐',
    price: 38,
    originalPrice: 45,
    description: '麻辣鲜香，口感丰富',
    image: '',
    sales: 352,
    rating: 4.8,
    categoryId: 1,
    restaurantId: 1,
    isSpicy: true,
    isRecommended: true
  },
  {
    id: 2,
    name: '水煮鱼',
    price: 88,
    originalPrice: 98,
    description: '鲜嫩鱼肉，麻辣鲜香',
    image: '',
    sales: 265,
    rating: 4.7,
    categoryId: 1,
    restaurantId: 1,
    isSpicy: true,
    isRecommended: true
  },
  {
    id: 3,
    name: '回锅肉',
    price: 58,
    originalPrice: 68,
    description: '肥而不腻，入口即化',
    image: "",
    sales: 198,
    rating: 4.6,
    categoryId: 2,
    restaurantId: 1,
    isSpicy: true,
    isRecommended: false
  },
  {
    id: 4,
    name: '宫保鸡丁',
    price: 48,
    originalPrice: 52,
    description: '鸡肉鲜嫩，花生香脆',
    image: "",
    sales: 276,
    rating: 4.5,
    categoryId: 2,
    restaurantId: 1,
    isSpicy: true,
    isRecommended: false
  },
  {
    id: 5,
    name: '米饭',
    price: 3,
    originalPrice: 3,
    description: '香喷喷的米饭',
    image: "",
    sales: 1024,
    rating: 4.9,
    categoryId: 3,
    restaurantId: 1,
    isSpicy: false,
    isRecommended: false
  },
  // 新增川湘居菜单
  {
    id: 101,
    name: '辣子鸡',
    price: 68,
    originalPrice: 78,
    description: '麻辣鲜香，口感酥脆',
    image: "",
    sales: 220,
    rating: 4.7,
    categoryId: 2,
    restaurantId: 1,
    isSpicy: true,
    isRecommended: true
  },
  {
    id: 102,
    name: '鱼香肉丝',
    price: 48,
    originalPrice: 55,
    description: '酸甜可口，开胃下饭',
    image: "",
    sales: 180,
    rating: 4.6,
    categoryId: 2,
    restaurantId: 1,
    isSpicy: true,
    isRecommended: false
  },
  {
    id: 103,
    name: '干锅牛蛙',
    price: 98,
    originalPrice: 108,
    description: '鲜嫩多汁，香辣过瘾',
    image: "",
    sales: 150,
    rating: 4.8,
    categoryId: 2,
    restaurantId: 1,
    isSpicy: true,
    isRecommended: true
  },
  {
    id: 104,
    name: '酸辣粉',
    price: 18,
    originalPrice: 22,
    description: '酸辣爽口，劲道十足',
    image: "",
    sales: 320,
    rating: 4.5,
    categoryId: 4,
    restaurantId: 1,
    isSpicy: true,
    isRecommended: false
  },
  {
    id: 105,
    name: '红糖糍粑',
    price: 22,
    originalPrice: 25,
    description: '软糯香甜，回味无穷',
    image: "",
    sales: 210,
    rating: 4.7,
    categoryId: 4,
    restaurantId: 1,
    isSpicy: false,
    isRecommended: true
  },
  {
    id: 106,
    name: '冰镇酸梅汤',
    price: 12,
    originalPrice: 15,
    description: '酸甜可口，消暑解渴',
    image: "",
    sales: 280,
    rating: 4.6,
    categoryId: 5,
    restaurantId: 1,
    isSpicy: false,
    isRecommended: false
  },
  
  // 粤海渔村菜单
  {
    id: 6,
    name: '清蒸鲈鱼',
    price: 98,
    originalPrice: 108,
    description: '鱼肉鲜嫩，清淡爽口',
    image: "",
    sales: 187,
    rating: 4.9,
    categoryId: 6,
    restaurantId: 2,
    isSpicy: false,
    isRecommended: true
  },
  {
    id: 7,
    name: '白灼虾',
    price: 128,
    originalPrice: 138,
    description: '虾肉鲜甜，蘸料提香',
    image: "",
    sales: 156,
    rating: 4.8,
    categoryId: 7,
    restaurantId: 2,
    isSpicy: false,
    isRecommended: true
  },
  // 新增粤海渔村菜单
  {
    id: 201,
    name: '蜜汁叉烧',
    price: 68,
    originalPrice: 78,
    description: '肉质鲜嫩，甜香可口',
    image: "",
    sales: 210,
    rating: 4.7,
    categoryId: 8,
    restaurantId: 2,
    isSpicy: false,
    isRecommended: true
  },
  {
    id: 202,
    name: '脆皮烧鹅',
    price: 88,
    originalPrice: 98,
    description: '皮脆肉嫩，香气四溢',
    image: "",
    sales: 180,
    rating: 4.8,
    categoryId: 8,
    restaurantId: 2,
    isSpicy: false,
    isRecommended: true
  },
  {
    id: 203,
    name: '虾饺',
    price: 38,
    originalPrice: 42,
    description: '皮薄馅多，鲜香可口',
    image: "",
    sales: 320,
    rating: 4.9,
    categoryId: 9,
    restaurantId: 2,
    isSpicy: false,
    isRecommended: true
  },
  {
    id: 204,
    name: '肠粉',
    price: 28,
    originalPrice: 32,
    description: '滑嫩爽口，鲜香可口',
    image: "",
    sales: 280,
    rating: 4.7,
    categoryId: 9,
    restaurantId: 2,
    isSpicy: false,
    isRecommended: false
  },
  {
    id: 205,
    name: '杨枝甘露',
    price: 22,
    originalPrice: 25,
    description: '清爽甜蜜，消暑解渴',
    image: "",
    sales: 230,
    rating: 4.8,
    categoryId: 10,
    restaurantId: 2,
    isSpicy: false,
    isRecommended: true
  },
  
  // 京味小馆菜单
  {
    id: 8,
    name: '炸酱面',
    price: 28,
    originalPrice: 32,
    description: '面条筋道，酱香浓郁',
    image: "",
    sales: 321,
    rating: 4.7,
    categoryId: 11,
    restaurantId: 3,
    isSpicy: false,
    isRecommended: true
  },
  {
    id: 9,
    name: '烤鸭',
    price: 138,
    originalPrice: 158,
    description: '皮酥肉嫩，香气四溢',
    image: "",
    sales: 267,
    rating: 4.9,
    categoryId: 12,
    restaurantId: 3,
    isSpicy: false,
    isRecommended: true
  },
  // 新增京味小馆菜单
  {
    id: 301,
    name: '豆汁',
    price: 8,
    originalPrice: 10,
    description: '老北京特色，独特风味',
    image: "",
    sales: 150,
    rating: 4.2,
    categoryId: 15,
    restaurantId: 3,
    isSpicy: false,
    isRecommended: true
  },
  {
    id: 302,
    name: '爆肚',
    price: 48,
    originalPrice: 55,
    description: '脆嫩爽口，蘸料提香',
    image: "",
    sales: 180,
    rating: 4.6,
    categoryId: 13,
    restaurantId: 3,
    isSpicy: false,
    isRecommended: true
  },
  {
    id: 303,
    name: '驴打滚',
    price: 18,
    originalPrice: 22,
    description: '软糯香甜，黄豆粉裹',
    image: "",
    sales: 210,
    rating: 4.7,
    categoryId: 13,
    restaurantId: 3,
    isSpicy: false,
    isRecommended: false
  },
  {
    id: 304,
    name: '卤煮火烧',
    price: 38,
    originalPrice: 42,
    description: '香辣可口，老北京风味',
    image: "",
    sales: 230,
    rating: 4.5,
    categoryId: 12,
    restaurantId: 3,
    isSpicy: true,
    isRecommended: true
  },
  {
    id: 305,
    name: '豌豆黄',
    price: 15,
    originalPrice: 18,
    description: '清香爽口，细腻绵软',
    image: "",
    sales: 190,
    rating: 4.6,
    categoryId: 13,
    restaurantId: 3,
    isSpicy: false,
    isRecommended: false
  }
]

// 订单
const orders = [
  {
    id: 'ORDER20230601001',
    userId: 'user123',
    restaurantId: 1,
    restaurantName: '川湘居',
    status: 'COMPLETED', // PENDING, COMPLETED, CANCELLED
    items: [
      {
        id: 1,
        name: '麻婆豆腐',
        price: 38,
        quantity: 1,
        image: "",
      },
      {
        id: 2,
        name: '水煮鱼',
        price: 88,
        quantity: 1,
        image: "",
      },
      {
        id: 5,
        name: '米饭',
        price: 3,
        quantity: 2,
        image: "",
      }
    ],
    totalPrice: 132,
    address: '北京市朝阳区建国路88号',
    createTime: '2023-06-01 12:30:45',
    payTime: '2023-06-01 12:32:10',
    deliveryTime: '2023-06-01 13:15:22',
    remark: '不要辣',
    paymentMethod: '微信支付',
    contactName: '张三',
    contactPhone: '13800138000',
    deliveryFee: 5
  },
  {
    id: 'ORDER20230602001',
    userId: 'user123',
    restaurantId: 2,
    restaurantName: '粤海渔村',
    status: 'COMPLETED',
    items: [
      {
        id: 6,
        name: '清蒸鲈鱼',
        price: 98,
        quantity: 1,
        image: "",
      },
      {
        id: 7,
        name: '白灼虾',
        price: 128,
        quantity: 1,
        image: "",
      }
    ],
    totalPrice: 226,
    address: '北京市海淀区中关村南大街5号',
    createTime: '2023-06-02 18:20:15',
    payTime: '2023-06-02 18:21:30',
    deliveryTime: '2023-06-02 19:05:40',
    remark: '',
    paymentMethod: '支付宝',
    contactName: '张三',
    contactPhone: '13800138000',
    deliveryFee: 5
  },
  {
    id: 'ORDER20230603001',
    userId: 'user123',
    restaurantId: 1,
    restaurantName: '川湘居',
    status: 'PENDING',
    items: [
      {
        id: 101,
        name: '辣子鸡',
        price: 68,
        quantity: 1,
        image: "",
      },
      {
        id: 102,
        name: '鱼香肉丝',
        price: 48,
        quantity: 1,
        image: "",
      },
      {
        id: 5,
        name: '米饭',
        price: 3,
        quantity: 2,
        image: "",
      }
    ],
    totalPrice: 122,
    address: '北京市朝阳区建国路88号',
    createTime: '2023-06-03 19:10:25',
    payTime: '',
    deliveryTime: '',
    remark: '米饭少放点',
    paymentMethod: '',
    contactName: '张三',
    contactPhone: '13800138000',
    deliveryFee: 5
  },
  {
    id: 'ORDER20230604001',
    userId: 'user123',
    restaurantId: 3,
    restaurantName: '京味小馆',
    status: 'CANCELLED',
    items: [
      {
        id: 8,
        name: '炸酱面',
        price: 28,
        quantity: 2,
        image: "",
      },
      {
        id: 302,
        name: '爆肚',
        price: 48,
        quantity: 1,
        image: "",
      }
    ],
    totalPrice: 104,
    address: '北京市西城区西单北大街120号',
    createTime: '2023-06-04 12:05:30',
    payTime: '',
    deliveryTime: '',
    remark: '',
    paymentMethod: '',
    contactName: '张三',
    contactPhone: '13800138000',
    deliveryFee: 5,
    cancelReason: '用户取消',
    cancelTime: '2023-06-04 12:10:15'
  },
  {
    id: 'ORDER20230605001',
    userId: 'user123',
    restaurantId: 2,
    restaurantName: '粤海渔村',
    status: 'COMPLETED',
    items: [
      {
        id: 201,
        name: '蜜汁叉烧',
        price: 68,
        quantity: 1,
        image: "",
      },
      {
        id: 203,
        name: '虾饺',
        price: 38,
        quantity: 2,
        image: "",
      },
      {
        id: 205,
        name: '杨枝甘露',
        price: 22,
        quantity: 1,
        image: "",
      }
    ],
    totalPrice: 166,
    address: '北京市海淀区中关村南大街5号',
    createTime: '2023-06-05 18:30:45',
    payTime: '2023-06-05 18:32:10',
    deliveryTime: '2023-06-05 19:15:22',
    remark: '',
    paymentMethod: '微信支付',
    contactName: '张三',
    contactPhone: '13800138000',
    deliveryFee: 5
  },
  {
    id: 'ORDER20230606001',
    userId: 'user123',
    restaurantId: 3,
    restaurantName: '京味小馆',
    status: 'PENDING',
    items: [
      {
        id: 9,
        name: '烤鸭',
        price: 138,
        quantity: 1,
        image: "",
      },
      {
        id: 304,
        name: '卤煮火烧',
        price: 38,
        quantity: 1,
        image: "",
      }
    ],
    totalPrice: 176,
    address: '北京市西城区西单北大街120号',
    createTime: '2023-06-06 19:45:30',
    payTime: '',
    deliveryTime: '',
    remark: '烤鸭要半只',
    paymentMethod: '',
    contactName: '张三',
    contactPhone: '13800138000',
    deliveryFee: 5
  }
]

// Mock API响应
const mockResponses = {
  // 登录响应
  login: {
    code: 0,
    message: 'success',
    data: {
      token: 'mock_token_123456',
      userInfo: {
        id: 'user123',
        nickName: '张三',
        avatarUrl: '',
        phone: '13800138000'
      }
    }
  },
  
  // 餐厅列表响应
  restaurantList: {
    code: 0,
    message: 'success',
    data: restaurants
  },
  
  // 创建订单响应
  createOrder: {
    code: 0,
    message: 'success',
    data: {
      orderId: 'ORDER' + Date.now(),
      totalPrice: 132
    }
  },
  
  // 订单列表响应
  orderList: {
    code: 0,
    message: 'success',
    data: orders
  },
  
  // 支付订单响应
  payOrder: {
    code: 0,
    message: 'success',
    data: {
      isPaid: true,
      payTime: new Date().toISOString()
    }
  }
}

module.exports = {
  restaurants,
  categories,
  menus,
  orders,
  login: mockResponses.login,
  restaurantList: mockResponses.restaurantList,
  createOrder: mockResponses.createOrder,
  orderList: mockResponses.orderList,
  payOrder: mockResponses.payOrder
} 