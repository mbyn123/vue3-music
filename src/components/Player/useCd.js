import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  const store = useStore()
  const cdRef = ref(null)
  const cdImageRef = ref(null)

  const playing = computed(() => store.state.playing)
  const cdClass = computed(() => playing.value ? 'playing' : '')

  watch(playing, (newValue) => {
    // 歌曲暂停时
    if (!newValue) {
      synchronize(cdRef.value, cdImageRef.value)
    }
  })

  // 同步样式
  const synchronize = (wrapper, inner) => {
    // 获取图片的旋转样式
    const innerTransform = getComputedStyle(inner).transform
    // 获取图片外层的旋转样式
    const wrapperTransform = getComputedStyle(wrapper).transform
    // 同步图片与外层旋转样式
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    cdClass,
    cdRef,
    cdImageRef
  }
}
