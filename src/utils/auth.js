import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const timeKey = 'hrsaas-timestamp-key'

// token操作的方法
// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}
// 设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 移除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 存取时间戳的方法 (实现登录多长时间之后，自动退出登录)
// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
// 设置时间戳
export function setTimeStamp() {
  Cookies.set(timeKey, Date.now())
}
