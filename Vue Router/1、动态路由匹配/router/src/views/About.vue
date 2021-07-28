<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{msg}}</p>
    <router-link :to="{name:'child3',params:{name:'jack',user:{id:'23'}}}">child3页面</router-link>
    <router-view ></router-view>
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
    // 只有使用同一个组件来回跳转时，才会触发watch中的$route和beforeRouteUpdate，例如动态路由为 /user/:username    我们从/home 跳转到/user/foo后，是不会触发watch和beforeRouteUpdate
    // 但是我们从/user/foo跳转到/user/bar时，是会触发watch和beforeRouteUpdate的，因为/user/foo和/user/bar都是复用的同一个组件---user组件。
    // 动态路由跳转，会复用同一个组件，所以只有第一次进入的时候会调用created，mounted。再次进入的时候不会调用。所以用watch监听$route的变化
    $route(newValue,oldValue){
      this.msg = newValue.params.name
      console.log('路由更新');
    }
  },
  // 或者使用钩子函数 beforeRouteUpdate
  beforeRouteUpdate(to,from,next){
    this.msg = to.params.name
    console.log(to);
    console.log(from);
    next()
  }
}
</script>
