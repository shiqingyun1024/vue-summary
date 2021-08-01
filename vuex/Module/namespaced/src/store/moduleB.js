export default {
    namespaced:true,
    state:()=>({
        countB:2
    }),
    getters:{
        doubleCountB(state){
            return state.countB*2
        }
    },
    mutations:{
        incrementB(state,paylaod){
            state.countB += paylaod.count
        }
    },
    actions:{
        asyncIncrementB({commit},payload){
            commit('incrementB',payload)
        }
    },
}