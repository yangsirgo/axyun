/* eslint-disable complexity */
<template>
  <div class="width100 height100 filingAndChangeindex">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      @message="messageHandler"
      pageName="docSubmit"
    >
      <template #list>
        <leftBar
          ref="leftBar"
          @addnewFun="addnewFun"
          @tabsChange="tabsChange"
          @choosePatientFunResid="choosePatientFunResid"
          @choosePatientFun="choosePatientFun"
        ></leftBar>
      </template>
      <template #content>
        <div class="bg-contain recordCreate width100 height100" v-loading="mainContentLoading">
          <div v-if="htmlShow" class="width100 height100">
            <div class="patient-card">
              <patientDetail
                :patientData="patientInfoShow"
                :detailList="detailList"
                @patientDetail="patientDetail"
              ></patientDetail>
            </div>
            <el-card class="card-cont1 width100 m-contain bottom-con third-con">
              <div class="form-cont height-button-main">
                <contactInformation
                  ref="contactInformation"
                  :pStatus="patientSelected.status"
                  :readonly="readonlyMethod"
                  :recordFormobj="recordForm"
                ></contactInformation>
                <!-- 只在居民申请中显示，历史申请不显示 -->
                <residentDoc
                  v-if="activeName == 'third'"
                  ref="residentDoc"
                  :data="filesData"
                ></residentDoc>
                <bottomForm
                  ref="bottomForm"
                  :recordFormobj="recordForm"
                  :pStatus="patientSelected.status"
                  :readonly="readonlyMethod"
                  :zdDataObj="zdData"
                />
              </div>

              <div class="bottom-con width100">
                <div class="btns float-right">
                  <el-button
                    type="primary"
                    @click="submit"
                    v-if="activeName == 'first'"
                    >提交</el-button
                  >
                  <el-button
                    type="primary"
                    @click="submitCancel"
                    v-if="activeName == 'second' && recordForm.applyStatus != 9"
                    >撤销申请</el-button
                  >
                  <el-button
                    type="primary"
                    @click="submitChange"
                    v-if="activeName == 'second'"
                    >修改</el-button
                  >
                  <el-button
                    type="primary"
                    @click="submitChange"
                    v-if="activeName == 'second' && recordForm.applyStatus == 9"
                    >重新提交</el-button
                  >
                  <!-- 居民申请 -->
                  <el-button
                    type="primary"
                    @click="residSubmit"
                    :loading="residSubmitLoading"
                    :disabled="patientSelected.status == '2' || patientSelected.status == '1'"
                    v-if="activeName == 'third'"
                    >提交申请</el-button
                  >
                  <!-- :disabled="patientSelected.status == '2'" -->
                  <el-button
                    @click="refuseSubmit"
                    v-if="activeName == 'third'"
                    :disabled="patientSelected.status == '2' || patientSelected.status == '1'"
                    :loading="refuseSubmitLoading"
                    >拒绝申请</el-button
                  >
                </div>
              </div>
            </el-card>
          </div>

          <el-card class="card-cont1 width100" v-if="htmlShowStyle">
            <emptyShow @addnewFile="addnewFile"></emptyShow>
          </el-card>
        </div>
      </template>
    </l-layout>
    <!-- 绑定 -->

    <!-- 新建档案 start -->
    <el-dialog
      title="新建档案"
      width="80%"
      height="95%"
      top="7vh"
      :close-on-click-modal="false"
      :visible.sync="addarchivesStyle"
      v-if="addarchivesStyle"
    >
      <addarchives @cancelstyle="cancelstyle"> </addarchives>
    </el-dialog>
    <!-- 新建档案 end  -->
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { getPamars } from "@/utils/auth";
import {
  createBedSubmit,
  getApplyInfo,
  applyUpdateStatus,
  getResidentPersionInfo,
  homeBedApplyApprove,
  refuseHistorySubmit,
  putApplySave
} from "@/api/ipnw/etHospital.js";

import addarchives from "@/views/filingAndChange/filingAndChangeindex/components/addarchives.vue";
import patientDetail from "@/views/homeSickbeds/hsDiagTreat/components/patientDetail";
import emptyShow from "./components/emptyShow.vue";
import contactInformation from "@/views/ipnw/etHospital/createBedApply/components/contactInformation.vue";
import bottomForm from "./components/bottomForm.vue";
import residentDoc from "./components/residentDoc.vue";
import leftBar from "./components/leftBar.vue";
import { deepClone } from "@/utils/index.js";

export default {
  name: "index",

  components: {
    leftBar,
    emptyShow,
    bottomForm,
    contactInformation,
    addarchives,
    residentDoc,
    patientDetail
  },

  data() {
    return {
      residSubmitLoading: false,
      refuseSubmitLoading: false,
      patientSelected: {},
      filesData: [],
      mainContentLoading: false,
      detailList: [],
      patientInfoShow: {},
      date: "",
      curDate: "",
      activeName: "first",

      // 诊断信息表格数据
      zdData: [],
      // 科室列表
      deptList: [],
      // 病区列表
      WdeptList: [],
      // 病区列表
      bedListData: [],
      bedList: [],
      remoteParams: {
        pageSize: 10,
        parentId: "0"
      }, // 分页参数,医嘱大类参数
      // remoteParams1: { keyword: "", type: "", cwFlag: "1" },
      loading: false,

      // 点击调阅档案按钮
      readTheData: {},
      readTheDataList: {},
      // 二维码假数据
      qrcodeImg:
        "data:image/png;base64,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",
      // 删除显示添加按钮
      //联系人
      deleteContactStyle: false,

      // 新建档案显示和隐藏
      addarchivesStyle: false,
      //绑卡弹框显示
      cardDisable: false,
      // 弹窗显示
      dialogVisible: false,
      cardId: "",
      // 相似档案显示隐藏
      patientListShow: true,
      // add页面的显示
      htmlShow: false,
      // 编辑
      eihtmlShow: false,
      // 档案初始化显示
      htmlShowStyle: true,
      checked: "",
      active: 0, //切换步骤
      toolBoxs: [],
      //form表单
      recordForm: {
        nativePlaceCode: "",

        bloodType: "",

        maritalStatus: "",

        nationCode: "1",

        identificationType: "",

        identificationNum: "",

        miNum: "",

        settlementType: "",

        mobileNum: "",

        addrCode: "",

        familyAddress: "",

        summaryOfIllness: "",

        createOpinions: "",

        diseaseType: "",

        createType: "",

        chargeDate2: [],

        criticalLevel: "", // 入院病情

        headImg: require("@/assets/pojehjdz.jpeg"),
        patientAge: "",

        patientBirthday: "",

        patientGender: "",
        patientId: "",
        patientName: "",
        archGuarantorList: []
      },
      // 患者联系人
      patientEmpiInfoAdditionalVOS: [],
      veriCodeDisabled: false,
      resetFields: "",
      timer: null, //定时器
      cardList: [],
      // 提交后返回的页码
      activeNew: null,
      // 禁止编辑极端
      disableEditing: false
    };
  },
  created() {
    this.hosId = JSON.parse(getPamars()).hosId;
    this.patientSelected = {};
  },
  /**
   * 事件（方法名）：
   * 1. 效果(需求)
   * 2. 效果(需求)
   *
   * 例子：
   * tabsChange 方法 :
   * 1. 切换患者查询和历史申请
   * 2. 将 leftBar 组件内的activeName 传递到父组件，控制 el-button 的 text 的变化（提交，撤销申请，修改，重新提交）。
   *
   * choosePatientFun 方法：
   * 1. 点击患者列表，触发的事件。
   * 2. 患者是是历史申请触发 patientListFunData2 方法
   * 3. 患者是是待申请的，触发 patientListFunData 方法
   *
   * patientListFunData2 方法：
   * 1. 获取申请信息
   * 2. 注入诊断和联系人
   * 3. 调用 changeDataheaderFun 方法，处理患者详情卡片
   *
   * patientListFunData 方法：
   * 1. 显示患者信息
   * 2. 调用 changeDataheaderFun 方法，处理患者详情卡片
   *
   *
   * changeDataheaderFun 方法：
   * 1. 设置患者卡片中的样式通过 detailList 字段
   * 2. 设置患者卡片中的信息 patientInfoShow。
   *
   * patientDetail 方法:
   * 1. 编辑患者档案时，确认按钮的回调函数
   * 2. detailList
   *
   * cancelstyle 方法：
   * 1. 关闭新建档案弹窗。
   * 2. 如果新建档案的资料在历史数据中存在，需要对历史数据中的患者选中
   *
   * 新增档案按钮 addnewFun：
   * 1. 打开新建档案弹窗
   *
   *
   * emptyShow 新增档案 按钮 （addnewFile）：
   * 1. emptyShow 中打开档案的方法。
   *
   * 提交按钮 （submit）：
   * 1. 验证上部表单。
   * 2. 验证下部表单。
   * 3. 处理数据，再提交表单。
   * 4. 提交成功后，切换患者列表tab到申请历史上， 并选中患者
   * 5. 清空表单的数据
   *
   * emptyFun 方法
   * 1. 清空表单的数据。
   *
   * 修改按钮 （submitChange）：
   * 1. 验证上部表单。
   * 2. 验证下部表单。
   * 3. 处理数据，再提交表单。
   * 4. 提交成功后，切换患者列表tab到申请历史上， 并选中患者
   * 5. 清空表单的数据
   *
   * 撤销提交按钮 （submitCancel）：
   * 1. 撤销提交。
   * 2. 撤销成功后,选中操作患者。
   *
   *
   * * */
  computed: {
    readonlyMethod (){
      console.log("执行了！！");
      if (this.activeName == "third"){
        return this.patientSelected.status == 2;
      }
      return false;      
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    tabsChange(item) {
      this.activeName = item;
      this.filesData = [];
    },
    // eslint-disable-next-line complexity
    async residSubmit (){
      // this.$refs.leftBar.residentApplicListSearch(); 
      // return;
            //保存表单接口接口
      let patientArchiveInfoVOData = deepClone(this.recordForm);

      try {
        let topForm = await this.$refs.contactInformation.submit();
        patientArchiveInfoVOData = {
          ...patientArchiveInfoVOData,
          ...topForm
        };
      } catch (error) {
        return;
      }

      try {
        let { recordForm, zdData } = await this.$refs.bottomForm.submit();

        patientArchiveInfoVOData = {
          ...patientArchiveInfoVOData,
          ...recordForm,
          ...{
            zdData
          }
        };
      } catch (error) {
        console.log("bottomForm 出问题了");
        return;
      }

      // 治疗开始结束时间
      patientArchiveInfoVOData["treatStartTime"] =
        (patientArchiveInfoVOData.chargeDate2 &&
          new Date(patientArchiveInfoVOData.chargeDate2[0]).format(
            "yyyy-MM-dd"
          )) ||
        "";
      patientArchiveInfoVOData["treatEndTime"] =
        patientArchiveInfoVOData.chargeDate2 &&
          new Date(patientArchiveInfoVOData.chargeDate2[1]).format(
            "yyyy-MM-dd"
          ) ||
        "";

      patientArchiveInfoVOData["patientBirthday"] =
        patientArchiveInfoVOData.patientBirthday.substring(0, 10) +
        " " +
        "00:00:00";

      patientArchiveInfoVOData["contactList"] =
        patientArchiveInfoVOData.archGuarantorList;
      patientArchiveInfoVOData["diagList"] = patientArchiveInfoVOData.zdData;

      patientArchiveInfoVOData["workUnitName"] =
        patientArchiveInfoVOData.workUnit;

      delete patientArchiveInfoVOData["chargeDate2"];
      delete patientArchiveInfoVOData["headImg"];

      try {
        this.$showLoading();
        let { data, code, msg } = await createBedSubmit(patientArchiveInfoVOData);
        if (code == 1) {
          this.homeBedApplyApprove(patientArchiveInfoVOData);
        } else {
          this.$message.error(msg || "提交失败");
        } 
      } catch (error) {
        console.log(error, "error");
      } finally {
        this.$hideLoading();
      }
    },
    async homeBedApplyApprove (patientArchiveInfoVOData){
      try {
        this.$showLoading();
        let result = await homeBedApplyApprove(patientArchiveInfoVOData);
        if (result.code == "1") {
          this.$message.success("申请提交成功");
          this.activeNew = 1;
          // 提交后刷新患者列表，病选中当前患者，右侧显示该患者信息
          const selectedItem = JSON.parse(
            JSON.stringify(patientArchiveInfoVOData)
          );
          await this.changeRecPatientData(selectedItem);
          this.$nextTick(() => {
            // this.$refs.leftBar.setActiveName("second"); // 切换患者列表tab到申请历史上
            // this.$refs.leftBar.finishcheckleftbarSearch(selectedItem); // 切换患者列表tab到历史申请上
            this.$refs.leftBar.residentApplicListSearch(selectedItem); // 切换患者列表tab到申请历史上
          });

          this.emptyFun();
          this.htmlShowStyle = true;
          this.htmlShow = false;
        } else {
          this.$message.error(result.msg || "提交失败");
        }
      } catch (error) {
        console.log(error, "error");
      } finally {
        this.$hideLoading();
      }
    },
    confirmHandle (){
      return new Promise((resolve, reject)=>{
        this.$confirm('是否要拒绝居民的本次建床申请？', {
          confirmButtonText: '是',
          cancelButtonText: '否'
        }).then(({ value }) => {
          resolve(true);
        }).catch(() => {
          reject(false);
        });
      });
    },
    async refuseSubmit (patientArchiveInfoVOData){
      // 提交后刷新患者列表，病选中当前患者，右侧显示该患者信息
      // const selectedItem = JSON.parse(
      //   JSON.stringify(patientArchiveInfoVOData)
      // );

      //     this.emptyFun();
      //     this.htmlShowStyle = true;
      //     this.htmlShow = false;
      //     this.$nextTick(() => {
      //       this.$refs.leftBar.residentApplicListSearch(); 
      //     });
      // return;
      try {
        await this.confirmHandle();
      } catch (error) {
        return;
      }
      let { identificationType, identificationNum, recordId } = this.patientSelected;
      if (!recordId) {
        this.$message.warning("请选择患者");
        return;
      }
      try {
        this.refuseSubmitLoading = true;
        let {data, code, msg} = await refuseHistorySubmit({identificationType, identificationNum, applyId: recordId });
        if (code == 1) {
          this.$message.success("拒绝申请成功");
          this.emptyFun();
          this.htmlShowStyle = true;
          this.htmlShow = false;
          this.$nextTick(() => {
            this.$refs.leftBar.residentApplicListSearch(); 
          });
        } else {
          this.$message.error(msg);
        }
      } catch (error) {
        // this.$message.error("拒绝失败");
      } finally {
        this.refuseSubmitLoading = false;
      }

    },
    // eslint-disable-next-line complexity
    async patientListFunData2(item) {
      let result = await getApplyInfo({
        applyId: item.applyId
      });
      // debugger
      this.recordForm = result.data;
      this.recordForm.maritalStatus = this.recordForm.maritalStatus
        ? this.recordForm.maritalStatus + ""
        : "90";
      this.recordForm.bloodType = this.recordForm.bloodType
        ? this.recordForm.bloodType
        : "5";

      this.recordForm.workUnit = this.recordForm.workUnitName
        ? this.recordForm.workUnitName
        : "";
      // 控制显示到第一页
      // add页面的显示
      this.htmlShow = true;
      this.htmlShowStyle = false;
      // 编辑
      this.eihtmlShow = false;
      this.deleteContactStyle = false;

      if (this.recordForm) {
        for (let obj in this.recordForm) {
          // obj == "nativePlaceCode" || 
          if (obj == "addrCode") {
            let str = [];
            if (this.recordForm[obj]) {
              this.recordForm[obj] = this.recordForm[obj]
                .toString()
                .replace(/\[|]/g, "")
                .split(",");
              for (let i = 0; i < this.recordForm[obj].length; i++) {
                str[i] = parseInt(this.recordForm[obj][i]);
              }
              this.recordForm[obj] = str;
            }
          }
        }
        this.recordForm.isHomeBed = this.recordForm.isHomeBed
          ? this.recordForm.isHomeBed
          : "1";
        // ["2020-09-08 00:00:00", "2020-10-05 23:59:59"]
        if (this.recordForm.treatStartTime && this.recordForm.treatEndTime) {
          this.recordForm.chargeDate2 = [
            new Date(this.recordForm.treatStartTime),
            new Date(this.recordForm.treatEndTime)
          ];
        } else {
          this.recordForm.chargeDate2 = [
            new Date(Date.now()),
            new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          ];
        }

        this.recordForm.headImg = require("@/assets/pojehjdz.jpeg");
        this.recordForm.medicareCard = this.recordForm.patientCode;

        this.recordForm.addrCode = this.recordForm.addrCode.filter(Boolean); // 过滤 NaN
      }

      // 诊断
      if (this.recordForm.diagList) {
        this.zdData = this.recordForm.diagList;

        for (let j = 0; j < this.zdData.length; j++) {
          this.zdData[j].remoteParams1 = {
            keyword: "", //this.diagnosticForm.diagName,
            type: "", //hosType2,
            cwFlag: this.zdData[j].cwFlag
          };
          this.zdData[j].operateType = "2";
        }
      } else {
        this.zdData = [];
      }

      // 联系人
      if (this.recordForm.contactList) {
        this.recordForm.archGuarantorList = this.recordForm.contactList;
        if (this.recordForm.archGuarantorList.length == 0) {
          this.deleteContactStyle = true;
        }
      } else {
        this.recordForm.archGuarantorList = [];
        this.deleteContactStyle = true;
      }

      this.changeDataheaderFun(this.recordForm);
    },
    // eslint-disable-next-line complexity
    patientListFunData(item) {
      this.recordForm = item;
      this.recordForm.maritalStatus = this.recordForm.maritalStatus
        ? this.recordForm.maritalStatus + ""
        : "90";
      this.recordForm.bloodType = this.recordForm.bloodType
        ? this.recordForm.bloodType
        : "5";
      // 控制显示到第一页

      // eslint-disable-next-line no-constant-condition
      // add页面的显示
      this.htmlShow = true;
      this.htmlShowStyle = false;
      // 编辑
      this.eihtmlShow = false;
      this.deleteContactStyle = false;

      if (this.recordForm) {
        for (let obj in this.recordForm) {
          // obj == "nativePlaceCode" || 
          if (obj == "addrCode") {
            let str = [];
            if (this.recordForm[obj]) {
              this.recordForm[obj] = this.recordForm[obj]
                .toString()
                .replace(/\[|]/g, "")
                .split(",");
              for (let i = 0; i < this.recordForm[obj].length; i++) {
                str[i] = parseInt(this.recordForm[obj][i]);
              }
              this.recordForm[obj] = str;
            }
          }
        }
        this.recordForm.isHomeBed = this.recordForm.isHomeBed
          ? this.recordForm.isHomeBed
          : "1";
        // ["2020-09-08 00:00:00", "2020-10-05 23:59:59"]
        this.recordForm.chargeDate2 = [
          new Date(Date.now()),
          new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        ];

        this.recordForm.headImg = require("@/assets/pojehjdz.jpeg");
        this.recordForm.medicareCard = this.recordForm.patientCode;

        let addrCode = this.recordForm.currentAddress
          ? JSON.parse(this.recordForm.currentAddress)
          : "";
        this.recordForm.addrCode = [];
        for (let i = 0; i < addrCode.length; i++) {
          this.recordForm.addrCode.push(Number(addrCode[i]));
        }

        this.recordForm.admissionSdeptId =
          this.recordForm.admissionSdeptId * 1 || "";
      }

      // 诊断
      if (this.recordForm.diagList) {
        this.zdData = this.recordForm.diagList;

        for (let j = 0; j < this.zdData.length; j++) {
          this.zdData[j].remoteParams1 = {
            keyword: "", //this.diagnosticForm.diagName,
            type: "", //hosType2,
            cwFlag: this.zdData[j].cwFlag
          };
          this.zdData[j].operateType = "2";
        }
      } else {
        this.zdData = [];
      }
      // 联系人
      if (this.recordForm.contactList) {
        this.recordForm.archGuarantorList = this.recordForm.contactList;
        if (this.recordForm.archGuarantorList.length == 0) {
          this.deleteContactStyle = true;
        }
      } else {
        this.recordForm.archGuarantorList = [];
        this.deleteContactStyle = false;
      }

      this.changeDataheaderFun(this.recordForm);
    },
    // eslint-disable-next-line complexity
    chooseCallBack (resultData){
      // debugger
      this.recordForm = resultData;
      this.recordForm.maritalStatus = this.recordForm.maritalStatus
        ? this.recordForm.maritalStatus + ""
        : "90";
      this.recordForm.bloodType = this.recordForm.bloodType
        ? this.recordForm.bloodType
        : "5";

      this.recordForm.workUnit = this.recordForm.workUnitName
        ? this.recordForm.workUnitName
        : "";
      // 控制显示到第一页
      // add页面的显示
      this.htmlShow = true;
      this.htmlShowStyle = false;
      // 编辑
      this.eihtmlShow = false;
      this.deleteContactStyle = false;

      if (this.recordForm) {
        for (let obj in this.recordForm) {
          // obj == "nativePlaceCode" || 
          if (obj == "addrCode") {
            let str = [];
            if (this.recordForm[obj]) {
              this.recordForm[obj] = this.recordForm[obj]
                .toString()
                .replace(/\[|]/g, "")
                .split(",");
              for (let i = 0; i < this.recordForm[obj].length; i++) {
                str[i] = parseInt(this.recordForm[obj][i]);
              }
              this.recordForm[obj] = str;
            }
          }
        }
        this.recordForm.isHomeBed = this.recordForm.isHomeBed
          ? this.recordForm.isHomeBed
          : "1";


        // ["2020-09-08 00:00:00", "2020-10-05 23:59:59"]
        if (this.recordForm.treatStartTime && this.recordForm.treatEndTime) {
          this.recordForm.chargeDate2 = [
            new Date(this.recordForm.treatStartTime),
            new Date(this.recordForm.treatEndTime)
          ];
        } else {
          this.recordForm.chargeDate2 = [
            new Date(Date.now()),
            new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          ];
        }


        this.recordForm.headImg = require("@/assets/pojehjdz.jpeg");
        this.recordForm.medicareCard = this.recordForm.patientCode;

        this.recordForm.addrCode = this.recordForm.addrCode.filter(Boolean); // 过滤 NaN
      }

      // 诊断
      if (this.recordForm.diagList) {
        this.zdData = this.recordForm.diagList;

        for (let j = 0; j < this.zdData.length; j++) {
          this.zdData[j].remoteParams1 = {
            keyword: "", //this.diagnosticForm.diagName,
            type: "", //hosType2,
            cwFlag: this.zdData[j].cwFlag
          };
          this.zdData[j].operateType = "2";
        }
      } else {
        this.zdData = [];
      }

      // 联系人
      if (this.recordForm.contactList) {
        this.recordForm.archGuarantorList = this.recordForm.contactList;
        if (this.recordForm.archGuarantorList.length == 0) {
          this.deleteContactStyle = true;
        }
      } else {
        this.recordForm.archGuarantorList = [];
        this.deleteContactStyle = true;
      }

      this.changeDataheaderFun(this.recordForm);
    },
    // 居民申请
    async choosePatientFunResid (item){
      this.patientSelected = item;
      // this.recordForm = {
      //   ...this.recordForm,
      //   ...{
      //     pStatus: item.status
      //   }
      // }
      console.log("居民",item);
      let { identificationType, identificationNum, recordId } = item;
      this.mainContentLoading = true;
      try {
        let {data, code, msg } = await getResidentPersionInfo({ identificationType, identificationNum, applyId: recordId });
        if (code == 1) {
          try {
            this.chooseCallBack(data);
          } catch (error) {}
          let { files } = data;
          this.filesData = files;
        } else {
          this.$message.error(msg);
        }
      } catch (error) {
        this.$message.error("居民申请注册报错");
      } finally {
        this.mainContentLoading = false;
      }
      

    },
    choosePatientFun(item) {
      if (item.applyId) {
        this.patientListFunData2(item); // 申请历史
      } else {
        this.patientListFunData(item); //待申请
      }
    },

    // cancelstyle取消新建档案
    cancelstyle(a, dataObj) {
      this.addarchivesStyle = a;

      if (dataObj) {
        //  this.patientListFunData(dataObj);
        this.changeRecPatientData(dataObj.patientArchiveInfoVO);

        this.$nextTick(() => {
          this.$refs.leftBar.directcheckleftbarSearch(
            dataObj.patientArchiveInfoVO.patientCode
          ); // 切换患者列表tab到申请历史上
        });
      }
    },
    // 新建档案
    addnewFun(inputnum, a) {
      this.addarchivesStyle = true;
    },
    // 新建档案
    addnewFile() {
      this.addarchivesStyle = true;
    },
    //切换工具箱
    messageHandler() {},
    //左侧列表转换tab
    // 清空
    emptyFun() {
      // 禁止输入
      this.disableEditing = false;
      for (let obj in this.recordForm) {
        if (obj == "headImg") {
          this.recordForm[obj] = require("@/assets/pojehjdz.jpeg");
        } else {
          this.recordForm[obj] = "";
        }
      }

      this.recordForm.archGuarantorList = [];

      this.zdData = [];
    },
    //提交表单
    // eslint-disable-next-line complexity
    async submit() {
      //保存表单接口接口
      let patientArchiveInfoVOData = deepClone(this.recordForm);

      try {
        let topForm = await this.$refs.contactInformation.submit();
        patientArchiveInfoVOData = {
          ...patientArchiveInfoVOData,
          ...topForm
        };
      } catch (error) {
        return;
      }

      try {
        let { recordForm, zdData } = await this.$refs.bottomForm.submit();

        patientArchiveInfoVOData = {
          ...patientArchiveInfoVOData,
          ...recordForm,
          ...{
            zdData
          }
        };
      } catch (error) {
        console.log("bottomForm 出问题了");
        return;
      }

      // 治疗开始结束时间
      patientArchiveInfoVOData["treatStartTime"] =
        (patientArchiveInfoVOData.chargeDate2 &&
          new Date(patientArchiveInfoVOData.chargeDate2[0]).format(
            "yyyy-MM-dd"
          )) ||
        "";
      patientArchiveInfoVOData["treatEndTime"] =
        (patientArchiveInfoVOData.chargeDate2 &&
          new Date(patientArchiveInfoVOData.chargeDate2[1]).format(
            "yyyy-MM-dd"
          )) ||
        "";

      patientArchiveInfoVOData["patientBirthday"] =
        patientArchiveInfoVOData.patientBirthday.substring(0, 10) +
        " " +
        "00:00:00";

      patientArchiveInfoVOData["contactList"] =
        patientArchiveInfoVOData.archGuarantorList;
      patientArchiveInfoVOData["diagList"] = patientArchiveInfoVOData.zdData;

      patientArchiveInfoVOData["workUnitName"] =
        patientArchiveInfoVOData.workUnit;

      delete patientArchiveInfoVOData["chargeDate2"];
      delete patientArchiveInfoVOData["headImg"];

      try {
        this.$showLoading();
        let result = await createBedSubmit(patientArchiveInfoVOData);
        if (result.code == "1") {
          this.$message.success("申请提交成功");
          this.activeNew = 1;
          // 提交后刷新患者列表，病选中当前患者，右侧显示该患者信息
          const selectedItem = JSON.parse(
            JSON.stringify(patientArchiveInfoVOData)
          );
          await this.changeRecPatientData(selectedItem);
          this.$nextTick(() => {
            this.$refs.leftBar.setActiveName("second"); // 切换患者列表tab到申请历史上
            this.$refs.leftBar.finishcheckleftbarSearch(selectedItem); // 切换患者列表tab到历史申请上
            this.$refs.leftBar.directcheckleftbarSearch(null, false); // 切换患者列表tab到申请历史上
          });

          this.emptyFun();
          this.htmlShowStyle = true;
          this.htmlShow = false;
        } else {
          this.$message.error(result.msg || "提交失败");
        }
      } catch (error) {
        console.log(error, "error");
      } finally {
        this.$hideLoading();
      }
    },
    patientDetail() {
      if (this.activeName == "first") {
        this.$nextTick(() => {
          this.$refs.leftBar.directcheckleftbarSearch(); // 切换患者列表tab到申请历史上
        });
      } else if (this.activeName == "second") {
        this.$nextTick(() => {
          this.$refs.leftBar.finishcheckleftbarSearch(); // 切换患者列表tab到申请历史上
        });
      }
    },
    async submitChange() {
      // eslint-disable-next-line complexity
      //保存表单接口接口
      let patientArchiveInfoVOData = {};
      patientArchiveInfoVOData = deepClone(this.recordForm);

      try {
        let topForm = await this.$refs.contactInformation.submit();
        patientArchiveInfoVOData = {
          ...patientArchiveInfoVOData,
          ...topForm
        };
      } catch (error) {
        return;
      }

      try {
        let { recordForm, zdData } = await this.$refs.bottomForm.submit();

        patientArchiveInfoVOData = {
          ...patientArchiveInfoVOData,
          ...recordForm,
          ...{
            zdData
          }
        };
      } catch (error) {
        return;
      }

      // 治疗开始结束时间
      patientArchiveInfoVOData["treatStartTime"] =
        (patientArchiveInfoVOData.chargeDate2 &&
          new Date(patientArchiveInfoVOData.chargeDate2[0]).format(
            "yyyy-MM-dd"
          )) ||
        "";
      patientArchiveInfoVOData["treatEndTime"] =
        (patientArchiveInfoVOData.chargeDate2 &&
          new Date(patientArchiveInfoVOData.chargeDate2[1]).format(
            "yyyy-MM-dd"
          )) ||
        "";

      patientArchiveInfoVOData["patientBirthday"] =
        patientArchiveInfoVOData.patientBirthday.substring(0, 10) +
        " " +
        "00:00:00";

      patientArchiveInfoVOData["contactList"] =
        patientArchiveInfoVOData.archGuarantorList;
      patientArchiveInfoVOData["diagList"] = patientArchiveInfoVOData.zdData;

      patientArchiveInfoVOData["workUnitName"] =
        patientArchiveInfoVOData.workUnit;

      delete patientArchiveInfoVOData["headImg"];
      delete patientArchiveInfoVOData["chargeDate2"];

      // let res = await applyUpdateStatus({applyId:patientArchiveInfoVOData.applyId,applyStatus:'9'});// 1:提交申请 2:入院登记 3:排床 4:病区出院 5:财务出院  9:撤销 99:作废
      patientArchiveInfoVOData.applyStatus = "1";
      try {
        this.$showLoading();
        let result = await putApplySave(patientArchiveInfoVOData);
        if (result.code == "1") {
          this.$message.success("修改成功");
          this.activeNew = 1;
          // 提交后刷新患者列表，病选中当前患者，右侧显示该患者信息
          const selectedItem = JSON.parse(
            JSON.stringify(patientArchiveInfoVOData)
          );
          await this.changeRecPatientData(selectedItem);
          this.$nextTick(() => {
            this.$refs.leftBar.finishcheckleftbarSearch(selectedItem); // 切换患者列表tab到申请历史上
          });

          this.htmlShowStyle = true;
          this.htmlShow = false;
        } else {
          this.$message.error(result.msg || "修改失败");
          this.$nextTick(() => {
            this.$refs.leftBar.finishcheckleftbarSearch(selectedItem); // 切换患者列表tab到申请历史上
            this.$refs.leftBar.directcheckleftbarSearch(); // 切换患者列表tab到申请历史上
          });
        }
      } catch (error) {
        console.log(error, "error");
      } finally {
        this.$hideLoading();
      }
    },
    async submitCancel() {
      let result = await applyUpdateStatus({
        applyId: this.recordForm.applyId,
        applyStatus: "9"
      });
      if (result.code == "1") {
        this.$message.success("撤销成功");
        // 提交后刷新患者列表，病选中当前患者，右侧显示该患者信息
        const selectedItem = JSON.parse(JSON.stringify(this.recordForm));
        this.changeRecPatientData(selectedItem);

        this.$nextTick(() => {
          this.$refs.leftBar.finishcheckleftbarSearch(selectedItem); // 切换患者列表tab到申请历史上
          this.$refs.leftBar.directcheckleftbarSearch(); // 切换患者列表tab到申请历史上
        });
      } else {
        this.$message.error(result.msg || "撤销失败");
      }
    },
    changeDataheaderFun(n) {
      this.detailList = [];
      this.patientInfoShow = {};
      this.patientInfoShow = {
        ...deepClone(n),
        doctorName: n.manageDoctorName,
        nurseName: n.manageNurseName,
        prepayBalance: n.prepayBalance,
        selfPayPrepay: n.selfPayPrepay,
        address: n.addrCode,
        phoneNum: n.mobileNum,
        predictTreatStartTime: n.predictTreatStartTime
          ? n.predictTreatStartTime.split(" ")[0]
          : "",
        predictTreatEndTime: n.predictTreatEndTime
          ? n.predictTreatEndTime.split(" ")[0]
          : ""
      };
      /* if (n.admissionDiag) {
        this.$set(this.detailList, this.detailList.length, {
          name: n.admissionDiag,
          style: {}
        });
      } */
      if (n.allergyName) {
        this.$set(this.detailList, this.detailList.length, {
          name: n.allergyName,
          style: {
            background: "rgba(241, 47, 47, 0.1)",
            borderRadius: "4px",
            display: "inline-block",
            fontSize: "12px",
            fontFamily: "SourceHanSansSC-Regular",
            fontWeight: 400,
            textAlign: "center",
            color: "#ef0f0f",
            margiLeft: "8px",
            paddingTop: "2px",
            paddingLeft: "4px",
            paddingRight: "4px"
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "./components/css/indexCss.scss";
</style>
