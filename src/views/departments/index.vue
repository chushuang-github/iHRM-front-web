<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <TreeTools
          :tree-node="company"
          :isRoot="true"
          @add="handleAdd"
        />

        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <TreeTools
            slot-scope="{ data }"
            :treeNode="data"
            @delete="getDepartmentsList"
            @add="handleAdd"
            @edit="handleEdit"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 新增弹出框 -->
    <AddDept
      ref="addDept"
      :showDialog.sync="showDialog"
      :treeNode="node"
      @addDepts="getDepartmentsList"
    />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name'
      },
      showDialog: false,
      node: null, // 当前操作的节点
      loading: false // 用来控制进度弹层的显示和隐藏
    };
  },
  mounted() {
    this.getDepartmentsList()
  },
  methods: {
    // 获取列表
    async getDepartmentsList() {
      this.loading = true
      const res = await getDepartments()
      this.company = {
        name: res.companyName,
        manager: '负责人',
        id: ""
      }
      this.departs = tranListToTreeData(res.depts)
      this.loading = false
    },
    // 新增
    handleAdd(treeNode) {
      this.showDialog = true
      this.node = treeNode
    },
    // 编辑
    handleEdit(treeNode) {
      this.showDialog = true
      this.node = treeNode
      // 直接调用子组件中的方法 传入一个id
      this.$refs.addDept.getDepartDetail(treeNode.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size:14px;
}
</style>
