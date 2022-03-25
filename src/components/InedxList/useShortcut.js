import { computed } from 'vue'

const useShortcut = (props) => {
  const shortcutList = computed(() => {
    return props.data.map(item => item.title)
  })
  return {
    shortcutList
  }
}

export default useShortcut
