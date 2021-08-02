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
    console.log('on');
    this.eventbus.$on('changename',(name)=>{
       this.child2name = name
    })
    this.$on('ChangeChild2',(params)=>{
      console.log(123);
      console.log(params);
    })
  },
  mounted(){
    this.$on('ChangeChild2',(params)=>{
      console.log(123);
      console.log(params);
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
