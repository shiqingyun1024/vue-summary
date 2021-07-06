<template>
  <div id="app">
    <p>{{name}}</p>
    <child1 :name="name"/>
    <child2 :name="name"/>
  </div>
</template>
<script>
import child1 from './components/child1'
import child2 from './components/child2'

export default {
  components: {
    child1,
    child2
  },
    data(){
      return {
        name:'小黄'
      }
    }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
