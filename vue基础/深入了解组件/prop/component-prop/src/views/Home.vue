<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- 可以像这样直接传入一个对象，然后在组件中再决定去使用里面的那些属性。 -->
    <objectProp v-bind="object" />
    <objectProp2 :object="object" />
  </div>
</template>

<script>
// @ is an alias to /src
import objectProp from '@/components/object-prop'
import objectProp2 from '@/components/object-prop2'

export default {
  name: 'Home',
  components: {
    objectProp,
    objectProp2
  },
  data(){
    return{
      object:{
        name:'Vue',
        age:8,
        id:1,
        address:'上海市'
      }
    }
  }
}
</script>
