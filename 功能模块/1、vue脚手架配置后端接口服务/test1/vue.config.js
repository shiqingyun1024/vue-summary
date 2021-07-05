module.exports = {
    devServer:{
        open:true,
        port:3000,
        // 相当于node的express服务器  能够在其他所以的中间件之前执行自定义的中间件
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
}