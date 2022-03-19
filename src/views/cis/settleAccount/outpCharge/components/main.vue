<template>
  <div class="width100 height100" ref="page">
    <div class="outpcharge-main width100 height-button-main">
      <el-checkbox-group v-model="checkList">
        <div class="charge-item" v-for="(item, index) in tableData" :key="index">
          <div class="charge-top">
            <el-row>
              <el-col :span="6">
                <el-checkbox :label="index">{{ item.orderName }}</el-checkbox>
              </el-col>
              <el-col :span="6">
                {{ orderSourceShow[item.orderSource] || '' }}
                <span
                  v-if="orderSourceShow[item.orderSource]"
                >{{item.orderBillNum}}</span>
              </el-col>
              <el-col :span="4">收费数量：{{ item.orderQuantity }}项</el-col>
              <el-col :span="4">总金额：{{ formatNumber(item.totalAmt) }}元</el-col>
            </el-row>
          </div>
          <el-table :data="item.outpWaitingSettleChargeItemVOS" border style="width: 100%">
            <el-table-column
              prop="chargeItemName"
              label="项目名称"
              header-align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="spec"
              label="规格"
              show-overflow-tooltip
              header-align="center"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="chargePrice"
              label="单价"
              header-align="center"
              show-overflow-tooltip
              align="right"
              width="100"
            >
              <template slot-scope="scope">{{ formatNumber(scope.row.chargePrice) }}</template>
            </el-table-column>
            <el-table-column
              prop="chargeQuantity"
              label="收费数量"
              header-align="center"
              align="right"
              show-overflow-tooltip
              width="100"
            >
              <template slot-scope="scope">
                <template v-if="item.prop == 'chargeUnit'">
                  <span v-if="!isChinese(scope.row[item.prop])" :val="scope.row.chargeUnitId" code="DrugUnit" v-codeTransform></span>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalAmt"
              label="总金额"
              header-align="center"
              align="right"
              show-overflow-tooltip
              width="100"
            >
              <template slot-scope="scope">{{ formatNumber(scope.row.totalAmt) }}</template>
            </el-table-column>
            <el-table-column
              prop="address"
              show-overflow-tooltip
              label="备注"
              header-align="center"
              width="100"
            ></el-table-column>
          </el-table>
        </div>
      </el-checkbox-group>
    </div>
    <div class="charge-bottom height-button-bottom">
      <div class="price-amt float-left">金额合计：{{ formatNumber(priceAmtTotal) }}元</div>
      <el-button type="primary" v-hotKey="{ func: 'func_submit' }" @click="openSubmitCharge">收费</el-button>
    </div>
    <!-- 预结算弹窗 -->
    <el-dialog
      title="收费"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="700px"
      :before-close="close"
    >
      <l-charge :charge="newLchrage" :isApptointment="false" @close="close"></l-charge>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import service from "@/api/appointment/outpCharge";
import appointment from "@/api/appointment/appointment";
import { blukToOutfit } from "@/utils/drugManagement";

// 重写date 格式化方法
// eslint-disable-next-line no-extend-native
Date.prototype.toLocaleString = function() {
  return (
    this.getFullYear() +
    "-" +
    (this.getMonth() + 1) +
    "-" +
    this.getDate() +
    " " +
    this.getHours() +
    ":" +
    this.getMinutes() +
    ":" +
    this.getSeconds() +
    ""
  );
};

export default {
  props: {
    sendData: {
      type: Object
    }
  },
  data() {
    return {
      // 医嘱来源返显
      orderSourceShow: {
        "1": "处方号：",
        "4": "电子申请单号："
      },
      // 余票
      remainAmount: 32,
      // 预结算弹窗
      dialogVisible: false,
      // 充值组件
      showRecharge: false,
      chargeBtnDisable: true,
      // 账户余额
      balanceMoney: 0,
      // 日期时间数组
      dateTime: [],
      // 卡号
      cardNum: "0000444555",
      // 收费信息
      chargeInfo: {},
      // 患者信息
      patientInfo: {},
      // 就诊信息
      outpInfo: {},
      // tableData
      tableData: [],
      checkList: [],
      // 待收费
      toChargeParams: [
        {
          label: "姓名",
          prop: "patientName",
          width: "100",
          align: "left",
          fixed: "left"
        },
        {
          label: "科室",
          prop: "ouptDeptId",
          width: "120",
          align: "left"
        },
        {
          label: "时间",
          prop: "appointmentTime",
          width: "180",
          align: "left"
        }
      ],
      toChargeList: [],
      // 预结算数据
      charge: {
        // 支付方式
        payType: "3",
        // 实收
        realGet: 0,
        // 找零
        backMoney: 0,
        chargeObj: {},
        // 提示数据
        warning: ""
      },
      // 患者充值相关数据
      info: {},
      // 选中收费明细集合
      oneList: [],
      twoList: [],
      threeList: [],
      // 患者账户数据
      accountInfo: {},
      // 处方 分组
      OrderIndexArr: [],
      // 医技 分组
      doctorOrderIndexArr: [],
      newLchrage: {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      }
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    priceAmtTotal() {
      let price = 0;
      this.tableData.forEach((item, index) => {
        if (this.checkList.includes(index)) {
          price += item.totalAmt;
        }
      });
      return price;
    }
  },
  watch: {
    charge(val) {
      this.charge = val;
    },
    receivePatientData: {
      handler(value) {
        value.patientId && this.getChargeInfo(value.patientId);
        this.outpInfo = value;
      },
      deep: true,
      immediate: true
    },
    sendData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.checkList = [];
        if (val.outpWaitingSettleOrderVOS) {
          this.tableData = val.outpWaitingSettleOrderVOS;
        } else {
          this.tableData = [];
        }
      }
    }
  },
  methods: {
    // 金额格式化，千位分割，小数点2位
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    getRowsIdxOne(row) {
      this.oneList = [];
      row.forEach(item => {
        // 表格中分组的第一条数据
        let recipeData = this.tableData.find(
          obj => obj.recipeCode == item.recipeCode
        );
        // 选中集合中 是否存在 分组的第一条数据
        let first = row.find(obj => obj.id == recipeData.id);
        if (first) {
          this.oneList.push(item);
        }
      });
    },
    getRowsIdxTwo(row) {
      this.twoList = [];
      row.forEach(item => {
        // 表格中分组的第一条数据
        let recipeData = this.doctorTableData.find(
          obj => obj.recipeId == item.recipeId
        );
        // 选中集合中 是否存在 分组的第一条数据
        let first = row.find(obj => obj.id == recipeData.id);
        if (first) {
          this.twoList.push(item);
        }
      });
    },
    getRowsIdxThree(rows) {
      this.threeList = rows;
    },
    // 是否是成对的记录，也就是合并在一起的记录
    isCouple(row1, row2) {
      return (
        row1.transNumber === row2.transNumber &&
        row1.createTime === row2.createTime
      );
    },
    clearOptain() {
      this.$refs.multipleTable.clearSelection();
      this.$refs.twoTable.clearSelection();
      this.$refs.threeTable.clearSelection();
    },
    // 读卡
    async readCard() {
      try {
        this.$showLoading();
        this.getPatientInfo();
        // 查询待收费
        const response = await service.getToCharge({
          patientId: this.patientInfo.patientId
        });
        if (response.data.length < 1) {
          this.$hideLoading();
          this.$message("未找到该患者的待收费信息");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 拿到患者信息 及账户余额
    async getPatientInfo() {
      try {
        this.$showLoading();
        const { data } = await appointment.getPatientInfo({
          cardNum: this.cardNum
        });
        this.patientInfo = { ...data };
        if (data) {
          const accountInfo = await appointment.getAccountInfo(data.patientId);
          this.accountInfo = accountInfo.data;
          this.balanceMoney = accountInfo.data.balanceMoney;
          this.newLchrage.accountInfo = this.accountInfo;
        } else {
          this.$hideLoading();
          this.$message("未找到该患者");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取患者信息失败");
      }
    },
    isChinese(temp) {
      var re = /[\d]+/;
      if (re.test(temp)) return false;
      return true;
    },
    // 拿到患者就诊信息 及待收费数据
    async getChargeInfo(patientId) {
      this.$showLoading();
      // 拿到患者档案 及账户余额
      const patient = await service.getPatientInfoById(patientId);
      if (patient.data) {
        this.patientInfo = patient.data;
        const accountInfo = await appointment.getAccountInfo(patientId);
        this.accountInfo = accountInfo.data;
        this.balanceMoney = accountInfo.data.balanceMoney;
        this.info = {
          ...patient.data,
          ...accountInfo.data
        };
      }
      this.$hideLoading();
    },
    // 待收费明细分类
    groupByOrderType(list) {
      let tableData = [];
      let doctorTableData = [];
      let otherTableData = [];
      list.forEach(item => {
        if (item.orderItemCat < 5) {
          let unitInfo = blukToOutfit(item.quantity, item.packQuantity);
          this.$set(item, "bigUnitNum", unitInfo.out); // bigUnitNum  大单位数量
          this.$set(item, "minUnitNum", unitInfo.bl); // minUnitNum  小单位数量
          tableData.push(item);
        } else if (3 < item.orderItemCat && item.orderItemCat <= 10) {
          this.$set(item, "bigUnitNum", item.quantity);
          doctorTableData.push(item);
        } else {
          this.$set(item, "bigUnitNum", item.quantity);
          otherTableData.push(item);
        }
      });
      this.tableData = tableData;
      this.doctorTableData = doctorTableData;
      this.otherTableData = otherTableData;
      this.getOrderNumber(); // 处方分组
      this.getDoctorOrderNumber(); // 医技分组
    },
    // 打开预结算弹窗
    async openSubmitCharge() {
      if (this.checkList.length === 0) {
        this.$message("请选择收费项目");
        return;
      }
      // 筛选选中的收费明细
      const list = this.tableData
        .filter((item, index) => this.checkList.includes(index))
        .map(item => ({
          ...item,
          outpChargeDetailVO2s: item.outpWaitingSettleChargeItemVOS
        }));
      this.newLchrage.chargePrescriptions = list;
      this.newLchrage.appointment = this.sendData;
      this.dialogVisible = true;
    },
    // 弹窗提示
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
          this.charge = {
            // 支付方式
            payType: "3",
            // 实收
            realGet: 0,
            // 找零
            backMoney: 0,
            chargeObj: {},
            // 提示数据
            warning: ""
          };
        })
        .catch(_ => {});
    },
    // 打开充值弹窗
    openRecharge() {
      this.showRecharge = true;
    },
    // 确认充值
    async submitRecharge() {
      try {
        this.$showLoading();
        const { data } = await appointment.prestore(this.info);
        // 刷新余额
        const accountInfo = await appointment.getAccountInfo(
          this.patientInfo.patientId
        );
        this.balanceMoney = accountInfo.data.balanceMoney;
        this.showRecharge = false;
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "充值失败");
      }
    },
    // 重置数据
    resetAll() {
      this.tableData = [];
      this.doctorTableData = [];
      this.otherTableData = [];
      // this.patientInfo = {};
      // this.outpInfo = {};
      this.balanceMoney = 0;
    },
    // 获取相同编号的数组 处方
    getOrderNumber() {
      let OrderObj = {};
      this.tableData.forEach((element, index) => {
        element.rowIndex = index;
        if (OrderObj[element.recipeCode]) {
          OrderObj[element.recipeCode].push(index);
        } else {
          OrderObj[element.recipeCode] = [];
          OrderObj[element.recipeCode].push(index);
        }
      });
      this.OrderIndexArr = [];
      // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
      for (let k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.OrderIndexArr.push(OrderObj[k]);
        }
      }
    },
    // 获取相同编号的数组 医技
    getDoctorOrderNumber() {
      let OrderObj = {};
      this.doctorTableData.forEach((element, index) => {
        element.rowIndex = index;
        if (OrderObj[element.recipeId]) {
          OrderObj[element.recipeId].push(index);
        } else {
          OrderObj[element.recipeId] = [];
          OrderObj[element.recipeId].push(index);
        }
      });
      this.doctorOrderIndexArr = [];
      // 将数组长度大于1的值 存储到this.doctorOrderIndexArr（也就是需要合并的项）
      for (let k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.doctorOrderIndexArr.push(OrderObj[k]);
        }
      }
    },
    // 合并单元格 处方
    // eslint-disable-next-line consistent-return
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        for (let i = 0; i < this.OrderIndexArr.length; i++) {
          let element = this.OrderIndexArr[i];
          for (let j = 0; j < element.length; j++) {
            let item = element[j];
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                };
              } else if (j != 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }
          }
        }
      }
    },
    // 合并单元格 医技
    // eslint-disable-next-line consistent-return
    doctorObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        for (let i = 0; i < this.doctorOrderIndexArr.length; i++) {
          let element = this.doctorOrderIndexArr[i];
          for (let j = 0; j < element.length; j++) {
            let item = element[j];
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                };
              } else if (j != 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }
          }
        }
      }
    },
    // 处理选中的和拿到所有的收费明细
    getAllchargeD(rows) {
      let list = [...rows];
      let allList = this.tableData.concat(this.doctorTableData);
      allList.forEach(item => {
        rows.forEach(val => {
          if (item.orderItemCat < 5) {
            if (val.recipeCode == item.recipeCode && rows.indexOf(item) < 0) {
              list.push(item);
            }
          } else if (3 < item.orderItemCat && item.orderItemCat <= 10) {
            if (val.recipeId == item.recipeId && rows.indexOf(item) < 0) {
              list.push(item);
            }
          }
        });
      });
      return list;
    },
    close(val) {
      if (val && val.refresh) {
        this.$emit("refresh-left");
      }
      this.dialogVisible = false;
      this.newLchrage = {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.outpcharge-main {
  background: #fff;
  padding: 20px;
}
.special-color {
  color: $l-color-primary;
}
.receipt-text {
  color: $l-color-primary;
}
.receipt-amount {
  font-weight: 700;
}
.table-title {
  margin: 20px 0 10px;
  font-weight: 700;
}
.first-title {
  margin-top: 0px;
}
.charge-bottom {
  padding: 20px;
  text-align: right;
  background: #fff;
  border-top: 1px solid $l-color-border-3;
  border-radius: 0 0 4px 4px;
}
.charge-top {
  line-height: 32px;
  font-size: 14px;
  padding: 5px 10px;
  background-color: $l-color-primary1;
  color: #fff;
  /deep/ .el-checkbox__inner {
    border-color: #fff;
  }
  /deep/ .el-checkbox__label {
    color: #fff;
  }
}
.price-amt {
  text-align: right;
  line-height: 40px;
}
</style>
