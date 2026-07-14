<template>
  <div class="m-nothing">
    <p>{{ $t(text) }}</p>
  </div>
</template>

<script setup>
  import { $t } from "../../common/utils/globalConfig";

  const props = defineProps({
    text: {
      type: String,
      default: "没有相关内容"
    }
  });
</script>

<style scoped lang="scss">
  .m-nothing {
    padding-top: 140px;
    background: url("../../assets/image/nothing.png") center center no-repeat;
    color: #747474;
    text-align: center;
  }
</style>