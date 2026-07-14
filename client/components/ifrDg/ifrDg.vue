<template>
  <var-popup
    v-model:show="dg.open"
    position="bottom"
    close-on-click-overlay
    class="szd__popup__wrapper_h"
    @close="handleClose"
    :style="{ height: height }">
    <div v-if="showClose" class="szd__popup__top">
      <szd-button label="关闭" type="primary" @click="handleCloseForm" />
    </div>
    <div class="l-ifr-dg">
      <szd-ifr :routerCode="routerCode" :params="params" @close="handleCloseForm" />
    </div>
  </var-popup>
</template>

<script setup>
  import { ref } from "vue";

  const emits = defineEmits(["closeDialog"]);

  const props = defineProps({
    routerCode: {
      type: String,
      default: ""
    },
    params: {
      type: Object
    },
    height: {
      type: String,
      default: "80vh"
    },
    showClose: {
      type: Boolean,
      default: false
    }
  });

  const dg = ref({
    open: true
  });

  const handleCloseForm = () => {
    dg.value.open = false;
  };

  const handleClose = () => {
    emits("closeDialog");
  };
</script>
<style scoped lang="scss">
  .l-ifr-dg {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }
</style>