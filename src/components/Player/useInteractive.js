import { ref } from 'vue'

export default function useInteractive() {
  const currentShow = ref('cd')
  const middleLeftStyle = ref(null)
  const middleRightStyle = ref(null)
  const touch = {}
  // let currentView = 'cd'

  const onTouchStart = (e) => {
    touch.startX = e.touches[0].pageX
  }
  const onTouchMove = (e) => {
    const delta = e.touches[0].pageX - touch.startX
    console.log(delta / -window.innerWidth)
  }
  const onTouchEnd = () => {
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
