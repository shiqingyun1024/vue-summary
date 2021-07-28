<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>count:{{count}}</p>
  </div>
</template>
<script>
export default {
  name:'about',
  data(){
    return{

    }
  },
  computed:{
    count(){
      return this.$store.state.count
    }
  }
}
</script>
