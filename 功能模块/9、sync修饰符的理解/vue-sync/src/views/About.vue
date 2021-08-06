<template>
  <div class="about">
    <h1>This is an about page</h1>
    <child1 :title.sync="title"></child1>
    <child2 v-bind.sync="doc"></child2>
  </div>
</template>
<script>
import child1 from '@/components/child1.vue';
import child2 from '@/components/child2.vue';
export default {
  components:{
    child1,
    child2
  },
  data(){
    return {
      title:'小花',
      doc:{
        name:'小天',
        age:'17',
        height:'170'
      }
    }
  }
  
}
</script>
