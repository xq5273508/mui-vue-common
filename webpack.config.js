/**
 * Created by xq on 17/9/20.
 */

'use strict';

const webpack = require("webpack");
const path = require("path");
const glob = require("glob");
const fs = require('fs-extra');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const isWin = /^win/.test(process.platform);

const getEntryFileContent = (entryPath, vueFilePath) => {
  let relativeVuePath = path.relative(path.join(entryPath, '../'), vueFilePath);
  if (isWin) {
    relativeVuePath = relativeVuePath.replace(/\\/g, '\\\\');
  }

  let commonJs = path.relative(path.join(entryPath, '../'), path.join(__dirname, "src/common/common.js"));
  if (isWin) {
    commonJs = commonJs.replace(/\\/g, '\\\\');
  }
  return `import Vue from "vue";
import "babel-polyfill";
import "${commonJs}";
import Component from "${relativeVuePath}";
Vue.config.productionTip = false;
// document.addEventListener("plusready",function () {
//   new Vue({
//     el: '#app',
//     render: (createElement) => createElement(Component),
//   });
// },false);
mui.plusReady(function() {
  new Vue({
    el: '#app',
    render: (createElement) => createElement(Component),
  });
  //plus.navigator.setStatusBarStyle('dark');
});
`;
};

module.exports = function (env) {
  const isProduction = env.NODE_ENV === "production";
  const minimize = isProduction;
  const entry = {}, plugins = [];
  const suffix = minimize && ".min" || "";
  if (minimize) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      comments: false,
      minimize: true
    }));
  }

  const pages = glob.sync(path.join(__dirname, 'src/views/**/*.vue'))
  .map(_page => path.relative(path.join(__dirname, "src/views"), _page));
  pages.forEach(_page => {
    const _entry = "js/" + _page.replace(/\.vue/ig, "");
    const basename = _page.replace(/\.vue$/, '');
    const templatePathForWeb = path.join(__dirname, ".temp", basename + '.js');
    fs.outputFileSync(templatePathForWeb, getEntryFileContent(templatePathForWeb, path.join(__dirname, "./src/views", _page)));
    entry[_entry] = templatePathForWeb;
    const options = {
      title: "迈迪xx",
      inject: "body",
      script: ["jquery", "mui", "vue"].map(_file => {
        const _lib = path.relative(path.join(__dirname, "src/views", _page), path.join(__dirname, "src/views/js", _file + suffix + ".js"));
        return `<script type="text/javascript" src="${_lib}"></script>`;
      }).join(""),
      css: ["mui"].map(_file => {
        const _lib = path.relative(path.join(__dirname, "src/views", _page), path.join(__dirname, "src/views/css", _file + suffix + ".css"));
        return `<link href="${_lib}" rel="stylesheet">`;
      }).join(""),
      filename: "views/" + _page.replace(/\.vue/ig, ".html"),
      template: "./src/template.tpl",
      chunks: [_entry]
    };
    plugins.push(new HtmlWebpackPlugin(options));
  });

  if (Object.keys(entry).length === 0) {
    console.error("--------------entry为空,无法继续生成--------------")
  }

  return {
    entry: entry,
    output: {
      path: path.join(__dirname, "app/dist"),
      filename: isProduction ? "[name]-[chunkhash].js" : "[name].js?v=[chunkhash]",
      chunkFilename: isProduction ? "[name]-[chunkhash].js" : "[name].js?v=[chunkhash]"
    },
    externals: {
      jquery: "window.jQuery",
      vue: "window.Vue",
    },
    resolve: {
      extensions: ['.vue', '.js', '.css', '.sass']
    },
    module: {
      rules: [{
        test: /\.html$/,
        exclude: /node_modules/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: minimize
          }
        }]
      },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'stage-3']
          }
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        },
        {
          test: /\.scss$/,
          loader: 'style-loader!css-loader!sass-loader'
        },
        {
          test: /\.(gif|png|jpg|svg)$/,
          loader: 'url-loader?limit=8192&name=images/[hash].[ext]'
        },
        {
          test: /\.(eot|woff2?|svg)(\?.*)?$/,
          loader: 'url-loader?limit=1000&name=fonts/[hash].[ext]'
        },
        {
          test: /\.ttf(\?.*)?$/,
          loader: 'url-loader?limit=1000&name=fonts/[hash].[ext]&mimetype=application/octet-stream'
        },

        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },

        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader?limit=1000&name=video/[hash].[ext]'
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([{
        from: `./node_modules/jquery/dist/jquery${suffix}.js`,
        to: 'js'
      }, {
        from: `./node_modules/vue/dist/vue${suffix}.js`,
        to: 'js'
      }, {
        from: `./node_modules/mui/dist/js/mui${suffix}.js`,
        to: 'js'
      }, {
        from: `./node_modules/mui/dist/css/mui${suffix}.css`,
        to: 'css'
      }, {
        from: './node_modules/mui/dist/fonts/mui.ttf',
        to: 'fonts'
      }], {
        ignore: [],
        copyUnmodified: true,
        debug: "debug"
      }),
      new webpack.DefinePlugin({
        __DEV__: env.NODE_ENV === "development",
        "NODE_ENV": env.NODE_ENV,
        "API_HOST": "'http://192.168.1.60'"
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new VueLoaderPlugin()
    ].concat(plugins)
  };
};