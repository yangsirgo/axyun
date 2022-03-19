<template>
  <el-card class="height100 wrapperCls">
    <div class="topPart">
      <div class="tablePart">
        <div class="tablePartUtils">
          <div class="overflow-hidden search-box padding10" style="padding-bottom: 0px;">
            <div class="float-left margin-right-20">
              <l-formt-title label="科室选择" style="width: 200px;margin-right: 20px" class="float-left">
                <l-value-domain
                  :value.sync="deptId"
                  remoteUrl="/wadmin/hos/dept"
                  remoteShowKey="orgNm"
                  remoteValueKey="id"
                  placeholder="请选择"
                  @change="deptChange"
                ></l-value-domain>
              </l-formt-title>
              <el-checkbox-group
                class="float-left"
                style="margin-top: 9px;"
                @change="categoryCodeChange"
                v-model="categoryCode"
              >
                <el-checkbox label="0">未完成</el-checkbox>
                <el-checkbox label="1">已完成</el-checkbox>
                <el-checkbox label="2">全部</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="overflow-hidden" style="height: 45px;">
              <l-formt-title label="开嘱时间" style="width: 350px;" class="position-relative float-left">
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
              <el-button plain @click="splitFn" class="margin-left-10">拆分</el-button>
              <el-button plain @click="splitAllFn">全部拆分</el-button>
              <el-button plain @click="printCard">打印执行卡</el-button>
              <!--<el-button plain @click="printTip">打印瓶贴</el-button>-->
            </div>
          </div>
        </div>
        <div class="tablePartMain">
          <el-table
            :data="infusionTable.data"
            @selection-change="handleSelectionChange"
            ref="singleTable"
            @select="selectItem"
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
                <template v-else-if="item.prop == 'totalDegree'">
                  <div v-if="scope.row['residueDegree'] === 0" class="totalDegreeGreen">{{scope.row['totalDegree']}}</div>
                  <div v-else-if="scope.row['residueDegree'] > 0" class="totalDegreeBlue">{{scope.row['totalDegree']}}</div>
                  <div v-else>--</div>
                </template>
                <div v-else>{{scope.row[item.prop]}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-row class="bottomForm">
      <l-card-title class="title">
        <span slot="left">处方执行记录</span>
        <span slot="right">
          <el-button type="primary" @click="execRp">执行</el-button>
        </span>
      </l-card-title>
      <div class="bottomForm-table">
        <el-table
          @selection-change="execRecordsSelectionChange"
          :data="record.recordData"
          border
          ref="recordsTable"
          height="100%"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="32">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in record.column"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
          >
            <template slot-scope="scope">
              <div>{{scope.row[item.prop]}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <el-dialog title="执行确认" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" class="tempDialogs" :model="form" :rules="diaFormRules" v-loading="dialogLoading">
        <el-form-item label="" prop="dateRange">
          <l-formt-title :required="true" label="选择开始治疗时间" class="position-relative float-left">
            <el-date-picker
              v-model="form.dateRange"
              type="daterange"
              prefix-icon="null"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="execPerson">
          <l-formt-title label="执行人" :required="true">
            <el-select v-model="form.execPerson" placeholder="请选择">
              <el-option
                label="本人"
                value="1"
              ></el-option>
            </el-select>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="execResult">
          <l-formt-title label="执行结果" :required="true">
            <el-select v-model="form.execResult" placeholder="请选择执行结果" @change="execResultChange">
              <el-option
                label="完成"
                value="0"
              ></el-option>
              <el-option
                label="终止"
                value="1"
              ></el-option>
              <el-option
                label="取消"
                value="2"
              ></el-option>
            </el-select>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="remark">
          <l-formt-title label="备注" :required="remarkMust">
            <el-input v-model="form.remark"></el-input>
          </l-formt-title>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
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
        infusionTable: {
          column: [
            {
              prop: "status",
              label: "执行明细状态",
              width: 130
            },
            {
              prop: "orderDate",
              label: "开单日期",
              width: 150
            },
            {
              prop: "groupNoCls",
              label: "组",
              align: "center",
              width: 50
            },
            {
              prop: "drugName",
              label: "医嘱名称",
              width: 150
            },
            {
              prop: "spec",
              label: "规格",
              width: 80
            },
            {
              prop: "onceDosage",
              label: "剂量",
              width: 80
            },
            {
              prop: "frequencyCode",
              label: "频次",
              width: 150
            },
            {
              prop: "useWay",
              label: "用药途径",
              width: 150
            },
            {
              prop: "flowRate",
              label: "滴速",
              width: 200
            },
            {
              prop: "useDay",
              label: "用药天数"
            },
            {
              prop: "remark",
              label: "备注"
            },
            {
              prop: "totalDegree",
              label: "总次数",
              width: 100
            },
            {
              prop: "residueDegree",
              label: "剩余次数",
              width: 100
            },
            {
              prop: "doctorName",
              label: "开嘱医生",
              width: 100
            },
            {
              prop: "inpDeptName",
              label: "开嘱科室",
              width: 100
            }
          ],
          data: []
        },
        deptId:"",
        record: {
          recordData: [{
            id:1,
          },{
            id:2,
          }],
          column: [
            {
              prop: "drugName",
              label: "执行附加医嘱",
              width: 150
            },
            {
              prop: "spec",
              label: "规格",
              width: 80
            },
            {
              prop: "amount",
              label: "数量",
              width: 150
            },
            {
              prop: "planTime",
              label: "计划时间",
              width: 80
            },
            {
              prop: "startTime",
              label: "开始时间",
              width: 120
            },
            {
              prop: "endTime",
              label: "结束时间",
              width: 120
            },
            {
              prop: "execPerson",
              label: "执行人",
              width: 80
            },
            {
              prop: "confirmTime",
              label: "确认执行时间",
              width: 120
            },
            {
              prop: "confirmPerson",
              label: "确认人",
              width: 120
            },
            {
              prop: "execResult",
              label: "执行结果",
              width: 120
            },
            {
              prop: "remark",
              label: "备注"
            }],
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
        };
        if (this.dateRange && this.dateRange.length > 1) {
          obj['sDate'] = this.dateRange[0] + " 00:00:00"
          obj['eDate'] = this.dateRange[1] + " 23:59:59"
        }
        return obj;
      },
      async fetchAdviceList(obj) {
        // 请求治疗医嘱列表
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
          status: '未拆分',
          orderDate: '2019-02-18',
          groupNo: 1,
          residueDegree:1,
          totalDegree:1,
          drugName: "阿斯",
          spec: 'g',
          id: 1
        }, {
          // groupNo: 1,
          status: '未拆分',
          residueDegree:1,
          totalDegree:1,
          orderDate: '2019-02-18',
          groupNo: 1,
          drugName: "阿斯",
          spec: 'g',
          id: 2
        }, {
          // groupNo: 1,
          status: '未拆分',
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
        advData = await this.grouping(data);
        console.log("advData::::",advData);
        this.infusionTable.data = advData;
        this.isLoading = false;
        // } else {
        //   this.$message.error(msg);
        //   this.isLoading = false;
        // }
        // this.tl_isLoading = false;
      },
      grouping(list1) {
        // table 数据 成组操作
        // 将list 分组
        return new Promise((resolve, reject) => {
          let list = [];
          let groupList = [];
          let filterList = [];
          let tableList = [];
          groupList = list1.map(item => {
            // 获取所有组
            return item.groupNo;
          });

          groupList = Array.from(new Set(groupList));
          groupList = groupList.filter((item, index) => {
            // 数组去undefind
            return item !== undefined && item != "";
          });

          groupList.forEach((item, index) => {
            //遍历 成map结构 分组
            // list = [];
            filterList = list1.filter((sonItem, sonIde) => {
              return item === sonItem.groupNo;
            });
            list.push({
              key: item,
              value: filterList
            });
          });
          list.forEach(item => {
            // 将有组item添加class
            let itemList = item.value;
            if (itemList.length == 1) return;
            itemList.map((sonItem, sonIndex) => {
              if (sonIndex === 0) {
                sonItem.groupNoCls = "bunchingUp";
              } else if (sonIndex === itemList.length - 1) {
                sonItem.groupNoCls = "bunchingDown";
              } else {
                sonItem.groupNoCls = "bunchingCenter";
              }
            });
          });
          list.map(item => {
            // 更改list格式
            item.value.map(val => {
              tableList.push(val);
            });
          });
          list1.map(item => {
            // 补充未成组项
            if (!item.groupNo) {
              tableList.push(item);
            }
          });
          resolve(tableList);
        });
      },
      selectItem(list, row) {
        // 单个选中 成组
        let isSelect = list.some(val => row.recordId === val.recordId);
        row._itemChecked = isSelect;
        this.infusionTable.data.map(item => {
          if (
            row.groupNo === item.groupNo &&
            item.id !== row.id &&
            row.groupNo
          ) {
            item._itemChecked = isSelect;
            setTimeout(() => {
              this.$refs.singleTable.toggleRowSelection(item);
            }, 10);
          }
        });

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
        this.$message.warning("暂不支持打印功能！");
        return;
        if (!this.selectedList || this.selectedList.length <= 0) {
          this.$message.warning("请选择要打印的数据")
          return;
        }
        if (this.selectedList.length > 1) {
          this.$message.warning("只能选择一条数据打印")
          return;
        }
        onPreview(this.selectedList[0], '治疗卡');
      },
      printTip() {
        //处方列表选中
        let isRpListChecked = this.selectedList && this.selectedList.length > 0;
        //处方执行记录选中
        let isRpExecChecked = this.selectedList && this.selectedList.length > 0;
        if (!isRpListChecked || !isRpExecChecked) {
          this.$message.warning("请选择要打印的数据")
          return;
        }


        if (this.execRecordsSelection.length > 0) {//如果有处方执行记录选中，打印执行记录
          onPreview(this.execRecordsSelection[0], '瓶签');
        } else {
          //如果没有处方执行记录选中
          // 1.判断处方列表是否一条选中
          if (this.selectedList.length > 1 || this.selectedList.length === 0) {
            this.$message.warning("只能选择一条数据打印")
          } else {
            //2. 处方列表是一条选中，打印所有的执行
            this.record.recordData.forEach(row => {
              this.$refs.recordsTable.toggleRowSelection(row);
            });
            onPreview(this.execRecordsSelection, '瓶签');
          }
        }


      },
      deptChange (){

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
      height: 50%;

      .tablePart {
        height: 100%;

        .tablePartUtils {
          height: 60px;

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
