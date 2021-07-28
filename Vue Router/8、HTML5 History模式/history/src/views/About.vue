<template>
  <div class="about">
    <h1>This is an about page</h1>
    <a href="#/123">123</a></br>
    <a href="456">456</a></br>
  </div>
</template>
<script>

export default {
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
