<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-link :to="{name:'child1'}">go child1</router-link>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'about',
  components: {
  },
  beforeRouteEnter(to,from,next){
    console.log(from.meta.name);
    console.log(to.meta.name);
    next()
  }
}
</script>