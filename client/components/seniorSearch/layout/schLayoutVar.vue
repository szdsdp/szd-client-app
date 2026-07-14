<template>
  <!-- 管理布局 -->
  <var-dialog title="保存变式" v-model:show="dg.open" close-on-click-overlay @close="handleClose" :confirm-button="false" :cancel-button="false">
    <template #title>
      <szd-dialog-title title="保存变式" v-model="dg.open" @close="handleCloseForm" />
    </template>
    <div class="szd__popup__main" style="padding: 5px 0; max-height: 65vh">
      <szd-card-a>
        <template #main>
          <szd-input label="变式代码" v-model="varObj.variant" :maxLenth="50" required />
          <szd-input label="变式名称" v-model="varObj.varName" :maxLenth="100" required />
          <szd-radio
            v-if="props._lay.layout.varMode === 'A'"
            label="可用范围"
            v-model="varObj.varMode"
            :baseArr="[
              { svalue: 'A', sname: $t('所有人可用') },
              { svalue: 'U', sname: $t('仅自己可用') }
            ]"
            required />
        </template>
      </szd-card-a>
      <!-- 表格输出 -->
      <var-table ref="refTable1" border stripe :data="varRule" class="flex-1">
        <thead>
          <tr style="background-color: #eef1f6; font-size: 16px">
            <th style="text-align: center">{{ $t("查询条件") }}</th>
            <th style="text-align: center; width: 100px">{{ $t("不设置") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in varRule">
            <td>{{ row.label }}</td>
            <td style="text-align: center">
              <var-checkbox v-model="row.noVal" />
            </td>
          </tr>
        </tbody>
      </var-table>
    </div>

    <template #actions>
      <div class="main-dialog-footer">
        <szd-button label="保存" type="primary" @click="handleSava" />
        <szd-button label="取消" type="primary" @click="handleClose" />
      </div>
    </template>
  </var-dialog>
</template>

<script setup>
  import { computed, ref } from "vue";
  import { $m, $t } from "../../../common/utils/globalConfig";

  //回调事件
  const emit = defineEmits(["layout-var"]);
  const props = defineProps({
    _lay: {
      type: Object
    }
  });
  //窗口对象
  const dg = ref({
    open: false
  });
  //排序规则
  const varObj = ref({
    variant: "", //变式代码
    varName: "", //变式名称
    varMode: "U", //变式级别
    varDefault: false //默认变式
  });
  //条件字段
  const varRule = computed(() => {
    let rule = [];
    //设置选择的数据
    for (let i = 0; i < props._lay.schCat.length; i++) {
      const item = props._lay.schCat[i];
      rule.push({
        field: item.field,
        label: item.label,
        noVal: false
      });
    }
    return rule;
  });

  //初始化数据
  const callInitData = row => {
    if (row.variant) {
      //设置变式代码和名称
      varObj.value.variant = row.variant;
      varObj.value.varName = row.varName;
      if (row.userId === props._lay.layout.$SZDUserId && row.varMode === "A") {
        varObj.value.varMode = row.varMode;
      }
      varObj.value.varDefault = false;
      //获取配置信息{rule列目录 val值}
      const varLay = JSON.parse(row.varJson);
      if (varLay.rule && Array.isArray(varLay.rule)) {
        for (let i = 0; i < varRule.value.length; i++) {
          const temp = varLay.rule.find(item => item.field === varRule.value[i].field);
          if (temp) {
            varRule.value[i].noVal = temp.noVal;
          }
        }
      }
    }
    //打开窗口
    dg.value.open = true;
  };

  const handleSava = () => {
    if (!varObj.value.variant || !varObj.value.varName) {
      $m("CORE_CLIENT.E046"); //变式代码和变式名称不能为空
      return;
    }
    //回调
    emit("layout-var", varObj.value, varRule.value);
    handleClose();
  };

  const handleCloseForm = () => {
    dg.value.open = false;
  };

  //关闭窗口
  const handleClose = () => {
    dg.value.open = false;
  };

  //定义父组件可以调用方法
  defineExpose({
    callInitData
  });
</script>