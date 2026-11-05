<template>
  <!-- 工作流按钮组件 -->
  <div class="szd-wf-btn">
    <var-button-group type="default">
      <var-button type="primary" v-if="checkShow('B') && !checkAuthBtn('btn_save')" @click="clickButton('btn_save')">
        {{ getBtnLabel("B", "保存") }}
      </var-button>
      <var-button type="primary" v-if="checkShow('C') && !checkAuthBtn('btn_commit')" @click="clickButton('btn_commit')">
        {{ getBtnLabel("C", "提交") }}
      </var-button>
      <var-button type="primary" v-if="checkShow('D') && !checkAuthBtn('btn_approve')" @click="clickButton('btn_approve')">
        {{ getBtnLabel("D", "同意") }}
      </var-button>
      <var-button type="primary" v-if="checkShow('E') && !checkAuthBtn('btn_reject')" @click="clickButton('btn_reject')">
        {{ getBtnLabel("E", "驳回") }}
      </var-button>
      <var-button type="primary" v-if="checkShow('I')" @click="handleButMore">
        {{ dg.btnMoreShow ? $t("关闭") : getBtnLabel("I", "更多") }}
      </var-button>
    </var-button-group>

    <div v-show="dg.btnMoreShow" class="var-popup__overlay" @click="handleMouseOut" style="z-index: 3099" />

    <div v-show="dg.btnMoreShow" class="wf-btn_more_view">
      <div v-if="checkShow('A') && !checkAuthBtn('btn_save')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_check')">
          {{ getBtnLabel("A", "检查") }}
        </var-button>
      </div>
      <div v-if="checkShow('G') && !checkAuthBtn('btn_image')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_image')">
          {{ getBtnLabel("G", "影像") }}
        </var-button>
      </div>
      <div v-if="checkShow('H') && !checkAuthBtn('btn_record')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_record')">
          {{ getBtnLabel("H", "审批信息") }}
        </var-button>
      </div>
      <div v-if="checkShow('J') && !checkAuthBtn('btn_atta')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_atta')">
          {{ getBtnLabel("J", "附件") }}
        </var-button>
      </div>
      <div v-if="checkShow('K') && !checkAuthBtn('btn_revoke')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_revoke')">
          {{ getBtnLabel("K", "撤回") }}
        </var-button>
      </div>
      <div v-if="checkShow('L') && !checkAuthBtn('btn_transfer')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_transfer')">
          {{ getBtnLabel("L", "转办") }}
        </var-button>
      </div>
      <div v-if="checkShow('M') && !checkAuthBtn('btn_meeting')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_meeting')">
          {{ getBtnLabel("M", "评审") }}
        </var-button>
      </div>
      <div v-if="checkShow('N') && !checkAuthBtn('btn_preAddSign')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_preAddSign')">
          {{ getBtnLabel("N", "前加签") }}
        </var-button>
      </div>
      <div v-if="checkShow('O') && !checkAuthBtn('btn_postAddSign')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_postAddSign')">
          {{ getBtnLabel("O", "后加签") }}
        </var-button>
      </div>
      <div v-if="checkShow('P') && !checkAuthBtn('btn_delete')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_delete')">
          {{ getBtnLabel("P", "作废") }}
        </var-button>
      </div>
      <div v-if="checkShow('Q') && !checkAuthBtn('btn_dyWfId')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_dyWfId')">
          {{ getBtnLabel("Q", "设置流程") }}
        </var-button>
      </div>
      <div v-if="checkShow('R') && !checkAuthBtn('btn_consume')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_consume')">
          {{ getBtnLabel("R", "消费记录") }}
        </var-button>
      </div>
      <!--      <div v-if="checkShow('S') && !checkAuthBtn('btn_vch')" class="wf-btn_row">-->
      <!--        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_vch')">-->
      <!--          {{ getBtnLabel("S", "凭证预览") }}-->
      <!--        </var-button>-->
      <!--      </div>-->
      <div v-if="checkShow('T') && !checkAuthBtn('btn_remind')" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_remind')">
          {{ getBtnLabel("T", "催办") }}
        </var-button>
      </div>
      <div v-if="bussBase" class="wf-btn_row">
        <var-button type="primary" class="wf-btn_more" @click="clickButton('btn_bussBase')">
          {{ $t("业务主体") }}
        </var-button>
      </div>
    </div>

    <!-- 子页面 -->
    <wfButtonAppr ref="refWfButtonAppr" @okaySubmit="okaySubmit" />
    <wfButtonTran ref="refWfButtonTran" @okaySubmit="okaySubmit" />
    <wfButtonAdd ref="refWfButtonAdd" @okaySubmit="okaySubmit" />
    <wfButtonRemind ref="refWfButtonRemind" />
    <wfBussBase ref="refWfBussBase" />
  </div>
</template>

<script setup>
  import "./wfButton.scss";
  import { computed, ref } from "vue";
  import { wfAddMeeting } from "../api/wfApi.js";
  import { $t } from "../../common/utils/globalConfig";
  import wfButtonAppr from "./wfButtonAppr.vue";
  import wfButtonTran from "./wfButtonTran.vue";
  import wfButtonAdd from "./wfButtonAdd.vue";
  import wfButtonRemind from "./wfButtonRemind.vue";
  import wfBussBase from "../wfBussBase/wfBussBase.vue";
  import { szdWf } from "../indexFunction";
  import { szdPop } from "../../common/message/popup";
  import szdRouter from "../../common/utils/goRouter";
  import szdStoreSession from "../../common/store/storeSession";
  import { const_wfOper } from "../js/wfTool";

  //更新数据对象
  const emit = defineEmits(["submit", "consume"]);
  //子屏幕
  const refWfButtonAppr = ref();
  const refWfButtonTran = ref();
  const refWfButtonAdd = ref();
  const refWfButtonRemind = ref();
  const refWfBussBase = ref();

  const props = defineProps({
    //路由代码
    routerCode: {
      type: String
    },
    //按钮权限及参数
    wfOper: {
      type: Object,
      default: () => ({ ...const_wfOper })
    },
    //隐藏按钮
    btnHide: {
      type: String,
      default: ""
    },
    //业务主体
    bussBase: {
      type: Object,
      default: {}
    },
    //业务数据
    data: {
      type: [Object, Array]
    },
    //回调方法
    callMethod: {
      type: Function,
      default: undefined
    }
  });
  //功能参数
  const dg = ref({
    btnMoreShow: false
  });
  //按钮权限及参数
  const _wfOper = computed(() => {
    let _tempWfOper = props.wfOper ? props.wfOper : {};
    if (!_tempWfOper.wfBtn) _tempWfOper.wfBtn = {};
    if (!_tempWfOper.wfBtnParam) _tempWfOper.wfBtnParam = {};
    if (!_tempWfOper.wfOper) _tempWfOper.wfOper = {};
    if (!_tempWfOper.wfDef) _tempWfOper.wfDef = {};
    if (!_tempWfOper.wfInst) _tempWfOper.wfInst = {};
    if (!_tempWfOper.wfAi) _tempWfOper.wfAi = {};
    return _tempWfOper;
  });
  //隐藏按钮
  const checkShow = key => {
    if (props.btnHide && props.btnHide.includes(key)) {
      return false;
    } else if (_wfOper.value.wfBtnParam[key] && _wfOper.value.wfBtnParam[key].active === false) {
      return false;
    }
    return true;
  };
  //检查权限
  const checkAuthBtn = operate => {
    if (!_wfOper.value.wfBtn[operate]) {
      return true;
    } else if (!_wfOper.value.bussId && !["btn_save", "btn_commit", "btn_dyWfId"].includes(operate)) {
      return true;
    } else if (!props.routerCode && ["btn_print"].includes(operate)) {
      return true;
    }
    return false;
  };
  //按钮标签名称
  const getBtnLabel = (key, label) => {
    if (_wfOper.value.wfBtnParam[key] && _wfOper.value.wfBtnParam[key].label) {
      return $t(_wfOper.value.wfBtnParam[key].label);
    } else {
      return $t(label);
    }
  };
  //点击更多
  const handleButMore = () => {
    dg.value.btnMoreShow = !dg.value.btnMoreShow;
  };
  //鼠标移出事件
  const handleMouseOut = () => {
    dg.value.btnMoreShow = false;
  };
  //按钮操作
  const clickButton = operate => {
    dg.value.btnMoreShow = false;
    switch (operate) {
      case "btn_approve": //同意
        refWfButtonAppr.value.callWfDgAppr(operate, _wfOper.value.wfBtnParam["D"], _wfOper.value.wfInst, _wfOper.value.bussId);
        break;
      case "btn_reject": //驳回
        refWfButtonAppr.value.callWfDgAppr(operate, _wfOper.value.wfBtnParam["E"], _wfOper.value.wfInst, _wfOper.value.bussId, getWfRejectReasonFlag());
        break;
      case "btn_print": //打印
        szdWf.goPrint(props.routerCode, _wfOper.value.bussId);
        break;
      case "btn_image": //影像
        szdWf.eisImg({
          bussId: _wfOper.value.bussId,
          szdopt: _wfOper.value.wfOper.szdopt === "V" ? "V" : _wfOper.value.wfBtn.btn_image
        });
        break;
      case "btn_record": //审批信息
        szdWf.wfInfo(_wfOper.value.bussId);
        break;
      case "btn_atta": //附件
        szdWf.eisAtt({
          bussId: _wfOper.value.bussId,
          szdopt: _wfOper.value.wfOper.szdopt === "V" ? "V" : _wfOper.value.wfBtn.btn_atta
        });
        break;
      case "btn_revoke": //撤回
        revokeDoc(operate);
        break;
      case "btn_transfer": //转办
        refWfButtonTran.value.callWfDgTran(operate, _wfOper.value.wfBtnParam["L"]);
        break;
      case "btn_meeting": //评审
        meetingDoc();
        break;
      case "btn_preAddSign": //前加签
        refWfButtonAdd.value.callWfDgAdd(operate);
        break;
      case "btn_postAddSign": //后加签
        refWfButtonAppr.value.callWfDgAppr(operate, _wfOper.value.wfBtnParam["O"], _wfOper.value.wfInst, _wfOper.value.bussId);
        break;
      case "btn_delete": //作废
        deleteDoc(operate);
        break;
      case "btn_dyWfId": //设置动态工作流
        szdRouter.goNav("CORE_WF_10A", { wfId: _wfOper.value.wfBtn.btn_dyWfId, userId: _wfOper.value.userId });
        break;
      case "btn_consume": //消费记录
        emit("consume");
        break;
      case "btn_vch": //凭证预览
        break;
      case "btn_remind": //催办
        refWfButtonRemind.value.callWfDgRemind(operate, _wfOper.value.bussId);
        break;
      case "btn_bussBase": //业务主体
        refWfBussBase.value.callWfDgBussBase(props.bussBase);
        break;
      default:
        submitDoc(operate);
        break;
    }
  };
  //撤回单据
  const revokeDoc = operate => {
    szdPop("是否撤回单据,请确认?").then(() => {
      submitDoc(operate);
    });
  };
  //评审单据
  const meetingDoc = () => {
    wfAddMeeting(_wfOper.value.bussId).then(() => {
      szdRouter.goNav("CORE_PER_07A", { bussId: _wfOper.value.bussId });
    });
  };
  //作废单据
  const deleteDoc = operate => {
    if (_wfOper.value.bussDocId) {
      refWfButtonAppr.value.callWfDgAppr(operate, _wfOper.value.wfBtnParam["P"], _wfOper.value.wfInst, _wfOper.value.bussId, getWfRejectReasonFlag());
    } else {
      szdPop("删除的单据不能恢复,请确认?").then(() => {
        submitDoc(operate);
      });
    }
  };
  //提交数据
  const submitDoc = operate => {
    let wfEvt = {
      operate: operate //操作事件
    };
    okaySubmit(wfEvt);
  };
  //工作流事件提交
  const okaySubmit = wfEvt => {
    wfEvt.userId = _wfOper.value.userId;
    wfEvt.bussId = _wfOper.value.bussId;
    wfEvt.bussDocId = _wfOper.value.bussDocId;
    wfEvt.routerCode = props.routerCode;
    emit("submit", wfEvt);
  };
  //检查是否启用状态
  const getWfRejectReasonFlag = () => {
    if (props.routerCode) {
      const routeObj = szdStoreSession.getCoreLogin().routesObj[props.routerCode];
      if (routeObj && routeObj.wfRejectReasonFlag === true) {
        return true;
      }
    }
    return false;
  };
</script>
