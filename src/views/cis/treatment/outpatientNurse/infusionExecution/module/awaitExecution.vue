<template>
  <el-card class="height100 wrapperCls">
    <div class="topPart">
      <div class="tablePart">
        <div class="tablePartUtils">
          <div class="overflow-hidden search-box" style="padding:16px;display:flex;align-items:center;">
            <div class="float-left" style="margin-right:16px;">
              <!-- <el-checkbox-group
                class="float-left"
                @change="orderStatusChange"
                v-model="orderStatus"
              >
                <el-checkbox label="4">未完成</el-checkbox>
                <el-checkbox label="11">已完成</el-checkbox>
                <el-checkbox label="">全部</el-checkbox>
              </el-checkbox-group> -->
              <el-radio-group class="float-left" v-model="orderStatus" @change="orderStatusChange">
                <el-radio :label="99">全部</el-radio>
                <el-radio :label="4">未拆分</el-radio>
                <el-radio :label="10">已拆分</el-radio>
                <el-radio :label="11">已完成</el-radio>
              </el-radio-group>
            </div>
            <div class="overflow-hidden" style="font-size:0;">
              <l-formt-title label="开嘱时间" style="width: 350px;margin-right:16px;" class="position-relative float-left">
                <el-date-picker v-model="dateRange" @change="categoryCodeChange" type="daterange" prefix-icon="null"
                  start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
              </l-formt-title>
              <el-button plain @click="splitFn">拆分</el-button>
              <el-button plain @click="splitAllFn">全部拆分</el-button>
              <el-button plain @click="printCard(1)">打印输液卡</el-button>
              <el-button plain @click="printCard(2)">打印瓶贴</el-button>
            </div>
          </div>
        </div>
        <div class="tablePartMain" style="padding:0 16px;">
          <el-table :data="infusionTable.data" @selection-change="handleSelectionChange" ref="singleTable" @select="selectItem"
            border height="100%" style="width: 100%">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column v-for="(item, index) in infusionTable.column" :key="index" :prop="item.prop" :label="item.label"
              :min-width="item.width">
              <template slot-scope="scope">
                <!--成组-->
                <div v-if="item.prop === 'groupNoCls'">
                  <span :class="scope.row[item.prop]"></span>
                </div>
                <!--执行明细状态-->
                <div v-else-if="item.prop == 'orderStatus'">
                  <div v-if="scope.row['orderStatus'] == 4">未拆分</div>
                  <div v-else-if="scope.row['orderStatus'] == 10">已拆分</div>
                  <div v-else-if="scope.row['orderStatus'] == 11">已完成</div>
                  <div v-else-if="scope.row['orderStatus'] == 2">未拆分</div>
                  <div v-else>--</div>
                </div>
                <!--频次-->
                <div v-else-if="item.prop === 'frequencyCode'" :val="scope.row.frequencyCode" code="Frequency"
                  v-codeTransform></div>
                <!-- <span v-else-if="item.prop === 'frequency'"
                  columns="FREQUENCY_NAME"
                  :conditionMap="{ FREQUENCY_CODE: scope.row.frequency }"
                  tableName="hrp_frequency"
                  v-tableTransform></span> -->
                <!--用药途径-->
                <div v-else-if="item.prop == 'useWay'">
                  <span :val="scope.row[item.prop]" code="MedicationRouteCode" v-codeTransform></span>
                </div>
                <!--计量和单位-->
                <div v-else-if="item.prop == 'onceDosage'">
                  <span>{{scope.row[item.prop]}}</span><span :val="scope.row.dosageUnit" code="DrugDoseUnit"
                    v-codeTransform></span>
                </div>
                <!--计量单位-->
                <!-- <div v-else-if="item.prop == 'dosageUnit'">
                  <span :val="scope.row[item.prop]" code="DrugDoseUnit" v-codeTransform></span>
                </div> -->
                <!--总次数-->
                <template v-else-if="item.prop == 'allSum'">
                  <div v-if="scope.row['allSum'] === 0" class="totalDegreeGreen">{{scope.row['allSum']}}</div>
                  <div v-else-if="scope.row['allSum'] > 0" class="totalDegreeBlue">{{scope.row['allSum']}}</div>
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
      <l-card-title class="title" style="padding:16px 0;">
        <span slot="left">执行记录</span>
        <span slot="right">
          <el-button type="primary" @click="execRpBefore">执行</el-button>
          <el-button type="" @click="cancelExecRecordListFun">撤回</el-button>
        </span>
      </l-card-title>
      <div class="bottomForm-table">
        <el-table :data="record.recordData" border ref="recordsTable" height="100%" style="width: 100%" @cell-click="radioChangeCell">
          <el-table-column label="" width="50">
            <template slot="header" slot-scope="scope">
              <el-checkbox v-model="tableRadioAll" true-label=1 false-label=0 @change="tableRadioAllChange(tableRadioAll)"></el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.tableRadio" true-label=1 false-label=0 @change="radioChange(scope.row)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column v-for="(item, index) in record.column" :key="index" :prop="item.prop" :label="item.label"
            :min-width="item.width">
            <template slot-scope="scope">
              <!--执行明细状态-->
              <div v-if="item.prop == 'execStatus'">
                <div v-if="scope.row['execStatus'] == 0">待执行</div>
                <div v-else-if="scope.row['execStatus'] == 1">执行中</div>
                <div v-else-if="scope.row['execStatus'] == 2">完成</div>
                <div v-else-if="scope.row['execStatus'] == 3">取消</div>
                <div v-else-if="scope.row['execStatus'] == 4">终止</div>
                <div v-else>--</div>
              </div>
              <div v-else>{{scope.row[item.prop]}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <el-dialog title="执行确认" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" class="tempDialogs" :model="form" :rules="diaFormRules" v-loading="dialogLoading">
        <el-form-item label="" prop="dateRange">
          <!-- :picker-options="pickerOptions" -->
          <l-formt-title :required="true" label="选择执行时间" class="position-relative float-left">
            <el-date-picker v-model="form.dateRange" @change="datePickerChange" type="datetimerange" start-placeholder="开始时间"
              end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss "></el-date-picker>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="execId">
          <l-formt-title label="执行人" :required="true">
            <el-select v-model="form.execId" placeholder="请选择" @change="execPersonOption">
              <el-option v-for="(item, index) in execPersonList" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="execStatus">
          <l-formt-title label="执行结果" :required="true">
            <el-select v-model="form.execStatus" placeholder="请选择执行结果" @change="execResultChange">
              <el-option label="完成" value="2"></el-option>
              <el-option label="终止" value="4"></el-option>
              <el-option label="取消" value="3"></el-option>
            </el-select>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="remark">
          <l-formt-title label="备注">
            <el-input v-model="form.remark"></el-input>
          </l-formt-title>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm" :disabled="confirmBtnStyle">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <div style="margin: 20px;">是否今天用药？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="todayNoUse">否</el-button>
        <el-button type="primary" @click="todayUse">是</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
  import {
    getExecResult
  } from "@/api/cis/opnw/opnw"; //查询皮试结果
  import {
    mapGetters
  } from "vuex";
  import {
    onPreview,
    onPrint,
    onPreviewData
  } from "@/utils/print";
  import {
    infusionList,
    checkDivisionOrders,
    divisionOrders,
    findExecList,
    execConfirmation,
    cancelExecRecordList
  } from "@/api/cis/treatment/infusion";
  import {
    getUN
  } from "@/utils/crypto";
  import {
    formatTime
  } from "@/utils/index";
  import {
    getUserId,
    removeToken
  } from "@/utils/auth";
  import Base64 from "@/utils/base64.js";
  import {
    transformCode
  } from "@/api/directive/directiveRequest";
  import {
    getPrintData,
    printButtoData
  } from "@/api/cis/visit/visit";
  import { injectionTpl, handlePrintData } from '@/printTemplete/module/injectionTpl.js'
  import { print } from "@/utils/print_new.js";
  import codes from "@/printTemplete/code.js";
  import { getPrintTpl } from "@/api/admin/print/print";

  var iTime;
  export default {
    name: "awaitExecution",
    components: {},
    data() {
      return {
        confirmBtnStyle:false,
        codeTransformObj: {},
        pickerOptions: {
          disabledDate: (time) => {
            let nowData = new Date()
            nowData = new Date(nowData.setDate(nowData.getDate() - 1))
            console.log(time)
            console.log(nowData)
            return time < nowData
          }

        },
        findExecListIds: '',
        findExecListGroupNos: '',
        execPersonList: [{
          name: getUN(),
          value: Base64.decode(getUserId())
        }],
        tableRadio: '',
        execList: [],
        idArr: '',
        groupNoArr: '',
        divisionOrdersParams: {
          endDate: "",
          execId: "",
          execName: "",
          execNo: "",
          execStatus: "",
          execTime: "",
          execType: "0", // 执行类型   0-输液  1-注射  2-皮试  3-治疗'
          ids: "",
          opentionType: "",
          remark: "",
          startDate: "",
          groupNos: "",
          visitCodes: "",
        },
        dialogVisible: false,
        orderStatus: 99, // 状态 未完成传4 已完成传11 默认全部99
        dateRange: [], // 时间段
        infusionTable: {
          column: [{
              prop: "orderStatus",
              label: "执行明细状态",
              width: 130
            },
            {
              prop: "diagnosisTime",
              label: "开单日期",
              width: 150
            },
            {
              prop: "orderItemName",
              label: "医嘱名称",
              width: 150
            },
            {
              prop: "groupNoCls",
              label: "组",
              align: "center",
              width: 50
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
            // {
            //   prop: "dosageUnit",
            //   label: "剂量单位",
            //   width: 80
            // },
            {
              prop: "frequencyName",
              label: "频次",
              width: 150
            },
            // {
            //   prop: "frequencyCode",
            //   label: "频次",
            //   width: 150
            // },
            {
              prop: "useWay",
              label: "用药途径",
              width: 150
            },
            // {
            //   prop: "dropRate",
            //   label: "滴速",
            //   width: 200
            // },
            {
              prop: "useDay",
              label: "用药天数"
            },
            {
              prop: "remark",
              label: "备注"
            },
            {
              prop: "allSum",
              label: "总次数",
              width: 100
            },
            {
              prop: "residueCount",
              label: "剩余次数",
              width: 100
            },
            {
              prop: "doctorName",
              label: "开嘱医生",
              width: 100
            },
            {
              prop: "ouptDeptName",
              label: "开嘱科室",
              width: 100
            }
          ],
          data: []
        },
        record: {
          recordData: [],
          column: [{
              prop: "orderItemName",
              label: "执行附加医嘱",
              width: 150
            },
            // {
            //   prop: "spec",
            //   label: "规格",
            //   width: 120
            // },
            {
              prop: "executedQuantity",
              label: "数量",
              width: 60
            },
            {
              prop: "scheduledTime",
              label: "计划时间",
              width: 120
            },
            {
              prop: "execStartTime",
              label: "开始时间",
              width: 120
            },
            {
              prop: "execEndTime",
              label: "结束时间",
              width: 120
            },
            {
              prop: "execName",
              label: "执行人",
              width: 80
            },
            // {
            //   prop: "updatedAt",
            //   label: "确认执行时间",
            //   width: 120
            // },
            // {
            //   prop: "updatedByName",
            //   label: "确认人",
            //   width: 80
            // },
            {
              prop: "execStatus",
              label: "执行结果",
              width: 80
            },
            {
              prop: "remark",
              label: "备注"
            }
          ],
        },
        dialogFormVisible: false,
        form: {
          dateRange: [],
          execId: '',
          execStatus: '',
          remark: "",
          execName: '',
          startDate: "",
          endDate: "",
          execType: "0", //执行类型0-输液  1-注射  2-皮试  3-治疗',
          id: ''
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
          execId: [{
            required: true,
            message: '请选择执行人',
            trigger: 'change'
          }, ],
          execStatus: [{
            required: true,
            message: '请选择执行结果',
            trigger: 'change'
          }, ],
          remark: [{
            required: false,
            message: '请输入备注',
            trigger: 'blur'
          }, ],
        },
        remarkMust: false,
        dialogLoading: false,
        selectedList: [],
        execRecordsSelection: [],
        waitExecRp: {},
        execRpList: [], //需要保存的执行记录
        tableRadioAll: "0"
      };
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"]),
      ...mapGetters("user", ["name", "role"])
    },
    watch: {
      receivePatientData: {
        handler(value) {

          this.loadData();
        },
        deep: true,
        immediate: true
      },
      "record.recordData.length": {
        handler(value) {
          this.tableRadioAll = false;
          this.tableRadioAllChange(false);
        },
        deep: true,
        immediate: true
      }
    },
    created() {

    },
    mounted() {},
    methods: {
      // 打印成组
    groupingPrint(list1) {
      // 将list 分组
      let list = [];
      let groupList = [];
      let filterList = [];
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
        filterList = list1.filter((sonItem, sonIde) => {
          return item === sonItem.groupNo;
        });
        if(filterList.length) {
          let arr = [];
          for(let i in filterList) {
            arr.push(filterList[i].id);
          }
          list.push(arr);
        }
      });
      console.log("1111111111111111111",list);
      return list;
    },
      // zhengyawen 打印输液卡数据处理
      validatePrintData(type) {
        let data = this.selectedList;
        if (!data.length) {
          this.$message.warning("请选择执行记录再进行打印！");
          return [];
        }
        let arr = [];
        arr = this.groupingPrint(data);

        if (type === 2) {
          let groups = data.map(item => {
            return item.groupNo;
          });
          groups = Array.from(new Set(groups));
          if (groups.length > 1) {
            this.$message.warning("打印瓶贴只能选择一组执行记录！");
            arr = [];
          }
        }
        return arr;
      },
      async printCard(type) {
        let orderId = this.validatePrintData(type);
        if (!orderId.length) {
          return;
        }
        
        for(let i in orderId) {
          await this.printCardFuc(type, orderId[i]);
        }
      },
      // zhengyawen 打印输液卡
      async printCardFuc(type, orderId) {
        try {
          let params = {
            orderStatus: 99,
            orderId,
            visitCode: this.receivePatientData.visitCode,
            pageNo: 0,
            pageSize: 4,
            patientId: this.receivePatientData.patientId,
            printGroup: 3 //1.门诊皮试单、2.门诊注射单、3.输液执行单、4.门诊治疗单
          };
          let num = Math.ceil(orderId.length / 4);
          let numList = [];
          if (type === 1) {
            for (let i = 0; i < num; i++) {
              params.pageNo++
              let res = await getPrintData(params);
              if (res.code === 1) {
                // numList.push(res.data);
                await this.handlePrintFuc(res.data);
              }
            }
            // console.log(numList, "输液卡打印数据");
            // onPreviewData(numList, "皮试单");
        } else if (type === 2) {
          for (let i = 0; i < num; i++) {
            params.pageNo++
            let res = await printButtoData(params);
            if (res.code === 1) {
              numList.push(res.data);
              // await this.handlePrintFuc(res.data);
            }
          }
          onPreviewData(numList, "瓶贴");
        }
      } catch (e) {
        console.log(e)
      }
    },
    handlePrintFuc(printData) {
      let obj = handlePrintData(printData);
      print(null, injectionTpl, {}, obj, true);
    },
    cancelExecRecordListFun() {
      console.log(this.record.recordData, "打印输出的选中的数据");
      let objList = [];
      let objListStyle = false;
      for (let i = 0; i < this.record.recordData.length; i++) {
        if (this.record.recordData[i].tableRadio == '1') {
          objList.push(this.record.recordData[i].id);
          if (this.record.recordData[i].execStatus == '0') {
            objListStyle = true;
            break;
          }
        }
      }

      if (objList.length == '0') {
        this.$message.error("选择至少一条待执行记录");
        return false;
      };
      if (objListStyle) {
        this.$message.error("选择完成状态记录");
        return false;
      }
      this.$showLoading();
      cancelExecRecordList(objList).then(res => {
          if (res.code === 1) {
            this.$message.success(res.msg || "成功");
            this.$emit("changeTabNum"); // 刷新tab未完成数量
            this.loadData()
            this.findExecListFun();
            this.$hideLoading();
          } else {
            this.$hideLoading();
            this.$message.error(res.msg || "撤销失败");
          }
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg);
        });
    },
    formatDate(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },
    // 点击一行 让复选框成为选中状态
    radioChangeCell(row) {
      this.radioChange(row);
    },
    loadData() {
      console.log("this.receivePatientData", this.receivePatientData)
      if (!this.receivePatientData.visitCode) {
        return;
      }
      let params = {
        ...this.getParams(),
        visitCode: this.receivePatientData.visitCode,
        pageNo: 1,
        pageSize: 100,
        execType: "0"
      };
      infusionList(params).then(res => {
          if (res.code === 1) {
            this.infusionTable.data = this.grouping(res.data);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err.msg);
        });
    },
    getParams() {
      let obj = {
        orderStatus: this.orderStatus,
      };
      if (this.dateRange && this.dateRange.length > 1) {
        obj['startDate'] = this.dateRange[0] + " 00:00:00"
        obj['endDate'] = this.dateRange[1] + " 23:59:59"
      }
      return obj;
    },
    orderStatusChange() {
      this.loadData()
    },
    categoryCodeChange(val) {
      this.loadData()
    },
    grouping(list1) {
      // table 数据 成组操作
      // 将list 分组
      // return new Promise((resolve, reject) => {
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
      return tableList
      // resolve(tableList);
      // });
    },
    // 拆分
    splitFn() {
      if (this.selectedList.length < 1) {
        this.$message.warning("请选择至少一条记录!");
        return false;
      }
      const orderStatusflag = this.selectedList.filter(item => item.orderStatus != 4 && item.selfProvided != 0)
      console.log(orderStatusflag)
      if (orderStatusflag.length > 0) {
        this.$message.warning("只能拆分未拆分过的记录!");
        return false;
      }
      this.idArr = []
      this.idArr = this.selectedList.map(item => item.id).join(',')
      this.groupNoArr = this.selectedList.map(item => item.groupNo).join(',')
      console.log(this.idArr)
      this.$showLoading();
      checkDivisionOrders({
          ids: this.idArr,
          groupNos: this.groupNoArr,
          visitCodes: this.receivePatientData.visitCode,
          execType: "0"
        }).then(res => {
          if (res.code === 1) {
            // advData = await this.grouping(res.data);
            // this.infusionTable.data = this.grouping(res.data);
            if (res.data.flag == 1) {
              this.dialogVisible = true
            } else {
              this.doDivisionOrders()
            }
            this.$hideLoading();
          } else {
            this.$hideLoading();
            this.$message.error(res.msg);
          }
          // this.loading = false;
        })
        .catch(err => {
          this.$hideLoading();
          // this.loading = false;
          this.$message.error(err.msg);
        });

    },
    // 全部拆分
    splitAllFn() {

      if (this.infusionTable.data.length == 0) {
        this.$message.warning("列表中没有可以拆分的数据");
        return false;
      }
      let orderStatus4List = this.infusionTable.data.filter(item => item.orderStatus == 4 || item.selfProvided == 0)
      // console.log(orderStatusflag)
      if (orderStatus4List.length == 0) {
        this.$message.warning("列表中没有可以拆分的数据!");
        return false;
      }
      this.$showLoading()
      this.idArr = []
      this.idArr = orderStatus4List.map(item => item.id).join(',')
      this.groupNoArr = orderStatus4List.map(item => item.groupNo).join(',')
      checkDivisionOrders({
          ids: this.idArr,
          groupNos: this.groupNoArr,
          visitCodes: this.receivePatientData.visitCode,
          execType: "0"
        }).then(res => {
          if (res.code === 1) {
            // advData = await this.grouping(res.data);
            // this.infusionTable.data = this.grouping(res.data);
            if (res.data.flag == 1) {
              this.dialogVisible = true
            } else {
              this.doDivisionOrders()
            }
            this.$hideLoading();
          } else {
            this.$hideLoading();
            this.$message.error(res.msg);
          }
          // this.loading = false;
        })
        .catch(err => {
          // this.loading = false;
          this.$message.error(err.msg);
        });
    },
    handleSelectionChange(val) {
      this.selectedList = val;
      let orderStatus10List = val // 20200629 不再控制状态
      if (orderStatus10List.length > 0) {
        this.findExecListIds = orderStatus10List.map(item => item.id).join(',')
        this.findExecListGroupNos = orderStatus10List.map(item => item.groupNo).join(',')
      } else {
        this.findExecListIds = ''
        this.findExecListGroupNos = ''
      }
      let that = this
      clearTimeout(iTime);
      iTime = setTimeout(function() {
        console.log(that.findExecListIds);
        findExecList({
            ids: that.findExecListIds,
            groupNos: that.findExecListGroupNos,
            visitCodes: that.receivePatientData.visitCode,
            execType: '0'
          }).then(res => {
            if (res.code === 1) {
              // advData = await this.grouping(res.data);
              // this.infusionTable.data = this.grouping(res.data);
              console.log('findExecList', res.data);
              let arr = [];
              for (let i in res.data) {
                arr.push({
                  ...res.data[i],
                  tableRadio: 0
                })
              }
              that.record.recordData = arr;
            } else {
              that.$message.error(res.msg);
            }
            // this.loading = false;
          })
          .catch(err => {
            // this.loading = false;
            that.$message.error(err);
          });
      }, 200);
    },
    todayUse() {
      this.divisionOrdersParams.opentionType = 1
      this.dialogVisible = false
      this.doDivisionOrders()
    },
    todayNoUse() {
      this.divisionOrdersParams.opentionType = 0
      this.dialogVisible = false
      this.doDivisionOrders()
    },
    doDivisionOrders() {
      this.$showLoading();
      this.divisionOrdersParams.ids = this.idArr
      this.divisionOrdersParams.groupNos = this.groupNoArr
      this.divisionOrdersParams.visitCodes = this.receivePatientData.visitCode
      // this.divisionOrdersParams.execType = 0
      divisionOrders(this.divisionOrdersParams).then(res => {
          console.log('divisionOrders-------', res)
          if (res.code === 1) {
            this.$message.success("拆分成功");
            this.$emit("changeTabNum"); // 刷新tab未完成数量
            this.loadData()
            this.$hideLoading();
          } else {
            this.$hideLoading();
            this.$message.error(res.msg);
          }
          // this.loading = false;
        })
        .catch(err => {
          this.$hideLoading();
          // this.loading = false;
          this.$message.error(err.msg);
        });
    },
    tableRadioAllChange(num) {
      let data = this.record.recordData;
      for (let i in data) {
        this.$set(data[i], "tableRadio", num);
      }
    },
    radioChange(val) {
      // console.log('radioChange', val);
      this.waitExecRp = val;
      let data = this.record.recordData;
      // let tableRadio = data[0].tableRadio;
      let num = 0;
      for (let i in data) {
        if (data[i].execGroupNo === val.execGroupNo && data[i].scheduledTime === val.scheduledTime) {
          this.$set(data[i], "tableRadio", val.tableRadio)
        }
        if(data[i].tableRadio == this.waitExecRp.tableRadio) {
          num ++;
        }
      }
      if (this.waitExecRp.tableRadio == "1" && num === data.length) {
        this.tableRadioAll = "1";
      } else {
        this.tableRadioAll = "0";
      }
      // console.log(this.tableRadioAll)
    },


    async execRpBefore() {
      let data = this.record.recordData;
      let all = this.infusionTable.data;
      let arr = [];
      let objList = [];
      let objListStyle = false;
      for (let i = 0; i < data.length; i++) {
        if (data[i].tableRadio == '1') {
          objList.push(data[i].id);
          if (data[i].execStatus != '0' && data[i].execStatus != '3') {
            objListStyle = true;
            break;
          }
        }
      }

      if (objList.length == '0') {
        this.$message.error("选择至少一条待执行记录");
        return false;
      };
      if (objListStyle) {
        this.$message.error("选择未完成状态记录");
        return false;
      }

      this.execRpList = []; //需要保存的执行记录
      this.$showLoading();
      for (let i in data) {
        if (data[i].tableRadio != 0) {
          this.$set(this.execRpList, this.execRpList.length, data[i]);
          for (let j in all) {
            if (data[i].execGroupNo === all[j].groupNo) {
              arr.push(all[j].orderItemId);
            }
          }
        }
      }
      if (arr.length) {

        let flag = 2;
        let flag1 = false;
        let objList = [];
        let objhtml = '';
        let objhtmlText = '';
        for (let i = 0; i < this.record.recordData.length; i++) {
          if (this.record.recordData[i].tableRadio == '1') {
            let flagObj = await this.execRp(this.record.recordData[i].id);
            objList.push(flagObj);
          }
        };
        for (let i = 0; i < objList.length; i++) {
          if (objList[i].flag == '3') {
            objhtml += objList[i].msg
          } else if (objList[i].flag == '1') {
            objhtmlText += objList[i].msg
            flag = 1;
          } else {
            flag = 2;
          }
        };
        if (objhtml.length == '0') {
          if (objhtmlText.length == '0') {
            await this.getExecResult();
            this.$hideLoading();
          } else {
            this.$confirm(objhtmlText, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              await this.getExecResult();
            }).catch(async () => {
              this.$refs['ruleForm'].resetFields();
            });
            this.$hideLoading();
          }
        } else {
          this.$hideLoading();
          this.$message.error(objhtml);
        }
      }
      this.$hideLoading();
    },

    // 皮试结果execRp
    async execRp(execId) {
      // 查找皮试结果记录
      let obj = {
        flag: "",
        msg: '',
      };
      let resp = await getExecResult({
        patientId: this.receivePatientData.patientId,
        drugId: execId,
        execId
      });
      if (resp.code == '1') {
        if (resp.data.length !== 0) {
          obj.flag = 1; //阳性
          obj.msg = resp.data[0] || '执行记录阳性是否继续';
        } else if (resp.msg && resp.msg.length !== 0) {
          obj.msg = resp.msg || '不可执行';
          obj.flag = 3;
        } else {
          obj.flag = 2;
        }
      } else {
        obj.msg = resp.msg || '不可执行';
        obj.flag = 3;
      }
      return obj;
    },

    getExecResult() {
      // if (this.execRpList[0] && (this.execRpList[0].execStatus == '0' || this.execRpList[0].execStatus == '3')) {
        this.form = {
          dateRange: [],
          execId: Base64.decode(getUserId()),
          execStatus: '2',
          remark: "",
          execName: '',
          startDate: "",
          endDate: "",
          execType: "0", //执行类型0-输液  1-注射  2-皮试  3-治疗',
          id: ''
        }
        let dayDate = new Date();
        this.form.dateRange[0] = dayDate;
        this.form.startDate = this.formatDate(dayDate);
        let dayDate1 = new Date();
        dayDate1.setTime(dayDate1.getTime() + 40 * 60 * 1000);
        this.form.endDate = this.formatDate(dayDate);
        this.form.dateRange[1] = new Date(dayDate1);
        this.execPersonOption(Base64.decode(getUserId()));
        this.dialogFormVisible = true;
      // } else {
      //   this.$message.warning("请选择可以执行的记录");
      // }
    },
    formatDate(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },
    async confirm() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          let data = this.execRpList;
          let flag = "";
         this.$showLoading();
          this.confirmBtnStyle = true;
          for (let i in data) {
            flag = await this.confirmAfter(data[i]);
            this.waitExecRp = {};
          }
          if (flag === 1) {
            this.$message.success("执行成功");
            this.$refs['ruleForm'].resetFields();
            this.$emit("changeTabNum"); // 刷新tab未完成数量
            this.loadData()
            this.findExecListFun();

          } else {
            this.$message.error(flag);
          }
          this.$hideLoading();
          this.dialogFormVisible = false;
          this.confirmBtnStyle = false;
        } else {
          return;
        }
      });
    },
    findExecListFun() {
      findExecList({
          ids: this.findExecListIds,
          groupNos: this.findExecListGroupNos,
          visitCodes: this.receivePatientData.visitCode,
          execType: '0'
        }).then(res => {
          if (res.code === 1) {
            let arr = [];
            for (let i in res.data) {
              arr.push({
                ...res.data,
                tableRadio: 0
              });
            }
            this.record.recordData = arr;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err.msg);
        });
    },
    async cancelExecRecordList() {
      this.form.id = waitExecRp.id;
      this.form.orderId = waitExecRp.orderId;
      this.form.visitCode = waitExecRp.visitCode;
      this.form.execGroupNo = waitExecRp.execGroupNo;
    },
    async confirmAfter(waitExecRp) {
      this.form.id = waitExecRp.id;
      this.form.orderId = waitExecRp.orderId;
      this.form.visitCode = waitExecRp.visitCode;
      this.form.execGroupNo = waitExecRp.execGroupNo;
      this.form.execNoCheck = 1;
      let flag = "";
      if ((this.form.execStatus == '3' || this.form.execStatus == '4') && this.form.remark == '') {
        flag = "请填写备注";
      }
      try {
        let res = await execConfirmation(this.form);
        if (res.code === 1) {
          flag = 1;
        } else {
          flag = res.msg || "执行失败";
        }
      } catch (err) {
        flag = err.msg || "执行失败";
      }
      return flag;
    },
    datePickerChange(val) {
      console.log('datePickerChange', val);

      if (val && val.length > 1) {
        this.form.startDate = val[0] + " 00:00:00"
        this.form.endDate = val[1] + " 23:59:59"
      } else {
        this.form.startDate = ""
        this.form.endDate = ""
      }
    },
    execPersonOption(val) {
      console.log('execPersonOption', val);
      this.execPersonList.forEach((item, index) => {
        if (item.value == val) {
          this.form.execName = item.name
        }
      });
    },
    execResultChange(value) {
      if (value === '3' || value === '4') {
        this.remarkMust = true;
      } else {
        this.remarkMust = false;
      }
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
    execRecordsSelectionChange(val) {
      this.execRecordsSelection = val;
    },

    //主数据反显
    async transformCode(field, code, val) {
      let params = [{
        field,
        code,
        val
      }];
      if (this.codeTransformObj[`${code}+${val}`]) {
        return this.codeTransformObj[`${code}+${val}`];
      } else {
        try {
          let resData = await transformCode(params);
          if (resData.code === 1) {
            this.codeTransformObj[`${code}${val}`] = resData.data[code];
            return Promise.resolve(resData.data[code]);
          } else {
            return "--";
          }
        } catch (err) {
          return "--";
        }
      }
    },
    printTip() {
      if (this.waitExecRp) {
        this.record.recordData.forEach(row => {
          this.$refs.recordsTable.toggleRowSelection(row);
        });
        let printData = {};
        for (let i in this.selectedList) {
          if (this.selectedList[i].groupNo == this.waitExecRp.execGroupNo) {
            printData = {
              orderItemName: this.selectedList[i].orderItemName,
              spec: this.selectedList[i].spec
            };
          }
        }
        onPreview(printData, '瓶签');
      } else {
        this.$message.warning("请选择一条执行记录才能打印瓶贴")
        return;
      }
    },
  },
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
      padding: 0 16px;

      .bottomForm-table {
        height: calc(100% - 76px)
      }
    }

    .tempDialogs {
      padding: 30px 30px 0;

      >.el-form-item {
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
