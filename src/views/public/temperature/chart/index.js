var DAY_MILL = 86400000;

// 分类配置
var CONFIG = {
  // 默认显示几天
  showDate: 10,
  // 默认显示分类
  showCates: [
    "key2_1",
    "key2_2",
    "key5_1",
    "key5_2",
    "key5_3",
    "key6",
    "key1",
    "key3",
    "key4"
  ],
  base: {
    key1: {
      name: "事件",
      grid: { height: 60 },
      titleBgColor: GraphStyle.colors.default
    },
    key2_1: {
      name: "用药",
      grid: { height: 60 },
      titleBgColor: GraphStyle.colors.default
    },
    key2_2: {
      name: "护理",
      grid: { height: 60 },
      titleBgColor: GraphStyle.colors.default
    },
    key3: {
      name: "病程",
      grid: { height: 60 },
      titleBgColor: GraphStyle.colors.default
    },
    key4: {
      name: "辅助检查",
      grid: { height: 60 },
      titleBgColor: GraphStyle.colors.default
    },
    key5_1: {
      name: "血压(bp)",
      grid: { height: 100 },

      // 如果整个时间周期内的高低压差值低于minOffset
      // 刻度表就按 low-height 来展示
      minOffset: 60,
      min: 80,
      max: 120,
      titleBgColor: GraphStyle.colors.default
    },
    key5_2: {
      name: "体温(°C)",
      grid: { height: 100 },
      min: 35,
      max: 40,
      minOffset: 5,
      titleBgColor: GraphStyle.colors.default
    },
    key5_3: {
      name: "心率(bpm)",
      grid: { height: 100 },
      min: 50,
      max: 150,
      minOffset: 100,
      titleBgColor: GraphStyle.colors.default
    },
    key6: {
      name: "出入量",
      grid: { height: 90 },
      default: 0,
      titleBgColor: GraphStyle.colors.default,
      key6_1: {
        name: "摄入(ML)",
        grid: { height: 30 },
        default: 0,
        titleBgColor: GraphStyle.colors.default
      },
      key6_2: {
        name: "排出(ML)",
        grid: { height: 30 },
        default: 0,
        titleBgColor: GraphStyle.colors.default
      },
      key6_3: {
        name: "吸收(ML)",
        grid: { height: 30 },
        default: 0,
        titleBgColor: GraphStyle.colors.default
      }
    }
  }
};

// 数据结构
var needData = {
  key1: {
    items: [
      {
        name: "家床",
        // st: 1553413687934,
        // 用于生成测试数据，表示几天前发生的事情
        testDay: 7
      },
      {
        name: "CT检查",
        // st: 1553413687934,
        testDay: 7
      },
      {
        name: "换床",
        // st: 1553673587934,
        testDay: 6
      },
      {
        name: "手术",
        // st: 1553673587934,
        testDay: 5
      },
      {
        name: "会诊",
        // st: 1553673587934,
        testDay: 4
      }
    ]
  },
  key2_1: {
    items: [
      {
        // 长期医嘱
        type: 1,
        texts: ["5%葡萄糖注射液", "250ml Tid"],
        dates: [
          {
            // st: 1553413687934,
            testDay: 7
          }
        ]
      },
      {
        // 长期医嘱
        type: 1,
        texts: ["注射用炎琥宁", "40mg Tid"],
        dates: [
          {
            // st: 1553413687934,
            testDay: 7
          }
        ]
      },
      {
        // 临时医嘱
        type: 2,
        texts: ["头孢丙烯分散片", "0.5g St"],
        // st: 1553573587934,
        dates: [
          {
            // st: 1553573587934,
            testDay: 7
          },
          {
            // st: 1553713687934,
            testDay: 5
          },
          {
            // st: 1553713687934,
            testDay: 3
          }
        ]
      },
      {
        // 临时医嘱
        type: 2,
        texts: ["复方甲氧那明胶囊", "2粒 St"],
        // st: 1553573587934,
        dates: [
          {
            // st: 1553573587934,
            testDay: 7
          },
          {
            // st: 1553713687934,
            testDay: 5
          },
          {
            // st: 1553713687934,
            testDay: 3
          }
        ]
      },
      {
        // 临时医嘱
        type: 2,
        texts: ["连花清瘟胶囊", "1.2g st"],
        // st: 1553573587934,
        dates: [
          {
            // st: 1553573587934,
            testDay: 7
          },
          {
            // st: 1553713687934,
            testDay: 5
          },
          {
            // st: 1553713687934,
            testDay: 3
          }
        ]
      }
    ]
  },
  key2_2: {
    items: [
      {
        type: 1,
        texts: ["二级护理"],
        // st: 1553513687934,
        testDay: 7
      },
      {
        type: 1,
        texts: ["测量血压"],
        // st: 1553513687934,
        // et: 1553713687934,
        dates: [
          {
            testDay: 7,
            testDur: 1
          },
          {
            testDay: 4,
            testDur: 2
          }
        ]
      },
      {
        type: 1,
        texts: ["测量体温"],
        // st: 1553513687934,
        // et: 1553713687934,
        testDay: 7,
        testDur: 5
      },
      {
        type: 2,
        texts: ["测量心率"],
        dates: [
          {
            // st: 1553573587934,
            testDay: 7
          },
          {
            // st: 1553573587934,
            testDay: 5
          },
          {
            // st: 1553573587934,
            testDay: 3
          }
        ]
      }
    ]
  },
  key3: {
    items: [
      {
        id: "001",
        testDay: 7
        // st: 1553613687934
      },
      {
        id: "001",
        testDay: 6
        // st: 1553613687934
      },
      {
        id: "002",
        testDay: 1
        // st: 1554973587934
      }
    ]
  },
  key4: {
    items: [
      {
        id: "003",
        type: 1,
        testDay: 6,
        name: "全血细胞分析"
        // st: 1553613687934
      },
      {
        id: "004",
        type: 1,
        testDay: 2,
        name: "胸部正位片"
        // st: 1553613687934
      }
    ]
  },
  key5_1: {
    items: [
      {
        // st: 1553613687934,
        max: 145,
        min: 89,
        testDay: 7
      },
      {
        // st: 1553813687934,
        max: 140,
        min: 85,
        testDay: 6
      },
      {
        // st: 1554113687934,
        max: 130,
        min: 90,
        testDay: 5
      },
      {
        // st: 1554973587934,
        max: 142,
        min: 91,
        testDay: 4
      },
      {
        // st: 1554973587934,
        max: 140,
        min: 87,
        testDay: 3
      }
    ]
  },
  key5_2: {
    items: [
      {
        // st: 1553613687934,
        val: 36.9,
        testDay: 7
      },
      {
        // st: 1554113687934,
        val: 37.1,
        testDay: 6
      },
      {
        // st: 1554973587934,
        val: 36.8,
        testDay: 5
      },
      {
        // st: 1554113687934,
        val: 36.8,
        testDay: 4
      },
      {
        // st: 1554973587934,
        val: 36.5,
        testDay: 3
      }
    ]
  },
  key5_3: {
    items: [
      {
        // st: 1553613687934,
        val: 88,
        testDay: 7
      },
      {
        // st: 1554973587934,
        val: 95,
        testDay: 5
      },
      {
        // st: 1554973587934,
        val: 91,
        testDay: 3
      }
    ]
  },
  key6: {
    items: [
      {
        // st: 1553613687934,
        in: 40,
        out: 36,
        testDay: 7
      },
      {
        // st: 1554113687934,
        in: 45,
        out: 33,
        testDay: 6
      },
      {
        // st: 1554973587934,
        in: 51,
        out: 40,
        testDay: 5
      }
    ]
  }
};
// 根据今天生成上面的测试数据
for (var key in needData) {
  var datas = needData[key];
  for (var i = 0; i < datas.items.length; i++) {
    var data = datas.items[i];
    if (data.dates) {
      for (var j = 0; j < data.dates.length; j++) {
        var date = data.dates[j];
        if (date.testDay) {
          date.st = Date.now() - DAY_MILL * date.testDay;
        }
        if (date.testDur) {
          date.et = Date.now() - DAY_MILL * (date.testDay - date.testDur);
        }
      }
    } else {
      if (data.testDay) {
        data.st = Date.now() - DAY_MILL * data.testDay;
      }
      if (data.testDur) {
        data.et = Date.now() - DAY_MILL * (data.testDay - data.testDur);
      }
    }
  }
}

function Chart() {
  // 画布宽度
  this.SCREEN_WIDTH = document.body.clientWidth;
  // 画布高度
  this.SCREEN_HEIGHT = document.documentElement.clientHeight;
  // 横轴高度
  this.HORIZONTAL_HEIGHT = 50;
  // 纵轴宽度
  this.VERTICAL_WIDTH = 80;
  // 横轴单格长度
  this.DAY_WIDTH = 80;
  // 默认展示最小天数
  // 这个是根据显示区域展示不同的
  this.MIN_DAY = 7;

  // 刻度展示区间, 上下百分比
  this.SCALE_RATE = 0.2;
  // titlt左侧阴影宽度
  this.titleBgWidth = 20;
  // 医嘱单条内容的图块高度
  this.daBgHeight = 30;

  this.contentWidth = 0;
  this.contentHeight = 0;
  this.days = [];

  this.app = new PIXI.Application(this.SCREEN_WIDTH, this.SCREEN_HEIGHT, {
    resolution: 2,
    autoResize: true,
    antialias: true,
    transparent: false,
    backgroundColor: 0xffffff
  });
  document.body.appendChild(this.app.view);
  this.scene = this.app.stage;

  this.init();
}

// 准备工作
// ====================================
// ====================================
// ====================================
// ====================================

Chart.prototype.init = function() {
  // 布局
  this.initDays();
  this.initContent();

  // 内容
  this.updateContentViewport();
  this.scene.addChild(this.contentScene);

  this.updateHorizontalViewport(this.days);
  this.scene.addChild(this.horScene);

  this.updateVerticalViewport();
  this.scene.addChild(this.verScene);

  // 画布四边
  this.scene.addChild(this.drawLine(0, 0, this.app.screen.width, 0, GraphStyle.chartLine));
  this.scene.addChild(this.drawLine(0, 0, 0, this.app.screen.height, GraphStyle.chartLine));
  this.scene.addChild(this.drawLine(this.app.screen.width, 0, this.app.screen.width, this.app.screen.height, GraphStyle.chartLine));
  this.scene.addChild(this.drawLine(0, this.app.screen.height, this.app.screen.width, this.app.screen.height, GraphStyle.chartLine));
  // 纵轴分割线
  this.scene.addChild(this.drawLine(this.VERTICAL_WIDTH, 0, this.VERTICAL_WIDTH, this.app.screen.height, GraphStyle.chartLine));
  // 横轴分割线
  this.scene.addChild(this.drawLine(0, this.HORIZONTAL_HEIGHT, this.app.screen.width, this.HORIZONTAL_HEIGHT, GraphStyle.chartLine));

  // 左上角文字
  var text = this.drawText(
    "全部 | 24h",
    this.VERTICAL_WIDTH / 2,
    this.HORIZONTAL_HEIGHT / 2,
    GraphStyle.baseTextStyle
  );
  text.anchor.set(0.5);
  text.scale.set(0.8);
  text.alpha = 0.5;
  this.scene.addChild(text);

  this.scrollHandler();
};

Chart.prototype.update = function(data) {
  // 布局
  this.updateDays(data);
  this.updateContent(data);

  // 内容
  this.updateContentViewport();
  this.updateHorizontalViewport(this.days);
  this.updateVerticalViewport();
  this.draw(data);
};

Chart.prototype.initDays = function() {
  var date = CONFIG.showDate;
  for (let i = 0; i < date; i++) {
    this.days.push(utils.getFormatDate(Date.now() + i * DAY_MILL));
  }
  this.contentWidth = this.days.length * this.DAY_WIDTH;
};

Chart.prototype.initContent = function() {
  // 计算高度
  // 为每条数据划分高度上的起点和终点
  var countY = 0;
  for (var index = 0; index < CONFIG.showCates.length; index++) {
    var key = CONFIG.showCates[index];
    var data = CONFIG.base[key];
    var height = 0;
    data.y1 = countY;

    // 【事件】都是发生在同一行的，高度根据最大事件数来生成
    // 【病程】在同一行
    // 【辅助检查】在同一行
    // 【三测】分三行，温度、血压、心率
    // 【出入量】三行，摄入、排除、留存
    if (key != "key2_1" && key != "key2_2") {
      data.y1 = countY;
      height += data.grid.height;
      countY += data.grid.height;
      data.y2 = countY;
    }

    // 【医嘱执行】一条事件一行, 这里默认就显示一行
    if (key === "key2_1" || key === "key2_2") {
      data.y1 = countY;
      height += data.grid.height;
      countY += data.grid.height;
      data.y2 = countY;
    }
    data.y2 = countY;
    data.height = height;
    this.contentHeight += height;
  }

  this.contentHeight = Math.max(
    this.contentHeight,
    this.SCREEN_HEIGHT - this.HORIZONTAL_HEIGHT
  );
};

Chart.prototype.updateDays = function(datas) {
  this.days.length = 0;
  this.days = [];
  // 根据data中的日期分析出时间周期
  var minTime = 0,
    maxTime = 0;
  for (var key in datas) {
    var data = datas[key];
    data.items.map(function(item) {
      if (!item.st && !item.dates) {
        console.error("数据中无时间：", item);
      }
      if (!item.st) {
        for (var i = 0; i < item.dates.length; i++) {
          var date = item.dates[i];
          if (minTime === 0) {
            minTime = date.st;
          }
          minTime = Math.min(date.st, minTime);
          maxTime = Math.max(date.st, maxTime);
          if (date.et) {
            maxTime = Math.max(date.et, maxTime);
          }
        }
      } else {
        if (minTime === 0) {
          minTime = item.st;
        }
        minTime = Math.min(item.st, minTime);
        maxTime = Math.max(item.st, maxTime);
        if (item.et) {
          maxTime = Math.max(item.et, maxTime);
        }
      }
    });
  }

  // 判断是否有未完成长期医嘱
  // 如果有将医嘱et设置成今天或者maxTime中最大的那个
  var hasNotFinishedLongDa = false;
  var keys = ["key2_1", "key2_2"];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var items = datas[key].items;
    for (var k = 0; k < items.length; k++) {
      var data = items[k];
      if (data.type != 1) continue;
      if (data.dates && data.dates.length) {
        for (var j = 0; j < data.dates.length; j++) {
          var date = data.dates[j];
          if (!date.et) {
            hasNotFinishedLongDa = true;
            break;
          }
        }
      } else {
        if (!data.et) {
          hasNotFinishedLongDa = true;
          break;
        }
      }
    }
  }
  if (hasNotFinishedLongDa) {
    maxTime = Math.max(Date.now(), maxTime);
  }

  // 处理最小展示周期
  if (maxTime - minTime < this.MIN_DAY * DAY_MILL) {
    maxTime = minTime + this.MIN_DAY * DAY_MILL;
  }

  // 生成日期
  var num = Math.ceil((maxTime - minTime) / DAY_MILL);
  
  // 根据屏幕宽度，动态调整最小时间，以保证至少能有一屏的格子
  if (this.SCREEN_WIDTH / this.DAY_WIDTH > num) {
    minTime = minTime - (Math.ceil(this.SCREEN_WIDTH / this.DAY_WIDTH) - num) * DAY_MILL;
    num = Math.ceil((maxTime - minTime) / DAY_MILL);
  }

  for (var index = 0; index <= num; index++) {
    var t = utils.getFormatDate(minTime + index * DAY_MILL);
    this.days.push(t);
  }

  this.contentWidth = this.days.length * this.DAY_WIDTH;
};

// 更新内容带来的高度影响
// 医嘱、事件、辅助检查会根据内容做高度调整
// 所以，这里的处理策略就是更新医嘱以下的区域y轴坐标
Chart.prototype.updateContent = function(datas) {
  var drugIdx = CONFIG.showCates.indexOf("key2_1");
  var nursingIdx = CONFIG.showCates.indexOf("key2_2");
  if (drugIdx < 0 && nursingIdx < 0) {
    return;
  }

  // 用药医嘱带来的Y轴偏移量
  var drugOffsetY = 0;
  if (
    datas["key2_1"] &&
    datas["key2_1"].items &&
    datas["key2_1"].items.length > 1
  ) {
    drugOffsetY = (datas["key2_1"].items.length - 1) * (this.daBgHeight + 5);
  }
  // 护理医嘱带来的Y轴偏移量
  var nursingOffsetY = 0;
  if (
    datas["key2_2"] &&
    datas["key2_2"].items &&
    datas["key2_2"].items.length > 1
  ) {
    nursingOffsetY = (datas["key2_2"].items.length - 1) * (this.daBgHeight + 5);
  }

  // TODO
  // // 辅助检查带来的Y轴偏移量
  // var checkOffsetY = 0;
  // if (datas['key4'] && datas['key4'].items && datas['key4'].items.length > 1) {
  //   checkOffsetY = (datas['key4'].items.length - 1) * 20;
  // }

  // 将医嘱以后的所有模块都加上偏移量
  for (var index = 0; index < CONFIG.showCates.length; index++) {
    var key = CONFIG.showCates[index];
    var data = CONFIG.base[key];

    if (drugOffsetY > 0) {
      if (index === drugIdx) {
        data.y2 += drugOffsetY;
      } else if (index > drugIdx) {
        data.y1 += drugOffsetY;
        data.y2 += drugOffsetY;
      }
    }

    if (nursingOffsetY > 0) {
      if (index === nursingIdx) {
        data.y2 += nursingOffsetY;
      } else if (index > nursingIdx) {
        data.y1 += nursingOffsetY;
        data.y2 += nursingOffsetY;
      }
    }
  }

  this.contentHeight = data && data.y2;
};

Chart.prototype.scrollHandler = function() {
  var self = this;
  this.horScene.moveHandler = function(x, y) {
    self.contentScene.scrollOffset(x, 0);
    self.check();
  };
  this.verScene.moveHandler = function(x, y) {
    self.contentScene.scrollOffset(0, y);
    self.check();
  };
  this.contentScene.moveHandler = function(x, y) {
    self.horScene.scrollOffset(x, 0);
    self.verScene.scrollOffset(0, y);
    self.check();
  };
};

// 页面有变化就执行一次
Chart.prototype.check = function() {
  this.checkDaText();
};

// 横轴: 顶部坐标系、竖线
// 根据天数和每天的单格宽度生成
// days: ['2019-2-1', '2019-2-2']
Chart.prototype.updateHorizontalViewport = function(days) {
  var width = days.length * this.DAY_WIDTH;
  var height = this.HORIZONTAL_HEIGHT;

  // 滑动视图
  if (this.horScene) {
    this.horScene.scrollContainer.removeChildren();
  } else {
    this.horScene = new ScrollView(
      this.SCREEN_WIDTH - this.VERTICAL_WIDTH,
      this.HORIZONTAL_HEIGHT
    );
    this.horScene.x = this.VERTICAL_WIDTH;
    this.horScene.y = 0;
  }

  // // 阴影
  // var hPaths = [0, 0, width, 0, width, height, 0, height];
  // this.horScene.scrollContainer.addChild(this.drawShadow(hPaths, GraphStyle.colors.red, 0.5));

  // 日期
  for (var index = 0; index < days.length; index++) {
    var item = days[index];
    var x = this.DAY_WIDTH / 2 + index * this.DAY_WIDTH;
    var y = this.HORIZONTAL_HEIGHT / 2;
    var text = this.drawText(item, x, y, GraphStyle.baseTextStyle);
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
    this.horScene.scrollContainer.addChild(text);

    // 虚线
    var lineX = index * this.DAY_WIDTH;
    this.horScene.scrollContainer.addChild(
      this.drawDottedLine(
        lineX,
        0,
        lineX,
        this.HORIZONTAL_HEIGHT,
        GraphStyle.defaultDottedLine
      )
    );
    this.horScene.scrollContainer.addChild(
      this.drawDottedLine(
        lineX,
        this.HORIZONTAL_HEIGHT,
        lineX + this.DAY_WIDTH,
        this.HORIZONTAL_HEIGHT,
        GraphStyle.defaultDottedLine
      )
    );
  }
  // this.horScene.scrollContainer.addChild(this.drawDottedLine(this.contentWidth, 0, this.contentWidth, this.HORIZONTAL_HEIGHT, GraphStyle.defaultDottedLine));
};

// 纵轴：左侧坐标系、横线
// 根据每个内容区域的高度生成
Chart.prototype.updateVerticalViewport = function() {
  var width = this.VERTICAL_WIDTH;
  var height = this.contentHeight;

  // 滑动视图
  if (this.verScene) {
    this.verScene.scrollContainer.removeChildren();
  } else {
    this.verScene = new ScrollView(
      this.VERTICAL_WIDTH,
      this.SCREEN_HEIGHT - this.HORIZONTAL_HEIGHT
    );
    this.verScene.x = 0;
    this.verScene.y = this.HORIZONTAL_HEIGHT;
  }

  // // 阴影
  // var vPaths = [0, 0, width, 0, width, height, 0, height];
  // this.verScene.scrollContainer.addChild(this.drawShadow(vPaths, GraphStyle.colors.red, 0.5));

  // 内容title
  for (var index = 0; index < CONFIG.showCates.length; index++) {
    var key = CONFIG.showCates[index];
    var config = CONFIG.base[key];

    // 阴影
    var paths = [
      0,
      config.y1,
      this.titleBgWidth,
      config.y1,
      this.titleBgWidth,
      config.y2,
      0,
      config.y2
    ];
    this.verScene.scrollContainer.addChild(
      this.drawShadow(paths, config.titleBgColor, index % 2 === 0 ? 0.4 : 0.15)
    );

    // 文字
    var text = this.drawText(
      config.name,
      0,
      config.y1,
      GraphStyle.baseTextStyle
    );
    text.anchor.x = 0.5;
    text.anchor.y = 0;
    text.y = config.y1 + (config.y2 - config.y1) / 2;
    text.rotation = -Math.PI / 2;
    this.verScene.scrollContainer.addChild(text);

    // 横轴
    // 输入量这块需要特殊处理下
    this.verScene.scrollContainer.addChild(
      this.drawDottedLine(
        0,
        config.y1,
        this.VERTICAL_WIDTH,
        config.y1,
        GraphStyle.defaultDottedLine
      )
    );
    this.verScene.scrollContainer.addChild(
      this.drawDottedLine(
        0,
        config.y2,
        this.VERTICAL_WIDTH,
        config.y2,
        GraphStyle.defaultDottedLine
      )
    );
  }
};

// 内容区域
// 一个上下左右的滑动视图
Chart.prototype.updateContentViewport = function() {
  if (this.contentScene) {
    this.contentScene.scrollContainer.removeChildren();
  } else {
    this.contentScene = new ScrollView(
      this.SCREEN_WIDTH - this.VERTICAL_WIDTH,
      this.SCREEN_HEIGHT - this.HORIZONTAL_HEIGHT
    );
    this.contentScene.x = this.VERTICAL_WIDTH;
    this.contentScene.y = this.HORIZONTAL_HEIGHT;
  }

  // 画纵轴虚线
  for (var i = 0; i < this.days.length; i++) {
    var x1 = i * this.DAY_WIDTH;
    var y1 = 0;
    var x2 = x1;
    var y2 = this.contentHeight;
    this.contentScene.scrollContainer.addChild(
      this.drawDottedLine(x1, y1, x2, y2, GraphStyle.defaultDottedLine)
    );
    // this.contentScene.scrollContainer.addChild(this.drawDottedLine(x1 + this.DAY_WIDTH / 2, y1, x2 + this.DAY_WIDTH / 2, y2, GraphStyle.dottedLine2));
  }

  // 画横轴虚线
  // 每个模块自己划分区域横线
  for (var index = 0; index < CONFIG.showCates.length; index++) {
    var key = CONFIG.showCates[index];
    var config = CONFIG.base[key];
    // this.contentScene.scrollContainer.addChild(this.drawLine(0, config.y1, this.contentWidth, config.y1, GraphStyle.defaultLine))
    this.contentScene.scrollContainer.addChild(
      this.drawDottedLine(
        0,
        config.y1,
        this.contentWidth,
        config.y1,
        GraphStyle.defaultDottedLine
      )
    );
  }
};

// 根据事件获取x轴的坐标
Chart.prototype.getXByDate = function(timestamp) {
  var t = utils.getFormatDate(timestamp);
  var idx = this.days.indexOf(t);
  if (idx === -1) {
    console.error("数据异常：", timestamp);
    return 0;
  }
  return (idx + 0.5) * this.DAY_WIDTH;
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

// 画连续线(曲线)
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
  this.drawTest(needData);
  this.drawIOnput(needData["key6"]);
  this.drawEvent(needData["key1"]);
  this.drawDaDrug(needData["key2_1"]);
  this.drawDaNursing(needData["key2_2"]);
  this.drawRecord(needData["key3"]);
  this.drawCheck(needData["key4"]);
};

// 画三测
Chart.prototype.drawTest = function(datas) {
  if (datas["key5_1"] && datas["key5_1"].items.length > 0) {
    this.drawBloodPressure(datas["key5_1"]);
  }
  if (datas["key5_2"] && datas["key5_2"].items.length > 0) {
    this.drawTemperauture(datas["key5_2"]);
  }
  if (datas["key5_3"] && datas["key5_3"].items.length > 0) {
    this.drawHeartRate(datas["key5_3"]);
  }
};

// 计算三测所需布局尺寸
Chart.prototype.calTestLayout = function(config, datas) {
  // 查询最高最低值
  // 适配血压、体温两种数据结构
  // 血压：[{min: , max: }]
  // 体温：[{val: }]
  var min, max;
  if (utils.isNumber(datas[0].val)) {
    min = datas[0].val;
    max = datas[0].val;
  } else {
    min = datas[0].min;
    max = datas[0].max;
  }
  for (var index = 0; index < datas.length; index++) {
    var item = datas[index];
    if (utils.isNumber(datas[0].val)) {
      min = Math.min(min, item.val);
      max = Math.max(max, item.val);
    } else {
      min = Math.min(min, item.min);
      max = Math.max(max, item.max);
    }
  }

  // 上下边界
  var top = config.y1;
  var bottom = config.y2;
  var offset = bottom - top;
  top = top + offset * this.SCALE_RATE;
  bottom = bottom - offset * this.SCALE_RATE;
  var offsetSize = bottom - top;

  // 上下边界对应的血压值
  // if (max - min < config.minOffset) {
  //   min = config.min;
  //   max = config.max;
  // } else {
  //   min = Math.floor(min / 10) * 10;
  //   max = Math.ceil(max / 10) * 10;
  // }
  max = max > config.max ? Math.ceil(max / 10) * 10 : config.max;
  min = min < config.min ? Math.floor(min / 10) * 10 : config.min;
  var offsetBP = max - min;

  return {
    min: min,
    max: max,
    top: top,
    bottom: bottom,
    offsetSize: offsetSize,
    offsetBP: offsetBP
  };
};

// 圆圈上加个文字
Chart.prototype.drawCircleAndText = function(
  type,
  x,
  y,
  circleStyle,
  text,
  textStyle
) {
  var container = new PIXI.Container();
  container.addChild(this.drawCircle(x, y, circleStyle));

  if (type == "top") {
    y = y - 12;
  } else if (type == "bottom") {
    y = y + 12;
  }
  var text = this.drawText(text, x, y, textStyle);
  text.anchor.x = 0.5;
  text.anchor.y = 0.5;
  container.addChild(text);
  return container;
};

// 画左侧刻度
Chart.prototype.drawScale = function(height, max, min) {
  var num = 5;
  var scaleWidth = 5;
  var contentHeight = height * (1 - this.SCALE_RATE * 2);
  var container = new PIXI.Container();
  var mainLine = this.drawLine(0, 0, 0, height, GraphStyle.chartLine);
  container.addChild(mainLine);

  var one = (max - min) / num;
  for (var i = 0; i < num; i++) {
    // 绘制横格
    var y = height * this.SCALE_RATE + (contentHeight / 4) * i;
    var scale = this.drawLine(-scaleWidth, y, 0, y, GraphStyle.chartLine);
    // 绘制刻度文字
    if (i % 2 === 0) {
      var val = i == num - 1 ? min : max - one * i;
      var text = this.drawText(val, 0, y, GraphStyle.baseTextStyle);
      text.x = -8;
      text.anchor.x = 1;
      text.anchor.y = 0.5;
      text.scale.x = text.scale.y = 0.7;
      container.addChild(text);
    }
    container.addChild(scale);
  }
  return container;
};

// 血压
Chart.prototype.drawBloodPressure = function(datas) {
  var config = CONFIG.base["key5_1"];
  var layoutInfo = this.calTestLayout(config, datas.items);
  var min = layoutInfo.min;
  var max = layoutInfo.max;
  var top = layoutInfo.top;
  var bottom = layoutInfo.bottom;
  var offsetSize = layoutInfo.offsetSize;
  var offsetBP = layoutInfo.offsetBP;

  // 计算绝对坐标
  var shadowPathsBef = [];
  var shadowPathsAft = [];
  for (var index = 0; index < datas.items.length; index++) {
    var item = datas.items[index];
    // 高压
    var hx = this.getXByDate(item.st);
    var hy = top + ((max - item.max) / offsetBP) * offsetSize;
    shadowPathsBef.push(hx, hy);
    // 低压
    var lx = hx;
    var ly = top + ((max - item.min) / offsetBP) * offsetSize;
    shadowPathsAft.unshift(lx, ly);
    // 画圆

    this.contentScene.scrollContainer.addChild(
      this.drawCircleAndText(
        "top",
        hx,
        hy,
        GraphStyle.defaultCircle,
        item.max,
        GraphStyle.baseTextStyle
      )
    );
    this.contentScene.scrollContainer.addChild(
      this.drawCircleAndText(
        "bottom",
        lx,
        ly,
        GraphStyle.defaultCircle,
        item.min,
        GraphStyle.baseTextStyle
      )
    );
  }

  // 画区间阴影
  this.contentScene.scrollContainer.addChild(
    this.drawShadow(
      shadowPathsBef.concat(shadowPathsAft),
      GraphStyle.colors.default,
      0.4
    )
  );

  // 左侧刻度
  var scale = this.drawScale(config.y2 - config.y1, max, min);
  scale.x = this.DAY_WIDTH;
  scale.y = config.y1;
  this.verScene.scrollContainer.addChild(scale);
};

// 体温
Chart.prototype.drawTemperauture = function(datas) {
  var config = CONFIG.base["key5_2"];
  var layoutInfo = this.calTestLayout(config, datas.items);
  var min = layoutInfo.min;
  var max = layoutInfo.max;
  var top = layoutInfo.top;
  var bottom = layoutInfo.bottom;
  var offsetSize = layoutInfo.offsetSize;
  var offsetBP = layoutInfo.offsetBP;

  var linePaths = [];
  for (var index = 0; index < datas.items.length; index++) {
    var item = datas.items[index];
    var x = this.getXByDate(item.st);
    var y = top + ((max - item.val) / offsetBP) * offsetSize;
    linePaths.push(x, y);
    // 画圆
    this.contentScene.scrollContainer.addChild(
      this.drawCircleAndText(
        "top",
        x,
        y,
        GraphStyle.defaultCircle,
        item.val,
        GraphStyle.baseTextStyle
      )
    );
  }

  // 画线
  this.contentScene.scrollContainer.addChild(
    this.drawLineByPaths(linePaths, GraphStyle.defaultLine)
  );

  // 左侧刻度
  var scale = this.drawScale(config.y2 - config.y1, max, min);
  scale.x = this.DAY_WIDTH;
  scale.y = config.y1;
  this.verScene.scrollContainer.addChild(scale);
};

// 心率
Chart.prototype.drawHeartRate = function(datas) {
  var config = CONFIG.base["key5_3"];
  var layoutInfo = this.calTestLayout(config, datas.items);
  var min = layoutInfo.min;
  var max = layoutInfo.max;
  var top = layoutInfo.top;
  var bottom = layoutInfo.bottom;
  var offsetSize = layoutInfo.offsetSize;
  var offsetBP = layoutInfo.offsetBP;

  var linePaths = [];
  for (var index = 0; index < datas.items.length; index++) {
    var item = datas.items[index];
    var x = this.getXByDate(item.st);
    var y = top + ((max - item.val) / offsetBP) * offsetSize;
    linePaths.push(x, y);
    // 画圆
    this.contentScene.scrollContainer.addChild(
      this.drawCircleAndText(
        "top",
        x,
        y,
        GraphStyle.defaultCircle,
        item.val,
        GraphStyle.baseTextStyle
      )
    );
  }

  // 画线
  this.contentScene.scrollContainer.addChild(
    this.drawLineByPaths(linePaths, GraphStyle.defaultLine)
  );

  // 左侧刻度
  var scale = this.drawScale(config.y2 - config.y1, max, min);
  scale.x = this.DAY_WIDTH;
  scale.y = config.y1;
  this.verScene.scrollContainer.addChild(scale);
};

// 画出入量左侧title
// 右侧网格
Chart.prototype.drawIOnputBase = function() {
  var config = CONFIG.base["key6"];
  var height = config.y2 - config.y1;

  // 左侧列表
  // =============

  // 摄入
  var y1 = config.y1 + height / 3;
  var line1 = this.drawLine(
    this.titleBgWidth,
    y1,
    this.VERTICAL_WIDTH,
    y1,
    GraphStyle.alpha0_1Line
  );
  var text1 = this.drawText(
    config["key6_1"].name,
    this.titleBgWidth + 2,
    y1 - 2,
    GraphStyle.baseTextStyle
  );
  text1.anchor.x = 0;
  text1.anchor.y = 1;
  text1.scale.x = text1.scale.y = 0.7;
  this.verScene.scrollContainer.addChild(line1);
  this.verScene.scrollContainer.addChild(text1);

  // 排除
  var y2 = config.y1 + (height * 2) / 3;
  var line2 = this.drawLine(
    this.titleBgWidth,
    y2,
    this.VERTICAL_WIDTH,
    y2,
    GraphStyle.alpha0_1Line
  );
  var text2 = this.drawText(
    config["key6_2"].name,
    this.titleBgWidth + 2,
    y2 - 2,
    GraphStyle.baseTextStyle
  );
  text2.anchor.x = 0;
  text2.anchor.y = 1;
  text2.scale.x = text2.scale.y = 0.7;
  this.verScene.scrollContainer.addChild(line2);
  this.verScene.scrollContainer.addChild(text2);

  // 吸收
  var text3 = this.drawText(
    config["key6_3"].name,
    this.titleBgWidth + 2,
    config.y2 - 2,
    GraphStyle.baseTextStyle
  );
  text3.anchor.x = 0;
  text3.anchor.y = 1;
  text3.scale.x = text3.scale.y = 0.7;
  this.verScene.scrollContainer.addChild(text3);

  // 右侧内容区
  // =============
  this.contentScene.scrollContainer.addChild(
    this.drawLine(0, y1, this.contentWidth, y1, GraphStyle.alpha0_1Line)
  );
  this.contentScene.scrollContainer.addChild(
    this.drawLine(0, y2, this.contentWidth, y2, GraphStyle.alpha0_1Line)
  );
};

// 画出入量内容
Chart.prototype.drawIOnput = function(datas) {
  // 左侧列表
  // 内容区域横线
  this.drawIOnputBase();

  // 内容区域文字
  var config = CONFIG.base["key6"];
  var height = config.y2 - config.y1;
  var y1 = config.y1 + height / 3 - 2;
  var y2 = config.y1 + (height * 2) / 3 - 2;
  var y3 = config.y2 - 2;

  for (var i = 0; i < datas.items.length; i++) {
    var item = datas.items[i];
    var x = this.getXByDate(item.st) - this.DAY_WIDTH / 2 + 5;
    var inText = this.drawText(item.in, x, y1, GraphStyle.baseTextStyle);
    inText.anchor.y = 1;
    var outText = this.drawText(item.out, x, y2, GraphStyle.baseTextStyle);
    outText.anchor.y = 1;
    var absorbText = this.drawText(
      item.in - item.out,
      x,
      y3,
      GraphStyle.baseTextStyle
    );
    absorbText.anchor.y = 1;
    this.contentScene.scrollContainer.addChild(inText);
    this.contentScene.scrollContainer.addChild(outText);
    this.contentScene.scrollContainer.addChild(absorbText);
  }
};

// 画事件
Chart.prototype.drawEvent = function(datas) {
  var config = CONFIG.base["key1"];
  var height = config.y2 - config.y1;

  var fontStyle = {
    fill: "#000",
    fontSize: 12,
    wordWrap: true,
    wordWrapWidth: this.DAY_WIDTH * 0.6
  };

  // 根据时间，将相同时间事件分组
  var sortData = {};
  for (var i = 0; i < datas.items.length; i++) {
    var item = datas.items[i];
    sortData[item.st] = sortData[item.st] || [];
    var itemNameSize = this.getWordsSize(item.name, fontStyle);
    sortData[item.st].push({
      name: item.name,
      width: itemNameSize.width,
      height: itemNameSize.height
    });
  }

  for (var st in sortData) {
    var x = this.getXByDate(st - 0) - this.DAY_WIDTH / 2 + this.DAY_WIDTH * 0.3;
    var infos = sortData[st];

    // 画文字以及三角形
    var container = new PIXI.Container();
    var contentHeight = 0;
    for (var i = 0; i < infos.length; i++) {
      var info = infos[i];
      var y = info.oy;
      container.addChild(this.drawText(info.name, 0, contentHeight, fontStyle));
      container.addChild(
        this.drawTriangle(
          -10,
          contentHeight + info.height / 2,
          "top",
          GraphStyle.defaultTriangle
        )
      );
      contentHeight += info.height + 3;
    }
    container.x = x;
    container.y = config.y1 + (height - contentHeight) / 2;
    this.contentScene.scrollContainer.addChild(container);
  }
};

// 画医嘱（用药）
Chart.prototype.drawDaDrug = function(datas) {
  var config = CONFIG.base["key2_1"];
  var startY = config.y1 + 10;
  for (var i = 0; i < datas.items.length; i++) {
    var item = datas.items[i];
    if (item.dates && item.dates.length) {
      for (var j = 0; j < item.dates.length; j++) {
        var date = item.dates[j];
        this.contentScene.scrollContainer.addChild(
          this.getDaItem(item.type, date.st, date.et, startY, item.texts)
        );
      }
    } else {
      this.contentScene.scrollContainer.addChild(
        this.getDaItem(item.type, item.st, item.et, startY, item.texts)
      );
    }
    startY += this.daBgHeight + 5;
  }
};

// 画医嘱（护理）
Chart.prototype.drawDaNursing = function(datas) {
  var config = CONFIG.base["key2_2"];
  var startY = config.y1 + 10;
  for (var i = 0; i < datas.items.length; i++) {
    var item = datas.items[i];
    if (item.dates && item.dates.length) {
      for (var j = 0; j < item.dates.length; j++) {
        var date = item.dates[j];
        this.contentScene.scrollContainer.addChild(
          this.getDaItem(item.type, date.st, date.et, startY, item.texts)
        );
      }
    } else {
      this.contentScene.scrollContainer.addChild(
        this.getDaItem(item.type, item.st, item.et, startY, item.texts)
      );
    }
    startY += this.daBgHeight + 5;
  }
};

// 左右滑动，保证长医嘱上的文字在背景范围内贴边显示
Chart.prototype.checkDaText = function() {
  var children = this.contentScene.scrollContainer.children;
  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    if (child.name != "da_item_1") {
      continue;
    }
    var pos = child.getGlobalPosition();
    if (
      pos.x < this.VERTICAL_WIDTH + this.DAY_WIDTH / 2 &&
      pos.x + child.width - this.DAY_WIDTH > this.VERTICAL_WIDTH
    ) {
      child.children[1].x =
        child.children[1].ox + (this.VERTICAL_WIDTH - pos.x);
    } else {
      child.children[1].x = child.children[1].ox;
    }
  }
};

// 画医嘱条
// 未执行结束的是绿色背景
// 已经执行结束的是蓝色背景
Chart.prototype.getDaItem = function(type, st, et, y, texts) {
  var container = new PIXI.Container();
  container.name = "da_item_" + type;

  var sx = this.getXByDate(st);
  var x = sx - this.DAY_WIDTH / 2;
  var width = et
    ? this.getXByDate(et) + this.DAY_WIDTH / 2 - x
    : this.DAY_WIDTH;
  var bgstyle = GraphStyle.roundedRect2;
  if (type === 1 && !et) {
    width = this.contentWidth - x;
    bgstyle = GraphStyle.roundedRect1;
  }
  var bg = this.drawRoundedRect(0, 0, width, this.daBgHeight, bgstyle);
  container.addChild(bg);

  var textContainer = new PIXI.Container();
  for (var i = 0; i < texts.length; i++) {
    var text = this.drawText(texts[i], 0, i * 15, GraphStyle.baseTextStyle);
    text.anchor.x = 0.5;
    textContainer.addChild(text);
  }
  // 需要让文字能够在单格格子中显示全
  if (textContainer.width > this.DAY_WIDTH - 12) {
    textContainer.scale.x = textContainer.scale.y =
      (this.DAY_WIDTH - 12) / textContainer.width;
  } else if (texts.length >= 2) {
    // 另外两行字的需要文字小一点
    textContainer.scale.x = textContainer.scale.y = 0.8;
  }
  textContainer.x = textContainer.ox = this.DAY_WIDTH / 2;
  textContainer.y = textContainer.oy =
    (this.daBgHeight - textContainer.height) / 2;
  container.addChild(textContainer);

  container.x = x;
  container.y = y;

  return container;
};

// 画病程
Chart.prototype.drawRecord = function(datas) {
  var config = CONFIG.base["key3"];
  var fontStyle = {
    fill: "#000",
    fontSize: 12,
    wordWrap: true,
    wordWrapWidth: this.DAY_WIDTH * 0.6
  };

  for (var i = 0; i < datas.items.length; i++) {
    var item = datas.items[i];
    var container = new PIXI.Container();
    var sprite = PIXI.Sprite.fromImage("./images/record.png");
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0;
    container.addChild(sprite);
    var text = this.drawText("病程记录", 0, sprite.height, fontStyle);
    text.anchor.x = 0.5;
    text.anchor.y = 0;
    text.y += 20;
    text.scale.x = text.scale.y = 0.8;
    container.addChild(text);

    container.x = this.getXByDate(item.st);
    container.y = config.y1 + container.height / 2;
    this.contentScene.scrollContainer.addChild(container);
  }
};

// 辅助检查
Chart.prototype.drawCheck = function(datas) {
  var config = CONFIG.base["key4"];
  var fontStyle = {
    fill: "#000",
    fontSize: 12,
    wordWrap: true,
    wordWrapWidth: this.DAY_WIDTH * 0.6
  };

  for (var i = 0; i < datas.items.length; i++) {
    var item = datas.items[i];
    var container = new PIXI.Container();
    var sprite = PIXI.Sprite.fromImage("./images/check.png");
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0;
    container.addChild(sprite);
    var text = this.drawText(item.name, 0, sprite.height, fontStyle);
    text.anchor.x = 0.5;
    text.anchor.y = 0;
    text.y += 20;
    text.scale.x = text.scale.y = 0.8;
    container.addChild(text);

    container.x = this.getXByDate(item.st);
    container.y = config.y1 + container.height / 2;
    this.contentScene.scrollContainer.addChild(container);
  }
};
