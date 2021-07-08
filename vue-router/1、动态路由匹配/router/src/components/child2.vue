<template>
  <div class="child2">
    {{msg}}
  </div>
</template>

<script>
export default {
  name: 'child2',
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