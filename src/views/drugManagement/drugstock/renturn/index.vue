<template>
  <div class="wrapper">
    <div class="float-left main">
      <div class="main_wrap" :style="{'margin-right': toolBoxExpanded ? '298px' : '56px'}">
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <l-main
              ref="main"
              @search="search"
              :recordStatusList="recordStatusList"
              :supplierList="supplierList"
              :returninfo="returninfo"
            ></l-main>
          </slot>
        </flow-menu>
      </div>
    </div>
    <div class="float-left left">
      <left
        ref="left"
        @selectIdChange="selectIdChange"
        :supplierList="supplierList"
        :recordStatusList="recordStatusList"
        @newAdd="newAdd"
      ></left>
    </div>
    <div
      class="float-left right"
      :style="{'width': toolBoxExpanded ? '287px' : '46px', 'margin-left': toolBoxExpanded ? '-287px' : '-46px'}"
    >
      <tool-box
        pageName="drugRenturn"
        :boxName="defaultBoxName"
        :modules="boxs"
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
import lMain from "./return.vue";
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
      returninfo: {},
      boxs: ["Hotkey"], //工具箱
      defaultBoxName: "Hotkey",
      toolBoxExpanded: false,
      toolBarExpanded: true,
      supplierList: [], //供应商数据源
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
      ] // 筛选 单据状态列表
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
    this.getSupplierList();
  },
  methods: {
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    selectIdChange(data) {
      this.returninfo = data;
    },
    newAdd() {
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
