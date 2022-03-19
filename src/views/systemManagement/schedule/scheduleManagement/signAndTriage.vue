<template>
  <el-card class="height100 width100 padding10">
    <div class="signAndTriage">
      <div class="schedule">
        <div class="searchArea">
          <l-formt-title label="所属分诊站" style="width:250px;margin-right:20px;">
            <l-value-domain
              :value.sync="stationId"
              remoteUrl="/appointment/station/selStationPOList?recordStatus=1&deletedStatus=0"
              remoteShowKey="stationName"
              remoteValueKey="stationId"
              placeholder="请选择"
              @change="getScheduleByStation"
            ></l-value-domain>
          </l-formt-title>
          <el-button
            type="primary"
            @click="stopScheduleAtTime"
            :disabled="!currentItem.scheduleId"
          >临时停诊</el-button>
          <el-button
            @click="openScheduleAtTime"
            :disabled="!currentItem.scheduleId"
          >继续开诊</el-button>
        </div>
        <div class="scheduleList">
          <div
            v-for="(item,index) in scheduleList"
            :key="index"
            class="listItem"
            :class="{currentClass:item.scheduleId==currentItem.scheduleId}"
            @click="itemClick(item)"
          >
            <div class="one fbc">
              <div class="roomName bigText">{{item.roomName}}</div>
              <div class="bigText">{{item.ouptDeptName}}</div>
              <div class="status bigText">{{item.scheduleStatus}}</div>
            </div>
            <div class="two flc">
              <span class="docName wp25 bigText">{{item.doctorName}}</span>
              <span
                class="workName wp25"
                v-if="item.workCode"
                :val="item.workCode"
                code="doctorProfessionalTitle"
                v-codeTransform
              ></span>
              <span class="deptName wp25">{{item.apptDeptName}}</span>
              <span class="schType wp25">{{item.diagTreatTypeName}}</span>
            </div>
            <div class="three flc">
              <span class="wp25">
                号源数：
                <span class="bigNum">{{item.allNum}}</span>
              </span>
              <span class="wp25">
                已挂号：
                <span class="bigNum">{{item.usedNum}}</span>
              </span>
              <span class="wp25">
                候诊：
                <span class="bigNum">{{item.waitNum}}</span>
              </span>
              <span class="wp25">
                已诊：
                <span class="bigNum">{{item.clincalNum}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="scheduleDetails">
        <div class="title">候诊队列</div>
        <div class="buttonArea">
          <el-button type="primary" @click="getApptQueueByScheduleget">刷新</el-button>
          <el-button type=" " @click="signButtonClick" :disabled="!stationId">分诊</el-button> <!---分诊即 签到 -->
          <el-button type=" " @click="firstVisit" :disabled="!currentRow.appointmentId">优先就诊</el-button>
          <el-button type=" " @click="numRecover" :disabled="!currentRow.appointmentId">过号恢复</el-button>
          <el-button type=" " @click="returnVisit">回诊</el-button>
          <el-button type=" " @click="triageVisit" :disabled="!currentRow.appointmentId">手动分诊</el-button>
          <el-button type=" " @click="reprintData" :disabled="!currentRow.appointmentId">补打挂号单</el-button>
        </div>
        <el-table
          ref="table"
          :data="tableData"
          style="width: 100%;"
          height="calc(100% - 80px)"
          highlight-current-row
          @row-click="handleCurrentChange"
          border
          stripe
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column
            v-for="(item, index) in columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'center'"
            :header-align="item.headerAlign || 'center'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'recordStatus'">
                <span :val="scope.row[item.prop]" code="APPT_STATUS" v-codeTransform></span>
              </template>
              <template v-else-if="item.prop == 'rediagStatus'">
                <span>{{scope.row[item.prop]*1?'是':'否'}}</span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 签到弹窗 --> <!---分诊即 签到 -->
    <el-dialog title="患者分诊" :visible.sync="signDialogData.show" width="1200px">
      <div style="padding:10px 20px;height:100%;">
        <div class="flc" style="margin-bottom:10px;">
          <LFormtTitle label="选择科室" style="width:250px;margin-right:10px;">
            <l-value-domain
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="signDialogData.deptId"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder
              defaultFirst
            ></l-value-domain>
          </LFormtTitle>
          <l-formt-title label="医生姓名" style="width:250px;margin-right:10px;">
            <el-select
              v-model="signDialogData.doctorId"
              filterable
              remote
              reserve-keyword
              placeholder="姓名/拼音/五笔"
              :remote-method="selectAllUser"
              :loading="signDialogData.selLoading"
              clearable
            >
              <el-option
                v-for="item in signDialogData.options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </l-formt-title>
          <l-formt-title label="患者姓名" style="width:250px;margin-right:10px;">
            <el-input v-model="signDialogData.patientName" placeholder="患者姓名"></el-input>
          </l-formt-title>

          <el-button type="primary" @click="readCard">读 卡</el-button>
          <el-button type="" @click="signSearch">查 询</el-button>
        </div>
        <el-table
          ref="table"
          :data="signDialogData.signList"
          style="width: 100%;"
          height="calc(100% - 45px)"
          highlight-current-row
          @current-change="signHandleCurrentChange"
          border
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column
            v-for="(item, index) in signDialogColumns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'center'"
            :header-align="item.headerAlign || 'center'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'patientGender'">
                <span>{{scope.row.patientGender=='1'?'男':'女'}}</span>
              </template>
              <template v-else-if="item.prop == 'ouptDeptId'">
                <span
                  tableName="sys_org"
                  :conditionMap="{
                          org_type: '_DEPT_',
                          id: scope.row[item.prop]
                        }"
                  columns="org_nm"
                  v-tableTransform
                ></span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="signCancel">取 消</el-button>
        <el-button
          type="primary"
          :disabled="!(signDialogData.currentRow&&signDialogData.currentRow.appointmentId)"
          @click="signSure"
        >确认分诊</el-button>
      </div>
    </el-dialog>
    <!-- 分诊弹窗 -->
    <el-dialog
      title="手动分诊"
      :visible.sync="triageDialogData.show"
      width="1200px"
      @close="triageDialogClose"
    >
      <div style="padding:10px 20px;height:100%;">
        <div class="flc" style="margin-bottom:10px;">
          <LFormtTitle label="选择科室" style="width:250px;margin-right:10px;">
            <l-value-domain
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="triageDialogData.outpDeptId"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder
              defaultFirst
            ></l-value-domain>
          </LFormtTitle>
          <l-formt-title label="诊疗类型" style="width:250px;margin-right:10px;">
            <l-value-domain
              clearable
              style="width: 100%"
              :value.sync="triageDialogData.diagTreatType"
              remoteUrl="/appointment/diagTreatType/selectDiagTreatTypePO?recordStatus=1"
              type="select"
              remoteShowKey="diagTreatTypeName"
              remoteValueKey="diagTreatTypeCode"
              placeholder
            ></l-value-domain>
          </l-formt-title>
          <l-formt-title label="医生姓名" style="width:250px;margin-right:10px;">
            <el-select
              v-model="triageDialogData.doctorId"
              filterable
              remote
              reserve-keyword
              placeholder="姓名/拼音/五笔"
              :remote-method="selectAllUserTriage"
              :loading="triageDialogData.selLoading"
              clearable
            >
              <el-option
                v-for="item in triageDialogData.options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </l-formt-title>

          <el-button type="primary" @click="readCard">读 卡</el-button>
          <el-button type="" @click="triageSearch">查 询</el-button>
        </div>
        <el-table
          ref="table"
          :data="triageDialogData.signList"
          style="width: 100%;"
          height="calc(100% - 45px)"
          highlight-current-row
          @row-click="triageHandleCurrentChange"
          border
        >
          <el-table-column
            v-for="(item, index) in triageDialogColumns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'center'"
            :header-align="item.headerAlign || 'center'"
            :fixed="item.fixed"
          ></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="triageCancel">关闭</el-button>
        <el-button
          type="primary"
          :disabled="!(triageDialogData.currentRow&&triageDialogData.currentRow.scheduleId)"
          @click="triageSure"
        >确认</el-button>
      </div>
    </el-dialog>
    <!-- 优先就诊 -->
    <el-dialog title="优先就诊" :visible.sync="firstVisitDialogData.show">
      <div style="padding:10px 20px;">
        <div class="flc" style="margin-bottom:10px;">
          <l-formt-title label="优先就诊原因" style="width:350px;margin-right:10px;">
            <l-value-domain
              clearable
              style="width: 100%"
              :value.sync="firstVisitDialogData.dictCode"
              remoteUrl="/appointment/dictValue/getDictValueList?dictItemCode=A0004"
              type="select"
              remoteShowKey="dictName"
              remoteValueKey="dictCode"
              placeholder
            ></l-value-domain>
          </l-formt-title>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="firstVisitCancel">取消</el-button>
        <el-button  @click="firstVisitSure">确认</el-button>
      </div>
    </el-dialog>
    <!-- 回诊 -->
    <el-dialog title="回诊" :visible.sync="returnDialogData.show" width="1400px" @close="returnClose">
      <div style="padding:10px 20px;">
        <div class="flc" style="margin-bottom:10px;">
          <LFormtTitle label="卡号" style="width:200px;margin-right:10px;">
            <el-input v-model="returnDialogData.cardNum" placeholder="卡号"></el-input>
          </LFormtTitle>
          <el-button type="primary" @click="readCard" style="width:60px;margin-right:10px;">读卡</el-button>
          <LFormtTitle label="患者姓名" style="width:230px;margin-right:10px;">
            <el-input v-model="returnDialogData.patientName" placeholder="患者姓名"></el-input>
          </LFormtTitle>
          <LFormtTitle label="科室" style="width:230px;margin-right:10px;">
            <l-value-domain
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="returnDialogData.outpDeptId"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="科室"
            ></l-value-domain>
          </LFormtTitle>
          <l-formt-title label="诊疗类型" style="width:230px;margin-right:10px;">
            <l-value-domain
              clearable
              style="width: 100%"
              :value.sync="returnDialogData.diagTreatType"
              remoteUrl="/appointment/diagTreatType/selectDiagTreatTypePO?recordStatus=1"
              type="select"
              remoteShowKey="diagTreatTypeName"
              remoteValueKey="diagTreatTypeCode"
              placeholder="诊疗类型"
            ></l-value-domain>
          </l-formt-title>
          <l-formt-title label="医生姓名" style="width:230px;margin-right:10px;">
            <el-select
              v-model="returnDialogData.doctorId"
              filterable
              remote
              reserve-keyword
              placeholder="医生姓名"
              :remote-method="selectAllUserReturn"
              :loading="returnDialogData.selLoading"
              clearable
            >
              <el-option
                v-for="item in returnDialogData.options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </l-formt-title>
          <l-formt-title label="手机号码" style="width:230px;margin-right:10px;">
            <el-input v-model="returnDialogData.phoneNum" placeholder="手机号码"></el-input>
          </l-formt-title>
          <el-button type="primary" @click="getReturnList">查 询</el-button>
        </div>
        <el-table
          class="tableHei"
          ref="table"
          :data="returnDialogData.appointList"
          style="width: 100%;"
          highlight-current-row
          @row-click="appointRowClick"
          border
        >
          <el-table-column
            v-for="(item, index) in returnDialogColumns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'center'"
            :header-align="item.headerAlign || 'center'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop=='ouptDeptId'">
                <span
                  tableName="sys_org"
                  :conditionMap="{org_type: '_DEPT_',id: scope.row[item.prop]}"
                  columns="org_nm"
                  v-tableTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'patientGender'">
                <span :val="scope.row[item.prop]" code="GENDER_CODE" v-codeTransform></span>
              </template>
              <template v-else-if="item.prop == 'diagTreatType'">
                <span
                      tableName="appt_diag_treat_type"
                      :conditionMap="{DIAG_TREAT_TYPE_CODE: scope.row[item.prop] || ''}"
                      columns="DIAG_TREAT_TYPE_NAME"
                      v-tableTransform
                    ></span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
        <div class="sche-list clearfix">
          <l-card-title style="margin:8px 0px;">
            <template #left>
              请选择回诊班次
            </template>
          </l-card-title>
          <div class="div-info" v-if="! returnDialogData.scheList || returnDialogData.scheList.length <= 0">
            暂无可回诊班次
          </div>
          <div
            v-else
            class="shce-item float-left"
            :class="{'sche-active':(returnDialogData.scheCurrentRow&&returnDialogData.scheCurrentRow.scheduleId==item.scheduleId)}"
            v-for="(item,index) in returnDialogData.scheList"
            :key="index"
            @click="scheRowClick(item)"
          >
            <div class="shce-top clearfix">
              <div class="float-left">{{item.roomName}}</div>
              <div class="float-right shce-top-right">开诊</div>
            </div>
            <div class="shce-center">
              <span>{{item.doctorName}}</span>
              <span class="shce-diagTreat">{{item.diagTreatTypeName}}</span>
            </div>
            <div class="shce-bottom clearfix">
              <div class="float-left">{{item.ouptDeptName}}</div>
              <div class="float-right shce-bottom-right">候诊：{{item.waitNum}}</div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="returnCancel">关闭</el-button>
        <el-button
          type="primary"
          plain
          :disabled="!(returnDialogData.appointCurrentRow&&returnDialogData.appointCurrentRow.appointmentId&&returnDialogData.scheCurrentRow&&returnDialogData.scheCurrentRow.scheduleId)"
          @click="returnSure"
        >确认</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import service from "@/api/schedule/signAndTriage.js";
import service1 from "@/api/systemManagement/receipt/receipt";
import { onPreview } from "@/utils/print";

export default {
  data() {
    return {
      stationId: "", //分诊站id
      scheduleList: [], //排班列表数据
      queueList: [], //队列列表数据
      currentItem: {},
      tableData: [],
      currentRow: {}, //当前选中行
      // 签到弹窗数据
      signDialogData: {
        show: false,
        deptId: "",
        doctorId: "",
        options: [],
        selLoading: false,
        patientName: "", //患者姓名
        signList: [], //待签到列表
        currentRow: {}
      },
      signDialogColumns: [
        {
          label: "患者姓名",
          prop: "patientName",
          width: "80px"
        },
        {
          label: "性别",
          prop: "patientGender",
          width: "60px"
        },
        {
          label: "出生日期",
          prop: "birthDate",
          width: "200px"
        },
        {
          label: "联系方式",
          prop: "phoneNum",
          width: "100px"
        },
        {
          label: "科室",
          prop: "ouptDeptId",
          width: "80px"
        },
        {
          label: "医生",
          prop: "doctorName",
          width: "80px"
        },
        {
          label: "期望就诊时间",
          prop: "appointmentTime",
          width: "200px"
        },
        {
          label: "特殊人群标志",
          prop: "reasonName",
          width: "80px"
        }
      ],
      columns: [
        {
          label: "患者姓名",
          prop: "patientName",
          width: "100px"
        },
        {
          label: "状态",
          prop: "recordStatus",
          width: "80px"
        },
        {
          label: "期望就诊时间",
          prop: "appointmentTime",
          width: "150px"
        },
        {
          label: "等待时间",
          prop: "waitTime",
          width: "100px"
        },
        {
          label: "是否回诊",
          prop: "rediagStatus",
          width: "100px"
        },
        {
          label: "特殊人群标志",
          prop: "reasonName",
          width: "100px"
        },
        {
          label: "联系方式",
          prop: "phoneNum",
          width: "100px"
        }
      ],
      //  分诊弹框数据
      triageDialogData: {
        show: false,
        signList: [],
        currentRow: {},
        deptId: "",
        doctorId: "",
        diagTreatType: "",
        options: [],
        selLoading: false
      },
      triageDialogColumns: [
        {
          label: "分诊站",
          prop: "stationName",
          width: "80"
        },
        {
          label: "诊室名称",
          prop: "roomName",
          width: "80"
        },
        {
          label: "状态",
          prop: "scheduleStatus",
          width: "80"
        },
        {
          label: "门诊科室",
          prop: "ouptDeptName",
          width: "80"
        },
        {
          label: "诊疗类型",
          prop: "diagTreatTypeName",
          width: "80"
        },
        {
          label: "医师",
          prop: "doctorName",
          width: "80"
        },
        {
          label: "号源数",
          prop: "allNum",
          width: "80"
        },
        {
          label: "已挂号",
          prop: "usedNum",
          width: "80"
        },
        {
          label: "候诊",
          prop: "waitNum",
          width: "80"
        },
        {
          label: "已诊",
          prop: "clincalNum",
          width: "80"
        }
      ],
      //优先就诊
      firstVisitDialogData: {
        show: false,
        reasonCode: ""
      },
      //回诊
      returnDialogData: {
        show: false,
        diagTreatType: "",
        ouptDeptId: "",
        doctorId: "",
        phoneNum: "",
        patientName: "",
        cardNum: "", //卡号
        options: [],
        selLoading: false,
        appointList: [], //预约列表
        appointCurrentRow: {},
        scheList: [], //可回诊的班次
        scheCurrentRow: {}
      },
      returnDialogColumns: [
        {
          label: "患者姓名",
          prop: "patientName",
          width: "80"
        },
        {
          label: "性别",
          prop: "patientGender",
          width: "80"
        },
        {
          label: "出生日期",
          prop: "birthDate",
          width: "80"
        },
        {
          label: "接诊科室",
          prop: "ouptDeptId",
          width: "80"
        },
        {
          label: "医生",
          prop: "doctorName",
          width: "80"
        },
        {
          label: "诊疗类型",
          prop: "diagTreatType",
          width: "80"
        },
        {
          label: "就诊日期",
          prop: "diagTime",
          width: "80"
        },
        {
          label: "联系方式",
          prop: "phoneNum",
          width: "80"
        }
      ]
    };
  },
  mounted() {
    this.getScheduleByStation();
  },
  methods: {
    getScheduleByStation() {
      this.getSchedules();
      this.currentItem = {};
    },
    async getSchedules() {
      try {
        let res = await service.getScheduleByStation({
          stationId: this.stationId
        });
        this.scheduleList = res.data;
      } catch (error) {
        this.$message.error(error.msg || "获取门诊站排班列表失败");
      }
    },
    //临时停诊
    async stopScheduleAtTime() {
      try {
        if(this.currentItem && this.currentItem.recordStatus == '5'){
          this.$message.error("该排班已停诊，请勿重复操作");
          return;
        }
        let res = await service.stopScheduleAtTime({
          scheduleId: this.currentItem.scheduleId
        });
        this.getScheduleByStation();
        this.$message.success(res.msg || "停诊成功");
      } catch (error) {
        this.$message.error(error.msg || "临时停诊失败");
      }
    },
    //开诊
    async openScheduleAtTime() {
      try {
        if(this.currentItem && this.currentItem.recordStatus == '1'){
          this.$message.error("该排班已开诊，请勿重复操作");
          return;
        }
        let res = await service.openScheduleAtTime({
          scheduleId: this.currentItem.scheduleId
        });
        this.getScheduleByStation();
        this.$message.success(res.msg || "开诊成功");
      } catch (error) {
        this.$message.error(error.msg || "开诊失败");
      }
    },
    //根据选中排班查询队列列表
    async getApptQueueByScheduleget() {
      try {
        if(!this.currentItem || !this.currentItem.scheduleId){
          return;
        }
        let res = await service.getApptQueueByScheduleget({
          scheduleSerialId: this.currentItem.scheduleId
        });
        this.currentRow = {};
        this.tableData = res.data;
      } catch (error) {
        this.$message.error(error.msg || "获取排班队列列表失败");
      }
    },
    //签到
    async apptSign() {
      try {
        let res = await service.apptSign({
          appointmentId: this.signDialogData.currentRow.appointmentId,
          triageStationNum: this.stationId || ''
        });
        if (res.code == 1) {
          this.$message.success(res.msg || "分诊成功");
          await this.getSchedules();
          let list = this.scheduleList;
          for (let i in list) {
            if (list[i]["scheduleId"] === this.currentItem.scheduleId) {
              this.currentItem = list[i];
            }
          }
          this.getApptQueueByScheduleget();
        } else {
          this.$message.error(res.msg || "分诊失败");
        }
      } catch (error) {
        this.$message.error(error.msg || "分诊失败");
      }
    },
    handleCurrentChange(row) {
      this.currentRow = row;
    },
    signHandleCurrentChange(row) {
      this.signDialogData.currentRow = row;
    },
    itemClick(item) {
      this.currentItem = item;
      this.getApptQueueByScheduleget();
    },
    //点击签到按钮，弹出待签到列表弹窗
    signButtonClick() {
      this.signDialogData.show = true;
      this.signSearch();
    },
    signCancel() {
      this.clearSignDialogData(false);
    },
    async signSure() {
      await this.apptSign();
      this.clearSignDialogData(true);
      this.getApptQueueByScheduleget();
      this.signSearch();
    },
    //获取签到列表
    async getApptByAppt() {
      try {
        let res = await service.getApptByAppt({
          patientId: "",
          patientName: this.signDialogData.patientName,
          triageStationNum: this.stationId, // 分诊站ID
          ouptDeptId: this.signDialogData.deptId, // 科室ID
          doctorId: this.signDialogData.doctorId // 医生ID
        });
        this.signDialogData.signList = res.data;
      } catch (error) {
        this.$message.error(error.msg || "获取待分诊列表失败");
      }
    },
    // 查询用户
    async selectAllUser(val) {
      try {
        this.signDialogData.selLoading = true;
        let res = await service1.getAllUser({
          userName: val || ""
        });
        this.signDialogData.options = res.data;
        this.signDialogData.selLoading = false;
      } catch (error) {
        this.signDialogData.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    readCard() {
      this.$message.error("没有外接设备");
    },
    signSearch() {
      this.getApptByAppt();
    },
    clearSignDialogData(isshow) {
      this.signDialogData = {
        show: isshow,
        deptId: "",
        doctorId: "",
        options: [],
        selLoading: false,
        patientName: "", //患者姓名
        signList: [], //待签到列表
        currentRow: {}
      };
    },
    //优先就诊
    firstVisit() {
      this.firstVisitDialogData.show = true;
    },
    firstVisitCancel() {
      this.firstVisitDialogData.show = false;
      this.firstVisitDialogData.dictCode = "";
    },
    async firstVisitSure() {
      try {
        let params = {
          appointmentId: this.currentRow.appointmentId,
          reasonCode: this.firstVisitDialogData.dictCode,
          otherReason: ""
        };
        let res = await service.jumpQueue(params);
        if (res.code == 1) {
          this.$message.success("优先就诊成功");
          this.getApptQueueByScheduleget();
        } else {
          this.$message.error(res.msg || "优先就诊失败");
        }
        this.firstVisitCancel();
      } catch (e) {
        this.firstVisitCancel();
        this.$message.error(e.msg || "优先就诊失败");
      }
    },
    //过号恢复
    async numRecover() {
      try {
        let params = {
          appointmentId: this.currentRow.appointmentId
        };
        let res = await service.recoverAppt(params);
        if (res.code == 1) {
          this.$message.success("过号恢复成功");
          this.getApptQueueByScheduleget();
        } else {
          this.$message.error("过号恢复失败");
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    //手动分诊
    triageVisit() {
      this.triageDialogData.show = true;
    },
    async selectAllUserTriage(val) {
      try {
        this.triageDialogData.selLoading = true;
        let res = await service1.getAllUser({
          userName: val || ""
        });
        this.triageDialogData.options = res.data;
        this.triageDialogData.selLoading = false;
      } catch (error) {
        this.triageDialogData.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    async triageSearch() {
      try {
        let params = {
          outpDeptId: this.triageDialogData.outpDeptId,
          doctorId: this.triageDialogData.doctorId,
          diagTreatType: this.triageDialogData.diagTreatType
        };
        let res = await service.getScheduleByStation(params);
        if (res.code == 1) {
          this.triageDialogData.signList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    async triageSure() {
      try {
        let params = {
          appointmentId: this.currentRow.appointmentId,
          newScheduleId: this.triageDialogData.currentRow.scheduleId,
          channel: "1"
        };
        let res = await service.appointChangeTriage(params);
        if (res.code == 1) {
          this.$message.success("分诊成功");
          this.getApptQueueByScheduleget();
          this.getSchedules();
        } else {
          this.$message.error(res.msg || "分诊失败");
          this.getSchedules();
        }
      } catch (e) {
        this.$message.error(e.msg || "分诊失败");
        this.getSchedules();
      }
    },
    triageCancel() {
      this.triageDialogData.show = false;
    },
    triageDialogClose() {
      this.triageDialogData.currentRow = {};
    },
    triageHandleCurrentChange(row) {
      this.triageDialogData.currentRow = row;
    },
    // 回诊
    returnVisit() {
      this.returnDialogData.show = true;
    },
    // 查询用户
    async selectAllUserReturn(val) {
      try {
        this.returnDialogData.selLoading = true;
        let res = await service1.getAllUser({
          userName: val || ""
        });
        this.returnDialogData.options = res.data;
        this.returnDialogData.selLoading = false;
      } catch (error) {
        this.returnDialogData.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    async getReturnList() {
      try {
        let params = {
          diagTreatType: this.returnDialogData.diagTreatType,
          ouptDeptId: this.returnDialogData.ouptDeptId,
          doctorId: this.returnDialogData.doctorId,
          phoneNum: this.returnDialogData.phoneNum,
          patientName: this.returnDialogData.patientName
        };
        let res = await service.getRediagAppt(params);
        if (res.code == 1) {
          this.returnDialogData.appointList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    appointRowClick(row) {
      this.returnDialogData.appointCurrentRow = row;
      this.getScheList();
    },
    async getScheList() {
      try {
        let params = {
          appointmentId: this.returnDialogData.appointCurrentRow.appointmentId
        };
        let res = await service.getReDiagSchedule(params);
        if (res.code == 1) {
          this.returnDialogData.scheList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    scheRowClick(row) {
      this.returnDialogData.scheCurrentRow = row;
    },
    async returnSure() {
      try {
        let params = {
          appointmentId: this.returnDialogData.appointCurrentRow.appointmentId,
          newScheduleId: this.returnDialogData.scheCurrentRow.scheduleId,
          channel: 1
        };
        let res = await service.rediagAppt(params);
        if (res.code == 1) {
          this.$message.success("回诊成功");
        } else {
          this.$message.error(res.msg);
        }
        this.returnClose();
        this.getApptQueueByScheduleget();
      } catch (e) {
        this.returnClose();
        this.getApptQueueByScheduleget();
        this.$message.error(e.msg);
      }
    },
    returnCancel() {
      this.returnDialogData.show = false;
    },
    returnClose() {
      this.returnDialogData = {
        show: false,
        diagTreatType: "",
        ouptDeptId: "",
        doctorId: "",
        phoneNum: "",
        patientName: "",
        cardNum: "",
        options: [],
        selLoading: false,
        appointList: [],
        appointCurrentRow: {},
        scheList: [],
        scheCurrentRow: {}
      };
    },
    //补打挂号单
    async reprintData() {
      let outpDeptName = await this.transformTable(
        "org_nm",
        {
          org_type: "_DEPT_",
          id: this.currentRow.ouptDeptId
        },
        "sys_org"
      );

      let data = {
        visitCode: this.currentRow.visitCode,
        name: this.currentRow.patientName,
        departName: outpDeptName,
        floors: this.currentRow.roomLocation, //就诊地点
        visitTime: this.currentRow.appointmentTime,
        num: "",
        doctorName: this.currentRow.doctorName,
        roomNum: this.currentRow.roomName,
        chargePrice: this.currentRow.regMoney,
        chargeType: "挂号",
        visitDate: this.currentRow.updatedAt
      };
      // console.log("打印数据data", data);
      onPreview(data, "挂号凭证");
    },
    //表数据反显 （科室用）
    async transformTable(columns, conditionMap, tableName) {
      try {
        let data = {
          tableName: tableName || "",
          columns: columns || "",
          conditionMap: conditionMap || {}
        };
        let resData = await getTableData(data);
        if (resData.code === 1 && resData.data != []) {
          return Promise.resolve(resData.data[0][columns]);
        }
        return "";
      } catch (error) {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.div-info{
  margin-top: 10px;
  margin-left: 10px;
}
.tableHei{
  height: 280px;
}
.signAndTriage {
  display: flex;
  height: 100%;
  .schedule {
    min-width: 800px;
    height: 100%;
    border-right: 1px solid #e4e4e4;
    .searchArea {
      display: flex;
      align-items: center;
    }
    .scheduleList {
      height: calc(100% - 35px);
      padding-top: 10px;
      overflow: auto;
      .listItem {
        width: 380px;
        height: 120px;
        background: #f2f2f2;
        margin-right: 10px;
        margin-bottom: 5px;
        padding: 0 15px;
        display: inline-block;
        .wp25 {
          width: 25%;
        }
        .bigText {
          font-size: 18px;
          font-weight: bold;
          color: black;
        }
        .bigNum {
          font-size: 16px;
          font-weight: bold;
          color: black;
        }
        .one {
          height: 33%;
        }
        .two {
          height: 33%;
        }
        .three {
          height: 33%;
        }
      }
    }
  }
  .scheduleDetails {
    height: 100%;
    flex-grow: 1;
    padding-left: 10px;
    .title {
      font-size: 20px;
      font-weight: bold;
      color: black;
    }
    .buttonArea {
      margin: 10px 0;
    }
  }
}
.flc {
  display: flex;
  justify-content: left;
  align-items: center;
}
.fbc {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.fbc {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.currentClass {
  background: #81d3f8 !important;
}
>>> .el-dialog {
  height: 80%;
}
>>> .el-dialog__body {
  height: calc(100% - 130px);
}
.sche-list {
  margin: 10px 0;
  .shce-item {
    width: 200px;
    border: 1px solid $l-color-bgcolor-11;
    padding: 10px 20px;
    margin-right: 10px;
    .shce-top {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid $l-color-bgcolor-11;
      .shce-top-right {
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        // border: 1px solid $l-color-menu;
        color: $l-color-menu;
      }
    }
    .shce-center {
      height: 50px;
      line-height: 50px;
      font-weight: $l-font-weight;
      font-size: $l-font-size-max;
      .shce-diagTreat {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        padding: 0 5px;
        font-weight: 400;
        color: 4px;
        font-size: $l-font-size-min;
        background-color: $l-color-bgcolor-17;
        border-radius: 5px;
      }
    }
    .shce-bottom {
      height: 40px;
      line-height: 40px;
      .shce-bottom-right {
        color: $l-color-menu;
      }
    }
  }
  .sche-active {
    background-color: $l-color-bgcolor-18;
  }
}
</style>
