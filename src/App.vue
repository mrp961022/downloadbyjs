<template>
    <div id="app">
        <!-- 支持表格合并的导出 代码较多 -->
        <HelloWorld />
        <!-- 普通导出 和主流ui库的table组件数据兼容较好 -->
        <NewWord />
    </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import NewWord from "./components/newWord";
window.__proto__.arraySiteNum = function(array, site) {
    let siteNum = 0;
    for (var i of array) {
        if (i == site) {
            siteNum++;
        }
    }
    return siteNum;
}; // window上绑定一个计算数组包含某元素个数的方法
export default {
    name: "App",
    components: {
        HelloWorld,
        NewWord
    }
};
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
