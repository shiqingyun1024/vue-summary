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
    children: [{
      path: 'child1/:id',
      name: 'child1',
      props: true,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "child1" */ '../components/child1.vue'),
    },{
      path: 'child2',
      name: 'child2',
      props: true,
      component: () => import(/* webpackChunkName: "child2" */ '../components/child2.vue'),
    },{
      path: 'child3',
      name: 'child3',
      props: true,
      component: () => import(/* webpackChunkName: "child3" */ '@/components/child3.vue'),
    },{
      path: 'child4',
      name: 'child4',
      // 这种方式在组件中可以直接用props:['user','members']接收
      props: {user:{id:'努力进大厂'},members:['123','456']},
      component: () => import(/* webpackChunkName: "child4" */ '@/components/child4.vue'),
    },{
      path: 'child5/:id/:title',
      name: 'child5',
      props: {id:{text:'努力进大厂'},title:'一直努力着'},
      component: () => import(/* webpackChunkName: "child5" */ '@/components/child5.vue'),
    },{
      path: 'child6',
      name: 'child6',
      // props: route=>({query:route.query.id,user:route.query.user}),
      component: () => import(/* webpackChunkName: "child6" */ '@/components/child6.vue'),
      props($route){
         return {
           id:$route.query.id,
           user:$route.query.user
         }
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
