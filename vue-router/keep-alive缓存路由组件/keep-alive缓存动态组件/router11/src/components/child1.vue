<template>
  <div class="child1">
    这是child1页面
    <br />
    <input type="text" />
  </div>
</template>

<script>
export default {
  name: "child1",
  data(){
      return{}
  },
  created() {
    console.log("这是child1页面--created");
  },
  mounted() {
    console.log("这是child1页面--mounted");
  },
  // keep-alive 特有的生命周期钩子 激活钩子activated
  activated() {
    console.log("这是child1页面--activated--激活生命周期钩子");
  },
  // keep-alive 特有的生命周期钩子 失活钩子deactivated
  deactivated() {
    console.log("这是child1页面--deactivated--失活生命周期钩子");
  }
};
</script>

<style>
</style>