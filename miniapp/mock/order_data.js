// 订单mock数据
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
    deliveryFee: 5,
    tableNo: 'A01'
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
    deliveryFee: 5,
    tableNo: 'A05'
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
    deliveryFee: 5,
    tableNo: 'B07'
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
  },
  {
    id: 'ORDER20230607001',
    userId: 'user123',
    restaurantId: 1,
    restaurantName: '川湘居',
    status: 'COMPLETED',
    items: [
      {
        id: 103,
        name: '干锅牛蛙',
        price: 98,
        quantity: 1,
        image: "",
      },
      {
        id: 104,
        name: '酸辣粉',
        price: 18,
        quantity: 1,
        image: "",
      }
    ],
    totalPrice: 116,
    address: '北京市朝阳区建国路88号',
    createTime: '2023-06-07 12:15:30',
    payTime: '2023-06-07 12:17:45',
    deliveryTime: '2023-06-07 13:00:20',
    remark: '不要太辣',
    paymentMethod: '微信支付',
    contactName: '张三',
    contactPhone: '13800138000',
    deliveryFee: 5
  }
]

// 导出订单数据
module.exports = {
  orders
}

 