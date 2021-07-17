<template>
  <div class="child1">
     <p>这是child5页面</p>
     <p>user id {{id}}</p>

  </div>
</template>

<script>
export default {
    data(){
        return {
           id:''
        }
    },
    created(){
        this.id = this.$route.params.id
    },
    // 使用watch监听$route的变化，第一次加载组件的时候不会触发
    watch:{
      $route(newValue,oldValue){
        console.log(newValue);  // 其实对应的是beforeRouteUpdate中的to
        console.log(oldValue);  // 其实对应的是beforeRouteUpdate中的from
        this.id = newValue.params.id 
      }
    }
    // 使用钩子函数 beforeRouteUpdate，第一次加载组件的时候不会触发
    // beforeRouteUpdate(to,from,next){
    //     this.id = to.params.id
    //     console.log(to);  // 目标路由  要跳转到哪个路由去
    //     console.log(from); // 从哪个路由跳转过来的
    //     next()
    // }

}
</script>

<style>

</style>