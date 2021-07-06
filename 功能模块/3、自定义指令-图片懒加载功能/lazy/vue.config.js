module.exports = {
    module: {
        // require
        unknownContextRegExp: /$^/,
        unknownContextCritical: false,

        // require(expr)
        exprContextRegExp: /$^/,
        exprContextCritical: false,

        // require("prefix" + expr + "surfix")
        wrappedContextRegExp: /$^/,
        wrappedContextCritical: false
    },
    devServer: {
        open: true,
        port: 8081
    }
}