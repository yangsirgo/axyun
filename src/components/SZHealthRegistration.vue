<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :append-to-body="true" top="5vh">
    <div class="dialogContent">
      <div class="left padding16" style="display: flex; flex-direction: column">
        <div class="between">
          <div class="title">个人医保信息</div>
          <SZReadCard
            style="margin-top: 8px"
            @cardInfo="cardInfoHandler"
            :showCardNum="false"
            :showPassword="true"
          ></SZReadCard>
        </div>

        <SZPatientInfo
          :colNum="3"
          :siPatientDto="siPatientDto"
          :tableData="tableData"
          style="margin-top: 16px; flex: 1"
        ></SZPatientInfo>
      </div>
      <div class="right padding16">
        <div class="title">家床医保登记</div>
        <LFormtTitle style="margin-top: 16px" label="医疗类别">
          <el-select
            clearable
            filterable
            v-model="form.medicalTypeCode"
            placeholder="请选择"
            :filter-method="ylOptionCodeFilter"
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
        <LFormtTitle style="margin-bottom: 24px" label="工伤事故编号">
          <el-input v-model="form.accidentWorkInjuryCode"></el-input>
        </LFormtTitle>
        <LFormtTitle label="入院科室">
          <el-input v-model="form.admissionSdeptName" disabled></el-input>
        </LFormtTitle>
        <LFormtTitle label="入院时间">
          <el-date-picker
            disabled
            v-model="form.admissionTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </LFormtTitle>
        <LFormtTitle label="病种编码">
          <el-select
            v-model="form.singleDiseaseCode"
            @change="codeForName1"
            clearable
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="remoteMethodHandler1"
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
        <LFormtTitle label="入院疾病诊断编码1">
          <el-select
            v-model="form.admissionDiagCode1"
            @change="codeForName2"
            clearable
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="remoteMethodHandler2"
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
        <LFormtTitle label="入院疾病诊断编码2">
          <el-select
            v-model="form.admissionDiagCode2"
            clearable
            filterable
            remote
            placeholder="请输入关键词"
            @change="codeForName3"
            :remote-method="remoteMethodHandler3"
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
        <LFormtTitle style="margin-bottom: 24px" label="入院疾病诊断编码3">
          <el-select
            v-model="form.admissionDiagCode3"
            clearable
            filterable
            remote
            placeholder="请输入关键词"
            @change="codeForName4"
            :remote-method="remoteMethodHandler4"
            :loading="loading"
            @clear="clearOption(4)"
          >
            <el-option
              v-for="(item, index) in options4"
              :key="index"
              :label="item.aka121"
              :value="item.aka120"
            >
            </el-option>
          </el-select>
        </LFormtTitle>
        <LFormtTitle label="出院疾病诊断编码1">
          <el-select
            v-model="form.dischargeDiag1Code"
            clearable
            filterable
            remote
            placeholder="请输入关键词"
            @change="codeForName6"
            :remote-method="remoteMethodHandler6"
            :loading="loading"
            @clear="clearOption(6)"
          >
            <el-option
              v-for="(item, index) in options6"
              :key="index"
              :label="item.aka121"
              :value="item.aka120"
            >
            </el-option>
          </el-select>
        </LFormtTitle>
        <LFormtTitle label="出院疾病诊断编码2">
          <el-select
            v-model="form.dischargeDiag2Code"
            clearable
            filterable
            remote
            placeholder="请输入关键词"
            @change="codeForName7"
            :remote-method="remoteMethodHandler7"
            :loading="loading"
            @clear="clearOption(7)"
          >
            <el-option
              v-for="(item, index) in options7"
              :key="index"
              :label="item.aka121"
              :value="item.aka120"
            >
            </el-option>
          </el-select>
        </LFormtTitle>
        <LFormtTitle label="出院疾病诊断编码3">
          <el-select
            v-model="form.dischargeDiag3Code"
            clearable
            filterable
            remote
            placeholder="请输入关键词"
            @change="codeForName8"
            :remote-method="remoteMethodHandler8"
            :loading="loading"
            @clear="clearOption(8)"
          >
            <el-option
              v-for="(item, index) in options8"
              :key="index"
              :label="item.aka121"
              :value="item.aka120"
            >
            </el-option>
          </el-select>
        </LFormtTitle>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="sure">登 记</el-button>
    </span>
  </el-dialog>
</template>

<script>
import appointment from "@/api/appointment/appointment";
import SZReadCard from "@/components/SZReadCard.vue";
import SZPatientInfo from "@/components/SZPatientInfo.vue";
import healthInsuranceService from "@/api/healthInsurance/index.js";
export default {
  name: "SzhealthRegistration",
  components: {
    SZReadCard,
    SZPatientInfo
  },
  props: {
    finAdId: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "add"
    }
  },
  computed: {
    tableData() {
      return [
        this.tableData1,
        this.tableData2,
        this.tableData3,
        this.tableData4
      ];
    }
  },
  data() {
    return {
      ylOption: [],
      ylOptionCopy: [],
      siPatientDto: {},
      cardInfo: {},
      form: {},
      settlementType: "",
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      loading: false,
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      options5: [],
      options6: [],
      options7: [],
      options8: []
    };
  },
  async mounted() {
    await this.initOptions();
    this.getRegInfo();

    this.getYlOption();
  },
  methods: {
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
    async getYlOption() {
      this.ylOption = [];
      let res = await this.getDictListBySiDictCatalogId({
        siDictCatalogCode: "AKA130",
        medicareType: "01"
      });
      res.forEach(item => {
        if (item.remark == "1" || item.remark == "2") {
          this.ylOption.push(item);
        }
      });
      this.form.medicalTypeCode = this.ylOption[0].dictCode;
      this.ylOptionCopy = JSON.parse(JSON.stringify(this.ylOption));
    },
    async initOptions() {
      let res = await appointment.getDiseaseDirectoryList({
        keyWords: "反复呼吸、泌尿、消化等系统感染",
        pageNo: 1,
        pageSize: 50
      });
      this.options1 = res.data;
    },
    codeForName1(val) {
      for (let i in this.options1) {
        if (this.options1[i].aka120 == val) {
          this.form.singleDiseaseName = this.options1[i].aka121;
        }
      }
    },
    codeForName2(val) {
      for (let i in this.options2) {
        if (this.options2[i].aka120 == val) {
          this.form.admissionDiagName1 = this.options2[i].aka121;
        }
      }
    },
    codeForName3(val) {
      for (let i in this.options3) {
        if (this.options3[i].aka120 == val) {
          this.form.admissionDiagName2 = this.options3[i].aka121;
        }
      }
    },
    codeForName4(val) {
      for (let i in this.options4) {
        if (this.options4[i].aka120 == val) {
          this.form.admissionDiagName3 = this.options4[i].aka121;
        }
      }
    },
    codeForName6(val) {
      for (let i in this.options6) {
        if (this.options6[i].aka120 == val) {
          this.form.dischargeDiag1Name = this.options6[i].aka121;
        }
      }
    },
    codeForName7(val) {
      for (let i in this.options7) {
        if (this.options7[i].aka120 == val) {
          this.form.dischargeDiag2Name = this.options7[i].aka121;
        }
      }
    },
    codeForName8(val) {
      for (let i in this.options8) {
        if (this.options8[i].aka120 == val) {
          this.form.dischargeDiag3Name = this.options8[i].aka121;
        }
      }
    },
    async getDictListBySiDictCatalogId(param) {
      let res = await appointment.getDictListBySiDictCatalogId(param);
      return res.data;
    },
    //医保住院登记-新建
    async addYBReg() {
      let res = await appointment.postYBReg({
        siRegDto: this.form, //登记信息
        siReadCardDataDto: this.cardInfo, //读卡信息信息
        siPatientDto: this.siPatientDto, //患者信息
        medicareType: "01"
      });
      return res;
    },
    //医保住院登记-修改
    async changeYBReg() {
      let res = await appointment.putYBReg({
        siRegDto: this.form, //登记信息
        siReadCardDataDto: this.cardInfo, //读卡信息信息
        siPatientDto: this.siPatientDto, //患者信息
        medicareType: "01"
      });
      return res;
    },
    //获取患者医保信息
    async getRegInfo() {
      let res = await appointment.YBRegInfo({
        finAdId: this.finAdId,
        medicareType: "01"
      });
      this.form = res.data.siRegDto;
    },
    clearOption(num) {
      this["options" + num] = [];
    },
    async remoteMethodHandler1(keyWords) {
      this.options1 = await this.getDiseaseDirectoryList(keyWords);
    },
    async remoteMethodHandler2(keyWords) {
      this.options2 = await this.getDiseaseDirectoryList(keyWords);
    },
    async remoteMethodHandler3(keyWords) {
      this.options3 = await this.getDiseaseDirectoryList(keyWords);
    },
    async remoteMethodHandler4(keyWords) {
      this.options4 = await this.getDiseaseDirectoryList(keyWords);
    },
    async remoteMethodHandler5(keyWords) {
      this.options5 = await this.getDiseaseDirectoryList(keyWords);
    },
    async remoteMethodHandler6(keyWords) {
      this.options6 = await this.getDiseaseDirectoryList(keyWords);
    },
    async remoteMethodHandler7(keyWords) {
      this.options7 = await this.getDiseaseDirectoryList(keyWords);
    },
    async remoteMethodHandler8(keyWords) {
      this.options8 = await this.getDiseaseDirectoryList(keyWords);
    },
    async getDiseaseDirectoryList(keyWords) {
      this.loading = true;
      let res = await appointment.getDiseaseDirectoryList({
        keyWords,
        pageNo: 1,
        pageSize: 50
      });
      this.loading = false;
      return res.data;
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
      this.siPatientDto = res.data.siPatientDto;
      this.tableData1 = res.data.insuranceInfos;
      this.tableData2 = res.data.guardianInfos;
      this.tableData3 = res.data.bigDiseaseInfos;
      this.tableData4 = res.data.siSumInfos;
    },
    cancel() {
      this.$emit("cancel");
    },
    async sure() {
      if (this.type == "add") {
        let res = await this.addYBReg();
        if (res.code == 1) {
          this.$emit("sure");
          this.$message.success("新建登记成功");
        }
      }
      if (this.type == "change") {
        let res = await this.changeYBReg();
        if (res.code == 1) {
          this.$emit("sure");
          this.$message.success("修改登记成功");
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
>>> .el-dialog {
  height: 90%;
}

>>> .el-dialog__body {
  height: calc(100% - 120px);
}

.dialogContent {
  height: 100%;
  display: flex;

  .between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .l-input-wrap {
    margin-bottom: 8px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }

  .left {
    flex: 2.5;
    border-right: 1px solid #ccc;
    overflow: auto;
  }

  .right {
    flex: 1;
  }
}
</style>
