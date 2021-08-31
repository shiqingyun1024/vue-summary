<template>
  <div>
     <p>{{name}}</p>
     <p>{{id}}</p>
     <p>{{age}}</p>
     <p>{{address}}</p>
  </div>
</template>

<script>
export default {
    props:{
        name:String,
        id:Number,
        age:Number,
        address:String
    }

}
</script>

<style>

</style>