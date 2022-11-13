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
        const { roles } = await store.dispatch('user/getUserInfo')
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // addRoutes  必须 用 next(地址) 不能用next()
        // 添加动态路由到路由表，进行铺路
        // 动态路由是异步添加的，所以需要将404放在动态路由后面，添加完动态路由之后，找不到对应路由就跳转到404页面
        router.addRoutes([
          ...routes,
          { path: '*', redirect: '/404', hidden: true }
        ])
        // 执行完addRoutes添加路由之后，不要使用next()跳转，请使用next(to.path)跳转
        // 因为添加路由是异步的，所以要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
        next(to.path)
      } else {
        next()
      }
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
