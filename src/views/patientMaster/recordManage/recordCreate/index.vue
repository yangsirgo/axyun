<template>
  <div class="width100 height100">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="false"
      @message="messageHandler"
      pageName="docSubmit">
      <template #list>
        <!--<leftTabs
          @tabs-change="handleClick"
          @read-card="readCard"
          @query="search"
          searchPlaceholder="姓名/卡号"
          v-model="leftTabsValue"
          :tabs-name="tabsName"
          :form-list="formParams"
          mode='patientMaster'>
          <template #first>
            <left-list :param="param" :searchType="searchType" ref="leftList"></left-list>
          </template>
        </leftTabs>-->
        <LSideTab
          @tabClick="handleClick"
          @sideEvent="sideEvent"
        >
          <template #formList>
            <div class="margin-bottom-6">
              <el-checkbox true-label="1" false-label="0" v-model="form.reservation">当日预约</el-checkbox>
            </div>
            <div class="margin-bottom-6">
              <l-value-domain
                clearable
                code="ARCH_STATUS"
                style="width: 100%"
                :value.sync="form.recordStatus"
                placeholder="请选择档案状态"
              ></l-value-domain>
            </div>
            <div class="margin-bottom-6">
              <el-date-picker
                v-model="form.timeRange"
                type="daterange"
                style="width: 100%"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="创建开始日期"
                end-placeholder="创建结束日期"
              ></el-date-picker>
            </div>
            <el-input @keyup.native.enter="sideEvent('query')"
                      v-model="form.search"
                      placeholder="姓名/身份证号/患者编号"
                      style="width: 100%"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="('query')"></i>
            </el-input>
          </template>
          <template #mainCont>
            <left-list :param="form" ref="leftList"></left-list>
          </template>
          <template #sideOperation></template>
        </LSideTab>
      </template>
      <template #content>
        <div class="recordCreate width100 height100">
          <el-card class="card-cont1 width100">
            <div class="form-cont height-button-main">
              <el-form
                ref="recordForm"
                :model="recordForm"
                :rules="rules"
              >
                <el-row class="realNameSystem">
                  <el-col :span="10">
                    <el-radio v-model="recordForm.realNameSystem" disabled label="1">实名制</el-radio>
                    <el-radio v-model="recordForm.realNameSystem" disabled label="0">非实名</el-radio>
                  </el-col>
                </el-row>
                <div class="clearfix img-cont">
                  <div class="float-left img-left">
                    <el-row :gutter="20" class="margin-bottom-20">
                      <el-col :span="8">
                        <LFormtTitle label="姓名" required>
                          <el-form-item prop="patientName">
                            <el-input v-model="recordForm.patientName"
                                      style="line-height: 34px;width:100%"
                                      @blur.prevent="patientBlur"
                                      placeholder="请输入姓名"
                                      @input="inputChange($event)"
                            >
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <!--<el-col :span="8">
                        <LFormtTitle label="真实姓名">
                          <el-form-item prop="patientFullName">
                            <el-input v-model="recordForm.patientFullName"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>-->
                      <el-col :span="8">
                        <!--<LFormtTitle label="身份证号">
                          <el-form-item prop="identificationNum">
                            <el-input v-model="recordForm.identificationNum"
                                      style="line-height: 34px;width:100%"
                                      @blur="patientBlur"></el-input>
                          </el-form-item>
                        </LFormtTitle>-->
                        <LDoubleInput widthRatio="100px">
                          <template slot="left">
                            <el-form-item prop="identificationType">
                              <l-value-domain
                                :code="selectCode.identificationType"
                                :value.sync="recordForm.identificationType"
                                :placeholder="$t('base.placeholder')"
                                @change="identificationTypeChange"
                              ></l-value-domain>
                            </el-form-item>
                          </template>
                          <template slot="right">
                            <el-form-item prop="identificationNum">
                              <el-input v-model="recordForm.identificationNum"
                                        style="line-height: 34px;width:100%"
                                        :disabled="identificationNumDisabled"
                                        maxlength="18"
                                        @blur="identifiBlur"
                                        @input="inputChange($event)">
                              </el-input>
                            </el-form-item>
                          </template>
                        </LDoubleInput>
                      </el-col>

                      <el-col :span="2">
                        <el-button type="primary" plain @click="verify" v-if="isRealNameSystem">去实名
                        </el-button>
                        <el-button type="primary" plain v-else disabled>已实名
                        </el-button>
                      </el-col>

                      <el-col :span="6">
                        <LFormtTitle label="性别" required>
                          <el-form-item prop="patientGender">
                            <l-value-domain
                              :code="selectCode.patientGender"
                              :value.sync="recordForm.patientGender"
                              class="select-container"
                              :placeholder="$t('base.placeholder')"
                              key="key20"
                            ></l-value-domain>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20" class="margin-bottom-20">
                      <el-col :span="8">
                        <LFormtTitle label="出生日期" required>
                          <el-form-item prop="birthDate">
                            <el-date-picker
                              v-model="recordForm.birthDate"
                              type="date"
                              style="line-height: 34px;width:100%"
                              placeholder="选择日期"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              :picker-options="expireTimeOption"
                              @change="birthDateBlur">
                            </el-date-picker>
                            <!--<el-date-picker
                              v-model="recordForm.birthDate"
                              type="datetime"
                              style="line-height: 34px;width:100%"
                              placeholder="选择日期"
                              :picker-options="expireTimeOption"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              @change="birthDateBlur">
                            </el-date-picker>-->
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="8">
                        <LFormtTitle label="出生时间">
                          <el-form-item prop="birthTime">
                            <el-time-picker
                              v-model="recordForm.birthTime"
                              value-format="HH:mm:ss"
                              :picker-options="birthTimeOption"
                              style="line-height: 34px;width:100%"
                              placeholder="选择时间"
                              @change="getAgeByBirthDate">
                            </el-time-picker>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="8">
                        <LFormtTitle label="年龄" disabled>
                          <el-form-item prop="patientAge">
                            <el-input v-model="recordForm.patientAge" style="line-height: 34px;width:100%"
                                      disabled></el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20" class="margin-bottom-20">
                      <el-col :span="5">
                        <LFormtTitle label="手机号码">
                          <el-form-item prop="mobileNum">
                            <el-input v-model="recordForm.mobileNum"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入"
                                      @blur="patientBlur"
                                      @input="inputChange($event)">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="3">
                        <el-button class="veri-code width100" type="info" :disabled="veriCodeDisabled"
                                   @click="getVeriCode">
                          {{veriCodeMsg}}
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <LFormtTitle label="手机验证码">
                          <el-form-item prop="msgCode">
                            <el-input v-model="recordForm.msgCode"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入"
                                      @input="inputChange($event)">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="8">
                        <LFormtTitle label="其他电话">
                          <el-form-item prop="otherMobileNum">
                            <el-input v-model="recordForm.otherMobileNum"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入"
                                      @input="inputChange($event)">
                            </el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20" class="margin-bottom-20">
                      <el-col :span="8">
                        <LFormtTitle label="婚姻状况">
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

                      <el-col :span="8">
                        <LFormtTitle label="血型">
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
                      <el-col :span="8">
                        <LFormtTitle label="国家">
                          <el-form-item prop="countryCode">
                            <l-value-domain
                              :code="selectCode.countryCode"
                              :value.sync="recordForm.countryCode"
                              class="select-container"
                              :placeholder="$t('base.placeholder')"
                              key="key24"
                            ></l-value-domain>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="float-left img-right">
                    <img :src="recordForm.headImg" alt=""/>
                  </div>
                </div>
                <el-row :gutter="20" class="margin-bottom-20">
                  <el-col :span="8">
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
                          @change="nativePlacecChange"
                        ></l-value-domain>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="8">
                    <LFormtTitle label="民族">
                      <el-form-item prop="nationCode">
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
                </el-row>
                <el-row :gutter="20" class="margin-bottom-20">
                  <el-col :span="8">
                    <LFormtTitle label="居民健康卡">
                      <el-form-item prop="healthCard">
                        <el-input v-model="recordForm.healthCard"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)">
                        </el-input>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="8">
                    <LFormtTitle label="社保卡号">
                      <el-form-item prop="SINCardNo">
                        <el-input v-model="recordForm.SINCardNo"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)">
                        </el-input>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="8">
                    <LFormtTitle label="军官证">
                      <el-form-item prop="militaryOfficer">
                        <el-input v-model="recordForm.militaryOfficer"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)">
                        </el-input>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="margin-bottom-20">
                  <el-col :span="8">
                    <LFormtTitle label="驾驶证">
                      <el-form-item prop="drivingLicence">
                        <el-input v-model="recordForm.drivingLicence"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)">
                        </el-input>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="8">
                    <LFormtTitle label="学生证">
                      <el-form-item prop="studyLicence">
                        <el-input v-model="recordForm.studyLicence"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)">
                        </el-input>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="margin-bottom-20">
                  <el-col :span="8">
                    <LFormtTitle label="户籍地址">
                      <el-form-item prop="domicile">
                        <l-value-domain
                          type="cascader"
                          :code="selectCode.domicile"
                          :value.sync="recordForm.domicile"
                          class="select-container"
                          remoteValueKey="id"
                          remoteShowKey="label"
                          :multiple="false"
                          :relation="true"
                          @change="domicileChange"
                          :placeholder="$t('base.placeholder')"
                          key="key2"
                        ></l-value-domain>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="8">
                    <LFormtTitle label="具体地址">
                      <el-form-item prop="domicileAddress">
                        <el-input v-model="recordForm.domicileAddress"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)">
                        </el-input>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="8">
                    <LFormtTitle label="邮编">
                      <el-form-item prop="domicilePostCode">
                        <el-input v-model="recordForm.domicilePostCode"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)">
                        </el-input>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="margin-bottom-20">
                  <el-col :span="8">
                    <LFormtTitle label="联系地址">
                      <el-form-item prop="address">
                        <l-value-domain
                          type="cascader"
                          :code="selectCode.address"
                          :value.sync="recordForm.address"
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
                  <el-col :span="8">
                    <LFormtTitle label="具体地址">
                      <el-form-item prop="detaiAddress">
                        <el-input v-model="recordForm.detaiAddress"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)">
                        </el-input>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="8">
                    <LFormtTitle label="邮编">
                      <el-form-item prop="addressPostCode">
                        <el-input v-model="recordForm.addressPostCode"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)">
                        </el-input>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="margin-bottom-20">
                  <el-col :span="8">
                    <LFormtTitle label="职业">
                      <el-form-item prop="careerCode">
                        <l-value-domain
                          :code="selectCode.careerCode"
                          :value.sync="recordForm.careerCode"
                          class="select-container"
                          :placeholder="$t('base.placeholder')"
                          key="key4"
                        ></l-value-domain>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="8">
                    <LFormtTitle label="工作单位">
                      <el-form-item prop="company">
                        <el-input v-model="recordForm.company"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)">
                        </el-input>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="8">
                    <LFormtTitle label="单位电话">
                      <el-form-item prop="officeTel">
                        <el-input v-model="recordForm.officeTel"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请输入"
                                  @input="inputChange($event)">
                        </el-input>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                </el-row>
                <!--<el-row :gutter="20" class="margin-bottom-20">
                  <el-col :span="8">
                    <el-radio v-model="recordForm.isanamnesis" label="">是否有慢性病史</el-radio>
                  </el-col>
                  <el-col :span="8">
                    <LFormtTitle label="慢性病">
                      <el-form-item prop="anamnesis">
                        <el-input v-model="recordForm.anamnesis"
                                  style="line-height: 34px;width:100%"
                                  placeholder="请输入">
                        </el-input>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                </el-row>-->
                <el-row :gutter="20" class="margin-bottom-20">
                  <el-col :span="8">
                    <LFormtTitle label="结算类型">
                      <el-form-item prop="settlementType">
                        <l-value-domain
                          :code="selectCode.settlementType"
                          :value.sync="recordForm.settlementType"
                          class="select-container"
                          :placeholder="$t('base.placeholder')"
                          key="key5"
                        ></l-value-domain>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="8">
                    <LFormtTitle label="结算单位">
                      <el-form-item prop="settlementCompany">
                        <l-value-domain
                          :code="selectCode.settlementCompany"
                          :value.sync="recordForm.settlementCompany"
                          class="select-container"
                          :placeholder="$t('base.placeholder')"
                          key="key6"
                        ></l-value-domain>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                  <el-col :span="8">
                    <LFormtTitle label="社保类型">
                      <el-form-item prop="socialSecurity">
                        <l-value-domain
                          :code="selectCode.socialSecurity"
                          :value.sync="recordForm.socialSecurity"
                          class="select-container"
                          :placeholder="$t('base.placeholder')"
                          key="key7"
                        ></l-value-domain>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                </el-row>
                <el-row :gutter="20" class="margin-bottom-20">
                  <el-col :span="8">
                    <LFormtTitle label="建档类型">
                      <el-form-item prop="bookbuildingType">
                        <l-value-domain
                          :code="selectCode.bookbuildingType"
                          :value.sync="recordForm.bookbuildingType"
                          class="select-container"
                          :placeholder="$t('base.placeholder')"
                          key="key8"
                        ></l-value-domain>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>
                  <!--<el-col :span="8">
                    <LFormtTitle label="关联卡">
                      <el-form-item prop="cardAssociated">
                        <l-value-domain
                          :code="selectCode.cardAssociated"
                          :value.sync="recordForm.cardAssociated"
                          class="select-container"
                          :placeholder="$t('base.placeholder')"
                          key="key9"
                        ></l-value-domain>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>-->
                  <!--<el-col :span="8">
                    <LFormtTitle label="档案状态">
                      <el-form-item prop="fileLoading">
                        <l-value-domain
                          :code="selectCode.fileLoading"
                          :value.sync="recordForm.fileLoading"
                          class="select-container"
                          :placeholder="$t('base.placeholder')"
                          key="key10"
                        ></l-value-domain>
                      </el-form-item>
                    </LFormtTitle>
                  </el-col>-->
                </el-row>
                <!--<el-button class="primary-button" @click="addContact" style="margin-bottom: 20px">新建联系人</el-button>-->
                <div v-for="(item,index) in recordForm.archFiduciaryList"
                     :key="index">
                  <el-row :gutter="20" class="margin-bottom-20">
                    <el-col :span="8">
                      <LDoubleInput widthRatio="105px">
                        <template slot="left">
                          <el-form-item prop="type">
                            <l-value-domain
                              :code="selectCode.type"
                              :value.sync="item.type"
                              :isFilterable="false"
                              class="select-container"
                              :placeholder="$t('base.placeholder')"
                              :key="'key11' + index"
                              @change="concatChange(item, index, 'archFiduciaryList')"
                            ></l-value-domain>
                          </el-form-item>
                        </template>
                        <template slot="right">
                          <el-form-item :prop="'archFiduciaryList.' + index + '.fiduciaryName'"
                                        :rules="rules.fiduciaryName">
                            <el-input v-model="item.fiduciaryName"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入"
                                      @input="inputChange($event)">
                            </el-input>
                          </el-form-item>
                        </template>
                      </LDoubleInput>
                    </el-col>
                    <el-col :span="8">
                      <LFormtTitle label="身份证号">
                        <el-form-item :prop="'archFiduciaryList.' + index + '.identificationNum'"
                                      :rules="rules.archIdentificationNum">
                          <el-input v-model="item.identificationNum"
                                    style="line-height: 34px;width:100%"
                                    placeholder="请输入"
                                    maxlength="18"
                                    @blur="identificationNumFun(item.identificationNum)"
                                    @input="inputChange($event)">
                          </el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="8">
                      <LFormtTitle label="联系人电话">
                        <el-form-item :prop="'archFiduciaryList.' + index + '.phone'"
                                      :rules="rules.archPhone">
                          <el-input v-model="item.phone"
                                    style="line-height: 34px;width:100%"
                                    placeholder="请输入"
                                    @input="inputChange($event)">
                          </el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20" class="margin-bottom-20">
                    <el-col :span="8">
                      <LFormtTitle label="联系人关系">
                        <el-form-item prop="relationShip">
                          <l-value-domain
                            :code="selectCode.relationShip"
                            :value.sync="item.relationShip"
                            class="select-container"
                            :placeholder="$t('base.placeholder')"
                            key="key12"
                          ></l-value-domain>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="8">
                      <LFormtTitle label="联系人地址">
                        <el-form-item prop="domicile">
                          <l-value-domain
                            type="cascader"
                            :code="selectCode.domicile"
                            :value.sync="item.contactAddress"
                            class="select-container"
                            remoteValueKey="id"
                            remoteShowKey="label"
                            :multiple="false"
                            :relation="true"
                            :placeholder="$t('base.placeholder')"
                            key="key13"
                          ></l-value-domain>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="7">
                      <LFormtTitle label="具体地址">
                        <el-form-item prop="contactDetailAddress">
                          <el-input v-model="item.contactDetailAddress"
                                    style="line-height: 34px;width:100%"
                                    placeholder="请输入"
                                    @input="inputChange($event)">
                          </el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="1" style="padding-top:10px">
               <span @click="deleteContact(item,index)">
                 <svg t="1568600180299" class="icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="8251" width="18" height="18"><path
                   d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z" fill="#FFE3E2" p-id="8252"></path><path
                   d="M284.444444 455.111111h455.111112v113.777778H284.444444z" fill="#E1140A"
                   p-id="8253"></path></svg>
               </span>
                      <!--<span style="margin-left: 10px" @click="editContact(item,index)">
                 <svg t="1569030373448" class="icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="3625" width="18" height="18"><path
                   d="M895.84 514.08V896a64 64 0 0 1-64 64H128a64 64 0 0 1-64-64V128a64 64 0 0 1 64-64h351.936v64H160a32 32 0 0 0-32 32v704a32 32 0 0 0 32 32h639.872a32 32 0 0 0 32-32V512h0.064a32 32 0 1 1 63.904 2.08z m-427.552-3.68L830.336 148.352a32 32 0 0 1 45.248 45.248L513.536 555.648a32 32 0 0 1-45.248-45.248zM479.936 128V64a32 32 0 0 1 32 32c0 17.664-15.136 32-32 32z"
                   fill="#2c2c2c" p-id="3626"></path></svg>
               </span>-->
                    </el-col>
                  </el-row>
                </div>
                <div v-for="(item,index) in recordForm.archGuarantorList"
                     :key="index">
                  <el-row :gutter="20" class="margin-bottom-20">
                    <el-col :span="8">
                      <LDoubleInput widthRatio="105px">
                        <template slot="left">
                          <el-form-item prop="type">
                            <l-value-domain
                              :code="selectCode.type"
                              :value.sync="item.type"
                              :isFilterable="false"
                              class="select-container"
                              :placeholder="$t('base.placeholder')"
                              key="'key14'+index"
                              @change="concatChange(item, index, 'archGuarantorList')"
                            ></l-value-domain>
                          </el-form-item>
                        </template>
                        <template slot="right">
                          <el-form-item :prop="'archGuarantorList.' + index + '.fiduciaryName'"
                                        :rules="rules.fiduciaryName">
                            <el-input v-model="item.fiduciaryName"
                                      style="line-height: 34px;width:100%"
                                      placeholder="请输入"
                                      @input="inputChange($event)">
                            </el-input>
                          </el-form-item>
                        </template>
                      </LDoubleInput>
                    </el-col>
                    <el-col :span="8">
                      <LFormtTitle label="身份证号">
                        <el-form-item :prop="'archGuarantorList.' + index + '.identificationNum'"
                                      :rules="rules.archGIdentificationNum">
                          <el-input v-model="item.identificationNum"
                                    style="line-height: 34px;width:100%"
                                    placeholder="请输入"
                                    maxlength="18"
                                    @input="inputChange($event)">
                          </el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="8">
                      <LFormtTitle label="联系人电话">
                        <el-form-item :prop="'archGuarantorList.' + index + '.phone'"
                                      :rules="rules.archPhone">
                          <el-input v-model="item.phone"
                                    style="line-height: 34px;width:100%"
                                    placeholder="请输入"
                                    @input="inputChange($event)">
                          </el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20" class="margin-bottom-20">
                    <el-col :span="8">
                      <LFormtTitle label="联系人关系">
                        <el-form-item prop="relationShip">
                          <l-value-domain
                            :code="selectCode.relationShip"
                            :value.sync="item.relationShip"
                            class="select-container"
                            :placeholder="$t('base.placeholder')"
                            key="key15"
                          ></l-value-domain>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="8">
                      <LFormtTitle label="联系人地址">
                        <el-form-item prop="domicile">
                          <l-value-domain
                            type="cascader"
                            :code="selectCode.domicile"
                            :value.sync="item.contactAddress"
                            class="select-container"
                            remoteValueKey="id"
                            remoteShowKey="label"
                            :multiple="false"
                            :relation="true"
                            :placeholder="$t('base.placeholder')"
                            :key="'key16' + index"
                          ></l-value-domain>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="7">
                      <LFormtTitle label="具体地址">
                        <el-form-item prop="contactDetailAddress">
                          <el-input v-model="item.contactDetailAddress"
                                    style="line-height: 34px;width:100%"
                                    @input="inputChange($event)"
                                    placeholder="请输入">
                          </el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="1" style="padding-top:10px">
               <span @click="deleteContact(item,index)">
                 <svg t="1568600180299" class="icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="8251" width="18" height="18"><path
                   d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z" fill="#FFE3E2" p-id="8252"></path><path
                   d="M284.444444 455.111111h455.111112v113.777778H284.444444z" fill="#E1140A"
                   p-id="8253"></path></svg>
               </span>
                      <!--<span style="margin-left: 10px" @click="editContact(item,index)">
                 <svg t="1569030373448" class="icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="3625" width="18" height="18"><path
                   d="M895.84 514.08V896a64 64 0 0 1-64 64H128a64 64 0 0 1-64-64V128a64 64 0 0 1 64-64h351.936v64H160a32 32 0 0 0-32 32v704a32 32 0 0 0 32 32h639.872a32 32 0 0 0 32-32V512h0.064a32 32 0 1 1 63.904 2.08z m-427.552-3.68L830.336 148.352a32 32 0 0 1 45.248 45.248L513.536 555.648a32 32 0 0 1-45.248-45.248zM479.936 128V64a32 32 0 0 1 32 32c0 17.664-15.136 32-32 32z"
                   fill="#2c2c2c" p-id="3626"></path></svg>
               </span>-->
                    </el-col>
                  </el-row>
                </div>
                <div class="get-detail-button" @click="addArchGuarantorList" style="margin-bottom: 20px">+ 添加联系人</div>
                <!--<el-button class="primary-button" @click="addArchGuarantorList" style="margin-bottom: 20px">新建联系人</el-button>-->
              </el-form>
            </div>
            <div class="footer-bottom height-button-bottom">
              <div class="buttons float-right">
                <el-button style="min-width:80px" type="primary" @click="submit"
                           v-hotKey="{func: 'func_submit', flag:'loading'}">提交
                </el-button>
                <el-button type="primary" plain @click="cancelClear">取消</el-button>
              </div>
            </div>
          </el-card>
          <!--<el-card class="card-cont2 width100">
            <div v-if="visible">
              <el-row :gutter="20" class="margin-bottom-20">
                <el-col :span="6">
                  <LDoubleInput widthRatio="75px">
                    <template slot="left">
                      <l-value-domain
                        :code="selectCode.type"
                        :value.sync="concatForm.type"
                        class="select-container"
                        :placeholder="$t('base.placeholder')"
                        key="key17"
                      ></l-value-domain>
                    </template>
                    <template slot="right">
                      <el-input v-model="concatForm.fiduciaryName"
                                style="line-height: 34px;width:100%"
                                placeholder="请输入姓名">
                      </el-input>
                    </template>
                  </LDoubleInput>
                </el-col>
                <el-col :span="6">
                  <LFormtTitle label="联系人关系">
                    <l-value-domain
                      :code="selectCode.relationShip"
                      :value.sync="concatForm.relationShip"
                      class="select-container"
                      :placeholder="$t('base.placeholder')"
                      key="key18"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <LFormtTitle label="身份证号">
                    <el-input v-model="concatForm.identificationNum"
                              style="line-height: 34px;width:100%"
                              placeholder="请输入">
                    </el-input>
                  </LFormtTitle>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6">
                  <LFormtTitle label="联系人电话">
                    <el-input v-model="concatForm.phone"
                              style="line-height: 34px;width:100%"
                              placeholder="请输入">
                    </el-input>
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <LFormtTitle label="联系人地址">
                    <l-value-domain
                      type="cascader"
                      code="area"
                      :value.sync="concatForm.contactAddress"
                      class="select-container"
                      remoteValueKey="id"
                      remoteShowKey="label"
                      :multiple="false"
                      :relation="true"
                      :placeholder="$t('base.placeholder')"
                      @change="fiduciaryChange"
                      key="key19"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <LFormtTitle label="具体地址">
                    <el-input v-model="concatForm.contactDetailAddress"
                              style="line-height: 34px;width:100%"
                              placeholder="请输入">
                    </el-input>
                  </LFormtTitle>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" class="float-right" plain @click="cancel" style="margin-left:13px">取消
                  </el-button>
                  <el-button type="primary" class="primary-button float-right" @click="addConfirm">添加</el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>-->
          <div class="zhezhao width100" v-if="isVisible"></div>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import leftTabs from "@/components/LSideTabs.vue";
  //import leftList from "@/views/patientMaster/cardsRecord/components/leftListNew.vue";
  import leftList from "@/views/patientMaster/cardsRecord/components/leftList.vue";
  import LSideTab from "@/views/components/LSideTab";
  import {addArchive, getArchive, swipe, verification, getAgeByBirthDate, sendMsg} from '@/api/arch/arch';

  export default {
    name: "index",
    components: {
      leftList,
      leftTabs,
      LSideTab
    },
    data() {
      let postCodeValidate = (rule, value, callback) => {
        if (value == '' || value == undefined) {
          callback();
        } else if (value.length === 6) {
          callback();
        } else {
          this.$message.error('邮编长度应该为6');
          callback(new Error('邮编长度应该为6'));
        }
      };
      //手机号码
      let mobileNumValidate = (rule, value, callback) => {
        if (!value) {
          callback();
        } else if (value.length != 11) {
          this.setTimeOuts(0);
          this.$message.error('手机号码应该等于11位');
          callback(new Error('手机号码应该等于11位'));
        } else if (value != parseInt(value)) {
          this.setTimeOuts(0);
          this.$message.error('手机号码应该数字');
          callback(new Error('手机号码应该数字'));
        } else {
          callback();
        }
      };
      //联系方式（手机或者座机）
      let concatPhone = (rule, value, callback) => {
        if (!value) {
          callback();
        } else if (value.length != 11 && value.length != 7) {
          this.$message.error('联系方式应该等于7位或者11位');
          callback(new Error('联系方式应该等于7位或者11位'));
        } else if (value != parseInt(value)) {
          this.$message.error('联系方式应该数字');
          callback(new Error('联系方式应该数字'));
        } else {
          callback();
        }
      };
      //联系方式（手机或者座机）
      let concatPhoneArch = (rule, value, callback) => {
        if (!value) {
          this.$message.error('联系方式不能为空');
          callback(new Error('联系方式不能为空'));
        } else if (value.length != 11 && value.length != 7) {
          this.$message.error('联系方式应该等于7位或者11位');
          callback(new Error('联系方式应该等于7位或者11位'));
        } else if (value != parseInt(value)) {
          this.$message.error('联系方式应该数字');
          callback(new Error('联系方式应该数字'));
        } else {
          callback();
        }
      };
      //卡号校验
      let identifyValidate = (rule, value, callback) => {
        if (!value) {
          if (this.recordForm.identificationType != '') {
            this.$message.error('请填写卡号');
            callback(new Error('请填写卡号'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      //卡类型校验
      let identifyTypeValidate = (rule, value, callback) => {
        if (!value) {
          if (this.recordForm.identificationNum != '') {
            this.$message.error('请选择卡片类型');
            callback(new Error('请选择卡片类型'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      };
      //姓名校验
      let patientNameValidate = (rule, value, callback) => {
        let numRule = /[0-9]/;
        if (value) {
          if (numRule.test(value)) {
            this.$message.error('姓名不允许包括数字');
            callback(new Error('姓名不允许包括数字'));
          } else {
            callback();
          }
        }
      };

      let archIdentifyTypeValidate = (rule, value, callback) => {
        if (!value) {
          this.$message.error('请填写担保人身份证号');
          callback(new Error('请填写担保人身份证号'));
        } else {
          callback();
        }
      };

      let archGIdentifyTypeValidate = (rule, value, callback) => {
        if (!value) {
          this.$message.error('请填写监护人身份证号');
          callback(new Error('请填写监护人身份证号'));
        } else {
          callback();
        }
      };
      return {
        toolBoxs: ["silimarRecord", "Hotkey"],
        formParams: ['timeRange', 'recordStatus', 'search'],
        leftTabsValue: {},
        searchType1: '',
        tabsName: [{
          label: '患者列表',
          value: 'first'
        }],
        //form表单
        recordForm: {
          headImg: '',
          realNameSystem: '0',
          patientName: '',
          patientFullName: '',
          patientGender: '',
          patientAge: '',
          mobileNum: '',//手机号
          otherMobileNum: '',
          email: '',
          birthDate: '',
          birthTime: '',
          identificationType: '1',
          identificationNum: '',
          insuranceType: '',//医保类型
          nativePlaceCode: '',//籍贯
          EMPId: '',//EMPId
          illNess: '',
          bloodType: '',
          countryCode: '',
          nationCode: '',
          maritalStatus: '',
          domicile: '',//户籍地址
          domicileAddress: '',//户籍具体地址
          domicilePostCode: '',//户籍地址邮编
          domicileName: '',//地址名称
          addressName: '',//联系地址名称

          address: '',//联系地址
          detaiAddress: '',//联系具体地址
          addressPostCode: '',//联系地址邮编
          careerCode: '',//职业
          company: '',//工作单位
          officeTel: '',//单位电话
          archFiduciaryList: [],
          archGuarantorList: [],
          isanamnesis: false,//是否慢性病
          anamnesis: '',//慢性病名称
          settlementType: '',//结算类型
          settlementCompany: '',//结算单位
          socialSecurity: '',//社保类型
          bookbuildingType: '',//建档类型
          cardAssociated: '',//关联卡
          fileLoading: '',//档案状态
          healthCard: '',//居民健康卡
          SINCardNo: '',//社保卡号
          militaryOfficer: '',//军官证
          drivingLicence: '',//驾驶证
          studyLicence: '',//学生证
          patientId: '',
          msgCode: ''//手机验证码
        },
        //给leftlist传输的search条件
        param: {},
        searchType: '',
        moreList: ["settlementType", "settlementCompany", "socialSecurity", "bookbuildingType", "fileLoading"],//"cardAssociated",
        moreListName: {
          settlementType: '结算类型',
          settlementCompany: '结算单位',
          socialSecurity: '社保类型',
          bookbuildingType: '建档类型',
          fileLoading: '档案状态'
        },
        cardList: ["healthCard", "SINCardNo", "militaryOfficer", "drivingLicence", "studyLicence"],
        cardListName: {
          healthCard: '居民健康卡',
          SINCardNo: '社保卡号',
          militaryOfficer: '军官证',
          drivingLicence: '驾驶证',
          studyLicence: '学生证'
        },
        //l-value-domin组件code码
        selectCode: {
          countryCode: 'WORLD_REGIONAL_NAME_CODE',//国家
          patientGender: 'GENDER_CODE', // 性别
          identificationType: 'MARK_TYPE_CODE',//卡类型
          bloodType: 'BLOOD_TYPE_CODE',//血型
          maritalStatus: 'MARITAL_STATUS_CODE',
          nativePlaceCode: 'AdministrativDivision',
          nationCode: 'NATIONAL_NAME_CODE',
          domicile: 'AdministrativDivision',
          address: 'AdministrativDivision',
          careerCode: 'OCCUPATIONAL_CLASSIFICATION_CODE',
          // settlementType: 'MEDICAL_INSURANCE_CODE',
          settlementType: 'settlementType',
          settlementCompany: 'settlementCompany',
          socialSecurity: 'socialSecurity',
          bookbuildingType: 'bookbuildingType',
          cardAssociated: 'clinictype',
          fileLoading: 'ARCH_STATUS',
          type: 'contactType',
          relationShip: 'RELATION_CODE'
        },
        //新增联系人表单
        /*concatForm: {
          type: '',
          fiduciaryName: '',
          relationShip: '',
          identificationNum: '',
          identityNumber: '',
          contactAddress: '',
          contactDetailAddress: ''
        },*/
        rules: {
          patientName: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {validator: patientNameValidate, trigger: "blur"}
          ],
          patientGender: [{required: true, message: '请选择性别', trigger: 'change'}],
          birthDate: [{required: true, message: '请选择出生日期', trigger: 'change'}],
          fiduciaryName: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {validator: patientNameValidate, trigger: "blur"}
          ],
          mobileNum: [{validator: mobileNumValidate, trigger: "blur"}],
          otherMobileNum: [{validator: concatPhone, trigger: "blur"}],
          officeTel: [{validator: concatPhone, trigger: "blur"}],
          phone: [{validator: concatPhone, trigger: "blur"}],
          domicilePostCode: [{validator: postCodeValidate, trigger: 'blur'}],
          addressPostCode: [{validator: postCodeValidate, trigger: 'blur'}],
          identificationNum: [{validator: identifyValidate, trigger: 'blur'}],
          identificationType: [{validator: identifyTypeValidate, trigger: 'change'}],
          archIdentificationNum: [{validator: archIdentifyTypeValidate, trigger: 'blur'}],
          archGIdentificationNum: [{validator: archGIdentifyTypeValidate, trigger: 'blur'}],
          archPhone: [{validator: concatPhoneArch, trigger: 'blur'}]
          // ,archGPhone: [{validator: concatPhoneArch, trigger: 'blur'}]
        },
        // visible: false,
        // isAdd: false,
        // editIndex: 0,
        //搜索的患者信息结果
        patientInfo: {},
        //表单只读
        isVisible: true,

        //户籍地址省市区
        domicileArea: {
          province: '',
          city: '',
          district: ''
        },

        //联系地址省市区
        contactArea: {
          province: '',
          city: '',
          district: ''
        },
        /*fiduciaryArea: {
          province: '',
          city: '',
          district: ''

        },*/
        nativePlaceArea: {
          province: '',
          city: '',
          district: ''

        },
        //日期只可以选当前日期
        expireTimeOption: {
          disabledDate(date) {
            return date.getTime() > Date.now();
          }
        },
        birthTimeOption: {
          selectableRange: '00:00:00 - 23:59:59'
        },
        isRealNameSystem: true,
        initMobileNum: '',//初始化页面手机号
        veriCodeMsg: '发送验证码',
        veriCodeDisabled: false,
        timer: null,//定时器
        identificationNumDisabled: false,

        form: {
          reservation: 0,
          recordStatus: '',
          timeRange: []
        }
      }
    },
    provide() {
      return {
        getIsCreatRecordBtn: () => 0// 是否建档按钮:1为有;0为无
      };
    },
    computed: {
      ...mapGetters("patientMaster", ["receivePatientData", "patientListData"])
    },
    watch: {
      "receivePatientData": {
        handler(n) {
          this.setTimeOuts(0);
          this.$nextTick(() => {
            this.$refs['recordForm'].resetFields();
            this.recordForm.archFiduciaryList = [];
            this.recordForm.archGuarantorList = [];
            this.recordForm.realNameSystem = '0';
            this.isRealNameSystem = true;
            this.identificationNumDisabled = false;
            this.areaReaet();
            this.initMobileNum = '';

            if (n.patientId) {
              this.getPatientInfo();
            } else if (n.cardType) {
              if (n.cardId && n.cardType === '1') {
                this.recordForm.identificationType = this.receivePatientData.cardType;
                this.recordForm.identificationNum = this.receivePatientData.cardId;
                this.identifiBlur();
              }
            }
          });
        },
        immediate: true,
        deep: true
      },
      'patientListData': {
        async handler(n) {
          this.leftTabsValue = {};
          this.searchType1 = '';
          this.isVisible = false;
          if (JSON.stringify(n) !== "{}") {
            this.leftTabsValue = n.leftTabsValue;
            this.searchType1 = n.searchType;
            this.$nextTick(() => {
              /*if (n.patientList.length > 0) {
                this.isVisible = false;
              } else {
                if(!this.receivePatientData.patientId && this.receivePatientData.cardType != '0'){
                  // this.$refs['recordForm'].resetFields();
                  this.recordForm.archFiduciaryList = [];
                  this.recordForm.archGuarantorList = [];
                  this.recordForm.realNameSystem = '0';
                  // this.recordForm.domicile = [];
                  if (n.searchType == 'readCard') {
                    //卡号回填
                    if (this.receivePatientData.cardId && this.receivePatientData.cardType == '1') {
                      this.recordForm.identificationType = this.receivePatientData.cardType;
                      this.recordForm.identificationNum = this.receivePatientData.cardId;
                      this.identifiBlur();
                    } else {
                      // this.$refs['recordForm'].resetFields();
                    }
                    this.isVisible = false;
                  } else {
                    this.isVisible = true;
                  }
                }else{
                  this.isVisible = false;
                }
              }*/
              this.$refs['recordForm'].resetFields();
              this.recordForm.archFiduciaryList = [];
              this.recordForm.archGuarantorList = [];
              this.recordForm.realNameSystem = '0';
              this.isRealNameSystem = true;
              /*this.recordForm.nativePlaceCode = '';
              this.nativePlaceArea = {
                province: '',
                city: '',
                district: ''
              };*/
              this.areaReaet();
              this.initMobileNum = '';
              if (n.patientList.length > 0) {
                if (n.clear == '2') {
                  this.recordForm = {...this.receivePatientData};
                } else if (n.clear == '1') {
                  if (this.receivePatientData.patientId) {
                    this.getPatientInfo();
                  } else if (this.receivePatientData.cardId && this.receivePatientData.cardType == '1') {
                    //卡号回填
                    this.recordForm.identificationType = this.receivePatientData.cardType;
                    this.recordForm.identificationNum = this.receivePatientData.cardId;
                    // this.isRealNameSystem = false;
                    this.initMobileNum = '';
                    this.identifiBlur();
                  }
                }
              } else {
                // debugger
                if (n.clear == '1') {
                  this.$refs['recordForm'].resetFields();
                  this.recordForm.archFiduciaryList = [];
                  this.recordForm.archGuarantorList = [];
                  this.recordForm.realNameSystem = '0';
                  this.isRealNameSystem = true;
                  /*this.recordForm.nativePlaceCode = '';
                  this.nativePlaceArea = {
                    province: '',
                    city: '',
                    district: ''
                  };*/
                  this.areaReaet();
                  if (n.searchType == 'searchButton') {
                    this.isVisible = true;
                  } else if (n.searchType == 'readCard') {
                    if (this.receivePatientData.cardId && this.receivePatientData.cardType == '1') {
                      //卡号回填
                      this.recordForm.identificationType = this.receivePatientData.cardType;
                      this.recordForm.identificationNum = this.receivePatientData.cardId;
                      // this.isRealNameSystem = false;
                      this.initMobileNum = '';
                      this.identifiBlur();
                    }
                  }
                }
              }
            })
          } else {
            this.leftTabsValue = {};
            this.searchType1 = '';
            /*this.leftTabsValue = {
              timeRange: [this.getFormatDate(new Date()), this.getFormatDate(new Date())]
            };
            this.search(this.leftTabsValue);*/
            this.search(this.leftTabsValue);
          }
        },
        deep: true,
        immediate: true
      }
    },
    created() {
      // console.log(this.getFormatDate(new Date()));
      this.sideEvent('query');
    },
    methods: {
      ...mapActions({
        changeSimilarRecordData: 'patientMaster/changeSimilarRecordData'
      }),
      identificationNumFun(item){
          if(item.length < 18){
            this.$message.error("身份证号请输入十八位")
          }
      },
      //子组件抛出的方法
      sideEvent(sideEvent) {
        if(!this.form.timeRange){
            this.form.timeRange = [];
        };
        let obj = {
          query: 'getPatientList',
          readCard: 'readCard',
          createRecord: 'createRecord'
        };
        console.log("this.form",this.form);
        this.$nextTick(() => {
          this.$refs.leftList[obj[sideEvent]](this.form);
        });
      },
      //工具箱
      messageHandler() {
        console.log('工具箱');
      },
      //左侧列表转换tab
      handleClick(tabs) {
      },
      //element组件input无法输入问题
      inputChange(e) {
        this.$forceUpdate();
      },
      // 查询方法
      search(form) {
        // console.log(form);
        delete form["startTimeRange"];
        delete form["endTimeRange"];
        if (form.timeRange != null && form.timeRange.length > 1) {
          form["startTimeRange"] = form.timeRange[0];
          form["endTimeRange"] = form.timeRange[1];
        }
        this.param = {
          ...form,
          date: new Date()
        };
        this.searchType = 'searchButton';
      },
      // 读卡方法
      readCard(form) {
        let clearData = '1';
        if (this.patientListData.patientList.length > 0 && this.patientListData.clear == '2') {
          clearData = '2';//不清
        }
        this.param = {
          cardId: form.search,
          date: new Date(),
          clearData: clearData
        };
        this.searchType = 'readCard';
      },

      //获取病人档案
      async getPatientInfo() {

        /* if (this.$refs['recordForm']) {
           this.$refs['recordForm'].resetFields();
           this.recordForm.archFiduciaryList = [];
           this.recordForm.archGuarantorList = [];
         }*/

        let _self = this;
        try {
          //获取数据接口
          if (this.receivePatientData.patientId && this.receivePatientData.patientId.length > 0) {
            let res = await getArchive(this.receivePatientData.patientId);
            let patientData = {};
            // console.log(res.data);
            // debugger
            if (res.code == '1') {
              //初始化手机号码
              this.initMobileNum = res.data.archInfo.mobileNum || '';
              patientData = {
                patientId: res.data.archInfo.patientId,
                headImg: require('@/assets/pojehjdz.jpeg'),
                patientName: res.data.archInfo.patientName,
                patientFullName: res.data.archInfo.patientFullName,
                patientGender: res.data.archInfo.patientGender + "",
                patientAge: res.data.archInfo.patientAge,
                mobileNum: res.data.archInfo.mobileNum,
                otherMobileNum: res.data.archInfo.otherPhoneNum,
                email: '',
                birthDate: res.data.archInfo.birthDate,
                birthTime: res.data.archInfo.birthTime,
                identificationType: res.data.archInfo.identificationType,//卡类型
                identificationNum: res.data.archInfo.identificationNum,
                //insuranceType: '城镇居民保险',//医保类型

                EMPId: res.data.archInfo.patientCode,//EMPId
                illNess: '',
                bloodType: res.data.archInfo.bloodType,
                nationCode: res.data.archInfo.nationCode,
                maritalStatus: res.data.archInfo.maritalStatus,
                archFiduciaryList: [],
                archGuarantorList: [],
                isanamnesis: false,//是否慢性病
                anamnesis: '',//慢性病名称
                realNameSystem: res.data.archInfo.realNameStatus,
                dataVersion: res.data.archInfo.dataVersion,
                countryCode: res.data.archInfo.nationalityCode,
                msgCode: ''
              };


              //籍贯
              patientData["nativePlaceCode"] = [];
              if (res.data.archInfo.nativePlaceCode) {
                res.data.archInfo.nativePlaceCode.split(",").forEach(function (item) {
                  if (item.length > 0) {
                    patientData["nativePlaceCode"].push(parseInt(item));
                  }
                });
              }


              this.nativePlaceArea = {
                province: patientData["nativePlaceCode"][0],
                city: patientData["nativePlaceCode"][1],
                district: patientData["nativePlaceCode"][2]

              };


              if (res.data.archCompany) {

                patientData["careerCode"] = res.data.archCompany.careerCode;
                patientData["company"] = res.data.archCompany.companyName;
                patientData["officeTel"] = res.data.archCompany.companyTel;

              }


              res.data.archGuarantorList.forEach(function (item) {

                let contactAddress = [];

                contactAddress.push(parseInt(item.province));
                contactAddress.push(parseInt(item.city));
                contactAddress.push(parseInt(item.district));

                patientData.archGuarantorList.push({
                  type: "1",
                  fiduciaryName: item.guarantorName,
                  identificationNum: item.guarantorIdentificationNum,
                  relationShip: item.guaranteeRelation,
                  phone: item.guarantorPhone,
                  contactDetailAddress: item.guarantorAddress,
                  id: item.id,
                  dataVersion: item.dataVersion,
                  contactAddress: contactAddress,
                  fiduciaryArea: {
                    province: item.province,
                    city: item.city,
                    district: item.district

                  }
                });


              });

              res.data.archFiduciaryList.forEach(function (item) {

                let contactAddress = [];

                contactAddress.push(parseInt(item.province));
                contactAddress.push(parseInt(item.city));
                contactAddress.push(parseInt(item.district));

                patientData.archFiduciaryList.push({
                  type: "2",
                  fiduciaryName: item.fiduciaryName,
                  identificationNum: item.identityNumber,
                  relationShip: item.relationShip,
                  phone: item.fiduciaryTel,
                  contactDetailAddress: item.address,
                  id: item.id,
                  dataVersion: item.dataVersion,
                  contactAddress: contactAddress,
                  fiduciaryArea: {
                    province: item.province,
                    city: item.city,
                    district: item.district
                  }

                });
              });

              /*  联系地址*/
              res.data.archAddrList.forEach(function (item) {

                if (item.addrType == 1) {
                  patientData["domicile"] = [];
                  patientData["domicile"].push(parseInt(item.addrProvince));
                  if (item.addrCity.length > 0) {
                    patientData["domicile"].push(parseInt(item.addrCity));
                  }
                  if (item.addrDistrict.length > 0) {
                    patientData["domicile"].push(parseInt(item.addrDistrict));
                  }
                  patientData["domicileAddress"] = item.detailAddr;
                  patientData["domicilePostCode"] = item.postCode;
                  patientData["domicileID"] = item.id;
                  patientData["domicileDV"] = item.dataVersion;
                  _self.domicileArea = {
                    province: item.addrProvince,
                    city: item.addrCity,
                    district: item.addrDistrict

                  }
                }
                if (item.addrType == 2) {
                  patientData["address"] = [parseInt(item.addrProvince), parseInt(item.addrCity), parseInt(item.addrDistrict)];
                  patientData["detaiAddress"] = item.detailAddr;
                  patientData["addressPostCode"] = item.postCode;
                  patientData["domicileID"] = item.id;
                  patientData["contactDV"] = item.dataVersion;
                  _self.contactArea = {
                    province: item.addrProvince,
                    city: item.addrCity,
                    district: item.addrDistrict

                  }
                }

              });
              res.data.archExtendList.forEach(function (item) {
                if (item.extendValue && item.extendValue.length > 0) {
                  patientData[item.extendAttr] = item.extendValue;

                }
              })
              /*xy--实名*/
              if (patientData.realNameSystem == '1') {
                // this.isRealNameSystem = true;
                this.isRealNameSystem = false;
              } else {
                // this.isRealNameSystem = false;
                this.isRealNameSystem = true;
                /*if (patientData.identificationType == '1') {
                  this.isRealNameSystem = false;
                } else {
                  this.isRealNameSystem = true;
                }*/
              }
              /*xy--实名*/
            } else {
              this.$message.error(res.message || "获取病人档案失败");
            }

            this.recordForm = {...patientData};
            this.identificationTypeChange();
            this.$hideLoading();
          } else {


            try {
              if (this.receivePatientData.cardType == '1') {
                let ic = this.receivePatientData.cardId;
                this.recordForm.birthDate = ic.substring(6, 10) + "-" + ic.substring(10, 12) + "-" + ic.substring(12, 14);
                this.recordForm.identificationNum = ic;
                this.recordForm.realNameSystem = "1";
              } else {
                this.recordForm.birthDate = ''
                this.recordForm.identificationNum = '';
                this.recordForm.realNameSystem = '0';

              }
            } catch (e) {
            }

          }
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取病人档案失败");
        }
      },
      setTimeOuts(msg) {
        this.veriCodeMsg = msg + 's';
        let _this = this;
        if (msg === 0) {
          _this.veriCodeMsg = '发送验证码';
          _this.veriCodeDisabled = false;
          clearTimeout(_this.timer);
          return;
        }
          _this.veriCodeDisabled = true;
          msg--;
          _this.veriCodeMsg = msg + 's';

          this.timer = setTimeout(function () {
            _this.setTimeOuts(msg);
          }, 1000);

      },
      //发送验证码
      async getVeriCode() {
        let msg = 60;
        this.setTimeOuts(msg);
        let phoneNum = this.recordForm.mobileNum;
        if (!phoneNum) {
          this.$message.error('手机号码不能为空');
        } else if (phoneNum.length != 11) {
          this.$message.error('手机号码应该等于11位');
        } else if (phoneNum != parseInt(phoneNum)) {
          this.$message.error('手机号码应该数字');
        } else {
          // this.$showLoading();
          try {
            let params = {
              patientCode: this.receivePatientData.patientId,
              phoneNum: this.recordForm.mobileNum
            };
            let res = await sendMsg(params);
            if (res.code == '1') {
              this.$message.success("验证码发送成功");
              //将验证码回填到表单
              this.recordForm.msgCode = res.data;
            } else {
              this.$message.error(res.msg || '验证码发送失败');
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || '验证码发送失败');
          }
        }
      },
      //删除联系人
      deleteContact(item, index) {
        // this.$confirm('此操作将永久删除该联系人, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        if (item.type == '1') {
          let propsRefieds = [];
          let archGuarantorList = [...this.recordForm.archGuarantorList];
          for (let i in archGuarantorList) {
            propsRefieds.push('archGuarantorList.' + index + '.fiduciaryName');
            propsRefieds.push('archGuarantorList.' + index + '.identificationNum');
            propsRefieds.push('archGuarantorList.' + index + '.phone');
          }
          this.$refs['recordForm'].clearValidate(propsRefieds);
          this.$delete(archGuarantorList, index);
          this.recordForm.archGuarantorList = [...archGuarantorList];
        } else {
          let propsRefieds1 = [];
          let archFiduciaryList = [...this.recordForm.archFiduciaryList];
          for (let i in archFiduciaryList) {
            propsRefieds1.push('archFiduciaryList.' + index + '.fiduciaryName');
            propsRefieds1.push('archFiduciaryList.' + index + '.identificationNum');
            propsRefieds1.push('archFiduciaryList.' + index + '.phone');
          }
          this.$refs['recordForm'].clearValidate(propsRefieds1);
          this.$delete(archFiduciaryList, index);
          this.recordForm.archFiduciaryList = [...archFiduciaryList];
        }
        // });
      },
      //提交表单
      submit() {

        this.$refs['recordForm'].validate(async (valid) => {
          if (valid) {
            if(this.recordForm.identificationType == '1'){
              if(this.recordForm.identificationNum.length < 18){
                  this.$message.error("身份证号不得少于18位")
                  return false
              }
            }else if(this.recordForm.identificationType){
              if(this.recordForm.identificationNum.length < 18){
                  this.$message.error("卡号不得为空")
                  return false
              }
            }else{
              this.$message.error("请选择卡的类型")
              return false
            }

            this.$showLoading();
            try {
              //保存表单接口接口

              let archData = this.assemblyPatientInfo();

              //if(archData.)
              let result = await addArchive(archData);
              // console.log(result);

              if (result.code == 1) {
                this.$message.success("档案已保存");
                // this.receivePatientData.patientId = result.data.PK_ID;
                //请求新信息
                // this.getPatientInfo();
                //请求左边列表
                // debugger
                this.areaReaet();
                this.sideEvent('query');
                if (this.searchType1 == 'readCard') {
                  // if (this.patientListData.patientList.length > 0) {
                  //读卡建档
                  this.param = {...this.leftTabsValue};
                  // }
                  this.searchType = 'readCard';
                  this.param.date = new Date();
                  this.param.cardId = this.param.search;
                  this.param.clearData = '1';
                } else if (this.searchType1 == 'searchButton') {
                  this.searchType = 'searchButton';
                  this.param = {...this.leftTabsValue};
                  this.param.date = new Date();
                }
              } else {
                this.$message.error(result.msg || '保存失败')
              }
              this.$hideLoading();
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "保存失败");
            }
          } else {
            // this.$message.error("请填入必填信息");
          }
        });
      },

      //取消提交
      async cancelClear() {
        this.$refs['recordForm'].resetFields();
        this.recordForm.archFiduciaryList = [];
        this.recordForm.archGuarantorList = [];
        this.recordForm.realNameSystem = '0';
        this.isRealNameSystem = true;
        this.recordForm.nativePlaceCode = '';
        this.nativePlaceArea = {
          province: '',
          city: '',
          district: ''
        };
        if (this.patientListData.clear == '2') {
          this.recordForm = {...this.receivePatientData};
        } else if (this.patientListData.clear == '1') {
          if (this.receivePatientData.patientId) {
            this.getPatientInfo();
          } else if (this.receivePatientData.cardId && this.receivePatientData.cardType == '1') {
            this.recordForm.identificationType = this.receivePatientData.cardType;
            this.recordForm.identificationNum = this.receivePatientData.cardId;
          }
        }
      },
      areaReaet() {
        this.domicileArea = {
          province: '',
          city: '',
          district: ''
        };
        this.recordForm.domicileName = '';
        this.contactArea = {
          province: '',
          city: '',
          district: ''
        };
        this.recordForm.addressName = '';
        this.nativePlaceArea = {
          province: '',
          city: '',
          district: ''
        };
        this.nativePlaceArea.province = '';
        this.nativePlaceArea.city = '';
        this.nativePlaceArea.district = '';
      },
      //户籍地址监听
      domicileChange(value, curItem) {

        this.domicileArea = {
          province: '',
          city: '',
          district: ''
        };
        this.recordForm.domicileName = '';
        //联系地址省市区


        if (value[0]) {
          this.domicileArea.province = value[0];
          this.recordForm.domicileName = curItem[0].label;
        }
        if (value[1]) {
          this.domicileArea.city = value[1];
          this.recordForm.domicileName = this.recordForm.domicileName + ' ' + curItem[1].label;
        }

        if (value[2]) {
          this.domicileArea.district = value[2];
          this.recordForm.domicileName = this.recordForm.domicileName + '' + curItem[2].label;

        }
      },
      //联系地址监听
      contactChange(value, curItem) {
        this.contactArea = {
          province: '',
          city: '',
          district: ''
        };
        this.recordForm.addressName = '';

        // debugger;
        if (value[0]) {
          this.contactArea.province = value[0];
          this.recordForm.addressName = curItem[0].label;
        }
        if (value[1]) {
          this.contactArea.city = value[1];
          this.recordForm.addressName = this.recordForm.addressName + ' ' + curItem[1].label;

        }
        if (value[2]) {

          this.contactArea.district = value[2];
          this.recordForm.addressName = this.recordForm.addressName + ' ' + curItem[2].label;

        }
      },
      nativePlacecChange(value, curItem) {
        this.nativePlaceArea = {
          province: '',
          city: '',
          district: ''
        };
        if (value[0]) {
          this.nativePlaceArea.province = value[0];
        }
        if (value[1]) {
          this.nativePlaceArea.city = value[1];
        }
        if (value[2]) {

          this.nativePlaceArea.district = value[2];
        }
      },
      //担保人地址监听
      /*fiduciaryChange(value, curItem) {
        if (value[0]) {
          this.fiduciaryArea.province = value[0];
        }
        if (value[1]) {
          this.fiduciaryArea.city = value[1];
        }
        if (value[2]) {
          this.fiduciaryArea.district = value[2];
        }
      },*/
      assemblyPatientInfo() {

        let _self = this;
        /*保存档案信息*/
        let archiveData = {};
        /* 卡*/
        archiveData["archCardList"] = [];
        // console.log(this.receivePatientData);

        archiveData.archCardList[0] = {

          "cardData": this.receivePatientData.cardId
        };


        archiveData["archAddrList"] = [];
        /* 户籍地址*/
        if (this.recordForm.domicileAddress != '' || this.recordForm.domicile != '' || this.recordForm.domicilePostCode != '') {
          archiveData["archAddrList"].push({
            "detailAddr": this.recordForm.domicileAddress,
            "addrProvince": this.domicileArea.province,
            "addrCity": this.domicileArea.city,
            "addrDistrict": this.domicileArea.district,
            "addrType": "1",
            "postCode": this.recordForm.domicilePostCode,
            dataVersion: this.recordForm.domicileDV,
            "contactAddress": this.recordForm.domicileName + ' ' + this.recordForm.domicileAddress

          });
        }

        /* 联系地址*/
        if (this.recordForm.address != '' || this.recordForm.detaiAddress != '' || this.recordForm.addressPostCode != '') {
          archiveData["archAddrList"].push({
            "detailAddr": this.recordForm.detaiAddress,
            "addrProvince": this.contactArea.province,
            "addrCity": this.contactArea.city,
            "addrDistrict": this.contactArea.district,
            "addrType": "2",
            "postCode": this.recordForm.addressPostCode,
            dataVersion: this.recordForm.contactDV,
            "contactAddress": this.recordForm.addressName + ' ' + this.recordForm.detaiAddress


          });
        }

        /* 担保人*/
        archiveData["archGuarantorList"] = [];


        this.recordForm.archGuarantorList.forEach(function (item) {
          if (item.fiduciaryName != '') {
            archiveData["archGuarantorList"].push({
              "guarantorName": item.fiduciaryName,
              "guarantorAddress": item.contactDetailAddress,
              "guaranteeRelation": item.relationShip,
              "contactAddress": item.contactAddress,
              "guarantorIdentificationNum": item.identificationNum,
              "guarantorIdentificationType": 1,
              guarantorPhone: item.phone,
              city: item.contactAddress[1] || '',
              province: item.contactAddress[0] || '',
              district: item.contactAddress[2] || '',
              dataVersion: item.dataVersion


            })

          }
        });
        /* 监护人 */
        archiveData["archFiduciaryList"] = [];
        this.recordForm.archFiduciaryList.forEach(function (item) {
          archiveData["archFiduciaryList"].push({
            "fiduciaryName": item.fiduciaryName,
            "identityNumber": item.identificationNum,
            "address": item.contactDetailAddress,
            "relationShip": item.relationShip,
            "contactAddress": item.contactAddress,
            fiduciaryTel: item.phone,
            city: item.contactAddress[1] || '',
            province: item.contactAddress[0] || '',
            district: item.contactAddress[2] || '',
            dataVersion: item.dataVersion


          })
        });


        archiveData["archExtendList"] = [];
        this.moreList.forEach(function (item) {
          console.log(item)
          archiveData["archExtendList"].push({
            "extendValue": _self.recordForm[item],
            "extendAttr": item,
            "extendType": 1,
            "extendName": _self.moreListName[item]
          });
        })

        this.cardList.forEach(function (item) {
          // console.log(item)
          archiveData["archExtendList"].push({
            "extendValue": _self.recordForm[item],
            "extendAttr": item,
            "extendType": 1,
            "extendName": _self.cardListName[item]
          });
        })


        /*
                        /!* 联系人*!/
                        let archContactList = [];
                        this.recordForm.contactForm.forEach(function (item) {
                            if (item.contactName != '' || item.contactTel != '' || item.relation != '') {
                                archContactList.push({
                                    "contactName": item.contactName,
                                    "contactTel": item.contactTel,
                                    "relation": item.relation
                                });
                            }
                        });
                        if (archContactList.length > 0) {
                            archiveData["archContactList"] = archContactList;
                        }*/


        archiveData["archCompany"] = {

          "careerCode": this.recordForm.careerCode,
          "companyName": this.recordForm.company,
          "companyTel": this.recordForm.officeTel

        }

        /* 患者基本信息*/
        // console.log(this.recordForm.birthDate);
        archiveData["archInfo"] = {
          "appCode": "",
          "appType": "",
          "birthDate": this.recordForm.birthDate,
          "birthTime": this.recordForm.birthTime,
          "patientId": this.receivePatientData.patientId || '',
          "enableType": '',
          "firstCategory": '',
          "firstDiagTime": '',
          "guarantorEnable": '0',
          "idNumEnable": '0',
          "identificationNum": this.recordForm.identificationNum,
          // "identificationType": this.receivePatientData.cardType,
          "identificationType": this.recordForm.identificationType,
          "lastCategory": '', /*todo 末次诊疗类型*/
          "lastDate": '',/*todo 末次诊疗时间*/
          "maritalStatus": this.recordForm.maritalStatus,
          "mobileNum": this.recordForm.mobileNum,
          "msgCode": this.recordForm.msgCode,//手机验证码
          "namePy": '',/*todo 后台处理*/
          "nameWb": '',/*todo 后台处理*/
          "nationCode": this.recordForm.nationCode,
          "nationalityCode": this.recordForm.countryCode || '',//国籍代码
          "otherPhoneNum": this.recordForm.otherMobileNum,
          "patientFullName": this.recordForm.patientFullName,
          "patientGender": this.recordForm.patientGender,
          "patientName": this.recordForm.patientName,
          "patientType": '', /*todo 病人类型是什么*/
          "pauseReason": '',
          "phoneNumEnable": '0',
          "relationStatus": "1",
          "settlementCompanyCode": '',
          "settlementType": '',
          "siTypeCode": '',
          "smsCaptcha": '',
          "bloodType": this.recordForm.bloodType,
          "remarks": "",//this.recordForm.note,
          "realNameStatus": this.recordForm.realNameSystem,
          "dataVersion": this.recordForm.dataVersion

        }
        //是否验证手机验证码
        let checkMsgCode = 0;
        // debugger
        if (this.recordForm.mobileNum != this.initMobileNum) {
          checkMsgCode = 1;
        }
        archiveData["archInfo"]["checkMsgCode"] = checkMsgCode;

        if (this.nativePlaceArea.province) {

          archiveData["archInfo"]["nativePlaceCode"] = this.nativePlaceArea.province;

          if (this.nativePlaceArea.city) {

            archiveData["archInfo"]["nativePlaceCode"] = archiveData["archInfo"]["nativePlaceCode"] + ',' + this.nativePlaceArea.city
          }

          if (this.nativePlaceArea.district) {

            archiveData["archInfo"]["nativePlaceCode"] = archiveData["archInfo"]["nativePlaceCode"] + ',' + this.nativePlaceArea.district
          }

        }
        return archiveData;


      },
      //相似档案条件
      patientBlur() {
        let form = {
          patientName: this.recordForm.patientName,
          identificationNum: this.recordForm.identificationNum,
          birthDate: this.recordForm.birthDate,
          mobileNum: this.recordForm.mobileNum,
          patientId: this.receivePatientData.patientId || ''
        };
        this.changeSimilarRecordData(form);
      },
      //改变出生日期校验
      birthDateBlur() {
        if (this.recordForm.birthDate != '') {
          //根据出生日期带入年龄
          // this.recordForm.patientAge = this.getAge(this.recordForm.birthDate);
          this.getAgeByBirthDate();
        } else {
          this.recordForm.patientAge = '';
        }
        //获取相似档案信息
        this.patientBlur();
      },
      //卡类别校验
      identificationTypeChange() {
        if (this.recordForm.identificationType == '20' && this.receivePatientData.identificationType == '20') {
          this.recordForm.identificationNum = this.receivePatientData.cNum;
          this.identificationNumDisabled = true;
        } else {
          this.identificationNumDisabled = false;
        }
        if (this.recordForm.identificationType == '1') {
          if (this.receivePatientData.identificationType == '1') {
            this.recordForm.identificationNum = this.receivePatientData.identificationNum;
            this.identificationNumDisabled = true;
          } else {
            this.identificationNumDisabled = false;
          }
          // this.isRealNameSystem = false;
        } else {
          this.recordForm.realNameSystem = '0';
          // this.isRealNameSystem = true;
          this.identificationNumDisabled = false;
        }
      },
      //身份证号码校验
      identifiBlur() {
        if (this.recordForm.identificationType == '1' && this.recordForm.identificationNum.length === 18) {
          //获取身份证中的性别
          let isGender = parseInt(this.recordForm.identificationNum.substr(16, 1)) % 2;
          if (isGender == 1) {
            this.recordForm.patientGender = '1';
          } else {
            this.recordForm.patientGender = '2';
          }
          if (this.recordForm.birthDate) {
            //根据出生日期带入年龄
            // this.recordForm.patientAge = this.getAge(this.recordForm.birthDate.slice(0, 10));
            this.getAgeByBirthDate();
          } else {
            //根据身份证号带入出生日期与年龄
            let str = this.recordForm.identificationNum.slice(6, 14);
            let birthDate = str.slice(0, 4) + '-' + str.slice(4, 6) + '-' + str.slice(6, 8);
            if (Number(str).toString().length == 8) {
              this.recordForm.birthDate = birthDate;
              /*let age = this.getAge(birthDate);
              this.recordForm.patientAge = age;*/
              this.getAgeByBirthDate();
            }
          }
        }else{
          if(this.recordForm.identificationType == '1' && this.recordForm.identificationNum.length > 0){
             this.$message.error("身份证号不得少于18位")
          }
        }
        //获取相似档案信息
        this.patientBlur();
      },
      //验证身份证号
      async verify() {
        //获取身份证中的性别
        /*if (this.recordForm.identificationNum.length === 18) {
          let isGender = parseInt(this.recordForm.identificationNum.substr(16, 1)) % 2;
          if (isGender == 1) {
            this.recordForm.patientGender = '1';
          } else {
            this.recordForm.patientGender = '2';
          }
        }*/
        //读卡获取是否为实名制
        /*try {
          let result = await swipe({cardNum: this.recordForm.identificationNum});
          if (result.code == '1') {
            if (result.data.cardType == '1') {
              this.recordForm.realNameSystem = '1';
            } else {
              this.recordForm.realNameSystem = '0';
            }
          } else {
            this.$message.error(result.message || "验证失败");
          }
        } catch (error) {
          this.$message.error(error.msg || "验证失败");
        }*/
        try {
          let param = {
            patientId: this.receivePatientData.patientId,
            identificationType: this.recordForm.identificationType,
            identificationNum: this.recordForm.identificationNum
          };
          let result = await verification(param);
          if (result.code == '1') {
            this.$message.success("实名认证成功");
            // this.recordForm.realNameSystem = '1';
            // this.isRealNameSystem = true;
            //刷新档案
            // this.getPatientInfo();
            //刷新左侧列表
            this.areaReaet();
            this.sideEvent('query');
            if (this.searchType1 == 'readCard') {
              // if (this.patientListData.patientList.length > 0) {
              //读卡建档
              this.param = {...this.leftTabsValue};
              // }
              this.searchType = 'readCard';
              this.param.date = new Date();
              this.param.cardId = this.param.search;
              this.param.clearData = '1';
            } else if (this.searchType1 == 'searchButton') {
              this.searchType = 'searchButton';
              this.param = {...this.leftTabsValue};
              this.param.date = new Date();
            }
          } else {
            this.$message.error(result.msg || "实名认证失败");
          }
        } catch (error) {
          this.$message.error(error.msg || "实名认失败");
        }
      },
      /*年龄计算*/
      getAge(str) {
        if (str) {
          var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
          if (r == null) {
            return false;
          }
          var d = new Date(r[1], r[3] - 1, r[4]);
          if (d.getFullYear() == r[1] && d.getMonth() + 1 == r[3] && d.getDate() == r[4]) {
            var Y = new Date().getFullYear();
            var M = new Date().getMonth();
            var D = new Date().getDate();
            var T = new Date().getTime();
            // debugger
            if (Math.ceil((T - d.getTime()) / 86400000) <= 28) {
              return Math.ceil((T - d.getTime()) / 86400000) + '天';
            }
            if (M + 1 < r[3]) {
              if (Y - r[1] - 1 > 3) {
                return Y - r[1] - 1 + '岁';
              }
              return Y - r[1] - 1 + '岁' + (M + 13 - r[3]) + '个月';

            }
            if (Y - r[1] - 1 > 3) {
              return Y - r[1] + '岁';
            }
            return Y - r[1] + '岁' + (M + 1 - r[3]) + '个月';

          }
          return '';
        }
        return '';
      },
      /*切割字符串*/
      strSplit(data, sym) {
        if (data) {
          let str = data.split(sym)[0];
          return str;
        }
        return "";
      },
      /*xy--增加联系人或者担保人--新*/
      //新建联系人--默认监护人
      addArchGuarantorList() {
        // debugger
        // let listLength = this.recordForm.archGuarantorList.length;
        // if(listLength == 0 || this.recordForm.archGuarantorList[listLength - 1].fiduciaryName){
        let archGuarantorList = [...this.recordForm.archGuarantorList];
        archGuarantorList.push({
          type: '1',
          fiduciaryName: '',
          identificationNum: '',
          phone: '',
          relationShip: '',
          contactAddress: '',
          contactDetailAddress: ''
        });
        this.recordForm.archGuarantorList = [...archGuarantorList];
        // }else{
        //   this.$message.error('请输入最后一个监护人的姓名');
        // }
      },
      // addArchGuarantorList(){},
      //改变联系人
      concatChange(item, index, info) {
        let changeItem = {...item};
        if (item.type == '1' && info == 'archFiduciaryList') {
          //监护人
          // let listLength1 = this.recordForm.archGuarantorList.length;
          // if(this.recordForm.archGuarantorList[listLength1 - 1].fiduciaryName){
          //   if(changeItem.fiduciaryName){
          //     this.recordForm.archGuarantorList.unshift(changeItem);
          //   }else{
          this.recordForm.archGuarantorList.push(changeItem);
          // }
          this.$delete(this.recordForm.archFiduciaryList, index);
          /* }else{
             this.$message.error('请输入最后一个监护人的姓名');
           }*/
        } else if (item.type == '2' && info == 'archGuarantorList') {
          //担保人
          // let listLength2 = this.recordForm.archFiduciaryList.length;
          // if(this.recordForm.archFiduciaryList[listLength2 - 1].fiduciaryName){
          //   if(changeItem.fiduciaryName){
          //     this.recordForm.archFiduciaryList.unshift(changeItem);
          //   }else{
          this.recordForm.archFiduciaryList.push(changeItem);
          // }
          this.$delete(this.recordForm.archGuarantorList, index);
          // }else{
          //   this.$message.error('请输入最后一个担保人的姓名');
          // }
        }
      },
      //获取年龄接口
      async getAgeByBirthDate() {
        if (this.recordForm.birthDate) {
          if (this.recordForm.birthTime == null) {
            this.recordForm.birthTime = '';
          }
          try {
            let param = {
              birthDate: this.recordForm.birthDate.slice(0, 10) + ' ' + this.recordForm.birthTime
            };
            let res = await getAgeByBirthDate(param);
            if (res.code == '1') {
              this.recordForm.patientAge = res.data;
            }
          } catch (error) {

          }
        }
      },
      //格式化日期
      getFormatDate(d) {
        let year = d.getFullYear();
        let month = this.change(d.getMonth() + 1);
        let day = this.change(d.getDate());
        return year + '-' + month + '-' + day;
      },
      change(t) {
        if (t < 10) {
          return "0" + t;
        }
          return t;

      }
    }
  }

</script>

<style scoped lang="scss">
  .recordCreate {
    overflow-y: auto;

    .card-cont1 {
      height: 100%;
      padding: 20px 0 0 0;

      .form-cont {
        padding: 0 20px 0 20px;

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
            width: 128px;
            height: 128px;
            border: 1px solid $l-color-bgcolor-11;
            margin-left: 20px;
            padding: 3px;

            img {
              width: 120px;
              height: 120px;
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
    margin-bottom: 20px;
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

  .margin-bottom-6 {
    margin-bottom: 6px;
  }
</style>
