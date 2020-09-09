import Vue from 'vue'
import Vuex from 'vuex'
import persisted from './persistedState.js'

Vue.use(Vuex)

const state = {
  token: '',
  user: {}, // ICON组件中用到
  curSelected: null,
  network: true,
  msgData: [],
  aliveList: {}
}

// const getters = {
//   getAliveList(state){
//     if(state.aliveList === null){
//       state.aliveList = JSON.parse(sessionStorage.getItem('alive'))
//     }
//     return state.aliveList
//   }
// }

const mutations = {
  pushMsg(state, data) {
    if (data) {
      if (data.constructor === Array) {
        state.msgData.push(...data)
      } else {
        state.msgData.push(data)
      }
    }
  },
  clearMsg(state) {
    state.msgData = []
  },
  setCurSelectUser(state, uid) {
    state.curSelected = uid
  },
  changeNetwork(state, status) {
    state.network = status
  },
  loginSuccess(state, token) {
    state.token = token
  },
  setAliveList(state) {
    state.aliveList = Object.assign({}, state.aliveList)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  plugins: [persisted()]
})
