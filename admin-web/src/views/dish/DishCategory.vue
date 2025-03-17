<template>
  <div class="category-container">
    <el-card>
      <div slot="header">
        <span>菜品分类管理</span>
      </div>
      <!-- 搜索和添加区域 -->
      <el-row :gutter="20" class="search-row">
        <el-col :span="7">
          <el-input placeholder="请输入分类名称" v-model="queryParams.name" clearable @clear="getCategoryList">
            <el-button slot="append" icon="el-icon-search" @click="getCategoryList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 分类列表 -->
      <el-table :data="categoryList" border stripe v-loading="loading">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="name" label="分类名称" width="180"></el-table-column>
        <el-table-column prop="sort" label="排序" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
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
              @click="removeCategory(scope.row)">
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

    <!-- 添加分类对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" @close="dialogClosed">
      <el-form :model="categoryForm" :rules="categoryRules" ref="categoryFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="categoryForm.sort" :min="0" :max="99"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="categoryForm.status"
            :active-value="0"
            :inactive-value="1"
            active-text="启用"
            inactive-text="禁用"
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
import { getCategoryPage, addCategory, updateCategory, deleteCategory, updateCategoryStatus } from '@/api/dishCategory'
import { formatDate } from '@/utils/format'

export default {
  name: 'DishCategory',
  data() {
    return {
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        name: ''
      },
      // 分类列表
      categoryList: [],
      // 总条数
      total: 0,
      // 加载状态
      loading: false,
      // 对话框标题
      dialogTitle: '添加分类',
      // 对话框可见性
      dialogVisible: false,
      // 分类表单
      categoryForm: {
        id: '',
        name: '',
        sort: 0,
        status: 0
      },
      // 表单验证规则
      categoryRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
    // 日期格式化
    dateFormat(val) {
      return formatDate(val)
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 获取分类列表
    async getCategoryList() {
      this.loading = true
      try {
        const { data: res } = await getCategoryPage(this.queryParams)
        if (res.code !== 0) {
          return this.$message.error(res.message)
        }
        this.categoryList = res.data.records
        this.total = res.data.total
      } catch (error) {
        console.error(error)
        this.$message.error('获取分类列表失败')
      } finally {
        this.loading = false
      }
    },
    // 每页条数改变
    handleSizeChange(newSize) {
      this.queryParams.size = newSize
      this.getCategoryList()
    },
    // 当前页改变
    handleCurrentChange(newPage) {
      this.queryParams.page = newPage
      this.getCategoryList()
    },
    // 状态改变
    async statusChange(row) {
      try {
        const { data: res } = await updateCategoryStatus(row.id, row.status)
        if (res.code !== 0) {
          row.status = row.status === 0 ? 1 : 0
          return this.$message.error(res.message)
        }
        this.$message.success('更新分类状态成功')
      } catch (error) {
        row.status = row.status === 0 ? 1 : 0
        console.error(error)
        this.$message.error('更新分类状态失败')
      }
    },
    // 显示添加对话框
    showAddDialog() {
      this.dialogTitle = '添加分类'
      this.categoryForm = {
        id: '',
        name: '',
        sort: 0,
        status: 0
      }
      this.dialogVisible = true
    },
    // 显示编辑对话框
    showEditDialog(row) {
      this.dialogTitle = '编辑分类'
      this.categoryForm = { ...row }
      this.dialogVisible = true
    },
    // 对话框关闭
    dialogClosed() {
      this.$refs.categoryFormRef.resetFields()
    },
    // 提交表单
    submitForm() {
      this.$refs.categoryFormRef.validate(async valid => {
        if (!valid) return
        
        this.loading = true
        try {
          let res
          if (this.categoryForm.id) {
            // 编辑
            res = await updateCategory(this.categoryForm)
          } else {
            // 添加
            res = await addCategory(this.categoryForm)
          }
          
          if (res.data.code !== 0) {
            return this.$message.error(res.data.message)
          }
          
          // 关闭对话框
          this.dialogVisible = false
          // 刷新列表
          this.getCategoryList()
          
          this.$message.success(this.categoryForm.id ? '更新分类成功' : '添加分类成功')
        } catch (error) {
          console.error(error)
          this.$message.error(this.categoryForm.id ? '更新分类失败' : '添加分类失败')
        } finally {
          this.loading = false
        }
      })
    },
    // 删除分类
    removeCategory(row) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const { data: res } = await deleteCategory(row.id)
          if (res.code !== 0) {
            return this.$message.error(res.message)
          }
          
          // 刷新列表
          this.getCategoryList()
          
          this.$message.success('删除分类成功')
        } catch (error) {
          console.error(error)
          this.$message.error('删除分类失败')
        }
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.category-container {
  padding: 20px;
}

.search-row {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
}
</style> 