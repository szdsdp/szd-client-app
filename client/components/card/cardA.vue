<template>
  <!-- 卡片显示内容 -->
  <div class="card-a">
    <!-- 标题 -->
    <div v-if="$slots.header" class="card-a-header">
      <slot name="header" />
    </div>

    <!--  内容  -->
    <div class="card-a-main">
      <slot name="main" />
    </div>

    <!-- 表尾 -->
    <div v-if="$slots.footer" class="card-a-footer">
      <slot name="footer" />
    </div>
  </div>
</template>