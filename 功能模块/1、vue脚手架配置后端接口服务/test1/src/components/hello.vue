<template>
    <div>{{flag}}</div>
</template>

<script>
export default {
    data(){
        return {
            flag:'123'
        }
    },
    created(){
        setTimeout(()=>{
           console.log('子组件执行1');
       },2000)
    },
    async mounted(){
       await setTimeout(()=>{
           this.flag="改变"
       },2000)
       console.log('子组件执行2');
    }
}
</script>

<style>

</style>