<template>
  <el-card class="height100">
    <div class="top-box">
      <el-button type="primary" size="small" @click="startInventory">开始盘存</el-button>
      <el-button type="primary" size="small" plain @click="saveTempl">保存为模板</el-button>
    </div>
    <div class="filter">
      <el-row class="filter-inner">
       <el-col :span="12" class="leftDiv">
          <span class="setter">盘点设置</span>
          <el-radio-group v-model="radio" @change="stateChange">
            <el-radio v-model="radio" label="2">部分盘存</el-radio>
            <el-radio v-model="radio" label="1">全部盘存</el-radio>
          </el-radio-group>
       </el-col>
        <el-col :span="12">
         <el-checkbox-group v-model="cwTypeList" @change="cwTypeChange">
           <el-checkbox label="1">西药</el-checkbox>
           <el-checkbox label="2">中成药</el-checkbox>
           <el-checkbox label="3">中草药</el-checkbox>
         </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row class="table-handler-box">
        <el-col :span="12" v-show="radio === '2'">
          <span
            class="float-left cursor-pointer margin-right-20"
            @click="newDrugs"
            v-hotKey="{ func: 'func_add1' }"
          >
            <i class="filter-item iconfont iconxinzeng"></i> 添加
          </span>
          <span
            class="float-left cursor-pointer margin-right-20"
            @click="del"
            v-hotKey="{ func: 'func_delete' }"
          >
            <i class="filter-item iconfont iconshanchu"></i>删除
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="table-body">
      <el-table
        :data="tableData"
        ref="table"
        @selection-change="getRowsIdx"
        @cell-click="cellClick"
        :row-key="tableDataKey"
        v-loading="tl_isLoading"
        element-loading-text="加载中..."
        height="100%"
        border
        highlight-current-row
        v-hotKey="{
          func: ['table_row', 'table_checkbox', 'table_choose'],
          deClass: 'el-table__row',
          curClass: 'current-row'
        }"
      >
        <!-- 单选框列 -->
        <el-table-column
          v-if="radio === '2'"
          type="selection"
          width="40px"
          header-align="center"
          align="center"
        ></el-table-column>
        <!-- 业务列 -->
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
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
              <span>{{ formatNum(scope.row.purchasePrice,4) }}</span>
            </template>
            <template v-else-if="item.prop == 'price'">
              <span>{{ formatNum(scope.row.price,4) }}</span>
            </template>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 保存为模板弹窗 -->
    <l-dialog
      title="保存为模板"
      :visible.sync="showTable"
      width="470px"
      @confirm="saveAsTemplate"
      @cancel="showTable = false"
    >
      <template #content>
        <div class="formtWrapper">
          <l-formt-title class="form-item temp_name" label="模板名称" labelWidth="64">
            <el-input v-model="tempName" :maxlength="50" placeholder="请输入"></el-input>
          </l-formt-title>
        </div>
      </template>
    </l-dialog>
  </el-card>
</template>

<script>
import drugInfoList from "@/views/drugManagement/components/drugInfoList.vue";
import { getEleByTagName } from "@/utils/util.js";
import stockApi from "@/api/hmm/stock";
import formatNum from "@/utils/formatPrice.js";

const delMsg = "请选择一项";

export default {
  name: "settingMain",
  props: ["selectId"],
  components: {
    drugInfoList
  },
  data() {
    return {
      tl_isLoading: false,
      radio: "2",
      showTable: false,
      tempName: "",
      tableColumn: [
        {
          prop: "drugName",
          label: "药品名称",
          type: "selectTable"
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
      manageType: "0",
      locationNumber: "0",
      drugsType: "0",
      cwTypeList: ["1", "2", "3"],
      lOptions: [
        {
          value: "0",
          label: "全部"
        }
      ],
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
      newAddItemId: Date.now(),
      saveTemLoad: false
    };
  },
  watch: {
    selectId: {
      handler(val) {
        if (val && val.id) {
          this.getTempData(val.id);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    formatNum(num,no) {
      return formatNum(num,no);
    },
    startInventory() {
      if (this.tableData.length == 0) {
        this.$message.warning("请添加要盘存的药品");
        return;
      }
      this.$showLoading();
      // 药品去重
      let dataList = this.drugDeduplication(this.tableData, "drugId");
      let params = {
        takeStockDPOList: dataList
      };
      stockApi
        .startInventory(params)
        .then(res => {
          this.$hideLoading();
          if (res.code == 1) {
            this.tableData = res.data.takeStockDPOList;
            this.$message({
              type: "success",
              message: "开始盘存成功!"
            });
          } else {
            this.$message.error(res.msg || "开始盘存失败");
          }
        })
        .catch(res => {
          this.$hideLoading();
          this.$message.error(res.msg || "开始盘存失败");
        });
      dataList = null;
      params = null;
    },
    getTempData(templateId) {
      if (this.tl_isLoading) {
        return;
      }
      this.tl_isLoading = true;
      stockApi
        .getSetDetail({ templateId })
        .then(res => {
          if (res.code == 1) {
            let list = this.tableData.concat(res.data);
            // 药品去重
            list = this.drugDeduplication(list, "drugId");
            this.tableData = list;
            list = null;
          } else {
            this.$message.error(res.msg || "获取盘存单明细数据失败");
          }
          this.tl_isLoading = false;
        })
        .catch(res => {
          this.tl_isLoading = false;
          this.$message.error(res.msg || "获取盘存单明细数据失败");
        });
    },
    saveTempl() {
      this.showTable = true;
    },
    saveAsTemplate() {
      //保存为模板
      //过滤掉空白行
      let list = this.tableData.filter(item => {
        return Boolean(item.drugId);
      });
      if (list.length === 0) {
        this.$message({
          type: "warning",
          message: "请添加药品"
        });
        return;
      } else if (this.tempName === "") {
        this.$message({
          type: "warning",
          message: "请输入模板名称"
        });
        return;
      }
      let _this = this;
      let saveData = {
        templateName: this.tempName,
        takeStockTemplateDPOList: list
      };
      this.saveTemLoad = true;
      stockApi
        .saveTemplate(saveData)
        .then(res => {
          if (res.code == 1) {
            this.tempName = "";
            this.$emit("re-left-list");
            this.showTable = false;
            _this.tableData = res.data.takeStockTemplateDPOList || [];
            this.$message({
              type: "success",
              message: "保存成功!"
            });
          } else {
            this.$message.error(res.msg || "保存失败");
          }
          this.saveTemLoad = false;
        })
        .catch(res => {
          this.saveTemLoad = false;
          this.$message.error(res.msg || "保存失败");
        });
    },
    AddDataChange() {},
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
    setInputFocus(target, row) {
      let me = this;
      this.$nextTick(function() {
        setTimeout(function() {
          if (target.getElementsByClassName("el-input__inner").length > 0) {
            target.getElementsByClassName("el-input__inner")[0].focus();
            // 获取焦点后 当前编辑的 row 赋值
            me.editRow = row;
          }
        }, 10);
      });
    },
    del() {
      if (this.mult.length === 0) {
        this.$message({
          type: "warning",
          message: "请勾选要删除的药品"
        });
        return;
      }
      let mult = this.mult;
      let multKeyList = mult.map(item => {
        return item.id || item.key;
      });
      let newData = this.tableData.filter(item => {
        if (item.id) {
          return multKeyList.indexOf(item.id) === -1;
        } else if (item.key) {
          return multKeyList.indexOf(item.key) === -1;
        }
        return false;
      });
      this.tableData = newData;
    },
    cellClick(row, column, cell, event) {
      let target = event.target;
      if (
        target.tagName === "SPAN" &&
        target.getAttribute("type") === "drug_part"
      ) {
        target = target.parentNode;
      }
      if (column.property === "drugsName") {
        row.isEdit = true;
        this.setInputFocus(target, row);
      }
    },
    blurFn() {},
    // 行数据的key，用来优化table渲染
    tableDataKey(row) {
      if (row.id) {
        return row.id;
      }
      return row.key;
    },
    // 全盘，部分盘
    stateChange(val) {
      // 清空选中的模板数据
      if (val === "1") {
        // 全部盘存
        this.$emit("clear-drug-info", false);
        this.tl_isLoading = true;
        const params = {currDrugStorage : 1, hasStock: true};
        if (this.cwTypeList.length > 0) {
          params.cwTypeList = this.cwTypeList.join(",");
        } else {
          params.cwTypeList = "0";
        }
        stockApi
          .getAllDrugList(params)
          .then(res => {
            if (res.code === 1) {
              this.tableData = res.data;
            }
            this.tl_isLoading = false;
          })
          .catch(err => {
            this.tl_isLoading = false;
          });
      } else if (val === "2") {
        this.$emit("clear-drug-info", true);
        this.tableData = [];
      }
    },
    cwTypeChange(val){
      if(this.radio === "1"){
        this.tl_isLoading = true;
        const params = {currDrugStorage : 1, hasStock: true};
        if (val.length > 0) {
          params.cwTypeList = val.join(",");
        } else {
          params.cwTypeList = "0";
        }
        stockApi
          .getAllDrugList(params)
          .then(res => {
            if (res.code === 1) {
              this.tableData = res.data;
            }
            this.tl_isLoading = false;
          })
          .catch(err => {
            this.tl_isLoading = false;
          });
      }
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
    // 获取药品输入查询组件传过来的药品数据
    getSearchData(row, index) {
      this.tableindex = index;
      this.$set(this.tableData, this.tableindex, {
        ...this.tableData[this.tableindex],
        ...row
      });
    }
  }
};
</script>

<style scoped lang="scss">
.top-box {
  padding: 16px;
  border-bottom: 1px solid $l-color-bgcolor-11;
}
.filter {
  padding: 16px;
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
    color: #fff;
  }
  .inline-block {
    display: inline-block;
  }
  .info {
    font-size: 14px;

    font-weight: 400;
    color: $l-color-fontcolor-4;
    line-height: 34px;
    margin-top: 6px;
    span + span {
      margin-left: 60px;
    }
  }
}

.formtWrapper {
  width: 100%;
  position: relative;
  padding: 20px;
}

.setter {
  margin-right: 8px;
  vertical-align: -1px;
  font-size: 14px;

  font-weight: 400;
  color: $l-color-fontcolor-4;
}

.filter-inner {
  height: 20px;
}
.leftDiv {
  line-height: 20px;
}

.table-body {
  height: calc(100% - 150px);
  padding: 16px;
  padding-top: 0;
}
.table-handler-box {
  height: 18px;
  margin-top: 16px;
  .filter-item {
    margin-right: 5px;
  }
}
</style>
