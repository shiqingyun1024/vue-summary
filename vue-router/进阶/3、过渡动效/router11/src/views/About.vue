<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-link :to="{name:'child1'}">go child1</router-link></br>
    <router-link :to="{name:'child2'}">go child2</router-link></br>
    <transition name="slide-fade" mode="out-in" :duration="5000">
      <router-view></router-view>
    </transition>
    </br>
    <button @click="show = !show">
    Toggle render
  </button>
  </br>
  <transition name="slide-fade">
    <p v-if="show">hello</p>
  </transition>
  </div>
</template>
<script>
export default {
  data(){
    return {
      show: true
    }
  }
}
</script>
<style lang="scss">
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
