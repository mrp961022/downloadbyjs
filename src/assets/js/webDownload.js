let nullStart= 0; // null值开始的位置
let nullList = []; // 所有null值的位置，用来合并使用
let nullLast = -1; // 数组中null最后一次的位置
let otherArr = []; // 相邻null位置统计
let newArr = [] // 所有相邻null拼接成一个新数组

/**
* 生成sheet，根据实际情况合并，注意sheet名不要重复
* @param data[Array] 数据列标 取数据的value
* @param column[Array] 表头数据，有key、value值
* @param aoa[Array] 需要合并的表头信息
* @param sheetName[String] sheet名
*/
export let createSheet = (data, column, aoa = [], sheetName) => {
 let topDataNum = aoa.length, dataKey = [];
 aoa.push([]);
 column.map(item=>{
    aoa[topDataNum].push(item.label);
    dataKey.push(item.key);
 })
 let hbLine = [];
 aoa.map((item, index)=>{
     if(item.indexOf(null)>-1) {
        nullStart = 0;
        nullList = [];
        nullLast = -1;
        otherArr = [];
        newArr = [];
        isNull(item);
        isNext(nullList);
        for(var i in newArr) {
            hbLine.push({
                s: { r: index, c: newArr[i][0] - 1 },
                e: {
                    r: index,
                    c: newArr[i][0] - 1 + newArr[i].length
                }
            })
        }
     }else {
         return null;
     }
 })
 data.map((item, index) => {
    aoa[topDataNum + index + 1] = []
    dataKey.map(keyItem => {
        aoa[topDataNum + index + 1].push(item[keyItem])
    })
 })
 let sheet = XLSX.utils.aoa_to_sheet(aoa);
 sheet["!merges"] = hbLine;
 return { sheetData: sheet, sheetName: sheetName };
}

let isNext = (arr) => {
    /**
     * @description 处理数据格式 将相邻的数据组成数组（[1,2,3,5,6,7,9]=>[[1,2,3],[5,6,7],[9]]）
     * @author mrp
     * @date 2020-04-08
     * @update mrp(2020-11-11) 增加注释
     * @params arr{Array} 需要处理的数组
     * @return {void}
     */
    for (var i = 0; i < arr.length; i++) {
        otherArr.push(arr[i]);
        if (arr[i + 1] && arr[i + 1] - arr[i] == 1) {
            // 判断是否有相邻的null，如果是相邻的，一直往otherArr中push
            otherArr.push(arr[i + 1]);
        } else {
            // 如果不是相邻或者是最后一个，往newArr中push，清空otherArr
            newArr.push(Array.from(new Set(otherArr)));
            otherArr = [];
        }
    }
};
let isNull = (arr) => {
    /**
     * @description 循环调用方法，判断数据每一个null的位置
     * @author mrp
     * @date 2020-04-08
     * @update mrp(2020-11-12) 增加注释
     * @params arr{Array} 需要处理的（表头）数据 判断需要合并（null）的单元格
     * @return {void}
     */
    if (arr.indexOf(null)>-1) {
        nullStart = arr.indexOf(null);
        nullLast += nullStart + 1;
        nullList.push(nullLast);
        isNull(arr.slice(nullStart + 1));
    }
}