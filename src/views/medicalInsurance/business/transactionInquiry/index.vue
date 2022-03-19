<template>
  <div class="dict-box width140 height100" >
     <el-dialog
      :title="operateType === 'amt' ? '金额明细' : '费用明细'"
      :visible.sync="isShow"
      :width="operateType === 'amt'?'453px':'80%'"
    >
      <div class="table-paylist padding10">
        <el-table
            highlight-current-row
            :data="chargeData"
            stripe
            border
            :element-loading-text="$t('retreat.loadInfo')"
            width="100%"
            height="100%"
            v-loading="isloading"
          >
            <!-- 业务列 -->
            <el-table-column
              v-for="item in chargeParams"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              :width="item.width || (item.label.length * 18 + 24)"
              header-align="center"
              :align="item.align || 'left'"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
            <template slot-scope="scope">
              <template v-if="item.prop === 'tradeAmtCode'">
                {{ transformNew("fund_pay_type", scope.row.tradeAmtCode) }}
              </template>
              <template v-else>{{scope.row[item.prop]}}</template>
            </template>
            </el-table-column>
          </el-table>
        </div>
    </el-dialog>
    <div class="dict-left height100">
      <div class="search">
        <div class="search-input">
          <el-row :gutter="10">
            <el-col :span="3">
              <l-formt-title label="医保类别" disabled required>
                <!-- <l-value-domain
                  :value.sync="searchParams.medicareType"
                  remoteUrl="/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000"
                  remoteShowKey="dictName"
                  remoteValueKey="dictCode"
                  placeholder="请选择"
                ></l-value-domain> -->
                <el-select
                  v-model="searchParams.medicareType"
                  placeholder="请选择"
                  disabled
                >
                  <el-option
                    v-for="(item, index) in mtList"
                    :key="index"
                    :label="item.dictName"
                    :value="item.dictCode"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
            <el-col :span="3">
              <LFormtTitle label="登记类型">
                <el-select v-model="searchParams.hisTradeType" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
            <!-- <el-col :span="6">
              <LFormtTitle label="人员性质类别">
                <el-input v-model="searchParams.patientPersonPropertyType"></el-input>
              </LFormtTitle>
            </el-col> -->
            <el-col :span="4">
              <LFormtTitle label="交易时间">
                <el-date-picker
                  v-model="tradDate"
                  type="daterange"
                  range-separator="至"
                  value-format="yyyy-MM-dd"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <l-formt-title label="登记时间">
                <el-date-picker
                  v-model="regDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </l-formt-title>
            </el-col>
            <el-col :span="3">
              <LFormtTitle label="患者名称">
                <el-input v-model="searchParams.patientName"></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="3">
              <LFormtTitle label="医保个人编号">
                <el-input v-model="searchParams.patientCode"></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="社会保障卡卡号">
                <el-input v-model="searchParams.patientCardNum"></el-input>
              </LFormtTitle>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="10"></el-row> -->
          <!-- <el-row :gutter="10">
            <el-col :span="6">
              <LFormtTitle label="单位名称">
                <el-input v-model="searchParams.patientCompanyName"></el-input>
              </LFormtTitle>
            </el-col>
            <el-col></el-col>
          </el-row> -->
        </div>
        <div class="search-btn">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="reset">重置</el-button>
        </div>
      </div>
      <div class="table">
        <el-table
          ref="singleTable"
          highlight-current-row
          :data="tableData"
          border
          width="100%"
          height="100%"
          v-loading="loading"
          @header-dragend="headerDragend"
        >
      <el-table-column label="明细"  min-width="230" header-align="center">
        <template slot-scope="scope">
          <el-button   type="text" @click="loadChargeTable(scope.row,'charge')" >费用明细</el-button>
          <el-button  type="text" @click="loadChargeTable(scope.row,'amt')" >金额明细</el-button>
        </template>
      </el-table-column>
          <!-- 业务列 -->
          <el-table-column
            v-for="item in tableParams"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width || (item.label.length * 18 + 24)"
            header-align="center"
            :align="item.align || 'center'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- 可自定义内容 -->
              <template v-if="item.prop === 'workCode'">
                <span code="doctorProfessionalTitle" :val=" scope.row[item.prop]" v-codeTransform></span>
              </template>
              <template v-else-if="item.prop === 'regMedicareType'">
                <span>{{ mtShow[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'regHisRegType'">
                <span>{{ optionsShow[scope.row[item.prop]] }}</span>
              </template>
              <template v-else-if="item.prop === 'patientGender'">
                <!-- <span>{{ optionsShow[scope.row[item.prop]] }}</span> -->
                <!-- <span
                  :val="scope.row[item.prop] + ''"
                  code="GENDER_CODE"
                  v-codeTransform
                ></span> -->
                <span>{{transform("AAC004", scope.row[item.prop])}}</span>
              </template>
              <template v-else-if="item.prop === 'patientCompanyType'">
                <span>{{transform("AAB019", scope.row[item.prop])}}</span>
              </template>
              <template v-else-if="item.prop === 'tradeRecordStatus'">
                <span>{{transform("AKA018", scope.row[item.prop])}}</span>
              </template>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          @size-change="changeSize"
          @current-change="changePage"
          :current-page="pageParams.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getPagemd ,getPageTradeList ,getPageTradeAmtDetail ,getPageTradeChargeDetailList} from "@/api/medicalInsurance/index.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";

export default {
  name: "transactionInquiry",
  mixins: [getDictInfoNew],
  data() {
    return {
      operateType: "",
      isloading: false,
      isShow: false,
      searchParams: {
        medicareType: "",
        hisTradeType: "",
        patientPersonPropertyType: "",
        patientName: "",
        patientCode: "",
        patientCardNum: "",
        patientCompanyName: ""
      },
      tradDate: [
        this.dayjs(new Date()).format("YYYY-MM-DD"),
        this.dayjs(new Date()).format("YYYY-MM-DD")
      ],
      regDate: [
        this.dayjs(new Date(
          new Date().getTime() - 7 * 24 * 3600 * 1000)
          ).format("YYYY-MM-DD"),
        this.dayjs(new Date()).format("YYYY-MM-DD")
      ],
      chargeData: [],
      chargeParams:[],
      mtShow: {},
      optionsShow:
        {
          "0": "门诊", "1": "家床"
        },
      options: [
        {
          label: "门诊",
          value: "0"
        },
        {
          label: "家床",
          value: "1"
        }
      ],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      chargePageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      tableParams: [
        {
          prop: "regHisRegType",
          label: "HIS登记类型",
          width: 100
        },
        {
          prop: "regMedicareType",
          label: "医保类型",
          width: 150
        },
        {
          prop: "patientName",
          label: "患者姓名",
          width: 100
        },
        {
          prop: "patientBirthDate",
          label: "出生日期",
          width: 120
        },
        {
          prop: "patientCardNum",
          label: "社会保障卡卡号"
        },
        {
          prop: "patientIdentificationNum",
          label: "证件号",
          width: 220
        },
        {
          prop: "tradeSettleBizSerialNum",
          label: "结算流水号",
          width: 150
        },
        {
          prop: "tradeStartPayLine",
          label: "起付线",
          align: "right"
        },
        {
          prop: "tradeMedicalFeeAmount",
          label: "总金额",
          align: "right"
        },
        {
          prop: "tradeCashPayAmount",
          label: "现金支付金额",
          align: "right"
        },
        {
          prop: "tradeSettlementTime",
          label: "结算时间",
          width: 180
        },
        {
          prop: "tradeFulamtOwnpayAmt",
          label: "全自费金额",
          align: "right"
        },
        {
          prop: "tradeOverlmtSelfpay",
          label: "超限价自费费用",
          align: "right"
        },
        {
          prop: "tradePreselfpayAmt",
          label: "先行自付金额",
          align: "right"
        },
        {
          prop: "tradeWithinMedicareFundAmt",
          label: "符合政策范围金额",
          align: "right"
        },
        {
          prop: "tradePoolPropSelfpay",
          label: "基本医疗保险统筹基金支付比例"
        },
        {
          prop: "tradeCvlservPay",
          label: "公务员医疗补助资金支出",
          align: "right"
        },
        {
          prop: "tradeHifesPay",
          label: "企业补充医疗保险基金支出",
          align: "right"
        },
        {
          prop: "tradeHifmiPay",
          label: "居民大病"
        },
        {
          prop: "tradeMafPay",
          label: "医疗救助基金支出",
          align: "right"
        },
        {
          prop: "tradeOthPay",
          label: "其他支出",
          align: "right"
        },
        {
          prop: "tradePsnPartAmt",
          label: "个人负担总金额",
          align: "right"
        },
        {
          prop: "tradeAcctMulaidPay",
          label: "个人账户共济支付金额",
          align: "right"
        },
        {
          prop: "tradeHifpPay",
          label: "医疗基金统筹支付",
          align: "right"
        },
        {
          prop: "regUserName",
          label: "登记人员名称",
          width: 150
        },
        {
          prop: "regTime",
          label: "登记时间",
          width: 180
        },
        {
          prop: "regDischargeTime",
          label: "出院时间",
          width: 150
        },
        {
          prop: "regSerialNum",
          label: "就诊流水号",
          width: 200
        },
        {
          prop: "regMedicalTypeName",
          label: "诊疗类型"
        },
        {
          prop: "regInsuranceTypeName",
          label: "险种类型",
          width: 180
        },
        {
          prop: "regChargePersonTypeNmae",
          label: "人员性质"
        },
        {
          prop: "regMainDiagName",
          label: "主诊断",
          width: 180
        },
        {
          prop: "regFirstDiagName",
          label: "第一诊断",
          width: 180
        },
        {
          prop: "regSecondDiagName",
          label: "第二诊断",
          width: 180
        },
        {
          prop: "regChronicDiseaseName",
          label: "特慢病"
        },
        {
          prop: "regSdeptName",
          label: "科室",
          width: 130
        },
        {
          prop: "regEmrNum",
          label: "病历号",
          width: 180
        },
        {
          prop: "regDoctorName",
          label: "医生名称",
          width: 150
        },
        {
          prop: "regBirctrlTypeName",
          label: "计划生育手术类别"
        },
        {
          prop: "regBirctrlMatnDate",
          label: "计划生育日期"
        },
        {
          prop: "regAdmDiagDscr",
          label: "入院诊断描述"
        },
        {
          prop: "regOprnOprtName",
          label: "手术名称"
        },
        {
          prop: "regMatnTypeName",
          label: "生育类别名称"
        },
        {
          prop: "regLatechbFlag",
          label: "晚育标志"
        },
        {
          prop: "regFetts",
          label: "胎次"
        },
        {
          prop: "regPretFlag",
          label: "早产标志"
        },
        {
          prop: "regDaysrgDiseListName",
          label: "日间手术名称"
        },
        /* {
          prop: "patientGender",
          label: "性别"
        },
        {
          prop: "patientNation",
          label: "民族"
        },
        {
          prop: "regMedicalTypeCode",
          label: "医疗类别编码"
        },
        {
          prop: "regDiagCode",
          label: "家床疾病诊断"
        },
        {
          prop: "regDiagName",
          label: "家床疾病诊断名称"
        },
        {
          prop: "regAdmissionDiagCode",
          label: "家床登记诊断编码"
        },
        {
          prop: "regAdmissionDiagName",
          label: "家床登记诊断名称"
        },
        {
          prop: "regDischargeDiagCode",
          label: "撤床诊断编码"
        },
        {
          prop: "regDischargeDiagName",
          label: "撤床诊断名称"
        },
        {
          prop: "regFirstDiagCode",
          label: "第一副诊断编码"
        },
        {
          prop: "regFirstDiagName",
          label: "第一副诊断名称"
        },
        {
          prop: "regSecondDiagCode",
          label: "第二副诊断编码"
        },
        {
          prop: "regSecondDiagName",
          label: "第二副诊断名称"
        },
        {
          prop: "regSingleDiseaseCode",
          label: "单病种编码"
        },
        {
          prop: "regSingleDiseaseName",
          label: "单病种名称"
        },
        {
          prop: "regRecordRemark",
          label: "备注"
        },
        {
          prop: "regAdmissionStatusCode",
          label: "入院状态编码"
        },
        {
          prop: "regAdmissionStatusName",
          label: "入院状态名称"
        },
        {
          prop: "regDischargeStatusCode",
          label: "出院状态编码"
        },
        {
          prop: "regDischargeStatusName",
          label: "出院状态名称"
        },
        {
          prop: "regTurnModeCode",
          label: "转诊类型编码"
        },
        {
          prop: "regTurnModeName",
          label: "转诊类型名称"
        },
        {
          prop: "regTurnCode",
          label: "转诊转院编码"
        },
        {
          prop: "regTurnName",
          label: "转诊转院名称"
        },
        {
          prop: "regTurnDate",
          label: "转院日期"
        },
        {
          prop: "regMinisterNoticeNum",
          label: "民政通知书号"
        },
        {
          prop: "regOperationCode",
          label: "手术编号"
        },
        {
          prop: "regOperationName",
          label: "手术名称"
        }, {
          prop: "regPersonalAccountUserFlag",
          label: "个人账户使用标识"
        },
        {
          prop: "regMaternityNum",
          label: "生育证号"
        },
        {
          prop: "regDeliveryModeCode",
          label: "生产方式"
        },
        {
          prop: "regDeliveryModeName",
          label: "生产方式名称"
        },
        {
          prop: "regDeliveryTime",
          label: "分娩时间",
          width: 180
        },
        {
          prop: "regFetusCount",
          label: "胎儿数量"
        },
        {
          prop: "regDischargeReasonCode",
          label: "出院原因编码"
        },
        {
          prop: "regDischargeReasonName",
          label: "出院原因名称"
        },
        {
          prop: "regOperationFlag",
          label: "手术标识"
        },
        {
          prop: "regTumourFlag",
          label: "恶性肿瘤标识"
        },
        {
          prop: "regMidwaySettlementFlag",
          label: "中途结算标识"
        },
        {
          prop: "regAdditionalDialCode",
          label: "诊断附码"
        },
        {
          prop: "regCancelRegReason",
          label: "家床登记取消原因"
        },
        {
          prop: "regDiseasePayFlag",
          label: "病种支付标志"
        },
        {
          prop: "regTraumaFlag",
          label: "外伤标志"
        },
        {
          prop: "regDamageCategory",
          label: "伤害类别"
        },
        {
          prop: "regDamageCategoryName",
          label: "伤害类别名称"
        },
        {
          prop: "regSpecialDiseaseFlag",
          label: "特殊病标志"
        },
        {
          prop: "regSpecialDiseaseCode",
          label: "特殊病编码"
        },
        {
          prop: "regSpecialDiseaseName",
          label: "特殊病名称"
        },
        {
          prop: "regChronicDiseaseFlag",
          label: "慢性病标志"
        },
        {
          prop: "regChronicDiseaseCode",
          label: "慢性病编码"
        },
        
        {
          prop: "regTypeCode",
          label: "登记类别编码"
        },
        {
          prop: "regTypeName",
          label: "登记类别名称"
        },
        {
          prop: "regRecordStatus",
          label: "登记状态"
        },
        {
          prop: "tradeSiTradeId",
          label: "医保交易ID"
        },
         {
          prop: "tradeSettlementRequestTradeSerialNum",
          label: "结算请求交易流水号"
        },
        {
          prop: "tradeSettlementResponseTradeSerialNum",
          label: "结算响应交易流水号"
        },
        {
          prop: "tradeHisTradeType",
          label: "HIS结算类型"
        },
        {
          prop: "tradeStartPayLine",
          label: "起付线"
        },
        {
          prop: "tradeCheckBillSerialNum",
          label: "对账流水号"
        },
        {
          prop: "tradeChargeDetailSubmitSequenceNum",
          label: "费用明细提交顺序号"
        },
        {
          prop: "tradeMedicalFeeAmount",
          label: "医疗费用总额"
        },
        {
          prop: "tradeCashPayAmount",
          label: "现金支付金额"
        },
        {
          prop: "tradePersonalAccountPayAmount",
          label: "个人账户支付金额"
        },
        {
          prop: "tradeHosAssumeAmount",
          label: "医院承担金额"
        },
        {
          prop: "tradeFundPayAmount",
          label: "基金支付金额"
        },
        {
          prop: "tradeSingleDiseaseMarginAmt",
          label: "单病种差额"
        },
        {
          prop: "tradeSingleDiseaseAmt",
          label: "单病种金额"
        },
        {
          prop: "tradeCheckBillResult",
          label: "对账结果"
        },
        {
          prop: "tradeRecipeNum",
          label: "收据号"
        },
        {
          prop: "tradeErrorMessage",
          label: "结算错误信息"
        },
        {
          prop: "tradeSettleUserName",
          label: "结算人员名称"
        },
        {
          prop: "tradeSettlementTime",
          label: "结算时间",
          width: 180
        },
        {
          prop: "tradeRecordStatus",
          label: "结算状态"
        },
        {
          prop: "patientCompanyCode",
          label: "单位编码"
        },
        {
          prop: "patientCompanyType",
          label: "单位类型"
        },
        {
          prop: "patientCompanyName",
          label: "单位名称",
          width:250
        },
        {
          prop: "patientMedicalTreatmentType",
          label: "医疗待遇类别"
        },
        {
          prop: "patientPersonPropertyType",
          label: "人员性质类别"
        },
        {
          prop: "patientSpecialPersonType",
          label: "特殊人员类别"
        },
        {
          prop: "patientInsureStatus",
          label: "人员参保状态"
        },
        {
          prop: "patientOtherPlacePersonFlag",
          label: "异地人员标志"
        },
        {
          prop: "patientPoorPeopleCode",
          label: "贫困人口编码"
        },
        {
          prop: "patientOverallAreaCode",
          label: "统筹区号"
        },
        {
          prop: "patientOverallAreaName",
          label: "统筹区名称"
        },
        {
          prop: "patientYears",
          label: "年度"
        },
        {
          prop: "patientInHosStatus",
          label: "在院状态"
        },
        {
          prop: "patientCurrentPersonalAccountBalance",
          label: "本年账户余额"
        },
        {
          prop: "patientHistoryPresonalAccountBalance",
          label: "历年账户余额"
        },
        {
          prop: "patientCurrentYearTotalMedicalFee",
          label: "本年医疗费累计"
        },
        {
          prop: "patientCurrentYearTotalInpatientMedicalFee",
          label: "本年家床医疗费累计"
        },
        {
          prop: "patientCurrentYearTotalOupatientMedicalFee",
          label: "本年门诊医疗费累计"
        },
        {
          prop: "patientCurrentYearTotalRegulationDiseaseMedicalFee",
          label: "本年规定病医疗费累计"
        },
        {
          prop: "patientCurrentYearTotalChronicDiseaseMedicalFee",
          label: "本年慢性病医疗费累计"
        },
        {
          prop: "patientCurrentYearTotalAssistMedicalFee",
          label: "本年医疗救助费用累计"
        },
        {
          prop: "patientCurrentYearTotalBigDiseaseAssistMedicalFee",
          label: "本年大病保险费用累计"
        },
        {
          prop: "patientCurrentYearTotalPersonalAccountPay",
          label: "本年账户支出累计"
        },
        {
          prop: "patientCurrentYearTotalOverallPay",
          label: "本年统筹支出累计"
        },
        {
          prop: "patientCurrentYearTotalOupatientOverallPay",
          label: "本年门诊统筹支出累计"
        },
        {
          prop: "patientCurrentYearTotalInpatientOverallPay",
          label: "本年家床统筹支出累计"
        },
        {
          prop: "patientCurrentYearTotalAssistPay",
          label: "本年救助金支出累计"
        },
        {
          prop: "patientCurrentYearTotalBigDiseaseAssistPay",
          label: "本年大病救助支出累计"
        },
        {
          prop: "patientCurrentYearTotalSpecialFundPay",
          label: "本年专项基金支付累计"
        },
        {
          prop: "patientCurrentYearTotalInOverallFee",
          label: "本年进入统筹费用累计"
        },
        {
          prop: "patientCurrentYearTotalInAssistFundFee",
          label: "本年进入救助金费用累计"
        },
        {
          prop: "patientCurrentYearTotalOfficerAssistFee",
          label: "本年公务员补助支付累计"
        },
        {
          prop: "patientCurrentYearTotalStartPayLine",
          label: "本年起付标准累计"
        },
        {
          prop: "patientDrugstoreTotalFee",
          label: "药店购药医保累计"
        },
        {
          prop: "patientCurrentYearInpatientTimesWithinCity",
          label: "本年市内家床次数"
        },
        {
          prop: "patientCurrentYearInpatientTimes",
          label: "本年家床次数"
        },
        {
          prop: "patientCurrentYearOutpatientTimes",
          label: "本年门诊次数"
        },
        {
          prop: "patientCurrentYearRegulationTimes",
          label: "本年规定病次数"
        },
        {
          prop: "patientCurrentYearChronicDiseaseTimes",
          label: "本年慢性病次数"
        },
        {
          prop: "patientAge",
          label: "年龄"
        },
        {
          prop: "patientEnjoyOutpatientTreatmentFlag",
          label: "享受门诊待遇标志"
        },
        {
          prop: "limitType",
          label: "受限类别"
        },
        {
          prop: "patientAddress",
          label: "常居住地"
        },
        {
          prop: "patientHonorType",
          label: "荣誉类别"
        },
        {
          prop: "patientBasicLivingAllowanceType",
          label: "低保类别"
        },
        {
          prop: "patientPreferTreatType",
          label: "优抚类别"
        },
        {
          prop: "patientSpecialDiseaseFlag",
          label: "特殊病标志"
        },
        {
          prop: "patientSpecialDiseaseCode",
          label: "特殊病编码"
        },
        {
          prop: "patientChronicDiseaseFlag",
          label: "慢性病标志"
        },
        {
          prop: "patientChronicDiseaseCode",
          label: "慢性病编码"
        },
        {
          prop: "patientOutpatientSeriousIllness3AvailableTimes",
          label: "门诊大病3可用次数"
        },
        {
          prop: "patientOutpatientSeriousIllness3UsedTimes",
          label: "门诊大病3已用次数"
        },
        {
          prop: "patientOutpatientSeriousIllness3MaxTimes",
          label: "门诊大病3最多次数"
        },
        {
          prop: "patientOutpatientSeriousIllness3BusinessDate",
          label: "门诊大病3业务年月"
        },
        {
          prop: "patientOutpatientSeriousIllness3DiseaseCode",
          label: "门诊大病3疾病编码"
        },
        {
          prop: "patientOutpatientSeriousIllness3Type",
          label: "门诊大病3类别"
        },
        {
          prop: "patientOutpatientSeriousIllness2AvailableTimes",
          label: "门诊大病2可用次数"
        },
        {
          prop: "patientOutpatientSeriousIllness2UsedTimes",
          label: "门诊大病2已用次数"
        },
        {
          prop: "patientOutpatientSeriousIllness2MaxTimes",
          label: "门诊大病2最多次数"
        },
        {
          prop: "patientOutpatientSeriousIllness2BusinessDate",
          label: "门诊大病2业务年月"
        },
        {
          prop: "patientOutpatientSeriousIllness2DiseaseCode",
          label: "门诊大病2疾病编码"
        },
        {
          prop: "patientOutpatientSeriousIllness2Type",
          label: "门诊大病2类别"
        },
        {
          prop: "patientOutpatientSeriousIllness1AvailableTimes",
          label: "门诊大病1可用次数"
        },
        {
          prop: "patientOutpatientSeriousIllness1UsedTimes",
          label: "门诊大病1已用次数"
        },
        {
          prop: "patientOutpatientSeriousIllness1MaxTimes",
          label: "门诊大病1最多次数"
        },
        {
          prop: "patientOutpatientSeriousIllness1BusinessDate",
          label: "门诊大病1业务年月"
        },
        {
          prop: "patientOutpatientSeriousIllness1DiseaseCode",
          label: "门诊大病1疾病编码"
        },
        {
          prop: "patientOutpatientSeriousIllness1Type",
          label: "门诊大病1类别"
        },
        {
          prop: "patientGuardian2IdentificationNum",
          label: "监护人2证件号码"
        },
        {
          prop: "patientGuardian2IdentificationType",
          label: "监护人2证件类型"
        },
        {
          prop: "patientGuardian2PcNum",
          label: "监护人2电脑号"
        },
        {
          prop: "patientGuardian2Name",
          label: "监护人2姓名"
        },
        {
          prop: "patientGuardian1IdentificationNum",
          label: "监护人1证件号码"
        },
        {
          prop: "patientGuardian2Relation",
          label: "监护人2关系"
        },
        {
          prop: "patientGuardian1IdentificationType",
          label: "监护人1证件类型"
        },
        {
          prop: "patientGuardian1PcNum",
          label: "监护人1电脑号"
        },
        {
          prop: "patientGuardian1Name",
          label: "监护人1姓名"
        },
        {
          prop: "patientGuardian1Relation",
          label: "监护人1关系"
        },
        {
          prop: "patientInductrialInjuryRehabilitationEndDate",
          label: "工伤医疗（康复）期结束日期"
        },
        {
          prop: "patientInductrialInjuryRehabilitationBeginDate",
          label: "工伤医疗（康复）期开始日期"
        },
        {
          prop: "patientBindingSettleHospitalName",
          label: "绑定结算医院名称"
        },
        {
          prop: "patientBindingSettleHospital",
          label: "绑定结算医院"
        },
        {
          prop: "patientBindingSocialHealth",
          label: "绑定社康名称"
        },
        {
          prop: "patientBindingSocialHealthName",
          label: "绑定社康"
        },
        {
          prop: "patientEndDate",
          label: "结束日期"
        },
        {
          prop: "patientBeginDate",
          label: "开始日期"
        },
        {
          prop: "patientHealthCareInformation",
          label: "保健信息"
        },
        {
          prop: "patientBlacklistLimitFlag",
          label: "黑名单受限标志"
        },
        {
          prop: "patientSiFeePrePayQualification",
          label: "医保费用先行支付记账资格"
        },
        {
          prop: "patientCriticalIllnessInsuranceStatus",
          label: "重疾保险参保状态"
        },
        {
          prop: "patientDomicile",
          label: "户籍"
        },
        {
          prop: "patientOperatorPcNum",
          label: "人员电脑号"
        },
        {
          prop: "patientHypertensionFlag",
          label: "高血压标志"
        },
        {
          prop: "patientDiabetesFlag",
          label: "糖尿病标志"
        },
        {
          prop: "patientOverheadInformation",
          label: "附加信息"
        },
        {
          prop: "patientCardStatus",
          label: "社保卡状态"
        },
        {
          prop: "overallFundPayAmt",
          label: "统筹基金支付金额"
        },
        {
          prop: "officerAssistPayAmt",
          label: "公务员补助"
        } */
      ],
      tableData: [],
      loading: false,
      curSearchParams: {}
    };
  },
  created() {
    this.getMedicareType();
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
     // 获取医保类别
    getMedicareType() {
      let path = this.$route.path;
      let isNew = false;
      if(path.indexOf("medicalInsuranceNew") > -1) {
        isNew = true;
      } else {
        isNew = false;
      }
      getPagemd().then(res => {
        if (res.code === 1) {
          this.mtList = res.data;
          this.searchParams.medicareType = isNew ? res.data[0].dictCode : res.data[1].dictCode;
          res.data.forEach(item => {
            this.mtShow[item.dictCode] = item.dictName;
          });
        }
      });
    },
    search() {
      if (this.searchParams.medicareType === "") {
        this.$message.warning("请选择医保类别");
        return;
      }
      this.pageParams.pageNo = 1;
      // 缓存查询信息
      this.curSearchParams = {
        ...this.searchParams
      };
      if (this.regDate && this.regDate.length > 1) {
        this.curSearchParams['regTimeStrat'] = this.regDate[0] + " 00:00:00";
        this.curSearchParams['regTimeStop'] = this.regDate[1] + " 23:59:59";
      }
      if (this.tradDate && this.tradDate.length > 1) {
        this.curSearchParams['tradeTimeStrat'] = this.tradDate[0] + " 00:00:00";
        this.curSearchParams['tradeTimeStop'] = this.tradDate[1] + " 23:59:59";
      }
      this.loadTable();
    },
    reset() {
      this.searchParams = this.$options.data().searchParams;
      this.tradDate = [];
      this.regDate = [];
      this.chargeData = [];
    },
    loadTable() {
      this.loading = true;
      // 把缓存的查询信息赋值到查询条件里
      for (let i in this.searchParams) {
        this.$set(this.searchParams, i, this.curSearchParams[i]);
      }

      const params = {
        ...this.curSearchParams,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      };
      getPageTradeList(params)
        .then(res => {
          this.loading = false;
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tableData = res.data;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.loadTable();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.loadTable();
    },
    loadChargeTable(row,type) {
      this.isloading = true;
      const params = {
        "siTradeId":row.tradeSiTradeId,
        pageNo: this.chargePageParams.pageNo,
        pageSize: this.chargePageParams.pageSize
      };
      if(type === "charge"){
        getPageTradeChargeDetailList(params)
              .then(res => {
                console.log(res);
                this.isloading = false;
                if (res.code === 1) {
                  this.chargePageParams.total = res.total;
                  this.chargeData = res.data.map((item) => {
                    item.recordStatus = item.recordStatus === "0" ? "未上传" : item.recordStatus === "1" ? "已上传" : "已撤销";
                    item.totalAmt = item.totalAmt.toFixed(2);
                    item.price = item.price.toFixed(2);
                    return item;
                  });
                  this.chargeParams = [
                        {
                          prop: "hisChargeItemCode",
                          label: "HiS项目编码"
                        },{
                          prop: "hisChargeItemName",
                          label: "HiS项目名称"
                        },{
                          prop: "siChargeItemCode",
                          label: "医保项目编码"
                        },{
                          prop: "siChargeItemName",
                          label: "医保项目名称"
                        },{
                          prop: "siChargeUnit",
                          label: "单位"
                        },{
                          prop: "price",
                          label: "单价"
                        },{
                          prop: "orderQuantity",
                          label: "数量"
                        },{
                          prop: "pricUplmtAmt",
                          label: "定价上限金额"
                        },{
                          prop: "selfPayPercent",
                          label: "自付比例"
                        },{
                          prop: "returnAllSelfPayAmt",
                          label: "全自费金额"
                        },{
                          prop: "returnExceedLimitAmtSelfPayAmt",
                          label: "超限价金额"
                        },{
                          prop: "returnPreSelfPayAmt",
                          label: "先行自付金额"
                        },{
                          prop: "returnWithinMedicareFundAmt",
                          label: "符合政策范围内金额"
                        },{
                          prop: "siItemLimitUserFlag",
                          label: "限制使用标志"
                        },

                        /* {
                          prop: "recipeNum",
                          label: "费用单据号"
                        },{
                          prop: "recipeTime",
                          label: "费用单据日期",
                          width: 180
                        },{
                          prop: "chargeItemType",
                          label: "费用项目类型"
                        },{
                          prop: "chargeType",
                          label: "项目类型"
                        },{
                          prop: "siChareDetailSerialNum",
                          label: "医保费用明细流水号"
                        },{
                          prop: "price",
                          label: "单价",
                          align:"right",
                          width: 100
                        },{
                          prop: "hisChargeUnit",
                          label: "HIS单位"
                        },{
                          prop: "siChargeUnit",
                          label: "医保单位"
                        },{
                          prop: "chargeQuantity",
                          label: "数量"
                        },{
                          prop: "orderQuantity",
                          label: "贴数"
                        },{
                          prop: "totalAmt",
                          label: "金额",
                          align:"right",
                          width: 100
                        },{
                          prop: "selfPayPercent",
                          label: "自付比例"
                        },{
                          prop: "hisDosageType",
                          label: "HIS剂型"
                        },{
                          prop: "siDosageType",
                          label: "医保剂型"
                        },{
                          prop: "hisDosageUnit",
                          label: "HIS剂量单位"
                        },{
                          prop: "siDosageUnit",
                          label: "医保剂量单位"
                        },{
                          prop: "spec",
                          label: "规格"
                        },{
                          prop: "useLevel",
                          label: "用量"
                        },{
                          prop: "hisDrugUsage",
                          label: "用法"
                        },{
                          prop: "hisDrugFrequency",
                          label: "HIS保频次"
                        },{
                          prop: "siDrugFrequency",
                          label: "医保频次"
                        },{
                          prop: "chargeTime",
                          label: "费用发生时间",
                          width: 180
                        },{
                          prop: "useObject",
                          label: "使用对象"
                        },{
                          prop: "bedNum",
                          label: "床号"
                        },{
                          prop: "doctorCode",
                          label: "医师代码"
                        },{
                          prop: "doctorName",
                          label: "医师名称"
                        },{
                          prop: "sdeptName",
                          label: "科室名称"
                        },{
                          prop: "orderDay",
                          label: "医嘱天数"
                        },{
                          prop: "operatorCode",
                          label: "经办人代码"
                        },{
                          prop: "operatorName",
                          label: "经办人名称"
                        },{
                          prop: "recordStatus",
                          label: "状态",
                          width: 80
                        } */
                  ];
                  this.isShow = true;
                  this.operateType = "charge";
                }

              })
              .catch(err => {
                this.isloading = false;
              });
      }else{
     getPageTradeAmtDetail(params)
              .then(res => {

                if (res.code === 1) {
                  this.chargePageParams.total = res.total;
                  this.chargeData = res.data.map((item) => {
                    item.recordStatus = item.recordStatus === "0" ? "未上传" : item.recordStatus === "1" ? "已上传" : "已撤销";
                    item.tradeAmt = item.tradeAmt.toFixed(2);
                    return item;
                  });
                  // let returnData = res.data;
                  // let chargeItem ={};
                  // this.chargeParams = returnData.map((item)=>{
                  //    let chargeParam ={
                  //          prop : item.tradeAmtCode,
                  //         label : item.tradeAmtName
                  //      }
                  //     chargeItem[item.tradeAmtCode]=item.tradeAmt;
                  //     return chargeParam;
                  // });


                  //  this.chargeData =[chargeItem];
                  this.chargeParams = [
                    {
                        prop: "tradeAmtCode",
                        label: "分类名称",
                        width:230
                     },{
                        prop: "tradeAmt",
                        label: "金额",
                        width:200,
                        align:"right"
                     }
                    //  ,{
                    //     prop: "tradeAmtCode",
                    //     label: "分类代码",
                    //     width:200
                    //  },{
                    //     prop: "remark",
                    //     label: "备注",
                    //     width:200
                    //  },{
                    //     prop: "recordStatus",
                    //     label: "状态",
                    //     width:200
                    //  }
                    ];
                   this.isShow = true;
                   this.operateType = "amt";
                }
                this.isloading = false;
              })
              .catch(err => {
                this.isloading = false;
              });
      }
    },
     changesSize(val) {
      this.chargePageParams.pageSize = val;
      this.loadChargeTable();
    },
    changesPage(val) {
      this.chargePageParams.pageNo = val;
      this.loadChargeTable();
    },
    headerDragend() {
      this.$refs.singleTable.doLayout();
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-paylist{
    height: 400px;
    width: 100%;
  }
.dict-box {
  overflow: hidden;
  background-color: $l-color-white;
  .dict-left {
    display: flex;
    flex-direction: column;
    padding: 10px;
    overflow: hidden;
    .search {
      display: flex;
      .search-input {
        flex: 1;
        overflow: hidden;
        /deep/ .l-input-wrap {
          vertical-align: top;
        }
        .el-row {
          margin-bottom: 10px;
        }
      }
      .search-btn {
        margin-left: 10px;
      }
    }
    .table {
      flex: 1;
      overflow: hidden;
      margin-bottom: 10px;
    }

  }
  .page {
    text-align: right;
    .el-pagination {
      padding: 0;
      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
    }
  }
  .card-title {
    height: 20px;
    line-height: 20px;
    margin-bottom: 10px;
    /deep/ .titleleft::before {
      margin-top: 0;
    }
  }
  .form {
    flex: 1;
    overflow: hidden;
    margin-bottom: 10px;
    overflow-y: auto;
    /deep/ .el-form-item__content {
      height: 36px;
      margin-bottom: 20px;
    }
  }
  .form-btn {
    text-align: right;
    padding-top: 10px;
    border-top: 1px solid $l-color-bgcolor-11;
  }
}
</style>
