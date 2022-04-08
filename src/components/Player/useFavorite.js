import { useStore } from 'vuex'
import { computed } from 'vue'
import { remove, save } from '@/assets/js/arrayStore'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite() {
  const { state, commit } = useStore()
  const favoriteList = computed(() => state.favoriteList)
  const maxLength = 100
  // 获取收藏图标
  const getFavoriteIcon = (song) => {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // 切换收藏状态
  const toggleFavorite = (song) => {
    let list
    const compare = (item) => item.id === song.id
    if (isFavorite(song)) {
      // 存在就删除
      list = remove(FAVORITE_KEY, compare)
    } else {
      // 不存在就添加
      list = save(song, FAVORITE_KEY, compare, maxLength)
    }
    commit('setFavoriteList', list)
  }

  // 判断当前歌曲是否存在收藏列表中
  const isFavorite = (song) => {
    return favoriteList.value.findIndex(item => {
      return item.id === song.id
    }) > -1
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
