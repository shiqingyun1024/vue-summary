<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <a href="#/home12">home123</a>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  created(){
    console.log('1234');
    window.addEventListener('hashchange',function(event){
       console.log('url发生改变');
    })
    window.onhashchange = function(event){
       console.log('url发生改变---onhashchange');
    }
    window.addEventListener('popstate',function(event){
       console.log('前进或者后退');
    })
    window.onhashchange = function(opt) {
        console.log(opt);
      };
    // };
    window.addEventListener('hashchange',(option)=>{
           console.log("hash值的变化");
    })
  }
}
</script>
