<template>
  <div class="child">
     <p>{{child1name}}</p>
     <button @click="change">改变name的值</button>
     <!-- <button @click="">改变child1的值</button> -->
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
  created(){
     console.log(this._events);
     console.log(this._events.ChangeChild);
     console.log(this._events.ChangeChild[0]);
  },
  methods:{
     change(){
        console.log('emit');
         this.child1name = '小花'
         this.eventbus.$emit('changename',this.child1name)
         this.$emit('ChangeChild','子组件1','子组件2')
         this.$emit('ChangeChild2','子组件1','子组件2')
     }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
