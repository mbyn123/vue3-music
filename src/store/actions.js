// 播放歌曲操作
import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/utils'

// 顺序播放
export const selectPlay = ({ commit }, { list, index }) => {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setCurrentIndex', index)
}

// 随机播放
export const randomPlay = ({ commit }, list) => {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayList', shuffle(list))
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setCurrentIndex', 0)
}
