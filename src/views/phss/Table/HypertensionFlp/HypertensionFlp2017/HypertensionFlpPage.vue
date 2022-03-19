<template>
  <div class="FollowUpTable">
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">高血压患者随访服务记录表</div>
          </el-col>
        </el-row>
        <el-row class="mb-10" type="flex" justify="space-between">
          <el-col :span="12">
            <div>姓名:{{rsdt_name}}</div>
          </el-col>
          <el-col :span="12">
            <div class="fr">编号:{{pap_doc_no}}</div>
          </el-col>
        </el-row>
      </header>
      <main class="table_main">
        <el-row>
          <el-col class="center" :span="4">随访日期*</el-col>
          <el-col :span="20">
            <el-form-item>
              <el-input @change="DateConversion('follow_up_date',$event)" v-if="!readonly" :readonly="readonly" v-model="TableForm.follow_up_date"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="center" :span="4">随访方式*</el-col>
          <el-col :span="20">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.follow_up_type">
                  <el-radio label="1">1-门诊</el-radio>
                  <el-radio label="2">2-家庭</el-radio>
                  <el-radio label="3">3-电话</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.follow_up_type"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center lh187">症状</div>
          </el-col>
          <el-col :span="20">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="24" class="text_left">
                  <PCheckbox class="pl-10" @childValInput="childVal" :readonly="readonly" :formKey="'symptom'"
                    :checkboxOptions="symptomOptions" :checkboxForm="chObject.symptom" :clearFlag="clearFlag"/>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="h85">
                  <div class="text_left">其他：</div>
                  <el-input @input="textareaInput($event,'symptom_other')" resize="none" type="textarea" :rows="2"
                    v-model="TableForm.symptom_other"></el-input>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center lh210">体征</div>
          </el-col>
          <el-col :span="20">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="4">血压（mmHg）</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <!-- 第一列体征血压（mmHg） -->
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.blood_pressure_L"></el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.blood_pressure_H"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">体重(kg)</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.weight_1"></el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.weight_2"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">体质指数（BMI)（kg/m2）</el-col>
                <el-col :span="20" class="text_left flex_c lh61">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.BMI_1"></el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.BMI_2"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">心率（次/分钟 ）</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.heart_rate"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div class="lh55">其他</div>
                </el-col>
                <el-col :span="20">
                  <div class="h55">
                    <el-input @input="textareaInput($event,'physical_sign_other')" resize="none" type="textarea" :rows="2"
                      v-model="TableForm.physical_sign_other"></el-input>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center lh216">生活方式指导</div>
          </el-col>
          <el-col :span="20">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="4">日吸烟量（支）</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.smoking_amount_1"></el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.smoking_amount_2"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">日饮酒量（两）</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.drinking_amount_1"></el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.drinking_amount_2"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">运动</el-col>
                <el-col :span="20" class="text_left flex_c lh61">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.sport_week_1">
                      <template slot="append">次/周</template>
                    </el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.sport_minute_1">
                      <template slot="append">次/分钟</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.sport_week_2">
                      <template slot="append">次/周</template>
                    </el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.sport_minute_2">
                      <template slot="append">次/分钟</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">摄盐情况(咸淡 轻/中/重)</el-col>
                <el-col :span="20" class="text_left flex_c lh60">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.salt_intake_1"></el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.salt_intake_2"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div>心理调整</div>
                </el-col>
                <el-col :span="20" class="text_left flex_cs">
                  <el-radio-group class="ml-10 text_left" v-model="TableForm.psychological_recovery">
                    <el-radio label="1">1-良好</el-radio>
                    <el-radio label="2">2-一般</el-radio>
                    <el-radio label="3">3-差</el-radio>
                  </el-radio-group>
                  <PFormInput class="mr-10">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.psychological_recovery"></el-input>
                  </PFormInput>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div>遵医行为</div>
                </el-col>
                <el-col :span="20" class="text_left flex_cs">
                  <el-radio-group class="ml-10 text_left" v-model="TableForm.compliance_behavior">
                    <el-radio label="1">1-良好</el-radio>
                    <el-radio label="2">2-一般</el-radio>
                    <el-radio label="3">3-差</el-radio>
                  </el-radio-group>
                  <PFormInput class="mr-10">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.compliance_behavior"></el-input>
                  </PFormInput>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center">辅助检查</div>
          </el-col>
          <el-col :span="20" class="text_left flex_cs">
            <el-form-item class="w100">
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.assistant_examination"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center">服药依从性</div>
          </el-col>
          <el-col :span="20" class="text_left flex_cs">
            <el-radio-group class="ml-10 text_left" v-model="TableForm.compliance">
              <el-radio label="1">1-规律</el-radio>
              <el-radio label="2">2-间断</el-radio>
              <el-radio label="3">3-不服药</el-radio>
            </el-radio-group>
            <PFormInput class="mr-10">
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.compliance"></el-input>
            </PFormInput>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center">药物不良反应</div>
          </el-col>
          <el-col :span="20" class="flex_cs">
            <div class="ml-10 text_left flex_c">
              <el-radio-group class="flex mt-5" v-model="TableForm.ADR">
                <el-radio label="1">1-无</el-radio>
                <el-radio label="2">2-有：</el-radio>
              </el-radio-group>
              <el-form-item>
                <el-input :readonly="readonly" v-model="TableForm.ADR_description" class="w90"></el-input>
              </el-form-item>
            </div>
            <PFormInput class="mr-10">
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.ADR"></el-input>
            </PFormInput>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center">此次随访分类</div>
          </el-col>
          <el-col :span="20" class="text_left flex_cs">
            <el-radio-group class="ml-10 text_left" v-model="TableForm.follow_up_classify">
              <el-radio label="1">1-控制满意</el-radio>
              <el-radio label="2">2-控制不满意</el-radio>
              <el-radio label="3">3-不良反应</el-radio>
              <el-radio label="4">4-并发症</el-radio>
            </el-radio-group>
            <PFormInput class="mr-10">
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.follow_up_classify"></el-input>
            </PFormInput>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center lh247">用药情况</div>
          </el-col>
          <el-col :span="20">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="4">药物名称1</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.order_name_1"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">用法用量</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_1">
                      <template slot="append">每日次</template>
                    </el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_1">
                      <template slot="append">每次</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">药物名称2</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.order_name_2"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">用法用量</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_2">
                      <template slot="append">每日次</template>
                    </el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_2">
                      <template slot="append">每次</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">药物名称3</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.order_name_3"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">用法用量</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_3">
                      <template slot="append">每日次</template>
                    </el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_3">
                      <template slot="append">每次</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <div>其他药物</div>
                </el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.order_name_4"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">用法用量</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_4">
                      <template slot="append">每日次</template>
                    </el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_4">
                      <template slot="append">每次</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center lh60">转诊</div>
          </el-col>
          <el-col :span="20">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="4">原因</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.referral_reason"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">机构及科别</el-col>
                <el-col :span="20" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.referral_hospital_name"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center">下次随访日期*</el-col>
          <el-col :span="20" class="text_left flex_c">
            <el-form-item>
              <el-input @change="DateConversion('next_follow_up_date',$event)" v-if="!readonly" :readonly="readonly"
                v-model="TableForm.next_follow_up_date"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center">随访医生签名*</el-col>
          <el-col :span="20" class="text_left flex_c">
            <el-form-item>
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.follow_up_doctor"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </main>
    </el-form>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapActions
  } from "vuex";
  import {
    dateConversion
  } from "@/utils/common";
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
        status: this.$store.state.table.tableStatus,
        rsdt_name: "", //姓名
        pap_doc_no: "", //编号
        clearFlag:false,//清空标识
        // 表单数据
        TableForm: {
          follow_up_date: "", //第一列随访日期
          follow_up_type: "", //第一列随访方式
          symptom: "", //第一列症状
          symptom_other: "", //第一列症状其他
          blood_pressure_L: "", //第一列体征血压（mmHg）
          blood_pressure_H: "", //第一列体征血压（mmHg）
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
          ADR_description: "", //第一列药物不良反应
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
          follow_up_doctor: "" //第一列随访医生签名
        },
        symptomOptions: [{
            id: "1",
            content: "无症状"
          },
          {
            id: "2",
            content: "头痛头晕"
          },
          {
            id: "3",
            content: "恶心呕吐"
          },
          {
            id: "4",
            content: "眼花耳鸣"
          },
          {
            id: "5",
            content: "呼吸困难"
          },
          {
            id: "6",
            content: "心悸胸闷"
          },
          {
            id: "7",
            content: "鼻衄出血不止"
          },
          {
            id: "8",
            content: "四肢发麻"
          },
          {
            id: "9",
            content: "下肢水肿"
          }
        ],
        // --- checkbox Data ---
        chObject: {
          symptom: [{
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
      };
    },
    computed: {
      ...mapGetters("table", ['BaseMesData'])
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
      // 清空
      emptyData() {
        for (var obj in this.TableForm) {
          this.TableForm[obj] = ""
        };
        this.chObject = {
          symptom: [{
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
        };
        this.clearFlag = true;
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
        // console.log("key", key);
        this.TableForm[key] = val;
        // console.log(`this.TableForm.${key}`, this.TableForm[key]);
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
      textareaInput(e, key) {
        // console.log("e", e);
        // var descrip = getElementById("文本复框id").value;
        e = e.replace(/\n/g, "");
        if (e.trim() == "") {
          this.TableForm[key] = "";
        }
      },
      // 返显方法
      EchoMethod() {
        console.log(
          "tableConfiguration**************",
          this.$store.state.table.tableConfiguration
        );
        this.pap_doc_no = this.BaseMesData.pap_doc_no; //编码
        this.rsdt_name = this.BaseMesData.rsdt_name; //姓名
        console.log(this.BaseMesData)
        // console.log("表格状态99999999", this.$store.state.table.tableStatus);
        // console.log("this.status", this.status);
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
