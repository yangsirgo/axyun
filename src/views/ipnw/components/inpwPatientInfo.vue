<template>
  <div v-loading="loading">
    <el-row>
      <el-col class="row-title" :span="7">住院号</el-col>
      <el-col class="row-data blue" :span="12">{{receivePatientData.inpCode}}</el-col>
    </el-row>
    <el-row>
      <el-col class="row-title" :span="7">患者</el-col>
      <el-col class="row-data" :span="12">
        {{receivePatientData.patientName}}
        <span
          :val="receivePatientData.patientGender"
          code="GENDER_CODE"
          v-codeTransform
        ></span>
        {{receivePatientData.patientAge}}
      </el-col>
    </el-row>
    <el-row>
      <el-col class="row-title" :span="7">床号</el-col>
      <el-col class="row-data" :span="12">{{receivePatientData.bedCode}}床</el-col>
    </el-row>
    <el-row>
      <el-col class="row-title" :span="7">当前科室</el-col>
      <el-col class="row-data" :span="12">
        <span
          tableName="sys_org"
          :conditionMap="{org_type: '_DEPT_', id:inpSdeptId}"
          columns="org_nm"
          v-tableTransform
        ></span>
        <!-- receivePatientData.admissionSdeptId -->
      </el-col>
    </el-row>
    <el-row>
      <el-col class="row-title" :span="7">主诊断</el-col>
      <el-col class="row-data" :span="12">{{receivePatientData.admissionDiag}}</el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import service from "@/api/tools/medRecordDocAdvice";
export default {
  data() {
    return {
      inpSdeptId: "",
      patientInfo: {
        inpCode: "0248334454",
        // name: this.receivePatientData.patientName || "",
        name: "",
        sex: "男",
        age: "21岁",
        // bedNum: this.receivePatientData.bedCode || "",
        bedNum: "",
        department: "泌尿外科",
        mainDiagnose: ""
      },
      loading: false
    };
  },
  created() {
    this.getPatientInfo();
    console.log(this.receivePatientData, "this.receivePatientData");
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(n) {
        this.getPatientInfo();
      }
    }
  },
  methods: {
    async getPatientInfo() {
      try {
        this.loading = true;
        let res = await service.getPatientInfo({
          inpCode: this.receivePatientData.inpCode
        });
        console.log(res.data, "res.data");
        this.inpSdeptId = res.data.inpSdeptId;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
}
.row-title {
  font-size: 14px;
  
  font-weight: 400;
  color: rgba(148, 157, 163, 1);
  margin-right: 10px;
}

.row-data {
  font-size: 14px;
  
  font-weight: 400;
  color: rgba(46, 50, 58, 1);
}
.blue {
 
  font-weight: bold;
  color: rgba(61, 125, 251, 1);
}
</style>