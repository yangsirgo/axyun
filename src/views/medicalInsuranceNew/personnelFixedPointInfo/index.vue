<template>
  <el-card class="personnelFixedPointInfo height100">
    <div class="form-area">
      <el-row :gutter="10">
        <el-col :span="7">
          <SZReadCard
            @cardInfo="cardInfoHandler"
            @patientInsurenceData="patientInsurenceData"
          ></SZReadCard>
        </el-col>
        <el-col :span="6">
          <LFormtTitle label="业务申请类型" required>
            <el-select v-model="bizAppyType" clearable required>
              <el-option
                v-for="(item, index) in bizAppyTypeList"
                :key="index"
                :label="item.dictName"
                :value="item.dictCode"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
        </el-col>
        <el-col :span="11">
          <div class="float-right">
            <el-button type="primary" @click="search">查询</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-cont">
      <el-table :data="tableData" border width="100%" height="100%">
        <el-table-column
          v-for="(item, index) in personnelFixedPointInfoColumns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'center'"
          :header-align="item.headerAlign || 'center'"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.hasOwnProperty('code')">
              <span>{{ transformNew(item.code, scope.row[item.prop]) }}</span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>
<script>
import SZReadCard from "../components/SZReadCard.vue";
import service from "@/api/medicalInsuranceNew/personnelFixedPointInfo.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";

export default {
  name: "personnelFixedPointInfo",
  mixins: [getDictInfoNew],
  components: {
    SZReadCard,
  },
  data() {
    return {
      bizAppyType: "", //业务申请类型
      bizAppyTypeList: [],
      personnelFixedPointInfoColumns: [
        { prop: "psn_no", label: "人员编号", width: 150 },
        { prop: "insutype", label: "险种类型", width: 200 },
        { prop: "fix_srt_no", label: "定点排序号", width: 150 },
        { prop: "fixmedins_code", label: "定点医药机构编号", width: 150 },
        { prop: "fixmedins_name", label: "定点医药机构名称", width: 150 },
        { prop: "begndate", label: "开始日期", width: 150 },
        { prop: "enddate", label: "结束日期", width: 150 },
        { prop: "memo", label: "备注", width: 150 },
      ],
      patientInsurenceInfo: {
        siPatientDto: {},
      },
      tableData: [],
    };
  },
  created() {
    this.getDictNew("biz_appy_type").then((res) => {
      this.bizAppyTypeList = res;
    });
  },
  methods: {
    cardInfoHandler(data) {},
    patientInsurenceData(data) {
      this.patientInsurenceInfo = {
        siPatientDto: {},
      };
      if (data.hasOwnProperty("siPatientDto")) {
        this.patientInsurenceInfo = { ...data };
      }
    },
    async search() {
      if (!this.bizAppyType) {
        this.$message.warning("请选择业务申请类型再进行查询！");
        return;
      }
      if (!this.patientInsurenceInfo.siPatientDto.patientCode) {
        this.$message.warning("请先刷卡再进行查询！");
        return;
      }
      this.tableData = [];
      this.$showLoading();
      let params = {
        psnNo: this.patientInsurenceInfo.siPatientDto.patientCode || "",
        biz_appy_type: this.bizAppyType,
      };
      try {
        let res = await service.getHosRecord(params);
        if (res.code == 1) {
          this.tableData = res.data ? res.data.psnfixmedin : [];
        }
      } catch (error) {
      } finally {
        this.$hideLoading();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.personnelFixedPointInfo {
  padding: 10px;
  .form-area {
    margin-bottom: 10px;
  }
  .table-cont {
    height: calc(100% - 44px);
  }
}
</style>