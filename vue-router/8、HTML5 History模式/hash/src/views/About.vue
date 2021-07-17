<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-link :to="{name:'child1'}">去child1页面</router-link></br>
    <router-link :to="{name:'child2'}">去child2页面</router-link>
    <router-view></router-view>
  </div>
</template>
