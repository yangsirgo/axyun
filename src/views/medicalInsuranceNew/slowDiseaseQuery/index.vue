<template>
  <el-card class="slowDiseaseQuery height100">
    <div class="form-area">
      <SZReadCard
        @cardInfo="cardInfoHandler"
        @patientInsurenceData="patientInsurenceData"
      ></SZReadCard>
    </div>
    <div class="table-cont">
      <el-table :data="tableData" border width="100%" height="100%">
        <el-table-column
          v-for="(item, index) in slowDiseaseQueryColumns"
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
import service from "@/api/medicalInsuranceNew/slowDiseaseQuery.js";
import getDictInfoNew from "@/views/medicalInsuranceNew/common/getDictInfoNew.js";

export default {
  name: "slowDiseaseQuery",
  mixins: [getDictInfoNew],
  components: {
    SZReadCard,
  },
  data() {
    return {
      slowDiseaseQueryColumns: [
        { prop: "opsp_dise_code", label: "门慢门特病种目录代码", width: 150 },
        { prop: "opsp_dise_name", label: "门慢门特病种名称", width: 200 },
        { prop: "begndate", label: "开始日期", width: 150 },
        { prop: "enddate", label: "结束日期", width: 150 },
      ],
      patientInsurenceInfo: {
        siPatientDto: {},
      },
      tableData: [],
    };
  },
  methods: {
    cardInfoHandler(data) {},
    patientInsurenceData(data) {
      this.patientInsurenceInfo = {
        siPatientDto: {},
      };
      if (data.hasOwnProperty("siPatientDto")) {
        this.patientInsurenceInfo = { ...data };
        this.search();
      }
    },
    async search() {
      this.tableData = [];
      this.$showLoading();
      let params = {
        psnNo: this.patientInsurenceInfo.siPatientDto.patientCode || "",
      };
      try {
        let res = await service.getOpspDise(params);
        if (res.code == 1) {
          this.tableData = res.data ? res.data.feedetail : [];
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
.slowDiseaseQuery {
  padding: 10px;
  .form-area {
    margin-bottom: 10px;
    width: 460px;
  }
  .table-cont {
    height: calc(100% - 44px);
  }
}
</style>