import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
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
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue'),
    beforeEnter: (to, from, next) => {
      console.log('4、路由独享的守卫--beforeEnter');
      next();
    },
    children: [{
      path: 'child1',
      name: 'child1',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "child1" */ '@/components/child1.vue'),
      beforeEnter: (to, from, next) => {
        console.log('4、路由独享的守卫--beforeEnter');
        next();
      }
    }, {
      path: 'child2',
      name: 'child2',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "child2" */ '@/components/child2.vue'),
    }, ]
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  console.log('2、全局前置守卫--beforeEach');
  next();
})
router.beforeResolve((to, from, next) => {
  console.log('6、全局解析守卫--beforeResolve');
  next();
})
router.afterEach((to, from) => {
  console.log('7、全局后置钩子--afterEach');
})


export default router