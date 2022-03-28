import { PLAY_MODE } from '@/assets/js/constant'

const state = {
  sequenceList: [], // 歌曲列表
  playList: [], // 播放列表
  playing: false, // 是否播放
  playMode: PLAY_MODE.sequence, // 播放模式
  currentIndex: 0, // 当前播放的歌曲的索引
  fullScreen: false // 播放器是否是全屏模式
}

export default state
