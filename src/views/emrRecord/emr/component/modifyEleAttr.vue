<template>
  <div class="dialog-com">
    <el-dialog
      :title="
        createDialogVisible
          ? '新建元素'
          : modifyDialogVisible
          ? '编辑元素'
          : '属性'
      "
      append-to-body
      :visible.sync="dialogVisible"
      @close="dialogClose"
      :before-close="dialogClose"
      :close-on-click-modal="false"
      width="900px"
    >
      <div style="width: 900px; padding: 15px 40px">
        <el-form ref="ruleForm" label-width="100px">
          <!--        元素类型-->
          <div>
            <el-row class="line-title">
              <div class="block"></div>
              <span class="title">元素类型</span>
              <div style="clear: both"></div>
            </el-row>
            <el-row class="row-item">
              <el-col :span="12">
                <el-form-item label="元素类型">
                  <el-select
                    v-model="addEleTypeVal"
                    clearable
                    filterable
                    placeholder="请选择"
                    @change="eleTypeChange"
                    class="input-lenght"
                    :disabled="
                      (propDialogVisible || modifyDialogVisible) &&
                      !(
                        createDialogVisible ||
                        eleDetailInfoProp.hasOwnProperty('commonAttributeDto')
                      )
                    "
                  >
                    <el-option
                      v-for="item in eleTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--基本属性-->
          <div>
            <el-row class="line-title">
              <div class="block"></div>
              <span class="title">基本属性</span>
              <div style="clear: both"></div>
            </el-row>
            <el-row class="row-item">
              <el-col :span="12">
                <el-form-item label="数据元">
                  <el-select
                    v-model="dataOrgVal"
                    filterable
                    clearable
                    remote
                    :remote-method="remoteMethod"
                    :loading="dataOrgLoading"
                    placeholder="请选择"
                    class="input-lenght"
                    :disabled="propDialogVisible"
                    @change="dataEleChange"
                  >
                    <el-option
                      v-for="item in dataOrgOptions"
                      :key="item.id"
                      :label="item.dataElementName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <i
                    class="el-icon-search"
                    @click="orgTableShow1"
                    style="
                      font-size: 25px;
                      line-height: 30px;
                      margin-left: 15px;
                    "
                    v-popover:popover
                  ></i>
                  <el-popover
                    ref="popover"
                    placement="right"
                    width="630"
                    trigger="click"
                    @show="orgTableShow"
                    v-model="popoverShow"
                    :disabled="propDialogVisible || isSearCh"
                  >
                    <el-table
                      :data="orgData"
                      v-loading="orgTableLoading"
                      height="500"
                      @row-dblclick="orgDbClick"
                    >
                      <el-table-column
                        width="150"
                        property="dataElementCode"
                        label="数据元代码"
                      ></el-table-column>
                      <el-table-column
                        width="225"
                        property="dataElementName"
                        label="数据元名称"
                      ></el-table-column>
                      <el-table-column
                        width="225"
                        property="standardName"
                        label="所属目录"
                      ></el-table-column>
                    </el-table>
                    <el-pagination
                      @size-change="handleSizeChange1"
                      @current-change="handleCurrentChange1"
                      :current-page.sync="currentPage1"
                      :page-sizes="[10, 20, 30, 40, 50, 100]"
                      :page-size="pageSize1"
                      layout="sizes, prev, pager, next, jumper"
                      :total="dataTotal1"
                    ></el-pagination>
                  </el-popover>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="元素编码">
                  <el-input
                    v-model="addEleCode"
                    class="input-lenght"
                    disabled
                    maxlength="50"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="row-item">
              <el-col :span="12">
                <el-form-item label="元素名称">
                  <el-input
                    maxlength="100"
                    v-model="addEleName"
                    class="input-lenght-min"
                    :disabled="propDialogVisible"
                  ></el-input>
                  <l-value-domain-emr
                    clearable
                    style="width: 80px"
                    code="eleNmStyle"
                    :value.sync="addEleNameStyle"
                    placeholder="请选择"
                    :disabled="propDialogVisible"
                  ></l-value-domain-emr>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="占位文本">
                  <el-input
                    maxlength="100"
                    @focus="focusValueHandle"
                    v-model="addPlaceHolderTxt"
                    class="input-lenght"
                    :disabled="propDialogVisible"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="row-item">
              <el-col :span="12">
                <el-form-item label="提示文本">
                  <el-input
                    maxlength="100"
                    @focus="focusValueHandle"
                    v-model="addPromptTxt"
                    class="input-lenght"
                    :disabled="propDialogVisible"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="默认值">
                  <el-input
                    v-model="addDefault"
                    class="input-lenght"
                    :disabled="propDialogVisible"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!--          checkbox-->
            <el-row class="row-item check-left">
              <el-col :span="4">
                <el-checkbox
                  v-model="readOnly"
                  true-label="1"
                  false-label="0"
                  :disabled="propDialogVisible"
                  >只读</el-checkbox
                >
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="secret"
                  true-label="1"
                  false-label="0"
                  :disabled="propDialogVisible"
                  >保密</el-checkbox
                >
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="canDel"
                  true-label="1"
                  false-label="0"
                  :disabled="propDialogVisible"
                  >可删除</el-checkbox
                >
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="showBorder"
                  true-label="1"
                  false-label="0"
                  :disabled="propDialogVisible"
                  >显示边框</el-checkbox
                >
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="hidden"
                  true-label="1"
                  false-label="0"
                  :disabled="propDialogVisible"
                  >隐藏</el-checkbox
                >
              </el-col>
            </el-row>
            <el-row class="row-item check-left">
              <el-col :span="4">
                <el-checkbox
                  v-model="ref"
                  true-label="1"
                  false-label="0"
                  :disabled="propDialogVisible"
                  >引用</el-checkbox
                >
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="org"
                  true-label="1"
                  false-label="0"
                  :disabled="propDialogVisible"
                  >源</el-checkbox
                >
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="canNull"
                  true-label="1"
                  false-label="0"
                  :disabled="propDialogVisible"
                  >可为空</el-checkbox
                >
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="canPrint"
                  true-label="1"
                  false-label="0"
                  :disabled="propDialogVisible"
                  >可打印</el-checkbox
                >
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="freedomEdit"
                  true-label="1"
                  false-label="0"
                  :disabled="propDialogVisible"
                  >自由编辑</el-checkbox
                >
              </el-col>
            </el-row>
          </div>
          <!--          打印设置-->
          <div v-if="addEleTypeLal !== '表格元素'">
            <el-row class="line-title">
              <div class="block"></div>
              <span class="title">打印设置</span>
              <div style="clear: both"></div>
            </el-row>
            <el-row class="row-item check-left">
              <el-col :span="4">
                <el-checkbox
                  v-model="startBorderPlaceHolder"
                  true-label="1"
                  false-label="0"
                  :disabled="propDialogVisible"
                  >起始边框是否占位</el-checkbox
                >
              </el-col>
              <el-col :span="4">
                <el-checkbox
                  v-model="endBorderPlaceHolder"
                  true-label="1"
                  false-label="0"
                  :disabled="propDialogVisible"
                  >结束边框是否占位</el-checkbox
                >
              </el-col>
            </el-row>
          </div>
          <!--            边框设置-->
          <div>
            <el-row class="line-title">
              <div class="block"></div>
              <span class="title">边框设置</span>
              <div style="clear: both"></div>
            </el-row>
            <el-row class="row-item" v-if="addEleTypeLal !== '表格元素'">
              <el-col :span="12">
                <el-form-item label="显示类型">
                  <el-radio-group
                    v-model="addBorderType"
                    :disabled="propDialogVisible"
                  >
                    <el-radio label="underline">下划线</el-radio>
                    <el-radio label="border">边框</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-show="addBorderType == 'border'">
                <el-form-item label="边框类型">
                  <l-value-domain-emr
                    clearable
                    style="width: 100px"
                    code="eleBorderType"
                    :value.sync="addBorderStyle"
                    placeholder="请选择"
                    :disabled="propDialogVisible"
                  ></l-value-domain-emr>
                  <el-checkbox
                    style="margin-left: 20px"
                    v-model="addBorderPlaceholder"
                    true-label="1"
                    false-label="0"
                    :disabled="propDialogVisible"
                    >边框是否占位</el-checkbox
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--          专有属性-->
          <div>
            <el-row class="line-title">
              <div class="block"></div>
              <span class="title">专有属性</span>
              <div style="clear: both"></div>
            </el-row>
            <div v-if="addEleTypeLal == '文本元素'">
              <el-row class="row-item">
                <el-col :span="12">
                  <el-form-item label="最小长度">
                    <el-input
                      v-model.number="minLength"
                      style="width: 130px"
                      :disabled="propDialogVisible"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="最大长度">
                    <el-input
                      v-model.number="maxLength"
                      style="width: 130px"
                      :disabled="propDialogVisible"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-if="addEleTypeLal == '日期元素'">
              <el-row class="row-item">
                <el-col :span="12">
                  <el-form-item label="时间样式">
                    <el-select
                      v-model="dateFormatVal"
                      placeholder="请选择时间样式"
                      @change="dateFormatChange"
                      style="width: 251px; margin-left: 5px"
                      :disabled="propDialogVisible"
                    >
                      <el-option
                        v-for="item in dateFormatOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-checkbox
                    v-model="pushTime"
                    true-label="1"
                    false-label="0"
                    :disabled="propDialogVisible"
                    >刷入时间</el-checkbox
                  >
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-form-item label="预览">
                  <span>{{ now }}</span>
                </el-form-item>
              </el-row>
            </div>
            <div v-if="addEleTypeLal == '有无元素'">
              <el-row class="row-item">
                <el-col :span="12">
                  <el-form-item label="阴性前缀">
                    <el-select
                      v-model="negPrefixVal"
                      :default-first-option="true"
                      placeholder="请选择"
                      style="width: 130px; margin-left: 5px"
                      :disabled="propDialogVisible"
                    >
                      <el-option
                        v-for="item in negPrefixOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="阳性前缀">
                    <el-select
                      v-model="posPrefixVal"
                      :default-first-option="true"
                      placeholder="请选择"
                      style="width: 130px; margin-left: 5px"
                      :disabled="propDialogVisible"
                    >
                      <el-option
                        v-for="item in posPrefixOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-if="addEleTypeLal == '数字元素'">
              <el-row class="row-item">
                <el-col :span="11">
                  <el-form-item label="元素单位">
                    <!-- <l-value-domain-emr
                      :disabled="propDialogVisible"
                      style="width: 251px; margin-left: 5px"
                      clearable
                      filterable
                      code="EleUnit"
                      :value.sync="eleUnitVal"
                      placeholder="请选择"
                    ></l-value-domain-emr> -->
                    <el-select
                      clearable
                      filterable
                      v-model="eleUnitVal"
                      placeholder="请选择"
                      style="width: 251px; margin-left: 5px"
                      :disabled="propDialogVisible"
                    >
                      <el-option
                        v-for="item in eleUnitOptions"
                        :key="item.speCharId"
                        :label="item.speCharContent"
                        :value="item.speCharContent"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-checkbox
                    v-model="showUnit"
                    true-label="1"
                    false-label="0"
                    :disabled="propDialogVisible"
                    >显示</el-checkbox
                  >
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-form-item label="小数位数">
                  <el-select
                    v-model="decimalNumVal"
                    placeholder="请选择"
                    style="width: 251px; margin-left: 5px"
                    :disabled="propDialogVisible"
                  >
                    <el-option
                      v-for="item in decimalNumOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-row>
              <el-row class="row-item">
                <el-col :span="24">
                  <el-form-item label="值域范围">
                    <el-input
                      v-model="rangeDown"
                      style="width: 113px; margin-left: 5px"
                      :disabled="propDialogVisible"
                    ></el-input>
                    <span>&nbsp;~&nbsp;</span>
                    <el-input
                      v-model="rangeUp"
                      style="width: 113px"
                      :disabled="propDialogVisible"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-col :span="24">
                  <el-form-item label="正常值域范围">
                    <el-input
                      v-model="normalRangeDown"
                      style="width: 113px; margin-left: 5px"
                      :disabled="propDialogVisible"
                    ></el-input>
                    <span>&nbsp;~&nbsp;</span>
                    <el-input
                      v-model="normalRangeUp"
                      style="width: 113px"
                      :disabled="propDialogVisible"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div
              v-if="
                addEleTypeLal == '单选元素' || addEleTypeLal == '单选下拉元素'
              "
            >
              <el-row class="row-item">
                <el-radio
                  v-model="valType"
                  label="0"
                  :disabled="propDialogVisible"
                  >字典值域</el-radio
                >
                <el-radio
                  v-model="valType"
                  label="1"
                  :disabled="propDialogVisible"
                  >自定义值域</el-radio
                >
                <el-button
                  class="my-btn"
                  @click="addRadioRow"
                  :disabled="propDialogVisible"
                  >添加</el-button
                >
              </el-row>
              <el-table
                class="my-table"
                :data="customValScopeTable"
                border
                height="300"
                style="margin-top: 15px"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="40"
                ></el-table-column>
                <el-table-column prop="vCode" label="值" width="80">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="customValScopeTable[scope.$index].vCode"
                      :disabled="propDialogVisible"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="vMean" label="含义" width="150">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="customValScopeTable[scope.$index].vMean"
                      :disabled="propDialogVisible"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="score" label="评分" width="80">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="customValScopeTable[scope.$index].score"
                      :disabled="propDialogVisible"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="printVal" label="打印值" width="150">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="customValScopeTable[scope.$index].printVal"
                      :disabled="propDialogVisible"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="defaultSelection"
                  label="默认值"
                  width="80"
                >
                  <template slot-scope="scope">
                    <div>
                      <el-radio
                        v-model="rdoDefault"
                        :label="scope.row.vCode"
                        :disabled="propDialogVisible"
                        @change="changeDefault('single', scope.row)"
                        @click.native="
                          clickDefault('single', scope.row, $event)
                        "
                        >&nbsp;</el-radio
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleDelete(scope.$index)"
                      :disabled="propDialogVisible"
                      icon="el-icon-delete"
                    ></el-button>
                    <el-button
                      size="mini"
                      @click="handleUp(scope.$index)"
                      :disabled="propDialogVisible"
                      icon="el-icon-arrow-up"
                    ></el-button>
                    <el-button
                      size="mini"
                      @click="handleDown(scope.$index)"
                      :disabled="propDialogVisible"
                      icon="el-icon-arrow-down"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div
              v-if="
                addEleTypeLal == '多选元素' || addEleTypeLal == '多选下拉元素'
              "
            >
              <el-row class="row-item">
                <el-radio
                  v-model="valType"
                  label="0"
                  :disabled="propDialogVisible"
                  >字典值域</el-radio
                >
                <el-radio
                  v-model="valType"
                  label="1"
                  :disabled="propDialogVisible"
                  >自定义值域</el-radio
                >
                <el-button
                  class="my-btn"
                  @click="addMultRow"
                  :disabled="propDialogVisible"
                  >添加</el-button
                >
                <el-checkbox
                  v-model="cumScore"
                  label="1"
                  :disabled="propDialogVisible"
                  true-label="1"
                  false-label="0"
                  >累加计分</el-checkbox
                >
              </el-row>
              <el-table
                class="my-table"
                :data="customValScopeTable"
                border
                height="300"
                style="margin-top: 15px"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  width="40"
                ></el-table-column>
                <el-table-column prop="vCode" label="值" width="80">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="customValScopeTable[scope.$index].vCode"
                      :disabled="propDialogVisible"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="vMean" label="含义" width="150">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="customValScopeTable[scope.$index].vMean"
                      :disabled="propDialogVisible"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="score" label="评分" width="80">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="customValScopeTable[scope.$index].score"
                      :disabled="propDialogVisible"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="printVal" label="打印值" width="150">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="customValScopeTable[scope.$index].printVal"
                      :disabled="propDialogVisible"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="defaultSelection"
                  label="默认值"
                  width="80"
                >
                  <template slot-scope="scope">
                    <el-checkbox
                      v-model="
                        customValScopeTable[scope.$index].defaultSelection
                      "
                      true-label="1"
                      false-label="0"
                      @change="changeDefault('multiple', scope.row)"
                      :disabled="propDialogVisible"
                    ></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleDelete(scope.$index)"
                      :disabled="propDialogVisible"
                      icon="el-icon-delete"
                    ></el-button>
                    <el-button
                      size="mini"
                      @click="handleUp(scope.$index)"
                      :disabled="propDialogVisible"
                      icon="el-icon-arrow-up"
                    ></el-button>
                    <el-button
                      size="mini"
                      @click="handleDown(scope.$index)"
                      :disabled="propDialogVisible"
                      icon="el-icon-arrow-down"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-if="addEleTypeLal == '签名元素'">
              <el-row class="row-item">
                <el-checkbox
                  v-model="defaultCurDoc"
                  true-label="1"
                  false-label="0"
                  >默认当前书写医师</el-checkbox
                >
              </el-row>
            </div>
            <div v-if="addEleTypeLal == '表格元素'">
              <el-row class="row-item">
                <el-col :span="20">
                  <el-form-item label="加载固定行数">
                    <el-input
                      v-model="confirmNum"
                      style="width: 130px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          class="myBtn"
          type="primary"
          @click="handleDetermine(false)"
          v-if="!propDialogVisible"
          >确定</el-button
        >
        <el-button
          class="myBtn"
          type="primary"
          @click="handleDetermine(true)"
          v-if="
            !propDialogVisible &&
            eleDetailInfoProp.hasOwnProperty('commonAttributeDto')
          "
          >保存并更新</el-button
        >
        <el-button class="myBtn" @click="handleCancel" v-if="!propDialogVisible"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPageByCondition,
  getAll,
  insertEle,
  detailQuery,
  modifyEle,
  removeEle,
  getUuid,
  getSeqNo
} from "@/api/emrRecord/emr/element";
import {
  getDataElePageByCondition,
  getDataElementValueSingleLst,
  getDataElementValueMutiLst
} from "@/api/emrRecord/emr/contrast.js";
import { getEleUnits } from "@/api/emrRecord/emr/editor";
export default {
  name: "",
  components: {},
  props: {
    createDialogVisible: {
      type: Boolean,
      default: true
    },
    modifyDialogVisible: {
      type: Boolean,
      default: false
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    propDialogVisible: {
      type: Boolean,
      default: false
    },
    eleDetailInfoProp: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {
    // eslint-disable-next-line no-extend-native
    // console.log("propDialogVisible==========",this.propDialogVisible);
    // console.log("isSearCh======",this.addEleTypeVal == "" ? true : false);
    Date.prototype.format = function(fmt) {
      var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    };

    //初始化options
    getAll({}).then(res => {
      if (res.code === 1) {
        res.data.forEach(item => {
          if (item.baseElementName == "基本元素") {
            // 不要基本元素
            return true;
          }
          let option = {
            value: item.id,
            label: item.baseElementName
          };
          this.eleTypeOptions.push(option);
        });
      } else {
        this.$message.error("查询失败!");
        return;
      }
    });
    this.$emit("updateElementList");
  },
  data() {
    return {
      cumScore: "1", //累加计分
      proprietaryAttributeVoLstOld: [],
      eleTypeOptions: [],
      //元素详细信息
      eleDetailInfo: {},
      defaultCurDoc: "0",
      dataOrgLoading: false,
      orgData: [],
      orgTableLoading: false,
      queryCondition: "",
      dataElementId: "",
      dataElementName: "",
      popoverShow: false,
      //当前页
      currentPage1: 1,
      //每页条数
      pageSize1: 20,
      //条数
      dataTotal1: 0,
      //刷入时间
      pushTime: "0",
      //当前时间
      now: "",
      //新增元素类型
      addEleTypeVal: "",
      addEleTypeLal: "",
      //新增元素数据源类型
      dataOrgVal: "",
      dataOrgOptions: [],
      //新增元素编码
      addEleCode: "",
      //新增元素名称
      addEleName: "",
      addEleNameStyle: "hidden",
      addBorderType: "",
      addBorderStyle: "",
      addBorderPlaceholder: "0",
      //新增元素占位文本
      addPlaceHolderTxt: "",
      //新增元素提示文本
      addPromptTxt: "",
      //新增元素默认值
      addDefault: "",
      //只读
      readOnly: "0",
      //保密
      secret: "0",
      //可删除
      canDel: "1",
      //显示边框
      showBorder: "0",
      //隐藏
      hidden: "0",
      //引用
      ref: "0",
      //源
      org: "0",
      //可为空
      canNull: "1",
      //可打印
      canPrint: "1",
      //起始边框占位
      startBorderPlaceHolder: "0",
      //结束边框占位
      endBorderPlaceHolder: "0",
      //自由编辑
      freedomEdit: "0",
      //最小长度(文本元素)
      minLength: "",
      //最大长度(文本元素)
      maxLength: "",
      //值域类型(字典或自定义)
      valType: "1",
      //自定义值域表
      customValScopeTable: [],
      //默认选中
      rdoDefault: "",
      //值域范围
      rangeDown: "",
      rangeUp: "",
      //正常值域范围
      normalRangeDown: "",
      normalRangeUp: "",

      //是否显示元素单位
      showUnit: false,
      // 加载固定行数
      confirmNum: "",
      //小数位数
      decimalNumVal: "",
      decimalNumOptions: [
        {
          value: "0",
          label: "0"
        },
        {
          value: "1",
          label: "1"
        },
        {
          value: "2",
          label: "2"
        },
        {
          value: "3",
          label: "3"
        },
        {
          value: "4",
          label: "4"
        }
      ],
      //阳性前缀
      posPrefixVal: "",
      posPrefixOptions: [
        {
          value: "有",
          label: "有"
        },
        {
          value: "伴有",
          label: "伴有"
        },
        {
          value: "伴",
          label: "伴"
        },
        {
          value: "是",
          label: "是"
        },
        {
          value: "存在",
          label: "存在"
        },
        {
          value: "阳性",
          label: "阳性"
        }
      ],
      //阴性前缀
      negPrefixVal: "",
      negPrefixOptions: [
        {
          value: "否",
          label: "否"
        },
        {
          value: "无",
          label: "无"
        },
        {
          value: "否认",
          label: "否认"
        },
        {
          value: "阴性",
          label: "阴性"
        }
      ],
      //时间样式
      dateFormatVal: "",
      dateFormatOptions: [
        {
          value: "yyyy-MM-dd HH:mm:ss",
          label: "yyyy-MM-dd HH:mm:ss"
        },
        {
          value: "yyyy-MM-dd",
          label: "yyyy-MM-dd"
        },
        {
          value: "yyyy年MM月dd日 HH时mm分",
          label: "yyyy年MM月dd日 HH时mm分"
        },
        {
          value: "yyyy年MM月dd日 HH时",
          label: "yyyy年MM月dd日 HH时"
        },
        {
          value: "yyyy年MM月dd日",
          label: "yyyy年MM月dd日"
        },
        {
          value: "yyyy/MM/dd",
          label: "yyyy/MM/dd"
        },
        {
          value: "MM-dd",
          label: "MM-dd"
        },
        {
          value: "MM:dd",
          label: "MM:dd"
        },
        {
          value: "MM月dd日",
          label: "MM月dd日"
        },
        {
          value: "HH时mm分",
          label: "HH时mm分"
        },
        {
          value: "HH:mm",
          label: "HH:mm"
        }
      ],
      //元素单位
      eleUnitVal: "",
      /* eleUnitOptions: [
        {
          value: "年、月、日",
          label: "年、月、日"
        },
        {
          value: "时、分、秒",
          label: "时、分、秒"
        },
        {
          value: "kg",
          label: "kg"
        },
        {
          value: "m",
          label: "m"
        },
        {
          value: "km",
          label: "km"
        },
        {
          value: "次",
          label: "次"
        },
        {
          value: "次/分",
          label: "次/分"
        },
        {
          value: "mmHg",
          label: "mmHg"
        },
        {
          value: "°C",
          label: "°C"
        },
        {
          value: "ml",
          label: "ml"
        },
        {
          value: "cm",
          label: "cm"
        },
        {
          value: "%",
          label: "%"
        }
      ], */
      eleUnitOptions: [],
      // 记录组合元素
      myContent: "",
      numAdd: 0
    };
  },
  watch: {
    eleDetailInfoProp: {
      handler(val) {
        this.eleDetailInfo = {};
        if (val.hasOwnProperty("commonAttributeDto")) {
          this.eleDetailInfo = val;
          this.handlerPropsIn();
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.setEleUnits();
  },
  computed: {
    isSearCh() {
      return this.addEleTypeVal == "" ? true : false;
    }
  },
  methods: {
    setEleUnits() {
      // 获取数字元素单位，注入编辑器
      getEleUnits({
        dnFlag: "2"
      }).then(res => {
        if (res.code == 1) {
          this.eleUnitOptions = res.data;
        }
      });
    },
    //点击单选，被选中的情况，清除选中状态
    clickDefault(type, row, e) {
      if (e.target.tagName !== "INPUT") {
        return;
      }
      if (type === "single") {
        if (this.rdoDefault === row.vCode) {
          this.rdoDefault = "";
        }
      }
    },
    changeDefault(type, row) {
      // console.log("type", type);
      // console.log("row", row.defaultSelection);
      if (type === "single") {
        // this.customValScopeTable.
      }
    },
    dialogClose() {
      this.$emit("update:dialogVisible", false);
      this.$emit("dialogClose");
    },
    //删除行
    handleDelete(index) {
      this.customValScopeTable.splice(index, 1);
    },
    //新增行(单选)
    addRadioRow() {
      // 上面一行没有内容，根据vCode 和vMean 判断
      if (this.customValScopeTable.length > 0) {
        let lastOne = this.customValScopeTable[
          this.customValScopeTable.length - 1
        ];
        if (lastOne.vCode === "" || lastOne.vMean === "") {
          this.$message.error("最后一行数据没有内容，不可添加新一行数据！");
          return;
        }
      }

      let row = {
        vCode: "",
        vMean: "",
        defaultSelection: "0",
        score: "",
        printVal: ""
      };
      this.customValScopeTable.push(row);
    },
    combinationSave(content) {
      let dataToServer = {
        commonAttributeDto: {
          checkDeletable: this.canDel,
          checkDisplay: this.showBorder,
          checkEdit: this.freedomEdit,
          checkEmpty: this.canNull,
          checkHidden: this.hidden,
          checkPrintable: this.canPrint,
          checkReadonly: this.readOnly,
          checkReference: this.ref,
          checkSecret: this.secret,
          checkSource: this.org,
          defaultValues: this.addDefault,
          endPlaceholder: this.endBorderPlaceHolder,
          placeholderText: this.addPlaceHolderTxt,
          startPlaceholder: this.startBorderPlaceHolder,
          tooltipText: this.addPromptTxt,
          nameStyle: this.addEleNameStyle,
          borderType: this.addBorderType,
          borderStyle: this.addBorderStyle,
          borderPlaceholder: this.addBorderPlaceholder
        },
        dataElementId: this.dataElementId,
        dataElementName: this.dataElementName,
        elementBaseId: this.addEleTypeVal,
        elementBaseName: this.addEleTypeLal,
        elementCode: this.addEleCode,
        elementName: this.addEleName,
        proprietaryAttributeVoLst: [],
        valueLst: []
      };
      let contentAttr = {
        proprietaryCode: "0900",
        proprietaryContent: content,
        proprietaryName: "元素内容文本或地址"
      };
      let mongoIdAttr = {
        proprietaryCode: "0901",
        proprietaryContent: "",
        proprietaryName: "元素内容对照的MongoID"
      };
      dataToServer.proprietaryAttributeVoLst.push(contentAttr);
      dataToServer.proprietaryAttributeVoLst.push(mongoIdAttr);

      insertEle(dataToServer).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "新增元素成功!",
            type: "success"
          });
          this.$emit("updateElementList");
        } else {
          this.$message.error("新增元素失败!");
          return;
        }
      });
    },
    combinationModifySave(content) {
      this.eleDetailInfo.commonAttributeDto.checkDeletable = this.canDel;
      this.eleDetailInfo.commonAttributeDto.checkDisplay = this.showBorder;
      this.eleDetailInfo.commonAttributeDto.checkEdit = this.freedomEdit;
      this.eleDetailInfo.commonAttributeDto.checkEmpty = this.canNull;
      this.eleDetailInfo.commonAttributeDto.checkHidden = this.hidden;
      this.eleDetailInfo.commonAttributeDto.checkPrintable = this.canPrint;
      this.eleDetailInfo.commonAttributeDto.checkReadonly = this.readOnly;
      this.eleDetailInfo.commonAttributeDto.checkReference = this.ref;
      this.eleDetailInfo.commonAttributeDto.checkSecret = this.secret;
      this.eleDetailInfo.commonAttributeDto.checkSource = this.org;
      this.eleDetailInfo.commonAttributeDto.defaultValues = this.addDefault;
      this.eleDetailInfo.commonAttributeDto.endPlaceholder = this.endBorderPlaceHolder;
      this.eleDetailInfo.commonAttributeDto.placeholderText = this.addPlaceHolderTxt;
      this.eleDetailInfo.commonAttributeDto.startPlaceholder = this.startBorderPlaceHolder;
      this.eleDetailInfo.commonAttributeDto.tooltipText = this.addPromptTxt;
      this.eleDetailInfo.commonAttributeDto.nameStyle = this.addEleNameStyle;
      this.eleDetailInfo.commonAttributeDto.borderType = this.addBorderType;
      this.eleDetailInfo.commonAttributeDto.borderStyle = this.addBorderStyle;
      this.eleDetailInfo.commonAttributeDto.borderPlaceholder = this.addBorderPlaceholder;
      this.eleDetailInfo.dataElementId = this.dataElementId;
      this.eleDetailInfo.dataElementName = this.dataElementName;
      this.eleDetailInfo.elementBaseId = this.addEleTypeVal;
      this.eleDetailInfo.elementBaseName = this.addEleTypeLal;
      this.eleDetailInfo.elementCode = this.addEleCode;
      this.eleDetailInfo.elementName = this.addEleName;

      this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
        if (item.proprietaryCode == "0900") {
          item.proprietaryContent = content;
        }
      });
      modifyEle(this.eleDetailInfo).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "操作成功!",
            type: "success"
          });
          this.$emit("updateElementList");
        } else {
          this.$message.error("修改失败!");
          return;
        }
      });
    },
    //新增行(多选)
    addMultRow() {
      // 上面一行没有内容，根据vCode 和vMean 判断
      if (this.customValScopeTable.length > 0) {
        let lastOne = this.customValScopeTable[
          this.customValScopeTable.length - 1
        ];
        if (lastOne.vCode === "" || lastOne.vMean === "") {
          this.$message.error("最后一行数据没有内容，不可添加新一行数据！");
          return;
        }
      }
      let row = {
        vCode: "",
        vMean: "",
        selectDefault: "0",
        score: "",
        printVal: ""
      };
      this.customValScopeTable.push(row);
    },
    //行上移
    handleUp(index) {
      if (index != 0) {
        let con = this.customValScopeTable[index - 1];
        this.customValScopeTable.splice(index - 1, 1);
        this.customValScopeTable.splice(index, 0, con);
      }
    },
    //行下移
    handleDown(index) {
      if (index != this.customValScopeTable.length - 1) {
        let con = this.customValScopeTable[index + 1];
        this.customValScopeTable.splice(index + 1, 1);
        this.customValScopeTable.splice(index, 0, con);
      }
    },
    //弹窗取消
    handleCancel() {
      this.$emit("update:dialogVisible", false);
    },
    // 传入的时候数据处理
    handlerPropsIn() {
      this.canDel = this.eleDetailInfo.commonAttributeDto.checkDeletable;
      this.showBorder = this.eleDetailInfo.commonAttributeDto.checkDisplay;
      this.freedomEdit = this.eleDetailInfo.commonAttributeDto.checkEdit;
      this.canNull = this.eleDetailInfo.commonAttributeDto.checkEmpty;
      this.hidden = this.eleDetailInfo.commonAttributeDto.checkHidden;
      this.canPrint = this.eleDetailInfo.commonAttributeDto.checkPrintable;
      this.readOnly = this.eleDetailInfo.commonAttributeDto.checkReadonly;
      this.ref = this.eleDetailInfo.commonAttributeDto.checkReference;
      this.secret = this.eleDetailInfo.commonAttributeDto.checkSecret;
      this.org = this.eleDetailInfo.commonAttributeDto.checkSource;
      this.addDefault = this.eleDetailInfo.commonAttributeDto.defaultValues;
      this.endBorderPlaceHolder = this.eleDetailInfo.commonAttributeDto.endPlaceholder;
      this.addPlaceHolderTxt = this.eleDetailInfo.commonAttributeDto.placeholderText;
      this.startBorderPlaceHolder = this.eleDetailInfo.commonAttributeDto.startPlaceholder;
      this.addPromptTxt = this.eleDetailInfo.commonAttributeDto.tooltipText;
      this.addEleTypeVal = this.eleDetailInfo.elementBaseId;
      this.addEleTypeLal = this.eleDetailInfo.elementBaseName;
      this.addEleCode = this.eleDetailInfo.elementCode;
      this.addEleName = this.eleDetailInfo.elementName;
      this.addEleNameStyle = this.eleDetailInfo.commonAttributeDto.nameStyle;
      this.addBorderType = this.eleDetailInfo.commonAttributeDto.borderType;
      this.addBorderStyle = this.eleDetailInfo.commonAttributeDto.borderStyle;
      this.addBorderPlaceholder = this.eleDetailInfo.commonAttributeDto.borderPlaceholder;
      this.dataElementId = this.eleDetailInfo.dataElementId;
      this.dataElementName = this.eleDetailInfo.dataElementName;
      switch (this.addEleTypeLal) {
        case "文本元素":
          this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
            if (item.proprietaryCode == "0100") {
              this.maxLength = item.proprietaryContent;
            }
            if (item.proprietaryCode == "0101") {
              this.minLength = item.proprietaryContent;
            }
          });
          break;
        case "数字元素":
          this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
            if (item.proprietaryCode == "0300") {
              this.eleUnitVal = item.proprietaryContent;
            }
            if (item.proprietaryCode == "0301") {
              this.showUnit = item.proprietaryContent;
            }
            if (item.proprietaryCode == "0302") {
              this.decimalNumVal = item.proprietaryContent;
            }
            if (item.proprietaryCode == "0303") {
              this.rangeDown = item.proprietaryContent;
            }
            if (item.proprietaryCode == "0304") {
              this.rangeUp = item.proprietaryContent;
            }
            if (item.proprietaryCode == "0305") {
              this.normalRangeDown = item.proprietaryContent;
            }
            if (item.proprietaryCode == "0306") {
              this.normalRangeUp = item.proprietaryContent;
            }
          });
          break;
        case "单选元素":
        case "单选下拉元素":
          this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
            if (item.proprietaryCode == "0400") {
              this.valType = item.proprietaryContent;
            }
          });
          this.customValScopeTable = this.eleDetailInfo.valueLst;
          this.customValScopeTable.forEach(item => {
            if (item.vCode == this.rdoDefault) {
              item.defaultSelection = "1";
            } else {
              item.defaultSelection = "0";
            }
          });
          break;
        case "多选元素":
        case "多选下拉元素":
          this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
            if (item.proprietaryCode == "0500") {
              this.valType = item.proprietaryContent;
            }
            if (item.proprietaryCode == "0505") {
              this.cumScore = item.proprietaryContent;
            }
          });
          this.customValScopeTable = this.eleDetailInfo.valueLst;
          break;
        case "日期元素":
          this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
            if (item.proprietaryCode == "0700") {
              this.pushTime = item.proprietaryContent;
            }
            if (item.proprietaryCode == "0701") {
              this.dateFormatVal = item.proprietaryContent;
            }
          });
          break;
        case "有无元素":
          this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
            if (item.proprietaryCode == "0800") {
              this.negPrefixVal = item.proprietaryContent;
            }
            if (item.proprietaryCode == "0801") {
              this.posPrefixVal = item.proprietaryContent;
            }
          });
          break;
        case "签名元素":
          this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
            if (item.proprietaryCode == "1101") {
              this.defaultCurDoc = item.proprietaryContent;
            }
          });
          break;
        case "表格元素":
          this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
            if (item.proprietaryCode == "1401") {
              this.confirmNum = item.proprietaryContent;
            }
          });
          break;
      }
    },
    //处理确定
    // eslint-disable-next-line complexity
    handleDetermine(flag) {
      // console.log("propDialogVisible===",this.propDialogVisible);
      // console.log("eleDetailInfoProp.hasOwnProperty('commonAttributeDto')===",this.eleDetailInfoProp.hasOwnProperty('commonAttributeDto'));
      // console.log("modifyDialogVisible===",this.modifyDialogVisible);
      // console.log("createDialogVisible===",this.createDialogVisible);

      // 护理文书 基本元素 不判断
      // console.log("this.eleDetailInfoProp===========",this.eleDetailInfoProp)
      if (
        this.eleDetailInfoProp.hasOwnProperty("commonAttributeDto") &&
        this.eleDetailInfoProp.elementBaseName &&
        this.eleDetailInfoProp.elementBaseName === "基本元素"
      ) {
      } else {
        if (this.addEleName == "" || this.addEleTypeVal == "") {
          this.$message("元素名称、元素类别必填！");
          return;
        }
      }

      if (this.maxLength && this.minLength && this.minLength > this.maxLength) {
        this.$message("最大长度必须大于最小长度！");
        return;
      }
      // this.$emit("update:dialogVisible", false);
      if (this.addEleTypeLal == "组合元素") {
        // console.log(this.myContent, "this.myContent");
        this.$emit("handleDetermineZhuhe", this.myContent);
        return;
      }
      // 字段长度 控制

      //新增弹窗
      if (this.createDialogVisible) {
        let dataToServer = {
          commonAttributeDto: {
            checkDeletable: this.canDel,
            checkDisplay: this.showBorder,
            checkEdit: this.freedomEdit,
            checkEmpty: this.canNull,
            checkHidden: this.hidden,
            checkPrintable: this.canPrint,
            checkReadonly: this.readOnly,
            checkReference: this.ref,
            checkSecret: this.secret,
            checkSource: this.org,
            defaultValues: this.addDefault,
            endPlaceholder: this.endBorderPlaceHolder,
            placeholderText: this.addPlaceHolderTxt,
            startPlaceholder: this.startBorderPlaceHolder,
            tooltipText: this.addPromptTxt,
            nameStyle: this.addEleNameStyle,
            borderType: this.addBorderType,
            borderStyle: this.addBorderStyle,
            borderPlaceholder: this.addBorderPlaceholder
          },
          dataElementId: this.dataElementId,
          dataElementName: this.dataElementName,
          elementBaseId: this.addEleTypeVal,
          elementBaseName: this.addEleTypeLal,
          elementCode: this.addEleCode,
          elementName: this.addEleName,
          proprietaryAttributeVoLst: [],
          valueLst: []
        };
        switch (this.addEleTypeLal) {
          case "文本元素": {
            let array = [
              {
                proprietaryCode: "0100",
                proprietaryContent: this.maxLength,
                proprietaryName: "最大长度"
              },
              {
                proprietaryCode: "0101",
                proprietaryContent: this.minLength,
                proprietaryName: "最小长度"
              }
            ];
            dataToServer.proprietaryAttributeVoLst = [
              ...dataToServer.proprietaryAttributeVoLst,
              ...array
            ];
            break;
          }
          case "数字元素": {
            let array = [
              {
                proprietaryCode: "0300",
                proprietaryContent: this.eleUnitVal,
                proprietaryName: "元素单位"
              },
              {
                proprietaryCode: "0301",
                proprietaryContent: this.showUnit,
                proprietaryName: "显示标记"
              },
              {
                proprietaryCode: "0302",
                proprietaryContent: this.decimalNumVal,
                proprietaryName: "小数位数"
              },
              {
                proprietaryCode: "0303",
                proprietaryContent: this.rangeDown,
                proprietaryName: "值域范围最小值"
              },
              {
                proprietaryCode: "0304",
                proprietaryContent: this.rangeUp,
                proprietaryName: "值域范围最大值"
              },
              {
                proprietaryCode: "0305",
                proprietaryContent: this.normalRangeDown,
                proprietaryName: "正常值值域范围最小值"
              },
              {
                proprietaryCode: "0306",
                proprietaryContent: this.normalRangeUp,
                proprietaryName: "正常值值域范围最大值"
              }
            ];
            dataToServer.proprietaryAttributeVoLst = [
              ...dataToServer.proprietaryAttributeVoLst,
              ...array
            ];
            break;
          }
          case "单选元素": {
            let array = [
              {
                proprietaryCode: "0400",
                proprietaryContent: this.valType,
                proprietaryName: "字典/自定义值域标记"
              },
              {
                proprietaryCode: "0401",
                proprietaryContent: "",
                proprietaryName: "转为单元框元素"
              },
              {
                proprietaryCode: "0402",
                proprietaryContent: "",
                proprietaryName: "值域ID"
              },
              {
                proprietaryCode: "0403",
                proprietaryContent: "",
                proprietaryName: "值域编码"
              },
              {
                proprietaryCode: "0404",
                proprietaryContent: "",
                proprietaryName: "值域名称"
              }
            ];
            dataToServer.proprietaryAttributeVoLst = [
              ...dataToServer.proprietaryAttributeVoLst,
              ...array
            ];
            this.customValScopeTable.forEach(item => {
              console.log("itme===", item);
              if (item.vMean != "") {
                let pair = {
                  vCode: item.vCode,
                  vMean: item.vMean,
                  defaultSelection: this.rdoDefault == item.vCode ? "1" : "0",
                  score: item.score,
                  printVal: item.printVal
                };
                dataToServer.valueLst.push(pair);
              }
            });
            break;
          }
          case "单选下拉元素": {
            let array = [
              {
                proprietaryCode: "1200",
                proprietaryContent: this.valType,
                proprietaryName: "字典/自定义值域标记"
              },
              {
                proprietaryCode: "1201",
                proprietaryContent: "",
                proprietaryName: "转为单元框元素"
              },
              {
                proprietaryCode: "1202",
                proprietaryContent: "",
                proprietaryName: "值域ID"
              },
              {
                proprietaryCode: "1203",
                proprietaryContent: "",
                proprietaryName: "值域编码"
              },
              {
                proprietaryCode: "1204",
                proprietaryContent: "",
                proprietaryName: "值域名称"
              }
            ];
            dataToServer.proprietaryAttributeVoLst = [
              ...dataToServer.proprietaryAttributeVoLst,
              ...array
            ];
            this.customValScopeTable.forEach(item => {
              if (item.vMean != "") {
                let pair = {
                  vCode: item.vCode,
                  vMean: item.vMean,
                  defaultSelection: this.rdoDefault == item.vCode ? "1" : "0",
                  score: item.score,
                  printVal: item.printVal
                };
                dataToServer.valueLst.push(pair);
              }
            });
            break;
          }
          case "多选元素": {
            let array = [
              {
                proprietaryCode: "0500",
                proprietaryContent: this.valType,
                proprietaryName: "字典/自定义值域标记"
              },
              {
                proprietaryCode: "0501",
                proprietaryContent: "",
                proprietaryName: "转为单元框元素"
              },
              {
                proprietaryCode: "0502",
                proprietaryContent: "",
                proprietaryName: "值域ID"
              },
              {
                proprietaryCode: "0503",
                proprietaryContent: "",
                proprietaryName: "值域编码"
              },
              {
                proprietaryCode: "0504",
                proprietaryContent: "",
                proprietaryName: "值域名称"
              },
              {
                proprietaryCode: "0505",
                proprietaryContent: this.cumScore,
                proprietaryName: "累加计分"
              }
            ];
            dataToServer.proprietaryAttributeVoLst = [
              ...dataToServer.proprietaryAttributeVoLst,
              ...array
            ];
            dataToServer.valueLst = this.customValScopeTable;
            break;
          }
          case "多选下拉元素": {
            let array = [
              {
                proprietaryCode: "1300",
                proprietaryContent: this.valType,
                proprietaryName: "字典/自定义值域标记"
              },
              {
                proprietaryCode: "1301",
                proprietaryContent: "",
                proprietaryName: "转为单元框元素"
              },
              {
                proprietaryCode: "1302",
                proprietaryContent: "",
                proprietaryName: "值域ID"
              },
              {
                proprietaryCode: "1303",
                proprietaryContent: "",
                proprietaryName: "值域编码"
              },
              {
                proprietaryCode: "1304",
                proprietaryContent: "",
                proprietaryName: "值域名称"
              },
              {
                proprietaryCode: "1305",
                proprietaryContent: this.cumScore,
                proprietaryName: "累加计分"
              }
            ];
            dataToServer.proprietaryAttributeVoLst = [
              ...dataToServer.proprietaryAttributeVoLst,
              ...array
            ];
            dataToServer.valueLst = this.customValScopeTable;
            break;
          }

          case "日期元素": {
            let array = [
              {
                proprietaryCode: "0701",
                proprietaryContent: this.dateFormatVal,
                proprietaryName: "时间格式"
              },
              {
                proprietaryCode: "0700",
                proprietaryContent: this.pushTime,
                proprietaryName: "刷入时间"
              }
            ];
            dataToServer.proprietaryAttributeVoLst = [
              ...dataToServer.proprietaryAttributeVoLst,
              ...array
            ];
            break;
          }
          case "有无元素": {
            let array = [
              {
                proprietaryCode: "0800",
                proprietaryContent: this.negPrefixVal,
                proprietaryName: "阴性前缀"
              },
              {
                proprietaryCode: "0801",
                proprietaryContent: this.posPrefixVal,
                proprietaryName: "阳性前缀"
              },
              {
                proprietaryCode: "0802",
                proprietaryContent: "",
                proprietaryName: "字典/自定义值域标记"
              },
              {
                proprietaryCode: "0803",
                proprietaryContent: "",
                proprietaryName: "转为单选框元素"
              },
              {
                proprietaryCode: "0804",
                proprietaryContent: "",
                proprietaryName: "转为复选框元素"
              },
              {
                proprietaryCode: "0805",
                proprietaryContent: "",
                proprietaryName: "值域ID"
              },
              {
                proprietaryCode: "0806",
                proprietaryContent: "",
                proprietaryName: "值域编码"
              },
              {
                proprietaryCode: "0807",
                proprietaryContent: "",
                proprietaryName: "值域名称"
              }
            ];
            dataToServer.proprietaryAttributeVoLst = [
              ...dataToServer.proprietaryAttributeVoLst,
              ...array
            ];
            break;
          }
          case "签名元素": {
            let signAttr = {
              proprietaryCode: "1101",
              proprietaryContent: this.defaultCurDoc,
              proprietaryName: "默认当前书写医师"
            };

            dataToServer.proprietaryAttributeVoLst.push(signAttr);
            break;
          }
          case "表格元素": {
            let signAttr = {
              proprietaryCode: "1401",
              proprietaryContent: this.confirmNum,
              proprietaryName: "加载固定行数"
            };
            dataToServer.proprietaryAttributeVoLst.push(signAttr);
            break;
          }
        }

        // console.log(dataToServer, "dataToServer");
        this.$showLoading();
        insertEle(dataToServer)
          .then(res => {
            this.$hideLoading();
            if (res.code === 1) {
              this.$message({
                message: "新增元素成功!",
                type: "success"
              });
              this.$emit("update:dialogVisible", false);
              this.$emit("updateElementList");
            } else {
              this.$message.error(res.msg || "新增元素失败!");
              return;
            }
          })
          .catch(err => {
            this.$message.error(err.msg || "新增元素失败!");
            this.$hideLoading();
          });
      } else if (this.modifyDialogVisible) {
        //编辑弹窗
        this.eleDetailInfo.commonAttributeDto.checkDeletable = this.canDel;
        this.eleDetailInfo.commonAttributeDto.checkDisplay = this.showBorder;
        this.eleDetailInfo.commonAttributeDto.checkEdit = this.freedomEdit;
        this.eleDetailInfo.commonAttributeDto.checkEmpty = this.canNull;
        this.eleDetailInfo.commonAttributeDto.checkHidden = this.hidden;
        this.eleDetailInfo.commonAttributeDto.checkPrintable = this.canPrint;
        this.eleDetailInfo.commonAttributeDto.checkReadonly = this.readOnly;
        this.eleDetailInfo.commonAttributeDto.checkReference = this.ref;
        this.eleDetailInfo.commonAttributeDto.checkSecret = this.secret;
        this.eleDetailInfo.commonAttributeDto.checkSource = this.org;
        this.eleDetailInfo.commonAttributeDto.defaultValues = this.addDefault;
        this.eleDetailInfo.commonAttributeDto.endPlaceholder = this.endBorderPlaceHolder;
        this.eleDetailInfo.commonAttributeDto.placeholderText = this.addPlaceHolderTxt;
        this.eleDetailInfo.commonAttributeDto.startPlaceholder = this.startBorderPlaceHolder;
        this.eleDetailInfo.commonAttributeDto.tooltipText = this.addPromptTxt;
        this.eleDetailInfo.commonAttributeDto.nameStyle = this.addEleNameStyle;
        this.eleDetailInfo.commonAttributeDto.borderType = this.addBorderType;
        this.eleDetailInfo.commonAttributeDto.borderStyle = this.addBorderStyle;
        this.eleDetailInfo.commonAttributeDto.borderPlaceholder = this.addBorderPlaceholder;

        this.eleDetailInfo.elementBaseId = this.addEleTypeVal;
        this.eleDetailInfo.elementBaseName = this.addEleTypeLal;
        this.eleDetailInfo.elementCode = this.addEleCode;
        this.eleDetailInfo.elementName = this.addEleName;
        this.eleDetailInfo.dataElementId = this.dataElementId;
        this.eleDetailInfo.dataElementName = this.dataElementName;

        // this.eleDetailInfo.proprietaryAttributeVoLst = [];
        // this.eleDetailInfo.valueLst = [] ;
        //
        console.log(
          "this.eleDetailInfo.proprietaryAttributeVoLst============",
          this.eleDetailInfo.proprietaryAttributeVoLst
        );
        if (this.modifyDialogVisible) {
          // 需要原数据中的 id elementId dataVersion
          let ljjf;
          switch (this.addEleTypeLal) {
            case "文本元素":
              // this.eleDetailInfo.maxLengthText = this.maxLength;
              // this.eleDetailInfo.minLengthText = this.minLength;
              this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "0100") {
                  item.proprietaryContent = this.maxLength;
                }
                if (item.proprietaryCode == "0101") {
                  item.proprietaryContent = this.minLength;
                }
              });
              break;
            case "数字元素":
              this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "0300") {
                  item.proprietaryContent = this.eleUnitVal;
                }
                if (item.proprietaryCode == "0301") {
                  item.proprietaryContent = this.showUnit;
                }
                if (item.proprietaryCode == "0302") {
                  item.proprietaryContent = this.decimalNumVal;
                }
                if (item.proprietaryCode == "0303") {
                  item.proprietaryContent = this.rangeDown;
                }
                if (item.proprietaryCode == "0304") {
                  item.proprietaryContent = this.rangeUp;
                }
                if (item.proprietaryCode == "0305") {
                  item.proprietaryContent = this.normalRangeDown;
                }
                if (item.proprietaryCode == "0306") {
                  item.proprietaryContent = this.normalRangeUp;
                }
              });
              break;
            case "单选元素":
            case "单选下拉元素":
              this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "0400") {
                  item.proprietaryContent = this.valType;
                }
              });
              this.eleDetailInfo.valueLst = [];
              this.customValScopeTable.forEach(item => {
                if (item.vMean != "") {
                  let pair = {
                    vCode: item.vCode,
                    vMean: item.vMean,
                    defaultSelection: this.rdoDefault == item.vCode ? "1" : "0",
                    score: item.score,
                    printVal: item.printVal
                  };
                  this.eleDetailInfo.valueLst.push(pair);
                }
              });
              // this.eleDetailInfo.valueLst = this.customValScopeTable;
              this.eleDetailInfo.valueLst.forEach(item => {
                if (item.vCode == this.rdoDefault) {
                  item.defaultSelection = "1";
                } else {
                  item.defaultSelection = "0";
                }
              });
              break;
            case "多选元素":
              ljjf = this.eleDetailInfo.proprietaryAttributeVoLst.find(
                item => item.proprietaryCode === "0505"
              );
              if (!ljjf) {
                this.eleDetailInfo.proprietaryAttributeVoLst.push({
                  proprietaryCode: "0505",
                  proprietaryContent: this.cumScore,
                  proprietaryName: "累加计分"
                });
              }
              this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "0500") {
                  item.proprietaryContent = this.valType;
                }
                if (item.proprietaryCode == "0505") {
                  item.proprietaryContent = this.cumScore;
                }
              });
              this.eleDetailInfo.valueLst = this.customValScopeTable;
              break;
            case "多选下拉元素":
              ljjf = this.eleDetailInfo.proprietaryAttributeVoLst.find(
                item => item.proprietaryCode === "1305"
              );
              if (!ljjf) {
                this.eleDetailInfo.proprietaryAttributeVoLst.push({
                  proprietaryCode: "1305",
                  proprietaryContent: this.cumScore,
                  proprietaryName: "累加计分"
                });
              }
              this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "1300") {
                  item.proprietaryContent = this.valType;
                }
                if (item.proprietaryCode == "1305") {
                  item.proprietaryContent = this.cumScore;
                }
              });
              this.eleDetailInfo.valueLst = this.customValScopeTable;
              break;
            case "日期元素":
              this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "0700") {
                  item.proprietaryContent = this.pushTime;
                }
                if (item.proprietaryCode == "0701") {
                  item.proprietaryContent = this.dateFormatVal;
                }
              });
              break;
            case "有无元素":
              this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "0800") {
                  item.proprietaryContent = this.negPrefixVal;
                }
                if (item.proprietaryCode == "0801") {
                  item.proprietaryContent = this.posPrefixVal;
                }
              });
              break;
            case "签名元素":
              this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "1101") {
                  item.proprietaryContent = this.defaultCurDoc;
                }
              });
              // eslint-disable-next-line no-unreachable
              break;
            case "表格元素":
              this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "1401") {
                  item.proprietaryContent = this.confirmNum;
                }
              });
              break;
          }
        } else {
          switch (this.addEleTypeLal) {
            case "文本元素":
              // this.eleDetailInfo.maxLengthText = this.maxLength;
              // this.eleDetailInfo.minLengthText = this.minLength;\
              this.eleDetailInfo.proprietaryAttributeVoLst = [
                {
                  proprietaryCode: "0100",
                  proprietaryContent: this.maxLength,
                  proprietaryName: "最大长度"
                },
                {
                  proprietaryCode: "0101",
                  proprietaryContent: this.minLength,
                  proprietaryName: "最小长度"
                }
              ];

              // this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
              //   if (item.proprietaryCode == "0100") {
              //     item.proprietaryContent = this.maxLength;
              //   }
              //   if (item.proprietaryCode == "0101") {
              //     item.proprietaryContent = this.minLength;
              //   }
              // });
              // this.eleDetailInfo.valueLst = [];
              break;
            case "数字元素":
              this.eleDetailInfo.proprietaryAttributeVoLst = [
                {
                  proprietaryCode: "0300",
                  proprietaryContent: this.eleUnitVal,
                  proprietaryName: "元素单位"
                },
                {
                  proprietaryCode: "0301",
                  proprietaryContent: this.showUnit,
                  proprietaryName: "显示标记"
                },
                {
                  proprietaryCode: "0302",
                  proprietaryContent: this.decimalNumVal,
                  proprietaryName: "小数位数"
                },
                {
                  proprietaryCode: "0303",
                  proprietaryContent: this.rangeDown,
                  proprietaryName: "值域范围最小值"
                },
                {
                  proprietaryCode: "0304",
                  proprietaryContent: this.rangeUp,
                  proprietaryName: "值域范围最大值"
                },
                {
                  proprietaryCode: "0305",
                  proprietaryContent: this.normalRangeDown,
                  proprietaryName: "正常值值域范围最小值"
                },
                {
                  proprietaryCode: "0306",
                  proprietaryContent: this.normalRangeUp,
                  proprietaryName: "正常值值域范围最大值"
                }
              ];
              // this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
              //   if (item.proprietaryCode == "0300") {
              //     item.proprietaryContent = this.eleUnitVal;
              //   }
              //   if (item.proprietaryCode == "0301") {
              //     item.proprietaryContent = this.showUnit;
              //   }
              //   if (item.proprietaryCode == "0302") {
              //     item.proprietaryContent = this.decimalNumVal;
              //   }
              //   if (item.proprietaryCode == "0303") {
              //     item.proprietaryContent = this.rangeDown;
              //   }
              //   if (item.proprietaryCode == "0304") {
              //     item.proprietaryContent = this.rangeUp;
              //   }
              //   if (item.proprietaryCode == "0305") {
              //     item.proprietaryContent = this.normalRangeDown;
              //   }
              //   if (item.proprietaryCode == "0306") {
              //     item.proprietaryContent = this.normalRangeUp;
              //   }
              // });
              // this.eleDetailInfo.valueLst = [];

              break;
            case "单选元素":
              this.eleDetailInfo.proprietaryAttributeVoLst = [
                {
                  proprietaryCode: "0400",
                  proprietaryContent: this.valType,
                  proprietaryName: "字典/自定义值域标记"
                },
                {
                  proprietaryCode: "0401",
                  proprietaryContent: "",
                  proprietaryName: "转为单元框元素"
                },
                {
                  proprietaryCode: "0402",
                  proprietaryContent: "",
                  proprietaryName: "值域ID"
                },
                {
                  proprietaryCode: "0403",
                  proprietaryContent: "",
                  proprietaryName: "值域编码"
                },
                {
                  proprietaryCode: "0404",
                  proprietaryContent: "",
                  proprietaryName: "值域名称"
                }
              ];
              // this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
              //   if (item.proprietaryCode == "0400") {
              //     item.proprietaryContent = this.valType;
              //   }
              // });
              // this.eleDetailInfo.valueLst = [];
              this.customValScopeTable.forEach(item => {
                if (item.vMean != "") {
                  let pair = {
                    vCode: item.vCode,
                    vMean: item.vMean,
                    defaultSelection: this.rdoDefault == item.vCode ? "1" : "0",
                    score: item.score,
                    printVal: item.printVal
                  };
                  this.eleDetailInfo.valueLst.push(pair);
                }
              });
              // this.eleDetailInfo.valueLst = this.customValScopeTable;
              this.eleDetailInfo.valueLst.forEach(item => {
                if (item.vCode == this.rdoDefault) {
                  item.defaultSelection = "1";
                } else {
                  item.defaultSelection = "0";
                }
              });
              break;
            case "单选下拉元素":
              this.eleDetailInfo.proprietaryAttributeVoLst = [
                {
                  proprietaryCode: "1200",
                  proprietaryContent: this.valType,
                  proprietaryName: "字典/自定义值域标记"
                },
                {
                  proprietaryCode: "1201",
                  proprietaryContent: "",
                  proprietaryName: "转为单元框元素"
                },
                {
                  proprietaryCode: "1202",
                  proprietaryContent: "",
                  proprietaryName: "值域ID"
                },
                {
                  proprietaryCode: "1203",
                  proprietaryContent: "",
                  proprietaryName: "值域编码"
                },
                {
                  proprietaryCode: "1204",
                  proprietaryContent: "",
                  proprietaryName: "值域名称"
                }
              ];
              this.customValScopeTable.forEach(item => {
                if (item.vMean != "") {
                  let pair = {
                    vCode: item.vCode,
                    vMean: item.vMean,
                    defaultSelection: this.rdoDefault == item.vCode ? "1" : "0",
                    score: item.score,
                    printVal: item.printVal
                  };
                  this.eleDetailInfo.valueLst.push(pair);
                }
              });
              break;

            case "多选元素":
              this.eleDetailInfo.proprietaryAttributeVoLst = [
                {
                  proprietaryCode: "0500",
                  proprietaryContent: this.valType,
                  proprietaryName: "字典/自定义值域标记"
                },
                {
                  proprietaryCode: "0501",
                  proprietaryContent: "",
                  proprietaryName: "转为单元框元素"
                },
                {
                  proprietaryCode: "0502",
                  proprietaryContent: "",
                  proprietaryName: "值域ID"
                },
                {
                  proprietaryCode: "0503",
                  proprietaryContent: "",
                  proprietaryName: "值域编码"
                },
                {
                  proprietaryCode: "0504",
                  proprietaryContent: "",
                  proprietaryName: "值域名称"
                },
                {
                  proprietaryCode: "0505",
                  proprietaryContent: this.cumScore,
                  proprietaryName: "累加计分"
                }
              ];

              this.eleDetailInfo.valueLst = this.customValScopeTable;
              break;
            case "多选下拉元素":
              this.eleDetailInfo.proprietaryAttributeVoLst = [
                {
                  proprietaryCode: "1300",
                  proprietaryContent: this.valType,
                  proprietaryName: "字典/自定义值域标记"
                },
                {
                  proprietaryCode: "1301",
                  proprietaryContent: "",
                  proprietaryName: "转为单元框元素"
                },
                {
                  proprietaryCode: "1302",
                  proprietaryContent: "",
                  proprietaryName: "值域ID"
                },
                {
                  proprietaryCode: "1303",
                  proprietaryContent: "",
                  proprietaryName: "值域编码"
                },
                {
                  proprietaryCode: "1304",
                  proprietaryContent: "",
                  proprietaryName: "值域名称"
                }
              ];
              // this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
              //   if (item.proprietaryCode == "0500") {
              //     item.proprietaryContent = this.valType;
              //   }
              // });
              this.eleDetailInfo.valueLst = this.customValScopeTable;
              break;
            case "日期元素":
              this.eleDetailInfo.proprietaryAttributeVoLst = [
                {
                  proprietaryCode: "0701",
                  proprietaryContent: this.dateFormatVal,
                  proprietaryName: "时间格式"
                },
                {
                  proprietaryCode: "0700",
                  proprietaryContent: this.pushTime,
                  proprietaryName: "刷入时间"
                }
              ];
              // this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
              //   if (item.proprietaryCode == "0700") {
              //     item.proprietaryContent = this.pushTime;
              //   }
              //   if (item.proprietaryCode == "0701") {
              //     item.proprietaryContent = this.dateFormatVal;
              //   }
              // });
              // this.eleDetailInfo.valueLst = [];

              break;
            case "有无元素":
              this.eleDetailInfo.proprietaryAttributeVoLst = [
                {
                  proprietaryCode: "0800",
                  proprietaryContent: this.negPrefixVal,
                  proprietaryName: "阴性前缀"
                },
                {
                  proprietaryCode: "0801",
                  proprietaryContent: this.posPrefixVal,
                  proprietaryName: "阳性前缀"
                },
                {
                  proprietaryCode: "0802",
                  proprietaryContent: "",
                  proprietaryName: "字典/自定义值域标记"
                },
                {
                  proprietaryCode: "0803",
                  proprietaryContent: "",
                  proprietaryName: "转为单选框元素"
                },
                {
                  proprietaryCode: "0804",
                  proprietaryContent: "",
                  proprietaryName: "转为复选框元素"
                },
                {
                  proprietaryCode: "0805",
                  proprietaryContent: "",
                  proprietaryName: "值域ID"
                },
                {
                  proprietaryCode: "0806",
                  proprietaryContent: "",
                  proprietaryName: "值域编码"
                },
                {
                  proprietaryCode: "0807",
                  proprietaryContent: "",
                  proprietaryName: "值域名称"
                }
              ];
              // this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
              //   if (item.proprietaryCode == "0800") {
              //     item.proprietaryContent = this.negPrefixVal;
              //   }
              //   if (item.proprietaryCode == "0801") {
              //     item.proprietaryContent = this.posPrefixVal;
              //   }
              // });
              // this.eleDetailInfo.valueLst = [];

              break;
            case "签名元素":
              this.eleDetailInfo.proprietaryAttributeVoLst.push({
                proprietaryCode: "1101",
                proprietaryContent: this.defaultCurDoc,
                proprietaryName: "默认当前书写医师"
              });
              // this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
              //   if (item.proprietaryCode == "1101") {
              //     item.proprietaryContent = this.defaultCurDoc;
              //   }
              // });
              // this.eleDetailInfo.valueLst = [];

              // eslint-disable-next-line no-unreachable
              break;
            case "表格元素":
              this.eleDetailInfo.proprietaryAttributeVoLst.push({
                proprietaryCode: "1401",
                proprietaryContent: this.confirmNum,
                proprietaryName: "加载固定行数"
              });

              // this.eleDetailInfo.proprietaryAttributeVoLst.forEach(item => {
              //   if (item.proprietaryCode == "1401") {
              //     item.proprietaryContent = this.confirmNum;
              //   }
              // });
              // this.eleDetailInfo.valueLst = [];

              break;
          }
        }

        // eslint-disable-next-line no-unreachable
        // console.log(
        //   this.eleDetailInfoProp,
        //   this.eleDetailInfo,
        //   "this.eleDetailInfo"
        // );
        // 是护理文书模式
        if (this.eleDetailInfoProp.hasOwnProperty("commonAttributeDto")) {
          this.$emit("updateItemData", this.eleDetailInfo);
          if (!flag) {
            return;
          }
          this.$showLoading();
          let eleDetailInfo = {
            dataElementId: this.eleDetailInfo.dataElementId,
            dataElementName: this.eleDetailInfo.dataElementName,
            elementBaseId: this.eleDetailInfo.elementBaseId,
            elementBaseName: this.eleDetailInfo.elementBaseName,
            elementName: this.eleDetailInfo.elementName,
            valueLst: this.eleDetailInfo.valueLst
          };
          let commonAttributeDto = this.eleDetailInfo.commonAttributeDto;
          this.$delete(commonAttributeDto, "id");
          this.$delete(commonAttributeDto, "elementId");
          eleDetailInfo.commonAttributeDto = commonAttributeDto;
          let list = this.eleDetailInfo.proprietaryAttributeVoLst;
          let proprietaryAttributeVoLst = [];
          for (let i in list) {
            let obj = {
              proprietaryCode: list[i]["proprietaryCode"],
              proprietaryContent: list[i]["proprietaryContent"],
              proprietaryName: list[i]["proprietaryName"]
            };
            proprietaryAttributeVoLst.push(obj);
          }
          eleDetailInfo.proprietaryAttributeVoLst = proprietaryAttributeVoLst;
          /* this.$delete(eleDetailInfo, 'id');
          this.$delete(eleDetailInfo, 'eleId');
          this.$delete(eleDetailInfo, 'dataVersion'); */
          // 创建编号
          getSeqNo()
            .then(res => {
              if (res.code === 1) {
                let addEleCode = res.data;
                eleDetailInfo.elementCode = addEleCode;
                insertEle(eleDetailInfo)
                  .then(res => {
                    this.$hideLoading();
                    if (res.code === 1) {
                      this.$message({
                        message: "新增元素成功!",
                        type: "success"
                      });
                      this.$emit("update:dialogVisible", false);
                      this.$emit("updateElementList");
                      return;
                    } else {
                      this.$message.error(res.msg || "新增元素失败!");
                      return;
                    }
                  })
                  .catch(err => {
                    this.$message.error(err.msg || "新增元素失败!");
                    this.$hideLoading();
                    return;
                  });
              } else {
                this.addEleCode = "";
                this.$message.error("接口失败!");
                return;
              }
              return;
            })
            .catch(error => {
              return;
            });
        }
        if (!this.eleDetailInfoProp.hasOwnProperty("commonAttributeDto")) {
          this.$showLoading();
          modifyEle(this.eleDetailInfo)
            .then(res => {
              this.$hideLoading();
              if (res.code === 1) {
                this.$message({
                  message: "操作成功!",
                  type: "success"
                });
                this.$emit("update:dialogVisible", false);
                this.$emit("updateElementList");
              } else {
                this.$message.error(res.msg || "修改失败!");
                return;
              }
            })
            .catch(err => {
              this.$message.error(err.msg || "修改失败!");
              this.$hideLoading();
            });
        }
      }
    },
    eleTypeChange() {
      this.eleTypeOptions.find(item => {
        if (item.value == this.addEleTypeVal) {
          this.addEleTypeLal = item.label;
        }
      });
      console.log(
        "this.eleDetailInfoProp.hasOwnProperty('commonAttributeDto')==========",
        this.eleDetailInfoProp.hasOwnProperty("commonAttributeDto")
      );
      let arr = ["多选元素", "多选下拉元素", "单选元素", "单选下拉元素"];
      let customValScopeTable = [];
      if (
        this.customValScopeTable.length &&
        arr.indexOf(this.addEleTypeLal) > -1
      ) {
        customValScopeTable = this.customValScopeTable;
      }
      if (this.eleDetailInfoProp.hasOwnProperty("commonAttributeDto")) {
        this.clearAddDataExceptNameId();
      } else {
        this.clearAddData();
      }
      this.customValScopeTable = customValScopeTable;
    },
    //（单选元素、多选元素、单选下拉元素、多选下拉元素）切换的时候，下拉框值同步切换
    asycModify(req) {
      this.clearAddData();
      // eslint-disable-next-line complexity
      return detailQuery(req).then(res => {
        if (res.code === 1) {
          this.eleDetailInfo = res.data;
          //填充
          this.addEleTypeVal = res.data.elementBaseId;
          this.addEleTypeLal = res.data.elementBaseName;
          this.dataOrgVal = res.data.dataElementName;
          this.dataElementId = res.data.dataElementId;
          this.dataElementName = res.data.dataElementName;
          this.addEleCode = res.data.elementCode;
          this.addEleName = res.data.elementName;
          this.addEleNameStyle = res.data.commonAttributeDto.nameStyle;
          this.addBorderType = res.data.commonAttributeDto.borderType;
          this.addBorderStyle = res.data.commonAttributeDto.borderStyle;
          this.addBorderPlaceholder =
            res.data.commonAttributeDto.borderPlaceholder;
          this.addPlaceHolderTxt = res.data.commonAttributeDto.placeholderText;
          this.addPromptTxt = res.data.commonAttributeDto.tooltipText;
          this.addDefault = res.data.commonAttributeDto.defaultValues;
          this.readOnly = res.data.commonAttributeDto.checkReadonly;
          this.secret = res.data.commonAttributeDto.checkSecret;
          this.canDel = res.data.commonAttributeDto.checkDeletable;
          this.showBorder = res.data.commonAttributeDto.checkDisplay;
          this.hidden = res.data.commonAttributeDto.checkHidden;
          this.ref = res.data.commonAttributeDto.checkReference;
          this.org = res.data.commonAttributeDto.checkSource;
          this.canNull = res.data.commonAttributeDto.checkEmpty;
          this.canPrint = res.data.commonAttributeDto.checkPrintable;
          this.startBorderPlaceHolder =
            res.data.commonAttributeDto.startPlaceholder;
          this.endBorderPlaceHolder =
            res.data.commonAttributeDto.endPlaceholder;
          this.freedomEdit = res.data.commonAttributeDto.checkEdit;

          this.proprietaryAttributeVoLstOld =
            res.data.proprietaryAttributeVoLst;
          switch (this.addEleTypeLal) {
            case "文本元素":
              res.data.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "0100") {
                  this.maxLength = item.proprietaryContent;
                }
                if (item.proprietaryCode == "0101") {
                  this.minLength = item.proprietaryContent;
                }
              });
              break;
            case "数字元素":
              res.data.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "0300") {
                  this.eleUnitVal = item.proprietaryContent;
                }
                if (item.proprietaryCode == "0301") {
                  this.showUnit = item.proprietaryContent;
                }
                if (item.proprietaryCode == "0302") {
                  this.decimalNumVal = item.proprietaryContent;
                }
                if (item.proprietaryCode == "0303") {
                  this.rangeDown = item.proprietaryContent;
                }
                if (item.proprietaryCode == "0304") {
                  this.rangeUp = item.proprietaryContent;
                }
                if (item.proprietaryCode == "0305") {
                  this.normalRangeDown = item.proprietaryContent;
                }
                if (item.proprietaryCode == "0306") {
                  this.normalRangeUp = item.proprietaryContent;
                }
              });
              break;
            case "单选元素":
              res.data.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "0400") {
                  this.valType = item.proprietaryContent;
                }
              });
              this.customValScopeTable = res.data.valueLst;
              res.data.valueLst.forEach(item => {
                if (item.defaultSelection == "1") {
                  this.rdoDefault = item.vCode;
                }
              });
              break;
            case "单选下拉元素":
              res.data.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "1200") {
                  this.valType = item.proprietaryContent;
                }
              });
              this.customValScopeTable = res.data.valueLst;
              res.data.valueLst.forEach(item => {
                if (item.defaultSelection == "1") {
                  this.rdoDefault = item.vCode;
                }
              });
              break;
            case "多选元素":
              res.data.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "0500") {
                  this.valType = item.proprietaryContent;
                }
                if (item.proprietaryCode == "0505") {
                  this.cumScore = item.proprietaryContent;
                }
              });
              this.customValScopeTable = res.data.valueLst;
              break;
            case "多选下拉元素":
              res.data.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "1300") {
                  this.valType = item.proprietaryContent;
                }
                if (item.proprietaryCode == "1305") {
                  this.cumScore = item.proprietaryContent;
                }
              });
              this.customValScopeTable = res.data.valueLst;
              break;
            case "日期元素":
              res.data.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "0700") {
                  this.pushTime = item.proprietaryContent;
                }
                if (item.proprietaryCode == "0701") {
                  this.dateFormatVal = item.proprietaryContent;
                }
              });
              break;
            case "有无元素":
              res.data.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "0800") {
                  this.negPrefixVal = item.proprietaryContent;
                }
                if (item.proprietaryCode == "0801") {
                  this.posPrefixVal = item.proprietaryContent;
                }
              });
              break;
            case "组合元素":
              res.data.proprietaryAttributeVoLst.forEach(item => {
                // 0900为组合元素内容
                if (item.proprietaryCode == "0900") {
                  this.myContent = item.proprietaryContent;
                }
              });
              break;
            case "签名元素":
              res.data.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "1101") {
                  this.defaultCurDoc = item.proprietaryContent;
                }
              });
              break;
            case "表格元素":
              res.data.proprietaryAttributeVoLst.forEach(item => {
                if (item.proprietaryCode == "1401") {
                  this.confirmNum = item.proprietaryContent;
                }
              });
              break;
          }
          this.$emit("update:dialogVisible", true);

          return true;
        } else {
          this.$message.error("获取详细信息失败!");
          return false;
        }
      });
    },
    asycCreate() {
      this.addEleTypeVal = "";
      this.addEleTypeLal = "";
      this.clearAddData();
      // 创建编号
      return getSeqNo()
        .then(res => {
          if (res.code === 1) {
            this.addEleCode = res.data;
          } else {
            this.addEleCode = "";
            this.$message.error("接口失败!");
            return false;
          }
          return true;
        })
        .catch(error => {
          this.addEleCode = "";
          return false;
        });
    },
    //时间样式改变
    dateFormatChange() {
      let date = new Date();
      this.now = date.format(this.dateFormatVal);
    },
    clearAddData() {
      this.cumScore = "";
      this.queryCondition = "";
      //清空
      this.dataOrgVal = "";
      this.dataOrgOptions = [];
      this.dataElementName = "";
      this.dataElementId = "";
      // this.addEleCode = ''
      this.addEleName = "";
      this.addEleNameStyle = "hidden";
      this.addBorderType = "";
      this.addBorderStyle = "";
      this.addBorderPlaceholder = "0";
      this.addPlaceHolderTxt = "";
      this.addPromptTxt = "";
      this.addDefault = "";
      this.readOnly = "0";
      this.secret = "0";
      this.canDel = "1";
      this.showBorder = "0";
      this.hidden = "0";
      this.ref = "0";
      this.org = "0";
      this.canNull = "1";
      this.canPrint = "1";
      this.startBorderPlaceHolder = "0";
      this.endBorderPlaceHolder = "0";
      this.freedomEdit = "0";
      //文本元素
      this.minLength = "";
      this.maxLength = "";
      //数字元素
      this.eleUnitVal = "";
      this.showUnit = "0";
      this.decimalNumVal = "";
      this.rangeDown = "";
      this.rangeUp = "";
      this.normalRangeDown = "";
      this.normalRangeUp = "";
      //单选/多选元素
      this.valType = "1";
      this.rdoDefault = "";
      this.customValScopeTable = [];
      //日期元素
      this.dateFormatVal = "";
      this.pushTime = "0";
      //有无元素
      this.negPrefixVal = "";
      this.posPrefixVal = "";
      // 组合元素
      this.myContent = "";
      //签名元素
      this.defaultCurDoc = "0";
    },
    clearAddDataExceptNameId() {
      this.cumScore = "";
      this.queryCondition = "";
      //清空
      this.dataOrgVal = "";
      this.dataOrgOptions = [];
      this.dataElementName = "";
      this.dataElementId = "";
      // this.addEleCode = ''
      // form编辑器 不置空 元素名称、占位文本、提示文本、默认值被
      // this.addEleName = "";
      // this.addPlaceHolderTxt = "";
      // this.addPromptTxt = "";
      // this.addDefault = "";

      this.addEleNameStyle = "hidden";
      this.addBorderType = "";
      this.addBorderStyle = "";
      this.addBorderPlaceholder = "0";
      this.readOnly = "0";
      this.secret = "0";
      this.canDel = "1";
      this.showBorder = "0";
      this.hidden = "0";
      this.ref = "0";
      this.org = "0";
      this.canNull = "1";
      this.canPrint = "1";
      this.startBorderPlaceHolder = "0";
      this.endBorderPlaceHolder = "0";
      this.freedomEdit = "0";
      //文本元素
      this.minLength = "";
      this.maxLength = "";
      //数字元素
      this.eleUnitVal = "";
      this.showUnit = "0";
      this.decimalNumVal = "";
      this.rangeDown = "";
      this.rangeUp = "";
      this.normalRangeDown = "";
      this.normalRangeUp = "";
      //单选/多选元素
      this.valType = "1";
      this.rdoDefault = "";
      this.customValScopeTable = [];
      //日期元素
      this.dateFormatVal = "";
      this.pushTime = "0";
      //有无元素
      this.negPrefixVal = "";
      this.posPrefixVal = "";
      // 组合元素
      this.myContent = "";
      //签名元素
      this.defaultCurDoc = "0";
    },
    remoteMethod(query) {
      if (this.addEleTypeVal == "") {
        this.$message.error("请先选择元素类型！");
        return;
      }
      // console.log("remoteMethod==",query);
      this.queryCondition = query;
      this.dataOrgOptions = [];
      this.dataOrgLoading = true;
      let param = {
        elementBaseId: this.addEleTypeVal,
        elementName: query
      };
      getDataElePageByCondition(param)
        .then(res => {
          if (res.code === 1) {
            this.dataOrgLoading = false;
            res.data.contrastPageContentDto.forEach(item => {
              let opt = {
                valueId: item.valueId,
                dataElementName: item.dataElementName,
                storageType: item.storageType,
                id: item.id
              };
              this.dataOrgOptions.push(opt);
            });
          } else {
            this.$message.error("接口失败!");
            return false;
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    dataEleChange(val) {
      // console.log("dataEleChange============",val);
      if (val == "") {
        // console.log("dataEleChange=====null=======",val);
        this.queryCondition = "";
        this.dataOrgOptions = [];
        return;
      }

      this.dataElementId = this.dataOrgVal;
      // console.log("dataEleChange=====this.dataOrgVal=======",this.dataOrgVal);
      // console.log("dataEleChange=====this.dataOrgOptions=======",this.dataOrgOptions);

      this.dataOrgOptions.find(item => {
        if (item.id == this.dataOrgVal) {
          this.dataElementName = item.dataElementName;
          this.queryCondition = this.dataElementName;
          let data = { id: item.valueId, storageType: item.storageType };
          // console.log("dataEleChange=====我进去了=======");

          this.dateElementValueSearch(data);
        }
      });
    },
    dateElementValueSearch(data) {
      // console.log("dataEleChange=====我进去了=======",data);

      if (data.storageType === "1") {
        getDataElementValueSingleLst({ id: data.id })
          .then(res => {
            if (res.code === 1) {
              res.data.forEach(item => {
                let aaa = { ...item, defaultSelection: "0" };
                aaa.printVal = aaa.vMean;
                this.customValScopeTable.push(aaa);
              });
            } else {
              this.$message.error("接口失败!");
              return false;
            }
          })
          .catch(res => {
            this.$message.error(res.msg);
          });
      } else if (data.storageType === "2") {
        getDataElementValueMutiLst({ id: data.valueId })
          .then(res => {
            if (res.code === 1) {
              res.data.forEach(item => {
                let aaa = { ...item, selectDefault: "0" };
                aaa.printVal = aaa.vMean;
                this.customValScopeTable.push(aaa);
              });
            } else {
              this.$message.error("接口失败!");
              return false;
            }
          })
          .catch(res => {
            this.$message.error(res.msg);
          });
      }
    },
    orgTableShow1() {
      if (this.addEleTypeVal == "") {
        this.popoverShow = false;
        // this.$refs.popover.doClose();
        // this.$refs.popover.showPopper = false;
        this.$message.error("请先选择元素类型！");
        // console.log("this.$refs.popover=======",this.$refs.popover);
        return;
      }
    },
    orgTableShow() {
      this.dataEleTableQuery();
    },
    dataEleTableQuery() {
      this.orgTableLoading = true;
      let param = {
        elementBaseId: this.addEleTypeVal,
        elementName: this.queryCondition,
        pageNo: this.currentPage1,
        pageSize: this.pageSize1
      };

      getDataElePageByCondition(param)
        .then(res => {
          if (res.code === 1) {
            this.orgTableLoading = false;
            this.dataTotal1 = res.data.total;
            this.orgData = res.data.contrastPageContentDto;
          } else {
            this.$message.error("接口失败!");
            return false;
          }
        })
        .catch(res => {
          this.$message.error(res.msg);
        });
    },
    orgDbClick(row, event) {
      // console.log("row====",row);
      this.dataOrgVal = row.id;
      this.dataOrgOptions = [
        {
          valueId: row.id,
          dataElementName: row.dataElementName,
          storageType: row.storageType,
          id: row.id
        }
      ];
      this.dataElementId = row.id;
      this.dataElementName = row.dataElementName;
      this.queryCondition = row.dataElementName;
      let data = { id: row.valueId, storageType: row.storageType };
      this.dateElementValueSearch(data);
      this.popoverShow = false;
    },
    //页数变化
    handleSizeChange1(val) {
      this.pageSize1 = val;
      this.dataEleTableQuery();
    },
    //页码变化
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.dataEleTableQuery();
    },
    focusValueHandle() {
      if (this.numAdd === 0) {
        this.addPlaceHolderTxt = this.addEleName;
        //新增元素提示文本
        this.addPromptTxt = this.addEleName;
      }
      this.numAdd++;
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/ [class^="el-icon-"] {
  margin-left: -5px;
  line-height: 0px;
}

.block {
  width: 4px;
  height: 14px;
  background-color: #999999;
  float: left;
}

.title {
  float: left;
  margin-left: 3px;
  font-weight: bold;
  color: #999999;
}

.row-item {
  margin-top: 5px;
}

.line-title {
  margin-top: 10px;
}

.input-lenght {
  width: 268px;
  margin-left: 5px;
}
//input-lenght 减去 85
.input-lenght-min {
  width: 183px;
  margin-left: 5px;
}

.check-left {
  padding-left: 15px;
}

/deep/ .el-dialog__body {
  padding: 0px;
}

/deep/ .el-table .cell {
  text-align: center;
}

/deep/ .el-table--medium td {
  padding: 0px;
}

/deep/ .el-table .cell {
  white-space: nowrap;
}

/deep/ .el-button--mini {
  padding: 7px 12px;
}

/deep/ .el-input--medium .el-input__inner {
  height: 30px;
}

/deep/ .el-checkbox {
  line-height: 30px;
}
/deep/ .el-checkbox__label {
  color: rgba(40, 43, 44, 0.8);
}
/deep/ .el-radio__label {
  color: rgba(40, 43, 44, 0.8);
}
</style>
