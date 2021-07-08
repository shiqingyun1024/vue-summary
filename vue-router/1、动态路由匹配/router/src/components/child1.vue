<template>
  <div class="child1">
    {{msg}}
  </div>
</template>

<script>
export default {
  name: 'child1',
  data(){
     return {
       msg:''
     }
  },
  created(){
     this.msg = this.$route.params.msg
  }
}
</script>