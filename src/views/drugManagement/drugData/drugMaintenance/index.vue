<template>
  <div class="wrapper height100">
    <div class="main height100">
      <div class="main_wrap height100">
        <flow-menu>
          <slot name="content">
            <div class="ledger width100 height100">
              <div class="search-input">
                <el-row :gutter="10">
                  <el-col :span="3">
                    <LFormtTitle label="库房选择" labelWidth="76">
                      <el-select v-model="storageCode" placeholder="请选择">
                        <el-option
                          v-for="item in drugStorageList"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="21" style="text-align: right;">
                   <!-- <el-button type="primary" @click="search">查询</el-button>-->
                  </el-col>
                </el-row>
              </div>
              <div class="drug-list-cont">
                <div class="drug-left">
                  <l-card-title class="dec-title">
                    <span slot="left">可导入药品品种</span>
                  </l-card-title>
                  <el-radio-group class="mb10" v-model="radio1" @change="changeDrugType1">
                    <el-radio label="all">全部</el-radio>
                    <el-radio label="1">西药</el-radio>
                    <el-radio label="2">成药</el-radio>
                    <el-radio label="3">中药</el-radio>
                  </el-radio-group>
                  <div class="table-box">
                    <el-table
                      ref="multipleTable"
                      :data="leftData"
                      border
                      stripe
                      width="100%"
                      height="100%"
                      highlight-current-row
                      v-loading="leftLoad"
                      @selection-change="handleSelectionChange"
                      @header-dragend="headerDragend1"
                      element-loading-text="加载中..."
                    >
                      <el-table-column type="selection" width="55"></el-table-column>
                      <el-table-column show-overflow-tooltip prop="cwType" label="中西分类">
                        <template slot-scope="scope">
                          <span v-if="scope.row.cwType=='1'">西药</span>
                          <span v-if="scope.row.cwType=='2'">中成药</span>
                          <span v-if="scope.row.cwType=='3'">中草药</span>
                        </template>
                      </el-table-column>
                      <el-table-column show-overflow-tooltip prop="drugName" label="药品名称"></el-table-column>
                      <el-table-column show-overflow-tooltip prop="spec" label="规格"></el-table-column>
                      <el-table-column show-overflow-tooltip prop="name" label="生产厂商">
                        <template slot-scope="scope">
                          <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
                        </template>
                      </el-table-column>
                      <el-table-column show-overflow-tooltip prop="name" label="剂型">
                        <template slot-scope="scope">
                          <span
                            tableName="hrp_form"
                            :conditionMap="{form_code: scope.row.formCode}"
                            columns="form_name"
                            v-tableTransform
                          ></span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        show-overflow-tooltip
                        prop="price"
                        label="售价(元)"
                        width="120"
                        align="right"
                      >
                        <template slot-scope="scope">
                          <span>{{ formatNum(scope.row.price) }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <div class="drug-right">
                  <l-card-title class="dec-title">
                    <span slot="left">库房药品品种</span>
                  </l-card-title>
                  <el-radio-group class="mb10" v-model="radio2" @change="changeDrugType2">
                    <el-radio label="all">全部</el-radio>
                    <el-radio label="1">启用</el-radio>
                    <el-radio label="0">停用</el-radio>
                  </el-radio-group>
                  <div class="table-box">
                    <el-table
                      ref="rightTable"
                      :data="rightData"
                      border
                      stripe
                      width="100%"
                      height="100%"
                      highlight-current-row
                      v-loading="rightLoad"
                      @header-dragend="headerDragend2"
                      element-loading-text="加载中..."
                    >
                      <el-table-column show-overflow-tooltip prop="cwType" label="中西分类">
                        <template slot-scope="scope">
                          <span v-if="scope.row.cwType=='1'">西药</span>
                          <span v-if="scope.row.cwType=='2'">中成药</span>
                          <span v-if="scope.row.cwType=='3'">中草药</span>
                        </template>
                      </el-table-column>
                      <el-table-column show-overflow-tooltip prop="drugName" label="药品名称"></el-table-column>
                      <el-table-column show-overflow-tooltip prop="spec" label="规格"></el-table-column>
                      <el-table-column show-overflow-tooltip prop="name" label="生产厂商">
                        <template slot-scope="scope">
                          <span :val="scope.row.originCode" code="Manufacturer" v-codeTransform></span>
                        </template>
                      </el-table-column>
                      <el-table-column show-overflow-tooltip prop="name" label="剂型">
                        <template slot-scope="scope">
                          <span
                            tableName="hrp_form"
                            :conditionMap="{form_code: scope.row.formCode}"
                            columns="form_name"
                            v-tableTransform
                          ></span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        show-overflow-tooltip
                        prop="purchasePrice"
                        label="进价(元)"
                        width="120"
                        align="right"
                      >
                        <template slot-scope="scope">
                          <span>{{ formatNum(scope.row.purchasePrice) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        show-overflow-tooltip
                        prop="price"
                        label="售价(元)"
                        width="120"
                        align="right"
                      >
                        <template slot-scope="scope">
                          <span>{{ formatNum(scope.row.price) }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column show-overflow-tooltip prop="status" label="状态标志">
                        <template slot-scope="scope">{{ scope.row.status === '0' ? '停用' : '启用' }}</template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
              <div class="bottom-btn">
                <el-button type="primary" :disabled="storageCode === ''" @click="importFun">确定导入</el-button>
              </div>
            </div>
          </slot>
        </flow-menu>
      </div>
    </div>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";
import hmmBaseApi from "@/api/hmm/base";
import stock from "@/api/hmm/stock";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";

export default {
  name: "drugMaintenance",
  components: { FlowMenu },
  data() {
    return {
      storageCode: "",
      drugStorageList: [
        {
          code: "",
          name: ""
        }
      ],
      backDrugStorageList: [
        {
          code: "",
          name: ""
        }
      ],
      leftAllData: [],
      leftData: [],
      rightAllData: [],
      rightData: [],
      leftLoad: false,
      rightLoad: false,
      radio1: "all",
      radio2: "all",
      multipleSelection: []
    };
  },
  created() {
    this.getDrugStorageList("0,1");
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    search() {
      this.loadTable();
      this.loadRightTable();
    },
    loadTable() {
      this.leftLoad = true;
      hmmBaseApi
        .getListForUnselectedDrug({
          storageCode: this.storageCode
        })
        .then(res => {
          if (res.code === 1) {
            this.leftAllData = res.data;
            this.leftData = res.data;
            this.changeDrugType1(this.radio1);
          }
          this.leftLoad = false;
        })
        .catch(err => {
          this.leftLoad = false;
        });
    },
    loadRightTable() {
      if (this.storageCode === "") {
        this.rightData = [];
        return;
      }
      this.rightLoad = true;
      hmmBaseApi
        .getListForDrug({
          storageCode: this.storageCode
        })
        .then(res => {
          if (res.code === 1) {
            this.rightAllData = res.data;
            this.rightData = res.data;
            this.changeDrugType2(this.radio2);
          }
          this.rightLoad = false;
        })
        .catch(err => {
          this.rightLoad = false;
        });
    },
    //获取药库数据
    getDrugStorageList(params) {
      hmmBaseApi
        .getDrugStorage(params)
        .then(res => {
          if (res.code == 1) {
            this.drugStorageList = this.drugStorageList.concat(res.data);
            this.backDrugStorageList = this.backDrugStorageList.concat(
              res.data
            );
            this.getStorageInfo();
          } else {
            this.$message.error(res.msg || "获取药库数据失败");
          }
          if (res.data.length == 0) {
            this.$message.error("暂无药库数据");
          }
        })
        .catch(res => {
          this.$message.error(res.msg || "获取药库数据失败");
        });
    },
    // 获取当前登录的药房药库
    getStorageInfo() {
      stock
        .isOpenDialog()
        .then(res => {
          if (res.code === 1) {
            let item = this.drugStorageList.find(
              item => item.code === res.data.storageCode
            );
            if (item) {
              this.drugStorageList = [
                {
                  code: "",
                  name: ""
                },
                {
                  code: item.code,
                  name: item.name
                }
              ];
              this.storageCode = item.code;
            }
          } else {
            this.resetDrugStorageList();
          }
        })
        .catch(err => {
          this.resetDrugStorageList();
        });
    },
    resetDrugStorageList() {
      this.drugStorageList = this.backDrugStorageList;
      this.storageCode = "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    importFun() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要导入的药品");
        return;
      }
      if (this.storageCode === "") {
        this.$message.warning("请选择库房");
        return;
      }
      this.$showLoading();
      const list = this.multipleSelection.map(item => {
        return {
          ...item,
          storageCode: this.storageCode
        };
      });
      hmmBaseApi
        .importInitDrug(list)
        .then(res => {
          if (res.code === 1) {
            this.search();
            this.multipleSelection = [];
            this.$refs.multipleTable.clearSelection();
            this.$message.success(res.msg || "导入成功");
          } else {
            this.$message.error(res.msg || "导入失败");
          }
          this.$hideLoading();
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "导入失败");
        });
    },
    //左侧radio过滤
    changeDrugType1(val) {
      if (val === "all") {
        this.leftData = this.leftAllData;
        return;
      }
      const list = this.leftAllData.filter(item => item.cwType === val);
      this.leftData = list;
    },
    //右侧radio过滤
    changeDrugType2(val) {
      if (val === "all") {
        this.rightData = this.rightAllData;
        return;
      }
      const list = this.rightAllData.filter(item => item.status === val);
      this.rightData = list;
    },
    headerDragend1() {
      this.$refs.multipleTable.doLayout();
    },
    headerDragend2() {
      this.$refs.rightTable.doLayout();
    }
  }
};
</script>

<style lang="scss" scoped>
.ledger {
  padding: 20px;
  background-color: $l-color-white;
}
.drug-info {
  line-height: 24px;
  margin-top: 5px;
}
.search-input {
  height: 38px;
}
.drug-list-cont {
  top: 60px;
  bottom: 75px;
  left: 20px;
  right: 20px;
  overflow: hidden;
  height: calc(100% - 75px);
}
.drug-left,
.drug-right {
  width: calc(50% - 10px);
  height: 100%;
}
.table-box {
  height: calc(100% - 67px);
}
.drug-left {
  float: left;
}
.drug-right {
  float: right;
}
.drug-box {
  /deep/ .l-input-body-main > div {
    width: 100% !important;
  }
}
/deep/ .cardtitle {
  height: 40px;
  line-height: 40px;
  .titleleft::before {
    margin-top: 10px;
  }
}
.bottom-btn {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  text-align: right;
}
.mb10 {
  margin-bottom: 10px;
}
</style>
