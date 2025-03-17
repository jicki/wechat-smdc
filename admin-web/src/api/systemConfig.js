import axios from 'axios'

// 获取所有配置
export function getConfigList() {
  return axios.get('/api/config/list')
}

// 获取配置值
export function getConfigValue(key) {
  return axios.get('/api/config/value', {
    params: {
      key
    }
  })
}

// 更新配置
export function updateConfig(key, value) {
  return axios.post('/api/config/update', null, {
    params: {
      key,
      value
    }
  })
}

// 批量更新配置
export function updateConfigBatch(configs) {
  return axios.post('/api/config/updateBatch', configs)
}

// 获取微信支付配置
export function getWxPayConfig() {
  return axios.get('/api/config/wxpay')
}

// 获取微信小程序配置
export function getWxMiniAppConfig() {
  return axios.get('/api/config/wxminiapp')
} 