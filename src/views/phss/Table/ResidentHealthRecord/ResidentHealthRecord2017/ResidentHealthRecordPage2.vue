<template>
  <el-row>
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">个人基本信息表</div>
          </el-col>
        </el-row>
        <el-row class="mb-10" type="flex" justify="space-between">
          <el-col :span="12">
            <div>姓名:{{ TableForm.rsdt_name }}</div>
          </el-col>
          <el-col :span="12">
            <div class="fr">编号:{{ TableForm.dig_doc_no }}</div>
          </el-col>
        </el-row>
      </header>
      <main class="table_main">
        <el-row class="lh24">
          <el-col :span="3">
            <div class="center">性 别*</div>
          </el-col>
          <el-col :span="14">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.gender">
                  <el-radio label="1">1-男</el-radio>
                  <el-radio label="2">2-女</el-radio>
                  <el-radio label="9">9-未说明的性别</el-radio>
                  <el-radio label="0">0-未知的性别</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.gender"
                ></el-input>
              </PFormInput>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">出生日期*</div>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input
                @change="DateConversion('birthday', $event)"
                :readonly="readonly"
                v-model="TableForm.birthday"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="center">
          <el-col :span="3">
            <div>身份证号*</div>
          </el-col>
          <el-col :span="11">
            <div class="text_left">
              <el-form-item>
                <el-input
                  :readonly="readonly"
                  v-model="TableForm.id_no"
                  @blur="identifiBlur"
                  style="width:200px;"
                ></el-input>
                <el-radio v-model="TableForm.id_no_belong" label="0"
                  >本人</el-radio
                >
                <el-radio v-model="TableForm.id_no_belong" label="1"
                  >父母</el-radio
                >
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="3">
            <div>工作单位</div>
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-input
                :readonly="readonly"
                v-model="TableForm.employer"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="center">
          <el-col :span="3">
            <div>本人电话</div>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input
                :readonly="readonly"
                v-model="TableForm.telephone"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <div>联系人姓名</div>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input
                :readonly="readonly"
                v-model="TableForm.contact_person"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <div>联系人电话</div>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input
                :readonly="readonly"
                v-model="TableForm.contact_person_phone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="center">
          <el-col :span="3">
            <div class="lh60">常住类型</div>
          </el-col>
          <el-col :span="7">
            <div class="flex_cs lh60">
              <div>
                <el-radio-group
                  class="ml-10"
                  v-model="TableForm.hshd_rgst_type"
                >
                  <el-radio label="1">1-户籍</el-radio>
                  <el-radio label="2">2-非户籍</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.hshd_rgst_type"
                ></el-input>
              </PFormInput>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="lh60">民 族</div>
          </el-col>
          <el-col :span="11">
            <div class="lh50 text_left mt-5 ml-10 position_r">
              <el-radio-group v-model="TableForm.nation">
                <el-radio label="1">01-汉族</el-radio>
                <div class="flex_cs w100">
                  <el-radio label="2">99-少数民族</el-radio>
                  <el-form-item>
                    <el-input
                      :readonly="readonly"
                      v-model="TableForm.minorities"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-radio-group>
              <PFormInput class="position_a">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.nation"
                ></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>
        <el-row class="center">
          <el-col :span="3">
            <div class="lh60">血 型</div>
          </el-col>
          <el-col :span="21">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.blood_type">
                  <el-radio label="1">1-A型</el-radio>
                  <el-radio label="2">2-B型</el-radio>
                  <el-radio label="3">3-O型</el-radio>
                  <el-radio label="4">4-AB型</el-radio>
                  <el-radio label="5">5-不详</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.blood_type"
                ></el-input>
              </PFormInput>
            </div>
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.blood_type_rh">
                  <el-radio label="1">1-阴性</el-radio>
                  <el-radio label="2">2-阳性</el-radio>
                  <el-radio label="3">3-不详</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.blood_type_rh"
                ></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>
        <el-row class="center">
          <el-col :span="3">
            <div class="lh60">文化程度</div>
          </el-col>
          <el-col :span="21">
            <div class="flex_cs lh60">
              <div>
                <el-radio-group
                  class="ml-10 text_left"
                  v-model="TableForm.edu_lv"
                >
                  <el-radio label="1">1-研究生</el-radio>
                  <el-radio label="2">2-大学本科</el-radio>
                  <el-radio label="3">3-大学专科和专科学校</el-radio>
                  <el-radio label="4">4-中等专业校</el-radio>
                  <el-radio label="5">5-技工学校</el-radio>
                  <el-radio label="6" class="pt-5">6-高中</el-radio>
                  <el-radio label="7" class="pt-5">7-初中</el-radio>
                  <el-radio label="8" class="pt-5">8-小学</el-radio>
                  <el-radio label="9" class="pt-5">9-文盲及半文盲</el-radio>
                  <el-radio label="10" class="pt-5">10-不详</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.edu_lv"
                ></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>
        <el-row class="center">
          <el-col :span="3">
            <div class="lh62">职 业</div>
          </el-col>
          <el-col :span="21">
            <div class="flex_cs">
              <div>
                <el-radio-group
                  class="ml-10 mt-5 text_left"
                  v-model="TableForm.occuptation"
                >
                  <el-radio label="1"
                    >1-国家机关、党群组织、企、事业单位负责人</el-radio
                  >
                  <el-radio label="2">2-专业技术人员</el-radio>
                  <el-radio label="3">3-办事人员和有关人员</el-radio>
                  <el-radio label="4" class="pt-5">4-商业、服务业人员</el-radio>
                  <el-radio label="5" class="pt-5"
                    >5-农、林、牧、渔、水利业生产人员</el-radio
                  >
                  <el-radio label="6" class="pt-5"
                    >6-生产、运输设备操作人员及有关人员</el-radio
                  >
                  <el-radio label="7" class="pt-5">7-军人</el-radio>
                  <el-radio label="8" class="pt-5"
                    >8-不便分类的其他从业人员</el-radio
                  >
                  <el-radio label="9" class="pt-5">9-无职业</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.occuptation"
                ></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>
        <el-row class="center">
          <el-col :span="3">
            <div>婚姻状况</div>
          </el-col>
          <el-col :span="21">
            <div class="flex_cs">
              <div>
                <el-radio-group
                  class="ml-10 text_left"
                  v-model="TableForm.marry_status"
                >
                  <el-radio label="1">1-未婚</el-radio>
                  <el-radio label="2">2-已婚</el-radio>
                  <el-radio label="3">3-丧偶</el-radio>
                  <el-radio label="4">4-离婚</el-radio>
                  <el-radio label="5">5-未说明的婚姻状况</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.marry_status"
                ></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>
        <el-row class="center">
          <el-col :span="3">
            <div>医疗费用支付方式</div>
          </el-col>
          <el-col :span="21">
            <div class="lh20 padding-10 text_left">
              <PCheckbox
                @childValInput="childVal"
                @otherValInput="otherVal"
                :readonly="readonly"
                :formKey="'pay_method'"
                :otherKey="'pay_method_option_8'"
                :otherData="TableForm.pay_method_option_8"
                :checkboxOptions="DrinkingTypesOptions"
                :checkboxForm="chObject.pay_method"
                :clearFlag="clearFlag"
              />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="center">
            <div>暴 露 史</div>
          </el-col>
          <el-col :span="21">
            <div class="lh20 padding-10 text_left">
              <PCheckbox
                @childValInput="childVal"
                @otherValInput="otherVal"
                :readonly="readonly"
                :formKey="'expose_diagnosis'"
                :checkboxOptions="EatingHabitsOptions222"
                :checkboxForm="chObject.expose_diagnosis"
                :clearFlag="clearFlag"
              />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="1" class="center">
            <div>
              <div>既</div>
              <div>往</div>
              <div>史</div>
            </div>
          </el-col>
          <el-col :span="23">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="2" class="center">
                  <div>疾病</div>
                </el-col>
                <el-col :span="22" class="text_left pl-10">
                  <PHealthGuidance
                    :disease="true"
                    :readonly="readonly"
                    :formKey="'hazard_control'"
                    @childValInput="childVal"
                    @otherInput="HealthGuidanceInput"
                    :checkboxOptions="chObject.RiskFactorsOptions"
                    :checkboxForm="chObject.hazard_control"
                    :clearFlag="clearFlag"

                  />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="2" class="center">
                  <div>手 术</div>
                </el-col>
                <el-col :span="22">
                  <div class="ml-10 text_left flex_cs">
                    <el-radio-group
                      class="flex mt-5"
                      v-model="TableForm.ph_opeation"
                    >
                      <el-radio label="1">1-无</el-radio>
                      <el-radio label="2">2-有：</el-radio>
                    </el-radio-group>
                    <div class="mt-5">名称1</div>
                    <el-form-item>
                      <el-input
                        :readonly="readonly"
                        v-model="TableForm.ph_opeation_1"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>时间</div>
                    <el-form-item>
                      <el-input
                        @change="DateConversion('ph_opeation_time_1', $event)"
                        :readonly="readonly"
                        v-model="TableForm.ph_opeation_time_1"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>名称2</div>
                    <el-form-item>
                      <el-input
                        :readonly="readonly"
                        v-model="TableForm.ph_opeation_2"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>时间</div>
                    <el-form-item>
                      <el-input
                        @change="DateConversion('ph_opeation_time_2', $event)"
                        :readonly="readonly"
                        v-model="TableForm.ph_opeation_time_2"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.ph_opeation"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="2" class="center">
                  <div>外 伤</div>
                </el-col>
                <el-col :span="22">
                  <div class="ml-10 text_left flex_cs">
                    <el-radio-group
                      class="flex mt-5"
                      v-model="TableForm.ph_trauma"
                    >
                      <el-radio label="1">1-无</el-radio>
                      <el-radio label="2">2-有：</el-radio>
                    </el-radio-group>
                    <div class="mt-5">名称1</div>
                    <el-form-item>
                      <el-input
                        :readonly="readonly"
                        v-model="TableForm.ph_trauma_1"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>时间</div>
                    <el-form-item>
                      <el-input
                        @change="DateConversion('ph_trauma_time_1', $event)"
                        :readonly="readonly"
                        v-model="TableForm.ph_trauma_time_1"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>名称2</div>
                    <el-form-item>
                      <el-input
                        :readonly="readonly"
                        v-model="TableForm.ph_trauma_2"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>时间</div>
                    <el-form-item>
                      <el-input
                        @change="DateConversion('ph_trauma_time_2', $event)"
                        :readonly="readonly"
                        v-model="TableForm.ph_trauma_time_2"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.ph_trauma"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="2" class="center">
                  <div>输 血</div>
                </el-col>
                <el-col :span="22">
                  <div class="ml-10 text_left flex_cs">
                    <el-radio-group
                      class="flex mt-5"
                      v-model="TableForm.ph_transfusion"
                    >
                      <el-radio label="1">1-无</el-radio>
                      <el-radio label="2">2-有：</el-radio>
                    </el-radio-group>
                    <div class="mt-5">原因1</div>
                    <el-form-item>
                      <el-input
                        :readonly="readonly"
                        v-model="TableForm.ph_transfusion_1"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>时间</div>
                    <el-form-item>
                      <el-input
                        @change="
                          DateConversion('ph_transfusion_time_1', $event)
                        "
                        :readonly="readonly"
                        v-model="TableForm.ph_transfusion_time_1"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>原因2</div>
                    <el-form-item>
                      <el-input
                        :readonly="readonly"
                        v-model="TableForm.ph_transfusion_2"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>时间</div>
                    <el-form-item>
                      <el-input
                        @change="
                          DateConversion('ph_transfusion_time_2', $event)
                        "
                        :readonly="readonly"
                        v-model="TableForm.ph_transfusion_time_2"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.ph_transfusion"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="center">
            <div>家 族 史</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="2" class="center">
                  <div>父 亲</div>
                </el-col>
                <el-col :span="10" class="flex_c">
                  <PFormInput
                    class="flex_c fl pl-10"
                    v-for="(v, i) in chObject.fh_father_diagnosis"
                    :key="i"
                  >
                    <el-form-item prop="value">
                      <el-input
                        v-if="!readonly"
                        @input="inputTest(i, 'fh_father_diagnosis', $event)"
                        :readonly="readonly"
                        v-model="v.value"
                      ></el-input>
                    </el-form-item>
                  </PFormInput>
                  <el-input
                    class="ml-10"
                    :readonly="readonly"
                    v-model="TableForm.fh_father_diagnosis_3_context"
                  ></el-input>
                </el-col>
                <el-col :span="2" class="center">
                  <div>母 亲</div>
                </el-col>
                <el-col :span="10" class="flex_c">
                  <PFormInput
                    class="flex_c fl pl-10"
                    v-for="(v, i) in chObject.fh_mother_diagnosis"
                    :key="i"
                  >
                    <el-form-item prop="value">
                      <el-input
                        @input="inputTest(i, 'fh_mother_diagnosis', $event)"
                        :readonly="readonly"
                        v-model="v.value"
                      ></el-input>
                    </el-form-item>
                  </PFormInput>
                  <el-input
                    class="ml-10"
                    :readonly="readonly"
                    v-model="TableForm.fh_mother_diagnosis_3_context"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="2" class="center">
                  <div>兄弟姐妹</div>
                </el-col>
                <el-col :span="10" class="flex_c">
                  <PFormInput
                    class="flex_c fl pl-10"
                    v-for="(v, i) in chObject.fh_brother_diagnosis"
                    :key="i"
                  >
                    <el-form-item prop="value">
                      <el-input
                        @input="inputTest(i, 'fh_brother_diagnosis', $event)"
                        :readonly="readonly"
                        v-model="v.value"
                      ></el-input>
                    </el-form-item>
                  </PFormInput>
                  <el-input
                    class="ml-10"
                    :readonly="readonly"
                    v-model="TableForm.fh_brother_diagnosis_3_context"
                  ></el-input>
                </el-col>
                <el-col :span="2" class="center">
                  <div>子 女</div>
                </el-col>
                <el-col :span="10" class="flex_c">
                  <PFormInput
                    class="flex_c fl pl-10"
                    v-for="(v, i) in chObject.fh_son_diagnosis"
                    :key="i"
                  >
                    <el-form-item prop="value">
                      <el-input
                        @input="inputTest(i, 'fh_son_diagnosis', $event)"
                        :readonly="readonly"
                        v-model="v.value"
                      ></el-input>
                    </el-form-item>
                  </PFormInput>
                  <el-input
                    class="ml-10"
                    :readonly="readonly"
                    v-model="TableForm.fh_son_diagnosis_context_3"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row class="text_left">
                <el-col :span="24" class="flex_c flex_wrap">
                  <div class="pl-10">1-无</div>
                  <div class="pl-10">2-高血压</div>
                  <div class="pl-10">3-糖尿病</div>
                  <div class="pl-10">4-冠心病</div>
                  <div class="pl-10">5-慢性阻塞性肺疾病</div>
                  <div class="pl-10">6-恶性肿瘤</div>
                  <div class="pl-10">7-脑卒中</div>
                  <div class="pl-10">8-严重精神障碍</div>
                  <div class="pl-10">9-结核病</div>
                  <div class="pl-10">10-肝炎</div>
                  <div class="pl-10">11-先天畸形</div>
                  <div class="pl-10">12-其他</div>
                  <!-- <div class="pl-10 flex_c">
                    <div class="w90">12-其他</div>
                    <el-input
                      class="ml-10"
                      :readonly="readonly"
                      v-model="TableForm.occupational_hazards_history"
                    ></el-input>
                  </div>-->
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="center">
            <div>遗传病史</div>
          </el-col>
          <el-col :span="22" class="flex_cs">
            <div class="ml-10 text_left flex_c">
              <el-radio-group
                class="flex mt-5"
                v-model="TableForm.genetic_history"
              >
                <el-radio label="1">1-无</el-radio>
                <el-radio label="2">2-有：</el-radio>
              </el-radio-group>
              <div class="mt-2">疾病名称</div>
              <el-form-item>
                <el-input
                  :readonly="readonly"
                  v-model="TableForm.genetic_history_option_2"
                  class="w90"
                ></el-input>
              </el-form-item>
            </div>
            <PFormInput class="mr-10">
              <el-input
                v-if="!readonly"
                :readonly="readonly"
                v-model="TableForm.genetic_history"
              ></el-input>
            </PFormInput>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="center">
            <div>残疾情况</div>
          </el-col>
          <el-col :span="22">
            <div class="lh20 padding-10 text_left">
              <PCheckbox
                @childValInput="childVal"
                @otherValInput="otherVal"
                :readonly="readonly"
                :formKey="'disability'"
                :otherKey="'disability_option_8'"
                :otherData="TableForm.disability_option_8"
                :checkboxOptions="EatingHabitsOptions333"
                :checkboxForm="chObject.disability"
                :clearFlag="clearFlag"
              />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2" class="center">
            <div>生活环境*</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="3" class="center">
                  <div>厨房排风设施</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <div>
                      <el-radio-group
                        class="ml-10 text_left"
                        v-model="TableForm.env_kitchen_exhaust"
                      >
                        <el-radio label="1">1-无</el-radio>
                        <el-radio label="2">2-油烟机</el-radio>
                        <el-radio label="3">3-换气扇</el-radio>
                        <el-radio label="4">4-烟囱</el-radio>
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.env_kitchen_exhaust"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3" class="center">
                  <div>燃料类型</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <div>
                      <el-radio-group
                        class="ml-10 text_left"
                        v-model="TableForm.env_fuel_type"
                      >
                        <el-radio label="1">1-液化气</el-radio>
                        <el-radio label="2">2-煤</el-radio>
                        <el-radio label="3">3-天然气</el-radio>
                        <el-radio label="4">4-沼气</el-radio>
                        <el-radio label="5">5-柴火</el-radio>
                        <el-radio label="6">6-其他</el-radio>
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.env_fuel_type"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3" class="center">
                  <div>饮水</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <div>
                      <el-radio-group
                        class="ml-10 text_left"
                        v-model="TableForm.env_drinking_water"
                      >
                        <el-radio label="1">1-自来水</el-radio>
                        <el-radio label="2">2-经净化过滤的水</el-radio>
                        <el-radio label="3">3-井水</el-radio>
                        <el-radio label="4">4-河湖水</el-radio>
                        <el-radio label="5">5-塘水</el-radio>
                        <el-radio label="6">6-其他</el-radio>
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.env_drinking_water"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3" class="center">
                  <div>厕所</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <div>
                      <el-radio-group
                        class="ml-10 text_left"
                        v-model="TableForm.env_toilet"
                      >
                        <el-radio label="1">1-卫生厕所</el-radio>
                        <el-radio label="2">2-一格或二格粪池式</el-radio>
                        <el-radio label="3">3-马桶</el-radio>
                        <el-radio label="4">4-露天粪坑</el-radio>
                        <el-radio label="5">5-简易棚厕</el-radio>
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.env_toilet"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3" class="center">
                  <div>禽畜栏</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <div>
                      <el-radio-group
                        class="ml-10 text_left"
                        v-model="TableForm.env_corral"
                      >
                        <el-radio label="1">1-无</el-radio>
                        <el-radio label="2">2-单设</el-radio>
                        <el-radio label="3">3-室内</el-radio>
                        <el-radio label="4">4-室外</el-radio>
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.env_corral"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </main>
    </el-form>
  </el-row>
</template>

<script>
import { dateConversion } from "@/utils/common";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "HealthChecklistPage1",
  components: {},
  data() {
    return {
      // 是否只读
      readonly: false,
      // input最大个数
      maxLength: 0,
      // 状态 新增 查看 编辑  view edit
      status: this.$store.state.table.tableStatus,
      // 表单数据
      TableForm: {
        gender: "", //性别
        birthday: "", //生日
        telephone: "", //本人电话
        dig_doc_no: "", //编号
        rsdt_name: "", //姓名
        id_no: "", //身份证号
        id_no_belong: "0", //身份证号属于 0:本人,1:父母
        employer: "", //工作单位
        contact_person: "", //联系人姓名
        contact_person_phone: "", //联系人电话
        hshd_rgst_type: "", //常驻类型 1:户籍,2:非户籍
        nation: "", //民族
        minorities: "", //少数民族
        blood_type: "", //血型
        blood_type_rh: "", //血型RH
        edu_lv: "", //文化程度
        occuptation: "", //职业
        marry_status: "", //婚姻状况
        pay_method: "", //医疗费用支付方式
        pay_method_option_8: "", //医疗费用支付方式其他
        expose_diagnosis: "", //暴露史
        ph_diagnosis_option_6: "", //恶性肿瘤
        ph_diagnosis_option_12: "", //职业病
        ph_diagnosis_option_13: "", //其他
        ph_opeation: "", //既往史 手术 1无 2有
        ph_opeation_1: "", //既往史 手术1
        ph_opeation_time_1: "", //既往史 手术1 时间
        ph_opeation_2: "", //既往史 手术2
        ph_opeation_time_2: "", //既往史 手术2 时间
        ph_trauma: "", //既往史 外伤 1无 2有
        ph_trauma_1: "", //既往史 外伤1
        ph_trauma_time_1: "", //既往史 外伤1 时间
        ph_trauma_2: "", //既往史 外伤2
        ph_trauma_time_2: "", //既往史 外伤2 时间
        ph_transfusion: "", //既往史 输血 1无 2有
        ph_transfusion_1: "", //既往史 输血1
        ph_transfusion_time_1: "", //既往史 输血1 时间
        ph_transfusion_2: "", //既往史 输血2
        ph_transfusion_time_2: "", //既往史 输血2 时间
        fh_father_diagnosis: "", //家族史 父亲 诊断
        fh_father_diagnosis_3_context: "", //家族史 父亲 诊断3 文本
        fh_mother_diagnosis: "", //家族史 母亲 诊断
        fh_mother_diagnosis_3_context: "", //家族史 母亲 诊断3 文本
        fh_brother_diagnosis: "", //家族史 兄弟姐妹 诊断
        fh_brother_diagnosis_3_context: "", //家族史 兄弟姐妹 诊断3 文本
        fh_son_diagnosis: "", //家族史 子女 诊断
        fh_son_diagnosis_context_3: "", //家族史 子女 诊断3 文本
        genetic_history: "", //遗传病史
        genetic_history_option_2: "", //疾病名称
        disability: "", //残疾情况
        disability_option_8: "", //残疾情况其他
        env_kitchen_exhaust: "", //厨房排风设施
        env_fuel_type: "", //燃料类型
        env_drinking_water: "", //饮水
        env_toilet: "", //厕所
        env_corral: "" //禽畜栏
      },
      // --- checkbox Data ---
      EatingHabitsOptions222: [
        { id: "1", content: "无" },
        { id: "2", content: "化学品" },
        { id: "3", content: "毒物" },
        { id: "4", content: "射线" }
      ],
      EatingHabitsOptions333: [
        { id: "1", content: "无残疾" },
        { id: "2", content: "视力残疾" },
        { id: "3", content: "听力残疾" },
        { id: "4", content: "言语残疾" },
        { id: "5", content: "肢体残疾" },
        { id: "6", content: "智力残疾" },
        { id: "7", content: "精神残疾" },
        { id: "8", content: "其他残疾" }
      ],
      DrinkingTypesOptions: [
        { id: "1", content: "城镇职工基本医疗保险" },
        { id: "2", content: "城镇居民基本医疗保险" },
        { id: "3", content: "新型农村合作医疗" },
        { id: "4", content: "贫困救助" },
        { id: "5", content: "商业医疗保险" },
        { id: "6", content: "全公费" },
        { id: "7", content: "全自费" },
        { id: "8", content: "其他" }
      ],
      chObject: {
        fh_son_diagnosis: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ],
        fh_brother_diagnosis: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ],
        fh_mother_diagnosis: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ],
        fh_father_diagnosis: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ],
        disability: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ],
        expose_diagnosis: [{ value: "" }, { value: "" }, { value: "" }],
        pay_method: [{ value: "" }, { value: "" }, { value: "" }],
        RiskFactorsOptions: [
          { id: "1", content: "无" },
          { id: "2", content: "高血压" },
          { id: "3", content: "糖尿病" },
          { id: "4", content: "冠心病" },
          { id: "5", content: "慢性阻塞性肺疾病" },
          {
            id: "6",
            content: "恶性肿瘤",
            value: "",
            key: "ph_diagnosis_option_6"
          },
          { id: "7", content: "脑卒中" },
          { id: "8", content: "严重精神障碍" },
          { id: "9", content: "结核病" },
          { id: "10", content: "肝炎" },
          { id: "11", content: "其他法定传染病" },
          {
            id: "12",
            content: "职业病",
            value: "",
            key: "ph_diagnosis_option_12"
          },
          {
            id: "13",
            content: "其他",
            value: "",
            key: "ph_diagnosis_option_13"
          }
        ],
        hazard_control: [
          { value: "", date: "" },
          { value: "", date: "" },
          { value: "", date: "" },
          { value: "", date: "" },
          { value: "", date: "" },
          { value: "", date: "" }
        ]
      },
      showStyle : true,
      clearFlag:false
      // --- checkbox Data ---
    };
  },
  computed: {
    ...mapGetters("table", ["AllStepData"])
  },
  created() {
    console.log("this.status", this.status);
    this.EchoMethod();
  },
  mounted() {
    if (this.status != "view") {
      this.init();
    }
  },
  methods: {
    identifiBlur() {
      if (this.TableForm.id_no && this.TableForm.id_no.length === 18) {
        //获取身份证中的性别
        let gender = parseInt(this.TableForm.id_no.substr(16, 1)) % 2;
        if (gender == 1) {
          this.TableForm.gender = '1';
        } else {
          this.TableForm.gender = '2';
        }
          //根据出生日期带入年龄
          //根据身份证号带入出生日期与年龄
          let str = this.TableForm.id_no.slice(6, 14);
          let birthday = str.slice(0, 4) + '-' + str.slice(4, 6) + '-' + str.slice(6, 8);
          if (Number(str).toString().length == 8) {
            this.TableForm.birthday = birthday;
          }
      }else{
        this.$message.error("身份证号不得少于18位")
      }
      // //获取相似档案信息
      // this.patientBlur();
    },
    init() {
      setTimeout(() => {
        this.initInput();
        this.addEnterListener();
      }, 10);
    },
    emptyData(){
      //  dig_doc_no: "", //编号
      // rsdt_name: "", //姓名
         for(var obj in this.TableForm){
           if(obj == 'dig_doc_no'){//编号
                continue
           }else if(obj == "rsdt_name"){
                continue
           }else{
              this.TableForm[obj] = ""
           }
         };
         this.chObject = {
            fh_son_diagnosis: [
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" }
            ],
            fh_brother_diagnosis: [
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" }
            ],
            fh_mother_diagnosis: [
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" }
            ],
            fh_father_diagnosis: [
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" }
            ],
            disability: [
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" },
              { value: "" }
            ],
            expose_diagnosis: [{ value: "" }, { value: "" }, { value: "" }],
            pay_method: [{ value: "" }, { value: "" }, { value: "" }],
            RiskFactorsOptions: [
              { id: "1", content: "无" },
              { id: "2", content: "高血压" },
              { id: "3", content: "糖尿病" },
              { id: "4", content: "冠心病" },
              { id: "5", content: "慢性阻塞性肺疾病" },
              {
                id: "6",
                content: "恶性肿瘤",
                value: "",
                key: "ph_diagnosis_option_6"
              },
              { id: "7", content: "脑卒中" },
              { id: "8", content: "严重精神障碍" },
              { id: "9", content: "结核病" },
              { id: "10", content: "肝炎" },
              { id: "11", content: "其他法定传染病" },
              {
                id: "12",
                content: "职业病",
                value: "",
                key: "ph_diagnosis_option_12"
              },
              {
                id: "13",
                content: "其他",
                value: "",
                key: "ph_diagnosis_option_13"
              }
            ],
            hazard_control: [
              { value: "", date: "" },
              { value: "", date: "" },
              { value: "", date: "" },
              { value: "", date: "" },
              { value: "", date: "" },
              { value: "", date: "" }
            ]
          }
         console.log('----',this.chObject);
         this.clearFlag = true;
         console.log(this.TableForm);
    },
    initInput() {
      // let val = document.getElementsByClassName("el-input--medium");
      let val = document
        .querySelector("#tableDialog")
        .getElementsByClassName("el-input--medium");
      for (var i = 0; i < val.length; i++) {
        // 给每个input添加id
        val[i].children[0].setAttribute("id", "elinput" + (i + 1));
        // 添加唯一index
        val[i].children[0].intpuIndex = i + 1;
      }
      // 获取最大input数   设置最大长度保证回车不会溢出
      this.maxLength = val.length;
      console.log("val.length", val.length);
      let temp = document.getElementById("elinput1");
      temp.focus();
      // const obj = {};
      // for (const prop in temp) {
      //   obj[prop] = temp[prop];
      // }
      // console.log(obj);
    },
    // 监听回车事件具体方法
    listenEnterEvent(e) {
      // console.log("listenEnterEvent", e);
      let tempIndex = e.target.intpuIndex;
      if (e.keyCode === 13) {
        // if ((e.ctrlKey && e.keyCode == 13) || (e.shiftKey && e.keyCode == 13)) {
        if (e.shiftKey && e.keyCode == 13) {
          if (tempIndex == 1) {
            return;
          }
          tempIndex--;
        } else {
          if (this.maxLength == tempIndex) {
            return;
          }
          tempIndex++;
        }
        let temp = document.getElementById("elinput" + tempIndex);
        // 设置焦点
        temp.focus();
        // const obj = {};
        // for (const prop in temp) {
        //   obj[prop] = temp[prop];
        // }
        // console.log("huiche", obj);
      }
    },
    // 开启键盘监听事件
    addEnterListener() {
      if (window.__completeEnterBind__) {
        return;
      }
      window.addEventListener("keydown", this.listenEnterEvent);
      window.__completeEnterBind__ = true;
    },
    // 移除键盘监听事件
    removeEnterListener() {
      console.log("移除键盘监听事件");
      window.removeEventListener("keydown", this.listenEnterEvent);
      window.__completeEnterBind__ = false;
    },
    // dateConversion 日期转换
    DateConversion(val, e) {
      console.log("val", val);
      console.log("e", e);
      if (this.TableForm[val].length == 8) {
        this.TableForm[val] = dateConversion(this.TableForm[val]);
      }
    },
    // 复选框 input 联动
    childVal(val, key) {
      console.log("key", key);
      this.TableForm[key] = "";
      let temp = [];
      val.forEach(el => {
        if (el.value != "") {
          temp.push(el.value);
        }
      });
      temp = temp.join(",");
      this.TableForm[key] = temp;
    },
    otherVal(val, key) {
      console.log("key", key);
      this.TableForm[key] = val;
      console.log(`this.TableForm.${key}`, this.TableForm[key]);
    },
    HealthGuidanceInput(key, val) {
      console.log("HealthGuidanceInput");
      console.log("key", key);
      console.log("val", val);
      this.TableForm[key] = val;
      console.log(`this.TableForm.${key}`, this.TableForm[key]);
    },
    inputTest(index, key, val) {
      console.log("index", index);
      console.log("key", key);
      console.log("this.chObject[key]", this.chObject[key]);
      this.TableForm[key] = "";
      let temp = [];
      this.chObject[key].forEach(el => {
        if (el.value != "") {
          temp.push(el.value);
        }
      });
      temp = temp.join(",");
      this.TableForm[key] = temp;
    },
    // 返显方法
    EchoMethod() {
      // console.log(
      //   "tableConfiguration**************",
      //   this.$store.state.table.tableConfiguration
      // );

      let tableConfiguration = {};
      if (this.status == "add") {
        this.TableForm.rsdt_name = this.AllStepData[0].rsdt_name;
        this.TableForm.telephone = this.AllStepData[0].telephone;
        return;
      }
      if (this.status == "view") {
        tableConfiguration = this.$store.state.table.viewTableConfiguration;
        // console.log("view数据返显", tableConfiguration);
      }

      if (this.status == "edit") {
        tableConfiguration = this.$store.state.table.tableConfiguration;
        tableConfiguration.editData.rsdt_name = this.AllStepData[0].rsdt_name;
        // console.log("edit数据返显", tableConfiguration);
      }

      for (let obj in this.TableForm) {
        this.TableForm[obj] = tableConfiguration.editData[obj];
      }
      if (tableConfiguration.editChObject == undefined) {
        return;
      }
       this.TableForm.telephone = this.AllStepData[0].telephone;
      let editChObject = JSON.parse(tableConfiguration.editChObject);
      // console.log("tableConfiguration.editChObject", editChObject);
      for (let obj in this.chObject) {
        this.chObject[obj] = editChObject[obj];
      }

    }
  },
  watch: {
    data: "EchoMethod"
  }
};
</script>
