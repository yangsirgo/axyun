<template>
  <div
    class="sidebar height100"
    id="l-c-penetrate-tabs-container"
  >
    <l-sidebar-left>
      <template #top>
        <l-card-title>
          <template #left>就诊患者查询</template>
        </l-card-title>
        <el-date-picker
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 100%; margin: 8px 0"
          v-model="form.timeRange"
          type="daterange"
          range-separator="至"
          @change="search"
          :default-time="['00:00:00', '23:59:59']"
          :start-placeholder="datePicker.startPlaceholder"
          :end-placeholder="datePicker.endPlaceholder"
        ></el-date-picker>
        <div class="read-card">
          <l-formt-title class="l-input-wrap-new">
            <el-input
              @keyup.native.enter="sideEvent('query')"
              v-model="form.search"
              placeholder="姓名/手机/证件号/患者编号"
              @keyup.enter.native="sideEvent('query')"
            ></el-input>
            <el-button
              plain
              type="primary"
              size="mini"
              shortbutton
              @click="sideEvent('readCard')"
            >读卡</el-button>
          </l-formt-title>
        </div>
        <div class="btns-contain">
          <el-button
            type="primary"
            plain
            class="btn"
            @click="sideEvent('query')"
          >查询</el-button>
          <el-button
            plain
            class="btn"
            @click="reset"
          >重置</el-button>
        </div>
      </template>
      <template #bottom>
        <patients-part
          ref="list"
          :params="params"
        ></patients-part>
      </template>
    </l-sidebar-left>
  </div>
</template>

<script>
import {
  getPatients,
  receive,
  findAllergy,
  selectPatientBySth,
  cardReading
} from "@/api/cis/visit/visit";
import patientsPart from "./patientsTable.vue";
import service from "@/api/appointment/appointment";
import { mapActions, mapGetters } from "vuex";
import readCardMixin from "@/mixins/readCard.js";

export default {
  mixins: [readCardMixin],
  data() {
    return {
      params: {
        searchValue: "",
        searchReasult: "",
        startDate: "",
        stopDate: ""
      },
      form: {
        search: "",
        timeRange: "",
        startDate: "",
        stopDate: ""
      },
      datePicker: {
        //datepicker 的 placeholder
        startPlaceholder: "预约开始日期",
        endPlaceholder: "预约结束日期"
      },
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 200
      }
    };
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    // 查询患者列表
    getPatientCodeListFuc(obj) {
      this.form.search = obj.patientCode;
      this.pageParams.pageNo = 1;
      this.search();
    },
    async search() {
      let form = this.form;
      if (form.timeRange != "" && form.timeRange != null) {
        form.startDate = form.timeRange[0];
        form.stopDate = form.timeRange[1];
      }

      if (form.timeRange != "" && form.timeRange != null) {
        this.params.startDate = form.timeRange[0];
        this.params.stopDate = form.timeRange[1];
      } else {
        this.params.startDate = "";
        this.params.stopDate = "";
      }
      this.params.searchValue = form.search;
      this.$refs.list.loadData();
    },
    /* readCard() {
      let form = this.form;
      // 读卡方法
      let data = {
        cardData: form.search
      };
      cardReading(data)
        .then(res => {
          if (res.data != null && res.data.length > 0) {
            this.$refs.list.topData = res.data;
            this.$refs.list.choosePatient(0, res.data[0]);//选中患者
            this.$refs.list.activeNameCollapse = "1";//选中患者

          } else {
            this.$message.error("获取档案失败，请稍后重试！");
          }
        })
        .catch(() => {
          this.$message.error("获取档案失败，请稍后重试！");
        });
    }, */
    reset() {
      this.form.timeRange = "";
      this.form.search = "";
      this.search();
    },
    //子组件抛出的方法
    sideEvent(sideEvent) {
      if (sideEvent === "query") {
        this.search();
      } else if (sideEvent === "readCard") {
        this.readCard();
      }
    }
  },
  components: {
    patientsPart
  }
};
</script>

<style scoped lang="scss">
.sidebar {
  position: relative;
  padding: $l-padding-default-4;
  padding-top: 8px;
  .l-input-wrap-new {
    margin-bottom: 0px;
  }
  .read-card {
    margin-bottom: $l-margin-default-4;
    width: 100%;
    /deep/ .el-input {
      width: calc(100% - 56px) !important;
    }
    /deep/ .el-button--mini {
      margin-left: $l-margin-default-4;
    }
  }

  .btns-contain {
    display: flex;
    margin-bottom: $l-margin-default-4;
    justify-content: space-between;
    .btn {
      width: 100px;
    }
  }

  .patientBar {
    display: flex;
    align-items: center;
    .patientBar-left {
      flex: 1;
      width: 0;
      font-size: 0;
      > span {
        font-size: 14px;
      }
      > .code {
        font-weight: 700;
        text-align: center;
        color: #f05a23;
        max-width: 24px;
        display: inline-block;
        vertical-align: top;
      }
      .endBtn {
        float: right;
        top: calc(-100% + 3px);
        right: -26px;
        position: relative;
      }
      > .name {
        max-width: 42px;
        display: inline-block;
        vertical-align: top;
      }
    }
  }

  .patient-penetrate-box {
    margin-top: 8px;
    height: calc(100% - 8px);
    overflow: hidden;
    overflow-y: auto;
    .is-actiive {
      > .code {
        font-weight: 700;
        text-align: center;
        color: #f05a23;
      }

      > .name {
        font-weight: 400;
        text-align: center;
        color: #ffffff;
      }

      > .gender {
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        opacity: 0.8;
      }
    }
  }
  .l-c-penetrate {
    &.is-active {
      .code {
        font-weight: 700;
        text-align: center;
        color: #f05a23;
      }

      .name {
        font-weight: 400;
        text-align: center;
        color: #ffffff;
      }

      .gender {
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        opacity: 0.8;
      }

      .endBtn {
        right: -32px;
      }
    }

    .show-patient-detail {
      font-size: 12px;
      color: #666c70;
    }
  }
  .has-penetrate {
    position: relative;
    z-index: 5;
    &.is-active {
      border-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  .l-c-penetrate-clone {
    position: absolute;
    right: $l-layout-space-max-;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    z-index: 4;
    .top,
    .bottom {
      * {
        opacity: 0;
      }
    }
  }
  .tooltip-content {
    line-height: $l-height-common-2;
    font-size: $l-font-size;
  }
}
</style>
