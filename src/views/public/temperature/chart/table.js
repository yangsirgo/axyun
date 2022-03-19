// 内容区支持形式 gridType
// 1：单行单列文本框（默认）
// 2：单行多列文本框（列数自定义、根据时间刻度）
// 3：多行文本框
// 4: 体征网格
//
// mult 字段为number，用于配置多行多列下的自定义行列数
// 如果gridType值为2的情况下，没有mult，则认定以时间刻度为准
//
// heightGain 单元格行高涨幅,用于给单元格内相邻的展示内容能够错位显示
//
// isTime 用于标记是否是时刻行

// 体征部分 titleType
// 需要为每个体征项增加在左侧显示标题菜单的样式选项
// *** 这些项的Y轴区间都是根据，自身配置的网格对应的刻度线 ***
// 目前体征部分支持如下样式, 下面的为样式，而不仅仅是位置
// 11 ：纵向左侧
// 12 : 纵向右侧
// 21 : 横向左侧
// 22 : 横向右侧
//
// 以1开头的为分隔横向空间样式
// 以2开头的为直接占满横向全格


var DAY_MILL = 86400000;
// 分类配置
var CONFIG = {
  // 默认显示分类
  showCates: [
    "key1",
    "key4",
    "key5",
    "key6",
    "key7",
    "key8",
    "key9",
    "key10",
    "key11",
    "key12",
    "key13",
    "key14"
  ],
  base: {
    key1: {
      name: "日期",
      grid: { height: 40 }
    },
    key2: {
      name: "住院天数",
      grid: { height: 40 }
    },
    key3: {
      name: "术后天数",
      grid: { height: 40 }
    },
    key4: {
      name: "时间",
      grid: { height: 40 }
    },
    key5: {
      name: "脉搏、体温",
      grid: { height: 400 }
    },
    key6: {
      name: "呼吸",
      grid: { height: 40 }
    },
    key7: {
      name: "大便次数",
      grid: { height: 40 }
    },
    key8: {
      name: "尿量（ml）",
      grid: { height: 40 }
    },
    key9: {
      name: "总入量（ml）",
      grid: { height: 40 }
    },
    key10: {
      name: "总出量（ml）",
      grid: { height: 40 }
    },
    key11: {
      name: "血压（mmHg）",
      grid: { height: 40 }
    },
    key12: {
      name: "体重（Kg）",
      grid: { height: 40 }
    },
    key13: {
      name: "身高",
      grid: { height: 40 }
    },
    key14: {
      name: "皮试",
      grid: { height: 40 }
    }
  }
};
var needData = [
  {
    st: 1565193600000,
    d10: { low: "/", high: "130/75" },
    d12: 160,
    d11: "50",
    d13: "",
    d1: 1,
    d2: "",
    d3: [{}, { val: 70, type: 1 }, {}, {}, {}, {}],
    d4: [{}, { val: 36.5, type: 1 }, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null],
    d6: 0
  }
];
var dataSize = 7;

var DEFAULT_CONFIG = {
  // 总宽度	页面总宽度(像素px)
  Layout0001: 700,
  // 总高度	总高度（是否固定高度 影响高度算法）
  Layout0002: 1000,
  // 标题行高	上部标题行高
  Layout0003: 120,
  // 标题列宽	左侧标题栏宽度(像素px)
  Layout0004: 120,
  // 显示天数	每页显示天数
  Layout0005: 7,
  // 刻度线数	中部右侧矩形整刻度线条数
  Layout0006: 9,
  // 单元格高度	最小粒度格子高度
  Layout0007: 10,
  // 特殊项目行高	底部特殊项目行高
  Layout0008: 20,
  // 体征部分顶部和底部空余格子数
  Layout0009: 2,
  // 右侧空列宽度
  Layout0010: 80,

  // 医院名称	配置当前医院的名称
  Title0001: "空港医院",
  // 医院名称字号	医院名称字号
  Title0002: 30,
  // 标题名称	标题名称
  Title0003: "体温表",
  // 标题名称字号	标题名称字号
  Title0004: 16,
  // 全局文字字号	全局文字字号
  Title0005: 12,
  // 全局数字字号	全局数字字号
  Title0006: 12,

  // 病人信息项及顺序	打印时需要展示的病人基础信息（维护顺序即为展示顺序）
  // "科室/姓名/住院号/床位号/入院日期",
  ShowItem0001: [
    {
      label: "科室",
      sort: 1,
      key: "k11"
    },
    {
      label: "姓名",
      sort: 2,
      key: "k12"
    },
    {
      label: "住院号",
      sort: 3,
      key: "k13"
    },
    {
      label: "床位号",
      sort: 4,
      key: "k14"
    },
    {
      label: "入院日期",
      sort: 5,
      key: "k15"
    }
  ],
  // 上部标题项及顺序	上部需要展示的标题信息（维护顺序即为展示顺序）
  // "日期/住院天数/术后天数/产后天数/时刻"
  ShowItem0002: [
    {
      label: "日期",
      sort: 1,
      key: "k21"
    },
    {
      label: "住院天数",
      sort: 2,
      key: "k22"
    },
    {
      label: "术后天数",
      sort: 3,
      key: "k23"
    },
    {
      label: "产后天数",
      sort: 4,
      key: "k24"
    },
    {
      label: "时刻",
      sort: 5,
      key: "k25",
      isTime: true,
      gridType: 2
    }
  ],
  // 显示时刻项及顺序	配置需要显示的时刻数值（维护顺序即为展示顺序）
  ShowItem0003: [
    {
      label: "2",
      color: "#000",
      key: "k2"
    },
    {
      label: "6",
      color: "#000",
      key: "k6"
    },
    {
      label: "10",
      color: "#000",
      key: "k10"
    },
    {
      label: "14",
      color: "#000",
      key: "k14"
    },
    {
      label: "18",
      color: "#000",
      key: "k18"
    },
    {
      label: "22",
      color: "#000",
      key: "k22"
    }
  ],
  // 体征标题项及顺序	配置中部左侧需要展示的体征标题（维护顺序即为展示顺序）
  // "呼吸/脉搏/体温/疼痛"
  ShowItem0005: [
    {
      config: "breath",
      label: "呼吸",
      sort: 1,
      key: "k31",
      gridType: 2,
      titleType: 11,
      heightGain: 20
    },
    {
      config: "pulse",
      label: "脉搏",
      sort: 2,
      key: "k32",
      gridType: 4,
      titleType: 11
    },
    {
      config: "temperature",
      label: "体温",
      sort: 3,
      key: "k33",
      gridType: 4,
      titleType: 11
    },
    {
      config: "pain",
      label: "疼痛",
      sort: 4,
      key: "k34",
      gridType: 4,
      titleType: 21
    }
  ],
  // 特殊体征项
  // 血压、身高、过敏等等
  ShowItem0006: [
    {
      label: "血压",
      sort: 1,
      key: "k41",
      gridType: 2,
      mult: 2
    },
    {
      label: "身高",
      sort: 2,
      key: "k42"
    },
    {
      label: "过敏",
      sort: 3,
      key: "k43",
      gridType: 3,
      mult: 2
    }
  ],

  temperature: {
    // 温度刻度范围	温度刻度范围
    // "35 - 42"
    range: {
      max: 42,
      min: 35
    },
    // 最高温度对应刻度线序号	最高温度对应刻度线序号
    topLine: 1,
    // 最低温度对应刻度线序号	最低温度对应刻度线序号
    bottomLine: 9,
    // 单位刻度温度值	相邻刻度线代表的温度范围
    unitValue: 1,
    // 温度对应刻度线位置	1：刻度线上， 2：对齐刻度线，3：刻度线下
    scaleValuePos: 1,
    // 基准温度	基准温度对应的刻度线为红色
    standard: 37,
    // 温度不升显示模式	1：文字，2：向下箭头
    T0007: 1,
    // 温度不升文字颜色	1：黑色，2：红色，3：蓝色
    T0008: 1,
  },

  pulse: {
    // 脉搏刻度范围	脉搏刻度范围
    // "60-200"
    range: {
      max: 200,
      min: 60
    },
    // 最大脉搏对应刻度线序号	最大脉搏对应刻度线序号
    topLine: 1,
    // 最小脉搏对应刻度线序号	最小脉搏对应刻度线序号
    bottomLine: 9,
    // 单位刻度脉搏值	相邻刻度线代表的脉搏范围
    unitValue: 20,
    // 脉搏对应刻度线位置	1：刻度线上， 2：对齐刻度线，3：刻度线下
    scaleValuePos: 1,
    // 基准脉搏	基准脉搏对应的刻度线为红色
    standard: 80,
    // 脉搏心率画线方式	脉搏心率画线方式
    P0007: 1,
  },

  pain: {
    range: {
      max: 10000,
      min: 0
    },
    // 最大疼痛对应刻度线序号	最大疼痛对应刻度线序号
    topLine: 1,
    // 最小疼痛对应刻度线序号	最小疼痛对应刻度线序号
    bottomLine: 7,
    // 单位刻度疼痛值	相邻刻度线代表的疼痛范围
    unitValue: 9,
    // 疼痛对应刻度线位置	1：刻度线上， 2：对齐刻度线，3：刻度线下
    scaleValuePos: 5,
    // 基准疼痛	基准疼痛
    standard: 1,
  },

  breath: {
    // 呼吸刻度范围	呼吸刻度范围
    // "10-40"
    range: {
      max: 40,
      min: 10
    },
    // 最大呼吸对应刻度线序号	最大呼吸对应刻度线序号
    topLine: 6,
    // 最小呼吸对应刻度线序号	最小呼吸对应刻度线序号
    bottomLine: 9,
    // 单位刻度呼吸值	相邻刻度线代表的疼痛范围
    unitValue: 10,
    // 呼吸对应刻度线位置	1：刻度线上， 2：对齐刻度线，3：刻度线下
    scaleValuePos: 1,
  },

  stamp: {
    // 图章显示模式
    Stamp0001: 1,
    // 图章排列方式
    Stamp0002: 1,
    // 上图章大小
    Stamp0003: 1
  }

};

function Chart(config, data) {
  config = DEFAULT_CONFIG;
  data = {
    baseInfo: {},
    list: [
      {
        k11: "科室",
        k12: "姓名",
        k13: "住院号",
        k14: "床号",
        k15: "入院日期",

        k21: "日期",
        k22: "住院天数",
        k23: "产后天数",
        k24: "手术天数",

        k31: [{ value: 1 }],
        k32: [{ value: 1 }],
        k33: [{ value: 1 }],
        k34: [{ value: 1 }],

        k41: [
          { value: "10/20" },
          { value: "20/30" }
        ],
        k42: "身高",
        k43: [{ value: "过敏1" }, { value: "过敏2" }]
      }
    ]
  };

  this.contentWidth = 0;
  this.contentHeight = 0;
  // 展示项配置
  this.itemConfig = [];
  // 网格配置
  this.gridMarkConfig = [];
  this.config = config;
  this.data = data;
  this.initConfig(config);

  this.app = new PIXI.Application(this.SCREEN_WIDTH, this.SCREEN_HEIGHT, {
    resolution: 1,
    autoResize: true,
    antialias: true,
    transparent: false,
    backgroundColor: 0xffffff
  });

  var container = document.getElementById("container");
  this.app.view.style.width = "100%";
  this.app.view.style.height = "auto";
  this.app.view.style["touch-action"] = "auto";
  this.app.renderer.plugins.interaction.autoPreventDefault = false;
  container.appendChild(this.app.view);
  this.scene = this.app.stage;

  this.drawTopInfo();
  this.drawGrid();
  this.drawCell();
  this.drawBpGrid();

  this.draw();
}

// 准备工作
// ====================================
// ====================================
// ====================================
// ====================================

Chart.prototype.initConfig = function(config) {
  // 画布宽度
  this.SCREEN_WIDTH = document.body.clientWidth;
  // 画布高度
  this.SCREEN_HEIGHT = this.SCREEN_WIDTH * 2; //document.documentElement.clientHeight;

  this.CONTENT_WIDTH = config.Layout0001;
  // 两侧留白间隙
  this.SPACE_BETWEEN = (this.SCREEN_WIDTH - this.CONTENT_WIDTH) / 2;
  // 顶部留白,网格的起始点
  this.SPACE_TOP = config.Layout0003;
  // 横轴高度
  this.HORIZONTAL_HEIGHT = config.Layout0008;
  // 纵轴宽度
  this.VERTICAL_WIDTH = config.Layout0004;
  // 默认展示最小天数
  this.MIN_DAY = config.Layout0005;
  // 体征部分的高度
  this.SIGN_HEIGHT =
    ((config.Layout0006 - 1) * 5 + config.Layout0009 * 2) * config.Layout0007;
  // 最小格子高度
  this.SIGN_MINI_HEIGHT = config.Layout0007;
  // 最小各自宽度
  this.SIGN_MINI_WIDTH =
    (this.CONTENT_WIDTH - this.VERTICAL_WIDTH) /
    (config.Layout0005 * config.ShowItem0003.length);

  // 横轴单格长度
  this.DAY_WIDTH =
    (this.SCREEN_WIDTH - this.SPACE_BETWEEN * 2 - this.VERTICAL_WIDTH) /
    this.MIN_DAY;

  // 网格的绘制范围
  this.START_X = this.SPACE_BETWEEN;
  this.END_X = this.SCREEN_WIDTH - this.SPACE_BETWEEN;
  this.CONTENT_END_X = this.END_X - this.config.Layout0010;
  this.START_Y = this.SPACE_TOP;

  // 配置文字样式
  // ====================================================================
  GraphStyle.baseTextStyle.fontSize = this.config.Title0005;

  // 计算各个显示项的Y轴坐标
  // =====================================================================

  var countY = this.START_Y;
  // 从上至下，根据配置
  // 生成体温单的纵轴配置

  // 1. 顶部个人信息
  for (let i = 0; i < this.config.ShowItem0002.length; i++) {
    const cfg = this.config.ShowItem0002[i];
    // 单元格为多行，并且是竖向多行，计算高度要考虑
    let y2 = countY + this.HORIZONTAL_HEIGHT;
    if (cfg.gridType == 3 && cfg.mult && cfg.mult > 1) {
      y2 = countY + this.HORIZONTAL_HEIGHT * cfg.mult;
    }
    if (cfg.heightGain) {
      y2 += cfg.heightGain;
    }
    let item = {
      ...cfg,
      y1: countY,
      y2: y2,
      height: y2 - countY
    };
    countY = y2;
    this.contentHeight += item.height;
    this.itemConfig.push(item);
  }
  // 2. 网格部分
  // TODO 根据不同的配置，生成不同的菜单刻度配置
  this.gridConfig = {
    label: "",
    y1: countY,
    y2: countY + this.SIGN_HEIGHT,
    height: this.SIGN_HEIGHT
  };
  countY += this.SIGN_HEIGHT;
  this.contentHeight += this.gridConfig.height;
  this.itemConfig.push(this.gridConfig);

  // 体征部分比较特殊，可以设定每类体征项目显示的位置
  // 可以下试在网格部分的左侧、下部、右侧
  // 处于底部的，依旧要按正常的横向来处理
  for (let i = 0; i < this.config.ShowItem0005.length; i++) {
    const cfg = this.config.ShowItem0005[i];
    // 体征部分也有需要用单元格显示的
    if (cfg.gridType == 2 || cfg.gridType == 3) {
      let y2 = countY + this.HORIZONTAL_HEIGHT;
      if (cfg.gridType == 3 && cfg.mult && cfg.mult > 1) {
        y2 = countY + this.HORIZONTAL_HEIGHT * cfg.mult;
      }
      if (cfg.heightGain) {
        y2 += cfg.heightGain;
      }
      let item = {
        ...cfg,
        y1: countY,
        y2: y2,
        height: y2 - countY,
        heightGain: cfg.heightGain
      };
      countY = y2;
      this.itemConfig.push(item);
      this.contentHeight += item.height;
    } else if (cfg.gridType == 4){

    }
  }

  // 3. 特殊体征项
  for (let i = 0; i < this.config.ShowItem0006.length; i++) {
    const cfg = this.config.ShowItem0006[i];
    // 单元格为多行，并且是竖向多行，计算高度要考虑
    let y2 = countY + this.HORIZONTAL_HEIGHT;
    if (cfg.gridType == 3 && cfg.mult && cfg.mult > 1) {
      y2 = countY + this.HORIZONTAL_HEIGHT * cfg.mult;
    }
    if (cfg.heightGain) {
      y2 += cfg.heightGain;
    }
    let item = {
      ...cfg,
      y1: countY,
      y2: y2,
      height: y2 - countY
    };
    countY = y2;
    this.contentHeight += item.height;
    this.itemConfig.push(item);
  }
};

// 绘制顶部个人信息
Chart.prototype.drawTopInfo = function() {
  // 主标题
  var title = this.drawText(
    this.config.Title0001,
    this.SCREEN_WIDTH / 2,
    this.SPACE_TOP / 2 - 20,
    {
      fontSize: this.config.Title0002,
      fill: ["#605D5A"]
    }
  );
  this.hospName = title;
  title.anchor.x = 0.5;
  title.anchor.y = 1;
  this.scene.addChild(title);

  // 副标题
  var subtitle = this.drawText(
    this.config.Title0003,
    this.SCREEN_WIDTH / 2,
    this.SPACE_TOP / 2,
    {
      fontSize: this.config.Title0004,
      fill: ["#605D5A"]
    }
  );
  subtitle.anchor.x = 0.5;
  subtitle.anchor.y = 1;
  this.scene.addChild(subtitle);

  // 体温单格子上的文字
  let baseInfoText = "";
  for (let i = 0; i < this.config.ShowItem0001.length; i++) {
    const item = this.config.ShowItem0001[i];
    baseInfoText +=
      item.label + ":" + (this.data.baseInfo[item.key] || "--") + "        ";
  }
  var baseInfo = this.drawText(
    baseInfoText,
    this.START_X + 5,
    this.START_Y - 5,
    {
      fontSize: 13,
      fill: ["#605D5A"]
    }
  );
  baseInfo.anchor.x = 0;
  baseInfo.anchor.y = 1;
  this.scene.addChild(baseInfo);
};

// 三测单的网格都是固定的
Chart.prototype.drawGrid = function() {
  // 网格四边
  this.scene.addChild(
    this.drawLine(
      this.START_X,
      this.START_Y,
      this.END_X,
      this.START_Y,
      GraphStyle.chartLine
    )
  );
  this.scene.addChild(
    this.drawLine(
      this.START_X,
      this.START_Y,
      this.START_X,
      this.START_Y + this.contentHeight,
      GraphStyle.chartLine
    )
  );
  this.scene.addChild(
    this.drawLine(
      this.END_X,
      this.START_Y,
      this.END_X,
      this.START_Y + this.contentHeight,
      GraphStyle.chartLine
    )
  );
  this.scene.addChild(
    this.drawLine(
      this.START_X,
      this.START_Y + this.contentHeight,
      this.END_X,
      this.START_Y + this.contentHeight,
      GraphStyle.chartLine
    )
  );

  // 项目横线
  for (var i = 0; i < this.itemConfig.length; i++) {
    var config = this.itemConfig[i];
    this.scene.addChild(
      this.drawLine(
        this.START_X,
        config.y2,
        this.END_X,
        config.y2,
        GraphStyle.chartLine
      )
    );
  }

  // 菜单分割线
  this.scene.addChild(
    this.drawLine(
      this.START_X + this.VERTICAL_WIDTH,
      this.START_Y,
      this.START_X + this.VERTICAL_WIDTH,
      this.START_Y + this.contentHeight,
      GraphStyle.chartLine
    )
  );

  // 日期分割线
  for (let i = 1; i < this.MIN_DAY; i++) {
    let x = this.START_X + this.VERTICAL_WIDTH + i * this.DAY_WIDTH;
    this.scene.addChild(
      this.drawLine(
        x,
        this.START_Y,
        x,
        this.START_Y + this.contentHeight,
        GraphStyle.chartLine
      )
    );
  }

  // 标题文字
  for (var i = 0; i < this.itemConfig.length; i++) {
    var config = this.itemConfig[i];
    if (!config.label) {
      continue;
    }
    var text = this.drawText(
      config.label,
      this.START_X + this.VERTICAL_WIDTH / 2,
      config.y1,
      GraphStyle.baseTextStyle
    );
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
    text.y = config.y1 + (config.y2 - config.y1) / 2;

    this.scene.addChild(text);
  }
};

// 绘制网格
Chart.prototype.drawBpGrid = function() {
  var config = this.gridConfig;
  var x1 = this.START_X + this.VERTICAL_WIDTH;
  var x2 = this.END_X;
  var y1 = config.y1;
  var height = config.height;

  // 网格的横向副线
  let bufNum = this.config.Layout0009 * 2
  let gridCountY =
    bufNum + (this.config.Layout0006 - 1) * 5;
  for (let i = 0; i < gridCountY; i++) {
    var childY = y1 + i * this.SIGN_MINI_HEIGHT;
    var mainLine = (i - bufNum) % 5 == 0;
    if (mainLine) {
      this.gridMarkConfig.push({
        y: childY
      });
    }
    this.scene.addChild(
      this.drawLine(
        x1,
        childY,
        x2,
        childY,
        mainLine ? GraphStyle.alpha0_3Line : GraphStyle.chartLine
      )
    );
  }

  // 网格纵向副线
  let gridCountX = this.config.Layout0005 * this.config.ShowItem0003.length;
  for (let i = 0; i < gridCountX; i++) {
    var childX = x1 + i * this.SIGN_MINI_WIDTH;
    this.scene.addChild(
      this.drawLine(
        childX,
        y1,
        childX,
        y1 + this.SIGN_HEIGHT,
        GraphStyle.alpha0_3Line
      )
    );
  }
};

// 绘制特殊格子以及特殊内容
Chart.prototype.drawCell = function() {
  // 绘制多行多列的格子
  for (let i = 0; i < this.itemConfig.length; i++) {
    const cfg = this.itemConfig[i];
    // 单行多列
    if (cfg.gridType == 2) {
      let num = cfg.mult || this.config.ShowItem0003.length;
      for (let k = 0; k < this.MIN_DAY; k++) {
        let startX = this.START_X + this.VERTICAL_WIDTH + k * this.DAY_WIDTH;
        for (let j = 1; j < num; j++) {
          let x = startX + (j * this.DAY_WIDTH) / num;
          this.scene.addChild(
            this.drawLine(x, cfg.y1, x, cfg.y2, GraphStyle.chartLine)
          );
        }
      }
      // 单列多行
    } else if (cfg.gridType == 3 && cfg.mult) {
      let num = cfg.mult;
      let startX = this.START_X + this.VERTICAL_WIDTH;
      let endX = this.START_X + this.CONTENT_WIDTH;
      for (let k = 1; k < num; k++) {
        let y = cfg.y1 + (k * (cfg.y2 - cfg.y1)) / num;
        this.scene.addChild(
          this.drawLine(startX, y, endX, y, GraphStyle.chartLine)
        );
      }
    }
  }

  // 绘制时间刻度文字
  for (let i = 0; i < this.itemConfig.length; i++) {
    const cfg = this.itemConfig[i];
    if (!cfg.isTime) {
      continue;
    }
    let num = this.config.ShowItem0003.length;
    for (let k = 0; k < this.MIN_DAY; k++) {
      let startX = this.START_X + this.VERTICAL_WIDTH + k * this.DAY_WIDTH;
      for (let j = 0; j < num; j++) {
        let item = this.config.ShowItem0003[j];
        let x = startX + (j * this.DAY_WIDTH) / num + this.DAY_WIDTH / num / 2;
        let timeText = this.drawText(item.label, x, cfg.y1 + cfg.height / 2, {
          ...GraphStyle.baseTextStyle,
          fill: item.color
        });
        timeText.anchor.x = 0.5;
        timeText.anchor.y = 0.5;
        this.scene.addChild(timeText);
      }
    }
  }
};

// 计算体征项的区局划分，绘制网格的标题
// 并且解析出来纵向纵向坐标对应的值域
// 便于后续的点的绘制
Chart.prototype.drawGridTitle = function () {
  let signTitleConfig = [];

  let left = [];
  let right = [];
  for (let i = 0; i < this.config.ShowItem0005.length; i++) {
    const item = this.config.ShowItem0005[i];
    item.y1 = this.gridMarkConfig[item.topLine].y;
    item.y2 = this.gridMarkConfig[item.bottomLine].y;
    if (item.titleType == 11) {
       left.push(item);
    } else if (item.titleType == 12) {
      right.push(item);
    } 
  }
  if (left.length) {
    let plen = this.VERTICAL_WIDTH / left.length;
    for (let i = 0; i < left.length; i++) {
      const item = left[i];
      item.x1 = this.START_X + i * plen;
      item.x2 = item.x1 + plen;
      item.plen = plen;
    }
  }
  
};

// 画圆
Chart.prototype.drawCircle = function(x, y, circleStyle) {
  var circle = new PIXI.Graphics();
  if (circleStyle.lineWidth && circleStyle.lineColor) {
    circle.lineStyle(circleStyle.lineWidth, circleStyle.lineColor);
  }
  if (circleStyle.color) {
    circle.beginFill(circleStyle.color);
  }
  circle.drawCircle(x, y, circleStyle.radius);
  if (circleStyle.color) {
    circle.endFill();
  }
  return circle;
};

// 画线
Chart.prototype.drawLine = function(x1, y1, x2, y2, style) {
  var line = new PIXI.Graphics();
  line.lineStyle(style.lineWidth, style.color, style.alpha);
  line.moveTo(x1, y1);
  line.lineTo(x2, y2);
  line.endFill();
  return line;
};

// 画连续线
Chart.prototype.drawLineByPaths = function(paths, style) {
  var line = new PIXI.Graphics();
  line.lineStyle(style.lineWidth, style.color, style.alpha);
  if (paths.length <= 2) {
    return line;
  }
  line.moveTo(paths[0], paths[1]);
  for (var i = 2; i < paths.length; i += 2) {
    var x = paths[i];
    var y = paths[i + 1];
    line.lineTo(x, y);
    // line.bezierCurveTo(x * 0.87, y * 0.98, x * 0.6, y * 1.0, x, y);
  }
  line.endFill();
  return line;
};

// 画虚线
Chart.prototype.drawDottedLine = function(x1, y1, x2, y2, style) {
  var line = new PIXI.Graphics();
  line.lineStyle(style.lineWidth, style.color, style.alpha);
  line.moveTo(x1, y1);
  line.drawDashLine(x2, y2, style.dash, style.gap);
  line.endFill();
  return line;
};

// 画曲线
Chart.prototype.drawCurve = function(x1, y1, x2, y2, style) {
  var line = new PIXI.Graphics();
  line.lineStyle(style.lineWidth, style.color, style.alpha);
  line.bezierCurveTo(x1, y1, x2, y2, 0.2, 0.2);
  line.endFill();
  return line;
};

// 根据中心点获取三角形三个顶点
Chart.prototype.getTrianglePaths = function(x, y, side, type) {
  var b = side / 2;
  var c = Math.sqrt(4 / 3) * b;
  var a = c / 2;

  var path = [];
  switch (type) {
    case "top":
      path = [x, y - c, x + b, y + a, x - b, y + a];
      break;
    case "right":
      path = [x - a, y - b, x + c, y, x - a, y + b];
      break;
    case "bottom":
      path = [x - b, y - a, x + b, y - a, x, y + c];
      break;
    case "left":
      path = [x - c, y, x + a, y - b, x + a, y + b];
      break;
    default:
      break;
  }
  return path;
};

// 画三角
Chart.prototype.drawTriangle = function(x, y, type, style) {
  var path = this.getTrianglePaths(x, y, 10, type);
  var graphics = new PIXI.Graphics();
  if (style.lineWidth && style.lineColor) {
    graphics.lineStyle(style.lineWidth, style.lineColor);
  }
  if (style.color) {
    graphics.beginFill(style.color, 1);
  }
  graphics.drawPolygon(path);
  if (style.color) {
    graphics.endFill();
  }
  return graphics;
};

// 画五星
Chart.prototype.drawStar = function(x, y, style) {
  var graphics = new PIXI.Graphics();
  if (style.lineWidth && style.lineColor) {
    graphics.lineStyle(style.lineWidth, style.lineColor);
  }
  if (style.color) {
    graphics.beginFill(style.color, 1);
  }
  graphics.drawStar(x, y, 5, 50);
  if (style.color) {
    graphics.endFill();
  }
  return graphics;
};

// 画文字
Chart.prototype.drawText = function(content, x, y, style) {
  var basicText = new PIXI.Text(content, style);
  basicText.x = x;
  basicText.y = y;
  return basicText;
};

// 画带圆角的矩形
Chart.prototype.drawRoundedRect = function(x, y, width, height, style) {
  var graphics = new PIXI.Graphics();
  if (style.lineWidth && style.lineColor) {
    graphics.lineStyle(style.lineWidth, style.lineColor);
  }
  if (style.color) {
    graphics.beginFill(style.color, style.alpha || 0.5);
  }
  graphics.drawRoundedRect(x, y, width, height, style.radius);
  graphics.endFill();
  return graphics;
};

Chart.prototype.drawX = function(x, y, style) {
  var line = new PIXI.Graphics();
  line.lineStyle(style.lineWidth, style.color, style.alpha);
  line.moveTo(x - 3, y - 3);
  line.lineTo(x + 3, y + 3);
  line.moveTo(x + 3, y - 3);
  line.lineTo(x - 3, y + 3);
  line.endFill();
  return line;
};

// 画遮罩
Chart.prototype.drawShadow = function(paths, color, alpha) {
  var graphics = new PIXI.Graphics();
  graphics.beginFill(color, alpha);
  graphics.drawPolygon(paths);
  graphics.endFill();
  return graphics;
};

// 计算文字的宽高
Chart.prototype.getWordsSize = function(text, style) {
  var text = new PIXI.Text(text, style);
  return {
    width: text.width,
    height: text.height
  };
};

// 开始画
// ====================================
// ====================================
// ====================================
// ====================================

Chart.prototype.draw = function() {
  for (let i = 0; i < this.itemConfig.length; i++) {
    let cfg = this.itemConfig[i];
    if (cfg.isTime) {
      continue;
    }
    if (cfg.gridType == 4) {
      this.drawGridType4(cfg);
    } else if (cfg.gridType == 3) {
      this.drawGridType3(cfg);
    } else if (cfg.gridType == 2) {
      this.drawGridType2(cfg);
    } else {
      this.drawGridType1(cfg);
    }
  }

  // this.drawPulseTemp(data.datas);
  // this.drawBreath(data.datas);
  // this.drawBp(data.datas);
  // this.drawStamp(data.datas);
  // this.drawBaseInfo(data);
};



// 绘制单格内容
Chart.prototype.drawGridType1 = function(cfg) {
  for (let j = 0; j < this.MIN_DAY; j++) {
    let item = this.data.list[j];
    if (!item) {
      break;
    }
    let x =
      this.START_X +
      this.VERTICAL_WIDTH +
      j * this.DAY_WIDTH +
      this.DAY_WIDTH / 2;
    let text = this.drawText(
      item[cfg.key],
      x,
      cfg.y1 + cfg.height / 2,
      GraphStyle.baseTextStyle
    );
    text.anchor.x = text.anchor.y = 0.5;
    this.scene.addChild(text);
  }
};

// 绘制单格多列内容
Chart.prototype.drawGridType2 = function(cfg) {
  for (let j = 0; j < this.MIN_DAY; j++) {
    let item = this.data.list[j];
    if (!item || !item[cfg.key]) {
      break;
    }
    let startX = this.START_X + this.VERTICAL_WIDTH + j * this.DAY_WIDTH;
    let num = cfg.mult || this.config.ShowItem0003.length;
    for (let k = 0; k < num; k++) {
      if (!item[cfg.key][k]) {
        continue
      }
      let x = startX + (k * this.DAY_WIDTH) / num + this.DAY_WIDTH / num / 2;
      let text = this.drawText(
        item[cfg.key][k].value,
        x,
        cfg.y1 + cfg.height / 2,
        GraphStyle.baseTextStyle
      );
      text.anchor.x = text.anchor.y = 0.5;
      this.scene.addChild(text);
    }
  }
};

// 绘制单格多行内容
Chart.prototype.drawGridType3 = function(cfg) {
  for (let j = 0; j < this.MIN_DAY; j++) {
    let item = this.data.list[j];
    if (!item || !item[cfg.key]) {
      break;
    }
    let x =
      this.START_X +
      this.VERTICAL_WIDTH +
      j * this.DAY_WIDTH +
      this.DAY_WIDTH / 2;
    let num = cfg.mult;
    for (let k = 0; k < num; k++) {
      if (!item[cfg.key][k]) {
        continue
      }
      let y = cfg.y1 + (k * cfg.height) / num + cfg.height / num / 2;
      let text = this.drawText(
        item[cfg.key][k].value,
        x,
        y,
        GraphStyle.baseTextStyle
      );
      text.anchor.x = text.anchor.y = 0.5;
      this.scene.addChild(text);
    }
  }
};

// 绘制网格中的点
Chart.prototype.drawGridType4 = function (cfg) {
  

};

// 根据日期和值定位脉搏的坐标点
Chart.prototype.getPPosByVal = function(i, j, val) {
  var config = CONFIG.base["key5"];
  var gridHeight = config.height;
  var x =
    this.START_X +
    this.VERTICAL_WIDTH +
    i * this.DAY_WIDTH +
    ((j + 0.5) * this.DAY_WIDTH) / 6;
  var y =
    ((180 - val) / (180 - 20)) * (config.y2 - config.y1) +
    config.y1 -
    this.START_Y;

  return {
    x: x,
    y: y
  };
};

// 根据日期和值定位体温的坐标点
Chart.prototype.getTPosByVal = function(i, j, val) {
  var config = CONFIG.base["key5"];
  var gridHeight = config.height;
  var x =
    this.START_X +
    this.VERTICAL_WIDTH +
    i * this.DAY_WIDTH +
    ((j + 0.5) * this.DAY_WIDTH) / 6;
  var y =
    ((42 - val) / (42 - 34)) * (config.y2 - config.y1) +
    config.y1 -
    this.START_Y;

  return {
    x: x,
    y: y
  };
};

// 绘制脉搏、体温
Chart.prototype.drawPulseTemp = function(datas) {
  var ppaths = [];
  var tpaths = [];
  var pelems = [];
  var telems = [];
  for (var i = 0; i < datas.length; i++) {
    var data = datas[i];
    var pdata = data["d3"];
    var tdata = data["d4"];
    var len = Math.max(pdata.length, tdata.length);
    for (var j = 0; j < len; j++) {
      var pitem = pdata[j];
      if (pitem && pitem.val != null) {
        var ppos = this.getPPosByVal(i, j, pitem.val);
        // 脉搏
        var ppoint, pline;
        if (pitem.type == 1) {
          ppoint = this.drawCircle(ppos.x, ppos.y, GraphStyle.tpCircle1);
        } else if (pitem.type == 2) {
          ppoint = this.drawCircle(ppos.x, ppos.y, GraphStyle.tpCircle2);
        }
        ppaths.push({
          x: ppos.x,
          y: ppos.y
        });
        if (ppaths.length > 1) {
          pline = this.drawLine(
            ppaths[ppaths.length - 2].x,
            ppaths[ppaths.length - 2].y,
            ppos.x,
            ppos.y,
            GraphStyle.tpline
          );
          this.scene.addChild(pline);
        }
        this.scene.addChild(ppoint);
        // continue;
      }
      var titem = tdata[j];
      if (titem && titem.val != null) {
        var tpos = this.getTPosByVal(i, j, titem.val);
        // 体温
        var tpoint, tline;
        if (titem.type == 1) {
          tpoint = this.drawX(tpos.x, tpos.y, GraphStyle.ttX);
        } else if (titem.type == 2) {
          tpoint = this.drawCircle(tpos.x, tpos.y, GraphStyle.ttCircle1);
        } else if (titem.type == 3) {
          tpoint = this.drawCircle(tpos.x, tpos.y, GraphStyle.ttCircle2);
        }
        tpaths.push({
          x: tpos.x,
          y: tpos.y
        });
        if (tpaths.length > 1) {
          tline = this.drawLine(
            tpaths[tpaths.length - 2].x,
            tpaths[tpaths.length - 2].y,
            tpos.x,
            tpos.y,
            GraphStyle.ttline
          );
          this.scene.addChild(tline);
        }
        this.scene.addChild(tpoint);
      }
    }
  }
};

// 绘制呼吸
Chart.prototype.drawBreath = function(datas) {
  var config = CONFIG.base["key6"];
  var y1 = config.y1;
  for (var i = 0; i < datas.length; i++) {
    var data = datas[i];
    var gridX = i * this.DAY_WIDTH;
    for (var j = 1; j < 7; j++) {
      var x = gridX + (j * this.DAY_WIDTH) / 6;
      var text = this.drawText(
        data.d5[j],
        x + this.DAY_WIDTH / 12,
        y1 + config.height / 2,
        GraphStyle.baseTextStyle
      );
      text.anchor.x = text.anchor.y = 0.5;
      text.scale.x = text.scale.y = 0.7;
      this.scene.addChild(text);
    }
  }
};

// 绘制血压
Chart.prototype.drawBp = function(datas) {
  var config = CONFIG.base["key11"];
  var y1 = config.y1 + config.height / 2;
  for (var i = 0; i < datas.length; i++) {
    var data = datas[i];
    var x1 =
      this.START_X +
      this.VERTICAL_WIDTH +
      i * this.DAY_WIDTH +
      this.DAY_WIDTH / 4;
    var x2 = x1 + this.DAY_WIDTH / 2;
    var highText = this.drawText(
      data.d10 ? data.d10["high"] : "/",
      x1,
      y1,
      GraphStyle.baseTextStyle
    );
    highText.anchor.x = highText.anchor.y = 0.5;
    this.scene.addChild(highText);

    var lowText = this.drawText(
      data.d10 ? data.d10["low"] : "/",
      x2,
      y1,
      GraphStyle.baseTextStyle
    );
    lowText.anchor.x = lowText.anchor.y = 0.5;
    this.scene.addChild(lowText);
  }
};

// 绘制图章
Chart.prototype.drawStamp = function(datas) {
  var config = CONFIG.base["key4"];
  var y = config.y2;
  for (var i = 0; i < datas.length; i++) {
    var data = datas[i];
    var gridX = i * this.DAY_WIDTH;
    if (data.stamp && data.stamp.length) {
      for (let j = 0; j < data.stamp.length; j++) {
        const item = data.stamp[j];
        var x = gridX + (j * this.DAY_WIDTH) / 6;
        var text = this.drawText(
          item.stampName.split("").join("\n"),
          x + this.DAY_WIDTH / 12,
          y + config.height / 2,
          GraphStyle.stampTextStyle
        );
        text.anchor.x = text.anchor.y = 0.5;
        text.scale.x = text.scale.y = 0.8;
        this.scene.addChild(text);
      }
    }
    // for (var j = 1; j < 7; j++) {
    //   var x = gridX + (j * this.DAY_WIDTH) / 6;
    //   var text = this.drawText(
    //     data.d14[j],
    //     x + this.DAY_WIDTH / 12,
    //     y + config.height / 2,
    //     GraphStyle.baseTextStyle
    //   );
    //   text.anchor.x = text.anchor.y = 0.5;
    //   text.scale.x = text.scale.y = 0.7;
    //   this.scene.addChild(text);
    // }
  }
};
