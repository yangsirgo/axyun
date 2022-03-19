<template>
  <div class="width100 height100">
    <l-layout :toolBoxs="layoutObjec.toolBoxs" :defaultToolName="layoutObjec.toolBoxs[0]" :isToolBox="layoutObjec.isToolBox"
      :boxExpanded="false" patientCardType="default" :patientListShow="layoutObjec.patientListShow" @message="messageHandler"
      :ele-type="1" hosType="1">
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
                <span>当前患者：</span><span>{{changeDate.changeDatelist.length}}人</span>
              </el-col>
              <!-- <el-col class="patient-border">
                <el-radio-group v-model="radio" @change="radioFun">
                  <el-radio label="1">全部病人</el-radio>
                  <el-radio label="2">本人管辖病人</el-radio>
                </el-radio-group>
              </el-col> -->
              <el-col class="patient-border">
                <el-radio-group v-model="bedsData" @change="bedsDataFun">
                  <el-radio label="0">全部床位</el-radio>
                  <el-radio label="1">空床</el-radio>
                  <el-radio label="2,6,7">在床</el-radio>
                  <el-radio label="3">我的患者</el-radio>
                </el-radio-group>
              </el-col>

              <el-col class="patient-borderA">
                <LFormtTitle label="建床日期" :disabled="bedsData == 1">
                  <el-date-picker v-model="dateTime" type="daterange" style="width:100%" range-separator="至" :disabled="bedsData == 1"
                    start-placeholder="开始日期" end-placeholder="结束日期" @input="inputChange($event)" format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd" :picker-options="expireTimeOption" @change="datePicker"></el-date-picker>
                </LFormtTitle>

              </el-col>
              <el-col class="patient-borderA">
                <LFormtTitle>
                  <el-input placeholder="姓名/身份证号/家床号" :disabled="bedsData == 1" v-model="queryData.searchValue">
                  </el-input>
                </LFormtTitle>
              </el-col>

              <el-col class="patient-borderA">
                <el-button type="primary" @click="heQuery" v-if="bedsData != '1'">查询</el-button>
                <el-button type="" @click="emptyDateFun" v-if="bedsData != '1'">重置</el-button>
                <el-button type="" @click="add" v-if="bedsData == '1'">创建</el-button>
              </el-col>
            </el-col>
          </div>
          <div class="m-contain">
            <div class="top-con height100">
              <div class="top-con-tab height100">

                <div class="patientList" v-for="(item,index) in getListData" :key="index" @click="patientListFun(index)"
                  :class="patientListIndex == index ? 'patientListBg':''">
                  <div v-if="item.patientId">
                    <el-col class="patientList-top">
                      <span class="patientList-top-Rt" style="width:60px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;" :title="item.bedCode">{{item.bedCode}}</span>
                      <span style="color: #000000;font-weight: 600;">{{item.patientName}}</span>
                      <span :val="item.patientGender || '--'" code="GENDER_CODE" v-codeTransform> </span>
                      <span> {{item.patientAge}} </span>
                      <span class="patientList-top-Lt"  :style="
                  `font-size:14px;color:${
                    getDays(
                      item.predictTreatStartTime || '',
                      item.predictTreatEndTime || ''
                    ) >= 0
                      ? '#4F80FF'
                      : '#EF0F0F'
                  }`
                ">

                        <span>{{
                            getDays(
                              item.predictTreatStartTime || "",
                              item.predictTreatEndTime || ""
                            ) >= 0
                              ? "余" +
                              getDays(
                                item.predictTreatStartTime || "",
                                item.predictTreatEndTime || ""
                              )
                              : "超" +
                              Math.abs(
                                getDays(
                                  item.predictTreatStartTime || "",
                                  item.predictTreatEndTime || ""
                                )
                              )
                          }}
                天</span>
                      </span>
                    </el-col>
                    <el-col class="patientList-bottom">
                      <el-col :span="4">
                        <el-avatar :size="size" :src="circleUrl"></el-avatar>
                        <el-button @click="changeData(item)" style="padding: 5px;">变更</el-button>
                      </el-col>
                      <el-col :span="20">
                        <!-- <el-col class="patientList-b-l">
                          <span style="color: #000000;font-weight: 600;">{{item.patientName}}</span>
                          <span :val="item.patientGender || '--'" code="GENDER_CODE" v-codeTransform> </span>
                          <span> {{item.patientAge}} </span>
                        </el-col> -->
                        <el-col class="patientList-b-l">
                          <el-col :span='6'>家床号</el-col>
                          <el-col :span='18'>{{item.inpCode}}</el-col>
                        </el-col>
                        <el-col class="patientList-b-l">
                          <el-col :span='6'>建床类型</el-col>
                          <el-col :span='6'>
                            <span :val="item.admitTypeCode || '--'" code="AdmitHosType" v-codeTransform></span>
                          </el-col>
                          <el-col :span='6'>建床次数</el-col>
                          <el-col :span='6'>{{item.inHosTimes}}</el-col>
                        </el-col>
                        <el-col class="patientList-b-l">
                          <el-col :span='6'>费用类型</el-col>
                          <el-col :span='18'><span :val="item.settlementType || '--'" code="settlementType"
                              v-codeTransform></span></el-col>
                        </el-col>
                        <el-col class="patientList-b-l">
                          <el-col :span='6'>建床日期</el-col>
                          <el-col :span='18'><span>{{interception(item.admissionTime)}}</span></span></el-col>
                        </el-col>
                        <el-col class="patientList-b-l">
                          <el-col :span='6'>责任医生</el-col>
                          <el-col :span='6'>{{item.manageDoctorName}}</el-col>
                          <el-col :span='6'>责任护士</el-col>
                          <el-col :span='6'>{{item.manageNurseName}}</el-col>
                        </el-col>
                        <el-col class="patientList-b-l">
                          <el-col :span='6'>诊断</el-col>
                          <el-col :span='18'>{{item.admissionDiag}}</el-col>
                        </el-col>
                      </el-col>
                    </el-col>
                  </div>
                  <div v-else style="width: 100%;height: 100%;">
                    <el-col class="patientList-top">
                      <span class="patientList-top-Rt">{{item.bedCode}}</span>
                    </el-col>
                    <div style="width: 100%;height: 100%; display: flex;align-items: center;justify-content: center;">
                      <span class="el-icon-edit" style="font-size: 25px; color: #CECECE;" @click="getListDataFun(item)"
                        v-if="bedsData == '1'"></span>
                      <span class="el-icon-delete deleteStyle" v-if="bedsData == '1'" @click="deleteStyle(item)" style="font-size: 25px; color: #CECECE;position: absolute;right: 10px;top: 10px;"></span>
                    </div>
                  </div>

                </div>

                <!-- <div class="patientList" v-for="(item,index) in integrationData" :key="index" v-if="bedsData == 1">
                      <div style="width: 100%;height: 100%; display: flex;align-items: center;justify-content: center;">
                        <span class="el-icon-edit" style="font-size: 25px; color: #CECECE;" @click="getListDataFun(item)"></span>
                        <span class="el-icon-delete deleteStyle" @click="deleteStyle(item)" style="font-size: 25px; color: #CECECE;position: absolute;right: 10px;top: 10px;"></span>
                      </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </template>
    </l-layout>
    <!-- 创建空白床位 -->
    <el-dialog title="空白床位" :visible.sync="dialogVisible" width="40%" :before-close="emptyFun">
      <div>
        <add ref="add" :getListDataItem="getListDataItem" v-if="dialogVisible"></add>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="emptyFun">取 消</el-button>
        <el-button type="primary" @click="addDialogFun">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 变更责任医生床位 -->
    <el-dialog title="医生护士床位变更" :visible.sync="dialogVisibleStyle" width="30%" :before-close="dialogVisibleStyleClose">
      <div class="width100 height100">
        <changeDate ref="changeDate" :changeDate="changeDate" v-if="dialogVisibleStyle"></changeDate>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleStyleClose">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleStyleFun">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import leftBar from "./components/leftBar.vue";
  import add from "./components/AddDialog.vue";
  import changeDate from "./components/changeDate.vue";
  import {
    mapActions,
    mapGetters
  } from "vuex";
  import {
    getRoles,
    getRole,
    setRole,
    getUserId
  } from "@/utils/auth";
  import {
    getList,
    getAllInpPatientInfo,
    queryDept,
    ward,
    newWard,
    updateWard,
    deleteStyle,
    updatePatient,
  } from "@/api/homeSickbeds/hsPatientManagement/hsPatientManagement";
  import Base64 from "@/utils/base64.js";
  export default {
    name: "index",
    components: {
      leftBar,
      add,
      changeDate,
    },
    data() {
      return {
        // 选中 patientListFun
        patientListIndex: '',
        // id
        userId: Base64.decode(getUserId()),
        // 测试数据
        radio: "1",
        dateTime: "",
        input2: "",
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        size: "medium",
        // 测试数据
        // 判断时候是编辑还是新建
        addState: "",
        // 新建床位
        getListDataItem: {},
        // dialogVisible空白弹窗的
        dialogVisible: false,
        // 变更弹窗
        dialogVisibleStyle: false,
        changeDate: {
          changeDatelist: {},
          changeDate: {},
          emptBedsList: [],
        },
        // 床位
        bedsData: "0",
        readTheStyle: false,
        temType: "",
        layoutObjec: {
          //默认 诊断病历页面
          patientListShow: false,
          toolBoxs: [],
          boxExpanded: false,
          isToolBox: false,
        },
        // 病人列表
        getListData: [],
        // 空床位
        integrationData: [],
        // 有人的床位
        getAllInpPatientInfoData: [],
        // 查询参数
        queryData: {
          searchValue: "",
          statusList: ["2", "6", "7"],
          managerUserId: "", //责任人
          inStartDate: "", //入院时间
          inStopDate: "", //出院时间
        },
        selLoading: false,
        // 查询空床位置
        emptyBedData: {
          type: "0",
        },
      };
    },
    created() {
      this.integration(this.emptyBedData, false);
    },
    computed: {
      ...mapGetters("homeSickbeds", ["receivePatientData"]),
    },
    methods: {
      ...mapActions({
        changeRecPatientData: "base/changeRecPatientData",
        seteHrData: "ehr/seteHrData",
        setReloadKey: "base/changeSearchAgainKey", //刷新左侧患者列表
        changeChangeTabsShowQuote: "cis/changeChangeTabsShowQuote", // 切换为诊断tab时，要更新右侧工具箱诊断模板的"引用"按钮显示出来
      }),
      // 选中状态
      patientListFun(index) {
        this.patientListIndex = index;
      },
      // 截取时间
      interception(data) {
        let str = "";
        if (data) {
          str = data.substring(-1, 11);
        }
        return str;
      },
      GetNumberOfDays(date1, date2) {
        console.log(`date1`, date1);
        console.log(`date2`, date2);
        //获得天数
        //date1：开始日期，date2结束日期
        var a1 = Date.parse(new Date(date1));
        var a2 = Date.parse(new Date(date2));
        var day = parseInt((a2 - a1) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
        return day;
      },
      getDays(strDateStart, strDateEnd) {
        if (strDateStart && strDateEnd) {
          let temp = this.GetNumberOfDays(
            this.dayjs(new Date()).format(),
            strDateEnd
          );
          return temp;
        }
        return "-";
      },
      getDaysBetween(dateString2) {
        let date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        let dateString1 =
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          '00' +
          ":" +
          '00' +
          ":" +
          '00';
        if (dateString1 && dateString2) {
          var startDate = Date.parse(dateString1);
          var endDate = Date.parse(dateString2);
          var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
          if (endDate >= startDate) {
            days = Math.floor(days);
          } else {
            days = 0;
          }
        } else {
          days = 0;
        }

        return days;
      },

      dialogVisibleStyleClose() {
        this.dialogVisibleStyle = false;
      },
      dialogVisibleStyleFun() {
        let submitData = this.$refs.changeDate.submitData;
        this.updatePatient();
      },
      async updatePatient() {
        //changeDate
        let submitData = this.$refs.changeDate.submitData;
        submitData.bedId =
          submitData.bedId == "" ?
          this.changeDate.changeDate.bedId :
          submitData.bedId;
        submitData.bedCode =
          submitData.bedCode == "" ?
          this.changeDate.changeDate.bedCode :
          submitData.bedCode;
        if (submitData.bedId == '') {
          this.$message.error("请选择家床号");
          return;
        }
        if (submitData.manageDoctorId == '' || submitData.manageDoctorId == '--') {
          this.$message.error("请选择责任医生");
          return;
        }
        if (submitData.manageNurseId == '' || submitData.manageNurseId == '--') {
          this.$message.error("请选择责任护士");
          return;
        }
        try {
          this.selLoading = true;
          let res = await updatePatient(submitData);
          if (res.code == "1") {
            this.$message.success("变更成功");
            this.dialogVisibleStyle = false;
            this.$nextTick(function() {
              this.$refs.changeDate.emptyFun();
            })

            if (this.bedsData == "1") {
              this.getAllInpPatientInfo("", true);
            } else if (this.bedsData == "3") {
              this.getAllInpPatientInfo("", true);
            } else if(this.bedsData == '2,6,7'){
              this.getAllInpPatientInfo("", true);
            } else if (this.bedsData == "0") {
              // this.integration(this.emptyBedData, false)
              this.heQuery();
            }
          }
          this.selLoading = false;
        } catch (error) {
          this.selLoading = false;
          this.$message.error(error.msg || "变更失败");
          this.dialogVisibleStyle = false;
        }
      },
      // 变更床位变更责任医生、变更责任护士
      changeData(val) {
        this.dialogVisibleStyle = true;
        this.changeDate.changeDate = val;
      },
      datePicker() {
        console.log(this.dateTime);
        // inStartDate: '', //入院时间
        // inStopDate: '' //出院时间
        this.queryData.inStartDate =
          this.dateTime && this.dateTime.length ?
          this.dateTime[0] + " 00:00:00" :
          "";
        this.queryData.inStopDate =
          this.dateTime && this.dateTime.length ?
          this.dateTime[1] + " 23:59:59" :
          "";
      },
      heQuery() {
        this.getListData = [];

        if (this.bedsData == "1") {
          this.getList({
              type: "2",
            },
            true
          );
        } else if (this.bedsData == "0") {
          if (
            this.queryData.inStartDate.length == 0 &&
            this.queryData.searchValue.length == 0
          ) {
            this.integration(this.emptyBedData, false);
          } else {
            this.getAllInpPatientInfo("", true);
          }
        } else {
          this.getAllInpPatientInfo("", true);
        }
      },

      emptyDateFun() {
        this.queryData = {
          searchValue: "",
          managerUserId: "", //责任人
          inStartDate: "", //入院时间
          inStopDate: "", //出院时间
        };
        this.dateTime = "";
        this.bedsDataFun(this.bedsData);
      },

      emptyFun() {
        this.dialogVisible = false;
        this.$refs.add.empty();
      },
      // 保存
      async addDialogFun() {
        if (this.$refs.add.addData.bedCode.length == 0) {
          this.$message.error("请填写床位编号");
          return false;
        }
        let res = {};
        if (this.addState == "1") {
          //新建
          res = await newWard(this.$refs.add.addData);
        } else {
          //编辑
          res = await updateWard(this.$refs.add.addData);
        }
        if (res.code == "1") {
          this.dialogVisible = false;
          this.$message.success("保存成功");
          this.getList({
              type: "2",
            },
            true
          );
        } else {
          this.dialogVisible = false;
          this.$message.error(res.msg || "保存失败");
        }
      },
      add() {
        (this.addState = "1"), (this.dialogVisible = true);
        this.$nextTick(function() {
          this.$refs.add.empty();
        });
      },
      // 新建床位
      getListDataFun(item) {
        (this.addState = "2"), (this.dialogVisible = true);
        this.getListDataItem = item;
      },
      // radioFun(val) {
      //   this.bedsData = '2,6,7';
      //   if (val == 1) {
      //     this.queryData.managerUserId = ''
      //   } else {
      //     this.queryData.managerUserId = JSON.parse(this.getPamars()).hosId;
      //   }
      //   this.getAllInpPatientInfo();
      // },
      bedsDataFun(val) {
        if (val == 1) {
          //空床
          this.getList({ type: "2",},true);
        } else if (val == 0) {
          this.queryData.statusList = ["2", "6", "7"];
          this.queryData.managerUserId = "";
          this.queryData.searchValue = '';
          this.queryData.inStartDate = '';
          this.queryData.inStopDate = "";
          this.dateTime = [];
          // 全部床位
          this.integration(this.emptyBedData, false);
        } else if (val == 3) {
          // 本人患者列表
          this.queryData.statusList = ["2", "6", "7"];
          this.queryData.managerUserId = this.userId;
          this.getAllInpPatientInfo("", true);
          // this.getListData = this.getAllInpPatientInfoData;
        } else {
          // 在床患者
          this.queryData.managerUserId = "";
          this.queryData.statusList = ["2", "6", "7"];
          this.getAllInpPatientInfo("", true);
          // this.getListData = this.getAllInpPatientInfoData;
        }
      },
      // 删除床位
      deleteStyle(item) {
        this.$confirm("确认删除这个床位吗？？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            this.daleteStyleFun(item);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      },

      // 删除床位方法
      async daleteStyleFun(item) {
        try {
          let res = await deleteStyle({
            bedId: item.bedId,
          });
          if (res.code == "1") {
            this.$message.success("删除成功");
            this.getList({
                type: "2",
              },
              true
            );
          } else {
            this.$message.error(res.mag || "删除失败");
          }
        } catch (error) {}
      },

      // 整合全部床位
      integration(data, markStyle) {
        console.log(this.queryData, "全部提交参数");
        this.getAllInpPatientInfo(data, markStyle);
      },
      //不是空床位
      async getAllInpPatientInfo(data, markStyle) {
        this.getListData = [];
        this.changeDate.changeDatelist = [];
        try {
          let res = await getAllInpPatientInfo(this.queryData);
          console.log(res.data, "不是床位列表");
          if (res.code == "1") {
            if (markStyle) {
              this.getListData = res.data;
              this.changeDate.changeDatelist = res.data;
            } else {
              this.getList(data, markStyle);
              this.getAllInpPatientInfoData = res.data;
            }
          }
        } catch (error) {}
      },
      // 查询的空床位的的列表
      async getList(data, markStyle) {
        this.getListData = [];
        this.changeDate.changeDatelist = [];
        try {
          let res = await getList(data);
          console.log(res.data, "空床位列表");
          if (res.code == "1") {
            if (markStyle) {
              this.$nextTick(function() {
                this.getListData = res.data;
              });
            } else {
              this.integrationData = res.data;
              let getListDataList = [];
              let strData = [];
              for (let i = 0; i < this.integrationData.length; i++) {
                if (this.getAllInpPatientInfoData.length > 0) {
                  for (let j = 0; j < this.getAllInpPatientInfoData.length; j++) {
                    if (
                      this.integrationData[i].patientId ==
                      this.getAllInpPatientInfoData[j].patientId
                    ) {
                      getListDataList.push(this.getAllInpPatientInfoData[j]);
                      this.changeDate.changeDatelist.push(
                        this.integrationData[i]
                      );
                    }
                  }
                } else {
                  if (!this.integrationData[i].patientId) {
                    getListDataList.push(this.integrationData[i]);
                  }
                }
                if (!this.integrationData[i].patientId) {
                  strData.push(this.integrationData[i]);
                  getListDataList.push(this.integrationData[i]);
                }
              }
              console.log(strData, "剩余的空床");
              this.getListData = getListDataList;
              console.log(this.getListData, "总共床位");
            }
            console.log(this.getListData, "this.getListData ");
            // this.changeDate.changeDatelist = res.data;
            this.changeDate.emptBedsList = res.data;
          }
        } catch (error) {}
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
      },
    },

    watch: {
      receivePatientData: {
        immediate: true,
        deep: true,
        handler(a) {},
      },
    },
  };
</script>

<style lang="scss" scoped>
  .bg-contain {
    // background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: $l-bg-radius-max;
    font-size: 0;
    box-sizing: border-box;

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

    .patientListBg {
      box-shadow: #585858 0px 0px 10px 5px; //边框阴影
    }

    .patientList {
      width: 360px;
      height: 250px;
      background-color: #ffffff;
      padding: 5px;
      box-sizing: border-box;
      margin: 8px;
      border-radius: 8px;
      float: left;
      position: relative;
      cursor: pointer;

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

      .deleteStyle {
        display: none;
      }

      .patientList-bottom {
        display: flex;
        // align-items: center;
        justify-content: center;
        padding-top: 10px;

        .patientList-b-l {
          padding-top: 10px;
        }
      }
    }

    // .patientList:hover{
    //    box-shadow: #585858 0px 0px 10px 5px ;//边框阴影
    // }
    .patientList:hover .deleteStyle {
      display: block;
      cursor: pointer;
      z-index: 10;
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
          .button+.button {
            margin-left: 8px;
          }
        }
      }
    }

    .m-contain {
      height: calc(100% - 56px);
      box-sizing: border-box;

      .top-con {
        padding-top: 8px;

        .top-con-tab {
          font-size: 12px;
          // /deep/ .el-tabs__nav-wrap {
          //   padding-left: 18px;
          //   border-bottom: 1px solid $l-color-border-8;
          // }
          overflow: auto;

          .first-list {
            width: 854px;
            font-size: 0;

            .lay-item {
              display: inline-block;
              line-height: 17px;
              font-size: 12px;

              .item-title {
                display: inline-block;
                color: #949da3;
              }

              .item-contain {
                margin-left: 8px;
                display: inline-block;
                color: #2e323a;
              }

              .item-title-01 {
                width: 36px;
              }

              .item-title-02 {
                width: 48px;
              }

              .item-contain-01 {
                width: 146px;
              }

              .item-contain-02 {
                width: 101px;
              }

              .item-contain-03 {
                width: 93px;
              }

              .item-contain-04 {
                width: 270px;
              }
            }
          }

          .third-con {
            position: relative;
            font-size: 0;
            padding-left: 17px;

            .input-con {
              /deep/ .el-input {
                width: calc(100% - 56px);
              }

              /deep/ .el-button {
                margin-left: $l-margin-default-4;
              }
            }

            .third-contain {
              .show-con {
                width: 854px;
                padding: 12px $l-padding-default-6;
                line-height: 20px;
                font-size: 14px;
                background: $l-color-bgcolor-18;
                border-radius: $l-bg-radius-bg;

                .text-left {
                  color: #666c70;
                }

                .text-right {
                  margin-left: $l-margin-default-4;
                  margin-right: 32px;
                  color: #2e323a;
                }
              }
            }

            .bottom-con {
              padding: 16px;
              position: absolute;
              bottom: 0;
              left: 0;
              height: 63px;
              border-top: 1px solid #e4e4e4;
            }
          }
        }
      }
    }
  }

  .overflowEllipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
