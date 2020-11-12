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

> 注意导出多sheet的情况，需要区分每个sheet的名称，重名会报错

### `components`中有两个vue文件
* `newWord.vue`中是最简单的报表下载，没有合并，仅需要有表头和表格体的信息
* `HelloWorld.vue`中的报表支持行的合并，合并方式是将需要合并的单元格置为`null`

### 单元格合并规则 行列的下标从0开始，可以支持行合并、列合并、块合并，目前代码仅实现行的合并
```
/**
* s 开始位置 r 开始行标，c 开始列标
* e 结束位置 行列同上
*/
sheet["!merges"] = [
    { // 合并第2行的9，10列 （同行合并）
        s: {r: 1, c: 8},
        e: {r: 1, c: 9}
    }, { // 合并第3列的3，4行 （同列合并）
        s: {r: 2, c: 2},
        e: {r: 3, c: 2}
    }, { // 合并第5行3列到6行4列的区域 （块合并）
        s: {r: 4, c: 2},
        e: {r: 5, c: 3}
    }
]
```

> 在vue-cli3及以上的版本中需要注意静态文件要放在public文件夹中，不然引入不生效