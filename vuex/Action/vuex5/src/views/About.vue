<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="changeCount">changeCount</button>
    <br>
    <button @click="changeCount2">changeCount2</button>
    <p>count:{{count}}</p>
  </div>
</template>
<script>
import {mapState} from 'vuex'
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
      this.$store.dispatch({type:'add',number:10})
    }
  }
  
}
</script>
