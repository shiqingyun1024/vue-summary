import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    beforeEnter: (to, from, next) => {
      console.log('路由独享的守卫--beforeEnter');
      next();
    }
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to,from,next)=>{
  console.log('这是全局前置守卫--beforeEach');
  next();
})
router.beforeResolve((to,from,next)=>{
  console.log('这是全局解析守卫--beforeResolve');
  next();
})
router.afterEach((to, from) => {
  console.log('这是全局后置钩子--afterEach');
})


export default router
