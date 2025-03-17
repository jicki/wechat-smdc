<template>
  <div class="dish-container">
    <el-card>
      <div slot="header">
        <span>菜品管理</span>
      </div>
      <!-- 搜索和添加区域 -->
      <el-row :gutter="20" class="search-row">
        <el-col :span="6">
          <el-input placeholder="请输入菜品名称" v-model="queryParams.name" clearable @clear="getDishList">
            <el-button slot="append" icon="el-icon-search" @click="getDishList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="queryParams.categoryId" placeholder="请选择分类" clearable @change="getDishList">
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加菜品</el-button>
        </el-col>
      </el-row>

      <!-- 菜品列表 -->
      <el-table :data="dishList" border stripe v-loading="loading">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="name" label="菜品名称" width="120"></el-table-column>
        <el-table-column prop="categoryId" label="所属分类" width="120">
          <template slot-scope="scope">
            {{ getCategoryName(scope.row.categoryId) }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template slot-scope="scope">
            ¥{{ scope.row.price | moneyFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="image" label="图片" width="100">
          <template slot-scope="scope">
            <el-image 
              style="width: 50px; height: 50px" 
              :src="scope.row.image" 
              fit="cover"
              :preview-src-list="[scope.row.image]">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="statusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button 
              type="primary" 
              icon="el-icon-edit" 
              size="mini" 
              @click="showEditDialog(scope.row)">
              编辑
            </el-button>
            <el-button 
              type="danger" 
              icon="el-icon-delete" 
              size="mini" 
              @click="removeDish(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryParams.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加/编辑菜品对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%" @close="dialogClosed">
      <el-form :model="dishForm" :rules="dishRules" ref="dishFormRef" label-width="80px">
        <el-form-item label="菜品名称" prop="name">
          <el-input v-model="dishForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
          <el-select v-model="dishForm.categoryId" placeholder="请选择分类">
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜品价格" prop="price">
          <el-input-number v-model="dishForm.price" :precision="2" :step="0.1" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="菜品图片">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :http-request="uploadImage"
            :before-upload="beforeImageUpload">
            <img v-if="dishForm.image" :src="dishForm.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div v-if="uploading" class="el-upload__tip">上传中...</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="菜品描述" prop="description">
          <el-input type="textarea" v-model="dishForm.description" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="dishForm.sort" :min="0" :max="99"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="dishForm.status"
            :active-value="0"
            :inactive-value="1"
            active-text="上架"
            inactive-text="下架"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDishPage, addDish, updateDish, deleteDish, updateDishStatus } from '@/api/dish'
import { getCategoryList } from '@/api/dishCategory'
import { uploadFile } from '@/api/file'
import { formatDate, formatMoney } from '@/utils/format'

export default {
  name: 'Dish',
  data() {
    return {
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        name: '',
        categoryId: ''
      },
      // 菜品列表
      dishList: [],
      // 总条数
      total: 0,
      // 加载状态
      loading: false,
      // 分类选项
      categoryOptions: [],
      // 对话框标题
      dialogTitle: '添加菜品',
      // 对话框可见性
      dialogVisible: false,
      // 菜品表单
      dishForm: {
        id: '',
        name: '',
        categoryId: '',
        price: 0,
        image: '',
        description: '',
        status: 0,
        sort: 0
      },
      // 表单验证规则
      dishRules: {
        name: [
          { required: true, message: '请输入菜品名称', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择所属分类', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入菜品价格', trigger: 'blur' }
        ]
      },
      // 上传URL（改为使用自定义上传）
      uploadUrl: '',
      // 上传请求头
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      // 临时文件对象
      tempFile: null,
      // 是否正在上传图片
      uploading: false
    }
  },
  filters: {
    // 日期格式化
    dateFormat(val) {
      return formatDate(val)
    },
    // 金额格式化
    moneyFormat(val) {
      return formatMoney(val)
    }
  },
  created() {
    this.getCategoryOptions()
    this.getDishList()
  },
  methods: {
    // 获取分类选项
    async getCategoryOptions() {
      try {
        const { data: res } = await getCategoryList()
        if (res.code !== 0) {
          return this.$message.error(res.message)
        }
        this.categoryOptions = res.data
      } catch (error) {
        console.error(error)
        this.$message.error('获取分类选项失败')
      }
    },
    // 获取分类名称
    getCategoryName(categoryId) {
      const category = this.categoryOptions.find(item => item.id === categoryId)
      return category ? category.name : ''
    },
    // 获取菜品列表
    async getDishList() {
      this.loading = true
      try {
        const { data: res } = await getDishPage(this.queryParams)
        if (res.code !== 0) {
          return this.$message.error(res.message)
        }
        this.dishList = res.data.records
        this.total = res.data.total
      } catch (error) {
        console.error(error)
        this.$message.error('获取菜品列表失败')
      } finally {
        this.loading = false
      }
    },
    // 每页条数改变
    handleSizeChange(newSize) {
      this.queryParams.size = newSize
      this.getDishList()
    },
    // 当前页改变
    handleCurrentChange(newPage) {
      this.queryParams.page = newPage
      this.getDishList()
    },
    // 状态改变
    async statusChange(row) {
      try {
        const { data: res } = await updateDishStatus(row.id, row.status)
        if (res.code !== 0) {
          row.status = row.status === 0 ? 1 : 0
          return this.$message.error(res.message)
        }
        this.$message.success('更新菜品状态成功')
      } catch (error) {
        row.status = row.status === 0 ? 1 : 0
        console.error(error)
        this.$message.error('更新菜品状态失败')
      }
    },
    // 显示添加对话框
    showAddDialog() {
      this.dialogTitle = '添加菜品'
      this.dishForm = {
        id: '',
        name: '',
        categoryId: '',
        price: 0,
        image: '',
        description: '',
        status: 0,
        sort: 0
      }
      this.dialogVisible = true
    },
    // 显示编辑对话框
    showEditDialog(row) {
      this.dialogTitle = '编辑菜品'
      this.dishForm = { ...row }
      this.dialogVisible = true
    },
    // 对话框关闭
    dialogClosed() {
      this.$refs.dishFormRef.resetFields()
      this.tempFile = null
    },
    // 图片上传成功
    handleImageSuccess(res) {
      if (res.code === 0) {
        this.dishForm.image = res.data
        this.$message.success('上传图片成功')
      } else {
        this.$message.error(res.message || '上传图片失败')
      }
      this.uploading = false
    },
    // 图片上传前的校验
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是JPG或PNG格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过2MB!')
        return false
      }
      
      // 使用新的文件上传API
      this.uploading = true
      this.uploadImage({ file })
      
      // 返回false，阻止默认上传行为
      return false
    },
    // 使用新的文件上传API上传图片
    async uploadImage(options) {
      const file = options.file
      try {
        this.uploading = true
        const { data: res } = await uploadFile(file)
        if (res.code !== 0) {
          this.$message.error(res.message || '上传图片失败')
          if (options.onError) {
            options.onError(new Error(res.message || '上传图片失败'))
          }
          return
        }
        
        // 设置图片URL
        this.dishForm.image = res.data
        this.$message.success('上传图片成功')
        
        if (options.onSuccess) {
          options.onSuccess(res)
        }
      } catch (error) {
        console.error(error)
        this.$message.error('上传图片失败')
        if (options.onError) {
          options.onError(error)
        }
      } finally {
        this.uploading = false
      }
    },
    // 提交表单
    submitForm() {
      this.$refs.dishFormRef.validate(async valid => {
        if (!valid) return
        
        if (!this.dishForm.image) {
          return this.$message.warning('请上传菜品图片')
        }
        
        // 如果正在上传图片，等待上传完成
        if (this.uploading) {
          return this.$message.warning('图片正在上传中，请稍候')
        }
        
        this.loading = true
        try {
          let res
          if (this.dishForm.id) {
            // 编辑
            res = await updateDish(this.dishForm)
          } else {
            // 添加
            res = await addDish(this.dishForm)
          }
          
          if (res.data.code !== 0) {
            return this.$message.error(res.data.message)
          }
          
          // 关闭对话框
          this.dialogVisible = false
          // 刷新列表
          this.getDishList()
          
          this.$message.success(this.dishForm.id ? '更新菜品成功' : '添加菜品成功')
        } catch (error) {
          console.error(error)
          this.$message.error(this.dishForm.id ? '更新菜品失败' : '添加菜品失败')
        } finally {
          this.loading = false
        }
      })
    },
    // 删除菜品
    removeDish(row) {
      this.$confirm('此操作将永久删除该菜品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const { data: res } = await deleteDish(row.id)
          if (res.code !== 0) {
            return this.$message.error(res.message)
          }
          
          // 刷新列表
          this.getDishList()
          
          this.$message.success('删除菜品成功')
        } catch (error) {
          console.error(error)
          this.$message.error('删除菜品失败')
        }
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.dish-container {
  padding: 20px;
}

.search-row {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
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