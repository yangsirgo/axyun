<template>
  <div
    class="height100 padding16"
    style="display: flex; flex-direction: column"
  >
    <div class="patientInfo">
      <div style="height: 40px">
        <div class="title fl">
          <i></i>
          <b>患者信息</b>
        </div>
        <div class="fr">
          <el-button
            type="primary"
            @click="printDataFuc"
            :disabled="
              sendData.settlementType == 1 || sendData.recordStatus != 1
            "
            >医保结算明细打印</el-button
          >
          <el-button type="primary" @click="inpPrepayDetailShow"
            >预交金信息</el-button
          >
          <el-button @click="inpChargeCollectShow('1')">费用清单</el-button>
          <el-button @click="inpChargeCollectShow('2')">费用汇总</el-button>
        </div>
      </div>
      <div>
        <el-form
          style="display: flex; flex-wrap: wrap"
          label-position="right"
          label-width="100px"
          :model="sendData"
        >
          <el-form-item label="建床时间">
            <span>{{ sendData.wdeptAdmissionTime }}</span>
          </el-form-item>
          <el-form-item label="撤床时间">
            <span>{{ sendData.wdeptDischargeTime }}</span>
          </el-form-item>
          <el-form-item label="结算时间">
            <span>{{ sendData.settlementTime }}</span>
          </el-form-item>
          <el-form-item label="住院天数">
            <span>{{ sendData.inpDays }}</span>
          </el-form-item>
          <el-form-item label="在院状态">
            <span
              v-if="sendData.tabStatus != 4"
              :val="sendData.recordStatus"
              code="InpStatus"
              v-codeTransform
            ></span>
            <span v-else>
              <span v-if="sendData.recordStatus == 1">财务出院</span>
              <span v-if="sendData.recordStatus == 2">撤销财务出院</span>
              <span v-if="sendData.recordStatus == 9">回归</span>
            </span>
          </el-form-item>
          <el-form-item label="总预交款">
            <span>{{ formatNumber(sendData.selfPayPrepay) }}</span>
          </el-form-item>
          <el-form-item label="预交款余额">
            <span>{{ formatNumber(sendData.prepayBalance) }}</span>
          </el-form-item>
          <el-form-item label="可透支金额">
            <span>{{ formatNumber(sendData.selfPayOverdrawAmount) }}</span>
          </el-form-item>
          <el-form-item label="结算金额">
            <span>{{ formatNumber(sendData.settleAmount) }}</span>
          </el-form-item>
          <el-form-item label="医疗总金额">
            <span>{{
              formatNumber(
                sendData.selfPayAmount +
                  sendData.freePayAmount +
                  sendData.derateAmount
              )
            }}</span>
          </el-form-item>
          <el-form-item label="自付金额">
            <span>{{ formatNumber(sendData.selfPayAmount) }}</span>
          </el-form-item>
          <el-form-item label="记账金额">
            <span>{{ formatNumber(sendData.freePayAmount) }}</span>
          </el-form-item>
          <el-form-item label="减免金额">
            <span>{{ formatNumber(sendData.derateAmount) }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="flex: 1">
      <div style="height: 40px">
        <div class="title fl">
          <i></i>
          <b>费用信息</b>
        </div>
        <div class="fr">
          <el-button
            type="primary"
            :disabled="
              sendData.recordStatus !== '3' || sendData.tabStatus == '4'
            "
            @click="isCheckShow"
            >结算</el-button
          >
          <el-button
            @click="confirm"
            :disabled="
              (sendData.recordStatus !== '1' && sendData.tabStatus == '4') ||
              (sendData.tabStatus != '4' && sendData.recordStatus !== '4')
            "
            >出院召回</el-button
          >
          <el-button
            @click="logoutIn"
            :disabled="
              (sendData.recordStatus !== '1' &&
                sendData.recordStatus !== '3') ||
              sendData.tabStatus == '4'
            "
            >注销入院</el-button
          >
        </div>
      </div>
      <div class="tableArea" style="display: flex">
        <el-table :data="tableData1" border style="width: 33%">
          <el-table-column
            prop="typeName"
            label="费用类型"
            min-width="100"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            prop="chargeAmount"
            label="费用金额"
            min-width="100"
            header-align="center"
            align="right"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row["chargeAmount"] &&
                scope.row["chargeAmount"].toFixed(2)
              }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableData2" border style="width: 33%">
          <el-table-column
            prop="typeName"
            label="费用类型"
            min-width="100"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            prop="chargeAmount"
            label="费用金额"
            min-width="100"
            header-align="center"
            align="right"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row["chargeAmount"] &&
                scope.row["chargeAmount"].toFixed(2)
              }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableData3" border style="width: 33%">
          <el-table-column
            prop="typeName"
            label="费用类型"
            min-width="100"
            header-align="center"
          >
          </el-table-column>
          <el-table-column
            prop="chargeAmount"
            label="费用金额"
            min-width="100"
            header-align="center"
            align="right"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row["chargeAmount"] &&
                scope.row["chargeAmount"].toFixed(2)
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="预交金信息"
      :visible.sync="inpPrepayDetailVisiable"
      width="80%"
    >
      <div style="height: 650px">
        <inpPrepayDetail :userInfo="userInfoData"></inpPrepayDetail>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="inpPrepayDetailVisiable = false">取 消</el-button>
        <el-button type="primary" @click="inpPrepayDetailVisiable = false">确 定</el-button>
      </span> -->
    </el-dialog>
    <el-dialog
      v-if="inpChargeCollectVisiable"
      :title="this.flag == '1' ? '费用清单' : '费用汇总'"
      :visible.sync="inpChargeCollectVisiable"
      width="1200px"
    >
      <div>
        <inpChargeCollect :reportData="reportData"></inpChargeCollect>
      </div>
      <!--<span slot="footer" class="dialog-footer">
        <el-button @click="inpChargeCollectVisiable = false">取 消</el-button>
        <el-button type="primary" @click="inpChargeCollectVisiable = false">关 闭</el-button>
      </span>-->
    </el-dialog>
    <el-dialog
      title="结算"
      :visible.sync="checkShow"
      width="900px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @before-close="checkShowClose"
    >
      <div class="checkShow-cont">
        <div style="position: absolute; right: 20px; top: 16px">
          <span style="font-size: 16px; font-weight: bold">下一张票据号</span>
          <span
            style="
              font-size: 16px;
              font-weight: bold;
              color: rgb(240, 90, 35);
              margin-right: 16px;
              display: inline-block;
              min-width: 80px;
            "
            v-loading="btuLoading"
            >{{ nextReceiptNumOutPO.receiptNum || "无" }}</span
          >
          <el-button type="primary" size="mini" @click="jumpNum"
            >跳号</el-button
          >
          <el-button type="primary" size="mini" @click="getNextReceiptNum"
            >刷新</el-button
          >
          <el-button type="primary" size="mini" @click="billsUse"
            >票据启用</el-button
          >
        </div>
        <l-card-title>
          <template slot="left">患者信息</template>
        </l-card-title>
        <el-row :gutter="20" class="padding16">
          <el-col :span="6">家庭病床号：{{ sendData["inpCode"] }}</el-col>
          <el-col :span="6">姓名：{{ sendData["patientName"] }}</el-col>
          <el-col :span="6"
            >结算类型：
            <span
              :val="sendData['settlementType'] || ''"
              code="settlementType"
              v-codeTransform
            ></span>
          </el-col>
          <!-- <el-col :span="6">病区：
            <span tableName="sys_ward" :conditionMap="{ward_code:sendData['wardId'] || ''}" columns="ward_name"
              v-tableTransform></span>
          </el-col> -->
        </el-row>
        <l-card-title>
          <template slot="left">费用信息</template>
        </l-card-title>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-row>
              <el-col :span="24"
                ><span class="charge-name">总费用：</span>
                <span
                  class="charge-num"
                  v-if="preSettleData.totalMedicalAmount"
                  >{{
                    preSettleData.totalMedicalAmount.toFixed(2) || "0.00"
                  }}</span
                >
                <span class="charge-num" v-else>0.00</span>
              </el-col>
              <el-col :span="24"
                ><span class="charge-name">记账金额：</span>
                <span class="charge-num" v-if="preSettleData.freePayAmount">{{
                  preSettleData.freePayAmount.toFixed(2) || "0.00"
                }}</span>
                <span class="charge-num" v-else>0.00</span>
              </el-col>
              <el-col :span="24"
                ><span class="charge-name">减免金额：</span>
                <span class="charge-num" v-if="preSettleData.deratePayAmount">{{
                  preSettleData.deratePayAmount.toFixed(2) || "0.00"
                }}</span>
                <span class="charge-num" v-else>0.00</span>
              </el-col>
              <el-col :span="24"
                ><span class="charge-name">自付金额：</span>
                <span class="charge-num" v-if="preSettleData.selfPayAmount">{{
                  preSettleData.selfPayAmount.toFixed(2) || "0.00"
                }}</span>
                <span class="charge-num" v-else>0.00</span>
              </el-col>
              <el-col :span="24"
                ><span class="charge-name">总预交金：</span>
                <span
                  class="charge-num"
                  v-if="preSettleData.totalPrepayAmount"
                  >{{
                    preSettleData.totalPrepayAmount.toFixed(2) || "0.00"
                  }}</span
                >
                <span class="charge-num" v-else>0.00</span>
              </el-col>
              <el-col :span="24"
                ><span class="charge-name">预交金余额：</span>
                <span class="charge-num" v-if="preSettleData.prepayBalance">{{
                  preSettleData.prepayBalance.toFixed(2) || "0.00"
                }}</span>
                <span class="charge-num" v-else>0.00</span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="14">
            <div class="charge-right">
              <div style="font-size: 16px; font-weight: bold">记账金额明细</div>
              <div
                v-for="(item, index) in preSettleData.siTradeAmtDetailDtos"
                :key="index"
              >
                <!-- <span class="charge-name" v-if="item.tradeAmtName">{{ item.tradeAmtName }}：</span> -->
                <span class="charge-name" v-if="item.tradeAmtCode"
                  >{{
                    transformNew("fund_pay_type", item.tradeAmtCode)
                  }}：</span
                >
                <span class="charge-num" v-if="item.tradeAmt">{{
                  item.tradeAmt.toFixed(2) || "0.00"
                }}</span>
                <span class="charge-num" v-else>0.00</span>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-form :model="formDatas" :rules="rules1" ref="formDatas">
          <div v-if="preSettleData.prepayBalance < 0">
            <el-row :gutter="20" style="margin-top: 20px; padding: 0 20px">
              <el-col :span="6">
                <el-form-item label prop="realMoney1">
                  <l-formt-title
                    label="补缴"
                    :disabled="preSettleData.prepayBalance >= 0"
                  >
                    <el-input
                      v-model="formDatas.realMoney1"
                      :disabled="preSettleData.prepayBalance >= 0"
                      placeholder=""
                      clearable
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label prop="payType1">
                  <l-formt-title
                    label="付款方式"
                    :disabled="preSettleData.prepayBalance >= 0"
                  >
                    <!-- <l-value-domain
                      clearable
                      remoteUrl="/finance-pub/payType/getPayTypeByAuth?businessCode=05"
                      type="select"
                      remoteShowKey="payTypeName"
                      remoteValueKey="payTypeId"
                      :value.sync="formDatas.payType1"
                      :disabled="preSettleData.prepayBalance >= 0"
                      placeholder="请选择"
                      @change="payTypeChange1"
                    ></l-value-domain> -->
                    <el-select
                      v-model="formDatas.payType1"
                      placeholder="请选择"
                      :disabled="preSettleData.prepayBalance >= 0"
                      @change="payTypeChange11"
                    >
                      <el-option
                        v-for="item in PayTypeOptions"
                        :key="item.payTypeId"
                        :label="item.payTypeName"
                        :value="item.payTypeId"
                      >
                      </el-option>
                    </el-select>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-else-if="preSettleData.prepayBalance > 0">
            <el-row :gutter="20" style="margin-top: 20px; padding: 0 20px">
              <el-col :span="6">
                <el-form-item label prop="realMoney3">
                  <l-formt-title
                    label="找还"
                    :disabled="preSettleData.prepayBalance < 0"
                  >
                    <el-input
                      v-model="formDatas.realMoney3"
                      :disabled="preSettleData.prepayBalance < 0"
                      placeholder=""
                      clearable
                    ></el-input>
                  </l-formt-title>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label prop="payType3">
                  <l-formt-title
                    label="付款方式"
                    :disabled="preSettleData.prepayBalance < 0"
                  >
                    <!-- <l-value-domain
                      clearable
                      remoteUrl="/finance-pub/payType/getPayTypeByAuth?businessCode=05"
                      type="select"
                      remoteShowKey="payTypeName"
                      remoteValueKey="payTypeId"
                      :value.sync="formDatas.payType3"
                      :disabled="preSettleData.prepayBalance < 0"
                      placeholder="请选择"
                      @change="payTypeChange3"
                    ></l-value-domain> -->
                    <el-select
                      v-model="formDatas.payType3"
                      placeholder="请选择"
                      :disabled="preSettleData.prepayBalance < 0"
                      @change="payTypeChange33"
                    >
                      <el-option
                        v-for="item in PayTypeOptions"
                        :key="item.payTypeId"
                        :label="item.payTypeName"
                        :value="item.payTypeId"
                      >
                      </el-option>
                    </el-select>
                  </l-formt-title>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--预交弹窗 弹窗  start preSettleData.prepayBalance < 0   -->
          <inHosPrePayDialog
            :visible.sync="modelVisible"
            v-if="modelVisible"
            width="552px"
            title="住院预交"
            :patientInfo="sendData"
            :nextReceiptNumOutPO="nextReceiptNumOutPO"
            :payTypeData="payTypeData"
            :payTypeobj="payTypeobj"
            @jumpNum="jumpNum"
            @getNextReceiptNum="getNextReceiptNum"
            @confirm="conserve"
            @cancel="huidanClose"
          ></inHosPrePayDialog>
          <!--预交弹窗 弹窗  start preSettleData.prepayBalance < 0   -->

          <!-- 退回弹窗 弹窗  start preSettleData.prepayBalance > 0 -->
          <inHosPreReturnDialog
            ref="inHosPreReturnDialog"
            :visible.sync="modelVisibleReturn"
            v-if="modelVisibleReturn"
            width="70%"
            title="住院退款"
            :patientInfo="sendData"
            :nextReceiptNumOutPO="nextReceiptNumOutPO"
            :payTypeData="payTypeData"
            :payTypeobj="payTypeobj"
            @jumpNum="jumpNum"
            @getNextReceiptNum="getNextReceiptNum"
            @confirm="conserveReturn"
            @cancel="huidanCloseReturn"
          ></inHosPreReturnDialog>
          <!-- 退回弹窗 弹窗  start preSettleData.prepayBalance > 0 -->

          <el-row
            :gutter="20"
            style="margin-top: 15px; padding: 0 20px"
            v-if="
              formDatas.payType1 == '7' ||
              formDatas.payType2 == '7' ||
              formDatas.payType3 == '7' ||
              formDatas.payType4 == '7'
            "
          >
            <el-col :span="6">
              <l-formt-title
                label="票号"
                :disabled="preSettleData.prepayBalance < 0"
              >
                <el-form-item label prop="checkNum">
                  <el-input
                    v-model="formDatas.checkNum"
                    :disabled="preSettleData.prepayBalance < 0"
                    placeholder=""
                    clearable
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
            <el-col :span="6">
              <l-formt-title
                label="银行名称"
                :disabled="preSettleData.prepayBalance < 0"
              >
                <el-form-item label prop="bankName">
                  <el-input
                    v-model="formDatas.bankName"
                    :disabled="preSettleData.prepayBalance < 0"
                    placeholder=""
                    clearable
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
            <el-col :span="6">
              <l-formt-title
                label="开户行"
                :disabled="preSettleData.prepayBalance < 0"
              >
                <el-form-item label prop="depositBank">
                  <el-input
                    v-model="formDatas.depositBank"
                    :disabled="preSettleData.prepayBalance < 0"
                    placeholder=""
                    clearable
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
            <el-col :span="6">
              <l-formt-title
                label="银行账号"
                :disabled="preSettleData.prepayBalance < 0"
              >
                <el-form-item label prop="bankAccount">
                  <el-input
                    v-model="formDatas.bankAccount"
                    :disabled="preSettleData.prepayBalance < 0"
                    placeholder=""
                    clearable
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width: 80px"
          type="primary"
          :loading="checkConfirmLoading"
          @click="checkConfirm"
          >结算
        </el-button>
        <el-button style="width: 80px" type="primary" plain @click="checkCancel"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :append-to-body="true"
      title="票据启用"
      :visible.sync="dialogVisible"
      width="1500px"
      :before-close="getNextReceiptNum"
    >
      <div class="width100 padding10">
        <useSelect :inBillForm="inBillForm" style="height: 600px"></useSelect>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import inpPrepayDetail from "@/views/finance/inp/inpPrepayDetail/index.vue";
import inpChargeCollect from "@/views/finance/inp/report/components/inpChargeCollect.vue";
import inHosPrePayDialog from "@/views/finance/inp/inpPrepay/components/inHosPrePayDialog.vue";
import inHosPreReturnDialog from "@/views/finance/inp/inpPrepay/components/inHosPreReturnDialog.vue";
import printService from "@/api/cis/receiptPrint/receiptPrint";
import detailsUploadService from "@/api/medicalInsurance/detailsUpload";
import { deepClone } from "@/utils/index.js";

import { getMacLoaction } from "@/utils/print";
import {
  getOverPay,
  getItemDetails,
  getTotalItemDetails,
  postCharge,
  getPreSettle,
  recallPatient,
  backPatient,
  logoutIn,
  validReceiptInfo,
} from "@/api/ipnw/leaveHos";
import useSelect from "@/views/finance/receiptManager/components/useSelect";
import {
  getLeftTableData,
  receiptPrint,
  getReceiptContent,
  reReceiptPrint,
  getPayTypeByAuth,
} from "@/api/systemManagement/inBIlls/inBills";
import { print, getPrinterList } from "@/utils/print_new";
import { getPrintTpl } from "@/api/admin/print/print";
import { createData } from "@/printTemplete/module/inpFinanceLodopTpl.js";
import codes from "@/printTemplete/code.js";
import {
  siChargeTpl,
  handleData,
} from "@//printTemplete/module/siChargeTpl.js";
import { settleCostFind } from "@/api/medicalInsuranceNew/siChargeTpl.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";

export default {
  mixins: [getDictInfoNew],
  props: {
    sendData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    sendData: function (val) {
      console.log(val);
      this.getTotalItemDetails();
      this.reportData = {
        ...val,
        flag: this.flag, // 1 住院费用日清单报表 2 住院费用汇总
      };
      this.userInfoData = {
        ...val,
      };
    },
  },
  components: {
    inpPrepayDetail,
    inpChargeCollect,
    inHosPrePayDialog,
    inHosPreReturnDialog,
    useSelect,
  },
  data() {
    //验证规则
    // eslint-disable-next-line no-unreachable
    var validatePass = (rule, value, callback) => {
      // 验证
      let rule1 = /^(\d*)(\d*)(\.\d{1,2})?$/;
      if (rule1.test(this.formData.realMoney) === false) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (
        this.formData.realMoney &&
        this.formData.realMoney.indexOf(".") == 0
      ) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (this.formData.realMoney.toString().length > 10) {
        this.backMoney = 0;
        callback(new Error("只能输入十位数字!"));
      } else if (
        this.formData.realMoney <
        0 - this.preSettleData.prepayBalance
      ) {
        this.backMoney = 0;
        callback(new Error("金额不足!"));
      } else if (
        this.formData.realMoney >
        0 - this.preSettleData.prepayBalance
      ) {
        this.backMoney =
          this.formData.realMoney - (0 - this.preSettleData.prepayBalance) || 0;
        if (this.formData.realMoney == 0) {
          this.backMoney = 0;
        }
        callback();
      } else {
        this.backMoney = 0;
        callback();
      }
    };
    var validatePass1 = (rule, value, callback) => {
      let rule1 = /^(\d*)(\d*)(\.\d{1,2})?$/;
      let realMoney1 = this.formDatas.realMoney1 || 0;
      if (rule1.test(value) === false) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (value && value.toString().indexOf(".") == 0) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (value.toString().length > 10) {
        callback(new Error("只能输入十位数字!"));
      } else if (Number(realMoney1) < 0 - this.preSettleData.prepayBalance) {
        callback(new Error("金额不足!"));
      } else if (Number(realMoney1) > 0 - this.preSettleData.prepayBalance) {
        callback(new Error("补缴金额不能大于应付金额!"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      let rule1 = /^(\d*)(\d*)(\.\d{1,2})?$/;
      let realMoney2 = this.formDatas.realMoney2 || 0;
      if (rule1.test(value) === false) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (value && value.toString().indexOf(".") == 0) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (value.toString().length > 10) {
        callback(new Error("只能输入十位数字!"));
      } else if (Number(realMoney2) < 0 - this.preSettleData.prepayBalance) {
        callback(new Error("金额不足!"));
      } else if (Number(realMoney2) > 0 - this.preSettleData.prepayBalance) {
        callback(new Error("补缴金额不能大于应付金额!"));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      let rule1 = /^(\d*)(\d*)(\.\d{1,2})?$/;
      let realMoney3 = this.formDatas.realMoney3 || 0;
      if (rule1.test(value) === false) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (value && value.toString().indexOf(".") == 0) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (value.toString().length > 10) {
        callback(new Error("只能输入十位数字!"));
      } else if (Number(realMoney3) < this.preSettleData.prepayBalance) {
        callback(new Error("找还金额不能小于预交金余额!"));
      } else if (Number(realMoney3) > this.preSettleData.prepayBalance) {
        callback(new Error("找还金额不能大于预交金余额!"));
      } else {
        callback();
      }
    };
    var validatePass4 = (rule, value, callback) => {
      let rule1 = /^(\d*)(\d*)(\.\d{1,2})?$/;
      let realMoney4 = this.formDatas.realMoney4 || 0;
      if (rule1.test(value) === false) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (value && value.toString().indexOf(".") == 0) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (value.toString().length > 10) {
        callback(new Error("只能输入十位数字!"));
      } else if (Number(realMoney4) < this.preSettleData.prepayBalance) {
        callback(new Error("找还金额不能小于预交金余额!"));
      } else if (Number(realMoney4) > this.preSettleData.prepayBalance) {
        callback(new Error("找还金额不能大于预交金余额!"));
      } else {
        callback();
      }
    };
    var validatePass11 = (rule, value, callback) => {
      let payType2 = this.formDatas.payType2;
      if (payType2 === value) {
        callback(new Error("两种支付方式不可以相同"));
      } else {
        callback();
      }
    };
    var validatePass22 = (rule, value, callback) => {
      let payType1 = this.formDatas.payType1;
      if (payType1 === value) {
        callback(new Error("两种支付方式不可以相同"));
      } else {
        callback();
      }
    };
    var validatePass33 = (rule, value, callback) => {
      let payType4 = this.formDatas.payType4;
      if (payType4 === value) {
        callback(new Error("两种支付方式不可以相同"));
      } else {
        callback();
      }
    };
    var validatePass44 = (rule, value, callback) => {
      let payType3 = this.formDatas.payType3;
      if (payType3 === value) {
        callback(new Error("两种支付方式不可以相同"));
      } else {
        callback();
      }
    };
    var validateCheckNum = (rule, value, callback) => {
      if (
        this.formDatas.payType1 == "7" ||
        this.formDatas.payType2 == "7" ||
        this.formDatas.payType3 == "7" ||
        this.formDatas.payType4 == "7"
      ) {
        if (value === "" || value === undefined || value === null) {
          callback(new Error("不能为空"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      PayTypeOptions: [],
      // 2020/11/5  10:50 new add  field
      modelVisible: false, //预缴弹窗
      modelVisibleReturn: false, //退费弹窗
      nextReceiptNumOutPO: {}, //下一张票据
      currentMac: "",
      // 支付 方式
      payTypeData: "",
      // 返现金额
      payTypeobj: "",
      // 2020/11/5  10:50 new add field
      flag: "1",
      userInfoData: {},
      reportData: {},
      inpPrepayDetailVisiable: false, //预交金弹窗显示
      inpChargeCollectVisiable: false, //费用清单弹窗显示
      tableData: [],
      tableData1: [],
      tableData2: [],
      tableData3: [],
      checkShow: false,
      formDatas: {
        realMoney1: "",
        realMoney2: "",
        realMoney3: "",
        realMoney4: "",
      },
      rules: {
        realMoney: [
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        payType: [
          {
            required: true,
            message: "请选择支付方式",
            trigger: "blur",
          },
        ],
      },
      rules1: {
        realMoney1: [
          {
            validator: validatePass1,
            trigger: "blur",
          },
        ],
        realMoney2: [
          {
            validator: validatePass2,
            trigger: "blur",
          },
        ],
        realMoney3: [
          {
            validator: validatePass3,
            trigger: "blur",
          },
        ],
        realMoney4: [
          {
            validator: validatePass4,
            trigger: "blur",
          },
        ],
        payType1: [
          {
            required: true,
            message: "请选择支付方式",
            trigger: "change",
          },
          {
            validator: validatePass11,
            trigger: "change",
          },
        ],
        payType2: [
          {
            required: true,
            message: "请选择支付方式",
            trigger: "change",
          },
          {
            validator: validatePass22,
            trigger: "change",
          },
        ],
        payType3: [
          {
            required: true,
            message: "请选择支付方式",
            trigger: "change",
          },
          {
            validator: validatePass33,
            trigger: "change",
          },
        ],
        payType4: [
          {
            required: true,
            message: "请选择支付方式",
            trigger: "change",
          },
          {
            validator: validatePass44,
            trigger: "change",
          },
        ],
        checkNum: [
          {
            validator: validateCheckNum,
            trigger: "blur",
          },
        ],
        bankName: [
          {
            validator: validateCheckNum,
            trigger: "blur",
          },
        ],
        depositBank: [
          {
            validator: validateCheckNum,
            trigger: "blur",
          },
        ],
        bankAccount: [
          {
            validator: validateCheckNum,
            trigger: "blur",
          },
        ],
      },
      // 预结算对象
      preSettleData: {
        totalMedicalAmount: 0, // 医疗总费用
        freePayAmount: 0, // 记账金额
        selfPayAmount: 0, // 自付金额
        totalPrepayAmount: 0, // 总自付预交款
        prepayBalance: 0, // 余额 note: < 0, 补交 ; >0 找还
      },
      payChannelCode: "", //当前计算渠道
      //票据启用
      dialogVisible: false,
      inBillForm: {
        outType: "1", //出库类型
        receiveUserId: "", //领用人员
        receiptType: "1", //票据类型
        abortStatus: "0", //终止标识
      },
      // 新功能-收费成功自动打印
      // 本机主MAC地址
      receiptContent: {}, //打印数据
      btuLoading: false, //票号loading
      checkConfirmLoading: false, //结算按钮loading
    };
  },
  mounted() {
    this.getPayTypeOptions();
    this.getTotalItemDetails();
  },
  methods: {
    async getPayTypeOptions() {
      let res = await getPayTypeByAuth({
        businessCode: "05",
      });
      this.PayTypeOptions = res.data;
    },
    // 新添加代码  2020-11-15
    // 退费
    conserveReturn() {
      // this.printReceipt();
      this.modelVisibleReturn = false;
      this.$root.$emit("PatientListHospitalRefresh");
      this.getPreSettle();
    },
    huidanCloseReturn() {
      this.modelVisibleReturn = false;
    },
    // 预缴弹窗
    conserve() {
      // this.printReceipt();
      this.modelVisible = false;
      this.$root.$emit("PatientListHospitalRefresh");
      this.getPreSettle();
    },
    huidanClose() {
      this.modelVisible = false;
    },
    // 获取下一张票据号
    async getNextReceiptNum(done) {
      try {
        this.nextReceiptNumOutPO = {};
        this.btuLoading = true;
        if (!this.currentMac) {
          let mac = { value: "" };
          getMacLoaction(mac)
            .then(async (res2) => {
              this.currentMac = res2;
              let res = await printService.getNextReceiptNum({
                receiptType: "1", // 住院预缴款
                useMacLoaction: this.currentMac || undefined,
              });
              if (!res.data) {
                this.btuLoading = false;
                this.$message("未找到当前登录人的领用票据信息");
                return;
              }
              this.btuLoading = false;
              this.nextReceiptNumOutPO = res.data;
            })
            .catch(() => {
              this.btuLoading = false;
            });
        } else {
          let res = await printService.getNextReceiptNum({
            receiptType: "1", // 住院预缴款
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
        // this.$message.error(error.msg || "获取下一张票据号失败");
      }
      if (done) {
        done();
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
        // this.$message.error(error.msg || "跳号失败");
      }
    },
    // 票据打印
    async printReceipt(dischargeId) {
      try {
        if (!this.nextReceiptNumOutPO.receiptNum) {
          // this.$message.error("当前票据号为空,打印失败");
          return;
        }
        if (!dischargeId) {
          this.$message.error("当前患者dischargeId为空,打印失败");
          return;
        }
        if (!this.sendData.finAdId) {
          this.$message.error("当前患者finAdId为空,打印失败");
          return;
        }
        this.$showLoading();
        await this.receiptPrint(dischargeId);
        let res = await getReceiptContent({
          receiptNum: this.nextReceiptNumOutPO.receiptNum,
        });
        // 打印机。。
        this.receiptContent = res.data;
        this.handlePrintData();
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "打印票据失败");
      }
    },
    //处理打印数据
    async handlePrintData() {
      let index = getPrinterList();
      index = 3;
      let obj = createData(this.receiptContent, this.dayjs);
      // let {code, data} = await getPrintTpl(codes.inpInanceTpl);
      // if(code != 1) return;
      // print(index, data.value, {}, obj, true);
      print(index, "inFinanceTpl", {}, obj);
    },
    // 2020-11-15

    inpPrepayDetailShow() {
      if (!this.sendData.inpCode) {
        this.$message.error("请选择患者");
        return;
      }
      this.userInfoData = this.sendData;
      console.log(this.userInfoData);
      this.inpPrepayDetailVisiable = true;
    },
    inpChargeCollectShow(val) {
      if (!this.sendData.inpCode) {
        this.$message.error("请选择患者");
        return;
      }
      this.reportData = this.sendData;
      this.reportData.flag = val;
      this.flag = val;
      this.inpChargeCollectVisiable = true;
    },

    async getTotalItemDetails() {
      this.tableData = [];
      this.tableData1 = [];
      this.tableData2 = [];
      this.tableData3 = [];
      let res = await getTotalItemDetails(this.sendData.inpCode);
      if (res.code === 1) {
        this.tableData = res.data;
        if (this.tableData.length) {
          let len = Math.ceil(this.tableData.length / 3);
          this.tableData1 = this.tableData.slice(0, len);
          this.tableData2 = this.tableData.slice(len, len * 2);
          this.tableData3 = this.tableData.slice(len * 2);
          if (!this.tableData2[this.tableData1.length - 1]) {
            this.tableData2.push({
              chargeAmount: "",
              typeName: "",
            });
          }
          if (!this.tableData3[this.tableData1.length - 1]) {
            this.tableData3.push({
              chargeAmount: "",
              typeName: "",
            });
          }
        }
      }
    },
    //预结算弹框
    async isCheckShow() {
      if (!this.sendData.inpCode) {
        this.$message.error("请选择患者");
        return;
      }
      // 如果是医保患者
      if (this.sendData.settlementType == "3") {
        await this.stepByStep(0, {
          total: 0,
          finAdId: this.sendData.finAdId,
        });
      }
      await this.getPreSettle();
    },
    // 财务出院预结算
    async getPreSettle() {
      this.$showLoading();
      try {
        let res = await getPreSettle({
          // inpCode: this.sendData.inpCode
          finAdId: this.sendData.finAdId,
        });
        /* let res = {
          code: 1,
          data: {
            deratePayAmount: 0,
            finAdId: "8ae4261e7b330995017b330995de0000",
            freePayAmount: 0.0,
            inpCode: "JINP210811001",
            patientId: "8f33a49dda8e41a180eb8a0aae14b45e",
            patientName: "李升高",
            prepayBalance: 20.0,
            selfPayAmount: 1.13,
            settlementType: "3",
            siTradeAmtDetailDtos: [
              {
                hosId: "H0000000000000000000440303004005",
                orgId: "",
                recordStatus: "0",
                siTradeId: "8ae451107b3d7fdd017b3ebec8d400a8",
                tradeAmt: 69.01,
                tradeAmtCode: "999998",
                withinMedicareFundAmt: 0.0,
              },
              {
                hosId: "H0000000000000000000440303004005",
                orgId: "",
                recordStatus: "0",
                siTradeId: "8ae451107b3d7fdd017b3ebec8d400a8",
                tradeAmt: 52.96,
                tradeAmtCode: "999998",
                withinMedicareFundAmt: 0.0,
              },
              {
                hosId: "H0000000000000000000440303004005",
                orgId: "",
                recordStatus: "0",
                siTradeId: "8ae451107b3d7fdd017b3ebec8d400a8",
                tradeAmt: -1.13,
                tradeAmtCode: "310100",
                withinMedicareFundAmt: 0.0,
              },
              {
                hosId: "H0000000000000000000440303004005",
                orgId: "",
                recordStatus: "0",
                siTradeId: "8ae451107b3d7fdd017b3ebec8d400a8",
                tradeAmt: 15.94,
                tradeAmtCode: "310100",
                withinMedicareFundAmt: 0.0,
              },
            ],
            totalMedicalAmount: 1.13,
            totalPrepayAmount: 1.13,
          },
          success: true,
        }; */
        if (res.code == 1) {
          this.preSettleData = res.data;
          //给默认值
          if (this.preSettleData.prepayBalance < 0) {
            this.formDatas.realMoney1 =
              -this.preSettleData.prepayBalance.toFixed(2);
          } else {
            this.formDatas.realMoney3 =
              this.preSettleData.prepayBalance.toFixed(2);
          }
          // 将医保的相同明细合并
          if(this.preSettleData.siTradeAmtDetailDtos && this.preSettleData.siTradeAmtDetailDtos.length) {
            this.handleSiSettlementInfoDto();
          }
          this.checkShow = true;
          this.getNextReceiptNum();
        }
        this.$hideLoading();
        /*if (
              (this.preSettleData.prepayBalance &&
                this.preSettleData.prepayBalance >= 0) ||
              this.preSettleData.prepayBalance == 0
            ) {
              this.formData.payType = "5";
            } else {
              this.formData.payType = "";
            }*/
      } catch (error) {
        this.$hideLoading();
        // this.$message.error(error.msg || "预结算失败");
      }
    },
    // 将医保的相同明细合并
    handleSiSettlementInfoDto() {
      let arr = deepClone(this.preSettleData.siTradeAmtDetailDtos);
      if (!arr || !arr.length) {
        return;
      }
      let map = {};
      let dest = [];
      for (let i in arr) {
        let ai = arr[i];
        if (!map[ai.tradeAmtCode]) {
          dest.push({ ...ai });
          this.$set(map, ai.tradeAmtCode, ai);
        } else {
          for (let j in dest) {
            let dj = dest[j];
            if (dj.tradeAmtCode == ai.tradeAmtCode) {
              dj.tradeAmt = Number(dj.tradeAmt) + Number(ai.tradeAmt);
              break;
            }
          }
        }
      }
      console.log("destdestdestdest:", dest);
      this.$set(this.preSettleData, "siTradeAmtDetailDtos", dest);
    },
    // 医保患者明细上传
    async stepByStep(reUploadFlag, item) {
      item.total = 0;
      let res = await detailsUploadService.stepByStep({
        reUploadFlag,
        finAdId: item.finAdId,
      });
      if (res.code == 1) {
        if (item.total == 0 && res.data.remainUploadedTimes) {
          item.total = res.data.remainUploadedTimes + 1;
        }
        if (item.total === 0 && res.data.remainUploadedTimes === 0) {
          return;
        }
      }
      if (res.code != 1 || res.data.remainUploadedTimes > 0) {
        await this.stepByStep(reUploadFlag, item);
      }
    },
    confirm() {
      if (!this.sendData.inpCode) {
        this.$message.error("请选择患者");
        return;
      }
      // // 出院召回
      // this.$confirm("是否召回此病人？", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      //   beforeClose: async (action, instance, done) => {
      //     if (action === "confirm") {
      //       let isToBack = true;
      //       // 查询票据，如果有票据号，提示框，患者有票据信息，是否召回？确定则走召回流程，取消不走
      //       // 如果没有票据号直接走召回流程
      //       let res = await validReceiptInfo({
      //         finAdId: this.sendData.finAdId,
      //       });
      //       let receiptNum = res.data.receiptNum;
      //       if (res.data.receiptNum) {
      //         this.$confirm("此患者有票据信息，是否召回？", "提示", {
      //           confirmButtonText: "确定",
      //           cancelButtonText: "取消",
      //           type: "warning",
      //         })
      //           .then(() => {})
      //           .catch(() => {
      //             this.$message({
      //               type: "info",
      //               message: "已取消召回",
      //             });
      //             isToBack = false;
      //           });
      //       }
      //       //
      //       if (!isToBack) {
      //         return;
      //       }
      //       instance.confirmButtonLoading = true;
      //       instance.confirmButtonText = "执行中...";
      //       backPatient({
      //         // ...this.sendData,
      //         // finAdId: "1",
      //         // turnType: "1"
      //         dischargeId: this.sendData.dischargeId, //出院id
      //         finAdId: this.sendData.finAdId, //入院id
      //         receiptNum: receiptNum,
      //       })
      //         .then((res) => {
      //           done();
      //           instance.confirmButtonLoading = false;
      //           if (res.code === 1) {
      //             this.$root.$emit("PatientListDischargeSettleRefresh");
      //             this.$message.success("召回成功");
      //           } else {
      //             this.$message.error(res.msg || "召回失败");
      //           }
      //         })
      //         .catch((err) => {
      //           done();
      //           instance.confirmButtonLoading = false;
      //           this.$message.error(err.msg || "召回失败");
      //         });
      //     } else {
      //       done();
      //       this.$message.info("取消召回");
      //     }
      //   },
      // }).then();

      // 出院召回
      this.$confirm("是否召回此病人？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        // 查询票据，如果有票据号，提示框，患者有票据信息，是否召回？确定则走召回流程，取消不走
        // 如果没有票据号直接走召回流程
        let res = await validReceiptInfo({
          finAdId: this.sendData.finAdId,
        });
        let receiptNum = res.data.receiptNum;
        if (res.data.receiptNum) {
          this.$confirm("此患者有票据信息，是否召回？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              backPatient({
                // ...this.sendData,
                // finAdId: "1",
                // turnType: "1"
                dischargeId: this.sendData.dischargeId, //出院id
                finAdId: this.sendData.finAdId, //入院id
                receiptNum: receiptNum,
              })
                .then((res) => {
                  if (res.code === 1) {
                    this.$root.$emit("PatientListDischargeSettleRefresh");
                    this.$message.success("召回成功");
                  } else {
                    this.$message.error(res.msg || "召回失败");
                  }
                })
                .catch((err) => {
                  // this.$message.error(err.msg || "召回失败");
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消召回",
              });
            });
        } else {
          backPatient({
            // ...this.sendData,
            // finAdId: "1",
            // turnType: "1"
            dischargeId: this.sendData.dischargeId, //出院id
            finAdId: this.sendData.finAdId, //入院id
            receiptNum: receiptNum,
          })
            .then((res) => {
              if (res.code === 1) {
                this.$root.$emit("PatientListDischargeSettleRefresh");
                this.$message.success("召回成功");
              } else {
                this.$message.error(res.msg || "召回失败");
              }
            })
            .catch((err) => {
              // this.$message.error(err.msg || "召回失败");
            });
        }
      });
    },
    //注销入院
    async logoutIn() {
      if (!this.sendData.inpCode) {
        this.$message.error("请选择患者");
        return;
      }
      this.$showLoading();
      try {
        let params = {
          finAdId: this.sendData.finAdId,
        };
        let { code, data, msg } = await logoutIn(params);
        if (code == 1) {
          this.$root.$emit("PatientListDischargeSettleRefresh");
          this.$message.success("注销入院成功");
        } else {
          this.$message.error(msg || "注销入院失败");
        }
        this.$hideLoading();
      } catch (e) {
        this.$hideLoading();
        // this.$message.error(e.msg || "注销入院失败");
      }
    },
    async handleCheckData() {
      let arr = [];
      if (this.preSettleData.prepayBalance < 0) {
        arr[0] = {
          finAdId: this.sendData.finAdId,
          inpCode: this.sendData.inpCode,
          businessType: "1",
          checkNum:
            this.formDatas.payType1 == "7" ? this.formDatas.checkNum : "",
          bankName:
            this.formDatas.payType1 == "7" ? this.formDatas.bankName : "",
          depositBank:
            this.formDatas.payType1 == "7" ? this.formDatas.depositBank : "",
          bankAccount:
            this.formDatas.payType1 == "7" ? this.formDatas.bankAccount : "",
          payTypeId: this.formDatas.payType1,
          payTypeName: this.formDatas.payTypeName1,
          payTypeCode: this.formDatas.payTypeCode1,
          prepayMoney: this.formDatas.realMoney1,
        };
        // arr[1] = {
        //   finAdId: this.sendData.finAdId,
        //   inpCode: this.sendData.inpCode,
        //   businessType: "1",
        //   checkNum: this.formDatas.payType2 == '7' ? this.formDatas.checkNum : '',
        //   bankName: this.formDatas.payType2 == '7' ? this.formDatas.bankName : '',
        //   depositBank: this.formDatas.payType2 == '7' ? this.formDatas.depositBank : '',
        //   bankAccount: this.formDatas.payType2 == '7' ? this.formDatas.bankAccount : '',
        //   payTypeId: this.formDatas.payType2,
        //   payTypeName: this.formDatas.payTypeName2,
        //   payTypeCode: this.formDatas.payTypeCode2,
        //   prepayMoney: this.formDatas.realMoney2
        // };
      } else if (this.preSettleData.prepayBalance > 0) {
        arr[0] = {
          finAdId: this.sendData.finAdId,
          inpCode: this.sendData.inpCode,
          businessType: "1",
          checkNum:
            this.formDatas.payType3 == "7" ? this.formDatas.checkNum : "",
          bankName:
            this.formDatas.payType3 == "7" ? this.formDatas.bankName : "",
          depositBank:
            this.formDatas.payType3 == "7" ? this.formDatas.depositBank : "",
          bankAccount:
            this.formDatas.payType3 == "7" ? this.formDatas.bankAccount : "",
          payTypeId: this.formDatas.payType3,
          payTypeName: this.formDatas.payTypeName3,
          payTypeCode: this.formDatas.payTypeCode3,
          prepayMoney: "-" + this.formDatas.realMoney3,
        };
        // arr[1] = {
        //   finAdId: this.sendData.finAdId,
        //   inpCode: this.sendData.inpCode,
        //   businessType: "1",
        //   checkNum: this.formDatas.payType4 == '7' ? this.formDatas.checkNum : '',
        //   bankName: this.formDatas.payType4 == '7' ? this.formDatas.bankName : '',
        //   depositBank: this.formDatas.payType4 == '7' ? this.formDatas.depositBank : '',
        //   bankAccount: this.formDatas.payType4 == '7' ? this.formDatas.bankAccount : '',
        //   payTypeId: this.formDatas.payType4,
        //   payTypeName: this.formDatas.payTypeName4,
        //   payTypeCode: this.formDatas.payTypeCode4,
        //   prepayMoney: '-' + this.formDatas.realMoney4
        // };
      } else {
        arr = [];
      }
      let params = {
        // inpCode: this.sendData.inpCode,
        finAdId: this.sendData.finAdId,
        channelCode: "00",
        payInputVOList: arr,
      };
      return params;
    },
    async checkConfirm() {
      this.checkConfirmLoading = true;
      this.$refs["formDatas"].validate(async (valid) => {
        if (valid) {
          if (this.payChannelCode === "04") {
            if (this.preSettleData.prepayBalance > 0) {
              //退款
              this.modelVisibleReturn = true;
            } else if (this.preSettleData.prepayBalance < 0) {
              //补缴
              this.modelVisible = true;
            }
            this.checkConfirmLoading = false;
          } else if (this.payChannelCode === "00") {
            try {
              let params = await this.handleCheckData();
              // 出院结算失败
              let res = await postCharge(params);
              if (res.code === 1) {
                this.$message.success("出院结算成功");
                this.printReceipt(res.data.dischargeId);
                this.$refs["formDatas"].resetFields();
                this.$root.$emit("PatientListDischargeSettleRefresh");
                this.checkShow = false;
              } else {
                this.$message.error(res.msg || "出院结算错误");
              }
            } catch (error) {
              // this.$message.error(error.errorMsg || "出院结算错误");
            } finally {
              this.checkConfirmLoading = false;
            }
          } else {
            try {
              let params = await this.handleCheckData();
              // 出院结算失败
              let res = await postCharge(params);
              if (res.code === 1) {
                this.$message.success("出院结算成功");
                this.printReceipt(res.data.dischargeId);
                this.$refs["formDatas"].resetFields();
                this.$root.$emit("PatientListDischargeSettleRefresh");
                this.checkShow = false;
              } else {
                this.$message.error(res.msg || "出院结算错误");
              }
            } catch (error) {
              // this.$message.error(error.errorMsg || "出院结算错误");
            } finally {
              this.checkConfirmLoading = false;
            }
          }
        } else {
          this.checkConfirmLoading = false;
          console.log("error submit!!");
        }
      });
    },
    checkCancel() {
      this.checkShow = false;
      this.$refs["formDatas"].resetFields();
    },
    checkShowClose() {
      this.$refs["formDatas"].resetFields();
    },
    payTypeChange1(value, obj) {
      if (value === "") {
        this.payChannelCode = "";
        this.payTypeobj = this.formDatas.realMoney1;
        this.payTypeData = "";
        this.formDatas["payTypeName1"] = "";
        this.formDatas["payTypeCode1"] = "";
        return;
      }
      console.log(obj);
      /* if(obj.payChannelCode != '00'){
          this.modelVisible = true;
        } */
      this.payChannelCode = obj.payChannelCode;
      this.payTypeobj = this.formDatas.realMoney1;
      this.payTypeData = obj.payTypeClassCode;
      this.formDatas["payTypeName1"] = obj.payTypeName;
      this.formDatas["payTypeCode1"] = obj.payTypeCode;
    },
    payTypeChange11(value) {
      for (let i in this.PayTypeOptions) {
        if (this.PayTypeOptions[i].payTypeId === value) {
          this.payChannelCode = this.PayTypeOptions[i].payChannelCode;
          this.payTypeobj = this.formDatas.realMoney3;
          this.payTypeData = this.PayTypeOptions[i].payTypeClassCode;
          this.formDatas["payTypeName1"] = this.PayTypeOptions[i].payTypeName;
          this.formDatas["payTypeCode1"] = this.PayTypeOptions[i].payTypeCode;
        }
      }
    },
    payTypeChange2(value, obj) {
      this.formDatas["payTypeName2"] = obj.payTypeName;
      this.formDatas["payTypeCode2"] = obj.payTypeCode;
    },
    payTypeChange3(value, obj) {
      if (value === "") {
        this.payChannelCode = "";
        this.payTypeobj = this.formDatas.realMoney3;
        this.payTypeData = "";
        this.formDatas["payTypeName3"] = "";
        this.formDatas["payTypeCode3"] = "";
        return;
      }
      // this.formDatas.payTypeClassCode = obj.hasOwnProperty("payTypeClassCode") ? obj.payTypeClassCode : "";
      console.log(obj, "打印支付方式");
      /* if(obj.payChannelCode != '00'){
          this.modelVisibleReturn = true;
          this.$nextTick(()=>{
            this.$refs.inHosPreReturnDialog && this.$refs.inHosPreReturnDialog.payTypeChange(obj.payTypeClassCode);
          });
        } */
      this.payChannelCode = obj.payChannelCode;
      this.payTypeobj = this.formDatas.realMoney3;
      this.payTypeData = obj.payTypeClassCode;
      this.formDatas["payTypeName3"] = obj.payTypeName;
      this.formDatas["payTypeCode3"] = obj.payTypeCode;
    },
    payTypeChange33(value) {
      for (let i in this.PayTypeOptions) {
        if (this.PayTypeOptions[i].payTypeId === value) {
          this.payChannelCode = this.PayTypeOptions[i].payChannelCode;
          this.payTypeobj = this.formDatas.realMoney3;
          this.payTypeData = this.PayTypeOptions[i].payTypeClassCode;
          this.formDatas["payTypeName3"] = this.PayTypeOptions[i].payTypeName;
          this.formDatas["payTypeCode3"] = this.PayTypeOptions[i].payTypeCode;
        }
      }
    },
    payTypeChange4(value, obj) {
      this.formDatas["payTypeName4"] = obj.payTypeName;
      this.formDatas["payTypeCode4"] = obj.payTypeCode;
    },
    // 金额格式化，千位分割，小数点2位
    formatNumber(a, num = 2) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(num)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    changeRMB(amount) {
      if (isNaN(amount) || amount >= 1000000) return "无效金额！"; //数值最大不超过100万
      let sPrefix = amount < 0 ? "(负)" : ""; //将负号‘-’显示成汉字‘(负)’
      let sAmount = Math.abs(amount).toFixed(2); //格式化成两位小数格式（两位小数对应“'角”和“分”）
      let sUnit = "拾万仟佰拾元角分";
      let sCapital = "零壹贰叁肆伍陆柒捌玖"; //10个大写数字
      sAmount = sAmount.replace(".", ""); //去除小数点（使数字与权位对应）
      let str = "";
      if (sAmount.length < sUnit.length) {
        for (let i = 0, len = sUnit.length - sAmount.length; i < len; i++) {
          //拼接数字与权位单位
          str += "" + "0";
        }
      }
      sAmount = str + sAmount;
      console.info(sAmount);
      let sOutput = "";
      for (let i = 0, len = sAmount.length; i < len; i++) {
        //拼接数字与权位单位
        sOutput +=
          sCapital.substr(sAmount.substr(i, 1), 1) + sUnit.substr(i, 1);
      }
      return sPrefix + sOutput;
    },
    //票据启用
    billsUse() {
      this.dialogVisible = true;
    },
    //发票打印接口
    async receiptPrint(dischargeId) {
      try {
        let params = {
          dischargeId: dischargeId,
          receiptNum: this.nextReceiptNumOutPO.nextReceiptNum, //票据号
          finAdId: this.sendData.finAdId, //财务住院id
          outId: this.nextReceiptNumOutPO.outId,
        };
        let res = await receiptPrint(params);
        if (res.code == 1) {
          this.$message.success("发票打印成功");
        } else {
          this.$message.error("发票打印失败");
        }
      } catch (e) {
        // this.$message.error(e.msg || "发票打印失败");
      }
    },
    // 医保结算费用明细打印
    async printDataFuc() {
      // let obj = handleData();
      // print(null, siChargeTpl, {}, obj, false);
      // return
      try {
        let res = await settleCostFind({
          finAdId: this.sendData.finAdId,
        });
        /* let res = {
          code: 1,
          data: {
            diagInfo: {
              diseinfo: [
                {
                  adm_cond: "哈哈哈不不不",
                  diag_code: "I10.x09",
                  diag_dept: "0200",
                  diag_info_id: "44030000000410037016",
                  diag_name: "原发性高血压",
                  diag_srt_no: 1,
                  diag_time: "2021-08-10 14:51:24",
                  diag_type: "1",
                  dise_dor_name: "长岭社康中心管理员",
                  dise_dor_no: "0301131",
                  inout_diag_type: "1",
                  maindiag_flag: "1",
                  mdtrt_id: "44030000000410022100",
                  psn_no: "44030000000001112535",
                },
                {
                  diag_code: "10025395",
                  diag_dept: "0200",
                  diag_info_id: "44030000000410037018",
                  diag_name: "痔",
                  diag_srt_no: 1,
                  diag_time: "2021-08-09 14:35:37",
                  diag_type: "1",
                  dise_dor_name: "长岭社康中心管理员",
                  dise_dor_no: "0301131",
                  inout_diag_type: "2",
                  maindiag_flag: "1",
                  mdtrt_id: "44030000000410022100",
                  opt_time: "2021-08-10 14:51:49",
                  opter_id: "0301131",
                  opter_name: "长岭社康中心管理员",
                  psn_no: "44030000000001112535",
                },
              ],
            },
            costDetail: {
              11: {
                overlmt_amt: 0.0,
                det_item_fee_sumamt: 38.61000000000001,
                preselfpay_amt: 0.0,
              },
              "04": {
                overlmt_amt: 0.0,
                det_item_fee_sumamt: 34.8,
                preselfpay_amt: 0.0,
              },
              "09": {
                overlmt_amt: 0.0,
                det_item_fee_sumamt: 5.0,
                preselfpay_amt: 0.0,
              },
              10: {
                overlmt_amt: 0.0,
                det_item_fee_sumamt: 0.15,
                preselfpay_amt: 0.0,
              },
            },
            clinicInfo: {
              mdtrtinfo: [],
            },
            settle: {
              setldetail: [
                {
                  fund_pay_type: "个人自付",
                  fund_payamt: 78.41,
                },
                {
                  fund_pay_type: "个人自费",
                  fund_payamt: 0.15,
                },
              ],
              setlinfo: {
                acct_mulaid_pay: 0.0,
                acct_pay: 0.0,
                act_pay_dedc: 78.41,
                age: 70.0,
                balc: 1179.87,
                begndate: "2021-08-09 00:00:00",
                brdy: "1951-11-09 00:00:00",
                cash_payamt: 78.56,
                certno: "440301195111091329",
                clr_optins: "440303",
                clr_type: "21",
                clr_way: "3",
                cvlserv_flag: "0",
                cvlserv_pay: 0.0,
                dedc_hosp_lv: "9",
                dise_name: "原发性高血压",
                enddate: "2021-08-09 00:00:00",
                fixmedins_code: "H44030302178",
                fixmedins_name: "深圳市罗湖医院集团长岭社区健康服务中心",
                fixmedins_poolarea: "440303",
                flxempe_flag: "0",
                fulamt_ownpay_amt: 0.15,
                fund_pay_sumamt: 0.0,
                gend: "2",
                hifes_pay: 0.0,
                hifmi_pay: 0.0,
                hifob_pay: 0.0,
                hifp_pay: 0.0,
                hosp_lv: "11",
                inscp_scp_amt: 0.0,
                insutype: "310",
                lmtpric_hosp_lv: "1",
                maf_pay: 0.0,
                mdtrt_id: "44030000000410022100",
                med_type: "71",
                medfee_sumamt: 78.56,
                naty: "99",
                opt_time: "2021-08-10 14:51:49",
                opter_id: "0301131",
                opter_name: "长岭社康中心管理员",
                oth_pay: 0.0,
                overlmt_selfpay: 0.0,
                pay_loc: "2",
                pool_prop_selfpay: 0.0,
                preselfpay_amt: 78.41,
                psn_cert_type: "01",
                psn_name: "王兵",
                psn_no: "44030000000001112535",
                psn_pay: 78.56,
                psn_type: "1201",
                refd_setl_flag: "0",
                setl_id: "44030000000410043005",
                setl_time: "2021-08-10 14:51:49",
                year: "2021",
              },
            },
          },
          success: true,
        }; */
        if (res.code == 1) {
          let setlinfo =
            res.data.settle && res.data.settle.setlinfo
              ? res.data.settle.setlinfo
              : {};
          let mdtrtinfoItem =
            res.data.clinicInfo &&
            res.data.clinicInfo.mdtrtinfo &&
            res.data.clinicInfo.mdtrtinfo.length
              ? res.data.clinicInfo.mdtrtinfo[0]
              : "";
          // 入院日期
          let begntime =
            mdtrtinfoItem.begntime && mdtrtinfoItem.begntime.indexOf(" ") > -1
              ? mdtrtinfoItem.begntime.split(" ")[0]
              : mdtrtinfoItem.begntime;
          let endtime =
            mdtrtinfoItem.endtime && mdtrtinfoItem.endtime.indexOf(" ") > -1
              ? mdtrtinfoItem.endtime.split(" ")[0]
              : mdtrtinfoItem.endtime;
          // 住院天数
          let indays = mdtrtinfoItem ? this.getDays(begntime, endtime) : "";
          // 住院号
          let ipt_otp_no = mdtrtinfoItem ? mdtrtinfoItem.ipt_otp_no : "";
          let adm_dept_name = mdtrtinfoItem ? mdtrtinfoItem.adm_dept_name : "";
          let adm_bed = mdtrtinfoItem ? mdtrtinfoItem.adm_bed : "";
          // 入院诊断
          let diseinfo =
            res.data.diagInfo &&
            res.data.diagInfo.diseinfo &&
            res.data.diagInfo.diseinfo.length
              ? res.data.diagInfo.diseinfo
              : [];
          // 出入院诊断
          let mainIn = "";
          let minorIn = "";
          let mainOut = "";
          let minorOut = "";
          for (let i in diseinfo) {
            let item = diseinfo[i];
            if (item.inout_diag_type == "1" && item.maindiag_flag == "1") {
              mainIn = item.diag_name;
            }
            if (item.inout_diag_type == "1" && item.maindiag_flag == "2") {
              minorIn = item.diag_name;
            }
            if (item.inout_diag_type == "2" && item.maindiag_flag == "1") {
              mainOut = item.diag_name;
            }
            if (item.inout_diag_type == "2" && item.maindiag_flag == "2") {
              minorOut = item.diag_name;
            }
          }
          let resData = {
            ...res.data,
            ...setlinfo,
            gend: this.transformNew("gend", setlinfo.gend),
            hosp_lv: this.transformNew("hosp_lv", setlinfo.hosp_lv),
            psn_type: this.transformNew("psn_type", setlinfo.psn_type),
            insutype: this.transformNew("insutype", setlinfo.insutype),
            med_type: this.transformNew("med_type", setlinfo.med_type),
            begntime: begntime,
            endtime: endtime,
            indays: indays,
            ipt_otp_no: ipt_otp_no,
            adm_dept_name: adm_dept_name,
            adm_bed: adm_bed,
            diag_name_in: mainIn ? mainIn : minorIn,
            diag_name_out: mainOut ? mainOut : minorOut,
          };
          console.log("resData", resData);
          let obj = handleData(resData);
          print(null, siChargeTpl, {}, obj, false);
        }
      } catch (error) {}
    },
    // 计算住院天数
    getDays(strDateStart, strDateEnd) {
      if (strDateStart && strDateEnd) {
        let strSeparator = "-"; //日期分隔符
        let oDate1;
        let oDate2;
        let iDays;
        oDate1 = strDateStart.split(strSeparator);
        oDate2 = strDateEnd.split(strSeparator);
        let strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
        let strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
        iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
        if (iDays < 1) {
          return 1;
        }
        return iDays;
      }
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;

  font-weight: 500;
  color: rgba(46, 50, 58, 1);

  i {
    display: inline-block;
    width: 4px;
    height: 20px;
    background: $l-color-primary;
    margin-right: 5px;
    position: relative;
    top: 4px;
  }
}

.patientInfo {
  margin-bottom: 8px;

  .el-form-item {
    width: 25%;
  }
}

.checkShow-cont {
  padding: 16px;
  position: relative;
}
.charge-name {
  display: inline-block;
  min-width: 100px;
}
.charge-num {
  display: inline-block;
  // float: right;
  height: 32px;
  width: 150px;
  margin: 10px 0 0 10px;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  color: #c0c4cc;
  padding: 0 8px;
  line-height: 32px;
  color: rgb(240, 90, 35);
  font-weight: bold;
}
.charge-right {
  min-height: 252px;
  padding: 10px;
  border-left: 1px solid #e4e7ed;
}
</style>