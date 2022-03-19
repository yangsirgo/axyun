<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :append-to-body="true" top="5vh">
    <div slot="title">
      <div style="display: flex; justify-content: space-between">
        <div style="font-size: 18px; font-weight: bold">退费结算</div>
        <div style="display: flex">
          <div>退发票</div>
          <i class="el-icon-right"></i>
          <div>撤销结算</div>
          <i class="el-icon-right"></i>
          <div>（部分退费）医保预结算（自动）</div>
          <i class="el-icon-right"></i>
          <div>确认结算</div>
        </div>
        <div style="margin-right: 30px">
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
          <el-button type="primary" @click="jumpCode">跳号</el-button>
          <el-button type="primary" @click="getNextReceiptNum">刷新</el-button>
          <el-button type="primary" @click="billsUse">票据启用</el-button>
        </div>
      </div>
    </div>
    <div class="return-premium" v-loading="loading">
      <div class="top">
        <div class="left">
          <div class="title display-flex" style="margin-bottom:8px;">
            <div>原交易结算详情</div>
            <div><el-button type="primary" @click="getHisTradeId(0)" :disabled="siDetailOldDisabled">医保明细</el-button></div>
          </div>
          <div class="item">
            <span class="itemLabel">结算类型</span>
            <div class="valueArea">
              {{
                info.originalTradeOutpPreSettlementResultVO2
                  .settlementTypeName || ""
              }}
            </div>
          </div>
          <div class="item">
            <span class="itemLabel">合计金额</span>
            <div class="valueArea">
              {{
                formatPrice(
                  info.originalTradeOutpPreSettlementResultVO2.feeAmount
                )
              }}
            </div>
          </div>
          <div class="item">
            <span class="itemLabel">医保支付金额</span>
            <div class="valueArea">
              {{
                formatPrice(
                  info.originalTradeOutpPreSettlementResultVO2.freePayMoney
                )
              }}
            </div>
          </div>
          <div class="item">
            <span class="itemLabel">减免金额</span>
            <div class="valueArea">
              {{
                formatPrice(
                  info.originalTradeOutpPreSettlementResultVO2.derateAmount
                )
              }}
            </div>
          </div>
          <div class="item">
            <span class="itemLabel">个人自付</span>
            <div class="valueArea">
              {{
                formatPrice(
                  info.originalTradeOutpPreSettlementResultVO2.selfPayMoney
                )
              }}
            </div>
          </div>
          <div class="item">
            <span class="itemLabel">实际自付金额</span>
            <div class="valueArea">
              {{
                formatPrice(
                  info.originalTradeOutpPreSettlementResultVO2
                    .actualSelfPayMoney || 0.0
                )
              }}
            </div>
          </div>
          <div class="item">
            <span class="itemLabel">原交易发票号码</span>
            <div
              class="valueArea"
              :style="{ color: info.receiptStatus == '1' ? '' : 'black' }"
            >
              {{ info.receiptNum }}
            </div>
          </div>
          <!-- <div style="text-align: right;">
            <el-button type="primary">退发票</el-button>
            <el-button type="primary">撤销结算</el-button>
          </div> -->
          <div class="title display-flex" style="margin-bottom:8px;">
            <div>现交易结算详情</div>
            <div><el-button type="primary" @click="getHisTradeId(1)" :disabled="siDetailNewDisabled">医保明细</el-button></div>
          </div>
          <div class="item">
            <span class="itemLabel">结算类型</span>
            <div class="valueArea">
              {{
                (info.rechargeTradeoutpPreSettlementResultVO2 &&
                  info.rechargeTradeoutpPreSettlementResultVO2
                    .settlementTypeName) ||
                ""
              }}
            </div>
          </div>
          <div class="item">
            <span class="itemLabel">合计金额</span>
            <div class="valueArea">
              {{
                formatPrice(
                  (info.rechargeTradeoutpPreSettlementResultVO2 &&
                    info.rechargeTradeoutpPreSettlementResultVO2.feeAmount) ||
                    0
                )
              }}
            </div>
          </div>
          <div class="item">
            <span class="itemLabel">医保支付金额</span>
            <div class="valueArea">
              {{
                formatPrice(
                  (info.rechargeTradeoutpPreSettlementResultVO2 &&
                    info.rechargeTradeoutpPreSettlementResultVO2
                      .freePayMoney) ||
                    0
                )
              }}
            </div>
          </div>
          <div class="item">
            <span class="itemLabel">减免金额</span>
            <div class="valueArea">
              {{
                formatPrice(
                  (info.rechargeTradeoutpPreSettlementResultVO2 &&
                    info.rechargeTradeoutpPreSettlementResultVO2
                      .derateAmount) ||
                    0
                )
              }}
            </div>
          </div>
          <div class="item">
            <span class="itemLabel">个人自付</span>
            <div class="valueArea">
              {{
                formatPrice(
                  (info.rechargeTradeoutpPreSettlementResultVO2 &&
                    info.rechargeTradeoutpPreSettlementResultVO2
                      .selfPayMoney) ||
                    0
                )
              }}
            </div>
          </div>
          <!-- <div style="text-align: right;">
            <el-button type="primary">预结算</el-button>
          </div> -->
        </div>
        <div class="right" v-if="settlementType == '3' && isNewSurance == '01'">
          <div class="title" style="margin-bottom: 8px">医保挂号信息</div>
          <LFormtTitle label="患者姓名">
            <el-input
              v-model="patientInfo.siPatientDto.patientName"
              disabled
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="医保电脑号">
            <el-input
              v-model="patientInfo.siPatientDto.patientCode"
              disabled
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="证件类型">
            <!-- <el-input
              v-model="patientInfo.siPatientDto.identificationType"
              disabled
            ></el-input> -->
            <span class="content">{{
              transform("AAC058", patientInfo.siPatientDto.identificationType)
            }}</span>
          </LFormtTitle>
          <LFormtTitle label="证件号">
            <el-input
              v-model="patientInfo.siPatientDto.identificationNum"
              disabled
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="社会保障号">
            <el-input
              v-model="patientInfo.siPatientDto.siCardPatientCode"
              disabled
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="参保类型">
            <!-- <el-input
              v-model="patientInfo.siPatientDto.insuranceCrowdType"
              disabled
            ></el-input> -->
            <span class="content">{{
              transform("AAC066", patientInfo.siPatientDto.insuranceCrowdType)
            }}</span>
          </LFormtTitle>
          <LFormtTitle label="高血压标识">
            <!-- <el-input
              v-model="patientInfo.siPatientDto.hypertensionFlag"
              disabled
            ></el-input> -->
            <span class="content">{{
              patientInfo.siPatientDto.hypertensionFlag ? "是" : "否"
            }}</span>
          </LFormtTitle>
          <LFormtTitle label="糖尿病标识">
            <!-- <el-input
              v-model="patientInfo.siPatientDto.diabetesFlag"
              disabled
            ></el-input> -->
            <span class="content">{{
              patientInfo.siPatientDto.diabetesFlag ? "是" : "否"
            }}</span>
          </LFormtTitle>
          <LFormtTitle label="医疗证号">
            <el-input
              v-model="patientInfo.siPatientDto.cardNum"
              disabled
            ></el-input>
          </LFormtTitle>
          <div class="title" style="margin: 8px 0">结算信息</div>
          <LFormtTitle label="医疗类别">
            <!-- <el-select
              filterable
              disabled
              v-model="form.medicalTypeCode"
              placeholder="请选择"
            >
              <el-option
                v-for="item in ylOption"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select> -->
            <span class="content">{{
              transform("AKA130", patientInfo.siRegDto.medicalTypeCode)
            }}</span>
          </LFormtTitle>
          <LFormtTitle label="主疾病编码">
            <el-select
              v-model="patientInfo.siRegDto.mainDiagCode"
              clearable
              filterable
              remote
              placeholder="请输入关键词"
              disabled
              :remote-method="getDiseaseDirectoryList1"
              :loading="loading2"
              @clear="clearOption"
            >
              <el-option
                v-for="(item, index) in options1"
                :key="index"
                :label="item.aka121"
                :value="item.aka120"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="次疾病编码1">
            <el-select
              v-model="patientInfo.siRegDto.firstDiagCode"
              clearable
              filterable
              remote
              placeholder="请输入关键词"
              disabled
              :remote-method="getDiseaseDirectoryList2"
              :loading="loading2"
              @clear="clearOption"
            >
              <el-option
                v-for="(item, index) in options2"
                :key="index"
                :label="item.aka121"
                :value="item.aka120"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="次疾病编码2">
            <el-select
              v-model="patientInfo.siRegDto.secondDiagCode"
              clearable
              filterable
              remote
              placeholder="请输入关键词"
              disabled
              :remote-method="getDiseaseDirectoryList3"
              :loading="loading2"
              @clear="clearOption"
            >
              <el-option
                v-for="(item, index) in options3"
                :key="index"
                :label="item.aka121"
                :value="item.aka120"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="大病类别">
            <!-- <el-select
              filterable
              disabled
              v-model="form.bigDiseaseTypeCode"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dbOption"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select> -->
            <span class="content">{{
              transform("CKA303", patientInfo.siRegDto.bigDiseaseTypeCode)
            }}</span>
          </LFormtTitle>
          <LFormtTitle label="特检类别">
            <!-- <el-select
              filterable
              disabled
              v-model="form.specialSurveyTypeCod"
              placeholder="请选择"
            >
              <el-option
                v-for="item in tjOption"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select> -->
            <span class="content">{{
              transform("CKA304", patientInfo.siRegDto.specialSurveyTypeCod)
            }}</span>
          </LFormtTitle>
          <LFormtTitle label="门诊慢性病种">
            <!-- <el-select
              filterable
              disabled
              v-model="form.chronicDiseaseCode"
              placeholder="请选择"
            >
              <el-option
                v-for="item in mbOption"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select> -->
            <span class="content">{{
              chronicDiseaseCode[patientInfo.siRegDto.chronicDiseaseCode]
            }}</span>
          </LFormtTitle>
          <LFormtTitle label="休假天数">
            <el-input
              disabled
              v-model="patientInfo.siRegDto.daysOff"
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="打包收费编码">
            <el-input
              disabled
              v-model="patientInfo.siRegDto.packChareCode"
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="先行支付决定书编号">
            <el-input
              disabled
              v-model="patientInfo.siRegDto.prePayBillNum"
            ></el-input>
          </LFormtTitle>
          <!-- <LFormtTitle label="工伤事故编号">
            <el-input
              disabled
              v-model="form.accidentWorkInjuryCode"
            ></el-input>
          </LFormtTitle> -->
          <div class="title" style="margin: 8px 0">生育医疗</div>
          <LFormtTitle label="孕周">
            <el-input
              disabled
              type="number"
              v-model="patientInfo.siRegDto.gestationWeeks"
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="计生证号">
            <el-input
              disabled
              v-model="patientInfo.siRegDto.maternityNum"
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="建册日期">
            <el-date-picker
              disabled
              v-model="patientInfo.siRegDto.archiveDate"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            >
            </el-date-picker>
          </LFormtTitle>
        </div>
        <div
          class="right"
          v-else-if="settlementType == '3' && isNewSurance == '02'"
        >
          <div class="title" style="margin-bottom: 8px">患者基本信息</div>
          <LFormtTitle
            :label="item.label"
            v-for="(item, index) in siPatientDtoLists"
            :key="index"
          >
            <div v-if="item.prop == 'identificationType'" class="span-content">
              {{
                transformNew(
                  "psn_cert_type",
                  patientInfo.siPatientDto[item.prop]
                )
              }}
            </div>
            <div v-else-if="item.prop == 'gender'" class="span-content">
              {{ transformNew("gend", patientInfo.siPatientDto[item.prop]) }}
            </div>
            <div v-else-if="item.prop == 'nation'" class="span-content">
              {{ transformNew("naty", patientInfo.siPatientDto[item.prop]) }}
            </div>
            <div v-else-if="item.prop == 'age'" class="span-content">
              <div v-if="patientInfo.siPatientDto[item.prop]">
                {{ patientInfo.siPatientDto[item.prop] }}岁
              </div>
            </div>
            <div v-else-if="item.prop == 'personPropertyType'" class="span-content">
              {{ transformNew("clctstd_crtf_rule_codg", patientInfo.siPatientDto[item.prop]) }}
            </div>
            <div v-else class="span-content">
              {{ patientInfo.siPatientDto[item.prop] }}
            </div>
          </LFormtTitle>
          <div class="title" style="margin-bottom: 8px">其他信息</div>
          <LFormtTitle label="医疗类别">
            <el-select
              clearable
              disabled
              v-model="patientInfo.siRegDto.medicalTypeCode"
              placeholder="请选择"
            >
              <el-option
                v-for="item in medicalTypeList"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="险种类型">
            <el-select
              clearable
              disabled
              v-model="patientInfo.siRegDto.insuranceTypeCode"
              placeholder="请选择"
            >
              <el-option
                v-for="item in insutypeInitList"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="特慢病">
            <el-select
              clearable
              disabled
              filterable
              v-model="patientInfo.siRegDto.chronicDiseaseCode1"
              placeholder="请选择"
            >
              <el-option
                v-for="(item,index) in outpSpecialOptions"
                :key="index"
                :label="item.mmmtbzmc"
                :value="item.mmmtbzmldm"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="结算病种">
            <el-select
              clearable
              disabled
              v-model="patientInfo.siRegDto.chronicDiseaseCode2"
              placeholder="请选择"
            >
              <el-option
                v-for="(item,index) in payperDiseOptions"
                :key="index"
                :label="item.abzjsbzmc"
                :value="item.abzjsbzmldm"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="计生手术类别">
            <el-select
              clearable
              disabled
              v-model="patientInfo.siRegDto.birctrlType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in birctrlTypeList"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="计生日期">
            <el-date-picker
              v-model="patientInfo.siRegDto.birctrlMatnDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              disabled
            >
            </el-date-picker>
          </LFormtTitle>
          <LFormtTitle label="账户使用标志">
            <div style="height: 32px; padding: 5px 0 0 8px">
              <el-radio v-model="patientInfo.siRegDto.personalAccountUserFlag" label="1" disabled
                >是</el-radio
              >
              <el-radio v-model="patientInfo.siRegDto.personalAccountUserFlag" label="0" disabled
                >否</el-radio
              >
            </div>
          </LFormtTitle>
        </div>
        <div class="right" v-else></div>
      </div>
    </div>
    <div slot="footer">
      <div class="bottom">
        <div class="item">
          <span class="itemLabel">应退款金额</span>
          <div class="valueArea">
            {{ formatPrice(Math.abs(info.totalSelfPayBalance)) }}
          </div>
        </div>
        <div style="display: flex">
          <div class="item" v-if="payType.length">
            <span class="itemLabel" style="margin-right: 16px"
              >退款支付方式</span
            >
            <div
              v-for="(item, index) in payType"
              :key="index"
              style="display: flex; align-items: center"
            >
              <span style="width: 200px; margin-left: 0" class="valueArea">{{
                item.payTypePO.payTypeName
              }}</span>
              <span style="margin-left: 32px"
                >{{
                  info.totalWaitSelfPayBalance > 0 ? "缴款" : "退款"
                }}金额(元)</span
              >
              <div style="width: 200px" class="valueArea">
                {{ formatPrice(Math.abs(item.defaultRefundAmt)) }}
              </div>
            </div>
          </div>
          <!-- <div class="item">
            <span class="itemLabel">实际退款金额</span>
            <div class="valueArea">
              {{ formatPrice(Math.abs(info.totalWaitSelfPayBalance)) }}
            </div>
          </div> -->
          <div class="item" v-if="payType.length">
            <span class="itemLabel">抹零金额</span>
            <div style="width: 200px" class="valueArea">
              {{ Math.abs(unChargeSmallChange) }}
            </div>
          </div>
        </div>
      </div>
      <div class="btn-box">
        <el-button
          type="primary"
          @click="cancelSettlement"
          v-if="info.originalTradeCancelFlag === '0'"
          :loading="cancelSettlementLoading"
          >撤销结算</el-button
        >
        <el-button
          type="primary"
          @click="returnPremium"
          v-if="info.originalTradeCancelFlag !== '0' && info.originalTradeCancelFlag !== ''"
          :loading="returnPremiumLoading"
          >退费结算</el-button
        >
        <el-button plain @click="cancelHandle">取消</el-button>
      </div>
    </div>
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
    <LSidetailTable
      :hisTradeId="hisTradeId"
      v-if="sidetailTableVisible"
      title="医保明细"
      width="1300px"
      :visible.sync="sidetailTableVisible"
      @cancel="sidetailTableClose"
    ></LSidetailTable>
    <printNameseter
      v-if="printNameseterVisible"
      title="打印机设置"
      width="800px"
      :visible.sync="printNameseterVisible"
      :requiredName="requiredName"
      @closePrintSeterFuc="closePrintSeterFuc"
    ></printNameseter>
  </el-dialog>
</template>

<script>
import service from "@/api/cis/settleAccount/index.js";
import service2 from "@/api/cis/receiptPrint/receiptPrint";
import healthInsuranceService from "@/api/healthInsurance/index.js";
import { preview, onPreview, getMacLoaction } from "@/utils/print";
import appointment from "@/api/appointment/appointment.js";
import formatNum from "@/utils/formatPrice.js";
import NP from "number-precision";
import useSelect from "@/views/finance/receiptManager/components/useSelect";

import codes from "@/printTemplete/code.js";
import { getPrintTpl } from "@/api/admin/print/print";
import { print, getPrinterList } from "@/utils/print_new";
import { createData } from "@/printTemplete/module/financeLodopTpl.js";
import { siPatientDtoList } from "@/views/medicalInsuranceNew/common/patientHealthInfo.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";
import { thermosensitiveTpl, thermosensitiveErrorTpl, handleThermosensiPrintData } from "@/printTemplete/module/thermosensitiveTpl.js";
import { deepClone } from "@/utils/index.js";

export default {
  name: "returnPreDialog",
  mixins: [getDictInfoNew],
  components: {
    useSelect,
  },
  props: {
    refundApplyData: {
      type: String,
      default: "",
    },
  },
  computed: {
    siDetailOldDisabled() {
      let obj = this.info.originalTradeOutpPreSettlementResultVO2;
      return obj && obj.settlementType === "1";
    },
    siDetailNewDisabled() {
      let obj = this.info.originalTradeOutpPreSettlementResultVO2;
      let objNum = this.info.rechargeTradeoutpPreSettlementResultVO2;
      return (obj && obj.settlementType === "1") || !objNum || objNum.feeAmount == 0;
    },
    siPatientDtoLists() {
      return siPatientDtoList;
    }
  },
  data() {
    return {
      chronicDiseaseCode: {
        "01": "糖尿病",
        "02": "高血压",
      },
      loading: false,
      info: {
        originalTradeOutpPreSettlementResultVO2: {},
        originalOutpTradeSettleAmtSumVOS: {},
        outpRefundSettlementAmtChannelVOS: [],
        rechargeTradeoutpPreSettlementResultVO2: {},
      },
      payType: [],
      unChargeSmallChange: 0,
      // 新功能-收费成功自动打印
      nextReceiptNumOutPO: {},
      // 本机主MAC地址
      currentMac: "",
      receiptContent: {}, //打印数据
      receiptType: "", //票据类型
      btuLoading: false, //票号loading
      //票据启用
      dialogVisible: false,
      inBillForm: {
        outType: "1", //出库类型
        receiveUserId: "", //领用人员
        receiptType: "", //票据类型
        abortStatus: "0", //终止标识
      },
      patientInfo: {
        siPatientDto: {},
        siRegDto: {},
      },
      options1: [],
      options2: [],
      options3: [],
      ylOption: [],
      allDbInfo: [],
      dbOption: [],
      tjOption: [],
      mbOption: [],
      form: {
        medicalTypeCode: "",
        mainDiagCode: "",
        firstDiagCode: "",
        secondDiagCode: "",
        bigDiseaseTypeCode: "",
        specialSurveyTypeCod: "",
        chronicDiseaseCode: "",
        daysOff: "",
        packChareCode: "",
        prePayBillNum: "",
        accidentWorkInjuryCode: "",
        gestationWeeks: "",
        maternityNum: "",
        archiveDate: "",
      },
      loading2: false,
      returnPremiumLoading: false,
      cancelSettlementLoading: false,
      sidetailTableVisible: false,
      hisTradeId: "",
      settlementType: "",
      isNewSurance: "", //识别新医保还是旧医保
      medicalTypeList: [],
      birctrlTypeList: [],
      insutypeInitList: [],
      printNameseterVisible: false,
      requiredName: ""
    };
  },
  async mounted() {
    // //获取医疗类别
    // this.ylOption = await this.getDictListBySiDictCatalogId({
    //   siDictCatalogCode: "AKA130",
    //   medicareType: "01",
    // });
    // //获取大病类别
    // this.allDbInfo = await this.getDictListBySiDictCatalogId({
    //   siDictCatalogCode: "CKA303",
    //   medicareType: "01",
    // });
    // //获取特检类别
    // this.tjOption = await this.getDictListBySiDictCatalogId({
    //   siDictCatalogCode: "CKA304",
    //   medicareType: "01",
    // });
    this.getDiseaseDirectoryList1("");
    this.getDiseaseDirectoryList2("");
    this.getDiseaseDirectoryList3("");
    this.getSettlement();
    await this.getDictionaryPO();
    this.getNextReceiptNum();
    this.getDictNew("med_type").then((res) => {this.medicalTypeList = res;});
    this.getDictNew("birctrl_type").then((res) => {this.birctrlTypeList = res;});
    this.getDictNew("insutype").then((res) => {this.insutypeInitList = res;});
    this.getOutpSpecial();
    this.getPayperDise();
  },
  methods: {
    transform(code, val) {
      let dictInfo = JSON.parse(localStorage.getItem("dictInfo"));
      let currDictInfo = [];
      for (let i in dictInfo) {
        if (dictInfo[i].dictCatalogCode === code) {
          currDictInfo = dictInfo[i].dictVOS;
        }
      }
      for (let j in currDictInfo) {
        if (currDictInfo[j].dictCode == val) {
          return currDictInfo[j].dictName;
        }
      }
      return "";
    },
    clearOption() {
      this.options1 = [];
      this.options2 = [];
      this.options3 = [];
    },
    isZF() {
      return this.settlementType == "1" ? true : false;
    },
    async getDiseaseDirectoryList1(keyWords) {
      this.loading2 = true;
      let res = await appointment.getDiseaseDirectoryList({
        keyWords,
        pageNo: 1,
        pageSize: 50,
      });
      this.loading2 = false;
      this.options1 = res.data;
    },
    async getDiseaseDirectoryList2(keyWords) {
      this.loading2 = true;
      let res = await appointment.getDiseaseDirectoryList({
        keyWords,
        pageNo: 1,
        pageSize: 50,
      });
      this.loading2 = false;
      this.options2 = res.data;
    },
    async getDiseaseDirectoryList3(keyWords) {
      this.loading2 = true;
      let res = await appointment.getDiseaseDirectoryList({
        keyWords,
        pageNo: 1,
        pageSize: 50,
      });
      this.loading2 = false;
      this.options3 = res.data;
    },
    async getDictListBySiDictCatalogId(param) {
      let res = await appointment.getDictListBySiDictCatalogId(param);
      return res.data;
    },
    async getDictionaryPO() {
      try {
        let res = await service2.getDictionaryPO({
          itemCode: "F0016",
          valueCode: "00",
        });
        if (res.code == 1) {
          this.receiptType = res.data.dictionaryValue;
          this.inBillForm.receiptType = res.data.dictionaryValue;
        }
      } catch (error) {
        this.$message.error(error.msg || "获取票据类型失败");
      }
    },
    // 获取下一张票据号
    async getNextReceiptNum(done) {
      try {
        this.nextReceiptNumOutPO = {};
        this.btuLoading = true;
        if (!this.currentMac) {
          let mac = {
            value: "",
          };
          getMacLoaction(mac)
            .then(async (res2) => {
              this.currentMac = res2;
              let res = await service2.getNextReceiptNum({
                receiptType: this.receiptType,
                useMacLoaction: this.currentMac || undefined,
              });
              if (!res.data) {
                this.$message.error("未找到当前登录人的领用票据信息");
                this.btuLoading = false;
                return;
              }
              this.nextReceiptNumOutPO = res.data;
              this.btuLoading = false;
            })
            .catch(() => {
              this.btuLoading = false;
            });
        } else {
          let res = await service2.getNextReceiptNum({
            receiptType: this.receiptType,
            useMacLoaction: this.currentMac || undefined,
          });
          if (!res.data) {
            this.$message.error("未找到当前登录人的领用票据信息");
            this.btuLoading = false;
            return;
          }
          this.nextReceiptNumOutPO = res.data;
          this.btuLoading = false;
        }
      } catch (error) {
        console.info(error);
        this.btuLoading = false;
        this.$message.error(error.msg || "获取下一张票据号失败");
      }
      if (done) {
        done();
      }
    },
    //跳号
    async jumpCode() {
      try {
        this.btuLoading = true;
        let obj = {
          outId: this.nextReceiptNumOutPO.outId,
          receiptStartNum: this.nextReceiptNumOutPO.nextReceiptNum,
          receiptStopNum: this.nextReceiptNumOutPO.nextReceiptNum + 1,
        };
        let res = await service2.receiptJumpNum(obj);
        this.btuLoading = false;
        if (res.code == "1") {
          this.getNextReceiptNum();
          this.$message({
            type: "success",
            message: "跳号成功",
          });
        } else {
          this.$message.error(res.msg || "跳号失败");
        }
      } catch (error) {
        this.btuLoading = false;
        this.$message.error(error.msg || "跳号失败");
      }
    },
    //票据启用
    billsUse() {
      this.dialogVisible = true;
    },
    // 金额格式化，千位分割，小数点2位
    formatPrice(a) {
      if (!a && a !== 0) {
        return "";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    getSettlement() {
      // 退费申请预结算
      this.$showLoading();
      service
        .refundPreSettlement(this.refundApplyData)
        .then((res) => {
          if (res.code === 1) {
            this.$message.success(res.msg || "退费预结算成功!");
            this.settlementSure(res.data);
          } else {
            this.$message.error(res.msg || "退费预结算失败!");
          }
          this.$hideLoading();
        })
        .catch((err) => {
          this.$hideLoading();
          this.$message.error(err.msg || "退费预结算失败!");
        });
    },
    // 退费预结算成功后显示界面
    async settlementSure(data) {
      this.info = data;
      //
      if (data && data.originalTradeCancelFlag !== "0") {
        // 收费0元的时候没有支付方式
        const list =
          data && data.outpRefundSettlementAmtChannelVOS
            ? data.outpRefundSettlementAmtChannelVOS
            : [];
        //预结算成功后进行抹零
        for (let i = 0; i < list.length; i++) {
          if (list[i].payTypePO.permitChangeFlag === "1") {
            this.unChargeSmallChange = NP.minus(
              list[i].defaultRefundAmt,
              this.doMl(list[i].defaultRefundAmt)
            );
            list[i].defaultRefundAmt = this.doMl(list[i].defaultRefundAmt);
          }
        }
        this.payType = list.map((item) => {
          return {
            ...item,
            defaultRefundAmt: Math.abs(item.defaultRefundAmt),
          };
        });
      }

      this.patientInfo = data.originalSiSettlementInfoDto;
      // 识别新医保还是旧医保
      let settlementType =
        data.originalTradeOutpPreSettlementResultVO2.settlementType;
      this.settlementType = settlementType;
      if (settlementType === "3") {
        await this.getPayBySettlementType();
        if (this.isNewSurance == "02") {
        } else if (this.isNewSurance == "01") {
          if (data.originalSiSettlementInfoDto) {
          }
        }
      }
    },
    // 如果是医保，调用接口查看是新医保还是旧医保，对应选择要展示的医保界面
    async getPayBySettlementType() {
      this.isNewSurance = "";
      try {
        let params = {
          settlementType: this.settlementType,
        };
        let res = await healthInsuranceService.getPayBySettlementType(params);
        if (res.code === 1) {
          this.isNewSurance = res.data.thirdPartyPayTypeCode;
        }
      } catch (error) {}
    },
    cancelSettlement() {
      if (
        // this.info.originalTradeOutpPreSettlementResultVO2.receiptStatus == 1
        this.info.receiptStatus == 1
      ) {
        this.$confirm(
          "撤销交易存在有效发票" + this.info.receiptNum + "，请确认已回收",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.cancelSettlementLoading = true;
            this.$showLoading();
            // 撤销结算
            service
              .refundCancelSettlement(this.refundApplyData)
              .then((res) => {
                if (res.code === 1) {
                  this.info.originalTradeCancelFlag = "";
                  this.getSettlement();
                  this.cancelSettlementLoading = false;
                  this.$hideLoading();
                  this.$message.success(res.msg || "撤销成功!");
                } else {
                  this.cancelSettlementLoading = false;
                  this.$hideLoading();
                  this.$message.error(res.msg || "撤销失败!");
                }
              })
              .catch((err) => {
                this.cancelSettlementLoading = false;
                this.$hideLoading();
                this.$message.error(err.msg || "撤销失败!");
              });
          })
          .catch(() => {});
      } else {
        this.cancelSettlementLoading = true;
        this.$showLoading();
        // 撤销结算
        service
          .refundCancelSettlement(this.refundApplyData)
          .then((res) => {
            if (res.code === 1) {
              this.info.originalTradeCancelFlag = "";
              this.getSettlement();
              this.cancelSettlementLoading = false;
              this.$hideLoading();
              this.$message.success(res.msg || "撤销成功!");
            } else {
              this.cancelSettlementLoading = false;
              this.$hideLoading();
              this.$message.error(res.msg || "撤销失败!");
            }
          })
          .catch((err) => {
            this.cancelSettlementLoading = false;
            this.$hideLoading();
            this.$message.error(err.msg || "撤销失败!");
          });
      }
    },
    returnPremium() {
      // 退费
      const priceAmt = this.payType.reduce((total, cur) => {
        return (cur.defaultRefundAmt * 100 + total * 100) / 100;
      }, 0);
      // 所有支付方式的金额之和             待退款金额
      // if (priceAmt !== Math.abs(this.info.totalWaitSelfPayBalance)) {
      //   const msg = this.info.totalWaitSelfPayBalance > 0 ? "支付" : "退费";
      //   this.$message.warning(`找还金额不等于待${msg}自付差额!`);
      //   return;
      // }
      let flag = false;
      if (this.info.totalWaitSelfPayBalance < 0) {
        flag = true;
      }
      // let maxML =  Math.abs(this.info.totalWaitSelfPayBalance) - Number(parseInt(Math.abs(this.info.totalWaitSelfPayBalance) * 10) / 10);
      // let unChargeSmallChange = 0;
      // this.payType.forEach(item => {
      //   if(item.payTypePO.permitChangeFlag == '1'){
      //     // 抹零金额
      //     unChargeSmallChange = NP.minus(item.defaultRefundAmt,Number(parseInt(item.defaultRefundAmt * 10) / 10));
      //     item.defaultRefundAmt = Number(parseInt(item.defaultRefundAmt * 10) / 10);
      //   }
      // });
      // if(unChargeSmallChange>maxML){
      //   this.$message.error('各支付方式抹零金额总和不得超过待退款抹零金额，请修改退款值');
      //   return false;
      // }
      const list = this.payType.map((item) => {
        const obj = {};
        if (item.payTypePO.checkNum) {
          obj.companyName = item.payTypePO.companyName;
          obj.bankName = item.payTypePO.bankName;
          obj.bankAccount = item.payTypePO.bankAccount;
          obj.checkNum = item.payTypePO.checkNum;
          obj.deposiBank = item.payTypePO.deposiBank;
          obj.companyName = item.payTypePO.companyName;
          obj.recordRemark = item.payTypePO.recordRemark;
        }
        return {
          ...obj,
          //抹零金额
          unChargeSmallChange: this.unChargeSmallChange,
          payTypeId: item.payTypePO.payTypeId,
          settleAmt: flag ? -item.defaultRefundAmt : item.defaultRefundAmt,
        };
      });
      const params = {
        tradeId: this.info.settleTradeId,
        appCode: this.info.appCode || "",
        outTradeSettleAmtDetailVO2s: list,
      };
      this.returnPremiumLoading = true;
      appointment
        .settlementNew(params)
        .then((res) => {
          this.$hideLoading();
          if (res.code === 1) {
            this.$message.success(res.msg || "退费成功!");
            //添加新功能，收费成功后自动打印
            this.printReceiptValied();
          } else {
            this.$emit("close", {
              refresh: false,
            });
            this.$message.error(res.msg || "退费失败!");
          }
          this.returnPremiumLoading = false;
        })
        .catch((err) => {
          console.log(err, "打印退费失败");
          this.returnPremiumLoading = false;
          this.$emit("close", {
            refresh: false,
          });
          // this.$message.error(err.msg || "退费失败!");
        });
    },
    cancelHandle() {
      if (this.info.originalTradeCancelFlag !== "0") {
        this.$confirm("该笔费用尚未完成退费结算, 请确认是否取消?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$emit("close");
          })
          .catch(() => {});
      } else {
        this.$emit("close");
      }
    },
    priceChange(e, idx, maxFlag, balPrice) {
      if (typeof maxFlag !== "number") {
        return;
      }
      // 支付金额
      // 修改一个金额时，自动改变他下一个值，保持总金额等于待支付自付差额
      if (idx > this.payType.length - 1 || this.payType.length === 1) {
        return;
      }
      const price = Number(e);
      if (price > maxFlagt) {
        this.$message.warning("输入金额不能超过最大金额!");
        return;
      }
      let nextIdx;
      // 如果修改的是最后一个，则改变第一个的值
      if (idx === this.payType.length - 1) {
        nextIdx = 0;
      } else {
        nextIdx = idx + 1;
      }
      const nextPrice = this.payType[nextIdx].settleAmt;
      let bal;
      // 判断是否是递归调用
      if (balPrice) {
        bal = balPrice;
      } else {
        const oPrice = this.payType.reduce((total, cur) => {
          return total + Number(cur.settleAmt);
        }, 0);
        bal = oPrice - Math.abs(this.info.totalWaitSelfPayBalance);
      }
      let newPrice = nextPrice - bal;
      // 如果要修改的值大于0则直接修改，小于0则需要继续向后修改
      if (newPrice < 0) {
        this.$set(this.payType, nextIdx, {
          ...this.payType[nextIdx],
          settleAmt: 0,
        });
        // 如果修改下一个值后输入金额还是大于上限则递归往下修改
        this.priceChange(e, nextIdx, maxFlag, Math.abs(Number(newPrice)));
      } else {
        this.$set(this.payType, nextIdx, {
          ...this.payType[nextIdx],
          settleAmt: Number(newPrice),
        });
      }
    },
    doMl(num) {
      let a = Number(parseInt(num * 10) / 10);
      if (a == num) {
        return num;
      } else {
        return NP.minus(a, 0.1);
      }
    },
    // 票据打印校验
    async printReceiptValied() {
      // billType--之前交易开具的发票类型，默认为2(电子发票)
      let billType = this.info.receiptSource || "2";
      let printerName = "";
      // 选择发票打印机
      let tableData = deepClone(JSON.parse(localStorage.getItem("printerNameData")) || []);
      
      if (!this.nextReceiptNumOutPO.receiptNum) {
        this.$message.error("当前票据号为空");
        this.$emit("close", {refresh: true});
        this.$emit("message");
        return;
      }
      if (this.info.rechargeTradeoutpPreSettlementResultVO2) {
        let num = this.info.rechargeTradeoutpPreSettlementResultVO2.feeAmount - this.info.originalTradeOutpPreSettlementResultVO2.derateAmount;
        if (num > 0) {
          if(billType === "1") {
            // 纸质发票
            let arr = tableData.filter((item) => {
              return item.name === "收费发票";
            });
            if(arr.length) {
              printerName = arr[0].printerName;
              await this.printReceipt(printerName);
              return;
            }
            this.printNameseterVisible = true;
            this.requiredName = "收费发票";
            return;
          } else {
            // 电子发票热敏凭条
            let arr = tableData.filter((item) => {
              return item.name === "热敏凭证";
            });
            if(arr.length) {
              printerName = arr[0].printerName;
              await this.printElectronicReceipt(printerName);
              return;
            }
            this.printNameseterVisible = true;
            this.requiredName = "热敏凭证";
          }
        } else {
          this.$emit("close", {refresh: true});
          this.$emit("message");
          return;
        }
      } else {
        this.$emit("close", {refresh: true});
        this.$emit("message");
        return;
      }
    },
    // 票据打印
    async printReceipt(printerName) {
      try {
        this.$showLoading();
        let obj = {
          receiptNum: this.nextReceiptNumOutPO.nextReceiptNum,
          outId: this.nextReceiptNumOutPO.outId,
          inId: this.nextReceiptNumOutPO.intId,
          outpTradeDetailIds: [
            this.info.settleTradeId,
            // this.refundApplyData,
          ],
        };
        let res = await service2.printReceipt(obj);
        this.$message({
          message: "票据数据保存成功",
          type: "success",
        });
        // 打印机。。
        this.receiptContent = res.data;
        this.handlePrintData(printerName);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$emit("close", {refresh: true});
        this.$emit("message");
        // this.$message.error(error.msg || "打印票据失败");
      }
    },
    //处理打印数据
    async handlePrintData(printerName) {
      let index = getPrinterList();
      index = 3;
      let obj = createData(this.receiptContent, this.dayjs);
      let { code, data } = await getPrintTpl(codes.financeTpl);
      if (code != 1) return;
      print(index, data.value, {printerName}, obj, true);
      this.$emit("close", {refresh: true});
      this.$emit("message");
    },
    // 票据打印-电子发票热敏凭条
    async printElectronicReceipt(printerName) {
      try {
        let res = await service2.printInvoiceEBill({
          tradeId: this.info.settleTradeId || ""
          // tradeId: "8ae451047ca594ed017ca67197e100df"
        });
        if (res.code === 1) {
          let obj = handleThermosensiPrintData(res.data);
          print("", thermosensitiveTpl, {printerName}, obj, true);
        } else if (res.code === 1001) {
          this.$message.error(res.msg || "开具电子发票失败！");
          let obj = handleThermosensiPrintData(res.data || {});
          print("", thermosensitiveErrorTpl, {printerName}, obj, true);
        } else {
          this.$message.error(res.msg || "开具电子发票失败！");
        }
      } catch (error) {} finally {
        this.$emit("close", {refresh: true});
        this.$emit("message");
      }
    },
    closePrintSeterFuc(name) {
      this.printNameseterVisible = false;
      if(name === "收费发票") {
        this.printReceipt(name);
      } else if(name === "热敏凭证") {
        this.printElectronicReceipt(name);
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
    /**
     * 来自Soujer新算法
     * @param amount
     * @returns {string}
     */
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
    getHisTradeId(flag) {
      this.hisTradeId = flag === 0 ? this.refundApplyData : this.info.settleTradeId || "";
      if (!this.hisTradeId) { return; }
      this.sidetailTableVisible = true;
    },
    sidetailTableClose() {
      this.sidetailTableVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
>>> .el-dialog {
  max-height: 90%;
  display: flex;
  flex-direction: column;
}

>>> .el-dialog__body {
  height: calc(100% - 120px);
  overflow: auto;
}
.el-icon-right {
  display: flex;
  align-items: center;
  margin: 0 8px;
}

.return-premium {
  position: relative;

  .top {
    display: flex;

    .title {
      font-size: 16px;
      font-weight: bold;
    }

    .item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .itemLabel {
        width: 100px;
      }

      .valueArea {
        flex: 1;
        height: 32px;
        margin-left: 16px;
        background-color: #f5f7fa;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        color: #c0c4cc;
        padding: 0 8px;
        display: flex;
        align-items: center;
        color: rgb(240, 90, 35);
        font-weight: bold;
      }
    }

    .left {
      flex: 3.5;
      border-right: 1px solid #ccc;
      padding: 20px;
    }

    .right {
      flex: 6.5;
      padding: 20px;
      overflow: auto;
      height: calc(100% - 65px);

      >>> .l-input-wrap {
        width: 300px !important;
        margin-right: 16px;
        margin-bottom: 8px;
      }
    }
  }
}

.bottom {
  padding: 16px;
  // display: flex;
  flex-wrap: wrap;
  font-size: 16px;

  .item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    margin-right: 16px;

    .itemLabel {
      width: 100px;
    }

    .valueArea {
      width: 300px;
      height: 32px;
      margin-left: 16px;
      background-color: #f5f7fa;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      color: #c0c4cc;
      padding: 0 8px;
      display: flex;
      align-items: center;
      color: rgb(240, 90, 35);
      font-weight: bold;
    }
  }
}

.return-top {
  margin-bottom: 20px;

  /deep/ .cardtitle {
    height: 20px;
    line-height: 20px;
    margin-bottom: 10px;

    .titleleft::before {
      margin-top: 0;
    }
  }

  .el-col:first-child {
    border-right: 1px solid $l-color-primary;
  }

  .price-box {
    span {
      display: inline-block;
      width: 110px;
      text-align: right;
    }
  }
}

.price-box {
  line-height: 25px;
}

.btn-box {
  text-align: center;
}

.pay-type {
  margin-top: 20px;
}

.pay-type-title {
  font-weight: bold;
  font-size: $l-font-size-max;
}

.pay-type-item {
  padding-left: 40px;
  margin-top: 10px;

  span {
    display: inline-block;
    width: 120px;
  }

  .el-input {
    width: 200px;
  }
}

.max-amt {
  color: $l-color-fontcolor-5;
}
.content {
  height: 32px;
  background: #f5f7fa;
  color: #2e323a;
  padding: 0 8px;
  display: flex;
  align-items: center;
}
.display-flex{
  display: flex;
  justify-content: space-between;
  line-height: 32px;
}
.span-content {
  padding: 0 8px;
  height: 32px;
  line-height: 32px;
}
</style>
