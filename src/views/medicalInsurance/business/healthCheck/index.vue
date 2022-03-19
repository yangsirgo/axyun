<template>
  <div class="main">
    <div class="top">
      <el-radio-group v-model="activeName"  style="margin-right:16px;height:34px;">
        <template v-for="(item, index) in projectList">
          <el-radio-button :label="item.code" :key="index" style="height:34px;">{{
            item.name
          }}</el-radio-button>
        </template>
      </el-radio-group>
      <l-formt-title label="对账日期" style="width:210px;margin-right:8px;">
        <el-date-picker
          v-model="checkDate"
          value-format="yyyy-MM-dd HH:mm:ss"
          clearable
        ></el-date-picker>
      </l-formt-title>
      <l-formt-title label="费用类别" style="width:200px;margin-right:8px;">
        <el-select v-model="OpIpFlag">
          <el-option label="门诊" :value="1"> </el-option>
          <el-option label="住院" :value="2"> </el-option>
        </el-select>
      </l-formt-title>
    </div>
    <div class="content">
      <HisCheck v-if="activeName==1" :checkDate="checkDate" :OpIpFlag="OpIpFlag"></HisCheck>
      <HealthCareCenterAll v-if="activeName==2" :checkDate="checkDate" :OpIpFlag="OpIpFlag"></HealthCareCenterAll>
      <HealthCareCenterDetail v-if="activeName==3" :checkDate="checkDate" :OpIpFlag="OpIpFlag"></HealthCareCenterDetail>
    </div>
  </div>
</template>

<script>
import HisCheck from "./components/HisCheck.vue"
import HealthCareCenterAll from "./components/HealthCareCenterAll.vue"
import HealthCareCenterDetail from "./components/HealthCareCenterDetail.vue"

export default {
  components:{
    HisCheck,
    HealthCareCenterAll,
    HealthCareCenterDetail
  },
  data() {
    return {
      projectList: [
        {
          name: "HIS对账",
          code: 1,
        },
        {
          name: "医保中心总账对账",
          code: 2,
        },
        {
          name: "医保中心明细对账",
          code: 3,
        },
      ],
      activeName: 1,
      OpIpFlag:1,
      checkDate:new Date(Date.now()-24*3600000).format('yyyy-MM-dd HH:mm:ss')
    };
  },
  methods: {
    handleClick() {},
    
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  background: $l-color-white;
  padding: 16px;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  .top{
    display: flex;
  }
  .content{
    flex:1;
    display: flex;
    flex-direction: column;
  }
}
</style>