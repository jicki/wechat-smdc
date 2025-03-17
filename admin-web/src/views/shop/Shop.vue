<template>
  <div class="shop-container">
    <el-card>
      <div slot="header">
        <span>店铺信息管理</span>
      </div>
      <el-form :model="shopForm" :rules="shopRules" ref="shopFormRef" label-width="100px" v-loading="loading">
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="shopForm.name"></el-input>
        </el-form-item>
        <el-form-item label="店铺Logo">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload">
            <img v-if="shopForm.logo" :src="shopForm.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺公告" prop="notice">
          <el-input type="textarea" v-model="shopForm.notice" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="店铺地址" prop="address">
          <el-input v-model="shopForm.address"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="shopForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" prop="businessHours">
          <el-input v-model="shopForm.businessHours" placeholder="例如：09:00-22:00"></el-input>
        </el-form-item>
        <el-form-item label="营业状态" prop="status">
          <el-switch
            v-model="shopForm.status"
            :active-value="0"
            :inactive-value="1"
            active-text="营业中"
            inactive-text="休息中"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveShopInfo">保存</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getShopInfo, updateShopInfo, uploadLogo, updateShopStatus } from '@/api/shop'

export default {
  name: 'Shop',
  data() {
    return {
      // 店铺表单
      shopForm: {
        id: '',
        name: '',
        logo: '',
        notice: '',
        address: '',
        phone: '',
        businessHours: '',
        status: 0
      },
      // 表单验证规则
      shopRules: {
        name: [
          { required: true, message: '请输入店铺名称', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入店铺地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        businessHours: [
          { required: true, message: '请输入营业时间', trigger: 'blur' }
        ]
      },
      // 加载状态
      loading: false,
      // 上传URL
      uploadUrl: 'http://localhost:8080/api/shop/uploadLogo',
      // 上传请求头
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  },
  created() {
    this.getShopInfo()
  },
  methods: {
    // 获取店铺信息
    async getShopInfo() {
      this.loading = true
      try {
        const { data: res } = await getShopInfo()
        if (res.code !== 0) {
          return this.$message.error(res.message)
        }
        this.shopForm = res.data
      } catch (error) {
        console.error(error)
        this.$message.error('获取店铺信息失败')
      } finally {
        this.loading = false
      }
    },
    // 保存店铺信息
    saveShopInfo() {
      this.$refs.shopFormRef.validate(async valid => {
        if (!valid) return
        
        this.loading = true
        try {
          const { data: res } = await updateShopInfo(this.shopForm)
          if (res.code !== 0) {
            return this.$message.error(res.message)
          }
          
          // 更新店铺状态
          await updateShopStatus(this.shopForm.status)
          
          this.$message.success('保存店铺信息成功')
        } catch (error) {
          console.error(error)
          this.$message.error('保存店铺信息失败')
        } finally {
          this.loading = false
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.shopFormRef.resetFields()
      this.getShopInfo()
    },
    // Logo上传成功
    handleLogoSuccess(res) {
      if (res.code === 0) {
        this.shopForm.logo = res.data
        this.$message.success('上传Logo成功')
      } else {
        this.$message.error(res.message || '上传Logo失败')
      }
    },
    // Logo上传前的校验
    beforeLogoUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传Logo图片只能是JPG或PNG格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传Logo图片大小不能超过2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>
.shop-container {
  padding: 20px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style> 