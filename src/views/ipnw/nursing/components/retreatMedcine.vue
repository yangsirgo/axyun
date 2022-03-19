<template>
  <div class="retreatMedcine height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      @message="messageHandler"
    >
      <template #list>
        <retreatMedLeftBar
          ref="retreatMedLeftBar"
          @updateActiveName="updateActiveName"
          @updateSelection1="updateSelection1"
          @updateSelection2="updateSelection2"
        ></retreatMedLeftBar>
      </template>
      <template #content>
        <el-card class="retreatMedcine-cont height100">
          <div class="table-cont">
            <el-table
              v-show="activeName==='first'"
              :data="tableData1"
              ref="table1"
              border
              stripe
              width="100%"
              height="100%"
              v-loadmore="load1"
              v-loading="tlm_isLoading"
              element-loading-text="加载中..."
              @selection-change="selectChange1"
            >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column
                v-for="(item,index) in tableParams1"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                header-align="center"
                :align="item.align || 'left'"
                :fixed="item.fixed"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop==='sex'">
                    <span :val="scope.row['sex']" code="GENDER_CODE" v-codeTransform></span>
                  </template>
                  <template v-else-if="item.prop==='status'">
                    <span v-if="scope.row['status']=='0'||scope.row['status']=='3'">待申请</span>
                    <span v-else-if="scope.row['status']=='1'">已申请</span>
                  </template>
                  <template v-else-if="item.prop==='pharmacyName'">
                    <span>{{codeToText(scope.row['pharmacyName'], drugStorageList) || ''}}</span>
                  </template>
                  <template v-else>{{scope.row[item.prop]}}</template>
                </template>
              </el-table-column>
            </el-table> 
            <el-table
              v-show="activeName==='second'"
              :data="tableData2"
              ref="table2"
              border
              stripe
              width="100%"
              height="100%"
              v-loadmore="load2"
              v-loading="tlm_isLoading"
              element-loading-text="加载中..."
              @selection-change="selectChange2"
            >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column
                v-for="(item,index) in tableParams2"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                header-align="center"
                :align="item.align || 'left'"
                :fixed="item.fixed"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop==='sex'">
                    <span :val="scope.row['sex']" code="GENDER_CODE" v-codeTransform></span>
                  </template>
                  <template v-else-if="item.prop==='status'">
                    <span v-if="scope.row['status']=='0'||scope.row['status']=='3'">待申请</span>
                    <span v-else-if="scope.row['status']=='1'">已申请</span>
                  </template>
                  <template v-else>{{scope.row[item.prop]}}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="button-cont clearfix">
            <el-button
              type="primary"
              class="float-right"
              v-if="activeName==='first'"
              @click="applyConfirm"
            >提交申请</el-button>
            <el-button
              type="primary"
              class="float-right"
              v-else-if="activeName==='second'"
              @click="applyCancel"
            >撤销申请</el-button>
            <el-button
              type="primary"
              plain
              class="float-right"
              style="margin-right: 15px"
              @click="print"
            >打印</el-button>
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
import retreatMedLeftBar from "@/views/ipnw/components/retreatMedLeftBar.vue";
import {
  getApplyDrugBackList,
  addApplyDrugBack,
  cancelApplyDrugBack
} from "@/api/ipnw/retreatMedcine";
import { localCodeTransform } from "@/utils/util";
import hmmBaseApi from "@/api/hmm/base";

export default {
  name: "retreatMedcine",
  components: {
    retreatMedLeftBar
  },
  data() {
    return {
      toolBoxs: [],
      activeName: "first",
      tableParams1: [
        {
          prop: "bedCode",
          label: "床位",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "patientName",
          label: "姓名",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "sex",
          label: "性别",
          width: "70",
          align: "left",
          fixed: false
        },
        {
          prop: "inpCode",
          label: "住院号",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "pharmacyName",
          label: "药房",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "drugName",
          label: "药品名称",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "spec",
          label: "规格",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "dispenseAmount",
          label: "发药数量",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "applyReturnAmount",
          label: "申请退药数量",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "drugUnit",
          label: "单位",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "price",
          label: "单价",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "money",
          label: "金额",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "productManufaacturer",
          label: "生产厂家",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "undatedByName",
          label: "操作人",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "undatedAt",
          label: "操作时间",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "status",
          label: "状态",
          width: "80",
          align: "left",
          fixed: false
        }
      ],
      tableParams2: [
        {
          prop: "bedCode",
          label: "床位",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "patientName",
          label: "姓名",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "sex",
          label: "性别",
          width: "70",
          align: "left",
          fixed: false
        },
        {
          prop: "inpCode",
          label: "住院号",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "pharmacyName",
          label: "药房",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "drugName",
          label: "药品名称",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "spec",
          label: "规格",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "dispenseAmount",
          label: "发药数量",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "applyReturnAmount",
          label: "申请退药数量",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "actualReturnAmount",
          label: "实际退药数量",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "drugUnit",
          label: "单位",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "price",
          label: "单价",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "money",
          label: "金额",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "productManufaacturer",
          label: "生产厂家",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "status",
          label: "状态",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "undatedBy",
          label: "申请时间",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "undatedByName",
          label: "申请人",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "returnDate",
          label: "退药时间",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "dealName",
          label: "处理人",
          width: "80",
          align: "left",
          fixed: false
        }
      ],
      tlm_isLoading: false,
      pageParams1: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      pageParams2: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      tableData1: [],
      tableData2: [],
      selection1: [],
      selection2: [],
      drugStorageList: []
    };
  },
  computed: {
    totalPage1() {
      return Math.ceil(this.pageParams1.total / this.pageParams1.pageSize);
    },
    totalPage2() {
      return Math.ceil(this.pageParams2.total / this.pageParams2.pageSize);
    }
  },
  mounted() {
    // this.getDrugStorageList("0,1");
  },
  watch: {
    activeName: {
      handler(val) {
        // this.refs.table1.doLayout();
        // this.refs.table2.doLayout();
        if (val === "first") {
        } else if (val === "second") {
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    updateActiveName(data) {
      this.activeName = data;
    },
    updateSelection1(data) {
      let params = "";
      for (let i in data) {
        if (i < data.length - 1) {
          params += data[i].inpCode + ",";
        } else {
          params += data[i].inpCode;
        }
      }
      this.search1(params);
    },
    updateSelection2(data) {
      let params = "";
      for (let i in data) {
        if (i < data.length - 1) {
          params += data[i].inpCode + ",";
        } else {
          params += data[i].inpCode;
        }
      }
      this.search2(params);
    },
    async search1(params) {
      this.tableData1 = [];
      this.selection1 = [];
      this.pageParams1.pageNo = 1;
      this.pageParams1.total = 0;
      if (params.length) {
        await this.getList1(params);
      }
    },
    async search2(params) {
      this.tableData2 = [];
      this.selection2 = [];
      this.pageParams2.pageNo = 1;
      this.pageParams2.total = 0;
      if (params.length) {
        await this.getList2(params);
      }
    },
    async getList1(param) {
      this.tlm_isLoading = true;
      try {
        let params = {
          inpCodes: param,
          ...this.pageParams1
        };
        let res = await getApplyDrugBackList(params);
        if (res.code === 1) {
          this.pageParams1.total = res.total;
          this.tableData1.push(...res.data);
        } else {
          this.$message.error(res.msg);
        }
        this.tlm_isLoading = false;
      } catch (e) {
        this.tlm_isLoading = false;
        this.$message.error(e.msg);
      }
    },
    async getList2(param) {
      this.tlm_isLoading = true;
      try {
        let params = {
          inpCodes: param,
          ...this.pageParams2
        };
        let res = await getApplyDrugBackList(params);
        if (res.code === 1) {
          this.pageParams2.total = res.total;
          this.tableData2.push(...res.data);
        } else {
          this.$message.error(res.msg);
        }
        this.tlm_isLoading = false;
      } catch (e) {
        this.tlm_isLoading = false;
        this.$message.error(e.msg);
      }
    },
    async load1() {
      this.pageParams1.pageNo++;
      if (this.pageParams1.pageNo > this.totalPage1) {
        this.pageParams1.pageNo = this.totalPage1;
      } else {
        await this.getList1();
      }
      this.tlm_isLoading = false;
    },
    async load2() {
      this.pageParams2.pageNo++;
      if (this.pageParams2.pageNo > this.totalPage2) {
        this.pageParams2.pageNo = this.totalPage2;
      } else {
        await this.getList2();
      }
      this.tlm_isLoading = false;
    },
    selectChange1(selection) {
      this.selection1 = selection;
    },
    selectChange2(selection) {
      this.selection2 = selection;
    },
    //提交申请
    async applyConfirm() {
      this.tlm_isLoading = true;
      try {
        let params = this.selection1;
        let res = await addApplyDrugBack(params);
        if (res.code === 1) {
          this.$message.success("提交申请成功");
          this.$refs.retreatMedLeftBar.search1();
        } else {
          this.$message.error(res.msg);
        }
        this.tlm_isLoading = false;
      } catch (e) {
        this.tlm_isLoading = false;
        this.$message.error(e.msg);
      }
    },
    //撤销申请
    async applyCancel() {
      this.tlm_isLoading = true;
      try {
        let params = this.selection2;
        let res = await cancelApplyDrugBack(params);
        if (res.code === 1) {
          this.$message.success("撤销申请成功");
          this.$refs.retreatMedLeftBar.search2();
        } else {
          this.$message.error(res.msg);
        }
        this.tlm_isLoading = false;
      } catch (e) {
        this.tlm_isLoading = false;
        this.$message.error(e.msg);
      }
    },
    //打印
    print() {},
    messageHandler() {},
    codeToText(code, list) {
      return localCodeTransform(code, list);
    },
    //获取药库数据
    getDrugStorageList(params) {
      hmmBaseApi
        .getDrugStorage(params)
        .then(res => {
          if (res.code == 1) {
            if (res.data.length == 0) {
              this.$message.error("暂无药库数据");
            }
            this.drugStorageList = res.data;
          } else {
            this.$message.error(res.msg || "获取药库数据失败");
          }
        })
        .catch(err => {
          this.$message.error(err.msg || "获取药库数据失败");
        });
    }
  }
};
</script>

<style scoped lang="scss">
.retreatMedcine-cont {
  padding: 20px;

  .table-cont {
    height: calc(100% - 56px);
  }

  .button-cont {
    height: 56px;
    padding-top: 20px;
  }
}
</style>
