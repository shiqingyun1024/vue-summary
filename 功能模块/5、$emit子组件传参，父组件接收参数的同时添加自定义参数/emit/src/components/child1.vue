<template>
  <div>
    <div>这是child1页面</div>
    <button @click="changeChild1">changeChild1</button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods:{
     changeChild1(){
         this.$emit('fromChild1','child1-data')
     } 
  }
};
</script>
<style>
</style>