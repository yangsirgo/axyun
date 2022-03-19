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
            v-for="item in treatHistoryMainOptions"
            :key="item.index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="title-con">
      {{ illnessName }}
      <el-button
        v-show="realCheckItemList.length > 0"
        type="text"
        size="small"
        class="blue-color float-right"
        @click="quote"
        >引用</el-button
      >
    </div>
    <div class="content">
      <el-table
        ref="tableElem"
        :cell-class-name="cellcb"
        :data="treatHistoryOptions"
        v-loading="tableLoading"
        border
        stripe
        tooltip-effect="dark"
        style="width: 100%"
        height="calc(100% - 10px)"
        @selection-change="handleSelectionChange"
        element-loading-text="加载中..."
      >
        <el-table-column fixed="left" type="selection" width="40">
        </el-table-column>
        <el-table-column width="35">
          <template slot-scope="scope">
            <span :class="[scope.row.classNmae]"> </span>
          </template>
        </el-table-column>
        <el-table-column label="药品名称" min-width="140">
          <template slot-scope="scope">
            <span class="act-word cursor-pointer"
              >{{ scope.row.selfProvidedFlag ? "（自备）" : "" }}
              {{ scope.row.svNm }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="规格" min-width="120">
          <template slot-scope="scope">{{ scope.row.spec }}</template>
        </el-table-column>
        <el-table-column prop="qty" label="用量" min-width="120">
          <template slot-scope="scope">{{ scope.row.qty }} </template>
        </el-table-column>

        <el-table-column prop="useNumStr" label="数量" min-width="80">
          <template slot-scope="scope">{{ scope.row.useNumStr }}</template>
        </el-table-column>
        <el-table-column prop="freqAndUsreage" label="频次用法" min-width="150">
          <template slot-scope="scope">{{ scope.row.freqAndUsreage }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import { previousOrderList } from "@/api/emrRecord/tools/PreviousOrder";
import { getHistoryVisitViEn } from "@/api/emrRecord/tools/historicalDiagnosis";
import { transformCode } from "@/api/directive/directiveRequest";

import { handlerPreviousData } from "@/utils/axeditor";

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
      loading: false,
      tableLoading: false,
      typeVal: ["01"],
      typeListObj: {
        "00": "全部",
        "01": "门诊",
        "04": "住院"
      },
      // 主诊断列表
      treatHistoryVal: "",
      // select 数据
      treatHistoryMainOptions: [],
      treatHistoryOptions: [],
      realCheckItemList: [], // 选中项
      illnessName: "",
      xiMedicineList: [], // 西药
      chinaMedicineList: [], // 中药
      allChinaMedicineObj: {}, // 全部中药
      otherPreviousList: [] // 非药品
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
    }
  },
  watch: {
    receivePatientData: {
      handler(n) {
        if (this.isHome === "1") return;
        this.treatHistoryMainOptions = [];
        this.loadTable();
      },
      deep: true
    },
    homeSickbedsPatient: {
      handler(n) {
        if (this.isHome === "0") return;
        this.treatHistoryMainOptions = [];
        this.loadTable();
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
        this.loadTable();
      },
      immediate: true
    }
  },
  methods: {
    cellcb(row) {
      if (row.row.number === "" && row.columnIndex === 0) {
        return "my-cell";
      }
    },
    handleSelectionChange(list) {
      console.log(list, "llslsl");
      this.realCheckItemList = list;
    },
    handlerCheckBoxVal() {
      if (this.typeVal.length === 2) {
        return "01,04";
      } else if (this.typeVal.length === 0) {
        return "";
      }
      return this.typeVal[0];
    },
    resetData() {
      this.treatHistoryMainOptions = [];
      this.treatHistoryVal = "";
      this.treatHistoryOptions = [];
      this.realCheckItemList = [];
      this.illnessName = "";
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

      this.loading = true;

      let paId = this.patientId;
      let visitTypeList = this.handlerVisitTypeList();
      let params = {
        onlyHisFlag: "0",
        visitTypeList: visitTypeList
      };

      try {
        let { code, data } = await getHistoryVisitViEn(paId, params);

        if (code === 1 && data) {
          this.treatHistoryMainOptions = [];
          data.forEach(async (item, index) => {
            let codeShowString = item.curMainDiNm ? `${item.curMainDiNm}` : "";
            let valueStr = `${item.enNo}-${item.enTpCd}-${
              item.isHome
            }-${codeShowString}`;
            this.treatHistoryMainOptions.push({
              label: `${this.handlerTimeShow(item.visitingTime)}-${
                this.typeListObj[item.enTpCd]
              }-${codeShowString}-${item.hosNm}`,
              value: valueStr,
              ...item
            });

            if (index === 0) {
              this.illnessName = codeShowString;

              this.selectChange(valueStr);
              this.$nextTick(() => {
                this.treatHistoryVal = valueStr;
              });
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
    // 处理西药和中成药
    handlerTableClass(len, index) {
      let classNmae = "";
      if (len === 1) {
        // classNmae = "bunchingSingle";
        classNmae = "";
      } else if (len === 2) {
        if (index === 0) {
          classNmae = "bunchingUp";
        } else {
          classNmae = "bunchingDown";
        }
      } else if (len > 2) {
        if (index === 0) {
          classNmae = "bunchingUp";
        } else if (index === len - 1) {
          classNmae = "bunchingDown";
        } else {
          classNmae = "bunchingCenter";
        }
      }
      return classNmae;
    },
    // 处理西药
    handlerXiMedicine(medicines, num) {
      let list = [];
      for (let k in medicines) {
        let medicineObj = medicines[k];
        for (let j in medicineObj) {
          let medItem = medicineObj[j];
          let len = medItem.length;

          medItem.forEach((item, index) => {
            let classNmae = this.handlerTableClass(len, index);

            list.push({
              number: index > 0 ? "" : num++,
              type: "medicine",
              classNmae,
              orId: item.parOrPk ? item.parOrPk : item.orId,
              selfProvidedFlag: item.selfProvidedFlag, // 是否是自备药
              svNm: item.name, // 药品名称
              spec: item.spec, // 规格
              qty: item.qty, // 用量
              longOrFlag: item.longOrF === "1", // 是否是长期医嘱
              useNumStr: `${item.useNum || ""}${item.useNumCode || ""}`, // 数量 useNum  useNumCode
              freqAndUsreage: item.freqNm // 频次用法 freqNm  useage
            });
          });
        }
      }

      return list;
    },
    // 处理中药
    handlerChinaMedicine(chineseHerbalMedicineObj, num) {
      let list = [];
      for (let k in chineseHerbalMedicineObj) {
        let chineseList = chineseHerbalMedicineObj[k];
        let chinaList = chineseList.map((item, index) => {
          return {
            type: "chinaMedicine",
            number: index > 0 ? "" : num++,
            chinaMedicineId: item.orPresPk,
            crtDosage: item.crtDosage, // 付 数
            svNm: item.svNm, // 药品名称
            longOrFlag: item.longOrF === "1", // 是否是长期医嘱
            useNumStr: `${item.amount || ""}${item.takeAmount || ""} `, // 数量 useNum  useNumCode
            freqAndUsreage: `${item.freqNm},${item.usage}` // 频次用法 freqNm  useage
          };
        });
        list.push(...chinaList);
      }

      return list;
    },
    // 处理非药品
    handlerOtherPrevious(otherList, num) {
      let list = [];
      console.log(otherList);
      list = otherList.map((item, index) => {
        return {
          type: "otherPrevious",
          number: num++,
          svNm: item.svNm,
          longOrFlag: item.longOrF === "1", // 是否是长期医嘱
          useNumStr: `${item.amount || ""} ${item.takeAmount || ""}`
        };
      });
      return list;
    },
    // 加载某一处方下具体医嘱
    loadDiagnosisList(valueStr) {
      const hosId = this.treatHistoryMainOptions.find(item => item.value === valueStr).hosId
      this.tableLoading = true;
      let valueList = valueStr.split("-");
      let data = {
        paId: this.patientId,
        enNo: valueList[0],
        visitType: valueList[1],
        isHome: valueList[2],
        hosId: hosId
      };
      previousOrderList(data)
        .then(async resData => {
          let { code, data } = resData;
          if (code === 1) {
            let num = 1;
            let {
              medicines = {},
              chineseHerbalMedicine = {},
              usageMedicine = []
            } = await handlerPreviousData(data);

            this.allChinaMedicineObj = chineseHerbalMedicine;

            if (Object.keys(medicines).length > 0) {
              this.xiMedicineList = this.handlerXiMedicine(medicines, num);
            }

            if (Object.keys(chineseHerbalMedicine).length > 0) {
              this.chinaMedicineList = this.handlerChinaMedicine(
                chineseHerbalMedicine,
                num
              );
            }

            if (usageMedicine.length > 0) {
              this.otherPreviousList = this.handlerOtherPrevious(
                usageMedicine,
                num
              );
            }

            this.treatHistoryOptions.push(
              ...this.xiMedicineList,
              ...this.chinaMedicineList,
              ...this.otherPreviousList
            );
          } else {
            this.$message.error(resData.msg || "数据错误");
          }
        })
        .catch(error => {
          console.log(error);
          this.$message.error(error || "数据错误");
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 类型切换
    typeChange() {
      this.resetData();
      this.loadTable();
    },
    async selectChange(value) {
      this.realCheckItemList = [];
      this.treatHistoryOptions = [];

      this.illnessName = value.split("-")[3];

      this.xiMedicineList = [];
      this.chinaMedicineList = [];
      this.otherPreviousList = [];
      await this.loadDiagnosisList(value);
    },
    // 引用
    async quote() {
      let data = {
        medicineList: [], // 西药
        chinaMedicineList: {}, // 中药
        otherPreviousList: [] // 非药品
      };

      // 全选 一
      if (this.realCheckItemList.length === this.treatHistoryOptions.length) {
        data.medicineList = [...this.xiMedicineList];
        // 对中药进行处理
        for (let k in this.allChinaMedicineObj) {
          this.allChinaMedicineObj[k] = this.allChinaMedicineObj[k].map(
            item => {
              return {
                ...item,
                type: "chinaMedicine",
                chinaMedicineId: item.orPresPk,
                useNumStr: `${item.amount}${item.takeAmount} `, // 数量 useNum  useNumCode
                freqAndUsreage: `${item.freqNm},${item.usage}` // 频次用法 freqNm  useage
              };
            }
          );
        }
        data.chinaMedicineList = this.allChinaMedicineObj;
        // 其他医嘱
        data.otherPreviousList = [...this.otherPreviousList];
      } else {
        this.realCheckItemList.forEach(item => {
          switch (item.type) {
            case "medicine":
              let medList = this.xiMedicineList.filter(
                xiMedicine => xiMedicine.orId === item.orId
              );
              data.medicineList.push(...medList);
              break;
            case "chinaMedicine":
              let chinaMedList = this.chinaMedicineList.filter(
                xiMedicine =>
                  xiMedicine.chinaMedicineId === item.chinaMedicineId
              );
              data.chinaMedicineList[item.chinaMedicineId] = chinaMedList;
              break;
            case "otherPrevious":
              data.otherPreviousList.push(item);
              break;
          }
        });
      }

      console.log(data, "data");

      // 插入处方
      this.$emit("message", "insertPreviousFunc", data);
    }
  }
};
</script>
<style lang="scss" scoped>
.top-container {
  height: 60;
}

.select-container {
  width: 80px;
}

.select-bingli {
  margin-top: 10px;
}

.content {
  position: absolute;
  top: 120px;
  bottom: 0px;
  left: 10px;
  right: 10px;
  overflow: hidden;
}

.bunchingUp {
  display: inline-block;
  color: $l-color-primary;

  &::after {
    content: "┏ ";
  }
}

.bunchingCenter {
  display: inline-block;
  color: $l-color-primary;

  &::after {
    content: "┣ ";
  }
}

.bunchingDown {
  color: $l-color-primary;
  display: inline-block;

  &::after {
    content: "┗ ";
  }
}
.bunchingSingle {
  color: $l-color-primary;
  display: inline-block;

  &::after {
    content: "【 ";
  }
}

.act-word {
  color: $l-color-fontcolor-2;
}
.title-con {
  margin-top: 10px;
  line-height: 26px;
}
.blue-color {
  padding: 4px 10px;
  border-radius: 3px;
  color: #fff;
  background-color: #2b4583;
}
/deep/ .my-cell {
  font-size: 12px;
  .el-checkbox {
    display: none !important;
  }
}
</style>
