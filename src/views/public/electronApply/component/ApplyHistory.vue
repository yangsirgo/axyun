<template>
  <div class="flex-column-box">
    <div class="apply-right-search">
      <div class="right-search-left">
        <el-date-picker
          style="width: 220px"
          v-model="history.timepicker"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
        ></el-date-picker>
        <el-select style="width: 130px" v-model="history.status">
          <el-option
            v-for="item in history.statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button @click="getHistoryApplyList()" type="primary" size="small"
          >查询</el-button
        >
      </div>
      <div class="right-search-right">
        <el-checkbox v-model="history.deptId" @change="getHistoryApplyList"
          >仅看本科室</el-checkbox
        >
        <el-checkbox v-model="history.myself" @change="getHistoryApplyList"
          >仅看我的申请</el-checkbox
        >
      </div>
    </div>
    <div class="handle-btn-box">
      <el-button
        class="filter-item iconfont iconzuofei"
        @click="backout()"
        type="text"
        >&nbsp;作废</el-button
      >
      <el-button
        class="filter-item iconfont icondayin"
        type="text"
        @click="printClick(0)"
        v-hotKey="{ func: 'func_print' }"
        :loading="printLoading0"
        >&nbsp;打印</el-button
      >
      <el-button
        class="filter-item iconfont icondayin"
        type="text"
        @click="printClick(1)"
        v-hotKey="{ func: 'func_print' }"
        :loading="printLoading1"
        >&nbsp;全部打印</el-button
      >
    </div>
    <div class="scrollheight">
      <el-table
        ref="rigTable"
        :data="historyApplyList"
        row-key="orderId"
        border
        height="100%"
        highlight-current-row
        @selection-change="selectHistoryApply"
        v-loading="rightTableLoad"
        :row-class-name="rowStyleCls"
        :span-method="objectSpanMethod"
        v-hotKey="{
          func: ['table_row', 'table_checkbox', 'table_choose'],
          deClass: 'el-table__row',
          curClass: 'current-row',
        }"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          align="center"
          width="55"
        ></el-table-column>
        <el-table-column
          v-for="(item, index) in selectedParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          header-align="left"
          align="left"
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'sampleTypeCode'">
              <span
                class="sample"
                :val="scope.row.sampleTypeCode"
                code="InspectSpecimen"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.prop === 'isUrgent'">
              <el-tag
                v-if="scope.row.isUrgent"
                type="danger"
                disable-transitions
                size="medium"
                >加急</el-tag
              >
              <span v-else></span>
            </template>
            <template v-else-if="item.prop === 'status'">
              <span class="state-color">
                <!-- <span v-if="scope.row.status">{{
                  history.stageInvert[scope.row.status]
                }}</span>
                <span v-else>全部</span> -->
                <applStatusShow
                  aType="检验"
                  :patientObj="receivePatientData"
                  :aStatus="scope.row.status"
                ></applStatusShow>
              </span>
            </template>
            <template v-else-if="item.prop === 'chargeStatus'">
              <span
                :val="scope.row.chargeStatus || ''"
                code="ChargeStatus"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.prop === 'project'">查看报告</template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { onPreview, onPrint, onPreviewData } from "@/utils/print";
import {
  getHistoryApplyList,
  historyList
} from "@/api/electronApply/chargeTemplate";
import {
  backoutApply,
  applyPrint,
  applyListPrint
} from "@/api/electronApply/inspectionApply";
import applStatusShow from "@/views/public/electronApply/component/applStatusShow.vue";
import { print, getPrinterList } from "@/utils/print_new"
import codes from "@/printTemplete/code.js";
import { complier, applyPrintTpl } from "@/printTemplete/module/testApplyLodopTpl.js"
import { getPrintTpl } from "@/api/admin/print/print";
import {
  diagPrintModuleParams
} from "@/components/adviceCommon/adviceUtils.js"


export default {
  name: "applyHistory",
  data() {
    return {
      selectedParams: [
        {
          prop: "applyCode",
          label: "申请单号",
          width: 150
        },
        {
          prop: "createTime",
          label: "申请日期",
          width: 150
        },
        {
          prop: "itemName",
          label: "医嘱名称",
          width: 150
        },
        {
          prop: "quantity",
          label: "次数",
          width: 80
        },
        {
          prop: "sampleTypeCode",
          label: "标本",
          width: 100
        },
        {
          prop: "isUrgent",
          label: "加急",
          width: 80
        },
        {
          prop: "status",
          label: "申请状态",
          width: 120
        },
        {
          prop: "chargeStatus",
          label: "费用状态",
          width: 120
        },
        {
          prop: "execDeptName",
          label: "执行科室",
          width: 90
        },
        {
          prop: "deptName",
          label: "申请科室",
          width: 90
        },
        {
          prop: "createName",
          label: "申请医生",
          width: 90
        }
        /* ,
        {
          prop: "project",
          label: "报告",
          width: 120
        } */
      ],
      //搜索条件
      history: {
        status: "", //搜索范围
        timepicker: [], //搜索时间
        myself: false, //是否只看自己
        deptId: false,
        statusList: [
          {
            id: "",
            name: "全部"
          },
          {
            id: "1",
            name: "已申请"
          },
          {
            id: "23",
            name: "已报告"
          }
        ],
        stageInvert: {
          1: "已申请",
          10: "已报告",
          99: "已作废"
        }
      },
      historyApplyList: [],
      applyList: [],
      rightTableLoad: false,
      // 合并医嘱
      RpRowArr: [],
      rpPosition: 0,
      printLoading0: false,
      printLoading1: false,
      checkTpl: ""
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val.patientId) {
          return;
        }
        this.getHistoryApplyList();
      }
    }
  },
  async mounted() {
    await this.getHistoryApplyList();
  },
  components: {
    applStatusShow
  },
  /**
   * 一级事件
   * 1.查询历史申请列表(getHistoryApplyList){查询历史申请列表}
   * 2.作废申请按钮(backout){1.对作废的数据进行校验；2.作废申请接口}
   * 3.打印申请按钮(printClick){1.对打印的数据进行校验；2.执行打印方法}
   * 4.表格多选事件(selectCancelApply){1.设置全局当前多选数据变量；2.计算总价}
   */
  methods: {
    //处方合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2) {
        const _row = this.RpRowArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      return false;
    },
    //获取处方合并的 list
    getRpRowArr() {
      // this.selectRefresh = false;
      let tableData = this.historyApplyList;
      this.rpPosition = 0;
      this.RpRowArr = [];
      tableData.forEach((item, index) => {
        item.index = index;
        if (index === 0) {
          this.RpRowArr.push(1);
        } else {
          if (item["assayApplyId"] === tableData[index - 1]["assayApplyId"]) {
            this.RpRowArr[this.rpPosition] += 1;
            this.RpRowArr.push(0);
          } else {
            this.RpRowArr.push(1);
            this.rpPosition = index;
          }
        }
      });
      /* this.$nextTick(() => {
        this.selectRefresh = true;
      }); */
    },
    //处理 row 的样式（免费申请显示绿色）
    rowStyleCls(a) {
      return {
        freeRpRow: a.row.freeFlag !== "" && a.row.freeFlag !== undefined
      };
    },
    //查询已申请单
    async getHistoryApplyList() {
      this.historyApplyList = [];
      this.applyList = [];
      this.$refs.rigTable && this.$refs.rigTable.clearSelection();
      if (!this.receivePatientData.patientId) {
        // this.$message.warning("请选择患者!");
        return;
      }
      try {
        this.rightTableLoad = true;
        let params = {};
        if (this.history.myself) {
          params["myself"] = "1";
        } else {
          delete params["myself"];
        }
        if (this.history.deptId) {
          params["deptId"] = "1";
        } else {
          delete params["deptId"];
        }
        params["startTime"] =
          this.history.timepicker &&
          this.history.timepicker[0] &&
          this.history.timepicker[0] + " 00:00:00";
        params["endTime"] =
          this.history.timepicker &&
          this.history.timepicker[1] &&
          this.history.timepicker[1] + " 23:59:59";

        delete params.status;
        if (this.history.status != 0) {
          params["status"] = this.history.status;
        }

        params["patientId"] = this.receivePatientData.patientId;
        params["patientType"] = "1"; //this.receivePatientData.patientSource;
        params["pageSize"] = "300";
        params["pageNo"] = "1";
        let result = await historyList(params);
        if (result.code == "1") {
          let newData = result.data.map(item => {
            return {
              ...item,
              chargeStatus: item.chargeStatus.toString() //费用状态
            };
          });
          this.historyApplyList = newData;
          this.getRpRowArr();
        }
        this.rightTableLoad = false;
      } catch (error) {
        this.rightTableLoad = false;
      }
    },
    //作废申请
    backout() {
      if (this.applyList.length < 1) {
        this.$message.warning("请至少选择一条数据！");
        return;
      }

      // 是否含有已收费的电子申请
      const chargeFlag = this.applyList.some(item=> item.status !== "" &&
          item.status !== undefined && item.chargeStatus == 1 );

      if(chargeFlag){
        this.$message.warning("已缴费的电子申请不能作废!");
        return;
      }

      let applyList = this.applyList.filter(item => {
        return (
          item.status !== "" &&
          item.status !== undefined &&
          (item.chargeStatus == "0" || item.chargeStatus == "4")
        );
      });
      
      if (applyList.length < 1) {
        this.$message.warning("请至少选择一条已申请数据进行申请作废！");
        return;
      }
      if (applyList.length > 20) {
        this.$message.warning("申请作废的数据不可超过20条！");
        return;
      }
      this.$confirm("", "", {
        showClose: "false",
        confirmButtonText: "作废",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: "true",
        message:
          "<div>作废申请</div><p><span>作废后无法恢复,</span>你要继续吗？</p>",
        type: "warning"
      })
        .then(async () => {
          let id = applyList.map(item => item.orderId).join(",");
          let params = {
            id
          };
          let result = await backoutApply(params);
          if (result.code == 1) {
            this.$message({
              type: "success",
              message: "作废成功!"
            });
            await this.getHistoryApplyList();
          } else {
            this.$message.error(result.msg || "作废失败");
          }
        })
        .catch(err => {
          if (err.msg) {
            this.$message({
              type: "error",
              message: err.msg || "作废失败，请联系管理员！"
            });
          }
        });
    },
    //打印申请
    printValid(flag) {
      let applyList = [];
      if(flag == 0) {
        if (this.applyList.length < 1) {
          this.$message.warning("请选择记录再进行打印！");
          return false;
        }
        applyList = this.applyList.filter(item => {
          return item.status !== "" && item.status !== undefined && item.chargeStatus != "3";
        });
        if (applyList.length < 1) {
          this.$message.warning("请至少选择一条已申请记录进行打印！");
          return false;
        }
      } else if (flag == 1) {
        if (this.historyApplyList.length < 1) {
          this.$message.warning("当前检验申请为空！");
          return false;
        }
        applyList = this.historyApplyList.filter(item => {
          return item.status !== "" && item.status !== undefined && item.chargeStatus != "3";
        });
        if (applyList.length < 1) {
          this.$message.warning("当前检验申请为空！");
          return false;
        }
      }
      return applyList;
    },
    async printClick(flag) {
      flag == "0" ? this.printLoading0 = true : this.printLoading1 = true;
      let isFlag = this.printValid(flag);
      if (!isFlag) {
        flag == "0" ? this.printLoading0 = false : this.printLoading1 = false;
        return;
      }
      // 打印模板数据
      if (!this.checkTpl) {
      //  let {code, data} = await getPrintTpl(codes.testTpl);
      //   if(code != 1) return;
      //   this.checkTpl = data.value;
        this.checkTpl = applyPrintTpl;
      }

      let applyList = isFlag;
      let assayApplyIds = [];
      let assayVisitCodes = [];
      for(let i in applyList) {
        assayApplyIds.push(applyList[i].assayApplyId);
        assayVisitCodes.push(applyList[i].visitCode);
      }
      assayApplyIds = Array.from(new Set(assayApplyIds));
      if(assayApplyIds.length === 1) {
        await this.printFunc(assayApplyIds[0], assayVisitCodes[0], flag, false);
        return;
      }
      for(let i in assayApplyIds) {
        for(let j in applyList) {
         if(assayApplyIds[i] == applyList[j].assayApplyId) {
           await this.printFunc(assayApplyIds[i], applyList[j].visitCode, flag, true);
           break;
         }
        }
      }
    },
    async printFunc(assayApplyId, assayVisitCode, flag, isPreview) {
      try {
        let res = await applyListPrint({
          visitCode: assayVisitCode,
          applyIds: assayApplyId,
          patientId: this.receivePatientData.patientId,
          type: "essayApply"
        });
        if (res.code === 1) {
          let datas = res.data;
          let index = getPrinterList();
          let obj = {
            diagHtmlTop: "147.5pt", // 诊断模块 绝对 top 
            diagHtmlHeight: "14pt",// 诊断模块 高度 
            cHtmlLineTop: "165pt",// 诊断 与 药品中间的线的绝对 top 
            contentHtmlTop: "170pt", // 治疗医嘱模块的 绝对 top 
            // MIS_ID: "",
            // settlemetnType: "",
            // patientNum: "",
            // patientGender: "",
            // age: "",
            deptId: "",
            // outpDeptName: "",
            // doctorName: "",
            // diagTime: "",
            // relateAddress: "",
            // relateNum: "",
            // applyNum: "",
            chargpeople: "",
            visitCode: "",
            relateCode: "",
            weight: "",
            diagList: [ { diagList: [{}] }],
            MIS_ID: "",
            settlemetnType: "",
            patientNum: "",
            patientGender: "",
            age: "",
            outpDeptName: "",
            doctorName: "",
            diagTime: "",
            relateAddress: "",
            relateNum: "",
            applyNum: "",
            totalFee: ""
          };
          index = 3; // 默认3 ，便于测试
          // let {htmlStr, diagnoseStr} = complier(datas);
          // obj.contentHtml = htmlStr;
          // obj.diagnoseHtml = diagnoseStr;


          obj = {
            ...obj,
            ...datas[0],
            ...{
              hosName: (datas[0].hosName || JSON.parse(localStorage.getItem("pamars")).hosName || "") + " 检验申请单",
              orgName: datas[0].orgName || JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团"
            },
          }

          // 获取打印诊断 相关参数
          let { diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop, diagNameObj } = diagPrintModuleParams(obj.diagList[0].diagList, { maxLineNum: 4, diagHtmlTop: 149.5, lineHeight: 15 });
          
          obj = {
            ...obj,
            ...{
              diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop,diagNameObj
            }
          }

          let {htmlStr, diagnoseStr} = complier(obj, datas);
          obj.contentHtml = htmlStr;
          obj.diagnoseHtml = diagnoseStr;

          console.log(obj)
          print(index, this.checkTpl, {}, obj, isPreview);
        }
      } catch (error) {
        
      } finally {
        flag == "0" ? this.printLoading0 = false : this.printLoading1 = false;
      }
    },
    //选择表格多条数据
    selectHistoryApply(val) {
      this.applyList = val;
    }
  }
};
</script>
<style lang="scss">
.flex-column-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.apply-right-search {
  display: flex;
  align-items: center;
  padding-top: 16px;
  font-size: 0;

  .right-search-left {
    flex: 1;
    display: flex;
    align-items: center;
    width: 0;

    > div {
      margin-right: 8px;
    }
  }
}
.scrollheight {
  flex: 1;
  height: 0;
  overflow: hidden;
  overflow-y: auto;
}
.handle-btn-box {
  font-size: 0;
  padding: 16px 0;
  overflow: hidden;

  .el-button {
    height: auto;
    padding: 0;
  }

  .filter-item {
    color: $l-color-fontcolor-3 !important;
  }
}
</style>
