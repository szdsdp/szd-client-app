<template>
  <!-- 通用分页组件 -->
  <div v-if="_total > 0" class="pagination-container">
    <var-pagination
      :current="_currentPage"
      :size="_pageSize"
      :size-option="_pageSizes"
      :total="total"
      v-bind="$attrs"
      :show-total="handleShowTotal"
      @change="handleChange" />
  </div>
</template>

<script setup>
  import { computed, nextTick } from "vue";
  import szdStoreSession from "../../common/store/storeSession";
  import { $t } from "../../common/utils/globalConfig";

  const props = defineProps({
    //总条数
    total: {
      type: Number,
      default: 0
    },
    //当前第几页
    page: {
      type: Number
    },
    //页大小
    limit: {
      type: Number
    },
    //页范围
    pageSizes: {
      type: Array,
      default: []
    }
  });
  //定义事件
  const emit = defineEmits(["update:page", "update:limit", "pagination"]);

  //总页数
  const _total = computed(() => {
    if (props.total <= 0 && props.page > 1) {
      handleChange(1, _pageSize.value);
    }
    return props.total;
  });

  //当前第几页
  const _currentPage = computed(() => {
    return props.page;
  });

  //页大小
  const _pageSize = computed(() => {
    return props.limit;
  });

  //页范围
  const _pageSizes = computed(() => {
    if (props.pageSizes && props.pageSizes.length > 0) {
      return props.pageSizes;
    } else {
      let _sizes = szdStoreSession.getWebParams("web_table_pagination_app", false);
      if (_sizes) {
        return _sizes;
      } else {
        return [20, 50, 100];
      }
    }
  });

  const handleShowTotal = (total, range) => {
    return $t("共") + " " + total + " " + $t("条");
  };

  //调整第几页
  const handleChange = (current, size) => {
    if (props.page !== current || props.limit !== size) {
      //切换页大小将当前页重置1
      if (props.limit !== size) current = 1;
      //更新信息
      emit("update:page", current);
      emit("update:limit", size);
      nextTick(() => {
        emit("pagination", { page: current, limit: size });
        scrollTo();
      });
    }
  };

  //滚到到头位置
  const scrollTo = () => {
    const els = document.querySelectorAll(".szd__wrapper__scroll__top");
    if (els) {
      els.forEach(item => {
        item.scrollTop = 0;
      });
    }
  };
</script>
<style scoped>
  /* 分页 */
  .pagination-container {
    height: 50px;
    padding: 10px;
    box-sizing: border-box;
    border-top: 1px solid #dfe4ed;

    :deep(.var-field-decorator--standard .var-field-decorator--middle-non-hint) {
      margin-top: 1px;
    }
  }

  .pagination-container .var-pagination {
    justify-content: center;
  }
</style>
