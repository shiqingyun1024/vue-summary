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
  beforeRouteLeave(){
    console.log('1、组件内守卫--beforeRouteLeave');
  }
}
</script>
