<template>
  <div class="welcome-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <div slot="header">
            <span>欢迎使用微信点餐系统后台管理</span>
          </div>
          <div class="welcome-content">
            <div class="welcome-user">
              <h2>您好，{{ userInfo.nickname || userInfo.phone }}</h2>
              <p>欢迎使用微信点餐系统后台管理平台</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <i class="el-icon-user"></i>
            <div class="data-title">用户总数</div>
          </div>
          <div class="data-content">
            <div class="data-value">{{ statistics.userCount || 0 }}</div>
            <div class="data-desc">总注册用户数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <i class="el-icon-food"></i>
            <div class="data-title">菜品总数</div>
          </div>
          <div class="data-content">
            <div class="data-value">{{ statistics.dishCount || 0 }}</div>
            <div class="data-desc">总菜品数量</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <i class="el-icon-s-order"></i>
            <div class="data-title">今日订单</div>
          </div>
          <div class="data-content">
            <div class="data-value">{{ statistics.todayOrderCount || 0 }}</div>
            <div class="data-desc">今日订单数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="data-header">
            <i class="el-icon-money"></i>
            <div class="data-title">今日收入</div>
          </div>
          <div class="data-content">
            <div class="data-value">¥{{ statistics.todayIncome || 0 }}</div>
            <div class="data-desc">今日收入金额</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>快捷入口</span>
          </div>
          <div class="shortcut-container">
            <div class="shortcut-item" @click="$router.push('/users')">
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </div>
            <div class="shortcut-item" @click="$router.push('/shop')">
              <i class="el-icon-s-shop"></i>
              <span>店铺管理</span>
            </div>
            <div class="shortcut-item" @click="$router.push('/dish')">
              <i class="el-icon-food"></i>
              <span>菜品管理</span>
            </div>
            <div class="shortcut-item" @click="$router.push('/order')">
              <i class="el-icon-s-order"></i>
              <span>订单管理</span>
            </div>
            <div class="shortcut-item" @click="$router.push('/system/config')">
              <i class="el-icon-setting"></i>
              <span>系统设置</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>系统功能</span>
          </div>
          <div class="welcome-info">
            <ul>
              <li>用户管理：管理系统用户，包括启用/禁用用户等操作</li>
              <li>店铺管理：管理店铺信息，包括店铺名称、公告、地址等</li>
              <li>菜品管理：管理菜品分类和菜品信息</li>
              <li>订单管理：查看和处理订单</li>
              <li>系统设置：配置系统参数，如微信支付等</li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStatistics } from '@/api/statistics'

export default {
  name: 'Welcome',
  data() {
    return {
      statistics: {
        userCount: 0,
        dishCount: 0,
        todayOrderCount: 0,
        todayIncome: 0
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    // 模拟获取统计数据
    this.mockStatistics()
  },
  methods: {
    // 模拟获取统计数据
    mockStatistics() {
      // 实际项目中应该调用API获取真实数据
      // 这里使用模拟数据
      this.statistics = {
        userCount: 128,
        dishCount: 56,
        todayOrderCount: 32,
        todayIncome: 2580.50
      }
    }
  }
}
</script>

<style scoped>
.welcome-container {
  padding: 20px;
}

.welcome-content {
  padding: 20px;
}

.welcome-user {
  margin-bottom: 10px;
}

.welcome-user h2 {
  margin-bottom: 10px;
  color: #409EFF;
}

.welcome-info ul {
  padding-left: 20px;
  line-height: 2;
}

.data-card {
  height: 120px;
  cursor: pointer;
  transition: all 0.3s;
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.data-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.data-header i {
  font-size: 20px;
  color: #409EFF;
  margin-right: 10px;
}

.data-title {
  font-size: 16px;
  color: #606266;
}

.data-content {
  padding-left: 30px;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.data-desc {
  font-size: 12px;
  color: #909399;
}

.shortcut-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.shortcut-item {
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
  border-radius: 4px;
  transition: all 0.3s;
}

.shortcut-item:hover {
  background-color: #f5f7fa;
  transform: translateY(-5px);
}

.shortcut-item i {
  font-size: 30px;
  color: #409EFF;
  margin-bottom: 10px;
}

.shortcut-item span {
  font-size: 14px;
  color: #606266;
}
</style> 