import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'

Vue.config.productionTip = false

// 使用ElementUI
Vue.use(ElementUI)

// 配置axios
axios.defaults.baseURL = 'http://localhost:8080'
// 请求拦截器，添加token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
// 响应拦截器，处理错误
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      // 未登录或token过期
      ElementUI.Message.error('登录已过期，请重新登录')
      localStorage.removeItem('token')
      router.push('/login')
    } else if (error.response && error.response.status === 403) {
      // 没有权限
      ElementUI.Message.error('没有操作权限')
    } else {
      // 其他错误
      let errorMessage = '服务器异常'
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message
      }
      ElementUI.Message.error(errorMessage)
    }
    return Promise.reject(error)
  }
)
// 将axios挂载到Vue原型上
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app') 