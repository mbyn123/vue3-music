import { ref, watch, nextTick, computed } from 'vue'

export default function useFixed(props) {
  // 顶部标题高度
  const TITLE_HEIGHT = 30
  const groupRef = ref(null)
  // 存储节点高度
  const listHeights = ref([])
  // 滚动高度
  const scrollY = ref(0)
  // 当前滚动索引
  const currentIndex = ref(0)
  // 距离顶部距离
  const distance = ref(0)
  // 计算顶部标题偏移量
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })
  watch(() => props.data, async () => {
    // 在DOM更新后执行
    await nextTick()
    calculate()
  })
  // 获取当前滚动条在列表中位置
  watch(scrollY, (newVal) => {
    const listHeightVal = listHeights.value
    for (let i = 0; i < listHeightVal.length - 1; i++) {
      const topHeight = listHeightVal[i]
      const bottomHeight = listHeightVal[i + 1]
      if (newVal >= topHeight && newVal < bottomHeight) {
        currentIndex.value = i
        // 下一个节点的高度减去当前滚动条的位置
        distance.value = bottomHeight - newVal
        break
      }
    }
  })
  // 根据索引获取当前滚动位置对应的标题
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  // 获取列表的DOM
  function calculate() {
    // 获取子节点集合
    const list = groupRef.value.children
    const listHeightVal = listHeights.value
    // 初始化节点高度数组，第一个为0
    let height = 0
    listHeightVal.length = 0
    listHeightVal.push(height)
    // 获取每个子节点的高度，存储起来
    for (let i = 0; i < listHeightVal.length; i++) {
      if (list[i]) {
        height += list[i].clientHeight
        listHeights.value.push(height)
      }
    }
  }

  // 滚动组件回调
  function onScroll(option) {
    scrollY.value = -option.y
  }

  return {
    groupRef,
    currentIndex,
    fixedTitle,
    fixedStyle,
    onScroll
  }
}
