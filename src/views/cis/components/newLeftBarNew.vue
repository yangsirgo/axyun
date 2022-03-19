<template>
  <div class="sidebar height100" id="l-c-penetrate-tabs-container">
    <l-sidebar-left>
      <template #top>
        <l-card-title>
          <template #left
            >患者列表</template
          >
          <template #right>
            <el-button plain class="btn" @click="visitTheDepartment">{{
              roomIdName
            }}</el-button>
          </template>
        </l-card-title>
        <el-date-picker
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 100%; margin: 8px 0"
          v-model="form.timeRange"
          type="daterange"
          range-separator="至"
          @change="search"
          :default-time="['00:00:00', '23:59:59']"
          :start-placeholder="datePicker.startPlaceholder"
          :end-placeholder="datePicker.endPlaceholder"
        ></el-date-picker>
        <div class="read-card">
          <l-formt-title class="l-input-wrap-new">
            <el-input
              v-model="form.search"
              placeholder="姓名/手机/证件号/患者编号"
              @keyup.enter.native="sideEvent('query')"
            ></el-input>
            <el-button
              plain
              type="primary"
              size="mini"
              shortbutton
              @click="sideEvent('readCard')"
              >读卡</el-button
            >
          </l-formt-title>
        </div>
        <div class="btns-contain">
          <el-button
            type="primary"
            plain
            class="btn"
            @click="sideEvent('query')"
            >查询</el-button
          >
          <el-button plain class="btn" @click="reset">重置</el-button>
          <el-button plain class="btn" @click="backNo">退号</el-button>
          
        </div>
        <div class="btns-contain">
          <el-button plain class="btn-chan" @click="getConnect"
          >交接查询</el-button
        >
        <el-button plain class="btn-chan" :loading="callLoading" @click="callFun">呼叫</el-button>
        </div>
        
      </template>
      <template #bottom>
        <el-tabs
          class="penetrate-tabs height100 patientsListCls"
          v-model="activeName"
          @tab-click="tabPenetrateClickWrapper"
        >
          <el-tab-pane
            v-for="pItem in tabsList"
            :key="pItem.name"
            :name="pItem.name"
            v-loading="loading"
          >
            <span slot="label" class="label-padding">{{ pItem.label }}</span>
            <l-table
              :showTotal="true"
              :pageSize="pageParams.pageSize"
              :page="pageParams.pageNo"
              :total="pageParams.total || 0"
              :background="false"
              :paginationSmall="true"
              layout="prev,pager,next"
              paginationAlign="center"
              @changeSize="sizeChangePatientList"
            >
              <div
                class="patient-penetrate-container"
                v-if="currentPatientsList.length > 0 && pItem.name === activeName"
              >
                <div class="patient-penetrate-box">
                  <l-patient-info-item
                    v-for="(item, index) in currentPatientsList"
                    :key="'click' + index"
                    :class="{
                      'l-c-penetrate': true,
                      'is-active': currentPenetrate === `${pItem.name}${index}`
                    }"
                    @click.native="chsePtrateWrFunc(pItem.name, index, item)"
                  >
                    <template #top>
                      <div class="patientBar">
                        <div class="patientBar-left">
                          <!-- <span class="code overflowEllipsis" :title="item.appointmentCode">{{item.appointmentCode}}</span> -->
                          <span
                            class="code overflowEllipsis"
                            :title="index + 1"
                            >{{ index + 1 }}</span
                          >
                          <span
                            :title="item.patientName"
                            class="name overflowEllipsis margin-left-4"
                            >{{ item.patientName }}</span
                          >
                          <span
                            :val="item.patientGender"
                            code="GENDER_CODE"
                            v-codeTransform
                            class="gender margin-left-4"
                            v-if="item.patientGender"
                          ></span>
                          <span
                            v-if="item.patientAge"
                            class="gender margin-left-4"
                          >
                            {{
                              isNaN(item.patientAge)
                                ? item.patientAge
                                : item.patientAge + "岁"
                            }}
                          </span>
                          <span v-if="item.firstVisit == 1" class="gender firstVisitColor">【首诊】</span>
                        </div>
                      </div>
                    </template>
                    <template #bottom>
                      <div class="show-patient-detail">
                        <span>预约时间</span>
                        <span class="margin-left-4">{{
                          item.appointmentTime ? item.appointmentTime : "--"
                        }}</span>
                        <span :class="callingCls(item)" v-if="item.callNum !== null && item.callNum != 0  && activeName === 'first'" style="color: black;">（已呼叫）</span>
                      </div>
                      <div class="show-patient-detail" style="margin-top: 4px">
                        <div
                          v-if="item.haveMoney === 0 || item.haveMoney === '0'"
                          class="patient-detail-inner"
                        >
                          <span class="freeClass">免</span>
                          <span
                            v-codeTransform
                            code="FreeRecipeReason"
                            :val="item.freeCode || ''"
                            class="freeClassDiscr overflowEllipsis"
                          ></span>
                        </div>
                        <div class="btnCls">

                          <!-- 清空 -->
                          <clearPatientVisit
                            class="endBtn"
                            :visiId="item.id"
                            :visitCode="item.visitCode"
                            :hosId="item.hosId"
                            @clearSuccess="clearSuccessFunc"
                            v-if="activeName === 'third' || activeName === 'second'"
                          ></clearPatientVisit>
                          <!-- 交接 -->
                          <el-button
                            v-if="activeName === 'second' || activeName === 'third'"
                            class="endBtn"
                            size="mini"
                            @click.stop="changeDoctor(item)"
                            round
                            >交接</el-button
                          >
                          <!-- 结束 -->
                          <endPatientVisit
                            class="endBtn"
                            :visiId="item.id"
                            @endSuccess="endSuccessFunc"
                            v-if="activeName === 'third'"
                            :ref="'endPatientVisit' + item.patientId"
                          ></endPatientVisit>
                        </div>
                      </div>
                    </template>
                  </l-patient-info-item>
                </div>
              </div>
              <div v-else style="text-align: center; margin-top: 20px">
                暂无数据
              </div>
            </l-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </l-sidebar-left>
    <el-dialog
      title="设置诊室"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form v-if="dialogVisible" style="height: 60px; padding: 15px">
        <LFormtTitle label="请选择当前坐诊诊室">
          <el-form-item>
            <el-select
              v-model="roomIdobj.roomId"
              placeholder="请选择"
              @change="deptIdFun"
            >
              <el-option
                v-for="item in departmentInfo"
                :key="item.roomId"
                :label="item.roomName"
                :disabled="item.roomId == ''"
                :value="item.roomId"
              ></el-option>
            </el-select>
          </el-form-item>
        </LFormtTitle>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="visitTheDepartmentSave"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="患者公卫待办事项"
      :visible.sync="patientToDoListVisible"
      width="30%"
    >
      <patientToDoList :toDoList="toDoList"></patientToDoList>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="patientToDoListVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <l-dialog
      :visible.sync="modelVisible"
      width="1200px"
      title="就诊交接"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @confirm="conserve"
      @cancel="huidanClose"
    >
      <template #content>
        <div style="padding: 10px">
          <l-common-search rightAreaWidth="250">
            <template slot="leftCon">
              <l-formt-title label="姓名" style="width: 300px">
                <el-input
                  v-model="pageParamsModel.patientName"
                  placeholder="姓名"
                  @keyup.enter.native="searchConnectList"
                ></el-input>
              </l-formt-title>
            </template>
            <template slot="rightCon">
              <div class="btns-contain">
                <el-button type="primary" @click="searchConnectList"
                  >查询</el-button
                >
              </div>
            </template>
          </l-common-search>

          <l-tables
            :pageSize="pageParamsModel.pageSize"
            :page="pageParamsModel.pageNo"
            :total="pageParamsModel.total"
            :background="false"
            :paginationSmall="true"
            layout="sizes,prev,pager,next,jumper,total"
            :pageSizes="[10, 20, 30, 40]"
            paginationAlign="right"
            :pagerCount="5"
            :singlePageShow="true"
            @changeSize="changeSizeModel"
          >
            <template>
              <el-table
                :data="tableData"
                width="100%"
                height="500"
                stripe
                border
                @selection-change="changePatient"
              >
                <el-table-column
                  type="selection"
                  width="35"
                  align="center"
                ></el-table-column>
                <el-table-column
                  type="index"
                  width="50"
                  align="center"
                ></el-table-column>
                <el-table-column
                  v-for="(item, index) in tableParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :align="item.align || 'left'"
                  :header-align="item.headerAlign || 'left'"
                  :fixed="item.fixed"
                >
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'patientGender'">
                      <span
                        :val="scope.row[item.prop]"
                        code="GENDER_CODE"
                        v-codeTransform
                      ></span>
                    </template>
                    <template v-else>
                      {{ scope.row[item.prop] }}
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </l-tables>
        </div>
      </template>
    </l-dialog>
  </div>
</template>

<script>
import patientToDoList from "./patientToDoList.vue";
// import pendingModule from "@/views/cis/components/modules/pending.vue";
import endPatientVisit from "@/views/cis/components/modules/endPatientVisit.vue";
import clearPatientVisit from "@/views/cis/components/modules/clearPatientVisit.vue";
import { getCisNewPatients, cardReading } from "@/api/cis/visit/visit";
import readCardMixin from "@/mixins/readCard.js";
import { deepClone } from "@/utils/index.js";

import {
  selRoomList,
  selectVisitRoom,
  saveVisitRoom,
  callNew,
  joinRecordList,
  saveJoinRecord,
  recivePatient,
  diagnosedList,
  backNumber
} from "@/api/cis/order/order";
import service from "@/api/cis/settleAccount/index.js";
import appointment from "@/api/appointment/appointment.js";
import { getIMUserID } from "@/api/admin/synUser";
import { mapActions, mapGetters } from "vuex";
import { getQueryStringFromHash } from "@/utils/util.js";
import { getTodoList, getActiveName, cancelSuspend } from "./utils.js";
import cnfDictionaryService from "@/api/wconf/cnfDictionary.js";

export default {
  name: "newLeftBarNew",
  mixins: [readCardMixin],
  data() {
    return {
      intervalTime: 60000,// 轮询间隔
      isAutoPoll: false,// 是否开启轮询
      interval: null, //待诊轮询 计时器
      callLoading: false,
      toDoList: [], //用户代办事项
      patientToDoListVisible: false,
      receivePatientData: {},
      // 坐诊科室  显示隐藏
      dialogVisible: false,
      departmentInfo: [],
      query: "",
      deptLoading: false,
      roomIdobj: {
        roomId: "",
        roomName: ""
      }, //科室的id
      urlPatientId: "",
      // 呼叫传参
      callObj: {
        visitCode: "",
        appointmentId: "",
        roomId: ""
      },
      callStyleId: "",
      roomIdName: "设置诊室",

      patientInfoShow: {},
      showData: {
        finished: [],
        wait: [],
        received: []
      },
      loading: false,
      params: {
        searchValue: "",
        searchReasult: "",
        startDate: new Date().format("yyyy-MM-dd"),
        stopDate: new Date().format("yyyy-MM-dd")
      },
      form: {
        search: "",
        timeRange: [
          new Date().format("yyyy-MM-dd"),
          new Date().format("yyyy-MM-dd")
        ],
        startDate: new Date().format("yyyy-MM-dd"),
        stopDate: new Date().format("yyyy-MM-dd")
      },
      datePicker: {
        //datepicker 的 placeholder
        startPlaceholder: "预约开始日期",
        endPlaceholder: "预约结束日期"
      },
      formParams: [
        // "diagnosisArea",
        // "diagnosisRoom",
        // "channelWay",
        "timeRange",
        "search"
      ],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: ""
      },
      number: "",
      //   listLength: 5,
      currentPatientsList: [],
      tabsList: [
        {
          label: "待诊",
          name: "first"
        },
        {
          // label: "暂挂",
          label: "诊中",
          name: "third"
        },
        {
          label: "结束",
          name: "second"
        }
      ],
      activeName: "first",
      currentPenetrate: "",
      //医生换诊
      modelVisible: false,
      tableData: [],
      tableParams: [
        /* {
            prop: "",
            label: "流水号",
            align: "left",
            headerAlign: "center",
            width: "120",
            fixed: false
          }, */
        {
          prop: "visitCode",
          label: "就诊号码",
          align: "left",
          headerAlign: "center",
          width: "120",
          fixed: false
        },
        {
          prop: "surrenderDoctorName",
          label: "就诊医生",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: false
        },
        {
          prop: "patientName",
          label: "姓名",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: false
        },
        {
          prop: "patientGender",
          label: "性别",
          align: "left",
          headerAlign: "center",
          width: "70",
          fixed: false
        },
        {
          prop: "age",
          label: "年龄",
          align: "left",
          headerAlign: "center",
          width: "70",
          fixed: false
        },
        {
          prop: "regTime",
          label: "挂号时间",
          align: "left",
          headerAlign: "center",
          width: "150",
          fixed: false
        }
        /* {
            prop: "",
            label: "号源类型",
            align: "left",
            headerAlign: "center",
            width: "120",
            fixed: false
          } */
      ],
      currentChangePatient: [],
      pageParamsModel: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        patientName: ""
      }
    };
  },
  components: { patientToDoList,endPatientVisit, clearPatientVisit },
  created() {
    // 选中url 中的patientId的患者
    this.setPatientFromUrl();
    // this.selectVisitRoom();
    this.initSelectVisitRoom();
  },
  mounted() {
    // 第三方 访问门诊
    let visitStatus = getQueryStringFromHash("visitStatus");
    if (visitStatus) {
      this.activeName = getActiveName(visitStatus);
    }
    this.loadData();
    this.selRoomList();
    //获取轮询间隔
    this.getDictionaryInfo();
    // 监听全局事件
    this.$root.eventHub.$on("refresh-wait-patientList", async (activeName, isSubmit) => {
     
      // 重置 分页数据
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: ""
      };

      debugger

     if(!activeName) {
        await this.loadData();
        this.chsePtrateWrapperHandler(this.receivePatientData);
        return
      }
      this.activeName = activeName;

      await this.loadData();
      this.chsePtrateWrapperHandler(this.receivePatientData);
      // if (isSubmit) {
      //   debugger
      //   const refName = 'endPatientVisit' + this.currentPatientsList.find(item => item.patientId === this.receivePatientData.patientId).patientId;
      //   debugger
      //   if (this.$refs[refName] && this.$refs[refName][0]) {
      //     await this.$refs[refName][0].stopVisitAjax();
      //     await this.loadData();
      //     // this.chsePtrateWrapperHandler(this.receivePatientData);
      //   }
      // } else {
      //   await this.loadData();
      //   // this.chsePtrateWrapperHandler(this.receivePatientData);
      // }
    });
  },
  computed: {
    // ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("user", ["role"]),
    // ...mapGetters("base","re
    ...mapGetters("cis", ["activeTabName"]),
    ...mapGetters("base", ["searchAgainKey"])
  },
  watch: {
    activeName:{
      // immediate: true,
      handler(n) {
        if (this.isAutoPoll) {
          this.autoRefreshPatientListWrapper(n);
        }
        //console.log("activeName变化了");
      }
    },
    async searchAgainKey() {
            debugger
       // 重置 分页数据
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: ""
      };

      await this.loadData();
      this.chsePtrateWrapperHandler(this.receivePatientData);
    },
    roomIdobj: {
      handler(n) {
        this.receivePatientData.roomId = this.roomIdobj.roomId;
        this.changeRecPatientData(this.receivePatientData);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      // setReloadKey: "base/changeSearchAgainKey",
      setActiveTabName: "cis/setActiveTabName",
      clearCDSSData: "cdss/clearCDSSData"
    }),
    equar(a = [], b = []) {
      // 判断数组的长度
      if (a.length !== b.length) {
          return false
      } 

      // 循环遍历数组的值进行比较
      for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
              return false
          }
      }
      return true;
    },
    // 获取轮询时间
    async getDictionaryInfo() {
      try {
        let hosId = JSON.parse(localStorage.getItem("pamars")).hosIdNum || JSON.parse(localStorage.getItem("pamars")).hosId; 
        let { code, data } = await cnfDictionaryService.getDictionaryInfo({
          catalogCode: "CIS_OUTAPTIENT_PARAMS",
          dicCode: "CIS_OUTAPTIENT_CIS_OUTAPTIENT_REFRESHP",
          hosId
        });
        if(code === 1) {
          console.log("获取轮询时间", data);
          let { dictionaryValue, recordStatus } = data; 
          this.isAutoPoll = recordStatus == 1;
          if (recordStatus == 1) {
            // 秒 转 毫秒 
            this.intervalTime = Number(dictionaryValue) * 1000 > 60000 ? Number(dictionaryValue) * 1000 : 60000;
            console.log("获取轮询时间", this.intervalTime);
            // 开始轮询
            this.autoRefreshPatientListWrapper(this.activeName);
          }
        }
      } catch (error) {}
    },
    autoRefreshPatientListWrapper (n){
      // console.log("autoRefreshPatientListWrapper::::");
      if (n === "first") {
        this.autoRefreshPatientList();
      } else {
        clearInterval(this.interval);
      }
    },
    // 待诊轮询
    autoRefreshPatientList (){
      clearInterval(this.interval);
       console.log("获取轮询时间", this.intervalTime);
      this.interval = setInterval(async ()=>{
        console.log("请求列表");

        let newPatientList = await this.loadData(true);
        let flag = this.equar(newPatientList.map(item => item.id), this.currentPatientsList.map(item => item.id));
        if (!flag) {
          console.log("刷新列表");
          this.currentPatientsList = deepClone(newPatientList);
        } 
      }, this.intervalTime);
    },
    // zhengyawen患者交接
    changeDoctor(item) {
      this.$confirm("确认交接?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        //交接出去
        try {
          let params = {
            visitCode: item.visitCode,
            patientId: item.patientId,
            patientName: item.patientName,
            ouptDeptId: item.ouptDeptId,
            regTime: item.appointmentTime
          };
          let res = await saveJoinRecord(params);
          if (res.code === 1) {
            this.$message.success(res.msg || "交接成功");
            this.tabPenetrateClickVue();
          }
        } catch (e) {
          console.log(e);
        }
      });
    },
    changeSizeModel(val) {
      this.pageParamsModel.pageNo = val.page;
      this.pageParamsModel.pageSize = val.pageSize;
      this.getConnectList();
    },
    // zhengyawen交接查询
    getConnect() {
      this.modelVisible = true;
      this.pageParamsModel.patientName = "";
      this.currentChangePatient = [];
      this.searchConnectList();
    },
    async searchConnectList() {
      this.pageParamsModel.pageNo = 1;
      await this.getConnectList();
    },
    async getConnectList() {
      this.tableData = [];
      try {
        let params = {
          pageNo: this.pageParamsModel.pageNo,
          pageSize: this.pageParamsModel.pageSize,
          outpDeptId: "",
          patientName: this.pageParamsModel.patientName
        };
        let res = await joinRecordList(params);
        if (res.code === 1) {
          this.tableData = res.data;
          this.pageParamsModel.total = res.total;
        } else {
          this.$message.error(res.msg || "查询失败！");
        }
      } catch (e) {
        console.log(e);
      }
    },
    changePatient(arr) {
      this.currentChangePatient = arr;
    },
    callingCls (item){
      console.log(item, item.currentUserCall);
      return {
        "margin-left-4": true,
        "font-color-blue": item.currentUserCall
      }
    },
    async conserve() {
      if (!this.currentChangePatient.length) {
        this.$message.warning("至少选择一个患者");
        return;
      }
      try {
        let res = await recivePatient(this.currentChangePatient);
        if (res.code === 1) {
          this.$message.success(res.msg || "交接成功");
          this.modelVisible = false;
          this.tabPenetrateClickVue();
        } else {
          this.$message.error(res.msg || "交接失败！");
        }
      } catch (e) {
        console.log(e);
      }
    },
    huidanClose() {
      this.modelVisible = false;
    },

    // 选中url 中的patientId的患者
    setPatientFromUrl() {
      let patientId = getQueryStringFromHash("patientId");

      this.urlPatientId = patientId || "";
    },
    // 呼叫
    callFun() {
      console.log(`this.callStyleId`, this.callStyleId);
      console.log(`this.callObj.appointmentId`, this.callObj.appointmentId);
      if (this.callStyleId == "") {
        this.$confirm("未选择坐诊科室, 选择坐诊科室后可呼叫?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.visitTheDepartment();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消添加坐诊"
            });
          });
      } else {
        if (this.callObj.appointmentId != "") {
          this.call();
        } else {
          this.$message.error("请选择患者！！");
        }
      }
    },

    deptIdFun(a) {
      console.log(a);
      this.roomIdobj.roomId = a;
      this.$emit("roomIdFun", this.roomIdobj.roomId);
      for (let i = 0; i < this.departmentInfo.length; i++) {
        if (a == this.departmentInfo[i].roomId) {
          this.roomIdobj.roomName = this.departmentInfo[i].roomName;
        }
      }
    },

    // 新加坐诊科室
    visitTheDepartment() {
      this.dialogVisible = true;
    },
    visitTheDepartmentSave() {
      this.saveVisitRoom();
      this.dialogVisible = false;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 呼叫功能
    async call() {
      if (this.callLoading)return;
      this.callLoading = true;      
      try {
        this.deptLoading = true;
        this.callObj.roomId = this.roomIdobj.roomId;
        let res = await callNew(this.callObj);
        if (res.code == "1") {
          this.$message.success("呼叫成功");
          // 重置 分页数据
          this.pageParams = {
            pageNo: 1,
            pageSize: 20,
            total: ""
          };

          this.loadData();
        } else {
          this.$message.error(res.msg || "呼叫失败请重新呼叫");
        }
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "呼叫失败请重新呼叫");
      } finally {
        this.deptLoading = false;
        this.callLoading = false;
      }
    },
    // 查询科室 ward
    async selRoomList() {
      try {
        this.deptLoading = true;
        let res = await selRoomList({
          deptId: this.query,
          recordStatus: 1
        });
        this.departmentInfo = [
          {
            roomId: "",
            roomName: "设置诊室"
          }
        ];
        this.departmentInfo = this.departmentInfo.concat(res.data);
        console.log("打印科室", this.departmentInfo);
      } catch (error) {
        console.info(error);

        this.$message.error(error.msg || "查询科室报错");
      } finally {
        this.deptLoading = false;
      }
    },
    // 查询之前时候设置过坐诊
    async selectVisitRoom() {
      try {
        this.deptLoading = true;
        let res = await selectVisitRoom({});
        console.log(res, "查询之前时候设置过坐诊");
        if (res.code == "1") {
          if (res.data) {
            this.roomIdName =
              res.data.roomName == "设置诊室" ? "设置诊室" : res.data.roomName;
            this.callStyleId = res.data.roomId;
            this.roomIdobj.roomId =
              res.data.roomName == "设置诊室" ? "" : res.data.roomId;
          }
        }
      } catch (error) {
        console.info(error);

        this.$message.error(error.msg);
      } finally {
        this.deptLoading = false;
      }
    },
    // 刚开始 可以使用默认科室呼叫患者
    async initSelectVisitRoom() {
      await this.selectVisitRoom();
      await saveVisitRoom(this.roomIdobj);
    },
    // 保存设置坐诊
    async saveVisitRoom() {
      try {
        this.deptLoading = true;
        let res = await saveVisitRoom(this.roomIdobj);
        if (res.code == "1") {
          this.$message.success("设置坐诊成功");
        }
        this.selectVisitRoom();
      } catch (error) {
        this.$message.error(error.msg);
      } finally {
        this.deptLoading = false;
      }
    },
    reset() {
      this.form.timeRange = "";
      this.form.search = "";
      this.search();
    },
    // 列表分页
    sizeChangePatientList(a) {
      this.pageParams.pageNo = a.page;
      this.loadData();
    },
    //子组件抛出的方法
    sideEvent(sideEvent) {
      if (sideEvent === "query") {
        this.search();
      } else if (sideEvent === "readCard") {
        this.readCard();
      }
    },
    /* readCard() {
      let form = this.form;
      // 读卡方法
      let data = {
        cardData: form.search
      };
      this.loading = true;
      cardReading(data)
        .then(res => {
          if (res.data != null && res.data.length > 0) {
            if (res.data[0].recordStatus == 4) {
              //今天，编辑
              if (
                res.data[0].hasOwnProperty("rediagStatus") &&
                res.data[0].rediagStatus == 1
              ) {
                res.data[0].optStr = "回诊F";
                this.showData.received.push(res.data[0]);
              } else {
                res.data[0].optStr = "编辑";
                this.showData.received.push(res.data[0]);
              }
            } else if (res.data[0].recordStatus == 5) {
              res.data[0].optStr = "查看";
            }
            this.choosePenetrateItemWrapper(this.activeName, 0, res.data[0]);
          }
          this.currentPatientsList = res.data || [];
        })
        .catch(error => {
          this.$message.error("获取档案失败，请稍后重试！");
        })
        .finally(() => {
          this.loading = false;
        });
    }, */
    // 查询患者列表
    getPatientCodeListFuc(obj) {
      this.form.search = obj.patientCode;
      this.pageParams.pageNo = 1;
      /* this.patientListByExample({
        patientId: obj.patientId,
        patientCode: obj.patientCode
      }); */
      this.loadData();
    },
    async search() {
      this.urlPatientId = ""; // 重置 urlPatientId 为 空
      let form = this.form;
      if (form.timeRange != "" && form.timeRange != null) {
        form.startDate = form.timeRange[0];
        form.stopDate = form.timeRange[1];
      }

      // 查询方法
      // let data = {
      //   searchValue: form.search
      // };
      // this.params.searchValue = form.search;
      // this.params.searchReasult = "";
      // if (form.search != "" && form.search != null) {
      //   let res = await newSelectPatientBySth(data);
      //   for (let i = 0; i < res.data.length; i++) {
      //     this.params.searchReasult += res.data[i] + ",";
      //   }
      // }

      // this.params.areaId = form.diagnosisArea || ""; //诊区
      // this.params.roomId = form.diagnosisRoom || ""; //诊室
      // this.params.appointmentMode = form.channelWay || ""; //渠道
      if (form.timeRange != "" && form.timeRange != null) {
        this.params.startDate = form.timeRange[0];
        this.params.stopDate = form.timeRange[1];
      } else {
        this.params.startDate = "";
        this.params.stopDate = "";
      }
      // if (form.technicalOffices != null) {
      //   this.params.technicalOffices = form.technicalOffices;
      // }

      // 重置 分页数据
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: ""
      };

      this.loadData();
    },
    tabPenetrateClickWrapper(tab) {
      // 重置 分页数据
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: ""
      };
      this.tabPenetrateClickVue();
    },
    tabPenetrateClickVue() {
      this.pageParams.pageNo = 1;
      this.loadData();
    },
    /* recPatientHandler(row) {
        console.info("======res", row);
        // if (
        //   row.recordStatus == 6 ||
        //   row.recordStatus == 2 ||
        //   row.recordStatus == 3
        // ) {
        //   this.changeRecPatientData(row).then(() => {
        //     this.getIMUserID(row);
        //   });
        // } else if (row.optStr == "编辑" || row.optStr == "回诊") {
        //   this.changeRecPatientData(row);
        //   this.getIMUserID(row);
        // } else if (row.optStr == "查看") {
        //   this.changeRecPatientData(row);
        // }
        this.changeRecPatientData(row);
      }, */
    //获取IM账号
    getIMUserID(data) {
      // 是否为互联网医院挂号
      if (data.isOnline === "1") {
        getIMUserID(data).then(res => {
          let account = res.data;
          // account.userName = "cloudhos_y0001";
          // account.password = "Cloudhos@Y0001";
          window.open(
            "http://127.0.0.1:8182/webdemo/im/login.html?j-account=" +
              account.userName +
              "&j-secret=" +
              account.atype +
              "&j-target=cloudhos_y0211",
            "_blank"
          );
        });
      }
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
    // 暂挂成功回调
    async endSuccessFunc() {
      // await this.changeRecPatientData({});
      // 重置 分页数据
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: ""
      };
      await this.loadData();

    },
    // 清空成功回调
    async clearSuccessFunc() {
      // await this.changeRecPatientData({});
      console.log("清空成功回调");
      this.activeName = "first";

      // 重置 分页数据
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: ""
      };

      await this.loadData();

      // 清空患者的选中  patientId: 1, appointmentId: 1  对诊断不能刷新的修复
      this.changeRecPatientData({patientId: 1, appointmentId: 1});

    },
    // 外部调用  选中患者
    chsePtrateWrapperHandler (item){
      // let item = this.receivePatientData;
      // console.log("visitCode", item.visitCode);
      // console.log("visitCode", this.currentPatientsList);
      let findPatient = this.currentPatientsList.find(sItem => sItem.visitCode == item.visitCode);
      // console.log("findPatient", findPatient);
      if (!findPatient) return;
      // 选中患者
      this.choosePenetrateItemWrapper(
        this.activeName,
        this.currentPatientsList.findIndex(sItem => sItem.visitCode == item.visitCode),
        findPatient
      );

      // console.log("完成了患者的选中重轰炸");
    },
    async chsePtrateWrFunc(name, index, item) {
      //暂挂 点击患者 取消暂挂
      // if (this.activeName === "third") {
      //   try {
      //     if (item.pendingLoading) return;
      //     this.$set(item, "pendingLoading", true);
      //     await cancelSuspend(item.id);
      //     this.$delete(item, "pendingLoading", false);
      //     this.activeName = "second";
      //     await this.loadData();
      //     // 选中患者
      //     this.choosePenetrateItemWrapper(
      //       this.activeName,
      //       this.currentPatientsList.findIndex(sItem => sItem.id == item.id),
      //       this.currentPatientsList.find(sItem => sItem.id == item.id)
      //     );
      //   } catch (error) {
      //     this.$delete(item, "pendingLoading", false);
      //   }
      // } else {
        // 正常接诊
        this.choosePenetrateItemWrapper(name, index, item);
      // }
    },
    async choosePenetrateItemWrapper(name, index, item) {
      console.log(`name`, name);
      console.log(`index`, index);
      console.log(`item`, item);
      console.log(`this.receivePatientData`, this.receivePatientData);
      if (
        this.receivePatientData.patientId &&
        this.receivePatientData.patientId !== item.patientId
      ) {
        this.clearCDSSData();
      }

      this.callObj = {
        visitCode: item.visitCode,
        appointmentId: item.appointmentId
      };
      this.currentPenetrate = `${name}${index}`;

      item.roomId = this.roomIdobj.roomId;
      let visitCodeOld = this.receivePatientData.visitCode;
      this.changeRecPatientData({
        ...item,
        moduleName: "cisOne"
      });
      this.receivePatientData = item;
      if (visitCodeOld === item.visitCode) {
        return
      }
      // this.receivePatientData = item;

      // this.changeRecPatientData(this.receivePatientData);

      // 查询患者代办信息
      let ajaxData = {
        identificationName: item.identificationName,
        identificationType: item.identificationType,
        identificationNum: item.identificationNum
      };
      try {
        let result = await getTodoList(ajaxData);
        this.patientToDoListVisible = true;
        this.toDoList = result;
      } catch (error) {}
    },
    async loadData(isAutoPoll = false) {


      if (!isAutoPoll) {
        // this.currentPatientsList = [];
        this.loading = true;
      }


      //预约时间格式处理
      let startDate = this.params.startDate;
      startDate = startDate ? startDate + " 00:00:00" : "";

      let stopDate = this.params.stopDate;
      stopDate = stopDate ? stopDate + " 23:59:59" : "";

      let condition = this.form.search
        ? this.form.search.replace(/\s*/g, "")
        : "";

      let params = {
        patientId: this.urlPatientId,
        patientName: condition,
        startDate: this.params.hasOwnProperty("startDate") ? startDate : "",
        stopDate: this.params.hasOwnProperty("stopDate") ? stopDate : "",
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      };

      //待诊1 诊中2 结束3
      switch (this.activeName) {
        case "first":
          params.flag = "1";
          break;
        case "second": // 结束
          params.flag = "2";
          // params.suspendFlag = "0"; // 暂挂入参
          params.status = "2,4";
          break;
        case "third": // 诊中
          params.flag = "3";
          // params.suspendFlag = "1"; // 暂挂入参
          params.status = "1";
          break;
      }
      // eslint-disable-next-line complexity
      return new Promise(async (resolve, reject) => {
        try {
          let res;
          if (params.flag == "2" || params.flag == "3") {
            //已诊患者列表迁出专门的接口
            this.$delete(params, "flag");
            try {
              res = await diagnosedList(params, false);
            } catch (error) {
              res = {
                data: []
              }
            }
            
            // res = await getCisNewPatients(params, false);
          } else {
            res = await getCisNewPatients(params, false);
          }

         let resultData = res.data;
          this.pageParams.total = res.total;
          for (let i = 0; i < resultData.length; i++) {
            //生日转年龄
            resultData[i].age =
              resultData[i].hasOwnProperty("birthDate") &&
              resultData[i].birthDate != "" &&
              resultData[i].birthDate != null
                ? this.jsGetAge(resultData[i].birthDate.substring(0, 10))
                : "";
            resultData[i].appointmentTime =
              resultData[i].appointmentTime || resultData[i].regTime;
            resultData[i].activeName = this.activeName;
          }

          if (!isAutoPoll) {
            this.currentPatientsList = deepClone(resultData);
            this.currentPenetrate = "";
          }


          // url 携带 patientId
          if (this.urlPatientId) {
            this.choosePenetrateItemWrapper(this.activeName, 0, resultData[0]);
          }
          // 判断是否清空 vuex 数据
          // let targetRow = resultData.find(item => {
          //   return item.patientId === this.receivePatientData.patientId;
          // });

          // console.log(
          //   "+++++++++++++++++++++++++++++????",
          //   this.receivePatientData
          // );

          //   this.dataDistribution();

          // if (!targetRow) {
          //   // 如果没有清空 vuex 数据
          //   // 门急诊 病历处方下的三级模块 不需要切换患者为默认值
          //   if (
          //     this.$router.currentRoute.path.indexOf("/cisOne/cisThree") === -1
          //   ) {
          //     // 20200529 ywl bug30047 要求改为 未在病人列表匹配到该病人，仍然要显示该患者信息，不能清除
          //     // this.changeRecPatientData({});
          //   }
          // } else {
          //   // console.log("targetRow.patientName:::", targetRow.patientName);
          //   // console.log("targetRow:::", targetRow);

          //   this.$nextTick(() => {
          //     // this.currentPenetrate = `${this.activeName}0`;
          //     // this.changeRecPatientData(targetRow)
          //     // this.recPatientHandler(targetRow);
          //   });
          // }

          this.setActiveTabName(this.activeName);

          // resolve(true);
          resolve(resultData);
          // if (this.activeName == "third") {
          //   this.currentPatientsList = resultData.filter(item => item.suspendFlag == 1);
          // } else if (this.activeName == "second") {
          //   this.currentPatientsList = resultData.filter(item => item.suspendFlag == 0);
          // }
        } catch (e) {
          reject(false);
          console.log(e, "error");
        } finally {
          this.loading = false;
        }
      });
    },
    // 退号
    backNo() {
      if(!this.receivePatientData.activeName) {
        return;
      }
      if(this.receivePatientData.activeName !== "first") {
        this.$alert("患者不是'待诊'状态，不能直接退号。", '提示', {
          confirmButtonText: '确定'
        });
        return;
      }
      if(this.receivePatientData.haveMoney !== 0 && this.receivePatientData.haveMoney !== '0') {
        if(this.receivePatientData.freeCode !== '99') {
            this.$alert("患者已交挂号费，请前往窗口退号。", '提示', {
            confirmButtonText: '确定'
          });
          return;
        }
      }
      if(this.receivePatientData.activeName && this.receivePatientData.activeName === "first") {
        this.$confirm("'退号'后患者将不可恢复, 请确认是否退号?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          // 结算
            await this.cancelSettlement();
            this.receivePatientData = {patientId:111};// 增加 patientId 清空顶部患者信息栏信息
            this.changeRecPatientData(this.receivePatientData);
          /* let params = {
            patientId: this.receivePatientData.patientId,
            patientName: this.receivePatientData.patientName,
            flag: "1",
            appointmentId: this.receivePatientData.appointmentId,
            channel: this.receivePatientData.appointmentChannel
          };
          let res = await backNumber(params);
          if(res.code === 1) {
            // 刷新当前列表
            this.loadData();
          } else {
            this.$message.error(res.msg || "退号失败");
          } */
        });
      }
    },
    // 撤销结算
    async cancelSettlement() {
      if(!this.receivePatientData.tradeId) {
        return;
      }
      this.$showLoading();
      try {
        let res = await service.refundCancelSettlement(this.receivePatientData.tradeId);
        if (res.code === 1) {
          this.$message.success("退号成功!");

          // 重置 分页数据
          this.pageParams = {
            pageNo: 1,
            pageSize: 20,
            total: ""
          };

          this.loadData();
          // 预结算
          await this.getSettlement();
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {}finally{
        this.$hideLoading();
      }
    },
    // 预结算
    async getSettlement() {
      if(!this.receivePatientData.tradeId) {
        return;
      }
      try {
        let res = await service.refundPreSettlement(this.receivePatientData.tradeId);
        if (res.code === 1) {
          await this.returnPremium(res.data);
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        
      }  
    },
    // 退费结算
    async returnPremium(info) {
      let params = {
        tradeId: info.settleTradeId,
        appCode: info.appCode || ""
      };
      try {
        let res = await appointment.settlementNew(params);
        if (res.code === 1) {
          // this.$message.success("退费成功!");
        } else {
          this.$message.error(res.msg || "退费结算失败，请在退费界面进行退费操作!");
        }
      } catch (error) {
        
      }
    }
  },
  beforeDestroy() {
    this.$root.eventHub.$off("refresh-wait-patientList");
    clearInterval(this.interval);
  }
};
</script>

<style scoped lang="scss">
.sidebar {
  position: relative;
  padding: $l-padding-default-4;
  padding-top: 8px;
  /deep/ .el-select--medium {
    width: 100%;
  }
  .l-input-wrap-new {
    margin-bottom: 0px;
  }

  .read-card {
    margin-bottom: $l-margin-default-4;
    width: 100%;

    /deep/ .el-input {
      width: calc(100% - 56px) !important;
    }

    /deep/ .el-button--mini {
      margin-left: $l-margin-default-4;
    }
  }

  .btns-contain {
    display: flex;
    margin-bottom: $l-margin-default-4;
    justify-content: space-between;

    .btn {
      width: 100px;
    }
  }
  .btn-chan {
    margin-bottom: $l-margin-default-4;
    width: calc(50% - 4px);
  }

  .patientBar {
    display: flex;
    align-items: center;

    .patientBar-left {
      flex: 1;
      width: 0;
      font-size: 0;

      > span {
        font-size: 14px;
      }

      > .code {
        font-weight: 700;
        text-align: center;
        color: #f05a23;
        max-width: 24px;
        display: inline-block;
        vertical-align: top;
      }

      .endBtn {
        float: right;
        top: calc(-100% + 3px);
        right: -26px;
        position: relative;
      }

      > .name {
        max-width: 42px;
        display: inline-block;
        vertical-align: top;
      }
    }
  }

  .patient-penetrate-box {
    margin-top: 8px;
    height: calc(100% - 8px);
    overflow: hidden;
    overflow-y: auto;

    .is-actiive {
      > .code {
        font-weight: 700;
        text-align: center;
        color: #f05a23;
      }

      > .name {
        font-weight: 400;
        text-align: center;
        color: #ffffff;
      }

      > .gender {
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        opacity: 0.8;
      }
    }
  }

  .l-c-penetrate {
    &.is-active {
      .code {
        font-weight: 700;
        text-align: center;
        color: #f05a23;
      }

      .name {
        font-weight: 400;
        text-align: center;
        color: #ffffff;
      }

      .gender {
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        opacity: 0.8;
      }

      .endBtn {
        // right: -32px;
      }
    }

    .show-patient-detail {
      font-size: 12px;
      color: #666c70;
      display: flex;
      .patient-detail-inner {
        font-size: 0;
        display: flex;
        align-items: center;
        .freeClassDiscr {
          font-size: 12px;
          max-width: 40px;
          flex: 1;
        }
      }
      .freeClass {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: rgba(251, 165, 64, 0.15);
        border-radius: 4px;
        font-size: 12px;
        font-family: SourceHanSansSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #e48413;
        line-height: 20px;
        margin-right: 4px;
      }
      .btnCls {
        flex: 1;
        text-align: right;
        font-size: 0;
      }
      .font-color-blue {
        color: blue !important;
      }
    }
  }

  .has-penetrate {
    position: relative;
    z-index: 5;

    &.is-active {
      border-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .l-c-penetrate-clone {
    position: absolute;
    right: $l-layout-space-max-;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    z-index: 4;

    .top,
    .bottom {
      * {
        opacity: 0;
      }
    }
  }

  .tooltip-content {
    line-height: $l-height-common-2;
    font-size: $l-font-size;
  }
}

.margin-left-4 {
  margin-left: 4px;
}

.overflowEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.patientsListCls {
  /deep/.el-tabs__item {
    padding: 0 2px !important;
  }
}

.firstVisitColor {
  color: blue;
}
</style>
