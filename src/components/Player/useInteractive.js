import { ref } from 'vue'

export default function useInteractive() {
  const currentShow = ref('cd')
  const middleLeftStyle = ref(null)
  const middleRightStyle = ref(null)
  const touch = {}
  let currentView = 'cd'

  const onTouchStart = (e) => {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }
  const onTouchMove = (e) => {
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY
    if (!touch.directionLocked) {
      touch.directionLocked = Math.abs(deltaX) >= Math.abs(deltaY) ? 'h' : 'v'
    }
    if (touch.directionLocked === 'v') {
      return
    }
    const left = currentView === 'cd' ? 0 : -window.innerWidth
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    touch.percent = Math.abs(offsetWidth / window.innerWidth)
    if (currentView === 'cd') {
      currentShow.value = touch.percent > 0.2 ? 'lyric' : 'cd'
    } else {
      currentShow.value = touch.percent < 0.8 ? 'cd' : 'lyric'
    }
    middleLeftStyle.value = {
      opacity: 1 - touch.percent
    }
    middleRightStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`
    }
  }

  const onTouchEnd = () => {
    let offsetWidth
    let opacity
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }
    const duration = 300
    middleLeftStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRightStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLeftStyle,
    middleRightStyle,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}
