<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input type="text" v-model="username">
    <p>{{username}}</p>
    <!-- v-model等同于下面 :value和@input，是一个语法糖-->
    <br>
    <!-- type为text -->
    <input type="text" :value="username2" @input="username2=$event.target.value">
    <p>{{username2}}</p>
     <!-- type为checkbox -->
     <input type="checkbox" id="checkbox" v-model="checked">
     <label for="checkbox">{{ checked }}</label>
     <br>
     <input type="checkbox" id="checkbox" :value="checked2" @change="checked2=$event.target.value">
     <label for="checkbox">{{ checked2 }}</label>
  </div>
</template>
<script>
export default {
  name:'about',
  data(){
    return {
      username:'',
      username2:'',
      checked:false,
      checked2:false,
    }
  }
}
</script>
