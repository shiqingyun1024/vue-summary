<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Hello msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import Hello from './components/hello.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    Hello
  },
  created(){
     axios.get('api/goods').then(res=>{
       console.log(res);
       console.log(res.data); //{"errno":0,"data":{"goods":["牛奶","鸡蛋"]}}
     })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
