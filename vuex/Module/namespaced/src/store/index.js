import Vue from 'vue'
import Vuex from 'vuex'
import moduleA from './moduleA'
import moduleB from './moduleB'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count:10
  },
  mutations: {
    increment(state,paylaod){
       state.count += paylaod.count
    }
  },
  actions: {
    asyncIncrement({commit},payload){
      commit('increment',payload)
    }
  },
  modules: {
    a:moduleA,
    b:moduleB
  }
})
