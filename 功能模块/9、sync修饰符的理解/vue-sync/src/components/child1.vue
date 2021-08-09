<template>
  <div>
      <p>{{title}}</p>
      <button @click="change">修改</button>
  </div>
</template>

<script>
export default {
    props:['title'],
    methods:{
        change(){
           this.$emit('update:title','小黄')
        }
    }
}
</script>

<style>

</style>