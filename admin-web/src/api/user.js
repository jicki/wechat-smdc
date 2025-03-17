import axios from 'axios'

// 用户登录
export function login(data) {
  return axios.post('/api/user/login', data)
}

// 获取用户信息
export function getUserInfo() {
  return axios.get('/api/user/info')
}

// 获取用户列表
export function getUserList(params) {
  return axios.get('/api/user/page', { params })
}

// 更新用户状态
export function updateUserStatus(id, status) {
  return axios.post('/api/user/updateStatus', null, {
    params: {
      id,
      status
    }
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  return axios.post('/api/user/update', data)
}

// 更新密码
export function updatePassword(data) {
  return axios.post('/api/user/updatePassword', data)
}

// 上传头像
export function uploadAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post('/api/user/uploadAvatar', formData)
} 