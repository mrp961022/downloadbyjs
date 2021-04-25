import XLSX from 'xlsx-js-style'

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
}
export {
  download
};
