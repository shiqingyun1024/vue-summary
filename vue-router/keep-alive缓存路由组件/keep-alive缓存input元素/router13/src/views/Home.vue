<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <keep-alive>
      <input type="text" v-model="aliveValue" v-if="show"/>
    </keep-alive>
    <button @click="isShow">切换input</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data(){
    return {
      aliveValue:'',
      show:true
    }
  },
  methods:{
    isShow(){
       this.show = !this.show
    }
  }
}
</script>
