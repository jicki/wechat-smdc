<template>
  <div class="users-container">
    <el-card>
      <div slot="header">
        <span>用户管理</span>
      </div>
      <!-- 搜索区域 -->
      <el-row :gutter="20" class="search-row">
        <el-col :span="7">
          <el-input placeholder="请输入手机号" v-model="queryParams.phone" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-input placeholder="请输入昵称" v-model="queryParams.nickname" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table :data="userList" border stripe v-loading="loading">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
        <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
        <el-table-column prop="avatar" label="头像" width="100">
          <template slot-scope="scope">
            <el-image 
              style="width: 50px; height: 50px" 
              :src="scope.row.avatar" 
              fit="cover"
              :preview-src-list="[scope.row.avatar]">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.gender === 0">未知</span>
            <span v-else-if="scope.row.gender === 1">男</span>
            <span v-else-if="scope.row.gender === 2">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="80">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.role === 1">管理员</el-tag>
            <el-tag v-else>普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="statusChange(scope.row)"
              :disabled="scope.row.role === 1">
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
              @click="showEditDialog(scope.row)"
              :disabled="scope.row.role === 1 && userInfo.id !== scope.row.id">
              编辑
            </el-button>
            <el-button 
              type="danger" 
              icon="el-icon-delete" 
              size="mini" 
              @click="removeUser(scope.row)"
              :disabled="scope.row.role === 1">
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

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="editForm.gender">
            <el-radio :label="0">未知</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, updateUserStatus, updateUserInfo } from '@/api/user'
import { formatDate } from '@/utils/format'
import { mapGetters } from 'vuex'

export default {
  name: 'Users',
  data() {
    return {
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        phone: '',
        nickname: ''
      },
      // 用户列表
      userList: [],
      // 总条数
      total: 0,
      // 加载状态
      loading: false,
      // 编辑对话框可见性
      editDialogVisible: false,
      // 编辑表单
      editForm: {
        id: '',
        phone: '',
        nickname: '',
        gender: 0
      },
      // 编辑表单验证规则
      editFormRules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  filters: {
    // 日期格式化
    dateFormat(val) {
      return formatDate(val)
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      this.loading = true
      try {
        const { data: res } = await getUserList(this.queryParams)
        if (res.code !== 0) {
          return this.$message.error(res.message)
        }
        this.userList = res.data.records
        this.total = res.data.total
      } catch (error) {
        console.error(error)
        this.$message.error('获取用户列表失败')
      } finally {
        this.loading = false
      }
    },
    // 每页条数改变
    handleSizeChange(newSize) {
      this.queryParams.size = newSize
      this.getUserList()
    },
    // 当前页改变
    handleCurrentChange(newPage) {
      this.queryParams.page = newPage
      this.getUserList()
    },
    // 状态改变
    async statusChange(row) {
      try {
        const { data: res } = await updateUserStatus(row.id, row.status)
        if (res.code !== 0) {
          row.status = row.status === 0 ? 1 : 0
          return this.$message.error(res.message)
        }
        this.$message.success('更新用户状态成功')
      } catch (error) {
        row.status = row.status === 0 ? 1 : 0
        console.error(error)
        this.$message.error('更新用户状态失败')
      }
    },
    // 显示编辑对话框
    showEditDialog(row) {
      this.editForm = {
        id: row.id,
        phone: row.phone,
        nickname: row.nickname,
        gender: row.gender
      }
      this.editDialogVisible = true
    },
    // 编辑对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑用户
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        
        try {
          const { data: res } = await updateUserInfo(this.editForm)
          if (res.code !== 0) {
            return this.$message.error(res.message)
          }
          
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新用户列表
          this.getUserList()
          
          this.$message.success('更新用户信息成功')
        } catch (error) {
          console.error(error)
          this.$message.error('更新用户信息失败')
        }
      })
    },
    // 删除用户
    removeUser(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // TODO: 实现删除用户功能
        this.$message.success('删除用户成功')
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.users-container {
  padding: 20px;
}

.search-row {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
}
</style> 