export default {
    state:()=>({
        countA:1
    }),
    getters:{
        doubleCountA(state){
            return state.countA*2
        }
    },
    mutations:{
        // 这里的 `state` 对象是模块的局部状态
        incrementA(state,payload){
            state.countA += payload.count
        }
    },
    actions:{
       asyncIncrementA({commit},payload){
           commit('incrementA',payload)
       }
    }
}