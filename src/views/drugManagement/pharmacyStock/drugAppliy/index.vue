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
              :applyInfo="applyInfo"
              :recordStatusList="recordStatusList"
              :applyTypeList="applyTypeList"
              :drugStorageList="drugStorageList"
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
        :applyTypeList="applyTypeList"
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
        pageName="pharmacyAppliy"
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
import lMain from "./apply.vue";
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
      applyInfo: {},
      boxs: ["saleSituation", "Hotkey"], //工具箱
      defaultBoxName: "",
      toolBoxExpanded: false,
      toolBarExpanded: true,
      drugStorageList: [], //采购药库数据源
      recordStatusList: [
        // 筛选 提交状态列表
        {
          name: "全部",
          code: ""
        },
        {
          name: "未提交",
          code: "0"
        },
        {
          name: "已提交",
          code: "1"
        },
        {
          name: "药库已保存",
          code: "2"
        },
        {
          name: "药库已提交",
          code: "3"
        }
      ],
      applyTypeList: [
        {
          name: "用药申请",
          code: "0"
        },
        {
          name: "退药申请",
          code: "1"
        }
      ]
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
    this.getDrugStorageList("0");
  },
  methods: {
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    selectIdChange(applyInfo) {
      this.applyInfo = applyInfo;
    },
    newAdd() {
      this.$refs.main.newAdd();
    },
    search() {
      this.$refs.left.search();
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
          this.$message.error(res.msg || "暂无药库数据");
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
