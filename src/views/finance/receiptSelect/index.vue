<template>
  <el-card class="width100 height100 padding10 receipt-select">
    <el-form class="search-area" :model="form" ref="form">
      <el-row :gutter="10" class="width100">
        <el-col :span="5">
          <!-- <LFormtTitle label="卡号" class="float-left">
            <el-form-item prop="cardData">
              <el-input
                v-model="form.cardData"
                placeholder="卡号"
                class="float-left"
                clearable
              ></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" class="float-left" @click="readCard"
            >读卡</el-button
          > -->
          <l-read-card @readCard="readCard"></l-read-card>
        </el-col>
        <el-col :span="4">
          <LFormtTitle label="患者姓名" class="float-left">
            <el-form-item prop="patientName">
              <el-input
                v-model="form.patientName"
                placeholder="姓名"
                class="float-left"
                clearable
              ></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="5">
          <LFormtTitle label="打印时间" class="float-left">
            <el-date-picker
              width="100%"
              v-model="date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              @change="getDate"
              clearable
            ></el-date-picker>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="结算类型">
            <el-form-item prop="settlementType" class="width100">
              <!-- <l-value-domain
                :value.sync="form.settlementType"
                code="settlementType"
                placeholder="请选择"
                clearable
              />-->
              <el-select
                v-model="form.settlementType"
                placeholder="请选择"
                class="width100"
              >
                <el-option
                  v-for="item in settlementTypeInfo"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="打印人员">
            <el-form-item prop="printUserId">
              <!-- <l-value-domain
            :value.sync="form.printUserId"
            remoteUrl="/wadmin/dept-user/119/2"
            :remoteParams="''"
            remoteShowKey="uname"
            remoteValueKey="uid"
            placeholder="请选择"
            clearable
              />-->
              <el-select
                v-model="form.printUserId"
                filterable
                remote
                reserve-keyword
                placeholder="姓名/拼音/五笔"
                :remote-method="selectAllUser"
                :loading="selLoading"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="4">
          <LFormtTitle label="票据状态">
            <el-form-item prop="recordStatus">
              <el-select
                v-model="form.recordStatus"
                placeholder=""
                class="width100"
                clearable
              >
                <el-option
                  v-for="(item, index) in recordStatusObj"
                  :key="index"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </LFormtTitle>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="width100 margin-top-10">
        <el-col :span="5" style="height: 36px">
          <el-radio-group
            v-model="radio"
            @change="changeRadio"
            class="l-center-vertical"
          >
            <el-radio label="1">根据票段查</el-radio>
            <el-radio label="2">根据票号查</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="4" v-if="radio == '2'">
          <LFormtTitle label="票号" class="float-left">
            <el-form-item prop="receiptNum">
              <el-input
                v-model="form.receiptNum"
                placeholder="票据号"
                class="float-left"
                clearable
              ></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="7" v-if="radio == '1'">
          <LFormtTitle label="起始号段" class="float-left" style="width: 45%">
            <el-form-item prop="receiptStartNum">
              <el-input
                v-model="form.receiptStartNum"
                placeholder="请输入起始号"
                class="float-left"
                clearable
              ></el-input>
            </el-form-item>
          </LFormtTitle>
          <LFormtTitle
            label="终止号段"
            class="float-left margin-left-6"
            style="width: 45%"
          >
            <el-form-item prop="receiptStopNum">
              <el-input
                v-model="form.receiptStopNum"
                placeholder="请输入终止号"
                class="float-left"
                clearable
              ></el-input>
            </el-form-item>
          </LFormtTitle>
        </el-col>
        <el-col :span="12" class="float-right">

          <el-button
            type="primary"
            plain
            class="float-right"
            @click="setOut"
            >导出</el-button
          >
          <!-- <el-button
            type="primary"
            class="float-right margin-right-10"
            @click="getPrintReceiptInfo"
          >白票重打</el-button>
          <el-button
            ref="btuRef"
            type="primary"
            class="float-right margin-right-10"
            :loading="btuLoading"
            @click="newReceiptprint"
          >新票重打</el-button>
          <el-button type="primary" class="float-right" @click="getPrintReceiptInfo">原票重打</el-button> -->
          <el-button type="primary" plain class="float-right margin-right-10" @click="reset"
            >重置</el-button
          >
          <el-button
            type="primary"
            class="float-right margin-right-10"
            @click="select"
            >查询</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <div class="tableHeight" style="margin-top:8px;">
      <el-table
        :data="tableData"
        width="100%"
        height="100%"
        stripe
        border
        v-loading="loading"
        :element-loading-text="$t('retreat.loadInfo')"
        highlight-current-row
        @row-click="rowClick"
        ref="leftTable"
      >
        <el-table-column
          v-for="(item, index) in tableParams"
          :key="index"
          sortable
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <!-- <template v-if="item.prop == 'settlementType'">
            <span :val="scope.row['settlementType']" code="settlementType" v-codeTransform></span>
          </template>-->
            <template v-if="item.prop == 'recordStatus'">
              <!-- <span v-if="scope.row[item.prop] == '1'">已开票</span>
              <span v-if="scope.row[item.prop] == '2'">已退票</span>
              <span v-if="scope.row[item.prop] == '9'">退票</span> -->
              <span v-if="scope.row[item.prop]">{{recordStatusObj[scope.row[item.prop]]}}</span>
              <span v-else></span>
            </template>
            <template v-else-if="item.prop == 'totalMoney'">
              <span v-if="scope.row[item.prop]">{{
                scope.row[item.prop].toFixed(2) || "0.00"
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'selfPayMoney'">
              <span v-if="scope.row[item.prop]">{{
                scope.row[item.prop].toFixed(2) || "0.00"
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'freePayMoney'">
              <span v-if="scope.row[item.prop]">{{
                scope.row[item.prop].toFixed(2) || "0.00"
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'derateAmount'">
              <span v-if="scope.row[item.prop]">{{
                scope.row[item.prop].toFixed(2) || "0.00"
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'couponPay'">
              <span v-if="scope.row[item.prop]">{{
                scope.row[item.prop].toFixed(2) || "0.00"
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'bxMoney'">
              <span v-if="scope.row[item.prop]">{{
                scope.row[item.prop].toFixed(2) || "0.00"
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'prestorePay'">
              <span v-if="scope.row[item.prop]">{{
                scope.row[item.prop].toFixed(2) || "0.00"
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else-if="item.prop == 'ybMoney'">
              <span v-if="scope.row[item.prop]">{{
                scope.row[item.prop].toFixed(2) || "0.00"
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>

      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo"
          :page-sizes="[50, 100, 200]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>
  </el-card>
</template>
<script>
import receiptService from "@/api/systemManagement/receipt/receipt";
import service from "@/api/cis/receiptPrint/receiptPrint";
import { print, preview, onPreview, getMacLoaction } from "@/utils/print";
import { onExcel } from "@/utils/excel/excel";
// 重写date 格式化方法
// eslint-disable-next-line no-extend-native
Date.prototype.toLocaleStr = function() {
  var month = ("0" + (this.getMonth() + 1)).slice(-2); // 如果是1-9月，那么前面补0
  var day = ("0" + this.getDate()).slice(-2);
  return this.getFullYear() + "-" + month + "-" + day;
};
export default {
  name: "fin_receiptSelect",
  data() {
    return {
      loading: false,
      // 表格数据
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "receiptNum",
          label: "票据号",
          align: "left",
          headerAlign: "center",
          width: "120"
        },

        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "settlementTypeName",
          label: "结算类型",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "companyName",
          label: "单位名称",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "recordStatus",
          label: "票据状态",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "printUserName",
          label: "打印人员",
          align: "left",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "printTime",
          label: "打印时间",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        // {
        //   prop: "ybType",
        //   label: "医保类别",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "90"
        // },
        {
          prop: "totalMoney",
          label: "总金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "selfPayMoney",
          label: "自付金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "freePayMoney",
          label: "记账金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "derateAmount",
          label: "减免金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "couponPay",
          label: "优惠券金额",
          align: "right",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "bxMoney",
          label: "报销金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        },
        {
          prop: "ybMoney",
          label: "账户金额",
          align: "right",
          headerAlign: "center",
          width: "90"
        }
      ],
      // 查询表单
      form: {
        cardData: "",
        patientName: "",
        settlementType: "",
        printUserId: "",
        receiptNum: "",
        receiptStartNum: "",
        receiptStopNum: ""
      },
      // 时间
      date: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      // 单选框
      radio: "2",
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 100,
        total: 0
      },
      //当前票据对象
      currentReceiptDetail: {},
      // 人员集合
      options: [
        {
          id: "",
          name: "全部"
        }
      ],
      // 查询用户loading
      selLoading: false,
      // 下一张票据号 出库对象
      nextReceiptNumOutPO: "00000000",
      // btu loading
      btuLoading: false,
      settlementTypeInfo: [
        {
          code: "",
          name: "全部"
        }
      ], //结算类型
      // 本机主MAC地址
      currentMac: "",
      recordStatusObj: {
        "1": "已开票",
        "2": "已退票",
        "9": "退票",
      }
    };
  },
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  mounted() {
    this.select();
    // this.getNextReceiptNum();
    this.settlementType();
    // this.getMac();
    // setTimeout(() => {
    //   this.getNextReceiptNum();
    // }, 1000);
  },
  methods: {
    changeRadio() {
      if (this.radio == "1") {
        this.form.receiptNum = "";
      } else {
        this.form.receiptStartNum = "";
        this.form.receiptStopNum = "";
      }
    },
    // 获取本机主mac地址
    getMac() {
      try {
        let mac = getMacLoaction();
        this.currentMac = mac;
      } catch (error) {
        this.$message.error(error.message || "获取本机主MAC地址失败");
      }
    },
    //查询结算类型列表--下拉框
    async settlementType() {
      try {
        let res = await service.settlementType();
        this.settlementTypeInfo = [
          {
            code: "",
            name: "全部"
          }
        ];
        this.settlementTypeInfo = this.settlementTypeInfo.concat(res.data);
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "获取结算类型列表报错");
      }
    },
    // 查询用户
    async selectAllUser(val) {
      try {
        this.selLoading = true;
        let res = await receiptService.getAllUser({
          userName: val || ""
        });
        let userInfo = [
          {
            id: "",
            name: "全部"
          }
        ];
        this.options = userInfo.concat(res.data);
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    getDate(data) {},
    // 查询票据信息
    async getReceiptInfo(params) {
      try {
        this.loading = true;
        let obj = {
          sDate: "",
          eDate: "",
          ...this.form,
          ...this.pageParams,
          ...params
        };
        if (this.date && this.date.length > 1) {
          obj.sDate = this.date[0];
          obj.eDate = this.date[1];
        }
        let res = await service.getReceiptDetail(obj);
        // this.tableData.push(...res.data);
        this.tableData = res.data;
        this.pageParams.total = res.total;
        this.loading = false;
      } catch (error) {
        console.info(error);
        this.loading = false;
        this.$message.error(error.msg || "查询失败");
      }
    },
    // load
    // load() {
    //   if (this.tlm_noMore) {
    //     return;
    //   }
    //   this.pageParams.pageNo++;
    //   this.getReceiptInfo();
    // },
    // 读卡
    readCard(obj) {
      /* if (!this.from || !this.from.cardData) {
        this.$message.error("请输入卡号");
        return;
      } else {
        this.select();
      } */
      this.select({
        patientCode: obj.patientCode
      });
    },
    // 查询
    async select(params) {
      if (this.radio == "1") {
        if (this.form.receiptStartNum && !this.form.receiptStopNum) {
          this.$message.error("请输入号段终止号");
          return;
        } else if (!this.form.receiptStartNum && this.form.receiptStopNum) {
          this.$message.error("请输入号段起始号");
          return;
        }
      }

      this.tableData = [];
      this.pageParams.pageNo = 1;
      this.getReceiptInfo(params);
      // await this.getNextReceiptNum();
    },
    // 重置
    async reset() {
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
      /* this.date = [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59",
      ]; */
      this.date = [];
      this.select();
      // await this.getNextReceiptNum();
    },
    rowClick(row) {
      this.currentReceiptDetail = row;
    },
    // 获取下一张票据号
    async getNextReceiptNum() {
      try {
        // this.btuLoading = true;
        // let res = await service.getNextReceiptNum({
        //   receiptType: "1",
        //   useMacLoaction: this.currentMac || undefined
        // });
        // if (!res.data) {
        //   this.$message.error("未找到当前登录人的领用票据信息");
        //   return;
        // }
        // this.nextReceiptNumOutPO = res.data;
        // this.btuLoading = false;

        if (!this.currentMac) {
          let mac = { value: "" };
          getMacLoaction(mac).then(async res2 => {
            this.currentMac = res2;
            let res = await service.getNextReceiptNum({
              receiptType: "1",
              useMacLoaction: this.currentMac || undefined
            });
            if (!res.data) {
              this.$message.error("未找到当前登录人的领用票据信息");
              return;
            }
            this.nextReceiptNumOutPO = res.data;
            this.btuLoading = false;
          });
        } else {
          let res = await service.getNextReceiptNum({
            receiptType: "1",
            useMacLoaction: this.currentMac || undefined
          });
          if (!res.data) {
            this.$message.error("未找到当前登录人的领用票据信息");
            return;
          }
          this.nextReceiptNumOutPO = res.data;
          // this.btuLoading = false;
        }
      } catch (error) {
        // this.btuLoading = false;
        console.info(error);
        this.$message.error(error.msg || "获取下一张票据号失败");
      }
    },
    // 原票重打
    async getPrintReceiptInfo() {
      try {
        if (!this.currentReceiptDetail.receiptId) {
          this.$message.error("请选择要打印的票据");
          return;
        }
        this.$showLoading();
        let res = await service.getPrintReceiptInfo(this.currentReceiptDetail);
        // 打印机
        onPreview(res.data, "票据");
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "打印票据失败");
      }
    },
    // 新票重打
    async newReceiptprint() {
      this.$refs.btuRef.disabled = true;
      try {
        if (!this.currentReceiptDetail.receiptId) {
          this.$refs.btuRef.disabled = false;
          this.$message.error("请选择要打印的票据");
          return;
        }
        this.$showLoading();
        // 下一张新的票据号
        let obj = {
          ...this.currentReceiptDetail
        };
        // 下一张新的票据号
        obj.receiptNum = this.nextReceiptNumOutPO.nextReceiptNum;
        obj.outId = this.nextReceiptNumOutPO.outId;
        let res = await service.newPrintReceipt(obj);
        this.$message({ message: "新票据数据保存成功", type: "success" });
        // 打印机
        onPreview(res.data, "票据");
        this.select();
        this.$refs.btuRef.disabled = false;
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$refs.btuRef.disabled = false;
        this.$hideLoading();
        this.$message.error(error.msg || "打印票据失败");
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getReceiptInfo();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getReceiptInfo();
    },
    async setOut() {
      let obj = {
        sDate: "",
        eDate: "",
        exportType: 0,
        ...this.form
      };
      if (this.date && this.date.length > 1) {
        obj.sDate = this.date[0];
        obj.eDate = this.date[1];
      }
      let res = await service.exportChargeExcel(obj);
      var blob = res;
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        var parent = document.getElementsByClassName("receipt-select")[0];

        var a = document.createElement('a');
        a.setAttribute("id","billHref");
        a.download = '票据查询.xls';
        a.href = e.target.result;
        parent.appendChild(a);
        let aDom = document.getElementById("billHref");
        aDom.click();
        parent.removeChild(aDom);
      }
      return;
      if(!this.tableData.length) {
        return;
      }
      let tHeader = this.tableParams.map(item => {
        return item.label;
      });
      let filterVal = this.tableParams.map(item => {
        return item.prop;
      });
      let tableData = [];
      for(let i in this.tableData) {
        let item = this.tableData[i];
        let obj = {
          ...item,
          recordStatus: this.recordStatusObj[item.recordStatus],
          totalMoney: this.setNumber(item.totalMoney),
          selfPayMoney: this.setNumber(item.selfPayMoney),
          freePayMoney: this.setNumber(item.freePayMoney),
          derateAmount: this.setNumber(item.derateAmount),
          couponPay: this.setNumber(item.couponPay),
          bxMoney: this.setNumber(item.bxMoney),
          prestorePay: this.setNumber(item.prestorePay),
          ybMoney: this.setNumber(item.ybMoney)
        }
        tableData.push(obj);
      }
      let excelData = {
        title: "票据",
        tHeader,
        filterVal,
        listDate: tableData
      };
      onExcel(excelData);
    },
    setNumber(num, size) {
      return Number(num || 0).toFixed(size || 2)
    }
  }
};
</script>
<style lang="scss" scoped>
.receipt-select {
  .margin-top-10 {
    margin-top: 10px;
  }
  .tableHeight {
    width: 100%;
    height: calc(100% - 170px);
  }
  .page {
    text-align: right;
    margin-top: 20px;
    .el-pagination {
      padding: 0;
      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
    }
  }
  /deep/.el-table .cell{
   line-height: 40px !important;
   font-size: 16px;
  }
}
</style>
