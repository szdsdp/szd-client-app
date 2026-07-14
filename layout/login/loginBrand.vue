<template>
  <div class="login-brand">
    <p class="login-brand__slogan">
      <span class="login-brand__line" aria-hidden="true" />
      <span class="login-brand__slogan-text">{{ slogan }}</span>
      <span class="login-brand__line" aria-hidden="true" />
    </p>
  </div>
</template>

<script setup>
  const props = defineProps({
    slogan: {
      type: String,
      default: ""
    }
  });
</script>

<style lang="scss" scoped>
  .login-brand {
    text-align: center;
    margin-bottom: 28px;
  }

  .login-brand__slogan {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 10px 0 0;
    font-size: 13px;
    color: #9b9b9b;
    letter-spacing: 0.5px;
    line-height: 18px;
  }

  .login-brand__line {
    width: 28px;
    height: 1px;
    background: #dcdcdc;
    flex-shrink: 0;
  }

  .login-brand__slogan-text {
    white-space: nowrap;
  }
</style>
