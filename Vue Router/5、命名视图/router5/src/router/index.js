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
    children:[{
      path:'child',
      name:'child',
      components:{
        child1:() => import(/* webpackChunkName: "child1" */ '../components/child1.vue'),
        child2:() => import(/* webpackChunkName: "child2" */ '../components/child2.vue'),
        child3:() => import(/* webpackChunkName: "child3" */ '../components/child3.vue'),
      }
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
