<template>
  <div class="className">
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">健康体检表</div>
          </el-col>
        </el-row>
        <el-row class="mb-10" type="flex" justify="space-between">
          <el-col :span="12">
            <div>姓名:谭晓风</div>
          </el-col>
          <el-col :span="12">
            <div class="fr">编号:52010270480100004</div>
          </el-col>
        </el-row>
        <el-row class="mb-10" type="flex" justify="space-between">
          <el-col :span="6">
            <div>联系电话:13984103975</div>
          </el-col>
          <el-col :span="18">
            <div class="fr">地址:贵州省贵阳市南明区花果园一期四网格11栋2单元3407</div>
          </el-col>
        </el-row>
      </header>
      <main class="table_main">
        <el-row class="lh24">
          <el-col :span="3">
            <div class="center">体检日期*</div>
          </el-col>
          <el-col :span="9">
            <div class>
              <el-form-item>
                <el-input
                  @change="DateConversion"
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.checkup_date"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">责任医生</div>
          </el-col>
          <el-col :span="9">
            <div class>
              <el-select
                id="test"
                class="w100"
                v-if="!readonly"
                :readonly="readonly"
                v-model="TableForm.responsibility_doctor"
                filterable
                :default-first-option="true"
                placeholder="请选择"
              >
                <el-option
                  class="tttt"
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="center">内容</div>
          </el-col>
          <el-col :span="22">
            <div class="center">检 查 项 目</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="center">症状</div>
          </el-col>
          <el-col :span="22">
            <div class="lh20 padding-10">
              <PCheckbox
                @childValInput="childVal"
                :readonly="readonly"
                :symptom="true"
                :formKey="'symptomForm'"
                :checkboxOptions="symptomOptions"
                :checkboxForm="TableForm.symptom"
              />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="lh339 center">一般状况</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="3">
                  <div>体 温</div>
                </el-col>
                <el-col :span="7">
                  <div>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.temperature"
                      >
                        <template slot="append">℃</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div>脉 率</div>
                </el-col>
                <el-col :span="11">
                  <div class="flex itemsCenter">
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.pulse_rate"
                      >
                        <template slot="append">次/分钟</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh62">呼吸频率</div>
                </el-col>
                <el-col :span="7">
                  <div class="margin-16">
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.respiratory_rate"
                      >
                        <template slot="append">次/分钟</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="lh62">血 压*</div>
                </el-col>
                <el-col :span="11">
                  <el-row>
                    <el-col :span="4">
                      <div>左侧</div>
                    </el-col>
                    <el-col :span="20">
                      <div class="flex itemsCenter">
                        <el-form-item>
                          <el-input
                            class="w90"
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.blood_pressure_left"
                          ></el-input>
                        </el-form-item>
                        <span>&nbsp;/&nbsp;</span>
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.blood_pressure_left"
                          >
                            <template slot="append">mmHg</template>
                          </el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4">
                      <div>右侧</div>
                    </el-col>
                    <el-col :span="20">
                      <div class="flex itemsCenter">
                        <el-form-item>
                          <el-input
                            class="w90"
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.blood_pressure_right"
                          ></el-input>
                        </el-form-item>
                        <span>&nbsp;/&nbsp;</span>
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.blood_pressure_right"
                          >
                            <template slot="append">mmHg</template>
                          </el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>身 高*</div>
                </el-col>
                <el-col :span="7">
                  <div>
                    <el-form-item>
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.height">
                        <template slot="append">cm</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div>体 重*</div>
                </el-col>
                <el-col :span="11">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.weight">
                      <template slot="append">kg</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh62">腰 围</div>
                </el-col>
                <el-col :span="7">
                  <div class="margin-16">
                    <el-form-item>
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.waistline">
                        <template slot="append">cm</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="lh30">体质指数（BMI）</div>
                </el-col>
                <el-col :span="11">
                  <div class="margin-16">
                    <el-form-item>
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.BMI">
                        <template slot="append">Kg/m2</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh20">老年人健康状态自我评估</div>
                </el-col>
                <el-col :span="21">
                  <div class="lh40 flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="TableForm.health_status">
                        <el-radio label="1">1-满意</el-radio>
                        <el-radio label="2">2-基本满意</el-radio>
                        <el-radio label="3">3-说不清楚</el-radio>
                        <el-radio label="4">4-不大满意</el-radio>
                        <el-radio label="5">5-不满意</el-radio>
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.health_status"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh20">老年人生活自理能力自我评估</div>
                </el-col>
                <el-col class="pt-10" :span="21">
                  <div class="lh50">
                    <el-radio-group class="ml-10 text_left" v-model="TableForm.self_care">
                      <el-radio label="1">1-可自理（0～3分）</el-radio>
                      <el-radio label="2">2-轻度依赖（4～8分）</el-radio>
                      <el-radio label="3">3-中度依赖（9～18分）</el-radio>
                      <el-radio class="mt-10" label="4">4-不能自理（≥19分）</el-radio>
                      <div class="fr mt-5 mr-5 mb-5">
                        <PFormInput class="mr-10">
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.self_care"
                          ></el-input>
                        </PFormInput>
                        <!-- <el-button type="primary">选择评估结果</el-button>
                        <el-button type="primary">添加评估</el-button>-->
                      </div>
                    </el-radio-group>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh28">老年人认知功能</div>
                </el-col>
                <el-col :span="21">
                  <div class="lh50 text_left ml-10 position_r mt-5">
                    <el-radio-group v-model="TableForm.cognition">
                      <el-radio label="1">1-粗筛阴性</el-radio>
                      <div class="flex_cs w100">
                        <el-radio label="2">2-粗筛阳性 ，简易智力状态检查，总分</el-radio>
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.cognition_total_score"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="position_a">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.cognition"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh28">老年人情感状态</div>
                </el-col>
                <el-col :span="21">
                  <div class="lh50 text_left ml-10 position_r mt-5">
                    <el-radio-group v-model="TableForm.emotional_state">
                      <el-radio label="1">1-粗筛阴性</el-radio>
                      <div class="flex_cs w100">
                        <el-radio label="2">2-粗筛阳性 ，老年人抑郁评分检查，总分</el-radio>
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.emotional_total_score"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="position_a">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.emotional_state"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="lh636 center">生活方式</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="3">
                  <div class="lh93">体育锻炼</div>
                </el-col>
                <el-col :span="21">
                  <div>
                    <el-row>
                      <el-col :span="4">
                        <div>锻炼频率</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="flex_cs">
                          <div>
                            <el-radio-group class="ml-10" v-model="TableForm.exercise_frequency">
                              <el-radio label="1">1-每天</el-radio>
                              <el-radio label="2">2-每周一次以上</el-radio>
                              <el-radio label="3">3-偶尔</el-radio>
                              <el-radio label="4">4-不锻炼</el-radio>
                            </el-radio-group>
                          </div>
                          <PFormInput class="mr-10">
                            <el-input
                              v-if="!readonly"
                              :readonly="readonly"
                              v-model="TableForm.exercise_frequency"
                            ></el-input>
                          </PFormInput>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div>每次锻炼时间</div>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.each_exercise_duration"
                          >
                            <template slot="append">分钟</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <div>坚持锻炼时间</div>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.exercise_duration"
                          >
                            <template slot="append">年</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div>锻炼方式</div>
                      </el-col>
                      <el-col :span="20">
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.exercise_type"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh60">饮食习惯</div>
                </el-col>
                <el-col :span="21">
                  <div class="lh20 padding-10 text_left">
                    <PCheckbox
                      @childValInput="childVal"
                      :readonly="readonly"
                      :formKey="'EatingHabitsForm'"
                      :checkboxOptions="EatingHabitsOptions"
                      :checkboxForm="TableForm.eating_habits"
                    />
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh93">吸烟情况</div>
                </el-col>
                <el-col :span="21">
                  <div>
                    <el-row>
                      <el-col :span="4">
                        <div>吸烟状况</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="flex_cs">
                          <div>
                            <el-radio-group class="ml-10" v-model="TableForm.smoking">
                              <el-radio label="1">1-从不吸烟</el-radio>
                              <el-radio label="2">2-已戒烟</el-radio>
                              <el-radio label="3">3-吸烟</el-radio>
                            </el-radio-group>
                          </div>
                          <PFormInput class="mr-10">
                            <el-input
                              v-if="!readonly"
                              :readonly="readonly"
                              v-model="TableForm.smoking"
                            ></el-input>
                          </PFormInput>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div>日吸烟量</div>
                      </el-col>
                      <el-col :span="20">
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.smoking_amount"
                          >
                            <template slot="append">支</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div>开始吸烟年龄</div>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.smoking_age"
                          >
                            <template slot="append">岁</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <div>戒烟年龄</div>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.quit_smoking_age"
                          >
                            <template slot="append">岁</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh204">饮酒情况</div>
                </el-col>
                <el-col :span="21">
                  <div>
                    <el-row>
                      <el-col :span="4">
                        <div>饮酒频率</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="flex_cs">
                          <div>
                            <el-radio-group class="ml-10" v-model="TableForm.drinking_frequency">
                              <el-radio label="1">1-从不</el-radio>
                              <el-radio label="2">2-偶尔</el-radio>
                              <el-radio label="3">3-经常</el-radio>
                              <el-radio label="4">4-每天</el-radio>
                            </el-radio-group>
                          </div>
                          <PFormInput class="mr-10">
                            <el-input
                              v-if="!readonly"
                              :readonly="readonly"
                              v-model="TableForm.drinking_frequency"
                            ></el-input>
                          </PFormInput>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div>日饮酒量</div>
                      </el-col>
                      <el-col :span="20">
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.drinking_amount"
                          >
                            <template slot="append">两</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="4">
                        <div class="lh56">是否戒酒</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="lh50 text_left mt-5 ml-10 position_r">
                          <el-radio-group v-model="TableForm.quit_drinking">
                            <el-radio label="1">1-未戒酒</el-radio>
                            <div class="flex_cs w100">
                              <el-radio label="2">2-已戒酒 ，戒酒年龄（岁）：</el-radio>
                              <el-form-item>
                                <el-input
                                  v-if="!readonly"
                                  :readonly="readonly"
                                  v-model="TableForm.quit_drinking"
                                ></el-input>
                              </el-form-item>
                            </div>
                          </el-radio-group>
                          <PFormInput class="position_a">
                            <el-input
                              v-if="!readonly"
                              :readonly="readonly"
                              v-model="TableForm.quit_drinking"
                            ></el-input>
                          </PFormInput>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div>开始饮酒年龄</div>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.drinking_age"
                          >
                            <template slot="append">岁</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <div>近一年内是否曾醉酒</div>
                      </el-col>
                      <el-col class="text_left flex_cs" :span="8">
                        <el-radio-group class="ml-10" v-model="TableForm.drunk_nearly_year">
                          <el-radio label="1">1-是</el-radio>
                          <el-radio label="2">2-否</el-radio>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.drunk_nearly_year"
                          ></el-input>
                        </PFormInput>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="lh53">饮酒种类</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="lh20 padding-10 text_left">
                          <PCheckbox
                            @childValInput="childVal"
                            :readonly="readonly"
                            :formKey="'DrinkingTypesForm'"
                            :checkboxOptions="DrinkingTypesOptions"
                            :checkboxForm="TableForm.drinking_type"
                          />
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="padding-60">职业病危害因素接触史</div>
                </el-col>
                <el-col :span="21">
                  <div class="ml-10 text_left flex_cs">
                    <el-radio-group
                      class="flex mt-5"
                      v-model="TableForm.occupational_hazards_history"
                    >
                      <el-radio label="1">1-无</el-radio>
                      <el-radio label="2">2-有</el-radio>
                    </el-radio-group>
                    <div class="ml-10">(工种</div>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.work_type"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>从业时间</div>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.working_hours"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>年)</div>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.occupational_hazards_history"
                      ></el-input>
                    </PFormInput>
                  </div>
                  <div class="ml-10 text_left flex_cs">
                    <div class="mr-10">毒物种类 粉 尘</div>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.dust"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>防护措施</div>
                    <el-radio-group class="flex mt-5" v-model="TableForm.dust_protect">
                      <el-radio label="1">1-无</el-radio>
                      <el-radio label="2">2-有</el-radio>
                    </el-radio-group>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.dust_have_protect"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.dust_protect"
                      ></el-input>
                    </PFormInput>
                  </div>
                  <div class="ml-10 text_left flex_cs">
                    <div class="mr-10">放射物质</div>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.radioactive_material"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>防护措施</div>
                    <el-radio-group
                      class="flex mt-5"
                      v-model="TableForm.radioactive_material_protect"
                    >
                      <el-radio label="1">1-无</el-radio>
                      <el-radio label="2">2-有</el-radio>
                    </el-radio-group>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.radioactive_material_have_protect"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.radioactive_material_protect"
                      ></el-input>
                    </PFormInput>
                  </div>
                  <div class="ml-10 text_left flex_cs">
                    <div class="mr-10">物理因素</div>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.physical_factor"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>防护措施</div>
                    <el-radio-group class="flex mt-5" v-model="TableForm.physical_factor_protect">
                      <el-radio label="1">1-无</el-radio>
                      <el-radio label="2">2-有</el-radio>
                    </el-radio-group>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.physical_factor_have_protect"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.physical_factor_protect"
                      ></el-input>
                    </PFormInput>
                  </div>
                  <div class="ml-10 text_left flex_cs">
                    <div class="mr-10">化学因素</div>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.chemical_material"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>防护措施</div>
                    <el-radio-group class="flex mt-5" v-model="TableForm.chemical_material_protect">
                      <el-radio label="1">1-无</el-radio>
                      <el-radio label="2">2-有</el-radio>
                    </el-radio-group>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.chemical_material_have_protect"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.chemical_material_protect"
                      ></el-input>
                    </PFormInput>
                  </div>
                  <div class="ml-10 text_left flex_cs">
                    <div class="mr-10">其&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;他</div>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.toxic_species_other"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>防护措施</div>
                    <el-radio-group
                      class="flex mt-5"
                      v-model="TableForm.toxic_species_other_protect"
                    >
                      <el-radio label="1">1-无</el-radio>
                      <el-radio label="2">2-有</el-radio>
                    </el-radio-group>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.toxic_species_other_have_protect"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.toxic_species_other_protect"
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
  </div>
</template>

<script>
import { dateConversion } from "@/utils/common";
export default {
  name: "className",
  components: {},
  props: {
    status: {
      type: String
    }
  },
  data() {
    return {
      // 表单数据
      TableForm: {
        checkup_date: "", //体检日期
        responsibility_doctor: "", //责任医生
        symptom: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ], //症状
        temperature: "", //体温
        pulse_rate: "", //脉率
        respiratory_rate: "", //呼吸频率(次/分钟)
        blood_pressure_left: "", //血压左侧
        blood_pressure_right: "", //血压右侧
        height: "", //身高
        weight: "", //体重
        waistline: "", //腰围
        BMI: "", //体质指数（BMI）
        health_status: "", //老年人健康状态自我评估
        self_care: "", //老年人生活自理能力自我评估
        cognition: "", //老年人认知功能
        cognition_total_score: "", //老年人认知功能总分
        emotional_state: "", //老年人情感状态
        emotional_total_score: "", //老年人情感状态总分
        exercise_frequency: "", //锻炼频率
        each_exercise_duration: "", //每次锻炼时间
        exercise_duration: "", //坚持锻炼时间
        exercise_type: "", //锻炼方式
        eating_habits: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ], //饮食习惯
        smoking: "", //吸烟状况
        smoking_amount: "", //日吸烟量
        smoking_age: "", //开始吸烟年龄
        quit_smoking_age: "", //戒烟年龄
        drinking_frequency: "", //饮酒频率
        drinking_amount: "", //日饮酒量
        quit_drinking: "", //是否戒酒
        drinking_age: "", //开始饮酒年龄
        drunk_nearly_year: "", //近一年内是否曾醉酒
        drinking_type: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ], //饮酒种类
        occupational_hazards_history: "", //职业病危害因素接触史(有/无)
        work_type: "", //工种
        working_hours: "", //从业时间    年
        dust: "", //毒物种类  粉尘
        dust_protect: "", //毒物种类  粉尘防护措施
        dust_have_protect: "", //毒物种类  粉尘防护措施
        radioactive_material: "", //毒物种类  放射物质
        radioactive_material_protect: "", //毒物种类  放射物质防护措施
        radioactive_material_have_protect: "", //毒物种类  放射物质防护措施
        physical_factor: "", //毒物种类  物理因素
        physical_factor_protect: "", //毒物种类  物理因素防护措施
        physical_factor_have_protect: "", //毒物种类  物理因素防护措施
        chemical_material: "", //毒物种类  化学物质
        chemical_material_protect: "", //毒物种类  化学物质防护措施
        chemical_material_have_protect: "", //毒物种类  化学物质防护措施
        toxic_species_other: "", //毒物种类  其他
        toxic_species_other_protect: "", //毒物种类  其他防护措施
        toxic_species_other_have_protect: "" //毒物种类  其他防护措施
      },
      temp: "",
      radio: "",
      // 表单数据
      form: {},
      formData: {
        name: ""
      },
      // 表单规则

      // 是否只读
      readonly: false,
      // input最大个数
      maxLength: 0,
      select: "",
      selectOptions: [
        {
          value: "1",
          label: "吴剑锋"
        },
        {
          value: "2",
          label: "吴剑锋"
        },
        {
          value: "3",
          label: "吴剑锋"
        }
      ],
      //
      tempVlaueList: [],

      // checkbox Data
      symptomOptions: [
        { id: "1", content: "无症状" },
        { id: "2", content: "头痛" },
        { id: "3", content: "头晕" },
        { id: "4", content: "心悸" },
        { id: "5", content: "胸闷" },
        { id: "6", content: "胸痛" },
        { id: "7", content: "慢性咳嗽" },
        { id: "8", content: "咳痰" },
        { id: "9", content: "呼吸困难" },
        { id: "10", content: "多饮" },
        { id: "11", content: "多尿" },
        { id: "12", content: "体重下降" },
        { id: "13", content: "乏力" },
        { id: "14", content: "关节肿痛" },
        {
          id: "15",
          content: "视力模糊"
        },
        {
          id: "16",
          content: "手脚麻木"
        },
        {
          id: "17",
          content: "尿急"
        },
        {
          id: "18",
          content: "尿痛"
        },
        {
          id: "19",
          content: "便秘"
        },
        {
          id: "20",
          content: "腹泻"
        },
        {
          id: "21",
          content: "恶心呕吐"
        },
        {
          id: "22",
          content: "眼花"
        },
        {
          id: "23",
          content: "耳鸣"
        },
        {
          id: "24",
          content: "乳房胀痛"
        },
        {
          id: "25",
          content: "其他"
        }
      ],
      EatingHabitsOptions: [
        { id: "1", content: "荤素均衡" },
        { id: "2", content: "荤食为主" },
        { id: "3", content: "素食为主" },
        { id: "4", content: "嗜盐" },
        { id: "5", content: "嗜油" },
        { id: "6", content: "嗜糖" }
      ],
      DrinkingTypesOptions: [
        { id: "1", content: "白酒" },
        { id: "2", content: "啤酒" },
        { id: "3", content: "红酒" },
        { id: "4", content: "黄酒" },
        { id: "5", content: "其他" }
      ],
      symptomForm: [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" }
      ],
      EatingHabitsForm: [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" }
      ],
      DrinkingTypesForm: [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" }
      ]
    };
  },
  created() {},
  mounted() {
    // 判断状态信息
    this.init();
  },
  destroy() {
    console.log("销毁");
    this.removeEnterListener();
  },

  methods: {
    init() {
      // 判断查看、编辑 状态
      console.log("this.status", this.status);
      // setTimeout(() => {
      this.initInput();
      // }, 10);
      this.addEnterListener();
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
      console.log("开启键盘监听事件");
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
    childVal(val, key) {
      // console.log("val", val, key);
      this[key] = val;
      // console.log("this[key]", this[key]);
    }
  },
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
.className {
  background: #fff;
  margin: 40px 110px 0 110px;
  .table_form {
    font-size: 14px !important;
    border-collapse: collapse;
    table-layout: fixed;
    word-break: break-all;
    word-wrap: break-word;
    padding: 20px 0;
    /deep/.el-input-group__append {
      height: 30px !important;
      background: #fff;
      // padding: 5px;
      padding: 0 5px;
    }
    /deep/.el-form-item--medium .el-form-item__content {
      height: 30px !important;
      line-height: 30px !important;
      font-size: 14px;
    }
    /deep/.el-input--medium {
      font-size: 14px;
      height: 30px !important;
    }
    /deep/.el-input--medium .el-input__inner {
      height: 30px !important;
      font-size: 14px;
      border-radius: 2px;
    }
    /deep/.el-input--medium .el-input__icon {
      line-height: 30px;
    }
  }
  .table_header {
    .table_title {
      font-size: 20px;
      margin-bottom: 20px;
      font-weight: bold;
      text-align: center;
    }
  }
  .table_main {
    width: 100%;
    height: 100%;
    .rowChildren {
      .el-row {
        border: none;
        border-bottom: 1px solid #000;
        &:last-child {
          border: none;
        }
        /deep/.el-button--primary,
        .el-button--default {
          height: 25px;
          font-size: 13px;
          padding: 4px 8px;
        }
      }
      .el-col {
        min-height: 30px;
        line-height: 30px;
        border-left: 1px solid #000;
        &:first-child {
          border-left: none;
        }
      }
    }
    .el-row {
      min-height: 30px;
      line-height: 30px;
      border-top: 1px solid #000;
      border-right: 1px solid #000;
      border-left: 1px solid #000;
      &:last-child {
        border-bottom: 1px solid #000;
      }
    }
    .el-col {
      min-height: 30px;
      line-height: 30px;
      border-left: 1px solid #000;
      &:first-child {
        border-left: none;
      }
    }
  }
}
.el-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 !important;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
  display: flex;
  flex-direction: column;
}

.el-dialog__body {
  overflow: auto;
}
</style>