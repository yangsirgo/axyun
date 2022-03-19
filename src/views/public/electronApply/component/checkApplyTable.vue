<template>
  <div class="flex-column-box">
    <div class="handle-btn-box">
      <el-button
        class="filter-item iconfont icontijiao1"
        type="text"
        v-hotKey="{ func: 'func_submit' }"
        @click="applicationSub"
        :loading="submitLoad"
        >&nbsp;提交申请</el-button
      >
      <el-button
        class="filter-item iconfont iconshanchu"
        type="text"
        v-hotKey="{ func: 'func_delete' }"
        @click="cancelSelect"
        >&nbsp;删除</el-button
      >
      <el-button
        class="filter-item iconfont iconcunweimoban"
        type="text"
        v-hotKey="{ func: 'func_save' }"
        @click="showRelList"
        >&nbsp;保存为模板</el-button
      >
      <el-button
        class="filter-item iconfont iconzuofei"
        type="text"
        @click="backout"
        >&nbsp;作废</el-button
      >
      <el-button
        class="filter-item iconfont icondayin"
        type="text"
        v-hotKey="{ func: 'func_print' }"
        @click="printClick(0)"
        :loading="printLoading0"
        >&nbsp;打印</el-button
      >
      <el-button
        class="filter-item iconfont icondayin"
        type="text"
        v-hotKey="{ func: 'func_print' }"
        @click="printClick(1)"
        :loading="printLoading1"
        >&nbsp;全部打印</el-button
      >
      <el-button
        class="filter-item iconfont icondayin"
        type="text"
        v-hotKey="{ func: 'func_print' }"
        @click="printTreatClick()"
        :loading="printLoading2"
        >&nbsp;打印治疗单</el-button
      >
    </div>
    <el-form ref="diagform" :rules="diagformrules" :model="diagformdata">
      <el-form-item>
        <l-formt-title label="临床诊断" :isMultiRow="true">
          <el-input v-model="diagformdata.diagName" maxlength="150" @input="diagformChange"></el-input>
        </l-formt-title>
      </el-form-item>
      <el-form-item>
        <l-formt-title label="主诉" :isMultiRow="true">
          <el-input v-model="diagformdata.chiefComplaint" maxlength="150" @input="diagformChange"></el-input>
        </l-formt-title>
      </el-form-item>
      <el-form-item>
        <l-formt-title label="现病史" :isMultiRow="true">
          <el-input
            type="textarea"
            resize="none"
            maxlength="150"
            v-model="diagformdata.currentProfile"
            :autosize="{ minRows: 2, maxRows: 2 }"
            @input="diagformChange"
          ></el-input>
        </l-formt-title>
      </el-form-item>
      <el-form-item>
        <l-formt-title label="既往史" :isMultiRow="true">
          <el-input
            type="textarea"
            resize="none"
            maxlength="150"
            v-model="diagformdata.historyProfile"
            :autosize="{ minRows: 2, maxRows: 2 }"
            @input="diagformChange"
          ></el-input>
        </l-formt-title>
      </el-form-item>
      <el-form-item>
        <l-formt-title label="体格检查" :isMultiRow="true">
          <el-input
            type="textarea"
            maxlength="150"
            resize="none"
            v-model="diagformdata.physicalExamination"
            :autosize="{ minRows: 2, maxRows: 2 }"
            @input="diagformChange"
          ></el-input>
        </l-formt-title>
      </el-form-item>
      <el-row :gutter="8">
        <el-col :span="12">
          <el-form-item>
            <l-formt-title label="检查目的" :isMultiRow="true">
              <el-input
                maxlength="150"
                v-model="diagformdata.examPurpose"
                @input="diagformChange"
              ></el-input>
            </l-formt-title>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <l-formt-title label="注意事项">
              <el-input
                maxlength="180"
                v-model="diagformdata.advicePrompt"
                @input="noteInput"
              ></el-input>
            </l-formt-title>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="6">
          <el-form-item>
            <l-formt-title label="免费申请">
              <l-value-domain
                clearable
                code="FreeRecipeReason"
                :value.sync="diagformdata.freeFlag"
              />
            </l-formt-title>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item>
            <l-formt-title label="打印范围">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="主诉"></el-checkbox>
                <el-checkbox label="现病史"></el-checkbox>
                <el-checkbox label="既往史"></el-checkbox>
                <el-checkbox label="体格检查"></el-checkbox>
                <el-checkbox label="检查目的"></el-checkbox>
              </el-checkbox-group>
            </l-formt-title>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="scrollheight">
      <el-table
        ref="rigTableyApply"
        border
        highlight-current-row
        row-key="orderId"
        height="100%"
        v-loading="rightTableLoad"
        v-hotKey="{
          func: ['table_row', 'table_checkbox', 'table_choose'],
          deClass: 'el-table__row',
          curClass: 'current-row',
        }"
        :data="selectedList"
        :row-class-name="rowStyleCls"
        :span-method="objectSpanMethod"
        @selection-change="selectCancelApply"
        @row-click="rowClick"
      >
        <el-table-column
          width="55"
          name="duoxuan"
          type="selection"
          align="center"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column
          header-align="left"
          align="left"
          v-for="(item, index) in selectedParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.status !== undefined">
              <!-- 已申请 -->
              <template v-if="item.prop === 'expectExamTime'">
                {{ scope.row.createTime }}
              </template>
              <template v-else-if="item.prop === 'isUrgent'">
                <el-tag
                  type="danger"
                  disable-transitions
                  size="medium"
                  v-if="scope.row.isUrgent"
                  >加急</el-tag
                >
                <span v-else></span>
              </template>
              <template v-else-if="item.prop === 'position'">
                <span
                  code="BodyPosition"
                  v-codeTransform
                  :val="scope.row.bodyPartsCode"
                ></span>
              </template>
              <template v-else-if="item.prop === 'checkMethod'">
                <span
                  :val="scope.row.checkMethod"
                  code="InspectMethod"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'status'">
                <span class="state-color">
                  <!-- <span v-if="scope.row.status">{{
                    history.stageInvert[scope.row.status]
                  }}</span>
                  <span v-else>全部</span> -->
                  <!-- {{ scope.row.status }} -->
                  <applStatusShow
                    aType="检查"
                    :patientObj="receivePatientData"
                    :aStatus="scope.row.status"
                  ></applStatusShow>
                </span>
              </template>
              <template v-else-if="item.prop === 'chargeStatus'">
                <span
                  code="ChargeStatus"
                  :val="scope.row.chargeStatus || ''"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'execDeptCode'">
                {{ scope.row.execDeptName }}
              </template>
              <template v-else-if="item.prop === 'roleName'">
                {{ scope.row.createName }}
              </template>
              <template v-else-if="item.prop === 'project'">查看报告</template>
              <template v-else-if="item.prop === 'amt'">
                {{ Number(scope.row[item.prop] || 0).toFixed(4) }}
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
            <template v-else>
              <!-- 未申请 -->
              <template v-if="item.prop === 'isUrgent'">
                <el-checkbox
                  name="jiaji"
                  true-label="1"
                  false-label="0"
                  v-model="scope.row.isUrgent2"
                ></el-checkbox>
              </template>
              <template v-else-if="item.prop === 'position'">
                <!-- <span
                  code="BodyPosition"
                  v-codeTransform
                  :val="scope.row.position"
                ></span> -->
                <!-- {{ scope.row.position }} -->
                <l-value-domain
                  clearable
                  code="BodyPosition"
                  :value.sync="scope.row.position"
                />
              </template>
              <template v-else-if="item.prop === 'checkMethod'">
                <!-- <span
                  code="InspectMethod"
                  v-codeTransform
                  :val="scope.row.checkMethod"
                ></span> -->
                <l-value-domain
                  clearable
                  code="InspectMethod"
                  :value.sync="scope.row.checkMethod"
                />
              </template>
              <template v-else-if="item.prop === 'execDeptCode'">
                <div @click.capture="rowClick(scope.row)">
                  <l-value-domain
                    remoteUrl="/admin/wadmin/hos/dept"
                    remoteShowKey="orgNm"
                    remoteValueKey="id"
                    placeholder="请选择科室"
                    :remoteParams="{}"
                    :value.sync="scope.row.execDeptCode"
                    @change="deptChange"
                  />
                </div>
              </template>
              <template v-else-if="item.prop === 'quantity'">
                <el-input-number
                  v-model="scope.row[item.prop]"
                  class="width100"
                  :controls="false"
                  :step="1"
                  step-strictly
                  :min="1"
                  :max="Infinity"
                ></el-input-number>
              </template>
              <template v-else-if="item.prop === 'amt'">
                {{ Number(scope.row[item.prop] || 0).toFixed(4) }}
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="total">合计：{{ Number(totalMoney || 0).toFixed(2) }}</div>
    <div class="save-template-box" v-if="modelVisible">
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
        class="demo-ruleForm"
        ref="ruleForm"
        label-width="0"
        :model="modeldata"
        :rules="rules"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="shareLevel">
              <l-formt-title label="模板类型" :required="true">
                <el-select v-model="modeldata.shareLevel" placeholder="请选择">
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
                  placeholder="请输入内容"
                  v-model="modeldata.templetName"
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
                placeholder="请输入内容"
                v-model="modeldata.remark"
                maxlength="100"
                show-word-limit
              ></el-input>
            </l-formt-title>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="allergy-form-btn">
        <el-button
          type="primary"
          v-hotKey="{ func: 'func_save', flag: 'saveTemLoad' }"
          v-loading="saveTemLoad"
          @click="conserve"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import {
  outpatientCisTempinsert,
  historyListExam,
  getListByParamNotDelete,
} from "@/api/electronApply/chargeTemplate";
import { onPreviewData } from "@/utils/print";
import {
  backoutApplyExam,
  applyListPrint,
  applyTreatListPrint,
} from "@/api/electronApply/inspectionApply";
import { getDiaByClinicType } from "@/api/cis/visit/visit";

import { getInfoByEnId } from "@/api/emrRecord/emr/editor.js";

import applyTable from "../mixins/applyTable";
import applStatusShow from "@/views/public/electronApply/component/applStatusShow.vue";
import codes from "@/printTemplete/code.js";

import { getPrintTpl } from "@/api/admin/print/print";
import { print, getPrinterList } from "@/utils/print_new";
import { complier, checkTplNew } from "@/printTemplete/module/checkApplyLodopTpl.js";

import {
  diagPrintModuleParams
} from "@/components/adviceCommon/adviceUtils.js"

import {
  checkApplyTreatmentTpl,
  handlePrintData,
} from "@/printTemplete/module/checkApplyTreatmentTpl.js";

export default {
  name: "CheckApplyTable",
  mixins: [applyTable],
  data() {
    return {
      //表格数据
      selectedList: [],
      totalMoney: 0,
      // 保存模板弹窗默认关闭
      modelVisible: false,
      saveTemLoad: false, // 保存模板loading
      // 提交申请loading标示
      submitLoad: false,
      // 历史申请表格loading
      rightTableLoad: false,
      //待申请当前行
      currentLeftRow: {},
      //检验申请选中记录
      applyList: [],
      patientParam: {},
      //模板数据
      modeldata: {
        shareLevel: "1",
        templetRange: "1",
        templetName: "",
        // templetType: '1',
        remark: "",
      },
      //提交申请form数据
      diagformdata: {
        diagName: "",
        currentProfile: "",
        historyProfile: "",
        physicalExamination: "",
        examPurpose: "",
      },
      selectedParams: [
        {
          prop: "applyCode",
          label: "申请单号",
          width: 150,
        },
        {
          prop: "expectExamTime",
          label: "申请日期",
          width: 150,
        },
        {
          prop: "isUrgent",
          label: "加急",
          width: 80,
        },
        {
          prop: "itemName",
          label: "医嘱名称",
          width: 150,
        },
        {
          prop: "checkMethod",
          label: "检查方法",
          width: 80,
        },
        {
          prop: "amt",
          label: "单价",
          width: 80,
        },
        {
          prop: "quantity",
          label: "次数",
          width: 80,
        },
        {
          prop: "position",
          label: "部位",
          width: 80,
        },
        {
          prop: "applyTypeName",
          label: "检查类型",
          width: 80,
        },
        {
          prop: "execDeptCode",
          label: "执行科室",
          width: 90,
        },
        {
          prop: "deptName",
          label: "申请科室",
          width: 90,
        },
        {
          prop: "roleName",
          label: "申请医生",
          width: 90,
        },
        {
          prop: "status",
          label: "申请状态",
          width: 90,
        },
        {
          prop: "chargeStatus",
          label: "费用状态",
          width: 80,
        } /* ,
        {
          prop: "project",
          label: "报告",
          width: 120
        } */,
      ],
      // 保存模板校验
      rules: {
        templetName: [{ required: true, message: "请输入", trigger: "blur" }],
        remark: [{ required: false, message: "请输入", trigger: "blur" }],
      },
      diagformrules: {
        diagName: [
          { required: true, message: "请输入临床诊断", trigger: "blur" },
        ],
        currentProfile: [
          { required: true, message: "请输入现病史", trigger: "blur" },
        ],
        historyProfile: [
          { required: true, message: "请输入既往史", trigger: "blur" },
        ],
        physicalExamination: [
          { required: true, message: "请输入体格检查", trigger: "blur" },
        ],
        examPurpose: [
          { required: true, message: "请输入检查目的", trigger: "blur" },
        ],
      },
      history: {
        statusList: [
          {
            id: "",
            name: "全部",
          },
          {
            id: "1",
            name: "已申请",
          },
          {
            id: "10",
            name: "已报告",
          },
          {
            id: "99",
            name: "已作废",
          },
        ],
        stageInvert: {
          1: "已申请",
          10: "已报告",
          99: "已作废",
        },
      },
      // 合并医嘱
      RpRowArr: [],
      rpPosition: 0,
      printLoading0: false,
      printLoading1: false,
      printLoading2: false,
      checkTpl: "", //打印检查单模板数据
      treatMentTpl: "", //打印治疗单模板数据
      checkList: ["主诉","现病史","既往史","体格检查","检查目的"], //打印范围
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    checkTxt() {
      return this.applyList
        .map((item) => {
          return item.itemName;
        })
        .join(",");
    },
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val.patientId) {
          return;
        }
        this.setPatientInfo("testApply", {
          ...val,
          patientId: val.patientId,
          type: this.eleTypes,
          id: val.visitCode,
        });
        this.getListByParamNotDelete();
        this.getHistoryApplyList();
      },
    },
  },
  created() {
    let cisCheckApplyData = this.$attrs.cisCheckApplyData;
    this.checkList = cisCheckApplyData.dictionaryValue ? cisCheckApplyData.dictionaryValue.split(",") : ["主诉","现病史","既往史","体格检查","检查目的"];
  },
  components: {
    applStatusShow,
  },
  /**
   *  applicationSub (提交申请校验 )
   * 1.数据处理后，调用提交接口
   *
   * cancelSelect （删除按钮逻辑）
   * 1.数据处理后 弹出confirm
   * 2.在confirm 内 的then 中调用删除申请接口
   * 3.重置相应的数据
   *
   * showRelList （保存模板按钮逻辑）
   * 1.数据处理后展示模板录入模块
   *
   * backout （作废按钮逻辑）
   * 1.对数据进行处理
   * 2.弹窗confirm，then执行调用申请作废接口
   * 3.重置相应数据
   *
   * printClick （打印按钮逻辑）
   * 1.对数据进行处理
   * 2.调用封装的打印方法
   *
   * selectCancelApply (表格check事件)
   * 1.存储选中值
   * 2.计算合计
   *
   * rowClick (表格点击事件)
   * 1.数据处理
   *
   * deptChange （科室数据选择处理）
   *
   * closeSaveTem （关闭模板录入模块）
   *
   * conserve（模板保存按钮逻辑）
   * 1.存为模板相关数据处理后，调用模板保存接口
   *
   * noteInput （注意事项表单录入事件）
   * 1.对表单相应数据处理
   */
  methods: {
    concatTableData(data) {
      this.selectedList = this.selectedList.concat(data);
      this.getRpRowArr();
    },
    //处方合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2) {
        // console.log("RpRowArr::::", this.RpRowArr, rowIndex);
        const _row = this.RpRowArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
      return false;
    },
    //获取处方合并的 list
    getRpRowArr() {
      let tableData = this.selectedList;
      this.rpPosition = 0;
      this.RpRowArr = [];
      tableData.forEach((item, index) => {
        item.index = index;
        if (index === 0) {
          this.RpRowArr.push(1);
        } else {
          if (
            item["applyId"] &&
            item["applyId"] === tableData[index - 1]["applyId"]
          ) {
            this.RpRowArr[this.rpPosition] += 1;
            this.RpRowArr.push(0);
          } else {
            this.RpRowArr.push(1);
            this.rpPosition = index;
          }
        }
      });
    },
    // 关闭保存模板
    closeSaveTem() {
      this.modelVisible = false;
      this.resetFields();
    },
    //表格科室
    deptChange(val, obj) {
      this.$set(this.currentLeftRow, "execDeptName", obj.orgNm);
    },
    // 注意事项表单
    noteInput(val) {
      this.$forceUpdate();
      //未申请数据才能赋值
      if (
        this.currentLeftRow.status !== "" &&
        this.currentLeftRow.status !== undefined
      ) {
        return;
      }
      let vals = val === "" || val === undefined ? "" : val;
      this.$set(this.currentLeftRow, "advicePrompt", vals);
    },
    //查询已申请单
    async getHistoryApplyList() {
      this.$refs.rigTableyApply && this.$refs.rigTableyApply.clearSelection();
      this.selectedList = [];
      this.applyList = [];
      this.currentLeftRow = {};
      if (!this.patientParam.patientId) {
        // this.$message.warning("请选择患者!");
        return;
      }
      try {
        this.rightTableLoad = true;
        let params = {};
        params["patientId"] = this.patientParam.patientId;
        params["visitCode"] = this.receivePatientData.visitCode;
        params["patientType"] = "1"; //this.patientParam.patientSource;
        params["pageSize"] = "300";
        params["pageNo"] = "1";
        let { code, data } = await historyListExam(params);
        if (code == "1") {
          let newData = data.map((item) => {
            return {
              ...item,
              chargeStatus: item.chargeStatus.toString(), //费用状态
            };
          });
          this.selectedList = newData;
          this.getRpRowArr();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.rightTableLoad = false;
      }
    },
    //查询本人诊断等信息
    async getListByParamNotDelete() {
      this.diagformdata.examPurpose = "明确诊断";
      this.diagformdata.diagName = "";
      this.diagformdata.chiefComplaint = "";
      this.diagformdata.currentProfile = "";
      this.diagformdata.historyProfile = "";
      this.diagformdata.physicalExamination = "";
      try {
        let params = {};
        params["patientId"] = this.receivePatientData.patientId;
        params["visitCode"] = this.receivePatientData.visitCode; //this.patientParam.patientSource;
        params["pageSize"] = "100";
        params["pageNo"] = "1";
        if (!params.patientId || params.patientId == "") {
          return;
        }
        let { code: resCode, data: list } = await getListByParamNotDelete(
          params
        );
        if (resCode == "1") {
          // diagName
          this.diagformdata.diagName = list
            .map((item) => item.diagName)
            .join("；");
        }

        let { code, data } = await getInfoByEnId(
          this.receivePatientData.visitCode,
          "01"
        );
        if (code == "1") {
          /* let jws =
            data.paragraph.jws.indexOf("【既往史】") > -1
              ? data.paragraph.jws
              : "【既往史】:" + data.paragraph.jws;
          let xbs =
            data.paragraph.xbs.indexOf("【现病史】") > -1
              ? data.paragraph.xbs
              : "【现病史】:" + data.paragraph.xbs;
          this.diagformdata.currentProfile = this.addHistoryProfile(jws, xbs); */
          // data.paragraph.jws + data.paragraph.xbs;
          // data.paragraph.jws + ";" + "\n" + data.paragraph.xbs;
          this.diagformdata.chiefComplaint = data.paragraph.zs;
          this.diagformdata.historyProfile = data.paragraph.jws;
          this.diagformdata.currentProfile = data.paragraph.xbs;
          this.diagformdata.physicalExamination = data.paragraph.tgjc;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 合并 简要病史 增加换行和分号
    addHistoryProfile(jwss = "", xbss = "") {
      let jws = jwss.trim().replace(/\u200B/g, "");
      let xbs = xbss.trim().replace(/\u200B/g, "");
      // console.log(jws, xbs, 2, Array.from(xbs).length, Array.from(jws).length);
      if (jws.length > 0 && xbs.length > 0) {
        return jws + ";" + "\n" + xbs;
      }

      if (jws.length > 0 && xbs.length == 0) {
        return jws;
      }

      if (xbs.length > 0 && jws.length == 0) {
        return xbs;
      }

      if (xbs.length == 0 && jws.length == 0) {
        return "";
      }
    },
    //表格check事件
    selectCancelApply(val) {
      this.applyList = val;
      this.sumMoney();
    },
    //删除检验申请
    cancelSelect() {
      if (this.applyList.length < 1) {
        this.$message.warning("请选择要删除的申请!");
        return;
      }
      let applyList = this.applyList.filter((item) => {
        return item.status === "" || item.status === undefined;
      });
      if (applyList.length < 1) {
        this.$message.warning("请至少选择一条待申请的数据!");
        return;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        for (let i in this.selectedList) {
          for (let j in applyList) {
            if (this.selectedList[i].id == applyList[j].id) {
              this.$delete(this.selectedList, i);
            }
          }
        }
        this.$refs.rigTableyApply.clearSelection();
        this.applyList = [];
      });
    },
    //点击某一行
    rowClick(row) {
      this.currentLeftRow = row;
      this.$set(this.diagformdata, "advicePrompt", "");
      //未申请数据才能赋值
      if (
        this.currentLeftRow.status !== "" &&
        this.currentLeftRow.status !== undefined
      ) {
        let advicePrompt =
          row.note === "" || row.note === undefined ? "" : row.note;
        this.$set(this.diagformdata, "advicePrompt", advicePrompt);
        return;
      }
      let advicePrompt =
        row.advicePrompt === "" || row.advicePrompt === undefined
          ? ""
          : row.advicePrompt;
      this.$set(this.diagformdata, "advicePrompt", advicePrompt);
    },
    //存为模板弹窗
    showRelList() {
      /* let applyList = this.applyList.filter((item) => {
        return item.status === "" || item.status === undefined;
      });
      if (applyList.length < 1) {
        this.$message.error("请至少选择一条未提交的申请！");
        return;
      } */
      this.modelVisible = true;
    },
    //打印
    printValid(flag) {
      let applyList = [];
      if (flag == 0) {
        if (this.applyList.length < 1) {
          this.$message.warning("请选择记录再进行打印！");
          return false;
        }
        applyList = this.applyList.filter((item) => {
          return (
            item.status !== "" &&
            item.status !== undefined &&
            item.chargeStatus != "3"
          );
        });
        if (applyList.length < 1) {
          this.$message.warning("请至少选择一条已申请记录进行打印！");
          return false;
        }
      } else if (flag == 1) {
        if (this.selectedList.length < 1) {
          this.$message.warning("当前检查申请为空！");
          return false;
        }
        applyList = this.selectedList.filter((item) => {
          return (
            item.status !== "" &&
            item.status !== undefined &&
            item.chargeStatus != "3"
          );
        });
        if (applyList.length < 1) {
          this.$message.warning("当前检查申请为空！");
          return false;
        }
      }
      return applyList;
    },
    async printTreatClick() {
      this.printLoading2 = true;
      let isFlag = this.printValid(0);
      if (!isFlag) {
        this.printLoading2 = false;
        return;
      }
      // 治疗单模板
      /* if (!this.treatMentTpl) {
        let { code, data } = await getPrintTpl(codes.treatMentTpl);
        if (code != 1) {
          this.printLoading2 = false;
          return;
        }
        this.treatMentTpl = data.value;
      } */
      let applyList = isFlag;
      let assayApplyIds = [];
      for (let i in applyList) {
        assayApplyIds.push(applyList[i].applyId);
      }
      assayApplyIds = Array.from(new Set(assayApplyIds));
      let assayApplyIdsStr = assayApplyIds.join(",");
      console.log(assayApplyIdsStr);
      await this.printTreatFunc(assayApplyIdsStr, false);
      /* if (assayApplyIds.length === 1) {
        await this.printTreatFunc(assayApplyIds[0], false);
        return;
      } */
      /* for (let i in assayApplyIds) {
        await this.printTreatFunc(assayApplyIds[i], true);
      } */
    },
    async printTreatFunc(applyId, isPreview) {
      try {
        let { code, data } = await applyTreatListPrint({
          visitCode: this.receivePatientData.visitCode,
          applyIds: applyId,
          patientId: this.receivePatientData.patientId,
          type: "examApply",
        });
        if (code === 1) {
          let printData = handlePrintData({
            ...data[0],
            ...{
              hosName: data[0].hosName + "检查申请单",
            },
            visitCode: this.receivePatientData.patientCode,
          });
          let index = getPrinterList();
          print(index, checkApplyTreatmentTpl, {}, printData, isPreview);
        }
      } catch (error) {
      } finally {
        this.printLoading2 = false;
      }
    },
    async printClick(flag) {
      flag == "0" ? (this.printLoading0 = true) : (this.printLoading1 = true);
      let isFlag = this.printValid(flag);
      if (!isFlag) {
        flag == "0"
          ? (this.printLoading0 = false)
          : (this.printLoading1 = false);
        return;
      }
      // 打印模板数据
      // 检查单模板
      if (!this.checkTpl) {
        // let { code, data } = await getPrintTpl(codes.checkTpl);
        // if (code != 1) {
        //   flag == "0"
        //     ? (this.printLoading0 = false)
        //     : (this.printLoading1 = false);
        //   return;
        // }
        // this.checkTpl = data.value;
        this.checkTpl = checkTplNew;
        // console.log("this.checkTpl", this.checkTpl);
      }
      let applyList = isFlag;
      let assayApplyIds = [];
      for (let i in applyList) {
        assayApplyIds.push(applyList[i].applyId);
      }
      assayApplyIds = Array.from(new Set(assayApplyIds));
      if (assayApplyIds.length === 1) {
        await this.printFunc(assayApplyIds[0], flag, false);
        return;
      }
      for (let i in assayApplyIds) {
        await this.printFunc(assayApplyIds[i], flag, true);
      }
    },
    async printFunc(applyId, flag, isPreview) {
      try {
        let data = {};
        let { code, data: list } = await applyListPrint({
          visitCode: this.receivePatientData.visitCode,
          applyIds: applyId,
          patientId: this.receivePatientData.patientId,
          type: "examApply",
        });
        if (code === 1) {
          data = list;
          // onPreviewData(data, "检查申请单罗");
          let index = getPrinterList();
          let obj = {
            diagHtmlTop: "147.5pt", // 诊断模块 绝对 top 
            diagHtmlHeight: "14pt",// 诊断模块 高度 
            cHtmlLineTop: "165pt",// 诊断 与 药品中间的线的绝对 top 
            contentHtmlTop: "170pt", // 治疗医嘱模块的 绝对 top 
            // MIS_ID: "",
            // settlemetnType: "",
            // patientNum: "",
            // patientGender: "",
            // age: "",
            deptId: "",
            // outpDeptName: "",
            // doctorName: "",
            // diagTime: "",
            // relateAddress: "",
            // relateNum: "",
            // applyNum: "",
            chargpeople: "",
            visitCode: "",
            relateCode: "",
            weight: "",
            diagList: [ { diagList: [{}] }],
            MIS_ID: "",
            settlemetnType: "",
            patientNum: "",
            patientGender: "",
            age: "",
            outpDeptName: "",
            doctorName: "",
            diagTime: "",
            relateAddress: "",
            relateNum: "",
            applyNum: "",

          };
          index = 3; // 默认3 ，便于测试
          // console.log(data, this.checkList);
          // let { htmlStr, diagnoseStr } = complier(data, this.checkList);
          // obj.contentHtml = htmlStr;
          // obj.diagnoseHtml = diagnoseStr;
          obj = {
            ...obj,
            ...data[0],
            ...{
              hosName:
                (data[0].hosName ||
                  JSON.parse(localStorage.getItem("pamars")).hosName ||
                  "") + " 检查申请单",
              orgName:
                data[0].orgName ||
                JSON.parse(localStorage.getItem("pamars")).orgName ||
                "罗湖医院集团",
            },
          };

          // 获取打印诊断 相关参数
          let { diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop, diagNameObj } = diagPrintModuleParams(obj.diagList[0].diagList, { maxLineNum: 4, diagHtmlTop: 147.5, lineHeight: 15 });
          
          obj = {
            ...obj,
            ...{
              diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop,diagNameObj
            }
          }

          let {htmlStr, diagnoseStr} = complier(obj, this.checkList, data);
          obj.contentHtml = htmlStr;
          obj.diagnoseHtml = diagnoseStr;
          console.log(obj)
          print(index, this.checkTpl, {}, obj, isPreview);
        }
      } catch (error) {
        console.log(error);
      } finally {
        flag == "0"
          ? (this.printLoading0 = false)
          : (this.printLoading1 = false);
      }
    },
    //作废申请
    backout() {
      if (this.applyList.length < 1) {
        this.$message.warning("请选择一条数据");
        return;
      }
      let applyList = this.applyList.filter((item) => {
        return (
          item.status !== "" &&
          item.status !== undefined &&
          (item.chargeStatus == "0" || item.chargeStatus == "4")
        );
      });

      // 是否含有已收费的电子申请
      const chargeFlag = this.applyList.some(
        (item) =>
          item.status !== "" &&
          item.status !== undefined &&
          item.chargeStatus == 1
      );

      if (chargeFlag) {
        this.$message.warning("已缴费的电子申请不能作废!");
        return;
      }

      if (applyList.length < 1) {
        this.$message.warning("请至少选择一条已申请数据进行申请作废！");
        return;
      }
      if (applyList.length > 20) {
        this.$message.warning("申请作废的数据不可超过20条");
        return;
      }

      this.$confirm("", "", {
        showClose: "false",
        confirmButtonText: "作废",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: "true",
        message:
          "<div>作废申请</div><p><span>作废后无法恢复,</span>你要继续吗？</p>",
        type: "warning",
      })
        .then(async () => {
          let ids = applyList.map((item) => item.orderId).join(",");
          console.log("backout-applyList", applyList);
          let params = {
            id: ids,
          };
          let { code, msg } = await backoutApplyExam(params);
          if (code == 1) {
            this.$message({
              type: "success",
              message: "作废成功!",
            });
            this.getHistoryApplyList();
          } else {
            this.$message.error(msg || "作废失败");
          }
        })
        .catch((err) => {
          if (err.msg) {
            this.$message({
              type: "error",
              message: err.msg || "作废失败，请联系管理员！",
            });
          }
        });
    },
    //保存模板
    conserve() {
      let applyList = this.applyList;
      /* let applyList = this.applyList.filter((item) => {
        return item.status === "" || item.status === undefined;
      }); */
      if (applyList.length < 1) {
        this.$message.warning("请选择至少一条医嘱信息！");
        return;
      }
      let outpatientCisTempDetails = [];
      for (let i = 0; i < applyList.length; i++) {
        let item = {
          deptName: this.$store.state.user.role.deptName,
          itemId: applyList[i].itemId,
          itemCat: "5", //applyList[i].itemCat, // 检验8，检查5
          itemName: applyList[i].itemName,
          price: applyList[i].amt,
          amt: applyList[i].amt, //
          atm: this.totalMoney,
          urgent: applyList[i].isUrgent2 || "0",

          bodyPartsName:
            applyList[i].status !== undefined
              ? applyList[i].bodyPartsCode
              : applyList[i].position, // 部位
          checkMethod: applyList[i].checkMethod, // 检查方法

          sampleTypeName:
            applyList[i].status !== undefined
              ? applyList[i].sampleTypeCode
              : applyList[i].specimen,
          sampleTypeCode:
            applyList[i].status !== undefined
              ? applyList[i].sampleTypeCode
              : applyList[i].specimen,

          applyTypeName: applyList[i].applyTypeName,

          AppSection: this.$store.state.user.role.deptName,

          formCode: applyList[i].formCode,
          quantity: "1",
          unit: applyList[i].unit,
        };
        outpatientCisTempDetails.push(item);
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            templetName: this.modeldata.templetName,
            templetRange: this.modeldata.templetRange,
            shareLevel: this.modeldata.shareLevel,
            templetType: "5", //this.modeldata.templetType,// 检验 8， 检查5
            remark: this.modeldata.remark,
            deptId: "",
            outpatientCisTempDetails: outpatientCisTempDetails,
          };

          this.saveTemLoad = true;
          outpatientCisTempinsert(data)
            .then((res) => {
              if (res.code === 1) {
                this.modelVisible = false;
                this.$emit("loadTable");
                this.$emit("loadGeRenTable");
                this.resetFields();
                this.$message.success("保存模板成功！");
              } else {
                this.$message.error(res.msg || "保存模板失败");
              }
            })
            .catch((e) => {
              console.log(e);
            })
            .finally(() => {
              this.saveTemLoad = false;
            });
        }
      });
    },
    // 替换 病史中的 换行和分号
    replaceHistoryProfile(profile) {
      return profile.replace(/;\n/g, "");
    },
    getNewSelectedList() {
      let selectedList = this.selectedList.filter((item) => {
        return item.status === "" || item.status === undefined;
      });
      return selectedList;
    },
    //提交申请校验
    async applicationSub() {
      return new Promise(async (resolve, reject) => {
        this.submitLoad = true;
        // 1.是否选择了患者
        if (!this.patientParam.patientId) {
          this.$message.warning("请先选择患者，再开申请单!");
          this.submitLoad = false;
          reject(false);
          return;
        }
        // 2.是否有诊断校验
        let { code, data } = await getDiaByClinicType({
          visitCode: this.receivePatientData.visitCode,
        });
        if (code === 1 && data.length === 0) {
          this.$message.warning(
            "当前患者还没有诊断，请开诊断之后才能提交申请！"
          );
          this.submitLoad = false;
          reject(false);
          return;
        }
        //3.检查申请数量区间是否1~20
        let selectedList = this.selectedList.filter((item) => {
          return item.status === "" || item.status === undefined;
        });

        if (selectedList.length < 1) {
          this.$message.warning("请选择要申请的医嘱!");
          this.submitLoad = false;
          reject(false);
          return;
        }
        if (selectedList.length > 20) {
          this.$message.warning("申请的数据不可超过20条!");
          this.submitLoad = false;
          reject(false);
          return;
        }
        if (this.diagformdata.diagName == "") {
          this.$message.warning("请填写临床诊断!");
          this.submitLoad = false;
          reject(false);
          return;
        }
        let submitData = [];
        selectedList.forEach((item) => {
          item.isUrgent = item.isUrgent2 || "0";
          item.sampleTypeCode = item.specimen;
          item.patientId = this.patientParam.patientId;
          item.patientType = "1";
          item.visitId = this.receivePatientData.appointmentId;
          item.visitCode = this.patientParam.id;
          item.diagName = this.diagformdata.diagName;
          item.currentProfile = this.replaceHistoryProfile(
            this.diagformdata.currentProfile
          );
          item.historyProfile = this.replaceHistoryProfile(
            this.diagformdata.historyProfile
          );
          item.chiefComplaint = this.diagformdata.chiefComplaint;
          item.physicalExamination = this.diagformdata.physicalExamination;
          item.examPurpose = this.diagformdata.examPurpose;
          item.freeFlag = this.diagformdata.freeFlag;
          item.bodyPartsCode = item.position; //部位
          item.note = item.advicePrompt; //注意事项
          submitData.push(item);
        });
        console.log("submitData", submitData);
        try {
          await this.saveApplyFunc(submitData);
          resolve(true);
        } catch (error) {
          reject(true);
        }
      });
    },
    // 表单强制刷新
    diagformChange() {
      this.$forceUpdate();
    }
  },
};
</script>

<style lang="scss" scoped>
.flex-column-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
