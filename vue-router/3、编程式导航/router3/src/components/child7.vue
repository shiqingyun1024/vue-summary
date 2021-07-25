<template>
  <div class="”child6“">This is child7 page 序号:{{index}}</div>
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
    this.index = this.$route.query.user;
  }
};
</script>

<style>
</style>