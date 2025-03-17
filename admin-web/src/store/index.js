import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    // 菜单折叠状态
    isCollapse: false
  },
  mutations: {
    // 设置用户信息
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    // 清除用户信息
    CLEAR_USER_INFO(state) {
      state.userInfo = {}
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
    },
    // 切换菜单折叠状态
    TOGGLE_COLLAPSE(state) {
      state.isCollapse = !state.isCollapse
    }
  },
  actions: {
    // 登录
    login({ commit }, userInfo) {
      commit('SET_USER_INFO', userInfo)
    },
    // 退出登录
    logout({ commit }) {
      commit('CLEAR_USER_INFO')
    }
  },
  getters: {
    // 获取用户信息
    userInfo: state => state.userInfo,
    // 获取菜单折叠状态
    isCollapse: state => state.isCollapse
  }
}) 