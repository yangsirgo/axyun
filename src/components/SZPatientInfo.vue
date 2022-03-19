<template>
  <div style="display: flex; flex-direction: column">
    <div class="formArea">
      <div
        class="formItem"
        :style="{ width: 100 / colNum + '%' }"
        v-for="(item, index) in patientInfo"
        :key="index"
      >
        <LFormtTitle :label="item.label">
          <!-- <span v-if="item.prop == 'gender'" :val="item.value" code="AAC004" v-codeTransform></span>
          <span v-else-if="item.prop == 'identificationType'" :val="item.value" code="AAC058" v-codeTransform></span> -->
          <span v-if="item.prop == 'gender'" class="content">{{
            transform("AAC004", item.value)
          }}</span>
          <span v-else-if="item.prop == 'identificationType'" class="content">{{transform("AAC058",item.value)}}</span>
          <span v-else-if="item.prop == 'cardStatus'" class="content">{{transform("AAZ515",item.value)}}</span>
          <span v-else-if="item.prop == 'domicile'" class="content">{{transform("CAC215",item.value)}}</span>
          <span v-else-if="item.prop == 'insuranceCrowdType'" class="content">{{transform("AAC066",item.value)}}</span>
          <span v-else-if="item.prop == 'insureStatus'" class="content">{{insureStatus(item.value)}}</span>
          <span v-else-if="item.prop == 'criticalIllnessInsuranceStatus'" class="content">{{criticalIllnessInsuranceStatus(item.value)}}</span>
          <span v-else-if="item.prop == 'hypertensionFlag'" class="content">{{item.value?'是':'否'}}</span>
          <span v-else-if="item.prop == 'diabetesFlag'" class="content">{{item.value?'是':'否'}}</span>
          <span v-else-if="item.prop == 'limitType'" class="content">{{limitType(item.value)}}</span>
          <span v-else-if="item.prop == 'healthCareInformation'" class="content">{{healthCareInformation(item.value)}}</span>
          <span v-else-if="item.prop == 'basicLivingAllowanceType'" class="content">{{basicLivingAllowanceType(item.value)}}</span>
          <span v-else class="content">{{ item.value }}</span>
        </LFormtTitle>
      </div>
    </div>
    <el-radio-group v-model="tableType" style="margin-top: 8px">
      <el-radio-button label="1">参保险种信息</el-radio-button>
      <el-radio-button label="2">监护人信息</el-radio-button>
      <el-radio-button label="3">门诊大病信息</el-radio-button>
      <el-radio-button label="4">个人医保累计信息</el-radio-button>
    </el-radio-group>
    <el-table
      v-show="tableType == 1"
      :data="tableData[0]"
      border
      style="width: 100%; margin-top: 8px"
    >
      <el-table-column
        v-for="(item, index) in columnParams1"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'center'"
        :header-align="item.headerAlign || 'center'"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="item.prop == 'companyType'">{{transform("AAB019",scope.row[item.prop])}}</span>
          <span v-else-if="item.prop == 'insuranceType'">{{transform("AAE140",scope.row[item.prop])}}</span>
          <span v-else-if="item.prop == 'personType'">{{transform("BCC334",scope.row[item.prop])}}</span>
          <span v-else-if="item.prop == 'chargeStatus'">{{chargeStatus[scope.row[item.prop]]}}</span>
          <span v-else>{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-show="tableType == 2"
      :data="tableData[1]"
      border
      style="width: 100%; margin-top: 8px"
    >
      <el-table-column
        v-for="(item, index) in columnParams2"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'center'"
        :header-align="item.headerAlign || 'center'"
        show-overflow-tooltip
      >
      <template slot-scope = "scope">
        <span v-if="item.prop == 'guradianIdentificationType'">{{transform("AAC058",item.value)}}</span>
        <span v-else>{{scope.row[item.prop]}}</span>
      </template>
      </el-table-column>
    </el-table>
    <el-table
      v-show="tableType == 3"
      :data="tableData[2]"
      border
      style="width: 100%; margin-top: 8px"
    >
      <el-table-column
        v-for="(item, index) in columnParams3"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'center'"
        :header-align="item.headerAlign || 'center'"
        show-overflow-tooltip
      >
      </el-table-column>
    </el-table>
    <el-table
      v-show="tableType == 4"
      :data="tableData[3]"
      border
      style="width: 100%; margin-top: 8px"
    >
      <el-table-column
        v-for="(item, index) in columnParams4"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :align="item.align || 'center'"
        :header-align="item.headerAlign || 'center'"
        show-overflow-tooltip
      >
      <template slot-scope = "scope">
        <span v-if="item.prop == 'insuranceType'">{{transform("AAE140",scope.row[item.prop])}}</span>
        <span v-else-if="item.prop == 'personalSiSumInfoType'">{{transform("AKA037",scope.row[item.prop])}}</span>
        <span v-else>{{scope.row[item.prop]}}</span>
      </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
let initInfo = [
  {
    label: "姓名",
    prop: "patientName",
    value: "",
  },
  {
    label: "性别",
    prop: "gender",
    value: "",
  },
  {
    label: "出生日期",
    prop: "birthDate",
    value: "",
  },
  {
    label: "年龄",
    prop: "age",
    value: "",
  },
  {
    label: "医疗证号",
    prop: "cardNum",
    value: "",
  },
  {
    label: "社会保障号码",
    prop: "patientCode",
    value: "",
  },
  {
    label: "社保卡状态",
    prop: "cardStatus",
    value: "",
  },
  {
    label: "社保卡号",
    prop: "cardNum",
    value: "",
  },
  {
    label: "人员ID",
    prop: "operatorId",
    value: "",
  },
  {
    label: "社保电脑号",
    prop: "operatorPcNum",
    value: "",
  },
  {
    label: "证件类型",
    prop: "identificationType",
    value: "",
  },
  {
    label: "证件号",
    prop: "identificationNum",
    value: "",
  },
  {
    label: "户籍",
    prop: "domicile",
    value: "",
  },
  {
    label: "参保群体",
    prop: "insuranceCrowdType",
    value: "",
  },
  {
    label: "参保状态",
    prop: "insureStatus",
    value: "",
  },
  {
    label: "重疾保险参保状态",
    prop: "criticalIllnessInsuranceStatus",
    value: "",
  },
  {
    label: "医疗保险个人账户余额",
    prop: "currentPersonalAccountBalance",
    value: "",
  },
  {
    label: "受限类别",
    prop: "limitType",
    value: "",
  },
  {
    label: "保健信息",
    prop: "healthCareInformation",
    value: "",
  },
  {
    label: "困难人员类型",
    prop: "basicLivingAllowanceType",
    value: "",
  },
  {
    label: "绑定社康",
    prop: "bindingSocialHealth",
    value: "",
  },
  {
    label: "绑定社康名称",
    prop: "bindingSocialHealthName",
    value: "",
  },
  {
    label: "绑定结算医院",
    prop: "bindingSettleHospital",
    value: "",
  },
  {
    label: "绑定结算医院名称",
    prop: "bindingSettleHospitalName",
    value: "",
  },
  {
    label: "高血压标识",
    prop: "hypertensionFlag",
    value: "",
  },
  {
    label: "糖尿病标识",
    prop: "diabetesFlag",
    value: "",
  },
  {
    label: "工伤医疗康复期开始日期",
    prop: "inductrialInjuryRehabilitationBeginDate",
    value: "",
  },
  {
    label: "工伤医疗康复期截止日期",
    prop: "inductrialInjuryRehabilitationEndDate",
    value: "",
  },
];
export default {
  
  props: {
    colNum: {
      type: Number,
      default: 2,
    },
    siPatientDto: {
      type: Object,
      default: {},
    },
    tableData: {
      type: Array,
      default: [],
    },
  },
  watch: {
    siPatientDto: function (info) {
      let initPatientInfo = JSON.parse(JSON.stringify(initInfo));
      initPatientInfo.forEach((item) => {
        for (let key in info) {
          if (key == item.prop) {
            item.value = info[key];
          }
        }
      });
      this.patientInfo = initPatientInfo;
    },
  },
  data() {
    return {
      chargeStatus:{
        1:'正常参保',
        2:'暂停参保',
        3:'终止参保'
      },
      patientInfo: [],

      columnParams1: [
        {
          prop: "companyCode",
          label: "单位编号",
          width: "120",
        },
        {
          prop: "companyName",
          label: "单位名称",
          width: "120",
        },
        {
          prop: "companyType",
          label: "单位类型",
          width: "120",
        },
        {
          prop: "insuranceType",
          label: "险种类型",
          width: "120",
        },
        {
          prop: "beginDate",
          label: "开始日期",
          width: "120",
        },
        {
          prop: "endDate",
          label: "截止日期",
          width: "120",
        },
        {
          prop: "personType",
          label: "缴费人员类别",
          width: "120",
        },
        {
          prop: "chargeStatus",
          label: "缴费状态",
          width: "120",
        },
      ],
      columnParams2: [
        {
          prop: "relationType",
          label: "监护人与参保人关系",
          width: "120",
        },
        {
          prop: "guradianName",
          label: "监护人姓名",
          width: "120",
        },
        {
          prop: "guradianCode",
          label: "监护人电脑号",
          width: "120",
        },
        {
          prop: "guradianIdentificationType",
          label: "监护人证件类型",
          width: "120",
        },
        {
          prop: "guradianIdentificationNum",
          label: "监护人证件号码",
          width: "120",
        },
      ],
      columnParams3: [
        {
          prop: "bigDiseaseId",
          label: "门诊大病id",
          width: "120",
        },
        {
          prop: "bigDiseaseCode",
          label: "疾病编码",
          width: "120",
        },
        {
          prop: "bizDate",
          label: "业务年月",
          width: "120",
        },
        {
          prop: "maxUseTimes",
          label: "最多次数",
          width: "120",
        },
        {
          prop: "usedTimes",
          label: "已用次数",
          width: "120",
        },
        {
          prop: "availableTimes",
          label: "可用次数",
          width: "120",
        },
      ],
      columnParams4: [
        {
          prop: "year",
          label: "年度",
          width: "80",
        },
        {
          prop: "settleYearMonth",
          label: "结算年月",
          width: "100",
        },
        {
          prop: "insuranceType",
          label: "险种类型",
          width: "100",
        },
        {
          prop: "basicSiContinuousPayMonthCount",
          label: "基本医保连续缴费月数",
          width: "180",
        },
        {
          prop: "localSiContinuousPayMonthCount",
          label: "地补医保连续缴费月数",
          width: "180",
        },
        {
          prop: "relationOverallContinuousPayMonthCount",
          label: "家属统筹医疗连续缴费月数",
          width: "200",
        },
        {
          prop: "personalSiSumInfoType",
          label: "个人医保累计信息类别",
          width: "180",
        },
        {
          prop: "sumAmount",
          label: "累计值（当前最高限额）",
          width: "180",
        },
        {
          prop: "usedAmount",
          label: "已用值",
          width: "100",
        },
        {
          prop: "availableAmount",
          label: "可用值",
          width: "100",
        },
      ],
      tableType: 1,
    };
  },
  mounted() {
    this.patientInfo = JSON.parse(JSON.stringify(initInfo));
    // this.transform("AAC058");
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
    insureStatus(val){
      let text = '';
      switch(val){
        case '1':
          text = '正常参保';
          break
        case '2':
          text = '暂停参保'
          break
        case '3':
          text = '终止参保'
          break
        default:
          text = val;
      }
      return text;
    },
    criticalIllnessInsuranceStatus(val){
      let text = '';
      switch(val){
        case '1':
          text = '未参保';
          break
        case '2':
          text = '已参保'
          break
        case '3':
          text = '已退保'
          break
        default:
          text = val;
      }
      return text;
    },
    limitType(val){
      let text = '';
      switch(val){
        case '00':
          text = '全部限制';
          break
        case '01':
          text = '解除限制';
          break
        case '02':
          text = '门诊（含购药）限制'
          break
        case '03':
          text = '住院限制'
          break
        default:
          text = val;
      }
      return text;
    },
    healthCareInformation(val){
      let text = '';
      switch(val){
        case '1':
          text = '一级保健';
          break
        case '2':
          text = '二级保健';
          break
        case '3':
          text = '三级保健'
          break
        default:
          text = val;
      }
      return text;
    },
    basicLivingAllowanceType(val){
      let text = '';
      switch(val){
        case '1':
          text = '特困人员';
          break
        case '2':
          text = '最低生活保障家庭人员';
          break
        case '3':
          text = '低收入家庭人员'
          break
        case '4':
          text = '孤儿'
          break
        default:
          text = val;
      }
      return text;
    },
  },
};
</script>

<style lang="scss" scoped>
.formArea {
  display: flex;
  flex-wrap: wrap;

  .formItem {
    min-height: 32px;
    padding-right: 32px;
    margin-bottom: 8px;

    .content {
      height: 32px;
      padding: 0 8px;
      display: flex;
      align-items: center;
    }
  }
}
>>>.el-table__body-wrapper {
  height: calc(100% - 24px);
}
</style>
