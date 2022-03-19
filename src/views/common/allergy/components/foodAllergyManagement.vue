<template>
  <div class="box_container clearfix" ref="page">
    <div>
      <div class="msg_bottom">
        <div>
          <div>
            <div class="out_box">
              <el-form inline ref="queryForm" :model="allergyQueryParam">
                <el-form-item>
                  <el-date-picker
                    v-model="queryDate"
                    type="daterange"
                    align="right"
                    size="mini"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-input
                    size="mini"
                    placeholder="搜索病人"
                    v-model="allergyQueryParam.queryString"
                    suffix-icon="el-icon-search"
                    clearable>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="queryAllergyPatientInfo">查询</el-button>
                </el-form-item>
                <el-form-item right>
                  <el-button type="primary">
                    过敏登记
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="out_box">
            <el-table
              border
              :data="allergies"
              width="100%"
              ref="multipleTable"
            >
              <el-table-column
                v-for="(item) in tableParams"
                :key="item.value"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                header-align="center"
                :align="item.align"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop == 'patientFrom'">
                    <template v-if="scope.row['patientFrom'] === 1 ">
                      <span>门诊</span>
                    </template>
                    <template v-else>
                      <span>家床</span>
                    </template>
                  </template>
                  <template v-else>
                    {{scope.row[item.prop]}}
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="过敏信息登记"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <allergyAdd
        @rechargeConfirm="rechargeConfirmAdd"
        @rechargeCancel="rechargeCancelAdd">
      </allergyAdd>


    </el-dialog>
  </div>
</template>
<script>
  import {page} from "@/api/common/allergy";
  // import query from "./query";

  export default {
    // components: {query},
    data() {
      return {
        input: '',
        deptType: '',
        dialogVisible: false,
        doctorId: '',
        allergyQueryParam: {},
        allergies: [],
        // 表格数据
        tableParams: [
          {
            prop: "status",
            label: "状态",
            align: "center",
            width: 50
          },
          {
            prop: "patientFrom",
            label: "来自",
            align: "center",
            width: 50
          },
          {
            prop: "deptName",
            label: "科室",
            align: "center",
            width: 50
          },
          {
            prop: "patientCode",
            label: "病案号",
            align: "center",
            width: 120
          },
          {
            prop: "patientName",
            label: "患者",
            align: "center",
            width: 90
          },
          {
            prop: "doctorId",
            label: "就诊医生",
            align: "center",
            width: 90
          },
          {
            prop: "visitTime",
            label: "就诊时间",
            align: "center",
            width: 120
          },
          {
            prop: "allergyName",
            label: "过敏类型",
            align: "center",
            width: 90
          },
          {
            prop: "allergyName",
            label: "过敏原",
            align: "center",
            width: 90
          },
          {
            prop: "symptomDescription",
            label: "症状描述",
            align: "center",
            width: 200
          },
          {
            prop: "registerTime",
            label: "登记时间",
            align: "center",
            width: 120
          },
          {
            prop: "registerId",
            label: "登记人",
            align: "center",
            width: 60
          },
          {
            prop: "remark",
            label: "备注",
            align: "center",
            width: 90
          }
        ],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const endTime = new Date();
              const startTime = new Date();
              startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [startTime, endTime]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const endTime = new Date();
              const startTime = new Date();
              startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [startTime, endTime]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const endTime = new Date();
              const startTime = new Date();
              startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [startTime, endTime]);
            }
          }]
        },
        queryDate: ''
      }
    },
    mounted() {
      this.queryAllergyPatientInfo();
      // this.queryAllergyPatientInfo(this.$refs.query.allergyPatientInfoVO);
      this.clientHeight = `${document.documentElement.clientHeight}`;
      window.onresize = function temp() {
        this.clientHeight = `${document.documentElement.clientHeight}`;
      };
    },
    methods: {

      // async queryAllergyPatientInfo(data) {
      async queryAllergyPatientInfo() {
        console.log(this.allergyQueryParam);
        if (this.queryDate) {
          this.allergyQueryParam.startTime = this.queryDate[0];
          this.allergyQueryParam.endTime = this.queryDate[1];
        } else {
          this.allergyQueryParam.startTime = null;
          this.allergyQueryParam.endTime = null;
        }
        this.allergyQueryParam.allergyCategory = '1';
        let res = await page(this.allergyQueryParam);
        this.allergies = res.data;
      },
      executeTest(data) {
        console.log(data);
      },
      rechargeConfirmAdd() {
        this.dialogVisible = false;
      },
      rechargeCancelAdd() {
        this.dialogVisible = false;
      }

    }
  }
</script>
<style lang="scss" scoped>
  .box_container {
    overflow: hidden;
  }

  /deep/
  .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px;
  }

  /deep/
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }

  /deep/
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border: none;
  }

  .msg_bottom {
    overflow: hidden;
    height: 100%;
  }

  .box_tabs {
    margin-left: 1046px;
    background-color: #ffffff;
    width: 500px;
    height: 961px;
  }

  /deep/
  .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px;
  }

  .out_box {
    padding: 0 20px;
  }


</style>
