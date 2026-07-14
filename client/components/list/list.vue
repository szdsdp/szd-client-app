<template>
  <!-- 下拉 -->
  <var-pull-refresh v-model="_refreshing" @refresh="handleRefresh" :disabled="pullDisabled" :success-duration="0">
    <!-- 列表 -->
    <var-list
      :loading="loading"
      :loading-text="loadingText"
      :finished="_finished"
      :finished-text="finishedText"
      :immediate-check="false"
      @load="handleLoad">
      <!--  行数据 -->
      <template v-if="data.length > 0" v-for="(item, index) in data">
        <slot name="default" :row="item" :$index="index" />
      </template>

      <!-- 未查询到数据 -->
      <template #finished>
        <szd-nothing v-if="nothing && _finished" />
      </template>
    </var-list>
  </var-pull-refresh>
</template>

<script setup>
  import { computed, ref } from "vue";

  //事件
  const emit = defineEmits(["refresh", "load"]);

  const props = defineProps({
    //下拉禁用
    pullDisabled: {
      type: Boolean,
      default: false
    },
    //加载中
    loading: {
      type: Boolean,
      default: false
    },
    //加载描述
    loadingText: {
      type: String
    },
    //完成描述
    finishedText: {
      type: String
    },
    //显示无记录
    nothing: {
      type: Boolean,
      default: true
    },
    //总数量
    total: {
      type: Number,
      default: 0
    },
    //输出数据
    data: {
      type: Array,
      required: true,
      default: () => []
    }
  });

  //下拉刷线
  const _refreshing = ref(false);

  //是否加载完成
  const _finished = computed(() => {
    return props.data.length === 0 || props.data.length >= props.total;
  });

  const handleRefresh = () => {
    emit("refresh");
    _refreshing.value = false;
  };

  const handleLoad = () => {
    emit("load");
  };
</script>