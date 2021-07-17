<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  created() {
    window.onload = function() {
      // hash变化时触发
      window.onhashchange = function(opt) {
        console.log(opt);
      };
    };
  },
  watch:{
    $route(newValue,oldValue){
      window.onhashchange = function(opt) {
        console.log("hash值的变化");
        console.log(opt);
      };
      // 这里面
      console.log(newValue);
      console.log(oldValue);
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
