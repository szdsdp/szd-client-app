<template>
  <var-popup
    v-model:show="winParams.open"
    position="bottom"
    close-on-click-overlay
    class="szd__popup__wrapper_h"
    style="height: 80vh"
    @close="closeDialog('cancel')">
    <!-- 选项卡-帮助集   -->
    <div v-if="winParams.groupFlag">
      <var-tabs
        v-model:active="winParams.activeTabGroup"
        color="var(--color-primary)"
        active-color="var(--color-on-primary)"
        inactive-color="var(--color-on-info)"
        @click="handleTabClick">
        <var-tab v-for="item in selfParams.helpArr" :name="item.header.fieldCode">{{ $t(item.header.fieldName) }} </var-tab>
      </var-tabs>
    </div>

    <!-- 页标签 和 查询按钮 无常用值 winParams.commonFlag 且无查询条件selectParams.length 不输出-->
    <div class="tabBox" v-if="winParams.commonFlag || selectParams.length > 0">
      <!-- 页标签设置 -->
      <div class="tabBoxCol">
        <div style="display: flex" v-if="winParams.commonFlag">
          <div class="tabBoxTab" :style="{ color: tabStyle.allFontColor }" @click="setTab(0)">{{ $t("所有值") }}</div>
          <div class="tabBoxTab" :style="{ color: tabStyle.comFontColor }" @click="setTab(1)">{{ $t("常用值") }}</div>
          <div class="tabBoxLine" :style="{ left: tabStyle.left }" />
        </div>
      </div>
      <!-- 查询按钮设置 不输出更多筛选 -->
      <div class="searchBox" v-if="selectParams.length > 0 || winParams.jobCode || winParams.multipleChoice === 2">
        <var-button-group type="default">
          <szd-button v-if="winParams.multipleChoice === 2" label="确认" type="primary" @click="okay" />
          <szd-button v-if="selectParams.length > 0" label="搜索" type="primary" @click="handleSearch" />
          <szd-button v-if="selectParams.length > 0" label="重置" type="primary" @click="setReset" />
          <szd-button v-if="winParams.jobCode" label="同步" type="primary" @click="getSync" />
        </var-button-group>
      </div>
    </div>

    <!-- 数据展示 -->
    <searchHelpViewTable
      ref="refSearchHelpTable"
      :data="tableData"
      :layout="handleTableLayout()"
      :fieldCat="handleTableFCat()"
      v-model:page="page"
      @selection-change="handleSelectionChange"
      @handleRequest="handleRequestImp"
      @handleRowEvent="handleRowEventImp" />

    <!-- 详情 -->
    <searchHelpViewTableRow
      ref="refSearchHelpViewTableRow"
      :data="tableData"
      :winParams="winParams"
      :fieldCat="handleTableFCat()"
      @handleRowEvent="handleRowEventImp" />
    <!-- 查询条件 -->
    <searchHelpViewSch ref="refSearchHelpViewSch" :winParams="winParams" :selectParams="selectParams" @handleSchEvent="handleSchEventImp" />
  </var-popup>
</template>

<script>
  import { searchHelpList, addCommonValues, delCommonValues, syncMdm } from "../api/searchHelp.js";
  import searchHelpViewTable from "./searchHelpViewTable.vue";
  import searchHelpViewTableRow from "./searchHelpViewTableRow.vue";
  import searchHelpViewSch from "./searchHelpViewSch.vue";

  export default {
    components: {
      searchHelpViewTable,
      searchHelpViewTableRow,
      searchHelpViewSch
    },
    props: ["selectKeys"],
    data() {
      return {
        //URL参数传入
        urlParams: {
          urlAll: "/core/common/sh/all/list", //所有值请求地址
          urlCom: "/core/common/sh/com/list" //常用值请求地址
        },
        //页签样式
        tabStyle: {
          allFontColor: "#397bfe", //所有值下划线
          comFontColor: "", //常用值
          left: "0px"
        },
        //窗口大小和参数
        winParams: {
          open: false,
          activeTab: 0, //0所有值 1常用值

          activeTabGroup: "", //集标签
          multipleChoice: 1, //单选多选
          title: "搜索帮助", //窗口标题
          appViewMode: "A", //显示模式
          commonFlag: true, //显示常用值
          noPage: false, //不启用分页
          urlCus: "", //自定义后端请求
          jobCode: "", //同步接口程序
          groupFlag: false, //帮助集
          baseField: "", //基础字段
          baseFixComFieldArr: [], //固定常用值字段
          viewTitle: "" //详情字段
        },
        //页设置
        page: {
          total: 0, //总条数
          pageSizes: [], //分页大小
          pageSize: 20, //页大小
          pageNum: 1 //当前页
        },
        //排序列
        sortGroup: [
          {
            sortField: "", //排序字段
            sortType: "" //排序方式
          }
        ],
        //备份参数
        selfParams: {
          helpArr: [], //帮助数组
          objStyle: {} //样式
        },
        //搜索帮助
        objHelp: {},
        //查询条件
        selectParams: [],
        //查询结果列头
        columnParams: [],
        //输出数据
        tableData: [],
        //多选行
        listSel: [],
        //返回参数
        retParam: {
          defFieldId: ""
        }
      };
    },
    methods: {
      //接受数据
      getAcceptData(objParam) {
        this.objHelp = objParam;
        //窗口样式
        this.setStyles(this.objHelp.header);
        //设置查询条件
        this.setSelectParams(this.objHelp.filter);
        //设置表头列
        this.setColumnParams(this.objHelp.output);
        //设置固定常用值字段
        this.setBaseFixComFieldArr(this.objHelp.filter);
        //获取后台数据
        this.getSelectParams();
        this.winParams.open = true;
      },
      //设置窗口样式
      setStyles(header) {
        if (Array.isArray(header.appPageSizes) && header.appPageSizes.length > 0) {
          this.page.pageSizes = JSON.parse(header.appPageSizes);
        } else {
          this.page.pageSizes = [20, 50, 100];
        }
        this.page.pageSize = this.page.pageSizes[0];
        this.page.pageNum = 1;

        this.winParams.commonFlag = header.commonFlag; //显示常用值
        this.winParams.noPage = header.noPage === true; //不启用分页
        this.winParams.appViewMode = header.appViewMode; //显示模式
        this.winParams.urlCus = header.urlCus; //自定义后端请求
        this.winParams.jobCode = header.jobCode; //同步接口程序
        this.retParam.defFieldId = ""; //默认回填字段代码
      },
      //设置查询条件
      setSelectParams(filter) {
        this.selectParams = [];
        for (let i = 0; i < filter.length; i++) {
          let _fieldVal = filter[i].fieldVal ? filter[i].fieldVal : "";
          if (filter[i].fieldDataType === "boolean") {
            if (filter[i].fieldVal === true || filter[i].fieldVal === "true") {
              _fieldVal = "1";
            } else if (filter[i].fieldVal === false || filter[i].fieldVal === "false") {
              _fieldVal = "0";
            } else {
              _fieldVal = "A";
            }
          }
          this.selectParams.push({
            fieldId: filter[i].fieldId,
            fieldName: filter[i].fieldName,
            fieldVal: _fieldVal,
            fieldDataType: filter[i].fieldDataType,
            fieldMode: filter[i].fieldMode,
            fieldDisplay: filter[i].fieldDisplay,
            fieldHelpType: filter[i].fieldHelpType,
            fieldHelpCode: filter[i].fieldHelpCode,
            fieldHelpMap: filter[i].fieldHelpMap
          });
        }
      },
      //设置表列头赋值
      setColumnParams(output) {
        this.columnParams = [];
        this.winParams.viewTitle = "";
        for (let i = 0; i < output.length; i++) {
          if (!this.winParams.viewTitle && output[i].fieldColKey) {
            this.winParams.viewTitle = output[i].fieldId;
          }
          if (output[i].fieldRetDef) {
            this.retParam.defFieldId = output[i].fieldId; //默认回填
          }
          if (!output[i].fieldColHide) {
            this.columnParams.push({
              fieldId: output[i].fieldId,
              fieldName: output[i].fieldName,
              fieldColWidthApp: output[i].fieldColWidthApp ? output[i].fieldColWidthApp : "", //列宽度
              fieldColAlign: output[i].fieldColAlign ? output[i].fieldColAlign : "", //对齐方式
              fieldColDetail: output[i].fieldColDetail ? output[i].fieldColDetail : false, //是否详情
              fieldColSort: output[i].fieldColSort //排序
            });
          }
          if (!this.retParam.defFieldId && this.columnParams.length > 0) {
            this.retParam.defFieldId = this.columnParams[0].fieldId;
          }
        }
      },
      //设置固定常用值字段
      setBaseFixComFieldArr(filter) {
        this.winParams.baseFixComFieldArr = [];
        for (let i = 0; i < filter.length; i++) {
          if (filter[i].fieldFixComWhere === true) this.winParams.baseFixComFieldArr.push(filter[i].fieldId);
        }
        if (this.winParams.baseFixComFieldArr.length > 0) this.winParams.baseFixComFieldArr.sort((a, b) => a - b);
      },

      /**************从后台获取数据列表******************/
      //后台查询数据-获取查询条件参数
      getSelectParams() {
        let arr = [];
        for (let i = 0; i < this.selectParams.length; i++) {
          let _paramValue = this.selectParams[i].fieldVal;
          if (this.selectParams[i].fieldDataType === "boolean") {
            _paramValue = this.selectParams[i].fieldVal === "0" ? false : this.selectParams[i].fieldVal === "1" ? true : "";
          }
          arr.push({
            paramName: this.selectParams[i].fieldId,
            paramValue: _paramValue,
            paramMode: this.selectParams[i].fieldMode,
            paramType: this.selectParams[i].fieldDataType
          });
        }
        let json = {
          baseField: this.winParams.baseField,
          baseFixComWhere: "",
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
          _paramGroup: arr,
          _sortGroup: this.sortGroup
        };
        this.getRequest(json);
      },
      //后台查询数据-获取清单
      getRequest(requestJson) {
        let url = "";
        this.tableData = [];
        if (this.winParams.activeTab === 0) {
          url = this.winParams.urlCus ? this.winParams.urlCus : this.urlParams.urlAll;
        } else {
          url = this.urlParams.urlCom;
          requestJson.baseFixComWhere = this.getBaseFixComWhere();
        }
        searchHelpList(requestJson, url).then(res => {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.page.total = res.total;
            //设置选中行
            if (this.tableData && this.selectKeys && this.selectKeys.fKeyS && this.selectKeys.keys.length > 0) {
              this.$nextTick(() => {
                for (let i = 0; i < this.tableData.length; i++) {
                  let _row = this.tableData[i];
                  if (_row[this.selectKeys.fKeyS] && this.selectKeys.keys.includes(_row[this.selectKeys.fKeyS])) {
                    this.$refs.refSearchHelpTable.toggleRowSelection(_row, true);
                  }
                }
              });
            }
          }
        });
      },
      //页签切换(所有值和常用值)
      setTab(tab) {
        if (tab === this.winParams.activeTab) {
          return;
        }
        this.winParams.activeTab = tab;
        if (tab === 0) {
          this.tabStyle.left = 0 + "px";
          this.tabStyle.comFontColor = "";
          this.tabStyle.allFontColor = "#397bfe";
        } else if (tab === 1) {
          this.tabStyle.left = 60 + "px";
          this.tabStyle.comFontColor = "#397bfe";
          this.tabStyle.allFontColor = "";
        }
        this.getSelectParams();
      },

      /***********查询数据(查询、重置、更多筛选、同步数据)**************/
      //查询数据
      getSearch() {
        //点击搜索按钮要把页码重置为1
        this.page.pageNum = 1;
        this.getSelectParams();
      },
      //重置
      setReset() {
        //设置查询条件
        this.setSelectParams(this.objHelp.filter);
        this.getSearch();
      },
      //同步数据
      getSync() {
        syncMdm(this.winParams.baseField).then(res => {
          if (res.code === 200) {
            this.$m("CORE_CLIENT.S005"); //同步成功
            this.getSearch();
          }
        });
      },
      /***********事件处理(排序、多选、双击、确定)**************/
      //排序
      handleSort(column) {
        this.sortGroup[0].sortField = column.prop;
        this.sortGroup[0].sortType = column.order;
        this.getSelectParams();
      },
      //多选
      handleSelectionChange(val) {
        this.listSel = val;
      },
      //双击
      handCellDblclick(row) {
        let arr = [];
        arr.push(row);
        this.okayExitSearchHelp(arr);
      },
      //确定传输数据
      okay() {
        let _listSel = [];
        if (this.listSel.length > 0 && this.selectKeys && this.selectKeys.f !== 6 && this.selectKeys.fKeyS && this.selectKeys.keys.length > 0) {
          for (let i = 0; i < this.listSel.length; i++) {
            if (!this.selectKeys.keys.includes(this.listSel[i][this.selectKeys.fKeyS])) _listSel.push(this.listSel[i]);
          }
        } else {
          _listSel = this.listSel;
        }
        if (_listSel.length === 0) {
          this.$mE("请至少选择一行数据");
        } else {
          this.okayExitSearchHelp(_listSel);
        }
      },
      //返回选中值
      okayExitSearchHelp(selectRows) {
        this.$emit("exitSearchHelp", selectRows, this.winParams.baseField, this.retParam);
        this.winParams.open = false;
        this.closeDialog("okay");
      },
      // 关闭窗口
      cancel() {
        this.winParams.open = false;
        this.closeDialog("cancel");
      },
      //关闭窗口
      closeDialog(type) {
        this.$emit("closeDialog", type);
      },

      /***********常用值(添加、删除、固定常用值条件值)**************/
      //添加常用值
      handleClickRowAdd(row) {
        let params = {
          baseField: this.winParams.baseField,
          baseFixComWhere: this.getBaseFixComWhere(),
          fieldVal: JSON.stringify(row)
        };
        addCommonValues(params).then(res => {
          if (res.code === 200) {
            row.SZDcommonValFlagSZD = "1";
            this.$mS("添加成功");
          }
        });
      },
      //删除常用
      handleClickRowDel(row, index) {
        let params = {
          baseField: this.winParams.baseField,
          baseFixComWhere: this.getBaseFixComWhere(),
          fieldVal: JSON.stringify(row)
        };
        delCommonValues(params).then(res => {
          if (res.code === 200) {
            this.tableData.splice(index, 1);
            this.$mS("删除成功");
          }
        });
      },
      //获取固定常用值条件值
      getBaseFixComWhere() {
        let _baseFixComWhere = "N";
        if (this.winParams.baseFixComFieldArr.length > 0) {
          _baseFixComWhere = "Y";
          for (let i = 0; i < this.winParams.baseFixComFieldArr.length; i++) {
            const _fieldId = this.winParams.baseFixComFieldArr[i];
            const _selectObj = this.selectParams.find(r => r.fieldId === _fieldId);
            if (_selectObj) {
              let _paramValue = _selectObj.fieldVal ? _selectObj.fieldVal.toString() : "";
              _baseFixComWhere = _baseFixComWhere + ":" + _fieldId + "=" + _paramValue;
            }
          }
        }
        return _baseFixComWhere;
      },

      /************************搜索帮助集-选中当前搜索帮助**************************/
      //TAB标签搜索帮助切换事件
      handleTabClick(tab) {
        this.getReqParams(this.selfParams.helpArr, tab, this.selfParams.objStyle);
      },
      //获取配置参数文件 帮助数组,基础字段,样式
      getReqParams(helpArr, fieldCode, objStyle) {
        //记录历史值
        this.selfParams.helpArr = helpArr; //帮助数组
        this.selfParams.objStyle = objStyle; //样式

        this.winParams.activeTabGroup = fieldCode; //帮助集标签
        this.winParams.multipleChoice = objStyle.multipleChoice; //单选多选
        this.winParams.title = objStyle.title; //窗口标题
        this.winParams.groupFlag = objStyle.groupFlag; //帮助集
        this.winParams.baseField = fieldCode; //基础字段

        //获得当前展示的屏幕信息
        let tempHelp = {};
        for (let i = 0; i < helpArr.length; i++) {
          if (helpArr[i].header.fieldCode === fieldCode) {
            tempHelp = helpArr[i];
            break;
          }
        }
        this.getAcceptData(tempHelp);
      },

      /************************输出参数**************************/
      //表格样式
      handleTableLayout() {
        return {
          showMode: ["C", "D"].includes(this.winParams.appViewMode) ? "1" : "0", //显示模式
          viewMode: ["B", "D"].includes(this.winParams.appViewMode) ? "0" : "9",
          viewTitle: this.winParams.viewTitle,
          selection: this.winParams.multipleChoice === 2 ? "2" : "0",
          pagination: this.winParams.noPage ? "0" : "2"
        };
      },
      //表格列
      handleTableFCat() {
        let fCats = [];
        for (let i = 0; i < this.columnParams.length; i++) {
          let item = this.columnParams[i];
          fCats.push({
            field: item.fieldId,
            label: item.fieldName,
            width: item.fieldColWidthApp,
            align: item.fieldColAlign,
            detail: item.fieldColDetail,
            click: true
          });
        }
        return fCats;
      },
      //查询
      handleSearch() {
        this.$refs.refSearchHelpViewSch.callInitData();
      },
      //回调事件-分页
      handleRequestImp() {
        this.getSelectParams();
      },
      //查询事件
      handleSchEventImp(obj) {
        if (obj.fCode === "search") {
          this.getSearch();
        } else if (obj.fCode === "reset") {
          this.setReset();
        }
      },
      //行回调事件
      handleRowEventImp(obj) {
        if (obj.fCode === "$click") {
          this.handCellDblclick(obj.row);
        } else if (obj.fCode === "$view") {
          this.$refs.refSearchHelpViewTableRow.callInitData(obj.index);
        } else if (obj.fCode === "commonAdd") {
          this.handleClickRowAdd(obj.row);
        } else if (obj.fCode === "commonDel") {
          this.handleClickRowDel(obj.row, obj.index);
        }
      }
    }
  };
</script>

<style scoped>
  .tabBox {
    border-bottom: 2px solid #dfe4ed;
    margin-bottom: 10px;
    display: flex;
    color: var(--field-decorator-text-color);
  }

  .tabBoxCol {
    height: 40px;
    display: flex;
    position: relative;
    width: 100px;
    margin-left: 5px;
  }

  .tabBoxTab {
    font-size: 14px;
    width: 50px;
    margin-right: 10px;
    text-align: justify;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 8px;
    font-weight: 500;
  }

  .tabBoxLine {
    background: #397bfe;
    width: 50px;
    height: 2px;
    position: absolute;
    bottom: -2px;
  }

  .searchBox {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 6px;
    flex: 1;
  }
</style>