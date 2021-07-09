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
### vue-router
```
**声明： 注意： 是自己做的特殊标记，会加上自己的语言描述，用于描述或者强调**
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
但是我们从/user/foo跳转到/user/bar时，是会触发watch和beforeRouteUpdate的，因为/user/foo和/user/bar都是复用的同一个组件---user组件。**

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
### vuex

