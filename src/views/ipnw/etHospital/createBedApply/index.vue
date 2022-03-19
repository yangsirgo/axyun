<template>
  <div class="width100 height100 filingAndChangeindex">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      @message="messageHandler"
      pageName="docSubmit"
    >
      <template #list>
        <el-tabs
          ref="sideTabs"
          :class="sideTabsCls"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            v-for="(item, index) in tabsName"
            :key="index"
            :label="item.label"
            :name="item.value"
          >
            <direct-check-left-bar
              v-if="item.value == 'first'"
              ref="directcheckleftbar"
              @choosePatientFun="choosePatientFun"
              @addnew="addnewFun"
            ></direct-check-left-bar>
            <finish-check-left-bar
              v-else-if="item.value == 'second'"
              ref="finishcheckleftbar"
              @choosePatientFun="choosePatientFun"
            ></finish-check-left-bar>
          </el-tab-pane>
        </el-tabs>
      </template>
      <template #content>
        <div class="bg-contain recordCreate width100 height100">
          <div v-if="htmlShow" class="width100 height100">
            <div class="patient-card">
              <!-- <l-patient-card :patientName="recordForm.patientName" :patientAge="recordForm.patientAge" :patientGender="recordForm.patientGender"> -->
              <!-- <patient-basic-info :patientInfo="recordForm"></patient-basic-info> -->
              <!-- <div class="readThe" @click="readTheFun">调阅健康档案</div> -->
              <!-- </l-patient-card> -->
              <patientDetail
                :patientData="patientInfoShow"
                :detailList="detailList"
                @patientDetail="patientDetail"
              ></patientDetail>
            </div>
            <el-card class="card-cont1 width100 m-contain bottom-con third-con">
              <div class="form-cont height-button-main">
                <el-form ref="recordForm" :model="recordForm" :rules="rules">
                  <el-col>
                    <l-card-title
                      ><span slot="left">患者基本信息</span></l-card-title
                    >
                  </el-col>
                  <el-row>
                    <div class="clearfix img-cont">
                      <div class="float-left img-right">
                        <img :src="recordForm.headImg" alt="" />
                      </div>

                      <div class="float-left img-left">
                        <el-row :gutter="8" class="margin-bottom-20">
                          <!-- <el-col :span="6">
                            <el-form-item
                              prop="isHomeBed"
                              :rules="[
                                { required: true, message: '请选择', trigger: 'change' }
                              ]"
                            >
                              <l-formt-title label="是否家庭病床">
                                <el-select

                                  v-model="recordForm.isHomeBed"
                                  placeholder="请选择"

                                >
                                  <el-option label="是" value="1"></el-option>
                                  <el-option label="否" value="0"></el-option>
                                </el-select>
                              </l-formt-title>
                            </el-form-item>
                          </el-col> -->
                          <el-col :span="6" class="width1024-50">
                            <l-formt-title label="家庭病床号" disabled>
                              <el-form-item prop="inpCode">
                                <el-input
                                  disabled
                                  v-model="recordForm.inpCode"
                                  style="width: 100%"
                                  placeholder="请输入家庭病床号"
                                  @input="inputChange($event)"
                                ></el-input>
                              </el-form-item>
                            </l-formt-title>
                          </el-col>
                          <el-col :span="4" class="width1024-50">
                            <l-formt-title label="姓名" required>
                              <el-form-item prop="patientName">
                                <el-input
                                  v-model="recordForm.patientName"
                                  style="width: 100%"
                                  placeholder="请输入姓名"
                                  @input="inputChange($event)"
                                ></el-input>
                              </el-form-item>
                            </l-formt-title>
                          </el-col>
                          <el-col :span="4" class="width1024-50">
                            <LFormtTitle label="性别" required>
                              <el-form-item prop="patientGender">
                                <!-- :disabled="disableEditing" -->
                                <l-value-domain
                                  :code="selectCode.patientGender"
                                  :value.sync="recordForm.patientGender"
                                  class="select-container"
                                  @input="inputChange($event)"
                                  :placeholder="$t('base.placeholder')"
                                  key="key20"
                                ></l-value-domain>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>

                          <el-col :span="6" class="width1024-33 paddingLeft">
                            <LFormtTitle label="出生日期" required>
                              <el-form-item prop="patientBirthday">
                                <el-date-picker
                                  v-model="recordForm.patientBirthday"
                                  type="date"
                                  style="width: 100%"
                                  placeholder="选择日期"
                                  @input="inputChange($event)"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd"
                                  :picker-options="birthPickerOption"
                                ></el-date-picker>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col :span="4" class="width1024-33 paddingLeft">
                            <LFormtTitle label="民族" required>
                              <el-form-item prop="nationCode" required>
                                <l-value-domain
                                  :code="selectCode.nationCode"
                                  :value.sync="recordForm.nationCode"
                                  class="select-container"
                                  :placeholder="$t('base.placeholder')"
                                  key="key1"
                                ></l-value-domain>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <!-- <el-col :span="6" class="width1024-33">
                            <LFormtTitle label="出生时间">
                              <el-form-item prop="birthTime">
                                <el-time-picker
                                  v-model="recordForm.birthTime"
                                  value-format="HH:mm:ss"
                                  :picker-options="birthTimeOption"
                                  style="width:100%"
                                  placeholder="选择时间"
                                  @blur="getAgeByBirthDate"
                                ></el-time-picker>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col> -->
                          <!-- <el-col :span="4" class="width1024-33">
                            <LFormtTitle label="年龄">
                              <el-form-item prop="patientAge"><el-input :disabled="disableEditing" v-model="recordForm.patientAge" style="width:100%"></el-input></el-form-item>
                            </LFormtTitle>
                          </el-col> -->
                        </el-row>
                        <el-row
                          :gutter="8"
                          class="margin-bottom-20 width1024-100"
                        >
                          <!-- <el-col :span="8" class="width1024-33 paddingLeft">
                            <LFormtTitle label="身份证号" required  :disabled="disableEditing">
                              <el-form-item prop="identificationNum">
                                <div class="input-con">
                                  <el-input
                                  :disabled="disableEditing"
                                  v-model="recordForm.identificationNum"
                                  style="width:100%"
                                  placeholder="请输入"
                                  maxlength="18"
                                  @input="inputChange($event)"
                                  @blur="identifiBlur"
                                  ></el-input>
                                  <el-button
                                    plain
                                    type="primary"
                                    size="mini"
                                    shortbutton
                                    :disabled="disableEditing"
                                    >{{ idNumber }}</el-button
                                  >
                                </div>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col> -->
                          <!-- <el-col :span="3" class="width1024-33">
                            <el-button class="veri-code width100" type="info" :disabled="veriCodeDisabled">{{ idNumber }}</el-button>
                          </el-col> -->
                          <el-col :span="6" class="width1024-33">
                            <LFormtTitle label="籍贯">
                              <el-form-item prop="nativePlaceCode">
                                <l-value-domain
                                  type="cascader"
                                  :code="selectCode.nativePlaceCode"
                                  :value.sync="recordForm.nativePlaceCode"
                                  class="select-container"
                                  remoteValueKey="id"
                                  remoteShowKey="label"
                                  :multiple="false"
                                  :relation="true"
                                  :placeholder="$t('base.placeholder')"
                                  key="key24"
                                ></l-value-domain>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col :span="4" class="width1024-33">
                            <LFormtTitle label="血型" required>
                              <el-form-item prop="bloodType">
                                <l-value-domain
                                  :code="selectCode.bloodType"
                                  :value.sync="recordForm.bloodType"
                                  class="select-container"
                                  :placeholder="$t('base.placeholder')"
                                  key="key23"
                                ></l-value-domain>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col :span="4" class="width1024-33">
                            <LFormtTitle label="婚姻状况" required>
                              <el-form-item prop="maritalStatus">
                                <l-value-domain
                                  :code="selectCode.maritalStatus"
                                  :value.sync="recordForm.maritalStatus"
                                  class="select-container"
                                  :placeholder="$t('base.placeholder')"
                                  key="key21"
                                ></l-value-domain>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col :span="4" class="width1024-33 paddingLeft">
                            <LFormtTitle label="职业">
                              <el-form-item prop="careerCode">
                                <l-value-domain
                                  code="OCCUPATIONAL_CLASSIFICATION_CODE"
                                  :value.sync="recordForm.careerCode"
                                  class="select-container"
                                  :placeholder="$t('base.placeholder')"
                                  key="key1"
                                ></l-value-domain>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col :span="6" class="width1024-50">
                            <l-formt-title label="工作单位">
                              <el-form-item prop="workUnit">
                                <el-input
                                  v-model="recordForm.workUnit"
                                  style="width: 100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)"
                                ></el-input>
                              </el-form-item>
                            </l-formt-title>
                          </el-col>
                          <!-- <el-col :span="3" class="width1024-33 paddingLeft">
                            <LFormtTitle label="职业">
                              <el-form-item prop="careerCode">
                                <l-value-domain
                                  code="OCCUPATIONAL_CLASSIFICATION_CODE"
                                  :value.sync="recordForm.careerCode"
                                  class="select-container"
                                  :placeholder="$t('base.placeholder')"
                                  key="key1"
                                ></l-value-domain>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col> -->
                          <!-- <el-col :span="6" class="width1024-50">
                            <l-formt-title label="工作单位">
                              <el-form-item prop="workUnitName">
                                <el-input
                                  v-model="recordForm.workUnitName"
                                  style="width:100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)"
                                ></el-input>
                              </el-form-item>
                            </l-formt-title>
                          </el-col> -->
                        </el-row>
                        <el-row
                          :gutter="8"
                          class="margin-bottom-20 width1024-100"
                        >
                          <el-col :span="6">
                            <el-form-item prop="identificationType">
                              <l-formt-title label="证件类型">
                                <l-value-domain
                                  required
                                  code="MARK_TYPE_CODE"
                                  :value.sync="recordForm.identificationType"
                                />
                              </l-formt-title>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item prop="identificationNum">
                              <l-formt-title label="证件号码">
                                <el-input
                                  required
                                  v-model="recordForm.identificationNum"
                                  placeholder="请输入内容"
                                ></el-input>
                              </l-formt-title>
                            </el-form-item>
                          </el-col>

                          <el-col :span="6" class="width1024-33">
                            <LFormtTitle label="结算类型" required>
                              <el-form-item prop="settlementType">
                                <l-value-domain
                                  :code="selectCode.settlementType"
                                  :value.sync="recordForm.settlementType"
                                  class="select-container"
                                  :placeholder="$t('base.placeholder')"
                                  key="key21"
                                ></l-value-domain>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <!-- <el-col :span="6">
                            <el-form-item prop="bedId">
                              <l-formt-title label="床号">
                                <el-select v-model="recordForm.bedId" placeholder="请选择">
                                  <el-option
                                    v-for="item in bedListData"
                                    :key="item.bedId"
                                    :label="item.bedCode"
                                    :value="item.bedId"
                                  ></el-option>
                                </el-select>
                              </l-formt-title>
                            </el-form-item>
                          </el-col> -->

                          <el-col :span="6" class="width1024-50">
                            <l-formt-title label="医保号">
                              <el-form-item prop="miNum">
                                <el-input
                                  v-model="recordForm.miNum"
                                  style="width: 100%"
                                  placeholder="请输入医保号"
                                  @input="inputChange($event)"
                                ></el-input>
                              </el-form-item>
                            </l-formt-title>
                          </el-col>
                        </el-row>
                        <el-row
                          :gutter="8"
                          class="margin-bottom-20 width1024-100"
                        >
                          <el-col :span="6" class="width1024-33 paddingLeft">
                            <LFormtTitle label="电话" required>
                              <el-form-item prop="mobileNum" :rules="rules.archPhoneAdd">
                                <!-- <div class="input-con"> -->
                                <el-input
                                  v-model="recordForm.mobileNum"
                                  placeholder="请输入"
                                  @input="inputChange($event)"
                                ></el-input>
                                <!-- </div> -->
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col :span="12">
                            <LFormtTitle label="联系地址" required>
                              <el-form-item prop="address">
                                <l-value-domain
                                  type="cascader"
                                  :code="selectCode.address"
                                  :value.sync="recordForm.addrCode"
                                  class="select-container"
                                  remoteValueKey="id"
                                  remoteShowKey="label"
                                  :multiple="false"
                                  :relation="true"
                                  :placeholder="$t('base.placeholder')"
                                  @change="contactChange"
                                  key="key3"
                                ></l-value-domain>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col :span="6">
                            <LFormtTitle label="联系具体地址" required>
                              <el-form-item prop="familyAddress">
                                <el-input
                                  v-model="recordForm.familyAddress"
                                  style="width: 100%"
                                  maxlength="30"
                                  placeholder="请输入"
                                ></el-input>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                    <el-col :gutter="8" class="margin-bottom-20 width1024-100">
                      <el-col class="fontSize-style"
                        >联系人信息
                        <span style="color: #f05a23"> *</span>
                      </el-col>
                      <div
                        v-for="(item, index) in recordForm.archGuarantorList"
                        :key="index"
                        class="paddingStyleAddBox"
                      >
                        <el-row :gutter="8" class="margin-bottom-20">
                          <el-col :span="6">
                            <LDoubleInput widthRatio="105px">
                              <template slot="left">
                                <el-form-item
                                  :prop="
                                    'archGuarantorList.' +
                                    index +
                                    '.relationShip'
                                  "
                                  :rules="rules.relationShip"
                                >
                                  <l-value-domain
                                    :code="selectCode.relationShip"
                                    :value.sync="item.relationShip"
                                    :isFilterable="false"
                                    class="select-container"
                                    :placeholder="$t('base.placeholder')"
                                    key="'key14'+index"
                                    @change="
                                      concatChange(
                                        item,
                                        index,
                                        'archGuarantorList'
                                      )
                                    "
                                  ></l-value-domain>
                                </el-form-item>
                              </template>
                              <template slot="right">
                                <el-form-item
                                  :prop="
                                    'archGuarantorList.' + index + '.contacts'
                                  "
                                  :rules="rules.fiduciaryName"
                                >
                                  <el-input
                                    v-model="item.contacts"
                                    maxlength="18"
                                    style="width: 100%"
                                    placeholder="请输入"
                                    @input="inputChange($event)"
                                  ></el-input>
                                </el-form-item>
                              </template>
                            </LDoubleInput>
                          </el-col>
                          <!-- <el-col :span="8" class="width1024-33 paddingLeft">
                            <LFormtTitle label="身份证号">
                              <el-form-item prop="idCardNum">
                                <div class="input-con">
                                  <el-input

                                  v-model="recordForm.idCardNum"
                                  style="width:100%"
                                  placeholder="请输入"
                                  maxlength="18"
                                  @input="inputChange($event)"
                                  @blur="identifiBlur"
                                  ></el-input>
                                  <el-button
                                    plain
                                    type="primary"
                                    size="mini"
                                    shortbutton

                                    >{{ idNumber }}</el-button
                                  >
                                </div>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col> -->
                          <el-col :span="6">
                            <LFormtTitle label="联系人电话">
                              <el-form-item
                                :prop="
                                  'archGuarantorList.' +
                                  index +
                                  '.contactsPhone'
                                "
                                :rules="rules.archPhone"
                              >
                                <el-input
                                  v-model="item.contactsPhone"
                                  minlength="11"
                                  style="width: 100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)"
                                ></el-input>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col
                            :span="1"
                            class="paddingStyle"
                            v-if="recordForm.archGuarantorList.length > 1"
                          >
                            <span
                              @click="deleteContact(item, index)"
                              class="el-icon-delete iconFont-style"
                            ></span>
                          </el-col>
                          <el-col
                            :span="1"
                            class="paddingStyle paddingStyleAdd"
                            v-if="
                              index == recordForm.archGuarantorList.length - 1
                            "
                          >
                            <span
                              @click="addArchGuarantorList"
                              class="el-icon-plus iconFont-style"
                            ></span>
                          </el-col>
                        </el-row>
                      </div>
                      <el-col
                        :span="1"
                        class="paddingStyle"
                        v-if="deleteContactStyle"
                      >
                        <span
                          @click="addArchGuarantorList"
                          class="el-icon-plus iconFont-style"
                        ></span>
                      </el-col>
                    </el-col>
                  </el-row>
                  <el-row>
                    <l-card-title
                      ><span slot="left"
                        >诊断<span style="color: #f05a23"> *</span></span
                      ></l-card-title
                    >
                    <el-table
                      class=""
                      :data="zdData"
                      ref="zdData"
                      border
                      stripe
                    >
                      <!-- 业务列 -->
                      <el-table-column
                        v-for="(item, index) in zdParams"
                        :key="index"
                        :prop="item.prop"
                        :label="item.label"
                        :min-width="item.width"
                        header-align="center"
                        :align="item.align || 'left'"
                        :row-class-name="tableRowClassName"
                      >
                        <template
                          slot-scope="scope"
                          v-if="item.operateType != '1'"
                        >
                          <!-- 可自定义内容 -->
                          <template v-if="item.prop === 'cwFlag'">
                            <!-- <l-value-domain
                              code="MedicationRouteCode"
                              remoteShowKey="name"
                              remoteValueKey="code"
                              @change="handleUseWay(scope.row, arguments)"
                              :value.sync="scope.row.uses"
                              placeholder=""
                            ></l-value-domain> -->

                            <!-- <l-value-domain
                              clearable
                              remoteUrl="/doctorsAdvice/list"
                              type="select"
                              :remoteParams="remoteParams"
                              :value.sync="scope.row.cwFlag"
                              remoteShowKey="doctorsAdviceName"
                              remoteValueKey="doctorsAdviceId"
                            ></l-value-domain> -->
                            <l-value-domain
                              style=""
                              code="CWM"
                              :value.sync="scope.row[item.prop]"
                              placeholder="请选择"
                              @change="cwFlagChange(...arguments, scope.$index)"
                            ></l-value-domain>
                          </template>
                          <template v-else-if="item.prop === 'diagName'">
                            <!-- <select-allow-create
                              ref="diagName"
                              style=""
                              remoteUrl="/patTcmDiag/getDiagNameCode"
                              :remoteParams="scope.row.remoteParams1"
                              :value.sync="scope.row[item.prop]"
                              placeholder="请输入诊断名称"
                              remoteShowKey="dictionaryName"
                              remoteValueKey="icd10DictionaryId"
                              class="input-width-default"
                              @change="diagNameChange"
                            ></select-allow-create> -->
                            <el-select
                              class="width100"
                              :ref="'elem' + scope.$index"
                              placeholder="请输入诊断名称"
                              filterable
                              :remote-method="
                                (query) => {
                                  return remoteMethod(query, scope.row);
                                }
                              "
                              remote
                              reserve-keyword
                              default-first-option
                              :loading="loading"
                              v-model="scope.row.diagName"
                              @change="
                                (val) => {
                                  changeFunc(val, scope.row);
                                }
                              "
                              @focus="focusSelect(scope.$index, scope.row)"
                            >
                              <el-option
                                v-for="(data, index) in scope.row.settingData"
                                :key="index"
                                :label="data[scope.row.labelname]"
                                :value="data[scope.row.valuekey]"
                              ></el-option>
                            </el-select>
                          </template>
                          <template v-else-if="item.prop === 'diagTime'">
                            <el-date-picker
                              v-model="scope.row.diagTime"
                              type="datetime"
                              style="width: 100%"
                              placeholder="选择日期"
                              @input="inputChange($event)"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :picker-options="expireTimeOption"
                            ></el-date-picker>
                          </template>
                          <template v-else-if="item.prop === 'diagIcd'">
                            <el-input
                              v-model="scope.row.diagIcd"
                              style="width: 100%"
                              placeholder="请输入"
                              @input="inputChange($event)"
                            ></el-input>
                          </template>
                          <template v-else-if="item.prop == 'operate'">
                            <el-button
                              @click="deleteConfirm(scope.$index, scope.row)"
                              type="text"
                              size="small"
                              >删除</el-button
                            >
                          </template>
                          <template v-else>
                            <span>{{ scope.row[item.prop] }}</span>
                          </template>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div
                      style="
                        margin-top: 10px;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                      "
                    >
                      <div
                        @click="addZD"
                        style="
                          width: 400px;
                          height: 35px;
                          background-color: #f1f4f6;
                          border: 1px dashed #e4e4e4;
                          color: #959696;
                          display: flex;
                          justify-content: center;
                          aligin-item: center;
                        "
                      >
                        <span class="el-icon-plus iconFont-style"></span>
                      </div>
                    </div>
                  </el-row>
                  <el-row>
                    <l-card-title
                      ><span slot="left">病情摘要</span></l-card-title
                    >
                    <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                      <el-col :span="24">
                        <el-form-item prop="summaryOfIllness">
                          <l-formt-title
                            label="病情摘要"
                            required
                            :isMultiRow="true"
                          >
                            <el-input
                              type="textarea"
                              v-model="recordForm.summaryOfIllness"
                              maxlength="500"
                              :autosize="{ minRows: 6, maxRows: 8 }"
                              show-word-limit
                              @input="inputChange($event)"
                            ></el-input>
                          </l-formt-title>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-row>
                  <el-row>
                    <l-card-title
                      ><span slot="left">收治指征及建床意见</span></l-card-title
                    >
                    <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                      <el-col :span="24">
                        <el-form-item prop="createOpinions">
                          <l-formt-title
                            label="收治指征及建床意见"
                            required
                            :isMultiRow="true"
                          >
                            <el-input
                              type="textarea"
                              :autosize="{ minRows: 6, maxRows: 8 }"
                              v-model="recordForm.createOpinions"
                              maxlength="500"
                              show-word-limit
                            ></el-input>
                          </l-formt-title>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                      <el-col :span="9">
                        <LFormtTitle label="社保登记病种" required>
                          <el-form-item prop="diseaseType">
                            <l-value-domain
                              required
                              code="SiDiseaseType"
                              :value.sync="recordForm.diseaseType"
                              class="select-container"
                              :placeholder="$t('base.placeholder')"
                              key="key5"
                            ></l-value-domain>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="5">
                        <LFormtTitle label="建床类型" required>
                          <el-form-item prop="createType">
                            <l-value-domain
                              code="AdmitHosType"
                              :value.sync="recordForm.createType"
                              class="select-container"
                              :placeholder="$t('base.placeholder')"
                              key="key7"
                            ></l-value-domain>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="5">
                        <LFormtTitle label="建床次数">
                          <el-form-item prop="inHosTimes">
                            <el-input-number
                              disabled
                              :min="1"
                              :max="1000"
                              v-model="recordForm.inHosTimes"
                              style="width: 100%"
                              :placeholder="$t('base.placeholder')"
                              @input="inputChange($event)"
                            ></el-input-number>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="5">
                        <LFormtTitle label="首次建床日期">
                          <el-form-item prop="firstBedBuild">
                            <el-date-picker
                              disabled
                              v-model="recordForm.firstBedBuild"
                              type="date"
                              style="width: 100%"
                              placeholder="选择日期"
                              @input="inputChange($event)"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                            ></el-date-picker>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>

                    <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                      <el-col :span="8">
                        <LFormtTitle label="本次治疗" required>
                          <el-form-item prop="company">
                            <el-date-picker
                              width="100%"
                              v-model="recordForm.chargeDate2"
                              type="daterange"
                              value-format="yyyy-MM-dd"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              clearable
                              :picker-options="chargeDate2Options"
                            ></el-date-picker>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <!-- <el-col :span="6">
                        <el-form-item
                          prop="admissionSituation"
                          :rules="[{ required: true, message: '请选择', trigger: 'change' }]"
                        >
                          <l-formt-title label="入院病情" :required="true">
                            <l-value-domain
                              code="EntranceCode"
                              :value.sync="recordForm.admissionSituation"
                            />
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
                            <l-value-domain code="InType" :value.sync="recordForm.admissionMode" />
                          </l-formt-title>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item prop="finAdmissionTime" >
                          <l-formt-title label="入院时间" disabled>
                            <el-date-picker
                              disabled
                              v-model="recordForm.finAdmissionTime"
                              type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择日期时间"
                              :picker-options="pickerOptions"
                            ></el-date-picker>
                          </l-formt-title>
                        </el-form-item>
                      </el-col> -->
                    </el-row>
                    <!-- <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                      <el-col :span="6">
                        <LFormtTitle label="科室" required>
                          <el-form-item
                            prop="admissionSdeptId"
                            :rules="[
                              { required: true, message: '请选择', trigger: 'change' }
                            ]"
                          >
                            <el-select
                              style="width: 100%;"
                              v-model="recordForm.admissionSdeptId"
                              @change="getDeptId"
                              placeholder="请选择"
                            >
                              <el-option
                                v-for="item in deptList"
                                :key="item.deptId"
                                :label="item.deptName"
                                :value="item.deptId"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="6">
                        <LFormtTitle label="病区" required>
                          <el-form-item
                            prop="admissionWdeptId"
                            :rules="[
                              { required: true, message: '请选择', trigger: 'change' }
                            ]"
                          >
                            <el-select
                              style="width: 100%;"
                              v-model="recordForm.admissionWdeptId"
                              @change="getDeptId"
                              placeholder="请选择"
                            >
                              <el-option
                                v-for="item in WdeptList"
                                :key="item.wardCode"
                                :label="item.wardName"
                                :value="item.wardCode"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="6">
                        <LFormtTitle label="床位">
                          <el-form-item prop="bedId">

                            <el-select
                              style="width: 100%;"
                              v-model="recordForm.bedId"
                              @change="bedChange"
                              placeholder="请选择"
                            >
                              <el-option
                                v-for="item in bedListData"
                                :key="item.bedId"
                                :label="item.bedCode"
                                :value="item.bedId"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="6">
                        <LFormtTitle label="责任医生">
                          <el-form-item prop="manageDoctorId">

                            <el-select
                              style="width: 100%;"
                              v-model="recordForm.manageDoctorId"
                              @change="docChange"
                              placeholder="请选择"
                            >
                              <el-option
                                v-for="item in doctorList"
                                :key="item.uid"
                                :label="item.uname"
                                :value="item.uid"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row> -->
                    <!-- <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                      <el-col :span="6">
                        <LFormtTitle label="责任护士">
                          <el-form-item prop="manageNurseId">
                            <el-select
                              style="width: 100%;"
                              v-model="recordForm.manageNurseId"
                              @change="docChangeNurse"
                              placeholder="请选择"
                            >
                              <el-option
                                v-for="item in nurseList"
                                :key="item.uid"
                                :label="item.uname"
                                :value="item.uid"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>

                    </el-row> -->
                  </el-row>
                </el-form>
              </div>

              <div class="bottom-con width100">
                <div class="btns float-right">
                  <el-button
                    type="primary"
                    @click="submit"
                    v-if="activeName == 'first'"
                    >提交</el-button
                  >
                  <el-button
                    type="primary"
                    @click="submitCancel"
                    v-if="activeName == 'second' && recordForm.applyStatus != 9"
                    >撤销申请</el-button
                  >
                  <!-- <el-button
                    type="primary"
                    @click="submitChange"
                    v-if="activeName == 'second' && recordForm.applyStatus == 1"
                    >修改</el-button
                  > -->
                  <el-button
                    type="primary"
                    @click="submitChange"
                    v-if="activeName == 'second'"
                    >修改</el-button
                  >
                  <el-button
                    type="primary"
                    @click="submitChange"
                    v-if="activeName == 'second' && recordForm.applyStatus == 9"
                    >重新提交</el-button
                  >
                  <!-- <el-button type="primary" plain @click='cancelFun'>取消</el-button> -->
                </div>
              </div>
            </el-card>
          </div>

          <el-card class="card-cont1 width100" v-if="htmlShowStyle">
            <div class="newFileBox">
              <div>
                <div class="addnewFile" @click="addnewFile">
                  <span
                    class="el-icon-circle-plus-outline addnewFilesize"
                  ></span>
                  <span class="addnewFilesize1">新建档案</span>
                </div>
                <div class="addnewFilesize2">档案信息为空,请选择患者</div>
                <div class="addnewFilesize2">或新建档案</div>
              </div>
            </div>
          </el-card>
        </div>
      </template>
    </l-layout>
    <!-- 绑定 -->
    <!--新建卡片-->
    <el-dialog
      title="绑定新卡"
      width="533px"
      :visible.sync="cardDisable"
      v-if="cardDisable"
      :close-on-click-modal="false"
    >
      <create-card
        @changeCardDisable="changeCardDisable"
        @cardSave="cardSave"
      ></create-card>
    </el-dialog>

    <!-- 新建档案 start -->
    <el-dialog
      title="新建档案"
      width="80%"
      height="95%"
      top="7vh"
      :close-on-click-modal="false"
      :visible.sync="addarchivesStyle"
      v-if="addarchivesStyle"
    >
      <addarchives @cancelstyle="cancelstyle" @refsChild="refsChild">
      </addarchives>
    </el-dialog>
    <!-- 新建档案 end refsChild -->

    <!-- 新建档案 start -->
    <el-dialog
      title="查看健康档案"
      width="85%"
      height="95%"
      top="7vh"
      :visible.sync="readTheStyle"
      v-if="readTheStyle"
      @open="openstyle"
      :close-on-click-modal="false"
    >
      <fillingAndChangeEhr
        ref="readTheStyleRef"
        :readTheDataList="readTheDataList"
        v-if="readTheStyle"
      >
      </fillingAndChangeEhr>
      <!-- <eHrArchivesindex style="display: none;" :readTheDataList="readTheDataList"></eHrArchivesindex> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="readTheStyle = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 新建档案 end refsChild -->

    <!-- 解绑弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span class="titleStyle"> 确认删除此卡吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
.operate-type-hide {
  display: none;
}
</style>
<script>
import { mapActions, mapGetters } from "vuex";
import { get } from "@/utils/request";
import LSideTabsNew from "@/components/LSideTabsNew.vue";
import { getIsTenant, getPamars } from "@/utils/auth";

import { getPatintInfo, queryBed } from "@/api/cis/admApplication/index";
import {
  canBeUseDoctorAndNurseList,
  getDeptDoctorList,
  nurseList,
  bedList,
  createBedSubmit,
  getApplyInfo,
  applyUpdateStatus,
  putApplySave
} from "@/api/ipnw/etHospital.js";
import finishCheckLeftBar from "@/views/ipnw/etHospital/createBedApply/components/finishCheckLeftBar.vue";
import directCheckLeftBar from "@/views/ipnw/etHospital/createBedApply/components/directCheckLeftBar.vue";
import createCard from "./components/createCard.vue";
// import addarchives from './components/addarchives.vue';
import addarchives from "@/views/filingAndChange/filingAndChangeindex/components/addarchives.vue";
import fillingAndChangeEhr from "../../../eHrArchives/eHrArchivesindex/fillingAndChangeEhr.vue";
import eHrArchivesindex from "../../../eHrArchives/eHrArchivesindex/index.vue";
import {
  getAgeByBirthDate,
  sendMsg,
  getCordByPatientId,
  delArchCard,
  regInfo,
  deptList,
  WdeptList
} from "@/api/filingAndChange/arch";
import selectAllowCreate from "@/views/public/diagnosis/components/selectAllowAndInput.vue";
import patientDetail from "@/views/homeSickbeds/hsDiagTreat/components/patientDetail";

export default {
  name: "index",

  components: {
    finishCheckLeftBar,
    selectAllowCreate,
    directCheckLeftBar,
    LSideTabsNew,
    createCard,
    addarchives,
    fillingAndChangeEhr,
    eHrArchivesindex,
    patientDetail
  },

  data() {
    //校验两位小数正整数
    let integerCheck = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        //此正则表达式验证小数位是否超过两位，小数可为1位 || 2位 || 整数
        if (!(/^\d+(\.\d{1,2})?$/.test(value) || /^\d$/.test(value))) {
          this.$message.error("输入正确的数据");
        } else {
          callback();
        }
      }
    };
    //手机号码
    let mobileNumValidate = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      // else if (value.length != 11) {
      //   this.$message.error("电话应该等于11位");
      //   callback(new Error("电话应该等于11位"));
      // }
      else if (value != parseInt(value)) {
        this.$message.error("电话应该数字");
        callback(new Error("电话应该数字"));
      } else {
        callback();
      }
    };
    //联系方式（手机或者座机）
    let concatPhone = (rule, value, callback) => {
      let str = /^1([38]\d|4[5-9]|5[0-35-9]|6[56]|7[0-8]|9[189])\d{8}$/;
      if (!value) {
        callback();
      } else if (!str.test(value)) {
        this.$message.error("联系方式有误，请重新填写");
        callback(new Error("联系方式有误，请重新填写"));
      } else if (value != parseInt(value)) {
        this.$message.error("联系方式应该数字");
        callback(new Error("联系方式应该数字"));
      } else {
        callback();
      }
    };
    //患者联系方式（手机或者座机）
    let concatPhoneAdd = (rule, value, callback) => {
      let str = /^1([38]\d|4[5-9]|5[0-35-9]|6[56]|7[0-8]|9[189])\d{8}$/;
      if (value == "") {
        return callback(new Error("患者电话不能为空！"));
      }

      // 判断号码正确
      if (str.test(value) || telephoneReg.test(value)) {
        callback();
      } else {
        this.$message.error("患者电话有误，请重新填写");
        return callback(new Error("患者电话有误，请重新填写"));
      }
    };
    //联系方式（手机或者座机）
    let concatPhoneArch = (rule, value, callback) => {
      let str = /^1([38]\d|4[5-9]|5[0-35-9]|6[56]|7[0-8]|9[189])\d{8}$/;
      if (!value) {
        // this.$message.error('联系方式不能为空');
        // callback(new Error('联系方式不能为空'));
        callback();
      } else if (value != parseInt(value)) {
        /*  else if (!str.test(value)) {
               this.$message.error("联系方式有误，请重新填写");
               callback(new Error("联系方式有误，请重新填写"));
             }  */
        this.$message.error("联系方式应该数字");
        callback(new Error("联系方式应该数字"));
      } else {
        callback();
      }
    };
    //姓名校验
    let patientNameValidate = (rule, value, callback) => {
      let numRule = /[0-9]/;
      if (value) {
        if (numRule.test(value)) {
          this.$message.error("姓名不允许包括数字");
          callback(new Error("姓名不允许包括数字"));
        } else {
          callback();
        }
      }
    };
    //姓名校验
    let patientNameValidateA = (rule, value, callback) => {
      let numRule = /[0-9]/;
      if (value === "" || value === undefined) {
        this.$message.error("联系人姓名不允许为空");
        callback(new Error("联系人姓名不允许为空"));
      } else {
        if (numRule.test(value)) {
          this.$message.error("姓名不允许包括数字");
          callback(new Error("姓名不允许包括数字"));
        } else {
          callback();
        }
      }
    };
    //联系人类型校验
    let relationShipValidate = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        this.$message.error("联系人关系不允许为空");
        callback(new Error("联系人关系不允许为空"));
      } else {
        callback();
      }
    };
    // 不能为空的校验
    let notNull = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        // this.$message.error(rule.msg);
        callback(new Error(rule.msg));
      }
    };
    let archIdentifyTypeValidate = (rule, value, callback) => {
      if (!value) {
        this.$message.error("请填写担保人身份证号");
        callback(new Error("请填写担保人身份证号"));
      } else {
        callback();
      }
    };

    let archGIdentifyTypeValidate = (rule, value, callback) => {
      if (!value) {
        this.$message.error("请填写监护人身份证号");
        callback(new Error("请填写监护人身份证号"));
      } else {
        callback();
      }
    };
    return {
      detailList: [],
      patientInfoShow: {},
      date: "",
      curDate: "",
      tabsName: [
        {
          label: "患者查询",
          value: "first"
        },
        {
          label: "历史申请",
          value: "second"
        }
      ],
      activeName: "first",

      // 诊断信息表格数据
      zdData: [],
      // 危急值信息表头
      zdParams: [
        {
          prop: "cwFlag",
          label: "类型",
          fixed: "left",
          width: "10%"
        },
        {
          prop: "diagName",
          label: "诊断名称",
          fixed: "left",
          width: "20%"
        },
        {
          prop: "diagIcd",
          label: "诊断描述",
          width: "30%"
        },
        {
          prop: "diagCode",
          label: "ICD编码",
          width: "10%"
        },
        {
          prop: "diagTime",
          label: "诊断日期",
          width: "20%"
        },
        {
          prop: "operate",
          label: "操作",
          width: "10%"
        }
      ],
      // 科室列表
      deptList: [],
      // 病区列表
      WdeptList: [],
      // 病区列表
      bedListData: [],
      doctorList: [],
      nurseList: [],
      bedList: [],
      remoteParams: {
        pageSize: 10,
        parentCode: "0"
      }, // 分页参数,医嘱大类参数
      // remoteParams1: { keyword: "", type: "", cwFlag: "1" },
      loading: false,

      // 点击调阅档案按钮
      readTheData: {},
      readTheDataList: {},
      // 二维码假数据
      qrcodeImg:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAWl0lEQVR4Xu2d63rb2A5D0/d/6J7Paed2EnsvyKC27K75TYMESEKUk0l/fHx8/Pzwv28V+PlznzQ/fvyodiXhQnNTTIqXEN6ZO6nz6rG3Kds35RdXhw7ZBI320iRcaG6KSfESHXfmTuq8eqwG8KBDdMgmmtxemoQLzU0xKV6i487cSZ1Xj9UANIAvCtCF3bmEO3NffamT+jQADUADSDbmzWI1AA1AA3izpU7oaAAagAaQbMybxWoAGoAG8GZLndDRADQADSDZmDeL1QA0AA3gzZY6oYMNgP7YJUm+K7b9Y66EB82dYO6Kbc9Eog3NTTEp3i6tk7yU8w1TAzj5AkiakzR9R2x7aRJtaG6KSfF26JzmpJw1gIWyE0ORNCdt/NnxbX0SbWhuiknxztb4SD7KWQPQAI7M19+faS9NMrg0N8WkeE8JdtKHKWcNQAN4aiTbS5MMLs1NMSneU4Kd9GHKWQPQAJ4ayfbSJINLc1NMiveUYCd9mHLWADSAp0ayvTTJ4NLcFJPiPSXYSR+mnDUADeCpkWwvTTK4NDfFpHhPCXbShylnDUADeGok20uTDC7NTTEp3lOCnfRhylkD0ACeGsn20iSDS3NTTIr3lGAnfZhyHjGAJHlbD9pEWiPFa/PYjUf1oXXu1JFyoTVSPKpNEjdRY/03Ad9JICp40sRXiG33cKeOlAutkeJN9HmiRg3gQaeo4BPN3onZHvKdOlIutEaKN9G/iRo1AA3giwLtIaeDO7E0lAutkeJNcJmoUQPQADSA29/Gh/8GhAawsLZ3EogOxYTb78Rs93CnjpQLrZHiTfRvokYvAC8ALwAvgLVfTbjPOmsW0a6R4mVVXj+6/ZTbqSPlQmukeBNdnqjRC8ALwAvAC2DtVxPus86aRbRrpHhZldePbj/ldupIudAaKd5Elydq9AI4+QLYOUB0KNuDRvFofUkc1ZvWSPGSGmnsRI0agAbwRYH2oFE8ughJHF1YWiPFS2qksRM1agAagAbgdwBrD5pwn3XWLKJdI8VLqtz5BKF1Ut6UC8Wj9SVx7RopXlIjjaU6JjV6AXgBeAF4Aaw9aMJ91lmziHaNFC+pMnHnBLcZS3lTLhSvyeEvrHaNFG+CC9UxqdELwAvAC8ALYO1XE+6zzppFtGukeEmViTsnuM1YyptyoXhNDl4ATE0vAC8ALwAvgLVbUBenT4V1xjyiXSPFSyrdqQ+tk/KmXCgerS+Ja9dI8ZIaaSzVManRC+DFL4CJoaADSeNojRQviaPLQGukeEmNNHaiRg1AA6DzdziODu7hBA8+SBeW1kjxJrhM1KgBaAATs/ofTDq4E4XQhaU1UrwJLhM1agAawMSsagADqmoAC1HbAlG8pNftJwitsZ034UxrTDBpLOVNa6R4tL4kbqJGLwAvgGQGD8XSwT0EvvgQXVhaI8Wb4DJRowagAUzMqq8AA6pqAL4CfFFgYijas0trbOe94dEnNq2R4k1wmajRC8ALYGJWvQAGVNUAvAC8AMLFok/sieUKS12GT9ToBeAFsBy8ZwPo4D6b57vPawCPVa0bwEQT25g7h4IuQ7vGtoYTeJTzLbc63u9AoqMGULgAEsEd3M7gqmNHRw1AA5h4mB/C1EgPyfblQ4mOGoAG0Jm6AkoyuF4AXgCHR44OWnvIfHddfCH14/Y8Yv+1e0PxWHV7o+h836r0AvAC2Dut/8qeDC5dWIpJ8S4j1oNCKGcNYNFNOhSJ4G1Mivdug0t5095QvHfT0QvAC+AyM02X1Vep3quUBqABaADB7xVcRixfAY63gj5p6FlI8Xxy9Z5c7d5QvONTd94nk3nEF8B55V8nEx2KRPA2Zhtvp0nt1PE6U3duJRrAH/IKsHO5XsGkzl2762TTADSALwq0F7aNN3GlXGclz61EA9AANIBzd+5S2TQADUADuNRKnluMBqABaADn7tylsmkAGoAGcKmVPLcYDUAD0ADO3blLZdMANAAN4FIreW4xGoAGoAGcu3OXyvbjJ/0h7aXKft1i6C/ktNtC8+5Uts15J5dXya0BnNwpuojtZaB5T5bjP+nanHdyeZXcGsDJnaKL2F4GmvdkOTSAnYLf/iKQrwDndoAuogZwbl/+1GwawMmd1wDuC942vZNb+5LpNICT26YBaAAnj9zDdBrAyd3QADSAk0dOA7iU4PBPX7fPYWo8O7Vqc97J5VVyewGc3Cm6iO1loHlPlsOfAuwU3J8CnK8+XUQN4Pze/IkZ8a8C7xrIJC9dLtpomjvJSzFpjTTu3WqkvKneVB+KR+vbHacBPOgAbTYdnlsqitkejHerkepD9ab6UDxa3+44DUAD+KLAriGnS5gsDeVCc1O8pMadsRqABqAB3L4M2/TTmZ3Lf8utAWgAGoAGsPah9ukz4bgUc832VwTlnOSlmLRGGvduNVLeVG+qD8Wj9e2O8wLwAvAC8AJY+1Db+SYcl2Ku2XoBUI2ace3+TVxx7T1o6ncEywvAC8ALwAtg7R1t56Nun+SlmGu2XgBUo2Zcu39eAOvueAF4AXgBeAGsneIVIpJrgfCZeCKRvBNPLpp3Io725d30bvNu4916jS+AicFoY1KBaN53G0jKux1H+/Juerd5t/E0gMWkv9tAtheb4k0MLs1N4yZqbGO28TQADYDux1NxE4P7VEHffHiixjZmG08D0ADae/Qt3sTgtgufqLGN2cbTADSA9h5pAP9SoL2wbTwNQAPQAH4rMLFcbcw2ngagAWgAGsDHz1Om4IQk1CFpKf4UgCr1OI725d30bvNu43kBeAF0NnyBMjG47cInamxjtvFGDKBdJMVLBoI+aWhuinercQIz4U5iaY0E63PI4F/boXgTcW3OE7xHarzNZFNQWiQdCoqXcGjnpngaQNKlc2N3zhllOlKjBnBffiq4BvB4hBN96DK042ivk7xt3iM1agAawP8r0B609iIkS0hj25x9BSh9wbazMTR3MuATmHTIaRytkeIl+lDMdlybswagAXyrAB20nUtDa6RLuJMLrbHNWQPQADSA3wpoANSGHseNmJTfAfgdgN8B8B/PJqvcNj4NIFH/QSxtDBWc4t1KmsAsyfI3DK2R5k30oZjtuDZnXwF8BfAVwFeAqk+NmNRPiEpdHMLh3w6jeInjUsw254kaqxMWgrX1oXjvdkklvMMWLcN/aAD3NaKNoYaiATyeR6q3BrDcaxygAZz4XYEGoAF8p0BifHizYaAGoAHAUfkaRgeXXkgUzwvgcMu+fFAD0AAOTxNdWA2gd/kcbtadD2oAGsDhmdIAHks3YXyHm6UB/KNAuzEUz+8Aek9Cqjk1qfZivcpriheAF8Dh2afLNbGsE5iHhbjzwVeoUQPQAA7PvQbgK8AXBdquR/Emzuv2gE/UeHh7Cx9s60PxXuW8prOb8C607T8Ql//HQamIyXJREWnupIFtzDbexHLtrJH2mvaQcqF5d8dpAA86QJtNh+fdlovy3qkjXbA2F5p3d5wGoAFc5jWOLmFipHTBaG5qZjTv7jgNQAPQAII/Xa4BnGxZieDUxSkFmjvJ28Zs4yVPV8p7Z420120uNO/uOC8ALwAvAC+A3T50Pz99evhTgMc9pE84L4DHOibzeN2t+qcyLwAvAC8AL4DrelXiuMlTjjCmuZO8bcw2nheAFwDZjdNi6ID7CuArwDNDSU08mcdn6jnrs74C+ArgK8Cf/ApA/ybgWY70/3moMyenK+VCc088FWhuyiWJo3xojW28iV5TfSjnpEaKOaEj/r8BqUDtOCpOIjitkeamjaF5J15nktyUT1sfijfRa6rPRI0Us92XzznzArjf+nZj6JBpAGul6DKskbIIOhOJSVFMypniaQCL3lMhaWOSUaO5E0waS/nQGtt4yXJRzjSOck5qpJgTOnoBPOh8uzF0yLwA1krRZVgjZRF0JjSATNe70ROC09Jo7olhpLkplySO8qE1tvGS5Up4k1jKOamRYk7o6AXgBfBFgfagtfGS5SJLncTQZU1qpJgTOmoAGoAGEDgAXVYNIBD1UeiE4LQ0mps6M83rdwBrpSY0X2f9wP+orQZA1AQxdAkTwUHazxCae2IYaW7KJYmjfGiNbbyJXlN9KOekRoo5oSP+VeCJ5FT0XXGUc1Jfu9k0N81L8SbiEr0pH4pJ8SZ4tzEp58+H3MfHx09SAAX9U4UkGu68Kl6hL3TGJnR8BX3ojEU6agD3ZU2EpM2hg9bOTfNSHhNxCWfKh2JSvAnebUzK2QtgoXwiJG0iHbR2bpqX8piISzhTPhST4k3wbmNSzhqABtCevafwosH9cXt7Xf9HMTWA0jL8qUKuR/FXBNWHDm47L8WbiEs4t3WkeBO825iRjn4H4HcA7QE8ihcNrhfAXZkjHTUADeDowrY/Fw2uBqABtAfw//GSgaS10FOznZvmpTwm4hLOlA/FpHgTvNuYlPPnK6kXgBdAewCP4kWD6wXQuQDoXwSiDpk0kQwKzUuw/opp15jkprGUN+VC8Wh9u+Mob1on1SfJSzFpjTR3khf/34AUlBZJSdO8FO8W164xyU1jKW/KheLR+nbHUd60TqpPkpdi0hpp7iSvBkDVPzmONnFiKE6meigd5U3B23p/vl/D1xRaI+Wc5NUAqPonx9EmTgzFyVQPpaO8KXhbbw2AKr+Io41J0rWHJ8lNYylvyoXi0fp2x1HetE6qT5KXYtIaae4krxcAVf/kONrEiaE4meqhdJQ3BW/r7QVAlfcC+FaB9kBSvFLbxmE0gPsSJ732Ahgf1WMJaBPpIlC8Y9We/ynKm1ZG9UnyUkxaI82d5NUAqPonx9EmTgzFyVQPpaO8KXhbb18BqPK+AvgKcGBWNIDSKwD9VWDaI9oY6rg07y2unbuN9wpcXuXJlWi5K3bX/NC8n73WAO6PBxXyncxMA+jZxa75oXk1gEWvqZAawGMhd+rYW+ccaRdvmlcD0ACe+v6BrgQdyAkjpTVOxO3iTfNqABqABjCx+b8x6SK2jY/m1QA0AA1AA2D/MAjVibpP2/X8KUDnPdwvAemkr+N27QLN6wXgBeAFsN7jwxF0EdsPQ5pXA9AANIDD673+IF1EDWCtJYpoC97GQySGvkCiXHwFSLrUee3SAEqa0yGngrfxEprt3BRPA0i69AYGQP8oaE+W90OihrLzi8oJ1RPe7fyJoTVzJ5xpjRSzjfdp9hrA8+NBG6gBPK/1Xwh0GXoZfyG9Qq+TGjWAwoQkgtPBpZgUr0DzCwStcSL3Lt4JZ1ojxWzjeQGUJpM20AugJHjwf372MnoBtLV8GzwN4PxW0qdhu7JX6HVSo68AhQlJBKeDSzEpXoGmrwB+BzAxRq+PSZfVV4Ber3cZ3yv0OqnRC6Awk4ngdHApJsUr0PQC8AKYGKPXx6TL6gXQ6/Uu43uFXic1egEUZjIRnA4uxaR4BZpeAO94AbT/JuDEoO3CnFguutiU884a27kTbWhuitnGS6492us2l8/fA9AA7stPh4I28FPwTf9i7ESNbX0SbWhuitnG0wCSibtoLB2KpHw6kBRzZ43t3Ik2NDfFbONpAHSCLxxHhyKhQAeSYu6ssZ070YbmpphtPA2ATvCF4+hQJBToQFLMnTW2cyfa0NwUs42nAdAJvnAcHYqEAh1IirmzxnbuRBuam2K28TQAOsEXjqNDkVCgA0kxd9bYzp1oQ3NTzDaeBkAn+MJxdCgSCnQgKebOGtu5E21oborZxtMA6ARfOI4ORUKBDiTF3FljO3eiDc1NMdt4GgCd4AvH0aFIKNCBpJg7a2znTrShuSlmG+/tDIAKRAd3Z5xD8Vj9nfrQudg1j1QbymPCKJLc+DcBdwmekKGxtImUM8WbaDbNTbncamxjUjzavwkdae534vLZa/qrwMkAUTF3xdEmUs4Ub2JwaW7KRQPoXEfJbCe9SXBJrAbwQCXaGLqEGgAZSRZDe8PQeFTSa4q6i4sXwKJDtDHJUFBMOjw0d5K3jUnxKOcJI6W534mLBqABfKsAHXJqKhSPLqEGkCi1eKXxO4D7Ak0MOMWkLabLleRtY1I8ylkDSJTSAL4oQAeSLg3Fmxhcmpty+TwL4d8soJgULxlrmjvBJLHvxMVXAF8BfAUgW/+vGA0gFOyK4bSJ9ClD8bwAetNAe9PL+Asp6TXNvYvLyAUwIVBbSFrjzsZQzpQLxUtMaiJ3UufVY+n8UB3beBpA6RVg5yDS4UlqnBi0JP+7xLZ1bONpABrAtwpMDNq7LHXCo61jG08D0AA0gGSjw9j2wrbxNAANQAMIlzoJby9sG08D0AA0gGSjw9j2wrbxNAANQAMIlzoJby9sG08D0AA0gGSjw9j2wrbxNAANQAMIlzoJby9sG08D0AA0gGSjw9j2wrbxNAANQAMIlzoJby9sG08DKBnAn/rbeBMDmSzYjljK+XO54P9VSXkkuSlm/U+CtUlTIrc4KhCtsY23k0uSm8bu1IfW2I6jnDWAtvIAjzZHAwBigpC23iDl9hDKWQPY0CraHA2g05y23p2qZlEoZw1gtg+nfHlFm00NJZFkZ25a5yvUSLnQOMpZA6CKFuNoc+jCtvESqjtz0zpfoUbKhcZRzhoAVbQYR5ujAXREb+vdqWoWhXLWAGb74CvAbwWomU20gy7DzhrbvClnDaCtPMCjzaED2cYDFP4O2Zmb1vkKNVIuNI5y1gCoosU42hwNoCN6W+9OVbMolLMGMNuHS70CJFRfwXwSPs3YieWimO2+JAZAa6RaUy6fNbb/ZaAkOSVE46iQtEaKR+ubGArKJalxV2yiN+VNMdt4E72mfaFcNICFonR4aGMmhiJpdlLnjthEb8qbYrbxJnpNe0K5aAAaAJ2pU+Losk4sF12anTXSJlAuGoAGQGfqlLidy0WXZmeNtAmUiwagAdCZOiVu53LRpdlZI20C5aIBaAB0pk6J27lcdGl21kibQLloABoAnalT4nYuF12anTXSJlAuGoAGQGfqlLidy0WXZmeNtAmUiwagAdCZOiVu53LRpdlZI20C5TJiALTInXFUoKTZbT60xnbeBI/qM8FlV26aN9GR6jOSu/2bgAnxXbE7BaecaY0UbyKODuQEl125ad5Eb6rPSG4N4H6rJgSng0GHguJNxFF9Jrjsyk3zJnpTfUZyawAaQDKs/46lA0kHPKljV26aN+FC9RnJrQFoAMmwagA/j8p193MaQF3Sx4A7BadUaY0UbyKOPpEmuOzKTfMmelN9RnJ7AXgBJMPqBeAFcHReLvO5nY5LRaA1UryJOPpEmuCyKzfNm+hN9RnJ7QXgBZAMqxeAF8DRebnM53Y6LhWB1kjxJuLoE2mCy67cNG+iN9VnJDe9ABJC7xJLBacNvOlCMamGNHc7760+mptymaiR5m5z2dlryvmzhxrA868AyfC0h5zmbufVANZr1tac9npd2T8RGsADtWgDk8ZQTNpEmrudVwNYd6itOe31ujINAGlEG5g0hmKiAoMzvJ1XA1h3qK15Mmfr6n5FeAF4AdBZ+RLXHsj2wiTE2lz8DiBR/6KxdCCT4aGYVBKau53XC2DdobbmtNfrynwFQBrRBiaNoZioQF8BqEzLuKSHS7DfAbt6TevzFWChFG1gMjwUkzaR5m7n9QJYd6itOe31ujIvAKQRbWDSGIqJCvQCoDIt45IeLsG8AKhE146jy5oMD8WkytDc7bxeAOsOtTWnvV5X5gWANKINTBpDMVGBXgBUpmVc0sMl2AtdAP8DM512+NlSZZIAAAAASUVORK5CYII=",
      // 删除显示添加按钮
      //联系人
      deleteContactStyle: false,

      // 新建档案显示和隐藏
      addarchivesStyle: false,
      //绑卡弹框显示
      cardDisable: false,
      // 弹窗显示
      dialogVisible: false,
      cardId: "",
      // 往右侧传值的字段
      // stepStyleobj: {
      //   patientName:'',
      //   // idCardNum:'',
      //   phoneNum:'',
      //   patientBirthday:'',
      //   patientId:''
      // },
      // 相似档案显示隐藏
      patientListShow: true,
      // add页面的显示
      htmlShow: false,
      // 编辑
      eihtmlShow: false,
      // 档案初始化显示
      htmlShowStyle: true,
      checked: "",
      active: 0, //切换步骤
      toolBoxs: [],
      // 相似档案列表
      patientList: [],
      //form表单
      recordForm: {
        // isHomeBed: "1",

        nativePlaceCode: "",

        bloodType: "",

        maritalStatus: "",

        nationCode: "1",

        identificationType: "",

        identificationNum: "",

        // siPatientCode: '',
        miNum: "",

        settlementType: "",

        // phoneNum: '',
        mobileNum: "",

        addrCode: "",

        // patientAddr: '',
        familyAddress: "",

        // admitIllnessSummary: '',
        summaryOfIllness: "",

        // admitOpinion: '',
        createOpinions: "",

        // siRegDiseaseCode: '',
        diseaseType: "",

        // admitTypeCode: '',
        createType: "",

        chargeDate2: [],

        // admissionSituation: '', // 入院病情
        criticalLevel: "", // 入院病情

        // admissionMode: "",

        // finAdmissionTime: "",
        // admissionSdeptId: "",
        // admissionWdeptId: "",

        headImg: require("@/assets/pojehjdz.jpeg"),
        patientAge: "",

        // birthDate: '',
        patientBirthday: "",

        patientGender: "",
        patientId: "",
        patientName: "",
        archGuarantorList: []
      },
      // 患者联系人
      patientEmpiInfoAdditionalVOS: [],
      // *就诊凭证*/
      PatientEmpiInfoCertificateVO: [],
      // 地址籍贯
      patientEmpiInfoAddrssVO: {
        houseHoldAddress: [],
        currentAddress: [],
        createdAt: "",
        createdBy: "",
        createdByName: "",
        currentCityCode: "",
        currentCityName: "",
        currentDetail: "",
        currentPostpode: "",
        currentProvinceCode: "",
        currentProvinceName: "",
        currentRegionCode: "",
        currentRegionName: "",
        dataVersion: "",
        deletedAt: "",
        deletedStatus: "",
        hosId: "",
        houseHoldCityCode: "",
        houseHoldCityName: "",
        houseHoldDetail: "",
        houseHoldPostpode: "",
        houseHoldProvinceCode: "",
        houseHoldProvinceName: "",
        houseHoldRegionCode: "",
        houseHoldRegionName: "",
        id: "",
        orgId: "",
        patientId: "",
        updatedAt: "",
        updatedBy: "",
        updatedByName: ""
      },
      //l-value-domin组件code码
      selectCode: {
        countryCode: "WORLD_REGIONAL_NAME_CODE", //国家
        patientGender: "GENDER_CODE", // 性别
        identificationType: "MARK_TYPE_CODE", //卡类型
        bloodType: "BLOOD_TYPE_CODE", //血型
        maritalStatus: "MARITAL_STATUS_CODE",
        nativePlaceCode: "AdministrativDivision",
        nationCode: "NATIONAL_NAME_CODE",
        domicile: "AdministrativDivision",
        address: "AdministrativDivision",
        careerCode: "OCCUPATIONAL_CLASSIFICATION_CODE",
        // settlementType: 'MEDICAL_INSURANCE_CODE',
        settlementType: "settlementType",
        settlementCompany: "settlementCompany",
        socialSecurity: "socialSecurity",
        bookbuildingType: "bookbuildingType",
        cardAssociated: "clinictype",
        fileLoading: "ARCH_STATUS",
        type: "contactType",
        relationShip: "RELATION_CODE",
        sbdjbz: ""
      },
      // 校验规则
      rules: {
        patientName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          },
          {
            validator: patientNameValidate,
            trigger: "blur"
          }
        ],
        patientGender: [
          {
            required: true,
            validator: notNull,
            msg: "性别不能为空？？",
            trigger: "blur"
          }
        ],
        bloodType: [
          {
            required: true,
            validator: notNull,
            msg: "血型不能为空",
            trigger: "blur"
          }
        ],
        // nativePlaceCode:[{
        //   required: true,
        //   validator: notNull,
        //   msg: '籍贯不能为空',
        //   trigger: 'blur'
        // }],
        maritalStatus: [
          {
            required: true,
            validator: notNull,
            msg: "婚姻状况不能为空",
            trigger: "blur"
          }
        ],
        nationCode: [
          {
            required: true,
            validator: notNull,
            msg: "民族不能为空",
            trigger: "blur"
          }
        ],
        // identificationType:[{
        //   required: true,
        //   validator: notNull,
        //   msg: '证件类型不能为空',
        //   trigger: 'blur'
        // }],
        // identificationNum:[{
        //   required: true,
        //   validator: notNull,
        //   msg: '证件号码不能为空',
        //   trigger: 'blur'
        // }],
        // 结算类型
        settlementType: [
          {
            required: true,
            validator: notNull,
            msg: "结算类型不能为空",
            trigger: "blur"
          }
        ],
        mobileNum: [
          {
            required: true,
            validator: mobileNumValidate,
            msg: "电话格式不正确",
            trigger: "blur"
          }
        ],
        addrCode: [
          {
            required: true,
            validator: notNull,
            msg: "联系地址不能为空",
            trigger: "blur"
          }
        ],
        // familyAddress:[{
        //   required: true,
        //   validator: notNull,
        //   msg: '联系具体地址不能为空',
        //   trigger: 'blur'
        // }],
        // summaryOfIllness:[{
        //   required: true,
        //   validator: notNull,
        //   msg: '病情摘要不能为空',
        //   trigger: 'blur'
        // }],
        // createOpinions:[{
        //   required: true,
        //   validator: notNull,
        //   msg: '建床意见不能为空',
        //   trigger: 'blur'
        // }],
        // diseaseType:[{
        //   required: true,
        //   validator: notNull,
        //   msg: '社保登记病种不能为空',
        //   trigger: 'blur'
        // }],
        // createType:[{
        //   required: true,
        //   validator: notNull,
        //   msg: '建床类型不能为空',
        //   trigger: 'blur'
        // }],
        chargeDate2: [
          {
            required: true,
            validator: notNull,
            msg: "本次治疗时间不能为空",
            trigger: "blur"
          }
        ],
        criticalLevel: [
          {
            required: true,
            validator: notNull,
            msg: "入院病情不能为空",
            trigger: "blur"
          }
        ],
        admissionMode: [
          {
            required: true,
            validator: notNull,
            msg: "入院途径不能为空",
            trigger: "blur"
          }
        ],
        admissionSdeptId: [
          {
            required: true,
            validator: notNull,
            msg: "科室不能为空",
            trigger: "blur"
          }
        ],
        admissionWdeptId: [
          {
            required: true,
            validator: notNull,
            msg: "病区不能为空",
            trigger: "blur"
          }
        ],
        patientBirthday: [
          {
            required: true,
            message: "请选择出生日期",
            trigger: "blur"
          }
        ],

        fiduciaryName: [
          {
            validator: patientNameValidateA,
            trigger: "blur"
          }
        ],
        archPhoneAdd: [
          {
            required: true,
            validator: concatPhoneAdd,
            trigger: "blur"
          }
        ],
        archPhone: [
          {
            validator: concatPhoneArch,
            trigger: "blur"
          }
        ],
        relationShip: [
          {
            validator: relationShipValidate,
            trigger: ["change", "blur"]
          }
        ]
      },

      birthPickerOption: {
        disabledDate(date) {
          return date.getTime() < new Date("1900-01-01 00:00:00");
        }
      },

      // 入院日期只允许选择今天之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      //日期只可以选当前日期
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() > Date.now();
        }
      },
      birthTimeOption: {
        selectableRange: "00:00:00 - 23:59:59"
      },
      idNumber: "读取身份证",
      addidNumber: "添加身份凭证",
      veriCodeDisabled: false,
      resetFields: "",
      timer: null, //定时器
      cardList: [],
      // archCardList: {},
      // 分页
      sizedata: {
        pageNo: 1,
        pageSize: 10
      },
      // 提交后返回的页码
      activeNew: null,
      // 禁止编辑极端
      disableEditing: false,
      readTheStyle: false
    };
  },
  // // 父组件中返回要传给下级的数据
  // provide() {
  //   return {
  //     stepStyleobj: this.stepStyleobj
  //   };
  // },
  computed: {
    sideTabsCls() {
      return {
        height100: true,
        "penetrate-tabs": true,
        "son-padding-left": true,
        sideTabs: true,
        singleTabCls: this.tabsName.length === 1
      };
    },
    chargeDate2Options() {
      // let _this = this
      // return {
      //   disabledDate(time) {
      //     const times =  86400000 * 60
      //     let curSelectTime = new Date(_this.minDate).getTime()
      //     let before = curSelectTime
      //     let after = curSelectTime + times
      //     return time.getTime() > after || time.getTime() < before
      //   },
      //   onPick({maxDate, minDate}) {
      //     if (!maxDate) {
      //       _this.minDate = minDate
      //     }
      //   }
      // }
    }
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),

    // 切换左侧查询页tabs
    tabPenetrateClickWrapper(tab) {
      console.log("tab", tab);
      this.tabPenetrateClickVue();
    },
    tabPenetrateClickVue() {
      console.log("11111");
      // this.loadData();
    },
    choosePatientFun(item) {
      console.log("choosePatientFun", item);
      this.clearOldData();
      // this.loadData();
      if (item.applyId) {
        this.patientListFunData2(item); // 申请历史
      } else {
        this.patientListFunData(item); //待申请
      }
    },
    clearOldData() {
      (this.recordForm = {
        // isHomeBed: "1",

        nativePlaceCode: "",

        bloodType: "",

        maritalStatus: "",

        nationCode: "1",

        identificationType: "",

        identificationNum: "",

        // siPatientCode: '',
        miNum: "",

        settlementType: "",

        // phoneNum: '',
        mobileNum: "",

        addrCode: "",

        // patientAddr: '',
        familyAddress: "",

        // admitIllnessSummary: '',
        summaryOfIllness: "",

        // admitOpinion: '',
        createOpinions: "",

        // siRegDiseaseCode: '',
        diseaseType: "",

        // admitTypeCode: '',
        createType: "",

        chargeDate2: [],

        // admissionSituation: '', // 入院病情
        criticalLevel: "", // 入院病情

        // admissionMode: "",

        // finAdmissionTime: "",
        // admissionSdeptId: "",
        // admissionWdeptId: "",

        headImg: require("@/assets/pojehjdz.jpeg"),
        patientAge: "",

        patientBirthday: "",
        // patientBirthday: '',

        patientGender: "",
        patientId: "",
        patientName: "",
        archGuarantorList: []
      }),
        (this.zdData = []);
    },
    deleteConfirm(rowIndex, row) {
      console.log("deleteConfirm", rowIndex, row);
      // console.log([row.id]);
      this.$confirm("确定要删除此项吗？", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.zdData.splice(rowIndex, 1);
          // this.zdData[rowIndex].operateType = "1"
          console.log(this.zdData);
          // this.$nextTick(() => {
          //   this.$refs.zdData.doLayout();
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addZD(rowIndex, row) {
      this.zdData.push({
        cwFlag: "1",
        diagName: "",
        diagIcd: "",
        diagCode: "",
        diagTime: new Date().format("yyyy-MM-dd"),
        remoteParams1: {
          keyword: "",
          type: "",
          cwFlag: "1"
        },
        _orgSettingData: [],
        settingData: [],
        keyword: "",
        currVal: null,
        valuekey: "icd10Encoding",
        labelname: "dictionaryName",
        operateType: "0"
      });
    },
    getDeptId(val) {
      this.recordForm.manageDoctorId = "";
      this.recordForm.manageNurseId = "";
      // this.recordForm.manageDoctorName = "";
      // this.recordForm.manageDoctorName = "";
      this.getDoctor(val);
    },
    getDoctor(id) {
      // 查科室医生和护士
      // this.doctorList.length = 0;
      // this.nurseList.length = 0;
      // this.doctorList.splice(0);

      // 查所有可用医生和护士 1是医生,2是护士
      canBeUseDoctorAndNurseList({
        hosId: this.hosId,
        utype: "1"
      })
        .then(res => {
          if (res.code === 1) {
            this.doctorList = res.data;
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
      canBeUseDoctorAndNurseList({
        hosId: this.hosId,
        utype: "2"
      })
        .then(res => {
          if (res.code === 1) {
            this.nurseList = res.data;
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
      // getDeptDoctorList(id)
      //   .then(res => {
      //     if (res.code === 1) {
      //       this.doctorList = res.data;
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error(err);
      //   });
      // nurseList(id)
      //   .then(res => {
      //     if (res.code === 1) {
      //       this.nurseList = res.data;
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error(err);
      //   });
    },
    docChange(val) {
      // if (val) {
      //   this.recordForm.manageDoctorId = this.doctorList.find(item => {
      //     return val === item.uid;
      //   }).uname;
      // }
    },
    docChangeNurse(val) {
      // if (val) {
      //   this.recordForm.manageNurseId = this.nurseList.find(item => {
      //     return val === item.uid;
      //   }).uname;
      // }
    },
    // 监听病区修改
    changeWard() {
      this.getBedList();
    },
    bedChange(val) {
      this.recordForm.bedCode = this.bedListData.find(item => {
        return val === item.bedId;
      }).bedCode;
      console.log("bedChange", this.recordForm);
    },
    // 获取科室
    getDeptList() {
      // this.$set(this.recordForm, "bedId", "");
      deptList()
        .then(res => {
          this.deptList = [];
          if (res.code === 1) {
            this.deptList = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
      WdeptList()
        .then(res => {
          this.WdeptList = [];
          if (res.code === 1) {
            this.WdeptList = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    // 获取床位
    getBedList() {
      // this.$set(this.recordForm, "bedId", "");
      bedList({
        // wardCode: this.recordForm.admissionWdeptId,
        // deptCode: this.recordForm.admissionSdeptId,
        type: 2
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
    cwFlagChange(n, m, index) {
      console.log("n", n, "m", m, "index", index);
      // console.log(this.$refs.diagName[0].$refs.elem.options);
      // let hosType2 = "";
      // if (this.hosType === "1") {
      //   hosType2 = this.hosType;
      // } else if (this.hosType === "3") {
      //   hosType2 = "2";
      // } else {
      //   hosType2 = ""; // hosType值为2时是急诊 目前无急诊，所以hostype为2时，值为空，后期如项目需要可从此位置更改传参
      // }
      // if (this.diagnosticForm.diagName) {
      //   this.diagnosticForm.diagName = "";
      // }
      // if (n === "1") {
      // this.remoteShowKey = "dictionaryName";
      // this.remoteValueKey = "icd10DictionaryId";
      console.log("this.zdData", this.zdData);
      this.zdData[index].remoteParams1 = {
        keyword: "", //this.diagnosticForm.diagName,
        type: "", //hosType2,
        cwFlag: n
      };
      // m.remoteParams1 = {
      //     keyword: '',//this.diagnosticForm.diagName,
      //     type: '',//hosType2,
      //     cwFlag: n
      // };
      console.log("this.zdData---", this.zdData);
      // } else {
      //   this.remoteShowKey = "tcdName";
      //   this.remoteValueKey = "tcdCode";
      //   this.remoteParams = {
      //     ...this.remoteParams,
      //     ...{
      //       keyword: this.diagnosticForm.diagName,
      //       type: hosType2,
      //       cwFlag: "2"
      //     }
      //   };
      // this.$refs.diagName[0].$refs.elem.options = [];
      // }+
      // this.diagnosticForm.cwFlag = m.code;
      // this.diagnosticForm.cwFlagName = m.name;
      // this.diagnosticForm.diagName = "";
      // this.diagnosticForm.diagCode = "";
    },
    // diagNameChange(n, m) {
    //   console.log(JSON.stringify(m));
    //   console.log(JSON.stringify(n));
    //   if (typeof m.dictionaryName !== "undefined") {
    //     m.diagCode = m.icd10Encoding;
    //     m.diagName = m.dictionaryName;
    //     m.remoteParams1 = { ...m.remoteParams1, ...{ diagId: m.id } };
    //   } else {
    //     m.diagCode = m.tcdCode;
    //     m.diagName = m.tcdName;
    //     m.remoteParams1 = { ...m.remoteParams1, ...{ diagId: m.id } };
    //   }
    // },
    async focusSelect(index, row) {
      console.log("focusSelect-------", index, row);
      // this.settingData = [...this._orgSettingData];
      await this.request(row);
    },
    remoteMethod(query, row) {
      row.remoteParams1.keyword = query;
      console.log("remoteMethod-----query-----", query);
      console.log("remoteMethod-----row-----", row);
      // this.settingData = [...this._orgSettingData];
      this.request(row);
    },
    async request(row) {
      console.log("request-------", row);
      try {
        this.loading = true;
        let params = {};
        if (row.remoteParams1) {
          params = { ...row.remoteParams1 };
        }

        let { data } = await get("/patTcmDiag/getDiagNameCode", params);
        console.log(data, "中医证型请求的数据：data");
        if (row.cwFlag == "2") {
          row.valuekey = "tcdCode";
          row.labelname = "tcdName";
        } else {
          row.valuekey = "icd10Encoding";
          row.labelname = "dictionaryName";
        }
        // row._orgSettingData = [...data];
        // row.settingData = this.filterHandler(row);
        row.settingData = [...data];
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.errorMsg);
      }
    },
    // 触发父组件的change事件
    changeFunc(key, row) {
      console.log("changeFunc-key", key);
      console.log("changeFunc-row", row);
      // this.$emit("update:value", item);
      let obj = {};
      obj = row.settingData.find(item => {
        if (row.cwFlag == "1") {
          return item.icd10Encoding == key;
        } else {
          return item.tcdCode == key;
        }
      });
      if (row.cwFlag == "1") {
        row.diagCode = obj.icd10Encoding;
        row.diagName = obj.dictionaryName;
      } else {
        row.diagCode = obj.tcdCode;
        row.diagName = obj.tcdName;
      }

      // 重复诊断添加校验
      let zdList = this.zdData.filter(
        zdItem => zdItem.diagCode === row.diagCode
      );
      if (zdList.length > 1) {
        this.$message.warning("不能添加重复诊断！");
        row.diagCode = "";
        row.diagName = "";
        return;
      }

      // let curItem = this.getValueByKey(row.settingData, item);
      // this.$emit("change", item, curItem);
    },
    // // 选择器绑定的值为null后触发
    // localFilterHandler(query) {
    //   // this.settingData是option循环的对象
    //   this.settingData = this.filterHandler(query);
    // },
    filterHandler(row) {
      if (!row._orgSettingData) {
        return [];
      }
      // debugger
      let datas = [...row._orgSettingData];
      if (
        !datas.length
        //  || !keyword ||
        // !keyword.length
      ) {
        return datas;
      }
      return datas.filter(item => {
        let hasKey = false;
        for (const key in item) {
          let value = item[key];
          if (
            value
              .toString()
              .toLowerCase()
              .indexOf(row.keyword.toLowerCase()) != -1
          ) {
            return true;
          }
        }
        return !hasKey;
      });
    },
    tableRowClassName({ row, rowIndex }) {
      console.log("tableRowClassName", row);
      if (row.operateType == "1") {
        return "operate-type-hide";
      }
      return "";
    },

    // readTheFun
    readTheFun() {
      this.readTheStyle = true;
    },
    openstyle() {
      //打开健康档案
    },
    // cancelstyle取消新建档案
    cancelstyle(a, dataObj) {
      console.log("dataObjdataObjdataObjdataObjdataObj", dataObj);
      this.addarchivesStyle = a;
      // this.htmlShowStyle = true;
      // this.htmlShow = false;

      if (dataObj) {
        //  this.patientListFunData(dataObj);
        this.changeRecPatientData(dataObj.patientArchiveInfoVO);
        this.$refs.directcheckleftbar &&
          this.$refs.directcheckleftbar[0].search(
            dataObj.patientArchiveInfoVO.patientCode
          );
      }
    },

    //子组件信息
    changeCardDisable(data, dataObj) {
      this.cardDisable = data;
      console.log(dataObj, "dataObjdataObjdataObjdataObjdataObj");
      console.log(this.cardList, "dataObjdataObjdataObjdataObjdataObj");
      if (dataObj) {
        for (let i = 0; i < this.cardList.length; i++) {
          if (this.cardList[i].cardType == dataObj.cardType) {
            this.$message.error("禁止添加同一类型卡");
            break;
          } else {
            this.cardList.push(dataObj);
            break;
          }
        }
        if (this.cardList.length == 0) {
          this.cardList.push(dataObj);
        }
      }
    },
    async cardSave(data) {
      this.cardDisable = data;
      await this.getCordByPatientId();
      this.$refs.child.queryFun();
      this.activeNew = 2;
    },
    // 获取患者所有卡
    async getCordByPatientId() {
      let param = {
        patientId: this.recordForm.patientId
      };
      let res = await getCordByPatientId(param);
      this.cardList = res.data;
    },

    // 监听有无患者
    htmlShowStyleFunData(a) {
      // add页面的显示
      this.htmlShow = false;
      // 编辑
      this.eihtmlShow = false;
      // 档案初始化显示
      this.htmlShowStyle = true;
      // this.addnewFun();
    },
    // 新建档案
    addnewFun(inputnum, a) {
      // this.active = 0;
      // // add页面的显示
      // this.htmlShow = false;
      // // 编辑
      // this.eihtmlShow = false;
      // // 档案初始化显示
      // this.htmlShowStyle = true;
      this.addarchivesStyle = true;
    },
    // 新建档案
    addnewFile() {
      // 禁止输入
      this.disableEditing = false;
      // add页面的显示
      this.htmlShow = false;
      // 编辑
      this.eihtmlShow = false;
      // 档案初始化显示
      this.htmlShowStyle = true;
    },
    // 取消
    cancelFun() {
      this.htmlShow = false;
      // 编辑
      this.eihtmlShow = false;
      // 档案初始化显示
      this.htmlShowStyle = true;
      // this.emptyFun();
      this.refsChild();
    },

    patientListFunData(item) {
      this.recordForm = item;
      // this.recordForm = Object.assign(this.recordForm, item)
      this.recordForm.maritalStatus = this.recordForm.maritalStatus
        ? this.recordForm.maritalStatus + ""
        : "90";
      this.recordForm.bloodType = this.recordForm.bloodType
        ? this.recordForm.bloodType
        : "5";
      console.log("控制显示到第一页", item);
      console.log("控制显示到第一页", this.recordForm);
      // 控制显示到第一页

      if (true) {
        // add页面的显示
        this.htmlShow = true;
        this.htmlShowStyle = false;
        // 编辑
        this.eihtmlShow = false;
        this.deleteContactStyle = false;
      } else {
        // add页面的显示
        this.htmlShow = false;
        // 编辑
        this.eihtmlShow = true;
        // 档案初始化显示
        this.htmlShowStyle = true;
      }

      if (this.recordForm) {
        for (let obj in this.recordForm) {
          // this.recordForm[obj] = item[obj];
          if (obj == "nativePlaceCode" || obj == "addrCode") {
            let str = [];
            if (this.recordForm[obj]) {
              this.recordForm[obj] = this.recordForm[obj]
                .toString()
                .replace(/\[|]/g, "")
                .split(",");
              for (let i = 0; i < this.recordForm[obj].length; i++) {
                str[i] = parseInt(this.recordForm[obj][i]);
              }
              this.recordForm[obj] = str;
            }
          }
        }
        this.recordForm.isHomeBed = this.recordForm.isHomeBed
          ? this.recordForm.isHomeBed
          : "1";
        // ["2020-09-08 00:00:00", "2020-10-05 23:59:59"]
        this.recordForm.chargeDate2 = [
          new Date(Date.now()),
          new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        ];
        // this.recordForm.chargeDate2 = []
        console.log("chargeDate2", this.recordForm.chargeDate2);
        // this.recordForm.treatStartTime
        this.recordForm.headImg = require("@/assets/pojehjdz.jpeg");
        this.recordForm.medicareCard = this.recordForm.patientCode;
        let addrCode = this.recordForm.currentAddress
          ? JSON.parse(this.recordForm.currentAddress)
          : "";
        this.recordForm.addrCode = [];
        for (let i = 0; i < addrCode.length; i++) {
          this.recordForm.addrCode.push(Number(addrCode[i]));
        }
        // this.recordForm.nativePlaceCode = this.recordForm.houseHoldAddress&&this.recordForm.houseHoldAddress!='[,,]'?JSON.parse(this.recordForm.houseHoldAddress):'';
        // this.getDeptList();
        // if(this.recordForm.admissionSdeptId){
        this.getDoctor();
        // }
        // if(this.recordForm.admissionWdeptId&&this.recordForm.admissionSdeptId){
        //   this.getBedList();
        // }
        this.recordForm.admissionSdeptId =
          this.recordForm.admissionSdeptId * 1 || "";
        // console.log('patientBirthday',this.recordForm.patientBirthday)

        // this.stepStyleobj.patientName = this.recordForm.patientName;
        // // this.stepStyleobj.idCardNum = this.recordForm.idCardNum;
        // this.stepStyleobj.mobileNum = this.recordForm.mobileNum;
        // this.stepStyleobj.patientBirthday = this.recordForm.patientBirthday;
        // this.stepStyleobj.patientId = this.recordForm.patientId;
        // if (this.recordForm.idCardNum) {
        //   // 禁止输入
        //   this.disableEditing = true;
        //   this.disableEditingother = true;
        // }
        console.log("整理后的数据11", this.recordForm);
      }

      // 诊断
      if (this.recordForm.diagList) {
        this.zdData = this.recordForm.diagList;

        for (let j = 0; j < this.zdData.length; j++) {
          this.zdData[j].remoteParams1 = {
            keyword: "", //this.diagnosticForm.diagName,
            type: "", //hosType2,
            cwFlag: this.zdData[j].cwFlag
          };
          this.zdData[j].operateType = "2";
        }
      }
      // 联系人
      if (this.recordForm.contactList) {
        console.log("this.recordForm.contactList", this.recordForm.contactList);
        this.recordForm.archGuarantorList = this.recordForm.contactList;
        if (this.recordForm.archGuarantorList.length == 0) {
          this.deleteContactStyle = true;
        }
        for (let j = 0; j < this.recordForm.archGuarantorList.length; j++) {}
      } else {
        this.recordForm.archGuarantorList = [];
        this.addArchGuarantorList();
        this.deleteContactStyle = false;
      }
      // // 卡
      // if (item.archCardList) {
      //   this.archCardList = item.archCardList;
      //   this.cardList = item.archCardList;
      // } else {
      //   this.archCardList = [];
      // }
      this.changeDataheaderFun(this.recordForm);
      console.log("整理后的数据", this.recordForm);
    },
    async patientListFunData2(item) {
      let result = await getApplyInfo({
        applyId: item.applyId
      });

      this.recordForm = result.data;
      this.recordForm.maritalStatus = this.recordForm.maritalStatus
        ? this.recordForm.maritalStatus + ""
        : "90";
      this.recordForm.bloodType = this.recordForm.bloodType
        ? this.recordForm.bloodType
        : "5";

      this.recordForm.workUnit = this.recordForm.workUnitName
        ? this.recordForm.workUnitName
        : "";
      // patientArchiveInfoVOData['workUnitName'] = this.recordForm.workUnit
      // 控制显示到第一页

      if (true) {
        // add页面的显示
        this.htmlShow = true;
        this.htmlShowStyle = false;
        // 编辑
        this.eihtmlShow = false;
        this.deleteContactStyle = false;
      } else {
        // add页面的显示
        this.htmlShow = false;
        // 编辑
        this.eihtmlShow = true;
        // 档案初始化显示
        this.htmlShowStyle = true;
      }

      if (this.recordForm) {
        for (let obj in this.recordForm) {
          // this.recordForm[obj] = item[obj];
          if (obj == "nativePlaceCode" || obj == "addrCode") {
            let str = [];
            if (this.recordForm[obj]) {
              this.recordForm[obj] = this.recordForm[obj]
                .toString()
                .replace(/\[|]/g, "")
                .split(",");
              for (let i = 0; i < this.recordForm[obj].length; i++) {
                str[i] = parseInt(this.recordForm[obj][i]);
              }
              this.recordForm[obj] = str;
            }
          }
        }
        this.recordForm.isHomeBed = this.recordForm.isHomeBed
          ? this.recordForm.isHomeBed
          : "1";
        // ["2020-09-08 00:00:00", "2020-10-05 23:59:59"]
        this.recordForm.chargeDate2 = [
          new Date(this.recordForm.treatStartTime),
          new Date(this.recordForm.treatEndTime)
        ];
        console.log("chargeDate2", this.recordForm.chargeDate2);
        // this.recordForm.treatStartTime
        this.recordForm.headImg = require("@/assets/pojehjdz.jpeg");
        this.recordForm.medicareCard = this.recordForm.patientCode;
        // this.recordForm.addrCode = this.recordForm.addrCode?eval(this.recordForm.addrCode):'';
        // this.recordForm.nativePlaceCode = this.recordForm.houseHoldAddress?JSON.parse(this.recordForm.houseHoldAddress):'';
        // this.getDeptList();
        // this.getDoctor()
        // this.getBedList();
        this.recordForm.addrCode = this.recordForm.addrCode.filter(Boolean); // 过滤 NaN
        console.log("整理后的数据112", this.recordForm);
      }

      // 诊断
      if (this.recordForm.diagList) {
        this.zdData = this.recordForm.diagList;

        for (let j = 0; j < this.zdData.length; j++) {
          this.zdData[j].remoteParams1 = {
            keyword: "", //this.diagnosticForm.diagName,
            type: "", //hosType2,
            cwFlag: this.zdData[j].cwFlag
          };
          this.zdData[j].operateType = "2";
        }
      }
      // 联系人
      if (this.recordForm.contactList) {
        console.log("this.recordForm.contactList", this.recordForm.contactList);
        this.recordForm.archGuarantorList = this.recordForm.contactList;
        if (this.recordForm.archGuarantorList.length == 0) {
          this.deleteContactStyle = true;
        }
        for (let j = 0; j < this.recordForm.archGuarantorList.length; j++) {}
      } else {
        this.recordForm.archGuarantorList = [];
        this.deleteContactStyle = true;
      }
      this.changeDataheaderFun(this.recordForm);
    },

    async handleClose() {
      for (let i = 0; i < this.cardList.length; i++) {
        if (i == this.cardId) {
          this.cardList.splice(i, 1);
        }
      }
      this.dialogVisible = false;
      this.$message.success("解绑成功");
      console.log(this.cardList);
    },
    // //获取年龄接口
    // async getAgeByBirthDate() {
    //   if (this.recordForm.patientBirthday) {
    //     if (this.recordForm.birthTime == null) {
    //       this.recordForm.birthTime = '';
    //     }
    //     try {
    //       let param = {
    //         patientBirthday: this.recordForm.patientBirthday.slice(0, 10) + ' ' + "10:10:10"
    //       };
    //       let res = await getAgeByBirthDate(param);
    //       if (res.code == '1') {
    //         this.recordForm.patientAge = res.data;
    //       }
    //     } catch (error) {}
    //   }
    // },

    //切换工具箱
    messageHandler() {},
    //左侧列表转换tab
    handleClick() {},
    //element组件input无法输入问题
    inputChange(e) {
      this.$forceUpdate();
    },
    // 校验邮箱
    emailFun(item) {
      // item.email
      let reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
      if (reg.test(item.email)) {
      } else {
        this.$message.error("邮箱格式错误");
      }
    },

    //身份证号码校验
    // identifiBlur() {
    //   if (this.recordForm.idCardNum && this.recordForm.idCardNum.length === 18) {
    //     //获取身份证中的性别
    //     let isGender = parseInt(this.recordForm.idCardNum.substr(16, 1)) % 2;
    //     if (isGender == 1) {
    //       this.recordForm.patientGender = '1';
    //     } else {
    //       this.recordForm.patientGender = '2';
    //     }
    //     //根据出生日期带入年龄
    //     //根据身份证号带入出生日期与年龄
    //     let str = this.recordForm.idCardNum.slice(6, 14);
    //     let patientBirthday = str.slice(0, 4) + '-' + str.slice(4, 6) + '-' + str.slice(6, 8);
    //     if (Number(str).toString().length == 8) {
    //       this.recordForm.patientBirthday = patientBirthday;
    //       this.getAgeByBirthDate();
    //     }
    //   } else {
    //     this.$message.error('身份证号不得少于18位');
    //   }
    //   // //获取相似档案信息
    //   // this.patientBlur();
    // },

    refsChild() {
      // this.$refs.child.queryFun();
    },
    // 清空
    emptyFun() {
      // 禁止输入
      this.disableEditing = false;
      for (let obj in this.recordForm) {
        //         headImg: require('@/assets/pojehjdz.jpeg'),
        if (obj == "headImg") {
          this.recordForm[obj] = require("@/assets/pojehjdz.jpeg");
        } else {
          this.recordForm[obj] = "";
        }
      }
      // for (let obj in this.contactList) {
      //   this.contactList[obj] = '';
      // }
      // for (let obj in this.diagList) {
      //   this.diagList[obj] = '';
      // }
      this.recordForm.archGuarantorList = [];
      // 患者联系人
      // this.patientEmpiInfoAdditionalVOS = [];
      // this.archCardList = [];
      this.zdData = [];
    },
    //提交表单
    submit() {
      console.log("this.recordForm", this.recordForm);
      // eslint-disable-next-line complexity
      this.$refs["recordForm"].validate(async valid => {
        if (valid) {
          if (
            !this.recordForm.patientName ||
            this.recordForm.patientName.length <= 0
          ) {
            this.$message.error("姓名不能为空");
            // this.active = 0;
            return false;
          }
          if (
            !this.recordForm.patientGender ||
            this.recordForm.patientGender.length <= 0
          ) {
            this.$message.error("性别不能为空");
            // this.active = 0;
            return false;
          }
          if (
            !this.recordForm.patientBirthday ||
            this.recordForm.patientBirthday.length <= 0
          ) {
            this.$message.error("出生日期不能为空");
            // this.active = 0;
            return false;
          }
          // recordForm.idCardNum
          // if (!this.recordForm.idCardNum || this.recordForm.idCardNum.length <= 0) {
          //   this.$message.error('身份证不能为空');
          //   this.active = 0;
          //   return false;
          // }

          if (
            this.recordForm.identificationNum &&
            !this.recordForm.identificationType
          ) {
            this.$message.error("证件类型不能为空");
            // this.active = 0;
            return false;
          }
          if (
            !this.recordForm.mobileNum ||
            this.recordForm.mobileNum.length <= 0
          ) {
            this.$message.error("手机号不能为空");
            // this.active = 0;
            return false;
          }
          if (
            !this.recordForm.familyAddress ||
            this.recordForm.familyAddress.length <= 0
          ) {
            this.$message.error("联系具体地址不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.archGuarantorList ||
            this.recordForm.archGuarantorList.length < 1
          ) {
            this.$message.error("请填写至少一条联系人信息");
            this.active = 0;
            return false;
          }
          if (this.zdData.length < 1) {
            this.$message.error("请填写至少一条诊断");
            return false;
          }
          // 诊断内部具体信息校验
          if (this.zdData.length > 0) {
            for (let j = 0; j < this.zdData.length; j++) {
              let item = this.zdData[j];
              if (!item.diagName || !item.diagTime) {
                this.$message.error("请填写完整诊断信息");
                return false;
              }
            }
          }
          if (
            !this.recordForm.summaryOfIllness ||
            this.recordForm.summaryOfIllness.length <= 0
          ) {
            this.$message.error("病情摘要不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.createOpinions ||
            this.recordForm.createOpinions.length <= 0
          ) {
            this.$message.error("建床意见不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.diseaseType ||
            this.recordForm.diseaseType.length <= 0
          ) {
            this.$message.error("社保登记病种不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.createType ||
            this.recordForm.createType.length <= 0
          ) {
            this.$message.error("建床类型不能为空");
            this.active = 0;
            return false;
          }
          // console.log(this.recordForm.chargeDate2)
          if (
            this.recordForm.chargeDate2 == undefined ||
            !this.recordForm.chargeDate2 ||
            this.recordForm.chargeDate2.length <= 0
          ) {
            this.$message.error("本次治疗时间不能为空");
            this.active = 0;
            return false;
          }

          this.$showLoading();
          try {
            //保存表单接口接口
            let patientArchiveInfoVOData = {};
            patientArchiveInfoVOData = this.recordForm;
            // 治疗开始结束时间
            patientArchiveInfoVOData["treatStartTime"] =
              (this.recordForm.chargeDate2 &&
                new Date(this.recordForm.chargeDate2[0]).format(
                  "yyyy-MM-dd"
                )) ||
              "";
            patientArchiveInfoVOData["treatEndTime"] =
              (this.recordForm.chargeDate2 &&
                new Date(this.recordForm.chargeDate2[1]).format(
                  "yyyy-MM-dd"
                )) ||
              "";

            patientArchiveInfoVOData["patientBirthday"] =
              this.recordForm.patientBirthday.substring(0, 10) +
              " " +
              "00:00:00";

            patientArchiveInfoVOData[
              "contactList"
            ] = this.recordForm.archGuarantorList;
            patientArchiveInfoVOData["diagList"] = this.zdData;

            patientArchiveInfoVOData["workUnitName"] = this.recordForm.workUnit;

            // patientArchiveInfoVOData['patientEmpiInfoAddrssVO'] = this.patientEmpiInfoAddrssVO;
            // patientArchiveInfoVOData['patientEmpiInfoAdditionalVOS'] = this.recordForm.archGuarantorList;
            // patientArchiveInfoVOData['archCardList'] = this.cardList;
            delete patientArchiveInfoVOData["chargeDate2"];
            // delete patientArchiveInfoVOData["addrCode"]
            delete patientArchiveInfoVOData["headImg"];
            let result = await createBedSubmit(patientArchiveInfoVOData);
            if (result.code == "1") {
              this.$message.success("申请提交成功");
              this.activeNew = 1;
              // 提交后刷新患者列表，病选中当前患者，右侧显示该患者信息
              const selectedItem = JSON.parse(
                JSON.stringify(patientArchiveInfoVOData)
              );
              await this.changeRecPatientData(selectedItem);
              this.activeName = "second"; // 切换患者列表tab到申请历史上
              // this.$refs.directcheckleftbar &&
              //   this.$refs.directcheckleftbar[0].search();
              this.$refs.finishcheckleftbar &&
                this.$refs.finishcheckleftbar[0].search(selectedItem);
              this.emptyFun();
              // this.refsChild();
              this.htmlShowStyle = true;
              this.htmlShow = false;
              // this.archCardList = []; //卡的id对象
            } else {
              this.$message.error(result.msg || "提交失败");
              // this.$refs.directcheckleftbar &&
              //   this.$refs.directcheckleftbar[0].search();
              // this.$refs.finishcheckleftbar &&
              //   this.$refs.finishcheckleftbar[0].search();
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            // this.$message.error(error.msg || '提交失败');
            // this.$refs.directcheckleftbar&&this.$refs.directcheckleftbar[0].search()
            // this.$refs.finishcheckleftbar&&this.$refs.finishcheckleftbar[0].search()
          }
        } else {
          // this.$message.error("请填写必填项！！")
        }
      });
    },
    patientDetail() {
      if (this.activeName == "first") {
        this.$refs.directcheckleftbar &&
          this.$refs.directcheckleftbar[0].search();
      } else if (this.activeName == "second") {
        this.$refs.finishcheckleftbar &&
          this.$refs.finishcheckleftbar[0].search();
      }
    },
    submitChange() {
      // eslint-disable-next-line complexity
      this.$refs["recordForm"].validate(async valid => {
        if (valid) {
          if (
            !this.recordForm.patientName ||
            this.recordForm.patientName.length <= 0
          ) {
            this.$message.error("姓名不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.patientGender ||
            this.recordForm.patientGender.length <= 0
          ) {
            this.$message.error("性别不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.patientBirthday ||
            this.recordForm.patientBirthday.length <= 0
          ) {
            this.$message.error("出生日期不能为空");
            this.active = 0;
            return false;
          }
          // recordForm.idCardNum
          // if (!this.recordForm.idCardNum || this.recordForm.idCardNum.length <= 0) {
          //   this.$message.error('身份证不能为空');
          //   this.active = 0;
          //   return false;
          // }
          if (
            this.recordForm.identificationNum &&
            !this.recordForm.identificationType
          ) {
            this.$message.error("证件类型不能为空");
            // this.active = 0;
            return false;
          }
          if (
            !this.recordForm.mobileNum ||
            this.recordForm.mobileNum.length <= 0
          ) {
            this.$message.error("手机号不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.familyAddress ||
            this.recordForm.familyAddress.length <= 0
          ) {
            this.$message.error("联系具体地址不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.archGuarantorList ||
            this.recordForm.archGuarantorList.length < 1
          ) {
            this.$message.error("请填写至少一条联系人信息");
            this.active = 0;
            return false;
          }
          if (this.zdData.length < 1) {
            this.$message.error("请填写至少一条诊断");
            return false;
          }
          // 诊断内部具体信息校验
          if (this.zdData.length > 0) {
            for (let j = 0; j < this.zdData.length; j++) {
              let item = this.zdData[j];
              if (!item.diagName || !item.diagTime) {
                this.$message.error("请填写完整诊断信息");
                return false;
              }
            }
          }
          if (
            !this.recordForm.summaryOfIllness ||
            this.recordForm.summaryOfIllness.length <= 0
          ) {
            this.$message.error("病情摘要不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.createOpinions ||
            this.recordForm.createOpinions.length <= 0
          ) {
            this.$message.error("建床意见不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.diseaseType ||
            this.recordForm.diseaseType.length <= 0
          ) {
            this.$message.error("社保登记病种不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.createType ||
            this.recordForm.createType.length <= 0
          ) {
            this.$message.error("建床类型不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.chargeDate2 ||
            this.recordForm.chargeDate2.length <= 0
          ) {
            this.$message.error("本次治疗时间不能为空");
            this.active = 0;
            return false;
          }
          this.$showLoading();

          //保存表单接口接口
          let patientArchiveInfoVOData = {};
          patientArchiveInfoVOData = this.recordForm;
          // 治疗开始结束时间
          patientArchiveInfoVOData["treatStartTime"] =
            (this.recordForm.chargeDate2 &&
              new Date(this.recordForm.chargeDate2[0]).format("yyyy-MM-dd")) ||
            "";
          patientArchiveInfoVOData["treatEndTime"] =
            (this.recordForm.chargeDate2 &&
              new Date(this.recordForm.chargeDate2[1]).format("yyyy-MM-dd")) ||
            "";

          patientArchiveInfoVOData["patientBirthday"] =
            this.recordForm.patientBirthday.substring(0, 10) + " " + "00:00:00";

          patientArchiveInfoVOData[
            "contactList"
          ] = this.recordForm.archGuarantorList;
          patientArchiveInfoVOData["diagList"] = this.zdData;

          patientArchiveInfoVOData["workUnitName"] = this.recordForm.workUnit;

          delete patientArchiveInfoVOData["headImg"];
          delete patientArchiveInfoVOData["chargeDate2"];
          // delete patientArchiveInfoVOData["contactList"]
          // delete patientArchiveInfoVOData["archGuarantorList"]
          // delete patientArchiveInfoVOData["diagList"]

          // patientArchiveInfoVOData['patientEmpiInfoAddrssVO'] = this.patientEmpiInfoAddrssVO;
          // patientArchiveInfoVOData['patientEmpiInfoAdditionalVOS'] = this.recordForm.archGuarantorList;
          // patientArchiveInfoVOData['archCardList'] = this.cardList;

          // let res = await applyUpdateStatus({applyId:patientArchiveInfoVOData.applyId,applyStatus:'9'});// 1:提交申请 2:入院登记 3:排床 4:病区出院 5:财务出院  9:撤销 99:作废
          // patientArchiveInfoVOData.dataVersion = patientArchiveInfoVOData.dataVersion + 1
          patientArchiveInfoVOData.applyStatus = "1";
          try {
            let result = await putApplySave(patientArchiveInfoVOData);
            if (result.code == "1") {
              this.$message.success("修改成功");
              this.activeNew = 1;
              // 提交后刷新患者列表，病选中当前患者，右侧显示该患者信息
              const selectedItem = JSON.parse(
                JSON.stringify(patientArchiveInfoVOData)
              );
              await this.changeRecPatientData(selectedItem);
              // debugger
              // this.$refs.directcheckleftbar &&
              //   this.$refs.directcheckleftbar[0].search();
              this.$refs.finishcheckleftbar &&
                this.$refs.finishcheckleftbar[0].search(selectedItem);

              // this.emptyFun();
              // this.refsChild();
              this.htmlShowStyle = true;
              this.htmlShow = false;
              // this.archCardList = []; //卡的id对象
            } else {
              this.$message.error(result.msg || "修改失败");
              this.$refs.directcheckleftbar &&
                this.$refs.directcheckleftbar[0].search();
              this.$refs.finishcheckleftbar &&
                this.$refs.finishcheckleftbar[0].search();
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            // this.$message.error(error.msg || '修改失败。');
            // this.$refs.directcheckleftbar&&this.$refs.directcheckleftbar[0].search()
            // this.$refs.finishcheckleftbar&&this.$refs.finishcheckleftbar[0].search()
          }
        } else {
          // this.$message.error("请填写必填项！！")
        }
      });
    },
    async submitCancel() {
      let result = await applyUpdateStatus({
        applyId: this.recordForm.applyId,
        applyStatus: "9"
      });
      if (result.code == "1") {
        this.$message.success("撤销成功");
        // 提交后刷新患者列表，病选中当前患者，右侧显示该患者信息
        const selectedItem = JSON.parse(JSON.stringify(this.recordForm));
        this.changeRecPatientData(selectedItem);
        this.$refs.directcheckleftbar &&
          this.$refs.directcheckleftbar[0].search();
        this.$refs.finishcheckleftbar &&
          this.$refs.finishcheckleftbar[0].search(selectedItem);
      } else {
        this.$message.error(result.msg || "撤销失败");
      }
    },
    //户籍地址监听
    domicileChange(value, curItem) {
      //联系地址省市区
      if (value.length > 0 && curItem.length > 0) {
        this.patientEmpiInfoAddrssVO.houseHoldProvinceCode = value[0];
        this.patientEmpiInfoAddrssVO.houseHoldProvinceName = curItem[0].label;

        this.patientEmpiInfoAddrssVO.houseHoldCityCode = value[1];
        this.patientEmpiInfoAddrssVO.houseHoldCityName = curItem[1].label;

        this.patientEmpiInfoAddrssVO.houseHoldRegionCode = value[2];
        this.patientEmpiInfoAddrssVO.houseHoldRegionName = curItem[2].label;
      }
    },
    //联系地址监听
    contactChange(value, curItem) {
      console.log(curItem);
      if (value.length > 0 && curItem.length > 0) {
        this.recordForm.addrProvince = value[0];
        // this.recordForm.currentProvinceName = curItem[0].label;

        this.recordForm.addrCity = value[1];
        // this.recordForm.currentCityName = curItem[1].label;

        this.recordForm.addrDistrict = value[2];
        this.recordForm.addrStreet = value[3];
        this.recordForm.addrVillage = value[4];
        // this.recordForm.currentRegionName = curItem[2].label;
      } else {
        this.$message.error("联系地址不能为空");
        this.recordForm.addrCode = [2595, 2623, 2625];
      }
    },
    // 国籍
    nativePlacecChange(value, curItem) {
      if (value.length > 0 && curItem.length > 0) {
        this.patientEmpiInfoAddrssVO.houseHoldProvinceCode = value[0];
        this.patientEmpiInfoAddrssVO.houseHoldProvinceName = curItem[0].label;

        this.patientEmpiInfoAddrssVO.houseHoldCityCode = value[1];
        this.patientEmpiInfoAddrssVO.houseHoldCityName = curItem[1].label;

        this.patientEmpiInfoAddrssVO.houseHoldRegionCode = value[2];
        this.patientEmpiInfoAddrssVO.houseHoldRegionName = curItem[2].label;
      }
    },

    //新建联系人--默认监护人
    addArchGuarantorList() {
      this.deleteContactStyle = false;
      // let archGuarantorList = [...this.recordForm.archGuarantorList];
      let archGuarantorList = this.recordForm.archGuarantorList;
      archGuarantorList.push({
        patientId: "",
        relationShip: "1", //联系人与患者关系
        contacts: "", //联系人姓名
        // idCardNum: '', //联系人身份证号
        contactsPhone: "", //联系人联系方式
        recordStatus: "", //状态1-有效；0-作废

        patientType: "1", //1是监护人
        patientName: "", //姓名
        // identificationNum: '', //身份证号
        // contactsPhone: '', //手机号
        address: "", //地址数组code
        conDetail: "", //具体地址
        email: "", //邮箱
        workUnit: "", //联系人单位
        otherUnit: "" //其他单位
      });
      // this.recordForm.archGuarantorList = [...archGuarantorList];
    },
    //改变联系人
    concatChange(item, index, info) {
      //console.log(item, index, info);
      let changeItem = { ...item };
      if (!this.recordForm.archGuarantorList) {
        this.recordForm.archGuarantorList = [];
      }

      item.contacts = "";
      item.contactsPhone = "";
      // this.recordForm.archGuarantorList.push(changeItem);
      // this.$delete(this.recordForm.archGuarantorList, index);
    },

    //删除联系人
    deleteContact(item, index) {
      /* if (index == 0) {
          this.deleteContactStyle = true;
        } else {
          this.deleteContactStyle = false;
        } */
      this.deleteContactStyle = false;
      if (item.type == "1") {
        let propsRefieds = [];
        let archGuarantorList = [...this.recordForm.archGuarantorList];
        for (let i in archGuarantorList) {
          propsRefieds.push("archGuarantorList." + index + ".idCard");
          propsRefieds.push("archGuarantorList." + index + ".contactsPhone");
        }
        this.$refs["recordForm"].clearValidate(propsRefieds);
        this.$delete(archGuarantorList, index);
        this.recordForm.archGuarantorList = [...archGuarantorList];
      } else {
        let propsRefieds1 = [];
        let archGuarantorList = [...this.recordForm.archGuarantorList];
        for (let i in archGuarantorList) {
          propsRefieds1.push("archGuarantorList." + index + ".idCard");
          propsRefieds1.push("archGuarantorList." + index + ".contactsPhone");
        }
        this.$refs["recordForm"].clearValidate(propsRefieds1);
        this.$delete(archGuarantorList, index);
        this.recordForm.archGuarantorList = [...archGuarantorList];
      }
      // });
    },
    //格式化日期
    getFormatDate(d) {
      let year = d.getFullYear();
      let month = this.change(d.getMonth() + 1);
      let day = this.change(d.getDate());
      return year + "-" + month + "-" + day;
    },
    changeDataheaderFun(n) {
      this.detailList = [];
      this.patientInfoShow = {};
      this.patientInfoShow = {
        ...n,
        doctorName: n.manageDoctorName,
        nurseName: n.manageNurseName,
        prepayBalance: n.prepayBalance,
        selfPayPrepay: n.selfPayPrepay,
        address: n.addrCode,
        phoneNum: n.mobileNum,
        predictTreatStartTime: n.predictTreatStartTime
          ? n.predictTreatStartTime.split(" ")[0]
          : "",
        predictTreatEndTime: n.predictTreatEndTime
          ? n.predictTreatEndTime.split(" ")[0]
          : ""
      };
      /* if (n.admissionDiag) {
        this.$set(this.detailList, this.detailList.length, {
          name: n.admissionDiag,
          style: {}
        });
      } */
      if (n.allergyName) {
        this.$set(this.detailList, this.detailList.length, {
          name: n.allergyName,
          style: {
            background: "rgba(241, 47, 47, 0.1)",
            borderRadius: "4px",
            display: "inline-block",
            fontSize: "12px",
            fontFamily: "SourceHanSansSC-Regular",
            fontWeight: 400,
            textAlign: "center",
            color: "#ef0f0f",
            margiLeft: "8px",
            paddingTop: "2px",
            paddingLeft: "4px",
            paddingRight: "4px"
          }
        });
      }
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      }
      return t;
    }
  },

  watch: {
    nativePlaceCode: {
      handler(n) {},
      immediate: true,
      deep: true
    },
    value: function(val) {
      if (this.currVal == val) {
        return;
      }
      this.currVal = val;
    },
    currVal: function() {
      if (!this.currVal) {
        this.localFilterHandler();
      }
      console.log(this.currVal, "选择器绑定的值:currVal");
    },
    // zdData(valArr) {
    //       this.$nextTick(() => {
    //         this.$refs.tableDataRef.doLayout();
    //       });
    // }
    recordForm: {
      handler(n) {
        console.log(this.patientInfoShow, "头部传输的字段数据包");
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    console.log("建床申请");

    this.hosId = JSON.parse(getPamars()).hosId;
    this.addArchGuarantorList();
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-table .cell {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

// 新的框架
.titleStyle {
  padding: 20px;
  display: inline-block;
}

.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: $l-bg-radius-max;
  overflow-y: inherit;
  // font-size: 0;
  box-sizing: border-box;

  .patient-card /deep/ .patient-card-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .height-button-main {
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

.paddingStyle {
  width: 33px;
  height: 33px;
  margin-left: 8px;
}

// 媒体查询显示宽度
.filingAndChangeindex {
  // @media screen and (max-width: 1440px) and (min-width: 1024px) {
  //   .cardList:nth-child(2n) {
  //     margin-left: 10px;
  //   }

  //   .width1024-100 {
  //     width: 100%;
  //   }

  //   .width1024-33 {
  //     width: 33%;
  //     margin-top: 18px;
  //   }

  //   .width1024-30 {
  //     width: 30%;
  //   }

  //   .fontSize1024 {
  //     font-size: 12px;
  //   }

  //   .cssNav li {
  //     padding: 0 10px;
  //   }

  //   .recordCreate .card-cont1 .form-cont .realNameSystem {
  //     padding: 0px;
  //   }

  //   .paddingLeft {
  //     padding-left: 0px !important;
  //   }

  //   .width1024-50 {
  //     width: 49%;
  //     margin-top: 18px;
  //   }
  // }

  // @media only screen and (min-width: 1440px) {

  // }
}

/deep/ .el-form-item {
  margin-bottom: 0px;
}

.width1024-33 .input-con {
  /deep/ .el-input {
    width: calc(100% - 96px) !important;
  }

  /deep/ .el-button {
    margin-left: $l-margin-default-4;
  }
}

.readThe {
  width: 116px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #e3e3e3;
  border-radius: 16px;
  text-align: center;
  color: #2e323a;
  line-height: 32px;
  font-size: 14px;
  margin-left: auto;
  margin-right: 15px;
  cursor: pointer;
}

.patientName-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.patientName-box .block-style {
  margin: 0px 10px;
}

.patientName-box .span-top span {
  display: inline-block;
  margin: 0px 8px;
}

.span-top {
  padding: 0px 10px;
  border-right: 1px solid #dfe2e6;
}

.el-font {
  color: #666c70;
}

.el-font-style {
  color: #949da3;
  line-height: 15px;
}

.patientName-top {
  font-size: 20px;
  font-weight: 600;
  color: #000000;
}

.iconFont-style {
  cursor: pointer;
  width: 35px;
  height: 35px;
  background-color: #f2f4f6;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fontSize-style {
  text-align: left;
  color: #949da3;
  line-height: 20px;
  height: 20px;
  font-size: 14px;
  margin-bottom: 8px;
}

.marginStyleelCol {
  margin: 8px 0px;
}

.w25Style {
  width: 20%;
}

.viewProfile {
  height: 100%;
  overflow: auto;
  padding: 20px;
  box-sizing: border-box;
}

.textNum1 {
  font-size: 12px;
  color: rgba(148, 157, 163, 1);
  line-height: 17px;
}

.textNum2 {
  font-size: 12px;
  color: rgba(46, 50, 58, 1);
  line-height: 17px;
}

.heightButtonMain {
  height: calc(100% - 64px);
}

.recordCreate {
  // overflow-y: auto;

  .cardtitle {
    height: 50px;
    line-height: 60px;
  }

  .card-cont1 {
    height: 100%;
    // padding: 20px 0 0 0;

    .form-cont {
      padding: 0 20px;

      .realNameSystem {
        /*height: 38px;*/
        padding: 10px 0 10px 20px;
        margin-bottom: 20px;
        background: $l-color-bgcolor-18;
        border-radius: 2px;
      }

      .img-cont {
        .img-left {
          width: calc(100% - 148px);
        }

        .img-right {
          width: 118px;
          height: 118px;
          border: 1px solid $l-color-bgcolor-11;
          margin-right: 10px;
          padding: 3px;

          img {
            width: 110px;
            height: 110px;
          }
        }
      }

      .get-detail-button {
        width: 100%;
        height: 36px;
        border-radius: 2px;
        border: 1px dashed $l-color-bgcolor-11;
        text-align: center;
        font-size: 14px;
        color: $l-color-fontcolor-2;
        line-height: 36px;
        cursor: pointer;
      }

      .veri-code {
        color: $l-color-fontcolor-3;
        background: $l-color-bgcolor-11;
        border-radius: 2px;
        border: 1px solid $l-color-bgcolor-18;
      }
    }

    .footer-bottom {
      padding: 20px;
      border-top: 1px solid $l-color-bgcolor-11;
      overflow: auto;
      height: auto;
    }
  }

  .card-cont2 {
    height: 130px;
    padding: 20px;
    margin-top: 20px;
  }

  .zhezhao {
    height: 100%;
    background-color: $l-color-black;
    opacity: 0.05;
    position: absolute;
    top: 0;
    left: 0;
    transition: all 2s;
  }
}

.margin-top-10 {
  margin-top: 10px;
}

.margin-bottom-20 {
  margin-bottom: 1px;
}

.padding-bottom-30 {
  padding-bottom: 30px;
}

.margin-bottom-30 {
  margin-bottom: 30px;
}

.border-bottom {
  border-bottom: 1px solid $l-color-bgcolor-11;
}

.cardList {
  width: 208px;
  min-height: 128px;
  float: left;
  background: rgba(228, 237, 255, 1);
  border-radius: 8px;
  box-sizing: border-box;
  margin: 15px 0px;
  padding: 0px !important;
  font-size: 14px;
}

.cardListA {
  background: rgba(255, 242, 219, 1);
}

.cardListB {
  background: rgba(247, 247, 247, 1);
}

.cardListC {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(228, 228, 228, 1);
}

.cardList:nth-child(2n) {
  margin-left: 15px;
}

.cardText {
  color: #000000;
  font-weight: 600;
  font-size: 12px;
  line-height: 25px;
}

.cardBorder {
  font-size: 12px;
  color: #949da3;
  line-height: 16px;
  text-align: center;
  width: 32px;
  height: 16px;
  border: 1px solid #2b4583;
  border-radius: 2px;
  color: #2b4583;
}

.imgRight {
  width: 64px;
  height: 64px;
  border: 1px solid #cccccc;
}

.imgRight img {
  width: 100%;
  height: 100%;
}

.flexStyle .cardList:nth-child(2) {
  margin-left: 15px;
}

.flexStyle:nth-child(2) {
  margin-top: 15px;
}

.flexStyle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.numRight {
  text-align: right;
  font-weight: 600;
  color: #000000;
  font-size: 14px;
}

.relieveDiv {
  // margin-top: 25px;
  color: rgba(78, 137, 255, 1);
  text-align: center;
  line-height: 30px;
  color: #000000;
}

.cardList .bgcardList {
  padding: 20px !important;
  background-color: #f6f6f6;
}

.cardListC {
  margin-left: 15px;
}

.cardList .bgcardListplus {
  cursor: pointer;
  height: 137px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeNum {
  font-size: 14px;
  color: rgba(46, 50, 58, 1);
  line-height: 20px;
}

.timeStyle {
  font-size: 14px;
  color: rgba(148, 157, 163, 1);
  line-height: 20px;
}

.timebox {
  display: inline-block;
}

.cardListStyle {
  background: rgba(228, 237, 255, 1);
}

.similarFilesList {
  box-sizing: border-box;
  padding: 15px;
  background: rgba(243, 245, 247, 1);
  border-radius: 2px;
  height: 160px;
  overflow: hidden;
}

.textSimilar {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.fontColor {
  font-size: 14px;
  color: rgba(148, 157, 163, 1);
  line-height: 20px;
}

.indexNumText {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.newFileBox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.addnewFile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 381px;
  height: 280px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}

.addnewFilesize {
  width: 36px;
  height: 36px;
  font-size: 36px;
  color: rgba(179, 179, 179, 1);
}

.addnewFilesize1 {
  height: 52px;
  font-size: 36px;
  color: rgba(179, 179, 179, 1);
  line-height: 52px;
}

.addnewFilesize2 {
  height: 24px;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #b9c4cc;
}

// 步骤条的新式样式
.cssNav li {
  width: 33%;
  padding: 0px 20px;
  line-height: 40px;
  background: rgba(241, 244, 246, 1);
  display: inline-block;
  position: relative;
  text-align: center;
  color: rgba(44, 69, 131, 1);
}

.cssNav li:after {
  content: "";
  display: block;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 20px solid rgba(241, 244, 246, 1);
  position: absolute;
  right: -20px;
  top: 0;
  z-index: 10;
}

.cssNav li:before {
  content: "";
  display: block;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 20px solid #ffffff;
  position: absolute;
  left: 0px;
  top: 0;
}

// 修时头部底部
.cssNav li:first-child {
  border-radius: 4px 0 0 4px;
  padding-left: 25px;
}

.cssNav li:last-child,
.cssNavEnd {
  border-radius: 0px 4px 4px 0px;
  padding-right: 25px;
}

.cssNav li:first-child:before {
  display: none;
}

.cssNav li:last-child:after,
.cssNavEnd:after {
  display: none;
}

// 选中未选中
.cssNav li.active {
  background-color: rgba(44, 69, 131, 1);
  color: #ffffff;
}

.cssNav li.active:after {
  border-left-color: rgba(44, 69, 131, 1);
}

/deep/ .son-padding-left > .el-tabs__header {
  padding-left: 10px;
}

.operate-type-hide {
  display: none;
}
</style>
