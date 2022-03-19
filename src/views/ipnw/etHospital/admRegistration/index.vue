<template>
  <div class="width100 height100">
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
            <left-bar
              v-if="item.value == 'first'"
              ref="leftbar"
              :activeName="activeName"
              @choosePatientFun2="choosePatientFun2"
            ></left-bar>
            <direct-check-left-bar
              v-else-if="item.value == 'second'"
              ref="directcheckleftbar"
              :activeName="activeName"
              @choosePatientFun="choosePatientFun"
              @addnew="addnewFun"
            ></direct-check-left-bar>
            <finish-check-left-bar
              v-else-if="item.value == 'third'"
              ref="finishcheckleftbar"
              :activeName="activeName"
              @choosePatientFun3="choosePatientFun3"
            ></finish-check-left-bar>
          </el-tab-pane>
        </el-tabs>
      </template>
      <template #content>
        <div class="bg-contain recordCreate width100 height100">
          <div v-if="htmlShow" class="width100 height100">
            <div class="patient-card">
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
                            <el-form-item prop="patientName">
                              <l-formt-title label="姓名" required>
                                <el-input
                                  v-model="recordForm.patientName"
                                  style="width: 100%"
                                  placeholder="请输入姓名"
                                  @input="inputChange($event)"
                                ></el-input>
                              </l-formt-title>
                            </el-form-item>
                          </el-col>
                          <el-col :span="4" class="width1024-50">
                            <el-form-item prop="patientGender">
                              <LFormtTitle label="性别" required>
                                <l-value-domain
                                  :code="selectCode.patientGender"
                                  :value.sync="recordForm.patientGender"
                                  class="select-container"
                                  @input="inputChange($event)"
                                  :placeholder="$t('base.placeholder')"
                                  key="key20"
                                ></l-value-domain>
                              </LFormtTitle>
                            </el-form-item>
                          </el-col>

                          <el-col :span="6" class="width1024-33 paddingLeft">
                            <el-form-item prop="birthDate">
                              <LFormtTitle label="出生日期" required>
                                <el-date-picker
                                  v-model="recordForm.birthDate"
                                  type="date"
                                  style="width: 100%"
                                  placeholder="选择日期"
                                  @input="inputChange($event)"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd"
                                  :picker-options="birthPickerOption"
                                ></el-date-picker>
                              </LFormtTitle>
                            </el-form-item>
                          </el-col>
                          <el-col :span="4" class="width1024-33 paddingLeft">
                            <el-form-item prop="nationCode">
                              <LFormtTitle label="民族" required>
                                <l-value-domain
                                  :code="selectCode.nationCode"
                                  :value.sync="recordForm.nationCode"
                                  class="select-container"
                                  :placeholder="$t('base.placeholder')"
                                  key="key1"
                                ></l-value-domain>
                              </LFormtTitle>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row
                          :gutter="8"
                          class="margin-bottom-20 width1024-100"
                        >
                          <el-col :span="6" class="width1024-33">
                            <LFormtTitle label="籍贯">
                              <el-form-item prop="nativePlaceCode">
                                <!-- <l-value-domain
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
                                ></l-value-domain> -->
                                <el-input
                                  v-model="recordForm.nativePlaceCode"
                                  style="width: 100%"
                                  placeholder="请输入籍贯"
                                  @input="inputChange($event)"
                                ></el-input>
                              </el-form-item>
                            </LFormtTitle>
                          </el-col>
                          <el-col :span="4" class="width1024-33">
                            <el-form-item prop="bloodType">
                              <LFormtTitle label="血型" required>
                                <l-value-domain
                                  :code="selectCode.bloodType"
                                  :value.sync="recordForm.bloodType"
                                  class="select-container"
                                  :placeholder="$t('base.placeholder')"
                                  key="key23"
                                ></l-value-domain>
                              </LFormtTitle>
                            </el-form-item>
                          </el-col>
                          <el-col :span="4" class="width1024-33">
                            <el-form-item prop="maritalStatus">
                              <LFormtTitle label="婚姻状况" required>
                                <l-value-domain
                                  :code="selectCode.maritalStatus"
                                  :value.sync="recordForm.maritalStatus"
                                  class="select-container"
                                  :placeholder="$t('base.placeholder')"
                                  key="key21"
                                ></l-value-domain>
                              </LFormtTitle>
                            </el-form-item>
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
                              <el-form-item prop="workUnitName">
                                <el-input
                                  v-model="recordForm.workUnitName"
                                  style="width: 100%"
                                  placeholder="请输入"
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
                            <el-form-item prop="settlementType">
                              <LFormtTitle label="结算类型" required :disabled="recordForm.activeName === 'third'">
                                <l-value-domain
                                  :code="selectCode.settlementType"
                                  :value.sync="recordForm.settlementType"
                                  class="select-container"
                                  :placeholder="$t('base.placeholder')"
                                  key="key21"
                                  :disabled="recordForm.activeName === 'third'"
                                ></l-value-domain>
                              </LFormtTitle>
                            </el-form-item>
                          </el-col>

                          <el-col :span="6" class="width1024-50">
                            <l-formt-title label="医保号" :disabled="recordForm.activeName === 'second' || recordForm.activeName === 'third'">
                              <el-form-item prop="siPatientCode">
                                <el-input
                                  v-model="recordForm.siPatientCode"
                                  style="width: 100%"
                                  placeholder="请输入医保号"
                                  :disabled="recordForm.activeName === 'second' || recordForm.activeName === 'third'"
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
                            <el-form-item prop="phoneNum"
                              :rules="{
                                validator: concatPhone,
                                msg: '请输入正确的电话',
                                trigger: 'blur',
                              }">
                              <LFormtTitle label="电话" required>
                                <!-- <div class="input-con"> -->
                                  <el-input
                                    type="number"
                                    v-model="recordForm.phoneNum"
                                    placeholder="请输入"
                                    @input="inputChange($event)"
                                  ></el-input>
                                <!-- </div> -->
                              </LFormtTitle>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item prop="address">
                              <LFormtTitle label="联系地址" required>
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
                              </LFormtTitle>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item prop="patientAddr">
                              <LFormtTitle label="联系具体地址" required>
                                <el-input
                                  maxlength="30"
                                  v-model="recordForm.patientAddr"
                                  style="width: 100%"
                                  placeholder="请输入"
                                ></el-input>
                              </LFormtTitle>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                    <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                      <el-col class="fontSize-style"
                        >联系人信息<span style="color: #f05a23">
                          *</span
                        ></el-col
                      >
                      <div
                        v-for="(item, index) in recordForm.archGuarantorList"
                        :key="index"
                        class="paddingStyleAddBox"
                      >
                        <el-row :gutter="8" class="margin-bottom-20">
                          <el-col :span="6">
                            <LDoubleInput widthRatio="105px">
                              <template slot="left">
                                <el-form-item prop="type">
                                  <l-value-domain
                                    :code="selectCode.relationShip"
                                    :value.sync="item.relation"
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
                                  :prop="'archGuarantorList.' + index + '.name'"
                                  :rules="rules.fiduciaryName"
                                >
                                  <el-input
                                    v-model="item.name"
                                    maxlength="18"
                                    style="width: 100%"
                                    placeholder="请输入"
                                    @input="inputChange($event)"
                                  ></el-input>
                                </el-form-item>
                              </template>
                            </LDoubleInput>
                          </el-col>

                          <el-col :span="6">
                            <el-form-item
                              :prop="'archGuarantorList.' + index + '.phone'"
                              :rules="{
                                validator: concatPhoneNotReqiured,
                                trigger: 'blur',
                              }"
                            >
                              <LFormtTitle label="联系人电话">
                                <el-input
                                  type="number"
                                  v-model="item.phone"
                                  minlength="11"
                                  style="width: 100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)"
                                ></el-input>
                              </LFormtTitle>
                            </el-form-item>
                          </el-col>
                          <el-col :span="1" class="paddingStyle">
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
                    </el-row>
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
                            <l-value-domain
                              style=""
                              code="CWM"
                              :value.sync="scope.row[item.prop]"
                              placeholder="请选择"
                              @change="cwFlagChange(...arguments, scope.$index)"
                            ></l-value-domain>
                          </template>
                          <template v-else-if="item.prop === 'diagName'">
                            <el-select
                              class="width100"
                              :ref="'elem' + scope.$index"
                              placeholder="请输入诊断名称"
                              filterable
                              remote
                              :remote-method="
                                (query) => {
                                  return remoteMethod(query, scope.row);
                                }
                              "
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
                              type="date"
                              style="width: 100%"
                              placeholder="选择日期"
                              @input="inputChange($event)"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
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
                        <el-form-item prop="admitIllnessSummary">
                          <l-formt-title
                            label="病情摘要"
                            required
                            :isMultiRow="true"
                          >
                            <el-input
                              type="textarea"
                              v-model="recordForm.admitIllnessSummary"
                              maxlength="500"
                              show-word-limit
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
                        <el-form-item prop="admitOpinion">
                          <l-formt-title
                            label="收治指征及建床意见"
                            required
                            :isMultiRow="true"
                          >
                            <el-input
                              type="textarea"
                              v-model="recordForm.admitOpinion"
                              maxlength="500"
                              show-word-limit
                            ></el-input>
                          </l-formt-title>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                      <el-col :span="9">
                        <el-form-item prop="siRegDiseaseCode">
                          <LFormtTitle label="社保登记病种" required>
                            <l-value-domain
                              required
                              code="SiDiseaseType"
                              :value.sync="recordForm.siRegDiseaseCode"
                              class="select-container"
                              :placeholder="$t('base.placeholder')"
                              key="key5"
                            ></l-value-domain>
                          </LFormtTitle>
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item prop="admitTypeCode">
                          <LFormtTitle label="建床类型" required>
                            <l-value-domain
                              code="AdmitHosType"
                              :value.sync="recordForm.admitTypeCode"
                              class="select-container"
                              :placeholder="$t('base.placeholder')"
                              key="key7"
                            ></l-value-domain>
                          </LFormtTitle>
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item prop="inHosTimes">
                          <LFormtTitle label="建床次数">
                            <el-input-number
                              disabled
                              :min="1"
                              :max="1000"
                              v-model="recordForm.inHosTimes"
                              style="width: 100%"
                              :placeholder="$t('base.placeholder')"
                              @input="inputChange($event)"
                            ></el-input-number>
                          </LFormtTitle>
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <LFormtTitle label="首次建床日期">
                          <el-form-item prop="careerCode">
                            <el-date-picker
                              disabled
                              v-model="recordForm.firstAdmissionTime"
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
                      <el-col :span="6">
                        <el-form-item prop="company">
                          <LFormtTitle label="本次治疗" required>
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
                          </LFormtTitle>
                        </el-form-item>
                      </el-col>

                      <el-col :span="6">
                        <el-form-item prop="finAdmissionTime">
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
                      </el-col>
                      <el-col :span="6">
                        <el-form-item prop="bedId">
                          <LFormtTitle label="床位" required>
                            <el-select
                              style="width: 100%"
                              v-model="recordForm.bedId"
                              @change="bedChange"
                              placeholder="请选择"
                              filterable
                            >
                              <el-option
                                v-for="(item, index) in bedListData"
                                :key="index"
                                :label="item.bedCode"
                                :value="item.bedId"
                              ></el-option>
                            </el-select>
                          </LFormtTitle>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item prop="manageDoctorId">
                          <LFormtTitle label="责任医生" required>
                            <el-select
                              style="width: 100%"
                              v-model="recordForm.manageDoctorId"
                              placeholder="请选择"
                              filterable
                            >
                              <el-option
                                v-for="item in doctorList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                          </LFormtTitle>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                      <el-col :span="6">
                        <el-form-item prop="manageNurseId">
                          <LFormtTitle label="责任护士" required>
                            <el-select
                              style="width: 100%"
                              v-model="recordForm.manageNurseId"
                              placeholder="请选择"
                              filterable
                              clearable
                            >
                              <el-option
                                v-for="item in nurseList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                              ></el-option>
                            </el-select>
                          </LFormtTitle>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                    </el-row>
                  </el-row>
                </el-form>
              </div>

              <div class="bottom-con width100">
                <div class="btns float-right">
                  <el-button
                    type="primary"
                    @click="submit"
                    v-if="recordForm.activeName != 'third'"
                    >登记</el-button
                  >
                  <el-button
                    v-if="recordForm.activeName == 'third' && currentSettlementType == '1' && oldInsurence"
                    type="primary"
                    @click="
                      SZHealthRegistrationType = 'add';
                      HealthRegistrationVisible = true;
                    "
                    >深圳医保登记新建</el-button
                  >
                  <el-button
                    v-if="recordForm.activeName == 'third' && currentSettlementType == '1' && newInsurence"
                    type="primary"
                    @click="
                      SZHealthRegistrationType = 'add';
                      HealthRegistrationNewVisible = true;
                    "
                    >广东医保登记新建</el-button
                  >
                  <el-button
                    v-if="recordForm.activeName == 'third' && currentSettlementType == '3'"
                    type="primary"
                    @click="szRegChange"
                    >医保登记修改</el-button
                  >
                  <el-button
                    v-if="recordForm.activeName == 'third' && currentSettlementType == '3'"
                    type="primary"
                    :loading="postYBCancelRegFlag"
                    @click="postYBCancelReg"
                    >医保登记取消</el-button
                  >
                  <el-button
                    type="primary"
                    @click="cancalSubmit"
                    v-if="recordForm.activeName == 'third'"
                    >院内登记撤销</el-button
                  >
                  <el-button
                    type="primary"
                    @click="submitChange"
                    v-if="recordForm.activeName == 'third'"
                    >院内登记修改</el-button
                  >
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
    <!-- 住院预缴 -->
    <inHosPrePayDialog
      :visible.sync="yujiaomodelVisible"
      v-if="yujiaomodelVisible"
      width="552px"
      title="住院预缴"
      :patientInfo="sendData"
      @confirm="conserve"
      @cancel="huidanClose"
    ></inHosPrePayDialog>
    <!-- 医保登记弹框 -->
    <SZHealthRegistration
      v-if="HealthRegistrationVisible"
      :visible.sync="HealthRegistrationVisible"
      title="医保登记"
      width="1300px"
      @cancel="HealthRegistrationClose"
      @sure="HealthRegistrationSure"
      :finAdId="recordForm.finAdId"
      :type="SZHealthRegistrationType"
    ></SZHealthRegistration>
    <!-- 新医保登记弹框 -->
    <SZHealthRegistrationNew
      v-if="HealthRegistrationNewVisible"
      :visible.sync="HealthRegistrationNewVisible"
      :title="SZHealthRegistrationType=== 'add' ? '医保登记新建' : '医保登记修改'"
      width="1300px"
      @cancel="HealthRegistrationClose"
      @sure="HealthRegistrationSure"
      :finAdId="recordForm.finAdId"
      :type="SZHealthRegistrationType"
      :identifyInfo="{
        identificationType: recordForm.identificationType,
        identificationNum: recordForm.identificationNum
      }"
    ></SZHealthRegistrationNew>
  </div>
</template>
<style>
.operate-type-hide {
  display: none;
}
</style>
<script>
import { get } from "@/utils/request";
import { YBCancelReg } from "@/api/cis/admApplication/index";
import {
  bedList,
  canBeUseDoctorAndNurseList,
  getApplyInfo
} from "@/api/ipnw/etHospital.js";
import {
  getCordByPatientId,
  finHosReg,
  regInfo,
  deptList,
  WdeptList
} from "@/api/filingAndChange/arch";
import { logoutIn } from "@/api/ipnw/leaveHos";
import { getPagemd } from "@/api/medicalInsurance/index.js";

import LSideTabsNew from "@/components/LSideTabsNew.vue";
import SZHealthRegistration from "@/components/SZHealthRegistration.vue";
import leftBar from "@/views/ipnw/etHospital/admRegistration/components/waitCheckLeftBar.vue";
import finishCheckLeftBar from "@/views/ipnw/etHospital/admRegistration/components/finishCheckLeftBar.vue";
import directCheckLeftBar from "@/views/ipnw/etHospital/admRegistration/components/directCheckLeftBar.vue";
import createCard from "./components/createCard.vue";
import addarchives from "@/views/filingAndChange/filingAndChangeindex/components/addarchives.vue";
import fillingAndChangeEhr from "@/views/eHrArchives/eHrArchivesindex/fillingAndChangeEhr.vue";
import eHrArchivesindex from "@/views/eHrArchives/eHrArchivesindex/index.vue";
import selectAllowCreate from "@/views/public/diagnosis/components/selectAllowAndInput.vue";
import patientDetail from "@/views/homeSickbeds/hsDiagTreat/components/patientDetail";
import inHosPrePayDialog from "@/views/finance/inp/inpPrepay/components/inHosPrePayDialog.vue";
import SZHealthRegistrationNew from "@/views/medicalInsuranceNew/components/SZHealthRegistrationNew.vue";

import { getPamars } from "@/utils/auth";
import { deepClone } from "@/utils";

export default {
  name: "index",
  components: {
    inHosPrePayDialog,
    leftBar,
    finishCheckLeftBar,
    selectAllowCreate,
    directCheckLeftBar,
    LSideTabsNew,
    createCard,
    addarchives,
    fillingAndChangeEhr,
    eHrArchivesindex,
    patientDetail,
    SZHealthRegistration,
    SZHealthRegistrationNew
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
    let phoneNumValidate = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (value.length != 11) {
        this.$message.error("手机号码应该等于11位");
        callback(new Error("手机号码应该等于11位"));
      } else if (value != parseInt(value)) {
        this.$message.error("手机号码应该数字");
        callback(new Error("手机号码应该数字"));
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
    //联系方式（手机或者座机）
    let concatPhoneArch = (rule, value, callback) => {
      let str = /^1([38]\d|4[5-9]|5[0-35-9]|6[56]|7[0-8]|9[189])\d{8}$/;
      if (!value) {
        // this.$message.error('联系方式不能为空');
        // callback(new Error('联系方式不能为空'));
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
      if (value) {
        callback();
      } else {
        if (numRule.test(value)) {
          this.$message.error("姓名不允许包括数字");
          callback(new Error("姓名不允许包括数字"));
        } else {
          callback();
        }
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
      currentSettlementType: "",
      SZHealthRegistrationType: "add",
      HealthRegistrationVisible: false,
      HealthRegistrationNewVisible: false,
      yujiaomodelVisible: false,
      sendData: {}, // 预缴所需患者信息
      detailList: [],
      patientInfoNow: {},
      patientInfoShow: {},
      tabsName: [
        {
          label: "待登记",
          value: "first"
        },
        {
          label: "直接登记",
          value: "second"
        },
        {
          label: "已登记",
          value: "third"
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
      remoteParams: { pageSize: 10, parentId: "0" }, // 分页参数,医嘱大类参数
      // remoteParams1: { keyword: "", type: "", cwFlag: "1" },
      loading: false,

      // 点击调阅档案按钮
      readTheData: {},
      readTheDataList: {},
      // 二维码假数据
      qrcodeImg:
        "data:image/png;base64,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",
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
      //   birthDate:'',
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
        isHomeBed: "1",
        nativePlaceCode:'',
        bloodType: "",
        maritalStatus: "",
        nationCode: "1",
        identificationType: "",
        identificationNum: "",
        siPatientCode: "",
        settlementType: "",
        phoneNum: "",
        addrCode: [],
        patientAddr: "",
        admitIllnessSummary: "",
        admitOpinion: "",
        siRegDiseaseCode: "",
        admitTypeCode: "",
        chargeDate2: "",
        admissionSituation: "", // 入院病情
        admissionMode: "",
        finAdmissionTime: "",
        admissionSdeptId: "",
        admissionWdeptId: "",

        headImg: require("@/assets/pojehjdz.jpeg"),
        patientAge: "",
        birthDate: "",
        cardType: "",
        careerCode: "",
        checkMsgCode: 0, //是否校验验证码
        chronicStatus: "",
        createdAt: "",
        createdBy: "",
        createdByName: "",
        dataVersion: "",
        deletedAt: "",
        deletedStatus: "",
        email: "",
        patientGender: "",
        patientId: "",
        patientName: "",
        patientType: "",
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
        // 结算类型
        settlementType: [
          {
            required: true,
            validator: notNull,
            msg: "结算类型不能为空",
            trigger: "blur"
          }
        ],
        phoneNum: [
          {
            required: true,
            validator: notNull,
            msg: "电话不能为空",
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
        patientAddr: [
          {
            required: true,
            validator: notNull,
            msg: "联系具体地址不能为空",
            trigger: "blur"
          }
        ],
        admitIllnessSummary: [
          {
            required: true,
            validator: notNull,
            msg: "病情摘要不能为空",
            trigger: "blur"
          }
        ],
        admitOpinion: [
          {
            required: true,
            validator: notNull,
            msg: "建床意见不能为空",
            trigger: "blur"
          }
        ],
        siRegDiseaseCode: [
          {
            required: true,
            validator: notNull,
            msg: "社保登记病种不能为空",
            trigger: "blur"
          }
        ],
        admitTypeCode: [
          {
            required: true,
            validator: notNull,
            msg: "建床类型不能为空",
            trigger: "blur"
          }
        ],
        chargeDate2: [
          {
            required: true,
            validator: notNull,
            msg: "本次治疗时间不能为空",
            trigger: "blur"
          }
        ],
        admissionSituation: [
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
        birthDate: [
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
        archPhone: [
          {
            validator: concatPhoneArch,
            trigger: "blur"
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
      readTheStyle: false,
      postYBCancelRegFlag: false, // 取消社保按钮
      oldInsurence: false, //是否显示旧组件
      newInsurence: false, //是否显示新组件
    };
  },
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
    chargeDate2Options() {}
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
    },
    recordForm: {
      handler(n) {
        if (this.patientInfoShow.patientId !== n.patientId) {
          this.detailList = [];
          this.patientInfoShow = {
            ...deepClone(n),
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
          // 是否显示档案结算类型
          if (n.hasOwnProperty("isSettlement") && n.isSettlement === "1") {
            delete this.patientInfoShow.settlementType;
          }
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
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getPagemd();
    this.hosId = JSON.parse(getPamars()).hosId;
    this.addArchGuarantorList();
    this.getDoctor();
    this.getBedList();
  },
  methods: {
    async getPagemd() {
      try {
        let res = await getPagemd();
        if (res.code === 1) {
          for (let i in res.data) {
            if (res.data[i].dictCode == "01") {
              this.oldInsurence = true;
            } else if (res.data[i].dictCode == "02") {
              this.newInsurence = true;
            }
          }
        }

      } catch (error) {}
    },
    currentAddress(rule, value, callback) {
      let currentAddress = this.patientEmpiInfoAddrssVO.currentAddress;
      if (
        currentAddress &&
        Array.isArray(currentAddress) &&
        currentAddress.length > 0
      ) {
        callback();
      } else {
        callback(new Error(rule.msg));
      }
    },
    concatPhoneNotReqiured(rule, value, callback) {
      if (value) {
        let str = /^1([38]\d|4[5-9]|5[0-35-9]|6[56]|7[0-8]|9[189])\d{8}$/;
        if (str.test(value)){
           callback();
        } else {
          this.$message.error("请输入正确的联系人电话");
          callback(new Error(rule.msg || "请输入正确的联系人电话"));
        }
      } else {
        callback();
      }
    },
    concatPhone(rule, value, callback) {
      let str = /^1([38]\d|4[5-9]|5[0-35-9]|6[56]|7[0-8]|9[189])\d{8}$/;
      if (value && str.test(value)) {
        callback();
      } else {
        this.$message.error("请输入正确的电话");
        callback(new Error(rule.msg || "请输入正确的电话"));
      }
    },
    //医保取消住院登记
    async postYBCancelReg() {
      try {
        this.postYBCancelRegFlag = true;
        let res = await YBCancelReg({
          finAdId: this.recordForm.finAdId
        });
        if (res.code == 1) {
          this.$message.success("取消医保住院登记成功");
          this.refreshData();
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.postYBCancelRegFlag = false;
      }
    },
    // 待登记
    choosePatientFun2(item) {
      // 已登记的床位反显，床位接口查出来的是未占用的床位，所以反显不出已登记床位
      this.bedListData = this.bedListData.filter(
        item => item.temporflag != true
      );

      this.clearOldData();
      this.patientListFunData2(item);
    },
    // 直接登记
    choosePatientFun(item) {
      // 已登记的床位反显，床位接口查出来的是未占用的床位，所以反显不出已登记床位
      this.bedListData = this.bedListData.filter(
        item => item.temporflag != true
      );

      this.clearOldData();
      this.patientListFunData(item);
    },
    //

    // 已登记
    choosePatientFun3(item) {
      let optionsNurseList = this.nurseList.map(item=>item.id)
      if(optionsNurseList.indexOf(item.manageNurseId) == -1){
          this.$nextTick(()=>{
            this.$set(this.recordForm,'manageNurseId',item.manageNurseName)
          })
      }
      let optionsDoctorList = this.doctorList.map(item=>item.id)
      if(optionsDoctorList.indexOf(item.manageDoctorId) == -1){
        this.$nextTick(()=>{
          this.$set(this.recordForm,'manageDoctorId',item.manageDoctorName)
        })
      }
      this.currentSettlementType = item.settlementType;
      // 已登记的床位反显，床位接口查出来的是未占用的床位，所以反显不出已登记床位
      // 所以，每点击一个登记详情，就把床位key、value拼进数组

      let _arr = { bedCode: item.bedCode, bedId: item.bedId, temporflag: true };
      this.bedListData = this.bedListData.filter(
        item => item.temporflag != true
      );
      this.bedListData.unshift(_arr);
      this.clearOldData();
      this.patientListFunData3(item);
    },
    clearOldData() {
      (this.recordForm = {
        isHomeBed: "1",
        nativePlaceCode: "",
        bloodType: "",
        maritalStatus: "",
        nationCode: "1",
        identificationType: "",
        identificationNum: "",
        siPatientCode: "",
        settlementType: "",
        phoneNum: "",
        addrCode: [],
        patientAddr: "",
        admitIllnessSummary: "",
        admitOpinion: "",
        siRegDiseaseCode: "",
        admitTypeCode: "",
        chargeDate2: "",
        admissionSituation: "", // 入院病情
        admissionMode: "",
        finAdmissionTime: "",
        admissionSdeptId: "",
        admissionWdeptId: "",

        headImg: require("@/assets/pojehjdz.jpeg"),
        patientAge: "",
        birthDate: "",
        cardType: "",
        careerCode: "",
        checkMsgCode: 0, //是否校验验证码
        chronicStatus: "",
        createdAt: "",
        createdBy: "",
        createdByName: "",
        dataVersion: "",
        deletedAt: "",
        deletedStatus: "",
        email: "",
        patientGender: "",
        patientId: "",
        patientName: "",
        patientType: "",
        archGuarantorList: []
      }),
        (this.zdData = []);
    },
    deleteConfirm(rowIndex, row) {
      this.$confirm("确定要删除此项吗？", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.zdData.splice(rowIndex, 1);
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
        remoteParams1: { keyword: "", type: "", cwFlag: "1" },
        _orgSettingData: [],
        settingData: [],
        keyword: "",
        currVal: null,
        valuekey: "icd10Encoding",
        labelname: "dictionaryName",
        operateType: "0"
      });
    },
    getDoctor(id) {
      // 查所有可用医生和护士 1是医生,2是护士
      canBeUseDoctorAndNurseList({ hosId: this.hosId, utype: "1" })
        .then(res => {
          if (res.code === 1) {
            this.doctorList = res.data;
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
      canBeUseDoctorAndNurseList({ hosId: this.hosId, utype: "7" })
        .then(res => {
          if (res.code === 1) {
            this.nurseList = res.data;
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    bedChange(val) {
      this.recordForm.bedCode = this.bedListData.find(item => {
        return val === item.bedId;
      }).bedCode;
    },
    // 获取科室
    getDeptList() {
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
      this.zdData[index].remoteParams1 = {
        keyword: "", //this.diagnosticForm.diagName,
        type: "", //hosType2,
        cwFlag: n
      };
      this.zdData[index].diagCode = "";
      this.zdData[index].diagIcd = "";
      this.zdData[index].diagName = "";
      // this.zdData[index].diagTime = "";
    },
    async focusSelect(index, row) {
      await this.request(row);
    },
    remoteMethod(query, row) {
      row.remoteParams1.keyword = query;
      this.request(row);
    },
    filterMethod(query, row) {
      row.keyword = ""; //query
    },
    async request(row) {
      try {
        this.loading = true;
        let params = {};
        if (row.remoteParams1) {
          params = { ...row.remoteParams1 };
        }
        let { data } = await get("/patTcmDiag/getDiagNameCode", params);
        if (row.cwFlag == "2") {
          row.valuekey = "tcdCode";
          row.labelname = "tcdName";
        } else {
          row.valuekey = "icd10Encoding";
          row.labelname = "dictionaryName";
        }

        row.settingData = [...data];
      } catch (error) {
        this.$message.error(error.errorMsg);
      } finally {
        this.loading = false;
      }
    },
    // 触发父组件的change事件
    changeFunc(key, row) {
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
    },
    // 选择器绑定的值为null后触发
    localFilterHandler(query) {
      // this.settingData是option循环的对象
      this.settingData = this.filterHandler(query);
    },
    filterHandler(row) {
      if (!row._orgSettingData) {
        return [];
      }
      let datas = [...row._orgSettingData];
      if (!datas.length) {
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
      this.addarchivesStyle = a;

      if (dataObj) {
        this.$refs.directcheckleftbar &&
          this.$refs.directcheckleftbar[0] &&
          this.$refs.directcheckleftbar[0].search(
            dataObj.patientArchiveInfoVO.patientCode
          );
      }
    },
    //子组件信息
    changeCardDisable(data, dataObj) {
      this.cardDisable = data;

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
    },
    // 新建档案
    addnewFun(inputnum, a) {
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
      this.refsChild();
    },

    // 直接登记的点击选项
    patientListFunData(item) {
      this.$refs.recordForm && this.$refs.recordForm.resetFields();
      let recordForm = JSON.parse(JSON.stringify(item));
      recordForm.maritalStatus = recordForm.maritalStatus
        ? recordForm.maritalStatus + ""
        : "90";
      recordForm.bloodType = recordForm.bloodType
        ? recordForm.bloodType
        : "5";

      recordForm.workUnitName = recordForm.workUnit || "";
      recordForm.activeName = "second";
      // add页面的显示
      this.htmlShow = true;
      this.htmlShowStyle = false;
      // 编辑
      this.eihtmlShow = false;
      this.deleteContactStyle = false;

      if (recordForm) {
        for (let obj in recordForm) {
          // obj == "nativePlaceCode" ||
          if (obj == "addrCode") {
            let str = [];
            if (recordForm[obj]) {
              for (let j = 0; j < recordForm[obj].length; j++) {
                if (
                  recordForm[obj][j] === "" ||
                  recordForm[obj][j] === null ||
                  typeof recordForm[obj][j] === undefined
                ) {
                  recordForm[obj].splice(j, 1);
                  j = j - 1;
                }
              }
              recordForm[obj] = recordForm[obj]
                .toString()
                .replace(/\[|]/g, "")
                .split(",");
              for (let i = 0; i < recordForm[obj].length; i++) {
                str[i] = parseInt(recordForm[obj][i]);
              }
              recordForm[obj] = str;
            }
          }
        }
        recordForm.isHomeBed = recordForm.isHomeBed
          ? recordForm.isHomeBed
          : "1";
        // ["2020-09-08 00:00:00", "2020-10-05 23:59:59"]
        if (recordForm.predictTreatStartTime) {
          recordForm.chargeDate2 = [
            new Date(recordForm.predictTreatStartTime),
            new Date(recordForm.predictTreatEndTime)
          ];
        } else {
          recordForm.chargeDate2 = [
            new Date(Date.now()),
            new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          ];
        }

        recordForm.headImg = require("@/assets/pojehjdz.jpeg");
        recordForm.medicareCard = recordForm.patientCode;
        recordForm.phoneNum = recordForm.mobileNum;

        recordForm.admissionSdeptId =
          recordForm.admissionSdeptId * 1 || "";
      }

      // 诊断
      if (recordForm.inpDiagInfoDTOS) {
        this.zdData = recordForm.inpDiagInfoDTOS;

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
      if (recordForm.inpPatientContactsVOS) {
        recordForm.archGuarantorList = recordForm.inpPatientContactsVOS;
        if (recordForm.archGuarantorList.length == 0) {
          this.deleteContactStyle = true;
        }
        for (let j = 0; j < recordForm.archGuarantorList.length; j++) {}
      } else {
        recordForm.archGuarantorList = [];
        this.deleteContactStyle = true;
      }
      this.recordForm = recordForm;
    },
    // 已登记的点击选项
    patientListFunData3(item) {
      let recordForm = deepClone(item);
      recordForm.maritalStatus = recordForm.maritalStatus
        ? recordForm.maritalStatus + ""
        : "90";
      recordForm.bloodType = recordForm.bloodType || "5";
      recordForm.activeName = "third";
      // add页面的显示
      this.htmlShow = true;
      this.htmlShowStyle = false;
      // 编辑
      this.eihtmlShow = false;
      this.deleteContactStyle = false;

      if (recordForm) {
        for (let obj in recordForm) {
          // obj == "nativePlaceCode" ||
          if (obj == "addrCode") {
            let str = [];
            if (recordForm[obj]) {
              for (let j = 0; j < recordForm[obj].length; j++) {
                if (
                  recordForm[obj][j] === "" ||
                  recordForm[obj][j] === null ||
                  typeof recordForm[obj][j] === undefined
                ) {
                  recordForm[obj].splice(j, 1);
                  j = j - 1;
                }
              }
              recordForm[obj] = recordForm[obj]
                .toString()
                .replace(/\[|]/g, "")
                .split(",");
              for (let i = 0; i < recordForm[obj].length; i++) {
                str[i] = parseInt(recordForm[obj][i]);
              }
              recordForm[obj] = str;
            }
          }
        }
        recordForm.isHomeBed = recordForm.isHomeBed
          ? recordForm.isHomeBed
          : "1";
        // ["2020-09-08 00:00:00", "2020-10-05 23:59:59"]
        if (recordForm.predictTreatStartTime) {
          recordForm.chargeDate2 = [
            new Date(recordForm.predictTreatStartTime),
            new Date(recordForm.predictTreatEndTime)
          ];
        } else {
          recordForm.chargeDate2 = [
            new Date(Date.now()),
            new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          ];
        }
        recordForm.headImg = require("@/assets/pojehjdz.jpeg");
        recordForm.medicareCard = recordForm.patientCode;
        recordForm.phoneNum = recordForm.mobileNum;

        recordForm.admissionSdeptId =
          recordForm.admissionSdeptId * 1 || "";
      }

      // 诊断
      if (recordForm.inpDiagInfoDTOS) {
        this.zdData = recordForm.inpDiagInfoDTOS;

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
      if (recordForm.inpPatientContactsVOS) {
        recordForm.archGuarantorList = recordForm.inpPatientContactsVOS;
        if (recordForm.archGuarantorList.length == 0) {
          this.deleteContactStyle = true;
        }
        for (let j = 0; j < recordForm.archGuarantorList.length; j++) {}
      } else {
        recordForm.archGuarantorList = [];
        this.deleteContactStyle = true;
      }
      this.recordForm = recordForm;
    },

    // 这是待登记的点击选患者事件
    async patientListFunData2(item) {
      let result = await getApplyInfo({ applyId: item.applyId });
      let recordForm = result.data;
      // 待登记标识
      recordForm.isSettlement = "1";
      recordForm.activeName = "first";
      recordForm.maritalStatus = recordForm.maritalStatus
        ? recordForm.maritalStatus + ""
        : "90";
      recordForm.bloodType = recordForm.bloodType || "5";

      // add页面的显示
      this.htmlShow = true;
      this.htmlShowStyle = false;
      // 编辑
      this.eihtmlShow = false;
      this.deleteContactStyle = false;

      if (recordForm) {
        for (let obj in recordForm) {
          // obj == "nativePlaceCode" ||
          if (obj == "addrCode") {
            let str = [];
            if (recordForm[obj]) {
              for (let j = 0; j < recordForm[obj].length; j++) {
                if (
                  recordForm[obj][j] === "" ||
                  recordForm[obj][j] === null ||
                  typeof recordForm[obj][j] === undefined
                ) {
                  recordForm[obj].splice(j, 1);
                  j = j - 1;
                }
              }
              recordForm[obj] = recordForm[obj]
                .toString()
                .replace(/\[|]/g, "")
                .split(",");
              for (let i = 0; i < recordForm[obj].length; i++) {
                str[i] = parseInt(recordForm[obj][i]);
              }
              recordForm[obj] = str;
            }
          }
        }
        recordForm.isHomeBed = recordForm.isHomeBed || "1";
        // ["2020-09-08 00:00:00", "2020-10-05 23:59:59"]
        recordForm.chargeDate2 = [
          new Date(recordForm.treatStartTime),
          new Date(recordForm.treatEndTime)
        ];
        recordForm.headImg = require("@/assets/pojehjdz.jpeg");
        recordForm.medicareCard = recordForm.patientCode;
        recordForm.phoneNum = recordForm.mobileNum;
        recordForm.patientAddr = recordForm.familyAddress;
        recordForm.admitIllnessSummary = recordForm.summaryOfIllness;
        recordForm.admitOpinion = recordForm.createOpinions;
        recordForm.siRegDiseaseCode = recordForm.diseaseType;
        recordForm.admitTypeCode = recordForm.createType;
        recordForm.firstAdmissionTime = recordForm.firstBedBuild;
        recordForm.birthDate = recordForm.patientBirthday;

        recordForm.admissionSdeptId =
          recordForm.admissionSdeptId * 1 || "";
      }

      recordForm.inpDiagInfoDTOS = recordForm.diagList;
      // 诊断
      if (recordForm.inpDiagInfoDTOS) {
        this.zdData = recordForm.inpDiagInfoDTOS;

        for (let j = 0; j < this.zdData.length; j++) {
          this.zdData[j].remoteParams1 = {
            keyword: "", //this.diagnosticForm.diagName,
            type: "", //hosType2,
            cwFlag: this.zdData[j].cwFlag
          };
          this.zdData[j].operateType = "2";
        }
      }
      recordForm.inpPatientContactsVOS = recordForm.contactList;

      // 联系人
      if (recordForm.inpPatientContactsVOS) {
        let archGuarantorList = recordForm.inpPatientContactsVOS;
        let datas = [];
        if (archGuarantorList.length == 0) {
          this.deleteContactStyle = true;
        }
        for (let j = 0; j < archGuarantorList.length; j++) {
          archGuarantorList[
            j
          ].phone = archGuarantorList[j].contactsPhone;
          archGuarantorList[
            j
          ].name = archGuarantorList[j].contacts;
          archGuarantorList[
            j
          ].relation = archGuarantorList[j].relationShip;
          datas.push({
            phone: archGuarantorList[j].contactsPhone,
            name: archGuarantorList[j].contacts,
            relation: archGuarantorList[j].relationShip,
          })
        }
        recordForm.archGuarantorList = datas;
      } else {
        recordForm.archGuarantorList = [];
        this.deleteContactStyle = true;
      }
      this.recordForm = recordForm;
    },

    async handleClose() {
      for (let i = 0; i < this.cardList.length; i++) {
        if (i == this.cardId) {
          this.cardList.splice(i, 1);
        }
      }
      this.dialogVisible = false;
    },

    //切换工具箱
    messageHandler() {},
    //左侧列表转换tab
    handleClick() {},
    //element组件input无法输入问题
    inputChange(e) {
      this.$forceUpdate();
    },
    refsChild() {},
    // 清空
    emptyFun() {
      // 禁止输入
      this.disableEditing = false;
      for (let obj in this.recordForm) {
        if (obj == "headImg") {
          this.recordForm[obj] = require("@/assets/pojehjdz.jpeg");
        } else {
          this.recordForm[obj] = "";
        }
      }

      this.recordForm.archGuarantorList = [];

      this.zdData = [];
    },

    conserve() {
      this.yujiaomodelVisible = false;

      this.$refs.finishcheckleftbar &&
        this.$refs.finishcheckleftbar[0] &&
        this.$refs.finishcheckleftbar[0].search(this.patientInfoNow);

      this.emptyFun();

      this.getBedList(); // 刷新可用床位
    },
    huidanClose() {
      this.yujiaomodelVisible = false;
    },
    //提交表单
    submit() {
      this.$refs["recordForm"].validate(async valid => {
        if (valid) {
          var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
          if (
            !this.recordForm.patientName ||
            this.recordForm.patientName.length <= 0
          ) {
            this.$message.error("姓名不能为空");
            return false;
          }
          if (
            !this.recordForm.patientGender ||
            this.recordForm.patientGender.length <= 0
          ) {
            this.$message.error("性别不能为空");
            return false;
          }
          if (
            !this.recordForm.birthDate ||
            this.recordForm.birthDate.length <= 0
          ) {
            this.$message.error("出生日期不能为空");
            return false;
          }

          if (
            this.recordForm.identificationNum &&
            !this.recordForm.identificationType
          ) {
            this.$message.error("证件类型不能为空");
            return false;
          }
          if (
            !this.recordForm.patientAddr ||
            this.recordForm.patientAddr.length <= 0
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
            !this.recordForm.phoneNum ||
            this.recordForm.phoneNum.length <= 0
          ) {
            this.$message.error("手机号不能为空");
            return false;
          }
          if (
            !this.recordForm.manageDoctorId ||
            this.recordForm.manageDoctorId.length <= 0 ||
            reg.test(this.recordForm.manageDoctorId)
          ) {
            this.$message.error("请选择责任医生");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.manageNurseId ||
            this.recordForm.manageNurseId.length <= 0 ||
            reg.test(this.recordForm.manageNurseId)
          ) {
            this.$message.error("请选择责任护士");
            this.active = 0;
            return false;
          }
          if (!this.recordForm.bedId || this.recordForm.bedId.length <= 0) {
            this.$message.error("床位不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.admitIllnessSummary ||
            this.recordForm.admitIllnessSummary.length <= 0
          ) {
            this.$message.error("病情摘要不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.admitOpinion ||
            this.recordForm.admitOpinion.length <= 0
          ) {
            this.$message.error("建床意见不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.siRegDiseaseCode ||
            this.recordForm.siRegDiseaseCode.length <= 0
          ) {
            this.$message.error("社保登记病种不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.admitTypeCode ||
            this.recordForm.admitTypeCode.length <= 0
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
          try {
            //保存表单接口接口
            let patientArchiveInfoVOData = {};
            patientArchiveInfoVOData = this.recordForm;
            // 治疗开始结束时间
            patientArchiveInfoVOData["predictTreatStartTime"] =
              (this.recordForm.chargeDate2 && this.recordForm.chargeDate2[0]) ||
              "";
            patientArchiveInfoVOData["predictTreatEndTime"] =
              (this.recordForm.chargeDate2 && this.recordForm.chargeDate2[1]) ||
              "";

            patientArchiveInfoVOData["birthDate"] =
              this.recordForm.birthDate.substring(0, 10) + " " + "00:00:00";

            patientArchiveInfoVOData[
              "inpPatientContactsVOS"
            ] = this.recordForm.archGuarantorList;
            patientArchiveInfoVOData["inpDiagInfoDTOS"] = this.zdData;
            let result = await finHosReg(patientArchiveInfoVOData);
            if (result.code == "1") {
              this.$message.success("登记成功");

              // 弹出预交费
              this.sendData = result.data;
              this.yujiaomodelVisible = true;

              this.activeNew = 1;
              // 提交后刷新患者列表，病选中当前患者，右侧显示该患者信息
              const selectedItem = JSON.parse(
                JSON.stringify(patientArchiveInfoVOData)
              );

              this.patientInfoNow = selectedItem;
              this.activeName = "third"; // 切换患者列表tab到已登记上

              this.emptyFun();

              this.getBedList(); // 刷新可用床位

              this.$nextTick(() => {
                this.$refs.finishcheckleftbar &&
                  this.$refs.finishcheckleftbar[0] &&
                  this.$refs.finishcheckleftbar[0].search(selectedItem);
              });
            } else {
              this.$message.error(result.msg || "保存失败");
              this.$refs.leftbar &&
                this.$refs.leftbar[0] &&
                this.$refs.leftbar[0].search();
              this.$refs.directcheckleftbar &&
                this.$refs.directcheckleftbar[0] &&
                this.$refs.directcheckleftbar[0].search();
              this.$refs.finishcheckleftbar &&
                this.$refs.finishcheckleftbar[0] &&
                this.$refs.finishcheckleftbar[0].search();
            }
          } catch (error) {
            this.$message.error((error.data && error.data.msg) || "保存失败");
            this.$refs.leftbar &&
              this.$refs.leftbar[0] &&
              this.$refs.leftbar[0].search();
            this.$refs.directcheckleftbar &&
              this.$refs.directcheckleftbar[0] &&
              this.$refs.directcheckleftbar[0].search();
            this.$refs.finishcheckleftbar &&
              this.$refs.finishcheckleftbar[0] &&
              this.$refs.finishcheckleftbar[0].search();
          } finally {
            this.$hideLoading();
          }
        }
      });
    },
    patientDetail() {
      if (this.activeName == "first") {
        this.$refs.leftbar &&
          this.$refs.leftbar[0] &&
          this.$refs.leftbar[0].search();
      } else if (this.activeName == "second") {
        this.$refs.directcheckleftbar &&
          this.$refs.directcheckleftbar[0] &&
          this.$refs.directcheckleftbar[0].search();
      } else {
        this.$refs.finishcheckleftbar &&
          this.$refs.finishcheckleftbar[0] &&
          this.$refs.finishcheckleftbar[0].search(this.patientInfoNow);
      }
    },
    submitChange() {
      this.$refs["recordForm"].validate(async valid => {
        if (valid) {
          var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
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
            !this.recordForm.birthDate ||
            this.recordForm.birthDate.length <= 0
          ) {
            this.$message.error("出生日期不能为空");
            this.active = 0;
            return false;
          }

          if (
            this.recordForm.identificationNum &&
            !this.recordForm.identificationType
          ) {
            this.$message.error("证件类型不能为空");
            return false;
          }
          if (
            !this.recordForm.patientAddr ||
            this.recordForm.patientAddr.length <= 0
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
            !this.recordForm.phoneNum ||
            this.recordForm.phoneNum.length <= 0
          ) {
            this.$message.error("手机号不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.manageDoctorId ||
            this.recordForm.manageDoctorId.length <= 0 ||
            reg.test(this.recordForm.manageDoctorId)
          ) {
            this.$message.error("请选择责任医生");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.manageNurseId ||
            this.recordForm.manageNurseId.length <= 0 ||
            reg.test(this.recordForm.manageNurseId)
          ) {
            this.$message.error("请选择责任护士");
            this.active = 0;
            return false;
          }
          if (!this.recordForm.bedId || this.recordForm.bedId.length <= 0) {
            this.$message.error("床位不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.admitIllnessSummary ||
            this.recordForm.admitIllnessSummary.length <= 0
          ) {
            this.$message.error("病情摘要不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.admitOpinion ||
            this.recordForm.admitOpinion.length <= 0
          ) {
            this.$message.error("建床意见不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.siRegDiseaseCode ||
            this.recordForm.siRegDiseaseCode.length <= 0
          ) {
            this.$message.error("社保登记病种不能为空");
            this.active = 0;
            return false;
          }
          if (
            !this.recordForm.admitTypeCode ||
            this.recordForm.admitTypeCode.length <= 0
          ) {
            this.$message.error("建床类型不能为空");
            this.active = 0;
            return false;
          }
          this.$showLoading();
          try {
            //保存表单接口接口
            let patientArchiveInfoVOData = {};
            patientArchiveInfoVOData = this.recordForm;
            // 治疗开始结束时间
            patientArchiveInfoVOData["predictTreatStartTime"] =
              (
                this.recordForm.chargeDate2 && this.recordForm.chargeDate2[0]
              ).format("yyyy-MM-dd") || "";
            patientArchiveInfoVOData["predictTreatEndTime"] =
              (
                this.recordForm.chargeDate2 && this.recordForm.chargeDate2[1]
              ).format("yyyy-MM-dd") || "";

            patientArchiveInfoVOData["birthDate"] =
              this.recordForm.birthDate.substring(0, 10) + " " + "00:00:00";

            patientArchiveInfoVOData[
              "inpPatientContactsVOS"
            ] = this.recordForm.archGuarantorList;
            patientArchiveInfoVOData["inpDiagInfoDTOS"] = this.zdData;

            let result = await regInfo(patientArchiveInfoVOData);
            if (result.code == "1") {
              this.$message.success("档案已修改");
              this.activeNew = 1;

              const selectedItem = JSON.parse(
                JSON.stringify(patientArchiveInfoVOData)
              );
              this.$refs.leftbar &&
                this.$refs.leftbar[0] &&
                this.$refs.leftbar[0].search();
              this.$refs.directcheckleftbar &&
                this.$refs.directcheckleftbar[0] &&
                this.$refs.directcheckleftbar[0].search();
              this.$refs.finishcheckleftbar &&
                this.$refs.finishcheckleftbar[0] &&
                this.$refs.finishcheckleftbar[0].search(selectedItem);
              this.emptyFun();

              this.getBedList(); // 刷新可用床位

              this.htmlShowStyle = true;
              this.htmlShow = false;
            } else {
              this.$message.error(result.msg || "修改失败");
              this.$refs.leftbar &&
                this.$refs.leftbar[0] &&
                this.$refs.leftbar[0].search();
              this.$refs.directcheckleftbar &&
                this.$refs.directcheckleftbar[0] &&
                this.$refs.directcheckleftbar[0].search();
              this.$refs.finishcheckleftbar &&
                this.$refs.finishcheckleftbar[0] &&
                this.$refs.finishcheckleftbar[0].search();
            }
          } catch (error) {
            this.$message.error(error.msg || "修改失败。");
            this.$refs.leftbar &&
              this.$refs.leftbar[0] &&
              this.$refs.leftbar[0].search();
            this.$refs.directcheckleftbar &&
              this.$refs.directcheckleftbar[0] &&
              this.$refs.directcheckleftbar[0].search();
            this.$refs.finishcheckleftbar &&
              this.$refs.finishcheckleftbar[0] &&
              this.$refs.finishcheckleftbar[0].search();
          } finally {
            this.$hideLoading();
          }
        }
      });
    },
    async cancalSubmit() {
      this.$showLoading();
      try {
        let params = { finAdId: this.recordForm.finAdId };
        let { code, msg } = await logoutIn(params);
        if (code == 1) {
          this.$message.success("注销入院成功");
          // 注销后刷新患者列表，病选中当前患者，右侧显示该患者信息
          try {
            // const selectedItem = JSON.parse(JSON.stringify(this.recordForm));
            // this.activeName = "first"; // 切换患者列表tab到待登记上

            this.$nextTick(() => {
              this.$refs.leftbar &&
                this.$refs.leftbar[0] &&
                this.$refs.leftbar[0].search();
              this.$refs.directcheckleftbar &&
                this.$refs.directcheckleftbar[0] &&
                this.$refs.directcheckleftbar[0].search();
              this.$refs.finishcheckleftbar &&
                this.$refs.finishcheckleftbar[0] &&
                this.$refs.finishcheckleftbar[0].search();
              this.emptyFun();
              this.getBedList(); // 刷新可用床位
            });
          } catch (e) {}
        } else {
          this.$message.error(msg || "注销入院失败");
        }
      } catch (e) {
        this.$message.error(e.msg || "注销入院失败！");
      } finally {
        this.$hideLoading();
      }
    },
    //联系地址监听
    contactChange(value, curItem) {
      if (value.length > 0 && curItem.length > 0) {
        this.patientEmpiInfoAddrssVO.currentProvinceCode = value[0];
        this.patientEmpiInfoAddrssVO.currentProvinceName = curItem[0].label;

        this.patientEmpiInfoAddrssVO.currentCityCode = value[1];
        this.patientEmpiInfoAddrssVO.currentCityName = curItem[1].label;

        this.patientEmpiInfoAddrssVO.currentRegionCode = value[2];
        this.patientEmpiInfoAddrssVO.currentRegionName = curItem[2].label;
      } else {
        this.$message.error("联系地址不能为空");
        this.patientEmpiInfoAddrssVO.currentAddress = [2595, 2623, 2625];
      }
    },
    //新建联系人--默认监护人
    addArchGuarantorList() {
      this.deleteContactStyle = false;
      // let archGuarantorList = [...this.recordForm.archGuarantorList];
      let archGuarantorList = this.recordForm.archGuarantorList;
      archGuarantorList.push({
        patientId: "",
        relation: "1", //联系人与患者关系
        name: "", //联系人姓名
        // idCardNum: '', //联系人身份证号
        phone: "", //联系人联系方式
        recordStatus: "", //状态1-有效；0-作废

        patientType: "1", //1是监护人
        patientName: "", //姓名
        // identificationNum: '', //身份证号
        phoneNum: "", //手机号
        address: "", //地址数组code
        conDetail: "", //具体地址
        email: "", //邮箱
        workUnit: "", //联系人单位
        otherUnit: "" //其他单位
      });
      // this.recordForm.archGuarantorList = [...archGuarantorList];
      console.log(
        this.recordForm.archGuarantorList,
        "this.recordForm.archGuarantorList"
      );
    },
    //改变联系人
    concatChange(item, index, info) {
      let changeItem = { ...item };
      if (!this.recordForm.archGuarantorList) {
        this.recordForm.archGuarantorList = [];
      }
      this.recordForm.archGuarantorList.push(changeItem);
      this.$delete(this.recordForm.archGuarantorList, index);
    },
    //删除联系人
    deleteContact(item, index) {
      this.deleteContactStyle = index == 0;
      if (item.type == "1") {
        let propsRefieds = [];
        let archGuarantorList = [...this.recordForm.archGuarantorList];
        for (let i in archGuarantorList) {
          propsRefieds.push("archGuarantorList." + index + ".idCard");
          propsRefieds.push("archGuarantorList." + index + ".phoneNum");
        }
        this.$refs["recordForm"].clearValidate(propsRefieds);
        this.$delete(archGuarantorList, index);
        this.recordForm.archGuarantorList = [...archGuarantorList];
      } else {
        let propsRefieds1 = [];
        let archGuarantorList = [...this.recordForm.archGuarantorList];
        for (let i in archGuarantorList) {
          propsRefieds1.push("archGuarantorList." + index + ".idCard");
          propsRefieds1.push("archGuarantorList." + index + ".phoneNum");
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
    change(t) {
      if (t < 10) {
        return "0" + t;
      }
      return t;
    },
    HealthRegistrationClose() {
      this.HealthRegistrationVisible = false;
      this.HealthRegistrationNewVisible = false;
    },
    HealthRegistrationSure() {
      this.HealthRegistrationVisible = false;
      this.HealthRegistrationNewVisible = false;
      this.refreshData();
    },
    refreshData() {
      const selectedItem = deepClone(this.recordForm);
      this.activeName = "third"; // 切换患者列表tab到已
      this.emptyFun();
      this.getBedList(); // 刷新
      this.$refs.finishcheckleftbar &&
        this.$refs.finishcheckleftbar[0] &&
        this.$refs.finishcheckleftbar[0].search(selectedItem);
    },
    // 医保登记修改
    szRegChange() {
      this.SZHealthRegistrationType = 'change';
      /* if(this.form.medicareType == "01") {
        this.HealthRegistrationVisible = true;
        return;
      } */
      this.HealthRegistrationNewVisible = true;
    }

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
