<template>
  <div class="child1">
     <p>这是child3页面</p>
     <p>user {{user.id}}</p>
     <p>member {{user.member[0]+user.member[1]}}</p>

  </div>
</template>

<script>
export default {
    // props:['user'],
    props:{
      user:{
        type:Object,
        // 这种写法不对
        // default:{}
        // 对象或数组默认值必须从一个工厂函数获取
        default:()=>{
          return {}
        }
      },
      members:{
        type:Array,
        // 这种写法不对
        // default:[]
        // 对象或数组默认值必须从一个工厂函数获取
        default:()=>{
          return []
        }
      }
    },
    data(){
        return {
          memebr:[]
        }
    },
    created(){
      console.log(this.$props);
      console.log(this.user);
      console.log(this.member);
    }

}
</script>

<style>

</style>