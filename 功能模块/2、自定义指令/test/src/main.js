import Vue from 'vue'
import App from './App.vue'
import loading from './components/loading/loading'

// 注意loading是一个对象
Vue.directive('loading',loading)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
