<template>
    <div>
        <button title="普通导出" @click="uploadFile">普通下载</button>
    </div>
</template>

<script>
import { download } from "@/assets/js/download"; // 引入导出方法，方法只修改了可以批量导出，代码可能冗余
import { createSheet as cs1 } from '@/assets/js/webDownload.js'

export default {
    name: "hello",
    data() {
        return {
            topData: [
                ["主要信息", null, null, "其它信息", null, "中间"], // 特别注意合并的地方后面预留null
                ["测试行", null, null, null], // 试试合并到头
                ["测试合并", "在中间", null, "会不会有问题"], 
            ], // 表头之上的内容，有合并
            studentOfClass1: [], // 表格数据
            classColumn: [
                { label: "姓名", key: "name" },
                { label: "性别", key: "gender" },
                { label: "年龄", key: "age" },
                { label: "注册时间", key: "createTime" }
            ] // 表头数据（一般ui组件的表格都有表头）
        };
    },
    mounted() {
        this.studentOfClass1 = [
            {
                name: "王大一",
                age: 18,
                gender: "男",
                createTime: "2020-02-02 11:11:22"
            },
            {
                name: "王小二",
                age: 17,
                gender: "女",
                createTime: "2020-03-02 11:11:22"
            },
            {
                name: "王小三",
                age: 16,
                gender: "男",
                createTime: "2020-04-02 11:11:22"
            },
            {
                name: "王小四",
                age: 15,
                gender: "女",
                createTime: "2020-05-02 11:11:22"
            }
        ]; // 表格文件赋值，一般调用接口获得数据
    },
    methods: {
        uploadFile() {
            /**
             * @description 下载文件
             * @author mrp
             * @date 2020-04-10
             * @update mrp(2020-04-13) 修改注释的位置
             * @params {void}
             * @return {void}
             */
            // cs1 支持合并表头信息
            // createSheet 普通导出
            download.openDownloadDialog(
                download.sheet2blob([
                    cs1(this.studentOfClass1,this.classColumn,this.topData,"sheet1"),
                    this.createSheet(this.studentOfClass1,this.classColumn,"sheet2")
                ]),
                "导出.xlsx" // 导出表格的文件名
            );
        },
        createSheet(data, column, sheetName) {
            /**
                * @description 生成sheet文件
                * @author mrp
                * @date 2020-04-10
                * @update mrp(2020-04-10)
                * @params data{Array} 表格数据 column{Array} 表头信息 sheetName{String} sheet名
                * @return Object { sheetData{Object} sheet类型的对象 sheetName{String} sheet名 }
                */
            let aoa = [],
                dataKey = []; // 定义导出表头和数据的键值
            aoa.push([]); // 第一行为表头信息
            column.map(item => {
                aoa[0].push(item.label); // 遍历表头信息设置导出表头内容
                dataKey.push(item.key); // 遍历表头信息设置导出数据的键
            });
            data.map((item, index) => {
                aoa[index + 1] = [];
                dataKey.map(keyItem => {
                    aoa[index + 1].push(item[keyItem]);
                }); // 遍历数据，根据键对应表头
            });
            let sheet = XLSX.utils.aoa_to_sheet(aoa);
            sheet["!merges"] = [];
            return { sheetData: sheet, sheetName: sheetName };
        }
    }
};
</script>

<style>
</style>