<template>
  <div class="box_container clearfix" ref="page">
    <div>
      <div class="msg_bottom">
        <div>
          <div>
            <div class="out_box">
              <!--<query ref="query"></query>-->
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
          <el-card>
            <el-tabs type="card">
              <div class="out_box">
                <el-table
                  border
                  :data="allergies"
                  width="100%"
                  ref="multipleTable"
                >
                  <el-table-column
                    v-for="(item, index) in tableParams"
                    :prop="item.prop"
                    :label="item.label"
                    :key="index"
                    :min-width="item.width"
                    header-align="center"
                    :align="item.align"
                  >
                    <template slot-scope="scope">
                      <template
                        v-if="item.prop == 'executeTime' && ('待执行' === scope.row['status'] || !scope.row['status'])">
                        <el-button
                          size="mini"
                          @click="showExecuteTest(scope.row)">执行皮试
                        </el-button>
                      </template>
                      <template v-else-if="item.prop == 'registerResult'">
                        <template v-if="scope.row['registerResult'] === 1">
                          <div style="background-color: red;color :white">阳性</div>
                        </template>
                        <template v-else-if="scope.row['registerResult'] === 0">
                          <span>阴性</span>
                        </template>
                        <template v-else>
                          <span></span>
                        </template>
                      </template>
                      <template v-else-if="item.prop == 'patientFrom'">
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
            </el-tabs>
          </el-card>
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

    <el-dialog
      title="皮试开始"
      :visible.sync="executeVisible"
      width="50%"
    >
      <el-form :model="allergyPatientInfoVO">
        <el-form-item label="皮试时长:">
          <el-input v-model="allergyPatientInfoVO.duration" placeholder="输入皮试时长" type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
          分钟
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="allergyPatientInfoVO.executeTime"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="executeTest">执行皮试</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {page, executeTest} from "@/api/common/allergy";
  import allergyAdd from "./drugAllergyRecordAdd";
  // import query from "./query";

  export default {
    components: {
      allergyAdd
      // , query
    },
    data() {
      return {
        executeVisible: false,
        deptType: '',
        dialogVisible: false,
        doctorId: '',
        allergyQueryParam: {},
        allergyPatientInfoVO: {},
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
            width: 150
          },
          {
            prop: "patientName",
            label: "患者",
            align: "center",
            width: 90
          },
          {
            prop: "drugName",
            label: "药品",
            align: "center",
            width: 90
          },
          {
            prop: "onceDosage",
            label: "单次剂量",
            align: "center",
            width: 90
          },
          {
            prop: "diagnosisTime",
            label: "开方时间",
            align: "center",
            width: 120
          },
          {
            prop: "executeTime",
            label: "皮试时间",
            align: "center",
            width: 120
          },
          {
            prop: "testWay",
            label: "试验方式",
            align: "center",
            width: 60
          },
          {
            prop: "allergyName",
            label: "过敏原",
            align: "center",
            width: 60
          },
          {
            prop: "symptomDescription",
            label: "症状描述",
            align: "center",
            width: 120
          },
          {
            prop: "registerResult",
            label: "皮试结果",
            align: "center",
            width: 60
          },
          {
            prop: "executorName",
            label: "皮试人",
            align: "center",
            width: 90
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
      // this.queryAllergyPatientInfo(this.allergyPatientInfoVO);
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
        // console.log(this.allergyQueryParam);
        if (this.queryDate) {
          this.allergyQueryParam.startTime = this.queryDate[0];
          this.allergyQueryParam.endTime = this.queryDate[1];
        } else {
          this.allergyQueryParam.startTime = null;
          this.allergyQueryParam.endTime = null;
        }
        this.allergyQueryParam.allergyCategory = '0';
        let res = await page(this.allergyQueryParam);
        // console.log(res.data);
        this.allergies = res.data;
      },
      showExecuteTest(data) {
        // console.log(data);
        this.allergyPatientInfoVO = data;
        // console.log(this.allergyPatientInfoVO);
        this.executeVisible = true;
      },
      async executeTest() {
        // console.log(this.allergyPatientInfoVO);
        this.executeVisible = false;
        let res = await executeTest(this.allergyPatientInfoVO);
        if (res.code === 1) {
          this.queryAllergyPatientInfo();
          this.allergyPatientInfoVO = {};
        }
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
