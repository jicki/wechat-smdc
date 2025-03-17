import axios from 'axios'

// 订单状态枚举
export const orderStatusEnum = {
  0: '待支付',
  1: '已完成',
  2: '已取消'
}

// 获取订单分页列表
export function getOrderPage(params) {
  return axios.get('/api/order/pageAdmin', { params })
}

// 获取订单详情
export function getOrderDetail(id) {
  return axios.get('/api/order/detail', {
    params: {
      id
    }
  })
}

// 完成订单
export function completeOrder(id) {
  return axios.post('/api/order/complete', null, {
    params: {
      id
    }
  })
} 