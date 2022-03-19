"use strict";
const path = require("path");

const webpack = require("webpack");
const defaultSettings = require("./src/settings.js");
const dayjs = require("dayjs");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "云医院";
const port = 8080;

const updateVersion = `版本发布时间: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`;

module.exports = {
  devServer: {
    port: port,
    open: false,
    overlay: { warnings: false, errors: true },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: `http://127.0.0.1:${port}/mock`,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: ""
        },
        ws: false
      },
      "/dev-api": {
        target: "http://192.168.197.181:30000/api",
        // target: "http://192.168.197.101:30000/api",
        // target: "http://221.239.29.180:30000/api",
        // target: "http://192.168.198.77:8008/api",
        // target: "https://pingan.szlhyy.com.cn/his/api",
        changeOrigin: true,
        pathRewrite: { "^/dev-api": "" },
        ws: false
      },
      "/dev-api/user/login": {
        target: "http://192.168.197.102:30995",
        changeOrigin: true,
        ws: false
      },
      "/cdss": {
        // target: "https://cdss.yingxiang.pingan.com:9309",
        target: "https://pingan.szlhyy.com.cn/cdss",
        // target: "https://efilm-test.yingxiang.pingan.com:9309",
        pathRewrite: { "^/cdss": "" },
        changeOrigin: true,
        ws: false
      }
    }
  },
  publicPath: process.env.PUBLIC_PATH,
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "production",
  productionSourceMap: false,
  // process.env.VUE_APP_BASE_API === "http://221.239.29.180:30000/api"
  //   ? true
  //   : false,
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    },
    plugins: [
      // DefinePlugin 允许创建一个在编译时可以配置的全局常量
      new webpack.DefinePlugin({
        "process.env.UPDATE_VERSION": JSON.stringify(updateVersion)
      })
    ]
  },
  transpileDependencies: [/axcommon/],
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test
    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    // 代码分析
    if (process.env.use_analyzer) {
      // 分析
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }

    config.when(process.env.NODE_ENV === "development", config =>
      config.devtool("cheap-source-map")
    );

    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial"
          },
          elementUI: {
            name: "chunk-elementUI",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/styles/var.scss";
        `
      }
    }
  }
};
