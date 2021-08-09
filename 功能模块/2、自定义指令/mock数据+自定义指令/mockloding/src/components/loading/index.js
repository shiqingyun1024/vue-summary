import loadingCom from './loading.vue'
import Vue from 'vue'
export default {
    // 当被绑定的元素插入到 DOM 中时……  被绑定元素插入父节点时调用
  inserted(el,binding) {
    let vueLoading = Vue.extend(loadingCom);
    let loadingDom = new vueLoading().$mount().$el;
    el.instanceDom = loadingDom
    // console.log(loadingDom);
    if(binding.value){
        el.appendChild(loadingDom)
    }
    // console.log(dom);
    // 如果 Vue 实例el在实例化时没有进行$mount()挂载，它将处于“卸载”状态，没有关联的 DOM 元素。vm.$mount()可用于手动启动未挂载的 Vue 实例的挂载。是获取不到$el的。
    // console.log(dom2);
    // console.log(dom2.$el);
    // console.log(dom2.$mount());
    // console.log(dom2.$mount().$el);

  },
  update(el,binding){
      if(!binding.value){
          el.removeChild(el.instanceDom)
      }

  }
}