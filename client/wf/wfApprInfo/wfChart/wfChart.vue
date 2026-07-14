<template>
  <div style="height: 100%; width: 100%; overflow: auto; margin-top: 5px; background-color: #ffffff">
    <!-- 流程图 -->
    <div id="efWfChart" ref="efWfChart" class="wf-container" :style="{ minWidth: winWidth, minHeight: winHeight }">
      <!-- 节点输出 -->
      <template v-for="node in nodeList" :key="node.self_id">
        <wfChartNode ref="wfChartNode" :id="node.self_id" :node="node" />
      </template>
    </div>
  </div>
</template>

<script>
  import "../css/wfChart.scss";
  import "../js/jsplumb";
  import { jsplumbOptions } from "../js/designerOptions";
  import { getDesignerInit } from "../js/wfChartFunc.js";
  import wfChartNode from "./wfChartNode.vue";

  export default {
    components: {
      wfChartNode
    },
    data() {
      return {
        nodeList: [],
        winWidth: "2000px",
        winHeight: "100%"
      };
    },
    mounted() {
      //实例化
      this.jsPlumb = jsPlumb.getInstance();
      //导入默认配置
      this.jsPlumb.importDefaults(jsplumbOptions.init);
    },
    methods: {
      initWfChartView(nodeList) {
        if (nodeList) {
          this.nodeList = nodeList;
        } else {
          this.nodeList = [];
        }
        //数据库数据初始化
        getDesignerInit(this.nodeList);
        //设置宽度
        this.setWinWidth();
        //删除全部连接线
        this.jsPlumbDelLine();
        //初始化输出
        this.jsPlumbInit();
      },

      /******************************** jsPlumb操作 ******************************************/
      //页面输出节点和线
      jsPlumbInit() {
        this.jsPlumb.ready(() => {
          // 重绘jsPlumb
          this.jsPlumb.setSuspendDrawing(false, true);
          //等待界面加载完成，在处理jsPlumb相关业务
          this.$nextTick(() => {
            //加载节点
            this.jsPlumbInitLoadNode();
            //加载线
            this.jsPlumbInitLoadLine();
            //将节点输出到页面
            this.jsPlumb.setContainer(this.$refs.efWfChart);
          });
        });
      },
      //加载节点
      jsPlumbInitLoadNode() {
        this.nodeList.forEach(item => {
          this.jsPlumb.draggable(item.self_id, jsplumbOptions.draggable);
        });
      },
      //加载线
      jsPlumbInitLoadLine() {
        for (let i = 0; i < this.nodeList.length; i++) {
          if (this.nodeList[i].self_preId) {
            let arr = this.nodeList[i].self_preId.split(",");
            for (let j = 0; j < arr.length; j++) {
              this.jsPlumb.connect({ source: arr[j], target: this.nodeList[i].self_id });
            }
          }
        }
      },
      //删除节点相关线或全部线
      jsPlumbDelLine() {
        let connections = this.jsPlumb.getAllConnections(); //获取页面所有连线
        let arr = [];
        Object.assign(arr, connections);
        //删除连接点的线
        for (let i = 0; i < arr.length; i++) {
          this.jsPlumb.deleteConnection(arr[i]);
        }
      },

      /******************************** 其它方法 ******************************************/
      //计算面板宽度
      setWinWidth() {
        let max_x = 0;
        let max_y = 0;
        for (let i = 0; i < this.nodeList.length; i++) {
          let left_x = parseInt(this.nodeList[i].left);
          let top_y = parseInt(this.nodeList[i].top);
          if (max_x < left_x) max_x = left_x;
          if (max_y < top_y) max_y = top_y;
        }
        max_x = max_x + 600;
        if (max_x > 2000) this.winWidth = max_x + "px";
        max_y = max_y + 200;
        if (max_y > 400) this.winHeight = max_y + "px";
      }
    }
  };
</script>