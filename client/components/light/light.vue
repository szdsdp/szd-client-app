<template>
  <szd-svg name="circle" v-if="light == '1'" style="font-size: 14px; color: #f54f4f" />
  <szd-svg name="circle" v-else-if="light == '2'" style="font-size: 14px; color: #ffd70b" />
  <szd-svg name="circle" v-else-if="light == '3'" style="font-size: 14px; color: #5cc22d" />
  <szd-svg name="circle" v-else style="font-size: 14px; color: #909399" />
</template>

<script setup>
  const props = defineProps({
    light: {
      type: [String, Number],
      default: ""
    }
  });
</script>