let download = {
  // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
  /**
   * 下载excel文件，通过sheet内容下载
   * @param sheet 下载信息包含表格和表名
   */
  sheet2blob(sheet) {
    var workbook = {
      SheetNames: [],
      Sheets: {}
    };
    for (var i of sheet) {
      var sheetName = i.sheetName; // sheet名
      workbook.SheetNames.push(sheetName);
      workbook.Sheets[sheetName] = i.sheetData; // sheet表sheet信息
    } // 多sheet导出
    // 生成excel的配置项
    var wopts = {
      bookType: "xlsx", // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: "binary"
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    });
    // 字符串转ArrayBuffer
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i)
        view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }
    return blob;
  },
  /**
   * 通用的打开下载对话框方法，没有测试过具体兼容性
   * @param url 下载地址，也可以是一个blob对象，必选
   * @param saveName 保存文件名，可选
   */
  openDownloadDialog(url, saveName) {
    if (typeof url == "object" && url instanceof Blob) {
      url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement("a");
    aLink.href = url;
    aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) event = new MouseEvent("click");
    else {
      event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
    }
    aLink.dispatchEvent(event);
  },
  // csv转sheet对象 // 未使用
  // csv2sheet(csv) {
  //     var sheet = {}; // 将要生成的sheet
  //     csv = csv.split("\n");
  //     csv.forEach(function(row, i) {
  //         row = row.split(",");
  //         if (i == 0)
  //             sheet["!ref"] =
  //                 "A1:" +
  //                 String.fromCharCode(65 + row.length - 1) +
  //                 (csv.length - 1);
  //         row.forEach(function(col, j) {
  //             sheet[String.fromCharCode(65 + j) + (i + 1)] = { v: col };
  //         });
  //     });
  //     return sheet;
  // },
  // 传入csv，执行后就会弹出下载框  // 未使用
  // exportExcel(csv) {
  //     var sheet = this.csv2sheet(csv);
  //     var blob = this.sheet2blob(sheet);
  //     openDownloadDialog(blob, "导出.xlsx");
  // }
  // 读取本地excel文件 未使用
  // readWorkbookFromLocalFile(file, callback) {
  //     var reader = new FileReader();
  //     reader.onload = function(e) {
  //         var data = e.target.result;
  //         var workbook = XLSX.read(data, { type: "binary" });
  //         if (callback) callback(workbook);
  //     };
  //     reader.readAsBinaryString(file);
  // },
  // 从网络上读取某个excel文件，url必须同域，否则报错 未使用
  // readWorkbookFromRemoteFile(url, callback) {
  //     var xhr = new XMLHttpRequest();
  //     xhr.open("get", url, true);
  //     xhr.responseType = "arraybuffer";
  //     xhr.onload = function(e) {
  //         if (xhr.status == 200) {
  //             var data = new Uint8Array(xhr.response);
  //             var workbook = XLSX.read(data, { type: "array" });
  //             if (callback) callback(workbook);
  //         }
  //     };
  //     xhr.send();
  // },
  // 读取excel文件 未使用
  // outputWorkbook(workbook) {
  //     var sheetNames = workbook.SheetNames; // 工作表名称集合
  //     sheetNames.forEach(name => {
  //         var worksheet = workbook.Sheets[name]; // 只能通过工作表名称来获取指定工作表
  //         for (var key in worksheet) {
  //             // v是读取单元格的原始值
  //             console.log(
  //                 key,
  //                 key[0] === "!" ? worksheet[key] : worksheet[key].v
  //             );
  //         }
  //     });
  // },
}
export {
  download
};
