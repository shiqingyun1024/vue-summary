<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>computed counta:{{countA}}</p>
    <p>a counta:{{$store.state.a.countA}}</p>
    <button @click="changeCountA">change countA</button></br>
    <p>computed countb:{{countB}}</p>
    <p>b countb:{{$store.state.b.countB}}</p>
    <button @click="changeCountB">change countA</button></br>
  </div>
</template>
<script>
export default {
  name:'about',
  computed:{
    countA(){
      // 记住一定要加state
      return this.$store.state.a.countA
    },
    countB(){
      // 记住一定要加state
      return this.$store.state.b.countB
    },
  },
  methods:{
    changeCountA(){
      this.$store.commit('incrementA',{count:10})
    },
    changeCountB(){
      this.$store.commit('incrementB',{count:20})
    }
  }
}
</script>
