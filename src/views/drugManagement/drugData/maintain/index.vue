<template>
  <div class="wrapper">
    <div class="float-left main">
      <div class="main_wrap" :style="{ 'margin-right': toolBoxExpanded ? '298px' : '56px' }">
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <el-tabs
              type="border-card"
              class="el-tabs-new-style width100"
              v-model="activeName"
              @tab-click="handleClick"
              tab-position="top"
            >
              <el-tab-pane
                v-for="(item, index) in tabParams"
                :key="index"
                :label="item.label"
                :name="item.name"
                :component="item.component"
                :disabled="item.disabled"
              ></el-tab-pane>
            </el-tabs>
            <div class="tab-cont">
              <component
                @getIsDrug="getIsDrug"
                :is="curComponent"
                :drugId="drugId"
                :ddstorageCode="dStorageCode"
                :ddstorageCodeList="dStorageCodeList"
              ></component>
            </div>
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
import drugVarieties from "./components/drugVarieties";
import inStorage from "./components/inStorage";
import outStorage from "./components/outStorage";
import pharmacy from "./components/pharmacy";
import drugStorage from "./components/drugStorage";
import priceAdjustment from "./components/priceAdjustment";
import stock from "@/api/hmm/stock.js";

export default {
  components: {
    FlowMenu,
    ToolBox,
    drugVarieties,
    inStorage,
    outStorage,
    pharmacy,
    drugStorage,
    priceAdjustment
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
      //标签页数据
      activeName: "drugVarieties",
      tabParams: [
        {
          label: "药品品种",
          cont: "1",
          name: "drugVarieties",
          component: drugVarieties,
          disabled: false
        },
        {
          label: "药库信息",
          cont: "2",
          name: "drugStorage",
          component: drugStorage,
          disabled: true
        },
        {
          label: "药房信息",
          cont: "3",
          name: "pharmacy",
          component: pharmacy,
          disabled: true
        },
        {
          label: "入库信息",
          cont: "4",
          name: "inStorage",
          component: inStorage,
          disabled: true
        },
        {
          label: "出库信息",
          cont: "5",
          name: "outStorage",
          component: outStorage,
          disabled: true
        },
        {
          label: "调价信息",
          cont: "6",
          name: "priceAdjustment",
          component: priceAdjustment,
          disabled: true
        }
      ],
      //全局药品Id
      drugId: "",
      boxs: [], //工具箱
      defaultBoxName: "",
      toolBoxExpanded: false,
      curComponent: drugVarieties,
      dStorageCode: "",
      dStorageCodeList: "",
      showStorage: false
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
    this.getCurSto();
  },
  methods: {
    //获取子组件传来的药品id
    getIsDrug(data) {
      if (data) {
        this.drugId = data;
        this.tabParams.forEach((item, index) => {
          if (index > 1) {
            this.$set(this.tabParams, index, {
              ...this.tabParams[index],
              disabled: false
            });
          }
        });
        if (this.showStorage) {
          this.$set(this.tabParams, 1, {
            ...this.tabParams[1],
            disabled: false
          });
        }
      }
    },
    toolBoxMessage(data) {
      this.$emit("message", data);
    },
    handleClick(tab, event) {
      this.curComponent = tab.$attrs.component;
    },
    getCurSto() {
      stock
        .getCurDrugStorage()
        .then(res => {
          if (res.code === 1) {
            let flag;
            // storageType 0：药库 1：药房
            if (res.data.storageType === "0") {
              flag = false;
            } else {
              flag = true;
            }
            this.showStorage = !flag;
            this.dStorageCode = res.data.storageCode;
            let list;
            if (res.data.children) {
              list = res.data.children.map(item => item.pharCode).join(",");
            } else {
              list = "";
            }
            this.dStorageCodeList = list;
          }
        })
        .catch();
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
.tab-cont {
  height: calc(100% - 30px);
  background-color: $l-color-white;
  padding: 20px;
}
/deep/ .el-tabs__item.is-disabled {
  cursor: not-allowed;
}
</style>
