import { computed } from 'vue'
import { useStore } from 'vuex'
import { PLAY_MODE } from '@/assets/js/constant'

export default function useMode() {
  const { dispatch, state } = useStore()
  const playMode = computed(() => state.playMode)
  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    console.log(playModeVal, 'playModeVal')
    return playModeVal === PLAY_MODE.sequence ? 'icon-sequence' : playModeVal === PLAY_MODE.random ? 'icon-random' : 'icon-loop'
  })
  const changeMode = () => {
    // 切换播放模式 ，%3 确保只会在 0 1 2中切换
    const mode = (playMode.value + 1) % 3
    dispatch('changeMode', mode)
  }
  return {
    modeIcon,
    changeMode
  }
}
