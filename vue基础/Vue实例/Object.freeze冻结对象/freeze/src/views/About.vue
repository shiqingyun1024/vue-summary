<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{ list.foo }}</p>
    <p>{{ list2.foo2 }}</p>
    <button @click="change">change freeze</button>
  </div>
</template>
<script>
export default {
  name: "about",
  data() {
    return {
      list: Object.freeze({
        foo: "about",
      }),
      list2:{
        foo2: "about2",
      }
    };
  },
  methods: {
    change() {
      this.list.foo = "bar"; // 在这一步会报错，不会往下走了。
      this.list2.foo2 = "bar";
    },
  },
};
</script>
