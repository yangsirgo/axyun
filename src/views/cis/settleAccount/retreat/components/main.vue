<template>
  <div class="height100" ref="page">
    <div class="retreat-main width100 height-button-main">
      <el-table
        :data="proTableData"
        stripe
        border
        ref="singleTable"
        :element-loading-text="$t('retreat.loadInfo')"
        @selection-change="getRowsIdx"
        :span-method="objectSpanMethod"
      >
        <el-table-column
          type="selection"
          width="32"
          align="center"
        ></el-table-column>
        <el-table-column
          v-for="(item, index) in proParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          header-align="left"
          :align="item.align"
          show-overflow-tooltip
          :min-width="item.width"
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'statisticsCode'">
              <span
                :val="scope.row[item.prop]"
                code="order_type"
                v-codeTransform
              ></span>
            </template>
            <template v-else-if="item.prop === 'chargePrice'">
              <span>{{scope.row[item.prop].toFixed(2)}}</span>
            </template>
            <template v-else-if="item.prop === 'totalMoney'">
              <span>{{scope.row[item.prop].toFixed(2)}}</span>
            </template>
            <template v-else>
              <span class="overflow-point">
                {{ scope.row[item.prop] }}
              </span>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <el-form ref="retreatForm" :model="retreatInfo" :rules="rules">
        <el-row :gutter="20" class="margin-top-20">
          <el-col :span="6">
            <el-form-item prop="remark">
              <LFormtTitle label="退号原因" required>
                <el-select v-model="retreatInfo.remark" placeholder="请选择">
                  <el-option
                    v-for="item in remarkOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="type">
              <LFormtTitle label="退款方式" required>
                <el-select v-model="retreatInfo.type" placeholder="请选择">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="retreat-bottom height-button-bottom">
      <el-row>
        <el-button
          type="primary"
          v-hotKey="{ func: 'func_submit' }"
          @click="confirmRetreat"
          :disabled="retreatBtnDisable"
          >确认退号</el-button
        >
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import retreatDialog from "../components/retreatDialog.vue";
import service from "@/api/appointment/retreat";
import appointment from "@/api/appointment/appointment";
export default {
  name: "index",
  components: {
    retreatDialog
  },
  data() {
    return {
      retreatBtnDisable: false,
      proParams: [
        {
          prop: "statisticsCode",
          label: "项目类型",
          align: "left",
          width: "100"
        },
        {
          prop: "itemName",
          label: "项目名称",
          align: "left",
          width: "150"
        },
        {
          prop: "itemQuantity",
          label: "数量",
          align: "left",
          width: "50"
        },
        {
          prop: "chargePrice",
          label: "单价（元）",
          align: "right",
          width: "80"
        },
        {
          prop: "totalMoney",
          label: "金额（元）",
          align: "right",
          width: "120"
        }
      ],
      // 表格数据
      proTableData: [],
      remarkOptions: [
        {
          value: "1",
          label: "挂错科"
        },
        {
          value: "2",
          label: "不看病了"
        }
      ],
      typeOptions: [
        {
          value: "1",
          label: "就诊卡"
        }
        // ,
        // {
        //   value: "2",
        //   label: "医保卡"
        // }
      ],
      //当前选中患者
      currentPatient: {},
      retreatInfo: {
        ids: [],
        remark: "",
        type: ""
      },
      total: 3, //总页数
      tlm_noMore: false, // 没有更多数据， 禁用加载
      tlm_isLoading: false, // 请求数据中
      patientInfo: {}, //患者数据
      rules: {
        type: [{ required: true, message: "请选择退款方式", trigger: "blur" }],
        remark: [{ required: true, message: "请选择退号原因", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(value) {
        if (value.patientId) {
          this.currentPatient = value;
          if(!value.tradeId){
            this.resetPatient();
            this.$message("未查询到此患者可退的预约信息");
            return;
          }
          this.getTradeInfo(value.tradeId);
        }
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    //打印发票
    fpClick() {},
    // 表格分组
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else if(rowIndex === 1){
            return {
              rowspan: 0,
              colspan: 0
            };
          }
          else {
            return {
              rowspan: 1,
              colspan: 1
            };
          }
        }
      },
    async getTradeInfo(tradeId) {
      await service
        .getTradeDetail({
          tradeId: tradeId
        })
        .then(res => {
          this.proTableData = [];
          res.data.forEach(item=>{
            if(item.orderType == '86' || item.orderType == '85'){
              this.proTableData.push(item);
            }
          });
          res.data.forEach(item=>{
            if(item.orderType != '86' && item.orderType != '85'){
              this.proTableData.push(item);
            }
          });
          
        })
        .catch(err => {
          this.$message.error(error.msg || "标准错误提示");
        });
    },
    getRowsIdx(rows) {
      let ids = [];
      rows.forEach(item => {
        if(item.orderType == '86' || item.orderType == '85'){   // 85 是诊疗费，86 是挂号费  退号这两个必须一起退
          this.proTableData.forEach(item=>{
            if(item.orderType == '86' || item.orderType == '85'){
              ids.push(item);
            }
          });
        }else{
          ids.push(item);
        }
      });
      this.retreatInfo.ids = ids;
      this.retreatBtnDisable = rows.length <= 0;
    },
    //确认退号
    confirmRetreat() {
      this.$refs["retreatForm"].validate(valid => {
        if (!valid) {
          return;
        }
        if(!this.retreatInfo.ids || this.retreatInfo.ids.length <= 0){
          this.$message('请选择退费明细');
          return;
        }
        this.$showLoading();
        service
          .outpRefund({
            tradeId: this.currentPatient.tradeId,
            dataVersion: this.currentPatient.dataVersion,
            outpChargeDetailList: this.retreatInfo.ids,
            visitId: this.currentPatient.appointmentId || "0"  // url 传空404 约定0
          })
          .then(res => {
            res.code === 1 && this.$message.success("退号成功");
            // this.getTradeInfo(this.currentPatient.tradeId);
            this.$hideLoading();
            this.resetPatient();
          })
          .catch(err => {
            this.$hideLoading();
            this.$message.error(err.msg || "标准错误提示");
          });
      });
    },
    //滑动加载更多信息
    load() {
      const _this = this;
      this.searchForm.page++;
      setTimeout(function() {
        let proData = [..._this.tableData];
        //获取分页列表
        // this.search();
        //模拟返回数据
        let newProList = [
          {
            patientId: "12345678",
            patientNo: "0003948525",
            patientName: "张少华",
            patientGender: 1,
            patientAge: 20,
            depart: "泌尿科",
            type: "普通",
            doctor: "赵磊",
            date: "上午",
            orderDate: "2019-05-02 08:56",
            registrateDate: "2019-05-03 09:31",
            registrateMan: "李海",
            status: "失效",
            backReason: "挂错科室",
            backDate: "2019-05-09 09:21",
            backMan: "111"
          }
        ];
        if (_this.page >= _this.total) {
          _this.tlm_noMore = true;
        }
        _this.tableData = [...proData.concat(newProList)];
        _this.tlm_isLoading = false;
      }, 2000);
    },
    // 清空数据
    resetPatient() {
      // this.currentPatient = {};
      this.proTableData = [];
    }
  }
};
</script>

<style lang="scss">
.retreat-main {
  background: #fff;
  padding: 20px;
}
.margin-top-20 {
  margin-top: 20px;
}
.retreat-bottom {
  padding: 20px;
  text-align: right;
  background: #fff;
  border-top: 1px solid $l-color-border-3;
  border-radius: 0 0 4px 4px;
}
</style>
