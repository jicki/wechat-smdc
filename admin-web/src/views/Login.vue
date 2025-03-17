<template>
  <div class="login-container">
    <div class="login-box">
      <div class="title">微信点餐系统后台管理</div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" prefix-icon="el-icon-user" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleLogin" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      // 登录表单
      loginForm: {
        phone: '',
        password: ''
      },
      // 表单验证规则
      loginRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      },
      // 是否正在登录
      loading: false
    }
  },
  methods: {
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (!valid) return
        
        this.loading = true
        try {
          const { data: res } = await login(this.loginForm)
          if (res.code !== 0) {
            return this.$message.error(res.message)
          }
          
          // 保存token
          localStorage.setItem('token', res.data)
          
          // 获取用户信息
          await this.$store.dispatch('login', { phone: this.loginForm.phone })
          
          // 跳转到首页
          this.$router.push('/home')
          
          this.$message.success('登录成功')
        } catch (error) {
          console.error(error)
          this.$message.error('登录失败')
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  padding: 20px;
  box-sizing: border-box;
}

.title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.login-form {
  width: 100%;
}

.login-btn {
  width: 100%;
}
</style> 