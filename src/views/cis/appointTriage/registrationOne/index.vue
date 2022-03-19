<!--- 
  旧版界面 准备删掉
  2020/06/18
  shaokang
 ----->

<template>
  <div class="body-div height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      @message="messageHandler"
      patientCardType="default"
      pageName="registration"
    >
      <template #list>
        <l-side-tabs
          @tabs-change="handleClick"
          @read-card="readCard"
          @query="search"
          :hosp-state="false"
          hideBtn
          hideIcon
          :form-list="formParams"
          :searchPlaceholder="'卡号'"
        >
          <template #firstBottom>
            <!--填入 第一个 tabs 的 搜索条件下部 内容-->
            <div class="botton-cont height100">
              <div class="table height100">
                <el-table
                  ref="officeTable"
                  v-loading="tlm_isLoading"
                  v-loadmore="loadNextPage"
                  :data="tableOfficeData"
                  element-loading-text="加载中..."
                  width="100%"
                  height="100%"
                  stripe
                  border
                  highlight-current-row
                  @row-click="setOffice"
                >
                  <el-table-column
                    v-for="(item, index) in tableOfficeLeftParams"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :min-width="item.width"
                    :fixed="item.fixed"
                    header-align="left"
                    :align="item.align || 'left'"
                  >
                    <div slot-scope="scope">
                      <div v-if="item.prop === 'deptId'">
                        <span
                          tableName="sys_org"
                          :conditionMap="{
                            org_type: '_DEPT_',
                            id: scope.row['deptId']
                          }"
                          columns="org_nm"
                          v-tableTransform
                        ></span>
                      </div>
                      <div v-else>
                        <span class="color-order">
                          {{
                          scope.row[item.prop]
                          }}
                        </span>
                      </div>
                    </div>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </template>
        </l-side-tabs>
      </template>
      <template #content>
        <div class="width100 height100 bgc-cont">
          <div class="center-cont width100 height100">
            <el-card class="box-card width100 height100">
              <div style="padding-right: 20px;" class="width100 height-button-main">
                <div style="margin-left:20px">
                  <l-card-title>
                    <template slot="left">挂号信息</template>
                  </l-card-title>
                </div>
                <el-form ref="searchForm" :model="searchForm">
                  <div style="margin-left: 20px">
                    <el-row :gutter="10" class="margin-left-10 l-clearfix:after">
                      <el-col :span="5">
                        <LFormtTitle label="挂号科室" labelWidth="76">
                          <span
                            style="display: inline-block;padding-top: 8px;"
                            tableName="sys_org"
                            :conditionMap="{
                              org_type: '_DEPT_',
                              id: deptId
                            }"
                            columns="org_nm"
                            v-tableTransform
                          ></span>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="5">
                        <LFormtTitle label="挂号类别" labelWidth="76">
                          <el-select
                            clearable
                            v-model="reInfo.diagTreatType"
                            placeholder="请选择"
                            @change="changType"
                          >
                            <el-option
                              v-for="(item,index) in docTypes"
                              :key="index"
                              :label="item.diagTreatTypeName"
                              :value="item.diagTreatType"
                            ></el-option>
                          </el-select>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="5">
                        <LFormtTitle label="挂号医生" labelWidth="76">
                          <el-select clearable v-model="reInfo.doctorId" @change="changeDoc">
                            <el-option
                              v-for="item in doctors"
                              :key="item.scheduleId"
                              :label="item.doctorName"
                              :value="item.doctorId"
                            ></el-option>
                          </el-select>
                        </LFormtTitle>
                      </el-col>
                      <!-- 取消挂号即收 -->
                      <!-- <el-col :span="9">
                        <el-row>
                          <el-col :span="24">
                            <span class="line-height margin-right-10 guahao-text">挂号即收</span>

                            <el-checkbox-group
                              style="display:inline-block"
                              v-model="checkeds"
                              @change="handleCheckedChange"
                            >
                              <el-checkbox
                                class="line-height"
                                v-for="item in checkboxs"
                                :label="item.chargeItemId"
                                :key="item.chargeItemId"
                              >{{ item.chargeItemName }}</el-checkbox>
                            </el-checkbox-group>
                          </el-col>
                        </el-row>
                      </el-col> -->
                    </el-row>
                  </div>
                </el-form>
                <div>
                  <orderTime
                    @putDeteEvent="orderTimeEvent"
                    :scheduleList="scheduleList"
                    :ouptDeptId="deptId"
                    :diagTreatType="reInfo.diagTreatType"
                    :doctorId="reInfo.doctorId"
                  />
                </div>
                <div class="mar-top-20" style="margin-left:20px">
                  <l-card-title>
                    <template slot="left">收费信息</template>
                  </l-card-title>
                </div>
                <div style="margin-left: 20px">
                  <el-row class="margin-left-10">
                    <el-table :data="tableData" width="100%" height="208px" border show-summary>
                      <el-table-column
                        v-for="(item, index) in tableParams"
                        :key="index"
                        :prop="item.prop"
                        :label="item.label"
                        :min-width="item.width"
                        header-align="left"
                        :align="item.align || 'left'"
                      >
                        <template slot-scope="scope">
                          <template v-if="item.prop === 'statisticsCode'">
                            <span :val="scope.row[item.prop]" code="order_type" v-codeTransform></span>
                          </template>
                          <template v-else-if="item.prop === 'chargePrice'">
                            <span>{{scope.row[item.prop].toFixed(2)}}</span>
                          </template>
                          <template v-else-if="item.prop === 'num'">
                            <span>1</span>
                          </template>

                          <template v-else>
                            <span class="overflow-point">
                              {{
                              scope.row[item.prop]
                              }}
                            </span>
                          </template>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-row>
                </div>
              </div>
              <div class="height-button-bottom border-style">
                <el-button
                  v-hotKey="{func :'func_submit' }"
                  type="primary"
                  class="float-right mar-right-20 mar-top-20"
                  @click="openDialog"
                >确认挂号</el-button>
              </div>
            </el-card>
          </div>
        </div>
      </template>
    </l-layout>

    <!-- 确认挂号弹窗 -->
    <el-dialog
      title="收费"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="700px"
      @close="closeDialog"
    >
      <l-charge :charge="newLchrage" :isApptointment="true" @close="close"></l-charge>
      <!-- <charge :charge.sync="charge"></charge>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="this.charge.warning != ''" @click="submitRegister">确定挂号</el-button>
        <el-button @click="closeDia">取 消</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>
<script>
import LSideTabs from "@/components/LSideTabs.vue";
import orderTime from "./components/orderTime";
import service from "@/api/appointment/appointment";
import { mapActions, mapGetters } from "vuex";
import { transformCode, getTableData } from "@/api/directive/directiveRequest";

export default {
  components: {
    LSideTabs,
    orderTime
  },
  data() {
    return {
      orderTimeBucket: ["上午", "下午", "晚上"],
      searchForm: {},
      orderInfo: {
        am: 0,
        amNum: 0,
        night: 0,
        nightNum: 0,
        pm: 0,
        pmNum: 0
      },
      formParams: ["search"],
      toolBoxs: ["registerRecord", "Hotkey"],
      // 预约列表时间
      dateTime: [],
      // 历史挂号区间
      hisDateTime: [],
      charge: {
        payType: "3",
        // 实收
        realGet: 0,
        // 找零
        backMoney: 0,
        chargeObj: {},
        // 表格数据
        tableData: [],
        // 提示数据
        warning: ""
      },
      // 挂号信息
      reInfo: {
        diagTreatType: "",
        ouptDeptId: "",
        doctorId: ""
      },
      tableOfficeData: [],
      tableLeftData: [],
      tableOfficeLeftParams: [
        {
          prop: "deptId",
          label: "科室列表",
          width: "130",
          align: "left",
          fixed: true
        },
        {
          prop: "todayOrder",
          label: "今日预约",
          width: "100",
          align: "left",
          fixed: false
        }
      ],
      tableLeftParams: [
        {
          prop: "patientName",
          label: "姓名",
          width: "100",
          align: "left",
          fixed: true
        },
        {
          prop: "patientGender",
          label: "性别",
          width: "50",
          align: "left",
          fixed: false
        },
        {
          prop: "birthDate",
          label: "出生日期",
          width: "180",
          align: "left",
          fixed: false
        }
      ],
      // 表格表头
      tableParams: [
        {
          prop: "statisticsCode",
          label: "项目类型",
          width: "150",
          align: "left"
        },
        {
          prop: "chargeItemName",
          label: "项目名称",
          width: "200",
          align: "left"
        },
        {
          prop: "chargePrice",
          label: "金额（元）",
          width: "120",
          align: "right"
        },
        {
          prop: "remark",
          label: "备注",
          align: "left"
        }
      ],
      // 表格数据
      tableData: [],
      // 挂号科室集合
      deptId: "",
      ouptDeptIds: [],
      // 诊疗类型
      docTypes: [],
      // 挂号医生
      doctors: [],
      // 结算弹窗
      dialogVisible: false,
      // 排班集合
      scheduleList: [],
      // 挂号即收选中集合
      checkeds: [],
      // 其他收费项目集合 如磁卡费 病历费
      otherChargeList: [],
      // 主要收费项目集合
      mainChargeList: [],
      // 挂号即收集合
      checkboxs: [],
      // 患者信息
      patientInfo: {},
      // 待收费对象集合
      chargePrescriptions: [],
      // 加载
      tlm_isLoading: false,
      // 当前排班
      schdelu: {},
      // 预约挂号对象
      outpObj: {},
      // 患者及账户信息对象
      info: {},
      // 账户对象
      accountInfo: {},
      // 预约信息
      appt: {},
      // 当前挂号费用
      itemCharge: [],
      pageParams: {
        pageNo: 1,
        pageSize: 25,
        total: 0
      },
      formObj: {},
      //反显数据缓存
      codeTransformObj: {},
      depName: "",
      // 备注 判断时间用(12,18,22)
      recordRemark: "",
      // 预约时间
      timeRange: "",
      // 挂号费预结算返回对象
      outpPreSettlementResult: {},
      newLchrage: {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      },
      // 全部诊疗类型
      allDiagTreatType: []
    };
  },
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
    ...mapGetters("base", ["receivePatientData"])
  },
  async created() {
    // 拿到诊疗类型 回显用
    await this.getDiagTreatType();
    // 拿到排班
    await this.getSchedele();
  },
  mounted() {
    // // 重置数据
    // this.resetData();
    this.delVisitCodeInVxData();
    // 拿到科室列表
    this.search({});
    // 拿到挂号即收 （取消掉 2020-05-11）
    // this.getItem();
  },
  watch: {
    charge(val) {
      this.charge = val;
    },
    deptId(val) {
      this.changOffice();
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    async updatePageData() {
      // this.resetData(); 不能清空 ，后边流程受影响
      this.getDataList();
      // 更新左侧科室列表
      await this.getSchedele();
    },
    orderTimeEvent(data) {
      let index = data.timeRange.indexOf(":") + 3;
      let time =
        new Date().format("yyyy-MM-dd") +
        " " +
        data.timeRange.substr(0, index) +
        ":00";
      this.timeRange = time;
      this.schdelu = data.schedule || {};
      this.getChargesItem();
    },
    setOffice(row) {
      this.deptId = row.deptId;
    },
    juageTime(time) {
      let date = new Date();
      let hours = date.getHours();
      if (time <= hours) {
        this.$message.warning("当前时间段不支持挂号");
        return false;
      }
      return true;
    },
    async changOffice() {
      let list = [];
      this.schdelu = {};
      // 清空数据
      this.reInfo.diagTreatType = null;
      this.reInfo.doctorId = null;
      // 拿到 当前科室 下的诊疗类型
      this.scheduleList.forEach(item => {
        if (item.ouptDeptId == this.deptId) {
          list.push(item);
        }
      });
      // 去重 拿到 当前科室 下的诊疗类型
      let obj = {};
      this.docTypes = [];
      for (let i = 0; i < list.length; i++) {
        if (!obj[list[i].diagTreatType]) {
          // let diagTreatTypeName = await this.transformCode(
          //   "name",
          //   "DIAG_TREAT_TYPE",
          //   list[i].diagTreatType
          // );
          this.allDiagTreatType.forEach(val=>{
            if(val.diagTreatTypeCode == list[i].diagTreatType){
              this.$set(list[i], "diagTreatTypeName", val.diagTreatTypeName);
            }
          })
          this.docTypes.push(list[i]);
          obj[list[i].diagTreatType] = true;
        }
      }
    },
    // 查询全部诊疗类型
    async getDiagTreatType(){
      try {
        this.$showLoading();
        let res = await service.getDiagTreatType();
        this.allDiagTreatType = res.data; 
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "查询诊疗类型失败");
      }
    },
    changType() {
      let list = [];
      this.reInfo.doctorId = null;
      // 拿到当前科室下所有医生
      this.scheduleList.forEach(item => {
        if (
          item.diagTreatType == this.reInfo.diagTreatType &&
          item.ouptDeptId == this.deptId
        ) {
          list.push(item);
        }
      });
      let obj = {};
      this.doctors = [];
      for (let i = 0; i < list.length; i++) {
        if (!obj[list[i].doctorId]) {
          this.doctors.push(list[i]);
          obj[list[i].doctorId] = true;
        }
      }
    },
    changeDoc() {
      this.doctors.forEach(item => {
        if (item.doctorId == this.reInfo.doctorId) {
          this.reInfo.doctorName = item.doctorName;
        }
        if (item.diagTreatType == this.reInfo.diagTreatType) {
          this.reInfo.diagTreatTypeName = item.diagTreatTypeName;
        }
        if (item.ouptDeptId == this.deptId) {
          this.reInfo.ouptDeptName = item.ouptDeptName;
        }
      });
    },
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getDataList(true);
    },
    handleClick() {
      // tab 的切换方法
    },
    // 搜索方法  查询患者  获取预约列表
    async search(val) {
      try {
        this.$showLoading();
        // 查询档案列表
        this.tlm_isLoading = true;
        this.formObj = val;
        this.tableLeftData = [];
        this.getDataList();
        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    async getDataList(isLoad = false) {
      try {
        this.tlm_isLoading = true;
        const times =
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate();
        const sDate = `${times} 00:00:00`;
        const eDate = `${times} 23:59:59`;
        let resData = await service.getOfficeOrderList({
          sDate,
          eDate,
          ...this.pageParams,
          deptName: ""
        });
        let _self = this;
        if (resData.code === 1 && resData.data) {
          if (resData.data.length > 0) {
            this.deptIdParams = resData.data[0].deptId;
            if (!isLoad) {
              this.tableOfficeData.length = 0;
            }
            this.tableOfficeData.push(
              ...resData.data.map(item => {
                return {
                  deptId: item.deptId,
                  todayOrder: item.allNum
                    ? `${item.apptNum}/${item.allNum}`
                    : "0/0"
                };
              })
            );
            this.deptId = this.tableOfficeData[0].deptId;
            this.pageParams.total = resData.total;
          }
        }

        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
        this.$message.error(error.msg || "科室列表接口获取失败");
      }
    },
    messageHandler() {},
    closeDialog() {
      this.updatePageData();
    },
    async closeDia() {
      this.dialogVisible = false;
      // 设置自动签到分诊 回滚数据
      try {
        if (this.outpObj.recordStatus == "6") {
          await service.delOutp(this.outpObj);
        }
      } catch (error) {
        this.$message.error(error.msg || "请收取预约费用");
      }

      this.closeDialog();
    },
    // 打开弹窗
    // eslint-disable-next-line complexity
    async openDialog() {
      let _this = this;
      if (
        this.reInfo == null ||
        this.tableData.length < 1 ||
        this.patientInfo.patientId == undefined ||
        this.info == null
      ) {
        this.$message.error("请选择患者并预约");
        return;
      }
      // 预约挂号
      try {
        this.$showLoading();
        const outp = await service.createOutp({
          patientId: this.patientInfo.patientId,
          patientCode: this.patientInfo.patientCode,
          patientName: this.patientInfo.patientName,
          patientGender: this.patientInfo.patientGender,
          birthDate:
            this.patientInfo.birthDate +
            (this.patientInfo.birthTime
              ? " " + this.patientInfo.birthTime
              : " 00:00:00"),
          phoneNum: this.patientInfo.phoneNum,
          identificationNum: this.patientInfo.identificationNum,
          patientAddr: this.patientInfo.patientAddr,
          appointmentMode: "1",
          scheduleSerialId: this.schdelu.scheduleId || "",
          doctorId: this.schdelu.doctorId || "",
          appointmentTime: this.timeRange,
          ouptDeptId: this.deptId,
          diagTreatType: this.reInfo.diagTreatType
        });

        if (outp.code === 1) {
          this.outpObj = outp.data;
          this.newLchrage.appointment = outp.data;
          // 更新左侧患者列表 数据
          this.updatePageData();
        }
        this.changeRecPatientData({});
        this.changeRecPatientData(this.patientInfo);
        this.$hideLoading();
        this.$message.success("挂号成功，请缴费！");
        // 询问是否收费
        this.chargeToAsk();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "预约挂号接口报错");
      }
    },
    chargeToAsk() {
      this.$confirm("是否收费?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "success"
      })
        .then(() => {
          // 待收费对象转换
          this.changeObj();
          this.dialogVisible = true;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消收费"
          });
        });
    },
    // 对象转换
    changeObj() {
      this.chargePrescriptions = [];
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i];
        let obj = {
          orderName: item.chargeItemName,
          dosageUnit: item.chargeUnit,
          quantity: "1",
          price: item.chargePrice,
          orderItemId: item.chargeItemId,
          orderItemCat: item.statisticsCode,
          prescriptionSource: "9",
          num: "1",
          visitId: this.outpObj.appointmentId,
          ouptDeptId: this.deptId, // 专科id
          groupId: item.groupNo, // 组号
          groupNo: item.groupNo
        };
        this.chargePrescriptions.push(obj);
      }
      this.newLchrage.chargePrescriptions = this.chargePrescriptions;
    },
    // 确认充值
    async submitRecharge() {
      const { data } = await service.prestore(this.info);
      // 刷新余额
      const accountInfo = await service.getAccountInfo(
        this.patientInfo.patientId
      );
      // this.balanceMoney = accountInfo.data.balanceMoney;
      this.showRecharge = false;
    },
    // 确认挂号
    // eslint-disable-next-line complexity
    // async submitRegister() {
    //   if (this.charge.chargeObj.cashPay == 0) {
    //     try {
    //       this.$showLoading();
    //       // const response = await service.settlement(this.charge.chargeObj);
    //       await this.settlementNew();
    //       // if (response.code == "1") {
    //       //   this.$message({
    //       //     message: response.msg,
    //       //     type: "success"
    //       //   });
    //       //   this.resetData();
    //       // }
    //       this.dialogVisible = false;
    //       this.$hideLoading();
    //     } catch (error) {
    //       this.$hideLoading();
    //       if (error.code == "0") {
    //         this.dialogVisible = false;
    //         // 如果自动签到 回滚预约数据
    //         if (this.outpObj.recordStatus == "6") {
    //           await service.delOutp(this.outpObj);
    //           this.$message.error(error.msg || "结算失败，请重新挂号");
    //         } else {
    //           this.$message.error(error.msg || "结算失败");
    //         }
    //         this.resetData();
    //         return;
    //       }
    //     }
    //   } else if (this.charge.chargeObj.cashPay > 0) {
    //     let prestore = "";
    //     try {
    //       this.$showLoading();
    //       // 充值
    //       const response = await service.prestore({
    //         prestoreMoney: this.charge.chargeObj.cashPay,
    //         patientId: this.patientInfo.patientId,
    //         patientName: this.patientInfo.patientName,
    //         prestoreCode: "01",
    //         businessType: "1",
    //         payTypeId: "1",
    //         dataVersion: this.accountInfo.dataVersion
    //       });
    //       prestore = response.data.prestoreDetailId;
    //       this.$hideLoading();
    //     } catch (error) {
    //       this.$hideLoading();
    //       this.dialogVisible = false;
    //       if (this.outpObj.recordStatus == "6") {
    //         await service.delOutp(this.outpObj);
    //         this.$message.error("缴费充值失败，请重新挂号");
    //       } else {
    //         this.$message.error("缴费充值失败");
    //       }
    //       this.resetData();
    //     }
    //     try {
    //       this.$showLoading();
    //       // 结算  （充完值，预结算对象 的值 要不要变）
    //       // const res = await service.settlement({
    //       //   ...this.charge.chargeObj,
    //       //   prestoreDetailId: prestore
    //       // });
    //       // if (res.code == "1") {
    //       //   this.$message({
    //       //     message: res.msg,
    //       //     type: "success"
    //       //   });
    //       //   this.resetData();
    //       // }
    //       await this.settlementNew();
    //       this.dialogVisible = false;
    //       this.$hideLoading();
    //     } catch (error) {
    //       this.$hideLoading();
    //       if (this.outpObj.recordStatus == "6") {
    //         await service.delOutp(this.outpObj);
    //         this.$message.error(error.msg || "结算失败，请重新挂号");
    //       } else {
    //         this.$message.error(error.msg || "结算失败");
    //       }
    //       this.resetData();
    //     }
    //   }
    // },
    // 拿到当前 (上下午)今天排班
    async getSchedele() {
      this.$showLoading();
      const hour = new Date().getHours();
      let sDate = "";
      let eDate = "";
      let times =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate();
      sDate = `${times} 00:00:00`;
      eDate = `${times} 23:59:59`;

      const { data } = await service.getScheduleList({
        startDate: sDate,
        stopDate: eDate
      });

      // 去重 拿到所有科室
      let obj = {};
      for (let i = 0; i < data.length; i++) {
        if (!obj[data[i].ouptDeptId]) {
          this.ouptDeptIds.push(data[i]);
          obj[data[i].ouptDeptId] = true;
        }
      }
      this.scheduleList = data;
      this.changOffice();

      this.$hideLoading();
    },
    // 根据就诊类型 查询收费项目
    async getChargesItem() {
      // 根据医生id 查询职称代码
      for (let i = 0; i < this.scheduleList.length; i++) {
        if (this.scheduleList[i].doctorId == this.reInfo.doctorId) {
          // this.$set(this.reInfo, "workCode", this.scheduleList[i].workCode);
          this.$set(this.reInfo, "workCode", "1737"); // 暂时写死
        }
      }
      let params = {
        birthDate: "",
        regDiagTreatType: this.reInfo.diagTreatType,
        regWorkCode: this.reInfo.workCode
      };
      const { data } = await service.getChargeRegDetail(params);
      this.mainChargeList = data;

      this.tableData = [...this.mainChargeList, ...this.otherChargeList];

      // 暂存当前挂号费对象
      this.itemCharge = data;
      // 设置当前排班
      // this.setSchdule();  此方法不精确
    },
    // 磁卡费。病历费。
    handleCheckedChange() {
      let chargeList = [];
      // 接收上次获取的收费项目
      let list = [];
      if (this.itemCharge) {
        list = [...this.itemCharge];
      }

      // 获取磁卡费和病历费向 集合中添加
      this.checkeds.forEach((val, index) => {
        this.checkboxs.forEach((obj, index) => {
          if (val === obj.chargeItemId) {
            chargeList.push(obj);
          }
        });
      });

      this.otherChargeList = chargeList;
      this.tableData = [...chargeList, ...list];
    },
    // 读卡
    readCard(val) {
      this.readCardFunc(val);
    },
    async readCardFunc(val) {
      try {
        if (val.search == "") {
          this.$message.warning("请输入卡号");
          return;
        }
        this.resetData();
        this.$showLoading();
        const { data = {} } = await service.getCardDetailInfo({
          cardNum: val.search || ""
        });
        if (!data.patientId) {
          this.$message.info("查无此人，请输入正确卡号");
          return;
        }
        // 清除患者信息中的visitCode  重要！！！(会影响后边开电子申请流程)
        this.$delete(data, "visitCode");

        this.patientInfo = { ...data };
        this.changeRecPatientData(this.patientInfo);
        this.tableLeftData = [data];
        if (data.patientId) {
          const accountInfo = await service.getAccountInfo(data.patientId);
          // 存储账户信息 充值用！！！！！
          this.accountInfo = accountInfo.data;
          this.balanceMoney = accountInfo.data.balanceMoney;
          this.newLchrage.accountInfo = accountInfo.data;
          this.info = {
            ...data,
            ...accountInfo.data
          };
        }
        this.$hideLoading();
      } catch (error) {
        this.$message.error(error.msg || "读卡失败");
        this.$hideLoading();
      }
    },
    // 重置，清空数据
    resetData() {
      this.recordRemark = ""; // 用作时间段标志
      this.chargePrescriptions = []; // 待收费名细
      /* this.reInfo.ouptDeptId = null; // 挂号信息
      this.reInfo.diagTreatType = null; // 挂号信息
      this.reInfo.doctorId = null; // 挂号信息 */
      // this.patientInfo = {}; // 当前患者信息   修改 暂不清空
      this.info = {}; // 患者及账户信息
      this.tableData = []; // 收费表格数据
      this.outpObj = {}; // 预约挂号对象
      this.accountInfo = {}; // 当前患者账户信息
      // this.checkboxs = []; // 所有挂号即收
      /* this.checkeds = []; // 选中的挂号即收 */
      this.itemCharge = []; // 当前挂号费
      this.schdelu = {}; // 当前排班
      this.choosedTime = "";
      this.orderInfo = {
        am: 0,
        amNum: 0,
        night: 0,
        nightNum: 0,
        pm: 0,
        pmNum: 0
      };
      this.otherChargeList = [];
      this.changeRecPatientData({});
      this.charge = {
        // 实收
        realGet: 0,
        // 找零
        backMoney: 0,
        chargeObj: {},
        // 表格数据
        tableData: [],
        // 提示数据
        warning: "",
        payType: "3"
      };
    },
    // 初加载 清除visitCode
    async delVisitCodeInVxData() {
      this.patientInfo = { ...this.receivePatientData };
      this.$delete(this.patientInfo, "visitCode");
      this.changeRecPatientData(this.patientInfo);
      // 拿到患者账户信息
      if (this.patientInfo.patientId) {
        const accountInfo = await service.getAccountInfo(
          this.patientInfo.patientId
        );
        // 存储账户信息 充值用！！！！！
        this.accountInfo = accountInfo.data;
        this.balanceMoney = accountInfo.data.balanceMoney;
        this.info = {
          ...this.patientInfo,
          ...accountInfo.data
        };
      }
    },
    // 拿到挂号即收项目
    async getItem() {
      try {
        const response = await service.getItem({});
        this.checkboxs = response.data;
      } catch (error) {
        this.$message.error(error.msg);
      }
    },
    //主数据反显  (诊疗类型用)
    async transformCode(field, code, val) {
      let params = [{ field, code, val }];
      // debugger
      if (this.codeTransformObj[`${code}+${val}`]) {
        el.innerText = this.codeTransformObj[`${code}+${val}`];
        return this.codeTransformObj[`${code}+${val}`];
      }
      try {
        let resData = await transformCode(params);
        if (resData.code === 1) {
          this.codeTransformObj[`${code}${val}`] = resData.data[code];
          return Promise.resolve(resData.data[code]);
        }
        return "--";
      } catch (err) {
        return "--";
      }
    },
    //表数据反显 （科室用）
    async transformTable(columns, conditionMap, tableName) {
      try {
        let data = {
          tableName: tableName || "",
          columns: columns || "",
          conditionMap: conditionMap || {}
        };
        let resData = await getTableData(data);
        if (resData.code === 1 && resData.data != []) {
          return Promise.resolve(resData.data[0][columns]);
        }
        return "默认";
      } catch (error) {
        return "默认";
      }
    },

    // 门诊挂号费预结算
    async regPresettlement() {
      try {
        this.$showLoading();
        let res = await service.regPresettlement({
          patientId: this.patientInfo.patientId,
          settlementType: undefined,
          regDiagTreatType: this.reInfo.diagTreatType,
          regSdeptId: this.deptId,
          regDoctorId: this.reInfo.doctorId,
          regWorkCode: "",
          appointmentId: this.outpObj.appointmentId,
          diagTreatActivityId: this.outpObj.appointmentId
        });
        this.outpPreSettlementResult = { ...res.data };
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "挂号费预结算失败");
      }
    },
    close() {
      this.dialogVisible = false;
      this.newLchrage = {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      };
    },
    // 预约结算
    async settlementNew() {
      try {
        this.$showLoading();
        let res = await service.regPresettlement(this.outpPreSettlementResult);
        if (res.data.code == "1") {
          this.$message({ message: "结算成功", type: "success" });
        }
        this.resetData();
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "结算失败");
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.guahao-text {
  font-size: $l-font-size;
  
  font-weight: 400;

  color: $l-color-fontcolor-4;
}

.body-div {
  .left-cont {
    width: 292px;
    float: left;
  }

  .center-cont {
    float: left;
    overflow-y: auto;
    .is-always-shadow {
      border: 0;
      // box-shadow: 0 0px 0px 0 rgba(0, 0, 0, 0.1);
    }
  }
  .botton-cont {
    margin: 0 20px;
  }
  .color-hospital {
    color: #3d7dfb;
  }

  .right-cont {
    width: 248px;
    float: right;
  }

  .topClock {
    span:not(.font)  {
      color: #949da3;
      font-size: 14px;
      line-height: 20px;

      .font {
        font-weight: $l-font-weight;
        color: #2e323a;
        font-size: 20px;
      }
    }
  }
  .bgc-cont {
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  }

  .text-title {
    display: inline-block;
    width: 60px;
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(148, 157, 163, 1);
    line-height: 20px;
  }
  .text-contain {
    display: inline-block;
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    line-height: 20px;
  }

  .mar-top-20 {
    margin-top: 20px;
  }

  .mar-right-20 {
    margin-right: 20px;
  }

  .mar-top-10 {
    margin-top: 10px;
  }

  .input-width {
    width: 100%;
  }

  .img {
    width: 80px;
    height: 102px;
    background: rgba(245, 245, 245, 1);
    border-radius: 2px;
    border: 1px solid rgba(228, 228, 228, 1);
    margin-left: 20px;
  }

  .block {
    width: 100%;
    height: 82px;
    background: rgba(245, 245, 245, 1);
    border-radius: 2px;
    padding-top: 20px;
    text-align: center;

    span {
      color: #949da3;
      font-size: $l-font-weight;
    }

    .font {
      color: $l-color-primary;
      font-weight: $l-font-weight;
      font-size: 20px;
    }
  }
  .order-time-cont {
    float: left;
    width: 20%;
    height: 160px;
    border: 1px solid #e4e4e4;
    background: rgba(246, 246, 246, 1);
    vertical-align: baseline;
    .title {
      display: inline-block;
      width: 100%;
      text-align: center;
      height: 80px;
      border-bottom: 1px solid #e4e4e4;
    }
    .common {
      line-height: 80px;
      font-size: 14px;
      
      font-weight: 400;
      color: rgba(46, 50, 58, 1);
    }
    .special-order {
      padding-top: 20px;
      line-height: 20px;
      color: #3d7dfb;
      cursor: pointer;
      background-color: #fff;
    }
    .choosed {
      color: #fff;
      background-color: $l-color-primary;
    }
    .show-content {
      text-align: center;
      display: inline-block;
      width: 100%;
      height: 76px;
    }
  }

  .line-height {
    line-height: 40px;
  }

  .count {
    width: 100%;
    height: 42.6px;
    border-bottom: 1px solid #e4e4e4;
  }
  .border-style {
    border-top: 1px solid #e4e4e4;
  }

  .bottom-span {
    line-height: 50px;
    margin-right: 30px;
    color: #949da3;
    font-size: $l-font-size;

    .font {
      font-weight: $l-font-weight;
      color: #2e323a;
      margin-left: 5px;
      margin-right: 5px;
      font-size: 20px;
    }
  }

  .dialog {
    width: 400px;
    height: 600px;
  }

  .payType {
    width: 100%;
  }

  .el-dialog__body {
    padding-top: 0px !important;
    padding-bottom: 10px !important;
  }

  .el-card__header {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .balance-middle {
    font-size: 14px;
    font-weight: 400;
    color: rgba(61, 125, 251, 1);
    line-height: 30px;
  }

  .balance-top {
    font-size: 16px;
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    line-height: 34px;
  }

  .balance-bottom {
    font-size: 14px;
    font-weight: 400;
    color: rgba(148, 157, 163, 1);
    line-height: 30px;
  }
}

.box-card {
  overflow-y: auto;
  .duka-button {
    width: 200px;
    height: 36px;
    margin-left: 10px;
    border: none;
    border-radius: 2px;
    float: left;

    i {
      display: inline-block;
      margin-right: 10px;
    }
  }
}
/deep/ .el-tabs__nav-scroll {
  display: none;
}
/deep/ .content-150 {
  height: calc(100% - 170px);
}
</style>
<style>
body .btn-custom-cancel {
  float: right;
  margin-left: 10px;
}
</style>