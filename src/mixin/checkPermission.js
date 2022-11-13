// 采用一个新的技术 mixin(混入)，来让所有的组件可以拥有一个公共的方法
// 判断页面是否有某个按钮的权限
import store from '@/store'

export default {
  methods: {
    checkPermission(key) {
      const { userInfo } = store.state.user
      if (userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
