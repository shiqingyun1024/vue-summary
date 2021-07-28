<template>
  <div class="”child4“">This is child4 page 序号：{{index}}</div>
</template>

<script>
export default {
  data() {
    return {
      index: ""
    };
  },
  created() {
    this.index = this.$route.query.user;
  }
};
</script>

<style>
</style>