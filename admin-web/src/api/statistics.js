import request from '@/utils/request'

/**
 * 获取统计数据
 * @returns {Promise}
 */
export function getStatistics() {
  return request({
    url: '/api/statistics',
    method: 'get'
  })
}

/**
 * 获取订单统计数据
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getOrderStatistics(params) {
  return request({
    url: '/api/statistics/order',
    method: 'get',
    params
  })
}

/**
 * 获取用户统计数据
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getUserStatistics(params) {
  return request({
    url: '/api/statistics/user',
    method: 'get',
    params
  })
}

/**
 * 获取菜品销售统计数据
 * @param {Object} params 查询参数
 * @returns {Promise}
 */
export function getDishStatistics(params) {
  return request({
    url: '/api/statistics/dish',
    method: 'get',
    params
  })
} 