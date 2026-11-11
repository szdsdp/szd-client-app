<template>
  <!-- 选择用户 -->
  <var-dialog
      :title="dg.title"
      v-model:show="dg.open"
      :close-on-click-overlay="false"
      @close="closeForm"
      :confirm-button="false"
      :cancel-button="false">
    <template #title>
      <szd-dialog-title :title="dg.title" v-model="dg.open" @close="handleCloseForm"/>
    </template>

    <!-- 功能按钮 -->
    <div class="szd__tb__top" style="justify-content: space-between">
      <div>
        <szd-checkbox-all v-model:data="dg.dataList" @selection-change="handleSelRow"/>
      </div>
      <div>
        <szd-button label="新增" @click="addRow"/>
        <szd-button label="删除" @click="delRow"/>
      </div>
    </div>
    <!-- 表格输出 -->
    <div class="szd__tb__main">
      <szd-card-a v-for="row in dg.dataList" :key="row.itemNo" :footer="false" style="margin-top: 10px">
        <template #header>
          <szd-card-row-title
              v-model="row.$SZDCHECKBOX"
              :index="row.itemNo"
              checkbox
              btnCopy
              btnDelete
              @copy="copyRow(row)"
              @delete="handleRowDelete(row)"/>
        </template>
        <template #main>
          <szd-input
              label="抄送用户"
              v-model="row.ccUserId"
              :desc="row.ccUserName"
              showHelp
              readonly
              :help="{ a: 'CORE_USER', b: row, c: ['ccUserId-userId', 'ccUserName-userName'] }"/>
        </template>
      </szd-card-a>
      <!-- 空状态 -->
      <szd-nothing v-if="!dg.dataList || dg.dataList.length === 0"/>
    </div>

    <template #actions>
      <div class="main-dialog-footer">
        <szd-button label="确定" type="primary" @click="submitForm"/>
        <szd-button label="取消" type="primary" @click="closeForm"/>
      </div>
    </template>
  </var-dialog>
</template>

<script setup>
import {ref} from "vue";
import {$mE, $mS, $t} from "../../common/utils/globalConfig";
import {getWfCcUser, saveWfCcUser} from "../api/wfApi.js";

//功能参数
const dg = ref({
  title: $t("抄送用户"),
  open: false,
  //表头数据
  header: {},
  //列表多选
  listSel: [],
  //数据
  dataList: []
});

//接受并处理
const callWfButtonApprCc = wfInst => {
  dg.value.open = true;
  dg.value.header.wfGrpId = wfInst.wfGrpId;
  dg.value.header.wfId = wfInst.wfId;
  dg.value.header.nodeId = wfInst.nodeId;
  getCcUserList();
};

//确定
const getCcUserList = () => {
  const json = {wfGrpId: dg.value.header.wfGrpId, wfId: dg.value.header.wfId, nodeId: dg.value.header.nodeId};
  getWfCcUser(json).then(res => {
    if (res.code === 200) {
      dg.value.dataList = res.data;
    } else {
      $mE(res.msg);
    }
  });
};

const copyRow = (row) => {
  let newRow = _.cloneDeep(row);
  newRow.itemNo = 0;
  dg.value.dataList.push(newRow)
  setItemNo();
}

const addRow = () => {
  dg.value.dataList.push({});
  setItemNo();
};

//多选行
const handleSelRow = selection => {
  dg.value.listSel = selection;
};

const handleRowDelete = (row) => {
  dg.value.dataList = dg.value.dataList.filter(item => item !== row);
  setItemNo();
}

const delRow = () => {
  if (dg.value.listSel.length === 0) {
    $mE("请选择至少一行数据");
    return;
  }
  dg.value.dataList = dg.value.dataList.filter(item => !dg.value.listSel.some(ele => ele === item));
};

const setItemNo = () => {
  for (let i = 0; i < dg.value.dataList.length; i++) {
    dg.value.dataList[i].itemNo = i + 1;
  }
}

//保存数据
const submitForm = () => {
  if (submitFormCheck()) {
    let json = {
      header: dg.value.header,
      userList: dg.value.dataList
    };
    saveWfCcUser(json).then(res => {
      if (res.code === 200) {
        $mS("保存数据成功");
        getCcUserList();
      }
    });
  }
};

//检查提交数据
const submitFormCheck = () => {
  if (!dg.value.dataList || dg.value.dataList.length === 0) {
    $mE("抄送用户不能为空");
    return false;
  }
  let ckArr = [];
  for (let i = 0; i < dg.value.dataList.length; i++) {
    let _rowNo = i + 1;
    if (!dg.value.dataList[i].ccUserId) {
      $mE(_rowNo + "行用户不能为空");
      return false;
    }
    if (ckArr.includes(dg.value.dataList[i].ccUserId)) {
      $mE(_rowNo + "行用户重复");
      return false;
    } else {
      ckArr.push(dg.value.dataList[i].ccUserId);
    }
  }
  return true;
};

//关闭窗口
const closeForm = () => {
  dg.value.open = false;
};

const handleCloseForm = () => {
  dg.value.open = false;
};

//定义父组件可用方法
defineExpose({
  callWfButtonApprCc
});
</script>