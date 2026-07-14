<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="getInclude(route)">
        <component :is="wrap(route, Component)" :key="route.fullPath" />
      </keep-alive>
    </router-view>
  </section>
</template>

<script setup>
  import { onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";

  const routeObj = useRoute();
  const router = useRouter();
  const cachedRouteNames = ref([]); //缓存信息
  const visitedRouteStack = ref([]); //路由历史栈

  onMounted(() => {
    router.afterEach(handleRouteChange);
    //添加访问路由栈
    if (routeObj.name && !visitedRouteStack.value.includes(routeObj.name)) {
      visitedRouteStack.value.push(routeObj.name);
    }
  });

  // keepAlive组件添加name
  const wrap = (route, component) => {
    if (component) {
      component.type["name"] = route.name;
    }
    return component;
  };

  //激活keepAlive组件
  const getInclude = route => {
    const keepAlive = route?.meta?.keepAlive;
    const name = route?.name;
    if (keepAlive === true && name && !cachedRouteNames.value.includes(name)) {
      cachedRouteNames.value.push(name);
    }
    return cachedRouteNames.value;
  };

  const handleRouteChange = (to, from) => {
    if (!to.name || !from.name || to.name === from.name) return;
    let stackLength = visitedRouteStack.value.length;
    //检查是否已执行
    if (stackLength > 0 && visitedRouteStack.value[stackLength - 1] === to.name) return;
    //检查是否是回退
    if (stackLength > 1 && visitedRouteStack.value[stackLength - 1] === from.name && visitedRouteStack.value[stackLength - 2] === to.name) {
      //删除最后一个from栈
      visitedRouteStack.value.splice(stackLength - 1, 1);
      //删除缓存
      const _index = cachedRouteNames.value.indexOf(from.name);
      if (_index > -1) {
        cachedRouteNames.value.splice(_index, 1);
      }
    } else {
      //添加到最后
      visitedRouteStack.value.push(to.name);
    }
  };
</script>

<style lang="scss" scoped>
  .app-main {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: auto;
    background-color: var(--page-bg);
  }
</style>