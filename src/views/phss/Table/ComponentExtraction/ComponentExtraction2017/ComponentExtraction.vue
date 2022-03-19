<template>
  <div>
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">模板示例</div>
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
            <div class="center">一般状况</div>
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
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.pulse_rate">
                      <template slot="append">次/分钟</template>
                    </el-input>
                  </el-form-item>
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
                            v-model="TableForm.blood_pressure_left_L"
                          ></el-input>
                        </el-form-item>
                        <span>&nbsp;/&nbsp;</span>
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.blood_pressure_left_H"
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
                            v-model="TableForm.blood_pressure_right_L"
                          ></el-input>
                        </el-form-item>
                        <span>&nbsp;/&nbsp;</span>
                        <el-form-item>
                          <el-input
                            v-if="!readonly"
                            :readonly="readonly"
                            v-model="TableForm.blood_pressure_right_H"
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
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="center">生活方式</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="3">
                  <div class="lh60">饮食习惯</div>
                </el-col>
                <el-col :span="21">
                  <div class="lh20 padding-10 text_left">
                    <PCheckbox
                      @childValInput="childVal"
                      :readonly="readonly"
                      :formKey="'eating_habits'"
                      :checkboxOptions="EatingHabitsOptions"
                      :checkboxForm="chObject.eating_habits"
                    />
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
  name: "HealthChecklistPage1",
  components: {},
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
        checkup_date: "", //体检日期
        responsibility_doctor: "", //责任医生
        symptom: "", //症状
        symptom_other: "", //症状其他
        temperature: "", //体温
        pulse_rate: "", //脉率
        respiratory_rate: "", //呼吸频率(次/分钟)
        blood_pressure_left_L: "", //血压左侧-低
        blood_pressure_left_H: "", //血压左侧-高
        blood_pressure_right_L: "", //血压右侧-低
        blood_pressure_right_H: "", //血压右侧-高
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
        quit_drinking_age: "", //戒酒年龄
        drinking_age: "", //开始饮酒年龄
        drunk_nearly_year: "", //近一年内是否曾醉酒
        drinking_type: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ], //饮酒种类
        drinking_type_other: "", //饮酒种类其他
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
      // 责任医生 选择框数据
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
      // --- checkbox Data ---
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
      chObject: {
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
        ],
        eating_habits: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ],
        drinking_type: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ]
      }
      // --- checkbox Data ---
    };
  },
  created() {
    console.log("this.status", this.status);
    this.EchoMethod();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
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
      if (this.TableForm.checkup_date.length == 8) {
        this.TableForm.checkup_date = dateConversion(
          this.TableForm.checkup_date
        );
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
    // 返显方法
    EchoMethod() {
      console.log(
        "tableConfiguration**************",
        this.$store.state.table.tableConfiguration
      );
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
  watch: {}
};
</script>