import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser/src'

export default function useLyric({ songReady, currentTime }) {
  const currentLyric = ref(null) // 当前歌曲的歌词
  const currentLineNum = ref(0) // 当前歌词播放的行数
  const playingLyric = ref('') // 当前播放的歌词
  const pureMusicLyric = ref('') // 无歌词时候的文案
  const lyricScrollRef = ref()
  const lyricListRef = ref()

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)
  // 监听歌曲变化，获取歌词
  watch(currentSong, async (newValue) => {
    if (!newValue.url || !newValue.id) {
      return
    }
    // 发现播放歌曲歌曲发生变化，停止歌词播放,清空歌词
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    const lyric = await getLyric(newValue)
    store.commit('addSongLyric', { song: newValue, lyric })
    // 如果当前请求得到的歌词和当前播放歌曲的歌词不同，就不执行
    if (currentSong.value.lyric !== lyric) {
      return
    }
    // 歌词解析回调
    const handLyric = ({ lineNum, txt }) => {
      currentLineNum.value = lineNum
      playingLyric.value = txt
      const scrollEl = lyricScrollRef.value.scroll
      const listEl = lyricListRef.value
      // 如果当前播放的歌词行数大于5就滚动歌词列表
      if (lineNum > 5) {
        scrollEl.scrollToElement(listEl.children[lineNum - 5], 1000)
      } else {
        scrollEl.scrollTo(0, 0, 1000)
      }
    }

    // 解析歌词
    currentLyric.value = new Lyric(lyric, handLyric)
    const hasLyric = currentLyric.value.lines.length
    // 如果当前歌曲有歌词
    if (hasLyric) {
      // 如果歌曲加载完成
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  // 播放歌词
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      // 同步当前歌词和播放时间
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  // 停止播放歌词
  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  return {
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    playingLyric,
    playLyric,
    stopLyric
  }
}
