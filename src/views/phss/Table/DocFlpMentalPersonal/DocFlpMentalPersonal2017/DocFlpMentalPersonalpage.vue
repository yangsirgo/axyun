<template>
  <div class="lungTable">
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">严重精神障碍患者个人信息补充表</div>
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
          <el-col :span="14">
            <el-col class="center" :span="8">监护人姓名</el-col>
            <el-col :span="16">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.custodian_name"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="10">
            <el-col class="center" :span="8">与患者关系</el-col>
            <el-col :span="16">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.relationship"></el-input>
              </el-form-item>
            </el-col>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="14">
            <el-col class="center" :span="8">监护人住址</el-col>
            <el-col :span="16">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.custodian_address"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="10">
            <el-col class="center" :span="8">监护人电话</el-col>
            <el-col :span="16">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.custodian_telephone"></el-input>
              </el-form-item>
            </el-col>

          </el-col>
        </el-row>


        <el-row>
          <el-col class="center" :span="10">辖区村（居）委会联系人、电话</el-col>
          <el-col :span="14">
            <el-form-item>
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.committee_contact"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">户别</el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.household">
                  <el-radio label="1">1-城镇</el-radio>
                  <el-radio label="2">2-农村</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.household"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">就业情况</el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.employment">
                  <el-radio label="1">1-在岗工人</el-radio>
                  <el-radio label="2">2-在岗管理者</el-radio>
                  <el-radio label="3">3-农民</el-radio>
                  <el-radio label="4">4-下岗或无业</el-radio>
                  <el-radio label="5">5-在校学生</el-radio>
                  <el-radio label="6">6-退休</el-radio>
                  <el-radio label="7">7-专业技术人员</el-radio>
                  <el-radio label="8">8-其他</el-radio>
                  <el-radio label="9">9-不详</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.employment"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" class="center">
            <div class="centerHeight">知情同意</div>
          </el-col>
          <el-col :span="16" class="text_left">

            <el-col :span="24" class="elCol-style" style="border-left:0px;margin-top: 8px;margin-bottom: 8px;">
              <div class="flex_cs">
                <div>
                  <el-radio-group class="ml-10" v-model="TableForm.informed_consent">
                    <el-radio label="1">1-同意参加管理</el-radio>
                    <el-radio label="2">2-不同意参加管理</el-radio>
                  </el-radio-group>
                </div>
                <PFormInput class="mr-10">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.informed_consent"></el-input>
                </PFormInput>
              </div>
            </el-col>

            <el-col :span="24" class="elCol-style" style="border-left:0px;">
              <span style="width: 150px;">签字：</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.informed_consent_sign"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" class="elCol-style" style="border-left:0px;">
              <span style="width: 150px;">签字时间：</span>
              <el-form-item>
                <el-input v-if="!readonly" @change="DateConversion('informed_consent_sign_time',$event)" :readonly="readonly"
                  v-model="TableForm.informed_consent_sign_time"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">初次发病时间</el-col>
          <el-col :span="16">
            <el-form-item>
              <el-input @change="DateConversion('first_invasion_date',$event)" v-if="!readonly" :readonly="readonly"
                v-model="TableForm.first_invasion_date"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="symptomsStyleBox">
          <el-col :span="8" style="border-right:0px ;">
            <div class="center lh140 symptomsStyle">
              既往主要症状:
            </div>
          </el-col>
          <el-col :span="16" style="border-left:1px solid !important;">
            <div class="rowChildren center">
              <el-row :span="24" class="symptomsInput symptom">
                <el-col :span="24" class="text_left">
                  <PCheckbox class="pl-10" @childValInput="childVal" :readonly="readonly" :formKey="'symptom'"
                    :checkboxOptions="symptomOptionsData" :checkboxForm="chObject.symptom" :clearFlag="clearFlag" />
                </el-col>
              </el-row>
              <!-- <el-row>
                <el-col :span="24" class="h85">
                  <div class="text_left">其他：</div>
                  <el-input @input="textareaInput($event,'symptom_other')" resize="none" type="textarea" :rows="2"
                    v-model="TableForm.symptom_other"></el-input>
                </el-col>
              </el-row> -->
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">既往关锁情况</el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.lock_situation">
                  <el-radio label="1">1-无关锁</el-radio>
                  <el-radio label="2">2-关锁</el-radio>
                  <el-radio label="3">3-关锁已解除</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.lock_situation"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" class="center">
            <el-col :span="8">
              <div class="centerHeight">既往治疗情况</div>
            </el-col>
            <el-col :span="16">
              <el-col :span="24" class="lin75">门诊</el-col>
              <el-col :span="24" style="border-top: 1px solid #000000;border-left: 0px;">家床</el-col>
            </el-col>
          </el-col>
          <el-col :span="16" class="text_left">
              <el-col :span="24" class="elCol-style">
                <div class="flex_cs">
                  <div>
                    <el-radio-group class="ml-10" v-model="TableForm.out_treat_situation">
                      <el-radio label="1">1-未治</el-radio>
                      <el-radio label="2">2-间断门诊治疗</el-radio>
                      <el-radio label="3">3-连续门诊治疗</el-radio>
                    </el-radio-group>
                  </div>
                  <PFormInput class="mr-10">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.out_treat_situation"></el-input>
                  </PFormInput>
                </div>
              </el-col>
              <el-col :span="24" class="elCol-style" style="border-left:0px;margin-top: 8px;margin-bottom: 8px;">
                <span style="width: 180px;">首次抗精神病药治疗时间：</span>
                <el-form-item>
                  <el-input v-if="!readonly" @change="DateConversion('out_treat_situation_date',$event)" :readonly="readonly"
                    v-model="TableForm.out_treat_situation_date"></el-input>
                </el-form-item>
              </el-col>


              <el-col :span="24" class="symptomsFlex" style="border-top: 1px solid !important;border-left: 0px;">
                <span style="width: 260px;">曾住精神专科医院/综合医院精神专科</span>
                <el-form-item>
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.first_out_treat_date"></el-input>
                </el-form-item>
                <span class="w30">次</span>
              </el-col>

          </el-col>
        </el-row>


        <el-row>
          <el-col class="center" :span="8">目前诊断情况</el-col>
          <el-col :span="16" class="elCol-style">
            <span style="width: auto;">诊断</span>
            <el-form-item>
              <el-input v-if="!readonly" class="w120" :readonly="readonly" v-model="TableForm.diagnosis_situation"></el-input>
            </el-form-item>
            <span style="width: auto;">确诊医院</span>
            <el-form-item>
              <el-input v-if="!readonly" class="w120" :readonly="readonly" v-model="TableForm.diagnosis_situation_host"></el-input>
            </el-form-item>
            <span style="width: auto;">确诊日期</span>
            <el-form-item>
              <el-input class="w120" @change="DateConversion('diagnosis_situation_date',$event)" v-if="!readonly"
                :readonly="readonly" v-model="TableForm.diagnosis_situation_date"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">最近一次治疗效果</el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.recently_treat_situation">
                  <el-radio label="1">1-临床痊愈</el-radio>
                  <el-radio label="2">2-好转</el-radio>
                  <el-radio label="3">3-无变化</el-radio>
                  <el-radio label="4">4-加重</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.recently_treat_situation"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>

        <el-row class="symptomsStyleBox">
          <el-col :span="8" style="border-right:0px ;">
            <div class="center symptomsStyle" style="height:104px;line-height: 104px;">
              危险行为
            </div>
          </el-col>
          <el-col :span="16" style="border-left:1px solid !important;">
            <div class="rowChildren center">
              <el-row :span="24" class="symptomsInput symptom">
                <el-col :span="24" class="text_left">
                  <PCheckbox class="pl-10" @childValInput="childVal" :readonly="readonly" :formKey="'risky_behavior'"
                    :checkboxOptions="symptomOptions" :checkboxForm="chObject.risky_behavior" :clearFlag="clearFlag" />
                </el-col>
              </el-row>
              <!-- <el-row>
                <el-col :span="24" class="h85">
                  <div class="text_left">其他：</div>
                  <el-input @input="textareaInput($event,'symptom_other')" resize="none" type="textarea" :rows="2"
                    v-model="TableForm.symptom_other"></el-input>
                </el-col>
              </el-row> -->
            </div>
          </el-col>
        </el-row>


        <el-row>
          <el-col class="center" :span="8">经济状况</el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.economically">
                  <el-radio label="1">1-贫困，在当地贫困线标准以下</el-radio>
                  <el-radio label="2">2-非贫困</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.economically"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="center">专科医生的意见(如果有请记录)</el-col>
          <el-col :span="16" class="text_left flex_c">
            <el-form-item class="w100">
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.doctor_suggestion"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" class="center">填表日期*</el-col>
          <el-col :span="16" class="text_left flex_c">
            <el-col :span="8">
              <el-input @change="DateConversion('fill_date',$event)" v-if="!readonly" :readonly="readonly" v-model="TableForm.fill_date"></el-input>
            </el-col>
            <el-col :span="16">
              <el-col :span="8" class="center">
                医生签字*
              </el-col>
              <el-col :span="16">
                <el-form-item class="w100">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.doctor_name"></el-input>
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
          custodian_name: '', //监护人姓名
          relationship: '', //与患者关系
          custodian_address: '', //监护人住址
          custodian_telephone: '', //监护人电话
          committee_contact: '', //辖区村（居）委会联系人、电话
          household: '', //户别
          employment: '', //就业情况
          informed_consent: '', //知情同意
          informed_consent_sign: '', //知情同意签字
          informed_consent_sign_time: '', //知情同意签字时间
          first_invasion_date: '', //初次发病时间
          symptom: '', //既往主要症状
          lock_situation: '', //既往关锁情况
          out_treat_situation: '', //既往治疗情况门诊
          out_treat_situation_date: '', //既往治疗情况门诊 首次
          first_out_treat_date: '', //既往治疗情况家床
          diagnosis_situation: '', //诊断情况
          diagnosis_situation_host: '', //确诊医院
          diagnosis_situation_date: '', //确诊日期
          recently_treat_situation: '', //最近一次治疗效果
          risky_behavior: '', //危险行为
          economically: '', //经济状况
          doctor_suggestion: '', //专科医生的意见
          fill_date: '', //填表日期
          doctor_name: '' //医生签字
        },
        symptomOptionsData: [{
            id: "1",
            content: "幻觉"
          },
          {
            id: "2",
            content: "交流困难"
          },
          {
            id: "3",
            content: "猜疑"
          },
          {
            id: "4",
            content: "喜怒无常"
          },
          {
            id: "5",
            content: "行为怪异"
          },
          {
            id: "6",
            content: "兴奋话多"
          },
          {
            id: "7",
            content: "伤人毁物"
          },
          {
            id: "8",
            content: "悲观厌世"
          },
          {
            id: "9",
            content: "无故外走"
          },
          {
            id: "10",
            content: "自语自笑"
          },
          {
            id: "11",
            content: "孤僻懒散"
          },
          {
            id: "12",
            content: "其他"
          }
        ],
        symptomOptions: [{
            id: "1",
            content: "轻度滋事次"
          },
          {
            id: "2",
            content: "肇事次"
          },
          {
            id: "3",
            content: "肇祸次"
          },
          {
            id: "4",
            content: "其他危害行为次"
          },
          {
            id: "5",
            content: "自伤次"
          },
          {
            id: "6",
            content: "自杀未遂次"
          },
          {
            id: "7",
            content: "无"
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
          risky_behavior: [{
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
        if (tableConfiguration.editChObject) {
          let editChObject = JSON.parse(tableConfiguration.editChObject);
          // console.log("tableConfiguration.editChObject", editChObject);
          for (let obj in this.chObject) {
            this.chObject[obj] = editChObject[obj];
          }
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
    .lin75 {
      height: 75px;
      line-height: 75px;
    }

    .symptomsInput {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .symptomsFlex {
      display: flex;
      align-items: center;
      justify-content: flex-start;
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

    .lh140 {
      height: 140px;
      line-height: 140px;
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

    .flex_cs {
      width: 100%;
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

    .borderBottom {
      border-bottom: 0px !important;
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

    .elColStyleDay .elCol-style {
      padding: 0px 3px;
    }

    .dangerousAct {}

    .dangerousActFlex {
      display: block;
    }

    .elCol-style-box {
      width: 100%;
      float: left;
    }

    .floatLeft {
      float: left;
    }

  }
</style>
