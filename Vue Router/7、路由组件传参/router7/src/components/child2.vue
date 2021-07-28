<template>
  <div class="child1">
     <p>这是child2页面</p>
     <p>user: {{user}}</p>
     <p>members: {{members}}</p>
  </div>
</template>

<script>
export default {
    props:['user','members'],
}
</script>

<style>

</style>