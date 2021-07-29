import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count:0,
    numbers:[1,2,3,4,5,6,7,8,9]
  },
  getters:{
    // 第一种方法，直接对state中的数据进行处理(但是不会改变state中的值)，这种方式会有缓存
    numbersFilter(state){
      return state.numbers.filter(number=>number > 6)
    },
    // 我们也可以传入getters作为第二个参数，这样可以访问getters中定义的方法
    getNumbersFilterLength(state,getters){
      return getters.numbersFilter.length
    },

    // 第二种方式，返回的是一个函数（其实是使用了闭包这种方式），而且在组件中使用的时候可以传参进去，得到想要的结果，但这种方式不会有缓存
    getNumberById(state){
      return (id)=>state.numbers.filter(number=>number > id)
    }
    // 也可以简写成下面的这种方式
    // getNumberById:(state)=>(id)=>state.numbers.filter(number=>number > id),
    
  },
  mutations: {
    modifyNumbers(state){
      state.numbers.splice(state.numbers.length,0,10,11,12,13,14,15,16)
    }
  },
  actions: {
  },
  modules: {
  }
})
