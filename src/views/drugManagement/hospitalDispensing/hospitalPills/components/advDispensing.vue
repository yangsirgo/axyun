<template>
  <div class="height100 advsontent">
    <el-card class="height100">
      <div class="top">
        <div class="float-left" style="width: 200px;border-radius: 2px;display: inline-block">
          <l-formt-title label="用法">
            <l-value-domain
              code="MedicationRouteCode"
              remoteValueKey="code"
              remoteShowKey="name"
              :value.sync="medicationCode"
              placeholder="请选择"
              @change="search"
            ></l-value-domain>
          </l-formt-title>
        </div>

        <el-checkbox-group class="float-left" v-model="orderType" @change="orderTypeChange">
          <el-checkbox
            v-for="(item,index) in orderTypeList"
            :label="item.id"
            :key="index"
            @change="search"
          >{{item.name}}</el-checkbox>
        </el-checkbox-group>

        <el-button class="float-right right-btn" type="primary" @click="delivery">发药确认</el-button>
        <el-button class="float-right right-btn" type="primary" @click="dispense">配方确认</el-button>
      </div>
      <div class="table-container">
        <div class="table-header">
          <span>住院医嘱发药明细</span>
          <el-button class="float-right right-btn" type="primary" plain @click="printDetail">打印勾选明细</el-button>
        </div>

        <el-checkbox-group class="batchlist float-left" v-model="batchType" @change="batchChange">
          <el-checkbox
            v-for="(item,index) in batchList"
            :label="item.value"
            :key="index"
          >{{item.label}}</el-checkbox>
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
            highlight-current-row
            :row-class-name="rowStyleCls"
            @selection-change="handleSelectionChange"
            @current-change="handleCurrentChange"
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
                <template v-if="item.keyName === 'price'">
                  <span>{{ formatNum(scope.row.price) }}</span>
                </template>
                <template v-else-if="item.keyName === 'packageUnit'">
                  <span :val="scope.row.packageUnit" code="DrugUnit" v-codeTransform></span>
                </template>
                <template v-else-if="item.keyName === 'frequencyCode'">
                  <span
                    columns="FREQUENCY_NAME"
                    :conditionMap="{ FREQUENCY_CODE: scope.row.frequencyCode }"
                    tableName="hrp_frequency"
                    v-tableTransform
                  ></span>
                </template>
                <template v-else-if="item.keyName === 'drugQuantity'">
                  <span>{{scope.row.outfit}}</span>
                  <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
                  <template v-if="scope.row.bluk !== 0">
                    {{scope.row.bluk}}
                    <span
                      :val="scope.row.packageUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
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
          <el-button class="float-right right-btn" type="primary" plain @click="printSum">打印汇总</el-button>
        </div>
        <el-table :data="sumTableData" border script style="width: 100%" height="210px">
          <!--          <el-table-column label="是否冲抵" min-width="100" align="center">
            <template slot-scope="row">
              <el-checkbox v-model="row.checked" @change="chackChange(row.checked,row)"></el-checkbox>
            </template>
          </el-table-column>-->
          <el-table-column prop="drugName" label="药品名称" min-width="180"></el-table-column>
          <el-table-column prop="spec" label="规格" min-width="180"></el-table-column>
          <el-table-column prop="price" label="售价(元)" align="right" width="120">
            <template slot-scope="scope">
              <span>{{ formatNum(scope.row.price) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="drugQuantity" label="数量" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.sjOut}}</span>
              <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
              <template v-if="scope.row.sjBl !== 0">
                {{scope.row.sjBl}}
                <span
                  :val="scope.row.packageUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="packageUnit" label="单位" min-width="90">
            <template slot-scope="scope">
              <span :val="scope.row.packageUnit" code="DrugUnit" v-codeTransform></span>
            </template>
          </el-table-column>-->
          <!--
          <el-table-column prop="deptStock" label="科室药房可用库存" min-width="180"></el-table-column>
          -->
          <el-table-column prop="drugQuantity" label="实际发药数量" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.sjOut}}</span>
              <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
              <template v-if="scope.row.sjBl !== 0">
                {{scope.row.sjBl}}
                <span
                  :val="scope.row.packageUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="drugStock" label="当前药房存储量" min-width="180">
            <template slot-scope="scope">
              <span>{{scope.row.kcOut}}</span>
              <span :val="scope.row.drugUnit" code="DrugUnit" v-codeTransform></span>
              <template v-if="scope.row.kcBl !== 0">
                {{scope.row.kcBl}}
                <span
                  :val="scope.row.packageUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
            </template>
          </el-table-column>
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
import ipha from "@/api/hmm/ipha";
import { print, preview, onPreview } from "@/utils/print";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";
import { mapActions } from "vuex";

export default {
  name: "advDispensing",
  props: ["selectId", "wardList"],
  data() {
    return {
      maxHeight: "", // table 最大高度
      listLoading: false,
      id: "",
      medicationCode: "", // 用法类型
      orderType: ["1", "2", "3"], // 医嘱类型
      orderTypeList: [
        // 医嘱类型列表
        { id: "1", name: "长期医嘱" },
        { id: "2", name: "临时医嘱" },
        { id: "3", name: "出院带药" }
      ],
      batchType: [],
      batchList: [],
      tableData: [],
      groupNoList: [],
      selectlist2: [], //选中改变table
      tableColumn: [
        // table 配置表头
        {
          keyName: "bedNum",
          name: "床号",
          fixed: true,
          width: 60,
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
          width: 50
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
          width: 30,
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
          width: 60
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
          width: 60
        }, */
        {
          keyName: "setExeTime",
          name: "医嘱执行时间",
          width: 120
        }
      ],

      //表二
      sumTableData: [],
      totlenub: "" //总金额
    };
  },

  computed: {
    disabled() {
      // 滑动加载组件禁用状态
      return this.loading || this.noMore;
    }
  },
  watch: {
    selectId(newdata) {
      this.search();
      this.listForDropDown();
      this.setBunchingCls();
      this.setDataAddType(); //给数据增加type 属性
    },
    selectlist2(val) {
      let list = val.map(item => item.id);
      this.changeOrderList(list);
    }
  },
  methods: {
    ...mapActions({
      changeOrderList: "drugManagement/changeOrderList",
      changeCurDrug: "drugManagement/changeDrug"
    }),
    handleCurrentChange(val) {
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
    async listForDropDown() {
      let { data } = await ipha.getDeliveryBatch();
      this.batchList = data;
    },
    async search() {
      try {
        this.listLoading = true;
        let param = {
          wardId: this.selectId,
          orderType: this.orderType,
          medicationCode: this.medicationCode,
          status: 0,
          ...this.pagination
        };
        let response = await ipha.list(param);
        let { data } = response;
        let list = data.map(item => {
          let { out, bl } = blukToOutfit(item.drugQuantity, item.packQuantity);
          return {
            ...item,
            outfit: out,
            bluk: bl
          };
        });
        this.tableData = list;
        this.id = "";
        this.listLoading = false;
      } catch (error) {
        this.listLoading = false;
      }
    },
    // 选择医嘱类型
    orderTypeChange(val) {
      this.orderType = val;
      this.search();
    },

    setDataAddType() {
      let me = this;
      this.tableData.forEach((item, index) => {
        // item.type = '';
        me.$set(this.tableData[index], "type", "");
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
      let batchtype2 = [];
      this.selectlist2.forEach((item, index) => {
        batchtype2.push(item.deliveryBatchNum);
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
      }
      this.batchType = newArr;
    },

    //去重合并
    merge() {
      let selectnew = JSON.parse(JSON.stringify(this.selectlist2));
      // let selectnew = Object.assign([], this.selectlist2);
      var newArr2 = [];
      selectnew.map(item => {
        var dataItem = item;
        if (newArr2.length > 0) {
          var filterValue = newArr2.filter(v => {
            return v.drugId == dataItem.drugId;
          });
          if (filterValue.length > 0) {
            newArr2.forEach(n => {
              if (n.drugId == filterValue[0].drugId) {
                n.drugQuantity =
                  filterValue[0].drugQuantity + dataItem.drugQuantity;
                // n.durgNnb2L =
                //   parseInt(filterValue[0].durgNnb2L) +
                //   parseInt(dataItem.durgNnb2L);
              }
            });
          } else {
            newArr2.push(dataItem);
          }
        } else {
          newArr2.push(dataItem);
        }
      });
      let list = newArr2.map(item => {
        let sjnum = blukToOutfit(item.drugQuantity, item.packQuantity);
        let kcnum = blukToOutfit(item.drugStock, item.packQuantity);
        return {
          ...item,
          sjOut: sjnum.out,
          sjBl: sjnum.bl,
          kcOut: kcnum.out,
          kcBl: kcnum.bl
        };
      });
      this.sumTableData = list;
      this.calculate();
    },

    //手动勾选
    batchChange(val) {
      this.batchtype = val;
      this.$refs.multipleTable.clearSelection();
      this.batchtype.forEach(item => {
        let batchids = item;
        this.tableData.forEach((i, index) => {
          if (i.deliveryBatchNum == batchids) {
            this.$refs.multipleTable.toggleRowSelection(this.tableData[index]);
          }
        });
      });
    },

    //是否冲抵
    chackChange(val, row) {
      let chacked = val;
      let chacklist = row.row;
      if (chacked == false) {
        chacklist.drugQuantity = chacklist.durgNnb;
      } else if (chacked == true) {
        chacklist.drugQuantity = chacklist.durgNnb - chacklist.drugStock;
      }
    },
    //求和
    calculate() {
      let sum = 0;
      let _this = this;
      let priceall = []; //新数组
      if (_this.sumTableData.length == 0) {
        this.totlenub = "0";
        return;
      }
      _this.sumTableData.forEach((item, i) => {
        let pricelist =
          Number(item.drugQuantity) * Number(item.price) / Math.pow(10, 0);
        priceall.push(pricelist);
      });
      priceall.forEach(i => {
        sum += Math.round(i * 100) / 100;
        sum = Math.round(sum * 100) / 100;
        this.totlenub = sum;
      });
    },
    //发药确认
    async delivery() {
      try {
        this.$showLoading();
        if (!this.id) {
          this.$hideLoading();
          return;
        }
        let { data } = await ipha.delivery(this.id);
        this.$message.success(data);
        this.search();
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    //配方确认
    async dispense() {
      try {
        this.$showLoading();
        let { data } = await ipha.dispense(this.selectlist2);
        this.id = data;
        this.tableData = this.selectlist2;
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
      data.detailList = this.selectlist2;
      onPreview(data, "住院药房汇总单");
    },
    //打印汇总
    printSum() {
      let data = {};
      data.title = "药品汇总单";
      data.detailList = this.sumTableData;
      onPreview(data, "住院药房汇总单");
    }
  },
  mounted() {
    this.search();
    this.listForDropDown();
    this.setBunchingCls();
    this.setDataAddType(); //给数据增加type 属性
  },
  beforeDestroy() {
    // 销毁时清空数据
    this.changeCurDrug("");
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
    overflow-y: auto;
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
