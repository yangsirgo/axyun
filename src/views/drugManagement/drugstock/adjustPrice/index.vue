<template>
  <div class="wrapper">
    <div class="float-left main">
      <div class="main_wrap" :style="{'margin-right': toolBoxExpanded ? '298px' : '56px'}">
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <l-main
              ref="main"
              @search="search"
              :adjustPriceInfo="adjustPriceInfo"
              :recordStatusList="recordStatusList"
              :adjustPriceTypeList="adjustPriceTypeList"
              :adjustPriceModeList="adjustPriceModeList"
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
        :recordStatusList="recordStatusList"
        :adjustPriceTypeList="adjustPriceTypeList"
        :adjustPriceModeList="adjustPriceModeList"
      ></left>
    </div>

    <div
      class="float-left right"
      :style="{'width': toolBoxExpanded ? '287px' : '46px', 'margin-left': toolBoxExpanded ? '-287px' : '-46px'}"
    >
      <tool-box
        pageName="adjustPrice"
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
import lMain from "./adjustPrice.vue";

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
  data() {
    return {
      adjustPriceInfo: {},
      toolBoxs: ["priceTrend", "Hotkey"], //工具箱
      defaultBoxName: "",
      toolBoxExpanded: false,
      toolBarExpanded: true,
      recordStatusList: [
        {
          name: "未提交",
          code: "0"
        },
        // {
        //   name: "已提交",
        //   code: "1"
        // },
        {
          name: "已调价",
          code: "2"
        },
        {
          name: "全部",
          code: ""
        }
      ], // 筛选 单据状态列表
      adjustPriceTypeList: [
        // {
        //   name: "定时调价",
        //   code: "0"
        // },
        {
          name: "即时调价",
          code: "1"
        }
      ], // 筛选 单据状态列表
      adjustPriceModeList: [
        {
          name: "单批次调价",
          code: "1"
        }
      ]
    };
  },
  methods: {
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    selectIdChange(data) {
      this.adjustPriceInfo = data;
      console.log(this.adjustPriceInfo);
    },
    search() {
      this.$refs.left.search();
    },
    newAdd() {
      this.$refs.main.newAdd();
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
