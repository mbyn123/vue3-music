import MusicList from '@/components/MusicList/MusicList'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createComponent(name, key, fetch) {
  return {
    name,
    props: {
      data: Object
    },
    data() {
      return {
        song: [],
        loading: true
      }
    },
    async created() {
      const data = this.computedData
      if (!data) {
        // 获取上一级路由路径，返回
        const path = this.$route.matched[0].path
        this.$router.push({ path })
        return
      }
      const res = await fetch(data)
      this.song = await processSongs(res.songs)
      this.loading = false
    },
    components: {
      MusicList
    },
    computed: {
      // 页面刷新从缓存中获取数据
      computedData() {
        let rel = null
        const data = this.data
        if (JSON.stringify(data) !== '{}') {
          rel = data
        } else {
          const cached = storage.session.get(key)
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            rel = cached
          }
        }
        return rel
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      },
      pic() {
        const data = this.computedData
        return data && data.pic
      }
    }
  }
}
