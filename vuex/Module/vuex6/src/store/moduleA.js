export default {
    state:()=>({
        countA:1
    }),
    getters:{},
    mutations:{
        incrementA(state,payload){
            state.countA += payload.count
        }
    },
    actions:{},
}