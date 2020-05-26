// const path = require('path')
// const resolve = dir => {
//     return path.join(__dirname, dir)
// }
// const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : '/'
// module.exports = {
//     baseUrl: BASE_URL,imagesRule
//     lintOnSave: true,
//     chainWebpack: config => {
//         config.resolve.alias
//             .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
//             .set('_c', resolve('src/components'))
//     },
//     // 打包时不生成.map文件
//     productionSourceMap: false
//         // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
//         // devServer: {
//         //   proxy: 'localhost:3000'
//         // }
// }
const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const zopfli = require("@gfx/zopfli");
const BrotliPlugin = require("brotli-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const Version = new Date().getTime(); //当前时间为了防止打包缓存不刷新，所以给每个js文件都加一个时间戳
module.exports = {
    //基本路径
    //baseUrl: './',//vue-cli3.3以下版本使用
    publicPath: './', //vue-cli3.3+新版本使用 默认'/'，部署应用包时的基本 URL
    outputDir: 'dist', // 'dist', 生产环境构建文件的目录
    assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
    lintOnSave: false, // eslint-loader 是否在保存的时候检查
    runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
    css: {
        //extract: true, // 是否使用css分离插件 ExtractTextPlugin
        sourceMap: false, // 开启 CSS source maps
        loaderOptions: {}, // css预设器配置项
        modules: false // 启用 CSS modules for all css / pre-processor files.
    },
    parallel: require('os').cpus().length > 1, //是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
    pwa: {},
    // 修复HMR(热更新)失效
    chainWebpack: config => {
        // 修复HMR
        config.resolve.symlinks(true);
        // 添加别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'));
        // 打包分析
        if (process.env.IS_ANALYZ) {
            config.plugin('webpack-report')
                .use(BundleAnalyzerPlugin, [{
                    analyzerMode: 'static',
                }]);
        }
        // 修改prefetch：
        config.plugin('prefetch').tap(options => {
            options[0].fileBlacklist = options[0].fileBlacklist || []
            options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
            return options
        })
    },
    // 运行时(runtime)再去从外部获取这些扩展依赖
    configureWebpack: config => {
        config.externals = {
                'vue': 'Vue',
                'element-ui': 'ELEMENT',
                'vue-router': 'VueRouter',
                'vuex': 'Vuex',
                'axios': 'axios'
            },
            config.output = {
                filename: `[name].${Version}.js`,
                chunkFilename: `[name]${Version}.js`
            }
    },
    // 比gzip体验更好的Zopfli压缩
    configureWebpack: config => {
        if (IS_PROD) {
            const plugins = [];
            plugins.push(
                new CompressionWebpackPlugin({
                    algorithm(input, compressionOptions, callback) {
                        return zopfli.gzip(input, compressionOptions, callback);
                    },
                    compressionOptions: {
                        numiterations: 15
                    },
                    minRatio: 0.99,
                    test: productionGzipExtensions
                })
            );
            plugins.push(
                new BrotliPlugin({
                    test: productionGzipExtensions,
                    minRatio: 0.99
                })
            );
            config.plugins = [
                ...config.plugins,
                ...plugins
            ];
        }
    },
    // 配置proxy跨域
    devServer: {
        // overlay: {
        //   warnings: true,
        //   errors: true
        // },
        open: false, //项目启动时是否自动打开浏览器，我这里设置为false,不打开，true表示打开
        host: '0.0.0.0',
        port: 8000,
        https: false,
        disableHostCheck: true, //webpack4.0 开启热更新
        //hotOnly: true, // 热更新
        proxy: {
            '/team': { //代理api
                //target: "http://192.168.70.119:8089/team",
                target: "http://123.56.233.135:20007/team", //服务器api地址
                changeOrigin: true, //是否跨域
                secure: false,
                // ws: true, // proxy websockets
                pathRewrite: { //重写路径
                    "^/team": '/'
                }
            }
        }
    },
    // 第三方插件配置
    pluginOptions: {
        // ...
    }
};