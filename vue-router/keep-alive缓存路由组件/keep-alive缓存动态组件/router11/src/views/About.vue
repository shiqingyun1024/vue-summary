<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="changeComponent">切换组件</button>
    <keep-alive>
      <component :is="currentTabComponent"></component>
    </keep-alive>
  </div>
</template>
<script>
import child1 from "@/components/child1.vue";
import child2 from "@/components/child2.vue";
export default {
  name: "about",
  components: {
    child1,
    child2
  },
  data() {
    return {
      currentTabComponent:child1
    };
  },
  methods:{
    changeComponent(){
      if(this.currentTabComponent === child1){
        this.currentTabComponent = child2
      }else{
        this.currentTabComponent = child1
      }
    }
  }
};
</script>
