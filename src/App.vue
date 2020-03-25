<template>
    <div id="app">
        <HelloWorld />
    </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
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
        HelloWorld
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
