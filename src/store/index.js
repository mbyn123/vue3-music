import { createStore, createLogger } from 'vuex'
import state from '@/store/state'
import mutations from '@/store/mutations'
import * as getters from './getters'
import * as actions from './actions'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  mutations,
  actions,
  plugins: debug ? [createLogger()] : []
})
