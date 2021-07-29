import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count:0,
  },
  getters:{

  },
  mutations: {
    // 1、可以直接传值
    increment1(state,n){
      state.count += n
    },
    // 2、可以直接传入一个对象
    increment2(state,payLoad){
      state.count += payLoad.number
    },
    // 3、可以直接传入一个对象
    increment3(state,payLoad){
      state.count += payLoad.amount
    },
    increment4(state,payLoad){
      state.count += payLoad.amount
    },
    increment5(state,payLoad){
      state.count += payLoad.amount
    },
    increment6(state,payLoad){
      state.count += payLoad.amount
    },
  },
  actions: {
  },
  modules: {
  }
})
