<template>
  <div class="FollowUpTable">
    <el-form class ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">高血压患者随访服务记录表</div>
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
                      <div>2-头痛头晕</div>
                      <div>3-恶心呕吐</div>
                      <div>4-眼花耳鸣</div>
                      <div>5-呼吸困难</div>
                      <div>6-心悸胸闷</div>
                      <div>7-鼻衄出血不止</div>
                      <div>8-四肢发麻</div>
                      <div>9-下肢水肿</div>
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
                            <div class="center">心率（次/分钟 ）</div>
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
                            <div class="center">摄盐情况（咸淡）(轻/中/重)</div>
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
              <div class="center">辅助检查*</div>
            </el-col>
            <el-col :span="24">
              <div class="center lh60">服药依从性</div>
            </el-col>
            <el-col :span="24">
              <div class="center">药物不良反应</div>
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
                            <div class="center">其他药物</div>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="24" style="border-top: 1px solid #000;">
                            <div class="center">用法用量</div>
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
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.blood_pressure"
                ></el-input>
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
            <!-- 体征心率（次/分钟 ） -->
            <el-col :span="24">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.heart_rate"></el-input>
              </el-form-item>
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
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.sport_week_1"
                >
                  <template slot="append">次/周</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item class="w78">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.sport_minute_1"
                >
                  <template slot="append">次/分钟</template>
                </el-input>
              </el-form-item>
              <el-form-item class="w78">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.sport_week_2"
                >
                  <template slot="append">次/周</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item class="w78">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.sport_minute_2"
                >
                  <template slot="append">次/分钟</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 摄盐情况（咸淡） -->
            <el-col :span="24" class="flex_c lh61">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.salt_intake_1"
                ></el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.salt_intake_2"
                ></el-input>
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
            <!-- 辅助检查 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.assistant_examination"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 服药依从性 -->
            <el-col :span="24">
              <div class="flex_cs">
                <div class="flex_c flex_wrap">
                  <div>1-规律</div>
                  <div>2-间断</div>
                  <div>3-不服药</div>
                </div>
                <PFormInput class="mr-10">
                  <el-input
                    v-if="!readonly"
                    :readonly="readonly"
                    v-model="TableForm.compliance"
                  ></el-input>
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
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.order_name_1"
                ></el-input>
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
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.order_name_2"
                ></el-input>
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
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.order_name_3"
                ></el-input>
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
            <!-- 其他药物 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.order_name_4"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="flex_c sportInput">
              <el-form-item>
                <!-- 其他药物用法 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_4">
                  <template slot="append">每日次</template>
                </el-input>
              </el-form-item>
              <span>/</span>
              <el-form-item>
                <!-- 其他药物用量 -->
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_4">
                  <template slot="append">每次</template>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 转诊原因 -->
            <el-col :span="24">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.referral_reason"
                ></el-input>
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
        weight_1: "", //第一列体征体重（kg)
        weight_2: "", //第一列体征体重（kg)
        BMI_1: "", //第一列体征体质指数（BMI)（kg/m2）
        BMI_2: "", //第一列体征体质指数（BMI)（kg/m2）
        heart_rate: "", //第一列体征心率（次/分钟 ）
        physical_sign_other: "", //第一列体征其他
        smoking_amount_1: "", //第一列日吸烟量（支）
        smoking_amount_2: "", //第一列日吸烟量（支）
        drinking_amount_1: "", //第一列日饮酒量（两）
        drinking_amount_2: "", //第一列日饮酒量（两）
        sport_week_1: "", //第一列运动 次/周
        sport_minute_1: "", //第一列运动 分钟/次
        sport_week_2: "", //第一列运动 次/周
        sport_minute_2: "", //第一列运动 分钟/次
        salt_intake_1: "", //第一列摄盐情况（咸淡）
        salt_intake_2: "", //第一列摄盐情况（咸淡）
        psychological_recovery: "", //第一列心理调整
        compliance_behavior: "", //第一列遵医行为
        assistant_examination: "", //第一列辅助检查
        compliance: "", //第一列服药依从性
        ADR: "", //第一列药物不良反应
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
        order_name_4: "", //第一列其他药物
        route_4: "", //第一列其他药物用法
        medi_qty_4: "", //第一列其他药物用量
        referral_reason: "", //第一列转诊原因
        referral_hospital_name: "", //第一列转诊机构及科别
        next_follow_up_date: "", //第一列下次随访日期
        follow_up_doctor: "", //第一列随访医生签名
        two_follow_up_date: "", //第二列随访日期
        two_follow_up_type: "", //第二列随访方式
        two_symptom: "", //第二列症状
        two_symptom_other: "", //第二列症状其他
        two_blood_pressure: "", //第二列体征血压（mmHg）
        two_weight_1: "", //第二列体征体重（kg)
        two_weight_2: "", //第二列体征体重（kg)
        two_BMI_1: "", //第二列体征体质指数（BMI)（kg/m2）
        two_BMI_2: "", //第二列体征体质指数（BMI)（kg/m2）
        two_heart_rate: "", //第二列体征心率（次/分钟 ）
        two_physical_sign_other: "", //第二列体征其他
        two_smoking_amount_1: "", //第二列日吸烟量（支）
        two_smoking_amount_2: "", //第二列日吸烟量（支）
        two_drinking_amount_1: "", //第二列日饮酒量（两）
        two_drinking_amount_2: "", //第二列日饮酒量（两）
        two_sport_week_1: "", //第二列运动 次/周
        two_sport_minute_1: "", //第二列运动 分钟/次
        two_sport_week_2: "", //第二列运动 次/周
        two_sport_minute_2: "", //第二列运动 分钟/次
        two_salt_intake_1: "", //第二列摄盐情况（咸淡）
        two_salt_intake_2: "", //第二列摄盐情况（咸淡）
        two_psychological_recovery: "", //第二列心理调整
        two_compliance_behavior: "", //第二列遵医行为
        two_assistant_examination: "", //第二列辅助检查
        two_compliance: "", //第二列服药依从性
        two_ADR: "", //第二列药物不良反应
        two_follow_up_classify: "", //第二列此次随访分类
        two_order_name_1: "", //第二列药物名称1
        two_route_1: "", //第二列用法1
        two_medi_qty_1: "", //第二列用量1
        two_order_name_2: "", //第二列药物名称2
        two_route_2: "", //第二列用法2
        two_medi_qty_2: "", //第二列用量2
        two_order_name_3: "", //第二列药物名称3
        two_route_3: "", //第二列用法3
        two_medi_qty_3: "", //第二列用量3
        two_order_name_4: "", //第二列其他药物
        two_route_4: "", //第二列其他药物用法
        two_medi_qty_4: "", //第二列其他药物用量
        two_referral_reason: "", //第二列转诊原因
        two_referral_hospital_name: "", //第二列转诊机构及科别
        two_next_follow_up_date: "", //第二列下次随访日期
        two_follow_up_doctor: "", //第二列随访医生签名
        three_follow_up_date: "", //第三列随访日期
        three_follow_up_type: "", //第三列随访方式
        three_symptom: "", //第三列症状
        three_symptom_other: "", //第三列症状其他
        three_blood_pressure: "", //第三列体征血压（mmHg）
        three_weight_1: "", //第三列体征体重（kg)
        three_weight_2: "", //第三列体征体重（kg)
        three_BMI_1: "", //第三列体征体质指数（BMI)（kg/m2）
        three_BMI_2: "", //第三列体征体质指数（BMI)（kg/m2）
        three_heart_rate: "", //第三列体征心率（次/分钟 ）
        three_physical_sign_other: "", //第三列体征其他
        three_smoking_amount_1: "", //第三列日吸烟量（支）
        three_smoking_amount_2: "", //第三列日吸烟量（支）
        three_drinking_amount_1: "", //第三列日饮酒量（两）
        three_drinking_amount_2: "", //第三列日饮酒量（两）
        three_sport_week_1: "", //第三列运动 次/周
        three_sport_minute_1: "", //第三列运动 分钟/次
        three_sport_week_2: "", //第三列运动 次/周
        three_sport_minute_2: "", //第三列运动 分钟/次
        three_salt_intake_1: "", //第三列摄盐情况（咸淡）
        three_salt_intake_2: "", //第三列摄盐情况（咸淡）
        three_psychological_recovery: "", //第三列心理调整
        three_compliance_behavior: "", //第三列遵医行为
        three_assistant_examination: "", //第三列辅助检查
        three_compliance: "", //第三列服药依从性
        three_ADR: "", //第三列药物不良反应
        three_follow_up_classify: "", //第三列此次随访分类
        three_order_name_1: "", //第三列药物名称1
        three_route_1: "", //第三列用法1
        three_medi_qty_1: "", //第三列用量1
        three_order_name_2: "", //第三列药物名称2
        three_route_2: "", //第三列用法2
        three_medi_qty_2: "", //第三列用量2
        three_order_name_3: "", //第三列药物名称3
        three_route_3: "", //第三列用法3
        three_medi_qty_3: "", //第三列用量3
        three_order_name_4: "", //第三列其他药物
        three_route_4: "", //第三列其他药物用法
        three_medi_qty_4: "", //第三列其他药物用量
        three_referral_reason: "", //第三列转诊原因
        three_referral_hospital_name: "", //第三列转诊机构及科别
        three_next_follow_up_date: "", //第三列下次随访日期
        three_follow_up_doctor: "", //第三列随访医生签名
        four_follow_up_date: "", //第四列随访日期
        four_follow_up_type: "", //第四列随访方式
        four_symptom: "", //第四列症状
        four_symptom_other: "", //第四列症状其他
        four_blood_pressure: "", //第四列体征血压（mmHg）
        four_weight_1: "", //第四列体征体重（kg)
        four_weight_2: "", //第四列体征体重（kg)
        four_BMI_1: "", //第四列体征体质指数（BMI)（kg/m2）
        four_BMI_2: "", //第四列体征体质指数（BMI)（kg/m2）
        four_heart_rate: "", //第四列体征心率（次/分钟 ）
        four_physical_sign_other: "", //第四列体征其他
        four_smoking_amount_1: "", //第四列日吸烟量（支）
        four_smoking_amount_2: "", //第四列日吸烟量（支）
        four_drinking_amount_1: "", //第四列日饮酒量（两）
        four_drinking_amount_2: "", //第四列日饮酒量（两）
        four_sport_week_1: "", //第四列运动 次/周
        four_sport_minute_1: "", //第四列运动 分钟/次
        four_sport_week_2: "", //第四列运动 次/周
        four_sport_minute_2: "", //第四列运动 分钟/次
        four_salt_intake_1: "", //第四列摄盐情况（咸淡）
        four_salt_intake_2: "", //第四列摄盐情况（咸淡）
        four_psychological_recovery: "", //第四列心理调整
        four_compliance_behavior: "", //第四列遵医行为
        four_assistant_examination: "", //第四列辅助检查
        four_compliance: "", //第四列服药依从性
        four_ADR: "", //第四列药物不良反应
        four_follow_up_classify: "", //第四列此次随访分类
        four_order_name_1: "", //第四列药物名称1
        four_route_1: "", //第四列用法1
        four_medi_qty_1: "", //第四列用量1
        four_order_name_2: "", //第四列药物名称2
        four_route_2: "", //第四列用法2
        four_medi_qty_2: "", //第四列用量2
        four_order_name_3: "", //第四列药物名称3
        four_route_3: "", //第四列用法3
        four_medi_qty_3: "", //第四列用量3
        four_order_name_4: "", //第四列其他药物
        four_route_4: "", //第四列其他药物用法
        four_medi_qty_4: "", //第四列其他药物用量
        four_referral_reason: "", //第四列转诊原因
        four_referral_hospital_name: "", //第四列转诊机构及科别
        four_next_follow_up_date: "", //第四列下次随访日期
        four_follow_up_doctor: "" //第四列随访医生签名
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
        ],
        two_symptom: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ],
        three_symptom: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ],
        four_symptom: [
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
          // padding: 5px 20px;
          height: 25px;
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

    /deep/ label {
      font-weight: 500;
    }

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
