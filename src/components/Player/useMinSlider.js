import { computed, nextTick, onActivated, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMinSlider() {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)
  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playList = computed(() => store.state.playList)
  const currentIndex = computed(() => store.state.currentIndex)
  // 判断当前迷你播放器存在且播放列表有数据
  const sliderShow = computed(() => !fullScreen.value && !!playList.value)

  onMounted(() => {
    let sliderVal
    watch(sliderShow, async (newValue) => {
      if (!newValue) {
        return
      }
      // 在组件DOM更新后获取到sliderWrapperRef Dom节点
      await nextTick()
      // 组件不存在时
      if (!sliderVal) {
        // 注册slide组件
        sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
          click: true,
          scrollX: true,
          scrollY: false,
          momentum: false,
          bounce: false,
          probeType: 2,
          slide: {
            autoplay: false,
            loop: true
          }
        })
        // 改变当前播放歌曲
        sliderVal.on('slidePageChanged', ({ pageX }) => {
          store.commit('setCurrentIndex', pageX)
        })
      } else {
        // 存在时就刷新组件
        sliderVal.refresh()
      }
      sliderVal.goToPage(currentIndex.value, 0, 0)
    })
    // 根据播放的歌曲索引滚动到指定位置
    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })
    watch(playList, async () => {
      if (sliderVal && sliderShow.value && playList.value.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })
  // 页面卸载时同时卸载slider组件
  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  // keep-alive模式下会进入此生命周期
  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })

  // keep-alive模式下会进入此生命周期
  onDeactivated(() => {
    slider.value.disable()
  })

  return {
    slider,
    sliderWrapperRef
  }
}
