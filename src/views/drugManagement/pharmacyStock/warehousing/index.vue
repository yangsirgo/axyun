<template>
  <div class="wrapper">
    <div class="float-left main">
      <div class="main_wrap" :style="{ 'margin-right': toolBoxExpanded ? '298px' : '56px'}">
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <l-main ref="main" @search="search" :wareinfo="wareinfo" :recordStatusList="recordStatusList" :supplierList="supplierList"></l-main>
          </slot>
        </flow-menu>
      </div>
    </div>

    <div class="float-left left">
      <left ref="left" @selectIdChange="selectIdChange" @newAdd="newAdd" :recordStatusList="recordStatusList"
        :storageTypeList="storageTypeList" :supplierList="supplierList"></left>
    </div>

    <div class="float-left right" :style="{'width': toolBoxExpanded ? '287px' : '46px', 'margin-left': toolBoxExpanded ? '-287px' : '-46px'}">
      <tool-box pageName="drugWarehousing" :open.sync="toolBoxExpanded" :boxName="defaultBoxName" :modules="boxs"
        v-bind="$attrs" v-on="$listeners" />
    </div>
  </div>
</template>

<script>
  import FlowMenu from "@/components/FlowMenu";
  import ToolBox from "@/views/public/tools";
  import left from "./left.vue";
  import lMain from "./warehousing.vue";
  //import stockPurchaseAPI from "@/api/drugStorage/stock/purchase";
  import hmmBaseApi from "@/api/hmm/base";

  export default {
    components: {
      FlowMenu,
      ToolBox,
      left,
      lMain
    },
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
    data() {
      return {
        wareinfo: {},
        // boxs: ["historyWarehousing", "Hotkey"], //工具箱
        boxs:[],
        defaultBoxName: "",
        toolBoxExpanded: false,
        supplierList: [], //供应商数据源
        recordStatusList: [{
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
        storageTypeList: [{
            name: "全部",
            code: ""
          },
          {
            name: "领药入库",
            code: "4"
          },
          {
            name: "采购入库",
            code: "1"
          },
          {
            name: "调拨入库",
            code: "5"
          },
          {
            name: "盘盈入库",
            code: "6"
          },
          {
            name: "其他入库",
            code: "3"
          }
        ], //入库类型数据源
      };
    },
    watch: {
      boxExpanded: {
        handler(val) {
          this.toolBoxExpanded = val;
        },
        immediate: true
      }
    },
    created() {
      this.getSupplierList();
      window.sessionStorage.setItem("findStyle",false);
    },
    methods: {
      /*  toolBoxMessage(data) {
        this.$emit("message", data);
      }, */
      selectIdChange(wareinfo_left) {
        this.wareinfo = wareinfo_left;
      },
      newAdd() {
        this.wareinfo = {};
        this.$refs.main.newAdd();
      },
      search() {
        this.$refs.left.search();
      },
      //获取供货商数据
      getSupplierList() {
        hmmBaseApi
          .getSupplier()
          .then(res => {
            if (res.code == 1) {
              this.supplierList = res.data;
            } else {
              this.$message.error(res.msg || "获取供应商数据失败");
            }
            if (res.data.length == 0) {
              this.$message.error("暂无供应商数据");
            }
          })
          .catch(res => {
            this.$message.error(res.msg || "获取供应商数据失败");
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
