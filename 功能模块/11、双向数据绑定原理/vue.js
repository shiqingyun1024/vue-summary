export default class Vue{
    constructor(options){
        this.$el = document.querySelector(options.el);
        this.$data = options.data;
        this.compile();
    }
    compile(){
        console.log(this.$el.childNodes);
        console.log(this.$el);
        this.$el.childNodes.forEach(element => {
            if(element.nodeType== '1'){
                this.compile(element);
            }else if(element.nodeType== '3'){
                element.replace(/\{\{(.*?)\}\}/,match())
            }
        });
    }
}