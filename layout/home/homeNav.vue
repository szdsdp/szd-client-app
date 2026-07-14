<template>
  <var-bottom-navigation v-model:active="dg.active" fixed style="border-top: 1px solid #f2f3f5">
    <!-- 首页 -->
    <var-bottom-navigation-item name="CORE_APP_00A" :label="$t('首页')" icon="home" @click="handleClick('CORE_APP_00A')" />
    <!-- 扫码 -->
    <var-bottom-navigation-item name="CORE_SCAN" :label="$t('扫码')" icon="barcode-scan" @click="handleClick('CORE_SCAN')" />
    <!-- 我的 -->
    <var-bottom-navigation-item name="CORE_APP_00B" :label="$t('我的')" icon="account-circle" @click="handleClick('CORE_APP_00B')" />
  </var-bottom-navigation>

  <!-- 扫码 -->
  <szd-scan-popup v-model:show="dg.scan.show" @scan="handleScan" />
</template>

<script setup>
  import { nextTick, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import { Picker } from "@varlet/ui";
  import { $t } from "../../client/common/utils/globalConfig";
  import szdRouter from "../../client/common/utils/goRouter";
  import { getByBarCode } from "../api/home";
  //获取当前路由信息
  const route = useRoute();
  //功能参数
  const dg = ref({
    active: "",
    fCode: "",
    scan: {
      show: false
    }
  });

  //监听路由变化
  watch(
    () => route.path,
    () => {
      nextTick(() => {
        setFrame(route);
      });
    },
    { immediate: true }
  );

  const handleClick = fCode => {
    if (fCode === "CORE_SCAN") {
      dg.value.scan.show = true;
      nextTick(() => {
        dg.value.active = dg.value.fCode;
      });
    } else {
      dg.value.active = fCode;
      dg.value.fCode = fCode;
      szdRouter.goNav(fCode);
    }
  };

  const setFrame = to => {
    if (to.name === "CORE_APP_00B") {
      dg.value.active = "CORE_APP_00B";
    } else {
      dg.value.active = "CORE_APP_00A";
    }
    dg.value.fCode = dg.value.active;
  };

  //扫码结果
  const handleScan = scan => {
    dg.value.scan.show = false;
    if (scan.codeArr.length === 1) {
      processScan(scan.codeArr[0]);
    } else if (scan.codeArr.length > 1) {
      picker(scan.codeArr);
    }
  };

  //多码选择
  async function picker(codeArr) {
    let _columns = [[]];
    for (let i = 0; i < codeArr.length; i++) {
      _columns[0].push({ text: codeArr[i] });
    }
    const { state, values } = await Picker({ columns: _columns });
    if (state === "confirm" && values.length === 1) {
      processScan(values[0]);
    }
  }

  //获取配置跳转路由
  const processScan = barCode => {
    if (barCode) {
      getByBarCode(barCode).then(res => {
        if (res.code === 200) {
          szdRouter.goNav(res.data.routerCode, { barCode: barCode });
        }
      });
    }
  };
</script>