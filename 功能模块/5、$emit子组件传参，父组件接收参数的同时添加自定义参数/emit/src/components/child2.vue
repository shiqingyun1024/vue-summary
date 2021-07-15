<template>
  <div>
    <div>这是child2页面</div>
    <button @click="changeChild2">changeChild2</button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    changeChild2() {
      this.$emit("fromChild2", "child2-data", "child2-data2", {
        "child2-obj": "传递对象",
      });
    },
  },
};
</script>
<style>
</style>