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