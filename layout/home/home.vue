<template>
  <div class="menu-container">
    <!-- 菜单信息 -->
    <home-main :menus="menus" />
    <!-- 首页导航 -->
    <home-nav />
  </div>
</template>

<script setup>
  import "./css/home.scss";
  import { onMounted, ref } from "vue";
  import szdStoreSession from "../../client/common/store/storeSession";
  import HomeMain from "./homeMain.vue";
  import HomeNav from "./homeNav.vue";

  //菜单信息
  const menus = ref();

  onMounted(() => {
    initMenus();
  });

  //初始化菜单
  const initMenus = () => {
    menus.value = szdStoreSession.getCoreLogin().menus;
  };
</script>