<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <tab-bar :planList="planList" v-model="selected"></tab-bar>
    <p>选择了 {{selected.label}}</p>
    <p>选择了 {{selected.value}}</p>
    </br>
    </br>
    <tab-slider :planList="planList" v-model="selected2"></tab-slider>
    <p>选择了 {{selected2.label}}</p>
    <p>选择了 {{selected2.value}}</p>
    </br>
    </br>
    <tab-check :planList="planList" v-model="selected3"></tab-check>
    <p>选择了 {{selected3.label}}</p>
    <p>选择了 {{selected3.value}}</p>
  </div>
</template>

<script>
// @ is an alias to /src
import tabBar from '@/components/tab-bar.vue'
import tabSlider from '@/components/tab-slider.vue'
import tabCheck from '@/components/tab-check.vue'
export default {
  name: 'Home',
  components: {
    tabBar,
    tabSlider,
    tabCheck
  },
  data(){
    return{
      planList:[
        {label:'首页',value:'firstPage'},
        {label:'我的',value:'my'},
        {label:'个人中心',value:'center'}
      ],
      selected:{label:'',value:''},
      selected2:{label:'',value:''},
      selected3:{label:'',value:''},
    }
  }
}
</script>
