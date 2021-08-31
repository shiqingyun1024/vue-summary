<template>
  <div>
     <p>{{object.name}}</p>
     <p>{{object.id}}</p>
     <p>{{object.age}}</p>
     <p>{{object.address}}</p>
  </div>
</template>

<script>
export default {
    props:{
        object:Object
    }

}
</script>

<style>

</style>