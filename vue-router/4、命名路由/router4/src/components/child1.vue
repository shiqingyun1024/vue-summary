<template>
  <div>
    <p>这是child1页面</p>
    <p>{{ msg }}</p>
  </div>
</template>

<script>
export default {
  name: "child1",
  data() {
    return {
      msg: "",
    };
  },
  created() {
    this.msg = this.$route.params.user;
  },
  //  动态路由公用一个组件时，会复用同一个组件，所以不会重新渲染组件，不会初始化这个组件。  使用watch或者beforeRouterUpdate钩子函数。
  //   watch: {
  //     $route(newValue, oldValue) {
  //       this.msg = this.$route.params.user;
  //     },
  //   },
  beforeRouteUpdate(to, from, next) {
      this.msg = to.params.user;
      next()
  },
};
</script>
<style>
</style>