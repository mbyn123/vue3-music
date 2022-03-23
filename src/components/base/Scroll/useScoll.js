import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { ref, onMounted, onUnmounted } from 'vue'

BScroll.use(ObserveDOM)

export default function useScoll(wrapperRef, options) {
  const scoll = ref(null)
  onMounted(() => {
    scoll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
  })
  onUnmounted(() => {
    scroll.value.destroy()
  })
}
