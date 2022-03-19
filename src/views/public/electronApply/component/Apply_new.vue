<template>
  <!-- 病历处方 - 电子申请 -->
  <div class="applycontent width100 height100">
    <div class="apply-left">
      <el-form
        class="apply-left-top-search"
        :inline="false"
        :model="modelKeySearch"
      >
        <!-- <el-input v-model="modelKeySearch.keyWord" placeholder="请输入关键词搜索"></el-input> -->
        <l-formt-title label="关键词">
          <el-input
            v-model="filterText"
            v-if="activeName == 'first'"
            placeholder="输入关键词进行检索"
          ></el-input>
          <el-input
            v-model="filterTextKeShi"
            v-if="activeName == 'second'"
            placeholder="输入关键词进行检索"
          ></el-input>
          <el-input
            v-model="filterTextGeRen"
            v-if="activeName == 'third'"
            placeholder="输入关键词进行检索"
          ></el-input>
        </l-formt-title>
        <!-- <el-form-item>
                  <el-button type="primary">查询</el-button>
        </el-form-item>-->
      </el-form>
      <el-tabs
        class="apply-left-tabs"
        v-model="activeName"
        @tab-click="changeTabClick"
      >
        <el-tab-pane label="目录" name="first">
          <el-col
            :span="24"
            class="tree-content-overflow tree-content-overflow-ml"
          >
            <!-- :default-expanded-keys="[1, 2, 3]"
            default-expand-all-->
            <el-tree
              ref="tree"
              :data="treedata"
              class="filter-tree"
              node-key="id"
              :props="defaultProps"
              lazy
              :filter-node-method="filterNode"
              :expand-on-click-node="true"
              @check="handleCheck"
              :load="loadNode"
              show-checkbox
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <el-popover
                  v-if="data.adviceItemJson"
                  placement="right-start"
                  width="500"
                  trigger="hover"
                  @show="clickHandle(node, data)"
                  :popper-class="'popperClass popperClass' + data.id"
                >
                  <div>项目明细：</div>
                  <div
                    v-for="(v, k) in data.adviceItemJson.chargeList"
                    :key="k"
                    style="display: flex; justify-content: space-between"
                  >
                    <span style="width: 300px">{{ v.chargeItemName }}</span>
                    <span style="width: 80px">{{ v.spec }}</span>
                    <span style="min-width: 80px"
                      >单价：{{ v.price || 0 }}</span
                    >
                    <span style="min-width: 80px" v-if="v.itemQuantity"
                      >数量：{{ v.itemQuantity }}</span
                    >
                  </div>
                  <span slot="reference" @click="labelClick(data)">{{
                    node.label
                  }}</span>
                </el-popover>
                <span v-else>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="科室模板" name="second">
          <el-col :span="24" class="tree-content-overflow">
            <el-tree
              ref="keshitree"
              :data="keshiTemList"
              class="filter-tree"
              node-key="templetDetailId"
              :props="keshiProps"
              default-expand-all
              :filter-node-method="keshifilterNode"
              :expand-on-click-node="true"
              @check="handleCheckKeShi"
              show-checkbox
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <el-popover
                  v-if="node.data.adviceItemJson"
                  placement="right-start"
                  width="400"
                  trigger="hover"
                >
                  <!-- <div>{{ node.label }}</div> -->
                  <div>项目明细：</div>
                  <div
                    v-for="(v, k) in node.data.adviceItemJson.chargeList"
                    :key="k"
                    style="display: flex; justify-content: space-between"
                  >
                    <span style="width: 300px">{{ v.chargeItemName }}</span>
                    <span style="width: 80px">{{ v.spec }}</span>
                    <span>单价：{{ v.price || 0 }}</span>
                    <span v-if="v.itemQuantity"
                      >数量：{{ v.itemQuantity }}</span
                    >
                  </div>
                  <span slot="reference">{{ node.label }}</span>
                </el-popover>
                <span v-else>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="个人模板" name="third">
          <el-col :span="24" class="tree-content-overflow">
            <el-tree
              ref="gerentree"
              :data="gerenTemList"
              class="filter-tree"
              node-key="templetDetailId"
              :props="keshiProps"
              default-expand-all
              :filter-node-method="keshifilterNode"
              :expand-on-click-node="true"
              @check="handleCheckGeRen"
              show-checkbox
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <el-popover
                  v-if="node.data.adviceItemJson"
                  placement="right-start"
                  width="400"
                  trigger="hover"
                >
                  <!-- <div>{{ node.label }}</div> -->
                  <div>项目明细：</div>
                  <div
                    v-for="(v, k) in node.data.adviceItemJson.chargeList"
                    :key="k"
                    style="display: flex; justify-content: space-between"
                  >
                    <span style="width: 300px">{{ v.chargeItemName }}</span>
                    <span style="width: 80px">{{ v.spec }}</span>
                    <span>单价：{{ v.price || 0 }}</span>
                    <span v-if="v.itemQuantity"
                      >数量：{{ v.itemQuantity }}</span
                    >
                  </div>
                  <span slot="reference">{{ node.label }}</span>
                </el-popover>
                <span v-else>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="apply-right">
      <el-tabs class="height100" v-model="yhpzName" @tab-click="yhpzClick">
        <el-tab-pane label="申请列表" name="yhgl">
          <div class="flex-column-box">
            <div class="handle-btn-box">
              <!-- <el-button class="filter-item iconfont icondayin" type="text" @click="printClick" v-hotKey="{ func: 'func_print' }">&nbsp;打印</el-button> -->
              <el-button
                class="filter-item iconfont icontijiao1"
                @click="applicationSub()"
                type="text"
                v-hotKey="{ func: 'func_submit' }"
                >&nbsp;提交申请</el-button
              >
              <el-button
                class="filter-item iconfont iconshanchu"
                @click="cancelSelect()"
                type="text"
                v-hotKey="{ func: 'func_delete' }"
                >&nbsp;删除</el-button
              >
              <el-button
                class="filter-item iconfont iconcunweimoban"
                @click="showRelList()"
                type="text"
                v-hotKey="{ func: 'func_save' }"
                >&nbsp;保存为模板</el-button
              >
            </div>
            <el-form ref="diagform" :model="diagformdata">
              <el-form-item>
                <l-formt-title label="免费申请">
                  <l-value-domain
                    code="FreeRecipeReason"
                    :value.sync="diagformdata.freeFlag"
                    clearable
                  />
                </l-formt-title>
              </el-form-item>
              <el-form-item>
                <l-formt-title label="注意事项">
                  <el-input
                    v-model="diagformdata.advicePrompt"
                    maxlength="180"
                    @input="noteInput"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-form>
            <!-- table -->
            <div class="scrollheight">
              <el-table
                ref="rigTableyApply"
                :data="selectedList"
                row-key="assayApplyId"
                border
                stripe
                height="100%"
                highlight-current-row
                @selection-change="selectCancelApply"
                @row-click="rowClick"
                v-loading="rightTableLoad"
                v-hotKey="{
                  func: ['table_row', 'table_checkbox', 'table_choose'],
                  deClass: 'el-table__row',
                  curClass: 'current-row',
                }"
              >
                <el-table-column
                  name="duoxuan"
                  type="selection"
                  :reserve-selection="true"
                  align="center"
                  width="55"
                ></el-table-column>
                <!-- <el-table-column fixed label="加急" min-width="80">
                      <template slot-scope="scope">
                        <div class="his-apply">
                          <div class="his-apply-bar" :style="{ width: scope.row.progre + '%' }">
                            <div class="his-apply-circle"></div>
                          </div>
                        </div>
                      </template>
                </el-table-column>-->

                <el-table-column label="加急" min-width="60">
                  <template slot-scope="scope">
                    <!-- <el-checkbox v-model="scope.row.isUrgent2" @click="isUrgentClick(scope.row.isUrgent)" true-label="1" false-label="0"></el-checkbox> -->
                    <!-- <el-form-item> -->
                    <el-checkbox
                      name="jiaji"
                      v-model="scope.row.isUrgent2"
                      true-label="1"
                      false-label="0"
                    ></el-checkbox>
                    <!-- </el-form-item> -->
                  </template>
                </el-table-column>
                <el-table-column
                  prop="expectExamTime"
                  label="申请日期"
                  min-width="120"
                ></el-table-column>
                <el-table-column
                  prop="itemName"
                  label="医嘱名称"
                  min-width="120"
                ></el-table-column>
                <el-table-column prop="specimen" label="标本" min-width="100">
                  <template slot-scope="scope">
                    <!-- <span :val="scope.row.specimen" code="InspectSpecimen" v-codeTransform></span> -->
                    <!-- <el-form-item
                      :prop="'tableData.'+scope.$index+'.specimen'"
                      :show-message="false"> -->
                    <l-value-domain
                      code="InspectSpecimen"
                      :value.sync="scope.row.specimen"
                      placeholder="请选择"
                    ></l-value-domain>
                    <!-- </el-form-item> -->
                  </template>
                </el-table-column>
                <el-table-column
                  prop="amt"
                  label="单价"
                  min-width="80"
                ></el-table-column>
                <el-table-column
                  prop="applyTypeName"
                  label="检验类型"
                  min-width="80"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.applyTypeName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="execDeptCode"
                  label="执行科室"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <!-- <span tableName="sys_org" :conditionMap="{
                            org_type: '_DEPT_',
                            id: scope.row.execDeptCode || defaultDeptId
                          }"
                      columns="org_nm" v-tableTransform></span> -->
                    <l-value-domain
                      :value.sync="scope.row.execDeptCode"
                      remoteUrl="/admin/wadmin/hos/dept"
                      :remoteParams="{}"
                      remoteShowKey="orgNm"
                      remoteValueKey="id"
                      placeholder="请选择科室"
                      @change="deptChange"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="AppSection"
                  label="申请科室"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.deptName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="申请医生" min-width="80">
                  <template slot-scope="scope">
                    <span>{{ scope.row.roleName }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="total">合计：{{ totalMoney }}</div>
            <div class="save-template-box" v-if="modelVisible">
              <!-- <div class="save-template-box"> -->
              <l-card-title>
                <div slot="left">保存模板</div>
                <div slot="right">
                  <i
                    class="el-icon-close cursor-pointer"
                    title="关闭"
                    @click="closeSaveTem"
                  ></i>
                </div>
              </l-card-title>
              <el-form
                :model="modeldata"
                :rules="rules"
                ref="ruleForm"
                label-width="0"
                class="demo-ruleForm"
              >
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item prop="shareLevel">
                      <l-formt-title label="模板类型" :required="true">
                        <el-select
                          class="save-template-sel"
                          v-model="modeldata.shareLevel"
                          placeholder="请选择"
                        >
                          <el-option value="1" label="科室"></el-option>
                          <el-option value="2" label="个人"></el-option>
                        </el-select>
                      </l-formt-title>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="templetRange">
                      <el-radio v-model="modeldata.templetRange" label="1"
                        >仅门诊</el-radio
                      >
                      <el-radio v-model="modeldata.templetRange" label="3"
                        >仅住院</el-radio
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item prop="templetName">
                      <l-formt-title label="名称" :required="true">
                        <el-input
                          v-model="modeldata.templetName"
                          placeholder="请输入内容"
                        ></el-input>
                      </l-formt-title>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <div class="overflow-point">
                        <span class="allergy-form-title">已选</span>
                        <span>{{ checkTxt }}</span>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-form-item prop="remark">
                    <l-formt-title label="备注">
                      <el-input
                        v-model="modeldata.remark"
                        maxlength="100"
                        show-word-limit
                        placeholder="请输入内容"
                      ></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-row>
              </el-form>
              <div class="allergy-form-btn">
                <el-button
                  type="primary"
                  @click="conserve"
                  v-hotKey="{ func: 'func_save', flag: 'saveTemLoad' }"
                  v-loading="saveTemLoad"
                  >保存</el-button
                >
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史申请" name="pzgl">
          <!-- 右侧搜索条件 -->
          <div class="flex-column-box">
            <div class="apply-right-search">
              <div class="right-search-left">
                <el-date-picker
                  style="width: 220px"
                  v-model="history.timepicker"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  clearable
                ></el-date-picker>
                <el-select style="width: 130px" v-model="history.status">
                  <el-option
                    v-for="item in history.statusList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-button
                  @click="getHistoryApplyList()"
                  type="primary"
                  size="small"
                  >查询</el-button
                >
              </div>
              <div class="right-search-right">
                <el-checkbox
                  v-model="history.deptId"
                  @change="getHistoryApplyList"
                  >仅看本科室</el-checkbox
                >
                <el-checkbox
                  v-model="history.myself"
                  @change="getHistoryApplyList"
                  >仅看我的申请</el-checkbox
                >
              </div>
            </div>
            <div class="handle-btn-box">
              <el-button
                class="filter-item iconfont iconzuofei"
                @click="backout()"
                type="text"
                >&nbsp;作废</el-button
              >
              <el-button
                class="filter-item iconfont icondayin"
                type="text"
                @click="printClick"
                v-hotKey="{ func: 'func_print' }"
                >&nbsp;打印</el-button
              >
              <!-- 补打申请单 -->
            </div>
            <!-- table -->
            <div class="scrollheight">
              <el-table
                ref="rigTable"
                :data="historyApplyList"
                row-key="assayApplyId"
                border
                stripe
                height="100%"
                highlight-current-row
                @selection-change="selectHistoryApply"
                @row-click="rowClick1"
                v-loading="rightTableLoad"
                :row-class-name="rowStyleCls"
                v-hotKey="{
                  func: ['table_row', 'table_checkbox', 'table_choose'],
                  deClass: 'el-table__row',
                  curClass: 'current-row',
                }"
              >
                <el-table-column
                  type="selection"
                  :reserve-selection="true"
                  align="center"
                  width="55"
                ></el-table-column>
                <!-- <el-table-column fixed label="进度" min-width="80">
                    <template slot-scope="scope">
                      <div class="his-apply">
                        <div class="his-apply-bar" :style="{ width: scope.row.progre + '%' }">
                          <div class="his-apply-circle"></div>
                        </div>
                      </div>
                    </template>
                </el-table-column>-->
                <el-table-column
                  prop="applyCode"
                  label="申请单号"
                  min-width="120"
                ></el-table-column>
                <el-table-column
                  prop="createTime"
                  label="申请日期"
                  min-width="120"
                ></el-table-column>
                <el-table-column
                  prop="itemName"
                  label="医嘱名称"
                  min-width="120"
                ></el-table-column>
                <el-table-column
                  prop="sampleTypeCode"
                  label="标本"
                  min-width="100"
                >
                  <template slot-scope="scope">
                    <span
                      :val="scope.row.sampleTypeCode"
                      code="InspectSpecimen"
                      v-codeTransform
                    ></span>
                  </template>
                </el-table-column>
                <el-table-column prop="isUrgent" label="加急" min-width="60">
                  <template slot-scope="scope">
                    <!-- <span v-if="scope.row.isUrgent" style="height:100%;weight:100%;background-color: red;">京</span> -->
                    <el-tag
                      v-if="scope.row.isUrgent"
                      type="danger"
                      disable-transitions
                      size="medium"
                      >加急</el-tag
                    >
                    <span v-else></span>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="申请状态" min-width="120">
                  <template slot-scope="scope">
                    <span class="state-color">
                      <!-- <span v-if="scope.row.status">{{
                        history.stageInvert[scope.row.status]
                      }}</span>
                      <span v-else>全部</span> -->
                      <applStatusShow
                        aType="检验"
                        :patientObj="receivePatientData"
                        :aStatus="scope.row.status"></applStatusShow>
                    </span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="remarks" label="备注" min-width="120" show-overflow-tooltip></el-table-column> -->
                <!-- <el-table-column prop="sampleTypeCode" label="标本" min-width="80" code="InspectSpecimen" v-codeTransform></el-table-column> -->

                <el-table-column
                  prop="coststatus"
                  label="费用状态"
                  min-width="80"
                >
                  <template slot-scope="scope">
                    <!-- <span class="state-color">
                      {{
                      rightdata.chargeStatusTrans[scope.row.chargeStatus]
                      }}
                    </span> -->
                    <span
                      :val="scope.row.chargeStatus || ''"
                      code="ChargeStatus"
                      v-codeTransform
                    ></span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="execDeptName"
                  label="执行科室"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.execDeptName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="AppSection"
                  label="申请科室"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.deptName }}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="deptName" label="申请科室" min-width="120">
                    <template slot-scope="scope">
                      <span
                        tableName="sys_org"
                        :conditionMap="{
                          org_type: '_DEPT_',
                          id: scope.row.deptName
                        }"
                        columns="org_nm"
                        v-tableTransform
                      ></span>
                    </template>
                </el-table-column>-->
                <el-table-column
                  prop="createName"
                  label="申请医生"
                  min-width="80"
                ></el-table-column>
                <el-table-column prop="project" label="报告" min-width="120"
                  >查看报告</el-table-column
                >
              </el-table>
            </div>
          </div>
          <!-- <el-row class="bottomtext">
                <el-col :span="24">
                  <el-steps
                    class="consultation-step"
                    :active="rightdata.active"
                    finish-status="success"
                    style="padding:20px;"
                  >
                    <el-step
                      v-for="(value, key) in rightdata.activeStepList"
                      :key="key"
                      :title="value.title"
                      icon="filter-item iconfont icon-dianziyizhujiaohu1"
                    >
                      <template slot="description">
                        <p>{{ value.data.name }}</p>
                        <p>{{ value.data.time }}</p>
                      </template>
                    </el-step>
                  </el-steps>
                </el-col>
          </el-row>-->
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {
  getHistoryApplyList,
  historyList,
  saveTemplate,
  outpatientCisTempinsert,
  getAilItems,
  checkRepeat
} from "@/api/electronApply/chargeTemplate";
import { getByTypeAndName } from "@/api/cis/toolBox/toolBox";
import {
  submitApply,
  cancelApply,
  saveApply,
  backoutApply,
  applyPrint,
  applyListPrint
} from "@/api/electronApply/inspectionApply";
import {
  getListByAdviceCategory,
  getListByAdviceCategoryDetai
} from "@/api/systemManagement/dataMaintain/adviceItem";
import saveTem from "./saveTem";
import { mapGetters } from "vuex";
import mixin from "@/mixins/electronApply.js";
import { onPreview, onPrint, onPreviewData } from "@/utils/print";
import { getUN } from "@/utils/crypto";
import { getDiaByClinicType } from "@/api/cis/visit/visit";
import {
  frequencyCodeToText,
  useWayCodeToText,
  sexCodeToText,
  getTextFromCodeFunc
} from "@/views/cis/prescriptionRecor/newPatientsManage/order/components/orderUtils.js";
import { getRoles, getRole, setRole } from "@/utils/auth";
import applStatusShow from "@/views/public/electronApply/component/applStatusShow.vue";

export default {
  data() {
    return {
      treedata: [],
      filterText: "",
      filterTextKeShi: "",
      filterTextGeRen: "",
      defaultProps: {
        children: "children",
        label: "catalogName",
        isLeaf: "leaf"
      },
      keshiTemList: [],
      gerenTemList: [],
      keshiProps: {
        children: "templetDetail",
        label: "itemName"
      },
      selectedList: [],
      totalMoney: 0,
      historyApplyList: [],
      history: {
        status: "", //搜索范围
        timepicker: [], //搜索时间
        myself: false, //是否只看自己
        deptId: false,
        statusList: [
          {
            id: "",
            name: "全部"
          },
          {
            id: "1",
            name: "已申请"
          },
          {
            id: "10",
            name: "已报告"
          },
          {
            id: "99",
            name: "已作废"
          }
        ],
        stageInvert: {
          1: "已申请",
          10: "已报告",
          99: "已作废"
        }
      },
      modeldata: {
        shareLevel: "1",
        templetRange: "1",
        templetName: "",
        // templetType: '1',
        remark: ""
      },
      // 保存模板校验
      rules: {
        templetName: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        remark: [
          {
            required: false,
            message: "请输入",
            trigger: "blur"
          }
        ]
      },

      modelKeySearch: {
        keyWord: ""
      },
      eleDataType: {
        4: {
          name: "检验申请"
        },
        1: {
          name: "检查申请"
        },
        3: {
          name: "治疗申请"
        },
        2: {
          name: "病理申请"
        }
      },
      // 保存模板弹窗默认关闭
      modelVisible: false,
      // 默认显示tabs
      activeName: "first",
      yhpzName: "yhgl",
      // 保存模板数据源
      saveType: "1",
      // 搜索
      formSearch: {
        group: "1",
        inputop: ""
      },
      //组套下拉
      groups: [
        {
          id: "1",
          label: "医嘱"
        },
        {
          id: "2",
          label: "项目"
        }
      ],
      patientParam: {},
      //选中模板id
      chacakid: "",
      //菜单导航数据源
      activeIndex: "10",
      //科室模板
      setmeal: [],
      //个人模板
      persmeal: [],
      //常用模板
      usedmeal: [],

      //检查项表格数据源
      orderTable: [],
      spanArr: [],
      //检验明细选中数据源
      checkedList: [],
      //检验申请选中记录
      applyList: [],
      printList: [],
      rowIndex: "-1",
      OrderIndexArr: [],

      //右侧表单数据源
      rightdata: {
        //右侧搜索数据源
        rightseach: {
          statechack: "0", //搜索范围
          timepicker: [], //搜索时间
          checkedstat: false //是否只看自己
        },
        stategroup: [
          {
            id: "0",
            name: "全部"
          },
          {
            id: "1",
            name: "已提交"
          },
          {
            id: "2",
            name: "已审核"
          },
          {
            id: "3",
            name: "已执行"
          },
          {
            id: "4",
            name: "退回"
          },
          {
            id: "5",
            name: "已预约"
          },
          {
            id: "6",
            name: "取消预约"
          },
          {
            id: "8",
            name: "已登记"
          },
          {
            id: "9",
            name: "已检查"
          },
          {
            id: "10",
            name: "已出报告"
          },
          {
            id: "11",
            name: "医技科室取消"
          },
          {
            id: "99",
            name: "作废"
          }
        ],
        stageInvert: {
          0: "全部",
          1: "已提交",
          2: "已审核",
          3: "已执行",
          4: "退回",
          5: "已预约",
          6: "取消预约",
          8: "已登记",
          9: "已检查",
          10: "已出报告",
          11: "医技科室取消",
          99: "作废"
        },
        chargeStatusTrans: {
          0: "未收费",
          2: "无需收费",
          1: "已收费",
          4: "部分退费",
          5: "全部退费"
        },
        //右侧表格数据源
        rightable: [],

        //步骤图数据源
        active: 0,
        activeStepList: [
          {
            title: "申请",
            data: {
              name: "",
              time: ""
            }
          },
          {
            title: "采集",
            data: {
              name: "",
              time: ""
            }
          },
          {
            title: "报告审核",
            data: {
              name: "",
              time: ""
            }
          },
          {
            title: "结束",
            data: {
              name: "",
              time: ""
            }
          }
        ],
        qsteplist: {
          docname: "", //人员
          steptime: " " //时间
        },
        caijiteplist: {
          docname: "",
          steptime: " "
        },
        jcteplist: {
          docname: "",
          steptime: " "
        },
        fbteplist: {
          docname: "",
          steptime: " "
        },

        //右侧当前选中行
        currentRow: ""
      },
      // 保存模板组件
      saveTem: saveTem,
      // 当前显示的组件
      curComponent: "",
      // 左侧table数据类型
      tableDataType: [
        {
          id: "1",
          title: "检验科"
        },
        {
          id: "2",
          title: "细菌室"
        },
        {
          id: "3",
          title: "床旁检验"
        }
      ],
      // 当前显示的类型
      activeType: "1",
      // 输入搜索防抖
      searchDebounced: null,
      leftLoading: false,
      // 提交申请loading标示
      submitLoad: false,
      // 保存模板loading
      saveTemLoad: false,
      // 历史申请表格loading
      rightTableLoad: false,
      tlm_isLoading: false,
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      // apiFunc: this.loadTable,
      temCheckedList: [],
      // 用于打印的取用的数据
      printData: [],
      diagformdata: {},
      currentLeftRow: {}, //待申请当前行
      chargeListLoading: false
    };
  },
  mixins: [mixin],
  computed: {
    // ...mapGetters("eleApply", ["eleTemType"]),
    ...mapGetters("base", ["receivePatientData"]),
    // 获取登录用户信息
    ...mapGetters("user", ["name", "role"]),
    checkTxt() {
      return this.applyList
        .map(item => {
          return item.itemName;
        })
        .join(",");
    },
    chooseData() {
      return this.$attrs.choose;
    },
    eleTypes() {
      return this.$attrs.elecType;
    },
    // 控制是否还可以继续加载
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
    //默认执行科室
    defaultDeptId() {
      return JSON.parse(getRole()).deptId;
    }
  },
  components:{
    applStatusShow
  },
  watch: {
    "selectedList.length": {
      // deep: true,
      immediate: true,
      handler(val) {
        this.$refs.rigTableyApply && this.$refs.rigTableyApply.clearSelection();
        this.selectCancelApply([]);
        if (!val) {
          this.currentLeftRow = {};
          this.diagformdata.advicePrompt = "";
        } else if (val === 1) {
          this.$refs.rigTableyApply.setCurrentRow(this.selectedList[0]);
          this.currentLeftRow = this.selectedList[0];
          this.diagformdata = {
            advicePrompt: this.selectedList[0].adviceItemJson.advicePrompt || ""
          };
        }
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    filterTextKeShi(val) {
      this.$refs.keshitree.filter(val);
    },
    filterTextGeRen(val) {
      this.$refs.gerentree.filter(val);
    },
    receivePatientData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.patientParam.patientId = val.patientId;
        this.getHistoryApplyList();
        let cType = "";
        // 这个页面只在门诊用，所以用visitCode即可
        // console.log
        // if (this.$attrs.hosType == "1") {
        cType = val.visitCode;
        // } else if (this.$attrs.hosType == "3") {
        //   cType = val.inpCode;
        // }
        this.setPatientInfo("testApply", {
          patientId: val.patientId,
          type: this.eleTypes,
          id: cType
        });
      }
    }
    // chooseData: {
    //   handler(val) {
    //     this.pageParams.pageNo = 1;
    //     this.pageParams.total = 0;

    //     this.$refs.orderTable && this.$refs.orderTable.clearSelection();
    //     this.$refs.orderTable.bodyWrapper.scrollTop = 0;
    //     if (val) {
    //       this.apiFunc = this.loadTableTem;
    //     } else {
    //       this.apiFunc = this.loadTable;
    //     }
    //     this.apiFunc(val);
    //   }
  },
  //   eleTemType(val) {
  //     if (val === 3) {
  //       this.rightdata.activeStepList = [
  //         { title: "申请", data: { name: "", time: "" } },
  //         { title: "执行", data: { name: "", time: "" } }
  //       ];
  //     } else {
  //       this.rightdata.activeStepList = this.$options.data().rightdata.activeStepList;
  //     }
  //     this.formSearch = this.$options.data().formSearch;
  //     this.apiFunc = this.loadTable;
  //     this.$refs.orderTable && this.$refs.orderTable.clearSelection();
  //     this.$refs.orderTable.bodyWrapper.scrollTop = 0;
  //     this.rightseach();
  //     this.search();
  //   }
  // },
  created() {
    // this.search();
    this.getListByAdviceCategory();
    this.loadTable();
    this.loadGeRenTable();
  },
  methods: {
    labelClick(data) {
      /* let popperClassDom = document.getElementsByClassName("popperClass");
        for(let i in popperClassDom) {
          if(popperClassDom[i].className.indexOf("popperClass" + data.id) < 0) {
            popperClassDom[i].style.cssText = "width:500px;display:none";
            popperClassDom[i].setAttribute("aria-hidden",true);
          }else {
            popperClassDom[i].setAttribute("aria-hidden",false);
          }
        } */
    },
    deptChange(val, obj) {
      this.currentLeftRow.execDeptName = obj.orgNm;
    },
    async clickHandle(node, data) {
      if (
        data.adviceItemJson.hasOwnProperty("chargeList") ||
        this.chargeListLoading
      ) {
        return;
      }
      this.chargeListLoading = true;
      let params = {
        itemIds: data.itemId
      };
      try {
        let detailsRes = await getListByAdviceCategoryDetai(params);
        if (detailsRes.code === 1 && detailsRes.data.length === 1) {
          this.$set(data.adviceItemJson, "chargeList", [
            ...detailsRes.data[0].chargeList
          ]);
        }
        this.chargeListLoading = false;
      } catch (e) {
        this.chargeListLoading = false;
      }
    },
    //zhengyawen 处理 row 的样式
    rowStyleCls(a) {
      return {
        freeRpRow: a.row.freeFlag !== "" && a.row.freeFlag !== undefined
      };
    },
    filterNode(value, data) {
      // console.log('filterNode----', value)
      if (!value) return true;
      // console.log('filterNode====', data)
      return (
        data.catalogName.indexOf(value) !== -1 ||
        (data.pcatalogName && data.pcatalogName.indexOf(value) !== -1) ||
        (data.mapName &&
          data.mapName.name_1 &&
          data.mapName.name_1.indexOf(value) !== -1) ||
        (data.mapName &&
          data.mapName.name_2 &&
          data.mapName.name_2.indexOf(value) !== -1) ||
        (data.mapName &&
          data.mapName.name_3 &&
          data.mapName.name_3.indexOf(value) !== -1)
      );
    },
    keshifilterNode(value, data) {
      console.log("filterNode----", data);
      if (!value) return true;
      return (
        data.itemName.indexOf(value) !== -1 ||
        (data.templetName && data.templetName.indexOf(value) !== -1)
      );
    },
    getListByAdviceCategory() {
      // let data1 = new Date().getTime()
      // let data2 = 0
      // console.log("this.treedata.date00000",new Date().getTime());
      // let adviceCategorys = [0,1]
      let json = {};
      json.adviceCategorys = "1"; // 0检查 1检验
      json.type = "item"; // 带上医嘱项
      json.source = "0"; // 门诊0 住院1
      console.log("json", json);
      getListByAdviceCategory(json).then(async res => {
        if (res.code === 1) {
          // this.handleTreeData(res.data)
          let resData = res.data;
          await this.forCircleDataInit(resData, 1);
          this.treedata = resData;
          console.log("this.treedata", this.treedata);
          // console.log("this.treedata.date11111",new Date().getTime());
          this.$nextTick(() => {
            let domOne = document
              .getElementsByClassName("tree-content-overflow-ml")[0]
              .getElementsByClassName("el-tree-node__content")[0];
            domOne.click();
            this.$nextTick(async () => {
              let domchildren = document
                .getElementsByClassName("tree-content-overflow-ml")[0]
                .getElementsByClassName("el-tree-node__children")[0].children;
              for (let i in domchildren) {
                try {
                  await domchildren[i].click();
                } catch (error) {}
              }
              /* this.$nextTick(async ()=>{
                  data2 = new Date().getTime()
                  console.log("this.treedata.date222222",data2 - data1);
                }) */
            });
          });
        } else {
          this.$message.error("查询失败");
        }
      });
    },
    forone(list, item, id, fn) {
      for (let i in list) {
        if (list[i].id === id) {
          fn();
        }
      }
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([]);
      }
      return resolve(node.data.children);
    },
    // 加载模板数据
    async loadTable() {
      try {
        // this.tlm_isLoading = true;
        let params = {
          type: 1, // 1科室 2个人
          itemCat: 6,
          name: "",
          pageNum: 1,
          pageSize: 200
        };
        let response = await getByTypeAndName(params);
        response.data.forEach(item => {
          item.itemName = item.templetName;
          // item.id = item.templetDetailId
        });
        if (response.pageNo === 1) {
          this.keshiTemList = response.data;

          console.log("加载科室模板数据", response.data);
        } else {
          this.keshiTemList = this.keshiTemList.concat(response.data);
        }
        // this.pageParams = { ...response.pageParams };
        // this.tlm_isLoading = false;
      } catch (error) {
        // this.tlm_isLoading = false;
        this.$message.error(error.msg);
      }
    },

    // 加载gerne模板数据
    async loadGeRenTable() {
      try {
        // this.tlm_isLoading = true;
        let params = {
          type: 2, // 1科室 2个人
          itemCat: 6,
          name: "",
          pageNum: 1,
          pageSize: 200
        };
        let response = await getByTypeAndName(params);
        response.data.forEach(item => {
          item.itemName = item.templetName;
        });
        if (response.pageNo === 1) {
          this.gerenTemList = response.data;

          console.log("加载科室模板数据", response.data);
        } else {
          this.gerenTemList = this.gerenTemList.concat(response.data);
        }
        // this.pageParams = { ...response.pageParams };
        // this.tlm_isLoading = false;
      } catch (error) {
        // this.tlm_isLoading = false;
        this.$message.error(error.msg);
      }
    },

    //获取默认当前时间
    getNowFormatDate() {
      var myDate = new Date();
      var year = myDate.getFullYear();
      var month = myDate.getMonth() + 1;
      var date = myDate.getDate();
      var h = myDate.getHours();
      var m = myDate.getMinutes();
      var s = myDate.getSeconds();
      var now =
        year +
        "-" +
        this.getMakeZero(month) +
        "-" +
        this.getMakeZero(date) +
        " " +
        this.getMakeZero(h) +
        ":" +
        this.getMakeZero(m) +
        ":" +
        this.getMakeZero(s);
      return now;
    },
    getMakeZero(s) {
      return s < 10 ? "0" + s : s;
    },
    async getDetails(res) {
      if (!res.length) {
        return;
      }
      //zhengyawen 请求详细数据
      let items = "";
      for (let i in res) {
        if (i == "0") {
          items = res[i].itemId || "";
        } else {
          items = items + "," + (res[i].itemId || "");
        }
      }
      if (items === "") {
        return;
      }
      try {
        let detailsRes = await getListByAdviceCategoryDetai({ itemIds: items });
        if (detailsRes.code === 1 && detailsRes.data.length) {
          for (let i in res) {
            if (res[i].hasOwnProperty("itemId")) {
              await this.forCircleData(this.treedata, res[i].itemId, item => {
                item = {
                  ...item,
                  adviceItemJson: {
                    ...detailsRes.data[i]
                  }
                };
                res[i] = {
                  ...res[i],
                  adviceItemJson: {
                    ...detailsRes.data[i]
                  }
                };
              });
            }
          }
        }
      } catch (error) {}
      return res;
    },
    async forCircleData(list, itemId, fn) {
      for (let i in list) {
        if (list[i].hasOwnProperty("itemId") && list[i].itemId == itemId) {
          fn(list[i]);
        } else if (
          list[i].hasOwnProperty("children") &&
          list[i].children.length
        ) {
          await this.forCircleData(list[i].children, itemId, fn);
        }
      }
    },
    async forCircleDataInit(list, level) {
      for (let i in list) {
        list[i].level = level;
        if (level <= 2) {
          list[i].leaf = false;
        } else if (level > 2) {
          if (list[i].hasOwnProperty("children") && list[i].children.length) {
            list[i].leaf = false;
          } else {
            list[i].leaf = true;
          }
        }
        if (list[i].hasOwnProperty("children") && list[i].children.length) {
          level++;
          await this.forCircleDataInit(list[i].children, level);
        }
      }
    },
    async handleCheck() {
      // this.isLableClick = false;
      console.log("role-res", this.$store.state.user);
      this.deptName = this.$store.state.user.role.deptName;
      let res = this.$refs.tree.getCheckedNodes();
      this.selectedList = [];
      let arr = [];
      res = await this.getDetails(res);
      console.log("handleCheck-res", res);
      res.forEach(item => {
        if (item.adviceItemJson) {
          // item.itemName = item.itemName
          // item.itemId = item.itemId
          // item.id = item.id
          // item.secondName = item.secondName
          // item.unit = item.unit
          item.expectExamTime = this.getNowFormatDate();
          // 单价
          // item.amt = item.adviceItemJson.amt
          if (
            item.adviceItemJson.chargeList &&
            item.adviceItemJson.chargeList.length > 0
          ) {
            let myprice = 0;
            item.adviceItemJson.chargeList.forEach(itemdata => {
              let itemAmt = itemdata.price * itemdata.itemQuantity;
              myprice = Number(itemAmt) + Number(myprice);
              // myprice =
              //   myprice * 1 + itemdata.price ||
              //   0 * 1 * itemdata.itemQuantity ||
              //   0 * 1;
            });
            item.amt = myprice;
          } else {
            item.amt = 0;
          }
          item.amt = item.amt.toFixed(4);

          console.log(
            "item.adviceItemJson.chargeList_+_+_+",
            item.adviceItemJson.chargeList
          );
          // 执行科室相关
          if (
            item.adviceItemJson.adviceExecRelateList &&
            item.adviceItemJson.adviceExecRelateList[0] &&
            item.adviceItemJson.adviceExecRelateList[0].execDeptCode
          ) {
            item.execDeptCode =
              item.adviceItemJson.adviceExecRelateList[0].execDeptCode;
          } else {
            item.execDeptCode = null;
          }

          item.isUrgent = 0;
          item.deptName = this.$store.state.user.role.deptName;
          item.deptId = this.$store.state.user.role.deptId;
          item.execDeptName = this.$store.state.user.role.deptName;
          item.execDeptCode = this.$store.state.user.role.deptId;
          item.roleName = getUN();
          item.roleId = this.$store.state.user.role.roleId;
          //检查类型
          item.applyTypeName = item.mapName.name_2
            ? item.mapName.name_2.substring(0, 4)
            : item.mapName.name_1;
          item.advicePrompt = item.adviceItemJson.advicePrompt;
          arr.push(item);
        }
      });
      this.selectedList = arr;
      console.log("handleCheck-this.data.selectedList", this.selectedList);
    },
    handleCheckKeShi() {
      console.log("role-res", this.$store.state.user);
      this.deptName = this.$store.state.user.role.deptName;
      let res = this.$refs.keshitree.getCheckedNodes();
      console.log("handleCheck-res", res);
      this.selectedList = [];
      let arr = [];
      res.forEach(item => {
        if (item.itemId) {
          item.sampleTypeCode = item.sampleTypeName;
          item.specimen = item.sampleTypeName;
          // item.itemName = item.itemName
          // item.itemId = item.itemId
          // item.id = item.id
          // 科室和个人模板，id必须唯一，目前先用templetDetailId代替
          item.id = item.templetDetailId;
          // item.unit = item.unit
          item.expectExamTime = this.getNowFormatDate();
          // 单价
          // item.amt = item.amt
          item.isUrgent = 0;
          item.deptName = this.$store.state.user.role.deptName;
          item.deptId = this.$store.state.user.role.deptId;
          item.execDeptName = this.$store.state.user.role.deptName;
          item.execDeptCode = this.$store.state.user.role.deptId;
          item.roleName = getUN();
          item.roleId = this.$store.state.user.role.roleId;
          item.advicePrompt = item.advicePrompt || "";
          //检验类型
          // item.applyTypeName = item.mapName.name_2.substring(0,4)
          arr.push(item);
        }
      });
      this.selectedList = arr;
      console.log("handleCheck-this.data.selectedList", this.selectedList);
    },
    handleCheckGeRen() {
      console.log("role-res", this.$store.state.user);
      this.deptName = this.$store.state.user.role.deptName;
      let res = this.$refs.gerentree.getCheckedNodes();
      console.log("handleCheck-res", res);
      this.selectedList = [];
      let arr = [];
      res.forEach(item => {
        if (item.itemId) {
          item.sampleTypeCode = item.sampleTypeName;
          item.specimen = item.sampleTypeName;
          // item.itemName = item.itemName
          // item.itemId = item.itemId
          // item.id = item.id
          // 科室和个人模板，id必须唯一，目前先用templetDetailId代替
          item.id = item.templetDetailId;
          // item.unit = item.unit
          item.expectExamTime = this.getNowFormatDate();
          // 单价
          // item.amt = item.amt
          item.isUrgent = 0;
          item.deptName = this.$store.state.user.role.deptName;
          item.deptId = this.$store.state.user.role.deptId;
          item.execDeptName = this.$store.state.user.role.deptName;
          item.execDeptCode = this.$store.state.user.role.deptId;
          item.roleName = getUN();
          item.roleId = this.$store.state.user.role.roleId;
          item.advicePrompt = item.advicePrompt || "";
          //检验类型
          // item.applyTypeName = item.mapName.name_2.substring(0,4)
          arr.push(item);
        }
      });
      this.selectedList = arr;
      console.log("handleCheck-this.data.selectedList", this.selectedList);
    },
    isUrgentClick(isUrgent) {
      console.log("isUrgentClick", isUrgent);
      if (isUrgent == true) {
        isUrgent = false;
      } else {
        isUrgent = true;
      }
    },
    // applicationSub(isUrgent){
    //   console.log('isUrgentClick',isUrgent)
    //   if(isUrgent==true){
    //     isUrgent = false
    //   } else {
    //     isUrgent = true
    //   }
    // },
    //提交申请
    async applicationSub() {
      // 是否有诊断校验
      let rep = await getDiaByClinicType({
        visitCode: this.receivePatientData.visitCode
      });
      if (rep.code === 1 && rep.data.length === 0) {
        this.$message.warning("当前患者还没有诊断，请开诊断之后才能提交申请！");
        return false;
      }

      if (!this.patientParam.patientId) {
        this.$message.warning("请先选择患者，再开申请单!");
        return false;
      }
      // if (this.applyList.length < 1) {
      if (this.selectedList.length < 1) {
        this.$message.warning("请选择要申请的医嘱!");
        return false;
      }
      if (this.selectedList.length > 20) {
        this.$message.warning("申请的数据不可超过20条");
        return false;
      }
      let _self = this;
      let applyParamData = {};
      let submitData = [];
      let dataList;
      console.log("applicationSub-this.selectedList", this.selectedList);
      console.log(
        "applicationSub-this.patientParam.patientId",
        this.patientParam
      );
      this.selectedList.forEach(item => {
        item.isUrgent = item.isUrgent2 || "0";
        item.sampleTypeCode = item.specimen;
        item.patientId = this.patientParam.patientId;
        item.patientType = "1";
        item.visitId = this.receivePatientData.appointmentId;
        item.visitCode = this.patientParam.id;
        item.freeFlag = this.diagformdata.freeFlag;
        item.note = item.advicePrompt; //注意事项
        submitData.push(item);
      });
      /* for (var i = 0; i < this.selectedList.length; i++) {
          for (var j = 0; j < this.applyList.length; j++) {
            if (this.selectedList[i].id == this.applyList[j].id) {
              submitData.push(this.selectedList[i]);
            }
          }
        } */
      // this.submitLoad = true;
      // this.$showLoading();
      // try {
      //   let resp = await checkRepeat(submitData);
      //   if (resp.code === 1) {
      //     if (resp.data) {
      //       this.$confirm("此申请重复, 是否继续?", "提示", {
      //         confirmButtonText: "确定",
      //         cancelButtonText: "取消",
      //         type: "warning"
      //       })
      //         .then(() => {
      //           this.saveApplyFunc(submitData);
      //         })
      //         .catch();
      //     } else {
      console.log("applicationSub-submitData", submitData);
      this.saveApplyFunc(submitData);
      //     }
      //   }
      //   this.$hideLoading();
      //   this.submitLoad = false;
      // } catch (error) {
      //   this.$hideLoading();
      //   this.$message.error(error.msg || "提交申请失败");
      //   this.submitLoad = false;
      // }
    },
    saveApplyFunc(data) {
      // this.submitLoad = true;
      saveApply(data)
        .then(result => {
          if (result.code == 1) {
            // 清除提交的数据剩下的数据还要展示写于  2020/9/1multipleTable
            let selectedListData = this.selectedList;
            for (let i = 0; i < selectedListData.length; i++) {
              for (let j = 0; j < data.length; j++) {
                if (selectedListData[i].id == data[j].id) {
                  selectedListData.splice(i, 1);
                }
              }
            }
            this.selectedList = selectedListData;
            this.$refs.rigTableyApply.clearSelection();
            this.$refs.tree.setCheckedKeys([]);
            this.$refs.keshitree.setCheckedKeys([]);
            this.$refs.gerentree.setCheckedKeys([]);
            this.$message.success("提交申请成功");
            // this.rightseach(this.patientParam);
          } else {
            this.$message.error(result.msg || "提交申请失败");
          }
          this.submitLoad = false;
        })
        .catch(error => {
          this.submitLoad = false;
          this.$message.error(error.msg || "提交申请失败");
        });
    },

    //检验申请单
    selectCancelApply(val) {
      console.log("selectCancelApply-val", val);
      this.applyList = val;
      this.totalMoney = 0;
      this.applyList.forEach(item => {
        this.totalMoney = (this.totalMoney * 1 + item.amt * 1).toFixed(4);
      });
      this.printData = this.applyList;
      this.printList = val;
    },
    cancelSelect() {
      if (this.applyList.length < 1) {
        this.$message.warning("请选择要删除的医嘱!");
        return false;
      }
      let submitData = [];
      console.log(
        "applicationSub-this.patientParam.patientId",
        this.patientParam
      );
      this.selectedList.forEach(item => {
        item.isUrgent = item.isUrgent2 || "0";
        item.sampleTypeCode = item.specimen;
        item.patientId = this.patientParam.patientId;
        item.patientType = "1";
        item.visitId = this.receivePatientData.appointmentId;
        item.visitCode = this.patientParam.id;
        // submitData.push(item);
      });
      let ids = this.applyList.map(item => item.id).join(",");
      console.log("cancelSelect-ids", ids);
      for (var i = 0; i < this.selectedList.length; i++) {
        for (var j = 0; j < this.applyList.length; j++) {
          if (this.selectedList[i].id == this.applyList[j].id) {
            if (this.activeName == "first") {
              this.$refs.tree.setChecked(this.selectedList[i].id, false);
            } else if (this.activeName == "second") {
              this.$refs.keshitree.setChecked(this.selectedList[i].id, false);
            } else if (this.activeName == "third") {
              this.$refs.gerentree.setChecked(this.selectedList[i].id, false);
            }
            // this.$refs.tree.setChecked(this.selectedList[i].id,false)

            // this.selectedList.splice(i,1);
          }
        }
      }
      if (this.activeName == "first") {
        this.handleCheck();
      } else if (this.activeName == "second") {
        this.handleCheckKeShi();
      } else if (this.activeName == "third") {
        this.handleCheckGeRen();
      }
      // this.handleCheck()
      this.$refs.rigTableyApply.clearSelection();
    },
    async getHistoryApplyList() {
      this.historyApplyList = [];
      this.$refs.rigTable && this.$refs.rigTable.clearSelection();
      if (typeof this.patientParam.patientId == "undefined") {
        // this.$message.warning("请选择患者!");
        return;
      }
      try {
        this.rightTableLoad = true;
        let params = {};
        if (this.history.myself) {
          params["myself"] = "1";
        } else {
          // params["myself"] = "";
          delete params["myself"];
        }
        if (this.history.deptId) {
          params["deptId"] = "1";
        } else {
          // params["deptId "] = "";
          delete params["deptId"];
        }
        params["startTime"] =
          this.history.timepicker &&
          this.history.timepicker[0] &&
          this.history.timepicker[0] + " 00:00:00";
        params["endTime"] =
          this.history.timepicker &&
          this.history.timepicker[1] &&
          this.history.timepicker[1] + " 23:59:59";

        delete params.status;
        if (this.history.status != 0) {
          params["status"] = this.history.status;
        }

        params["patientId"] = this.patientParam.patientId;
        params["patientType"] = "1"; //this.patientParam.patientSource;
        params["pageSize"] = "300";
        params["pageNo"] = "1";
        let result = await historyList(params);
        console.log("historyList-result", result);
        if (result.code == "1") {
          let newData = result.data.map(item => {
            return {
              ...item,
              // progre: progreNum, //进度
              // begaintime: item.createTime, //申请时间
              // project: item.itemName, //项目
              // status: item.status, //状态
              // remarks: "", //备注
              // specimen: "", //标本
              chargeStatus: item.chargeStatus.toString() //费用状态
              // AppSection: item.deptCode, //申请科室
              // appDoctor: item.createName, //申请医生
              // id: item.applyId //id
            };
          });
          this.historyApplyList = newData;
          this.rightTableLoad = false;
        }
      } catch (error) {
        this.rightTableLoad = false;
      }
    },
    //存为模板弹窗
    showRelList() {
      if (this.applyList.length > 0) {
        this.modelVisible = true;
      } else {
        this.$message.warning("请选择医嘱");
      }
    },
    // 关闭模板弹窗
    huidanClose() {
      this.modelVisible = false;
    },

    //检验历史单
    selectHistoryApply(val) {
      console.log("selectHistoryApply-val", val);
      this.selectHistoryList = val;
      this.totalMoney = 0;
      this.selectHistoryList.forEach(item => {
        this.totalMoney = this.totalMoney + item.amt;
      });
      this.printData = this.selectHistoryList;
      this.printList = val;
    },
    noteInput(val) {
      this.$forceUpdate();
      let vals = val === "" || val === undefined ? "" : val;
      this.$set(this.currentLeftRow, "advicePrompt", vals);
    },
    //作废申请
    backout() {
      let _self = this;

      if (this.selectHistoryList.length < 1) {
        this.$message.warning("请选择一条数据");
        return;
      }
      if (this.selectHistoryList.length > 20) {
        this.$message.warning("申请作废的数据不可超过20条");
        return;
      }

      // 已收费的医嘱不可作废
      for (let i = 0; i < this.selectHistoryList.length; i++) {
        if (
          this.selectHistoryList[i].chargeStatus !== "0" &&
          this.selectHistoryList[i].chargeStatus !== "4"
        ) {
          this.$message.warning("只有未收费与免费的申请可作废！");
          return;
        }
      }

      this.$confirm("", "", {
        showClose: "false",
        confirmButtonText: "作废",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: "true",
        message:
          "<div>作废申请</div><p><span>作废后无法恢复,</span>你要继续吗？</p>",
        type: "warning"
      })
        .then(async () => {
          let ids = _self.selectHistoryList
            .map(item => item.assayApplyId)
            .join(",");
          console.log(
            "backout-_self.selectHistoryList",
            _self.selectHistoryList
          );
          console.log("backout-ids", ids);
          let params = {
            id: ids
          };
          let result = await backoutApply(params);
          if (result.code == 1) {
            this.$message({
              type: "success",
              message: "作废成功!"
            });
            _self.getHistoryApplyList();
            _self.selectHistoryList = [];
            this.$refs.rigTable.clearSelection();
          } else {
            this.$message.error(result.msg || "作废失败");
          }
        })
        .catch(err => {
          if (err.msg) {
            this.$message({
              type: "error",
              message: err.msg || "作废失败，请联系管理员！"
            });
          }
        });
    },
    yhpzClick() {
      if (this.yhpzName == "pzgl") {
        this.getHistoryApplyList();
      }
    },
    conserve() {
      // debugger
      if (this.applyList.length < 1) {
        this.$message.error("请选择至少一条医嘱信息！");
        return false;
      }
      let outpatientCisTempDetails = [];
      // let recipeId = this.applyList[0].recipeId;
      // console.info(recipeId);
      for (let i = 0; i < this.applyList.length; i++) {
        let item = {
          deptName: this.$store.state.user.role.deptName,
          itemId: this.applyList[i].itemId,
          itemCat: "6", //this.applyList[i].itemCat, // 检验6，检查5
          itemName: this.applyList[i].itemName,
          price: this.applyList[i].amt,
          amt: this.applyList[i].amt, //
          atm: this.totalMoney,
          urgent: this.applyList[i].isUrgent2 || "0",

          sampleTypeName: this.applyList[i].specimen,
          sampleTypeCode: this.applyList[i].specimen,

          applyTypeName: this.applyList[i].applyTypeName,

          AppSection: this.$store.state.user.role.deptName, //this.applyList[i].deptName,

          formCode: this.applyList[i].formCode,

          quantity: "1",
          unit: this.applyList[i].unit
          // classCode: this.applyList[i].classCode,
          // spec: this.applyList[i].spec,
          // dosage: this.applyList[i].dosage,
          // dosageUnit: this.applyList[i].dosageUnit,
          // frequencyCode: this.applyList[i].frequencyCode,
          // unit: this.applyList[i].unit,
          // skinTest: this.applyList[i].skinTest,
          // remark: this.applyList[i].remark,
          // useWay: this.applyList[i].useWay,
          // quantity: this.applyList[i].quantity,
          // manageType: this.applyList[i].manageType,
          // oneDosage: this.applyList[i].onceDosage,
          // dropRate: this.applyList[i].dropRate,
          // administrationTimeCode: this.applyList[i].administrationTimeCode,
          // excessReason: this.applyList[i].excessReason,
          // isMajor: this.applyList[i].isMajor,
          // groupNo: this.applyList[i].groupNo,
          // executeDepartmentId: this.applyList[i].execDeptId,
          // executeDepartmentName: this.applyList[i].execDeptName,
          // frequencyTimes: this.applyList[i].frequencyTimes,
          // frequencyUnit: this.applyList[i].frequencyUnit,
          // packageUnit: this.applyList[i].packUnit,
          // packQuantity: this.applyList[i].packQuantity,
          // day: this.applyList[i].day,
          // useDay: this.applyList[i].useDay
        };
        // if(this.applyList[i].recipeId === recipeId){
        outpatientCisTempDetails.push(item);
        // }else{
        //   this.$message.warning("请选择同一处方保存模板！");
        //   return false;
        // }
      }
      // console.log(JSON.stringify(this.applyList))
      console.log(JSON.stringify(outpatientCisTempDetails));
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = {
            templetName: this.modeldata.templetName,
            templetRange: this.modeldata.templetRange,
            shareLevel: this.modeldata.shareLevel,
            templetType: "6", //this.modeldata.templetType,// 检验 8， 检查5
            remark: this.modeldata.remark,
            deptId: "",
            outpatientCisTempDetails: outpatientCisTempDetails
          };

          this.saveTemLoad = true;
          outpatientCisTempinsert(data).then(res => {
            this.saveTemLoad = false;
            if (res.code === 1) {
              this.modelVisible = false;

              this.loadTable();
              this.loadGeRenTable();
              // this.Forgroups();
              this.$refs.ruleForm.resetFields();
              this.$refs.rigTableyApply.clearSelection();
              this.$message.success("保存模板成功！");
            } else {
              this.$message.error(res.msg || "保存模板失败");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeTabClick() {
      // this.$refs.ruleForm.resetFields();
      this.$refs.rigTableyApply && this.$refs.rigTableyApply.clearSelection();
      this.$refs.rigTable && this.$refs.rigTable.clearSelection();
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.keshitree.setCheckedKeys([]);
      this.$refs.gerentree.setCheckedKeys([]);
      this.applyList = [];
      this.selectedList = [];
    },

    rowClick(row) {
      this.currentLeftRow = row;
      let advicePrompt =
        row.advicePrompt === "" || row.advicePrompt === undefined
          ? ""
          : row.advicePrompt;
      this.$set(this.diagformdata, "advicePrompt", advicePrompt);
      // if (row != null) {
      //   //显示第一项
      //   this.rightdata.active = 1;
      //   this.rightdata.activeStepList[0].data.time = row.begaintime;
      //   this.rightdata.activeStepList[0].data.name = row.appDoctor;
      // } else {
      //   this.clearStepList();
      // }
    },
    rowClick1(row) {},
    // clearStepList() {
    //   this.rightdata.active = 0;
    //   this.rightdata.activeStepList[0].data.time = "";
    //   this.rightdata.activeStepList[0].data.name = "";
    // },
    //获取组套菜单接口
    // async Forgroups() {
    //   let reslut = await getChargeTemplateList({
    //     itemType: "1",
    //     templateType: this.eleTemType,
    //     level: "1",
    //     outOrInpEnable: "1",
    //     tempType: "0",
    //     loadUseRange: parseInt(this.patientParam.patientSource)
    //   });

    //   let setmealData = [];

    //   let persmealData = [];
    //   if (reslut.code == 1) {
    //     reslut.data.deptList.forEach(function(item) {
    //       setmealData.push({
    //         id: item.templateId,
    //         name: item.templateName
    //       });
    //     });
    //     reslut.data.personalList.forEach(function(item) {
    //       persmealData.push({
    //         id: item.templateId,
    //         name: item.templateName
    //       });
    //     });
    //   }
    //   this.setmeal = setmealData;
    //   //个人套餐
    //   this.persmeal = persmealData;
    // },
    //顶部搜索接口
    // search(type) {
    //   this.pageParams.pageNo = 1;
    //   this.pageParams.total = 0;
    //   this.apiFunc();
    // },
    // reTableData(data) {
    //   let obj = {};
    //   // 同组去重
    //   let list = data.reduce((item, next) => {
    //     if (!obj[next.groupName]) {
    //       obj[next.groupName] = true;
    //       item.push(next);
    //     }
    //     return item;
    //   }, []);
    //   // 同组放到相同的chidlren里
    //   let arr = list.map(item => {
    //     let children = data.filter(ele => ele.groupId === item.groupId);
    //     return {
    //       ...item,
    //       list: children
    //     };
    //   });
    //   return arr;
    // },
    // loadTable() {
    //   this.tlm_isLoading = true;
    //   this.temCheckedList = [];
    //   getAilItems({
    //     tempType: "2",
    //     templateType: this.eleTemType,
    //     loadUseRange: parseInt(this.patientParam.patientSource),
    //     queryType: this.formSearch.group,
    //     searchData: this.formSearch.inputop,
    //     ...this.pageParams
    //   })
    //     .then(result => {
    //       if (result.code == "1") {
    //         let dataList = this.reTableData(result.data.allList);
    //         if (this.pageParams.pageNo === 1) {
    //           this.orderTable = dataList;
    //         } else {
    //           this.orderTable = this.orderTable.concat(dataList);
    //         }
    //         this.pageParams.pageNo = result.pageParams.pageNo;
    //         this.pageParams.total = result.pageParams.total;
    //       }
    //       this.tlm_isLoading = false;
    //     })
    //     .catch(err => {
    //       this.tlm_isLoading = false;
    //     });
    // },
    // loadTableTem(val) {
    //   if (val) {
    //     this.chacakid = val;
    //   }
    //   this.tlm_isLoading = true;
    //   //点击具体模板事件
    //   getChargeTemplateList({
    //     id: this.chacakid,
    //     level: "2",
    //     outOrInpEnable: "1",
    //     tempType: "0",
    //     templateType: this.eleTemType,
    //     loadUseRange: parseInt(this.patientParam.patientSource),
    //     queryType: this.formSearch.group,
    //     searchData: this.formSearch.inputop,
    //     ...this.pageParams
    //   })
    //     .then(result => {
    //       if (result.code == "1") {
    //         let dataList = this.reTableData(result.data.groupList);
    //         if (this.pageParams.pageNo === 1) {
    //           if (result.data.checkedList) {
    //             this.temCheckedList = this.reTableData(result.data.checkedList);
    //           }
    //           this.orderTable = dataList;
    //         } else {
    //           this.orderTable = this.orderTable.concat(dataList);
    //         }
    //         this.pageParams.total = result.total;
    //         this.$nextTick(() => {
    //           dataList.forEach(item => {
    //             if (item.checkStatus == 1) {
    //               this.$refs.orderTable.toggleRowSelection(item, true);
    //             }
    //           });
    //         });
    //       }
    //       this.tlm_isLoading = false;
    //     })
    //     .catch(err => {
    //       this.tlm_isLoading = false;
    //     });
    // },
    // loadNextPage() {
    //   if (this.tlm_noMore) {
    //     return;
    //   }
    //   this.pageParams.pageNo++;
    //   this.apiFunc();
    // },
    //菜单搜索接口
    // async handleSelect(key) {
    //   this.chacakid = key;
    //   this.toggleSelection(this.checkedList);
    //   this.checkedList = [];
    //   try {
    //     let reslut = [];
    //     let _self = this;
    //     let selectedDataIndex = [];
    //     _self.orderTable = [];
    //     //点击具体模板事件
    //     let index = 0;
    //     reslut = await getChargeTemplateList({
    //       id: key,
    //       level: "2",
    //       outOrInpEnable: "1",
    //       tempType: "0",
    //       templateType: this.eleTemType,
    //       loadUseRange: parseInt(_self.patientParam.patientSource)
    //     });

    //     if (reslut.code == "1") {
    //       reslut.data.groupList.forEach(function(item) {
    //         _self.orderTable.push({
    //           name: item.groupName,
    //           yzid: item.id,
    //           chargeItemId: item.chargeItemId,
    //           yzname: item.chargeItemName,
    //           id: item.groupId
    //         });
    //         if (item.checkStatus == 1) {
    //           selectedDataIndex.push(index);
    //         }
    //         index++;
    //       });
    //       // this.getOrderNumber();

    //       this.$nextTick(() => {
    //         selectedDataIndex.forEach(function(item) {
    //           _self.$refs.orderTable.toggleRowSelection(
    //             _self.orderTable[item],
    //             true
    //           );
    //         });
    //       });
    //     }
    //     if (key == 40) {
    //       /* reslut = await getAilItems({
    //         tempType: "2",
    //         templateType: this.eleTemType,
    //         loadUseRange: parseInt(_self.patientParam.patientSource)
    //       });

    //       if (reslut.code == "1") {
    //         reslut.data.allList.forEach(function(item) {
    //           _self.orderTable.push({
    //             name: item.groupName,
    //             yzid: item.id,
    //             chargeItemId: item.chargeItemId,
    //             yzname: item.chargeItemName,
    //             id: item.groupId
    //           });
    //         });
    //         // this.getOrderNumber();
    //       } */
    //     } else {
    //     }

    //     // this.$hideLoading();
    //   } catch (error) {
    //     // this.$hideLoading();
    //     // this.$message.error(error.msg || "查询失败");
    //   }
    // },
    // 获取相同编号的数组
    // getOrderNumber() {
    //   let OrderObj = {};
    //   this.orderTable.forEach((element, index) => {
    //     element.rowIndex = index;
    //     if (OrderObj[element.id]) {
    //       OrderObj[element.id].push(index);
    //     } else {
    //       OrderObj[element.id] = [];
    //       OrderObj[element.id].push(index);
    //     }
    //   });

    //   this.OrderIndexArr = [];
    //   // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
    //   for (let k in OrderObj) {
    //     if (OrderObj[k].length > 1) {
    //       this.OrderIndexArr.push(OrderObj[k]);
    //     }
    //   }
    // },
    // 合并单元格
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 0) {
    //     for (let i = 0; i < this.OrderIndexArr.length; i++) {
    //       let element = this.OrderIndexArr[i];
    //       for (let j = 0; j < element.length; j++) {
    //         let item = element[j];
    //         if (rowIndex == item) {
    //           if (j == 0) {
    //             return {
    //               rowspan: element.length,
    //               colspan: 1
    //             };
    //           } else if (j != 0) {
    //             return {
    //               rowspan: 0,
    //               colspan: 0
    //             };
    //           }
    //         }
    //       }
    //     }
    //   }
    // },
    // toggleSelection(rows) {
    //   if (rows) {
    //     rows.forEach(row => {
    //       this.$refs.orderTable.toggleRowSelection(row);
    //     });
    //   } else {
    //     this.$refs.orderTable.clearSelection();
    //   }
    // },
    //检验明细项选中
    // handleSelectionChange(val) {
    //   this.checkedList = val;
    // },
    // checkbox单选
    // handlerSelectChange(rows, row) {
    //   console.log('handlerSelectChange-rows',rows)
    //   if (this.temCheckedList.length === 0) {
    //     return;
    //   }
    //   let selected = rows.length > 0 && rows.indexOf(row) !== -1;
    //   if (selected) {
    //     this.temCheckedList.push(row);
    //   } else {
    //     for (let i = this.temCheckedList.length - 1; i >= 0; i--) {
    //       let item = this.temCheckedList[i];
    //       if (item.groupId === row.groupId) {
    //         this.$delete(this.temCheckedList, i);
    //       }
    //     }
    //   }
    //   console.log('handlerSelectChange-this.temCheckedList',this.temCheckedList)
    // },
    //打印
    async printClickOld() {
      if (this.printData.length != 1) {
        this.$message.error("请选择一条信息");
        return false;
      }
      let data = {};
      let res = await applyPrint({
        visitCode: this.receivePatientData.visitCode,
        applyId: this.printData[0].assayApplyId,
        patientId: this.receivePatientData.patientId,
        type: "essayApply"
      });
      if (res.code === 1) {
        data = res.data;
        onPreview(data, "检验申请单罗湖");
      }
    },
    async printClick() {
      if (this.printData.length < 1) {
        this.$message.warning("请选择记录再进行打印");
        return;
      }
      if (this.printData.length > 20) {
        this.$message.warning("打印的数据不可超过20条");
        return;
      }
      let data = {};
      let applyId = "";
      this.printData.forEach((item, index) => {
        if (index != 0) {
          applyId = applyId + "," + item.assayApplyId;
        } else {
          applyId = item.assayApplyId;
        }
      });
      let res = await applyPrint({
        visitCode: this.receivePatientData.visitCode,
        applyId,
        patientId: this.receivePatientData.patientId,
        type: "essayApply"
      });
      if (res.code === 1) {
        data = res.data;
        onPreview(data, "检验申请单罗湖");
      }
    },
    //提交申请
    // async sent() {
    //   if (!this.patientParam.patientId) {
    //     this.$message.warning("请先选择患者，再开申请单!");
    //     return false;
    //   }
    //   if (this.checkedList.length === 0) {
    //     this.$message.warning("请选择要申请的医嘱!");
    //     return false;
    //   }
    //   let _self = this;
    //   let applyParamData = {};
    //   let submitData = [];
    //   let dataList;
    //   if (this.temCheckedList.length > 0) {
    //     dataList = this.temCheckedList;
    //   } else {
    //     dataList = this.checkedList;
    //   }
    //   dataList.forEach(item => {
    //     let list = item.list.map(ele => ({
    //       chargeItemId: ele.chargeItemId,
    //       chargeItemName: ele.chargeItemName
    //     }));
    //     let params = {
    //       packageId: item.groupId,
    //       applyType: this.eleTemType,
    //       packageName: item.groupName,
    //       patientId: this.patientParam.patientId,
    //       // 项目名称+套餐名称
    //       packageItemName: item.groupName,
    //       patientType: this.patientParam.patientSource,
    //       applyChargeItemList: list
    //     };
    //     if (this.$attrs.hosType == "1") {
    //       params.visitId = this.receivePatientData.appointmentId;
    //       params.visitCode = this.patientParam.id;
    //     } else if (this.$attrs.hosType == "3") {
    //       params.inpCode = this.patientParam.id;
    //     }
    //     submitData.push(params);
    //   });

    //   this.submitLoad = true;
    //   this.$showLoading();
    //   try {
    //     let resp = await checkRepeat(submitData);
    //     if (resp.code === 1) {
    //       if (resp.data) {
    //         this.$confirm("此申请重复, 是否继续?", "提示", {
    //           confirmButtonText: "确定",
    //           cancelButtonText: "取消",
    //           type: "warning"
    //         })
    //           .then(() => {
    //             this.submitApplyFunc(submitData);
    //           })
    //           .catch();
    //       } else {
    //         this.submitApplyFunc(submitData);
    //       }
    //     }
    //     this.$hideLoading();
    //     this.submitLoad = false;
    //   } catch (error) {
    //     this.$hideLoading();
    //     this.$message.error(error.msg || "提交申请失败");
    //     this.submitLoad = false;
    //   }
    // },
    // submitApplyFunc(data) {
    //   this.submitLoad = true;
    //   submitApply(data)
    //     .then(result => {
    //       if (result.code == 1) {
    //         this.$refs.orderTable.clearSelection();
    //         this.$message.success("提交申请成功");
    //         this.rightseach(this.patientParam);
    //       } else {
    //         this.$message.error(result.msg || "提交申请失败");
    //       }
    //       this.submitLoad = false;
    //     })
    //     .catch(error => {
    //       this.submitLoad = false;
    //       this.$message.error(error.msg || "提交申请失败");
    //     });
    // },

    // 右侧表格方法
    // 搜索方法
    // async rightseach() {
    //   this.rightdata.rightable = [];
    //   this.$refs.rigTable && this.$refs.rigTable.clearSelection();
    //   if (typeof this.patientParam.patientId == "undefined") {
    //     return;
    //   }
    //   try {
    //     this.rightTableLoad = true;
    //     let params = {};
    //     if (this.rightdata.rightseach.checkedstat) {
    //       params["seeType"] = "1";
    //     } else {
    //       params["seeType"] = "0";
    //     }
    //     params["beginTime"] =
    //       this.rightdata.rightseach.timepicker &&
    //       this.rightdata.rightseach.timepicker[0] &&
    //       this.rightdata.rightseach.timepicker[0] + " 00:00:00";
    //     params["endTime"] =
    //       this.rightdata.rightseach.timepicker &&
    //       this.rightdata.rightseach.timepicker[1] &&
    //       this.rightdata.rightseach.timepicker[1] + " 23:59:59";

    //     delete params.status;
    //     if (this.rightdata.rightseach.statechack != 0) {
    //       params["status"] = this.rightdata.rightseach.statechack;
    //     }
    //     params["queryApplyType"] = this.eleTemType;
    //     params["patientId"] = this.patientParam.patientId;
    //     params["patientType"] = this.patientParam.patientSource;
    //     let result = await getHistoryApplyList(params);
    //     if (result.code == "1") {
    //       let newData = result.data.map(item => {
    //         let progreNum;
    //         // 治疗申请只有2步
    //         if (this.eleTemType === 3) {
    //           if (item.status == 3) {
    //             progreNum = "100";
    //           } else {
    //             progreNum = "50";
    //           }
    //         } else {
    //           progreNum = "25";
    //         }

    //         return {
    //           progre: progreNum, //进度
    //           begaintime: item.createTime, //申请时间
    //           project: item.itemName, //项目
    //           state: item.status, //状态
    //           remarks: "", //备注
    //           specimen: "", //标本
    //           coststatus: item.chargeStatus, //费用状态
    //           AppSection: item.deptCode, //申请科室
    //           appDoctor: item.createName, //申请医生
    //           id: item.applyId //id
    //         };
    //       });
    //       this.rightdata.rightable = newData;
    //       this.rightTableLoad = false;
    //     }
    //   } catch (error) {
    //     this.rightTableLoad = false;
    //   }
    // },

    //撤销申请
    // cancel() {
    //   let _self = this;

    //   if (this.applyList.length < 1) {
    //     this.$message.warning("请选择一条数据");
    //   } else {
    //     this.$confirm("", "", {
    //       showClose: "false",
    //       confirmButtonText: "撤销",
    //       cancelButtonText: "取消",
    //       dangerouslyUseHTMLString: "true",
    //       message:
    //         "<div>撤销申请</div><p><span>撤销申请无法重复编辑,</span>你要继续吗？</p>",
    //       type: "warning"
    //     })
    //       .then(async () => {
    //         let ids = _self.applyList.map(item => item.id).join(",");
    //         let params = {
    //           id: ids
    //         };
    //         let result = await backoutApply(params);
    //         if (result.code == 1) {
    //           this.$message({
    //             type: "success",
    //             message: "申请撤销成功!"
    //           });
    //           _self.rightseach();
    //           _self.applyList = [];
    //           this.$refs.rigTable.clearSelection();
    //         } else {
    //           this.$message.error(result.msg || "申请撤销失败");
    //         }
    //       })
    //       .catch(err => {
    //         this.$message.error(err.msg || "申请撤销失败");
    //       });
    //   }
    // },
    // initComponent(type, params) {
    //   this.patientParam = {
    //     patientId: params.patientId, // 患者id
    //     patientSource: params.type, //患者来源 0门诊 1住院
    //     id: params.id, //门诊号or住院号
    //     type: type //申请检验检查类型
    //   };

    //   this.Forgroups();
    // },
    async setPatientInfo(type, params) {
      this.patientParam = {
        patientId: params.patientId, // 患者id
        patientSource: params.type, //患者来源 0门诊 1住院
        id: params.id, //门诊号or住院号
        type: type //申请检验检查类型
      };
      this.$refs.orderTable && this.$refs.orderTable.clearSelection();
      // await this.rightseach();
      // this.rowClick(this.rightdata.rightable[0]);
    },
    // 关闭保存模板
    closeSaveTem() {
      this.modelVisible = false;
      this.$refs.ruleForm.resetFields();
    }
    // 切换左侧表格数据源类型
    // changTableType(id) {
    //   this.activeType = id;
    //   this.checkedList.splice(0);
    // },
    // 项目名称或简拼输入搜索
    // enterSearch(val) {
    //   this.searchDebounced && clearTimeout(this.searchDebounced);
    //   this.searchDebounced = setTimeout(() => {
    //     this.search();
    //   }, 600);
    // }
  }
};
</script>
<style lang="scss" scoped>
.applycontent {
  display: flex;
  overflow: hidden;

  .cardtitle {
    margin-bottom: 8px;
  }

  .apply-left {
    display: flex;
    flex-direction: column;
    width: 280px;
    height: 100%;
    padding: 16px;
    border-right: 1px solid $l-color-bgcolor-11;

    .apply-left-top-search {
      margin-bottom: 8px;
    }

    .apply-left-tabs {
      flex: 1;
      height: 0;
    }
  }

  .apply-right {
    flex: 1;
    width: 0;
    height: 100%;
    padding: 16px;

    .flex-column-box {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .apply-right-search {
      display: flex;
      align-items: center;
      padding-top: 16px;
      font-size: 0;

      .right-search-left {
        flex: 1;
        display: flex;
        align-items: center;
        width: 0;

        > div {
          margin-right: 8px;
        }
      }
    }
  }

  .tree-content-overflow {
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }

  .scrollheight {
    flex: 1;
    height: 0;
    overflow: hidden;
    overflow-y: auto;
  }

  .total {
    margin-top: 8px;
  }

  /deep/ .el-tabs__header {
    margin: 0 0 0px;
  }

  /deep/ .el-tabs__nav-scroll {
    background-color: #ffffff !important;
  }

  // /deep/ .el-popover__reference {
  //   background-color: #aaaaaa !important;
  // }
  // /deep/ .el-popper {
  //   background-color: #157626 !important;
  // }

  .apply-content-tabs {
    height: 100%;

    /deep/ .el-tabs__header {
      padding: 0 5px;
    }

    // /deep/ .el-tabs__nav-scroll {
    //   background-color: transparent;
    // }

    /deep/ .el-tabs__content {
      height: calc(100% - 55px);
    }
  }

  .arearowall {
    height: 100%;

    .el-menu-vertical-demo {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      .el-menu-item-group {
        .el-menu-item {
          width: 100%;
          white-space: normal;
          word-break: break-all;
          word-wrap: break-word;
        }

        li {
          width: 100%;
          height: auto;
          line-height: 30px;
        }
      }
    }

    .arearowleft {
      height: 100%;
      padding-top: 10px;
      padding-bottom: 20px;
      border-right: 1px solid $l-color-bgcolor-11;
      overflow: hidden;
      // overflow-y: auto;

      .topseach {
        padding: 0 10px;
        margin: 0 0 15px;

        .el-button--text {
          color: $l-color-fontcolor-3;
        }
      }

      .table-type {
        padding: 0 10px;
        height: 30px;
        font-size: 0;

        span {
          display: inline-block;
          line-height: 30px;
          padding: 0 20px;
          background-color: $l-color-bgcolor-18;
          color: $l-color-fontcolor-4;
          font-size: $l-font-size;
          cursor: pointer;

          &.is-active {
            background-color: $l-color-primary;
            color: $l-color-white;
          }
        }
      }

      .navall {
        width: 100%;
        height: calc(100% - 72px);
        padding: 0 10px;
        overflow: hidden;

        &.shrink {
          height: calc(100% - 280px);
        }

        .navmenu {
          height: 100%;
          border-right: 0;

          .el-menu {
            border-right: 0;
          }

          .el-menu--inline {
            border-bottom: 1px solid $l-color-white;
            background-color: $l-color-bgcolor-18;
          }

          .el-submenu {
            border-bottom: 1px solid $l-color-white;
            background-color: $l-color-bgcolor-18;

            .el-menu-item.is-active {
              background-color: $l-color-bgcolor-12;
              color: $l-color-fontcolor-3;
            }
          }

          .el-menu-item {
            background-color: $l-color-bgcolor-18;
          }

          .el-submenu__icon-arrow {
            display: none;
          }

          .filter-item {
            font-size: 12px;
            display: inline-block;
            -webkit-transition: -webkit-transform 0.3s;
            transition: -webkit-transform 0.3s;
            transition: transform 0.3s;
            transition: transform 0.3s, -webkit-transform 0.3s;
          }

          .el-submenu.is-opened > .el-submenu__title .filter-item {
            transform: rotateZ(90deg);
            -ms-transform: rotate(90deg);
            -moz-transform: rotate(90deg);
            -webkit-transform: rotate(90deg);
          }
        }

        .el-table-column--selection .cell {
          padding-left: 10px;
        }
      }
    }
  }

  .handle-btn-box {
    font-size: 0;
    padding: 16px 0;
    overflow: hidden;

    .el-button {
      height: auto;
      padding: 0;
    }

    .filter-item {
      color: $l-color-fontcolor-3 !important;
    }
  }

  .righttable {
    height: 100%;

    .rightrow {
      height: 100%;
      padding: 0 10px;

      .rigmidtable {
        height: 290px;

        .el-table {
          height: 100%;
        }

        // height: 300px;
        margin-bottom: 20px;
      }

      .rigmidtabletem {
        height: 500px;

        .el-table {
          height: 100%;
        }

        // height: 300px;
        margin-bottom: 20px;
      }

      .bottomtext {
        width: 100%;
        height: 150px;
        background: $l-color-bgcolor-14;

        /deep/ .el-step__icon.is-icon {
          width: 24px;
          height: 24px;
          border-radius: 12px;
          background: $l-color-bgcolor-14;

          .is-status {
            background: $l-color-primary1;
            color: $l-color-white;
            padding: 2px;
            border-radius: 12px;
          }
        }

        .el-step__head.is-process {
          color: $l-color-primary1;
        }

        .el-step.is-horizontal .is-success .el-step__line {
          background: $l-color-primary1;
        }

        .el-step__title.is-success {
          font-weight: bold;
          color: $l-color-fontcolor-3;
        }
      }
    }
  }
}

.save-template-box {
  position: relative;
  margin-top: 8px;
  padding: 8px;
  /* border: 1px #000000; */
  border: 1px solid #e4e4e4;

  .allergy-form-btn {
    width: 100%;
    text-align: right;
    margin-top: 14px;
  }
}

.consultation-step {
  .el-steps {
    padding-left: 20px;
    padding-right: 20px;
  }

  /deep/ .el-step__head.is-success {
    border-color: $l-color-primary;

    .el-step__line {
      background-color: $l-color-primary;
    }

    .el-step__icon-inner.is-status {
      background-color: $l-color-primary;
      border-radius: 12px;
      padding: 2px;
      color: $l-color-white;
    }
  }

  /deep/ .el-step__title {
    color: $l-color-fontcolor-3;
    font-size: $l-font-size;
  }

  /deep/ .el-step__description {
    color: $l-color-fontcolor-4;
    font-size: $l-font-size;
  }

  /deep/ .el-step__head.is-process {
    color: $l-color-primary;
  }
}

.right-search-right {
  .el-checkbox {
    margin-right: 7px;
  }
}

.state-color {
  color: $l-color-primary;
}

/deep/ .el-date-editor .el-range__close-icon {
  position: static;
}

.his-apply {
  width: 60px;
  height: 4px;
  background-color: $l-color-bgcolor-17;
  margin: 7px 0;

  .his-apply-bar {
    position: relative;
    width: 0;
    height: 100%;
    background-color: $l-color-bgcolor-9;

    .his-apply-circle {
      position: absolute;
      right: -5px;
      top: -3px;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: $l-color-bgcolor-9;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    }
  }
}

.save-template-sel {
  float: none !important;
  // margin-left: 20px;
  margin-right: 20px;
  width: 100px;
  height: 36px;
}

.chargeTable {
  /deep/ thead {
    .el-checkbox {
      display: none;
    }
  }

  /deep/ tbody .cell {
    padding: 0;

    .chargeItem {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      border-top: 1px solid $l-color-bgcolor-11;

      &:first-child {
        border-top: 0;
      }
    }
  }
}
/deep/.el-table .freeRpRow {
  color: green;
}
</style>
