/* eslint-disable no-unused-expressions */
<template>
  <el-card class="height100 wrapperCls padding16">
    <div class="topPart">
      <el-button @click="printClick">打印皮试</el-button>
      <div class="tablePart">
        <!-- <div class="tablePartUtils">
          <div class="overflow-hidden search-box padding10" style="padding-bottom: 0px;">
            <div class="float-left margin-right-20" style="margin-top: 9px;">
              <el-checkbox-group
                class="float-left"
                @change="categoryCodeChange"
                v-model="categoryCode"
              >
                <el-checkbox label="0">待执行</el-checkbox>
                <el-checkbox label="1">已执行</el-checkbox>
                <el-checkbox label="2">全部</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="overflow-hidden" style="height: 60px;">
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
                <i class="iconfont iconriqi position-absolute date-icon"></i>
              </l-formt-title>
            </div>
          </div>
        </div> -->
        <div class="tablePartMain">
          <el-table
            :data="skinTestTableList.data"
            border
            height="100%"
            style="width: 100%"
            ref="singleTable"
            @select="handleSelect"
            @selection-change="handleSelectionChange"
            :span-method="objectSpanMethod"
          >
            <!-- <el-table-column

              type="selection"
              width="32">
            </el-table-column> -->

            <el-table-column label="单选" width="55">
              <template slot-scope="scope">
                <el-radio
                  v-model="tableRadio"
                  :label="scope.row.id"
                  @change="radioChange"
                  ><i></i
                ></el-radio>
              </template>
            </el-table-column>

            <el-table-column
              v-for="(item, index) in skinTestTableList.column"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
            >
              <template slot-scope="scope">
                <div v-if="item.prop === 'startTime'">
                  <el-button
                    type="text"
                    style="color: blue"
                    @click="handleskintestStart(item)"
                    >执行皮试</el-button
                  >
                </div>
                <!-- <div v-else-if="item.prop === 'status'" class="color1">
                  <span>{{statusArr[scope.row.status]}}</span>
                </div> -->
                <div v-else-if="item.prop === 'uses'" class="color1">
                  <span
                    :val="scope.row[item.prop]"
                    code="MedicationRouteCode"
                    v-codeTransform
                  ></span>
                </div>
                <div v-else-if="item.prop === 'duration'" class="color1">
                  <span v-if="scope.row[item.prop]"
                    >{{ scope.row[item.prop] }}分钟</span
                  >
                  <span v-else></span>
                </div>
                <!--执行明细状态-->
                <div v-else-if="item.prop === 'execStatus'">
                  <div v-if="scope.row[item.prop] == 1">执行中</div>
                  <div v-else-if="scope.row[item.prop] == 2">已执行</div>
                  <div v-else-if="scope.row[item.prop] == 3">取消</div>
                  <div v-else-if="scope.row[item.prop] == 4">中止</div>
                  <div v-else>待执行</div>
                </div>
                <!-- 成组 -->
                <div v-else-if="item.prop === 'groupNoCls'">
                  <span :class="scope.row[item.prop]"></span>
                </div>
                <!--计量和单位-->
                <div v-else-if="item.prop == 'onceDosage'">
                  <span>{{ scope.row[item.prop] }}</span
                  ><span
                    :val="scope.row.dosageUnit"
                    code="DrugDoseUnit"
                    v-codeTransform
                  ></span>
                </div>
                <!--用药途径-->
                <div v-else-if="item.prop == 'useWay'">
                  <span
                    :val="scope.row[item.prop]"
                    code="MedicationRouteCode"
                    v-codeTransform
                  ></span>
                </div>
                <!-- <div
                  v-else-if="item.prop === 'stType'"
                  class="color1"
                >{{stTypeArr[scope.row[item.prop]]}}
                </div> -->
                <div
                  v-else-if="item.prop === 'stType'"
                  class="color1"
                >
                  <span
                    :val="scope.row.stSolutionType || ''"
                    code="SkinTestWay"
                    v-codeTransform
                  ></span>
                </div>
                <div v-else-if="item.prop === 'execResult'" class="color1">
                  <!-- <span>{{registerResultArr[scope.row.execResult]}}</span> -->
                  <div v-if="scope.row['execResult'] == 1">阳性</div>
                  <div v-else-if="scope.row['execResult'] == 2">阴性</div>
                  <div v-else>--</div>
                </div>

                <!-- <div v-else-if="item.prop == 'receiveDept'">
                  <span :val="scope.row[item.prop]" code="MedicationRouteCode" v-codeTransform></span>
                </div> -->
                <div v-else-if="item.prop === 'receiveDept'">
                  <span
                    tableName="sys_org"
                    :conditionMap="{
                      org_type: '_DEPT_',
                      id: scope.row[item.prop],
                    }"
                    columns="org_nm"
                    v-tableTransform
                  ></span>
                </div>
                <div v-else>{{ scope.row[item.prop] }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="skinTestSwitch">
        <div class="fl" style="height: 100%; line-height: 40px">
          <span>皮试方法：</span><span></span>
          <span
            v-if="skinOrderItem && skinOrderItem.hasOwnProperty('stSolutionType')"
            :val="skinOrderItem.stSolutionType"
            code="SkinTestWay"
            v-codeTransform
          ></span>
          <span v-else></span>
          <!-- <span v-if="!skinOrderItem.hasOwnProperty('stSolutionType')"></span>
          <span v-else-if="skinOrderItem.stSolutionType==0">原液</span>
          <span v-else-if="skinOrderItem.stSolutionType==1">皮试液</span> -->
        </div>
        <div class="fl" style="margin-left: 10px">
          <LFormtTitle label="皮试时长">
            <el-input
              v-model="form.duration"
              placeholder="请输入皮试时长"
              :disabled="testBtnShow"
              type="number"
              onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
            >
              <template slot="append">分钟</template>
            </el-input>
          </LFormtTitle>
        </div>
        <div class="fl" style="margin-left: 10px">
          <LFormtTitle label="开始时间">
            <el-date-picker
              :disabled="testBtnShow"
              v-model="form.executeTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择开始时间"
            ></el-date-picker>
          </LFormtTitle>
        </div>
        <el-button
          class="position-absolute exec-btn fr"
          type="primary"
          :disabled="startTestDisabled"
          style="margin-left: 10px"
          v-if="!testBtnShow"
          @click="handleSkinTest"
          >开始计时
        </el-button>
        <count-down
          :start-time="totalTimesTamp"
          v-if="testBtnShow"
          class="fl"
          style="margin-left: 10px"
          @time-end="timeEndCallBack"
        >
        </count-down>
      </div>
    </div>
    <el-row class="height100 bottomForm">
      <el-form
        :rules="rules"
        label-width="80px"
        ref="ruleFormLeft"
        :model="skinTestResFormLeft"
        class="skinTestResult"
      >
        <div class="formMain">
          <el-col :span="12" class="height100 rightBox">
            <l-card-title class="title">
              <span slot="left">皮试结果</span>
            </l-card-title>
            <div class="float-left width100 content">
              <el-row :gutter="8">
                <el-col :span="12">
                  <el-form-item
                    prop="execResult"
                    required
                    style="line-height: 48px"
                  >
                    <span class="label"
                      >皮试结果 <span style="color: red">*</span>
                    </span>
                    <el-radio
                      v-model="skinTestResFormLeft.execResult"
                      label="2"
                      :disabled="saveBtnShow"
                      >阴性</el-radio
                    >
                    <el-radio
                      v-model="skinTestResFormLeft.execResult"
                      label="1"
                      :disabled="saveBtnShow"
                      >阳性</el-radio
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    prop="symptom"
                    v-if="skinTestResFormLeft.execResult == '1'"
                  >
                    <div class="more-selected">
                      <LFormtTitle :required="true" label="症状">
                        <l-value-domain
                          :disabled="saveBtnShow"
                          remoteShowKey="name"
                          remoteValueKey="code"
                          :multiple="true"
                          code="AllergSymptomCode"
                          :value.sync="skinTestResFormLeft.symptom"
                          placeholder="请选择"
                          @change="selectDescription"
                        ></l-value-domain>
                      </LFormtTitle>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="8">
                <el-col :span="24">
                  <el-form-item prop="drugId">
                    <LFormtTitle label="登记药品" required>
                      <el-select
                        v-model="skinTestResFormLeft.drugId"
                        placeholder="请选择"
                        @change="drugIdFun"
                        :disabled="
                          this.drugIdDataList.length == 0 || saveBtnShow
                        "
                      >
                        <el-option
                          v-for="item in drugIdDataList"
                          :key="item.drugId"
                          :label="item.orderItemName"
                          :value="item.orderItemId"
                        ></el-option>
                      </el-select>
                    </LFormtTitle>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="8">
                <el-col :span="12">
                  <el-form-item prop="drugBatchNo" label="">
                    <LFormtTitle
                      class="float-left"
                      :required="true"
                      label="药品批号 "
                      style="width: 100%"
                    >
                      <el-input
                        :disabled="saveBtnShow"
                        style="width: calc(100% - 45px)"
                        placeholder="备注"
                        v-model="skinTestResFormLeft.drugBatchNo"
                      ></el-input>
                    </LFormtTitle>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="otherSymptom" label="">
                    <LFormtTitle label="其他症状描述">
                      <el-input
                        :disabled="saveBtnShow"
                        style="width: calc(100% - 45px)"
                        placeholder="其他症状描述"
                        v-model="skinTestResFormLeft.otherSymptom"
                      ></el-input>
                    </LFormtTitle>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12" class="height100">
            <l-card-title class="title">
              <span slot="left">皮试签名</span>
            </l-card-title>
            <div class="float-left width100 content">
              <el-row :gutter="8" class="contentFlex">
                <el-col :span="8">
                  <el-form-item prop="executorName">
                    <LFormtTitle
                      class="float-left"
                      :required="true"
                      label="皮试人"
                      style="width: 100%"
                    >
                      <el-input
                        :disabled="saveBtnShow"
                        placeholder="请输入登录账号"
                        v-model="skinTestResFormLeft.executorName"
                      ></el-input>
                    </LFormtTitle>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="password">
                    <LFormtTitle
                      class="float-left"
                      :required="true"
                      label="密码"
                      style="width: 100%"
                    >
                      <el-input
                        type="password"
                        v-model="skinTestResFormLeft.password"
                        autocomplete="new-password"
                        :disabled="saveBtnShow"
                      ></el-input>
                    </LFormtTitle>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="8" class="contentFlex">
                <el-col :span="8">
                  <el-form-item prop="registerName">
                    <div class="more-selected">
                      <LFormtTitle
                        class="float-left"
                        :required="true"
                        label="复核人"
                      >
                        <el-input
                          placeholder="请输入登录账号"
                          v-model="skinTestResFormLeft.registerName"
                          autocomplete="off"
                          :disabled="saveBtnShow"
                        ></el-input>
                      </LFormtTitle>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="checkpassword">
                    <LFormtTitle
                      class="float-left"
                      :required="true"
                      label="复核密码"
                    >
                      <el-input
                        type="password"
                        v-model="skinTestResFormLeft.checkpassword"
                        autocomplete="new-password"
                        :disabled="saveBtnShow"
                      ></el-input>
                    </LFormtTitle>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </div>
        <div class="buttonsPart fr">
          <el-button
            style="border-radius: 2px"
            @click="toDelete"
            v-if="!!saveBtnShow"
            >作废重录</el-button
          >
          <el-button
            type="primary"
            @click="save"
            v-if="(!(!cancelBtnShow || !timeEndFlag)) || cancelBtnShowStyle"
            >保存皮试结果</el-button
          >
          <!-- <el-button type="primary" @click="save" v-if="cancelBtnShowStyle"
            >保存皮试结果</el-button
          > -->
        </div>
      </el-form>
    </el-row>
  </el-card>
</template>

<script>
import countDown from "./Countdown.vue";
import {
  skinTestList,
  skiningTestList,
  saveRecord,
  execResultSave,
  findPatientTimeListExecutoryContractByExecType,
  execResultCancel,
  findPatientRightListExecutoryContractByExecType,
  getPrintData
} from "@/api/cis/visit/visit";
import { mapActions, mapGetters } from "vuex";
import { getUserId } from "@/utils/auth";
import base64 from "@/utils/base64";
import { preview, onPreview } from "@/utils/print";
import { injectionTpl, handlePrintData } from '@/printTemplete/module/injectionTpl.js'
import { print } from "@/utils/print_new.js";
import codes from "@/printTemplete/code.js";
import { getPrintTpl } from "@/api/admin/print/print";

export default {
  name: "main",
  components: {
    countDown
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.skinTestResFormLeft.checkpassword !== "") {
          this.$refs.ruleFormLeft.validateField("checkpassword");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入复核密码"));
        // } else if (value !== this.skinTestResFormLeft.password) {
        //   callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      // 控制成组后的合并单元格
      position: 0,
      spanArr: [],
      // 控制成组的合并单元格
      // 2020/12/23
      drugIdDataList: [],

      // 2020/12/23
      timeEndFlag: false, // 倒计时时间到
      tableRadio: "",
      skinOrderItem: {
        stSolutionType: ""
      },
      invalidRetakeIt: true,
      cancelBtnShow: false,
      cancelBtnShowStyle: false,
      saveBtnShow: false,
      testBtnShow: false,
      totalTimesTamp: 0,
      skinTestTableList: {
        column: [
          // {
          //   prop: "startTime",
          //   label: "操作",
          //   width: 80
          // },
          {
            prop: "execStatus",
            label: "状态",
            width: 80
          },
          {
            prop: "execResult",
            label: "皮试结果",
            width: 100
          },

          {
            prop: "executedQuantity",
            label: "皮试时长",
            width: 120
          },
          {
            prop: "scheduledTime",
            label: "皮试开始时间",
            width: 120
          },
          {
            prop: "orderItemName",
            label: "医嘱名称",
            width: 150
          },
          {
            prop: "groupNoCls",
            label: "成组"
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
            prop: "useWay",
            label: "用药途径",
            width: 150
          },
          {
            prop: "stType",
            label: "皮试类型",
            width: 100
          },
          {
            prop: "remark",
            label: "备注",
            width: 150
          },
          {
            prop: "doctorName",
            label: "开嘱医生",
            width: 100
          },
          {
            prop: "diagnosisTime",
            label: "开嘱时间",
            width: 120
          },
          {
            prop: "ouptDeptName",
            label: "开嘱科室",
            width: 100
          }
          // {
          //   prop: "receiveDept",
          //   label: "接收科室",
          //   width: 100
          // }
        ],
        data: []
      },
      categoryCode: ["0"], // 状态 已执行、未执行
      activeNames: "",
      time_type: "1", // 开嘱时间 1 执行时间 2
      dateRange: [], // 时间段
      form: {
        duration: "",
        executeTime: ""
      },
      skinTestResFormLeft: {
        // 皮试结果录入、编辑Form
        drugBatchNo: "",
        execResult: "2",
        symptom: [],
        otherSymptom: "",
        executorName: "",
        password: "",
        registerName: "",
        checkpassword: "",
        resultId: "",
        recorderId: "",
        patientId: "",
        drugId: "",
        execRecordId: "",
        orderId: "",
        orderItemName: ""
      },

      rules: {
        execResult: [
          {
            required: true,
            message: "请选择皮试结果",
            trigger: "change"
          }
        ],
        drugId: [
          {
            required: true,
            message: "请选择药品名称",
            trigger: "blur"
          }
        ],
        drugBatchNo: [
          {
            required: true,
            message: "请输入药品批号",
            trigger: "blur"
          }
        ],

        symptom: [
          {
            type: "array",
            required: true,
            message: "请选择症状",
            trigger: "change"
          }
        ],
        executorName: [
          {
            required: true,
            message: "请输入皮试人",
            trigger: "blur"
          }
        ],
        registerName: [
          {
            required: true,
            message: "请输入复核人",
            trigger: "blur"
          }
        ],
        password: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ],
        checkpassword: [
          {
            validator: validatePass2,
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  mounted() {
    // 获取当前登录人userId
    // const uid = base64.decode(getUserId());
    // const uname = base64.decode(val);
    // console.log('uid',uid)
    // console.log('uname',uname)

    this.loadData();

    this.$nextTick(() => {
      this.reset();
    });
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      setReloadKey: "base/changeSearchAgainKey",
      changeReloadPatient: "base/changeReloadPatient"
    }),
    //倒计时返回倒计时时间戳
    countDownFun(startTime, theLength) {
      let remainTime = "";
      // 开始时间 +皮试时长 - 当前时间 = 剩下的去倒计时
      // 获取当前时间的时间戳   * 60 * 1000
      let timestamp = new Date().getTime();
      // 开始时间
      let start = Date.parse(startTime);
      let theLengthNum = Number(theLength) * 60 * 1000;
      remainTime = start + theLengthNum - timestamp;
      return remainTime;
    },
    // drugIdFun药品名称改变
    drugIdFun(val) {
      // this.skinTestResFormLeft.drugId = val;
      for (let i = 0; i < this.drugIdDataList.length; i++) {
        if (this.drugIdDataList[i].orderItemId == val) {
          this.skinTestResFormLeft.execRecordId = this.drugIdDataList[
            i
          ].recordId;
          this.skinTestResFormLeft.orderId = this.drugIdDataList[i].id;
          this.skinTestResFormLeft.orderItemName = this.drugIdDataList[
            i
          ].orderItemName;
        }
      }

      this.$set(this.skinTestResFormLeft, this.skinTestResFormLeft.drugId, val);
      this.$forceUpdate();
      console.log(this.skinTestResFormLeft);
    },
    // 处理合并单元格数据格式
    rowspan(data) {
      this.spanArr = [];
      this.position = 0;
      data.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (data[index].groupNo === data[index - 1].groupNo) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
      });
      console.log(this.spanArr, "this.spanArr录入问题");
    },
    // 合并单元格显示
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //表格合并行
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    // 成组显示
    grouping(list1) {
      // table 数据 成组操作
      // 将list 分组
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
      return tableList;
    },
    // zhengyawen 打印皮试
    async printClick() {
      let itemidList = [];
      for (let i = 0; i < this.drugIdDataList.length; i++) {
        itemidList.push(this.drugIdDataList[i].id);
      }
      if (!this.receivePatientData.patientId) {
        this.$message.error("请选择患者");
        return false;
      }
      if (this.skinOrderItem.hasOwnProperty("stSolutionType") && this.skinOrderItem.stSolutionType == "") {
        this.$message.error("请选择数据");
        return false;
      }
      try {
        let params = {
          orderStatus: 99,
          orderId: itemidList,
          visitCode: this.receivePatientData.visitCode,
          pageNo: 1,
          pageSize: 100,
          patientId: this.receivePatientData.patientId,
          printGroup: 1 //1.门诊皮试单、2.门诊注射单、3.输液执行单、4.门诊治疗单
        };
        let res = await getPrintData(params);
        if (res.code === 1) {
          // onPreview(res.data, "皮试单");
          let obj = handlePrintData(res.data);
          print(null, injectionTpl, {}, obj, true);
        }
      } catch (e) {
        console.log(e);
      }
    },
    async radioChange(valId) {
      console.log("radioChange", val);
      this.tableRadio = valId;
      let wrapdata = this.skinTestTableList.data;
      let valList = null;
      let val = null;
      for (let i = 0; i < wrapdata.length; i++) {
        if (wrapdata[i].id == valId) {
          valList = wrapdata[i];
          val = wrapdata[i];
          break;
        }
      }
      let objVal = [];
      // 获取成祖在执行中的返现 start
      this.drugIdDataList = [];
      for (let i = 0; i < this.skinTestTableList.data.length; i++) {
        if (this.skinTestTableList.data[i].groupNo == val.groupNo) {
          this.drugIdDataList.push(this.skinTestTableList.data[i]);
        }
      }
      for (let i = 0; i < this.drugIdDataList.length; i++) {
        if (this.drugIdDataList[i].execResult) {
          this.skinOrderItem = this.drugIdDataList[i];
          val = this.drugIdDataList[i];
          break;
        } else {
          objVal.push(1);
        }
      }
      if (objVal.length == this.drugIdDataList.length) {
        val = valList;
        this.skinOrderItem = val;
      }
      let params = {
        recordId: val.recordId,
        execType: 2,
        pageNo: 0,
        pageSize: 10,
        execStatus: 1
      };
      this.testBtnShow = false;
      this.saveBtnShow = false;
      this.cancelBtnShow = false;
      this.timeEndFlag = false; // 倒计时时间到
      this.form.duration =
        val.executedQuantity.indexOf("分钟") > -1
          ? val.executedQuantity.split("分钟")[0]
          : "";
      if (val.execStatus == 1 || val.execStatus == 2) {
        // 执行中和执行完成才有皮试时长和皮是时间

        this.skinOrderItem.duration = val.executedQuantity;
        this.form.duration =
          val.executedQuantity.indexOf("分钟") > -1
            ? val.executedQuantity.split("分钟")[0]
            : "";
        this.skinOrderItem.executeTime = val.scheduledTime;
        this.form.executeTime = val.scheduledTime;
        this.skinTestResFormLeft.patientId = val.patientId;
        this.skinOrderItem.execRecordId = val.recordId;
        this.skinOrderItem.recordDataVersion = val.recordDataVersion;

        this.testBtnShow = true;
        // 查是否皮试，有的话赋值倒计时
        await findPatientTimeListExecutoryContractByExecType(params)
          .then(res => {
            if (res.code === 1) {
              console.log(
                "findPatientTimeListExecutoryContractByExecType",
                res
              );
              if (res.data && res.data[0]) {
                // this.totalTimesTamp = res.data[0].timeRemaining || 0; // 倒计时
                this.totalTimesTamp = this.countDownFun(
                  res.data[0].scheduledTime,
                  res.data[0].executedQuantity
                );
                if (this.totalTimesTamp > 0) {
                  this.timeEndFlag = false;
                } else {
                  this.timeEndFlag = true;
                }
              } else {
                this.totalTimesTamp = "-1";
              }

              console.log("倒计时时间", this.totalTimesTamp);
            } else {
              this.$message.error(res.msg);
            }
            // this.loading = false;
          })
          .catch(err => {
            // this.loading = false;
            this.$message.error(err.msg);
          });

        if (val.execStatus == 1) {
          // 执行中才可以点保存
          this.cancelBtnShow = true;
          this.cancelBtnShowStyle = false;
        }
        if (val.execStatus == 2) {
          if (this.invalidRetakeIt) {
            this.saveBtnShow = true;
            this.cancelBtnShowStyle = false;
          } else {
            this.saveBtnShow = false;
            this.cancelBtnShowStyle = true;
          }

          let paramss = {
            recordId: val.recordId,
            execType: 2,
            pageNo: 0,
            pageSize: 10,
            execStatus: 2
          };
          await findPatientRightListExecutoryContractByExecType(paramss)
            .then(res => {
              if (res.code === 1) {
                console.log(
                  "findPatientRightListExecutoryContractByExecType",
                  res
                );
                this.skinTestResFormLeft.execResult = res.data.execResult;
                this.skinTestResFormLeft.drugBatchNo = res.data.drugBatchNo;
                if (res.data.symptom.length > 0) {
                  this.skinTestResFormLeft.symptom = eval(
                    "(" + res.data.symptom + ")"
                  );
                } else {
                  this.skinTestResFormLeft.symptom = "";
                }
                this.skinTestResFormLeft.otherSymptom = res.data.otherSymptom;
                this.skinTestResFormLeft.executorId = res.data.executorId;
                this.skinTestResFormLeft.executorName = res.data.executorName;
                this.skinTestResFormLeft.password = res.data.password;
                this.skinTestResFormLeft.recorderId = res.data.recorderId;
                this.skinTestResFormLeft.recordId = res.data.recordId;
                this.skinTestResFormLeft.orderId = res.data.orderId;
                this.skinTestResFormLeft.registerName = res.data.registerName;
                this.skinTestResFormLeft.checkpassword = res.data.checkpassword;
                this.skinTestResFormLeft.resultId = res.data.resultId;
                this.skinTestResFormLeft.drugId = res.data.orderItemId;

                if (res.data.execResult == "0") {
                  this.saveBtnShow = false;
                  this.cancelBtnShowStyle = true;
                  this.skinTestResFormLeft.execResult = ""; //皮试结果
                  this.skinTestResFormLeft.symptom = ""; //症状
                  this.skinTestResFormLeft.drugBatchNo = ""; //药品批号
                  this.skinTestResFormLeft.otherSymptom = ""; //其他症状描述
                  this.skinTestResFormLeft.executorName = ""; //皮试人
                  this.skinTestResFormLeft.password = ""; //密码
                  this.skinTestResFormLeft.registerName = ""; //复核人
                  this.skinTestResFormLeft.checkpassword = ""; //复核密码
                } else {
                  this.cancelBtnShowStyle = false;
                  this.saveBtnShow = true;
                }
              } else {
                this.$message.error(res.msg);
              }
              // this.loading = false;
            })
            .catch(err => {
              // this.loading = false;

              this.$message.error(err.msg);
            });
        } else {
          this.reset();
          this.skinTestResFormLeft.drugId = this.drugIdDataList[0].orderItemId;
          this.skinTestResFormLeft.execRecordId = this.drugIdDataList[0].recordId;
          this.skinTestResFormLeft.orderId = this.drugIdDataList[0].id;
          this.$set(
            this.skinTestResFormLeft,
            this.skinTestResFormLeft.drugId,
            this.drugIdDataList[0].orderItemId
          );
        }
      } else {
        this.form.executeTime = new Date();
        this.skinTestResFormLeft.drugId = this.drugIdDataList[0].orderItemId;
        this.skinTestResFormLeft.execRecordId = this.drugIdDataList[0].recordId;
        this.skinTestResFormLeft.orderId = this.drugIdDataList[0].id;
        this.skinTestResFormLeft.orderItemName = this.drugIdDataList[0].orderItemName;

        this.$set(
          this.skinTestResFormLeft,
          this.skinTestResFormLeft.drugId,
          this.drugIdDataList[0].orderItemId
        );
      }

      console.log(this.drugIdDataList, "药品名称下面选择的数据包");
      // 获取成祖在执行中的返现  end
    },
    handleSelect(val) {
      console.log("handleSelect", val);
      let item = val;
      // this.$refs.singleTable.toggleRowSelection(item);
      if (item) {
        // this.$refs.singleTable.clearSelection()
        // this.$refs.singleTable.toggleRowSelection(item[0] ,true);
      }
    },
    handleSelectionChange(val) {},

    loadData() {
      if (!this.receivePatientData.visitCode) {
        return;
      }
      this.$showLoading();
      let params = {
        ...this.getParams(),
        visitCode: this.receivePatientData.visitCode,
        pageNo: 1,
        pageSize: 100,
        execType: this.receivePatientData.execType || ""
        // inpCode
      };
      // this.loading = true;
      // {"pageNo":"","pageSize":"","visitCode":"","execStatus":"","startDate":"","endDate":""}
      if (
        this.receivePatientData.execType == "0" ||
        this.receivePatientData.execType == "1"
      ) {
        skinTestList(params)
          .then(res => {
            if (res.code === 1) {
              // advData = await this.grouping(res.data);
              this.skinTestTableList.data = this.grouping(res.data);
              this.rowspan(this.skinTestTableList.data);
              console.log(
                "this.skinTestTableList.data",
                this.skinTestTableList.data
              );
            } else {
              this.$message.error(res.msg);
            }
            // this.loading = false;
          })
          .catch(err => {
            // this.loading = false;
            this.$message.error(err.msg);
          }).finally(()=>{
            this.$hideLoading();
          });
      } else {
        skiningTestList(params)
          .then(res => {
            if (res.code === 1) {
              // advData = await this.grouping(res.data);
              this.skinTestTableList.data = res.data;
              console.log(
                "this.skinTestTableList.data",
                this.skinTestTableList.data
              );
            } else {
              this.$message.error(res.msg);
            }
            // this.loading = false;
          })
          .catch(err => {
            // this.loading = false;
            this.$message.error(err.msg);
          }).finally(()=>{
            this.$hideLoading();
          });
      }
      this.$hideLoading();
      if (this.tableRadio != "") {
        this.radioChange(this.tableRadio);
      }
    },
    getParams() {
      let obj = {
        execStatus: this.execStatus
      };
      if (this.dateRange && this.dateRange.length > 1) {
        obj["startDate"] = this.dateRange[0] + " 00:00:00";
        obj["endDate"] = this.dateRange[1] + " 23:59:59";
      }
      return obj;
    },
    timeEndCallBack() {
      console.log("倒计时时间到");
      this.timeEndFlag = true;
      this.cancelBtnShowStyle = true;
    },
    selectRow(row) {},
    selectDescription(item, curItem) {},
    categoryCodeChange(val) {},
    handleSkinTest() {
      this.changeReloadPatient({
        a: 1
      });
      if (!this.form.duration) {
        this.$message.error("请写入皮试时长");
        return;
      }
      // if (this.form.duration >= 60) {
      //   this.$message.error("请写入小于60分钟的时间");
      //   return;
      // }
      if (!this.form.executeTime) {
        this.$message.error("请选择开始时间");
        return;
      }
      if (!this.skinOrderItem || !this.skinOrderItem.id) {
        this.$message.error("请选择一条记录再开始计时");
        return;
      }

      this.setReloadKey(+new Date()); // 刷新左下侧列表

      let params = {
        visitCode: this.receivePatientData.visitCode,
        patientId: this.receivePatientData.patientId,
        patientName: this.receivePatientData.patientName,
        scheduledTime: this.form.executeTime,
        executedQuantity: this.form.duration,
        orderId: this.skinOrderItem.id,
        execType: "2"
      };
      saveRecord(params)
        .then(res => {
          if (res.code === 1) {
            // advData = await this.grouping(res.data);
            // this.skinTestTableList.data = res.data;
            console.log("res.dataka开始皮试计时wwwwwwwwwwwwwwwwwww", res.data);
            // this.totalTimesTamp = this.form.duration * 60 * 1000;
            this.totalTimesTamp = this.countDownFun(
              res.data.scheduledTime,
              res.data.executedQuantity
            );
            this.testBtnShow = true;
            this.$message.success("开始皮试计时");
            this.skinTestResFormLeft.execRecordId = res.data.id;
            this.changeReloadPatient({}); // vuex刷新左侧病人列表

            // console.log("this.skinTestTableList.data",this.skinTestTableList.data)
          } else {
            this.$message.error(res.msg);
          }
          // this.loading = false;
        })
        .catch(err => {
          // this.loading = false;
          this.$message.error(err.msg);
        });
    },

    toDelete() {
      execResultCancel(this.skinTestResFormLeft)
        .then(res => {
          if (res.code === 1) {
            this.$emit("changeTabNum");
            this.changeReloadPatient({}); // vuex刷新左侧病人列表
            this.skinTestTableList.data = [];
            this.$set(this.skinTestTableList, this.skinTestTableList.data, []);
            this.loadData();
            this.tableRadio = false;
            this.saveBtnShow = false;
            this.invalidRetakeIt = false;
          } else {
            this.$message.error(res.msg);
          }
          // this.loading = false;
        })
        .catch(err => {
          // this.loading = false;
          this.$message.error(err.msg);
        })
        .finally( ()=> {
          this.reset();
        });
      this.reset();
    },
    reset() {
      this.$refs["ruleFormLeft"].resetFields();
    },
    save() {
      if (
        !this.skinTestResFormLeft.execResult &&
        this.skinTestResFormLeft.execResult.length == "0"
      ) {
        this.$message.error("请选择皮试结果！！");
        return false;
      }
      console.log(this.skinTestResFormLeft, "需要提交的参数查看");
      this.$refs["ruleFormLeft"].validate(valid => {
        if (valid) {
          let params = this.skinTestResFormLeft;

          params.duration = parseFloat(this.form.duration); // 皮试时常
          params.visitCode = this.receivePatientData.visitCode;
          // params.drugId = this.skinOrderItem.orderItemId // 药品id
          // params.password // 密码
          // params.checkpassword // 复核密码
          // params.execRecordId = this.skinOrderItem.execRecordId
          params.recordDataVersion = this.skinOrderItem.recordDataVersion;
          // execResult/save
          // params.orderItemName = this.skinOrderItem.orderItemName
          params.patientId = this.skinOrderItem.patientId;
          // params.orderId = this.skinOrderItem.orderId;
          params.id = params.resultId;
          console.log("this.params", params);
          execResultSave(params)
            .then(res => {
              if (res.code === 1) {
                this.$message.success("保存皮试结果成功");
                this.cancelBtnShowStyle = false;
                this.invalidRetakeIt = true;
                this.$emit("changeTabNum");
                this.changeReloadPatient({}); // vuex刷新左侧病人列表
                this.loadData();
                this.reset();
              } else {
                this.$message.error(res.msg);
              }
              // this.loading = false;
            })
            .catch(err => {
              // this.loading = false;
              this.$message.error(err.msg);
            });
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      async handler(val, old) {
        this.tableRadio = "";
        this.timeEndFlag = false; // 倒计时时间到
        if(val.patientId === old.patientId) {
          this.radioChange(this.tableRadio);
        } else {
          this.tableRadio = '';
        }
        this.skinOrderItem = {
          stSolutionType: ""
        };

        this.skinTestResFormLeft = {
          // 皮试结果录入、编辑Form
          drugId: "",
          drugBatchNo: "",
          execResult: "2",
          symptom: [],
          otherSymptom: "",
          executorName: "",
          password: "",
          registerName: "",
          checkpassword: "",
          resultId: ""
        };

        this.form = {
          duration: "",
          executeTime: ""
        };
        this.cancelBtnShow = false;
        this.saveBtnShow = false;
        this.testBtnShow = false;

        // this.skinTestResFormLeft.executorName  = this.receivePatientData.patientName // 皮试人id

        // this.skinTestResFormLeft.executorId  = this.receivePatientData.patientId // 皮试人id

        console.log(
          "this.receivePatientData??!!@@##$$%%^^&&",
          this.receivePatientData
        );
        await this.loadData();
        this.$nextTick(()=>{
          this.reset();
        })
        this.form.executeTime = new Date();
        // this.getHistoryApplyList()
        // this.getListByParamNotDelete()
        // let cType = "";
        // if (this.$attrs.hosType == "1") {
        //   cType = val.visitCode;
        // } else if (this.$attrs.hosType == "3") {
        //   cType = val.inpCode;
        // }
        // this.setPatientInfo("testApply", {
        //   patientId: val.patientId,
        //   type: this.eleTypes,
        //   id: cType
        // });
      }
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    startTestDisabled() {
      return !(this.form.executeTime && this.form.duration);
    }
  }
};
</script>

<style scoped lang="scss">
.wrapperCls {
  /deep/ .el-select__tags {
    height: 34px;
    overflow: auto;
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

  .topPart {
    height: calc(100% - 350px);

    .tablePart {
      height: calc(100% - 100px);
      margin-top: 16px;

      .tablePartUtils {
        height: 60px;

        .date-icon {
          top: 10px;
          right: 10px;
          color: #949da3;
        }
      }

      .tablePartMain {
        height: calc(100% - 0px);
      }
    }

    .skinTestSwitch {
      height: 60px;
      /*line-height: 60px;*/
      padding: 16px 0;
      overflow: visible;
      white-space: nowrap;
    }
  }

  .bottomForm {
    height: 350px;
    overflow: auto;

    .bottomForm {
      height: calc(100% - 50px);
      border-bottom: 1px solid #e4e4e4;
    }

    .buttonsPart {
      height: 50px;
      padding: 20px;
    }
    .contentFlex {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    /deep/ .el-form-item__content {
      margin-left: 0px !important;
    }
  }

  .skinTestResult {
    height: 300px;

    .top {
      height: 50%;
      // position: relative;

      .title {
        // position: absolute;
        top: 0px;
        padding: 10px;
      }

      .content {
        // position: absolute;
        top: 50px;
        padding: 0 10px;
        /deep/ .el-form-item__content {
          margin-left: 0px !important;
        }
      }
    }

    .bottom {
      height: 50%;
      // position: relative;

      .title {
        // position: absolute;
        top: 0px;
        padding: 10px;
      }

      .content {
        // position: absolute;
        top: 50px;
        padding: 0px 10px;
      }
    }
  }

  .rightBox {
    box-sizing: border-box;
    padding-right: 8px;
    .title {
      padding: 16px 0;
    }

    .content {
      padding: 0;
    }
  }
}
</style>
