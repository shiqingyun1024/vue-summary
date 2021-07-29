<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>count:{{count}}</p>
    <button @click="increment1">increment1</button>
    <br>
    <button @click="increment2">increment2</button>
    <br>
    <button @click="increment3">increment3</button>
    <br>
    <button @click="increment4({amount:30})">increment4</button>
    <br>
    <button @click="increment5({amount:40})">increment5</button>
    <br>
    <button @click="add({amount:50})">increment6</button>
    <br>
  </div>
</template>
<script>
import{mapState,mapMutations} from 'vuex'
export default {
  name:'about',
  computed:mapState(['count']),
  methods:{
    // 第一种写法，直接传入一个参数
    increment1(){
      this.$store.commit('increment1',10)
    },
    // 第二种写法，传入一个对象，把参数放在对象中
    increment2(){
      this.$store.commit('increment2',{number:20})
    },
    // 第三种写法，对象风格的提交方式commit({})  根据需要选择传入的方式
    increment3(){
      this.$store.commit({type:'increment3',amount:20})
    },
    // 第四种写法，使用mapMutaions（用法和mapState相同）
    // 直接放在一个数组里面
    ...mapMutations([
      // 将 `this.increment4()` 映射为 `this.$store.commit('increment4',{amount:20})`
      'increment4',
      'increment5'
    ]),
    // 相当于起一个别名
    ...mapMutations({
      // 将 `this.add()` 映射为 `this.$store.commit('increment6')`
      add:'increment6'
    })
  }
}
</script>
