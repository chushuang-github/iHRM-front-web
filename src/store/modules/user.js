import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: {}
}

const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 删除缓存
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
    state.userInfo = { ...userInfo }
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  // 登录action
  async login(context, data) {
    const result = await login(data)
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    context.commit('setToken', result)
    // 到这一步，表示登录成功了，设置当前的时间戳
    setTimeStamp()
  },
  // 获取用户资料action
  async getUserInfo(context) {
    const result = await getUserInfo() // result就是用户的基本资料
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    // 此时已经获取到了用户的基本资料 迫不得已 为了头像再次调用一个接口
    context.commit('setUserInfo', baseResult) // 提交mutations
    // 加一个点睛之笔  这里这一步，暂时用不到，但是请注意，这给我们后边会留下伏笔
    return baseResult
  },
  // 退出登录的action
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息
    // 重置路由
    resetRouter()
    // 还有一步，vuex中的数据是不是还在，要清空permission模块下的state数据
    // vuex中 user子模块 调用 permission子模块里面的muatations
    // 默认情况下，子模块的context是子模块的
    // 子模块 调用 子模块的actions或者mutations，可以将dispatch 或者 commit的第三个参数 设置成{ root: true }
    // root设置为ture，表示当前的context为根模块的context
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
