<template>
  <div class="width100 height100 hd-tree" v-loading="loading">
    <div class="top-container">
      <el-checkbox-group
        v-model="typeVal"
        @change="typeChange"
        class="align-center"
      >
        <el-checkbox label="01">门诊</el-checkbox>
        <el-checkbox label="04">家床</el-checkbox>
      </el-checkbox-group>
      <div class="margin-top">
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
    <el-scrollbar>
      <el-tree
        class="margin-top"
        id="insTree"
        :data="tree"
        :props="defaultProps"
        default-expand-all
        :highlight-current="true"
        @node-click="handleNodeClick"
        :render-content="renderContent"
      >
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { getTree, contentQuery } from "@/api/emrRecord/emr/instrument";
import {
  getHistoryVisitViEn,
  getHistoryDiagList
} from "@/api/emrRecord/tools/historicalDiagnosis";

export default {
  components: {},
  name: "",
  props: {
    visitType: String,
    showMrHomepage: Boolean, //集成病历
    modeType: {
      type: String,
      default: ""
    },
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
        "01": "门诊",
        "04": "家床"
      },
      // 主诊断列表
      recordVal: "",
      // 既往史列表
      recordList: [],
      tree: [],
      loading: false,
      curNode: "",
      defaultProps: {
        children: "children",
        label: "text"
      },
      colorObj: {
        "01": "#44c264",
        "02": "#134796",
        "03": "#E1140A",
        "04": "#E1140A",
        "05": "#A6A6A6",
        "07": "#E1140A",
        "08": "#E1140A",
        "09": "#E1140A",
        11: "#F7A820"
      },
      treatHistoryVal: "",
      treatHistoryMainOptions: []
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("cis", ["recallRecord"]),
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
        : this.visitCode;
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
        this.loadDiagnosisList();
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
        this.loadDiagnosisList();
      }
    },
    recallRecord: {
      handler(val) {
        if (val) {
          this.loadDiagnosisList();
        }
      }
    }
  },
  methods: {
    // 类型切换
    typeChange() {
      this.loadDiagnosisList();
    },
    selectChange(val) {
      this.tree = [];
      this.getMrList(val);
    },
    handleTime(timeString = "") {
      if (!timeString) {
        return "";
      }
      let timeStr = this.dayjs(timeString).format("YYYY-MM-DD HH:mm");
      return timeStr;
    },
    resetData() {
      this.treatHistoryMainOptions = [];
      this.treatHistoryVal = "";
      this.tree = [];
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
      this.resetData();

      if (!this.patientId) {
        return;
      }

      // 先查询主诊断
      let enTpCd = this.handlerCheckBoxVal();
      let paId = this.patientId;
      if (enTpCd == "") {
        return;
      }
      let visitTypeList = this.handlerVisitTypeList();
      let params = {
        onlyHisFlag: "0",
        visitTypeList: visitTypeList
      };
      this.loading = true;

      getHistoryVisitViEn(paId, params)
        .then(resData => {
          if (resData.code === 1) {
            this.loading = false
            console.log(resData, "resData---");
            // 筛选出所有的主诊断
            this.treatHistoryMainOptions = resData.data.map((item, index) => {
              let codeShowString = item.curMainDiNm
                ? `-${item.curMainDiNm}`
                : "";

              let label = `${this.handleTime(item.visitingTime)}-${
                this.typeListObj[item.enTpCd]
              }${codeShowString}-${item.hosNm}`;
              // 查出当前诊断的相关信息
              let valueStr = `${item.enNo}-${item.enTpCd}-${item.isHome}`;
              // if (this.modeNumCode === item.enNo) {
              //   this.treatHistoryVal = label;
              //   this.getMrList(valueStr);
              // }

              if (index === 0) {
                this.treatHistoryVal = valueStr;
                this.getMrList(valueStr);
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
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getMrList(valueStr) {
      console.log(this.treatHistoryMainOptions.find(item => item.value === valueStr))
      const current = this.treatHistoryMainOptions.find(item => item.value === valueStr)

      if (this.loading) return;
      this.loading = true;
      let valueList = valueStr.split("-");
      var data = {
        patientId: this.patientId || this.patientMsg.patientId,
        enId: valueList[0],
        isHome: valueList[2],
        visitType: valueList[1],
        dnFlag: "1",
        mrFlag: "02", // 查询非新建文书，01查询全部
        hosId: current ? current.hosId : ''
      };

      getTree(data)
        .then(res => {
          if (res.code == 1) {
            res.data.forEach(item => {
              this.addTextAttr(item);
            });
          }
          this.tree = res.data;
        })
        .catch(error => {
          this.$message.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleNodeClick(data) {
      this.curNode = data;
      var val = {
        mrId: data.exts.mrId,
        mrStaCd: data.exts.mrStaCd
      };
      contentQuery(val).then(res => {
        if (res.code == 1) {
          if (res.data.docMongoContent) {
            // this.$refs.axEditor.setContent(res.data.docMongoContent);
            this.$emit("showPop", res.data.docMongoContent, data);
          } else {
            // this.$refs.axEditor.setContent('');
            this.$emit("showPop", "");
          }
        }
      });
      // this.$emit("message", "pastDocumentClick", data);
    },
    //自定义树样式
    renderContent(h, { node, data, store }) {
      if (!data.exts) {
        return <p>{node.label}</p>;
      }

      if (data.exts.mrStaCd) {
        let bgColor = `background-color: ${this.colorObj[data.exts.mrStaCd]}`;
        return (
          <div class="el-tree-node__content">
            <div style={bgColor} class="dot" />
            <p>{node.label}</p>
          </div>
        );
      }
      return <p>{node.label}</p>;
    },
    //添加text属性，方便树加载
    addTextAttr(data) {
      data.text = data.label
        ? data.label
        : data.exts.mrName
      if (data.children) {
        data.children.forEach(item => {
          this.addTextAttr(item);
        });
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.top-container {
  height: 60px;
}
.margin-top {
  margin-top: 10px;
}
.hd-tree {
  width: 100%;
  /deep/ .el-scrollbar {
    height: calc(100% - 60px);
    overflow: hidden;
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: $l-color-bgcolor-12;
  }
  .el-tree-node__content:hover {
    background-color: $l-color-bgcolor-12;
  }
  .el-tree-node__content {
    white-space: normal;
  }
}
</style>
