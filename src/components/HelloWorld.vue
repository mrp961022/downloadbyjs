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
            var aoa = [
                ["主要信息", null, null, "其它信息"], // 特别注意合并的地方后面预留2个null
                ["姓名", "性别", "年龄", "注册时间"],
                ["张三", "男", 18, new Date()],
                ["李四", "女", 22, new Date()]
            ];
            var sheet = XLSX.utils.aoa_to_sheet(aoa);
            sheet["!merges"] = [
                // 设置A1-C1的单元格合并
                // s:{r:num,c:num} 开始 ,e:{r:num,c:num} 结束
                // r:行 c:列
                { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }
            ];
            download.openDownloadDialog(
                download.sheet2blob([
                    { sheetData: sheet, sheetName: "自定义1" },
                    { sheetData: sheet, sheetName: "自定义2" }
                ]), // 批量导出数据 两个sheetName要不同，不然会导出失败，报错
                "导出.xlsx"
            );
        }
    }
};
</script>

<style>
</style>