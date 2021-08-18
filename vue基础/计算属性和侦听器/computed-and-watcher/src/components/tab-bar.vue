<template>
  <div>
    <p>
      <span
        class="bar"
        :class="{'active':value===item.value}"
        v-for="item in data"
        :key="item.label"
        @click="select(item.value)"
        >{{ item.label }}</span
      >
    </p>
  </div>
</template>

<script>
export default {
  name: "TabBar",
  props: ["data",'value'],
  methods: {
    select(value) {
      this.$emit("input", value);
    },
  },
};
</script>

<style scoped lang="scss">
.bar{
    display: inline-block;
    width: 70px;
    background-color: #ccc;
    text-align: center;
    border: 1px solid #eee;
    height: 30px;
    line-height: 30px;
}
.active{
    background-color: #2195de;
}

</style>