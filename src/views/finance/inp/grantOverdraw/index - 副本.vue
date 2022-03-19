<template>
  <div class="width100 height100">
    <el-row :gutter="10" class="width100 height100">
      <el-col :span="20" class="height100">
        <!-- <l-patient-details  :type="'default'" class="width100" /> -->
        <l-patient-fin class="width100" viewReadCard :type="'inp'"></l-patient-fin>
        <el-card class="card width100 padding10">
          <!-- <el-row :gutter="20" class="height100 tableTitle">
            <el-col :span="5" class="heigth100">
            </el-col>
            <el-col :span="5" class="heigth100 l-center-vertical">
              <el-checkbox v-model="checked" class="checkbox" @change="getPrestoreGrantOverdrawPOs">只显示未过期的绿色通道授权申请</el-checkbox>
            </el-col>
            <el-col :span="3" class="float-right">
              <el-button type="primary" class="float-right" @click="add">新增</el-button>
            </el-col>
          </el-row> -->
          <el-table
            style="margin-top:10px;"
            :data="tableData"
            width="100%"
            height="90%"
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
                </template> -->
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
          class="float-right page margin-top-20"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNo"
          :page-sizes="[20, 40, 60, 100,300,500,1000,3000,5000,10000]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>


        </el-card>
      </el-col>
      <el-col :span="4" class="height100">
        <el-card class="width100 height100 padding10">
          <l-card-title>
            <span slot="left">绿色通道申请</span>
            <el-button slot="right" type="primary" @click="add">新增</el-button>
          </l-card-title>
          <el-form :model="form" :rules="rules" ref="form">
            <LFormtTitle label="授权部门" :required="true" class="margin-top-20">
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
            <LFormtTitle label="授权人员" :required="true" class="margin-top-20">
              <el-form-item prop="grantUserId">
                <l-value-domain  :value.sync="form.grantUserId" remoteUrl="/wadmin/dept-user/119/2" :remoteParams="''" remoteShowKey="uname" remoteValueKey="uid" 
                  placeholder="请选择" clearable @change="getGrantUserId" :disabled="form.grantId?true:false"/>
              </el-form-item>
            </LFormtTitle>
            <LFormtTitle label="授权金额" :required="true" class="margin-top-20">
              <el-form-item prop="grantMoney">
                <el-input v-model="form.grantMoney" placeholder="申请额度" clearable :disabled="form.grantId?true:false"></el-input>
              </el-form-item>
            </LFormtTitle>
            <LFormtTitle label="申请原因" :required="true" class="margin-top-20">
              <el-form-item prop="grantReasonCode">
                <l-value-domain code="grantAppyReason" placeholder="请选择" :value.sync="form.grantReasonCode" :disabled="form.grantId?true:false"/>
              </el-form-item>
            </LFormtTitle>
            <LFormtTitle label="其他原因" :required="true" class="margin-top-20" v-if="form.grantReasonCode == '0'">
              <el-form-item prop="otherGrantReason">
                <el-input v-model="form.otherGrantReason" placeholder="其他原因" :disabled="form.grantId?true:false"></el-input>
              </el-form-item>
            </LFormtTitle>
            <!-- <el-row :gutter="10" style="height:32px;" class="margin-top-20">
              <el-col :span="18">
                <LFormtTitle label="验证码" :required="true">
                  <el-form-item prop="smsCaptcha">
                    <el-input v-model="form.smsCaptcha" placeholder="验证码"></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="6" class="heigth100 l-center-vertical">
                <el-button type="text" plain @click="getValCode">获取验证码</el-button>
              </el-col>
            </el-row> -->
            <div class="width100 margin-top-20">
              <el-button type="primary" @click="apply" :disabled="form.grantId?true:false">提交</el-button>
              <el-button type="primary" @click="cancalApply" :disabled="!form.grantId?true:false || form.recordStatus != '1'">撤销</el-button>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import service from "@/api/financeManagement/prestoreGrant";
export default {
  data() {
    var valApplyMoney = (rule, value, callback) => {
      let rules = /^[0-9]*$/;
      if (value === "") {
        callback(new Error("请输入授权金额"));
      } else if(rules.test(value) === false){
        callback(new Error("授权金额只能为数字"));
      } else if(value <= 0){
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
    }

    return {
      // 只能选择当天之后的日期
      pickeroptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      // 筛选
      checked: false,
      // 卡号
      cardData: '',
      // 表格数据
      tableData: [],
      // 表格列
      tableParams: [
        {
          prop: "recordStatus",
          label: "状态",
          align: "left",
          headerAlign: "center",
          width: "100"
        },{
          prop: "grantDeptName",
          label: "授权部门",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: false
        },{
          prop: "grantUserName",
          label: "授权人员",
          align: "left",
          headerAlign: "center",
          width: "100"
        },{
          prop: "grantTime",
          label: "授权时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        },{
          prop: "grantMoney",
          label: "授权金额",
          align: "right",
          headerAlign: "center",
          width: "120"
        },{
          prop: "grantReasonCode",
          label: "申请原因",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "otherGrantReason",
          label: "其他原因",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "cancelUserName",
          label: "撤销人员",
          align: "left",
          headerAlign: "center",
          width: "100"
        },{
          prop: "cancelTime",
          label: "撤销时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        }
      ],
      // loading
      loading: false,
      // 分页
      pageParams: {
        pageNo: 0,
        pageSize: 20,
        total: 0
      },
      // 表单
      form: {
        grantDeptId: '',
        grantDeptName: '',
        grantUserId: '',
        grantUserName: '',
        grantMoney: '',
        grantReasonCode: '',
        otherGrantReason: '',
        smsCaptcha: ''
      },
      rules: {
        grantDeptId: [
          // { required: true, message: "请选择授权部门", trigger: "blur" },
          { validator: valGrant, trigger: 'blur' }
        ],
        grantUserId: [
          // { required: true, message: "请选择授权人员", trigger: "blur" },
          { validator: valGrant, trigger: 'blur' }
        ],
        grantMoney: [
          { required: true, message: "请输入授权金额", trigger: "blur" },
          { validator: valApplyMoney, trigger: 'blur' }
        ],
        grantReasonCode: [
          { required: true, message: "请选择申请原因", trigger: "blur" }
        ],
        otherGrantReason: [
          { required: true, message: "请填写其它原因", trigger: "blur" }
        ]
      },
      // 当前患者
      patient: {},
      // 当前对象
      currentData: {},
      // 撤销验证
      cancalReason: [
        { required: true, message: "请输入撤销原因", trigger: "blur" }
      ]

    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(value) {
        this.patient = value;
        if(value.patientId){
          this.getPrestoreGrantOverdrawPOs();
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    // 获取授权透支明细
    async getPrestoreGrantOverdrawPOs(){
      try {
        this.loading = true;
        let res = await service.inpGrant({
          patientId: this.patient.patientId || '',
          finAdId: this.patient.finAdId || '',
          pageNo: this.pageParams.pageNo, // 页码
          pageSize: this.pageParams.pageSize, // 页码大小
        });
        this.tableData = res.data;
        this.pageParams.total = res.total;
        this.loading = false;
      } catch (error) {
        console.info(error)
        this.loading = false;
        this.$message.error(error.mag || '获取患者授权透支列表失败');
      }
    },
    // 撤销申请
    async cancalApply(){
      this.$refs["form"].validate(async valid => {
          if (valid) {
            try {
              this.$showLoading();
              let res = await service.cancalGrant(this.form);
              this.$message({type: "success", message: '撤销成功'});
              this.getPrestoreGrantOverdrawPOs();
              this.$hideLoading();
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "撤销失败")
            }
          }
      });
    },
    // 申请
    async apply(){
      this.$refs["form"].validate(async valid => {
          if (valid) {
            try {
              if(!this.patient || !this.patient.patientId){
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
                finAdId: this.patient.finAdId
              }
              let res = await service.addInpGrant(obj);
              this.$message({type: "success", message: '提交成功'});
              this.add();
              this.getInpPatient();
              this.getPrestoreGrantOverdrawPOs();
              this.$hideLoading();
            } catch (error) {
              console.info(error)
              this.$hideLoading();
              this.$message.error(error.msg || "提交失败")
            }
          }
      });
    },

    // 根据查询住院患者信息
    async getInpPatient(){
      try {
        this.$showLoading();
        let obj = {
          patientId: this.patient.patientId
        }
        let res = await service.getInpInfo(obj);
        if(!res.data || !res.data.patientId){
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
    add(){
      this.currentData = {}
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
      this.form.grantId = undefined;
    },
    rowClick(row){
      this.currentData = row;
      this.form = {...row}
      this.form.grantDeptId = parseInt(row.grantDeptId);
    },
    // 得到验证码
    getValCode(){

    },
    // 冗余赋值
    getGrantDepartmentName(id,data){
      this.form.grantDeptName = data.orgNm;
    },
    getGrantUserId(id,data){
      this.form.grantUserName = data.uname; 
    },
    // 千位分隔
    formatNumber(a){
      if(!a){
        return '0.00'
      }
      let res = a.toFixed(2).toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {return $1 + ",";});
      return res;  
    } ,
        // 分页
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getPrestoreGrantOverdrawPOs();
    },
     handleCurrentChange(val) {
      this.pageParams.pageNo = val;
      this.getPrestoreGrantOverdrawPOs();
    },
  }

};
</script>
<style lang='scss' scoped>
.card{
  height: calc(100% - 80px);
  margin-top: 10px;
}
.tableTitle{
  height: 36px;
}
.checkbox{
  color: $l-color-black;
  font-size: $l-font-size;
  font-weight: $l-font-weight;
}
.margin-top-10{
  margin-top: 10px;
}
.margin-top-20{
  margin-top: 20px;
}

</style>
