<template>
  <div>
      <input type="check">
  </div>
</template>

<script>
export default {
    props:{
        planList:{
            type:Array,
            default:()=>{
                return []
            }
        }
    }

}
</script>

<style>

</style>