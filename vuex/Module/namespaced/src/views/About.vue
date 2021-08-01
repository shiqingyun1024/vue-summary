<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>computed counta:{{countA}}</p>
    <p>computed doubleCountA:{{getDoubleCountA}}</p>
    <p>a counta:{{$store.state.a.countA}}</p>
    <button @click="changeCountA">change countA</button></br>
    <button @click="asyncCountA">change asyncCountA</button></br>
    <p>computed countb:{{countB}}</p>
    <p>b countb:{{$store.state.b.countB}}</p>
    <button @click="changeCountB">change countB</button></br>
    <button @click="asyncCountB">change asyncCountB</button></br>
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
    getDoubleCountA(){
      // console.log(this.$store.getters);
      return this.$store.getters['a/doubleCountA']
    }
  },
  methods:{
    changeCountA(){
      this.$store.commit('incrementA',{count:10})
    },
    asyncCountA(){
      this.$store.dispatch('asyncIncrementA',{count:16})
    },
    changeCountB(){
      this.$store.commit('incrementB',{count:20})
    },
    asyncCountB(){
      this.$store.dispatch('asyncIncrementB',{count:12})
    },
  }
}
</script>
