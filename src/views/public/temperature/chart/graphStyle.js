// 用到的图形样式

(function(window) {
  const COLORS = {
    red: 0xff0000,
    green: 0xc34288,
    blue: 0x0000FF,

    default: 0xFF6A00,
    chartLine: 0xCCCCCC
  };

  const CIRCLE_RADIUS = 4;

  window.GraphStyle = {
    // 颜色
    colors: COLORS,
    // 文字基础样式
    baseTextStyle: {
      fontFamily: "Arial",
      fontSize: 12,
      fill: ["#605D5A"]
    },
    // 图章文字
    stampTextStyle: {
      fontFamily: "Arial",
      fontSize: 12,
      fill: ["#F05A23FF"],
      wordWrap: true
    },
    // 带边框实心圆
    circle1: {
      color: COLORS.red,
      radius: CIRCLE_RADIUS,
      lineWidth: 2,
      lineColor: COLORS.green
    },
    // 空心圆
    circle2: {
      lineWidth: 2,
      lineColor: COLORS.default,
      radius: CIRCLE_RADIUS
    },
    // 常规圆
    // defaultCircle: {
    //   color: COLORS.default,
    //   radius: CIRCLE_RADIUS
    // },
    // 常规圆
    defaultCircle: {
      color: COLORS.default,
      radius: CIRCLE_RADIUS
    },
    // 三测单-体温
    ttCircle1: {
      color: COLORS.blue,
      radius: CIRCLE_RADIUS
    },
    ttCircle2: {
      lineWidth: 1,
      lineColor: COLORS.blue,
      radius: CIRCLE_RADIUS
    },
    ttX: {
      lineWidth: 1,
      color: COLORS.blue
    },
    ttline: {
      lineWidth: 1,
      color: COLORS.blue,
      alpha: 0.3
    },
    // 三测单-脉搏
    tpCircle1: {
      color: COLORS.red,
      radius: CIRCLE_RADIUS
    },
    tpCircle2: {
      lineWidth: 1,
      lineColor: COLORS.red,
      radius: CIRCLE_RADIUS
    },
    tpline: {
      lineWidth: 1,
      color: COLORS.red,
      alpha: 0.3
    },
    // 直线
    defaultLine: {
      lineWidth: 2,
      color: COLORS.default,
      alpha: 1
    },
    chartLine: {
      lineWidth: 1,
      color: COLORS.chartLine,
      alpha: 1
    },
    alpha0_1Line: {
      lineWidth: 1,
      color: COLORS.chartLine,
      alpha: 0.1
    },
    alpha0_3Line: {
      lineWidth: 1,
      color: COLORS.chartLine,
      alpha: 0.3
    },
    // 虚线：
    defaultDottedLine: {
      dash: 5,
      gap: 5,
      lineWidth: 1,
      color: COLORS.chartLine
    },
    dottedLine2: {
      dash: 10,
      gap: 8,
      lineWidth: 1,
      color: COLORS.green,
      alpha: 0.2
    },
    // 标准线上限
    dottedLineHigh: {
      dash: 10,
      gap: 5,
      lineWidth: 1,
      color: COLORS.red,
      alpha: 0.7
    },
    // 标准线下限
    dottedLineLow: {
      dash: 10,
      gap: 8,
      lineWidth: 1,
      color: COLORS.red,
      alpha: 0.7
    },
    // 多边形样式
    polygon1: {},
    // 三角形
    star1: {
      lineWidth: 2,
      lineColor: COLORS.green,
      color: COLORS.red
    },
    // 三角形
    defaultTriangle: {
      color: COLORS.default
    },
    // 带圆角的矩形
    roundedRect1: {
      color: 0x46DC6C,
      radius: 10,
      alpha: 0.5
    },
    roundedRect2: {
      color: 0x6478D3,
      radius: 10,
      alpha: 0.5
    }
  };
})(window);
