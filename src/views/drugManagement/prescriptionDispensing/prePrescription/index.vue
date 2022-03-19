<template>
  <div class="wrapper">
    <div class="float-left main">
      <div
        class="main_wrap"
        :style="{ 'margin-right': toolBoxExpanded ? '298px' : '56px' }"
      >
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <l-main></l-main>
          </slot>
        </flow-menu>
      </div>
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
import { deltaImportQuery } from "@/api/admin/role.js";
import localForage from "localforage";
import FlowMenu from "@/components/FlowMenu";
import ToolBox from "@/views/public/tools";
import lMain from "./ophaDispense.vue";
import { mapGetters } from "vuex";

export default {
  components: { FlowMenu, ToolBox, lMain },
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
      selectId: 0,
      boxs: ["drugCheck", "otherPrescription", "drugBatch"], //工具箱
      defaultBoxName: "drugCheck",
      toolBoxExpanded: false
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
          this.boxs = ["drugCheck", "otherPrescription", "drugBatch"];
        } else {
          this.boxs = ["drugCheck", "otherPrescription"];
        }
      }
    }
  },
  created() {
    this.UpdateMedicineCache();
  },
  methods: {
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    // 更新药品缓存
    async UpdateMedicineCache() {
      // 获取药品数据
      try {
        let tempUpdateTime = "";
        console.log(`tempUpdateTime`, tempUpdateTime);
        const res = await deltaImportQuery({ updateTime: "" });

        if (tempUpdateTime === "") {
          console.log(`GetDrugData 新增--------`, res.data);
          this.setLocalForage("AllDrugData", res.data);
        }
        this.setLocalForage(
          "drugUpdateTime",
          this.dayjs(new Date()).format("YYYY-MM-DD")
        );
      } catch (err) {
        console.log("GetDrugData失败", err);
        console.log(err);
      }
    },
    setLocalForage(name, data) {
      localForage
        .setItem(name, data)
        .then(function(value) {
          console.log("setLocalForage成功", value);
        })
        .catch(function(err) {
          console.log("setLocalForage失败", err);
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
      margin: 0 297px 0 0;
      height: 100%;
    }
  }
  .left {
    width: 287px;
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
