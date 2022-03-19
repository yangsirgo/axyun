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
            <component
              :is="mainBody"
              ref="main"
              :outStockinfo="outStockinfo"
              :drugStorageList="drugStorageList"
              :outTypeList="outTypeList"
              @refresh-list="refreshList"
            ></component>
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
        :outTypeList="outTypeList"
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
        @message="toolBoxMessage"
        :open.sync="toolBoxExpanded"
        :boxName="defaultBoxName"
        :modules="boxs"
      />
    </div>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import ToolBox from "@/views/public/tools";
import left from "./left.vue";
import lMain from "./outPharmacy.vue";
import lMainIm from "./outPharmacyIm.vue";
import hmmBaseApi from "@/api/hmm/base";
import { mapGetters } from "vuex";

export default {
  components: { FlowMenu, ToolBox, left, lMain, lMainIm },
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
  computed: {
    ...mapGetters("drugManagement", ["isBatchManagement"])
  },
  watch: {
    boxExpanded: {
      handler(v) {
        this.toolBoxExpanded = v;
      },
      immediate: true
    },
    isBatchManagement: {
      immediate: true,
      handler(v) {
        if (v) {
          this.mainBody = lMain;
        } else {
          this.mainBody = lMainIm;
        }
      }
    }
  },
  created() {
    this.getDrugStorageList("1");
  },
  data() {
    return {
      mainBody: lMain,
      outStockinfo: {},
      boxs: ["historyOutStock", "targetDrugstoreStock"], //工具箱
      defaultBoxName: "",
      toolBoxExpanded: false,
      toolBarExpanded: true,
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
        /* {
          name: "直接出库",
          code: "0"
        }, */
        /*{
          name: "申请出库",
          code: "1"
        }, */
        {
          name: "报废出库",
          code: "2"
        },
        {
          name: "库房调拨",
          code: "3"
        } /*,
        {
          name: "科室出库",
          code: "4"
        }*/,
        {
          name: "科室消耗品出库",
          code: "5"
        } /*,
        {
          name: "全部",
          code: ""
        } */
      ] //出库类型
    };
  },
  methods: {
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    selectIdChange(item) {
      this.outStockinfo = item;
    },
    newAdd() {
      this.outStockinfo = {};
      this.$refs.main.newAdd();
    },
    //获取药库数据
    getDrugStorageList(params) {
      hmmBaseApi.getDrugStorage(params).then(res => {
        if (res.code === 1) {
          this.drugStorageList = res.data;
        }
      });
    },
    refreshList() {
      this.$refs.left.search();
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
