module.exports = {
    devServer: {
        open:true,
        port:2030,
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
            })
        }
    }
}