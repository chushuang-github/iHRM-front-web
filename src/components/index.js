// 该文件负责所有的公共的组件的全局注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'

export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
  }
}
