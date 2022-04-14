import { save } from '@/assets/js/arrayStore'
import { PLAY_KEY } from '@/assets/js/constant'
import { useStore } from 'vuex'

export default function usePlayHistory() {
  const store = useStore()
  const savePlay = (song) => {
    const playSong = save(song, PLAY_KEY, (item) => item.id === song.id, 200)
    store.commit('setPlayHistory', playSong)
  }

  return {
    savePlay
  }
}
