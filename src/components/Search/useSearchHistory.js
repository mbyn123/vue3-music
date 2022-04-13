import { clear, remove, save } from '@/assets/js/arrayStore'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function useSearchHistory() {
  const { commit } = useStore()

  const saveHistory = (query) => {
    const searches = save(query, SEARCH_KEY, (item) => item === query, 200)
    commit('setSearchHistory', searches)
  }

  const deleteHistory = (query) => {
    const searches = remove(SEARCH_KEY, (item) => item === query)
    commit('setSearchHistory', searches)
  }

  const clearHistory = () => {
    const searches = clear(SEARCH_KEY)
    commit('setSearchHistory', searches)
  }

  return {
    saveHistory,
    deleteHistory,
    clearHistory
  }
}
