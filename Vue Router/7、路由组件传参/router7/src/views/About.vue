<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-link to="/about/child1/child1">go to child1 path</router-link></br>
    <router-link :to="{name:'child1',params:{id:'1234'}}">go to child1 name</router-link></br>
    <router-link :to="{name:'child2',params:{user:{id:'1234'},members:[123]}}">go to child2</router-link></br>
    <router-link :to="{name:'child3'}">go to child3</router-link></br>
    <router-link :to="{name:'child4'}">go to child4</router-link></br>
    <router-link to="/about/child5/id/title">go to child5</router-link></br>
    <router-link :to="{name:'child5'}">go to child5 使用name</router-link></br>
    <router-link :to="{name:'child5',params:{id:'5555'}}">go to child5 id为5555</router-link></br>
    <router-link :to="{path:'/about/child6',query:{id:'child6',user:{name:'vue'}}}">go to child6</router-link></br>
    <router-view></router-view>
  </div>
</template>
