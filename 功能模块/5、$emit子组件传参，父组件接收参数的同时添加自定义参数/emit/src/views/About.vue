<template>
  <div class="about">
    <h1>This is an about page</h1>
    <child1 @fromChild1="getChild1($event,'我是父组件中的参数--child1')"></child1>
    </br>
    </br>
    <child2 @fromChild2="getChild2(arguments,'我是父组件中的参数--child2','我是父组件中的参数--child2--第二个')"></child2>
    </br>
    </br>
    <child3 @fromChild3="getChild3('我是父组件中的参数--child3',...arguments)"></child3>
  </div>
</template>
<script>
import child1 from '@/components/child1'
import child2 from '@/components/child2'
import child3 from '@/components/child3'
export default {
  components:{
    child1,
    child2,
    child3
  },
  data(){
    return{

    }
  },
  methods:{
    getChild1($event,parameter){
      console.log($event);
      console.log(parameter);
    },
    getChild2(parameter,other1,other2){
      // console.log(arguments);
      console.log(parameter);
      console.log(other1);
      console.log(other2);
    },
    getChild3(...parameters){
      // console.log(arguments);
      console.log(parameters);
      // console.log(other);
    }
  }
}
</script>
