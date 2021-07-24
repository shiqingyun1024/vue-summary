<template>
  <div class="child1">
      这是child1页面
  </div>
</template>

<script>
export default {
   beforeRouteEnter(to,from,next){
         console.log('5、组件内的守卫--beforeRouteEnter');
         next(vm=>{
           console.log('8、vm是组件实例');
           console.log('8、注意 beforeRouteEnter 是支持给 next 传递回调的唯一守卫。');
         })
    }
}
</script>

<style>

</style>