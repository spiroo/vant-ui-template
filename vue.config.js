'use strict';
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // publicPath: './', // router hash 模式使用
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/', //router history模式使用 需要区分生产环境和开发环境，不然build会报错
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: '9521',
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'http://shuangshi.hitecloud.net', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 直接覆盖变量
          'text-color': '#111',
          'border-color': '#eee'
        }
      }
    }
  },

  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + ['js', 'css', 'html'].join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8
          })
        ]
      };
    }
  },

  // webpack 链接 API，用于生成和修改 webapck 配置
  // https://github.com/mozilla-neutrino/webpack-chain
  chainWebpack(config) {
    //设置别名
    config.resolve.alias.set('@', resolve('src'));

    // svg loader
    const svgRule = config.module.rule('svg'); // 找到svg-loader
    svgRule.uses.clear(); // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/); // 正则匹配排除node_modules目录
    // 添加svg新的loader处理
    svgRule
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      });

    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule('images');
    imagesRule.exclude.add(resolve('src/icons'));
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
  }
};
