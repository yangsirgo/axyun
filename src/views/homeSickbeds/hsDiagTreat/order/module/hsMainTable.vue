/* eslint-disable consistent-return */
/* eslint-disable valid-jsdoc */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
<template>
  <div class="rightMedicalOrder overflow-hidden height100">
    <div class="overflow-hidden rightMedicalOrderInner height100">
      <div class="filter-box">
        <!-- <div ref="SearchForm" class="search-box"> -->
        <!-- <el-date-picker
            class="datePicker"
            v-model="searchForm.dateRange"
            style="float: left; width: 230px;"
            type="daterange"
            prefix-icon="iconfont iconriqi"
            :start-placeholder="$t('cis.medicalOrder.startDate')"
            :end-placeholder="$t('cis.medicalOrder.endDate')"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker> -->
        <!-- <el-select class="select-item" v-model="searchForm.status" placeholder="请选择">
            <el-option label="全部" value>全部</el-option>
            <el-option label="暂存" value="0">暂存</el-option>
            <el-option label="已提交" value="1">已提交</el-option>
            <el-option label="已停止" value="4">已停止</el-option>
            <el-option label="已作废" value="5">已作废</el-option>
            <el-option label="审核驳回" value="9">审核驳回</el-option>
            <el-option label="未执行" value="13">未执行</el-option>
            <el-option label="执行中" value="14">执行中</el-option>
            <el-option label="执行完毕" value="15">执行完毕</el-option>
          </el-select> -->
        <!-- <el-select class="select-item" v-model="searchForm.deptType" placeholder="请选择">
            <el-option label="本科医嘱" value="1">本科医嘱</el-option>
            <el-option label="其他科室医嘱" value="2">其他科室医嘱</el-option>
          </el-select> -->
        <!-- <el-select class="select-item" v-model="searchForm.today" placeholder="请选择">
            <el-option label="全部" value>全部</el-option>
            <el-option label="今日" value="1">今日</el-option>
          </el-select> -->
        <!-- <el-select class="select-item" v-model="searchForm.adviceType" placeholder="请选择">
            <el-option label="全部类型" value="1">全部类型</el-option>
            <el-option label="医嘱单" value="2">医嘱单</el-option>
            <el-option label="护理记录" value="3">护理记录</el-option>
            <el-option label="耗材单" value="4">耗材单</el-option>
          </el-select>-->
        <!-- <el-input
            class="select-item"
            style="width: 193px;"
            placeholder="医嘱关键字"
            suffix-icon="el-icon-search"
            v-model="searchForm.name"
          ></el-input> -->
        <!-- <el-button
            style="margin-left: 10px;float: left;margin-top: 15px;"
            @click="searchAdv"
            type="primary"
          >{{ $t("cis.btn.check") }}</el-button> -->
        <!-- </div> -->
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
            @click="temporarySave"
            v-hotKey="{ func: 'func_add2' }"
          >
            <i class="iconfont iconzancun"></i>
            {{$t('cis.btn.shortSave')}} (alt+x)
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
          <!-- 撤回 -->
          <!-- <span
            class="cursor-pointer chexiaoSpan"
            @click="adviceRecall"
            v-hotKey="{ func: 'func_cancel' }"
          >
            <i class="iconfont" style="text-align: right;margin-right: 5px">
              <svg
                style="width: 14px;vertical-align: -1px;height: 15px;text-align: right;"
                t="1573091979623"
                class="icon"
                viewBox="0 0 2389 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="20286"
                width="200"
                height="200"
              >
                <path
                  d="M409.6 409.6C620.088889 226.417778 893.155556 113.777778 1194.666667 113.777778c529.066667 0 976.213333 344.746667 1133.226666 821.475555L2059.377778 1024a910.449778 910.449778 0 0 0-864.711111-625.777778c-221.866667 0-424.391111 81.92-582.542223 213.902222L1024 1024H0V0l409.6 409.6z"
                  fill="#2E323A"
                  p-id="20287"
                />
              </svg>
            </i>
            撤回
          </span> -->

          <!-- <span class="cursor-pointer" @click="adviceStop" v-hotKey="{ func: 'func_stop' }">
            <i class="iconfont icontingzhi"></i>
            停止
          </span> -->
          <!-- <span class="cursor-pointer" @click="adviceaAllStop" v-hotKey="{ func: 'func_all_stop' }">
            <i class="iconfont iconquanbutingzhi"></i>
            全部停止
          </span> -->
          <!-- 撤销 -->
          <!-- <span
            class="cursor-pointer chexiaoSpan"
            @click="adviceRescind"
            v-hotKey="{ func: 'func_cancel' }"
          >
            <i class="iconfont" style="text-align: right;margin-right: 5px">
              <svg
                style="width: 14px;vertical-align: -1px;height: 15px;text-align: right;"
                t="1573091979623"
                class="icon"
                viewBox="0 0 2389 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="20286"
                width="200"
                height="200"
              >
                <path
                  d="M409.6 409.6C620.088889 226.417778 893.155556 113.777778 1194.666667 113.777778c529.066667 0 976.213333 344.746667 1133.226666 821.475555L2059.377778 1024a910.449778 910.449778 0 0 0-864.711111-625.777778c-221.866667 0-424.391111 81.92-582.542223 213.902222L1024 1024H0V0l409.6 409.6z"
                  fill="#2E323A"
                  p-id="20287"
                />
              </svg>
            </i>
            撤销
          </span> -->
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
          <el-button
            class="filter-item btn-text"
            type="text"
            icon="iconfont icondayin"
          >检查检验字典</el-button>
          <el-button
            class="filter-item btn-text"
            type="text"
            icon="iconfont icondayin"
          >复制医嘱</el-button>
          <el-button
            class="filter-item btn-text"
            type="text"
            icon="iconfont icondayin"
            @click="saveTpl"
          >存为模版</el-button>
          <el-button
            class="filter-item btn-text"
            type="text"
            @click="specialClick"
            icon="iconfont icondayin"
          >测试弹窗</el-button>
          <LFormtTitle
            label="药房"
            style="width: 240px"
            class="input-item"
            :disabled="searchForm.pharmacyDisabled"
          >
            <l-value-domain
              clearable
              :disabled="searchForm.pharmacyDisabled"
              remoteUrl="/hmm-stock/pharmacy/forPage"
              :value.sync="searchForm.pharmacyId"
              remoteShowKey="pharName"
              remoteValueKey="deptId"
              :remoteParams="{ 'pageSize': 20, 'pageNo': 1 }"
              placeholder="请选择药房"
            ></l-value-domain>
          </LFormtTitle>
          <!-- <span
            v-show="showShort"
            class="cursor-pointer"
            @click="adviceGonna"
            v-hotKey="{ func: 'func_garton_short' }"
          >
            <i class="iconfont iconjiadun"></i>
            加顿
          </span> -->
          <!-- <span
            class="cursor-pointer"
            @click="adviceCopyLong"
            v-hotKey="{ func: 'func_copy_long' }"
          >
            <i class="iconfont iconfuzhidaochangqi"></i>
            复制到长期
          </span> -->
          <!-- <span
            v-show="showShort"
            class="cursor-pointer"
            @click="adviceGonna"
            v-hotKey="{ func: 'func_garton_short' }"
          >
            <i class="iconfont iconjiadun"></i>
            加顿到临时
          </span>
          <span
            v-show="showLeave"
            class="cursor-pointer"
            @click="adviceGonnaLeave"
            v-hotKey="{ func: 'func_garton_short' }"
          >
            <i class="iconfont iconjiadun"></i>
            加顿到出院带药
          </span>
          <span class="cursor-pointer" @click="adviceCancel" v-hotKey="{ func: 'func_obsolete' }">
            <i class="iconfont iconzuofei"></i>
            作废
          </span>
          <b class="line"></b> -->
          <!-- <span class="cursor-pointer" @click="print" v-hotKey="{ func: 'func_print' }">
            <i class="iconfont icondayin"></i>
            {{ $t("cis.btn.print") }}
          </span> -->
        </div>
      </div>
      <div class="table-box">
        <el-form
          :model="tableRuleForm"
          :rules="tableRuleForm.tableRules"
          ref="mainTableRuleForm"
          label-width="0px"
          class="demo-ruleForm height100"
        >
          <el-table
            :data="tableRuleForm.tableData"
            ref="multipleTable"
            stripe
            large
            highlight-current-row
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            @select="selectRow"
            @row-click="selectItem"
            :row-class-name="rowStyleCls"
            border
            v-loading="mainTableLoading"
            v-hotKey="{
            func: ['table_row', 'table_checkbox'],
            deClass: 'el-table__row',
            curClass: 'current-row'
            }"
            height="100%"
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              :selectable="isCheckDisabled"
              align="center"
              :fixed="true"
              width="32"
            ></el-table-column>
            <el-table-column
              label="序号"
              :fixed="true"
              align="center"
              type="index"
              width="45"
            ></el-table-column>
            <el-table-column
              label="状态"
              :fixed="true"
              align="center"
              show-overflow-tooltip
              min-width="55"
            >
              <template slot-scope="scope">
                <span
                  :val="scope.row.status"
                  code="adviceStatus"
                  v-codeTransform
                ></span>
              </template>
            </el-table-column>
            <el-table-column
              label="属性"
              align="center"
              prop="type"
              show-overflow-tooltip
              min-width="60"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.type | filterProperty }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="开始时间"
              align="center"
              prop="expectStartTime"
              show-overflow-tooltip
              min-width="180"
            >
              <template slot-scope="scope">
                <el-form-item
                  label
                  :prop="'tableData.' + scope.$index + '.expectStartTime'"
                  :rules="tableRuleForm.tableRules.expectStartTime"
                >
                  <div>
                    <el-date-picker
                      :clearable="false"
                      ref="adviceTimePicker"
                      :data-id="'adviceTimePicker' + scope.row.row_id"
                      v-model="scope.row.expectStartTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请输入开始时间"
                      style="width:100%;"
                      @change="adviceTimeChange(scope.row)"
                    >
                    </el-date-picker>
                  </div>
                </el-form-item>
                <!-- <div v-else>{{scope.row.expectStartTime}}</div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="医嘱名称"
              align="center"
              min-width="220"
              :fixed="true"
            >
              <template slot-scope="scope">
                <el-form-item
                  v-if="scope.row.row_id"
                  label
                  :prop="'tableData.' + scope.$index + '.itemName'"
                  :rules="tableRuleForm.tableRules.itemName"
                >
                  <l-shotcut-input
                    v-axShotcut
                    ref="lInputTable"
                    v-selectInner
                    v-focus
                    component="LInputTable"
                    :shotindex="shotcutIndexHandler(scope, 'itemName')"
                    :shotready="shotreadyHandler(scope, 'itemName')"
                    :data-id="'lInputTable' + scope.row.row_id"
                    :popoverWidth="1200"
                    :tableData="selectDrop.selectOptions"
                    @query="searchLike"
                    v-model="scope.row.itemName"
                    @select="selectWrapper"
                    :tableLoading="searchResLoading"
                    suffix-icon="el-icon-search"
                    :tableParams="selectDrop.dropColumn"
                    placeholder="请输入项目名称关键字"
                    valueKey="name"
                  />
                </el-form-item>
                <div v-else>{{ scope.row.itemName }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="规格"
              prop="spec"
              align="center"
              show-overflow-tooltip
              min-width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.spec || "--" }}
              </template>

            </el-table-column>

            <el-table-column
              label="单次剂量"
              align="center"
              show-overflow-tooltip
              min-width="90"
            >
              <template slot-scope="scope">
                <el-form-item
                  label
                  :prop="'tableData.' + scope.$index + '.onceDosage'"
                  :rules="tableRuleForm.tableRules.onceDosage"
                >
                  <div>

                    <l-shotcut-input
                      ref="onceDosage"
                      component="el-input-number"
                      v-axShotcut
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
                      @change="onceDosageHandle"
                      :min='0'
                    ></l-shotcut-input>
                  </div>
                </el-form-item>
                <!-- <div v-else>{{ scope.row.onceDosage }}</div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="剂量单位"
              prop="dosageUnit"
              align="center"
              show-overflow-tooltip
              min-width="90"
            >
              <template slot-scope="scope">
                <span
                  :val="scope.row.dosageUnit"
                  code="DrugDoseUnit"
                  v-codeTransform
                ></span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="关联"
              align="center"
              min-width="40"
            >
              <template>
                <el-form-item
                  :prop="'tableData.' + scope.$index + '.relation'"
                  :rules="tableRuleForm.tableRules.relation"
                >
                  <el-input-number
                    :data-id="'relation' + scope.row.row_id"
                    v-model.number="scope.row.relation"
                    :min="0"
                    style="width: 100%;"
                    step-strictly
                    :controls="false"
                    @blur="blurRelateAdvice"
                  ></el-input-number>
                </el-form-item>
              </template>
            </el-table-column> -->
            <el-table-column
              label="组"
              align="center"
              min-width="40"
            >
              <template slot-scope="scope">
                <span :class="scope.row.groupNoCls"></span>
              </template>
            </el-table-column>
            <el-table-column
              label="用法"
              align="center"
              prop="useWay"
              show-overflow-tooltip
              min-width="120"
            >
              <template slot-scope="scope">
                <el-form-item
                  label
                  :prop="'tableData.' + scope.$index + '.useWay'"
                  :rules="tableRuleForm.tableRules.useWay"
                >
                  <div>
                    <l-shotcut-input
                      v-axShotcut
                      :data-id="'useWay' + scope.row.row_id"
                      component="l-value-domain"
                      :shotindex="shotcutIndexHandler(scope, 'useWay')"
                      :shotready="shotreadyHandler(scope, 'useWay')"
                      code="MedicationRouteCode"
                      remoteShowKey="name"
                      :remoteParams="remoteParams"
                      remoteValueKey="code"
                      @change="handleUseWay(scope.row, arguments)"
                      :value.sync="scope.row.useWay"
                      placeholder=""
                    />
                  </div>
                </el-form-item>
                <!-- <div v-else>
                  <span
                    :val="scope.row.useWay"
                    code="MedicationRouteCode"
                    v-codeTransform
                  ></span>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="频次"
              align="center"
              show-overflow-tooltip
              min-width="140"
            >
              <template slot-scope="scope">

                <div>
                  <el-form-item
                    label
                    :prop="'tableData.' + scope.$index + '.freqCode'"
                    :rules="tableRuleForm.tableRules.freqCode"
                  >
                    <l-shotcut-input
                      v-axShotcut
                      :data-id="'freqCode' + scope.row.row_id"
                      :shotindex="shotcutIndexHandler(scope, 'freqCode')"
                      component="l-value-domain"
                      :shotready="shotreadyHandler(scope, 'freqCode')"
                      :disabled="isFrequencyDisabled"
                      remoteUrl="/frequency/pageList"
                      :remoteParams="remoteParams"
                      :value.sync="scope.row.freqCode"
                      placeholder=""
                      remoteShowKey="frequencyName"
                      remoteValueKey="frequencyCode"
                      clearable
                      @change="((value, item) => {handleFreq(value, item, scope.row)})"
                    />
                  </el-form-item>
                </div>

                <!-- <div v-else>
                  <span
                    columns="FREQUENCY_NAME"
                    :conditionMap="{ FREQUENCY_CODE: scope.row.freqCode }"
                    tableName="hrp_frequency"
                    v-tableTransform
                  ></span>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="首日次数"
              align="center"
              show-overflow-tooltip
              min-width="90"
            >
              <template slot-scope="scope">
                <div v-if="searchForm.type == '1'">
                  <l-shotcut-input
                    v-axShotcut
                    v-selectInner
                    :data-id="'firstDayUse' + scope.row.row_id"
                    :shotindex="shotcutIndexHandler(scope, 'firstDayUse')"
                    :shotready="shotreadyHandler(scope, 'firstDayUse')"
                    component="el-input-number"
                    :controls="false"
                    style="width: 100%;"
                    v-model="scope.row.firstDayUse"
                    controls-position="right"
                    :min='0'
                    :max="freq.frequencyTimes || 1000"
                  />
                </div>
                <div v-else>{{ scope.row.firstDayUse }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="用药天数"
              align="center"
              prop="useDay"
              show-overflow-tooltip
              min-width="90"
            >
              <template slot-scope="scope">
                <el-form-item
                  label
                  :prop="'tableData.' + scope.$index + '.useDay'"
                  :rules="tableRuleForm.tableRules.useDay"
                >
                  <div>
                    <l-shotcut-input
                      v-axShotcut
                      v-selectInner
                      :disabled="searchForm.type == '2'"
                      :shotindex="shotcutIndexHandler(scope, 'useDay')"
                      component="el-input-number"
                      :shotready="shotreadyHandler(scope, 'useDay')"
                      @ended.native="shotcutEndHandler(scope, 'useDay')"
                      :controls="false"
                      style="width: 100%;"
                      v-model="scope.row.useDay"
                      controls-position="right"
                      step-strictly
                      :min='0'
                      @change="useDayChangeHandler"
                    />
                  </div>
                </el-form-item>
                <!-- <div v-else>{{ scope.row.useDay }}</div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="预停时间"
              align="center"
              prop="expectStopTime"
              show-overflow-tooltip
              min-width="180"
            >
              <template slot-scope="scope">
                {{ scope.row.expectStopTime || "--" }}
              </template>
            </el-table-column>
            <el-table-column
              label="单价"
              align="center"
              prop="price"
              show-overflow-tooltip
              min-width="100"
            >
              <template slot-scope="scope">
                <span>
                  {{ scope.row.price | roundingPrice }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="数量"
              align="center"
              prop="quantity"
              show-overflow-tooltip
              min-width="100"
            >
              <template slot-scope="scope">
                <el-form-item
                  label
                  :prop="'tableData.' + scope.$index + '.quantity'"
                  :rules="tableRuleForm.tableRules.quantity"
                  :required="quantityIsHaveTo"
                >
                  <div>
                    <l-shotcut-input
                      component="el-input-number"
                      :disabled="searchForm.type == '1'"
                      v-selectInner
                      v-axShotcut
                      :data-id="'quantity' + scope.row.row_id"
                      :shotindex="shotcutIndexHandler(scope, 'quantity')"
                      :shotready="shotreadyHandler(scope, 'quantity')"
                      @ended.native="shotcutEndHandler(scope, 'quantity')"
                      :controls="false"
                      style="width: 100%;"
                      v-model="scope.row.quantity"
                      controls-position="right"
                      :min='0'
                      step-strictly
                      @change="computeAmt"
                    />
                  </div>
                </el-form-item>
                <!-- <div v-else>{{ scope.row.quantity }}</div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="单位"
              align="center"
              prop="unit"
              min-width="100"
            >
              <template slot-scope="scope">
                <el-form-item
                  label
                  :prop="'tableData.' + scope.$index + '.unit'"
                  :rules="tableRuleForm.tableRules.unit"
                >
                  <l-shotcut-input
                    component="el-select"
                    :shotindex="scope.$index + '8'"
                    :shotready="shotreadyHandler(scope, 'unit')"
                    v-model="scope.row.unit"
                    placeholder="单位"
                    :disabled="scope.row.unitDisabled"
                    @change="unitChange($event, scope.row)"
                  >
                    <el-option
                      v-for="(item, index) in scope.row.unitOptions"
                      :label="item.label"
                      :key="index"
                      :value="item.value"
                    ></el-option>
                  </l-shotcut-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              align="center"
              show-overflow-tooltip
              min-width="150"
            >
              <template slot-scope="scope">
                <l-shotcut-input
                  component="el-input"
                  :shotindex="scope.$index + '9'"
                  :shotready="shotreadyHandler(scope, 'remark')"
                  v-model="scope.row.remark"
                />
                <!-- <div v-else>{{ scope.row.remark }}</div> -->
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="皮试"
              align="center"
              prop="skinTest"
              min-width="80"
            >
              <template slot-scope="scope">
                <el-checkbox
                  true-label='1'
                  false-label='0'
                  v-model="scope.row.skinTest"
                  @keyup.enter.native="scope.row.skinTest = !scope.row.skinTest"
                  @change="changeSkinTest"
                  :disabled="!scope.row.skinTestDisabled"
                ></el-checkbox>
              </template>
            </el-table-column> -->
            <el-table-column
              label="皮试备注"
              align="center"
              prop="stSolutionType"
              show-overflow-tooltip
              min-width="150"
            >
              <template slot-scope="scope">
                <div>
                  <l-shotcut-input
                    component="l-value-domain"
                    :shotindex="scope.$index + '9.1'"
                    :shotready="shotreadyHandler(scope, 'stSolutionType')"
                    :controls="false"
                    code="SkinTestWay"
                    :value.sync="scope.row.stSolutionType"
                    placeholder="皮试液类型"
                    remoteShowKey="name"
                    remoteValueKey="code"
                  />
                </div>
                <!-- <div v-else>
                  <span
                    :val="scope.row.stSolutionType"
                    code="SkinTestWay"
                    v-codeTransform
                  ></span>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column
              label="自备药"
              align="center"
              prop="selfProvided"
              show-overflow-tooltip
              min-width="60"
            >
              <template slot-scope="scope">
                <el-checkbox
                  :true-label='1'
                  :false-label='0'
                  :disabled="scope.row.selfProvidedDisabled"
                  v-model="scope.row.selfProvided"
                  @keyup.enter.native="scope.row.selfProvided = !scope.row.selfProvided"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              label="紧急"
              align="center"
              prop="urgent"
              show-overflow-tooltip
              min-width="60"
            >
              <template slot-scope="scope">
                <el-checkbox
                  :true-label='1'
                  :false-label='0'
                  v-model="scope.row.urgent"
                  @keyup.enter.native="scope.row.urgent = !scope.row.urgent"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              label="接收科室"
              align="center"
              prop="execDept"
              show-overflow-tooltip
              min-width="100"
            >
              <template slot-scope="scope">
                <span
                  tableName="sys_org"
                  :conditionMap="{
                      org_type: '_DEPT_',
                      id: scope.row.execDept
                    }"
                  columns="org_nm"
                  v-tableTransform
                >--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="特殊说明"
              align="center"
              show-overflow-tooltip
              min-width="150"
            >
              <template slot-scope="scope">
                <l-shotcut-input
                  component="l-value-domain"
                  :shotindex="scope.$index + '9.2'"
                  :shotready="shotreadyHandler(scope, 'specialNote')"
                  :controls="false"
                  code="adviceSpecialNote"
                  remoteShowKey="name"
                  remoteValueKey="code"
                  :value.sync="scope.row.specialNote"
                  placeholder=""
                />
              </template>
            </el-table-column>
            <el-table-column
              label="是否自费"
              align="center"
              prop="selfPay"
              show-overflow-tooltip
              min-width="60"
            >
              <template slot-scope="scope">
                <el-checkbox
                  :true-label='1'
                  :false-label='0'
                  v-model="scope.row.selfPay"
                  @keyup.enter.native="scope.row.selfPay = !scope.row.selfPay"
                ></el-checkbox>
              </template>
            </el-table-column>

            <!-- <el-table-column
              label="滴速(滴/分)"
              align="center"
              prop="dropRate"
              show-overflow-tooltip
              min-width="210"
            >
              <template slot-scope="scope">

                <el-input-number
                  class="ds-input"
                  size="medium"
                  :disabled="scope.row.showFlowRate||scope.row.isNew!=true"
                  v-model="scope.row.dropRate1"
                  step-strictly
                  :controls="false"
                  :min='-0.5'
                ></el-input-number>～
                <el-input-number
                  class="ds-input"
                  size="medium"
                  :disabled="scope.row.showFlowRate||scope.row.isNew!=true"
                  v-model="scope.row.dropRate2"
                  step-strictly
                  :controls="false"
                  :min='-0.5'
                ></el-input-number>
                <span class="ds-unit"></span>
              </template>
            </el-table-column> -->
            <!-- <el-table-column
            label="滴速"
            prop="dropRate"
            show-overflow-tooltip
            min-width="80"
            ></el-table-column>
            <el-table-column
            label="滴速单位"
            prop="dropRateUnit"
            show-overflow-tooltip
            min-width="100"
            ></el-table-column> -->
            <!-- <el-table-column
            label="备注"
            prop="remark"
            show-overflow-tooltip
            min-width="150"
            >
                <template slot-scope="scope">
                  
                  <el-input v-if="scope.row.isNew" v-model="scope.row.remark"></el-input>
                  <div v-else>{{ scope.row.remark }}</div>
                </template>
            </el-table-column> -->
            <el-table-column
              label="金额"
              align="center"
              show-overflow-tooltip
              min-width="80"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.amt | roundingAmt }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="开嘱科室"
              align="center"
              prop="deptId"
              show-overflow-tooltip
              min-width="100"
            >
              <template slot-scope="scope">
                <span
                  tableName="sys_org"
                  :conditionMap="{
                    org_type: '_DEPT_',
                    id: scope.row.deptId
                }"
                  columns="org_nm"
                  v-tableTransform
                ></span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="开嘱人"
              align="center"
              prop="doctorName"
              show-overflow-tooltip
              min-width="100"
            ></el-table-column> -->

            <!-- <el-table-column
            label="常规时间"
            prop="normalDate"
            show-overflow-tooltip
            min-width="150"
            >
            </el-table-column>
            <el-table-column
            label="开嘱人"
            prop="doctorName"
            show-overflow-tooltip
            min-width="80"
            ></el-table-column>
            <el-table-column
            label="开嘱科室"
            prop="deptId"
            show-overflow-tooltip
            min-width="80"
            >
            <template slot-scope="scope">
                <span
                tableName="sys_org"
                :conditionMap="{
                    org_type: '_DEPT_',
                    id: scope.row.deptCode
                }"
                columns="org_nm"
                v-tableTransform
                ></span>
            </template>
            </el-table-column>
            <el-table-column
            label="停嘱时间"
            prop="stopDoctorTime"
            show-overflow-tooltip
            min-width="150"
            >
            <template slot-scope="scope">
            <div v-if="scope.row.isEditingNum">
            <el-date-picker
            v-model="scope.row.stopDoctorTime"
            type="date"
            placeholder=""
            style="width:100%;"
            >
            </el-date-picker>
            </div>
            <div v-else>{{scope.row.stopDoctorTime}}</div>
            </template>
            </el-table-column>
            <el-table-column
            label="执行科室"
            show-overflow-tooltip
            min-width="100"
            >
            <template slot-scope="scope">
                <span
                tableName="sys_org"
                :conditionMap="{
                    org_type: '_DEPT_',
                    id: scope.row.deptCode
                }"
                columns="org_nm"
                v-tableTransform
                ></span>
            </template>
            </el-table-column> -->
          </el-table>
        </el-form>
      </div>
    </div>
    <!-- <el-card class="height-bottom" :style="{ bottom: bottom + 'px' }">
        <div class="overflow-hidden padding20 advDetailBox">
            <el-table
            :data="advDetailList"
            @select="handlerSelectDetail"
            @select-all="handlerSelectDetailAll"
            v-loading="AdvListItemLoading"
            height="100%"
            border
            style="width: 100%"
            >
            <el-table-column type="selection" width="32"></el-table-column>
            <el-table-column
                prop="itemName"
                label="项目名称"
                width="380"
            ></el-table-column>
            <el-table-column
                prop="price"
                label="单价"
                width="180"
            ></el-table-column>
            <el-table-column prop="spec" label="规格"></el-table-column>
            <el-table-column label="数量">
                <template slot-scope="scope">
                <div v-if="!globalStatus">
                    <el-input-number
                    style="width: 100%;"
                    v-model="scope.row.quantity"
                    controls-position="right"
                    ></el-input-number>
                </div>
                <div v-else>{{ scope.row.quantity }}</div>
                </template>
            </el-table-column>
            </el-table>
        </div>
        <div class="padding20" style="padding-top: 0;">
            <el-button
            type="primary"
            @click="saveAdv"
            v-hotKey="{ func: 'func_add2', flag: 'isLoading' }"
            v-show="!globalStatus"
            class="button"
            >保存</el-button
            >
            <el-button @click="cancelAdv" class="button">取消</el-button>
        </div>
    </el-card> -->
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="specilDrugsVisible"
      :close-on-click-modal="false"
      width="498px"
      title="特殊药品使用登记"
    >
      <specialDrugsRegister></specialDrugsRegister>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="specilDrugsHandleOk1"
        >确 定</el-button>
        <el-button @click="specilDrugsHandleClose1">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="saveTplVisible"
      :close-on-click-modal="false"
      width="440px"
      title="存为模版"
    >
      <saveTemplate ref="saveTpl"></saveTemplate>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="saveTplsHandleOk1"
        >确 定</el-button>
        <el-button @click="saveTplVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="使用理由"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div style="padding: 20px;">
        <div style="margin: 20px;">
          <el-radio
            v-model="useReasons"
            @change="uChange"
            label="1"
          >预防</el-radio>
          <div style="margin-left: 50px;">
            <div style="margin: 20px;">
              <el-radio
                v-model="preventiveApplication"
                @change="pChange"
                label="1"
              >非手术预防性应用</el-radio>
            </div>
            <div style="margin: 20px;">
              <el-radio
                v-model="preventiveApplication"
                @change="pChange"
                label="2"
              >围手术期预防性应用</el-radio>
              <div style="margin-left: 50px;width:300px;display:flex;">
                <div style="width:120px;">
                  <div style="margin: 20px;">
                    <el-radio
                      v-model="incision"
                      @change="iChange"
                      label="1"
                    >Ⅰ类切口</el-radio>
                  </div>
                  <div style="margin: 20px;">
                    <el-radio
                      v-model="incision"
                      @change="iChange"
                      label="2"
                    >Ⅱ类切口</el-radio>
                  </div>
                  <div style="margin: 20px;">
                    <el-radio
                      v-model="incision"
                      @change="iChange"
                      label="3"
                    >Ⅲ类切口</el-radio>
                  </div>
                </div>
                <div style="border-right:1px solid #e4e4e4;height: 70px;margin-top: 30px;margin-left: 13px;">

                </div>
                <div style="width:120px;">
                  <div style="margin: 20px;">
                    <el-radio
                      v-model="operativeUse"
                      @change="iChange"
                      label="1"
                    >术前围术期使用</el-radio>
                  </div>
                  <div style="margin: 20px;">
                    <el-radio
                      v-model="operativeUse"
                      @change="iChange"
                      label="2"
                    >术中围术期使用</el-radio>
                  </div>
                  <div style="margin: 20px;">
                    <el-radio
                      v-model="operativeUse"
                      @change="iChange"
                      label="3"
                    >术后围术期使用</el-radio>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin: 20px;">
              <el-radio
                v-model="preventiveApplication"
                @change="pChange"
                label="3"
              >侵入性诊疗操作预防性应用</el-radio>
            </div>
          </div>
        </div>
        <div style="margin: 20px;">
          <el-radio
            v-model="useReasons"
            @change="uChange"
            label="2"
          >治疗</el-radio>
        </div>
        <div style="margin: 20px;">
          <el-radio
            v-model="useReasons"
            @change="uChange"
            label="3"
          >急诊用药</el-radio>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleGB">取 消</el-button>
        <el-button
          type="primary"
          @click="handleOK"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BottomForm from "./bottomForm";
import bottomModule from "./bottomModule";
import specialDrugsRegister from "./specialDrugsRegister.vue";
import saveTemplate from "./saveTemplate.vue";
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
import { hospDrugCalculatFunc } from "@/components/adviceCommon/drugCalculatFunc.js";

const DrugsRequiredItem_short = [
  {
    name: "itemName",
    label: "医嘱名称"
  },
  {
    name: "onceDosage",
    label: "单次剂量"
  },
  {
    name: "useWay",
    label: "用法"
  },
  {
    name: "freqCode",
    label: "频次"
  },
  {
    name: "firstDayUse",
    label: "首日次数"
  },
  {
    name: "quantity",
    label: "数量"
  }
];

const DrugsRequiredItem_long = [
  {
    name: "itemName",
    label: "医嘱名称"
  },
  {
    name: "onceDosage",
    label: "单次剂量"
  },
  {
    name: "useWay",
    label: "用法"
  },
  {
    name: "freqCode",
    label: "频次"
  },
  {
    name: "firstDayUse",
    label: "首日次数"
  },
  {
    name: "useDay",
    label: "用药天数"
  }
];
const defSelectedphar = "121"; // 默认门诊
export default {
  name: "medicalOrderMain",
  props: ["ids"],
  data() {
    return {
      remoteParams: {
        pageSize: 50,
        status: 1
      },
      saveTplVisible: false,
      specilDrugsVisible: false,
      // 药品的分页数据
      queryName: "",
      currentPage: 1,
      pageSize: 10,
      total: 1,
      wardsCode: "",
      drugItem: {}, //选中的药品
      useReasons: "0",
      preventiveApplication: "0",
      incision: "0",
      operativeUse: "0",
      // showFlowRate: true, //滴速输入框disable
      searchResLoading: false, // 模糊查询列表 loading
      mainTableLoading: false, // 医嘱列表 loading
      statusArr: {
        0: "暂存",
        1: "提交",
        2: "删除",
        3: "已审核",
        4: "停止",
        5: "作废",
        9: "打回",
        10: "审核停止",
        11: "审核停止通过",
        12: "审核停止打回",
        13: "未执行",
        14: "执行中",
        15: "执行完毕",
        16: "撤销"
      },
      // skinTestDisabled: true, //皮试勾选是否可选标识
      dialogVisible: false, // 抗菌药物 dialog
      isFrequencyDisabled: false, //频率 在 短期的情况下禁用

      activeName: "first",
      //  医嘱列表
      // tableList: [],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        }
      ],
      currentRow: null,
      // 选中的当前行的索引
      currentRowIndex: -1,
      isAdd: true, // 是否处于新增状态
      bottomFormHeight: "", // 底部form的高度
      bottom: "0", // 底部详情列表位置
      bottomHidden: false, // 底部详情列表显示隐藏
      showPrise: true,
      showShort: true,
      showLeave: true,
      //  查询条件
      searchForm: {
        pharmacyId: defSelectedphar,
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
      instillationList: {
        inpCode: "",
        patientName: "",
        bedCode: "",
        a: []
      },
      tableColumn: [],
      itemName: "",
      itemSpec: "",
      tableData: [],
      tableRuleForm: {
        tableData: [],
        tableRules: {
          expectStartTime: [
            {
              required: true,
              message: "请填写开始时间",
              trigger: ["change", "blur"]
            }
          ],
          expectStopTime: [
            {
              required: true,
              message: "请填写预停时间",
              trigger: ["change", "blur"]
            }
          ],
          // itemName: [
          //   { required: true, message: "请填写医嘱名称", trigger: "change" }
          // ],
          onceDosage: [
            {
              required: true,
              message: "请填写单次剂量",
              trigger: ["blur", "change"]
            },
            {
              pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
              message: "请输入正确的单次计量！"
            }
          ],
          freqCode: [
            {
              required: true,
              message: "请选择频次",
              trigger: ["blur", "change"]
            }
          ],
          useWay: [
            {
              required: true,
              message: "请选择用法",
              trigger: ["blur", "change"]
            }
          ],
          // useDay: [
          //   {
          //     required: true,
          //     message: "请输入用药天数",
          //     trigger: ["blur", "change"]
          //   },
          //   {
          //     pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
          //     message: "请输入正确的用药天数！"
          //   }
          // ],
          quantity: [
            // {
            //   required: true,
            //   message: "请输入用药天数",
            //   trigger: ["blur", "change"]
            // },
            // {
            //   pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
            //   message: "请输入正确的数量！"
            // }
          ],
          relation: []
        }
      },
      // 医嘱列表已选中
      selectedList: [],
      freq: {}, //选中的当前频次数据
      selectDrop: {
        // 输入药品名称显示的下拉table
        dropColumn: [
          {
            prop: "name",
            label: "医嘱名称",
            width: 200
          },
          {
            prop: "spec",
            label: "规格",
            width: 100
          },
          {
            prop: "stock",
            label: "医嘱子分类",
            width: 80
          },
          {
            prop: "price",
            label: "价格",
            width: 80
          },
          {
            prop: "dosageunit",
            label: "计价单位",
            width: 80,
            codeTransform: true,
            codeTransformCode: "DrugUnit"
          },
          {
            prop: "drugStock",
            label: "库存数",
            width: 80
          },
          {
            prop: "availableQuantity",
            label: "可用数量",
            width: 80
          },
          {
            prop: "stock",
            label: "商品名",
            width: 80
          },
          // {
          //   prop: "itemType",
          //   label: "医保类型",
          //   width: 70,
          //   tableTransformType: "cnf_doctors_advice",
          //   tableTransform: true
          // },
          {
            prop: "basicType",
            label: "基本药物",
            width: 70,
            codeTransform: true,
            codeTransformCode: "BasicDrugType"
          },
          {
            prop: "execDeptCode",
            label: "执行科室",
            width: 70,
            tableTransformType: "sys_org",
            tableTransform: true
          }
        ],
        selectOptions: [],
        unitOptions: []
      }
    };
  },
  components: {
    saveTemplate,
    specialDrugsRegister
  },
  filters: {
    roundingAmt(value) {
      value = isNaN(value) ? "0" : new Number(value);
      return new Number(value).rewToFixed(2);
    },
    roundingPrice(value) {
      value = isNaN(value) ? "0" : new Number(value);
      return new Number(value).rewToFixed(4);
    },
    filterProperty(value) {
      return value == 1 ? "长期" : "临时";
    }
  },
  directives: {
    //focus 当前input 框
    focus: {
      inserted(el, vDir, vNode) {
        let targetInput = el.querySelector(".el-input__inner");
        console.log(targetInput);
        targetInput.focus();
      }
    },
    //选中文本指令
    selectInner: {
      inserted(el, vDir, vNode) {
        // console.log(el);
        let targetInput = el.querySelector(".el-input__inner");
        // console.log("targetInput", targetInput);
        targetInput.addEventListener("focus", event => {
          // console.log(event, event.target);
          setTimeout(() => {
            event.target.select();
          }, 10);
        });
      }
    }
  },
  methods: {
    ...mapActions({
      changeCurrentRow: "cis/changeCurrentRow",
      changeDrugName: "order/changeDrugName"
    }),
    //设置 医嘱的长期 与 短期
    setAdviceType(type = 1) {
      console.log("type", type);
      this.searchForm.type = type;
      this.fetchTableList();
    },
    shotcutIndexHandler(scope, name) {
      let requiredList =
        this.searchForm.type == 1
          ? DrugsRequiredItem_long
          : DrugsRequiredItem_short;
      let index = requiredList.findIndex(item => {
        return item.name === name;
      });
      return String(scope.$index) + String(index + 1);
    },
    shotcutEndHandler: Throttle(async function(e) {
      try {
        let submitCurRowResult = await this.temporarySave();
        // console.log("submitCurRowResult", submitCurRowResult);
        if (submitCurRowResult) {
          this.addRow();
        }
      } catch (e) {
        console.error("temporarySave（暂存医嘱） 出错");
      }
    }, 3000),
    shotreadyHandler(scope, name) {
      let isRequiredName = DrugsRequiredItem_long.some(item => {
        return item.name === name;
      });
      if (isRequiredName) {
        // 必填校验
        // try {
        // console.log("校验开始-- ", 'tableData.' + scope.$index + '.expectStartTime');
        // await this.validateField('tableData.' + scope.$index + '.' + name); //必填校验项校验
        // console.log("校验结束-- ");

        // } catch (error) {
        //   return false;
        // }

        this.validateField("tableData." + scope.$index + "." + name); //必填校验项校验
        // console.log("scope.row[name]", name, scope.row[name]);
        if (!scope.row[name] && name !== "useDay") {
          //用药天数先不校验空
          // console.log(name, false);
          return false;
        }
        // console.log(name, true);
        return true;
      }
      // console.log(name, true);
      return true;
    },
    validateField(name) {
      // console.log("校验中--");
      // return new Promise((resolve, reject) => {
      this.$refs.mainTableRuleForm.validateField(name, error => {
        // console.log("error--", error);
        if (!error) {
          // resolve(true);
        } else {
          // reject(false);
          return false;
        }
      });
      // });
    },
    specilDrugsHandleOk1() {},
    specilDrugsHandleClose1() {
      this.specilDrugsVisible = false;
    },
    //保存模板确定事件
    saveTplsHandleOk1() {
      this.$nextTick(() => {
        this.$refs.saveTpl.submitForm("form");
      });
    },
    //保存模板
    saveTpl() {
      this.saveTplVisible = true;
    },
    //计算处方金额
    computeAmt() {
      this.$nextTick(() => {
        let curObj = this.tableRuleForm.tableData[this.currentRowIndex];
        let orderItem = { ...curObj, ...this.drugItem };
        let unit = curObj.unit;
        let qty = curObj.quantity;

        let price =
          typeof orderItem.price !== "undefined" ? orderItem.price : 0;
        let packQty = orderItem.pkgMeasure ? orderItem.pkgMeasure * 1 : 1;
        let amt = 0; // 金额
        let num = 0; // 预减库存

        // 先判断选中单位是否为包装单位，单位不同，计算规则不同
        if (unit === orderItem.pkgUnit) {
          amt = (price * 100 * qty) / 100; //计算金额
          num = packQty * qty;
        } else {
          amt = ((price * 100) / packQty / 100) * qty; //计算金额
          num = qty;
        }

        this.drugItem.amt = amt;
        let stockNum = 0;
        try {
          this.tableRuleForm.tableData[this.currentRowIndex].amt =
            Math.round(amt * 100) / 100;
        } catch (e) {}
        // this.computeDay();
        // this.updateTableData_list();
      });
    },
    uChange(label) {
      // console.log(label);
      if (label == "1") {
        this.preventiveApplication = "1";
        this.incision = "0";
        this.operativeUse = "0";
      } else {
        this.preventiveApplication = "0";
        this.incision = "0";
        this.operativeUse = "0";
      }
    },
    pChange(label) {
      console.log(label);
      this.useReasons = "1";
      if (label == "2") {
        // this.preventiveApplication = '1'
        this.incision = "1";
        this.operativeUse = "1";
      } else {
        // this.preventiveApplication = '0'
        this.incision = "0";
        this.operativeUse = "0";
      }
    },
    iChange(label) {
      console.log(label);
      this.useReasons = "1";
      this.preventiveApplication = "2";
      if (this.incision == "0") {
        this.incision = "1";
      }
      if (this.operativeUse == "0") {
        this.operativeUse = "1";
      }
    },
    // 抗菌药物dialog
    handleClose(done) {
      this.$confirm("还未选择使用理由，确认关闭？")
        .then(_ => {
          // 关闭时重置所有抗菌药品使用理由
          this.tableRuleForm.tableData.forEach(it => {
            if (it.isEditingNum) {
              // it.name = '';
              it.useReasons = "0";
              it.preventiveApplication = "0";
              it.incision = "0";
              it.operativeUse = "0";
              this.useReasons = "0";
              this.preventiveApplication = "0";
              this.incision = "0";
              this.operativeUse = "0";
            }
          });
          done();
        })
        .catch(_ => {});
    },
    handleGB() {
      this.$confirm("还未选择使用理由，确认关闭？")
        .then(_ => {
          // 关闭时重置所有抗菌药品使用理由
          this.tableRuleForm.tableData.forEach(it => {
            if (it.isEditingNum) {
              // it.name = '';
              it.useReasons = "0";
              it.preventiveApplication = "0";
              it.incision = "0";
              it.operativeUse = "0";
              this.useReasons = "0";
              this.preventiveApplication = "0";
              this.incision = "0";
              this.operativeUse = "0";
            }
          });
          this.dialogVisible = false;
        })
        .catch(_ => {});
    },
    handleQty() {
      this.$nextTick(() => {
        let qty = this.getQtyFunc();
        console.log("qty", qty);
        try {
          this.tableRuleForm.tableData[this.currentRowIndex].quantity = qty;
        } catch (e) {}
      });
    },
    // dismountable 拆零与单位的逻辑
    // 药品可拆零逻辑：
    //1. 单位可选，选项最大或者最小
    //2. 不可拆零，单位不可选，默认最小
    // 入参： dismountable 药品拆零
    // currentRow  当前的医嘱行
    dismountAbleRelatedUnit(drugItem = {}, currentRow = {}) {
      if (!drugItem.dismountable) {
        currentRow.unit = drugItem.pkgUnit;
      } else {
        currentRow.unit = drugItem.limitUnit;
      }

      console.log("currentRow.unit:::", currentRow.unit);
      console.log("unitDisabled:::", !drugItem.dismountable);
      this.$set(currentRow, "unitDisabled", !drugItem.dismountable);
    },
    // pkgUnit 包装单位
    // limitUnit 小单位
    // 当前单位
    getUnitFlag(pkgUnit, unit) {
      return unit == pkgUnit ? "0" : "1";
    },
    //设置 unitFlag
    unitFlagRelatedUnit(drugItem, currentRow = {}) {
      this.$set(
        currentRow,
        "unitFlag",
        this.getUnitFlag(drugItem.pkgUnit, currentRow.unit)
      );
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
    getQtyFunc() {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      let useDay = currentRow.useDay;
      let firstDayUse = currentRow.firstDayUse;
      let unitFlag = currentRow.unitFlag;
      let onceDosage = currentRow.onceDosage;
      let type = this.searchForm.type;
      let freq = Object.keys(this.freq).length > 0 ? this.freq : currentRow;
      //临时： 用药天数非必填 默认1 不让改
      //长期： 用药天数 不必须填，如果用药天数不写的，计算公式不执行, 数量是空 或者 0。
      if ((typeof useDay == "undefined" || useDay == 0) && type == 1) {
        return undefined;
      }
      // 长期计算公式 次数 = （天数 - 1）* 每日次数 + 首日次数
      // 临时计算公式 次数 = 每日次数  用药天数 是一天 首日次数是 0
      useDay = type == 1 ? useDay - 1 : 1;
      firstDayUse = type == 1 ? firstDayUse : 0;
      let result = hospDrugCalculatFunc(
        useDay,
        firstDayUse,
        freq.freqTimes,
        onceDosage,
        currentRow.dosageMeasure,
        currentRow.cutable,
        currentRow.pkgMeasure,
        unitFlag
      );
      console.log("result", result);
      return result;
    },
    /**
     * useDay 用药天数
     * firstDayUse 首日次数
     * freqObj 频次对象
     * onceDosage 一次计量
     * dosageMeasure 计量
     * currentItem 当前行的数据 包含规格 包装单位等
     * unitFlag  大单位0  小单位1
     */
    // eslint-disable-next-line complexity
    handleQtyUtil(
      useDay = 1,
      firstDayUse = 0,
      freqObj = {},
      onceDosage = 0,
      dosageMeasure = 1,
      currentItem = {},
      unitFlag = "0"
    ) {
      let qty = 0;
      let times = 1;

      //药品剂量值 不可为0
      if (dosageMeasure == 0) {
        this.$message.warning("药品的剂量值不可为0");
        return undefined;
      }

      if (freqObj.frequencyUnit === "天") {
        times = freqObj.frequencyTimes;
      } /*else if (freqObj.frequencyUnit === "周") {
        times = freqObj.frequencyTimes / 7;
      } else if (freqObj.frequencyUnit === "月") {
        times = freqObj.frequencyTimes / 30;
      }*/ else {
        times = 1;
      }
      // 一次剂量换算数量向上取整
      let onceQty = Math.ceil(onceDosage / dosageMeasure);
      // 判断药品是否可拆零
      if (
        currentItem.dismountable ||
        (currentItem.dismountable === undefined && currentItem.unit)
      ) {
        // 可拆零，天数*频次*单次剂量/规格
        qty = useDay * times * onceQty + firstDayUse * onceQty;
      } else {
        qty =
          (useDay * times * onceQty + firstDayUse * onceQty) /
          currentItem.pkgMeasure;
      }

      qty = isNaN(qty)
        ? 0
        : unitFlag === "0"
        ? qty
        : qty / currentItem.pkgMeasure;
      console.log("qty", qty);
      qty = Math.ceil(qty); //向上取整  可用天数字段
      return qty;
    },
    handleOK() {
      // this.useReasons
      // this.preventiveApplication
      // this.incision
      // this.operativeUse

      console.log(
        this.useReasons +
          this.preventiveApplication +
          this.incision +
          this.operativeUse
      );
      this.tableRuleForm.tableData.forEach(it => {
        if (it.isEditingNum) {
          it.useReasons = this.useReasons;
          it.preventiveApplication = this.preventiveApplication;
          it.incision = this.incision;
          it.operativeUse = this.operativeUse;
        }
      });

      this.dialogVisible = false;
      // 给本条信息赋值
    },
    // 选中频次处理方法
    handleFreq(value, item, row) {
      //频率 cycleUnit 统一成 frequencyUnit
      this.freq = {
        ...item,
        ...{
          frequencyUnit: item.cycleUnit
        }
      };
      console.log(this.freq);
      this.currentRow = row;
      this.currentRowIndex = row.trindex; // 设置当前行数据
      this.$refs.multipleTable.setCurrentRow(row);

      //currentRow 对 frequencyTimes  frequencyUnit 赋值 START
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      this.$set(currentRow, "freqTimes", item.frequencyTimes);
      this.$set(currentRow, "freqUnit", item.cycleUnit);
      this.$set(currentRow, "freqId", item.id);
      //currentRow 对 frequencyTimes  frequencyUnit 赋值 END

      //首日次数 在切换频次时候 需要重置  长期医嘱时
      this.searchForm.type == 1
        ? this.$set(currentRow, "firstDayUse", item.frequencyTimes)
        : this.$set(currentRow, "firstDayUse", null);

      this.handleQty();
    },
    onceDosageHandle(value) {
      if (!isNaN(value)) {
        this.handleQty();
      }
    },

    // 点击单项医嘱查看详情
    selectItem(row, column, event) {
      this.currentRowIndex = row.trindex;
      this.currentRow = row;
      if (row.isNew) {
        return;
      }
      // this.globalStatus = true;
      // fetchAdvDetail({
      //   adviceId: row.adviceId
      // })
      //   .then(res => {
      //     let { code, data, msg } = res;
      //     if (code == 1) {
      //       this.bottom = 0;
      //       this.advDetailList = data;
      //     } else {
      //       this.$message.error(msg);
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error("网络错误!");
      //   });
    },
    selectRow(list, row) {
      // 选择表格 成组全选
      console.log("selectRow-list", list);
      console.log("selectRow", row);
      // list.forEach(row => {
      // this.tableRuleForm.tableData.map(item => {
      //     if (
      //     row.majorNo === item.majorNo &&
      //     item._primary_id !== row._primary_id
      //     ) {
      //     setTimeout(() => {
      //         this.$refs.multipleTable.toggleRowSelection(item);
      //     }, 10);
      //     }
      // });
      // // });
      // this.selectedList = list;

      this.tableRuleForm.tableData.map(item => {
        if (row.majorNo === item.majorNo && item.adviceId !== row.adviceId) {
          setTimeout(() => {
            this.$refs.multipleTable.toggleRowSelection(item);
          }, 0);
        }
      });

      this.selectedList = list;
    },
    handleSelectionChange(val) {
      // 表格发生变化是
      this.selectedList = val;
      this.printList = val;
    },
    handleCurrentChange(row) {
      // 医嘱单项选中后更改医嘱详情
      // 请求单项详情
      // this.changePrescription(row.adviceId);
    },
    /*
     * 新增医嘱时,医嘱名称模糊查询
     */

    searchLike(keyWord) {
      if (this.searchResLoading) {
        return;
      }
      let pageNo = this.queryName === keyWord ? this.currentPage * 1 + 1 : 1;
      let data = {
        ...{
          pageNo: pageNo,
          pageSize: this.pageSize,
          key: keyWord,
          pharmacyId: this.searchForm.pharmacyId
        }
      };
      if (this.queryName !== keyWord) {
        this.selectDrop.selectOptions = [];
      }
      this.searchResLoading = true;
      getAdviceItem(data)
        .then(res => {
          let { code, data, msg } = res;
          if (code == 1) {
            let tableData =
              this.currentPage !== 0 ? this.selectDrop.selectOptions : [];
            //选中项目后，联动规格
            let itemName = "";
            let itemSpec = "";
            let index = 0;
            for (let i = 0; i < this.tableRuleForm.tableData.length; i++) {
              if (this.tableRuleForm.tableData[i].isEditingNum) {
                itemName = this.tableRuleForm.tableData[i].name;
                index = i;
              }
            }
            for (let i = 0; i < data.length; i++) {
              let itemData = data[i];
              if (itemData.name == itemName) {
                itemSpec = itemData.spec;
              }
              //PRICE四舍五入保留四位小数
              itemData.price = itemData.price.rewToFixed(4);
              tableData.push(itemData);
            }

            this.tableRuleForm.tableData[index].spec = itemSpec;

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
    //选择医嘱处理函数
    async selectWrapper(row) {
      try {
        await this.checkDupFunc(row);
      } catch (error) {
        return;
      }

      // 药品 且库存为0 提示用户 是否是开开具自备药
      // 确定开自备药，特殊备注选中自备药，并且禁用
      //取消开局自备药，提示用户该药品没有库存
      if (
        row.pharmacyId &&
        (row.availableQuantity == 0 ||
          typeof row.availableQuantity === "undefined")
      ) {
        try {
          await this.selfContMedFunc();
        } catch (error) {
          return;
        }
      } else {
        this.setSelfProvidedStatus("", false);
      }

      this.select(row);
    },
    // 设置特殊备注的 值 和 禁用
    // 参数 value 是值
    // isDisabled 是否禁用
    setSelfProvidedStatus(value, isDisabled) {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      // 选择其他药品 重置
      currentRow.specialNote = value;
      this.$set(currentRow, "selfProvidedDisabled", isDisabled);
    },

    //自备药弹窗
    selfContMedFunc(val) {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      return new Promise((resolve, reject) => {
        this.$confirm("是否开具自备药?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning"
        })
          .then(() => {
            //特殊备注中选中自备药
            this.setSelfProvidedStatus("1", true);
            resolve(true);
          })
          .catch(() => {
            this.$message.error("此药品的库存为空，请选择其他药品！");
            setTimeout(() => {
              this.clearRow();
              this.setLInputTableFocus();
            }, 500);
            this.setSelfProvidedStatus("", false);
            reject(false);
          });
      });
    },
    checkDupFunc(val) {
      // 判断是否添加相同医嘱
      let haveDup = this.tableRuleForm.tableData.find((item, index) => {
        return item.itemId === val.id && this.currentRowIndex != index; //当前行不做重复药品校验
      });
      return new Promise((resolve, reject) => {
        if (haveDup) {
          this.$confirm("已有相同医嘱, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            closeOnClickModal: false,
            type: "warning"
          })
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              setTimeout(() => {
                this.clearRow();
                this.setLInputTableFocus();
              }, 50);
              reject(false);
            });
        } else {
          resolve(true);
        }
      });
    },
    //清空药品搜索框
    clearLInputTable() {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      // refs 方式 如果有fixed列会失效，直接用操作DOM处理
      this.$nextTick(() => {
        let targetDataId = "lInputTable" + currentRow.row_id;
        let nodeList = getDataIdDom("div", "data-id", targetDataId);

        if (nodeList.length > 0) {
          nodeList.forEach(element => {
            element.getElementsByClassName("el-input__inner")[0].value = "";
          });
        }
      });
    },
    clearRow() {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      let originObj = this.getAddRowOriginObj();
      for (const key in originObj) {
        currentRow[key] = originObj[key];
      }
      this.clearLInputTable();
    },
    async select(v) {
      //药品的信息存储
      let drugItem = {
        ...v,
        ...{
          itemName: v.name,
          itemId: v.id
        }
      };

      this.drugItem = drugItem;
      console.log("this.drugItem", this.drugItem);
      console.log("v", v);
      // currentRow 赋值
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];

      // let extendData = {
      //   ...currentRow,
      //   ...{
      //     pharmacyId: v.pharmacyId,
      //     pharmacyName: v.pharmacyName || "先写一个",
      //     execDeptId: v.execDeptId,
      //     spec: v.spec,
      //     itemId: v.id,
      //     itemName: v.name,
      //     price: v.price,
      //     dosageUnit: v.dosageUnit,
      //     pkgUnit: v.pkgUnit,
      //     limitUnit: v.limitUnit,
      //     cutable: v.cutable,
      //     dosageMeasure: v.dosageMeasure
      //   }
      // };
      // this.$set(this.tableRuleForm.tableData, this.currentRowIndex, extendData);
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
      this.$set(currentRow, "dosageMeasure", v.dosageMeasure);

      // dismountable 拆零与单位的逻辑
      this.dismountAbleRelatedUnit(drugItem, currentRow);

      // 大小单位 与 unitFlag 的联系处理
      this.unitFlagRelatedUnit(drugItem, currentRow);

      try {
        let unitList = await this.getQtyUnitAjax(v);
        currentRow.unitOptions = unitList;
      } catch (error) {
        return;
      }

      //聚焦单次用量
      this.$nextTick(() => {
        this.setComponentFocusFunc(
          "onceDosage",
          this.tableRuleForm.tableData[this.currentRowIndex].row_id
        );
      });
    },
    // code 获取单位 中文
    async getQtyUnitAjax(data) {
      // 获取单位数据
      let param = [];
      let shows = [];
      let unitOptions = [];
      shows.push(data.pkgUnit);
      shows.push(data.limitUnit);
      param.push({ code: "DrugUnit", field: "code", shows: shows });
      this.mainTableLoading = true;
      return new Promise(async (resolve, reject) => {
        try {
          let rep = await getArrayList(param);
          if (rep.code === 1) {
            for (let i = 0; i < rep.data.DrugUnit.length; i++) {
              if (rep.data.DrugUnit[i].name) {
                unitOptions.push({
                  label: rep.data.DrugUnit[i].name,
                  value: rep.data.DrugUnit[i].code
                });
              }
            }
            this.mainTableLoading = false;
            resolve(unitOptions);
            // eslint-disable-next-line no-else-return
          } else {
            this.mainTableLoading = false;
            this.$message.error(
              rep.msg ? rep.msg : "获取药品单位有误，请确认无误后再选择！"
            );
            reject(false);
          }
        } catch (e) {
          this.mainTableLoading = false;
          this.$message.error("获取药品单位有误，请确认无误后再选择！");
          reject(false);
        }
      });
    },

    //计算 预停时间
    computerFutureTime() {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      let useDay = currentRow.useDay ? currentRow.useDay : 0;
      let expectStartTime = currentRow.expectStartTime
        ? currentRow.expectStartTime
        : new Date();
      console.log(useDay, expectStartTime);
      this.$nextTick(() => {
        let time = Number(useDay * 24 * 60 * 60 * 1000);
        let adviceTimeChuo = Number(+new Date(expectStartTime));
        console.log(time, adviceTimeChuo);
        currentRow.expectStopTime = new Date(adviceTimeChuo + time).format(
          "yyyy-MM-dd hh:mm:ss"
        );
      });
    },
    // 医嘱编辑操作按钮
    addRow() {
      // 新增
      // this.bottom = 0;
      if (this.isEditing) {
        return;
      }
      if (!this.receivePatientData.hasOwnProperty("patientId")) {
        this.$message.warning("请选择患者!");
        return;
      }
      this.globalStatus = false;
      let currentTime = new Date();
      let obj = this.getAddRowOriginObj();
      this.tableRuleForm.tableData.push(obj);
      this.currentRowIndex = this.tableRuleForm.tableData.length - 1;
      this.$refs.multipleTable.toggleRowSelection(obj, true);
      this.setFrequencyState();
      this.$nextTick(() => {
        //处方列表 定位到最底下 最左面
        let rpTable = this.$refs.multipleTable;
        rpTable.bodyWrapper.scrollTop = rpTable.bodyWrapper.scrollHeight;
        rpTable.bodyWrapper.scrollLeft = 0;
        this.$refs.multipleTable.setCurrentRow(
          this.tableRuleForm.tableData[this.tableRuleForm.tableData.length - 1]
        );
      });
    },
    setLInputTableFocus() {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      this.setComponentFocusFunc("lInputTable", currentRow.row_id);
    },
    //更改用药天数
    useDayChangeHandler() {
      //计算金额
      this.handleQty();
      //计算 预停时间
      this.computerFutureTime();
    },
    //设置元素聚焦
    setComponentFocusFunc(refName, targetId) {
      // let refs = this.$refs[refName] ? this.$refs[refName] : [];
      // let List = Array.isArray() ? refs : [refs];
      // console.log(refs, List, this.$refs);
      // List.forEach(item => {
      //   console.log(item.$el.getAttribute("data-id"));
      //   if (item.$el.getAttribute("data-id") == targetId) {
      //     setTimeout(() => {
      //       item.focus();
      //     }, 50);
      //   }
      // });
      // refs 方式 如果有fixed列会失效，直接用操作DOM处理
      this.$nextTick(() => {
        setTimeout(() => {
          let targetDataId = refName + targetId;
          let nodeList = getDataIdDom("div", "data-id", targetDataId);
          if (nodeList.length > 0) {
            nodeList.forEach(element => {
              if (getComputedStyle(element)["visibility"] === "visible") {
                element.getElementsByClassName("el-input__inner")[0].focus();
              }
            });
          }
        }, 100);
      });
    },
    // 医嘱类型 改变
    timeTypeChange(val) {
      this.tableRuleForm.tableData = [];
      this.fetchTableList(this.receivePatientData);
    },
    // 选中频次处理方法
    // handleFreq(row, item) {
    //   // console.info("====itt", Array.prototype.slice.call(arguments));
    //   // console.info("====freqCode", value, item);
    //   console.log("dsdsds:", item[1]);
    //   //this.selectDrop.ruleForm.normalDate = item.cycleTimePoint;
    //   // this.tableRuleForm.tableData.forEach(it=>{
    //   //     if(it.isEditingNum){
    //   //         console.log("dsdsds:",item);
    //   //         console.log("dsdsds--it:",it);
    //   row.normalDate = item[1].cycleTimePoint;
    //   row.cycleTimePoint = item[1].cycleTimePoint;
    //   row.cycleUnit = item[1].cycleUnit;
    //   item[1].freqCode = item[1].frequencyCode;
    //   // Object.assign(row, item[1]);
    //   this.getFirstDay(item[1], row);
    //   //     }
    //   // })
    // },
    //取消皮试勾选时
    changeSkinTest() {
      // console.info("=====skinTest", this.selectDrop.ruleForm.skinTest);
      let { patientId } = this.$store.state.base.receivePatientData; //获取患者信息
      let drugItem = this.drugItem;
      // 取消皮试且皮试药品类型为必须皮试
      if (!this.currentRow.skinTest && this.drugItem.stType === "1") {
        // 先判断皮试结果是否有效
        getEffectiveRecord({
          patientId: patientId,
          drugId: drugItem.orderItemId
        }).then(res => {
          if (res.code === 1) {
            if (res.data.length === 0 || res.data[0].registerResult !== "2") {
              // 无皮试结果要进行皮试
              this.currentRow.skinTest = true;
              this.$message.warning("该皮试药品暂无有效结果，必须进行皮试！");
            }
          } else {
            this.$message.error(res.msg ? res.msg : "获取数据失败");
          }
        });
      }
    },
    handleUseWay(row, item) {
      console.log("handleUseWay?{}}}}}}}}}}}}}}}}}}", item);
      console.log("handleUseWay------------------", row);
      if (item[1].name.indexOf("滴注") !== -1 || item[1].code === "404") {
        row.showFlowRate = false;
      } else {
        row.showFlowRate = true;

        this.selectedList.forEach(item => {
          if (item.isNew == true) {
            // 数据清空
            item.dropRate = "";
            item.dropRate1 = "";
            item.dropRate2 = "";
          }
        });
      }
    },
    // handleUseWay(value, item) {
    //   let form = this.selectDrop.ruleForm;
    //   if (item.name.indexOf("滴注") !== -1 || item.code === "404") {
    //     this.showFlowRate = false;
    //   } else {
    //     this.showFlowRate = true;

    //     this.selectedList.forEach(item => {
    //       if(item.isNew == true){
    //         // 数据清空
    //         item.dropRate = "";
    //         item.dropRate1 = "";
    //         item.dropRate2 = "";
    //       }
    //     });
    //   }
    // },
    specialClick() {
      this.specilDrugsVisible = true;
    },
    // 首日次数
    getFirstDay(item, it) {
      console.log("it", it);
      console.log("item", item);
      console.log("it.expectStartTime", it.expectStartTime);
      if (it && it.expectStartTime) {
        getWestAdviceFirstDayCount({
          frequencyCode: item.freqCode,
          expectStartTime: it.expectStartTime,
          cycleUnit: item.cycleUnit,
          cycleTimePoint: item.cycleTimePoint
        })
          .then(res => {
            if (res.code === 1) {
              console.log(res.data, "res.data");
              let firstDayUse = res.hasOwnProperty("data") ? res.data : "";

              it.firstDayUse = firstDayUse;

              console.log(firstDayUse, "firstDayUse");
            }
          })
          .catch(err => {});
      }
    },
    //处理 row 的样式
    rowStyleCls(a) {
      a.row.trindex = a.rowIndex;
      return {
        rowStyleCls: true
      };
    },
    adviceTimeChange(row) {
      console.log("row---?", row);
      if (row.freqCode && row.freqCode != "") {
        console.log("row???", row);
        this.getFirstDay(row, row);
      }
      //计算 预停时间
      this.computerFutureTime();
    },
    // 频率的状态
    setFrequencyState() {
      if (this.searchForm.type === 2) {
        //频率 在 短期的情况下禁用
        this.tableRuleForm.tableData.forEach(it => {
          if (it.isEditingNum) {
            it.freqCode = "st";
            it.frequencyCode = "st";
            it.frequencyId = 17;
            it.frequencyName = "立即";
            this.isFrequencyDisabled = true;
            // this.getFirstDay();
          }
        });
        // this.selectDrop.ruleForm.freqCode = "st";
        // this.isFrequencyDisabled = true;
      } else {
        // this.tableRuleForm.tableData.forEach(it=>{
        //     if(it.isEditingNum ){
        //         it.freqCode= "st";
        //         this.isFrequencyDisabled = true;
        //     }
        // })
        // this.selectDrop.ruleForm.freqCode = this.row && this.row.freqCode;
        this.isFrequencyDisabled = false;
      }
    },
    getLabel(optList, key) {
      let obj = optList.find(item => {
        return item.value === key;
      });
      return obj.label;
    },
    getDosageUnitAjax(data) {
      // if(this.radioValue !== 3) return;// 长期 临时 不需要请求药品单位
      this.selectDrop.unitOptions = [];
      // 获取单位数据
      let param = [];
      let shows = [];
      shows.push(data.pkgUnit);
      // 判断药品是否可拆零
      if (data.dismountable || (data.dismountable === undefined && data.unit)) {
        shows.push(data.unit);
      }
      // debugger
      param.push({ code: "DrugUnit", field: "code", shows: shows });
      getArrayList(param)
        .then(rep => {
          if (rep.code === 1) {
            for (let i = 0; i < rep.data.DrugUnit.length; i++) {
              if (rep.data.DrugUnit[i].name) {
                this.selectDrop.unitOptions.push({
                  label: rep.data.DrugUnit[i].name,
                  value: rep.data.DrugUnit[i].code
                });
              }
            }
          }
        })
        .catch(_ => {
          this.$message.error(
            error.msg ? error.msg : "获取药品单位有误，请确认无误后再选择！"
          );
        });
    },
    // 数量 后面的单位改变
    unitChange(value, row) {
      // this.currentRow.unit = this.getLabel(this.currentRow.unitOptions, value);
      let currentRow = row;
      this.currentRow = row;
      this.currentRowIndex = row.trindex; // 设置当前行数据
      this.$refs.multipleTable.setCurrentRow(row);

      // 设置医生选择单位标识 0-小包装单位  1-大包装单位
      this.unitFlagRelatedUnit(currentRow, currentRow);

      row.quantity = row.qty = this.getQtyFunc();
      this.computeAmt();
    },
    bottomFormSave() {
      // 此处写 table的ajax 方法 刷新页面
      this.fetchTableList();

      console.log("刷新页面");
    },
    // 查询医嘱按钮
    searchAdv() {
      this.fetchTableList();
    },
    // 医嘱编辑操作按钮
    //   add() {
    //     // 新增
    //     // 用户没有选择 患者提示
    //     if (!this.receivePatientData.patientId) {
    //       this.$message.error("请选择患者！");
    //       return;
    //     }
    //     this.$refs.bottomForm && this.$refs.bottomForm.hollow();
    //     document
    //       .getElementById("bottomFormInputTable")
    //       .getElementsByClassName("el-input__inner")[0]
    //       .focus();
    //   },
    //验证table 表单
    mainFormValidate() {
      return new Promise((resolve, reject) => {
        this.$refs["mainTableRuleForm"].validate((valid, error) => {
          if (valid) {
            resolve(true);
          } else {
            // //聚焦错误 表单
            let requiredList =
              this.searchForm.type == 1
                ? DrugsRequiredItem_long
                : DrugsRequiredItem_short;
            let errorKeys = Object.keys(error);
            for (let i = 0; i < requiredList.length; i++) {
              const requiredItem = requiredList[i];
              if (
                errorKeys.some(item => {
                  return item.indexOf(requiredItem.name) > -1;
                })
              ) {
                let currentRow = this.tableRuleForm.tableData[
                  this.currentRowIndex
                ];
                this.setComponentFocusFunc(
                  requiredItem.name,
                  currentRow.row_id
                );
                break;
              }
            }

            reject("mainFormValidate表单出错!");
          }
        });
      });
    },
    async temporarySave() {
      if (this.mainTableLoading) return false;

      if (this.selectedList.length !== 1) {
        this.$message.warning("请选择一条医嘱暂存！");
        return false;
      }

      //验证table 表单
      try {
        await this.mainFormValidate();
      } catch (error) {
        this.mainTableLoading = false;
        return false;
      }

      // 暂存
      let selectedData = { ...this.selectedList[0] };
      selectedData.treatId = this.receivePatientData.id;

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
              this.freq = {};
              this.drugItem = {};
              this.mainTableLoading = false;
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
    submitSave() {
      // 提交
      // if (this.validate()) {
      // let data = JSON.parse(JSON.stringify(this.selectedList));
      // data.forEach(item => {
      //   // item.adviceType = item.adviceType;
      //   item.code = item.itemId;
      //   item.status = "1";
      //   item.receiveDept = item.execDeptCode;
      //   // item.expectStartTime = item.beginTime;
      //   item.type = this.searchForm.type;
      //   item.bedNo = this.receivePatientData.bedCode;
      //   item.inpCode = this.receivePatientData.inpCode;
      //   item.patientId = this.receivePatientData.patientId;
      //   item.originId = 0; //0:医生,1:护士
      //   item.dropRate = item.dropRate1 + "~" + item.dropRate2;
      // });

      // // 滴速
      // if (this.showFlowRate==false) {
      //   if (
      //     typeof data.dropRate1 === "undefined" ||
      //     typeof data.dropRate2 === "undefined" ||
      //     data.dropRate2 < data.dropRate1
      //   ) {
      //     this.$message.warning("滴速填写错误！");
      //     return false;
      //   } else {
      //     // data.dropRate = data.dropRate1 + "~" + data.dropRate2;
      //   }
      // }
      // adviceType

      // 判断有医嘱
      // if (data.name) {
      //   console.log('data.name',data.name)
      // } else {
      //   this.$message.warning("医嘱名称不能为空！");
      //   return false;
      // }

      // // 判断用法
      // if (data.useWay) {
      //   console.log('data.useWay',data.useWay)
      // } else {
      //   this.$message.warning("用法不能为空！");
      //   return false;
      // }

      // // 判断频次
      // if (data.freqCode) {
      //   console.log('data.freqCode',data.freqCode)
      // } else {
      //   this.$message.warning("频次不能为空！");
      //   return false;
      // }
      // // 判断开始时间
      // if (data.expectStartTime) {
      //   console.log('data.expectStartTime',data.expectStartTime)
      // } else {
      //   this.$message.warning("开始时间不能为空！");
      //   return false;
      // }

      this.mainTableLoading = true;
      let data = {};
      data.treatNo = this.receivePatientData.id;
      data.type = this.searchForm.type;
      // data.treatNo = "d1489aac141848ef9a569484faf69b83";
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
    backSpace() {
      // 撤销
    },
    deleteHandler() {
      let tableData = this.tableData;
      if (this.selectedList.length > 0) {
        //最少选中一项
        this.$confirm("删除后不可恢复，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let tableData = this.tableRuleForm.tableData;
            this.selectedList.forEach(item => {
              //删除用户新增的费数据
              if (item.row_id !== "" && item.row_id !== undefined) {
                tableData.splice(
                  tableData.findIndex(
                    innerItem => innerItem.row_id === item.row_id
                  ),
                  1
                );
              }
            });
            let serverList = this.selectedList.filter(item => {
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
    },
    rowClick(row, column, event) {
      // if (column.property !== 'skinTest') {
      // 医嘱可编辑状态
      //let status = "0,2,7";
      /*if (status.indexOf(row.orderStatus) === '-1' && row.chargeStatus !== '0') {
            this.$message.warning('未收费的医嘱才可编辑！');
            return false;
          }*/
      //this.clearTypeCurrent();
      /*this.tableData.forEach((item) => {
            if (item.id === row.id) {
              this.$set(item, 'type', 'current');
            }
          });
          this.$store.dispatch('cis/changeRpTableData', this.tableData);*/
      // }
    },
    setBunchingCls() {
      var list = [];
      var filterList = [];
      let groupList = this.tableData.map(item => {
        return item.majorNo;
      });
      groupList = unique(groupList); //数组去重
      groupList = groupList.filter((item, index) => {
        // 数组去undefind
        return item !== undefined;
      });

      function unique(arr) {
        return Array.from(new Set(arr));
      }

      groupList.forEach((item, index) => {
        //遍历 成map结构
        // list = [];
        filterList = this.tableData.filter((sonItem, sonIde) => {
          return item === sonItem.majorNo;
        });
        list.push({
          key: item,
          value: filterList
        });
      });
      this.groupNoList = list;
      list.forEach(item => {
        let itemList = item.value;
        itemList.forEach((sonItem, sonIndex) => {
          if (sonIndex === 0) {
            sonItem.groupNoCls = "bunchingUp";
          } else if (sonIndex === itemList.length - 1) {
            sonItem.groupNoCls = "bunchingDown";
          } else {
            sonItem.groupNoCls = "bunchingCenter";
          }
        });
      });
    },
    //成组 处理
    bunchingHandler() {
      if (this.bunchingValidate()) {
        // this.setBunchingSelect ();
        this.$confirm("成组药品用法和频次，用药天数将保持一致，是否继续？")
          .then(_ => {
            //处理频次和用法,数量
            let ajaxList = this.bunchContChanges();
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
    // bunchingHandler() {
    //   if (this.bunchingValidate()) {
    //     // this.setBunchingSelect ();
    //     let data = this.selectedList;
    //     bunching(data)
    //       .then(res => {
    //         if (res.code === 1) {
    //           this.$message({
    //             type: "success",
    //             message: "成组成功!"
    //           });
    //           this.fetchTableList();
    //         } else {
    //           console.info(res);
    //           this.$message.error(res.msg || " 接口返回错误");
    //         }
    //       })
    //       .catch(() => {
    //         this.$message.error("成组失败！");
    //       });
    //   }
    // },
    adviceStop() {
      if (this.validate()) {
        let data = this.selectedList;
        westAdviceStop(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "停止成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("停止失败！");
          });
      } else {
      }
    },
    adviceRecall() {
      if (this.validate()) {
        let data = this.selectedList;
        westAdviceRecall(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "撤回成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("撤销失败！");
          });
      } else {
      }
    },
    adviceRescind() {
      if (this.validate()) {
        let data = this.selectedList;
        westAdviceRescind(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "撤销成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("撤销失败！");
          });
      } else {
      }
    },
    //全部停止
    adviceaAllStop() {
      let inpCodes = this.tableRuleForm.tableData[0].inpCode;
      let data = {
        inpCode: inpCodes
      };
      // this.setBunchingSelect ();
      allStop(data)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "停止成功!"
            });
            this.fetchTableList();
          } else {
            console.info(res);
            this.$message.error(res.msg || " 接口返回错误");
          }
        })
        .catch(() => {
          this.$message.error("停止失败！");
        });
    },
    chChange(val) {
      // this.type = val;
      this.searchForm.type = val;
    },
    //成组 后 天数 频次 用法 会相同， 天数会根据最新的频次和用法计算出来
    bunchContChanges() {
      let cloneList = deepClone(this.selectedList);
      // cloneList = cloneList.sort(this.sortIndexCompare("sortIndex"));
      // console.log("cloneList:::", cloneList);
      let targetItem = cloneList[0];
      cloneList.forEach(item => {
        if (item.itemId !== targetItem.itemId) {
          item.freqCode = targetItem.freqCode;
          item.freqTimes = targetItem.freqTimes;
          item.freqUnit = targetItem.freqUnit;
          item.useWay = targetItem.useWay;
          item.useDay = targetItem.useDay;
          item.firstDayUse = targetItem.firstDayUse;
          // item.qty = item.quantity = this.handleQtyUtil(
          //   item.useDay,
          //   item.firstDayUse,
          //   item,
          //   item.onceDosage,
          //   item.dosageMeasure,
          //   item
          // );
        }
      });
      return cloneList;
    },
    //成组或者取消成组 成员中是否全部暂存状态
    isZanCunStatus(list = []) {
      return list.every(item => {
        return item.status == "1"; //只有暂存状态能提交
      });
    },
    //成组校验
    bunchingValidate() {
      let flag = true;

      if (!this.isZanCunStatus(this.selectedList)) {
        this.$message.warning("只有暂存的医嘱可以成组");
        return false;
      }

      if (this.selectedList.length > 1) {
        // 成组最少两个成员
        flag = true;
      } else {
        flag = false;
        this.$message.warning("成组最少两个医嘱");
        return false;
      }

      if (this.isSameGroup()) {
        this.$message.warning("不可重复成组");
        return false;
      }

      return flag;
    },
    //普通校验
    validate() {
      let flag = true;
      if (this.selectedList.length > 0) {
        // 成组最少1个成员
        flag = true;
      } else {
        flag = false;
        this.$message.warning("请选择一条数据");
        return false;
      }
      return flag;
    },
    //取消成组
    cancelBunching() {
      let data = this.selectedList;
      if (data.length > 1) {
        // 成组最少两个成员
        // 组号相同
        if (this.isSameGroup()) {
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
    isSameGroup() {
      let majorNo = null;
      return this.selectedList.every((item, index) => {
        if (index === 0) {
          majorNo = item.majorNo;
        }
        return item.majorNo === majorNo;
      });
    },
    //作废
    adviceCancel() {
      if (this.validate()) {
        let data = this.selectedList;
        // this.setBunchingSelect ();
        cancel(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "作废医嘱成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("作废医嘱失败！");
          });
      } else {
      }
    },
    //复制到长期
    adviceCopyLong() {
      if (this.validate()) {
        let data = this.selectedList;
        // this.setBunchingSelect ();
        copyLong(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "复制成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("复制到长期失败！");
          });
      }
    },
    //复制到临时
    adviceCopyShort() {
      let data = this.selectedList;
      if (this.validate()) {
        // this.setBunchingSelect ();
        copyShort(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "复制到临时成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("复制到临时失败！");
          });
      } else {
      }
    },
    //加顿到临时
    adviceGonna() {
      let data = this.selectedList;
      // this.setBunchingSelect ();
      if (this.validate()) {
        gonna(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "医嘱加顿成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("医嘱加顿失败！");
          });
      } else {
      }
    },
    //加顿到出院带药
    adviceGonnaLeave() {
      let data = this.selectedList;
      // this.setBunchingSelect ();
      if (this.validate()) {
        gonnaLeave(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "加顿到出院带药成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("医嘱加顿失败！");
          });
      } else {
      }
    },

    //加顿到出院带药
    adviceGonnaOut() {
      let data = this.selectedList;
      // this.setBunchingSelect ();
      if (this.validate()) {
        gonnaOut(data)
          .then(res => {
            if (res.code === 1) {
              this.$message({
                type: "success",
                message: "医嘱加顿成功!"
              });
              this.fetchTableList();
            } else {
              console.info(res);
              this.$message.error(res.msg || " 接口返回错误");
            }
          })
          .catch(() => {
            this.$message.error("医嘱加顿失败！");
          });
      } else {
      }
    },
    print() {
      // 请求医嘱方法

      this.searchForm.bedNo = this.receivePatientData.bedCode;
      this.searchForm.inpCode = this.receivePatientData.inpCode;
      this.searchForm.patientId = this.receivePatientData.patientId;
      let data = this.searchForm;
      let cloneData = Object.assign(data);
      /* for (let key in data) {
          if (key === "dateRange" && data[key] && data[key].length != 0) {
            cloneData["startDate"] = data[key][0];
            cloneData["endDate"] = data[key][1];
          }
        } */
      cloneData["startDate"] = (data.dateRange && data.dateRange[0]) || "";
      cloneData["endDate"] = (data.dateRange && data.dateRange[1]) || "";
      cloneData.pageNo = 1;
      cloneData.pageSize = 999;
      // westAdviceGetAdvice(cloneData).then(data => {
      westAdviceGetAdvice(cloneData).then(data => {
        //debugger
        /*  alert(data.data.name[0]);
          this.instillationData.instillation = data.data.name;*/
        console.log("westAdviceGetAdvice", data);
        let list1 = data.data;

        // 整理滴速显示
        this.list1.forEach(item => {
          if (item.dropRate && item.dropRate.indexOf("~") > -1) {
            let splitStr = item.dropRate.split("~");
            item.dropRate1 = splitStr[0];
            item.dropRate2 = splitStr[1];
          } else {
            item.dropRate1 = "";
            item.dropRate2 = "";
          }
        });
        return new Promise((resolve, reject) => {
          let list = [];
          let groupList = [];
          let filterList = [];
          let tableList = [];
          groupList = list1.map(item => {
            // 获取所有组
            return item.majorNo;
          });

          groupList = Array.from(new Set(groupList));
          groupList = groupList.filter((item, index) => {
            // 数组去undefind
            return item !== undefined && item != "";
          });
          groupList.forEach((item, index) => {
            //遍历 成map结构 分组
            // list = [];
            filterList = list1.filter((sonItem, sonIde) => {
              return item === sonItem.majorNo;
            });
            list.push({
              key: item,
              value: filterList
            });
          });
          list.forEach(item => {
            // 将有组item添加class
            let itemList = item.value;
            if (itemList.length == 1) {
              return;
            }
            itemList.forEach((sonItem, sonIndex) => {
              if (sonIndex === 0) {
                sonItem.groupNoCls = "bunchingUp";
              } else if (sonIndex === itemList.length - 1) {
                sonItem.groupNoCls = "bunchingDown";
              } else {
                sonItem.groupNoCls = "bunchingCenter";
              }
            });
          });
          list.map(item => {
            // 更改list格式
            item.value.map(val => {
              tableList.push(val);
            });
          });
          list1.map(item => {
            // 补充未成组项
            if (!item.majorNo) {
              tableList.push(item);
            }
          });

          this.instillationList.a = tableList;
          this.instillationList.a.map(item => {
            if (item.groupNoCls == "bunchingUp") {
              item.groupNoCls = "┓";
            }
            if (item.groupNoCls == "bunchingCenter") {
              item.groupNoCls = "┫";
            }
            if (item.groupNoCls == "bunchingDown") {
              item.groupNoCls = "┛";
            }
            if (item.status == "0") {
              item.status = "暂存";
            }
            if (item.status == "1") {
              item.status = "已提交";
            }
            if (item.status == "4") {
              item.status = "已停止";
            }
            if (item.status == "5") {
              item.status = "已作废";
            }
            if (item.status == "9") {
              item.status = "审核驳回";
            }
            if (item.status == "13") {
              item.status = "未执行";
            }
            if (item.status == "14") {
              item.status = "执行中";
            }
            if (item.status == "15") {
              item.status = "执行完毕";
            }
          });

          this.instillationList.inpCode = this.searchForm.inpCode;
          this.instillationList.patientName = this.searchForm.patientName;
          this.instillationList.bedCode = this.searchForm.bedNo;

          onPreview(this.instillationList, "住院医嘱");
          resolve(tableList);
        });
      });
    },
    //   selectRow(list, row) {
    //     // 选择表格 成组全选
    //     this.tableRuleForm.tableData.map(item => {
    //       if (row.majorNo === item.majorNo && item.adviceId !== row.adviceId) {
    //         setTimeout(() => {
    //           this.$refs.multipleTable.toggleRowSelection(item);
    //         }, 0);
    //       }
    //     });

    //     this.selectedList = list;
    //   },

    //   handleSelectionChange(val) {
    //     // 表格发生变化是
    //     this.selectedList = val;
    //   },
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
        try {
          let { data, msg, code } = await westAdviceGetAdvice(cloneData);
          if (code === 1) {
            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              let cloneItem = {
                ...element,
                ...element.item
              };

              //dismountable 拆零与单位的逻辑 默认单位的处理
              this.dismountAbleRelatedUnit(element.item, cloneItem);

              // 大小单位 与 unitFlag 的联系处理
              this.unitFlagRelatedUnit(element.item, cloneItem);

              //unitOptions 注入单位列表
              try {
                let unitList = await this.getQtyUnitAjax(cloneItem);
                cloneItem.unitOptions = unitList;
              } catch (error) {
                return;
              }

              data[i] = cloneItem;
            }
            this.tableRuleForm.tableData = data;
            this.grouping(data);
            this.mainTableLoading = false;
            resolve(true);
          } else {
            this.$message.error(msg || "获取数据错误");
            this.mainTableLoading = false;
            reject("医嘱列表获取失败");
          }
        } catch (error) {
          this.$message.error("获取数据错误");
          this.mainTableLoading = false;
          reject("医嘱列表获取失败");
        }
      });
    },

    grouping(list1) {
      // 将list 分组
      return new Promise((resolve, reject) => {
        let list = [];
        let groupList = [];
        let filterList = [];
        let tableList = [];
        groupList = list1.map(item => {
          // 获取所有组
          return item.majorNo;
        });

        groupList = Array.from(new Set(groupList));
        groupList = groupList.filter((item, index) => {
          // 数组去undefind
          return item !== undefined && item != "";
        });
        groupList.forEach((item, index) => {
          //遍历 成map结构 分组
          // list = [];
          filterList = list1.filter((sonItem, sonIde) => {
            return item === sonItem.majorNo;
          });
          list.push({
            key: item,
            value: filterList
          });
        });
        list.forEach(item => {
          // 将有组item添加class
          let itemList = item.value;
          if (itemList.length == 1) {
            return;
          }
          itemList.forEach((sonItem, sonIndex) => {
            if (sonIndex === 0) {
              sonItem.groupNoCls = "bunchingUp";
            } else if (sonIndex === itemList.length - 1) {
              sonItem.groupNoCls = "bunchingDown";
            } else {
              sonItem.groupNoCls = "bunchingCenter";
            }
          });
        });
        list.map(item => {
          // 更改list格式
          item.value.map(val => {
            tableList.push(val);
          });
        });
        list1.map(item => {
          // 补充未成组项
          if (!item.majorNo) {
            tableList.push(item);
          }
        });

        console.log(tableList);
        resolve(tableList);
      });
    },
    searchDrugName() {
      // 新增状态下 输入药品名称检索请求
    },
    selectDrug(row) {
      // 选择检索出的药品
      console.log(row);
      // 将药品相关信息 放入tableList
    },
    //   handleCurrentChange(row) {
    //     this.currentRow = row;
    //     // debugger
    //     this.itemName = row.name;
    //     this.itemSpec = row.spec;
    //     let data = {
    //       type: row.type,
    //       adviceId: row.adviceId
    //     };
    //     this.changeDrugName({ drugName: row.name });
    //     performance(data).then(res => {
    //       this.tableData = res.data;
    //     });
    //   },
    hiddenBottom() {
      // 底边栏显示隐藏
      this.bottomHidden = !this.bottomHidden;
      this.bottom = this.bottomHidden ? -240 : 0;
    },
    isCheckDisabled(row, index) {
      // 多选框是否禁用，true可用，false禁用
      // return (
      //   ((row.adviceType == 1 && row.status != 5) ||
      //     (row.adviceType == 2 && row.status != 5) ||
      //     (row.adviceType == 3 && row.status != 5) ||
      //     (row.adviceType == 19 && row.status != 5)) &&
      //   row.status != 16
      // );
      return true;
    },
    handleHiddenAside() {
      // 侧边栏显示隐藏
      if (this.asideHidden) {
        this.asideWidth = 287;
        this.asideHidden = false;
      } else {
        this.asideWidth = 0;
        this.asideHidden = true;
      }
    },
    leadFormwork(m) {
      let data = {
        ids: m,
        inpCode: this.searchForm.inpCode,
        type: this.searchForm.type,
        patientId: this.searchForm.patientId,
        bedNo: this.searchForm.bedNo
      };
      leadAdviceFormwork(data)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "引入成功!"
            });
            this.fetchTableList();
          } else {
            console.info(res);
            this.$message.error(res.msg || " 接口返回错误");
          }
        })
        .catch(() => {
          this.$message.error("引入失败！");
        });
    },
    radioChange() {
      if (this.searchForm.type == "1") {
        this.showLeave = true;
        this.showShort = true;
        this.showPrise = true;
      } else if (this.searchForm.type == "2") {
        this.showPrise = true;
        this.showLeave = true;
        this.showShort = false;
      } else if (this.searchForm.type == "3") {
        this.showPrise = true;
        this.showLeave = false;
        this.showShort = true;
      }
      // 根据 长期 短期 出院带药 判断 初始的状态
      this.setFrequencyState();
      this.tableRuleForm.tableData = [];
      this.fetchTableList();
      this.$root.eventHub.$emit("radioType", this.searchForm.type);
    },
    // 新增table row 的初始化对象
    getAddRowOriginObj() {
      return {
        status: 0,
        // id: 4,
        _primary_id: 3,
        isNew: true,
        itemName: "", // 医嘱名称
        itemId: "", // 医嘱名称ID
        spec: "", // 规格
        onceDosage: 0, // 单次剂量
        quantity: undefined, //数量
        firstDayUse: 0, //首日次数
        useWay: "", // 用法
        useDay: this.searchForm.type == 2 ? 1 : undefined, //用药天数  备注： 临时医嘱：用药天数非必填 默认1 不让改.长期： 用药天数 默认是空 不必须填，
        freqCode: "", // 频次
        normal_time: "", // 常规时间
        adv_people: "", // 开嘱人
        deptId: "", // 开嘱科室
        end_date: "", // 停止日期
        end_time: "", // 结束时间
        expectStartTime: new Date().format("yyyy-MM-dd hh:mm:ss"), //开始时间
        end_doctor: "", // 结束医生
        end_nurse: "", // 结束护士
        execute_depart: "", // 执行科室
        execDept: "", //接受科室
        group_num: "", // 分组号
        isEditingNum: true,
        expectStopTime: "", //预停时间
        type: this.searchForm.type, //默认是长期医嘱
        unitOptions: [], //单位列表
        stSolutionType: "2", //皮试备注默认是 2 免试
        unit: "", //单位
        urgent: false, //紧急
        selfPay: false, //自费
        selfProvidedDisabled: false,
        row_id: +new Date(),
        selfProvided: 0
      };
    }
  },
  // computed: {
  //   ...mapGetters("homeSickbeds", ["receivePatientData"])
  // },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData", "role", "name"]),
    isEditing() {
      // 判断当前是否有正在新增的医嘱
      let status = false;
      this.tableRuleForm.tableData.map(item => {
        if (item.isNew) {
          status = true;
        }
      });
      return status;
    },
    quantityIsHaveTo() {
      //长期医嘱： 数量不必须填写， 数量不可编辑。
      return this.searchForm.type == "2";
    }
  },
  created() {
    this.changeDrugName({ drugName: "" });
    this.fetchTableList();
  },
  mounted() {},
  updated() {},
  watch: {
    //   receivePatientData: {
    //     handler(c) {
    //       this.searchForm.inpCode = c.inpCode;
    //       this.searchForm.patientId = c.patientId;
    //       this.searchForm.bedNo = c.bedCode;
    //       this.searchForm.patientName = c.patientName;

    //       this.fetchTableList();
    //       this.$refs.bottomForm && this.$refs.bottomForm.hollow(); // 重置表单
    //     },
    //     immediate: true
    //   },
    receivePatientData: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        this.wardsCode = val.wardId;
        this.fetchTableList(val);
      },
      deep: true
    },
    selectedList: {
      handler(c) {
        this.$store.dispatch("residentStation/setMultipleSelections", c);
      },
      deep: true
    },
    "tableRuleForm.tableData": {
      //控制执行科室的禁用与赋值
      deep: true,
      handler(val) {
        // 没有数据，可选药房
        if (val.length == 0) {
          this.searchForm.pharmacyDisabled = false;
          this.searchForm.pharmacyId = defSelectedphar;
        } else {
          // 有数据 取数据项第一条的执行科室，
          this.searchForm.pharmacyDisabled = true;
          if (!val[0].row_id) {
            this.searchForm.pharmacyId = val[0].pharmacyId;
          }
        }
      }
    }
  },
  beforeDestroy() {
    this.$root.eventHub.$off("radioType");
  }
};
</script>

<style scoped lang="scss">
.rightMedicalOrder {
  height: 100%;
  padding: 18px 16px;
  .rightMedicalOrderInner {
    display: flex;
    flex-direction: column;
    .table-box {
      flex: 1;
      margin-top: 10px;

      /deep/.el-table .cell {
        padding: 0 !important;
      }
    }
  }
  .ds-input {
    width: 60px;
  }
  // .search-box {
  //   overflow: hidden;
  //   //line-height: 40px;
  //   padding-left: 20px;
  //   margin: 10px 0;

  //   .radio-group {
  //     float: left;
  //     margin-top: 25px;
  //   }

  //   .datePicker {
  //     margin: 15px 0 0 10px;

  //     // 修复datepicker 的删除按钮位置
  //     /deep/.el-date-editor .el-range__close-icon {
  //       position: unset;
  //     }
  //   }

  //   .select-item {
  //     margin-top: 15px;
  //     float: left;
  //     width: 120px;
  //     margin-left: 10px;
  //   }
  // }

  .edit-btn-box {
    font-size: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    > span {
      display: inline-block;
      min-width: 60px;
    }
    span,
    .btn-text {
      margin-right: 16px;
      line-height: 24px;
      font-size: 14px;
      i {
        display: inline-block;
        width: 24px;
        height: 24px;
        text-align: center;
        font-size: 14px !important;
      }
    }

    /deep/ .el-button {
      & > i {
        font-size: 14px;
        vertical-align: middle;
      }

      & > span {
        margin-left: 5px;
      }
    }

    .el-button--text,
    .el-button--text:hover {
      font-size: 14px;
      padding: 0px;
      font-weight: 400;
      color: rgba(46, 50, 58, 1);
    }

    .lastSpan {
      margin-right: 0 !important;
    }

    // 撤销按钮 比较大 需要 额外的margin-right
    .chexiaoSpan > i {
      margin-right: 10px;
    }

    .line {
      width: 2px;
      height: 18px;
      background: #e4e4e4;
      margin-left: 16px;
      margin-right: 16px;
      height: 18px;
    }
  }

  .disabled {
    color: $l-color-fontcolor-4;
  }

  .state-info {
    position: relative;
    font-size: 14px;

    font-weight: 400;
    display: inline-block;
    width: 100%;
    .state-info-icon {
      position: absolute;
      right: 0;
      width: 15px;
      height: 15px;
      display: inline-block;
      color: #ffd2c2;
      top: 0;
      cursor: pointer;
      z-index: 100;
    }
  }

  .detail-table {
    left: 0;
    width: 100%;
    transition: all 0.5s;

    .title {
      background-color: $l-color-bgcolor-18;
      padding-left: 10px;
      line-height: 30px;
      color: $l-color-fontcolor-3;
      font-size: 14px;

      span {
        width: 80px;
        height: 20px;
        text-align: center;
        left: 50%;
        top: 1px;
        transform: translateX(-50%);
        background-color: #fff;
        cursor: pointer;
        border: 1px solid $l-color-bgcolor-11;
        border-radius: 0px 2px 2px 0px;

        i {
          position: relative;
          top: -5px;
          transition: all 0.5s;
        }

        i.active {
          transform: rotate(-180deg);
        }
      }
    }
  }

  .bottom {
    //bottom: 0;
    //right: 0;
    //left: 0;
    height: 30%;
    //position: absolute;

    .tabs {
      padding: 10px 20px 20px 20px;

      /deep/ .el-tabs__content {
        height: calc(100% - 50px);
        /*overflow: auto;*/
      }
    }
  }
}

.minWidth80 {
  min-width: 86px !important;
}

.minWidth180 {
  min-width: 180px !important;
}

.bunchingUp {
  display: inline-block;
  color: $l-color-primary;

  &::after {
    content: "┓";
  }
}

.bunchingCenter {
  display: inline-block;
  color: $l-color-primary;

  &::after {
    content: "┫";
  }
}

.bunchingDown {
  color: $l-color-primary;
  display: inline-block;

  &::after {
    content: "┛";
  }
}
</style>
