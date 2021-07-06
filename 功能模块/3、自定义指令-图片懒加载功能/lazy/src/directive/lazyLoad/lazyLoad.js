let lazyLoad = {
    // 当被绑定的元素插入到 DOM 中时
    // 看元素有没有在可视区域内，有这样一个浏览器的intersectionObserve api可以使用，如果不支持的话，监听scroll滚动事件。
    inserted:(el)=>{
        const intersection = new IntersectionObserver(els=>{
            els.forEach(el=>{
                if(el.isIntersecting){
                    console.log('进入可视区');
                    let elTarget = el.target;
                    let data_src = elTarget.getAttribute('data-src');
                    elTarget.src = require(data_src);
                    intersection.unobserve(elTarget)
                }
            })
            // console.log('触发懒加载');
            // console.log(el);
            // console.log(el.isIntersecting);
            
        })
        intersection.observe(el)
    }
}
export default lazyLoad