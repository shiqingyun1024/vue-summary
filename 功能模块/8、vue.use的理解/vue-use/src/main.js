import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import useCom from '@/plugins/use'
import useCom2 from '@/plugins/use2'
import useCom3 from '@/plugins/use3'
Vue.use(useCom,'参数')
Vue.use(useCom2,'参数2')
Vue.use(useCom3,'参数3')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
