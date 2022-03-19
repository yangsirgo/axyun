<template>
  <el-card class="height100 padding16" ref="card_main">
    <div class="filter" ref="filter">
      <l-formt-title class="form-item" label="模板名称" labelWidth="64" style="width: 280px">
        <el-input v-model="template_main.templateName" :maxlength="50" placeholder="请输入"></el-input>
      </l-formt-title>
      <div class="float-right inline-block">
        <el-button v-if="false" class="button primary" type="primary" @click="newAdd">新建盘点模板</el-button>
      </div>
      <div class="info">
        <span>
          修改人员
          <em>{{ template_main.updatedByName || "--" }}</em>
        </span>
        <span>
          修改时间
          <em>{{ template_main.updatedAt || "--" }}</em>
        </span>
      </div>
      <el-row class="table-handler-box">
        <el-col :span="12">
          <span
            class="float-left cursor-pointer margin-right-10"
            @click="newDrugs"
            v-hotKey="{ func: 'func_add1' }"
          >
            <i class="filter-item iconfont iconxinzeng"></i> 新增药品
          </span>
          <span class="float-left cursor-pointer margin-right-10" @click="showTable = true">
            <i class="filter-item iconfont iconyiriqingdan"></i> 批量添加
          </span>
          <span
            class="float-left cursor-pointer margin-right-10"
            @click="del"
            v-hotKey="{ func: 'func_delete' }"
          >
            <i class="filter-item iconfont iconshanchu"></i>删除
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="tableBody">
      <el-table
        :data="tableData"
        ref="table"
        @selection-change="getRowsIdx"
        :row-key="tableDataKey"
        height="100%" 
        border
        v-loading="listLoad"
        highlight-current-row
        v-hotKey="{
          func: ['table_row', 'table_checkbox', 'table_choose'],
          deClass: 'el-table__row',
          curClass: 'current-row'
        }"
      >
        <!-- 单选框列 -->
        <el-table-column type="selection" width="40px" header-align="center" align="center"></el-table-column>
        <!-- 业务列 -->
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align || 'left'"
          :width="item.width"
          header-align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <!-- 可自定义内容 -->
            <template v-if="item.prop === 'drugName'">
              <span v-if="scope.row.drugName">{{ scope.row.drugName }}</span>
              <drug-info-list
                v-else
                suffix-icon="el-icon-search"
                @send-data="getSearchData($event,scope.$index)"
              ></drug-info-list>
            </template>
            <template v-else-if="item.prop == 'purchasePrice'">
              <span>{{ formatNum(scope.row.purchasePrice) }}</span>
            </template>
            <template v-else-if="item.prop == 'price'">
              <span>{{ formatNum(scope.row.price) }}</span>
            </template>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="bottom-btn">
      <el-button class="less-btn float-left" type="primary" plain @click="exportExcel">导出</el-button>
      <el-button
        class="less-btn float-right"
        type="primary"
        :loading="saveLoad"
        @click="saveTem"
        v-hotKey="{ func: 'func_save', flag: 'saveLoad' }"
      >保存</el-button>
    </div>

    <!-- 批量添加药品 -->
    <l-dialog
      title="批量添加药品"
      :visible.sync="showTable"
      width="750px"
      @confirm="submitAddMore"
      @cancel="showTable = false"
      @close="addMoreClose"
    >
      <template #content>
        <div class="add-box padding20">
          <l-formt-title
            class="form-item float-left"
            label="货位大类"
            labelWidth="50"
            style="width: 200px"
          >
            <el-select v-model="locationNumber" clearable @change="getPsDrugList">
              <el-option
                v-for="item in locationList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </l-formt-title>
          <l-formt-title
            class="form-item float-left"
            label="管理类型"
            labelWidth="64"
            style="width: 200px;margin-left: 5px"
          >
            <l-value-domain
              code="DrugManaType"
              :value.sync="manageType"
              @change="getPsDrugList"
              clearable
            />
          </l-formt-title>
          <l-formt-title
            class="form-item float-left"
            label="剂型"
            style="width: 200px;margin: 0 0 20px 5px"
          >
            <!-- <l-value-domain
            code="DrugFormulationCode"
            :value.sync="drugsType"
            @change="getPsDrugList"
            clearable
            />-->
            <l-value-domain
              :value.sync="drugsType"
              remoteUrl="/hmm-stock/form/listForDropDown"
              remoteShowKey="name"
              remoteValueKey="code"
              :localFilterKeys="['keyword']"
              placeholder="请选择"
              @change="getPsDrugList"
            ></l-value-domain>
          </l-formt-title>
          <el-table
            :data="AddData"
            @selection-change="AddDataChange" 
            height="200px"
            v-loading="dialogLoadMore.tl_isLoading"
            tooltip-effect="dark"
            element-loading-text="加载中..."
            border
          >
            <el-table-column type="selection" width="45px" header-align="center" align="center"></el-table-column>
            <el-table-column
              v-for="(item, index) in AddTableColumn"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              :align="item.align || 'left'"
              header-align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <template v-if="item.prop == 'purchasePrice'">
                  <span>{{ formatNum(scope.row.purchasePrice) }}</span>
                </template>
                <template v-else-if="item.prop == 'price'">
                  <span>{{ formatNum(scope.row.price) }}</span>
                </template>
                <template v-else-if="item.prop == 'manageType'">
                  <span :val="scope.row.manageType" code="DrugManaType" v-codeTransform></span>
                </template>
                <template v-else-if="item.prop == 'formCode'">
                  <span
                    tableName="hrp_form"
                    :conditionMap="{form_code: scope.row.formCode}"
                    columns="form_name"
                    v-tableTransform
                  ></span>
                </template>
                <template v-else>
                  <span>{{ scope.row[item.prop]}}</span>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </l-dialog>
  </el-card>
</template>

<script>
import drugInfoList from "@/views/drugManagement/components/drugInfoList.vue";
import hmmBaseApi from "@/api/hmm/base";
import stockApi from "@/api/hmm/stock";
import { jsonToExcel } from "@/utils/excel/excel";
import formatNum from "@/utils/formatPrice.js";

const delMsg = "请选择一项";

export default {
  name: "inventoryTemplate",
  components: {
    drugInfoList
  },
  props: ["selectId"],
  data() {
    return {
      tableLoadMore: {
        page: 1,
        tl_isLoading: false, // 控制table loading
        tl_noMore: false // 没有更多数据， 禁用加载
      },
      dialogLoadMore: {
        page: 1,
        tl_isLoading: false, // 控制table loading
        tl_noMore: false // 没有更多数据， 禁用加载
      },
      curPage: 0, // 当前页数
      pageTotal: 5, // 总共页数
      showTable: false,
      template_main: {
        templateName: "",
        updatedByName: "", // 修改人
        updatedAt: "" // 修改时间
      },
      tableColumn: [
        {
          prop: "drugName",
          label: "药品名称"
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "purchasePrice",
          label: "进价(元)",
          align: "right",
          width: 120
        },
        {
          prop: "price",
          label: "售价(元)",
          align: "right",
          width: 120
        }
      ],
      tableData: [],
      mOptions: [
        {
          value: "0",
          label: "全部"
        }
      ],
      dOptions: [
        {
          value: "0",
          label: "全部"
        }
      ],
      mult: [],
      AddTableColumn: [
        {
          prop: "drugName",
          label: "药品名称",
          width: 200
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "purchasePrice",
          label: "进价(元)",
          align: "right",
          width: 100
        },
        {
          prop: "price",
          label: "售价(元)",
          align: "right",
          width: 100
        },
        {
          prop: "locationSortNo",
          label: "货位号",
          width: 92
        },
        {
          prop: "manageType",
          label: "管理类型"
        },
        {
          prop: "formCode",
          label: "剂型"
        }
      ],
      AddData: [],
      manageType: "",
      locationNumber: "",
      drugsType: "",
      locationList: "",
      dialogMiltSelection: [],
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共条数
        pageSize: 10 // 每页数据条数
      },
      //当前编辑index
      tableindex: 0,
      newAddItemId: Date.now(),
      // 保存loading
      saveLoad: false,
      // 药品列表loading
      listLoad: false
    };
  },
  created() {
    this.getLocation(this.curScode);
  },
  watch: {
    selectId: {
      handler(val) {
        this.tableData = [];
        if (val && val.id) {
          this.getTempData(val.id);
        }
        let data = JSON.parse(JSON.stringify(val));
        for (let i in this.template_main) {
          this.$set(this.template_main, i, data[i]);
        }
        // this.template_main = JSON.parse(JSON.stringify(val));
      },
      immediate: true,
      deep: true
    },
    showTable(val) {
      if (val) {
        this.getPsDrugList();
      }
    }
  },
  methods: {
    getLocation() {
      hmmBaseApi
        .getCurDrugStorage()
        .then((res) => {
          if (res.code === 1) {
            hmmBaseApi
              .getSelectLocation(res.data.storageCode)
              .then((res) => {
                if (res.code === 1) {
                  this.locationList = res.data;
                } else {
                  this.$message.error("获取位置大类失败");
                }
              })
              .catch((err) => {
                this.$message.error("获取位置大类失败");
              });
          } else {
            this.$message.error("获取当前库房失败");
          }
        })
        .catch((err) => {
          this.$message.error("获取当前库房失败");
        });

    },
    formatNum(num) {
      return formatNum(num);
    },
    submitAddMore() {
      // 药品去重
      let list = this.drugDeduplication(this.dialogMiltSelection, "drugId");
      // 新增的对象添加key用于删除
      let dialog = list.map(item => {
        this.newAddItemId += 1;
        return {
          ...item,
          id: "",
          key: this.newAddItemId
        };
      });

      this.tableData = this.tableData.concat(dialog);
      this.showTable = false;
      list = null;
      dialog = null;
    },
    AddDataChange(val) {
      this.dialogMiltSelection = val;
    },
    getRowsIdx(val) {
      this.mult = val;
    },
    newDrugs() {
      this.newAddItemId += 1;
      let newDrugs = {
        id: "",
        key: this.newAddItemId,
        isEdit: true //新增默认是 true
      };
      this.tableColumn.forEach(item => {
        newDrugs[item.prop] = "";
      });
      this.tableData.push(newDrugs);
      //设置新增 tr 聚焦
      let tableDom = this.$refs.table.$el;
      this.$nextTick(() => {
        this.setInputFocus(tableDom, newDrugs);
      });
    },
    newAdd() {
      this.tableData = [];
      for (let i in this.template_main) {
        this.$set(this.template_main, i, "");
      }
      // this.template_main = this.$options.data().template_main;
    },
    del() {
      if (this.mult.length === 0) {
        this.$message({
          type: "warning",
          message: "请勾选要删除的药品"
        });
        return;
      }
      let arr = this.mult.map(item => item.id || item.key);
      let newTableData = this.tableData.filter(item => {
        if (item.id) {
          return arr.indexOf(item.id) === -1;
        } else if (item.key) {
          return arr.indexOf(item.key) === -1;
        }
        return false;
      });
      this.tableData = newTableData;
      arr = null;
      newTableData = null;
    },
    setInputFocus(target, row) {
      if (target.getElementsByClassName("el-input__inner").length > 0) {
        target.getElementsByClassName("el-input__inner")[0].focus();
      }
    },
    blurFn() {},
    getTempData(templateId) {
      this.listLoad = true;
      this.tableData = [];
      stockApi
        .getSetDetail({ templateId })
        .then(res => {
          if (res.code == 1) {
            this.tableData = res.data;
          } else {
            this.$message.error(res.msg || "获取模板明细数据失败");
          }
          this.listLoad = false;
        })
        .catch(res => {
          this.listLoad = false;
          this.$message.error(res.msg || "获取模板明细数据失败");
        });
    },
    // 行数据的key，用来优化table渲染
    tableDataKey(row) {
      if (row.id) {
        return row.id;
      }
      return row.key;
    },
    // 保存模板
    saveTem() {
      console.log(!this.template_main.templateName);
      if (this.tableData.length === 0) {
        this.$message({
          type: "warning",
          message: "至少添加一个药品"
        });
        return;
      } else if (!this.template_main.templateName) {
        this.$message({
          type: "warning",
          message: "请输入模板名称"
        });
        return;
      }

      // 清除空列
      let list = this.tableData.filter(item => {
        return item.drugName !== "";
      });
      // 药品去重
      list = this.drugDeduplication(list, "drugId");

      let dataParams = {};
      if (this.selectId) {
        dataParams.id = this.selectId.id;
        dataParams.dataVersion = this.selectId.dataVersion;
      }
      let data = {
        ...dataParams,
        takeStockTemplateDPOList: list,
        templateName: this.template_main.templateName
      };

      this.saveLoad = true;
      this.$showLoading();
      stockApi
        .saveTemplate(data)
        .then(res => {
          if (res.code === 1) {
            this.$emit("tem-list-change");
            this.$message({
              type: "success",
              message: "保存模板成功"
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg || "保存模板失败"
            });
          }
          this.saveLoad = false;
          this.$hideLoading();
        })
        .catch(err => {
          this.saveLoad = false;
          this.$hideLoading();
          this.$message({
            type: "error",
            message: err.msg || "保存模板失败"
          });
        });

      list = null;
      data = null;
    },
    getPsDrugList() {
      this.dialogLoadMore.tl_isLoading = true;
      stockApi
        .getPlDrugList({
          locationSort: this.locationNumber,
          manageType: this.manageType,
          formCode: this.drugsType
        })
        .then(res => {
          if (res.code === 1) {
            this.AddData = res.data;
          }
          this.dialogLoadMore.tl_isLoading = false;
        })
        .catch(err => {
          this.dialogLoadMore.tl_isLoading = false;
        });
    },
    // 数组对象去重
    drugDeduplication(data, key) {
      let obj = {};
      let list = data.reduce((item, next) => {
        if (!obj[next[key]]) {
          obj[next[key]] = true;
          item.push(next);
        }
        return item;
      }, []);
      return list;
    },
    exportExcel() {
      let excelData = {
        title: ["盘存模板", "", "", "", ""],
        where: ["模板名称:" + this.template_main.templateName, "", "", ""],
        tHeader: ["药品名称", "规格", "进价", "售价"],
        filterVal: ["drugName", "spec", "purchasePrice", "price"],
        listDate: this.tableData,
        fileName: "盘存模板",
        merges: ["A1:D1"]
      };
      jsonToExcel(excelData);
    },
    // 获取药品输入查询组件传过来的药品数据
    getSearchData(row, index) {
      this.tableindex = index;
      this.$set(this.tableData, this.tableindex, {
        ...this.tableData[this.tableindex],
        ...row
      });
    },
    addMoreClose() {
      this.locationNumber = "";
      this.manageType = "";
      this.drugsType = "";
    }
  }
};
</script>

<style scoped lang="scss">
.filter {
  overflow: hidden;
  .button {
    height: 36px;
    border-radius: 2px;
    border: 1px solid $l-color-primary;
    font-size: 14px;
    
    font-weight: 500;
    color: $l-color-primary;
  }

  .primary {
    color: $l-color-white;
  }

  .inline-block {
    display: inline-block;
  }

  .info {
    font-size: 14px;
    
    font-weight: 400;
    color: $l-color-fontcolor-4;
    padding:16px 0;
    clear: both;

    span + span {
      margin-left: 60px;
    }
    em {
      margin-right: 5px;
      font-style: normal;
      color: $l-color-fontcolor-3;
    }
  }
  .table-handler-box {
    margin-bottom: 16px;
    span {
      margin-right: 20px;
    }
  }
}

.el-card {
  .bottom-btn {
    padding-top: 16px;
    overflow: hidden;
  }
}

/deep/ .el-dialog-div {
  max-height: 510px;
  overflow: auto;
}
.tableBody {
  height: calc(100% - 161px);
}
.filter-item {
  margin-right: 5px;
}
</style>
