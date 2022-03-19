<!--- 
  旧版界面 准备删掉
  2020/06/18
  shaokang
 ----->

<template>
  <div class="width100 height100">
    <el-card class="float-left height100 width100 padding10">
      <el-row class="width100">
        <el-col :span="4">
          <LFormtTitle label="选择科室">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="searchData.deptId"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder
              style="width:100%"
              defaultFirst
              @change="deptChange"
            ></l-value-domain>
          </LFormtTitle>
        </el-col>
        <el-col :span="16" class="weekBtu">
          <div>
            <div class="left float-left" @click="getLastWeekSchedul">第{{Number(currentWeek)-1}}周</div>
            <div class="line margin-left-20 float-left"></div>
            <div
              class="center float-left"
            >第 {{currentWeek}} 周 {{dateList[0].date}} 至 {{dateList[6].date}}</div>
            <div class="line float-left"></div>
            <div class="float-left right" @click="getNextWeekSchedul">第{{Number(currentWeek)+1}}周 ></div>
          </div>
          <!-- <div>
          <el-button type="primary">shangy</el-button>
          </div>-->
        </el-col>
        <el-col :span="4" class="float-right">
          <!-- <el-button class="float-right" type="primary" @click="deleteAll">清空所有</el-button>
          <el-button class="float-right margin-right-10" type="primary" @click="getTemplate">引用模板</el-button>
          <el-button class="float-right" type="primary" @click="dialogVisible = true">存为模板</el-button>-->
          <el-button class="float-right" type="primary" @click="saveStage">保存</el-button>
          <el-button class="float-right margin-right-10" @click="add">添加排班</el-button>
        </el-col>
      </el-row>
      <!-- 表格tabs -->
      <el-tabs class="tableTabs" v-model="currentTabs" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item,index) in dateList"
          :key="index"
          :label="item.week + ' ' + item.date"
          :name="item.date"
        >
          <el-table
            ref="scheduleTable"
            :data="item.dataList"
            width="100%"
            height="calc(100% - 60px)"
            border
            v-loading="loading"
            row-key="scheduleId"
            :tree-props="{children: 'doctorSchedules'}"
            default-expand-all
          >
            <el-table-column
              v-for="(item, index) in schedulingParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="scope.row['operate']=='0'">
                  <!-- <template v-if="item.prop == 'date'">
                  <span
                    class="dateFont"
                  >{{strSplit(scope.row[item.prop],'-')[1]}}-{{strSplit(scope.row[item.prop],'-')[2]}}</span>
                  <el-button
                    type="primary"
                    plain
                    @click="add(scope.row,scope.$index)"
                    class="addSchedul"
                  >添加排班</el-button>
                  </template>-->
                  <template v-if="item.prop == 'operate'">
                    <el-button type="text" @click="editItem(scope.row,scope.$index)">编辑</el-button>
                    <el-button
                      type="text"
                      v-if="scope.row.tag=='1'&&scope.row.scheduleType=='2'"
                      @click="addSonSchedul(scope.row,scope.$index)"
                    >添加子排班</el-button>
                    <el-button
                      type="text"
                      v-if="scope.row.recordStatus != '1'"
                      @click="delteItem(scope.row,scope.$index)"
                    >删除</el-button>
                  </template>
                  <template v-else-if="item.prop == 'scheduleType'">
                    <span>{{scope.row[item.prop]=='1'?'医生':'科室'}}</span>
                  </template>
                  <template v-else-if="item.prop == 'recordStatus'">
                    <span v-if="scope.row[item.prop]=='1'">发布</span>
                    <span v-else-if="scope.row[item.prop]=='2'">暂存</span>
                    <span v-else-if="scope.row[item.prop]=='5'">停诊</span>
                    <span v-else-if="scope.row[item.prop]=='3'">驳回</span>
                    <span v-else-if="scope.row[item.prop]=='4'">审核</span>
                  </template>
                  <template v-else-if="item.prop == 'doctorId'">
                    <span
                      tableName="sys_user"
                      :conditionMap="{ID: scope.row[item.prop] || ''}"
                      columns="NAME"
                      v-tableTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'workCode'">
                    <span
                      v-if="scope.row[item.prop]"
                      :val="scope.row[item.prop]"
                      code="doctorProfessionalTitle"
                      v-codeTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'diagTreatType'">
                    <span
                      tableName="appt_diag_treat_type"
                      :conditionMap="{DIAG_TREAT_TYPE_CODE: scope.row[item.prop] || ''}"
                      columns="DIAG_TREAT_TYPE_NAME"
                      v-tableTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'classesId'">
                    <span
                      tableName="appt_class"
                      :conditionMap="{CLASS_ID: scope.row[item.prop] || ''}"
                      columns="CLASS_NAME"
                      v-tableTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop=='dutyStartTime'||item.prop=='dutyStopTime'">
                    <span>{{strSplit(scope.row[item.prop], ' ')[1]}}</span>
                  </template>
                  <template v-else-if="item.prop == 'roomId'">
                    <span
                      tableName="appt_room_station"
                      :conditionMap="{ID: scope.row[item.prop] || ''}"
                      columns="DATA_NAME"
                      v-tableTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop == 'apptDept'">
                    <span
                      tableName="appt_dict_value"
                      :conditionMap="{dict_item_code: 'A0003',dict_code: scope.row[item.prop] || ''}"
                      columns="DICT_NAME"
                      v-tableTransform
                    ></span>
                  </template>
                  <template v-else-if="item.prop=='isOnline'">
                    <span v-if="scope.row[item.prop]=='1'">是</span>
                    <span v-if="scope.row[item.prop]=='2'">否</span>
                  </template>
                  <template v-else-if="item.prop=='unifyPool'">
                    <span v-if="scope.row[item.prop]=='1'">是</span>
                    <span v-if="scope.row[item.prop]=='2'">否</span>
                  </template>
                  <!-- 已加号数量 -->
                  <template v-else-if="item.prop == 'appendNum'">{{scope.row[item.prop]}}</template>
                  <!-- 加号数量 -->
                  <template v-else-if="item.prop == 'addNum'">
                    <el-input-number
                      v-model="scope.row[item.prop]"
                      :min="0"
                      :controls="false"
                      :disabled="!scope.row.scheduleId"
                      style="width: 100%"
                    ></el-input-number>
                  </template>
                  <!-- 确认加号 -->
                  <template v-else-if="item.prop == 'submitAdd'">
                    <el-button
                      type="text"
                      :disabled="!scope.row.scheduleId"
                      @click="submitAdd(scope.row)"
                    >加号</el-button>
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>

                <template v-if="scope.row['operate']=='1'">
                  <!-- <template v-if="item.prop == 'date'">
                  <span
                    class="dateFont"
                  >{{strSplit(scope.row[item.prop],'-')[1]}}-{{strSplit(scope.row[item.prop],'-')[2]}}</span>
                  <el-button
                    type="primary"
                    plain
                    @click="add(scope.row,scope.$index)"
                    class="addSchedul"
                  >添加排班</el-button>
                  </template>-->
                  <template v-if="item.prop == 'operate'">
                    <el-button type="text" @click="editCommit(scope.row,scope.$index)">完成</el-button>
                    <!--<el-button type="text" @click="cancelItem(scope.row,scope.$index)">取消</el-button>-->
                    <el-button type="text" @click="delteItem(scope.row,scope.$index)">删除</el-button>
                  </template>
                  <template v-else-if="item.prop == 'scheduleType'">
                    <!-- <el-radio-group :disabled="scope.row.tag=='2'" v-model="scope.row[item.prop]">
                      <el-radio label="1">医生</el-radio>
                      <el-radio label="2">科室</el-radio>
                    </el-radio-group>-->
                    <el-select
                      v-model="scope.row[item.prop]"
                      :disabled="scope.row.tag=='2'"
                      placeholder="请选择"
                    >
                      <el-option label="医生" value="1"></el-option>
                      <el-option label="科室" value="2"></el-option>
                    </el-select>
                  </template>
                  <template v-else-if="item.prop == 'recordStatus'">
                    <template v-if="scope.row[item.prop]=='1'">
                      <el-radio-group v-model="scope.row[item.prop]">
                        <el-radio label="5">停诊</el-radio>
                      </el-radio-group>
                    </template>
                    <!--<template v-else>{{scope.row[item.prop]}}</template>-->
                    <template v-else>{{ scope.row[item.prop] }}</template>
                  </template>
                  <template v-else-if="item.prop == 'doctorId'&&scope.row.scheduleType=='1'">
                    <l-value-domain
                      clearable
                      :remoteUrl="'/wadmin/dept-doctor/'+searchData.deptId"
                      type="select"
                      :value.sync="scope.row[item.prop]"
                      remoteShowKey="uname"
                      remoteValueKey="uid"
                      placeholder
                      style="width:100%"
                      @change="docChange"
                    ></l-value-domain>
                  </template>
                  <template v-else-if="item.prop == 'workCode'">
                    <span
                      v-if="scope.row[item.prop]"
                      :val="scope.row[item.prop]"
                      code="doctorProfessionalTitle"
                      v-codeTransform
                    ></span>
                  </template>
                  <!-- 已加号数量 -->
                  <template v-else-if="item.prop == 'appendNum'">{{scope.row[item.prop]}}</template>
                  <!-- 加号数量 -->
                  <template v-else-if="item.prop == 'addNum'">
                    <el-input-number
                      v-model="scope.row[item.prop]"
                      :min="0"
                      :controls="false"
                      :disabled="!scope.row.scheduleId"
                      style="width: 100%"
                    ></el-input-number>
                  </template>
                  <!-- 确认加号 -->
                  <template v-else-if="item.prop == 'submitAdd'">
                    <el-button
                      type="text"
                      :disabled="!scope.row.scheduleId"
                      @click="submitAdd(scope.row)"
                    >加号</el-button>
                  </template>
                  <template v-else-if="item.prop == 'diagTreatType'">
                    <l-value-domain
                      clearable
                      style="width: 100%"
                      :value.sync="scope.row[item.prop]"
                      remoteUrl="/appointment/diagTreatType/selectDiagTreatTypePO?recordStatus=1"
                      type="select"
                      remoteShowKey="diagTreatTypeName"
                      remoteValueKey="diagTreatTypeCode"
                      placeholder
                      @change="diagTreatTypeChange(scope.row,scope.$index)"
                    ></l-value-domain>
                  </template>
                  <template v-else-if="item.prop == 'classesId'">
                    <l-value-domain
                      clearable
                      style="width: 100%"
                      :value.sync="scope.row[item.prop]"
                      remoteUrl="/appointment/class/selectCalss?recordStatus=1"
                      type="select"
                      remoteShowKey="className"
                      remoteValueKey="classId"
                      placeholder
                      @change="classesIdChange(scope.row,scope.$index)"
                    ></l-value-domain>
                  </template>
                  <!-- 门诊部门 -->
                  <template v-else-if="item.prop == 'apptDept'">
                    <l-value-domain
                      clearable
                      style="width: 100%"
                      :value.sync="scope.row[item.prop]"
                      remoteUrl="/appointment/dictValue/getDictValueList?dictItemCode=A0003&recordStatus=1"
                      type="select"
                      remoteShowKey="dictName"
                      remoteValueKey="dictCode"
                      placeholder
                    ></l-value-domain>
                  </template>
                  <template v-else-if="item.prop=='dutyStartTime'||item.prop=='dutyStopTime'">
                    <el-time-picker
                      v-model="scope.row[item.prop]"
                      :clearable="false"
                      format="HH:mm"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder
                      style="width:100%;"
                    ></el-time-picker>
                  </template>
                  <template v-else-if="item.prop == 'roomId'">
                    <l-value-domain
                      clearable
                      style="width: 100%"
                      :value.sync="scope.row[item.prop]"
                      :remoteParams="roomIdParams"
                      remoteUrl="/appointment/roomStation/params"
                      type="select"
                      remoteShowKey="dataName"
                      remoteValueKey="id"
                      placeholder
                      :disabled="scope.row.pRoomId"
                    ></l-value-domain>
                  </template>
                  <template v-else-if="item.prop=='isOnline'">
                    <el-radio-group v-model="scope.row[item.prop]">
                      <el-radio label="1">是</el-radio>
                      <el-radio label="2">否</el-radio>
                    </el-radio-group>
                  </template>
                  <template v-else-if="item.prop=='unifyPool'">
                    <el-radio-group
                      v-model="scope.row[item.prop]"
                      @change="unifyPoolChange(scope.row,scope.$index)"
                    >
                      <el-radio label="1">是</el-radio>
                      <el-radio label="2">否</el-radio>
                    </el-radio-group>
                  </template>
                  <template v-else-if="item.prop == 'sdeptLimitNum'&&scope.row.tag=='1'">
                    <el-input-number
                      v-model="scope.row[item.prop]"
                      :min="0"
                      style="width: 100%"
                      :controls="false"
                      @blur="sdeptLimitNumBlur(scope.row,scope.$index)"
                    ></el-input-number>
                  </template>
                  <template v-else-if="item.prop == 'allowAppendNum'">
                    <el-input-number
                      v-model="scope.row[item.prop]"
                      :min="0"
                      :controls="false"
                      style="width: 100%"
                    ></el-input-number>
                  </template>
                  <template v-else-if="item.prop=='apptLimitNum'&&scope.row.tag=='1'">
                    <el-input-number
                      v-model="scope.row[item.prop]"
                      :min="0"
                      :controls="false"
                      style="width: 100%"
                    ></el-input-number>
                  </template>
                  <template v-else>
                    <el-input-number
                      v-model="scope.row[item.prop]"
                      :min="0"
                      :controls="false"
                      style="width: 100%"
                      :disabled="scope.row['unifyPool'] == '1'"
                    ></el-input-number>
                  </template>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 弹窗 -->
      <el-dialog title="保存模板" :visible.sync="dialogVisible" width="17%" :before-close="handleClose">
        <div class="width100 padding10">
          <span>科室名称：</span>
          <span
            class="deptName"
            tableName="sys_org"
            :conditionMap="{
                org_type: '_DEPT_',
                id: searchData.deptId
              }"
            columns="org_nm"
            v-tableTransform
          ></span>
          <el-table
            :data="weekTableData"
            stripe
            border
            style="width: 100%;margin-top:10px;"
            @selection-change="getRowsIdx"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="week" label="日期"></el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="seaveTemplate">保存</el-button>
        </span>
      </el-dialog>
      <!-- 弹窗 -->
      <el-dialog title="引用模板" :visible.sync="dialogVisibleTwo" width="17%">
        <div class="width100 padding10">
          <span>科室名称：</span>
          <span
            class="deptName"
            tableName="sys_org"
            :conditionMap="{
                org_type: '_DEPT_',
                id: searchData.deptId
              }"
            columns="org_nm"
            v-tableTransform
          ></span>
          <el-table
            ref="templateTable"
            :data="templateWeek"
            stripe
            border
            style="width: 100%;margin-top:10px;"
            @selection-change="getRowsIdxTwo"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="week" label="日期">
              <template slot-scope="scope">
                <span v-if="scope.row.list && scope.row.list.length <= 0">
                  {{scope.row.week}}
                  <span class="span-table">{{"(空模板)"}}</span>
                </span>
                <span v-else>{{scope.row.week}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleTwo = false">取 消</el-button>
          <el-button type="primary" @click="useTemplate">确定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- <div
      class="tool-box float-right height100"
      :style="{'width': toolBoxStatus ? '287px' : '46px'}"
    >-->
    <!-- </div> -->
  </div>
</template>
<script>
import ToolBox from "@/views/public/tools";
import { mapActions, mapGetters } from "vuex";
import scheManagement from "@/api/schedule/scheduleManagement.js";
import finDictionary from "@/api/financeManagement/finDictionary";
export default {
  name: "indexNew",
  data() {
    return {
      //工具箱
      boxs: [],
      defaultBoxName: "scheTemps",
      toolBoxStatus: false,
      // 科室ID
      searchData: {
        deptId: 92
      },
      currentWeek: "", //当前第几周
      currentWeekList: [], //当前周日期
      dateList: [], //日期
      weekIndex: 0, //周时间序列
      // 当前tab
      currentTabs: "",
      // 表格
      schedulingParams: [
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "100"
        },
        {
          prop: "operate",
          label: "操作",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "200"
        },
        {
          prop: "scheduleType",
          label: "排班类型",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "100"
        },
        {
          prop: "doctorId",
          label: "医生姓名",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "140"
        },
        {
          prop: "workCode",
          label: "职称",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "100"
        },
        {
          prop: "diagTreatType",
          label: "诊疗类型",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "160"
        },
        {
          prop: "classesId",
          label: "出诊班次",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120"
        },
        {
          prop: "apptDept",
          label: "门诊部门",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "160"
        },
        {
          prop: "dutyStartTime",
          label: "开诊时间",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "160"
        },
        {
          prop: "dutyStopTime",
          label: "结束时间",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "160"
        },
        {
          prop: "roomId",
          label: "坐诊诊室",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "130"
        },
        // {
        //   prop: "reserveNum",
        //   label: "预留号源",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false,
        //   width: "90"
        // },
        // {
        //   prop: "sdeptLimitNum",
        //   label: "总号源数",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false,
        //   width: "90"
        // },
        {
          prop: "apptLimitNum",
          label: "预约号源数",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "110"
        },
        {
          prop: "sdeptLimitNum",
          label: "挂号号源数",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "110"
        }
        // {
        //   prop: "allowAppendNum",
        //   label: "允许加号数",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false,
        //   width: "100"
        // },
        // {
        //   prop: "appendNum",
        //   label: "已加号数量",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false,
        //   width: "100"
        // },
        // {
        //   prop: "addNum",
        //   label: "加号数量",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false,
        //   width: "90"
        // },
        // {
        //   prop: "submitAdd",
        //   label: "确认加号",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false,
        //   width: "90"
        // }
        // {
        //   prop: "isOnline",
        //   label: "互联网排班",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false,
        //   width: "100"
        // },
        // {
        //   prop: "unifyPool",
        //   label: "统一号源池",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false,
        //   width: "100"
        // }
      ],
      // 表格数据
      schedulingData: [],
      // 表格loading
      loading: false,
      // 查询诊室参数
      roomIdParams: { dataType: 3, recordStatus: "1" },
      channelData: [], //渠道列表
      // 删除的排班集合
      deleteArr: [],
      // 弹窗
      dialogVisible: false,
      dialogVisibleTwo: false,
      // 选中集合
      checkList: [],
      // 周几集合
      weekTableData: [
        {
          week: "周一"
        },
        {
          week: "周二"
        },
        {
          week: "周三"
        },
        {
          week: "周四"
        },
        {
          week: "周五"
        },
        {
          week: "周六"
        },
        {
          week: "周日"
        }
      ],
      // 当前科室对象
      deptObj: {},
      // 模板明细
      templateDetail: [],
      // 模板周几集合
      templateWeek: [
        {
          week: "周一",
          list: []
        },
        {
          week: "周二",
          list: []
        },
        {
          week: "周三",
          list: []
        },
        {
          week: "周四",
          list: []
        },
        {
          week: "周五",
          list: []
        },
        {
          week: "周六",
          list: []
        },
        {
          week: "周日",
          list: []
        }
      ],
      // 选中模板集合
      checkListTwo: [],
      currentIndex: 0,

      // 要保存的数据集合
      delList: [],
      updateList: [],
      updateData: {} // 待更新数据
    };
  },
  watch: {
    dateList: {
      handler(val) {
        this.$nextTick(() => {
          this.$refs.scheduleTable[this.currentIndex].doLayout();
        });
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    await this.getDateList(this.weekIndex);
    console.log(this.dateList);
    // this.currentTabs = this.dateList[0].date;
    this.currentTabs = new Date().format("yyyy-MM-dd");
    await this.changeSdept({
      deptId: this.searchData.deptId,
      startDate: this.dateList[0].date,
      stopDate: this.dateList[6].date,
      isGet: new Date()
    });
    this.currentWeek = this.whichWeek(this.dateList[0].date);
    await this.getChannel();
    this.toolBoxStatus = false;
    await this.getSchedulingData();
    this.toolBoxStatus = false;
  },
  async mounted() {
    this.getDictionaryPOsByPage();
  },
  methods: {
    ...mapActions({
      changeSdept: "base/changeSdept"
    }),
    //监听工具箱
    toolBoxMessage() {},
    // 切换tabs
    handleClick(tab, event) {
      // console.log(this.currentTabs);
      for (let i in this.dateList) {
        if (this.dateList[i].name === this.currentTabs) {
          this.currentIndex = i;
        }
      }
    },
    async getDictionaryPOsByPage() {
      let res = await finDictionary.getDictionaryPOsByPage({
        pageNo: 1, // 页码
        pageSize: 9999, // 页码大小
        recordStatus: 1
      });
    },
    // 切换科室
    async deptChange() {
      this.changeSdept({
        deptId: this.searchData.deptId,
        startDate: this.dateList[0].date,
        stopDate: this.dateList[6].date,
        isGet: new Date()
      });
      this.getSchedulingData();
      // 查询科室名称
      try {
        let deptObj = await scheManagement.queryDept({
          deptId: this.searchData.deptId
        });
        this.deptObj = deptObj.data[0];
        console.info(this.deptObj);
      } catch (error) {
        this.$message.error(error.msg || "查询科室名称失败");
      }
    },
    // 关闭弹窗
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 选择周几
    getRowsIdx(rows) {
      this.checkList = [...rows];
    },
    getRowsIdxTwo(rows) {
      this.checkListTwo = [...rows];
    },
    //查询排班列表
    async getSchedulingData() {
      this.sourceData = [];
      this.dateListSec = [];
      this.schedulingData = [];
      this.deleteArr = [];
      this.$showLoading();
      try {
        let params = {
          ouptDeptId: this.searchData.deptId,
          startDate: this.dateList[0].date + " 00:00:00",
          stopDate: this.dateList[6].date + " 23:59:59"
        };
        let data = await scheManagement.getScheduleAndSon(params);
        if (data.code == "1") {
          /*if (data.data.length <= 0) {
              this.isNewScheduling = '1';//新增
            } else {
              this.isNewScheduling = '0';//编辑
            }*/
          let tempData = [...data.data];
          tempData.forEach((item1, index1) => {
            item1.tag = "1";
            if (item1.doctorSchedules) {
              item1.doctorSchedules.forEach((item2, index2) => {
                item2.tag = "2";
              });
            }
          });
          this.sourceData = tempData;
          console.log(this.sourceData);
          await this.handleChannel();
          // 修复表格错乱
          this.$nextTick(() => {
            this.$refs.scheduleTable[this.currentIndex].doLayout();
          });
        } else {
          this.$message.error(data.msg || "获取排班列表失败");
        }
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "获取排班列表失败");
      }
    },
    //处理渠道数据与表格数据
    // eslint-disable-next-line complexity
    handleChannel() {
      let tableData = [...this.sourceData];
      // 渠道
      for (let i in tableData) {
        let item = tableData[i];
        if (
          item.numPercentageDetailPOs &&
          item.numPercentageDetailPOs.length > 0
        ) {
          for (let j in item.numPercentageDetailPOs) {
            let channelId = item.numPercentageDetailPOs[j].channelId;
            let channelNum = item.numPercentageDetailPOs[j].channelNum;
            item[channelId] = Number(channelNum);
          }
        }
      }
      // 表格
      // 重置dateList 中 dataList
      this.dateList.forEach(val => {
        val.dataList = [];
      });
      let dateList = JSON.parse(JSON.stringify(this.dateList));
      for (let i in tableData) {
        for (let j in dateList) {
          if (
            this.strSplit(tableData[i].dutyStartTime, " ")[0] ==
            dateList[j].date
          ) {
            if (!tableData[i]["operate"]) {
              tableData[i]["operate"] = "0";
            }
            //
            if (
              tableData[i].doctorSchedules &&
              tableData[i].doctorSchedules.length
            ) {
              for (let z in tableData[i].doctorSchedules) {
                if (!tableData[i].doctorSchedules[z]["operate"]) {
                  tableData[i].doctorSchedules[z]["operate"] = "0";
                }
              }
            }
            //
            dateList[j].dataList.push({ ...tableData[i] });
          }
        }
      }
      this.dateList = [...dateList];
    },
    //查询渠道列表
    async getChannel() {
      this.$showLoading();
      try {
        let data = await scheManagement.getSelectNumPercentageDict();
        if (data.code == "1") {
          this.channelData = [...data.data];
          // await this.handleChannelParams();
        } else {
          this.$message.error(data.msg || "获取渠道列表失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取渠道列表失败");
      }
    },
    //处理渠道表头
    handleChannelParams() {
      let data = [...this.channelData];
      let params = [];
      for (let i in data) {
        params.push({
          prop: data[i].channelId,
          label: data[i].channelName,
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "90"
        });
      }
      let schedulingParams = JSON.parse(JSON.stringify(this.schedulingParams));
      schedulingParams = schedulingParams.concat(params);
      this.schedulingParams = schedulingParams;
      // console.log(schedulingParams);
    },
    //统一号源池渠道值为总号源数
    unifyPoolChange(row, index) {
      if (row.unifyPool == "1") {
        let data = [...this.channelData];
        for (let i in data) {
          row[data[i]["channelId"]] = row.sdeptLimitNum;
        }
      } else {
        this.sdeptLimitNumBlur(row, index);
      }
    },
    // 添加排班
    async add() {
      this.dateList.forEach(val => {
        if (val.date == this.currentTabs) {
          // 验证
          let flag = this.getValSchedule(val);
          console.info(flag);
          if (flag == false) {
            return;
          }
          val.dataList.push({
            scheduleId: new Date().getTime(),
            doctorSchedules: [],
            tag: "1",
            operate: "1",
            isNew: "1",
            scheduleType: "1",
            date: val.date,
            dutyStartTime: val.date + " 00:00:00",
            dutyStopTime: val.date + " 23:59:59",
            deptId: this.searchData.deptId,
            ouptDeptId: this.searchData.deptId,
            recordStatus: "",
            workCode: "1737",
            appendNum: "0",
            sdeptLimitNum: "0",
            unifyPool: "1",
            isOnline: "2"
          });
        }
      });
    },
    //根据班次查询开诊时间
    async classesIdChange(row, index) {
      if (row.classesId) {
        let params = {
          classId: row.classesId
        };
        await scheManagement.getTimeByclassId(params).then(res => {
          if (res.code == "1") {
            row.dutyStartTime =
              row.dutyStartTime.substring(0, 10) + " " + res.data.dutyStartTime;
            row.dutyStopTime =
              row.dutyStopTime.substring(0, 10) + " " + res.data.dutyStopTime;
          }
        });
        if (row.diagTreatType) {
          // this.diaTypeChange(row, index);
        }
      }
      // 验证 一个时间段内一名医生只能有一个排班
      // to do
      // this.dateList.forEach(val => {
      //   if (val.date == row.date) {
      //     val.dataList.forEach(item => {
      //       if (row.doctorId == item.doctorId && !item.isNew) {
      //         let sDate = new Date(
      //           row.dutyStartTime.replace(/-/g, "/")
      //         ).getTime();
      //         let eDate = new Date(
      //           row.dutyStopTime.replace(/-/g, "/")
      //         ).getTime();
      //         let ssDate = new Date(
      //           item.dutyStartTime.replace(/-/g, "/")
      //         ).getTime();
      //         let eeDate = new Date(
      //           item.dutyStopTime.replace(/-/g, "/")
      //         ).getTime();

      //         if (eDate <= sDate) {
      //           this.$message.error(
      //             "医生排班坐诊结束时间段不能小于坐诊开始时间"
      //           );
      //         }
      //         if (
      //           (sDate < eeDate && sDate > ssDate) ||
      //           (eDate > ssDate && eDate < eeDate) ||
      //           (sDate == ssDate && eDate == eeDate)
      //         ) {
      //           console.log(sDate, ssDate, eDate, eeDate);
      //           this.$message.error("医生排班坐诊时间段不能有重叠1");
      //         }
      //       }
      //     });
      //   }
      // });
    },
    //编辑改变医生
    docChange(value, obj) {
      this.dateList.forEach(val => {
        if (val.date == this.currentTabs) {
          val.dataList.forEach(item => {
            if (item.doctorId == value && item.recordStatus != "1") {
              item.workCode = obj.workType;
            }
            if (item.doctorSchedules && item.doctorSchedules.length > 0) {
              item.doctorSchedules.forEach(item2 => {
                if (item2.doctorId == value && item2.recordStatus != "1") {
                  item2.workCode = obj.workType;
                }
              });
            }
          });
        }
      });
    },
    //根据班次与诊疗类型查询号源数
    diaTypeChange(row, index) {
      let params = {
        diagTreatTypeCode: row.diagTreatType,
        classId: row.classesId
      };
      scheManagement.getNumByclassIdTypeCode(params).then(res => {
        if (res.code == "1") {
          row.allowAppendNum = res.data[0].appendNumLimit;
          row.sdeptLimitNum = res.data[0].classNum;
          this.sdeptLimitNumBlur(row, index);
        }
      });
    },
    //渠道按比例分配
    sdeptLimitNumBlur(row, index) {
      for (let i in this.channelData) {
        for (let j in row["numPercentage"]) {
          if (
            this.channelData[i].channelId == row["numPercentage"][j].channelId
          ) {
            if (row.unifyPool == "1") {
              row[this.channelData[i].channelId] = Number(row.sdeptLimitNum);
            } else {
              row[this.channelData[i].channelId] = Math.floor(
                Number(row.sdeptLimitNum) *
                  Number(row["numPercentage"][j].channelPercentage)
              );
            }
          }
        }
      }
    },
    //清空所有
    async deleteAll() {
      this.$showLoading();
      try {
        let params = {
          ouptDeptId: this.searchData.deptId,
          startDate: this.dateList[0].date + " 00:00:00",
          stopDate: this.dateList[6].date + " 23:59:59"
        };
        let data = await scheManagement.removeSchheduling(params);
        if (data.code == "1") {
          this.$message("清空成功");
          this.getSchedulingData();
        } else {
          this.$message.error(data.msg || "清空失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "清空失败");
      }
    },
    //通过诊疗类型获得号源比例
    diagTreatTypeChange(row, index) {
      if (row.diagTreatType) {
        let params = {
          diagTreatTypeCode: row.diagTreatType
        };
        scheManagement.getNumPercentage(params).then(res => {
          if (res.code == "1") {
            let data = res.data;
            let arr = [];
            for (let i in data) {
              for (let j in this.channelData) {
                if (data[i].channelId == this.channelData[j].channelId) {
                  arr.push({
                    channelId: data[i].channelId,
                    channelPercentage: data[i].channelPercentage
                  });
                }
              }
            }
            this.$set(row, "numPercentage", arr);
            if (Number(row["sdeptLimitNum"]) > 0) {
              this.sdeptLimitNumBlur(row, index);
            }
          }
        });
        if (row.classId) {
          // this.diaTypeChange(row, index);
        }
      }
    },
    //删除
    async delteItem(row, index) {
      console.log(index);
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        console.log(this.dateList);
        this.dateList.forEach(async val => {
          if (val.date == this.currentTabs) {
            for (let i = 0; i < val.dataList.length; i++) {
              if (row.scheduleId == val.dataList[i].scheduleId) {
                await this.$delete(val.dataList, i);
                break;
              }
              if (val.dataList[i].doctorSchedules) {
                for (
                  let j = 0;
                  j < val.dataList[i].doctorSchedules.length;
                  j++
                ) {
                  if (
                    row.scheduleId ==
                    val.dataList[i].doctorSchedules[j].scheduleId
                  ) {
                    await this.$delete(val.dataList[i].doctorSchedules, j);
                    break;
                  }
                }
              }
            }
          }
        });
        if (
          row.scheduleId != "" &&
          row.scheduleId != null &&
          row.scheduleId != undefined &&
          !row.isNew
        ) {
          // this.deleteArr.push({
          //   ...row,
          //   deletedStatus: "1"
          // });
          try {
            this.$showLoading();
            await scheManagement.delScheduleById(row.scheduleId);
            this.$message({ type: "success", message: "删除成功" });
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "删除失败");
          }
        }
      });
    },
    //编辑
    editItem(row, index) {
      // let endTime = new Date(row.dutyStopTime).getTime();
      // let nowTime = new Date().getTime();
      // if (endTime < nowTime) {
      //   this.$message("该排班结束时间早于当前时间，不能编辑");
      //   return;
      // }
      // 验证 是否可以编辑 to do
      if (row.recordStatus == "1") {
        this.$message("该排班已发布不能编辑");
        return;
      }
      row.operate = "1";
      if(row.scheduleId){
        this.updateData[row.scheduleId] = true;
      }
      
    },
    //添加子排班
    addSonSchedul(row, index) {
      this.dateList.forEach(val => {
        if (val.date == this.currentTabs) {
          // 验证
          let flag = this.getValSchedule(val);
          console.info(flag);
          if (flag == false) {
            return;
          }
          if (!row.doctorSchedules) {
            this.$set(row, "doctorSchedules", []);
          }
          row.doctorSchedules.push({
            scheduleId: new Date().getTime(),
            tag: "2",
            operate: "1",
            isNew: "1",
            date: val.date,
            scheduleType: "1",
            pRoomId: row.roomId,
            roomId: row.roomId ? row.roomId : "",
            dutyStartTime: row.dutyStartTime
              ? row.dutyStartTime
              : val.date + " 00:00:00",
            dutyStopTime: row.dutyStopTime
              ? row.dutyStopTime
              : val.date + " 23:59:59",
            deptId: this.searchData.deptId,
            ouptDeptId: this.searchData.deptId,
            recordStatus: "",
            workCode: "1737",
            appendNum: "0",
            unifyPool: "1",
            isOnline: "2",
            apptDept: row.apptDept ? row.apptDept : "", //门诊部门
            diagTreatType: row.diagTreatType, //诊疗类型
            classesId: row.classesId //出诊班次
          });
        }
      });
    },
    //完成
    editCommit(row, index) {
      // 验证是否可以保存 to do
      let flag = true;
      this.dateList.forEach(val => {
        if (val.date == row.date) {
          val.dataList.forEach(item => {
            flag = this.valSchedule(row, val);
          });
        }
      });
      if (flag) {
        row.operate = "0";
      }
    },
    //保存
    async saveStage() {
      for (let i = 0; i < this.dateList.length; i++) {
        // 验证
        let flag = this.getValSchedule(this.dateList[i]);
        console.info(flag);
        if (flag == false) {
          return;
        }
      }
      //给每个排班整理时间，如果结束时间早于开始时间，那么结束时间的年月日=开始时间的年月日+1
      this.dateList.forEach(item1 => {
        item1.dataList.forEach(item2 => {
          if( new Date(item2.dutyStartTime).getTime() > new Date(item2.dutyStopTime).getTime()){
            item2.dutyStopTime = new Date(new Date(item2.dutyStartTime).getTime() + 24 * 60 * 60 * 1000).format("yyyy-MM-dd") + " " + item2.dutyStopTime.substring(11,19)
          }
          if(item2.doctorSchedules){
            item2.doctorSchedules.forEach(item3 => {
              if( new Date(item3.dutyStartTime).getTime() > new Date(item3.dutyStopTime).getTime()){
                item3.dutyStopTime = new Date(new Date(item3.dutyStartTime).getTime() + 24 * 60 * 60 * 1000).format("yyyy-MM-dd") + " " + item3.dutyStopTime.substring(11,19)
              }
            })
          }
        })
      })

      //end
      this.$showLoading();
      try {
        // 本周排班全部数据
        let arr = await this.handelSchedulingEnd();
        // 过滤未修改的数据（只要更新删除增加数据）
        let savelist = await this.getSaveScheduleList(arr)
        console.log(arr);
        let data = await scheManagement.AddScheduleAndPercentage(savelist);
        if (data.code == "1") {
          this.$message("保存成功");
          this.getSchedulingData();
        } else {
          this.$message.error(data.msg || "保存失败");
        }
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "保存失败");
      }
    },
    // 过滤排班数据 拿到要保存的数据
    getSaveScheduleList(arr){
      let data = [...arr];
      // this.dateList.forEach(val => {
      //   // data = data.concat(val.dataList);
      //   val.dataList.forEach(item => {
      //     if (item.recordStatus != "1") {
      //       data.push(item);
      //     }
      //   });
      // });
      let saveList = [];
      console.info(data)
      // 拿出待 新增 修改 删除的排班
      data.forEach(val => {
        if(!val.scheduleId || this.updateData[val.scheduleId]){
          if(val.scheduleType == '2' && val.doctorSchedules && val.doctorSchedules.length > 0){
            let sonList = [];
            val.doctorSchedules.forEach(item => {
                if(!item.scheduleId || this.updateData[item.scheduleId]){
                  sonList.push(item);
                }
            })
            val.doctorSchedules = sonList;
          }
          saveList.push(val);
        }else{
          if(val.scheduleType == '2' && val.doctorSchedules && val.doctorSchedules.length > 0){
            let sonList = [];
            val.doctorSchedules.forEach(item => {
                if(!item.scheduleId || this.updateData[item.scheduleId]){
                  sonList.push(item);
                }
            })
            val.doctorSchedules = sonList;
            saveList.push(val);
          }
        }
      });
      return saveList;
    },
    //更新排班数据处理
    // eslint-disable-next-line complexity
    handelSchedulingEnd() {
      let data = [];
      this.dateList.forEach(val => {
        // data = data.concat(val.dataList);
        val.dataList.forEach(item => {
          if (item.recordStatus != "1") {
            data.push(item);
          }
        });
      });
      data = JSON.parse(JSON.stringify(data.concat(this.deleteArr)));
      //保存
      let newArr = [];
      for (let i in data) {
        let item = data[i];
        if (
          !(
            !item.doctorId &&
            !item.diagTreatType &&
            !item.classesId &&
            // !item.roomId &&
            !item.sdeptLimitNum &&
            !item.unifyPool &&
            !item.allowAppendNum
          )
        ) {
          let newItem = JSON.parse(JSON.stringify(item));
          let numPercentageDetailPOs = [];
          for (let k in this.channelData) {
            for (let v in newItem) {
              if (this.channelData[k].channelId == v) {
                numPercentageDetailPOs.push({
                  channelId: v,
                  channelNum: newItem[v]
                });
                this.$delete(newItem, v);
              }
            }
          }
          newItem["numPercentageDetailPOs"] = numPercentageDetailPOs;
          //
          console.log(newItem);
          if (newItem.isNew) {
            this.$delete(newItem, "scheduleId");
          }
          if (newItem.doctorSchedules) {
            newItem.doctorSchedules.forEach((item, index) => {
              if (item.isNew) {
                this.$delete(item, "scheduleId");
              }
            });
          }
          //
          this.$delete(newItem, "date");
          this.$delete(newItem, "index");
          this.$delete(newItem, "isNew");
          this.$delete(newItem, "mergeIndex");
          this.$delete(newItem, "operate");
          this.$delete(newItem, "numPercentage");
          newArr.push(newItem);
        }
      }
      return newArr;
    },
    // 确认加号
    async submitAdd(val) {
      try {
        if (!val.addNum || val.addNum == 0) {
          this.$message("请输入加号数量");
        } else if (
          !val.scheduleId ||
          val.scheduleId && val.recordStatus != "1"
        ) {
          this.$message("该排班未发布，不能加号");
          val.addNum = 0;
        } else if (val.allowAppendNum < val.appendNum + val.addNum) {
          this.$message.error("总加号数量不能超过允许加号数");
          val.addNum = 0;
        } else {
          this.$showLoading();
          let obj = { ...val };
          obj.appendNum = obj.appendNum + obj.addNum;
          let res = await scheManagement.addNum(obj);
          this.$hideLoading();
          if (res.code == "1") {
            this.$message({ message: "加号成功", type: "success" });
            val.addNum = 0;
            this.getSchedulingData();
          }
        }
      } catch (error) {
        this.$message.error(error.msg || "加号失败");
      }
    },
    // 保存排班模板
    async seaveTemplate() {
      try {
        // if (this.checkList.length < 0) {
        //   this.$message.error("请选择日期");
        //   return;
        // }
        this.$showLoading();
        let list = [];
        this.checkList.forEach(val => {
          this.dateList.forEach(item => {
            if (item.week == val.week) {
              item.dataList.forEach(obj => {
                obj.week = item.week;
              });
              list = list.concat(item.dataList);
            }
          });
        });
        let params = {
          sdeptId: this.searchData.deptId,
          templateType: "1",
          recordStatus: "1",
          scheduleTemplateName: this.deptObj.deptName,
          scheduleTemplateDetailVOs: list
        };
        let data = await scheManagement.saveSchhedulingTemp(params);
        this.dialogVisible = false;
        this.$message({ type: "success", message: "保存成功" });
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.dialogVisible = false;
        this.$message.error(error.msg || "保存模板失败");
      }
    },
    // 查询模板
    async getTemplate() {
      try {
        this.$showLoading();
        let res = await scheManagement.getScheduleTemplate({
          sdeptId: this.searchData.deptId
        });
        let detail = await scheManagement.selectScheduleDetail({
          scheduleTemplateId: res.data[0].templateId
        });
        this.templateDetail = detail.data;
        let obj = {};
        // this.templateWeek = [];
        // detail.data.forEach(val => {
        //   if (!obj[val.week]) {
        //     obj[val.week] = val.week;
        //     this.templateWeek.push({
        //       week: val.week
        //     });
        //   } else {
        //     obj[val.week] = true;
        //   }
        // });
        detail.data.forEach(val => {
          this.templateWeek.forEach(item => {
            if (val.week == item.week) {
              item.list.push(val);
            }
          });
        });

        this.$hideLoading();
        this.dialogVisibleTwo = true;
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.dialogVisibleTwo = false;
        this.$message.error(error.msg || "查询模板失败");
      }
    },
    // 应用模板
    useTemplate() {
      if (this.checkListTwo.length < 1) {
        this.$message.error("请选择要引用模板的日期");
        return;
      }
      this.sourceData = [];

      this.checkListTwo.forEach(item => {
        this.dateList.forEach(val => {
          if (val.week == item.week) {
            val.dataList = [];
            item.list.forEach(obj => {
              obj.operate = "0";
              if (
                obj.numPercentageDetailPOs &&
                obj.numPercentageDetailPOs.length > 0
              ) {
                for (let j in obj.numPercentageDetailPOs) {
                  let channelId = obj.numPercentageDetailPOs[j].channelId;
                  let channelNum = obj.numPercentageDetailPOs[j].channelNum;
                  obj[channelId] = Number(channelNum);
                }
              }
              val.dataList.push(obj);
            });
          }
        });
      });
      // 清空引用的数据
      this.templateDetail = []; // 模板明细
      this.checkListTwo = []; //选中的模板
      this.templateWeek.forEach(item => {
        // 模板展示表格明细
        item.list = [];
      });
      this.$refs.templateTable.clearSelection(); // 清空选中状态
      this.dialogVisibleTwo = false;
      // this.handleChannel();
    },
    //算每周日期
    makeDate(n) {
      var now = new Date();
      var year = now.getFullYear();
      //因为月份是从0开始的,所以获取这个月的月份数要加1才行
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var day = now.getDay();
      //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
      if (day !== 0) {
        n = n + (day - 1);
      } else {
        n = n + day;
      }
      if (day) {
        //这个判断是为了解决跨年的问题
        if (month <= 1) {
          //这个判断是为了解决跨年的问题,月份是从0开始的
          year = year - 1;
          month = 12;
        }
        /*else {
            month = month;
          }*/
      }
      now.setDate(now.getDate() - n);
      year = now.getFullYear();
      month = now.getMonth() + 1;
      date = now.getDate();
      var s =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (date < 10 ? "0" + date : date);
      // console.log(s);
      return s;
    },
    //算某天为本年第几周
    whichWeek(n) {
      let arr = this.strSplit(n, "-");
      var now = new Date(arr[0], arr[1] - 1, arr[2]),
        year = now.getFullYear(),
        month = now.getMonth(),
        days = now.getDate();
      //那一天是那一年中的第多少天
      for (var i = 0; i < month; i++) {
        days += this.getMonthDays(year, i);
      }
      //那一年第一天是星期几
      var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

      var week = null;
      if (yearFirstDay == 1) {
        week = Math.ceil(days / yearFirstDay);
      } else {
        days -= 7 - yearFirstDay + 1;
        week = Math.ceil(days / 7) + 1;
      }
      return week;
    },
    getMonthDays(year, month) {
      return (
        [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] ||
        (this.isLeapYear(year) ? 29 : 28)
      );
    },
    isLeapYear(year) {
      return year % 400 == 0 || year % 4 == 0 && year % 100 != 0;
    },
    //切割字符串
    strSplit(data, sym) {
      if (data) {
        let arr = data.split(sym);
        return arr;
      }
      return [];
    },
    //当前需要的日期列表
    getDateList(num) {
      let arr = [];
      for (let i = 0; i < 7; i++) {
        let week = "";
        if (i == 0) {
          week = "周一";
        } else if (i == 1) {
          week = "周二";
        } else if (i == 2) {
          week = "周三";
        } else if (i == 3) {
          week = "周四";
        } else if (i == 4) {
          week = "周五";
        } else if (i == 5) {
          week = "周六";
        } else if (i == 6) {
          week = "周日";
        }
        arr.push({
          date: this.makeDate(num - i),
          week: week,
          dataList: []
        });
      }
      this.dateList = [...arr];
    },
    //获取上一周排班
    async getLastWeekSchedul() {
      this.weekIndex += 7;
      await this.getDateList(this.weekIndex);
      this.currentWeek = this.whichWeek(this.dateList[0].date);
      this.currentTabs = this.dateList[0].date;
      await this.changeSdept({
        deptId: this.searchData.deptId,
        startDate: this.dateList[0].date,
        stopDate: this.dateList[6].date,
        isGet: new Date()
      });
      await this.getSchedulingData();
    },
    //获取下一周排班
    async getNextWeekSchedul() {
      this.weekIndex -= 7;
      await this.getDateList(this.weekIndex);
      this.currentWeek = this.whichWeek(this.dateList[0].date);
      this.currentTabs = this.dateList[0].date;
      await this.changeSdept({
        deptId: this.searchData.deptId,
        startDate: this.dateList[0].date,
        stopDate: this.dateList[6].date,
        isGet: new Date()
      });
      await this.getSchedulingData();
    },
    // 得到验证对象 并验证
    getValSchedule(val) {
      let flag = true;
      val.dataList.forEach(item => {
        if (item.operate == "1") {
          flag = this.valSchedule(item, val);
          if (flag) {
            item.operate = "0";
          }
        }
      });
      return flag;
    },
    // 验证 字段
    // eslint-disable-next-line complexity
    valSchedule(val, obj) {
      if (!val.doctorId && val.scheduleType == "1") {
        this.$message.error("排班数据不完整，请选择医生");
        return false;
      }
      if (!val.diagTreatType) {
        this.$message.error("排班数据不完整，请选择诊疗类型");
        return false;
      }
      if (!val.classesId) {
        this.$message.error("排班数据不完整，请选择出诊班次");
        return false;
      }
      if (!val.apptDept) {
        this.$message.error("排班数据不完整，请选择门诊部门");
        return false;
      }
      if (!val.dutyStartTime) {
        this.$message.error("排班数据不完整，请选择开诊时间");
        return false;
      }
      if (!val.dutyStartTime) {
        this.$message.error("排班数据不完整，请选择停诊时间");
        return false;
      }
      // if (!val.roomId) {
      //   this.$message.error("排班数据不完整，请选择坐诊诊室");
      //   return false;
      // }
      if (!val.apptLimitNum && val.tag == "1") {
        this.$message.error("排班数据不完整，请填写预约号源");
        return false;
      }
      if (!val.sdeptLimitNum && val.tag == "1") {
        this.$message.error("排班数据不完整，请填写挂号号源数");
        return false;
      }
      // if (!val.allowAppendNum) {
      //   this.$message.error("排班数据不完整，请填写允许加号数");
      //   return false;
      // }
      // if (!val.isOnline) {
      //   this.$message.error("排班数据不完整，请选择是否互联网排班");
      //   return false;
      // }
      // if (!val.unifyPool) {
      //   this.$message.error("排班数据不完整，请选择是否统一号源池");
      //   return false;
      // }

      // 验证时间
      // for (let i = 0; i < obj.dataList.length; i++) {
      //   if (
      //     val.doctorId == obj.dataList[i].doctorId &&
      //     !obj.dataList[i].isNew
      //   ) {
      //     let sDate = new Date(val.dutyStartTime.replace(/-/g, "/")).getTime();
      //     let eDate = new Date(val.dutyStartTime.replace(/-/g, "/")).getTime();
      //     let ssDate = new Date(
      //       obj.dataList[i].dutyStartTime.replace(/-/g, "/")
      //     ).getTime();
      //     let eeDate = new Date(
      //       obj.dataList[i].dutyStartTime.replace(/-/g, "/")
      //     ).getTime();
      //     if (
      //       (sDate < eeDate && sDate > ssDate) ||
      //       (eDate > ssDate && eDate < eeDate) ||
      //       (sDate == ssDate && eDate == eeDate)
      //     ) {
      //       this.$message.error("医生排班坐诊时间段不能有重叠");
      //       return false;
      //     }
      //   }
      // }

      return true;
    },
    // 验证时间
    valTime(val, obj) {}
  }
};
</script>
<style lang="scss" scoped>
.span-table {
  margin-left: 10px;
  color: $l-color-text-secondary;
}
.center {
  width: 335px;
  height: 36px;
  display: inline-block;
  text-align: center;
  font-size: 18px;
  
  font-weight: bold;
  color: $l-color-fontcolor-3;
  line-height: 36px;
  /*vertical-align: top;*/
}
.left,
.right {
  width: 80px;
  height: 36px;
  border: 1px solid $l-color-bgcolor-11;
  display: inline-block;
  font-size: 14px;
  
  font-weight: 400;
  color: $l-color-fontcolor-3;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
}
.tableTabs {
  margin-top: 20px;
  height: calc(100% - 60px);
}
.weekBtu {
  // margin-left: 18%;
  display: flex;
  justify-content: center;
}
.deptName {
  font-weight: 600;
}
</style>
