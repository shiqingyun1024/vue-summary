import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requireAuth: true, name: '来自home,有权限' }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: { requireAuth: false, name: '来自about,没有权限' },
    children: [{
      path: 'child1',
      name: 'child1',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "child1" */ '@/components/child1.vue'),
      meta: { requireAuth: true, name: '来自child1,有权限' },
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  console.log(to);
  console.log(from);
  if (to.matched) {
    console.log(to.matched);
  }
  if (to.matched.some(record => record.meta.requireAuth)) {
    console.log('有权限');
  } else {
    console.log('没有权限');
  }
  next()

})


export default router
