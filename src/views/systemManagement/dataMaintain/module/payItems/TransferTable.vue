<template>
  <el-dialog
    class="abow_dialog"
    v-bind="$attrs"
    v-on="$listeners"
    :append-to-body="true"
    top="5vh"
    @before-close="closeTransferTableFuc"
  >
    <div class="TransferTable">
      <div class="TransferTable-form">
        <el-row :gutter="8">
          <el-col :span="8">
            <LFormtTitle label="更新日期" labelWidth="62">
              <el-date-picker
                v-model="searchData.dateObj"
                type="datetimerange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="dateObjFun"
                clearable
              ></el-date-picker>
            </LFormtTitle>
          </el-col>
          <el-col :span="5">
            <l-formt-title label="财务分类码">
              <l-value-domain
                :value.sync="searchData.finClassCode"
                remoteUrl="/finance-pub/classCode/getClassCodePO?pageSize=1000"
                remoteShowKey="classCodeName"
                remoteValueKey="finClassCode"
                clearable
                placeholder="请选择"
              ></l-value-domain>
            </l-formt-title>
          </el-col>
          <el-col :span="5">
            <l-formt-title label="收费项目名称">
              <el-input
                v-model="searchData.chargeItemName"
                clearable
                placeholder="名称/拼音/五笔"
                @keyup.enter="search"
              ></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="5">
            <l-formt-title label="状态标识">
              <el-select
                v-model="searchData.recordStatus"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in recordStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
        </el-row>
        <div class="search-btn" style="display: flex">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="ConfirmTransfer">
            确认调入
          </el-button>
        </div>
      </div>
      <div class="TransferTable-table">
        <el-table
          row-key="chargeItemId"
          :height="mainHeight"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="tlm_isLoading"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
            :selectable="selectable"
          >
          </el-table-column>
          <el-table-column
            key="no"
            type="index"
            label="序号"
            width="80"
            fixed="left"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            v-for="item in tableParams"
            :key="item.prop"
            sortable
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'center'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="item.prop === 'outpEnable'">{{
                enableShow[scope.row[item.prop]]
              }}</span>
              <span v-else-if="item.prop === 'inpEnable'">{{
                enableShow[scope.row[item.prop]]
              }}</span>
              <template v-else-if="item.prop === 'miControlLevel'">
                <span
                  tableName="fin_dictionary"
                  :conditionMap="{
                    dictionary_value: scope.row[item.prop] || '',
                    cata_code: 'F0003',
                  }"
                  columns="dictionary_name"
                  v-tableTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'medicalRecordClassCode'">
                <span
                  tableName="fin_dictionary"
                  :conditionMap="{
                    dictionary_code: scope.row[item.prop] || '',
                    cata_code: 'F0007',
                  }"
                  columns="dictionary_name"
                  v-tableTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'finClassCode'">
                <span
                  tableName="fin_class_code"
                  :conditionMap="{
                    fin_class_code: scope.row[item.prop] || '',
                  }"
                  columns="class_code_name"
                  v-tableTransform
                ></span>
              </template>
              <span v-else-if="item.prop === 'recordStatus'">{{
                recordStatusShow[scope.row[item.prop]]
              }}</span>
              <template v-else-if="item.prop === 'specialMedicalMaterialFlag'">
                <span v-if="scope.row[item.prop] == 1">是</span>
                <span v-else-if="scope.row[item.prop] == 0">否</span>
              </template>
              <template v-else-if="item.prop === 'show'">
                <span v-if="scope.row[item.prop] == 1">住院可用</span>
                <span v-else-if="scope.row[item.prop] == 0">门诊可用</span>
              </template>
              <template v-else-if="item.prop === 'spec'">{{
                scope.row[item.prop]
              }}</template>
              <template v-else-if="item.prop === 'drugBasedCode'">{{
                scope.row[item.prop]
              }}</template>
              <template v-else-if="item.prop === 'orginCode'">
                <span
                  :val="scope.row[item.prop]"
                  code="Manufacturer"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'dosageTypeId'">
                <span
                  :val="scope.row[item.prop]"
                  code="ClassificationCodeOfChinese"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'chargePrice'">
                {{ Number(scope.row[item.prop] || 0).toFixed(4) }}
              </template>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            background
            @size-change="changeSize"
            @current-change="changePage"
            :current-page.sync="pageParams.pageNo"
            :page-sizes="[20, 40, 100, 200]"
            :page-size="pageParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeTransferTableFuc">关 闭</el-button>
    </span>
    <el-dialog
      custom-class="innerDialog"
      width="30%"
      :visible.sync="innerVisible"
      append-to-body
    >
      <div class="innerLoading" v-if="innerVisible">
        <div class="loading" v-if="innerLoading === 'loading'">
          <svg viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20"></circle>
          </svg>
          <div>正在调入收费项目信息</div>
        </div>
        <div v-if="innerLoading === 'success'">
          <svg
            t="1630377846149"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="648"
            width="52.5"
            height="52.5"
          >
            <path
              d="M512 0C228.430769 0 0 228.430769 0 512s228.430769 512 512 512 512-228.430769 512-512S795.569231 0 512 0z m256 413.538462l-271.753846 271.753846c-7.876923 7.876923-19.692308 11.815385-31.507692 11.815384-11.815385 0-23.630769-3.938462-31.507693-11.815384l-169.353846-169.353846c-15.753846-15.753846-15.753846-47.261538 0-63.015385 15.753846-15.753846 47.261538-15.753846 63.015385 0l137.846154 137.846154 240.246153-240.246154c15.753846-15.753846 47.261538-15.753846 63.015385 0 19.692308 15.753846 19.692308 47.261538 0 63.015385z"
              fill="#2B4583"
              p-id="649"
            ></path>
          </svg>
          <div>药品字典信息调入成功！</div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        v-if="innerLoading === 'success'"
      >
        <el-button type="primary" @click="closeInner()"> 关 闭 </el-button>
      </span>
    </el-dialog></el-dialog
  >
</template>
  <script>
import {
  getGroupChargeItemList,
  importChargeItem,
} from "@/api/systemManagement/dataMaintain/payItemsGroup.js";

export default {
  name: "TransferTable",
  props: {},
  data() {
    return {
      innerLoading: "loading",
      mainHeight: document.body.offsetHeight - 340,
      innerVisible: false,
      tlm_isLoading: false,
      searchData: {
        finClassCode: "",
        chargeItemName: "",
        dateObj: [],
        recordStatus: "1",
      },
      //分页数据
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      tableData: [],
      multipleSelection: [],
      enableShow: {
        0: "否",
        1: "是",
      },
      recordStatusShow: {
        0: "暂停",
        1: "在用",
      },
      recordStatusOptions: [
        {
          label: "暂停",
          value: "0",
        },
        {
          label: "在用",
          value: "1",
        },
      ],
      tableParams: [
        {
          prop: "chargeItemName",
          label: "收费项目名称",
          width: 150,
          fixed: "left",
        },
        {
          prop: "chargeItemCode",
          label: "收费项目编码",
          width: 150,
        },
        {
          prop: "finClassCode",
          label: "财务分类码",
          width: 150,
        },
        {
          prop: "provincialLevelCode",
          label: "省级编码",
          width: 140,
        },
        {
          prop: "medicalRecordClassCode",
          label: "病案分类码",
          width: 150,
        },
        {
          prop: "namePy",
          label: "拼音",
          width: 100,
        },
        {
          prop: "nameWb",
          label: "五笔",
          width: 100,
        },
        {
          prop: "chargeUnit",
          label: "收费单位",
          width: 140,
        },
        {
          prop: "chargePrice",
          label: "单价",
          width: 100,
        },
        {
          prop: "miControlLevel",
          label: "医保控制级别",
          width: 150,
        },
        {
          prop: "outpEnable",
          label: "门诊可用",
          width: 120,
        },
        {
          prop: "inpEnable",
          label: "住院可用",
          width: 120,
        },
        {
          prop: "recordStatus",
          label: "状态标识",
          width: 120,
        },
        {
          prop: "spec",
          label: "规格",
          width: 100,
        },
        {
          prop: "drugBasedCode",
          label: "本位码",
          width: 120,
        },
        {
          prop: "orginCode",
          label: "产地",
          width: 100,
        },
        {
          prop: "dosageTypeId",
          label: "剂型",
          width: 100,
        },
        {
          prop: "specialMedicalMaterialFlag",
          label: "特殊医用材料标志",
          width: 200,
        },
        {
          prop: "show",
          label: "隐藏",
          width: 100,
        },
      ],
    };
  },
  created() {
    this.search();
  },
  methods: {
    selectable(row, index) {
      // 禁用某一行
      return row.recordStatus === "1";
    },
    closeInner() {
      this.innerVisible = false;
    },
    ConfirmTransfer() {
      if (this.multipleSelection.length === 0) {
        this.$message.error("请先选中需要调入的项目");
        return;
      }
      this.innerVisible = true;
      this.innerLoading = "loading";
      let tempList = [];
      this.multipleSelection.forEach((el) => {
        tempList.push(el.chargeItemId);
      });
      importChargeItem(tempList)
        .then((res) => {
          if (res.code === 1) {
            this.innerLoading = "success";
            this.closeTransferTableFuc();
          } else {
            this.innerLoading = "error";
            this.innerVisible = false;
          }
        })
        .catch((err) => {
          this.innerLoading = "error";
          this.innerVisible = false;
        });
    },
    clearSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    search() {
      this.pageParams.pageNo = 1;
      this.getGroupChargeItemList();
    },
    getGroupChargeItemList() {
      this.tlm_isLoading = true;
      let params = {
        ...this.searchData,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        effectTime: this.searchData.dateObj ? this.searchData.dateObj[0] : "",
        invalidTime: this.searchData.dateObj ? this.searchData.dateObj[1] : "",
      };
      delete params.dateObj;
      getGroupChargeItemList(params)
        .then((res) => {
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tableData = res.data;
          } else {
            this.$message.error(res.msg || "查询失败");
          }
          this.tlm_isLoading = false;
        })
        .catch((err) => {
          this.tlm_isLoading = false;
        });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    closeTransferTableFuc() {
      this.$emit("closeTransferTableFuc");
    },
    dateObjFun() {
      if (!this.searchData.dateObj) {
        this.searchData.dateObj = [];
      }
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.getGroupChargeItemList();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.getGroupChargeItemList();
    },
  },
};
</script>
<style lang="scss">
.innerDialog {
  .el-dialog__header {
    display: none !important;
  }
  .el-dialog__footer {
    padding: 5px !important;
    font-size: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
  }
}
</style>
<style lang="scss" scoped>
.innerLoading {
  padding: 20px;
  text-align: center;
  svg {
    width: 3.75em;
  }
  .loading {
    svg {
      width: 3.75em;
      transform-origin: center;
      animation: rotate 2s linear infinite;
    }

    circle {
      fill: none;
      stroke: #2b4583;
      stroke-width: 2;
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }

    @keyframes rotate {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 200;
        stroke-dashoffset: -35px;
      }
      100% {
        stroke-dashoffset: -125px;
      }
    }
  }
}
.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
  .el-dialog {
    margin: 0 auto !important;
    height: 90%;
    overflow: hidden;
    .el-dialog__body {
      position: absolute;
      left: 0;
      top: 54px;
      bottom: 0;
      right: 0;
      padding: 0;
      z-index: 1;
      overflow: hidden;
      overflow-y: auto;
    }
  }
}
.TransferTable {
  padding: 6px;
  .page {
    margin-top: 7px;
    text-align: right;

    .el-pagination {
      padding: 0;

      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
    }
  }
  .dialog-content {
    padding: 10px;
  }

  .TransferTable-form {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    .demo-ruleForm {
      width: 400px;
    }
    .button-cont {
      margin-top: 6px;
    }
  }
  .TransferTable-table {
    height: 640px;
    margin-top: 6px;
  }
}
</style>
