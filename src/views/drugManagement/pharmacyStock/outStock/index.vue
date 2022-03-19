<template>
  <div class="wrapper">
    <div class="float-left main">
      <div
        class="main_wrap"
        :style="{
          'margin-right': toolBoxExpanded ? '298px' : '56px'
        }"
      >
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <l-main
              ref="main"
              @search="search"
              :outStockinfo="outStockinfo"
              :recordStatusList="recordStatusList"
              :outTypeList="outTypeList"
              :drugStorageList="drugStorageList"
              @left-refresh="leftRefresh"
            ></l-main>
          </slot>
        </flow-menu>
      </div>
    </div>

    <div class="float-left left">
      <left
        ref="left"
        @selectIdChange="selectIdChange"
        @newAdd="newAdd"
        :outTypeList="outTypeList"
        :recordStatusList="recordStatusList"
        :drugStorageList="drugStorageList"
      ></left>
    </div>

    <div
      class="float-left right"
      :style="{
        width: toolBoxExpanded ? '287px' : '46px',
        'margin-left': toolBoxExpanded ? '-287px' : '-46px'
      }"
    >
      <tool-box
        pageName="drugOutStock"
        :boxName="defaultBoxName"
        :modules="toolBoxs"
        @message="toolBoxMessage"
        :open.sync="toolBoxExpanded"
      />
    </div>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import ToolBox from "@/views/public/tools";
import left from "./left.vue";
import lMain from "./outStock.vue";

import hmmBaseApi from "@/api/hmm/base";

export default {
  components: { FlowMenu, ToolBox, left, lMain },
  props: {
    // 患者卡片类型
    patientCardType: {
      type: String
    },
    // 工具箱默认是否展开状态
    boxExpanded: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    boxExpanded: {
      handler(v) {
        this.toolBoxExpanded = v;
      },
      immediate: true
    }
  },
  created() {
    window.sessionStorage.setItem("findStyle", false);
  },
  mounted() {
    this.getDrugStorageList("1");
  },
  data() {
    return {
      outStockinfo: {},
      // toolBoxs: ["historyOutProcess", "drugstoreStock", "Hotkey"], //工具箱
      toolBoxs: [],
      defaultBoxName: "",
      toolBoxExpanded: false,
      toolBarExpanded: true,
      supplierList: [],
      drugStorageList: [],
      recordStatusList: [
        {
          name: "未提交",
          code: "0"
        },
        {
          name: "已提交",
          code: "1"
        },
        {
          name: "全部",
          code: ""
        }
      ], // 筛选 单据状态列表
      outTypeList: [
        {
          name: "报废出库",
          code: "2"
        },
        {
          name: "机构间调拨出库",
          code: "9"
        },
        {
          name: "盘亏出库",
          code: "7"
        },
        {
          name: "其他出库",
          code: "8"
        }
      ] //出库类型
    };
  },
  methods: {
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    selectIdChange(data) {
      this.outStockinfo = data;
    },
    newAdd() {
      this.$refs.main.newAdd();
    },
    search() {
      this.$refs.left.search();
    },
    // 根据出库单号刷新左侧列表
    leftRefresh(data) {
      this.$refs.left.numSearch(data);
    },
    //获取药库数据
    getDrugStorageList(params) {
      hmmBaseApi
        .getCurDrugStorage()
        .then(res => {
          if (res.code == 1) {
            if (res.data.children) {
              let list = res.data.children.map(item => ({
                ...item,
                code: item.pharCode,
                name: item.pharName
              }));
              this.drugStorageList = list;
            }
          } else {
            this.$message.error(res.msg || "获取药库数据失败");
          }
        })
        .catch(res => {
          console.log(res, "获取药库数据失败6666");
          // this.$message.error(res.msg || "获取药库数据失败6666");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.patient-card-container {
  margin-bottom: 20px;
  height: 66px;
  width: 100%;
}

.wrapper {
  padding: 0;
  height: 100%;
  overflow: hidden;

  .main {
    width: 100%;
    height: 100%;

    .main_wrap {
      margin: 0 297px 0 350px;
      height: 100%;
    }
  }

  .left {
    width: 340px;
    height: 100%;
    margin-left: -100%;
  }

  .right {
    width: 287px;
    height: 100%;
    margin-left: -287px;
  }
}
</style>
