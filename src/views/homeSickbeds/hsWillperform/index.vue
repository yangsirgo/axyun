<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="layoutObjec.toolBoxs"
      :defaultToolName="layoutObjec.toolBoxs[0]"
      :isToolBox="layoutObjec.isToolBox"
      :boxExpanded="false"
      patientCardType="default"
      :patientListShow="layoutObjec.patientListShow"
      @message="messageHandler"
      :ele-type="1"
      hosType="1"
    >
      <!-- <template #topSlot>
        <l-patient-details></l-patient-details>
      </template> -->
      <template #list>
        <left-bar ref="leftBar"></left-bar>
      </template>

      <template #content>
        <div class="bg-contain width100 height100">
          <div class="patient-card">
            <el-col class="patient-top">
              <el-col class="patient-border">
                <el-checkbox-group
                  v-model="rightPara.OrderCat"
                  @change="radioFun"
                >
                  <el-checkbox label="1">长期医嘱</el-checkbox>
                  <el-checkbox label="2">临时医嘱</el-checkbox>
                </el-checkbox-group>
              </el-col>

              <el-col class="patient-border">
                <el-checkbox-group
                  v-model="rightPara.execStatus"
                  @change="bedsDataFun"
                >
                  <el-checkbox label="0">未执行</el-checkbox>
                  <el-checkbox label="2">已执行</el-checkbox>
                </el-checkbox-group>
              </el-col>

              <el-col class="patient-borderA">
                <LFormtTitle label="要求执行日期">
                  <el-date-picker
                    v-model="queryData.dateTime"
                    type="daterange"
                    :default-time="['00:00:00', '23:59:59']"
                    style="width:100%"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @input="inputChange($event)"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="expireTimeOption"
                    @change="datePicker"
                  ></el-date-picker>
                </LFormtTitle>
              </el-col>
              <el-col class="patient-borderA">
                <LFormtTitle>
                  <el-input
                    placeholder="医嘱名称简码/编号"
                    v-model="rightPara.orderItemName"
                  >
                  </el-input>
                </LFormtTitle>
              </el-col>

              <el-col class="patient-borderA">
                <el-button type="primary" @click="heQuery">查询</el-button>
                <el-button type="" @click="emptyDateFun">重置</el-button>
                <el-button
                  type="primary"
                  :disabled="breakUpStyle"
                  @click="breakUp"
                  >拆分</el-button
                >
                <el-button
                  type=""
                  @click="applyMedication"
                  v-if="activeName == '0'"
                  >申请用药</el-button
                >
              </el-col>
            </el-col>
          </div>
          <div class="m-contain">
            <div class="table-box ">
              <diV class="topBoxStyle main-table">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="药品执行" name="0"></el-tab-pane>
                  <el-tab-pane label="诊疗执行" name="1"></el-tab-pane>
                </el-tabs>
                <div class="topTree topTreeStyle">
                  <el-collapse
                    v-model="topTreeName"
                    :accordion="true"
                    @change="handleChange"
                    v-if="tableDataWrapList.length > '0'"
                  >
                    <l-collapse-item
                      :name="index"
                      v-for="(item, index) in tableDataWrapList"
                      :key="index"
                    >
                      <template slot="title">
                        <span style="font-weight: 600;">{{
                          item.patientName
                        }}</span
                        >&nbsp;&nbsp;
                        <span
                          style="font-weight: 600;"
                          :val="item.patientGender"
                          code="GENDER_CODE"
                          v-codeTransform
                        ></span
                        >&nbsp;&nbsp;
                        <span style="font-weight: 600;">{{
                          item.patientAge
                        }}</span>
                      </template>
                      <template slot="content">
                        <div style="margin-top: 10px;" v-if="activeName == '0'">
                          <el-table
                            ref="multipleTable"
                            :data="item.tableData"
                            tooltip-effect="dark"
                            width="100%"
                            @select="
                              (a, b) => {
                                handleSelect(a, b, item.groupNoList, index);
                              }
                            "
                            height="500"
                            @selection-change="handleSelectionChange"
                          >
                            <el-table-column
                              type="selection"
                              width="50"
                            ></el-table-column>
                            <el-table-column label="状态" width="80">
                              <template slot-scope="scope">{{
                                scope.row.execStatus == "0"
                                  ? "待执行"
                                  : scope.row.execStatus == "1"
                                  ? "执行中"
                                  : scope.row.execStatus == "2"
                                  ? "已执行"
                                  : scope.row.execStatus == "3"
                                  ? "取消"
                                  : "终止"
                              }}</template>
                            </el-table-column>
                            <el-table-column label="发药状态" width="120">
                              <template slot-scope="scope">{{
                                myFun(scope.row.drugRecordStatus)
                              }}</template>
                            </el-table-column>
                            <el-table-column label="组" width="120">
                              <template slot-scope="scope">
                                <span :class="scope.row.groupNoCls"></span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="" label="属性">
                              <template slot-scope="scope">{{
                                scope.row.orderCat == "1"
                                  ? "长期"
                                  : scope.row.orderCat == "2"
                                  ? "临时"
                                  : scope.row.orderCat == "3"
                                  ? "带药出院"
                                  : "--"
                              }}</template>
                            </el-table-column>
                            <el-table-column
                              prop="orderItemName"
                              label="医嘱名称"
                              show-overflow-tooltip
                              width="180"
                            ></el-table-column>
                            <el-table-column
                              prop="spec"
                              label="规格"
                            ></el-table-column>
                            <el-table-column prop="onceDosage" label="剂量">
                              <template slot-scope="scope">
                                <span>{{ scope.row.onceDosage }}</span>
                                <span
                                  :val="scope.row.dosageUnit || '--'"
                                  code="DrugDoseUnit"
                                  v-codeTransform
                                ></span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="quantity" label="数量">
                              <template slot-scope="scope">
                                <span>{{ scope.row.quantity }}</span>
                                <span
                                  :val="scope.row.unit || '--'"
                                  code="DrugUnit"
                                  v-codeTransform
                                ></span>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="frequencyCode"
                              label="频次"
                            ></el-table-column>
                            <el-table-column
                              prop="useWay"
                              label="用法"
                              show-overflow-tooltip
                            >
                              <!-- <template slot-scope="scope"><span :val="scope.row.useWay || '--'" code="MedicationRouteCode"
                                  v-codeTransform></span></template> -->
                            </el-table-column>
                            <el-table-column
                              prop="remark"
                              label="备注"
                            ></el-table-column>
                            <el-table-column
                              label="要求执行时间"
                              show-overflow-tooltip
                              width="150"
                            >
                              <template slot-scope="scope">{{
                                scope.row.scheduledTime
                              }}</template>
                            </el-table-column>
                            <el-table-column
                              label="执行时间"
                              show-overflow-tooltip
                              width="150"
                            >
                              <template slot-scope="scope">{{
                                scope.row.execTime
                              }}</template>
                            </el-table-column>
                            <el-table-column
                              prop="execName"
                              label="执行人"
                            ></el-table-column>
                            <el-table-column
                              prop="printerName"
                              label="打印人"
                            ></el-table-column>
                            <el-table-column
                              prop="doctorName"
                              label="开嘱医生"
                              show-overflow-tooltip
                              width="120"
                            ></el-table-column>
                            <el-table-column
                              label="医嘱开始时间"
                              width="150"
                              show-overflow-tooltip
                            >
                              <template slot-scope="scope">{{
                                scope.row.startTime
                              }}</template>
                            </el-table-column>
                            <el-table-column
                              prop="receiveDeptName"
                              label="接收科室"
                            ></el-table-column>
                          </el-table>
                        </div>
                        <div style="margin-top: 10px;" v-if="activeName == '1'">
                          <el-table
                            ref="multipleTable"
                            :data="item.tableData"
                            tooltip-effect="dark"
                            width="100%"
                            height="500"
                            @selection-change="handleSelectionChange"
                          >
                            <el-table-column
                              type="selection"
                              width="50"
                            ></el-table-column>
                            <el-table-column label="状态" width="120">
                              <template slot-scope="scope">{{
                                scope.row.execStatus == "0"
                                  ? "待执行"
                                  : scope.row.execStatus == "1"
                                  ? "执行中"
                                  : scope.row.execStatus == "2"
                                  ? "已执行"
                                  : scope.row.execStatus == "3"
                                  ? "取消"
                                  : "终止"
                              }}</template>
                            </el-table-column>
                            <el-table-column prop="" label="属性">
                              <template slot-scope="scope">{{
                                scope.row.orderCat == "1"
                                  ? "长期"
                                  : scope.row.orderCat == "2"
                                  ? "临时"
                                  : scope.row.orderCat == "3"
                                  ? "带药出院"
                                  : "--"
                              }}</template>
                            </el-table-column>
                            <el-table-column
                              prop="orderItemName"
                              label="医嘱名称"
                              show-overflow-tooltip
                              width="180"
                            ></el-table-column>
                            <el-table-column
                              prop="spec"
                              label="规格"
                            ></el-table-column>
                            <el-table-column
                              prop="frequencyCode"
                              label="频次"
                            ></el-table-column>
                            <el-table-column
                              prop="quantity"
                              label="数量"
                            ></el-table-column>
                            <!-- <el-table-column prop="useWay" label="用法"></el-table-column> -->
                            <el-table-column
                              prop="remark"
                              label="备注"
                            ></el-table-column>
                            <el-table-column
                              label="要求执行时间"
                              show-overflow-tooltip
                              width="150"
                            >
                              <template slot-scope="scope">{{
                                scope.row.scheduledTime
                              }}</template>
                            </el-table-column>
                            <el-table-column
                              label="执行时间"
                              show-overflow-tooltip
                              width="150"
                            >
                              <template slot-scope="scope">{{
                                scope.row.execTime
                              }}</template>
                            </el-table-column>
                            <el-table-column
                              prop="execName"
                              label="执行人"
                            ></el-table-column>
                            <!-- <el-table-column prop="printerName" label="打印人"></el-table-column> -->
                            <el-table-column
                              prop="doctorName"
                              label="开嘱医生"
                              show-overflow-tooltip
                              width="120"
                            ></el-table-column>
                            <el-table-column
                              prop="ouptDeptName"
                              label="开嘱科室"
                            ></el-table-column>
                            <el-table-column
                              label="医嘱开始时间"
                              width="150"
                              show-overflow-tooltip
                            >
                              <template slot-scope="scope">{{
                                scope.row.startTime
                              }}</template>
                            </el-table-column>
                            <el-table-column
                              prop="receiveDeptName"
                              label="接收科室"
                            ></el-table-column>
                          </el-table>
                        </div>
                      </template>
                    </l-collapse-item>
                  </el-collapse>
                </div>
              </diV>
            </div>
            <div class="bottom-box">
              <el-button
                type="primary"
                :disabled="performFunStyle"
                @click="performFun('2')"
              >
                执 行
              </el-button>
              <el-button @click="stoPperformFun()">停止执行</el-button>
              <el-button @click="performFun('0')">撤销</el-button>
              <el-button @click="printFun()" v-if="activeName == '0'"
                >打印领药单</el-button
              >
              <el-button @click="printDrugFun()">打印执行单</el-button>
            </div>
          </div>
        </div>
      </template>
    </l-layout>
    <l-dialog
      :visible.sync="modelVisible"
      width="450px"
      title="执行"
      @confirm="conserve"
      @cancel="huidanClose"
    >
      <template #content>
        <div style="padding:8px">
          <el-form ref="performs" :model="performs" :rules="performsRules">
            <el-form-item prop="execName">
              <l-formt-title label="执行人" required>
                <!-- <el-input v-model="performs.execName"></el-input> -->
                <l-value-domain
                  clearable
                  remoteUrl="/admin/user/page"
                  type="select"
                  :remoteParams="remoteParams"
                  :value.sync="performs.execName"
                  remoteShowKey="name"
                  remoteValueKey="name"
                ></l-value-domain>
              </l-formt-title>
            </el-form-item>
            <el-form-item prop="execTime">
              <l-formt-title label="执行时间" required>
                <el-date-picker
                  v-model="performs.execTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择执行时间"
                >
                </el-date-picker>
              </l-formt-title>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </l-dialog>
  </div>
</template>

<script>
import { setGroupNoList } from "@/components/adviceCommon/adviceUtils.js";
import leftBar from "./components/leftBar.vue";
import { mapActions, mapGetters } from "vuex";
import {
  getRoles,
  getRole,
  setRole,
  getUserId,
  getUserName
} from "@/utils/auth";
import base64 from "@/utils/base64";
import {
  execGetList,
  execStatus,
  execFun,
  drugDispensing,
  execStop,
  getTreatmentPrint,
  getDrugPrint,
  uploadPrintInfo,
  getChineseDrugPrint
} from "@/api/homeSickbeds/hsPatientManagement/hsPatientManagement";
//引入打印控件
import { onPreview, onPrint } from "@/utils/print.js";
import { print } from "@/utils/print_new.js";
import codes from "@/printTemplete/code.js";
import { getPrintTpl } from "@/api/admin/print/print";
import { t4 } from "@/printTemplete/module/t4.js";
import { inpOrderTpl, inpOrderTplGenerateTable } from "@/printTemplete/module/inpOrderTpl.js";


export default {
  name: "index",
  components: {
    leftBar
  },
  data() {
    return {
      // 控制数据按钮
      performFunStyle: false,
      // 控制拆分按钮
      breakUpStyle: false,
      // 复选框选择的数据列表
      chooseTableData: [],
      chooseTableIdList: [],
      chooseTableDataPatients: [], //选择了几个患者这的执行记录
      execIds: [],
      // 树形结构的页面
      treeData: {
        checked: "1"
      },
      tableDataWrapList: [],
      tableDataWrapListStyle: true,

      activeName: "0",
      topTreeName: "1",
      queryData: {
        searchValue: "",
        radio: [],
        dateTime: [],
        bedsData: []
      },
      layoutObjec: {
        //默认 诊断病历页面
        patientListShow: true,
        toolBoxs: [],
        boxExpanded: false,
        isToolBox: false
      },
      patientIdsList: [],
      // 右侧列表
      rightPara: {
        patientIds: [],
        treatNos: [],
        startTime: "",
        endTime: "",
        execType: "",
        execStatus: ["0"],
        orderItemName: "",
        OrderCat: ["1"]
      },
      modelVisible: false,
      //执行表单
      performs: {
        execTime: "",
        execName: ""
      },
      performsRules: {
        execName: [
          {
            required: true,
            message: "请输入执行人名称",
            trigger: "blur"
          }
        ],
        execTime: [
          {
            required: true,
            message: "请输入执行时间",
            trigger: "blur"
          }
        ]
      },
      isPerformFun: "", //撤销还是执行
      remoteParams: {
        page: 1,
        pageSize: 9999,
        did: JSON.parse(getRole()).deptId
      }
    };
  },
  created() {
    console.log("组件实例化之前");
    console.log(getRole(), "基本信息");
    console.log(getUserId(), "基本信息id");
    console.log(this.getPamars(), "基本信息getInfo");
    // this.execGetList();
    setTimeout(() => {
      this.changeRecPatientData({});
    }, 1000)


    this.queryData.dateTime[0] = this.timeDefault();
    this.queryData.dateTime[1] = this.timeDefault();
    // this.changeRecPatientData({}); // 目的是为了进入此二级菜单后，清除之前的患者vuex信息
    this.datePicker();
    console.log(this.rightPara.endTime);
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"])
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "homeSickbeds/changeRecPatientData",
      seteHrData: "ehr/seteHrData",
      setReloadKey: "base/changeSearchAgainKey", //刷新左侧患者列表
      changeChangeTabsShowQuote: "cis/changeChangeTabsShowQuote" // 切换为诊断tab时，要更新右侧工具箱诊断模板的"引用"按钮显示出来
    }),
    handleSelect(selection, row, groupNoList, tIndex) {
      let isChecked =
        selection.filter(item => {
          return item.id === row.id;
        }).length > 0;
      this.setBunchingSelect([row], isChecked, groupNoList, tIndex);
    },
    //获取勾选中的 已成组 项
    setBunchingSelect(list, flag, groupNoList = [], tIndex = 0) {
      console.log(list, flag, groupNoList);
      let bunchingList = null;
      list.forEach(item => {
        groupNoList.forEach(row => {
          if (row.key === item.majorId) {
            row.value.forEach(tableRow => {
              setTimeout(() => {
                //修复 selection 只有一个的问题
                try {
                  this.$refs.multipleTable[tIndex].toggleRowSelection(
                    tableRow,
                    flag
                  );
                } catch (error) {}
              }, 0);
            });
          }
        });
      });
    },

    groupNoClsFun(list1) {
      // 将list 分组
      // return new Promise((resolve, reject) => {
      let list = [];
      let groupList = [];
      let filterList = [];
      let tableList = [];
      groupList = list1.map(item => {
        // 获取所有组
        return item.majorId;
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
          // console.log(item+"===================="+sonItem.majorId)
          return item === sonItem.majorId;
        });
        list.push({
          key: item,
          value: filterList
        });
      });

      list.forEach(item => {
        // 将有组item添加class
        let itemList = item.value;
        if (itemList.length == 1) {
          return;
        }
        itemList.forEach((sonItem, sonIndex) => {
          console.log(sonIndex, "=============");
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
        if (!item.majorId) {
          tableList.push(item);
        }
      });
      console.log(
        tableList,
        "==========================分成的组==========================="
      );
      // resolve(tableList);
      return tableList;
    },

    myFun(a) {
      // 0未申领 1已申领未发 2申请拒绝 3已发 4发药拒绝 5自备药物 6.退药申请成功 7.退药申请拒绝 8.退药成功 9.退药拒绝
      let x = "--";
      switch (a) {
        case "0":
          x = "未申领";
          break;
        case "1":
          x = "已申领未发";
          break;
        case "2":
          x = "申请拒绝";
          break;
        case "3":
          x = "已发";
          break;
        case "4":
          x = "发药拒绝";
          break;
        case "5":
          x = "自备药物";
          break;
        case "6":
          x = "退药申请成功";
          break;
        case "7":
          x = "退药申请拒绝";
          break;
        case "8":
          x = "退药成功";
          break;
        case "9":
          x = "退药拒绝";
          break;
        case "10":
          x = "申请失败";
          break;
      }
      return x;
    },
    treeDataFun(val, item) {
      console.log(val.target.checked, "选择复选框打印数据");
      console.log(val, "选择复选框打印数据");
      // this.patientIdsList.push(val.patientId);
      if (val.target.checked) {
        this.patientIdsList.push(item);
      } else {
        for (let i = 0; i < this.patientIdsList.length; i++) {
          if (this.patientIdsList[i].patientId == item.patientId) {
            this.patientIdsList.splice(i, 1);
          }
        }
      }
      console.log(this.patientIdsList, "选择完成的复选框打印数据");
    },
    timeDefault() {
      let date = new Date();
      let str =
        date.getFullYear() +
        "-" +
        parseInt(date.getMonth() + 1) +
        "-" +
        date.getDate();
      return str;
    },
    rowClickFun(row, column, event) {
      console.log(row, "选择当前行的数据");
    },
    // 查看不可选择的复选框
    selectable(row, index) {
      if (row.execStatus == "0") {
        return true;
      } else {
        return false;
      }
    },
    // yong
    // 拆分
    async breakUp() {
      if (this.receivePatientData.length == 0) {
        this.$message.error("请选择左侧患者？？");
        return false;
      }
      // if(this.patientIdsList.length == 0){
      //   this.$message.error("请选择需要执行的患者？？")
      //   return false;
      // }
      if (
        this.rightPara.startTime.length == "0" &&
        this.rightPara.endTime.length == "0"
      ) {
        this.$message.error("请选择时间");
        return false;
      }
      let data = {
        patientId: "",
        startTime: this.rightPara.startTime,
        endTime: this.rightPara.endTime,
        patientName: ""
      };
      console.log(this.receivePatientData, "拆分数据");
      this.breakUpStyle = true;
      for (let i = 0; i < this.receivePatientData.length; i++) {
        data.patientId = this.receivePatientData[i].patientId;
        data.patientName = this.receivePatientData[i].patientName;
        try {
          let res = await execFun(data);
          if (res.code == "1") {
            // this.$message.success(res.msg || "拆分成功");
          } else {
            this.$message.error(res.msg || "拆分失败");
          }
          // this.tableDataWrapList = [];
        } catch (error) {}
      }
      // this.patientIdsList = [];
      this.execGetList();
      this.$message.success("请求已提交，数据会逐步更新");
      this.$nextTick(function() {
        this.breakUpStyle = false;
      });
    },
    // 执行
    performFun(a) {
      this.isPerformFun = a;
      if (this.chooseTableIdList.length == "0") {
        this.$message.error("选择至少一条医嘱");
        this.performFunStyle = false;
        return;
      }
      if (a === "2") {
        this.modelVisible = true;
        this.performs.execTime = this.dayjs(new Date()).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        // this.performs.execName = base64.decode(getUserId());
        this.performs.execName = base64.decode(getUserName());
      } else if (a === "0") {
        this.conserveConfirm();
      }
    },
    conserve() {
      this.$refs["performs"].validate(valid => {
        if (valid) {
          this.conserveConfirm();
        }
      });
    },
    // 确认执行or撤销
    conserveConfirm() {
      let a = this.isPerformFun;
      this.performFunStyle = true;
      let indexStyle = "";
      for (let i = 0; i < this.chooseTableData.length; i++) {
        if (this.chooseTableData[i].execStatus == a) {
          indexStyle = a;
          break;
        }
      }
      if (indexStyle == "0") {
        // this.$message.error("不可重复操作请重新选择医嘱！！！");
        this.$message.error("未执行的医嘱不可撤销！");
        this.performFunStyle = false;
        return;
      }
      if (indexStyle == "2") {
        // this.$message.error("不可重复操作请重新选择医嘱！！！");
        this.$message.error("已经执行的医嘱不可重复执行！");
        this.performFunStyle = false;
        return;
      }
      let data = {
        execIds: this.chooseTableIdList,
        execStatus: a,
        execType: this.activeName
      };
      if (a === "2") {
        data.execName = this.performs.execName;
        data.execTime = this.performs.execTime;
      }
      this.execStatus(data);
    },
    huidanClose() {
      this.isPerformFun = "";
      this.modelVisible = false;
      this.$refs["performs"].resetFields();
    },
    // 画诊断
    generateDialog(data) {
      let str = "<div>";
      for(let i in data) {
        str += `<div style='font-size:10px;'>${data[i].diagnosisType}</div>`
      }
      return str + "</div>";
    },
    // 画table
    generateTable(data) {
      let commonStyle =
        "border:none;border-collapse: collapse;";
      let trCommonStyle = "height:25px;text-align:center;font-size:12px;line-height:25px";
      let header = [
        {
          label: "",
          prop: "num",
          style: "width:30px;" + commonStyle + trCommonStyle
        },
        {
          label: "",
          prop: "",
          style: "width:350px;margin-top:5px;over-flow:hidden;" + commonStyle + trCommonStyle,
          children: [
            {
              prop: "first",
              children: [
                {
                  label: "",
                  prop: "basicType",
                  style: "height:25px;" + commonStyle + trCommonStyle
                },
                {
                  label: "",
                  prop: "itemName",
                  style: "height:25px;display:inline-block;margin-right:15px;" + commonStyle + trCommonStyle
                },
                {
                  label: "",
                  prop: "spec",
                  style: "height:25px;" + commonStyle + trCommonStyle
                }
              ]
            },
            {
              prop: "second",
              children: [
                {
                  label: "用法：",
                  prop: "useWay",
                  style: "height:25px;display:inline-block;margin-right:15px;" + commonStyle + trCommonStyle
                },
                {
                  label: "单次剂量：",
                  prop: "onceDosage",
                  style: "height:25px;" + commonStyle + trCommonStyle
                }
              ]
            }
          ]
        },
        {
          label: "",
          prop: "",
          style: "width:100px;margin-top:5px;over-flow:hidden;text-align:right;" + commonStyle + trCommonStyle,
          children: [
            {
              prop: "first",
              children: [
                {
                  label: "",
                  prop: "quantity",
                  style: "height:25px;" + commonStyle + trCommonStyle
                },
                {
                  label: "",
                  prop: "unit",
                  style: "height:25px;display:inline-block;margin-right:15px;" + commonStyle + trCommonStyle
                },
                {
                  label: "",
                  prop: "amount",
                  style: "height:25px;" + commonStyle + trCommonStyle
                }
              ]
            },
            {
              prop: "second",
              children: [
                {
                  label: "频次：",
                  prop: "frequencyName",
                  style: "height:25px;" + commonStyle + trCommonStyle
                }
              ]
            }
          ]
        }
      ];
      let str = "<table border='0' style='width:100%;" + commonStyle + "'>";
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        str += "<tr>";
        for (let j = 0; j < header.length; j++) {
          const h = header[j];
          if (h.hasOwnProperty("children")) {
            str += "<td style=''>";
            for (let k = 0; k < h.children.length; k++) {
              const val = h.children[k];
              str += "<div style='" + val.style + "'>";
              for (let key = 0; key < val.children.length; key++) {
                const vv = val.children[key];
                str += "<span style='" + vv.style + "'>" + vv.label + item[vv.prop] + " </span>";
              }
              str += "</div>";
            }
          } else {
            str += "<td style='" + h.style + "'>" + item[h.prop];
          }

          str += "</td>";
        }
        str += "</tr>";
      }
      return str + "</table>";
    },
    //打印
    printFun() {
      if (this.rightPara.patientIds.length == 0) {
        this.$message.error("请选择患者");
        return false;
      }
      if (this.chooseTableDataPatients.length > 1) {
        this.$message.error("只能勾选一个患者执行记录");
        return false;
      }

      if (this.chooseTableIdList.length == "0") {
        this.$message.error("选择至少一条医嘱");
        return false;
      }
      let markStyle = true;

      let data = {
        execIds: this.chooseTableIdList,
        // execStatus: a,
        execType: this.activeName
      };

      this.getPrintData(data);

      // getTreatmentPrint,
      //   getDrugPrint,
    },
    //异步获取打印信息
    async getPrintData(data) {
      let inputData = {
        execIds: data.execIds,
        patientId: this.chooseTableDataPatients[0]
      };

      //执行类型 0药品 1执行
      if (data.execType == "0") {
        //药品调用这个
        // 判断  是不是同一类型的药品进行打印
        let numList = [];
        for (let i = 0; i < this.chooseTableData.length; i++) {
          if (this.chooseTableData[i].orderItemGroupCat == "11") {
            numList.push(1);
          }
        }
        console.log(numList)

        if (numList.length !== 0) {
          if (numList.length < this.chooseTableData.length) {
            this.$message.error(
              "请选择一种类型的药品(比如：选择全是中草药或者选择其他的药品，只能选择一种)"
            );
            return false;
          } else if (numList.length == this.chooseTableData.length) {
            let res = await getChineseDrugPrint(inputData); //中草药时候打印
            onPreview(res.data, "家床中草药取药单");
          }
        } else {
          let res = await getDrugPrint(inputData); //西药和中成药的打印
          let objData = {
            orgName: "",
            hosName: "",
            bodyWeight: "",
            chargeTypeName: "",
            computerCardNumber: "",
            houseBedCode: "",
            patientName: "",
            gender: "",
            age: "",
            deptName: "",
            doctorName: "",
            nurseName: "",
            tel: "",
            idCardNumber: "",
            addr: "",
            diagnosises: "",
            part3: "",
            sendDrugName: "",
            sendTime: "",
            reveiveName: ""
          }
          let printData = {
            ...objData,
            ...res.data
          };
          let tableContent = this.generateTable(printData.part3);
          let diagnosises = this.generateDialog(printData.diagnosis);
          printData.part3 = tableContent;
          printData.diagnosises = diagnosises;
          printData.orgName = (printData.orgName || JSON.parse(localStorage.getItem("pamars")).hosName || "") + " 家庭病床取药单";
          printData.hosName = printData.hosName || JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团";
          // let { code, data: datas } = await getPrintTpl(codes.t4);
          // if (code != 1) return false;
          // console.log(datas.value);
          //渔村街道社区健康服务中心 家庭病床取药单

          print(null, t4, {}, printData);
          // onPreview(res.data, "家床领药单");
        }
      } else if (data.execType == "1") {
        //执行调用这个
        let res = await getTreatmentPrint(inputData);
        if(res.code == 1) {
          let printData = inpOrderTplGenerateTable(res.data.list);
          print(null, inpOrderTpl, {}, {
            list: printData
          });
        }
        // onPreview(res.data, "项目医嘱执行单");
      }
      await uploadPrintInfo(data.execIds);
    },
    //打印药品执行
    printDrugFun() {
      if (this.rightPara.patientIds.length == 0) {
        this.$message.error("请选择患者");
        return false;
      }
      if (this.chooseTableDataPatients.length > 1) {
        this.$message.error("只能勾选一个患者执行记录");
        return false;
      }
      if (this.chooseTableIdList.length == "0") {
        this.$message.error("选择至少一条医嘱");
        return false;
      }
      let data = {
        execIds: this.chooseTableIdList,
        // execStatus: a,
        execType: this.activeName
      };
      this.getPrintDrugData(data);

      // getTreatmentPrint,
      //   getDrugPrint,
    },
    //异步获取药品执行打印信息
    async getPrintDrugData(data) {
      let inputData = {
        execIds: data.execIds,
        patientId: this.chooseTableDataPatients[0]
      };

      //执行调用这个
      /* let res = await getTreatmentPrint(inputData);
      onPreview(res.data, "项目医嘱执行单", {
        direction: 2
      }); */
      let res = await getTreatmentPrint(inputData);
        if(res.code == 1) {
          let printData = inpOrderTplGenerateTable(res.data.list);
          print(null, inpOrderTpl, {}, {
            list: printData
          });
        }
      await uploadPrintInfo(data.execIds);
    },

    // 用药
    applyMedication() {
      if (this.chooseTableIdList.length == "0") {
        this.$message.error("选择至少一条医嘱");
        return false;
      }
      this.drugDispensing(this.chooseTableIdList);
    },
    //stoPperformFun  停止执行
    async stoPperformFun() {
      let indexStyle = false;
      for (let i = 0; i < this.chooseTableData.length; i++) {
        if (this.chooseTableData[i].drugRecordStatus != 10) {
          indexStyle = true;
          break;
        }
      }
      if (indexStyle) {
        this.$message.error("当前医嘱不可进行停止执行操作！");
        return;
      }
      if (this.chooseTableIdList.length == "0") {
        this.$message.error("选择至少一条医嘱");
        return false;
      }
      try {
        let res = await execStop(this.chooseTableIdList);
        if (res.code == "1") {
          this.chooseTableIdList = [];
          this.$message.success("停止成功");
          this.execGetList();
          this.chooseTableIdList = [];
        } else {
          this.$message.error(res.msg || "停止失败");
        }
      } catch (error) {}
    },
    // 用药方法
    async drugDispensing(data) {
      try {
        let res = await drugDispensing(data);
        if (res.code == "1") {
          this.chooseTableIdList = [];
          this.$message.success("申请成功");
        } else {
          this.$message.error(res.msg || "申请失败");
        }
      } catch (error) {}
      this.execGetList();
      this.chooseTableIdList = [];
    },
    // 拆分方法
    async breakUpFun(data) {
      console.log(data, "拆分提交信息");
      try {
        let res = await execFun(data);
        if (res.code == "1") {
          this.$message.success(res.msg || "拆分成功");
        } else {
          this.$message.error(res.msg || "拆分失败");
        }
      } catch (error) {}
    },
    // 修改医嘱状态
    async execStatus(data) {
      let msgText = "";
      if (data.execStatus == "0") {
        //撤销
        msgText = "撤销";
      } else {
        msgText = "执行";
      }
      try {
        let res = await execStatus(data);
        if (res.code == "1") {
          this.chooseTableIdList = [];
          this.$message.success(msgText + "成功");
          this.execGetList();
          this.modelVisible = false;
          this.$refs["performs"].resetFields();
        } else {
          this.$message.error(res.msg || msgText + "失败");
        }
      } catch (error) {}
      this.execGetList();
    },

    // 截取时间
    interception(data) {
      let str = "";
      if (data) {
        str = data.substring(-1, 11);
      } else {
        str = "--:--";
      }
      return str;
    },
    // 树形接口的节点
    async execGetList() {
      console.log(this.rightPara, "打印的列表传参");
      this.rightPara.OrderCat.length == 0
        ? (this.rightPara.OrderCat = [])
        : this.rightPara.OrderCat;
      this.rightPara.execStatus.length == 0
        ? (this.rightPara.execStatus = [])
        : this.rightPara.execStatus;
      this.rightPara.execType = this.activeName;
      this.tableDataWrapList = [];
      try {
        let res = await execGetList(this.rightPara);
        console.log(res, "遗嘱执行记录");
        if (res.code == "1") {
          if (res.data.length !== 0) {
            this.tableDataWrapList = this.receivePatientData;
            for (let i = 0; i < this.tableDataWrapList.length; i++) {
              this.tableDataWrapList[i].tableData = [];
              for (let j = 0; j < res.data.length; j++) {
                if (
                  res.data[j].patientId == this.tableDataWrapList[i].patientId
                ) {
                  let list = this.groupNoClsFun(res.data[j].execList);
                  this.tableDataWrapList[i].tableData = list;
                  this.tableDataWrapList[i].groupNoList = setGroupNoList(list);
                }
              }
            }
            console.log(this.tableDataWrapList, "=====树形列表的渲染数据====");

            function filterByName(aim, name) {
              return aim.filter(item => item.tableData.length != name);
            }
            this.tableDataWrapList = filterByName(this.tableDataWrapList, "0");
            console.log(this.tableDataWrapList.length);
            this.performFunStyle = false;
            console.log("调试添加后的数据", this.tableDataWrapList);
          } else {
            this.tableDataWrapList = [];
          }
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        console.log(error, "接口保存信息");
      }
    },
    // 点击table
    handleSelectionChange(val) {
      this.chooseTableIdList = [];
      this.chooseTableData = [];
      this.chooseTableDataPatients = [];
      console.log(this.$refs.multipleTable[0].selection, "打印的节点的信息");
      for (let i = 0; i < this.tableDataWrapList.length; i++) {
        if (this.$refs.multipleTable[i].selection.length > 0) {
          for (
            let j = 0;
            j < this.$refs.multipleTable[i].selection.length;
            j++
          ) {
            this.chooseTableData.push(this.$refs.multipleTable[i].selection[j]);
          }
          this.chooseTableDataPatients.push(
            this.$refs.multipleTable[i].selection[0].patientId
          );
        }
      }
      console.log(this.chooseTableData, "执行记录");
      console.log(this.chooseTableDataPatients, "患者人数");
      // return false;
      // chooseTableIdList
      for (let i = 0; i < this.chooseTableData.length; i++) {
        this.chooseTableIdList.push(this.chooseTableData[i].id);
      }

      console.log(this.chooseTableIdList, "id的集合");
      console.log(this.chooseTableData);
    },
    // 切换十日
    datePicker() {
      this.rightPara.startTime =
        this.queryData.dateTime && this.queryData.dateTime.length
          ? this.queryData.dateTime[0] + " 00:00:00"
          : "";
      this.rightPara.endTime =
        this.queryData.dateTime && this.queryData.dateTime.length
          ? this.queryData.dateTime[1] + " 23:59:59"
          : "";
    },
    // 清空
    emptyDateFun() {
      this.queryData = {
        searchValue: ""
      };
      this.rightPara.orderItemName = "";
      this.rightPara.execStatus = [];
      this.rightPara.OrderCat = [];
    },
    heQuery() {
      if (this.rightPara.patientIds.length == "0") {
        this.$message.error("请选择患者");
        return false;
      }
      this.execGetList();
    },
    // 切换手风箱
    handleChange() {},
    // 切换遗嘱
    radioFun() {
      if (this.rightPara.patientIds.length == "0") {
        this.$message.error("请选择患者");
        return false;
      }
      this.execGetList();
    },
    // 切换执行
    bedsDataFun() {
      if (this.rightPara.patientIds.length == "0") {
        this.$message.error("请选择患者");
        return false;
      }
      this.execGetList();
    },
    // 切换
    handleClick() {
      console.log(this.activeName, "切换table");

      if (this.rightPara.patientIds.length == "0") {
        this.$message.error("请选择患者");
        return false;
      }
      this.execGetList();
    },
    // 获取基本信息
    getPamars() {
      const Pamars = "pamars";
      return localStorage.getItem(Pamars);
    },
    messageHandler() {},
    expireTimeOption() {},
    //element组件input无法输入问题
    inputChange(e) {
      this.$forceUpdate();
    }
  },
  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      handler(a) {
        console.log(this.receivePatientData, "左侧传出数据");
        this.rightPara.patientIds = [];
        this.rightPara.treatNos = [];
        if (this.receivePatientData && this.receivePatientData.length > 0) {
          this.tableDataWrapList = this.receivePatientData;
          for (let i = 0; i < this.receivePatientData.length; i++) {
            this.tableDataWrapList[i].tableData = [];
            this.rightPara.patientIds.push(
              this.receivePatientData[i].patientId
            );
            this.rightPara.treatNos.push(this.receivePatientData[i].inpCode);
          }
          this.execGetList();
        } else {
          this.tableDataWrapList = [];
        }
      }
    },
    tableDataWrapList: {
      immediate: true,
      deep: true,
      handler(a) {}
    }
  }
};
</script>

<style lang="scss" scoped>
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: $l-bg-radius-max;
  font-size: 0;
  box-sizing: border-box;

  /deep/ .el-collapse-item .el-collapse-item__content {
    padding-left: 0px;
  }

  // new class
  .patient-top {
    background-color: #ffffff;
    height: 60px;
    width: 100%;
    border-radius: 10px;
    padding: 0px 5px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    float: inherit;

    .patient-border {
      width: auto;
      border-right: 1px solid #cccccc;
      padding-right: 10px;
      padding-left: 10px;
      line-height: 30px;
    }

    .patient-borderA {
      width: auto;
      margin: 0px 15px;
    }
  }

  .patientList {
    width: 260px;
    height: 195px;
    background-color: #ffffff;
    padding: 5px;
    box-sizing: border-box;
    margin: 5px;
    border-radius: 8px;
    float: left;

    .patientList-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #cccccc;
      padding: 5px 0px;

      .patientList-top-Rt {
        color: #2b4583;
        font-size: 22px;
      }
    }

    .patientList-bottom {
      display: flex;
      // align-items: center;
      justify-content: center;
      padding-top: 10px;

      .patientList-b-l {
        padding-top: 4px;
      }
    }
  }

  // new class

  .patient-card {
    font-size: 16px;

    /deep/.patient-card-right {
      display: flex;
    }

    .patientInfo-left {
      display: inline-flex;
      vertical-align: top;
      text-align: center;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      flex: 1;

      .patientInfo-left-a {
        .diagName {
          font-size: 16px;
          font-weight: 500;
          color: #2e323a;
          display: inline-block;
          max-width: 210px;
        }

        .allergyName {
          background: rgba(241, 47, 47, 0.1);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 400;
          color: #ef0f0f;
          display: inline-block;
          max-width: 150px;
        }
      }

      .patientInfo-left-b {
        .button + .button {
          margin-left: 8px;
        }
      }
    }
  }

  .m-contain {
    display: flex;
    flex-direction: column;
    height: calc(100% - 56px);
    box-sizing: border-box;

    .table-box {
      padding: $l-padding-default-6;
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .main-table {
        flex: 1;
        overflow: hidden;
      }
    }

    .topTreeStyle {
      overflow: auto;
      padding: 10px 0;
      height: calc(100% - 27px);
    }

    .bottom-box {
      text-align: right;
      padding: 16px;
      border-top: 1px solid $l-color-bgcolor-11;

      .totalMoney {
        font-size: 16px;
        margin-right: 32px;
      }

      .color-red {
        color: $l-color-fontcolor-5;
      }
    }
  }
}

.bunchingUp {
  display: inline-block;
  color: $l-color-primary;

  &::after {
    content: "┓";
  }
}

.bunchingCenter {
  display: inline-block;
  color: $l-color-primary;

  &::after {
    content: "┫";
  }
}

.bunchingDown {
  color: $l-color-primary;
  display: inline-block;

  &::after {
    content: "┛";
  }
}

.overflowEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
