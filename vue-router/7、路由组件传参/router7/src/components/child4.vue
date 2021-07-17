<template>
  <div class="child1">
     <p>这是child3页面</p>
     <p>user {{user.id}}</p>

  </div>
</template>

<script>
export default {
    props:['user'],
    data(){
        return {

        }
    }

}
</script>

<style>

</style>