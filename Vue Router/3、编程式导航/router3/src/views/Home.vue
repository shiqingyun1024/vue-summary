<template>
  <div class="home">
    <button @click="pushChild1">child1页面--字符串直接跳转</button></br>
    </hr>
    <button @click="pushChild2">child2页面--v-bind的js表达式-字符串</button></br>
    </hr>
    <button @click="pushChild3">child3页面--v-bind的js表达式-对象(包含path)</button></br>
    </hr>
    <button @click="pushChild4">child4页面--v-bind的js表达式-对象(包含path和查询参数query)</button></br>
    </hr>
    <button @click="pushChild5">child5页面--v-bind的js表达式-对象(包含命名路由)</button></br>
    </hr>
    <button @click="pushChild6">child6页面--v-bind的js表达式-对象(包含命名路由和params参数)</button></br>
    </hr>
    <button @click="pushChild7">child7页面--v-bind的js表达式-对象(包含命名路由和query参数)</button></br>
    </hr>
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  methods:{
    pushChild1(){
      this.$router.push('/child1')
    },
    pushChild2(){
      this.$router.push('/child2')
    },
    pushChild3(){
      this.$router.push({path:'/child3'})
    },
    pushChild4(){
      this.$router.push({path:'/child4',query:{user:'4'}})
    },
    pushChild5(){
      this.$router.push({name:'child5'})
    },
    pushChild6(){
      this.$router.push({name:'child6',params:{user:'6'}})
    },
    pushChild7(){
      this.$router.push({name:'child7',query:{user:'7'}})
    }
  }
}
</script>
