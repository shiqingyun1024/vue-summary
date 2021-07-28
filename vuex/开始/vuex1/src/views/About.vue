<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{$store.state.count}}</p>
    <button @click="change">change count</button>
  </div>
</template>
<script>
export default {
  methods: {
    change() {
      this.$store.commit("increment");
    }
  }
};
</script>
