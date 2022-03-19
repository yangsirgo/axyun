<template>
  <div class="containers height100 position-relative">
    <div class="right height100 position-relative padding16">
      <div class="height100 position-relative" v-loading="isLoading">
        <div class="overflow-hidden search-box" style="padding-bottom: 0px;">
          <div class="overflow-hidden" style="font-size:0;">
            <l-formt-title label="注射开始时间" style="width: 35%;margin-right: 8px" class="position-relative float-left">
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
            <l-formt-title label="执行人" style="width: 25%;margin-right: 16px">
            <el-select v-model="execId" placeholder="请选择">
              <el-option v-for="(item, index) in findHisStoryDoctorList"
               :key="execId"
               :label="item.execName"
               :value="item.execId"
              ></el-option>
            </el-select>
            </l-formt-title>
            <!-- <l-formt-title label="患者姓名" style="width: 25%;margin-right: 5px">
              <el-input v-model="patientName"></el-input>
            </l-formt-title> -->
            <el-button type="primary" @click="search" style="vertical-align: 10px">查 询</el-button>
            <el-button @click="reset" style="vertical-align: 10px">重 置</el-button>
          </div>
        </div>
        <div class="right" style="margin-top:16px;height:calc(100% - 35px)">
          <div style="height:calc(100% - 10px)">
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
                  <div v-else-if="item.prop === 'groupNo'">
                    <span :class="scope.row[item.prop]"></span>
                  </div>
                  <!--频次-->
                  <div v-else-if="item.prop === 'frequency'" :val="scope.row.frequency" code="Frequency"
                       v-codeTransform></div>
                  <!--计量和单位-->
                  <div v-else-if="item.prop == 'dosage'">
                    <span>{{scope.row[item.prop]}}</span><span :val="scope.row.dosageUnit" code="DrugDoseUnit" v-codeTransform></span>
                  </div>
                  <!--用药途径-->
                  <div v-else-if="item.prop == 'useWay'">
                    <span :val="scope.row[item.prop]" code="MedicationRouteCode" v-codeTransform></span>
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
  import {findHisStoryList,findHisStoryDoctorList} from "@/api/cis/treatment/infusion";
  import { getUN } from "@/utils/crypto";
import { getUserId, removeToken } from "@/utils/auth";
import Base64 from "@/utils/base64.js";

  export default {
    name: "infusionExecute", // 注射
    data() {
      return {
        execPersonList:[{
          name: getUN(),
          value: Base64.decode(getUserId())
        }],
        execId:'',
        // dateRange: [new Date,new Date], // 时间段
        dateRange: [], // 时间段
        patientName:'',
        findHisStoryDoctorList:[],

        tl_noMore: false, // 没有更多
        tl_isLoading: false, // 加载状态
        isLoading: false,
        categoryCode: ["0"], // 状态 已执行、未执行
        time_type: "1", // 开嘱时间 1 执行时间 2
        execPerson: "",
        execPersonName: "",
        form: {
          droppingSpeed: "",
          startTime: "",
          nurse: ""
        },
        options: [],
        /*
         *  注射执行
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
            // {
            //   prop: "bottle",
            //   label: "瓶",
            //   width: 60,
            //   fixed: false
            // },
            {
              prop: "orderItemName",
              label: "医嘱名称",
              width: 180,
              fixed: false
            },
            {
              prop: "groupNo",
              label: "组",
              width: 60,
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
              width: 120,
              fixed: false
            },
            {
              prop: "frequencyCode",
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
            // {
            //   prop: "dropRate",
            //   label: "滴速",
            //   width: 80,
            //   fixed: false
            // },
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
            // {
            //   prop: "execStartTime",
            //   label: "开始时间",
            //   width: 180,
            //   fixed: false
            // },
            // {
            //   prop: "execEndTime",
            //   label: "结束时间",
            //   width: 180,
            //   fixed: false
            // },
            {
              prop: "execTime",
              label: "执行时间",
              width: 180,
              fixed: false
            },
            {
              prop: "execName",
              label: "执行人",
              width: 120,
              fixed: false
            },
            // {
            //   prop: "updatedAt",
            //   label: "确认时间",
            //   width: 150,
            //   fixed: false
            // },
            // {
            //   prop: "updatedByName",
            //   label: "确认人",
            //   width: 120,
            //   fixed: false
            // },
            {
              prop: "diagnosisTime",
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
              prop: "ouptDeptName",
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
      ...mapGetters("base", ["receivePatientData"])
    },
    watch: {
      receivePatientData: {
        handler(value) {
          console.log("this.receivePatientData---")
          this.loadData();
          this.findHisStoryDoctorListFun();
        },
        deep: true,
        immediate: true
      }
    },
    created() {
      // this.fetchAdviceList();
    },
    methods: {

    findHisStoryDoctorListFun(){
        let params = {
          ...this.getParams(),
          visitCode: this.receivePatientData.visitCode,
          pageNo: 1,
          pageSize: 100,
          execType: "1"
        };
        findHisStoryDoctorList(params).then(res => {
          if (res.code === 1) {
            console.log('==========findHisStoryList===========',res.data)
             this.findHisStoryDoctorList = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
      loadData() {
        console.log("this.receivePatientData---historyInfusion",this.receivePatientData)
        // this.list = [];
        if (!this.receivePatientData.visitCode) {
          return;
        }
        let params = {
          ...this.getParams(),
          visitCode: this.receivePatientData.visitCode,
          pageNo: 1,
          pageSize: 100,
          execType: "1"
          // inpCode
        };
        // this.loading = true;
        // {"pageNo":"","pageSize":"","visitCode":"","orderStatus":"","startDate":"","endDate":""}
        findHisStoryList(params).then(res => {
          if (res.code === 1) {
            console.log('findHisStoryList',res.data)
            res.data.forEach((item, index) => {
              item.patientAge = item.age
            });
            // advData = await this.grouping(res.data);
            // this.stayExecute.data = res.data
            this.stayExecute.data = this.grouping(res.data);
          } else {
            this.$message.error(res.msg);
          }
          // this.loading = false;
        })
        .catch(err => {
          // this.loading = false;
          this.$message.error(err);
        });
        // findExecList
      },
      getParams() {
        let obj = {
          execId: this.execId,
          patientName: this.patientName,
        };
        if (this.dateRange && this.dateRange.length > 1) {
          obj['startDate'] = this.dateRange[0] + " 00:00:00"
          obj['endDate'] = this.dateRange[1] + " 23:59:59"
        }
        return obj;
      },
      search() {
        this.loadData();
      },
      reset() {
        this.execId = ''
        this.patientName = ''
        this.dateRange = ''
        this.loadData();
      },
      // 护士三个执行，特殊成组方法，以recipeId和groupNo都一致才成组
      grouping(list1) {
        // table 数据 成组操作
        // 将list 分组
        let recipeList = [];
        let rlist = [];
        let rfilterList = [];
        let tableList = [];
        recipeList = list1.map(item => {
          // 获取所有组
          return item.recipeId;
        });
        recipeList = Array.from(new Set(recipeList));
        recipeList = recipeList.filter((item, index) => {
          // 数组去undefind
          return item !== undefined && item != "";
        });
        // recipeList:不重复的recipeId数组
        console.log('recipeList',recipeList)
        recipeList.forEach((item, index) => {
          //遍历 成map结构 分组
          rfilterList = list1.filter((sonItem, sonIde) => {
            return item === sonItem.recipeId;
          });
          rlist.push({
            key: item,
            value: rfilterList
          });
        });
        // rlist: 不重复recipeId为维度，同一recipeId的数组集
        rlist.forEach((item, index) => {
          let list = [];
          let groupList = [];
          let filterList = [];


          console.log('item.value',item.value)
          groupList = item.value.map(item => {
            // 获取所有组
            return item.groupNo;
          });

          groupList = Array.from(new Set(groupList));
          groupList = groupList.filter((item, index) => {
            // 数组去undefind
            return item !== undefined && item != "";
          });
          // groupList:不重复的groupNo数组
          console.log('groupList',groupList)

          groupList.forEach((item11, index11) => {
            //遍历 成map结构 分组
            filterList = item.value.filter((sonItem1, sonIde1) => {
              return item11 === sonItem1.groupNo;
            });
            list.push({
              key: item,
              value: filterList
            });
          });
          console.log('list',list)
          list.forEach(item111 => {
            // 将有组item添加class
            let itemList = item111.value;
            if (itemList.length == 1) return;
            itemList.map((sonItem, sonIndex) => {
              if (sonIndex === 0) {
                sonItem.groupNo = "bunchingUp";
              } else if (sonIndex === itemList.length - 1) {
                sonItem.groupNo = "bunchingDown";
              } else {
                sonItem.groupNo = "bunchingCenter";
              }
            });
          });
          console.log('tableList1',tableList)
          list.map(item => {
            // 更改list格式
            item.value.map(val => {
              tableList.push(val);
            });
          });
          console.log('tableList2',tableList)
        });
        list1.map(item => {
          // 补充未成组项
          if (!item.recipeId) {
            tableList.push(item);
          }
        });
        console.log('tableList3',tableList)
        return tableList
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
        // this.fetchAdviceList(this.receivePatientData);
        // }
      },
      timeRangeChange() {
        // this.fetchAdviceList(this.receivePatientData);
      },
      // async fetchAdviceList(obj) {
      //   // 请求输液医嘱列表
      //   // this.tl_isLoading = true;
      //   let status = [];
      //   let params = {};

      //   // let inpCode = this.receivePatientData.inpCode;
      //   status = this.categoryCode.map(item => {
      //     return item.split(",");
      //   });
      //   status = status.join(",").split(",");
      //   status = Array.from(new Set(status));
      //   // if (!inpCode) {
      //   //   this.isLoading = false;
      //   //   this.stayExecute.data = [];
      //   //   this.selectedList = [];
      //   //   return;
      //   // }

      //   params = {
      //     ...this.getParams(),
      //     status,
      //     // inpCode
      //   };
      //   // let {code, data, msg} = await infusionList(params);
      //   // if (code === 1) {
      //   let advData = [];
      //   let data = [{
      //     groupNo: 1,
      //     status: '未拆分',
      //     orderDate: '2019-02-18',
      //     groupNo: 1,
      //     drugName: "阿斯",
      //     spec: 'g',
      //     id: 1
      //   }, {
      //     groupNo: 1,
      //     status: '未拆分',
      //     orderDate: '2019-02-18',
      //     groupNo: 1,
      //     drugName: "阿斯",
      //     spec: 'g',
      //     id: 2
      //   }, {
      //     groupNo: 1,
      //     status: '未拆分',
      //     orderDate: '2019-02-18',
      //     groupNo: 1,
      //     drugName: "阿斯",
      //     spec: 'g',
      //     id: 3
      //   }, {
      //     groupNo: 1,
      //     status: '未拆分',
      //     orderDate: '2019-02-18',
      //     groupNo: '',
      //     drugName: "阿斯",
      //     spec: 'g',
      //     id: 4
      //   }, {
      //     groupNo: 1,
      //     status: '未拆分',
      //     orderDate: '2019-02-18',
      //     groupNo: '2',
      //     drugName: "阿斯",
      //     spec: 'g',
      //     id: 5
      //   }, {
      //     groupNo: 1,
      //     status: '未拆分',
      //     orderDate: '2019-02-18',
      //     groupNo: '2',
      //     drugName: "阿斯",
      //     spec: 'g',
      //     id: 6
      //   }];
      //   advData = await this.grouping(data);
      //   console.log("advData::::", advData);
      //   this.stayExecute.data = advData;
      //   // this.isLoading = false;
      //   // } else {
      //   //   this.$message.error(msg);
      //   //   this.isLoading = false;
      //   // }
      //   // this.tl_isLoading = false;
      // },
    },
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
