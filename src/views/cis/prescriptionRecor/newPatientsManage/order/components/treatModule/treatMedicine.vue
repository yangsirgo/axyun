/* eslint-disable complexity */
<template>
  <div class="height100 mainTableWrapper">
    <div class="table-utils">
      <!--<el-checkbox v-model="checked" @keyup.enter.native="checked = !checked">备选项</el-checkbox>-->
      <!--  <el-button
          class="filter-item"
          type="text"
          icon="iconfont iconxinzengchufang"
          @click.native="addRp"
          v-hotKey="{ func: 'func_add1' }"
      >新增处方</el-button>-->
      <!-- 失去焦点 使用的锚点 -->
      <input ref="focusDom" style="width:0px; clip:rect(0,0,0,0); position:absolute;"/>

      <el-button
        class="filter-item"
        type="text"
        icon="iconfont iconxinzengchufang"
        @click.native="addRowWrapper"
        :loading="buttonLoading.addRpLoading"
        v-hotKey="{ func: 'func_add2' }"
      >新增</el-button>

      <!-- <el-button
        class="filter-item"
        type="text"
        icon="iconfont iconxinzengchufang"
        :loading="vadviceLoading"
        @click="vaccineAdvice()"
      >疫苗医嘱</el-button> -->

      <!-- <el-button
         class="filter-item"
         type="text"
         icon="iconfont icondayin"
         @click="copyOrder"
      >复制医嘱</el-button>-->
            <el-button
        @click="draftSaveAll()"
        class="filter-item"
        type="text"
        icon="iconfont iconzancun"
        v-hotKey="{ func: 'func_submit' }"
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
        v-hotKey="{ func: 'func_submit' }"
        :loading="cclSubtLoading"
      >撤销提交</el-button>
      <el-button
        @click="deleteHandler"
        class="filter-item"
        type="text"
        icon="iconfont iconshanchu"
        v-hotKey="{ func: 'func_delete' }"
      >删除</el-button>
      <!-- <el-button
         @click="bunchingHandler"
         class="filter-item"
         type="text"
         icon="iconfont iconchengzu"
         v-hotKey="{ func: 'func_grouping' }"
      >成组</el-button>-->
      <!--  <el-button
          @click="cancelBunching"
          class="filter-item"
          type="text"
          icon="iconfont iconquxiaochengzu"
          v-hotKey="{ func: 'cancel_grouping' }"
      >取消成组</el-button>-->

      <!-- <el-button
        class="filter-item"
        type="text"
        icon="iconfont icondayin"
        v-hotKey="{ func: 'func_print' }"
        @click="printHuShiFunc"
        :loading="pHuShiLoading"
      >打印治疗单</el-button> -->

      <el-button
        class="filter-item"
        type="text"
        icon="iconfont icondayin"
        v-hotKey="{ func: 'func_print' }"
        @click="printRecipe"
        :loading="pRLoading"
      >打印</el-button>
      <el-button
        class="filter-item"
        type="text"
        icon="iconfont icondayin"
        v-hotKey="{ func: 'func_print' }"
        :loading="pRAllLoading"
        @click="printRecipeAll"
      >打印全部</el-button>

      <el-button
        class="filter-item"
        type="text"
        icon="iconfont iconlicichufang"
        @click="copyOrder"
      >历史医嘱</el-button>

      <!-- <disSelectShow
        class="disSelectShowCls"
        
        :visitCode="receivePatientData.visitCode"
        :info.sync="disSelectInfo" ></disSelectShow> -->
<!-- v-if="receivePatientData.settlementType == '3'" -->
      <el-button
        type="primary"
        @click="submitCurRow()"
        class="button"
        style="position: absolute; z-index: -1;"
        v-hotKey="{ func: 'func_save' }"
      >保 存</el-button>
    </div>
    <div
      class="main-table"
    >
      <el-form
        :model="tableRuleForm"
        :rules="tableRuleForm.tableRules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm height100"
      >
        <el-table
          show-overflow-tooltip
          @header-dragend="headerDragend"
          highlight-current-row
          :data="tableRuleForm.tableData"
          border
          stripe
          v-loading="listLoading"
          tooltip-effect="dark"
          @row-click="rowClick"
          header-cell-class-name="headerCls"
          :cell-class-name="cellStyle"
          :row-class-name="rowStyleCls"
          @select="handleSelect"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          v-hotKey="{
            func: ['table_row', 'table_checkbox', 'table_choose'],
            deClass: 'el-table__row',
            curClass: 'current-row',
          }"
          max-height="100%"
          :height="tableHeight"
        >
          <!-- 需要列 -->
          <el-table-column
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
          >
            <template slot-scope="scope">
              <!-- 提交状态下 不可编辑  -->
              <template v-if="!(scope.row.orderStatus == '0' || scope.row.orderStatus == '')">
                <template v-if="item.prop === 'freeFlag'">
                  <span :val="scope.row.freeFlag" code="FreeRecipeReason" v-codeTransform></span>
                </template>
                <!-- <span>{{ scope.row[item.prop] }}</span> -->
                <!--医保类别-->
                <template v-else-if="item.prop === 'medicalInsuranceCat'">
                  <span
                    :val="scope.row.medicalInsuranceCat"
                    code="order_type"
                    v-codeTransform
                  ></span>
                </template>
                <!-- 金额格式化 -->
                <template v-else-if="item.prop == 'price' || item.prop == 'amt'">
                  <span v-if="item.prop == 'price'">{{ scope.row[item.prop] | roundingPrice }}</span>
                  <span v-else-if="item.prop == 'amt'">{{ scope.row[item.prop] | roundingAmt }}</span>
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
                  <!--<span :val="scope.row.orderCat" code="category_Code" v-codeTransform></span>-->
                  <span
                    columns="doctors_advice_name"
                    :conditionMap="{ doctors_advice_code: scope.row.orderCat }"
                    tableName="cnf_doctors_advice"
                    v-tableTransform
                  ></span>
                </template>
                <!--成组 关联-->
                <template v-else-if="item.prop === 'relation'">
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
                <!--医嘱名称-->
                <template v-else-if="item.prop === 'orderItemName'">
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.orderItemName'"
                    :rules="tableRuleForm.tableRules.orderItemName"
                  >{{ scope.row.orderItemName }}</el-form-item>
                </template>
                <template v-else-if="item.prop === 'bunching'">
                  <span :class="scope.row.groupNoCls"></span>
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
                    v-if="!isNaN(scope.row.unitKey)"
                    :val="scope.row.unitKey"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <span v-else> {{ scope.row.unitKey }} </span>
                </template>
                <!--备注-->
                <template v-else-if="item.prop === 'remark'">
                  <span>{{ scope.row.remark }}</span>
                </template>
                <!--滴速-->
                <template v-else-if="item.prop === 'flowRate'">
                  <span v-if="scope.row.useWay === '404'">{{ scope.row.dropRate1 }}~{{ scope.row.dropRate2 }}<span class="ds-unit">滴/分</span>
                  </span>
                  <span v-else>--</span>
                </template>
                <!--医嘱超量-->
                <template v-else-if="item.prop === 'excessReason'">
                  <span class="aaaa">{{ scope.row.excessReason }}</span>
                </template>
                <template v-else-if="item.prop === 'useDay'">
                  <span>{{ scope.row.useDay }}</span>
                </template>
                <!-- 医保限制 -->
                <template v-else-if="item.prop === 'limitResultCode'">
                  <span v-if="scope.row.limitResultCode == '0'">自费使用</span>
                  <span v-if="scope.row.limitResultCode == '1'">审批通过</span>
                </template>
                <!-- 就诊类别 -->
                <template v-else-if="item.prop === 'diseaseType'">
                  <!-- {{ scope.row.diseaseType }} -->
                  <span v-if="scope.row.diseaseType === 0">普通门诊</span>
                  <span v-if="scope.row.diseaseType === 1">慢病</span>
                  <span v-if="scope.row.diseaseType === 2">特病</span>
                </template>
                <!--加急-->
                <template v-else-if="item.prop === 'urgent'">
                  <el-form-item
                    label
                    prop="urgent"
                  >
                    <el-checkbox
                      disabled
                      v-model="scope.row.urgent"
                      true-label="1"
                      false-label="0"
                      @keyup.enter.native="scope.row.urgent = !scope.row.urgent"
                    ></el-checkbox>
                  </el-form-item>
                </template>
                <template v-else-if="item.prop === 'execDeptName'">
                  <span
                    tableName="sys_org"
                    :conditionMap="{
                      org_type: '_DEPT_',
                      id: scope.row.receiveDept || '',
                    }"
                    columns="org_nm"
                    v-tableTransform
                  >--</span>
                </template>
                <template v-else>
                  <span>{{ scope.row[item.prop] }}</span>
                </template>
              </template>
              <!-- 非提交状态下可编辑  -->
              <template v-else>
                <template v-if="item.prop === 'freeFlag'">
                  <l-value-domain
                    code="FreeRecipeReason"
                    :value.sync="scope.row.freeFlag"
                    clearable
                    @change="
                      () => {
                        fixedCurrentIndex(scope.row);
                      }
                    "
                  />
                </template>
                <!--医保类别-->
                <template v-else-if="item.prop === 'medicalInsuranceCat'">
                  <span
                    :val="scope.row.medicalInsuranceCat"
                    code="order_type"
                    v-codeTransform
                  ></span>
                </template>
                <!-- 金额格式化 -->
                <template v-else-if="item.prop == 'price' || item.prop == 'amt'">
                  <span v-if="item.prop == 'price'">{{ scope.row[item.prop] | roundingPrice }}</span>
                  <span v-else-if="item.prop == 'amt'">{{ scope.row[item.prop] | roundingAmt }}</span>
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
                <!-- 治疗部位 -->
                <template v-else-if="item.prop === 'treatSite'">
                  <el-input size="medium" v-model.trim="scope.row.treatSite" maxlength="16"/>
                </template>
                <!-- 治疗方法 -->
                <template v-else-if="item.prop === 'treatMethod'">
                  <el-input size="medium" v-model.trim="scope.row.treatMethod"  maxlength="16"/>
                </template>
                <!--医嘱类型-->
                <template v-else-if="item.prop === 'orderCat'">
                  <!--<span :val="scope.row.orderCat" code="category_Code" v-codeTransform></span>-->
                  <span
                    columns="doctors_advice_name"
                    :conditionMap="{ doctors_advice_code: scope.row.orderCat }"
                    tableName="cnf_doctors_advice"
                    v-tableTransform
                  ></span>
                </template>
                <!--成组 关联-->
                <template v-else-if="item.prop === 'relation'">
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
                      @change="relateAdvice"
                    ></el-input-number>
                  </el-form-item>
                </template>
                <!--医嘱名称-->
                <template v-else-if="item.prop === 'orderItemName'">
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.orderItemName'"
                    :rules="tableRuleForm.tableRules.orderItemName"
                    v-if="scope.row.orderStatus === ''"
                  >
                    <LInputTable
                      ref="lInputTable"
                      v-selectInner
                      v-focus
                      v-axShotcut
                      :shotindex="shotcutIndexHandler(scope, 'orderItemName')"
                      :shotready="shotreadyHandler(scope, 'orderItemName')"
                      :data-id="'inputTable' + scope.row.row_id"
                      :popoverWidth="800"
                      suffix-icon="el-icon-search"
                      :tableData="selectOptions"
                      @query="search"
                      @mounted="resetLInputTablePaging"
                      v-model="scope.row.orderItemName"
                      @select="selectDropRow"
                      :tableLoading="inputTableLoading"
                      :tableParams="dropColumn"
                      placeholder="请输入关键字"
                      valueKey="orderItemName"
                    ></LInputTable>
                  </el-form-item>
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.orderItemName'"
                    :rules="tableRuleForm.tableRules.orderItemName"
                    v-else
                  >{{ scope.row.orderItemName }}</el-form-item>
                </template>
                <template v-else-if="item.prop === 'bunching'">
                  <span :class="scope.row.groupNoCls"></span>
                </template>
                <!--一次用量-->
                <template v-else-if="item.prop === 'onceDosage'">
                  <el-form-item
                    :prop="'tableData.' + scope.$index + '.onceDosage'"
                    :rules="tableRuleForm.tableRules.onceDosage"
                  >
                    <lInputNumber
                      ref="lInputTable"
                      v-axShotcut
                      v-selectInner
                      :shotindex="shotcutIndexHandler(scope, 'onceDosage')"
                      :shotready="shotreadyHandler(scope, 'onceDosage')"
                      :data-id="'onceDosage' + scope.row.row_id"
                      style="width: 100%;"
                      :min="1"
                      :max="999"
                      :step="1"
                      v-model="scope.row.onceDosage"
                      @input="inputHandler"
                      @focus="
                        (value, item) => {
                          fixedCurrentIndex(scope.row);
                        }
                      "
                    ></lInputNumber>
                  </el-form-item>
                  <!-- <span>{{ scope.row[item.prop] }}</span> -->
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
                    <cis-value-domain
                      v-axShotcut
                      :data-id="'frequency' + scope.row.row_id"
                      style="width: 100%;"
                      :disabled="
                        typeof scope.row.relation !== 'undefined' &&
                        relateAdviceDisabled
                      "
                      :shotready="shotreadyHandler(scope, 'frequencyCode')"
                      :shotindex="shotcutIndexHandler(scope, 'frequencyCode')"
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
                    ></cis-value-domain>
                  </el-form-item>
                </template>
                <!--用法-->
                <template v-else-if="item.prop === 'useWay'">
                  <el-form-item
                    label
                    :prop="'tableData.' + scope.$index + '.useWay'"
                    :rules="tableRuleForm.tableRules.useWay"
                  >
                    <l-value-domain
                      v-if="selectRefresh"
                      :disabled="
                        typeof scope.row.relation !== 'undefined' &&
                        relateAdviceDisabled
                      "
                      v-axShotcut
                      :shotindex="shotcutIndexHandler(scope, 'useWay')"
                      :shotready="shotreadyHandler(scope, 'useWay')"
                      code="MedicationRouteCode"
                      :value.sync="scope.row.useWay"
                      placeholder="用法"
                      @change="handleUseWay"
                      remoteShowKey="name"
                      remoteValueKey="code"
                    ></l-value-domain>
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
                    <lInputNumber
                      size="medium"
                      v-selectInner
                      v-axShotcut
                      style="width: 100%;"
                      :min="1"
                      :max="999999"
                      :shotindex="shotcutIndexHandler(scope, 'qty')"
                      :shotready="shotreadyHandler(scope, 'qty')"
                      v-model="scope.row.qty"
                      @focus="(value)=> { fixedCurrentIndex(scope.row) }"
                      @input="(value)=> { computeAmtWrapper(value, scope.row) }"
                    ></lInputNumber>
                  </el-form-item>
                </template>
                <!--单位-->
                <template v-else-if="item.prop === 'unitKey'">
                  <span
                    v-if="!isNaN(scope.row.unitKey)"
                    :val="scope.row.unitKey"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <span v-else> {{ scope.row.unitKey }} </span>
                </template>
                <!--皮试-->
                <!-- <template v-else-if="item.prop === 'skinTest'">
                  <el-form-item label prop="skinTest" class="skinTest">
                    <el-checkbox
                      v-model="scope.row.skinTest"
                      @keyup.enter.native="
                        scope.row.skinTest = !scope.row.skinTest
                      "
                      @change="changeSkinTest"
                      :disabled="skinTestDisabled"
                    ></el-checkbox>
                  </el-form-item>
                </template> -->
                <!--备注-->
                <template v-else-if="item.prop === 'remark'">
                  <el-input
                    v-selectInner
                    v-axShotcut
                    size="medium"
                    style="width: 100%;"
                    :shotindex="shotcutIndexHandler(scope, 'remark')"
                    :shotready="shotreadyHandler(scope, 'remark')"
                    v-model.trim="scope.row.remark"
                    @keydown.enter.native="(event)=>{ submitCurRowWrapper(event, scope.row) }"
                  ></el-input>
                   <!-- @keydown.enter.native="shotcutEndHandler" -->
                  <!-- @keydown.tab.native.prevent="submitCurRowWrapper" -->
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
                    <span class="ds-unit">滴/分</span>
                  </el-form-item>
                  <span v-else>--</span>
                </template> -->
                <!--医嘱超量-->
                <template v-else-if="item.prop === 'excessReason'">
                  <el-form-item
                    label
                    :prop="'tableData.' + scope.$index + '.excessReason'"
                    :rules="tableRuleForm.tableRules.excessReason"
                    v-if="scope.$index === currentRowIndex && overReasonShow"
                  >
                    <el-input v-model.trim="scope.row.excessReason"></el-input>
                  </el-form-item>
                  <span
                    class="aaaa"
                    v-else
                  >{{ scope.row.excessReason }}</span>
                </template>
                <template v-else-if="item.prop === 'useDay'">
                  <el-form-item
                    label
                    :rules="tableRuleForm.tableRules.useDay"
                    :prop="'tableData.' + scope.$index + '.useDay'"
                  >
                    <lInputNumber
                      :disabled="
                        typeof scope.row.relation !== 'undefined' &&
                        relateAdviceDisabled
                      "
                      v-axShotcut
                      v-selectInner
                      :shotindex="shotcutIndexHandler(scope, 'useDay')"
                      :shotready="shotreadyHandler(scope, 'useDay')"
                      size="medium"
                      :min="1"
                      :max="999"
                      style="width: 100%;"
                      v-model.number="scope.row.useDay"
                      @focus="(value)=> { fixedCurrentIndex(scope.row) }"
                      @input="(value)=>{ handleQtyWrapper(scope.row, value) }"
                    ></lInputNumber>
                  </el-form-item>
                </template>
                <!-- 医保限制 -->
                <template v-else-if="item.prop === 'limitResultCode'">
                  <span v-if="scope.row.limitResultCode == '0'">自费使用</span>
                  <span v-if="scope.row.limitResultCode == '1'">审批通过</span>
                </template>
                <!-- 就诊类别 -->
                <template v-else-if="item.prop === 'diseaseType'">
                  <!-- {{  scope.row.diseaseType }} -->
                  <span v-if="scope.row.diseaseType === 0">普通门诊</span>
                  <span v-if="scope.row.diseaseType === 1">慢病</span>
                  <span v-if="scope.row.diseaseType === 2">特病</span>
                </template>
                <!--加急-->
                <template v-else-if="item.prop === 'urgent'">
                  <el-form-item
                    label
                    prop="urgent"
                  >
                    <el-checkbox
                      v-model="scope.row.urgent"
                      true-label="1"
                      false-label="0"
                      @keyup.enter.native="scope.row.urgent = !scope.row.urgent"
                    ></el-checkbox>
                  </el-form-item>
                </template>
                <template v-else-if="item.prop === 'execDeptName'">
                  <!-- <span
                    tableName="sys_org"
                    :conditionMap="{
                      org_type: '_DEPT_',
                      id: scope.row.receiveDept || '',
                    }"
                    columns="org_nm"
                    v-tableTransform
                    >--</span
                  > -->
                  <el-select v-model="scope.row.receiveDept"
                    @change="
                      () => {
                        fixedCurrentIndex(scope.row);
                      }
                    ">
                    <el-option
                      v-for="(v,i) in deptList"
                      :key="i"
                      :label="v.orgNm"
                      :value="v.id"
                    ></el-option>
                  </el-select>
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
        class="orderTotalCls"></orderTotalShow>
    </div>
    <!-- <el-dialog
      title="医嘱引用"
      :visible.sync="copyOrderVisible"
      class="copyOrderCls"
    >
      <copy-order
        v-if="copyOrderVisible"
        @copy="copyOrderCallback"
        style="height: 60vh;"
      ></copy-order>
    </el-dialog> -->
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
        adviceType="治疗"
        v-loading="copyLoading"
      ></copy-order>
    </el-dialog>
  </div>
</template>

<script>
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
  getRecipeNo,
  outpatientNonDrugOrderSave,
  outpatientNonDrugOrderSubmit,
  outpatientNonDrugRemoveOrders,
  outpatientNonDrugPageList,
  getAdviceItem,
  saveOrdersAll,
  batchCancelSubmit,
  validOrders
} from "@/api/cis/order/order";
import { getDiaByClinicType } from "@/api/cis/visit/visit";
import { updateStatus } from "@/utils/updateRecipeStatus.js";
// import { print, preview, onPreview } from "@/utils/print";
import { getDataIdDom } from "@/utils/util.js";
import { getArrayList } from "@/api/wconf/wparam";
import { getEffectiveRecord } from "@/api/common/allergy";
import copyOrder from "../orderReference/index.vue";
import { getAdviceItemList } from "@/api/systemManagement/dataMaintain/adviceItem";
import CisValueDomain from "@/views/cis/components/CisValueDomain.vue";
import lInputNumber from "@/components/adviceCommon/lInputNumber.vue";
import { deepClone, Throttle } from "@/utils/index.js";
import { getDepList } from "@/api/nursingRecord/authorityMaintain.js";
import { getRole } from "@/utils/auth";
import { mixins } from "../presModule/modules/mixin.js";
import {
  configToData,
  isMajorRow,
  getZanCunRow,
  getZanCunAndNewRow,
  handleSubmitRow,
  saveOrderDraft,
  getCutable,
  isZanCunAddNewStatus,
  getQtyByUnitFlag,
  getQtyUnitAjax,
  isHasEditedEmptyRow,
  treatDescriptionData,
  doctorPsReviewLimit,
  getPrintDataFunc,
  setRelateGroupNo
} from "../presModule/modules/adviceUtils.js";
import { treatRequiredItem } from "../presModule/modules/variable.js";
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
  getPrintTplFunc,
  compileToHtml,
  isCStStatusPass,
  confirmProFunc,
  computeTotalHandler,
  cutArrFunc,
  getPharmacyData,
  diagPrintModuleParams
} from "@/components/adviceCommon/adviceUtils.js";
import { outpatientOrderPrint } from "@/api/cis/report/cisPrints.js";
import { isHasEmptyRow,deleteEmptyRow,isNewNotEmptyRow } from "./modules/adviceUtils.js";

import { print, getPrinterList } from "@/utils/print_new"
import { complier, complierTreat, prescriptionTpl } from "@/printTemplete/module/prescriptionLodopTpl.js"
import codes from "@/printTemplete/code.js";
import { getPrintTpl } from "@/api/admin/print/print";
import { injectionTpl, handlePrintData } from '@/printTemplete/module/injectionTpl.js'

export default {
  name: "treatMedicine",
  props: ["execDept", "pageType"], //pageType = additionCost 是补费页面
  mixins: [mixins],
  data() {
    return {
      tableHeight: "100%",
      Rptotal: 0,// 处方总金额
      copyLoading: false,
      vadviceLoading: false,
      printTpl: "",
      pHuShiLoading: false,
      pRLoading: false,
      cclSubtLoading: false,
      pRAllLoading: false,
      disSelectInfo: {},// 废弃，不在使用。在医嘱项目维护中维护
      buttonLoading: {
        addRpLoading: false//控制连击
      },
      tableColumn: [
        // {
        //   prop: "recipeCode",
        //   label: "处方号",
        //   width: 160,
        //   fixed: true
        // },
        {
          prop: "no",
          label: "序号",
          width: 60,
          fixed: true
        },
        {
          prop: "orderStatus", // 状态
          label: "医嘱状态",
          width: 80,
          fixed: true
        },
        {
          prop: "orderItemName",
          label: "医嘱名称",
          align: "left",
          width: 200,
          fixed: true
        },

        // {
        //   prop: "bunching",
        //   label: "成组",
        //   align: "center",
        //   width: 50
        // },
        // {
        //   prop: "spec",
        //   label: "规格",
        //   width: 120
        // },
        // {
        //   prop: "onceDosage",
        //   label: "一次用量"
        // },
        // {
        //   prop: "dosageUnit",
        //   label: "剂量单位"
        // },
        // {
        //   prop: "relation",
        //   label: "关联"
        // },

        {
          prop: "frequencyCode",
          label: "频次",
          width: 150
        },
        // {
        //   prop: "useWay",
        //   label: "用法",
        //   width: 150
        // },
        {
          prop: "useDay",
          label: "天数"
        },

        {
          prop: "price",
          label: "单价（元）",
          width: 100
        },
        {
          prop: "onceDosage",
          label: "单次数量",
          width: 80
        },
        {
          prop: "qty",
          label: "总数",
          width: 80
        },
        {
          prop: "unitKey",
          label: "单位",
          width: 80
        },
        {
          prop: "amt",
          label: "金额（元）",
          width: 120
        },
        // {
        //   prop: "skinTest",
        //   label: "皮试"
        // },
        {
          prop: "urgent",
          label: "加急",
          width: 80
        },
        {
          prop: "treatSite",
          label: "治疗部位",
          width: 100
        },
        {
          prop: "treatMethod",
          label: "治疗方法",
          width: 100
        },
        // {
        //   prop: "flowRate",
        //   label: "滴速",
        //   width: 200
        // },
        // {
        //   prop: "excessReason",
        //   label: "医嘱超量原因",
        //   width: 140
        // },
        {
          prop: "limitResultCode", // 医保限制审批结果
          label: "医保限制",
          width: 80
        },
        {
          prop: "diseaseType", // 医保限制审批结果
          label: "就诊类别",
          width: 80
        },
        {
          prop: "remark",
          label: "备注",
          width: 150
        },
        {
          prop: "freeFlag",
          label: "免费医嘱",
          width: 150
        },
        {
          prop: "execDeptName",
          label: "执行科室",
          width: 150
        },
        {
          prop: "medicalInsuranceCat",
          label: "医保类别",
          width: 120
        },
        {
          prop: "orderCat",
          label: "医嘱类型",
          width: 120
        },
        {
          prop: "chargeStatus", // 收费状态
          label: "收费状态",
          width: 80
        },
       

      ],
      checked: true,
      currentRow: {}, //选中的当前行
      // 选中的当前行的索引
      currentRowIndex: -1,
      rpPosition: 0,
      isMask: false, // 查看遮罩
      RpRowArr: [],
      rpIndex: 0,
      multipleSelection: [], //选中的 checkbox
      groupNoList: [],
      // 分页数据
      currentPage: 0,
      pageSize: 10,
      total: 11,
      listLoading: false,
      tableRuleForm: {
        tableData: [],
        tableRules: {
          orderCat: [
            {
              required: true,
              message: "请选择医保分类",
              trigger: ["change", "blur"]
            }
          ],
          doctorsAdviceCate: [
            { required: true, message: "请选择医嘱类型", trigger: "change" }
          ],
          orderItemName: [
            {
              required: true,
              message: "请选择医嘱项目",
              trigger: ["change", "blur"]
            }
          ],
          relation: [],
          onceDosage: [
            {
              required: true,
              message: "请填写单次剂量",
              trigger: ["blur", "change"]
            },
            {
              pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
              message: "请输入正确的单次计量！"
            }
          ],
          frequencyCode: [
            { required: true, message: "请选择频次", trigger: "blur" }
          ],
          useWay: [{ required: true, message: "请选择用法", trigger: "blur" }],
          qty: [{ required: true, message: "请填写数量", trigger: "blur" }],
          // unitKey: [{required: true, message: "请选择单位", trigger: "blur"}],
          useDay: [{ required: true, message: "请填写天数", trigger: "blur" }],
          /*excessReason: [
            { required: true, message: "请填写超量原因", trigger: ["blur"] }
          ],*/
          remark: []
        }
      },
      selectOptions: [],
      dropColumn: [
        // 下拉 table 配置表头
        // {
        //   prop: "expenseLevel",
        //   label: "报销",
        //   width: 60,
        //   codeTransform: true,
        //   codeTransformCode: "DrugReimbursementType"
        // },
        {
          prop: "orderItemName",
          label: "名称",
          align: "center",
          width: 100
        },
        {
          prop: "spec",
          align: "center",
          label: "规格"
        },
        {
          prop: "price",
          align: "center",
          label: "单价",
          width: 100
        },
        // {
        //   prop: "execDeptName",
        //   label: "药房",
        // align: 'center',
        //   width: 100
        // },
        {
          prop: "itemType",
          label: "项目类别",
          width: 100,
          tableTransformType: "cnf_doctors_advice",
          tableTransform: true
        }
        // {
        //   prop: "execDeptCode",
        //   label: "执行科室",
        //   width: 100,
        //   tableTransformType: "sys_org",
        //   tableTransform: true
        // }
        // {
        //   prop: "stockNum",
        //   label: "库存",
        //   width: 100
        // },
        // {
        //   prop: "basicType",
        //   label: "基药",
        //   width: 110,
        //   codeTransform: true,
        //   codeTransformCode: "BasicDrugType"
        // }
      ],
      inputTableLoading: false, //下拉table组件 loading
      inputMaxL: 10, //单次计量
      freq: {}, // 选中频次信息
      drugItem: {}, // 选中医嘱信息
      skinTestDisabled: true, //皮试勾选是否可选标识
      overReasonShow: false, // 超量原因 表单显示
      relateAdviceDisabled: false, // 关联属性是否只读
      remoteParams: { pageSize: 50, status: "1" }, // 频次分页参数
      showFlowRate: false, //显示滴速输入框
      // 在表格合并单元格之前隐藏用法下拉框，合并完成后显示，消除合并单元格，新增明细后用法下拉有数据显示空白问题
      selectRefresh: true,
      copyOrderVisible: false,
      //全部科室列表
      deptList: []
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("cis", ["templateQuoteKey"]),
    ...mapGetters("cis", ["commonNonDrugData"])
  },

  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      async handler(val) {
        await this.getList();
        if (!this.tableRuleForm.tableData.length && val.visitCode) {
          await this.addRow();
        }
        // await this.setBunchingCls();
      }
    },
    templateQuoteKey() {
      this.getList(true);
      // this.setBunchingCls();
    },
    commonNonDrugData: {
      deep: true,
      async handler(val) {
        val = {
          ...val,
          ...{
            itemType: val.orderCat,
            itemId: val.orderItemId,
            execDeptCode: val.receiveDept
          }
        };
        //重复医嘱提示 通知父组件判断是否有相同医嘱
        try {
          await this.checkDupFunc(val);
        } catch (error) {
          return;
        }

        try {
          await this.addRow();
        } catch (error) {}

        this.select(val);

        //药品名称 赋值
        this.$nextTick(() => {
          setTimeout(() => {
            let row_id = this.currentRow.row_id;
            let nodeList = getDataIdDom(
              "div",
              "data-id",
              "inputTable" + row_id
            );
            if (nodeList.length > 0) {
              nodeList[1].getElementsByClassName("el-input__inner")[0].value =
                val.orderItemName;
            }
          }, 10);
        });
      }
    }
  },
  created() {},
  async mounted() {
    await this.getDeptList();
    this.getPrintTplFunc();
  },
  methods: {
    ...mapActions({
      changeAdditionalOrderLoadKey: "cis/changeAdditionalOrderLoadKey"
    }),
    // 设置 主table的高度
    // setTableAtuoHeight (height){
    //   // this.$nextTick(()=>{
    //     // let wrapperHeight = this.$refs.tableWrapper.offsetHeight;
    //     let mainTableWrapper = this.$refs.mainTableWrapper.offsetHeight;// maitable 整体
    //     // let wrapperHeight = this.$refs.formWrapper.offsetHeight;
    //     let tableUtilsHeight = this.$refs.tableUtils.offsetHeight; // 工具栏高度
    //     let orderTotalHeight = this.$refs.orderTotal.getMyHeight(); // 总计栏高度
    //     // console.log(wrapperHeight, tableUtilsHeight);
    //     if (height == "100%") {
    //       this.tableHeight = height;
    //     } else {
    //       this.tableHeight = mainTableWrapper - tableUtilsHeight - orderTotalHeight;
    //       // this.tableHeight = 40;
    //     }
    //     console.log( mainTableWrapper, tableUtilsHeight, orderTotalHeight);
    //   // })
    // },
    // 医嘱总金额计算
    computeRptotal (){
      // 医嘱总金额计算
      this.Rptotal = computeTotalHandler(this.tableRuleForm.tableData);
    },

    //未收费打印治疗单
    // 该功能取消 
    async printHuShiFunc (){
      
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
        this.$message.warning("仅支持医嘱状态为提交的医嘱进行打印！");
        return;
      }


      if (this.pHuShiLoading) return;
      let orderIds = orderTable.map(item => item.id);
      let params = {
        orderStatus: 99,
        orderId: [],
        visitCode: this.receivePatientData.visitCode,
        pageNo: 1,
        pageSize: 40,
        patientId: this.receivePatientData.patientId,
        printGroup: 4 //1.门诊皮试单、2.门诊注射单、3.输液执行单、4.门诊治疗单
      };
      for (let index = 0; index < orderIds.length; index++) { 
        params.orderId = [orderIds[index]];
        // try {
          let printData = await getPrintDataFunc(params);
          let obj = handlePrintData(printData);
          print(null, injectionTpl, {}, obj, false);
          continue;
        // } catch (error) {
        //   break;
        // }
        
      }
    },
    // 撤销提交
    async cancelSubmit (){
      if (!isCStStatusPass(this.multipleSelection, ["", "0"])) {
        this.$message.error("选择正确的可撤销医嘱！");
        return;
      }
      console.log("aaaaa");
      if (this.cclSubtLoading) return;
      this.cclSubtLoading = true;

      try {
        await confirmProFunc("撤销医嘱提交,是否继续?");
        try {
          let cstIds = this.multipleSelection.map(item => item.id);
          console.log(cstIds);
          let { code,data, msg } = await batchCancelSubmit(cstIds);
          if (code == 1) {
            this.$message.success("撤销成功");
            this.getList();
          } else {
            this.$message.error(msg || "撤销失败");
          }
        } catch (error) {
          this.$message.error("撤销失败");
        } finally {
          this.cclSubtLoading = false;
        }
      } catch (error) {
        this.cclSubtLoading = false;
      }


    },
    // 设置暂存的输入框，失去焦点
    // 避免重复暂存
    setSubmitInputBlur (){
      return new Promise((resolve, reject)=>{
        this.$nextTick(()=>{
          // console.log("暂存的输入框失去焦点了");
          try {
            this.$refs.focusDom.focus();
            resolve(true); 
          } catch (error) {
            reject(false);
          }
        });
      });
    },
    // 疫苗医嘱
    vaccineAdvice (){
      if (this.vadviceLoading) return;

      this.vadviceLoading = true;
      let tableData = this.tableRuleForm.tableData;
      // 删除空行
      if (isHasEmptyRow(tableData)) {
        // console.log("执行删除！");
        this.tableRuleForm.tableData = deleteEmptyRow(tableData);
      }

      this.$nextTick(async () => {
        
        try {
          await this.addRow(false);
          let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
          // 增加 疫苗医嘱 字段
          this.$set(currentRow, "vaccinFlag", 1);
        } catch (error) {
          
        } finally {
          this.vadviceLoading = false;
        }
         

      })
    },
    async getPrintTplFunc (){
      try {
        // this.printTpl = await getPrintTplFunc(codes.prescriptionTpl);
        this.printTpl = prescriptionTpl;
      } catch (error) {
        
      }
      // console.log("printTpl", this.printTpl);
    },
    //为编辑项目赋值序号
    shotcutIndexHandler(scope, name) {
      let requiredList = treatRequiredItem;
      let index = requiredList.findIndex(item => {
        return item.name === name;
      });
      return String(scope.$index) + String(index + 1);
    },
    //编辑完成校验表单字段
    shotreadyHandler(scope, name) {
      if (name === "relation") {
        return true;
      }
      // let isRequiredName = treatRequiredItem.some(item => {
      //   return item.name === name;
      // });
      // if (isRequiredName) {
      //   this.validateField("tableData." + scope.$index + "." + name); //必填校验项校验
      //   // console.log("scope.row[name]", name, scope.row[name]);
      //   // && name !== "useDay" 判断天数不做校验
      //   if (!scope.row[name]) {
      //     return false;
      //   }
      //   return true;
      // }

      if (name === "orderItemName") {
        return isOrderItemNameShotReady(scope.row);
      }

      if (name === "remark") {
        return false;
      }

      if (name === "qty") {
        return !!Number(scope.row[name]);
      }
      return !!scope.row[name];
    },
    maintableValidate() {
      return new Promise((resolve, reject) => {
        this.$refs["ruleForm"].validate(async valid => {
          if (valid) {
            resolve(true);
          } else {
            setFocusOnError();
            reject(false);
          }
        });
      });
    },
    handleSubmitRowWrapper(data) {
      return data;
    },
    //暂存全部
    async draftSaveAll() {
      return new Promise( async (resolve, reject)=>{ 
        if (this.listLoading) {
           reject(false);
           return; 
        }
        // 验证表单
        try {
          await this.maintableValidateWrapper();
        } catch (error) {
          return;
        }

        // console.log(this.tableRuleForm.tableData);
        let ajaxData = getZanCunAndNewRow(this.tableRuleForm.tableData);
        let disSelectInfo = this.disSelectInfo;
        ajaxData = treatDescriptionData(ajaxData, disSelectInfo);
        if (ajaxData.length == 0) return;
        this.listLoading = true;
        try {
          let { code, data, msg } = await saveOrdersAll(ajaxData);
          if (code === 1) {
            this.$message.success("保存成功");
            try {
              await this.getList();
              resolve(true);
            } catch (error) {
              reject(false);
            }
            
          } else {
            this.$message.error(msg || "医嘱暂存失败");
            reject(false);
          }
          this.listLoading = false;
        } catch (error) {
          this.listLoading = false;
          this.$message.error(error.msg || "医嘱暂存失败");
          reject(false);
        }
      })

    },
    //获取科室列表
    async getDeptList() {
      this.deptList = [];
      try {
        let res = await getDepList();
        if (res.code == 1) {
          this.deptList = res.data;
        }
      } catch (e) {}
    },
    headerDragend() {
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    async getList(flag) {
      let visitCode =
        typeof this.$store.state.base.receivePatientData["visitCode"] !==
        "undefined"
          ? this.$store.state.base.receivePatientData["visitCode"]
          : "all"; //获取患者就诊ID
      let data = {
        ...{
          pageNo: this.currentPage,
          pageSize: 99999,
          visitCode: visitCode,
          types: "1,2,3,4,7,8,9,13" //医嘱类别   如果有多个类别，用“,”拼接。这里除检查，检验，药品医嘱外都能开
          // itemType: 2
        }
      };
      //补费 电子处方 区别的参数
      data = this.setOrderFromParam(data);
      this.listLoading = true;
      return new Promise(async (resolve, reject) => {
        // eslint-disable-next-line complexity
        await outpatientNonDrugPageList(data, flag)
          .then(async res => {
            if (res.code === 1) {
              let { data } = res;
              let tableData = [];
              for (let i = 0; i < data.length; i++) {
                let item = data[i];
                // 数量单位转换
                let qty =
                  item.quantity % item.packQuantity !== 0
                    ? item.quantity
                    : item.quantity / item.packQuantity;

                // 滴速显示
                let dropRate1 = "";
                let dropRate2 = "";
                if (item.dropRate && item.dropRate.indexOf("~") > -1) {
                  let splitStr = item.dropRate.split("~");
                  dropRate1 = splitStr[0];
                  dropRate2 = splitStr[1];
                }

                // await this.getQtyUnitAjax(item).then(res => {
                //   item.unitOptions = res;
                // });
                tableData.push({
                  ...item,
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
                  recipeId: item.recipeId || "",
                  orderCat: item.orderCat || "",
                  relation: item.relation || undefined,
                  spec: item.spec || "",
                  price: item.price || "",
                  dosage: item.dosage || "",
                  dosageUnit: item.dosageUnit || "",
                  onceDosage: item.onceDosage || "",
                  useWay: item.useWay || "",
                  frequencyCode: item.frequencyCode || "",
                  frequencyTimes: item.frequencyTimes || "",
                  frequencyUnit: item.frequencyUnit || "",
                  quantity: item.quantity || "",
                  unit: item.unit,
                  packUnit: item.packUnit || "",
                  qty: qty || "",
                  packQuantity: item.packQuantity || "",
                  unitKey: item.unit,
                  // skinTest: item.skinTest || "",
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
                  excessReason: item.excessReason || "",
                  diagnosisTime: item.diagnosisTime,
                  isMajor: item.isMajor,
                  groupNo: item.groupNo,
                  no: item.no || i + 1,
                  urgent: item.urgent,
                  unqualifiedComment: item.unqualifiedComment || "",
                  checkTime: item.checkTime || "",
                  checkUserName: item.checkUserName || "",
                  groupNoCls: "", //成组样式
                  execDeptId: item.receiveDept || "",
                  execDeptName: item.receiveDeptName,
                  receiveDept: item.receiveDept || "",
                  orderStatus: item.orderStatus || "",
                  chargeStatus: item.chargeStatus || "",
                  dataVersion: item.dataVersion || 0,
                  rDataVersion: item.rDataVersion || 0,
                  unitOptions: item.unitOptions
                });
              }

              // 初始化处方状态
              // updateStatus(data, this);
              this.$root.eventHub.$emit("top-list-change");

              this.tableRuleForm.tableData = [];
              this.tableRuleForm.tableData = tableData;
              // this.setBunchingCls();
              // this.setDataAddType(); //给数据增加type 属性
              // this.getRpRowArr(); //处方项相同的合并处理
              this.currentPage = res.pageNo;
              // this.pageSize = res.pageSize;
              this.total = res.total;
              // 处方总金额计算
              this.computeRptotal();
              resolve(true);
            } else {
              this.$message.error(res.msg ? res.msg : "获取数据失败");
              reject(false);
            }
            this.listLoading = false;
          })
          .catch(() => {
            this.listLoading = false;
            reject(false);
          });
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
        freeRpRow: a.row.freeFlag !== "" && a.row.freeFlag !== undefined
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
    // 20个 药品一页  超出 打印第二页
    dataPrintFunc (printData = {}, printDirect){
      let index = getPrinterList();
      
      let obj = {
        diagHtmlTop: "146.5pt", // 诊断模块 绝对 top 
        diagHtmlHeight: "14pt",// 诊断模块 高度 
        cHtmlLineTop: "165pt",// 诊断 与 药品中间的线的绝对 top 
        contentHtmlTop: "170pt", // 治疗医嘱模块的 绝对 top 
        MIS_ID: "",
        settlemetnType: "",
        patientNum: "",
        patientGender: "",
        age: "",
        deptId: "",
        outpDeptName: "",
        doctorName: "",
        diagTime: "",
        relateAddress: "",
        relateNum: "",
        applyNum: "",
        chargpeople: "",
        visitCode: "",
        relateCode: "",
        weight: "",
        diagList: [ { diagList: [{}] }]
      };
      obj = {
        ...obj,
        ...printData
      }
      // 获取打印诊断 相关参数
      let { diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop, diagNameObj } = diagPrintModuleParams(obj.diagList[0].diagList, { maxLineNum: 4 });
 
      obj = {
        ...obj,
        ...{
          diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop,diagNameObj
        }
      }
      // console.log(data);
      index = 3; // 默认3 ，便于测试



      // let samples = this.$refs.rigTable.bodyWrapper.querySelectorAll(
      //   ".sample"
      // );
      // 处理反显字段
      // data.forEach((item, i) => {
      //   item.part3.forEach(item1 => {
      //     item1.sampleType = samples[i].innerText
      //   })
      // })



      let {htmlStr, diagnoseStr} = complierTreat(obj);
      obj.contentHtml = htmlStr;
      obj.diagnoseHtml = diagnoseStr;

      //体重 weight
      obj.weight = obj.weight ? obj.weight + "kg" : "";
      //处方类型 diseaseRecipeType
      obj.diseaseRecipeType = obj.diseaseRecipeType ? obj.diseaseRecipeType : "";
      //社康中心  处方笺
      obj.hosName = obj.hosName + "治疗单";
      // 姓名截取前八位
      obj.patientName = obj.patientName ? obj.patientName.substring(0,8) : "";

      // console.log("printData", printData, chmLodopTpl);
      // print(null, this.printTpl, {}, obj, printDirect);
      print(null, this.printTpl, {}, obj, false);
    },
    tableFormValidate() {
      return new Promise((resolve, reject) => {
        this.$refs["ruleForm"].validate((valid, error) => {
          if (valid) {
            resolve(true);
          } else {
            this.showErrorMsg(error);
            reject();
          }
        });
      });
    },
    showErrorMsg(errorObj) {
      let self = this;
      for (let key in errorObj) {
        setTimeout(function() {
          if (document.getElementsByClassName("el-message").length === 0) {
            //message 弹窗一次错误
            self.$message.error(errorObj[key][0]);
          }
        }, 0);
      }
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
            try {
              await this.tableFormValidate(); //table的校验
            } catch (error) {
              reject(false);
            }
            resolve(true);
          } catch (error) {
            reject(false);
          }
        });
      });
    },
    async submitOrders() {
      if (this.listLoading) return;
      try {
        await this.maintableValidateWrapper();
      } catch (error) {
        return;
      }

      try {
        
        await this.draftSaveAll();

      } catch (error) {
        return;
      }


      let tableData = this.tableRuleForm.tableData;

      //列表中有  还有 未暂存的数据
      if (isHasEditedEmptyRow(tableData)){
        this.$message.warning("医嘱列表中有未暂存的数据，请先暂存后提交");
        return;
      }

      // 这里写入ajax
      // let data = this.multipleSelection;
      // let data = this.tableRuleForm.tableData;
      let data = getZanCunRow(this.tableRuleForm.tableData);
      if (data.length < 1) {
        this.$message.warning("无符合条件的数据可提交！");
        return false;
      }

      let everyIsSubmit = data.every(item => {
        return item.orderStatus === "0" || item.orderStatus === "2"; //只有暂存和提交状态能提交
      });

      if (!everyIsSubmit) {
        this.$message.warning("仅支持医嘱状态为暂存和提交的医嘱进行提交！");
        return false;
      }

      let flag = false;
      data.forEach(item => {
        // 废数据过滤
        if (typeof item.orderItemId === "undefined") {
          data.splice(data.indexOf(item), 1);
        }
        // 收费状态过滤
        if (item.chargeStatus === "1") {
          flag = true;
        }
      });
      if (flag) {
        this.$message.warning("已收费的医嘱不可重复提交！");
        return false;
      }

      // 整处方提交
      // let recipeFlag = false;
      // let dataList = this.handleRecipe(this.tableRuleForm.tableData);
      // let selectList = this.handleRecipe(data);
      // dataList.forEach((item, index) => {
      //   selectList.forEach((sItem, index) => {
      //     if (item.key === sItem.key && item.value !== sItem.value) {
      //       recipeFlag = true;
      //     }
      //   });
      // });
      // if (recipeFlag) {
      //   this.$message.warning("请选择整处方提交！");
      //   return false;
      // }

      outpatientNonDrugOrderSubmit(data).then(res => {
        if (res.code === 1) {
          this.getList(false);
          this.$message.success("提交成功");
          this.changeAdditionalOrderLoadKey(+new Date());
        } else {
          this.$message.error(res.msg ? res.msg : "提交数据失败");
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
    //新增处方只能有一个在编辑状态
    isGreaterThanOne() {
      let list = this.tableRuleForm.tableData;
      let number = 0;
      for (var i = 0; i < list.length; i++) {
        if (list[i].row_id) {
          number++;
        }
      }
      if (number >= 1) {
        return true;
      }
      return false;
    },
    addRowWrapper (){
      let tableData = this.tableRuleForm.tableData;
      // 删除空行
      if (isHasEmptyRow(tableData)) {
        // console.log("执行删除！");
        this.tableRuleForm.tableData = deleteEmptyRow(tableData);
      }

      this.$nextTick(async () => {
        this.addRow()
      })
    },
    //用户没有选中，默认最后一条选中，并选择该处方号
    // hasDiagn 有诊断校验
    async addRow(hasDiagVlid = true) {
      // debugger
      if (this.isGreaterThanOne()) {
        this.$message.warning("您还有一条医嘱未编辑完成，请先完成编辑。");
        return;
      }
      //空 table 新增明细 提示用户 新增处方
      let addRowEmpty = {};
      var row = "";
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

      // 诊断校验
      if (hasDiagVlid) {
        try {
          this.listLoading = true;
          // 是否有诊断校验
          let rep = await getDiaByClinicType({ visitCode: visitCode });
          this.listLoading = false;
          if (rep.code === 1 && rep.data.length === 0) {
            this.$message.warning(
              "当前患者还没有诊断，请开诊断之后才能开治疗医嘱！"
            );
            this.buttonLoading.addRpLoading = false;
            return false;
          }
        } catch (error) {
          this.$message.error("获取当前患者诊断失败！");
          this.listLoading = false;
          this.buttonLoading.addRpLoading = false;
          return false;
        }
      }


      let _index = 0;
      let no = 0;
      // this.tableRuleForm.tableData.forEach(item => {
      // if (item["recipeCode"] === row.recipeCode) {
      //   _index++;
      // }
      // if (item.recipeCode === row.recipeCode && item.no * 1 > no) {
      //   no = item.no * 1;
      // }
      // });
      // if (_index >= 5) {
      //   this.$message.warning("药品处方不能超过五条！");
      //   return false;
      // }
      // eslint-disable-next-line consistent-return
      return new Promise((resolve, reject) => {
        // this.clearTypeCurrent();
        addRowEmpty = this.resetCurrentData();
        // 获取相同处方号最后一个index，往后添加
        // this.tableRuleForm.tableData.forEach((item, index) => {
        //   if (item.recipeCode === row.recipeCode) {
        //     rowindex = index;
        //   }
        // });
        // this.tableRuleForm.tableData.splice(rowindex + 1, 0, addRowEmpty);
        this.tableRuleForm.tableData.push(addRowEmpty);
        let rowindex = this.tableRuleForm.tableData.length - 1;
        this.currentRow = addRowEmpty;
        this.currentRowIndex = rowindex;
        this.setCurrentLight(this.tableRuleForm.tableData[rowindex]);
        this.getRpRowArr();

        //焦点定位到医嘱名称
        this.$nextTick(() => {
          let nodeList = getDataIdDom(
            "div",
            "data-id",
            "inputTable" + addRowEmpty["row_id"]
          );
          if (nodeList.length > 0) {
            nodeList[1].getElementsByClassName("el-input__inner")[0].focus();
          }

          //处方列表 定位到最底下 最左面
          let rpTable = this.$refs.multipleTable;
          // console.log(rpTable.bodyWrapper);
          rpTable.bodyWrapper.scrollTop = rpTable.bodyWrapper.scrollHeight;
          rpTable.bodyWrapper.scrollLeft = 0;
          this.buttonLoading.addRpLoading = false;
          resolve(true);
        });
      });
    },

    //节流
    async submitCurRowWrapper (event, row){
      if (this.listLoading) return;
      this.fixedCurrentIndex(row);
    // submitCurRowWrapper: Throttle(async function(e) {
      try {
        this.listLoading = true;
        let result = await this.submitCurRow();
        if (result) {
          this.addRow();
        }
         this.listLoading = false;
      } catch (error) {
        this.listLoading = false;
      }
    // }, 3000),
    },

    // 提交表单 备注 回车 tab 键 提交当前行
    fixedCurrentIndex(row) {
      // console.log("执行了 focus");
      this.currentRowIndex = row.trindex; // 设置当前行数据
      this.currentRow = this.tableRuleForm.tableData[this.currentRowIndex]
    },
    async submitCurRow() {
      /* eslint-disable no-multi-spaces */
      /* eslint-disable consistent-return */
      /* eslint-disable complexity */
      /* eslint-disable no-useless-concat */
      /* eslint-disable consistent-return */
      /* eslint-disable complexity */
      return new Promise(async (resolve, reject) => {
        try {
          await this.maintableValidateWrapper();
        } catch (error) {
          reject(false);
          return;
        }

        // this.$refs["ruleForm"].validate(valid => {
        // if (valid) {
        // let current = this.currentRow;
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
        // let orderItem = { ...form, ...this.drugItem };
        let orderItem = { ...form };

        // debugger
        // console.log("orderItem里面的useWay",orderItem.useWay);
        // console.info("orderItem", orderItem);
        if (
          typeof orderItem.orderItemId === "undefined" ||
          orderItem.orderItemId === ""
        ) {
          this.$message.warning("请选择医嘱项目之后再保存！");
          reject(false);
          return false;
        }
        if (
          typeof orderItem.chargeStatus !== "undefined" &&
          orderItem.chargeStatus !== "" &&
          orderItem.chargeStatus !== "0"
        ) {
          this.$message.warning("已收费的医嘱不可编辑！");
          reject(false);
          return false;
        }

        if (
          typeof orderItem.visitCode === "undefined" ||
          orderItem.visitCode === ""
        ) {
          this.$message.warning("请选择接诊患者后才可保存医嘱！");
          reject(false);
          return false;
        }
        // if (
        //   typeof orderItem.recipeCode === "undefined" ||
        //   orderItem.recipeCode === ""
        // ) {
        //   this.$message.warning("处方号不能为空！");
        //   return false;
        // }

        //验证关联药品
        // console.info(form, current)
        // debugger
        // if (form.relation > current.no || form.relation <= 0) {
        //   this.$message.warning("关联医嘱序号有误，请核对后再填写！");
        //   return false;
        // }

        // console.log("用药天数有误，请核对后再填写！ form.useDay用药天数：", form.useDay);

        //用药天数不能小于0
        if (typeof form.useDay === "undefined" || form.useDay <= 0) {
          this.$message.warning("天数有误，请核对后再填写！");
          reject(false);
          return false;
        }

        // 滴速
        // if(form.useWay === "404"){
        //   if (
        //     typeof form.dropRate1 === "undefined" ||
        //     typeof form.dropRate2 === "undefined" ||
        //     form.dropRate2 < form.dropRate1
        //   ) {
        //     this.$message.warning("滴速填写错误！");
        //     return false;
        //   } else {
        //     form.dropRate = form.dropRate1 + "~" + form.dropRate2;
        //   }
        // }

        //数量换算
        // 换算最小单位数量
        // let qty =
        //   form.unitKey === orderItem.packUnit
        //     ? form.qty * 1 * orderItem.packQuantity
        //     : form.qty;
        // form.quantity = form.qty;
        // form.unit = orderItem.unit;
        // form.unit = orderItem.unitKey;
        let disSelectInfo = this.disSelectInfo;
        form = treatDescriptionData([form], disSelectInfo)[0];
        orderItem = { ...orderItem, ...form};

        // 超7天校验  没有超量原因
        // let hasReason =
        //   typeof orderItem.excessReason === "undefined" ||
        //   orderItem.excessReason === ""
        //     ? false
        //     : true;
        // if (orderItem.day > 7 && !hasReason) {
        //   //弹出填写超量原因提示框，并填写提交
        //   this.overReason = true;
        //   return;
        // }

        // 天数超量控制三位数
        // if (orderItem.day.toString().length > 2) {
        //   this.$message.warning("可用天数过长，请确认后再保存");
        //   reject(false);
        //   return false;
        // }

        // console.info("orderItem", orderItem);
        // orderItem.urgent = orderItem.urgent === "" ? "0" : orderItem.urgent;

        // orderItem.no = form.relation === "undefined" ? "" : form.relation;
        //补费 电子处方 区别的参数
        orderItem = this.setOrderFromParam(orderItem);
        this.listLoading = true;

        // console.log("提交的数据useWay",orderItem.useWay);
        outpatientNonDrugOrderSave(orderItem)
          .then(async res => {
            if (res.code === 1) {
              this.$message.success(res.msg ? res.msg : "保存成功");
              // 暂存成功后 回车输入框 失去焦点 避免重复暂存
              await this.setSubmitInputBlur();
              // this.getList();
              // this.addRow();
              try {
                let getListResult = await this.getList();
                if (getListResult) {
                  resolve(true);
                }
              } catch (e) {
                reject(e);
              }

              // save btn 存储 数据
              // this.$emit("save");
            } else {
              this.$message.error(res.msg ? res.msg : "医嘱暂存失败");
              reject(false);
            }
            this.listLoading = false;
          })
          .catch(() => {
            this.listLoading = false;
            reject(false);
          });
        // } else {
        //   // alert("报错了");
        //   // 错误 表单聚焦
        //   setTimeout(() => {
        //     let isError = document.getElementsByClassName("is-error");
        //     isError[0].querySelector("input").focus();
        //   }, 10);
        //   return false;
        // }
        // });
      });
    },
    inputHandlerWrapper (value, row){
      // this.fixedCurrentIndex(row);
      this.inputHandler();
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
      // 多选框是否禁用
      // return row.orderStatus !== "4";
      return true;
    },
    // 数量 后面的单位改变
    unitChange(value) {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      // this.currentRow.unit = this.getLabel(this.currentRow.unitOptions, value);
      currentRow.unit = this.getLabel(
        currentRow.unitOptions,
        value
      );
      this.computeAmt();
    },
    getLabel(optList, key) {
      let obj = optList.find(item => {
        return item.value === key;
      });
      return obj.label;
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
    search(query) {
      setLInputTableShotReady(
        "off",
        this.tableRuleForm.tableData[this.currentRowIndex],
        this
      );

      if (!this.execDept && this.pageType === "additionCost") {
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
      // let pageNo = this.queryName === query ? this.currentPage * 1 + 1 : 0;
      let data = {
        //this.execDept  结算 补费 非药品 执行科室
        ...{
          pageNo: pageNo,
          pageSize: this.pageSize,
          name: query,
          cwType: "1",
          activeType: "1,2,3,4,7,8,9,13", //这里除检查，检验，药品医嘱外都能开
          execDept: this.execDept
        }
      };
      // console.info("======this.$store.state.cis", this.$store.state.cis);
      // if (this.queryName !== query) {
      //   this.selectOptions = [];
      // }
      this.inputTableLoading = true; //增加loading
      getAdviceItemList(data)
        // eslint-disable-next-line complexity
        .then(res => {
          if (res.code === 1) {
            let { data } = res;
            // let tableData = this.currentPage !== 0 ? this.selectOptions : [];
           let tableData = pageNo !== 1 ? this.selectOptions : []; //取消药品分页
          //  let tableData = []; //取消药品分页
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              tableData.push({
                itemId: item.itemId || "",
                itemCode: item.itemCode || "",
                orderItemName: item.drugName || "",
                production: item.production || "",
                itemType: item.itemType || "",
                classCode: item.classCode || "",
                itemTypeName: item.itemTypeName || "",
                execDeptCode: item.execDeptCode || "",
                execDeptName: item.execDeptName || "",
                spec: item.spec || "",
                price: new Number(item.price || 0).rewToFixed(4) || "",
                unit: item.unit || "",
                limitUnit: item.limitUnit || "",
                // relateUnit: item.relateUnit || "",
                packQuantity: item.packQty || "",
                defaultDosageUnit: item.defaultDosageUnit || "",
                defaultUsage: item.defaultUsage || "",
                dosage: item.dosage || "",
                // stockNum: convertStockShow(item.limitUnitName, item.unitName, item.pkgMeasure, item.stockNum),
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
          this.inputTableLoading = false;
        })
        .catch(e => {
          this.$message.error(e.msg ? e.msg : "获取数据失败");
          this.inputTableLoading = false;
        });
    },
    // 重置下拉table的分页数据
    resetLInputTablePaging() {
      this.selectOptions = [];
      this.currentPage = 0;
      this.pageSize = 10;
      this.total = 11;
    },
    async selectDropRow(row) {
      /*let allergyNameFlag = false;
      let allergyName =
        typeof this.$store.state.base.receivePatientData.allergyName ===
        "undefined"
          ? ""
          : this.$store.state.base.receivePatientData.allergyName;
      let self = this;
      if (
        (row.orderItemName.indexOf("阿莫西林") !== -1 ||
          row.orderItemName.indexOf("罗红霉素") !== -1) &&
        allergyName !== ""
      ) {
        this.$confirm("患者过敏提示：" + allergyName + ",  是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            //继续选中操作
            self.selectWrapper(row);
          })
          .catch(() => {
            //取消操作
            self.currentRow.orderItemName = "";
            let index =
              self.$refs.lInputTable.length > 2 ? self.currentRowIndex * 2 : 0;
            // 清空药品搜索
            self.$refs.lInputTable[index] &&
              self.$refs.lInputTable[index].clear();
            self.$refs.lInputTable[index + 1] &&
              self.$refs.lInputTable[index + 1].clear();
          });
      } else {*/
      //初始化 下拉table的 数据
      this.resetLInputTablePaging();
      if (!row) {
        return;
      }
      //选中
      this.selectWrapper(row);
      //}
    },
    //zhengyawen  校验
    async checkDeptFunc(data) {
      let self = this;
      return new Promise(async (resolve, reject) => {
        let { visitCode } = this.receivePatientData; //获取患者信息
        let curObj = this.currentRow;
        let recipeCode = curObj ? curObj["recipeCode"] : ""; //获取当前处方号
        let row = {
          visitCode,
          orderItemId: data.itemId,
          orderItemName: data.orderItemName
        };
        await validOrders(row)
          .then(async res => {
            if (res.code === 1) {
              //赋值给表格选中行
              let row = {
                ...data,
                ...res.data,
                ...{
                  receiveDept: res.data.receiveDept,
                  execDeptName: res.data.receiveDeptName
                }
              };
              resolve({ ...row });
            } else {
              this.clearCurrentRow();
              this.setLInputTableFocus();
              reject(false);
            }
          })
          .catch(error => {
            this.clearCurrentRow();
            this.setLInputTableFocus();
            reject(false);
          });
      });
    },
    resetCurrentData(data = {}) {
      let addRowEmpty = {};
      this.tableColumn.forEach(item => {
        addRowEmpty[item.prop] = "";
      });
      // addRowEmpty["recipeCode"] = row.recipeCode; // 初始化数据
      // addRowEmpty["recipeId"] = row.recipeId;
      addRowEmpty["price"] = 0;
      addRowEmpty["amt"] = 0;
      addRowEmpty["no"] = this.tableRuleForm.tableData.length + 1;
      console.log(addRowEmpty["no"]);
      addRowEmpty["orderItemName"] = ""; // 0107
      // addRowEmpty["frequencyCode"] = "pm"; // 0107
      // addRowEmpty["frequencyTimes"] = "1"; // 0107
      // addRowEmpty["frequencyUnit"] = "天"; // 0107
      addRowEmpty["orderStatus"] = ""; // 0107
      addRowEmpty["row_id"] = +new Date();
      addRowEmpty["relation"] = undefined;
      addRowEmpty["qty"] = undefined;
      addRowEmpty["receiveDept"] = this.execDept;
      addRowEmpty["useDay"] = 1;
      addRowEmpty["limitResultCode"] = null;
      addRowEmpty["ChronicDisease"] = null;
      addRowEmpty["ChronicDiseaseName"] = null;

      //console.log("disSelectInfo", this.disSelectInfo);
      addRowEmpty = {
        ...addRowEmpty,
        //频次默认
        ...{
          frequencyCode: "",
          frequencyTimes: "",
          frequencyUnit: ""
        },
        // 病种选择
        ...this.disSelectInfo
      }
      return addRowEmpty;
    },
    //清空当前行
    clearCurrentRow() {
      let addRowEmpty = this.resetCurrentData();
      let { row_id } = this.tableRuleForm.tableData[this.currentRowIndex];
      addRowEmpty = {
        ...addRowEmpty,
        ...{
          row_id
        }
      }
      this.$set(
        this.tableRuleForm.tableData,
        this.currentRowIndex,
        addRowEmpty
      );
      this.clearLInputTable();
    },
    //清空药品搜索框
    clearLInputTable() {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      // refs 方式 如果有fixed列会失效，直接用操作DOM处理
      this.$nextTick(() => {
        let targetDataId = "inputTable" + currentRow.row_id;
        let nodeList = getDataIdDom("div", "data-id", targetDataId);

        if (nodeList.length > 0) {
          nodeList.forEach(element => {
            element.getElementsByClassName("el-input__inner")[0].value = "";
          });
        }
      });
    },
    setLInputTableFocus() {
      let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
      setComponentFocusFunc("inputTable", currentRow.row_id);
    },
    async selectWrapper(row) {
      if (!row) return;
      let rowInit = deepClone(row);
      console.info("===============this.c", this.currentRow);
      // 如果是新增，通知父组件判断是否有相同医嘱
      if (typeof this.currentRow.id === "undefined") {
        try {
          let result = await this.checkDupFunc(row);
          // console.log("result:::::", result);
          // if(!result)return;
        } catch (error) {
          // console.log("error:::::", error);
          return;
        }
      }

      //zhengyawen  校验
      if (typeof this.currentRow.id === "undefined") {
        try {
          let res = await this.checkDeptFunc(row);
          rowInit = {
            ...rowInit,
            ...res
          };
          // console.log("rowInit:::", rowInit);
          let { limitMsg, limitResultCode } = rowInit;
          // console.log("limitResultCode:::", limitResultCode);
          if (limitResultCode == 1) {// 弹窗
            try {
              let { confirmCode } = await doctorPsReviewLimit(limitMsg);

              if (confirmCode == 1) {
                //审批通过
                console.log("是 审批通过");
              } else if(confirmCode == 0) {
                // 否（自费使用）
                console.log("否 自费使用");
              }
              this.$set(rowInit, "limitResultCode", confirmCode);
            } catch (error) {
              console.log("清空当前行");
              //清空当前行
              this.clearCurrentRow();
              return;
            }
          } else {
            //重置 limitResultCode
            this.$set(rowInit, "limitResultCode", null);
          }
        } catch (error) {
          return;
        }
      }

      this.select(rowInit);
    },
    // eslint-disable-next-line complexity
    select(row) {
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
      let data = {
        ...row,
        id: id,
        visitCode: typeof visitCode === "undefined" ? "" : visitCode,
        patientId: patientId,
        patientName: patientName,
        patientCode: patientCode,
        // recipeCode: recipeCode,
        // recipeId: recipeId,
        orderCat: row.itemType,
        spec: row.spec,
        price: row.price,
        dosage: row.dosage,
        packQuantity: row.packQty,
        dosageUnit: row.defaultDosageUnit,
        orderItemName: row.orderItemName,
        orderItemId: row.itemId,
        orderItemCat: row.itemType,
        classCode: row.classCode,
        receiveDept: row.receiveDept || JSON.parse(getRole()).deptId,
        manageType: row.manageType,
        formCode: row.formCode,
        unitSaleFlg: row.unitSaleFlg,
        dataVersion: row.dataVersion ? row.dataVersion : 0,
        stockNum: row.stockNum,
        unit: row.unit,
        // packUnit: row.unit,
        unitKey: row.unit,
        drugDosage: row.dosage + row.defaultDosageUnit,
        stClassCode: row.stClassCode || "",
        stType: row.stType || "",
        stSolutionType: row.stSolutionType || "",
        stRemindTime: row.stRemindTime || "",
        validTime: row.validTime || "",
        positiveDispense: row.positiveDispense || "",
        applicationRange: row.applicationRange || "",
        execDeptName: row.execDeptName || "",
        orderStatus: row.status || "",
        //取消 频次默认 立即
        // 更改 频次默认 每日一次
        ...{
          frequencyCode: "QD",
          frequencyTimes: "1",
          frequencyUnit: "天"
        },
        // 一次用量默认 1
        onceDosage: 1
      };
      //
      // await this.getQtyUnitAjax(data).then(res => {
      //   data.unitOptions = res;
      // });
      console.log("data:::::", data);
      this.selectOptions = [];
      this.currentPage = 0;

      // 皮试药品勾选皮试
      if (data.stType !== "") {
        this.skinTestDisabled = false;
        // this.currentRow.skinTest = true;
      } else {
        this.skinTestDisabled = true;
        // this.currentRow.skinTest = false;
      }

      // this.currentRow = Object.assign(this.currentRow, data);
      for (let key in data) {
        this.$set(this.currentRow, key,  data[key]);
        this.$set(this.tableRuleForm.tableData[this.currentRowIndex], key,  data[key]);
      }

      // debugger
      //设置选择药品值
      this.drugItem = data;

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

      setLInputTableShotReady(
        "on",
        this.tableRuleForm.tableData[this.currentRowIndex],
        this
      );

      //焦点定位到关联
      this.$nextTick(() => {
        try {
          let nodeList = getDataIdDom(
            "div",
            "data-id",
            "frequency" + this.currentRow["row_id"]
          );
          if (nodeList.length > 0) {
            nodeList[0].getElementsByTagName("input")[0].focus();
          }
        } catch (e) {}

        try {
          this.handleQty();
        } catch (error) {

        }
      });
    },
    // code 获取数量单位 中文
    async getQtyUnitAjax(data) {
      // 获取单位数据
      let param = [];
      let shows = [];
      let unitOptions = [];
      shows.push(data.packUnit);
      // 判断药品是否可拆零
      if (
        data.unitSaleFlg === "1" ||
        (data.unitSaleFlg === undefined && data.unit)
      ) {
        shows.push(data.unit);
      }
      param.push({ code: "DrugUnit", field: "code", shows: shows });
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
        return unitOptions;
      } else {
        this.$message.error(
          res.msg ? res.msg : "获取药品单位有误，请确认无误后再选择！"
        );
        return false;
      }
    },
    //取消皮试勾选时
    changeSkinTest() {
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
    computeAmtWrapper (value, row){
      // console.log("input执行了");
      // this.fixedCurrentIndex(row);
      this.computeAmt(value);
    },
    // 计算金额
    computeAmt(value) {
      // console.log("currentRowIndex", this.currentRowIndex);
      // console.log("输入的是value", value);
      // console.log("输入的是this.currentRow.qty", this.currentRow.qty);
      // console.log("输入的是 this.tableRuleForm.tableData[this.currentRowIndex]", this.tableRuleForm.tableData[this.currentRowIndex].qty);

      // if (value !== undefined) {
      //   if (isNaN(value) || (value && value.indexOf("-") >= 0)) return;
      // }

      if (this.currentRowIndex == "-1") return;
      this.$nextTick(() => {
        let curObj = this.tableRuleForm.tableData[this.currentRowIndex];
        // let orderItem = { ...curObj, ...this.drugItem };
        let orderItem = { ...curObj };
        let unitKey = curObj.unitKey;
        let qty = curObj.qty;
        // if (this.currentRow.qty != value) {// 修复 currentRow.useDay 没有及时更新 造成 useDay的计算问题
        //   qty = value;
        // }

        //非药品 没有大包装小包装 qty 与 quantity 统一
        this.tableRuleForm.tableData[this.currentRowIndex].quantity = qty;
        //非药品 没有大包装小包装 qty 与 quantity 统一
        this.currentRow.quantity = qty;

        let price =
          typeof orderItem.price !== "undefined" ? orderItem.price : 0;
        let packQty = orderItem.packQuantity ? orderItem.packQuantity * 1 : 1;
        let amt = 0; // 金额
        let num = 0; // 预减库存

        // 先判断选中单位是否为包装单位，单位不同，计算规则不同
        if (unitKey === orderItem.packUnit) {
          amt = (price * 100 * qty) / 100; //计算金额
          num = packQty * qty;
        } else {
          amt = ((price * 100) / packQty / 100) * qty; //计算金额
          num = qty;
        }

        this.drugItem.amt = amt;
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
        this.tableRuleForm.tableData[this.currentRowIndex].amt =
          Math.round(amt * 100) / 100;
        this.computeDay();

        // 医嘱总金额计算
        this.computeRptotal();
        // this.updateTableData_list();
      });
    },
    // 计算天数
    computeDay() {
      let rowData = deepClone(this.currentRow);
      // let { freq, drugItem, ruleForm } = deepClone(this.selectDrop);
      let freq = this.freq;
      let drugItem = this.drugItem;
      let ruleForm = this.currentRow;
      let orderItem = drugItem && drugItem.dosage ? drugItem : rowData;
      let onceDosage = ruleForm.onceDosage ? ruleForm.onceDosage : 0;
      let qty =
        ruleForm.unitKey === orderItem.packUnit
          ? ruleForm.qty * orderItem.packQuantity * 1
          : ruleForm.qty * 1;
      let times = 1;
      let day = 0;
      if (freq.cycleUnit === "天") {
        times = freq.frequencyTimes;
      } else if (freq.cycleUnit === "周") {
        times = freq.frequencyTimes / 7;
      } else if (freq.cycleUnit === "月") {
        times = freq.frequencyTimes / 30;
      }

      if (onceDosage !== 0) {
        day = (qty * orderItem.dosage) / onceDosage / times;
        day = Math.ceil(day); //向上取整  可用天数字段
      }
      this.tableRuleForm.tableData[this.currentRowIndex].day = day;
      // this.currentRow.day = day;
      // this.selectDrop.displayList.forEach(item => {
      //   if (item.prop === "day") {
      //     item.value = day;
      //   }
      // });

      // this.currentRow.day = Math.round(amt * 100) / 100;

      //显示超量提醒
      if (typeof day != undefined && day > 7) {
        this.overReasonShow = true;
      } else if (typeof day != undefined && day <= 7) {
        this.overReasonShow = false;
        this.currentRow.excessReason = "";
      }
    },
    // 处理用法 函数
    handleUseWay(value, item) {
      if (item.name.indexOf("滴注") === -1 || item.code !== "404") {
        // 清空滴速
        this.currentRow = {
          ...this.currentRow,
          dropRate: "",
          dropRate1: "",
          dropRate2: ""
        };
        this.$set(this.tableRuleForm.tableData, this.currentRowIndex, {
          ...this.tableRuleForm.tableData[this.currentRowIndex],
          dropRate: "",
          dropRate1: "",
          dropRate2: ""
        });
      }
      // useWay 赋值 currentRow
      this.currentRow = {
        ...this.currentRow,
        useWay: value
      };
    },
    // 选中频次处理方法
    handleFreq(value, item, row) {
      console.log(value, item, row);
      this.freq = item;
      // this.currentRow = {
      //   ...row,
      //   ...{
      //     frequencyTimes: item.frequencyTimes,
      //     frequencyUnit: item.cycleUnit
      //   }
      // };
      this.$set(row, "frequencyTimes", item.frequencyTimes);
      this.$set(row, "frequencyUnit", item.cycleUnit);
      this.fixedCurrentIndex(row);
      this.handleQty();
    },

    //限制用药天数只能输入正整数
    limitNum(e) {
      var license_num = e.target.value;
      license_num = license_num.replace(/[^\.\d]/g, ""); // 清除“数字”和“.”以外的字符
      if (license_num.indexOf(".") < 0 && license_num != "") {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        e.target.value = parseInt(license_num);
      }

      if (license_num == 0) {
        e.target.value = "";
      } else {
        e.target.value = license_num;
      }
    },
    handleQtyWrapper (row, value){
      // this.fixedCurrentIndex(row);
      this.handleQty(value);
    },
    // 输入用药天数时，计算数量
    handleQty(value) {
      // if (value !== undefined) {
      //   if (isNaN(value) || value.indexOf("-") >= 0) return;
      // }
      if (this.currentRowIndex == "-1") return;
      this.$nextTick(() => {
        // let freq = 
        //   Object.keys(this.freq).length > 0 ? this.freq : this.currentRow;

        let currentRow = this.tableRuleForm.tableData[this.currentRowIndex];
        let freq = currentRow;
        // let orderItem =
        //   this.drugItem && this.drugItem.dosage ? this.drugItem : currentRow;
        let onceDosage = currentRow.onceDosage ? currentRow.onceDosage : 1;
        let times = 1;
        let useDay =
          typeof currentRow.useDay != undefined ? currentRow.useDay : 0;

        let qty = 0;
        // if (freq.cycleUnit === "天") {
        if (freq.frequencyUnit === "天") {
          times = freq.frequencyTimes;
        } else {
          times = 1;
        }

        qty = useDay * times * onceDosage;
        qty = Math.ceil(qty); //向上取整  可用天数字段
        qty = isNaN(qty) ? 0 : qty;
        this.tableRuleForm.tableData[this.currentRowIndex].qty = qty;
        //非药品 没有大包装小包装 qty 与 quantity 统一
        this.tableRuleForm.tableData[this.currentRowIndex].quantity = qty;
        this.currentRow.qty = qty;
        //非药品 没有大包装小包装 qty 与 quantity 统一
        this.currentRow.quantity = qty;
        // 计算可用天数
        this.computeAmt();
      });
    },

    // selection 选中 的 函数
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$store.dispatch("cis/setMultipleSelections", val);
    },
    handleSelect(selection, row) {
      let isChecked =
        selection.filter(item => {
          return item.id === row.id;
        }).length > 0;
      this.setBunchingSelect([row], isChecked);
    },
    // 关联医嘱时。获取所关联医嘱的频次、用药方法、用药天数
    relateAdvice() {
      let curObj = this.tableRuleForm.tableData[this.currentRowIndex];

      if (curObj.relation === "" || typeof curObj.relation === "undefined") {
        this.relateAdviceDisabled = false;
        return false;
      }

      let tableData = this.tableRuleForm.tableData;
      let val = null;
      tableData.forEach(item => {
        if (
          curObj.recipeCode == item.recipeCode &&
          item.no == curObj.relation
        ) {
          val = item;
        }
      });
      if (val === curObj || val === null || curObj.relation <= 0) {
        this.$message.warning("关联医嘱序号有误，请核对后再填写！");
        curObj.relation = undefined;
        this.$set(this.tableRuleForm.tableData, this.currentRowIndex, curObj);
        this.relateAdviceDisabled = false;
        return false;
      }

      if (val !== null) {
        curObj = {
          ...curObj,
          frequencyCode: val.frequencyCode,
          frequencyTimes: val.frequencyTimes,
          frequencyUnit: val.frequencyUnit,
          useWay: val.useWay,
          useDay: val.useDay
        };
        this.$set(this.tableRuleForm.tableData, this.currentRowIndex, curObj);
        this.relateAdviceDisabled = true;
        this.handleQty(val.useDay + "");
      } else {
        this.$message.warning("关联的医嘱序号不存在！");
      }
    },

    //获取勾选中的 已成组 项
    setBunchingSelect(list, flag) {
      let me = this;
      list.forEach(item => {
        me.groupNoList.forEach(row => {
          if (row.key === item.groupNo) {
            row.value.forEach(tableRow => {
              setTimeout(() => {
                //修复 selection 只有一个的问题
                me.$refs.multipleTable.toggleRowSelection(tableRow, flag);
              }, 0);
            });
          }
        });
      });
    },
    //处方合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.RpRowArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },

    //处理成组样式
    cellStyle(row, column, rowIndex, columnIndex) {
      return "cell-style";
    },

    //新增处方
    async addRp() {
      //后端返回处方号
      let rpNo = "";
      let visitCode =
        typeof this.receivePatientData["visitCode"] !== "undefined"
          ? this.receivePatientData["visitCode"]
          : ""; //获取患者就诊ID
      if (visitCode === "") {
        this.$message.warning("请选择患者！");
        return false;
      }

      // 是否有诊断校验
      let rep = await getDiaByClinicType({ visitCode: visitCode });
      if (rep.code === 1 && rep.data.length === 0) {
        this.$message.warning("当前患者还没有诊断，请开诊断之后才能开处方！");
        return false;
      }

      let reponse = await getRecipeCode({ visitCode: visitCode });
      if (reponse.code === 1) {
        rpNo = reponse.data;
        let addRowEmpty = {};
        this.tableColumn.forEach(item => {
          addRowEmpty[item.prop] = "";
        });
        addRowEmpty["recipeCode"] = rpNo; // 初始化数据
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

        //焦点定位到医嘱名称
        setTimeout(() => {
          let nodeList = getDataIdDom(
            "div",
            "data-id",
            "inputTable" + addRowEmpty["row_id"]
          );
          if (nodeList.length > 0) {
            nodeList[1].getElementsByClassName("el-input__inner")[0].focus();
          }
        }, 10);
      } else {
        this.$message.error(rep.msg || " 获取处方号失败！");
      }
    },
    //行点击
    rowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row, true);
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
      // let flag = false;
      // this.multipleSelection.forEach(item => {
      //   if (
      //     typeof item.chargeStatus !== "undefined" &&
      //     item.chargeStatus !== "" &&
      //     item.chargeStatus === "1"
      //   ) {
      //     flag = true;
      //   }
      // });
      // if (flag) {
      //   this.$message.warning("已收费的医嘱不可删除！");
      //   return false;
      // }
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
              }
            });
            let serverList = this.multipleSelection.filter(item => {
              return item.id;
            });

            if (serverList.length > 0) {
              outpatientNonDrugRemoveOrders(serverList)
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
                      type: "info",
                      message: res.msg || "删除失败"
                    });
                  }
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: res.msg || "删除失败"
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
      if (this.multipleSelection.length > 1) {
        // 成组最少两个成员
        flag = true;
      } else {
        flag = false;
        this.$message.warning("成组最少两个医嘱");
        return false;
      }

      if (!this.isSameRp()) {
        //同一处方
        this.$message.warning("请选择同一处方元素成组");
        return false;
      }

      return flag;
    },
    //同一处方
    isSameRp() {
      let rpName = null;
      return this.multipleSelection.every((item, index) => {
        if (index === 0) {
          rpName = item.recipeCode;
        }
        return item.recipeCode === rpName;
      });
    },
    //成组 处理
    bunchingHandler() {
      if (this.bunchingValidate()) {
        // this.setBunchingSelect ();
        this.$confirm("成组药品用法和频次将保持一致，是否继续？")
          .then(_ => {
            let data = this.multipleSelection;
            bunching(data)
              .then(res => {
                if (res.code === 1) {
                  this.getList(false);
                } else {
                  this.$message.error(res.msg || " 接口返回错误");
                }
              })
              .catch(() => {
                this.$message.error("成组失败！");
              });
          })
          .catch(_ => {});
      }
    },
    //取消成组
    cancelBunching() {
      let data = this.multipleSelection;
      if (data.length > 1) {
        // 成组最少两个成员

        // 组号相同
        if (this.isSameGroup) {
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
    isSameGroup() {
      let groupNo = null;
      return this.multipleSelection.every((item, index) => {
        if (index === 0) {
          groupNo = item.groupNo;
        }
        return item.groupNo === groupNo;
      });
    },
    async printRecipe() {
      if (this.pRLoading) return;
      let orderTable = deepClone(this.multipleSelection);
      if (orderTable.length === 0) {
        this.$message.warning("请选择医嘱！");
        return;
      }
      // console.info(orderTable);
      // 暂存的医嘱不可打印
      let printStatus = false;
      orderTable.forEach(item => {
        item.drugName = item.orderItemName;
        // item.drugQuantity = item.qty + item.unitKey;
        item.drugQuantity = item.qty;

        if (item.orderStatus === "0") {
          printStatus = true;
        }
      });
      if (printStatus) {
        this.$message.warning("暂存的医嘱不能打印！");
        return;
      }

      // 单处方打印
      // let recipeData = this.handleRecipe(orderTable);
      // if (recipeData.length > 1) {
      //   this.$message.warning("请选择整处方打印！");
      //   return false;
      // }

      let data = {};
      // data.title = "门诊处方单";
      // data.patientName = this.receivePatientData.patientName;
      // data.patientAge = this.receivePatientData.patientAge;
      // data.deptName = this.receivePatientData.deptName;
      // data.visitCode = this.receivePatientData.visitCode;
      // data.detailList = orderTable;
      // onPreview(data, "门诊处方单");
      let recipeId = "";
      for (let i in orderTable) {
        if (i == 0) {
          recipeId = orderTable[i].id;
        } else {
          recipeId = recipeId + "," + orderTable[i].id;
        }
      }
      
      try {
        this.pRLoading = true;
        await this.outpatientOrderPrint(recipeId);
        this.pRLoading = false;
      } catch (error) {
        this.pRLoading = false;
      }
      // try {
      //   let res = await outpatientOrderPrint({
      //     visitCode: this.receivePatientData.visitCode,
      //     recipeId,
      //     patientId: this.receivePatientData.patientId,
      //     type: "treatAdvice"
      //   });
      //   if (res.code === 1) {
      //     let data = res.data;
      //     if (res.data.recipeCode === "" || res.data.recipeCode === undefined) {
      //       this.$delete(data, "recipeCode");
      //     }
      //     // onPreview(data, "门诊治疗单");
      //     let index = getPrinterList();
      //     let obj = {
      //       MIS_ID: "",
      //       settlemetnType: "",
      //       patientNum: "",
      //       patientGender: "",
      //       age: "",
      //       deptId: "",
      //       outpDeptName: "",
      //       doctorName: "",
      //       diagTime: "",
      //       relateAddress: "",
      //       relateNum: "",
      //       applyNum: "",
      //       chargpeople: "",
      //       visitCode: "",
      //       relateCode: "",
      //       weight: ""
      //     };
          
      //     console.log(data);
      //     index = 3; // 默认3 ，便于测试
      //     // let samples = this.$refs.rigTable.bodyWrapper.querySelectorAll(
      //     //   ".sample"
      //     // );
      //     // 处理反显字段
      //     // data.forEach((item, i) => {
      //     //   item.part3.forEach(item1 => {
      //     //     item1.sampleType = samples[i].innerText
      //     //   })
      //     // })
      //     let {htmlStr, diagnoseStr} = complier(data);
      //     obj.contentHtml = htmlStr;
      //     obj.diagnoseHtml = diagnoseStr;
      //     obj = {
      //       ...obj,
      //       ...data
      //     }
      //     let res1 = await getPrintTpl(codes.prescriptionTpl);
      //     if(res1.code != 1) return;
      //     print(index, res1.data.value, {}, obj);
      //   }
      //   this.pRLoading = false;
      // } catch (error) {
      //   this.pRLoading = false;
      // }
    },
    outpatientOrderPrint (recipeId, printDirect = false){
      return new Promise(async (resolve, reject)=>{
        try {
          let res = await outpatientOrderPrint({
            visitCode: this.receivePatientData.visitCode,
            recipeId,
            patientId: this.receivePatientData.patientId,
            type: "treatAdvice"
          });
          if (res.code === 1) {
            let data = res.data;
            if (res.data.recipeCode === "" || res.data.recipeCode === undefined) {
              this.$delete(data, "recipeCode");
            }


          let printData = { ...data };
          let { diagList, part3 } = printData;
          // 切割数组， 10个单位，返回数据格式[[1,2],[3,4]]
          let cutNo = 110;
          // let newParts3 = cutArrFunc(part3, cutNo);
          let newParts3 = cutArrFunc(part3, cutNo);

          // 药品少于 11个的 一页内打印。多于 11个的，打印多个页
          for (let index = 0; index < newParts3.length; index ++) {
            printData.part3 = newParts3[index];
            // 一个处方 打印多个页面，除最后一个页面有 以下处方空白 其他页面没有
            if (index < newParts3.length - 1 && newParts3.length > 1){// newParts3 多于 1个
              for (let j = 0; j < printData.part3.length; j++) {
                printData.part3[j]["hideKongBai"] = true;
              }
            }
            
            printData.part3[0]["PageNo"] = index;// 计算序号
            printData.part3[0]["PageSize"] = cutNo;// 计算序号
            // console.log(deepClone(printData));
            // 打印函数

            this.dataPrintFunc(deepClone(printData), true);
          }

            resolve(true);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
        }
      })
    },
    async printRecipeAll (){
      if (this.pRAllLoading) return;
      let orderTable = deepClone(this.tableRuleForm.tableData);
      // if (orderTable.length === 0) {
      //   this.$message.warning("没有可打印的医嘱");
      //   return;
      // }

      //console.log(orderTable.filter(item=>item.chargeStatus == 3));
      
      let noPrintIdList = getZanCunAndNewRow(orderTable).map(item => item.id);
      // chargeStatus 3 是全退 不需要打印
      noPrintIdList = orderTable.filter(item=>item.chargeStatus == 3).map(item => item.id).concat(noPrintIdList);


      let printRlist = orderTable.filter(item => noPrintIdList.indexOf(item.id) < 0).map (item =>  
        // if (itemzancunRecipeIdList.indexOf(item.id) < 0) {
          item.id
        );
      console.log(noPrintIdList, printRlist);

      if (printRlist.length === 0) {
        this.$message.warning("没有可打印的医嘱");
        return;
      }
      printRlist = printRlist.join(",");
      try {
        this.pRAllLoading = true;
        await this.outpatientOrderPrint(printRlist, false);
        this.pRAllLoading = false;
      } catch (error) {
        this.pRAllLoading = false;
      }
    },
    checkDupFunc(val) {
      // 判断是否添加相同医嘱
      let self = this;
      console.info(
        "====================this.tableRuleForm.tableData",
        this.tableRuleForm.tableData
      );
      console.info(val);
      // let haveDup = this.tableRuleForm.tableData.find(
      let haveDup = this.tableRuleForm.tableData.find((item, index) => {
        return item.orderItemId === val.itemId  && this.currentRowIndex != index;
      });

      // );
      return new Promise((resolve, reject) => {
        if (haveDup) {
          self
            .$confirm("已有相同医嘱, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              this.clearCurrentRow();
              this.setLInputTableFocus();
              reject(false);
            });
        } else {
          resolve(true);
        }
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
    copyOrderCallback(mult) {
      // console.log(mult);

      this.copyOrderVisible = false;
      this.getList(true);
    }
  }
};
</script>

<style scoped lang="scss">
.mainTableWrapper {
  display: flex;
  flex-direction: column;
}

.table-utils {
  padding: 8px 0;
  // height: 46px;
  /deep/ .el-button {
    & > i {
      font-size: 18px;
      vertical-align: middle;
    }

    & > span {
      margin-left: 5px;
    }
  }

  .el-button--text,
  .el-button--text:hover {
    font-size: 14px;

    font-weight: 400;
    color: rgba(46, 50, 58, 1);
  }

  /deep/ .el-button [class*="el-icon-"] + span {
    margin-left: 2px;
    /*font-size: 12px;*/
  }

  // /deep/ .el-button + .el-button {
  //   margin-left: 0;
  // }
}

.main-table {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  .demo-ruleForm {
    flex: 1;
    min-height: 0;
  }
  //table 单元格 样式
  /deep/ .cell-style > .cell {
    padding: 0px;
  }

  /deep/ .rowStyleCls {
    height: 36px;
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

  .icon {
    right: 0;
    width: 15px;
    height: 15px;
    color: #ffd2c2;
    top: 0;
    cursor: pointer;
  }
}

.ds-input {
  width: 60px;
}

.copyOrderCls /deep/ .el-dialog {
  width: 80% !important;
}

// 审方反馈提醒  el-pover 样式修正
.popper-class {
  padding: 0;
  border-radius: 2px;
  //border: 1px solid $l-color-primary;

  .hoverContent {
    display: table;
    padding: 10px;

    p {
      line-height: 20px;

      .title {
        font-size: 14px;

        font-weight: 400;
        padding: 0 10px 0 5px;
        width: 74px;
        display: inline-block;
        color: rgba(148, 157, 163, 1);
      }

      .content {
        font-size: 14px;

        font-weight: 400;
        color: rgba(46, 50, 58, 1);
      }
    }
  }
}

.margin-left-16- {
  margin-left: -16px;
}
/deep/ .filter-item {
  margin-left: 0;
}
/deep/.el-table .freeRpRow {
  color: green;
}

.disSelectShowCls {
  font-size: 0;
  vertical-align: top;
}

/deep/.chexiaoCls > i {
  //  {
    font-size: 12px !important;
  // }
}
</style>
