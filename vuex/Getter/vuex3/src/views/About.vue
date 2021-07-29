<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="changeNumber">changeNumber</button>
    <p v-for="(number,index) in numbers" :key="index">{{number}}</p>
    </br>
    <p>上面的数字总共有：{{numbersFilterLength}}个</p>
    </br>
    </br>
    <p v-for="numberId in getNumbersById" :key="numberId">{{numberId}}</p>
  </div>
</template>
<script>
export default {
  name:'about',
  computed:{
    numbers(){
      console.log('computed');
      console.log(this.$store.getters.numbersFilter);  
      return this.$store.getters.numbersFilter
    },
    getNumbersById(){
      console.log(this.$store.getters.getNumberById(8));
      return this.$store.getters.getNumberById(8)
    },
    numbersFilterLength(){
      return this.$store.getters.getNumbersFilterLength
    }
  },
  methods:{
    changeNumber(){
      this.$store.commit('modifyNumbers')
    }
  }
}
</script>
