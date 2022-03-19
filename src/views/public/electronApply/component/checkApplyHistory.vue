<template>
  <div class="flex-column-box">
    <div class="apply-right-search">
      <div class="right-search-left">
        <el-date-picker
          clearable
          style="width: 220px"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="history.timepicker"
        ></el-date-picker>
        <el-select style="width: 130px" v-model="history.status">
          <el-option
            v-for="item in history.statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button @click="getHistoryApplyList" type="primary" size="small"
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
        type="text"
        @click="backout()"
        >&nbsp;作废</el-button
      >
      <el-button
        class="filter-item iconfont icondayin"
        type="text"
        v-hotKey="{ func: 'func_print' }"
        @click="printClick(0)"
        :loading="printLoading0"
        >&nbsp;打印</el-button
      >
      <el-button
        class="filter-item iconfont icondayin"
        type="text"
        v-hotKey="{ func: 'func_print' }"
        @click="printClick(1)"
        :loading="printLoading1"
        >&nbsp;全部打印</el-button
      >
    </div>
    <div class="scrollheight">
      <el-table
        ref="rigTable"
        row-key="orderId"
        border
        height="100%"
        highlight-current-row
        v-loading="rightTableLoad"
        v-hotKey="{
          func: ['table_row', 'table_checkbox', 'table_choose'],
          deClass: 'el-table__row',
          curClass: 'current-row',
        }"
        :data="historyApplyList"
        :row-class-name="rowStyleCls"
        :span-method="objectSpanMethod"
        @selection-change="selectHistoryApply"
      >
        <el-table-column
          width="55"
          type="selection"
          align="center"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column
          header-align="left"
          align="left"
          v-for="(item, index) in selectedParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'sampleTypeCode'">
              <span
                code="InspectSpecimen"
                v-codeTransform
                :val="scope.row.sampleTypeCode"
              ></span>
            </template>
            <template v-else-if="item.prop === 'isUrgent'">
              <el-tag
                type="danger"
                disable-transitions
                size="medium"
                v-if="scope.row.isUrgent"
                >加急</el-tag
              >
              <span v-else></span>
            </template>
            <template v-else-if="item.prop === 'bodyPartsCode'">
              <span
                code="BodyPosition"
                v-codeTransform
                :val="scope.row.bodyPartsCode"
              ></span>
            </template>
            <template v-else-if="item.prop === 'checkMethod'">
              <span
                code="InspectMethod"
                v-codeTransform
                :val="scope.row.checkMethod"
              ></span>
            </template>
            <template v-else-if="item.prop === 'status'">
              <span class="state-color">
                <!-- <span v-if="scope.row.status">{{
                  history.stageInvert[scope.row.status]
                }}</span>
                <span v-else>全部</span> -->
                  <applStatusShow 
                    aType="检查"
                    :patientObj="receivePatientData" 
                    :aStatus="scope.row.status"></applStatusShow>
              </span>
            </template>
            <template v-else-if="item.prop === 'chargeStatus'">
              <span
                code="ChargeStatus"
                v-codeTransform
                :val="scope.row.chargeStatus || ''"
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

import { onPreviewData } from "@/utils/print";
import { historyListExam } from "@/api/electronApply/chargeTemplate";
import {
  backoutApply,
  backoutApplyExam,
  applyListPrint
} from "@/api/electronApply/inspectionApply";
import applStatusShow from "@/views/public/electronApply/component/applStatusShow.vue";
import { print, getPrinterList } from "@/utils/print_new"
import codes from "@/printTemplete/code.js";
import { complier, checkTplNew } from "@/printTemplete/module/checkApplyLodopTpl.js"
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
          width: 80,
        },
        {
          prop: "bodyPartsCode",
          label: "部位",
          width: 120
        },
        {
          prop: "isUrgent",
          label: "加急",
          width: 100
        },
        {
          prop: "checkMethod",
          label: "检查方法",
          width: 80
        },
        {
          prop: "applyTypeName",
          label: "检查类型",
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
            id: "11",
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
      checkTpl: ""//打印模板数据
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
    components:{
    applStatusShow
  },
  /**
   * printClick (打印按钮执行逻辑)
   * 1.处理数据并调用封装的打印方法
   *
   * rowStyleCls 处理 row 的样式（免费申请显示绿色）
   *
   * getHistoryApplyList （获取历史申请列表并处理逻辑）
   *
   * backout （作废按钮逻辑）
   * 1.对数据进行校验
   * 2.调用confirm 弹窗
   * 3.调用接口执行作废逻辑
   *
   * selectHistoryApply （记录表格多条选中数据）
   */
  methods: {
    concatTableData(data) {
      this.selectedList = this.selectedList.concat(data);
    },
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
      let tableData = this.historyApplyList;
      this.rpPosition = 0;
      this.RpRowArr = [];
      tableData.forEach((item, index) => {
        item.index = index;
        if (index === 0) {
          this.RpRowArr.push(1);
        } else {
          if (item["applyId"] === tableData[index - 1]["applyId"]) {
            this.RpRowArr[this.rpPosition] += 1;
            this.RpRowArr.push(0);
          } else {
            this.RpRowArr.push(1);
            this.rpPosition = index;
          }
        }
      });
    },
    //处理 row 的样式（免费申请显示绿色）
    rowStyleCls(a) {
      return {
        freeRpRow: a.row.freeFlag !== "" && a.row.freeFlag !== undefined
      };
    },
    //查询已申请单
    async getHistoryApplyList() {
      const patientId = this.receivePatientData.patientId;
      this.historyApplyList = [];
      this.applyList = [];
      this.$refs.rigTable && this.$refs.rigTable.clearSelection();

      if (!patientId) {
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

        params["patientId"] = patientId;
        params["patientType"] = "1"; //this.receivePatientData.patientSource;
        params["pageSize"] = "300";
        params["pageNo"] = "1";
        let { code, data } = await historyListExam(params);
        if (code == "1") {
          let newData = data.map(item => {
            return {
              ...item,
              chargeStatus: item.chargeStatus.toString() //费用状态
            };
          });
          this.historyApplyList = newData;
          this.getRpRowArr();
        }
      } catch (error) {
        console.log(error);
      } finally {
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
        /* if (item.chargeStatus !== "0" && item.chargeStatus !== "4") {
          // 已收费的医嘱不可作废
          this.$message.warning("只有未收费与免费的申请可作废！");
        } */
        return (
          item.status !== "" &&
          item.status !== undefined &&
          (item.chargeStatus == "0" || item.chargeStatus == "4")
        );
      });

      const applyListLength = applyList.length;

      if (applyListLength < 1) {
        this.$message.warning("请至少选择一条已申请数据进行申请作废！");
        return;
      }

      if (applyListLength > 20) {
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
          let { code, msg } = await backoutApplyExam(params);
          if (code == 1) {
            this.$message({
              type: "success",
              message: "作废成功!"
            });
            await this.getHistoryApplyList();
          } else {
            this.$message.error(msg || "作废失败");
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
          this.$message.warning("当前检查申请为空！");
          return false;
        }
        applyList = this.historyApplyList.filter(item => {
          return item.status !== "" && item.status !== undefined && item.chargeStatus != "3";
        });
        if (applyList.length < 1) {
          this.$message.warning("当前检查申请为空！");
          return false;
        }
      }
      return applyList;
    },
    //打印申请
    async printClick(flag) {
      flag == "0" ? this.printLoading0 = true : this.printLoading1 = true;
      let isFlag = this.printValid(flag);
      if (!isFlag) {
        flag == "0" ? this.printLoading0 = false : this.printLoading1 = false;
        return;
      }
      

      // 打印模板数据
      if (!this.checkTpl) {
        // let { code, data } = await getPrintTpl(codes.checkTpl);
        // if (code != 1) return;
        // this.checkTpl = data.value;
        this.checkTpl = checkTplNew;
      }

      let applyList = isFlag;
      let assayApplyIds = [];
      let assayVisitCodes = [];
      for(let i in applyList) {
        assayApplyIds.push(applyList[i].applyId);
        assayVisitCodes.push(applyList[i].visitCode)
      }
      assayApplyIds = Array.from(new Set(assayApplyIds));
      if(assayApplyIds.length === 1) {
        await this.printFunc(assayApplyIds[0], assayVisitCodes[0], flag, false);
        return;
      }
      for(let i in assayApplyIds) {
        for(let j in applyList) {
          if(assayApplyIds[i] == applyList[j].applyId) {
            await this.printFunc(assayApplyIds[i], applyList[j].visitCode, flag, true);
          }
        }
      }
    },
    async printFunc(applyId, assayVisitCode, flag, isPreview) {

      try {
      let data = {};
      let { code, data: list } = await applyListPrint({
        visitCode: assayVisitCode,
        applyIds: applyId,
        patientId: this.receivePatientData.patientId,
        type: "examApply"
      });
      if (code === 1) {
        
        data = list;
        // onPreviewData(data, "检查申请单罗");
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
          applyNum: ""
        };
        index = 3; // 默认3 ，便于测试
        // let {htmlStr, diagnoseStr} = complier(data);
        // obj.contentHtml = htmlStr;
        // obj.diagnoseHtml = diagnoseStr;
        obj = {
          ...obj,
          ...data[0],
          ...{
            hosName: (data[0].hosName || JSON.parse(localStorage.getItem("pamars")).hosName || "") + " 检查申请单",
            orgName: data[0].orgName || JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团"
          },
        }

          // 获取打印诊断 相关参数
          let { diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop, diagNameObj } = diagPrintModuleParams(obj.diagList[0].diagList, { maxLineNum: 4, diagHtmlTop: 147.5, lineHeight: 15 });
          
          obj = {
            ...obj,
            ...{
              diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop,diagNameObj
            }
          }

          let {htmlStr, diagnoseStr} = complier(obj, [], data);
          obj.contentHtml = htmlStr;
          obj.diagnoseHtml = diagnoseStr;

        print(index, this.checkTpl, {}, obj, isPreview);
      }
      } catch (error) {
        console.log(error);
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
<style lang="scss" scope>
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
/deep/.el-table .freeRpRow {
  color: green;
}
</style>
