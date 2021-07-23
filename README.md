# vue-summary
vue的相关总结-- 包括vue2.x、vue3.0的学习笔记和相关的demo

### 1.深入浅出vue.js
```
《深入浅出vue.js》这本书相关的总结
```
### 功能模块
#### 1、vue脚手架配置后端接口服务（vue项目mock数据方案之一）
```
vue项目mock数据方案之一：webpack的devServer.before

在vue.config.js中的开发服务器中进行配置 before   before方法：能够在其他所以的中间件之前执行自定义的中间件
devServer:{
        open:true,
        port:3000,
        // 相当于node的express服务器，
        before(api){
            api.get('/api/goods',function(req,res){
                res.json({
                    errno:0,
                    data:{
                        goods:['牛奶','鸡蛋']
                    }
                })
            })

        }
    }
```
#### 2、自定义指令（Vue.directive('loading',loading)） v-loading
```
main.js中的
import loading from './components/loading/loading'
Vue.directive('loading',loading)
这个loading是一个对象，所以我们可以在一个文件中封装一个对象。

在loading.js中，我们可以这样定义
import loadingComponent from './loading.vue'
import Vue from 'vue'
let loading = {
    // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
   inserted(el){
     console.log(el)
     let vueComponent = Vue.extend(loadingComponent)
     let loadingDom = new vueComponent().$mount().$el
    //  这一步很精妙，把DOM绑定到el上
     el.instanceDom = loadingDom
     console.log(loadingDom);
     el.appendChild(loadingDom);
   },
  //  所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
   update(el,binding){
     if(!binding.value){
        el.removeChild(el.instanceDom)
     }
   }
}
 export default loading

```
#### 3、自定义指令-图片懒加载功能（v-lazyLoad）
```
应用了html5的IntersectionObserver这个api，如果不支持的话，监听window的scroll滚动事件。
```
#### 4、事件总线eventbus（解决兄弟组件之间的通信问题）
```
兄弟组件之间的通信手段有三种，1、通过父组件进行中转通信 2、事件总线eventbus 3、vuex

利用vue实例中的$emit(发送数据 发布 )和$on(接收数据 订阅 )这两个方法 == 发布订阅模式，这个进行总结一下

Vue.prototype.eventbus = new Vue()

child1组件中 this.eventbus.$emit('changename',this.child1name)
child2组件中  created(){
    this.eventbus.$on('changename',(name)=>{
       this.child2name = name
    })
  }
注意child2组件中this.eventbus.$on是放在created()这个钩子函数中的。

源码分析：
vm.$on 源码
function eventsMixin (Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          vm.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm
    };
}

从上边源码中可分析出：

（1）vm.$on可绑定多个事件名，前提需要以数组类型定义，多个事件名可对应同一个处理方法。vm.$on(['getName','getAge'],function(){ console.log('订阅') })  getName和getAge用的是一个回调函数

（2）实例上会有一个_events对象，对象key为$on绑定的事件名（如，getName和getAge），值为一个数组，数组里边装的是处理方法。_events:{getName:[function(){ console.log('订阅')],getAge:[function(){ console.log('订阅')]}


vm.$emit() 源码
Vue.prototype.$emit = function (event) {
      var vm = this;
      {
        // toLowerCase() 方法用于把字符串转换为小写。
        var lowerCaseEvent = event.toLowerCase();
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
          tip(
            "Event \"" + lowerCaseEvent + "\" is emitted in component " +
            (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
            "Note that HTML attributes are case-insensitive and you cannot use " +
            "v-on to listen to camelCase events when using in-DOM templates. " +
            "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
          );
        }
      }
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        var info = "event handler for \"" + event + "\"";
        for (var i = 0, l = cbs.length; i < l; i++) {
          invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
      }
      return vm
};

$emit方法 定义在Vue的原型上，在源码中只传了一个参数，事件名，为什么呢？先往下看，开始如果是开发环境，把事件名转小写，如果转小写的事件名与传进来的事件名不等 且 实例中的_events对象中有事件名对应的处理方法，会报警告，不会有结果输出，这种情况是定义在$on和$emit中的事件名不一样 或者 子组件触发一个自定义事件名与父组件绑定的自定义事件名不一致，会抛出以上警告。

继续往下走，根据传进来事件名获取到实例的_events对象中的处理方法，如果有处理方法，掉用toArray方法，把$emit第一个参数（事件名）去掉，只留下参数二（传递的参数）args，并且会把参数二转化为一个数组，toArray方法最后我会介绍，接下来循环cbs数组执行 invokeWithErrorHandling(cbs[i], vm, args, vm, info) 方法，cbs[i]：事件处理方法; ags：传递的参数。


function invokeWithErrorHandling (
    handler,
    context,
    args,
    vm,
    info
  ) {
    var res;
    try {
      res = args ? handler.apply(context, args) : handler.call(context);
      if (res && !res._isVue && isPromise(res) && !res._handled) {
        res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
        // issue #9511
        // avoid catch triggering multiple times when nested calls
        res._handled = true;
      }
    } catch (e) {
      handleError(e, vm, info);
    }
    return res
  }

  invokeWithErrorHandling方法会去判断是否有args参数，有则把参数传到事件处理方法中并执行，没有则只执行事件处理方法。


补充下：

还有一种情况是没有$on监听，子组件向父组件传值，使用$emit, 在父组件中的自定义标签中绑定子组件触发的自定义事件，触发相对应的函数，这样父组件也会拿到值，原因在于，在子组件created的时候，Vue实例中的_events对像中已经有值了，key：子组件要触发的自定义的事件名，value：对应父组件要触发的事件处理函数。=== 这个是大致的实现原理，具体的实现可以翻阅《深入浅出Vue.js》,然后进行补充。

export default {
    name:'homeSon',
    created() {
        console.log('son', this._events) // son {handleEmit: Array(1)}
    },
    methods: {
        click() {
            this.$emit('handleEmit', '1') 
        }
    }
}


toArray方法：
在Vue源码中，单独写了这么一个方法，目的：把类数组（如：arguments）或字符串转化为数组,参数二是起始位，如果传start，会从start位置开始截取，截取到最后，左开右闭，i为循环圈数，ret为数组长度是i，有个小细节，之所以要用new Array 去构造一个数组，原因是可以动态传值，且值就是构造出来的数组长度 。

将一个类似数组的对象转换为一个真正的数组。
 /**
   * Convert an Array-like object to a real Array.
   */
  function toArray (list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }

```
#### 5、$emit子组件传参，父组件接收参数的同时添加自定义参数
```
vue中子组件使用$emit传参，父组件接收参数的同时添加自定义参数，如何在父组件中获取子组件传过来的参数呢，在项目中会经常遇到这样的应用场景。
总共有两种方式
1、子组件传过来的参数只有一个时（父组件可以使用$event接收子组件传过来的参数）
子组件（child1）：this.$emit('fromChild1','我是子组件传过来的参数--child1')
父组件：<child1 @fromChild1="getChild1($event,'我是父组件中的参数--parent1')"></child1>
methods中 getChild1($event,parameter){
            console.log($event);  // 我是子组件传过来的参数--child1
            console.log(parameter); // 我是父组件中的参数--parent1
          },
2、子组件传过来的参数有多个时（父组件可以使用arguments接收子组件传过来的参数）
子组件（child2）：this.$emit("fromChild2", "我是子组件传过来的参数--child2", "我是子组件传过来的参数--child2", {"child2Obj": "我是子组件传过来的参数--child2"});
父组件：<child2 @fromChild2="getChild2(arguments,'我是父组件中的参数--parent2')"></child2>
methods中 getChild2(childParameters,parameter){
              // console.log(arguments);
              console.log(childParameters);  // ["我是子组件传过来的参数--child2", "我是子组件传过来的参数--child2", {"child2Obj": "我是子组件传过来的参数--child2"}]
              console.log(parameter);  // 我是父组件中的参数--parent2
          }
        **注意：在getChild2中不要这样使用getChild2(arguments，parameter)，因为在strict mode（严格模式）下会报错，在严格模式下 字符串”arguments”不能用作标识符（变量或函数名、参数名等）**
        arguments的位置也可以放在后面
        <child2 @fromChild2="getChild2('我是父组件中的参数--parent2'，arguments)"></child2>
        getChild2方法中的参数位置也要对应起来
        getChild2(parameter,childParameters){
              // console.log(arguments);
              console.log(childParameters);  // ["我是子组件传过来的参数--child2", "我是子组件传过来的参数--child2", {"child2Obj": "我是子组件传过来的参数--child2"}]
              console.log(parameter);  // 我是父组件中的参数--parent2
        }

2.1 子组件传过来的参数有多个时也可以采用这种形式
子组件（child3）：this.$emit("fromChild3", "我是子组件传过来的参数--child3", "我是子组件传过来的参数--child3", {"child3Obj": "我是子组件传过来的参数--child3"});
父组件：<child3 @fromChild3="getChild3('我是父组件中的参数--parent3'，...arguments)"></child3>
methods中 getChild3(...parameters){
              console.log(parameters);  // ["我是父组件中的参数--parent3", "我是子组件传过来的参数--child3", "我是子组件传过来的参数--child3", {"child3Obj": "我是子组件传过来的参数--child3"}]
          }
          **注意：这种方式接收到的参数顺序，父组件传入的参数在最前面**


```
### vue-router
```
**声明： 注意： 是自己做的特殊标记，会加上自己的语言描述，用于描述或者强调**

**注意：路由跳转可以使用<router-link></router-link>或者this.$router.push
但是一定要有路由出口<router-view></router-view>**


vue-router的实现原理

路由需要实现响应式
1、vue-router中实现数据响应式的方式是借助于vue的响应式原理，所以在理解这个知识点的时候最好是有了解vue的响应式原理的实现。
2、也正是这个原因，vue-router实现的功能，能够被vue使用。

vue插件的使用
1、实现vue-router，主要也是通过Vue的插件功能，也就是Vue.use(VueRouter),感兴趣的小伙伴，也可以先了解一下写Vue插件的过程。
2、vue-router利用Vue.mixin方式，来混入了生命周期钩子=>beforeCreate
在这个钩子中，实现了将我们创建出来的Vue实例vm的_router和_routerRoot属性的赋值。

```
#### 1、动态路由匹配
```
动态路由的使用场景：
我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用“动态路径参数”(dynamic segment) 来达到这个效果：

const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})

现在呢，像 /user/foo 和 /user/bar 都将映射到相同的路由。

一个“路径参数”使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用。于是，我们可以更新 User 的模板，输出当前用户的 ID：

**注意： 所以说动态路由也可以用于传参，用this.$route.params来获取。**

const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

例子：
/user/:username   /user/xiaohua  用this.$route.params获取到的是{ username: 'evan' }
/user/:username/post/:post_id    /user/evan/post/123  用this.$route.params获取到的是{ username: 'evan', post_id: '123' }

提醒一下，当使用路由参数时，例如从 /user/foo 导航到 /user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着组件的生命周期钩子不会再被调用。

复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch (监测变化) $route 对象：

const User = {
  template: '...',
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
    }
  }
}
或者使用 2.2 中引入的 beforeRouteUpdate 导航守卫：

const User = {
  template: '...',
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    // don't forget to call next()
  }
}

**注意：只有使用同一个组件来回跳转时，才会触发watch中的$route和beforeRouteUpdate，例如动态路由为 /user/:username    我们从/home 跳转到/user/foo后，是不会触发watch和beforeRouteUpdate
但是我们从/user/foo跳转到/user/bar时，是会触发watch和beforeRouteUpdate的，因为/user/foo和/user/bar都是复用的同一个组件---user组件。案例中我使用的是about作为复用组件**
    // 动态路径参数 以冒号开头
    { path: '/about/:id', component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')}

    // 使用watch监听$route的变化，第一次加载组件的时候不会触发
    watch:{
      $route(newValue,oldValue){
        this.id = newValue.params.id 
        console.log(newValue);  // 其实对应的是beforeRouteUpdate中的to
        console.log(oldValue);  // 其实对应的是beforeRouteUpdate中的from
      }
    }
    // 使用钩子函数 beforeRouteUpdate，第一次加载组件的时候不会触发
    beforeRouteUpdate(to,from,next){
        this.id = to.params.id
        console.log(to);  // 目标路由  要跳转到哪个路由去
        console.log(from); // 从哪个路由跳转过来的
        next()
    }

捕获所有路由或 404 Not found 路由

常规参数只会匹配被 / 分隔的 URL 片段中的字符。如果想匹配任意路径，我们可以使用通配符 (*)：

{
  // 会匹配所有路径
  path: '*'
}
{
  // 会匹配以 `/user-` 开头的任意路径
  path: '/user-*'
}

当使用通配符路由时，请确保路由的顺序是正确的，也就是说含有通配符的路由应该放在最后。路由 { path: '*' } 通常用于客户端 404 错误。如果你使用了History 模式，请确保正确配置你的服务器。

当使用一个通配符时，$route.params 内会自动添加一个名为 pathMatch 参数。它包含了 URL 通过通配符被匹配的部分：

**注意：当使用一个通配符时，$route.params 内会自动添加一个名为 pathMatch 参数，  this.$route.params.pathMatch**

// 给出一个路由 { path: '/user-*' }
this.$router.push('/user-admin')
this.$route.params.pathMatch // 'admin'
// 给出一个路由 { path: '*' }
this.$router.push('/non-existing')
this.$route.params.pathMatch // '/non-existing'

**注意：我曾经思考，动态路由怎么传参（使用query传参），其实仔细想了想，没有必要，因为动态路由可以使用动态路径参数来传参，使用this.$route.params来获取路径参数。动态路径参数的value可以是对象，数组，字符串等，所以是满足我们的要求的。**

```
#### 2、嵌套路由
```
什么是嵌套路由

实际生活中的应用界面，通常由多层嵌套的组件组合而成。同样地，URL 中各段动态路径也按某种结构对应嵌套的各层组件，例如：

/user/foo/profile                     /user/foo/posts
+------------------+                  +-----------------+
| User             |                  | User            |
| +--------------+ |                  | +-------------+ |
| | Profile      | |  +------------>  | | Posts       | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+

借助 vue-router，使用嵌套路由配置，就可以很简单地表达这种关系。

接着上节创建的 app：

<div id="app">
  <router-view></router-view>
</div>

const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [{ path: '/user/:id', component: User }]
})

**注意：<router-view>是出口，也就是组件最后都会被渲染在<router-view></router-view>中**

这里的 <router-view> 是最顶层的出口，渲染最高级路由匹配到的组件。同样地，一个被渲染组件同样可以包含自己的嵌套 <router-view>。例如，在 User 组件的模板添加一个 <router-view>：

const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}

要在嵌套的出口中渲染组件，需要在 VueRouter 的参数中使用 children 配置

**注意：如果想在 <router-view>渲染组件，一定要在VueRouter 的参数中使用 children 配置, 使用children配置，使用children配置，重要的话说三遍**

const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
**注意： children是一个数组，它里面的子路由的path千万不能加'/'，因为子路由是相对路径，如果加了'/'，就变成绝对路径了。注意子路由中，千万不能加'/'**


举两个实际应用的场景。
{
      path: '/replay',
      name: '可回溯管理',
      redirect: 'noredirect',
      component: layout,
      children: [
        // /replay/rrwebList匹配成功, // rrwebList 会被渲染在 layout 的 <router-view> 中
        { path: 'rrwebList', name: '销售页面回溯', component: () => import('./views/replay/rrwebList') },

        { path: 'versionList', name: '产品版本管理', component: () => import('./views/replay/versionList') },

        { path: 'rrwebDetail', name: '销售页面回溯', component: () => import('./views/replay/rrwebDetail') },

        { path: 'chatList', name: '在线服务回溯', component: () => import('./views/replay/chatList') }
      ]
},


 // 客户信息查询
    {
      path: '/customerInfo',
      name: '客户信息查询',
      component: layout,
      children: [
        // 访问客户查询的路径 可以是/customerInfo，也可以是/customerInfo/，因为子路由的path是为空的，所以customer会被渲染在 layout 的 <router-view> 中
        { path: '', name: '', component: () => import('../views/customerInfo/customer') }
      ]
    },
    // 医院信息查询
    {
      path: '/hospitalInfo',
      name: '医院信息查询',
      component: layout,
      children: [
        { path: '', name: '', component: () => import('../views/hospitalInfo/hospital') }
      ]
    },
    // 共享文件
    {
      path: '/shareFile',
      name: '共享文件',
      component: layout,
      children: [
        { path: '', name: '', component: () => import('../views/shareFile/shareFile') }
      ]
    }


要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径。

你会发现，children 配置就是像 routes 配置一样的路由配置数组，所以呢，你可以嵌套多层路由。

此时，基于上面的配置，当你访问 /user/foo 时，User 的出口是不会渲染任何东西，这是因为没有匹配到合适的子路由。如果你想要渲染点什么，可以提供一个 空的 子路由：

const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      children: [
        // 当 /user/:id 匹配成功，
        // UserHome 会被渲染在 User 的 <router-view> 中
        { path: '', component: UserHome }

        // ...其他子路由
      ]
    }
  ]
})

```
#### 3、编程式导航
```
除了使用 <router-link> 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。

router.push(location, onComplete?, onAbort?)

注意：在 Vue 实例内部，你可以通过 $router 访问路由实例。因此你可以调用 this.$router.push。

想要导航到不同的 URL，则使用 router.push 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。

**注意：思考一下这里push的原理是什么？向 history 栈添加一个新的记录，是不是用的H5的pushState方法呢**

当你点击 <router-link> 时，这个方法会在内部调用，所以说，点击 <router-link :to="..."> 等同于调用 router.push(...)。

声明式：<router-link :to="...">	  ---- 两种方式 1、<router-link :to="/user/foo">	 2、<router-link :to="{name: 'foo'}">（这种方式使用的是别名，修改路径后没有影响，所以推荐使用这种方式）
编程式：router.push(...)


该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如

// 字符串 /home
router.push('home')

// 对象  /home
router.push({ path: 'home' })

// 命名的路由   --> /user/123
router.push({ name: 'user', params: { userId: '123' }})

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})

**注意：可以这样记忆，push里面是字符串或者对象，path对应query（查询），这两个单词的首字母 pq 正好相反，非常好记，这个用this.$route.query来获取查询参数。name对应params（参数）命名路由后面跟路径，这个可以用this.$route.params获取。**


注意：如果提供了 path，params 会被忽略，上述例子中的 query 并不属于这种情况。取而代之的是下面例子的做法，你需要提供路由的 name 或手写完整的带有参数的 path：

const userId = '123'
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
// 这里的 params 不生效   使用name时才生效，注意，使用path时，后面是query，带的是查询参数。
router.push({ path: '/user', params: { userId }}) // -> /user

同样的规则也适用于 router-link 组件的 to 属性。
**注意：同样的规则也适用于 router-link 组件的 to 属性。**
router-link的规则如下：

    <!-- 字符串 字符串可以直接用to属性 -->
    <router-link to="/about/child1">child1页面--字符串直接跳转</router-link> </br>

    <!-- 字符串 使用 v-bind 的js表达式 可以省略v-bind 记住一定要使用v-bind进行绑定，否则不会生效-->
    <router-link :to="'/about/child2'">child2页面--v-bind的js表达式-字符串</router-link> </br>

    <!-- path 使用 v-bind 的js对象 可以省略v-bind 记住一定要使用v-bind进行绑定，否则不会生效 -->
    <router-link :to="{path :'child3'}">child3页面--v-bind的js表达式-对象(包含path)</router-link> </br>

    <!-- path和query 使用 v-bind 的js对象 可以省略v-bind 记住一定要使用v-bind进行绑定，否则不会生效 -->
    <router-link :to="{path :'child4',query:{user:'4'}}">child4页面--v-bind的js表达式-对象(包含path和查询参数query)</router-link> </br>

    <!-- name 使用命名路由  使用 v-bind 的js对象 可以省略v-bind 记住一定要使用v-bind进行绑定，否则不会生效 -->
    <router-link :to="{name :'child5'}">child5页面--v-bind的js表达式-对象(包含命名路由)</router-link> </br>

    <!-- name和params 使用命名路由并使用params传参  使用 v-bind 的js对象 可以省略v-bind 记住一定要使用v-bind进行绑定，否则不会生效 -->
    <router-link :to="{name :'child6',params:{user:'6'}}">child6页面--v-bind的js表达式-对象(包含命名路由和params参数)</router-link>

**注意：上面的child6对应的是 路由设置是嵌套路由里面设置动态路由，
    {
      path: 'child6/:user',
      name: 'child6',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "child2" */ '../components/child6.vue'),
    }
**

```
#### 4、命名路由
```
有时候，通过一个名称来标识一个路由显得更方便一些，特别是在链接一个路由，或者是执行一些跳转的时候。你可以在创建 Router 实例的时候，在 routes 配置中给某个路由设置名称。

**注意：使用命名路由，就避免了因为path变更，要更改组件中的router-link或者push中的路径，path经常变更，但是命名路由不经常变更**

// 下面的例子是把命名路由和动态路由相结合
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})

要链接到一个命名路由，可以给 router-link 的 to 属性传一个对象：

<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
这跟代码调用 router.push() 是一回事：

router.push({ name: 'user', params: { userId: 123 } })
这两种方式都会把路由导航到 /user/123 路径。

```
#### 5、命名视图
```
**注意：命名视图有很多实际应用场景，而且对我来说也是一个解决展示多个视图的新思路**
有时候想同时 (同级) 展示多个视图，而不是嵌套展示，例如创建一个布局，有 sidebar (侧导航) 和 main (主内容) 两个视图，这个时候命名视图就派上用场了。你可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 router-view 没有设置名字，那么默认为 default。
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>

一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 components 配置 (带上 s)：
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})

嵌套命名视图

我们也有可能使用命名视图创建嵌套视图的复杂布局。这时你也需要命名用到的嵌套 router-view 组件。我们以一个设置面板为例：

/settings/emails                                       /settings/profile
+-----------------------------------+                  +------------------------------+
| UserSettings                      |                  | UserSettings                 |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
| | Nav | UserEmailsSubscriptions | |  +------------>  | | Nav | UserProfile        | |
| |     +-------------------------+ |                  | |     +--------------------+ |
| |     |                         | |                  | |     | UserProfilePreview | |
| +-----+-------------------------+ |                  | +-----+--------------------+ |
+-----------------------------------+                  +------------------------------+

Nav 只是一个常规组件。
UserSettings 是一个视图组件。
UserEmailsSubscriptions、UserProfile、UserProfilePreview 是嵌套的视图组件。

注意：我们先忘记 HTML/CSS 具体的布局的样子，只专注在用到的组件上。

UserSettings 组件的 <template> 部分应该是类似下面的这段代码：
<!-- UserSettings.vue -->
<div>
  <h1>User Settings</h1>
  <NavBar/>
  <router-view/>
  <router-view name="helper"/>
</div>

嵌套的视图组件在此已经被忽略了，但是你可以在这里 (opens new window)找到完整的源代码。

然后你可以用这个路由配置完成该布局：

{
  path: '/settings',
  // 你也可以在顶级路由就配置命名视图
  component: UserSettings,
  children: [{
    path: 'emails',
    component: UserEmailsSubscriptions
  }, {
    path: 'profile',
    components: {
      default: UserProfile,
      helper: UserProfilePreview
    }
  }]
}
一个可以工作的示例的 demo 在这里 (opens new window)。
**注意：命名视图中，跳转到一个path时，可以加载多个组件，并且渲染在对应的名称位置上。**
例如：
    <router-link :to="{name:'child'}">加载子页面</router-link>
    <router-view name="child1"></router-view>
    <router-view name="child2"></router-view>
    <router-view name="child3"></router-view>
    跳转到 /child时，会同时加载child1、child2、child3这三种组件
```
#### 6、重定向和别名
```
**注意：重定向是访问/a时，直接跳转到/b，无论是组件还是url都是/b，一旦路由中设置了redirect重定向，路由中的path、name、component、beforeEnter等都没有任何作用了**
重定向也是通过 routes 配置来完成，下面例子是从 /a 重定向到 /b：

const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
const router = new VueRouter({
  routes: [
    { 
      path: '/a', 
      redirect: '/b', 
      component: () => import(/* webpackChunkName: "a" */ '../components/a.vue'),
    }
  ]
})
重定向的目标也可以是一个命名的路由：

const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})

甚至是一个方法，动态返回重定向目标：

const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
    }}
  ]
})
注意导航守卫并没有应用在跳转路由上，而仅仅应用在其目标上。在下面这个例子中，为 /a 路由添加一个 beforeEnter 守卫并不会有任何效果。

别名
“重定向”的意思是，当用户访问 /a时，URL 将会被替换成 /b，然后匹配路由为 /b，那么“别名”又是什么呢？

/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。

上面对应的路由配置为：

const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
**注意：/a加载的是组件A，/b加载的也是组件A。所以组件A，可以使用/a这个路径加载，也可以
/b加载**
“别名”的功能让你可以自由地将 UI 结构映射到任意的 URL，而不是受限于配置的嵌套路由结构。
```
#### 7、路由组件传参
```
在组件中使用 $route 会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的 URL 上使用，限制了其灵活性。

使用 props 将组件和路由解耦：

取代与 $route 的耦合
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const router = new VueRouter({
  routes: [{ path: '/user/:id', component: User }]
})
通过 props 解耦

const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },

    // 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
这样你便可以在任何地方使用该组件，使得该组件更易于重用和测试。

布尔模式
如果 props 被设置为 true，route.params 将会被设置为组件属性。
**注意：理解布尔模式：{ path: '/user/:id', component: User, props: true }中props 被设置为 true，那么组件中的props:['id'],这个props的id就是/user/:id中的id，这样就不用在组件中使用this.$route.params去获取/user/:id中的id,这样就不用在组件中使用$route了，从而使$route和组件解耦。记住，是因为在组件中不使用$route了，使用 props 将组件和路由解耦**

#对象模式
如果 props 是一个对象，它会被按原样设置为组件属性。当 props 是静态的时候有用。

const router = new VueRouter({
  routes: [
    {
      path: '/promotion/from-newsletter',
      component: Promotion,
      props: { newsletterPopup: false }
    }
  ]
})
**注意：对象模式中 
    {
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
    }
**    

#函数模式
你可以创建一个函数返回 props。这样你便可以将参数转换成另一种类型，将静态值与基于路由的值结合等等。

const router = new VueRouter({
  routes: [
    {
      path: '/search',
      component: SearchUser,
      props: route => ({ query: route.query.q })
    }
  ]
})
URL /search?q=vue 会将 {query: 'vue'} 作为属性传递给 SearchUser 组件。

**注意：用this.$route.query.q进行接收**

请尽可能保持 props 函数为无状态的，因为它只会在路由发生变化时起作用。如果你需要状态来定义 props，请使用包装组件，这样 Vue 才可以对状态变化做出反应。
```
#### 8、HTML5 History模式
```
**注意：要搞懂 HTML History模式，hash模式。弄懂原理，还有源码。以及history模式下，在后端需要的配置，以node.js为主**
vue-router 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。
如果不想要很丑的 hash，我们可以用路由的 history 模式，这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
当你使用 history 模式时，URL 就像正常的 url，例如 http://yoursite.com/user/id，也好看！

不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 http://oursite.com/user/id 就会返回 404，这就不好看了。

所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。
```
#### 8.1、前端路由的基本原理（SPA单页面应用）
```
SPA单页面应用。单页面应用指的是应用只有一个主页面，通过动态替换DOM内容并同步修改url地址，来模拟多页应用的效果。（**注意：只有一个主页面，动态替换DOM内容并同步修改url地址，来模拟多页面应用的效果**）切换页面的功能直接由前台脚本，而不是由后端渲染完毕后前端只负责显示（即浏览器中的url请求到后端，这个时候浏览器中的地址改变，不会发送请求）。SPA能够模拟多页面应用的效果，是因为前端路由机制。
前端路由，可以理解为是一个前端不同页面的状态管理器，可以不向后台发送请求而直接通过前端技术实现多个页面的效果。

两种实现方式及其原理
1、HashChange
1.1 原理
HTML页面中通过锚点定位原理可进行无刷新跳转，触发后url地址中会多出"#"+"XXX"部分，同时在全局的window对象上触发hashChange事件，这样在页面锚点哈希改变为某个预设值的时候，通过代码触发对应的页面DOM改变，就可以实现基本的路由了，基于锚点哈希的路由比较直观，也是一般前端路由插件中最常用的方式。（vue-router中默认的路由模式）

URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送；

hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制hash 的切换；
**注意：hash 值的改变，都会在浏览器的访问历史中增加一个记录。**

可以通过 a 标签，并设置 href 属性，当用户点击这个标签后，URL 的 hash 值会发生改变；或者使用 JavaScript 来对 loaction.hash 进行赋值，改变 URL 的 hash 值；

我们可以使用 hashchange 事件来监听 hash 值的变化，从而对页面进行跳转(渲染)。

1.2 应用以及源码分析
下面通过一个实例看一下
把vue-router的路由模式设置为hash模式
const router = new VueRouter({
  routes
})
把vue-router的路由模式设置为history模式
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
注意对比一下这两个用法
```


### vuex

