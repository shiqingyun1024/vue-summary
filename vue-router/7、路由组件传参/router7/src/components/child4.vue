<template>
  <div class="child1">
     <p>这是child4页面</p>
     <p>user {{user.id}}</p>
     <p>member {{members[0]+members[1]}}</p>

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
    }
}
</script>

<style>

</style>