<template>
  <!--<div class="outpatientAppointment">
    <el-card class="left">
      <l-card-title>
        <span slot="left">患者列表</span>
      </l-card-title>
      <div :style="{height:'calc(100% - 63px)'}">
        <PatientList @listItemClick="listItemClickHandle"></PatientList>
      </div>
    </el-card>
    <el-card class="middle">
      <PatientInfoTop :patientInfo="selectedPatientInfo"></PatientInfoTop>
      <div class="department">
        <div>
          <div class="title">
            <div>门诊部门</div>
            <div>
              <el-button class="mini" size="mini" type="primary" @click="getDeptAndNum">刷新</el-button>
            </div>
          </div>
          &lt;!&ndash; <div class="item">
            <div class="top">科室名称</div>
            <div class="bottom">
              <div class="left">99/99</div>
              <div class="right">99/99</div>
            </div>
          </div>&ndash;&gt;
        </div>
        <div class="content">
          <div
            class="item"
            v-for="(item,index) in deptAndNumData"
            :key="index"
            @click="searchScheduleList(item.apptDeptCode)"
            :style="{backgroundColor:item.apptDeptCode==currentApptDeptCode?'#81D3F8':''}"
          >
            <div class="top">{{item.apptDeptName}}</div>
            <div class="bottom">
              <div class="left" title="剩余挂号号源/挂号限额">{{item.regUsableNum}}/{{item.regTotalNum}}</div>
              <div class="right" title="剩余预约号源/预约限额">{{item.apptUsableNum}}/{{item.apptTotalNum}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="schedul">
        <div class="title">
          <div>排班</div>
          <div>
            <el-button class="mini" size="mini" type="primary" @click="getScheduleByApptDept">刷新</el-button>
          </div>
        </div>
        <div class="content" v-loading.body="loading3">
          <div
            class="item"
            v-for="(item,index) in ScheduleData"
            :key="index"
            @click="searchScheduleListByScheduleId(item.scheduleId)"
            :style="{backgroundColor:item.scheduleId==currentScheduleSerialId?'#81D3F8':''}"
          >
            <div class="top">
              <div class="left flc" v-if="item.scheduleType=='1'">医</div>
              <div class="left flc" v-if="item.scheduleType=='2'">科</div>
              <div class="right flc">{{item.doctorName}}</div>
            </div>
            <div class="schedulMiddle">
              <div
                class="time flc"
              >{{item.dutyStartTime.substring(11,16)}}-{{item.dutyStopTime.substring(11,16)}}
              </div>
              <div class="price flc">{{item.regMoney}}元</div>
            </div>
            <div class="bottom">
              <div class="fcc one" title="剩余挂号号源/挂号限额">{{item.regUsableNum}}/{{item.sdeptLimitNum}}</div>
              <div class="fcc two" title="剩余预约号源/预约限额">{{item.apptUsableNum}}/{{item.apptLimitNum}}</div>
              <div class="fcc three" title="候诊人数">{{item.waitNum}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="RegistrationRecord">
        <div class="title">挂号记录查询</div>
        <div class="tableContent">
          <div class="fbc">
            <div class="searchLimi flc">
              <div class="date">
                <l-formt-title label="拟就诊日期">
                  <el-date-picker
                    v-model="date"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00','23:59:59']"
                  ></el-date-picker>
                </l-formt-title>
              </div>

              <el-button type="primary" @click="search">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
            <div class="buttonArea">
              <el-button
                type="primary"
                @click="appointCancelClick()"
                :disabled="!(((currentRegisteredData.regStatus=='0'||currentRegisteredData.regStatus=='1')&&(currentRegisteredData.recordStatus==1||currentRegisteredData.recordStatus==2||currentRegisteredData.recordStatus==3||currentRegisteredData.recordStatus==4||currentRegisteredData.recordStatus==5||currentRegisteredData.recordStatus==6))||(currentRegisteredData.regStatus=='1'&&currentRegisteredData.recordStatus==9))"
              >退号
              </el-button>
              <el-button
                type="primary"
                :disabled="!(currentRegisteredData.regStatus=='0'&&(currentRegisteredData.recordStatus==1||currentRegisteredData.recordStatus==2||currentRegisteredData.recordStatus==3||currentRegisteredData.recordStatus==4||currentRegisteredData.recordStatus==5||currentRegisteredData.recordStatus==6||currentRegisteredData.recordStatus==10))"
                @click="payClick"
              >缴费
              </el-button>
              <el-button
                type="primary"
                @click="appointTriageClick1"
                :disabled="!(currentRegisteredData.regStatus=='1'&&(currentRegisteredData.recordStatus==1||currentRegisteredData.recordStatus==6))"
              >分诊
              </el-button>
              <el-button
                type="primary"
                @click="appointChangeTriage1"
                :disabled="!(currentRegisteredData.regStatus=='1'&&(currentRegisteredData.recordStatus==2||currentRegisteredData.recordStatus==3||currentRegisteredData.recordStatus==4||currentRegisteredData.recordStatus==5))"
              >换诊
              </el-button>
            </div>
          </div>
          <el-table
            ref="scheduleTable"
            :data="registeredData"
            width="100%"
            height="calc(100% - 50px)"
            border
            style="margin-top:10px;"
            highlight-current-row
            @row-click="rowClick"
            v-loading.body="loading1"
          >
            <el-table-column
              v-for="(item, index) in RegisteredListParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop == 'ouptDeptId'">
                  <span
                    class="deptName"
                    tableName="sys_org"
                    :conditionMap="{
                          org_type: '_DEPT_',
                          id: scope.row[item.prop]
                        }"
                    columns="org_nm"
                    v-tableTransform
                  ></span>
                </template>
                <template v-else-if="item.prop == 'regStatus'">
                  <span v-if="scope.row[item.prop]=='0'">未收费</span>
                  <span v-if="scope.row[item.prop]=='1'">已收费</span>
                  <span v-if="scope.row[item.prop]=='2'">已退费</span>
                </template>
                <template v-else-if="item.prop == 'recordStatus'">
                  <span :val="scope.row[item.prop]" code="APPT_STATUS" v-codeTransform></span>
                </template>
                <template v-else-if="item.prop == 'regMoney'">
                  <span>{{ scope.row[item.prop].toFixed(2) }}</span>
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-card class="right">
      <l-card-title>
        <span slot="left">当前班次挂号记录</span>
      </l-card-title>
      <div class="flc">
        <el-button
          type="primary"
          @click="createApptClick"
          :disabled="!selectedPatientInfo.patientId||!currentScheduleSerialId"
          class="w55 fcc"
        >挂号
        </el-button>
        <el-button
          type="primary"
          @click="appointTriageClick2"
          :disabled="!(currentRegisteredByScheduleIdData.regStatus=='1'&&(currentRegisteredByScheduleIdData.recordStatus==1||currentRegisteredByScheduleIdData.recordStatus==6))"
          class="w55 fcc"
        >分诊
        </el-button>
        <el-button
          type="primary"
          @click="appointChangeTriage2"
          :disabled="!(currentRegisteredByScheduleIdData.regStatus=='1'&&(currentRegisteredByScheduleIdData.recordStatus==2||currentRegisteredByScheduleIdData.recordStatus==3||currentRegisteredByScheduleIdData.recordStatus==4||currentRegisteredByScheduleIdData.recordStatus==5))"
          class="w55 fcc"
        >换诊
        </el-button>
        <el-button
          type="primary"
          @click="printClick"
          :disabled="!(currentRegisteredByScheduleIdData.regStatus=='1'&&(currentRegisteredByScheduleIdData.recordStatus==1||currentRegisteredByScheduleIdData.recordStatus==2||currentRegisteredByScheduleIdData.recordStatus==3||currentRegisteredByScheduleIdData.recordStatus==4||currentRegisteredByScheduleIdData.recordStatus==5||currentRegisteredByScheduleIdData.recordStatus==6||currentRegisteredByScheduleIdData.recordStatus==10))"
          class="w55 fcc"
        >打印
        </el-button>
      </div>

      <div :style="{padding:'10px 0'}">
        <el-checkbox class v-model="checked">打印挂号凭证</el-checkbox>
      </div>
      <el-table
        ref="scheduleTable"
        :data="registeredByScheduleIdData"
        width="100%"
        height="calc(100% - 145px)"
        border
        highlight-current-row
        @row-click="rowClickByScheduleId"
        v-loading="loading2"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          v-for="(item, index) in RegisteredByScheduleIdListParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <template v-if="item.prop == 'recordStatus'">
              <span :val="scope.row[item.prop]" code="APPT_STATUS" v-codeTransform></span>
            </template>
            <template v-else-if="item.prop == 'appointType'">
              <span v-if="scope.row[item.prop]=='1'">挂号</span>
              <span v-if="scope.row[item.prop]=='0'">预约</span>
            </template>
            <template
              v-else-if="item.prop == 'appointmentTime'"
            >{{ scope.row[item.prop].substring(5,16) }}
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="收费"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="700px"
      @close="closeDialog"
    >
      <l-charge :charge="newLchrage" :isApptointment="true" @close="close"></l-charge>
    </el-dialog>
    <el-dialog title="退费结算" :visible.sync="returnVis">
      <ReturnPreDialog
        v-if="returnVis"
        :refundApplyData="currentRegisteredData.tradeId"
        @close="returnClose"
      />
    </el-dialog>
  </div>-->
  <div class="outpatientAppointment">
    <l-layout
      :boxExpanded="false"
      :isToolBox="true"
      :hasThreeRouterFlag="false"
      :patientListShow="true"
      displayMode="expand"
    >
      <template #topSlot>
        <PatientInfoTop :patientInfo="selectedPatientInfo" />
      </template>
      <template #list>
        <el-card class="height100 width100 padding10">
          <l-card-title>
            <span slot="left">患者列表</span>
          </l-card-title>
          <div class="patient-list">
            <PatientList @listItemClick="listItemClickHandle" />
          </div>
        </el-card>
      </template>
      <template #content>
        <el-card class="middle width100 height100 clearfix">
          <div class="card width100 height100 padding10 float-left">
            <div class="department">
              <div>
                <div class="title">
                  <div>门诊部门</div>
                  <div>
                    <el-button class="mini" size="mini" type="primary" @click="getDeptAndNum">刷新</el-button>
                  </div>
                </div>
                <!-- <div class="item">
                  <div class="top">科室名称</div>
                  <div class="bottom">
                    <div class="left">99/99</div>
                    <div class="right">99/99</div>
                  </div>
                </div>-->
              </div>
              <div class="content">
                <div
                  class="item"
                  v-for="(item,index) in deptAndNumData"
                  :key="index"
                  @click="searchScheduleList(item.apptDeptCode)"
                  :style="{backgroundColor:item.apptDeptCode==currentApptDeptCode?'#81D3F8':''}"
                >
                  <div class="top">{{item.apptDeptName}}</div>
                  <div class="bottom">
                    <div class="left" title="剩余挂号号源/挂号限额">{{item.regUsableNum}}/{{item.regTotalNum}}</div>
                    <div
                      class="right"
                      title="剩余预约号源/预约限额"
                    >{{item.apptUsableNum}}/{{item.apptTotalNum}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="schedul">
              <div class="title">
                <div>排班</div>
                <div>
                  <el-button
                    class="mini"
                    size="mini"
                    type="primary"
                    @click="getScheduleByApptDept"
                  >刷新</el-button>
                </div>
              </div>
              <div class="content" v-loading.body="loading3">
                <div
                  class="item"
                  v-for="(item,index) in ScheduleData"
                  :key="index"
                  @click="searchScheduleListByScheduleId(item.scheduleId)"
                  :style="{backgroundColor:item.scheduleId==currentScheduleSerialId?'#81D3F8':''}"
                >
                  <div class="top">
                    <div class="left flc" v-if="item.scheduleType=='1'">医</div>
                    <div class="left flc" v-if="item.scheduleType=='2'">科</div>
                    <div class="right flc">{{item.doctorName}}</div>
                  </div>
                  <div class="schedulMiddle">
                    <div
                      class="time flc"
                    >{{item.dutyStartTime.substring(11,16)}}-{{item.dutyStopTime.substring(11,16)}}</div>
                    <div class="price flc">{{item.regMoney}}元</div>
                  </div>
                  <div class="bottom">
                    <div
                      class="fcc one"
                      title="剩余挂号号源/挂号限额"
                    >{{item.regUsableNum}}/{{item.allRegNum}}</div>
                    <div
                      class="fcc two"
                      title="剩余预约号源/预约限额"
                    >{{item.apptUsableNum}}/{{item.apptLimitNum}}</div>
                    <div class="fcc three" title="候诊人数">{{item.waitNum}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="RegistrationRecord">
              <div class="title">挂号记录查询</div>
              <div class="tableContent">
                <div class="fbc">
                  <div class="searchLimi flc">
                    <div class="date">
                      <l-formt-title label="拟就诊日期">
                        <el-date-picker
                          v-model="date"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          :default-time="['00:00:00','23:59:59']"
                        ></el-date-picker>
                      </l-formt-title>
                    </div>

                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button @click="reset">重置</el-button>
                  </div>
                  <div class="buttonArea">
                    <el-button
                      type="primary"
                      @click="appointCancelClick()"
                      :disabled="!(((currentRegisteredData.regStatus=='0'||currentRegisteredData.regStatus=='1')&&(currentRegisteredData.recordStatus==1||currentRegisteredData.recordStatus==2||currentRegisteredData.recordStatus==3||currentRegisteredData.recordStatus==4||currentRegisteredData.recordStatus==5||currentRegisteredData.recordStatus==6))||(currentRegisteredData.regStatus=='1'&&currentRegisteredData.recordStatus==9))"
                    >退号</el-button>
                    <el-button
                      type="primary"
                      :disabled="!(currentRegisteredData.regStatus=='0'&&(currentRegisteredData.recordStatus==1||currentRegisteredData.recordStatus==2||currentRegisteredData.recordStatus==3||currentRegisteredData.recordStatus==4||currentRegisteredData.recordStatus==5||currentRegisteredData.recordStatus==6||currentRegisteredData.recordStatus==10))"
                      @click="payClick"
                    >缴费</el-button>
                    <el-button
                      type="primary"
                      @click="appointTriageClick1"
                      :disabled="!(currentRegisteredData.regStatus=='1'&&(currentRegisteredData.recordStatus==1||currentRegisteredData.recordStatus==6))"
                    >分诊</el-button>
                    <el-button
                      type="primary"
                      @click="appointChangeTriage1"
                      :disabled="!(currentRegisteredData.regStatus=='1'&&(currentRegisteredData.recordStatus==2||currentRegisteredData.recordStatus==3||currentRegisteredData.recordStatus==4||currentRegisteredData.recordStatus==5))"
                    >换诊</el-button>
                  </div>
                </div>
                <el-table
                  ref="scheduleTable"
                  :data="registeredData"
                  width="100%"
                  height="calc(100% - 50px)"
                  border
                  style="margin-top:10px;"
                  highlight-current-row
                  @row-click="rowClick"
                  v-loading.body="loading1"
                >
                  <el-table-column
                    v-for="(item, index) in RegisteredListParams"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :min-width="item.width"
                    :align="item.align || 'left'"
                    :header-align="item.headerAlign || 'left'"
                    :fixed="item.fixed"
                  >
                    <template slot-scope="scope">
                      <template v-if="item.prop == 'ouptDeptId'">
                        <span
                          class="deptName"
                          tableName="sys_org"
                          :conditionMap="{
                          org_type: '_DEPT_',
                          id: scope.row[item.prop]
                        }"
                          columns="org_nm"
                          v-tableTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop == 'regStatus'">
                        <span v-if="scope.row[item.prop]=='0'">未收费</span>
                        <span v-if="scope.row[item.prop]=='1'">已收费</span>
                        <span v-if="scope.row[item.prop]=='2'">已退费</span>
                      </template>
                      <template v-else-if="item.prop == 'recordStatus'">
                        <span :val="scope.row[item.prop]" code="APPT_STATUS" v-codeTransform></span>
                      </template>
                      <template v-else-if="item.prop == 'regMoney'">
                        <span v-if="scope.row[item.prop]">{{ scope.row[item.prop].toFixed(2) || "0.00" }}</span>
                        <span v-else>{{ "0.00" }}</span>
                      </template>
                      <template v-else>{{ scope.row[item.prop] }}</template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div class="height100 padding10 float-left" style="width: 285px">
            <l-card-title>
              <span slot="left">号源信息</span>
            </l-card-title>
            <div class="flc">
              <el-button
                type="primary"
                @click="createApptClick"
                :disabled="!selectedPatientInfo.patientId||!currentScheduleSerialId"
                class="fcc"
              >挂号</el-button>
              <el-button
                type="primary"
                @click="appointTriageClick2"
                :disabled="!(currentRegisteredByScheduleIdData.regStatus=='1'&&(currentRegisteredByScheduleIdData.recordStatus==1||currentRegisteredByScheduleIdData.recordStatus==6))"
                class="fcc"
              >分诊</el-button>
              <!-- <el-button
                type="primary"
                @click="appointChangeTriage2"
                :disabled="!(currentRegisteredByScheduleIdData.regStatus=='1'&&(currentRegisteredByScheduleIdData.recordStatus==2||currentRegisteredByScheduleIdData.recordStatus==3||currentRegisteredByScheduleIdData.recordStatus==4||currentRegisteredByScheduleIdData.recordStatus==5))"
                class="w55 fcc"
              >换诊
              </el-button>-->
              <el-button
                type="primary"
                @click="printClick"
                :disabled="!(currentRegisteredByScheduleIdData.regStatus=='1'&&(currentRegisteredByScheduleIdData.recordStatus==1||currentRegisteredByScheduleIdData.recordStatus==2||currentRegisteredByScheduleIdData.recordStatus==3||currentRegisteredByScheduleIdData.recordStatus==4||currentRegisteredByScheduleIdData.recordStatus==5||currentRegisteredByScheduleIdData.recordStatus==6||currentRegisteredByScheduleIdData.recordStatus==10))"
                class="fcc"
              >打印</el-button>
            </div>

            <div :style="{padding:'10px 0'}">
              <el-checkbox class v-model="checked">打印挂号凭证</el-checkbox>
            </div>
            <el-table
              ref="scheduleTableRight"
              :data="registeredByScheduleIdData"
              width="100%"
              height="calc(100% - 145px)"
              border
              highlight-current-row
              @row-click="rowClickByScheduleId"
              v-loading="loading2"
              :row-class-name="tableRowClassName"
            >
              <el-table-column
                v-for="(item, index) in RegisteredByScheduleIdListParams"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :align="item.align || 'left'"
                :header-align="item.headerAlign || 'left'"
                :fixed="item.fixed"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop == 'recordStatus'">
                    <span :val="scope.row[item.prop]" code="APPT_STATUS" v-codeTransform></span>
                  </template>
                  <template v-else-if="item.prop == 'appointmentTime'">
                    <span :class="{cGray:new Date().getTime()>new Date(scope.row[item.prop]).getTime()}">{{scope.row[item.prop]}}</span>
                  </template>
                  <template v-else-if="item.prop == 'appointType'">
                    <span v-if="scope.row[item.prop]=='1'">挂号</span>
                    <span v-if="scope.row[item.prop]=='0'">预约</span>
                  </template>
                  <template
                    v-else-if="item.prop == 'appointmentTime'"
                  >{{ scope.row[item.prop].substring(5,16) }}</template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-dialog
            title="收费"
            :visible.sync="dialogVisible"
            v-if="dialogVisible"
            width="700px"
            @close="closeDialog"
          >
            <l-charge :charge="newLchrage" :isApptointment="true" @close="close"></l-charge>
          </el-dialog>
          <el-dialog title="退费结算" :visible.sync="returnVis">
            <ReturnPreDialog
              v-if="returnVis"
              :refundApplyData="currentRegisteredData.tradeId"
              @close="returnClose"
            />
          </el-dialog>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>
<script>
import outpatientAppointment from "@/api/appointmentNew/outpatientAppointment.js";
import ReturnPreDialog from "@/views/cis/settleAccount/returnCharge/components/returnPreDialog.vue";
import service from "@/api/appointment/appointment";
import { onPreview } from "@/utils/print";

export default {
  components: {
    ReturnPreDialog
  },
  data() {
    return {
      checked: false,
      selectedPatientInfo: {},
      date: [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ],
      deptAndNumData: [],
      ScheduleData: [],
      registeredData: [], //挂号记录
      currentRegisteredData: {}, //当前选中的挂号记录
      registeredByScheduleIdData: [], //通过排班查询到的挂号记录数据
      currentRegisteredByScheduleIdData: {}, //当前选中的通过排班查询到的挂号记录
      currentApptDeptCode: "",
      currentScheduleSerialId: "",
      // 缴费弹窗
      dialogVisible: false,
      returnVis: false,
      loading1: false,
      loading2: false,
      loading3: false,
      newLchrage: {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      },
      RegisteredListParams: [
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "110"
        },
        {
          prop: "phoneNum",
          label: "联系方式",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "110"
        },
        {
          prop: "ouptDeptId",
          label: "科室",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "110"
        },
        {
          prop: "doctorName",
          label: "接诊医生",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "110"
        },
        {
          prop: "appointmentTime",
          label: "拟就诊时间",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "150"
        },
        {
          prop: "regMoney",
          label: "挂号费",
          align: "right",
          headerAlign: "center",
          fixed: false,
          width: "80"
        },
        {
          prop: "regStatus",
          label: "收费状态",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "90"
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "110"
        },
        {
          prop: "updatedAt",
          label: "操作时间",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "150"
        }
      ],
      RegisteredByScheduleIdListParams: [
        {
          prop: "appointmentTime",
          label: "拟就诊时间",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "110"
        },
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "80"
        },
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "80"
        },
        {
          prop: "appointType",
          label: "号源类型",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "80"
        },
        {
          prop: "phoneNum",
          label: "联系方式",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "150"
        }
      ]
    };
  },
  mounted() {
    this.getDeptAndNum();
  },
  methods: {
    //查询科室
    async getDeptAndNum() {
      // //清空当前选中科室
      // this.currentApptDeptCode='';
      try {
        let res = await outpatientAppointment.getDeptAndNum();
        this.deptAndNumData = res.data;
        if (res.code == 1 && res.data.length == 0) {
          this.$message("未查询到门诊部门号源信息");
        }
      } catch (error) {
        this.$message.error(error.msg);
      }
    },
    //查询排班
    async getScheduleByApptDept(apptCode) {
      if (!this.currentApptDeptCode) {
        this.$message.error("请先选择要查询排班的科室");
        return false;
      }
      //清空当前选中的排班
      // this.currentScheduleSerialId='';
      this.registeredByScheduleIdData = [];
      try {
        this.loading3 = true;
        let res = await outpatientAppointment.getScheduleByApptDept({
          apptDept: this.currentApptDeptCode,
          startDate: new Date().format("yyyy-MM-dd") + " 00:00:00",
          stopDate: new Date().format("yyyy-MM-dd") + " 23:59:59"
        });
        this.ScheduleData = res.data;
        this.loading3 = false;
      } catch (error) {
        this.loading3 = false;
        this.$message.error(error.msg);
      }
    },
    //查询挂号记录
    async getRegisteredList() {
      if (this.selectedPatientInfo && !this.selectedPatientInfo.patientId) {
        this.$message.error("请先选择一个患者");
        return false;
      }
      //清空当前选中挂号记录
      this.currentRegisteredData = {};
      try {
        this.loading1 = true;
        console.log(this.date);
        let res = await outpatientAppointment.getRegisteredList({
          patientId: this.selectedPatientInfo.patientId,
          startDate: (this.date && this.date[0]) || "",
          stopDate: (this.date && this.date[1]) || ""
        });
        this.registeredData = res.data;
        this.loading1 = false;
        // this.$$nextTick(()=>{
        //   this.$refs.scheduleTable && this.$refs.scheduleTable.doLayout();
        // })
      } catch (error) {
        this.loading1 = false;
        // this.$message.error(error.msg);
      }
    },
    //根据选中的排班查询挂号记录
    async getApptByScheduleId() {
      if (!this.currentScheduleSerialId) {
        return false;
      }
      //清空当前选中的右侧表格记录
      this.currentRegisteredByScheduleIdData = {};
      try {
        this.loading2 = true;
        let res = await outpatientAppointment.getApptByScheduleId({
          scheduleSerialId: this.currentScheduleSerialId
        });
        this.registeredByScheduleIdData = res.data;
        this.loading2 = false;
      } catch (error) {
        this.loading2 = false;
        this.$message.error(error.msg);
      }
    },
    //创建预约
    async createApptClick() {
      // if (!this.currentRegisteredByScheduleIdData.appointmentId) {
      //   this.$message("请先选择一条数据记录");
      //   return false;
      // }
      try {
        this.$showLoading();
        let res = await outpatientAppointment.createAppt({
          scheduleId: this.currentScheduleSerialId, // 排班ID
          appointmentId:
            this.currentRegisteredByScheduleIdData.appointmentId || "", // 预约ID
          patientId: this.selectedPatientInfo.patientId, // 患者ID
          channel: 1, // 预约渠道
          appointType: 1, // 预约类型 0：预约 1：挂号
          isAutoAppendNum: false // 是否自动加号  (true  false   布尔类型)
        });
        if (this.checked) {
          this.printClick();
        }
        this.$hideLoading();
        this.$message.success(res.msg || "挂号成功");
        this.getRegisteredList();
        this.getApptByScheduleId();
        this.getDeptAndNum();
        this.getScheduleByApptDept();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    //取消预约
    async appointCancelClick(apptCode) {
      // if (!this.currentRegisteredData.appointmentId) {
      //   this.$message.error("请先选择一条数据记录");
      //   return false;
      // }
      if (this.currentRegisteredData.regStatus == "0") {
        //未收费
        try {
          this.$showLoading();
          let res = await outpatientAppointment.appointCancel({
            appointmentId: this.currentRegisteredData.appointmentId,
            channel: 1
          });
          this.$hideLoading();
          this.$message.success(res.msg);
          await this.getRegisteredList();
          this.getDeptAndNum();
          this.getScheduleByApptDept();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg);
        }
      } else if (this.currentRegisteredData.regStatus == "1") {
        this.returnVis = true;
      }
    },
    appointTriageClick1() {
      if (!this.currentRegisteredData.appointmentId) {
        this.$message.error("请先选择一条数据记录");
        return false;
      }
      // if (this.currentRegisteredData.recordStatus == '99') {
      //   this.$message.error("预约信息未使用,不能分诊");
      //   return false;
      // }
      this.appointTriage(this.currentRegisteredData.appointmentId);
    },
    appointTriageClick2() {
      if (!this.currentRegisteredByScheduleIdData.appointmentId) {
        this.$message.error("请先选择一条数据记录");
        return false;
      }
      if (this.currentRegisteredByScheduleIdData.recordStatus == "99") {
        this.$message.error("预约信息未使用,不能分诊");
        return false;
      }
      this.appointTriage(this.currentRegisteredByScheduleIdData.appointmentId);
    },
    //分诊
    async appointTriage(appointmentId) {
      try {
        this.$showLoading();
        let res = await outpatientAppointment.appointTriage({
          appointmentId
        });
        this.$hideLoading();
        this.$message.success(res.msg);
        this.getRegisteredList();
        this.getApptByScheduleId();
        this.getDeptAndNum();
        if(this.currentApptDeptCode){
          this.getScheduleByApptDept();
        }
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    search() {
      this.getRegisteredList();
    },
    reset() {
      this.date = [
        new Date().format("yyyy-MM-dd") + " 00:00:00",
        new Date().format("yyyy-MM-dd") + " 23:59:59"
      ];
    },
    rowClick(row) {
      this.currentRegisteredData = { ...row };
    },
    rowClickByScheduleId(row) {
      if (
        row.appointmentId ===
        this.currentRegisteredByScheduleIdData.appointmentId
      ) {
        this.$refs.scheduleTableRight.setCurrentRow();
        this.currentRegisteredByScheduleIdData = {};
      } else {
        this.currentRegisteredByScheduleIdData = { ...row };
      }
    },
    searchScheduleList(apptCode) {
      this.currentApptDeptCode = apptCode;
      this.getScheduleByApptDept();
    },
    searchScheduleListByScheduleId(scheduleId) {
      this.currentScheduleSerialId = scheduleId;
      this.getApptByScheduleId();
    },
    listItemClickHandle(data) {
      console.log(111);
      this.selectedPatientInfo = data;
      this.getRegisteredList();
    },
    printClick() {
      onPreview(
        {
          visitCode: this.currentRegisteredByScheduleIdData.visitCode,
          name: this.currentRegisteredByScheduleIdData.patientName,
          departName: this.currentRegisteredByScheduleIdData.outpDeptName,
          floors: this.currentRegisteredByScheduleIdData.roomLocation, //就诊地点
          visitTime: this.currentRegisteredByScheduleIdData.appointmentTime,
          num: "",
          doctorName: this.currentRegisteredByScheduleIdData.doctorName,
          roomNum: this.currentRegisteredByScheduleIdData.roomName,
          chargePrice: this.currentRegisteredByScheduleIdData.regMoney,
          chargeType: "挂号",
          visitDate: this.currentRegisteredByScheduleIdData.updatedAt
        },
        "挂号凭证"
      );
    },
    async payClick() {
      if (!this.currentRegisteredData.appointmentId) {
        this.$message.error("请选择一条预约记录");
        return;
      }
      //当前选中的预约数据
      this.newLchrage.appointment = this.currentRegisteredData;
      //获取收费明细
      let ChargeRegDetail = this.getChargeRegDetail();
      // 待收费对象转换
      this.changeObj(ChargeRegDetail);
      //获取患者的充值信息 （组件内部已集成此方法）
      // const { data } = await service.getAccountInfo(
      //   this.selectedPatientInfo.patientId
      // );
      // this.newLchrage.accountInfo = data;
      this.dialogVisible = true;
    },
    async getChargeRegDetail() {
      let { data } = await service.getChargeRegDetail({
        birthDate: "",
        regDiagTreatType: this.currentRegisteredData.diagTreatType,
        regWorkCode: this.currentRegisteredData.workCode
      });
      return data;
    },
    // 对象转换
    changeObj(ChargeRegDetail) {
      let chargePrescriptions = [];
      for (let i = 0; i < ChargeRegDetail.length; i++) {
        let item = ChargeRegDetail[i];
        let obj = {
          orderName: item.chargeItemName,
          dosageUnit: item.chargeUnit,
          quantity: "1",
          price: item.chargePrice,
          orderItemId: item.chargeItemId,
          orderItemCat: item.statisticsCode,
          prescriptionSource: "9",
          num: "1",
          visitId: this.currentRegisteredData.appointmentId,
          ouptDeptId: this.currentRegisteredData.ouptDeptId, // 专科id
          groupId: item.groupNo, // 组号
          groupNo: item.groupNo
        };
        chargePrescriptions.push(obj);
      }
      this.newLchrage.chargePrescriptions = chargePrescriptions;
    },
    close() {
      this.dialogVisible = false;
      this.newLchrage = {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      };
      this.getRegisteredList();
    },
    closeDialog() {
      this.getRegisteredList();
    },
    returnClose(val) {
      if (val && val.refresh) {
        this.getRegisteredList();
        this.getApptByScheduleId();
        this.getDeptAndNum();
        this.getScheduleByApptDept();
      }
      this.returnVis = false;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.appointType == "0") {
        return "appointColor";
      } else if (row.appointType == "1") {
        return "regColor";
      }
      return "";
    },
    //底部挂号记录换诊按钮
    async appointChangeTriage1() {
      if (!this.currentScheduleSerialId) {
        this.$message.error("请选择一个排班");
        return;
      }
      try {
        let res = await outpatientAppointment.appointChangeTriage({
          appointmentId: this.currentRegisteredData.appointmentId,
          newScheduleId: this.currentScheduleSerialId,
          channel: 1
        });
        this.getRegisteredList();
        this.getDeptAndNum();
        this.getScheduleByApptDept();
        this.$message.success(res.msg || "换诊成功");
      } catch (error) {
        this.$message.error(error.msg);
      }
    },
    //右侧挂号记录换诊按钮
    async appointChangeTriage2() {
      if (!this.currentScheduleSerialId) {
        this.$message.error("请选择一个排班");
        return;
      }
      try {
        let res = await outpatientAppointment.appointChangeTriage({
          appointmentId: this.currentRegisteredByScheduleIdData.appointmentId,
          newScheduleId: this.currentScheduleSerialId,
          channel: 1
        });
        this.getApptByScheduleId();
        this.getDeptAndNum();
        this.getScheduleByApptDept();
        this.$message.success(res.msg || "换诊成功");
      } catch (error) {
        this.$message.error(error.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.outpatientAppointment {
  display: flex;
  height: 100%;

  >>> .appointColor {
    background: oldlace;
  }

  >>> .regColor {
    background: #f0f9eb;
  }

  >>> .gutter {
    width: 10px !important;
    display: table-cell !important;
  }

  .left {
    width: 285px;
    height: 100%;
    padding: 0 10px;
  }

  .middle {
    /*height: 100%;
      padding: 10px;
      width: calc(100% - 590px);
      margin-left: 10px;*/

    .department {
      display: flex;
      border-bottom: 1px solid #eee;

      padding: 20px 0;

      .title {
        width: 100px;
        height: 100%;
        font-size: 20px;
        font-weight: bold;
        flex-direction: column;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
      }

      .content {
        display: flex;
        height: 190px;
        width: calc(100% - 100px);
        flex-wrap: wrap;
        overflow: auto;

        .item {
          width: 200px;
          height: 80px;
          margin-right: 10px;
          margin-bottom: 10px;
          border: 1px solid #eee;

          .top {
            height: 40px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .bottom {
            height: 40px;
            display: flex;

            .left {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100px;
              border-right: 1px solid #eee;
            }

            .right {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100px;
            }
          }
        }
      }
    }

    .schedul {
      display: flex;
      border-bottom: 1px solid #eee;

      padding: 20px 0;

      .title {
        width: 100px;
        font-size: 20px;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }

      .content {
        display: flex;
        flex-wrap: wrap;
        height: 130px;
        width: calc(100% - 100px);
        overflow: auto;

        .item {
          width: 200px;
          height: 120px;
          margin-right: 10px;
          margin-bottom: 10px;
          border: 1px solid #eee;

          .top {
            display: flex;

            .left {
              font-size: 20px;
              font-weight: bold;
              width: 100px;
              height: 40px;
            }

            .right {
              width: 100px;
              height: 40px;
            }
          }

          .schedulMiddle {
            display: flex;
            height: 40px;

            .time {
              width: 150px;
              height: 40px;
              margin-left: 10px;
            }

            .price {
              width: 50px;
              height: 40px;
            }
          }

          .bottom {
            height: 40px;
            display: flex;
            justify-content: space-around;
            border-top: 1px solid #eee;

            .one {
              border-right: 1px solid #eee;
              display: flex;
              flex-grow: 1;
            }

            .two {
              border-right: 1px solid #eee;
              display: flex;
              flex-grow: 1;
            }

            .three {
              display: flex;
              flex-grow: 1;
            }
          }
        }
      }
    }

    .RegistrationRecord {
      margin-top: 10px;
      height: calc(100% - 422px);

      .title {
        font-size: 20px;
        font-weight: bold;
      }

      .tableContent {
        height: calc(100% - 23px);

        .searchLimi {
          margin-top: 10px;

          .date {
            width: 440px;
            margin-right: 20px;
          }
        }
      }
    }
  }

  .right {
    width: 285px;
    height: 100%;
    padding: 0 10px;
    margin-left: 10px;
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

  .fcc {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .w55 {
    width: 55px;
  }

  .mini {
    height: auto;
    padding: 7px 12px;
    font-size: 12px;
  }

  .card {
    height: 100%;
    width: calc(100% - 285px);
    border-right: 1px solid $l-color-bgcolor-11;
    // margin-right: 10px;
  }
  .cGray{
    color:#ccc;
  }
}

.patient-list {
  height: calc(100% - 63px);
}
</style>
