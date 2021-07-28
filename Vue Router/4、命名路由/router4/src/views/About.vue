<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="goChild1">push to child1</button></br>
    <router-link :to="{name:'child1',params:{user:'child1-link'}}">router-link to child1</router-link></br>
    <router-link :to="{name:'child2'}">router-link to child2</router-link></br>
    <router-link to="/about/child2">router-link to child2</router-link>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name:'about',
  methods: {
    goChild1(){
      this.$router.push({name:'child1',params:{user:'child1-push'}})
    }
  }
}
</script>
