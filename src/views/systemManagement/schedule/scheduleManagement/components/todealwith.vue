<template>
  <div class="width100 height100 todealwith-bg">
    <el-col class="height100 width100">
      <el-col :span="8" class="height100">
        <el-card class="height100 width100 padding-card">
          <el-col class="padding-style">
            <el-col :span="12">停诊班次已预约号源处理</el-col>
            <el-col :span="4"><i class="el-icon-refresh refreshFun-text" @click="refreshFun"></i></el-col>
            <el-col :span="8">已选中：{{scheduleIdsData.length}}</el-col>
          </el-col>
          <el-col class="padding-style" style="height: calc(100% - 100px)">
            <el-table ref="multipleTableLeft" :data="tableData" tooltip-effect="dark" style="width: 100%;height: 100%;"
              @selection-change="handleSelectionChangeleftFun">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column label="序号" width="50" type="index"></el-table-column>
              <el-table-column prop="patientName" label="患者姓名" width="120"></el-table-column>
              <el-table-column prop="appointmentTime" label="时间" show-overflow-tooltip></el-table-column>
              <el-table-column prop="phoneNum" label="联系方式" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>

          <el-col class="todealwith-btn-style">
            <el-button type="primary" @click='toggleSelection()'>取消预约</el-button>
          </el-col>

        </el-card>
      </el-col>
      <el-col :span="16" class="height100">
        <el-card class="height100 width100 padding-card">
          <el-row class="todealwith-r padding-style">
            <el-col class="padding-style-a">
              <el-radio v-model="reApptSchedule.dealModeCode" label="1" class="todealwith-top-font">重预约现有的排班</el-radio>
            </el-col>
            <el-col :span="24">
              <el-col :span="5" class="margin-right-style">
                <LFormtTitle label="诊疗类型">
                  <l-value-domain clearable style="width: 100%" :value.sync="queryConditions.diagTreatType" remoteUrl="/appointment/diagTreatType/selectDiagTreatTypePO?recordStatus=1"
                    type="select" remoteShowKey="diagTreatTypeName" remoteValueKey="diagTreatTypeCode" @change="oldDiagTreatTypeChange"
                    placeholder></l-value-domain>
                </LFormtTitle>
              </el-col>
              <el-col :span="5" class="margin-right-style">
                <LFormtTitle label="科室">
                  <el-select v-model="queryConditions.outpDeptId" filterable placeholder="请输入科室名称"
                    :remote-method="selectAllDept" :loading="selLoading" @change="oldDeptChangeScrh" clearable>
                    <el-option v-for="item in options" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span="5" class="margin-right-style">
                <LFormtTitle label="医生">
                  <el-select v-model="queryConditions.doctorId" filterable remote reserve-keyword placeholder="请输入医生名称"
                    :remote-method="selectAllUser" :loading="selLoading" @change="doctorIdFun" clearable>
                    <el-option v-for="item in optionsDoctor" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </LFormtTitle>
              </el-col>
              <el-col :span='6' class="margin-right-style">
                <l-formt-title label="日期">
                  <el-date-picker v-model="value1" :picker-options="expireTimeOption" type="daterange" :default-time="['00:00:00', '23:59:59']"
                    @change='datePicker' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                    value-format="yyyy-MM-dd" format="yyyy-MM-dd">
                  </el-date-picker>
                </l-formt-title>
              </el-col>
              <el-col :span="1">
                <el-button type="primary" @click="theQuery">查询</el-button>
              </el-col>
            </el-col>
          </el-row>

          <el-row style="height: calc(100% - 250px);" class="padding-style">
            <el-table ref="multipleTable" :data="tableDataRight" tooltip-effect="dark" style="width: 100%; height: 100%;"
              @row-click="changeRight" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" :row-style="selectedHighlight">
              <!-- <el-table-column label="序号" width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column> -->
              <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.recordStatus=='1'">发布</span>
                  <span v-else-if="scope.row.recordStatus=='2'">暂存</span>
                  <span v-else-if="scope.row.recordStatus=='5'">停诊</span>
                  <span v-else-if="scope.row.recordStatus=='3'">驳回</span>
                  <span v-else-if="scope.row.recordStatus=='4'">审核</span>
                </template>
              </el-table-column>
              <el-table-column prop="apptDept" label="门诊科室" show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <span tableName="appt_dict_value" :conditionMap="{dict_item_code: 'A0003',dict_code: scope.row.apptDept || ''}"
                    columns="DICT_NAME" v-tableTransform></span> -->
                    <span>{{scope.row.ouptDeptName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="诊疗类型" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span tableName="appt_diag_treat_type" :conditionMap="{DIAG_TREAT_TYPE_CODE: scope.row.diagTreatType || ''}"
                    columns="DIAG_TREAT_TYPE_NAME" v-tableTransform></span>
                </template>


              </el-table-column>
              <el-table-column prop="doctorId" label="医师" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span tableName="sys_user" :conditionMap="{ID:scope.row.doctorId || ''}" columns="NAME"
                    v-tableTransform></span>
                </template>
              </el-table-column>
              <el-table-column prop="dutyStartTime" label="日期" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.dutyStartTime.substring(0, 10)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="classesId" label="班次" show-overflow-tooltip>

                <template slot-scope="scope">
                  <span tableName="appt_class" :conditionMap="{CLASS_ID: scope.row.classesId || ''}" columns="CLASS_NAME"
                    v-tableTransform></span>
                </template>
              </el-table-column>
              <el-table-column prop="dutyStartTime" label="开始时间" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.dutyStartTime.substring(11,16)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="dutyStopTime" label="结束时间" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.dutyStopTime.substring(11,16)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="allUsableNum" label="号源数" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.allUsedNum + scope.row.allUsableNum}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="allUsableNum" label="剩余号源" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-row>
          <el-col class="padding-style-b">
            <el-radio v-model="reApptSchedule.dealModeCode" label="2" class="todealwith-top-font">重新预约到新增排班 <span>(确认后将自动审核和发布此条排班记录,并将原停诊班次所选的未取消号源重预约到该新增班次)</span></el-radio>
          </el-col>
          <el-col class="padding-style">
            <el-col :span="6" class="margin-right-style">
              <LFormtTitle label="新排班出诊科室">
                <el-select v-model="deptId" filterable placeholder="请输入科室名称" :remote-method="selectAllDept"
                  :loading="selLoading" @change="newDeptChange" clearable>
                  <el-option v-for="item in options" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="6" class="margin-right-style">
              <LFormtTitle label="新排班出诊医生">
                <!-- <l-value-domain  clearable :remoteUrl="'/appointment/doctorSchedule/getDoctorInfo?deptId='+deptId"
                  type="select" :value.sync="targetIdA" remoteShowKey="uname" remoteValueKey="uid"
                  placeholder style="width:100%" @change="newDocChange"></l-value-domain> -->
                <!--  <l-value-domain  clearable :remoteUrl="'/appointment/doctorSchedule/getDoctorInfo?deptId='+deptId"
                    type="select" :value.sync="targetIdA" remoteShowKey="name" remoteValueKey="id" placeholder
                    style="width:100%"></l-value-domain> -->
                <el-select v-model="targetIdA" filterable remote reserve-keyword placeholder="请输入医生名称"
                  :remote-method="getDoctorInfo" @focus="getDoctorInfo('')" :loading="selLoading" @change="newDocChange" clearable>
                  <el-option v-for="item in newoptionsDoctor" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </LFormtTitle>
            </el-col>
          </el-col>
          <el-col class="padding-style todealwith-btn-style">
            <el-button type="primary" @click="save">确认</el-button>
            <el-button type="" class="margin-right-style" @click='canFun'>取消</el-button>
          </el-col>
        </el-card>
      </el-col>
    </el-col>

  </div>
</template>

<script>
  import scheManagement from "@/api/schedule/scheduleManagement.js";
  import {
  getDeptDoctorList,
  nurseList,
  bedList,
  canBeUseDoctorAndNurseList2,
  getApplyInfo,
} from "@/api/ipnw/etHospital.js";
import { getIsTenant, getPamars } from "@/utils/auth";
  import service1 from "@/api/systemManagement/receipt/receipt";

  export default {
    name: "scheduleRelease",
    components: {},
    props: ['scheduleIds'],
    data() {
      return {
        // 不可以选择之前的时间
        expireTimeOption: {
          disabledDate(date) {
            return date.getTime() <= Date.now() - 86400000;
          }
        },
        // 临时
        deptId: '', //科室的id
        value1: [],
        doctorId: '',
        //查询条件
        queryConditions: {
          startDate: "", // 开始时间
          stopDate: "", // 结束时间
          outpDeptId: "", //科室ID
          diagTreatType: "", // 诊疗类型code
          doctorId: "" // 医生姓名
        },
        scheduleIdRight: '',
        // 左侧的查询条件
        queryConditionsLeft: {
          scheduleSerialId: '', // 排班ID
          recordStatus: "1", // 预约状态 传 1 写死
        },
        // 保存提交的参数
        reApptSchedule: {
          originalScheduleId: '', // 原始排班ID
          originalApptIds: '', // 选中的预约ID集合
          dealModeCode: '', // code  // 0.取消 1.重预约到现有排班 2 重预约到新排班
          targetId: '', // 目标ID // dealModeCode:0, 该值为null  1.该值为scheduleId(弹窗中选中的排班ID)  2.改值为doctorId
        },
        // 新排班的医生
        targetIdA:'',
        // 选中行的样式
        getIndex:'',


        selLoading: false,
        options: [], // 查询科室缓存
        optionsDoctor: [], //医生的的缓存
        newoptionsDoctor: [], //新医生的缓存
        scheduleIdsData: [], //选中父排班的id数组;
        // 禁止

        // 左侧列表的数据
        tableData: [],
        tableDataRight: [],
        hosId: "",
      };
    },
    async created() {
      this.queryConditions.startDate = this.timeDefault + " 00:00:00";
      this.queryConditions.stopDate = this.timeDefault + " 23:59:59";
      this.value1[0] = this.queryConditions.startDate;
      this.value1[1] = this.queryConditions.stopDate;
      await this.selectAllDept();
      this.selectAllUser();
      this.getDoctorInfo(this.deptId);
      this.getScheduleByApptParam(this.queryConditions)
    },
    computed: {
      timeDefault() {
        var date = new Date();
        var s1 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate());
        return s1;
      },
    },
    mounted() {
      this.hosId = JSON.parse(getPamars()).hosId;
    },
    methods: {
      // 刷新左边
      refreshFun(){
        this.selectApptList(this.queryConditionsLeft);
      },
      // 点击选中一行变色
      tableRowClassName ({row, rowIndex}) {
             //把每一行的索引放进row
           row.index = rowIndex;
          },
          selectedHighlight({row, rowIndex}) {
               if ((this.getIndex) === rowIndex ) {
                  return {
                "background-color": "#CAE1FF"
             };
           }
          },
      // 取消保存
      canFun(){
        this.$emit("toDealWithStyleFun",false);
      },
      // 提交保存
      async save() {
        // 保存提交的参数
        // reApptSchedule:{
        //  originalScheduleId:'',  // 原始排班ID
        //  originalApptIds:'', // 选中的预约ID集合
        //  dealModeCode:'',  // code  // 0.取消 1.重预约到现有排班 2 重预约到新排班
        //  targetId:'', // 目标ID // dealModeCode:0, 该值为null  1.该值为scheduleId(弹窗中选中的排班ID)  2.改值为doctorId
        // },
        this.reApptSchedule.originalScheduleId = this.queryConditionsLeft.scheduleSerialId;
        this.reApptSchedule.originalApptIds = this.scheduleIdsData;
        if (this.reApptSchedule.dealModeCode) {
          if (this.reApptSchedule.dealModeCode == 0) {
            this.reApptSchedule.targetId = null;
          } else if (this.reApptSchedule.dealModeCode == 1) {
            this.reApptSchedule.ouptDeptId = this.queryConditions.outpDeptId;
            this.reApptSchedule.targetId = this.scheduleIdRight;
          } else {
            if(!this.deptId) {
              this.$message.warning('请选择新排班出诊科室！');
              return;
            }
            if(!this.targetIdA) {
              this.$message.warning('请选择新排班出诊医生！');
              return;
            }
            this.reApptSchedule.ouptDeptId = this.deptId;
            this.reApptSchedule.targetId = this.targetIdA;
          }
        } else {
          this.$message.warning('请选择：1.重预约到现有排班，还是 2 重预约到新排班');
          return;
        }

        console.log(this.reApptSchedule, '提交的参数');
        try {
          this.selLoading = true;
          let res = await scheManagement.reApptSchedule(this.reApptSchedule);
          this.reApptSchedule.targetId = '';
          this.selLoading = false;
          if(res.code == '1'){
            this.$message.success("修改成功");
            this.$emit("toDealWithStyleFun",false);
          }else{
            this.$message.error(res.msg || "保存失败");
          }
        } catch (error) {
          this.selLoading = false;
          this.reApptSchedule.targetId = '';
          console.log(error)
          // this.$emit("toDealWithStyleFun",false);
          // this.$message.error(error.msg || "保存失败");
        }

      },
      // 右侧选择一行获取id
      changeRight(row) {
        console.log(row);
         this.getIndex=row.index;
        this.scheduleIdRight = row.scheduleId;
        this.reApptSchedule.dealModeCode = '1';
      },
      // 取消选择
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTableLeft.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTableLeft.clearSelection();
        }
        // 处理保存数据
        this.reApptSchedule.dealModeCode = 0;
      },
      // 左侧的选中
      handleSelectionChangeleftFun(row) {
        this.scheduleIdsData = [];
        for (let i = 0; i < row.length; i++) {
          this.scheduleIdsData.push(row[i].appointmentId);
        }
        console.log(row);
        console.log(this.scheduleIdsData);
      },
      // diagTreatTypeChange选择诊疗类型
      oldDiagTreatTypeChange(val) {
        console.log(val)
      },
      // 切换右侧查询医生
      doctorIdFun(val) {
        console.log(val)
      },
      // 切换查询的科室
      oldDeptChangeScrh(val) {
        console.log(val, "切换查询的科室");
      },
      // 新排班切换科室
      newDeptChange(val) {
        console.log(val, "新排班切换查询的科室");
        this.reApptSchedule.dealModeCode = '2';
         this.deptId = val;
        this.getDoctorInfo(val);

      },
      // 新切换医生
      newDocChange(col) {
        this.targetIdA = col;
        this.reApptSchedule.dealModeCode = '2';
      },
      //切换时间
      datePicker() {
        console.log(this.value1);
        this.queryConditions.startDate = this.value1 && this.value1.length ?
          this.value1[0] + " 00:00:00" :
          "";
        this.queryConditions.stopDate = this.value1 && this.value1.length ?
          this.value1[1] + " 23:59:59" :
          "";
        console.log(this.queryConditions);
      },

      // 查询右侧排班操作
      theQuery() {
        console.log(this.queryConditions, '右侧查询传值');
        this.getScheduleByApptParam(this.queryConditions)
      },

      // 左侧查询列表  selectApptList
      async selectApptList(val) {
        try {
          this.selLoading = true;
          let res = await scheManagement.selectApptList(val);
          this.tableData = res.data;
          this.selLoading = false;
        } catch (error) {
          this.selLoading = false;
          this.$message.error(error.msg || "查询科室失败");
        }
      },
      // 右侧查询排班
      async getScheduleByApptParam(val) {
        try {
          this.selLoading = true;
          let res = await scheManagement.getScheduleByApptParam(val);
          this.tableDataRight = res.data;
          this.selLoading = false;
        } catch (error) {
          this.selLoading = false;
          this.$message.error(error.msg || "查询科室失败");
        }
      },
      // // 筛查医生
      // async selectAllUserFirst(val) {
      //   this.optionsDoctor = [];
      //   try {
      //     this.selLoading = true;
      //     let res = await service1.getAllUser({
      //       userName: val || ""
      //     });
      //     this.newoptionsDoctor = res.data;
      //     console.log(this.newoptionsDoctor, "newoptionsDoctornewoptionsDoctornewoptionsDoctornewoptionsDoctor")
      //     this.selLoading = false;
      //   } catch (error) {
      //     this.selLoading = false;
      //     this.$message.error(error.msg || "搜索用户失败");
      //   }
      // },
      // 查询医生
      async selectAllUser(val) {
        this.optionsDoctor = [];
        try {
          this.selLoading = true;
          // let res = await service1.getAllUser({
          //   userName: val || ""
          // });
          let res = await canBeUseDoctorAndNurseList2({
            // hosId:this.hosId,
            workType:'1',
            userSearchValue: val || "",
          });
          this.optionsDoctor = res.data;
          this.selLoading = false;
        } catch (error) {
          this.selLoading = false;
          this.$message.error(error.msg || "搜索用户失败");
        }
      },
      // 查询排班医生
      async getDoctorInfo(val) {
        if(val === "" || val === undefined) {
          return;
        }
        try {
          this.selLoading = true;
          // let res = await canBeUseDoctorAndNurseList2({
          //   // hosId:this.hosId,
          //   workType:'1',
          //   userSearchValue: val || "",
          // });
          let res = await scheManagement.getDoctorInfo({
            deptId: val || ""
          });
          this.newoptionsDoctor = res.data;
          this.selLoading = false;
        } catch (error) {
          this.selLoading = false;
          // this.$message.error(error.msg || "查询新排班医生失败");
        }
      },
      // 查询科室
      async selectAllDept(val) {
        try {
          this.selLoading = true;
          let res = await scheManagement.queryDept({
            deptName: ""
          });
          this.options = res.data;
          this.queryConditions.outpDeptId = res.data.length?res.data[0].deptId:'';
          this.deptId = res.data.length?res.data[0].deptId:'';
          this.selLoading = false;
        } catch (error) {
          this.selLoading = false;
          this.$message.error(error.msg || "查询科室失败");
        }
      },
      // 左侧
      handleSelectionChange() {

      },
    },
    watch: {
      scheduleIds: {
        handler(newName, oldName) {
          console.log("数据变化");
          console.log(this.scheduleIds);
          this.queryConditionsLeft.scheduleSerialId = this.scheduleIds[0];
          this.selectApptList(this.queryConditionsLeft);
        },
        immediate: true

      }
    }
  };
</script>

<style lang="scss" scoped>
  .todealwith-bg {
    background-color: #FFFFFF;
    height: 600px;

    .refreshFun-text{
      font-size: 16px;
    }
    .padding-card {
      box-sizing: border-box;
      // padding: 8px;
    }

    .padding-style {
      padding: 15px 10px 0px 10px;
    }

    .todealwith-btn-style {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .todealwith-top-font /deep/ .el-radio__label {
      font-size: 18px;
      font-weight: 600;

      color: #000000;

      >span {
        font-size: 14px;
        color: #C3C3C3;

      }
    }

    .padding-style-a {
      padding: 0px 10px 10px 10px;
    }

    .padding-style-b {
      padding: 15px 10px 10px 10px;
    }

    .margin-right-style {
      margin-right: 8px;
    }
    >>>.el-table__body-wrapper{
      overflow: auto;
      height:calc(100% - 24px);
    }
  }
</style>
