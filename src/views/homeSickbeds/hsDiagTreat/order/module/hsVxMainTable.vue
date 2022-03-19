<template>
  <div class="rightMedicalOrder overflow-hidden height100">
    <div class="overflow-hidden rightMedicalOrderInner height100">
      <div class="filter-box">
        <div
          ref="btnGroup"
          class="edit-btn-box height100"
        >
          <el-radio-group
            class="radio-group minWidth180"
            v-model="searchForm.type"
            @change="radioChange"
          >
            <el-radio label="1">长期医嘱</el-radio>
            <el-radio label="2">临时医嘱</el-radio>
          </el-radio-group>
          <b class="line"></b>
          <!-- 新增 -->
          <span
            class="cursor-pointer"
            @click="addRow"
            v-hotKey="{ func: 'func_add1' }"
          >
            <i class="iconfont iconxinzeng"></i>
            {{ $t("cis.btn.add") }} (alt+c)
          </span>
          <!-- 暂存 -->
          <span
            class="cursor-pointer"
            @click="temporarySaveAll"
            v-hotKey="{ func: 'func_add2' }"
          >
            <i class="iconfont iconzancun"></i>
            全部{{$t('cis.btn.shortSave')}}
          </span>
          <!-- 提交 -->
          <span
            class="cursor-pointer"
            @click="submitSave"
            v-hotKey="{ func: 'func_submit' }"
          >
            <i class="iconfont icontijiao1"></i>
            {{ $t("cis.btn.submit") }}(alt+s)
          </span>
          <span
            @click="saveTemp"
            class="cursor-pointer"
            type="text"
            v-hotKey="{ func: 'func_save_temp' }"
          >
            <i class="iconfont iconfuzhidaochangqi"></i>
            保存模板
          </span>
          <!-- 删除 -->
          <span
            class="cursor-pointer lastSpan"
            @click="deleteHandler"
            v-hotKey="{ func: 'func_delete' }"
          >
            <i class="iconfont iconshanchu"></i>
            {{ $t("cis.btn.del") }}
          </span>
          <b class="line"></b>
          <span
            class="cursor-pointer"
            @click="bunchingHandler"
            v-hotKey="{ func: 'func_grouping' }"
          >
            <i class="iconfont iconchengzu"></i>
            成组
          </span>
          <span
            class="cursor-pointer lastSpan minWidth80"
            @click="cancelBunching"
            v-hotKey="{ func: 'cancel_grouping' }"
          >
            <i class="iconfont iconquxiaochengzu"></i>
            取消成组
          </span>
          <b class="line"></b>
          <!-- <el-button
            class="filter-item btn-text"
            type="text"
            icon="iconfont icondayin"
          >检查检验字典</el-button> -->
          <!-- <el-button
            class="filter-item btn-text"
            type="text"
            icon="iconfont icondayin"
          >复制医嘱</el-button> -->
          <!-- <el-button
            class="filter-item btn-text"
            type="text"
            icon="iconfont icondayin"
          >存为模版</el-button>
          <el-button
            class="filter-item btn-text"
            type="text"
            icon="iconfont icondayin"
          >测试弹窗</el-button>
          <el-button
            class="filter-item btn-text"
            @click="getData"
            type="text"
            icon="iconfont icondayin"
          >获取实时数据</el-button> -->
          <LFormtTitle
            label="药房"
            style="width: 240px"
            class="input-item"
            :disabled="searchForm.pharmacyDisabled"
          >
            <!-- <l-value-domain
              clearable
              defaultFirst
              remoteUrl="/hmm-stock/pharmacy/forPage"
              :value.sync="searchForm.pharmacyId"
              remoteShowKey="pharName"
              remoteValueKey="deptId"
              :remoteParams="{ 'pageSize': 20, 'pageNo': 1 }"
              placeholder="请选择药房"
              :pharmacyId="searchForm.pharmacyId"
            ></l-value-domain> -->
            <el-select
              v-model="selectDeptId"
              @change="changePharmacy"
              placeholder="请选择药房"
            >
              <el-option
                v-for="(item, index) in westPharmacyObject.list"
                :key="index"
                :label="item.pharName"
                :value="item.deptId"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
        </div>
      </div>
      <div class="table-box">
        <vxe-grid
          border
          resizable
          highlight-hover-row
          show-overflow
          ref="xTable"
          :data="tableData"
          :loading="mainTableLoading"
          :highlight-cell="true"
          :edit-config="editConfig"
          height="auto"
          @edit-actived="activeMethod"
          @checkbox-config="checkBoxConfig"
          :edit-rules="validRules"
        >
          <vxe-table-column
            type="checkbox"
            width="32"
            align="center"
            fixed="left"
          ></vxe-table-column>
          <!-- <vxe-table-column
            type="seq"
            align="center"
            width="55"
            fixed="left"
          >
            <template v-slot:header>
              <span>序号</span>
            </template>
          </vxe-table-column> -->
          <vxe-table-column
            v-for="(item, index) in vxtablelumn"
            :key="index"
            :type="item.type"
            :field="item.prop"
            :title="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'center'"
            :fixed="item.fixed"
            show-overflow
            :edit-render="{}"
          >
            <template v-slot="scope">
              <!-- 状态不可编辑状态 -->
              <template v-if="item.prop === 'status'">
                <span
                  :align="item.align"
                  :val="scope.row.status"
                  code="adviceStatus"
                  v-codeTransform
                ></span>
              </template>
              <!-- 医嘱类型不可编辑状态 -->
              <template v-else-if="item.prop === 'type'">
                <span :align="item.align">{{ scope.row.type | filterProperty }}</span>
              </template>
              <!-- 计量单位不可编辑状态 -->
              <template v-else-if="item.prop === 'dosageUnit'">
                <span
                  :val="scope.row.dosageUnit"
                  code="DrugDoseUnit"
                  v-codeTransform
                  :align="item.align"
                ></span>
              </template>
              <!-- 用法 -->
              <template v-else-if="item.prop === 'useWay'">
                <span
                  :align="item.align"
                  :val="scope.row.useWay"
                  code="MedicationRouteCode"
                  v-codeTransform
                ></span>
              </template>
              <!-- 接收科是 -->
              <template v-else-if="item.prop === 'deptId'">
                <span
                  tableName="sys_org"
                  :conditionMap="{
                    org_type: '_DEPT_',
                    id: scope.row.deptId
                }"
                  :align="item.align"
                  columns="org_nm"
                  v-tableTransform
                ></span>
              </template>
              <!-- 开著科室 -->
              <template v-else-if="item.prop === 'execDept'">
                <!-- <span
                  :align="item.align"
                  tableName="sys_org"
                  :conditionMap="{
                      org_type: '_DEPT_',
                      id: scope.row.exeDeptName
                    }"
                  columns="org_nm"
                  v-tableTransform
                >--</span> -->
                <span>
                  {{ scope.row.exeDeptName || "--" }}
                </span>
              </template>

              <template v-else-if="item.prop === 'limitResultCode'">
                <span v-if="scope.row.limitResultCode ==0">自费使用</span>
                <span v-if="scope.row.limitResultCode ==1">审批通过</span>
              </template>
              <!-- 单位 -->
              <template v-else-if="item.prop === 'unit'">
                <span
                  :val="scope.row.unit"
                  code="DrugUnit"
                  :align="item.align"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'stSolutionType'">
                <span
                  :val="scope.row.stSolutionType"
                  code="SkinTestWay"
                  :align="item.align"
                  v-codeTransform
                ></span>
              </template>
              <!-- 特殊说明 -->
              <template v-else-if="item.prop === 'specialNote'">
                <span
                  :align="item.align"
                  :val="scope.row.specialNote"
                  code="adviceSpecialNote"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'urgent'">
                <el-checkbox
                  true-label='1'
                  false-label='0'
                  @change="((value) => {urgentChang(value, scope.row)})"
                  :disabled="isUrgentDisabled(scope.row)"
                  v-model="scope.row[item.prop]"
                  @keyup.enter.native="scope.row[item.prop] = !scope.row[item.prop]"
                ></el-checkbox>
              </template>
              <template v-else-if="item.prop === 'selfPay'">
                <el-checkbox
                  true-label='1'
                  false-label='0'
                  :disabled="!item.input"
                  v-model="scope.row[item.prop]"
                  @keyup.enter.native="scope.row[item.prop] = !scope.row[item.prop]"
                ></el-checkbox>
              </template>
              <template v-else-if="item.prop === 'selfProvided'">
                <el-checkbox
                  true-label='1'
                  false-label='0'
                  :disabled="!item.input || scope.row.selfProvidedDisabled"
                  v-model="scope.row[item.prop]"
                  @keyup.enter.native="scope.row[item.prop] = !scope.row[item.prop]"
                ></el-checkbox>
              </template>
              <template v-else-if="item.prop === 'free'">
                <el-checkbox
                  true-label='1'
                  false-label='0'
                  :disabled="!item.input"
                  v-model="scope.row[item.prop]"
                  @keyup.enter.native="scope.row[item.prop] = !scope.row[item.prop]"
                ></el-checkbox>
              </template>
              <template v-else-if="item.prop === 'groupNoCls'">
                <span
                  :class="scope.row.groupNoCls"
                  :align="item.align"
                ></span>
              </template>
              <template v-else-if="item.prop === 'price'">
                <div
                  class="ellipsis"
                  :align="item.align"
                >
                  {{ scope.row.price | roundingPrice }}
                </div>
              </template>
              <template v-else-if="item.prop === 'amt'">
                <div
                  class="ellipsis"
                  :align="item.align"
                > {{ scope.row[item.prop] | roundingAmt}} </div>
              </template>
              <template v-else>
                <div
                  class="ellipsis"
                  :align="item.align"
                  :title="scope.row[item.prop]"
                > {{ scope.row[item.prop] || "--" }}
                </div>
              </template>
            </template>

            <!-- 编辑部分列 START  -->
            <template v-slot:edit="scope">
              <template v-if="item.prop === 'status'">
                <span
                  :align="item.align"
                  :val="scope.row.status"
                  code="adviceStatus"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'limitResultCode'">
                <span v-if="scope.row.limitResultCode ==0">自费使用</span>
                <span v-if="scope.row.limitResultCode ==1">审批通过</span>
              </template>
              <template v-else-if="item.prop === 'type'">
                <span :align="item.align">{{ scope.row.type | filterProperty }}</span>
              </template>
              <template v-else-if="item.prop === 'dosageUnit'">
                <span
                  :align="item.align"
                  :val="scope.row.dosageUnit"
                  code="DrugDoseUnit"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'expectStartTime'">
                <el-date-picker
                  :disabled="!item.input"
                  clearable
                  ref="adviceTimePicker"
                  v-model="scope.row.expectStartTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="请输入开始时间"
                  style="width:100%;"
                  @change="adviceTimeChange(scope.row)"
                >
                </el-date-picker>
              </template>
              <template v-else-if="item.prop === 'itemName'">
                <template v-if="scope.row.id">
                  <div
                    class="ellipsis"
                    :title="scope.row.itemName"
                    :align="item.align"
                  >
                    {{ scope.row.itemName }}
                  </div>
                </template>
                <template v-else>
                  <LInputTable
                    ref="lInputTable"
                    v-axShotcut
                    v-selectInner
                    v-focus
                    component="LInputTable"
                    :shotindex="shotcutIndexHandler(scope, 'itemName')"
                    :shotready="shotreadyHandler(scope, 'itemName')"
                    :data-id="'lInputTable' + scope.row.row_id"
                    :popoverWidth="1200"
                    :tableData="selectDrop.selectOptions"
                    @inputTableValChange="((drugName) => {LInputTableClear(drugName, scope.row)})"
                    @query="((keyWord) => {searchLike(keyWord, scope.row)})"
                    @mounted="resetLInputTablePaging"
                    v-model="scope.row.itemName"
                    @select="((drugRow) => {selectWrapper(drugRow, scope.row)})"
                    :tableLoading="searchResLoading"
                    suffix-icon="el-icon-search"
                    :tableParams="selectDrop.dropColumn"
                    :placeholder=" scope.row.itemName || lInputTableDefautText"
                    valueKey="name"
                  />
                </template>
              </template>
              <template v-else-if="item.prop === 'onceDosage'">
                <lInputNumber
                  ref="onceDosage"
                  :disabled="!item.input"
                  component="lInputNumber"
                  v-axShotcut
                  v-focus
                  v-selectInner
                  :shotindex="shotcutIndexHandler(scope, 'onceDosage')"
                  :shotready="shotreadyHandler(scope, 'onceDosage')"
                  :data-id="'onceDosage' + scope.row.row_id"
                  :controls="false"
                  style="width: 100%;"
                  step-strictly
                  :step="0.001"
                  v-model="scope.row.onceDosage"
                  controls-position="right"
                  @input="((value) => {onceDosageHandle(value, scope.row)})"
                  :min='0'
                ></lInputNumber>
              </template>
              <template v-else-if="item.prop === 'relation'">
                <lInputNumber
                  ref="relation"
                  :disabled="!item.input"
                  v-selectInner
                  :data-id="'relation' + scope.row.row_id"
                  :controls="false"
                  style="width: 100%;"
                  step-strictly
                  :step="1"
                  v-model="scope.row.relation"
                  @keyup.enter.native="((value) => {relationHandle(value, scope.row, 'enter')})"
                  @blur="((value) => {relationHandle(value, scope.row, 'blur')})"
                  :min='0'
                ></lInputNumber>
              </template>
              <template v-else-if="item.prop === 'groupNoCls'">
                <span
                  :align="item.align"
                  :class="scope.row.groupNoCls"
                ></span>
              </template>
              <template v-else-if="item.prop === 'useWay'">
                <l-shotcut-input
                  ref="useWay"
                  v-axShotcut
                  :disabled="!item.input"
                  :data-id="'useWay' + scope.row.row_id"
                  component="l-value-domain"
                  :shotindex="shotcutIndexHandler(scope, 'useWay')"
                  :shotready="shotreadyHandler(scope, 'useWay')"
                  code="MedicationRouteCode"
                  remoteShowKey="name"
                  :remoteParams="remoteParams"
                  remoteValueKey="code"
                  :value.sync="scope.row.useWay"
                  placeholder=""
                  @change="((value, item) => {handleUseWay(value, item, scope.row)})"
                />
              </template>
              <template v-else-if="item.prop === 'freqCode'">
                <l-shotcut-input
                  ref="freqCode"
                  v-axShotcut
                  :disabled="!item.input"
                  :data-id="'freqCode' + scope.row.row_id"
                  :shotindex="shotcutIndexHandler(scope, 'freqCode')"
                  component="l-value-domain"
                  :shotready="shotreadyHandler(scope, 'freqCode')"
                  @ended.native="shotcutEndHandler(scope, item)"
                  remoteUrl="/frequency/pageList"
                  :remoteParams="remoteParams"
                  :value.sync="scope.row.freqCode"
                  placeholder=""
                  remoteShowKey="frequencyName"
                  remoteValueKey="frequencyCode"
                  clearable
                  @change="((value, item) => {handleFreq(value, item, scope.row)})"
                />
              </template>
              <template v-else-if="item.prop === 'firstDayUse'">
                <div v-if="item.edit">
                  <lInputNumber
                    ref="firstDayUse"
                    v-axShotcut
                    v-selectInner
                    :disabled="!item.input"
                    :data-id="'firstDayUse' + scope.row.row_id"
                    :shotindex="shotcutIndexHandler(scope, 'firstDayUse')"
                    :shotready="shotreadyHandler(scope, 'firstDayUse')"
                    component="lInputNumber"
                    :controls="false"
                    style="width: 100%;"
                    @input="firstDayUseChange(scope.row)"
                    @ended.native="shotcutEndHandler(scope, item)"
                    v-model="scope.row.firstDayUse"
                    controls-position="right"
                    :min='0'
                    :step="1"
                    :max="scope.row[item.prop + maxKeyText]"
                  ></lInputNumber>
                </div>
                <div v-else>{{ item.default }}</div>
              </template>
              <template v-else-if="item.prop === 'useDay'">
                <lInputNumber
                  ref="useDay"
                  v-axShotcut
                  v-selectInner
                  :disabled="!item.input"
                  :shotindex="shotcutIndexHandler(scope, 'useDay')"
                  component="lInputNumber"
                  :shotready="shotreadyHandler(scope, 'useDay')"
                  :controls="false"
                  style="width: 100%;"
                  v-model="scope.row.useDay"
                  controls-position="right"
                  step-strictly
                  :min='0'
                  @input="useDayChangeHandler(scope.row)"
                />
              </template>
              <template v-else-if="item.prop === 'price'">
                <div
                  class="ellipsis"
                  :align="item.align"
                >
                  {{ scope.row.price | roundingPrice }}
                </div>
              </template>
              <template v-else-if="item.prop === 'quantity'">
                <lInputNumber
                  component="lInputNumber"
                  ref="quantity"
                  :disabled="!item.input"
                  v-selectInner
                  v-axShotcut
                  :data-id="'quantity' + scope.row.row_id"
                  :shotindex="shotcutIndexHandler(scope, 'quantity')"
                  :shotready="shotreadyHandler(scope, 'quantity')"
                  @ended.native="shotcutEndHandler(scope, item)"
                  :controls="false"
                  style="width: 100%;"
                  v-model="scope.row.quantity"
                  controls-position="right"
                  :min='0'
                  :step="1"
                  @input="((value) => {computeAmtWrapper(value, scope.row)})"
                />
              </template>
              <template v-else-if="item.prop === 'unit'">
                <el-select
                  ref="unit"
                  :disabled="!item.input"
                  component="el-select"
                  :shotindex="scope.$rowIndex + '8'"
                  :shotready="shotreadyHandler(scope, 'unit')"
                  v-model="scope.row.unit"
                  placeholder="单位"
                  @change="unitChange($event, scope.row)"
                >
                  <el-option
                    v-for="(item, index) in scope.row.unitOptions"
                    :label="item.label"
                    :key="index"
                    :disabled="item.isDisabled"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
              <template v-else-if="item.prop === 'remark'">
                <l-shotcut-input
                  ref="remark"
                  component="el-input"
                  :shotindex="scope.$rowIndex + '9'"
                  :disabled="!item.input"
                  :shotready="shotreadyHandler(scope, 'remark')"
                  v-model="scope.row.remark"
                />
              </template>
              <template v-else-if="item.prop === 'selfProvided'">
                <el-checkbox
                  true-label='1'
                  false-label='0'
                  :disabled="!item.input || scope.row.selfProvidedDisabled"
                  v-model="scope.row[item.prop]"
                  @keyup.enter.native="scope.row[item.prop] = !scope.row[item.prop]"
                ></el-checkbox>
              </template>
              <template v-else-if="item.prop === 'free'">
                <el-checkbox
                  true-label='1'
                  false-label='0'
                  :disabled="!item.input"
                  v-model="scope.row[item.prop]"
                  @keyup.enter.native="scope.row[item.prop] = !scope.row[item.prop]"
                ></el-checkbox>
              </template>
              <template v-else-if="item.prop === 'urgent'">
                <el-checkbox
                  true-label='1'
                  false-label='0'
                  @change="((value) => {urgentChang(value, scope.row)})"
                  :disabled="isUrgentDisabled(scope.row)"
                  v-model="scope.row[item.prop]"
                  @keyup.enter.native="scope.row[item.prop] = !scope.row[item.prop]"
                ></el-checkbox>
              </template>
              <template v-else-if="item.prop === 'selfPay'">
                <el-checkbox
                  true-label='1'
                  false-label='0'
                  v-model="scope.row[item.prop]"
                  @keyup.enter.native="scope.row[item.prop] = !scope.row[item.prop]"
                ></el-checkbox>
              </template>
              <template v-else-if="item.prop === 'execDept'">
                <!-- <span
                  :align="item.align"
                  tableName="sys_org"
                  :conditionMap="{
                      org_type: '_DEPT_',
                      id: scope.row.exeDeptName
                    }"
                  columns="org_nm"
                  v-tableTransform
                >--</span> -->
                <div
                  class="ellipsis"
                  :align="item.align"
                >
                  {{ scope.row.exeDeptName || "--" }}
                </div>
              </template>
              <template v-else-if="item.prop === 'specialNote'">
                <l-shotcut-input
                  ref="specialNote"
                  :disabled="!item.input"
                  clearable
                  component="l-value-domain"
                  :shotindex="scope.$rowIndex + '9.2'"
                  :shotready="shotreadyHandler(scope, 'specialNote')"
                  :controls="false"
                  code="adviceSpecialNote"
                  remoteShowKey="name"
                  remoteValueKey="code"
                  :value.sync="scope.row.specialNote"
                  placeholder=""
                />
              </template>
              <!-- 皮试 -->
              <template v-else-if="item.prop === 'stSolutionType'">
                <l-shotcut-input
                  ref="stSolutionType"
                  :disabled="!item.input"
                  clearable
                  component="l-value-domain"
                  :controls="false"
                  code="SkinTestWay"
                  remoteShowKey="name"
                  remoteValueKey="code"
                  :value.sync="scope.row.stSolutionType"
                  placeholder=""
                />
              </template>
              <template v-else-if="item.prop === 'amt'">
                <span :align="item.align">{{ scope.row.amt | roundingAmt }}</span>
              </template>
              <template v-else-if="item.prop === 'deptId'">
                <span
                  :align="item.align"
                  tableName="sys_org"
                  :conditionMap="{
                    org_type: '_DEPT_',
                    id: scope.row.deptId
                }"
                  columns="org_nm"
                  v-tableTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'no'">
                <div :align="item.align"> {{ scope.row[item.prop] || "--" }} </div>
              </template>
              <template v-else>
                <div
                  class="ellipsis"
                  :align="item.align"
                  :title="scope.row[item.prop]"
                > {{ scope.row[item.prop]!= 0 || scope.row[item.prop]   ? scope.row[item.prop] : "--" }}
                </div>
              </template>
            </template>
          </vxe-table-column>
        </vxe-grid>
      </div>
    </div>
    <!-- 保存模板弹窗 -->
    <el-dialog
      title="保存模板"
      :visible.sync="saveTempStyle"
      width="30%"
      :before-close="tempStyleHandleClose"
      :close-on-click-modal= false
    >
      <div>
        <dialogSavetemp
          ref="dialogSavetemp"
          :saveTplSuccesBack="tempStyleHandleClose"
          :multipleSelection="multipleSelection"
          v-if='saveTempStyle'
        ></dialogSavetemp>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="tempStyleHandleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="tempStyleHandleSave"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 保存模板弹窗 -->
  </div>
</template>

<script>
import BottomForm from "./bottomForm";
import bottomModule from "./bottomModule";
import specialDrugsRegister from "./specialDrugsRegister.vue";
import saveTemplate from "./saveTemplate.vue";
import dialogSavetemp from "./saveTpl/dialogSavetemp.vue";
import { mapActions, mapGetters } from "vuex";
import {
  adviceDelete,
  allStop,
  bunching,
  cancel,
  copyLong,
  copyShort,
  getAdvice,
  gonna,
  gonnaOut,
  gonnaLeave,
  stop,
  unbunching,
  adviceSubmit,
  performance,
  rescind,
  temporaryList,
  westAdviceStop,
  westAdviceRescind,
  westAdviceRecall
} from "@/api/cis/resident/residentAdvice";

import {
  getAdviceItem,
  temporary,
  temporaryAll,
  westAdviceBunching,
  westAdviceUnbunching,
  westAdviceDelete,
  westAdviceSubmit,
  westAdviceGetAdvice
} from "@/api/homeSickbeds/hsDiagTreat/hsOrder.js";

import { leadAdviceFormwork } from "@/api/cis/resident/residentAdviceFormwork";
import { onPreview, onPrint } from "@/utils/print";
import { getDataIdDom } from "@/utils/util.js";
import { getEffectiveRecord } from "@/api/common/allergy";
import {
  getRecipeNo,
  saveOrders,
  getFirstDayCount,
  getWestAdviceFirstDayCount
} from "@/api/cis/order/order";

import {
  fetchAdviceList,
  addAdvice,
  querySelectAdvName,
  fetchAdvDetailItem,
  fetchAdvDetail,
  upDataAdvice
} from "@/api/ipnw/nursing";
import { getArrayList } from "@/api/wconf/wparam";
import { deepClone, Throttle } from "@/utils/index.js";
import {
  hospDrugCalculatFunc,
  amtCalculatFunc
} from "@/components/adviceCommon/drugCalculatFunc.js";
import {
  defSelectedphar,
  defaultAddStatusValue,
  tableColumn,
  zanCunStatusValue,
  relationDisabledList,
  maxKeyText,
  dropColumn,
  lInputTableDefautText
} from "./adviceUtil/variable.js";
import {
  getQtyUnitAjax,
  setUnitItemState,
  grouping,
  isZanCunStatus,
  isSameGroup,
  removeClassClone,
  addClassClone,
  validRulesHandler,
  isOnlyOneEdit,
  setColumnModel,
  tableDataByFilter,
  showTipAlertWrapper,
  getDiagnose,
  isEmpty,
  clearRelationId,
  setRelationId,
  isMajorRow,
  isNotMajorRow,
  setNotMajorRowData,
  setRelationToRowData,
  isRelationFalse,
  initServerGrouped,
  getTableDataByItemId,
  clearRow,
  getAddRowOriginObj,
  setTableScrollBottom,
  unitFlagRelatedUnit,
  isGroup,
  bunchingValidate,
  setSimulateGroupedData,
  authorityVerifByItem,
  checkDupFunc,
  selfContMedFunc,
  setTableColumnRelateDefault
} from "./adviceUtil/util.js";
import {
  setComponentFocusFunc,
  setNextComponentFocus,
  setGroupNoList,
  getGroupList,
  fiteredMajorNoData,
  getPharmacyObjectFunc,
  setLInputTableShotReady,
  isOrderItemNameShotReady,
  numberFormatter,
  getUnitFlag
} from "@/components/adviceCommon/adviceUtils.js";
import { mixins } from "./adviceUtil/mixin.js";
import { getConfig, getCurrentRowConfig } from "./adviceUtil/adviceDispense.js";
import { getEnterJumpOrder } from "./adviceUtil/enterConfig.js";
import { getValidRules } from "./adviceUtil/validRulesConfig.js";


export default {
  mixins: [mixins],
  components: {
    dialogSavetemp
  },
  data() {
    return {
      groupNoList: [],
      saveTempStyle: false,
      editConfig: {
        trigger: "click",
        mode: "row",
        autoClear: false,
        // showStatus: true,
        icon: "iii",
        activeMethod: this.isActiveAllowed
      },
      checkBoxConfig: {
        checkRowKeys: ""
      },
      lInputTableDefautText,
      maxKeyText,
      validRules: {},
      test: {
        id: "8ae407a07529f678017529f678c50000",
        treatNo: "JINP201015001"
      },
      // 药品的分页数据
      queryName: "",
      currentPage: 0,
      pageSize: 10,
      total: 11,
      freq: {}, //选中的当前频次数据
      drugItem: {},
      vxtablelumn: deepClone(tableColumn),
      selectDrop: {
        // 输入药品名称显示的下拉table
        dropColumn,
        selectOptions: [],
        unitOptions: []
      },
      tableData: [],
      searchResLoading: false, // 模糊查询列表 loading
      mainTableLoading: false, // 医嘱列表 loading
      //  查询条件
      searchForm: {
        pharmacyId: "",
        pharmacyDisabled: false,
        type: "1",
        inpCode: "",
        dateRange: [],
        patientId: "",
        bedNo: "",
        name: "", // 医嘱查询关键词
        status: "", //
        deptType: "1", //
        adviceType: "1",
        today: "",
        patientName: ""
      },
      remoteParams: {
        pageSize: 50,
        status: 1
      },
      freq: {},
      selectDeptId: ""
    };
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData", "role", "name"]),
    ...mapGetters("adviceCommon", ["westPharmacyObject"]),
    //简写 table 取值
    // tableData() {
    //   let { tableData } = this.$refs.xTable.getTableData();
    //   return tableData;
    // },
    // 简写selection 取值
    multipleSelection() {
      return this.$refs.xTable.getCheckboxRecords();
    }
    //只读
    // currentRow() {
    //   let getActiveRecord = this.$refs.xTable.getActiveRecord();
    //   return getActiveRecord ? getActiveRecord.row : {};
    // }
  },
  created() {
    this.fetchTableList();
    this.changeTreatId({
      treatId: this.searchForm.type
    });
  },
  /**
   *  isUrgentDisabled  紧急列 disabled 状态的控制
   *  urgentChang 紧急列切换函数
   *  saveTemp  打开保存模板弹窗
   *  tempStyleHandleClose  取消保存模板弹窗
   *  tempStyleHandleSave  模板弹窗 点击确定保存按钮事件
   *  changePharmacy  药房改变回调
   *  temporarySaveAll 全部暂存方法
   *  relationHandle 关联的输入事件
   *  updateGroupNoList 更新 GroupNoList 事件
   *  setSimulateDataWrapper 设置关联成组虚拟数据外层函数
   *  submitAndAddNewRow 验证表单，暂存表单，新增一行
   *  handleUseWay 用法切换函数
   *  getActiveRow 获取当前行
   *  activeMethod 当前行编辑状态改变，回调函数
   *  setTableColumnStatus 设置表格列的状态函数
   *  setGroupListData 设置成组的数据联动
   *  computeAmtWrapper 数字列回调函数
   *  initTableColumn 初始化表格的列和列的属性
   *  adviceTimeChange 时间列回调函数
   *  cancelBunching 取消成组回调
   *  bunchingHandler 成组回调
   *  select 医嘱项目下拉选中回调函数
   *  firstDayUseChange 首日次数改变的回调函数
   *  computeAmt 计算处方金额
   *  unitChange 单位切换回调函数
   *  useDayChangeHandler 更改用药天数回调函数
   *  handleFreq 更改频次回调函数
   *  handleQty 自动计算数量函数
   *  getQtyFunc 数量计算内部函数
   *  fetchTableList 获取医嘱列表
   *  computerFutureTime 根据开始时间，计算预停时间
   *  mainFormValidate table row的表单验证
   *  temporarySave 单条暂存
   *  onceDosageHandle 单次用量改变回调函数
   *  shotcutIndexHandler  enter 配置 设置shotIndex
   *  shotcutEndHandler enter 跳转到最后一个可输入框的回调事件
   *  shotreadyHandler enter 配置 ready事件
   *  submitSave 提交医嘱
   *  radioChange 长期临时切换回调
   *  LInputTableClear 医嘱下拉组件inputTableValChange回调
   *  searchLike 医嘱项目搜索回调
   *  setSelfProvidedStatus 设置自备药的禁用的状态
   *  resetLInputTablePaging 重置医嘱项目的分页数据  (分页初始事件挂载)
   *  selectWrapper 选中医嘱项目，外层校验函数
   *  addRow 新增一行
   *  deleteHandler 删除医嘱回调函数
  */
  methods: {
    ...mapActions({
      changeTreatId: "homeSickbeds/changeTreatId",
      changeWestPharmacyObject: "adviceCommon/changeWestPharmacyObject"
    }),
    //紧急列 disabled 状态的控制
    isUrgentDisabled(row) {
      return !(row.majorId == row.id);
    },

    // zhangbaoheng  2020/10/27 14:38 添加 保存模板功能  打开保存模板弹窗
    saveTemp() {
      let tableData = this.getTableData();
      // if (isOnlyOneEdit(tableData, defaultAddStatusValue)) {
      //   this.$message.warning("当前有一条正在编辑的医嘱请暂存后保存模板!");
      //   return;
      // }
      if (this.multipleSelection.filter((item) => {return item.id}).length == 0){
        this.$message.warning("请至少选择一条暂存的医嘱!");
        return;
      }

      this.saveTempStyle = true;
    },
    // 取消  取消保存模板弹窗
    tempStyleHandleClose() {
      this.saveTempStyle = false;
    },
    // 模板弹窗 点击确定保存按钮事件
    // eslint-disable-next-line complexity
    async tempStyleHandleSave() {
       let tableData = this.getTableData();

      // if (isOnlyOneEdit(tableData, defaultAddStatusValue)) {
      //   this.$message.warning("当前有一条正在编辑的医嘱请暂存后保存模板!");
      //   return;
      // }

      try {
        this.$refs.dialogSavetemp.saveTpl ();
      } catch (error) {

      }

    },
    // zhangbaoheng  2020/10/27 14:38 添加 保存模板功能  药房改变回调
    changePharmacy(deptId) {
      let newPharmacyObject = getPharmacyObjectFunc(
        deptId,
        deepClone(this.westPharmacyObject)
      );
      this.changeWestPharmacyObject(newPharmacyObject);
    },
    //设置 医嘱的长期 与 短期
    setAdviceType(type = 1) {
      // console.log("type", type);
      this.searchForm.type = type;
      this.fetchTableList();
    },

    // 全部暂存
    // eslint-disable-next-line consistent-return
    async temporarySaveAll() {
      if (this.mainTableLoading) return false;
      this.mainTableLoading = true;
      // 获取数据
      let tableData = getTableDataByItemId(this);
      return new Promise(async (resolve, reject) => {
        try {
          // 保存接口
          let { data, msg, code, tips } = await temporaryAll(tableData);
          if (code == 1) {
            this.$message({
              type: "success",
              message: "暂存成功!"
            });
            this.mainTableLoading = false;

            try {
              await showTipAlertWrapper(tips);
            } catch (error) {

            }
            // this.fetchTableList();
            // 刷新列表
            try {
              let fetchTableListResult = await this.fetchTableList();
              if (fetchTableListResult) {
                resolve(true);
              }
            } catch (error) {
              reject("获取处方列表失败");
            }
          } else {
            this.mainTableLoading = false;
            this.$message.error(msg || " 接口返回错误");
            reject("暂存失败");
          }
        } catch (error) {
          this.$message.error("暂存全部接口返回错误");
          this.mainTableLoading = false;
          reject("暂存失败");
        }
      });
    },

    // 关联失去焦点事件
    // eslint-disable-next-line consistent-return
    // eslint-disable-next-line complexity
    async relationHandle(value, row, handleType) {
      // if (value === "" || typeof value === "undefined") {
      //   return false;
      // }
      // console.log(value, row);
      let tableData = this.tableData;
      let isRelationEmpty = isEmpty(row.relation);
      if (isRelationEmpty) {

        if (!initServerGrouped(row)) {// 是用户操作的成组，而不是服务端返回的

          // 设置 模拟数据 majorId 的值
          this.setSimulateDataWrapper({}, row, "init");


          this.setTableColumnStatus(
            row,
            "relation",
            {
              relationToRow: row
            }
          );

          // 触发关联的 列 并赋值
          setTableColumnRelateDefault("relation", this.vxtablelumn, row, this);
          this.handleQty(row);
        }
        clearRelationId(row, this);
        // this.$set(row, "majorId", row.majorId);
        // return false;
      } else {
        let targetRow = tableData.find(item => {
          return item.no == row.relation;
        });
        if (isRelationFalse(targetRow, row, this)) {
          clearRelationId(row, this);
          return false;
        }

        //设置模拟成组数据 majorId
        // this.setSimulateGroupedData(relationToRow, row);

        let isReadonly = !isEmpty(row.relation);
        // console.log("row.relation", row.relation);
        // 设置 关联的禁用状态
        // this.setTableColumnStatus(
        //   targetRow,
        //   "relation",
        //   isReadonly
        // );

        // 设置 模拟数据 majorId 的值
        this.setSimulateDataWrapper(targetRow, row);

        this.setTableColumnStatus(
          row,
          "relation",
          {
            relationToRow: targetRow
          }
        );
        // 触发关联的 列 并赋值
        setTableColumnRelateDefault("relation", this.vxtablelumn, row, this);
        this.handleQty(row);
        setRelationId(row, targetRow, this);
        if (handleType == "enter") {
          //enter 可以提交并新增一行
          this.submitAndAddNewRow();
        }
      }
      this.updateGroupNoList();
    },
    updateGroupNoList (){
      this.groupNoList = setGroupNoList(this.tableData);
    },
    // 设置关联成组虚拟数据外层函数
    setSimulateDataWrapper (relationToRow, relationRow, type = "setRelate"){
      if (type === "setRelate") {
        setSimulateGroupedData(relationToRow, relationRow, this);
      } else {
        // 主医嘱设置
        setRelationToRowData(relationRow, this);
      }

    },

    urgentChang(value, row) {
      //console.log(value, row);
      this.currentRowIndex = row.trindex; // 设置当前行数据
      this.$refs.xTable.setCurrentRow(row);
      if (isGroup(row, this.groupNoList)) {
        // 主医嘱
        this.setGroupListData(row, "urgent");
      }
    },
    async submitAndAddNewRow() {
      // 验证table 表单
      try {
        await this.mainFormValidate();
      } catch (error) {
        return;
      }

      try {
        let submitCurRowResult = await this.temporarySaveAll();
        // console.log("submitCurRowResult", submitCurRowResult);
        if (submitCurRowResult) {
          this.addRow();
        }
      } catch (e) {
        console.error("temporarySave（暂存医嘱） 出错");
      }
    },
    // setMajorNo (row){
    //  this.$set(row, "majorId", row.relation);
    // },
    handleUseWay(value, item, row) {
      this.currentRowIndex = row.trindex; // 设置当前行数据
      this.$refs.xTable.setCurrentRow(row);
      // console.log(isGroup(row));
      if (isGroup(row, this.groupNoList)) {
        // 主医嘱
        this.setGroupListData(row, "useWay");
      }
    },
    getActiveRow() {
      let getActiveRecord = this.$refs.xTable.getActiveRecord();
      return getActiveRecord ? getActiveRecord.row : {};
    },
    // 选择了药品 校验当前行， 没有选择药品，不做校验
    async isActiveAllowed() {
      // let result = false;

      // let activeRow = this.getActiveRow();
      // if (activeRow.itemId) {
      //   try {
      //     result = await this.mainFormValidate();
      //   } catch (error) {
      //     return false;
      //   }
      //   return result;
      // }
      return true;
    },
    // 当前行编辑状态改变，回调函数
    activeMethod({ row, rowIndex }) {
      let activeColumn = getConfig(row, this.searchForm.type);
      //更新model 的 edit 等属性
      setColumnModel(activeColumn, this.vxtablelumn, this);

      //触发 首日次数的 关联
      setTableColumnRelateDefault("firstDayUse", this.vxtablelumn, row, this);
      this.validRules = getValidRules(row, this.searchForm.type);
    },

    // relationObj 关联 所需数据
    setTableColumnStatus(
      row,
      fireColName,
      relationObj = {}
    ) {
      let activeColumn = "";
      //专注 当前行的A到B 的逻辑
      // if (setType == "cRow") {
        activeColumn = getCurrentRowConfig(
          row,
          this.searchForm.type,
          fireColName,
          relationObj
        );
      // } else {
        // 专注与 其他医嘱的逻辑
      // }
      // console.log("activeColumn", activeColumn);
      //更新model 的 edit 等属性
      setColumnModel(activeColumn, this.vxtablelumn, this);
      // console.log(JSON.stringify(this.vxtablelumn));
    },
    setGroupListData(row, colName) {
      let groupList = getGroupList(this.groupNoList, row);
      let setList = fiteredMajorNoData(groupList);
      let currentRow = row;
      // console.log("setList", setList);
      if (setList.length == 0) return;
      this.setTableColumnStatus(row, colName);
      let commonConfig = this.vxtablelumn;
      groupList.forEach(item => {
        // 触发关联的 列 并赋值
        setTableColumnRelateDefault(colName, commonConfig, item, this);
        // 计算数量 计算金额
        this.handleQty(item);
      });
    },
    computeAmtWrapper(value, row) {
      this.computeAmt(row);
    },
    //重置table的列 和 属性
    initTableColumn() {
      let originColumn = getConfig({}, this.searchForm.type);
      //更新model 的 edit 等属性
      setColumnModel(originColumn, this.vxtablelumn, this);
    },
    adviceTimeChange(row) {
      //计算 预停时间
      this.computerFutureTime(row);
    },
    //取消成组
    cancelBunching() {
      let data = this.multipleSelection;
      if (data.length > 1) {
        // 成组最少两个成员
        // 组号相同
        if (isSameGroup(this.multipleSelection)) {
          westAdviceUnbunching(
            data.map(item => {
              return item.id;
            })
          ).then(res => {
            if (res.code === 1) {
              this.$message.success(res.msg ? res.msg : "取消成组成功！");
              this.fetchTableList(false);
            } else {
              this.$message.error(res.msg ? res.msg : "取消成组失败");
            }
          });
        } else {
          this.$message.warning("取消成组组号必须相同");
        }
      } else {
        this.$message.warning("取消成组最少两个医嘱");
      }
    },
    //成组 处理
    bunchingHandler() {
      //成组校验
      if (bunchingValidate(this.multipleSelection)) {
        // this.setBunchingSelect ();
        this.$confirm("成组药品用法和频次，用药天数将保持一致，是否继续？")
          .then(_ => {
            //处理频次和用法,数量
            let ajaxList = this.multipleSelection;
            this.mainTableLoading = true;
            westAdviceBunching(
              ajaxList.map(item => {
                return item.id;
              })
            )
              .then(res => {
                if (res.code === 1) {
                  this.$message({
                    type: "success",
                    message: "成组成功!"
                  });
                  this.fetchTableList();
                } else {
                  console.info(res);
                  this.$message.error(res.msg || " 接口返回错误");
                }
                this.mainTableLoading = false;
              })
              .catch(() => {
                this.$message.error("成组失败！");
                this.mainTableLoading = false;
              });
          })
          .catch(_ => {});
      }
    },

    getData() {
      console.log(this.$refs.xTable.getData());
      console.log(this.$refs.xTable.getActiveRecord().row);
    },


    async select(v, tableRow) {
      //药品的信息存储
      let drugItem = {
        ...v,
        ...{
          itemName: v.name,
          itemId: v.id
        }
      };

      // 校验规则分发
      this.validRules = getValidRules(v, this.searchForm.type);
      let newTableColumn = getConfig(v, this.searchForm.type);
      //更新model 的 edit 等属性
      setColumnModel(newTableColumn, this.vxtablelumn, this);

      this.drugItem = drugItem;

      // currentRow 赋值
      let currentRow = tableRow;

      this.$set(currentRow, "pharmacyId", v.pharmacyId);
      this.$set(currentRow, "pharmacyName", v.pharmacyName || "先写一个");
      this.$set(currentRow, "execDeptId", v.execDeptId);
      this.$set(currentRow, "spec", v.spec);
      this.$set(currentRow, "itemId", v.id);
      this.$set(currentRow, "itemName", v.name);
      this.$set(currentRow, "price", v.price);
      this.$set(currentRow, "dosageUnit", v.dosageUnit);
      this.$set(currentRow, "pkgUnit", v.pkgUnit);
      this.$set(currentRow, "limitUnit", v.limitUnit);
      this.$set(currentRow, "cutable", v.cutable);
      this.$set(currentRow, "majorClass", v.majorClass); //药品类型
      this.$set(currentRow, "dosageMeasure", v.dosageMeasure);
      this.$set(currentRow, "pkgMeasure", v.pkgMeasure);

      //有默认的频次相关数据存储到currentRow 里，方便提交
      this.$set(currentRow, "freqTimes", v.defaultFreqTimes);
      this.$set(currentRow, "freqUnit", v.defaultFreqUnit);
      this.$set(currentRow, "dismountable", v.dismountable);
      this.$set(currentRow, "roundingMode", v.roundingMode);

      // 大小单位 与 unitFlag 的联系处理
      unitFlagRelatedUnit(drugItem, currentRow, this);

      try {
        let unitList = await getQtyUnitAjax(v);
        currentRow.unitOptions = setUnitItemState(currentRow, this.searchForm.type, unitList);
        // currentRow.unitOptions = unitList;
      } catch (error) {
        return;
      }

      // 触发关联的 列 并赋值，
      // 与医嘱名称关联的  列已经在配置文件中处理
      // 默认值处理。
      setTableColumnRelateDefault(
        "itemName",
        this.vxtablelumn,
        currentRow,
        this
      );

      setLInputTableShotReady("on", currentRow, this);

      //聚焦单次用量
      this.$nextTick(() => {
        setComponentFocusFunc("onceDosage", this.getActiveRow().row_id);
        // setNextComponentFocus("lInputTable", this.getActiveRow().row_id);
        this.handleQty(currentRow);
      });
    },
    //用药天数计算
    firstDayUseChange(tableRow) {
      if (isGroup(tableRow, this.groupNoList)) {
        // 主医嘱
        this.setGroupListData(tableRow, "firstDayUse");
      }
      console.log("计算了");
      //计算金额
      this.handleQty(tableRow);
    },
    //计算处方金额
    computeAmt(tableRow) {
      this.$nextTick(() => {
        let drugQty = tableRow.quantity;
        let price = tableRow.price;
        let pkgMeasure = tableRow.pkgMeasure;
        let unit = tableRow.unit;
        let pkgUnit = tableRow.pkgUnit;
        let unitFlag = getUnitFlag(pkgUnit, unit);
        let amt = amtCalculatFunc(drugQty, price, pkgMeasure, unitFlag);
        this.$set(tableRow, "amt", amt);
      });
    },
    // 数量 后面的单位改变
    unitChange(value, row) {
      let currentRow = row;
      this.currentRowIndex = row.trindex; // 设置当前行数据
      this.$refs.xTable.setCurrentRow(row);

      // 设置医生选择单位标识 0-小包装单位  1-大包装单位
      unitFlagRelatedUnit(currentRow, currentRow, this);

      this.handleQty(row);
    },
    //更改用药天数
    useDayChangeHandler(tableRow) {
      if (isGroup(tableRow, this.groupNoList)) {
        // 主医嘱
        this.setGroupListData(tableRow, "useDay");
      }

      //计算金额
      this.handleQty(tableRow);
      //计算 预停时间
      this.computerFutureTime(tableRow);
    },

    // 选中频次处理方法
    handleFreq(value, item, row) {
      this.currentRowIndex = row.trindex; // 设置当前行数据
      this.$refs.xTable.setCurrentRow(row);

      //currentRow 对 frequencyTimes  frequencyUnit 赋值 START
      let currentRow = row;
      this.$set(currentRow, "freqTimes", item.frequencyTimes);
      this.$set(currentRow, "freqUnit", item.cycleUnit);
      this.$set(currentRow, "freqId", item.id);
      //currentRow 对 frequencyTimes  frequencyUnit 赋值 END
      // console.log(row.majorId, row.id);
      if (isGroup(row, this.groupNoList)) {
        // 主医嘱
        this.setGroupListData(row, "freqCode");
      } else {
        this.setTableColumnStatus(row, "freqCode");
        setTableColumnRelateDefault("freqCode", this.vxtablelumn, row, this);
      }

      this.handleQty(row);
    },

    handleQty(row) {
      this.$nextTick(() => {
        let qty = this.getQtyFunc(row);
        console.log("最终数字", qty);
        try {
          this.$set(row, "quantity", qty);
        } catch (e) {}

        this.computeAmt(row);
      });
    },
    //长期医嘱 临时医嘱 用药天数 首日次数 业务处理
    // eslint-disable-next-line valid-jsdoc
    /**
     * freqObj 频次对象
     * onceDosage 一次计量
     * currentItem 当前行的数据 包含规格 包装单位等
     * unitFlag  大单位0  小单位1
     */
    // eslint-disable-next-line consistent-return
    getQtyFunc(tableRow) {
      let currentRow = tableRow;
      let useDay = currentRow.useDay;
      let firstDayUse = currentRow.firstDayUse;
      let unitFlag = getUnitFlag(currentRow.pkgUnit, currentRow.unit);
      let onceDosage = currentRow.onceDosage;
      let type = this.searchForm.type;
      let roundingMode = currentRow.roundingMode;
      let dismountable = currentRow.dismountable;
      let freqTimes = currentRow.freqTimes;
      //临时： 用药天数非必填 默认1 不让改
      //长期： 用药天数 不必须填，如果用药天数不写的，计算公式不执行, 数量是空 或者 0。
      if ((typeof useDay == "undefined" || useDay == 0) && type == 1) {
        return undefined;
      }
      // 长期计算公式 次数 = （天数 - 1）* 每日次数 + 首日次数
      // 临时计算公式 次数 = 每日次数  用药天数 是一天 首日次数是 0

      useDay = type == 1 ? useDay - 1 : useDay;
      firstDayUse = type == 1 ? firstDayUse : 0;
      let cutable = currentRow.cutable == "0" ? false : true;
      let result = hospDrugCalculatFunc(
        type,
        currentRow,
        currentRow
      );

      return result;
    },
    async fetchTableList() {
      this.searchForm.bedNo = this.receivePatientData.bedCode;
      this.searchForm.inpCode = this.receivePatientData.inpCode;
      this.searchForm.patientId = this.receivePatientData.patientId;
      // 请求医嘱方法
      let data = this.searchForm;
      let cloneData = Object.assign(data);

      cloneData.pageNo = 1;
      cloneData.treatId = this.receivePatientData.id;
      cloneData.treatNo = this.receivePatientData.treatNo;
      cloneData.pageSize = 999;
      if (!cloneData.treatId) return;
      this.mainTableLoading = true;
      // eslint-disable-next-line consistent-return
      return new Promise(async (resolve, reject) => {
        // try {
          let { data, msg, code } = await westAdviceGetAdvice(cloneData);
          if (code === 1) {
            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              const { id } = element;//防止id 被 element.item 里面的id 覆盖
              let cloneItem = {
                ...element,
                ...element.item,
                id
              };

              // 大小单位 与 unitFlag 的联系处理
              unitFlagRelatedUnit(element.item, cloneItem, this);

              //unitOptions 注入单位列表
              try {
                let unitList = await getQtyUnitAjax(cloneItem);
                cloneItem.unitOptions = setUnitItemState(cloneItem, this.searchForm.type, unitList);
                // cloneItem.unitOptions = unitList;
              } catch (error) {
                return;
              }

              data[i] = cloneItem;
            }
            this.tableData = data;
            this.updateGroupNoList();
            grouping(data);
            this.initTableColumn();
            // 校验规则分发
            this.validRules = getValidRules({}, this.searchForm.type);
            this.mainTableLoading = false;

            resolve(true);
          } else {
            this.$message.error(msg || "获取数据错误");
            this.mainTableLoading = false;
            reject("医嘱列表获取失败");
          }
        // } catch (error) {
        //   this.$message.error("获取数据错误");
        //   this.mainTableLoading = false;
        //   reject("医嘱列表获取失败");
        // }
      });
    },
    //计算 预停时间
    computerFutureTime(row) {
      let currentRow = row;
      let useDay = currentRow.useDay ? currentRow.useDay : 0;
      if (!useDay) {
        //用药天数为空，不在计算预停时间
        currentRow.expectStopTime = "";
        return;
      }
      let expectStartTime = currentRow.expectStartTime
        ? currentRow.expectStartTime
        : new Date();

      this.$nextTick(() => {
        let time = Number(useDay * 24 * 60 * 60 * 1000);
        let adviceTimeChuo = Number(+new Date(expectStartTime));
        currentRow.expectStopTime = new Date(adviceTimeChuo + time).format(
          "yyyy-MM-dd hh:mm:ss"
        );
      });
    },
    async mainFormValidate() {
      return new Promise(async (resolve, reject) => {
        const errMap = await this.$refs.xTable
          .validate(this.getActiveRow())
          .catch(errMap => errMap);
        if (errMap) {
          // this.$XModal.message({ status: "error", message: "校验不通过！" });
          reject("表单出错!");
        } else {
          // this.$XModal.message({ status: "success", message: "校验成功！" });
          resolve(true);
        }
      });
    },
    async temporarySave() {
      if (this.mainTableLoading) return false;

      // if (this.multipleSelection.length !== 1) {
      //   this.$message.warning("请选择一条医嘱暂存！");
      //   return false;
      // }

      // 验证table 表单
      try {
        await this.mainFormValidate();
      } catch (error) {
        this.mainTableLoading = false;
        return false;
      }
      let currentRow = this.getActiveRow();

      if (Object.keys(currentRow).length === 0) {
        this.$message.warning("请选择一条暂存的医嘱");
        return false;
      }
      // 暂存
      // let selectedData = { ...this.multipleSelection[0] };
      let selectedData = { ...currentRow };

      if (
        !(
          typeof selectedData.status === "undefined" ||
          selectedData.status === "" ||
          selectedData.status == "0" ||
          selectedData.status == "1"
        )
      ) {
        this.$message.warning("仅支持医嘱状态为暂存的医嘱进行保存！");
        return false;
      }
      this.mainTableLoading = true;
      // eslint-disable-next-line consistent-return
      return new Promise((resolve, reject) => {
        temporary(selectedData)
          .then(async res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "暂存成功!"
              });
              this.drugItem = {};
              this.mainTableLoading = false;
              // showTipAlertWrapper(res.tips);
              try {
                await showTipAlertWrapper(res.tips);
              } catch (error) {

              }
              try {
                let fetchTableListResult = await this.fetchTableList();
                if (fetchTableListResult) {
                  resolve(true);
                }
              } catch (error) {
                reject("获取处方列表失败");
              }
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
              this.mainTableLoading = false;
              reject("暂存失败");
            }
          })
          .catch(() => {
            this.$message.error("暂存失败");
            this.mainTableLoading = false;
            reject("暂存失败");
          });
      });
    },
    onceDosageHandle(value, row) {
      if (!isNaN(value)) {
        this.handleQty(row);
      }
    },
    shotcutIndexHandler(scope, name) {
      let requiredList = getEnterJumpOrder(scope.row, this.searchForm.type);
      // console.log("requiredList", requiredList);
      let index = requiredList.findIndex(item => {
        return item.prop === name;
      });
      if (index == "-1") return null;
      return String(scope.$rowIndex) + String(index + 1);
    },
    async shotcutEndHandler(row, item) {
      console.log("endSubmit::", item);
      if (!item.endSubmit) return;

      // 验证table 表单
      try {
        await this.mainFormValidate();
      } catch (error) {
        return;
      }

      try {
        let submitCurRowResult = await this.temporarySaveAll();
        // console.log("submitCurRowResult", submitCurRowResult);
        if (submitCurRowResult) {
          this.addRow();
        }
      } catch (e) {
        console.error("temporarySave（暂存医嘱） 出错");
      }
    },
    // shotcutEndHandler: Throttle(async function(e) {
    //   try {
    //     let submitCurRowResult = await this.temporarySave();
    //     // console.log("submitCurRowResult", submitCurRowResult);
    //     if (submitCurRowResult) {
    //       this.addRow();
    //     }
    //   } catch (e) {
    //     console.error("temporarySave（暂存医嘱） 出错");
    //   }
    // }, 3000),
    shotreadyHandler(scope, name) {
      if (Array.isArray(this.validRules[name])) {
        // console.log(
        //   "refs",
        //   this.$refs[name],
        //   this.$refs[name] && this.$refs[name].$el
        // );
        let validResult = validRulesHandler(
          scope.row[name],
          this.validRules[name]
        );
        if (validResult) {
          try {
            removeClassClone(this.$refs[name][0].$el, "is-error");
          } catch (error) {}
        } else {
          try {
            addClassClone(this.$refs[name][0].$el, "is-error");
          } catch (error) {}
        }
        // console.log(name, validResult, scope.row[name]);
        return validResult;
      }

      if (name === "itemName") {
        // console.log("_shotIsReady", scope.row._shotIsReady);
        return isOrderItemNameShotReady(scope.row);
      }
      return true;
    },
    submitSave() {
      if (this.mainTableLoading) return;
      this.mainTableLoading = true;
      let data = {};
      data.treatNo = this.receivePatientData.treatNo;
      data.treatId = this.receivePatientData.treatId;
      data.type = this.searchForm.type;

      westAdviceSubmit(data)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "提交成功!"
            });
            this.fetchTableList();
          } else {
            console.info(res);
            this.$message.error(res.msg || " 接口返回错误");
          }
          this.mainTableLoading = false;
        })
        .catch(() => {
          this.$message.error("提交失败！");
          this.mainTableLoading = false;
        });
      // }
    },
    radioChange() {
      this.changeTreatId({
        treatId: this.searchForm.type
      });
      this.fetchTableList();
    },
    LInputTableClear(drugName, row) {
      row.itemId = "";
      row.itemName = "";
    },
    /*
     * 新增医嘱时,医嘱名称模糊查询
     */
    searchLike(keyWord, row) {
      setLInputTableShotReady("off", row, this);
      if (this.searchResLoading) {
        return;
      }
      let pageNo = 1;
      let tableData = [];
      if (this.queryName === keyWord) {
        tableData = this.selectDrop.selectOptions;
        pageNo = Number(this.currentPage) + 1;
        console.log(pageNo, this.total, this.pageSize);
        if (Number(pageNo) > Number(this.total) / Number(this.pageSize)) {
          return;
        }
      }

      let data = {
        ...{
          pageNo: pageNo,
          pageSize: this.pageSize,
          key: keyWord,
          scene: this.searchForm.type == 1 ? "长期" : "临时",
          adviceType: this.searchForm.type,
          treatType: this.receivePatientData.type,
          pharmacyId: this.westPharmacyObject.selected.deptId
        }
      };

      this.searchResLoading = true;
      getAdviceItem(data)
        .then(res => {
          let { code, data, msg } = res;
          if (code == 1) {
            for (let i = 0; i < data.length; i++) {
              let itemData = data[i];
              //单价显示四位小数
              itemData.price = numberFormatter(itemData.price);
              tableData.push(itemData);
            }

            this.selectDrop.selectOptions = tableData;
            this.currentPage = res.pageNo;
            this.pageSize = res.pageSize;
            this.total = res.total;
            this.queryName = keyWord;
          } else {
            this.$message.error(msg || "获取数据失败");
          }
          this.searchResLoading = false;
        })
        .catch(e => {
          this.$message.error("获取数据失败!");
          this.searchResLoading = false;
        });
    },

    // 设置特殊备注的 值 和 禁用
    // 参数 value 是值
    // isDisabled 是否禁用
    setSelfProvidedStatus(value, isDisabled, tableRow) {
      let currentRow = tableRow;
      // 选择其他药品 重置
      currentRow.selfProvided = value;
      this.$set(currentRow, "selfProvidedDisabled", isDisabled);
    },



    // 重置下拉table的分页数据
    resetLInputTablePaging() {
      this.selectDrop.selectOptions = [];
      this.currentPage = 0;
      this.pageSize = 10;
      this.total = 11;
    },
    //选择医嘱处理函数
    async selectWrapper(drugRow, tableRow) {
      this.resetLInputTablePaging();
      // console.log(drugRow, tableRow);
      if (!drugRow) return;

      // 权限验证
      try {
        console.log("权限校验开始");
        let { siLimitCode } = await authorityVerifByItem(drugRow, tableRow, this);
        if (siLimitCode !== undefined) {
          this.$set(tableRow, "miRestriction", siLimitCode);
        }
        console.log("权限验证继续向下执行");
      } catch (error) {
        console.log("return 执行了");
        return;
      }

      try {
        await checkDupFunc(drugRow, tableRow, this);
      } catch (error) {
        return;
      }

      // 药品 且库存为0 提示用户 是否是开开具自备药
      // 确定开自备药，特殊备注选中自备药，并且禁用
      //取消开局自备药，提示用户该药品没有库存
      if (
        drugRow.pharmacyId &&
        (drugRow.availableQuantity == 0 ||
          typeof drugRow.availableQuantity === "undefined")
      ) {
        try {
          await selfContMedFunc(drugRow, tableRow, this);
        } catch (error) {
          return;
        }
      } else {
        this.setSelfProvidedStatus("0", false, tableRow);
      }

      this.select(drugRow, tableRow);
    },


    getTableData() {
      let {
        fullData,
        visibleData,
        tableData,
        footerData
      } = this.$refs.xTable.getTableData();
      return tableData;
    },

    async addRow(row) {
      if (!this.receivePatientData.hasOwnProperty("patientId")) {
        this.$message.warning("请选择患者!");
        return;
      }

      try {
        let result = await getDiagnose({
          inpCode: this.receivePatientData.treatNo,
          // diagType: 3,
          cwFlag: 1
        });
      } catch (error) {
        return;
      }

      let tableData = this.getTableData();
      if (isOnlyOneEdit(tableData, defaultAddStatusValue)) {
        this.$message.warning("当前有一条正在编辑的医嘱!");
        return;
      }
      let record = getAddRowOriginObj(this);
      console.log("开始时间", record, record.expectStartTime);
      // let { row: newRow } = await this.$refs.xTable.insertAt(record, -1);
      // let { row: newRow } = await this.$refs.xTable.insert(record);
      // await this.$refs.xTable.setActiveCell(newRow, "itemName");
      // this.$refs.xTable.setActiveRow(newRow)
      this.tableData.push(record);
      await this.$refs.xTable.setActiveRow(record);
      this.$refs.xTable.setCheckboxRow(record, true);
      // table 滚动到底
      setTableScrollBottom(this);
    },
    deleteHandler() {
      if (this.multipleSelection.length > 0) {
        //最少选中一项
        this.$confirm("删除后不可恢复，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let tableData = this.tableData;

            this.multipleSelection.forEach(item => {
              //删除用户新增的费数据
              if (item.row_id !== "" && item.row_id !== undefined) {
                // this.$refs.xTable.remove(item);
                tableData.splice(
                  tableData.findIndex(
                    innerItem => innerItem.row_id === item.row_id
                  ),
                  1
                );
              }
            });

            let serverList = this.multipleSelection.filter(item => {
              return item.id;
            });

            if (serverList.length > 0) {
              westAdviceDelete(
                serverList.map(item => {
                  return item.id;
                })
              )
                .then(res => {
                  if (res.code === 1) {
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                    this.fetchTableList();
                  } else {
                    this.$message({
                      type: "error",
                      message: res.msg || "删除失败"
                    });
                  }
                })
                .catch(() => {
                  this.$message({
                    type: "error",
                    message: "删除失败"
                  });
                });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message.warning("请选择后再删除！");
      }
    }
  },
  watch: {
    receivePatientData: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        this.wardsCode = val.wardId;
        this.fetchTableList(val);
      },
      deep: true
    },
    westPharmacyObject: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        this.selectDeptId = val.selected.deptId;
      },
      immediate: true,
      deep: true
    },
    "tableRuleForm.tableData": {
      //控制执行科室的禁用与赋值
      deep: true,
      handler(val) {
        // 没有数据，可选药房
        if (val.length == 0) {
          this.searchForm.pharmacyDisabled = false;
        } else {
          // 有数据 取数据项第一条的执行科室，
          this.searchForm.pharmacyDisabled = true;
          if (!val[0].row_id) {
            this.searchForm.pharmacyId = val[0].pharmacyId;
          }
        }
      }
    },
    "searchForm.type":{
      // 监听医嘱类型
      deep: true,
      handler(val) {
        console.log(this.searchForm.type);
          this.changeTreatId({
            treatId: this.searchForm.type
          });
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
@import "./adviceUtil/advice.scss";
</style>
