import { computed, ref } from 'vue'

const useShortcut = (props, groupRef) => {
  // 锚点高度
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)
  const shortcutList = computed(() => {
    return props.data.map(item => item.title)
  })
  // 记录手指滚动的位置
  const touch = {}

  // 手指点击滚动到指定位置
  const onShortcutTouchStart = (e) => {
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    // 存储起始位置
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }
  // 手指触摸到指定位置
  const onShortcutTouchMove = (e) => {
    touch.y2 = e.touches[0].pageY
    // 计算当前锚点滑动了几个位置
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    // 用起始位置加上滑动的位置等于最终停止的位置索引
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }

  const scrollTo = (index) => {
    if (isNaN(index)) {
      return
    }
    // 限制索引只能在有效范围内
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    // 获取指定位置的DOM
    const targetElement = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    // 滚动到指定位置
    scroll.scrollToElement(targetElement, 0)
  }
  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}

export default useShortcut
