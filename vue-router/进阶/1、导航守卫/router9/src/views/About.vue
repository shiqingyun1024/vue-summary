<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{update}}</p>
    <router-link>去child1页面</router-link></br>
    <router-link>去child2页面</router-link></br>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        update:'更新前'
      }
    },
    beforeRouteUpdate(to,from,next){
         this.update = '更新后'+to.params.name;
         console.log('3、组件内的守卫--beforeRouteUpdate');
         next()
    },
    beforeRouteEnter(to,from,next){
         console.log('4、组件内的守卫--beforeRouteEnter');
         next(vm=>{
           console.log('vm是组件实例');
           console.log('注意 beforeRouteEnter 是支持给 next 传递回调的唯一守卫。');
         })
    }
  }
</script>
