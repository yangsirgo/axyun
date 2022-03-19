<template>
  <div class="height100">
    <div style="height: calc(100% - 40px)">
      <el-table
        v-loading="loading"
        element-loading-text="加载中..."
        header-cell-class-name="headerCls"
        :row-class-name="rowStyleCls"
        height="100%"
        highlight-current-row
        @row-click="recPatientHandler"
        :data="showData.all"
        style="width: 100%;">
        <el-table-column
          prop="ouptDeptId"
          label="科室"
          align="center"
          show-overflow-tooltip
          header-align="center"
          width="90"
          :fixed="true"
        >
          <template slot-scope="scope">
             <span tableName="sys_org"
                   :conditionMap="{org_type: '_DEPT_',id: scope.row['ouptDeptId']}"
                   columns="org_nm"
                   v-tableTransform
             ></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="doctorName"
          width="80"
          show-overflow-tooltip
          align="center"
          header-align="center"
          :fixed="true"
          label="医生">
        </el-table-column>
        <el-table-column
          prop="type"
          width="100"
          show-overflow-tooltip
          align="center"
          header-align="center"
          label="诊疗类型">
          <template slot-scope="scope">
            <span :val="scope.row.diagTreatType" code="DIAG_TREAT_TYPE" v-codeTransform></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="attendTime"
          width="180"
          show-overflow-tooltip
          align="center"
          header-align="center"
          label="就诊时间">
        </el-table-column>
      </el-table>
    </div>
    <div class="pricedCheckbox">
      <el-checkbox v-model="pricedChecked"> 无就诊记录手工划价</el-checkbox>
    </div>
  </div>
</template>

<script>
  import {saveSign, updateSign, findByPatientId} from "@/api/cis/order/order";
  import {getIMUserID} from "@/api/admin/synUser";
  import {getPatients, receive, findAllergy, selectPatientBySth} from "@/api/cis/visit/visit";
  import {mapActions, mapGetters} from 'vuex'

  export default {
    props: ['params', 'executionType'],
    name: "patientInf",
    data() {
      return {
        pricedChecked: false,
        dialogVisible: false,
        rpForm: {
          type: "0"
        },
        loading: false,
        ruleForm: {
          state: '',
          date1: []
        },
        //危急值
        critical: {
          criticalList: [{
            checkRes: '白细胞',//检查结果
            checkPro: '血常规',//检查类型
            dateTime: '05-10 09:03'//检查时间
          }],
          criticalNumber: 2
        },
        //体征异常
        physicalSign: {
          physicalSignList: [{
            checkRes: '39.8℃',//检查结果
            checkPro: '体温',//检查类型
            dateTime: '05-10 09:03'//时间
          }],
          physicalSignNo: 2
        },
        stateOptions: [
          {
            label: '全部',
            value: 'third'
          }, {
            label: '诊中',
            value: 'second'
          }, {
            label: '未诊',
            value: 'first'
          }
        ],
        rules: {
          // state: [
          //   { message: '请选择就诊状态', trigger: 'change' }
          // ],
          date1: [
            {type: 'date', message: '请选择日期', trigger: 'change'}
          ]
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
        searchValue: '',
        searchReasult: '',
        labelPosition: 'right',
        formLabelAlign: {
          height: "",
          weight: "",
          temperature: "",
          bloodPressureHeight: "",
          bloodPressureLow: "",
          regId: "",
          patientId: "",
          readOnly: true,
          visitCode: '',
          visitId: ''
        },
        activeName: 'first',
        showData: {
          all: [],
          wait: [],
          received: []
        }
      }
    },
    components: {},
    methods: {
      ...mapActions({
        changeRecPatientData: 'base/changeRecPatientData',
        setReloadKey: 'base/changeSearchAgainKey',
        setActiveTabName: 'cis/setActiveTabName'
      }),
      rowStyleCls({row, rowIndex}) {
        let text = 'rowStyleCls';
        if (row.recordStatus === '5') {
          text = 'rowStyleCls disabledRowStyleCls'
        }
        return text;
      },
      handleClose(done) {

      },
      submitForm(formName) {
        this.activeName = this.ruleForm.region;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {};
            // alert("this.searchValue："+this.searchValue);
            if (this.ruleForm.date1 == null) {
              this.ruleForm.date1 = [];
              let date1 = new Date();
              let newDay = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
              let start = this.fun_date4Start(new Date(newDay.replace(/-/, "/")));
              let end = this.fun_date4End(new Date(newDay.replace(/-/, "/")));
              this.ruleForm.date1.push(start);
              this.ruleForm.date1.push(end);
            }
            if (this.searchValue != null && this.searchValue != '') {
              data = {
                searchValue: this.searchValue
              }
              selectPatientBySth(data).then(res => {
                this.searchReasult = '';
                for (let i = 0; i < res.data.length; i++) {
                  this.searchReasult += res.data[i] + ","
                }
                this.loadData();
              })
            } else {
              this.searchReasult = [];
              this.loadData();
            }


          } else {
            console.log('error submit!!');
            return false;
          }
          this.showFilter = false;
        });
      },
      //患者列表patient 的高度计算
      setHeightCalc() {
        let topCard = this.$refs['top-card'].$el;
        let filter = this.$refs['filter'];
        // margin-top 20 和 tabs 高 40
        this.heightCalc = topCard.clientHeight - filter.clientHeight - 60;
      },
      handleChange(value) {
        //第一块面板控制
        if (value.indexOf('1') > -1) {
          this.collapseArrowCls = 'el-icon-caret-bottom';
        } else {
          this.collapseArrowCls = 'el-icon-caret-right';
        }

        //第二块面板控制
        if (value.indexOf('2') > -1) {
          this.collapseArrowCls2 = 'el-icon-caret-bottom';

        } else {
          this.collapseArrowCls2 = 'el-icon-caret-right';

        }
      },
      changeStartValue(n) {
        this.formLabelAlign.bloodPressureHeight = n;
      },
      changeEndValue(n) {
        this.formLabelAlign.bloodPressureLow = n;
      },
      recPatientHandler(row) {
        console.info("======res", row)
        if (row.recordStatus == 6) {
          receive(row).then(res => {
            // console.info("======res", res)
            if (res.code === 1) {
              let data = res.data;
              this.changeRecPatientData(res.data).then(() => {
                // console.log(this.$store.state.cis.receivePatientData);
                this.loadData(true);
                this.getIMUserID(data);
                // this.loadSign();
              });
            } else {
              this.$message.error('接诊失败，请联系管理员');
            }
          });
        } else if (row.optStr == '编辑' || row.optStr == '回诊') {
          this.changeRecPatientData(row)
          this.getIMUserID(row);
        } else if (row.optStr == '查看') {
          this.changeRecPatientData(row)
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
                title: '成功',
                message: '保存体征信息成功',
                type: 'success'
              });
              this.formLabelAlign.readOnly = true;
            }
          })
        } else {
          updateSign(this.formLabelAlign).then(res => {
            if (res.data == 1) {
              this.$notify({
                title: '成功',
                message: '更新体征信息成功',
                type: 'success'
              });
            }
          })
        }
      },
      validateForSaveSign() {
        let re = /^[0-9]+.?[0-9]*/;
        //可编辑状态下才可提交保存
        if (!this.formLabelAlign.readOnly) {
          if (this.formLabelAlign.height == '') {
            this.$notify.error({
              title: '错误',
              message: '身高不能为空'
            });
            return false;
          }
          if (this.formLabelAlign.height.length > 5) {
            this.$notify.error({
              title: '错误',
              message: '身高不能超过5字符'
            });
            return false;
          }
          if (!re.test(this.formLabelAlign.height)) {
            this.$notify.error({
              title: '错误',
              message: '身高必须为数字'
            });
            return false;
          }

          if (this.formLabelAlign.weight == '') {
            this.$notify.error({
              title: '错误',
              message: '体重不能为空'
            });
            return false;
          }
          if (this.formLabelAlign.weight.length > 5) {
            this.$notify.error({
              title: '错误',
              message: '体重不能超过5字符'
            });
            return false;
          }
          if (!re.test(this.formLabelAlign.weight)) {
            this.$notify.error({
              title: '错误',
              message: '体重必须为数字'
            });
            return false;
          }

          if (this.formLabelAlign.temperature == '') {
            this.$notify.error({
              title: '错误',
              message: '体温不能为空'
            });
            return false;
          }
          if (this.formLabelAlign.temperature.length > 5) {
            this.$notify.error({
              title: '错误',
              message: '体温不能超过5字符'
            });
            return false;
          }
          if (!re.test(this.formLabelAlign.temperature)) {
            this.$notify.error({
              title: '错误',
              message: '体温必须为数字'
            });
            return false;
          }

          if (this.formLabelAlign.bloodPressureHeight == '') {
            this.$notify.error({
              title: '错误',
              message: '高压不能为空'
            });
            return false;
          }
          if (this.formLabelAlign.bloodPressureHeight.length > 5) {
            this.$notify.error({
              title: '错误',
              message: '高压不能超过5字符'
            });
            return false;
          }
          if (!re.test(this.formLabelAlign.bloodPressureHeight)) {
            this.$notify.error({
              title: '错误',
              message: '高压必须为数字'
            });
            return false;
          }

          if (this.formLabelAlign.bloodPressureLow == '') {
            this.$notify.error({
              title: '错误',
              message: '低压不能为空'
            });
            return false;
          }
          if (this.formLabelAlign.bloodPressureLow.length > 5) {
            this.$notify.error({
              title: '错误',
              message: '低压不能超过5字符'
            });
            return false;
          }
          if (!re.test(this.formLabelAlign.bloodPressureLow)) {
            this.$notify.error({
              title: '错误',
              message: '低压必须为数字'
            });
            return false;
          }

        }
        return true;
      },
      // loadData() {
      //   this.loading = true;
      //   this.showData = {
      //     wait: [],
      //     received: [],
      //     bakList: []
      //   }
      //   this.data = {
      //     wait: [],
      //     received: [],
      //     bakList: []
      //   }
      //
      //   let data = {
      //     startDate: this.ruleForm.date1[0],
      //     stopDate: this.ruleForm.date1[1],
      //     patientIds: this.searchReasult != '' ? this.searchReasult.substring(0, this.searchReasult.length - 1) : ''
      //   }
      //   try {
      //     // alert(this.activeName);
      //     if (this.activeName == 'first') {
      //       let date1 = new Date();
      //       let newDay = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
      //       data.startDate = this.fun_date4TodayStart(new Date(newDay.replace(/-/, "/")));
      //       data.stopDate = this.fun_date4End(new Date(newDay.replace(/-/, "/")))
      //     }
      //     // alert(JSON.stringify(data));
      //     let patientIds = '';
      //     getPatients(data, false).then(res => {
      //       this.data.bakList = res.data;
      //       for (let i = 0; i < this.data.bakList.length; i++) {
      //         if (this.data.bakList[i].recordStatus == 6) {
      //           this.data.bakList[i].optStr = '接诊';
      //           this.data.wait.push(this.data.bakList[i]);
      //         } else {
      //           if (this.data.bakList[i].recordStatus == 99) {
      //             //有检查检验报告，回诊
      //
      //           } else {
      //             //没有检查检验报告
      //             if (this.isToday(this.data.bakList[i].attendTime)) {
      //               //今天，编辑
      //               this.data.bakList[i].optStr = '编辑';
      //             } else {
      //               this.data.bakList[i].optStr = '查看';
      //             }
      //           }
      //
      //           // //查看、编辑、回诊
      //           // if (this.isToday(this.data.bakList[i].attendTime)) {
      //           //   //今天，编辑
      //           //   this.data.bakList[i].optStr = '编辑';
      //           // }else{
      //           //   if(this.data.bakList[i].recordStatus == 99){
      //           //     //查看
      //           //     this.data.bakList[i].optStr = '查看';
      //           //     alert(JSON.stringify(this.data.bakList[i].optStr));
      //           //   }else if(this.data.bakList[i].recordStatus == 66){
      //           //     //回诊
      //           //
      //           //   }
      //           // }
      //           this.data.received.push(this.data.bakList[i]);
      //         }
      //         //生日转年龄
      //         this.data.bakList[i].age = this.data.bakList[i].hasOwnProperty('birthDate') && this.data.bakList[i].birthDate != '' && this.data.bakList[i].birthDate != null ? this.jsGetAge(this.data.bakList[i].birthDate.substring(0, 10)) : '';
      //         patientIds += res.data[i].patientId + ",";
      //       }
      //       // if (this.data.bakList.length > 0) {
      //       //   this.loadAllergic(patientNums);
      //       // }
      //       this.showData = this.data;
      //       console.info("00000000:" + JSON.stringify(this.showData))
      //       this.loading = false;
      //     });
      //   } catch (e) {
      //     this.loading = false;
      //   }
      // },
      loadData(noLoading) {

        if (!noLoading) {//控制loading显示 与 不显示
          this.loading = true;
        } else {
          this.loading = false;
        }
        this.showData = {
          wait: [],
          received: [],
          all: []
        }
        // if(this.params.searchValue != '' && this.params.searchReasult == ''){
        //   this.loading = false;
        //   return;
        // }
        let params = {
          patientIds: this.params && this.params.hasOwnProperty('searchReasult') ? this.params.searchReasult : '',
          startDate: this.params && this.params.hasOwnProperty('startDate') ? this.params.startDate : '',
          stopDate: this.params && this.params.hasOwnProperty('stopDate') ? this.params.stopDate : '',
          type: this.activeName,
          technicalOffices: this.params && this.params.hasOwnProperty('technicalOffices') ? this.params.technicalOffices : '',
          visitCode: this.params && this.params.hasOwnProperty('searchValue') ? this.params.searchValue : '',
          areaId: this.params && this.params.areaId,
          roomId: this.params && this.params.roomId,
          appointmentMode: this.params && this.params.appointmentMode,
          pricedChecked: this.pricedChecked
        };


        console.log(params.testType);

        try {
          getPatients(params, false).then(res => {
            //todo 目前全部tab显示不正确，是因为历史数据没有经过定时任务转换为结束就诊，此处无须改动，定时任务加好后即OK
            this.showData.all = res.data;
            if (res.data.length === 0) {
              this.pricedChecked = true;
            }
            for (let i = 0; i < this.showData.all.length; i++) {
              // if (this.showData.all[i].recordStatus == 6) {
              if (this.showData.all[i].recordStatus == 6) {
                this.showData.all[i].optStr = '接诊';
                this.showData.wait.push(this.showData.all[i]);
              } else if (this.showData.all[i].recordStatus == 4) {
                //今天，编辑
                if (this.showData.all[i].hasOwnProperty('rediagStatus') && this.showData.all[i].rediagStatus == 1) {
                  this.showData.all[i].optStr = '回诊';
                  this.showData.received.push(this.showData.all[i]);
                } else {
                  this.showData.all[i].optStr = '编辑';
                  this.showData.received.push(this.showData.all[i]);
                }
                //新需求，查看不放到诊中列表，诊中列表只显示当天的，分为编辑和回诊
                // else if(this.showData.all[i].recordStatus == 5){
                //   this.showData.all[i].optStr = '查看';
                // }
                // else {
                //   this.showData.all[i].optStr = '查看';
                // }
              } else if (this.showData.all[i].recordStatus == 5) {
                this.showData.all[i].optStr = '查看';
              }
              //生日转年龄
              this.showData.all[i].age = this.showData.all[i].hasOwnProperty('birthDate') && this.showData.all[i].birthDate != '' && this.showData.all[i].birthDate != null ? this.jsGetAge(this.showData.all[i].birthDate.substring(0, 10)) : '';
            }
            this.loading = false;

            // 判断是否清空 vuex 数据
            let targetRow = res.data.find(item => {
              return item.patientId === this.receivePatientData.patientId;
            });
            if (!targetRow) {// 如果没有清空 vuex 数据
              // 门急诊 病历处方下的三级模块 不需要切换患者为默认值
              if (this.$router.currentRoute.path.indexOf("/cisOne/cisThree") === -1) {
                this.changeRecPatientData({});
              }
            } else {
              this.$refs.singleTable.setCurrentRow(targetRow);
            }
          });
        } catch (e) {
          this.loading = false;
        }

      },
      //获取过敏信息
      loadAllergic(patientIds) {
        let data = {
          params: patientIds
        }
        findAllergy(data).then(res => {
          for (let i = 0; i < this.showData.bakList.length; i++) {
            for (let j = 0; j < res.data.length; j++) {
              if (this.showData.bakList[i].patientId === res.data[j].patientId) {
                this.showData.bakList[i].allergic = res.data[j].symptomDescription;
              }
            }
          }
        })
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
        }
        let patientId = this.$store.state.cis.receivePatientData.patientId;
        let data = {
          patientId: patientId
        };
        if (this.$store.state.cis.receivePatientData.hasOwnProperty('patientId')) {
          findByPatientId(data).then(res => {
            if (res.hasOwnProperty('data')) {
              this.formLabelAlign = res.data;
              this.formLabelAlign.readOnly = true;
            }
          })
        }
      },
      fun_date4Start(date1) {
        let date2 = new Date(date1);
        date2.setDate(date1.getDate() - 2);
        let time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
        return new Date(time2.replace(/-/, "/"));
      },
      fun_date4TodayStart(date1) {
        let date2 = new Date(date1);
        date2.setDate(date1.getDate());
        let time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
        return new Date(time2.replace(/-/, "/"));
      },
      fun_date4End(date1) {
        let date2 = new Date(date1);
        date2.setDate(date1.getDate() + 1);
        let time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
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
          // console.log("当天");
          return true;
        }
        //之前
        // console.log("以前的日期");
        return false;

      },
      //获取IM账号
      getIMUserID(data) {
        // 是否为互联网医院挂号
        if (data.isOnline === "1") {
          getIMUserID(data).then(res => {
            let account = res.data;
            // account.userName = "cloudhos_y0001";
            // account.password = "Cloudhos@Y0001";
            window.open("http://127.0.0.1:8182/webdemo/im/login.html?j-account=" + account.userName + "&j-secret=" + account.atype + "&j-target=cloudhos_y0211", "_blank");
          })
        }

      },
      // selectPatientBySth() {
      //   this.showData = [];
      //   if (this.searchValue != '' && this.searchValue != null) {
      //     this.showData.bakList = [];
      //     let data = {
      //       searchValue: this.searchValue
      //     }
      //     selectPatientBySth(data).then(res => {
      //       this.searchReasult = res.data;
      //       this.submitForm('ruleForm');
      //     })
      //   } else {
      //     // alert(JSON.stringify(this.ruleForm.date1));
      //     this.submitForm('ruleForm');
      //   }
      // },
      // initSearchValue(currentType) {
      //   this.currentType = currentType;
      //   // this.searchValue = '';
      //   // this.searchReasult = [];
      //   // this.ruleForm.date1 = [];
      //   this.loadData();
      // },
      dropClosed(e) {
        let targetNode = e.target;
        let filter = this.$refs['filter-card'] && this.$refs['filter-card'].$el;
        let dropBtn = this.$refs['dropBtn'] && this.$refs['dropBtn'].$el;
        if (targetNode === undefined || dropBtn === undefined || filter === undefined) {
          return;
        } // 修复报错
        if (!filter.contains(targetNode) && !dropBtn.contains(targetNode)) {
          this.showFilter = false;
        }
      }
    },
    mounted() {
      // let date1 = new Date();
      // let newDay = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
      // let start = this.fun_date4Start(new Date(newDay.replace(/-/, "/")));
      // let end = this.fun_date4End(new Date(newDay.replace(/-/, "/")));
      // this.ruleForm.date1.push(start);
      // this.ruleForm.date1.push(end);
      this.loadData(null);
      console.log("::::::::::::::::::::", this.executionType);
      //暂时去掉体征信息功能
      // this.loadSign();
      let me = this;
      // this.$nextTick(() => {
      //   setTimeout(() => {
      //     me.setHeightCalc();
      //   }, 10);
      // })
      document.addEventListener('click', this.dropClosed);

      // alert(JSON.stringify("刷新"+JSON.stringify(this.$store.state.cis.receivePatientData)))
    },
    destroyed() {
      this.dropClosed = null;
    },
    created() {
      this.chatTimer = setInterval(() => {
        console.log(this.chatTimer);
        this.changeDay && this.changeDay(false);
      }, 1000 * 60 * 10);

      this.activeName = this.activeTabName;
    },
    beforeDestroy: function () {
      //实例销毁前调用
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    computed: {
      ...mapGetters("base", ["receivePatientData"]),
      ...mapGetters("user", ["role"]),
      ...mapGetters("cis", ["activeTabName"]),
      ...mapGetters("base", ["searchAgainKey"])
    },
    watch: {
      role: {
        handler(val) {
          let reloadKeys = +new Date + '' + "RESETFORM";
          this.setReloadKey(reloadKeys);
        },
        deep: true
      },
      // searchAgainKey() {
      //   // alert("刷新");
      // },
      // activeTabName (){
      //   this.loadData(null);
      // }
    }
  }

</script>

<style scoped lang="scss">
  /deep/ .headerCls {
    height: 30px;
    background: rgba(246, 246, 246, 1);
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(46, 50, 58, 1);
    padding: 0;
  }

  /deep/ .rowStyleCls {
    height: 40px;
    font-size: 14px;
    
    font-weight: 400;
    color: rgba(46, 50, 58, 1);

    > td {
      padding: 0;
    }
  }

  /deep/ .disabledRowStyleCls {
    /*background-color: #1f2d3d;*/
    color: #565656;
    background-color: #F5F7FA;
  }

  .pa {
    width: 32px;
    height: 21px;
    border-radius: 2px;
    border: 1px solid rgba(228, 228, 228, 1);
    font-size: 12px;
    
    font-weight: 500;
    color: $l-color-primary;
    line-height: 17px;
  }

  .wz {
    width: 32px;
    height: 21px;
    border-radius: 2px;
    border: 1px solid rgba(228, 228, 228, 1);
    font-size: 12px;
    
    font-weight: 500;
    color: rgba(19, 71, 150, 1);
    line-height: 17px;
  }

  .other {
    width: 32px;
    height: 21px;
    border-radius: 2px;
    border: 1px solid rgba(228, 228, 228, 1);
    font-size: 12px;
    
    font-weight: 500;
    color: rgba(225, 20, 10, 1);
    line-height: 15px;
  }

  .pricedCheckbox {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
</style>
