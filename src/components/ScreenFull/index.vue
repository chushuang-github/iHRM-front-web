<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- 放置一个svg的图标 -->
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      style="color:#fff; width: 20px; height: 20px"
      @click="changeScreen"
    />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  data() {
    return {
      isFullscreen: false // 全屏
    }
  },
  mounted() {
    // 如果当前是全屏状态，按下ESC会恢复到普通状态，解决按下ESC键退出全屏图标的切换
    // 监听全屏的状态是否切换
    ScreenFull.on('change', () => {
      this.isFullscreen = ScreenFull.isFullscreen
    })
  },
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
      // 切换全屏与否状态
      this.isFullscreen = !this.isFullscreen
    }
  }
}
</script>
