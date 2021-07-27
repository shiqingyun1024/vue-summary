<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-link :to="{name:'child1'}">go to child1</router-link></br>
    <router-link :to="{name:'child2'}">go to child2</router-link>
    <keep-alive include="child1">
        <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
</script>
