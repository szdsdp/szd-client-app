<template>
  <var-popup v-model:show="dg.open" position="left" close-on-click-overlay class="szd__popup__wrapper_w">
    <div class="szd__popup__top">
      <var-button-group type="default">
        <szd-button v-if="dg.option !== 'V'" label="保存" type="primary" @click="handleSaveForm" />
        <szd-button label="关闭" type="primary" @click="handleCloseForm" />
      </var-button-group>
    </div>

    <div class="szd__popup__main" style="padding: 5px 0">
      <szd-card-a>
        <template #main>
          <template v-for="domItem in codeObj.itemList">
            <tableMaintainDgCtrl
              v-if="!domItem.ctrlParam.noShow"
              :dataObj="dataObj"
              :codeObj="codeObj"
              :domItem="domItem"
              :mDg="dg"
              @setRefUploadView="handleSetRefUploadView" />
          </template>
        </template>
      </szd-card-a>
    </div>
  </var-popup>
</template>

<script setup>
  import { computed, onBeforeMount, ref } from "vue";
  import { $mE, $mS } from "../../common/utils/globalConfig";
  import { szdTr } from "../../components/tr/tr";
  import { initParam } from "../scpBaseCtrl/scpBaseCtrlTableCongigParamInit";
  import { addTableMaintain, getTableConfig, getTableMaintain, updTableMaintain } from "../api/scpTableMaintain";
  import tableMaintainDgCtrl from "./scpTableMaintainDgCtrl.vue";

  //定义事件
  const emit = defineEmits(["okay", "closeForm"]);

  const props = defineProps({
    codeParams: {
      type: Object,
      default: { sysCode: "", program: "", routerCode: "", option: "C" }
    },
    rowObj: {
      type: Object
    },
    option: {
      type: String
    }
  });

  //功能参数
  const dg = ref({
    open: false,
    sysCode: "",
    program: "",
    routerCode: "",
    tr: { trCode: "", operRemark: "", noAct: false },
    option: "V"
  });
  const uploadRefMap = ref(new Map());
  //代码对象
  const codeObj = ref({});
  //数据对象
  const dataObj = computed(() => {
    return props.rowObj ? props.rowObj : {};
  });

  onBeforeMount(() => {
    initDomData();
  });

  //初始化参数
  const initDomData = () => {
    dg.value = {
      sysCode: props.codeParams.sysCode,
      program: props.codeParams.program,
      routerCode: props.codeParams.routerCode,
      tr: { trCode: "", operRemark: "", noAct: false },
      option: props.codeParams.option
    };
    getInitDom();
  };

  //获取初始Dom
  const getInitDom = () => {
    getTableConfig(dg.value.sysCode, dg.value.program).then(resDom => {
      if (resDom && resDom.code === 200) {
        codeObj.value = resDom.data;
        initParam(codeObj.value);
        dg.value.tr.noAct = codeObj.value.header.actTr !== true;
        if (dg.value.option !== "C") {
          getData();
        } else {
          dg.value.open = true;
        }
      } else {
        $mE([dg.value.program, "表获取配置失败", resDom.msg]);
        emit("closeForm");
      }
    });
  };

  //请求数据
  const getData = () => {
    let json = {
      func: { sysCode: dg.value.sysCode, program: dg.value.program, routerCode: dg.value.routerCode },
      dataObj: dataObj.value
    };
    getTableMaintain(dg.value.sysCode, json).then(res => {
      if (res.code === 200) {
        dataObj.value = res.data;
        dg.value.open = true;
      } else {
        $mE(["查询数据失败", res.msg]);
        emit("closeForm");
      }
    });
  };

  //设置上传控件ref
  const handleSetRefUploadView = (fieldCode, ref) => {
    if (fieldCode && ref) uploadRefMap.value.set(fieldCode, ref);
  };

  //保存数据
  const handleSaveForm = () => {
    if (handleSaveFormCheck()) {
      szdTr(dg.value.tr).then(resTr => {
        if (resTr) {
          let json = {
            func: { sysCode: dg.value.sysCode, program: dg.value.program, routerCode: dg.value.routerCode },
            dataObj: dataObj.value,
            tr: resTr
          };
          if (dg.value.option === "C") {
            addTableMaintain(dg.value.sysCode, json).then(res => {
              if (res.code === 200) {
                $mS("保存成功");
                emit("okay", dataObj.value);
                dg.value.open = false;
              } else {
                $mE(["保存失败", res.msg]);
              }
            });
          } else {
            updTableMaintain(dg.value.sysCode, json).then(res => {
              if (res.code === 200) {
                $mS("保存成功");
                emit("okay", dataObj.value);
                dg.value.open = false;
              } else {
                $mE(["保存失败", res.msg]);
              }
            });
          }
        }
      });
    }
  };

  //检查数据
  const handleSaveFormCheck = () => {
    for (let i = 0; i < codeObj.value.itemList.length; i++) {
      const col = codeObj.value.itemList[i];
      if (col.ctrlParam.required) {
        if (col.ctrlType === "upload") {
          let refUploadView = uploadRefMap.value.get(col.fieldCode);
          let fileCount = refUploadView ? refUploadView.getFileCount() : 0;
          if (fileCount === 0) {
            $mE(["[" + col.fieldName + "]附件必须上传"]);
            return false;
          }
        } else if (!dataObj.value[col.fieldCode]) {
          $mE(["[" + col.fieldName + "]必输字段"]);
          return false;
        }
      }
    }
    return true;
  };

  //关闭窗口
  const handleCloseForm = () => {
    dg.value.open = false;
  };

  const handleClose = () => {
    emit("closeForm");
  };
</script>
