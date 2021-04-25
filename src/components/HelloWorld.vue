<template>
    <div>
        <button title="可以支持表格合并导出" @click="uploadFile">下载</button>
    </div>
</template>

<script>
import XLSX from 'xlsx-js-style'
import { download } from "@/assets/js/download";
export default {
    name: "hello",
    data() {
        return {
            nullStart: 0, // null值开始的位置
            nullList: [], // 所有null值的位置，用来合并使用
            nullLast: -1, // 数组中null最后一次的位置
            otherArr: [], // 相邻null位置统计
            newArr: [] // 所有相邻null拼接成一个新数组
        };
    },
    methods: {
        uploadFile() {
            /**
             * @description 下载文件 用于处理数据
             * @author mrp
             * @date 2020-04-08
             * @update mrp(2020-04-08)
             * @params {void}
             * @return {void}
             */
            var allNum = [
                {
                    姓名: "张三",
                    性别: "男",
                    年龄: null,
                    注册时间: "2019/10/10"
                },
                { 姓名: "李四", 性别: "女", 年龄: 19, 注册时间: "2019/12/12" },
                { 姓名: "王五", 性别: "男", 年龄: 20, 注册时间: "2019/11/08" },
                { 姓名: "赵六", 性别: "女", 年龄: 22, 注册时间: "2020/10/10" }
            ]; // 表格内容
            var allNum1 = [
                { 学号: "00001", 姓名: "张三", 性别: "男", 分数: 90 },
                { 学号: "00002", 姓名: "李四", 性别: "女", 分数: 60 },
                { 学号: "00003", 姓名: "王五", 性别: "男", 分数: 77 },
                { 学号: "00004", 姓名: "赵六", 性别: "女", 分数: 55 }
            ];
            allNum1.map(item=>{
                var pj = "";
                item["分数"]>=90 ? pj = "优秀" : (item["分数"]>=70 ? pj = "良好" : (item["分数"]>=60 ? pj = "及格" : pj = "不及格"))
                item["评级"] = pj;
            })
            /**
             * 再看看能不能判断每一个合并
             * 一行可以进行多次合并 注意需要合并的内容置null
             */
            var aoa = [
                ["主要信息", null, null, "其它信息", null, "中间"], // 特别注意合并的地方后面预留null
                // ["测试行", null, null, null], // 试试合并到头
                // ["测试合并", "在中间", null, "会不会有问题"], // 试试合并在中间
                // ["测试合并", "在最后", "会不会有问题", null], // 试试尾部合并
                // ["测试如果", "多几列", "合并会不会", null, null, "有问题"] // 试试错误数据合并
            ]; // 表头信息，如果没有就是空
            var aoa1 = [];
            download.openDownloadDialog(
                download.sheet2blob([
                    // this.createSheet(allNum, aoa, "sheet1"),
                    this.createSheet(allNum1, aoa1, "sheet2")
                ]), // 批量导出数据 sheetName要不同，不然会导出失败，报错
                "导出.xlsx" // 导出表格的文件名
            );
        },
        createSheet(data, aoa, sheetName) {
            /**
             * @description 生成sheet文件
             * @author mrp
             * @date 2020-04-08
             * @update mrp(2020-11-12) 修改处理数据的方法
             * @params data{Array} 表格数据 aoa{Array} 表头数据 sheetName{String} sheet名
             * @return Object { sheetData{Object} sheet类型的对象 sheetName{String} sheet名 }
             */
            var topDateNum = aoa.length;
            // 数据一般键值对类型数据，需要根据导出格式转换一下
            // 插入的顺序和表格的表头对应起来
            aoa.push([]);
            for (var i in data[0]) {
                aoa[topDateNum].push(i); // 当你的表头与表格需要显示表头相同时可以遍历
            }
            var hbLine = [];
            // 合并单元格 判断是否有相邻的null元素
            aoa.map((item, index) => {
                if (item.indexOf(null) > -1) {
                    // 每次判断合并行的时候进行一次数据还原
                    this.nullStart = 0;
                    this.nullList = [];
                    this.nullLast = -1;
                    this.otherArr = [];
                    this.newArr = [];
                    this.isNull(item);
                    this.isNext(this.nullList);
                    for (var i in this.newArr) {
                        hbLine.push({
                            // 设置某一行的单元格合并（每行只支持一次合并）
                            // s:{r:num,c:num} 开始 ,e:{r:num,c:num} 结束
                            // r:行 c:列
                            s: { r: index, c: this.newArr[i][0] - 1 },
                            e: {
                                r: index,
                                c: this.newArr[i][0] - 1 + this.newArr[i].length
                            }
                        });
                    }
                } else {
                    return;
                }
            });
            // 如果表格内容也需要合并的话 可以放在上面的map前面
            data.map((item, index) => {
                // 当你的表头与表格需要显示表头相同时可以直接取表头的信息
                // 如果不同请参考newWord.vue的处理方式，表头和表格体分开
                aoa.push([]);
                aoa[topDateNum].map(keyItem=>{
                    aoa[topDateNum + index + 1].push(item[keyItem])
                })
                // aoa.push([
                //     item[aoa[topDateNum][0]],
                //     item[aoa[topDateNum][1]],
                //     item[aoa[topDateNum][2]],
                //     item[aoa[topDateNum][3]],
                //     item[aoa[topDateNum][4]]
                // ]); 
            });
            // hbLine.push({
            //     s: { r: 15, c: 8 },
            //     e: { r: 16,c: 9}
            // })
            // 将数据转成sheet表格 数据格式一行一个数组
            var sheet = XLSX.utils.aoa_to_sheet(aoa);
            // 需要合并的单元格
            sheet["!merges"] = hbLine;

            return { sheetData: sheet, sheetName: sheetName };
        },
        isNext(arr) {
            /**
             * @description 处理数据格式 将相邻的数据组成数组（[1,2,3,5,6,7,9]=>[[1,2,3],[5,6,7],[9]]）
             * @author mrp
             * @date 2020-04-08
             * @update mrp(2020-11-11) 增加注释
             * @params arr{Array} 需要处理的数组
             * @return {void}
             */
            /**
             * 假设arr的值为[1,2,4,5,7] 每次循环发生了什么
             * otherArr [1] otherArr [1,2] 
             * otherArr [1,2,2] newArr [[1,2]] otherArr []
             * otherArr [4] otherArr [4,5] 
             * otherArr [4,5,5] newArr [[1,2],[4,5]] otherArr []
             * otherArr [7] newArr [[1,2],[4,5],[7]] otherArr []
             */
            for (var i = 0; i < arr.length; i++) {
                this.otherArr.push(arr[i]);
                if (arr[i + 1] && arr[i + 1] - arr[i] == 1) {
                    // 判断是否有相邻的null，如果是相邻的，一直往otherArr中push
                    this.otherArr.push(arr[i + 1]);
                } else {
                    // 如果不是相邻或者是最后一个，往newArr中push，清空otherArr
                    this.newArr.push(Array.from(new Set(this.otherArr)));
                    this.otherArr = [];
                }
            }
        },
        isNull(arr) {
            /**
             * @description 循环调用方法，判断数据每一个null的位置
             * @author mrp
             * @date 2020-04-08
             * @update mrp(2020-11-12) 增加注释
             * @params arr{Array} 需要处理的（表头）数据 判断需要合并（null）的单元格
             * @return {void}
             */
            /**
             * 根据每一次null的位置回调函数直到没有null为止
             * 例如 arr [1,2,3,null,4,null,5]
             * 第一次 [1,2,3,null,4,null,5] nullStart 3 nullLast 3 nullList [3]
             * 第二次[4,null,5] nullStart 1 nullLast 5 nullList [3,5]
             * 第三次[5]
             */
            /**
             * lodash中使用到的方法
             * _.indexOf(arr, null) 同js中的indexOf
             * _.slice(arr, this.nullStart + 1) 同js中的slice
             */
            // if (_.indexOf(arr, null) > -1) {
            //     this.nullStart = _.indexOf(arr, null);
            //     this.nullLast += this.nullStart + 1;
            //     this.nullList.push(this.nullLast);
            //     this.isNull(_.slice(arr, this.nullStart + 1));
            // }
            if (arr.indexOf(null)>-1) {
                this.nullStart = arr.indexOf(null);
                this.nullLast += this.nullStart + 1;
                this.nullList.push(this.nullLast);
                this.isNull(arr.slice(this.nullStart + 1));
            }
        }
    },
};
</script>

<style>
</style>