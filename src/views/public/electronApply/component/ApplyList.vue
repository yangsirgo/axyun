<template>
  <div class="flex-column-box height100">
    <div class="handle-btn-box">
      <el-button
        class="filter-item iconfont icontijiao1"
        @click="applicationSub()"
        type="text"
        v-hotKey="{ func: 'func_submit' }"
        :loading="submitLoad"
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
      <el-button
        class="filter-item iconfont iconzuofei"
        @click="backout()"
        type="text"
        >&nbsp;作废</el-button
      >
      <el-button
        class="filter-item iconfont icondayin"
        type="text"
        @click="printClick(0)"
        v-hotKey="{ func: 'func_print' }"
        :loading="printLoading0"
        >&nbsp;打印</el-button
      >
      <el-button
        class="filter-item iconfont icondayin"
        type="text"
        @click="printClick(1)"
        v-hotKey="{ func: 'func_print' }"
        :loading="printLoading1"
        >&nbsp;全部打印</el-button
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
          align="center"
          width="55"
          name="duoxuan"
          type="selection"
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
              <template v-else-if="item.prop === 'specimen'">
                <span
                  class="sample"
                  :val="scope.row.sampleTypeCode"
                  code="InspectSpecimen"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop === 'isUrgent'">
                <el-tag
                  v-if="scope.row.isUrgent"
                  type="danger"
                  disable-transitions
                  size="medium"
                  >加急</el-tag
                >
                <span v-else></span>
              </template>
              <template v-else-if="item.prop === 'status'">
                <span class="state-color">
                  <!-- <span v-if="scope.row.status">{{
                    history.stageInvert[scope.row.status]
                  }}</span>
                  <span v-else>全部</span> -->
                  <applStatusShow
                    aType="检验"
                    :patientObj="receivePatientData"
                    :aStatus="scope.row.status"
                  ></applStatusShow>
                </span>
              </template>
              <template v-else-if="item.prop === 'chargeStatus'">
                <span
                  :val="scope.row.chargeStatus || ''"
                  code="ChargeStatus"
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
                <!-- {{ scope.row["amt"] ? scope.row["amt"].toFixed(4) : "0.0000" }} -->
                {{ Number(scope.row[item.prop] || 0).toFixed(4) }}
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
            <template v-else>
              <!-- 未申请 -->
              <template v-if="item.prop === 'isUrgent'">
                <el-checkbox
                  name="jiaji"
                  v-model="scope.row.isUrgent2"
                  true-label="1"
                  false-label="0"
                ></el-checkbox>
              </template>
              <template v-else-if="item.prop === 'specimen'">
                <l-value-domain
                  code="InspectSpecimen"
                  :value.sync="scope.row.specimen"
                  placeholder="请选择"
                ></l-value-domain>
              </template>
              <template v-else-if="item.prop === 'execDeptCode'">
                <div @click.capture="rowClick(scope.row)">
                  <l-value-domain
                    :value.sync="scope.row.execDeptCode"
                    remoteUrl="/admin/wadmin/hos/dept"
                    :remoteParams="{}"
                    remoteShowKey="orgNm"
                    remoteValueKey="id"
                    placeholder="请选择科室"
                    @change="deptChange"
                  />
                </div>
              </template>
              <template v-else-if="item.prop === 'quantity'">
                <el-input-number v-model="scope.row[item.prop]" class="width100" :controls="false" :step="1" step-strictly :min="1" :max="Infinity"></el-input-number>
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
                placeholder="请输入内容"
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
          @click="conserve"
          v-hotKey="{ func: 'func_save', flag: 'saveTemLoad' }"
          v-loading="saveTemLoad"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { onPreviewData } from "@/utils/print";
import { outpatientCisTempinsert } from "@/api/electronApply/chargeTemplate";
import {
  backoutApply,
  applyPrint,
  applyListPrint
} from "@/api/electronApply/inspectionApply";
import { getDiaByClinicType } from "@/api/cis/visit/visit";
import { getRole } from "@/utils/auth";
import { onPreview } from "@/utils/print";

import ApplyList from "../mixins/ApplyList";
import applStatusShow from "@/views/public/electronApply/component/applStatusShow.vue";
import codes from "@/printTemplete/code.js";
import { getPrintTpl } from "@/api/admin/print/print";
import { print, getPrinterList } from "@/utils/print_new"
import { complier, applyPrintTpl } from "@/printTemplete/module/testApplyLodopTpl.js"
import { deepClone } from "@/utils/index.js";
import {
  diagPrintModuleParams
} from "@/components/adviceCommon/adviceUtils.js"

export default {
  name: "applyList",
  mixins: [ApplyList],
  data() {
    const checkNameLength = (rule, value, callback) => {
      if (value.length > 25) {
        this.$message.warning("长度不能超过25个字");
        callback(new Error("长度不能超过25个字"));
      } else if (value.length === 0) {
        this.$message.warning("不能为空");
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    return {
      //表格数据
      selectedList: [],
      selectedParams: [
        {
          prop: "applyCode",
          label: "申请单号",
          width: 150
        },
        {
          prop: "expectExamTime",
          label: "申请日期",
          width: 150
        },
        {
          prop: "isUrgent",
          label: "加急",
          width: 80
        },
        {
          prop: "itemName",
          label: "医嘱名称",
          width: 150
        },
        {
          prop: "specimen",
          label: "标本",
          width: 100
        },
        {
          prop: "amt",
          label: "单价",
          width: 80
        },
        {
          prop: "quantity",
          label: "次数",
          width: 80
        },
        /* {
          prop: "applyTypeName",
          label: "检验类型",
          width: 80
        }, */
        {
          prop: "execDeptCode",
          label: "执行科室",
          width: 90
        },
        {
          prop: "deptName",
          label: "申请科室",
          width: 90
        },
        {
          prop: "roleName",
          label: "申请医生",
          width: 90
        },
        {
          prop: "status",
          label: "申请状态",
          width: 90
        },
        {
          prop: "chargeStatus",
          label: "费用状态",
          width: 80
        } /* ,
        {
          prop: "project",
          label: "报告",
          width: 120
        } */
      ],
      //合计
      totalMoney: 0,
      //模板数据
      modeldata: {
        shareLevel: "1",
        templetRange: "1",
        templetName: "",
        remark: ""
      },
      // 保存模板校验
      rules: {
        templetName: [
          {
            validator: checkNameLength,
            required: true,
            message: "请输入",
            trigger: "click"
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
      // 保存模板弹窗默认关闭
      modelVisible: false,
      // 当前患者信息
      patientParam: {},
      //检验申请选中记录
      applyList: [],
      // 提交申请loading标示
      submitLoad: false,
      // 保存模板loading
      saveTemLoad: false,
      // 历史申请表格loading
      rightTableLoad: false,
      //提交申请的表单
      diagformdata: {},
      //待申请当前行
      currentLeftRow: {},
      chargeListLoading: false,
      //搜索条件
      history: {
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
      // 合并医嘱
      RpRowArr: [],
      rpPosition: 0,
      // 打印loading
      printLoading0: false,
      printLoading1: false,
      checkTpl: ""
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    // 模板已选项目
    checkTxt() {
      return this.applyList
        .map(item => {
          return item.itemName;
        })
        .join(",");
    },
    //检查检验类型
    eleTypes() {
      return this.$attrs.elecType;
    },
    //默认执行科室
    defaultDeptId() {
      return JSON.parse(getRole()).deptId;
    }
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val.patientId) {
          return;
        }
        //重置某些项
        this.setPatientInfo("testApply", {
          ...val,
          patientId: val.patientId,
          type: this.eleTypes,
          id: val.visitCode
        });
        this.getHistoryApplyList();
      }
    }
  },
  components: {
    applStatusShow
  },
  /**
   * 一级事件
   * 1.注意事项输入事件(noteInput){将编辑好的注意事项添加到当前行数据中，并且只有未申请数据才可以赋值}
   * 2.科室选择框改变事件(deptChange){将科室名称添加到当前行数据中}
   * 3.提交申请按钮(applicationSub){1.对提交的数据进行校验；2.提交申请接口}
   * 4.删除申请按钮(cancelSelect){1.对删除的数据进行校验；2.直接删除表格中数据}
   * 5.作废申请按钮(backout){1.对作废的数据进行校验；2.作废申请接口}
   * 6.打印申请按钮(printClick){1.对打印的数据进行校验；2.执行打印方法}
   * 7.点击表格行事件(rowClick){1.设置全局当前行变量；2.表格上方表单显示当前行注意事项内容}
   * 8.表格多选事件(selectCancelApply){1.设置全局当前多选数据变量；2.计算总价}
   * 9.保存模板按钮事件(showRelList){打开模板弹窗}
   * 10.确认保存模板按钮事件(conserve){1.数据校验与数据修正；2.保存模板接口}
   * 11.关闭模板弹窗事件(closeSaveTem){1.清空模板表单数据；2.关闭模板弹框}
   */
  methods: {
    //获取未提交的表格数据  
    getNewSelectedList (){
      console.log("执行了4");
      let selectedList = this.selectedList.filter(item => {
        return item.status === "" || item.status === undefined;
      });
      return selectedList;
    },
    //处方合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2) {
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
    //获取处方合并的 list
    getRpRowArr() {
      // this.selectRefresh = false;
      let tableData = this.selectedList;
      this.rpPosition = 0;
      this.RpRowArr = [];
      tableData.forEach((item, index) => {
        item.index = index;
        if (index === 0) {
          this.RpRowArr.push(1);
        } else {
          if (item["assayApplyId"] && item["assayApplyId"] === tableData[index - 1]["assayApplyId"]) {
            this.RpRowArr[this.rpPosition] += 1;
            this.RpRowArr.push(0);
          } else {
            this.RpRowArr.push(1);
            this.rpPosition = index;
          }
        }
      });
      /* this.$nextTick(() => {
        this.selectRefresh = true;
      }); */
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
    //表格科室
    deptChange(val, obj) {
      this.$set(this.currentLeftRow, "execDeptName", obj.orgNm);
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
      let rep = await getDiaByClinicType({
        visitCode: this.patientParam.visitCode
      });
      if (rep.code === 1 && rep.data.length === 0) {
        this.$message.warning("当前患者还没有诊断，请开诊断之后才能提交申请！");
        this.submitLoad = false;
        reject(false);
        return;
      }
      //3.检查申请数量区间是否1~20
      let selectedList = this.selectedList.filter(item => {
        return item.status === "" || item.status === undefined;
      });

      if (selectedList.length < 1) {
        this.$message.warning("请选择要申请的医嘱!");
        this.submitLoad = false;
        reject(false);
        return;
      }
      if (selectedList.length > 20) {
        this.$message.warning("申请的数据不可超过20条");
        this.submitLoad = false;
        reject(false);
        return;
      }
      let submitData = [];
      selectedList.forEach(item => {
        item.isUrgent = item.isUrgent2 || "0";
        item.sampleTypeCode = item.specimen;
        item.patientId = this.patientParam.patientId;
        item.patientType = "1";
        item.visitId = this.patientParam.appointmentId;
        item.visitCode = this.patientParam.id;
        item.freeFlag = this.diagformdata.freeFlag;
        item.note = item.advicePrompt; //注意事项
        submitData.push(item);
      });
      console.log("applicationSub-submitData", submitData);
      
        try {
          await this.saveApplyFunc(submitData);
          resolve(true);
        } catch (error) {
          reject(false);
        }
      })
    },
    //删除检验申请
    cancelSelect() {
      if (this.applyList.length < 1) {
        this.$message.warning("请选择要删除的申请!");
        return;
      }
      let applyList = this.applyList.filter(item => {
        return item.status === "" || item.status === undefined;
      });
      if (applyList.length < 1) {
        this.$message.warning("请至少选择一条待申请的数据!");
        return;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        for (let j in applyList) {
          for (let i in this.selectedList) {
            if (this.selectedList[i].id == applyList[j].id) {
              this.$delete(this.selectedList, i);
              break;
            }
          }
        }
        this.$refs.rigTableyApply.clearSelection();
        this.applyList = [];
      });
    },
    //作废申请
    backout() {
      if (this.applyList.length < 1) {
        this.$message.warning("请至少选择一条数据！");
        return;
      }

      // 是否含有已收费的电子申请
      const chargeFlag = this.applyList.some(item=> item.status !== "" &&
          item.status !== undefined && item.chargeStatus == 1 );

      if(chargeFlag){
        this.$message.warning("已缴费的电子申请不能作废!");
        return;
      }


      let applyList = this.applyList.filter(item => {
        return (
          item.status !== "" &&
          item.status !== undefined &&
          (item.chargeStatus == "0" || item.chargeStatus == "4")
        );
      });

      if (applyList.length < 1) {
        this.$message.warning("请至少选择一条已申请数据进行申请作废！");
        return;
      }
      if (applyList.length > 20) {
        this.$message.warning("申请作废的数据不可超过20条！");
        return;
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
          let id = applyList.map(item => item.orderId).join(",");
          let params = {
            id
          };
          let result = await backoutApply(params);
          if (result.code == 1) {
            this.$message({
              type: "success",
              message: "作废成功!"
            });
            await this.getHistoryApplyList();
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
    printValid(flag) {
      let applyList = [];
      if(flag == 0) {
        if (this.applyList.length < 1) {
          this.$message.warning("请选择记录再进行打印！");
          return false;
        }
        applyList = this.applyList.filter(item => {
          return item.status !== "" && item.status !== undefined && item.chargeStatus != "3";
        });
        if (applyList.length < 1) {
          this.$message.warning("请至少选择一条已申请记录进行打印！");
          return false;
        }
      } else if (flag == 1) {
        if (this.selectedList.length < 1) {
          this.$message.warning("当前检验申请为空！");
          return false;
        }
        applyList = this.selectedList.filter(item => {
          return item.status !== "" && item.status !== undefined && item.chargeStatus != "3";
        });
        if (applyList.length < 1) {
          this.$message.warning("当前检验申请为空！");
          return false;
        }
      }
      return applyList;
    },
    async printClick(flag) {
      flag == "0" ? this.printLoading0 = true : this.printLoading1 = true;
      let isFlag = this.printValid(flag);
      if (!isFlag) {
        flag == "0" ? this.printLoading0 = false : this.printLoading1 = false;
        return;
      }
      // 打印模板数据
      if (!this.checkTpl) {
      //  let {code, data} = await getPrintTpl(codes.testTpl);
      //   if(code != 1) return;
      //   this.checkTpl = data.value;
        this.checkTpl = applyPrintTpl;
      }
      let applyList = isFlag;
      let assayApplyIds = [];
      for(let i in applyList) {
        assayApplyIds.push(applyList[i].assayApplyId)
      }
      assayApplyIds = Array.from(new Set(assayApplyIds));
      if(assayApplyIds.length === 1) {
        await this.printFunc(assayApplyIds[0], flag, false);
        return;
      }
      for(let i in assayApplyIds) {
        await this.printFunc(assayApplyIds[i], flag, true);
      }
    },
    async printFunc(assayApplyId, flag, isPreview) {
      try {
        let res = await applyListPrint({
        visitCode: this.patientParam.visitCode,
        applyIds: assayApplyId,
        patientId: this.patientParam.patientId,
        type: "essayApply"
      });
      if (res.code === 1) {
        let datas = res.data;
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
          totalFee: ""
        };
        index = 3; // 默认3 ，便于测试
        // let {htmlStr, diagnoseStr} = complier(datas);
        // obj.contentHtml = htmlStr;
        // obj.diagnoseHtml = diagnoseStr;
        obj = {
          ...obj,
          ...datas[0],
          ...{
            hosName: (datas[0].hosName || JSON.parse(localStorage.getItem("pamars")).hosName || "") + " 检验申请单",
            orgName: datas[0].orgName || JSON.parse(localStorage.getItem("pamars")).orgName || "罗湖医院集团"
          },
        }

        // 获取打印诊断 相关参数
        let { diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop, diagNameObj } = diagPrintModuleParams(obj.diagList[0].diagList, { maxLineNum: 4, diagHtmlTop: 149.5, lineHeight: 15 });
        
        obj = {
          ...obj,
          ...{
            diagHtmlTop, diagHtmlHeight, cHtmlLineTop, contentHtmlTop,diagNameObj
          }
        }

        let {htmlStr, diagnoseStr} = complier(obj, datas);
        obj.contentHtml = htmlStr;
        obj.diagnoseHtml = diagnoseStr;


       console.log(obj)
        print(index, this.checkTpl, {}, obj, isPreview);
      }
      } catch (error) {
        
      } finally {
        flag == "0" ? this.printLoading0 = false : this.printLoading1 = false;
      }
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
    //表格check事件
    selectCancelApply(val) {
      this.applyList = val;
      this.sumMoney();
    },
    //存为模板弹窗
    showRelList() {
      /* let applyList = this.applyList.filter(item => {
        return item.status === "" || item.status === undefined;
      });
      if (applyList.length < 1) {
        this.$message.error("请至少选择一条未提交的申请！");
        return;
      } */
      this.modelVisible = true;
    },
    //保存模板
    conserve() {
      /* let applyList = this.applyList.filter(item => {
        return item.status === "" || item.status === undefined;
      }); */
      let applyList = this.applyList;
      if (applyList.length < 1) {
        this.$message.warning("请选择至少一条医嘱信息！");
        return;
      }
      let outpatientCisTempDetails = [];
      applyList.forEach(item => {
        let obj = {
          deptName: this.$store.state.user.role.deptName,
          itemId: item.itemId,
          itemCat: "6", //item.itemCat, // 检验6，检查5
          itemName: item.itemName,
          price: item.amt,
          amt: item.amt, //单价
          atm: this.totalMoney,
          urgent: item.isUrgent2 || "0",
          sampleTypeName: item.status !== undefined ? item.sampleTypeCode : item.specimen,
          sampleTypeCode: item.status !== undefined ? item.sampleTypeCode : item.specimen,
          specimen: item.status !== undefined ? item.sampleTypeCode : item.specimen,
          applyTypeName: item.applyTypeName,
          formCode: item.formCode,
          quantity: "1",
          unit: item.unit
        };
        outpatientCisTempDetails.push(obj);
      });
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = {
            templetName: this.modeldata.templetName,
            templetRange: this.modeldata.templetRange,
            shareLevel: this.modeldata.shareLevel,
            templetType: "6", // this.modeldata.templetType,// 检验 8， 检查5
            remark: this.modeldata.remark,
            deptId: "",
            outpatientCisTempDetails
          };

          this.saveTemLoad = true;
          outpatientCisTempinsert(data)
            .then(res => {
              if (res.code === 1) {
                this.modelVisible = false;
                this.$emit("loadTable");
                this.$emit("loadGeRenTable");
                this.$refs.ruleForm.resetFields();
                this.$message.success("保存模板成功！");
              } else {
                this.$message.error(res.msg || "保存模板失败");
              }
            })
            .catch(e => {
              console.log(e);
            })
            .finally(() => {
              this.saveTemLoad = false;
            });
        }
      });
    },
    //关闭保存模板
    closeSaveTem() {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      this.modelVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
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
/* /deep/.el-table .freeRpRow {
  color: green;
} */
.total {
  margin-top: 8px;
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
</style>
