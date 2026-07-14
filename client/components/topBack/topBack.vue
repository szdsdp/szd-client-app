<template>
  <div class="top-back">
    <var-icon name="chevron-left" :size="size" @click="emit('click')" />
  </div>
</template>

<script setup>
  const props = defineProps({
    size: {
      type: [String, Number],
      default: "40"
    }
  });
  //事件
  const emit = defineEmits(["click"]);
</script>

<style scoped lang="scss">
  .top-back {
    position: absolute;
    z-index: 3000;
    top: 40px;
    left: 25px;
    border-radius: 50%;
    color: #ffffff;
    background: #397bfe;
  }
</style>