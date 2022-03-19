<template>
  <div class="wrapper">
    <div class="float-left main">
      <div class="main_wrap">
        <flow-menu :patientCardType="patientCardType">
          <slot name="content">
            <div class="drugInfoMaintain width100 height100">
              <div class="left height100">
                <drug-list
                  :refreshList="refreshList"
                  @getIsDrug="getIsDrug"
                  :drugStorageList="drugStorageList"
                  @newadd="newadd"
                ></drug-list>
              </div>
              <div class="right height100">
                <drug-form
                  ref="form"
                  :drugForm="drugForm"
                  @getRefreshList="getRefreshList"
                  :drugStorageList="drugStorageList"
                ></drug-form>
              </div>
            </div>
          </slot>
        </flow-menu>
      </div>
    </div>
  </div>
</template>
<script>
import FlowMenu from "@/components/FlowMenu";
import drugList from "./components/workList";
import drugForm from "./components/workForm";
import hmmBaseApi from "@/api/hmm/base";
export default {
  components: { FlowMenu, drugList, drugForm },
  props: {
    // 患者卡片类型
    patientCardType: {
      type: String
    }
  },
  data() {
    return {
      //全局药品
      drugForm: {},
      //刷新药品列表
      refreshList: {},
      drugStorageList: [] //药房数据源
    };
  },
  watch: {},
  created() {
    this.getDrugStorageList("1");
  },
  methods: {
    //获取药房数据
    getDrugStorageList(params) {
      hmmBaseApi.getDrugStorage(params).then(res => {
        this.drugStorageList = res.data;
      });
    },
    //获取子组件传来的药品id
    getIsDrug(data) {
      if (data) {
        this.drugForm = data;
      }
    },
    //接收子组件返回来的刷新列表的信息
    getRefreshList(data) {
      if (data) {
        this.refreshList = data;
      }
    },
    newadd() {
      this.$refs.form.newadd();
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
      height: 100%;
      .drugInfoMaintain {
        .left {
          width: calc(100% - 450px);
          float: left;
        }

        .right {
          width: 440px;
          margin-left: 10px;
          float: right;
        }
      }
    }
  }
}
</style>
