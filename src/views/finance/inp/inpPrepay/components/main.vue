<template>
  <div class="height100 padding16" style="display:flex;flex-direction:column;">
    <div class="buttonArea">
      <div>
        <!-- <el-button type="text" style="padding:0;margin-right:8px;" :disabled="!this.currentPrepayPO.prepayId||this.currentPrepayPO.recordStatus!=='1'||!this.currentPrepayPO.receiptNum" @click="getPrintReceiptInfo" class="pointer">
          <span class="iconfont icondayin">
            <span style="margin-left:4px;">原票打印</span>
          </span>
        </el-button>
        <el-button type="text" style="padding:0;margin-right:8px;" :disabled="!this.currentPrepayPO.prepayId||this.currentPrepayPO.recordStatus!=='1'||!this.nextReceiptNumOutPO.receiptNum||this.currentPrepayPO.receiptNum" @click="printReceipt" class="pointer">
          <span class="iconfont icondayin">
            <span style="margin-left:4px;">新票打印</span>
          </span>
        </el-button> -->
        <el-button type="text" style="padding:0;margin-right:8px;" @click="pay" class="pointer">
          <span class="iconfont iconmenzhenshoufei">
            <span style="margin-left:4px;">家床预交</span>
          </span>
        </el-button>
        <el-button type="text" style="padding:0;margin-right:8px;" @click="Return" class="pointer">
          <span class="iconfont icontuiyujiaojin">
            <span style="margin-left:4px;">家床退款</span>
          </span>
        </el-button>
      </div>
      <!-- <div>
        <span
          style="font-size:16px;margin-right:32px;"
        >下一张票号：<span v-loading="btuLoading">{{nextReceiptNumOutPO.receiptNum || '无'}}</span></span>
        <el-button type="primary" @click="getNextReceiptNum">刷新</el-button>
        <el-button @click="jumpNum">跳号</el-button>
      </div> -->
    </div>
    <el-table
      :data="tableData"
      width="100%"
      stripe
      border
      v-loading="loading"
      :element-loading-text="$t('retreat.loadInfo')"
      highlight-current-row
      @row-click="rowClick"
    >
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableParams"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'left'"
        :header-align="item.headerAlign || 'left'"
        :fixed="item.fixed"
      >
        <template slot-scope="scope">
          <template v-if="item.prop == 'operate'">
            <el-button
              type="text"
              @click="repealPrepay(scope.row)"
              :disabled="scope.row['recordStatus'] != '1'||scope.row['prepayMoney']<0"
            >撤销</el-button>
          </template>
          <template v-else-if="item.prop == 'arrivalAccountStatus'">
            <span v-if="scope.row[item.prop] == '0'">未到账</span>
            <span v-if="scope.row[item.prop] == '1'">已到账</span>
          </template>
          <template v-else-if="item.prop == 'recordStatus'">
            <span v-if="scope.row[item.prop] == '1'">普通</span>
            <span v-if="scope.row[item.prop] == '2'">已退</span>
            <span v-if="scope.row[item.prop] == '9'">退费</span>
          </template>
          <template v-else-if="item.prop == 'prepayMoney'">
            <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
            <span v-if="!scope.row[item.prop]">0.00</span>
          </template>
          <template v-else>
            <span class="overflow-point">{{ scope.row[item.prop] }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page margin-top-16"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageParams.pageNo"
      :page-sizes="[20, 40, 60, 100,300,500,1000,3000,5000,10000]"
      :page-size="pageParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageParams.total"
    ></el-pagination>
    <inHosPrePayDialog
      :visible.sync="modelVisible"
      v-if="modelVisible"
      width="552px"
      title="家床预交"
      :patientInfo="sendData"
      :nextReceiptNumOutPO = "nextReceiptNumOutPO"
      @jumpNum = "jumpNum"
      @getNextReceiptNum = "getNextReceiptNum"
      @confirm="conserve"
      @cancel="huidanClose"
    ></inHosPrePayDialog>
    <inHosPreReturnDialog
      :visible.sync="modelVisibleReturn"
      v-if="modelVisibleReturn"
      width="60%"
      title="家床退款"
      :patientInfo="sendData"
      :nextReceiptNumOutPO = "nextReceiptNumOutPO"
      @jumpNum = "jumpNum"
      @getNextReceiptNum = "getNextReceiptNum"
      @confirm="conserveReturn"
      @cancel="huidanCloseReturn"
    ></inHosPreReturnDialog>
  </div>
</template>
<script>
import service from "@/api/financeManagement/inp.js";
import printService from "@/api/cis/receiptPrint/receiptPrint";
import inHosPrePayDialog from "./inHosPrePayDialog.vue";
import inHosPreReturnDialog from "./inHosPreReturnDialog.vue";
import { print, preview, onPreview, getMacLoaction } from "@/utils/print";
import serviceReceiptPrint from "@/api/cis/receiptPrint/receiptPrint";

export default {
  components: {
    inHosPrePayDialog,
    inHosPreReturnDialog
  },
  props: {
    sendData: {
      type: Object,
      default:()=>{
        return {}
      }
    },
  },
  watch: {
    sendData: {
      handler(value) {
        this.getPrepayDetail();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      btuLoading:false,
      currentPrepayPO:{},//当前选中行
      tableData: [],
      tableParams: [
        {
          prop: "operate",
          label: "操作",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        // {
        //   prop: "receiptNum",
        //   label: "票据号",
        //   align: "left",
        //   headerAlign: "center",
        //   width: "150",
        // },
        {
          prop: "prepayTime",
          label: "预缴时间",
          align: "left",
          headerAlign: "center",
          width: "160",
        },
        {
          prop: "payTypeName",
          label: "充值方式",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "prepayMoney",
          label: "预缴金额",
          align: "right",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "arrivalAccountStatus",
          label: "到账状态",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          width: "90",
        },
        {
          prop: "thirdPartyPrepayName",
          label: "代办人",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "thirdPartyPrepayIdNum",
          label: "代办人身份证",
          align: "left",
          headerAlign: "center",
          width: "120",
        },
        {
          prop: "prepayUserName",
          label: "操作者",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "prepayTime",
          label: "操作时间",
          align: "left",
          headerAlign: "center",
          width: "160",
        },
        {
          prop: "depositBank",
          label: "开户银行",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "companyName",
          label: "单位名称",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "bankAccount",
          label: "银行账号",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "checkNum",
          label: "票号",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "remark",
          label: "备注",
          align: "left",
          headerAlign: "center",
          width: "150",
        },
      ],
      loading: false,
      modelVisible: false,
      modelVisibleReturn: false,
      // 下一张票据号
      nextReceiptNumOutPO: {},
      // 本机主MAC地址
      currentMac: "",
      // 分页
      pageParams: {
        pageNo: 0,
        pageSize: 20,
        total: 0,
      },
      receiptType:'',
    };
  },
  async mounted() {
    this.getPrepayDetail();
    await this.getDictionaryPO();
    // this.getNextReceiptNum();
  },
  methods: {
    async getDictionaryPO() {
        try {
          let res = await serviceReceiptPrint.getDictionaryPO({
            itemCode:'F0016',
            valueCode:'01'
          });
          if(res.code == 1){
            this.receiptType = res.data.dictionaryValue;
          }
        }catch(error){
          this.$message.error(error.msg || '获取票据类型失败');
        }
      },
    // 获取下一张票据号
    async getNextReceiptNum() {
      try {
        this.nextReceiptNumOutPO = {};
        this.btuLoading= true;
        if (!this.currentMac) {
          let mac = { value: "" };
          getMacLoaction(mac).then(async (res2) => {
            this.currentMac = res2;
            let res = await printService.getNextReceiptNum({
              receiptType: this.receiptType, // 住院预缴款
              useMacLoaction: this.currentMac || undefined,
            });
            if (!res.data) {
              this.btuLoading = false;
              this.$message("未找到当前登录人的领用票据信息");
              return;
            }
            this.btuLoading = false;
            this.nextReceiptNumOutPO = res.data;
          }).catch(()=>{
            this.btuLoading = false;
          });
        } else {
          let res = await printService.getNextReceiptNum({
            receiptType: this.receiptType, // 住院预缴款
            useMacLoaction: this.currentMac || undefined,
          });
          if (!res.data) {
            this.btuLoading = false;
            this.$message("未找到当前登录人的领用票据信息");
            return;
          }
          this.btuLoading = false;
          this.nextReceiptNumOutPO = res.data;
        }
      } catch (error) {
        this.btuLoading = false;
        console.info(error);
        this.$message.error(error.msg || "获取下一张票据号失败");
      }
    },
    // 跳号
    async jumpNum() {
      try {
        this.btuLoading = true;
        let obj = {
          outId: this.nextReceiptNumOutPO.outId,
          receiptStartNum: this.nextReceiptNumOutPO.nextReceiptNum,
          receiptStopNum: this.nextReceiptNumOutPO.nextReceiptNum + 1,
        };
        let res = await printService.receiptJumpNum(obj);
        this.getNextReceiptNum();
        this.btuLoading = false;
        if (res.code == "1") {
          this.$message({ type: "success", message: "跳号成功" });
        } else {
          this.$message.error(error.msg || "跳号失败");
        }
      } catch (error) {
        this.btuLoading = false;
        console.info(error);
        this.$message.error(error.msg || "跳号失败");
      }
    },
    // 票据打印
    async printReceipt() {
      try {
        // if (!this.currentPrepayPO.prepayId) {
        //   this.$message.error("请选择要打印的预缴明细");
        //   return;
        // }
        if (!this.nextReceiptNumOutPO.receiptNum) {
          this.$message.error("当前票据号为空");
          return;
        }
        if(this.currentPrepayPO.receiptNum){
          this.$message.error("当前数据已打印，请选择原票打印");
          return
        }
        // let list = [];
        // list.push(this.currentPrepayPO.prepayId);
        this.$showLoading();
        // let obj = {
        //   receiptNum: this.nextReceiptNumOutPO.nextReceiptNum,
        //   outId: this.nextReceiptNumOutPO.outId,
        //   inId: this.nextReceiptNumOutPO.intId,
        //   outpTradeDetailIds: list
        // };
        // let res = await printService.printReceipt(obj);
        // this.$message({ message: "票据数据保存成功", type: "success" });
        // this.getNextReceiptNum();
        // this.select();
        let obj = {
          prepayId:this.currentPrepayPO.prepayId,
          receiptNum:this.nextReceiptNumOutPO.nextReceiptNum,
          outId: this.nextReceiptNumOutPO.outId,
        }

        console.log(this.currentPrepayPO);
        console.log(this.nextReceiptNumOutPO)
        let res = await printService.prepayReceiptPrint(obj);
        this.getPrepayDetail();
        this.getNextReceiptNum();
        // 打印机。。
        // let res = {
        //   data: {
        //     receiptNum: this.nextReceiptNumOutPO.receiptNum,
        //     patientName: this.sendData.patientName,
        //   },
        // };
        onPreview({
          ...res.data,
          patientName: this.sendData.patientName
        }, "住院预缴小票");
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "打印票据失败");
      }
    },
    // 点击明细
    rowClick(row) {
      this.currentPrepayPO = { ...row };
    },

    // 原票重打
    async getPrintReceiptInfo() {
      try {
        if(!this.currentPrepayPO.prepayId){
           this.$message.error("请选择要打印的预缴明细");
          return ;
        }
        if(!this.currentPrepayPO.receiptNum){
          this.$message.error("当前数据尚未打印，请选择新票打印");
          return ;
        }
        this.$showLoading();
        // let res = await service.getPrintReceiptInfo(this.currentReceiptDetail);
        let res = await printService.getPrepayReceiptDetail({
          prepayId:this.currentPrepayPO.prepayId,
        });
        this.getPrepayDetail();
        // let res = {
        //   data: {
        //     receiptNum: this.nextReceiptNumOutPO.receiptNum,
        //     patientName: this.sendData.patientName,
        //   },
        // };
        // 打印机
        onPreview({
          ...res.data,
          patientName: this.sendData.patientName
        }, "住院预缴小票");
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "打印票据失败");
      }
    },
    // 撤销
    async repealPrepay(row) {
      try {
        this.$showLoading();
        let res = await service.repealPrepay({
          prepayId: row.prepayId,
          channelCode:'00'
        });
        if (res.code == "1") {
          this.$root.$emit("PatientListHospitalRefresh");
          this.$message({ type: "success", message: "撤销成功" });
        }
        this.getPrepayDetail();
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "预缴金撤销失败");
      }
    },
    // 查询预缴金充值明细
    async getPrepayDetail() {
      try {
        if (!this.sendData.inpCode) {
          this.tableData = [];
          return;
        }
        // 清空当前选中行
        this.currentPrepayPO = {};
        this.loading = true;

        let obj = {
          inpCode: this.sendData.inpCode,
          ...this.pageParams,
        };

        let res = await service.getPrepayDetailtInfo(obj);
        this.tableData = res.data;
        this.pageParams.total = res.total;
        this.totalPrepay = 0;
        this.tableData.forEach((val) => {
          if (val.recordStatus == "1" && val.arrivalAccountStatus == "1") {
            this.totalPrepay = this.totalPrepay + val.prepayMoney;
          }
        });
        this.loading = false;
      } catch (error) {
        console.info(error);
        this.loading = false;
        this.$message.error(error.msg || "获取预缴金充值明细失败");
      }
    },
    //充值
    pay() {
      if(this.sendData && this.sendData.finAdId){
        this.modelVisible = true;
      }else{
        this.$message.error("请选择患者")
      }
    },
    conserve() {
      this.modelVisible = false;
      this.$emit("fallBack",this.sendData);
      // this.$root.$emit("PatientListHospitalRefresh");
      this.getPrepayDetail();
      this.$nextTick(function(){
        if(this.getPrepayDetail()){
          // this.printReceipt();
          // this.jumpNum();
        }
      })
    },
    huidanClose() {
      this.modelVisible = false;
    },
    //退款
    Return() {
      if(this.sendData && this.sendData.finAdId){
        this.modelVisibleReturn = true;
      }else{
        this.$message.error("请选择患者")
      }

    },
    conserveReturn() {
      this.modelVisibleReturn = false;
      this.$emit("fallBack",this.sendData);
      // this.$root.$emit('PatientListHospitalRefresh');
      this.getPrepayDetail();
    },
    huidanCloseReturn() {
      this.modelVisibleReturn = false;
    },

    // 千位分隔
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getPrepayDetail();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getPrepayDetail();
    },
  },
};
</script>
<style lang="scss" scoped>
.buttonArea {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.iconfont {
}
.pointer {
  cursor: pointer;
}
/deep/ .el-table__body-wrapper {
  height: calc(100% - 30px);
  overflow: auto;
}
/deep/ .gutter{
  width:10px!important;
  display: block!important;
}
</style>
