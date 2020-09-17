# 19-Rollup

[10 分钟快速入门 Rollup](https://www.imooc.com/article/262083)

### Rollup 入门。

### input 入口 (webpack-entry)

### output 出口

file 路径+生成文件名称。

name 生成库挂载全局变量。(webpack-library)

format 生成库格式。(webpack-libraryTarget)

### external

排除第三方包打包，仍然是引入方式并不打包第三方包的源代码(webpack-externals)

### plugins

@rollup/plugin-node-resolve 默认 rollup 不引入任何第三方包打包，使用@rollup/plugin-node-resolve 插件让 rollup 引入。

    @rollup/plugin-json 识别json文件打包。

    @rollup/plugin-commonjs 识别代码中的commonjs写法，默认仅支持esm。

    @rollup/plugin-babel 配合babel-preset-env @babel-core 转译ES6代码

    rollup-plugin-terser 压缩代码。(webpack-terser-webpack-plugin)
