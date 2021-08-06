<template>
  <div class="about">
    <h1>This is an about page</h1>
    <child1 :title.sync="title"></child1>
  </div>
</template>
<script>
import child1 from '@/components/child1.vue';
export default {
  components:{
    child1
  },
  data(){
    return {
      title:'小花'
    }
  }
  
}
</script>
