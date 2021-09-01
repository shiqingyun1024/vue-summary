class zbtrack {
  constructor(username) {
    this.username = username
   }

  install(Vue, params) {
    console.log('use3');
    console.log(params);
    // 在install里面可以任意调用在对象中定义的属性和方法
    console.log(this.username);
    this.talk()
  }
  talk() {
    console.log('talk3');
  }
}
export default  new zbtrack()