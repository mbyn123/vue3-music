const mutations = {
  // 修改歌曲播放状态
  setPlayingState(state, playing) {
    state.playing = playing
  },
  // 修改歌曲列表
  setSequenceList(state, list) {
    state.sequenceList = list
  },
  // 修改播放列表
  setPlayList(state, list) {
    state.playList = list
  },
  // 修改播放模式
  setPlayMode(state, mode) {
    state.playMode = mode
  },
  // 修改当前播发的歌曲
  setCurrentIndex(state, index) {
    state.currentIndex = index
  },
  // 修改播放器模式
  setFullScreen(state, fullScreen) {
    state.fullScreen = fullScreen
  },
  // 修改收藏列表
  setFavoriteList(state, list) {
    state.favoriteList = list
  }
}

export default mutations
