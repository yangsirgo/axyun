<template>
  <div class="drugList width100 height100 position-relative">
    <el-card class="card-cont width100 height100">
      <div class="search">
        <div class="search-input">
          <el-row :gutter="24">
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
            <el-col :span="6">
              <LFormtTitle label="分类码" labelWidth="62">
                <l-value-domain
                  class="select-right"
                  clearable
                  code="DrugTypeCode"
                  type="s"
                  :value.sync="searchData.classCode"
                />
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <el-checkbox
                v-model="searchData.isShow"
                @change="isvalid"
                style="margin: 8px 0 0 15px"
                >仅显示有效药品</el-checkbox
              >
            </el-col>
          </el-row>
        </div>
        <div class="search-btn">
          <el-button type="primary" plain @click="download">
            导出
          </el-button>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="reset">重置</el-button>
          <!-- <el-button
            type="primary"
            plain
            @click="newadd"
            v-hotKey="{ func: 'func_add1' }"
          >
            新增
          </el-button> -->
          <el-button type="primary" plain @click="TransferIn">
            调入
          </el-button>
        </div>
      </div>
      <div class="drug-list-cont">
        <!-- @header-dragend="headerDragend" -->
        <el-table
          ref="singleTable"
          :data="drugData"
          border
          width="100%"
          height="100%"
          highlight-current-row
          @current-change="rowClick"
          @header-dragend="search"
          v-loading="tlm_isLoading"
          element-loading-text="加载中..."
        >
          <el-table-column
            sortable
            v-for="(item, index) in drugParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :fixed="item.fixed"
            header-align
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'originCode'">
                <span
                  :val="scope.row.originCode"
                  code="Manufacturer"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'originIdentificationCode'">
                <span
                  :val="scope.row.originIdentificationCode"
                  code="DrugManufacturerFlag"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'cwType'">
                <span v-if="scope.row.cwType == '1'">西药</span>
                <span v-if="scope.row.cwType == '2'">中成药</span>
                <span v-if="scope.row.cwType == '3'">中草药</span>
                <!-- <span :val="scope.row.cwType" code="DrugManaType" v-codeTransform></span> -->
              </template>
              <template v-else-if="item.prop == 'supplierCode'">
                <span
                  :val="scope.row.supplierCode"
                  code="DrugSupplier"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'price'">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
              <template v-else-if="item.prop == 'manageType'">
                <span
                  :val="scope.row.manageType"
                  code="DrugManaType"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'formCode'">
                <span
                  tableName="hrp_form"
                  :conditionMap="{ form_code: scope.row.formCode }"
                  columns="form_name"
                  v-tableTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'controlLevel'">
                <span
                  :val="scope.row.controlLevel"
                  code="DrugReimbursementType"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'basicType'">
                <span
                  :val="scope.row.basicType"
                  code="BasicDrugType"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'classCode'">
                <span
                  :val="scope.row.classCode"
                  code="DrugTypeCode"
                  v-codeTransform
                ></span>
              </template>

              <template v-else-if="item.prop == 'dosageUnit'">
                <span
                  :val="scope.row.dosageUnit"
                  code="DrugDoseUnit"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'drugUnit'">
                <span
                  :val="scope.row.packUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'packUnit'">
                <span
                  :val="scope.row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>

              <template v-else-if="item.prop == 'halfUseFlg'">
                <span v-if="scope.row.halfUseFlg == false">否</span>
                <span v-if="scope.row.halfUseFlg == true">是</span>
              </template>
              <template v-else-if="item.prop == 'unitSaleFlg'">
                <span v-if="scope.row.unitSaleFlg == false">否</span>
                <span v-if="scope.row.unitSaleFlg == true">是</span>
              </template>
              <template v-else-if="item.prop == 'status'">
                <span v-if="scope.row.status == '0'">暂停</span>
                <span v-if="scope.row.status == '1'">正常</span>
              </template>
              <template v-else>
                <span class="overflow-point">{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          @size-change="changeSize"
          @current-change="changePage"
          :current-page.sync="pageParams.pageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </el-card>
    <TransferTable
      v-if="dialogTransferVisible"
      title="药品信息调入"
      width="1200px"
      :visible.sync="dialogTransferVisible"
      @closeTransferTableFuc="closeTransferTableFuc"
    />
  </div>
</template>

<script>
import base from "@/api/hmm/base";
import formatNum from "@/utils/formatPrice.js";
import TransferTable from "./TransferTable";

export default {
  name: "drugList",
  props: ["refreshList"],
  components: {
    TransferTable
  },
  data() {
    return {
      dialogTransferVisible: false,
      //搜索条件
      searchData: {
        name: "",
        cwType: "",
        classCode: "",
        status: "1",
        isShow: true
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
      ], //药品类型
      //表头数据
      drugParams: [
        {
          prop: "drugCode",
          label: "药品编码",
          align: "left",
          width: "120",
          fixed: "left"
        },
        {
          prop: "drugName",
          label: "药品名称",
          align: "left",
          width: "213",
          fixed: "left"
        },
        {
          prop: "spec",
          label: "规格",
          align: "left",
          width: "150",
          fixed: false
        },
        {
          prop: "price",
          label: "售价(元)",
          align: "right",
          width: "120",
          fixed: false
        },

        {
          prop: "phoneticCode",
          label: "拼音码",
          align: "left",
          width: "120",
          fixed: false
        },
      /*  {
          prop: "fiveStrokeCode",
          label: "五笔码",
          align: "left",
          width: "70",
          fixed: false
        },*/
        {
          prop: "cwType",
          label: "药品类型",
          align: "left",
          width: "110",
          fixed: false
        },
      /*  {
          prop: "classCode",
          label: "分类码",
          align: "left",
          width: "120",
          fixed: false
        },*/
        {
          prop: "manageType",
          label: "管理类型",
          align: "left",
          width: "110",
          fixed: false
        },
        {
          prop: "formCode",
          label: "剂型",
          align: "left",
          width: "90",
          fixed: false
        },

        {
          prop: "dosageValue",
          label: "剂量值",
          align: "left",
          width: "100",
          fixed: false
        },
        {
          prop: "dosageUnit",
          label: "剂量单位",
          align: "left",
          width: "110",
          fixed: false
        },
        {
          prop: "packQuantity",
          label: "包装量",
          align: "left",
          width: "100",
          fixed: false
        },
        {
          prop: "drugUnit",
          label: "单位",
          align: "left",
          width: "90",
          fixed: false
        },
        {
          prop: "packUnit",
          label: "包装单位",
          align: "left",
          width: "110",
          fixed: false
        },
        {
          prop: "originCode",
          label: "生产厂商",
          align: "left",
          width: "240",
          fixed: false
        },
        {
          prop: "originIdentificationCode",
          label: "生产厂商标识",
          align: "left",
          width: "180",
          fixed: false
        },
        {
          prop: "approveNum",
          label: "国药准字号",
          align: "left",
          width: "180",
          fixed: false
        },
        {
          prop: "controlLevel",
          label: "控制级别",
          align: "left",
          width: "110",
          fixed: false
        },
        {
          prop: "basicType",
          label: "基本类型",
          align: "left",
          width: "160",
          fixed: false
        },
        {
          prop: "halfUseFlg",
          label: "是否可剥半",
          align: "left",
          width: "140",
          fixed: false
        },
        {
          prop: "unitSaleFlg",
          label: "是否可拆零",
          align: "left",
          width: "140",
          fixed: false
        },
        {
          prop: "status",
          label: "启用状态",
          align: "left",
          width: "110",
          fixed: false
        },
        {
          prop: "createdByName",
          label: "创建人",
          align: "left",
          width: "90",
          fixed: false
        },
        {
          prop: "createdAt",
          label: "创建时间",
          align: "left",
          width: "180",
          fixed: false
        },
        {
          prop: "updatedByName",
          label: "修改人",
          align: "left",
          width: "90",
          fixed: false
        },
        {
          prop: "updatedAt",
          label: "修改时间",
          align: "left",
          width: "180",
          fixed: false
        }
      ],
      //表格数据
      drugData: [],
      drugDataId: 0,
      //分页数据
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },

      tlm_isLoading: false
    };
  },
  mounted() {
    this.search();
  },
  watch: {
    refreshList() {
      this.search();
    }
  },
  methods: {

    async download() {
      try {
        let param = {
          drugName: this.searchData.name,
          cwType: this.searchData.cwType,
          status: this.searchData.status,
          classCode: this.searchData.classCode
        }
        let res = await base
          .exportDrug(param);
        var blob = res;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          var parent = document.getElementsByClassName("drugList")[0];
          var a = document.createElement('a');
          a.setAttribute("id","billHref");
          a.download = '药品信息.xls';
          a.href = e.target.result;
          parent.appendChild(a);
          let aDom = document.getElementById("billHref");
          aDom.click();
          parent.removeChild(aDom);
        }
      } catch (error) {}
    },
    closeTransferTableFuc() {
      this.dialogTransferVisible = false;
      this.search();
    },
    TransferIn() {
      this.dialogTransferVisible = true;
    },
    formatNum(num) {
      return formatNum(num);
    },
    // 获取左侧是否有新建数据
    drugFormDeailStyleFun() {
      let drugFormDeailStyle = window.sessionStorage.getItem(
        "drugFormDeailStyle"
      );
      if (drugFormDeailStyle == "true") {
        drugFormDeailStyle = true;
      } else {
        drugFormDeailStyle = false;
      }
      return drugFormDeailStyle;
    },
    //获取药品表格数据
    getDrugList() {
      this.tlm_isLoading = true;
      base
        .getDrugList({
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
            this.drugData = res.data;
            this.setCurrent(
              this.drugData.filter(item => item.id === this.drugDataId)[0] || {}
            );
          }
          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.$message.error(err);
          this.tlm_isLoading = false;
        });
    },
    //高亮首行
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    newadd() {
      if (this.drugFormDeailStyleFun()) {
        this.$confirm("还有数据未保存是否继续？？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            window.sessionStorage.setItem("drugFormDeailStyle", false);
            this.$refs.singleTable.setCurrentRow();
            this.$emit("newadd");
          })
          .catch(action => {
            // 取消
            console.log("取消");
            return false;
          });
      } else {
        this.$refs.singleTable.setCurrentRow();
        this.$emit("newadd");
      }
    },
    //搜索
    search() {
      if (this.drugFormDeailStyleFun()) {
        this.$confirm("还有数据未保存是否继续？？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            window.sessionStorage.setItem("drugFormDeailStyle", false);
            this.pageParams.pageNo = 1;
            this.pageParams.total = 0;
            this.searchData.status = this.searchData.status;
            this.getDrugList();
            this.$emit("getIsDrug", this.drugData[0]);
          })
          .catch(action => {
            // 取消
            console.log("取消");
            return false;
          });
      } else {
        this.pageParams.pageNo = 1;
        this.pageParams.total = 0;
        this.searchData.status = this.searchData.status;
        this.getDrugList();
        this.$emit("getIsDrug", this.drugData[0]);
      }
    },
    //仅显示有效
    isvalid(val) {
      if (this.drugFormDeailStyleFun()) {
        this.$confirm("还有数据未保存是否继续？？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            window.sessionStorage.setItem("drugFormDeailStyle", false);
            this.searchData.isShow = val;
            if (this.searchData.isShow == true) {
              this.searchData.status = "1";
              this.search();
            }
            if (this.searchData.isShow == false) {
              this.searchData.status = "";
              this.search();
            }
          })
          .catch(action => {
            // 取消
            this.searchData.isShow = !val;
            console.log("取消");
            return false;
          });
      } else {
        this.searchData.isShow = val;
        if (this.searchData.isShow == true) {
          this.searchData.status = "1";
          this.search();
        }
        if (this.searchData.isShow == false) {
          this.searchData.status = "";
          this.search();
        }
      }
    },
    //重置
    reset() {
      this.searchData.name = "";
      this.searchData.cwType = "";
      this.searchData.classCode = "";
      this.searchData.isShow = true;
      this.searchData.status = "1";
      this.search();
    },
    //点击某一行药品
    rowClick(row, i) {
      if (this.drugFormDeailStyleFun()) {
        this.$confirm("还有数据未保存是否继续？？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.drugDataId = row.id;
            window.sessionStorage.setItem("drugFormDeailStyle", false);
            this.$emit("getIsDrug", row);
          })
          .catch(action => {
            // 取消
            console.log("取消");
            return false;
          });
      } else {
        if (!row) return;
        this.drugDataId = Array.isArray(row) ? row[0].id : row.id ? row.id : "";
        this.$emit("getIsDrug", row);
      }
    },
    changeSize(val) {
      if (this.drugFormDeailStyleFun()) {
        this.$confirm("还有数据未保存是否继续？？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            window.sessionStorage.setItem("drugFormDeailStyle", false);
            this.pageParams.pageSize = val;
            this.getDrugList();
          })
          .catch(action => {
            // 取消
            console.log("取消");
            return false;
          });
      } else {
        this.pageParams.pageSize = val;
        this.getDrugList();
      }
    },
    changePage(val) {
      if (this.drugFormDeailStyleFun()) {
        this.$confirm("还有数据未保存是否继续？？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            window.sessionStorage.setItem("drugFormDeailStyle", false);
            this.pageParams.pageNo = val;
            this.getDrugList();
          })
          .catch(action => {
            // 取消
            this.pageParams.pageNo = null;
            this.pageParams.pageNo = 1;
            console.log("取消");
            return false;
          });
      } else {
        this.pageParams.pageNo = val;
        this.getDrugList();
      }
    },
    headerDragend() {
      this.$refs.singleTable.doLayout();
    }
  }
};
</script>

<style scoped lang="scss">
.drugList {
  .card-cont {
    padding: 20px;

    .search {
      // display: flex;

      .search-input {
        // flex: 1;
        // overflow: hidden;
        // margin-right: 10px;
      }

      .search-btn {
        margin-top: 10px;
        text-align: right;
      }
    }

    .drug-list-cont {
      height: calc(100% - 140px);
      margin: 20px 0;
    }
  }

  .page {
    text-align: right;

    .el-pagination {
      padding: 0;

      /deep/ .el-pagination__editor.el-input .el-input__inner {
        height: 100% !important;
      }
    }
  }
}

.select-right {
  /deep/ .el-input .el-input__inner {
    padding-right: 30px;
  }
}
</style>
