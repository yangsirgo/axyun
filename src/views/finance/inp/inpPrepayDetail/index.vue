<template>
  <el-card class="width100 height100 padding10">
    <el-row :gutter="10" class="rowClass">
      <!-- <el-col :span="4">
        <LFormtTitle label="住院状态">
          <l-value-domain
            clearable
            code="InpStatus"
            :value.sync="form.inpRecordStatus"
            placeholder="请选择"
            style="width:100%"
          ></l-value-domain>
        </LFormtTitle>
      </el-col> -->
      <el-col :span="8">
        <LFormtTitle label="预交时间">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable>
          </el-date-picker>
        </LFormtTitle>
      </el-col>
      <el-col :span="4">
        <LFormtTitle label="姓名">
          <el-input v-model="form.patientName" placeholder="姓名" clearable></el-input>
        </LFormtTitle>
      </el-col>
      <el-col :span="4">
        <LFormtTitle label="家床号">
          <el-input v-model="form.inpCode" placeholder="家床号" clearable></el-input>
        </LFormtTitle>
      </el-col>
      <el-col :span="4" class="float-right">
        <el-button type="primary" plain class="float-right" @click="cancal">重置</el-button>
        <el-button type="primary" class="float-right margin-right-10" @click="select">查询</el-button>
      </el-col>
    </el-row>

    <div class="margin-top-10 table">
      <el-table :data="tableData" width="100%" stripe border show-summary :summary-method="getSummaries" v-loadmore="load"
        v-loading="loading" :element-loading-text="$t('retreat.loadInfo')">
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column v-for="(item, index) in tableParams" :key="index" :prop="item.prop" :label="item.label"
          :min-width="item.width" :align="item.align || 'left'" :header-align="item.headerAlign || 'left'" :fixed="item.fixed"  show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="item.prop == 'patientGender'">
              <span :val="scope.row['patientGender']" code="GENDER_CODE" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'inpRecordStatus'">
              <span :val="scope.row[item.prop]" code="InpStatus" v-codeTransform></span>
            </template>

            <template v-else-if="item.prop == 'businessType'">
              <span v-if="scope.row[item.prop] == '0'">普通预缴</span>
              <span v-if="scope.row[item.prop] == '1'">结算预缴</span>
            </template>
            <template v-else-if="item.prop == 'arrivalAccountStatus'">
              <span v-if="scope.row[item.prop] == '0'">未到账</span>
              <span v-if="scope.row[item.prop] == '1'">已到账</span>
            </template>
            <template v-else-if="item.prop == 'recordStatus'">
              <span v-if="scope.row[item.prop] == '1'">普通</span>
              <span v-if="scope.row[item.prop] == '2'">已退</span>
              <span v-if="scope.row[item.prop] == '9'">退费</span>
            </template>
            <template v-else-if="item.prop == 'prepayMoney'">
              <span v-if="scope.row[item.prop]">{{
                formatNumber(scope.row[item.prop])
              }}</span>
              <span v-if="!scope.row[item.prop]">0.00</span>
            </template>
            <template v-else class="overflow-point">{{
              scope.row[item.prop]
            }}</template>
          </template>
        </el-table-column>
      </el-table>
      <el-row :gutter="10" class="margin-top-10 rowClass">
        <el-col :span="6">
          <!-- <el-button type="primary">打印</el-button>
          <el-button type="primary">导出</el-button>-->
        </el-col>
        <el-col :span="18" class="height100 float-right">
          <el-pagination class="float-right page" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageParams.pageNo" :page-sizes="[20, 40, 60, 100, 300, 500, 1000, 3000, 5000, 10000]"
            :page-size="pageParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageParams.total"></el-pagination>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>
<script>
  import {
    mapActions,
    mapGetters
  } from "vuex";
  import service from "@/api/financeManagement/inp.js";
  // 重写date 格式化方法
  // eslint-disable-next-line no-extend-native
  Date.prototype.toLocaleStr = function() {
    var month = ("0" + (this.getMonth() + 1)).slice(-2); // 如果是1-9月，那么前面补0
    var day = ("0" + this.getDate()).slice(-2);
    return this.getFullYear() + "-" + month + "-" + day;
  };
  export default {
    props : {
        userInfo: {
          type: Object,
          default: () => {
            return {}
         }
        }
    },
     watch: {
        userInfo(val) {
          console.info(val);

          this.form = {
              inpCode: val.inpCode,
              startDate:val.admissionTime ||  new Date(new Date().getTime() - 3600 * 1000 * 24 * 7).format("yyyy-MM-dd") + " 00:00:00",
              stopDate: val.dischargeTime || new Date().format("yyyy-MM-dd") + " 23:59:59"
            };
          this.admissionTime = val.admissionTime ||  new Date(new Date().getTime() - 3600 * 1000 * 24 * 7).format("yyyy-MM-dd") + " 00:00:00";
          this.dischargeTime = val.dischargeTime || new Date().format("yyyy-MM-dd") + " 23:59:59";
          this.date = [this.userInfo.admissionTime || new Date(new Date().getTime() - 3600 * 1000 * 24 * 7).format("yyyy-MM-dd") + " 00:00:00",this.userInfo.dischargeTime||new Date().format("yyyy-MM-dd") + " 23:59:59"];
            console.info(this.date);
            this.getPrepayDetail();
        }
    },
    data() {
      return {
        // 表格loading
        loading: false,
        // 下拉框loading
        selLoading: false,
        // 表格
        tableData: [],
        tableParams: [
          /* {
            prop: "receiptNum",
            label: "收据号",
            align: "left",
            headerAlign: "center",
            width: "120",
            fixed: false,
          }, */
          {
            prop: "inpCode",
            label: "家床号",
            align: "left",
            headerAlign: "center",
            width: "120",
            fixed: false,
          },
          {
            prop: "patientName",
            label: "患者姓名",
            align: "left",
            headerAlign: "center",
            width: "120",
            fixed: false,
          },
          {
            prop: "patientGender",
            label: "患者性别",
            align: "left",
            headerAlign: "center",
            width: "120",
            fixed: false,
          },
          {
            prop: "inpRecordStatus",
            label: "家床状态",
            align: "left",
            headerAlign: "center",
            width: "120",
            fixed: false,
          },
          {
            prop: "prepayMoney",
            label: "预缴金额",
            align: "right",
            headerAlign: "center",
            width: "120",
            fixed: false,
          },
          // {
          //   prop: "businessType",
          //   label: "业务类型",
          //   align: "left",
          //   headerAlign: "center",
          //   width: "120",
          //   fixed: false
          // },
          // {
          //   prop: "arrivalAccountStatus",
          //   label: "到账状态",
          //   align: "left",
          //   headerAlign: "center",
          //   width: "120",
          //   fixed: false
          // },
          {
            prop: "recordStatus",
            label: "状态",
            align: "left",
            headerAlign: "center",
            width: "120",
            fixed: false
          },
          {
            prop: "prepayTime",
            label: "预缴时间",
            align: "left",
            headerAlign: "center",
            width: "160"
          },
          {
            prop: "payTypeName",
            label: "充值方式",
            align: "left",
            headerAlign: "center",
            width: "100"
          },
          {
            prop: "thirdPartyPrepayName",
            label: "代办人",
            align: "left",
            headerAlign: "center",
            width: "100"
          },
          {
            prop: "thirdPartyPrepayIdNum",
            label: "代办人身份证",
            align: "left",
            headerAlign: "center",
            width: "120"
          },
          {
            prop: "prepayUserName",
            label: "操作者",
            align: "left",
            headerAlign: "center",
            width: "100"
          },
          {
            prop: "prepayTime",
            label: "操作时间",
            align: "left",
            headerAlign: "center",
            width: "160"
          },
          {
            prop: "depositBank",
            label: "开户银行",
            align: "left",
            headerAlign: "center",
            width: "100"
          },
          {
            prop: "companyName",
            label: "单位名称",
            align: "left",
            headerAlign: "center",
            width: "100"
          },
          {
            prop: "bankAccount",
            label: "银行账号",
            align: "left",
            headerAlign: "center",
            width: "150"
          },
          {
            prop: "remark",
            label: "备注",
            align: "left",
            headerAlign: "center",
            width: "150"
          },
        ],
        // 查询对象
        form: {
          patientName: "",
          inpCode:this.userInfo.inpCode|| "",
          inpinpRecordStatus: "",
          startDate:this.userInfo.admissionTime|| "",
          stopDate: this.userInfo.dischargeTime||"",
        },
        // 登记时间
        date:[this.userInfo.admissionTime || new Date(new Date().getTime() - 3600 * 1000 * 24 * 7).format("yyyy-MM-dd") + " 00:00:00",this.userInfo.dischargeTime||new Date().format("yyyy-MM-dd") + " 23:59:59"],
        // 分页
        pageParams: {
          pageNo: 1,
          pageSize: 20,
          total: 100
        },
        // 下拉选项
        options: [],
      };
    },
    computed: {
      ...mapGetters("user", ["role"]),
      // 病区url
      illnessAreaUrl() {
        return "/wadmin/ward-hos?hosId=" + 91;
      },
    },
    mounted() {
      console.log(this.userInfo.admissionTime);
      if(this.userInfo.inpCode){
        this.form.inpCode = this.userInfo.inpCode;
        this.date = [this.userInfo.admissionTime || new Date(new Date().getTime() - 3600 * 1000 * 24 * 7).format("yyyy-MM-dd") + " 00:00:00",this.userInfo.dischargeTime||new Date().format("yyyy-MM-dd") + " 23:59:59"];
      };
      this.getPrepayDetail();
    },
    methods: {
      select(){
        this.pageParams.pageNo = 1;
        this.getPrepayDetail();
      },
      load() {},
      // 查询住院患者
      async getPrepayDetail() {
        try {
          this.loading = true;
          console.info(this.userInfo);

          let obj = {
            ...this.form,
            ...this.pageParams,
            startDate: "",
            stopDate: ""
          };
          if (this.date && this.date.length > 1) {
            obj.startDate = this.date[0];
            obj.stopDate = this.date[1];
          }
          let res = await service.getPrepayDetailtInfo(obj);
          this.tableData = res.data;
          this.pageParams.total = res.total;
          this.loading = false;
        } catch (error) {
          console.info(error);
          this.loading = false;
          this.$message.error(error.msg || "查询失败");
        }
      },
      // 重置
      cancal() {
        this.form = {
          patientName: "",
          inpCode: "",
          inpRecordStatus: "",
          startDate:  new Date(new Date().getTime() - 3600 * 1000 * 24 * 7).format("yyyy-MM-dd") + " 00:00:00",
          stopDate: new Date().format("yyyy-MM-dd") + " 23:59:59"
        };
        this.date = [
          new Date(new Date().getTime() - 3600 * 1000 * 24 * 7).format("yyyy-MM-dd") + " 00:00:00",
          new Date().format("yyyy-MM-dd") + " 23:59:59"
        ]
      },
      // 查询用户
      async selectAllUser(val) {
        try {
          this.selLoading = true;
          let res = await service.getAllUser({
            userName: val || "",
          });
          this.options = res.data;
          this.selLoading = false;
        } catch (error) {
          this.selLoading = false;
          this.$message.error(error.msg || "搜索用户失败");
        }
      },
      // 分页
      handleSizeChange(val) {
        this.pageParams.pageSize = val;
        this.getPrepayDetail();
      },
      handleCurrentChange(val) {
        this.pageParams.pageNo = val;
        this.getPrepayDetail();
      },
      // 千位分隔
      formatNumber(a) {
        if (!a) {
          return "0.00";
        }
        let res = a
          .toFixed(2)
          .toString()
          .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
            return $1 + ",";
          });
        return res;
      },
      getSummaries(param) {
        console.log(param);
        const {
          columns,
          data
        } = param;
        const sums = [];
        columns.forEach((item, index) => {
          if (index == 0) {
            sums[0] = "合计";
          } else if (item.property == "prepayMoney") {
            sums[index] = 0;
            data.forEach((item2, index2) => {
              sums[index] += item2.prepayMoney;
            });
            sums[index] = this.formatNumber(sums[index]);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
    },
  };
</script>
<style lang="scss" scoped>
  /deep/ .el-card__body {
    display: flex;
    flex-direction: column;
  }

  .margin-top-10 {
    margin-top: 10px;
  }

  .table {
    width: 100%;
    flex:1;
    display:flex;
    flex-direction: column;
    height:calc(100% - 50px)
  }

  .rowClass {
    width: 100%;
    height: 36px;
  }

  .page {
    line-height: 28px;
    height: 28px;
  }

  /deep/ .el-table {
    overflow: auto;
    position: initial;
    flex:1;
  }
  /deep/ .el-table__footer{
      height:32px;
  }

  /deep/ .el-table__body-wrapper {
    overflow: initial;
  }

  /deep/ .el-table__header-wrapper {
    overflow: initial;
  }

  /deep/ .el-table__footer-wrapper {
    overflow: initial;
  }
</style>
