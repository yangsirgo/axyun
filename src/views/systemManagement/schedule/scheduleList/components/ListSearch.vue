<template>
  <div class="listSearch">
    <div class="select-box">

      <l-formt-title class="com-class" label="科室" labelWidth="32">
        <el-select clearable v-model="searchInfo.department" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.value"
            :value="item.label"
          ></el-option>
        </el-select>
      </l-formt-title>

      <l-formt-title class="com-class" label="医生" labelWidth="32">
        <el-select clearable v-model="searchInfo.doctor" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.value"
            :value="item.label"
          ></el-option>
        </el-select>
      </l-formt-title>

      <l-formt-title class="com-class" label="状态" labelWidth="32">
        <el-select clearable v-model="searchInfo.status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.value"
            :value="item.label"
          ></el-option>
        </el-select>
      </l-formt-title>

      <my-date-pick />


      <el-button class="query-button" @click="doQuery" type="primary">查询</el-button>
      <el-button class="stop-button" @click="stopService">停诊</el-button>
    </div>
    <stop-many-service ref="stopmany"></stop-many-service>
  </div>
</template>

<script>
import myDatePick from "../../components/MyDatePick";
import stopManyService from "../components/StopManyService";
export default {
  name: "listSearch",
  components: {
    myDatePick,
    stopManyService
  },
  data() {
    return {
      searchInfo: {
        department: "",
        doctor: "",
        status: ""
      },
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
      serviceStatus: [
        {
          label: "出诊",
          code: "1"
        },
        {
          label: "停诊",
          code: "0"
        }
      ]
    };
  },
  methods: {
    doQuery() {},
    stopService() {
      this.$refs.stopmany.isVisible = true;
    }
  }
};
</script>

<style lang='scss' scoped>
.listSearch {
  width: 100%;
  height: 76px;
  padding: 20px;
  .com-class{
    width:230px;
    display:inline-block;
    border-radius:2px;
  }
  .query-button,
  .stop-button {
    vertical-align: top;
    width: 80px;
    height: 36px;
    border-radius: 2px;
  }
  .stop-button {
    float: right;
    border: 1px solid $l-color-primary;
    color: $l-color-primary;
  }
}
</style>
