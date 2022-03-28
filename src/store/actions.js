// 播放歌曲操作
import { PLAY_MODE } from '@/assets/js/constant'

export const selectPlay = ({ commit, state }, { list, index }) => {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setCurrentIndex', index)
}
