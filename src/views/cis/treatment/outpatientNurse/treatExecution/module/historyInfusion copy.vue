<template>
  <div class="containers height100 position-relative">
    <div class="right height100 position-relative padding10">
      <div class="height100 position-relative" v-loading="isLoading">
        <div class="overflow-hidden search-box padding10" style="padding-bottom: 0px;">
          <div class="overflow-hidden" style="height: 45px;">
            <l-formt-title label="治疗开始时间" style="width: 35%;margin-right: 10px" class="position-relative float-left">
              <el-date-picker
                v-model="dateRange"
                @change="categoryCodeChange"
                type="daterange"
                prefix-icon="null"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </l-formt-title>
            <l-formt-title label="执行人" style="width: 25%;margin-right: 5px">
              <el-select v-model="execPerson" placeholder="请选择">
                <el-option
                  label="本人"
                  value="1"
                ></el-option>
              </el-select>
            </l-formt-title>
            <l-formt-title label="患者姓名" style="width: 25%;margin-right: 5px">
              <el-input v-model="execPersonName"></el-input>
            </l-formt-title>
            <el-button type="primary" @click="search" style="vertical-align: 10px">查 询</el-button>
          </div>
        </div>
        <div class="padding10 right height100" style="padding-top: 0;">
          <div style="margin-top: 5px;height:calc(100% - 70px)">
            <el-table
              height="100%"
              header-cell-class-name="headerCls"
              row-class-name="rowStyleCls"
              ref="singleTable"
              :data="stayExecute.data"
              stripe
              border
              element-loading-text="加载中..."
            >
              <el-table-column
                v-for="item in stayExecute.column"
                :key="item.label"
                :label="item.label"
                :prop="item.prop"
                align="center"
                show-overflow-tooltip
                header-align="center"
                :min-width="item.width"
              >
                <template slot-scope="scope">
                  <div v-if="item.prop === 'No'" class="color2">{{scope.row[item.prop]}}</div>
                  <div v-else-if="item.prop === 'groupNoCls'">
                    <span :class="scope.row[item.prop]"></span>
                  </div>
                  <!--频次-->
                  <div v-else-if="item.prop === 'frequency'" :val="scope.row.frequency" code="Frequency"
                       v-codeTransform></div>
                  <!--用药途径-->
                  <div v-else-if="item.keyName == 'useWay'">
                    <span :val="scope.row[item.keyName]" code="MedicationRouteCode" v-codeTransform></span>
                  </div>
                  <div v-else>{{scope.row[item.prop]}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {executeAdvice, infusionList} from "@/api/ipnw/nursing";
  import {onPreview, onPrint} from "@/utils/print";

  export default {
    name: "infusionExecute", // 治疗
    data() {
      return {
        tl_noMore: false, // 没有更多
        tl_isLoading: false, // 加载状态
        isLoading: false,
        categoryCode: ["0"], // 状态 已执行、未执行
        time_type: "1", // 开嘱时间 1 执行时间 2
        dateRange: [], // 时间段
        execPerson: "",
        execPersonName: "",
        form: {
          droppingSpeed: "",
          startTime: "",
          nurse: ""
        },
        options: [],
        /*
         *  治疗执行
         */
        statusArr: {
          0: "未执行",
          1: "执行完成"
        },
        stayExecute: {
          // 待执行数据
          column: [
            {
              prop: "patientName",
              label: "患者姓名",
              width: 80,
              fixed: false
            },
            {
              prop: "basicDosage",
              label: "瓶",
              width: 60,
              fixed: false
            },
            {
              prop: "groupNoCls",
              label: "组",
              width: 60,
              fixed: false
            },
            {
              prop: "name",
              label: "医嘱名称",
              width: 180,
              fixed: false
            },
            {
              prop: "spec",
              label: "规格",
              width: 100,
              fixed: false
            },
            {
              prop: "dosage",
              label: "剂量",
              width: 60,
              fixed: false
            },
            {
              prop: "frequency",
              label: "频次",
              width: 120,
              fixed: false
            },
            {
              prop: "useWay",
              label: "用药途径",
              width: 120,
              fixed: false
            },
            {
              prop: "dropRate",
              label: "滴速",
              width: 80,
              fixed: false
            },
            {
              prop: "useDay",
              label: "用药天数",
              width: 80,
              fixed: false
            },
            {
              prop: "remark",
              label: "备注",
              width: 180,
              fixed: false
            },
            {
              prop: "startTime",
              label: "开始时间",
              width: 180,
              fixed: false
            },
            {
              prop: "endTime",
              label: "结束时间",
              width: 180,
              fixed: false
            },
            {
              prop: "executeName",
              label: "执行人",
              width: 120,
              fixed: false
            },
            {
              prop: "adviceTime",
              label: "确认时间",
              width: 150,
              fixed: false
            },
            {
              prop: "confirmPerson",
              label: "确认人",
              width: 120,
              fixed: false
            },
            {
              prop: "executeTime",
              label: "开单日期",
              width: 150,
              fixed: false
            },
            {
              prop: "doctorName",
              label: "开嘱医生",
              width: 80,
              fixed: false
            },
            {
              prop: "deptCode",
              label: "开嘱科室",
              width: 80,
              fixed: false
            }
          ],
          data: []
        },
        selectedList: []
      };
    },
    computed: {
      ...mapGetters("cis", ["receivePatientData"])
    },
    created() {
      this.fetchAdviceList();
    },
    methods: {
      search() {
        this.fetchAdviceList();
      },
      getParams() {
        let obj = {
          execPerson: this.execPerson,
          execPersonName: this.execPersonName,
        };
        if (this.dateRange && this.dateRange.length > 1) {
          obj['sDate'] = this.dateRange[0] + " 00:00:00"
          obj['eDate'] = this.dateRange[1] + " 23:59:59"
        }
        return obj;
      },
      categoryCodeChange(val) {
        // 状态 改变
        // if (this.searchForm.categoryCode.length > 1) {
        //   this.searchForm.categoryCode.shift();// 多选改单选功能
        console.log(this.receivePatientData, "this.receivePatientData");
        console.log(this.dateRange, "this.datarange");
        console.log(this.time_type, "this.time-type");
        this.receivePatientData.time_type = this.time_type;
        this.receivePatientData.categoryCode = this.categoryCode;
        this.receivePatientData.start = "";
        this.receivePatientData.end = "";
        console.log(this.receivePatientData, "this.receivePatientData")
        this.fetchAdviceList(this.receivePatientData);
        // }
      },
      timeRangeChange() {
        this.fetchAdviceList(this.receivePatientData);
      },
      grouping(list1) {
        // table 数据 成组操作
        // 将list 分组
        return new Promise((resolve, reject) => {
          let list = [];
          let groupList = [];
          let filterList = [];
          let tableList = [];
          groupList = list1.map(item => {
            // 获取所有组
            return item.groupNo;
          });

          groupList = Array.from(new Set(groupList));
          groupList = groupList.filter((item, index) => {
            // 数组去undefind
            return item !== undefined && item != "";
          });

          groupList.forEach((item, index) => {
            //遍历 成map结构 分组
            // list = [];
            filterList = list1.filter((sonItem, sonIde) => {
              return item === sonItem.groupNo;
            });
            list.push({
              key: item,
              value: filterList
            });
          });
          list.forEach(item => {
            // 将有组item添加class
            let itemList = item.value;
            if (itemList.length == 1) {return;}
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
          list.map(item => {
            // 更改list格式
            item.value.map(val => {
              tableList.push(val);
            });
          });
          list1.map(item => {
            // 补充未成组项
            if (!item.groupNo) {
              tableList.push(item);
            }
          });
          resolve(tableList);
        });
      },
      async fetchAdviceList(obj) {
        // 请求治疗医嘱列表
        this.tl_isLoading = true;
        let status = [];
        let params = {};

        // let inpCode = this.receivePatientData.inpCode;
        status = this.categoryCode.map(item => {
          return item.split(",");
        });
        status = status.join(",").split(",");
        status = Array.from(new Set(status));
        // if (!inpCode) {
        //   this.isLoading = false;
        //   this.stayExecute.data = [];
        //   this.selectedList = [];
        //   return;
        // }

        params = {
          ...this.getParams(),
          status,
          // inpCode
        };
        // let {code, data, msg} = await infusionList(params);
        // if (code === 1) {
        let advData = [];
        let data = [{
          // groupNo: 1,
          status: '未拆分',
          orderDate: '2019-02-18',
          groupNo: 1,
          drugName: "阿斯",
          spec: 'g',
          id: 1
        }, {
          // groupNo: 1,
          status: '未拆分',
          orderDate: '2019-02-18',
          groupNo: 1,
          drugName: "阿斯",
          spec: 'g',
          id: 2
        }, {
          // groupNo: 1,
          status: '未拆分',
          orderDate: '2019-02-18',
          groupNo: 1,
          drugName: "阿斯",
          spec: 'g',
          id: 3
        }, {
          // groupNo: 1,
          status: '未拆分',
          orderDate: '2019-02-18',
          groupNo: '',
          drugName: "阿斯",
          spec: 'g',
          id: 4
        }, {
          // groupNo: 1,
          status: '未拆分',
          orderDate: '2019-02-18',
          groupNo: '2',
          drugName: "阿斯",
          spec: 'g',
          id: 5
        }, {
          // groupNo: 1,
          status: '未拆分',
          orderDate: '2019-02-18',
          groupNo: '2',
          drugName: "阿斯",
          spec: 'g',
          id: 6
        }];
        advData = await this.grouping(data);
        console.log("advData::::", advData);
        this.stayExecute.data = advData;
        this.isLoading = false;
        // } else {
        //   this.$message.error(msg);
        //   this.isLoading = false;
        // }
        // this.tl_isLoading = false;
      },
    },
    watch: {
      receivePatientData: {
        //深度监听，可监听到对象、数组的变化
        handler(val) {
          this.fetchAdviceList(val);
        },
        deep: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  .color1 {
    color: $l-color-primary1;
  }

  .color2 {
    color: $l-color-fontcolor-2;
  }

  .color6 {
    color: $l-color-border-6;
  }

  /deep/ .el-tabs__nav {
    margin-left: 0 !important;
  }

  /deep/ .right th .el-checkbox {
    display: none;
  }

  .containers {
    overflow: hidden;

    .aside-hidden-btn {
      position: absolute;
      top: calc(50% - 40px);
      line-height: 80px;
      text-align: center;
      z-index: 1000;
      border: 1px solid $l-color-bgcolor-11;
      border-radius: 2px;

      i {
        transition: transform 0.5s;
      }
    }

    .left {
      float: left;
      height: 100%;
      overflow: hidden;
      /*transition: all 0.3s;*/
    }

    .right {
      /deep/ .el-input-number.is-controls-right .el-input__inner {
        padding: 0 20px 0 0;
      }

      /deep/ .el-input-number--medium .el-input-number__increase,
      /deep/ .el-input-number--medium .el-input-number__decrease {
        width: 20px;
      }

      .btn {
        position: absolute;
        right: 20px;
        bottom: 20px;
      }
    }
  }

  .normal {
    border-color: $l-color-primary;
    color: $l-color-primary;
    border-radius: 2px;
  }

  .msg_header {
    line-height: 66px;
    height: 66px;
    background-color: $l-color-bgcolor-14;
    margin-bottom: 10px;
    border-radius: 4px;
    overflow: hidden;

    .person {
      text-align: left;
      min-width: 60px;

      & > span {
        display: inline-block;
        vertical-align: middle;
      }

      .person_num {
        
        font-size: 36px;
        color: $l-color-border-6;
        min-width: 54px;
        text-align: center;
        background-color: #fef6e8;
        display: inline-block;
      }

      .person_number {
        font-size: 18px;
        color: $l-color-fontcolor-2;
        padding: 0 20px;
        display: inline-block;
      }

      .pad20 {
        padding: 0 20px;
      }
    }

    .nav-gap-wrap {
      height: inherit;
    }

    .nav-gap {
      position: relative;
      width: 1px;
      height: inherit;
      padding: 0 20px;

      &:before {
        content: "";
        position: absolute;
        top: calc(50% - 8px);
        width: 1px;
        height: 16px;
        background: #ebebeb;
      }
    }

    .docter {
      /*height: 60px;*/
      /*line-height: 60px;*/
      margin-right: 20px;

      .docter_box {
        height: 100%;
        border-left: 1px solid #c5cbcf;
        padding-left: 20px;
        font-size: 12px;

        .box_item {
          line-height: 20px;
        }
      }
    }
  }

  .main-box {
    height: calc(100% - 120px);
  }

  .bunchingUp {
    display: inline-block;
    color: $l-color-primary1;

    &::after {
      content: "┓";
    }
  }

  .bunchingCenter {
    display: inline-block;
    color: $l-color-primary1;

    &::after {
      content: "┫";
    }
  }

  .bunchingDown {
    color: $l-color-primary1;
    display: inline-block;

    &::after {
      content: "┛";
    }
  }
</style>
