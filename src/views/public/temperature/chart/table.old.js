var DAY_MILL = 86400000;
// 分类配置
var CONFIG = {
  // 默认显示分类
  showCates: [
    "key1",
    "key2",
    "key3",
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

// 数据结构
var needData = [
  {
    st: "2019-08-10 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 1,
    d2: "",
    d3: [{}, {}, {}, {}, {}, {}],
    d4: [{}, {}, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null]
  },
  {
    st: "2019-08-11 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 2,
    d2: "",
    d3: [{ type: 1 }, {}, {}, {}, {}, {}],
    d4: [{ type: 1 }, {}, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null]
  },
  {
    st: "2019-08-12 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 3,
    d2: "",
    d3: [{}, {}, {}, {}, {}, {}],
    d4: [{}, {}, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null]
  },
  {
    st: "2019-08-13 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 4,
    d2: "",
    d3: [{}, {}, {}, {}, {}, {}],
    d4: [{}, {}, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null]
  },
  {
    st: "2019-08-14 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 5,
    d2: "",
    d3: [{}, {}, {}, {}, {}, {}],
    d4: [{}, {}, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null]
  },
  {
    st: "2019-08-15 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 6,
    d2: "",
    d3: [{}, {}, {}, {}, {}, {}],
    d4: [{}, {}, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null]
  },
  {
    st: "2019-08-16 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 7,
    d2: "",
    d3: [{}, {}, {}, {}, {}, {}],
    d4: [{}, {}, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null]
  },
  {
    st: "2019-08-17 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 8,
    d2: "",
    d3: [{}, {}, {}, {}, {}, {}],
    d4: [{}, {}, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null]
  },
  {
    st: "2019-08-18 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 9,
    d2: "",
    d3: [{}, {}, {}, {}, {}, {}],
    d4: [{}, {}, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null]
  },
  {
    st: "2019-08-19 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 10,
    d2: "",
    d3: [{}, {}, {}, {}, {}, {}],
    d4: [{}, {}, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null]
  },
  {
    st: "2019-08-20 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 11,
    d2: "",
    d3: [{}, {}, { val: 60, type: 1 }, {}, {}, {}],
    d4: [{}, {}, { val: 38.0, type: 1 }, {}, {}, {}],
    d5: [null, null, 60, null, null, null],
    d6: 0,
    d7: 10,
    d8: 60,
    d9: 70
  },
  {
    st: "2019-08-21 00:00:00",
    d10: { low: "126/56", high: "135/69" },
    d12: 168,
    d11: "56",
    d13: "",
    d1: 12,
    d2: "",
    d3: [{}, { val: 65, type: 1 }, {}, {}, {}, {}],
    d4: [{}, { val: 38.3, type: 1 }, {}, {}, {}, {}],
    d5: [null, 0, null, null, null, null],
    d6: 4,
    d7: 6,
    d8: 56,
    d9: 59
  },
  {
    st: "2019-08-22 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 13,
    d2: "",
    d3: [{}, {}, {}, {}, {}, {}],
    d4: [{}, {}, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null]
  },
  {
    st: "2019-08-23 00:00:00",
    d10: { low: "/", high: "/" },
    d13: "",
    d1: 14,
    d2: "",
    d3: [{}, {}, {}, {}, {}, {}],
    d4: [{}, {}, {}, {}, {}, {}],
    d5: [null, null, null, null, null, null]
  }
];


var dataSize = 7;


function Chart() {
  // 画布宽度
  this.SCREEN_WIDTH = document.body.clientWidth;
  // 画布高度
  this.SCREEN_HEIGHT = this.SCREEN_WIDTH * 2; //document.documentElement.clientHeight;
  // 两侧留白间隙
  this.SPACE_BETWEEN = 20;
  // 顶部留白,网格的起始点
  this.SPACE_TOP = 170;
  // 横轴高度
  this.HORIZONTAL_HEIGHT = 50;
  // 纵轴宽度
  this.VERTICAL_WIDTH = 80;
  // 默认展示最小天数
  this.MIN_DAY = 7;
  // 横轴单格长度
  this.DAY_WIDTH =
    (this.SCREEN_WIDTH - this.SPACE_BETWEEN * 2 - this.VERTICAL_WIDTH) /
    this.MIN_DAY;

  // 网格的绘制范围
  this.START_X = this.SPACE_BETWEEN;
  this.END_X = this.SCREEN_WIDTH - this.SPACE_BETWEEN;
  this.START_Y = this.SPACE_TOP;

  this.curIdx = 0;

  this.contentWidth = 0;
  this.contentHeight = 0;
  this.days = [];

  this.app = new PIXI.Application(this.SCREEN_WIDTH, this.SCREEN_HEIGHT, {
    resolution: 2,
    autoResize: true,
    antialias: true,
    transparent: false,
    backgroundColor: 0xffffff
    // width: 750
  });

  var container = document.getElementById("container");
  this.app.view.style.width = "100%";
  // this.app.view.style.height = (container.offsetWidth / Math.floor(this.app.view.style.width.replace("px", ""))) * 100 + "%";
  this.app.view.style.height = "auto";
  this.app.view.style["touch-action"] = "auto";
  this.app.renderer.plugins.interaction.autoPreventDefault = false;
  container.appendChild(this.app.view);
  this.scene = this.app.stage;

  this.initContent();
  this.drawTopInfo();
  this.drawGrid();
  this.drawBpGrid();
}

// 准备工作
// ====================================
// ====================================
// ====================================
// ====================================

Chart.prototype.drawTopInfo = function() {
  var title = this.drawText("", this.SCREEN_WIDTH / 2, 40, {
    fontSize: 30,
    fill: ["#605D5A"]
  });
  this.hospName = title;
  title.anchor.x = title.anchor.y = 0.5;
  this.scene.addChild(title);

  var subtitle = this.drawText("体温单", this.SCREEN_WIDTH / 2, 80, {
    fontSize: 20,
    fill: ["#605D5A"]
  });
  subtitle.anchor.x = subtitle.anchor.y = 0.5;
  this.scene.addChild(subtitle);

  var info1 = (this.baseInfoText = this.drawText(
    "姓名：       入院日期：        住院号：        科别：",
    this.START_X + 5,
    this.START_Y - 5,
    {
      fontSize: 13,
      fill: ["#605D5A"]
    }
  ));
  info1.anchor.x = 0;
  info1.anchor.y = 1;
  this.scene.addChild(info1);
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

  // 横线
  for (var i = 0; i < CONFIG.showCates.length; i++) {
    var cate = CONFIG.showCates[i];
    var cfg = CONFIG.base[cate];
    this.scene.addChild(
      this.drawLine(
        this.START_X,
        cfg.y2,
        this.END_X,
        cfg.y2,
        GraphStyle.chartLine
      )
    );
  }

  // 竖线
  this.scene.addChild(
    this.drawLine(
      this.START_X + this.VERTICAL_WIDTH,
      this.START_Y,
      this.START_X + this.VERTICAL_WIDTH,
      this.START_Y + this.contentHeight,
      GraphStyle.chartLine
    )
  );
  for (var i = 1; i < dataSize; i++) {
    var x = this.START_X + this.VERTICAL_WIDTH + i * this.DAY_WIDTH;
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

  // 纵轴文字
  for (var i = 0; i < CONFIG.showCates.length; i++) {
    var key = CONFIG.showCates[i];
    var config = CONFIG.base[key];
    // 脉搏和体温单独绘制
    if (key === "key5") {
      continue;
    }
    var text = this.drawText(
      config.name,
      this.START_X + this.VERTICAL_WIDTH / 2,
      config.y1,
      GraphStyle.baseTextStyle
    );
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
    text.y = config.y1 + (config.y2 - config.y1) / 2;

    this.scene.addChild(text);
  }

  // 绘制时间间隔
  var config = CONFIG.base["key4"];
  var y1 = CONFIG.base["key4"].y1;
  var y2 = CONFIG.base["key6"].y2;
  debugger;
  for (var i = 0; i < dataSize; i++) {
    var gridX = this.START_X + this.VERTICAL_WIDTH + i * this.DAY_WIDTH;
    for (var j = 1; j < 7; j++) {
      var x = gridX + (j * this.DAY_WIDTH) / 6;
      var text = this.drawText(
        j * 4 - 2,
        x - this.DAY_WIDTH / 12,
        y1 + config.height / 2,
        GraphStyle.baseTextStyle
      );
      text.anchor.x = text.anchor.y = 0.5;
      text.scale.x = text.scale.y = 0.7;
      this.scene.addChild(text);
      if (j < 6) {
        this.scene.addChild(
          this.drawLine(x, y1, x, y2, GraphStyle.alpha0_3Line)
        );
      }
    }
  }

  // 血压分割线
  var config = CONFIG.base["key11"];
  var bpy1 = config.y1;
  var bpy2 = config.y2;
  for (var i = 0; i < dataSize; i++) {
    var gridX = this.START_X + this.VERTICAL_WIDTH + (i + 0.5) * this.DAY_WIDTH;
    this.scene.addChild(
      this.drawLine(gridX, bpy1, gridX, bpy2, GraphStyle.alpha0_3Line)
    );
  }
};

// 脉搏和体温网格
Chart.prototype.drawBpGrid = function() {
  var config = CONFIG.base["key5"];
  var x1 = this.START_X + this.VERTICAL_WIDTH;
  var x2 = this.END_X;
  var y1 = config.y1;
  var height = config.height;

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 4; j++) {
      var childY = y1 + i * (height / 8) + (j + 1) * (height / 8 / 5);
      this.scene.addChild(
        this.drawLine(x1, childY, x2, childY, GraphStyle.alpha0_3Line)
      );
    }
  }

  var mbtext = this.drawText(
    "脉搏(bpm)",
    this.START_X + this.VERTICAL_WIDTH / 4,
    y1 + 10,
    GraphStyle.baseTextStyle
  );
  mbtext.anchor.x = mbtext.anchor.y = 0.5;
  mbtext.scale.x = mbtext.scale.y = 0.7;
  var twtext = this.drawText(
    "体温(℃)",
    this.START_X + (this.VERTICAL_WIDTH * 3) / 4,
    y1 + 10,
    GraphStyle.baseTextStyle
  );
  twtext.anchor.x = twtext.anchor.y = 0.5;
  twtext.scale.x = twtext.scale.y = 0.7;
  this.scene.addChild(mbtext);
  this.scene.addChild(twtext);

  for (var i = 0; i < 7; i++) {
    var y = y1 + (i + 1) * (height / 8);
    // 左侧菜单栏
    var text1 = this.drawText(
      160 - i * 20,
      this.START_X + this.VERTICAL_WIDTH / 4,
      y,
      { fontSize: 12, fill: GraphStyle.colors.red }
    );
    text1.anchor.x = text1.anchor.y = 0.5;
    var text2 = this.drawText(
      41 - i + " °",
      this.START_X + (this.VERTICAL_WIDTH * 3) / 4,
      y,
      { fontSize: 12, fill: GraphStyle.colors.blue }
    );
    text2.anchor.x = text2.anchor.y = 0.5;
    this.scene.addChild(text1);
    this.scene.addChild(text2);

    // 右侧网格
    this.scene.addChild(this.drawLine(x1, y, x2, y, GraphStyle.chartLine));
  }
};

Chart.prototype.initContent = function() {
  // 计算高度
  // 为每条数据划分高度上的起点和终点
  var countY = this.START_Y;
  for (var index = 0; index < CONFIG.showCates.length; index++) {
    var key = CONFIG.showCates[index];
    var data = CONFIG.base[key];
    data.y1 = countY;
    countY += data.grid.height;
    data.y2 = countY;
    data.height = data.grid.height;
    this.contentHeight += data.grid.height;
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
Chart.prototype.draw = function(data) {
  this.drawBase(data.datas);
  this.drawPulseTemp(data.datas);
  this.drawBreath(data.datas);
  this.drawBp(data.datas);
  this.drawBaseInfo(data);
};

Chart.prototype.drawBaseInfo = function(data) {
  this.hospName.text = data.hosName || "云医院";
  this.baseInfoText.text =
    "姓名：" +
    data.patName +
    "        入院日期：" +
    data.inTime +
    "        住院号：" +
    data.inpNo +
    "        科室：" +
    data.secName;
};

Chart.prototype.getXByDidx = function(idx) {
  return (
    this.START_X +
    this.VERTICAL_WIDTH +
    idx * this.DAY_WIDTH +
    this.DAY_WIDTH / 2
  );
};

Chart.prototype.getDataKeyByConfigKey = function(key) {
  var valKey;
  switch (key) {
    case "key2":
      valKey = "d1";
      break;
    case "key3":
      valKey = "d2";
      break;
    case "key4":
      valKey = "d3";
      break;
    case "key5":
      valKey = "d4";
      break;
    case "key6":
      valKey = "d5";
      break;
    case "key7":
      valKey = "d6";
      break;
    case "key8":
      valKey = "d7";
      break;
    case "key9":
      valKey = "d8";
      break;
    case "key10":
      valKey = "d9";
      break;
    case "key11":
      valKey = "d10";
      break;
    case "key12":
      valKey = "d11";
      break;
    case "key13":
      valKey = "d12";
      break;
    case "key14":
      valKey = "d13";
      break;

    default:
      break;
  }
  return valKey;
};

Chart.prototype.drawBase = function(datas) {
  for (var j = 0; j < datas.length; j++) {
    var data = datas[j];
    var x = this.getXByDidx(j);
    for (var i = 0; i < CONFIG.showCates.length; i++) {
      var key = CONFIG.showCates[i];
      if (key == "key4" || key == "key5" || key == "key6" || key == "key11") {
        continue;
      }

      var config = CONFIG.base[key];
      var y = config.y1 + config.height / 2;

      // 日期
      if (key === "key1") {
        var text = this.drawText(
          utils.getFormatDate(data.st),
          x,
          y,
          GraphStyle.baseTextStyle
        );
      } else {
        var valKey = this.getDataKeyByConfigKey(key);
        var text = this.drawText(data[valKey], x, y, GraphStyle.baseTextStyle);
      }
      text.anchor.x = text.anchor.y = 0.5;
      this.scene.addChild(text);
    }
  }
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
  var y = ((180 - val) / (180 - 20)) * (config.y2 - config.y1) + config.y1;

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
  var y = ((42 - val) / (42 - 34)) * (config.y2 - config.y1) + config.y1;

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
    for (var j = 0; j < pdata.length; j++) {
      var pitem = pdata[j];
      if (pitem.val != null) {
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
          pelems.push(pline);
        }
        pelems.push(ppoint);
        // continue;
      }
      var titem = tdata[j];
      if (titem.val != null) {
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
          telems.push(tline);
        }
        telems.push(tpoint);
      }
    }
  }

  var self = this;
  this.sit = setInterval(function() {
    var idx = self.curIdx++;
    if (!pelems[idx] && !telems[idx]) {
      clearInterval(self.sit);
      return;
    }
    if (pelems[idx]) {
      self.scene.addChild(pelems[idx]);
    }
    if (telems[idx]) {
      self.scene.addChild(telems[idx]);
    }
  }, 20);
};

// 绘制呼吸
Chart.prototype.drawBreath = function(datas) {
  var config = CONFIG.base["key6"];
  var y1 = config.y1;
  for (var i = 0; i < datas.length; i++) {
    var data = datas[i];
    var gridX = this.START_X + this.VERTICAL_WIDTH + i * this.DAY_WIDTH;
    for (var j = 1; j < 7; j++) {
      var x = gridX + (j * this.DAY_WIDTH) / 6;
      var text = this.drawText(
        data.d5[j],
        x - this.DAY_WIDTH / 12,
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
      data.d10["high"],
      x1,
      y1,
      GraphStyle.baseTextStyle
    );
    highText.anchor.x = highText.anchor.y = 0.5;
    this.scene.addChild(highText);

    var lowText = this.drawText(
      data.d10["low"],
      x2,
      y1,
      GraphStyle.baseTextStyle
    );
    lowText.anchor.x = lowText.anchor.y = 0.5;
    this.scene.addChild(lowText);
  }
};
