import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count:1,
    name:'加油',
    age:18,
    height:180,
    subjects:{
      a:'语文',
      b:'数学',
      c:'英语'
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
