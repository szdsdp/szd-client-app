/**
 * 字段参数
 */
export const c_colParam = {
  val: {
    fieldCodeDb: "", // DB字段代码
    fieldCode: "", // 字段代码
    fieldNameDb: "", // DB字段名称
    fieldName: "", // 字段名称
    fieldTypeDb: "", // DB字段类型
    fieldType: "", //数据类型
    fieldLen: 0, //长度
    fieldPos: 0, //小数位
    isPk: false, // 主键
    fieldSortDb: 0, // DB字段排序
    fieldSort: 0, // 字段排序
    fieldAuto: "", //自动填写 A.自动生成行号 B.删除标记 C.创建时间 D.创建人 E.修改时间 F.修改人 G.唯一Key值-随机 H.唯一Key值-号码对象
    fieldAutoNumo: "", //号码对象
    fieldAutoNumoName: "",
    fieldCache: "", // 映射缓存值 val1 val2 val3 desc
    fieldSch: false, //查询条件
    fieldExists: false, //数据库字段是否存在
    ctrlType: "", //控件类型
    ctrlParam: {}, //控件参数
    tabCatParam: {}, //表格字段参数
    schCatParam: {}, //查询字段参数
    baseType: "", //基础字段 A1:搜索帮助 A2:下拉框
    baseValue: "",
    baseParam: {},
    checkType: "", //检查类型 B1:数据库 B2:数据字典 B3:缓存
    checkValue: "",
    checkParam: {},
    moveType: "", //赋值类型 C1:数据库 C2:数据字典(键值.描述) C3:数据字典(描述) C4:直接复制 C5:汇总 C6:固定值 C7:缓存
    moveValue: "",
    moveParam: {},
    clickType: "", //点击穿透 D1:固定路由代码 D2:动态路由代码
    clickValue: "",
    clickParam: {} //点击参数
  },
  upd: {
    fieldCode: true, //字段代码
    fieldCodeDb: true,
    fieldName: false, //字段名称
    fieldNameDb: true,
    fieldType: true, //数据类型
    fieldTypeArr: [], //数据类型数组-用于选择
    fieldLen: true, //长度
    fieldPos: true, //小数位
    fieldAuto: true, //自动填写 A.自动生成行号 B.删除标记 C.创建时间 D.创建人 E.修改时间 F.修改人 G.唯一Key值-随机 H.唯一Key值-号码对象
    fieldAutoArr: [], //自动填写-用于选择
    fieldCache: false,
    fieldSch: false,
    ctrlType: false, //控件类型
    ctrlTypeArr: [], //控件类型数组-用于选择
    ctrlParam: {}, //控件参数
    tabCatParam: {}, //表格字段参数
    schCatParam: {}, //查询字段参数
    baseType: false, //基础字段
    checkType: false, //检查字段
    moveType: false, //赋值类型
    clickType: false //点击穿透
  }
};

/**
 * 控件参数默认值
 */
export const c_colCtrlParam = {
  val: {
    numDot: undefined, //千分位符
    numMax: undefined, //最大值
    numMin: undefined, //最小值
    placeholder: undefined, //占位文本
    maxlength: undefined, //最大长度
    readonly: false, //仅显示
    disabled: false, //不可用
    noShow: false, //不显示
    clearable: false, //显示清除
    align: undefined, //对齐方式
    noZero: false, //不显示0
    format: undefined, //格式化
    formatObj: undefined, //格式化对象或内置格式化
    max: undefined, //最大值
    min: undefined, //最小值
    step: undefined, //步进
    checkboxAll: undefined, //多复选框 显示全选
    first: false, //值为空默认第一个
    rows: 2, //显示行数
    showWordLimit: false, //显示字数
    uploadParam: {}, //附件上传参数
    span: undefined, //栅格列数
    labelWidth: undefined, //标签宽度
    labelWidthVal: undefined,
    labelWidthUnit: undefined,
    required: false, //必输
    descField: undefined, //描述
    descSpan: undefined, //描述宽度
    helpTip: false, //帮助提示
    helpTipCode: "", //帮助提示
    noCopy: false //禁止复制
  },
  upd: {
    numDot: true, //千分位符
    numMax: true, //最大值
    numMin: true, //最小值
    placeholder: true, //占位文本
    maxlength: true, //最大长度
    readonly: true, //仅显示
    disabled: true, //不可用
    noShow: true, //不显示
    clearable: true, //显示清除
    align: true, //对齐方式
    noZero: true, //不显示0
    format: true, //格式化
    max: true, //最大值
    min: true, //最小值
    step: true, //步进
    checkboxAll: true, //多复选框 显示全选
    first: true, //值为空默认第一个
    rows: true, //显示行数
    showWordLimit: true, //显示字数
    uploadParam: true, //附件上传参数
    span: true, //栅格列数
    labelWidth: true, //标签宽度
    required: true, //必输
    descField: true, //描述
    descSpan: true, //描述宽度
    helpTip: true, //帮助提示
    noCopy: true //禁止复制
  }
};

/**
 * table表格字段参数默认值
 */
export const c_tabCatParam = {
  val: {
    width: undefined, //宽度
    minWidth: undefined, //最小宽度
    align: undefined, //对齐方式
    hide: false, //隐藏
    fixed: "", //固定列
    noZero: false, //不输出0
    importSplit: "", //导入分割符
    doSum: "", //汇总,
    helpTip: false, //帮助提示
    noShow: false, //不显示
    appHide: false //App隐藏
  },
  upd: {
    width: false, //宽度
    minWidth: false, //最小宽度
    align: false,
    hide: false, //隐藏
    fixed: false, //固定列
    noZero: false, //不输出0
    importSplit: false, //导入分割符
    doSum: false, //汇总
    helpTip: false, //帮助提示
    noShow: false, //不显示
    appHide: false //App隐藏
  }
};

/**
 * sch查询条件字段参数默认值
 */
export const c_schCatParam = {
  val: {
    noTo: false, //无范围
    noExt: false, //无多选
    disabled: false, //灰色
    readonly: false, //仅读
    clearSpace: false, //删除前后空格
    selectOpt: false, //下拉框
    whereOpt: "", //字符串查询规则操作符
    required: false, //必输
    helpTip: false //帮助提示
  },
  upd: {
    noTo: false, //无范围
    noExt: false, //无多选
    disabled: false, //灰色
    readonly: false, //仅读
    clearSpace: false, //清楚前后空
    selectOpt: false, //下拉框
    whereOpt: false, //字符串查询规则操作符
    required: false, //必输
    helpTip: false //帮助提示
  }
};
