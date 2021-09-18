export default class Vue{
    constructor(options){
        this.$el = document.querySelector(options.el);
        this.$data = options.data;
        this.$methods = options.methods;
        this.proxyData();
        this.compile(this.$el);
    }
    // 劫持data中的属性，并且给大对象赋值
    proxyData(){
        for(let key in this.$data){
            Object.defineProperty(this,key,{
                get(){
                   return this.$data[key]
                },
                set(newVal){
                    this.$data[key] = newVal

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
                if(element.childNodes.length>0){
                    this.compile(element);
                }
            }else if(element.nodeType== '3'){  // nodeType等于3是文本节点
                let reg = /\{\{(.*?)\}\}/g;
                let text = element.textContent;
                // 这一块的replace的用法很独特，很值得借鉴。match就相当于匹配的值{{str}}，vmKey就是匹配中的str，其实主要是获取str
                element.textContent = text.replace(reg,(match,vmKey)=>{
                    let key = vmKey.trim()
                    return this.$data[key]
                    //  console.log(match,vmKey);
                })
            }
        });
    }
}

class watcher{
    constructor(vm,key,){

    }
    update(){

    }
}