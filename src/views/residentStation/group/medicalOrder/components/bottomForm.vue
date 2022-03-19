<template>
  <el-card class="Rp-bottom-card">
    <div class="wrapper">
      <LInputTable
        id="bottomFormInputTable"
        :popoverWidth="800"
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
            <span>{{ item.value | rounding }}元</span>
          </template>
          <template v-else>
            <span class="value">{{
              item.value != "" ? item.value : "--"
            }}</span>
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
            <el-form-item label="" prop="onceDosage">
              <l-formt-title label="单次剂量" labelWidth="64">
                <el-input
                  ref="onceDosage"
                  v-model.number="selectDrop.ruleForm.onceDosage"
                >
                  <template slot="append"
                    >{{
                      selectDrop.drugItem.dosageUnit
                        ? selectDrop.drugItem.dosageUnit
                        : ""
                    }}
                  </template>
                </el-input>
              </l-formt-title>
            </el-form-item>
            <el-form-item label="" prop="quantity">
              <l-formt-title label="数量" style="width: 60%">
                <el-input-number
                  size="medium"
                  v-model.number="selectDrop.ruleForm.qty"
                  @change="computeAmt"
                  step-strictly
                  :controls="false"
                ></el-input-number>
              </l-formt-title>
              <el-select
                v-model="selectDrop.ruleForm.unitKey"
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
            <el-form-item label="" prop="useWay">
              <l-formt-title label="用法">
                <l-value-domain
                  code="use_way"
                  :value.sync="selectDrop.ruleForm.uses"
                  placeholder="请选择"
                ></l-value-domain>
              </l-formt-title>
            </el-form-item>

            <el-form-item label="" prop="frequencyCode">
              <l-formt-title label="频次">
                <!--<el-select v-model="selectDrop.ruleForm.frequencyKey" placeholder="请选择频率"  @change="frequencyChange">-->
                <l-value-domain
                  code="frequency"
                  :remoteShowKey="code"
                  :value.sync="selectDrop.ruleForm.frequency"
                  placeholder="请选择频次"
                ></l-value-domain>
              </l-formt-title>
            </el-form-item>
            <el-form-item label="" prop="skinText" class="skinTest">
              <el-checkbox v-model="selectDrop.ruleForm.skinText"
                >皮试</el-checkbox
              >
            </el-form-item>
            <el-form-item label="" prop="flowRate" class="flowRate">
              <l-formt-title label="滴速">
                <el-input-number
                  size="medium"
                  v-model="selectDrop.ruleForm.dropRate"
                  step-strictly
                  :controls="false"
                ></el-input-number>
              </l-formt-title>
            </el-form-item>
            <el-form-item label="" prop="setDrugsTime">
              <l-formt-title label="嘱托" labelWidth="64">
                <el-input v-model="selectDrop.ruleForm.administrationTimeCode">
                </el-input>
              </l-formt-title>
            </el-form-item>
            <el-form-item label="" prop="remarks">
              <l-formt-title label="备注">
                <el-input v-model="selectDrop.ruleForm.remark"> </el-input>
              </l-formt-title>
            </el-form-item>
            <el-form-item class="skinTest">
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
                class="button"
                >保存</el-button
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
import { getAdviceItem, getRecipeNo, saveOrders } from "@/api/cis/order/order";
import { temporary } from "@/api/cis/resident/residentAdvice";
import { mapGetters } from "vuex";

export default {
  name: "bottomForm",
  props: ["row", "radioValue"],
  data() {
    console.log(this.row);
    return {
      currentRowData: this.row,
      overReason: false, //超量原因弹窗
      patientId: "",
      patientName: "",
      bedNo: "",
      inpId: "",
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
          // {
          //   title: '处方',
          //   prop: 'recipeNo',
          //   value: ''
          // },
          {
            title: "药品名称",
            prop: "orderItemName",
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
            prop: "drugDosage",
            title: "剂量",
            value: ""
          },
          {
            prop: "amt",
            title: "金额",
            value: 0
          },
          {
            prop: "execDeptName",
            title: "执行科室",
            value: ""
          },
          {
            prop: "drugStock",
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
          uses: "", //用法
          qty: "", //数量
          frequency: "", //频率
          unitKey: "", //单位
          onceDosage: "", //单次计量
          remark: "", //备注
          skinText: 1, //皮试
          dropRate: "", //滴速
          administrationTimeCode: "" // 给药时间
        },
        rules: {
          uses: [{ required: true, message: "请选择用法", trigger: "blur" }],
          frequency: [
            { required: true, message: "请选择频次", trigger: "blur" }
          ],
          qty: [
            { required: true, message: "请填写数量", trigger: "blur" },
            {
              pattern: /^[0-9]{1,8}$/,
              message: "数量必须为整数且小于8位！"
            }
          ],
          onceDosage: [
            { required: true, message: "请填写单次剂量", trigger: "blur" },
            {
              pattern: /^[0-9]{1,8}$/,
              message: "单次剂量必须为整数且小于8位！"
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
            width: 60
          },
          {
            prop: "orderItemName",
            label: "名称",
            width: 100
          },
          {
            prop: "spec",
            label: "规格",
            width: 100
          },
          {
            prop: "price",
            label: "单价",
            width: 100
          },
          {
            prop: "execDeptName",
            label: "药房",
            width: 100
          },
          {
            prop: "itemTypeName",
            label: "项目类别",
            width: 100
          },
          {
            prop: "stockNum",
            label: "库存",
            width: 100
          },
          {
            prop: "basicType",
            label: "基药",
            width: 100
          }
        ],
        selectOptions: []
      }
    };
  },
  methods: {
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
    aaa() {
      this.$router.push("/two");
    },
    // 提交表单
    submitForm(formName, flag) {
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
          let qty =
            form.unitKey === orderItem.packUnit
              ? form.qty * 1 * orderItem.packQuantity
              : form.qty;
          form.quantity = qty;
          form.unit = orderItem.unit;
          orderItem = { ...orderItem, ...form };

          // 超7天校验
          let times = 1;
          let day =
            (form.qty * 1 * orderItem.dosage) / orderItem.onceDosage / times;
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
              orderItemName: item.orderItemName || "",
              production: item.production || "",
              itemType: item.itemType || "",
              itemTypeName: item.itemTypeName || "",
              execDeptCode: item.execDeptCode || "",
              execDeptName: item.execDeptName || "",
              spec: item.spec || "",
              price: item.price || "",
              unit: item.unit || "",
              limitUnit: item.limitUnit || "",
              packQuantity: item.packQty || "",
              defaultDosageUnit: item.defaultDosageUnit || "",
              defaultUsage: item.defaultUsage || "",
              dosage: item.dosage || "",
              stockNum: item.stockNum || "",
              manageType: item.manageType || "",
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
    select(row) {
      // console.log("选中啦", row);
      // console.info(this.$store.state.cis);
      //设置非编辑行
      // let visitCode = this.$store.state.cis.receivePatientData["visitCode"];//获取患者就诊ID
      // let patientId = this.$store.state.cis.receivePatientData["patientId"];//获取患者id
      // let patientName = this.$store.state.cis.receivePatientData["patientName"];//获取患者name

      let patientId = this.patientId;
      let patientName = this.patientName;
      let inpId = this.inpId;
      let bedNo = this.bedNo;
      let curObj = this.getCurrentRow();
      let categoryCode = this.radioValue;
      let id = curObj ? curObj["id"] : "";
      let data = {
        id: id,
        visitCode: typeof visitCode === "undefined" ? "" : visitCode,
        patientId: patientId,
        patientName: patientName,
        inpId: inpId,
        bedNo: bedNo,
        categoryCode: categoryCode,
        spec: row.spec,
        price: row.price,
        dosage: row.dosage,
        packQuantity: row.packQuantity,
        dosageUnit: row.defaultDosageUnit,
        name: row.orderItemName,
        code: row.itemId,
        itemType: row.itemType,
        receiveDept: row.execDeptCode,
        manageType: row.manageType,
        formCode: row.formCode,
        unitSaleFlg: row.unitSaleFlg,
        dataVersion: row.dataVersion ? row.dataVersion : 0,
        stockNum: row.stockNum,
        unit: row.limitUnit,
        packUnit: row.unit,
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
      this.selectDrop.unitOptions = [];
      this.selectDrop.unitOptions.push({
        label: data.packUnit,
        value: data.packUnit
      });
      this.selectDrop.ruleForm.unitKey = data.packUnit;
      // 判断药品是否可拆零
      if (row.unitSaleFlg === "1") {
        this.selectDrop.unitOptions.push({
          label: data.unit,
          value: data.unit
        });
      }
      this.$refs.onceDosage.$el
        .getElementsByClassName("el-input__inner")[0]
        .focus();
    },
    // 计算金额
    computeAmt() {
      let curObj = this.getCurrentRow();
      let orderItem = { ...curObj, ...this.selectDrop.drugItem };
      let qty = this.selectDrop.ruleForm.qty;
      if (typeof orderItem.price !== "undefined") {
        let amt = orderItem.price * 1 * qty; //计算金额
        this.selectDrop.drugItem.amt = amt;
        this.selectDrop.displayList.forEach(item => {
          if (item.prop === "amt") {
            item.value = amt;
          }
        });
      }
    }
  },
  filters: {
    rounding(value) {
      value = value !== "" ? value : 0;
      return value.toFixed(4);
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(c) {
        this.patientName = c.patientName;
        this.patientId = c.patientId;
        this.bedNo = c.bedCode;
        this.inpId = c.inpCode;
      },
      deep: true //深度监听
    }
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
  padding: 20px;
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
  }
}

.button {
  vertical-align: 12px;
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
