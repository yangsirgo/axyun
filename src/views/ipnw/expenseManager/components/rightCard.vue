<template>
  <div class="right-card">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="费用合计" name="first"
        ><div class="top-con">
          <el-button type="primary" @click="printList">打印</el-button>
          <el-date-picker
            style="margin-left:40px;"
            v-model="valueDate"
            type="daterange"
            start-placeholder="住院开始"
            end-placeholder="住院结束"
          >
          </el-date-picker>
        </div>
        <div class="cost-con" v-if="isFirst">
          <div class="top-cost-all common">
            <p class="cost-type-name">
              总费用
            </p>
            <div class="top-cost-body clearfix">
              <p class="cost-detail">
                西药费<span class="xiyao number">¥ 500.00</span> 治疗费<span
                  class="treat number"
                  >- -</span
                >
                床位费<span class="bed-cost number">¥ 900.00</span> 检查费<span
                  class="check-cost number"
                  >¥ 200.00</span
                >
                检验费<span class="survey-fees number">- -</span> 监护费<span
                  class="custody-fee number"
                  >¥ 900.00</span
                >
              </p>
              <span class="total-cost">
                合计 <span class="num">¥ 2500.00</span>
              </span>
            </div>
          </div>
          <div
            class="common"
            v-for="(projectItem, index) in tablesDataList"
            :key="index"
          >
            <p class="cost-type-name">
              {{ projectItem.title }}
            </p>
            <el-table
              header-cell-class-name="headerCls"
              row-class-name="rowStyleCls"
              ref="singleTable"
              :data="projectItem.tableList"
              highlight-current-row
              style="width: 100%;margin-top: 20px;"
              height="100%"
              show-summary
              :summary-method="getSummaries"
              v-loadmore="load"
              stripe
              border
              v-loading="isLoading"
              element-loading-text="加载中..."
            >
              <el-table-column
                v-for="item in tableColumn"
                :key="item.label"
                :label="item.label"
                :prop="item.prop"
                align="left"
                show-overflow-tooltip
                header-align="left"
                :min-width="item.width"
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="费用明细" name="second">
        <div class="top-con">
          <el-button type="primary" @click="printList">打印</el-button>
          <el-date-picker
            style="margin-left:40px;"
            v-model="valueDate"
            type="daterange"
            start-placeholder="住院开始"
            end-placeholder="住院结束"
          >
          </el-date-picker>
        </div>
        <div class="collapse-con">
          <div class="top-level">
            <el-checkbox @change="changeTop" v-model="radio"></el-checkbox>
            <span class="number">05</span>
            床
            <span class="name">刘明</span>
            <span class="sex">男</span>
            <span class="age">23岁</span>
          </div>
          <div class="second-level">
            <div
              class="second-level-con"
              v-for="(parentItem, $index) in collapseData"
              :key="$index"
            >
              <div class="slot-title">
                <el-checkbox
                  @change="changeItem($index)"
                  v-model="parentItem.checked"
                ></el-checkbox>
                <span class="title-item"
                  >{{ parentItem.applicationDate }} &nbsp;(种类:
                  {{ parentItem.type }}, 总数量: {{ parentItem.totalNum }}, ￥{{
                    parentItem.cost
                  }})
                </span>
              </div>
              <div class="table-wrapper">
                <el-table
                  header-cell-class-name="headerCls"
                  row-class-name="rowStyleCls"
                  ref="singleTable"
                  :data="parentItem.itemData"
                  highlight-current-row
                  style="width: 100%"
                  stripe
                  border
                  element-loading-text="加载中..."
                >
                  <el-table-column
                    v-for="item in collapseTableColumn"
                    :key="item.label"
                    :label="item.label"
                    :prop="item.prop"
                    align="left"
                    show-overflow-tooltip
                    header-align="left"
                    :min-width="item.width"
                  >
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "",
  methods: {
    // 打印
    printList() {
      console.log("打印");
    },
    handleTabClick(tab, event) {
      // tab 切换
      console.log(tab, event);
      if (tab.name === "first") {
        this.isFirst = true;
        this.isSecond = false;
      } else if (tab.name === "second") {
        this.isFirst = false;
        this.isSecond = true;
      }
    },
    // 表格总价设置方法
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));

        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            }
            return prev;
          }, 0);
          if (index === 2) {
            sums[index] = "";
          } else if (index === 3) {
            sums[index] = "合计 " + sums[index];
          } else {
            sums[index] = "合计 ￥" + sums[index];
          }
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    changeTop() {
      if (this.radio === true) {
        this.collapseData.forEach((item, index) => {
          item.checked = true;
        });
      } else {
        this.collapseData.forEach((item, index) => {
          item.checked = false;
        });
      }
    },
    changeItem(index) {
      this.radio = this.collapseData.every((item, index) => {
        return item.checked === true;
      });
    }
  },
  components: {},
  data() {
    return {
      activeName: "first",
      isFirst: true,
      tabsList: [
        {
          tabName: "费用合计",
          label: "first"
        },
        {
          tabName: "费用明细",
          label: "second"
        }
      ],
      valueDate: ["2019-09-24T16:00:00.000Z", "2019-10-28T15:59:59.000Z"],
      load: false,
      isLoading: false,
      tableColumn: [
        {
          prop: "projectName",
          label: "项目名称",
          width: "100"
        },
        {
          prop: "specification",
          label: "规格",
          width: "30"
        },
        {
          prop: "pricePee",
          label: "单价",
          width: "30"
        },
        {
          prop: "amount",
          label: "数量",
          width: "30"
        },
        {
          prop: "totalCost",
          label: "合计",
          width: "30"
        }
      ],
      tablesDataList: [
        {
          title: "西药类",
          tableList: [
            {
              id: 1,
              projectName: "注射用盐酸头孢甲污",
              specification: "100ml*1",
              pricePee: "50.00",
              amount: "5",
              totalCost: "250.00 "
            },
            {
              id: 2,
              projectName: "注射用盐酸头孢替安",
              specification: "100ml*1",
              pricePee: "50.00",
              amount: "5",
              totalCost: "250.00 "
            },
            {
              id: 3,
              projectName: "盐酸钙D3片",
              specification: "100ml*1",
              pricePee: "50.00",
              amount: "5",
              totalCost: "250.00 "
            },
            {
              id: 4,
              projectName: "骨化三醇软胶南",
              specification: "100ml*1",
              pricePee: "150.00",
              amount: "2",
              totalCost: "300.00 "
            }
          ]
        },
        {
          title: "床位费",
          tableList: [
            {
              id: 1,
              projectName: "四人床",
              specification: "50元/天",
              pricePee: "50.00",
              amount: "10",
              totalCost: "500.00 "
            },
            {
              id: 2,
              projectName: "干部病房 ",
              specification: "100元/天",
              pricePee: "80.00",
              amount: "4",
              totalCost: "400.00 "
            }
          ]
        }
      ],
      radio: "",
      collapseData: [
        {
          checked: true,
          applicationDate: "2018-02-03",
          type: 1,
          totalNum: 5,
          cost: "90.00",
          itemData: [
            {
              id: 1111, //id
              projectType: "西药",
              projectCode: "1102",
              projectName: "0.9%氧化钠注射液",
              specification: "500ml*1瓶",
              unitPrice: "20",
              amount: "30",
              cost: "80",
              executeOffoce: "泌尿外科",
              executer: "刘红",
              executeDate: "2019-06-11 17:31"
            },
            {
              id: 2222, //id
              projectType: "西药",
              projectCode: "1102",
              projectName: "0.9%氧化钠注射液",
              specification: "500ml*1瓶",
              unitPrice: "20",
              amount: "30",
              cost: "80",
              executeOffoce: "泌尿外科",
              executer: "刘红",
              executeDate: "2019-06-11 17:31"
            }
          ]
        },
        {
          checked: false,
          applicationDate: "2018-02-03",
          type: 1,
          totalNum: 5,
          cost: "90.00",
          itemData: [
            {
              id: 1111, //id
              projectType: "西药",
              projectCode: "1102",
              projectName: "0.9%氧化钠注射液",
              specification: "500ml*1瓶",
              unitPrice: "20",
              amount: "30",
              cost: "80",
              executeOffoce: "泌尿外科",
              executer: "刘红",
              executeDate: "2019-06-11 17:31"
            },
            {
              id: 2222, //id
              projectType: "西药",
              projectCode: "1102",
              projectName: "0.9%氧化钠注射液",
              specification: "500ml*1瓶",
              unitPrice: "20",
              amount: "30",
              cost: "80",
              executeOffoce: "泌尿外科",
              executer: "刘红",
              executeDate: "2019-06-11 17:31"
            }
          ]
        }
      ],
      collapseTableColumn: [
        {
          prop: "projectType",
          label: "项目类别",
          width: "15"
        },
        {
          prop: "projectCode",
          label: "项目代码",
          width: "15"
        },
        {
          prop: "projectName",
          label: "项目名称",
          width: "50"
        },
        {
          prop: "specification",
          label: "规格",
          width: "25"
        },
        {
          prop: "unitPrice",
          label: "单价",
          width: "15"
        },
        {
          prop: "amount",
          label: "数量",
          width: "15"
        },
        {
          prop: "cost",
          label: "金额",
          width: "15"
        },
        {
          prop: "executeOffoce",
          label: "执行科室",
          width: "30"
        },
        {
          prop: "executer",
          label: "执行人",
          width: "20"
        },
        {
          prop: "executeDate",
          label: "执行时间",
          width: "30"
        }
      ]
    };
  }
};
</script>

<style lang='scss' scoped>
.right-card {
  .top-con {
    padding-left: 20px;
    font-size: 0;
  }
  .cost-con {
    .common {
      margin-top: 20px;
      padding: 0 20px;
      widows: 100%;
      .cost-type-name {
        height: 20px;
        font-size: 14px;
        
        font-weight: bold;
        color: rgba(148, 157, 163, 1);
        line-height: 20px;
      }
      .top-cost-body {
        margin-top: 20px;
        height: 123px;
        background: rgba(245, 245, 245, 1);
        border-radius: 2px;
        .cost-detail {
          margin: 0 20px;
          padding: 20px 0;
          display: block;
          
          font-weight: 400;
          color: rgba(148, 157, 163, 1);
          line-height: 20px;
          border-bottom: 1px solid #e4e4e4;
          .number {
            margin-left: 5px;
            margin-right: 40px;
            font-size: 16px;
            
            font-weight: 400;
            color: rgba(46, 50, 58, 1);
            line-height: 21px;
          }
        }
        .total-cost {
          margin-top: 25px;
          margin-right: 20px;
          float: right;
          font-size: #949da3;
          .num {
            font-size: 16px;
            
            font-weight: bold;
            color: $l-color-primary;
          }
        }
      }
    }
  }
  .collapse-con {
    margin-top: 20px;
    padding:0 20px;
    .top-level {
      width: 100%;
      padding: 9px;
      background: $l-color-bgcolor-18;
      font-size: 14px;
      
      font-weight: 400;
      color: rgba(46, 50, 58, 1);
      .number {
        margin-left: 10px;
        font-size: 20px;
        
      }
      .name {
        margin-left: 15px;
      }
      .sex {
        margin-left: 20px;
      }
      .age {
        margin-left: 20px;
      }
    }
    .second-level {
      padding-left: 36px;
      .second-level-con {
        margin-top: 10px;
        .table-wrapper {
          margin-top: 10px;
          padding-right: 0;
          width: 100%;
        }
        .slot-title {
          padding: 10px;
          background-color: $l-color-bgcolor-18;
          color: #2e323a;
          font-size: 0;
          .title-item {
            margin-left: 10px;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
