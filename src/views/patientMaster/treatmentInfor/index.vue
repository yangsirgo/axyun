<template>
  <div class="width100 height100 treat-con">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      @message="messageHandler"
    >
      <template #list>
        <leftTabs
          @tabs-change="handleClick"
          @read-card="readCard"
          @query="search"
          v-model="leftTabsValue"
          :tabs-name="tabsName"
          :form-list="formParams"
          mode='patientMaster'>
          <template #first>
            <left-list :param="param" :searchType="searchType"></left-list>
          </template>
          <!--<template #second>
            <hisRecords></hisRecords>
          </template>-->
          <!--<template #third>
            第三卡片内容
          </template>-->
        </leftTabs>
      </template>
      <template #content>
        <top></top>
        <el-card class="cont-list">
          <!-- <div class="depart-select">
             <LFormtTitle label="就诊科室">
               <el-select v-model="depart"
                          placeholder="请选择科室"
                          @change="departChange">
                 <el-option
                   v-if="departList != []"
                   v-for="item in departList"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
                 </el-option>
               </el-select>
             </LFormtTitle>

           </div>-->
          <div class="card-list">
            <!--<card-msg
             v-for="(cardMsg, index) in propsCardData"
             :key="index"
             :renderData="cardMsg"
             class="card-list-item"
             @clickShowDetail="handleCardUpdate"
           ></card-msg>-->
            <card-msg
              :renderData="orderData"
              class="card-list-item"
              @updateOrderData="handleOrderData"
              @clickShowDetail="handleCardUpdate"
            ></card-msg>
            <card-msg
              :renderData="medicalInfoData"
              class="card-list-item"
            ></card-msg>
            <card-msg
              :renderData="medicalTechData"
              class="card-list-item"
            ></card-msg>
            <card-msg
              :renderData="paymentData"
              class="card-list-item"
            ></card-msg>
            <card-msg
              :renderData="dispenseData"
              class="card-list-item"
            ></card-msg>
          </div>
          <div class="line-process">
            <lineProcess></lineProcess>
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import leftTabs from "@/components/LSideTabs.vue";
  import leftList from "@/views/patientMaster/cardsRecord/components/leftList.vue";
  // import hisRecords from "@/views/patientMaster/cardsRecord/components/hisRecords.vue";
  import cardMsg from "./components/cardMsg";
  import lineProcess from "./components/lineProcess";
  import top from "../recordManage/recordShow/components/top";
  import {
    getScheduleInfo,
    getMedicalInfo,
    getMedicalTechInfo,
    getPaymentInfo,
    getRecipeInfo
  } from '@/api/treatmentInfo/treatment.js';
  import {mapActions, mapGetters} from 'vuex';
  import {transformCode, getTableData} from "@/api/directive/directiveRequest";

  export default {
    name: "",
    components: {
      leftList,
      leftTabs,
      cardMsg,
      lineProcess,
      top,
      // hisRecords
    },
    data() {
      return {
        toolBoxs: ["hisRecord", "treatmentPlan"],
        formParams: ['timeRange', 'recordStatus', 'search'],
        leftTabsValue: {},
        tabsName: [{
          label: '患者列表',
          value: 'first'
        }
          /*, {
            label: '历史就诊列表',
            value: 'second'
          }*/
        ],
        //给leftlist传输的search条件
        param: {},
        searchType: '',
        //科室选择项
        depart: '',
        departList: [],
        visitCode: '',
        visitCodeList: [],
        propsCardData: [
          {
            type: 1,
            cardTitle: "预约信息",
            buttonName: "进入预约分诊",
            router: "/orderMsg",
            detailData: [
              {
                id: 0,
                title: "上海复旦医院(2019-09-12)",
                status: "已签到",
                detail: [
                  {
                    tagsTitle: "预约日期",
                    tagsValue: "2019-09-11 8:00-9:00"
                  },
                  {
                    tagsTitle: "预约途径",
                    tagsValue: "微信公众号"
                  },
                  {
                    tagsTitle: "签到时间",
                    tagsValue: "2019-09-11 10:20:12"
                  },
                  {
                    tagsTitle: "签到途径",
                    tagsValue: "自助机"
                  },
                  {
                    tagsTitle: "预约科室",
                    tagsValue: "泌尿外科"
                  },
                  {
                    tagsTitle: "预约医生",
                    tagsValue: "王自强"
                  }
                ]
              },
              {
                id: 1,
                title: "上海复旦医院(2019-09-16)",
                status: "未签到",
                detail: [
                  {
                    tagsTitle: "预约日期",
                    tagsValue: "2019-08-30 8:00-9:00"
                  },
                  {
                    tagsTitle: "预约途径",
                    tagsValue: "微医APP"
                  },
                  {
                    tagsTitle: "签到时间",
                    tagsValue: ""
                  },
                  {
                    tagsTitle: "签到途径",
                    tagsValue: ""
                  },
                  {
                    tagsTitle: "预约科室",
                    tagsValue: "心内科(专家)"
                  },
                  {
                    tagsTitle: "预约医生",
                    tagsValue: "王自强"
                  }
                ]
              }
            ]
          },
          {
            type: 2,
            cardTitle: "就诊信息",
            buttonName: "进入病历处方",
            router: "/bingliMsg",
            detailData: [
              {
                id: 23,
                title: "心内科(专家)(2019-09-12)",
                status: "诊中",
                detail: [
                  {
                    tagsTitle: "接诊医生",
                    tagsValue: "王自强"
                  },
                  {
                    tagsTitle: "候诊序号",
                    tagsValue: "79"
                  },
                  {
                    tagsTitle: "接诊诊室",
                    tagsValue: "3诊室"
                  }
                ]
              }
            ]
          },
          {
            type: 3,
            cardTitle: "医技信息",
            buttonName: "查看医生报告",
            router: "/reportDetail",
            detailData: [
              {
                id: 2,
                title: "CT(2019-09-12)",
                status: "拍摄中",
                detail: [
                  {
                    tagsTitle: "申请时间",
                    tagsValue: "2019-09-12 9:40:12"
                  },
                  {
                    tagsTitle: "医技序号",
                    tagsValue: "38"
                  },
                  {
                    tagsTitle: "执行诊室",
                    tagsValue: "放射科(CT)"
                  },
                  {
                    tagsTitle: "执行医生",
                    tagsValue: "王中建"
                  }
                ]
              }
            ]
          },
          {
            type: 4,
            cardTitle: "缴费信息",
            buttonName: "进入门诊收费",
            router: "/menzhenCost",
            detailData: [
              {
                id: 5,
                title: "预约挂号(2019-09-12 9:40:12)",
                status: "已缴费",
                detail: [
                  {
                    tagsTitle: "操作医生",
                    tagsValue: "王丽"
                  },
                  {
                    tagsTitle: "缴费窗口",
                    tagsValue: "3号"
                  }
                ]
              },
              {
                id: 6,
                title: "门诊缴费(2019-09-12 8:15:32)",
                status: "已缴费",
                detail: [
                  {
                    tagsTitle: "操作医生",
                    tagsValue: "王丽"
                  },
                  {
                    tagsTitle: "缴费窗口",
                    tagsValue: "5号"
                  }
                ]
              }
            ]
          },
          {
            type: 5,
            cardTitle: "发药信息",
            buttonName: "进入门诊发药",
            router: "/drugMsg",
            detailData: [
              {
                id: 23,
                title: "门诊配药(2019-09-12 9:40:12)",
                status: "预配药",
                detail: [
                  {
                    tagsTitle: "配药医生",
                    tagsValue: "苏辉"
                  },
                  {
                    tagsTitle: "配药序号",
                    tagsValue: "79"
                  }
                ]
              },
              {
                id: 123,
                title: "门诊发药(2019-09-12  9:40:12)",
                status: "未发药",
                detail: [
                  {
                    tagsTitle: "发药医生",
                    tagsValue: "苏辉"
                  },
                  {
                    tagsTitle: "发药序号",
                    tagsValue: "99"
                  },
                  {
                    tagsTitle: "发药科室",
                    tagsValue: "门诊药房"
                  },
                  {
                    tagsTitle: "发药窗口",
                    tagsValue: "3号"
                  }
                ]
              }
            ]
          }
        ],
        disState: {
          "0": "未发药",
          "1": "已发药",
          "2": "已退药"
        },
        orderData: {
          type: 1,
          cardTitle: "预约信息",
          buttonName: "进入预约分诊",
          router: "/cisOne/appointTriage/apptdoctor",
          detailData: []
        },
        medicalInfoData: {
          type: 2,
          cardTitle: "就诊信息",
          buttonName: "进入病历处方",
          router: "/cisOne/cisThree/record",
          detailData: []
        },
        medicalTechData: {
          type: 3,
          cardTitle: "医技信息",
          buttonName: "查看医生报告",
          router: "/cisOne/opIntegratedEmr/opTestReport",
          detailData: []
        },
        paymentData: {
          type: 4,
          cardTitle: "缴费信息",
          // buttonName: "进入门诊收费",
          buttonName: "",
          // router: "/cisOne/settleAccount/cisOutpCharge",
          router: "",
          detailData: []
        },
        dispenseData: {
          type: 5,
          cardTitle: "发药信息",
          buttonName: "进入门诊发药",
          router: "/drugManagement/prescriptionDispensing/preQuery",
          detailData: []
        },
        //反显数据缓存
        codeTransformObj: {},
        depName: '',
        //医技状态
        stageInvert: {
          '0': "全部",
          '1': "已提交",
          '2': "已审核",
          '3': "已执行",
          '4': "退回",
          '5': "已预约",
          '6': "取消预约",
          '8': "已登记",
          '9': "已检查",
          '10': "已出报告",
          '11': "医技科室取消",
          '99': "作废"
        }
      };
    },
    computed: {
      ...mapGetters("patientMaster", ["receivePatientData", "patientListData", "hisRecordData"])
    },
    watch: {
      "receivePatientData": {
        async handler(n) {
          this.clearData();
          this.clearData1();
          if (JSON.stringify(n) !== "{}") {
            if (n.patientId) {
              /*//科室选择项
              let departList = n.ouptDeptId != null ? n.ouptDeptId.split(',') : [];
              for (var i in departList) {
                this.departList.push({
                  index: i,
                  label: await this.transformTable("org_nm", {org_type: '_DEPT_', id: departList[i]}, "sys_org"),
                  value: departList[i] + i
                })
              }
              this.depart = this.departList != [] ? this.departList[0].value : '';
              this.visitCodeList = n.visitCode != null ? n.visitCode.split(',') : [];
              this.visitCode = n.visitCode != null ? n.visitCode.split(',')[0] : '';*/

              //测试
              //this.visitCode ="VC19120900002";

              /*this.initOrderData();
              this.initMedicalInfoData();
              this.initMedicalTechData();
              this.initPaymentData();
              this.initDispenseData();*/
            } else {
              this.$message("该患者未建档，请开始建档");
              this.$router.push('/patientMaster/recordCreate');
            }
          } else {
            this.clearData();
            this.clearData1();
          }
        },
        immediate: true,
        deep: true
      },
      'patientListData': {
        async handler(n) {
          this.leftTabsValue = {};
          if (typeof n.patientList !== 'undefined') {
            this.leftTabsValue = n.leftTabsValue
          } else {
            this.leftTabsValue = {};
          }
        },
        deep: true,
        immediate: true
      },
      "hisRecordData": {
        async handler(n) {
          this.clearData();
          this.clearData1();
          if (JSON.stringify(n) !== "{}") {
            this.initOrderData();
            this.initMedicalInfoData();
            this.initMedicalTechData();
            this.initPaymentData();
            this.initDispenseData();
          }
        },
        immediate: true,
        deep: true
      }
    },
    async created() {
    },
    methods: {
      //选择科室改变
      /*async departChange(data) {
        this.clearData();
        let index = 0;
        for (let i in this.departList) {
          if (this.departList[i].value === data) {
            index = i;
            break;
          }
        }
        this.visitCode = this.visitCodeList[index];
        await this.initOrderData();
        await this.initMedicalInfoData();
        await this.initMedicalTechData();
        await this.initPaymentData();
        await this.initDispenseData();
      },*/
      clearData() {
        this.orderData.detailData = [];
        this.medicalInfoData.detailData = [];
        this.medicalTechData.detailData = [];
        this.paymentData.detailData = [];
        this.dispenseData.detailData = [];
      },
      clearData1() {
        this.departList = [];
        this.depart = '';
        this.visitCodeList = [];
        this.visitCode = '';
      },
      //左侧列表转换tab
      handleClick() {
      },
      // 查询方法
      search(form) {

        delete form["startTimeRange"];
        delete form["endTimeRange"];
        if (form.timeRange != null && form.timeRange.length > 1) {
          form["startTimeRange"] = form.timeRange[0];
          form["endTimeRange"] = form.timeRange[1];
        }
        this.param = {
          ...form,
          date: new Date()
        };
        this.searchType = 'searchButton';
      },
      // 读卡方法
      readCard(form) {
        let clearData = '1';
        if (this.patientListData.patientList.length > 0 && this.patientListData.clear == '2') {
          clearData = '2';//不清
        }
        this.param = {
          cardId: form.search,
          date: new Date(),
          clearData: clearData
        };
        this.searchType = 'readCard';
      },
      messageHandler() {
        console.log("工具箱消息");
      },
      //医技信息
      initMedicalTechData() {
        this.medicalTechData.detailData = [];
        getMedicalTechInfo(this.hisRecordData.visitCode).then((resData) => {
          if (resData.code === 1 && resData.data) {
            // 给数据源赋值
            this.medicalTechData.detailData.push(
              ...resData.data.map((item, index) => {
                let createTime = this.handleDate(item.createTime) || '--';
                let titleTime = this.handleDate(item.createTime) ? '(' + this.handleDate(item.createTime).split(" ")[0] + ')' : '';
                let stateStr = "";
                // if (item.applyType == 3 && item.status == 1) {
                //治疗申请
                // stateStr = "已执行";
                stateStr = this.stageInvert[item.applyType] || '';
                // }
                let detail = [];
                detail.push({
                  tagsTitle: "申请时间",
                  tagsValue: createTime || '--'
                });
                detail.push({
                  tagsTitle: "医技序号",
                  tagsValue: '--'
                });
                detail.push({
                  tagsTitle: "执行诊室",
                  tagsValue: item.execDeptName || '--'
                });
                detail.push({
                  tagsTitle: "执行医生",
                  tagsValue: item.execDoctorName || '--'
                });
                return {
                  id: item.applyId,
                  title: `${item.itemName} ${titleTime}`,
                  status: stateStr,
                  detail
                };
              })
            );
          } else {
            this.$message.error(resData.message || "获取医技信息失败");
          }
        }).catch(err => {
          console.log(err);
          this.$message.error(err.message || "获取医技信息失败");
        });
        // console.info("this.medicalTechData" + JSON.stringify(this.medicalTechData));
      },
      //缴费信息
      initPaymentData() {
        this.paymentData.detailData = [];
        getPaymentInfo({
          visitCode: this.hisRecordData.visitCode
        }).then((resData) => {
          if (resData.code === 1) {
            //处理数据源
            let payData = this.changeData(resData.data);
            // 给数据源赋值
            if (payData.length > 0) {
              this.paymentData.detailData =
                payData.map((item, index) => {
                  let state = "已缴费";
                  if (item.hasOwnProperty("id")) {
                    state = "未缴费";
                  }
                  let chargeTime = this.handleDate(item.chargeTime) || '--';
                  let titleTime = this.handleDate(item.chargeTime) ? '(' + this.handleDate(item.chargeTime).split(" ")[0] + ')' : '';
                  let detail = [];
                  detail.push({
                    tagsTitle: "缴费金额",
                    tagsValue: parseFloat(item.amt).toFixed(2) || '--'
                  });
                  detail.push({
                    tagsTitle: "缴费时间",
                    tagsValue: item.chargeTime || "--"
                  });
                  detail.push({
                    tagsTitle: "操作人员",
                    tagsValue: item.chargeUserName || '--'
                  });
                  return {
                    id: item.recipeId,
                    title: `${item.orderItemName} ${titleTime}`,
                    status: state,
                    detail
                  };
                })
            }
          } else {
            this.$message.error(resData.message || "获取缴费信息失败");
          }
        }).catch(err => {
          this.$message.error(err.message || "获取缴费信息失败");
        });
      },
      //发药信息
      initDispenseData() {
        this.dispenseData.detailData = [];
        getRecipeInfo({
          visitCode: this.hisRecordData.visitCode
        }).then(async (resData) => {
          if (resData.code === 1) {
            // debugger;
            // 给数据源赋值
            let dataNew = [...resData.data];
            for (let i in dataNew) {
              let disTime = this.handleDate(dataNew[i].deliveryTime) || '--';
              let docName = "配药医生";
              let disNum = "配药序号";
              let status = "";
              let title = "配药";
              let detail = [];
              if (dataNew[i].refundState == 1) {
                //已退药
                title = "退药";
                status = "已退药";
                detail.push({
                  tagsTitle: '操作人员',
                  tagsValue: dataNew[i].refundUserName || ''
                });
                detail.push({
                  tagsTitle: '退药时间',
                  tagsValue: dataNew[i].refundTime || ''
                });
              } else {
                // debugger;
                if (dataNew[i].dispenseState == 1) {
                  status = this.disState[dataNew[i].deliveryState];
                  let deptName = "";
                  let windowName = "";
                  if (dataNew[i].deliveryState == 0) {
                    //未发药
                    deptName = dataNew[i].billPharCode;
                    windowName = dataNew[i].preWindowCode;
                    disTime = '（' + dataNew[i].dispenseTime + '）' || '';
                  } else if (dataNew[i].deliveryState == 1) {
                    //已发药

                    disTime = '（' + dataNew[i].deliveryTime + '）' || '';
                    console.info("distime" + disTime);
                    deptName = dataNew[i].deliveryPhCode;
                    windowName = dataNew[i].deliveryWindowCode;
                  }
                  //发药
                  docName = "发药医生";
                  disNum = "发药序号";
                  title = "发药";
                  detail.push({
                    tagsTitle: docName,
                    tagsValue: dataNew[i].deliveryUserName || '--'
                  });
                  // detail.push({
                  //   tagsTitle: disNum,
                  //   tagsValue: dataNew[i].queueUpNum || '--'
                  // });
                  detail.push({
                    tagsTitle: "发药科室",
                    tagsValue: await this.transformTable("org_nm", {org_type: '_DEPT_', id: deptName}, "sys_org")
                  });
                  detail.push({
                    tagsTitle: "发药窗口",
                    // tagsValue: windowName || '--',
                    tagsValue: await this.transformTable("WINDOW_NAME", {WINDOW_CODE: windowName}, "hrp_phar_window")
                  });

                } else if (dataNew[i].dispenseState == 0) {
                  //配药
                  disTime = '';
                  status = "未配药";
                  detail.push({
                    tagsTitle: docName,
                    tagsValue: dataNew[i].deliveryUserName
                  });
                  // detail.push({
                  //   tagsTitle: disNum || '--',
                  //   tagsValue: dataNew[i].queueUpNum
                  // });
                }
              }
              this.dispenseData.detailData.push(
                {
                  id: dataNew[i].id,
                  title: `门诊` + title + disTime,//+ ` (${disTime.split(" ")[0]})`,
                  status: status,
                  detail
                }
              );
            }

          } else {
            this.$message.error(resData.message || "获取发药信息失败");
          }
        }).catch(err => {
          this.$message.error(err.message || "获取发药信息失败");
        });
      },
      //预约信息
      initOrderData() {
        this.orderData.detailData = [];
        getScheduleInfo({
          patientIds: this.hisRecordData.patientId,
          visitCode: this.hisRecordData.visitCode,
          ouptDeptId: this.hisRecordData.ouptDeptId//科室
        }).then(async (resData) => {
          // console.log(resData);
          // debugger
          if (resData.code === 1) {
            // 给数据源赋值
            let dataNew = [...resData.data];
            for (let i in dataNew) {
              let appointmentMode = await this.transformCode('name', 'appointmentMode', dataNew[i].appointmentMode);
              let signInWayName = await this.transformCode('name', 'SIGN_IN_WAY', dataNew[i].signInWay);
              let depName = await this.transformTable("org_nm", {
                org_type: '_DEPT_',
                id: dataNew[i].ouptDeptName
              }, "sys_org");
              let hosName = await this.transformTable("org_nm", {
                org_type: '_HOS_',
                id: dataNew[i].hosId
              }, "sys_org");
              let titleTime = dataNew[i].appointmentTime != null ? dataNew[i].appointmentTime : '';
              let detail = [];
              detail.push({
                tagsTitle: "操作日期",
                tagsValue: dataNew[i].regTime || '--'
              });
              detail.push({
                tagsTitle: "预约途径",
                tagsValue: appointmentMode || '--'
              });
              detail.push({
                tagsTitle: "签到时间",
                tagsValue: dataNew[i].attendTime || '--'
              });
              detail.push({
                tagsTitle: "签到途径",
                tagsValue: signInWayName || '--'
              });
              detail.push({
                tagsTitle: "预约科室",
                tagsValue: depName || '--'
              });
              detail.push({
                tagsTitle: "预约医生",
                tagsValue: dataNew[i].doctorName || '--'
              });
              this.orderData.detailData.push({
                id: dataNew[i].appointmentId,
                title: `${hosName} ${titleTime}`,
                status: dataNew[i].attendTime == null || "" ? "未签到" : "已签到",
                detail
              })
            }

          } else {
            this.$message.error(resData.message || "获取预约信息失败");
          }
        }).catch(err => {
          this.$message.error(err.message || "获取预约信息失败");
        });
      },
      //就诊信息
      initMedicalInfoData() {
        this.medicalInfoData.detailData = [];
        //初始化就诊信息
        getMedicalInfo({
          patientIds: this.hisRecordData.patientId,
          visitCode: this.hisRecordData.visitCode,
          status: "2,4,5"
        }).then(async (resData) => {
          if (resData.code === 1) {
            // 给数据源赋值
            let dataNew = resData.data;
            for (let i in dataNew) {
              // let diagTime = this.handleDate(dataNew[i].diagTime) || '--';
              let titleTime = this.handleDate(dataNew[i].diagTime) ? '(' + this.handleDate(dataNew[i].diagTime).split(" ")[0] + ')' : '';
              let detail = [];
              let hosName = await this.transformTable("org_nm", {
                org_type: '_DEPT_',
                id: dataNew[i].ouptDeptId
              }, "sys_org");
              let status = await this.transformCode('name', 'seeDoctorStatus', dataNew[i].recordStatus);
              // console.info("jiuzhenstatus......:")+status;
              detail.push({
                tagsTitle: "接诊医生",
                tagsValue: dataNew[i].doctorName || '--'
              });
              detail.push({
                tagsTitle: "候诊序号",
                tagsValue: dataNew[i].queueUpNum || dataNew[i].appointmentMode || '--'
              });
              detail.push({
                tagsTitle: "接诊科室",
                tagsValue: hosName || '--'
              });
              // console.info("222222222222222222222");
              this.medicalInfoData.detailData.push({
                id: dataNew[i].orgId,
                title: `${hosName} ${titleTime}`,
                // status: dataNew[i].recordStatus == 4 ? "诊中" : "待诊",
                status: status,
                detail
              });
            }
          } else {
            this.$message.error(resData.message || "获取就诊信息失败");
          }
        }).catch(err => {
          this.$message.error(err.message || "获取就诊信息失败");
        });
      },
      handleDate(date) {
        let result = '';
        if (date) {
          let dateObj = new Date(date);
          let year = dateObj.getFullYear();
          let month = dateObj.getMonth() + 1;
          let day = dateObj.getDate();
          let hour = dateObj.getHours();
          let minute = dateObj.getMinutes();
          let second = dateObj.getSeconds();
          result = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        }
        return result;
      },
      //转换缴费数据源
      changeData(data) {
        let result = [];
        data.map((e, i) => {
          Array.prototype.push.apply(result, e.outpChargeDetailVO);
        });
        return result;
      },
      // 处理预约信息更新的方法
      handleOrderData(data) {
        console.log(data);
      },
      // 获取具体流程
      handleCardUpdate(data) {
        console.log(data, "data");
      },
      //主数据反显
      async transformCode(field, code, val) {
        let params = [{field, code, val}];
        // debugger
        if (this.codeTransformObj[`${code}+${val}`]) {
          el.innerText = this.codeTransformObj[`${code}+${val}`];
          return this.codeTransformObj[`${code}+${val}`];
        } else {
          /*transformCode(params).then(resData => {
            if (resData.code === 1) {
              this.codeTransformObj[`${code}${val}`] = resData.data[code];
              console.info("resData.data[code]"+resData.data[code]);
              return resData.data[code];
            } else {
              return '--';
            }
          }).catch(err => {
            console.info("1234567890");
            return '--';
          })*/
          try {
            let resData = await transformCode(params);
            // console.log(resData);
            if (resData.code === 1) {
              this.codeTransformObj[`${code}${val}`] = resData.data[code];
              // console.info("resData.data[code]"+resData.data[code]);
              return Promise.resolve(resData.data[code]);
            } else {
              return '--';
            }
          } catch (err) {
            // console.info("1234567890");
            return '--';
          }
        }
      },
      //表数据反显
      async transformTable(columns, conditionMap, tableName) {
        try {
          let data = {
            tableName: tableName || '',
            columns: columns || '',
            conditionMap: conditionMap || {}
          };
          let resData = await getTableData(data);
          if (resData.code === 1 && resData.data != []) {
            return Promise.resolve(resData.data[0][columns]);
          } else {
            return '默认';
          }
        } catch (error) {
          return '默认';
        }
      }
    }
  };
</script>

<style lang='scss' scoped>
  .treat-con {
    width: 100%;

    .cont-list {
      width: 100%;
      height: calc(100% - 90px);
      overflow: auto;

      .depart-select {
        width: 260px;
        margin: 20px 0 0 20px;
      }

      .card-list {
        padding: 20px;
        /*background-color: #fff;*/
        font-size: 0;

        .card-list-item {
          margin-bottom: 20px;
          margin-right: 20px;
        }
      }

      .line-process {
        width: 100%;
        overflow-x: hidden;
      }
    }
  }
</style>
