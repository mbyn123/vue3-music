<template>
  <div class='progress-bar' @click='clickBar'>
    <div class='bar-inner'>
      <div class='progress' ref='progress' :style='progressStyle'/>
      <div class='progress-btn-wrapper' :style='progressBtnStyle' @touchstart.prevent='onTouchStart'
           @touchmove.prevent='onTouchMove' @touchend.prevent='onTouchEnd'>
        <div class='progress-btn'/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  emits: ['changeTouchMove', 'changeTouchEnd'],
  data() {
    return {
      offset: 0
    }
  },
  created() {
    // 创建变量保存触摸相关的数据,避免在data中创建数据变化后重复渲染
    this.touch = {}
  },
  watch: {
    progress(newValue) {
      this.setProgress(newValue)
    }
  },
  computed: {
    progressStyle() {
      return `width:${this.offset}px`
    },
    progressBtnStyle() {
      return `transform:translate3d(${this.offset}px,0,0)`
    }
  },
  methods: {
    // 获取进度条的宽度
    getBarWidth() {
      const progressBtnWidth = 16
      return this.$el.clientWidth - progressBtnWidth
    },
    // 设置进度条偏移量
    setProgress(newProgress) {
      // 进度条的偏移量 = 进度条的宽度 * 当前进度条的位置
      this.offset = this.getBarWidth() * newProgress
    },
    // 触摸开始
    onTouchStart(e) {
      // 存储 触摸的起始位置
      this.touch.x1 = e.touches[0].pageX
      // 存储 进度条已播放的距离
      this.touch.beginWidth = this.$refs.progress.clientWidth
    },
    // 触摸中
    onTouchMove(e) {
      // 手指移动的距离 = 触摸的起始位置 - 当前触摸的位置
      const delta = e.touches[0].pageX - this.touch.x1
      // 进度条的宽度 = 手指移动的距离 + 进度条已播放的距离
      const tempWidth = delta + this.touch.beginWidth
      // 当前进度条的位置 =  进度条的宽度 / 进度条的宽度
      const progress = Math.min(1, Math.max(tempWidth / this.getBarWidth(), 0))
      // 进度条的偏移量 = 进度条的宽度 * 当前进度条的位置
      this.offset = this.getBarWidth() * progress
      this.$emit('changeTouchMove', progress)
    },
    // 触摸停止
    onTouchEnd() {
      // 进度条的最终位置 = 进度条当前已播放的距离 / 进度条的宽度
      const progress = this.$refs.progress.clientWidth / this.getBarWidth()
      this.$emit('changeTouchEnd', progress)
    },
    // 点击进度条
    clickBar(e) {
      // 获取进度条的左边距
      const left = this.$el.getBoundingClientRect().left
      // 进度条的位置 = 当前点击的位置 - 左边距
      const offsetWidth = e.pageX - left
      // 进度条的偏移量 = 进度条的位置 / 进度条的宽度
      const progress = offsetWidth / this.getBarWidth()
      this.$emit('changeTouchEnd', progress)
    }
  }
}
</script>

<style lang='scss' scoped>
.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
