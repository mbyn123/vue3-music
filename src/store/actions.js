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

// 切换播放模式
export const changeMode = ({ commit, state, getters }, mode) => {
  const currentId = getters.currentSong.id
  // 如果是随机播放模式
  if (mode === PLAY_MODE.random) {
    // 就将默认歌曲列表顺序打乱
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    commit('setPlayList', state.sequenceList)
  }
  // 获取当前正在播放歌曲的索引下标
  const index = state.playList.findIndex((item) => item.id === currentId)
  // 避免在切换模式，打乱播放列表顺序后会影响当前播放的歌曲
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}
