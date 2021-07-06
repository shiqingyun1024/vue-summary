import Vue from 'vue'
import App from './App.vue'
import lazyLoad from './directive/lazyLoad/lazyLoad'

Vue.directive('lazyLoad',lazyLoad)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
