<template>
  <div>
    <ul>
      <li v-for="(plan, index) in planList" :key="index" @click="selectBar(index)">
        {{ plan.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "tab-bar",
  props: {
    planList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    selectBar(index) {
        this.$emit('input',this.planList[index])
    },
  },
};
</script>
<style>
</style>