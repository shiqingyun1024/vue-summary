module.exports = {
    devServer:{
        open:true,
        port:3000,
        // 相当于node的express服务器
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