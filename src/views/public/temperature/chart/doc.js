
// 时间线数据结构

// st: 数据点时间戳
// min、max: 标准值上下限

// 类型映射
// ==================================
// 血压：range
// 体温、血压：line
// 医嘱： enjoin
// 病程、辅助检查：record
// 出入量：table
// 事件：event
var needData = [
  {
    options: {
      type: "range",
      name: "区域图形",
      grid: { height: 100 },
      min: 80,
      max: 120,
      titleBgColor: 0xFF6A00
    },
    data: [
      {
        st: 1553613687934,
        max: 145,
        min: 89
      },
      {
        st: 1553813687934,
        max: 140,
        min: 85
      },
      {
        st: 1554113687934,
        max: 130,
        min: 90
      },
      {
        st: 1554973587934,
        max: 142,
        min: 91
      },
      {
        st: 1554973587934,
        max: 140,
        min: 87
      }
    ]
  },
  {
    options: {
      type: "line",
      name: "曲线图形",
      grid: { height: 100 },
      min: 35,
      max: 40,
      titleBgColor: 0xFF6A00
    },
    data: [
      {
        st: 1553613687934,
        val: 36.9
      },
      {
        st: 1554113687934,
        val: 37.1
      },
      {
        st: 1554973587934,
        val: 36.8
      },
      {
        st: 1554113687934,
        val: 36.8
      },
      {
        st: 1554973587934,
        val: 36.5
      }
    ]
  },
  {
    options: {
      type: "enjoin",
      name: "医嘱",
      grid: { height: 60 },
      titleBgColor: 0xFF6A00
    },
    data: [
      {
        // 长期医嘱
        type: 1,
        texts: ["5%葡萄糖注射液", "250ml Tid"],
        dates: [
          {
            st: 1553413687934
          }
        ]
      },
      {
        // 长期医嘱
        type: 1,
        texts: ["注射用炎琥宁", "40mg Tid"],
        dates: [
          {
            st: 1553413687934
          }
        ]
      },
      {
        // 临时医嘱
        type: 2,
        texts: ["头孢丙烯分散片", "0.5g St"],
        st: 1553573587934,
        dates: [
          {
            st: 1553573587934
          },
          {
            st: 1553713687934
          },
          {
            st: 1553713687934
          }
        ]
      },
      {
        // 临时医嘱
        type: 2,
        texts: ["复方甲氧那明胶囊", "2粒 St"],
        st: 1553573587934,
        dates: [
          {
            st: 1553573587934
          },
          {
            st: 1553713687934
          },
          {
            st: 1553713687934
          }
        ]
      },
      {
        // 临时医嘱
        type: 2,
        texts: ["连花清瘟胶囊", "1.2g st"],
        st: 1553573587934,
        dates: [
          {
            st: 1553573587934
          },
          {
            st: 1553713687934
          },
          {
            st: 1553713687934
          }
        ]
      }
    ]
  },
  {
    options: {
      type: "record",
      name: "病程",
      grid: { height: 60 },
      titleBgColor: 0xFF6A00
    },
    data: [
      {
        id: "001",
        label: "label",
        st: 1553613687934
      },
      {
        id: "001",
        label: "label",
        st: 1553613687934
      },
      {
        id: "002",
        label: "label",
        st: 1554973587934
      }
    ]
  },
  {
    options: {
      type: "table",
      name: "表格",
      grid: { height: 90 },
      titleBgColor: 0xFF6A00,
      titles: [
        {
          key: "in",
          name: "数据1"
        },
        {
          key: "out",
          name: "数据2"
        },
        {
          key: "rsl",
          name: "数据3"
        }
      ]
    },
    data: [
      {
        st: 1553613687934,
        in: 40,
        out: 36,
        rsl: 4
      },
      {
        st: 1554113687934,
        in: 45,
        out: 33
      },
      {
        st: 1554973587934,
        in: 51,
        out: 40
      }
    ]
  },
  {
    options: {
      type: "event",
      name: "事件",
      grid: { height: 60 },
      titleBgColor: 0xFF6A00
    },
    data: [
      {
        name: "家床",
        st: 1553413687934
        // 用于生成测试数据，表示几天前发生的事情
      },
      {
        name: "CT检查",
        st: 1553413687934
      },
      {
        name: "换床",
        st: 1553673587934
      },
      {
        name: "手术",
        st: 1553673587934
      },
      {
        name: "会诊",
        st: 1553673587934
      }
    ]
  }
];
