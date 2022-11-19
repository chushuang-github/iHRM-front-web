import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// 自定义组件
import Components from '@/components'
// 自定义指令
import * as directives from '@/directives'
// 过滤器
import * as filters from '@/filters'
// 混入
import checkPermissionMixin from '@/mixin/checkPermission'

// 多语言配置
import i18n from '@/lang'

import App from './App'
import store from './store'
import router from './router'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css
import '@/icons' // icon
import '@/permission' // permission control

// element-ui 英文
// Vue.use(ElementUI, { locale })

// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 配置 Element 语言转换关系，设置element为当前的语言 (多语言)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(Components)
Vue.config.productionTip = false

// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

// 注册自定义过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 混入
Vue.mixin(checkPermissionMixin)

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
