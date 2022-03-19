<template>
  <el-card class="height100 wrapperCls">
    <div class="topPart">
      <div class="tablePart">
        <div class="tablePartUtils">
          <div class="overflow-hidden search-box padding10" style="padding-bottom: 0px;">
            <div class="float-left margin-right-20" style="margin-top: 9px;">
              <el-checkbox-group
                class="float-left"
                @change="categoryCodeChange"
                v-model="categoryCode"
              >
                <el-checkbox label="0">未打印</el-checkbox>
                <el-checkbox label="1">已打印</el-checkbox>
                <el-checkbox label="2">已采样</el-checkbox>
                <el-checkbox label="3">已作废</el-checkbox>
                <el-checkbox label="4">全部</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="overflow-hidden" style="height: 45px; width: calc(100% - 420px)">
              <el-row :gutter="20">
                <el-col :span="12">
                  <l-formt-title label="开嘱时间" class="position-relative float-left">
                    <el-date-picker
                      v-model="dateRange"
                      @change="categoryCodeChange"
                      type="daterange"
                      prefix-icon="null"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      :default-time="['00:00:00', '23:59:59']"
                    ></el-date-picker>
                  </l-formt-title>
                </el-col>
                <el-col :span="12">
                  <l-formt-title label="采样时间"  class="position-relative float-left">
                    <el-date-picker
                      v-model="dateRangeTwo"
                      @change="categoryCodeChange"
                      type="daterange"
                      prefix-icon="null"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      :default-time="['00:00:00', '23:59:59']"
                    ></el-date-picker>
                  </l-formt-title>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="button-wrapper">
            <l-formt-title label="标本类型"  style="width: 180px;" class="position-relative">
              <el-select v-model="sampleType" placeholder="请选择标本类型">
                <el-option
                  label="全部"
                  value="1"
                /></el-select>
            </l-formt-title>
            <l-formt-title label="条码"  style="width: 180px; margin-left: 10px" class="position-relative">
              <el-input v-model="sampleNo"></el-input>
            </l-formt-title>
            <el-button plain @click="fetchAdviceList" class="margin-left-10 vertical11">查询</el-button>
            <el-button plain @click="fetchAdviceList">刷新</el-button>
            <el-button plain @click="printCard">打印条码</el-button>
            <el-button plain @click="voidNo">作废条码</el-button>
            <el-button plain @click="confirmSample">确认采样</el-button>
            <el-button plain @click="cancelSample">取消采样</el-button>
          </div>
        </div>
        <div class="tablePartMain">
          <el-table
            :data="infusionTable.data"
            @selection-change="handleSelectionChange"
            ref="singleTable"
            border
            height="100%"
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              width="32">
            </el-table-column>
            <el-table-column
              v-for="(item, index) in infusionTable.column"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
            >
              <template slot-scope="scope">
                <!--成组-->
                <div v-if="item.prop === 'groupNoCls'">
                  <span :class="scope.row[item.prop]"></span>
                </div>
                <!--频次-->
                <div v-else-if="item.prop === 'frequency'" :val="scope.row.frequency" code="Frequency"
                     v-codeTransform></div>
                <!--用药途径-->
                <div v-else-if="item.prop == 'useWay'">
                  <span :val="scope.row[item.prop]" code="MedicationRouteCode" v-codeTransform></span>
                </div>
                <!--总次数-->
                <template v-else-if="item.prop == 'status'">
                  <div v-if="scope.row['status'] === 0" class="totalDegreeBlue">已打印</div>
                  <div v-else-if="scope.row['status'] === 1" class="totalDegreeGreen">已采样</div>
                  <div v-else>未打印</div>
                </template>
                <div v-else>{{scope.row[item.prop]}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import {onPreview, onPrint} from "@/utils/print";

  export default {
    name: "awaitExecution",
    components: {},
    data() {
      return {
        categoryCode: ["0"], // 状态 已执行、未执行
        dateRange: [], // 时间段
        dateRangeTwo: [], //时间段
        sampleType: '',
        sampleNo:'',
        infusionTable: {
          column: [
            {
              prop: "status",
              label: "状态",
              width: 130
            },
            {
              prop: "name",
              label: "姓名",
              width: 150
            },
            {
              prop: "age",
              label: "年龄",
              align: "center",
              width: 50
            },
            {
              prop: "expedited",
              label: "加急",
              width: 150
            },
            {
              prop: "itemName",
              label: "检验项目",
              width: 80
            },
            {
              prop: "sampleNo",
              label: "条形码",
              width: 80
            },
            {
              prop: "sampleType",
              label: "标本类型",
              width: 150
            },
            {
              prop: "sampleTip",
              label: "采样提示",
              width: 150
            },
            {
              prop: "sampleTime",
              label: "采样时间",
              width: 200
            },
            {
              prop: "samplePerson",
              label: "采样人"
            },
            {
              prop: "startTime",
              label: "开嘱时间"
            },
            {
              prop: "startPerson",
              label: "开嘱医生",
              width: 100
            },
            {
              prop: "department",
              label: "开嘱科室",
              width: 100
            },
            {
              prop: "remark",
              label: "备注",
              width: 100
            },
            {
              prop: "toDepartment",
              label: "送检部门",
              width: 100
            }
          ],
          data: []
        },
        dialogFormVisible: false,
        form: {
          dateRange: [],
          execPerson: '',
          execResult: '',
          remark: "",

        },
        diaFormRules: {
          dateRange: [{
            type: 'array',
            required: true,
            trigger: ["blur", "change"],
            validator: (rule, value, cb) => {
              if (value.length === 0) {
                cb(new Error("请输入开始结束日期"));
              } else {
                cb();
              }
            }
          }],
          execPerson: [
            {required: true, message: '请选择执行人', trigger: 'change'},
          ],
          execResult: [
            {required: true, message: '请选择执行人', trigger: 'change'},
          ],
          remark: [
            {required: this.remarkMust, message: '请输入备注', trigger: 'blur'},
          ],
        },
        remarkMust: false,
        dialogLoading: false,
        selectedList: [],
        execRecordsSelection:[]
      };
    },
    created() {

    },
    mounted() {
      this.fetchAdviceList();
    },
    methods: {
      execRecordsSelectionChange (val){
        this.execRecordsSelection = val;
      },
      getParams() {
        let obj = {
          categoryCode: this.categoryCode,
          sampleType: this.sampleType,
          sampleNo : this.sampleNo
        };
        if (this.dateRange && this.dateRange.length > 1) {
          obj['sDate'] = this.dateRange[0] + " 00:00:00"
          obj['eDate'] = this.dateRange[1] + " 23:59:59"
        }
        if (this.dateRangeTwo && this.dateRangeTwo.length > 1) {
          obj['sTwoDate'] = this.dateRangeTwo[0] + " 00:00:00"
          obj['eTwoDate'] = this.dateRangeTwo[1] + " 23:59:59"
        }
        return obj;
      },
      async fetchAdviceList(obj) {
        // 请求注射医嘱列表
        this.tl_isLoading = true;
        let status = [];
        let params = {};

        // let inpCode = this.receivePatientData.inpCode;
        status = this.categoryCode.map(item => {
          return item.split(",");
        });
        status = status.join(",").split(",");
        status = Array.from(new Set(status));
        // if (!inpCode) {
        //   this.isLoading = false;
        //   this.infusionTable.data = [];
        //   this.selectedList = [];
        //   return;
        // }

        params = {
          ...this.getParams(),
          status,
          // inpCode
        };
        // let {code, data, msg} = await infusionList(params);
        // if (code === 1) {
        let advData = [];
        let data = [{
          // groupNo: 1,
          status: 0,
          orderDate: '2019-02-18',
          groupNo: 1,
          residueDegree:1,
          totalDegree:1,
          drugName: "阿斯",
          spec: 'g',
          id: 1
        }, {
          // groupNo: 1,
          status: 1,
          residueDegree:1,
          totalDegree:1,
          orderDate: '2019-02-18',
          groupNo: 1,
          drugName: "阿斯",
          spec: 'g',
          id: 2
        }, {
          // groupNo: 1,
          status: 2,
          residueDegree:1,
          totalDegree:1,
          orderDate: '2019-02-18',
          groupNo: 1,
          drugName: "阿斯",
          spec: 'g',
          id: 3
        }, {
          // groupNo: 1,
          status: '未拆分',
          residueDegree:1,
          totalDegree:'',
          orderDate: '2019-02-18',
          groupNo: '',
          drugName: "阿斯",
          spec: 'g',
          id: 4
        }, {
          // groupNo: 1,
          status: '未拆分',
          residueDegree:0,
          totalDegree:0,
          orderDate: '2019-02-18',
          groupNo: '2',
          drugName: "阿斯",
          spec: 'g',
          id: 5
        }, {
          // groupNo: 1,
          status: '未拆分',
          residueDegree:0,
          totalDegree:0,
          orderDate: '2019-02-18',
          groupNo: '2',
          drugName: "阿斯",
          spec: 'g',
          id: 6
        }];
        setTimeout(()=>{
          this.infusionTable.data = data;
          this.isLoading = false;
        },10);
      },
      handleSelectionChange(val) {
        this.selectedList = val;
        console.log(this.selectedList);
      },
      categoryCodeChange(val) {

      },
      splitFn() {

      },
      splitAllFn() {

      },
      printCard() {
        if (!this.selectedList || this.selectedList.length <= 0) {
          this.$message.warning("请选择要打印的数据")
          return;
        }
        if (this.selectedList.length > 1) {
          this.$message.warning("只能选择一条数据打印")
          return;
        }
        onPreview(this.selectedList[0], '条码');
      },
      execResultChange(value) {
        if (value === '1' || value === '2') {
          this.remarkMust = true;
        } else {
          this.remarkMust = false;
        }
      },
      execRp() {
        this.dialogFormVisible = true;
      },
      voidNo (){

      },
      confirmSample (){
        // 判断是否添加相同医嘱
        let self = this;
        let haveDup = this.infusionTable.data.find(
          item => item.status !== '0'&& item.status !== '1'
        );
        if (haveDup) {
          this.$confirm("已有相同医嘱, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warn"
          })
            .then(() => {
                console.log("去打印！");
            })
            .catch(() => {

            });
        }
      },
      cancelSample (){

      },
      async confirm() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            alert("校验成功")
            this.dialogFormVisible = false;
          } else {
            return false;
          }
        });
      },
    },
    watch: {
      remarkMust(n) {
        this.diaFormRules.remark[0].required = n
      }
    },
    computed: {}
  }
</script>

<style scoped lang="scss">
  .wrapperCls {
    .topPart {
      height: 100%;

      .tablePart {
        height: 100%;



        .tablePartUtils {
          height: 106px;
          .button-wrapper {
            padding: 0 10px;
            > button {
              vertical-align: 11px;
            }
          }
          .date-icon {
            top: 10px;
            right: 10px;
            color: #949da3;
          }
        }

        .tablePartMain {
          height: calc(100% - 60px);
        }
      }

      .skinTestSwitch {
        height: 60px;
        /*line-height: 60px;*/
        padding: 10px;
        overflow: visible;
        white-space: nowrap;
      }
    }

    .bottomForm {
      height: 50%;
      padding: 0 10px;

      .bottomForm-table {
        height: calc(100% - 63px)
      }
    }

    .tempDialogs {
      padding: 30px 30px 0;

      > .el-form-item {
        // margin-bottom: 22px !important;
      }
    }

    .bunchingUp {
      display: inline-block;
      color: $l-color-primary1;

      &::after {
        content: "┓";
      }
    }

    .bunchingCenter {
      display: inline-block;
      color: $l-color-primary1;

      &::after {
        content: "┫";
      }
    }

    .bunchingDown {
      color: $l-color-primary1;
      display: inline-block;

      &::after {
        content: "┛";
      }
    }

    .totalDegreeGreen {
      background-color: greenyellow;
    }

    .totalDegreeBlue {
      background-color: dodgerblue;
    }
  }
</style>
