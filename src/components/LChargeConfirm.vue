<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :append-to-body="true" top="5vh" title="结算详情确认">
    <div class="dialog-content" v-loading="allLoading">
      <div class="left">
        <div class="top">
          <div class="title">待结算费用确认</div>
          <el-table
            :data="chargeObj.outpChargeDetailVO2s"
            style="
              width: 100%;
              height: calc(100% - 50px);
              margin-top: 8px;
              margin-bottom: 16px;
            "
            border
          >
            <el-table-column
              type="index"
              width="50px"
              label="序号"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              v-for="(item, index) in outpChargeDetailVO2sParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'chargeUnit'">
                  <span
                    v-if="!isChinese(scope.row[item.prop])"
                    :val="scope.row.chargeUnitId"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
                <template
                  v-else-if="
                    item.prop == 'chargeQuantity' ||
                    item.prop == 'totalAmt' || 
                    item.prop == 'derateAmount'
                  "
                >
                  {{ scope.row[item.prop].toFixed(2) }}
                </template>
                <template v-else-if="item.prop == 'chargePrice'">
                  {{ scope.row[item.prop].toFixed(4) }}
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bottom">
          <div class="title">费用汇总</div>
          <el-table
            :data="finClassVOsData"
            style="width: 100%; height: calc(100% - 50px); margin-top: 8px"
            border
          >
            <el-table-column
              prop="className"
              label="收费项目"
              header-align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row["className"] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalMoney"
              label="金额（元）"
              header-align="center"
              align="right"
            >
              <template slot-scope="scope">
                <span>{{
                  typeof scope.row["totalMoney"] === "number"
                    ? scope.row["totalMoney"].toFixed(2)
                    : ""
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="className2"
              label="收费项目"
              header-align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row["className2"] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalMoney2"
              label="金额（元）"
              header-align="center"
              align="right"
            >
              <template slot-scope="scope">
                <span>{{
                  typeof scope.row["totalMoney2"] === "number"
                    ? scope.row["totalMoney2"].toFixed(2)
                    : ""
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="className3"
              label="收费项目"
              header-align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row["className3"] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalMoney3"
              label="金额（元）"
              header-align="center"
              align="right"
            >
              <template slot-scope="scope">
                <span>{{
                  typeof scope.row["totalMoney3"] === "number"
                    ? scope.row["totalMoney3"].toFixed(2)
                    : ""
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="AllAmt">合计金额：{{AllAmt || ""}}</div>
      </div>
      <div class="right">
        <div class="top">
          <span class="title">结算类型</span>
          <el-select v-model="settlementType" placeholder="请选择" style="width:70px">
            <el-option
              v-for="item in chargeObj.settlementTypeInfoDTOS"
              :key="item.settlementTypeCode"
              :label="item.settlementTypeName"
              :value="item.settlementTypeCode"
            >
            </el-option>
          </el-select>
          <SZReadCard
            v-if="isNewSurance == '01' && settlementType == '3'"
            style="margin-left: 16px"
            @cardInfo="cardInfoHandler"
            :showCardNum="false"
            :showPassword="true"
          ></SZReadCard>
          <SZReadCardNew
            v-if="isNewSurance == '02' && settlementType == '3'"
            style="margin-left: 16px"
            @cardInfo="cardInfoHandlerNew"
            @patientInsurenceData="patientInsurenceData"
            :showPopover="false"
            ref="SZReadCardNew"
          ></SZReadCardNew>
          <el-input v-if="isNewSurance == '02' && settlementType == '3'" v-model="passward" placeholder="密码" style="width:90px"></el-input>
        </div>
        <div class="content" v-if="settlementType == '3' && isNewSurance == '01'">
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
            <span class="item disabled">{{
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
            <span class="item disabled">{{
              transform("AAC066", patientInfo.siPatientDto.insuranceCrowdType)
            }}</span>
          </LFormtTitle>
          <LFormtTitle label="高血压标识">
            <!-- <el-input
              v-model="patientInfo.siPatientDto.hypertensionFlag"
              disabled
            ></el-input> -->
            <span class="item disabled">{{
              patientInfo.siPatientDto.hypertensionFlag ? "是" : "否"
            }}</span>
          </LFormtTitle>
          <LFormtTitle label="糖尿病标识">
            <!-- <el-input
              v-model="patientInfo.siPatientDto.diabetesFlag"
              disabled
            ></el-input> -->
            <span class="item disabled">{{
              patientInfo.siPatientDto.diabetesFlag ? "是" : "否"
            }}</span>
          </LFormtTitle>
          <LFormtTitle label="医疗证号">
            <el-input
              v-model="patientInfo.siPatientDto.cardNum"
              disabled
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="社康信息">
            <el-input
              v-model="patientInfo.siPatientDto.bindingSocialHealthName"
              disabled
            ></el-input>
          </LFormtTitle>
          <div class="title" style="margin: 8px 0">结算信息</div>
          <LFormtTitle label="医疗类别">
            <el-select
              clearable
              filterable
              :disabled="isZF()"
              v-model="form.medicalTypeCode"
              placeholder="请选择"
              :filter-method="ylOptionCodeFilter"
              @change="medicalTypeCodeChange"
            >
              <el-option
                v-for="item in ylOption"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="主疾病编码">
            <el-select
              v-model="form.mainDiagCode"
              clearable
              filterable
              remote
              placeholder="请输入关键词"
              :disabled="isZF()"
              :remote-method="getDiseaseDirectoryList1"
              :loading="loading"
              @clear="clearOption(1)"
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
              v-model="form.firstDiagCode"
              clearable
              filterable
              remote
              placeholder="请输入关键词"
              :disabled="isZF()"
              :remote-method="getDiseaseDirectoryList2"
              :loading="loading"
              @clear="clearOption(2)"
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
              v-model="form.secondDiagCode"
              clearable
              filterable
              remote
              placeholder="请输入关键词"
              :disabled="isZF()"
              :remote-method="getDiseaseDirectoryList3"
              :loading="loading"
              @clear="clearOption(3)"
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
            <el-select
              clearable
              filterable
              :disabled="isZF()"
              v-model="form.bigDiseaseTypeCode"
              placeholder="请选择"
              :filter-method="dbOptionCodeFilter"
            >
              <el-option
                v-for="item in dbOption"
                :key="item[dbOptionKeys.value]"
                :label="item[dbOptionKeys.label]"
                :value="item[dbOptionKeys.value]"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="特检类别">
            <el-select
              clearable
              filterable
              :disabled="isZF()"
              v-model="form.specialSurveyTypeCod"
              placeholder="请选择"
              :filter-method="tjOptionCodeFilter"
            >
              <el-option
                v-for="item in tjOption"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="门诊慢性病种">
            <el-select
              clearable
              filterable
              :disabled="isZF()"
              v-model="form.chronicDiseaseCode"
              placeholder="请选择"
              @change="chronicDiseaseChange"
            >
              <el-option
                v-for="item in mbOption"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="休假天数">
            <el-input :disabled="isZF()" v-model="form.daysOff"></el-input>
          </LFormtTitle>
          <LFormtTitle label="打包收费编码">
            <el-input
              :disabled="isZF()"
              v-model="form.packChareCode"
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="先行支付决定书编号">
            <el-input
              :disabled="isZF()"
              v-model="form.prePayBillNum"
            ></el-input>
          </LFormtTitle>
          <!-- <LFormtTitle label="工伤事故编号">
            <el-input
              :disabled="isZF()"
              v-model="form.accidentWorkInjuryCode"
            ></el-input>
          </LFormtTitle> -->
          <div class="title" style="margin: 8px 0">生育医疗</div>
          <LFormtTitle label="孕周">
            <el-input
              :disabled="isZF()"
              type="number"
              v-model="form.gestationWeeks"
            ></el-input>
          </LFormtTitle>
          <LFormtTitle label="计生证号">
            <el-input :disabled="isZF()" v-model="form.maternityNum"></el-input>
          </LFormtTitle>
          <LFormtTitle label="建册日期">
            <el-date-picker
              :disabled="isZF()"
              v-model="form.archiveDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </LFormtTitle>
        </div>
        <div class="content" v-else-if="settlementType == '3' && isNewSurance == '02'">
          <div class="newSuranceTitle" style="margin-bottom: 8px">
            患者基本信息
            <el-button type="primary" @click="showNewSuranceSettle">医保缴费信息</el-button>
          </div>
          <LFormtTitle :label="item.label"
            v-for="(item, index) in siPatientDtoLists"
            :key="index">
            <div
              v-if="item.prop == 'identificationType'"
              class="span-content"
            >{{transformNew('psn_cert_type', patientInfoNew.siPatientDto[item.prop])}}</div>
            <div
              v-else-if="item.prop == 'gender'"
              class="span-content"
            >{{transformNew('gend', patientInfoNew.siPatientDto[item.prop])}}</div>
            <div
              v-else-if="item.prop == 'nation'"
              class="span-content"
            >{{transformNew('naty', patientInfoNew.siPatientDto[item.prop])}}</div>
            <div
              v-else-if="item.prop == 'age'"
              class="span-content"
            ><div v-if="patientInfoNew.siPatientDto[item.prop]">{{ patientInfoNew.siPatientDto[item.prop] }}岁</div></div>
            <div v-else-if="item.prop == 'personPropertyType'" class="span-content"
              >{{ transformNew("clctstd_crtf_rule_codg", patientInfoNew.siPatientDto[item.prop]) }}</div
            >
            <div v-else-if="item.prop == 'bindingSocialHealthName'" class="span-content" :title="patientInfoNew.siPatientDto[item.prop]"
              >{{ patientInfoNew.siPatientDto[item.prop] }}</div
            >
            <div v-else class="span-content">{{ patientInfoNew.siPatientDto[item.prop] }}</div>
          </LFormtTitle>
          <LFormtTitle label="账户余额">
            <div class="span-content">{{ patientInfoNew["balcAmt"] }}</div>
          </LFormtTitle>
          <div class="title" style="margin-bottom: 8px">其他信息</div>
          <LFormtTitle label="医疗类别" required>
            <el-select
              clearable
              v-model="formNew.medicalTypeCode"
              placeholder="请选择"
              @change="medicalTypeCodeNewChange"
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
          <LFormtTitle label="险种类型" required>
            <el-select
              clearable
              v-model="formNew.insuranceTypeCode"
              placeholder="请选择"
              @change="insuranceTypeCodeChange(formNew.insuranceTypeCode)"
            >
              <el-option
                v-for="item in insutypeList"
                :key="item.dictCode"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="常见特慢病" :class="{'familiar': isFamiliar}">
            <div style="height:32px;padding:5px 0 0 8px">
              <el-radio-group v-model="formNew.chronicDiseaseCode4" @change="chronicDiseaseCode4Change">
                <el-radio v-for="(item,index) in outpSpecialQuickOptions" :key="index" :label="item.mmmtbzmldm" @click.native="chronicDiseaseCode4Click(formNew.chronicDiseaseCode4, item.mmmtbzmldm, $event)">{{item.mmmtbzmc}}</el-radio>
              </el-radio-group>
            </div>
          </LFormtTitle>
          <LFormtTitle label="其他特慢病">
            <el-select
              clearable
              v-model="formNew.chronicDiseaseCode1"
              placeholder="请选择"
              filterable
              @change="chronicDiseaseCode1Change"
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
              filterable
              v-model="formNew.chronicDiseaseCode2"
              placeholder="请选择"
              @change="chronicDiseaseCode2Change"
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
          <LFormtTitle label="特检项目">
            <el-select
              clearable
              filterable
              v-model="formNew.chronicDiseaseCode3"
              placeholder="请选择"
              @change="chronicDiseaseCode3Change"
            >
              <el-option
                v-for="(item,index) in TJXMOptions"
                :key="index"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
          <LFormtTitle label="计生手术类别">
            <el-select
              clearable
              v-model="formNew.birctrlType"
              placeholder="请选择"
              @change="birctrlTypeChange"
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
              v-model="formNew.birctrlMatnDate"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </LFormtTitle>
          <LFormtTitle label="账户使用标志" required>
            <div style="height:32px;padding:5px 0 0 8px">
              <el-radio v-model="formNew.personalAccountUserFlag" label="1">是</el-radio>
              <el-radio v-model="formNew.personalAccountUserFlag" label="0">否</el-radio>
            </div>
          </LFormtTitle>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="allLoading" @click="cancel">取 消</el-button>
      <el-button type="primary" :disabled="allLoading" @click="sure">确认结算</el-button>
    </span>
    <el-dialog width="1300px" :visible.sync="newSuranceSettleVisible" :append-to-body="true" top="5vh" title="患者医保缴费信息">
      <div class="dialog-content dialog-content-new">
        <div class="title">参保信息</div>
        <el-table
          :data="siPatientInsuranceInfoDtosTableData"
          border
          width="100%"
        >
          <el-table-column
            v-for="(item, index) in siPatientInsuranceInfoDtosList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'center'"
            :header-align="item.headerAlign || 'center'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="item.hasOwnProperty('code')">{{
                transformNew(item.code, scope.row[item.prop])
              }}</span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="title">定点医药机构</div>
        <el-table
          :data="siPatientHosDtosTableData"
          border
          width="100%"
        >
          <el-table-column
            v-for="(item, index) in siPatientHosDtosList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'center'"
            :header-align="item.headerAlign || 'center'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="item.hasOwnProperty('code')">{{
                transformNew(item.code, scope.row[item.prop])
              }}</span>
              <span v-else-if="item.prop==='begndate'||item.prop==='enddate'">
                <span v-if="scope.row[item.prop]">{{ scope.row[item.prop].indexOf(" ") > -1 ? scope.row[item.prop].split(" ")[0] : scope.row[item.prop]}}</span>
                <span v-else></span>
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="title">缴费信息</div>
        <el-table
          :data="siPatientChargeInfoDtosTableData"
          border
          width="100%"
        >
          <el-table-column
            v-for="(item, index) in siPatientChargeInfoDtosList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'center'"
            :header-align="item.headerAlign || 'center'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="item.hasOwnProperty('code')">{{
                transformNew(item.code, scope.row[item.prop])
              }}</span>
              <span v-else-if="item.prop==='clctTime'">{{
                scope.row[item.prop].split(" ")[0]
              }}</span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
       <span slot="footer" class="dialog-footer">
        <el-button @click="hideNewSuranceSettle">关 闭</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import appointment from "@/api/appointment/appointment";
import NP from "number-precision";
import healthInsuranceService from "@/api/healthInsurance/index.js";
import SZReadCard from "@/components/SZReadCard.vue";
import SZReadCardNew from "@/views/medicalInsuranceNew/components/SZReadCard.vue";
import { deepClone } from "@/utils/index.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";

import { siPatientDtoList, siPatientInsuranceInfoDtosList, siPatientHosDtosList, siPatientChargeInfoDtosList} from "@/views/medicalInsuranceNew/common/patientHealthInfo.js";

export default {
  name: "LChargeConfirm",
  mixins: [getDictInfoNew],
  props: {
    charge: {
      type: Object,
      defalut: {}
    },
    // true 预约预结算， false 门诊预结算
    isApptointment: {
      type: Boolean,
      required: true
    }
  },
  components: {
    SZReadCard,
    SZReadCardNew
  },
  computed: {
    finClassVOsData() {
      let list = [];
      // 明细表格展示修改，一行显示2列数据，偶数行左侧，奇数在右侧
      this.chargeObj.finClassVOs.forEach((item, index) => {
        if (index % 3 === 0) {
          let spanInfo = {
            ...this.chargeObj.finClassVOs[index],
            className2: "",
            totalMoney2: "",
            className3: "",
            totalMoney3: ""
          };
          let nextInfo = this.chargeObj.finClassVOs[index + 1];
          let nextTwoInfo = this.chargeObj.finClassVOs[index + 2];
          if (nextInfo) {
            spanInfo.className2 = nextInfo.className;
            spanInfo.totalMoney2 = nextInfo.totalMoney;
          }
          if (nextTwoInfo) {
            spanInfo.className3 = nextTwoInfo.className;
            spanInfo.totalMoney3 = nextTwoInfo.totalMoney;
          }
          list.push(spanInfo);
        }
      });
      return list;
    },
    siPatientDtoLists() {
      return siPatientDtoList;
    },
    siPatientInsuranceInfoDtosList() {
      return siPatientInsuranceInfoDtosList;
    },
    siPatientChargeInfoDtosList() {
      return siPatientChargeInfoDtosList;
    },
    siPatientHosDtosList() {
      return siPatientHosDtosList;
    }
  },
  data() {
    return {
      allLoading: false,
      command:
        '{"name":"medical_insurance","model":"xx","mtType":"shenzhen","mtExec":"read_local"}',
      dialogVisible: false,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      settlementType: "",
      outpChargeDetailVO2sParams: [
        {
          prop: "chargeItemName",
          label: "项目名称",
          width: "120",
          align: "center",
          headerAlign: "center"
        },
        {
          prop: "chargePrice",
          label: "单价",
          width: "70",
          align: "right",
          headerAlign: "center"
        },
        {
          prop: "chargeQuantity",
          label: "数量",
          width: "70",
          align: "right",
          headerAlign: "center"
        },
        {
          prop: "chargeUnit",
          label: "单位",
          width: "80",
          align: "center",
          headerAlign: "center"
        },
        {
          prop: "totalAmt",
          label: "金额",
          width: "70",
          align: "right",
          headerAlign: "center"
        },
        {
          prop: "derateAmount",
          label: "减免金额",
          width: "90",
          align: "right",
          headerAlign: "center"
        }
      ],
      // 预结算返回对象
      chargeObj: {
        finClassVOs: [],
        outpChargeDetailVO2s: [],
        settlementTypeInfoDTOS: []
      },
      cardInfo: {},
      patientInfo: {
        siPatientDto: {}
      },
      options1: [],
      options2: [],
      options3: [],
      ylOption: [],
      ylOptionCopy: [],
      allDbInfo: [],
      dbOption: [],
      dbOptionCopy: [],
      tjOption: [],
      tjOptionCopy: [],
      mbOption: [
        {
          dictName: "高血压",
          dictCode: "01"
        },{
          dictName: "糖尿病",
          dictCode: "02"
        }
      ],
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
        archiveDate: ""
      },
      loading: false,
      dbOptionKeys: {
        value: "dictCode",
        label: "dictName"
      },
      AllAmt: "0.00", //合计金额
      // 结算详情确认兼容新医保
      isNewSurance: "",//01标识旧医保，02标识新医保
      passward: "",
      patientInfoNew: {
        siPatientDto: {}
      },
      formNew: {
        personalAccountUserFlag: "1"
      },
      medicalTypeList: [],
      birctrlTypeList: [],
      insutypeInitList: [],
      insutypeList: [],
      TJXMOptions: [],
      isFamiliar: false,
      newSuranceSettleVisible: false,
      // 参保信息
      siPatientInsuranceInfoDtosTableData: [],
      // 定点医药机构
      siPatientHosDtosTableData: [],
      // 缴费信息
      siPatientChargeInfoDtosTableData: []
    };
  },
  watch: {
    settlementType: {
      async handler(val) {
        this.isNewSurance = '';
        // 如果是医保，调用接口查看是新医保还是旧医保，对应选择要展示的医保控件
        if(val == "3") {
          await this.getPayBySettlementType();
         
          if(this.isNewSurance == "02") {
            // 如果是医保，dentificationType 为1（身份证），则自动获取医保信息
            if (this.chargeObj.identificationType == "1" && this.chargeObj.identificationNum) {
              this.$nextTick(() => {
                this.$refs.SZReadCardNew.cardData =
                  this.chargeObj.identificationNum;
                this.$refs.SZReadCardNew.searchEnter();
              });
            }
            this.formNew = {
              personalAccountUserFlag: "1"
            };
            // this.getDictNew("").then((res) => {this. = res;});
            this.getDictNew("med_type").then((res) => {
              this.medicalTypeList = res;
              if(this.isApptointment) {
                // 预约结算
                this.formNew.medicalTypeCode = "12";
                this.medicalTypeCodeNewChange(this.formNew.medicalTypeCode);
              } else {
                if(this.charge.appointment.hasOwnProperty("diseaseType") && this.charge.appointment.diseaseType == "1") {
                  // 慢病
                  this.formNew.medicalTypeCode = "14";
                  this.medicalTypeCodeNewChange(this.formNew.medicalTypeCode);
                } else {
                  this.formNew.medicalTypeCode = "11";
                  this.medicalTypeCodeNewChange(this.formNew.medicalTypeCode);
                }
              }
            });
            this.getDictNew("birctrl_type").then((res) => {this.birctrlTypeList = res;});
            this.getDictNew("insutype").then((res) => {this.insutypeInitList = res;});
            this.getDictNew("TJXM").then((res) => {this.TJXMOptions = res;});
            if(!this.outpSpecialOptions.length) {
              await this.getOutpSpecial();
            }
             if(!this.payperDiseOptions.length) {
              await this.getPayperDise();
            }
          }
        } else if(val == "1") {
          // 自费
        }
      },
      immediate: true,
      deep: true
    }
  },
  async mounted() {
    this.preSettlementNew();
    // this.getDiseaseDirectoryList("");
    //获取医疗类别
    await this.getYlOption();
    //获取大病类别
    this.allDbInfo = await this.getDictListBySiDictCatalogId({
      siDictCatalogCode: "CKA303",
      medicareType: "01"
    });
    //获取特检类别
    this.tjOption = await this.getDictListBySiDictCatalogId({
      siDictCatalogCode: "CKA304",
      medicareType: "01"
    });
    this.tjOptionCopy = JSON.parse(JSON.stringify(this.tjOption));
    // 给慢病赋值
    if(this.charge.appointment.hasOwnProperty("diseaseType") && this.charge.appointment.diseaseType == "1") {
      // 慢病
      this.form.medicalTypeCode = "15";
      let arr = this.ylOption.filter(item=>{
        return item.dictCode == '15'
      });
      this.form.medicalTypeName = arr.length ? arr[0].dictName : "";
      this.form.chronicDiseaseCode = this.charge.appointment.chronicDisease;
      this.form.chronicDiseaseName = this.charge.appointment.chronicDiseaseName;
      this.dbOptionKeys = {
        value: "aka120",
        label: "aka121"
      };
      this.getDiseaseDirectoryList0("");
    }
  },
  methods: {
    chronicDiseaseChange(val) {
      for(let i in this.mbOption) {
        let item = this.mbOption[i];
        if(item.dictCode == val) {
          this.form.chronicDiseaseName = item.dictName;
        }
      }
    },
    ylOptionCodeFilter(val) {
      if (val) {
        //val存在
        this.ylOption = this.ylOptionCopy.filter(item => {
          if (
            !!~item.dictName.indexOf(val) ||
            !!~item.dictName.toUpperCase().indexOf(val.toUpperCase()) ||
            (!!~item.pyCode.indexOf(val) ||
              !!~item.pyCode.toUpperCase().indexOf(val.toUpperCase()))
          ) {
            return true;
          }
        });
      } else {
        //val为空时，还原数组
        this.ylOption = this.ylOptionCopy;
      }
    },
    dbOptionCodeFilter(val) {
      if (val) {
        //val存在
        this.dbOption = this.allDbInfo.filter(item => {
          if (
            !!~item.dictName.indexOf(val) ||
            !!~item.dictName.toUpperCase().indexOf(val.toUpperCase()) ||
            (!!~item.pyCode.indexOf(val) ||
              !!~item.pyCode.toUpperCase().indexOf(val.toUpperCase()))
          ) {
            return true;
          }
        });
      } else {
        //val为空时，还原数组
        this.dbOption = this.allDbInfo;
      }
    },
    tjOptionCodeFilter(val) {
      if (val) {
        //val存在
        this.tjOption = this.tjOptionCopy.filter(item => {
          if (
            !!~item.dictName.indexOf(val) ||
            !!~item.dictName.toUpperCase().indexOf(val.toUpperCase()) ||
            (!!~item.pyCode.indexOf(val) ||
              !!~item.pyCode.toUpperCase().indexOf(val.toUpperCase()))
          ) {
            return true;
          }
        });
      } else {
        //val为空时，还原数组
        this.tjOption = this.tjOptionCopy;
      }
    },
    async getYlOption() {
      this.ylOption = [];
      let res = await this.getDictListBySiDictCatalogId({
        siDictCatalogCode: "AKA130",
        medicareType: "01"
      });
      res.forEach(item => {
        if (item.remark == "0" || item.remark == "2") {
          this.ylOption.push(item);
        }
      });
      this.form.medicalTypeCode = this.ylOption[0].dictCode;
      this.form.medicalTypeName = this.ylOption[0].dictName;
      this.ylOptionCopy = JSON.parse(JSON.stringify(this.ylOption));
    },
    medicalTypeCodeChange(val) {
      for(let i in this.ylOption) {
        let item = this.ylOption[i];
        if(item.dictCode == val) {
          this.form.medicalTypeName = item.dictName;
        }
      }
      if(val == '13') {
        this.dbOptionKeys = {
          value: "dictCode",
          label: "dictName"
        };
        this.dbOption = this.allDbInfo;
      } else if (val == '15') {
        this.dbOptionKeys = {
          value: "aka120",
          label: "aka121"
        };
        this.getDiseaseDirectoryList0("");
      } else {
        this.dbOption = [];
      }
    },
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
    isChinese(temp) {
      var re = /[\d]+/;
      if (re.test(temp)) return false;
      return true;
    },
    clearOption(num) {
      this["options" + num] = [];
    },
    isZF() {
      return this.settlementType == "1" ? true : false;
    },
    async getDiseaseDirectoryList0(keyWords) {
      let res = await appointment.getDiseaseDirectoryList({
        keyWords,
        pageNo: 1,
        pageSize: 50
      });
      this.dbOption = res.data;
    },
    async getDiseaseDirectoryList1(keyWords) {
      this.loading = true;
      let res = await appointment.getDiseaseDirectoryList({
        keyWords,
        pageNo: 1,
        pageSize: 50
      });
      this.loading = false;
      this.options1 = res.data;
    },
    async getDiseaseDirectoryList2(keyWords) {
      this.loading = true;
      let res = await appointment.getDiseaseDirectoryList({
        keyWords,
        pageNo: 1,
        pageSize: 50
      });
      this.loading = false;
      this.options2 = res.data;
    },
    async getDiseaseDirectoryList3(keyWords) {
      this.loading = true;
      let res = await appointment.getDiseaseDirectoryList({
        keyWords,
        pageNo: 1,
        pageSize: 50
      });
      this.loading = false;
      this.options3 = res.data;
    },
    async getDictListBySiDictCatalogId(param) {
      let res = await appointment.getDictListBySiDictCatalogId(param);
      return res.data;
    },
    // 预结算
    preSettlementNew() {
      if (this.isApptointment) {
        // 预约预结算
        this.appointmentSettlement();
      } else {
        // 门诊预结算
        this.outpatientSettlement();
      }
    },
    // 门诊预结算
    async outpatientSettlement() {
      try {
        const params = {
          // 患者id
          patientId: this.charge.appointment.patientId,
          // 结算类型
          // settlementType: this.charge.appointment.settlementType,暂时都传1
          settlementType: "1",
          // 单位代码
          companyCode: this.charge.appointment.companyCode,
          // 人员类别
          hisPersonType: "",
          // 诊疗活动id
          diagTreatActivityId: this.charge.appointment.diagTreatActivityId,
          // 部门id
          deptId: this.charge.appointment.deptId,
          // 专科id
          ouptDeptId: this.charge.appointment.ouptDeptId,
          // 医师id
          doctorId: this.charge.appointment.doctorId,
          // 应用代码
          appCode: "",
          // 医疗类别（医保）
          medicalType: "",
          // 病种代码
          diseaseCode: "",
          // 病种名称
          diseaseName: "",
          // 病种分类代码
          diseaseTypeCode: "",
          // 门诊预收费用明细
          outpOrderChargeDetailVO2s: this.charge.chargePrescriptions,
          //预结算确认标志
          isConfirmPreSettlementFlag: 1,
          // 特殊病
          specificDisease: this.charge.appointment.hasOwnProperty("specificDisease") ? this.charge.appointment.specificDisease : "",
          specificDiseaseName: this.charge.appointment.hasOwnProperty("specificDiseaseName") ? this.charge.appointment.specificDiseaseName : "",
          // 慢病
          chronicDisease: this.charge.appointment.hasOwnProperty("chronicDisease") ? this.charge.appointment.chronicDisease : "",
          chronicDiseaseName: this.charge.appointment.hasOwnProperty("chronicDiseaseName") ? this.charge.appointment.chronicDiseaseName : "",
        };
        if (!params.diagTreatActivityId) {
          params.diagTreatActivityId = this.charge.appointment.visitCode;
        }
        // this.$showLoading();
        this.allLoading = true;
        let res = await appointment.preSettlementNew(params);
        if (res.code === 1) {
          // 预结算返回对象赋值
          this.chargeObj = { ...res.data };
          this.settlementType = this.chargeObj.settlementTypeInfoDTOS[0].settlementTypeCode;
          // this.radioDisabled = false;
          // 计算实收金额
          // const m =
          //   (res.data.selfPayMoney * 100 - this.hasPreMoney * 100) / 100;

          // let m = NP.minus(res.data.selfPayMoney, this.hasPreMoney);
          // this.realGet = m > 0 ? m : 0;
          // 计算合计金额
          this.calcAllAmt();
          this.$message({
            message: "获取待结算信息成功",
            type: "success"
          });
        } else {
          this.$message.error(res.msg || "获取待结算信息失败");
        }
      } catch (error) {
        console.log(error);
        this.$message.error(error.msg || "获取待结算信息失败");
      } finally {
        this.$hideLoading();
        this.allLoading = false;
      }
    },
    // 预约预结算
    // eslint-disable-next-line complexity
    async appointmentSettlement() {
      try {
        const params = {
          // 患者id
          patientId: this.charge.appointment.patientId || "",
          // 结算类型
          // settlementType: this.charge.appointment.settlementType || "",
          settlementType: "1",
          // 诊疗类型
          regDiagTreatType: this.charge.appointment.diagTreatType || "",
          // 挂号专科
          regSdeptId: this.charge.appointment.ouptDeptId || "",
          // 挂号医生
          regDoctorId: this.charge.appointment.doctorId || "",
          // 挂号工种代码
          regWorkCode: this.charge.appointment.workCode,
          // 预约id
          appointmentId: this.charge.appointment.appointmentId || "",
          // 单位代码
          companyCode: this.charge.appointment.companyCode || "",
          // 人员类别
          hisPersonType: "",
          // 诊疗活动id
          diagTreatActivityId: "",
          // 应用代码
          appCode: "",
          // 医疗类别（医保）
          medicalType: "",
          haveMoney:
            this.charge.haveMoney === undefined ? "" : this.charge.haveMoney,
          freeCode:
            this.charge.freeCode === undefined ? "" : this.charge.freeCode,
          //预结算确认标志
          isConfirmPreSettlementFlag: 1
        };
        this.allLoading = true;
        // this.$showLoading();
        let res = await appointment.regPresettlement(params);
        if (res.code === 1) {
          // 预结算返回对象赋值
          this.chargeObj = res.data;
          // 如果是预约免收，则直接调用自费结算接口
          if(this.charge.haveMoney === 0) {
            this.settlementType = "1";
            this.sure();
            return;
          }
          this.settlementType = this.chargeObj.settlementTypeInfoDTOS[0].settlementTypeCode;
          // this.radioDisabled = false;
          // 计算实收金额
          // const m =
          //   (res.data.selfPayMoney * 100 - this.hasPreMoney * 100) / 100;

          // let m = NP.minus(res.data.selfPayMoney, this.hasPreMoney);
          // this.realGet = m > 0 ? m : 0;
          this.calcAllAmt();
          this.$message.success(res.msg || "获取待结算信息成功!");
        } else {
          this.$message.error(res.msg || "获取待结算信息失败");
        }
      } catch (error) {
        error.msg && this.$message.error(error.msg);
      } finally {
        this.$hideLoading();
        this.allLoading = false;
      }
    },
    // 计算合计金额
    calcAllAmt() {
      let arr = this.chargeObj.outpChargeDetailVO2s;
      let num = 0;
      for(let i in arr) {
        let item = arr[i];
        num += Number(item.totalAmt) - Number(item.derateAmount)
      }
      num = num.toFixed(2);
      this.AllAmt = num;
      console.log("合计金额", num)
    },
    cancel() {
      this.$emit("cancel");
    },
    // 校验医保患者结账金额是否为0
    isSettlementZero() {
      let list = this.charge.chargePrescriptions;
      let num = 0;
      for(let i in list) {
        num += Number(list[i].totalAmt);
      }
      return num;
    },
    sure() {
      // 非挂号结算得医保结算，不结算金额为0的
      if (!this.isApptointment && this.settlementType == "3") {
        let isSettlementZero = this.isSettlementZero();
        if(!isSettlementZero) {
          this.$message.warning("该交易总金额为0，无法医保结算！");
          return;
        }
      }
      if (
        this.settlementType == "3" &&
        ((this.isNewSurance == "01" &&
        !this.patientInfo.siPatientDto.patientCode) ||
        (this.isNewSurance == "02" &&
        !this.patientInfoNew.siPatientDto.patientCode))
      ) {
        this.$message.warning("当前无医保患者code,请读取医保卡！");
        return;
      }
      if(this.settlementType == "3" && this.isNewSurance == "02") {
        // 新医保
        if(this.formNew.personalAccountUserFlag !== "0" && this.formNew.personalAccountUserFlag !== "1"){
          this.$message.warning("请选择账户使用标志！");
          return;
        }
        if(!this.formNew.medicalTypeCode){
          this.$message.warning("请选择医疗类别！");
          return;
        }
        if(!this.formNew.insuranceTypeCode){
          this.$message.warning("请选择险种类型！");
          return;
        }
        let formNew = {
          ...this.formNew,
          chronicDiseaseCode: this.formNew.chronicDiseaseCode1 || this.formNew.chronicDiseaseCode2 || this.formNew.chronicDiseaseCode3 || this.formNew.chronicDiseaseCode4 || "",
          chronicDiseaseName: this.formNew.chronicDiseaseName1 || this.formNew.chronicDiseaseName2 || this.formNew.chronicDiseaseName3 || this.formNew.chronicDiseaseName4 || "",
        }
        delete formNew.chronicDiseaseCode1;
        delete formNew.chronicDiseaseCode2;
        delete formNew.chronicDiseaseCode3;
        delete formNew.chronicDiseaseCode4;
        delete formNew.chronicDiseaseName1;
        delete formNew.chronicDiseaseName2;
        delete formNew.chronicDiseaseName3;
        delete formNew.chronicDiseaseName4;
        this.$emit("sure", {
          siReadCardDataDto: {
            ...this.cardInfo,
            // siCardNum: this.patientInfoNew.siPatientDto.identificationNum,
            siCardNum: this.cardInfo.certNo,
            cardType: this.cardInfo.cardType,
          }, //读卡信息
          siPatientDto: {...this.patientInfoNew.siPatientDto, patientPassword: this.passward}, //患者信息
          siRegDto: formNew, //登记信息
          settlementType: this.settlementType,
          // bigDiseaseInfos: this.patientInfoNew.bigDiseaseInfos,
          siPatientInsuranceInfoDtos: this.patientInfoNew.siPatientInsuranceInfoDtos
        });
        return;
      }
      // 旧医保
      this.$emit("sure", {
        siReadCardDataDto: this.cardInfo, //读卡信息
        siPatientDto: {...this.patientInfo.siPatientDto, patientPassword: this.cardInfo.passward}, //患者信息
        siRegDto: this.form, //登记信息
        settlementType: this.settlementType,
        bigDiseaseInfos: this.patientInfo.bigDiseaseInfos,
        siPatientInsuranceInfoDtos: this.patientInfo.insuranceInfos
      });
    },
    DrugUnitShow(str) {
      var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      if (reg.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    cardInfoHandler(data) {
      this.cardInfo = data;
      this.getPatientInfo({
        siCardNum: data.siPatientCode,
        password: data.passward,
        medicareType: "01",
        accidentWorkInjuryCode: ""
      });
    },
    //获取医保患者信息
    async getPatientInfo(param) {
      let res = await healthInsuranceService.patientInfo(param);
      this.patientInfo = res.data;
      //判断糖尿病和高血压标志，赋值慢病options
      // this.mbOption = [];
      /* if (res.data.siPatientDto.hypertensionFlag) {
        this.mbOption.push({
          dictName: "高血压",
          dictCode: "01"
        });
      }
      if (res.data.siPatientDto.diabetesFlag) {
        this.mbOption.push({
          dictName: "糖尿病",
          dictCode: "02"
        });
      } */
      //根据患者信息的大病种类关联全部大病种类，赋值大病options
      res.data.bigDiseaseInfos.forEach(item1 => {
        this.allDbInfo.forEach(item2 => {
          if (item2.dictCode === item1.bigDiseaseCode) {
            this.dbOption.push({
              dictName: item2.dictName,
              dictCode: item2.dictCode
            });
          }
        });
      });
    },
    /* 结算详情确认兼容新医保 */
    // 如果是医保，调用接口查看是新医保还是旧医保，对应选择要展示的医保控件
    async getPayBySettlementType() {
      this.isNewSurance = "";
      try {
        let params = {
          settlementType: this.settlementType
        }
        let res = await healthInsuranceService.getPayBySettlementType(params);
        if(res.code === 1) {
          this.isNewSurance = res.data.thirdPartyPayTypeCode;
        }
      } catch (error) {
        
      }
    },
    cardInfoHandlerNew(data) {
      this.cardInfo = data;
    },
    patientInsurenceData(data) {
      this.patientInfoNew = {
          siPatientDto: {}
      };
      if(data.hasOwnProperty("siPatientDto")) {
        let balcAmt = 0;
        let balcList = data.siPatientInsuranceInfoDtos;
        for(let i in balcList) {
          balcAmt += balcList[i].balc || 0;
        }
        this.patientInfoNew = {
          ...data,
          balcAmt
        };
        
        let arr = [];
        let list = this.insutypeInitList;
        for (let i in balcList) {
          //  let dateTimes =
          //       balcList[i].hasOwnProperty("endDate")
          //         ? new Date(balcList[i].endDate).getTime()
          //         : 0;
            // let dateTimeNows = new Date(this.dayjs(new Date()).format('YYYY-MM-DD')).getTime();
            // if(!balcList[i].hasOwnProperty("endDate") || !balcList[i].endDate || (dateTimes - dateTimeNows > 0)) {
            let obj = {
            ...balcList[i],
            dictCode: balcList[i].insuranceType
            }
            for (let j in list) {
              if (list[j].dictCode == balcList[i].insuranceType) {
                obj.dictName = list[j].dictName;
                break;
              }
            }
            arr.push(obj);
          // }
        }
        this.insutypeList = arr;
        for (let j in arr) {
          if (
            arr[j].dictCode == "390" ||
            arr[j].dictCode == "310" ||
            arr[j].dictCode == "380" ||
            arr[j].dictCode == "39001" ||
            arr[j].dictCode == "31001"
          ) {
            this.formNew.insuranceTypeCode = arr[j].dictCode;
            this.insuranceTypeCodeChange(this.formNew.insuranceTypeCode);
            break;
          }
        }
      }
      // 参保信息
      if(data.hasOwnProperty("siPatientInsuranceInfoDtos")) {
        this.siPatientInsuranceInfoDtosTableData = data.siPatientInsuranceInfoDtos;
      }
      // 定点医药机构
      if(data.hasOwnProperty("siPatientHosDtos")) {
        this.siPatientHosDtosTableData = data.siPatientHosDtos;
      }
      // 缴费信息
      if(data.hasOwnProperty("siPatientChargeInfoDtos")) {
        this.siPatientChargeInfoDtosTableData = data.siPatientChargeInfoDtos;
      }
    },
    showNewSuranceSettle() {
      this.newSuranceSettleVisible = true;
    },
    hideNewSuranceSettle() {
      this.newSuranceSettleVisible = false;
    },
    // 医疗类别change
    medicalTypeCodeNewChange(val) {
      this.$forceUpdate();
      if (val == "14") {
        this.isFamiliar = true;
      } else {
        this.isFamiliar = false;
      }
      let ylOption = this.medicalTypeList;
      let arr = ylOption.filter(item=>{
        return item.dictCode == val
      });
      this.formNew.medicalTypeName = arr.length ? arr[0].dictName : "";
    },
    // 险种类型change
    insuranceTypeCodeChange(val) {
      this.$forceUpdate();
      let ylOption = this.insutypeInitList;
      let arr = ylOption.filter(item=>{
        return item.dictCode == val
      });
      this.formNew.insuranceTypeName = arr.length ? arr[0].dictName : "";
    },
    // 特慢病change
    chronicDiseaseCode1Change(val) {
      this.$forceUpdate();
      this.formNew.chronicDiseaseCode2 = "";
      this.formNew.chronicDiseaseName2 = "";
      this.formNew.chronicDiseaseCode3 = "";
      this.formNew.chronicDiseaseName3 = "";
      this.formNew.chronicDiseaseCode4 = "";
      this.formNew.chronicDiseaseName4 = "";
      let ylOption = this.outpSpecialOptions;
      let arr = ylOption.filter(item=>{
        return item.mmmtbzmldm == val
      });
      this.formNew.chronicDiseaseName1 = arr.length ? arr[0].mmmtbzmc : "";
    },
    // 结算病种change
    chronicDiseaseCode2Change(val) {
      this.$forceUpdate();
      this.formNew.chronicDiseaseCode1 = "";
      this.formNew.chronicDiseaseName1 = "";
      this.formNew.chronicDiseaseCode3 = "";
      this.formNew.chronicDiseaseName3 = "";
      this.formNew.chronicDiseaseCode4 = "";
      this.formNew.chronicDiseaseName4 = "";
      let ylOption = this.payperDiseOptions;
      let arr = ylOption.filter(item=>{
        return item.abzjsbzmldm == val
      });
      this.formNew.chronicDiseaseName2 = arr.length ? arr[0].abzjsbzmc : "";
    },
    // 特检项目change
    chronicDiseaseCode3Change(val) {
      this.$forceUpdate();
      this.formNew.chronicDiseaseCode1 = "";
      this.formNew.chronicDiseaseName1 = "";
      this.formNew.chronicDiseaseCode2 = "";
      this.formNew.chronicDiseaseName2 = "";
      this.formNew.chronicDiseaseCode4 = "";
      this.formNew.chronicDiseaseName4 = "";
      let ylOption = this.TJXMOptions;
      let arr = ylOption.filter(item=>{
        return item.dictCode == val
      });
      this.formNew.chronicDiseaseName3 = arr.length ? arr[0].dictName : "";
    },
    // 常见特慢病change
    chronicDiseaseCode4Change(val) {
      this.$forceUpdate();
      this.formNew.chronicDiseaseCode1 = "";
      this.formNew.chronicDiseaseName1 = "";
      this.formNew.chronicDiseaseCode2 = "";
      this.formNew.chronicDiseaseName2 = "";
      this.formNew.chronicDiseaseCode3 = "";
      this.formNew.chronicDiseaseName3 = "";
      let ylOption = this.outpSpecialQuickOptions;
      let arr = ylOption.filter(item=>{
        return item.mmmtbzmldm == val
      });
      this.formNew.chronicDiseaseName4 = arr.length ? arr[0].mmmtbzmc : "";
    },
    chronicDiseaseCode4Click(chronicDiseaseCode4, mmmtbzmldm, e) {
      if (e.target.tagName !== "INPUT") {
        return;
      }
      if (chronicDiseaseCode4 !== "") {
        this.$set(this.formNew, "chronicDiseaseCode4", "");
      }
    },
    // 计生类别change
    birctrlTypeChange(val) {
      this.$forceUpdate();
      let ylOption = this.birctrlTypeList;
      let arr = ylOption.filter(item=>{
        return item.dictCode == val
      });
      this.formNew.birctrlTypeName = arr.length ? arr[0].dictName : "";
    }
  }
};
</script>

<style lang="scss" scoped>
.familiar{
    /deep/.l-input-title{
      color: #0000FF !important;
    }
  }
>>> .el-dialog {
  height: 90%;
}

>>> .el-dialog__body {
  height: calc(100% - 120px);
}

>>> .l-input-wrap {
  width: 276px !important;
  margin-right: 16px;
  margin-bottom: 8px;
}

.dialog-content {
  display: flex;
  height: 100%;

  .title {
    min-width: 85px;
    font-size: 18px;
    font-weight: 700;
    display: flex;
    align-items: center;
    // color:#303133;
  }

  .newSuranceTitle{
    min-width: 85px;
    font-size: 18px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .left {
    width: 50%;
    flex: 1;
    border-right: 1px solid #ccc;
    padding: 16px;

    // display: flex;
    // flex-direction: column;
    >>> .el-table__body-wrapper {
      overflow: auto;
      height: calc(100% - 24px);
    }

    .top {
      height: 60%;
    }

    .bottom {
      height: 38%;
    }
    .AllAmt {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .right {
    flex: 1;
    width: 50%;

    .top {
      padding: 16px;
      border-bottom: 1px solid #ccc;
      display: flex;
    }

    .content {
      padding: 16px;
      overflow: auto;
      height: calc(100% - 65px);
    }
    .span-content{
      padding: 0 8px;
      height: 32px;
      line-height: 32px;
    }
  }
  .item {
    height: 32px;
    padding: 8px;
    align-items: center;
    display: flex;
    color: #2e323a;
  }
  .disabled {
    background: #f5f7fa;
    cursor: not-allowed;
  }
}

.dialog-content-new{
  flex-direction: column;
  padding: 8px 8px 8px 20px;
}

</style>
