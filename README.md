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

**注意：<router-link></router-link>默认是push，就是直接往历史栈中增加一条数据，但是<router-link :replace='true'></router-link>，简写是<router-link replace></router-link>，这样就是在历史栈中替换当前的历史数据。**
<router-link>的replace属性
1、作用：控制路由跳转时操作浏览器历史记录的模式。
2、浏览器的历史记录有两种写入方式：分别为push和replace，push是追加历史记录，replace是替换当前记录。路由跳转时候默认为push。
3、如何开启replace模式：<router-link replace ....>News</router-link>

Vue Router 是 Vue.js (opens new window)官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。包含的功能有：

嵌套的路由/视图表
模块化的、基于组件的路由配置
路由参数、查询、通配符
基于 Vue.js 过渡系统的视图过渡效果
细粒度的导航控制
带有自动激活的 CSS class 的链接
HTML5 历史模式或 hash 模式，在 IE9 中自动降级
自定义的滚动条行为

**注意：个人理解，Vue Router就相当于生活中的路由器，上面有很多插槽，每个插槽就相当于一个路由（对应的是一个组件），路由就是一组key-value（一个插槽对应一个组件）的对应关系，多个路由，需要经过路由器的管理。 vue-router这个路由器的目的是为了实现单页面应用SPA。$router是路由器（一个项目里面只有一个，来控制那么多配置的$route），$route是路由，在routes中配置**

**注意：
几个注意点
1、路由组件通常存放在pages文件夹中，一般组件通常存放在components文件夹中。
2、通过切换，“隐藏”了的路由组件，默认是被销毁掉的，需要的时候再去挂载。
3、每个组件都有自己的$route属性，里面存储着自己的路由信息。
4、整个应用只有一个router，可以通过组件的$router属性获取到。
**

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

**注意：可以这样记忆，push里面是字符串或者对象，path对应query（查询），这两个单词的首字母 pq 正好相反，非常好记，这个用this.$route.query来获取查询参数，但是path不能对应params。name对应params（参数）命名路由后面跟路径，这个可以用this.$route.params获取，name也可以对应query，用this.$route.query来获取查询参数。**


注意：如果提供了 path，params 会被忽略，上述例子中的 query 并不属于这种情况。取而代之的是下面例子的做法，你需要提供路由的 name 或手写完整的带有参数的 path：

const userId = '123'
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
// 这里的 params 不生效   使用name时才生效，注意，使用path时，后面是query，带的是查询参数。
router.push({ path: '/user', params: { userId }}) // -> /user

    pushChild1(){
      this.$router.push('/child1')
    },
    pushChild2(){
      this.$router.push('/child2')
    },
    pushChild3(){
      this.$router.push({path:'/child3'})
    },
    pushChild4(){
      this.$router.push({path:'/child4',query:{user:'4'}})
    },
    pushChild5(){
      this.$router.push({name:'child5'})
    },
    pushChild6(){
      this.$router.push({name:'child6',params:{user:'6'}})
    },
    pushChild7(){
      this.$router.push({name:'child7',query:{user:'7'}})
    }

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

    <!-- name和query 使用命名路由并使用query传参  使用 v-bind 的js对象 可以省略v-bind 记住一定要使用v-bind进行绑定，否则不会生效 -->
    <router-link :to="{name :'child7',query:{user:'7'}}">child7页面--v-bind的js表达式-对象(包含命名路由和query参数)</router-link>

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
**注意：重定向是访问/a时，直接重定向到/b，无论是组件还是url都是/b，一旦路由中设置了redirect重定向，路由/a中的path、name、component、beforeEnter等都没有任何作用了，因为重定向到/b了，最后执行的都是/b的path、name、component、beforeEnter等**
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
**注意：组件分为一般组件和路由组件，一般组件是我们使用时，在组件中引入进来，路由组件是在router中配置的组件，在跳转的时候我们不需要再引入，因为在router中已经配置好了。一般组件都是放在components文件中，路由组件都是放在pages文件中。路由组件进行切换时，会先销毁之前的组件，然后再渲染跳转后的组件。 vue-router这个路由器的目的是为了实现单页面应用SPA。$router是路由器（一个项目里面只有一个，来控制那么多配置的$route），$route是路由，在routes中配置**

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
例如：
    {
      path: 'child2',
      name: 'child2',
      props: true,
      component: () => import(/* webpackChunkName: "child2" */ '../components/child2.vue'),
    }
使用布尔模式后，我们可以<router-link :to="{name:'child2',params:{user:{id:'1234'},members:[123]}}">go to child2</router-link>这样传参，在组件中直接用props:['user','members'] 接收

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
**注意：对象模式中传参，有一定的局限性，props传递的对象中都是写死的数据
    {
      path: 'child4',
      name: 'child4',
      // 这种方式也可以传递数组
      props: {user:{id:'努力进大厂'},member:['123','456']},
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

**注意：
总结：
1、布尔模式
如果 props 被设置为 true，route.params 将会被设置为组件属性，通过组件的props直接获取，route.params可以通过path: '/user/:id' 这种方式配置，也可以通过<router-link :to="{name:'child1',params:{id:'1234'}}">child1</router-link>这种方式配置。
2、对象模式
路由中props设置为对象，那么在组件中可以直接用props接收。路由中props: {user:{id:'努力进大厂'},members:['123','456']},组件中props:['user','members']
3、函数模式
函数模式比较灵活,返回一个对象，这样query参数也可以作为props传过去，组件中以props的形式接收。
props($route){
  return {
    id:$route.query.id,
    user:$route.query.user
  }
}
解构赋值的连续写法
props({query:{id,title}}){
  return {
    id
    user
  }
}
当然也可以直接返回一个对象
props(){
  return {
    id:'123',
    user:{name:'vue'}
  }
}
**
补充：缓存路由组件
1、作用：让不展示的路由组件保持挂载，不被销毁。
2、具体编码：
<keep-alive include="News">
   <router-view></router-view>
</keep-alive>
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

**注意：hash模式是利用hash值的改变不会引起页面的刷新，也不会去请求url，利用hashchange方法监听到hash值的变化，进而更新局部视图。即使刷新也不会有影响，因为#/后面的参数不会作为参数被浏览器发送后端服务器，所以index.html/#/home(例子)，这个就算怎么刷新请求的都是index.html这个页面，这个页面在后端静态服务器上是一直存在的，所以不会出现404的情况。**

当你使用 history 模式时，URL 就像正常的 url，例如 http://yoursite.com/user/id，也好看！
不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 http://oursite.com/user/id 就会返回 404，这就不好看了。

所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。

**注意：history模式利用的是HTML5新增的history.pushState方法，这个方法是向历史栈中新增一条历史记录，但是不会刷新页面，不会去请求url，所以可以模拟单页面应用。但是如果刷新页面或者直接在浏览器上输入这个url地址，会404，因为这个刷新的时候，index.html/home(例子)这个url(会带这home参数)是浏览器向服务器发送请求，去请求这个url路径上的信息，我们在后端静态服务器上只有index.html，但是没有index.html/home，所以需要后端在服务器上进行相应的配置，要不然就会404**

node-express-test这个demo实例对history模式出现404的原因在后端进行了配置。

路由器的两种工作模式
1、对于一个url来说，什么是hash值？----- #及其后面的内容就是hash值。 
2、hash值不会包含在HTTP请求中，即：hash值不会带给服务器。
3、hash模式：
       1、地址中永远带着#号，不美观。
       2、若以后将地址通过第三方手机App分享，若App校验严格，则地址会被标记为不合法。
       3、兼容性较好。
4、history模式：
       1、地址干净，美观。
       2、兼容性和hash模式相比略差。
       3、应用部署上线时需要后端人员支持，解决刷新页面服务端404的问题。

```
#### 8.1、前端路由的基本原理（SPA单页面应用）
```
SPA单页面应用。单页面应用指的是应用只有一个主页面，通过动态替换DOM内容并同步修改url地址，来模拟多页应用的效果。（**注意：只有一个主页面，动态替换DOM内容并同步修改url地址，来模拟多页面应用的效果**）切换页面的功能直接由前台脚本，而不是由后端渲染完毕后前端只负责显示（即浏览器中的url请求到后端，这个时候浏览器中的地址改变，不会发送请求）。SPA能够模拟多页面应用的效果，是因为前端路由机制。
前端路由，可以理解为是一个前端不同页面的状态管理器，可以不向后台发送请求而直接通过前端技术实现多个页面的效果。
实现方式有两种  1、利用hash的HashChange  2、HTML5 HistoryAPI history.pushState()
```
两种实现方式及其原理
##### 8.1.1、HashChange
```
1. 原理
HTML页面中通过锚点定位原理可进行无刷新跳转，触发后url地址中会多出"#"+"XXX"部分，同时在全局的window对象上触发hashChange事件，这样在页面锚点哈希改变为某个预设值的时候，通过代码触发对应的页面DOM改变，就可以实现基本的路由了，基于锚点哈希的路由比较直观，也是一般前端路由插件中最常用的方式。（vue-router中默认的路由模式）

URL 中 hash 值只是客户端的一种状态，也就是说当向服务器端发出请求时，hash 部分不会被发送；

hash 值的改变，都会在浏览器的访问历史中增加一个记录。因此我们能通过浏览器的回退、前进按钮控制hash 的切换；
**注意：hash 值的改变，都会在浏览器的访问历史中增加一个记录。**

可以通过 a 标签，并设置 href 属性，当用户点击这个标签后，URL 的 hash 值会发生改变；或者使用 JavaScript 来对 loaction.hash 进行赋值，改变 URL 的 hash 值；

我们可以使用 hashchange 事件来监听 hash 值的变化，从而对页面进行跳转(渲染)。

2. 应用以及源码分析
下面通过一个实例看一下
**把vue-router的路由模式设置为hash模式
const router = new VueRouter({
  routes
})
**把vue-router的路由模式设置为history模式
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
hash模式的原理：
// index.js
export default class VueRouter {
	// router初始化时写入listen的cb以便更新最新的route数据
	init(app: any /* Vue component instance */) {
		this.apps.push(app)
		const history = this.history
		history.listen(route => {
		  // route数据修改时，对应更新vm实例上的_route数据
      	  this.apps.forEach((app) => {
            app._route = route
          })
        })
	}
	// router上的push方法代理的是history对象上的push方法
	push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
	  // 在调用push方法时如未传递onComplete，onAbort回调函数，且支持Promise则返回一个promise对象
      // $flow-disable-line
      if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
        return new Promise((resolve, reject) => {
          this.history.push(location, resolve, reject)
        })
      } else {
        this.history.push(location, onComplete, onAbort)
      }
  }
}

// hash.js
export class HashHistory extends History {
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    // 继承自History类的方法
    this.transitionTo(
      location,
      route => {
      	// 修改浏览器上的url值
        pushHash(route.fullPath)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path))
  } else {
    window.location.hash = path
  }
}

// base.js
export class History {
transitionTo (
    location: RawLocation,
    onComplete?: Function,
    onAbort?: Function
  ) {
    const route = this.router.match(location, this.current)
    // 校验此次跳转是否合法的方法
    this.confirmTransition(
      route,
      () => {
      // 更新current数据，并调用listen中写入的cb函数
        this.updateRoute(route)
        // 调用传入的完成函数，此处为hash.js中push时传入的第二个参数
        onComplete && onComplete(route)
        this.ensureURL()

        // fire ready cbs once
        if (!this.ready) {
          this.ready = true
          this.readyCbs.forEach(cb => {
            cb(route)
          })
        }
      },
      err => {
      // 错误处理回调
      }
    )
  }
}

那么现在可以来看router在hash模式下一次push会发生的过程了：
init -> router.push() -> hashHistory.push() -> History.transitionTo() -> History.updateRoute() -> History.cb() 
// listen时传入的cb，遍历this.apps中每一个vm实例更新_route数据，触发vm的render函数更新视图

**注意：window.location.replace是直接替换，在历史记录中不会新增历史记录。window.location.href是跳转到另外一个页面，相当于是在历史记录中新增一条记录**
```
##### 8.1.2、HTML5 HistoryAPI
```
1. 原理

HTML5的History API为浏览器的全局history对象增加的扩展方法。一般用来解决ajax请求无法通过回退按钮回到请求前状态的问题。

在HTML4中，已经支持window.history对象来控制页面历史记录跳转，常用的方法包括：

- history.forward(); //在历史记录中前进一步
- history.back(); //在历史记录中后退一步
- history.go(n): //在历史记录中跳转n步骤，n=0为刷新本页,n=-1为后退一页。

在HTML5中，window.history对象得到了扩展，新增的API包括：

- history.pushState(data[,title][,url]);//向历史记录中追加一条记录
- history.replaceState(data[,title][,url]);//替换当前页在历史记录中的信息。
- history.state;//是一个属性，可以得到当前页的state信息。
- window.onpopstate;//是一个事件，在点击浏览器后退按钮或js调用forward()、back()、go()时触发。监听函数中可传入一个event对象，event.state即为通过pushState()或replaceState()方法传入的data参数。

2. 应用
浏览器访问一个页面时，当前地址的状态信息会被压入历史栈,当调用history.pushState()方法向历史栈中压入一个新的state后，历史栈顶部的指针是指向新的state的。可以将其作用简单理解为 假装已经修改了url地址并进行了跳转 ,除非用户点击了浏览器的前进,回退,或是显式调用HTML4中的操作历史栈的方法，否则不会触发全局的popstate事件。
```
### 进阶
#### 9、导航守卫
```
正如其名，vue-router 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。有多种机会植入路由导航过程中：全局的, 单个路由独享的, 或者组件级的。
路由守卫
1、作用：对路由进行权限控制
2、分类：全局守卫（beforeEach,beforeResolve,afterEach,）、独享守卫(beforeEnter)、组件内守卫(beforeRouteLeave,beforeRouteEnter,beforeRouteUpdate)
```
#### 9.1、全局前置守卫
```
**注意：全局前置路由守卫----初始化的时候被调用，每次路由切换之前被调用。**
你可以使用 router.beforeEach 注册一个全局前置守卫：

const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 等待中。

每个守卫方法接收三个参数：

- to: Route: 即将要进入的目标 路由对象

- from: Route: 当前导航正要离开的路由

- next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。

- next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。

- next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。

- next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在 router-link 的 to prop 或 router.push 中的选项。

- next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。

确保 next 函数在任何给定的导航守卫中都被严格调用一次。它可以出现多于一次，但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错。这里有一个在用户未能验证身份时重定向到 /login 的示例：

// BAD 错误的用法
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // 如果用户未能验证身份，则 `next` 会被调用两次
  next()
})
// GOOD 正确的用法
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```
#### 9.2、全局解析守卫
```
在 2.5.0+ 你可以用 router.beforeResolve 注册一个全局守卫。这和 router.beforeEach 类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用。
```
#### 9.3、全局后置钩子
```
**注意：全局前置路由守卫----初始化的时候被调用，每次路由切换之后被调用。 它没有next参数**
你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身：

router.afterEach((to, from) => {
  // ...
})
```
#### 9.4、路由独享的守卫
```
**注意：个人理解，之所以设置独享守卫，是因为我们有时候需要对单独的某个路由做处理，如果用全局守卫beforeEach，那每个路由都会做判断处理，这样就没有必要了。所以我们直接对要做处理的这个路由做单独处理更好。于是就有了路由独享守卫beforeEnter。**
你可以在路由配置上直接定义 beforeEnter 守卫：

const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
这些守卫与全局前置守卫的方法参数是一样的。
```
#### 9.5、组件内的守卫
```
最后，你可以在路由组件内直接定义以下路由导航守卫：

- beforeRouteEnter
- beforeRouteUpdate (2.2 新增)
- beforeRouteLeave

const Foo = {
  template: `...`,
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}

beforeRouteEnter 守卫 不能 访问 this，因为守卫在导航确认前被调用，因此即将登场的新组件还没被创建。

不过，你可以通过传一个回调给 next来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
注意 beforeRouteEnter 是支持给 next 传递回调的唯一守卫。对于 beforeRouteUpdate 和 beforeRouteLeave 来说，this 已经可用了，所以不支持传递回调，因为没有必要了。

beforeRouteUpdate (to, from, next) {
  // just use `this`
  this.name = to.params.name
  next()
}
这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 next(false) 来取消。
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}

```
#### 9.6、完整的导航解析流程
```
1、导航被触发。
2、在失活的组件里调用 beforeRouteLeave 守卫。    组件内的守卫 beforeRouteLeave
3、调用全局的 beforeEach 守卫。      全局前置守卫 beforeEach
4、在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。  组件内的守卫 beforeRouteUpdate
5、在路由配置里调用 beforeEnter。  路由独享的守卫  beforeEnter
6、解析异步路由组件。
7、在被激活的组件里调用 beforeRouteEnter。  组件内的守卫 beforeRouteEnter
8、调用全局的 beforeResolve 守卫 (2.5+)。   全局解析守卫  beforeResolve
9、导航被确认。
10、调用全局的 afterEach 钩子。  全局后置钩子  afterEach
11、触发 DOM 更新。
12、调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。 
**注意：beforeRouteEnter 是支持给 next 传递回调的唯一守卫。 传递的回调函数最后才会执行。**
```
#### 10、路由元信息
```
定义路由的时候可以配置 meta 字段
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

那么如何访问这个 meta 字段呢？

首先，我们称呼 routes 配置中的每个路由对象为 路由记录。路由记录可以是嵌套的，因此，当一个路由匹配成功后，他可能匹配多个路由记录

例如，根据上面的路由配置，/foo/bar 这个 URL 将会匹配父路由记录以及子路由记录。

一个路由匹配到的所有路由记录会暴露为 $route 对象 (还有在导航守卫中的路由对象) 的 $route.matched 数组。因此，我们需要遍历 $route.matched 来检查路由记录中的 meta 字段。

下面例子展示在全局导航守卫中检查元字段：

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

获取的话也可以用to.meta，在组件中也可以这样用to.meta来获取元信息
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
```
#### 11、过渡动效
```
<router-view> 是基本的动态组件，所以我们可以用 <transition> 组件给它添加一些过渡效果：

<transition>
  <router-view></router-view>
</transition>
Transition 的所有功能 (opens new window)在这里同样适用。

单个路由的过渡
上面的用法会给所有路由设置一样的过渡效果，如果你想让每个路由组件有各自的过渡效果，可以在各路由组件内使用 <transition> 并设置不同的 name。

const Foo = {
  template: `
    <transition name="slide">
      <div class="foo">...</div>
    </transition>
  `
}

const Bar = {
  template: `
    <transition name="fade">
      <div class="bar">...</div>
    </transition>
  `
}
#基于路由的动态过渡
还可以基于当前路由与目标路由的变化关系，动态设置过渡效果：

<!-- 使用动态的 transition name -->
<transition :name="transitionName">
  <router-view></router-view>
</transition>
// 接着在父组件内
// watch $route 决定使用哪种过渡
watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  }
}

transition详细的参数配置请见：https://cn.vuejs.org/v2/guide/transitions.html

```
#### 12、数据获取
```
有时候，进入某个路由后，需要从服务器获取数据。例如，在渲染用户信息时，你需要从服务器获取用户的数据。我们可以通过两种方式来实现：

导航完成之后获取：先完成导航，然后在接下来的组件生命周期钩子中获取数据。在数据获取期间显示“加载中”之类的指示。

导航完成之前获取：导航完成前，在路由进入的守卫中获取数据，在数据获取成功后执行导航。

从技术角度讲，两种方式都不错 —— 就看你想要的用户体验是哪种。

导航完成后获取数据
当你使用这种方式时，我们会马上导航和渲染组件，然后在组件的 created 钩子中获取数据。这让我们有机会在数据获取期间展示一个 loading 状态，还可以在不同视图间展示不同的 loading 状态。

假设我们有一个 Post 组件，需要基于 $route.params.id 获取文章数据：
<template>
  <div class="post">
    <div v-if="loading" class="loading">
      Loading...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="post" class="content">
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null
    }
  },
  created () {
    // 组件创建完后获取数据，
    // 此时 data 已经被 observed 了
    this.fetchData()
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      // replace getPost with your data fetching util / API wrapper
      getPost(this.$route.params.id, (err, post) => {
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    }
  }
}

在导航完成前获取数据
通过这种方式，我们在导航转入新的路由前获取数据。我们可以在接下来的组件的 beforeRouteEnter 守卫中获取数据，当数据获取成功后只调用 next 方法。

export default {
  data () {
    return {
      post: null,
      error: null
    }
  },
  beforeRouteEnter (to, from, next) {
    getPost(to.params.id, (err, post) => {
      next(vm => vm.setData(err, post))
    })
  },
  // 路由改变前，组件就已经渲染完了
  // 逻辑稍稍不同
  beforeRouteUpdate (to, from, next) {
    this.post = null
    getPost(to.params.id, (err, post) => {
      this.setData(err, post)
      next()
    })
  },
  methods: {
    setData (err, post) {
      if (err) {
        this.error = err.toString()
      } else {
        this.post = post
      }
    }
  }
}

在为后面的视图获取数据时，用户会停留在当前的界面，因此建议在数据获取期间，显示一些进度条或者别的指示。如果数据获取失败，同样有必要展示一些全局的错误提醒。

在导航完成前获取数据
beforeRouteEnter (to, from, next) {
    getPost(to.params.id, (err, post) => {
      next(vm => vm.setData(err, post))
    })
},

```
#### 13、滚动行为
```
使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。 vue-router 能做到，而且更好，它让你可以自定义路由切换时页面如何滚动。

**注意: 这个功能只在支持 history.pushState 的浏览器中可用。在vue-router中的hash和history模式下都可以用**

当创建一个 Router 实例，你可以提供一个 scrollBehavior 方法：
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  }
})
scrollBehavior 方法接收 to 和 from 路由对象。第三个参数 savedPosition 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。

这个方法返回滚动位置的对象信息，长这样：
{ x: number, y: number }
{ selector: string, offset? : { x: number, y: number }} (offset 只在 2.6.0+ 支持)
如果返回一个 falsy (译者注：falsy 不是 false，参考这里 (opens new window))的值，或者是一个空对象，那么不会发生滚动。
举例：
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}

对于所有路由导航，简单地让页面滚动到顶部。

返回 savedPosition，在按下 后退/前进 按钮时，就会像浏览器的原生表现那样：

scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}

如果你要模拟“滚动到锚点”的行为：

scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
    }
  }
}
我们还可以利用路由元信息更细颗粒度地控制滚动。

异步滚动
你也可以返回一个 Promise 来得出预期的位置描述：

scrollBehavior (to, from, savedPosition) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ x: 0, y: 0 })
    }, 500)
  })
}
将其挂载到从页面级别的过渡组件的事件上，令其滚动行为和页面过渡一起良好运行是可能的。但是考虑到用例的多样性和复杂性，我们仅提供这个原始的接口，以支持不同用户场景的具体实现。

平滑滚动
只需将 behavior 选项添加到 scrollBehavior 内部返回的对象中，就可以为支持它的浏览器 (opens new window)启用原生平滑滚动：

scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash,
      behavior: 'smooth',
    }
  }
}
** 注意
vue中url为http://localhost:5016/#/about
{name: "About", meta: {…}, path: "/about", hash: "", query: {…}, …}
fullPath: "/about"
hash: ""
matched: [{…}]
meta: {}
name: "About"
params: {}
path: "/about"
query: {}
__proto__: Object
从上面可以看出，hash是为空的，为什么？
如果用location.hash获取，值为#/about
location是对整个路由进行判定，而路由信息对象是对其fullPath进行判定的，fullPath为"/about"，里面不含#，所以hash为空，如果fullPath为"/about#print"，则路由信息对象中的hash为#print。
设置hash的方法
#代表网页中的一个位置，其右边的字符，就是该位置的标识符。比如

http://www.example.com/index.html#print
就是代表index.html中的print位置。浏览器会自动把print位置滚动到页面可视区域内。

设置方法：

step1：设置一个锚点<a href="#print">定位到print位置</a>

step2：在页面需要定位的内容加上id="print"。例如：<div id="print"></div>

测试：step1设置的锚点，step2中id为print的内容会滚动到页面顶端（可观察滚动条的距离）。同时，页面的url末端中会出现#print的哈希值。
**
```
#### 14、路由懒加载
```
当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

结合 Vue 的异步组件 (opens new window)和 Webpack 的代码分割功能 (opens new window)，轻松实现路由组件的懒加载。

首先，可以将异步组件定义为返回一个 Promise 的工厂函数 (该函数返回的 Promise 应该 resolve 组件本身)：
const Foo = () =>
  Promise.resolve({
    /* 组件定义对象 */
  })
第二，在 Webpack 2 中，我们可以使用动态 import (opens new window)语法来定义代码分块点 (split point)：

import('./Foo.vue') // 返回 Promise
注意
如果您使用的是 Babel，你将需要添加 syntax-dynamic-import (opens new window)插件，才能使 Babel 可以正确地解析语法。
结合这两者，这就是如何定义一个能够被 Webpack 自动代码分割的异步组件。

const Foo = () => import('./Foo.vue')
在路由配置中什么都不需要改变，只需要像往常一样使用 Foo：

const router = new VueRouter({
  routes: [{ path: '/foo', component: Foo }]
})
把组件按组分块
有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 命名 chunk (opens new window)，一个特殊的注释语法来提供 chunk name (需要 Webpack > 2.4)。

const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
Webpack 会将任何一个异步模块与相同的块名称组合到相同的异步块中。
```
#### 15、导航故障
```
译者注
导航故障，或者叫导航失败，表示一次失败的导航，原文叫 navigation failures，本文统一采用导航故障。
当使用 router-link 组件时，Vue Router 会自动调用 router.push 来触发一次导航。 虽然大多数链接的预期行为是将用户导航到一个新页面，但也有少数情况下用户将留在同一页面上：

用户已经位于他们正在尝试导航到的页面
一个导航守卫通过调用 next(false) 中断了这次导航
一个导航守卫抛出了一个错误，或者调用了 next(new Error())
当使用 router-link 组件时，这些失败都不会打印出错误。然而，如果你使用 router.push 或者 router.replace 的话，可能会在控制台看到一条 "Uncaught (in promise) Error" 这样的错误，后面跟着一条更具体的消息。让我们来了解一下如何区分导航故障。
检测导航故障
导航故障是一个 Error 实例，附带了一些额外的属性。要检查一个错误是否来自于路由器，可以使用 isNavigationFailure 函数：
import VueRouter from 'vue-router'
const { isNavigationFailure, NavigationFailureType } = VueRouter

// 正在尝试访问 admin 页面
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    // 向用户显示一个小通知
    showToast('Login in order to access the admin panel')
  }
})
提示

如果你忽略第二个参数：isNavigationFailure(failure)，那么就只会检查这个错误是不是一个导航故障。
NavigationFailureType
NavigationFailureType 可以帮助开发者来区分不同类型的导航故障。有四种不同的类型：

redirected：在导航守卫中调用了 next(newLocation) 重定向到了其他地方。
aborted：在导航守卫中调用了 next(false) 中断了本次导航。
cancelled：在当前导航还没有完成之前又有了一个新的导航。比如，在等待导航守卫的过程中又调用了 router.push。
duplicated：导航被阻止，因为我们已经在目标位置了。

导航故障的属性
所有的导航故障都会有 to 和 from 属性，分别用来表达这次失败的导航的目标位置和当前位置。

// 正在尝试访问 admin 页面
router.push('/admin').catch(failure => {
  if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
    failure.to.path // '/admin'
    failure.from.path // '/'
  }
})
在所有情况下，to 和 from 都是规范化的路由位置。
```
#### 16、keep-alive缓存路由组件
```
动态组件、路由组件和组件内的元素(例如input)都可以使用
主要用于保留组件状态或避免重新渲染。
一、缓存路由组件
1、作用：让不展示的路由组件保持挂载，不被销毁。
2、具体编码：
<keep-alive include="News">
   <router-view></router-view>
</keep-alive>

keep-alive的props

include - 字符串或正则表达式。只有名称匹配的组件会被缓存。
exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。 exclude的优先级大于include
max - 数字。最多可以缓存多少组件实例。

keep-alive缓存组件，独有的两个生命周期钩子：activated(激活) 和 deactivated(失活)
两个新的生命周期钩子
1、作用：路由组件所独有的两个钩子，用于捕获路由组件的激活状态。
2、具体名字：
   - activated路由组件被激活时触发。
   - deactivated路由组件失活时触发。

**注意：只有keep-alive包裹的组件才会有这两个生命周期钩子函数，如果没有被包裹，则组件中的这两个生命周期不执行。组件初次渲染的时候，created，mounted，activated等生命周期钩子都会执行，但是当再次进入的时候只会触发activated钩子函数，离开的时候只会触发deactivated这个钩子函数。**
   
include 和 exclude prop 允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示：
二、缓存动态组件（规则同样适用于路由组件）
<!-- 逗号分隔字符串 -->
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>

<!-- 正则表达式 (使用 `v-bind`) -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>

<!-- 数组 (使用 `v-bind`) -->
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>
匹配首先检查组件自身的 name 选项，如果 name 选项不可用，则匹配它的局部注册名称 (父组件 components 选项的键值)。匿名组件不能被匹配。

三、缓存input元素等--即使用v-if，缓存一样生效。
<keep-alive :include="/a|b/">
  <input v-model="aliveValue" type="text" v-if="show"/>
</keep-alive>

**注意：在大型项目当中，需要缓存其中的某些页面，在路由元信息当中定义一个属性，用于控制页面是否缓存。**
```

### vuex
```
Vuex 是什么？
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

每一个 Vuex 应用的核心就是 store（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的状态 (state)。Vuex 和单纯的全局对象有以下两点不同：

1、Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

2、你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

现在，你可以通过 store.state 来获取状态对象，以及通过 store.commit 方法触发状态变更：

store.commit('increment')

console.log(store.state.count) // -> 1

为了在 Vue 组件中访问 this.$store property，你需要为 Vue 实例提供创建好的 store。Vuex 提供了一个从根组件向所有子组件，以 store 选项的方式“注入”该 store 的机制：

new Vue({
  el: '#app',
  store: store,
})

提示

如果使用 ES6，你也可以以 ES6 对象的 property 简写 (用在对象某个 property 的 key 和被传入的变量同名时)：

new Vue({
  el: '#app',
  store
})

现在我们可以从组件的方法提交一个变更：

methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}

再次强调，我们通过提交 mutation 的方式，而非直接改变 store.state.count，是因为我们想要更明确地追踪到状态的变化。这个简单的约定能够让你的意图更加明显，这样你在阅读代码的时候能更容易地解读应用内部的状态改变。此外，这样也让我们有机会去实现一些能记录每次状态改变，保存状态快照的调试工具。有了它，我们甚至可以实现如时间穿梭般的调试体验。

由于 store 中的状态是响应式的，在组件中调用 store 中的状态简单到仅需要在计算属性中返回即可。触发变化也仅仅是在组件的 methods 中提交 mutation。

```
#### 1、State
```
Vuex 使用单一状态树——是的，用一个对象就包含了全部的应用层级状态。至此它便作为一个“唯一数据源 (SSOT)”而存在。这也意味着，每个应用将仅仅包含一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

单状态树和模块化并不冲突——在后面的章节里我们会讨论如何将状态和状态变更事件分布到各个子模块中。

存储在 Vuex 中的数据和 Vue 实例中的 data 遵循相同的规则，例如状态对象必须是纯粹 (plain) 的。参考：Vue#data。

在 Vue 组件中获得 Vuex 状态
那么我们如何在 Vue 组件中展示状态呢？由于 Vuex 的状态存储是响应式的，从 store 实例中读取状态最简单的方法就是在计算属性中返回某个状态
// 创建一个 Counter 组件
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}

每当 store.state.count 变化的时候, 都会重新求取计算属性，并且触发更新相关联的 DOM。

然而，这种模式导致组件依赖全局状态单例。在模块化的构建系统中，在每个需要使用 state 的组件中需要频繁地导入，并且在测试组件时需要模拟状态。

Vuex 通过 store 选项，提供了一种机制将状态从根组件“注入”到每一个子组件中（需调用 Vue.use(Vuex)）：

const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})

**注意：把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件**

通过在根实例中注册 store 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件能通过 this.$store 访问到。让我们更新下 Counter 的实现：

const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
mapState 辅助函数
当一个组件需要获取多个状态的时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性，让你少按几次键：

// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  <!-- 第一种用法 -->
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}

当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。
<!-- 第二种用法 -->
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
]),

对象展开运算符
mapState 函数返回的是一个对象。我们如何将它与局部计算属性混合使用呢？通常，我们需要使用一个工具函数将多个对象合并为一个，以使我们可以将最终对象传给 computed 属性。但是自从有了对象展开运算符，我们可以极大地简化写法：
<!-- 第三种用法 -->
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // ...
  })
}
组件仍然保有局部状态
使用 Vuex 并不意味着你需要将所有的状态放入 Vuex。虽然将所有的状态放到 Vuex 会使状态变化更显式和易调试，但也会使代码变得冗长和不直观。如果有些状态严格属于单个组件，最好还是作为组件的局部状态。你应该根据你的应用开发需要进行权衡和确定。

**注意：总结，mapState放在computed中有三种用法，1、computed: mapState({}) 2、computed: mapState([]) 3、computed:{localComputed () { /* ... */ },...mapState({// ...})} 。最后一定要记住mapState是一个方法，接受的参数一个对象或者数组。**

// 第一种用法
  computed:mapState({
    // 可以使用箭头函数进行返回值
    count:state=>state.count,
    // 可以直接使用state中定义的字符串参数，等同于name=>state.name
    myname:'name',
    age:'age',
    height:'height',
    subjects:'subjects',
    name:'name',
    // 为了能够使用‘this’获取局部状态，必须使用常规函数
    allAge(state){
       return state.age + this.otherAge
    }
  })


// 第二种用法，当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。但是要注意，数组中一定是字符串。
computed:mapState(['count','name','age','height','subjects'])

// 第三种用法 扩展运算符 mapState里面可以放对象，也可以放数组。
  computed: {
    localComputed() {
      return "时刻努力着";
    },
    ...mapState({
      count: "count",
      age: "age",
      height: "height",
      subjects: "subjects",
      name: "name",
      myname:'name',
      allAge(state) {
        return state.age + this.otherAge;
      }
    })
  }
  或者
  // 第三种用法
  computed: {
    localComputed() {
      return "时刻努力着";
    },
    ...mapState(['count','name','age','height','subjects'])
  }
```
#### 2、Getter
```
有时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数：

computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
如果有多个组件需要用到此属性，我们要么复制这个函数，或者抽取到一个共享函数然后在多处导入它——无论哪种方式都不是很理想。

Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

**注意：getter可以理解为是 store 的计算属性，就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。主要是对state中的值做一些计算操作，然后缓存起来，只有当state中的值变化时，getter中的值才会发生变化。**

Getter 接受 state 作为其第一个参数：
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})

通过属性访问
Getter 会暴露为 store.getters 对象，你可以以属性的形式访问这些值：

store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
Getter 也可以接受其他 getter 作为第二个参数：

getters: {
  // ...
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
store.getters.doneTodosCount // -> 1

我们可以很容易地在任何组件中使用它：

computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
注意，getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的。

**注意：getters中定义的方法，第一个参数是state，第二个参数是getters(这样就可以访问getters中定义的方法)。在组件中访问的话和state一样。**

**注意：通过方法访问，这个方式很独特，但是一定要注意，如果用这种方式，每次都会去进行调用，而不会缓存结果。**
通过方法访问
你也可以通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。

getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
注意，getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果。

mapGetters 辅助函数（和mapState用法是一样）
mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}

如果你想将一个 getter 属性另取一个名字，使用对象形式：

...mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})

在组件中使用mapGetters有三种简洁的用法
  // 第一种用法
  computed:mapGetters({
        // 可以设置别名
        numbers:'numbersFilter',
        // 可以设置别名
        length:'getNumbersFilterLength',
        // 返回的是一个函数，然后再在使用getNumbersById时传入相应的参数 getNumbersById(8)
        getNumbersById:'getNumberById'
  }),

  // 第二种用法，直接传入一个数组，数组中是对应的参数名
  computed:mapGetters(['numbersFilter','getNumbersFilterLength','getNumberById']),

  // 第三种用法，使用扩展运算符， 如果computed中还定义了其他的参数，和mapGetters一块混合使用
  computed:{
    localComputed(){
       return 2*3
    },
    ...mapGetters({
        // 可以设置别名
        numbers:'numbersFilter',
        // 可以设置别名
        length:'getNumbersFilterLength',
        // 返回的是一个函数，然后再在使用getNumbersById时传入相应的参数 getNumbersById(8)
        getNumbersById:'getNumberById'
    }),
  },
  或者
  computed:{
    localComputed(){
       return 2*3
    },
    ...mapGetters(['numbersFilter','getNumbersFilterLength','getNumberById'])
  },
```
#### 3、Mutation
```
更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})

你不能直接调用一个 mutation handler。这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”要唤醒一个 mutation handler，你需要以相应的 type 调用 store.commit 方法：

store.commit('increment')

提交载荷（Payload）
**注意：注意载荷(payload)这个概念，说白了就是外界传入的参数。动态的去改state里面的值，并且从外面传入相应的参数。**
你可以向 store.commit 传入额外的参数，即 mutation 的 载荷（payload）：

// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
store.commit('increment', 10)

在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读：

// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
store.commit('increment', {
  amount: 10
})

对象风格的提交方式（这种方式比较好用一点）
提交 mutation 的另一种方式是直接使用包含 type 属性的对象：

store.commit({
  type: 'increment',
  amount: 10
})
当使用对象风格的提交方式，整个对象都作为载荷传给 mutation 函数，因此 handler 保持不变：

mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
**注意：在组件中使用时，有三种方法，方法如下：**
    // 第一种写法，直接传入一个参数
    increment1(){
      this.$store.commit('increment1',10)
    },
    // 第二种写法，传入一个对象，把参数放在对象中
    increment2(){
      this.$store.commit('increment2',{number:20})
    },
    // 第三种写法，对象风格的提交方式commit({})  根据需要选择传入的方式
    increment3(){
      this.$store.commit({type:'increment3',amount:20})
    },
    // 第四种写法，使用mapMutaions，mapMutations是一个函数，可以传入对象或者数组作为参数。（用法和mapState相同）
    // 直接放在一个数组里面
    ...mapMutations([
      // 将 `this.increment4()` 映射为 `this.$store.commit('increment4',{amount:20})`
      'increment4',
      'increment5'
    ]),
    // 第四种写法的另一种写法，传入数组
    // 相当于起一个别名
    ...mapMutations({
      // 将 `this.add()` 映射为 `this.$store.commit('increment6')`
      add:'increment6'
    })


Mutation 需遵守 Vue 的响应规则
既然 Vuex 的 store 中的状态是响应式的，那么当我们变更状态时，监视状态的 Vue 组件也会自动更新。这也意味着 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：

1、最好提前在你的 store 中初始化好所有所需属性。

2、当需要在对象上添加新属性时，你应该

- 使用 Vue.set(obj, 'newProp', 123), 或者

- 以新对象替换老对象。例如，利用对象展开运算符我们可以这样写：

state.obj = { ...state.obj, newProp: 123 }


使用常量替代 Mutation 事件类型
**注意：相当于给事件名取一个别名，然后放在一个文件中进行统一管理。**
使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
用不用常量取决于你——在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做。

Mutation 必须是同步函数
**注意：Mutation 必须是同步函数**
**注意：为什么Mutation必须是同步函数呢？ 答：官网上是这样说的，因为vuex是状态管理器，它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。如果mutation是异步函数，mutation 触发的时候，回调函数还没有被调用，不知道什么时候回调函数实际上被调用--- 实质上任何回调函数中进行的状态的改变都是不可追踪的。
个人理解：如果mutation是异步函数，那么我们是不知道异步函数什么时候会执行的，因为它被放在任务队列里面了。所以在异步函数里面，state中的值什么改变，我们是未知的，这个时候就追踪不到state中值的改变，那vuex就没法在管理所有的状态了。**
一条重要的原则就是要记住 mutation 必须是同步函数。为什么？请参考下面的例子：
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
现在想象，我们正在 debug 一个 app 并且观察 devtool 中的 mutation 日志。每一条 mutation 被记录，devtools 都需要捕捉到前一状态和后一状态的快照。然而，在上面的例子中 mutation 中的异步函数中的回调让这不可能完成：因为当 mutation 触发的时候，回调函数还没有被调用，devtools 不知道什么时候回调函数实际上被调用——实质上任何在回调函数中进行的状态的改变都是不可追踪的。

在组件中提交 Mutation
你可以在组件中使用 this.$store.commit('xxx') 提交 mutation，或者使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）。

import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
**注意：在组件中的应用如下：直接在使用时传参。
    <button @click="increment4({amount:30})">increment4</button>
    <br>
    <button @click="increment5({amount:40})">increment5</button>
    <br>
    <button @click="add({amount:50})">increment6</button>
    <br>
    // 第四种写法，使用mapMutaions（用法和mapState相同）
    // 直接放在一个数组里面
    ...mapMutations([
      // 将 `this.increment4()` 映射为 `this.$store.commit('increment4',{amount:20})`
      'increment4',
      'increment5'
    ]),
    // 相当于起一个别名
    ...mapMutations({
      // 将 `this.add()` 映射为 `this.$store.commit('increment6')`
      add:'increment6'
    })
**    

下一步：Action
在 mutation 中混合异步调用会导致你的程序很难调试。例如，当你调用了两个包含异步回调的 mutation 来改变状态，你怎么知道什么时候回调和哪个先回调呢？这就是为什么我们要区分这两个概念。在 Vuex 中，mutation 都是同步事务：

store.commit('increment')
// 任何由 "increment" 导致的状态变更都应该在此刻完成。
为了处理异步操作，让我们来看一看 Action。
```
#### Action
```
Action 类似于 mutation，不同在于：

Action 提交的是 mutation，而不是直接变更状态。
Action 可以包含任意异步操作。

**注意：1、Action 提交的是 mutation，而不是直接变更状态。2、Action 可以包含任意异步操作。**

让我们来注册一个简单的 action：
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。当我们在之后介绍到 Modules 时，你就知道 context 对象为什么不是 store 实例本身了。

**注意：这里接受的context，是一个与 store 实例具有相同方法和属性的 context 对象，因此我们可以使用context.commit提交一个mutation，context里面也包括state，getters等。**

实践中，我们会经常用到 ES2015 的 参数解构 来简化代码（特别是我们需要调用 commit 很多次的时候）：

**注意：这里的参数解构。**
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}

分发 Action
Action 通过 store.dispatch 方法触发：

store.dispatch('increment')
乍一眼看上去感觉多此一举，我们直接分发 mutation 岂不更方便？实际上并非如此，还记得 mutation 必须同步执行这个限制么？Action 就不受约束！我们可以在 action 内部执行异步操作：

actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
Actions 支持同样的载荷方式和对象方式进行分发：

// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})

**注意：在组件中这样使用的话，
  methods:{
    // 使用vuex中的Action
    changeCount(){
      // 分发Action 以载荷形式分发
      this.$store.dispatch('add',{number:10})
    },
    // 使用vuex中的Action
    changeCount2(){
      // 分发Action 以对象形式分发
      this.$store.dispatch({type:'add',number:10})
    }
  }
  在store中的index.js一定要这样使用：
  actions: {
     add(context,payLoad){
        context.commit('increment',payLoad)
     }
  }

  也就是说在actions中定义的add中一定要传入对应的参数，和我们在组件中提交mutations是一样的。在进行commit的时候传入对应的参数。**

来看一个更加实际的购物车示例，涉及到调用异步 API 和分发多重 mutation：

actions: {
  <!-- 注意：在这里也传入了参数products -->
  checkout ({ commit, state }, products) {
    // 把当前购物车的物品备份起来
    const savedCartItems = [...state.cart.added]
    // 发出结账请求，然后乐观地清空购物车
    commit(types.CHECKOUT_REQUEST)
    // 购物 API 接受一个成功回调和一个失败回调
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失败操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
注意我们正在进行一系列的异步操作，并且通过提交 mutation 来记录 action 产生的副作用（即状态变更）。

在组件中分发 Action mapActions

**注意：mapActions的用法和mapMutations的用法是一样的。**

你在组件中使用 this.$store.dispatch('xxx') 分发 action，或者使用 mapActions 辅助函数将组件的 methods 映射为 store.dispatch 调用（需要先在根节点注入 store）：
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}

**注意：在组件内的使用如下：
    <button @click="changeCount">changeCount</button>
    <br>
    <button @click="changeCount2">changeCount2</button>
    <br>
    <button @click="add3({number:100})">add3</button>
    <br>
    <button @click="add4({number:200})">add4</button>
    <br>
    <button @click="addCount({number:50})">addCount</button>
    <p>count:{{count}}</p>

  methods:{
    // 使用vuex中的Action
    changeCount(){
      // 分发Action 以载荷形式分发
      this.$store.dispatch('add',{number:10})
    },

    // 使用vuex中的Action
    changeCount2(){
      // 分发Action 以对象形式分发
      this.$store.dispatch({type:'add2',number:10})
    },

    // 将 `this.add3()` 映射为 `this.$store.dispatch('add3')`
    // `mapActions` 也支持载荷： 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ...mapActions(['add3','add4']),

    // 将 `this.addCount()` 映射为 `this.$store.dispatch('add5')`
    ...mapActions({
      addCount:'add5'
    })
  }
**

组合 Action
Action 通常是异步的，那么如何知道 action 什么时候结束呢？更重要的是，我们如何才能组合多个 action，以处理更加复杂的异步流程？

首先，你需要明白 store.dispatch 可以处理被触发的 action 的处理函数返回的 Promise，并且 store.dispatch 仍旧返回 Promise：
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}

现在你可以：
store.dispatch('actionA').then(() => {
  // ...
})

在另外一个 action 中也可以：
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}

最后，如果我们利用 async / await，我们可以如下组合 action：

// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
一个 store.dispatch 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。

**注意：可以在Action的dispatch后面跟then，因为dispatch返回的是promise
   // 使用vuex中的Action
    changeCount(){
      // 分发Action 以载荷形式分发
      this.$store.dispatch('add',{number:10}).then(()=>{
        console.log('add');
      })
    },
    // 使用vuex中的Action
    changeCount2(){
      // 分发Action 以对象形式分发
      this.$store.dispatch({type:'add2',number:10}).then(()=>{
        console.log('add2');
      })
    },
**

```

#### Module
```
由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割:

const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态

模块的局部状态
对于模块内部的 mutation 和 getter，接收的第一个参数是模块的局部状态对象。

const moduleA = {
  state: () => ({
    count: 0
  }),
  mutations: {
    increment (state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
同样，对于模块内部的 action，局部状态通过 context.state 暴露出来，根节点状态则为 context.rootState：

const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
对于模块内部的 getter，根节点状态会作为第三个参数暴露出来：

const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}

命名空间
默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。

如果希望你的模块具有更高的封装度和复用性，你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。例如：

const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: () => ({ ... }), // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
启用了命名空间的 getter 和 action 会收到局部化的 getter，dispatch 和 commit。换言之，你在使用模块内容（module assets）时不需要在同一模块内额外添加空间名前缀。更改 namespaced 属性后不需要修改模块内的代码。

#在带命名空间的模块内访问全局内容（Global Assets）
如果你希望使用全局 state 和 getter，rootState 和 rootGetters 会作为第三和第四参数传入 getter，也会通过 context 对象的属性传入 action。

若需要在全局命名空间内分发 action 或提交 mutation，将 { root: true } 作为第三参数传给 dispatch 或 commit 即可。

modules: {
  foo: {
    namespaced: true,

    getters: {
      // 在这个模块的 getter 中，`getters` 被局部化了
      // 你可以使用 getter 的第四个参数来调用 `rootGetters`
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // 在这个模块中， dispatch 和 commit 也被局部化了
      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}

在带命名空间的模块注册全局 action
若需要在带命名空间的模块注册全局 action，你可添加 root: true，并将这个 action 的定义放在函数 handler 中。例如：

{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
#带命名空间的绑定函数
当使用 mapState, mapGetters, mapActions 和 mapMutations 这些函数来绑定带命名空间的模块时，写起来可能比较繁琐：

computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  })
},
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ])
}
对于这种情况，你可以将模块的空间名称字符串作为第一个参数传递给上述函数，这样所有绑定都会自动将该模块作为上下文。于是上面的例子可以简化为：

computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
而且，你可以通过使用 createNamespacedHelpers 创建基于某个命名空间辅助函数。它返回一个对象，对象里有新的绑定在给定命名空间值上的组件绑定辅助函数：

import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // 在 `some/nested/module` 中查找
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // 在 `some/nested/module` 中查找
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
#给插件开发者的注意事项
如果你开发的插件（Plugin）提供了模块并允许用户将其添加到 Vuex store，可能需要考虑模块的空间名称问题。对于这种情况，你可以通过插件的参数对象来允许用户指定空间名称：

// 通过插件的参数对象得到空间名称
// 然后返回 Vuex 插件函数
export function createPlugin (options = {}) {
  return function (store) {
    // 把空间名字添加到插件模块的类型（type）中去
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}

模块动态注册
在 store 创建之后，你可以使用 store.registerModule 方法注册模块：

import Vuex from 'vuex'

const store = new Vuex.Store({ /* 选项 */ })

// 注册模块 `myModule`
store.registerModule('myModule', {
  // ...
})
// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
之后就可以通过 store.state.myModule 和 store.state.nested.myModule 访问模块的状态。

模块动态注册功能使得其他 Vue 插件可以通过在 store 中附加新模块的方式来使用 Vuex 管理状态。例如，vuex-router-sync 插件就是通过动态注册模块将 vue-router 和 vuex 结合在一起，实现应用的路由状态管理。

你也可以使用 store.unregisterModule(moduleName) 来动态卸载模块。注意，你不能使用此方法卸载静态模块（即创建 store 时声明的模块）。

注意，你可以通过 store.hasModule(moduleName) 方法检查该模块是否已经被注册到 store。

#保留 state
在注册一个新 module 时，你很有可能想保留过去的 state，例如从一个服务端渲染的应用保留 state。你可以通过 preserveState 选项将其归档：store.registerModule('a', module, { preserveState: true })。

当你设置 preserveState: true 时，该模块会被注册，action、mutation 和 getter 会被添加到 store 中，但是 state 不会。这里假设 store 的 state 已经包含了这个 module 的 state 并且你不希望将其覆写。

#模块重用
有时我们可能需要创建一个模块的多个实例，例如：

创建多个 store，他们公用同一个模块 (例如当 runInNewContext 选项是 false 或 'once' 时，为了在服务端渲染中避免有状态的单例)
在一个 store 中多次注册同一个模块
如果我们使用一个纯对象来声明模块的状态，那么这个状态对象会通过引用被共享，导致状态对象被修改时 store 或模块间数据互相污染的问题。

实际上这和 Vue 组件内的 data 是同样的问题。因此解决办法也是相同的——使用一个函数来声明模块状态（仅 2.3.0+ 支持）：

const MyReusableModule = {
  state: () => ({
    foo: 'bar'
  }),
  // mutation, action 和 getter 等等...
}
```
#### 项目结构
```
Vuex 并不限制你的代码结构。但是，它规定了一些需要遵守的规则：

应用层级的状态应该集中到单个 store 对象中。

提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。

异步逻辑都应该封装到 action 里面。

只要你遵守以上规则，如何组织代码随你便。如果你的 store 文件太大，只需将 action、mutation 和 getter 分割到单独的文件。

对于大型应用，我们会希望把 Vuex 相关代码分割到模块中。下面是项目结构示例：

├── index.html
├── main.js
├── api
│   └── ... # 抽取出API请求
├── components
│   ├── App.vue
│   └── ...
└── store
    ├── index.js          # 我们组装模块并导出 store 的地方
    ├── actions.js        # 根级别的 action
    ├── mutations.js      # 根级别的 mutation
    └── modules
        ├── cart.js       # 购物车模块
        └── products.js   # 产品模块
```
#### 插件
```
Vuex 的 store 接受 plugins 选项，这个选项暴露出每次 mutation 的钩子。Vuex 插件就是一个函数，它接收 store 作为唯一参数：

const myPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
  })
}
然后像这样使用：

const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})

在插件内提交 Mutation
在插件中不允许直接修改状态——类似于组件，只能通过提交 mutation 来触发变化。

通过提交 mutation，插件可以用来同步数据源到 store。例如，同步 websocket 数据源到 store（下面是个大概例子，实际上 createPlugin 方法可以有更多选项来完成复杂任务）：

export default function createWebSocketPlugin (socket) {
  return store => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
const plugin = createWebSocketPlugin(socket)

const store = new Vuex.Store({
  state,
  mutations,
  plugins: [plugin]
})

生成 State 快照
有时候插件需要获得状态的“快照”，比较改变的前后状态。想要实现这项功能，你需要对状态对象进行深拷贝：

const myPluginWithSnapshot = store => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // 比较 prevState 和 nextState...

    // 保存状态，用于下一次 mutation
    prevState = nextState
  })
}
生成状态快照的插件应该只在开发阶段使用，使用 webpack 或 Browserify，让构建工具帮我们处理：

const store = new Vuex.Store({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})
上面插件会默认启用。在发布阶段，你需要使用 webpack 的 DefinePlugin 或者是 Browserify 的 envify 使 process.env.NODE_ENV !== 'production' 为 false。

#内置 Logger 插件
如果正在使用 vue-devtools，你可能不需要此插件。

Vuex 自带一个日志插件用于一般的调试:

import createLogger from 'vuex/dist/logger'

const store = new Vuex.Store({
  plugins: [createLogger()]
})
createLogger 函数有几个配置项：

const logger = createLogger({
  collapsed: false, // 自动展开记录的 mutation
  filter (mutation, stateBefore, stateAfter) {
    // 若 mutation 需要被记录，就让它返回 true 即可
    // 顺便，`mutation` 是个 { type, payload } 对象
    return mutation.type !== "aBlocklistedMutation"
  },
  actionFilter (action, state) {
    // 和 `filter` 一样，但是是针对 action 的
    // `action` 的格式是 `{ type, payload }`
    return action.type !== "aBlocklistedAction"
  },
  transformer (state) {
    // 在开始记录之前转换状态
    // 例如，只返回指定的子树
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutation 按照 { type, payload } 格式记录
    // 我们可以按任意方式格式化
    return mutation.type
  },
  actionTransformer (action) {
    // 和 `mutationTransformer` 一样，但是是针对 action 的
    return action.type
  },
  logActions: true, // 记录 action 日志
  logMutations: true, // 记录 mutation 日志
  logger: console, // 自定义 console 实现，默认为 `console`
})
日志插件还可以直接通过 <script> 标签引入，它会提供全局方法 createVuexLogger。

要注意，logger 插件会生成状态快照，所以仅在开发环境使用。
```
#### 严格模式
```
开启严格模式，仅需在创建 store 的时候传入 strict: true：

const store = new Vuex.Store({
  // ...
  strict: true
})
在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。

#开发环境与发布环境
不要在发布环境下启用严格模式！严格模式会深度监测状态树来检测不合规的状态变更——请确保在发布环境下关闭严格模式，以避免性能损失。

类似于插件，我们可以让构建工具来处理这种情况：

const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
#### 表单处理
```
当在严格模式中使用 Vuex 时，在属于 Vuex 的 state 上使用 v-model 会比较棘手：

<input v-model="obj.message">
假设这里的 obj 是在计算属性中返回的一个属于 Vuex store 的对象，在用户输入时，v-model 会试图直接修改 obj.message。在严格模式中，由于这个修改不是在 mutation 函数中执行的, 这里会抛出一个错误。

用“Vuex 的思维”去解决这个问题的方法是：给 <input> 中绑定 value，然后侦听 input 或者 change 事件，在事件回调中调用一个方法:

<input :value="message" @input="updateMessage">
// ...
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}
下面是 mutation 函数：

// ...
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
#双向绑定的计算属性
必须承认，这样做比简单地使用“v-model + 局部状态”要啰嗦得多，并且也损失了一些 v-model 中很有用的特性。另一个方法是使用带有 setter 的双向绑定计算属性：

<input v-model="message">
// ...
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```
#### 测试
```
我们主要想针对 Vuex 中的 mutation 和 action 进行单元测试。

#测试 Mutation
Mutation 很容易被测试，因为它们仅仅是一些完全依赖参数的函数。这里有一个小技巧，如果你在 store.js 文件中定义了 mutation，并且使用 ES2015 模块功能默认输出了 Vuex.Store 的实例，那么你仍然可以给 mutation 取个变量名然后把它输出去：

const state = { ... }

// `mutations` 作为命名输出对象
export const mutations = { ... }

export default new Vuex.Store({
  state,
  mutations
})
下面是用 Mocha + Chai 测试一个 mutation 的例子（实际上你可以用任何你喜欢的测试框架）：

// mutations.js
export const mutations = {
  increment: state => state.count++
}
// mutations.spec.js
import { expect } from 'chai'
import { mutations } from './store'

// 解构 `mutations`
const { increment } = mutations

describe('mutations', () => {
  it('INCREMENT', () => {
    // 模拟状态
    const state = { count: 0 }
    // 应用 mutation
    increment(state)
    // 断言结果
    expect(state.count).to.equal(1)
  })
})
#测试 Action
Action 应对起来略微棘手，因为它们可能需要调用外部的 API。当测试 action 的时候，我们需要增加一个 mocking 服务层——例如，我们可以把 API 调用抽象成服务，然后在测试文件中用 mock 服务回应 API 调用。为了便于解决 mock 依赖，可以用 webpack 和 inject-loader 打包测试文件。

下面是一个测试异步 action 的例子：

// actions.js
import shop from '../api/shop'

export const getAllProducts = ({ commit }) => {
  commit('REQUEST_PRODUCTS')
  shop.getProducts(products => {
    commit('RECEIVE_PRODUCTS', products)
  })
}
// actions.spec.js

// 使用 require 语法处理内联 loaders。
// inject-loader 返回一个允许我们注入 mock 依赖的模块工厂
import { expect } from 'chai'
const actionsInjector = require('inject-loader!./actions')

// 使用 mocks 创建模块
const actions = actionsInjector({
  '../api/shop': {
    getProducts (cb) {
      setTimeout(() => {
        cb([ /* mocked response */ ])
      }, 100)
    }
  }
})

// 用指定的 mutations 测试 action 的辅助函数
const testAction = (action, args, state, expectedMutations, done) => {
  let count = 0

  // 模拟提交
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(mutation.type).to.equal(type)
      expect(mutation.payload).to.deep.equal(payload)
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // 用模拟的 store 和参数调用 action
  action({ commit, state }, ...args)

  // 检查是否没有 mutation 被 dispatch
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}

describe('actions', () => {
  it('getAllProducts', done => {
    testAction(actions.getAllProducts, [], {}, [
      { type: 'REQUEST_PRODUCTS' },
      { type: 'RECEIVE_PRODUCTS', payload: { /* mocked response */ } }
    ], done)
  })
})
如果在测试环境下有可用的 spy (比如通过 Sinon.JS)，你可以使用它们替换辅助函数 testAction：

describe('actions', () => {
  it('getAllProducts', () => {
    const commit = sinon.spy()
    const state = {}

    actions.getAllProducts({ commit, state })

    expect(commit.args).to.deep.equal([
      ['REQUEST_PRODUCTS'],
      ['RECEIVE_PRODUCTS', { /* mocked response */ }]
    ])
  })
})
#测试 Getter
如果你的 getter 包含很复杂的计算过程，很有必要测试它们。Getter 的测试与 mutation 一样直截了当。

测试一个 getter 的示例：

// getters.js
export const getters = {
  filteredProducts (state, { filterCategory }) {
    return state.products.filter(product => {
      return product.category === filterCategory
    })
  }
}
// getters.spec.js
import { expect } from 'chai'
import { getters } from './getters'

describe('getters', () => {
  it('filteredProducts', () => {
    // 模拟状态
    const state = {
      products: [
        { id: 1, title: 'Apple', category: 'fruit' },
        { id: 2, title: 'Orange', category: 'fruit' },
        { id: 3, title: 'Carrot', category: 'vegetable' }
      ]
    }
    // 模拟 getter
    const filterCategory = 'fruit'

    // 获取 getter 的结果
    const result = getters.filteredProducts(state, { filterCategory })

    // 断言结果
    expect(result).to.deep.equal([
      { id: 1, title: 'Apple', category: 'fruit' },
      { id: 2, title: 'Orange', category: 'fruit' }
    ])
  })
})
#执行测试
如果你的 mutation 和 action 编写正确，经过合理地 mocking 处理之后这些测试应该不依赖任何浏览器 API，因此你可以直接用 webpack 打包这些测试文件然后在 Node 中执行。换种方式，你也可以用 mocha-loader 或 Karma + karma-webpack在真实浏览器环境中进行测试。

#在 Node 中执行测试
创建以下 webpack 配置（配置好 .babelrc）:

// webpack.config.js
module.exports = {
  entry: './test.js',
  output: {
    path: __dirname,
    filename: 'test-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
然后：

webpack
mocha test-bundle.js
#在浏览器中测试
安装 mocha-loader。
把上述 webpack 配置中的 entry 改成 'mocha-loader!babel-loader!./test.js'。
用以上配置启动 webpack-dev-server。
访问 localhost:8080/webpack-dev-server/test-bundle。
#使用 Karma + karma-webpack 在浏览器中执行测试
详见 vue-loader documentation。
```
#### 热重载
```
使用 webpack 的 Hot Module Replacement API，Vuex 支持在开发过程中热重载 mutation、module、action 和 getter。你也可以在 Browserify 中使用 browserify-hmr 插件。

对于 mutation 和模块，你需要使用 store.hotUpdate() 方法：

// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import moduleA from './modules/a'

Vue.use(Vuex)

const state = { ... }

const store = new Vuex.Store({
  state,
  mutations,
  modules: {
    a: moduleA
  }
})

if (module.hot) {
  // 使 action 和 mutation 成为可热重载模块
  module.hot.accept(['./mutations', './modules/a'], () => {
    // 获取更新后的模块
    // 因为 babel 6 的模块编译格式问题，这里需要加上 `.default`
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // 加载新模块
    store.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}
参考热重载示例 counter-hot。

#动态模块热重载
如果你仅使用模块，你可以使用 require.context 来动态地加载或热重载所有的模块。

// store.js
import Vue from 'vue'
import Vuex from 'vuex'

// 加载所有模块。
function loadModules() {
  const context = require.context("./modules", false, /([a-z_]+)\.js$/i)

  const modules = context
    .keys()
    .map((key) => ({ key, name: key.match(/([a-z_]+)\.js$/i)[1] }))
    .reduce(
      (modules, { key, name }) => ({
        ...modules,
        [name]: context(key).default
      }),
      {}
    )

  return { context, modules }
}

const { context, modules } = loadModules()

Vue.use(Vuex)

const store = new Vuex.Store({
  modules
})

if (module.hot) {
  // 在任何模块发生改变时进行热重载。
  module.hot.accept(context.id, () => {
    const { modules } = loadModules()

    store.hotUpdate({
      modules
    })
  })
}
```

