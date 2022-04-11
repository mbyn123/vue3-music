import { computed, h, mergeProps, nextTick, ref, renderSlot, watch, withCtx } from 'vue'
import Scroll from '@/components/base/Scroll/Scroll'
import { useStore } from 'vuex'

export default {
  name: 'WrapperScroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(Scroll, mergeProps({ ref: 'scrollRef' }, ctx.$props, { onScroll: e => ctx.$emit('scroll', e) }), {
      default: withCtx(() => [renderSlot(ctx.$slots, 'default')])
    })
  },
  setup() {
    const store = useStore()
    const scrollRef = ref(null)
    const scroll = computed(() => scrollRef.value.scroll)
    const playList = computed(() => store.state.playList)
    watch(playList, async () => {
      await nextTick()
      scroll.value.refresh()
    })
    return {
      scrollRef,
      scroll
    }
  }
}
