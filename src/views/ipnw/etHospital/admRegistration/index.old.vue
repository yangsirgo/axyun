<template>
  <div class="height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      patientCardType="hospital"
      @message="messageHandler"
      pageName="admRegistration"
    >
      <template #list>
        <left-bar type="apply" :Multiple="false" :isRegist="true"></left-bar>
      </template>
      <template #content>
        <div class="container height100" v-loading="loading">
          <div class="reg-form">
            <l-card-title>
              <div slot="left" class="report-cont-title">患者信息</div>
            </l-card-title>
            <el-form :model="ruleForm" ref="ruleForm" label-width="0" class="demo-ruleForm">
              <div class="patient-box clearfix">
                <div class="patient-photo float-left">
                  <img :src="headImg" alt=""/>
                </div>
                <div class="patient-info">
                  <el-row :gutter="10">
                    <el-col :span="6">
                      <el-form-item
                        prop="patientName"
                        :rules="[
                          { required: true, message: '请输入', trggier: 'blur' }
                        ]"
                      >
                        <l-formt-title label="姓名" :required="true">
                          <el-input v-model="ruleForm.patientName" placeholder="请输入内容"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item prop="patientGender">
                        <l-formt-title
                          label="性别"
                          :required="true"
                          :rules="[
                            {
                              required: true,
                              message: '请选择',
                              trggier: 'change'
                            }
                          ]"
                        >
                          <l-value-domain code="GENDER_CODE" :value.sync="ruleForm.patientGender" />
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item prop="birthDate">
                        <l-formt-title label="出生日期">
                          <el-date-picker
                            v-model="ruleForm.birthDate"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="请选择日期"
                            :picker-options="pickerOptions2"
                          ></el-date-picker>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>

                    <el-col :span="6">
                      <el-form-item prop="patientAge">
                        <l-formt-title label="年龄" disabled>
                          <el-input disabled v-model="ruleForm.patientAge" placeholder="请输入内容"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="6">
                      <el-form-item prop="maritalStatus">
                        <l-formt-title label="婚姻">
                          <l-value-domain
                            code="MARITAL_STATUS_CODE"
                            :value.sync="ruleForm.maritalStatus"
                          />
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item prop="bloodType">
                        <l-formt-title label="血型">
                          <l-value-domain code="BLOOD_TYPE_CODE" :value.sync="ruleForm.bloodType" />
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item prop="nationCode">
                        <l-formt-title label="民族">
                          <l-value-domain
                            code="NATIONAL_NAME_CODE"
                            :value.sync="ruleForm.nationCode"
                          />
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item prop="careerCode">
                        <l-formt-title label="职业">
                          <l-value-domain
                            code="OCCUPATIONAL_CLASSIFICATION_CODE"
                            :value.sync="ruleForm.careerCode"
                          />
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="6">
                      <el-form-item prop="identificationType">
                        <l-formt-title label="证件类型">
                          <l-value-domain
                            code="MARK_TYPE_CODE"
                            :value.sync="ruleForm.identificationType"
                          />
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item prop="identificationNum">
                        <l-formt-title label="证件号码">
                          <el-input v-model="ruleForm.identificationNum" placeholder="请输入内容"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item prop="phoneNum">
                        <l-formt-title label="联系方式">
                          <el-input v-model="ruleForm.phoneNum" placeholder="请输入内容"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item prop="email">
                        <l-formt-title label="邮箱">
                          <el-input v-model="ruleForm.email" placeholder="请输入内容"></el-input>
                        </l-formt-title>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item prop="addrCode">
                    <l-formt-title label="联系地址">
                      <l-value-domain
                        type="cascader"
                        code="AdministrativDivision"
                        :value.sync="ruleForm.addrCode"
                        class="select-container"
                        remoteValueKey="id"
                        remoteShowKey="label"
                        :multiple="false"
                        :relation="true"
                        :placeholder="$t('base.placeholder')"
                        @change="contactChange"
                        key="key3"
                      ></l-value-domain>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="patientAddr">
                    <l-formt-title label="具体地址">
                      <el-input v-model="ruleForm.patientAddr" placeholder="请输入内容"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row
                :gutter="10"
                class="contacts-box"
                v-for="(item, index) in ruleForm.contacts"
                :key="item.key"
              >
                <el-col :span="4">
                  <el-form-item
                    :prop="'contacts.' + index + '.contactsType'"
                    :rules="[
                      { required: true, message: '请选择', trigger: 'change' }
                    ]"
                  >
                    <l-formt-title label="类型" :required="true">
                      <l-value-domain
                        code="contactType"
                        placeholder="请选择"
                        :value.sync="item.contactsType"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item
                    :prop="'contacts.' + index + '.name'"
                    :rules="[
                      { required: true, message: '请输入', trigger: 'blur' }
                    ]"
                  >
                    <l-formt-title label="姓名" :required="true">
                      <el-input v-model="item.name" placeholder="请输入"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item
                    :prop="'contacts.' + index + '.relation'"
                    :rules="[
                      { required: true, message: '请选择', trigger: 'change' }
                    ]"
                  >
                    <l-formt-title label="关系" :required="true">
                      <l-value-domain
                        code="RELATION_CODE"
                        placeholder="请选择"
                        :value.sync="item.relation"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item
                    :prop="'contacts.' + index + '.phone'"
                    :rules="[
                      { required: true, message: '请输入', trigger: 'blur' }
                    ]"
                  >
                    <l-formt-title label="联系方式" :required="true">
                      <el-input v-model="item.phone" placeholder="请输入"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item :prop="'contacts.' + index + '.idCardNum'">
                    <l-formt-title label="身份证号">
                      <el-input v-model="item.idCardNum" placeholder="请输入"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <div class="remove-contact" title="移除" @click="removeContact(item)">
                  <i class="iconfont iconshanchu"></i>
                </div>
              </el-row>
              <!-- <div class="add-contacts" @click="addContact">+添加联系人</div> -->
              <div class="add-line"></div>
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item
                    prop="admissionTime"
                    :rules="[
                      { required: true, message: '请选择', trigger: 'change' }
                    ]"
                  >
                    <l-formt-title label="入院时间" :required="true">
                      <el-date-picker
                        v-model="ruleForm.admissionTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions"
                      ></el-date-picker>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    prop="admissionSituation"
                    :rules="[
                      { required: true, message: '请选择', trigger: 'change' }
                    ]"
                  >
                    <l-formt-title label="入院病情" :required="true">
                      <l-value-domain
                        code="EntranceCode"
                        :value.sync="ruleForm.admissionSituation"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    prop="admissionDiag"
                    :rules="[
                      { required: true, message: '请选择', trigger: 'change' }
                    ]"
                  >
                    <l-formt-title label="入院诊断" :required="true">
                      <el-input v-model="ruleForm.admissionDiag" placeholder="请输入内容"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    prop="admissionMode"
                    :rules="[
                      { required: true, message: '请选择', trigger: 'change' }
                    ]"
                  >
                    <l-formt-title label="入院途径" :required="true">
                      <l-value-domain code="InType" :value.sync="ruleForm.admissionMode" />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item
                    prop="admissionSdeptId"
                    :rules="[
                      { required: true, message: '请选择', trigger: 'change' }
                    ]"
                  >
                    <l-formt-title label="科室" :required="true">
                      <l-value-domain
                        remoteUrl="/appointment/doctorSchedule/getDept"
                        :value.sync="ruleForm.admissionSdeptId"
                        remoteShowKey="deptName"
                        remoteValueKey="deptId"
                        placeholder="请选择"
                        @change="getDeptId"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item prop="manageDoctorId">
                    <l-formt-title label="入院医生">
                      <el-select
                        v-model="ruleForm.manageDoctorId"
                        placeholder="请选择"
                        @change="getDoctorName"
                      >
                        <el-option
                          v-for="item in doctorList"
                          :key="item.uid"
                          :label="item.uname"
                          :value="item.uid"
                        ></el-option>
                      </el-select>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    prop="admissionWdeptId"
                    :rules="[
                      { required: true, message: '请选择', trigger: 'change' }
                    ]"
                  >
                    <l-formt-title label="病区" :required="true">
                      <l-value-domain
                        remoteUrl="/wadmin/ward-hos?hosId=91"
                        :value.sync="ruleForm.admissionWdeptId"
                        remoteShowKey="wardName"
                        remoteValueKey="wardCode"
                        placeholder="请选择"
                        @change="changeWard"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    prop="isHomeBed"
                    :rules="[
                      { required: true, message: '请选择', trigger: 'change' }
                    ]"
                  >
                    <l-formt-title label="是否家庭病床">
                      <el-select
                        v-model="ruleForm.isHomeBed"
                        placeholder="请选择"
                        @change="changeWard"
                      >
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                      </el-select>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <l-dept-doctor
                :first="{
                  name:'orgNm',
                  value:'id',
                  model: ruleForm.admissionSdeptId,
                  prop:'admissionSdeptId',
                  label:'科室',
                  required:true,
                  rules:[{ required: true, message: '请选择', trigger: 'change' }]
                  }"
                :second="{
                  name:'uname',
                  value:'uid',
                  model: ruleForm.manageDoctorId,
                  prop:'manageDoctorId',
                  label:'入院医生',
                  required:false
                  }"
                :clearParams="clearParams"
                remoteUrl="/wadmin/dept-doctor"
                @first-value="getDeptInfo"
                @second-value="getDoctorInfo"
              ></l-dept-doctor>-->
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-form-item prop="bedId">
                    <l-formt-title label="床号">
                      <el-select v-model="ruleForm.bedId" placeholder="请选择">
                        <el-option
                          v-for="item in bedListData"
                          :key="item.bedId"
                          :label="item.bedCode"
                          :value="item.bedId"
                        ></el-option>
                      </el-select>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    prop="settlementType"
                    :rules="[
                      { required: true, message: '请选择', trigger: 'change' }
                    ]"
                  >
                    <l-formt-title label="结算类型" :required="true">
                      <l-value-domain
                        code="MEDICAL_INSURANCE_CODE"
                        :value.sync="ruleForm.settlementType"
                        placeholder="请选择"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                  <el-form-item prop="nursingLevel">
                    <l-formt-title label="护理等级">
                      <l-value-domain
                        code="nursingLevel"
                        placeholder="请选择"
                        :value.sync="ruleForm.nursingLevel"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>-->
                <el-col :span="6">
                  <el-form-item prop="settlementType">
                    <l-formt-title label="个体危险性">
                      <l-value-domain
                        code="DANGER_CODE"
                        placeholder="请选择"
                        :value.sync="ruleForm.securityRisk"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>
                <!--  <el-col :span="6">
                  <el-form-item prop="settlementType">
                    <l-formt-title label="饮食类型">
                      <l-value-domain
                        code="food"
                        placeholder="请选择"
                        :value.sync="ruleForm.dietType"
                      />
                    </l-formt-title>
                  </el-form-item>
                </el-col>-->

                <el-col :span="6">
                  <el-form-item prop="greenChannel">
                    <l-formt-title label="是否绿色通道">
                      <el-select v-model="ruleForm.greenChannel" placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                      </el-select>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="18">
                  <el-form-item prop="remark">
                    <l-formt-title label="备注">
                      <el-input v-model="ruleForm.remark" placeholder="请输入内容"></el-input>
                    </l-formt-title>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="handler-box">
            <el-button
              type="primary"
              class="float-left"
              @click="recharge = true"
              v-if="opPatientInfo.billStatus ? opPatientInfo.billStatus !== 1 ? true : false : false"
            >交预缴金</el-button>
            <el-button
              type="primary"
              @click="submit"
              :disabled="!buttonIsUse"
              :loading="submitLoading"
              v-if="opPatientInfo.billStatus && opPatientInfo.billStatus == '1'"
              v-hotKey="{ func: 'func_submit', flag: 'submitLoading' }"
            >完成登记</el-button>
            <!-- <el-button @click="resetForm" type="primary" plain>清屏</el-button> -->
          </div>
        </div>
      </template>
    </l-layout>
    <el-dialog
      title="交预缴金"
      :visible.sync="recharge"
      :destroy-on-close="true"
      width="50%"
      @close="rechargeClose"
    >
      <div class="contain">
        <div class="dialog-header">
          <el-form
            :model="accountRechargeForm"
            :rules="accountRechargeRules"
            ref="accountRechargeForm"
          >
            <div class="detail">
              <div class="title">
                <span>{{ rechargeInfo.patientName || "--" }}</span>
                <span :val="rechargeInfo.patientGender" code="GENDER_CODE" v-codeTransform></span>
                <span>
                  {{
                  rechargeInfo.patientAge
                  ? rechargeInfo.patientAge
                  : "--"
                  }}
                </span>
              </div>
              <div class="detail-cont">
                <div class="detail-cont-item type">
                  充值类型
                  <i>预存账户</i>
                </div>
                <div class="detail-cont-item ticket">
                  印刷发票
                  <i>预存账户</i>
                </div>
                <div class="detail-cont-item ticket">
                  账户余额
                  <i>{{prepayBalance.toFixed(2) || '0.00'}}（元）</i>
                </div>
              </div>
            </div>
            <div class="rechargeMethod">
              <div class="title">请选择支付方式</div>
              <div class="clearfix" style="margin-bottom: 20px">
                <el-form-item label label-width="0" prop="payTypeId">
                  <el-radio-group
                    v-model="accountRechargeForm.payTypeId"
                    style="display:block;font-size:inherit;"
                  >
                    <el-row :gutter="10">
                      <el-col :span="12" class="margin10">
                        <!--<el-radio v-model="accountRechargeForm.payTypeId" label="1" border style="width:100%;">现金支付</el-radio>-->
                        <el-row class="radio-item">
                          <el-col :span="22">
                            <span
                              style="display:inline-block;vertical-align: sub;margin-right:10px"
                            >
                              <svg
                                t="1568712240954"
                                class="icon"
                                viewBox="0 0 1137 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="8446"
                                width="20"
                                height="20"
                              >
                                <path
                                  d="M113.777778 0h910.222222a113.777778 113.777778 0 0 1 113.777778 113.777778v796.444444a113.777778 113.777778 0 0 1-113.777778 113.777778H113.777778a113.777778 113.777778 0 0 1-113.777778-113.777778V113.777778a113.777778 113.777778 0 0 1 113.777778-113.777778z m512 341.333333H512V227.555556a56.888889 56.888889 0 1 0-113.777778 0v113.777777H341.333333a56.888889 56.888889 0 0 0 0 113.777778h170.666667v113.777778H341.333333a56.888889 56.888889 0 0 0 0 113.777778h170.666667v113.777777a56.888889 56.888889 0 0 0 113.777778 0v-113.777777h170.666666a56.888889 56.888889 0 0 0 0-113.777778h-170.666666V455.111111h170.666666a56.888889 56.888889 0 0 0 0-113.777778h-56.888888V227.555556a56.888889 56.888889 0 1 0-113.777778 0v113.777777z"
                                  fill="#38A79C"
                                  p-id="8447"
                                />
                              </svg>
                            </span>
                            现金支付
                          </el-col>
                          <el-col :span="2">
                            <el-radio
                              @change="payTypeChange"
                              class="ft0"
                              label="df7bf42d3b434e7bac0c3c38a6f9043e"
                              style="width:100%;font-size:;"
                            ></el-radio>
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="12" class="margin10">
                        <el-row class="radio-item">
                          <el-col :span="22">
                            <span
                              style="display:inline-block;vertical-align: sub;margin-right:10px"
                            >
                              <svg
                                t="1568712620167"
                                class="icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="8758"
                                width="20"
                                height="20"
                              >
                                <path
                                  d="M455.111111 512H227.555556v113.777778h227.555555v227.555555h113.777778v-227.555555h227.555555V512h-227.555555V398.222222h227.555555V284.444444H227.555556v113.777778h227.555555v113.777778zM0 0h1024v1024H0V0z m341.333333 170.666667v113.777777h113.777778V170.666667H341.333333z m227.555556 0v113.777777h113.777778V170.666667h-113.777778z"
                                  fill="#ff5300"
                                  p-id="8759"
                                />
                              </svg>
                            </span>
                            预存账户
                          </el-col>
                          <el-col :span="2">
                            <el-radio
                              @change="payTypeChange"
                              class="ft0"
                              label="9f9ded322c484715b954f6ad35d3aa4f"
                              style="width:100%;"
                            ></el-radio>
                          </el-col>
                        </el-row>
                      </el-col>
                      <!-- <el-col :span="12" class="margin10">
                        <el-row class="radio-item">
                          <el-col :span="22">
                            <span
                              style="display:inline-block;vertical-align: sub;margin-right:10px"
                            >
                              <svg
                                t="1568712498724"
                                class="icon"
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="8602"
                                width="20"
                                height="20"
                              >
                                <path
                                  d="M0 481.848889h481.848889V0H0v481.848889z m120.490667-361.358222h240.924444v240.924444H120.490667V120.490667zM542.094222 0v481.848889H1024V0H542.151111z m361.415111 361.415111h-240.924444V120.490667h240.924444v240.924444zM0 1024h481.848889V542.151111H0V1024z m120.490667-361.415111h240.924444v240.924444H120.490667v-240.924444zM542.094222 1024h120.490667v-120.490667H542.094222V1024z m120.490667-361.415111v240.924444h120.490667v-240.924444h-120.490667z m240.924444 240.924444h-120.433777V1024H1024v-240.924444h-120.490667v120.433777z m0-240.924444H1024V542.151111h-120.490667v120.490667zM542.151111 542.151111v120.490667h120.490667V542.151111H542.094222z"
                                  fill="#2E323A"
                                  p-id="8603"
                                />
                              </svg>
                            </span>
                            扫码支付
                          </el-col>
                          <el-col :span="2">
                            <el-radio class="ft0" label="2" style="width:100%;">2</el-radio>
                          </el-col>
                        </el-row>
                      </el-col>-->
                    </el-row>
                    <el-row :gutter="10">
                      <!-- <el-col :span="12" class="margin10">
                        <el-row class="radio-item">
                          <el-col :span="22">
                            <span
                              style="display:inline-block;vertical-align: sub;margin-right:10px"
                            >
                              <svg
                                t="1571973057805"
                                class="icon"
                                viewBox="0 0 1228 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="11397"
                                width="20"
                                height="20"
                              >
                                <path
                                  d="M102.4 0h1024a102.4 102.4 0 0 1 102.4 102.4v819.2a102.4 102.4 0 0 1-102.4 102.4H102.4a102.4 102.4 0 0 1-102.4-102.4V102.4a102.4 102.4 0 0 1 102.4-102.4z m716.8 256a51.2 51.2 0 0 0 0 102.4h204.8a51.2 51.2 0 0 0 0-102.4h-204.8z m0 204.8a51.2 51.2 0 0 0 0 102.4h204.8a51.2 51.2 0 0 0 0-102.4h-204.8z m0 204.8a51.2 51.2 0 0 0 0 102.4h204.8a51.2 51.2 0 0 0 0-102.4h-204.8zM227.328 563.2A73.728 73.728 0 0 0 153.6 636.928v106.496c0 13.568 11.008 24.576 24.576 24.576h411.648a24.576 24.576 0 0 0 24.576-24.576v-106.496A73.728 73.728 0 0 0 540.672 563.2H227.328z m152.7296-51.2a128 128 0 1 0 0-256 128 128 0 0 0 0 256z"
                                  p-id="11398"
                                  fill="#3D7DFB"
                                />
                              </svg>
                            </span>
                            账户支付
                          </el-col>
                          <el-col :span="2">
                            <el-radio class="ft0" label="3" style="width:100%;">3</el-radio>
                          </el-col>
                        </el-row>
                      </el-col>-->
                    </el-row>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="sum">
                <div style="width:50%">
                  <LFormtTitle label="充值金额" required>
                    <el-form-item prop="prestoreMoney">
                      <el-input
                        v-model="accountRechargeForm.prestoreMoney"
                        oninput="value=value.replace(/[^\d.]/g,'')"
                        style="line-height: 34px;width:100%"
                      ></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rechargeFunc" :loading="rechargeLoading">确定</el-button>
        <el-button @click="cancelRecharge">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import LeftBar from "./components/finLeftBar";
import { getPatintInfo, queryBed } from "@/api/cis/admApplication/index";
import {
  getPatientInfo,
  admRegistration,
  payMent,
  getDeptDoctorList,
  getInpPatientInfo
} from "@/api/ipnw/etHospital.js";
import inpService from "@/api/financeManagement/inp.js";
import { mapGetters, mapActions } from "vuex";
import { deepClone, dateFtt } from "@/utils/index.js";

export default {
  name: "admRegistration",
  components: { LeftBar },
  data() {
    var validatePass = (rule, value, callback) => {
      // 验证
      let valRule = /^(\d*)(\d*)(\.\d{1,2})?$/;
      if (valRule.test(value) === false) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (value && value.indexOf(".") == 0) {
        callback(new Error("只能输入数字或两位小数"));
      } else if (value.toString().length > 10) {
        callback(new Error("只能输入十位数字"));
      } else {
        callback();
      }
    };

    return {
      toolBoxs: ["admitRegistrState", "Hotkey"],
      opPatientInfo: {},
      // 头像
      headImg: require("@/assets/pojehjdz.jpeg"),
      // 表单数据
      ruleForm: {
        // 联系地址code
        addrCode: [],
        // 联系地址省市区
        addrProvince: "",
        addrCity: "",
        addrDistrict: "",
        patientName: "",
        patientGender: "",
        patientAge: "",
        birthDate: "",
        maritalStatus: "",
        bloodType: "",
        nationCode: "",
        careerCode: "",
        identificationType: "",
        identificationNum: "",
        phoneNum: "",
        email: "",
        patientAddr: "",
        settlementType: "",
        manageDoctorId: "",
        manageDoctorName: "",
        admissionTime: "",
        admissionSituation: "",
        admissionDiag: "",
        admissionMode: "",
        admissionSdeptId: "",
        admissionWdeptId: "",
        bedId: "",
        isHomeBed: "0",
        greenChannel: "",
        remark: "",
        // 联系人列表
        contacts: [
          {
            key: Date.now(),
            contactsType: "",
            name: "",
            relation: "",
            phone: "",
            idCardNum: ""
          }
        ],
        nursingLevel: "",
        securityRisk: "",
        dietType: ""
      },
      // 病区列表
      bedListData: [],
      // 年龄是否大于1岁
      moreThanOne: true,
      // 岁
      ageYear: "",
      // 月
      ageMonth: "",
      // 天
      ageDay: "",
      loading: false,
      clearParams: false,
      submitLoading: false,
      recharge: false,
      rechargeInfo: {},
      rechargeLoading: false,
      doctorList: [],
      accountRechargeForm: {
        prestoreMoney: "",
        payTypeId: ""
      },
      accountRechargeRules: {
        prestoreMoney: [
          { required: true, message: "请填写预缴金额", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ]
      },
      // 拟入院日期只允许选择今天之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      // 出生日期只允许选择今天之前
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      birthTimeOption: {
        selectableRange: "00:00:00 - 23:59:59"
      },

      payTypeName: {
        1: "现金",
        8: "银联支付"
      },
      // 是否允许刷新左侧患者列表
      refreshLeftList: false,
      // 预交金余额
      prepayBalance: 0,
      // 支付方式集合
      payTypeList: [],
      //登记信息留存
      buttonIsUse:true
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("ipnw", ["entryHosId"]),
    age() {
      return this.ruleForm.birthDate;
    },
    getBillStatus() {
      return this.receivePatientData.billStatus;
    }
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler(val) {
        // debugger
        // this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
        if(this.rechargeInfo.patientId!==val.patientId){
            this.buttonIsUse=true
          }
        if (val.patientId) {
          this.rechargeInfo = val;
          this.getAccount(val);
          if (val.billStatus === 1) {
            this.loadPatientInfo();
          } else {
            this.loadInpPatientInfo();
          }
        }
      }
    },
    age: {
      immediate: true,
      handler(val) {
        if (val) {
          this.calculatingAge(val);
        } else {
          this.clearAge();
        }
      }
    }
  },
  beforeCreated() {
    this.changeRecPatientData({});
  },
  mounted() {
    this.getPayTypeByAuth();
  },
  methods: {
    ...mapActions({
      setReloadKey: "base/changeSearchAgainKey",
      changeRecPatientData: "base/changeRecPatientData"
    }),
    // 查询支付方式
    async getPayTypeByAuth() {
      try {
        this.$showLoading();
        let res = await inpService.getPayTypeByAuth({});
        this.payTypeList = res.data;
        console.info("sdasdas", this.payTypeList);
        this.$hideLoading();
      } catch (error) {
        console.info(error);
        this.$hideLoading();
        this.$message.error(error.msg || "获取支付方式失败");
      }
    },
    // 选择支付方式
    payTypeChange(data) {
      this.payTypeList.forEach(val => {
        if (data == val.payTypeId) {
          this.accountRechargeForm.payTypeCode = val.payTypeCode;
          this.accountRechargeForm.payTypeName = val.payTypeName;
        }
      });
    },
    // 获取预交金余额
    async getAccount(data) {
      if (!data.inpCode) {
        return;
      }
      try {
        let res = await getInpPatientInfo(data.inpCode);
        if (res.data && res.data.prepayBalance) {
          this.prepayBalance = res.data.prepayBalance || 0;
        } else {
          this.prepayBalance = 0;
        }
      } catch (error) {
        console.info(error);
        this.$message.error(error.msg || "获取预交金余额失败");
      }
    },
    // eslint-disable-next-line complexity
    async loadPatientInfo() {
      this.opPatientInfo = {};
      this.resetForm();
      this.$set(this.ruleForm, "contacts", [
        {
          key: Date.now(),
          contactsType: "",
          name: "",
          relation: "",
          phone: "",
          idCardNum: ""
        }
      ]);
      if (!this.receivePatientData.applyId) {
        return;
      }
      this.loading = true;
      try {
        // 获取入院申请信息
        let res = await getPatientInfo({ id: this.receivePatientData.applyId });

        if (res.code === 1) {
          this.opPatientInfo = res.data || {};
          this.getBedList(res.data.admWard);
          this.getDoctor(res.data.admDept);
          // // 获取省市区
          // let address;
          // if (
          //   res.data.addrProvince &&
          //   res.data.addrCity &&
          //   res.data.addrDistrict
          // ) {
          //   address = [
          //     +res.data.addrProvince,
          //     +res.data.addrCity,
          //     +res.data.addrDistrict
          //   ];
          // } else {
          //   address = [];
          // }
          let newData = {
            // addrCode: address,
            applyId: this.receivePatientData.applyId,
            patientName: res.data.patientName || "",
            patientGender: res.data.patientGender || "",
            birthDate: res.data.patientBirthday,
            patientAge: this.receivePatientData.patientAge,
            phoneNum: res.data.mobileNum || "",
            maritalStatus: res.data.maritalStatus
              ? "" + res.data.maritalStatus
              : "",
            bloodType: res.data.bloodType || "",
            nationCode: res.data.nationCode || "",
            careerCode: res.data.careerCode || "",
            identificationType: res.data.identificationType || "",
            identificationNum: res.data.identificationNum || "",
            contacts: [
              {
                contactsType: res.data.contactsType || "",
                name: res.data.contacts || "",
                relation: res.data.relationShip || "",
                phone: res.data.contactsPhone || "",
                idCardNum: res.data.contactsIdentificationNum || "",
                key: Date.now()
              }
            ],
            admissionMode: res.data.admType || "",
            admissionSituation: res.data.criticalLevel || "",
            admissionTime:
              res.data.finAdmissionTime ||
              dateFtt(new Date(), "yyyy-MM-dd hh:mm:ss"),
            admissionDiag: res.data.opDiagnoses || "",
            // patientAddr: res.data.familyAddress || "",
            admissionSdeptId: +res.data.admDept || "",
            admissionWdeptId: res.data.admWard || "",
            bedId: res.data.admBedno || "",
            addrProvince: res.data.addrProvince || "",
            addrCity: res.data.addrCity || "",
            addrDistrict: res.data.addrDistrict || "",
            isHomeBed: res.data.isHomeBed || "0"
          };
          this.ruleForm = newData;
          newData = null;
        }
        // 获取患者档案信息
        let resp = await getPatintInfo(this.receivePatientData.patientId);
        if (resp.code === 1) {
          let newData = {
            phoneNum: resp.data.archInfo.mobileNum || "",
            bloodType: resp.data.archInfo.bloodType || "",
            nationCode: resp.data.archInfo.nationCode || "",
            careerCode: resp.data.archCompany.careerCode || ""
          };
          // 患者档案信息获取省市区
          let address;
          for (var n = 0; n < resp.data.archAddrList.length; n++) {
            if (resp.data.archAddrList[n].addrType === "2") {
              if (
                resp.data.archAddrList[n].addrProvince &&
                resp.data.archAddrList[n].addrCity &&
                resp.data.archAddrList[n].addrDistrict
              ) {
                address = [
                  +resp.data.archAddrList[n].addrProvince,
                  +resp.data.archAddrList[n].addrCity,
                  +resp.data.archAddrList[n].addrDistrict
                ];
                this.ruleForm.patientAddr =
                  resp.data.archAddrList[n].detailAddr;
              } else {
                address = [];
              }
            } else {
              address = [];
            }
          }
          this.ruleForm.addrCode = address;

          this.ruleForm = {
            ...this.ruleForm,
            ...newData
          };
          newData = null;
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$message.error(e.msg || "获取入院申请信息失败");
      }
    },
    loadInpPatientInfo() {
      this.opPatientInfo = {};
      this.resetForm();
      if (!this.receivePatientData.inpCode) {
        return;
      }
      this.loading = true;
      getInpPatientInfo(this.receivePatientData.inpCode)
        .then(res => {
          if (res.code === 1) {
            this.opPatientInfo = res.data || {};
            this.$set(this.opPatientInfo, "billStatus", "2");
            this.getBedList(res.data.admissionWdeptId);
            this.getDoctor(+res.data.admissionSdeptId);
            const contactsList = res.data.patientContacts
              ? res.data.patientContacts
              : [];
            const contactsArr = contactsList.map(item => {
              return {
                ...item,
                key: item.contactsId
              };
            });
            let newData = {
              ...res.data,
              admissionSdeptId: +res.data.admissionSdeptId || "",
              admissionTime:
                res.data.finAdmissionTime ||
                dateFtt(new Date(), "yyyy-MM-dd hh:mm:ss"),
              addrCode: res.data.addrProvince
                ? [
                    res.data.addrProvince,
                    res.data.addrCity,
                    res.data.addrDistrict
                  ]
                : [],
              contacts: contactsArr
            };
            this.ruleForm = newData;
            newData = null;
          }
          this.loading = false;
        })
        .catch(err => {
          console.info(err);
          this.loading = false;
          this.$message.error(err.msg || "获取病人档案失败");
        });
    },
    // 监听病区修改
    changeWard() {
      this.getBedList();
    },
    // 获取床位
    getBedList() {
      this.$set(this.ruleForm, "bedId", "");
      queryBed({
        wardCode: this.ruleForm.admissionWdeptId,
        isHomeBed: this.ruleForm.isHomeBed
      })
        .then(res => {
          this.bedListData = [];
          if (res.code === 1) {
            this.bedListData = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 工具箱
    messageHandler(val) {},
    // 完成登记
    submit() {
      const patientId = this.opPatientInfo.patientId;
      if (!patientId) {
        this.$message.warning("请选择患者");
        return;
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          if (this.ruleForm.manageDoctorId) {
            this.getDoctorName(this.ruleForm.manageDoctorId);
          }
          let data = deepClone(this.ruleForm);
          const conList = data.contacts.map(item => {
            return {
              ...item,
              idCardNum: item.idCardNum === "" ? null : item.idCardNum,
              patientId: patientId
            };
          });
          data = {
            ...data,
            contacts: conList,
            patientId: patientId,
            // 主诊断code
            admissionDiagCode: this.opPatientInfo.opDiagnosesCode
          };
          admRegistration(data)
            .then(res => {
              if (res.code === 1) {
                this.$message.success("入院登记成功");
                this.$set(this.rechargeInfo, "inpCode", res.data.inpCode);
                this.$set(
                  this.opPatientInfo,
                  "billStatus",
                  res.data.billStatus
                );
                this.refreshLeftList = true;
                this.recharge = true;
                this.buttonIsUse=false;
              } else {
                this.$message.error(res.msg || "入院登记失败");
              }
              this.submitLoading = false;
            })
            .catch(err => {
              this.submitLoading = false;
              this.$message.error(err || "入院登记失败");
            });
        }
      });
    },
    // 重置表单
    resetForm() {
      this.clearParams = !this.clearParams;
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      this.ruleForm.contacts.forEach((item, index) => {
        let data = {
          ...item,
          contactsType: "",
          name: "",
          relation: "",
          phone: "",
          idCardNum: ""
        };
        this.$set(this.ruleForm.contacts, index, data);
      });
    },
    // 添加联系人
    addContact() {
      this.ruleForm.contacts.push({
        key: Date.now(),
        contactsType: "",
        name: "",
        relation: "",
        phone: "",
        idCardNum: ""
      });
    },
    // 移除联系人
    removeContact(item) {
      const i = this.ruleForm.contacts.indexOf(item);
      if (i !== -1) {
        this.ruleForm.contacts.splice(i, 1);
      }
    },
    // 根据生日计算年龄
    calculatingAge(age) {
      // 生日
      const date = age.split(" ")[0].split("-");
      const birthYear = date[0];
      const birthMonth = date[1];
      const birthDay = date[2];

      //当前年月日
      const now = new Date();
      const nowYear = now.getFullYear();
      const nowMonth = now.getMonth() + 1;
      const nowDay = now.getDate();

      if (birthYear >= nowYear && birthMonth >= nowMonth && birthDay > nowDay) {
        this.$message.warning("请选择正确的生日!");
        this.clearAge();
        return;
      }

      let $lyear = nowYear - birthYear;
      let $lmonth = nowMonth - birthMonth;
      let $lday = nowDay - birthDay;

      if ($lday < 0) {
        $lmonth -= 1;
        $lday += new Date(nowYear, nowMonth - 1, 0).getDate();
      }

      if ($lmonth < 0) {
        $lyear -= 1;
        $lmonth += 12;
      }

      this.ageYear = $lyear;
      this.ageMonth = $lmonth;
      this.ageDay = $lday;
    },
    // 清空年龄
    clearAge() {
      this.ageYear = "";
      this.ageMonth = "";
      this.ageDay = "";
    },
    // 获取科室信息
    getDeptInfo(val, item) {
      this.ruleForm.admissionSdeptId = val;
    },
    //获取医生信息
    getDoctorName(val) {
      const curDoctor = this.doctorList.find(item => item.uid === val);
      this.ruleForm.manageDoctorName = curDoctor.uname || "";
    },
    // 确定充值
    rechargeFunc() {
      /* if (isNaN(+this.rechargeInfo.prestoreMoney)) {
          this.$message.warning("请填写正确的充值金额");
          return;
        } */
        if(!this.accountRechargeForm.payTypeId || this.accountRechargeForm.payTypeId == ''){
          this.$message.error("请选择支付方式");
          return;
        }
      this.$refs.accountRechargeForm.validate(valid => {
        if (valid) {
          this.rechargeLoading = true;
          payMent({
            inpCode: this.rechargeInfo.inpCode,
            prepayMoney: this.accountRechargeForm.prestoreMoney,
            payTypeId: this.accountRechargeForm.payTypeId,
            payTypeName: this.accountRechargeForm.payTypeName,
            payTypeCode: this.accountRechargeForm.payTypeCode,
            businessType: "1",
            recordStatus: "1"
          })
            .then(res => {
              this.rechargeLoading = false;
              if (res.code === 1) {
                this.$message.success("充值成功");
                this.$refs.accountRechargeForm.resetFields();
                this.recharge = false;
                this.getAccount(this.rechargeInfo);
              } else {
                this.$message.error(res.msg || "充值失败");
              }
            })
            .catch(err => {
              this.rechargeLoading = false;
              this.$message.error("充值失败");
            });
        }
      });
    },
    // 取消充值
    cancelRecharge() {
      this.recharge = false;
      this.$refs.accountRechargeForm.resetFields();
    },
    // 联系地址级联
    contactChange(val, cur) {
      this.setAddress(val);
    },
    // 设置地址名称
    setAddress(val) {
      this.ruleForm.addrProvince = val[0] || "";
      this.ruleForm.addrCity = val[1] || "";
      this.ruleForm.addrDistrict = val[2] || "";
    },
    getDeptId(val) {
      this.ruleForm.manageDoctorId = "";
      this.ruleForm.manageDoctorName = "";
      this.getDoctor(val);
    },
    getDoctor(id) {
      this.doctorList.splice(0);
      getDeptDoctorList(id)
        .then(res => {
          if (res.code === 1) {
            this.doctorList = res.data;
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 预缴金关闭
    rechargeClose() {
      if (this.refreshLeftList) {
        this.refreshLeftList = false;
        this.setReloadKey(+new Date());
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: $l-color-white;
}

.reg-form {
  height: calc(100% - 77px);
  padding: 0 20px;
  overflow: hidden;
  overflow-y: auto;
}

.handler-box {
  padding: 20px;
  border-top: 1px solid $l-color-bgcolor-11;
  text-align: right;
}

.patient-photo {
  padding: 3px;
  border: 1px solid $l-color-bgcolor-11;
  font-size: 0;

  img {
    width: 124px;
    height: 124px;
  }
}

.patient-info {
  margin-left: 140px;
  overflow: hidden;
}

.demo-ruleForm {
  padding-right: 60px;
}

.add-contacts {
  width: calc(25% - 5px);
  line-height: 36px;
  color: $l-color-fontcolor-2;
  border: 1px dashed $l-color-bgcolor-11;
  cursor: pointer;
  text-align: center;
  margin-bottom: 20px;
}

.contacts-box {
  position: relative;
}

.remove-contact {
  position: absolute;
  right: -30px;
  top: 3px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;

  i {
    color: $l-color-primary;
  }
}

.age-box {
  .el-input {
    width: 30px;
    margin-right: 10px;

    /deep/ .el-input__inner {
      padding: 0 5px;
    }
  }

  .age-item {
    display: inline-block;
  }
}

.contain {
  width: 100%;
  padding: 0 20px;

  .dialog-header {
    width: 100%;
    margin-bottom: 30px;

    .detail {
      margin-top: 20px;
      margin-bottom: 18px;

      .title {
        height: 24px;
        margin-bottom: 20px;
        font-size: 16px;
        
        font-weight: bold;
        color: $l-color-fontcolor-3;
        line-height: 24px;

        span {
          display: inline-block;
          min-width: 35px;
          margin-right: 10px;
        }
      }

      .detail-cont {
        width: 100%;
        height: 20px;
        margin-bottom: 20px;

        .detail-cont-item {
          width: 30%;
          height: 20px;
          font-size: 14px;
          
          font-weight: 400;
          color: $l-color-fontcolor-4;
          line-height: 20px;
          float: left;

          i {
            margin-left: 10px;
            font-style: normal;
            color: $l-color-fontcolor-3;
          }
        }

        .balance-sum {
          i {
            height: 14px;
            font-size: 14px;
            
            font-weight: bold;
            color: $l-color-primary1;
            line-height: 18px;
          }
        }
      }
    }

    .rechargeMethod {
      .title {
        height: 24px;
        margin-bottom: 15px;
        font-size: 16px;
        
        font-weight: bold;
        color: $l-color-fontcolor-3;
        line-height: 24px;
      }

      .sum {
        width: 100%;
        height: 76px;
        padding: 20px;
        background: $l-color-bgcolor-18;
        border-radius: 2px;
      }

      .radio-item {
        height: 48px;
        padding: 0 20px;
        border-radius: 2px;
        border: 1px solid $l-color-bgcolor-11;
        line-height: 48px;

        .balance {
          font-style: normal;
          font-size: $l-font-size;
          
          font-weight: 400;
          color: $l-color-fontcolor-4;
        }

        .el-radio__label {
          display: none;
        }
      }
    }
  }
}

/deep/ .el-dialog__footer {
  /*height: 36px;*/
  padding: 20px;
  border-top: 1px solid $l-color-bgcolor-11;
}

.ft0 {
  /deep/ .el-radio__label {
    font-size: 0;
  }
}

.add-line {
  border-top: 1px solid $l-color-bgcolor-11;
  margin-bottom: 20px;
}

.reg-form /deep/ .el-form-item__content {
  margin-bottom: 18px;

  .l-input-wrap {
    vertical-align: top;
  }
}

/deep/ .l-radio-button .el-radio-button:nth-child(2) {
  visibility: hidden;
}

/deep/ .l-radio-button .el-radio-button:nth-child(3) {
  visibility: hidden;
}
</style>
