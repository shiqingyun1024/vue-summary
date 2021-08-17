<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p v-once>{{name}}</p>
    <button @click="changeName">changeName</button>
    <br>
    <a v-bind:[attributeName]="gourl">打开博客</a>
  </div>
</template>
<script>
export default {
   name:'about',
   data(){
     return {
       name:'about页面',
       attributeName:'href',
       gourl:'https://blog.csdn.net/xiaolinlife'
     }
   },
   methods:{
     changeName(){
       this.name = '改变name的值'
     }
   }
}
</script>
