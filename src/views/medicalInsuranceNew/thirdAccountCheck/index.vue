<template>
  <div class="accountCheck height100">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.label"
        :name="item.name"
      >
        <innerAccountCheck
          v-if="activeName === 'innerAccountCheck'"
          :medicareType="medicareType"
        ></innerAccountCheck>
        <outerAccountCheck
          v-else-if="activeName === 'outerAccountCheck'"
          :medicareType="medicareType"
        ></outerAccountCheck>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import innerAccountCheck from "./innerAccountCheck.vue";
import outerAccountCheck from "./outerAccountCheck.vue";
import { getPagemd } from "@/api/medicalInsurance/index.js";
export default {
  name: "accountCheck",
  components: {
    innerAccountCheck,
    outerAccountCheck,
  },
  data() {
    return {
      activeName: "innerAccountCheck",
      tabList: [
        {
          label: "内部对账",
          name: "innerAccountCheck",
        },
        {
          label: "外部对账",
          name: "outerAccountCheck",
        },
      ],
      medicareType: "02",
    };
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
  padding: 10px;
  /deep/.el-tabs--top {
    height: 100%;
  }
  /deep/.el-tabs__content {
    height: calc(100% - 28px);
  }
}
</style>