import Vue from 'vue'
import Vuex from 'vuex'
import moduleA from './moduleA'
import moduleB from './moduleB'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    a:moduleA,
    b:moduleB
  }
})
