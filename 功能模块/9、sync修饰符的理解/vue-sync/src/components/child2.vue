<template>
     <div>
        <p>name:{{name}}</p>
        <p>age:{{age}}</p>
        <p>height:{{height}}</p>
        <button @click="changename">changename</button></br>
        <button @click="changeage">changeage</button></br>
        <button @click="changeheight">changeheight</button></br>
     </div>
</template>

<script>
export default {
   name:'child2',
   props:['name','age','height'],
   methods:{
     changename(){
        this.$emit('update:name','小明')
     },
     changeage(){
        this.$emit('update:age','18')
     },
     changeheight(){
        this.$emit('update:height','180')
     }
   }

}
</script>

<style>

</style>