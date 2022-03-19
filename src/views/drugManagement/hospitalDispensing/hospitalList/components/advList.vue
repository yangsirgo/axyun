<template>
  <div class="height100 advsontent">
    <el-card class="height100">
      <div class="top" style="margin-bottom:20px;">
        <el-row :gutter="20">
          <el-col :span="8">
            <l-formt-title label="录入日期" labelWidth="64">
              <div>
                <!-- <el-date-picker
                  v-model="formSearch.sDate"
                  style="width: 130px;"
                  prefix-icon="null"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="开始日期"
                ></el-date-picker>
                <el-date-picker
                  style="width: 150px;"
                  v-model="formSearch.eDate"
                  prefix-icon="iconfont iconriqi"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="结束日期"
                ></el-date-picker>-->
                <el-date-picker
                  style="width:100%;"
                  v-model="formSearch.date"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </div>
            </l-formt-title>
          </el-col>
          <el-col :span="4">
            <l-formt-title label="发药单号" labelWidth="64">
              <el-input v-model="formSearch.barCode" placeholder></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="2">
            <el-button class="float-left right-btn" type="primary" @click="search">查询</el-button>
          </el-col>

          <el-col :span="2" :offset="8">
            <el-button class="float-right right-btn" type="primary" @click="delivery">确认</el-button>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="20" class="table-container">
        <el-col :span="4">
          <el-table
            ref="tableData1"
            border
            stripe
            v-loading="listLoading"
            :data="tableData1"
            height="100%"
            style="width: 100%;"
            header-cell-class-name="headerCls"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column
              :key="index"
              v-for="(item, index) in tableColumn1"
              :min-width="item.width"
              :fixed="item.fixed"
              :prop="item.keyName"
              :header-align="item.align"
              :align="item.align"
              :label="item.name"
            >
              <template slot-scope="scope">
                <!--操作部分自定义-->
                <template v-if="item.keyName == 'deliveryState'">
                  <span v-if="scope.row.deliveryState=='0'" type="success">未发药</span>
                  <span v-if="scope.row.deliveryState=='1'" type="info">已发药</span>
                </template>
                <template v-else>
                  <span>{{scope.row[item.keyName]}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="20">
          <el-tabs v-model="activeName" @tab-click="handleClick" class="tab-cont">
            <!-- //发药单明细 -->
            <el-tab-pane label="发药单明细" name="first">
              <el-row style="padding:10px 0;">
                <el-col :span="4">
                  <span>单号:</span>
                  {{barCode}}
                </el-col>
                <el-col :span="4">
                  <span>病区:</span>
                  {{wardName}}
                </el-col>
              </el-row>
              <!-- 状态table -->
              <el-table
                ref="tableData2"
                border
                stripe
                v-loading="listLoading"
                :data="tableData2"
                height="257px"
                style="width: 100%;"
                header-cell-class-name="headerCls"
              >
                <el-table-column
                  :key="index"
                  v-for="(item, index) in tableColumn2"
                  :min-width="item.width"
                  :fixed="item.fixed"
                  :prop="item.keyName"
                  :header-align="item.align"
                  :align="item.align"
                  :label="item.name"
                ></el-table-column>
              </el-table>
              <el-row style="margin:20px 0;">
                <el-col>
                  <el-button
                    class="float-right right-btn"
                    type="primary"
                    plain
                    @click="printDetail"
                  >打印明细</el-button>
                </el-col>
              </el-row>
              <!-- 明细 -->
              <el-table
                ref="multipleTable"
                border
                v-loading="listLoading"
                :data="tableData"
                height="200px"
                style="width: 100%;"
                header-cell-class-name="headerCls"
                highlight-current-row
                :row-class-name="rowStyleCls"
                @selection-change="handleSelectionChange"
                @current-change="handleCurrentChange2"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column
                  :key="index"
                  v-for="(item, index) in tableColumn"
                  :min-width="item.width"
                  :fixed="item.fixed"
                  :prop="item.keyName"
                  :header-align="item.align"
                  :align="item.align"
                  :label="item.name"
                >
                  <template slot-scope="scope">
                    <template v-if="item.type === 'bunching'">
                      <span :class="scope.row.groupNoCls"></span>
                    </template>
                    <template v-else-if="item.keyName === 'packageUnit'">
                      <span :val="scope.row.packageUnit" code="DrugUnit" v-codeTransform></span>
                    </template>
                    <template v-else-if="item.keyName === 'price'">
                      <span>{{ formatNum(scope.row.price) }}</span>
                    </template>
                    <template v-else-if="item.keyName === 'drugQuantity'">
                      <span>{{scope.row.outfit}}</span>
                      <span>{{scope.row.drugUnit}}</span>
                      <template v-if="scope.row.bluk !== 0">
                        {{scope.row.bluk}}
                        <span>{{scope.row.packageUnit}}</span>
                      </template>
                    </template>
                    <template v-else-if="item.keyName === 'frequencyCode'">
                      <span
                        columns="FREQUENCY_NAME"
                        :conditionMap="{ FREQUENCY_CODE: scope.row.frequencyCode }"
                        tableName="hrp_frequency"
                        v-tableTransform
                      ></span>
                    </template>
                    <template v-else>
                      <span>{{scope.row[item.keyName]}}</span>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- //发药单明细 -->
            <el-tab-pane label="发药汇总明细" name="second">
              <!-- 状态table -->
              <el-row style="padding:10px 0;">
                <el-col :span="4">
                  <span>单号:</span>
                  {{barCode}}
                </el-col>
                <el-col :span="4">
                  <span>病区:</span>
                  {{wardName}}
                </el-col>
              </el-row>
              <el-table
                ref="tableData2"
                border
                stripe
                v-loading="listLoading"
                :data="tableData2"
                height="257px"
                style="width: 100%;"
                header-cell-class-name="headerCls"
              >
                <el-table-column
                  :key="index"
                  v-for="(item, index) in tableColumn2"
                  :min-width="item.width"
                  :fixed="item.fixed"
                  :prop="item.keyName"
                  :header-align="item.align"
                  :align="item.align"
                  :label="item.name"
                ></el-table-column>
              </el-table>
              <el-row style="margin:20px 0;">
                <el-col>
                  <el-button
                    class="float-right right-btn"
                    type="primary"
                    plain
                    @click="printSum"
                  >打印汇总</el-button>
                </el-col>
              </el-row>
              <!-- 明细 -->
              <el-table
                ref="tableData4"
                border
                stripe
                v-loading="listLoading"
                :data="tableData4"
                height="200px"
                style="width: 100%;"
                header-cell-class-name="headerCls"
                @selection-change="handleSelect"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column
                  :key="index"
                  v-for="(item, index) in tableColumn4"
                  :min-width="item.width"
                  :fixed="item.fixed"
                  :prop="item.keyName"
                  :header-align="item.align"
                  :align="item.align"
                  :label="item.name"
                >
                  <template slot-scope="scope">
                    <template v-if="item.keyName === 'packageUnit'">
                      <span :val="scope.row.packageUnit" code="DrugUnit" v-codeTransform></span>
                    </template>
                    <template v-if="item.keyName === 'drugQuantity'">
                      <span>{{scope.row.outfit}}</span>
                      <span>{{scope.row.drugUnit}}</span>
                      <template v-if="scope.row.bluk !== 0">
                        {{scope.row.bluk}}
                        <span>{{scope.row.packageUnit}}</span>
                      </template>
                    </template>
                    <template v-else>
                      <span>{{scope.row[item.keyName]}}</span>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import ipha from "@/api/hmm/ipha";
import { print, preview, onPreview } from "@/utils/print";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";
import { mapActions } from "vuex";

export default {
  props: ["selectId", "wardList"],
  data() {
    let myDate = new Date();
    let lastDate = new Date(myDate.getTime() - 7 * 24 * 3600 * 1000);
    let nowYear = myDate.getFullYear();
    let nowMonth = myDate.getMonth() + 1;
    nowMonth = nowMonth < 10 ? "0" + nowMonth : nowMonth;
    let nowDay = myDate.getDate();
    nowDay = nowDay < 10 ? "0" + nowDay : nowDay;

    let lastDy = lastDate.getFullYear();
    let lastDm = lastDate.getMonth() + 1;
    lastDm = lastDm < 10 ? "0" + lastDm : lastDm;
    let lastDd = lastDate.getDate();
    lastDd = lastDd < 10 ? "0" + lastDd : lastDd;
    return {
      id: "",
      listLoading: false,
      formSearch: {
        barCode: "", // 单号
        sDate: "", // 开始日期
        eDate: "", // 结束日期
        date: [
          `${lastDy}-${lastDm}-${lastDd}`,
          `${nowYear}-${nowMonth}-${nowDay}`
        ]
      },
      //单号信息
      //单号
      barCode: "",
      //病区
      wardId: "",
      // 病区名称
      wardName: "",
      //表一
      tableData1: [],
      tableColumn1: [
        // table 配置表头
        {
          keyName: "barCode",
          name: "发药单号",
          width: 90,
          align: "center"
        },
        {
          keyName: "deliveryState",
          name: "发药状态",
          align: "center",
          width: 90
        }
      ],
      activeName: "first",
      //表二
      tableData2: [],
      tableColumn2: [
        {
          keyName: "operate",
          name: "操作",
          width: 90,
          align: "center"
        },
        {
          keyName: "operator",
          name: "操作人",
          align: "center",
          width: 90
        },
        {
          keyName: "operateTime",
          name: "操作时间",
          align: "center",
          width: 90
        }
      ],

      //表三--成组样式
      tableData: [],
      tableDatachack: [], //打印选择
      tableColumn: [
        // table 配置表头
        {
          keyName: "bedNum",
          name: "床号",
          fixed: true,
          width: 90,
          align: "center"
        },
        {
          keyName: "patientName",
          name: "患者姓名",
          align: "center",
          fixed: true
        },
        {
          keyName: "deliveryBatchNum",
          name: "批次",
          fixed: true,
          align: "center",
          width: 70
        },
        {
          keyName: "drugName",
          name: "药品名称",
          align: "center",
          width: 200
        },
        {
          keyName: "groupNo",
          name: "",
          align: "center",
          width: 40,
          type: "bunching"
        },
        {
          keyName: "spec",
          name: "规格",
          width: 100
        },
        {
          keyName: "frequencyCode",
          name: "频次",
          value: 0,
          width: 80
        },
        {
          keyName: "price",
          name: "售价(元)",
          align: "right",
          width: 120
        },
        {
          keyName: "drugQuantity",
          name: "数量",
          width: 140
        },
        /* {
          keyName: "packageUnit",
          name: "单位",
          width: 90
        }, */
        {
          keyName: "setExeTime",
          name: "医嘱执行时间",
          width: 120
        }
      ],

      //表四
      tableData4: [],
      tableData4chack: [], //打印选择
      tableColumn4: [
        {
          keyName: "drugName",
          name: "药品名称",
          align: "center",
          width: 200
        },
        {
          keyName: "spec",
          name: "规格",
          width: 100
        },
        {
          keyName: "price",
          name: "售价",
          width: 60
        },
        {
          keyName: "drugQuantity",
          name: "数量",
          width: 140
        },
        /* {
          keyName: "packageUnit",
          name: "单位",
          width: 90
        }, */
        {
          keyName: "drugQuantity",
          name: "实际发药数量",
          width: 90
        }
      ],
      //不允许选择今天之后的日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },

  computed: {
    disabled() {
      // 滑动加载组件禁用状态
      return this.loading || this.noMore;
    }
  },
  watch: {
    selectId(val) {
      if (val) {
        this.search();
      }
    },
    wardId: {
      immediate: true,
      handler(val) {
        if (val) {
          let item = this.wardList.find(item => item.wardCode === val);
          this.wardName = item.wardName;
        } else {
          this.wardName = "";
        }
      }
    }
  },
  methods: {
    ...mapActions({
      changeOrderList: "drugManagement/changeOrderList",
      changeCurDrug: "drugManagement/changeDrug"
    }),
    handleCurrentChange2(val) {
      let item = this.wardList.find(item => item.wardCode === val.wardId);
      let wardName = "";
      if (item) {
        wardName = item.wardName;
      }
      this.changeCurDrug({ ...val, wardName: wardName });
    },
    formatNum(num) {
      return formatNum(num);
    },
    //查询第一个table
    async search() {
      try {
        this.$showLoading();
        this.barCode = ""; //单号
        this.wardId = ""; //病区
        this.tableData = [];
        this.tableData2 = [];
        this.tableData4 = [];
        let sparams = {
          ...this.formSearch,
          wardId: this.selectId,
          sDate:
            this.formSearch.date && this.formSearch.date[0]
              ? this.formSearch.date[0] + " 00:00:00"
              : "",
          eDate:
            this.formSearch.date && this.formSearch.date[1]
              ? this.formSearch.date[1] + " 23:59:59"
              : ""
        };
        let response = await ipha.sumList(sparams);
        let { data } = response;
        let table = [];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          table.push(item);
        }
        this.tableData1 = table;
        this.id = "";
        if (this.tableData1[0]) {
          this.$refs.tableData1.setCurrentRow(this.tableData1[0]);
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
      }
    },

    async handleCurrentChange(row) {
      row.id && this.changeOrderList([row.id]);
      this.id = row.id;
      this.barCode = row.barCode;
      this.wardId = row.wardId;
      try {
        this.$showLoading();
        let { data } = await ipha.getInptSumExe(this.id);
        // 发药单
        let { sumExe } = data;
        let table2 = [];
        for (let i = 0; i < sumExe.length; i++) {
          const item = sumExe[i];
          table2.push(item);
        }
        this.tableData2 = table2;
        // 发药单明细
        let { exeDetail } = data;
        let list1 = exeDetail.map(item => {
          let { out, bl } = blukToOutfit(item.drugQuantity, item.packQuantity);
          return {
            ...item,
            outfit: out,
            bluk: bl
          };
        });
        this.tableData = list1;
        // 发药单汇总明细
        let { sumDetail } = data;
        let list2 = sumDetail.map(item => {
          let { out, bl } = blukToOutfit(item.drugQuantity, item.packQuantity);
          return {
            ...item,
            outfit: out,
            bluk: bl
          };
        });
        this.tableData4 = list2;
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
      }
      this.setBunchingCls();
      this.setDataAddType(); //给数据增加type 属性
    },

    handleSelectionChange(val) {
      this.tableDatachack = val;
    },
    handleSelect(val) {
      this.tableData4chack = val;
    },

    setDataAddType() {
      let me = this;
      this.tableData.forEach(item => {
        // item.type = '';
        me.$set(item, "type", "");
      });
    },
    setBunchingCls() {
      var list = [];
      var filterList = [];
      let groupList = this.tableData.map(item => {
        return item.groupNo;
      });
      groupList = unique(groupList); //数组去重
      groupList = groupList.filter((item, index) => {
        // 数组去undefind
        return item !== undefined;
      });

      function unique(arr) {
        return Array.from(new Set(arr));
      }

      groupList.forEach((item, index) => {
        //遍历 成map结构
        // list = [];
        filterList = this.tableData.filter((sonItem, sonIde) => {
          return item === sonItem.groupNo;
        });
        list.push({
          key: item,
          value: filterList
        });
      });
      this.groupNoList = list;
      list.forEach(item => {
        let itemList = item.value;
        itemList.forEach((sonItem, sonIndex) => {
          if (sonIndex === 0) {
            sonItem.groupNoCls = "bunchingUp";
          } else if (sonIndex === itemList.length - 1) {
            sonItem.groupNoCls = "bunchingDown";
          } else {
            sonItem.groupNoCls = "bunchingCenter";
          }
        });
      });
    },
    //处理 row 的样式
    rowStyleCls({ row }) {
      if (!row.groupNo) {
        return "";
      }
      return "rowStyleCls";
    },

    //切换tab
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    //发药确认
    async delivery() {
      try {
        if (!this.id) {
          return;
        }
        this.$showLoading();
        let { data } = await ipha.delivery(this.id);
        this.$message.success(data);
        this.search();
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    //打印明细
    printDetail() {
      let data = {};
      data.title = "药品明细单";
      data.detailList = this.tableData;
      onPreview(data, "住院药房汇总单");
    },
    //打印汇总
    printSum() {
      let data = {};
      data.title = "药品汇总单";
      data.detailList = this.tableData4;
      onPreview(data, "住院药房汇总单");
    }
  },
  beforeDestroy() {
    // 销毁时清空数据
    this.changeCurDrug("");
  }
};
</script>

<style  lang="scss" scoped>
.advsontent {
  .top {
    overflow: hidden;
    padding: 20px;
    height: 76px;
    border-bottom: 1px solid $l-color-bgcolor-11;
    .float-left {
      line-height: 35px;
      margin-right: 20px;
    }
    .right-btn {
      width: 80px;
      height: 36px;
      margin-left: 10px;
      text-align: center;
      padding: 0px;
      border-radius: 2px;
    }
  }
  .table-container {
    padding: 20px;
    padding-top: 0;
    height: calc(100% - 96px);
    .el-col {
      height: 100%;
    }
    .headerCls {
      height: 30px;
      background: #f6f6f6;
      font-size: 14px;
      
      font-weight: 400;
      color: $l-color-fontcolor-3;
      padding: 0;
    }

    .rowStyleCls {
      height: 44px;
      font-size: 14px;
      
      font-weight: 400;
      background: $l-color-bgcolor-18;
      color: $l-color-fontcolor-3;

      > td {
        padding: 0;
      }
    }

    .rowSelected > td {
      background: #fdeee9 !important;
    }

    .druggieType {
      width: 18px;
      line-height: 18px;
      background: #ffffff;
      border-radius: 2px;
      border: 1px solid $l-color-bgcolor-11;
      font-size: 12px;
      
      font-weight: 400;
      color: $l-color-bgcolor-15;
      display: inline-block;
      text-align: center;
      position: absolute;
      top: -7px;
    }

    .cell-text {
      padding-left: 22px;
    }

    .bunchingUp {
      display: inline-block;
      color: $l-color-primary;

      &::after {
        content: "┓";
      }
    }

    .bunchingCenter {
      display: inline-block;
      color: $l-color-primary;

      &::after {
        content: "┫";
      }
    }

    .bunchingDown {
      color: $l-color-primary;
      display: inline-block;

      &::after {
        content: "┛";
      }
    }

    .bunchingSingle {
      color: $l-color-primary;
      display: inline-block;

      &::after {
        content: "】";
      }
    }

    .over {
      font-weight: 400;
      color: $l-color-bgcolor-15;
    }

    .orange {
      color: #db8c04;
    }

    .blue {
      color: #134796;
    }
  }
}
/deep/ .el-date-editor .el-range__close-icon {
  right: 0;
}
.tab-cont {
  height: 100%;
  /deep/ .el-tabs__content {
    height: calc(100% - 55px);
    overflow-y: auto;
  }
}
</style>
