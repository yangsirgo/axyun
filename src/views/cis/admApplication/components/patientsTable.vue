<template>
  <div class="height100 table_tabs_wrapper">
    <el-tabs
      class="height100 table_tabs"
      v-model="activeName"
      type="card"
      @tab-click="loadData()"
      v-loading="loading"
    >
      <el-tab-pane name="first">
        <span slot="label">
          待诊
          <i class="el-icon-refresh-right"></i>
        </span>
        <el-table
          element-loading-text="加载中..."
          header-cell-class-name="headerCls"
          row-class-name="rowStyleCls"
          height="100%"
          :data="showData.wait"
          style="width: 100%;"
        >
          <el-table-column
            prop="queueUpNum"
            label="排队"
            align="center"
            show-overflow-tooltip
            header-align="center"
            min-width="19%"
          ></el-table-column>
          <el-table-column
            prop="visitCode"
            label="门诊号"
            show-overflow-tooltip
            align="center"
            header-align="center"
            min-width="23%"
          ></el-table-column>
          <el-table-column
            prop="patientName"
            min-width="21%"
            show-overflow-tooltip
            align="center"
            header-align="center"
            label="姓名"
          ></el-table-column>
          <el-table-column
            prop="recordStatus"
            min-width="18%"
            show-overflow-tooltip
            align="center"
            header-align="center"
            label
          >
            <template slot-scope="scope">
              <span class="pa" v-if="scope.row.appointmentMode === 1">平安</span>
              <span class="wz" v-if="scope.row.appointmentMode === 2">微诊</span>
              <span class="other" v-if="scope.row.appointmentMode === 3">114</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            align="center"
            header-align="center"
            show-overflow-tooltip
            min-width="19%"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="recPatientHandler(scope.row)"
              >{{scope.row.optStr}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label">
          已诊
          <i class="el-icon-refresh-right"></i>
        </span>
        <el-table
          v-if="activeName === 'second'"
          element-loading-text="加载中..."
          header-cell-class-name="headerCls"
          row-class-name="rowStyleCls"
          height="100%"
          :data="showData.received"
          style="width: 100%"
        >
          <el-table-column
            prop="queueUpNum"
            label="排队"
            align="center"
            header-align="center"
            min-width="19%"
          ></el-table-column>
          <el-table-column
            prop="visitCode"
            show-overflow-tooltip
            label="门诊号"
            align="center"
            header-align="center"
            min-width="24%"
          ></el-table-column>
          <el-table-column
            prop="patientName"
            min-width="23%"
            align="center"
            header-align="center"
            show-overflow-tooltip
            label="姓名"
          ></el-table-column>
          <el-table-column
            prop="recordStatus"
            min-width="18%"
            header-align="center"
            align="center"
            label="状态"
          ></el-table-column>
          <el-table-column
            prop="operate"
            align="center"
            header-align="center"
            min-width="19%"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="recPatientHandler(scope.row)"
              >{{scope.row.optStr}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="third">
        <span slot="label">
          全部
          <i class="el-icon-refresh-right"></i>
        </span>
        <el-table
          v-if="activeName === 'third'"
          element-loading-text="加载中..."
          height="100%"
          header-cell-class-name="headerCls"
          row-class-name="rowStyleCls"
          :data="showData.bakList"
          style="width: 100%"
        >
          <el-table-column
            prop="queueUpNum"
            label="排队"
            align="center"
            header-align="center"
            min-width="19%"
          ></el-table-column>
          <el-table-column
            prop="visitCode"
            label="门诊号"
            align="center"
            header-align="center"
            show-overflow-tooltip
            min-width="24%"
          ></el-table-column>
          <el-table-column
            prop="patientName"
            min-width="23%"
            header-align="center"
            align="center"
            show-overflow-tooltip
            label="姓名"
          ></el-table-column>
          <el-table-column
            prop="recordStatus"
            min-width="18%"
            align="center"
            header-align="center"
            label="状态"
          ></el-table-column>
          <el-table-column
            prop="operate"
            align="center"
            header-align="center"
            min-width="19%"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="recPatientHandler(scope.row)"
              >{{scope.row.optStr}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 接诊弹窗 -->
    <el-dialog
      class="receivePatients"
      title="接诊"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="dialog-div">
        <div role="alert" ref="alertBody" class="el-message el-message--warning is-closable">
          <i class="el-message__icon el-icon-warning"></i>
          <p class="el-message__content">请先选择患者的就诊类型后在进行就诊</p>
          <i
            class="el-message__closeBtn el-icon-close"
            @click="$refs.alertBody.style.display = 'none'"
          ></i>
        </div>
        <el-form :model="rpForm" class="demo-form-inline">
          <el-form-item label="就诊类型">
            <el-radio-group v-model="rpForm.type">
              <el-radio label="0">出诊</el-radio>
              <el-radio label="1">复诊</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">接诊</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveSign, updateSign, findByPatientId } from "@/api/cis/order/order";
import {
  getPatients,
  receive,
  findAllergy,
  selectPatientBySth
} from "@/api/cis/visit/visit";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "patientInf",
  data() {
    return {
      dialogVisible: false,
      rpForm: {
        type: "0"
      },
      loading: false,
      ruleForm: {
        state: "",
        date1: []
      },
      //危急值
      critical: {
        criticalList: [
          {
            checkRes: "白细胞", //检查结果
            checkPro: "血常规", //检查类型
            dateTime: "05-10 09:03" //检查时间
          }
        ],
        criticalNumber: 2
      },
      //体征异常
      physicalSign: {
        physicalSignList: [
          {
            checkRes: "39.8℃", //检查结果
            checkPro: "体温", //检查类型
            dateTime: "05-10 09:03" //时间
          }
        ],
        physicalSignNo: 2
      },
      stateOptions: [
        {
          label: "全部",
          value: "third"
        },
        {
          label: "已诊",
          value: "second"
        },
        {
          label: "未诊",
          value: "first"
        }
      ],
      rules: {
        // state: [
        //   { message: '请选择就诊状态', trigger: 'change' }
        // ],
        date1: [{ type: "date", message: "请选择日期", trigger: "change" }]
        // date2: [
        //   { type: 'date', message: '请选择时间', trigger: 'change' }
        // ]
      },
      showFilter: false,
      heightCalc: 159,
      collapseArrowCls: "el-icon-caret-bottom",
      collapseArrowCls2: "el-icon-caret-bottom",
      activeNames: ["1", "2"],
      currentType: 6,
      searchValue: "",
      searchReasult: "",
      labelPosition: "right",
      formLabelAlign: {
        height: "",
        weight: "",
        temperature: "",
        bloodPressureHeight: "",
        bloodPressureLow: "",
        regId: "",
        patientId: "",
        readOnly: true,
        visitCode: "",
        visitId: ""
      },
      activeName: "first",
      data: {
        bakList: [],
        wait: [],
        received: []
      },
      showData: {
        bakList: [],
        wait: [],
        received: []
      }
    };
  },
  components: {},
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    handleClose(done) {},
    submitForm(formName) {
      this.activeName = this.ruleForm.region;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {};
          // alert("this.searchValue："+this.searchValue);
          if (this.ruleForm.date1 == null) {
            this.ruleForm.date1 = [];
            let date1 = new Date();
            let newDay =
              date1.getFullYear() +
              "-" +
              (date1.getMonth() + 1) +
              "-" +
              date1.getDate();
            let start = this.fun_date4Start(new Date(newDay.replace(/-/, "/")));
            let end = this.fun_date4End(new Date(newDay.replace(/-/, "/")));
            this.ruleForm.date1.push(start);
            this.ruleForm.date1.push(end);
          }
          if (this.searchValue != null && this.searchValue != "") {
            data = {
              searchValue: this.searchValue
            };
            selectPatientBySth(data).then(res => {
              this.searchReasult = "";
              for (let i = 0; i < res.data.length; i++) {
                this.searchReasult += res.data[i] + ",";
              }
              this.loadData();
            });
          } else {
            this.searchReasult = [];
            this.loadData();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
        this.showFilter = false;
      });
    },
    //患者列表patient 的高度计算
    setHeightCalc() {
      let topCard = this.$refs["top-card"].$el;
      let filter = this.$refs["filter"];
      // margin-top 20 和 tabs 高 40
      this.heightCalc = topCard.clientHeight - filter.clientHeight - 60;
    },
    handleChange(value) {
      //第一块面板控制
      if (value.indexOf("1") > -1) {
        this.collapseArrowCls = "el-icon-caret-bottom";
      } else {
        this.collapseArrowCls = "el-icon-caret-right";
      }

      //第二块面板控制
      if (value.indexOf("2") > -1) {
        this.collapseArrowCls2 = "el-icon-caret-bottom";
      } else {
        this.collapseArrowCls2 = "el-icon-caret-right";
      }
    },
    changeStartValue(n) {
      this.formLabelAlign.bloodPressureHeight = n;
    },
    changeEndValue(n) {
      this.formLabelAlign.bloodPressureLow = n;
    },
    recPatientHandler(row) {
      if (row.recordStatus == 6) {
        receive(row).then(res => {
          if (res.code === 1) {
            this.changeRecPatientData(row).then(() => {
              // console.log(this.$store.state.cis.receivePatientData);
              this.loadData();
              this.loadSign();
            });
          } else {
            this.$notify.error({
              title: "错误",
              message: "接诊失败，请联系管理员"
            });
          }
        });
      } else if (row.optStr == "编辑") {
        this.changeRecPatientData(row);
      } else if (row.optStr == "查看") {
        this.changeRecPatientData(row);
      }
    },
    saveSign() {
      // alert(JSON.stringify(this.formLabelAlign));
      // return;
      if (!this.validateForSaveSign()) {
        return;
      }
      this.formLabelAlign.visitCode = this.$store.state.cis.receivePatientData.visitCode;
      this.formLabelAlign.regId = this.$store.state.cis.receivePatientData.regId;
      this.formLabelAlign.visitCode = this.$store.state.cis.receivePatientData.visitCode;
      this.formLabelAlign.patientId = this.$store.state.cis.receivePatientData.patientId;
      if (!this.formLabelAlign.readOnly) {
        saveSign(this.formLabelAlign).then(res => {
          if (res.data == 1) {
            this.$notify({
              title: "成功",
              message: "保存体征信息成功",
              type: "success"
            });
            this.formLabelAlign.readOnly = true;
          }
        });
      } else {
        updateSign(this.formLabelAlign).then(res => {
          if (res.data == 1) {
            this.$notify({
              title: "成功",
              message: "更新体征信息成功",
              type: "success"
            });
          }
        });
      }
    },
    validateForSaveSign() {
      let re = /^[0-9]+.?[0-9]*/;
      //可编辑状态下才可提交保存
      if (!this.formLabelAlign.readOnly) {
        if (this.formLabelAlign.height == "") {
          this.$notify.error({
            title: "错误",
            message: "身高不能为空"
          });
          return false;
        }
        if (this.formLabelAlign.height.length > 5) {
          this.$notify.error({
            title: "错误",
            message: "身高不能超过5字符"
          });
          return false;
        }
        if (!re.test(this.formLabelAlign.height)) {
          this.$notify.error({
            title: "错误",
            message: "身高必须为数字"
          });
          return false;
        }

        if (this.formLabelAlign.weight == "") {
          this.$notify.error({
            title: "错误",
            message: "体重不能为空"
          });
          return false;
        }
        if (this.formLabelAlign.weight.length > 5) {
          this.$notify.error({
            title: "错误",
            message: "体重不能超过5字符"
          });
          return false;
        }
        if (!re.test(this.formLabelAlign.weight)) {
          this.$notify.error({
            title: "错误",
            message: "体重必须为数字"
          });
          return false;
        }

        if (this.formLabelAlign.temperature == "") {
          this.$notify.error({
            title: "错误",
            message: "体温不能为空"
          });
          return false;
        }
        if (this.formLabelAlign.temperature.length > 5) {
          this.$notify.error({
            title: "错误",
            message: "体温不能超过5字符"
          });
          return false;
        }
        if (!re.test(this.formLabelAlign.temperature)) {
          this.$notify.error({
            title: "错误",
            message: "体温必须为数字"
          });
          return false;
        }

        if (this.formLabelAlign.bloodPressureHeight == "") {
          this.$notify.error({
            title: "错误",
            message: "高压不能为空"
          });
          return false;
        }
        if (this.formLabelAlign.bloodPressureHeight.length > 5) {
          this.$notify.error({
            title: "错误",
            message: "高压不能超过5字符"
          });
          return false;
        }
        if (!re.test(this.formLabelAlign.bloodPressureHeight)) {
          this.$notify.error({
            title: "错误",
            message: "高压必须为数字"
          });
          return false;
        }

        if (this.formLabelAlign.bloodPressureLow == "") {
          this.$notify.error({
            title: "错误",
            message: "低压不能为空"
          });
          return false;
        }
        if (this.formLabelAlign.bloodPressureLow.length > 5) {
          this.$notify.error({
            title: "错误",
            message: "低压不能超过5字符"
          });
          return false;
        }
        if (!re.test(this.formLabelAlign.bloodPressureLow)) {
          this.$notify.error({
            title: "错误",
            message: "低压必须为数字"
          });
          return false;
        }
      }
      return true;
    },
    loadData() {
      this.loading = true;
      this.showData = {
        wait: [],
        received: [],
        bakList: []
      };
      this.data = {
        wait: [],
        received: [],
        bakList: []
      };

      let data = {
        startDate: this.ruleForm.date1[0],
        stopDate: this.ruleForm.date1[1],
        patientIds:
          this.searchReasult != ""
            ? this.searchReasult.substring(0, this.searchReasult.length - 1)
            : ""
      };
      try {
        // alert(this.activeName);
        if (this.activeName == "first") {
          let date1 = new Date();
          let newDay =
            date1.getFullYear() +
            "-" +
            (date1.getMonth() + 1) +
            "-" +
            date1.getDate();
          data.startDate = this.fun_date4TodayStart(
            new Date(newDay.replace(/-/, "/"))
          );
          data.stopDate = this.fun_date4End(new Date(newDay.replace(/-/, "/")));
        }
        // alert(JSON.stringify(data));
        let patientIds = "";
        getPatients(data, false).then(res => {
          this.data.bakList = res.data;
          for (let i = 0; i < this.data.bakList.length; i++) {
            if (this.data.bakList[i].recordStatus == 6) {
              this.data.bakList[i].optStr = "接诊";
              this.data.wait.push(this.data.bakList[i]);
            } else {
              if (this.data.bakList[i].recordStatus == 99) {
                //有检查检验报告，回诊
              } else {
                //没有检查检验报告
                if (this.isToday(this.data.bakList[i].attendTime)) {
                  //今天，编辑
                  this.data.bakList[i].optStr = "编辑";
                } else {
                  this.data.bakList[i].optStr = "查看";
                }
              }

              // //查看、编辑、回诊
              // if (this.isToday(this.data.bakList[i].attendTime)) {
              //   //今天，编辑
              //   this.data.bakList[i].optStr = '编辑';
              // }else{
              //   if(this.data.bakList[i].recordStatus == 99){
              //     //查看
              //     this.data.bakList[i].optStr = '查看';
              //     alert(JSON.stringify(this.data.bakList[i].optStr));
              //   }else if(this.data.bakList[i].recordStatus == 66){
              //     //回诊
              //
              //   }
              // }
              this.data.received.push(this.data.bakList[i]);
            }
            //生日转年龄
            this.data.bakList[i].age =
              this.data.bakList[i].hasOwnProperty("birthDate") &&
              this.data.bakList[i].birthDate != "" &&
              this.data.bakList[i].birthDate != null
                ? this.jsGetAge(this.data.bakList[i].birthDate.substring(0, 10))
                : "";
            patientIds += res.data[i].patientId + ",";
          }
          // if (this.data.bakList.length > 0) {
          //   this.loadAllergic(patientNums);
          // }
          this.showData = this.data;
          console.info("00000000:" + JSON.stringify(this.showData));
          this.loading = false;
        });
      } catch (e) {
        this.loading = false;
      }
    },
    //获取过敏信息
    loadAllergic(patientIds) {
      let data = {
        params: patientIds
      };
      findAllergy(data).then(res => {
        for (let i = 0; i < this.showData.bakList.length; i++) {
          for (let j = 0; j < res.data.length; j++) {
            if (this.showData.bakList[i].patientId === res.data[j].patientId) {
              this.showData.bakList[i].allergic =
                res.data[j].symptomDescription;
            }
          }
        }
      });
      // this.data.list = this.data.baklist;
    },
    loadSign() {
      //初始化体征信息
      this.formLabelAlign = {
        height: "",
        weight: "",
        temperature: "",
        bloodPressureHeight: "",
        bloodPressureLow: "",
        regId: "",
        visitCode: "",
        patientId: "",
        readOnly: true
      };
      let patientId = this.$store.state.cis.receivePatientData.patientId;
      let data = {
        patientId: patientId
      };
      if (
        this.$store.state.cis.receivePatientData.hasOwnProperty("patientId")
      ) {
        findByPatientId(data).then(res => {
          if (res.hasOwnProperty("data")) {
            this.formLabelAlign = res.data;
            this.formLabelAlign.readOnly = true;
          }
        });
      }
    },
    fun_date4Start(date1) {
      let date2 = new Date(date1);
      date2.setDate(date1.getDate() - 2);
      let time2 =
        date2.getFullYear() +
        "-" +
        (date2.getMonth() + 1) +
        "-" +
        date2.getDate();
      return new Date(time2.replace(/-/, "/"));
    },
    fun_date4TodayStart(date1) {
      let date2 = new Date(date1);
      date2.setDate(date1.getDate());
      let time2 =
        date2.getFullYear() +
        "-" +
        (date2.getMonth() + 1) +
        "-" +
        date2.getDate();
      return new Date(time2.replace(/-/, "/"));
    },
    fun_date4End(date1) {
      let date2 = new Date(date1);
      date2.setDate(date1.getDate() + 1);
      let time2 =
        date2.getFullYear() +
        "-" +
        (date2.getMonth() + 1) +
        "-" +
        date2.getDate();
      return new Date(time2.replace(/-/, "/"));
    },
    //计算生日
    jsGetAge(strBirthday) {
      let returnAge;
      let strBirthdayArr = strBirthday.split("-");
      let birthYear = strBirthdayArr[0];
      let birthMonth = strBirthdayArr[1];
      let birthDay = strBirthdayArr[2];
      let d = new Date();
      let nowYear = d.getFullYear();
      let nowMonth = d.getMonth() + 1;
      let nowDay = d.getDate();
      if (nowYear == birthYear) {
        returnAge = 0;
      } else {
        let ageDiff = nowYear - birthYear;
        if (ageDiff > 0) {
          if (nowMonth == birthMonth) {
            let dayDiff = nowDay - birthDay;
            if (dayDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          } else {
            let monthDiff = nowMonth - birthMonth;
            if (monthDiff < 0) {
              returnAge = ageDiff - 1;
            } else {
              returnAge = ageDiff;
            }
          }
        } else {
          returnAge = -1;
        }
      }
      return returnAge;
    },
    isToday(str) {
      if (new Date(str).toDateString() === new Date().toDateString()) {
        //今天
        console.log("当天");
        return true;
      }
      //之前
      console.log("以前的日期");
      return false;
    },
    selectPatientBySth() {
      this.showData = [];
      if (this.searchValue != "" && this.searchValue != null) {
        this.showData.bakList = [];
        let data = {
          searchValue: this.searchValue
        };
        selectPatientBySth(data).then(res => {
          this.searchReasult = res.data;
          this.submitForm("ruleForm");
        });
      } else {
        // alert(JSON.stringify(this.ruleForm.date1));
        this.submitForm("ruleForm");
      }
    },
    // initSearchValue(currentType) {
    //   this.currentType = currentType;
    //   // this.searchValue = '';
    //   // this.searchReasult = [];
    //   // this.ruleForm.date1 = [];
    //   this.loadData();
    // },
    dropClosed(e) {
      let targetNode = e.target;
      let filter = this.$refs["filter-card"] && this.$refs["filter-card"].$el;
      let dropBtn = this.$refs["dropBtn"] && this.$refs["dropBtn"].$el;
      if (
        targetNode === undefined ||
        dropBtn === undefined ||
        filter === undefined
      ) {
        return;
      } // 修复报错
      if (!filter.contains(targetNode) && !dropBtn.contains(targetNode)) {
        this.showFilter = false;
      }
    }
  },
  mounted() {
    let date1 = new Date();
    let newDay =
      date1.getFullYear() +
      "-" +
      (date1.getMonth() + 1) +
      "-" +
      date1.getDate();
    let start = this.fun_date4Start(new Date(newDay.replace(/-/, "/")));
    let end = this.fun_date4End(new Date(newDay.replace(/-/, "/")));
    this.ruleForm.date1.push(start);
    this.ruleForm.date1.push(end);
    this.loadData();
    this.loadSign();
    let me = this;
    this.$nextTick(() => {
      setTimeout(() => {
        me.setHeightCalc();
      }, 10);
    });
    document.addEventListener("click", this.dropClosed);
    // alert(JSON.stringify("刷新"+JSON.stringify(this.$store.state.cis.receivePatientData)))
  },
  destroyed() {
    this.dropClosed = null;
  },
  created() {
    this.chatTimer = setInterval(() => {
      console.log(this.chatTimer);
      this.changeDay(false);
    }, 1000 * 60 * 10);
  },
  beforeDestroy: function() {
    //实例销毁前调用
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>

<style scoped lang="scss">
.top-card-wrapper {
  height: 40%;
  padding-bottom: 10px;

  .top-card {
    width: 100%;
    /*height: calc(100% - 235px);*/
    /*position: absolute;*/
    /*height:400px;*/

    /deep/ .headerCls {
      height: 30px;
      background: $l-color-bgcolor-18;
      font-size: 14px;
      font-weight: 400;
      color: $l-color-fontcolor-3;
      padding: 0;
    }

    /deep/ .rowStyleCls {
      height: 40px;
      font-size: 14px;
      font-weight: 400;
      color: $l-color-fontcolor-3;

      > td {
        padding: 0;
      }
    }

    .pa {
      width: 32px;
      height: 21px;
      border-radius: 2px;
      border: 1px solid $l-color-bgcolor-11;
      font-size: 12px;
      font-weight: 500;
      color: $l-color-primary1;
      line-height: 17px;
    }

    .wz {
      width: 32px;
      height: 21px;
      border-radius: 2px;
      border: 1px solid $l-color-bgcolor-11;
      font-size: 12px;
      font-weight: 500;
      color: $l-color-fontcolor-1;
      line-height: 17px;
    }

    .other {
      width: 32px;
      height: 21px;
      border-radius: 2px;
      border: 1px solid $l-color-bgcolor-11;
      font-size: 12px;
      font-weight: 500;
      color: $l-color-bgcolor-15;
      line-height: 15px;
    }

    /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
      text-align: center;
      float: none;
    }

    .readCardWrapper {
      text-align: center;
      margin: 20px 20px 0;
      position: relative;

      .input {
        width: 100%;
      }

      .filter-card {
        position: absolute;
        top: 40px;
        left: -20px;
        right: -20px;
        z-index: 100;

        /deep/ .el-form-item__content {
          text-align: left;
        }

        /deep/ .el-icon-date {
          display: none;
        }

        /deep/ .el-range-input {
          width: 75%;
        }
      }

      .secondLine {
        padding: 10px 0;

        span + span {
          margin-left: 1px;
        }
      }

      .readCard {
        /*margin-top: 12px;*/
        /*margin: auto;*/
        display: block;
        cursor: pointer;
        line-height: 36px;
        text-align: center;
        width: 82px;
        height: 36px;
        background: $l-color-fontcolor-1;
        border-radius: 2px;
        font-size: 14px;
        font-weight: 500;
        color: $l-color-white;
      }

      .callBtn {
        /*margin: 20px 0;*/
        font-size: 30px;
        color: $l-color-fontcolor-3;
        cursor: pointer;
        display: inline-block;
        /*padding: 8px;*/
        width: 50px;
        height: 36px;
        background: $l-color-white;
        border-radius: 2px;
        border: 1px solid $l-color-bgcolor-11;

        .callBtnIcon {
          vertical-align: -0.15em;
          fill: currentColor;
          overflow: hidden;
          display: inline-block;
          width: 1.2em;
          height: 1.1em;
          font-size: 23px;
          color: #f09e23;
        }

        .callBtnText {
          display: block;
          font-size: 16px;
          margin-top: 10px;
        }
      }
    }

    /deep/ .el-card__body {
      padding: 0;
    }

    /deep/ .el-tabs__nav-wrap.is-scrollable {
      padding: 0;
    }

    /deep/ .el-tabs__nav-prev {
      display: none;
    }

    /deep/ .el-tabs__nav-next {
      display: none;
    }

    /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: none;
    }

    /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
      border: none;
    }

    /deep/ .el-tabs__header {
      margin: 0;
    }

    /deep/ .el-tabs__item {
      margin: 0 20px;
      padding: 0;
      font-size: 16px;
      font-weight: 400;
      color: $l-color-fontcolor-4;
    }

    /deep/ #tab-second {
      padding-left: 0 !important;
    }

    /deep/ #tab-third {
      padding-right: 0 !important;
    }

    /deep/ .el-tabs__item.is-active {
      font-size: 16px;
      font-weight: bold;
      color: $l-color-primary1;
      border-bottom: 2px solid $l-color-primary1 !important;
    }

    /deep/ .el-table thead {
      background: $l-color-bgcolor-18;
      font-size: 14px;
      font-weight: 400;
      color: $l-color-fontcolor-3;
    }

    /deep/ .el-table--medium th,
    .el-table--medium td {
      font-size: 14px;
      font-weight: 400;
      color: $l-color-fontcolor-3;
    }
  }
}

.center-card-wrapper {
  padding: 10px 0;
  height: 40%;

  .center-card {
    width: 287px;
    background: $l-color-white;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;

    /deep/ .el-collapse-item__arrow {
      display: none;
    }

    /deep/ .el-card__body {
      overflow-y: auto;
    }

    .iconArrow,
    .header-title {
      font-size: 16px;
      font-weight: bold;
      color: $l-color-fontcolor-3;
      line-height: 24px;
    }

    .iconArrow {
      margin-left: 12px;
    }

    .header-title {
      margin-left: 2px;
    }

    .header-icon {
      width: 18px;
      height: 18px;
      background: $l-color-primary1;
      border-radius: 10px;
      display: table;
      margin: 0 8px 0 auto;

      > span {
        width: 7px;
        height: 12px;
        font-size: 12px;
        font-weight: bold;
        color: $l-color-white;
        line-height: 18px;
        display: table-cell;
        text-align: center;
      }
    }

    .crisisValue {
      display: table;
      width: 100%;
      padding: 0 30px;

      > p {
        display: table-row;
        text-align: left;
        font-size: 14px;
        font-weight: 400;
        color: $l-color-fontcolor-3;
        line-height: 44px;

        > .icon {
          color: $l-color-bgcolor-15;
        }

        > .dateTime {
          margin-top: 4px;
          float: right;
        }
      }
    }
  }
}

.bottom-card-wrapper {
  padding: 10px 0 0 0;
  height: 20%;

  .bottom-card {
    width: 100%;

    /deep/ .el-form {
      padding: 0 20px 20px;
    }

    /deep/ .el-form-item--mini.el-form-item {
      margin-bottom: 10px;
    }

    /deep/ .el-card__body {
      overflow-y: auto;
    }

    /deep/ .l-input-wrap {
      height: 38px;
    }
  }
}

.card-header {
  position: relative;
  text-align: left;

  .titleBefore {
    vertical-align: top;
    margin-right: 5px;
    height: 20px;
    background: $l-color-primary1;
    display: inline-block;
    width: 4px;
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    color: $l-color-fontcolor-3;
    vertical-align: -2px;
  }
}

//弹窗样式
.receivePatients {
  .dialog-div {
    .el-message {
      position: relative !important;
      top: 0;
      left: 0;
      transform: translateX(0%) !important;
    }

    .demo-form-inline {
      margin: 20px auto 0;
      width: 220px;
    }
  }
}

/deep/ .el-collapse-item__content {
  padding: 0 0 2px 0;
}

//折叠面板
/deep/ .el-collapse-item__header {
  height: 44px;
  background: $l-color-bgcolor-18;
}

/deep/ .el-collapse-item__wrap {
  border: 0;
}

/deep/ .el-card__header {
  border: 0;
}

/deep/ .el-card__body {
  padding: 0px;
  height: calc(100% - 56px);
  /*overflow-y: auto;*/
}

// 改版样式
.table_tabs_wrapper {
  .table_tabs {
    /deep/.el-tabs__content {
      height: calc(100% - 45px);
    }
  }
}
</style>
