import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'

// 检测token是否超时 (token前端主动介入处理)
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
const TimeOut = 3600 // 定义超时时间 (单位：秒)
function isCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    // 只有在有token的情况下 才有必要去检查时间戳是否超时
    if (isCheckTimeOut()) {
      // 如果它为true表示 token 过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.replace(`/login?redirect=${encodeURIComponent(router.currentRoute.fullPath)}`)
      return Promise.reject(new Error('token超时了'))
    }
    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  // token失效的被动处理
  // error 信息 里面 response的对象 (接口里面code值为10002表示token失效了)
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logout') // 登出action 删除token (权限控制存在，必须先删token，在进行路由跳转)
    router.replace(`/login?redirect=${encodeURIComponent(router.currentRoute.fullPath)}`)
    Message.error('登录超时')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

export default service
