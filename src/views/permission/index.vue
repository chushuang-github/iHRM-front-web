<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, 0)">添加权限</el-button>
        </template>
      </page-tools>

      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" align="center" label="标识" />
        <el-table-column prop="description" align="center" label="描述" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <!-- 添加按钮只在访问权限的层级显示，当type为1的时候，才显示添加按钮 -->
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2, row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible="showDialog" :title="showTitle + '权限'" @close="btnCancel">
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px" v-loading="loading">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
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
  getPermissionList,
  delPermission,
  addPermission,
  updatePermission,
  getPermissionDetail
} from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'

export default {
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        enVisible: '0', // 开启
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '' // 因为做的是树 需要知道添加到哪个节点下了
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  mounted() {
    this.getPermissionList()
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑" : "新增"
    }
  },
  methods: {
    async getPermissionList() {
      let result = await getPermissionList()
      this.list = tranListToTreeData(result, '0')
    },
    // 取消
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        enVisible: '0', // 开启
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    // 确定
    btnOK() {
      this.$refs.perForm.validate(async (valid) => {
        if(valid) {
          if (this.formData.id) {
            await updatePermission(this.formData)
          } else {
            await addPermission(this.formData)
          }
          this.$message({
            type: 'success',
            message: `操作成功!`
          })
          this.getPermissionList()
          this.showDialog = false
        }
      })
    },
    // 删除操作
    delPermission(id) {
      this.$confirm('确定要删除该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delPermission(id)
      }).then(() => {
        this.getPermissionList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 添加
    addPermission(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    // 编辑数据回显
    async editPermission(id) {
      // 根据获取id获取详情
      this.showDialog = true
      this.loading = true
      this.formData = await getPermissionDetail(id)
      this.loading = false
    }
  }
}
</script>

<style>

</style>
