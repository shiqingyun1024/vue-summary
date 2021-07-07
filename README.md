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

利用vue实例中的$emit(发送数据)和$on(接收数据)这两个方法

Vue.prototype.eventbus = new Vue()

child1组件中 this.eventbus.$emit('changename',this.child1name)
child2组件中  created(){
    this.eventbus.$on('changename',(name)=>{
       this.child2name = name
    })
  }
注意child2组件中this.eventbus.$on是放在created()这个钩子函数中的。

```
