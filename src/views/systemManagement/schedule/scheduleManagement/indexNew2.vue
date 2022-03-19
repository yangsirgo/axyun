<template>
  <el-card class="height100 width100">
    <div class="flex-box">
      <div class="fbc">
        <div class="flc">
          <LFormtTitle label="选择科室" style="width: 250px">
            <!-- <l-value-domain
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="searchData.deptId"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder
              defaultFirst
              @change="deptChange"
            ></l-value-domain> -->
            <el-select
              v-model="searchData.deptId"
              filterable
              placeholder="请输入科室名称"
              :loading="selLoading"
              @change="deptChange"
            >
              <el-option
                v-for="item in options"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
            </el-select>
          </LFormtTitle>
          <l-formt-title
            label="排班时间"
            style="width: 320px; margin-left: 10px"
          >
            <el-date-picker
              v-model="weekDate"
              :clearable="false"
              type="week"
              :format="sDate + '  至  ' + eDate"
              placeholder="选择周"
              :picker-options="pickerOptions"
              @change="weekDateChange"
            ></el-date-picker>
          </l-formt-title>
          <span style="margin-left: 10px"
            >本周起始：{{ new Date(makeDate(0)).format("MM-dd") }} ~
            {{ new Date(makeDate(-6)).format("MM-dd") }}</span
          >
        </div>
        <div>
          <el-button plain @click="toDealWith">停诊号源处理</el-button>
          <!-- <el-button plain @click="stopSchedule">停诊</el-button> -->
          <el-button plain @click="releaseScheduleNew">发布排班</el-button>
          <el-button @click="quote">引用模板</el-button>
          <el-button @click="save" type="primary">保存</el-button>
        </div>
      </div>
      <div class="table-box">
        <el-table
          ref="treeTable"
          :data="treeData"
          style="width: 100%"
          height="100%"
          row-key="scheduleId"
          border
          :tree-props="{ children: 'doctorSchedules' }"
          :row-class-name="tableRowClassName"
        >
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
              <template v-if="item.prop == 'name'">
                <template v-if="scope.row.tierType == 1">
                  <span
                    >{{ scope.row.name }}（{{
                      new Date(scope.row.date).format("MM-dd")
                    }}）</span
                  >
                </template>
                <template v-else-if="scope.row.tierType == 2">
                  <span>{{ scope.row.scheduleType == "1" ? "医" : "科" }}</span>
                </template>
                <template v-else-if="scope.row.tierType == 3">
                  <span>医</span>
                </template>
              </template>
              <template v-else-if="item.prop == 'check'">
                <el-checkbox
                  @change="checkboxChange(scope.row)"
                  v-if="scope.row.tierType == 2 || scope.row.tierType == 1"
                  v-model="scope.row.check"
                ></el-checkbox>
              </template>
              <template v-else-if="item.prop == 'recordStatus'">
                <span v-if="scope.row[item.prop] == '1'">发布</span>
                <span v-else-if="scope.row[item.prop] == '2'">暂存</span>
                <span v-else-if="scope.row[item.prop] == '5'">停诊</span>
                <span v-else-if="scope.row[item.prop] == '3'">驳回</span>
                <span v-else-if="scope.row[item.prop] == '4'">审核</span>
              </template>
              <template v-else-if="item.prop == 'operate'">
                <template v-if="scope.row.tierType == 1">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="添加排班"
                    placement="top"
                  >
                    <i
                      :disabled="contrast_time(scope.row.date)"
                      @click.stop="addParentSch(scope.row)"
                      :class="[
                        { disabled: contrast_time(scope.row.date) },
                        'el-icon-circle-plus-outline',
                      ]"
                    ></i>
                  </el-tooltip>

                  <!-- <el-button
                    @click="addParentSch(scope.row)"
                    :disabled="contrast_time(scope.row.date)"
                    type="text"
                  >添加排班</el-button> -->
                </template>
                <template v-if="scope.row.operate == '0'">
                  <template v-if="scope.row.tierType == 2">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="编辑"
                      placement="top"
                    >
                      <i
                        @click.stop="editItem(scope.row)"
                        class="el-icon-edit-outline"
                      ></i>
                    </el-tooltip>
                    &nbsp;
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="添加子排班"
                      placement="top"
                    >
                      <i
                        :disabled="doctorSchedulesfun(scope.row)"
                        @click.stop="addSonSch(scope.row)"
                        :class="[
                          { disabled: doctorSchedulesfun(scope.row) },
                          'el-icon-circle-plus-outline',
                        ]"
                      ></i>
                    </el-tooltip>
                    &nbsp;
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="删除"
                      placement="top"
                    >
                      <i
                        @click.stop="delSch(scope.row)"
                        class="el-icon-circle-close"
                      ></i>
                    </el-tooltip>
                    &nbsp;
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="停诊"
                      placement="top"
                    >
                      <i
                        @click.stop="stopSchedule(scope.row)"
                        class="el-icon-warning-outline"
                      ></i>
                    </el-tooltip>
                    &nbsp;
                    <!-- <el-tooltip v-if="scope.row.recordStatus == '1'" class="item" effect="dark" content="加号" placement="top">
                      <i @click.stop="appendNumClick(scope.row)" class="el-icon-s-fold"></i>
                    </el-tooltip> -->

                    <!-- <el-button @click="editItem(scope.row)" type="text">编辑</el-button> -->
                    <!-- <el-button
                      :disabled="doctorSchedulesfun(scope.row)"
                      @click="addSonSch(scope.row)"
                      type="text"
                    >添加子排班</el-button> -->
                    <!-- <el-button @click="delSch(scope.row)" type="text">删除</el-button>
                    <el-button
                      type="text"
                      v-if="scope.row.recordStatus == '1'"
                      @click="appendNumClick(scope.row)"
                    >加号</el-button> -->
                  </template>
                  <template v-if="scope.row.tierType == 3">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="编辑"
                      placement="top"
                    >
                      <i
                        @click.stop="editItem(scope.row)"
                        class="el-icon-edit-outline"
                      ></i>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="删除"
                      placement="top"
                    >
                      <i
                        @click.stop="delSch(scope.row)"
                        class="el-icon-circle-close"
                      ></i>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="停诊"
                      placement="top"
                    >
                      <i
                        @click.stop="stopSchedule(scope.row)"
                        class="el-icon-warning-outline"
                      ></i>
                    </el-tooltip>
                    <!-- <el-button type="text" @click.stop="editItem(scope.row)">
                      编辑
                    </el-button>
                    <el-button type="text" @click.stop="delSch(scope.row)">
                      删除
                    </el-button> -->
                  </template>
                </template>
                <template v-if="scope.row.operate == '1'">
                  <template v-if="scope.row.tierType == 2">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="完成"
                      placement="top"
                    >
                      <i
                        @click.stop="overItem(scope.row)"
                        class="el-icon-circle-check"
                      ></i>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="删除"
                      placement="top"
                    >
                      <i
                        @click.stop="delSch(scope.row)"
                        class="el-icon-circle-close"
                      ></i>
                    </el-tooltip>
                    <!-- <el-tooltip v-if="scope.row.recordStatus == '1'" class="item" effect="dark" content="加号" placement="top">
                      <i @click.stop="appendNumClick(scope.row)" class="el-icon-s-fold"></i>
                    </el-tooltip> -->
                    <!-- <el-button type="text" @click.stop="overItem(scope.row)">
                      完成
                    </el-button>
                    <el-button type="text" @click.stop="delSch(scope.row)">
                      删除
                    </el-button>
                    <el-button v-if="scope.row.recordStatus == '1'" type="text" @click.stop="appendNumClick(scope.row)">
                      加号
                    </el-button> -->
                  </template>
                  <template v-if="scope.row.tierType == 3">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="完成"
                      placement="top"
                    >
                      <i
                        @click.stop="overItem(scope.row)"
                        class="el-icon-circle-check"
                      ></i>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="删除"
                      placement="top"
                    >
                      <i
                        @click.stop="delSch(scope.row)"
                        class="el-icon-circle-close"
                      ></i>
                    </el-tooltip>
                    <!-- <el-button type="text" @click.stop="overItem(scope.row)">
                      完成
                    </el-button>
                    <el-button type="text" @click.stop="delSch(scope.row)">
                      删除
                    </el-button> -->
                  </template>
                </template>
              </template>
              <template v-else-if="item.prop == 'scheduleType'">
                <template v-if="scope.row.operate == '0'">
                  <span v-if="scope.row.scheduleType == '1'">医生</span>
                  <span v-if="scope.row.scheduleType == '2'">科室</span>
                </template>
                <template v-if="scope.row.operate == '1'">
                  <el-select
                    v-model="scope.row.scheduleType"
                    :disabled="
                      scope.row.tierType == 3 ||
                      (scope.row.doctorSchedules &&
                        scope.row.doctorSchedules.length > 0)
                    "
                    placeholder="请选择"
                    @change="scheduleTypeChange(scope.row)"
                  >
                    <el-option label="医生" value="1"></el-option>
                    <el-option label="科室" value="2"></el-option>
                  </el-select>
                </template>
              </template>
              <template v-else-if="item.prop == 'dutyDoctorQuantity'">
                <template v-if="scope.row.operate == '0'">
                  <span>{{ scope.row.dutyDoctorQuantity }}</span>
                </template>
                <template v-if="scope.row.operate == '1'">
                  <el-input-number
                    :disabled="scope.row.scheduleType == '1'"
                    :min="0"
                    :controls="false"
                    :precision="0"
                    style="width: 100%"
                    v-model="scope.row.dutyDoctorQuantity"
                  ></el-input-number>
                </template>
              </template>
              <template v-else-if="item.prop == 'diagTreatType'">
                <template v-if="scope.row.operate == '0'">
                  <span
                    tableName="appt_diag_treat_type"
                    :conditionMap="{
                      DIAG_TREAT_TYPE_CODE: scope.row[item.prop] || '',
                      hos_id: hosId
                    }"
                    columns="DIAG_TREAT_TYPE_NAME"
                    v-tableTransform
                  ></span>
                </template>
                <template v-if="scope.row.operate == '1'">
                  <l-value-domain
                    :disabled="scope.row.tierType == 3"
                    clearable
                    style="width: 100%"
                    :value.sync="scope.row.diagTreatType"
                    remoteUrl="/appointment/diagTreatType/selectDiagTreatTypePO?recordStatus=1"
                    type="select"
                    remoteShowKey="diagTreatTypeName"
                    remoteValueKey="diagTreatTypeCode"
                    @change="diagTreatTypeChange(scope.row)"
                    placeholder
                  ></l-value-domain>
                </template>
              </template>
              <template v-else-if="item.prop == 'classesId'">
                <template v-if="scope.row.operate == '0'">
                  <span
                    tableName="appt_class"
                    :conditionMap="{ CLASS_ID: scope.row[item.prop] || '' }"
                    columns="CLASS_NAME"
                    v-tableTransform
                  ></span>
                </template>
                <template v-if="scope.row.operate == '1'">
                  <l-value-domain
                    :disabled="scope.row.tierType == 3"
                    clearable
                    style="width: 100%"
                    :value.sync="scope.row.classesId"
                    remoteUrl="/appointment/class/selectCalss?recordStatus=1"
                    type="select"
                    remoteShowKey="className"
                    remoteValueKey="classId"
                    placeholder
                    @change="classesIdChange(scope.row)"
                  ></l-value-domain>
                </template>
              </template>
              <template
                v-else-if="
                  item.prop == 'dutyStartTime' || item.prop == 'dutyStopTime'
                "
              >
                <template v-if="scope.row.operate == '0'">
                  <span>
                    {{ scope.row[item.prop].substring(11, 16) }}
                    <span
                      style="color: red"
                      v-if="
                        item.prop == 'dutyStopTime' &&
                        isAddOne(
                          scope.row.dutyStartTime,
                          scope.row.dutyStopTime
                        )
                      "
                      >(+1)</span
                    >
                  </span>
                </template>
                <template v-if="scope.row.operate == '1'">
                  <el-time-picker
                    :disabled="scope.row.tierType == 3"
                    v-model="scope.row[item.prop]"
                    :clearable="false"
                    format="HH:mm"
                    value-format="yyyy-MM-dd HH:mm"
                    :editable="false"
                    placeholder
                    style="width: 100%"
                    @change="timeChange(scope.row)"
                  ></el-time-picker>
                </template>
              </template>
              <template
                v-else-if="
                  item.prop == 'apptLimitNum' || item.prop == 'sdeptLimitNum'
                "
              >
                <template
                  v-if="scope.row.operate == '0' && scope.row.tierType == 2"
                >
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
                <template
                  v-if="scope.row.operate == '1' && scope.row.tierType == 2"
                >
                  <el-input-number
                    :min="0"
                    :controls="false"
                    :precision="0"
                    style="width: 100%"
                    v-model="scope.row[item.prop]"
                  ></el-input-number>
                </template>
              </template>
              <template v-else-if="item.prop == 'appendNum'">
                <template
                  v-if="scope.row.operate == '0' && scope.row.tierType == '2'"
                >
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
                <template
                  v-if="scope.row.operate == '1' && scope.row.tierType == '2'"
                >
                  <el-input-number
                    :min="0"
                    :controls="false"
                    :precision="0"
                    style="width: 100%"
                    v-model="scope.row[item.prop]"
                  ></el-input-number>
                </template>
              </template>
              <template v-else-if="item.prop == 'doctorId'">
                <template
                  v-if="
                    scope.row.operate == '0' && scope.row.scheduleType == '1'
                  "
                >
                  <span
                    tableName="sys_user"
                    :conditionMap="{ ID: scope.row[item.prop] || '' }"
                    columns="NAME"
                    v-tableTransform
                  ></span>
                </template>
                <template
                  v-if="
                    scope.row.operate == '1' && scope.row.scheduleType == '1'
                  "
                >
                  <l-value-domain
                    v-if="scope.row.tierType == 2"
                    clearable
                    :remoteUrl="
                      '/appointment/doctorSchedule/getDoctorInfo?deptId=' +
                      searchData.deptId
                    "
                    type="select"
                    :value.sync="scope.row.doctorId"
                    remoteShowKey="name"
                    remoteValueKey="id"
                    placeholder
                    style="width: 100%"
                    @change="docChange"
                  >
                    <!-- 郑雅雯：修改bug36547 -->
                    <!-- :remoteUrl="'/wadmin/dept-doctor/'+searchData.deptId" -->
                  </l-value-domain>
                  <l-value-domain
                    v-if="scope.row.tierType == 3"
                    clearable
                    :remoteUrl="
                      '/appointment/doctorSchedule/getDoctorInfo?deptId=' +
                      searchData.deptId +
                      '&workCode=' +
                      scope.row.workCode
                    "
                    type="select"
                    :value.sync="scope.row.doctorId"
                    remoteShowKey="name"
                    remoteValueKey="id"
                    placeholder
                    style="width: 100%"
                    @change="docChange2"
                  ></l-value-domain>
                </template>
              </template>
              <template v-else-if="item.prop == 'workCode'">
                <template v-if="scope.row.operate == '0'">
                  <span
                    v-if="scope.row[item.prop]"
                    :val="scope.row[item.prop]"
                    code="doctorProfessionalTitle"
                    v-codeTransform
                  ></span>
                </template>
                <template v-if="scope.row.operate == '1'">
                  <l-value-domain
                    v-if="scope.row.scheduleType == 1"
                    :disabled="scope.row.scheduleType == 1"
                    code="doctorProfessionalTitle"
                    :value.sync="scope.row[item.prop]"
                    title="医生排班无法编辑职称"
                  />
                  <l-value-domain
                    v-if="scope.row.scheduleType == 2"
                    :disabled="
                      scope.row.doctorSchedules &&
                      scope.row.doctorSchedules.length > 0
                    "
                    code="doctorProfessionalTitle"
                    :value.sync="scope.row[item.prop]"
                    title="存在子排班的科室排班无法编辑职称"
                  />
                </template>
              </template>
              <template v-else-if="item.prop == 'roomId'">
                <template
                  v-if="scope.row.operate == '0' && scope.row.scheduleType == 1"
                >
                  <span
                    tableName="appt_room"
                    :conditionMap="{ ROOM_ID: scope.row[item.prop] || '' }"
                    columns="ROOM_NAME"
                    v-tableTransform
                  ></span>
                </template>
                <template
                  v-if="scope.row.operate == '1' && scope.row.scheduleType == 1"
                >
                  <l-value-domain
                    clearable
                    style="width: 100%"
                    :value.sync="scope.row.roomId"
                    :remoteParams="roomIdParams"
                    :remoteUrl="
                      '/appointment/room/getRoomPOList?deptId=' +
                      searchData.deptId
                    "
                    type="select"
                    remoteShowKey="roomName"
                    remoteValueKey="roomId"
                    placeholder
                  ></l-value-domain>
                </template>
              </template>
              <template v-else-if="item.prop == 'apptDept'">
                <template v-if="scope.row.operate == '0'">
                  <span
                    tableName="appt_dict_value"
                    :conditionMap="{
                      dict_item_code: 'A0003',
                      dict_code: scope.row[item.prop] || '',
                    }"
                    columns="DICT_NAME"
                    v-tableTransform
                  ></span>
                </template>
                <template v-if="scope.row.operate == '1'">
                  <l-value-domain
                    :disabled="scope.row.tierType == 3"
                    clearable
                    style="width: 100%"
                    :value.sync="scope.row.apptDept"
                    remoteUrl="/appointment/dictValue/getDictValueList?dictItemCode=A0003&recordStatus=1"
                    type="select"
                    remoteShowKey="dictName"
                    remoteValueKey="dictCode"
                    placeholder
                    @change="apptDeptChange(scope.row)"
                  ></l-value-domain>
                </template>
              </template>

              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      title="预约号源处理"
      :visible.sync="toDealWithStyle"
      width="80%"
      height="60%"
      style="min-height: 500px"
    >
      <todealwith
        v-if="toDealWithStyle"
        :scheduleIds="scheduleIds"
        @toDealWithStyleFun="toDealWithStyleFun"
      ></todealwith>
    </el-dialog>

    <!-- 加号弹窗 -->
    <el-dialog title="加号" :visible.sync="dialogFormVisible" width="500px">
      <div style="padding: 25px">
        <span style="margin-right: 50px"
          >已加号数量：{{ currentAppendNumObj.appendNum }}</span
        >
        <span style="width: 250px">
          加号数量：
          <el-input-number
            :step="1"
            :step-strictly="true"
            :controls="false"
            v-model="newAddNum"
          ></el-input-number>
        </span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="appendNumSureCancel">取 消</el-button>
        <el-button type="primary" @click="appendNumSure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 引用模板弹窗 -->
    <el-dialog
      title="模板列表"
      :visible.sync="templateDialogVisible"
      width="500px"
    >
      <div style="padding: 25px">
        <el-input
          v-model="scheduleTemplateName"
          @input="selectTemplateNew"
          placeholder="请输入模板名称"
        ></el-input>
        <div class="listContent">
          <div
            v-for="(item, index) in listData"
            :key="index"
            class="deptItem"
            :title="item.scheduleTemplateName"
            :class="{ currentClass: item.templateId == currentItem.templateId, listItem: true, width100: true }"
            @click="listItemClick(item)"
          >
            {{ item.scheduleTemplateName }}
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="templateDialogCancel">取 消</el-button>
        <el-button type="primary" @click="templateDialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import scheManagement from "@/api/schedule/scheduleManagement.js";
import { mapActions, mapGetters } from "vuex";
import todealwith from "./components/todealwith.vue";
import { getPamars } from "@/utils/auth";
import { v4 as uuidv4 } from "uuid";
export default {
  components: {
    todealwith,
  },
  computed: {
    sDate: function () {
      return this.makeDate(0, this.weekDate);
    },
    eDate: function () {
      return this.makeDate(-6, this.weekDate);
    },
  },
  data() {
    return {
      hosId: "",
      // 预约号源处理弹窗
      toDealWithStyle: false,
      scheduleIds: [], //选中父排班的id数组
      schedules: [], //选中父排班的对象集合数据
      currentAppendNumObj: {}, //当前加号row对象
      newAddNum: 0, //新加号数量
      dialogFormVisible: false, //加号弹窗是否显示
      templateDialogVisible: false, //引用模板弹窗
      weekDate: new Date(),
      currentItem: {},
      // 科室ID
      searchData: {
        deptId: "",
      },
      roomIdParams: {
        recordStatus: "1",
        deletedStatus: "0",
      },
      treeData: [],
      columns: [
        {
          label: "",
          prop: "name",
          width: "160",
          align: "left",
        },
        {
          label: "选中",
          prop: "check",
          width: "50px",
        },
        {
          prop: "recordStatus",
          label: "状态",
          width: "60",
        },
        {
          label: "操作",
          prop: "operate",
          width: "180px",
        },
        {
          label: "排班类型",
          prop: "scheduleType",
          width: "90px",
        },
        {
          label: "医生人数",
          prop: "dutyDoctorQuantity",
          width: "80px",
        },
        {
          label: "诊疗类型",
          prop: "diagTreatType",
          width: "130px",
        },
        {
          label: "班次",
          prop: "classesId",
          width: "90px",
        },
        {
          label: "开始时间",
          prop: "dutyStartTime",
          width: "120px",
        },
        {
          label: "结束时间",
          prop: "dutyStopTime",
          width: "120px",
        },
        {
          label: "预约号源",
          prop: "apptLimitNum",
          width: "80px",
        },
        {
          label: "挂号号源",
          prop: "sdeptLimitNum",
          width: "80px",
        },
        // {
        //   label: "加号数量",
        //   prop: "appendNum",
        //   width: "80px"
        // },
        {
          label: "医生名称",
          prop: "doctorId",
          width: "120px",
        },
        // {
        //   prop: "workCode",
        //   label: "职称",
        //   width: "160"
        // },
        {
          label: "诊室",
          prop: "roomId",
          width: "120px",
        },
        // {
        //   label: "门诊部门",
        //   prop: "apptDept",
        //   width: "130px"
        // },
        {
          label: "操作者",
          prop: "updatedByName",
          width: "100px",
        },
        {
          label: "操作时间",
          prop: "updatedAt",
          width: "160px",
        },
      ],
      alDeleteArr: [],
      pickerOptions: {
        firstDayOfWeek: 1,
      },
      historyDeptId: "",
      historyWeekDate: new Date(),
      scheduleTemplateName: "", //模板列表查询关键词
      listData: [], //模板列表弹窗数组
      options: [], // 查询科室缓存
      selLoading: false,
      doctorData: [], //当前科室所有医生集合
    };
  },
  beforeRouteLeave(to, from, next) {
    let saveData = this.selectSaveData();
    let arr = saveData.concat(this.alDeleteArr);
    if (arr.length) {
      this.$confirm("当前页面有尚未保存的数据，确定要离开吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          next();
        })
        .catch(() => {
          next(false);
        });
    } else {
      next();
    }
  },
  async mounted() {
    this.changeSdept({
      deptId: this.searchData.deptId,
      startDate: this.sDate,
      stopDate: this.eDate,
      isGet: new Date(),
    });
    // this.initTreeData();
    await this.selectAllDept();
    this.getScheduleAndSon();
    this.getDoctorInfo();
  },
  methods: {
    ...mapActions({
      changeSdept: "base/changeSdept",
    }),
    async getDoctorInfo() {
      try {
        let res = await scheManagement.getDoctorInfo({
          deptId: this.searchData.deptId,
        });
        this.doctorData = res.data;
       // console.log("::::::", res.data);
        this.hosId = res.data[0].hos_id;
      } catch (error) {
        // console.log(error);
      }
    },
    toDealWithStyleFun(a) {
      this.toDealWithStyle = a;
      this.getScheduleAndSon();
    },
    // 打开停诊号源处理 弹窗
    toDealWith() {
      this.getCheckedId();
      // console.log(this.schedules);
      if (this.scheduleIds.length == 1) {
        if (this.schedules[0].recordStatus == "5") {
          this.toDealWithStyle = true;
        } else {
          this.$message.error("请选择一个停诊的排班");
        }
      } else {
        this.$message.error("请选择一个排班");
      }
    },
    // 查询科室
    async selectAllDept(val) {
      try {
        this.selLoading = true;
        let res = await scheManagement.queryDept({
          deptName: "",
        });
        this.options = res.data;
        // this.searchData.deptId = res.data.length ? res.data[0].deptId : "";
        for(let i in this.options) {
          let item = this.options[i];
          if(item.deptName.indexOf("全科") > -1) {
            this.searchData.deptId = item.deptId;
            break;
          }
        }
        this.searchData.deptId = this.searchData.deptId || (res.data.length ? res.data[0].deptId : "");
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "查询科室失败");
      }
    },
    //点击加号按钮wadmin/dept-doctor
    appendNumClick(row) {
      this.currentAppendNumObj = row;
      this.dialogFormVisible = true;
    },
    //加号弹窗点击确定
    async appendNumSure() {
      if (this.newAddNum == 0) {
        this.$message.error("请输入一个非0整数");
        return;
      }
      if (this.currentAppendNumObj.appendNum + this.newAddNum < 0) {
        this.$message.error("已加号数量和新加号数量之和不能小于0");
        return;
      }
      try {
        let params = { ...this.currentAppendNumObj };
        params.appendNum = this.currentAppendNumObj.appendNum + this.newAddNum;
        let data = await scheManagement.addNum(params);
        if (data.code == "1") {
          this.$message.success(data.msg || "加号成功");
          this.getScheduleAndSon();
          this.newAddNum = 0;
          this.dialogFormVisible = false;
        } else {
          this.$message.error(data.msg || "加号失败");
        }
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "加号失败");
      }
    },
    appendNumSureCancel() {
      this.dialogFormVisible = false;
      this.newAddNum = "";
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.isNew || row.editNew) {
        return "warning-row";
      }
      return "";
    },
    scheduleTypeChange(row) {
      if (row.scheduleType == "1") {
        row.dutyDoctorQuantity = 1;
      }
      if (row.scheduleType == "2") {
        row.dutyDoctorQuantity = 2;
        row.doctorId = "";
        row.doctorName = "";
        row.roomId = "";
      }
    },
    //选择日期范围发生改变
    weekDateChange() {
      //收集需要提交保存的数据
      let saveData = this.selectSaveData();
      let arr = saveData.concat(this.alDeleteArr);
      if (arr.length) {
        this.$confirm("当前时间段有尚未保存的数据，确定要切换时间吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.historyWeekDate = this.weekDate;
            this.getScheduleAndSon();
          })
          .catch(() => {
            this.weekDate = this.historyWeekDate;
          });
      } else {
        this.getScheduleAndSon();
      }
    },
    // 切换科室
    async deptChange() {
      //收集需要提交保存的数据
      let saveData = this.selectSaveData();
      let arr = saveData.concat(this.alDeleteArr);
      if (arr.length) {
        this.$confirm("当前科室有尚未保存的数据，确定要切换科室吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.changeSdept({
              deptId: this.searchData.deptId,
              startDate: this.sDate,
              stopDate: this.eDate,
              isGet: new Date(),
            });
            this.historyDeptId = this.searchData.deptId;
            this.getScheduleAndSon();
            this.getDoctorInfo();
          })
          .catch(() => {
            this.searchData.deptId = this.historyDeptId;
          });
      } else {
        this.changeSdept({
          deptId: this.searchData.deptId,
          startDate: this.sDate,
          stopDate: this.eDate,
          isGet: new Date(),
        });
        this.getScheduleAndSon();
        this.getDoctorInfo();
      }
    },
    //根据班次获得开始时间和结束时间
    classesIdChange(row) {
      if (row.classesId) {
        let params = {
          classId: row.classesId,
        };
        scheManagement.getTimeByclassId(params).then((res) => {
          if (res.code == "1") {
            row.dutyStartTime =
              row.dutyStartTime.substring(0, 10) + " " + res.data.dutyStartTime;
            row.dutyStopTime =
              row.dutyStopTime.substring(0, 10) + " " + res.data.dutyStopTime;
            //如果是父排班的班次变了，所有子排班的班次和时间也要保持一致
            if (row.doctorSchedules && row.doctorSchedules.length) {
              row.doctorSchedules.forEach((item) => {
                item.classesId = row.classesId;
                item.dutyStartTime = row.dutyStartTime;
                item.dutyStopTime = row.dutyStopTime;
                item.editNew = true;
              });
            }
          }
        });
        if (row.diagTreatType) {
          this.diaTypeChange(row);
        }
      }
    },
    //开始时间和结束时间变化
    timeChange(row) {
      if (
        row.tierType == 2 &&
        row.doctorSchedules &&
        row.doctorSchedules.length
      ) {
        row.doctorSchedules.forEach((item) => {
          item.editNew = true;
          item.dutyStartTime = row.dutyStartTime;
          item.dutyStopTime = row.dutyStopTime;
        });
      }
    },
    //门诊部门变化
    apptDeptChange(row) {
      if (
        row.tierType == 2 &&
        row.doctorSchedules &&
        row.doctorSchedules.length
      ) {
        row.doctorSchedules.forEach((item) => {
          item.editNew = true;
          item.apptDept = row.apptDept;
        });
      }
    },
    //诊疗类型变化
    diagTreatTypeChange(row) {
      if (
        row.tierType == 2 &&
        row.doctorSchedules &&
        row.doctorSchedules.length
      ) {
        row.doctorSchedules.forEach((item) => {
          item.editNew = true;
          item.diagTreatType = row.diagTreatType;
        });
      }
      if (row.classesId) {
        this.diaTypeChange(row);
      }
    },
    //根据班次与诊疗类型查询号源数
    diaTypeChange(row) {
      let params = {
        diagTreatTypeCode: row.diagTreatType,
        classId: row.classesId,
      };
      scheManagement.getNumByclassIdTypeCode(params).then((res) => {
        if (res.code == "1" && res.data.length) {
          row.appendNum = res.data[0].appendNumLimit; //加号
          row.sdeptLimitNum = res.data[0].classNum; //挂号
          row.apptLimitNum = res.data[0].apptNum; //预约
        }
      });
    },
    //编辑改变医生
    docChange(value, obj) {
      this.treeData.forEach((item1) => {
        item1.doctorSchedules.forEach((item2) => {
          if (item2.doctorId == value) {
            item2.workCode = obj.workCode;
            item2.doctorName = obj.name;
          }
          item2.doctorSchedules &&
            item2.doctorSchedules.forEach((item3) => {
              if (item3.doctorId == value) {
                item3.workCode = obj.workCode;
                item3.doctorName = obj.name;
              }
            });
        });
      });
    },
    //编辑改变医生
    docChange2(value, obj) {
      this.treeData.forEach((item1) => {
        item1.doctorSchedules.forEach((item2) => {
          if (item2.doctorId == value) {
            item2.workCode = obj.workCode;
            item2.doctorName = obj.name;
          }
          item2.doctorSchedules &&
            item2.doctorSchedules.forEach((item3) => {
              if (item3.doctorId == value) {
                item3.workCode = obj.workCode;
                item3.doctorName = obj.name;
              }
            });
        });
      });
    },
    // 比较时间
    contrast_time(obj) {
      let nowD = new Date(), //获取昨天的时间
        endD = new Date(obj); //对比时间
      let returtStyle = false;
      if (nowD.getTime() - 24 * 60 * 60 * 1000 >= endD.getTime()) {
        //getTime() 方法可返回距 1970 年 1 月 1 日之间的毫秒数。
        returtStyle = true;
      } else {
        returtStyle = false;
      }
      return returtStyle;
    },
    //添加父排班
    addParentSch(row) {
      if (this.contrast_time(row.date)) {
        return false;
      }
      let flag = this.getValSchedule();
      if (!flag) {
        return false;
      }
      row.doctorSchedules.push({
        //标志位属性
        operate: "1",
        tierType: 2,
        isNew: true,
        //表单属性
        virtualScheduleId: uuidv4(),
        // new Date().getTime()
        scheduleId: new Date().getTime(),
        doctorSchedules: [],
        scheduleType: "1",
        dutyDoctorQuantity: 1,
        diagTreatType: "",
        classesId: "",
        dutyStartTime: row.date + " 00:00:00",
        dutyStopTime: row.date + " 23:59:59",
        apptLimitNum: "",
        sdeptLimitNum: "",
        doctorId: "",
        roomId: "",
        apptDept: "",
        workCode: "",
        appendNum: 0,
        ouptDeptId: this.searchData.deptId,
      });
      this.$nextTick(function () {
        this.$refs.treeTable.toggleRowExpansion(row, true);
      });
    },
    // 添加子排版的显示隐藏
    doctorSchedulesfun(row) {
      let doctorSchedulesStyle = false;
      if (row.scheduleType == "1") {
        doctorSchedulesStyle = true;
      } else {
        if (
          row.doctorSchedules &&
          row.doctorSchedules.length >= row.dutyDoctorQuantity
        ) {
          // this.$message.error("同一科室排班下医生排班数不得超过科室排班人数");
          doctorSchedulesStyle = true;
        } else {
          doctorSchedulesStyle = false;
        }
      }
      return doctorSchedulesStyle;
    },
    //添加子排班
    addSonSch(row) {
      if (this.doctorSchedulesfun(row)) {
        return false;
      }
      if (
        row.doctorSchedules &&
        row.doctorSchedules.length >= row.dutyDoctorQuantity
      ) {
        this.$message.error("同一科室排班下医生排班数不得超过科室排班人数");
        return false;
      }
      let flag = this.getValSchedule();
      if (!flag) {
        return false;
      }
      if (row.doctorSchedules == undefined) {
        this.$set(row, "doctorSchedules", []);
      }
      row.doctorSchedules.push({
        //标志位属性
        operate: "1",
        tierType: 3,
        isNew: true,
        //表单属性
        virtualScheduleId: uuidv4(), //虚拟排班id
        // new Date().getTime()
        virtualSuperScheduleId: row.scheduleId,
        scheduleId: new Date().getTime(),
        superScheduleId: row.scheduleId,
        scheduleType: "1",
        dutyDoctorQuantity: 1,
        diagTreatType: row.diagTreatType,
        classesId: row.classesId,
        dutyStartTime:
          row.dutyStartTime || this.strSplit(row.dutyStartTime) + " 00:00:00",
        dutyStopTime:
          row.dutyStopTime || this.strSplit(row.dutyStopTime) + " 23:59:59",
        apptLimitNum: "",
        sdeptLimitNum: "",
        doctorId: "",
        roomId: row.roomId || "",
        apptDept: row.apptDept || "",
        workCode: row.workCode,
        appendNum: 0,
        ouptDeptId: this.searchData.deptId,
      });
      this.$nextTick(function () {
        this.$refs.treeTable.toggleRowExpansion(row, true);
      });
    },
    editItem(row) {
      if (row.recordStatus == "1") {
        this.$message("该排班已发布不能编辑");
        return;
      }
      if (row.recordStatus == "5") {
        this.$message("该排班已停诊不能编辑");
        return;
      }
      let flag = this.getValSchedule();
      if (!flag) {
        return;
      }

      row.editNew = true;
      row.operate = "1";
    },
    overItem(row) {
      let flag = this.valSchedule(row);
      if (flag) {
        row.operate = "0";
        //排序
        this.sortBySDate();
      }
    },
    delSch(row) {
      if (row.recordStatus == "1") {
        this.$message("该排班已发布不能删除");
        return;
      }
      if (row.recordStatus == "5") {
        this.$message("该排班已停诊不能删除");
        return;
      }
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //遍历所有数据，看sch...id是否相等，如相等则删除。

        for (let i = 0; i < this.treeData.length; i++) {
          for (let j = 0; j < this.treeData[i].doctorSchedules.length; j++) {
            if (
              this.treeData[i].doctorSchedules[j].scheduleId == row.scheduleId
            ) {
              if (!this.treeData[i].doctorSchedules[j].isNew) {
                this.treeData[i].doctorSchedules[j].deleteFlag = "1";
                this.alDeleteArr.push(this.treeData[i].doctorSchedules[j]);
              }
              this.$delete(this.treeData[i].doctorSchedules, j);
              return;
            }
            if (this.treeData[i].doctorSchedules[j].doctorSchedules) {
              for (
                let z = 0;
                z < this.treeData[i].doctorSchedules[j].doctorSchedules.length;
                z++
              ) {
                if (
                  this.treeData[i].doctorSchedules[j].doctorSchedules[z]
                    .scheduleId == row.scheduleId
                ) {
                  if (
                    !this.treeData[i].doctorSchedules[j].doctorSchedules[z]
                      .isNew
                  ) {
                    this.treeData[i].doctorSchedules[j].doctorSchedules[
                      z
                    ].deleteFlag = "1";
                    this.alDeleteArr.push(
                      this.treeData[i].doctorSchedules[j].doctorSchedules[z]
                    );
                  }
                  this.$delete(
                    this.treeData[i].doctorSchedules[j].doctorSchedules,
                    z
                  );
                  return;
                }
              }
            }
          }
        }
      });
    },
    //表单值变化，手动赋给treeData
    // scheduleTypeChange(row, index) {
    //   console.log(row, index);
    //   for (let i = 0; i < this.treeData.length; i++) {
    //     for (let j = 0; j < this.treeData[i].doctorSchedules.length; j++) {
    //       if (
    //         row.scheduleId == this.treeData[i].doctorSchedules[j].scheduleId
    //       ) {
    //         this.treeData[i].doctorSchedules[j] = row;
    //         return;
    //       }
    //     }
    //   }
    // },
    clearTemplateInfo() {
      this.currentItem = {};
      this.scheduleTemplateName = "";
    },
    //获取模板列表
    async selectTemplateNew() {
      let res = await scheManagement.selectTemplateNew({
        scheduleTemplateName: this.scheduleTemplateName,
      });
      this.listData = res.data;
    },
    listItemClick(data) {
      this.currentItem = data;
    },
    //引用模板按钮
    quote() {
      this.templateDialogVisible = true;
      this.selectTemplateNew();
    },
    templateDialogCancel() {
      this.templateDialogVisible = false;
      this.clearTemplateInfo();
    },
    //确定引入选中模板
    templateDialogSure() {
      if (!this.currentItem.templateId) {
        this.$message.error("请先选择要引入的模板");
        return;
      }
      this.getScheduleTemplateDetailNew();
    },
    async getScheduleTemplateDetailNew() {
      try {
        let data = await scheManagement.getScheduleTemplateDetailNew({
          ouptDeptId: this.searchData.deptId,
          templateId: this.currentItem.templateId,
        });
        if (data.code == "1") {
          // this.handleChannel(data.data);
          if (!data.data.length) {
            this.$message.info("此模板下无排班内容");
            return;
          }
          this.appendTemplateData(data.data);
          this.$message.success("引用模板成功");
          this.templateDialogVisible = false;
          this.clearTemplateInfo();
        } else {
          this.$message.error(data.msg || "获取模板明细失败");
        }
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "获取模板明细失败");
      }
    },
    save() {
      let flag = this.getValSchedule();
      if (!flag) {
        return;
      }
      //收集需要提交保存的数据
      let saveData = this.selectSaveData();
      let arr = saveData.concat(this.alDeleteArr);
      this.saveScheduleNew(arr);
    },
    selectSaveData() {
      let saveData = [];
      let treeDataCopy = JSON.parse(JSON.stringify(this.treeData));
      treeDataCopy.forEach((item1) => {
        item1.doctorSchedules &&
          item1.doctorSchedules.forEach((item2) => {
            //给每个排班整理时间，如果结束时间早于开始时间，那么结束时间的年月日=开始时间的年月日+1
            if (
              new Date(item2.dutyStartTime).getTime() >
              new Date(item2.dutyStopTime).getTime()
            ) {
              item2.dutyStopTime =
                new Date(
                  new Date(item2.dutyStartTime).getTime() + 24 * 60 * 60 * 1000
                ).format("yyyy-MM-dd") +
                " " +
                item2.dutyStopTime.substring(11, 19);
            } else {
              item2.dutyStopTime =
                item2.dutyStartTime.substring(0, 11) +
                item2.dutyStopTime.substring(11, 19);
            }
            if (item2.isNew) {
              this.$delete(item2, "scheduleId");
            }
            if (item2.isNew || item2.editNew) {
              item2.deleteFlag = "0";
              saveData.push(item2);
            }
            item2.doctorSchedules &&
              item2.doctorSchedules.forEach((item3) => {
                //给每个排班整理时间，如果结束时间早于开始时间，那么结束时间的年月日=开始时间的年月日+1
                if (
                  new Date(item3.dutyStartTime).getTime() >
                  new Date(item3.dutyStopTime).getTime()
                ) {
                  item3.dutyStopTime =
                    new Date(
                      new Date(item3.dutyStartTime).getTime() +
                        24 * 60 * 60 * 1000
                    ).format("yyyy-MM-dd") +
                    " " +
                    item3.dutyStopTime.substring(11, 19);
                }
                if (item3.isNew) {
                  this.$delete(item3, "scheduleId");
                  if (item2.isNew) {
                    this.$delete(item3, "superScheduleId");
                  }
                }
                if (item3.isNew || item3.editNew) {
                  item3.deleteFlag = "0";
                  saveData.push(item3);
                }
              });
          });
      });
      return saveData;
    },
    async saveScheduleNew(arr) {
      if (!arr.length) {
        this.$message.error("没有需要保存的数据");
        return;
      }
      try {
        let data = await scheManagement.saveScheduleNew(arr);
        if (data.code == "1") {
          this.getScheduleAndSon();
          this.alDeleteArr = [];
          this.$message.success(data.msg || "保存成功");
        } else {
          this.$message.error(data.msg || "保存失败");
        }
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "保存失败");
      }
    },
    //给每天添加date属性，date为当天日期
    initTreeData() {
      this.treeData = [
        {
          name: "星期一",
          scheduleId: "0",
          check: false,
          doctorSchedules: [],
        },
        {
          name: "星期二",
          scheduleId: "1",
          check: false,
          doctorSchedules: [],
        },
        {
          name: "星期三",
          scheduleId: "2",
          check: false,
          doctorSchedules: [],
        },
        {
          name: "星期四",
          scheduleId: "3",
          check: false,
          doctorSchedules: [],
        },
        {
          name: "星期五",
          scheduleId: "4",
          check: false,
          doctorSchedules: [],
        },
        {
          name: "星期六",
          scheduleId: "5",
          check: false,
          doctorSchedules: [],
        },
        {
          name: "星期日",
          scheduleId: "6",
          check: false,
          doctorSchedules: [],
        },
      ];
      for (let i = 0; i < 7; i++) {
        this.treeData[i].date = this.makeDate(0 - i, this.weekDate);
      }
    },
    async getScheduleAndSon() {
      try {
        let data = await scheManagement.getScheduleAndSon({
          ouptDeptId: this.searchData.deptId,
          startDate: this.sDate + " 00:00:00",
          stopDate: this.eDate + " 23:59:59",
        });
        if (data.code == "1") {
          this.handleChannel(data.data);
        } else {
          this.$message.error(data.msg || "获取排班列表失败");
        }
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "获取排班列表失败");
      }
    },
    //整理获取到的数据，并根据日期分配到每一天
    handleChannel(data) {
      this.initTreeData();
      let tableData = [...data];

      for (let i = 0; i < this.treeData.length; i++) {
        this.treeData[i].tierType = 1;
        for (let j = 0; j < tableData.length; j++) {
          if (
            this.strSplit(tableData[j].dutyStartTime, " ")[0] ==
            this.treeData[i].date
          ) {
            tableData[j].operate = "0";
            tableData[j].tierType = 2;
            tableData[j].check = false;
            if (tableData[j].doctorSchedules) {
              for (let z = 0; z < tableData[j].doctorSchedules.length; z++) {
                tableData[j].doctorSchedules[z].operate = "0";
                tableData[j].doctorSchedules[z].tierType = 3;
              }
            }
            this.treeData[i].doctorSchedules.push(tableData[j]);
          }
        }
      }
      //排序
      this.sortBySDate();
    },
    //匹配id,如果匹配到返回当前id对应医生名字，如果没有返回false.
    docIdToDocName(id) {
      for (let i in this.doctorData) {
        if (this.doctorData[i].id === id) {
          return this.doctorData[i].name;
        }
        if (i === this.doctorData.length - 1) {
          return false;
        }
      }
    },
    //将引入的模板数据插入到总数据中
    appendTemplateData(data) {
      console.info("data", data);
      // return
      let tableData = [...data];
      for (let i = 0; i < this.treeData.length; i++) {
        for (let j = 0; j < tableData.length; j++) {
          if (tableData[j].week == this.treeData[i].scheduleId * 1 + 1) {
            tableData[j].recordStatus = "";
            tableData[j].operate = "0";
            tableData[j].tierType = 2;
            tableData[j].updatedByName = "";
            tableData[j].updatedAt = "";
            tableData[j].dutyStartTime =
              this.treeData[i].date + " " + tableData[j].dutyStartTime + ":00";
            tableData[j].dutyStopTime =
              this.treeData[i].date + " " + tableData[j].dutyStopTime + ":00";
            tableData[j].isNew = true;
            tableData[j].scheduleId = tableData[j].templateDetailId;
            // tableData[j].virtualScheduleId = tableData[j].templateDetailId;
            // tableData[j].virtualScheduleId = (window.performance.now() + Math.round(Math.random() * 89 + 10) + '').replace('.','');
            tableData[j].virtualScheduleId = uuidv4();
            console.log("tableData[j].virtualScheduleId:", tableData[j].virtualScheduleId);
            let name = this.docIdToDocName(tableData[j].doctorId);
            if (name) {
              tableData[j].doctorName = name;
            }
            if (tableData[j].doctorSchedules) {
              for (let z = 0; z < tableData[j].doctorSchedules.length; z++) {
                tableData[j].doctorSchedules[z].recordStatus = "";
                tableData[j].doctorSchedules[z].operate = "0";
                tableData[j].doctorSchedules[z].tierType = 3;
                tableData[j].doctorSchedules[z].dutyStartTime =
                  this.treeData[i].date +
                  " " +
                  tableData[j].doctorSchedules[z].dutyStartTime +
                  ":00";
                tableData[j].doctorSchedules[z].dutyStopTime =
                  this.treeData[i].date +
                  " " +
                  tableData[j].doctorSchedules[z].dutyStopTime +
                  ":00";
                tableData[j].doctorSchedules[z].isNew = true;
                tableData[j].doctorSchedules[z].scheduleId =
                  tableData[j].doctorSchedules[z].templateDetailId;
                // tableData[j].doctorSchedules[z].virtualScheduleId =
                //   tableData[j].doctorSchedules[z].templateDetailId;
                tableData[j].doctorSchedules[z].virtualScheduleId = uuidv4();
                  // (window.performance.now()+Math.round(Math.random() * 89 + 10) +'').replace('.','');
                tableData[j].doctorSchedules[z].superScheduleId =
                  tableData[j].doctorSchedules[z].superTemplateDetailId;
                // tableData[j].doctorSchedules[z].virtualSuperScheduleId =
                //   tableData[j].doctorSchedules[z].superTemplateDetailId;
                tableData[j].doctorSchedules[z].virtualSuperScheduleId =
                  (window.performance.now()+'').replace('.','');
                let name = this.docIdToDocName(tableData[j].doctorSchedules[z].doctorId);
                if (name) {
                  tableData[j].doctorSchedules[z].doctorName = name;
                }
              }
            }
            //引入的模板排版不得在当前日期之前
            if (
              new Date(tableData[j].dutyStopTime).getTime() >
              new Date().getTime()
            ) {
              this.treeData[i].doctorSchedules.push(tableData[j]);
            }
          }
        }
      }
      //排序
      this.sortBySDate();
    },
    //计算本周开始时间和结束时间
    makeDate(n, datePoint) {
      var now = datePoint ? new Date(datePoint) : new Date();
      var year = now.getFullYear();
      //因为月份是从0开始的,所以获取这个月的月份数要加1才行
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var day = now.getDay();
      //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
      if (day !== 0) {
        n = n + (day - 1);
      } else {
        n = n + 6;
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
    //遍历所有数据，如果通过验证，则置为非编辑状态。如果没有通过验证，返回flag为false
    getValSchedule() {
      let isPass = true;
      this.treeData.forEach((item1) => {
        item1.doctorSchedules &&
          item1.doctorSchedules.forEach((item2) => {
            if (item2.operate == "1") {
              let flag = this.valSchedule(item2);
              if (flag) {
                item2.operate = "0";
              } else {
                isPass = false;
              }
            }
            item2.doctorSchedules &&
              item2.doctorSchedules.forEach((item3) => {
                if (item3.operate == "1") {
                  let flag = this.valSchedule(item3);
                  if (flag) {
                    item3.operate = "0";
                  } else {
                    isPass = false;
                  }
                }
              });
          });
      });
      if (isPass) {
        //排序
        this.sortBySDate();
      }
      return isPass;
    },
    // eslint-disable-next-line complexity
    valSchedule(item) {
      if (!item.dutyDoctorQuantity) {
        this.$message.error("排班数据不完整，请填写医生人数");
        return false;
      }
      if (
        item.doctorSchedules &&
        item.doctorSchedules.length > item.dutyDoctorQuantity
      ) {
        this.$message.error("同一科室排班下医生排班数不得超过科室排班人数");
        return false;
      }
      if (!item.doctorId && item.scheduleType == "1") {
        this.$message.error("排班数据不完整，请选择医生");
        return false;
      }
      // if (!item.workCode && item.scheduleType == "1") {
      //   this.$message.error("排班数据不完整，请选择职称");
      //   return false;
      // }
      if (!item.diagTreatType) {
        this.$message.error("排班数据不完整，请选择诊疗类型");
        return false;
      }
      if (!item.classesId) {
        this.$message.error("排班数据不完整，请选择出诊班次");
        return false;
      }
      // if (!item.apptDept) {
      //   this.$message.error("排班数据不完整，请选择门诊部门");
      //   return false;
      // }
      if (!item.dutyStartTime) {
        this.$message.error("排班数据不完整，请选择开诊时间");
        return false;
      }
      if (!item.dutyStartTime) {
        this.$message.error("排班数据不完整，请选择停诊时间");
        return false;
      }
      // if (!item.roomId && item.scheduleType == "1") {
      //   this.$message.error("排班数据不完整，请选择坐诊诊室");
      //   return false;
      // }
      if (item.apptLimitNum === undefined && item.tierType == "2") {
        this.$message.error("排班数据不完整，请填写预约号源");
        return false;
      }
      if (item.sdeptLimitNum === undefined && item.tierType == "2") {
        this.$message.error("排班数据不完整，请填写挂号号源数");
        return false;
      }
      if (item.sdeptLimitNum + item.apptLimitNum < 1 && item.tierType == "2") {
        this.$message.error("预约号源和挂号号源不能同时为0");
        return false;
      }
      // if (item.appendNum === undefined && item.tierType == "2") {
      //   this.$message.error("排班数据不完整，请填写加号数量");
      //   return false;
      // }
      // if (item.appendNum != undefined && item.appendNum > 50) {
      //   this.$message.error("排班加号数过大");
      //   return false;
      // }
      // if (item.sdeptLimitNum != undefined && item.sdeptLimitNum > 200) {
      //   this.$message.error("排班挂号号源数过大");
      //   return false;
      // }
      // if (item.apptLimitNum != undefined && item.apptLimitNum > 200) {
      //   this.$message.error("排班预约号源数过大");
      //   return false;
      // }

      return true;
    },
    //切割字符串
    strSplit(data, sym) {
      if (data) {
        let arr = data.split(sym);
        return arr;
      }
      return [];
    },
    // 按照开始时间对表格的数据进行排序
    sortBySDate() {
      this.treeData.forEach((item1) => {
        //对父排班进行排序
        item1.doctorSchedules &&
          item1.doctorSchedules.sort(function (a, b) {
            return (
              new Date(a.dutyStartTime).getTime() -
              new Date(b.dutyStartTime).getTime()
            );
          });
        //对子排班进行排序
        // item1.doctorSchedules &&
        //   item1.doctorSchedules.forEach(item2 => {
        //     item2.doctorSchedules &&
        //       item2.doctorSchedules.sort(function(a, b) {
        //         return (
        //           new Date(a.dutyStartTime).getTime() -
        //           new Date(b.dutyStartTime).getTime()
        //         );
        //       });
        //   });
      });
    },
    //开始时间与结束时间（+1）标识
    isAddOne(date1, date2) {
      let startTime = date1.split(" ")[1];
      let endTime = date2.split(" ")[1];
      let startNum =
        startTime.split(":")[0] +
        startTime.split(":")[1] +
        startTime.split(":")[2];
      let endNum =
        endTime.split(":")[0] + endTime.split(":")[1] + endTime.split(":")[2];
      if (Number(endNum) < Number(startNum)) {
        return true;
      }
    },
    //checkbox选中框，值改变触发
    checkboxChange(row) {
      // console.log(row);
      if (row.tierType == 1) {
        row.doctorSchedules.forEach((item) => {
          item.check = row.check;
        });
      }
      if (row.tierType == 2) {
        this.treeData.forEach((item1) => {
          item1.doctorSchedules.forEach((item2) => {
            if (item2.scheduleId == row.scheduleId) {
              let flag = true;
              for (let i = 0; i < item1.doctorSchedules.length; i++) {
                if (!item1.doctorSchedules[i].check) {
                  flag = false;
                  break;
                }
              }
              item1.check = flag;
            }
          });
        });
      }
    },
    clearCheckId() {
      this.scheduleIds = [];
      this.schedules = [];
      // this.treeData.forEach(item1 => {
      //   item1.doctorSchedules.forEach(item2 => {
      //     if (item2.check) {
      //       item2.check = false;
      //     }
      //   });
      // });
    },
    // 遍历全部数据，收集选中父排班的scheduleId
    getCheckedId() {
      this.scheduleIds = [];
      this.schedules = [];
      this.treeData.forEach((item1) => {
        item1.doctorSchedules.forEach((item2) => {
          if (item2.check) {
            this.scheduleIds.push(item2.scheduleId);
            this.schedules.push(item2);
          }
        });
      });
    },
    // 驳回排班
    async updateSchedule(recordStatus) {
      try {
        this.getCheckedId();
        if (this.scheduleIds.length < 1) {
          this.$message.error("请选择要操作的排班");
          return;
        }
        for (let i = 0; i < this.schedules.length; i++) {
          let val = this.schedules[i];
          if (val.recordStatus != "2") {
            // eslint-disable-next-line no-useless-concat
            this.$message.error(
              val.doctorName +
                " [ " +
                val.dutyStartTime +
                " - " +
                val.dutyStopTime +
                " ] " +
                "非暂存的排班不能驳回"
            );
            return;
          }
        }
        this.$showLoading();
        let res = await scheManagement.updateScheduleByIds({
          recordStatus: recordStatus,
          ids: [...this.scheduleIds],
        });
        this.clearCheckId();
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.$hideLoading();
        this.getScheduleAndSon();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "操作失败");
      }
    },
    // 停诊
    async stopSchedule(val) {
      try {
        // this.getCheckedId();
        // if (this.scheduleIds.length < 1) {
        //   this.$message.error("请选择要操作的排班");
        //   return;
        // }
        // for (let i = 0; i < this.schedules.length; i++) {
          // let val = this.schedules[i];
          if (val.recordStatus == "5") {
            // eslint-disable-next-line no-useless-concat
            this.$message.error(
              val.doctorName +
                " [ " +
                val.dutyStartTime +
                " - " +
                val.dutyStopTime +
                " ] " +
                "排班已停诊，请勿重复操作"
            );
            return;
          }
          if (val.recordStatus != "1") {
            // eslint-disable-next-line no-useless-concat
            this.$message.error(
              val.doctorName +
                " [ " +
                val.dutyStartTime +
                " - " +
                val.dutyStopTime +
                " ] " +
                "未发布的排班不能停诊"
            );
            return;
          }
        // }
        this.$showLoading();
        let res = await scheManagement.stopSchedule([val]);
        this.$hideLoading();
        // this.clearCheckId();
        this.getScheduleAndSon();
        if (res.code === 1) {
          this.$message({
            type: "success",
            message: res.msg || "操作成功",
          });
        } else {
          this.$message.error(res.msg || "停诊失败");
        }
      } catch (error) {
        // console.log(error);
        this.$hideLoading();
        this.$message.error(error.msg || "停诊失败");
      }
    },
    // 发布排班 新
    async releaseScheduleNew() {
      try {
        this.getCheckedId();
        if (this.scheduleIds.length < 1) {
          this.$message.error("请选择要操作的排班");
          return;
        }
        for (let i = 0; i < this.schedules.length; i++) {
          let val = this.schedules[i];
          if (val.recordStatus != "2" && val.recordStatus != "4") {
            // eslint-disable-next-line no-useless-concat
            this.$message.error(
              val.doctorName +
                " [ " +
                val.dutyStartTime +
                " - " +
                val.dutyStopTime +
                " ] " +
                "非暂存和审核通过的排班不能发布"
            );
            return;
          }
        }
        this.$showLoading();
        let res = await scheManagement.releaseScheduleNew(this.schedules);
        this.clearCheckId();
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.$hideLoading();
        this.getScheduleAndSon();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "发布排班失败");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  padding: $l-padding-default-5;

  .flex-box {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .table-box {
    margin-top: $l-margin-default-5;
    flex: 1;
    overflow: hidden;
  }

  >>> .onlyTableHeader {
    .el-table__empty-block {
      height: 0 !important;
      min-height: 0 !important;
    }
  }

  >>> .el-collapse-item__header {
    background: none;
  }

  >>> .el-collapse-item__content {
    padding: 0;
  }

  // >>> .gutter {
  //   width: 10px !important;
  //   display: table-cell !important;
  // }
  // >>> ::-webkit-scrollbar{

  // }
  .fbc {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .flc {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  >>> .warning-row {
    background: oldlace;
  }

  .listContent {
    max-height: 200px;
    overflow: auto;
    margin-top: 10px;
    border: 1px solid #e4e4e4;

    .deptItem {
      height: 30px;
      border-bottom: 1px solid #e4e4e4;
      padding: 0 10px;
      line-height: 30px;
    }
  }

  .currentClass {
    background: #f0f9eb;
  }

  .listItem{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  i {
    color: #409eff;
    margin: 5px;
    cursor: pointer;
    font-weight: bold !important;
  }
  /deep/ .el-button--text {
    padding: 0;
  }
  .disabled {
    color: #ccc;
    cursor: no-drop;
  }
}
</style>
