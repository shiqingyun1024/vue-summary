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
      path: 'child1',
      name: 'child1',
      redirect: {name:'child3'},
      beforeEnter: (to, from, next) => {
        console.log(`child1--12345`);
        next()
      },
      component: () => import(/* webpackChunkName: "child1" */ '../components/child1.vue'),
    },{
      path: 'child2',
      name: 'child2',
      redirect: '/',
      component: () => import(/* webpackChunkName: "child2" */ '../components/child2.vue'),
    },{
      path: 'child3',
      name: 'child3',
      beforeEnter: (to, from, next) => {
        console.log(`child3--12345`);
        next()
      },
      // redirect: '/',
      component: () => import(/* webpackChunkName: "child3" */ '../components/child3.vue'),
    },{
      path: 'child4',
      name: 'child4',
      // 在about中的子路由跳转时都会执行这个函数。
      redirect: to=>{
        console.log('------重定向');
        console.log(to);
        return {name:'child5'}
      },
      component: () => import(/* webpackChunkName: "child4" */ '../components/child4.vue'),
    },{
      path: 'child5',
      name: 'child5',
      // redirect: '/',
      component: () => import(/* webpackChunkName: "child5" */ '../components/child5.vue'),
    },{
      path: 'child6',
      name: 'child6',
      // 在url中直接访问/abc，会加载组件child6，所以child6可以使用/about/child6,也可以使用/abc
      alias:'/abc',
      // redirect: '/',
      component: () => import(/* webpackChunkName: "child6" */ '../components/child6.vue'),
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
