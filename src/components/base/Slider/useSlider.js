import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { ref, onMounted, onUnmounted } from 'vue'

BScroll.use(Slide)

export default function useSlider(wrapperRef) {
  const slider = ref(null)
  const currentPageIndex = ref(0)

  onMounted(() => {
    // 注册轮播
    const sliderVal = slider.value = new BScroll(wrapperRef.value, {
      scrollX: true,
      scrollY: false,
      slide: true,
      momentum: false,
      bounce: false,
      probeType: 2,
      click: true
    })

    sliderVal.on('slideWillChange', (page) => {
      currentPageIndex.value = page.pageX
    })
  })

  // 卸载轮播实例
  onUnmounted(() => {
    slider.value.destroy()
  })

  // // keep-alive模式下会进入此生命周期
  // onActivated(() => {
  //   slider.value.enable()
  //   slider.value.refresh()
  // })
  //
  // // keep-alive模式下会进入此生命周期
  // onDeactivated(() => {
  //   slider.value.disable()
  // })

  return {
    slider,
    currentPageIndex
  }
}
