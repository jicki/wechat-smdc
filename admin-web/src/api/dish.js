import axios from 'axios'

// 获取菜品列表
export function getDishList(categoryId) {
  return axios.get('/api/dish/list', {
    params: {
      categoryId
    }
  })
}

// 获取菜品分页列表
export function getDishPage(params) {
  return axios.get('/api/dish/page', { params })
}

// 添加菜品
export function addDish(dish) {
  return axios.post('/api/dish/add', dish)
}

// 更新菜品
export function updateDish(dish) {
  return axios.post('/api/dish/update', dish)
}

// 删除菜品
export function deleteDish(id) {
  return axios.post('/api/dish/delete', null, {
    params: {
      id
    }
  })
}

// 批量删除菜品
export function deleteDishBatch(ids) {
  return axios.post('/api/dish/deleteBatch', ids)
}

// 更新菜品状态
export function updateDishStatus(id, status) {
  return axios.post('/api/dish/updateStatus', null, {
    params: {
      id,
      status
    }
  })
} 