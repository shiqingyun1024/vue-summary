<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{name}}</p>
  </div>
</template>
<script>
export default {
  name: 'about',
  data(){
    return {
      name:'我是data'
    }
  },
  beforeCreate(){
     console.log(this.name);
     console.log('我是beforeCreate钩子函数');
  },
  created(){
     console.log(this.name);
     console.log('我是created钩子函数');
  },
  beforeMount(){
     console.log(this.name);
     console.log('我是beforeMount钩子函数');
  },
  mounted(){
     console.log(this.name);
     console.log('我是mounted钩子函数');
  },
  beforeUpdate(){
     console.log(this.name);
     console.log('我是beforeUpdate钩子函数');
  },
  updated(){
     console.log(this.name);
     console.log('我是updated钩子函数');
  },
  beforeDestroy(){
     console.log(this.name);
     console.log('我是beforeDestroy钩子函数');
  },
  destroyed(){
    this.getName()
     console.log(this.name);
     console.log('我是destroyed钩子函数');
  },
  methods:{
    getName(){
      this.name = '改变name的值'
    }
  }
}
</script>
