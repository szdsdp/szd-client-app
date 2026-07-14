<template>
  <div class="szd__tb__wrapper">
    <div class="szd__popup__main" style="padding: 5px 0">
      <szd-card-a v-for="row in props.objData.commentList">
        <!--  内容 -->
        <template #main>
          <span class="card-text-row">
            <div class="title">{{ $t("审批人") }}:</div>
            <div class="content">{{ row.userName }}</div>
          </span>
          <span class="card-text-row">
            <div class="title">{{ $t("审批角色") }}:</div>
            <div class="content">{{ row.apprRole }}</div>
          </span>
          <span class="card-text-row">
            <div class="title">{{ $t("审批意见") }}:</div>
            <div class="content">{{ row.message }}</div>
          </span>
          <span class="card-text-row">
            <div class="title">{{ $t("操作活动") }}:</div>
            <div class="content">{{ row.operate }}</div>
          </span>
          <span v-if="row.agentId" class="card-text-row">
            <div class="title">{{ $t("代办人") }}:</div>
            <div class="content">{{ row.agentId + "." + row.agentName }}</div>
          </span>
          <span class="card-text-row">
            <div class="title">{{ $t("审批时间") }}:</div>
            <div class="content">{{ row.createTime }}</div>
          </span>
        </template>
      </szd-card-a>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    objData: {
      type: Object
    }
  });
</script>