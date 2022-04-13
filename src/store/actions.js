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

// 删除歌曲
export const deleteSong = ({ commit, state }, song) => {
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()
  let currentIndex = state.currentIndex
  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playList, song)
  if (sequenceIndex < 0 || playIndex < 0) {
    return
  }
  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)

  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
  if (!playIndex.length) {
    commit('setPlayingState', false)
  }
}

// 清空播放列表
export const clearPlayList = ({ commit }) => {
  commit('setPlayList', [])
  commit('setSequenceList', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}

// 添加歌曲到播放列表
export const addSong = ({ commit, state }, song) => {
  const playList = state.playList.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  // 当前添加的歌曲是否存在播放列表中
  const playIndex = findIndex(playList, song)
  if (playIndex > -1) { // 存在
    currentIndex = playIndex
  } else { // 不存在
    playList.push(song)
    currentIndex = playList.length - 1
  }

  // 当前添加的歌曲是否存在歌曲列表中
  const sequenceIndex = findIndex(sequenceList, song)
  if (sequenceIndex === -1) { // 不存在
    sequenceList.push(song)
  }

  commit('setPlayList', playList)
  commit('setSequenceList', sequenceList)
  commit('setCurrentIndex', currentIndex)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}

const findIndex = (list, song) => {
  return list.findIndex(item => item.id === song.id)
}
