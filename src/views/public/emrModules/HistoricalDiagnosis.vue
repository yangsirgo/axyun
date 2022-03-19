<template>
  <div class="diagnosis-con width100 height100" v-loading="loading">
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
            v-for="(item, index) in treatHistoryMainOptions"
            :key="item.value + index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="title-con">
      <div class="title-con-til">
        {{ illnessName }}
      </div>
      <el-button
        v-show="treatHistoryOptions.length > 0"
        type="text"
        size="small"
        class="blue-color"
        @click="quote"
        >引用</el-button
      >
    </div>
    <div class="content">
      <el-table
        ref="tableElem"
        v-loading="tlm_isLoading"
        :data="treatHistoryOptions"
        @selection-change="handleSelectionChange"
        border
        stripe
        tooltip-effect="dark"
        style="width: 100%"
        height="calc(100% - 10px)"
        element-loading-text="加载中..."
      >
        <el-table-column
          fixed="left"
          type="selection"
          width="40"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="诊断名称"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="act-word cursor-pointer">{{ scope.row.diagNm }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          label="就诊时间"
          min-width="80"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.diagTime }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  getHistoryVisitViEn,
  getHistoryDiagList
} from "@/api/emrRecord/tools/historicalDiagnosis";

import { mapGetters } from "vuex";

// 历史诊断
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
      typeVal: ["01"],
      typeListObj: {
        "00": "全部",
        "01": "门诊",
        "04": "家床"
      },
      // 主诊断列表
      treatHistoryVal: "",
      // select 数据
      treatHistoryMainOptions: [],
      treatHistoryOptions: [],
      loading: false,
      tlm_isLoading: false,
      checkItemList: [],
      illnessName: ""
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    // ...mapGetters("cis", ["visitType"]),
    ...mapGetters("homeSickbeds", {
      homeSickbedsPatient: "receivePatientData"
    }),
    patientId() {
      let patientId =
        this.visitType === "04" && this.isHome === "1"
          ? this.homeSickbedsPatient.patientId
          : this.receivePatientData.patientId;
      return patientId;
    },
    modeNumCode() {
      // 家床类型 才传递 家床的患者号
      return this.visitType === "04" && this.isHome === "1"
        ? this.homeSickbedsPatient.treatNo
        : this.receivePatientData.visitCode;
    }
  },
  watch: {
    receivePatientData: {
      handler(n) {
        if (this.isHome === "1") return;
        if (n.patientId) {
          this.loadDiagnosisList();
        }
      },
      deep: true
    },
    homeSickbedsPatient: {
      handler(n) {
        if (this.isHome === "0") return;
        if (n.patientId) {
          this.loadDiagnosisList();
        }
      },
      deep: true
    },
    visitType: {
      handler(n) {
        if (n === "01") {
          this.typeVal = ["01"];
        } else if (n === "04") {
          this.typeVal = ["04"];
        }
        this.loadDiagnosisList();
      },
      immediate: true
    }
  },
  methods: {
    handleSelectionChange(data) {
      this.checkItemList = data;
    },
    resetData() {
      this.treatHistoryMainOptions = [];
      this.treatHistoryVal = "";
      this.treatHistoryOptions = [];
      this.illnessName = "";
    },
    handleTime(timeString = "") {
      if (!timeString) {
        return "";
      }
      let timeStr = this.dayjs(timeString).format("YYYY-MM-DD HH:mm");
      return timeStr;
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
    loadDiagnosisList() {
      if (!this.patientId) return;
      this.resetData();
      if (this.loading) return;
      this.loading = true;

      let enTpCd = this.handlerCheckBoxVal();
      let paId = this.patientId;
      if (enTpCd == "") {
        return;
      }

      let visitTypeList = this.handlerVisitTypeList();
      let params = {
        onlyHisFlag: "0",
        // diagNm: "",
        visitTypeList: visitTypeList
      };

      getHistoryVisitViEn(paId, params)
        .then(resData => {
          if (resData.code === 1) {
            // 筛选出所有的主诊断
            this.treatHistoryMainOptions = resData.data.map((item, index) => {
              let codeShowString = item.curMainDiNm;

              let label = `${this.handleTime(item.visitingTime)}-${
                this.typeListObj[item.enTpCd]
              }-${codeShowString}-${item.hosNm}`;

              // 选中 当前诊断
              let valueStr = `${item.enNo}-${item.enTpCd}-${
                item.isHome
              }-${codeShowString}`;
              if (this.modeNumCode === item.enNo) {
                this.treatHistoryVal = valueStr;
                this.illnessName = codeShowString;
                this.loadDetailEnNo(valueStr);
              }

              return {
                ...item,
                label: label,
                value: valueStr
              };
            });
          } else {
            this.$message.error(resData.msg || "数据错误");
          }
        })
        .catch(error => {
          console.log(error);
          this.$message.error(error || "数据错误");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 类型切换
    typeChange() {
      this.loadDiagnosisList();
    },
    selectChange(value) {
      this.treatHistoryOptions = [];
      this.illnessName = value.split("-")[3];
      this.loadDetailEnNo(value);
    },
    loadDetailEnNo(valueStr) {
      console.log(this.treatHistoryMainOptions)
      const current = this.treatHistoryMainOptions.find(item => item.value === valueStr)
      let valueList = valueStr.split("-");
      let data = {
        paId: this.patientId,
        enNo: valueList[0],
        visitType: valueList[1],
        isHome: valueList[2],
        hosId: current ? current.hosId : ''
      };

      if (this.tlm_isLoading) return;
      this.tlm_isLoading = true;

      getHistoryDiagList(data)
        .then(resData => {
          if (resData.code === 1) {
            // 筛选出所有的主诊断
            this.treatHistoryOptions = resData.data;
          } else {
            this.$message.error(resData.msg || "数据错误");
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.tlm_isLoading = false;
        });
    },
    quote() {
      if (this.checkItemList.length == 0) {
        this.$message.warning("请选择诊断！");
        return;
      }
      this.showDetail(this.checkItemList);
    },
    // 显示诊断详情
    showDetail(list) {
      // 一个诊断下 都是同类型诊断
      let m = new Map();
      list.forEach(item => {
        let titleStr = `${(item.beforeDiag || "") +
          item.diagNm +
          (item.afterDiag || "")}`;
        if (m.has(item.diagTpCd)) {
          m.get(item.diagTpCd).push({
            name: titleStr,
            title: item.diagTpNm,
            mainFlag: item.mainF === "1",
            cwDiagName: item.cwDiagF === "1" ? "西" : "中"
          });
        } else {
          let arr = [];
          arr.push({
            name: titleStr,
            title: item.diagTpNm,
            mainFlag: item.mainF === "1",
            cwDiagName: item.cwDiagF === "1" ? "西" : "中"
          });
          m.set(item.diagTpCd, arr);
        }
      });

      let diagnoseInfo = [];

      m.forEach((value, key) => {
        let item = {
          type: key,
          resultList: value
        };
        diagnoseInfo.push(item);
      });

      this.$emit("message", "insertDiagnoses", diagnoseInfo);
    }
  }
};
</script>
<style lang="scss" scoped>
.diagnosis-con {
  display: flex;
  flex-direction: column;
}
.top-container {
  height: 60;
}

.select-container {
  width: 80px;
}

.select-bingli {
  margin-top: 10px;
}
.title-con {
  margin-top: 10px;
  line-height: 26px;
  position: relative;
  .title-con-til {
    display: inline-block;
    margin-right: 40px;
  }
}
.blue-color {
  position: absolute;
  right: 0;
  top: 0;
  padding: 4px 10px;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  background-color: #2b4583;
}
.content {
  flex: 1;
  overflow: hidden;
}

.act-word {
  color: $l-color-fontcolor-2;
}
</style>
