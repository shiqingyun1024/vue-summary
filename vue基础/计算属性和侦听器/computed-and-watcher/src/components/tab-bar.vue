<template>
  <div>
      <p v-for="item in data" :key="item.label">
          <label :for="item.label">{{item.label}}</label>
          <input :id="item.label" type="radio" name="bar" :value="item.value">
      </p>   
  </div>
</template>

<script>
export default {
   name:'TabBar',
   props:['data']
}
</script>

<style>

</style>