<template>
  <el-card class="box-card height100">
    <div slot="header" class="clearfix">
      <span class="titleBefore"></span>
      <span class="title">医嘱和体征</span>
      <div class="fr margin-right-20">
        <el-button type="text" icon="iconfont iconxinzeng" v-if="activeName === 'third'">新增手术</el-button>
        <el-button type="text" v-if="activeName === 'fourth'">查看体温单</el-button>
        <el-button
          type="text"
          icon="iconfont iconxinzeng"
          v-if="activeName !== 'third' && activeName !== 'fourth'"
        >新增医嘱</el-button>
      </div>
    </div>
    <div class="utils fr" v-show="radioUtils">
      <el-radio v-model="firstTab.radio" label="1">正在使用</el-radio>
      <el-radio v-model="firstTab.radio" label="2">全部</el-radio>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick" ref="tab" style="height: 100%">
      <el-tab-pane label="药品" name="first" class="tableBody">
        <div class="height100">
          <el-table
            height="100%"
            element-loading-text="加载中..."
            tooltip-effect="dark"
            :data="firstTab.tableData"
            border
          >
            <el-table-column
              v-for="(item,index) in firstTab.tableColumn"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              header-align="center"
              :align="item.align || 'left'"
              :fixed="item.fixed"
            ></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="治疗" name="second" class="secondTab">
        <treatment-tab></treatment-tab>
      </el-tab-pane>
      <el-tab-pane label="手术" name="third">
        <div class="height100">
          <el-table
            height="100%"
            element-loading-text="加载中..."
            tooltip-effect="dark"
            :data="firstTab.tableData"
            border
          >
            <el-table-column
              v-for="(item,index) in firstTab.tableColumn"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              header-align="center"
              :align="item.align || 'left'"
              :fixed="item.fixed"
            ></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="体温" name="fourth" class="fourthTab">
        <temperature
          :temp-data="four.temperatureData"
          :date-data="four.dateData"
          v-if="'fourth' === activeName"
        ></temperature>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import treatmentTab from "./treatmentTab.vue";
import temperature from "./temperatureCharts.vue";

export default {
  name: "medicalOrderSign",
  data() {
    return {
      four: {
        temperatureData: [36.8, 37.2, 38.5, 38.0, 37.1],
        dateData: [
          "12-04 03:00",
          "12-04 03:00",
          "12-04 03:00",
          "12-04 03:00",
          "12-04 03:00"
        ]
      },
      activeName: "first",
      radioUtils: true,
      firstTab: {
        radio: "1",
        calcHeight: 150,
        tableColumn: [
          {
            prop: "state",
            label: "状态"
          },
          {
            prop: "timeS",
            label: "开嘱时间",
            width: 140
          },
          {
            prop: "timeE",
            label: "停嘱时间",
            width: 140
          },
          {
            prop: "name",
            label: "名称"
          },
          {
            prop: "specs",
            label: "规格"
          },
          {
            prop: "useNo",
            label: "用量"
          },
          {
            prop: "usage",
            label: "用法"
          },
          {
            prop: "rate",
            label: "频次"
          },
          {
            prop: "room",
            label: "执行科室"
          }
        ],
        tableData: [
          {
            state: "长期",
            timeS: "2019-09-18 18:20",
            timeE: "",
            name: "阿莫西林",
            specs: "10mg/支",
            useNo: "10mg",
            usage: "肌注",
            rate: "dp",
            room: ""
          },
          {
            state: "长期",
            timeS: "2019-09-18 18:20",
            timeE: "",
            name: "阿莫西林",
            specs: "10mg/支",
            useNo: "10mg",
            usage: "肌注",
            rate: "dp",
            room: ""
          },
          {
            state: "长期",
            timeS: "2019-09-18 18:20",
            timeE: "",
            name: "阿莫西林",
            specs: "10mg/支",
            useNo: "10mg",
            usage: "肌注",
            rate: "dp",
            room: ""
          },
          {
            state: "长期",
            timeS: "2019-09-18 18:20",
            timeE: "",
            name: "阿莫西林",
            specs: "10mg/支",
            useNo: "10mg",
            usage: "肌注",
            rate: "dp",
            room: ""
          }
        ]
      }
    };
  },
  components: {
    treatmentTab,
    temperature
  },
  methods: {
    setFirstTable() {
      // let tabsHeight = this.$refs.tab.$el.clientHeight;
      // this.firstTab.calcHeight = tabsHeight - utilsHeight;
    },
    //first tab utils 显示隐藏的方法
    utilsVisible(val) {
      if (val.name === "first") {
        this.radioUtils = true;
      } else {
        this.radioUtils = false;
      }
    },
    // 点击tab 事件
    handleClick(val) {
      this.utilsVisible(val); //控制 first tab utils 显示隐藏的方法
    }
  },
  mounted() {
    let me = this;
    this.$nextTick(() => {
      me.setFirstTable(); //第一个tab 的table 高度赋值
    });
  }
};
</script>

<style scoped lang="scss">
.box-card {
  position: relative;
  text-align: left;

  .clearfix {
    line-height: 50px;
  }

  /deep/ .el-card__header {
    padding: 0 !important;
  }

  .titleBefore {
    vertical-align: middle;
    margin-right: 5px;
    height: 20px;
    background: $l-color-primary;
    display: inline-block;
    width: 4px;
    margin-left: 15px;
  }

  .title {
    font-size: 16px;
    
    font-weight: 500;
    color: rgba(46, 50, 58, 1);
    vertical-align: -2px;
  }

  /deep/ .el-table--border {
    border: 0;
  }

  .utils {
    position: relative;
    z-index: 1111;
    top: 12px;
    right: 40px;
  }

  /deep/ .el-tabs__content {
    height: calc(100% - 55px);
  }
  .secondTab {
    padding: 0 20px 20px;
    overflow: auto;
  }
  /deep/.el-tabs__header {
    margin-left: 20px;
  }
}
</style>
