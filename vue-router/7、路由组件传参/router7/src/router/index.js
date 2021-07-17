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
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "child2" */ '../components/child2.vue'),
    },{
      path: 'child3',
      name: 'child3',
      props: true,
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "child3" */ '@/components/child3.vue'),
    },{
      path: 'child4',
      name: 'child4',
      // 这种方式传递数组。组件中接收不到member
      // props: {user:{id:'努力进大厂'},member:['123','456']},
      // 把数组放在对象中，还可以，说明组件接收的是一个user大对象
      props: {user:{id:'努力进大厂',member:['123','456']}},
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "child4" */ '@/components/child4.vue'),
    },{
      path: 'child5/:id',
      name: 'child5',
      props: {user:{id:'努力进大厂'}},
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "child5" */ '@/components/child5.vue'),
    },{
      path: 'child6',
      name: 'child6',
      props: route=>({query:route.query.id}),
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "child6" */ '@/components/child6.vue'),
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
