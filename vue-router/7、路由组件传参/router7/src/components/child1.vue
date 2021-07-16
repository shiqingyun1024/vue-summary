<template>
  <div class="child1">
     <p>这是child1页面</p>
     <p>user {{id}}</p>

  </div>
</template>

<script>
export default {
    props:['id'],
    data(){
        return {

        }
    },
    watch:{
        $route(newValue,oldValue){
            console.log(newValue);
            console.log(oldValue);
        }
    }

}
</script>

<style>

</style>