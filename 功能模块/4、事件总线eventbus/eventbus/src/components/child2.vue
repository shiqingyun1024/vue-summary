<template>
  <div class="child">
     <p>{{child2name}}</p>
  </div>
</template>

<script>
export default {
  name: 'child2',
  props: {
    name: String
  },
  data(){
     return {
         child2name:this.name
     }
  },
  created(){
    this.eventbus.$on('changename',(name)=>{
       this.child2name = name
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
