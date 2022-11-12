<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="handleAdd"
              >新增角色</el-button>
            </el-row>

            <!-- 表格 -->
            <el-table border :data="list">
              <el-table-column type="index" label="序号" align="center" width="70" />
              <el-table-column prop="name" label="角色名称" align="center" width="240" />
              <el-table-column prop="description" label="描述" align="center" />
              <el-table-column label="操作" align="center">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="handlePermission(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="handleEdit(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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
          </el-tab-pane>

          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 30px">
              <el-form-item label="公司名称">
                <el-input disabled style="width: 400px" v-model="formData.name" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input disabled style="width: 400px" v-model="formData.companyAddress" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input disabled style="width: 400px" v-model="formData.companyPhone" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input disabled style="width: 400px" v-model="formData.mailbox" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" :rows="3" disabled style="width: 400px" v-model="formData.remarks" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="cancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button size="small" type="primary" @click="ok">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 权限弹窗 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnCancel" width="540px">
      <el-tree
        v-loading="loading"
        node-key="id"
        ref="permTree"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :data="permData"
        :props="defaultProps"
        :default-checked-keys="selectCheck"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  updateRole,
  getRoleDetail,
  addRole,
  assignPerm
} from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      formData: {},
      showDialog: false,
      showPermDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      loading: false,
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      defaultProps: {
        label: 'name'
      },
      roleId: null // 用来记录分配角色的id
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      let { rows, total } = await getRoleList(this.page)
      this.list = rows
      this.page.total = total
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 分页
    handlePagination(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    // 删除
    async handleDelete(row) {
      this.$confirm('您确定要删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteRole(row.id)
      }).then(() => {
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除角色成功!'
        })
      }).catch(() => {})
    },
    async handleEdit(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    async handleAdd() {
      this.showDialog = true
    },
    // 编辑弹窗
    cancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    ok() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          if (this.roleForm.id) {
            await updateRole(this.roleForm)
          } else {
            await addRole(this.roleForm)
          }
          this.getRoleList()
          this.cancel()
          this.$message.success('操作成功')
        }
      })
    },
    // 权限弹窗
    btnCancel() {
      this.permData = []
      this.roleId = null
      this.showPermDialog = false
    },
    async btnOK() {
      let params = {
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId
      }
      await assignPerm(params)
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    async handlePermission(id) {
      this.showPermDialog = true
      this.roleId = id
      this.loading = true
      // 获取所有权限
      let result = await getPermissionList()
      this.permData = tranListToTreeData(result, '0')
      // 获取已有的权限
      const { permIds } = await getRoleDetail(id) // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
