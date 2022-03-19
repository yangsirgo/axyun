<template>
  <div class="FollowUpTable">
    <el-form class ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">2型糖尿病患者随访服务记录表</div>
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
      </header>
      <main class="table_main">
        <div class="table_main_list">
          <!-- 第一列 -->
          <el-row class="lh24 w100">
            <el-col :span="24">
              <div class="center">随访日期</div>
            </el-col>
            <el-col :span="24">
              <div class="center">随访方式</div>
            </el-col>
            <el-col :span="24">
              <div class="rowChildren">
                <el-row>
                  <el-col :span="4" class="center">症状</el-col>
                  <el-col :span="20" style="border-top: none;">
                    <div class="center">
                      <div>1-无症状</div>
                      <div>2-多饮</div>
                      <div>3-多食</div>
                      <div>4-多尿</div>
                      <div>5-视力模糊</div>
                      <div>6-感染</div>
                      <div>7-手脚麻木</div>
                      <div>8-下肢浮肿</div>
                      <div>9-体重明显下降</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="rowChildren">
                <el-row>
                  <el-col :span="4" class="center">体征</el-col>
                  <el-col :span="20" style="border-top: none;">
                    <el-col :span="24">
                      <div class="rowChildren">
                        <el-row>
                          <el-col :span="24">
                            <div class="center">血压（mmHg）</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">体重（kg)</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">体质指数（BMI)（kg/m2）</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center lh120">足背动脉搏动</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">其 他</div>
                          </el-col>
                        </el-row>
                      </div>
                    </el-col>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="rowChildren">
                <el-row>
                  <el-col :span="4" class="center">生活方式指导</el-col>
                  <el-col :span="20" style="border-top: none;">
                    <el-col :span="24">
                      <div class="rowChildren">
                        <el-row>
                          <el-col :span="24">
                            <div class="center">日吸烟量（支）</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">日饮酒量（两）</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center lh60">运动</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">主食（克/天）</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">心理调整</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">遵医行为</div>
                          </el-col>
                        </el-row>
                      </div>
                    </el-col>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="rowChildren">
                <el-row>
                  <el-col :span="4" class="center">辅助检查</el-col>
                  <el-col :span="20" style="border-top: none;">
                    <el-col :span="24">
                      <div class="rowChildren">
                        <el-row>
                          <el-col :span="24">
                            <div class="center">空腹血糖值</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center lh89">其他检查*</div>
                          </el-col>
                        </el-row>
                      </div>
                    </el-col>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="center lh60">服药依从性</div>
            </el-col>
            <el-col :span="24">
              <div class="center">药物不良反应</div>
            </el-col>
            <el-col :span="24">
              <div class="center">低血糖反应</div>
            </el-col>
            <el-col :span="24">
              <div class="center lh90">此次随访分类</div>
            </el-col>
            <el-col :span="24">
              <div class="rowChildren">
                <el-row>
                  <el-col :span="4" class="center">用药情况</el-col>
                  <el-col :span="20" style="border-top: none;">
                    <el-col :span="24">
                      <div class="rowChildren">
                        <el-row>
                          <el-col :span="24">
                            <div class="center">药物名称1</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">用法用量</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">药物名称2</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">用法用量</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">药物名称3</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">用法用量</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center h70">胰岛素</div>
                          </el-col>
                        </el-row>
                      </div>
                    </el-col>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="rowChildren">
                <el-row>
                  <el-col :span="4" class="center">转诊</el-col>
                  <el-col :span="20" style="border-top: none;">
                    <el-col :span="24">
                      <div class="rowChildren">
                        <el-row>
                          <el-col :span="24">
                            <div class="center">原因</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">机构及科别</div>
                          </el-col>
                        </el-row>
                      </div>
                    </el-col>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="center">下次随访日期</div>
            </el-col>
            <el-col :span="24">
              <div class="center">随访医生签名</div>
            </el-col>
          </el-row>
          <!-- 第二列 -->
          <el-row class="w100">
            <el-col :span="24">
              <!-- 第一列随访日期 -->
              <el-form-item>
                <el-input
                  @change="DateConversion"
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.follow_up_date"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-门诊</div>
                  <div>2-家庭</div>
                  <div>3-电话</div>
                </div>
                <PFormInput class="mr-10">
                  <!-- 第一列随访方式 -->
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.follow_up_type"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="h161">
                <div class="flex_c flex_wrap">
                  <div v-for="(v,i) in chObject.symptom" :key="i">
                    <PFormInput class="mr-10">
                      <!-- 第一列症状 -->
                      <el-input
                        @input="inputTest(i,'symptom',$event)"
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="v.value"
                      ></el-input>
                    </PFormInput>
                  </div>
                </div>
                <div>
                  其他：
                  <el-input
                    resize="none"
                    type="textarea"
                    :rows="8"
                    v-model="TableForm.symptom_other"
                  ></el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <!-- 第一列体征血压（mmHg） -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.blood_pressure"></el-input>
              </el-form-item>
            </el-col>
            <!-- 体征体重（kg) -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.weight_1"></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.weight_2"></el-input>
              </el-form-item>
            </el-col>
            <!-- 体征体质指数（BMI)（kg/m2） -->
            <el-col :span="24" class="flex_c lh61">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.BMI_1"></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.BMI_2"></el-input>
              </el-form-item>
            </el-col>
            <!-- 足背动脉搏动 -->
            <el-col :span="24">
              <div>
                <div class="flex_c flex_wrap">
                  <div>1-触及正常</div>
                  <div>2-减弱（双侧 左侧 右侧）</div>
                  <div>3-消失（双侧 左侧 右侧）</div>
                </div>
                <PFormInput class="mr-10 fr">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.pulsation_foot_dorsal_artery"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 体征其他 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.physical_sign_other"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 日吸烟量（支） -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.smoking_amount_1"
                ></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.smoking_amount_2"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 日饮酒量（两） -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.drinking_amount_1"
                ></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.drinking_amount_2"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 运动 -->
            <el-col :span="24" class="flex_c flex_wrap sportInput">
              <el-form-item class="w78">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.sport_week_1">
                  <template slot="append">次/周</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item class="w78">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.sport_minute_1">
                  <template slot="append">次/分钟</template>
                </el-input>
              </el-form-item>
              <el-form-item class="w78">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.sport_week_2">
                  <template slot="append">次/周</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item class="w78">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.sport_minute_2">
                  <template slot="append">次/分钟</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 主食（克/天）  -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.main_food_1"></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.main_food_2"></el-input>
              </el-form-item>
            </el-col>
            <!-- 心理调整 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-良好</div>
                  <div>2-一般</div>
                  <div>3-差</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.psychological_recovery"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 遵医行为 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-良好</div>
                  <div>2-一般</div>
                  <div>3-差</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.compliance_behavior"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 空腹血糖值 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.blood_GLU">
                  <template slot="append">mmol/L</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 其他检查* -->
            <el-col :span="24" class="lh90">
              <div class="flex_c pt-5">
                <span>糖化血红蛋白</span>
                <el-form-item>
                  <el-input
                    class="w70"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.HbAlc"
                  >
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="flex_c pt-5">
                <span>检查日期：</span>
                <el-form-item>
                  <el-input
                    class="mw90"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.check_date"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <!-- 服药依从性  -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_c flex_wrap">
                  <div>1-规律</div>
                  <div>2-间断</div>
                  <div>3-不服药</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.compliance"></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 药物不良反应 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-无</div>
                  <div>2-有</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.ADR"></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 低血糖反应  -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-无</div>
                  <div>2-偶尔</div>
                  <div>2-频繁</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.reactive_hypoglycemia"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 此次随访分类 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs flex_wrap">
                  <div>1-控制满意</div>
                  <div>2-控制不满意</div>
                  <div>3-不良反应</div>
                  <div>4-并发症</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.follow_up_classify"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 药物名称1 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.order_name_1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 用法1 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_1">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 用量1 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_1">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 药物名称2 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.order_name_2"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 用法2 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_2">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 用量2 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_2">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 药物名称3 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.order_name_3"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 用法3 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_3">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 用量3 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_3">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 胰岛素 -->
            <el-col :span="24">
              <div class="flex_c pt-5">
                <span>种类：</span>
                <el-form-item>
                  <el-input
                    class="w70"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.insulin_type"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="flex_c pt-5">
                <span>用法和用量：</span>
                <el-form-item>
                  <el-input
                    class="w70"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.insulin_route_medi_qty"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <!-- 转诊原因 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.referral_reason"></el-input>
              </el-form-item>
            </el-col>
            <!-- 转诊机构及科别 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.referral_hospital_name"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 下次随访日期 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.next_follow_up_date"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 随访医生签名 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.follow_up_doctor"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第三列 -->
          <el-row class="w100">
            <el-col :span="24">
              <!-- 第一列随访日期 -->
              <el-form-item>
                <el-input
                  @change="DateConversion"
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_follow_up_date"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-门诊</div>
                  <div>2-家庭</div>
                  <div>3-电话</div>
                </div>
                <PFormInput class="mr-10">
                  <!-- 第一列随访方式 -->
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.b_follow_up_type"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="h161">
                <div class="flex_c flex_wrap">
                  <div v-for="(v,i) in chObject.b_symptom" :key="i">
                    <PFormInput class="mr-10">
                      <!-- 第一列症状 -->
                      <el-input
                        @input="inputTest(i,'b_symptom',$event)"
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="v.value"
                      ></el-input>
                    </PFormInput>
                  </div>
                </div>
                <div>
                  其他：
                  <el-input
                    resize="none"
                    type="textarea"
                    :rows="8"
                    v-model="TableForm.b_symptom_other"
                  ></el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <!-- 第一列体征血压（mmHg） -->
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_blood_pressure"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 体征体重（kg) -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_weight_1"></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_weight_2"></el-input>
              </el-form-item>
            </el-col>
            <!-- 体征体质指数（BMI)（kg/m2） -->
            <el-col :span="24" class="flex_c lh61">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_BMI_1"></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_BMI_2"></el-input>
              </el-form-item>
            </el-col>
            <!-- 足背动脉搏动 -->
            <el-col :span="24">
              <div>
                <div class="flex_c flex_wrap">
                  <div>1-触及正常</div>
                  <div>2-减弱（双侧 左侧 右侧）</div>
                  <div>3-消失（双侧 左侧 右侧）</div>
                </div>
                <PFormInput class="mr-10 fr">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.b_pulsation_foot_dorsal_artery"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 体征其他 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_physical_sign_other"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 日吸烟量（支） -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_smoking_amount_1"
                ></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_smoking_amount_2"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 日饮酒量（两） -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_drinking_amount_1"
                ></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_drinking_amount_2"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 运动 -->
            <el-col :span="24" class="flex_c flex_wrap sportInput">
              <el-form-item class="w78">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_sport_week_1">
                  <template slot="append">次/周</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item class="w78">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_sport_minute_1"
                >
                  <template slot="append">次/分钟</template>
                </el-input>
              </el-form-item>
              <el-form-item class="w78">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_sport_week_2">
                  <template slot="append">次/周</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item class="w78">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_sport_minute_2"
                >
                  <template slot="append">次/分钟</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 主食（克/天）  -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_main_food_1"></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_main_food_2"></el-input>
              </el-form-item>
            </el-col>
            <!-- 心理调整 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-良好</div>
                  <div>2-一般</div>
                  <div>3-差</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.b_psychological_recovery"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 遵医行为 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-良好</div>
                  <div>2-一般</div>
                  <div>3-差</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.b_compliance_behavior"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 空腹血糖值 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_blood_GLU">
                  <template slot="append">mmol/L</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 其他检查* -->
            <el-col :span="24" class="lh90">
              <div class="flex_c pt-5">
                <span>糖化血红蛋白</span>
                <el-form-item>
                  <el-input
                    class="w70"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.b_HbAlc"
                  >
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="flex_c pt-5">
                <span>检查日期：</span>
                <el-form-item>
                  <el-input
                    class="mw90"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.b_check_date"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <!-- 服药依从性  -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_c flex_wrap">
                  <div>1-规律</div>
                  <div>2-间断</div>
                  <div>3-不服药</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_compliance"></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 药物不良反应 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-无</div>
                  <div>2-有</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_ADR"></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 低血糖反应  -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-无</div>
                  <div>2-偶尔</div>
                  <div>2-频繁</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.b_reactive_hypoglycemia"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 此次随访分类 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs flex_wrap">
                  <div>1-控制满意</div>
                  <div>2-控制不满意</div>
                  <div>3-不良反应</div>
                  <div>4-并发症</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.b_follow_up_classify"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 药物名称1 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_order_name_1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 用法1 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_route_1">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 用量1 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_medi_qty_1">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 药物名称2 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_order_name_2"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 用法2 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_route_2">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 用量2 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_medi_qty_2">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 药物名称3 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_order_name_3"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 用法3 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_route_3">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 用量3 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.b_medi_qty_3">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 胰岛素 -->
            <el-col :span="24">
              <div class="flex_c pt-5">
                <span>种类：</span>
                <el-form-item>
                  <el-input
                    class="w70"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.b_insulin_type"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="flex_c pt-5">
                <span>用法和用量：</span>
                <el-form-item>
                  <el-input
                    class="w70"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.b_insulin_route_medi_qty"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <!-- 转诊原因 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_referral_reason"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 转诊机构及科别 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_referral_hospital_name"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 下次随访日期 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_next_follow_up_date"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 随访医生签名 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.b_follow_up_doctor"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第四列 -->
          <el-row class="w100">
            <el-col :span="24">
              <!-- 第一列随访日期 -->
              <el-form-item>
                <el-input
                  @change="DateConversion"
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_follow_up_date"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-门诊</div>
                  <div>2-家庭</div>
                  <div>3-电话</div>
                </div>
                <PFormInput class="mr-10">
                  <!-- 第一列随访方式 -->
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.c_follow_up_type"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="h161">
                <div class="flex_c flex_wrap">
                  <div v-for="(v,i) in chObject.c_symptom" :key="i">
                    <PFormInput class="mr-10">
                      <!-- 第一列症状 -->
                      <el-input
                        @input="inputTest(i,'c_symptom',$event)"
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="v.value"
                      ></el-input>
                    </PFormInput>
                  </div>
                </div>
                <div>
                  其他：
                  <el-input
                    resize="none"
                    type="textarea"
                    :rows="8"
                    v-model="TableForm.c_symptom_other"
                  ></el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <!-- 第一列体征血压（mmHg） -->
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_blood_pressure"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 体征体重（kg) -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_weight_1"></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_weight_2"></el-input>
              </el-form-item>
            </el-col>
            <!-- 体征体质指数（BMI)（kg/m2） -->
            <el-col :span="24" class="flex_c lh61">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_BMI_1"></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_BMI_2"></el-input>
              </el-form-item>
            </el-col>
            <!-- 足背动脉搏动 -->
            <el-col :span="24">
              <div>
                <div class="flex_c flex_wrap">
                  <div>1-触及正常</div>
                  <div>2-减弱（双侧 左侧 右侧）</div>
                  <div>3-消失（双侧 左侧 右侧）</div>
                </div>
                <PFormInput class="mr-10 fr">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.c_pulsation_foot_dorsal_artery"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 体征其他 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_physical_sign_other"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 日吸烟量（支） -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_smoking_amount_1"
                ></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_smoking_amount_2"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 日饮酒量（两） -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_drinking_amount_1"
                ></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_drinking_amount_2"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 运动 -->
            <el-col :span="24" class="flex_c flex_wrap sportInput">
              <el-form-item class="w78">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_sport_week_1">
                  <template slot="append">次/周</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item class="w78">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_sport_minute_1"
                >
                  <template slot="append">次/分钟</template>
                </el-input>
              </el-form-item>
              <el-form-item class="w78">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_sport_week_2">
                  <template slot="append">次/周</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item class="w78">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_sport_minute_2"
                >
                  <template slot="append">次/分钟</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 主食（克/天）  -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_main_food_1"></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_main_food_2"></el-input>
              </el-form-item>
            </el-col>
            <!-- 心理调整 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-良好</div>
                  <div>2-一般</div>
                  <div>3-差</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.c_psychological_recovery"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 遵医行为 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-良好</div>
                  <div>2-一般</div>
                  <div>3-差</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.c_compliance_behavior"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 空腹血糖值 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_blood_GLU">
                  <template slot="append">mmol/L</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 其他检查* -->
            <el-col :span="24" class="lh90">
              <div class="flex_c pt-5">
                <span>糖化血红蛋白</span>
                <el-form-item>
                  <el-input
                    class="w70"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.c_HbAlc"
                  >
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="flex_c pt-5">
                <span>检查日期：</span>
                <el-form-item>
                  <el-input
                    class="mw90"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.c_check_date"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <!-- 服药依从性  -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_c flex_wrap">
                  <div>1-规律</div>
                  <div>2-间断</div>
                  <div>3-不服药</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_compliance"></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 药物不良反应 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-无</div>
                  <div>2-有</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_ADR"></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 低血糖反应  -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-无</div>
                  <div>2-偶尔</div>
                  <div>2-频繁</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.c_reactive_hypoglycemia"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 此次随访分类 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs flex_wrap">
                  <div>1-控制满意</div>
                  <div>2-控制不满意</div>
                  <div>3-不良反应</div>
                  <div>4-并发症</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.c_follow_up_classify"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 药物名称1 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_order_name_1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 用法1 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_route_1">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 用量1 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_medi_qty_1">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 药物名称2 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_order_name_2"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 用法2 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_route_2">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 用量2 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_medi_qty_2">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 药物名称3 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_order_name_3"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 用法3 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_route_3">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 用量3 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.c_medi_qty_3">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 胰岛素 -->
            <el-col :span="24">
              <div class="flex_c pt-5">
                <span>种类：</span>
                <el-form-item>
                  <el-input
                    class="w70"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.c_insulin_type"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="flex_c pt-5">
                <span>用法和用量：</span>
                <el-form-item>
                  <el-input
                    class="w70"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.c_insulin_route_medi_qty"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <!-- 转诊原因 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_referral_reason"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 转诊机构及科别 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_referral_hospital_name"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 下次随访日期 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_next_follow_up_date"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 随访医生签名 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.c_follow_up_doctor"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第五列 -->
          <el-row class="w100">
            <el-col :span="24">
              <!-- 第一列随访日期 -->
              <el-form-item>
                <el-input
                  @change="DateConversion"
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_follow_up_date"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-门诊</div>
                  <div>2-家庭</div>
                  <div>3-电话</div>
                </div>
                <PFormInput class="mr-10">
                  <!-- 第一列随访方式 -->
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.d_follow_up_type"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="h161">
                <div class="flex_c flex_wrap">
                  <div v-for="(v,i) in chObject.d_symptom" :key="i">
                    <PFormInput class="mr-10">
                      <!-- 第一列症状 -->
                      <el-input
                        @input="inputTest(i,'d_symptom',$event)"
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="v.value"
                      ></el-input>
                    </PFormInput>
                  </div>
                </div>
                <div>
                  其他：
                  <el-input
                    resize="none"
                    type="textarea"
                    :rows="8"
                    v-model="TableForm.d_symptom_other"
                  ></el-input>
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <!-- 第一列体征血压（mmHg） -->
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_blood_pressure"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 体征体重（kg) -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_weight_1"></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_weight_2"></el-input>
              </el-form-item>
            </el-col>
            <!-- 体征体质指数（BMI)（kg/m2） -->
            <el-col :span="24" class="flex_c lh61">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_BMI_1"></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_BMI_2"></el-input>
              </el-form-item>
            </el-col>
            <!-- 足背动脉搏动 -->
            <el-col :span="24">
              <div>
                <div class="flex_c flex_wrap">
                  <div>1-触及正常</div>
                  <div>2-减弱（双侧 左侧 右侧）</div>
                  <div>3-消失（双侧 左侧 右侧）</div>
                </div>
                <PFormInput class="mr-10 fr">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.d_pulsation_foot_dorsal_artery"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 体征其他 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_physical_sign_other"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 日吸烟量（支） -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_smoking_amount_1"
                ></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_smoking_amount_2"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 日饮酒量（两） -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_drinking_amount_1"
                ></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_drinking_amount_2"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 运动 -->
            <el-col :span="24" class="flex_c flex_wrap sportInput">
              <el-form-item class="w78">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_sport_week_1">
                  <template slot="append">次/周</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item class="w78">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_sport_minute_1"
                >
                  <template slot="append">次/分钟</template>
                </el-input>
              </el-form-item>
              <el-form-item class="w78">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_sport_week_2">
                  <template slot="append">次/周</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item class="w78">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_sport_minute_2"
                >
                  <template slot="append">次/分钟</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 主食（克/天）  -->
            <el-col :span="24" class="flex_c">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_main_food_1"></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_main_food_2"></el-input>
              </el-form-item>
            </el-col>
            <!-- 心理调整 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-良好</div>
                  <div>2-一般</div>
                  <div>3-差</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.d_psychological_recovery"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 遵医行为 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-良好</div>
                  <div>2-一般</div>
                  <div>3-差</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.d_compliance_behavior"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 空腹血糖值 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_blood_GLU">
                  <template slot="append">mmol/L</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 其他检查* -->
            <el-col :span="24" class="lh90">
              <div class="flex_c pt-5">
                <span>糖化血红蛋白</span>
                <el-form-item>
                  <el-input
                    class="w70"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.d_HbAlc"
                  >
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="flex_c pt-5">
                <span>检查日期：</span>
                <el-form-item>
                  <el-input
                    class="mw90"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.d_check_date"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <!-- 服药依从性  -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_c flex_wrap">
                  <div>1-规律</div>
                  <div>2-间断</div>
                  <div>3-不服药</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_compliance"></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 药物不良反应 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-无</div>
                  <div>2-有</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_ADR"></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 低血糖反应  -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs">
                  <div>1-无</div>
                  <div>2-偶尔</div>
                  <div>2-频繁</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.d_reactive_hypoglycemia"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 此次随访分类 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_cs flex_wrap">
                  <div>1-控制满意</div>
                  <div>2-控制不满意</div>
                  <div>3-不良反应</div>
                  <div>4-并发症</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.d_follow_up_classify"
                  ></el-input>
                </PFormInput>
              </div>
            </el-col>
            <!-- 药物名称1 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_order_name_1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 用法1 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_route_1">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 用量1 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_medi_qty_1">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 药物名称2 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_order_name_2"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 用法2 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_route_2">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 用量2 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_medi_qty_2">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 药物名称3 -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_order_name_3"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 用法3 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_route_3">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 用量3 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.d_medi_qty_3">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 胰岛素 -->
            <el-col :span="24">
              <div class="flex_c pt-5">
                <span>种类：</span>
                <el-form-item>
                  <el-input
                    class="w70"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.d_insulin_type"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="flex_c pt-5">
                <span>用法和用量：</span>
                <el-form-item>
                  <el-input
                    class="w70"
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.d_insulin_route_medi_qty"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <!-- 转诊原因 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_referral_reason"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 转诊机构及科别 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_referral_hospital_name"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 下次随访日期 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_next_follow_up_date"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 随访医生签名 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.d_follow_up_doctor"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </main>
    </el-form>
  </div>
</template>

<script>
import { dateConversion } from "@/utils/common";
export default {
  name: "HealthChecklistPage1",
  components: {},
  props: {},
  data() {
    return {
      // 是否只读
      readonly: false,
      // input最大个数
      maxLength: 0,
      // 状态 新增 查看 编辑  view edit
      status: this.$store.state.table.tableConfiguration.status,
      // 表单数据
      TableForm: {
        follow_up_date: "", //第一列随访日期
        follow_up_type: "", //第一列随访方式
        symptom: "", //第一列症状
        symptom_other: "", //第一列症状其他
        blood_pressure: "", //第一列体征血压（mmHg）
        weight_1: "", //第一列体征体重（kg）
        weight_2: "", //第一列体征体重（kg）
        BMI_1: "", //第一列体征体质指数（kg/m2）
        BMI_2: "", //第一列体征体质指数（kg/m2）
        pulsation_foot_dorsal_artery: "", //第一列体征足背动脉搏动
        physical_sign_other: "", //第一列体征其他
        smoking_amount_1: "", //第一列日吸烟量
        smoking_amount_2: "", //第一列日吸烟量
        drinking_amount_1: "", //第一列日饮酒量
        drinking_amount_2: "", //第一列日饮酒量
        sport_week_1: "", //第一列1运动次/周
        sport_minute_1: "", //第一列1运动分钟/次
        sport_week_2: "", //第一列2运动次/周
        sport_minute_2: "", //第一列2运动分钟/次
        main_food_1: "", //第一列主食（克/天）
        main_food_2: "", //第一列主食（克/天）
        psychological_recovery: "", //第一列心理调整
        compliance_behavior: "", //第一列遵医行为
        blood_GLU: "", //第一列空腹血糖值
        HbAlc: "", //第一列其他检查糖化血红蛋白％
        check_date: "", //第一列其他检查检查日期：月日
        compliance: "", //第一列服药依从性
        ADR: "", //第一列药物不良反应
        reactive_hypoglycemia: "", //第一列低血糖反应
        follow_up_classify: "", //第一列此次随访分类
        order_name_1: "", //第一列药物名称1
        route_1: "", //第一列用法1
        medi_qty_1: "", //第一列用量1
        order_name_2: "", //第一列药物名称2
        route_2: "", //第一列用法2
        medi_qty_2: "", //第一列用量2
        order_name_3: "", //第一列药物名称3
        route_3: "", //第一列用法3
        medi_qty_3: "", //第一列用量3
        insulin_type: "", //第一列胰岛素种类
        insulin_route_medi_qty: "", //第一列胰岛素用法和用量
        referral_reason: "", //第一列转诊原因
        referral_hospital_name: "", //第一列转诊机构及科别
        next_follow_up_date: "", //第一列下次随访日期
        follow_up_doctor: "" //第一列随访医生签名
      },
      // --- checkbox Data ---
      chObject: {
        symptom: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ]
      }
    };
  },
  created() {
    this.EchoMethod();
  },
  mounted() {
    this.init();
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
    initInput() {
      let val = document.getElementsByClassName("el-input--medium");
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
      this[key] = val;
      console.log("key", this[key]);
    },
    otherVal(val, key) {
      this.TableForm[key] = val;
      console.log("key", this.TableForm[key]);
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
      console.log(
        "tableConfiguration**************",
        this.$store.state.table.tableConfiguration
      );
      console.log("this.status", this.status);
      if (this.status == "edit" || this.status == "view") {
        let tableConfiguration = this.$store.state.table.tableConfiguration;
        for (let obj in this.TableForm) {
          this.TableForm[obj] = tableConfiguration.editData[obj];
        }
        let editChObject = JSON.parse(tableConfiguration.editChObject);
        console.log("tableConfiguration.editChObject", editChObject);
        for (let obj in this.chObject) {
          this.chObject[obj] = editChObject[obj];
        }
        console.log("this.TableForm", this.TableForm);
        console.log("this.chObject", this.chObject);
      }
    }
  },
  watch: {},
  computed: {}
};
</script>
<style lang="scss" scoped>
.FollowUpTable {
  background: #fff;
  .table_header {
    .table_title {
      font-size: 20px;
      margin-bottom: 20px;
      font-weight: bold;
      text-align: center;
    }
  }
  .table_main_list {
    display: flex;
    .sportInput {
      /deep/ .el-input__inner {
        padding: 0;
      }
    }
    .rowChildren {
      /deep/.el-row {
        border: none;
        // border-bottom: 1px solid #000;

        &:last-child {
          border: none;
        }

        /deep/.el-button--primary,
        .el-button--default {
          font-size: 14px;
          font-size: 13px;
          padding: 4px 8px;
        }
      }
      /deep/.el-col {
        min-height: 30px;
        line-height: 30px;
        border-left: 1px solid #000;

        &:first-child {
          border-left: none;
        }
      }
    }

    /deep/.el-input-group__append {
      height: 30px !important;
      background: #fff;
      // padding: 5px;
      padding: 0 5px;
    }

    /deep/.el-form-item__label {
      height: 30px !important;
      line-height: 30px !important;
    }

    // /deep/label {
    //   font-weight: 500;
    // }

    /deep/.el-form-item--medium .el-form-item__content {
      height: 30px !important;
      line-height: 30px !important;
      font-size: 14px;
    }

    /deep/.el-input--medium {
      height: 30px !important;
      font-size: 14px;
    }

    /deep/.el-input--medium .el-input__inner {
      height: 30px !important;
      font-size: 14px;
      border-radius: 2px;
    }

    /deep/.el-input--medium .el-input__icon {
      line-height: 30px;
    }
    /deep/.el-row {
      min-height: 30px;
      line-height: 30px;
      border-top: 1px solid #000;
      // border-right: 1px solid #000;
      border-left: 1px solid #000;
      border-bottom: 1px solid #000;

      &:last-child {
        // border-bottom: 1px solid #000;
        border-right: 1px solid #000;
      }
    }

    /deep/.el-col {
      min-height: 30px;
      line-height: 30px;
      border-top: 1px solid #000;
      // border-left: 1px solid #000;

      &:first-child {
        border-top: none;
      }
    }
  }
}
</style>