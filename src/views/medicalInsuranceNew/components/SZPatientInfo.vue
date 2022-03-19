<template>
  <div class="szPatientInfo height100">
    <el-row class="formArea" :gutter="10">
      <el-col
        class="formItem"
        :span="24 / colNum"
        :style="{ width: 100 / colNum + '%' }"
        v-for="(item, index) in patientInfo"
        :key="index"
      >
        <LFormtTitle :label="item.label">
          <span v-if="item.prop == 'identificationType'" class="content">{{
            transformNew("psn_cert_type", item.value)
          }}</span>
          <span v-else-if="item.prop == 'gender'" class="content">{{
            transformNew("gend", item.value)
          }}</span>
          <span v-else-if="item.prop == 'nation'" class="content">{{
            transformNew("naty", item.value)
          }}</span>
          <span v-else-if="item.prop == 'age'" class="content"
            >{{ item.value }}岁</span
          >
          <span v-else-if="item.prop == 'personPropertyType'" class="content"
            >{{ transformNew("clctstd_crtf_rule_codg", item.value) }}</span
          >
          <span v-else class="content">{{ item.value }}</span>
        </LFormtTitle>
      </el-col>
    </el-row>
    <el-radio-group v-model="tableType">
      <el-radio-button label="1">参保信息</el-radio-button>
      <el-radio-button label="2">身份信息</el-radio-button>
    </el-radio-group>
    <div class="table-cont">
      <el-table
        v-show="tableType == 1"
        :data="tableData['siPatientInsuranceInfoDtos']"
        border
        width="100%"
        height="100%"
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
      <el-table
        v-show="tableType == 2"
        :data="tableData['siPatientIdentifyDtos']"
        border
        width="100%"
        height="100%"
      >
        <el-table-column
          v-for="(item, index) in siPatientIdentifyDtosList"
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
    </div>
  </div>
</template>

<script>
import { deepClone } from "@/utils/index.js";
import {
  siPatientDtoList,
  siPatientIdentifyDtosList,
  siPatientInsuranceInfoDtosList,
} from "../common/patientHealthInfo.js";
import getDictInfoNew from "../common/getDictInfoNew.js";

export default {
  name: "SZPatientInfo",
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
      type: Object,
      default: {},
    },
  },
  mixins: [getDictInfoNew],
  watch: {
    siPatientDto: function (info) {
      let initPatientInfo = deepClone(siPatientDtoList);
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
  computed: {
    siPatientIdentifyDtosList() {
      return siPatientIdentifyDtosList;
    },
    siPatientInsuranceInfoDtosList() {
      return siPatientInsuranceInfoDtosList;
    },
  },
  data() {
    return {
      patientInfo: [],
      tableType: 1,
    };
  },
  mounted() {
    this.patientInfo = deepClone(siPatientDtoList);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.szPatientInfo {
  .formArea {
    margin-top: 8px;

    .formItem {
      min-height: 32px;
      margin-bottom: 8px;

      .content {
        height: 32px;
        padding: 0 8px;
        display: flex;
        align-items: center;
      }
    }
  }
  .table-cont {
    margin-top: 8px;
    height: calc(100% - 128px);
  }
  >>> .el-table__body-wrapper {
    height: calc(100% - 24px);
  }
}
</style>
