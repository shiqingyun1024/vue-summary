<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="changeCount">changeCount</button>
    <br>
    <button @click="changeCount2">changeCount2</button>
    <br>
    <button @click="add3({number:100})">add3</button>
    <br>
    <button @click="add4({number:200})">add4</button>
    <br>
    <button @click="addCount({number:50})">addCount</button>
    <p>count:{{count}}</p>
  </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
export default {
  name:'about',
  computed:mapState(['count']),
  methods:{
    // 使用vuex中的Action
    changeCount(){
      // 分发Action 以载荷形式分发
      this.$store.dispatch('add',{number:10})
    },
    // 使用vuex中的Action
    changeCount2(){
      // 分发Action 以对象形式分发
      this.$store.dispatch({type:'add2',number:10})
    },
    // 将 `this.add3()` 映射为 `this.$store.dispatch('add3')`
    // `mapActions` 也支持载荷： 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ...mapActions(['add3','add4']),
    // 将 `this.addCount()` 映射为 `this.$store.dispatch('add5')`
    ...mapActions({
      addCount:'add5'
    })
  }
  
}
</script>
