<template>
  <div class="width100 height100 filingAndChangeindex">
    <l-layout :toolBoxs="toolBoxs" :defaultToolName="toolBoxs[0]" :boxExpanded="false" @message="messageHandler" pageName="docSubmit">
      <template #list>
        <LSideTabsNew
          @tabs-change="handleClick"
          @addnew="addnewFun"
          ref="child"
          @htmlShowStyleFun="htmlShowStyleFunData"
          @patientListFun="patientListFunData"
          :hiddenStyle = "true"
          searchPlaceholder="姓名/卡号"
          mode="patientMaster"
        ></LSideTabsNew>
      </template>
      <template #content>
        <div class=" bg-contain recordCreate width100 height100">
           <div v-if="htmlShow" class="width100 height100">
           <div class="patient-card">
             <l-patient-card :patientName="recordForm.patientName" :patientAge="recordForm.age" :patientGender="recordForm.patientGender">
               <patient-basic-info :patientInfo="recordForm"></patient-basic-info>
                <div class="readThe" @click="readTheFun">调阅健康档案</div>
             </l-patient-card>

           </div>
          <el-card class="card-cont1 width100 m-contain bottom-con third-con">
            <div class="form-cont height-button-main">
              <el-form ref="recordForm" :model="recordForm" :rules="rules">
                <el-col>
                  <l-card-title><span slot="left">患者基本信息</span></l-card-title>
                </el-col>
                <el-row >

                  <div class="clearfix img-cont">
                    <div class="float-left img-right"><img :src="recordForm.headImg" alt="" /></div>

                    <div class="float-left img-left">
                      <el-row :gutter="8" class="margin-bottom-20">
                        <el-col :span="4" class="width1024-50">
                          <l-formt-title label="姓名" required>
                            <el-form-item prop="patientName">
                              <el-input
                                v-model="recordForm.patientName"
                                style="width:100%"
                                placeholder="请输入姓名"
                                @input="inputChange($event)"
                              ></el-input>
                            </el-form-item>
                          </l-formt-title>
                        </el-col>
                        <el-col :span="4" class="width1024-50">
                          <LFormtTitle label="性别" required>
                            <el-form-item prop="patientGender">
                              <l-value-domain
                                :disabled="disableEditing"
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
                            <el-form-item prop="birthDate">
                              <el-date-picker
                                :disabled="disableEditing"
                                v-model="recordForm.birthDate"
                                type="date"
                                style="width:100%"
                                placeholder="选择日期"
                                @input="inputChange($event)"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                :picker-options="expireTimeOption"
                              ></el-date-picker>
                            </el-form-item>
                          </LFormtTitle>
                        </el-col>
                        <el-col :span="6" class="width1024-33">
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
                        </el-col>
                        <el-col :span="4" class="width1024-33">
                          <LFormtTitle label="年龄">
                            <el-form-item prop="age"><el-input :disabled="disableEditing" v-model="recordForm.age" style="width:100%"></el-input></el-form-item>
                          </LFormtTitle>
                        </el-col>
                      </el-row>
                      <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                        <el-col :span="8" class="width1024-33 paddingLeft">
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
                        </el-col>
                       <!-- <el-col :span="3" class="width1024-33">
                          <el-button class="veri-code width100" type="info" :disabled="veriCodeDisabled">{{ idNumber }}</el-button>
                        </el-col> -->
                        <el-col :span="4" class="width1024-33">
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
                        <el-col :span="4" class="width1024-33 paddingLeft">
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
                        <el-col :span="4" class="width1024-33">
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
                        <el-col :span="4" class="width1024-33">
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
                      </el-row>
                      <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                        <el-col :span="8" class="width1024-33 paddingLeft">
                          <LFormtTitle label="电话" required>
                            <el-form-item prop="mobileNum">
                              <div class="input-con">
                                <el-input
                                 v-model="recordForm.mobileNum"
                                 placeholder="请输入"
                                 @input="inputChange($event)"
                                ></el-input>
                                <el-button
                                  plain
                                  type="primary"
                                  size="mini"
                                  shortbutton
                                  :disabled="veriCodeDisabled" @click="getVeriCode"
                                  >{{ veriCodeMsg }}</el-button
                                >
                              </div>
                            </el-form-item>
                          </LFormtTitle>
                        </el-col>

                        <el-col :span="4" class="width1024-33">
                          <LFormtTitle label="手机验证码">
                            <el-form-item prop="msgCode">
                              <el-input v-model="recordForm.msgCode" style="width:100%" placeholder="请输入" @input="inputChange($event)"></el-input>
                            </el-form-item>
                          </LFormtTitle>
                        </el-col>
                        <el-col :span="4" class="width1024-33 paddingLeft">
                          <LFormtTitle label="其他电话">
                            <el-form-item prop="otherPhoneNum">
                              <el-input v-model="recordForm.otherPhoneNum" maxlength="11" style="width:100%" placeholder="请输入" @input="inputChange($event)"></el-input>
                            </el-form-item>
                          </LFormtTitle>
                        </el-col>
                        <el-col :span="4" class="width1024-33 paddingLeft">
                          <LFormtTitle label="身高(cm)">
                            <el-form-item prop="height">
                              <el-input v-model="recordForm.height" oninput="value=value.replace(/[^0-9.]/g,'')" style="width:100%" placeholder="cm" @input="inputChange($event)"></el-input>
                            </el-form-item>
                          </LFormtTitle>
                        </el-col><el-col :span="4" class="width1024-33 paddingLeft">
                          <LFormtTitle label="体重(kg)">
                            <el-form-item prop="weight">
                              <el-input v-model="recordForm.weight" oninput="value=value.replace(/[^0-9.]/g,'')" style="width:100%" placeholder="kg" @input="inputChange($event)"></el-input>
                            </el-form-item>
                          </LFormtTitle>
                        </el-col>
                      </el-row>
                    </div>
                  </div>

                  <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                    <el-col :span="8">
                      <LFormtTitle label="户籍地址">
                        <el-form-item prop="domicile">
                          <l-value-domain
                            type="cascader"
                            :code="selectCode.domicile"
                            :value.sync="patientEmpiInfoAddrssVO.houseHoldAddress"
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
                      <LFormtTitle label="户籍具体地址">
                        <el-form-item prop="domicileAddress">
                          <el-input
                            v-model="patientEmpiInfoAddrssVO.houseHoldDetail"
                            style="width:100%"
                            placeholder="请输入"
                            @input="inputChange($event)"
                          ></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="8">
                      <LFormtTitle label="邮编">
                        <el-form-item prop="domicilePostCode">
                          <el-input
                            v-model="patientEmpiInfoAddrssVO.houseHoldPostpode"
                            style="width:100%"
                            maxlength="6"
                            onkeyup="value=value.replace(/[^\d]/g,'')"
                            placeholder="请输入"
                            @input="inputChange($event)"
                          ></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                  <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                    <el-col :span="8">
                      <LFormtTitle label="联系地址" required>
                        <el-form-item prop="address">
                          <l-value-domain
                            type="cascader"
                            :code="selectCode.address"
                            :value.sync="patientEmpiInfoAddrssVO.currentAddress"
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
                      <LFormtTitle label="联系具体地址">
                        <el-form-item prop="detaiAddress">
                          <el-input
                            v-model="patientEmpiInfoAddrssVO.currentDetail"
                            style="width:100%"
                            maxlength="30"
                            placeholder="请输入"
                            @input="inputChange($event)"
                          ></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="8">
                      <LFormtTitle label="邮编">
                        <el-form-item prop="addressPostCode">
                          <el-input
                            v-model="patientEmpiInfoAddrssVO.currentPostpode"
                            style="width:100%"
                            onkeyup="value=value.replace(/[^\d]/g,'')"
                            maxlength="6"
                            placeholder="请输入"
                            @input="inputChange($event)"
                          ></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                  </el-row>

                  <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                    <el-col :span="8">
                      <LFormtTitle label="结算类型" required>
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
                            :value.sync="recordForm.settlementCompanyCode"
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
                            :value.sync="recordForm.siTypeCode"
                            class="select-container"
                            :placeholder="$t('base.placeholder')"
                            key="key7"
                          ></l-value-domain>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                  </el-row>

                  <el-row :gutter="8" class="margin-bottom-20 width1024-100">
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
                          <el-input v-model="recordForm.workUnit" style="width:100%" placeholder="请输入" @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="8">
                      <LFormtTitle label="单位电话">
                        <el-form-item prop="workTelephone">
                          <el-input v-model="recordForm.workTelephone" maxlength="11" style="width:100%" placeholder="请输入" @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                </el-row>
            <el-row>
              <l-card-title><span slot="left">档案补充信息</span></l-card-title>
              <el-col class="fontSize-style">其他凭证</el-col>
              <el-row>
                <el-col :gutter="8" class="margin-bottom-20 credentials">
                  <div v-for="(item, index) in recordForm.archGuarantorListA" :key="index" class="paddingStyleAddBox">
                    <el-row :gutter="8" class="margin-bottom-20">
                      <el-col :span="8">
                        <LFormtTitle label="凭证类型">
                          <el-form-item prop="relationShip">
                            <l-value-domain :code="selectCode.identificationType" :value.sync="item.identificationType"
                              class="select-container" :placeholder="$t('base.placeholder')" key="key17"></l-value-domain>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="7">
                        <LFormtTitle label="凭证卡号">
                          <el-form-item prop="contactDetailAddress">
                            <el-input v-model="item.identificationNum" onkeyup="value=value.replace(/[^\d]/g,'')" style="width:100%" placeholder="请输入凭证号码"
                              @input="inputChange($event)"></el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col class="paddingStyle">
                        <span @click="deleteContactA(item, index)" class="el-icon-delete iconFont-style"></span>
                      </el-col>
                      <el-col class="paddingStyle paddingStyleAdd" v-if="index == recordForm.archGuarantorListA.length-1">
                        <span @click="addArchGuarantorListA" class="el-icon-plus addStyle iconFont-style"></span>
                      </el-col>
                    </el-row>
                  </div>
                  <el-col :span="1" class="paddingStyle" v-if="deleteContactAStyle">
                    <span @click="addArchGuarantorListA" class="el-icon-plus addStyle iconFont-style"></span>
                  </el-col>
                </el-col>
              </el-row>

                <el-col class="fontSize-style">联系人信息</el-col>


                <div v-for="(item, index) in recordForm.archGuarantorList" :key="index" class="paddingStyleAddBox">
                  <el-row :gutter="8" class="margin-bottom-20">
                    <el-col :span="6">
                      <LDoubleInput widthRatio="105px">
                        <template slot="left">
                          <el-form-item prop="type">
                            <l-value-domain :code="selectCode.type" :value.sync="item.patientType" :isFilterable="false"
                              class="select-container" :placeholder="$t('base.placeholder')" key="'key14'+index"
                              @change="concatChange(item, index, 'archGuarantorList')"></l-value-domain>
                          </el-form-item>
                        </template>
                        <template slot="right">
                          <el-form-item :prop="'archGuarantorList.' + index + '.patientName'" :rules="rules.fiduciaryName">
                            <el-input v-model="item.patientName" maxlength="18" style="width:100%"
                              placeholder="请输入" @input="inputChange($event)"></el-input>
                          </el-form-item>
                        </template>
                      </LDoubleInput>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="身份证号">
                        <el-form-item :prop="'archGuarantorList.' + index + '.identificationNum'" :rules="rules.identificationNum">
                          <el-input v-model="item.identificationNum" style="width:100%" placeholder="请输入"
                            maxlength="18" @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="联系人电话">
                        <el-form-item :prop="'archGuarantorList.' + index + '.mobileNum'" :rules="rules.archPhone">
                          <el-input v-model="item.mobileNum" minlength="11" style="width:100%" placeholder="请输入"
                            @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="邮箱">
                        <el-form-item prop="contactDetailAddress">
                          <el-input v-model="item.email" style="width:100%" @blur="emailFun(item)"
                            placeholder="邮箱" @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                  <el-row :gutter="8" class="margin-bottom-20">
                    <el-col :span="4">
                      <LFormtTitle label="联系人地址">
                        <el-form-item prop="domicile">
                          <l-value-domain type="cascader" :code="selectCode.domicile" :value.sync="item.address" class="select-container"
                            remoteValueKey="id" remoteShowKey="label" :multiple="false" :relation="true" :placeholder="$t('base.placeholder')"
                            key="key13"></l-value-domain>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="具体地址">
                        <el-form-item prop="contactDetailAddress">
                          <el-input v-model="item.conDetail" style="width:100%" @input="inputChange($event)"
                            placeholder="请输入"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="联系人工作单位">
                        <el-form-item prop="contactDetailAddress">
                          <el-input v-model="item.workUnit" style="width:100%" placeholder="请输入工作单位"
                            @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>

                    <el-col :span="6">
                      <LFormtTitle label="联系人其他单位">
                        <el-form-item prop="contactDetailAddress">
                          <el-input v-model="item.otherUnit" style="width:100%" placeholder="请输入其他单位"
                            @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="1" class="paddingStyle">
                      <span @click="deleteContact(item, index)" class="el-icon-delete iconFont-style"></span>
                    </el-col>
                    <el-col :span="1" class="paddingStyle paddingStyleAdd" v-if="index == recordForm.archGuarantorList.length-1">
                      <span @click="addArchGuarantorList" class="el-icon-plus iconFont-style"></span>
                    </el-col>
                  </el-row>
                </div>
                <el-col :span="1" class="paddingStyle" v-if="deleteContactStyle">
                  <span @click="addArchGuarantorList" class="el-icon-plus iconFont-style"></span>
                </el-col>
              </el-row>
            </el-row>

            <el-row>
              <l-card-title><span slot="left">卡管理</span></l-card-title>
              <el-row class="cardWrap">
                <el-col :span="24">
                  <el-col :span="24">
                    <div class="cardList cardListC" v-if="recordForm.qrCode">
                      <el-col class="bgcardList">
                        <el-col :span="14">
                          <el-col :span="24">
                            <el-col :span="22" class="cardText">档案识别码</el-col>
                          </el-col>
                          <el-col :span="24" style="margin-top: 15px;"> </el-col>
                        </el-col>
                        <el-col :span="10">
                          <el-col :span="24">
                            <div class="imgRight"><img :src="recordForm.qrCode" alt="" /></div>
                          </el-col>
                        </el-col>

                      </el-col>

                      <el-col :span="24">
                        <div class="relieveDiv">打印</div>
                      </el-col>
                    </div>
                    <div class="cardList cardListC" v-for="(item, index) in cardList" :key="index">
                      <el-col :span="24" class="bgcardList">
                        <el-col :span="24">
                          <el-col :span="10" class="cardText">
                            {{ item.cardType == '1' ? '身份证' : item.cardType == '21' ? '医疗卡' : item.cardType == '20' ? '就诊卡' : '虚拟卡' }}
                          </el-col>
                          <el-col :span="6">
                            <p class="cardBorder">{{ item.cardStatus == '1' ? '有效' : '无效' }}</p>
                          </el-col>
                        </el-col>
                        <el-col :span="24">
                          <span class="timeStyle timebox">{{ item.cardData }}</span>
                        </el-col>
                        <el-col :span="24">
                          <span class="timeStyle timebox">绑定日期</span>
                          <span class="timeNum timebox">{{substringFun(item.cardTime)}}</span>
                        </el-col>

                      </el-col>
                      <el-col :span="24">
                        <div class="relieveDiv" @click="UnboundFun(index,item.cardType)">解绑</div>
                      </el-col>
                    <!--  <el-col :span="12">
                        <el-col :span="24">
                          <div class="numRight">{{ item.cardData }}</div>
                        </el-col>
                      </el-col> -->
                    </div>

                    <!-- 空闲添加部分 start -->
                    <div class="cardList cardListC">
                      <el-col class="bgcardList bgcardListplus"  @click.native="bind">
                          <span class="el-icon-plus" style="font-size: 15px;font-weight: 600;"></span>
                          <span>添加</span>
                      </el-col>
                    </div>
                    <!-- 空闲添加部分 end -->
                  </el-col>
                </el-col>
              </el-row>
            </el-row>


              </el-form>
            </div>

            <div class="bottom-con width100">
              <div class="btns float-right">
                <el-button type="primary" @click="submit">提交</el-button>
                <el-button type="primary" plain @click='cancelFun'>取消</el-button>
              </div>
            </div>
          </el-card>
          </div>

          <el-card class="card-cont1 width100" v-if="htmlShowStyle">
            <div class="newFileBox">
              <div>
                <div class="addnewFile" @click="addnewFile">
                  <span class="el-icon-circle-plus-outline addnewFilesize"></span>
                  <span class="addnewFilesize1">新建档案</span>
                </div>
                <div class="addnewFilesize2">
                    档案信息为空,请选择患者
                </div>
                <div class="addnewFilesize2">或新建档案</div>
              </div>
            </div>
          </el-card>

        </div>
      </template>
    </l-layout>
    <!-- 绑定 -->
    <!--新建卡片-->
    <el-dialog title="绑定新卡" width="533px" :visible.sync="cardDisable" v-if="cardDisable" :close-on-click-modal="false">
      <create-card @changeCardDisable="changeCardDisable" @cardSave="cardSave" ></create-card>
    </el-dialog>

    <!-- 新建档案 start -->
    <el-dialog title="新建档案" width="80%" height="95%" top='7vh' :visible.sync="addarchivesStyle" v-if="addarchivesStyle">
      <addarchives @cancelstyle="cancelstyle" @refsChild='refsChild'> </addarchives>
    </el-dialog>
    <!-- 新建档案 end refsChild -->

    <!-- 新建档案 start -->
    <el-dialog title="查看健康档案" width="85%" height="95%" top='7vh' :visible.sync="readTheStyle" v-if="readTheStyle" @open="openstyle" :close-on-click-modal="false">
      <fillingAndChangeEhr ref='readTheStyleRef' :readTheDataList="readTheDataList" v-if="readTheStyle"> </fillingAndChangeEhr>
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

<script>
import { mapActions, mapGetters } from 'vuex';
import { get } from '@/utils/request';
import LSideTabsNew from '@/components/LSideTabsNew.vue';
import createCard from './components/createCard.vue';
import addarchives from './components/addarchives.vue';
import fillingAndChangeEhr from '../../eHrArchives/eHrArchivesindex/fillingAndChangeEhr.vue';
import eHrArchivesindex from '../../eHrArchives/eHrArchivesindex/index.vue';
import { addArchive, getAgeByBirthDate, sendMsg, getCordByPatientId, delArchCard } from '@/api/filingAndChange/arch';

export default {
  name: 'index',

  components: { LSideTabsNew, createCard , addarchives ,fillingAndChangeEhr,eHrArchivesindex},

  data() {
    //校验两位小数正整数
    let integerCheck =(rule,value,callback) => {
        if (!value) {
          callback();
        } else {
        //此正则表达式验证小数位是否超过两位，小数可为1位 || 2位 || 整数
          if(!(/^\d+(\.\d{1,2})?$/.test(value ) || /^\d$/.test(value) )){
            this.$message.error('输入正确的数据');
          }else{
            callback();
          }
        }
    };

    // 邮编
    let postCodeValidate = (rule, value, callback) => {
      // debugger
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
      let str = /^1([38]\d|4[5-9]|5[0-35-9]|6[56]|7[0-8]|9[189])\d{8}$/;
      if (!value) {
        callback();
      } else if (!str.test(value)) {
        this.$message.error('联系方式有误，请重新填写');
        callback(new Error('联系方式有误，请重新填写'));
      } else if (value != parseInt(value)) {
        this.$message.error('联系方式应该数字');
        callback(new Error('联系方式应该数字'));
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
        this.$message.error('联系方式有误，请重新填写');
        callback(new Error('联系方式有误，请重新填写'));
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
   //姓名校验
      let patientNameValidateA = (rule, value, callback) => {
        let numRule = /[0-9]/;
        if (value) {
            callback();
        }else{
          if (numRule.test(value)) {
            this.$message.error('姓名不允许包括数字');
            callback(new Error('姓名不允许包括数字'));
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
      // 点击调阅档案按钮
      readTheData:{},
      readTheDataList:{},
      // 二维码假数据
      qrcodeImg:
        'data:image/png;base64,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',
     // 删除显示添加按钮
       // 1 凭证号码
       deleteContactAStyle:false,
       //联系人
       deleteContactStyle:false,

      // 新建档案显示和隐藏
      addarchivesStyle:false,
      //绑卡弹框显示
      cardDisable: false,
      // 弹窗显示
      dialogVisible: false,
      cardId: '',
      // 往右侧传值的字段
      stepStyleobj: {
        patientName:'',
        identificationNum:'',
        mobileNum:'',
        birthDate:'',
        patientId:''
      },
      // 相似档案显示隐藏
      patientListShow: true,
      // add页面的显示
      htmlShow: false,
      // 编辑
      eihtmlShow: false,
      // 档案初始化显示
      htmlShowStyle: true,
      checked: '',
      active: 0, //切换步骤
      toolBoxs: ['similarFiles'],
      // 相似档案列表
      patientList: [],
      //form表单
      recordForm: {
        headImg: require('@/assets/pojehjdz.jpeg'),
        qrCode:'',
        socialSecurity: '',
        age: '',
        appCode: '',
        appType: '',
        birthDate: '',
        birthTime: '',
        bloodType: '',
        height: '',
        weight: '',
        cardType: '',
        careerCode: '',
        checkMsgCode: 0, //是否校验验证码
        chronicStatus: '',
        createdAt: '',
        createdBy: '',
        createdByName: '',
        dataVersion: '',
        deletedAt: '',
        deletedStatus: '',
        email: '',
        enableType: '',
        firstCategory: '',
        firstDiagTime: '',
        guarantorEnable: '',
        hosId: '',
        idNumEnable: '',
        identificationNum: '',
        identificationType: '',
        lastCategory: '',
        lastDate: '',
        maritalStatus: '',
        mobileNum: '',
        msgCode: '',
        namePy: '',
        nameWb: '',
        nationCode: '1',
        nationalityCode: '',
        nativePlaceCode: '',
        orgId: '',
        otherPhoneNum: '',
        patientCode: '',//患者编号
        patientEmpiInfoAdditionalId: '',
        patientEmpiInfoAddressId: '',
        patientEmpiInfoCertificate: '',
        patientFullName: '',
        patientGender: '',
        patientId: '',
        patientName: '',
        patientType: '',
        pauseReason: '',
        phoneNumEnable: '',
        photoUrl: '',
        realNameStatus: '',
        realnameMethod: 0,
        recordStatus: '',
        relationStatus: '',
        remarks: '',
        settlementCompanyCode: '',
        settlementType: '',
        siTypeCode: '',
        smsCaptcha: '',
        source: '',
        updatedAt: '',
        updatedBy: '',
        updatedByName: '',
        workTelephone: '',
        workUnit: '',
        archGuarantorList: [],
        archFiduciaryList: [],
        archGuarantorListA: [],
        archFiduciaryListA: []
      },
      // 患者联系人
      patientEmpiInfoAdditionalVOS: [],
      // *就诊凭证*/
      PatientEmpiInfoCertificateVO: [],
      patientEmpiInfoOtherCredentialsVOS: [],
      // 地址籍贯
      patientEmpiInfoAddrssVO: {
        houseHoldAddress: [],
        currentAddress: [],
        createdAt: '',
        createdBy: '',
        createdByName: '',
        currentCityCode: '',
        currentCityName: '',
        currentDetail: '',
        currentPostpode: '',
        currentProvinceCode: '',
        currentProvinceName: '',
        currentRegionCode: '',
        currentRegionName: '',
        dataVersion: '',
        deletedAt: '',
        deletedStatus: '',
        hosId: '',
        houseHoldCityCode: '',
        houseHoldCityName: '',
        houseHoldDetail: '',
        houseHoldPostpode: '',
        houseHoldProvinceCode: '',
        houseHoldProvinceName: '',
        houseHoldRegionCode: '',
        houseHoldRegionName: '',
        id: '',
        orgId: '',
        patientId: '',
        updatedAt: '',
        updatedBy: '',
        updatedByName: ''
      },
      //l-value-domin组件code码
      selectCode: {
        countryCode: 'WORLD_REGIONAL_NAME_CODE', //国家
        patientGender: 'GENDER_CODE', // 性别
        identificationType: 'MARK_TYPE_CODE', //卡类型
        bloodType: 'BLOOD_TYPE_CODE', //血型
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
      // 校验规则
      rules: {
        patientName: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          },
          {
            validator: patientNameValidate,
            trigger: 'blur'
          }
        ],
        patientGender: [{
          required: true,
          validator: notNull,
          msg: '性别不能为空？？',
          trigger: 'blur'
        }],
        // 民族不得为空
         nationCode:[/* {
          required: true,
          validator: notNull,
          msg: '民族不能为空？？',
          trigger: 'blur'
         } */],

        // 结算类型
        settlementType:[{
          required: true,
          validator: notNull,
          msg: '结算类型不能为空？？',
          trigger: 'blur'
        }],
        birthDate: [
          {
            required: true,
            message: '请选择出生日期',
            trigger: 'blur'
          }
        ],
        weight:[{
          validator: integerCheck,
          trigger: 'blur'
        }],
        height:[{
          validator: integerCheck,
          trigger: 'blur'
        }],

        fiduciaryName: [
          // {
          //   required: false,
          //   message: '请输入姓名',
          //   trigger: 'blur'
          // },
          {
            validator: patientNameValidateA,
            trigger: 'blur'
          }
        ],
        mobileNum: [
          {
            validator: mobileNumValidate,
            trigger: 'blur'
          }
        ],
        otherMobileNum:[
          {
            validator: concatPhone,
            trigger: 'blur'
          }
        ],
        workTelephone:[
          {
            validator: concatPhone,
            trigger: 'blur'
          }
        ],
        officeTel: [
          {
            validator: concatPhone,
            trigger: 'blur'
          }
        ],
        phone: [
          {
            validator: concatPhone,
            trigger: 'blur'
          }
        ],
        domicilePostCode: [
          {
            validator: postCodeValidate,
            trigger: 'blur'
          }
        ],
        addressPostCode: [
          {
            validator: postCodeValidate,
            trigger: 'blur'
          }
        ],
        identificationNum: [
          {
            validator: identifyValidate,
            trigger: 'blur'
          }
        ],
        identificationType: [
          {
            validator: identifyTypeValidate,
            trigger: 'change'
          }
        ],
        archIdentificationNum: [
          {
            validator: archIdentifyTypeValidate,
            trigger: 'blur'
          }
        ],
        archGIdentificationNum: [
          {
            validator: archGIdentifyTypeValidate,
            trigger: 'blur'
          }
        ],
        archPhone: [
          {
            validator: concatPhoneArch,
            trigger: 'blur'
          }
        ],
        otherPhoneNum: [{
          validator: concatPhoneArch,
          trigger: 'blur'
        }],
      },

      //表单只读
      isVisible: false,
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
      initMobileNum: '',
      veriCodeMsg: '发送验证码',
      idNumber: '读取身份证',
      addidNumber: '添加身份凭证',
      veriCodeDisabled: false,
      resetFields: '',
      timer: null, //定时器
      cardList: [],
      archCardList: {},
      // 分页
      sizedata: {
        pageNo: 1,
        pageSize: 10
      },
      // 提交后返回的页码
      activeNew: null,
      // 禁止编辑极端
      disableEditing: false,
      readTheStyle:false
    };
  },
  // 父组件中返回要传给下级的数据
  provide() {
    return {
      stepStyleobj: this.stepStyleobj
    };
  },
  computed: {
    ...mapGetters("ehr", ["eHrleftData"]),
  },
  methods: {
    // readTheFun
    readTheFun(){
      this.readTheStyle = true;
      console.log(this.eHrleftData,'eHrleftDataeHrleftDataeHrleftDataeHrleftData')
    },
    openstyle(){
      //打开健康档案
    },
    // 截取字符串
    substringFun(obj){
        if(obj){
          return obj.substring(0,11)
        }else{
           return '无'
        }
    },
    // cancelstyle取消新建档案
    cancelstyle(a,dataObj){
      console.log(dataObj,"dataObjdataObjdataObjdataObjdataObj");
      this.addarchivesStyle = a;
      this.htmlShowStyle = true;
      this.htmlShow = false;

      if(dataObj){
         this.patientListFunData(dataObj,true);
      }

    },

    //绑卡
    bind() {
      this.cardDisable = true;
    },
    //子组件信息
  changeCardDisable(data,dataObj) {
    this.cardDisable = data;
    console.log(dataObj,"dataObjdataObjdataObjdataObjdataObj");
    console.log(this.cardList,"dataObjdataObjdataObjdataObjdataObj");
    if(dataObj){
      for(let i=0; i<this.cardList.length;i++){
        if(this.cardList[i].cardType == dataObj.cardType){
            this.$message.error("禁止添加同一类型卡");
            break;
        }else{
          this.cardList.push(dataObj);
          break;
        }
      }
       if( this.cardList.length == 0){
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

      this.active = 0;
      // add页面的显示
      this.htmlShow = false;
      // 编辑
      this.eihtmlShow = false;
      // 档案初始化显示
      this.htmlShowStyle = true;
      this.addarchivesStyle = true;
      //清空倒计时
      this.setTimeOuts(0);
    },
    // 清空
    emptyFun() {
      // 禁止输入
      this.disableEditing = false;
      for (let obj in this.recordForm) {
        //         headImg: require('@/assets/pojehjdz.jpeg'),
        if (obj == 'headImg') {
          this.recordForm[obj] = require('@/assets/pojehjdz.jpeg');
        } else {
          this.recordForm[obj] = '';
        }
      }
      for (let obj in this.patientEmpiInfoAddrssVO) {
        this.patientEmpiInfoAddrssVO[obj] = '';
      }
      this.recordForm.archGuarantorList = [];
      this.recordForm.archFiduciaryList = [];
      this.recordForm.archGuarantorListA = [];
      this.recordForm.archFiduciaryListA = [];
      // 患者联系人
      this.patientEmpiInfoAdditionalVOS = [];
      // *就诊凭证*/
      this.patientEmpiInfoOtherCredentialsVOS = [];
      this.archCardList = [];
      //清空倒计时
      this.setTimeOuts(0);
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

    patientListFunData(item, showData) {
      this.readTheData = item;
      //清空倒计时
      this.setTimeOuts(0);
      // 控制显示到第一页

      if (showData) {
        // add页面的显示
        this.htmlShow = true;
        this.htmlShowStyle = false;
        // 编辑
        this.eihtmlShow = false;
      } else {
        // add页面的显示
        this.htmlShow = false;
        // 编辑
        this.eihtmlShow = true;
        // 档案初始化显示
        this.htmlShowStyle = true;
      }

      if (item.patientArchiveInfoVO) {
        for (let obj in this.recordForm) {
          this.recordForm[obj] = item.patientArchiveInfoVO[obj];
          if (obj == 'nativePlaceCode') {
            let str = [];
            if (item.patientArchiveInfoVO[obj]) {
              this.recordForm[obj] = item.patientArchiveInfoVO[obj]
                .toString()
                .replace(/\[|]/g, '')
                .split(',');
              for (let i = 0; i < this.recordForm[obj].length; i++) {
                str[i] = parseInt(this.recordForm[obj][i]);
              }
              this.recordForm[obj] = str;
            }
          }
        }
        this.recordForm.headImg = require('@/assets/pojehjdz.jpeg');
        this.recordForm.medicareCard = this.recordForm.patientCode;

        this.initMobileNum = this.recordForm.mobileNum;

        this.stepStyleobj.patientName = this.recordForm.patientName;
        this.stepStyleobj.identificationNum = this.recordForm.identificationNum;
        this.stepStyleobj.mobileNum = this.recordForm.mobileNum;
        this.stepStyleobj.birthDate = this.recordForm.birthDate;
        this.stepStyleobj.patientId = this.recordForm.patientId;
        if (this.recordForm.identificationNum) {
          // 禁止输入
          this.disableEditing = true;
          this.disableEditingother = true;
        }
      }

      if (item.patientEmpiInfoAddrssVO) {
        for (let obj in this.patientEmpiInfoAddrssVO) {
          this.patientEmpiInfoAddrssVO[obj] = item.patientEmpiInfoAddrssVO[obj];
          if (obj == 'houseHoldAddress') {
            let str = [];
            this.patientEmpiInfoAddrssVO[obj] = item.patientEmpiInfoAddrssVO[obj]
              .toString()
              .replace(/\[|]/g, '')
              .split(',');
            for (let i = 0; i < this.patientEmpiInfoAddrssVO[obj].length; i++) {
              str[i] = parseInt(this.patientEmpiInfoAddrssVO[obj][i].toString().replace(/\"/g, ''));
            }
            this.patientEmpiInfoAddrssVO[obj] = str;
          }
          if (obj == 'currentAddress') {
            let str = [];
            this.patientEmpiInfoAddrssVO[obj] = item.patientEmpiInfoAddrssVO[obj]
              .toString()
              .replace(/\[|]/g, '')
              .split(',');
            for (let i = 0; i < this.patientEmpiInfoAddrssVO[obj].length; i++) {
              str[i] = parseInt(this.patientEmpiInfoAddrssVO[obj][i].toString().replace(/\"/g, ''));
            }
            this.patientEmpiInfoAddrssVO[obj] = str;
          }
        }
      }
      // 联系人
      if (item.patientEmpiInfoAdditionalVOS) {
        this.patientEmpiInfoAdditionalVOS = [];
        this.patientEmpiInfoAdditionalVOS = item.patientEmpiInfoAdditionalVOS;
        this.recordForm.archGuarantorList = this.patientEmpiInfoAdditionalVOS;
        if(this.recordForm.archGuarantorList.length == 0){
          this.deleteContactStyle = true;
        }
        for (let j = 0; j < item.patientEmpiInfoAdditionalVOS.length; j++) {
          let str = [];
          let strData = [];
          strData = item.patientEmpiInfoAdditionalVOS[j].address
            .toString()
            .replace(/\[|]/g, '')
            .split(',');
          for (let i = 0; i < strData.length; i++) {
            str[i] = parseInt(strData[i].toString().replace(/\"/g, ''));
          }
          this.patientEmpiInfoAdditionalVOS[j].address = str;
          this.recordForm.archGuarantorList[j].address = str;
        }
      } else {
        this.patientEmpiInfoAdditionalVOS = [];
        this.recordForm.archGuarantorList = [];
        this.deleteContactStyle = true;
      }
      // 凭证
      if (item.patientEmpiInfoOtherCredentialsVOS) {
        this.patientEmpiInfoOtherCredentialsVOS = [];
        this.patientEmpiInfoOtherCredentialsVOS = item.patientEmpiInfoOtherCredentialsVOS;
        this.recordForm.archGuarantorListA = this.patientEmpiInfoOtherCredentialsVOS;
        if(this.recordForm.archGuarantorListA.length == 0){
          this.deleteContactAStyle = true;
        }
      } else {
        this.patientEmpiInfoOtherCredentialsVOS = [];
        this.recordForm.archGuarantorListA = [];
        this.deleteContactAStyle = true;
      }
      // 卡
      if (item.archCardList) {
        this.archCardList = item.archCardList;
        this.cardList = item.archCardList;
      } else {
        this.archCardList = [];
      }

    },

   // 解绑
   UnboundFun(a,b) {
      if(b == '1'){
         this.$message.error("身份证不可解绑");
      }else{
        this.dialogVisible = true;
        this.cardId = a;
      }

   },
   async handleClose() {
     for (let i=0;i<this.cardList.length;i++){
       if(i == this.cardId){
         this.cardList.splice(i,1)
       }
     }
     this.dialogVisible = false;
      // this.$message.success('解绑成功');
     console.log(this.cardList);
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
            this.recordForm.age = res.data;
          }
        } catch (error) {}
      }
    },

    //切换工具箱
    messageHandler() {

    },
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
        this.$message.error('邮箱格式错误');
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

      this.timer = setTimeout(function() {
        _this.setTimeOuts(msg);
      }, 1000);
    },
    //身份证号码校验
    identifiBlur() {
      if (this.recordForm.identificationNum && this.recordForm.identificationNum.length === 18) {
        //获取身份证中的性别
        let isGender = parseInt(this.recordForm.identificationNum.substr(16, 1)) % 2;
        if (isGender == 1) {
          this.recordForm.patientGender = '1';
        } else {
          this.recordForm.patientGender = '2';
        }
        //根据出生日期带入年龄
        //根据身份证号带入出生日期与年龄
        let str = this.recordForm.identificationNum.slice(6, 14);
        let birthDate = str.slice(0, 4) + '-' + str.slice(4, 6) + '-' + str.slice(6, 8);
        if (Number(str).toString().length == 8) {
          this.recordForm.birthDate = birthDate;
          this.getAgeByBirthDate();
        }
      } else {
        this.$message.error('身份证号不得少于18位');
      }
      // //获取相似档案信息
      // this.patientBlur();
    },
    //发送验证码
    async getVeriCode() {
      let msg = 60;
      let phoneNum = this.recordForm.mobileNum;
      if (!this.recordForm.identificationNum || this.recordForm.identificationNum.length <= 0) {
        this.$message.error('身份号不能为空');
        return false;
      }
      if (!phoneNum) {
        this.$message.error('手机号码不能为空');
      } else if (phoneNum.length != 11) {
        this.$message.error('手机号码应该等于11位');
      } else if (phoneNum != parseInt(phoneNum)) {
        this.$message.error('手机号码应该数字');
      } else {
        this.setTimeOuts(msg);
        try {
          let params = {
            identificationNum: this.recordForm.identificationNum,
            phoneNum: this.recordForm.mobileNum
          };
          let res = await sendMsg(params);
          if (res.code == '1') {
            this.$message.success('验证码发送成功');
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
    refsChild(){
        this.$refs.child.queryFun();
    },
    //提交表单
    submit() {
      this.$refs['recordForm'].validate(async valid => {
        if (valid) {
          if (!this.recordForm.patientName || this.recordForm.patientName.length <= 0) {
            this.$message.error('姓名不能为空');
            this.active = 0;
            return false;
          }
          if (!this.recordForm.patientGender || this.recordForm.patientGender.length <= 0) {
            this.$message.error('性别不能为空');
            this.active = 0;
            return false;
          }
          if (!this.recordForm.birthDate || this.recordForm.birthDate.length <= 0) {
            this.$message.error('出身日期不能为空');
            this.active = 0;
            return false;
          }
          // recordForm.identificationNum
          if (!this.recordForm.identificationNum || this.recordForm.identificationNum.length <= 0) {
            this.$message.error('身份证不能为空');
            this.active = 0;
            return false;
          }
          if (!this.recordForm.mobileNum || this.recordForm.mobileNum.length <= 0) {
            this.$message.error('手机号不能为空');
            this.active = 0;
            return false;
          }
          this.$showLoading();
          try {
            // 判断时候校验手机号
            if (this.recordForm.mobileNum != this.initMobileNum) {
              this.recordForm.checkMsgCode = 1;
            } else {
              this.recordForm.checkMsgCode = 0;
            }

            //保存表单接口接口
            let patientArchiveInfoVOData = {};
            patientArchiveInfoVOData['patientArchiveInfoVO'] = this.recordForm;
            patientArchiveInfoVOData['patientEmpiInfoAddrssVO'] = this.patientEmpiInfoAddrssVO;
            patientArchiveInfoVOData['patientEmpiInfoAdditionalVOS'] = this.recordForm.archGuarantorList;
            patientArchiveInfoVOData['patientEmpiInfoOtherCredentialsVOS'] = this.recordForm.archGuarantorListA;
            patientArchiveInfoVOData['archCardList'] = this.cardList;
            let result = await addArchive(patientArchiveInfoVOData);
            if (result.code == '1') {
              this.$message.success('档案已保存');
              this.activeNew = 1;
              this.emptyFun();
              this.refsChild();
              this.htmlShowStyle = true;
              this.htmlShow = false;
              this.archCardList = []; //卡的id对象
            } else {
              this.$message.error(result.msg || '保存失败');
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || '保存失败');
          }
        } else {
          // this.$message.error("请填写必填项！！")
          }
      });
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
      if (value.length > 0 && curItem.length > 0) {
        this.patientEmpiInfoAddrssVO.currentProvinceCode = value[0];
        this.patientEmpiInfoAddrssVO.currentProvinceName = curItem[0].label;

        this.patientEmpiInfoAddrssVO.currentCityCode = value[1];
        this.patientEmpiInfoAddrssVO.currentCityName = curItem[1].label;

        this.patientEmpiInfoAddrssVO.currentRegionCode = value[2];
        this.patientEmpiInfoAddrssVO.currentRegionName = curItem[2].label;
      }else{
          this.$message.error('联系地址不能为空');
          this.patientEmpiInfoAddrssVO. currentAddress =  [2595, 2623, 2625];
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
      let archGuarantorList = [...this.recordForm.archGuarantorList];
      archGuarantorList.push({
        conProvinceCode: '', //户籍省
        conProvinceName: '', //户籍省
        conCityCode: '', //户籍市
        conCityName: '', //户籍市
        conRegionCode: '', //户籍市
        conRegionName: '', //户籍市
        patientType: '1', //1是监护人
        patientName: '', //姓名
        identificationNum: '', //身份证号
        mobileNum: '', //手机号
        address: '', //地址数组code
        conDetail: '', //具体地址
        email: '', //邮箱
        workUnit: '', //联系人单位
        otherUnit: '' //其他单位
      });
      this.recordForm.archGuarantorList = [...archGuarantorList];
    },
    //改变联系人
    concatChange(item, index, info) {
      let changeItem = { ...item };
      if (item.patientType == '1' && info == 'archFiduciaryList') {
        if (!this.recordForm.archGuarantorList) {
          this.recordForm.archGuarantorList = [];
        }
        this.recordForm.archGuarantorList.push(changeItem);
        this.$delete(this.recordForm.archFiduciaryList, index);
      } else if (item.patientType == '2' && info == 'archGuarantorList') {
        if (!this.recordForm.archGuarantorList) {
          this.recordForm.archGuarantorList = [];
        }
        this.recordForm.archGuarantorList.push(changeItem);
        this.$delete(this.recordForm.archGuarantorList, index);
      }
    },

    //删除联系人
    deleteContact(item, index) {
      if(index == 0){
        this.deleteContactStyle = true;
      }else{
        this.deleteContactStyle = false;
      }
      if (item.type == '1') {
        let propsRefieds = [];
        let archGuarantorList = [...this.recordForm.archGuarantorList];
        for (let i in archGuarantorList) {
          propsRefieds.push('archGuarantorList.' + index + '.fiduciaryName');
          propsRefieds.push('archGuarantorList.' + index + '.idCard');
          propsRefieds.push('archGuarantorList.' + index + '.mobileNum');
        }
        this.$refs['recordForm'].clearValidate(propsRefieds);
        this.$delete(archGuarantorList, index);
        this.recordForm.archGuarantorList = [...archGuarantorList];
      } else {
        let propsRefieds1 = [];
        let archGuarantorList = [...this.recordForm.archGuarantorList];
        for (let i in archGuarantorList) {
          propsRefieds1.push('archGuarantorList.' + index + '.fiduciaryName');
          propsRefieds1.push('archGuarantorList.' + index + '.idCard');
          propsRefieds1.push('archGuarantorList.' + index + '.mobileNum');
        }
        this.$refs['recordForm'].clearValidate(propsRefieds1);
        this.$delete(archGuarantorList, index);
        this.recordForm.archGuarantorList = [...archGuarantorList];
      }
      // });
    },

    //新建凭证
    addArchGuarantorListA() {
      this.deleteContactAStyle = false;
      let archGuarantorListA = [...this.recordForm.archGuarantorListA];
      archGuarantorListA.push({
        identificationType: '',
        identificationNum: ''
      });
      this.recordForm.archGuarantorListA = [...archGuarantorListA];
    },
    //改变凭证号码
    concatChangeA(item, index, info) {
      let changeItem = { ...item };
      if (item.type == '1' && info == 'archFiduciaryList') {
        this.recordForm.archGuarantorListA.push(changeItem);

        this.$delete(this.recordForm.archFiduciaryListA, index);
      } else if (item.type == '2' && info == 'archGuarantorListA') {
        this.recordForm.archFiduciaryListA.push(changeItem);
        this.$delete(this.recordForm.archGuarantorListA, index);
      }
    },
    //删除凭证号码
    deleteContactA(item, index) {
      if(index == 0){
        this.deleteContactAStyle = true;
      }else{
        this.deleteContactAStyle = false;
      }
      if (item.type == '1') {
        let propsRefieds = [];
        let archGuarantorListA = [...this.recordForm.archGuarantorListA];
        for (let i in archGuarantorListA) {
          propsRefieds.push('archGuarantorList.' + index + '.identificationType');
          propsRefieds.push('archGuarantorList.' + index + '.identificationNum');
        }
        this.$refs['recordForm'].clearValidate(propsRefieds);
        this.$delete(archGuarantorListA, index);
        this.recordForm.archGuarantorListA = [...archGuarantorListA];
      } else {
        let propsRefieds1 = [];
        let archGuarantorListA = [...this.recordForm.archGuarantorListA];
        for (let i in archGuarantorListA) {
          propsRefieds1.push('archGuarantorListA.' + index + '.identificationType');
          propsRefieds1.push('archGuarantorListA.' + index + '.identificationNum');
        }
        this.$refs['recordForm'].clearValidate(propsRefieds1);
        this.$delete(archGuarantorListA, index);
        this.recordForm.archGuarantorListA = [...archGuarantorListA];
      }
      // });
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
        return '0' + t;
      }
      return t;
    }
  },

  watch: {
    nativePlaceCode: {
      handler(n) {},
      immediate: true,
      deep: true
    }
    // 'recordForm.patientName'(newValue, oldValue) {
    //   console.log(newValue);
    //   // if(this.recordForm.patientName){
    //   //    this.stepStyleobj.stepStyle = 3;
    //   // }
    // }
  },
  created() {
    this.addArchGuarantorList();
    this.addArchGuarantorListA();
  }
};
</script>

<style scoped lang="scss">
  // 新的框架
  .titleStyle{
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


.paddingStyle{
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
  /deep/ .el-form-item{
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

  .readThe{
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
  .patientName-box{
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
 .patientName-box .block-style{
   margin: 0px 10px;
 }
 .patientName-box .span-top span{
    display: inline-block;
    margin: 0px 8px;
 }
 .span-top{
   padding: 0px 10px;
   border-right: 1px solid #dfe2e6;
 }
 .el-font{
   color: #666c70;
 }
 .el-font-style{
   color: #949da3;
   line-height: 15px;
 }
 .patientName-top{
   font-size: 20px;
   font-weight: 600;
   color: #000000;
 }
  .iconFont-style{
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
            width: 128px;
            height: 128px;
            border: 1px solid $l-color-bgcolor-11;
            margin-right: 10px;
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
    line-height:16px;
    text-align: center;
    width: 32px;
    height: 16px;
    border: 1px solid #2b4583;
    border-radius: 2px;
    color:#2b4583 ;
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
  .cardListC{
    margin-left: 15px;
  }
  .cardList .bgcardListplus{
      cursor: pointer;
      height: 137px;
      background-color: #FFFFFF;
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
    content: '';
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
    content: '';
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
</style>
