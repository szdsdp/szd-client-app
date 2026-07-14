<template>
  <header class="login-header">
    <div class="login-header__bg" :style="bgStyle" />
    <div v-if="config && config.logoApp" class="login-header__logo">
      <div
        v-if="config.logoApp.status !== '3'"
        class="login-header__logo-slot"
        :style="{ 'border-radius': config.logoApp.radius, background: config.logoApp.bgColor }">
        <var-image v-if="config.logoApp.status === '2'" :src="config.logoApp.imgUrl" width="100px" height="100px" fit="cover" />
        <var-image v-else :src="logoUrl" width="100px" height="100px" fit="cover" />
      </div>
    </div>
  </header>
</template>

<script setup>
  import { computed, onMounted, onUnmounted, ref } from "vue";
  import bgSrc from "../../client/assets/image/home-top-bg.jpg";

  const props = defineProps({
    config: {
      type: Object
    },
    title: {
      type: String,
      default: ""
    }
  });
  //背景样式图片
  const bgStyle = computed(() => {
    return {
      backgroundImage: `url(${bgSrc})`
    };
  });
  //默认logo地址
  const logoUrl = computed(() => {
    return require("../../client/assets/image/logo.png");
  });
  //标题
  const _prevTitle = ref("");

  onMounted(() => {
    _prevTitle.value = document.title;
    if (props.title) document.title = props.title;
  });
  onUnmounted(() => {
    if (_prevTitle.value) document.title = _prevTitle.value;
  });
</script>

<style lang="scss" scoped>
  .login-header {
    position: relative;
    height: 150px;
    flex-shrink: 0;
  }

  .login-header__bg {
    position: absolute;
    inset: 0;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .login-header__logo {
    position: absolute;
    left: 50%;
    bottom: -40px;
    z-index: 2;
    transform: translateX(-50%);
  }

  .login-header__logo-slot {
    width: 100px;
    height: 100px;
    background: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
