<template>
  <div class="child">
     <p>{{child1name}}</p>
     <button @click="change">改变name的值</button>
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
         child1name:this.name
     }
  },
  methods:{
     change(){
         this.child1name = '小花'
         this.eventbus.$emit('changename',this.child1name)
     }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
