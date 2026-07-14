<template>
  <div style="width: 100%; height: 100%; position: relative">
    <iframe v-if="isFrame" :src="iframeSrc" frameborder="0" style="width: 100%; height: 100%" scrolling="auto" />
    <div v-else :id="renderId" style="width: 100%; height: 100%" />
  </div>
</template>

<script setup>
  import { getCurrentInstance, onMounted, ref } from "vue";
  import szdRouter from "../../common/utils/goRouter";
  //系统代码
  const SYS_CODE = process.env.VUE_APP_SYS_CODE;

  const emits = defineEmits(["close"]);

  const { appContext } = getCurrentInstance();

  const props = defineProps({
    routerCode: {
      type: String,
      default: ""
    },
    params: {
      type: Object,
      default: () => ({})
    }
  });
  //是否iframe渲染
  const isFrame = ref(false);
  //iframe渲染地址
  const iframeSrc = ref("");
  //动态Id
  const renderId = ref("renderWrap");

  onMounted(() => {
    initRender();
  });

  const initRender = () => {
    //获取路由对象
    const routerObj = szdRouter.getRouterObj(props.routerCode);
    isFrame.value = !routerObj.iframeVue || routerObj.sysCodeWeb !== SYS_CODE;
    if (isFrame.value) {
      isFrame.value = true;
      iframeSrc.value = szdRouter.goNavPath(props.routerCode, props.params);
    } else {
      renderId.value = "renderWrap" + props.routerCode + Date.now();
      //动态加载
      szdRouter.renderComp({
        context: appContext,
        routerCode: props.routerCode,
        params: props.params,
        renderId: renderId.value,
        callback: () => {
          emits("close");
        }
      });
    }
  };
</script>