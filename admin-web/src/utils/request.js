import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8080', // API的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    // 在请求头中添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// response拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 如果返回的状态码不是200，说明接口请求失败
    if (res.code !== 200) {
      Message({
        message: res.message || '系统异常',
        type: 'error',
        duration: 5 * 1000
      })

      // 401: 未登录或token过期
      if (res.code === 401) {
        // 清除token
        localStorage.removeItem('token')
        // 跳转到登录页
        router.push('/login')
      }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    let message = error.message
    if (error.response) {
      // 401: 未登录或token过期
      if (error.response.status === 401) {
        // 清除token
        localStorage.removeItem('token')
        // 跳转到登录页
        router.push('/login')
        message = '登录已过期，请重新登录'
      } else if (error.response.status === 403) {
        message = '没有操作权限'
      } else if (error.response.data && error.response.data.message) {
        message = error.response.data.message
      }
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service 