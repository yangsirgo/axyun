<template>
  <div class="catalogue width100 height100 clearfix">
    <div class="catalogue-left height100 float-left">
      <div class="search-area">
        <div class="search-input">
          <el-row :gutter="10" class="width100">
            <el-col :span="4">
              <l-formt-title label="医保类别" required>
                <!-- <l-value-domain
                  :value.sync="medicareType"
                  remoteUrl="/finance-si/dict/getDictListBySiDictCatalogId?medicareType=0000&siDictCatalogCode=0000"
                  remoteShowKey="dictName"
                  remoteValueKey="dictCode"
                  placeholder="请选择"
                ></l-value-domain> -->
                <el-select v-model="medicareType" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in mtShow"
                    :key="index"
                    :label="item"
                    :value="index"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="业务类型">
                <el-input
                  v-model="businessType"
                  placeholder="请输入对业务类型"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <LFormtTitle label="患者姓名">
                <el-input
                  v-model="patientName"
                  placeholder="请输入患者姓名"
                  clearable
                ></el-input>
              </LFormtTitle>
            </el-col>
          <!-- </el-row> -->
          <!-- <el-row :gutter="10"> -->
            <el-col :span="6">
              <LFormtTitle label="请求时间">
                <el-date-picker
                  v-model="requestDate"
                  type="datetimerange"
                  @input="requestDateUpdate"
                  :default-time="['00:00:00', '23:59:59']"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="响应时间">
                <el-date-picker
                  v-model="responseDate"
                  type="datetimerange"
                  @input="responseDateUpdate"
                  :default-time="['00:00:00', '23:59:59']"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </LFormtTitle>
            </el-col>
          </el-row>
        </div>
        <div class="search-btn">
          <el-button type="primary" @click="search">查询</el-button>
        </div>
      </div>
      <div class="table-cont">
        <el-table
          :data="tableData"
          width="100%"
          height="100%"
          stripe
          border
          v-loading="loading"
          :element-loading-text="$t('retreat.loadInfo')"
          highlight-current-row
          @row-click="rowClick"
        >
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width || item.label.length * 18 + 24"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'recordStatus'">
                <span v-if="scope.row[item.prop] == '1'">已签到</span>
                <span v-else-if="scope.row[item.prop] == '2'">已签退</span>
              </template>
              <template v-else-if="item.prop === 'medicareType'">
                <span>{{ mtShow[scope.row[item.prop]] }}</span>
              </template>
              <span v-else class="overflow-point">{{
                scope.row[item.prop]
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo"
          :page-sizes="[20, 40, 60, 100, 300, 500, 1000, 3000, 5000, 10000]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api/medicalInsurance/siLogData";
import { dateFtt } from "@/utils";
export default {
  components: {},
  data() {
    return {
      addStatus: false,
      loading: false,
      patientName: "",
      businessType: "",
      medicareType: "",
      requestTimeStrat: "",
      requestTimeStop: "",
      responseTimeStrat: "",
      responseTimeStop: "",
      requestDate: [],
      responseDate: [],
      deptList: {},
      mtShow: {},
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "medicareType",
          label: "医保类型",
          align: "center",
          headerAlign: "center",
          width: "150",
          fixed: false
        },
        {
          prop: "businessType",
          label: "业务类型",
          align: "center",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "patientCode",
          label: "患者编号",
          align: "center",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "patientName",
          label: "患者姓名",
          align: "center",
          headerAlign: "center",
          width: "170"
        },
        {
          prop: "submitData",
          label: "请求数据",
          align: "center",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "returnData",
          label: "返回数据",
          align: "center",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "requestTime",
          label: "请求时间",
          align: "center",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "responseTime",
          label: "响应时间",
          align: "center",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "ip",
          label: "IP地址",
          align: "center",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "mac",
          label: "MAC地址",
          align: "center",
          headerAlign: "center",
          width: "150"
        }
      ],
      // 当前对象
      currentData: {},
      // 表单
      form: {
        siLogId: "",
        medicareType: "",
        businessType: "",
        patientCode: "",
        patientName: "",
        submitData: "",
        returnData: "",
        requestTime: "",
        responseTime: "",
        ip: "",
        mac: ""
      },
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 100
      }
    };
  },
  created() {
    this.getMedicareType();
  },
  mounted() {
    this.listPageSiLogData();
  },
  methods: {
    async getMedicareType() {
      let res = await service.getPagemd();
      if (res.code === 1) {
        if (!res.data.length) {
          return;
        }
        this.medicareType = res.data[0].dictCode;
        res.data.forEach(item => {
          this.mtShow[item.dictCode] = item.dictName;
        });
      }
    },
    requestDateUpdate(e) {
      this.$nextTick(() => {
        if (e == null) {
          this.requestTimeStrat = "";
          this.requestTimeStop = "";
        } else {
          this.$set(this, "requestDate", [e[0], e[1]]);
          this.requestTimeStrat = dateFtt(this.requestDate[0]);
          this.requestTimeStop = dateFtt(this.requestDate[1]);
        }
      });
    },
    responseDateUpdate(e) {
      this.$nextTick(() => {
        if (e == null) {
          this.responseTimeStrat = "";
          this.responseTimeStop = "";
        } else {
          this.$set(this, "responseDate", [e[0], e[1]]);
          this.responseTimeStrat = dateFtt(this.responseDate[0]);
          this.responseTimeStop = dateFtt(this.responseDate[1]);
        }
      });
    },
    async listPageSiLogData() {
      this.loading = true;
      let res = await service.listPageSiLogData({
        pageNo: this.pageParams.pageNo, // 页码
        pageSize: this.pageParams.pageSize, // 页码大小
        patientName: this.patientName,
        businessType: this.businessType,
        medicareType: this.medicareType,
        requestTimeStrat: this.requestTimeStrat,
        requestTimeStop: this.requestTimeStop,
        responseTimeStrat: this.responseTimeStrat,
        responseTimeStop: this.responseTimeStop
      });
      this.loading = false;
      this.tableData = res.data;
      if (typeof tableData !== "undefined") {
        this.currentData = this.tableData[0];
        this.$emit("currentData", this.currentData);
        this.form = { ...this.currentData };
        this.pageParams.total = res.total;
      } else {
        this.currentData = [];
      }
    },
    search() {
      this.pageParams.pageNo = 1;
      this.listPageSiLogData();
    },
    rowClick(row) {
      this.currentData = row;
      this.$emit("currentData", this.currentData);
      this.form = { ...this.currentData };
      this.addStatus = false;
      // this.form.grantDepartmentId = parseInt(row.grantDepartmentId);
    },
    async add() {
      this.form = {
        siLogId: "",
        medicareType: "",
        businessType: "",
        patientCode: "",
        patientName: "",
        submitData: "",
        returnData: "",
        requestTime: "",
        responseTime: "",
        ip: "",
        mac: ""
      };
      this.addStatus = true;
    },
    async dele() {
      if (!this.form.siSignId) {
        this.$message.error("请选择需要删除的项");
        return;
      }
      try {
        // this.$showLoading;
        let res = await service.delOnlinePaySettlementDetailById(
          this.form.OnlinePaySettlementDetailId
        );
        // this.$hideLoading;
        this.$message({ type: "success", message: "删除成功" });
        this.listPageSiLogData();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "删除失败");
      }
    },
    async save() {
      if (this.addStatus) {
        try {
          this.$showLoading();
          console.log(this.form);
          let res = await service.addOnlinePaySettlementDetail(this.form);
          this.$hideLoading();
          if (res.code === 1) {
            this.$message({ type: "success", message: "新增成功" });
            this.listPageSiLogData();
          } else {
            this.$message({ type: "flag", message: "新增失败" });
          }
        } catch (error) {
          console.info(error);
          this.$hideLoading();
          this.$message.error(error.msg || "新增失败");
        }
      } else {
        try {
          this.$showLoading();
          let res = await service.updateOnlinePaySettlementDetail(this.form);
          this.$hideLoading();
          this.$message({ type: "success", message: "保存成功" });
          this.listPageSiLogData();
        } catch (error) {
          console.info(error);
          this.$hideLoading();
          this.$message.error(error.msg || "保存失败");
        }
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.listPageSiLogData();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.listPageSiLogData();
    }
  }
  // watch:{
  //     rangeDate: function (newVal, oldVal) {
  //       console.log(newVal)
  //       if (newVal.length>0) {
  //         this.startDate = dateFtt(newVal[0])
  //         this.endDate = dateFtt(newVal[1])
  //       } else {
  //         this.startDate = null
  //         this.endDate = null
  //       }
  //     }
  //   }
};
</script>
<style lang="scss" scoped>
.margin-top-10 {
  margin-top: 10px;
}
.margin-top-20 {
  margin-top: 20px;
}
.catalogue {
  background-color: #fff;
  .catalogue-left {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    overflow: hidden;
    border-right: 1px solid $l-color-bgcolor-11;
    .search-area {
      display: flex;
      .search-input {
        flex: 1;
      }
    }
    .table-cont {
      flex: 1;
      overflow: hidden;
      margin-bottom: 10px;
      margin-top: 10px;
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
  .catalogue-right {
    width: 300px;
    padding: 10px;
    overflow-y: scroll;
    .catalogue-right-form {
      // height: calc(100% - 46px);
      border-bottom: 1px solid $l-color-bgcolor-11;
    }
    .catalogue-right-btn {
      margin-top: 10px;
    }
  }
}
</style>
