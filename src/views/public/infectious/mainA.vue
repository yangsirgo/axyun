<template>
  <div class="container height100">
    <div class="reg-form">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
      >
        <div class="patient-box clearfix">
          <div class="patient-info positionStyle">
            <el-row class="paddingStyle">
              <el-col style="display: flex;align-items: center;justify-content: center;font-size: 20px;color: #000000;font-weight: 600;">中华人民共和国食源性疾病报告卡</el-col>
            </el-row>
            <el-col>
              <el-col
                :span="6"
                class="el-col-lineHeight"
              >
                <span>来源:</span>
                <span
                  :val="ruleForm.cardSource || '--'"
                  code="AdviceMedicationRange"
                  v-codeTransform
                ></span>
              </el-col>
              <el-col
                :span="6"
                class="el-col-lineHeight"
              >
                <span><span
                    :val="ruleForm.cardSource || '--'"
                    code="AdviceMedicationRange"
                    v-codeTransform
                  ></span>号:</span>
                <span>{{ruleForm.inpNo}}</span>
              </el-col>
              <el-col :span="6">
                <LFormtTitle label="是否住院">
                  <el-form-item
                    prop=""
                    label-width="10px"
                  >
                    <el-radio
                      v-model="ruleForm.isVisitPatient"
                      label="1"
                    >是</el-radio>
                    <el-radio
                      v-model="ruleForm.isVisitPatient"
                      label="2"
                    >否</el-radio>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="6">
                <LFormtTitle label="病例编号">
                  <el-form-item prop="">
                    <el-input
                      placeholder
                      :disabled="true"
                      v-model="ruleForm.mrId"
                    ></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-col>

            <el-col>
              <el-col
                :span="6"
                class="el-col-lineHeight"
              >
                <span>患者编号:</span>
                <span>{{ruleForm.patientcode}}</span>
              </el-col>
              <el-col
                :span="6"
                class="el-col-lineHeight"
              >
                <span>姓名:</span>
                <span>{{ruleForm.patientName}}</span>
              </el-col>
              <el-col
                :span="6"
                class="el-col-lineHeight"
              >
                <span>性别:</span>
                <span
                  :val="ruleForm.sex || '--'"
                  code="GENDER_CODE"
                  v-codeTransform
                ></span>
              </el-col>
              <el-col
                :span="4"
                class="el-col-lineHeight"
              >
                <LFormtTitle label="出生日期">
                  <el-form-item prop="">
                    <el-input
                      placeholder
                      v-model="ruleForm.birthday"
                    ></el-input>
                  </el-form-item>

                </LFormtTitle>
              </el-col>
              <el-col :span="2"><span
                  style="height: 39px; width: 100%;display: flex;align-items: center;justify-content: center;"
                  v-if="ruleForm.age"
                >（{{ruleForm.age}}）</span></el-col>
            </el-col>

            <el-col>
              <el-col
                :span="6"
                class="marginStyle"
              >
                <LFormtTitle label="身份证号">
                  <el-form-item prop="paperwork">
                    <el-input
                      placeholder
                      v-model="ruleForm.paperwork"
                      maxlength="18"
                    ></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col
                :span="6"
                class="marginStyle"
              >
                <LFormtTitle label="监护人姓名">
                  <el-form-item prop="">
                    <el-input
                      placeholder
                      v-model="ruleForm.guardianName"
                    ></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col
                :span="6"
                class="marginStyle"
              >
                <el-form-item prop="telephone">
                  <LFormtTitle
                    label="联系电话"
                    required
                  >
                    <el-input
                      placeholder
                      v-model="ruleForm.telephone"
                      maxlength="11"
                    ></el-input>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <LFormtTitle label="职业">
                  <el-form-item prop="careerCode">
                    <!-- :value.sync="recordForm.careerCode" -->
                    <l-value-domain
                      :code="selectCode.careerCode"
                      :value.sync="ruleForm.profession"
                      class="select-container"
                      :placeholder="$t('base.placeholder')"
                      key="key4"
                    ></l-value-domain>
                  </el-form-item>
                </LFormtTitle>
              </el-col>

            </el-col>

            <el-col>
              <el-col
                :span="6"
                class="marginStyle"
              >
                <el-form-item prop="patientType">
                  <LFormtTitle
                    label="病人属于"
                    required
                  >
                    <!-- <el-input placeholder v-model="ruleForm.patientType"></el-input> -->
                    <l-value-domain
                      :code="selectCode.PatientBelong"
                      :value.sync="ruleForm.patientType"
                      class="select-container"
                      :placeholder="$t('base.placeholder')"
                      key="key4"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
                class="marginStyle"
              >
                <el-form-item prop="address">
                  <LFormtTitle
                    label="居住地址"
                    required
                  >
                    <l-value-domain
                      type="cascader"
                      :code="selectCode.domicile"
                      :value.sync="ruleForm.address"
                      class="select-container"
                      remoteValueKey="id"
                      remoteShowKey="label"
                      @change='address'
                      :multiple="false"
                      :relation="true"
                      :placeholder="$t('base.placeholder')"
                      key="key13"
                    ></l-value-domain>

                  </LFormtTitle>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="doorplateAddressCode">
                  <LFormtTitle
                    label="详细地址"
                    required
                  >
                    <el-input
                      placeholder
                      v-model="ruleForm.doorplateAddressCode"
                      maxlength="50"
                      show-word-limit
                    ></el-input>
                  </LFormtTitle>
                </el-form-item>
              </el-col>

            </el-col>

            <el-col>
              <el-col
                :span="12"
                class="marginStyle"
              >
                <el-form-item prop="diagCode">
                  <LFormtTitle
                    label="疾病诊断"
                    required
                  >

                    <!-- <el-input placeholder v-model="ruleForm.diagCode"></el-input> -->
                    <l-value-domain
                      style="width:100%"
                      remoteUrl="/common/patDiag/getIcd10Dictionary"
                      :remoteParams="remoteParams"
                      :value.sync="ruleForm.diagCode"
                      placeholder="请输入诊断名称"
                      remoteShowKey="dictionaryName"
                      remoteValueKey="icd10Encoding"
                      class="input-width-default"
                      @change="diagNameChange"
                    ></l-value-domain>
                  </LFormtTitle>
                </el-form-item>
              </el-col>

              <el-col
                :span="6"
                class="marginStyle"
              >
                <el-form-item prop="visDate">
                  <LFormtTitle
                    label="就诊时间"
                    required
                  >
                    <el-date-picker
                      v-model="ruleForm.visDate"
                      type="datetime"
                      :picker-options="pickerOptions0"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择就诊日期"
                    ></el-date-picker>
                  </LFormtTitle>
                </el-form-item>
              </el-col>

              <el-col
                :span="6"
                class="marginStyle"
              >
                <el-form-item prop="onsetDate">
                  <LFormtTitle
                    label="发病时间"
                    required
                  >
                    <el-date-picker
                      v-model="ruleForm.onsetDate"
                      type="datetime"
                      :picker-options="pickerOptions0"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="请选择就诊日期"
                    ></el-date-picker>
                  </LFormtTitle>
                </el-form-item>
              </el-col>

            </el-col>

            <el-col>
              <el-col
                :span="24"
                style="margin-bottom: 8px;"
              >
                <LFormtTitle label="既往病史">
                  <el-form-item prop="">
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      maxlength="100"
                      show-word-limit
                      v-model="ruleForm.medicalHistory"
                    >
                    </el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-col>

            <el-col>
              <el-col
                :span="12"
                class="marginStyle"
              >
                <el-col
                  :span="12"
                  class="marginStyle"
                >
                  <el-form-item
                    prop="isDeath"
                    label-width="10px"
                  >
                    <LFormtTitle
                      label="是否已死亡"
                      required
                    >
                      <el-radio
                        v-for="(item, i) in sexOptions"
                        :key="i"
                        v-model="ruleForm.isDeath"
                        :label="item.value"
                      >{{ item.label }}</el-radio>
                    </LFormtTitle>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <LFormtTitle label="死亡时间">
                    <el-form-item prop="">
                      <el-date-picker
                        v-model="ruleForm.deathDate"
                        type="datetime"
                        :picker-options="pickerOptions0"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="请选择就诊日期"
                      ></el-date-picker>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>

              </el-col>
              <el-col :span="12">
                <el-col
                  :span="12"
                  class="marginStyle"
                >
                  <el-form-item
                    prop="isCorrectDiagnosis"
                    label-width="10px"
                  >
                    <LFormtTitle
                      label="就诊前时候使用过抗生素"
                      required
                    >
                      <el-radio
                        v-for="(item, i) in sexOptions"
                        :key="i"
                        v-model="ruleForm.isCorrectDiagnosis"
                        :label="item.value"
                      >{{ item.label }}</el-radio>
                    </LFormtTitle>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <LFormtTitle label="药物名称">
                    <el-form-item prop="">
                      <el-input
                        placeholder
                        v-model="ruleForm.antibiotic"
                      ></el-input>
                    </el-form-item>
                  </LFormtTitle>
                </el-col>
              </el-col>
            </el-col>

            <el-col class="symptomsWrap width100">
              <!-- 蓝色病症部分 -->
              <el-col
                class="symptomsWrapbox width100"
                id="symptomsWrapbox"
              >
                <el-col class="width100 el-col-border-b symptomWrap">
                  <!-- class="el-col-border-b" -->
                  <el-col
                    :span='4'
                    class="displayStyle"
                  >全身症状体征 <span style="color: red;">*</span></el-col>
                  <el-col
                    :span='20'
                    class="el-col-border-l"
                  >
                    <el-col class="el-col-list">
                      <el-col
                        :span="4"
                        class="displayStyle displayStyle-center"
                      >
                        <el-checkbox
                          label="发热"
                          name="type"
                          class="symptom"
                          v-model="ruleForm.fare"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                        <el-input
                          placeholder
                          v-model="ruleForm.fareTemperature"
                          class="width80"
                        ></el-input>
                        <span>℃</span>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="面色潮红"
                          class="symptom"
                          v-model="ruleForm.miansechaohong"
                          @change="symptomFun"
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="面色苍白"
                          class="symptom"
                          v-model="ruleForm.miansecangbai"
                          @change="symptomFun"
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="发绀"
                          class="symptom"
                          v-model="ruleForm.fagan"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="脱水"
                          class="symptom"
                          v-model="ruleForm.tuoshui"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="口渴"
                          class="symptom"
                          v-model="ruleForm.kouke"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                    </el-col>

                    <el-col class="el-col-list">
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="浮肿"
                          class="symptom"
                          name="type"
                          v-model="ruleForm.fuzhong"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="体重下降"
                          class="symptom"
                          v-model="ruleForm.tizhongxiajiang"
                          @change="symptomFun"
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="寒战"
                          class="symptom"
                          v-model="ruleForm.hanzhan"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="乏力"
                          class="symptom"
                          v-model="ruleForm.fali"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="贫血"
                          class="symptom"
                          v-model="ruleForm.pinxue"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="肿胀"
                          class="symptom"
                          v-model="ruleForm.zhongzhang"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                    </el-col>

                    <el-col class="el-col-list">
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="失眠"
                          name="type"
                          class="symptom"
                          v-model="ruleForm.shimian"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="畏光"
                          class="symptom"
                          v-model="ruleForm.weiguang"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="口有糊味"
                          class="symptom"
                          v-model="ruleForm.kouyouhuwei"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="金属味"
                          class="symptom"
                          v-model="ruleForm.jinshuwei"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="肥皂/咸味"
                          class="symptom"
                          v-model="ruleForm.feizaoxianwei"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="唾液过多"
                          class="symptom"
                          v-model="ruleForm.tuoyeguoduo"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                    </el-col>

                    <el-col class="el-col-list">
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="足/腕下垂"
                          class="symptom"
                          name="type"
                          v-model="ruleForm.zuwanxiachui"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="色素沉着"
                          class="symptom"
                          v-model="ruleForm.sesuchenzhuo"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="脱皮"
                          class="symptom"
                          v-model="ruleForm.tuopi"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="指甲出现白带"
                          class="symptom"
                          v-model="ruleForm.baidai"
                          name="type"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="其他"
                          name="type"
                          class="symptom"
                          v-model="ruleForm.wbOth"
                          @change="symptomFun"
                          true-label="1"
                        ></el-checkbox>
                        <el-input
                          placeholder
                          class="width80"
                          v-model="ruleForm.wbOther"
                        ></el-input>
                      </el-col>
                    </el-col>
                  </el-col>
                </el-col>

                <el-col class="width100 el-col-border-b">
                  <!-- class="el-col-border-b" -->
                  <el-col
                    :span='4'
                    class="displayStyle"
                  >消化系统<span style="color: red;">*</span></el-col>
                  <el-col
                    :span='20'
                    class="el-col-border-l"
                  >
                    <el-col class="el-col-list">

                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="恶心"
                          v-model="ruleForm.exin"
                          class="digestiveSystem"
                          @change="digestiveSystem"
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="呕吐"
                          name="type"
                          class="digestiveSystem"
                          true-label="1"
                          @change="digestiveSystem"
                          v-model="ruleForm.outu"
                        ></el-checkbox>
                        <el-input
                          placeholder
                          class="width80"
                          v-model="ruleForm.emesisCount"
                        ></el-input>
                        <span>次/天</span>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="腹痛"
                          class="digestiveSystem"
                          v-model="ruleForm.futong"
                          @change="digestiveSystem"
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="腹泻"
                          class="digestiveSystem"
                          name="type"
                          true-label="1"
                          @change="digestiveSystem"
                          v-model="ruleForm.fuxie"
                        ></el-checkbox>
                        <el-input
                          placeholder
                          class="width80"
                          v-model="ruleForm.diarrheaCount"
                        ></el-input>
                        <span>次/天</span>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="黑便"
                          class="digestiveSystem"
                          v-model="ruleForm.heibian"
                          @change="digestiveSystem"
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="便秘"
                          class="digestiveSystem"
                          v-model="ruleForm.bianmi"
                          @change="digestiveSystem"
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                    </el-col>

                    <el-col class="el-col-list">
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="里急后重"
                          class="digestiveSystem"
                          name="type"
                          v-model="ruleForm.lijihouzhong"
                          @change="digestiveSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="其他"
                          class="digestiveSystem"
                          name="type"
                          v-model="ruleForm.digOth"
                          @change="digestiveSystem"
                          true-label="1"
                        ></el-checkbox>
                        <el-input
                          placeholder
                          class="width80"
                          v-model="ruleForm.digOther"
                        ></el-input>
                        <span>次/天</span>
                      </el-col>

                    </el-col>
                    <el-col class="el-col-list">
                      <el-col
                        :span="24"
                        class="displayStyle"
                      >
                        <el-form-item
                          label="性状"
                          label-width="80px"
                        >
                          <el-checkbox-group v-model="characterData">
                            <!-- ruleForm.diarrheaCharacter次字段 -->
                            <el-checkbox
                              :label="item.name"
                              name="1"
                              v-for="(item,index) in character"
                              :key="index"
                            ></el-checkbox>
                          </el-checkbox-group>
                        </el-form-item>
                      </el-col>
                    </el-col>
                  </el-col>
                </el-col>

                <!-- 呼吸系统 -->
                <el-col class="width100 el-col-border-b">
                  <!-- class="el-col-border-b" -->
                  <el-col
                    :span='4'
                    class="displayStyle"
                  >呼吸系统<span style="color: red;">*</span></el-col>
                  <el-col
                    :span='20'
                    class="el-col-border-l"
                  >
                    <el-col class="el-col-list">
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="呼吸短促"
                          name="type"
                          class="respiratorySystem"
                          v-model="ruleForm.huxiduancu"
                          @change='respiratorySystem'
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="咯血"
                          name="type"
                          class="respiratorySystem"
                          v-model="ruleForm.kexue"
                          @change='respiratorySystem'
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="呼吸困难"
                          class="respiratorySystem"
                          v-model="ruleForm.huxikunnan"
                          @change='respiratorySystem'
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="其他"
                          name="type"
                          class="respiratorySystem"
                          v-model="ruleForm.brtOth"
                          @change='respiratorySystem'
                          true-label="1"
                        ></el-checkbox>
                        <el-input
                          placeholder
                          class="width80"
                          v-model="ruleForm.brtOther"
                        ></el-input>
                      </el-col>
                    </el-col>

                  </el-col>
                </el-col>
                <!-- 心脑血管系统 -->
                <el-col class="width100 el-col-border-b">
                  <!-- class="el-col-border-b" -->
                  <el-col
                    :span='4'
                    class=" displayStyle"
                  >心脑血管系统<span style="color: red;">*</span></el-col>
                  <el-col
                    :span='20'
                    class="el-col-border-l"
                  >
                    <el-col class="el-col-list">
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="胸闷"
                          name="type"
                          class="cardioCer"
                          v-model="ruleForm.xiongmen"
                          @change='cardioCer'
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="胸痛"
                          name="type"
                          class="cardioCer"
                          v-model="ruleForm.xiongtong"
                          @change='cardioCer'
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="心悸"
                          v-model="ruleForm.xinji"
                          class="cardioCer"
                          name="type"
                          @change='cardioCer'
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="气短"
                          v-model="ruleForm.qiduan"
                          class="cardioCer"
                          name="type"
                          @change='cardioCer'
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="其他"
                          name="type"
                          class="cardioCer"
                          v-model="ruleForm.habOth"
                          @change='cardioCer'
                          true-label="1"
                        ></el-checkbox>
                        <el-input
                          placeholder
                          class="width80"
                          v-model="ruleForm.habOther"
                        ></el-input>
                      </el-col>
                    </el-col>
                  </el-col>
                </el-col>
                <!-- 泌尿系统 -->
                <el-col class="width100 el-col-border-b">
                  <el-col
                    :span='4'
                    class="displayStyle"
                  >泌尿系统<span style="color: red;">*</span></el-col>
                  <el-col
                    :span='20'
                    class="el-col-border-l"
                  >
                    <el-col class="el-col-list">
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="尿量减少"
                          class="urinarySystem"
                          v-model="ruleForm.niaoliangjianshao"
                          @change='urinarySystem'
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="背部/肾区疼痛"
                          class="urinarySystem"
                          v-model="ruleForm.beibushenqutengtong"
                          @change='urinarySystem'
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="肾结石"
                          v-model="ruleForm.shenjieshi"
                          class="urinarySystem"
                          @change='urinarySystem'
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="尿中带血"
                          v-model="ruleForm.niaozhongdaixue"
                          class="urinarySystem"
                          @change='urinarySystem'
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="其他"
                          name="type"
                          v-model="ruleForm.uriOth"
                          class="urinarySystem"
                          @change='urinarySystem'
                          true-label="1"
                        ></el-checkbox>
                        <el-input
                          placeholder
                          class="width80"
                          v-model="ruleForm.uriOther"
                        ></el-input>
                      </el-col>
                    </el-col>
                  </el-col>
                </el-col>
                <!-- 神经系统 -->
                <el-col class="width100 el-col-border-b">
                  <!-- class="el-col-border-b" -->
                  <el-col
                    :span='4'
                    class="displayStyle"
                  >神经系统<span style="color: red;">*</span></el-col>
                  <el-col
                    :span='20'
                    class="el-col-border-l"
                  >
                    <el-col class="el-col-list">
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="头痛"
                          v-model="ruleForm.toutong"
                          class="nervousSystem"
                          @change="nervousSystem"
                          name="type"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="昏迷"
                          name="type"
                          v-model="ruleForm.hunmi"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="惊厥"
                          v-model="ruleForm.jingjue"
                          name="type"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="谊妄"
                          name="type"
                          v-model="ruleForm.yiwang"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="瘫痪"
                          v-model="ruleForm.tanhuan"
                          name="type"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="言语困难"
                          v-model="ruleForm.yanyukunnan"
                          class="nervousSystem"
                          name="type"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                    </el-col>

                    <el-col class="el-col-list">

                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="吞咽困难"
                          v-model="ruleForm.tunyankunnan"
                          class="nervousSystem"
                          name="type"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="感觉异常"
                          name="type"
                          v-model="ruleForm.ganjueyichang"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="精神失常"
                          v-model="ruleForm.jingshenshichang"
                          name="type"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="复试"
                          name="type"
                          v-model="ruleForm.fushi"
                          @change="nervousSystem"
                          class="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="视力模糊"
                          v-model="ruleForm.shilimohu"
                          name="type"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="眩晕"
                          v-model="ruleForm.xuanyun"
                          name="type"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                    </el-col>

                    <el-col class="el-col-list">
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="眼帘下垂"
                          name="type"
                          v-model="ruleForm.yanjianxiachui"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>

                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="肢体麻木"
                          v-model="ruleForm.zhitimamu"
                          name="type"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="末梢感觉障碍"
                          v-model="ruleForm.moshaoganjuezhangai"
                          class="nervousSystem"
                          name="type"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="针刺感"
                          v-model="ruleForm.zhencigan"
                          name="type"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="抽搐"
                          v-model="ruleForm.chouchu"
                          name="type"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="其他"
                          name="type"
                          v-model="ruleForm.pupOth"
                          class="nervousSystem"
                          @change="nervousSystem"
                          true-label="1"
                        ></el-checkbox>
                        <el-input
                          placeholder
                          class="width80"
                          v-model="ruleForm.pupOther"
                        ></el-input>
                        <span>次/天</span>
                      </el-col>
                    </el-col>
                    <el-col class="el-col-list">
                      <el-col
                        :span="24"
                        class="displayStyle"
                      >
                        <el-form-item
                          label="瞳孔异常"
                          label-width="80px"
                        >
                          <el-checkbox-group v-model="pupilAbnData">
                            <!-- 瞳孔异常 ruleForm.tongkongyichang -->
                            <el-checkbox
                              :label="item.name"
                              name="1"
                              v-for="(item,index) in pupilAbn"
                              :key="index"
                            ></el-checkbox>
                          </el-checkbox-group>
                        </el-form-item>
                      </el-col>
                    </el-col>
                  </el-col>
                </el-col>
                <!-- 皮肤和皮下组织 -->
                <el-col class="width100 el-col-border-b">
                  <el-col
                    :span='4'
                    class="displayStyle"
                  >皮肤和皮下组织<span style="color: red;">*</span></el-col>
                  <el-col
                    :span='20'
                    class="el-col-border-l"
                  >
                    <el-col class="el-col-list">
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="瘙痒"
                          name="type"
                          v-model="ruleForm.saoyang"
                          class="theSkin"
                          @change='theSkin'
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="烧灼感"
                          name="type"
                          v-model="ruleForm.shaozhuogan"
                          class="theSkin"
                          @change='theSkin'
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="皮疹"
                          v-model="ruleForm.pizhen"
                          name="type"
                          class="theSkin"
                          @change='theSkin'
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="出血点"
                          v-model="ruleForm.chuxuedian"
                          name="type"
                          class="theSkin"
                          @change='theSkin'
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="黄疸"
                          v-model="ruleForm.huangdan"
                          name="type"
                          class="theSkin"
                          @change='theSkin'
                          true-label="1"
                        ></el-checkbox>
                      </el-col>
                      <el-col
                        :span="4"
                        class="displayStyle"
                      >
                        <el-checkbox
                          label="其他"
                          name="type"
                          v-model="ruleForm.sksOth"
                          class="theSkin"
                          @change='theSkin'
                          true-label="1"
                        ></el-checkbox>
                        <el-input
                          placeholder
                          class="width80"
                          v-model="ruleForm.sksOther"
                        ></el-input>
                      </el-col>
                    </el-col>
                  </el-col>
                </el-col>

              </el-col>
            </el-col>
            <!--  -->
            <el-col>
              <el-col :span="24">
                <el-form-item
                  label="是否怀疑进食某些食品后出现症状"
                  label-width="230px"
                >
                  <el-radio-group
                    v-model="ruleForm.isReal"
                    @change="foodDataFun"
                  >
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col style="overflow: hidden;">
                <el-table
                  :data="phcFoodVOList"
                  stripe
                  height="200px"
                  width='100%'
                  v-if="foodStyle"
                >
                  <el-table-column
                    label="序号"
                    type="index"
                  ></el-table-column>
                  <el-table-column
                    label="食品名称"
                    :render-header="renderHeader"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'phcFoodVOList.'+ scope.$index +'.foodName'"
                        :rules="rules.foodName"
                      >
                        <el-input
                          placeholder
                          v-model="scope.row.foodName"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="食品分类">
                    <template slot-scope="scope">
                      <el-form-item prop="">
                        <l-value-domain
                          :code="selectCode.FoodClassification"
                          :value.sync="scope.row.foodType"
                          class="select-container"
                          :placeholder="$t('base.placeholder')"
                          key="key4"
                        ></l-value-domain>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="加工或包装方式">
                    <template slot-scope="scope">
                      <el-form-item prop="">
                        <l-value-domain
                          :code="selectCode.ProcessingOrPackagingMethod"
                          :value.sync="scope.row.processingOrPackaging"
                          class="select-container"
                          :placeholder="$t('base.placeholder')"
                          key="key4"
                        ></l-value-domain>
                      </el-form-item>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="食品品牌">
                    <template slot-scope="scope">
                      <el-form-item prop="">
                        <el-input
                          placeholder
                          v-model="scope.row.foodBrand"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="生产厂家">
                    <template slot-scope="scope">
                      <el-form-item prop="">
                        <el-input
                          placeholder
                          v-model="scope.row.manufacturer"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="进食场所"
                    :render-header="renderHeader"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'phcFoodVOList.'+ scope.$index +'.eatingPlaces'"
                        :rules="rules.eatingPlaces"
                      >
                        <el-input
                          placeholder
                          v-model="scope.row.eatingPlaces"
                        ></el-input>

                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="进食场所类型">
                    <template slot-scope="scope">
                      <el-form-item prop="">
                        <l-value-domain
                          :code="selectCode.EatingOrBuyingPlaceType"
                          :value.sync="scope.row.eatingPlaceType"
                          class="select-container"
                          :placeholder="$t('base.placeholder')"
                          key="key4"
                        ></l-value-domain>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="进食时间"
                    :render-header="renderHeader"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'phcFoodVOList.'+ scope.$index +'.eatingTime'"
                        :rules="rules.eatingTime"
                      >
                        <el-date-picker
                          v-model="scope.row.eatingTime"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择就诊日期"
                        ></el-date-picker>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="进食人数"
                    :render-header="renderHeader"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'phcFoodVOList.'+ scope.$index +'.eatingPeople'"
                        :rules="rules.eatingPeople"
                      >
                        <el-input
                          placeholder
                          v-model="scope.row.eatingPeople"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="其他人是否发病"
                    :render-header="renderHeader"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'phcFoodVOList.'+ scope.$index +'.otherPersonIsIll'"
                        :rules="rules.otherPersonIsIll"
                      >
                        <!-- <el-input placeholder v-model="scope.row.otherPersonIsIll"></el-input> -->
                        <el-radio
                          v-model="scope.row.otherPersonIsIll"
                          label="1"
                        >是</el-radio>
                        <el-radio
                          v-model="scope.row.otherPersonIsIll"
                          label="2"
                        >否</el-radio>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="180"
                  >
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="phcFoodVOListAdd(scope.$index, scope.row)"
                      >添加</el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        @click="phcFoodVOListDelete(scope.$index, scope.row)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>

              </el-col>

            </el-col>

            <el-col>
              <el-col :span="24">
                <el-form-item
                  label="是否采集生物样本"
                  label-width="180px"
                >
                  <el-radio-group
                    v-model="ruleForm.hasSample"
                    @change="sampleDataFun"
                  >
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col style="overflow: hidden;">
                <el-table
                  :data="phcSampleVOList"
                  stripe
                  style="width: 100%"
                  height="200px"
                  v-if="sampleStyle"
                >
                  <el-table-column
                    label="序号"
                    type="index"
                  ></el-table-column>
                  <el-table-column
                    prop="name"
                    label="样本类型"
                    :render-header="renderHeader"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'phcSampleVOList.'+ scope.$index +'.sampleType'"
                        :rules="rules.sampleType"
                      >
                        <el-input
                          placeholder
                          v-model="scope.row.sampleType"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="采样日期"
                    :render-header="renderHeader"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'phcSampleVOList.'+ scope.$index +'.samplingDate'"
                        :rules="rules.samplingDate"
                      >
                        <el-date-picker
                          v-model="scope.row.samplingDate"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择就诊日期"
                        ></el-date-picker>
                      </el-form-item>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="样本数量"
                    :render-header="renderHeader"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'phcSampleVOList.'+ scope.$index +'.sampleSize'"
                        :rules="rules.sampleSize"
                      >
                        <el-input
                          placeholder
                          v-model="scope.row.sampleSize"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="单位"
                    :render-header="renderHeader"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="'phcSampleVOList.'+ scope.$index +'.sampleUnit'"
                        :rules="rules.sampleUnit"
                      >
                        <el-input
                          placeholder
                          v-model="scope.row.sampleUnit"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <el-form-item prop="">
                        <el-input
                          placeholder
                          v-model="scope.row.remark"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="phcSampleVOListAdd(scope.$index, scope.row)"
                      >添加</el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        @click="phcSampleVOListDelete(scope.$index, scope.row)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>

            </el-col>
            <el-col style="margin: 10px 0px;">
              <el-col
                :span="6"
                class="marginStyle"
              >
                <LFormtTitle label="报告科室">
                  <el-form-item prop="">
                    <el-input
                      placeholder
                      :disabled="false"
                      v-model="ruleForm.keshi"
                    ></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col
                :span="6"
                class="marginStyle"
              >
                <LFormtTitle label="报告医生">
                  <el-form-item prop="">
                    <el-input
                      placeholder
                      :disabled="false"
                      v-model="ruleForm.reportDoctor"
                    ></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col
                :span="6"
                class="marginStyle"
              >
                <LFormtTitle label="报告时间">
                  <el-form-item prop="">
                    <!-- <el-input placeholder :disabled="false" v-model="ruleForm.reportDate"></el-input -->
                    <el-date-picker
                      v-model="ruleForm.reportDate"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="报告时间"
                    ></el-date-picker>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
              <el-col :span="6">
                <LFormtTitle label="联系电话">
                  <el-form-item prop="">
                    <el-input
                      placeholder
                      :disabled="false"
                      v-model="ruleForm.deptPhone"
                    ></el-input>
                  </el-form-item>
                </LFormtTitle>
              </el-col>
            </el-col>

            <div
              class="zhezhao"
              v-if="!stateStyle"
            ></div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="handler-box">
      <el-button
        type=""
        @click='theStaging'
        v-if="stateStyle"
      >暂存</el-button>
      <el-button
        type=""
        @click="report"
        v-if="stateStyle"
      >上报</el-button>
    </div>
  </div>
</template>

<script>
// import leftBar from "@/views/ipnw/medicalAdvice/components/leftBar.vue";
import { saveFoodBorneCard, getPatientArchInfo } from "@/api/common/report.js";
import { mapGetters } from "vuex";
import { getPatientAddress } from "@/api/cis/admApplication/index";
import Base64 from "@/utils/base64";
import { getRoles, getRole, setRole } from "@/utils/auth";
export default {
  props: ["contentListFunRight", "baokaData"],
  components: {},
  data() {
    //联系方式（手机或者座机）
    let concatPhone = (rule, value, callback) => {
      let rules = /0?(13|14|15|18|17)[0-9]{9}/;
      let rule_telephone = /^((0\d{2,3}-\d{7,8})|(1[35847]\d{9}))$/;
      if (!value) {
        callback();
      } else if (!(rules.test(value) || rule_telephone.test(value))) {
        callback(new Error("手机号非法"));
      } else {
        callback();
      }
    };
    // 身份证号
    let concatIdCard = (rule, value, callback) => {
      let rules = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
      if (!value) {
        callback();
      } else if (rules.test(value) === false) {
        callback(new Error("身份证号码非法"));
      } else {
        callback();
      }
    };

    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 显示隐藏
      stateStyle: true,
      // 接受
      contentListFunRightData: this.contentListFunRight,
      // 全身症状体征
      symptomFunIndex: [],
      // 消化系统
      digestiveSystemIndex: [],
      // 呼吸系统
      respiratorySystemIndex: [],
      // Cardio-cer心脑血管
      cardioCerIndex: [],
      // 泌尿系统
      urinarySystemIndex: [],
      //神经系统
      nervousSystemIndex: [],
      // 皮肤
      theSkinIndex: [],

      remoteParams: {
        pageSize: 10
      },
      // 复选框数量
      checkList: [],

      // 显示隐藏字段start
      foodStyle: false,
      sampleStyle: false,
      // 显示隐藏字段 end
      // 单选框字段
      foodData: "0", //食品单选框
      sampleData: "0", // 标本的单选框
      // 神经系统
      // 瞳孔异常接口
      pupilAbnData: [],
      pupilAbn: [
        {
          id: "1",
          name: "扩大"
        },
        {
          id: "1",
          name: "固定"
        },
        {
          id: "1",
          name: "收缩"
        }
      ],
      // 性状列表
      characterData: [],
      character: [
        {
          id: "1",
          name: "水样便"
        },
        {
          id: "2",
          name: "米泔样便"
        },
        {
          id: "3",
          name: "粘液便"
        },
        {
          id: "4",
          name: "脓血便"
        },
        {
          id: "5",
          name: "洗肉样便"
        },
        {
          id: "6",
          name: "鲜血样便"
        }
      ],

      // 默认时候住院
      sexOptions: [
        // 性别
        {
          label: "是",
          value: "1"
        },
        {
          label: "否",
          value: "2"
        }
      ],
      // 返现code
      selectCode: {
        careerCode: "OCCUPATIONAL_CLASSIFICATION_CODE",
        domicile: "AdministrativDivision",
        FoodClassification: "FoodClassification",
        ProcessingOrPackagingMethod: "ProcessingOrPackagingMethod",
        EatingOrBuyingPlaceType: "EatingOrBuyingPlaceType",
        PatientBelong: "PatientBelong" //病人属于
      },
      //校验规则
      rules: {
        // 身份证号
        paperwork: [
          {
            required: true,
            validator: concatIdCard,
            message: "请输入正确身份证号",
            trigger: "blur"
          }
        ],
        telephone: [
          {
            required: true,
            validator: concatPhone,
            message: "请输入正确手机号",
            trigger: "blur"
          }
        ],
        patientType: [
          {
            required: true,
            message: "病人属于不能为空",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "地址不能为空",
            trigger: "blur"
          }
        ],
        doorplateAddressCode: [
          {
            required: true,
            message: "详细地址不能为空",
            trigger: "blur"
          }
        ],
        diagCode: [
          {
            required: true,
            message: "疾病诊断不能为空",
            trigger: "blur"
          }
        ],
        visDate: [
          {
            required: true,
            message: "就诊时间不能为空",
            trigger: "blur"
          }
        ],
        onsetDate: [
          {
            required: true,
            message: "发病时间不能为空",
            trigger: "blur"
          }
        ],
        isDeath: [
          {
            required: true,
            message: "选择是否死亡",
            trigger: "blur"
          }
        ],
        foodName: {
          required: true,
          message: "食品名称不能为空",
          trigger: "blur"
        },
        eatingPlaces: {
          required: true,
          message: "进食场所不能为空",
          trigger: "blur"
        },
        eatingTime: {
          required: true,
          message: "进食时间不能为空",
          trigger: "blur"
        },
        eatingPeople: {
          required: true,
          message: "进食人数不能为空",
          trigger: "blur"
        },
        otherPersonIsIll: {
          required: true,
          message: "其他人是否发病不能为空",
          trigger: "blur"
        },
        sampleType: {
          required: true,
          message: "样本类型不能为空",
          trigger: "blur"
        },
        samplingDate: {
          required: true,
          message: "采样日期不能为空",
          trigger: "blur"
        },
        sampleSize: {
          required: true,
          message: "样本数量不能为空",
          trigger: "blur"
        },
        sampleUnit: {
          required: true,
          message: "单位不能为空",
          trigger: "blur"
        },
        isCorrectDiagnosis: {
          required: true,
          message: "单位不能为空",
          trigger: "blur"
        }
      },

      caseNumber: "", // 病例编号
      // 传输参数
      ruleForm: {
        // outfitPlace 医院的地址
        outfitPlace: "",
        // 患者编号
        patientcode: "",
        // 病例编号
        mrId: "",
        /* 卡编号 */
        cardId: "",
        /* 是否复诊 1是 0否*/
        isVisitPatient: "",
        /* 报卡来源1:'',门诊 2:住院 */
        cardSource: "1",
        /* 病人ID */
        pid: "",
        /* 住院号 */
        inpNo: "",
        /* 病例ID */
        mrId: "",
        /* 病人姓名 */
        patientName: "",
        /* 监护人姓名 */
        guardianName: "",
        /* 证件号 身份证号*/
        paperwork: "",
        /* 性别 */
        sex: "",
        /* 出生日期 */
        birthday: "",
        /* 联系电话 */
        telephone: "",
        /* 病人归属 */
        patientType: "",
        // 地址集合
        address: [],
        /* 现住址-省份 */
        provinceAddressCode: "",
        /* 现住址-市 */
        cityAddressCode: "",
        /* 现住址-县 */
        countyAddressCode: "",
        /* 现住址-街道 */
        streetAddressCode: "",
        /* 现住址-村 */
        villageAddressCode: "",
        /* 现住址-详细地址 */
        doorplateAddressCode: "",
        /* 详细地址 */
        xianzhuzhi: "",
        /* 职业 */
        profession: "",
        /* 机构地点 */
        outfitPlace: "",
        /* 面色潮红 */
        miansechaohong: "",
        /* 发热 */
        fare: "",
        fareTemperature: "",
        /* 面色苍白 */
        miansecangbai: "",
        /* 发绀 */
        fagan: "",
        /* 肿胀 */
        zhongzhang: "",
        /* 脱水 */
        tuoshui: "",
        /* 失眠 */
        shimian: "",
        /* 口渴 */
        kouke: "",
        /* 畏光 */
        weiguang: "",
        /* 浮肿 */
        fuzhong: "",
        /* 口有糊味 */
        kouyouhuwei: "",
        /* 寒战 */
        hanzhan: "",
        /* 体重下降 */
        tizhongxiajiang: "",
        /* 金属味 */
        jinshuwei: "",
        /* 唾液过多 */
        tuoyeguoduo: "",
        /* 乏力 */
        fali: "",
        /* 色素沉着 */
        sesuchenzhuo: "",
        /* 脱皮 */
        tuopi: "",
        /* 肥皂/咸味 */
        feizaoxianwei: "",
        /* 足/腕下垂 */
        zuwanxiachui: "",
        /* 全身症状与体征其它 */
        wbOth: "",
        /* 全身症状与体征其它 */
        wbOther: "",
        /*  */
        exin: "",
        /*  */
        outu: "",
        /* 呕吐次数 */
        emesisCount: "",
        /*  */
        futong: "",
        /*  */
        fuxie: "",
        /* 腹泻次数 */
        diarrheaCount: "",
        /* 腹泻特征 性状 */
        diarrheaCharacter: "",
        /*  */
        bianmi: "",
        /* 里急后重 */
        lijihouzhong: "",
        /* 消化系统其它 */
        digOth: "",
        /* 消化系统其它 */
        digOther: "",
        /*  */
        toutong: "",
        /*  */
        hunmi: "",
        /*  */
        jingjue: "",
        /*  */
        zhanwang: "",
        /*  */
        tanhuan: "",
        /*  */
        yanyukunnan: "",
        /*  */
        ganjueyichang: "",
        /*  */
        fushi: "",
        /*  */
        shilimohu: "",
        /*  */
        xuanyun: "",
        /*  */
        yanjianxiachui: "",
        /*  */
        zhitimamu: "",
        moshaoganjuezhangai: "",
        /*  */
        tongkongyichang: "",
        /*  */
        pType: "",
        /*  */
        zhencigan: "",
        /*  */
        chouchu: "",
        /*  */
        pupOth: "",
        /*  */
        pupOther: "",
        /*  */
        huxiduancu: "",
        /*  */
        kexue: "",
        /*  */
        huxikunnan: "",
        /* 心脑血管系统其它 */
        brtOth: "",
        /*  心脑血管系统其它 */
        brtOther: "",
        /*  */
        niaoliangjianshao: "",
        /*  */
        beibushenqutengtong: "",
        /*  */
        shenjieshi: "",
        /*  */
        niaozhongdaixue: "",
        /* 泌尿系统其它 */
        uriOth: "",
        /* 泌尿系统其它 */
        uriOther: "",
        /*  */
        xiongmen: "",
        /*  */
        xiongtong: "",
        /* 卡编号 */
        xinji: "",
        /*  */
        qiduan: "",
        /*  */
        habOth: "",
        /*  */
        habOther: "",
        /*  */
        saoyang: "",
        /*  */
        shaozhuogan: "",
        /*  */
        pizhen: "",
        /*  */
        chuxuedian: "",
        /*  */
        huangdan: "",
        /* 皮肤和皮下组织其它 */
        sksOth: "",
        /* 皮肤和皮下组织其它 */
        sksOther: "",
        yibanxiaohuadaoyanzheng: "",
        /*  */
        keluoenbing: "",
        /*  */
        xiaohuadaokuiyang: "",
        /*  */
        xiaohuadaozhongliu: "",
        /*  */
        changyiji: "",
        /*  */
        naomoyan: "",
        /*  */
        hisOth: "",
        /*  */
        hisOther: "",
        /* 发病日期 发病时间*/
        onsetDate: "",
        /* 诊断ICD 疾病诊断*/
        diagCode: "",

        /* 诊断名称 疾病诊断*/
        diagName: "",

        /*  */
        isDead: "",

        /* 死亡时间 */
        deathDate: "",

        /* 是否进食某食品 */
        isReal: "0",

        /*  */
        foodName1: "",

        /*  */
        buySite1: "",

        /*  */
        eatingPlace1: "",

        /*  */
        personNum1: "",

        /*  */
        eatingTime1: "",

        /*  */
        isAttack1: "",

        /*  */
        foodName2: "",

        /*  */
        buySite2: "",

        /*  */
        eatingPlace2: "",

        /*  */
        personNum2: "",

        /*  */
        eatingTime2: "",

        /*  */
        isAttack2: "",

        /*  */
        hasSample: "0",

        /*  */
        sampleId1: "",

        /*  */
        sampleNum1: "",

        /*  */
        sampleTime1: "",
        /*  */
        sampleType1: "",
        /*  */
        sampleId2: "",
        /*  */
        sampleNum2: "",
        /*  */
        sampleTime2: "",
        /*  */
        sampleType2: "",
        /* 是否使用抗生素 */
        isCorrectDiagnosis: "",
        /* 抗生素名称 药物名称*/
        antibiotic: "",
        /*  */
        returnCardReason: "",
        /*  */
        reportUnit: "",
        /*  */
        fillCardDoctor: "",
        /*  */
        fillCardDate: "",
        /*  */
        remark: "",
        /* 状态 */
        state: "",
        /*  */
        operatorId: "",
        /*  */
        operatorDate: "",
        /*  */
        fillCardDeptId: "",
        /* 报告科室 */
        keshi: "",
        /*  */
        diagPrefix: "",
        /*  */
        diagSuffix: "",
        /* 科室联系电话 */
        deptPhone: "",
        /* 就诊时间 */
        visDate: this.dayjs().format("YYYY-MM-DD HH:mm:ss"),
        /*  */
        zlhdid: "",
        /*  */
        seq: "",
        /*  */
        jingshenshichang: "",
        /* 贫血 */
        pinxue: "",
        /* 指甲出现白带 */
        baidai: "",
        /*  */
        tunyankunnan: "",
        /*  */
        comId: "",
        /*  */
        manufacturer2: "",
        /*  */
        placeType2: "",
        /*  */
        processingMethod2: "",
        /*  */
        brand2: "",
        /*  */
        foodType2: "",
        /*  */
        manufacturer1: "",
        /*  */
        placeType1: "",
        /*  */
        processingMethod1: "",
        /*  */
        foodType1: "",
        /*  */
        brand1: "",
        /*  */
        sampleRemark1: "",
        /*  */
        sampleRemark2: "",
        /*  */
        age: "",
        /*  */
        sampleUnit1: "",
        /*  */
        sampleUnit2: "",
        /*  */
        buyPlaceType1: "",
        /*  */
        buyPlaceType2: "",
        /*  */
        villageAddressCode: "",
        /*  */
        jixingweichangyan: "",
        /*  */
        ganranxingfuxie: "",
        /*  */
        dumoguzhongdu: "",
        /*  */
        caidouzhongdu: "",
        /*  */
        hetunzhongdu: "",
        /*  */
        rouduzhongdu: "",
        /*  */
        yaxiaosuanyanzhongdu: "",
        /*  */
        nongyaozhongdu: "",
        /*  */
        chubuother: "",
        /*  */
        chubuOth: "",
        /*  */
        deleteCause: "",
        /*  */
        temperature: "",
        /* 对比医生 */
        contrastDoctor: "",
        /* 既往病史 */
        medicalHistory: "",
        /* 是否已死亡 */
        isDeath: "",
        /*患者编号*/
        patientCode: "",
        /* 序号  */
        serialNumber: "",
        /* 食品名称  */
        // foodName:'',
        /*  食品分类 */
        foodType: "",
        /* 加工或包装方式  */
        processingOrPackaging: "",
        /* 食品品牌  */
        foodBrand: "",
        /* 生产厂家  */
        manufacturer: "",
        /* 进食场所  */
        eatingPlaces: "",
        /* 进食场所类型  */
        eatingPlaceType: "",
        /* 进食时间  */
        eatingTime: "",
        /* 进食人数  */
        eatingPeople: "",
        /* 其他人是否发病  */
        otherPersonIsIll: "",
        /* 样本类型  */
        sampleType: "",
        /* 采样日期  */
        samplingDate: "",
        /* 样本数量   */
        sampleSize: "",
        /* 单位  (样本单位) */
        sampleUnit: "",
        patientCode: "",
        /* 全身症状与体征 1:发热 2:面色潮红 3:面色苍白 4:发绀 5:脱水 6:口渴
              7:浮肿 8:体重下降 9:寒战 10:乏力 11:贫血 12:肿胀 13:失眠 14:畏光 15:口有糊味
              16:金属味 17:肥皂/咸味 18:唾液过多 19:足/腕下垂
              20:色素沉着 21:脱皮 22:指甲出现白带 23:其他 */
        systemicSymptomsSigns: "",
        /* 消化系统  1:恶心 2:呕吐 3:腹痛 4:腹泻 5:黑便 6:便秘 7:里急后重 8:其他
          9:水样便 10:米泔样便 11:黏液便 12:脓血便 13:洗肉样便 14:鲜血样便  */
        digestiveSystem: "",
        /* 呼吸系统 1:呼吸短促 2:咯血 3:呼吸困难 4:其他 */
        respiratorySystem: "",
        /* 心脑血管系统 1:胸闷 2:胸痛 3:心悸 4:气短 5:其他 */
        cerebrovascularSystem: "",
        /* 泌尿系统 1:尿量减少 2:背部/肾区疼痛 3:肾结石 4:尿中带血 5:其他 */
        urinarySystem: "",
        /* 神经系统  1:头痛 2:昏迷 3:惊蕨 4:谊妄 5:瘫痪 6:言语困难 7:吞咽困难
           8:感觉异常 9:精神失常 10:复视 11:视力模糊  12:眩晕 13:眼睑下垂 14:肢体麻木
          15:末梢感觉障碍 16:针刺感 17:抽搐 18:其他
          19:扩大 20:固定 21:收缩 */
        nervousSystem: "",
        /* 皮肤和皮下组织  1:痉痒 2:烧灼感 3:皮疹 4:出血点
              5:黄疸 6:其他 */
        skinAndSubcutaneousTissue: "",
        /* 报告医生 */
        reportDoctor: "",
        /* 报告时间 */
        reportDate: "",
        /* 食源性报卡食品 */
        phcFoodVOList: [],
        /* 食源性报卡采样 */
        phcSampleVOList: []
      },

      // 列表数据

      /* 食源性报卡食品 */
      phcFoodVOList: [
        {
          foodName: "", //食品名称
          foodType: "", //食品分类
          processingOrPackaging: "", //加工或包装方式
          foodBrand: "", //食品品牌
          manufacturer: "", //生产厂家
          eatingPlaces: "", //进食场所
          eatingPlaceType: "", //进食场所类型
          eatingTime: "", //进食时间
          eatingPeople: "", // 进食人数
          otherPersonIsIll: "" //是否发病
        }
      ],
      /* 食源性报卡采样 */
      phcSampleVOList: [
        {
          sampleType: "", //样本类型
          samplingDate: "", //采样时间
          sampleSize: "", //样本数量
          sampleUnit: "", //单位(样本单位)
          remark: "" //备注
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["name", "receivePatientData"])
  },
  created() {
    this.ruleForm.reportDoctor = Base64.decode(this.name); //报卡医生的名字;
    this.ruleForm.keshi = JSON.parse(getRole()).deptName; //科室的名字
    this.patientInfo();
    // this.ruleForm.outfitPlace = JSON.parse(getRole()).hosName;//医院的名字
  },
  methods: {
    async patientInfo() {
      this.loading = true;
      let patientId = this.baokaData
        ? this.baokaData.pid
        : this.receivePatientData.patientId;
      if (!patientId) {
        this.loading = false;
        return false;
      }
      let { code, data, msg } = await getPatientArchInfo({
        patientId: patientId
      });
      if (code == "1") {
        this.ruleForm.profession = data[0].patientArchiveInfoVO.careerCode;
        this.ruleForm.sex = data[0].patientArchiveInfoVO.patientGender;
        this.ruleForm.patientcode = data[0].patientArchiveInfoVO.patientCode;
        this.ruleForm.age = data[0].patientArchiveInfoVO.patientAge;
        this.ruleForm.patientName = data[0].patientArchiveInfoVO.patientName;
        this.ruleForm.paperwork =
          data[0].patientArchiveInfoVO.identificationNum;
        this.ruleForm.telephone = data[0].patientArchiveInfoVO.mobileNum;
        this.ruleForm.birthday = data[0].patientArchiveInfoVO.birthDate;
        this.ruleForm.doorplateAddressCode =
          data[0].patientEmpiInfoAddrssVO.currentDetail;
        this.ruleForm.address = data[0].patientEmpiInfoAddrssVO.currentAddress
          ? JSON.parse(data[0].patientEmpiInfoAddrssVO.currentAddress).map(
              addr => {
                if (addr === "unknow") {
                  return 0;
                }
                return addr;
              }
            )
          : [];
      } else {
        this.$message.error(msg);
      }
      this.loading = false;
    },
    //全身症状体征
    symptomFun(a) {
      if (a == "1") {
        this.symptomFunIndex.push(a);
      }
    },
    // 消化系统
    digestiveSystem(a) {
      if (a == "1") {
        this.digestiveSystemIndex.push(a);
      }
    },
    // 呼吸系统
    respiratorySystem(a) {
      if (a == "1") {
        this.respiratorySystemIndex.push(a);
      }
    },
    // 心脑血管
    cardioCer(a) {
      if (a == "1") {
        this.cardioCerIndex.push(a);
      }
    },
    // 泌尿系统
    urinarySystem(a) {
      if (a == "1") {
        this.urinarySystemIndex.push(a);
      }
    },
    // 神经系统
    nervousSystem(a) {
      if (a == "1") {
        this.nervousSystemIndex.push(a);
      }
    },
    // 神经系统
    theSkin(a) {
      if (a == "1") {
        this.theSkinIndex.push(a);
      }
    },

    preservationConditions() {
      let conditions = true;
      let symptom = document.getElementsByClassName("symptom");
      let digestiveSystem = document.getElementsByClassName("digestiveSystem");
      let respiratorySystem = document.getElementsByClassName(
        "respiratorySystem"
      );
      let cardioCer = document.getElementsByClassName("cardioCer");
      let urinarySystem = document.getElementsByClassName("urinarySystem");
      let nervousSystem = document.getElementsByClassName("nervousSystem");
      let theSkin = document.getElementsByClassName("theSkin");

      this.symptomFunIndex = [];
      for (let i = 0; i < symptom.length; i++) {
        if (symptom[i].classList.contains("is-checked")) {
          this.symptomFunIndex.push("1");
          break;
        }
      }

      this.digestiveSystemIndex = [];
      for (let i = 0; i < digestiveSystem.length; i++) {
        if (digestiveSystem[i].classList.contains("is-checked")) {
          this.digestiveSystemIndex.push("1");
          break;
        }
      }

      this.respiratorySystemIndex = [];
      for (let i = 0; i < respiratorySystem.length; i++) {
        if (respiratorySystem[i].classList.contains("is-checked")) {
          this.respiratorySystemIndex.push("1");
          break;
        }
      }

      this.cardioCerIndex = [];
      for (let i = 0; i < cardioCer.length; i++) {
        if (cardioCer[i].classList.contains("is-checked")) {
          this.cardioCerIndex.push("1");
          break;
        }
      }

      this.urinarySystemIndex = [];
      for (let i = 0; i < urinarySystem.length; i++) {
        if (urinarySystem[i].classList.contains("is-checked")) {
          this.urinarySystemIndex.push("1");
          break;
        }
      }
      this.nervousSystemIndex = [];
      for (let i = 0; i < nervousSystem.length; i++) {
        if (nervousSystem[i].classList.contains("is-checked")) {
          this.nervousSystemIndex.push("1");
          break;
        }
      }
      this.theSkinIndex = [];
      for (let i = 0; i < theSkin.length; i++) {
        if (theSkin[i].classList.contains("is-checked")) {
          this.theSkinIndex.push("1");
          break;
        }
      }

      if (this.symptomFunIndex.length == 0) {
        this.$message.error("全身症状体征至少选择一个");
        conditions = false;
        return false;
      }
      if (this.digestiveSystemIndex.length == 0) {
        this.$message.error("消化系统至少选择一个");
        conditions = false;
        return false;
      }

      if (this.respiratorySystemIndex.length == 0) {
        this.$message.error("呼吸系统至少选择一个");
        conditions = false;
        return false;
      }
      if (this.cardioCerIndex.length == 0) {
        this.$message.error("心脑血管至少选择一个");
        conditions = false;
        return false;
      }
      if (this.urinarySystemIndex.length == 0) {
        this.$message.error("泌尿系统至少选择一个");
        conditions = false;
        return false;
      }
      if (this.nervousSystemIndex.length == 0) {
        this.$message.error("神经系统至少选择一个");
        conditions = false;
        return false;
      }
      if (this.theSkinIndex.length == 0) {
        this.$message.error("皮肤至少选择一个");
        conditions = false;
        return false;
      }
      return conditions;
    },
    // 疾病诊断
    diagNameChange(val, item) {
      console.log(item);
      this.ruleForm.diagName = item.dictionaryName;
    },
    // 重置
    restFun() {
      this.restFuna();
    },
    restFuna() {
      this.ruleForm = {
        outfitPlace: "", //医院的名字
        /* 卡编号 */
        cardId: "",
        /* 是否复诊 1是 0否*/
        isVisitPatient: "",
        /* 报卡来源1:'',门诊 2:住院 */
        // cardSource:'',
        /* 病人ID */
        // pid:'',
        /* 住院号 */
        // inpNo:'',
        /* 病例ID */
        mrId: "",
        /* 病人姓名 */
        // patientName:'',
        /* 监护人姓名 */
        guardianName: "",
        /* 证件号 身份证号*/
        paperwork: "",
        /* 性别 */
        sex: "",
        /* 出生日期 */
        birthday: "",
        /* 联系电话 */
        telephone: "",
        /* 病人归属 */
        patientType: "",
        // 地址集合
        address: [],
        /* 现住址-省份 */
        provinceAddressCode: "",
        /* 现住址-市 */
        cityAddressCode: "",
        /* 现住址-县 */
        countyAddressCode: "",
        /* 现住址-街道 */
        streetAddressCode: "",
        /* 现住址-村 */
        villageAddressCode: "",
        /* 现住址-详细地址 */
        doorplateAddressCode: "",
        /* 详细地址 */
        xianzhuzhi: "",
        /* 职业 */
        profession: "",
        /* 机构地点 */
        outfitPlace: "",
        /* 面色潮红 */
        miansechaohong: "",
        /* 发热 */
        fare: "",
        fareTemperature: "",
        /* 面色苍白 */
        miansecangbai: "",
        /* 发绀 */
        fagan: "",
        /* 肿胀 */
        zhongzhang: "",
        /* 脱水 */
        tuoshui: "",
        /* 失眠 */
        shimian: "",
        /* 口渴 */
        kouke: "",
        /* 畏光 */
        weiguang: "",
        /* 浮肿 */
        fuzhong: "",
        /* 口有糊味 */
        kouyouhuwei: "",
        /* 寒战 */
        hanzhan: "",
        /* 体重下降 */
        tizhongxiajiang: "",
        /* 金属味 */
        jinshuwei: "",
        /* 唾液过多 */
        tuoyeguoduo: "",
        /* 乏力 */
        fali: "",
        /* 色素沉着 */
        sesuchenzhuo: "",
        /* 脱皮 */
        tuopi: "",
        /* 肥皂/咸味 */
        feizaoxianwei: "",
        /* 足/腕下垂 */
        zuwanxiachui: "",
        /* 全身症状与体征其它 */
        wbOth: "",
        /* 全身症状与体征其它 */
        wbOther: "",
        /*  */
        exin: "",
        /*  */
        outu: "",
        /* 呕吐次数 */
        emesisCount: "",
        /*  */
        futong: "",
        /*  */
        fuxie: "",
        /* 腹泻次数 */
        diarrheaCount: "",
        /* 腹泻特征 性状 */
        diarrheaCharacter: "",
        /*  */
        bianmi: "",
        /* 里急后重 */
        lijihouzhong: "",
        /* 消化系统其它 */
        digOth: "",
        /* 消化系统其它 */
        digOther: "",
        /*  */
        toutong: "",
        /*  */
        hunmi: "",
        /*  */
        jingjue: "",
        /*  */
        zhanwang: "",
        /*  */
        tanhuan: "",
        /*  */
        yanyukunnan: "",
        /*  */
        ganjueyichang: "",
        /*  */
        fushi: "",
        /*  */
        shilimohu: "",
        /*  */
        xuanyun: "",
        /*  */
        yanjianxiachui: "",
        /*  */
        zhitimamu: "",
        moshaoganjuezhangai: "",
        /*  */
        tongkongyichang: "",
        /*  */
        pType: "",
        /*  */
        zhencigan: "",
        /*  */
        chouchu: "",
        /*  */
        pupOth: "",
        /*  */
        pupOther: "",
        /*  */
        huxiduancu: "",
        /*  */
        kexue: "",
        /*  */
        huxikunnan: "",
        /* 心脑血管系统其它 */
        brtOth: "",
        /*  心脑血管系统其它 */
        brtOther: "",
        /*  */
        niaoliangjianshao: "",
        /*  */
        beibushenqutengtong: "",
        /*  */
        shenjieshi: "",
        /*  */
        niaozhongdaixue: "",
        /* 泌尿系统其它 */
        uriOth: "",
        /* 泌尿系统其它 */
        uriOther: "",
        /*  */
        xiongmen: "",
        /*  */
        xiongtong: "",
        /* 卡编号 */
        xinji: "",
        /*  */
        qiduan: "",
        /*  */
        habOth: "",
        /*  */
        habOther: "",
        /*  */
        saoyang: "",
        /*  */
        shaozhuogan: "",
        /*  */
        pizhen: "",
        /*  */
        chuxuedian: "",
        /*  */
        huangdan: "",
        /* 皮肤和皮下组织其它 */
        sksOth: "",
        /* 皮肤和皮下组织其它 */
        sksOther: "",
        yibanxiaohuadaoyanzheng: "",
        /*  */
        keluoenbing: "",
        /*  */
        xiaohuadaokuiyang: "",
        /*  */
        xiaohuadaozhongliu: "",
        /*  */
        changyiji: "",
        /*  */
        naomoyan: "",
        /*  */
        hisOth: "",
        /*  */
        hisOther: "",
        /* 发病日期 发病时间*/
        onsetDate: "",
        /* 诊断ICD 疾病诊断*/
        diagCode: "",

        /* 诊断名称 疾病诊断*/
        diagName: "",

        /*  */
        isDead: "",

        /* 死亡时间 */
        deathDate: "",

        /* 是否进食某食品 */
        isReal: "0",

        /*  */
        foodName1: "",

        /*  */
        buySite1: "",

        /*  */
        eatingPlace1: "",

        /*  */
        personNum1: "",

        /*  */
        eatingTime1: "",

        /*  */
        isAttack1: "",

        /*  */
        foodName2: "",

        /*  */
        buySite2: "",

        /*  */
        eatingPlace2: "",

        /*  */
        personNum2: "",

        /*  */
        eatingTime2: "",

        /*  */
        isAttack2: "",

        /*  */
        hasSample: "0",

        /*  */
        sampleId1: "",

        /*  */
        sampleNum1: "",

        /*  */
        sampleTime1: "",
        /*  */
        sampleType1: "",
        /*  */
        sampleId2: "",
        /*  */
        sampleNum2: "",
        /*  */
        sampleTime2: "",
        /*  */
        sampleType2: "",
        /* 是否使用抗生素 */
        isCorrectDiagnosis: "",
        /* 抗生素名称 药物名称*/
        antibiotic: "",
        /*  */
        returnCardReason: "",
        /*  */
        reportUnit: "",
        /*  */
        fillCardDoctor: "",
        /*  */
        fillCardDate: "",
        /*  */
        remark: "",
        /* 状态 */
        state: "",
        /*  */
        operatorId: "",
        /*  */
        operatorDate: "",
        /*  */
        fillCardDeptId: "",
        /* 报告科室 */
        keshi: "",
        /*  */
        diagPrefix: "",
        /*  */
        diagSuffix: "",
        /* 科室联系电话 */
        deptPhone: "",
        /* 就诊时间 */
        visDate: this.dayjs().format("YYYY-MM-DD HH:mm:ss"),
        /*  */
        zlhdid: "",
        /*  */
        seq: "",
        /*  */
        jingshenshichang: "",
        /* 贫血 */
        pinxue: "",
        /* 指甲出现白带 */
        baidai: "",
        /*  */
        tunyankunnan: "",
        /*  */
        comId: "",
        /*  */
        manufacturer2: "",
        /*  */
        placeType2: "",
        /*  */
        processingMethod2: "",
        /*  */
        brand2: "",
        /*  */
        foodType2: "",
        /*  */
        manufacturer1: "",
        /*  */
        placeType1: "",
        /*  */
        processingMethod1: "",
        /*  */
        foodType1: "",
        /*  */
        brand1: "",
        /*  */
        sampleRemark1: "",
        /*  */
        sampleRemark2: "",
        /*  */
        age: "",
        /*  */
        sampleUnit1: "",
        /*  */
        sampleUnit2: "",
        /*  */
        buyPlaceType1: "",
        /*  */
        buyPlaceType2: "",
        /*  */
        villageAddressCode: "",
        /*  */
        jixingweichangyan: "",
        /*  */
        ganranxingfuxie: "",
        /*  */
        dumoguzhongdu: "",
        /*  */
        caidouzhongdu: "",
        /*  */
        hetunzhongdu: "",
        /*  */
        rouduzhongdu: "",
        /*  */
        yaxiaosuanyanzhongdu: "",
        /*  */
        nongyaozhongdu: "",
        /*  */
        chubuother: "",
        /*  */
        chubuOth: "",
        /*  */
        deleteCause: "",
        /*  */
        temperature: "",
        /* 对比医生 */
        contrastDoctor: "",
        /* 既往病史 */
        medicalHistory: "",
        /* 是否已死亡 */
        isDeath: "",
        /*患者编号*/
        patientCode: "",
        /* 序号  */
        serialNumber: "",
        /* 食品名称  */
        // foodName:'',
        /*  食品分类 */
        foodType: "",
        /* 加工或包装方式  */
        processingOrPackaging: "",
        /* 食品品牌  */
        foodBrand: "",
        /* 生产厂家  */
        manufacturer: "",
        /* 进食场所  */
        eatingPlaces: "",
        /* 进食场所类型  */
        eatingPlaceType: "",
        /* 进食时间  */
        eatingTime: "",
        /* 进食人数  */
        eatingPeople: "",
        /* 其他人是否发病  */
        otherPersonIsIll: "",
        /* 样本类型  */
        sampleType: "",
        /* 采样日期  */
        samplingDate: "",
        /* 样本数量   */
        sampleSize: "",
        /* 单位  (样本单位) */
        sampleUnit: "",
        patientCode: "",
        /* 全身症状与体征 1:发热 2:面色潮红 3:面色苍白 4:发绀 5:脱水 6:口渴
              7:浮肿 8:体重下降 9:寒战 10:乏力 11:贫血 12:肿胀 13:失眠 14:畏光 15:口有糊味
              16:金属味 17:肥皂/咸味 18:唾液过多 19:足/腕下垂
              20:色素沉着 21:脱皮 22:指甲出现白带 23:其他 */
        systemicSymptomsSigns: "",
        /* 消化系统  1:恶心 2:呕吐 3:腹痛 4:腹泻 5:黑便 6:便秘 7:里急后重 8:其他
          9:水样便 10:米泔样便 11:黏液便 12:脓血便 13:洗肉样便 14:鲜血样便  */
        digestiveSystem: "",
        /* 呼吸系统 1:呼吸短促 2:咯血 3:呼吸困难 4:其他 */
        respiratorySystem: "",
        /* 心脑血管系统 1:胸闷 2:胸痛 3:心悸 4:气短 5:其他 */
        cerebrovascularSystem: "",
        /* 泌尿系统 1:尿量减少 2:背部/肾区疼痛 3:肾结石 4:尿中带血 5:其他 */
        urinarySystem: "",
        /* 神经系统  1:头痛 2:昏迷 3:惊蕨 4:谊妄 5:瘫痪 6:言语困难 7:吞咽困难
           8:感觉异常 9:精神失常 10:复视 11:视力模糊  12:眩晕 13:眼睑下垂 14:肢体麻木
          15:末梢感觉障碍 16:针刺感 17:抽搐 18:其他
          19:扩大 20:固定 21:收缩 */
        nervousSystem: "",
        /* 皮肤和皮下组织  1:痉痒 2:烧灼感 3:皮疹 4:出血点
              5:黄疸 6:其他 */
        skinAndSubcutaneousTissue: "",
        /* 报告医生 */
        // reportDoctor: '',
        /* 报告时间 */
        reportDate: "",
        /* 食源性报卡食品 */
        phcFoodVOList: [],
        /* 食源性报卡采样 */
        phcSampleVOList: []
      };
      // 列表数据
      this.phcFoodVOList = [];
      this.phcSampleVOList = [];
      /* 食源性报卡食品 */
      this.phcFoodVOList = [
        {
          foodName: "", //食品名称
          foodType: "", //食品分类
          processingOrPackaging: "", //加工或包装方式
          foodBrand: "", //食品品牌
          manufacturer: "", //生产厂家
          eatingPlaces: "", //进食场所
          eatingPlaceType: "", //进食场所类型
          eatingTime: "", //进食时间
          eatingPeople: "", // 进食人数
          otherPersonIsIll: "" //是否发病
        }
      ];
      /* 食源性报卡采样 */
      this.phcSampleVOList = [
        {
          sampleType: "", //样本类型
          samplingDate: "", //采样时间
          sampleSize: "", //样本数量
          sampleUnit: "", //单位(样本单位)
          remark: "" //备注
        }
      ];
      this.ruleForm.phcFoodVOList = this.phcFoodVOList;
      this.ruleForm.phcSampleVOList = this.phcSampleVOList;

      if (this.ruleForm.isReal == 0) {
        this.foodStyle = false;
      } else {
        this.foodStyle = true;
      }
      if (this.ruleForm.hasSample == 0) {
        this.sampleStyle = false;
      } else {
        this.sampleStyle = true;
      }
      this.$nextTick(function() {
        this.$refs["ruleForm"].resetFields();
      });
      this.stateStyle = true;
      this.fuzhi();
    },
    //地址的转化
    address(val) {
      console.log(val);
      this.ruleForm.provinceAddressCode = val[0];
      this.ruleForm.cityAddressCode = val[1];
      this.ruleForm.countyAddressCode = val[2] || "";
      this.ruleForm.streetAddressCode = val[3] || "";
      this.ruleForm.villageAddressCode = val[4] || "";
    },
    checkCheckBoxInput(ruleForm) {
      // 抗生素 选中后 对 药物输出
      if (ruleForm.isCorrectDiagnosis == "1" && !ruleForm.antibiotic) {
        this.$message.warning("请填写药物名称！");
        return false;
      }

      if (ruleForm.fare == "1" && !ruleForm.fareTemperature) {
        this.$message.warning("请填写发热温度！");
        return false;
      }

      if (ruleForm.wbOth == "1" && !ruleForm.wbOther) {
        this.$message.warning("请填写全身症状体征其他内容！");
        return false;
      }

      if (ruleForm.outu == "1" && !ruleForm.emesisCount) {
        this.$message.warning("请填写呕吐次数！");
        return false;
      }

      if (ruleForm.fuxie == "1" && !ruleForm.diarrheaCount) {
        this.$message.warning("请填写腹泻次数！");
        return false;
      }

      if (ruleForm.digOth == "1" && !ruleForm.digOther) {
        this.$message.warning("请填写消化系统其他内容！");
        return false;
      }

      if (ruleForm.brtOth == "1" && !ruleForm.brtOther) {
        this.$message.warning("请填写呼吸系统其他内容！");
        return false;
      }

      if (ruleForm.brtOth == "1" && !ruleForm.brtOther) {
        this.$message.warning("请填写呼吸系统其他内容！");
        return false;
      }

      if (ruleForm.habOth == "1" && !ruleForm.habOther) {
        this.$message.warning("请填写心脑血管系统其他内容！");
        return false;
      }

      if (ruleForm.uriOth == "1" && !ruleForm.uriOther) {
        this.$message.warning("请填写泌尿系统其他内容！");
        return false;
      }

      if (ruleForm.pupOth == "1" && !ruleForm.pupOther) {
        this.$message.warning("请填写神经系统其他内容！");
        return false;
      }

      if (ruleForm.sksOth == "1" && !ruleForm.sksOther) {
        this.$message.warning("请填写皮肤和皮下组织其他内容！");
        return false;
      }

      return true;
    },
    // theStaging 暂存
    theStaging() {
      if (this.ruleForm.telephone.length == "0") {
        this.$message.error("请填写联系电话");
        return false;
      }
      if (this.ruleForm.patientType.length == "0") {
        this.$message.error("请填写病人属于");
        return false;
      }

      console.log(this.ruleForm, "this.ruleForm.address");
      if (this.ruleForm.address.filter(addr => addr !== 0).length == "0") {
        this.$message.error("请填写居住地址");
        return false;
      }
      if (this.ruleForm.doorplateAddressCode.length == "0") {
        this.$message.error("请填写详细居住地址");
        return false;
      }

      console.log("diagCode::::", this.ruleForm.diagCode);
      if (!this.ruleForm.diagCode || this.ruleForm.diagCode.length == "0") {
        this.$message.error("请填写疾病诊断");
        return false;
      }

      if (!this.ruleForm.visDate || this.ruleForm.visDate.length == "0") {
        this.$message.error("请填写就诊时间");
        return false;
      }

      if (!this.ruleForm.onsetDate || this.ruleForm.onsetDate.length == "0") {
        this.$message.error("请填写发病时间");
        return false;
      }
      if (this.ruleForm.isDeath.length == "0") {
        this.$message.error("请选择是否死亡");
        return false;
      }

      if (this.ruleForm.isDeath == "1" && !this.ruleForm.deathDate) {
        this.$message.error("请填写死亡时间！");
        return false;
      }

      if (this.ruleForm.isCorrectDiagnosis.length == "0") {
        this.$message.error("请选择就诊前时候使用过抗生素");
        return false;
      }

      if (
        this.ruleForm.isCorrectDiagnosis == "1" &&
        !this.ruleForm.antibiotic
      ) {
        this.$message.error("请填写抗生素药物名称！");
        return false;
      }

      if (!this.checkCheckBoxInput(this.ruleForm)) {
        return;
      }

      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.ruleForm.phcSampleVOList = this.phcSampleVOList;
          this.ruleForm.phcFoodVOList = this.phcFoodVOList;
          this.ruleForm.pType = this.pupilAbnData;
          this.ruleForm.diarrheaCharacter = this.characterData;
          this.ruleForm.state = "1";
          if (this.preservationConditions()) {
            this.saveFoodBorneCard(this.ruleForm);
          }
        } else {
          // this.$message.error('请填写必填项？？');
          return false;
        }
      });
    },
    // 回去左边的列表的数据
    async saveFoodBorneCard(data) {
      // debugger;
      console.log(this.pupilAbnData);
      let res = await saveFoodBorneCard(data);
      if (res.code == "1") {
        this.$message.success("保存成功！");
        // this.restFun();
        this.$refs["ruleForm"].resetFields();
        this.ruleForm = Object.assign({}, this.ruleForm, res.data);

        if (this.ruleForm.phcSampleVOList.length > 0) {
          this.sampleStyle = true;
          this.ruleForm.hasSample = "1";
          this.phcSampleVOList = [];
          for (let i = 0; i < this.ruleForm.phcSampleVOList.length; i++) {
            this.phcSampleVOList.push(this.ruleForm.phcSampleVOList[i]);
          }
        } else {
          this.ruleForm.hasSample = "0";
          this.sampleStyle = false;
          this.phcSampleVOList = this.ruleForm.phcSampleVOList;
        }

        if (this.ruleForm.phcFoodVOList.length > 0) {
          this.foodStyle = true;
          this.ruleForm.isReal = "1";
          this.phcFoodVOList = this.ruleForm.phcFoodVOList;
        } else {
          this.foodStyle = false;
          this.ruleForm.isReal = "0";
          this.phcFoodVOList = this.ruleForm.phcFoodVOList;
        }
        if (this.ruleForm.pType.length > 0) {
          this.pupilAbnData = eval("(" + this.ruleForm.pType + ")");
        }
        if (this.ruleForm.diarrheaCharacter.length > 0) {
          this.characterData = eval(
            "(" + this.ruleForm.diarrheaCharacter + ")"
          );
        }
        // 三级地址都不为""，才可给addrCode赋值
        this.ruleForm.address = [
          Number(this.ruleForm.provinceAddressCode || ""),
          Number(this.ruleForm.cityAddressCode || ""),
          Number(this.ruleForm.countyAddressCode || ""),
          Number(this.ruleForm.streetAddressCode || ""),
          Number(this.ruleForm.villageAddressCode || "")
        ];
        this.ruleForm.address = this.ruleForm.address.filter(
          item => item !== 0
        );
        if (this.ruleForm.pType.length > 0) {
          this.pupilAbnData = eval("(" + this.ruleForm.pType + ")");
          this.characterData = eval(
            "(" + this.ruleForm.diarrheaCharacter + ")"
          );
        }

        if (this.ruleForm.state == "1") {
          this.stateStyle = true;
        } else {
          this.stateStyle = false;
        }
        // 修改地址
        console.log(this.ruleForm, "最总的数据1");
        if (this.baokaData) {
          this.$emit("submitBK");
        } else {
          this.$emit("saveFoodBorneCard", this.ruleForm);
        }
      } else {
        this.$message.success(res.msg || "保存失败！！！");
      }
    },

    // 上报
    report() {
      if (this.ruleForm.telephone.length == "0") {
        this.$message.error("请填写联系电话");
        return false;
      }
      if (this.ruleForm.patientType.length == "0") {
        this.$message.error("请填写病人属于");
        return false;
      }
      if (this.ruleForm.address.filter(addr => addr !== 0).length == "0") {
        this.$message.error("请填写居住地址");
        return false;
      }
      if (this.ruleForm.doorplateAddressCode.length == "0") {
        this.$message.error("请填写详细居住地址");
        return false;
      }

      if (!this.ruleForm.diagCode || this.ruleForm.diagCode.length == "0") {
        this.$message.error("请填写疾病诊断");
        return false;
      }

      if (!this.ruleForm.visDate || this.ruleForm.visDate.length == "0") {
        this.$message.error("请填写就诊时间");
        return false;
      }
      if (!this.ruleForm.onsetDate || this.ruleForm.onsetDate.length == "0") {
        this.$message.error("请填写发病时间");
        return false;
      }

      if (this.ruleForm.isDeath.length == "0") {
        this.$message.error("请选择是否死亡");
        return false;
      }

      if (this.ruleForm.isDeath == "1" && !this.ruleForm.deathDate) {
        this.$message.error("请填写死亡时间！");
        return false;
      }

      if (this.ruleForm.isCorrectDiagnosis.length == "0") {
        this.$message.error("请选择就诊前时候使用过抗生素");
        return false;
      }

      if (
        this.ruleForm.isCorrectDiagnosis == "1" &&
        !this.ruleForm.antibiotic
      ) {
        this.$message.error("请填写抗生素药物名称！");
        return false;
      }

      if (!this.checkCheckBoxInput(this.ruleForm)) {
        return;
      }

      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.ruleForm.state = "2";
          this.ruleForm.phcSampleVOList = this.phcSampleVOList;
          this.ruleForm.phcFoodVOList = this.phcFoodVOList;
          this.ruleForm.pType = this.pupilAbnData;
          this.ruleForm.diarrheaCharacter = this.characterData;
          if (this.preservationConditions()) {
            this.saveFoodBorneCard(this.ruleForm);
          }
        } else {
          return false;
        }
      });
    },
    // 添加phcFoodVOListAdd  保卡食品
    phcFoodVOListAdd() {
      let obj = {
        foodName: "", //食品名称
        foodType: "", //食品分类
        processingOrPackaging: "", //加工或包装方式
        foodBrand: "", //食品品牌
        manufacturer: "", //生产厂家
        eatingPlaces: "", //进食场所
        eatingPlaceType: "", //进食场所类型
        eatingTime: "", //进食时间
        eatingPeople: "", // 进食人数
        otherPersonIsIll: "" //是否发病
      };
      this.phcFoodVOList.push(obj);
      console.log(this.phcFoodVOList);
    },
    phcFoodVOListDelete(index) {
      this.phcFoodVOList.splice(index, 1);
      console.log(this.phcFoodVOList);
    },
    // 报卡采样
    phcSampleVOListAdd() {
      let obj = {
        sampleType: "", //样本类型
        samplingDate: "", //采样时间
        sampleSize: "", //样本数量
        sampleUnit: "", //单位(样本单位)
        remark: "" //备注
      };
      this.phcSampleVOList.push(obj);
      console.log(this.phcSampleVOList);
    },
    phcSampleVOListDelete(index) {
      this.phcSampleVOList.splice(index, 1);
      console.log(this.phcSampleVOList);
    },
    // 表头添加小红点
    renderHeader(cerateElement, { column }) {
      return cerateElement("div", [
        cerateElement("span", column.label),
        cerateElement("span", {
          domProps: {
            innerHTML: "*"
          },
          style: {
            color: "red",
            fontSize: "16px",
            marginLeft: "5px"
          }
        })
      ]);
    },
    // 切换食品单选框
    foodDataFun(val) {
      console.log(val);
      if (val == 1) {
        this.foodStyle = true;
        if (this.phcFoodVOList.length == 0) {
          this.phcFoodVOListAdd();
        }
      } else {
        this.foodStyle = false;
      }
      console.log(this.phcFoodVOList);
    },

    // 切换样本的
    sampleDataFun(val) {
      if (val == 1) {
        this.sampleStyle = true;
        if (this.phcSampleVOList.length == 0) {
          this.phcSampleVOListAdd();
        }
      } else {
        this.sampleStyle = false;
      }
      console.log(this.phcSampleVOList, "切换显示");
    },

    //重新赋值
    fuzhi() {
      this.ruleForm.cardSource = this.baokaData
        ? this.baokaData.cardSource
        : this.receivePatientData.cardSource
        ? this.receivePatientData.cardSource
        : 1;
      // 患者编号
      this.ruleForm.patientcode = this.receivePatientData.patientCode;
      // 患者姓名
      this.ruleForm.patientName = this.receivePatientData.patientName;
      // 性别
      this.ruleForm.sex = this.receivePatientData.patientGender;
      // 出生日期
      this.ruleForm.birthday = this.receivePatientData.birthDate;
      // 身份证号
      this.ruleForm.paperwork = this.receivePatientData.identificationNum;
      // 年龄
      this.ruleForm.age = this.receivePatientData.patientAge;
      // 患者id
      this.ruleForm.pid = this.receivePatientData.patientId;
      // 住院号
      this.ruleForm.inpNo = this.receivePatientData.visitCode;

      this.ruleForm.keshi = JSON.parse(getRole()).deptName; //科室的名字
      this.ruleForm.outfitPlace = JSON.parse(this.getPamars()).hosName; //医院的名字
      this.ruleForm.reportDoctor = Base64.decode(this.name); //报卡医生的名字;
      // 联系电话
      // this.ruleForm.telephone = this.receivePatientData.phoneNum;
      // 疾病诊断
      // debugger
      // this.ruleForm.diagCode = this.baokaData
      //   ? this.baokaData.diagName
      //   : this.receivePatientData.diagName;
      this.ruleForm.diagName = this.baokaData
        ? this.baokaData.diagName
        : this.receivePatientData.diagName;

        
      // huoqv 个人信息
      this.patientInfo();
    },
    getPamars() {
      const Pamars = "pamars";
      return localStorage.getItem(Pamars);
    },
    // 重新渲染
    contentListFunRightFun() {
      this.contentListFunRightData = this.contentListFunRight;

      if (this.contentListFunRightData) {
        // 重新赋值
        // this.fuzhi();
        this.ruleForm = Object.assign(
          {},
          this.ruleForm,
          this.contentListFunRightData
        );
        if (this.ruleForm.phcSampleVOList.length > 0) {
          this.sampleStyle = true;
          this.ruleForm.hasSample = "1";
          this.phcSampleVOList = this.ruleForm.phcSampleVOList;
        } else {
          this.ruleForm.hasSample = "0";
          this.sampleStyle = false;
          this.phcSampleVOList = this.ruleForm.phcSampleVOList;
        }

        if (this.ruleForm.phcFoodVOList.length > 0) {
          this.foodStyle = true;
          this.ruleForm.isReal = "1";
          this.phcFoodVOList = this.ruleForm.phcFoodVOList;
        } else {
          this.foodStyle = false;
          this.ruleForm.isReal = "0";
          this.phcFoodVOList = this.ruleForm.phcFoodVOList;
        }
        if (this.ruleForm.pType.length > 0) {
          this.pupilAbnData = eval("(" + this.ruleForm.pType + ")");
        }
        if (this.ruleForm.diarrheaCharacter.length > 0) {
          this.characterData = eval(
            "(" + this.ruleForm.diarrheaCharacter + ")"
          );
        }
        // 三级地址都不为""，才可给addrCode赋值
        this.ruleForm.address = [
          Number(this.ruleForm.provinceAddressCode || ""),
          Number(this.ruleForm.cityAddressCode || ""),
          Number(this.ruleForm.countyAddressCode || ""),
          Number(this.ruleForm.streetAddressCode || ""),
          Number(this.ruleForm.villageAddressCode || "")
        ];
        this.ruleForm.address = this.ruleForm.address.filter(
          item => item !== 0
        );
        // 控制按钮
        if (this.ruleForm.state == "1") {
          //暂存状态可以修改
          this.stateStyle = true;
        } else {
          this.stateStyle = false;
        }
        // 修改地址
        console.log(this.ruleForm, "fun最总的数据1");
        // this.contentListFunRightData = null;
      } else {
        this.restFun();
      }
    }
  },
  watch: {
    contentListFunRightData: {
      immediate: true,
      deep: true,
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        // console.log(this.contentListFunRightData, 'watch左侧数据变化');
      }
    },
    baokaData: {
      immediate: true,
      deep: true,
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        console.log(val, "弹出数据");
        Object.assign(this.ruleForm, val);
        this.fuzhi();
        // 重新赋值
      }
    },
    receivePatientData: {
      immediate: true,
      deep: true,
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        if (this.receivePatientData) {
          // 来源
          this.fuzhi();
        }
      }
    }
  }
};
</script>


<style lang="scss" scoped>
// 新添加的样式
.positionStyle {
  position: relative;
}

.zhezhao {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: transparent;
}

.paddingStyle {
  padding: 10px 0px;
}

.marginStyle {
  padding: 0px 8px 8px 0px;
}

.el-col-lineHeight {
  line-height: 36px;
}

.el-col-margin-top {
  margin-top: 10px;
}

.symptomsWrapbox {
  margin: 10px 0px;
  box-sizing: border-box;
  border: 1px solid #000000;

  .el-col-border-b {
    border-bottom: 1px solid #000000;
  }

  .el-col-border-r {
    height: 100%;
    justify-content: flex-end;
    border-right: 1px solid #000000;
  }

  .el-col-border-l {
    height: 100%;
    justify-content: flex-end;
    border-left: 1px solid #000000;
  }

  .width80 {
    width: 50%;
  }

  .width80 /deep/ .el-input__inner {
    width: 100%;
  }
}

// 弹性是布局
.displayStyle {
  line-height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

// 弹性是布局
.displayStyle-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

//
.container {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.el-form-item {
  margin-bottom: 2px;
}

.reg-form {
  flex: 1;
  padding: 0 $l-padding-default-6;
  overflow: hidden;
  overflow-y: auto;
}

/deep/
  .el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk)
  .el-form-item__label-wrap
  > .el-form-item__label:before {
  content: "";
  margin-right: 0;
}

.handler-box {
  padding: $l-padding-default-6;
  border-top: 1px solid $l-color-bgcolor-11;
  text-align: right;
}

.patient-box {
  margin-bottom: 15px;
}

.patient-photo {
  img {
    width: 120px;
    height: 120px;
  }
}

.patient-info {
  padding-top: $l-padding-default-6;
  overflow: hidden;
}

.demo-ruleForm {
  padding-right: 60px;

  /deep/ .el-form-item__content {
    line-height: 36px;
    margin-bottom: 20px;
  }
}

.add-contacts {
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
  right: -66px;
  top: 0;
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
  padding: 0 $l-padding-default-6;

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
        color: rgba(46, 50, 58, 1);
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
          color: rgba(148, 157, 163, 1);
          line-height: 20px;
          float: left;

          i {
            margin-left: 10px;
            font-style: normal;
            color: rgba(46, 50, 58, 1);
          }
        }

        .balance-sum {
          i {
            height: 14px;
            font-size: 14px;

            font-weight: bold;
            color: $l-color-primary;
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
        color: rgba(46, 50, 58, 1);
        line-height: 24px;
      }

      .sum {
        width: 100%;
        height: 76px;
        padding: $l-padding-default-6;
        background: $l-color-bgcolor-18;
        border-radius: 2px;
      }

      .radio-item {
        height: 48px;
        padding: 0 $l-padding-default-6;
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

.required {
  span:after {
    content: "*";
    width: 7px;
    height: 14px;
    font-size: 14px;

    padding-left: 5px;
    vertical-align: middle;
    font-weight: bolder;
    color: rgba(239, 15, 15, 1);
  }
}

/deep/ .el-dialog__footer {
  /*height: 36px;*/
  padding: $l-padding-default-6;
  border-top: 1px solid rgba(228, 228, 228, 1);
}

.ft0 {
  /deep/ .el-radio__label {
    font-size: 0;
  }
}

/deep/ .l-input-wrap {
  display: block;
}
</style>
