<template>
  <div class="child1">
     <p>这是child2页面</p>
     <p>user {{id}}</p>
     <p>user {{$route.params.id}}</p>
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
      this.id = this.$route.params.id
    }

}
</script>

<style>

</style>