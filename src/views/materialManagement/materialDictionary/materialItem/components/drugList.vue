<template>
  <div class="drugList width100 height100 position-relative">
    <el-card class="card-cont width100 height100">
      <div class="search">
        <div class="search-input">
          <el-row :gutter="24">
            <el-col :span="6">
              <LFormtTitle label="类型" labelWidth="62">
                <l-value-domain
                  class="select-right"
                  clearable
                  code="goodsType"
                  :value.sync="searchData.goodsType"
                />
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="搜索项目" labelWidth="76">
                <el-input
                  v-model="searchData.keyword"
                  style="line-height: 34px"
                  placeholder="拼音码/名称"
                  clearable
                  @keyup.native.enter="search"
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <el-checkbox
                v-model="searchData.isShow"
                @change="isvalid"
                style="margin: 8px 0 0 15px"
              >仅显示有效物资</el-checkbox
              >
            </el-col>
            <el-col :span="6">
              <div class="search-btn">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" plain @click="reset">重置</el-button>
                <el-button
                  type="primary"
                  plain
                  @click="newadd"
                  v-hotKey="{ func: 'func_add1' }"
                >新增</el-button
                >
              </div>
            </el-col>
          </el-row>
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
            type="index"
            label="序号"
            width="50">
          </el-table-column>
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
              <template v-if="item.prop == 'originIdentificationCode'">
                <span
                  :val="scope.row.originIdentificationCode"
                  code="DrugManufacturerFlag"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'originCode'">
                <span
                  :val="scope.row.originCode"
                  code="Manufacturer"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'price'">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
              <template v-else-if="item.prop == 'goodsType'">
                <span
                  :val="scope.row.goodsType"
                  code="goodsType"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'subclassOrders'">
                  <span
                    columns="doctors_advice_name"
                    :conditionMap="{ doctors_advice_code: scope.row.subclassOrders }"
                    tableName="cnf_doctors_advice"
                    v-tableTransform
                  ></span>
              </template>
              <template v-else-if="item.prop == 'status'">
                <span v-if="scope.row.status == '1'">启用</span>
                <span v-else>暂停</span>
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
  </div>
</template>

<script>
import warehousingAPI from "@/api/materielStorage/warehousing.js";
import formatNum from "@/utils/formatPrice.js";
export default {
  name: "drugList",
  props: ["refreshList"],
  components: {

  },
  data() {
    return {
      dialogTransferVisible: false,
      //搜索条件
      searchData: {
        keyword: "",
        goodsType: "",
        status: "1",
        isShow: true
      },
      hosId:'',
      //表头数据
      drugParams: [
        {
          prop: "goodsName",
          label: "物资名称",
          align: "left",
          width: "213",
          fixed: false
        },
        {
          prop: "spec",
          label: "规格",
          align: "left",
          width: "150",
          fixed: false
        },
        {
          prop: "goodsType",
          label: "物资类型",
          align: "left",
          width: "80",
          fixed: false
        },
        {
          prop: "price",
          label: "单价(元)",
          align: "right",
          width: "80",
          fixed: false
        },
        {
          prop: "subclassOrders",
          label: "医嘱子类",
          align: "left",
          width: "70",
          fixed: false
        },
        {
          prop: "originCode",
          label: "生产厂商",
          align: "left",
          width: "180",
          fixed: false
        },
        {
          prop: "originIdentificationCode",
          label: "厂商标识",
          align: "left",
          width: "80",
          fixed: false
        },
        {
          prop: "status",
          label: "启用状态",
          align: "left",
          width: "70",
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
  created() {
    this.hosId = JSON.parse(
      localStorage.getItem("pamars")
    ).hosId;
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
    closeTransferTableFuc() {
      this.dialogTransferVisible = false;
    },
    TransferIn() {
      this.dialogTransferVisible = true;
    },
    formatNum(num) {
      return formatNum(num);
    },
    // 获取左侧是否有新建数据
    goodsFormDeailStyleFun() {
      console.log(234,window.sessionStorage.getItem(
        "goodsFormDeailStyle"
      ))
      let goodsFormDeailStyle = window.sessionStorage.getItem(
        "goodsFormDeailStyle"
      );
      if (goodsFormDeailStyle == "true") {
        goodsFormDeailStyle = true;
      } else {
        goodsFormDeailStyle = false;
      }
      console.log(123,goodsFormDeailStyle)
      return goodsFormDeailStyle;
    },
    //获取药品表格数据
    getDrugList() {
      this.tlm_isLoading = true;
      warehousingAPI
        .getGoodsList({
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          keyword: this.searchData.keyword,
          status: this.searchData.isShow ? '1' : '',
          hosId: this.hosId,
          goodsType: this.searchData.goodsType
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

        if (this.goodsFormDeailStyleFun()) {
          this.$confirm("还有数据未保存是否继续？？", "请确认", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(() => {
              window.sessionStorage.setItem("goodsFormDeailStyle", 'false');
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
      if (this.goodsFormDeailStyleFun()) {
        this.$confirm("还有数据未保存是否继续？？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            window.sessionStorage.setItem("goodsFormDeailStyle", 'false');
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
      if (this.goodsFormDeailStyleFun()) {
        this.$confirm("还有数据未保存是否继续？？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            window.sessionStorage.setItem("goodsFormDeailStyle", 'false');
            this.searchData.isShow = val;
            if (this.searchData.isShow == true) {
             // this.searchData.status = "1";
              this.search();
            }
            if (this.searchData.isShow == false) {
             // this.searchData.status = "";
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
         // this.searchData.status = "1";
          this.search();
        }
        if (this.searchData.isShow == false) {
      //    this.searchData.status = "";
          this.search();
        }
      }
    },
    //重置
    reset() {
      this.searchData.keyword = "";
      this.searchData.goodsType = "";
      this.searchData.isShow = true;
      this.search();
    },
    //点击某一行药品
    rowClick(row, i) {
      if (this.goodsFormDeailStyleFun()) {
        this.$confirm("还有数据未保存是否继续？？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            this.drugDataId = row.id;
            window.sessionStorage.setItem("goodsFormDeailStyle", 'false');
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
      if (this.goodsFormDeailStyleFun()) {
        this.$confirm("还有数据未保存是否继续？？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            window.sessionStorage.setItem("goodsFormDeailStyle", 'false');
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
      if (this.goodsFormDeailStyleFun()) {
        this.$confirm("还有数据未保存是否继续？？", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            window.sessionStorage.setItem("goodsFormDeailStyle", 'false');
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
