module.exports = {
  // useBuiltIns:  usage | entry  按需引入 和  全部引入 --李亚 2021-03-03
  presets: [["@vue/app", { useBuiltIns: "usage" }]],
  "ignore": [ //第三方插件会使用非严格模式的js，此处忽略---贾建辉 2019-08-16
    "./public/lib/*",
    "./public/Ueditor/*"
  ]
}
