const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: process.env.NODE_ENV === 'production'
        ? '/glyph_experiment_new/'
        : '/',
    // 配置完需要重启服务
    devServer: {
        proxy: {
            // 请求glyph所需数据连接
            '/glyph-data': {
                target: 'https://leisir-note-image.oss-cn-hangzhou.aliyuncs.com/data',
                pathRewrite: {
                    '^/glyph-data': ''
                },
                ws: true,
                changeOrigin: true
            }
        }
    }
})
