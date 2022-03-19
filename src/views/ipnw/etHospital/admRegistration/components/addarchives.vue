<template>
  <div class="width100 height100 filingAndChangeindex">
    <div class="recordCreate width100 height100">
      <el-card class="card-cont1 width100" v-if="htmlShow">
        <div class="form-cont height-button-main">
          <el-form ref="recordForm" :model="recordForm" :rules="rules" show-message inline-message>
            <el-row>
              <div class="clearfix img-cont">
                <div class="float-left img-right"><img :src="recordForm.headImg" alt="" /></div>

                <div class="float-left img-left">
                  <el-row :gutter="8" class="margin-bottom-20">
                    <el-col :span="4" class="width1024-50">
                      <LFormtTitle label="姓名" required>
                        <el-form-item prop="patientName">
                          <el-input v-model="recordForm.patientName" auto-complete="on" style="line-height: 34px;width:100%"
                            placeholder="请输入姓名" @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4" class="width1024-50">
                      <LFormtTitle label="性别" required :disabled="disableEditingother">
                        <el-form-item prop="patientGender">
                          <l-value-domain :disabled="disableEditingother" :code="selectCode.patientGender" :value.sync="recordForm.patientGender"
                            class="select-container" @input="inputChange($event)" :placeholder="$t('base.placeholder')"
                            key="key20"></l-value-domain>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>

                    <el-col :span="6" class="width1024-33 paddingLeft">
                      <LFormtTitle label="出生日期" required :disabled="disableEditingother">
                        <el-form-item prop="birthDate">
                          <el-date-picker :disabled="disableEditingother" v-model="recordForm.birthDate" type="date"
                            style="line-height: 34px;width:100%" placeholder="选择日期" @input="inputChange($event)" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" :picker-options="expireTimeOption"></el-date-picker>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6" class="width1024-33">
                      <LFormtTitle label="出生时间">
                        <el-form-item prop="birthTime">
                          <el-time-picker v-model="recordForm.birthTime" value-format="HH:mm:ss" :picker-options="birthTimeOption"
                            style="line-height: 34px;width:100%" placeholder="选择时间" @blur="getAgeByBirthDate"></el-time-picker>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4" class="width1024-33">
                      <LFormtTitle label="年龄">
                        <el-form-item prop="age">
                          <el-input v-model="recordForm.age" :disabled="disableEditingother" style="line-height: 34px;width:100%"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                  <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                    <el-col :span="8" class="width1024-33 paddingLeft">
                      <LFormtTitle label="身份证号" required :disabled="disableEditing">
                        <el-form-item prop="idNumbertest">
                          <div class="input-con">
                            <el-input :disabled="disableEditing" v-model="recordForm.identificationNum" style="line-height: 34px;width:100%"
                              placeholder="请输入" maxlength="18" @input="inputChange($event)" @blur="identifiBlur"></el-input>
                            <el-button plain type="primary" size="mini" shortbutton :disabled="disableEditing">{{ idNumber }}</el-button>
                          </div>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4" class="width1024-33">
                      <LFormtTitle label="籍贯">
                        <el-form-item prop="nativePlaceCode">
                          <l-value-domain type="cascader" :code="selectCode.nativePlaceCode" :value.sync="recordForm.nativePlaceCode"
                            class="select-container" remoteValueKey="id" remoteShowKey="label" :multiple="false"
                            :relation="true" :placeholder="$t('base.placeholder')" key="key24"></l-value-domain>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4" class="width1024-33 paddingLeft">
                      <LFormtTitle label="民族">
                        <el-form-item prop="nationCode">
                          <l-value-domain :code="selectCode.nationCode" :value.sync="recordForm.nationCode" class="select-container"
                            :placeholder="$t('base.placeholder')" key="key1"></l-value-domain>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4" class="width1024-33">
                      <LFormtTitle label="血型">
                        <el-form-item prop="bloodType">
                          <l-value-domain :code="selectCode.bloodType" :value.sync="recordForm.bloodType" class="select-container"
                            :placeholder="$t('base.placeholder')" key="key23"></l-value-domain>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4" class="width1024-33">
                      <LFormtTitle label="婚姻状况">
                        <el-form-item prop="maritalStatus">
                          <l-value-domain :code="selectCode.maritalStatus" :value.sync="recordForm.maritalStatus" class="select-container"
                            :placeholder="$t('base.placeholder')" key="key21"></l-value-domain>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                  </el-row>
                  <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                    <el-col :span="8" class="width1024-33 paddingLeft">
                      <LFormtTitle label="电话" required>
                        <el-form-item prop="">
                          <div class="input-con">
                            <el-input minlength="11" v-model="recordForm.mobileNum" placeholder="请输入" @input="inputChange($event)"></el-input>
                            <el-button plain type="primary" size="mini" shortbutton :disabled="veriCodeDisabled" @click="getVeriCode">{{ veriCodeMsg }}</el-button>
                          </div>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4" class="width1024-33">
                      <LFormtTitle label="手机验证码">
                        <el-form-item prop="msgCode">
                          <el-input v-model="recordForm.msgCode" style="line-height: 34px;width:100%" placeholder="请输入"
                            @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4" class="width1024-33 paddingLeft">
                      <LFormtTitle label="其他电话">
                        <el-form-item prop="otherPhoneNum">
                          <el-input v-model.number="recordForm.otherPhoneNum" maxlength="11" style="line-height: 34px;width:100%"
                            placeholder="请输入" @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4" class="width1024-33 paddingLeft">
                      <LFormtTitle label="身高(cm)">
                        <el-form-item prop="height">
                          <el-input v-model="recordForm.height" oninput="value=value.replace(/[^0-9.]/g,'')" style="line-height: 34px;width:100%"
                            placeholder="cm" @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="4" class="width1024-33 paddingLeft">
                      <LFormtTitle label="体重(kg)">
                        <el-form-item prop="weight">
                          <el-input v-model="recordForm.weight" oninput="value=value.replace(/[^0-9.]/g,'')" style="line-height: 34px;width:100%"
                            placeholder="kg" @input="inputChange($event)"></el-input>
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
                      <l-value-domain type="cascader" :code="selectCode.domicile" :value.sync="patientEmpiInfoAddrssVO.houseHoldAddress"
                        class="select-container" remoteValueKey="id" remoteShowKey="label" :multiple="false" :relation="true"
                        @change="domicileChange" :placeholder="$t('base.placeholder')" key="key2"></l-value-domain>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="8">
                  <LFormtTitle label="户籍具体地址">
                    <el-form-item prop="domicileAddress">
                      <el-input v-model="patientEmpiInfoAddrssVO.houseHoldDetail" style="line-height: 34px;width:100%"
                        placeholder="请输入" @input="inputChange($event)"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="8">
                  <LFormtTitle label="邮编">
                    <el-form-item prop="houseHoldPostpode">
                      <el-input v-model.number="patientEmpiInfoAddrssVO.houseHoldPostpode" onkeyup="value=value.replace(/[^\d]/g,'')" maxlength="6" style="line-height: 34px;width:100%"
                        placeholder="请输入" @input="inputChange($event)"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
              </el-row>
              <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                <el-col :span="8">
                  <LFormtTitle label="联系地址" required>
                    <el-form-item prop="address">
                      <l-value-domain type="cascader" :code="selectCode.address" :value.sync="patientEmpiInfoAddrssVO.currentAddress"
                        class="select-container" remoteValueKey="id" remoteShowKey="label" :multiple="false" :relation="true"
                        :placeholder="$t('base.placeholder')" @change="contactChange" key="key3"></l-value-domain>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="8">
                  <LFormtTitle label="联系具体地址">
                    <el-form-item prop="detaiAddress">
                      <el-input v-model="patientEmpiInfoAddrssVO.currentDetail" style="line-height: 34px;width:100%"
                        maxlength="30"
                        placeholder="请输入" @input="inputChange($event)"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="8">
                  <LFormtTitle label="邮编">
                    <el-form-item prop="currentPostpode">
                      <el-input v-model.number="patientEmpiInfoAddrssVO.currentPostpode" onkeyup="value=value.replace(/[^\d]/g,'')" maxlength="6" style="line-height: 34px;width:100%"
                        placeholder="请输入" @input="inputChange($event)"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
              </el-row>

              <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                <el-col :span="8">
                  <LFormtTitle label="结算类型" required>
                    <el-form-item prop="settlementType">
                      <l-value-domain :code="selectCode.settlementType" :value.sync="recordForm.settlementType" class="select-container"
                        :placeholder="$t('base.placeholder')" key="key5"></l-value-domain>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="8">
                  <LFormtTitle label="结算单位">
                    <el-form-item prop="settlementCompany">
                      <l-value-domain :code="selectCode.settlementCompany" :value.sync="recordForm.settlementCompanyCode"
                        class="select-container" :placeholder="$t('base.placeholder')" key="key6"></l-value-domain>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="8">
                  <LFormtTitle label="社保类型">
                    <el-form-item prop="socialSecurity">
                      <l-value-domain :code="selectCode.socialSecurity" :value.sync="recordForm.siTypeCode" class="select-container"
                        :placeholder="$t('base.placeholder')" key="key7"></l-value-domain>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
              </el-row>

              <el-row :gutter="8" class="margin-bottom-20 width1024-100">
                <el-col :span="8">
                  <LFormtTitle label="职业">
                    <el-form-item prop="careerCode">
                      <l-value-domain :code="selectCode.careerCode" :value.sync="recordForm.careerCode" class="select-container"
                        :placeholder="$t('base.placeholder')" key="key4"></l-value-domain>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="8">
                  <LFormtTitle label="工作单位">
                    <el-form-item prop="company">
                      <el-input v-model="recordForm.workUnit" style="line-height: 34px;width:100%" placeholder="请输入"
                        @input="inputChange($event)"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
                <el-col :span="8">
                  <LFormtTitle label="单位电话">
                    <el-form-item prop="workTelephone">
                      <el-input v-model="recordForm.workTelephone" maxlength="11" style="line-height: 34px;width:100%" placeholder="请输入"
                        @input="inputChange($event)"></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
              </el-row>

            </el-row>

            <el-row>
              <l-card-title><span slot="left">档案补充信息</span></l-card-title>
              <el-col class="fontSize-style">其他凭证</el-col>
              <el-row>
                <el-row :gutter="8" class="margin-bottom-20">

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
                            <el-input v-model="item.identificationNum" onkeyup="value=value.replace(/[^\d]/g,'')" style="line-height: 34px;width:100%"
                              placeholder="请输入凭证号码" @input="inputChange($event)"></el-input>
                          </el-form-item>
                        </LFormtTitle>
                      </el-col>
                      <el-col :span="1" class="paddingStyle">
                        <span @click="deleteContactA(item, index)" class="el-icon-delete iconFont-style"></span>
                      </el-col>
                      <el-col :span="1" class="paddingStyle paddingStyleAdd" v-if="index == recordForm.archGuarantorListA.length-1">
                        <span @click="addArchGuarantorListA" class="el-icon-plus addStyle iconFont-style"></span>
                      </el-col>
                    </el-row>
                  </div>
                  <el-col :span="1" class="paddingStyle" v-if="deleteContactAStyle">
                    <span @click="addArchGuarantorListA" class="el-icon-plus addStyle iconFont-style"></span>
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
                            <el-input v-model="item.patientName" maxlength="18" style="line-height: 34px;width:100%"
                              placeholder="请输入" @input="inputChange($event)"></el-input>
                          </el-form-item>
                        </template>
                      </LDoubleInput>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="身份证号">
                        <el-form-item :prop="'archGuarantorList.' + index + '.identificationNum'" :rules="rules.identificationNum">
                          <el-input v-model="item.identificationNum" style="line-height: 34px;width:100%" placeholder="请输入"
                            maxlength="18" @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="联系人电话">
                        <el-form-item :prop="'archGuarantorList.' + index + '.mobileNum'" :rules="rules.otherMobileNum">
                          <el-input v-model="item.mobileNum" style="line-height: 34px;width:100%" placeholder="请输入"
                            @input="inputChange($event)" minlength="11"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="邮箱">
                        <el-form-item prop="contactDetailAddress">
                          <el-input v-model="item.email" style="line-height: 34px;width:100%" @blur="emailFun(item)"
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
                          <el-input v-model="item.conDetail" style="line-height: 34px;width:100%" @input="inputChange($event)"
                            placeholder="请输入"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>
                    <el-col :span="6">
                      <LFormtTitle label="联系人工作单位">
                        <el-form-item prop="contactDetailAddress">
                          <el-input v-model="item.workUnit" style="line-height: 34px;width:100%" placeholder="请输入工作单位"
                            @input="inputChange($event)"></el-input>
                        </el-form-item>
                      </LFormtTitle>
                    </el-col>

                    <el-col :span="6">
                      <LFormtTitle label="联系人其他单位">
                        <el-form-item prop="contactDetailAddress">
                          <el-input v-model="item.otherUnit" style="line-height: 34px;width:100%" placeholder="请输入其他单位"
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
                  <el-row :gutter="8" class="margin-bottom-20">



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
                          <span class="timeStyle timebox"></span>
                          <span class="timeNum timebox"></span>
                        </el-col>

                      </el-col>
                      <el-col :span="24">
                        <div class="relieveDiv" @click="UnboundFun(index,item.cardType)">解绑</div>
                      </el-col>
                    </div>

                    <!-- 空闲添加部分 start -->
                    <div class="cardList cardListC">
                      <el-col class="bgcardList bgcardListplus" @click.native="bind">
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
        <div class="footer-bottom height-button-bottom">

          <div class="buttons float-right">
            <el-button style="min-width:80px" type="primary" @click.native="submit" v-hotKey="{ func: 'func_submit', flag: 'loading' }">提交</el-button>
            <el-button style="min-width:80px" type="" @click.native="cancel">取消</el-button>
          </div>

        </div>
      </el-card>
    </div>


    <!-- 绑定 -->
    <!--新建卡片-->
    <el-dialog title="绑定新卡" width="533px" :visible.sync="cardDisable" v-if="cardDisable" :close-on-click-modal="false"
      append-to-body>
      <create-card @changeCardDisable="changeCardDisable" @cardSave="cardSave" :patientId="this.recordForm.patientId"></create-card>
    </el-dialog>
    <!-- 解绑弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" append-to-body>
      <span class="titleStyle"> 确认删除此卡吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改身份证号 -->
    <el-dialog width="30%" title="请重新填写证件号" :visible.sync="toFillinStyleA" append-to-body class="formLabelIdStyleWrap">
      <el-form>
        <el-col class="formLabelIdStyle">
          <el-form-item label="证件号">
            <el-input :disabled="disableEditing" v-model="formLabelId" style="line-height: 34px;width:100%" placeholder="请重新填写证件号"
              maxlength="18" @input="inputChange($event)"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toFillinStyleA = false">取 消</el-button>
        <el-button type="primary" @click="toFillinDetermineA">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="toFillinStyle" append-to-body center>
      <span class="titleStyle"> 该证件号已有档案,是否调阅已有档案或更换证件号继续建档。</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toFillinStyleCancel">调阅已有建档信息</el-button>
        <el-button @click="toFillinDetermine">更换证件号继续建档</el-button>
      </div>
    </el-dialog>





  </div>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex';
  import {
    get
  } from '@/utils/request';
  import LSideTabsNew from '@/components/LSideTabsNew.vue';
  import createCard from './createCard.vue';
  import {
    addArchive,
    getAgeByBirthDate,
    sendMsg,
    getPatientArchInfo,
    getCordByPatientId,
    delArchCard
  } from '@/api/filingAndChange/arch';

  export default {
    name: 'index',
    components: {
      LSideTabsNew,
      createCard
    },

    data() {
      //校验两位小数正整数
      let integerCheck = (rule, value, callback) => {
        if (!value) {
          callback();
        } else {
          //此正则表达式验证小数位是否超过两位，小数可为1位 || 2位 || 整数
          if (!(/^\d+(\.\d{1,2})?$/.test(value) || /^\d$/.test(value))) {
            this.$message.error('输入正确的数据');
          } else {
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
          // callback(new Error('手机号码应该等于11位'));
        } else if (value != parseInt(value)) {
          this.setTimeOuts(0);
          this.$message.error('手机号码应该数字');
          // callback(new Error('手机号码应该数字'));
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
      // 身份正号校验
      let idNumbertest = (rule, value, callback) => {
        let testStr =
          /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        if (value) {
          if (testStr.test(value)) {
            callback();
          } else {
            this.$message.error('身份证号格式不正确')
          }
        } else {
          callback();
           // callback(new Error('身份证号不能为空'));
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
        } else {
          // this.$message.error('姓名不能为空');
          callback(new Error('姓名不能为空'));
        }
      };
      //姓名校验
      let patientNameValidateA = (rule, value, callback) => {
        let numRule = /[0-9]/;
        if (value) {
          callback();
        } else {
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
        // 身份证读取成功
        disableEditingother: false,
        // 重新填写验证码外部弹窗
        toFillinStyle: false,
        toFillinStyleA: false,
        // 个人信息
        itemObj: {},
        // 重新编辑身份证字段
        formLabelId: '',
        // 二维码假数据
        qrcodeImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsAQAAAABRBrPYAAAA7UlEQVR42u3aYQ7CIAyGYW7A/W/JDTCb2JUOFv/Zz7zEGFaf/apg6Sz9m9EKDAb7LSs2ah+XdQ7C5FgdGX5HDlNjECbHRrrPiX1qQZg2+0jYn7EwgSkyv4TH5HEnh2VnrmqavgD7iguWnPlhq/j5ZARLzq5E125r2Udgcux4968e74LpsTNuB1j/WzxOQDA1Zos3VFb3G2FybOpOtLJuN8EUWCiljozbXfvyGJaZLbv65tePb2DJWWhNtDnvME0W+xJ1v5PDBFmsjTtMnlmdvG43wUTYtXL95X4nh2VnZa6HfepbgSky/nQHg+VmL2FX+59Kk/FAAAAAAElFTkSuQmCC',
        // 删除显示添加按钮
        // 1 凭证号码
        deleteContactAStyle: false,
        //联系人
        deleteContactStyle: false,

        //绑卡弹框显示
        cardDisable: false,
        // 弹窗显示
        dialogVisible: false,
        cardId: '',
        // 往右侧传值的字段
        stepStyleobj: {
          stepStyle: 5
        },
        // 相似档案显示隐藏
        patientListShow: true,
        // add页面的显示
        htmlShow: true,
        // 编辑
        eihtmlShow: false,
        // 档案初始化显示
        htmlShowStyle: true,
        checked: '',
        active: 0, //切换步骤
        toolBoxs: ['RealName', 'FaceRecognition', 'edicalreatmentGuide'],
        // 相似档案列表
        patientList: [],
        //form表单
        recordForm: {
          headImg: require('@/assets/pojehjdz.jpeg'),
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
          patientCode: '',
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
          settlementType: '1',
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
          currentAddress: [2595, 2623, 2625],
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
          patientName: [{
            required: true,
            validator: patientNameValidate,
            trigger: 'blur'
          }],
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

          // 联系地址


          birthDate: [{
            required: true,
            validator: notNull,
            msg: '生日不能为空？',
            trigger: 'blur'
          }],
          fiduciaryName: [{
            validator: patientNameValidateA,
            trigger: 'blur'
          }],
          mobileNum: [{
            required: true,
            validator: mobileNumValidate,
            trigger: 'blur'
          }],
          otherMobileNum: [{
            validator: concatPhone,
            trigger: 'blur'
          }],
          workTelephone: [{
            validator: concatPhone,
            trigger: 'blur'
          }],
          phone: [{
            validator: concatPhone,
            trigger: 'blur'
          }],
          houseHoldPostpode: [{
            validator: postCodeValidate,
            trigger: 'blur'
          }],
          currentPostpode: [{
            validator: postCodeValidate,
            trigger: 'blur'
          }],
          identificationNum: [{
            validator: idNumbertest,
            trigger: 'blur'
          }],
          identificationType: [{
            validator: identifyTypeValidate,
            trigger: 'change'
          }],
          archIdentificationNum: [{
            validator: archIdentifyTypeValidate,
            trigger: 'blur'
          }],
          archGIdentificationNum: [{
            validator: archGIdentifyTypeValidate,
            trigger: 'blur'
          }],
          otherPhoneNum: [{
            validator: concatPhoneArch,
            trigger: 'blur'
          }],
          weight: [{
            validator: integerCheck,
            trigger: 'blur'
          }],
          height: [{
            validator: integerCheck,
            trigger: 'blur'
          }]
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
        // 禁止编辑极端
        disableEditing: false,
        //
        cardForm: {
          cardData: '',
          cardType: 1,
          cardTime: '',
          cardStatus: '1',
        },
      };
    },
    // 父组件中返回要传给下级的数据
    provide() {
      return {
        stepStyleobj: this.stepStyleobj
      };
    },
    computed: {},
    methods: {
      // 自动添加身份证号
      addId(a) {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        let nowDate = year + "-" + month + "-" + day;
        this.cardForm.cardTime = nowDate;
        this.cardForm.cardData = a;
        for (let i = 0; i < this.cardList.length; i++) {
          if (this.cardList[i].cardType == '1') {
            this.cardList.splice(i, 1);
          }
        }
        this.changeCardDisable(false, this.cardForm)
      },

      toFillinDetermine() {
        this.toFillinStyle = false;
        this.toFillinStyleA = true;
      },
      // 重新填写身份证号
      toFillinDetermineA() {
        this.recordForm.identificationNum = this.formLabelId;
        this.toFillinStyleA = false;
        this.identifiBlur();
        this.formLabelId = '';
      },
      // 调阅健康档案的
      toFillinStyleCancel() {
        this.$emit('cancelstyle', false, this.itemObj);
        this.toFillinStyle = false;
      },
      patientListFunData(item, showData) {
        this.readTheData = item;
        //清空倒计时
        this.setTimeOuts(0);
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
          this.recordForm.birthDate = this.recordForm.birthDate;
          this.initMobileNum = this.recordForm.mobileNum;

          this.stepStyleobj.patientName = this.recordForm.patientName;
          this.stepStyleobj.identificationNum = this.recordForm.identificationNum;
          this.stepStyleobj.mobileNum = this.recordForm.mobileNum;
          this.stepStyleobj.birthDate = this.recordForm.birthDate;
          this.stepStyleobj.patientId = this.recordForm.patientId;
          if (this.recordForm.identificationNum) {
            // 禁止输入
            this.disableEditing = true;
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
          if (this.recordForm.archGuarantorList.length == 0) {
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
        }
        // 凭证
        if (item.patientEmpiInfoOtherCredentialsVOS) {
          this.patientEmpiInfoOtherCredentialsVOS = [];
          this.patientEmpiInfoOtherCredentialsVOS = item.patientEmpiInfoOtherCredentialsVOS;
          this.recordForm.archGuarantorListA = this.patientEmpiInfoOtherCredentialsVOS;
          if (this.recordForm.archGuarantorListA.length == 0) {
            this.deleteContactAStyle = true;
          }
        } else {
          this.patientEmpiInfoOtherCredentialsVOS = [];
          this.recordForm.archGuarantorListA = [];
        }
        // 卡
        if (item.archCardList) {
          this.archCardList = item.archCardList;
          this.cardList = item.archCardList;
        } else {
          this.archCardList = [];
        }

      },

      // 取消
      cancel() {
        this.$emit('cancelstyle', false)
      },

      // 绑卡获取值
      getparentRun() {
        return this.recordForm.patientId;
      },
      //绑卡
      bind() {
        this.cardDisable = true;
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
        // await this.getCordByPatientId();
        this.$emit("refsChild");
      },
      // 获取患者所有卡
      async getCordByPatientId() {
        let param = {
          patientId: this.recordForm.patientId
        };
        let res = await getCordByPatientId(param);
        // this.cardList = res.data;
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
        this.cardList = [];
        //清空倒计时
        this.setTimeOuts(0);
      },

      // 新建档案
      addnewFile() {
        // 禁止输入
        this.disableEditing = false;
        // add页面的显示
        this.htmlShow = true;
        // 编辑
        this.eihtmlShow = false;
        // 档案初始化显示
        this.htmlShowStyle = false;
      },
      // 编辑
      cardTitleFun() {
        // 禁止输入
        this.disableEditing = true;

        this.htmlShow = true;
        // 编辑
        this.eihtmlShow = false;
        // 档案初始化显示
        this.htmlShowStyle = false;
      },
      // 取消
      cancelFun() {
        this.htmlShow = true;
        // 编辑
        this.eihtmlShow = false;
        // 档案初始化显示
        this.htmlShowStyle = false;
        this.emptyFun();
      },

      UnboundFun(a, b) {
        if (b == '1') {
          this.$message.error("身份证不可解绑");
        } else {
          this.dialogVisible = true;
          this.cardId = a;
        }
      },
      async handleClose() {
        for (let i = 0; i < this.cardList.length; i++) {
          if (i == this.cardId) {
            this.cardList.splice(i, 1)
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

      // 获取患者列表
      async getPatientArchInfo(obj) {
        try {
          let res = await getPatientArchInfo(obj);
          let patientListData = res.data;
          if (this.sizedata.pageNo == 1) {
            this.patientList = patientListData;
          } else {
            this.patientList = this.patientList.concat(patientListData);
          }

          this.patientListShow = false;

          if (this.patientList.length > 0) {
            this.htmlShow = true;
            // 编辑
            this.eihtmlShow = false;
            // 档案初始化显示
            this.htmlShowStyle = false;
          }
        } catch (error) {}
      },

      //element组件input无法输入问题
      inputChange(e) {
        this.$forceUpdate();
      },
      // 校验邮箱
      emailFun(item) {
        // item.email
         let reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
        if (reg.test(item.email)) {} else {
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
        let testStr = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        if (testStr.test(this.recordForm.identificationNum)) {
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
          let birthDateStart = new Date(birthDate);
          let birthDateEnd = new Date();
          if (Number(str).toString().length == 8) {
            this.recordForm.birthDate = birthDate;
            this.getAgeByBirthDate();
          }
          if(birthDateEnd>birthDateStart){
              this.disableEditingother = true;
              this.addId(this.recordForm.identificationNum);
          }else{
            this.$message.error('身份证号格式不正确,生日不可以超出当前时间');
          }
        } else {
          this.disableEditingother = false;
          this.$message.error('身份证号格式不正确');
        }
      },
      //发送验证码
      async getVeriCode() {
        let msg = 60;
        let phoneNum = this.recordForm.mobileNum;
        let str = /^1([38]\d|4[5-9]|5[0-35-9]|6[56]|7[0-8]|9[189])\d{8}$/;
        if (!this.recordForm.identificationNum || this.recordForm.identificationNum.length <= 0) {
          this.$message.error('身份号不能为空');
          return false;
        }
        if (!phoneNum) {
          this.$message.error('手机号码不能为空');
        } else if (!str.test(phoneNum)) {
          this.$message.error('手机号码格式不正确');
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

      //提交表单
      submit() {
        this.$refs['recordForm'].validate(async valid => {
          if (valid) {
            // if (!this.recordForm.patientName || this.recordForm.patientName.length <= 0) {
            //   this.$message.error('姓名不能为空');
            //   return false;
            // }
            // if (!this.recordForm.patientGender || this.recordForm.patientGender.length <= 0) {
            //   this.$message.error('性别不能为空');
            //   return false;
            // }
            // if (!this.recordForm.birthDate || this.recordForm.birthDate.length <= 0) {
            //   this.$message.error('出身日期不能为空');
            //   return false;
            // }
            // // recordForm.identificationNum
            // recordForm.identificationNum
            if (!this.recordForm.identificationNum || this.recordForm.identificationNum.length <= 0) {
              this.$message.error('身份证不能为空');
              return false;
            }
            if (!this.recordForm.mobileNum || this.recordForm.mobileNum.length <= 0) {
              this.$message.error('手机号不能为空');
              return false;
            }

               // let str = /\d{3}-\d{8}|\d{4}-\{7,8}/;
               // if (!this.recordForm.mobileNum || this.recordForm.mobileNum.length <= 0) {
               //   this.$message.error('手机号不能为空');
               //   return false;
               // }

            this.$showLoading();
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
              this.emptyFun();
              // this.$refs.child.queryFun();
              this.itemObj = result.data;
              // this.$emit('refsChild');
              this.$emit('cancelstyle', false, result.data);
            } else if (result.code == '5') {
              this.itemObj = result.data;
              this.toFillinStyle = true;
            } else {
              this.$message.error(result.msg || '保存失败');
            }
            this.$hideLoading();
          } else {
            // this.$message.error("请填写必填项！！");

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
        let changeItem = { ...item
        };
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
        if (index == 0) {
          this.deleteContactStyle = true;
        } else {
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
        let changeItem = { ...item
        };
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
        if (index == 0) {
          this.deleteContactAStyle = true;
        } else {
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
    },
    created() {
      this.addArchGuarantorList();
      this.addArchGuarantorListA();
    }
  };
</script>

<style scoped lang="scss">
  .titleStyle {
    padding: 20px;
    display: inline-block;
  }

  /deep/ .el-dialog--center .el-dialog__body {
    padding: 0px 15px;
  }

  .formLabelIdStyle {
    min-height: 50px;
    padding: 15px;
  }

  .width1024-33 .input-con {
    /deep/ .el-input {
      width: calc(100% - 96px) !important;
    }

    /deep/ .el-button {
      margin-left: $l-margin-default-4;
    }
  }

  .paddingStyle {
    width: 33px;
    height: 33px;
    margin-left: 8px;
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

  .height-button-main {
    height: 600px;
  }

  .heightButtonMain {
    height: calc(100% - 75px);
  }

  .recordCreate {
    overflow-y: auto;

    .cardtitle {
      height: 50px;
      line-height: 60px;
    }

    .card-cont1 {
      height: 100%;
      padding-top: 16px;

      .form-cont {
        padding: 0 16px;

        .realNameSystem {
          /*height: 38px;*/
          padding: 8px 0 8px 16px;
          margin-bottom: 16px;
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
        padding: 16px;
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
    margin-left: 0px !important;
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
    color: rgba(148, 157, 163, 1);
    line-height: 24px;
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
