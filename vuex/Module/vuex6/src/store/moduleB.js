export default {
    state:()=>({
        countB:2
    }),
    getters:{},
    mutations:{
        incrementB(state,paylaod){
            state.countB += paylaod.count
        }
    },
    actions:{},
}