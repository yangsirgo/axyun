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
                @click.stop="quote(item)"
                v-if="item.selectItem.length"
                class="float-right quote-button sbj-btn mini-button"
                type="primary"
              >
                {{ $t("base.quote") }}
              </div>
              <div class="sbj">{{ item.obRpNm }}</div>
            </div>
          </template>
          <template slot="content">
            <div>
              <el-checkbox-group v-model="item.selectItem">
                <el-checkbox label="表现">表现</el-checkbox>
                <el-checkbox label="结论">结论</el-checkbox>
              </el-checkbox-group>
              <div class="data-key">检查表现：</div>
              <div class="data-value">{{ item.obFndg }}</div>
              <div class="data-key">检查结论：</div>
              <div class="data-value">{{ item.obDi }}</div>
            </div>
          </template>
        </l-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getExaList } from "@/api/emrRecord/tools/CheckResult.js";
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      console.log(enTpCdStr, "enTpCdStrs");
      this.itemFlag = true;
      let enTpCd = enTpCdStr.split("-")[0];
      let enNo = this.treatHistoryOptions[enTpCdStr.split("-")[1]].enNo;
      const hosId = this.treatHistoryOptions.find(item => item.value === enTpCdStr).hosId
      this.loadDetail(enNo, enTpCd, hosId);
    },
    // 引用
    quote(data) {
      var times = data.rqsTime ? data.rqsTime.split(" ")[0] : "";
      let obj = {
        ...data,
        itemTime: times,
        itemName: data.obItmNm,
        examDescription: data.obFndg,
        examResult: data.obDi,
        selectItem: data.selectItem
      };
      this.$emit("message", "insertCheck", obj);
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
        //diagMain: "1",
        pageNo: 1,
        timeVal: 0,
        pageSize: 1000
      };

      getExaList(params)
        .then(res => {
          if (res.code === 1) {
            let reslist = res.data;
            reslist.forEach(item => {
              item.selectItem = [];
            });
            this.listData = reslist;
            this.listData.forEach((item, index) => {
              this.activeNames.push(index);
            });
          }
        })
        .catch(err => {
          this.$message.error(err);
        })
        .finally(() => {
          this.activeLoading = false;
        });
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
  margin-top: 10px;
}

.noData {
  text-align: center;
  padding: 5px 0;
}

.sbj {
  margin-right: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sbj-btn {
  display: block;
}

.data-key {
  color: $l-color-fontcolor-4;
  margin-top: 10px;
}
.data-value {
  padding: 5px;
}
</style>
