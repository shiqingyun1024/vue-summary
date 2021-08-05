<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <tab-bar :planList="planList" v-model="selected"></tab-bar>
    <tab-slider :planList="planList" v-model="selected"></tab-slider>
    <p>选择了 {{selected.label}}</p>
    <p>选择了 {{selected.value}}</p>
  </div>
</template>

<script>
// @ is an alias to /src
import tabBar from '@/components/tab-bar.vue'
import tabSlider from '@/components/tab-silder.vue'
export default {
  name: 'Home',
  components: {
    tabBar,
    tabSlider
  },
  data(){
    return{
      planList:[
        {label:'首页',value:'firstPage'},
        {label:'我的',value:'my'},
        {label:'个人中心',value:'center'}
      ],
      selected:{label:'',value:''},
    }
  }
}
</script>
