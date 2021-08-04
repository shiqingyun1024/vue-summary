import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import useCom from '@/untils/use'
import useCom2 from '@/untils/use2'
Vue.use(useCom,'参数')
Vue.use(useCom2,'参数2')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
