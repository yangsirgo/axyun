<template>
  <div class="accountCheck height100">
    <div class="accountCheck-navBar">
      <el-row :gutter="10">
        <el-col :span="6"
          ><LFormtTitle label="日期" required>
            <el-date-picker
              v-model="searchValue.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker></LFormtTitle
        ></el-col>
        <el-col :span="4">
          <LFormtTitle label="清算类别" required>
            <el-select v-model="searchValue.clrType">
              <el-option
                v-for="(item, index) in clrTypeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </LFormtTitle>
        </el-col>
      </el-row>
    </div>
    <div class="accountCheck-tab">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.label"
          :name="item.name"
        >
          <hisAccountCheck
            v-if="activeName === 'hisAccountCheck'"
            :searchAll="searchValue"
            :medicareType="medicareType"
          ></hisAccountCheck>
          <medicalInsuranceCheck
            v-else-if="activeName === 'medicalInsuranceCheck'"
            :searchAll="searchValue"
            :medicareType="medicareType"
          ></medicalInsuranceCheck>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import hisAccountCheck from "./hisAccountCheck.vue";
import medicalInsuranceCheck from "./medicalInsuranceCheck.vue";
import { getPagemd } from "@/api/medicalInsurance/index.js";
export default {
  name: "accountCheck",
  components: {
    hisAccountCheck,
    medicalInsuranceCheck,
  },
  data() {
    return {
      activeName: "hisAccountCheck",
      tabList: [
        {
          label: "财务系统对账",
          name: "hisAccountCheck",
        },
        {
          label: "医保中心对账",
          name: "medicalInsuranceCheck",
        },
      ],
      clrTypeOptions: [
        {
          value: "0",
          label: "门诊",
        },
        {
          value: "1",
          label: "住院",
        },
        /* {
          value: "41",
          label: "药店购药",
        },
        {
          value: "99",
          label: "其他",
        }, */
      ],
      searchValue: {
        clrType: "",
        date: [],
      },
      medicareType: "02",
    };
  },
  async created() {
    // await this.getMedicareType();
    let date = this.dayjs(new Date()).format("YYYY-MM-DD");
    this.searchValue.date = [date, date];
    this.searchValue.clrType = "0";
  },
  methods: {
    async getMedicareType() {
      let path = this.$route.path;
      let isNew = false;
      if (path.indexOf("medicalInsuranceNew") > -1) {
        isNew = true;
      } else {
        isNew = false;
      }
      await getPagemd().then((res) => {
        if (res.code === 1) {
          this.medicareType = isNew
            ? res.data[0].dictCode
            : res.data[1].dictCode;
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.accountCheck {
  background-color: #fff;
  .accountCheck-navBar {
    padding: 10px;
  }
  .accountCheck-tab {
    height: calc(100% - 50px);
    padding: 10px;
    /deep/.el-tabs--top {
      height: 100%;
    }
    /deep/.el-tabs__content {
      height: calc(100% - 28px);
    }
  }
}
</style>