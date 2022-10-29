<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :showBefore="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template v-slot:after>
          <el-button size="small" type="warning" @click="uploadExcelBtnFn">导入excel</el-button>
          <el-button size="small" type="danger" @click="downloadExcel">普通excel导出</el-button>
          <el-button size="small" type="info" @click="exportMutiData">复杂表头excel导出</el-button>
          <el-button icon="plus" type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list" v-loading="loading">
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column prop="mobile" label="手机号" sortable="" />
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
            sortable=""
            :formatter="formatEmployment"
          />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column label="入职时间" sortable="">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <el-pagination
            :page-size="page.pagesize"
            :current-page="page.page"
            :total="page.total"
            layout="prev,pager,next"
            @current-change="handlePagination"
          />
        </el-row>
      </el-card>
    </div>

    <!-- 弹层 -->
    <add-employee :showDialog.sync="showDialog" />
  </div>
</template>

<script>
import AddEmployee from './components/add-employee'
import { getEmployeeList, delEmployee } from '@/api/employees'
import { formatDate } from '@/filters'
import EmployeeEnum from '@/api/constant/employees'

export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      loading: false,
      showDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      let { rows, total } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    handlePagination(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化table列数据
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id == cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除
    async handleDelete(row) {
      this.$confirm('您确定要删除该员工吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delEmployee(row.id)
      }).then(() => {
        this.getEmployeeList()
        this.$message({
          type: 'success',
          message: '删除员工成功!'
        })
      }).catch(() => {})
    },
    // 导入excel按钮
    uploadExcelBtnFn() {
      this.$router.push('/excel')
    },
    // 格式化json数据
    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          // key是中文 headers[key]是英文 // item是 英文 {username: '张三', mobile: 123}
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 如果是日期的话 就需要格式化日期
            let time = item[headers[key]]
            if(!time) return time
            return formatDate(time)
          } else if (headers[key] === 'formOfEmployment') {
            // 要把聘用形式转化成文本
            const obj = EmployeeEnum.hireType.find(o => o.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    // 普通excel导出
    downloadExcel() {
      import('@/vendor/Export2Excel').then(async (excel) => {
        // 定义对应关系 - 把英文的key转化成中文的key所对应的值
        const headers = {
          '姓名': 'username',
          '手机': 'mobile',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // data格式二维数组：[[姓名, 手机, 入职日期, 聘用形式, 转正日期, 工号, 部门], [], [], ...]
        const data = this.formatJson(headers, rows) // 转化数据表结构
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: 'ihrm人力资源用户表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 复杂表头excel导出
    exportMutiData() {
      import('@/vendor/Export2Excel').then(async (excel) => {
        // 定义对应关系 - 把英文的key转化成中文的key所对应的值
        const headers = {
          '姓名': 'username',
          '手机': 'mobile',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // data格式二维数组：[[姓名, 手机, 入职日期, 聘用形式, 转正日期, 工号, 部门], [], [], ...]
        const data = this.formatJson(headers, rows) // 转化数据表结构
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: 'ihrm人力资源用户表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          // mutiHeader中表头的长度必须和header的表头长度是对应的 否则报错
          // 复杂表头的导出 数组中的一个数组 就是一行表头
          multiHeader: [['姓名', '主要信息', '', '', '', '', '部门']],
          // 合并列  不用区分顺序 只写合并的单元格的顺序号
          merges: ['A1:A2', 'B1:F1', 'G1:G2']
        })
      })
    },
  }
}
</script>

<style>

</style>
