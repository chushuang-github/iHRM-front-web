<template>
  <div>
    <!-- 年和月 -->
    <el-row type="flex" justify="end">
      <el-select
        size="small"
        style="width: 120px"
        placeholder="请选择年"
        v-model="currentYear"
        @change="dataChange"
      >
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item">{{ item }}年</el-option>
      </el-select>
      <el-select
        size="small"
        style="width: 120px; margin-left: 10px"
        placeholder="请选择月"
        v-model="currentMonth"
        @change="dataChange"
      >
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{ item }}月</el-option>
      </el-select>
    </el-row>
    <!-- 日历组件 -->
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{ date, data }">
        <div class="date-content">
          <span>{{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'WorkCalendar',
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null, // 当前日期
      yearList: [] // 遍历年的数组
    }
  },
  mounted() {
    this.currentYear = this.startDate.getFullYear()
    this.currentMonth = this.startDate.getMonth() + 1
    this.yearList = Array.from(Array(11), (v, i) => i + this.currentYear - 5)
    this.dataChange()
  },
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  methods: {
    // 年和月发生变化
    dataChange() {
      let currentDay = new Date().getDate()
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth - 1}-${currentDay}`)
    },
    // 是否是休息日
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-calendar-day {
  height:  auto;
 }
::v-deep .el-calendar-table__row td,
::v-deep .el-calendar-table tr td:first-child,
::v-deep .el-calendar-table__row td.prev{
  border:none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
::v-deep .el-calendar-table td.is-selected .text{
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
::v-deep .el-calendar__header {
  display: none
}
</style>
