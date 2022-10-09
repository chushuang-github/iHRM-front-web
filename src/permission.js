// 权限拦截
import router from '@/router'
import store from '@/store'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// NProgress Configuration
NProgress.configure({ showSpinner: false })

// 白名单，不需要受权限控制的页面
const whiteList = ['/login', '/404']

// 前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // 判断是否有token
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      // 获取用户信息 (有token，并且不是跳转到login页面，才获取)
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  // 手动关闭一次进度条，为了解决手动切换地址时，进度条不关闭的问题
  NProgress.done()
})

// 后置守卫
router.afterEach(() => {
  NProgress.done()
})
