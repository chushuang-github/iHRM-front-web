// 该文件负责所有的公共的组件的全局注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ScreenFull from './ScreenFull'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import vueToPdf from 'vue-to-pdf'

export default {
  install(Vue) {
    // 注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ImageUpload', ImageUpload)
    // 注册好打印插件，会有一个 v-print 指令的方式进行打印
    Vue.use(Print)
    // dom结构生成pdf的插件
    Vue.use(vueToPdf)
  }
}
