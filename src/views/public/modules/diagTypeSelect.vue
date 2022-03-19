<template>
  <div class="diagTypeSelect">
    <div style="padding:6px">
      您选择的诊断为：<span class="diagName">{{ diagName }}</span>
    </div>
    <LFormtTitle :required="true" label="诊断类型">
      <el-select
        v-model="selectDiagTypeCode"
        clearable
        class="select-container"
        placeholder="请选择诊断类型"
        @change="diagTypeChange"
      >
        <el-option
          v-for="(item, index) in diaTypeList"
          :key="index"
          :label="item.name"
          :value="item.code"
        ></el-option>
      </el-select>
    </LFormtTitle>
    <LFormtTitle
      :required="true"
      label="初复诊"
      style="width: 100%;margin-top:6px"
      v-if="hosType=='1'"
    >
      <l-value-domain
        code="FirstOrNo"
        :value.sync="isFirst"
        class="select-container"
        clearable
        placeholder="请选择"
      />
    </LFormtTitle>
  </div>
</template>
<script>
import { getDiaTypeList } from "@/api/common/diagnosis";
export default {
  name: "diagTypeSelect",
  props: {
    hosType: {
      type: String,
      default: ""
    },
    diagName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      diagType: {},
      //诊断类型列表
      diaTypeList: [],
      selectDiagTypeCode : "",
      isFirst: "1"
    };
  },
  async created() {
    await this.getDiaTypeList();
    // this.diagType = this.diaTypeList.length ? this.diaTypeList[0] : {};
  },
  methods: {
    //获取诊断类型
    async getDiaTypeList() {
      try {
        let data = await getDiaTypeList();
        //console.log("data", JSON.stringify(data));
        if (data.code == 1) {
          this.handleDiaTypeList(data.data);
        }
      } catch (e) {
        console.log(e);
      }
    },
    handleDiaTypeList(data) {
      let type = this.hosType == "1" ? "1" : "2";
      let arr = [];
      for (let i in data) {
        if (data[i]["type"] == type) {
          arr.push({ ...data[i] });
        }
      }
      this.diaTypeList = arr;
      this.diagType = this.diaTypeList.length ? this.diaTypeList[0] : {};
      this.selectDiagTypeCode = this.diaTypeList[0].code;
    },
    diagTypeChange(val) {
      for (let i in this.diaTypeList) {
        if (this.diaTypeList[i].code === val) {
          this.diagType = this.diaTypeList[i];
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.diagTypeSelect {
  width: 300px;
  margin: 6px;
  .diagName {
    color: blue;
  }
}
</style>
