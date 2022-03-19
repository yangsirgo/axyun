<template>
  <el-card class="Rp-bottom-card">
    <div class="wrapper">
      <LInputTable
        ref="LInputTable"
        id="bottomFormInputTable"
        :popoverWidth="1000"
        v-model="autoComIpt"
        suffix-icon="el-icon-search"
        style="width: 200px"
        :tableData="selectDrop.selectOptions"
        @query="search"
        @select="select"
        :tableParams="selectDrop.dropColumn"
        placeholder="请输入项目名称关键字"
      ></LInputTable>
      <div class="display-list">
        <div
          v-for="item in selectDrop.displayList"
          tableLoading="true"
          class="display-list-item"
          :key="item.title"
        >
          <span class="title">{{ item.title }}</span>
          <template v-if="item.prop == 'price' || item.prop == 'amt'">
            <span>{{ new Number(item.value).toFixed(4) }}元</span>
          </template>
          <template v-else>
            <span class="value">
              {{ item.value != "" ? item.value : "--" }}
            </span>
          </template>
        </div>
      </div>
      <div class="RpCls">
        <!--<div class="RpClsTitle">-->
        <!--处方设置-->
        <!--</div>-->
        <div style="margin-top: 10px">
          <el-form
            :model="selectDrop.ruleForm"
            :rules="selectDrop.rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label prop="onceDosage">
              <l-formt-title label="单次剂量" :required="true">
                <!--<el-input-->
                <!--ref="onceDosage"-->
                <!--v-model="selectDrop.ruleForm.onceDosage">-->
                <!--<template-->
                <!--slot="append"-->
                <!--&gt;<span :val="selectDrop.ruleForm.dosageUnit" code="DrugDoseUnit" v-codeTransform></span></template>-->
                <!--</el-input>-->
                <el-input-number
                  ref="onceDosage"
                  class="onceDosageInput"
                  v-model="selectDrop.ruleForm.onceDosage"
                  :precision="4"
                  step-strictly
                  :step="Number(onceDosageControl.step)"
                  :min="Number(onceDosageControl.min)"
                  :controls="false"
                ></el-input-number>
                <span
                  :val="selectDrop.ruleForm.dosageUnit"
                  code="DrugDoseUnit"
                  style="
                    position: relative;
                    left: -40px;
                    width: 30px;
                    text-align: right;
                    display: inline-block;
                    line-height: 35px;
                    vertical-align: 1px;
                  "
                  v-codeTransform
                ></span>
              </l-formt-title>
            </el-form-item>
            <el-form-item label prop="quantity" v-if="isQuantityShow">
              <l-formt-title label="数量" style="width: 60%" :required="true">
                <el-input-number
                  size="medium"
                  v-model.number="selectDrop.ruleForm.basicDosage"
                  @change="computeAmt"
                  step-strictly
                  :controls="false"
                ></el-input-number>
              </l-formt-title>
              <el-select
                v-model="selectDrop.ruleForm.basicDosageUnit"
                placeholder="单位"
                style="width: 66px; vertical-align: top"
                @change="unitChange"
              >
                <el-option
                  v-for="item in selectDrop.unitOptions"
                  :label="item.label"
                  :key="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label prop="uses">
              <l-formt-title label="用法" :required="true">
                <l-value-domain
                  code="MedicationRouteCode"
                  remoteShowKey="name"
                  remoteValueKey="code"
                  @change="handleUseWay"
                  :value.sync="selectDrop.ruleForm.uses"
                  placeholder="请选择"
                ></l-value-domain>
              </l-formt-title>
            </el-form-item>
            <el-form-item label prop="frequency">
              <l-formt-title
                label="频次"
                :required="true"
                :disabled="isFrequencyDisabled"
              >
                <!-- <l-value-domain
                  :disabled="isFrequencyDisabled"
                  code="dd"
                  remoteUrl="/frequency/pageList"
                  :remoteParams="remoteParams"
                  :value.sync="selectDrop.ruleForm.frequency"
                  placeholder="请选择频次"
                  remoteShowKey="frequencyName"
                  remoteValueKey="frequencyCode"
                  @change="handleFreq"
                  clearable
                ></l-value-domain>-->
                <el-select
                  v-model="selectDrop.ruleForm.frequency"
                  :disabled="isFrequencyDisabled"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择频次"
                  :remote-method="getFrequency"
                  :loading="frequencyLoad"
                  @change="handleFreq"
                  @focus="freqFocus"
                  clearable
                >
                  <el-option
                    v-for="item in frequencyOptions"
                    :key="item.frequencyCode"
                    :label="item.frequencyName"
                    :value="item.frequencyCode"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-form-item>
            <el-form-item label prop="skinTest" class="skinTest">
              <el-checkbox
                v-model="selectDrop.ruleForm.skinTest"
                true-label="1"
                false-label="0"
                >皮试</el-checkbox
              >
            </el-form-item>
            <el-form-item label prop="isUrgent" class="skinTest">
              <el-checkbox
                v-model="selectDrop.ruleForm.isUrgent"
                true-label="1"
                false-label="0"
                >紧急</el-checkbox
              >
            </el-form-item>
            <!--  <el-form-item label prop="isOneself" class="skinTest">
              <el-checkbox v-model="selectDrop.ruleForm.isOneself" true-label="1" false-label="0">自备</el-checkbox>
            </el-form-item>
            <el-form-item style="width:82px" label prop="takeMedicine" class="skinTest">
              <el-checkbox
                v-model="selectDrop.ruleForm.takeMedicine"
                true-label="1"
                false-label="0"
              >取药医嘱</el-checkbox>
            </el-form-item>-->

            <el-form-item
              v-if="radioType != '3' && radioType != '2'"
              label
              prop="prn"
              class="skinTest"
            >
              <el-checkbox
                v-model="selectDrop.ruleForm.prn"
                true-label="1"
                false-label="0"
                >prn</el-checkbox
              >
            </el-form-item>
            <el-form-item
              v-if="radioType != '1' && radioType != '3'"
              label
              prop="sos"
              class="skinTest"
            >
              <el-checkbox
                v-model="selectDrop.ruleForm.sos"
                true-label="1"
                false-label="0"
                >sos</el-checkbox
              >
            </el-form-item>
            <el-form-item label prop="remark">
              <l-formt-title label="备注">
                <el-select
                  v-model="selectDrop.ruleForm.remark"
                  placeholder="请选择"
                >
                  <el-option label="自备" value="1"></el-option>
                  <el-option label="取药医嘱" value="2"></el-option>
                </el-select>
              </l-formt-title>
            </el-form-item>
            <el-form-item
              v-if="selectDrop.ruleForm.uses === '404'"
              label
              prop="flowRate"
              class="flowRate"
            >
              <l-formt-title label="滴速">
                <el-input
                  size="medium"
                  v-model="selectDrop.ruleForm.dropRate"
                  step-strictly
                  :controls="false"
                ></el-input>
              </l-formt-title>
            </el-form-item>
            <el-form-item label prop="setDrugsTime">
              <l-formt-title label="嘱托">
                <el-input v-model="selectDrop.ruleForm.entrust"></el-input>
              </l-formt-title>
            </el-form-item>
            <el-form-item label prop="adviceTime" class="date-picker">
              <l-formt-title label="开始日期" :required="true">
                <el-date-picker
                  v-model="selectDrop.ruleForm.adviceTime"
                  type="datetime"
                  :picker-options="pickerOptionsStart"
                  prefix-icon="aaa"
                  @change="startDoctorTimeChange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                ></el-date-picker>
              </l-formt-title>
            </el-form-item>
            <el-form-item label prop="stopDoctorTime" class="date-picker">
              <l-formt-title label="停止日期">
                <el-date-picker
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="selectDrop.ruleForm.stopDoctorTime"
                  :picker-options="pickerOptionsEnd"
                  type="datetime"
                  prefix-icon="aaa"
                  placeholder="选择日期"
                ></el-date-picker>
              </l-formt-title>
            </el-form-item>

            <el-form-item label prop="firstDayCount">
              <l-formt-title label="首日次数">
                <el-input
                  v-model="selectDrop.ruleForm.firstDayCount"
                ></el-input>
              </l-formt-title>
            </el-form-item>
            <!-- <el-form-item label prop="remarks">
              <l-formt-title label="备注">
                <el-input v-model="selectDrop.ruleForm.remark"></el-input>
              </l-formt-title>
            </el-form-item>-->
            <el-form-item class="fr" style="text-align: right">
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
                class="button"
                v-hotKey="{ func: 'func_save' }"
                >保 存</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!--  <el-dialog title="超量原因" :visible.sync="overReason" width="470px">
        <el-form ref="overReasonForm" :model="overReasonForm" class="padding20">
          <el-form-item label="超量原因" label-width="100px" prop="reason"
                        :rules="{ required: true, message: '请输入超量原因', trigger: 'blur' }">
            <el-input v-model="overReasonForm.reason" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="overReason = false">取 消</el-button>
          <el-button type="primary" @click="overReasonConfirm('overReasonForm')">确 定</el-button>
        </div>
    </el-dialog>-->
    <!--<el-button @click.native="overReason = true">tesxst</el-button>-->
  </el-card>
</template>

<script>
import {
  getRecipeNo,
  saveOrders,
  getFirstDayCount
} from "@/api/cis/order/order";
import { temporary, getAdviceItem } from "@/api/cis/resident/residentAdvice";
import { mapActions, mapGetters } from "vuex";
import { getArrayList } from "@/api/wconf/wparam";
import { get } from "@/utils/request";

let startDoctorTime = ""; // 开始日期 的锚点 变量

export default {
  name: "bottomForm",
  props: ["row", "radioValue"],
  data() {
    return {
      radioType: "1", // 医嘱状态
      onceDosageControl: {
        step: 0.0001,
        min: 0
      },
      isQuantityShow: true, // 数量 在 长期 下隐藏 在短期和出院带药下必填
      isFrequencyDisabled: false, //频率 在 短期的情况下禁用
      currentRowData: this.row,
      overReason: false, //超量原因弹窗
      patientId: "",
      patientName: "",
      bedNo: "",
      inpCode: "",
      remoteParams: { pageSize: 10 },
      overReasonForm: {
        reason: ""
      },
      autoComIpt: "",
      // 分页数据
      currentPage: 1,
      pageSize: 5,
      total: 1,
      queryName: "",
      selectDrop: {
        drugItem: {}, // 选中医嘱信息
        displayList: [
          {
            title: "药品名称",
            prop: "name",
            value: ""
          },
          {
            title: "规格",
            prop: "spec",
            value: ""
          },
          {
            prop: "price",
            title: "单价",
            value: 0
          },
          {
            prop: "dosage",
            title: "剂量",
            value: ""
          },

          {
            prop: "execDeptName",
            title: "执行科室",
            value: ""
          },
          {
            prop: "stockNum",
            title: "库存",
            value: ""
          },
          {
            prop: "stockNum",
            title: "预减库存",
            value: ""
          }
        ],
        unitOptions: [],

        ruleForm: {
          prn: "",
          sos: "",
          takeMedicine: "0",
          firstDayCount: "",
          patientId: "",
          dataVersion: "",
          adviceId: "",
          uses: "", //用法
          adviceTime: new Date().format("yyyy-MM-dd hh:mm:ss"), //医嘱起始日期
          stopDoctorTime: "", //医嘱结束日期
          execDeptName: "", //执行科室
          basicDosage: "", //数量
          frequency: "", //频率
          normalDate: "", //常规时间
          basicDosageUnit: "", //单位
          onceDosage: undefined, //单次计量七叶皂苷钠注射液
          remark: "", //备注
          skinTest: "0", //皮试
          isUrgent: "0", //紧急
          isOneself: "0", //自备
          dropRate: undefined, //滴速
          entrust: "",
          status: "",
          originId: "0",
          dosageUnit: "",
          unit: "",
          packUnit: "",
          unitSaleFlg: "",
          halfUseFlg: "",
          dosageValue: ""
        },
        rules: {
          uses: [{ required: true, message: "请选择用法", trigger: "blur" }],
          frequency: [
            { required: true, message: "请选择频次", trigger: "blur" }
          ],
          basicDosage: [
            { required: true, message: "请填写数量", trigger: "blur" },
            {
              pattern: /^[0-9]{1,8}$/,
              message: "数量必须为整数且小于8位！"
            }
          ],
          onceDosage: [
            { required: true, message: "请填写单次剂量", trigger: "blur" },
            {
              pattern: /^([0-9][0-9]*)+(\.\d{1,4})?$/,
              message: "单次剂量必须为整数且四位小数！",
              trigger: "blur"
            }
          ],
          adviceTime: [
            { required: true, message: "请填写医嘱起始日期", trigger: "blur" }
          ],
          stopDoctorTime: [
            {
              validator: function(rule, value, callback) {
                if (
                  value &&
                  new Date(value).getTime() <=
                    new Date(startDoctorTime).getTime()
                ) {
                  callback(new Error("请重新选择结束日期"));
                } else {
                  callback();
                }
              },
              trigger: "change"
            }
          ],
          remark: [
            // {required: false, message: '请选择数量', trigger: 'blur'}
          ]
        },
        dropColumn: [
          // 下拉 table 配置表头
          {
            prop: "reimburseName",
            label: "报销",
            width: 60,
            codeTransform: true,
            codeTransformCode: "DrugReimbursementType"
          },
          {
            prop: "name",
            label: "名称",
            width: 160
          },
          {
            prop: "spec",
            label: "规格",
            width: 100
          },
          {
            prop: "price",
            label: "单价",
            width: 60
          },
          {
            prop: "execDeptName",
            label: "药房",
            width: 80
          },
          {
            prop: "itemTypeName",
            label: "项目类别",
            width: 80,
            codeTransform: true,
            codeTransformCode: "order_type"
          },
          {
            prop: "stockNum",
            label: "库存",
            width: 80
          },
          {
            prop: "basicType",
            label: "基药",
            width: 110,
            codeTransform: true,
            codeTransformCode: "BasicDrugType"
          }
        ],
        selectOptions: []
      },
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.selectDrop.ruleForm.stopDoctorTime) {
            let isOutMaxDay =
              time.getTime() >
              new Date(this.selectDrop.ruleForm.stopDoctorTime).getTime();
            return isOutMaxDay;
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.selectDrop.ruleForm.adviceTime) {
            let _time = time.getTime() + 24 * 60 * 59 * 1000;
            return (
              _time < new Date(this.selectDrop.ruleForm.adviceTime).getTime()
            );
          }
        }
      },
      curPc: {},
      // 频次下拉框数据
      frequencyOptions: [],
      // 频次下拉loading
      frequencyLoad: false
    };
  },
  components: {},
  methods: {
    ...mapActions({
      changeCurrentRow: "cis/changeCurrentRow",
      changeDrugName: "order/changeDrugName"
    }),
    // 监听医嘱状态
    getRadioType() {
      this.$root.eventHub.$on("radioType", res => {
        this.radioType = res;
        console.log(this.radioType, "this.radioType");
      });
    },
    // 数量状态
    setQuantityState() {
      // debugger
      if (this.radioValue === 1 || this.radioValue === 2) {
        this.selectDrop.ruleForm.basicDosage = undefined;
        this.isQuantityShow = false;
      } else {
        this.selectDrop.ruleForm.basicDosage =
          (this.row && this.row.basicDosage) || undefined;
        this.isQuantityShow = true;
      }
    },
    // 频率的状态
    setFrequencyState() {
      if (this.radioValue === 2) {
        //频率 在 短期的情况下禁用
        this.selectDrop.ruleForm.frequency = "st";
        this.isFrequencyDisabled = true;
      } else {
        this.selectDrop.ruleForm.frequency = this.row && this.row.frequency;
        this.isFrequencyDisabled = false;
      }
    },
    // 波半 逻辑处理
    halfUseHandle(row) {
      console.log(row.halfUseFlg);
      // debugger
      if (row.halfUseFlg === "1" || row.halfUseFlg === undefined) {
        // 可波半
        this.onceDosageControl.step = 0.0001;
        this.onceDosageControl.min = 0.0001;
      } else if (row.halfUseFlg === "0") {
        // 不可波半
        this.onceDosageControl.step = row.dosageValue;
        this.onceDosageControl.min = row.dosageValue;
      }
      if (row.onceDosage === undefined) {
        this.selectDrop.ruleForm.onceDosage = row.dosageValue;
        // 有剂量值 赋值
      } else {
        // 无剂量值 取值 dosageValue

        this.selectDrop.ruleForm.onceDosage = row.onceDosage;
      }
    },
    overReasonConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.overReason = false;
          //继续提交表单
          this.selectDrop.drugItem.excessReason = this.overReasonForm.reason;
          this.submitForm("ruleForm", true);
        } else {
          return false;
        }
      });
    },
    startDoctorTimeChange(n) {
      // debugger
      startDoctorTime = n;
      this.getFirstDay();
    },
    aaa() {
      this.$router.push("/two");
    },
    handleUseWay(value, item) {
      console.log("ppppppppppppppppp", value, item);
    },
    // 提交表单
    submitForm(formName, flag) {
      // 用户没有选择 患者提示
      if (!this.receivePatientData.patientId) {
        this.$message.error("请选择患者！");
        return;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let current = this.getCurrentRow();
          let form = this.selectDrop.ruleForm;
          let orderItem = { ...current, ...this.selectDrop.drugItem };
          /* if (typeof (orderItem.visitCode) === "undefined" || orderItem.visitCode === "") {
               this.$message.warning('请选择接诊患者后才可保存医嘱！');
               return false;
             }*/
          /*if (typeof (orderItem.recipeCode) === "undefined" || orderItem.recipeCode === "") {
              this.$message.warning('处方号不能为空！');
              return false;
            }*/

          //数量换算
          // 换算最小单位数量
          let basicDosage =
            form.basicDosageUnit === orderItem.packUnit
              ? form.basicDosage * 1 * orderItem.packQuantity
              : form.basicDosage;
          form.quantity = basicDosage;
          form.unit = orderItem.unit;
          form.dosageUnit = orderItem.dosageUnit;
          orderItem = { ...orderItem, ...form };

          // orderItem.skinTest = orderItem.skinTest ? "0" : "1";
          // 超7天校验
          //let times = 1;
          //let day = form.qty * 1 * orderItem.dosage / orderItem.onceDosage / times;
          // console.info("day", day);
          // 没有超量原因
          //   let hasReason = typeof (orderItem.excessReason) === 'undefined' || orderItem.excessReason === "" ? false : true;
          /*  if (day > 7 && !hasReason) {
                //弹出填写超量原因提示框，并填写提交
                this.overReason = true;
                return;
              }*/

          // console.info("orderItem", orderItem);
          temporary(orderItem).then(res => {
            if (res.code === 1) {
              this.$message.success(res.msg ? res.msg : "医嘱暂存成功");
              this.resetAll();
              // save btn 存储 数据
              this.$emit("save");
            } else {
              this.$message.error(res.msg ? res.msg : "医嘱暂存失败");
            }
          });
        }
      });
    },
    unitChange(value) {
      this.selectDrop.ruleForm.unit = this.getLabel(
        this.selectDrop.unitOptions,
        value
      );
    },
    frequencyChange(value) {
      this.selectDrop.ruleForm.frequency = this.getLabel(
        this.selectDrop.frequencyOptions,
        value
      );
    },
    useWayChange(value) {
      this.selectDrop.ruleForm.uses = this.getLabel(
        this.selectDrop.useWayOptions,
        value
      );
    },
    getLabel(optList, key) {
      let obj = optList.find(item => {
        return item.value === key;
      });
      return obj.label;
    },
    search(query) {
      let pageNo = this.queryName === query ? this.currentPage * 1 + 1 : 0;
      let data = {
        ...{ pageNo: pageNo, pageSize: this.pageSize, name: query }
      };
      getAdviceItem(data).then(res => {
        if (res.code === 1) {
          let { data } = res;
          let tableData =
            this.currentPage !== 0 ? this.selectDrop.selectOptions : [];
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            tableData.push({
              itemId: item.itemId || "",
              itemCode: item.itemCode || "",
              name: item.orderItemName || "",
              production: item.production || "",
              itemType: item.itemType || "",
              itemTypeName: item.itemTypeName || "",
              execDeptCode: item.execDeptCode || "",
              execDeptName: item.execDeptName || "",
              spec: item.spec || "",
              price: new Number(item.price).toFixed(4) || "",
              stClassCode: item.stClassCode || "",
              unit: item.unit || "",
              limitUnit: item.limitUnit || "",
              packQuantity: item.packQty || "",
              dosageUnit: item.defaultDosageUnit || "",
              defaultUsage: item.defaultUsage || "",
              dosage: item.dosage || "",
              firstDayCount: item.firstDayCount || "",
              takeMedicine: item.takeMedicine || "",
              sos: item.sos || "",
              prn: item.prn || "",
              halfUseFlg: item.halfUseFlg || "",
              dosageValue: item.dosageValue || "",
              stockNum: item.stockNum || "",
              manageType: item.manageType || "",
              adviceType: item.adviceType || "",
              formCode: item.formCode || "",
              basicType: item.basicType || "",
              unitSaleFlg: item.unitSaleFlg || "",
              reimburseMark: item.reimburseMark || "",
              reimburseName: item.reimburseName || "",
              clinicMark: item.clinicMark || "", //成组样式
              medicareItemCode: item.medicareItemCode || "",
              medicareItemName: item.medicareItemName || ""
            });
          }
          this.selectDrop.selectOptions = tableData;
          this.currentPage = res.pageNo;
          this.pageSize = res.pageSize;
          this.total = res.total;
          this.queryName = query;
        } else {
          this.$message.error(res.msg ? res.msg : "获取数据失败");
        }
      });
    },
    //获取 table的  current 的行
    getCurrentRow() {
      return this.currentRowData;
    },

    //回显table data
    fillTableData() {
      let curObj = this.getCurrentRow();

      console.log(curObj);

      // 赋值操作在下面进行处理

      // 更新 form 的值
      for (let i in this.selectDrop.ruleForm) {
        if (curObj === undefined) {
          this.selectDrop.ruleForm[i] = "";
        } else {
          this.selectDrop.ruleForm[i] = curObj[i];
        }
      }

      // 更新 list 的值
      this.selectDrop.displayList.forEach(item => {
        if (curObj === undefined) {
          item.value = "";
        } else {
          item.value = curObj[item.prop];
        }
      });
    },
    hollow() {
      this.resetAll();
    },
    // 重置 ruleForm displayList
    resetAll() {
      this.$refs["ruleForm"] && this.$refs["ruleForm"].resetFields();

      this.selectDrop.ruleForm = {
        uses: "", //用法
        basicDosage: undefined, //数量
        frequency: "", //频率
        basicDosageUnit: "", //单位
        onceDosage: undefined, //单次计量
        remark: "", //备注
        skinTest: "0", //皮试
        isUrgent: "0", //紧急
        isOneself: "0", //自备
        dropRate: undefined, //滴速
        entrust: "", // 嘱托
        adviceTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
        stopDoctorTime: "",
        dosageUnit: "",
        adviceId: "",
        originId: "0",
        firstDayCount: ""
      };

      this.selectDrop.displayList.forEach(item => {
        item.value = "";
      });

      // 根据 长期 短期 出院带药 判断 初始的状态
      this.setFrequencyState();
      this.setQuantityState();

      // 清空药品搜索
      this.$refs.LInputTable && this.$refs.LInputTable.clear();

      this.onceDosageControl.step = 0.0001;
      this.onceDosageControl.min = 0;
    },
    select(row) {
      // debugger
      let patientId = this.patientId;
      let patientName = this.patientName;
      let inpCode = this.inpCode;
      let wardsCode = this.wardId;
      let bedNo = this.bedNo;
      let curObj = this.getCurrentRow();
      let categoryCode = this.radioValue;
      let id = curObj ? curObj["id"] : "";
      let data = {
        id: id,
        visitCode: typeof visitCode === "undefined" ? "" : visitCode,
        patientId: patientId,
        patientName: patientName,
        inpCode: inpCode,
        bedNo: bedNo,
        wardsCode: wardsCode,
        categoryCode: categoryCode,
        spec: row.spec,
        price: row.price,
        dosage: row.dosage,
        packQuantity: row.packQuantity,
        dosageUnit: row.dosageUnit,
        name: row.name,
        code: row.itemId,
        adviceType: row.adviceType,
        stClassCode: row.stClassCode,
        itemType: row.itemType,
        receiveDept: row.execDeptCode,
        execDeptName: row.execDeptName,
        manageType: row.manageType,
        formCode: row.formCode,
        unitSaleFlg: row.unitSaleFlg,
        halfUseFlg: row.halfUseFlg,
        dosageValue: row.dosageValue,
        dataVersion: row.dataVersion ? row.dataVersion : 0,
        stockNum: row.stockNum,
        unit: row.limitUnit, // 药品名称返回的最小拆零单位
        packUnit: row.limitUnit, // 药品名称返回的药品单位
        drugDosage: row.dosage + row.defaultDosageUnit
      };
      this.selectDrop.selectOptions = [];
      this.currentPage = 0;
      //设置选择药品值
      this.selectDrop.drugItem = data;
      // console.info(this.selectDrop.drugItem);
      this.selectDrop.displayList.forEach(item => {
        if (row[item.prop] !== undefined) {
          item.value = row[item.prop];
        }
      });

      for (let key in this.selectDrop.ruleForm) {
        if (key === "skinTest") {
          // 皮试药品勾选皮试
          this.selectDrop.ruleForm[key] = data.stClassCode !== "" ? "1" : "0";
        } else if (key === "basicDosageUnit") {
          this.selectDrop.ruleForm[key] = data.packUnit;
        } else {
          if (data[key] !== undefined) {
            this.selectDrop.ruleForm[key] = data[key];
          }
        }
      }
      this.changeDrugName({ drugName: row.orderItemName });

      this.getDosageUnitAjax(data);
      this.halfUseHandle(row);
      this.$refs.onceDosage.$el
        .getElementsByClassName("el-input__inner")[0]
        .focus();
    },
    // 选中频次处理方法
    handleFreq(value) {
      let item = this.frequencyOptions.find(
        item => item.frequencyCode === value
      );
      if (item) {
        this.selectDrop.ruleForm.normalDate = item.cycleTimePoint;
        this.curPc = item;
        this.getFirstDay();
      }
    },
    // 首日次数
    getFirstDay() {
      if (this.curPc && this.selectDrop.ruleForm.adviceTime) {
        getFirstDayCount({
          frequencyCode: this.curPc.frequencyCode,
          adviceTime: this.selectDrop.ruleForm.adviceTime,
          cycleUnit: this.curPc.cycleUnit,
          cycleTimePoint: this.curPc.cycleTimePoint
        })
          .then(res => {
            if (res.code === 1) {
              console.log(res.data, "res.data");
              let firstDayCount = res.hasOwnProperty("data") ? res.data : "";

              this.selectDrop.ruleForm.firstDayCount = firstDayCount;

              console.log(firstDayCount, "firstDayCount");
              // this.$set(
              //   this.selectDrop.ruleForm.firstDayCount,
              //   "firstDayCount",
              //   firstDayCount
              // );
            }
          })
          .catch(err => {});
      }
    },
    // 计算金额
    computeAmt() {
      let curObj = this.getCurrentRow();
      let orderItem = { ...curObj, ...this.selectDrop.drugItem };
      let basicDosage = this.selectDrop.ruleForm.basicDosage;
      if (typeof orderItem.price !== "undefined") {
        let amt = orderItem.price * 1 * basicDosage; //计算金额
        this.selectDrop.drugItem.amt = amt;
        this.selectDrop.displayList.forEach(item => {
          if (item.prop === "amt") {
            item.value = amt;
          }
        });
      }
    },
    getDosageUnitAjax(data) {
      // if(this.radioValue !== 3) return;// 长期 临时 不需要请求药品单位
      this.selectDrop.unitOptions = [];
      // 获取单位数据
      let param = [];
      let shows = [];
      shows.push(data.packUnit);
      // 判断药品是否可拆零
      if (
        data.unitSaleFlg === "1" ||
        (data.unitSaleFlg === undefined && data.unit)
      ) {
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
    getFrequency(query) {
      get("/frequency/pageList", { keyword: query })
        .then(res => {
          if (res.code === 1) {
            this.frequencyOptions = res.data;
          }
        })
        .catch();
    },
    // 频次下拉框聚焦
    freqFocus(el) {
      if (el.target.value === "" && this.frequencyOptions.length === 0) {
        this.getFrequency("");
      }
    }
  },
  filters: {
    // rounding(value) {
    //   value = value !== "" ? value : 0;
    //   return value.toFixed(4);
    // }
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"])
  },
  watch: {
    radioValue: {
      immediate: true,
      handler(c) {
        this.resetAll();
      }
    },
    receivePatientData: {
      handler(c) {
        this.patientName = c.patientName;
        this.patientId = c.patientId;
        this.selectDrop.ruleForm.patientId = c.patientId;
        this.bedNo = c.bedCode;
        this.inpCode = c.inpCode;
        this.wardId = c.wardId;
      },
      immediate: true,
      deep: true //深度监听
    },
    row: {
      handler(c) {
        console.log(c);

        this.selectDrop.displayList.forEach(item => {
          if (c[item.prop] !== undefined) {
            item.value = c[item.prop];
          }
        });
        this.selectDrop.ruleForm.dataVersion = c.dataVersion;
        this.selectDrop.ruleForm.uses = c.uses;
        this.selectDrop.ruleForm.frequency = c.frequency;
        this.selectDrop.ruleForm.remark = c.remark;
        this.selectDrop.ruleForm.onceDosage = c.onceDosage;
        this.selectDrop.ruleForm.adviceTime = c.adviceTimes;
        this.selectDrop.ruleForm.adviceId = c.adviceId;
        this.selectDrop.ruleForm.patientId = c.patientId;
        this.selectDrop.ruleForm.basicDosageUnit = c.basicDosageUnit;
        this.selectDrop.ruleForm.basicDosage = c.basicDosage;
        this.selectDrop.ruleForm.stopDoctorTime = c.stopDoctorTime;
        this.selectDrop.ruleForm.normalDate = c.normalDate;
        this.selectDrop.ruleForm.entrust = c.entrust;
        this.selectDrop.ruleForm.status = c.status;
        this.selectDrop.ruleForm.skinTest = c.skinTest;
        this.selectDrop.ruleForm.isUrgent = c.isUrgent;
        this.selectDrop.ruleForm.isOneself = c.isOneself;
        this.selectDrop.ruleForm.dropRate = c.dropRate;
        this.selectDrop.ruleForm.dosageUnit = c.dosageUnit;
        this.selectDrop.ruleForm.unit = c.unit;
        this.selectDrop.ruleForm.packUnit = c.packUnit;
        this.selectDrop.ruleForm.dosageValue = c.dosageValue;
        this.selectDrop.ruleForm.unitSaleFlg = c.unitSaleFlg;
        this.selectDrop.ruleForm.firstDayCount = c.firstDayCount;
        this.selectDrop.ruleForm.takeMedicine = c.takeMedicine;
        this.selectDrop.ruleForm.sos = c.sos;
        this.selectDrop.ruleForm.prn = c.prn;

        this.currentRowData = c;

        // 用于校验 开始日期小于结束日期
        startDoctorTime = c.adviceTimes;

        // this.setFrequencyState ();
        // this.setQuantityState ();
        this.getDosageUnitAjax(c);
        this.halfUseHandle(c);
      },
      deep: true //深度监听
    }
  },
  mounted() {
    this.getRadioType();
    // 用于校验 开始日期小于结束日期
    startDoctorTime = this.selectDrop.ruleForm.adviceTime;
  },
  beforeDestroy() {
    this.$root.eventHub.$off("radioType");
  }
};
</script>

<style lang="scss" scoped>
.Rp-bottom-card {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  /*padding: 20px;*/
  border: 0 !important;
  overflow: unset !important;

  /deep/ .el-card__body {
    overflow-x: auto;
  }

  .wrapper {
    width: 100%;
  }

  .demo-ruleForm {
    /*white-space: nowrap;*/
  }

  .display-list {
    border-bottom: 1px solid rgba(228, 228, 228, 1);
    white-space: nowrap;

    .display-list-item {
      line-height: 42px;
      display: inline-block;
      margin-top: 6px;

      .title {
        font-size: 14px;

        font-weight: 400;
        color: rgba(148, 157, 163, 1);
        line-height: 20px;
      }

      .value {
        padding-left: 10px;
        font-size: 14px;

        font-weight: 400;
        color: rgba(46, 50, 58, 1);
        line-height: 20px;
      }
    }

    .display-list-item + .display-list-item {
      margin-left: 60px;
    }
  }

  .RpCls {
    .RpClsTitle {
      font-size: 14px;

      font-weight: bold;
      color: rgba(148, 157, 163, 1);
      line-height: 60px;
    }

    /deep/ .el-form-item {
      margin-bottom: 0;
      margin-right: 10px;
      display: inline-block;
    }

    /deep/ .el-form-item__content {
      margin-left: 0 !important;
      line-height: 0;
      margin-top: 10px;
      width: 200px;
    }

    .onceDosageInput {
      /deep/ .el-input__inner {
        padding-right: 30px;
      }
    }
  }
}

.button {
  vertical-align: 12px;
}

.date-picker {
  /deep/ .el-form-item__content {
    width: 278px !important;
  }
  /deep/.el-input__suffix {
    right: 1px !important;
  }
}

.skinTest {
  /deep/ .el-form-item__content {
    width: 50px !important;

    /deep/ .el-checkbox {
      vertical-align: 12px;
    }
  }
}
</style>
