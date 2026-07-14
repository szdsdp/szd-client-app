<template>
  <!-- img预览 -->
  <fileViewImg v-if="_fileType === 'img'" :src="_src" />
  <!-- pdf预览 -->
  <div v-else-if="_fileType === 'pdf'" class="l-view-container">
    <iframe :src="_src" frameborder="0" style="width: 100%; height: 100%; border: none" />
  </div>
  <!-- txt预览 -->
  <!--  <div v-else-if="['txt'].includes(_fileType)" class="l-view-container">-->
  <!--    <iframe :src="_src" frameborder="0" style="background-color: #ffffff; width: 100%; height: 100%; border: none" />-->
  <!--  </div>-->
  <!-- html预览 -->
  <div v-else-if="['html', 'xml', 'json', 'txt'].includes(_fileType)" class="l-view-container">
    <iframe :srcdoc="_src" frameborder="0" style="background-color: #ffffff; width: 100%; height: 100%; border: none" />
  </div>
  <!-- video预览 -->
  <div v-else-if="_fileType === 'video'" class="l-view-container">
    <video :src="_src" controls style="width: 100%; height: 100%" />
  </div>
  <!-- docx预览 -->
  <div v-else-if="_fileType === 'docx'" class="l-view-container-docx">
    <vue-office-docx :src="_src" style="width: 100%; height: 100%; min-width: 800px; overflow-y: unset" />
  </div>
  <!-- xlsx预览 -->
  <div v-else-if="_fileType === 'xlsx'" class="l-view-container">
    <vue-office-excel :src="_src" style="width: 100%; height: 100%" />
  </div>
  <!-- xls预览 使用tab选项卡来模拟Excel的sheet页 -->
  <div v-else-if="_fileType === 'xls'" class="l-view-container-xls">
    <div>
      <var-tabs v-model:active="dg.active" v-if="xlsSheets && xlsSheets.length" @click="handleTabClickXls">
        <var-tab v-for="(item, index) in xlsSheets" :key="index">{{ item }}</var-tab>
      </var-tabs>
    </div>
    <div class="excel-view-container">
      <div id="xlsView" v-html="xlsView" style="width: 100%; height: 100%" />
    </div>
  </div>
  <div v-else style="width: 100%; height: 100%">{{ $t("文件显示失败,请使用下载或联系技术人员") }}</div>
</template>

<script setup>
  import { ref, nextTick, computed, onMounted } from "vue";
  import { $m, $t } from "../../common/utils/globalConfig";
  import { downloadFileUrl } from "../api/upload";
  import szdFile from "../../common/tools/fileTool";
  import fileViewImg from "./fileViewImg.vue";
  import VueOfficeExcel from "@vue-office/excel";
  import "@vue-office/excel/lib/index.css";
  import VueOfficeDocx from "@vue-office/docx";
  import "@vue-office/docx/lib/index.css";
  import * as XLSX from "xlsx-js-style";

  const props = defineProps({
    src: {
      type: String,
      default: ""
    },
    fileName: {
      type: String,
      default: ""
    }
  });
  //功能参数
  const dg = ref({
    active: 0
  });
  //是否是Blob
  const _isBlob = computed(() => {
    return props.src ? props.src.toString().startsWith("blob:") : false;
  });
  //文件后缀类型
  const _fileType = computed(() => {
    const _fileName = props.fileName ? props.fileName : props.src;
    return szdFile.getFileViewType(_fileName);
  });
  //下载文件方式
  const _mimeType = computed(() => {
    const _fileName = props.fileName ? props.fileName : props.src;
    return szdFile.getFileMimeType(_fileName);
  });

  //字节流
  const _src = ref();
  //excel数据
  const xlsView = ref();
  const xlsWorkBook = ref();
  const xlsSheets = ref();

  onMounted(() => {
    if (_fileType.value) {
      initDataSrc();
    } else {
      $m("CORE_CLIENT.W013"); //不支持的文件类型在线查看, 请下载后查看
    }
  });

  //初始化数据
  const initDataSrc = () => {
    if (!props.src) {
      $m("CORE_CLIENT.E018"); //src地址不能为空
      return;
    }
    if (["xls", "html", "xml", "json", "txt"].includes(_fileType.value)) {
      downloadBlob();
    } else if (_isBlob.value) {
      _src.value = props.src;
      // } else if (["txt"].includes(_fileType.value)) {
      //   downloadBlobUrl();
    } else {
      _src.value = props.src;
    }
  };

  /*****************************************************************
   * 生成Blob字节流
   */
  const downloadBlob = () => {
    if (_isBlob.value) {
      fetch(props.src)
        .then(res => res.blob())
        .then(blob => downloadBlobStream(blob));
    } else {
      downloadFileUrl(props.src).then(res => {
        let blob = new Blob([res], { type: _mimeType.value });
        downloadBlobStream(blob);
      });
    }
  };
  //分别处理
  const downloadBlobStream = blob => {
    if (_fileType.value === "xls") {
      downloadBlobXls(blob);
    } else if (["html", "xml", "json", "txt"].includes(_fileType.value)) {
      downloadBlobHtml(blob);
    } else {
      _src.value = URL.createObjectURL(blob);
    }
  };

  /*****************************************************************
   * 生成前端临时预览地址 Blob Url
   */
  const downloadBlobUrl = () => {
    downloadFileUrl(props.src).then(async res => {
      const blob = new Blob([res], { type: _mimeType.value });
      _src.value = URL.createObjectURL(blob);
    });
  };

  /*****************************************************************
   * html xml json 预览
   */
  const downloadBlobHtml = blob => {
    const reader = new FileReader();
    reader.readAsText(blob, "UTF-8");
    reader.onload = () => {
      let _html = reader.result;
      if (!_html) {
        _src.value = _html;
        return;
      }
      let realCharset = "UTF-8";
      if (_fileType.value === "html") {
        const match = _html.match(/<meta[^>]*charset\s*=\s*["']?([^"'\s;>]+)/i);
        realCharset = match?.[1]?.toUpperCase() || realCharset;
      } else if (_fileType.value === "xml") {
        const match = _html.match(/^<\?xml.*encoding\s*=\s*["']?([^"'\s]+)/i);
        realCharset = match?.[1]?.toUpperCase() || realCharset;
      }
      if (realCharset === "UTF-8" && _html.includes("\uFFFD")) {
        realCharset = "GBK";
      }
      if (realCharset === "UTF-8") {
        downloadBlobHtmlContent(_html, realCharset);
      } else {
        const correctReader = new FileReader();
        correctReader.readAsText(blob, realCharset);
        correctReader.onload = () => {
          downloadBlobHtmlContent(correctReader.result, realCharset);
        };
      }
    };
  };

  const downloadBlobHtmlContent = (html, realCharset) => {
    if (["txt"].includes(_fileType.value)) {
      _src.value = `<pre style="padding:10px;margin:0;white-space:pre-wrap;word-break:break-all;">${escapeHtml(html)}</pre>`;
    } else if (["xml", "json"].includes(_fileType.value)) {
      _src.value = `<pre style="padding:10px;margin:0">${escapeHtml(html)}</pre>`;
    } else {
      _src.value = html;
    }
  };

  const escapeHtml = str => {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  };

  /*****************************************************************
   * xls预览
   */

  //xls预览-下载文件-转化文件
  const downloadBlobXls = blob => {
    let reader = new FileReader();
    //另一种方式：blob类型转换为ArrayBuffer类型 reader.readAsArrayBuffer(blob);  XLSX.read(new Uint8Array(ev.target.result), { type: "array" });
    reader.readAsBinaryString(blob);
    //文件转换
    reader.onload = ev => {
      xlsWorkBook.value = XLSX.read(ev.target.result, { type: "binary" });
      xlsSheets.value = xlsWorkBook.value.SheetNames;
      xlsView.value = XLSX.utils.sheet_to_html(xlsWorkBook.value.Sheets[xlsSheets.value[0]]);
      nextTick(() => {
        setStyle4ExcelHtml();
      });
    };
  };

  //设置Excel转成HTML后的样式
  const setStyle4ExcelHtml = () => {
    const xlsViewDOM = document.getElementById("xlsView");
    if (xlsViewDOM) {
      // 获取的是HTMLConnection
      const xlsViewTDNodes = xlsViewDOM.getElementsByTagName("td");
      if (xlsViewTDNodes) {
        const xlsViewTDArr = Array.prototype.slice.call(xlsViewTDNodes);
        for (const i in xlsViewTDArr) {
          const id = xlsViewTDArr[i].id; // 默认生成的id格式为sjs-A1、sjs-A2......
          if (id) {
            const idNum = id.replace(/[^0-9]/gi, ""); // 提取id中的数字，即行号
            if (idNum && (idNum === "1" || idNum === 1)) {
              // 第一行标题行
              xlsViewTDArr[i].classList.add("classTitle");
              // xlsViewTDArr[i].innerText = ' '
            }
            if (idNum && (idNum === "2" || idNum === 2)) {
              // 第二行表头行
              xlsViewTDArr[i].classList.add("classTableTh");
            }
          }
        }
      }
    }
  };

  //xls预览-页签切换
  const handleTabClickXls = index => {
    xlsView.value = XLSX.utils.sheet_to_html(xlsWorkBook.value.Sheets[xlsSheets.value[index]]);
  };
</script>
<style lang="scss" scoped>
  .l-view-container {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    width: 100%;
    height: 100%;
  }

  .l-view-container-docx {
    display: flex;
    align-items: center;
    overflow: auto;
    width: 100%;
    height: 100%;
  }

  .l-view-container-xls {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: #ffffff;
  }

  .excel-view-container {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  :deep(#xlsView) {
    table {
      border-collapse: collapse;
      table-layout: fixed;

      .classTitle {
        white-space: nowrap;
        padding: 5px;
        border: 1px solid #eee;
      }

      td {
        white-space: nowrap;
        padding: 5px;
        border: 1px solid #ddd;
        width: 50px;
        height: 20px;
      }
    }
  }
</style>