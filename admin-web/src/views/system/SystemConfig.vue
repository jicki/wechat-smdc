<template>
  <div class="config-container">
    <el-card>
      <div slot="header">
        <span>系统配置</span>
      </div>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="微信支付配置" name="wxpay">
          <el-form :model="wxpayForm" :rules="wxpayRules" ref="wxpayFormRef" label-width="120px" v-loading="loading">
            <el-form-item label="AppID" prop="wx_appid">
              <el-input v-model="wxpayForm.wx_appid"></el-input>
            </el-form-item>
            <el-form-item label="AppSecret" prop="wx_secret">
              <el-input v-model="wxpayForm.wx_secret" show-password></el-input>
            </el-form-item>
            <el-form-item label="商户号" prop="wx_mchid">
              <el-input v-model="wxpayForm.wx_mchid"></el-input>
            </el-form-item>
            <el-form-item label="API密钥" prop="wx_key">
              <el-input v-model="wxpayForm.wx_key" show-password></el-input>
            </el-form-item>
            <el-form-item label="回调地址" prop="wx_notify_url">
              <el-input v-model="wxpayForm.wx_notify_url"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveWxpayConfig">保存</el-button>
              <el-button @click="resetWxpayForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="微信小程序配置" name="wxminiapp">
          <el-form :model="wxminiappForm" :rules="wxminiappRules" ref="wxminiappFormRef" label-width="120px" v-loading="loading">
            <el-form-item label="AppID" prop="wx.appid">
              <el-input v-model="wxminiappForm['wx.appid']"></el-input>
            </el-form-item>
            <el-form-item label="AppSecret" prop="wx.appsecret">
              <el-input v-model="wxminiappForm['wx.appsecret']" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveWxminiappConfig">保存</el-button>
              <el-button @click="resetWxminiappForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="其他配置" name="other">
          <el-form :model="otherForm" ref="otherFormRef" label-width="120px" v-loading="loading">
            <el-form-item v-for="(item, index) in otherConfigs" :key="index" :label="item.configName" :prop="item.configKey">
              <el-input v-model="otherForm[item.configKey]"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveOtherConfig">保存</el-button>
              <el-button @click="resetOtherForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getConfigList, getWxPayConfig, getWxMiniAppConfig, updateConfig, updateConfigBatch } from '@/api/systemConfig'

export default {
  name: 'SystemConfig',
  data() {
    return {
      // 激活的标签页
      activeTab: 'wxpay',
      // 微信支付表单
      wxpayForm: {
        wx_appid: '',
        wx_secret: '',
        wx_mchid: '',
        wx_key: '',
        wx_notify_url: ''
      },
      // 微信支付表单验证规则
      wxpayRules: {
        wx_appid: [
          { required: true, message: '请输入AppID', trigger: 'blur' }
        ],
        wx_secret: [
          { required: true, message: '请输入AppSecret', trigger: 'blur' }
        ],
        wx_mchid: [
          { required: true, message: '请输入商户号', trigger: 'blur' }
        ],
        wx_key: [
          { required: true, message: '请输入API密钥', trigger: 'blur' }
        ],
        wx_notify_url: [
          { required: true, message: '请输入回调地址', trigger: 'blur' }
        ]
      },
      // 微信小程序表单
      wxminiappForm: {
        'wx.appid': '',
        'wx.appsecret': ''
      },
      // 微信小程序表单验证规则
      wxminiappRules: {
        'wx.appid': [
          { required: true, message: '请输入AppID', trigger: 'blur' }
        ],
        'wx.appsecret': [
          { required: true, message: '请输入AppSecret', trigger: 'blur' }
        ]
      },
      // 其他配置表单
      otherForm: {},
      // 其他配置列表
      otherConfigs: [],
      // 加载状态
      loading: false
    }
  },
  created() {
    this.getWxpayConfig()
    this.getWxminiappConfig()
    this.getOtherConfigs()
  },
  methods: {
    // 获取微信支付配置
    async getWxpayConfig() {
      this.loading = true
      try {
        const { data: res } = await getWxPayConfig()
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        this.wxpayForm = res.data
      } catch (error) {
        console.error(error)
        this.$message.error('获取微信支付配置失败')
      } finally {
        this.loading = false
      }
    },
    // 获取微信小程序配置
    async getWxminiappConfig() {
      this.loading = true
      try {
        const { data: res } = await getWxMiniAppConfig()
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        this.wxminiappForm = {
          'wx.appid': res.data.appid,
          'wx.appsecret': res.data.appsecret
        }
      } catch (error) {
        console.error(error)
        this.$message.error('获取微信小程序配置失败')
      } finally {
        this.loading = false
      }
    },
    // 获取其他配置
    async getOtherConfigs() {
      this.loading = true
      try {
        const { data: res } = await getConfigList()
        if (res.code !== 200) {
          return this.$message.error(res.message)
        }
        
        // 过滤出非微信支付和非微信小程序配置
        this.otherConfigs = res.data.filter(item => 
          !item.configKey.startsWith('wx_') && 
          !item.configKey.startsWith('wx.')
        )
        
        // 构建表单数据
        const formData = {}
        this.otherConfigs.forEach(item => {
          formData[item.configKey] = item.configValue
        })
        this.otherForm = formData
      } catch (error) {
        console.error(error)
        this.$message.error('获取其他配置失败')
      } finally {
        this.loading = false
      }
    },
    // 保存微信支付配置
    saveWxpayConfig() {
      this.$refs.wxpayFormRef.validate(async valid => {
        if (!valid) return
        
        this.loading = true
        try {
          const { data: res } = await updateConfigBatch(this.wxpayForm)
          if (res.code !== 0) {
            return this.$message.error(res.message)
          }
          
          this.$message.success('保存微信支付配置成功')
        } catch (error) {
          console.error(error)
          this.$message.error('保存微信支付配置失败')
        } finally {
          this.loading = false
        }
      })
    },
    // 保存微信小程序配置
    saveWxminiappConfig() {
      this.$refs.wxminiappFormRef.validate(async valid => {
        if (!valid) return
        
        this.loading = true
        try {
          const { data: res } = await updateConfigBatch(this.wxminiappForm)
          if (res.code !== 0) {
            return this.$message.error(res.message)
          }
          
          this.$message.success('保存微信小程序配置成功')
        } catch (error) {
          console.error(error)
          this.$message.error('保存微信小程序配置失败')
        } finally {
          this.loading = false
        }
      })
    },
    // 保存其他配置
    async saveOtherConfig() {
      this.loading = true
      try {
        const { data: res } = await updateConfigBatch(this.otherForm)
        if (res.code !== 0) {
          return this.$message.error(res.message)
        }
        
        this.$message.success('保存其他配置成功')
      } catch (error) {
        console.error(error)
        this.$message.error('保存其他配置失败')
      } finally {
        this.loading = false
      }
    },
    // 重置微信支付表单
    resetWxpayForm() {
      this.$refs.wxpayFormRef.resetFields()
      this.getWxpayConfig()
    },
    // 重置微信小程序表单
    resetWxminiappForm() {
      this.$refs.wxminiappFormRef.resetFields()
      this.getWxminiappConfig()
    },
    // 重置其他配置表单
    resetOtherForm() {
      this.$refs.otherFormRef.resetFields()
      this.getOtherConfigs()
    }
  }
}
</script>

<style scoped>
.config-container {
  padding: 20px;
}
</style> 