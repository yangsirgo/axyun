<template>
  <div class="height100 advsontent">
    <el-card class="height100">
      <div class="top">
        <div class="float-left" style="width: 200px;border-radius: 2px;display: inline-block">
          <l-formt-title label="用法类型" labelWidth="64">
            <el-select v-model="type" placeholder>
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </l-formt-title>
        </div>

        <el-checkbox-group class="float-left" v-model="timeType" @change="handleTimeTypeChange">
          <el-checkbox
            v-for="(item,index) in timeTypeList"
            :label="item.id"
            :key="index"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>

        <el-button class="float-right right-btn" type="primary" @click="affirm">退药确认</el-button>
      </div>
      <div class="table-container">
        <div class="table-header">
          <span>住院医嘱发药明细</span>
          <el-button class="float-right right-btn" type="primary" plain @click="subdetail()">打印勾选明细</el-button>
        </div>

        <el-checkbox-group class="batchlist float-left" v-model="batchtype" @change="batchChange">
          <el-checkbox v-for="(item,index) in batchlist" :label="item.id" :key="index">{{item.name}}</el-checkbox>
        </el-checkbox-group>

        <div class="table-body" ref="tableBody">
          <el-table
            ref="multipleTable"
            border
            v-loading="listLoading"
            :data="tableData"
            height="250px"
            style="width: 100%;"
            header-cell-class-name="headerCls"
            :row-class-name="rowStyleCls"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="32"></el-table-column>
            <el-table-column
              :key="index"
              v-for="(item, index) in tableColumn"
              :min-width="item.width"
              :fixed="item.fixed"
              :prop="item.keyName"
              :header-align="item.align"
              :align="item.align"
              :label="item.name"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <template v-if="item.type === 'refuseNub'">
                  <el-input-number
                    style="width: 100%"
                    v-model="scope.row[item.keyName]"
                    controls-position="right"
                    :min="1"
                  ></el-input-number>
                </template>
                <template v-else-if="item.type === 'bunching'">
                  <span :class="scope.row.groupNoCls"></span>
                </template>
                <template v-else>
                  <span>{{scope.row[item.keyName]}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="table-header">
          <span>住院医嘱发药汇总</span>
          <el-button class="float-right right-btn" type="primary" plain @click="subcollect()">打印汇总</el-button>
        </div>
        <el-table :data="tableData2" border script style="width: 100%" height="180px">
          <el-table-column label="是否冲抵" min-width="100" align="center">
            <template slot-scope="row">
              <el-checkbox v-model="row.checked" @change="chackChange(row.checked,row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="durgName" label="药品名称" min-width="180"></el-table-column>
          <el-table-column prop="spec" label="规格" min-width="180"></el-table-column>
          <el-table-column prop="price" label="售价" min-width="60"></el-table-column>
          <el-table-column prop="returnNub" label="退药数量" min-width="80"></el-table-column>
          <el-table-column prop="refuseNub" label="拒绝数量" min-width="80"></el-table-column>
          <el-table-column prop="applyNub" label="申请数量" min-width="80"></el-table-column>
          <el-table-column prop="unit" label="单位" min-width="90"></el-table-column>
          <el-table-column prop="drugkeshi" label="科室药房保留数量" min-width="180"></el-table-column>
          <el-table-column prop="durgreturnb" label="实际退药数量" min-width="180"></el-table-column>
        </el-table>
        <div class="totlenub">
          总金额：
          <span>{{totlenub}}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "advDispensing",
  props: ["selectId"],
  data() {
    return {
      maxHeight: "", // table 最大高度
      listLoading: false,
      type: "", // 用法类型
      typeList: [
        // 用法类型列表
        {
          label: "1111",
          value: "111"
        },
        {
          label: "2222",
          value: "222"
        }
      ],
      timeType: ["0", "1", "2"], // 医嘱类型
      timeTypeList: [
        // 医嘱类型列表
        { id: "0", name: "长期医嘱" },
        { id: "1", name: "临时医嘱" },
        { id: "2", name: "出院带药" }
      ],
      batchtype: [],
      batchlist: [
        { id: "1", name: "第一批次" },
        { id: "2", name: "第二批次" },
        { id: "3", name: "第三批次" },
        { id: "4", name: "第四批次" },
        { id: "5", name: "第五批次" }
      ],

      tableData: [
        {
          checked: false,
          bedNo: "1",
          patienName: "姓名",
          batch: "1",
          durgName: "0.9%葡萄糖",
          durgid: "1",
          groupNoCls: "", //成组样式
          groupNo: "1",
          spec: "",
          unit: "", //单位
          returnNub: "1", //退药数量
          refuseNub: "1", //拒绝数量
          applyNub: "1", //申请数量
          remarks: "备注",
          applytime: "", //申请时间
          applyPersonName: "", //申请人
          returnCause: "", //退药原因
          frequency: "",
          price: "13.8",
          durgNnb: "1",
          drugkeshi: "2", //科室药房保留数量
          durgreturnb: "1", //实际退药数量
          prescriptionTime: ""
        },
        {
          checked: false,
          bedNo: "1",
          patienName: "姓名",
          batch: "1",
          durgName: "安神补脑片",
          durgid: "2",
          groupNoCls: "", //成组样式
          groupNo: "1",
          spec: "",
          unit: "", //单位
          returnNub: "1",
          refuseNub: "1",
          applyNub: "1",
          remarks: "备注",
          applytime: "", //申请时间
          applyPersonName: "", //申请人
          returnCause: "", //退药原因
          frequency: "",
          price: "13.8",
          durgNnb: "1",
          drugkeshi: "2", //科室药房保留数量
          durgreturnb: "1", //实际退药数量
          prescriptionTime: ""
        },
        {
          checked: false,
          bedNo: "1",
          patienName: "姓名",
          batch: "1",
          durgName: "三磷酸胞苷二钠注射液",
          durgid: "3",
          groupNoCls: "", //成组样式
          groupNo: "1", //组号
          spec: "",
          unit: "", //单位
          returnNub: "1",
          refuseNub: "1",
          applyNub: "1",
          remarks: "备注",
          applytime: "", //申请时间
          applyPersonName: "", //申请人
          returnCause: "", //退药原因
          frequency: "",
          price: "13.8",
          durgNnb: "1",
          drugkeshi: "2", //科室药房保留数量
          durgreturnb: "1", //实际退药数量
          prescriptionTime: ""
        },
        {
          checked: false,
          bedNo: "2",
          patienName: "姓名2",
          batch: "2",
          durgName: "999",
          durgid: "4",
          groupNoCls: "", //成组样式
          spec: "",
          unit: "", //单位
          returnNub: "1",
          refuseNub: "1",
          applyNub: "1",
          remarks: "备注",
          applytime: "", //申请时间
          applyPersonName: "", //申请人
          returnCause: "", //退药原因
          frequency: "",
          price: "13.8",
          durgNnb: "1",
          drugkeshi: "2", //科室药房保留数量
          durgreturnb: "1", //实际退药数量
          prescriptionTime: ""
        },
        {
          checked: false,
          bedNo: "2",
          patienName: "姓名2",
          batch: "2",
          durgName: "0.9%葡萄糖",
          durgid: "1",
          price: "13.8",
          spec: "",
          unit: "", //单位
          returnNub: "1",
          refuseNub: "1",
          applyNub: "1",
          remarks: "备注",
          applytime: "", //申请时间
          applyPersonName: "", //申请人
          returnCause: "", //退药原因
          frequency: "",
          durgNnb: "1",
          drugkeshi: "2", //科室药房保留数量
          durgreturnb: "1", //实际退药数量
          prescriptionTime: ""
        },
        {
          checked: false,
          bedNo: "3",
          patienName: "姓名3",
          batch: "2",
          durgName: "三磷酸胞苷二钠注射液",
          durgid: "3",
          groupNoCls: "", //成组样式
          groupNo: "3",
          spec: "",
          unit: "", //单位
          returnNub: "1",
          refuseNub: "1",
          applyNub: "1",
          remarks: "备注",
          applytime: "", //申请时间
          applyPersonName: "", //申请人
          returnCause: "", //退药原因
          frequency: "",
          price: "13.8",
          durgNnb: "1",
          drugkeshi: "2", //科室药房保留数量
          durgreturnb: "1", //实际退药数量
          prescriptionTime: ""
        },
        {
          checked: false,
          bedNo: "3",
          patienName: "姓名3",
          batch: "3",
          durgName: "999",
          durgid: "4",
          groupNoCls: "", //成组样式
          spec: "",
          unit: "", //单位
          returnNub: "1",
          refuseNub: "1",
          applyNub: "1",
          remarks: "备注",
          applytime: "", //申请时间
          applyPersonName: "", //申请人
          returnCause: "", //退药原因
          frequency: "",
          price: "13.8",
          durgNnb: "1",
          drugkeshi: "2", //科室药房保留数量
          durgreturnb: "1", //实际退药数量
          prescriptionTime: ""
        },
        {
          checked: false,
          bedNo: "3",
          patienName: "姓名2",
          batch: "3",
          durgName: "0.9%葡萄糖",
          durgid: "1",
          spec: "",
          unit: "", //单位
          returnNub: "1",
          refuseNub: "1",
          applyNub: "1",
          remarks: "备注",
          applytime: "", //申请时间
          applyPersonName: "", //申请人
          returnCause: "", //退药原因
          frequency: "",
          price: "13.8",
          durgNnb: "1",
          drugkeshi: "2", //科室药房保留数量
          durgreturnb: "1", //实际退药数量
          prescriptionTime: ""
        },
        {
          checked: false,
          bedNo: "3",
          patienName: "姓名3",
          batch: "3",
          durgName: "三磷酸胞苷二钠注射液",
          durgid: "3",
          groupNoCls: "", //成组样式
          groupNo: "2",
          spec: "",
          unit: "", //单位
          returnNub: "1",
          refuseNub: "1",
          applyNub: "1",
          remarks: "备注",
          applytime: "", //申请时间
          applyPersonName: "", //申请人
          returnCause: "", //退药原因
          frequency: "",
          price: "13.8",
          durgNnb: "1",
          drugkeshi: "2", //科室药房保留数量
          durgreturnb: "1", //实际退药数量
          prescriptionTime: ""
        }
      ],
      groupNoList: [],
      selectlist2: [], //选中改变table
      tableColumn: [
        // table 配置表头
        {
          keyName: "bedNo",
          name: "床号",
          fixed: true,
          width: 90,
          align: "center"
        },
        {
          keyName: "patienName",
          name: "患者姓名",
          align: "center",
          fixed: true
        },
        {
          keyName: "durgName",
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
          keyName: "unit",
          name: "单位",
          width: 90
        },
        {
          keyName: "returnNub",
          name: "退药数量",
          width: 90
        },
        {
          keyName: "refuseNub",
          name: "拒绝数量",
          type: "refuseNub",
          width: 120
        },
        {
          keyName: "applyNub",
          name: "申请数量",
          width: 90
        },
        {
          keyName: "remarks",
          name: "备注",
          width: 120
        },
        {
          keyName: "applytime",
          name: "申请时间",
          width: 100
        },
        {
          keyName: "applyPersonName",
          name: "申请人",
          width: 90
        },
        {
          keyName: "returnCause",
          name: "退药原因",
          width: 90
        }
      ],

      //表二
      tableData2: [],
      totlenub: "" //总金额
    };
  },
  methods: {
    //中间
    handleTimeTypeChange(val) {
      // 选择医嘱类型
      console.log(val);
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

    handleSelectionChange(val) {
      this.selectlist2 = val;
      this.merge();
      this.moren();
    },

    moren() {
      let batchtype2 = [];
      this.selectlist2.forEach((item, index) => {
        batchtype2.push(item.batch);
      });
      let newArr = []; //新数组
      for (let i = 0; i < batchtype2.length; i++) {
        let flag = true;
        for (let j = 0; j < newArr.length; j++) {
          if (batchtype2[i] == newArr[j]) {
            flag = false;
          }
        }
        if (flag) {
          newArr.push(batchtype2[i]);
        }
        this.batchtype = newArr;
      }
    },

    //去重合并
    merge() {
      let selectnew = JSON.parse(JSON.stringify(this.selectlist2));
      var newArr2 = [];
      selectnew.map(item => {
        var dataItem = item;
        if (newArr2.length > 0) {
          var filterValue = newArr2.filter(v => {
            return v.durgid == dataItem.durgid;
          });
          if (filterValue.length > 0) {
            newArr2.forEach(n => {
              if (n.durgid == filterValue[0].durgid) {
                n.returnNub =
                  parseInt(filterValue[0].returnNub) +
                  parseInt(dataItem.returnNub);
                n.refuseNub =
                  parseInt(filterValue[0].refuseNub) +
                  parseInt(dataItem.refuseNub);
                n.durgreturnb =
                  parseInt(filterValue[0].durgreturnb) +
                  parseInt(dataItem.durgreturnb);
                n.applyNub =
                  parseInt(filterValue[0].applyNub) +
                  parseInt(dataItem.applyNub);
              }
            });
          } else {
            newArr2.push(dataItem);
          }
        } else {
          newArr2.push(dataItem);
        }
      });
      this.tableData2 = newArr2;
      this.calculate();
    },

    //手动勾选
    batchChange(val) {
      let _this = this;
      _this.batchtype = val;
      this.$refs.multipleTable.clearSelection();
      _this.batchtype.forEach(item => {
        let batchids = item;
        _this.tableData.forEach((i, index) => {
          if (i.batch == batchids) {
            this.$refs.multipleTable.toggleRowSelection(_this.tableData[index]);
          }
        });
      });
    },

    //是否冲抵
    chackChange(val, row) {
      let chacked = val;
      let chacklist = row.row;
      if (chacked == false) {
        chacklist.durgreturnb = chacklist.applyNub;
        chacklist.drugkeshi = chacklist.applyNub;
      } else if (chacked == true) {
        chacklist.drugkeshi =
          Number(chacklist.drugkeshi) + Number(chacklist.durgreturnb);
        chacklist.durgreturnb = 0;
      }
    },
    //求和
    calculate() {
      let sum = 0;
      let _this = this;
      let priceall = []; //新数组
      console.log(_this.tableData2.length);
      if (_this.tableData2.length == 0) {
        this.totlenub = "0";
        return;
      }
      _this.tableData2.forEach((item, i) => {
        let pricelist =
          Number(item.returnNub) * Number(item.price) / Math.pow(10, 0);
        priceall.push(pricelist);
      });
      priceall.forEach(i => {
        sum += Math.round(i * 100) / 100;
        sum = Math.round(sum * 100) / 100;
        this.totlenub = sum;
      });
    },
    //提交方法
    //退药确认
    affirm() {},

    //打印勾选明细
    subdetail() {},
    //打印汇总
    subcollect() {}
  },

  computed: {
    disabled() {
      // 滑动加载组件禁用状态
      return this.loading || this.noMore;
    }
  },
  mounted() {
    this.setBunchingCls();
    this.setDataAddType(); //给数据增加type 属性
  }
};
</script>

<style  lang="scss">
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
    height: calc(100% - 90px);
    text-align: left;
    padding: 0 20px;
    .table-header {
      height: 64px;
      line-height: 64px;
      & > span {
        color: $l-color-fontcolor-3;
        font-weight: $l-font-weight;
        font-size: $l-font-size-max;
      }
      .right-btn {
        width: 124px;
        height: 36px;
        border: 1px solid $l-color-primary;
        border-radius: 2px;
        color: $l-color-primary;
        margin-top: 14px;
      }
    }
    .table-body {
      /*height: calc(100% - 46px);*/
      height: 280px;

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
  .totlenub {
    width: 100%;
    text-align: right;
    line-height: 40px;
    background: $l-color-bgcolor-18;
    border: 1px solid $l-color-bgcolor-11;
    border-top: 0;
    span {
      display: inline-block;
      margin-right: 20px;
      color: #db8c04;
      font-size: 16px;
    }
  }
  .batchlist {
    margin-bottom: 10px;
  }
}
</style>
