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
        <el-row :gutter="24">
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
              ></el-date-picker>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <LFormtTitle label="搜索药品" labelWidth="76">
              <el-input
                v-model="searchData.name"
                style="line-height: 34px"
                placeholder="拼音/五笔"
                clearable
                @keyup.native.enter="search"
              ></el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <LFormtTitle label="药品类型" labelWidth="76">
              <!-- <l-value-domain code="DrugManaType" :value.sync="searchData.cwType" /> -->
              <el-select
                class="select-right"
                v-model="searchData.cwType"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in cwTypelist"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </LFormtTitle>
          </el-col>
          <el-col :span="4">
            <el-checkbox
              v-model="searchData.isShow"
              @change="isvalid"
              style="margin: 8px 0 0 15px"
              >显示禁用</el-checkbox
            >
          </el-col>
        </el-row>
        <div class="search-btn" style="display: flex;">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="ConfirmTransfer">
            确认调入
          </el-button>
        </div>
      </div>
      <div class="TransferTable-table">
        <el-table
          row-key="id"
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
          >
          </el-table-column>
          <el-table-column type="index" width="50" label="序号">
          </el-table-column>
          <el-table-column prop="drugName" label="药品名称" width="200">
          </el-table-column>
          <el-table-column prop="spec" label="规格"> </el-table-column>
          <el-table-column prop="formCode" label="剂型">
            <template slot-scope="scope">
              <span
                tableName="hrp_form"
                :conditionMap="{ form_code: scope.row.formCode }"
                columns="form_name"
                v-tableTransform
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="药品类型">
            <template slot-scope="scope">
              <span v-if="scope.row.cwType == '1'">西药</span>
              <span v-if="scope.row.cwType == '2'">中成药</span>
              <span v-if="scope.row.cwType == '3'">中草药</span>
            </template>
          </el-table-column>
          <el-table-column label="基本药品">
            <template slot-scope="scope">
              <span
                :val="scope.row.basicType"
                code="BasicDrugType"
                v-codeTransform
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="生产厂商" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                :val="scope.row.originCode"
                code="Manufacturer"
                v-codeTransform
              ></span>
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
      <el-button @click="closeTransferTableFuc">关 闭</el-button>
    </span>
    <el-dialog
      custom-class="innerDialog"
      width="30%"
      :visible.sync="innerVisible"
      append-to-body
    >
      <div class="innerLoading">
        <div class="loading" v-if="innerLoading === 'loading'">
          <svg viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20"></circle>
          </svg>
          <div>正在调入药品字典信息</div>
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
        <el-button type="primary" @click="closeInner()">
          关 闭
        </el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { deepClone } from "@/utils/index.js";
import base from "@/api/hmm/base";

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
        name: "",
        cwType: "",
        dateObj: [],
        status: "1",
        isShow: true
      },
      //分页数据
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      cwTypelist: [
        {
          id: "1",
          name: "西药"
        },
        {
          id: "2",
          name: "中成药"
        },
        {
          id: "3",
          name: "中草药"
        }
      ],
      tableData: [],
      multipleSelection: [],
      errorList: []
    };
  },
  created() {
    this.search();
  },
  methods: {
    closeInner() {
      this.innerVisible = false;
    },
    ConfirmTransfer() {
      this.innerVisible = true;
      this.innerLoading = "loading";
      console.log(`this.multipleSelection`, this.multipleSelection);
      let tempList = [];
      this.multipleSelection.forEach(el => {
        tempList.push(el.id);
      });
      console.log(`tempList`, tempList);
      base
        .importDrug(tempList)
        .then(res => {
          if (res.code === 1) {
            this.innerLoading = "success";
            console.log(`res`, res);
            this.errorList = res.data;
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    clearSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    search() {
      this.getDrugList();
    },
    getDrugList() {
      this.tlm_isLoading = true;
      base
        .getGroupDrugList({
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          drugName: this.searchData.name,
          cwType: this.searchData.cwType,
          status: this.searchData.status,
          classCode: this.searchData.classCode
        })
        .then(res => {
          if (res.code === 1) {
            this.pageParams.total = res.total;
            this.tableData = res.data;
            // this.setCurrent(
            //   this.drugData.filter(item => item.id === this.drugDataId)[0] || {}
            // );
          }
          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.$message.error(err);
          this.tlm_isLoading = false;
        });
    },
    reset() {},
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
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
    //仅显示有效
    isvalid(val) {
      this.searchData.isShow = val;
      if (this.searchData.isShow == true) {
        this.searchData.status = "1";
        this.search();
      }
      if (this.searchData.isShow == false) {
        this.searchData.status = "";
        this.search();
      }
    },
    dateObjFun() {
      if (!this.searchData.dateObj) {
        this.searchData.dateObj = [];
      }
      console.log(this.searchData.dateObj);
    },
    changeSize(val) {
      this.pageParams.pageSize = val;
      this.getDrugList();
    },
    changePage(val) {
      this.pageParams.pageNo = val;
      this.getDrugList();
    }
  }
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
