const path = require("path")
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {
    nodeResolve
} from '@rollup/plugin-node-resolve';
import vuePlugin from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'

// import {
//     terser
// } from "rollup-plugin-terser";




export default {
    input: path.resolve(__dirname, './src/index.js'),
    // nodeResolve 默认不进行打包引用的第三方库 使用nodeResolve插件打包第三方依赖库

    // rollup-plugin-babel 不用多说了，转化插件。类似babel-loader，仍需要配合prest-env

    // 默认rollup打包仅仅识别esm代码 使用commonjs插件让rollup识别cjs语法 
    // 存在疑问，rollup中cjs竟然也可以使用exports.xx的形式进行TreeShaking
    // 是这个插件起的作用还是？


    // @rollup/plugin-babel 转化es6代码 配合preset-env 同时需要@babel/core 其实和webpack差不多

    // @rollup/plugin-json rollup仅识别js 让它识别js打包 去看打包后的代码会将代码中json文件转化成object形式


    // rollup-plugin-terser 压缩代码 其实就是webpack中的terser-webpack-plugin
    // 不过webapck本身集成了压缩插件 rollup没有需要自己引入

    // rollup-plugin-vue 让rollup认识vue代码

    // postcss插件 使rollup识别css代码，可以识别scss/less/stylus等以及模块化都支持

    plugins: [nodeResolve(), babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
        }), commonjs(), json(), vuePlugin(),
        postcss([])
        // terser()
    ],
    // 和webpack一致 排除打包 希望外部引用 避免重复打包
    external: ["sam-test-data", "vue", "echarts"],
    output: [{
        file: path.resolve(__dirname, "./dist/index.js"),
        // 关于globals配置针对umd情况下 script引入形式的 external配置。
        // 举个例子来说把 比如项目中使用 import vue from vue，external [ 'vue' ]
        // 那么在esm 情况下 会去执行 import vue from vue
        // 但是在script标签引入下 不支持esm from vue 就会去全局变量中寻找配置赋值
        // 这里相当于 将全局的Vue赋值给from的vue模块使用
        globals: {
            vue: 'Vue'
        },
        name: "qingfengxulai", // umd下必须 其实就是webpack的library
        format: "umd"
    }, {
        file: path.resolve(__dirname, "./dist/index.es.js"),
        format: "es",
    }, {
        file: path.resolve(__dirname, "./dist/index.cjs.js"),
        format: "cjs"
    }]
}