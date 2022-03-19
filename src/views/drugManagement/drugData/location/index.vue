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
                  @getStorageCode="getStorageCode"
                  :drugStorageList="drugStorageList"
                  :storageCode="storageCode"
                  :locationList="locationList"
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
import drugList from "./components/locationList";
import drugForm from "./components/locationForm";
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
      drugStorageList: [], //药库数据源
      storageCode: "",
      locationList: []
    };
  },
  created() {
    this.getDrugStorageList("0,1");
    this.getUserStorage();
  },
  methods: {
    newadd() {
      this.drugForm = {
        isnew: true
      };
      this.$refs.form.newadd();
    },
    //获取药库数据
    getDrugStorageList(params) {
      hmmBaseApi.getDrugStorage(params).then(res => {
        this.drugStorageList = res.data;
      });
    },
    // 获取当前登录的药房
    getUserStorage() {
      hmmBaseApi
        .getCurDrugStorage()
        .then(res => {
          if (res.code === 1) {
            this.storageCode = res.data.storageCode;
            this.getLocation(this.storageCode);
          } else {
            this.$message.error("获取当前库房失败");
          }
        })
        .catch(err => {
          this.$message.error("获取当前库房失败");
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
    getLocation(code) {
      hmmBaseApi
        .getSelectLocation(code)
        .then(res => {
          if (res.code === 1) {
            this.locationList = res.data;
          } else {
            this.$message.error("获取位置大类失败");
          }
        })
        .catch(err => {
          this.$message.error("获取位置大类失败");
        });
    },
    getStorageCode(val) {
      this.getLocation(val);
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
