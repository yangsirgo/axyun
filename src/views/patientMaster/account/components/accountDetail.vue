<template>
  <div class="width100 height100">
    <el-card class="account-cont width100">
      <l-card-title style="padding:8px 0;">
        <span slot="left">账户信息</span>
      </l-card-title>
      <div class="title">
        <!-- <span class="title-cont">
          开户时间
          <i>{{accountDetailInfoData.createdAt ||}</i>
        </span>-->
        <!-- <span class="title-cont">
          账户状态
          <i :val="accountDetailInfoData.recordStatus" code="ACCOUNT_STATUS" v-codeTransform></i>
        </span>-->
        <span class="title-cont">
          账户余额
          <i>{{formatNumber(accountDetailInfoData.balanceMoney)}}元</i>
        </span>
        <span class="title-cont">
          冻结金额
          <i>{{formatNumber(accountDetailInfoData.freezeMoney)}}元</i>
        </span>
        <span class="title-cont">
          绿色通道授权金额
          <i>{{formatNumber(accountDetailInfoData.grantOverdrawMoney)}}元</i>
        </span>
        <span class="title-cont">
          可用金额
          <i>{{formatNumber(accountDetailInfoData.prestoreUseMoney)}}元</i>
        </span>
      </div>
      <div class="tabs">
        <!--        <l-card-title>-->
        <!--          <span slot="left">充退记录</span>-->
        <!--        </l-card-title>-->
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
          style="margin-left: 12px"
          class="tab-pan-h"
        >
          <el-tab-pane label="充退记录" name="first" class="width100 height100">
            <el-date-picker
              style="width:350px;"
              v-model="selectRechargeDate"
              type="datetimerange"
              :default-time="['00:00:00','23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <el-button
              type="primary"
              style="margin-left: 20px;vertical-align: top;"
              icon="el-icon-search"
              @click="doSearch"
            >查询</el-button>
            <div class="table-h">
              <!-- <l-tables
                :pageSize="pageParams.pageSize"
                :page="pageParams.pageNo"
                :total="pageParams.total"
                :paginationSmall="true"
                :background="false"
                layout="prev,pager,next"
                paginationAlign="center"
                @changeSize="handleSizeChange1"
              >
              <template slot="table-body">-->
              <el-table
                ref="tableOne"
                :data="rechargeData"
                width="100%"
                height="100%"
                :stripe="true"
                border
                highlight-current-row
                v-loading="tlm_isLoading"
                :element-loading-text="$t('retreat.loadInfo')"
              >
                <el-table-column
                  v-for="(item,index) in rechargeParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :align="item.align || 'left'"
                  :header-align="item.headerAlign || 'left'"
                >
                  <template slot-scope="accountScope">
                    <template v-if="item.prop == 'businessType'">
                      <span
                        :val="accountScope.row['businessType']"
                        code="PRESTORE_TYPE"
                        v-codeTransform
                      ></span>
                    </template>
                    <!-- <template v-else-if="item.prop == 'payTypeId'">
                      <span :val="accountScope.row['payTypeId']" code="PAY_TYPE" v-codeTransform></span>
                    </template>-->
                    <template
                      v-else-if="item.prop == 'prestoreMoney'||item.prop == 'prestoreBalance'"
                    >
                      <span
                        v-if="accountScope.row[item.prop]"
                      >{{formatNumber(accountScope.row[item.prop])}}</span>
                      <span v-if="!accountScope.row[item.prop]">0.00</span>
                    </template>
                    <template v-else-if="item.prop == 'recordStatus'">
                      <span v-if="accountScope.row[item.prop]=='1'">正常</span>
                      <span v-if="accountScope.row[item.prop]=='2'">撤销</span>
                      <span v-if="accountScope.row[item.prop]=='9'">冲销</span>
                    </template>
                    <template v-else>{{ accountScope.row[item.prop] }}</template>
                  </template>
                </el-table-column>
              </el-table>
              <!-- </template>
              </l-tables>-->

              <div class="page">
                <el-pagination
                  background
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                  :current-page="pageParams1.pageNo"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="pageParams1.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="pageParams1.total"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="消费记录" name="second" class="width100 height100">
            <el-date-picker
              style="width:350px;"
              v-model="selectConsumptionDate"
              type="datetimerange"
              :default-time="['00:00:00','23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <el-button
              type="primary"
              style="margin-left: 20px;vertical-align: top;"
              icon="el-icon-search"
              @click="doSearch"
            >查询</el-button>
            <div class="table-h2">
              <el-table
                ref="table2"
                :data="consumptionData"
                width="100%"
                height="100%"
                :stripe="true"
                border
                highlight-current-row
                v-loading="tlm_isLoading"
                :element-loading-text="$t('retreat.loadInfo')"
              >
                <el-table-column
                  v-for="(item,index) in consumptionParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :align="item.align || 'left'"
                  :header-align="item.headerAlign || 'left'"
                >
                  <template slot-scope="accountScope">
                    <template v-if="item.prop == 'chargeType'">
                      <span v-if="accountScope.row[item.prop] == '1'">挂号</span>
                      <span v-if="accountScope.row[item.prop] == '2'">门诊收费</span>
                      <span v-if="accountScope.row[item.prop] == '3'">体检收费</span>
                      <span v-if="accountScope.row[item.prop] == '4'">授权透支冲账</span>
                    </template>
                    <template v-else-if="item.prop == 'consumeMoney'">
                      <span
                        v-if="accountScope.row[item.prop]"
                      >{{formatNumber(accountScope.row[item.prop])}}</span>
                      <span v-if="!accountScope.row[item.prop]">0.00</span>
                    </template>
                    <template v-else-if="item.prop == 'beforePrestoreBalance'">
                      <span
                        v-if="accountScope.row[item.prop]"
                      >{{formatNumber(accountScope.row[item.prop])}}</span>
                      <span v-if="!accountScope.row[item.prop]">0.00</span>
                    </template>
                    <template v-else-if="item.prop == 'prestoreBalance'">
                      <span
                        v-if="accountScope.row[item.prop]"
                      >{{formatNumber(accountScope.row[item.prop])}}</span>
                      <span v-if="!accountScope.row[item.prop]">0.00</span>
                    </template>
                    <template v-else>{{ accountScope.row[item.prop] }}</template>
                  </template>
                </el-table-column>
              </el-table>
              <div class="page">
                <el-pagination
                  background
                  @size-change="handleSizeChange2"
                  @current-change="handleCurrentChange2"
                  :current-page="pageParams2.pageNo"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="pageParams2.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="pageParams2.total"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="绿色通道申请记录" name="third"></el-tab-pane> -->
        </el-tabs>
        <div class="buttons">
          <el-button type="primary" @click="accountRechargeDisable=true">充值</el-button>
          <el-button @click="freeze" v-if="accountDetailInfoData.recordStatus">
            <span v-if="accountDetailInfoData.recordStatus=='1'">冻结</span>
            <span v-else-if="accountDetailInfoData.recordStatus=='2'">解冻</span>
          </el-button>
          <el-button @click="accountRefundDisable=true">退款</el-button>
        </div>
      </div>
    </el-card>

    <el-dialog
      title="预存账户充值"
      width="674px"
      :visible.sync="accountRechargeDisable"
      :close-on-click-modal="false"
      @close="accountRechargeClose"
    >
      <account-recharge
        v-if="accountRechargeDisable"
        @rechargeConfirm="rechargeConfirm"
        @rechargeCancel="rechargeCancel"
        :accountDetailInfoData="accountDetailInfoData"
        :accountRechargeCloseForm="accountRechargeCloseForm"
      ></account-recharge>
    </el-dialog>

    <el-dialog
      title="预存账户退款"
      width="974px"
      :visible.sync="accountRefundDisable"
      :close-on-click-modal="false"
      @close="accountRefundClose"
    >
      <account-refund
        v-if="accountRefundDisable"
        @refundConfirm="refundConfirm"
        @refundCancel="refundCancel"
        :accountDetailInfoData="accountDetailInfoData"
        :accountRefundCloseForm="accountRefundCloseForm"
      ></account-refund>
    </el-dialog>
  </div>
</template>

<script>
import accountRecharge from "../components/accountRecharge.vue";
import accountRefund from "../components/accountRefund.vue";
import {
  freeze,
  getPrestoreRefundList,
  getAccountInfo,
  prestoreDetail,
} from "@/api/arch/arch.js";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "accountDetail",
  components: {
    accountRecharge,
    accountRefund,
  },
  props: {
    sendData: {
      type: Object,
    },
  },
  data() {
    return {
      activeName: "first",
      /*账户信息*/
      accountDetailInfoData: {
        // balanceMoney: 0,
        // consumeMoney: 0,
        // createdAt: "",
        // createdBy: "",
        // createdByName: "",
        // freezeMoney: 0,
        // patientNum: "",
        // prestoreCode: "",
        // prestoreMoney: 0,
        // prestoreTotal: 0,
        // recordStatus: "",
        // refundPrestoreTotal: 0,
        // updatedAt: "",
        // updatedBy: "",
        // updatedByName: ""
      },
      /*充退记录*/
      rechargeParams: [
        {
          prop: "payTypeName",
          label: "支付方式",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "50",
        },
        {
          prop: "prestoreMoney",
          label: "金额",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "60",
        },
        {
          prop: "prestoreBalance",
          label: "账户余额",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "60",
        },
        {
          prop: "channelName",
          label: "渠道",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "60",
        },
        {
          prop: "recordStatus",
          label: "预存状态",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "60",
        },
        {
          prop: "prestoreUserName",
          label: "预存人员",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "60",
        },
        {
          prop: "prestoreTime",
          label: "预存时间",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "100",
        },
        {
          prop: "agentName",
          label: "代办人姓名",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "60",
        },
        {
          prop: "agentIdentificationNum",
          label: "代办人身份证号",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "60",
        },
        {
          prop: "agentTelNum",
          label: "代办人联系方式",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "60",
        },
        {
          prop: "recordRemark",
          label: "备注",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "60",
        },
      ],
      rechargeData: [],
      rechargeDataUnit: [],
      /*分页信息*/
      pageSize: 15,
      pageNo: 1,
      total: 0,
      tlm_noMore: false,
      tlm_isLoading: false,
      /*弹框标识*/
      accountRechargeDisable: false,
      accountRefundDisable: false,
      /*关闭弹框清空表单*/
      accountRechargeCloseForm: {},
      accountRefundCloseForm: {},
      // 查询充退记录时间集合
      selectRechargeDate: [],
      // 查询消费记录时间集合
      selectConsumptionDate: [],
      // 消费记录select
      consumptionParams: [
        // {
        //   prop: "chargeType",
        //   label: "消费类型",
        //   align: "left",
        //   headerAlign: "left",
        //   fixed: "left",
        //   width: "30"
        // },
        // {  //一次交易会有多个科室的费用
        //   prop: "businessType",
        //   label: "消费科室",
        //   align: "left",
        //   headerAlign: "left",
        //   fixed: "left",
        //   width: "30"
        // },
        {
          prop: "consumeMoney",
          label: "消费金额",
          align: "right",
          headerAlign: "center",
          fixed: "left",
          width: "30",
        },
        // {
        //   prop: "beforePrestoreBalance",
        //   label: "消费前余额",
        //   align: "right",
        //   headerAlign: "center",
        //   fixed: "left",
        //   width: "30"
        // },
        {
          prop: "prestoreBalance",
          label: "余额",
          align: "right",
          headerAlign: "center",
          fixed: "left",
          width: "30",
        },
        {
          prop: "chargeUserName",
          label: "收费人员",
          align: "left",
          headerAlign: "center",
          fixed: "left",
          width: "30",
        },
        {
          prop: "chargeTime",
          label: "收费时间",
          align: "left",
          headerAlign: "center",
          fixed: "left",
          width: "30",
        },
      ],
      consumptionData: [],
      // 消费记录分页数据
      pageParams: {
        pageSize: 15,
        pageNo: 1,
        total: 0,
      },
      pageParams1: {
        pageSize: 20,
        pageNo: 1,
        total: 0,
      },
      pageParams2: {
        pageSize: 20,
        pageNo: 1,
        total: 0,
      },
      pickerOptions: {
        disabledDate(v) {
          return (
            v.getTime() >
            new Date(
              new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            ).getTime()
          );
        },
      },
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    tlm_noMoreTable() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
  },
  watch: {
    sendData: {
      immediate: true,
      deep: true,
      async handler(n) {
        this.clearData();
        if (JSON.stringify(n) !== "{}") {
          this.selectRechargeDate=[];
          this.selectConsumptionDate=[];
          if (n && n.patientId) {
            await this.getAccountDetailInfo();
            if (this.accountDetailInfoData.prestoreCode) {
              await this.doSearch();
            }
            this.rechargeData = this.rechargeDataUnit;
          } else {
            // this.$message("该患者未建档，请开始建档");
            // this.$router.push("/patientMaster/recordCreate");
          }
        }
      },
    },
  },
  methods: {
    /*切换tab*/
    async handleClick() {
      this.doSearch();
    },
    clearData() {
      this.accountDetailInfoData = {};
      this.rechargeData = [];
      this.rechargeDataUnit = [];
      this.pageNo = 1;
      this.total = 0;
    },
    //获取账户信息信息
    async getAccountDetailInfo() {
      this.$showLoading();
      try {
        let data = await getAccountInfo(this.sendData.patientId);
        if (data.code == "1") {
          this.accountDetailInfoData = data.data;
        } else {
          this.$message.error(data.msg || "获取账户信息失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取账户信息失败");
      }
    },
    //获取充退记录列表信息
    // eslint-disable-next-line complexity
    async getRechargeDataList() {
      if (!this.selectRechargeDate) {
        this.$message.error("请选择要查询的日期范围");
        return false;
      }
      if (this.accountDetailInfoData.prestoreCode) {
        this.tlm_isLoading = true;
        try {
          let obj = {
            patientId: this.sendData.patientId,
            prestoreCode: this.accountDetailInfoData.prestoreCode,
            pageNo: this.pageParams1.pageNo,
            pageSize: this.pageParams1.pageSize,
          };

          if (this.selectRechargeDate && this.selectRechargeDate.length > 1) {
            obj.startDate =
              this.selectRechargeDate[0].format("yyyy-MM-dd") + " 00:00:00" ||
              "";
            obj.endDate =
              this.selectRechargeDate[1].format("yyyy-MM-dd") + " 23:59:59" ||
              "";
          }
          let data = await getPrestoreRefundList(obj);

          if (data.code == "1") {
            this.rechargeDataUnit = data.data;
            this.pageParams1.total = data.total;
            // this.rechargeData = [...this.rechargeData.concat(data.data)];
            this.rechargeData = data.data;
          } else {
            this.$message.error(data.msg || "获取充退列表失败");
          }
          // 修复表格错乱
          this.$nextTick(() => {
            this.$refs.tableOne && this.$refs.tableOne.doLayout();
          });
          this.tlm_isLoading = false;
        } catch (error) {
          console.log(error);
          this.tlm_isLoading = false;
          this.$message.error(error.msg || "获取充退列表失败");
        }
      } else {
        this.$message.error("prestoreCode不能为空");
      }
    },
    /*冻结*/
    freeze() {
      if (this.accountDetailInfoData.recordStatus == "1") {
        this.$confirm(
          "账户冻结后，账户余额不能使用，你要冻结吗？",
          "冻结此账户",
          {
            confirmButtonText: "冻结",
            cancelButtonText: "再看看",
            type: "warning",
          }
        ).then(() => {
          this.getFreeze();
        });
      } else if (this.accountDetailInfoData.recordStatus == "2") {
        this.getFreeze();
      }
    },
    // 冻结
    async getFreeze() {
      this.$showLoading();
      try {
        let accountInfo = { ...this.accountDetailInfoData };
        let successInfo = "";
        if (this.accountDetailInfoData.recordStatus == "1") {
          accountInfo.recordStatus = 2;
          successInfo = "冻结";
        } else if (this.accountDetailInfoData.recordStatus == "2") {
          accountInfo.recordStatus = 1;
          successInfo = "解冻";
        }
        let data = await freeze(accountInfo); //传状态，1解冻，2 冻结
        if (data.code == "1") {
          this.$message({
            type: "success",
            message: "账户" + successInfo + "成功",
          });
        } else {
          this.$message.error(data.msg);
        }
        await this.getAccountDetailInfo();
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    //滑动加载更多信息 (充退记录)
    load() {
      const _this = this;
      this.pageNo++;
      setTimeout(async () => {
        let rechargeData = [..._this.rechargeData];
        if (_this.pageNo > _this.totalPage) {
          _this.tlm_noMore = true;
          _this.pageNo = _this.totalPage;
        } else {
          await this.getRechargeDataList();
        }
        _this.tlm_isLoading = false;
      }, 2000);
    },
    // table加载下一页
    loadNextPage() {
      if (this.tlm_noMoreTable) {
        this.tlm_isLoading = false;
        return;
      }
      this.pageParams.pageNo++;
      this.getConsumptionData();
    },
    /*dialog emit*/
    async rechargeConfirm(data) {
      this.accountRechargeDisable = data;
      await this.getAccountDetailInfo();
      this.pageNo = 1;
      this.total = 0;
      await this.getRechargeDataList();
      this.rechargeData = this.rechargeDataUnit;
    },
    rechargeCancel(data) {
      this.accountRechargeDisable = data;
    },
    async refundConfirm(data) {
      this.accountRefundDisable = data;
      await this.getAccountDetailInfo();
      this.pageNo = 1;
      this.total = 0;
      await this.getRechargeDataList();
      this.rechargeData = this.rechargeDataUnit;
    },
    refundCancel(data) {
      this.accountRefundDisable = data;
    },
    accountRechargeClose() {
      this.accountRechargeCloseForm = {
        date: new Date(),
      };
    },
    accountRefundClose() {
      this.accountRefundCloseForm = {
        date: new Date(),
      };
    },
    doSearch() {
      if (!this.sendData || !this.sendData.patientId) {
        this.$message("请选择患者");
        return;
      }
      this.pageNo = 1;
      this.pageSize = 15;
      this.total = 0;
      if (this.activeName == "first") {
        this.rechargeData = [];
        this.getRechargeDataList();
      } else if (this.activeName == "second") {
        this.pageParams = {
          pageSize: 15,
          pageNo: 1,
          total: 0,
        };
        this.consumptionData = [];
        this.getConsumptionData();
      }
    },
    // 查询患者消费明细记录
    async getConsumptionData() {
      if (!this.selectConsumptionDate) {
        this.$message.error("请选择要查询的日期范围");
        return false;
      }
      try {
        this.tlm_isLoading = true;
        let obj = {
          patientId: this.sendData.patientId,
          // prestoreCode: this.accountDetailInfoData.prestoreCode,
          pageNo: this.pageParams2.pageNo,
          pageSize: this.pageParams2.pageSize,
        };
        if (
          this.selectConsumptionDate &&
          this.selectConsumptionDate.length > 1
        ) {
          obj.startDate =
            this.selectConsumptionDate[0].format("yyyy-MM-dd") + " 00:00:00" ||
            "";
          obj.endDate =
            this.selectConsumptionDate[1].format("yyyy-MM-dd") + " 23:59:59" ||
            "";
        }
        let res = await prestoreDetail(obj);
        this.consumptionData = res.data;
        this.pageParams2.total = res.total;
        // this.consumptionData = this.consumptionData.concat(res.data);
        // 修复表格错乱
        this.$nextTick(() => {
          this.$refs.table2.doLayout();
        });
        this.tlm_isLoading = false;
      } catch (error) {
        console.info(error);
        this.tlm_isLoading = false;
        this.$message.error(error.msg || "获取消费列表失败");
      }
    },
    // 千位分割
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
    handleSizeChange1(val) {
      this.pageParams1.pageSize = val;
      this.pageParams1.pageNo = 1;
      this.doSearch();
    },
    handleCurrentChange1(val) {
      this.pageParams1.pageNo = val;
      this.getRechargeDataList();
    },
    // 分页
    handleSizeChange2(val) {
      this.pageParams2.pageSize = val;
      this.pageParams2.pageNo = 1;
      this.doSearch();
    },
    handleCurrentChange2(val) {
      this.pageParams2.pageNo = val;
      this.getConsumptionData();
    },
  },
};
</script>

<style scoped lang="scss">
.account-cont {
  height: 100%;
  padding: 0 16px 0px 16px;
  position: relative;

  .head {
    width: 64px;
    height: 24px;
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(46, 50, 58, 1);
    line-height: 24px;
    position: relative;
    left: 10px;

    .head-before {
      width: 4px;
      height: 20px;
      background: $l-color-primary;
      position: absolute;
      left: -10px;
      top: 0;
    }
  }

  .title {
    margin-bottom: 20px;
    padding-left: 15px;

    .title-cont {
      height: 20px;
      margin-right: 40px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(148, 157, 163, 1);
      line-height: 20px;
      display: inline-block;

      i {
        min-width: 50px;
        height: 18px;
        margin-left: 10px;
        font-style: normal;
        font-size: 14px;
        font-weight: 400;
        color: rgba(46, 50, 58, 1);
        line-height: 18px;
        display: inline-block;
      }
    }
  }
  .tab-pan-h {
    height: calc(100% + 10px);
    position: relative;
  }
  // .tabs-cont {
  //   // padding-left: 15px;
  //   height: calc(100% - 40px);
  //   position: relative;
  // }
  .table-h {
    height: calc(100% - 100px);
    margin-top: 10px;
    position: relative;
  }
  .table-h2 {
    height: calc(100% - 100px);
    margin-top: 10px;
    position: relative;
  }
  .tabs-foot {
    margin: 20px 0 20px 0;
    padding-bottom: 20px;
    border-bottom: 1px solid $l-color-bgcolor-11;

    .tabs-foot-cont {
      height: 20px;
      display: inline-block;
      font-size: 14px;
      font-weight: bold;
      color: $l-color-fontcolor-3;
      line-height: 20px;
    }

    .tabs-foot-cont1 {
      margin-right: 30px;
      font-size: 16px;
      color: $l-color-fontcolor-4;
      float: right;

      i {
        min-width: 50px;
        font-style: normal;
        display: inline-block;
        margin-left: 10px;
        font-size: 16px;
        font-weight: bold;
        color: rgba(46, 50, 58, 1);
        line-height: 21px;
      }
    }

    .tabs-foot-cont2 {
      float: right;

      i {
        display: inline-block;
        min-width: 50px;
        font-style: normal;
        font-weight: bold;
        color: $l-color-primary;
        line-height: 21px;
      }
    }
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
}
.tabs {
  height: calc(100% - 90px);
  position: relative;

  .buttons {
    position: absolute;
    right: 0;
    top: 35px;

    .button-cont {
      width: 80px;
      height: 36px;
      padding: 0;
      background: $l-color-primary;
      border-radius: 2px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 36px;
    }

    .button-cont2,
    .button-cont3 {
      background-color: #fff;
      border: 1px solid $l-color-primary;
      color: $l-color-primary;
    }
  }

  .consume-details {
    position: absolute;
    top: 200px;
  }

  .primary-color {
    color: $l-color-primary;
  }
}
/deep/ .el-tabs__content {
  padding-top: 10px;
}
</style>
