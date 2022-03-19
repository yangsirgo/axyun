<template>
  <div class="height100 table_tabs_wrapper">
    <el-tabs class="height100 table_tabs" v-model="activeName" @tab-click="loadData()" v-loading="loading">
      <el-tab-pane name="first">
        <span slot="label"> 待诊
          <!--<i class="el-icon-refresh-right"></i>-->
        </span>
        <!--<l-tables-->
          <!--:total="pagination.total"-->
          <!--:pageSize.sync="pagination.pageSize"-->
          <!--:page.sync="pagination.currentPage"-->
          <!--:layout="layout"-->
          <!--:pagerCount="5"-->
          <!--paginationAlign="center"-->
          <!--:singlePageShow="true"-->
          <!--@changeSize="changeSize"-->
        <!--&gt;-->
          <!--<template slot="table-body">-->
            <el-table
              element-loading-text="加载中..."
              header-cell-class-name="headerCls"
              :row-class-name="rowStyleCls"
              height="100%"
              highlight-current-row
              @row-click="recPatientHandler"
              :data="showData.wait"
              style="width: 100%;">
              <el-table-column
                prop="appointmentCode"
                label="排队"
                align="center"
                show-overflow-tooltip
                header-align="center"
                width="80"
              >
              </el-table-column>
              <el-table-column
                prop="patientName"
                width="70"
                show-overflow-tooltip
                align="center"
                header-align="center"
                label="姓名">
              </el-table-column>
              <!-- <el-table-column
                prop="visitCode"
                label="门诊号"
                show-overflow-tooltip
                align="center"
                header-align="center"
                width="135"
              >
              </el-table-column> -->
              
              <el-table-column
                prop="patientCode"
                label="病人编号"
                align="center"
                header-align="center"
                show-overflow-tooltip
                width="135"
              >
              </el-table-column>
              <!-- <el-table-column
                prop="recordStatus"
                width="90"
                show-overflow-tooltip
                align="center"
                header-align="center"
                label="渠道">
                <template slot-scope="scope">
                  <span class="pa" v-if="scope.row.appointmentMode === 1">平安</span>
                  <span class="wz" v-if="scope.row.appointmentMode === 2">微诊</span>
                  <span class="other" v-if="scope.row.appointmentMode === 3">114</span>
                </template>
              </el-table-column> -->
              <el-table-column
                prop="appointmentTime"
                label="预约时间"
                align="center"
                header-align="center"
                show-overflow-tooltip
                width="160"
              >
              </el-table-column>
              <!--<el-table-column-->
              <!--prop="operate"-->
              <!--align="center"-->
              <!--header-align="center"-->
              <!--fixed="right"-->
              <!--show-overflow-tooltip-->
              <!--width="80"-->
              <!--label="操作">-->
              <!--<template slot-scope="scope">-->
              <!--<el-button-->
              <!--type="text"-->
              <!--size="mini"-->
              <!--style="width: 100%"-->
              <!--@click="recPatientHandler(scope.row)">{{scope.row.optStr}}-->
              <!--</el-button>-->
              <!--</template>-->
              <!--</el-table-column>-->
            </el-table>
          <!--</template>-->
        <!--</l-tables>-->
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label">诊中
          <!--<i class="el-icon-refresh-right"></i>-->
        </span>
        <!--<l-tables-->
          <!--:total="pagination.total"-->
          <!--:pageSize.sync="pagination.pageSize"-->
          <!--:page.sync="pagination.currentPage"-->
          <!--:layout="layout"-->
          <!--:pagerCount="5"-->
          <!--paginationAlign="center"-->
          <!--:singlePageShow="true"-->
          <!--@changeSize="changeSize"-->
        <!--&gt;-->
          <!--<template slot="table-body">-->
            <el-table
              v-if="activeName === 'second'"
              element-loading-text="加载中..."
              header-cell-class-name="headerCls"
              :row-class-name="rowStyleCls"
              height="100%"
              highlight-current-row
              @row-click="recPatientHandler"
              :data="showData.received"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                align="center"
                header-align="center"
                width="80"
              >
              </el-table-column>
              <el-table-column
                prop="patientName"
                width="70"
                align="center"
                header-align="center"
                show-overflow-tooltip
                label="姓名">
              </el-table-column>
              <!-- <el-table-column
                prop="visitCode"
                show-overflow-tooltip
                label="门诊号"
                align="center"
                header-align="center"
                width="135"
              >
              </el-table-column> -->
              <el-table-column
                prop="patientCode"
                label="病人编号"
                align="center"
                header-align="center"
                show-overflow-tooltip
                width="135"
              >
              </el-table-column>
              <!--<el-table-column-->
              <!--prop="recordStatus"-->
              <!--width="18%"-->
              <!--header-align="center"-->
              <!--align="center"-->
              <!--label="状态">-->
              <!--</el-table-column>-->
              <!-- <el-table-column
                prop="recordStatus"
                width="90"
                show-overflow-tooltip
                align="center"
                header-align="center"
                label="渠道">
                <template slot-scope="scope">
                  <span class="pa" v-if="scope.row.appointmentMode === 1">平安</span>
                  <span class="wz" v-if="scope.row.appointmentMode === 2">微诊</span>
                  <span class="other" v-if="scope.row.appointmentMode === 3">114</span>
                </template>
              </el-table-column> -->
              <el-table-column
                prop="appointmentTime"
                label="预约时间"
                align="center"
                header-align="center"
                show-overflow-tooltip
                width="160"
              >
              </el-table-column>
              <!--<el-table-column-->
              <!--prop="operate"-->
              <!--align="center"-->
              <!--header-align="center"-->
              <!--width="80"-->
              <!--fixed="right"-->
              <!--label="操作">-->
              <!--<template slot-scope="scope">-->
              <!--<el-button-->
              <!--type="text"-->
              <!--style="width: 100%"-->
              <!--size="mini"-->
              <!--@click="recPatientHandler(scope.row)">{{scope.row.optStr}}-->
              <!--</el-button>-->
              <!--</template>-->
              <!--</el-table-column>-->
            </el-table>
          <!--</template>-->
        <!--</l-tables>-->
      </el-tab-pane>
      <el-tab-pane name="third">
        <span slot="label">全部
          <!--<i class="el-icon-refresh-right"></i> -->
        </span>
        <!--<l-tables-->
          <!--:total="pagination.total"-->
          <!--:pageSize.sync="pagination.pageSize"-->
          <!--:page.sync="pagination.currentPage"-->
          <!--:layout="layout"-->
          <!--:pagerCount="5"-->
          <!--paginationAlign="center"-->
          <!--:singlePageShow="true"-->
          <!--@changeSize="changeSize"-->
        <!--&gt;-->
          <!--<template slot="table-body">-->
            <el-table
              ref="singleTable"
              v-if="activeName === 'third'"
              element-loading-text="加载中..."
              height="100%"
              border
              highlight-current-row
              @row-click="recPatientHandler"
              header-cell-class-name="headerCls"
              :row-class-name="rowStyleCls"
              :data="showData.all"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                align="center"
                header-align="center"
                width="80"
              >
              </el-table-column>
              <el-table-column
                prop="patientName"
                width="70"
                header-align="center"
                align="center"
                show-overflow-tooltip
                label="姓名">
              </el-table-column>
              <!-- <el-table-column
                prop="visitCode"
                label="门诊号"
                align="center"
                header-align="center"
                show-overflow-tooltip
                width="135"
              >
              </el-table-column> -->
              <el-table-column
                prop="patientCode"
                label="病人编号"
                align="center"
                header-align="center"
                show-overflow-tooltip
                width="135"
              >
              </el-table-column>
              <!--<el-table-column-->
              <!--prop="recordStatus"-->
              <!--width="18%"-->
              <!--align="center"-->
              <!--header-align="center"-->
              <!--label="状态">-->
              <!--</el-table-column>-->
              <!-- <el-table-column
                prop="recordStatus"
                width="90"
                show-overflow-tooltip
                align="center"
                header-align="center"
                label="渠道">
                <template slot-scope="scope">
                  <span class="pa" v-if="scope.row.appointmentMode === 1">平安</span>
                  <span class="wz" v-if="scope.row.appointmentMode === 2">微诊</span>
                  <span class="other" v-if="scope.row.appointmentMode === 3">114</span>
                </template>
              </el-table-column> -->
              <el-table-column
                prop="appointmentTime"
                label="预约时间"
                align="center"
                header-align="center"
                show-overflow-tooltip
                width="160"
              >
              </el-table-column>
              <!--<el-table-column-->
              <!--prop="operate"-->
              <!--align="center"-->
              <!--header-align="center"-->
              <!--width="80"-->
              <!--fixed="right"-->
              <!--label="操作">-->
              <!--<template slot-scope="scope">-->
              <!--<el-button-->
              <!--type="text"-->
              <!--size="mini"-->
              <!--style="width: 100%"-->
              <!--@click="recPatientHandler(scope.row)">-->
              <!--{{scope.row.optStr}}-->
              <!--</el-button>-->
              <!--</template>-->
              <!--</el-table-column>-->
            </el-table>
          <!--</template>-->
        <!--</l-tables>-->
      </el-tab-pane>
    </el-tabs>
    <!-- 接诊弹窗 -->
    <el-dialog
      class="receivePatients"
      title="接诊"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <div class="dialog-div">
        <div role="alert" ref="alertBody" class="el-message el-message--warning is-closable">
          <i class="el-message__icon el-icon-warning"></i>
          <p class="el-message__content">请先选择患者的就诊类型后在进行就诊</p>
          <i class="el-message__closeBtn el-icon-close" @click="$refs.alertBody.style.display = 'none'"></i>
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
  import {saveSign, updateSign, findByPatientId} from "@/api/cis/order/order";
  import {getIMUserID} from "@/api/admin/synUser";
  import {getPatients, receive, findAllergy, selectPatientBySth} from "@/api/cis/visit/visit";
  import {mapActions, mapGetters} from 'vuex'

  export default {
    props: ['params'],
    name: "patientInf",
    data() {
      return {
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 1
        },
        layout: "pager",
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
      changeSize(val) {
        this.pagination.currentPage = val.page;
        this.pagination.pageSize = val.pageSize;
        this.loadData(null);
      },
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
        if (row.recordStatus == 6 || row.recordStatus == 2 || row.recordStatus == 3) {
        // 1、单击一下患者即变为“诊中”了，建议以下诊断为标志事件，改变病人状态
        //   receive(row).then(res => {
        //     // console.info("======res", res)
        //     if (res.code === 1) {
        //       let data = res.data;
        //       this.changeRecPatientData(res.data).then(() => {
        //         this.loadData(true);
        //         this.getIMUserID(data);
        //       });
        //     } else {
        //       this.$message.error('接诊失败，请联系管理员');
        //     }
        //   });
          this.changeRecPatientData(row).then(() => {
            // this.loadData(true);
            this.getIMUserID(row);
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
          patientIds: this.params.hasOwnProperty('searchReasult') ? this.params.searchReasult : '',
          startDate: this.params.hasOwnProperty('startDate') ? this.params.startDate : '',
          stopDate: this.params.hasOwnProperty('stopDate') ? this.params.stopDate : '',
          type: this.activeName,
          technicalOffices: this.params.hasOwnProperty('technicalOffices') ? this.params.technicalOffices : '',
          visitCode: this.params.hasOwnProperty('searchValue') ? this.params.searchValue : '',
          areaId: this.params.areaId,
          roomId: this.params.roomId,
          appointmentMode: this.params.appointmentMode
        }
        try {
          getPatients(params, false).then(res => {
            //todo 目前全部tab显示不正确，是因为历史数据没有经过定时任务转换为结束就诊，此处无须改动，定时任务加好后即OK
            this.showData.all = res.data;
            for (let i = 0; i < this.showData.all.length; i++) {
              // if (this.showData.all[i].recordStatus == 6) {
              if (this.showData.all[i].recordStatus == 6 || this.showData.all[i].recordStatus == 2 || this.showData.all[i].recordStatus == 3) {
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

            //debugger

            // 判断是否清空 vuex 数据
            let targetRow = res.data.find(item => {
              return item.patientId === this.receivePatientData.patientId;
            });

            console.log('+++++++++++++++++++++++++++++????', this.receivePatientData)
            if (!targetRow) {// 如果没有清空 vuex 数据
              // 门急诊 病历处方下的三级模块 不需要切换患者为默认值
              if (this.$router.currentRoute.path.indexOf("/cisOne/cisThree") === -1) {
                // 20200529 ywl bug30047 要求改为 未在病人列表匹配到该病人，仍然要显示该患者信息，不能清除
                // this.changeRecPatientData({});
              }
            } else {
              this.$refs.singleTable.setCurrentRow(targetRow);
              // this.changeRecPatientData(targetRow)
              this.recPatientHandler(targetRow)
            }
          });
        } catch (e) {
          this.loading = false;
        }

        this.setActiveTabName(this.activeName);
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
      ...mapGetters("cis", ["activeTabName"])
    },
    watch: {
      role: {
        handler(val) {
          let reloadKeys = +new Date + '' + "RESETFORM";
          this.setReloadKey(reloadKeys);
        },
        deep: true
      }
    }
  }

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
        background-color: #1f2d3d;
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
          // background: #057af2;
          // color: #fff;
          line-height: 36px;
          text-align: center;
          width: 82px;
          height: 36px;
          background: rgba(19, 71, 150, 1);
          border-radius: 2px;
          font-size: 14px;
          
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }

        .callBtn {
          /*margin: 20px 0;*/
          font-size: 30px;
          color: #24292e;
          cursor: pointer;
          display: inline-block;
          /*padding: 8px;*/
          width: 50px;
          height: 36px;
          background: rgba(255, 255, 255, 1);
          border-radius: 2px;
          border: 1px solid rgba(228, 228, 228, 1);

          .callBtnIcon {
            vertical-align: -.15em;
            fill: currentColor;
            overflow: hidden;
            display: inline-block;
            width: 1.2em;
            height: 1.1em;
            font-size: 23px;
            color: rgba(240, 158, 35, 1);
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
        padding: 0
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
        color: rgba(148, 157, 163, 1);
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
        color: $l-color-primary;
        border-bottom: 2px solid $l-color-primary !important;
      }

      /deep/ .el-table thead {
        background: rgba(246, 246, 246, 1);
        font-size: 14px;
        
        font-weight: 400;
        color: rgba(46, 50, 58, 1);
      }

      /deep/ .el-table--medium th, .el-table--medium td {
        font-size: 14px;
        
        font-weight: 400;
        color: rgba(46, 50, 58, 1);
      }
    }
  }

  .center-card-wrapper {
    padding: 10px 0;
    height: 40%;

    .center-card {
      width: 287px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;

      /deep/ .el-collapse-item__arrow {
        display: none;
      }

      /deep/ .el-card__body {
        overflow-y: auto;
      }

      .iconArrow, .header-title {
        font-size: 16px;
        
        font-weight: bold;
        color: rgba(46, 50, 58, 1);
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
        background: $l-color-primary;
        border-radius: 10px;
        display: table;
        margin: 0 8px 0 auto;

        > span {
          width: 7px;
          height: 12px;
          font-size: 12px;
          
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
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
          color: rgba(46, 50, 58, 1);
          line-height: 44px;

          > .icon {
            color: #E1140A;
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
      background: $l-color-primary;
      display: inline-block;
      width: 4px;
    }

    .title {
      font-size: 16px;
      
      font-weight: 500;
      color: rgba(46, 50, 58, 1);
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
    background: rgba(246, 246, 246, 1);
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
      /deep/ .el-tabs__content {
        height: calc(100% - 37px);
        margin-top: 10px;
      }

      /deep/ .el-tabs__item {
        /*height: 32px;*/
        /*line-height: 32px;*/
        line-height: inherit !important;
        height: auto !important;
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
        /*> td {*/
        color: #565656;
        background-color: #F5F7FA;
        /*}*/
      }
    }
  }


  //单个 tabs 样式 需要做成card title 的样式
  .table_tabs_wrapper {
    /deep/ .el-tabs__header {
      margin-top: 8px !important;
      > .el-tabs__nav-wrap {
        > .el-tabs__nav-scroll {
          > .el-tabs__nav {
            &::before {
              content: "";
              float: left;
              width: 4px;
              height: 20px;
              //background: $l-color-primary;
              background: transparent;
              //margin-right: 10px;
              margin-right: 15px;
              margin-top: 0px;
            }
            > .el-tabs__active-bar {
              display: none;
            }
            > .el-tabs__item.is-active {
              color: #2e323a !important;
              line-height: inherit !important;
              height: auto !important;
              cursor: default !important;
            }
          }
        }
      }
    }
  }
</style>
