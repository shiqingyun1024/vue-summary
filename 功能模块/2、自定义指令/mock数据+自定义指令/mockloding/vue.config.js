module.exports = {
    devServer: {
        open:true,
        port:2030,
        // 在before中只能匹配get请求
        before(app) {
            app.get('/api/list', (req, res) => {
                res.json({
                    code: 500,
                    data: [
                        {
                            label: '语文',
                            value: '1'
                        },
                        {
                            label: '数学',
                            value: '2'
                        },
                        {
                            label: '英语',
                            value: '3'
                        },
                        {
                            label: '政治',
                            value: '4'
                        },
                        {
                            label: '历史',
                            value: '5'
                        },
                    ]
                })
            }),
            // 进行重定向，post请求重定向到get请求，浏览器中会返回302的状态
            app.post('/api/**',(req,res)=>{
                res.redirect(req.originalUrl); // 重定向到对应路径
            })
        },
        setup(app){
            app.post('/api/list',(req,res)=>{
                console.log('post请求');
                console.log(req);
                console.log(res);
                res.redirect(req.originalUrl); // 重定向到对应路径
            })
        }
    }
}