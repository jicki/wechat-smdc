<template>
  <div class="order-container">
    <el-card>
      <div slot="header">
        <span>订单管理</span>
      </div>
      <!-- 搜索区域 -->
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="订单编号">
          <el-input v-model="queryParams.orderNo" placeholder="请输入订单编号" clearable @clear="getOrderList"></el-input>
        </el-form-item>
        <el-form-item label="用户手机">
          <el-input v-model="queryParams.phone" placeholder="请输入用户手机号" clearable @clear="getOrderList"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="queryParams.status" placeholder="请选择订单状态" clearable @change="getOrderList">
            <el-option label="待支付" :value="0"></el-option>
            <el-option label="已完成" :value="1"></el-option>
            <el-option label="已取消" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="dateRangeChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getOrderList">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 订单列表 -->
      <el-table :data="orderList" border stripe v-loading="loading">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="orderNo" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="nickname" label="用户昵称" width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
        <el-table-column prop="totalAmount" label="订单金额" width="100">
          <template slot-scope="scope">
            ¥{{ scope.row.totalAmount | moneyFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="100">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === 1">已完成</el-tag>
            <el-tag type="info" v-else-if="scope.row.status === 0">待支付</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 2">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payMethod" label="支付方式" width="100">
          <template slot-scope="scope">
            {{ scope.row.payMethod | payMethodFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="tableNo" label="桌号" width="80"></el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button 
              type="primary" 
              icon="el-icon-view" 
              size="mini" 
              @click="showOrderDetail(scope.row)">
              详情
            </el-button>
            <el-button 
              type="success" 
              icon="el-icon-check" 
              size="mini" 
              @click="completeOrder(scope.row)"
              v-if="scope.row.status === 0">
              完成
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

    <!-- 订单详情对话框 -->
    <el-dialog title="订单详情" :visible.sync="detailDialogVisible" width="50%">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单编号">{{ orderDetail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="用户昵称">{{ orderDetail.nickname }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ orderDetail.phone }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ orderDetail.totalAmount | moneyFormat }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag type="success" v-if="orderDetail.status === 1">已完成</el-tag>
          <el-tag type="info" v-else-if="orderDetail.status === 0">待支付</el-tag>
          <el-tag type="danger" v-else-if="orderDetail.status === 2">已取消</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付方式">{{ orderDetail.payMethod | payMethodFormat }}</el-descriptions-item>
        <el-descriptions-item label="桌号">{{ orderDetail.tableNo }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ orderDetail.createTime | dateFormat }}</el-descriptions-item>
        <el-descriptions-item label="支付时间" v-if="orderDetail.payTime">{{ orderDetail.payTime | dateFormat }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ orderDetail.remark || '无' }}</el-descriptions-item>
      </el-descriptions>

      <el-table :data="orderDetail.orderDetails || []" border style="margin-top: 20px;">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="dishName" label="菜品名称" width="180"></el-table-column>
        <el-table-column prop="dishPrice" label="单价" width="100">
          <template slot-scope="scope">
            ¥{{ scope.row.dishPrice | moneyFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
        <el-table-column prop="amount" label="小计" width="100">
          <template slot-scope="scope">
            ¥{{ scope.row.amount | moneyFormat }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderPage, getOrderDetail, completeOrder } from '@/api/order'
import { formatDate, formatMoney, formatPayMethod } from '@/utils/format'

export default {
  name: 'Order',
  data() {
    return {
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        orderNo: '',
        status: '',
        phone: '',
        beginTime: '',
        endTime: ''
      },
      // 日期范围
      dateRange: [],
      // 订单列表
      orderList: [],
      // 总条数
      total: 0,
      // 加载状态
      loading: false,
      // 详情对话框可见性
      detailDialogVisible: false,
      // 订单详情
      orderDetail: {}
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
    },
    // 支付方式格式化
    payMethodFormat(val) {
      return formatPayMethod(val)
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      this.loading = true
      try {
        const { data: res } = await getOrderPage(this.queryParams)
        if (res.code !== 0) {
          return this.$message.error(res.message)
        }
        this.orderList = res.data.records
        this.total = res.data.total
      } catch (error) {
        console.error(error)
        this.$message.error('获取订单列表失败')
      } finally {
        this.loading = false
      }
    },
    // 每页条数改变
    handleSizeChange(newSize) {
      this.queryParams.size = newSize
      this.getOrderList()
    },
    // 当前页改变
    handleCurrentChange(newPage) {
      this.queryParams.page = newPage
      this.getOrderList()
    },
    // 日期范围改变
    dateRangeChange(val) {
      if (val) {
        this.queryParams.beginTime = val[0]
        this.queryParams.endTime = val[1]
      } else {
        this.queryParams.beginTime = ''
        this.queryParams.endTime = ''
      }
    },
    // 重置查询条件
    resetQuery() {
      this.dateRange = []
      this.queryParams = {
        page: 1,
        size: 10,
        orderNo: '',
        status: '',
        phone: '',
        beginTime: '',
        endTime: ''
      }
      this.getOrderList()
    },
    // 显示订单详情
    async showOrderDetail(row) {
      try {
        const { data: res } = await getOrderDetail(row.id)
        if (res.code !== 0) {
          return this.$message.error(res.message)
        }
        this.orderDetail = res.data
        this.detailDialogVisible = true
      } catch (error) {
        console.error(error)
        this.$message.error('获取订单详情失败')
      }
    },
    // 完成订单
    async completeOrder(row) {
      this.$confirm('确认将该订单标记为已完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const { data: res } = await completeOrder(row.id)
          if (res.code !== 0) {
            return this.$message.error(res.message)
          }
          
          // 刷新列表
          this.getOrderList()
          
          this.$message.success('订单已完成')
        } catch (error) {
          console.error(error)
          this.$message.error('操作失败')
        }
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.order-container {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
}
</style> 