/**
 * 参数设置
 * */
export const jsplumbOptions = {
  /**
   * 初始化参数
   * */
  init: {
    // 动态锚点、位置自适应
    // Anchors: ['Top', 'TopCenter', 'TopRight', 'TopLeft', 'Right', 'RightMiddle', 'Bottom', 'BottomCenter',
    // 	'BottomRight', 'BottomLeft', 'Left', 'LeftMiddle'
    // ],
    Anchors: ["RightMiddle", "LeftMiddle"],
    // 容器ID
    Container: "efContainer",
    // 连线的样式:  StateMachine状态机、Flowchart具有90度转折点的流程线，Bezier贝塞尔曲线、Straight直线
    Connector: [
      "Flowchart",
      {
        stub: 30,
        gap: 1,
        alwaysRespectStubs: false,
        midpoint: 1,
        cornerRadius: 5
      }
    ],
    // 鼠标不能拖动删除线
    ConnectionsDetachable: false,
    // 删除线的时候节点不删除
    DeleteEndpointsOnDetach: false,
    //端点类型：
    Endpoint: ["Blank", { Overlays: "" }],
    //连线的两端端点样式
    EndpointStyle: {
      fill: "#1879ffa1",
      outlineWidth: 1
    },
    // 是否打开jsPlumb的内部日志记录
    LogEnabled: true,
    //连线的样式
    PaintStyle: {
      // 线的颜色
      stroke: "#666",
      // stroke: '#E0E3E7',
      // 线的粗细，值越大线越粗
      strokeWidth: 1,
      // 设置外边线的颜色，默认设置透明
      outlineStroke: "transparent",
      // 线外边的宽，值越大，线的点击范围越大
      outlineWidth: 10
    },
    // 鼠标滑过线的样式
    HoverPaintStyle: {
      stroke: "#b0b2b5",
      strokeWidth: 1
    },
    //拖动设置
    DragOptions: {
      cursor: "pointer",
      zIndex: 2000
    },
    // 箭头叠加
    Overlays: [
      [
        "Arrow",
        {
          width: 10, // 箭头尾部的宽度
          length: 8, // 从箭头的尾部到头部的距离
          location: 1, // 位置，建议使用0～1之间
          direction: 1, // 方向，默认值为1（表示向前），可选-1（表示向后）
          foldback: 0.623 // 折回，也就是尾翼的角度，默认0.623，当为1时，为正三角
        }
      ]
    ],
    // 绘制图的模式 svg、canvas
    RenderMode: "svg",
    // 滑过锚点效果
    Scope: "jsPlumb_DefaultScope"
  },
  /**
   * 源节点参数配置
   * */
  source: {
    // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
    filter: ".flow-node-drag",
    filterExclude: false,
    anchor: ["RightMiddle", "LeftMiddle"],
    allowLoopback: false,
    maxConnections: -1,
    onMaxConnections: function (info, e) {
      console.log(`超过了最大值连线: ${info.maxConnections}`);
    }
  },
  /**
   * 目标节点参数配置
   * */
  target: {
    // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
    filter: ".flow-node-drag",
    filterExclude: false,
    anchor: ["RightMiddle", "LeftMiddle"],
    allowLoopback: false,
    dropOptions: {
      hoverClass: "ef-drop-hover"
    }
  },
  /**
   * 拖拽参数配置
   * */
  draggable: {
    containment: "parent" //限制节点拖动区域
  }
};

/**
 * 节点列表数据
 * */
export const nodeMenuList = [
  { nodeType: "0", nodeName: "可选任务节点", ico: "user1" },
  { nodeType: "4", nodeName: "必选任务节点", ico: "user" },
  { nodeType: "2", nodeName: "可选会签节点", ico: "duoren" },
  { nodeType: "5", nodeName: "必选会签节点", ico: "duoren2" },
  { nodeType: "3", nodeName: "任务池节点", ico: "gongxiang" },
  { nodeType: "1", nodeName: "判断节点", ico: "lingxing" }
];
