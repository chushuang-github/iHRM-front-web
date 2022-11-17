<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- 放置一个svg的图标 -->
    <svg-icon
      icon-class="fullscreen"
      style="color:#fff; width: 20px; height: 20px"
      @click="changeScreen"
    />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  methods: {
    changeScreen() {
      // esc退出全屏
      if (!ScreenFull.isEnabled) {
        // 如果不可用  就提示 并且返回
        return this.$message.warning('当前全局组件不可用')
      }
      // document.documentElement.requestFullscreen()
      // document.exitFullscreen 退出
      ScreenFull.toggle() // 执行全屏 展开 关闭
    }
  }
}
</script>
