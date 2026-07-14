<template>
  <div v-if="isShowContent">
    <searchHelpView ref="searchHelpViewFrom" :selectKeys="selectKeys" @exitSearchHelp="exitSearchHelp" @closeDialog="closeDialog" />
  </div>
</template>

<script>
  import { searchHelpParams } from "../api/searchHelp";
  import searchHelpView from "./searchHelpView.vue";

  export default {
    components: {
      searchHelpView
    },
    props: {
      //基础字段
      baseField: {
        type: String,
        default: ""
      },
      //多选标记
      multipleChoice: {
        type: Number,
        default: 1
      },
      //查询条件
      baseSelect: {
        type: Object,
        default: () => []
      },
      //已选中数据的key
      selectKeys: {
        type: [Object, Boolean],
        default: false
      }
    },
    data() {
      return {
        isShowContent: true,
        //窗口大小及样式
        objStyle: {
          multipleChoice: 1, //单选多选
          title: "搜索帮助",
          groupFlag: false //搜索帮助组
        },
        //搜索帮助集对象
        objGroup: {}
      };
    },
    mounted() {
      //调用数据库
      if (this.baseField) {
        this.acceptData();
      }
    },
    methods: {
      acceptData() {
        //查询基本字段对应的配置信息，包括组信息
        searchHelpParams(this.baseField).then(res => {
          if (res.code === 200) {
            const l_length = res.data.length;
            if (l_length === 0 || (res.data[0].header.groupFlag !== "1" && l_length > 1)) {
              this.$m("CORE_CLIENT.E081", this.baseField); //传入参数错误，请检查基础字段 &
              return;
            }
            //集判断
            if (res.data[0].header.groupFlag === "1" && l_length <= 1) {
              this.$m("CORE_CLIENT.E082", this.baseField); //搜索帮助集配置错误，请检查基础字段 &
              return;
            }
            //窗口大小及样式
            this.objStyle.multipleChoice = this.multipleChoice; //单选多选
            this.objStyle.title = res.data[0].header.title; //窗口标题
            if (l_length > 1) {
              this.objStyle.groupFlag = true; //搜索帮助集
            } else {
              this.objStyle.groupFlag = false; //搜索帮助集
            }
            //设置集
            if (this.objStyle.groupFlag) {
              this.setObjGroup(res.data[0]);
            }
            //设置帮助
            let l_helpArr = [];
            for (let i = this.objStyle.groupFlag ? 1 : 0; i < l_length; i++) {
              //设置查询条件
              if (Array.isArray(this.baseSelect) && this.baseSelect.length > 0) {
                this.setObjFilter(res.data[i].filter, res.data[i].header.fieldCode);
              }
              l_helpArr.push(res.data[i]);
            }
            this.getRequest(l_helpArr, l_helpArr[0].header.fieldCode, this.objStyle);
          }
        });
      },
      //设置集
      setObjGroup(obj) {
        for (let i = 0; i < obj.group.length; i++) {
          const item = obj.group[i];
          if (item.childFieldCode) {
            if (!this.objGroup[item.childFieldCode]) {
              this.objGroup[item.childFieldCode] = [];
            }
            if (item.childGrpField) {
              this.objGroup[item.childFieldCode].push({
                childGrpField: item.childGrpField, //集字段
                childSubField: item.childSubField //子字段
              });
            }
          }
        }
      },
      //设置查询条件
      setObjFilter(filter, fieldCode) {
        for (let i = 0; i < this.baseSelect.length; i++) {
          let l_fieldId = this.baseSelect[i][0];
          //集映射
          if (this.objStyle.groupFlag) {
            l_fieldId = "";
            const l_mapping = this.objGroup[fieldCode];
            for (let j = 0; j < l_mapping.length; j++) {
              if (l_mapping[j].childGrpField === this.baseSelect[i][0]) {
                l_fieldId = l_mapping[j].childSubField;
                break;
              }
            }
          }
          //查询条件赋值
          if (l_fieldId) {
            for (let k = 0; k < filter.length; k++) {
              if (filter[k].fieldId === l_fieldId) {
                filter[k].fieldVal = this.baseSelect[i][1];
                break;
              }
            }
          }
        }
      },
      //输出搜索帮助 帮助数组,基础字段,样式
      getRequest(helpArr, fieldCode, objStyle) {
        this.$refs.searchHelpViewFrom.getReqParams(helpArr, fieldCode, objStyle);
      },
      //选择数据后结果输出处理
      exitSearchHelp(retData, fieldCode, retParam) {
        //集映射
        if (this.objStyle.groupFlag) {
          let l_retGrp = [];
          let l_defFieldId = "";
          const l_mapping = this.objGroup[fieldCode];
          for (let i = 0; i < retData.length; i++) {
            let temp_json = {};
            for (let j = 0; j < l_mapping.length; j++) {
              if (l_mapping[j].childGrpField) {
                if (l_mapping[j].childSubField) {
                  temp_json[l_mapping[j].childGrpField] = retData[i][l_mapping[j].childSubField];
                  //默认回填字段
                  if (l_mapping[j].childSubField === retParam.defFieldId) {
                    l_defFieldId = l_mapping[j].childGrpField;
                  }
                } else {
                  temp_json[l_mapping[j].childGrpField] = "";
                }
              }
            }
            if (Object.keys(temp_json).length > 0) {
              l_retGrp.push(temp_json);
            }
          }
          if (l_retGrp.length === 0) {
            this.$m("CORE_CLIENT.E083", [this.baseField, fieldCode]); //搜索帮助集 & 中的基础字段 & 配置错误
          } else {
            if (l_defFieldId === "") {
              l_defFieldId = l_mapping[0].childGrpField;
            }
            retParam.defFieldId = l_defFieldId;
            this.$emit("handleSH", { data: l_retGrp, param: retParam });
          }
        } else {
          this.$emit("handleSH", { data: retData, param: retParam });
        }
      },
      //关闭窗口触发的事件
      closeDialog(type) {
        this.isShowContent = false;
        if (type !== "okay") {
          this.$emit("closeDialog", "cancel");
        }
      }
    }
  };
</script>