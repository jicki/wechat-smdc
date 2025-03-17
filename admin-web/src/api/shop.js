import axios from 'axios'

// 获取店铺信息
export function getShopInfo() {
  return axios.get('/api/shop/info')
}

// 更新店铺信息
export function updateShopInfo(data) {
  return axios.post('/api/shop/update', data)
}

// 上传店铺Logo
export function uploadLogo(file) {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post('/api/shop/uploadLogo', formData)
}

// 更新店铺状态
export function updateShopStatus(status) {
  return axios.post('/api/shop/updateStatus', null, {
    params: {
      status
    }
  })
} 