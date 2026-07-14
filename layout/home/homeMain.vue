<template>
  <!-- 菜单-首层为组，二层实际路由 -->
  <div v-if="_menus && _menus.length > 1" class="menu-main">
    <template v-for="item in _menus">
      <!--  分组 -->
      <div v-if="item.children && item.children.length > 0" class="menu-group">
        <!-- 组名称 -->
        <div v-if="item.menuName" class="group-name main-form-label-left-line">{{ item.menuName }}</div>
        <!-- 路由按钮 -->
        <div class="menu-area">
          <template v-for="menu in item.children">
            <div class="but-block" @click="goNav(menu)">
              <!-- 图标 -->
              <div class="but-icon" :style="{ 'background-color': menu.bgColor }">
                <szd-svg :name="menu.icon" :color="menu.iconColor || '#FFFFFF'" />
              </div>
              <!-- 文字 -->
              <div class="but-txt">{{ menu.menuName }}</div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
  <!-- 不分组-按钮信息 -->
  <div v-else-if="_menus && _menus.length === 1 && _menus[0].children && _menus[0].children.length > 0" class="menu-grid">
    <div v-for="(menu, index) in _menus[0].children" @click="goNav(menu)" class="menu-grid-area" :key="index">
      <!-- 图标 -->
      <div class="but-icon">
        <!-- 图标 -->
        <szd-svg :name="menu.icon" :color="menu.iconColor || '#397bfe'" />
      </div>
      <!-- 文字 -->
      <div class="but-txt">{{ menu.menuName }}</div>
    </div>
  </div>
  <!-- 显示应用系统 -->
  <div v-else class="menu-sys-name">{{ SYS_NAME }}系统</div>
</template>

<script setup>
  import "./css/home.scss";
  import { computed } from "vue";
  import szdRouter from "../../client/common/utils/goRouter";

  const props = defineProps({
    userObj: {
      type: Object
    },
    menus: {
      type: Object
    }
  });
  //系统名称
  const SYS_NAME = process.env.VUE_APP_SYS_NAME;
  //系统菜单
  const _menus = computed(() => {
    if (props.menus && process.env.VUE_APP_SYS_CODE && props.menus[process.env.VUE_APP_SYS_CODE]) {
      return props.menus[process.env.VUE_APP_SYS_CODE];
    } else {
      return [];
    }
  });

  //菜单导航
  const goNav = menu => {
    szdRouter.goNav(menu.routerCode);
  };
</script>