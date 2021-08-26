const express = require('express')
// 专门解决vue-router的history模式刷新之后页面404的问题。
const history = require('connect-history-api-fallback');
const app = express()

//将静态文件目录设置为：项目根目录+/static
app.use(express.static(__dirname+'/static'))
//或者
// app.use(express.static(path.join(__dirname, 'static')));
app.use(history())

app.get('/person',(req,res)=>{
    res.send({
        name:'tom',
        age:18
    })
})

app.listen(5005,(err)=>{
    if(!err) console.log('服务器启动成功了');
})