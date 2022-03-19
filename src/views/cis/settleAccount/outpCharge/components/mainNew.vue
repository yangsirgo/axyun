<template>
  <div class="width100 height100" ref="page">
    <div class="outpcharge-main width100 height-button-main">
      <p class="no-data" v-show="tradeDetailList.length === 0">暂无数据</p>
      <l-collapse v-model="activeNames" class="cols" v-loading="rightLoading">
        <l-collapse-item
          v-for="(tradeItem, index) in tradeDetailList"
          :name="index"
          :key="index"
        >
          <!-- 交易信息列-->
          <div class="width100" slot="title" @click.stop="clickTitle(index)">
            <el-row class="over-txt" :gutter="20">
              <el-col :span="6">
                <div @click.stop>
                <el-radio
                  v-model="applyChecked"
                  @change="orderChange"
                  @click.native="clickRadio(index, $event)"
                  :label="index"
                >
                  门诊号：<span>{{ tradeItem.diagTreatActivityId }}</span>
                </el-radio>
                </div>
              </el-col>
              <!-- <el-col :span="8">
                <template v-if="tradeItem.receiptNum">票据号：{{tradeItem.receiptNum}}</template>
              </el-col> -->
              <!-- 特殊病 -->
              <el-col :span="8" v-if="tradeItem.specificDisease">{{
                tradeItem.specificDiseaseName
              }}</el-col>
              <!-- 慢病 -->
              <el-col :span="8" v-else-if="tradeItem.chronicDisease">{{
                tradeItem.chronicDiseaseName
              }}</el-col>
              <el-col :span="8" v-else></el-col>

              <el-col :span="10" class="align-right">
                就诊科室：
                <span class="margin-right20">{{ tradeItem.ouptDeptName }}</span>
                接诊医生：
                <span class="margin-right20">{{ tradeItem.doctorName }}</span>
                <!-- 结算类型：
                <span class="margin-right20">{{ tradeItem.settlementTypeName }}</span> -->
                <!-- 医疗诊疗类别：
                <span>{{ tradeItem.chargeTime }}</span>-->
              </el-col>
            </el-row>
          </div>
          <!-- 收费医嘱明细 循环 -->
          <div slot="content">
            <div class="margin-top-10">
              <l-collapse
                v-model="orderActiveNames[index]"
                v-loading="rightLoading"
              >
                <l-collapse-item
                  v-for="(orderItem,
                  index2) in tradeItem.outpWaitingSettleOrderVOS"
                  :name="index2"
                  :key="index2"
                >
                  <!-- 医嘱明细表头 -->
                  <div class="width100" slot="title" @click.stop="clickCkildTitle(orderItem, index)">
                    <el-row class="row-h-h">
                      <el-col :span="3">
                        <el-checkbox
                          :disabled="applyChecked !== index"
                          v-model="orderItem.checked"
                           @click.native="stopStretch($event)"
                          @change="checkboxChange(orderItem)"
                        >
                          <span :title="orderItem.orderName">{{
                            orderItem.orderName
                          }}</span>
                        </el-checkbox>
                      </el-col>
                      <el-col
                        :span="5"
                        v-if="['1', '4'].includes(orderItem.orderSource)"
                      >
                        <span
                          class="source-tit over-txt-cont"
                          :title="
                            orderSourceShow[orderItem.orderSource] +
                              orderItem.orderBillNum
                          "
                        >
                          {{ orderSourceShow[orderItem.orderSource] }}
                          {{ orderItem.orderBillNum }}
                        </span>
                      </el-col>
                      <el-col :span="5" v-else></el-col>
                      <el-col :span="3">
                        <template
                          v-if="
                            orderItem.orderName === '中草药' &&
                              orderItem.dispensingMethod == '2'
                          "
                        >
                          制药方法：
                          <span
                            :val="orderItem.pharmaMethods"
                            code="productionMethod"
                            v-codeTransform
                          ></span>
                        </template>
                      </el-col>
                      <el-col
                        :span="4"
                        :title="orderItem.dispensingAddr"
                        class="over-txt-cont"
                      >
                        <template
                          v-if="
                            orderItem.orderName === '中草药' &&
                              orderItem.dispensingMethod == '2'
                          "
                          >{{ orderItem.dispensingAddr }}</template
                        >
                      </el-col>
                      <el-col :span="3">
                        <el-button
                          type="primary"
                          v-if="
                            orderItem.orderName === '中草药' &&
                              orderItem.dispensingMethod == '2'
                          "
                          plain
                          @click.stop="getDelivery(tradeItem, orderItem)"
                          >查看配送地址</el-button
                        >
                      </el-col>
                      <el-col :span="3"
                        ><span
                          class="over-txt-cont source-tit"
                          :title="`收费数量：${orderItem.orderQuantity}项`"
                          >收费数量：{{ orderItem.orderQuantity }}项</span
                        ></el-col
                      >
                      <el-col :span="3"
                        ><span
                          class="over-txt-cont source-tit"
                          :title="
                            `总金额：${formatNumber(orderItem.totalAmt)}元`
                          "
                          >总金额：{{
                            formatNumber(orderItem.totalAmt)
                          }}元</span
                        ></el-col
                      >
                    </el-row>
                  </div>
                  <!-- 收费项目明细表格 -->
                  <div slot="content">
                    <el-table
                      :data="orderItem.outpWaitingSettleChargeItemVOS"
                      border
                      style="width: 100%;"
                    >
                      <el-table-column
                        prop="chargeItemName"
                        label="项目名称"
                        header-align="center"
                        min-width="560"
                      ></el-table-column>
                      <el-table-column
                        show-overflow-tooltip
                        min-width="120"
                        prop="spec"
                        label="规格"
                        header-align="center"
                      ></el-table-column>
                      <el-table-column
                        show-overflow-tooltip
                        min-width="100"
                        prop="chargePrice"
                        label="单价"
                        header-align="center"
                        align="right"
                      >
                        <template slot-scope="scope">{{
                          formatNumber(scope.row.chargePrice, 4)
                        }}</template>
                      </el-table-column>
                      <el-table-column
                        show-overflow-tooltip
                        min-width="60"
                        prop="controlLevel"
                        label="级别"
                        header-align="center"
                        align="center"
                      >
                        <template slot-scope="scope">{{
                          controlLevelData[scope.row.controlLevel]
                        }}</template>
                      </el-table-column>
                      <el-table-column
                        prop="chargeQuantity"
                        label="收费数量"
                        header-align="center"
                        align="right"
                        show-overflow-tooltip
                        min-width="90"
                      >
                        <template slot-scope="scope">
                          <span :style="scope.row.chargeQuantity < 1 || scope.row.chargeQuantity > 100 ? {color:'red'}: {}">
                            {{ scope.row.chargeQuantity }}
                            <!-- <span v-if="orderItem.orderSource === '1'" :val="scope.row.chargeUnit" code="DrugUnit"
                              v-codeTransform></span> -->
                            <!-- <span v-else>{{scope.row.chargeUnit }}</span> -->
                            <span
                              :val="scope.row.chargeUnitId"
                              code="DrugUnit"
                              v-codeTransform
                            ></span>
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        show-overflow-tooltip
                        min-width="100"
                        prop="totalAmt"
                        label="总金额"
                        header-align="center"
                        align="right"
                      >
                        <template slot-scope="scope">{{
                          formatNumber(scope.row.totalAmt)
                        }}</template>
                      </el-table-column>
                      <el-table-column
                        show-overflow-tooltip
                        min-width="100"
                        prop="limitPrice"
                        label="医保限价"
                        header-align="center"
                        align="center"
                      >
                        <template slot-scope="scope">{{
                          scope.row.limitPrice
                        }}</template>
                      </el-table-column>
                      <el-table-column
                        show-overflow-tooltip
                        min-width="80"
                        prop="siItemLimitUserFlag"
                        label="标志"
                        header-align="center"
                        align="center"
                      >
                        <template slot-scope="scope">
                          {{
                            scope.row.siItemLimitUserFlag == "1"
                              ? "限制"
                              : "不限制"
                          }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        show-overflow-tooltip
                        min-width="130"
                        prop="siItemLimitUserDsp"
                        label="限制使用描述"
                        header-align="center"
                        align="center"
                      >
                        <template slot-scope="scope">{{
                          scope.row.siItemLimitUserDsp
                        }}</template>
                      </el-table-column>
                      <el-table-column
                        show-overflow-tooltip
                        min-width="100"
                        prop="remark"
                        label="审批标志"
                        header-align="center"
                      >
                        <template slot-scope="scope">{{ chargeApproveShow[scope.row.chargeApprove] }}</template>
                      </el-table-column>
                      <el-table-column
                        show-overflow-tooltip
                        min-width="100"
                        prop="remark"
                        label="备注"
                        header-align="center"
                      ></el-table-column>
                    </el-table>
                  </div>
                </l-collapse-item>
              </l-collapse>
            </div>
          </div>
        </l-collapse-item>
      </l-collapse>
    </div>
    <div class="charge-bottom height-button-bottom clearfix">
      <div class="price-amt float-left">
        金额合计：{{ formatNumber(priceAmtTotal) }}元
      </div>
      待缴费金额合计：{{ allWaitPrice }}
      <el-button
        type="primary"
        v-hotKey="{ func: 'func_submit' }"
        @click="openSubmitCharge"
        >收费</el-button
      >
    </div>
    <!-- 结算确认弹窗 -->
    <LChargeConfirm
      :charge="newLchrage"
      v-if="chargeConfirmVisible"
      :isApptointment="false"
      width="1300px"
      :visible.sync="chargeConfirmVisible"
      @cancel="chargeConfirmClose"
      @sure="chargeConfirmSure"
    ></LChargeConfirm>
    <!-- 预结算弹窗 -->
    <el-dialog
      title="收费"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="1300px"
      top="5vh"
      :before-close="close"
      :close-on-click-modal="false"
      class="l-charge-dialog"
    >
      <l-charge
        :charge="newLchrage"
        :isApptointment="false"
        @close="close"
      ></l-charge>
    </el-dialog>
    <!-- 配送地址弹框 -->
    <l-dialog
      :visible.sync="deliveryVisible"
      title="配送地址"
      width="450px"
      @confirm="saveDelive"
      @cancel="cancelDelive"
    >
      <template slot="content">
        <deliveryDia
          :deliveryFormProp="deliveryFormProp"
          :receivePatientData="receivePatientData"
          ref="deliveryDia"
          v-if="deliveryVisible"
        ></deliveryDia>
      </template>
    </l-dialog>
  </div>
</template>
<script>
import deliveryDia from "@/views/cis/prescriptionRecor/newPatientsManage/order/chinaMedicinalHerb/components/deliveryDia.vue";
import service from "@/api/appointment/outpCharge";
import appointment from "@/api/appointment/appointment";
import { getGroupFlag, getThirdUrl } from "@/api/third/third";
import {
  getPrescriptionAddress,
  addOrUpDocPrintTemplate
} from "@/api/cis/order/order";
import { blukToOutfit } from "@/utils/drugManagement";
import { deepClone } from "@/utils/index.js";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "mainNew",
  components: {
    deliveryDia
  },
  props: {
    sendData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      allWaitPrice: 0,
      controlLevelData: {
        "1": "甲",
        "2": "乙",
        "3": "丙"
      },
      activeNames: "",
      orderActiveNames: {},
      // 医嘱来源返显
      orderSourceShow: {
        "1": "处方号：",
        "4": "电子申请单号："
      },
      // 审批标志反显
      chargeApproveShow: {
        "1": "审批通过",
        "0": "审批不通过"
      },
      // 结算确认弹窗
      chargeConfirmVisible: false,
      // 预结算弹窗
      dialogVisible: false,
      checkList: [],
      newLchrage: {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      },
      tradeDetailList: [],
      rightLoading: false,
      applyChecked: "",
      priceAmtTotal: 0,
      //配送地址信息
      deliveryVisible: false,
      deliveryForm: {},
      deliveryFormProp: {},
      receivePatientData: {},
      urls: ""
    };
  },
  computed: {
    ...mapGetters("cis", ["publicHealthData"])
  },
  watch: {
    sendData: {
      deep: true,
      immediate: true,
      handler(a) {
        let val = {
          ...a
        };
        this.activeNames = "";
        this.orderActiveNames = {};
        this.receivePatientData = {};

        if (val && val.patientId) {
          this.getTableList();
          let addrCode = [];
          let address = "";
          try {
            if (val.hasOwnProperty("addressInfo") && val.addressInfo.hasOwnProperty("currentAddress")) {
              let fault = val.addressInfo.currentAddress.split(",");
            }
            if (val.hasOwnProperty("addressInfo") && val.addressInfo.hasOwnProperty("currentAddress")) {
              addrCode = JSON.parse(val.addressInfo.currentAddress);
            }
            address = val.addressInfo.currentDetail;
          } catch (error) {

          }
          this.receivePatientData = {
            ...val,
            address,
            // addrCode
            addrCode: addrCode.length
              ? addrCode.length >= 3
                ? [addrCode[0], addrCode[1], addrCode[2]]
                : addrCode
              : []
          };
        } else {
          this.tradeDetailList = [];
        }
      }
    }
  },
  async mounted() {
    let res = await getThirdUrl();
    this.urls = res.data;
  },
  /**
   * 1.查看配送地址click事件  getDelivery  获取配送地址信息并弹框展示
   * 2.配送地址弹框保存按钮click事件  saveDelive  保存当前配送地址信息
   * 3.配送地址弹框取消按钮click事件  cancelDelive  重置配送地址弹框内表单并隐藏弹框
   * 4.金额格式化函数  formatNumber  金额格式化，默认千位分隔，保留两位小数点
   * 5.获取待收费数据  getTableList
   * 6.待收费项单选框change事件  orderChange  清空其他项选中状态，并选中当前项下所有子项
   * 7.待收费子项目复选框change事件  checkboxChange  根据当前选中的收费项计算待收费金额
   * 8.收费按钮click事件  openSubmitCharge  执行收费流程
   * 9.收费框关闭回调  close  刷新待收费列表；隐藏收费框；重置收费信息
   * 10.结算确认弹框取消回调  chargeConfirmClose  隐藏结算确认弹框
   * 11.结算确认弹框确定按钮回调  chargeConfirmSure  隐藏确认弹框并弹出收费弹框，继续收费流程
   */
  methods: {
    clickTitle(index) {
      if(this.applyChecked !== index) {
        this.applyChecked = index;
        this.orderChange();
      } else {
        this.applyChecked = "";
        this.orderChange(index);
      }
    },
    clickRadio(index, e) {
      if (e.target.tagName !== "INPUT") {
        return;
      }
      if (this.applyChecked !== "") {
        this.applyChecked = "";
        this.orderChange(index);
      }
    },
    clickCkildTitle(orderItem, index) {
      if(this.applyChecked !== index) {return;}
      this.$forceUpdate();
      this.$set(orderItem, "checked", !orderItem.checked);
      this.checkboxChange(orderItem);
    },
    //zhengyawen 在挂号完成之后弹框询问，判断该患者档案完成度是否为0，跳转公卫建档界面
    recordPerfection() {
      let recordPerfection = this.publicHealthData.recordPerfection;
      if (!recordPerfection && this.publicHealthData.identificationNum) {
        this.$confirm("患者还未建立居民健康档案，是否马上去建档？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          window.open(
            this.urls +
              "?type=archives&identificationNum=" +
              this.publicHealthData.identificationNum +
              "&identificationType=" +
              this.publicHealthData.identificationType
          );
        });
      }
    },
    //zhengyawen 获取配送地址信息
    async getDelivery(tradeItem, orderItem) {
      await this.getDeliveryFunc(tradeItem, orderItem, () => {
        this.deliveryFormProp = deepClone(this.deliveryForm);
        this.deliveryVisible = true;
      });
    },
    async getDeliveryFunc(tradeItem, orderItem, fn) {
      this.deliveryForm = {};
      this.deliveryFormProp = {};
      let params = {
        visitCode: tradeItem.diagTreatActivityId,
        recipeId: orderItem.orderBillId
      };
      try {
        let res = await getPrescriptionAddress(params);
        if (res.code == 1) {
          let datas = res.data;
          //配送地址信息赋值
          if (!datas.hasOwnProperty("recipients")) {
            this.$message.error("配送地址为空");
            return;
          }
          let address = [];
          if (datas.currentAddress) {
            address =
              datas.currentAddress && datas.currentAddress.indexOf(",]") > -1
                ? JSON.parse(datas.currentAddress.split(",]")[0] + "]")
                : Array.isArray(JSON.parse(datas.currentAddress))
                ? JSON.parse(datas.currentAddress)
                : [];
          }
          this.deliveryForm = {
            ...datas,
            recipients: datas.recipients,
            phoneNumber: datas.phoneNumber,
            address,
            detail: datas.detail,
            shipmentType: datas.shipmentType,
            visitCode: tradeItem.diagTreatActivityId,
            recipeId: orderItem.orderBillId
          };
          fn && fn();
        } else {
          this.$message.error(res.msg || "配送地址为空");
        }
      } catch (e) {
        console.log(e);
      }
    },
    saveDelive() {
      let deliveryDia = this.$refs.deliveryDia;
      deliveryDia &&
        deliveryDia.$refs.deliveryForm.validate(async valid => {
          if (valid) {
            let form = deliveryDia ? deliveryDia.deliveryForm : {};
            await this.saveDeliveFunc(form);
            this.deliveryForm = deepClone(form);
            deliveryDia.$refs.deliveryForm.resetFields();
            this.deliveryVisible = false;
          }
        });
    },
    async saveDeliveFunc(form) {
      let params = {
        id: form.id,
        visitCode: form.visitCode,
        recipeId: form.recipeId,
        provinceCode: form.address[0],
        provinceName: "",
        phoneNumber: form.phoneNumber,
        recipients: form.recipients,
        cityCode: form.address.length >= 2 ? form.address[1] : "",
        cityName: "",
        regionCode: form.address.length >= 3 ? form.address[2] : "",
        regionName: "",
        detail: form.detail,
        dataVersion: form.dataVersion,
        shipmentType: form.shipmentType
      };
      try {
        let res = await addOrUpDocPrintTemplate(params);
        if (res.code == "1") {
          this.$message.success("保存成功");
          this.deliveryVisible = false;
          this.getTableList();
          //保存成功
          // await this.getDeliveryFunc({diagTreatActivityId: form.visitCode},{orderBillId: form.recipeId},()=>{});
        } else {
          this.$message.error(res.msg || "保存失败");
        }
      } catch (e) {
        this.$message.error(e.msg || "保存失败");
      }
    },
    cancelDelive() {
      let deliveryDia = this.$refs.deliveryDia;
      this.deliveryFormProp = deepClone(this.deliveryForm);
      deliveryDia.$refs.deliveryForm.resetFields();
      this.deliveryVisible = false;
    },
    // 金额格式化，千位分割，小数点2位
    formatNumber(a, num = 2) {
      if (!a) {
        return "0.0000";
      }
      let res = a
        .toFixed(num)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    getTableList() {
      if (!this.sendData.patientId) {
        this.$message.warning("请选择一个患者!");
        return;
      }
      let allWaitPrice = 0;
      this.rightLoading = true;
      this.applyChecked = "";
      this.tradeDetailList = [];
      service
        .getlistWaitChargeDetail({
          patientId: this.sendData.patientId,
          diagStartDate: this.sendData.date[0] + " 00:00:00",
          diagEndDate: this.sendData.date[1] + " 23:59:59"
        })
        .then(res => {
          if (res.code === 1) {
            this.tradeDetailList = res.data || [];
            this.tradeDetailList.forEach(item1 => {
              item1.outpWaitingSettleOrderVOS.forEach(item2 => {
                allWaitPrice += item2.totalAmt;
              });
            });
            //默认展开
            this.activeNames = [];
            this.orderActiveNames = [];
            this.tradeDetailList.forEach((item, index) => {
              this.activeNames.push(index);
              this.orderActiveNames.push([]);
              item.outpWaitingSettleOrderVOS &&
                item.outpWaitingSettleOrderVOS.forEach((item2, index2) => {
                  if (item2.pharmacyExecFlag == "1") {
                    this.orderActiveNames[index].push(index2);
                  }
                });
            });
            this.$emit("allWaitPrice", allWaitPrice);
            this.allWaitPrice = this.formatNumber(allWaitPrice) + "元";
          } else {
            this.$message.error(res.msg || "获取待收费明细失败");
          }
          this.rightLoading = false;
        })
        .catch(err => {
          this.rightLoading = false;
          this.$message.error(err.msg || "获取待收费明细失败");
        });
    },
    orderChange(index) {
      if (this.applyChecked === "") {
        // 当前选中条目下所有项目默认不选中
        this.tradeDetailList[index].outpWaitingSettleOrderVOS.forEach(
          item => {
            item.checked = false;
          }
        );
        return;
      }
      if (!this.tradeDetailList[this.applyChecked].diagTreatActivityId) {
        return;
      }
      const listIndex = this.tradeDetailList.findIndex(
        (item, index) => index === this.applyChecked
      );
      // 1.清空所有收费项目的选中状态
      this.tradeDetailList.forEach(item1 => {
        item1.outpWaitingSettleOrderVOS.forEach(item2 => {
          item2.checked = false;
        });
      });
      // 2.当前选中条目下所有项目默认选中
      this.tradeDetailList[this.applyChecked].outpWaitingSettleOrderVOS.forEach(
        item => {
          item.checked = true;
        }
      );
      //
      if (listIndex > -1) {
        const list = this.tradeDetailList[
          listIndex
        ].outpWaitingSettleOrderVOS.filter(item => item.checked);
        console.log(list);
        this.priceAmtTotal = list.reduce((total, cur) => {
          return (total * 10000 + cur.totalAmt * 10000) / 10000;
        }, 0);
      } else {
        this.priceAmtTotal = 0;
      }
      this.$forceUpdate();
    },
    checkboxChange(orderItem) {
      let orderVOSChecked = this.tradeDetailList[this.applyChecked].outpWaitingSettleOrderVOS;
      // 电子申请单号一样的联动选择
      if (orderItem.hasOwnProperty("orderBillNum") && orderItem.orderBillNum) {
        for(let i in orderVOSChecked) {
          if(orderVOSChecked[i].hasOwnProperty("orderBillNum") && orderVOSChecked[i].orderBillNum == orderItem.orderBillNum && orderVOSChecked[i].checked != orderItem.checked) {
            this.$set(orderVOSChecked[i], "checked", orderItem.checked);
          }
        }
      }
      if (orderItem.hasOwnProperty("relOrderChargeDetailId") && orderItem.relOrderChargeDetailId) {
        for(let i in orderVOSChecked) {
          if(orderVOSChecked[i].hasOwnProperty("relOrderChargeDetailId") && orderVOSChecked[i].relOrderChargeDetailId == orderItem.relOrderChargeDetailId && orderVOSChecked[i].checked != orderItem.checked) {
            this.$set(orderVOSChecked[i], "checked", orderItem.checked);
          }
        }
      }
      const list = orderVOSChecked.filter(item => item.checked);
      console.log(list);
      this.priceAmtTotal = list.reduce((total, cur) => {
        return (total * 10000 + cur.totalAmt * 10000) / 10000;
      }, 0);
      this.$forceUpdate();
    },
    // 打开预结算弹窗
    openSubmitCharge() {
      // 筛选选中的收费明细
      const item = this.tradeDetailList.find(
        (item, index) => index === this.applyChecked
      );
      if (!item) {
        this.$message("请选择收费交易");
        return;
      }
      const list = item.outpWaitingSettleOrderVOS
        .filter(item => item.checked)
        .map(item => ({
          ...item,
          outpChargeDetailVO2s: item.outpWaitingSettleChargeItemVOS
        }));
      if (list.length === 0) {
        this.$message("请选择收费项目");
        return;
      }
      this.newLchrage.chargePrescriptions = list;
      this.newLchrage.appointment = item;
      this.chargeConfirmVisible = true;
      // this.dialogVisible = true;
    },
    close(val) {
      if (val && val.refresh) {
        this.activeNames = "";
        this.orderActiveNames = {};
        // this.getTableList();
        this.$emit("updatePatientList", this.sendData.patientCode);
        this.recordPerfection();
      }
      this.dialogVisible = false;
      this.newLchrage = {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      };
    },
    chargeConfirmClose() {
      this.chargeConfirmVisible = false;
    },
    chargeConfirmSure(data) {
      this.newLchrage.confirmInfo = data;
      this.chargeConfirmVisible = false;
      this.$nextTick(() => {
        this.dialogVisible = true;
      });
    },
    stopStretch(e) {
      e.stopPropagation();
    },
  }
};
</script>
<style lang="scss" scoped>
.outpcharge-main {
  position: relative;
  background: #fff;
  padding: 20px;
  /deep/.el-radio__label {
    color: #2e323a;
    font-weight: 700;
  }
  /deep/.el-checkbox__label {
    color: #2e323a;
    font-weight: 700;
  }
  /deep/.el-radio__input.is-checked + .el-radio__label {
    color: #2B4583;
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
    color: #2B4583;
  }
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

.align-center {
  text-align: center;
}

.align-right {
  text-align: right;
}

.cols {
  height: 100%;
  overflow-y: auto;

  /deep/ .collapse-transition {
    -webkit-transition: 0s height, 0s padding-top, 0s padding-bottom;
    transition: 0s height, 0s padding-top, 0s padding-bottom;
  }

  /deep/ .horizontal-collapse-transition {
    -webkit-transition: 0s width, 0s padding-left, 0s padding-right;
    transition: 0s width, 0s padding-left, 0s padding-right;
  }

  /deep/
    .horizontal-collapse-transition
    .el-submenu__title
    .el-submenu__icon-arrow {
    -webkit-transition: 0s;
    transition: 0s;
    opacity: 0;
  }
}

.no-data {
  position: absolute;
  top: 25px;
  left: 20px;
  right: 20px;
  line-height: 30px;
  text-align: center;
}

.page {
  .pagination-container {
    padding: 20px 0;

    /deep/ .el-pagination__editor.el-input .el-input__inner {
      height: 100% !important;
    }
  }
}

.margin-top-10 {
  margin-top: 10px;
}

.over-txt {
  padding-left: 10px;

  .el-col,
  .el-radio {
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  .el-radio {
    width: 100%;
  }
}

.margin-right20 {
  margin-right: 20px;
}

.row-h-h {
  /deep/ .el-col {
    height: 40px;
  }
  /deep/ .el-checkbox {
    width: 100%;
  }
  /deep/ .el-checkbox__input {
    vertical-align: inherit;
  }
  /deep/ .el-checkbox__label {
    width: calc(100% - 35px);
    display: inline-block;
    text-overflow: ellipsis;
    overflow-x: hidden;
    white-space: nowrap;
    cursor: pointer;
  }
  /deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #767779;
  }
}

.source-tit {
  display: inline-block;
  // width: 115px;
}

.over-txt-cont {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.l-charge-dialog{
  >>> .el-dialog {
    height: 90%;
  }

  >>> .el-dialog__body {
    height: calc(100% - 54px);
  }
}
</style>
