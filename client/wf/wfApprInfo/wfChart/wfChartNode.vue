<template>
  <div ref="node" :class="nodeContainerClass" :style="nodeContainerStyle">
    <!-- 节点类型的图标 -->
    <div class="wf-node">
      <div class="ef-node-left relative">
        <div class="wf-node-left-ico">
          <szd-svg :name="node.self_nodeType_ico" color="#ffffff" />
        </div>
        <div class="ef-node-left-ico-bottom">
          <span v-if="node.addNodeFlag === '0'">加</span>
          <span v-if="node.rejectNodeFlag === '0'" style="padding-left: 2px">拒</span>
          <span v-if="node.postAutoFlag === '1'" style="padding-left: 2px">临</span>
          <span v-if="node.postAutoFlag === '2'" style="padding-left: 2px">自动</span>
        </div>
      </div>

      <div class="wf-node-right">
        <div class="header">
          <div class="header-text">
            <var-tooltip class="tip" :content="node.el_tooltip" placement="top">
              <div class="text">{{ node.nodeName }}</div>
            </var-tooltip>
          </div>
        </div>
        <div class="main">
          <var-tooltip class="tip" :content="node.userName" placement="top">
            <div class="main-inner">{{ node.userName }}</div>
          </var-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import "../css/wfChart.scss";

  export default {
    props: {
      node: Object
    },
    computed: {
      // 节点容器
      nodeContainerClass() {
        return {
          "wf-node-container": true,
          "wf-node-active1": this.node.status == 1,
          "wf-node-active2": this.node.status == 2 || this.node.status == 3,
          "wf-node-active6": this.node.status == 6
        };
      },
      //设置坐标
      nodeContainerStyle() {
        return {
          top: this.node.top,
          left: this.node.left
        };
      }
    }
  };
</script>
