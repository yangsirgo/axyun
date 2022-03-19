<template>
  <div class="height100 padding16 container">
    <div class="buttonArea">
      <el-button type="primary" @click="add">新增</el-button>
      <!-- <el-button @click="edit">编辑</el-button> -->
      <el-button @click="cancalApply">撤销</el-button>
    </div>
    <el-table
      ref="singleTable"
      :data="tableData"
      width="100%"
      stripe
      border
      v-loading="loading"
      :element-loading-text="$t('retreat.loadInfo')"
      highlight-current-row
      @row-click="rowClick"
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
          <template v-if="item.prop == 'recordStatus'">
            <span v-if="scope.row[item.prop] == '1'">已授权</span>
            <span v-if="scope.row[item.prop] == '2'">撤销</span>
            <span v-if="scope.row[item.prop] == '9'">已撤销</span>
          </template>
          <template v-else-if="item.prop == 'grantReasonCode'">
            <span :val="scope.row['grantReasonCode']" code="grantAppyReason" v-codeTransform></span>
          </template>
          <!-- <template v-else-if="item.prop == 'grantMoney'">
                  <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
          </template>-->
          <template v-else-if="item.prop == 'grantMoney'">
            <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
            <span v-if="!scope.row[item.prop]">0.00</span>
          </template>
          <template v-else>
            <span class="overflow-point">{{ scope.row[item.prop] }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="float-right page margin-top-16"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageParams.pageNo"
      :page-sizes="[20, 40, 60, 100,300,500,1000,3000,5000,10000]"
      :page-size="pageParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageParams.total"
    ></el-pagination>
    <!-- 弹框 -->
    <el-dialog title="绿色通道申请" :visible.sync="dialogVisible" v-if="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="form" class="padding16">
        <LFormtTitle label="授权部门" :required="true" style="width:300px;">
          <el-form-item prop="grantDeptId">
            <l-value-domain
              clearable
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="form.grantDeptId"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择"
              style="width:100%"
              @change="getGrantDepartmentName"
              :disabled="form.grantId?true:false"
            ></l-value-domain>
            <!-- <el-input v-if="form.grantId?true:false" disabled v-model="form.grantDepartmentName"></el-input> -->
          </el-form-item>
        </LFormtTitle>
        <!-- <LFormtTitle label="授权人员" :required="true" class="margin-top-16" style="width:300px;">
          <el-form-item prop="grantUserId">
            <l-value-domain
              :value.sync="form.grantUserId"
              remoteUrl="/finance-pub/dictionaryCatalog/getAllUserByHos"
              :remoteParams="''"
              remoteShowKey="uname"
              remoteValueKey="uid"
              placeholder="请选择"
              clearable
              @change="getGrantUserId"
              :disabled="form.grantId?true:false"
            />
          </el-form-item>
        </LFormtTitle>-->
        <LFormtTitle label="授权人员" required class="margin-top-16" style="width:300px;">
          <el-form-item prop="grantUserId">
            <el-select
              v-model="form.grantUserId"
              filterable
              remote
              reserve-keyword
              placeholder="姓名/拼音/五笔"
              :remote-method="selectAllUser"
              @change="setUser"
              clearable
              :disabled="form.grantId?true:false"
            >
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="授权金额" :required="true" class="margin-top-16" style="width:300px;">
          <el-form-item prop="grantMoney">
            <el-input
              v-model="form.grantMoney"
              placeholder="申请额度"
              clearable
              :disabled="form.grantId?true:false"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle label="申请原因" :required="true" class="margin-top-16" style="width:300px;">
          <el-form-item prop="grantReasonCode">
            <l-value-domain
              code="grantAppyReason"
              placeholder="请选择"
              :value.sync="form.grantReasonCode"
              :disabled="form.grantId?true:false"
            />
          </el-form-item>
        </LFormtTitle>
        <LFormtTitle
          label="其他原因"
          :required="true"
          class="margin-top-16"
          v-if="form.grantReasonCode == '0'"
          style="width:300px;"
        >
          <el-form-item prop="otherGrantReason">
            <el-input
              v-model="form.otherGrantReason"
              placeholder="其他原因"
              :disabled="form.grantId?true:false"
            ></el-input>
          </el-form-item>
        </LFormtTitle>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import service from "@/api/financeManagement/prestoreGrant";
import service2 from "@/api/systemManagement/receipt/receipt";
export default {
  data() {
    var valApplyMoney = (rule, value, callback) => {
      let rules = /^[0-9]*$/;
      if (value === "") {
        callback(new Error("请输入授权金额"));
      } else if (rules.test(value) === false) {
        callback(new Error("授权金额只能为数字"));
      } else if (value <= 0) {
        callback(new Error("授权金额不能为负或等于0"));
      } else if (value > 1000000) {
        callback(new Error("最大额度:1000000"));
      } else {
        callback();
      }
    };

    var valGrant = (rule, value, callback) => {
      if (!this.form.grantUserId && !this.form.grantDeptId) {
        callback(new Error("授权部门或人员必选一个"));
      } else {
        callback();
      }
    };
    return {
      // 表格数据
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "grantDeptName",
          label: "授权部门",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: false,
        },
        {
          prop: "grantUserName",
          label: "授权人员",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "grantTime",
          label: "授权时间",
          align: "left",
          headerAlign: "center",
          width: "160",
        },
        {
          prop: "grantMoney",
          label: "授权金额",
          align: "right",
          headerAlign: "center",
          width: "120",
        },
        {
          prop: "grantReasonCode",
          label: "申请原因",
          align: "left",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "otherGrantReason",
          label: "其他原因",
          align: "left",
          headerAlign: "center",
          width: "150",
        },
        {
          prop: "cancelUserName",
          label: "撤销人员",
          align: "left",
          headerAlign: "center",
          width: "100",
        },
        {
          prop: "cancelTime",
          label: "撤销时间",
          align: "left",
          headerAlign: "center",
          width: "160",
        },
      ],
      // loading
      loading: false,
      // 分页
      pageParams: {
        pageNo: 0,
        pageSize: 20,
        total: 0,
      },
      dialogVisible: false,
      // 表单
      form: {
        grantDeptId: "",
        grantDeptName: "",
        grantUserId: "",
        grantUserName: "",
        grantMoney: "",
        grantReasonCode: "",
        otherGrantReason: "",
        smsCaptcha: "",
      },
      rules: {
        grantDeptId: [
          // { required: true, message: "请选择授权部门", trigger: "blur" },
          { validator: valGrant, trigger: "blur" },
        ],
        grantUserId: [
          // { required: true, message: "请选择授权人员", trigger: "blur" },
          { validator: valGrant, trigger: "blur" },
        ],
        grantMoney: [
          { required: true, message: "请输入授权金额", trigger: "blur" },
          { validator: valApplyMoney, trigger: "blur" },
        ],
        grantReasonCode: [
          { required: true, message: "请选择申请原因", trigger: "blur" },
        ],
        otherGrantReason: [
          { required: true, message: "请填写其它原因", trigger: "blur" },
        ],
      },
      // 当前患者
      patient: {},
      // 当前对象
      currentData: {},
      // 撤销验证
      cancalReason: [
        { required: true, message: "请输入撤销原因", trigger: "blur" },
      ],
      options: [],
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
  },
  watch: {
    receivePatientData: {
      handler(value) {
        this.patient = value;
        if (value && value.patientId) {
          this.getPrestoreGrantOverdrawPOs();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
    }),
    // 查询用户
    async selectAllUser(val) {
      try {
        this.selLoading = true;
        let res = await service2.getAllUser({
          userName: val || "",
        });
        this.options = res.data;
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    // 获取授权透支明细
    async getPrestoreGrantOverdrawPOs() {
      try {
        this.loading = true;
        let res = await service.inpGrant({
          patientId: this.patient.patientId || "",
          finAdId: this.patient.finAdId || "",
          pageNo: this.pageParams.pageNo, // 页码
          pageSize: this.pageParams.pageSize, // 页码大小
        });
        this.clear();
        this.tableData = res.data;
        this.pageParams.total = res.total;
        this.loading = false;
      } catch (error) {
        console.info(error);
        this.loading = false;
        this.$message.error(error.mag || "获取患者授权透支列表失败");
      }
    },
    // 撤销申请
    async cancalApply() {
      if (!this.currentData.grantId) {
        this.$message.error("请选中要撤销的数据");
      } else {
        try {
          this.$showLoading();
          let res = await service.cancalGrant(this.form);
          this.$message({ type: "success", message: "撤销成功" });
          this.getPrestoreGrantOverdrawPOs();
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "撤销失败");
        }
      }
    },
    // 根据查询住院患者信息
    async getInpPatient() {
      try {
        this.$showLoading();
        let obj = {
          patientId: this.patient.patientId,
        };
        let res = await service.getInpInfo(obj);
        if (!res.data || !res.data.patientId) {
          this.$message("未查询到患者");
        }
        this.patient = res.data;
        this.changeRecPatientData(res.data);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        console.info(error);
        this.$message.error("更新患者信息失败");
      }
    },
    clear() {
      this.$refs.singleTable.setCurrentRow(this.currentData);
      this.currentData = {};
      this.form = {
        grantDeptId: "",
        grantDeptName: "",
        grantUserId: "",
        grantUserName: "",
        grantMoney: "",
        grantReasonCode: "",
        otherGrantReason: "",
        smsCaptcha: "",
      };
    },
    add() {
      this.clear();

      this.dialogVisible = true;
    },
    edit() {
      if (!this.currentData.grantId) {
        this.$message.error("请先选中要编辑的数据");
        return;
      }
      this.dialogVisible = true;
    },
    rowClick(row) {
      this.currentData = row;
      this.form = { ...row };
      this.form.grantDeptId = parseInt(row.grantDeptId);
    },
    sure() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          try {
            if (!this.patient || !this.patient.patientId) {
              this.$message.error("请读取患者就诊卡");
              return;
            }
            this.$showLoading();
            let obj = {
              ...this.form,
              patientId: this.patient.patientId,
              patientName: this.patient.patientName,
              patientCode: this.patient.patientCode,
              patientGender: this.patient.patientGender,
              finAdId: this.patient.finAdId,
            };
            let res = await service.addInpGrant(obj);
            this.$message({ type: "success", message: "提交成功" });
            this.clear();
            // this.getInpPatient();
            this.getPrestoreGrantOverdrawPOs();
            this.dialogVisible = false;
            this.$hideLoading();
          } catch (error) {
            console.info(error);
            this.$hideLoading();
            this.$message.error(error.msg || "提交失败");
          }
        }
      });
    },
    cancel() {
      this.dialogVisible = false;
    },
    // 得到验证码
    getValCode() {},
    // 冗余赋值
    getGrantDepartmentName(id, data) {
      this.form.grantDeptName = data.orgNm;
    },
    // getGrantUserId(id, data) {
    //   this.form.grantUserName = data.uname;
    // },
    setUser() {
      for (let i = 0; i < this.options.length; i++) {
        if (this.options[i].id == this.form.grantUserId) {
          this.form.grantUserName = this.options[i].name;
          return;
        }
      }
    },
    // 千位分隔
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
          return $1 + ",";
        });
      return res;
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getPrestoreGrantOverdrawPOs();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getPrestoreGrantOverdrawPOs();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  .buttonArea {
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  /deep/ .el-table__body-wrapper {
    height: calc(100% - 30px);
  }
}
</style>
