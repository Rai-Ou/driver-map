module.exports = {
    configureWebpack: {
        externals: {
            AMap: "AMap" // 高德地图配置
        }
    },
    devServer: {
        host: "0.0.0.0",
        disableHostCheck: true,
        port: 8080,
        proxy: {
            "/api/*": {
                target: `https://drive2.xiaozhuanggx.com`,
                changeOrigin: true,
                pathRewrite: {
                    "^/api": "/"
                    // pathRewrite: {'^/api': '/'} 重写之后url为 http://192.168.1.16:8085/xxxx
                    // pathRewrite: {'^/api': '/api'} 重写之后url为 http://192.168.1.16:8085/api/xxxx
                }
            }
        }
    }
};
