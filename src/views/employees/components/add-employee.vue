<template>
  <el-dialog title="新增员工" top="8vh" width="42%" :visible="showDialog" @close="cancel">
    <!-- 表单 -->
    <el-form ref="addEmployeeRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:85%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:85%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:85%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:85%" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:85%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          @focus="getDepartments"
          readonly
          style="width:85%"
          placeholder="请选择部门"
        />
        <!-- 树形组件 -->
        <el-tree
          v-loading="loading"
          :data="treeData"
          v-if="showTree"
          default-expand-all
          :props="defaultProps"
          @node-click="handleNodeClick"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:85%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button type="primary" size="small" @click="handleOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils/index'
import EmployeeEnum from '@/api/constant/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        username: '',
        mobile: '',
        timeOfEntry: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'}
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'change' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        correctionTime: [
          { required: true, message: '请选择转正时间', trigger: 'blur' }
        ]
      },
      treeData: [],
      showTree: false,
      loading: false,
      defaultProps: {
        label: 'name'
      },
      options: EmployeeEnum.hireType
    }
  },
  methods: {
    cancel() {
      this.formData = {
        username: '',
        mobile: '',
        timeOfEntry: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        correctionTime: ''
      }
      this.showTree = false
      this.$refs.addEmployeeRef.resetFields()
      this.$emit('update:showDialog', false)
    },
    async getDepartments() {
      this.loading = true
      let { depts } = await getDepartments()
      this.showTree = true
      this.loading = false
      this.treeData = tranListToTreeData(depts)
    },
    // 树形组件节点被点击事件
    handleNodeClick({ name }) {
      this.formData.departmentName = name
      this.showTree = false
    },
    async handleOk() {
      try {
        await this.$refs.addEmployeeRef.validate()
        await addEmployee(this.formData)
        this.$parent.getEmployeeList()
        this.$message({
          type: 'success',
          message: '新增员工成功!'
        })
        this.$emit('update:showDialog', false)
      } catch(error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  height: 64vh;
  padding-bottom: 0px;
  overflow-y: scroll;
}
</style>

