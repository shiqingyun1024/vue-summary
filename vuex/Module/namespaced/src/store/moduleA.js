export default {
    namespaced:true,
    state:()=>({
        countA:1
    }),
    getters:{
        // 第二个参数必须为getters，第三个参数为全局根节点状态
        doubleCountA(state,getters,rootState){
            console.log(getters);
            console.log(rootState);
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
       asyncIncrementA({commit,rootState},payload){
           console.log(rootState);
           commit('incrementA',payload)
       }
    }
}