import axios from 'axios'

// 获取菜品分类列表
export function getCategoryList() {
  return axios.get('/api/dish/category/list')
}

// 获取菜品分类分页列表
export function getCategoryPage(params) {
  return axios.get('/api/dish/category/page', { params })
}

// 添加菜品分类
export function addCategory(data) {
  return axios.post('/api/dish/category/add', data)
}

// 更新菜品分类
export function updateCategory(data) {
  return axios.post('/api/dish/category/update', data)
}

// 删除菜品分类
export function deleteCategory(id) {
  return axios.post('/api/dish/category/delete', null, {
    params: {
      id
    }
  })
}

// 更新菜品分类状态
export function updateCategoryStatus(id, status) {
  return axios.post('/api/dish/category/updateStatus', null, {
    params: {
      id,
      status
    }
  })
} 