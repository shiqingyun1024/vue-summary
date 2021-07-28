const express = require('express')
// 专门解决vue-router的history模式刷新之后页面404的问题。
const history = require('connect-history-api-fallback');
const app = express()

app.use(express.static(__dirname+'/static'))
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