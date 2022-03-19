<template>
  <div class="width100 height100" v-loading="loading">
    <div class="top-container">
      <el-checkbox-group
        v-model="typeVal"
        @change="typeChange"
        class="align-center"
      >
        <el-checkbox label="01">门诊</el-checkbox>
        <el-checkbox label="04">家床</el-checkbox>
      </el-checkbox-group>
      <div class="select-bingli">
        <el-select
          v-model="treatHistoryVal"
          @change="selectChange"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) in treatHistoryOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="content overflow-scroll-vertical" v-loading="activeLoading">
      <el-collapse v-model="activeNames" v-show="itemFlag">
        <p
          class="noData"
          v-if="
            !activeLoading &&
            treatHistoryOptions.length === 0 &&
            listData.length === 0
          "
        >
          暂无数据
        </p>
        <l-collapse-item
          sty="3"
          v-for="(item, index) in listData"
          :key="'list' + index"
          :name="index"
        >
          <template slot="title">
            <div class="width100">
              <div
                v-show="item.chooseResult && item.chooseResult.length > 0"
                @click.stop="quote(item, index)"
                class="float-right quote-button sbj-btn mini-button"
                type="primary"
              >
                {{ $t("base.quote") }}
              </div>
              <div class="sbj">{{ item.labRpNm }}</div>
              <!-- 引用按钮 -->
            </div>
          </template>
          <template slot="content">
            <el-table
              :data="item.Result"
              @selection-change="
                (val) => {
                  handleSelectionChange(val, index);
                }
              "
              border
              style="width: 100%"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column
                prop="labItmNm"
                label="检验项目"
              ></el-table-column>
              <el-table-column
                prop="labItmVal"
                label="测定结果"
              ></el-table-column>
              <el-table-column prop="labItmUnitNm" label="单位">
              </el-table-column>
              <el-table-column
                prop="referenceRange"
                label="参考范围"
              ></el-table-column>
            </el-table>
          </template>
        </l-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import {
  getPageByCondition,
  labRpItmGetPageByCondition
} from "@/api/emrRecord/tools/InspectionResults.js";
import { getHistoryVisitViEn } from "@/api/emrRecord/tools/historicalDiagnosis";

// 检验结果
export default {
  props: {
    visitType: String,
    isHome: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
      // 类型值
      typeVal: ["01"],
      typeListObj: {
        "00": "全部",
        "01": "门诊",
        "04": "家床"
      },
      activeNames: [],
      // 主诊断列表
      treatHistoryVal: "",
      // 既往史列表
      treatHistoryOptions: [],
      // 某个诊断列表数据
      listData: [],
      // 分页控制参数
      pageParams: {
        pageNo: 1, // 当前页数
        pageSize: 100 // 每页数据条数
      },
      // 列表状态控制
      loading: false,
      // 报告详情loading
      activeLoading: false,
      itemFlag: false
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("homeSickbeds", {
      homeSickbedsPatient: "receivePatientData"
    }),
    patientId() {
      let patientId =
        this.visitType === "04" && this.isHome === "1"
          ? this.homeSickbedsPatient.patientId
          : this.receivePatientData.patientId;
      return patientId;
    }
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler() {
        if (this.isHome === "1") return;
        if (this.visitType === "01") {
          this.typeVal = ["01"];
        } else if (this.visitType === "04") {
          this.typeVal = ["04"];
        }
        this.loadTable();
      }
    },
    homeSickbedsPatient: {
      deep: true,
      immediate: true,
      handler() {
        if (this.isHome === "0") return;
        if (this.visitType === "01") {
          this.typeVal = ["01"];
        } else if (this.visitType === "04") {
          this.typeVal = ["04"];
        }
        this.loadTable();
      }
    }
  },
  methods: {
    // 选中行时触发的事件
    handleSelectionChange(val, index) {
      this.listData[index].chooseResult = val;
    },
    handlerCheckBoxVal() {
      if (this.typeVal.length === 2) {
        return "01,04";
      } else if (this.typeVal.length === 0) {
        return "";
      }
      return this.typeVal[0];
    },
    handlerVisitTypeList() {
      let obj = {
        "01": { visitType: "01", isHome: "0" },
        "04": { visitType: "04", isHome: "1" }
      };
      let list = [];

      this.typeVal.forEach(type => {
        if (obj[type]) {
          list.push(obj[type]);
        }
      });
      return list;
    },
    // 加载列表数据
    async loadTable() {
      if (!this.patientId) {
        this.treatHistoryOptions = [];
        return;
      }

      let enTpCd = this.handlerCheckBoxVal();
      let paId = this.patientId || "";
      if (enTpCd == "") {
        return;
      }

      this.loading = true;
      let visitTypeList = this.handlerVisitTypeList();
      let params = {
        onlyHisFlag: "0",
        // diagNm: "",
        visitTypeList: visitTypeList
      };

      try {
        let { code, data } = await getHistoryVisitViEn(paId, params);
        if (code === 1 && data) {
          data.forEach(async (item, index) => {
            let codeShowString = item.curMainDiNm ? `-${item.curMainDiNm}` : "";

            this.treatHistoryOptions.push({
              label: `${this.handlerTimeShow(item.visitingTime)}-${
                this.typeListObj[item.enTpCd]
              }${codeShowString}-${item.hosNm}`,
              value: `${item.enTpCd}-${index}`,
              ...item
            });

            if (index === 0) {
              this.treatHistoryVal = `${item.enTpCd}-${index}`;
              this.selectChange(this.treatHistoryVal);
            }
          });
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error);
      }
    },
    // 处理时间展示
    handlerTimeShow(timeString = "") {
      if (!timeString) {
        return "";
      }
      let timeStr = this.dayjs(timeString).format("YYYY-MM-DD HH:mm");
      return timeStr;
    },
    // 类型切换
    typeChange() {
      this.resetData();
      this.loadTable();
    },
    resetData() {
      this.treatHistoryVal = "";
      this.treatHistoryOptions = [];

      this.activeNames = [];
      this.listData = [];
    },
    selectChange(enTpCdStr) {
      console.log(enTpCdStr, "enTpCdStr");
      let enTpCd = enTpCdStr.split("-")[0];
      let enNo = this.treatHistoryOptions[enTpCdStr.split("-")[1]].enNo;
      this.itemFlag = true;
      console.log(this.treatHistoryOptions, enTpCd, enNo);
      const hosId = this.treatHistoryOptions.find(item => item.value === enTpCdStr).hosId
      this.loadDetail(enNo, enTpCd, hosId);
    },
    // 引用
    quote(data, index) {
      let multipleSelection = this.listData[index].chooseResult;
      let res = {
        multipleSelection: multipleSelection.map(item => {
          var times = item.rqsTime ? item.rqsTime.split(" ")[0] : "";
          return {
            assayTime: times,
            assayName: item.labItmNm,
            assayResult: item.labItmVal,
            assayUnit: item.labItmUnitNm,
            referenceValue: item.referenceRange
          };
        }),
        data: {
          assayApplyItemName: data.labRpNm
        }
      };
      this.$emit("message", "insertCheckRes", res);
    },
    // 加载详情
    loadDetail(enNo, enTpCd, hosId) {
      if (this.activeLoading) return;
      this.activeLoading = true;
      let params = {
        enTpCd: enTpCd,
        paId: this.patientId,
        enNo: enNo,
        hosId: hosId,
        ...this.pageParams
      };

      getPageByCondition(params)
        .then(res => {
          if (res.code === 1) {
            this.listData = res.data;
            this.listData.forEach(async (item, index) => {
              let resData = await this.loadCheckDetail(item.labRpId);

              if (resData.code === 1 && resData.data) {
                this.$set(this.listData[index], "Result", resData.data);
                // 插入一个标识已选数组
                this.$set(this.listData[index], "chooseResult", []);
              }
            });
            console.log(this.listData, "this.listData");
          }
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.activeLoading = false;
        });
    },
    // 加载检查项目详情
    async loadCheckDetail(id) {
      let params = {
        labRpId: id
      };
      let resData = await labRpItmGetPageByCondition(params);
      return resData;
    }
  }
};
</script>
<style lang="scss" scoped>
.top-container {
  height: 60;
}

.select-bingli {
  margin-top: 10px;
}
.select-container {
  width: 80px;
}
.noData {
  text-align: center;
  padding: 5px 0;
}
.content {
  position: absolute;
  top: 80px;
  bottom: 0px;
  left: 10px;
  right: 10px;
}
.act-word {
  color: $l-color-fontcolor-2;
}
.desc-text {
  margin: 20px 0 10px 0;
  color: $l-color-fontcolor-4;
  cursor: pointer;
}
.quote-button {
  margin-top: 7px;
}
</style>
