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
    children:[
      {
        path: 'child1',
        name: 'child1',
        component: () => import(/* webpackChunkName: "child1" */ '@/components/child1.vue')
      },
      {
        path: 'child2',
        name: 'child2',
        component: () => import(/* webpackChunkName: "child2" */ '@/components/child2.vue')
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
