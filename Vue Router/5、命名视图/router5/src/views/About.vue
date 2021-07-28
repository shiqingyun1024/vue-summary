<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-link :to="{name:'child'}">加载子页面</router-link>
    <button @click="toChild">加载子页面</button>
    <router-view name="child1"></router-view>
    <router-view name="child2"></router-view>
    <router-view name="child3"></router-view>
  </div>
</template>
<script>
export default {
  data(){
    return {}
  },
  methods:{
    toChild(){
       this.$router.push({name:'child'})
    }
  }
}
</script>
