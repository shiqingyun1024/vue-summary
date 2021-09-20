export default class Vue{
    constructor(options){
        this.$el = document.querySelector(options.el);
        this.$data = options.data;
        this.$methods = options.methods;
        // 存储对应的watcher，以便于视图更新。
        this.$watchEvent = {};
        this.proxyData();
        this.compile(this.$el);
        this.observer();
    }
    // 劫持data中的属性，并且给大对象赋值，这个方法主要是把data中的值直接赋值到this上。
    proxyData(){
        for(let key in this.$data){
            Object.defineProperty(this,key,{
                get(){
                   return this.$data[key]
                },
                set(newVal){
                    this.$data[key] = newVal;
                }
            })
        }
    }
    // 劫持数据的变化，以便于更新视图
    observer(){
        for(let key in this.$data){
            let value = this.$data[key];
            let that = this;
            Object.defineProperty(this.$data,key,{
                get(){
                   return value;
                },
                set(newVal){
                    value = newVal;
                    if(that.$watchEvent[key]){
                        that.$watchEvent[key].forEach((item,index)=>{
                            item.update()
                        })
                    }

                }
            })
        }
    }
    // 编译解析
    compile(node){
        node.childNodes.forEach(element => {
            if(element.nodeType== '1'){  // nodeType等于3是元素节点
                if(element.hasAttribute('@click')){
                    let key = element.getAttribute('@click')
                    // element.addEventListener('click',this.$methods[key])
                    element.addEventListener('click',(event)=>{
                        this.$methods[key].call(this,event)
                        // this.eventFn()
                    })
                }
                if(element.hasAttribute('v-model')){
                    let key = element.getAttribute('v-model')
                    element.value = this[key]
                    // element.addEventListener('click',this.$methods[key])
                    element.addEventListener('input',(event)=>{
                        this.$data[key] = element.value
                        // this.$methods[key].call(this,event)
                        // this.eventFn()
                    })
                }
                if(element.childNodes.length>0){
                    this.compile(element);
                }
            }else if(element.nodeType== '3'){  // nodeType等于3是文本节点
                let reg = /\{\{(.*?)\}\}/g;
                let text = element.textContent;
                // 这一块的replace的用法很独特，很值得借鉴。match就相当于匹配的值{{str}}，vmKey就是匹配中的str，其实主要是获取str
                element.textContent = text.replace(reg,(match,vmKey)=>{
                    let key = vmKey.trim()
                    console.log(key);
                    console.log(this);
                    console.log(this.$watchEvent);
                    if(this.hasOwnProperty(key)){
                        let watcher = new Watcher(this,key,element,'textContent');
                        this.$watchEvent[key] = this.$watchEvent[key] ? this.$watchEvent[key]:[]
                        this.$watchEvent[key].push(watcher);
                    }
                    // if(this.events.hasOwnProperty(key)){
                        return this.$data[key]
                    // }
                    //  console.log(match,vmKey);
                })
                
            }
        });
    }
}

// 来做更新视图的
class Watcher{
    constructor(vm,key,node,attr){
        // 大的对象，也就是Vue的实例
        this.vm = vm;
        // key值，也就是其中的属性值
        this.key = key;
        // 元素节点
        this.node = node;
        // 属性值
        this.attr = attr;
    }
    // 数据发生变化，视图跟着更新
    update(){
       this.node[this.attr] = this.vm[this.key];
    }
}
/* 双向数据绑定的原理，自己的描述：
*  Vue.js是采用数据劫持结合发布订阅模式，通过Object.defineProperty()来劫持各个属性的setter，getter，
*  在数据变动时发布消息给订阅者，触发相应的监听回调。主要分为以下几个步骤：
*  1、需要observer（观察）的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter，
*     这样的话，给这个对象的某个属性值赋值，就会触发setter，那么就能监听到数据的变化。
*  2、compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定
*     更新函数，添加监听数据的订阅这，一旦数据有变动，受到通知，更新视图。
*  3、Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是：(1)、在自身实例化时往属性订阅器(dep)里面添加自己。
*    (2)、自身必须有一个update()方法。(3)、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
*  4、MVVM
*
*/