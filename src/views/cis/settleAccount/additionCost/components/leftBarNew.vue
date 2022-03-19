<template>
  <div class="leftTabsWrapper height100">
    <div class="leftTab-first height100">
      <l-sidebar-left>
        <template #top>
          <div class="margin-bottom-6">
            <el-date-picker
              v-model="form.timeRange"
              type="daterange"
              style="width: 100%"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="search"
            ></el-date-picker>
          </div>
          <l-formt-title>
            <el-input
              class="rightButton"
              v-model="form.search"
              placeholder="请输入患者关键信息"
            ></el-input>
            <el-button
              @click="readCard"
              plain
              type="primary"
              size="mini"
              shortbutton
            >读卡</el-button>
          </l-formt-title>
          <div class="search-buttons">
            <el-button
              @click="search"
              plain
              type="primary"
            >查询</el-button>
            <el-button @click="reSet">重置</el-button>
          </div>
        </template>
        <template #bottom>
          <patientsTable
            ref="list"
            :params="form"
          ></patientsTable>
        </template>
      </l-sidebar-left>
      <!-- <div class="margin-bottom-6">
        <el-input
          @keyup.native.enter="search"
          v-model="form.search"
          placeholder="患者关键信息"
          style="width: 100%"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
      </div>-->

      <!-- <div class="button-list clearfix">
        <el-button
          class="float-left"
          style="width:120px;margin-right:10px"
          type="primary"
          @click="readCard"
        >
          <em class="iconfont iconduka"></em> 读卡
        </el-button>
        <el-button
          class="float-right"
          style="width:120px;margin-left: 0"
          type="primary"
          plain
          @click="search"
        >查询</el-button>
      </div>-->
      <!-- <div class="leftTab-constant"></div> -->
    </div>
  </div>
</template>

<script>
import patientsTable from "./patientsTableNew.vue";
import { selectPatientBySth, cardReading, visit } from "@/api/cis/visit/visit";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "leftBar",
  components: {
    patientsTable
  },
  props: {
    activityName: {
      type: String,
      default: "first"
    }
  },
  data() {
    return {
      form: {
        timeRange: [],
        search: "",
        activityName: this.activityName
      }
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    async search() {
      this.form.pricedChecked = this.activityName === "first" ? false : true;
      this.form.searchReasult = "";
      if (this.form.search) {
        // let result = await visit.selectPatientBySth({
        //   searchValue: this.form.search,
        // });
        // for (let i = 0; i < result.length; i++) {
        //   this.form.searchReasult += result[i] + ",";
        // }
      }
      await this.$refs.list.loadData();
    },
    readCard() {
      if (!this.form || !this.form.search) {
        this.$message.error("请输入卡号");
        return;
      }
      this.$refs.list.showData = [];
      let data = {
        cardData: this.form.search
      };
      cardReading(data)
        .then(res => {
          if (res.data != null && res.data.length > 0) {
            if (res.data[0].recordStatus == 4) {
              //今天，编辑
              if (
                res.data[0].hasOwnProperty("rediagStatus") &&
                res.data[0].rediagStatus == 1
              ) {
                res.data[0].optStr = "回诊F";
              } else {
                res.data[0].optStr = "编辑";
              }
            } else if (res.data[0].recordStatus == 5) {
              res.data[0].optStr = "查看";
            }
            this.changeRecPatientData(res.data[0]);
            this.$refs.list.showData = res.data;
          } else {
            this.$message.error("未查询到可补费患者");
            return;
          }
        })
        .catch(e => {
          this.$message.error("获取档案失败，请稍后重试！");
        });
    },
    reSet() {
      this.form.search = "";
      this.form.timeRange = [];
    }
  }
};
</script>

<style scoped lang="scss">
.leftTabsWrapper {
  /deep/ .el-tabs__content {
    overflow: unset !important;
  }
  .leftTab-first {
    padding: 8px;
  }
  .margin-bottom-6 {
    margin-bottom: 6px;
  }

  .button-list {
    /deep/ .el-button--primary {
      height: 36px;
      font-size: 14px;
      padding: 0;
    }
  }

  .leftTab-constant {
    height: calc(100% - 120px);
  }

  .mb10 {
    margin-bottom: 4px;
  }
}
/deep/ .rightButton.el-input {
  width: calc(100% - 56px) !important;
}
/deep/ .el-button--mini {
  margin-left: $l-margin-default-4;
}
/deep/ .l-input-wrap {
  margin-left: 0;
}
.search-buttons {
  margin-top: 4px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  /deep/ button {
    width: calc(50% - 4px);
  }
}
</style>
