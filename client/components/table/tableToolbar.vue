<template>
  <!-- 工具栏按钮 -->
  <div v-if="isBtnsShow.btns || isBtnsShow.btnsMore" class="l-table-bar">
    <var-button-group type="default">
      <template v-if="isBtnsShow.btns" v-for="item in _lay.tBar.btns">
        <var-button v-if="item.fstHide !== true" type="primary" :disabled="item.disabled" @click="handleClick(item.fCode)">
          {{ item.label }}
        </var-button>
      </template>
      <!-- 更多 -->
      <var-menu v-if="isBtnsShow.btnsMore" v-model:show="dg.menuOpen" placement="bottom-end" style="border-left: 1px solid #ffffff">
        <szd-button label="更多" type="primary" />
        <template #menu>
          <template v-for="(but, index) in _lay.tBar.btnsMore">
            <template v-if="!but.disabled && but.fstHide !== true">
              <var-cell v-if="index < _lay.tBar.btnsMore - 1" class="main-menu-var-cell" @click="handleClick(but.fCode)">
                {{ $t(but.label) }}
              </var-cell>
              <var-cell v-else style="text-align: center" @click="handleClick(but.fCode)">
                {{ $t(but.label) }}
              </var-cell>
            </template>
          </template>
        </template>
      </var-menu>
    </var-button-group>
  </div>
</template>

<script setup>
  import { ref, computed } from "vue";
  import { $t } from "../../common/utils/globalConfig";

  //回调事件
  const emit = defineEmits(["update:lay", "update:dataObj", "clickToolbar"]);
  const props = defineProps({
    lay: {
      type: Object
    },
    //输出数据
    dataObj: {
      type: Array,
      default: []
    }
  });
  //同步更改的参数-布局
  const _lay = computed({
    get: () => props.lay,
    set: val => {
      emit("update:lay", val);
    }
  });
  //表格数据
  const _dataObj = computed({
    get: () => props.dataObj,
    set: val => {
      emit("update:dataObj", val);
    }
  });
  //窗口对象
  const dg = ref({
    menuOpen: false
  });
  //是否显示按钮
  const isBtnsShow = computed(() => {
    let _isBtnsShow = {
      btns: _lay.value.tBar.btns && _lay.value.tBar.btns.length > 0,
      btnsMore: _lay.value.tBar.btnsMore && _lay.value.tBar.btnsMore.length > 0
    };
    if (_isBtnsShow.btns && _lay.value.tBar.btns.findIndex(r => r.fstHide !== true) > -1) {
      _isBtnsShow.btns = true;
    } else {
      _isBtnsShow.btns = false;
    }
    if (_isBtnsShow.btnsMore && _lay.value.tBar.btnsMore.findIndex(r => !r.disabled && r.fstHide !== true) > -1) {
      _isBtnsShow.btnsMore = true;
    } else {
      _isBtnsShow.btnsMore = false;
    }
    return _isBtnsShow;
  });
  //按钮回调事件
  const handleClick = fCode => {
    switch (fCode) {
      default:
        emit("clickToolbar", { fCode: fCode });
        break;
    }
    dg.value.menuOpen = false;
  };
</script>

<style scoped lang="scss">
  .l-table-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 1;
    padding: 5px;
  }
</style>