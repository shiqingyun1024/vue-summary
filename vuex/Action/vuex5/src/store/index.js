import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  getters: {

  },
  mutations: {
    increment(state, payLoad) {
      state.count += payLoad.number
    }
  },
  actions: {
    add(context, payLoad) {
      context.commit('increment', payLoad)
    },
    add2(context, payLoad) {
      context.commit('increment', payLoad)
    },
    add3(context, payLoad) {
      context.commit('increment', payLoad)
    },
    add4(context, payLoad) {
      context.commit('increment', payLoad)
    },
    add5(context, payLoad) {
      context.commit('increment', payLoad)
    }
  },
  modules: {
  }
})
