<template>
  <!--<div class="width100 height100">
    <el-row :gutter="10" class="width100 height100" style="display:flex;">
      <div style="width:285px;margin-right:10px;" class="height100">
        <el-card class="height100 width100 padding10">
          <l-card-title>
            <span slot="left">患者列表</span>
          </l-card-title>
          <div :style="{height:'calc(100% - 63px)'}">
            <PatientList @listItemClick="listItemClickHandle"></PatientList>
          </div>
        </el-card>
      </div>
      <div class="height100" style="width:calc(100% - 590px);margin-right:10px;">
        &lt;!&ndash; <l-patient-details  :type="'default'" class="width100" /> &ndash;&gt;
        &lt;!&ndash; <l-patient-fin class="width100" viewReadCard></l-patient-fin> &ndash;&gt;
        <el-card class="card width100 padding10">
          <PatientInfoTop :patientInfo="selectedPatientInfo"></PatientInfoTop>
          <el-row :gutter="20" class="height100 tableTitle">
            <el-col :span="5" class="heigth100">
              &lt;!&ndash; <l-read-card @readCard="readCard"></l-read-card> &ndash;&gt;
            </el-col>
            <el-col :span="5" class="heigth100 l-center-vertical">
              <el-checkbox
                v-model="checked"
                class="checkbox"
                @change="getPrestoreGrantOverdrawPOs"
              >只显示未过期的绿色通道授权申请
              </el-checkbox>
            </el-col>
            <el-col :span="3" class="float-right">
              <el-button type="primary" class="float-right" @click="add">新增</el-button>
            </el-col>
          </el-row>
          <el-table
            style="margin-top:10px;height:calc(100% - 190px)"
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
                  <span v-if="scope.row[item.prop] == '0'">已申请</span>
                  <span v-if="scope.row[item.prop] == '1'">已授权</span>
                  <span v-if="scope.row[item.prop] == '2'">已撤销</span>
                </template>
                <template v-else-if="item.prop == 'applyReason'">
                  <span :val="scope.row['applyReason']" code="grantAppyReason" v-codeTransform></span>
                </template>
                <template v-else-if="item.prop == 'applyMoney'">
                  <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
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
            class="float-right page margin-top-10"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageParams.pageNo"
            :page-sizes="[20, 40, 60, 100,300,500,1000,3000,5000,10000]"
            :page-size="pageParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total"
          ></el-pagination>
        </el-card>
      </div>
      <div style="width:285px;" class="height100">
        <el-card class="width100 height100 padding10">
          <l-card-title>
            <span slot="left">绿色通道申请</span>
          </l-card-title>
          <el-form :model="form" :rules="rules" ref="form">
            <LFormtTitle label="授权部门" :required="true" class="margin-top-20">
              <el-form-item prop="grantDepartmentId">
                <l-value-domain
                  clearable
                  remoteUrl="/wadmin/hos/dept"
                  type="select"
                  :value.sync="form.grantDepartmentId"
                  remoteShowKey="orgNm"
                  remoteValueKey="id"
                  placeholder="请选择"
                  style="width:100%"
                  @change="getGrantDepartmentName"
                  :disabled="form.grantOverdrawId?true:false"
                ></l-value-domain>
                &lt;!&ndash; <el-input v-if="form.grantOverdrawId?true:false" disabled v-model="form.grantDepartmentName"></el-input> &ndash;&gt;
              </el-form-item>
            </LFormtTitle>
            <LFormtTitle label="授权人员" :required="true" class="margin-top-20">
              <el-form-item prop="grantUserId">
                <l-value-domain
                  :value.sync="form.grantUserId"
                  remoteUrl="/wadmin/dept-user/119/2"
                  :remoteParams="''"
                  remoteShowKey="uname"
                  remoteValueKey="uid"
                  placeholder="请选择"
                  clearable
                  @change="getGrantUserId"
                  :disabled="form.grantOverdrawId?true:false"
                />
              </el-form-item>
            </LFormtTitle>
            <LFormtTitle label="申请额度" :required="true" class="margin-top-20">
              <el-form-item prop="applyMoney">
                <el-input
                  v-model="form.applyMoney"
                  placeholder="申请额度"
                  clearable
                  :disabled="form.grantOverdrawId?true:false"
                ></el-input>
              </el-form-item>
            </LFormtTitle>
            <LFormtTitle label="申请原因" :required="true" class="margin-top-20">
              <el-form-item prop="applyReason">
                <l-value-domain
                  code="grantAppyReason"
                  placeholder="请选择"
                  :value.sync="form.applyReason"
                  :disabled="form.grantOverdrawId?true:false"
                />
              </el-form-item>
            </LFormtTitle>
            <LFormtTitle
              label="其他原因"
              :required="true"
              class="margin-top-20"
              v-if="form.applyReason == '0'"
            >
              <el-form-item prop="remark">
                <el-input
                  v-model="form.remark"
                  placeholder="其他原因"
                  :disabled="form.grantOverdrawId?true:false"
                ></el-input>
              </el-form-item>
            </LFormtTitle>
            &lt;!&ndash; <el-row :gutter="10" style="height:32px;" class="margin-top-20">
              <el-col :span="18" v-loading="smsLoading">
                <LFormtTitle label="验证码" :required="true">
                  <el-form-item prop="smsCaptcha">
                    <el-input v-model="form.smsCaptcha" placeholder="验证码"></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="6" class="heigth100 l-center-vertical">
                <el-button type="text" plain @click="getValCode">获取验证码</el-button>
              </el-col>
            </el-row>&ndash;&gt;

            <LFormtTitle label="有效期" :required="true" class="margin-top-20">
              <el-form-item prop="validTime">
                <el-date-picker
                  v-model="form.validTime"
                  type="date"
                  placeholder="授权截止日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  :disabled="form.grantOverdrawId?true:false"
                  :picker-options="pickeroptions"
                ></el-date-picker>
              </el-form-item>
            </LFormtTitle>
            <LFormtTitle
              label="撤销原因"
              :required="true"
              class="margin-top-20"
              v-if="form.grantOverdrawId?true:false"
            >
              <el-form-item prop="cancalReason">
                <el-input v-model="form.cancalReason" placeholder="请输入"></el-input>
              </el-form-item>
            </LFormtTitle>

            <div class="width100 margin-top-20">
              <el-button
                type="primary"
                @click="cancalApply"
                :disabled="!form.grantOverdrawId?true:false || form.recordStatus == '2'"
              >撤销
              </el-button>
              <el-button
                type="primary"
                @click="apply"
                :disabled="form.grantOverdrawId?true:false"
              >申请
              </el-button>
              <el-button
                type="primary"
                @click="passApply"
                :disabled="(form.recordStatus && form.recordStatus == '0')? false:true"
              >授权
              </el-button>
              &lt;!&ndash; <el-button type="primary">新增</el-button> &ndash;&gt;
            </div>
          </el-form>
        </el-card>
      </div>
    </el-row>
  </div>-->
  <l-layout
    :boxExpanded="false"
    :isToolBox="true"
    :hasThreeRouterFlag="false"
    :patientListShow="true"
    displayMode="expand"
  >
   <!-- <template #topSlot>
      <PatientInfoTop :patientInfo="selectedPatientInfo" />
    </template> -->
    <template #list>
      <el-card class="height100 width100 padding10">
        <l-card-title class='padding8'>
          <span slot="left">患者列表</span>
        </l-card-title>
        <div class="patient-list">
          <PatientList @listItemClick="listItemClickHandle" />
        </div>
      </el-card>
    </template>
    <template #content>
      <div class="bg-contain width100 height100 clearfix perstore-grant">
        <div class="patient-card">
          <l-patient-card :patientName="selectedPatientInfo.patientName" :patientAge="selectedPatientInfo.age" :patientGender="selectedPatientInfo.patientGender">
            <patient-basic-info :patientInfo="selectedPatientInfo"></patient-basic-info>
             <!-- 二维码 -->
             <div class="qrcode float-right">
               <img :src="'data:image/png;base64,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'" alt="">
             </div>
          </l-patient-card>

        </div>
        <el-card class="card width100 height100 padding10 float-left m-contain third-con">
          <el-row :gutter="20" class="tableTitle" style="margin-bottom: 10px">
            <el-col :span="5" class="heigth100">
              <!-- <l-read-card @readCard="readCard"></l-read-card> -->
            </el-col>
            <el-col :span="5" class="heigth100 l-center-vertical">
              <el-checkbox
                v-model="checked"
                class="checkbox"
                @change="getPrestoreGrantOverdrawPOs"
              >只显示未过期的绿色通道授权申请</el-checkbox>
            </el-col>
            <el-col :span="3" class="float-right">
              <el-button type="primary" class="float-right" @click="add">新增</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            width="100%"
            height="calc(100% - 100px)"
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
                  <span v-if="scope.row[item.prop] == '0'">已申请</span>
                  <span v-if="scope.row[item.prop] == '1'">已授权</span>
                  <span v-if="scope.row[item.prop] == '2'">已撤销</span>
                </template>
                <template v-else-if="item.prop == 'applyReason'">
                  <span :val="scope.row['applyReason']" code="grantAppyReason" v-codeTransform></span>
                </template>
                <template v-else-if="item.prop == 'applyMoney'">
                  <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else-if="item.prop == 'grantMoney'">
                  <span v-if="scope.row[item.prop]">{{formatNumber(scope.row[item.prop])}}</span>
                  <span v-if="!scope.row[item.prop]">0.00</span>
                </template>
                <template v-else-if="item.prop == 'grantRecycleType'">
                  <span v-if="scope.row[item.prop] == '3'">定时自动撤销</span>
                  <!-- <span v-if="scope.row[item.prop] == '1'">已授权</span> -->
                  <span v-if="scope.row[item.prop] == '2'">手动撤销</span>
                </template>
                <template v-else>
                  <span class="overflow-point">{{ scope.row[item.prop] }}</span>
                </template>
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
        </el-card>
        <el-card class="height100 float-right" style="width:285px;padding:0 10px 10px 10px">
          <l-card-title class='padding8'>
            <span slot="left">绿色通道申请</span>
          </l-card-title>
          <div class="form-cont">
            <el-form :model="form" :rules="rules" ref="form">
              <LFormtTitle label="授权部门" :required="true" class="margin-top-8">
                <el-form-item prop="grantDepartmentId">
                  <l-value-domain
                    clearable
                    remoteUrl="/wadmin/hos/dept"
                    type="select"
                    :value.sync="form.grantDepartmentId"
                    remoteShowKey="orgNm"
                    remoteValueKey="id"
                    placeholder="请选择"
                    style="width:100%"
                    @change="getGrantDepartmentName"
                    :disabled="form.grantOverdrawId?true:false"
                  ></l-value-domain>
                  <!-- <el-input v-if="form.grantOverdrawId?true:false" disabled v-model="form.grantDepartmentName"></el-input> -->
                </el-form-item>
              </LFormtTitle>
              <LFormtTitle label="授权人员" :required="true" class="margin-top-8">
                <el-form-item prop="grantUserId">
                  <!-- <l-value-domain
                    :value.sync="form.grantUserId"
                    remoteUrl="/wadmin/dept-user/119/2"
                    :remoteParams="''"
                    remoteShowKey="uname"
                    remoteValueKey="uid"
                    placeholder="请选择"
                    clearable
                    @change="getGrantUserId"
                    :disabled="form.grantOverdrawId?true:false"
                  /> -->
                  <el-select
                    :disabled="form.grantOverdrawId?true:false"
                    v-model="form.grantUserId"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="姓名/拼音/五笔"
                    :remote-method="selectAllUser"
                    :loading="selLoading"
                    @change="getGrantUserId"
                    clearable
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
              <LFormtTitle label="申请额度" :required="true" class="margin-top-8">
                <el-form-item prop="applyMoney">
                  <el-input
                    v-model="form.applyMoney"
                    placeholder="申请额度"
                    clearable
                    :disabled="form.grantOverdrawId?true:false"
                  ></el-input>
                </el-form-item>
              </LFormtTitle>
              <LFormtTitle label="申请原因" :required="true" class="margin-top-8">
                <el-form-item prop="applyReason">
                  <l-value-domain
                    code="grantAppyReason"
                    placeholder="请选择"
                    :value.sync="form.applyReason"
                    :disabled="form.grantOverdrawId?true:false"
                  />
                </el-form-item>
              </LFormtTitle>
              <LFormtTitle
                label="其他原因"
                :required="true"
                class="margin-top-8"
                v-if="form.applyReason == '0'"
              >
                <el-form-item prop="remark">
                  <el-input
                    v-model="form.remark"
                    placeholder="其他原因"
                    :disabled="form.grantOverdrawId?true:false"
                  ></el-input>
                </el-form-item>
              </LFormtTitle>
              <!-- <el-row :gutter="10" style="height:32px;" class="margin-top-20">
              <el-col :span="18" v-loading="smsLoading">
                <LFormtTitle label="验证码" :required="true">
                  <el-form-item prop="smsCaptcha">
                    <el-input v-model="form.smsCaptcha" placeholder="验证码"></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="6" class="heigth100 l-center-vertical">
                <el-button type="text" plain @click="getValCode">获取验证码</el-button>
              </el-col>
              </el-row>-->

              <LFormtTitle label="有效期" :required="true" class="margin-top-8">
                <el-form-item prop="validTime">
                  <el-date-picker
                    v-model="form.validTime"
                    type="date"
                    placeholder="授权截止日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :disabled="form.grantOverdrawId?true:false"
                    :picker-options="pickeroptions"
                  ></el-date-picker>
                </el-form-item>
              </LFormtTitle>
              <LFormtTitle
                label="撤销原因"
                :required="true"
                class="margin-top-8"
                v-if="form.grantOverdrawId?true:false"
              >
                <el-form-item prop="cancalReason">
                  <el-input v-model="form.cancalReason" placeholder="请输入"></el-input>
                </el-form-item>
              </LFormtTitle>
            </el-form>
            <div class="width100 button-cont clearfix">
              <el-button
                class="float-right"
                style="margin-left: 10px;"
                type="primary"
                @click="passApply"
                :disabled="(form.recordStatus && form.recordStatus == '0')? false:true"
              >授权</el-button>
              <el-button
                class="float-right"
                type="primary"
                @click="apply"
                :disabled="form.grantOverdrawId?true:false"
              >申请</el-button>
              <el-button
                class="float-right"
                type="primary"
                @click="cancalApply"
                :disabled="!form.grantOverdrawId?true:false || form.recordStatus == '2'"
              >撤销</el-button>
              <!-- <el-button type="primary">新增</el-button> -->
            </div>
          </div>
        </el-card>
      </div>
    </template>
  </l-layout>
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
      if (!this.form.grantUserId && !this.form.grantDepartmentId) {
        callback(new Error("授权部门或人员必选一个"));
      } else {
        callback();
      }
    };

    return {
      // 只能选择当天之后的日期
      pickeroptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      // 筛选
      checked: false,
      // 卡号
      cardData: "",
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
        },
        {
          prop: "patientName",
          label: "申请患者",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: false
        },
        {
          prop: "grantDepartmentName",
          label: "授权部门",
          align: "left",
          headerAlign: "center",
          width: "100",
          fixed: false
        },
        {
          prop: "grantUserName",
          label: "授权人员",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "grantMoney",
          label: "授权金额",
          align: "right",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "applyMoney",
          label: "申请额度",
          align: "right",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "applyReason",
          label: "申请原因",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "remark",
          label: "其他原因",
          align: "left",
          headerAlign: "center",
          width: "150"
        },
        {
          prop: "validTime",
          label: "有效时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        },
        {
          prop: "applyUserName",
          label: "申请人员",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "applyTime",
          label: "申请时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        },
        {
          prop: "grantRecycleType",
          label: "撤销方式",
          align: "left",
          headerAlign: "center",
          width: "120"
        },
        {
          prop: "cancelUserName",
          label: "撤销人员",
          align: "left",
          headerAlign: "center",
          width: "100"
        },
        {
          prop: "cancelTime",
          label: "撤销时间",
          align: "left",
          headerAlign: "center",
          width: "160"
        }
      ],
      // loading
      loading: false,
      // 表单
      form: {
        grantDepartmentId: "",
        grantDepartmentName: "",
        grantUserId: "",
        grantUserName: "",
        applyMoney: "",
        applyReason: "",
        remark: "",
        smsCaptcha: "",
        validTime: "",
        cancalReason: ""
      },
      rules: {
        grantDepartmentId: [
          // { required: true, message: "请选择授权部门", trigger: "blur" },
          { validator: valGrant, trigger: "blur" }
        ],
        grantUserId: [
          // { required: true, message: "请选择授权人员", trigger: "blur" },
          { validator: valGrant, trigger: "blur" }
        ],
        applyMoney: [
          { required: true, message: "请输入申请额度", trigger: "blur" },
          { validator: valApplyMoney, trigger: "blur" }
        ],
        applyReason: [
          { required: true, message: "请选择申请原因", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请填写其它原因", trigger: "blur" }
        ],
        smsCaptcha: [
          // { required: true, message: "请填写验证码", trigger: "blur" }
        ],
        validTime: [
          { required: true, message: "请选择有效期", trigger: "blur" }
        ]
      },
      // 当前患者
      patient: {},
      // 当前对象
      currentData: {},
      // 分页
      pageParams: {
        pageNo: 0,
        pageSize: 20,
        total: 0
      },
      // 撤销验证
      cancalReason: [
        { required: true, message: "请输入撤销原因", trigger: "blur" }
      ],
      // 验证码loading
      smsLoading: false,
      selectedPatientInfo: {},
      // 用户集合
      options: [],
      selLoading: false
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(value) {
        this.patient = value;
        this.getPrestoreGrantOverdrawPOs();
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
    // 查询用户
    async selectAllUser(val) {
      try {
        this.selLoading = true;
        let res = await service2.getAllUser({
          userName: val || ""
        });
        this.options = res.data;
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    // 读卡
    readCard(data) {
      this.changeRecPatientData(data);
      this.patient = { ...data };
      this.getPrestoreGrantOverdrawPOs();
    },
    // 获取授权透支明细
    async getPrestoreGrantOverdrawPOs() {
      try {
        this.loading = true;
        if (!this.selectedPatientInfo.patientId) {
          this.tableData = [];
          this.loading = false;
          return;
        }
        let res = await service.getPrestoreGrantOverdrawPOs({
          patientId: this.selectedPatientInfo.patientId,
          isLate: this.checked == true ? "1" : undefined,
          pageNo: this.pageParams.pageNo, // 页码
          pageSize: this.pageParams.pageSize // 页码大小
        });
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
      this.$set(this.rules, "cancalReason", this.cancalReason);
      this.$refs["form"].validate(async valid => {
        if (valid) {
          try {
            if (
              this.currentData.recordStatus != "0" &&
              this.currentData.recordStatus != "1"
            ) {
              this.$message.error("该申请状态不能撤销");
            }
            this.$showLoading();
            this.form.grantRecycleType = "2"; // 手动撤销
            let res = await service.recycleGrant(this.form);
            this.$message({ type: "success", message: "撤销成功" });
            this.getPrestoreGrantOverdrawPOs();
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "撤销失败");
          }
        }
      });
    },
    // 申请
    async apply() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          try {
            if (!this.selectedPatientInfo.patientId) {
              this.$message.error("请选择患者");
              return;
            }
            this.$showLoading();
            let obj = {
              ...this.form,
              patientId: this.selectedPatientInfo.patientId,
              patientName: this.selectedPatientInfo.patientName,
              patientCode: this.selectedPatientInfo.patientCode,
              patientGender: this.selectedPatientInfo.patientGender
            };
            let res = await service.apply(obj);
            this.$message({ type: "success", message: "申请成功" });
            this.add();
            this.getPrestoreGrantOverdrawPOs();
            this.$hideLoading();
          } catch (error) {
            console.info(error);
            this.$hideLoading();
            this.$message.error(error.msg || "申请失败");
          }
        }
      });
    },
    // 授权
    async passApply() {
      try {
        this.$showLoading();
        let res = await service.applyPass(this.currentData);
        this.$message({ type: "success", message: "授权成功" });
        this.add();
        this.getPrestoreGrantOverdrawPOs();
        // 刷新财务信息栏
        this.changeRecPatientData({});
        this.changeRecPatientData(this.selectedPatientInfo);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.mag || "授权失败");
      }
    },
    // 新增
    add() {
      this.currentData = {};
      this.$refs["form"] && this.$refs["form"].resetFields();
      this.form.grantOverdrawId = undefined;
      this.form = {
        grantDepartmentId: "",
        grantDepartmentName: "",
        grantUserId: "",
        grantUserName: "",
        applyMoney: "",
        applyReason: "",
        remark: "",
        smsCaptcha: "",
        validTime: "",
        cancalReason: ""
      };
      this.$set(this.form, "validTime", "");
    },
    rowClick(row) {
      this.currentData = row;
      this.form = { ...row };
      this.form.grantDepartmentId = parseInt(row.grantDepartmentId);
    },
    // 得到验证码
    async getValCode() {
      try {
        this.smsLoading = true;
        let res = await service.getMsgValidCode({});
        this.form.smsCaptcha = res.data;
        this.smsLoading = false;
      } catch (error) {
        this.smsLoading = false;
        this.$message.error(error.msg || "获取验证码失败");
      }
    },
    // 冗余赋值
    getGrantDepartmentName(id, data) {
      this.form.grantDepartmentName = data.orgNm;
    },
    getGrantUserId(id, data) {
      this.form.grantUserName = data.uname;
    },
    // 千位分隔
    formatNumber(a) {
      if (!a) {
        return "0.00";
      }
      let res = a
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
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
    listItemClickHandle(data) {
      this.selectedPatientInfo = data;
      this.selectedPatientInfo.age = this.selectedPatientInfo.patientAge
      this.getPrestoreGrantOverdrawPOs();
    }
  }
};
</script>
<style lang='scss' scoped>
> .el-table__body-wrapper {
  height: 100%;
}

.card {
  height: 100%;
  width: calc(100% - 295px);
  margin-right: 10px;
}

.tableTitle {
  height: 36px;
}

.checkbox {
  color: $l-color-black;
  font-size: $l-font-size;
  font-weight: $l-font-weight;
}

.margin-top-10 {
  margin-top: 10px;
}

.margin-top-20 {
  margin-top: 20px;
}

.patient-list {
  height: calc(100% - 63px);
}
.perstore-grant {
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
  .form-cont {
    height: calc(100% - 93px);
    position: relative;
    .button-cont {
      padding-top: 20px;
      border-top: 1px solid $l-color-bgcolor-11;
      position: absolute;
      bottom: 0;
    }
  }
}

/* 新添加样式 */
  .bg-contain {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: $l-bg-radius-max;
    overflow-y: inherit;
    // font-size: 0;
    box-sizing: border-box;
    .qrcode {
      width: 40px;
      height: 40px;
      margin-top: 7px;
      border: 1px solid $l-color-bgcolor-11;

      img {
        width: 100%;
        height: 100%;
      }
    }
    .patient-card /deep/ .patient-card-right{
          display: flex;
          align-items: center;
          justify-content: space-between;
    }
    .height-button-main{
        overflow-y: auto;
        height: calc(100% - 64px) !important;
    }
    .m-contain {
      height: calc(100% - 55px) !important;
      box-sizing: border-box;
      .top-con {
        margin-top: 17px;
        .top-con-tab {
          font-size: 12px;
          /deep/ .el-tabs__nav-wrap {
            padding-left: 18px;
            border-bottom: 1px solid $l-color-border-8;
          }

          .first-list {
            width: 854px;
            font-size: 0;
            .lay-item {
              display: inline-block;
              line-height: 17px;
              font-size: 12px;
              .item-title {
                display: inline-block;
                color: #949da3;
              }
              .item-contain {
                margin-left: 8px;
                display: inline-block;
                color: #2e323a;
              }
              .item-title-01 {
                width: 36px;
              }

              .item-title-02 {
                width: 48px;
              }

              .item-contain-01 {
                width: 146px;
              }

              .item-contain-02 {
                width: 101px;
              }
              .item-contain-03 {
                width: 93px;
              }
              .item-contain-04 {
                width: 270px;
              }
            }
          }


        }
      }
    }
  }
  .third-con {
    position: relative;
    font-size: 0;
    padding-left: 17px;
    .input-con {
      /deep/ .el-input {
        width: calc(100% - 56px);
      }
      /deep/ .el-button {
        margin-left: $l-margin-default-4;
      }
    }
    .third-contain {
      .show-con {
        width: 854px;
        padding: 12px $l-padding-default-6;
        line-height: 20px;
        font-size: 14px;
        background: $l-color-bgcolor-18;
        border-radius: $l-bg-radius-bg;
        .text-left {
          color: #666c70;
        }
        .text-right {
          margin-left: $l-margin-default-4;
          margin-right: 32px;
          color: #2e323a;
        }
      }
    }
    /deep/ .bottom-con {
      padding: 16px;
      position: absolute;
      bottom: 0;
      left: 0;
      height: 63px;
      border-top: 1px solid #e4e4e4;
    }
  }

</style>
