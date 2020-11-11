# uploadbyjs

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

> 引入静态js文件在static/upload里面  upload写错了，应该是download

### `components`中有两个vue文件
* `newWord.vue`中是最简单的报表下载，没有合并，仅需要有表头和表格体的信息
* `HelloWorld.vue`中的报表支持行的合并，合并方式是将需要合并的单元格置为`null`

> 在vue-cli3及以上的版本中需要注意静态文件要放在public文件夹中，不然引入不生效