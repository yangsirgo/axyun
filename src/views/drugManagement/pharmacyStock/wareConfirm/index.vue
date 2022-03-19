<template>
  <div class="wrapper">
    <div class="float-left main">
      <div
        class="main_wrap"
        :style="{'margin-right': toolBoxExpanded ? '298px' : '56px'}"
      >
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <l-main
              @search="search"
              :wareConfimInfo="wareConfimInfo"
              @confirmClickCB="confirmClickCB"
              :outTypeList="outTypeList"
            ></l-main>
          </slot>
        </flow-menu>
      </div>
    </div>

    <div class="float-left left">
      <left
        ref="left"
        @selectIdChange="selectIdChange"
        :drugStorageList="drugStorageList"
        :outTypeList="outTypeList"
      ></left>
    </div>

    <div
      class="float-left right"
      :style="{'width': toolBoxExpanded ? '287px' : '46px', 'margin-left': toolBoxExpanded ? '-287px' : '-46px'}"
    >
      <tool-box
        pageName="wareConfirm"
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
import lMain from "./confirm.vue";
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
  data() {
    return {
      wareConfimInfo: {},
      // confirmClickData: "",
      boxs: ["applyProcess", "Hotkey"], //工具箱
      defaultBoxName: "",
      toolBoxExpanded: false,
      toolBarExpanded: true,
      drugStorageList: [], //出库部门
      outTypeList: [
        {
          name: "直接出库",
          code: "0"
        },
        {
          name: "申请出库",
          code: "1"
        },
        // {
        //   name: "报废出库",
        //   code: "2"
        // },
        // {
        //   name: "库房调拨",
        //   code: "3"
        // },
        // {
        //   name: "科室出库",
        //   code: "4"
        // },
        // {
        //   name: "科室消耗品出库",
        //   code: "5"
        // },
        {
          name: "全部",
          code: ""
        }
      ] //出库类型
    };
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
    this.getDrugStorageList("0,1");
  },
  methods: {
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    selectIdChange(item) {
      // console.log(item);
      this.wareConfimInfo = item;
    },
    search() {
      this.$refs.left.search();
    },
    confirmClickCB(data) {
      // console.log("confirmClickCB", data);
      //this.confirmClickData = data;
      //this.$refs.leftDiv.confirmClickLeft(data);
    },
    //获取药库数据
    getDrugStorageList(params) {
      hmmBaseApi
        .getDrugStorage(params)
        .then(res => {
          if (res.code == 1) {
            this.drugStorageList = res.data;
          } else {
            this.$message.error(res.msg || "获取药库数据失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无药库数据");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "获取药库数据失败");
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
