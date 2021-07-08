<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{msg}}</p>
  </div>
</template>
<script>
export default {
  name: 'about',
  data(){
     return {
       msg:''
     }
  },
  created(){
    console.log(this.$route.params);
     this.msg = this.$route.params.name
     console.log(this.msg);
  },
  watch:{
    // 动态路由跳转，会复用同一个组件，所以只有第一次进入的时候会调用created，mounted。再次进入的时候不会调用。所以用watch监听$route的变化
    $route(to,from){
      console.log('路由更新');
      console.log(this.$route);
       this.msg = this.$route.params.name
    }
  },
  beforeRouteUpdate(to,from,next){
    console.log(to);
    console.log(from);
    next()
  }
}
</script>
