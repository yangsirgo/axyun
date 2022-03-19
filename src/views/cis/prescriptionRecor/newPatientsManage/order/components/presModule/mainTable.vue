/* eslint-disable complexity */
/* eslint-disable consistent-return */
<template>
  <div
    class="height100 main-table-wrapper"
    ref="tableWrapper"
  >
    <div
      class="table-utils"
      ref="tableUtils"
    >
      <!--<el-checkbox v-model="checked" @keyup.enter.native="checked = !checked">备选项</el-checkbox>-->
      <el-button
        class="filter-item"
        type="text"
        icon="iconfont iconxinzengchufang"
        @click.native="addRpWrapper()"
        v-hotKey="{ func: 'func_add1' }"
        :loading="buttonLoading.addRpLoading"
      >新增处方</el-button>
      <el-button
        class="filter-item"
        type="text"
        icon="iconfont iconxinzengchufang"
        @click.native="freeRpClick"
      >免费处方</el-button>
      <el-button
        class="filter-item"
        type="text"
        icon="iconfont iconxinzengmingxi"
        @click.native="addRowHandle"
        :loading="addRowLoading"
        v-hotKey="{ func: 'func_add2' }"
      >新增明细</el-button>
      <el-button
        @click="draftSaveAll()"
        :loading="dSAloading"
        class="filter-item"
        type="text"
        icon="iconfont iconzancun"
      >全部暂存</el-button>
      <el-button
        @click="submitOrders()"
        class="filter-item"
        type="text"
        icon="iconfont icontijiao1"
        v-hotKey="{ func: 'func_submit' }"
      >提交</el-button>
      <el-button
        @click="cancelSubmit"
        class="filter-item chexiaoCls"
        type="text"
        icon="iconfont iconchexiao"
        :loading="cclSubtLoading"
      >撤销提交</el-button>
      <el-button
        @click="deleteHandler"
        class="filter-item"
        type="text"
        icon="iconfont iconshanchu"
        v-hotKey="{ func: 'func_delete' }"
      >删除</el-button>
      <el-button
        @click="bunchingHandler"
        class="filter-item"
        type="text"
        icon="iconfont iconchengzu"
        v-hotKey="{ func: 'func_grouping' }"
      >成组</el-button>
      <el-button
        @click="cancelBunching"
        class="filter-item"
        type="text"
        icon="iconfont iconquxiaochengzu"
        v-hotKey="{ func: 'cancel_grouping' }"
      >取消成组</el-button>
      <el-button
        class="filter-item"
        type="text"
        icon="iconfont icondayin"
        v-hotKey="{ func: 'func_print' }"
        @click="printRecipe"
        :loading="printLoading"
      >打印</el-button>
      <el-button
        class="filter-item"
        type="text"
        icon="iconfont icondayin"
        @click="printAllRecipe"
        :loading="printAllLoading"
      >全部打印</el-button>

      <el-button
        class="filter-item"
        type="text"
        icon="iconfont icondayin"
        v-hotKey="{ func: 'func_print' }"
        @click="printHuShiFunc"
        :loading="pHuShiLoading"
      >打印治疗单</el-button>

      <el-button
        class="filter-item"
        type="text"
        icon="iconfont iconlicichufang"
        @click="copyOrder"
      >历史处方</el-button>
      <span class="filter-item">
        <el-checkbox
          v-model="showAllRp"
          @change="showAllRpChange"
        >全部医嘱项目</el-checkbox>
      </span>
      <LFormtTitle
        label="药房"
        style="width: 150px;margin-left:5px"
        class="input-item"
        :disabled="pharmacyDisabled"
      >
        <!-- <l-value-domain
          clearable
          :disabled="pharmacyDisabled"
          default-first-option
          remoteUrl="/hmm-stock/pharmacy/forPage"
          :value.sync="searchForm.pharmacyId"
          remoteShowKey="pharName"
          remoteValueKey="deptId"
          :remoteParams="{ pageSize: 20, pageNo: 1 }"
          placeholder="请选择药房"
        ></l-value-domain> -->
        <el-select
          v-model="searchForm.pharmacyId"
          :disabled="pharmacyDisabled"
          default-first-option
          placeholder="请选择药房"
          @change="drugRoomChange"
        >
          <el-option
            v-for="(item, index) in drugRoomList"
            :key="index"
            :label="item.pharName"
            :value="item.deptId"
          ></el-option>
        </el-select>
      </LFormtTitle>
      <!-- <disSelectShow
        :simple="true"
        :visitCode="receivePatientData.visitCode"
        :info.sync="disSelectInfo" ></disSelectShow> -->
      <!-- v-if="receivePatientData.settlementType == '3'" -->
      <!-- @isOk="disSelectShowIsOk" -->
      <el-button
        type="primary"
        @click="submitCurRow()"
        class="button margin-left-8"
        style="position: absolute; z-index: -1;"
        v-hotKey="{ func: 'func_save' }"
      >保 存</el-button>
    </div>
    <div class="main-table">
      <el-form
        :model="tableRuleForm"
        :rules="tableRuleForm.tableRules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm"
      >
        <el-table
          show-overflow-tooltip
          @header-dragend="headerDragend"
          highlight-current-row
          :data="tableRuleForm.tableData"
          border
          large
          v-loading="listLoading"
          tooltip-effect="dark"
          @row-click="rowClick"
          header-cell-class-name="headerCls"
          :cell-class-name="cellStyle"
          :row-class-name="rowStyleCls"
          @select="tableSelectionSelect"
          @selection-change="handleSelectionChange"
          :span-method="objectSpanMethod"
          ref="multipleTable"
          v-hotKey="{
            func: ['table_row', 'table_checkbox', 'table_choose'],
            deClass: 'el-table__row',
            curClass: 'current-row'
          }"
          max-height="100%"
          :height="tableHeight"
        >
          <!-- 需要列 -->
          <el-table-column
            :fixed="true"
            align="center"
            type="selection"
            width="32"
            :selectable="isCheckDisabled"
          ></el-table-column>
          <!-- 业务列 -->
          <el-table-column
            v-for="item in tableColumn"
            :key="item.prop"
            :type="item.type"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'center'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <!-- 提交状态下 不可编辑  -->
              <template v-if="isReadonly(scope)">
                <!-- <span>{{ scope.row[item.prop] }}</span> -->
                <!--医保类别-->
                <template v-if="item.prop === 'medicalInsuranceCat'">
                  <span
                    :val="scope.row.medicalInsuranceCat"
                    code="DrugReimbursementType"
                    v-codeTransform
                  ></span>
                </template>
                <!-- 金额格式化 -->
                <template v-else-if="item.prop == 'price'">
                  <span>{{ scope.row[item.prop] | roundingPrice }}</span>
                </template>
                <template v-else-if="item.prop == 'amt'">
                  <span>{{ scope.row[item.prop] | roundingAmt }}</span>
                </template>
                <!-- 金额格式化 -->
                <template v-else-if="item.prop == 'recipeCode'">
                  <span>{{ scope.row[item.prop] }}</span>
                  <template v-if="scope.row.unqualifiedComment !== ''">
                    <el-popover
                      trigger="click"
                      placement="left-start"
                      popper-class="popper-class"
                    >
                      <div class="hoverContent">
                        <p>
                          <span class="title">审方意见</span>
                          <span class="content">
                            {{ scope.row["unqualifiedComment"] }}
                          </span>
                        </p>
                        <p>
                          <span class="title">审方时间</span>
                          <span class="content">
                            {{ scope.row["checkTime"] }}
                          </span>
                        </p>
                        <p>
                          <span class="title">审方药师</span>
                          <span class="content">
                            {{ scope.row["checkUserName"] }}
                          </span>
                        </p>
                      </div>
                      <i
                        slot="reference"
                        class="el-icon-warning-outline icon"
                      ></i>
                    </el-popover>
                  </template>
                </template>
                <!-- 医嘱状态 -->
                <template v-else-if="item.prop == 'orderStatus'">
                  <span v-if="scope.row[item.prop] === '4'">已收费</span>
                  <span
                    v-else-if="scope.row[item.prop] != '4'"
                    :val="scope.row[item.prop]"
                    code="MedicalStatus"
                    v-codeTransform
                  ></span>
                </template>
                <!-- 收费状态 -->
                <template v-else-if="item.prop == 'chargeStatus'">
                  <span
                    :val="scope.row.chargeStatus"
                    code="ChargeStatus"
                    v-codeTransform
                  ></span>
                </template>
                <!--医嘱类型-->
                <template v-else-if="item.prop === 'orderCat'">
                  <!--<span :val="" code="order_type" v-codeTransform>{{scope.row.orderCat}}</span>-->
                  <span>
                    <span
                      columns="doctors_advice_name"
                      :conditionMap="{ doctors_advice_code: scope.row.orderCat }"
                      tableName="cnf_doctors_advice"
                      v-tableTransform
                    ></span>
                  </span>
                </template>
                <!--成组 关联-->
                <template v-else-if="item.prop === 'relation'">
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
                <!--医嘱名称-->
                <template v-else-if="item.prop === 'orderItemName'">
                  <span>{{ scope.row.orderItemName }}</span>
                </template>
                <template v-else-if="item.prop === 'bunching'">
                  <span :class="scope.row.groupNoCls"></span>
                </template>
                <!--一次用量-->
                <template v-else-if="item.prop === 'onceDosage'">
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
                <!--剂量单位-->
                <template v-else-if="item.prop === 'dosageUnit'">
                  <span
                    :val="scope.row.dosageUnit"
                    code="DrugDoseUnit"
                    v-codeTransform
                  ></span>
                </template>
                <!--频次-->
                <template v-else-if="item.prop === 'frequencyCode'">
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
                <!--用法-->
                <template v-else-if="item.prop === 'useWay'">
                  <span
                    :val="scope.row.useWay"
                    code="MedicationRouteCode"
                    v-codeTransform
                  ></span>
                </template>
                <!--数量-->
                <template v-else-if="item.prop === 'qty'">
                  <span>{{ scope.row.qty }}</span>
                </template>
                <!--单位-->
                <template v-else-if="item.prop === 'unitKey'">
                  <span
                    :val="scope.row.unitKey"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
                <!--皮试-->
                <template v-else-if="item.prop === 'skinTest'">
                  <el-checkbox
                    v-model="scope.row.skinTest"
                    @change="()=>{ changeSkinTest(scope.row) }"
                    true-label="1"
                    false-label="0"
                    disabled
                  ></el-checkbox>
                </template>
                <!--备注-->
                <template v-else-if="item.prop === 'remark'">
                  <span>{{ scope.row.remark }}</span>
                </template>
                <!--滴速-->
                <!-- <template v-else-if="item.prop === 'flowRate'">
                  <span v-if="scope.row.useWay === '404'"
                    >{{ scope.row.dropRate1 }}~{{ scope.row.dropRate2 }}</span
                  >
                  <span v-else>--</span>
                </template> -->
                <!--医嘱超量-->
                <template v-else-if="item.prop === 'excessReason'">
                  <div>
                    <!-- 提交
                    {{ scope.row.excessReason }} -->
                    <span
                      data-id="提交"
                      :val="scope.row.excessReason"
                      code="CausesOfExcess"
                      v-codeTransform
                    ></span>
                  </div>
                </template>
                <template v-else-if="item.prop === 'useDay'">
                  <span>{{ scope.row.useDay }}</span>
                </template>
                <!--加急-->
                <template v-else-if="item.prop === 'urgent'">
                  <el-checkbox
                    disabled
                    v-model="scope.row.urgent"
                    true-label="1"
                    false-label="0"
                    @keyup.enter.native="scope.row.urgent = !scope.row.urgent"
                  ></el-checkbox>
                </template>
                <!-- 新添加自备药  start -->
                <template v-else-if="item.prop === 'selfProvided'">
                  <el-checkbox
                    v-model="scope.row.selfProvided"
                    disabled
                    true-label="0"
                    false-label="1"
                    @keyup.enter.native="
                    scope.row.selfProvided =
                      scope.row.selfProvided == '0' ?
                      '1' : scope.row.selfProvided == '1' ?
                      '0' : '1'
                    "
                    @change="computeRptotal"
                  ></el-checkbox>
                </template>
                <!-- 新添加自备药  end -->
                <!--接收科室-->
                <template v-else-if="item.prop === 'execDeptName'">
                  <!-- <span
                    tableName="sys_org"
                    :conditionMap="{
                      org_type: '_DEPT_',
                      id: scope.row.receiveDept || ''
                    }"
                    columns="org_nm"
                    v-tableTransform
                    >--</span
                  > -->
                  <span>{{filterDrugName(scope.row.execDeptId)}}</span>
                </template>
                <template v-else-if="item.prop === 'stSolutionType'">
                  <!-- 皮试类型 用法为皮试， 选择皮试 都会有皮试类型 去掉判断条件 -->
                  <!-- <template v-if="scope.row.skinTest === '1'"> -->
                  <template v-if="showSolutionType(scope.row)">
                    <span
                      code="SkinTestWay"
                      :val="scope.row.stSolutionType"
                      v-codeTransform
                    ></span>
                  </template>
                </template>
                <!-- 医保限制 -->
                <template v-else-if="item.prop === 'limitResultCode'">
                  <span v-if="scope.row.limitResultCode == '0'">自费使用</span>
                  <span v-if="scope.row.limitResultCode == '1'">审批通过</span>
                </template>
                <!-- 就诊类别 -->
                <template v-else-if="item.prop === 'diseaseType'">
                  <span v-if="scope.row.diseaseType == '0'">普通门诊</span>
                  <span v-else-if="scope.row.diseaseType == '1'">慢病</span>
                  <span v-else-if="scope.row.diseaseType == '2'">特病</span>
                </template>
                <template v-else>
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
              </template>
              <!-- 非提交状态下可编辑  -->
              <template v-else>
                <!--医保类别-->
                <template v-if="item.prop === 'medicalInsuranceCat'">
                  <span
                    :val="scope.row.medicalInsuranceCat"
                    code="DrugReimbursementType"
                    v-codeTransform
                  ></span>
                </template>
                <!-- 金额格式化 -->
                <template v-else-if="item.prop == 'price'">
                  <span>{{ scope.row[item.prop] | roundingPrice }}</span>
                </template>
                <template v-else-if="item.prop == 'amt'">
                  <span>{{ scope.row[item.prop] | roundingAmt }}</span>
                </template>
                <!-- 金额格式化 -->
                <template v-else-if="item.prop == 'recipeCode'">
                  <span>{{ scope.row[item.prop] }}</span>
                  <template v-if="scope.row.unqualifiedComment !== ''">
                    <el-popover
                      trigger="click"
                      placement="left-start"
                      popper-class="popper-class"
                    >
                      <div class="hoverContent">
                        <p>
                          <span class="title">审方意见</span>
                          <span class="content">
                            {{ scope.row["unqualifiedComment"] }}
                          </span>
                        </p>
                        <p>
                          <span class="title">审方时间</span>
                          <span class="content">
                            {{ scope.row["checkTime"] }}
                          </span>
                        </p>
                        <p>
                          <span class="title">审方药师</span>
                          <span class="content">
                            {{ scope.row["checkUserName"] }}
                          </span>
                        </p>
                      </div>
                      <i
                        slot="reference"
                        class="el-icon-warning-outline icon"
                      ></i>
                    </el-popover>
                  </template>
                </template>
                <!-- 医嘱状态 -->
                <template v-else-if="item.prop == 'orderStatus'">
                  <span v-if="scope.row[item.prop] === '4'">已收费</span>
                  <span
                    v-else-if="scope.row[item.prop] != '4'"
                    :val="scope.row[item.prop]"
                    code="MedicalStatus"
                    v-codeTransform
                  ></span>
                </template>
                <!-- 收费状态 -->
                <template v-else-if="item.prop == 'chargeStatus'">
                  <div>

                    <span
                      :val="scope.row.chargeStatus"
                      code="ChargeStatus"
                      v-codeTransform
                    ></span>
                  </div>
                </template>
                <!--医嘱类型-->
                <template v-else-if="item.prop === 'orderCat'">
                  <!--<span :val="" code="order_type" v-codeTransform>{{scope.row.orderCat}}</span>-->
                  <span>
                    <span
                      columns="doctors_advice_name"
                      :conditionMap="{ doctors_advice_code: scope.row.orderCat }"
                      tableName="cnf_doctors_advice"
                      v-tableTransform
                    ></span>
                  </span>
                </template>
                <!--成组 关联-->
                <template v-else-if="item.prop === 'relation'">
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.relation'"
                    :rules="tableRuleForm.tableRules.relation"
                  >
                    <!-- <el-input-number
                      :data-id="'relation' + scope.row.row_id"
                      v-model.number="scope.row.relation"
                      :min="0"
                      style="width: 100%;"
                      step-strictly
                      :controls="false"
                      @change="relateAdvice"
                      @blur="blurRelateAdvice"
                    ></el-input-number> -->
                    <!-- <l-shotcut-input
                      ref="lInputTable"
                      component="el-input-number"
                      v-axShotcut
                      v-selectInner
                      :shotindex="shotcutIndexHandler(scope, 'relation')"
                      :shotready="shotreadyHandler(scope, 'relation')"
                      :data-id="'relation' + scope.row.row_id"
                      :controls="false"
                      style="width: 100%;"
                      step-strictly
                      :step="1"
                      v-model="scope.row.relation"
                      controls-position="right"
                      @change="relateAdvice"
                      @blur="blurRelateAdvice"
                    ></l-shotcut-input> -->
                    <l-shotcut-input
                      ref="lInputTable"
                      component="el-input"
                      v-axShotcut
                      v-selectInner
                      :shotindex="shotcutIndexHandler(scope, 'relation')"
                      :shotready="shotreadyHandler(scope, 'relation')"
                      :data-id="'relation' + scope.row.row_id"
                      style="width: 100%;"
                      :disabled="scope.row[item.prop + colDisabledText]"
                      v-model="scope.row.relation"
                      @input="
                        (value) => {
                          relateAdvice(value, scope.row, item.prop);
                        }
                      "
                      @blur="
                        (value) => {
                          blurRelateAdvice(value, scope.row, item.prop);
                        }
                      "
                      @focus="
                        (value) => {
                          relateAdviceFocus(value, scope.row, item.prop);
                        }
                      "
                    ></l-shotcut-input>
                  </el-form-item>
                </template>
                <!--医嘱名称-->
                <template v-else-if="item.prop === 'orderItemName'">
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.orderItemName'"
                    :rules="tableRuleForm.tableRules.orderItemName"
                    v-if="scope.row.orderStatus === ''"
                  >
                    <!-- <LInputTable
                      ref="lInputTable"
                      :data-id="'inputTable' + scope.row.row_id"
                      :popoverWidth="800"
                      suffix-icon="el-icon-search"
                      :tableData="selectOptions"
                      @query="search"
                      v-model="scope.row.orderItemName"
                      @select="selectDropRow"
                      :tableLoading="inputTableLoading"
                      :tableParams="dropColumn"
                      placeholder="请输入关键字"
                      valueKey="orderItemName"
                    ></LInputTable> -->
                    <l-shotcut-input
                      v-axShotcut
                      ref="lInputTable"
                      v-selectInner
                      v-focus
                      component="LInputTable"
                      :shotindex="shotcutIndexHandler(scope, 'orderItemName')"
                      :shotready="shotreadyHandler(scope, 'orderItemName')"
                      :data-id="'lInputTable' + scope.row.row_id"
                      :popoverWidth="1200"
                      :tableData="selectOptions"
                      @query="search"
                      @mounted="resetLInputTablePaging"
                      v-model="scope.row.orderItemName"
                      @select="selectDropRow"
                      :tableLoading="inputTableLoading"
                      suffix-icon="el-icon-search"
                      :tableParams="dropColumn"
                      placeholder="请输入项目名称关键字"
                      valueKey="orderItemName"
                    />
                  </el-form-item>
                  <!-- <el-form-item
                    :prop="'tableData.' + scope.$index + '.orderItemName'"
                    :rules="tableRuleForm.tableRules.orderItemName"
                    v-else
                    >{{ scope.row.orderItemName }}</el-form-item
                  > -->
                  <template v-else>{{ scope.row.orderItemName }}</template>
                </template>
                <template v-else-if="item.prop === 'bunching'">
                  <div>

                    <span :class="scope.row.groupNoCls"></span>
                  </div>
                </template>
                <!--一次用量-->
                <template v-else-if="item.prop === 'onceDosage'">
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.onceDosage'"
                    :rules="tableRuleForm.tableRules.onceDosage"
                  >
                    <!-- <el-input
                      size="medium"
                      :data-id="'dosage' + scope.row.row_id"
                      v-model.trim="scope.row.onceDosage"
                      :maxlength="inputMaxL"
                      @input="inputHandler"
                    ></el-input> -->
                    <!-- <l-shotcut-input
                      ref="lInputTable"
                      component="el-input-number"
                      v-axShotcut
                      v-selectInner
                      :shotindex="shotcutIndexHandler(scope, 'onceDosage')"
                      :shotready="shotreadyHandler(scope, 'onceDosage')"
                      :data-id="'onceDosage' + scope.row.row_id"
                      :controls="false"
                      style="width: 100%;"
                      step-strictly
                      :step="1"
                      v-model="scope.row.onceDosage"
                      controls-position="right"
                      @change="inputHandler"
                      :min="0"
                    ></l-shotcut-input> -->
                    <lInputNumber
                      ref="lInputTable"
                      component="el-input"
                      v-axShotcut
                      v-selectInner
                      :shotindex="shotcutIndexHandler(scope, 'onceDosage')"
                      :shotready="shotreadyHandler(scope, 'onceDosage')"
                      :data-id="'onceDosage' + scope.row.row_id"
                      style="width: 100%;"
                      v-model="scope.row.onceDosage"
                      @input="inputHandler"
                      @focus="
                        (value, item) => {
                          fixedCurrentIndex(scope.row);
                        }
                      "
                    ></lInputNumber>
                  </el-form-item>
                </template>
                <!--剂量单位-->
                <template v-else-if="item.prop === 'dosageUnit'">
                  <span
                    :val="scope.row.dosageUnit"
                    code="DrugDoseUnit"
                    v-codeTransform
                  ></span>
                </template>
                <!--频次-->
                <template v-else-if="item.prop === 'frequencyCode'">
                  <el-form-item
                    label
                    :prop="'tableData.' + scope.$index + '.frequencyCode'"
                    :rules="tableRuleForm.tableRules.frequencyCode"
                  >
                    <!-- <cis-value-domain
                      style="width: 100%;"
                      :disabled="
                        typeof scope.row.relation !== 'undefined' &&
                          relateAdviceDisabled
                      "
                      remoteUrl="/frequency/pageList"
                      :remoteParams="remoteParams"
                      :value.sync="scope.row.frequencyCode"
                      placeholder="频次"
                      remoteShowKey="frequencyName"
                      remoteValueKey="frequencyCode"
                      @change="
                        (value, item) => {
                          handleFreq(value, item, scope.row);
                        }
                      "
                    ></cis-value-domain> -->
                    <l-value-domain
                      v-axShotcut
                      :data-id="'frequencyCode' + scope.row.row_id"
                      :shotindex="shotcutIndexHandler(scope, 'frequencyCode')"
                      :shotready="shotreadyHandler(scope, 'frequencyCode')"
                      :disabled="isColDisabled(scope, item)"
                      remoteUrl="/frequency/pageList"
                      :remoteParams="remoteParams"
                      :value.sync="scope.row.frequencyCode"
                      placeholder="频次"
                      remoteShowKey="frequencyName"
                      remoteValueKey="frequencyCode"
                      clearable
                      @change="
                        (value, item) => {
                          handleFreq(value, item, scope.row);
                        }
                      "
                    />
                  </el-form-item>
                </template>
                <!--用法-->
                <template v-else-if="item.prop === 'useWay'">
                  <el-form-item
                    label
                    :prop="'tableData.' + scope.$index + '.useWay'"
                    :rules="tableRuleForm.tableRules.useWay"
                  >
                    <!-- <l-value-domain
                      v-if="selectRefresh"
                      :disabled="
                        typeof scope.row.relation !== 'undefined' &&
                          relateAdviceDisabled
                      "
                      code="MedicationRouteCode"
                      :value.sync="scope.row.useWay"
                      placeholder="用法"
                      @change="handleUseWay"
                      remoteShowKey="name"
                      remoteValueKey="code"
                    ></l-value-domain> -->
                    <l-shotcut-input
                      v-axShotcut
                      :disabled="isColDisabled(scope, item)"
                      :data-id="'useWay' + scope.row.row_id"
                      component="l-value-domain"
                      :shotindex="shotcutIndexHandler(scope, 'useWay')"
                      :shotready="shotreadyHandler(scope, 'useWay')"
                      code="MedicationRouteCode"
                      remoteShowKey="name"
                      :remoteParams="remoteParams"
                      remoteValueKey="code"
                      @change="
                        (value, item) => {
                          handleUseWay(value, item, scope.row);
                        }
                      "
                      :value.sync="scope.row.useWay"
                      placeholder="用法"
                    />
                  </el-form-item>
                </template>
                <!--数量-->
                <template v-else-if="item.prop === 'qty'">
                  <el-form-item
                    label
                    :prop="'tableData.' + scope.$index + '.qty'"
                    :rules="tableRuleForm.tableRules.qty"
                    class="skinTest"
                  >
                    <!-- <l-input-number
                      v-model="scope.row.qty"
                      style="width: 100%;"
                      size="medium"
                      :min="scope.row.qtyStep === 0.5 ? 0.5 : 1"
                      :step="scope.row.qtyStep"
                      :step-strictly="true"
                      :controls="false"
                      @change="computeAmt"
                    ></l-input-number> -->
                    <lInputNumber
                      v-selectInner
                      v-axShotcut
                      :data-id="'qty' + (scope.row.row_id || scope.row.id)"
                      :shotindex="shotcutIndexHandler(scope, 'qty')"
                      :shotready="shotreadyHandler(scope, 'qty')"
                      @keydown.enter.native="shotcutEndHandler(scope.row, 'qty')"
                      :controls="false"
                      style="width: 100%;"
                      v-model="scope.row.qty"
                      controls-position="right"
                      step-strictly
                      :max="99999"
                      @input="computeAmt"
                      @blur="()=>{ qtyBlur(scope.row) }"
                      @focus="
                        (value, item) => {
                          fixedCurrentIndex(scope.row);
                        }
                      "
                    />
                    <!-- :min="scope.row.qtyStep === 0.5 ? 0.5 : 0" -->
                  </el-form-item>
                </template>
                <!--单位-->
                <template v-else-if="item.prop === 'unitKey'">
                  <el-form-item
                    label
                    :prop="'tableData.' + scope.$index + '.unitKey'"
                    :rules="tableRuleForm.tableRules.unitKey"
                  >
                    <!-- <el-select
                      v-model="scope.row.unitKey"
                      placeholder="单位"
                      style="width: 66px; vertical-align: top;"
                      @change="unitChange($event, scope.row)"
                    >
                      <el-option
                        v-for="item in scope.row.unitOptions"
                        :label="item.label"
                        :key="item.value"
                        :value="item.value"
                      ></el-option>
                    </el-select> -->
                    <l-shotcut-input
                      component="el-select"
                      v-selectInner
                      v-axShotcut
                      :data-id="'unitKey' + scope.row.row_id"
                      :shotindex="shotcutIndexHandler(scope, 'unitKey')"
                      :shotready="shotreadyHandler(scope, 'unitKey')"
                      v-model="scope.row.unitKey"
                      placeholder="单位"
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
                <!--皮试-->
                <template v-else-if="item.prop === 'skinTest'">
                  <el-form-item
                    label
                    prop="skinTest"
                    class="skinTest"
                  >
                    <el-checkbox
                      v-model="scope.row.skinTest"
                      @change="()=>{ changeSkinTest(scope.row) }"
                      true-label="1"
                      false-label="0"
                      :disabled="scope.row.skinTestDisabled"
                    ></el-checkbox>
                    <!-- <l-shotcut-input
                      v-axShotcut
                      :data-id="'skinTest' + scope.row.row_id"
                      :shotindex="shotcutIndexHandler(scope, 'skinTest')"
                      component="el-checkbox"
                      :shotready="shotreadyHandler(scope, 'skinTest')"
                      v-model="scope.row.skinTest"
                      @keyup.enter.native="
                        scope.row.skinTest = !scope.row.skinTest
                      "
                      @change="changeSkinTest"
                      true-label="1"
                      false-label="0"
                      :disabled="scope.row.skinTestDisabled"
                    /> -->
                  </el-form-item>
                </template>
                <!--备注-->
                <template v-else-if="item.prop === 'remark'">
                  <!-- <el-input
                    size="medium"
                    style="width: 100%;"
                    v-model.trim="scope.row.remark"
                    @keyup.enter.native="submitCurRowThrottle"
                    @keydown.tab.native.prevent="submitAndAddRow"
                  ></el-input> -->
                  <l-shotcut-input
                    v-selectInner
                    v-axShotcut
                    :data-id="'remark' + scope.row.row_id"
                    component="el-input"
                    :shotindex="shotcutIndexHandler(scope, 'remark')"
                    :shotready="shotreadyHandler(scope, 'remark')"
                    v-model="scope.row.remark"
                  />
                </template>
                <!--滴速-->
                <!-- <template v-else-if="item.prop === 'flowRate'">
                  <el-form-item
                    label
                    prop="flowRate"
                    class="flowRate"
                    v-if="scope.row.useWay === '404'"
                  >
                    <el-input-number
                      class="ds-input"
                      size="medium"
                      v-model="scope.row.dropRate1"
                      step-strictly
                      :controls="false"
                    ></el-input-number
                    >～
                    <el-input-number
                      class="ds-input"
                      size="medium"
                      v-model="scope.row.dropRate2"
                      step-strictly
                      :controls="false"
                    ></el-input-number>
                    <span class="ds-unit">滴/分</span> -->
                <!-- </el-form-item> -->
                <!-- <span v-else>--</span> -->
                <!-- </template> -->
                <!--医嘱超量-->
                <template v-else-if="item.prop === 'excessReason'">
                  <el-form-item
                    label
                    :prop="'tableData.' + scope.$index + '.excessReason'"
                    :rules="tableRuleForm.tableRules.excessReason"
                    v-if="scope.row.overReasonShow"
                  >
                    <l-value-domain
                      clearable
                      v-axShotcut
                      @change="
                        (value, item) => {
                          fixedCurrentIndex(scope.row);
                        }
                      "
                      :shotindex="shotcutIndexHandler(scope, 'excessReason')"
                      :shotready="shotreadyHandler(scope, 'excessReason')"
                      @keydown.enter.native="shotcutEndHandler(scope.row, 'excessReason')"
                      code="CausesOfExcess"
                      :value.sync="scope.row.excessReason"
                      placeholder="医嘱超量原因"
                      remoteShowKey="name"
                      remoteValueKey="code"
                    ></l-value-domain>
                  </el-form-item>
                  <div v-else>
                    <!-- 暂存
                    {{ scope.row.excessReason }} -->
                    <span
                      data-id="暂存"
                      :val="scope.row.excessReason"
                      code="CausesOfExcess"
                      v-codeTransform
                    ></span>
                  </div>
                </template>
                <template v-else-if="item.prop === 'useDay'">
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.useDay'"
                    :rules="tableRuleForm.tableRules.useDay"
                  >
                    <!-- <el-input
                      :disabled="
                        typeof scope.row.relation !== 'undefined' &&
                          relateAdviceDisabled
                      "
                      size="medium"
                      style="width: 100%;"
                      v-model.number="scope.row.useDay"
                      @keyup.native="limitNum"
                      @input="handleQty"
                    ></el-input> -->
                    <lInputNumber
                      v-axShotcut
                      v-selectInner
                      :disabled="
                        typeof scope.row.relation !== 'undefined' &&
                          relateAdviceDisabled || scope.row[item.prop + colDisabledText]
                      "
                      :shotindex="shotcutIndexHandler(scope, 'useDay')"
                      :shotready="shotreadyHandler(scope, 'useDay')"
                      :controls="false"
                      style="width: 100%;"
                      v-model="scope.row.useDay"
                      controls-position="right"
                      step-strictly
                      :min="0"
                      :max="999"
                      @input="
                        (value, item) => {
                          handleUseDay(value, scope.row);
                        }
                      "
                      @focus="
                        (value, item) => {
                          fixedCurrentIndex(scope.row);
                        }
                      "
                    />
                    <!-- @ended.native="shotcutEndHandler(scope, 'useDay')" -->
                  </el-form-item>
                </template>
                <!--加急-->
                <template v-else-if="item.prop === 'urgent'">
                  <el-form-item
                    label
                    prop="urgent"
                  >
                    <el-checkbox
                      v-model="scope.row.urgent"
                      :disabled="scope.row[item.prop + colDisabledText]"
                      true-label="1"
                      false-label="0"
                      @change="
                        (value) => {
                          urgentChange(value, scope.row);
                        }
                      "
                      @keyup.enter.native="scope.row.urgent = !scope.row.urgent"
                    ></el-checkbox>
                    <!-- <l-shotcut-input
                      v-axShotcut
                      :data-id="'urgent' + scope.row.row_id"
                      :shotindex="shotcutIndexHandler(scope, 'urgent')"
                      component="el-checkbox"
                      :shotready="shotreadyHandler(scope, 'urgent')"
                      v-model="scope.row.urgent"
                      true-label="1"
                      false-label="0"
                      @keyup.enter.native="scope.row.urgent = !scope.row.urgent"
                    /> -->
                  </el-form-item>
                </template>
                <!-- 新添加自备药  start -->
                <template v-else-if="item.prop === 'selfProvided'">
                  <el-form-item
                    label
                    prop="selfProvided"
                  >
                    <el-checkbox
                      v-model="scope.row.selfProvided"
                      true-label="0"
                      false-label="1"
                      @keyup.enter.native="
                      scope.row.selfProvided =
                        scope.row.selfProvided == '0' ?
                        '1' : scope.row.selfProvided == '1' ?
                        '0' : '1'
                      "
                      @change="computeRptotal"
                      :disabled="
                        scope.row.freeRecipe == 1
                      "
                    ></el-checkbox>
                  </el-form-item>
                </template>
                <!-- 新添加自备药  end -->
                <!--接收科室-->
                <template v-else-if="item.prop === 'execDeptName'">
                  <!-- <span
                    tableName="sys_org"
                    :conditionMap="{
                      org_type: '_DEPT_',
                      id: scope.row.receiveDept || ''
                    }"
                    columns="org_nm"
                    v-tableTransform
                    >--</span
                  > -->
                  <span>{{filterDrugName(scope.row.execDeptId)}}</span>
                </template>
                <!-- 皮试液类型 -->
                <template v-else-if="item.prop === 'stSolutionType'">
                  <template>
                    <el-form-item
                      label
                      :prop="'tableData.' + scope.$index + '.stSolutionType'"
                      :rules="tableRuleForm.tableRules.stSolutionType"
                      v-if="scope.row.skinTest === '1' || scope.row.useWay ==='901'"
                    >
                      <!-- scope.row.skinTest  901 是 皮试 -->
                      <!-- <l-value-domain
                        code="SkinTestWay"
                        :value.sync="scope.row.stSolutionType"
                        placeholder="皮试液类型"
                        remoteShowKey="name"
                        remoteValueKey="code"
                      ></l-value-domain> -->
                      <l-value-domain
                        component="l-value-domain"
                        v-axShotcut
                        defaultFirst
                        :shotindex="
                          shotcutIndexHandler(scope, 'stSolutionType')
                        "
                        @change="
                          (value, item) => {
                            fixedCurrentIndex(scope.row);
                          }
                        "
                        :shotready="shotreadyHandler(scope, 'stSolutionType')"
                        @keydown.enter.native="shotcutEndHandler(scope.row, 'stSolutionType')"
                        :controls="false"
                        clearable
                        code="SkinTestWay"
                        :value.sync="scope.row.stSolutionType"
                        placeholder="皮试液类型"
                        remoteShowKey="name"
                        remoteValueKey="code"
                      />
                    </el-form-item>
                  </template>
                </template>
                <!-- 医保限制 -->
                <template v-else-if="item.prop === 'limitResultCode'">
                  <span v-if="scope.row.limitResultCode == '0'">自费使用</span>
                  <span v-if="scope.row.limitResultCode == '1'">审批通过</span>
                </template>
                <!-- 就诊类别 -->
                <template v-else-if="item.prop === 'diseaseType'">
                  <!-- {{ scope.row.diseaseType }} -->
                  <span v-if="scope.row.diseaseType == '0'">普通门诊</span>
                  <span v-else-if="scope.row.diseaseType == '1'">慢病</span>
                  <span v-else-if="scope.row.diseaseType == '2'">特病</span>
                </template>
                <template v-else>
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <!-- 处方合计 -->
      <orderTotalShow
        ref="orderTotal"
        :total="Rptotal"
        class="orderTotalCls"
      ></orderTotalShow>
    </div>
    <el-dialog
      title="医嘱引用"
      :visible.sync="copyOrderVisible"
      :append-to-body="true"
      :modal-append-to-body="false"
      class="copyOrderCls"
    >
      <copy-order
        v-if="copyOrderVisible"
        @copy="copyOrderCallback"
        :currentPrescriptionData="tableRuleForm.tableData"
        style="height: 60vh;"
        v-loading="copyLoading"
      ></copy-order>
    </el-dialog>
    <el-dialog
      title="免费处方"
      :visible.sync="freeRpVisible"
      @close="freeRpClose"
      width="600px"
    >
      <div class="freeRp-cont">
        <LFormtTitle
          label="原因"
          style="width: 240px;margin-right:3px"
          class="input-item"
        >
          <l-value-domain
            style="width:100%;"
            code="FreeRecipeReason"
            :value.sync="freeRpForm.freeReason"
            @change="reasonChange"
          />
        </LFormtTitle>
        <LFormtTitle
          v-if="freeRpForm.freeReason == 5"
          label="其他原因"
          style="width: 100%;"
          class="input-item"
        >
          <el-input
            v-model="freeRpForm.otherCont"
            maxlength="50"
            style="width:100%;"
          ></el-input>
        </LFormtTitle>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="freeRpConfirm"
          :loading="freeRpLoading"
        >确 定</el-button>
        <el-button @click="freeRpVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  drugsTpl,
  diagnoseTplChm,
  diagNameTpl
} from "@/components/adviceCommon/printTpl/tpl.js";
import { mapActions, mapGetters } from "vuex";
import Autocomplete from "@/components/LInputTable.vue";
import {
  getOrder,
  getPageItemList,
  submitOrders,
  bunching,
  unbunching,
  batchRemoveOrders,
  saveOrdersMould,
  getRecipeCode,
  saveOrder,
  saveOrders,
  getRecipeNo,
  validAntibacterialAuth,
  getAdviceItem,
  validAdviceItem,
  allDraftsSaveFunc,
  someDraftsSaveAjax,
  getExecResult,
  handleFreeCharge
} from "@/api/cis/order/order";
// import { getExecResult } from "@/api/cis/opnw/opnw";

import { westLodopTpl } from "@/printTemplete/module/westLodopTpl.js";

import { updateStatus } from "@/utils/updateRecipeStatus.js";
import { preview, onPreview, onPreviewData } from "@/utils/print";
import { print } from "@/utils/print_new.js";
import { deepClone, Throttle } from "@/utils/index.js";
import { getDataIdDom } from "@/utils/util.js";
import { getEffectiveRecord } from "@/api/common/allergy";

import { getAdviceItemList, drugItemListWithStorge } from "@/api/systemManagement/dataMaintain/adviceItem";
import {
  frequencyCodeToText,
  useWayCodeToText,
  sexCodeToText
} from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/orderUtils.js";
import { getTakingRoomList } from "@/api/cis/order/order.js";
import { mixins } from "./modules/mixin.js";
import {
  tableColumn,
  dropColumn,
  DrugsRequiredItem,
  relationDisabledList_cis,
  frequencyObjKeys,
  tableRules,
  zLPrintConfig,
  colDisabledText
} from "./modules/variable.js";
import {
  amtCalculatFunc,
  drugOutpCalculatFunc
} from "@/components/adviceCommon/drugCalculatFunc.js";

import codes from "@/printTemplete/code.js";

import { outCheckQuantity } from "@/components/adviceCommon/outpDrugCalculatFunc.js";

import {
  setComponentFocusFunc,
  setNextComponentFocus,
  setGroupNoList,
  getGroupList,
  fiteredMajorNoData,
  getUnitFlag,
  getPharmacyObjectFunc,
  setLInputTableShotReady,
  isOrderItemNameShotReady,
  convertStockShow,
  setFocusOnError,
  compile,
  compileToHtml,
  getPrintTplFunc,
  isCStStatusPass,
  cancelSubmitByRecipe,
  confirmProFunc,
  computeTotalHandler,
  orderDiagnost,
  diagPrintModuleParams,
  westOrderItemPrintHandle,
  getPharmacyData
} from "@/components/adviceCommon/adviceUtils.js";
// compileToHtml,
import {
  configToData,
  isHasEmptyRow,
  isMajorRow,
  getZanCunRow,
  getZanCunAndNewRow,
  handleSubmitRow,
  saveOrderDraft,
  getCutable,
  isZanCunAddNewStatus,
  getQtyByUnitFlag,
  getQtyUnitAjax,
  selectSkinTestController,
  skinTestStatusController,
  getGroupListBygroupNo,
  setOverReasonShow,
  getRelationRow,
  setRelateGroupNoFunc,
  setNotMajorRowData,
  setNormalRowData,
  setRelationToRowData,
  isRowInRelationed,
  updateGroupNoList,
  deleteEmptyRow,
  overReasonShowControlFunc,
  isSkinTestDrugs,
  isAutomaticallyBySkinTestDrugs,
  isHasEditedEmptyRow,
  getDiaRecode,
  getRecipeCodeFunc,
  setRelateGroupNo,
  setInputFormError,
  setInputFormSuccess,
  isInGroup,
  isSameGroup,
  isSameRp,
  isGreaterThanOne,
  isNotMajorRow,
  isZanCunStatus,
  isSameRowById,
  clearCurrentRow,
  resetCurrentData,
  clearLInputTable,
  checkDupFunc,
  checkZeroFunc,
  checkDrugAllergyFunc,
  checkLimitFunc,
  getExecResultBySelect,
  doctorPsReviewLimit,
  getPrintDataFunc,
  getUniqueMajorIdList,
  isFreeRow,
  findEmptyRowIndex,
  isSelfProvidedDrug,
  isFreeDrug,
  updateAllRecipe
} from "./modules/adviceUtils.js";

import { getConfig } from "./modules/adviceDispense.js";
import { getEnterJumpOrder } from "./modules/enterConfig.js";
import {
  outpatientOrderPrint,
  outpatientOrderListPrint
} from "@/api/cis/report/cisPrints.js";
import {
  injectionTpl,
  handlePrintData
} from "@/printTemplete/module/injectionTpl.js";

export default {
  name: "mainTable",
  props: ["execDept", "pageType"], //pageType = additionCost 是补费页面
  mixins: [mixins],
  data() {
    return {
      recipeGroupList: [],// 处方整理数据 key: 处方号  value: 处方列表
      whiteKeyObj: {}, //选择药品，重置row key的 白名单
      addRowLoading: false,
      Rptotal: 0, // 处方总金额
      dSAloading: false, // 全部暂存按钮 loading
      freeRpLoading: false, //免费处方 loading
      originTableData: [], // table的初始数据
      pHuShiLoading: false,
      cclSubtLoading: false,
      printAllLoading: false,
      // 打印的模板
      printTpl: "",
      disSelectInfo: {}, // 废弃，不使用。在医嘱项目中维护。
      tableHeight: "100%",
      buttonLoading: {
        addRpLoading: false //控制连击
      },
      //药房列表
      drugRoomList: [],
      //药房
      searchForm: {
        pharmacyId: ""
      },
      colDisabledText,
      //药房是否可选
      pharmacyDisabled: false,
      freeRpForm: {
        reason: "",
        otherCont: ""
      }, //免费处方原因
      freeRpVisible: false, //免费处方
      printLoading: false,
      copyLoading: false,
      submitcurrowFlag: false, ////当行数据提交节流
      showAllRp: true,
      tableColumn: deepClone(tableColumn),
      checked: true,
      currentRow: {}, //选中的当前行
      // 选中的当前行的索引
      currentRowIndex: -1,
      rpPosition: 0,
      isMask: false, // 查看遮罩
      RpRowArr: [],
      rpIndex: 1,
      multipleSelection: [], //选中的 checkbox
      groupNoList: [], // 数据格式： key:majorId,value: groupList
      // 分页数据
      currentPage: 0,
      pageSize: 10,
      total: 11,
      listLoading: false,
      tableRuleForm: {
        tableData: [],
        tableRules
      },
      selectOptions: [],
      dropColumn,
      inputTableLoading: false, //下拉table组件 loading
      inputMaxL: 10, //单次计量
      // freq: {}, // 选中频次信息
      // drugItem: {}, // 选中医嘱信息
      skinTestDisabled: true, //皮试勾选是否可选标识
      overReasonShow: false, // 超量原因 表单显示
      relateAdviceDisabled: false, // 关联属性是否只读
      remoteParams: {
        pageSize: 50,
        status: "1"
      }, // 频次分页参数
      showFlowRate: false, //显示滴速输入框
      // 在表格合并单元格之前隐藏用法下拉框，合并完成后显示，消除合并单元格，新增明细后用法下拉有数据显示空白问题
      selectRefresh: true,
      copyOrderVisible: false
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("cis", ["commonWestDrugData"]),
    ...mapGetters("adviceCommon", ["westPharmacyObject"])
  },

  watch: {
    westPharmacyObject: {
      immediate: true,
      deep: true,
      async handler(val) {
        // if(val.list.length) {

        // }
        this.drugRoomList = val.list;
        this.searchForm.pharmacyId = val.selected.deptId;
      }
    },
    receivePatientData: {
      immediate: true,
      deep: true,
      // eslint-disable-next-line complexity
      async handler(val, old) {
        await this.getList();
        if (!this.westPharmacyObject.list.length) {
          await this.getDrugRoom();
        }
        this.searchForm.pharmacyId = this.westPharmacyObject.list.length
          ? this.drugRoomList[0].deptId
          : "";
        if (this.tableRuleForm.tableData.length && val.visitCode) {
          this.searchForm.pharmacyId =
            this.tableRuleForm.tableData[0].execDeptId ||
            this.drugRoomList[0].deptId;
          this.pharmacyDisabled = true;
        }
        this.changeWestPharmacyObject({
          selected: { deptId: this.searchForm.pharmacyId },
          list: this.drugRoomList
        });
        let olds = "";
        if (old && old.hasOwnProperty("visitCode")) {
          olds = old.visitCode;
        }
        if (
          !this.tableRuleForm.tableData.length &&
          val.visitCode &&
          val.visitCode !== olds
        ) {
          this.pharmacyDisabled = false;
          //默认添加一条新数据
          await this.addRp();
        }
        await this.setBunchingCls();
      }
    },
    commonWestDrugData: {
      deep: true,
      async handler(val) {
        //重复医嘱提示 通知父组件判断是否有相同医嘱
        try {
          await checkDupFunc(val, this);
        } catch (error) {
          return;
        }
        //过敏药品提示
        try {
          await checkDrugAllergyFunc(val, this);
          this.addRp(() => {
            this.select(val);
            //药品名称 赋值
            setTimeout(() => {
              let row_id = this.currentRow.row_id;
              let nodeList = getDataIdDom(
                "div",
                "data-id",
                "lInputTable" + row_id
              );
              if (nodeList.length > 0) {
                nodeList[1].getElementsByClassName("el-input__inner")[0].value =
                  val.orderItemName;
              }
            }, 10);
          });
        } catch (error) {}
      }
    }
  },
  created() {
    // if (!this.drugRoomList.length) {
    //获取药房数据
    // }
    // this.searchForm.pharmacyId = this.drugRoomList.length
    //   ? this.drugRoomList[0].deptId
    //   : "";
    // this.changeWestPharmacyObject({selected: {deptId: this.searchForm.pharmacyId}, list: this.drugRoomList });
  },
  mounted() {
    this.getDrugRoom();
    this.getPrintTplFunc();
  },
  /**
   *
   * setTableAtuoHeight 设置 主table的高度
   * qtyBlur 数量的输入框失去焦点
   * validateQty  校验数量输入是否合规
   * relateAdviceFocus 关联输入框失焦
   * updateJumpOrder 更新 JumpOrder
   * fixedCurrentIndex 对正在编辑的行设置值
   * shotcutEndHandler 正在编辑的行，表单的最后一个必填项，按enter 暂存
   * isReadonly  医嘱列表在提交，收费等的状态下只读。
   * isColDisabled 频次，用法 设置禁用或者不禁用
   * drugRoomChange 切换药房
   * getDrugRoom 获取药房数据
   * filterDrugName 筛选药房药库数据
   * validateField  对表单字段进行校验
   * shotcutIndexHandler 设置enter 的跳转顺序
   * shotreadyHandler 检验是否满足enter 跳转到下一个 输入框的条件
   * freeRpClick 免费处方弹窗
   * freeRpClose 关闭免费处方弹窗
   * freeRpConfirm 免费处方确定
   * showAllRpChange 切换显示全部医嘱
   * headerDragend 表头拖拽修复
   * setOrderFromParam 区分补费 和 电子处方
   * getList 获取医嘱列表
   * urgentChange 紧急切换
   * setRowByConfig 根据config 设置 row的 状态
   * maintableValidate 校验
   * maintableValidateWrapper 校验当前行之前删除空行
   * omeDraftsSaveFunc 暂存多条
   * draftSaveAll 暂存全部
   * allDraftsSaveFunc 暂存全部AJAX
   * rowStyleCls 处理 row 的样式
   * setBunchingCls 设置成组样式
   * submitOrders 提交
   * handleFreeCharge 提交完成之后结算接口
   * handleRecipe 数据处理
   * addRow 新增一行
   * submitAndAddRow 提交并新增一行
   * isRowInGrouped  是否多个行成组
   * setCurRowBlur 回车触发提交事件 备注失去焦点
   * getDrugsAuthority 抗菌药品权限 验证
   * andleSubmitRowWrapper  提交前的权限验证
   * submitCurRow 提交表单 备注 回车 tab 键 提交当前行
   * inputHandler 数量 后面的单位改变
   * etLInputTableFocus 设置聚焦
   * search 医嘱项目搜索
   */
  methods: {
    ...mapActions({
      changeAdditionalOrderLoadKey: "cis/changeAdditionalOrderLoadKey",
      changeWestPharmacyObject: "adviceCommon/changeWestPharmacyObject",
      changeChmPharmacyObject: "adviceCommon/changeChmPharmacyObject",
      changeRpTableData: "cis/changeRpTableData",
      setDrugConflictList: "cdss/setDrugConflictList"
    }),
    // 选择病种确定按钮
    // disSelectShowIsOk (data){
    //   let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
    //   // currentRow = {
    //   //   ...currentRow,
    //   //   ...{
    //   //     ChronicDisease: data.ChronicDisease,
    //   //     ChronicDiseaseName: data.ChronicDiseaseName
    //   //   }
    //   // }
    //   this.$set(currentRow, "ChronicDisease", data.ChronicDisease);
    //   this.$set(currentRow, "ChronicDiseaseName", data.ChronicDiseaseName);
    // },
    tableSelectionSelect (selection, row){
      this.$nextTick(()=>{
        // 选择 selection 会选中当前行 
        this.fixedCurrentIndex(row);
        this.setCurrentLight(row);
      });
      // console.log(selection, row, "select 方法");
    },
    // 显示皮试类型的条件
    showSolutionType(row) {
      // 1.选择的医嘱项目是皮试
      // 2. 用法为皮试相关
      // 3. 皮试checkbox勾选
      let { skinTest, useWay } = row;
      return skinTest == 1 || useWay == "901";
    },
    //未收费打印治疗单
    async printHuShiFunc() {
      let orderTable = deepClone(this.multipleSelection);
      if (orderTable.length === 0) {
        this.$message.warning("请选择医嘱！");
        return;
      }

      // orderStatus 新增 和 暂存的医嘱不可打印
      let everyIsPrint = orderTable.every(item => {
        return item.orderStatus !== "" && item.orderStatus != "0";
      });

      if (!everyIsPrint) {
        this.$message.warning("仅支持已提交的医嘱进行打印！");
        return;
      }

      // chargeStatus 3 是全退 不需要打印
      let printParamList = this.getZLiaoPrintData(
        orderTable.filter(item => item.chargeStatus != 3)
      );

      // 筛选 需要打印的  皮试 注射 输液等
      // 数据结构类似这样
      // [[{ printGroup: "", orderId: "" }]];

      // console.log("printParamList", printParamList);

      let params = {
        orderStatus: 99,
        visitCode: this.receivePatientData.visitCode,
        pageNo: 1,
        pageSize: 40,
        patientId: this.receivePatientData.patientId
      };
      for (let index = 0; index < printParamList.length; index++) {
        let itemData = printParamList[index];

        params = {
          ...params,
          ...itemData
        };
        try {
          if (this.pHuShiLoading) return;
          this.pHuShiLoading = true;
          let printData = await getPrintDataFunc(params);
          this.pHuShiLoading = false;
          let obj = handlePrintData(printData);
          print(null, injectionTpl, {}, obj, true);
          continue;
        } catch (error) {
          break;
        } finally {
          this.pHuShiLoading = false;
        }
      }
    },
    // 撤销提交
    async cancelSubmit() {
      if (!isCStStatusPass(this.multipleSelection, ["", "0"], "orderStatus")) {
        this.$message.error("选择正确的可撤销医嘱！");
        return;
      }

      if (this.cclSubtLoading) return;

      let recipeIdList = this.multipleSelection.map(item => item.recipeId);
      let recipeCodeList = this.multipleSelection.map(item => item.recipeCode);
      recipeIdList = Array.from(new Set(recipeIdList));
      recipeCodeList = Array.from(new Set(recipeCodeList));
      this.cclSubtLoading = true;
      try {
        await confirmProFunc(
          "<p style='word-break: break-all;'>撤销&nbsp;" +
            recipeCodeList.toString() +
            "&nbsp;处方提交,是否继续?</p>"
        );
        console.log(recipeIdList);
        try {
          await cancelSubmitByRecipe(recipeIdList);
          this.cclSubtLoading = false;
          this.getList();
        } catch (error) {
          this.cclSubtLoading = false;
        }
      } catch (error) {
        this.cclSubtLoading = false;
      }
    },
    // 设置 主table的高度  废弃
    // setTableAtuoHeight (height){
    //   this.$nextTick(()=>{
    //     // let wrapperHeight = this.$refs.tableWrapper.offsetHeight;
    //     let wrapperHeight = this.$refs.formWrapper.offsetHeight;
    //     // let tableUtilsHeight = this.$refs.tableUtils.offsetHeight;
    //     let tableUtilsHeight = this.$refs.orderTotal.getMyHeight();

    //     if (height == "100%") {
    //       this.tableHeight = height;
    //     } else {
    //       this.tableHeight = wrapperHeight - tableUtilsHeight;
    //     }
    //     console.log(this.tableHeight, wrapperHeight, tableUtilsHeight);
    //   })
    // },
    async getPrintTplFunc() {
      try {
        // this.printTpl = await getPrintTplFunc(codes.t1);
        this.printTpl = westLodopTpl;
      } catch (error) {}
      // console.log("printTpl", this.printTpl);
    },
    // 数量的输入框失去焦点的事件
    qtyBlur(row) {
      let currentRow = row;
      let { qty, unitKey, id, row_id } = currentRow;
      // 验证 整数 小数
      this.validateQty(currentRow, qty, unitKey);
    },
    // 整数 还是 小数 判断
    validateQty(currentRow, qty, unitKey) {
      let { id, row_id } = currentRow;
      let isPass = false;
      try {
        outCheckQuantity(currentRow, qty, unitKey);

        // qty 必填的情况下 去掉error
        if (typeof qty !== "undefined" && qty != "") {
          setTimeout(() => {
            let dataIdName = "qty" + (id || row_id);
            setInputFormSuccess(dataIdName);
          }, 100);
        }
        isPass = true;
      } catch (error) {
        // console.log(error);
        this.$message.error(error.message);

        setTimeout(() => {
          let dataIdName = "qty" + (id || row_id);
          setInputFormError(dataIdName);
        }, 100);
        isPass = false;
      }
      // console.log("isPass", isPass);
      return isPass;
    },
    //关联输入框失焦
    relateAdviceFocus(value, row, colName) {
      // this.updateJumpOrder(row, colName, true);
    },
    //更新 JumpOrder
    updateJumpOrder(row, colName, shotcutState = false) {
      let setter = {
        colName,
        shotcut: shotcutState
      };
      // this.JumpOrder = getEnterJumpOrder(row,setter);
      this.$set(row, "shotCutSetterColName", colName);
      this.$set(row, "shotCutSetterState", shotcutState);
    },
    //修复currentIndex
    fixedCurrentIndex(row) {
      this.currentRowIndex = row.trindex; // 设置当前行数据
      this.currentRow = this.tableRuleForm.tableData[this.currentRowIndex]; // 更新 currentRow
    },
    //enter ready 事件
    async shotcutEndHandler(row, name) {
      let requiredList = getEnterJumpOrder(row);
      let targetCol = requiredList.find(item => {
        return item.prop === name;
      });
      // console.log("targetCol", requiredList, targetCol, targetCol.endSubmit, name);
      if (!(targetCol.endSubmit && typeof targetCol.endSubmit != "undefined")) {
        return;
      }
      if (this.listLoading) return;
      // 修复 CurrentRowIndex 的值不正确的问题
      this.fixedCurrentIndex(row);
      this.submitAndAddRow();
    },
    // 只读状态设定
    isReadonly(scope) {
      let status = !isZanCunAddNewStatus(scope.row);
      //  console.log("status", status);
      return status;
    },
    //列禁用
    isColDisabled(scope, item) {
      let a =
        typeof scope.row.relation !== "undefined" && this.relateAdviceDisabled;
      let b = scope.row[item.prop + colDisabledText];
      // console.log(scope.row.relation, a, b);
      return a || b;
    },
    // 切换药房
    drugRoomChange(deptId) {
      let newPharmacyObject = getPharmacyObjectFunc(
        deptId,
        deepClone(this.westPharmacyObject)
      );
      this.changeWestPharmacyObject(newPharmacyObject);
    },
    //获取药房数据
    async getDrugRoom() {
      try {
        let { cList, wlist } = await getPharmacyData();
        this.drugRoomList = cList;
        //更改西药药房
        this.changeWestPharmacyObject({
          selected: wlist[0] || "",
          list: wlist //西药药房
        });
        //更改中草药药房
        this.changeChmPharmacyObject({
          selected: cList[0] || "",
          list: cList //中药药房
        });
      } catch (e) {
        this.$message.error(e.msg || "获取药房数据失败！");
      }
    },
    //筛选药房药库数据
    filterDrugName(deptId) {
      let list = this.drugRoomList;
      for (let i in list) {
        if (list[i].deptId == deptId) {
          return list[i].pharName;
        }
      }
      return "";
    },
    //对表单字段进行校验
    async validateField(name) {
      await this.$refs.ruleForm.validateField(name, error => {
        if (!error) {
          return true;
        } else {
          return false;
        }
      });
    },

    //设置enter 的跳转顺序
    shotcutIndexHandler(scope, name) {
      // let requiredList = this.JumpOrder;
      let requiredList = getEnterJumpOrder(scope.row);
      // requiredList.push(config);
      let index = requiredList.findIndex(item => {
        return item.prop === name;
      });
      return String(scope.$index) + String(index + 1);
    },
    //编辑完成校验表单字段
    // eslint-disable-next-line complexity
    shotreadyHandler(scope, name) {
      let requiredList = getEnterJumpOrder(scope.row);
      let isRequiredCol = requiredList.find(item => {
        return item.prop === name;
      });

      // console.log("isRequiredCol.endSubmit::::", scope.row.trindex, name, isRequiredCol, isRequiredCol && isRequiredCol.endSubmit);
      //禁止跳到下一行  需要先判断
      if (
        isRequiredCol &&
        typeof isRequiredCol.endSubmit !== "undefined" &&
        isRequiredCol.endSubmit
      ) {
        return false;
      }

      // relation 可以不填写
      if (name === "relation") {
        return true;
      }

      if (name === "orderItemName") {
        return isOrderItemNameShotReady(scope.row);
      }

      // if (
      //   name === "onceDosage" ||
      //   name === "useDay" ||
      //   name === "qty"
      // ) {
      //   return !!Number(scope.row[name]);
      // }

      //基本验证  必填
      if (
        name === "onceDosage" ||
        name === "frequencyCode" ||
        name === "useWay" ||
        name === "useDay" ||
        name === "qty" ||
        name === "excessReason"
      ) {
        return !!scope.row[name];
      }

      return true;
    },

    //免费处方
    freeRpClick() {
      this.freeRpVisible = true;
      this.freeRpLoading = false;
    },
    reasonChange(value) {},
    freeRpClose() {
      this.freeRpForm = {
        freeReason: "",
        otherCont: ""
      };
    },
    freeRpConfirm() {
      if (!this.freeRpForm.freeReason) {
        this.$message.error("请选择免费处方原因！");
        return;
      }
      if (this.freeRpLoading) return;
      this.freeRpLoading = true;
      let tableData = this.tableRuleForm.tableData;

      // 删除空行
      if (isHasEmptyRow(tableData)) {
        // console.log("执行删除！");
        this.tableRuleForm.tableData = deleteEmptyRow(tableData);
      }

      this.$nextTick(() => {
        // 关闭弹窗
        this.freeRpVisible = false;
        this.addRp(() => {
          let freeReason = this.freeRpForm.freeReason;
          this.$set(this.tableRuleForm.tableData, this.currentRowIndex, {
            ...this.tableRuleForm.tableData[this.currentRowIndex],
            freeRecipe: 1,
            freeReason:
              freeReason == 5
                ? freeReason +
                  (this.freeRpForm.otherCont
                    ? "-" + this.freeRpForm.otherCont
                    : "")
                : freeReason,
            freeDrug: 1
          });
          this.currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
          this.freeRpLoading = false;
        });
      });
    },
    showAllRpChange() {
      this.getList();
    },

    headerDragend() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    // orderFrom 区分补费 和 电子处方
    setOrderFromParam(ajaxData) {
      let cloneAjaxData = { ...ajaxData };
      switch (this.pageType) {
        case "additionCost": //补费页面
          cloneAjaxData = {
            ...cloneAjaxData,
            ...{
              orderFrom: 1
            }
          };
          break;

        default:
          cloneAjaxData = {
            ...cloneAjaxData,
            ...{
              orderFrom: 0
            }
          };
          break;
      }
      return cloneAjaxData;
    },
    getList(flag) {
      let visitCode =
        typeof this.$store.state.base.receivePatientData["visitCode"] !==
        "undefined"
          ? this.$store.state.base.receivePatientData["visitCode"]
          : "all"; //获取患者就诊ID
      let data = {
        ...{
          pageNo: 1,
          pageSize: 999999,
          visitCode: visitCode,
          types: "10,12"
          // types: "1" //医嘱类别   如果有多个类别，用“,”拼接。下面的附件医嘱需要传 types:0
        }
      };
      //补费 电子处方 区别的参数
      data = this.setOrderFromParam(data);
      this.listLoading = true;
      return new Promise((resolve, reject) => {
        this.tableRuleForm.tableData = []; //修复表格错位问题
        getOrder(data, flag)
          // eslint-disable-next-line complexity
          .then(async res => {
            // this.listLoading = false;
            if (res.code === 1) {
              //this.showAllRp false  显示暂存和已提交的数据
              let data = this.showAllRp
                ? res.data
                : res.data.filter(item => {
                    return (
                      item.chargeStatus === "0" || item.chargeStatus === "4"
                    );
                  });
              let tableData = [];
              for (let i = 0; i < data.length; i++) {
                let item = data[i];
                // 数量单位转换
                /*let qty =
                    item.quantity % item.packQuantity !== 0
                      ? item.quantity
                      : item.quantity / item.packQuantity;
                  let unitKey =
                    item.quantity % item.packQuantity !== 0
                      ? item.unit
                      : item.packUnit;*/

                let qty = getQtyByUnitFlag(
                  item.unitFlag,
                  item.quantity,
                  item.packQuantity,
                  "insert"
                );

                let unitKey = item.unitFlag === "0" ? item.unit : item.packUnit;
                //备注：如果不可拆零，数量只能是整数
                // 如果可拆零，选择小单位时只能是整数
                let qtyStep = 1;
                if (item.unitSaleFlg === "0") {
                  //单位不可拆零 数量只能是整数
                  qtyStep = 1;
                } else if (item.unitSaleFlg === "1") {
                  //单位可拆零 选择小单位时只能是整数
                  if (item.unitFlag === "0") {
                    qtyStep = 1;
                  } else {
                    qtyStep = 0.5;
                  }
                }

                // 滴速显示
                let dropRate1 = "";
                let dropRate2 = "";
                if (item.dropRate && item.dropRate.indexOf("~") > -1) {
                  let splitStr = item.dropRate.split("~");
                  dropRate1 = splitStr[0];
                  dropRate2 = splitStr[1];
                }

                let rowData = {
                  ...item,
                  sortIndex: i,
                  qtyStep: qtyStep,
                  visitCode: item.visitCode || "",
                  orderItemId: item.orderItemId || "",
                  category: item.category || "",
                  medicalInsuranceCat: item.medicalInsuranceCat || "",
                  orgId: item.orgId,
                  hosId: item.hosId,
                  doctorId: item.doctorId,
                  doctorName: item.doctorName,
                  patientId: item.patientId,
                  patientName: item.patientName,
                  ouptDeptId: item.ouptDeptId,
                  ouptDeptName: item.ouptDeptName,
                  ouptDeptCode: item.ouptDeptCode,
                  recipeCode: item.recipeCode || "",
                  settlementType: item.settlementType || "",
                  recipeId: item.recipeId || "",
                  orderCat: item.orderCat || "",
                  relation: item.relation || undefined,
                  spec: item.spec || "",
                  price: item.price || "",
                  dosage: item.dosage || "",
                  dosageUnit: item.dosageUnit || "",
                  onceDosage: item.onceDosage,
                  useWay: item.useWay || "",
                  frequencyCode: item.frequencyCode || "",
                  frequencyTimes: item.frequencyTimes || "",
                  frequencyUnit: item.frequencyUnit || "",
                  quantity: item.quantity || "",
                  limitUnit: item.unit || "",
                  unitFlag: item.unitFlag || "",
                  packUnit: item.packUnit || "",
                  qty: qty || "",
                  packQuantity: item.packQuantity || "",
                  unitKey: unitKey || "",
                  skinTestDisabled: true, //禁止用户编辑
                  skinTest: item.skinTest,
                  selfProvided: item.selfProvided, //自备药
                  urgent: item.urgent,
                  amt: item.amt || "",
                  day: item.day || "",
                  useDay: item.useDay || "",
                  remark: item.remark || "",
                  orderItemName: item.orderItemName || "",
                  id: item.id,
                  manageType: item.manageType,
                  formCode: item.formCode,
                  dropRate: item.dropRate || "",
                  dropRate1: dropRate1,
                  dropRate2: dropRate2,
                  administrationTimeCode: item.administrationTimeCode || "",
                  stClassCode: item.a || "",
                  stSolutionType: item.stSolutionType || "",
                  excessReason: item.excessReason || "",
                  diagnosisTime: item.diagnosisTime,
                  isMajor: item.isMajor,
                  groupNo: item.groupNo,
                  no: item.no,
                  unqualifiedComment: item.unqualifiedComment || "",
                  checkTime: item.checkTime || "",
                  checkUserName: item.checkUserName || "",
                  groupNoCls: "", //成组样式
                  execDeptId: item.receiveDept,
                  execDeptName: item.receiveDeptName,
                  receiveDept: item.receiveDept,
                  orderStatus: item.orderStatus || "",
                  chargeStatus: item.chargeStatus || "",
                  dataVersion: item.dataVersion || 0,
                  rDataVersion: item.rDataVersion || 0,
                  unitOptions: item.unitOptions,
                  unitSaleFlg: item.unitSaleFlg
                  // unitSaleFlg: "1"
                };

                await getQtyUnitAjax(rowData, this).then(res => {
                  rowData.unitOptions = res;
                });
                setOverReasonShow(rowData);
                skinTestStatusController(rowData);
                // console.log("rowData", rowData.skinTestDisabled);
                rowData = this.setRowByConfig(rowData);
                tableData.push(rowData);
              }
              // 初始化处方状态
              // updateStatus(data, this);
              this.$root.eventHub.$emit("top-list-change");

              // this.tableRuleForm.tableData = [];
              this.tableRuleForm.tableData = tableData;
              this.changeRpTableData(tableData);
              this.setBunchingCls();
              this.setDataAddType(); //给数据增加type 属性
              this.getRpRowArr(); //处方项相同的合并处理
              // this.currentPage = res.pageNo;
              // this.pageSize = res.pageSize;
              // this.total = res.total;
              // 记录初始数据
              this.originTableData = deepClone(this.tableRuleForm.tableData);
              this.$nextTick(() => {
                this.$refs.multipleTable.doLayout();
                console.log("cdss 所需数据", this.tableRuleForm.tableData);
                // cdss 服务
                this.setDrugConflictList(this.tableRuleForm.tableData);
                // 处方总金额计算
                this.computeRptotal();
              });

              //更新 groupNoList
              this.groupNoList = updateGroupNoList(
                this.tableRuleForm.tableData
              );

              // 处方整理数据 key: 处方号  value: 处方列表
              this.recipeGroupList = updateAllRecipe(this.tableRuleForm.tableData);

              // 重置 currentRowIndex
              this.currentRowIndex = -1;
              // 插入明细 键值对 白名单 清空
              this.whiteKeyObj = {};
              // console.log("this.groupNoList", this.groupNoList);
              resolve(true);
            } else {
              this.$message.error(res.msg ? res.msg : "获取数据失败");
              // this.listLoading = false;
              resolve(true);
            }
          })
          .finally(() => {
            // setTimeout(() => {
            this.listLoading = false;
            // }, 1000);
          })
          .catch(e => {
            // this.listLoading = false;
            this.$message({
              type: "error",
              message: "获取处方数据失败！"
            });
            reject(e);
          });
      });
    },
    //设置医嘱名称斑马纹 
    //第一张处方背景色号为：#F1F1F2  ZebrasClsOdd
    // 第二张处方背景色号为：#DCEEF8 ZebrasClsEven
    // 第三张处方背景色号为：#F1F1F2  
    // 第四张处方背景色号为：#DCEEF8 
    setZebras (row = {}){
      let { recipeId } = row;
      // console.log("recipeId", recipeId, row);
      let rIndex = this.recipeGroupList.findIndex(item => item.key === recipeId);
      // console.log("rIndex", rIndex);
      return rIndex % 2 === 0 ? "ZebrasClsEven" : "ZebrasClsOdd";
    },
    //紧急 change
    urgentChange(value, row) {
      if (isMajorRow(row)) {
        setRelateGroupNo(this.groupNoList, row, this);
      }
    },
    //根据config 设置 row的 状态
    setRowByConfig(cRow) {
      let newConfig = getConfig(cRow);
      // console.log("newConfig", newConfig);
      return configToData(newConfig, cRow, this);
    },
    maintableValidate() {
      return new Promise((resolve, reject) => {
        this.$refs["ruleForm"].validate(async valid => {
          // debugger
          if (valid) {
            resolve(true);
          } else {
            setFocusOnError();
            reject(false);
          }
        });
      });
    },
    // 校验当前行之前删除空行
    maintableValidateWrapper() {
      return new Promise(async (resolve, reject) => {
        let tableData = this.tableRuleForm.tableData;
        // 删除空行
        if (isHasEmptyRow(tableData)) {
          // console.log("执行删除！");
          this.tableRuleForm.tableData = deleteEmptyRow(tableData);
        }
        this.$nextTick(async () => {
          // 验证表单
          try {
            await this.maintableValidate();
            resolve(true);
          } catch (error) {
            reject(false);
          }
        });
      });
    },
    //暂存多条
    someDraftsSaveFunc(ajaxData, msgText = "") {
      if (this.listLoading) return;
      this.listLoading = true;
      // eslint-disable-next-line consistent-return
      return new Promise(async (resolve, reject) => {
        try {
          let { data, msg, code } = await someDraftsSaveAjax(ajaxData);
          if (code == 1) {
            this.$message.success(msgText + "暂存成功！");
            // this.addRow();
            // this.drugItem = {}; //当条数据暂存后，清空drugItem的数据
            // this.freq = {}; //当条数据暂存后，清空freq的数据
            // save btn 存储 数据
            this.$emit("save");
            try {
              let getListResult = await this.getList();
              if (getListResult) {
                resolve(true);
              }
            } catch (e) {
              reject(e);
            }
          } else {
            this.$message.error(msg || "暂存全部失败");
          }
          this.listLoading = false;
        } catch (error) {
          this.$message.error("暂存全部失败");
          this.listLoading = false;
        }

        // for (let i = 0; i < data.length; i++) {
        //   const row = data[i];
        //   try {
        //     let result = await saveOrderDraft(row);
        //     this.$message.success(msgText + "第" + (i + 1) + "条，暂存成功！");
        //     if (data.length == i + 1) {
        //       this.listLoading = false;
        //       try {
        //         let getListResult = await this.getList();
        //         if (getListResult) {
        //           resolve(true);
        //         }
        //       } catch (e) {
        //         reject(e);
        //       }
        //     }
        //     continue;
        //   } catch (error) {
        //     this.listLoading = false;
        //     reject(error);
        //     break;
        //   }
        // }
      });
    },
    //暂存全部
    async draftSaveAll() {
      return new Promise(async (resolve, reject) => {
        if (this.dSAloading) {
          reject(false);
          return;
        }
        this.dSAloading = true;

        // 验证表单
        try {
          await this.maintableValidateWrapper();
        } catch (error) {
          // console.log(error);
          this.dSAloading = false;
          reject(false);
          return;
        }
        // console.log("暂存全部了");
        let data = getZanCunAndNewRow(this.tableRuleForm.tableData);
        //console.log("暂存了接口之前2");
        // 数量做些校验 处理
        if (this.qtyIncorrect(data)) {
          this.dSAloading = false;
          reject(false);
          return;
        }
        //console.log("暂存了接口之前1");
        data = this.handleSubmitRowWrapper(data);
        if (data.length == 0) {
          this.dSAloading = false;
          reject(false);
          return;
        }
        //console.log("暂存了接口之前");
        // this.someDraftsSaveFunc(data);
        try {
          await this.allDraftsSaveFunc(data);
          resolve(true);
        } catch (error) {
          reject(false);
        } finally {
          this.dSAloading = false;
        }
      });
    },
    async allDraftsSaveFunc(submitData = []) {
      return new Promise(async (resolve, reject) => {
        if (this.listLoading) {
          reject(false);
          return;
        }
        this.listLoading = true;
        //console.log("allDraftsSaveFunc", submitData);
        try {
          let { data, code, msg } = await allDraftsSaveFunc(submitData);
          if (code == 1) {
            this.$message.success(msg || "医嘱暂存成功");
            // this.addRow();
            // this.drugItem = {}; //当条数据暂存后，清空drugItem的数据
            // this.freq = {}; //当条数据暂存后，清空freq的数据
            // save btn 存储 数据
            this.$emit("save");
            try {
              await this.getList();
              resolve(true);
            } catch (error) {
              reject(false);
            }
          } else {
            this.$message.error(msg || "暂存全部失败");
            reject(false);
          }
          this.listLoading = false;
        } catch (error) {
          this.$message.error("暂存全部失败");
          this.listLoading = false;
          reject(false);
        }
      });
    },
    setDataAddType() {
      let me = this;
      this.tableRuleForm.tableData.forEach(item => {
        // item.type = '';
        me.$set(item, "type", "");
      });
    },
    //处理 row 的样式
    rowStyleCls(a) {
      a.row.trindex = a.rowIndex;
      return {
        rowStyleCls: true,
        freeRpRow: a.row.freeRecipe == 1
      };
    },
    setBunchingCls() {
      var list = [];
      var filterList = [];
      let groupList = this.tableRuleForm.tableData.map(item => {
        return item.groupNo;
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
        filterList = this.tableRuleForm.tableData.filter((sonItem, sonIde) => {
          return item === sonItem.groupNo;
        });
        list.push({
          key: item,
          value: filterList
        });
      });
      // this.groupNoList = list;
      list.forEach(item => {
        let itemList = item.value;

        // 只有一条数据的组 groupNoCls 是空
        if (itemList.length === 1) {
          itemList[0].groupNoCls = "";
        } else {
          itemList.forEach((sonItem, sonIndex) => {
            if (sonIndex === 0) {
              sonItem.groupNoCls = "bunchingUp";
            } else if (sonIndex === itemList.length - 1) {
              sonItem.groupNoCls = "bunchingDown";
            } else {
              sonItem.groupNoCls = "bunchingCenter";
            }
          });
        }
      });
    },
    // eslint-disable-next-line complexity
    async submitOrders() {

      // 验证表单
      // try {
      //   await this.maintableValidateWrapper();
      // } catch (error) {
      //   // console.log(error);
      //   return;
      // }


      try {
        await this.draftSaveAll();
      } catch (error) {
        return;
      }

      if (this.listLoading) return;

      let tableData = this.tableRuleForm.tableData;

      //列表中有  还有 未暂存的数据
      if (isHasEditedEmptyRow(tableData)) {
        this.$message.warning("医嘱列表中有未暂存的数据，请先暂存后提交");
        return;
      }

      let data = getZanCunRow(tableData);
      let multipleData = [...data];

      //useDay qty 在 this.multipleSelection 不更新问题
      // this.tableRuleForm.tableData.forEach(row => {
      //   multipleData.forEach(mulItem => {
      //     if (row.id === mulItem.id) {
      //       mulItem.useDay = row.useDay;
      //       mulItem.qty = row.qty;
      //     }
      //   });
      // });
      multipleData = this.handleSubmitRowWrapper(multipleData);
      //开药权限验证
      /* try {
        let { code, msg } = await this.getDrugsAuthority(multipleData);
        if (code === 3) {
          try {
            await this.drugsAuthorityConfirm(msg);
          } catch (error) {
            return false;
          }
        } else if (code === 4) {
          this.$message.error(msg);
          return false;
        } else {
          this.$message.error(msg);
          return false;
        }

        console.log("可提交了！");
      } catch (error) {
        return false;
      } */
      if (!multipleData.length) {
        this.$message.warning("无符合条件的数据可提交！");
        this.listLoading = false;
        return;
      }

      this.listLoading = true;
      submitOrders(multipleData)
        .then(async res => {
          if (res.code === 1) {
            try {
              //提交完成以后结算
              await this.handleFreeCharge(multipleData, async () => {
                //结算成功回调
                await this.getList(false);
                this.$message.success("提交成功");
                this.changeAdditionalOrderLoadKey(+new Date());
                this.listLoading = false;
              });
            } catch (error) {
              // 失败 回调
              await this.getList(false);
              this.changeAdditionalOrderLoadKey(+new Date());
              this.listLoading = false;
            }
          } else {
            this.$message.error(res.msg ? res.msg : "提交数据失败");
            this.listLoading = false;
          }
        })
        .catch(() => {
          this.$message.error("提交数据失败");
          this.listLoading = false;
        });
    },
    // 提交完成之后结算接口
    async handleFreeCharge(multipleData, fn) {
      return new Promise(async (resolve, reject) => {
        let params = [];
        //过滤免费处方进行结算
        for (let i in multipleData) {
          if (multipleData[i].freeRecipe == 1) {
            params.push(multipleData[i]);
          }
        }
        if (!params.length) {
          fn && fn();
          resolve(true);
          return;
        }

        try {
          let res = await handleFreeCharge(params);
          if (res.code != 1) {
            //结算失败之后，本条数据置为暂存状态
            // await this.copyOrderCallback(params);
            this.$message.error(res.msg || "结算失败,请到收费处进行处理！");
            this.listLoading = false;
            reject(false);
          } else {
            fn && fn();
            resolve(true);
          }
        } catch (e) {
          console.log(e, String(e));
          if (String(e).indexOf("timeout") < 0) {
            this.$message.error("结算失败,请到收费处进行处理！");
          }
          //timeOut Error: timeout of 13ms exceeded
          this.listLoading = false;
          reject(false);
        }
      });
    },
    /**
     * 数据处理
     * @param data 医嘱数据
     * @returns {Array}   返回结果数组[{key: 处方, value: 医嘱条数}]
     */
    handleRecipe(data) {
      let result = [];
      data.forEach((item, index) => {
        //遍历 成map结构
        let sItem = {};
        let filterList = result.filter((sonItem, sonIde) => {
          if (item.recipeCode === sonItem.key) {
            sItem = sonItem;
          }
          return item.recipeCode === sonItem.key;
        });

        if (filterList.length > 0) {
          result.splice(result.indexOf(sItem), 1, {
            key: sItem.key,
            value: sItem.value + 1
          });
        } else {
          result.push({
            key: item.recipeCode,
            value: 1
          });
        }
      });
      return result;
    },
    addRowHandle() {
      if (this.addRowLoading) return;
      this.addRowLoading = true;
      this.addRowWrapper();
      this.addRowLoading = false;
    },
    // 新增明细 校验
    // eslint-disable-next-line complexity
    isAddRowWrapperPass(recipeCode = -1) {
      let tableData = this.tableRuleForm.tableData;

      // 无列表提示 新增处方
      if (tableData.length === 0) {
        this.$message({
          type: "info",
          message: this.$t("cis.message.addRpMsg")
        });
        return false;
      }

      let { crpRowLength, selectedRow, inserIndex } = this.cptAddRowNoAndIndex(
        recipeCode
      );
      let row = selectedRow;
      let isZanCunXz =
        row["orderStatus"] === "0" ||
        row["orderStatus"] === "" ||
        typeof row["orderStatus"] === "undefined";

      if (typeof row.orderStatus === "undefined" || row.orderStatus === "") {
        this.$message.warning("该药品处方未保存，请保存后再新增明细！");
        return false;
      } else if (!isZanCunXz) {
        // let msg =
        //   row.orderStatus === "2"
        //     ? "该药品处方已提交，不能新增医嘱！"
        //     : "该药品处方已收费，不能新增医嘱！";
        let msg =
          row.orderStatus === "2"
            ? this.$t("cis.message.addRpMsg")
            : this.$t("cis.message.addRpMsg");
        this.$message.info(msg);
        return false;
      }
      return true;
    },
    // 删除空行后，更新currentRowIndex
    updateCurRowIndex(oldLenth, newLenth, emptyIndex) {
      console.log(oldLenth, newLenth, emptyIndex);
      let cIndex = this.currentRowIndex;
      if (cIndex >= emptyIndex) {
        cIndex = cIndex - 1;
      }
      return cIndex;
    },
    // 新增明细外围
    // 处理空行， 无列表提示
    // recipeCode 有处方号 新增到处方号的最后
    addRowWrapper(recipeCode) {
      let tableData = this.tableRuleForm.tableData;
      if (!this.isAddRowWrapperPass(recipeCode)) {
        return;
      }

      // 删除空行
      if (isHasEmptyRow(tableData)) {
        // console.log("执行删除！");
        let oldLenth = tableData.length;
        let emptyIndex = findEmptyRowIndex(tableData);
        this.tableRuleForm.tableData = deleteEmptyRow(tableData);
        let newLenth = this.tableRuleForm.tableData.length;
        // 删除空行成功后， 更新 currentRowIndex
        this.currentRowIndex = this.updateCurRowIndex(
          oldLenth,
          newLenth,
          emptyIndex
        );
      }

      this.$nextTick(() => {
        // this.addRow(recipeCode);
        this.addRowRelateGroup(recipeCode);
      });
    },
    // 插入的行是否要求成组
    isGroupingRow(nextRow = {}, preRow = {}) {
      console.log(nextRow, preRow, this.groupNoList);
      //上一个 下一个是组，插入中间就是自动成组
      return (
        isInGroup(nextRow, this.groupNoList) &&
        isInGroup(preRow, this.groupNoList)
      );
    },
    // 成组内插入明细
    addRowRelateGroup(recipeCode) {
      //判断插入明细是否在组内
      let {
        newRowNo,
        selectedRow,
        nextRow,
        crpRowLength,
        inserIndex
      } = this.cptAddRowNoAndIndex(recipeCode);

      let extendData = {};
      // 插入行在药品组中间
      if (this.isGroupingRow(nextRow, selectedRow)) {
        this.setRelateColValue([extendData], selectedRow);
        // console.log("extendData1", extendData);
        this.setRelateColState(extendData, "NotMajor", selectedRow);
        //console.log("extendData2", extendData);
        extendData = {
          ...extendData,
          ...{
            relation: selectedRow.no, //关联
            hasWhiteKey: true // 选中药品  不清空的字段
          }
        };
        // 关联禁用
        extendData["relation" + colDisabledText] = true;
        this.whiteKeyObj = extendData;
        console.log("this.whiteKeyObj", this.whiteKeyObj);
      }
      //新增明细 函数
      this.addRow(recipeCode, extendData);

      //更新 groupNoList
      this.groupNoList = updateGroupNoList(this.tableRuleForm.tableData);
    },
    // 计算新增的明细的序号 和 明细所在的处方已经有几条了
    // 存在  recipeCode 插入的index 在该处方的最后
    cptAddRowNoAndIndex(recipeCode = -1) {
      let inserIndex = this.addRowCmpPostion(recipeCode);
      let selectedRow = this.tableRuleForm.tableData[inserIndex - 1] || {};
      let nextRow = this.tableRuleForm.tableData[inserIndex] || {}; // 插入行的下一行

      // 选中行的下一行 如果selectedRow 是处方内的最后一条，下一行就是空
      if (nextRow.recipeCode !== selectedRow.recipeCode) {
        nextRow = {};
      }

      let crpRowLength = 0;
      let newRowNo = 0;
      //console.log("selectedRow", selectedRow, inserIndex);
      this.tableRuleForm.tableData.forEach(item => {
        if (item["recipeCode"] === selectedRow.recipeCode) {
          crpRowLength++;
        }
        if (
          item.recipeCode === selectedRow.recipeCode &&
          item.no * 1 > newRowNo
        ) {
          newRowNo = item.no * 1;
        }
      });

      return { crpRowLength, newRowNo, selectedRow, inserIndex, nextRow };
    },
    // 计算明细新增的位置
    addRowCmpPostion(recipeCode = -1) {
      // console.log("recipeCode", recipeCode);
      let inserIndex = this.tableRuleForm.tableData.length;
      //没有选中任一row
      // 有处方号
      if (recipeCode == -1) {
        if (this.currentRowIndex != -1) {
          inserIndex = this.currentRowIndex + 1;
        }
      } else {
        //获取相同处方号最后一个index，往后添加
        this.tableRuleForm.tableData.forEach((item, index) => {
          if (item.recipeCode === recipeCode) {
            inserIndex = index;
          }
        });
        inserIndex = inserIndex + 1;
      }
      return inserIndex;
    },
    //用户没有选中，默认最后一条选中，并选择该处方号
    // eslint-disable-next-line complexity
    //新增明细 工具函数
    addRow(recipeCode, extendData = {}) {
      //空 table 新增明细 提示用户 新增处方
      let addRowEmpty = {};
      // if (this.tableRuleForm.tableData.length === 0) {
      //  this.$message({
      //    type: "info",
      //    message: this.$t("cis.message.addRpMsg")
      //  });
      // } else {
      // var row = "";
      // if (this.multipleSelection.length === 0) {
      // this.$refs.multipleTable.toggleRowSelection(this.tableData[this.tableData.length - 1]);
      // row = this.tableRuleForm.tableData[
      //   this.tableRuleForm.tableData.length - 1
      // ];
      //   row = this.tableRuleForm.tableData[
      //     this.currentRowIndex
      //   ];
      // } else if (this.multipleSelection.length === 1) {
      //   row = this.multipleSelection[0];
      // } else if (this.multipleSelection.length > 1) {
      //   //新增元素只选择一项
      //   this.$message({
      //     type: "info",
      //     message: this.$t("cis.message.addEleMsg")
      //   });
      // }

      //在tableData 指定位置添加元素
      // if (row !== "") {
      // let inserIndex = this.addRowCmpPostion();
      // let row  = this.tableRuleForm.tableData[inserIndex - 1];
      // 校验药品处方条数，_index为当前处方条数
      // 未保存
      // if (
      //   typeof row.orderStatus === "undefined" ||
      //   row.orderStatus === ""
      // ) {
      //   this.$message.warning("该药品处方未保存，请保存后再新增明细！");
      //   return;
      // } else if (
      //   typeof row.orderStatus !== "undefined" &&
      //   row.orderStatus !== "" &&
      //   row.orderStatus !== "0"
      // ) {
      //   let msg =
      //     row.orderStatus === "2"
      //       ? "该药品处方已提交，不能新增医嘱！"
      //       : "该药品处方已收费，不能新增医嘱！";
      //   this.$message.warning(msg);
      //   return;
      // }

      // let _index = 0;
      // let no = 0;
      // this.tableRuleForm.tableData.forEach(item => {
      //   if (item["recipeCode"] === row.recipeCode) {
      //     _index++;
      //   }
      //   if (item.recipeCode === row.recipeCode && item.no * 1 > no) {
      //     no = item.no * 1;
      //   }
      // });
      // if (_index >= 5) {
      //   this.$message.warning("药品处方不能超过五条！");
      //   return;
      // }
      let {
        newRowNo,
        selectedRow,
        crpRowLength,
        inserIndex
      } = this.cptAddRowNoAndIndex(recipeCode);
      let row = selectedRow;
      if (crpRowLength >= 5) {
        this.$message.warning("药品处方不能超过五条！");
        return;
      }
      addRowEmpty = resetCurrentData(this, {
        recipeCode: row.recipeCode,
        recipeId: row.recipeId,
        no: newRowNo + 1,
        freeDrug: row.freeDrug,
        freeReason: row.freeReason,
        freeRecipe: row.freeRecipe,
        ...this.disSelectInfo,
        ...extendData
      });
      // this.tableColumn.forEach(item => {
      //   addRowEmpty[item.prop] = "";
      // });
      // addRowEmpty["recipeCode"] = row.recipeCode; // 初始化数据
      // addRowEmpty["recipeId"] = row.recipeId;
      // addRowEmpty["price"] = 0;
      // addRowEmpty["amt"] = 0;
      // addRowEmpty["no"] = no + 1;
      // addRowEmpty["orderItemName"] = ""; // 0107
      // addRowEmpty["frequencyCode"] = ""; // 0107
      // addRowEmpty["orderStatus"] = ""; // 0107
      // addRowEmpty["row_id"] = +new Date();
      // addRowEmpty["relation"] = undefined;
      // addRowEmpty["qty"] = undefined;
      // addRowEmpty["skinTestDisabled"] = true;
      // addRowEmpty["freeRecipe"] = row.freeRecipe;
      // addRowEmpty["freeReason"] = row.freeReason;
      // addRowEmpty["freeDrug"] = row.freeDrug;
      // addRowEmpty["overReasonShow"] = false;

      // this.clearTypeCurrent();
      // let inertIndex = this.addRowCmpPostion();
      // 获取相同处方号最后一个index，往后添加
      // this.tableRuleForm.tableData.forEach((item, index) => {
      //   if (item.recipeCode === row.recipeCode) {
      //     rowindex = index;
      //   }
      // });

      //console.log("addRow", addRowEmpty);

      this.tableRuleForm.tableData.splice(inserIndex, 0, addRowEmpty);
      this.currentRow = addRowEmpty;
      this.currentRowIndex = inserIndex;
      this.setCurrentLight(this.tableRuleForm.tableData[inserIndex]);
      this.getRpRowArr();
      // }

      //焦点定位到医嘱名称
      this.$nextTick(() => {
        let nodeList = getDataIdDom(
          "div",
          "data-id",
          "lInputTable" + addRowEmpty["row_id"]
        );
        if (nodeList.length > 0) {
          nodeList[1].getElementsByClassName("el-input__inner")[0].focus();
        }

        //处方列表 定位到最底下 最左面
        let rpTable = this.$refs.multipleTable;
        // console.log(rpTable.bodyWrapper);
        rpTable.bodyWrapper.scrollTop = rpTable.bodyWrapper.scrollHeight;
        rpTable.bodyWrapper.scrollLeft = 0;
      });
      // }
    },
    // eslint-disable-next-line complexity
    async submitAndAddRow() {
      // 1. 获取数据
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      // if (isRowInRelationed(currentRow)) {
      //   // console.log("走关联的逻辑");
      //   // 验证表单
      //   try {
      //     await this.maintableValidateWrapper();
      //   } catch (error) {
      //     // console.log(error);
      //     return;
      //   }
      //   //关联提交两条
      //   let relationRow = getRelationRow(
      //     this.tableRuleForm.tableData,
      //     currentRow
      //   );
      //   // console.log("走关联的逻辑", relationRow);
      //   let submitList = this.handleSubmitRowWrapper([relationRow, currentRow]);
      //   try {
      //     let result = await this.someDraftsSaveFunc(submitList, "关联");
      //     if (result) {
      //       this.addRow();
      //     }
      //   } catch (error) {}
      // } else
      //
      // debugger
      // 2.成组
      let { recipeCode } = currentRow;
      if (isInGroup(currentRow, this.groupNoList)) {
        // 验证表单
        // try {
        //   await this.maintableValidateWrapper();
        // } catch (error) {
        //   // console.log(error);
        //   return;
        // }

        // 成组提交多条
        // let { key, value } = getGroupListBygroupNo(
        //   this.groupNoList,
        //   currentRow
        // );
        //console.log("value", value, "this.groupNoList", this.groupNoList);
        // 成组的数据 清洗
        // value = this.handleSubmitRowWrapper(value);
        //保存
        try {
          // let result = await this.someDraftsSaveFunc(value, "成组");
          let result = await this.draftSaveAll();
          // 新增一行
          if (result) {
            console.log("recipeCode", recipeCode);
            // this.currentRowIndex = oldCrtIndex;
            this.addRowWrapper(recipeCode);
          }
        } catch (error) {}
      } else {
        // 提交单条医嘱
        try {
          console.log("recipeCode", recipeCode);
          // let submitCurRowResult = await this.submitCurRow();
          let submitCurRowResult = await this.draftSaveAll();
          if (submitCurRowResult) {
            // this.currentRowIndex = oldCrtIndex;
            this.addRowWrapper(recipeCode);
          }
        } catch (e) {}
      }
    },

    // 是否多个行成组
    // 方法废弃
    // isRowInGrouped(currentRow) {
    //   //console.log("list 多行", this.groupNoList);
    //   let { key, value } = getGroupListBygroupNo(this.groupNoList, currentRow);

    //   return value.length > 1;
    // },

    // submitCurRowThrottle: Throttle(async function() {
    //   try {
    //     let submitCurRowResult = await this.submitCurRow();
    //     if (submitCurRowResult) {
    //       this.addRow();
    //     }
    //   } catch (e) {}
    // }, 3000),

    //回车触发提交事件 备注失去焦点
    setCurRowBlur() {
      try {
        let target_id =
          this.tableRuleForm.tableData[this.currentRowIndex]["row_id"] ||
          this.tableRuleForm.tableData[this.currentRowIndex]["id"];
        let nodeList = getDataIdDom("div", "data-id", "remark" + row_id);
        if (nodeList.length > 0) {
          nodeList[1].getElementsByClassName("el-input__inner")[0].blur();
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    },

    //抗菌药品权限 验证
    getDrugsAuthority(list) {
      return new Promise(async (resolve, reject) => {
        this.listLoading = true;
        try {
          let { code, data, msg } = await validAntibacterialAuth(list);
          if (code === 1 || code === 3 || code === 4 || code === 20001015) {
            resolve({
              code,
              msg
            });
          } else {
            this.$message.error(msg || "获取开药权限失败！");
            reject("获取开药权限失败！");
          }

          this.listLoading = false;
        } catch (error) {
          this.$message.error("获取开药权限失败！");
          this.listLoading = false;
          reject("获取开药权限失败！");
        }
      });
    },
    handleSubmitRowWrapper(multipleData = []) {
      let patientInfo = this.receivePatientData;
      let pharmacyId = this.searchForm.pharmacyId;
      let disSelectInfo = this.disSelectInfo;
      console.log("disSelectInfo", this.disSelectInfo);
      // multipleData = this.setDisSelectInfo(multipleData);
      //处理 提交的数据 quantity unitFlag  skinTest  urgent no
      return handleSubmitRow(
        multipleData,
        patientInfo,
        pharmacyId,
        disSelectInfo
      );
    },
    // 增加 病种选择 字段
    setDisSelectInfo(multipleData = []) {
      multipleData.forEach(item => {
        if (!item.id && item.row_id) {
          this.$set(item, "chronicDisease", this.disSelectInfo.chronicDisease);
          this.$set(
            item,
            "chronicDiseaseName",
            this.disSelectInfo.chronicDiseaseName
          );
        }
      });
      return multipleData;
    },
    // 提交表单 备注 回车 tab 键 提交当前行
    submitCurRow() {
      if (this.submitCurRowFlag) {
        return;
      }
      let self = this;
      this.submitCurRowFlag = true;
      /* eslint-disable no-multi-spaces */
      /* eslint-disable consistent-return */
      /* eslint-disable complexity */
      /* eslint-disable no-useless-concat */
      /* eslint-disable consistent-return */
      /* eslint-disable complexity */
      return new Promise(async (resolve, reject) => {
        // 验证表单
        try {
          await this.maintableValidateWrapper();
        } catch (error) {
          // this.submitCurRowFlag = false;
          reject();
          this.submitCurRowFlag = false;
          return false;
        }

        // eslint-disable-next-line consistent-return
        // this.$refs["ruleForm"].validate(async valid => {
        // if (valid) {
        // debugger
        // let current = this.currentRow;
        let current = this.tableRuleForm.tableData[this.currentRowIndex];
        // console.info(this.selectDrop.drugItem);
        //debugger;
        let form = this.tableRuleForm.tableData[this.currentRowIndex];
        /* console.log(
                  form,
                  typeof form.dropRate1,
                  typeof form.dropRate2,
                  form.dropRate2 < form.dropRate1
                ); */
        // console.log("this.currentRow里面的useWay",current.useWay);
        // console.log("this.drugItem里面的useWay",this.drugItem.useWay);
        // this.selectDrop.drugItem.id =  current ? current.id : "";
        let orderItem = { ...current };
        // console.log("orderItem里面的useWay",orderItem.useWay);
        // console.info("orderItem", orderItem)

        if (!this.validateQty(orderItem, orderItem.qty, orderItem.unitKey)) {
          this.submitCurRowFlag = false;
          return false;
        }

        if (
          typeof orderItem.visitCode === "undefined" ||
          orderItem.visitCode === ""
        ) {
          this.$message.warning("请选择接诊患者后才可保存医嘱！");
          this.submitCurRowFlag = false;
          return false;
        }
        if (
          typeof orderItem.orderItemId === "undefined" ||
          orderItem.orderItemId === ""
        ) {
          this.$message.warning("请选择医嘱项目之后再保存！");
          this.submitCurRowFlag = false;
          return false;
        }
        if (
          typeof orderItem.recipeCode === "undefined" ||
          orderItem.recipeCode === ""
        ) {
          this.$message.warning("处方号不能为空！");
          this.submitCurRowFlag = false;
          return false;
        }

        //验证关联药品
        // console.info(form, current)
        // debugger
        // if (form.relation > current.no || form.relation <= 0) {
        //   this.$message.warning("关联医嘱序号有误，请核对后再填写！");
        //   this.tableRuleForm.tableData[
        //     this.currentRowIndex
        //   ].relation = undefined;
        //   this.submitCurRowFlag = false;
        //   return false;
        // }

        // console.log("用药天数有误，请核对后再填写！ form.useDay用药天数：", form.useDay);

        //用药天数不能小于0
        if (typeof form.useDay === "undefined" || form.useDay <= 0) {
          this.$message.warning("用药天数有误，请核对后再填写！");
          this.submitCurRowFlag = false;
          return false;
        }

        // 滴速
        // if (form.useWay === "404") {
        //   if (
        //     typeof form.dropRate1 === "undefined" ||
        //     typeof form.dropRate2 === "undefined" ||
        //     form.dropRate2 < form.dropRate1
        //   ) {
        //     this.$message.warning("滴速填写错误！");
        //     this.submitCurRowFlag = false;
        //     return false;
        //   }
        //     form.dropRate = form.dropRate1 + "~" + form.dropRate2;

        // }

        //数量换算
        // 换算最小单位数量
        // let qty =
        //   form.unitKey === orderItem.packUnit
        //     ? form.qty * 1 * orderItem.packQuantity
        //     : form.qty;

        // 医生选择单位标识 0-小包装单位  1-大包装单位

        form = this.handleSubmitRowWrapper([form])[0];
        orderItem = { ...orderItem, ...form };

        // 超7天校验  没有超量原因
        let hasReason =
          typeof orderItem.excessReason === "undefined" ||
          orderItem.excessReason === ""
            ? false
            : true;
        // if (orderItem.day > 7 && !hasReason) {
        //   //弹出填写超量原因提示框，并填写提交
        //   this.overReason = true;
        //   return;
        // }

        // 天数超量控制三位数 // 2020-8-28 天数超量控制不限天数
        // if (orderItem.day.toString().length > 2) {
        //   this.$message.warning("可用天数过长，请确认后再保存");
        //   this.submitCurRowFlag = false;
        //   return false;
        // }

        // console.info(
        //   orderItem.orderStatus === "" || orderItem.orderStatus === "0"
        // );
        if (!isZanCunAddNewStatus(orderItem)) {
          this.$message.warning("仅支持医嘱状态为暂存的医嘱进行保存！");
          this.submitCurRowFlag = false;
          return false;
        }
        if (
          !(
            typeof orderItem.chargeStatus === "undefined" ||
            orderItem.chargeStatus === "" ||
            orderItem.chargeStatus === "0" ||
            (orderItem.chargeStatus === "4" && orderItem.selfProvided === "0")
          )
        ) {
          this.$message.warning("已收费的医嘱不可编辑！");
          this.submitCurRowFlag = false;
          return false;
        }

        this.listLoading = true;
        // console.log("提交的数据useWay",orderItem.useWay);
        orderItem = this.setOrderFromParam(orderItem); //补费 电子处方 区别的参数

        //开药权限验证
        /* try {
              let arr = [];
              let filter = {
                orderItemName: orderItem.orderItemName,
                manageType: orderItem.manageType
              };
              arr.push(filter);
              let { code, msg } = await this.getDrugsAuthority(arr);
              if (code === 3) {
                try {
                  await this.drugsAuthorityConfirm(msg);
                } catch (error) {
                  this.submitCurRowFlag = false;
                  return;
                }
              } else if (code === 4 || code === 20001015) {
                this.$message.error(msg);
                this.$nextTick(() => {
                  this.$refs.lInputTable.forEach(item => {
                    if (
                      item.$el.getAttribute("data-id") ===
                      "inputTable" + orderItem.row_id
                    ) {
                      this.freq = {};
                      this.drugItem = {};
                      this.tableRuleForm.tableData[
                        this.currentRowIndex
                      ].orderItemName = "";
                      this.tableRuleForm.tableData[
                        this.currentRowIndex
                      ].orderItemId = "";
                      this.tableRuleForm.tableData[
                        this.currentRowIndex
                      ].frequencyCode = "";
                      this.tableRuleForm.tableData[
                        this.currentRowIndex
                      ].useWay = "";
                      this.tableRuleForm.tableData[
                        this.currentRowIndex
                      ].useDay = 1;
                      this.tableRuleForm.tableData[
                        this.currentRowIndex
                      ].qty = undefined;
                      item.clear();
                      item.focus();
                    }
                  });
                });
                this.submitCurRowFlag = false;
                return;
              }

              console.log("可提交了！");
            } catch (error) {
              this.submitCurRowFlag = false;
              return;
            } */

        saveOrder(orderItem)
          // eslint-disable-next-line complexity
          .then(async res => {
            this.listLoading = false;
            this.submitCurRowFlag = false; //重复提交锁
            if (res.code === 1) {
              this.$message.success(res.msg ? res.msg : "医嘱暂存成功");
              // this.addRow();
              // this.drugItem = {}; //当条数据暂存后，清空drugItem的数据
              // this.freq = {}; //当条数据暂存后，清空freq的数据
              // save btn 存储 数据
              this.$emit("save");

              try {
                let getListResult = await this.getList();
                if (getListResult) {
                  resolve(true);
                }
              } catch (e) {
                reject(e);
              }
            } else if (res.code === 20001015) {
              // 如果code是20001015,提示"医生没有抗菌药品权限"，清空行
              this.$message.error(res.msg ? res.msg : "医生没有抗菌药品权限");

              self.currentRow.orderItemName = "";
              let index =
                self.$refs.lInputTable.length > 2
                  ? self.currentRowIndex * 2
                  : 0;
              // 清空药品搜索
              self.$refs.lInputTable[index] &&
                self.$refs.lInputTable[index].clear();
              self.$refs.lInputTable[index + 1] &&
                self.$refs.lInputTable[index + 1].clear();
              reject();
              // eslint-disable-next-line no-multi-spaces
            } else {
              this.$message.error(res.msg ? res.msg : "医嘱暂存失败");
              this.listLoading = false;
              reject();
            }
          })
          .catch(error => {
            this.submitCurRowFlag = false;
            this.listLoading = false;
            reject(error);
          });
      });
      // });
    },
    //单次计量 控制
    inputHandler() {
      //console.log("单次剂量变动了");
      //console.log('onceDosage:::::::::',this.selectDrop.ruleForm.onceDosage);
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      // this.inputMaxL = /^\d+\.?\d{0,1}$/.test(currentRow.onceDosage)
      //   ? null
      //   : currentRow.onceDosage.length - 1;
      //console.log('onceDosage:::::::::',this.inputMaxL);
      if (!isNaN(currentRow.onceDosage) && currentRow.onceDosage !== "") {
        this.handleQty();
      }
    },
    isCheckDisabled(row, index) {
      // 多选框是否禁用, 未收费可勾选
      /* return (
        isZanCunAddNewStatus(row) ||
        (row.chargeStatus === "4" && row.useWay !== "901")
      ); */
      return true;
    },
    // 数量 后面的单位改变
    unitChange(value, row) {
      // this.currentRow.unit = this.getLabel(this.currentRow.unitOptions, value);
      let currentRow = row;

      //备注：如果不可拆零，数量只能是整数
      // 如果可拆零，选择小单位时只能是整数
      if (currentRow.unitSaleFlg === "0") {
        //单位不可拆零 数量只能是整数
        currentRow.qtyStep = 1;
      } else if (currentRow.unitSaleFlg === "1") {
        //单位可拆零 选择小单位时只能是整数
        if (currentRow.packUnit !== value) {
          //最小单位必须是整数
          currentRow.qtyStep = 1;
        } else {
          currentRow.qtyStep = 0.5;
        }
      }
      this.currentRow = row;
      this.currentRowIndex = row.trindex; // 设置当前行数据
      this.$refs.multipleTable.setCurrentRow(row);
      //单位改变 数量会改变
      // 医生选择单位标识 0-小包装单位  1-大包装单位
      row.quantity = row.qty = this.handleQtyUtil(
        row.useDay,
        row,
        row.onceDosage,
        row.dosage,
        row
      );
      this.computeAmt();
    },
    // getLabel(optList, key) {
    //   let obj = optList.find(item => {
    //     return item.value === key;
    //   });
    //   return obj.label;
    // },

    setLInputTableFocus() {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      setComponentFocusFunc("lInputTable", currentRow.row_id);
    },

    search(query) {
      // 补费 逻辑代码
      /* if (!this.execDept && this.pageType === "additionCost") {
        this.$message.warning("请先选择执行科室！");
        return;
      } */
      setLInputTableShotReady(
        "off",
        this.tableRuleForm.tableData[this.currentRowIndex],
        this
      );
      if (!this.searchForm.pharmacyId && this.pageType === "additionCost") {
        this.$message.warning("请先选择执行科室！");
        return;
      }
      let pageNo = 1;
      let tableData = [];
      if (this.queryName === query) {
        tableData = this.selectOptions;
        pageNo = Number(this.currentPage) + 1;
        // if (this.currentPage < 1)
        //console.log("pageNo", pageNo, "total", this.total, this.pageSize);
        // if (Number(pageNo) > Number(this.total) / Number(this.pageSize)) {
        //   return;
        // }
      }

      let data = {
        ...{
          pageNo: pageNo,
          pageSize: this.pageSize,
          name: query,
          cwType: "1",
          // activeType: ["10", "12"],
          activeType: "10,12",
          execDept:
            this.searchForm.pharmacyId || this.drugRoomList[0].deptId || "",
          freeDrug: this.currentRow.freeRecipe == 1 ? 1 : "" //免费处方入参
        }
      };

      this.inputTableLoading = true; //增加loading
      // eslint-disable-next-line complexity
      drugItemListWithStorge(data).then(res => {
        if (res.code === 1) {
          let { data } = res;
          let tableData = pageNo !== 1 ? this.selectOptions : []; //取消药品分页
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            tableData.push({
              ...item,
              itemId: item.itemId || "",
              relateItemId: item.relateItemId || "",
              itemCode: item.itemCode || "",
              orderItemName: item.drugName || "",
              production: item.production || "",
              itemType: item.itemType || "",
              classCode: item.classCode || "",
              itemTypeName: item.itemTypeName || "",
              execDeptCode: item.execDeptCode || "",
              execDeptName: item.execDeptName || "",
              spec: item.spec || "",
              price: new Number(item.price).rewToFixed(4) || "",
              unit: item.unit || "",
              limitUnit: item.limitUnit || "",
              packQuantity: item.packQty || "",
              defaultDosageUnit: item.defaultDosageUnit || "",
              defaultUsage: item.defaultUsage || "",
              dosage: item.dosage || "",
              stockNum: item.stockNum || "0",
              manageType: item.manageType || "",
              formCode: item.formCode || "",
              basicType: item.basicType || "",
              unitSaleFlg: item.unitSaleFlg || "",
              reimburseMark: item.reimburseMark || "",
              reimburseName: item.reimburseName || "",
              clinicMark: item.clinicMark || "", //成组样式
              medicareItemCode: item.medicareItemCode || "",
              medicareItemName: item.medicareItemName || "",
              stClassCode: item.stClassCode || "",
              stType: item.stType || "",
              stSolutionType: item.stSolutionType || "",
              stRemindTime: item.stRemindTime || "",
              validTime: item.validTime || "",
              positiveDispense: item.positiveDispense || "",
              medicalInsuranceCat: item.expenseLevel || "",
              applicationRange: item.applicationRange || ""
            });
          }
          this.selectOptions = tableData;
          this.currentPage = res.pageNo;
          this.pageSize = res.pageSize;
          this.total = res.total;
          this.queryName = query;
        } else {
          this.$message.error(res.msg ? res.msg : "获取数据失败");
        }
        this.inputTableLoading = false; //增加loading
      });
    },

    // 重置下拉table的分页数据
    resetLInputTablePaging() {
      this.selectOptions = [];
      this.currentPage = 0;
      this.pageSize = 10;
      this.total = 11;
    },
    resetAllCurRowData() {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      // 重置 当前行数据  START
      let addRowEmpty = resetCurrentData(this, {
        recipeCode: currentRow.recipeCode,
        no: currentRow.no,
        recipeId: currentRow.recipeId,
        freeDrug: currentRow.freeDrug,
        freeReason: currentRow.freeReason,
        row_id: currentRow.row_id,
        freeRecipe: currentRow.freeRecipe,
        hasWhiteKey: currentRow.hasWhiteKey,
        ...this.disSelectInfo
      });
      console.log("addRowEmpty:::", addRowEmpty, addRowEmpty.row_id);
      this.$set(
        this.tableRuleForm.tableData,
        this.currentRowIndex,
        addRowEmpty
      );
      // 重置 当前 行 END
    },
    async selectDropRow(rowInit) {
      this.resetLInputTablePaging();

      if (!rowInit) {
        return;
      }

      let row = { ...rowInit };

      // console.log("row.no", row.no, row);
      // 重置 当前行数据  START
      this.resetAllCurRowData();

      //权限校验
      if (typeof this.currentRow.id === "undefined") {
        try {
          row = await checkLimitFunc(row, this);
          // 医生审核弹窗
          let { limitMsg, limitResultCode } = row;

          if (limitResultCode == 1) {
            // 弹窗
            try {
              let { confirmCode } = await doctorPsReviewLimit(limitMsg);
              if (confirmCode == 1) {
                //审批通过
                console.log("是 审批通过");
              } else if (confirmCode == 0) {
                // 否（自费使用）
                console.log("否 自费使用");
              }
              this.$set(row, "limitResultCode", confirmCode);
            } catch (error) {
              console.log("清空当前行");
              //清空当前行
              clearCurrentRow(
                this.tableRuleForm.tableData[this.currentRowIndex],
                this
              );
              return;
            }
          } else {
            //重置 limitResultCode
            this.$set(row, "limitResultCode", null);
          }
        } catch (error) {
          /*           this.$set(
            this.tableRuleForm.tableData[this.currentRowIndex],
            "_shotIsReady",
            false
          ); */
          return;
        }
      }

      //重复医嘱提示 通知父组件判断是否有相同医嘱
      if (typeof this.currentRow.id === "undefined") {
        try {
          await checkDupFunc(row, this);
        } catch (error) {
          /*this.$set(
            this.tableRuleForm.tableData[this.currentRowIndex],
            "_shotIsReady",
            false
          ); */
          return;
        }
      }

      //判断是否有药品库存
      if (typeof this.currentRow.id === "undefined") {
        try {
          row = await checkZeroFunc(row, this);
        } catch (error) {
          /*           this.$set(
            this.tableRuleForm.tableData[this.currentRowIndex],
            "_shotIsReady",
            false
          ); */
          return;
        }
      }

      //过敏药品提示
      try {
        await checkDrugAllergyFunc(row, this);
      } catch (error) {
        /*         this.$set(
          this.tableRuleForm.tableData[this.currentRowIndex],
          "_shotIsReady",
          false
        ); */
        return;
      }

      try {
        // 皮试结果提示
        await getExecResultBySelect(row, this);
      } catch (error) {
        /*         this.$set(
          this.tableRuleForm.tableData[this.currentRowIndex],
          "_shotIsReady",
          false
        ); */
        return;
      }

      this.select(row);

      console.log("cdss 所需数据", this.tableRuleForm.tableData);
      // cdss 服务
      this.setDrugConflictList(this.tableRuleForm.tableData);
    },

    // eslint-disable-next-line complexity
    async select(row) {
      // console.log(row);
      // debugger
      //设置非编辑行
      let {
        visitCode,
        patientId,
        patientCode,
        patientName
      } = this.$store.state.base.receivePatientData; //获取患者信息
      let curObj = this.currentRow;
      let recipeCode = curObj ? curObj["recipeCode"] : ""; //获取当前处方号
      let recipeId = curObj ? curObj["recipeId"] : ""; //获取当前处方号
      let id = curObj ? curObj["id"] : "";
      let qtyStep = 1;
      // if (row.unitSaleFlg == 1) {//单位可拆零 选择小单位时只能是整数
      //   qtyStep = 1;
      // } else if (row.unitSaleFlg == 0) { //单位不可拆零 数量只能是整数，
      //   qtyStep = 1;
      // }
      // console.log(row.unitSaleFlg);
      let data = {
        ...row,
        id: id,
        unitSaleFlg: row.unitSaleFlg, // 1 是可拆分  0 是不可拆分
        qtyStep: qtyStep,
        visitCode: typeof visitCode === "undefined" ? "" : visitCode,
        patientId: patientId,
        patientName: patientName,
        patientCode: patientCode,
        recipeCode: recipeCode,
        recipeId: recipeId,
        orderCat: row.itemType,
        spec: row.spec,
        price: row.price,
        dosage: row.dosage,
        packQuantity: row.packQuantity,
        dosageUnit: row.defaultDosageUnit,
        orderItemName: row.orderItemName,
        orderItemId: row.itemId,
        relateItemId: row.relateItemId,
        orderItemCat: row.itemType,
        classCode: row.classCode,
        receiveDept: row.execDeptCode,
        manageType: row.manageType,
        formCode: row.formCode,
        dataVersion: row.dataVersion ? row.dataVersion : 0,
        stockNum: row.stockNum,
        limitUnit: row.limitUnit,
        packUnit: row.unit,
        unitKey: row.unit,
        drugDosage: row.dosage + row.defaultDosageUnit,
        stClassCode: row.stClassCode || "",
        stType: row.stType || "",
        orderId: row.relateItemId || "",
        stSolutionType: row.stSolutionType || "",
        stRemindTime: row.stRemindTime || "",
        validTime: row.validTime || "",
        positiveDispense: row.positiveDispense || "",
        applicationRange: row.applicationRange || "",
        execDeptName: row.execDeptName || "",
        useWay: row.defaultUseWay,
        onceDosage: row.defaultOnceDosage,
        frequencyCode: row.defaultFrequencyCode,
        frequencyUnit: row.defaultFrequencyUnit,
        frequencyTimes: row.defaultFrequencyTimes,
        useDay: 1, // 用药天数默认 1
        freeDrug: row.freeDrug,
        medicalInsuranceCat: row.medicalInsuranceCat || "",
        cutable: row.cutable
      };
      try {
        await getQtyUnitAjax(data, this).then(res => {
          data.unitOptions = res;
        });
      } catch (error) {}

      selectSkinTestController(data);
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];

      // this.currentRow = Object.assign(this.currentRow, data);
      for (let key in data) {
        this.currentRow[key] = data[key];
        this.$set(currentRow, key, data[key]);
      }

      // console.log("currentRow:::::", currentRow, currentRow.medicalInsuranceCat);
      // 判断药品是否可拆零 默认小单位 1 是可拆分  0 是不可拆分
      if (
        currentRow.unitSaleFlg === "1" ||
        (currentRow.unitSaleFlg === undefined && currentRow.limitUnit)
      ) {
        currentRow.unitKey = currentRow.limitUnit;
      }

      let { hasWhiteKey = false } = currentRow;
      //console.log("currentRow", currentRow);
      if (hasWhiteKey) {
        let newCurRow = {
          ...currentRow,
          ...this.whiteKeyObj
        };
        this.$set(
          this.tableRuleForm.tableData,
          this.currentRowIndex,
          newCurRow
        );
      }

      //设置选择药品值
      // this.drugItem = data;

      // this.selectDrop.displayList.forEach(item => {
      //   if (row[item.prop] !== undefined) {
      //     item.value = row[item.prop];
      //   }
      // });
      // this.updateTableData_list();

      // this.selectDrop.ruleForm = {
      //   ...this.selectDrop.ruleForm,
      //   ...{ unitKey: data.packUnit, dosageUnit: data.dosageUnit }
      // };
      // this.$refs.lInputTable.clear();

      // 更新药品字典查询条件
      // this.changeDrugName({drugName: row.orderItemName});
      // 光标给到输入框
      // document.getElementById("onceDosageInput").focus();

      /*this.$refs.onceDosage.$el
              .getElementsByClassName("el-input__inner")[0]
              .focus();*/

      //焦点定位到一次用量
      /* this.$nextTick(() => {
        setComponentFocusFunc("onceDosage", this.currentRow.row_id);
      }); */

      setLInputTableShotReady(
        "on",
        this.tableRuleForm.tableData[this.currentRowIndex],
        this
      );
      this.handleQty(); // 计算金额和数量
      // 更新 groupNoList
      this.groupNoList = updateGroupNoList(this.tableRuleForm.tableData);

      this.$nextTick(() => {
        setTimeout(() => {
          setComponentFocusFunc("onceDosage", this.currentRow.row_id);
        }, 20);
      });
    },

    //取消皮试勾选时
    changeSkinTest(row) {
      let { patientId } = this.$store.state.base.receivePatientData; //获取患者信息
      // let drugItem = this.drugItem;
      let data = row;

      // this.selectSkinTestController(data);
      // 取消皮试且皮试药品类型为必须皮试
      if (row.skinTest === "0" && row.stType === "1") {
        // 先判断皮试结果是否有效
        getExecResult({
          patientId: patientId,
          // drugId: row.relateItemId
          drugId: row.orderItemId
        }).then(res => {
          if (res.code === 1) {
            if (res.data.length > 0) {
              let flag = true;
              /* for(let i = 0; i < res.data.length; i++){
                    if(res.data[i].registerResult === "1"){
                      flag = false;
                    }
                  }*/
              // 如果有多条皮试记录，则选择最新一条有效记录
              let result = res.data[0];
              let year = result.execTime.slice(0, 4);
              let m = result.execTime.slice(5, 7);
              let d = result.execTime.slice(8, 10);
              if (result.execResult === "1") {
                // 无皮试结果要进行皮试
                row.skinTest = "1";
                this.$message.warning(
                  "患者于" +
                    year +
                    "年" +
                    m +
                    "月" +
                    d +
                    "日" +
                    " 进行的皮试结果为阳性，必须进行皮试！"
                );
              } else {
                this.$message.warning(
                  "患者于" +
                    year +
                    "年" +
                    m +
                    "月" +
                    d +
                    "日" +
                    " 进行的皮试结果为阴性"
                );
              }
            } else {
              // 无皮试结果要进行皮试
              row.skinTest = "1";
              this.$message.warning(
                "皮试药品:" +
                  data.orderItemName +
                  "暂无有效结果，必须进行皮试！"
              );
            }
          } else {
            row.skinTest = "1";
            this.$message.error(res.msg ? res.msg : "获取数据失败");
          }
        });
      } else if (row.skinTest === "0" && row.stType === "0") {
        row.skinTest = "0";
      }
    },
    // 计算金额
    computeAmt(value) {
      // if (value !== undefined) {
      if (isNaN(value)) {
        value = 0;
      }
      // }
      this.$nextTick(() => {
        // let curObj = deepClone(this.currentRow);
        let curObj = this.tableRuleForm.tableData[this.currentRowIndex];
        let orderItem = { ...curObj };
        // let unitKey = curObj.unitKey;
        let unitKey = curObj.unitKey;
        let qty = curObj.qty;
        let packUnit = curObj.packUnit;

        // if (this.currentRow.qty != value) {// 修复 currentRow.useDay 没有及时更新 造成 useDay的计算问题
        //   qty = value;
        // }

        let price =
          typeof orderItem.price !== "undefined" ? orderItem.price : 0;
        let packQty = orderItem.packQuantity ? orderItem.packQuantity * 1 : 1;
        let amt = 0; // 金额
        let num = 0; // 预减库存

        // 先判断选中单位是否为包装单位，单位不同，计算规则不同
        // if (unitKey === orderItem.packUnit) {
        //   amt = (price * 100 * qty) / 100; //计算金额
        //   num = packQty * qty;
        // } else {
        //   amt = ((price * 100) / packQty / 100) * qty; //计算金额
        //   num = qty;
        // }
        amt = amtCalculatFunc(
          qty,
          price,
          packQty,
          getUnitFlag(packUnit, unitKey)
        );
        // this.drugItem.amt = amt;
        let stockNum = 0;
        /*        this.selectDrop.displayList.forEach(item => {
                if (item.prop === "amt") {
                  item.value = Math.round(amt * 100) / 100;
                }
                if (item.prop === 'stockNum') {
                    stockNum = item.value * 1;
                  }
                  if (item.prop === 'preStockNum') {
                    item.value = stockNum - num;
                  }
              });*/

        // this.currentRow.amt = Math.round(amt * 100) / 100;
        try {
          this.tableRuleForm.tableData[this.currentRowIndex].amt =
            Math.round(amt * 100) / 100;
        } catch (e) {}
        this.computeDay();
        // 处方总金额计算
        this.computeRptotal();
        // this.updateTableData_list();
      });
    },
    // 处方总金额计算
    computeRptotal() {
      // 处方总金额计算
      this.Rptotal = computeTotalHandler(
        this.tableRuleForm.tableData.filter(
          // 去掉自备药和免费处方
          item => !isFreeDrug(item) && !isSelfProvidedDrug(item)
        )
      );
    },
    // 计算天数
    computeDay() {
      // eslint-disable-next-line complexity
      // this.$nextTick(() => {
      // debugger
      let rowData = this.tableRuleForm.tableData[this.currentRowIndex];
      // let { freq, drugItem, ruleForm } = deepClone(this.selectDrop);
      // let freq = Object.keys(this.freq).length > 0 ? this.freq : rowData;
      let freq = rowData;
      // let drugItem = this.drugItem;
      let drugItem = rowData;
      let ruleForm = rowData;
      let orderItem = rowData;
      // let onceDosage = ruleForm.onceDosage ? ruleForm.onceDosage : 0;
      let qty = orderItem.qty;
      // let times = 1;
      // let day = 0;
      // if (freq.frequencyUnit === "天") {
      //   times = freq.frequencyTimes;
      // } else if (freq.frequencyUnit === "周") {
      //   times = freq.frequencyTimes / 7;
      // } else if (freq.frequencyUnit === "月") {
      //   times = freq.frequencyTimes / 30;
      // }
      //计算 可用天数 和 超量控制
      overReasonShowControlFunc(qty, orderItem, this);
      // if (onceDosage !== 0) {
      //   day = (qty * orderItem.dosage) / onceDosage / times;
      //   day = Math.ceil(day); //向上取整  可用天数字段
      // }
      // this.tableRuleForm.tableData[this.currentRowIndex].day = day;
      // this.$set(rowData, "day", day)
      // 控制超量
      // this.overReasonShowControl(day);
      // this.currentRow.day = day;
      // this.selectDrop.displayList.forEach(item => {
      //   if (item.prop === "day") {
      //     item.value = day;
      //   }
      // });

      // this.currentRow.day = Math.round(amt * 100) / 100;

      // });
    },
    // overReasonShowControl (day){
    //   this.$nextTick(()=>{
    //     let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
    //     if (typeof day != "undefined" && day > 7) {
    //       this.$set(currentRow, "overReasonShow", true);
    //     } else {
    //       this.$set(currentRow, "overReasonShow", false);
    //     }
    //     //显示超量提醒
    //     if (!(typeof day != "undefined" && day > 7)) {
    //       currentRow.excessReason = "";
    //     }
    //   })
    // },
    // 用药天数 change 回调
    handleUseDay(value, row) {
      //console.log(value, row.useDay, this.tableRuleForm.tableData[this.currentRowIndex].useDay, this.groupNoList);
      if (isMajorRow(row)) {
        setRelateGroupNo(this.groupNoList, row, this);
      }
      this.handleQty();
    },
    // 处理用法 函数
    handleUseWay(value, item, row) {
      // if (item.name.indexOf("滴注") === -1 || item.code !== "404") {
      //   // 清空滴速
      //   this.currentRow = {
      //     ...this.currentRow,
      //     dropRate: "",
      //     dropRate1: "",
      //     dropRate2: ""
      //   };
      //   this.$set(this.tableRuleForm.tableData, this.currentRowIndex, {
      //     ...this.tableRuleForm.tableData[this.currentRowIndex],
      //     dropRate: "",
      //     dropRate1: "",
      //     dropRate2: ""
      //   });
      // }

      if (isMajorRow(row)) {
        setRelateGroupNo(this.groupNoList, row, this);
      }

      console.log("cdss 所需数据", this.tableRuleForm.tableData);
      // cdss 服务
      this.setDrugConflictList(this.tableRuleForm.tableData);
    },
    // 选中频次处理方法
    handleFreq(value, item, row) {
      // console.log(value, item, row);
      //频率 cycleUnit 统一成 frequencyUnit
      // this.freq = {
      //   ...item,
      //   ...{
      //     frequencyUnit: item.cycleUnit
      //   }
      // };

      // console.log("row.trindex:::", row.trindex);
      this.currentRow = row;
      this.currentRowIndex = row.trindex; // 设置当前行数据
      this.$refs.multipleTable.setCurrentRow(row);

      //currentRow 对 frequencyTimes  frequencyUnit 赋值 START
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      this.$set(currentRow, "frequencyTimes", item.frequencyTimes);
      this.$set(currentRow, "frequencyUnit", item.cycleUnit);
      //currentRow 对 frequencyTimes  frequencyUnit 赋值 END
      console.log(row);
      if (isMajorRow(row)) {
        setRelateGroupNo(this.groupNoList, currentRow, this);
      }
      this.handleQty();
    },

    //限制用药天数只能输入正整数
    // limitNum(e) {
    //   var license_num = e.target.value;
    //   license_num = license_num.replace(/[^\.\d]/g, ""); // 清除“数字”和“.”以外的字符
    //   if (license_num.indexOf(".") < 0 && license_num != "") {
    //     // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    //     e.target.value = parseInt(license_num);
    //   }

    //   if (license_num == 0) {
    //     e.target.value = "";
    //   } else {
    //     e.target.value = license_num;
    //   }
    // },
    // 输入用药天数时，计算数量
    handleQty(value) {
      // debugger
      if (value !== undefined) {
        if (isNaN(value) || value.toString().indexOf("-") >= 0) {
          return;
        }
      }
      if (this.currentRowIndex == -1) return;
      // eslint-disable-next-line complexity
      this.$nextTick(() => {
        let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
        // let freq = Object.keys(this.freq).length > 0 ? this.freq : currentRow;
        let freq = currentRow;

        let orderItem = currentRow;
        let onceDosage = currentRow.onceDosage ? currentRow.onceDosage : 0;
        let times = 1;
        let useDay =
          typeof currentRow.useDay !== undefined ? currentRow.useDay : 0;

        let qty = this.handleQtyUtil(
          useDay,
          freq,
          onceDosage,
          orderItem.dosage,
          orderItem
        );

        try {
          this.tableRuleForm.tableData[this.currentRowIndex].qty = qty;
        } catch (e) {}

        try {
          this.currentRow.qty = qty;
        } catch (e) {}
        // console.log("useDay,qty", useDay, qty);
        // 计算可用天数
        this.computeAmt();
      });
    },

    // selection 选中 的 函数
    handleSelectionChange(val) {
      console.info("========handleSelectionChange", val);
      this.multipleSelection = val;
      this.$store.dispatch("cis/setMultipleSelections", val);
      // 选中当前行

    },
    handleSelect(selection, row) {
      let isChecked =
        selection.filter(item => {
          return item.id === row.id;
        }).length > 0;
      this.setBunchingSelect([row], isChecked);
    },
    // 关联医嘱时。获取所关联医嘱的频次、用药方法、用药天数
    relateAdvice(value, row, colName) {
      let curObj = this.tableRuleForm.tableData[this.currentRowIndex];

      if (this.isRelationValueEmpty(curObj)) {
        // this.relateAdviceDisabled = false;
        // 初始 该数据是白身 清空关联框时，频次用法去掉禁用
        if (this.isFreeRowInOrigin(curObj)) {
          this.setRelateColState(curObj, "Normal");
          //更新 groupNoList
          this.groupNoList = updateGroupNoList(this.tableRuleForm.tableData);
        }
        return false;
      }

      if (this.isRelationValuePass(curObj)) {
        let val = getRelationRow(this.tableRuleForm.tableData, curObj);
        // curObj = {
        //   ...curObj,
        //   majorId: val.id,
        //   frequencyCode: val.frequencyCode,
        //   frequencyTimes: val.frequencyTimes,
        //   frequencyUnit: val.frequencyUnit,
        //   useWay: val.useWay,
        //   useDay: val.useDay
        // };
        // this.$set(this.tableRuleForm.tableData, this.currentRowIndex, curObj);

        // 已经成组的输入关联  提示用户取消成组，再关联 初始时是白身的不提示
        if (isInGroup(curObj, this.groupNoList)) {
          // 初始 不是白身
          if (!this.isFreeRowInOrigin(curObj)) {
            this.$message.warning("请取消成组，再进行关联操作!");
            setTimeout(() => {
              this.tableRuleForm.tableData[
                this.currentRowIndex
              ].relation = undefined;
            }, 1500);

            return;
          }
        }

        // 未成组的关联
        this.setRelateColValue([curObj], val);
        // this.relateAdviceDisabled = true;
        this.setRelateColState(curObj, "NotMajor", val);
        // this.handleQty(val.useDay + "");

        //设置模拟成组数据
        // this.setSimulateGroupedData(val);

        //设置关联的医嘱 的数据
        // setRelationToRowData(val, this);

        //更新 groupNoList
        this.groupNoList = updateGroupNoList(this.tableRuleForm.tableData);
        // console.log(this.groupNoList, this.tableRuleForm.tableData);
      } else {
        this.tableRuleForm.tableData[this.currentRowIndex].relation = undefined;
        // this.$set(this.tableRuleForm.tableData, this.currentRowIndex, curObj);
        // this.setRelateColState(curObj, "Normal");
        // this.relateAdviceDisabled = false;
        return false;
      }
    },
    // 初始化时，关联输入行是白身
    isFreeRowInOrigin(row) {
      let { id, row_id } = row;
      if (!id) {
        return true;
      } // 新增的是白身
      // let originRow = ;
      // console.log("originRow", originRow);
      return isFreeRow(this.originTableData.find(item => item.id == id));
    },
    //  皮试 注射 输液等
    // 1.门诊皮试单（用法901）、2.门诊注射单（用法4 401 402 403）、3.输液执行单（用法404 40401）、4.门诊治疗单（用法7 或者 空格）
    isPrint(useWay) {
      return zLPrintConfig.some(
        item => item["useWayCode"].indexOf(useWay) > -1
      );
    },

    getZLiaoPrintData(orderTable = []) {
      let printData = [];
      // let keyRpIdList = [];//待打印的组 包括不成祖数据，成组数据
      let keyRpIdList = this.getGroupListByMultiSlt(orderTable); //待打印的组 包括不成祖数据，成组数据
      // let seltedgNoList = getUniqueMajorIdList(orderTable);
      // for (let index = 0; index < seltedgNoList.length; index++) {
      // for (let index = 0; index < orderTable.length; index++) {
      //   let itemOrder = orderTable[index];
      //   let groupedObj = this.groupNoList.find(item=> item.key === itemOrder["id"] || item.key === itemOrder["majorId"]);

      //   if (groupedObj) {// 成组数据 push
      //     // 同一组的，只 push 一次
      //     let someSameKey = keyRpIdList.some(item => item.key === groupedObj["key"]);
      //     if (!someSameKey) {
      //       keyRpIdList.push(groupedObj);
      //     }
      //   } else {// 不成祖数据 push
      //     keyRpIdList.push({
      //       key: itemOrder["id"],
      //       value: [itemOrder]
      //     })
      //   }
      //   // keyRpIdList.push(this.groupNoList.find(item=> item.key == orderTable["id"] || item.key == orderTable["majorId"]));
      // }

      console.log("keyRpIdList::::", keyRpIdList);
      keyRpIdList.forEach(item => {
        let { value, key } = item;
        let firstUwCode = value[0]["useWay"];
        if (this.isPrint(firstUwCode)) {
          let { printGroup } = zLPrintConfig.find(
            item => item["useWayCode"].indexOf(firstUwCode) > -1
          );
          printData.push({
            printGroup,
            orderId: value.map(item => item.id)
          });
        }
      });
      return printData;
    },
    // 设置关联成组的模拟数据  isMajor  MajorId
    setSimulateGroupedData(relationToRow, relationRow) {
      // console.log("aaaa:::::::");
      //关联的主医嘱是 成组的
      if (isInGroup(relationToRow, this.groupNoList)) {
        //关联的主医嘱是 组中的主医嘱
        if (isMajorRow(relationToRow)) {
          // 副医嘱 设置
          setNotMajorRowData(
            relationRow,
            this,
            relationToRow.id,
            relationToRow.groupNo
          );
        }

        // 关联的主医嘱是 组中的副医嘱
        if (isNotMajorRow(relationToRow)) {
          setNotMajorRowData(
            relationRow,
            this,
            relationToRow.majorId,
            relationToRow.groupNo
          );
        }
      } else {
        //关联的主医嘱是 白身
        // 主医嘱设置
        setRelationToRowData(relationToRow, this);
        // 副医嘱 设置
        setNotMajorRowData(
          relationRow,
          this,
          relationToRow.id,
          relationToRow.groupNo
        );
      }
    },
    //判断关联的值 是否通过
    isRelationValuePass(curObj) {
      if (this.isValueNotEffective(curObj)) {
        this.$message.warning("关联医嘱序号有误，请核对后再填写！");
        return false;
      }
      return true;
    },

    //判断关联的值是空的
    isRelationValueEmpty(curObj) {
      return curObj.relation === "" || typeof curObj.relation === "undefined";
    },
    //判断关联的值 不是有效的值
    isValueNotEffective(curObj) {
      let tableData = this.tableRuleForm.tableData;
      let val = getRelationRow(tableData, curObj);
      // console.log(val, "isValueNotEffective");
      return (
        isSameRowById(val, curObj) ||
        val === null ||
        typeof val === "undefined" ||
        curObj.relation <= 0
      );
    },
    // 关联医嘱时。获取所关联医嘱的频次、用药方法、用药天数 ,上面这个change方法有问题
    blurRelateAdvice(value, row, colName) {
      // this.updateJumpOrder(row, colName, false);
    },
    //
    //设置关联的列的状态
    setRelateColState(curObj, type = "NotMajor", relationToRow = {}) {
      //副医嘱的值设定
      if (type == "NotMajor") {
        // setNotMajorRowData(curObj, this, relationToRow.id);
        //设置模拟成组数据
        this.setSimulateGroupedData(relationToRow, curObj);
      } else if (type == "Normal") {
        setNormalRowData(curObj, this);
      }
      this.setRowByConfig(curObj);
    },
    //设置关联的 值
    setRelateColValue(toRowList = [], fromRow = {}) {
      // console.log("fromRow:::", fromRow);
      setRelateGroupNoFunc(toRowList, fromRow, this);
    },
    // 用户选中的row, 获取成组的项， 并保留未成组的项
    //  [{ key: "id", value:[row] }]
    getGroupListByMultiSlt(orderTable = []) {
      let keyRpIdList = []; //合并的组 包括不成祖数据，成组数据
      // let seltedgNoList = getUniqueMajorIdList(orderTable);
      // for (let index = 0; index < seltedgNoList.length; index++) {

        console.log("this.groupNoList", this.groupNoList);

      for (let index = 0; index < orderTable.length; index++) {
        let itemOrder = orderTable[index];
        
        let groupedObj = this.groupNoList.find(
          item =>
            item.key === itemOrder["id"] || item.key === itemOrder["majorId"]
        );



        if (groupedObj) {
          // 成组数据 push
          // 同一组的，只 push 一次
          let someSameKey = keyRpIdList.some(
            item => item.key === groupedObj["key"]
          );
          if (!someSameKey) {
            keyRpIdList.push(groupedObj);
          }
        } else {
          // 不成祖数据 push
          keyRpIdList.push({
            key: itemOrder["id"],
            value: [itemOrder]
          });
        }
        // keyRpIdList.push(this.groupNoList.find(item=> item.key == orderTable["id"] || item.key == orderTable["majorId"]));
      }
      return keyRpIdList;
    },
    //获取勾选中的 已成组 项
    handleBunchingSelect(list, flag) {
      let me = this;
      let bunchingList = [];
      let handleList = this.getGroupListByMultiSlt(list);
      for (let index = 0; index < handleList.length; index++) {
        const { value } = handleList[index];
        bunchingList = bunchingList.concat(value);
      }

      // return bunchingList;
      console.log("bunchingList", bunchingList);

      this.$nextTick(() => {
        this.$refs.multipleTable.toggleRowSelection(bunchingList, flag);
      });

      // if (me.groupNoList.length > 0) {
      //   list.forEach(item => {
      //     me.groupNoList.forEach(row => {
      //       if (row.key === item.id || row.key === item.majorId) {
      //         row.value.forEach(tableRow => {
      //           setTimeout(() => {
      //             //修复 selection 只有一个的问题
      //             me.$refs.multipleTable.toggleRowSelection(tableRow, flag);
      //           }, 0);
      //           if (bunchingList.indexOf(tableRow) !== -1) {
      //             bunchingList.splice(
      //               bunchingList.indexOf(tableRow),
      //               1,
      //               tableRow
      //             ); //替换
      //           } else {
      //             bunchingList.push(tableRow);
      //           }
      //         });
      //         this.$store.dispatch("cis/setMultipleSelections", bunchingList);
      //       }
      //     });
      //   });
      // } else {
      //   bunchingList = list;
      // }

      // console.info("========handleSelectionChange2", bunchingList)

      this.handleSelectionChange(bunchingList);
    },

    //获取勾选中的 已成组 项
    setBunchingSelect(list, flag) {
      let me = this;
      let bunchingList = null;
      list.forEach(item => {
        me.groupNoList.forEach(row => {
          if (row.key === item.id || row.key === item.majorId) {
            row.value.forEach(tableRow => {
              setTimeout(() => {
                //修复 selection 只有一个的问题
                me.$refs.multipleTable.toggleRowSelection(tableRow, flag);
              }, 0);
            });
            this.$store.dispatch("cis/setMultipleSelections", row);
          }
        });
      });
    },
    //处方合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        // console.log("RpRowArr::::", this.RpRowArr, rowIndex);
        const _row = this.RpRowArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      return false;
    },

    //处理成组样式
    cellStyle(rowWrap, a, b, c) {
      console.log(rowWrap, a, b, c);
      let { column, row } = rowWrap;
      let { align, property } = column;
      let cssZebras = "";
      if (property === "orderItemName") {
        cssZebras = this.setZebras(row);
        cssZebras += " orderItemNameCls"; // 免费处方 处方名称 字体变蓝
      }
      
      let alignCss = align === "is-center" ? "center-cell-style" : "";
      // console.log("斑马纹", cssZebras);
      return alignCss + " " + cssZebras;
    },

    addRpWrapper() {
      let tableData = this.tableRuleForm.tableData;
      // 删除空行
      if (isHasEmptyRow(tableData)) {
        // console.log("执行删除！");
        this.tableRuleForm.tableData = deleteEmptyRow(tableData);
      }

      this.$nextTick(() => {
        this.addRp();
      });
    },

    //新增处方
    async addRp(commonDrugCallBack) {
      //判断是否已选择药房
      if (!this.searchForm.pharmacyId) {
        this.$message.warning("您还未选择药房，请先选择再新增。");
        return;
      }
      // 20200619 待编辑状态的行最多只能有一条，不能同时编辑多条记录
      if (isGreaterThanOne(this.tableRuleForm.tableData)) {
        this.$message.warning("您还有一条处方未编辑完成，请先完成编辑。");
        return;
      }

      let visitCode =
        typeof this.receivePatientData["visitCode"] !== "undefined"
          ? this.receivePatientData["visitCode"]
          : ""; //获取患者就诊ID
      if (visitCode === "") {
        this.$message.warning("请选择患者！");
        return false;
      }

      if (this.buttonLoading.addRpLoading) return;
      this.buttonLoading.addRpLoading = true;

      try {
        this.listLoading = true;
        let result = await getDiaRecode(visitCode);
      } catch (error) {
        this.listLoading = false;
        this.buttonLoading.addRpLoading = false;
        return;
      }

      try {
        //后端返回处方号
        let rpNo = "";
        this.listLoading = true;
        let recipeCode = await getRecipeCodeFunc(visitCode);

        rpNo = recipeCode;
        //console.log("disSelectInfo:::", this.disSelectInfo);
        // let addRowEmpty = {};
        let addRowEmpty = resetCurrentData(this, {
          recipeCode: rpNo,
          no: 1,
          ...this.disSelectInfo
        });
        // this.tableColumn.forEach(item => {
        //   addRowEmpty[item.prop] = "";
        // });
        // addRowEmpty["recipeCode"] = rpNo; // 初始化数据
        // addRowEmpty["unqualifiedComment"] = "";
        // addRowEmpty["no"] = 1;
        // addRowEmpty["price"] = 0;
        // addRowEmpty["amt"] = 0;
        // addRowEmpty["row_id"] = +new Date();
        // // 用药天数 数量 初始值设置为 undefined 因为 数字组件为空 不为0
        // addRowEmpty["useDay"] = undefined;
        // addRowEmpty["orderItemName"] = "";
        // addRowEmpty["qty"] = undefined;
        // addRowEmpty["relation"] = undefined;
        // // addRowEmpty["qty"] = undefined;
        // addRowEmpty["skinTestDisabled"] = true;
        // // 自备药
        // addRowEmpty["selfProvided"] = "1";

        // this.clearTypeCurrent();
        this.tableRuleForm.tableData.push(addRowEmpty);
        this.currentRow = this.tableRuleForm.tableData[
          this.tableRuleForm.tableData.length - 1
        ];
        this.currentRowIndex = this.tableRuleForm.tableData.length - 1;
        this.setCurrentLight(
          this.tableRuleForm.tableData[this.tableRuleForm.tableData.length - 1]
        );
        this.getRpRowArr(); //处方项相同的合并处理
        this.rpIndex++;

        commonDrugCallBack && commonDrugCallBack();

        this.listLoading = false;
        this.buttonLoading.addRpLoading = false;

        //焦点定位到医嘱名称
        this.$nextTick(() => {
          //处方列表 定位到最底下 最左面
          let rpTable = this.$refs.multipleTable;
          // console.log(rpTable.bodyWrapper);
          rpTable.bodyWrapper.scrollTop = rpTable.bodyWrapper.scrollHeight;
          rpTable.bodyWrapper.scrollLeft = 0;
          // }, 10);
        });
      } catch (error) {
        this.listLoading = false;
        this.buttonLoading.addRpLoading = false;
      }
    },
    //初始化新增数据
    newRpData() {
      let addRowEmpty = {};
      this.tableColumn.forEach(item => {
        addRowEmpty[item.prop] = "";
      });
      addRowEmpty["recipeCode"] = ""; // 初始化数据
      addRowEmpty["unqualifiedComment"] = "";
      addRowEmpty["no"] = 1;
      addRowEmpty["price"] = 0;
      addRowEmpty["amt"] = 0;
      addRowEmpty["row_id"] = +new Date();
      // 用药天数 数量 初始值设置为 undefined 因为 数字组件为空 不为0
      addRowEmpty["useDay"] = undefined;
      addRowEmpty["orderItemName"] = "";
      addRowEmpty["qty"] = undefined;
      addRowEmpty["relation"] = undefined;
      // addRowEmpty["qty"] = undefined;
      addRowEmpty["skinTestDisabled"] = true;
      return addRowEmpty;
    },
    //行点击
    rowClick(row, column, event) {
      console.log("点击了当前行！");
      try {
        this.$refs.multipleTable.toggleRowSelection(row, true);
      } catch (error) {}

      this.currentRow = row;
      this.currentRowIndex = row.trindex;
      this.computeDay();
    },
    //获取处方合并的 list
    getRpRowArr() {
      this.selectRefresh = false;
      let tableData = this.tableRuleForm.tableData;
      this.rpPosition = 0;
      this.RpRowArr = [];
      tableData.forEach((item, index) => {
        item.index = index;
        if (index === 0) {
          this.RpRowArr.push(1);
        } else {
          if (item["recipeCode"] === tableData[index - 1]["recipeCode"]) {
            this.RpRowArr[this.rpPosition] += 1;
            this.RpRowArr.push(0);
          } else {
            this.RpRowArr.push(1);
            this.rpPosition = index;
          }
        }
      });
      this.$nextTick(() => {
        this.selectRefresh = true;
      });
    },

    setCurrentLight(row) {
      this.$refs.multipleTable.setCurrentRow(row);
      // this.changeCurrentRow(row);
    },
    deleteHandler() {
      let tableData = this.tableRuleForm.tableData;
      // 废数据过滤
      let flag = true;
      // debugger
      this.multipleSelection.forEach(item => {
        // if (typeof item.chargeStatus !== "undefined" && item.chargeStatus !== "0") {
        // 自备药 selfProvided
        //收费状态 chargeStatus  无需收费 2
        // 可勾选条件   收费状态为空，0  和 2且 自备药事
        // flag = true;
        // }
        if (
          typeof item.chargeStatus == "undefined" ||
          item.chargeStatus == "" ||
          item.chargeStatus == "0"
        ) {
          flag = false;
        }
        if (item.chargeStatus == "4" && item.selfProvided == "0") {
          flag = false;
        }
        //皮试自动生成的药品，允许用户删除
        if (isAutomaticallyBySkinTestDrugs(item)) {
          flag = false;
        }
      });
      if (this.multipleSelection.length == "0") {
        this.$message.warning("请选择处方！");
        return false;
      }
      if (flag) {
        this.$message.warning("该医嘱不可删除！");
        return false;
      }
      if (this.multipleSelection.length > 0) {
        //最少选中一项
        this.$confirm("删除后不可恢复，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.multipleSelection.forEach(item => {
              // if (!item.hasOwnProperty("visitCode")) {
              //   this.tableRuleForm.tableData.splice(item.index, 1);
              //   this.getRpRowArr();
              // }
              //删除用户新增的费数据
              if (item.row_id !== "" && item.row_id !== undefined) {
                tableData.splice(
                  tableData.findIndex(
                    innerItem => innerItem.row_id === item.row_id
                  ),
                  1
                );
                this.getRpRowArr(); //处方项相同的合并处理

                //更新 groupNoList
                this.groupNoList = updateGroupNoList(
                  this.tableRuleForm.tableData
                );

                // 重置 currentRowIndex
                this.currentRowIndex = -1;
              }
            });
            let serverList = this.multipleSelection.filter(item => {
              return item.id;
            });

            if (serverList.length > 0) {
              batchRemoveOrders(serverList)
                .then(res => {
                  if (res.code === 1) {
                    this.getList(false);
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });

                    this.changeAdditionalOrderLoadKey(+new Date());
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
    //成组校验
    bunchingValidate() {
      let flag = true;
      if (!isZanCunStatus(this.multipleSelection)) {
        this.$message.warning("只有暂存的医嘱可以成组");
        return false;
      }

      if (this.multipleSelection.length > 1) {
        // 成组最少两个成员
        flag = true;
      } else {
        flag = false;
        this.$message.warning("成组最少两个医嘱");
        return false;
      }

      if (isSameGroup(this.multipleSelection)) {
        this.$message.warning("不可重复成组");
        return false;
      }

      if (!isSameRp(this.multipleSelection)) {
        //同一处方
        this.$message.warning("请选择同一处方元素成组");
        return false;
      }

      return flag;
    },

    //成员中是否全部暂存状态或者空的状态
    isZanCunAndEmptyStatus(list = []) {
      return list.every(item => {
        return (
          item.orderStatus === "0" ||
          item.orderStatus === "" ||
          typeof item.orderStatus === "undefined"
        );
      });
    },

    // sortIndexCompare(property){
    //   return function(obj1,obj2){
    //       var value1 = obj1[property];
    //       var value2 = obj2[property];
    //       return value1 - value2;     // 升序
    //   }
    // },
    qtyIncorrect(ajaxList) {
      let flag = false;

      for (let i = 0; i < ajaxList.length; i++) {
        const item = ajaxList[i];
        if (this.validateQty(item, item.qty, item.unitKey)) {
          continue;
        } else {
          flag = true;
          break;
        }
      }

      return flag;
    },
    //成组 后 天数 频次 用法 会相同， 天数会根据最新的频次和用法计算出来
    bunchContChanges() {
      let cloneList = deepClone(this.multipleSelection);
      // cloneList = cloneList.sort(this.sortIndexCompare("sortIndex"));
      // console.log("cloneList:::", cloneList);
      let targetItem = deepClone(cloneList[0]);

      //对副医嘱进行处理
      setRelateGroupNoFunc(cloneList, targetItem, this);

      cloneList = this.handleSubmitRowWrapper(cloneList);
      // cloneList.forEach(item => {
      //   if (item.id !== targetItem.id) {
      //     // item.frequencyCode = targetItem.frequencyCode;
      //     // item.frequencyTimes = targetItem.frequencyTimes;
      //     // item.frequencyUnit = targetItem.frequencyUnit;

      //     for (let i = 0; i < relationDisabledList_cis.length; i++) {
      //       const relateKey = relationDisabledList_cis[i];
      //       if (relateKey == "frequencyCode") {
      //         for (let j = 0; j < frequencyObjKeys.length; j++) {
      //           const freqKey = frequencyObjKeys[j];
      //           this.$set(item, freqKey, targetItem[freqKey]);
      //         }
      //       } else {
      //         this.$set(item, relateKey, targetItem[relateKey]);
      //       }

      //     }

      //     item.useWay = targetItem.useWay;
      //     item.useDay = targetItem.useDay;
      //     item.qty = item.quantity = this.handleQtyUtil(
      //       item.useDay,
      //       item,
      //       item.onceDosage,
      //       item.dosage,
      //       item
      //     );
      //   }
      // });
      return cloneList;
    },
    // eslint-disable-next-line valid-jsdoc
    /**
     * useDay 用药天数
     * freqObj 频次对象
     * onceDosage 一次计量
     * dosage 计量
     * currentItem 当前行的数据 包含规格 包装单位等
     * unitFlag  大单位0  小单位1
     */
    handleQtyUtil(
      useDay = 0,
      freqObj = {},
      onceDosage = 0,
      dosage = 1,
      currentItem = {},
      unitFlag = "0"
    ) {
      let qty = 0;
      let times = 1;
      let cutable = getCutable(currentItem);
      if (freqObj.frequencyUnit === "天") {
        times = freqObj.frequencyTimes;
      } else {
        /*else if (freqObj.frequencyUnit === "周") {
               times = freqObj.frequencyTimes / 7;
             } else if (freqObj.frequencyUnit === "月") {
               times = freqObj.frequencyTimes / 30;
             }*/
        times = 1;
      }
      // console.log("currentItem", currentItem);
      // console.log("freqObj", freqObj);
      // //zhengyawen
      let dosages = dosage === "" ? 1 : dosage;
      let packQuantity = currentItem.packQuantity;
      let unitKey = currentItem.unitKey;
      let packUnit = currentItem.packUnit;
      let roundingMode = currentItem.roundingMode;
      let unitSaleFlg = currentItem.unitSaleFlg;
      // // 一次剂量换算数量向上取整
      // let onceQty = Math.ceil(onceDosage / dosages);
      // // 判断药品是否可拆零
      // if (
      //   currentItem.unitSaleFlg === "1" ||
      //   (currentItem.unitSaleFlg === undefined && currentItem.unit)
      // ) {
      //   // 可拆零，天数*频次*单次剂量/规格
      //   qty = useDay * times * onceQty;
      // } else {
      //   qty = (useDay * times * onceQty) / currentItem.packQuantity;
      // }

      // qty = isNaN(qty)
      //   ? 0
      //   : unitFlag === "0"
      //   ? qty
      //   : qty / currentItem.packQuantity;
      // console.log("qty", qty);
      // qty = Math.ceil(qty); //向上取整  可用天数字段
      // console.log("pkgUnit", packUnit, "unitKey", unitKey);
      qty = drugOutpCalculatFunc(
        useDay,
        times,
        onceDosage,
        dosages,
        packQuantity,
        getUnitFlag(packUnit, unitKey),
        roundingMode,
        unitSaleFlg
      );
      return qty;
    },
    //成组 处理
    async bunchingHandler() {
      if (this.bunchingValidate()) {
        this.$confirm("成组药品用法和频次将保持一致，是否继续？")
          .then(async _ => {
            this.listLoading = true;
            let data = this.multipleSelection;
            // 将该组其他医嘱一起勾选
            this.handleBunchingSelect(data, true);

            //处理频次和用法,数量
            let ajaxList = this.bunchContChanges();

            // 验证表单  如果有超量 需要提醒用户 输入
            // try {
            //   await this.maintableValidateWrapper();
            // } catch (error) {
            //   this.listLoading = false;
            //   return false;
            // }

            //数量做些校验 处理
            if (this.qtyIncorrect(ajaxList)) {
              this.listLoading = false;
              return false;
            }

            bunching(ajaxList)
              .then(res => {
                if (res.code === 1) {
                  this.getList(false);
                } else {
                  this.$message.error(res.msg || " 接口返回错误");
                }
                this.listLoading = false;
              })
              .catch(() => {
                this.listLoading = false;
                this.$message.error("成组失败！");
              });
          })
          .catch(_ => {});
      }
    },
    //取消成组
    cancelBunching() {
      let data = this.multipleSelection;

      if (!isZanCunStatus(data)) {
        this.$message.warning("只有暂存的医嘱可以取消成组");
        return false;
      }

      if (data.length > 1) {
        // 成组最少两个成员

        // 组号相同
        if (isSameGroup(this.multipleSelection)) {
          unbunching(data).then(res => {
            if (res.code === 1) {
              this.$message.success(res.msg ? res.msg : "取消成组成功！");
              this.getList(false);
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
    async validPrintRecipeOld(orderTable) {
      let printStatus = false;
      if (orderTable.length === 0) {
        this.$message.warning("请选择处方！");
        this.printLoading = false;
        return false;
      }

      // 暂存的处方不能打印！
      if (getZanCunAndNewRow(orderTable).length) {
        this.$message.warning("暂存的处方不能打印！");
        this.printLoading = false;
        return false;
      }

      // 不同处方号的处方不可一起打印
      orderTable.forEach((item, index) => {
        if (index >= 1 && item.recipeId != orderTable[0].recipeId) {
          printStatus = true;
          return;
        }
      });
      if (printStatus) {
        this.$message.warning("请选择同一个处方进行打印！");
        this.printLoading = false;
        return false;
      }

      // 整处方提交
      let dataList = this.handleRecipe(this.tableRuleForm.tableData);
      let selectList = this.handleRecipe(orderTable);
      dataList.forEach((item, index) => {
        selectList.forEach((sItem, index) => {
          if (item.key === sItem.key && item.value !== sItem.value) {
            printStatus = true;
          }
        });
      });
      if (printStatus) {
        this.$message.warning("请选择整处方打印！");
        this.printLoading = false;
        return false;
      }
      return true;
    },
    //旧打印（单处方打印）
    async printRecipeOld() {
      if (this.printLoading) {
        return;
      }
      this.printLoading = true;
      let orderTable = deepClone(this.multipleSelection);

      //校验
      let flag = await this.validPrintRecipeOld(orderTable);
      if (!flag) {
        this.printLoading = false;
        return;
      }
      let res = await outpatientOrderPrint({
        visitCode: this.receivePatientData.visitCode,
        recipeId: orderTable[0].recipeId,
        patientId: this.receivePatientData.patientId,
        type: "westAdvice"
      });
      if (res.code === 1) {
        let data = res.data;
        if (res.data.recipeCode === "" || res.data.recipeCode === undefined) {
          this.$delete(data, "recipeCode");
        }
        onPreview(data, "门诊处方西成药11");
      }
      this.printLoading = false;
    },
    async validPrintRecipe(orderTable) {
      let printStatus = false;
      if (orderTable.length === 0) {
        this.$message.warning("请选择处方！");
        return false;
      }

      // 暂存的处方不能打印！
      if (getZanCunAndNewRow(orderTable).length) {
        this.$message.warning("暂存的处方不能打印！");
        return false;
      }

      //  整处方校验
      let arr0 = updateAllRecipe(this.tableRuleForm.tableData);
      let arr1 = updateAllRecipe(this.multipleSelection);
      let flag = arr1.some((item1, index) => {
        return arr0.some((item0, index) => {
          if (item1.key == item0.key) {
            return item1.value.length !== item0.value.length;
          }
        });
      });
      if (flag) {
        this.$message.warning("整处方必须一起打印！");
        return false;
      }
      return true;
    },

    outpatientOrderListPrint(recipeIds = "", printAll = false) {
      return new Promise(async (resolve, reject) => {
        //校验
        try {
          let res = await outpatientOrderListPrint({
            visitCode: this.receivePatientData.visitCode,
            recipeIds,
            patientId: this.receivePatientData.patientId,
            type: "westAdvice"
          });
          if (res.code === 1) {
            // let printData = res.data[0];

            let dataList = res.data;

            for (let index = 0; index < dataList.length; index++) {
              let printData = dataList[index];
              // 西药模板打印
              westOrderItemPrintHandle(printData, { printTpl: this.printTpl, drugsTpl, diagnoseTplChm }, printAll ? true : dataList.length > 1);
              // let obj = {
              //   diagHtmlTop: "146.5pt", // 诊断模块 绝对 top 
              //   diagHtmlHeight: "14pt",// 诊断模块 高度 
              //   cHtmlLineTop: "165pt",// 诊断 与 药品中间的线的绝对 top 
              //   contentHtmlTop: "170pt", // 治疗医嘱模块的 绝对 top 
              //   MIS_ID: "",
              //   settlemetnType: "",
              //   patientNum: "",
              //   patientGender: "",
              //   age: "",
              //   deptId: "",
              //   outpDeptName: "",
              //   doctorName: "",
              //   diagTime: "",
              //   relateAddress: "",
              //   relateNum: "",
              //   applyNum: "",
              //   chargpeople: "",
              //   visitCode: "",
              //   relateCode: "",
              //   weight: "",
              //   diagList: [ { diagList: [{}] }]
              // };
              // printData = {
              //   ...obj,
              //   ...printData
              // }
              // // 获取打印诊断 相关参数
              // let { diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop, diagNameObj } = diagPrintModuleParams(printData.diagList[0].diagList, { maxLineNum: 4 });
        
              // printData = {
              //   ...printData,
              //   ...{
              //     diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop,diagNameObj
              //   }
              // }



              // let { diagList, part3, settlemetnType } = printData;
              // let rDiagList = diagList[0].diagList;
              
              // // 药品的模板
              // let aParse = eval(compile(drugsTpl));
              // //药品的模板
              // printData.RecipeDetails = aParse(printData);
              
              // // 门诊诊断的模板
              // let bParse = eval(compile(diagnoseTplChm));
              // //门诊诊断
              // printData.diagnoseHtml = bParse(diagNameObj);

              // //体重 weight
              // printData.weight = printData.weight ? printData.weight : "";
              // //处方类型 diseaseRecipeType
              // printData.diseaseRecipeType = printData.diseaseRecipeType
              //   ? printData.diseaseRecipeType
              //   : "";
              // //社康中心  处方笺
              // printData.hosName = printData.hosName + "处方笺";

              // // 姓名截取前八位
              // printData.patientName = printData.patientName
              //   ? printData.patientName.substring(0, 8)
              //   : "";

              // // 体重 加 单位 KG
              // printData.weight = printData.weight
              //   ? printData.weight + "kg"
              //   : "";

              // // onPreviewData(data, "门诊处方西成药11");
              // // console.log("printData", printData);
              // // print(null, this.printTpl, {}, printData, true);
              // // console.log("print:::");


              // let printDirect = printAll ? true : dataList.length > 1;
              // print(null, this.printTpl, {}, printData, printDirect);
            }

            resolve(true);
          } else {
            reject(false);
          }
          // this.printLoading = false;
        } catch (e) {
          // this.printLoading = false;
          reject(false);
        }
      });
    },

    async printAllRecipe() {
      if (this.printAllLoading) {
        return;
      }
      // this.printAllLoading = true;
      // chargeStatus 3 是全退 不需要打印
      let allRecipeList = updateAllRecipe(
        this.tableRuleForm.tableData.filter(item => item.chargeStatus != 3)
      );
      let zanCunList = getZanCunAndNewRow(this.tableRuleForm.tableData).map(
        item => item.recipeId
      );
      // console.log("allRecipeList:::::::", allRecipeList, zanCunList);
      let recipeIdArray = [];
      let recipeIds = "";
      allRecipeList.forEach((item, index) => {
        if (zanCunList.indexOf(item.key) < 0) {
          recipeIdArray.push(item.key);
        }
      });
      // console.log("recipeIdArray:::::::", recipeIdArray);
      for (let index = 0; index < recipeIdArray.length; index++) {
        const recipeIdItem = recipeIdArray[index];
        try {
          this.printAllLoading = true;
          // console.log("print:::", index, recipeIdItem, recipeIdArray);
          await this.outpatientOrderListPrint(recipeIdItem, true);
          this.printAllLoading = false;
          continue;
        } catch (e) {
          this.printAllLoading = false;
          break;
        }
      }
    },
    async printRecipe() {
      if (this.printLoading) {
        return;
      }
      // this.printLoading = true;
      let orderTable = deepClone(this.multipleSelection);
      //打印校验
      if (!(await this.validPrintRecipe(orderTable))) {
        this.printLoading = false;
        return;
      }
      let recipeIdArray = [];
      let recipeIds = "";
      orderTable.forEach((item, index) => {
        recipeIdArray.push(item.recipeId);
      });
      recipeIdArray = Array.from(new Set(recipeIdArray));
      recipeIdArray.forEach((item, index) => {
        if (index != 0) {
          recipeIds = recipeIds + "," + item;
        } else {
          recipeIds = item;
        }
      });
      console.log("点击了打印！！");
      try {
        this.printLoading = true;
        await this.outpatientOrderListPrint(recipeIds);
        this.printLoading = false;
      } catch (error) {
        this.printLoading = false;
      }
    },

    //开药权限验证 医生有非限制级抗菌药品权限 提示框
    drugsAuthorityConfirm(msg) {
      return new Promise((resolve, reject) => {
        this.$confirm(msg + ", 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "warning"
        })
          .then(() => {
            // console.log("点击确定了");
            resolve(true);
          })
          .catch(() => {
            // console.log("点击取消了");
            reject(false);
          });
      });
    },
    copyOrder() {
      let { patientId } = this.receivePatientData;
      if (patientId) {
        this.copyOrderVisible = true;
        this.copyLoading = false;
      } else {
        this.$message.warning("请选择一名患者");
      }
    },
    async copyOrderCallback(mult) {
      this.copyOrderVisible = false;
      await this.getList();
    }
    // eslint-disable-next-line complexity
    // async copyOrderCallback(mult) {
    //   this.copyLoading = true;
    //   let dataList = mult;
    //   let recipeIdList = mult.map(item => {
    //     return item.recipeId;
    //   });
    //   recipeIdList = Array.from(new Set(recipeIdList));

    //   let { visitCode, patientId, patientName } = this.receivePatientData;
    //   for (let i = 0; i < recipeIdList.length; i++) {
    //     let recipeId = recipeIdList[i];
    //     // 获取引用历次处方
    //     // let rep = await getRecipeCode({
    //     //   visitCode: visitCode
    //     // });
    //     try {
    //       let recipeCode = await getRecipeCodeFunc(visitCode);
    //       let rpNo = recipeCode;
    //       // if (rep.code === 1) {
    //       //   rpNo = rep.data;
    //       for (let i = 0; i < dataList.length; i++) {
    //         let single = dataList[i];
    //         if (single.recipeId === recipeId) {
    //           single.recipeCode = rpNo;
    //           single.patientId = patientId;
    //           single.patientName = patientName;
    //           single.visitCode = visitCode;
    //           single.row_id = +new Date() + Math.ceil(Math.random() * 100);
    //         }
    //       }
    //       // } else {
    //       //   this.$message.error(rep.msg || " 获取处方号失败！");
    //       //   return;
    //       // }
    //     } catch (error) {
    //       this.copyLoading = false;
    //       this.$message.error("获取处方号失败！");
    //     }

    //   }

    //   // console.log("dataList处理过的：：：：：", dataList);

    //   let overReasonOrderList = [];
    //   let normalOrderList = [];
    //   for (let i = 0; i < dataList.length; i++) {
    //     let single = dataList[i];
    //     //增加 orderFrom 参数 区分 退费 和 电子处方
    //     single = this.setOrderFromParam(single);
    //     // 数组分类  超量数组 和 普通数组
    //     // if (single.day !== undefined && single.day > 7) {
    //     //   single.unqualifiedComment = "";
    //     //   overReasonOrderList.push(single);
    //     // } else if (single.day !== undefined && single.day <= 7) {
    //     //   normalOrderList.push(single);
    //     // } else {
    //     //   normalOrderList.push(single);
    //     // }
    //   }

    //   // console.log(overReasonOrderList, normalOrderList);
    //   // if (normalOrderList.length > 0) {
    //     // 引用到医嘱列表中
    //     try {
    //         let reps = await saveOrders(dataList);
    //         if (reps.code === 1) {
    //           this.$message.success(reps.msg ? reps.msg : "医嘱引用成功");
    //             try {
    //               let result = await this.getList(true);
    //               this.copyOrderVisible = false;
    //             } catch (error) {
    //               this.$message.error("医嘱引用失败");
    //               this.copyLoading = false;
    //             }
    //         } else if (reps.code === 20001009) {
    //           this.$message.warning(reps.msg);
    //           await this.getList(true);
    //           this.copyOrderVisible = false;
    //         } else {
    //           this.$message.error(reps.msg ? reps.msg : "医嘱引用失败");
    //         }
    //         this.copyLoading = false;

    //     } catch (error) {
    //       this.copyLoading = false;
    //     }
    // }
  }
};
</script>

<style scoped lang="scss">
@import "./modules/advice.scss";
</style>
