<template>
  <div class="lungTable">
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">肺结核患者随访服务记录表</div>
          </el-col>
        </el-row>
        <el-row class="mb-10" type="flex" justify="space-between">
          <el-col :span="12">
            <div>姓名:
              {{rsdt_name}}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="fr">编号:
              {{pap_doc_no}}
            </div>
          </el-col>
        </el-row>
      </header>
      <main class="table_main">

        <el-row>
          <el-col class="center" :span="8">随访时间*</el-col>
          <el-col :span="16">
            <el-form-item>
              <el-input @change="DateConversion('follow_up_date',$event)" v-if="!readonly" :readonly="readonly" v-model="TableForm.follow_up_date"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">治疗月序</el-col>
          <el-col :span="16" class="elCol-style">
            <span style="width: auto;">第</span>
            <el-form-item>
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.treatment_month_sequence"></el-input>
            </el-form-item>
            <span>月</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">督导人员</el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.supervisor">
                  <el-radio label="1">1-医生</el-radio>
                  <el-radio label="2">2-家属</el-radio>
                  <el-radio label="3">3-自服药</el-radio>
                  <el-radio label="4">4-其他</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.supervisor"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">随访方式*</el-col>
          <el-col :span="16">
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
        <el-row class="symptomsStyleBox">
          <el-col :span="8" style="border-right:0px ;">
            <div class="center lh187 symptomsStyle">
              症状及体征:
            </div>
          </el-col>
          <el-col :span="16" style="border-left:1px solid !important;">
            <div class="rowChildren center">
              <el-row :span="24" class="symptomsInput symptom">

                <el-col :span="24" class="text_left">
                  <PCheckbox class="pl-10" @childValInput="childVal" :readonly="readonly" :formKey="'symptom'" :checkboxOptions="symptomOptionsData" :checkboxForm="chObject.symptom" :clearFlag="clearFlag" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="h85">
                  <div class="text_left">其他：</div>
                  <el-input @input="textareaInput($event,'symptom_other')" resize="none" type="textarea" :rows="2" v-model="TableForm.symptom_other"></el-input>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row class="el-row-boder">
          <el-col :span="8">
            <el-col :span="8">
              <div class="center lh64-style">生活方式指导</div>
            </el-col>
            <el-col :span="16">
              <el-row class="el-row-border-2">
                <el-col style="text-align: center;">吸 烟</el-col>
              </el-row>
              <el-row class="el-row-border-1 borderBottom">
                <el-col style="text-align: center;">饮 酒</el-col>
              </el-row>
            </el-col>
          </el-col>
          <el-col :span="16">
            <div class="rowChildren center">
              <el-row :span="24">
                <el-col :span="24" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.smoking_amount_1"></el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.smoking_amount_2">
                      <template slot="append">支/天</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="24" class="text_left flex_c">
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.drinking_amount_1"></el-input>
                  </el-form-item>
                  <span>/</span>
                  <el-form-item class="w100">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.drinking_amount_2">
                      <template slot="append">两/天</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row class="el-row-boder">
          <el-col :span="8">
            <el-col :span="8">
              <div class="center lh94-style">用药</div>
            </el-col>
            <el-col :span="16">
              <el-row class="el-row-border-2">
                <el-col style="text-align: center;">化疗方案</el-col>
              </el-row>
              <el-row>
                <el-col style="text-align: center;">用 法</el-col>
              </el-row>
              <el-row>
                <el-col style="text-align: center;height: 70px;line-height: 70px;">药品剂型</el-col>
              </el-row>
              <el-row class="borderBottom">
                <el-col style="text-align: center;">漏服药次数</el-col>
              </el-row>
            </el-col>
          </el-col>
          <el-col :span="16">
            <div class="rowChildren center">
              <el-row class="el-row-border-2">
                <el-input v-model="TableForm.induction_chemotherapy"></el-input>
              </el-row>
              <el-row :span="24" class="el-row-border-1">
                <div class="flex_cs">
                  <div>
                    <el-radio-group class="ml-10" v-model="TableForm.route">
                      <el-radio label="1">1-每日</el-radio>
                      <el-radio label="2">2-间歇</el-radio>

                    </el-radio-group>
                  </div>
                  <PFormInput class="mr-10">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route"></el-input>
                  </PFormInput>
                </div>
              </el-row>
              <el-row :span="24" class="el-row-border-1">
                <PCheckbox class="pl-10" @childValInput="childVal" :readonly="readonly" :formKey="'dosage_form'" :checkboxOptions="symptomOptions" :checkboxForm="chObject.dosage_form" :clearFlag="clearFlag" />
              </el-row>
              <el-row :span="24" class="el-row-border-2">
                <el-col :span="24" class="elCol-style">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.miss_tot"></el-input>
                  </el-form-item>
                  <span>次</span>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">药物不良反应</el-col>
          <el-col :span="16" class="flex_cs">
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
          <el-col class="center" :span="8">并发症或合并症</el-col>
          <el-col :span="16" class="flex_cs">
            <div class="ml-10 text_left flex_c">
              <el-radio-group class="flex mt-5" v-model="TableForm.complication">
                <el-radio label="1">1-无</el-radio>
                <el-radio label="2">2-有：</el-radio>
              </el-radio-group>
              <el-form-item>
                <el-input :readonly="readonly" v-model="TableForm.complication_description" class="w90"></el-input>
              </el-form-item>
            </div>
            <PFormInput class="mr-10">
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.complication"></el-input>
            </PFormInput>
          </el-col>
        </el-row>



        <el-row class="el-row-boder">
          <el-col :span="8">
            <el-col :span="8">
              <div class="center lh64-style">转诊</div>
            </el-col>
            <el-col :span="16">
              <el-row class="el-row-border-2">
                <el-col style="text-align: center;">科 别</el-col>
              </el-row>
              <el-row class="el-row-border-1">
                <el-col style="text-align: center;">原 因</el-col>
              </el-row>
              <el-row class="el-row-border-1 borderBottom">
                <el-col style="text-align: center;">2周内随访，随访结果</el-col>
              </el-row>
            </el-col>
          </el-col>
          <el-col :span="16">
            <div class="rowChildren center">
              <el-row :span="24">
                <el-form-item class="w100">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.referral_hospital_name"></el-input>
                </el-form-item>
              </el-row>
              <el-row :span="24">
                <el-form-item class="w100">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.referral_reason"></el-input>
                </el-form-item>
              </el-row>
              <el-row :span="24">
                <el-form-item class="w100">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.follow_up_result"></el-input>
                </el-form-item>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" class="center">处理意见</el-col>
          <el-col :span="16" class="text_left flex_c">
            <el-form-item class="w100">
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.suggestion"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" class="center">下次随访时间*</el-col>
          <el-col :span="16" class="text_left flex_c">
            <el-form-item class="w100">
              <el-input @change="DateConversion('next_follow_up_date',$event)" v-if="!readonly" :readonly="readonly" v-model="TableForm.next_follow_up_date"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="center">随访医生签名*</el-col>
          <el-col :span="16" class="text_left flex_c">
            <el-form-item class="w100">
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.follow_up_doctor"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" class="center">
            <div class="centerHeight">停止治疗及原因</div>
          </el-col>
          <el-col :span="16" class="text_left">
            <el-col :span="24" class="elCol-style">
              <span style="width: 150px;">1、出现停止治疗时间：</span>
              <el-form-item>
                <el-input v-if="!readonly" @change="DateConversion('stop_treatment_date',$event)" :readonly="readonly" v-model="TableForm.stop_treatment_date"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" class="elCol-style" style="border-left:0px;margin-top: 8px;margin-bottom: 8px;">
              <span style="width: 150px;">2、停止治疗原因：</span>
              <div class="flex_cs">
                <div>
                  <el-radio-group class="ml-10" v-model="TableForm.stop_treatment_reason">
                    <el-radio label="1">1-完成疗程</el-radio>
                    <el-radio label="2">2-死亡</el-radio>
                    <el-radio label="3">3-丢失</el-radio>
                    <el-radio label="4">4-转入耐多药治疗</el-radio>
                  </el-radio-group>
                </div>
                <PFormInput class="mr-10">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.stop_treatment_reason"></el-input>
                </PFormInput>
              </div>
            </el-col>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" class="center">
            <div class="centerHeight">全程管理情况</div>
          </el-col>
          <el-col :span="16" class="text_left">
            <el-col :span="24" class="elCol-style" style="height: 33px;">
              <span>应访视患者</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.plan_interview_count" class="w60"></el-input>
              </el-form-item>
              <span>次, </span>
              <span>实际访视</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.interview_count" class="w60"></el-input>
              </el-form-item>
              <span>次; </span>
            </el-col>

            <el-col :span="24" class="elCol-style boxInput" style="height: 33px;border-bottom: 1px solid #000000;border-left: 0;border-top: 1px solid #000000;">
              <span class="centerHeight" style="width: 250px;">患者在疗程中，应服药</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.plan_take_medicine_count" class="w60"></el-input>
              </el-form-item>
              <span class="w30">次, </span>

              <span>实际服药</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.take_medicine_count" class="w60"></el-input>
              </el-form-item>
              <span class="w30">次, </span>
              <span>服药率</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medication_rate" class="w60"></el-input>
              </el-form-item>
              <span>% </span>
            </el-col>
            <el-col :span="24" style="border-left:0px;">
              <el-col :span="8" class="center">评估医生签名</el-col>
              <el-col :span="16" class="text_left flex_c">
                <el-form-item class="w100">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.evaluate_doctor"></el-input>
                </el-form-item>
              </el-col>
            </el-col>

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
  import {
    mapGetters,
    mapActions
  } from "vuex";
  export default {
    name: "TuberculosisFirstPage",
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
        // 清空
        clearFlag: false,
        // 表单数据
        TableForm: {
          table: "doc_flp_tbclss_follow_data",
          follow_up_date: "", //随访时间
          treatment_month_sequence: "", //治疗月序
          supervisor: "", //督导人员选择
          follow_up_type: "", //随访方式
          symptom: "", //症状及体征
          symptom_other: "", //症状及体征其他
          smoking_amount_1: "", //吸烟1
          smoking_amount_2: "", //吸烟2
          drinking_amount_1: "", //饮酒1
          drinking_amount_2: "", //饮酒2
          induction_chemotherapy: "", //化疗方案
          route: "", //用法
          dosage_form: "", //药品剂型
          miss_tot: "", //漏药次数
          ADR: "", //服药后不良反应及处理
          ADR_description: "", //服药后不良反应及处理
          complication: "", //并发症或合并症
          complication_description: "", //并发症或合并症有
          referral_hospital_name: "", //转诊科别
          referral_reason: "", //转诊原因
          follow_up_result: "", //转诊2周内随访，随访结果
          suggestion: "", //处理意见
          next_follow_up_date: "", //下次随访日期
          follow_up_doctor: "", //随访医生签名
          stop_treatment_date: "", //停止治疗时间
          stop_treatment_reason: "", //停止治疗原因
          plan_interview_count: "", //应访视患者次数
          interview_count: "", //实际访视次数
          plan_take_medicine_count: "", //应服药次数
          take_medicine_count: "", //实际服药次数
          medication_rate: "", //服药率
          evaluate_doctor: "" //评估医生签名
        },
        symptomOptionsData: [{
            id: "0",
            content: "没有症状"
          },
          {
            id: "1",
            content: "咳嗽咳痰"
          },
          {
            id: "2",
            content: "低热盗汗"
          },
          {
            id: "3",
            content: "咯血或血痰"
          },
          {
            id: "4",
            content: "胸痛消瘦"
          },
          {
            id: "5",
            content: "恶心纳差"
          },
          {
            id: "6",
            content: "关节疼痛"
          },
          {
            id: "7",
            content: "头痛失眠"
          },
          {
            id: "8",
            content: "视物模糊"
          },
          {
            id: "9",
            content: "皮肤瘙痒、皮疹"
          },
          {
            id: "10",
            content: "耳鸣、听力下降"
          }
        ],
        symptomOptions: [{
            id: "1",
            content: "固定剂量复合制剂"
          },
          {
            id: "2",
            content: "散装药"
          },
          {
            id: "3",
            content: "板式组合药"
          },
          {
            id: "4",
            content: "注射剂"
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
            }

          ],
          dosage_form: [{
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
      if (this.status != "view") {
        this.init();
      }
    },
    methods: {
      init() {
        // 判断查看、编辑 状态

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
            }

          ],
          dosage_form: [{
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
        let temp = document.getElementById("elinput1");
        temp.focus();

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
        window.removeEventListener("keydown", this.listenEnterEvent);
        window.__completeEnterBind__ = false;
      },
      // dateConversion 日期转换
      DateConversion(val, e) {
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
        // console.log("index", index);
        // console.log("key", key);
        // console.log("this.chObject[key]", this.chObject[key]);
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
        e = e.replace(/\n/g, "");
        if (e.trim() == "") {
          this.TableForm[key] = "";
        }
      },
      // 返显方法
      EchoMethod() {
        // console.log(
        //   "tableConfiguration**************",
        //   this.$store.state.table.tableConfiguration
        // );
        // console.log("表格状态99999999", this.$store.state.table.tableStatus);
        // console.log("this.BaseMesData", this.BaseMesData);

        this.pap_doc_no = this.BaseMesData.pap_doc_no; //编码
        this.rsdt_name = this.BaseMesData.rsdt_name; //姓名
        let tableConfiguration = {};
        if (this.status == "add") {
          return;
        }
        if (this.status == "view") {
          tableConfiguration = this.$store.state.table.viewTableConfiguration;
          // console.log("view数据返显", tableConfiguration);
        }
        if (this.status == "edit") {
          tableConfiguration = this.$store.state.table.tableConfiguration;
          // console.log("edit数据返显", tableConfiguration);
        }
        for (let obj in this.TableForm) {
          this.TableForm[obj] = tableConfiguration.editData[obj];
        }
        this.TableForm.table = "doc_flp_tbclss_follow_data";
        let editChObject = JSON.parse(tableConfiguration.editChObject);
        // console.log("tableConfiguration.editChObject", editChObject);
        for (let obj in this.chObject) {
          this.chObject[obj] = editChObject[obj];
        }
        // console.log("this.TableForm", this.TableForm);
        // console.log("this.chObject", this.chObject);
      }
    },
    watch: {}
  };
</script>
<style lang="scss" scoped>
  .lungTable {
    .symptomsInput {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .symptomsInput .el-input--medium .el-input__inner {
      width: 20px !important;
      height: 20px !important;
      padding: 0px !important;
      text-align: center;
      border-radius: 3px
    }

    .symptomsStyle .el-col {
      border-left: 0px;
    }

    .symptomsStyleBox .el-col-16 {
      border-left: 0px;
    }

    .symptomsStyleBox .el-col-8 {
      border-right: 1px solid #000;
    }

    .el-row-boder .lh94-style {
      width: 100%;
      height: 90px;
      line-height: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .el-row-boder .lh64-style {
      width: 100%;
      height: 60px;
      line-height: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .elCol-style {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .elCol-style span {
      width: 100px;
    }

    .el-row-boder .el-col .el-row {
      border-right: 0px solid #000;
      border-left: 0px solid #000;

    }

    .el-row-boder .el-col .el-row-border-1 {
      border-right: 0px solid #000;
      border-left: 0px solid #000;
    }

    .el-row-boder .el-col .el-row-border-2 {
      border-top: 0px solid #000;
    }

    .centerHeight {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 81px;
    }

    .borderBottom {
      border-bottom: 0px !important;
    }

  }
</style>