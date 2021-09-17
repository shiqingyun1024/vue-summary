export default class Vue{
    constructor(options){
        this.$el = document.querySelector(options.el);
        this.$data = options.data;
        this.compile(this.$el);
    }
    compile(node){
        node.childNodes.forEach(element => {
            if(element.nodeType== '1'&&element.childNodes.length>0){  // nodeType等于3是元素节点
                this.compile(element);
            }else if(element.nodeType== '3'){  // nodeType等于3是文本节点
                let reg = /\{\{(.*?)\}\}/g;
                let text = element.textContent;
                element.textContent = text.replace(reg,(match,vmKey)=>{
                    let key = vmKey.trim()
                    return this.$data[key]
                    //  console.log(match,vmKey);
                })
            }
        });
    }
}