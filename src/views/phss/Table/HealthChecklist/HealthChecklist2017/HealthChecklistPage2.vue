<template>
  <div class="HealthChecklistPage2">
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <main class="table_main">
        <el-row>
          <el-col :span="2">
            <div class="center">脏器功能</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="3">
                  <div>口 腔</div>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="2">
                      <div>口唇</div>
                    </el-col>
                    <el-col :span="22">
                      <div class="flex_cs">
                        <div>
                          <el-radio-group class="ml-10" v-model="TableForm.lip">
                            <el-radio label="1">1-红润</el-radio>
                            <el-radio label="2">2-苍白</el-radio>
                            <el-radio label="3">3-发绀</el-radio>
                            <el-radio label="4">4-皲裂</el-radio>
                            <el-radio label="5">5-疱疹</el-radio>
                          </el-radio-group>
                        </div>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.lip"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="2">
                      <div>齿列</div>
                    </el-col>
                    <el-col class="text_left pl-10" :span="22">
                      <PCheckbox :dentition="true" :readonly="readonly" :formKey="'tooth'" :checkboxForm="chObject.tooth"
                        :checkboxOptions="chObject.ToothOptions" @childValInput="childVal" @toothInput="toothVal" :clearFlag="clearFlag" />
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="2">
                      <div>咽部</div>
                    </el-col>
                    <el-col :span="22">
                      <div class="flex_cs">
                        <div>
                          <el-radio-group class="ml-10" v-model="TableForm.pharynx">
                            <el-radio label="1">1-无充血</el-radio>
                            <el-radio label="2">2-充血</el-radio>
                            <el-radio label="3">3-淋巴滤泡增生</el-radio>
                          </el-radio-group>
                        </div>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.pharynx"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="3">
                  <div>视 力</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex">
                    <span class="mlr-10">左眼</span>
                    <el-form-item class="mw90">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.eyesight_left"></el-input>
                    </el-form-item>
                    <span class="mlr-10">右眼</span>
                    <el-form-item class="mw90">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.eyesight_right"></el-input>
                    </el-form-item>
                    <span class="mlr-5">（矫正视力：左眼</span>
                    <el-form-item class="mw90">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.correct_eyesight_left"></el-input>
                    </el-form-item>
                    <span class="mlr-10">右眼</span>
                    <el-form-item class="mw90">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.correct_eyesight_right"></el-input>
                    </el-form-item>
                    <span class="mlr-5">)</span>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>听 力</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="TableForm.hearing">
                        <el-radio label="1">1-听见</el-radio>
                        <el-radio label="2">2-听不清或无法听见</el-radio>
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.hearing"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>运动功能</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="TableForm.sport">
                        <el-radio label="1">1-可顺利完成</el-radio>
                        <el-radio label="2">2-无法独立完成任何一个动作</el-radio>
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.sport"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="center">查体</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="3">
                  <div>眼 底*</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <el-radio-group class="ml-10 flex_cs" v-model="TableForm.fundus">
                      <el-radio label="1">1-正常</el-radio>
                      <div class="flex_cs">
                        <el-radio label="2">2-异常</el-radio>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.fundus_abnormal"></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.fundus"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>皮 肤</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs text_left mtb-5">
                    <el-radio-group class="ml-10 flex_cs flex_wrap" v-model="TableForm.skin">
                      <el-radio label="1">1-正常</el-radio>
                      <el-radio label="2">2-潮红</el-radio>
                      <el-radio label="3">3-苍白</el-radio>
                      <el-radio label="4">4-发绀</el-radio>
                      <el-radio label="5">5-黄染</el-radio>
                      <el-radio label="6">6-色素沉着</el-radio>
                      <div class="flex_cs mt-5">
                        <el-radio label="7">7-其他</el-radio>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.skin_other"></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.skin"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>巩 膜</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <el-radio-group class="flex_cs ml-10" v-model="TableForm.sclera">
                      <el-radio label="1">1-正常</el-radio>
                      <el-radio label="2">2-黄染</el-radio>
                      <el-radio label="3">3-充血</el-radio>
                      <div class="flex_cs w100">
                        <el-radio label="4">4-其他</el-radio>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.sclera_other"></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.sclera"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>淋巴结</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <el-radio-group class="flex_cs ml-10" v-model="TableForm.lymphoglandula">
                      <el-radio label="1">1-未触及</el-radio>
                      <el-radio label="2">2-锁骨上</el-radio>
                      <el-radio label="3">3-腋窝</el-radio>
                      <div class="flex_cs w100">
                        <el-radio label="4">4-其他</el-radio>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.lymphoglandula_other"></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.lymphoglandula"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>肺</div>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="3">
                      <div>桶状胸</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <div>
                          <el-radio-group class="ml-10" v-model="TableForm.barrel_chest">
                            <el-radio label="1">1-否</el-radio>
                            <el-radio label="2">2- 是</el-radio>
                          </el-radio-group>
                        </div>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.barrel_chest"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>呼吸音</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.breath_sound">
                          <el-radio label="1">1-正常</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-异常</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.breath_sound_abnormal"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.breath_sound"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>罗 音</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.rale">
                          <el-radio label="1">1-无</el-radio>
                          <el-radio label="2">2-干罗音</el-radio>
                          <el-radio label="3">3-湿罗音</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="4">4-其他</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.rale_other"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.rale"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>心 脏</div>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="3">
                      <div>心率</div>
                    </el-col>
                    <el-col :span="7">
                      <div class="flex">
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.heart_rate">
                            <template slot="append">次/分钟</template>
                          </el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="3">
                      <div>心律</div>
                    </el-col>
                    <el-col :span="11">
                      <div class="flex_cs">
                        <div>
                          <el-radio-group class="ml-10" v-model="TableForm.heart_rhythm">
                            <el-radio label="1">1-齐</el-radio>
                            <el-radio label="2">2-不齐</el-radio>
                            <el-radio label="3">3-绝对不齐</el-radio>
                          </el-radio-group>
                        </div>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.heart_rhythm"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>杂音</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.heart_noise">
                          <el-radio label="1">1-无</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-有</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.heart_noise_description"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.heart_noise"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>腹 部</div>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="3">
                      <div>压痛</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.abdomen_pressing_pain">
                          <el-radio label="1">1-无</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-有</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.abdomen_pressing_pain_description"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.abdomen_pressing_pain"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>包块</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.abdomen_mass">
                          <el-radio label="1">1-无</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-有</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.abdomen_mass_description"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.abdomen_mass"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>肝大</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.hepatomegaly">
                          <el-radio label="1">1-无</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-有</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.hepatomegaly_description"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.hepatomegaly"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>脾大</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.splenomegaly">
                          <el-radio label="1">1-无</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-有</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.splenomegaly_description"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.splenomegaly"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>移动性浊音</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.abdomen_voiced">
                          <el-radio label="1">1-无</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-有</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.abdomen_voiced_description"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.abdomen_voiced"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>下肢水肿</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <el-radio-group class="ml-10" v-model="TableForm.legs_edema">
                      <el-radio label="1">1-无</el-radio>
                      <el-radio label="2">2-有</el-radio>
                    </el-radio-group>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.legs_edema"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>足背动脉搏动*</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="TableForm.pulsation_foot_dorsal_artery">
                        <el-radio label="1">1-未触及</el-radio>
                        <el-radio label="2">2-触及双侧对称</el-radio>
                        <el-radio label="3">3-触及左侧弱或消失</el-radio>
                        <el-radio label="4">4-触及右侧弱或消失</el-radio>
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.pulsation_foot_dorsal_artery"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>肛门指诊*</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <el-radio-group class="flex_cs flex_wrap ml-10 mt-10" v-model="TableForm.rectal_touch">
                      <el-radio label="1">1-未及异常</el-radio>
                      <el-radio label="2">2-触痛</el-radio>
                      <el-radio label="3">3-包块</el-radio>
                      <el-radio label="4">4-前列腺异常</el-radio>
                      <div class="flex_cs mt-5">
                        <el-radio label="5">5-其他</el-radio>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.rectal_touch_other"></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.rectal_touch"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>乳 腺*</div>
                </el-col>
                <el-col class="text_left pl-10" :span="21">
                  <PCheckbox :readonly="readonly" :formKey="'breast'" :otherKey="'breast_other'" :otherData="TableForm.breast_other"
                    :checkboxForm="chObject.breast" :checkboxOptions="BreastOptions" @childValInput="childVal"
                    @otherValInput="otherVal" :clearFlag="clearFlag" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>妇科*</div>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="3">
                      <div>外阴</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.vulva">
                          <el-radio label="1">1-未见异常</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-异常</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.vulva_abnormal"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.vulva"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>阴道</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.vagina">
                          <el-radio label="1">1-未见异常</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-异常</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.vagina_abnormal"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.vagina"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>宫颈</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.cervix">
                          <el-radio label="1">1-未见异常</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-异常</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.cervix_abnormal"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.cervix"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>宫体</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.corpus">
                          <el-radio label="1">1-未见异常</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-异常</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.corpus_abnormal"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.corpus"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>附件</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.annex">
                          <el-radio label="1">1-未见异常</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-异常</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.annex_abnormal"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.annex"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>其他*</div>
                </el-col>
                <el-col :span="21">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.examination_other"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div>辅助检查</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="3">
                  <div>血常规*</div>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="3">
                      <div>血红蛋白</div>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.HGB">
                          <template slot="append">g/L</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <div>白细胞</div>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.WBC">
                          <template slot="append">
                            ×10
                            <sup>9</sup>/L
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <div>血小板</div>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.PLT">
                          <template slot="append">
                            ×10
                            <sup>9</sup>/L
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>其他*</div>
                    </el-col>
                    <el-col :span="21">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.blood_routine_other"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>尿常规*</div>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="3">
                      <div>尿蛋白</div>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.PRO"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <div>尿糖</div>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.urine_GLU"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <div>尿酮体</div>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.KET"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <div>尿潜血</div>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.ERY"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>其他*</div>
                    </el-col>
                    <el-col :span="21">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.urinalysis_other"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>空腹血糖*</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex">
                    <el-form-item>
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.blood_GLU_1">
                        <template slot="append">mmol/L</template>
                      </el-input>
                    </el-form-item>
                    <span class="mlr-10">或</span>
                    <el-form-item>
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.blood_GLU_2">
                        <template slot="append">mg/dL</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>心电图*</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <el-radio-group class="flex_cs ml-10" v-model="TableForm.ECG">
                      <el-radio label="1">1-正常</el-radio>
                      <div class="flex_cs w100">
                        <el-radio label="2">2-异常</el-radio>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.ECG_abnormal"></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.ECG"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </main>
    </el-form>
  </div>
</template>

<script>
  import {
    dateConversion
  } from "@/utils/common";
  export default {
    name: "HealthChecklistPage2",
    components: {},
    data() {
      return {
        // 是否只读
        readonly: false,
        // input最大个数
        maxLength: 0,
        // 状态 新增 查看 编辑  view edit
        status: this.$store.state.table.tableStatus,
        // 清楚多选框字段
        clearFlag: false,
        // 表单数据
        TableForm: {
          lip: "", //口唇
          tooth: "", //齿列
          left_up_2: "", //缺齿
          right_up_2: "", //缺齿
          left_down_2: "", //缺齿
          right_down_2: "", //缺齿
          left_up_3: "", //龋齿
          right_up_3: "", //龋齿
          left_down_3: "", //龋齿
          right_down_3: "", //龋齿
          left_up_4: "", //义齿(假牙)
          right_up_4: "", //义齿(假牙)
          left_down_4: "", //义齿(假牙)
          right_down_4: "", //义齿(假牙)
          pharynx: "", //咽部
          eyesight_left: "", //视力左眼
          eyesight_right: "", //视力右眼
          correct_eyesight_left: "", //矫正视力左眼
          correct_eyesight_right: "", //矫正视力右眼
          hearing: "", //听力
          sport: "", //运动功能
          fundus: "", //眼底
          fundus_abnormal: "", //眼底异常
          skin: "", //皮肤
          skin_other: "", //皮肤其他
          sclera: "", //巩膜
          sclera_other: "", //巩膜其他
          lymphoglandula: "", //淋巴结
          lymphoglandula_other: "", //淋巴结其他
          barrel_chest: "", //桶状胸
          breath_sound: "", //呼吸音
          breath_sound_abnormal: "", //呼吸音异常
          rale: "", //罗音
          rale_other: "", //罗音其他
          heart_rate: "", //心率
          heart_rhythm: "", //心律
          heart_noise: "", //杂音
          heart_noise_description: "", //杂音有
          abdomen_pressing_pain: "", //腹部压痛
          abdomen_pressing_pain_description: "", //腹部压痛有
          abdomen_mass: "", //腹部包块
          abdomen_mass_description: "", //腹部包块有
          hepatomegaly: "", //腹部肝大
          hepatomegaly_description: "", //腹部肝大有
          splenomegaly: "", //腹部脾大
          splenomegaly_description: "", //腹部脾大有
          abdomen_voiced: "", //腹部移动性浊音
          abdomen_voiced_description: "", //腹部移动性浊音有
          legs_edema: "", //下肢水肿
          pulsation_foot_dorsal_artery: "", //足背动脉搏动
          rectal_touch: "", //肛门指诊
          rectal_touch_other: "", //肛门指诊其他
          breast: "", //乳腺
          breast_other: "", //乳腺其他
          vulva: "", //妇科外阴
          vulva_abnormal: "", //妇科外阴异常
          vagina: "", //妇科阴道
          vagina_abnormal: "", //妇科阴道异常
          cervix: "", //妇科宫颈
          cervix_abnormal: "", //妇科宫颈异常
          corpus: "", //妇科宫体
          corpus_abnormal: "", //妇科宫体异常
          annex: "", //妇科附件
          annex_abnormal: "", //妇科附件异常
          examination_other: "", //查体其他
          HGB: "", //血常规血红蛋白
          WBC: "", //血常规白细胞
          PLT: "", //血常规血小板
          blood_routine_other: "", //血常规其他
          PRO: "", //尿常规尿蛋白
          urine_GLU: "", //尿常规尿糖
          KET: "", //尿常规尿酮体
          ERY: "", //尿常规尿潜血
          urinalysis_other: "", //尿常规其他
          blood_GLU_1: "", //空腹血糖mmol/L
          blood_GLU_2: "", //空腹血糖mg/dL
          ECG: "", //心电图
          ECG_abnormal: "" //心电图异常
        },
        // 方格input数据源   返显使用
        chObject: {
          ToothOptions: [{
              id: "1",
              content: "正常"
            },
            {
              id: "2",
              content: "缺齿",
              input: {
                left_up: "",
                right_up: "",
                left_down: "",
                right_down: ""
              }
            },
            {
              id: "3",
              content: "龋齿",
              input: {
                left_up: "",
                right_up: "",
                left_down: "",
                right_down: ""
              }
            },
            {
              id: "4",
              content: "义齿(假牙)",
              input: {
                left_up: "",
                right_up: "",
                left_down: "",
                right_down: ""
              }
            }
          ],
          tooth: [{
            value: ""
          }, {
            value: ""
          }, {
            value: ""
          }],
          breast: [{
            value: ""
          }, {
            value: ""
          }, {
            value: ""
          }, {
            value: ""
          }], //乳腺
          DrinkingTypesForm: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ]
        },
        // --- checkbox Data ---
        BreastOptions: [{
            id: "1",
            content: "未见异常"
          },
          {
            id: "2",
            content: "乳房切除"
          },
          {
            id: "3",
            content: "异常泌乳"
          },
          {
            id: "4",
            content: "乳腺包块"
          },
          {
            id: "5",
            content: "其他"
          }
        ],

        DrinkingTypesOptions: [{
            id: "1",
            content: "白酒"
          },
          {
            id: "2",
            content: "啤酒"
          },
          {
            id: "3",
            content: "红酒"
          },
          {
            id: "4",
            content: "黄酒"
          },
          {
            id: "5",
            content: "其他"
          }
        ]

        // --- checkbox Data ---
      };
    },
    created() {
      this.EchoMethod();
    },
    mounted() {
      if (this.status != "view") {
        this.init();
      }
    },
    methods: {
      init() {
        // 判断查看、编辑 状态
        console.log("this.status", this.status);
        setTimeout(() => {
          this.initInput();
          this.addEnterListener();
        }, 10);
      },
      emptyData() {
        for (var obj in this.TableForm) {
          this.TableForm[obj] = ""
        };
        this.chObject = {
          ToothOptions: [{
              id: "1",
              content: "正常"
            },
            {
              id: "2",
              content: "缺齿",
              input: {
                left_up: "",
                right_up: "",
                left_down: "",
                right_down: ""
              }
            },
            {
              id: "3",
              content: "龋齿",
              input: {
                left_up: "",
                right_up: "",
                left_down: "",
                right_down: ""
              }
            },
            {
              id: "4",
              content: "义齿(假牙)",
              input: {
                left_up: "",
                right_up: "",
                left_down: "",
                right_down: ""
              }
            }
          ],
          tooth: [{
            value: ""
          }, {
            value: ""
          }, {
            value: ""
          }],
          breast: [{
            value: ""
          }, {
            value: ""
          }, {
            value: ""
          }, {
            value: ""
          }], //乳腺
          DrinkingTypesForm: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ]
        }
        this.clearFlag = true;
      },
      initInput() {
        // let val = document.getElementsByClassName("el-input--medium");
        let val = document.querySelector("#tableDialog").getElementsByClassName("el-input--medium");
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
      DateConversion() {
        if (this.temp.length == 8) {
          this.temp = dateConversion(this.temp);
        }
      },
      // 复选框 input 联动
      childVal(val, key) {
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
      // 齿列 input 联动
      toothVal(val, key, id) {
        this.chObject.ToothOptions.forEach(el => {
          if (id == el.id && el.input) {
            // console.log("toothVal", val);
            el.input[key] = val;
          }
        });
        this.TableForm[key + "_" + id] = val;
        console.log("key", key);
        console.log(
          'this.TableForm[key + id + "_"]',
          this.TableForm[key + "_" + id]
        );
      },
      // 返显方法
      EchoMethod() {
        console.log(
          "tableConfiguration**************",
          this.$store.state.table.tableConfiguration
        );
        console.log("表格状态99999999", this.$store.state.table.tableStatus);
        console.log("this.status", this.status);
        let tableConfiguration = {};
        if (this.status == "add") {
          return;
        }
        if (this.status == "view") {
          tableConfiguration = this.$store.state.table.viewTableConfiguration;
          console.log("view数据返显", tableConfiguration);
        }
        if (this.status == "edit") {
          tableConfiguration = this.$store.state.table.tableConfiguration;
          console.log("edit数据返显", tableConfiguration);
        }
        for (let obj in this.TableForm) {
          this.TableForm[obj] = tableConfiguration.editData[obj];
        }
        let editChObject = JSON.parse(tableConfiguration.editChObject);
        // console.log("tableConfiguration.editChObject", editChObject);
        for (let obj in this.chObject) {
          this.chObject[obj] = editChObject[obj];
        }
        console.log("this.TableForm", this.TableForm);
        console.log("this.chObject", this.chObject);
      }
    },
    watch: {}
  };
</script>
<style lang="scss" scoped>
  .HealthChecklistPage2{
    .flex_cs{
      display: flex;
    }
    
  }

</style>
