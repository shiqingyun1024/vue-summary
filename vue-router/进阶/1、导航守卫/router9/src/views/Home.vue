<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  beforeRouteLeave(to,from,next){
    console.log('1、组件内守卫--beforeRouteLeave');
    next()
  }
}
</script>
