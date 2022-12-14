// 社保
import Layout from '@/layout'

// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
export default {
  path: '/social', // 路径
  component: Layout, // 组件
  name: 'social_securitys', // 给路由规则加一个name，我们会在后面做权限的时候使用
  // 配置二级路的路由表
  children: [{
    path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
    component: () => import('@/views/social'),
    name: 'social_securitys',
    // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息，meta属性的里面的属性可以随意定义
    // 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
    meta: {
      title: '社保',
      icon: 'table'
    }
  }]
}
