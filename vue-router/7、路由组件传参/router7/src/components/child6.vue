<template>
  <div class="child1">
     <p>这是child6页面</p>
     <p>user {{id}}</p>

  </div>
</template>

<script>
export default {
    // props:['id'],
    data(){
        return {
          id:''
        }
    },
    created(){
      this.id = this.$route.query.id
      console.log(this.$route.query);
    }

}
</script>

<style>

</style>