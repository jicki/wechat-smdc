<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="logo">
        <img src="../assets/img/logo.svg" alt="logo" v-if="!isCollapse" />
        <img src="../assets/img/logo.svg" alt="logo" v-else style="width: 40px; height: 40px;" />
      </div>
      <el-menu
        :default-active="activePath"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :collapse="isCollapse"
        :collapse-transition="false"
        :unique-opened="true"
        router
      >
        <el-menu-item index="/welcome">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <i class="el-icon-user"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/shop">
          <i class="el-icon-s-shop"></i>
          <span slot="title">店铺管理</span>
        </el-menu-item>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-dish"></i>
            <span>菜品管理</span>
          </template>
          <el-menu-item index="/dish/category">
            <i class="el-icon-menu"></i>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/dish">
            <i class="el-icon-food"></i>
            <span>菜品管理</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="/order">
          <i class="el-icon-s-order"></i>
          <span slot="title">订单管理</span>
        </el-menu-item>
        <el-menu-item index="/system/config">
          <i class="el-icon-setting"></i>
          <span slot="title">系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右侧内容 -->
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="header-left">
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="toggleCollapse"></i>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">{{ item }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userInfo.nickname || userInfo.phone }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserInfo } from '@/api/user'

export default {
  name: 'Home',
  data() {
    return {
      // 激活菜单
      activePath: '',
      // 面包屑导航
      breadcrumbList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'isCollapse'])
  },
  created() {
    // 获取当前路由
    this.activePath = this.$route.path
    // 获取用户信息
    this.getUserInfo()
    // 设置面包屑
    this.setBreadcrumb()
  },
  watch: {
    $route(to) {
      // 更新激活菜单
      this.activePath = to.path
      // 更新面包屑
      this.setBreadcrumb()
    }
  },
  methods: {
    // 切换菜单折叠状态
    toggleCollapse() {
      this.$store.commit('TOGGLE_COLLAPSE')
    },
    // 下拉菜单命令处理
    handleCommand(command) {
      if (command === 'logout') {
        this.logout()
      } else if (command === 'userInfo') {
        // TODO: 跳转到个人信息页面
      }
    },
    // 退出登录
    logout() {
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除用户信息
        this.$store.dispatch('logout')
        // 跳转到登录页
        this.$router.push('/login')
        this.$message.success('退出登录成功')
      }).catch(() => {})
    },
    // 获取用户信息
    async getUserInfo() {
      try {
        const { data: res } = await getUserInfo()
        if (res.code === 200) {
          this.$store.commit('SET_USER_INFO', res.data)
        }
      } catch (error) {
        console.error(error)
      }
    },
    // 设置面包屑
    setBreadcrumb() {
      const pathMap = {
        '/welcome': ['欢迎'],
        '/users': ['用户管理'],
        '/shop': ['店铺管理'],
        '/dish/category': ['菜品管理', '分类管理'],
        '/dish': ['菜品管理', '菜品列表'],
        '/order': ['订单管理'],
        '/system/config': ['系统设置']
      }
      this.breadcrumbList = pathMap[this.$route.path] || []
    }
  }
}
</script>

<style scoped>
.home-container {
  height: 100%;
}

.el-aside {
  background-color: #304156;
  transition: width 0.3s;
}

.logo {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2b2f3a;
  overflow: hidden;
}

.logo img {
  height: 50px;
  transition: all 0.3s;
}

.el-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left i {
  font-size: 20px;
  margin-right: 20px;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style> 