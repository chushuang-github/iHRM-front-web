<template>
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'

export default {
  name: 'Excel',
  methods: {
    async success({ header, results }) {
      // excel解析的表头，对应接口里面的字段映射关系
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          // key是当前的中文名 找到对应的英文名
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // 表格的天数->转成日期对象
            userInfo[userRelations[key]] = new Date(this.formatExcelDate(item[key]))
            return
          }
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })
      await importEmployee(arr)  // 调用批量导入接口
      this.$message.success('导入excel成功')
      this.$router.back()
    },

    // 把excel文件中的日期格式的内容转回成标准时间
    // 1). xlsx包, 读取表格里日期的时候, 会按照1900年01月01日进行天数的计算, 返回天数数字
    // 43534天, 是1900年(当时的UTC时间算)->到2019年过的天数
    // 注意1: 在1900年的时候, 时间是UTC+8:5:43 (43534天里, 照0时0分0秒, 多了5分43秒)
    // 可以查询每个年份, 时区: https://www.timeanddate.com/time/zone/china/shanghai
    // 注意2: 获取表格的天数, 1月0日也算了一天(43534天里, 多了1天)

    // 2). js中, new Date是从1970年开始计算日期对象
    // 所以你传入给new Date的表格时间, 要把1970年之前的天数减掉, 就是上面说的1900-1970天数和多出来的5分43秒
    // 把excel文件中的日期格式的内容转回成标准时间
    formatExcelDate(numb, format = '/') {
      const time = new Date((numb - 25568) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000)
      time.setYear(time.getFullYear())
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

