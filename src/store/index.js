import Vue from 'vue'
import Vuex from 'vuex'
import persisted from './persistedState.js'

Vue.use(Vuex)

const state = {
  newMsg: 0,
  token: '',
  user: {}, // ICON组件中用到
  curSelected: null,
  network: true,
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
  // pushMsg(state, data) {
  //   if (data) {
  //     if (data.constructor === Array) {
  //       state.msgData.push(...data)
  //     } else {
  //       state.msgData.push(data)
  //     }
  //   }
  // },
  setCurSelected(state, info) {
    state.curSelected = info
  },
  changeNetwork(state, status) {
    state.network = status
  },
  loginSuccess(state, token) {
    state.token = token
  },
  setAliveList(state) {
    state.aliveList = Object.assign({}, state.aliveList)
  },
  hasNewMsg(state) {
    state.newMsg++
  }
}

export default new Vuex.Store({
  state,
  mutations,
  plugins: [persisted()]
})
