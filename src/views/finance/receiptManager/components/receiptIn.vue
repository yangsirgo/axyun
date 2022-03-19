<template>
  <div class="width100 height100 receiptln clearfix">
    <div class="leftDiv height100">
      <l-card-title>
        <span slot="left">入库记录</span>
      </l-card-title>
      <div class="form-content">
        <el-form
          class="search-area"
          :model="form"
          :rules="rulesInit"
          ref="ruleForm"
        >
          <el-row :gutter="10" class="width100" style="margin-bottom:10px">
            <el-col :span="8">
              <LFormtTitle label="票据类型" :required="addOrSel">
                <el-form-item prop="receiptType">
                  <l-value-domain
                    code="RECEIPT_TYPE"
                    :value.sync="form.receiptType"
                    clearable
                  />
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="入库时间" :required="addOrSel">
                <el-form-item prop="date">
                  <el-date-picker
                    style="width:100%"
                    v-model="date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="getDate"
                    clearable
                  ></el-date-picker>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="领用情况" :required="addOrSel">
                <el-form-item prop="outStatus">
                  <el-select
                    v-model="form.outStatus"
                    placeholder="请选择"
                    class="width100"
                    clearable
                  >
                    <el-option label="领用完" value="1"></el-option>
                    <el-option label="未领用完" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <LFormtTitle label="票据号" :required="addOrSel">
                <el-form-item prop="receiptNum">
                  <el-input
                    clearable
                    type="text"
                    v-model="form.receiptNum"
                    placeholder="请输入"
                    style="width:100%"
                  ></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="入库院区" :required="addOrSel">
                <el-form-item prop="divisionCode">
                  <l-value-domain
                    clearable
                    code="DIVISION_CODE"
                    :value.sync="form.divisionCode"
                    placeholder="请选择"
                  />
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="入库人员" :required="addOrSel">
                <el-form-item prop="userId">
                  <!-- <l-value-domain  :value.sync="form.userId" remoteUrl="/wadmin/dept-user/119/2" :remoteParams="''" remoteShowKey="uname" remoteValueKey="uid" 
                  placeholder="请选择" clearable/>-->
                  <el-select
                    v-model="form.userId"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="姓名/拼音/五笔"
                    :remote-method="selectAllUser"
                    :loading="selLoading"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
        </el-form>
        <div class="button-cont">
          <el-button type="primary" @click="searchTabledata">查询</el-button>
          <!-- <el-button type="primary" plain @click="save">保存</el-button> -->
          <el-button type="primary" plain @click="cancel">重置</el-button>
        </div>
      </div>
      <div class="table-cont">
        <!-- <el-button type="text" @click="add">
          <i class="iconfont iconxinzeng"></i>新增入库
        </el-button>-->
        <el-table
          :data="tableData"
          width="100%"
          height="calc(100% - 68px)"
          stripe
          border
          v-loading="loading"
          :element-loading-text="$t('retreat.loadInfo')"
        >
          <el-table-column
            v-for="(item, index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'receiptType'">
                <span
                  :val="scope.row['receiptType']"
                  code="RECEIPT_TYPE"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'divisionCode'">
                <span
                  :val="scope.row['divisionCode']"
                  code="DIVISION_CODE"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'operate'">
                <el-button
                  type="text"
                  @click="openDialog(scope.row, scope.$index, '1')"
                  >作废</el-button
                >
                <el-button
                  type="text"
                  @click="openDialog(scope.row, scope.$index, '2')"
                  >退回来源地</el-button
                >
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageParams.pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="rightDiv height100">
      <l-card-title>
        <span slot="left">登记入库</span>
      </l-card-title>
      <div class="save clearfix">
        <el-form
          :model="addForm"
          :rules="rules"
          ref="addForm"
          class="addForm-cont"
        >
          <el-form-item prop="receiptType"
            ><LFormtTitle label="票据类型" :required="true">
              <l-value-domain
                code="RECEIPT_TYPE"
                :value.sync="addForm.receiptType"
              /> </LFormtTitle
          ></el-form-item>

          <el-form-item prop="receiptPrefix"
            ><LFormtTitle label="票据号前缀" class="margin-top-20">
              <el-input
                type="text"
                v-model="addForm.receiptPrefix"
                placeholder="请输入"
                style="width:100%"
              ></el-input> </LFormtTitle
          ></el-form-item>

          <el-form-item prop="receiptSuffix"
            ><LFormtTitle label="票据号后缀" class="margin-top-20">
              <el-input
                type="text"
                v-model="addForm.receiptSuffix"
                placeholder="请输入"
                style="width:100%"
              ></el-input> </LFormtTitle
          ></el-form-item>
          <el-form-item prop="receiptNumLength">
            <LFormtTitle
              label="票据号长度"
              :required="true"
              class="margin-top-20"
            >
              <el-input
                type="text"
                v-model="addForm.receiptNumLength"
                placeholder="请输入"
                style="width:100%"
              ></el-input> </LFormtTitle
          ></el-form-item>
          <el-form-item prop="receiptStartNum">
            <LFormtTitle
              label="起始票据号"
              :required="true"
              class="margin-top-20"
            >
              <el-input
                type="text"
                v-model="addForm.receiptStartNum"
                placeholder="请输入"
                style="width:100%"
              ></el-input> </LFormtTitle
          ></el-form-item>
          <el-form-item prop="receiptStopNum">
            <LFormtTitle
              label="终止票据号"
              :required="true"
              class="margin-top-20"
            >
              <el-input
                type="text"
                v-model="addForm.receiptStopNum"
                placeholder="请输入"
                style="width:100%"
              ></el-input> </LFormtTitle
          ></el-form-item>
          <el-form-item prop="divisionCode">
            <LFormtTitle
              label="入库院区"
              :required="true"
              class="margin-top-20"
            >
              <l-value-domain
                code="DIVISION_CODE"
                :value.sync="addForm.divisionCode"
                placeholder="请选择"
              /> </LFormtTitle
          ></el-form-item>
        </el-form>
        <div class="button-cont float-right">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" plain @click="saveCancel">取消</el-button>
        </div>
      </div>
    </div>

    <!-- 退回弹窗 -->
    <el-dialog
      class="padding20"
      :title="diaTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span slot="footer" class="dialog-footer padding20">
        <el-form :model="diaForm" :rules="diaFormRules" ref="diaForm">
          <el-row :gutter="10">
            <el-col :span="12">
              <LFormtTitle label="起始票据号" required>
                <el-form-item prop="receiptStartNum">
                  <el-input
                    type="text"
                    v-model="diaForm.receiptStartNum"
                    placeholder="请输入"
                    style="width:100%"
                  ></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
            <el-col :span="12">
              <LFormtTitle label="终止票据号" required>
                <el-form-item prop="receiptStopNum">
                  <el-input
                    type="text"
                    v-model="diaForm.receiptStopNum"
                    placeholder="请输入"
                    style="width:100%"
                  ></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="margin-top-20">
            <LFormtTitle :label="recordRemark" required>
              <el-form-item prop="recordRemark">
                <el-input
                  type="text"
                  v-model="diaForm.recordRemark"
                  placeholder="请输入"
                  style="width:100%"
                ></el-input>
              </el-form-item>
            </LFormtTitle>
          </el-row>
        </el-form>
        <el-row class="margin-top-20">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitDiaForm">确 定</el-button>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import service from "@/api/systemManagement/receipt/receipt";
// 重写date 格式化方法
// eslint-disable-next-line no-extend-native
Date.prototype.toLocaleStr = function() {
  var month = ("0" + (this.getMonth() + 1)).slice(-2); // 如果是1-9月，那么前面补0
  var day = ("0" + this.getDate()).slice(-2);
  return this.getFullYear() + "-" + month + "-" + day;
};

export default {
  data() {
    // 票据号起始结束校验
    var diaFormReceiptStopNum = (rule, value, callback) => {
      let rules = /^[0-9]*$/;
      let a = Number(value);
      let b = Number(this.addForm.receiptStartNum);
      if (value === "") {
        callback(new Error("请输入票据结束号"));
      } else if (value.length > Number(this.addForm.receiptNumLength)) {
        callback(new Error("票据号长度不能大于维护的长度"));
      } else if (a < b && this.addForm.receiptStartNum !== "" && this.addForm.receiptStartNum !== undefined) {
        callback(new Error("结束号不能小于起始号"));
      } else if (rules.test(a) === false) {
        callback(new Error("结束号只能为数值型"));
      } else {
        callback();
      }
    };
    var diaFormReceiptStartpNum = (rule, value, callback) => {
      let rules = /^[0-9]*$/;
      let a = Number(value);
      let b = Number(this.addForm.receiptStopNum);
      if (value === "") {
        callback(new Error("请输入票据起始号"));
      } else if (value.length > Number(this.addForm.receiptNumLength)) {
        callback(new Error("票据号长度不能大于维护的长度"));
      } else if (rules.test(a) === false) {
        callback(new Error("起始号只能为数值型"));
      } else if (a === 0) {
        callback(new Error("起始号不能为0"));
      } else if (a > b && this.addForm.receiptStopNum !== "" && this.addForm.receiptStopNum !== undefined) {
        callback(new Error("起始号不能大于结束号"));
      } else {
        callback();
      }
    };
    var check = (rule, value, callback) => {
      let rules = /^[1-9](\d{0,2})?$/;
      if (value === "") {
        callback(new Error("请输入票据号长度"));
      } else if (rules.test(value) === false) {
        callback(new Error("只能输入 1-2 位数值"));
      } else if (Number(value) > 10) {
        callback(new Error("最大长度为10"));
      } else {
        callback();
      }
    };

    var valNumber = (rule, value, callback) => {
      let rules = /^[0-9]*$/;
      if (value === "") {
        callback();
      } else if (rules.test(value) === false) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    var receiptPrefixCheck = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else if (value.length > 3) {
        // this.$message.error("长度在0到3个字符");
        callback(new Error("长度在0到 3个字符"));
      } else {
        callback();
      }
    };

    return {
      // 加载...
      loading: false,
      // 表单数据
      form: {
        receiptType: "",
        receiptStartNum: "",
        receiptStopNum: "",
        divisionCode: "",
        receiptNum: "",
        userId: "",
        startDate: "",
        stopDate: "",
        outStatus: ""
      },
      // 时间
      date: null,
      // 表格列
      tableParams: [
        {
          prop: "receiptType",
          label: "票据类型",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: true
        },
        {
          prop: "receiptPrefix",
          label: "票据号前缀",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptSuffix",
          label: "票据号后缀",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptNumLength",
          label: "票据号长度",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptStartNum",
          label: "票据起始号",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "receiptStopNum",
          label: "票据终止号",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "totalQuantity",
          label: "总票据张数",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "useQuantity",
          label: "可用张数",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "remainderQuantity",
          label: "未领用张数",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "divisionCode",
          label: "入库院区",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "inUserName",
          label: "入库人员",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "inDate",
          label: "入库时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        }
        // ,
        // {
        //   prop: "operate",
        //   label: "操作",
        //   align: "center",
        //   headerAlign: "center",
        //   width: "140"
        // }
      ],
      // 表格数据
      tableData: [],
      // 空校验 （查询用）
      rulesInit: {
        receiptNum: [{ validator: valNumber, trigger: "blur" }]
      },
      // 非空校验
      rules: {
        receiptPrefix: [
          // { min: 0, max: 3, message: "长度在 0 到 3 个字符", trigger: "blur" },
          { validator: receiptPrefixCheck, trigger: "blur" }
        ],
        receiptSuffix: [
          // { min: 0, max: 3, message: "长度在 0 到 3 个字符", trigger: "blur" }
          { validator: receiptPrefixCheck, trigger: "blur" }
        ],
        receiptType: [
          { required: true, message: "请选择入库类型", trigger: "blur" }
        ],
        receiptStartNum: [
          { required: true, message: "请输入票据起始号", trigger: "blur" },
          { validator: diaFormReceiptStartpNum, trigger: "blur" }
        ],
        receiptStopNum: [
          { required: true, message: "请输入票据结束号", trigger: "blur" },
          { validator: diaFormReceiptStopNum, trigger: "blur" }
        ],
        divisionCode: [
          { required: true, message: "请选择入库院区", trigger: "blur" }
        ],
        receiptNumLength: [
          { required: true, message: "请输入票据号长度", trigger: "blur" },
          { validator: check, trigger: "blur" }
        ]
      },
      // 是否添加
      addOrSel: false,
      // 弹窗显示
      dialogVisible: false,
      // 弹窗表单数据
      diaForm: {},
      // 弹窗标题
      diaTitle: "",
      // 原因label
      recordRemark: "",
      // 弹窗标志
      diaFlag: "1",
      // 弹窗校验
      diaFormRules: {
        receiptStartNum: [
          { required: true, message: "请输入票据起始号", trigger: "blur" }
        ],
        receiptStopNum: [
          { required: true, message: "请输入票据结束号", trigger: "blur" }
          // { validator: diaFormReceiptStopNum, trigger: 'blur' }
        ],
        recordRemark: [
          { required: true, message: "请输入原因", trigger: "blur" }
        ]
      },
      // 当前选中数据
      currentData: {},
      // 新增表单
      addForm: {
        receiptType: "",
        receiptPrefix: "",
        receiptSuffix: "",
        receiptNumLength: "",
        receiptStartNum: "",
        receiptStopNum: "",
        divisionCode: ""
      },
      // 分页in
      pageParams: {
        pageNo: 0,
        pageSize: 20,
        total: 0
      },
      // 人员集合
      options: [],
      selLoading: false
    };
  },
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  mounted() {
    // 获取列表
    this.search();
  },
  methods: {
    // 查询用户
    async selectAllUser(val) {
      try {
        this.selLoading = true;
        let res = await service.getAllUser({
          userName: val || ""
        });
        this.options = res.data;
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    // 选选择日期
    getDate() {},
    // 新增
    add() {
      this.rulesInit = { ...this.rules };
      this.addOrSel = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    // 查询
    async searchTabledata() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          this.pageParams.pageNo = 1;
          this.tableData = [];
          await this.search();
        } else {
          return false;
        }
      });
    },
    // 得到入库列表
    async search() {
      try {
        this.addOrSel = false;
        this.loading = true;
        let data = {
          ...this.pageParams,
          ...this.form
        };
        if (this.date && this.date.length > 1) {
          data.startDate = this.date[0].toLocaleStr() + " 00:00:00";
          data.stopDate = this.date[1].toLocaleStr() + " 23:59:59";
        }
        let res = await service.getReceiptList(data);
        // this.tableData.push(...res.data);
        this.tableData = res.data;
        this.pageParams.total = res.total;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg || "获取入库列表失败");
      }
    },
    // 入库
    async save() {
      try {
        this.$refs["addForm"].validate(async valid => {
          if (valid) {
            try {
              this.$showLoading();
              let res = await service.addReceipt({
                ...this.addForm,
                inType: "1"
              });
              this.$hideLoading();
              this.$message({ type: "success", message: "保存成功" });
              this.saveCancel();
              this.$nextTick(() => {
                this.tableData = [];
                this.search();
              });
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "入库失败");
            }
          } else {
            this.$hideLoading();
            return false;
          }
        });
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "入库失败");
      }
    },
    // 取消
    cancel() {
      this.addOrSel = false;
      this.rulesInit = {};
      this.date = [];
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    saveCancel() {
      this.$nextTick(() => {
        this.$refs["addForm"].resetFields();
      });
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 打开弹窗
    openDialog(data, index, flag) {
      if (flag == "1") {
        this.diaTitle = "作废区间";
        this.recordRemark = "作废原因";
      } else if (flag == "2") {
        this.diaTitle = "退还区间";
        this.recordRemark = "退还原因";
      }
      this.currentData = {
        ...data
      };
      this.dialogVisible = true;
      this.diaFlag = flag;
    },
    // 提交弹窗数据
    submitDiaForm() {
      this.$refs["diaForm"].validate(valid => {
        if (valid) {
          if (this.diaFlag == "1") {
            this.verification();
          } else if (this.diaFlag == "2") {
            this.back();
          }
        } else {
          return false;
        }
      });
    },
    // load
    // load(){
    //   if (this.tlm_noMore) {
    //     return;
    //   }
    //   this.pageParams.pageNo++;
    //   this.search();
    // },
    // 作废
    async verification() {
      try {
        let obj = {
          // ...this.currentData,
          receiptStartNum: this.diaForm.receiptStartNum,
          receiptStopNum: this.diaForm.receiptStopNum,
          recordRemark: this.diaForm.recordRemark,
          inId: this.currentData.inId,
          receiptType: this.currentData.receiptType,
          divisionCode: this.currentData.divisionCode,
          outType: "2", // 作废
          abortStatus: "1" //终止
        };
        this.$showLoading();
        let res = await service.receiptback(obj);
        this.$hideLoading();
        this.dialogVisible = false;
        this.$message({ message: "作废成功", type: "success" });
        this.$nextTick(() => {
          this.$refs["diaForm"].resetFields();
        });
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "作废失败");
      }
    },
    // 退回来源地
    async back() {
      try {
        let obj = {
          // ...this.currentData,
          receiptStartNum: this.diaForm.receiptStartNum,
          receiptStopNum: this.diaForm.receiptStopNum,
          recordRemark: this.diaForm.recordRemark,
          inId: this.currentData.inId,
          receiptType: this.currentData.receiptType,
          divisionCode: this.currentData.divisionCode,
          outType: "5", // 退回来源地
          abortStatus: "1" //终止
        };
        this.$showLoading();
        let res = await service.receiptback(obj);
        this.$hideLoading();
        this.dialogVisible = false;
        this.$message({ message: "退还成功", type: "success" });
        this.$nextTick(() => {
          this.$refs["diaForm"].resetFields();
        });
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "退还失败");
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.search();
    }
  }
};
</script>
<style lang="scss" scoped>
.receiptln {
  .input {
    width: 100%;
    background-color: $l-color-bgcolor-18;
  }
  .margin-top-20 {
    margin-top: 20px;
  }
  .leftDiv {
    float: left;
    width: calc(100% - 300px);
    height: 100%;
    padding: 10px;
    .form-content {
      display: flex;
      .search-area {
        // padding: 20px;
        margin-right: 20px;
        flex: 1;
        // background-color: $l-color-bgcolor-18;
      }
    }
    .table-cont {
      height: calc(100% - 149px);
      margin-top: 20px;
      .page {
        text-align: right;
        margin-top: 20px;
        .el-pagination {
          padding: 0;
          /deep/ .el-pagination__editor.el-input .el-input__inner {
            height: 100% !important;
          }
        }
      }
    }
  }
  .rightDiv {
    float: left;
    width: 300px;
    padding: 10px;
    border-left: 1px solid $l-color-bgcolor-11;
  }
  .save {
    width: 100%;
    height: calc(100% - 63px);
    // background-color: $l-color-bgcolor-18;
    .addForm-cont {
      height: calc(100% - 46px);
      padding-bottom: 10px;
      border-bottom: 1px solid $l-color-bgcolor-11;
    }
    .button-cont {
      padding-top: 10px;
    }
  }
}
</style>
