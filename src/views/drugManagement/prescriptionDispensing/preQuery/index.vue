<template>
  <div class="wrapper">
    <div class="float-left main">
      <div class="main_wrap" :style="{'margin-right': toolBoxExpanded ? '298px' : '56px'}">
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <l-main
              ref="main"
              :recipeFormid="recipeFormid"
              :drugStorageList="drugStorageList"
              :pharWindowList="pharWindowList"
            ></l-main>
          </slot>
        </flow-menu>
      </div>
    </div>
    <div class="float-left left">
      <left
        @selectIdChange="selectIdChange"
        :drugStorageList="drugStorageList"
        :pharWindowList="pharWindowList"
      ></left>
    </div>
    <div
      class="float-left right"
      :style="{'width': toolBoxExpanded ? '287px' : '46px', 'margin-left': toolBoxExpanded ? '-287px' : '-46px'}"
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
import base from "@/api/hmm/base";
import FlowMenu from "@/components/FlowMenu";
import ToolBox from "@/views/public/tools";
import left from "./left.vue";
import lMain from "./ophaQuery.vue";
import { mapGetters } from "vuex";

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
      recipeFormid: "",
      boxs: ["drugCheck"], //工具箱
      defaultBoxName: "drugCheck",
      toolBoxExpanded: false,
      toolBarExpanded: true,
      drugStorageList: [], //采购药库数据源
      pharWindowList: []
    };
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
          this.boxs = ["drugCheck", "drugBatch"];
        } else {
          this.boxs = ["drugCheck"];
        }
      }
    }
  },
  created() {
    this.getDrugStorageList("1");
    this.listForDropDown();
  },
  methods: {
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    selectIdChange(data) {
      this.recipeFormid = data;
     this.$nextTick(function(){
         this.$refs.main.autoSendDrugFun();
     })
    },
    //获取药房数据
    getDrugStorageList(params) {
      base.getDrugStorage(params).then(res => {
        // console.log(res, 'Storage');
        this.drugStorageList = res.data;
        // console.log(this.drugStorageLis);
      });
    },
    async listForDropDown() {
      this.pharWindowList = await base.pharWindowForDropDown({});
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
