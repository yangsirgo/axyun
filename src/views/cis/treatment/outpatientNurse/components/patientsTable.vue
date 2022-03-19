<template>
  <div class="height100 table_tabs_wrapper outpatientNurse">
    <el-radio-group
      v-model="radio"
      @change="changeRadio"
      style="margin-bottom: 8px"
    >
      <el-radio label="first">待执行</el-radio>
      <el-radio label="second">已完成</el-radio>
    </el-radio-group>
    <div class="collapseWrapper">
      <el-collapse v-model="activeNameCollapse" accordion>
        <el-collapse-item
          :title="
            radio == 'first'
              ? '待执行（' + topData.length + '）'
              : '已完成（' + topData.length + '）'
          "
          name="1"
          v-loading="topLoading"
        >
          <!-- <l-tables
            :total="pagination.total"
            :pageSize.sync="pagination.pageSize"
            :page.sync="pagination.currentPage"
            :layout="layout"
            :pagerCount="5"
            paginationAlign="center"
            :singlePageShow="true"
            @changeSize="changeSize"
          > -->
          <patients-item
            :data="topData"
            ref="topList"
            :radio="radio"
            type="top"
            name="1"
          ></patients-item>
          <!-- </l-tables> -->
        </el-collapse-item>
        <el-collapse-item title="皮试中" name="3" v-loading="bottomLoading">
          <div class="wrapperCls" style="height: calc(100% - 48px)">
            <el-row class="btnPart padding-bottom-8 padding-top-8">
              <el-col :span="12" style="text-align: center">
                <el-button size="mini" @click="resultRecall()">撤 销</el-button>
              </el-col>
              <el-col :span="12" style="text-align: center">
                <el-button size="mini" @click="reload()">刷 新</el-button>
              </el-col>
            </el-row>
            <l-table
              :total="bottomPagination.total"
              :pageSize.sync="bottomPagination.pageSize"
              :page.sync="bottomPagination.currentPage"
              :layout="layout"
              :pagerCount="5"
              paginationAlign="center"
              :singlePageShow="true"
              @changeSize="changeSize"
            >
              <patients-item
                :data="bottomData"
                type="bottom"
                name="3"
                :radio="radio"
              ></patients-item>
            </l-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import {
  getPatients,
  receive,
  findAllergy,
  selectPatientBySth,
  skinTestList,
  findPatientListExecutoryContractByExecType,
  newFindPatientListExecutoryContractByExecType,
  findPatientTimeListExecutoryContractByExecType,
  findPatientRightListExecutoryContractByExecType,
  execResultRecall
} from "@/api/cis/visit/visit";

import patientsItem from "./patientsItem.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["params"],
  name: "patientInf",
  data() {
    return {
      radio: "first", // 待执行已完成radio
      activeNameCollapse: "1", // 皮试中手风琴
      topList: [],
      //   pagination: {
      //     currentPage: 1,
      //     pageSize: 10,
      //     total: 1
      //   },
      bottomPagination: {
        currentPage: 1,
        pageSize: 10,
        total: 1
      },
      layout: "pager",
      topLoading: false,
      topData: [],
      bottomLoading: false,
      bottomData: []
    };
  },
  components: { patientsItem },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      setReloadKey: "base/changeSearchAgainKey",
      setActiveTabName: "cis/setActiveTabName"
    }),
    resultRecall() {
      if(!this.receivePatientData.recordId) {
        this.$message.info("请先选择要撤销的患者，再进行撤销!");
        return;
      }
      let params = {
        recordId: this.receivePatientData.recordId,
        dataVersion: ""
      };
      this.$confirm("", "", {
        showClose: "false",
        confirmButtonText: "撤销",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: "true",
        message: "<div>确定要撤销吗？</div>",
        type: "warning"
      })
        .then(async () => {
          let result = await execResultRecall(params);
          if (result.code == 1) {
            this.$message({
              type: "success",
              message: "撤销成功!"
            });
            this.changeRecPatientData({
              ...this.receivePatientData,
              nameFlag: ""
            })
            this.reload();
          } else {
            this.$message.error(result.msg || "撤销失败");
          }
        })
        .catch(err => {
          // this.$message({
          //   type: "success",
          //   message: "取消成功"
          // });
        });
    },
    reload() {
      this.bottomPagination = {
        currentPage: 1, // 当前页数
        total: 0, // 总共条数
        pageSize: 10 // 每页数据条数
      };
      this.loadTableSkin(true);
    },
    changeRadio() {
      this.loadData();
    },
    changeSize(val) {
      this.bottomPagination.currentPage = val.page;
      this.bottomPagination.pageSize = val.pageSize;
      this.loadTableSkin();
    },
    loadData() {
      this.topLoading = true;
      let condition = this.params.searchValue ? this.params.searchValue.replace(/\s*/g,"") : "";
      let params = {
        patientIds: this.params.hasOwnProperty("searchReasult")
          ? this.params.searchReasult
          : "",
        startDate: this.params.hasOwnProperty("startDate")
          ? this.params.startDate
          : "",
        stopDate: this.params.hasOwnProperty("stopDate")
          ? this.params.stopDate
          : "",
        type: this.radio,
        technicalOffices: this.params.hasOwnProperty("technicalOffices")
          ? this.params.technicalOffices
          : "",
        visitCode: this.params.hasOwnProperty("searchValue")
          ? condition
          : "",
        areaId: this.params.areaId,
        roomId: this.params.roomId,
        appointmentMode: this.params.appointmentMode,
        execType: 2,
        patientName:
          this.params && this.params.hasOwnProperty("searchValue")
            ? condition
            : "",
        status: this.radio == "second" ? 1 : 0
      };

      try {
        newFindPatientListExecutoryContractByExecType(params, false).then(
          res => {
            res.data.forEach((item, index) => {
              item.patientAge = item.age;
            });
            this.topData = res.data;
            this.topLoading = false;
            console.log(
              this.topData,
              "this.topDatathis.topDatathis.topDatathis.topData"
            );
            // 判断是否清空 vuex 数据
            let targetRow = res.data.find(item => {
              return item.patientId === this.receivePatientData.patientId;
            });
            if (targetRow) {
              this.$nextTick(() => {
                this.$refs.topList.currentPenetrate = `${this.activeName}0`;
              });
            }
          }
        );
      } catch (e) {
        this.loading = false;
      }
      this.setActiveTabName(this.radio);
    },
    choosePatient(index, patientData) {
      this.$refs.topList.choosePenetrateItemWrapper(index, patientData);
    },
    loadTableSkin(flag) {
      this.bottomLoading = true;

      let param = {
        patientIds: this.params.hasOwnProperty("searchReasult")
          ? this.params.searchReasult
          : "",
        startDate: this.params.hasOwnProperty("startDate")
          ? this.params.startDate
          : "",
        stopDate: this.params.hasOwnProperty("stopDate")
          ? this.params.stopDate
          : "",
        type: this.activeName,
        technicalOffices: this.params.hasOwnProperty("technicalOffices")
          ? this.params.technicalOffices
          : "",
        visitCode: this.params.hasOwnProperty("searchValue")
          ? this.params.searchValue
          : "",
        areaId: this.params.areaId,
        roomId: this.params.roomId,
        appointmentMode: this.params.appointmentMode,
        execType: 2,
        execStatus: 1,
        patientName:
          this.params && this.params.hasOwnProperty("searchValue")
            ? this.params.searchValue
            : ""
      };
      let params = {
        pageNo: this.bottomPagination.currentPage,
        pageSize: this.bottomPagination.pageSize,
        recordId: "",
        ...param
      };
      findPatientTimeListExecutoryContractByExecType(params, false)
        .then(res => {
          this.bottomLoading = false;
          if (res.code == 1) {
            let list = res.data.map(item => {
              let estr = item.entryTime ? item.entryTime.split(":") : "";
              let sstr = item.submitPersonTime
                ? item.submitPersonTime.split(":")
                : "";
              return {
                ...item
              };
            });
            this.bottomData = list;
            console.log(
              this.bottomData,
              "this.bottomDatathis.bottomDatathis.bottomDatathis.bottomData"
            );
          } else {
            this.$message.error(res.msg || "获取数据失败");
          }
          this.bottomPagination.pageSize = res.pageParams.pageSize;
          this.bottomPagination.currentPage = res.pageParams.pageNo;
          this.bottomPagination.total = res.pageParams.total;
        })
        .catch(res => {
          this.bottomLoading = false;
          this.$message.error(res.msg || "查询失败");
        });
    }
  },
  mounted() {
    this.loadData(null);

    this.loadTableSkin(); // 皮试接口获取值
  },
  destroyed() {},
  created() {
    console.log(this.reloadPatient, "返回数据");
  },
  beforeDestroy: function() {},
  computed: {
    ...mapGetters("cis", ["dispTreatmentActiveTab"]),
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("base", ["reloadPatient"])
  },
  watch: {
    reloadPatient: {
      deep: true,
      // immediate: true,
      handler(val) {
        this.loadData();
        this.loadTableSkin();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.outpatientNurse {
  display: flex;
  flex-direction: column;

  .btnPart {
    padding: 8px 0;
  }

  /deep/ .el-collapse-item__header {
    height: 34px;
  }
  /deep/ .el-collapse-item__header {
    font-size: 14px;
    font-weight: 500;
  }
  /deep/ .el-collapse {
    height: 100%;
  }
  // /deep/ .el-collapse-item {
  //   // height: calc(100% - 68px);
  // }
  /deep/ .el-collapse-item.is-active {
    height: calc(100% - 34px);
  }
  /deep/ .el-collapse-item__wrap {
    height: calc(100% - 34px);
    overflow: unset !important;
  }
  /deep/ .el-collapse-item__content {
    height: 100%;
    padding: 0;
  }
  // /deep/.el-tabs__content {
  //   height: calc(100% - 37px);
  // }
  // /deep/.el-tabs__item {
  //   height: 32px;
  //   line-height: 32px;
  // }
  // /deep/ .rowStyleCls {
  //   height: 40px;
  //   font-size: 14px;
  //
  //   font-weight: 400;
  //   color: rgba(46, 50, 58, 1);

  //   > td {
  //     padding: 0;
  //   }
  // }
  // /deep/ .disabledRowStyleCls {
  //   color: #565656;
  //   background-color: #F5F7FA;
  // }
}

.collapseWrapper {
  height: calc(100% - 24px);
}
</style>
