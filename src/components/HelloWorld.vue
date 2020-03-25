<template>
    <div>
        <button @click="uploadFile">下载</button>
    </div>
</template>

<script>
import { download } from "../../static/js/download";
export default {
    name: "hello",
    data() {
        return {};
    },
    methods: {
        // 下载文件
        uploadFile() {
            var allNum = [
                { 姓名: "张三", 性别: "男", 年龄: 19, 注册时间: "2019/10/10" },
                { 姓名: "李四", 性别: "女", 年龄: 19, 注册时间: "2019/12/12" },
                { 姓名: "王五", 性别: "男", 年龄: 20, 注册时间: "2019/11/08" },
                { 姓名: "赵六", 性别: "女", 年龄: 22, 注册时间: "2020/10/10" }
            ];
            var allNum1 = [
                { 学号: "00001", 姓名: "张三", 性别: "男", 分数: 90 },
                { 学号: "00002", 姓名: "李四", 性别: "女", 分数: 60 },
                { 学号: "00003", 姓名: "王五", 性别: "男", 分数: 77 },
                { 学号: "00004", 姓名: "赵六", 性别: "女", 分数: 55 }
            ];
            /**
             * 注意，每行目前只能支持一次合并，合并列数不限
             * 再看看能不能判断每一个合并
             */
            var aoa = [
                ["主要信息", null, null, "其它信息"], // 特别注意合并的地方后面预留2个null
                ["测试行", null, null, null], // 试试合并到头
                ["测试合并", "在中间", null, "会不会有问题"], // 试试合并在中间
                ["测试合并", "在最后", "会不会有问题", null], // 试试尾部合并
                ["测试如果", "多几列", "合并会不会", null, null, "有问题"] // 试试错误数据合并
            ];
            var aoa1 = [];
            download.openDownloadDialog(
                download.sheet2blob([
                    this.createSheet(allNum, aoa, "sheet1"),
                    this.createSheet(allNum1, aoa1, "sheet2")
                ]), // 批量导出数据 sheetName要不同，不然会导出失败，报错
                "导出.xlsx" // 导出表格的文件名
            );
        },
        // 生成sheet文件与sheetName
        createSheet(data, aoa, sheetName) {
            var topDateNum = aoa.length;
            // 数据一般键值对类型数据，需要根据导出格式转换一下
            // 插入的顺序和表格的表头对应起来
            aoa.push([]);
            for (var i in data[0]) {
                aoa[topDateNum].push(i); // 当你的表头与表格需要显示表头相同时可以遍历
            }
            data.map(item => {
                aoa.push([
                    item[aoa[topDateNum][0]],
                    item[aoa[topDateNum][1]],
                    item[aoa[topDateNum][2]],
                    item[aoa[topDateNum][3]]
                ]); // 当你的表头与表格需要显示表头相同时可以直接取表头的信息
            });
            var sheet = XLSX.utils.aoa_to_sheet(aoa);
            var hbLine = [];
            aoa.map((item, index) => {
                if (item.indexOf(null) > -1) {
                    var nullStart = item.indexOf(null);
                    // 减一是因为，null值不是第一个，而null值前的那个值是要合并的第一个
                    nullStart--;
                    // var nullNum = 0;
                    var nullNum = arraySiteNum(item, null);
                    // for (var i of item) {
                    //     if (i == null) {
                    //         nullNum++;
                    //     }
                    // }
                    hbLine.push({
                        // 设置某一行的单元格合并（每行只支持一次合并）
                        // s:{r:num,c:num} 开始 ,e:{r:num,c:num} 结束
                        // r:行 c:列
                        s: { r: index, c: nullStart },
                        e: { r: index, c: nullNum + nullStart }
                    });
                } else {
                    return;
                }
            });

            sheet["!merges"] = hbLine;

            return { sheetData: sheet, sheetName: sheetName };
        }
    }
};
</script>

<style>
</style>