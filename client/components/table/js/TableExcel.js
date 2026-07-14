import * as XLSX from "xlsx-js-style";
import { $m } from "../../../common/utils/globalConfig";
import szdFile from "../../../common/tools/fileTool";
import { downloadFilename, getExcelHeader, setExcelHeaderStyle } from "./TableExcelHeader";
import { getExcelOutData, setExcelSumRow } from "./TableExcelExport";
import { excelUploadProc } from "./TableExcelImport";
import { downloadTemplate } from "../../../components/api/table";

//导出数据
export function excelExport(lay, objData, sheets = []) {
  //表头设置
  const colHead = getExcelHeader(lay.fCatCol, false);
  //生成需要导出的数据
  const outData = getExcelOutData(objData, colHead);
  if (!outData || outData.length === 0) {
    $m("CORE_CLIENT.W011"); //无需要导出的数据
    return;
  }
  //创建工作簿excel
  const workBook = XLSX.utils.book_new();
  //输出数据到sheet
  const workSheet = XLSX.utils.aoa_to_sheet(outData);
  //输出汇总数据
  const sumFlag = setExcelSumRow(lay, outData, colHead, workSheet);
  //将sheet添加到excel
  XLSX.utils.book_append_sheet(workBook, workSheet, "result");
  //设置抬头样式
  setExcelHeaderStyle(workSheet, colHead, sumFlag, outData.length);
  //导出多页签数据
  if (sheets && Array.isArray(sheets) && sheets.length > 0) {
    excelExportManySheet(workBook, sheets);
  }
  //生成Excel文件
  XLSX.writeFile(workBook, downloadFilename(lay));
  $m("CORE_CLIENT.S010"); //导出文件成功
}

//下载模板
export function excelTmpExport(lay, sheets = []) {
  //模板直接下载
  if (lay.layout.impTmpCode) {
    excelTmpExportDown(lay.layout.impTmpCode, downloadFilename(lay));
  } else {
    //表头设置
    const colHead = getExcelHeader(lay.fCatCol, true);
    //创建工作簿excel
    const workBook = XLSX.utils.book_new();
    //输出数据到sheet
    const workSheet = XLSX.utils.aoa_to_sheet(colHead.outData);
    //将sheet添加到excel
    XLSX.utils.book_append_sheet(workBook, workSheet, "result");
    //设置抬头样式
    setExcelHeaderStyle(workSheet, colHead, false, 0);
    //导出多页签数据
    if (sheets && Array.isArray(sheets) && sheets.length > 0) {
      excelExportManySheet(workBook, sheets);
    }
    //生成Excel文件
    XLSX.writeFile(workBook, downloadFilename(lay));
    $m("CORE_CLIENT.S010"); //导出文件成功
  }
}

//下载配置的模板
function excelTmpExportDown(templateCode, templateName) {
  downloadTemplate(templateCode).then(res => {
    szdFile.downloadFileBlob(res, "xlsx", templateName);
  });
}

//下载多页签数据
function excelExportManySheet(workBook, sheets) {
  for (let i = 0; i < sheets.length; i++) {
    //将sheet添加到excel
    if (sheets[i].name && sheets[i].keys && sheets[i].keys.length > 0 && sheets[i].data && sheets[i].data.length > 0) {
      let _sheetData = excelExportManySheetData(sheets[i].keys, sheets[i].data);
      XLSX.utils.book_append_sheet(workBook, XLSX.utils.aoa_to_sheet(_sheetData), sheets[i].name);
    }
  }
}

//下载多页签数据-数据转化
function excelExportManySheetData(keys, sheetData) {
  let _sheetData = [];
  for (let i = 0; i < sheetData.length; i++) {
    if (sheetData[i] && typeof sheetData[i] === "object" && !Array.isArray(sheetData[i])) {
      let l_arr = [];
      for (let j = 0; j < keys.length; j++) {
        if (keys[j]) l_arr.push(sheetData[i][keys[j]]);
      }
      _sheetData.push(l_arr);
    }
  }
  return _sheetData;
}

//导入数据
export function excelUpload(lay, objData, file) {
  return new Promise(resolve => {
    if (!/\.(xlsx|xls|csv)$/.test(file.name)) {
      $m("CORE_CLIENT.E012"); //只能上传 .xlsx、.xls、.csv 文件!
      resolve(false);
    }
    //导入文件
    const reader = new FileReader();
    reader.readAsBinaryString(file.raw);
    //文件转换
    reader.onload = ev => {
      const workBook = XLSX.read(ev.target.result, { type: "binary" });
      const actSheet = workBook.SheetNames.includes("result") ? "result" : workBook.SheetNames[0];
      const workSheet = workBook.Sheets[actSheet];
      const uplData = XLSX.utils.sheet_to_json(workSheet);
      //处理上传数据
      if (excelUploadProc(lay, objData, uplData)) {
        resolve(true);
        $m("CORE_CLIENT.S009"); //导入文件完成
      } else {
        resolve(false);
      }
    };
  });
}
