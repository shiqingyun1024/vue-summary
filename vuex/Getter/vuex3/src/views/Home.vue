<template>
  <div class="home">
    <button @click="changeNumber">changeNumber</button>
    <!-- 第一种用法 -->
    <!-- <p v-for="(number,index) in numbers" :key="index">{{number}}</p>
    </br>
    <p>上面的数字总共有：{{length}}个</p>
    </br>
    <p v-for="numberId in getNumbersById(8)" :key="numberId">{{numberId}}</p> -->

    <!-- 第二种用法 -->
    <!-- <p v-for="(number,index) in numbersFilter" :key="index">{{number}}</p>
    </br>
    <p>上面的数字总共有：{{getNumbersFilterLength}}个</p>
    </br>
    <p v-for="numberId in getNumberById(8)" :key="numberId">{{numberId}}</p> -->

    <!-- 第三种用法 -->
    <p v-for="(number,index) in numbers" :key="index">{{number}}</p>
    </br>
    <p>上面的数字总共有：{{length}}个</p>
    </br>
    <p v-for="numberId in getNumbersById(8)" :key="numberId">{{numberId}}</p>
    <p>localComputed:{{localComputed}}</p>
    
  </div>
</template>

<script>
// @ is an alias to /src
import {mapGetters} from 'vuex'

export default {
  name: 'Home',
  components: {
  },
  // 第一种用法
  // computed:mapGetters({
  //       // 可以设置别名
  //       numbers:'numbersFilter',
  //       // 可以设置别名
  //       length:'getNumbersFilterLength',
  //       // 返回的是一个函数，然后再在使用getNumbersById时传入相应的参数 getNumbersById(8)
  //       getNumbersById:'getNumberById'
  // }),
  // 第二种用法，直接传入一个数组，数组中是对应的参数名
  // computed:mapGetters(['numbersFilter','getNumbersFilterLength','getNumberById']),

  // 第三种用法，如果computed中还定义了其他的参数，和mapGetters一块混合使用
  computed:{
    localComputed(){
       return 2*3
    },
    ...mapGetters({
        // 可以设置别名
        numbers:'numbersFilter',
        // 可以设置别名
        length:'getNumbersFilterLength',
        // 返回的是一个函数，然后再在使用getNumbersById时传入相应的参数 getNumbersById(8)
        getNumbersById:'getNumberById'
    }),
    // 或者直接使用数组。
    // ...mapGetters(['numbersFilter','getNumbersFilterLength','getNumberById'])
  },
  
  methods:{
    changeNumber(){
      this.$store.commit('modifyNumbers')
    }
  }
}
</script>
