import {Loading} from 'element-ui'
import {export_json_to_excel} from '@/utils/excel/Export2Excel'
import {export_json_to_excel_new} from '@/utils/excel/Export2Excel-new'
// 改为html中全局引用
// import XLSX from 'xlsx';

export function tableToExcel(id) {
  Loading.service({ lock:true, text:"导出中……", background:"rgba(0, 0, 0, 0.7)"});
  setTimeout( ()=>{
    onTableToExcel(id)
  }, 1500 )

}

function onTableToExcel(excelData) {
  try{
    //标题行
    const title = excelData.title === undefined? [] : excelData.title;
    //条件属性
    const where = excelData.where === undefined? [] : excelData.where;
    //导出的表头名
    const tHeader = [];
    //导出的表头字段名
    const filterVal = [];

    let tableId = document.getElementById(excelData.tableId);
    // console.log("tableId----",tableId.innerHTML)

    let doc = document.createElement("div");
    doc.innerHTML = tableId.innerHTML;
    // console.log("doc----",doc.innerHTML)

    var table = doc.getElementsByTagName("table");
    // console.log("table----",table)
    for (var i = 0;i<table.length;i++) {
      // console.log("table----",table[i])
      if(table[i].className === "el-table__header"){
        var trs = table[i].querySelectorAll('tr');
        // console.log("table---trs-",trs)
        for (var R = 0; R < trs.length; R++) {
          var tds = trs[R].querySelectorAll('th');
          for (var C = 0; C < tds.length; C++) {
            var cell = tds[C];
            var cellValue = cell.innerText;
            // console.log("cellValue1----", cellValue)
            // if(cellValue.length > 0){
            tHeader.push(cellValue);
            filterVal.push("F"+C);
            // }

          }
        }
        break;

      }


    }

    // console.log("tHeader----", tHeader)
    // console.log("filterVal----", filterVal)

    //表格攒值
    const list = [];
    for (var i = 0;i<table.length;i++) {
      // console.log("table----",table[i])
      if(table[i].className === "el-table__body"){
        var trs = table[i].querySelectorAll('tr');
        // console.log("table---trs-",trs)
        for (var R = 0; R < trs.length; R++) {
          var value = {};
          var tds = trs[R].querySelectorAll('td');
          for (var C = 0; C < tds.length; C++) {
            var cell = tds[C];
            var cellValue = cell.innerText;
            // console.log("cellValue1----", cellValue)
            value[filterVal[C]]=cellValue;
          }
          // console.log("value----", value)
          if(tds.length > 0){
            list.push(value)
          }
        }
        break;
      }

    }

    // console.log("list----", list)

    //算总计
    const sumVal = excelData.sumVal === undefined? [] : excelData.sumVal;
    if(sumVal.length > 0){
      let val = {};
      for(var filter in filterVal){
        val[filter] = "";
      }
      for(let i = 0 ; i < sumVal.length ; i++){
        var sumAll = 0;
        for(let j = 0; j < list.length; j++){
          // console.log("sumall---",Number(list[j]["F"+sumVal[i]]));
          sumAll = sumAll + Number(list[j]["F"+sumVal[i]]);
        }
        val["F"+sumVal[i]] = sumAll;
      }
      if(filterVal.length > 1){
        val[filterVal[0]] = "总计";
      }else{
        val[filterVal[0]] = "总计"+val[filterVal[0]];
      }
      list.push(val);

    }

    //['A1:K1']
    //String.fromCharCode(65+i)+"1"
    var ms = "";
    if(filterVal.length < 27){
      var a1 = String.fromCharCode(65)+"1";
      var a2 = String.fromCharCode(65+filterVal.length-1)+"1";
      ms = a1+":"+a2;

    }else{
      var a1 = String.fromCharCode(65)+"1";
      var a2 = String.fromCharCode(65+25)+"1";
      ms = a1+":"+a2;
    }


    const merges = []; //合并单元格
    merges.push(ms);
    // console.log("merges----", merges)

    //处理标题和条件
    // console.log("title----", title)
    for(var i = title.length ; i < filterVal.length; i++){
      title.push("");
    }
    // console.log("where----", where )
    for(var i = where.length ; i < filterVal.length; i++){
      where.push("");
    }



    const data = formatJson(filterVal, list);
    data.map(item => {
      // console.log(item)
      item.map((i, index) => {
        if (!i) {
          item[index] = ''
        }
      })
    })
    const fileName = excelData.fileName;

    export_json_to_excel_new({
      title: title,
      where: where,
      header: tHeader,
      data,
      merges,
      filename: fileName
    }).then(
      Loading.service({}).close()
    )
  }catch (e) {
    Loading.service({}).close()
  }


}

// function onTableToExcel(id) {
//   try{
//     export_table_to_excel(id).then(
//       Loading.service({}).close()
//     )
//
//   }catch (e) {
//     Loading.service({}).close()
//   }
//
// }

export function jsonToExcel(excelData){
  Loading.service({ lock:true, text:"导出中……", background:"rgba(0, 0, 0, 0.7)"});
  setTimeout( ()=>{
    onJsonToExcel(excelData)
  }, 1500 )
}

function onJsonToExcel(excelData) {
 try{
   //标题行
   const title = excelData.title === undefined? [] : excelData.title;
   //条件属性
   const where = excelData.where === undefined? [] : excelData.where;
   //导出的表头名
   const tHeader = excelData.tHeader === undefined? [] : excelData.tHeader;
   //导出的表头字段名
   const filterVal = excelData.filterVal === undefined? [] : excelData.filterVal;
   const list = excelData.listDate;
   //算总计
   const sumVal = excelData.sumVal === undefined? [] : excelData.sumVal;
   if(sumVal.length > 0){
     let val = {};
     for(var filter in filterVal){
       val[filter] = "";
     }
     for(let i = 0 ; i < sumVal.length ; i++){
       var sumAll = 0;
       for(let j = 0; j < list.length; j++){
         // console.log(item)
         sumAll = sumAll + Number(list[j][sumVal[i]]);
       }
       val[sumVal[i]] = sumAll;
     }
     if(filterVal.length > 1){
       val[filterVal[0]] = "总计";
     }else{
       val[filterVal[0]] = "总计"+val[filterVal[0]];
     }
     list.push(val);

   }


   const data = formatJson(filterVal, list);
   data.map(item => {
     // console.log(item)
     item.map((i, index) => {
       if (i==="" || i === undefined) {
         item[index] = ''
       }
     })
   })
   //处理标题和条件
   // console.log("title----", title)
     for(var i = title.length ; i < filterVal.length; i++){
       title.push("");
     }

   // console.log("where----", where )
   for(var i = where.length ; i < filterVal.length; i++){
     where.push("");
   }
   const fileName = excelData.fileName;
   const merges = excelData.merges; //合并单元格
   export_json_to_excel_new({
     title: title,
     where: where,
     header: tHeader,
     data,
     merges,
     filename: fileName
   }).then(
     Loading.service({}).close()
   )
  }catch (e) {
    Loading.service({}).close()
  }


}
export  function onExcel(excelData){
  Loading.service({ lock:true, text:"导出中……", background:"rgba(0, 0, 0, 0.7)"});

  //setTimeout(hhhhhhh(excelData), 10000 )
  setTimeout( ()=>{
    hhhhhhh(excelData)
  }, 1500 )

    // //导出的表头名
    // const tHeader = excelData.tHeader;
    // //导出的表头字段名
    // const filterVal = excelData.filterVal;
    // const list = excelData.listDate;
    // const data = formatJson(filterVal, list);
    // try{
    //   export_json_to_excel(tHeader, data, excelData.title).then(
    //     Loading.service({}).close()
    //   )
    // }catch (e) {
    //   Loading.service({}).close()
    // }



}

function hhhhhhh(excelData) {

  //导出的表头名
  const tHeader = excelData.tHeader;
  //导出的表头字段名
  const filterVal = excelData.filterVal;
  const list = excelData.listDate;
  const data = formatJson(filterVal, list);
  try{
    export_json_to_excel(tHeader, data, excelData.title).then(
      Loading.service({}).close()
    )
  }catch (e) {
    Loading.service({}).close()
  }


}

export  function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}


export async function inExcel(event) {
  let data = await getInDate(event);
  console.log("inExcel----"+data);
  return data;

}


export function getInDate(event) {
  if (!event.currentTarget.files.length) {
    return null;
  }
  const that = this
  // 拿取文件对象
  var f = event.currentTarget.files[0]
  // 用FileReader来读取
  var reader = new FileReader()
  var outdata={} // 你需要的数据
  // 重写FileReader上的readAsBinaryString方法
  FileReader.prototype.readAsBinaryString = function (f) {
    var binary = ''
    var wb // 读取完成的数据

    var reader = new FileReader()
    reader.onload = function (e) {
      // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
      var bytes = new Uint8Array(reader.result)
      var length = bytes.byteLength
      for (var i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      // 接下来就是xlsx了，具体可看api
      wb = XLSX.read(binary, {
        type: 'binary'
      })
      outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
      // 自定义方法向父组件传递数据
      // console.log('outdata = ' + JSON.stringify(outdata))
      for(var i = 0;i<outdata.length;i++){
        console.log(outdata[i])
      }
      // that.$emit('getResult', outdata)
    }
    reader.readAsArrayBuffer(f)
  }
  reader.readAsBinaryString(f)

  return outdata;



}
