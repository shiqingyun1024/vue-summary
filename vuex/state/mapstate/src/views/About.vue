<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{count}}</p>
    <p>{{name}}</p>
    <p>{{myname}}</p>
    <p>{{age}}</p>
    <p>{{allAge}}</p>
    <p>{{height}}</p>
    <p>{{subjects}}</p>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name:'about',
  data(){
    return {
      otherAge:20
    }
  },
  // 第一种用法
  computed:mapState({
    // 可以使用箭头函数进行返回值
    count:state=>state.count,
    // 可以直接使用state中定义的字符串参数，等同于name=>state.name
    myname:'name',
    age:'age',
    height:'height',
    subjects:'subjects',
    name:'name',
    // 为了能够使用‘this’获取局部状态，必须使用常规函数
    allAge(state){
       return state.age + this.otherAge
    }
  })

  // 第二种用法，当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。但是要注意，数组中一定是字符串。
  // computed:mapState(['count','name','age','height','subjects'])

}
</script>