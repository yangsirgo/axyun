<template>
  <el-card class="appointmentOrder height100 clearfix">
    <div class="appoint-left height100 float-left">
      <div class="nav-bar margin-bottom-10">
        <el-row :gutter="10">
          <div class="width100 common-contain">
            <l-common-search rightAreaWidth="250">
              <template slot="leftCon">
                <div class="common-item" style="width: 280px">
                  <l-formt-title label="日期">
                    <el-date-picker
                      v-model="searchValue.date"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                    ></el-date-picker>
                  </l-formt-title>
                </div>
                <div class="common-item">
                  <l-formt-title label="医生姓名">
                    <el-select
                      v-model="searchValue.doctorId"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="姓名/拼音/五笔"
                      :remote-method="selectAllUser"
                      :loading="selLoading"
                      @change="setUseUserInfo"
                      clearable
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </l-formt-title>
                </div>
                <div class="common-item">
                  <l-formt-title label="专科">
                    <!-- <l-value-domain
                      clearable
                      remoteUrl="/wadmin/hos/dept"
                      type="select"
                      :value.sync="searchValue.deptId"
                      remoteShowKey="orgNm"
                      remoteValueKey="id"
                      placeholder
                    ></l-value-domain>-->
                    <el-select clearable v-model="searchValue.deptId">
                      <el-option
                        v-for="item in deptIdOptions"
                        :key="item.id"
                        :label="item.orgNm"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </l-formt-title>
                </div>
                <div class="common-item">
                  <l-formt-title label="门诊部门">
                    <el-select clearable v-model="searchValue.apptDept">
                      <el-option
                        v-for="item in apptDeptOptions"
                        :key="item.dictCode"
                        :label="item.dictName"
                        :value="item.dictCode"
                      ></el-option>
                    </el-select>
                    <!-- <l-value-domain
                      clearable
                      style="width:100%"
                      :value.sync="searchValue.apptDept"
                      remoteUrl="/appointment/dictValue/getDictValueList?dictItemCode=A0003&recordStatus=1"
                      type="select"
                      remoteShowKey="dictName"
                      remoteValueKey="dictCode"
                      placeholder
                    ></l-value-domain>-->
                  </l-formt-title>
                </div>
              </template>
              <template slot="rightCon">
                <div class="btns-contain">
                  <el-button type="primary" @click="search">查询</el-button>
                  <el-button
                    type="primary"
                    class="plain-btn"
                    plain
                    @click="reset"
                    >重置</el-button
                  >
                  <el-button
                    type="primary"
                    plain
                    class="float-right"
                    @click="setAppointmentListDia"
                    >挂号记录</el-button
                  >
                </div>
              </template>
            </l-common-search>
          </div>
        </el-row>
      </div>
      <div class="table-cont">
        <el-table
          ref="treeTable"
          :data="treeData"
          height="100%"
          v-loading="loading1"
          row-key="scheduleId"
          border
          stripe
          :tree-props="{
            children: 'apptAndScheduleVOS',
            hasChildren: 'hasChildren',
          }"
          :span-method="arraySpanMethod"
          @row-click="rowClick1"
          highlight-current-row
          default-expand-all
        >
          <el-table-column
            v-for="(item, index) in columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="scope.row['level'] === '1'">{{
                scope.row[item.prop]
              }}</template>
              <template v-else>
                <template v-if="item.prop === 'recordStatus'">
                  <!-- 状态 -->
                  <!-- <span :val="scope.row[item.prop]" code="APPT_STATUS" v-codeTransform></span> -->
                  <span v-if="scope.row[item.prop] == '1'">发布</span>
                  <span v-else-if="scope.row[item.prop] == '2'">暂存</span>
                  <span v-else-if="scope.row[item.prop] == '5'">停诊</span>
                  <span v-else-if="scope.row[item.prop] == '3'">驳回</span>
                  <span v-else-if="scope.row[item.prop] == '4'">审核</span>
                </template>
                <template v-else-if="item.prop === 'scheduleType'">
                  <!-- 类型 -->
                  <span v-if="scope.row[item.prop] === '1'">医生</span>
                  <span v-else-if="scope.row[item.prop] === '2'">科室</span>
                  <span v-else></span>
                </template>
                <template v-else-if="item.prop === 'isOnline'">
                  <template v-if="scope.row[item.prop] !== undefined">
                    <el-checkbox
                      v-model="scope.row[item.prop]"
                      true-label="1"
                      false-label="2"
                      disabled
                    ></el-checkbox>
                  </template>
                </template>
                <template v-else-if="item.prop === 'dutyStartDate'">
                  <span v-if="scope.row.dutyStartTime.length">{{
                    scope.row.dutyStartTime.substring(0, 10)
                  }}</span>
                  <!-- 日期 -->
                </template>
                <template v-else-if="item.prop === 'dutyStartTime'">
                  <span v-if="scope.row[item.prop].length">{{
                    scope.row[item.prop].substring(11, 19)
                  }}</span>
                  <!-- 日期 -->
                </template>
                <template v-else-if="item.prop === 'dutyStopTime'">
                  <span v-if="scope.row[item.prop].length">{{
                    scope.row[item.prop].substring(11, 19)
                  }}</span>
                  <!-- 日期 -->
                </template>
                <template v-else-if="item.prop === 'week'">
                  <span v-if="scope.row['dutyStartTime'].length >= 11">{{
                    getWeek(scope.row["dutyStartTime"].substring(0, 10))
                  }}</span>
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="appoint-right height100 float-left">
      <div class="nav-bar" style="height: 76px">
        <div style="height: 38px">
          <el-button
            type="primary"
            @click="setAppointment"
            :disabled="!singleCurrentRow.scheduleId"
            >挂号</el-button
          >
          <el-button
            type="primary"
            @click="patientInfoReplace"
            :disabled="
              !(multiCurrentRow.patientName && !multiCurrentRow.patientId)
            "
            >信息更换</el-button
          >
          <el-button
            type="primary"
            @click="appointCancelClick"
            :disabled="
              !(
                ((multiCurrentRow.regStatus == '0' ||
                  multiCurrentRow.regStatus == '1') &&
                  (multiCurrentRow.recordStatus == 1 ||
                    multiCurrentRow.recordStatus == 2 ||
                    multiCurrentRow.recordStatus == 3 ||
                    multiCurrentRow.recordStatus == 4 ||
                    multiCurrentRow.recordStatus == 5 ||
                    multiCurrentRow.recordStatus == 6)) ||
                (multiCurrentRow.regStatus == '1' &&
                  multiCurrentRow.recordStatus == 9)
              )
            "
            >退号</el-button
          >
          <el-button
            type="primary"
            @click="payClick"
            :disabled="
              !(
                multiCurrentRow.regStatus == '0' &&
                (multiCurrentRow.recordStatus == 1 ||
                  multiCurrentRow.recordStatus == 2 ||
                  multiCurrentRow.recordStatus == 3 ||
                  multiCurrentRow.recordStatus == 4 ||
                  multiCurrentRow.recordStatus == 5 ||
                  multiCurrentRow.recordStatus == 6 ||
                  multiCurrentRow.recordStatus == 10)
              )
            "
            >缴费</el-button
          >
          <el-button
            type="primary"
            @click="appointTriageClick"
            :disabled="
              !(
                multiCurrentRow.regStatus == '1' &&
                (multiCurrentRow.recordStatus == 1 ||
                  multiCurrentRow.recordStatus == 6)
              )
            "
            >分诊</el-button
          >
          <el-button
            type="primary"
            @click="printClick"
            :disabled="
              !(
                multiCurrentRow.regStatus == '1' &&
                (multiCurrentRow.recordStatus == 1 ||
                  multiCurrentRow.recordStatus == 2 ||
                  multiCurrentRow.recordStatus == 3 ||
                  multiCurrentRow.recordStatus == 4 ||
                  multiCurrentRow.recordStatus == 5 ||
                  multiCurrentRow.recordStatus == 6 ||
                  multiCurrentRow.recordStatus == 10)
              )
            "
            >打印</el-button
          >
        </div>
        <div style="padding: 9.5px 0; height: 38px">
          <el-checkbox
            v-model="searchValue2.checked1"
            :disabled="!this.singleCurrentRow.scheduleId"
            >指定时间点预约</el-checkbox
          >
          <el-checkbox v-model="searchValue2.checked2"
            >不打印预约单</el-checkbox
          >
        </div>
      </div>
      <div class="table-cont">
        <el-table
          ref="multiTable"
          :data="multiData"
          width="100%"
          height="100%"
          border
          stripe
          highlight-current-row
          @row-click="rowClick2"
          v-loading="loading2"
        >
          <el-table-column
            v-for="(item, index) in multiParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'patientName'">
                <span :class="{ nameColor: !scope.row['patientId'] }">{{
                  scope.row[item.prop]
                }}</span>
              </template>
              <template v-else-if="item.prop == 'appointmentTime'">
                <span
                  v-if="scope.row[item.prop]"
                  :class="{
                    cGray:
                      new Date().getTime() >
                      new Date(scope.row[item.prop]).getTime(),
                  }"
                  >{{ scope.row[item.prop].split(" ")[1] }}</span
                >
                <span
                  v-else
                  :class="{
                    cGray:
                      new Date().getTime() >
                      new Date(scope.row[item.prop]).getTime(),
                  }"
                  >{{ "加号" }}</span
                >
              </template>
              <template v-else-if="item.prop == 'recordStatus'">
                <span
                  :val="scope.row[item.prop]"
                  code="APPT_STATUS"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'regStatus'">
                <span v-if="scope.row[item.prop] == 0">未收费</span>
                <span v-else-if="scope.row[item.prop] == 1">收费</span>
                <span v-else-if="scope.row[item.prop] == 2">退费</span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="挂号列表"
      :visible.sync="appointmentListDia"
      @close="closeAppointmentListDialog"
      width="1450px"
    >
      <div class="appointmentList">
        <div class="appointmentList-navbar margin-bottom-10 clearfix">
          <span
            class="appointmentList-item"
            style="width: 300px; margin-right: 8px"
          >
            <l-formt-title label="就诊日期">
              <el-date-picker
                clearable
                v-model="searchValue3.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </l-formt-title>
          </span>
          <span
            class="appointmentList-item"
            style="width: 140px; margin-right: 8px"
          >
            <l-formt-title label="卡号">
              <el-input
                v-model="searchValue3.cardNum"
                placeholder="卡号"
              ></el-input>
            </l-formt-title>
          </span>
          <span class="appointmentList-item" style="width: 60px">
            <el-button type="primary" @click="readCardAtApptList"
              >读卡</el-button
            >
          </span>
          <span
            class="appointmentList-item"
            style="width: 180px; margin-right: 8px"
          >
            <l-formt-title label="患者姓名">
              <el-input
                v-model="searchValue3.patientName"
                placeholder="患者姓名"
              ></el-input>
            </l-formt-title>
          </span>
          <span
            class="appointmentList-item"
            style="width: 200px; margin-right: 8px"
          >
            <l-formt-title label="患者编号">
              <el-input
                v-model="searchValue3.patientId"
                placeholder="患者编号"
              ></el-input>
            </l-formt-title>
          </span>
          <span
            class="appointmentList-item"
            style="width: 200px; margin-right: 8px"
          >
            <l-formt-title label="身份证号">
              <el-input
                v-model="searchValue3.identificationNum"
                placeholder="身份证号"
              ></el-input>
            </l-formt-title>
          </span>
          <span
            class="appointmentList-item"
            style="width: 200px; margin-right: 8px"
          >
            <l-formt-title label="联系方式">
              <el-input
                v-model="searchValue3.phoneNum"
                placeholder="联系方式"
              ></el-input>
            </l-formt-title>
          </span>
          <span
            class="appointmentList-item"
            style="width: 60px; margin-right: 0"
          >
            <el-button type="primary" class="float-right" @click="search3"
              >查询</el-button
            >
          </span>
        </div>
        <l-card-title>
          <template slot="left">预约列表</template>
          <template slot="right">
            <el-button
              type="primary"
              plain
              class="plain-btn"
              @click="appointCancelClick"
              :disabled="
                !(
                  ((multiCurrentRow.regStatus == '0' ||
                    multiCurrentRow.regStatus == '1') &&
                    (multiCurrentRow.recordStatus == 1 ||
                      multiCurrentRow.recordStatus == 2 ||
                      multiCurrentRow.recordStatus == 3 ||
                      multiCurrentRow.recordStatus == 4 ||
                      multiCurrentRow.recordStatus == 5 ||
                      multiCurrentRow.recordStatus == 6)) ||
                  (multiCurrentRow.regStatus == '1' &&
                    multiCurrentRow.recordStatus == 9)
                )
              "
              >退号</el-button
            >
            <el-button
              type="primary"
              plain
              class="plain-btn"
              @click="payClick"
              :disabled="
                !(
                  multiCurrentRow.regStatus == '0' &&
                  (multiCurrentRow.recordStatus == 1 ||
                    multiCurrentRow.recordStatus == 2 ||
                    multiCurrentRow.recordStatus == 3 ||
                    multiCurrentRow.recordStatus == 4 ||
                    multiCurrentRow.recordStatus == 5 ||
                    multiCurrentRow.recordStatus == 6 ||
                    multiCurrentRow.recordStatus == 10)
                )
              "
              >缴费</el-button
            >
            <el-button
              type="primary"
              plain
              class="plain-btn"
              @click="appointTriageClick"
              :disabled="
                !(
                  multiCurrentRow.regStatus == '1' &&
                  (multiCurrentRow.recordStatus == 1 ||
                    multiCurrentRow.recordStatus == 6)
                )
              "
              >分诊</el-button
            >
            <el-button
              type="primary"
              class="plain-btn"
              plain
              @click="printClick"
              :disabled="
                !(
                  multiCurrentRow.regStatus == '1' &&
                  (multiCurrentRow.recordStatus == 1 ||
                    multiCurrentRow.recordStatus == 2 ||
                    multiCurrentRow.recordStatus == 3 ||
                    multiCurrentRow.recordStatus == 4 ||
                    multiCurrentRow.recordStatus == 5 ||
                    multiCurrentRow.recordStatus == 6 ||
                    multiCurrentRow.recordStatus == 10)
                )
              "
              >挂号单打印</el-button
            >
          </template>
        </l-card-title>
        <div class="table-cont">
          <el-table
            ref="registeredTable"
            :data="registeredData"
            width="100%"
            height="100%"
            border
            stripe
            highlight-current-row
            @row-click="rowClick3"
            v-loading="loading3"
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
                      id: scope.row[item.prop],
                    }"
                    columns="org_nm"
                    v-tableTransform
                  ></span>
                </template>
                <template v-else-if="item.prop == 'regStatus'">
                  <span v-if="scope.row[item.prop] == '0'">未收费</span>
                  <span v-if="scope.row[item.prop] == '1'">已收费</span>
                  <span v-if="scope.row[item.prop] == '2'">已退费</span>
                </template>
                <template v-else-if="item.prop == 'recordStatus'">
                  <span
                    :val="scope.row[item.prop]"
                    code="APPT_STATUS"
                    v-codeTransform
                  ></span>
                </template>
                <template v-else-if="item.prop == 'regMoney'">
                  <span>{{
                    (scope.row[item.prop] && scope.row[item.prop].toFixed(2)) ||
                    "0.00"
                  }}</span>
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
          <div class="paper">
            <el-pagination
              background
              @size-change="handleChangeSize"
              @current-change="handleCurrentChange"
              :current-page="pageParams.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageParams.total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="退费结算" :visible.sync="returnVis">
      <ReturnPreDialog
        v-if="returnVis"
        :refundApplyData="multiCurrentRow.tradeId"
        @close="returnClose"
      />
    </el-dialog>
    <el-dialog
      title="收费"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="700px"
      @close="closeDialog"
    >
      <l-charge
        :charge="newLchrage"
        :isApptointment="true"
        @close="close"
      ></l-charge>
    </el-dialog>
    <el-dialog
      :title="isReplace ? '信息替换' : '预约挂号'"
      :visible.sync="registerVisible"
      width="800px"
      @close="resetPatientList"
    >
      <div class="register-dialog" v-if="registerVisible">
        <div class="register-dialog-first">
          <el-row :gutter="10" class="margin-bottom-10" v-if="!isReplace">
            <el-col :span="6">
              <el-radio
                v-model="registerRadio"
                label="1"
                @change="registerRadioChane"
                >有档案预约</el-radio
              >
            </el-col>
          </el-row>
          <el-row :gutter="10" class="margin-bottom-10">
            <el-col :span="8">
              <l-formt-title label="姓名" :disabled="registerRadio === '2'">
                <el-input
                  v-model="registerValueOne.patientName"
                  placeholder="姓名"
                  :disabled="registerRadio === '2'"
                ></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="8">
              <l-formt-title label="患者编号" :disabled="registerRadio === '2'">
                <el-input
                  v-model="registerValueOne.patientCode"
                  placeholder="患者编号"
                  :disabled="registerRadio === '2'"
                ></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="8">
              <l-formt-title label="联系方式" :disabled="registerRadio === '2'">
                <el-input
                  v-model="registerValueOne.phoneNum"
                  placeholder="联系方式"
                  :disabled="registerRadio === '2'"
                ></el-input>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="margin-bottom-10">
            <el-col :span="8">
              <l-formt-title label="身份证号" :disabled="registerRadio === '2'">
                <el-input
                  v-model="registerValueOne.identificationNum"
                  placeholder="身份证号"
                  :disabled="registerRadio === '2'"
                ></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="8">
              <l-formt-title label="卡号" :disabled="registerRadio === '2'">
                <el-input
                  v-model="registerValueOne.cardNum"
                  placeholder="卡号"
                  :disabled="registerRadio === '2'"
                ></el-input>
              </l-formt-title>
            </el-col>
            <el-col :span="8">
              <div class="float-right">
                <el-button
                  type="primary"
                  @click="readcard2"
                  :disabled="registerRadio === '2'"
                  >读卡</el-button
                >
                <el-button
                  type="primary"
                  @click="registerSearch"
                  :disabled="registerRadio === '2'"
                  >查询</el-button
                >
              </div>
            </el-col>
          </el-row>
          <el-row class="margin-bottom-10">
            <l-table
              :paginationSmall="true"
              :total="pagination.total"
              :pageSize.sync="pagination.pageSize"
              :page.sync="pagination.currentPage"
              layout="pager"
              :pagerCount="5"
              paginationAlign="center"
              :singlePageShow="true"
              @changeSize="changeSize"
            >
              <el-table
                :data="patientList"
                ref="registerTable"
                border
                highlight-current-row
                height="200px"
                @row-click="registerRowClick"
                v-loading="registerLoading"
              >
                <el-table-column
                  v-for="(item, index) in registerColoms"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :align="item.align || 'left'"
                  :header-align="item.headerAlign || 'left'"
                  :fixed="item.fixed"
                  :show-overflow-tooltip="item.isShowOverflow"
                >
                  <template slot-scope="scope">
                    <template v-if="item.prop === 'patientGender'">
                      <span
                        v-codeTransform
                        :val="scope.row[item.prop]"
                        code="GENDER_CODE"
                      ></span>
                    </template>
                    <template v-else>{{ scope.row[item.prop] }}</template>
                  </template>
                </el-table-column>
              </el-table>
            </l-table>
          </el-row>
        </div>
        <div class="register-dialog-second" v-if="!isReplace">
          <el-form
            ref="registerValueTwo"
            :model="registerValueTwo"
            :rules="rules"
          >
            <el-row :gutter="10" class="margin-bottom-10">
              <el-col :span="6">
                <el-radio
                  v-model="registerRadio"
                  label="2"
                  @change="registerRadioChane"
                  >无档案预约</el-radio
                >
              </el-col>
            </el-row>
            <el-row :gutter="10" class="margin-bottom-10">
              <el-col :span="8">
                <l-formt-title
                  label="姓名"
                  required
                  :disabled="registerRadio === '1'"
                >
                  <el-form-item
                    prop="patientName"
                    :disabled="registerRadio === '1'"
                  >
                    <el-input
                      v-model="registerValueTwo.patientName"
                      placeholder="姓名"
                      :disabled="registerRadio === '1'"
                    ></el-input>
                  </el-form-item>
                </l-formt-title>
              </el-col>
              <el-col :span="8">
                <l-formt-title label="性别" :disabled="registerRadio === '1'">
                  <l-value-domain
                    code="GENDER_CODE"
                    :value.sync="registerValueTwo.patientGender"
                    placeholder="请选择性别"
                    :disabled="registerRadio === '1'"
                  ></l-value-domain>
                </l-formt-title>
              </el-col>
              <el-col :span="8">
                <l-formt-title
                  label="出生日期"
                  :disabled="registerRadio === '1'"
                >
                  <el-date-picker
                    v-model="registerValueTwo.birthDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="expireTimeOption"
                    :disabled="registerRadio === '1'"
                  ></el-date-picker>
                </l-formt-title>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="margin-bottom-10">
              <el-col :span="12">
                <l-formt-title
                  label="身份证号"
                  required
                  :disabled="registerRadio === '1'"
                >
                  <el-form-item prop="identificationNum">
                    <el-input
                      v-model="registerValueTwo.identificationNum"
                      placeholder="身份证号"
                      :disabled="registerRadio === '1'"
                    ></el-input>
                  </el-form-item>
                </l-formt-title>
              </el-col>
              <el-col :span="12">
                <l-formt-title
                  label="联系方式"
                  required
                  :disabled="registerRadio === '1'"
                >
                  <el-form-item prop="phoneNum">
                    <el-input
                      v-model="registerValueTwo.phoneNum"
                      placeholder="联系方式"
                      :disabled="registerRadio === '1'"
                    ></el-input>
                  </el-form-item>
                </l-formt-title>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="button-footer clearfix" v-if="!isReplace">
        <el-button
          type="primary"
          class="float-right"
          plain
          @click="registerCancel"
          >取消</el-button
        >
        <el-button
          type="primary"
          class="float-right"
          @click="registerConfirm"
          style="margin-right: 10px"
          >确定</el-button
        >
      </div>
      <div class="button-footer clearfix" v-if="isReplace">
        <el-button
          type="primary"
          class="float-right"
          plain
          @click="replaceCancel"
          >取消</el-button
        >
        <el-button
          type="primary"
          class="float-right"
          @click="replaceConfirm"
          style="margin-right: 10px"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import service1 from "@/api/systemManagement/receipt/receipt";
import outpatientAppointment from "@/api/appointmentNew/outpatientAppointment.js";
import appointmentOrder from "@/api/appointmentNew/appointmentOrder.js";
import ReturnPreDialog from "@/views/cis/settleAccount/returnCharge/components/returnPreDialog.vue";
import service from "@/api/appointment/appointment";
import { onPreview } from "@/utils/print";
import { transformCode, getTableData } from "@/api/directive/directiveRequest";
import { getArchListNew, getArchInfoByCardNum, swipe } from "@/api/arch/arch";
import { get, post, put, del } from "@/utils/request";

export default {
  name: "appointmentOrder",
  components: {
    ReturnPreDialog
  },
  data() {
    var validatePhoneNum = (rule, value, callback) => {
      let rules = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (rules.test(value) === false) {
        callback(new Error("手机号非法"));
      } else {
        callback();
      }
    };

    var validateIdNum = (rule, value, callback) => {
      let rules = /\d{17}[\d|x]|\d{15}/;
      if (value === "") {
        callback(new Error("请输入身份证号"));
      } else if (rules.test(value) === false) {
        callback(new Error("身份证号非法"));
      } else {
        callback();
      }
    };

    return {
      searchValue: {
        date: [
          new Date().format("yyyy-MM-dd"),
          new Date().format("yyyy-MM-dd")
        ],
        doctorId: "",
        deptId: "",
        apptDept: ""
      },
      loading1: false,
      treeData: [],
      scheduleData: [],
      columns: [
        {
          prop: "recordStatus",
          label: "状态",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "scheduleType",
          label: "类型",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "apptDeptName",
          label: "门诊部门",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "ouptDeptName",
          label: "专科",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "roomName",
          label: "诊室",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "doctorName",
          label: "医生姓名",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "diagTreatTypeName",
          label: "诊疗类型",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        // {
        //   prop: "className",
        //   label: "班次",
        //   width: "80",
        //   align: "left",
        //   headerAlign: "center",
        //   fixed: false
        // },
        {
          prop: "dutyStartDate",
          label: "日期",
          width: "120",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "dutyStartTime",
          label: "开始时间",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "dutyStopTime",
          label: "结束时间",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "week",
          label: "星期",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "allNum",
          label: "号源数",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "appendNum",
          label: "加号数",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "allUseNum",
          label: "剩余号源",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        }
      ],
      singleCurrentRow: {},
      options: [],
      selLoading: false,
      searchValue2: {
        checked1: false,
        checked2: false
      },
      loading2: false,
      multiData: [],
      multiParams: [
        {
          prop: "appointmentTime",
          label: "时间",
          width: "90",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "recordStatus",
          label: "状态",
          width: "60",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "patientName",
          label: "患者姓名",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "regStatus",
          label: "缴费状态",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "phoneNum",
          label: "联系方式",
          width: "90",
          align: "left",
          headerAlign: "center",
          fixed: false
        },
        {
          prop: "note",
          label: "备注",
          width: "80",
          align: "left",
          headerAlign: "center",
          fixed: false
        }
      ],
      multiCurrentRow: {},
      appointmentListDia: false,
      searchValue3: {
        date: [new Date().format("yyyy-MM-dd"), new Date().format("yyyy-MM-dd")]
      },
      loading3: false,
      registeredData: [],
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
      registeredCurrentRow: {},
      //退费结算
      returnVis: false,
      newLchrage: {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      },
      dialogVisible: false,
      regStatusOptions: {
        "0": "未收费",
        "1": "已收费",
        "2": "已退费"
      },
      codeTransformObj: {},
      registerVisible: false,
      registerRadio: "1",
      registerValueOne: {
        patientName: "",
        patientCode: "",
        phoneNum: "",
        identificationNum: "",
        cardNum: ""
      },
      registerValueTwo: {
        patientName: "",
        patientGender: "0",
        birthDate: "",
        phoneNum: "",
        identificationNum: ""
      },
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() > Date.now();
        }
      },
      patientList: [],
      registerCurrentRow: {},
      registerColoms: [
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "80",
          isShowOverflow: true
        },
        {
          prop: "patientGender",
          label: "性别",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "80",
          isShowOverflow: true
        },
        {
          prop: "birthDate",
          label: "出生日期",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "120",
          isShowOverflow: true
        },
        {
          prop: "identificationNum",
          label: "身份证号",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "150",
          isShowOverflow: true
        },
        {
          prop: "mobileNum",
          label: "联系方式",
          align: "left",
          headerAlign: "center",
          fixed: false,
          width: "150",
          isShowOverflow: true
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 1
      },
      registerLoading: false,
      rules: {
        patientName: [
          { required: true, message: "请输入患者姓名", trigger: "blur" }
        ],
        phoneNum: [
          { required: true, message: "请输入患者联系方式", trigger: "blur" },
          { validator: validatePhoneNum, trigger: "blur" }
        ],
        identificationNum: [
          { required: true, message: "请输入患者身份证号", trigger: "blur" },
          { validator: validateIdNum, trigger: "blur" }
        ]
      },
      isReplace: false,
      //分页信息
      pageParams: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      layout: "total,sizes,prev, pager, next, jumper",
      apptDeptOptions: [],
      deptIdOptions: []
    };
  },
  created() {
    this.getApptDept();
    this.getDeptId();
  },
  mounted() {
    this.search();
  },
  methods: {
    //获取门诊部们
    async getApptDept() {
      this.apptDeptOptions = [];
      let res = await get(
        "/appointment/dictValue/getDictValueList?dictItemCode=A0003&recordStatus=1"
      );
      console.log(res);
      this.apptDeptOptions = res.data.concat([
        {
          dictName: "全部",
          dictCode: ""
        }
      ]);
    },
    //获取专科
    async getDeptId() {
      this.deptIdOptions = [];
      let res = await get("/wadmin/hos/dept");
      if (res.code === 1) {
        this.deptIdOptions = res.data.concat([
          {
            orgNm: "全部",
            id: ""
          }
        ]);
      }
    },
    //合并单元格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.level === "1") {
        if (columnIndex == 0) {
          return [1, 14];
        } else {
          return [0, 0];
        }
      }
    },
    //查询门诊部门与门诊部门排班数据
    async search() {
      this.treeData = [];
      this.singleCurrentRow = {};
      this.multiData = [];
      this.multiCurrentRow = {};
      await this.getDeptAndNum();
    },
    reset() {
      this.searchValue = {
        date: [
          new Date().format("yyyy-MM-dd"),
          new Date().format("yyyy-MM-dd")
        ],
        doctorId: "",
        deptId: "",
        apptDept: ""
      };
    },
    async getDeptAndNum() {
      try {
        let startDate =
          this.searchValue.date && this.searchValue.date.length
            ? this.searchValue.date[0] + " 00:00:00"
            : "";
        let stopDate =
          this.searchValue.date && this.searchValue.date.length
            ? this.searchValue.date[1] + " 23:59:59"
            : "";
        let params = {
          startDate: startDate,
          stopDate: stopDate,
          deptId: this.searchValue.deptId,
          apptDept: this.searchValue.apptDept,
          doctorId: this.searchValue.doctorId
        };
        this.loading1 = true;
        let res = await appointmentOrder.getDeptAndNum(params);
        if (res.code == 1) {
          if (res.data.length) {
            let treeData = [];
            for (let i in res.data) {
              let apptAndScheduleVOS = res.data[i].apptAndScheduleVOS || [];
              let clist = apptAndScheduleVOS.sort((pre, next) => {
                if (!pre.dutyStartTime || !next.dutyStartTime) {
                  return;
                }
                var preDate = new Date(pre.dutyStartTime);
                var nextDate = new Date(next.dutyStartTime);
                return pre.dutyStartTime > next.dutyStartTime ? 1 : -1;
              });
              console.log(clist, "clist返回数据");
              let obj = {
                ...res.data[i],
                apptAndScheduleVOS: clist,
                recordStatus: res.data[i]["apptDeptName"],
                scheduleId: res.data[i]["apptDeptCode"],
                level: "1"
              };
              treeData.push(obj);
            }
            this.treeData = treeData;
          } else {
            this.$message("未查询到门诊部门号源信息");
          }
          this.loading1 = false;
        }
      } catch (error) {
        this.loading1 = false;
        this.$message.error(error.msg);
      }
    },
    // 查询用户
    async selectAllUser(val) {
      try {
        this.selLoading = true;
        let res = await service1.getAllUser({
          userName: val || ""
        });
        this.options = res.data;
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    setUseUserInfo(row) {
      this.searchValue.doctorName = "";
      this.searchValue.doctorId = "";
      if (row) {
        this.options.forEach(val => {
          if (val.id == row) {
            this.searchValue.doctorName = val.name;
            this.searchValue.doctorId = val.id;
          }
        });
      }
    },
    rowClick1(row) {
      if (row.level === undefined) {
        this.singleCurrentRow = row;
        this.$refs.treeTable.setCurrentRow(row);
        this.search2();
      } else if (row.level === "1") {
        this.$refs.treeTable.setCurrentRow(this.singleCurrentRow);
      }
    },
    //请求预约列表
    search2() {
      this.getApptByScheduleId();
    },
    async getApptByScheduleId() {
      if (!this.singleCurrentRow.scheduleId) {
        return;
      }
      this.multiData = [];
      this.multiCurrentRow = {};
      try {
        this.loading2 = true;
        let res = await outpatientAppointment.getApptByScheduleId({
          scheduleSerialId: this.singleCurrentRow.scheduleId
        });
        if (res.code === 1) {
          this.multiData = res.data;
        } else {
          this.$message.error(res.msg);
        }
        this.loading2 = false;
      } catch (error) {
        this.loading2 = false;
        this.$message.error(error.msg);
      }
    },
    rowClick2(row) {
      this.multiCurrentRow = row;
    },
    // 1.退号
    async appointCancelClick() {
      let dataInfo = this.multiCurrentRow;
      let singleInfo = this.singleCurrentRow;
      this.$confirmFunc({
        titleText: "提示",
        contentText:
          "是否取消" +
          (dataInfo.patientName || "") +
          (dataInfo.appointmentTime || "") +
          (dataInfo.className || "") +
          (dataInfo.outpDeptName || "") +
          (dataInfo.doctorName || "") +
          (dataInfo.diagTreatTypeName || "") +
          "的挂号信息",
        confirmLoadingText: "退号中...",
        confirm: async (action, instance, done) => {
          if (this.multiCurrentRow.regStatus == "0") {
            //未收费
            try {
              this.$showLoading();
              let res = await outpatientAppointment.appointCancel({
                appointmentId: this.multiCurrentRow.appointmentId,
                channel: 1
              });
              this.$hideLoading();
              this.search2();
              this.search3();
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg);
            }
          } else if (this.multiCurrentRow.regStatus == "1") {
            this.returnVis = true;
          }
          done();
        }
      });
    },
    returnClose(val) {
      if (val && val.refresh) {
        this.search2();
        this.search3();
      }
      this.returnVis = false;
    },
    // 2.缴费
    async payClick() {
      if (!this.multiCurrentRow.appointmentId) {
        this.$message.error("请选择一条预约记录");
        return;
      }
      //当前选中的预约数据
      this.newLchrage.appointment = this.multiCurrentRow;
      //获取收费明细
      let ChargeRegDetail = this.getChargeRegDetail();
      // 待收费对象转换
      this.changeObj(ChargeRegDetail);
      this.dialogVisible = true;
    },
    async getChargeRegDetail() {
      let { data } = await service.getChargeRegDetail({
        birthDate: "",
        regDiagTreatType: this.multiCurrentRow.diagTreatType,
        regWorkCode: this.multiCurrentRow.workCode
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
          visitId: this.multiCurrentRow.appointmentId,
          ouptDeptId: this.multiCurrentRow.ouptDeptId, // 专科id
          groupId: item.groupNo, // 组号
          groupNo: item.groupNo
        };
        chargePrescriptions.push(obj);
      }
      this.newLchrage.chargePrescriptions = chargePrescriptions;
    },
    closeDialog() {
      if (!this.appointmentListDia) {
        this.search2();
      }
    },
    close() {
      this.dialogVisible = false;
      this.newLchrage = {
        appointment: {}, // 预约明细
        chargePrescriptions: [], // 待收费明细，
        accountInfo: {} // 账户数据
      };
      if (!this.appointmentListDia) {
        this.search2();
      }
      this.search3();
    },
    // 3.挂号
    setAppointment() {
      if (this.searchValue2.checked1 && !this.multiCurrentRow.appointmentId) {
        this.$message.error("请先选择一条预约记录");
        return;
      }
      this.registerVisible = true;
    },
    // 4.分诊
    appointTriageClick() {
      if (!this.multiCurrentRow.appointmentId) {
        this.$message.error("请先选择一条数据记录");
        return;
      }
      this.appointTriage(this.multiCurrentRow.appointmentId);
    },
    async appointTriage(appointmentId) {
      try {
        this.$showLoading();
        let res = await outpatientAppointment.appointTriage({
          appointmentId
        });
        this.$hideLoading();
        this.search2();
        this.$message.success(res.msg);
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    // 5.打印
    async printClick() {
      console.log("printClick", this.multiCurrentRow);
      if (!this.multiCurrentRow.visitCode) {
        this.$message("没有记录需要打印！");
        return;
      }
      let outpDeptName = "";
      if (this.multiCurrentRow.outpDeptName) {
        outpDeptName = this.multiCurrentRow.outpDeptName;
      } else {
        outpDeptName = await this.transformTable(
          "org_nm",
          {
            org_type: "_DEPT_",
            id: this.multiCurrentRow.ouptDeptId
          },
          "sys_org"
        );
      }
      let data = {
        visitCode: this.multiCurrentRow.visitCode,
        name: this.multiCurrentRow.patientName,
        departName: outpDeptName,
        floors: this.multiCurrentRow.roomLocation, //就诊地点
        visitTime: this.multiCurrentRow.appointmentTime,
        num: "",
        doctorName: this.multiCurrentRow.doctorName,
        roomNum: this.multiCurrentRow.roomName,
        chargePrice: this.multiCurrentRow.regMoney,
        chargeType: "挂号",
        visitDate: this.multiCurrentRow.updatedAt
      };
      // console.log("打印数据data", data);
      onPreview(data, "挂号凭证");
    },
    //挂号列表
    setAppointmentListDia() {
      this.multiCurrentRow = {};
      this.appointmentListDia = true;
    },
    closeAppointmentListDialog() {
      this.multiCurrentRow = {};
    },
    readCardAtApptList() {
      // 读卡
      this.$message.error("没有外接设备");
    },
    async search3() {
      this.registeredData = [];
      this.registeredCurrentRow = {};
      let startDate =
        this.searchValue3.date && this.searchValue3.date.length
          ? this.searchValue3.date[0] + " 00:00:00"
          : "";
      let stopDate =
        this.searchValue3.date && this.searchValue3.date.length
          ? this.searchValue3.date[1] + " 23:59:59"
          : "";
      let params = {
        ...this.searchValue3,
        startDate: startDate,
        stopDate: stopDate,
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      };
      this.$delete(params, "date");
      this.loading3 = true;
      try {
        let result = await outpatientAppointment.getRegisteredList(params);
        if (result.code === 1) {
          this.registeredData = result.data;
          this.pageParams.total = result.total;
        } else {
          this.$message.error(result.msg || "获取挂号记录失败");
        }
        this.loading3 = false;
      } catch (e) {
        this.loading3 = false;
        this.$message.error(e.msg || "获取挂号记录失败");
      }
      if (this.registeredData && this.registeredData.length) {
        //?
        this.multiCurrentRow = this.registeredData[0];
      }
      this.$refs.registeredTable.setCurrentRow(this.registeredData[0]);
    },
    handleChangeSize(val) {
      this.pageParams.pageSize = val;
      this.search3();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.search3();
    },
    rowClick3(row) {
      this.multiCurrentRow = row;
    },
    //打印
    async printAppointList() {
      let appointmentList = [];
      let data = this.registeredData;
      for (let i in data) {
        let obj = {
          ...data[i],
          regStatus: this.regStatusOptions[data[i]["regStatus"]],
          regMoney:
            data[i]["regMoney"] > 0
              ? Number(data[i]["regMoney"]).toFixed(2)
              : "0.00",
          patientGender: await this.transformCode(
            "name",
            "GENDER_CODE",
            data[i]["patientGender"] || ""
          ),
          recordStatus: await this.transformCode(
            "name",
            "APPT_STATUS",
            data[i]["recordStatus"] || ""
          )
        };
        appointmentList.push(obj);
      }
      let printData = {
        appointmentList: appointmentList
      };
      onPreview(printData, "预约列表");
    },
    //主数据反显
    async transformCode(field, code, val) {
      let params = [{ field, code, val }];
      if (this.codeTransformObj[`${code}+${val}`]) {
        // el.innerText = this.codeTransformObj[`${code}+${val}`];
        return this.codeTransformObj[`${code}+${val}`];
      } else {
        try {
          let resData = await transformCode(params);
          if (resData.code === 1) {
            this.codeTransformObj[`${code}${val}`] = resData.data[code];
            return Promise.resolve(resData.data[code]);
          } else {
            return "--";
          }
        } catch (err) {
          return "--";
        }
      }
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
    },
    getWeek(dateString) {
      var dateArray = dateString.split("-");
      let date = new Date(
        dateArray[0],
        parseInt(dateArray[1] - 1),
        dateArray[2]
      );
      return "周" + "日一二三四五六".charAt(date.getDay());
    },
    //预约弹框
    resetPatientList() {
      this.registerRadio = "1";
      this.patientList = [];
      this.registerCurrentRow = {};
      this.pagination.currentPage = 1;
      this.pagination.total = 0;
      this.registerValueOne = {
        patientName: "",
        patientCode: "",
        phoneNum: "",
        identificationNum: "",
        cardNum: ""
      };
      this.registerValueTwo = {
        patientName: "",
        patientGender: "0",
        birthDate: "",
        phoneNum: "",
        identificationNum: ""
      };
      this.isReplace = false;
    },
    async readcard2() {
      if (!this.registerValueOne.cardNum) {
        this.$message.error("未获得卡号");
        return;
      }
      this.patientList = [];
      this.registerCurrentRow = {};
      this.pagination.currentPage = 1;
      this.pagination.total = 0;
      this.registerLoading = true;
      let params = { cardNum: this.registerValueOne.cardNum };
      try {
        let res = await swipe(params);
        if (res.code == 1) {
          if (res.data.patientId) {
            this.patientList = [{ ...res.data }];
            this.$refs.registerTable.setCurrentRow(this.patientList[0]);
            this.registerCurrentRow = this.patientList[0];
            this.pagination.currentPage = 1;
            this.pagination.total = 1;
          }
        }
        this.registerLoading = false;
      } catch (e) {
        this.registerLoading = false;
      }
    },
    async registerSearch() {
      this.patientList = [];
      this.registerCurrentRow = {};
      this.registerLoading = true;
      try {
        let params = {
          pageNo: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          cardData: this.registerValueOne.cardNum, //卡号
          patientName: this.registerValueOne.patientName, //患者姓名
          mobile: this.registerValueOne.phoneNum, //手机号
          patientCode: this.registerValueOne.patientCode, //患者编号
          identificationNum: this.registerValueOne.identificationNum //身份证号
        };
        let res = await appointmentOrder.patientListByExample(params);
        if (res.code == 1) {
          this.patientList = res.data;
          this.$refs.registerTable.setCurrentRow(this.patientList[0]);
          this.registerCurrentRow = this.patientList[0];
          this.pagination.currentPage = res.pageNo;
          this.pagination.pageSize = res.pageSize;
          this.pagination.total = res.total;
        }
        this.registerLoading = false;
      } catch (e) {
        this.registerLoading = false;
      }
    },
    registerRowClick(row) {
      this.registerCurrentRow = row;
    },
    changeSize(val) {
      this.pagination.currentPage = val.page;
      this.pagination.pageSize = val.pageSize;
      this.registerSearch();
    },
    registerConfirm() {
      console.log("this.registerRadio", this.registerRadio);
      if (this.registerRadio == "1") {
        this.registerConfirmOne();
      } else if (this.registerRadio == "2") {
        this.registerConfirmTwo();
      }
    },
    async registerConfirmOne() {
      try {
        this.$showLoading();
        let res = await outpatientAppointment.createAppt({
          scheduleId: this.singleCurrentRow.scheduleId, //排班ID
          appointmentId: this.searchValue2.checked1
            ? this.multiCurrentRow.appointmentId
            : "", //预约ID
          patientId: this.registerCurrentRow.patientId, //患者ID
          channel: 1, //预约渠道
          appointType: "", //预约类型0：预约 1：挂号  (此页面可预约可挂号不区分)
          isAutoAppendNum: false //是否自动加号(true;false布尔类型)
        });
        if (res.code == 1) {
          this.$message.success("挂号成功");
          this.registerVisible = false;
          await this.getApptByScheduleId();
          let multiData = this.multiData;
          for (let i in multiData) {
            if (multiData[i]["appointmentId"] == res.data["appointmentId"]) {
              this.multiCurrentRow = multiData[i];
              await this.$refs.multiTable.setCurrentRow(multiData[i]);
              if (!this.searchValue2.checked2) {
                await this.printClick();
              }
            }
          }
        } else {
          this.$message.success(res.msg || "挂号失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    async registerConfirmTwo() {
      if (!this.registerValueTwo.patientName) {
        this.$message("请填写患者姓名！");
        return;
      }
      if (!this.registerValueTwo.identificationNum) {
        this.$message("请填写身份证号！");
        return;
      }
      if (!this.registerValueTwo.phoneNum) {
        this.$message("请填写联系方式！");
        return;
      }
      console.log("registerConfirmTwo", this.registerRadio);
      this.$refs.registerValueTwo.validate(async valid => {
        console.log("valid", valid);
        // if (valid) {
        try {
          this.$showLoading();
          let params = {
            scheduleId: this.singleCurrentRow.scheduleId, //排班ID
            appointmentId: this.searchValue2.checked1
              ? this.multiCurrentRow.appointmentId
              : "", //预约ID
            channel: 1, //预约渠道
            appointType: 1, //预约类型0：预约1：挂号
            isAutoAppendNum: false, //是否自动加号(true;false布尔类型)
            patientName: this.registerValueTwo.patientName,
            patientGender: this.registerValueTwo.patientGender,
            birthDate: this.registerValueTwo.birthDate,
            identificationNum: this.registerValueTwo.identificationNum,
            phoneNum: this.registerValueTwo.phoneNum,
            identificationType: "",
            patientAddr: ""
          };
          console.log("params", params);
          let res = await appointmentOrder.appointConfirm(params);
          if (res.code == 1) {
            this.$message.success("挂号成功");
            this.registerVisible = false;
            await this.getApptByScheduleId();
            let multiData = this.multiData;
            for (let i in multiData) {
              if (multiData[i]["appointmentId"] == res.data["appointmentId"]) {
                this.multiCurrentRow = multiData[i];
                await this.$refs.multiTable.setCurrentRow(multiData[i]);
                if (!this.searchValue2.checked2) {
                  await this.printClick();
                }
              }
            }
          } else {
            this.$message.success(res.msg || "挂号失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg);
        }
        // }
      });
    },
    registerCancel() {
      this.registerVisible = false;
    },
    registerRadioChane(val) {
      if (val === "1") {
        this.registerValueOne = {
          patientName: this.registerValueTwo.patientName,
          phoneNum: this.registerValueTwo.phoneNum,
          identificationNum: this.registerValueTwo.identificationNum
        };
        this.registerValueTwo = {
          patientName: "",
          patientGender: "0",
          birthDate: "",
          phoneNum: "",
          identificationNum: ""
        };
        this.$nextTick(() => {
          this.$refs.registerValueTwo.resetFields();
        });
      } else if (val === "2") {
        this.patientList = [];
        this.registerCurrentRow = {};
        this.pagination.currentPage = 1;
        this.pagination.total = 0;
        this.registerValueTwo = {
          patientGender: "0",
          patientName: this.registerValueOne.patientName,
          phoneNum: this.registerValueOne.phoneNum,
          identificationNum: this.registerValueOne.identificationNum
        };
        this.registerValueOne = {};
      }
    },
    //信息更换
    patientInfoReplace() {
      if (
        !this.multiCurrentRow.appointmentId ||
        this.multiCurrentRow.patientId
      ) {
        this.$message.error("请先选择一条无档预约记录");
        return;
      }
      this.registerVisible = true;
      this.isReplace = true;
    },
    replaceCancel() {
      this.registerVisible = false;
      this.isReplace = false;
    },
    async replaceConfirm() {
      if (!this.registerCurrentRow.patientId) {
        this.$message.error("请先选择一位有档患者进行信息更换");
        return;
      }
      try {
        this.$showLoading();
        let params = {
          appointmentId: this.multiCurrentRow.appointmentId,
          patientId: this.registerCurrentRow.patientId
        };
        let res = await appointmentOrder.updateApptNoArch(params);
        if (res.code == 1) {
          this.$message.success("信息更换成功");
          this.registerVisible = false;
          this.isReplace = false;
          await this.search2();
        } else {
          this.$message.error(res.msg);
        }
        this.$hideLoading();
      } catch (e) {
        this.$hideLoading();
        this.$message.error(e.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.cGray {
  color: #ccc;
}
.appointmentOrder {
  .appoint-left {
    width: calc(100% - 650px);
    padding: 10px;
    .table-cont {
      height: calc(100% - 48px);
    }
  }
  .appoint-right {
    width: 650px;
    padding: 10px;
    border-left: 1px solid $l-color-bgcolor-11;
    .table-cont {
      height: calc(100% - 76px);
    }
  }
  .appointmentList {
    padding: 10px;
    height: 660px;
    .appointmentList-navbar {
      .appointmentList-item {
        display: block;
        float: left;
        margin-right: 10px;
      }
    }
    .table-cont {
      height: calc(100% - 157px);
      .paper {
        text-align: right;
        margin-top: 20px;
        .el-pagination {
          padding: 0;
          /deep/ .el-pagination__editor.el-input .el-input__inner {
            height: 100% !important;
          }
        }
      }
    }
  }

  .margin-bottom-10 {
    margin-bottom: 10px;
  }
  .register-dialog {
    padding: 10px;
    .register-dialog-first {
      margin-bottom: 10px;
    }
    .register-dialog-second {
      padding-top: 10px;
      border-top: 1px solid $l-color-bgcolor-11;
    }
  }
  .button-footer {
    padding: 10px;
    border-top: 1px solid $l-color-bgcolor-11;
  }
  .nameColor {
    color: $l-color-fontcolor-1;
  }
  .plain-btn {
    min-width: 66px;
  }
  /deep/ .left {
    width: calc(100% - 250px) !important;
  }
}
</style>
