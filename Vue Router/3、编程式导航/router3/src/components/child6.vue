<template>
  <div class="”child6“">This is child6 page 序号:{{index}}</div>
</template>

<script>
export default {
  data() {
    return {
      index: ""
    };
  },
  created() {
    // console.log(this.$route.params);
    // this.index = this.$route.params.user;
    this.index = this.$route.params?this.$route.params.user:'';
  }
};
</script>

<style>
</style>