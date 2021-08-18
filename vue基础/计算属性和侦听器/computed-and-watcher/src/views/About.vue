<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input type="text" v-model="message">
    <h2>message:{{message}}</h2>
    <hr>
    <tab-bar :data="tabs" v-model="selectedLabel">
    </tab-bar>
    <h3>当前选项：{{selectedLabel}}</h3>
  </div>
</template>
<script>
import TabBar from '@/components/tab-bar.vue'
export default {
  components: { TabBar },
  name:'about',
  data(){
    return {
       message:'about页面',
       index:0,
       tabs:[
         {label:'选项1',value:'about1'},
         {label:'选项2',value:'about2'},
         {label:'选项3',value:'about3'}
       ],
       selectedLabel:'about1'
    }
  },
  computed:{
    // selectedLabel(){
    //   return this.tabs[this.index].value
    // }
  }
}
</script>
