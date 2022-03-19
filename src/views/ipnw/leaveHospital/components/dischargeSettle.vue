<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"
      @message="messageHandler"
    >
      <template #list>
        <left-bar type="hos" :Multiple="false"></left-bar>
      </template>
      <template #content>
        <el-card class="height100">
          <div class="recall-content-box height100">
            <div class="height-button-main">
              <div class="user-info">
                <div style="overflow: hidden;margin-top: 20px">
                  <div class="title fl">
                    <i></i>
                    <b>患者信息</b>
                  </div>
                  <div class="button fr">
                    <el-button style="border-radius: 2px;" @click="overPay">预交金信息</el-button>
                    <el-button style="border-radius: 2px;" @click="payList">费用清单</el-button>
                  </div>
                </div>
                <div class="info">
                  <div>
                    <p v-for="(item, i) in patientInfoKey" :key="i">
                      <span class="babel">{{item.label}}</span>
                      <template v-if="item.key === 'patientGender'">
                        <span
                          v-if="!!patientInfo[item.key]"
                          :val="patientInfo[item.key]"
                          code="GENDER_CODE"
                          v-codeTransform
                        ></span>
                        <span v-else>--</span>
                      </template>
                      <template v-else-if="item.key === 'admissionSdeptId'">
                        <span
                          v-if="!!patientInfo[item.key]"
                          tableName="sys_org"
                          :conditionMap="{org_type: '_DEPT_', id: patientInfo.admissionSdeptId}"
                          columns="org_nm"
                          v-tableTransform
                        ></span>
                        <span v-else>--</span>
                      </template>
                      <template v-else-if="item.key === 'settlementType'">
                        <span
                          v-if="!!patientInfo[item.key]"
                          :val="patientInfo[item.key]"
                          code="MEDICAL_INSURANCE_CODE"
                          v-codeTransform
                        ></span>
                        <span v-else>--</span>
                      </template>
                      <!-- inpDays
                      finAdmissionTime-->
                      <template v-else-if="item.key === 'finAdmissionTime'">
                        <span
                          v-if="!!patientInfo['inpDays']"
                        >{{patientInfo['inpDays'].substring(0,patientInfo['inpDays'].indexOf('('))}}</span>
                        <span v-else>--</span>
                      </template>

                      <template v-else-if="item.key === 'wardId'">
                        <span
                          v-if="!!patientInfo[item.key]"
                          tableName="sys_ward"
                          :conditionMap="{ward_code:patientInfo[item.key]}"
                          columns="ward_name"
                          v-tableTransform
                        ></span>
                        <span v-else>--</span>
                      </template>
                      <span v-else :style="item.style">{{patientInfo[item.key] || '--'}}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="out-info">
                <div style="overflow: hidden;margin-bottom: 16px;">
                  <div class="title">
                    <i></i>
                    <b>费用信息</b>
                  </div>
                </div>
                <div style>
                  <el-table :data="tableList" border stripe class="mar-top-20" height="180">
                    <el-table-column
                      v-for="(item, index) in tableParamsThree"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      header-align="center"
                      :align="item.align || 'left'"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <template v-if="item.prop == 'type'">
                          <span :val="scope.row[item.prop]" code="FinClassCode" v-codeTransform></span>
                        </template>
                        <template v-else-if="item.prop == 'chargeAmount'">
                          <span>{{ scope.row[item.prop].toFixed(2)}}</span>
                        </template>
                        <template v-else-if="item.prop == 'medicalInsurance'">
                          <span>{{ scope.row[item.prop].toFixed(2)}}</span>
                        </template>
                        <template v-else-if="item.prop == 'selfPayMoney'">
                          <span>{{ scope.row[item.prop].toFixed(2)}}</span>
                        </template>
                        <!--操作部分自定义-->
                        <template v-else>
                          <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <!--<div style="margin-top: 40px">
                  <span class="label">总金额</span>
                  <span
                    class="labelContent"
                  >{{preSettleData.totalMedicalAmount.toFixed(2) || "0.00"}}（元）</span>
                  <span class="label margin-left-40">预交金</span>
                  <span
                    class="labelContent"
                  >{{preSettleData.totalPrepayAmount.toFixed(2) || '0.00'}}（元）</span>
                </div>

                <el-form :model="formData" :rules="rules" ref="formData">
                  <div class="info" style="margin-bottom: 0;height:100px;">
                    <p>
                      <l-formt-title label="医保金额">
                        <div style="display: block;line-height: 34px;">
                          &lt;!&ndash; <span>{{preSettleData.freePayAmount.toFixed(2) || '0.00'}}</span> &ndash;&gt;
                          <span>{{'0.00'}}</span>
                        </div>
                      </l-formt-title>
                    </p>
                    <p>
                      <l-formt-title label="自费金额">
                        <div style="display: block;line-height: 34px;">
                          <span>{{preSettleData.selfPayAmount.toFixed(2) || '0.00'}}</span>
                        </div>
                      </l-formt-title>
                    </p>
                    <p>
                      <l-formt-title label="应交金额">
                        <div style="display: block;line-height: 34px;" class="error">
                          <span>{{preSettleData.prepayBalance >= 0?'0.00':((0 - preSettleData.prepayBalance).toFixed(2) || '0.00')}}</span>
                        </div>
                      </l-formt-title>
                    </p>
                    <p>
                      <l-formt-title label="支付方式" :disabled="formData.payType == '5'">
                        <el-form-item label prop="payType">
                          <l-value-domain
                            code="PAY_TYPE"
                            :value.sync="formData.payType"
                            @change="paymentMethodFun"
                            :disabled="formData.payType == '5'"
                            placeholder="请选择"
                          ></l-value-domain>
                        </el-form-item>
                      </l-formt-title>
                    </p>
                    <p>
                      <l-formt-title label="实收金额" :disabled="preSettleData.prepayBalance >= 0?true:false">
                        <el-form-item label prop="realMoney">
                          <el-input
                            :disabled="preSettleData.prepayBalance >= 0?true:false"
                            v-model="formData.realMoney"
                            placeholder="0.00"
                            clearable
                          ></el-input>
                        </el-form-item>
                      </l-formt-title>
                    </p>
                    <p>
                      <l-formt-title label="找零金额">
                        <div v-if="preSettleData.prepayBalance < 0" style="display: block;line-height: 34px;">
                          <span>{{backMoney.toFixed(2) || '0.00'}}</span>
                        </div>
                        <div v-if="preSettleData.prepayBalance >= 0" style="display: block;line-height: 34px;">
                          <span>{{preSettleData.prepayBalance.toFixed(2) || '0.00'}}</span>
                        </div>
                      </l-formt-title>
                    </p>
                  </div>
                </el-form>-->
                <!-- <span style="color:red;margin-left:70px">{{warning}}</span> -->
              </div>
            </div>
            <div class="height-button-bottom text-align-right some-button">
              <el-button type="primary" style="border-radius: 2px;" @click="isCheckShow">出院预结算</el-button>
              <el-button
                style="border-radius: 2px;"
                v-hotKey="{func:'func_submit', flag: 'isLoading'}"
                @click="confirm"
              >出院召回
              </el-button>
              <el-button
                style="border-radius: 2px;"
                @click="logoutIn"
              >注销入院
              </el-button>
            </div>
          </div>
          <el-dialog title="预交金明细" :visible.sync="payListShow">
            <div style="margin: 20px">
              <el-table :data="payTableList" border stripe height="180">
                <el-table-column
                  v-for="(item, index) in payTableParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  header-align="center"
                  :align="item.align || 'left'"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <!--操作部分自定义-->
                    <template>
                      <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="payListShow = false">关闭</el-button>
            </div>
          </el-dialog>

          <el-dialog title="日清单" :visible.sync="dayListShow">
            <div v-if="dayListShow==true">
              <div style="margin: 20px" class="topPart">
                <LFormtTitle label="费用日期" style="width: 315px">
                  <el-date-picker
                    clearable
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                    v-model="payDate"
                    type="daterange"
                    range-separator="至"
                    :default-time="['00:00:00', '23:59:59']"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="dateChange"
                  ></el-date-picker>
                </LFormtTitle>
                <span class="label margin-left-20">种类</span>
                <span class="labelContent">{{dayList.typeCount}}</span>
                <span class="label margin-left-20">总金额</span>
                <span class="labelContent">{{dayList.total}}</span>
                <span class="label margin-left-20">收费项目数量</span>
                <span
                  class="labelContent margin-left-20"
                  style="color: #F05A23"
                >{{dayList.itemQuantity}}</span>
              </div>
              <div style="margin: 20px">
                <el-table :data="dayTableList" border stripe class="mar-top-20" height="250">
                  <el-table-column
                    v-for="(item, index) in dayTableParams"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :min-width="item.width"
                    header-align="center"
                    :align="item.align || 'left'"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <template v-if="item.prop == 'itemType'">
                        <span :val="scope.row[item.prop]" code="FinClassCode" v-codeTransform></span>
                      </template>
                      <template v-else-if="item.prop == 'unitPrice'">
                        <span>{{scope.row[item.prop].toFixed(2)}}</span>
                      </template>
                      <template v-else-if="item.prop == 'chargeAmount'">
                        <span>{{scope.row[item.prop].toFixed(2)}}</span>
                      </template>
                      <!--操作部分自定义-->
                      <template v-else>
                        <span class="overflow-point">{{ scope.row[item.prop]}}</span>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button class="footBtn" @click="dayListShow = false">关闭</el-button>
              </div>
            </div>
          </el-dialog>

          <el-dialog title="出院预结算" :visible.sync="checkShow" width="900px"
                     :close-on-click-modal="false" :close-on-press-escape="false" @before-close="checkShowClose">
            <div class="checkShow-cont">
              <l-card-title>
                <template slot="left">患者信息</template>
              </l-card-title>
              <el-row :gutter="20">
                <el-col :span="6">住院号：{{patientInfo['inpCode']}}</el-col>
                <el-col :span="6">姓名：{{patientInfo['patientName']}}</el-col>
                <el-col :span="6">结算类型：
                  <span
                    :val="patientInfo['settlementType'] || ''"
                    code="MEDICAL_INSURANCE_CODE"
                    v-codeTransform
                  ></span>
                </el-col>
                <el-col :span="6">病区：
                  <span
                    tableName="sys_ward"
                    :conditionMap="{ward_code:patientInfo['wardId'] || ''}"
                    columns="ward_name"
                    v-tableTransform
                  ></span>
                </el-col>
              </el-row>
              <l-card-title>
                <template slot="left">费用信息</template>
              </l-card-title>
              <el-row :gutter="20">
                <el-col :span="6">总费用：
                  <span v-if="preSettleData.totalMedicalAmount">{{preSettleData.totalMedicalAmount.toFixed(2)|| '0.00'}}（元）</span>
                  <span v-else>0.00（元）</span>
                </el-col>
                <el-col :span="6">记账金额：
                  <span v-if="preSettleData.freePayAmount">{{preSettleData.freePayAmount.toFixed(2)|| '0.00'}}（元）</span>
                  <span v-else>0.00（元）</span>
                </el-col>
                <el-col :span="6">减免金额：
                  <span
                    v-if="preSettleData.deratePayAmount">{{preSettleData.deratePayAmount.toFixed(2)|| '0.00'}}（元）</span>
                  <span v-else>0.00（元）</span>
                </el-col>
                <el-col :span="6">自付金额：
                  <span v-if="preSettleData.selfPayAmount">{{preSettleData.selfPayAmount.toFixed(2)|| '0.00'}}（元）</span>
                  <span v-else>0.00（元）</span>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-top: 10px">
                <el-col :span="6">总预缴金：
                  <span
                    v-if="preSettleData.totalPrepayAmount">{{preSettleData.totalPrepayAmount.toFixed(2)|| '0.00'}}（元）</span>
                  <span v-else>0.00（元）</span>
                </el-col>
                <el-col :span="6">预缴金余额：
                  <span
                    v-if="preSettleData.prepayBalance">{{preSettleData.prepayBalance.toFixed(2)|| '0.00'}}（元）</span>
                  <span v-else>0.00（元）</span>
                </el-col>
              </el-row>
              <el-form :model="formDatas" :rules="rules1" ref="formDatas">
                <div v-if="preSettleData.prepayBalance < 0">
                  <el-row :gutter="20" style="margin-top: 20px;padding:0 20px">
                    <el-col :span="6">
                      <l-formt-title label="补缴" :disabled="preSettleData.prepayBalance >= 0">
                        <el-form-item label prop="realMoney1">
                          <el-input v-model="formDatas.realMoney1"
                                    :disabled="preSettleData.prepayBalance >= 0"
                                    placeholder="" clearable
                          ></el-input>
                        </el-form-item>
                      </l-formt-title>
                    </el-col>
                    <el-col :span="9">
                      <l-formt-title label="付款方式" :disabled="preSettleData.prepayBalance >= 0">
                        <el-form-item label prop="payType1">
                          <l-value-domain
                            clearable
                            remoteUrl="/finance-pub/payType/getPayTypeByAuth"
                            type="select"
                            remoteShowKey="payTypeName"
                            remoteValueKey="payTypeId"
                            :value.sync="formDatas.payType1"
                            :disabled="preSettleData.prepayBalance >= 0"
                            placeholder="请选择"
                            @change="payTypeChange1"
                          ></l-value-domain>
                        </el-form-item>
                      </l-formt-title>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20" style="margin-top: 15px;padding:0 20px">
                    <el-col :span="6">
                      <l-formt-title label="补缴">
                        <el-form-item label prop="realMoney2">
                          <el-input v-model="formDatas.realMoney2"
                                    :disabled="preSettleData.prepayBalance >= 0"
                                    placeholder="" clearable
                          ></el-input>
                        </el-form-item>
                      </l-formt-title>
                    </el-col>
                    <el-col :span="9">
                      <l-formt-title label="付款方式">
                        <el-form-item label prop="payType2">
                          <l-value-domain
                            clearable
                            remoteUrl="/finance-pub/payType/getPayTypeByAuth"
                            type="select"
                            remoteShowKey="payTypeName"
                            remoteValueKey="payTypeId"
                            :value.sync="formDatas.payType2"
                            :disabled="preSettleData.prepayBalance >= 0"
                            placeholder="请选择"
                            @change="payTypeChange2"
                          ></l-value-domain>
                        </el-form-item>
                      </l-formt-title>
                    </el-col>
                  </el-row>
                </div>
                <div v-else-if="preSettleData.prepayBalance > 0">
                  <el-row :gutter="20" style="margin-top: 20px;padding:0 20px">
                    <el-col :span="6">
                      <l-formt-title label="找还" :disabled="preSettleData.prepayBalance < 0">
                        <el-form-item label prop="realMoney3">
                          <el-input v-model="formDatas.realMoney3"
                                    :disabled="preSettleData.prepayBalance < 0"
                                    placeholder="" clearable
                          ></el-input>
                        </el-form-item>
                      </l-formt-title>
                    </el-col>
                    <el-col :span="9">
                      <l-formt-title label="付款方式" :disabled="preSettleData.prepayBalance < 0">
                        <el-form-item label prop="payType3">
                          <l-value-domain
                            clearable
                            remoteUrl="/finance-pub/payType/getPayTypeByAuth"
                            type="select"
                            remoteShowKey="payTypeName"
                            remoteValueKey="payTypeId"
                            :value.sync="formDatas.payType3"
                            :disabled="preSettleData.prepayBalance < 0"
                            placeholder="请选择"
                            @change="payTypeChange3"
                          ></l-value-domain>
                        </el-form-item>
                      </l-formt-title>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20" style="margin-top: 15px;padding:0 20px">
                    <el-col :span="6">
                      <l-formt-title label="找还" :disabled="preSettleData.prepayBalance < 0">
                        <el-form-item label prop="realMoney4">
                          <el-input v-model="formDatas.realMoney4"
                                    :disabled="preSettleData.prepayBalance < 0"
                                    placeholder="" clearable
                          ></el-input>
                        </el-form-item>
                      </l-formt-title>
                    </el-col>
                    <el-col :span="9">
                      <l-formt-title label="付款方式" :disabled="preSettleData.prepayBalance < 0">
                        <el-form-item label prop="payType4">
                          <l-value-domain
                            clearable
                            remoteUrl="/finance-pub/payType/getPayTypeByAuth"
                            type="select"
                            remoteShowKey="payTypeName"
                            remoteValueKey="payTypeId"
                            :value.sync="formDatas.payType4"
                            :disabled="preSettleData.prepayBalance < 0"
                            placeholder="请选择"
                            @change="payTypeChange4"
                          ></l-value-domain>
                        </el-form-item>
                      </l-formt-title>
                    </el-col>
                  </el-row>
                </div>
                <el-row :gutter="20" style="margin-top: 15px;padding:0 20px"
                        v-if="formDatas.payType1 == '7' || formDatas.payType2 == '7' || formDatas.payType3 == '7' || formDatas.payType4 == '7'">
                  <el-col :span="6">
                    <l-formt-title label="票号" :disabled="preSettleData.prepayBalance < 0">
                      <el-form-item label prop="checkNum">
                        <el-input v-model="formDatas.checkNum"
                                  :disabled="preSettleData.prepayBalance < 0"
                                  placeholder="" clearable
                        ></el-input>
                      </el-form-item>
                    </l-formt-title>
                  </el-col>
                  <el-col :span="6">
                    <l-formt-title label="银行名称" :disabled="preSettleData.prepayBalance < 0">
                      <el-form-item label prop="bankName">
                        <el-input v-model="formDatas.bankName"
                                  :disabled="preSettleData.prepayBalance < 0"
                                  placeholder="" clearable
                        ></el-input>
                      </el-form-item>
                    </l-formt-title>
                  </el-col>
                  <el-col :span="6">
                    <l-formt-title label="开户行" :disabled="preSettleData.prepayBalance < 0">
                      <el-form-item label prop="depositBank">
                        <el-input v-model="formDatas.depositBank"
                                  :disabled="preSettleData.prepayBalance < 0"
                                  placeholder="" clearable
                        ></el-input>
                      </el-form-item>
                    </l-formt-title>
                  </el-col>
                  <el-col :span="6">
                    <l-formt-title label="银行账号" :disabled="preSettleData.prepayBalance < 0">
                      <el-form-item label prop="bankAccount">
                        <el-input v-model="formDatas.bankAccount"
                                  :disabled="preSettleData.prepayBalance < 0"
                                  placeholder="" clearable
                        ></el-input>
                      </el-form-item>
                    </l-formt-title>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button style="width:80px" type="primary"
                         @click="checkConfirm">结算
              </el-button>
              <el-button style="width:80px" type="primary" plain @click="checkCancel">取消</el-button>
            </div>
          </el-dialog>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  // import LeftBar from "./dischargeLeftBar.vue";
  import {
    getOverPay,
    getItemDetails,
    getTotalItemDetails,
    postCharge,
    getPreSettle,
    recallPatient,
    logoutIn
  } from "@/api/ipnw/leaveHos";
  import service from "@/api/financeManagement/inp.js";
  import LeftBar from "../leftBar/dischargeSettleLeftBar";

  export default {
    name: "inpatientArea",
    components: {LeftBar},
    computed: {
      ...mapGetters("base", ["receivePatientData"]),
      ...mapGetters(["receivePatientData", "role"])
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
          (0 - this.preSettleData.prepayBalance)
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
        let realMoney2 = this.formDatas.realMoney2 || 0;
        if (rule1.test(value) === false) {
          callback(new Error("只能输入数字或两位小数"));
        } else if (value && value.indexOf(".") == 0) {
          callback(new Error("只能输入数字或两位小数"));
        } else if (value.toString().length > 10) {
          callback(new Error("只能输入十位数字!"));
        } else if ((Number(value) + Number(realMoney2)) < (0 - this.preSettleData.prepayBalance)) {
          callback(new Error("金额不足!"));
        } else if ((Number(value) + Number(realMoney2)) > (0 - this.preSettleData.prepayBalance)) {
          callback(new Error("补缴金额不能大于应付金额!"));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        let rule1 = /^(\d*)(\d*)(\.\d{1,2})?$/;
        let realMoney1 = this.formDatas.realMoney1 || 0;
        if (rule1.test(value) === false) {
          callback(new Error("只能输入数字或两位小数"));
        } else if (value && value.indexOf(".") == 0) {
          callback(new Error("只能输入数字或两位小数"));
        } else if (value.toString().length > 10) {
          callback(new Error("只能输入十位数字!"));
        } else if ((Number(value) + Number(realMoney1)) < (0 - this.preSettleData.prepayBalance)) {
          callback(new Error("金额不足!"));
        } else if ((Number(value) + Number(realMoney1)) > (0 - this.preSettleData.prepayBalance)) {
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
        } else if (value && value.indexOf(".") == 0) {
          callback(new Error("只能输入数字或两位小数"));
        } else if (value.toString().length > 10) {
          callback(new Error("只能输入十位数字!"));
        } else if ((Number(value) + Number(realMoney3)) < this.preSettleData.prepayBalance) {
          callback(new Error("找还金额不能小于预缴金余额!"));
        } else if ((Number(value) + Number(realMoney3)) > this.preSettleData.prepayBalance) {
          callback(new Error("找还金额不能大于预缴金余额!"));
        } else {
          callback();
        }
      };
      var validatePass4 = (rule, value, callback) => {
        let rule1 = /^(\d*)(\d*)(\.\d{1,2})?$/;
        let realMoney4 = this.formDatas.realMoney4 || 0;
        if (rule1.test(value) === false) {
          callback(new Error("只能输入数字或两位小数"));
        } else if (value && value.indexOf(".") == 0) {
          callback(new Error("只能输入数字或两位小数"));
        } else if (value.toString().length > 10) {
          callback(new Error("只能输入十位数字!"));
        } else if ((Number(value) + Number(realMoney4)) < this.preSettleData.prepayBalance) {
          callback(new Error("找还金额不能小于预缴金余额!"));
        } else if ((Number(value) + Number(realMoney4)) > this.preSettleData.prepayBalance) {
          callback(new Error("找还金额不能大于预缴金余额!"));
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
        if (this.formDatas.payType1 == '7' || this.formDatas.payType2 == '7' || this.formDatas.payType3 == '7' || this.formDatas.payType4 == '7') {
          if (value === '' || value === undefined || value === null) {
            callback(new Error("不能为空"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      return {
        tableParamsThree: [
          {
            label: "序号",
            prop: "No",
            width: "100",
            align: "left"
          },
          {
            label: "费用类型",
            prop: "type",
            width: "100",
            align: "left"
          },
          {
            label: "费用金额（元）",
            prop: "chargeAmount",
            align: "right"
          },
          {
            label: "医保金额（元）",
            prop: "medicalInsurance",
            width: "80",
            align: "right"
          },
          {
            label: "自付金额（元）",
            prop: "selfPayMoney",
            width: "100",
            align: "right"
          }
        ],
        payTableParams: [
          {
            label: "收据号",
            prop: "receiptNum",
            width: "100",
            align: "left"
          },
          {
            label: "交费时间",
            prop: "prepayTime",
            width: "100",
            align: "left"
          },
          {
            label: "预交金额",
            prop: "prepayMoney",
            align: "left"
          },
          {
            label: "支付方式",
            prop: "payTypeName",
            width: "100",
            align: "left"
          },
          {
            label: "操作员",
            prop: "regUserName",
            width: "100",
            align: "left"
          }
        ],
        dayTableParams: [
          {
            label: "项目类别",
            prop: "itemType",
            width: "100",
            align: "left"
          },
          {
            label: "项目代码",
            prop: "itemCode",
            width: "90",
            align: "left"
          },
          {
            label: "项目名称",
            prop: "itemName",
            width: "100",
            align: "left"
          },
          {
            label: "规格",
            prop: "spec",
            width: "80",
            align: "left"
          },
          {
            label: "单价（元）",
            prop: "unitPrice",
            width: "90",
            align: "right"
          },
          {
            label: "数量",
            prop: "amount",
            width: "70",
            align: "left"
          },
          {
            label: "金额（元）",
            prop: "chargeAmount",
            width: "90",
            align: "right"
          },
          {
            label: "执行时间",
            prop: "fillerTimePoint",
            width: "150",
            align: "left"
          }
        ],
        dayTableList: [],
        tableList: [],
        payTableList: [],
        payDate: "",
        isLoading: false,
        formParams: [
          "CourtyardArea",
          "technicalOffices",
          "illnessArea",
          "patientsType",
          "patientsState",
          "search"
        ], // 左侧搜索条件
        form: {
          date: "",
          time: "",
          state: "",
          leaveReason: ""
        },
        patientInfo: {},
        patientInfoKey: [
          {
            label: "姓名",
            key: "patientName",
            style: {}
          },
          {
            label: "性别",
            key: "patientGender",
            style: {}
          },
          {
            label: "年龄",
            key: "patientAge",
            style: {}
          },
          {
            label: "档案号",
            key: "patientCode",
            style: {
              color: "#3D7DFB"
            }
          },
          {
            label: "住院号",
            key: "inpCode",
            style: {
              color: "#3D7DFB"
            }
          },
          {
            label: "科室",
            key: "admissionSdeptId",
            style: {}
          },
          {
            label: "病区",
            key: "wardId",
            style: {}
          },
          {
            label: "入院日期",
            key: "finAdmissionTime",
            style: {}
          },
          {
            label: "天数",
            key: "dayNo",
            style: {}
          },
          {
            label: "结算日期",
            key: "settlementDay",
            style: {}
          },
          {
            label: "结算类型",
            key: "settlementType",
            style: {}
          }
        ],
        toolBoxs: [],
        payListShow: false,
        dayListShow: false,
        payType: "",
        dayList: {
          typeCount: "",
          total: "",
          itemQuantity: ""
        },
        bottomPay: {
          // 医保金额
          medicalInsurance: "",
          // 自费金额
          selfPay: "",
          // 应交金额
          totalCost: "",
          // 实收金额
          alreadyCharged: "",
          // 找零金额
          returnPay: ""
        },
        tableBottomPay: {
          totalCost: "",
          prePayMoney: ""
        },
        paymentMethod: {
          code: "",
          name: ""
        },
        // 预结算对象
        preSettleData: {
          totalMedicalAmount: 0, // 医疗总费用
          freePayAmount: 0, // 记账金额
          selfPayAmount: 0, // 自付金额
          totalPrepayAmount: 0, // 总自付预缴款
          prepayBalance: 0 // 余额 note: < 0, 补交 ; >0 找还
        },
        // 实收金额
        realMoney: 0,
        // 验证提示信息
        warning: "",
        // 找零金额
        backMoney: 0,
        // 表单数据
        formData: {
          payType: "",
          realMoney: 0
        },
        rules: {
          realMoney: [{validator: validatePass, trigger: "blur"}],
          payType: [
            {required: true, message: "请选择支付方式", trigger: "blur"}
          ]
        },
        rules1: {
          realMoney1: [{validator: validatePass1, trigger: "blur"}],
          realMoney2: [{validator: validatePass2, trigger: "blur"}],
          realMoney3: [{validator: validatePass3, trigger: "blur"}],
          realMoney4: [{validator: validatePass4, trigger: "blur"}],
          payType1: [{required: true, message: "请选择支付方式", trigger: "change"}, {
            validator: validatePass11,
            trigger: "change"
          }],
          payType2: [{required: true, message: "请选择支付方式", trigger: "change"}, {
            validator: validatePass22,
            trigger: "change"
          }],
          payType3: [{required: true, message: "请选择支付方式", trigger: "change"}, {
            validator: validatePass33,
            trigger: "change"
          }],
          payType4: [{required: true, message: "请选择支付方式", trigger: "change"}, {
            validator: validatePass44,
            trigger: "change"
          }],
          checkNum: [{validator: validateCheckNum, trigger: "blur"}],
          bankName: [{validator: validateCheckNum, trigger: "blur"}],
          depositBank: [{validator: validateCheckNum, trigger: "blur"}],
          bankAccount: [{validator: validateCheckNum, trigger: "blur"}]
        },
        checkShow: false,
        formDatas: {}
      };
    },
    watch: {
      receivePatientData: {
        //深度监听，可监听到对象、数组的变化
        handler(val) {
          // 已经财务出院的患者（别的界面带过来的）
          if (val.recordStatus && val.recordStatus == "4") {
            return;
          }
          this.patientInfo = {...val};
          // 计算天数
          this.getDayNo(this.patientInfo);
          //添加科室名称
          //        this.patientInfo.inpSdeptId=this.role.deptName;
          if (Object.keys(val).length === 0) {
            this.tableList = [];
            return;
          }
          this.getOverPay();
          this.getItemDetails();
          this.getTotalItemDetails();
          // this.getPreSettle();
          this.reset();
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      //注销入院
      logoutIn() {
        this.$showLoading();
        try {
          let params = {finAdId: this.receivePatientData.finAdId};
          let {code, data, msg} = logoutIn(params);
          if (code == 1) {
            this.$message.success('注销入院成功');
          } else {
            this.$message.error(msg || '注销入院失败')
          }
          this.$hideLoading();
        } catch (e) {
          this.$hideLoading();
          this.$message.error(e.msg || '注销入院失败')
        }
      },
      overPay() {
        this.payListShow = true;
      },
      async getTotalItemDetails() {
        this.tableList = [];
        let inpCode = this.receivePatientData.inpCode;
        let res = await getTotalItemDetails(inpCode);
        if (res.code === 1) {
          let tableData = res.data.itemChargeDetails || [];
          tableData.forEach((item, index) => {
            item.No = index + 1;
          });
          this.tableList = tableData;

          for (let key in this.bottomPay) {
            this.bottomPay[key] = res.data[key];
          }
          for (let key in this.tableBottomPay) {
            this.tableBottomPay[key] = res.data[key];
          }
          this.bottomPay.returnPay =
            this.bottomPay.totalCost - this.bottomPay.alreadyCharged;
        }
      },
      async getOverPay() {
        try {
          let res = await getOverPay({
            inpCode: this.receivePatientData.inpCode
          });
          if (res.code === 1) {
            this.payTableList = res.data;
          } else {
            this.$message.error(res.msg || "获取预交费明细错误");
          }
        } catch (error) {
          this.$message.error(error.errorMsg || "获取预交费明细错误");
        }
      },
      dateChange(a) {
        this.getItemDetails();
      },
      async getItemDetails() {
        try {
          let ajaxData = {
            inpCode: this.receivePatientData.inpCode,
            patientId: this.receivePatientData.patientId
          };
          if (this.payDate && this.payDate.length > 0) {
            ajaxData.startDate = this.payDate[0] + " 00:00:00";
            ajaxData.endDate = this.payDate[1] + " 23:59:59";
          }
          let res = await getItemDetails(ajaxData);
          if (res.code === 1) {
            res.data.chargeDetailList.pop(); // 删除最后一位
            this.dayTableList = res.data.chargeDetailList;
            for (let key in this.dayList) {
              this.dayList[key] = res.data[key];
            }
          } else {
            this.$message.error(res.msg || "获取费用清单错误");
          }
        } catch (error) {
          this.$message.error(error.errorMsg || "获取费用清单错误");
        }
      },
      payList() {
        this.dayListShow = true;
        this.payDate = "";
      },
      handleClick() {
        // tab 的切换方法
      },
      search(form) {
        // 查询方法
        // console.log("form:", form);
      },
      readCard() {
        // 读卡方法
      },
      confirm() {
        // 出院召回
        this.$confirm("是否召回此病人？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "执行中...";
              recallPatient({
                ...this.patientInfo,
                finAdId: "1",
                turnType: "1"
              })
                .then(res => {
                  done();
                  instance.confirmButtonLoading = false;
                  if (res.code === 1) {
                    this.$message.success("召回成功");
                  } else {
                    this.$message.error(res.msg || "召回失败");
                  }
                })
                .catch(err => {
                  done();
                  instance.confirmButtonLoading = false;
                  this.$message.error(err.msg || "召回失败");
                });
            } else {
              done();
              this.$message.info("取消召回");
            }
          }
        }).then();
      },
      cancel() {
        // 取消操作按钮
      },
      paymentMethodFun(a, b) {
        this.paymentMethod = b;
      },
      payTypeChange1(value, obj) {
        console.log(obj);
        this.formDatas['payTypeName1'] = obj.payTypeName;
        this.formDatas['payTypeCode1'] = obj.payTypeCode;
      },
      payTypeChange2(value, obj) {
        this.formDatas['payTypeName2'] = obj.payTypeName;
        this.formDatas['payTypeCode2'] = obj.payTypeCode;
      },
      payTypeChange3(value, obj) {
        this.formDatas['payTypeName3'] = obj.payTypeName;
        this.formDatas['payTypeCode3'] = obj.payTypeCode;
      },
      payTypeChange4(value, obj) {
        this.formDatas['payTypeName4'] = obj.payTypeName;
        this.formDatas['payTypeCode4'] = obj.payTypeCode;
      },
      //预结算弹框
      async isCheckShow() {
        await this.getPreSettle();
        this.checkShow = true;
      },
      // 财务出院预结算
      async getPreSettle() {
        this.$showLoading();
        try {
          let res = await getPreSettle({
            inpCode: this.receivePatientData.inpCode
          });
          if (res.code == 1) {
            this.preSettleData = res.data;
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
          this.$message.error(error.msg || "预结算失败");
        }
      },
      async handleCheckData() {
        let arr = [];
        if (this.preSettleData.prepayBalance < 0) {
          arr[0] = {
            finAdId: this.receivePatientData.finAdId,
            inpCode: this.receivePatientData.inpCode,
            businessType: "1",
            checkNum: this.formDatas.payType1 == '7' ? this.formDatas.checkNum : '',
            bankName: this.formDatas.payType1 == '7' ? this.formDatas.bankName : '',
            depositBank: this.formDatas.payType1 == '7' ? this.formDatas.depositBank : '',
            bankAccount: this.formDatas.payType1 == '7' ? this.formDatas.bankAccount : '',
            payTypeId: this.formDatas.payType1,
            payTypeName: this.formDatas.payTypeName1,
            payTypeCode: this.formDatas.payTypeCode1,
            prepayMoney: this.formDatas.realMoney1
          };
          arr[1] = {
            finAdId: this.receivePatientData.finAdId,
            inpCode: this.receivePatientData.inpCode,
            businessType: "1",
            checkNum: this.formDatas.payType2 == '7' ? this.formDatas.checkNum : '',
            bankName: this.formDatas.payType2 == '7' ? this.formDatas.bankName : '',
            depositBank: this.formDatas.payType2 == '7' ? this.formDatas.depositBank : '',
            bankAccount: this.formDatas.payType2 == '7' ? this.formDatas.bankAccount : '',
            payTypeId: this.formDatas.payType2,
            payTypeName: this.formDatas.payTypeName2,
            payTypeCode: this.formDatas.payTypeCode2,
            prepayMoney: this.formDatas.realMoney2
          };
        } else if (this.preSettleData.prepayBalance > 0) {
          arr[0] = {
            finAdId: this.receivePatientData.finAdId,
            inpCode: this.receivePatientData.inpCode,
            businessType: "1",
            checkNum: this.formDatas.payType3 == '7' ? this.formDatas.checkNum : '',
            bankName: this.formDatas.payType3 == '7' ? this.formDatas.bankName : '',
            depositBank: this.formDatas.payType3 == '7' ? this.formDatas.depositBank : '',
            bankAccount: this.formDatas.payType3 == '7' ? this.formDatas.bankAccount : '',
            payTypeId: this.formDatas.payType4,
            payTypeName: this.formDatas.payTypeName3,
            payTypeCode: this.formDatas.payTypeCode3,
            prepayMoney: '-' + this.formDatas.realMoney3
          };
          arr[1] = {
            finAdId: this.receivePatientData.finAdId,
            inpCode: this.receivePatientData.inpCode,
            businessType: "1",
            checkNum: this.formDatas.payType4 == '7' ? this.formDatas.checkNum : '',
            bankName: this.formDatas.payType4 == '7' ? this.formDatas.bankName : '',
            depositBank: this.formDatas.payType4 == '7' ? this.formDatas.depositBank : '',
            bankAccount: this.formDatas.payType4 == '7' ? this.formDatas.bankAccount : '',
            payTypeId: this.formDatas.payType4,
            payTypeName: this.formDatas.payTypeName4,
            payTypeCode: this.formDatas.payTypeCode4,
            prepayMoney: '-' + this.formDatas.realMoney4
          };
        } else {
          arr = [];
        }
        let params = {
          inpCode: this.receivePatientData.inpCode,
          payInputVOList: arr
        };
        return params;
      },
      async checkConfirm() {
        // 验证
        // eslint-disable-next-line consistent-return
        /*this.$refs["formDatas"].validate(async valid => {
          if (valid) {
            let prepayMoney =
              String(this.bottomPay.returnPay).indexOf("-") > -1
                ? Math.abs(this.bottomPay.returnPay)
                : "-" + String(this.bottomPay.returnPay);

            try {
              let data = {
                inpCode: this.receivePatientData.inpCode,
                businessType: 1,
                payTypeId: this.code,
                payTypeName: this.name,
                prepayMoney: prepayMoney,
                recordStatus: prepayMoney.indexOf("-") > -1 ? "9" : "1"
              };
              // 出院结算失败
              let res = await postCharge(data);
              if (res.code === 1) {
                this.$message.success("出院结算成功");
              } else {
                this.$message.error(res.msg || "出院结算错误");
              }
            } catch (error) {
              this.$message.error(error.errorMsg || "出院结算错误");
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });*/
        this.$refs["formDatas"].validate(async (valid) => {
          if (valid) {
            try {
              let params = await this.handleCheckData();
              // 出院结算失败
              let res = await postCharge(params);
              if (res.code === 1) {
                this.$message.success("出院结算成功");
                this.$refs['formDatas'].resetFields();
                this.checkShow = false;
              } else {
                this.$message.error(res.msg || "出院结算错误");
              }
            } catch (error) {
              // this.$message.error(error.errorMsg || "出院结算错误");
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      checkCancel() {
        this.checkShow = false;
        this.$refs['formDatas'].resetFields();
      },
      checkShowClose() {
        this.$refs['formDatas'].resetFields();
      },
      messageHandler() {
        console.log("工具箱消息");
      },
      // 计算患者入院天数
      getDayNo(patientInfo) {
        let nowDate = new Date().getTime();
        let inpDate = new Date(patientInfo.wdeptAdmissionTime).getTime();
        let dayNo = Math.floor((nowDate - inpDate) / (60 * 60 * 24 * 1000)) || 0; // 向下取整
        if (dayNo == 0) {
          dayNo = 1;
        }
        this.$set(patientInfo, "dayNo", dayNo);
      },
      // 重置数据
      reset() {
        // 实收金额
        this.formData.realMoney = 0;
        // 找零金额'
        this.backMoney = 0;
        if (this.$refs["formData"].resetFields()) {
          this.$refs["formData"].resetFields();
        }
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
    }
  };
</script>

<style lang="scss" scoped>
  .some-button {
    padding-top: 19px;
    border-top: 1px solid $l-color-bgcolor-18;
  }

  .recall-content-box {
    // border-top: 1px solid #E4E4E4;
    padding: 0 20px;

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

    ul {
      li {
        height: 60px;
        font-size: 16px;
        
        font-weight: bold;
        color: rgba(46, 50, 58, 1);
        line-height: 24px;

        p {
          margin: 0;
          line-height: 60px;

          span {
            padding: 0 5px;
          }

          .black {
            color: #2e323a;
          }

          .blue {
            color: #3d7dfb;
          }

          .gray {
            color: #949da3;
          }

          .em {
            font-weight: 600;
          }

          img {
            width: 60px;
          }
        }
      }
    }

    .user-info {
      .info {
        margin: 10px 0;

        & > div {
          overflow: hidden;

          p {
            width: 240px;
            font-size: 14px;
            line-height: 20px;
            margin: 10px 0;
            float: left;

            .babel {
              color: #949da3;
              display: inline-block;
              width: 56px;
              margin-right: 10px;
            }
          }
        }
      }
    }

    .out-info {
      .info {
        margin: 20px 0;
        overflow: hidden;

        & > p {
          width: 240px;
          height: 36px;
          line-height: 36px;
          /*border: 1px solid #e4e4e4;*/
          border-radius: 2px;
          margin-right: 10px;
          margin-bottom: 10px;
          float: left;
          color: #2e323a;
          background: rgba(245, 245, 245, 1);

          .babel {
            color: #949da3;
            margin-left: 10px;
            margin-right: 10px;
            padding-right: 10px;
            border-right: 1px solid #e4e4e4;
          }
        }

        & > p:first-child {
          margin-left: 0px;
        }
      }
    }
  }

  .label {
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(148, 157, 163, 1);
    line-height: 20px;
    vertical-align: middle;
  }

  .labelContent {
    font-size: 14px;
   
    font-weight: bold;
    color: rgba(46, 50, 58, 1);
    margin-left: 10px;
    vertical-align: middle;
  }

  .topPart > span {
    vertical-align: 12px;
  }

  .error {
    color: #e1140a;
  }

  // 修改 结算清单内时间选择器的清空按钮位置
  /deep/ .el-date-editor .el-range__close-icon {
    position: absolute;
    right: 0px;
  }

  .dialog-footer {
    height: 40px;
    width: 100%;
  }

  .footBtn {
    float: right;
    margin-right: 20px;
  }

  .checkShow-cont {
    padding: 20px;
  }
</style>
