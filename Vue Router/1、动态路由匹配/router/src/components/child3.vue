<template>
  <div class="child3">
    {{msg}}</br>
    {{msg2}}
  </div>
</template>

<script>
export default {
  name: "child3",
  data() {
    return {
      msg: "",
      msg2: ""
    };
  },
  created() {
    console.log(this.$route.params);
    this.msg = this.$route.params.name;
    this.msg2 = this.$route.params.user;
  },
};
</script>