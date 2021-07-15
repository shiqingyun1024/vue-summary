<template>
  <div>
    <div>这是child3页面</div>
    <button @click="changeChild3">changeChild3</button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    changeChild3() {
      this.$emit("fromChild3", "child3-data", "child3-data2", {
        "child3-obj": "传递对象",
      });
    },
  },
};
</script>
<style>
</style>