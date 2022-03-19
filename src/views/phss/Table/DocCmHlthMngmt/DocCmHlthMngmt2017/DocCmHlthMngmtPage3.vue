<template>
  <div>
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">老年人中医药健康管理服务记录表</div>
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
        <el-row class="lh24">
          <el-col :span="8">
            <div class="center">请根据近一年的体验和感觉，回答以下问题。</div>
          </el-col>
          <el-col :span="3">
            <div class="center">没有(根本不/从来没有)</div>
          </el-col>
          <el-col :span="3">
            <div class="center">很少(有一点/偶尔)</div>
          </el-col>
          <el-col :span="3">
            <div class="center">有时(有些/少数时间)</div>
          </el-col>
          <el-col :span="3">
            <div class="center">经常(相当/多数时间)</div>
          </el-col>
          <el-col :span="3">
            <div class="center">总是(非常/每天)</div>
          </el-col>
          <el-col :span="1">
            <div class="center">得分</div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(29)您吃(喝)凉的东西会感到不舒服或者怕吃(喝)凉的东西吗？（指不喜欢吃凉的食物，或吃了凉的食物后会不舒服）</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">5</div>
          </el-col>
          <el-col :span="1">
            <div class="margin-16">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.question_29"
                  @change="onGrade"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(30)您有大便黏滞不爽、解不尽的感觉吗?(大便容易粘在马桶或便坑壁上)</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">5</div>
          </el-col>
          <el-col :span="1">
            <div class="margin-16">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.question_30"
                  @change="onGrade"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(31)您容易大便干燥吗?</div>
          </el-col>
          <el-col :span="3">
            <div class="center">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center">5</div>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-input
                v-if="!readonly"
                :readonly="readonly"
                v-model="TableForm.question_31"
                @change="onGrade"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(32)您舌苔厚腻或有舌苔厚厚的感觉吗?（如果自我感觉不清楚可由调查员观察后填写）</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">5</div>
          </el-col>
          <el-col :span="1">
            <div class="margin-16">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.question_32"
                  @change="onGrade"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(33)您舌下静脉瘀紫或增粗吗？（可由调查员辅助观察后填写）</div>
          </el-col>
          <el-col :span="3">
            <div class="center">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center">5</div>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-input
                v-if="!readonly"
                :readonly="readonly"
                v-model="TableForm.question_33"
                @change="onGrade"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="6">
            <div class="center">体质类型</div>
          </el-col>
          <el-col :span="2">
            <div class="center">气虚质</div>
          </el-col>
          <el-col :span="2">
            <div class="center">阳虚质</div>
          </el-col>
          <el-col :span="2">
            <div class="center">阴虚质</div>
          </el-col>
          <el-col :span="2">
            <div class="center">痰湿质</div>
          </el-col>
          <el-col :span="2">
            <div class="center">湿热质</div>
          </el-col>
          <el-col :span="2">
            <div class="center">血瘀质</div>
          </el-col>
          <el-col :span="2">
            <div class="center">气郁质</div>
          </el-col>
          <el-col :span="2">
            <div class="center">特禀质</div>
          </el-col>
          <el-col :span="2">
            <div class="center">平和质</div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="6">
            <div class="center">体质辨识</div>
          </el-col>
          <el-col :span="2">
            <div class="text_left flex_cs">1．得分:{{TableForm.qixuzhi}}</div>
            <div class="lh50 text_left ml-10 position_r mt-5">
              <el-radio-group v-model="qixuzhi">
                <el-radio label="2">2-是</el-radio>
                <div class="flex_cs w100">
                  <el-radio label="3">3-倾向是</el-radio>
                </div>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left flex_cs">1．得分:{{TableForm.yangxuzhi}}</div>
            <div class="lh50 text_left ml-10 position_r mt-5">
              <el-radio-group v-model="yangxuzhi">
                <el-radio label="2">2-是</el-radio>
                <div class="flex_cs w100">
                  <el-radio label="3">3-倾向是</el-radio>
                </div>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left flex_cs">1．得分:{{TableForm.yinxuzhi}}</div>
            <div class="lh50 text_left ml-10 position_r mt-5">
              <el-radio-group v-model="yinxuzhi">
                <el-radio label="2">2-是</el-radio>
                <div class="flex_cs w100">
                  <el-radio label="3">3-倾向是</el-radio>
                </div>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left flex_cs">1．得分:{{TableForm.tanshizhi}}</div>
            <div class="lh50 text_left ml-10 position_r mt-5">
              <el-radio-group v-model="tanshizhi">
                <el-radio label="2">2-是</el-radio>
                <div class="flex_cs w100">
                  <el-radio label="3">3-倾向是</el-radio>
                </div>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left flex_cs">1．得分:{{TableForm.shirezhi}}</div>
            <div class="lh50 text_left ml-10 position_r mt-5">
              <el-radio-group v-model="shirezhi">
                <el-radio label="2">2-是</el-radio>
                <div class="flex_cs w100">
                  <el-radio label="3">3-倾向是</el-radio>
                </div>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left flex_cs">1．得分:{{TableForm.xueyuzhi}}</div>
            <div class="lh50 text_left ml-10 position_r mt-5">
              <el-radio-group v-model="xueyuzhi">
                <el-radio label="2">2-是</el-radio>
                <div class="flex_cs w100">
                  <el-radio label="3">3-倾向是</el-radio>
                </div>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left flex_cs">1．得分:{{TableForm.qiyuzhi}}</div>
            <div class="lh50 text_left ml-10 position_r mt-5">
              <el-radio-group v-model="qiyuzhi">
                <el-radio label="2">2-是</el-radio>
                <div class="flex_cs w100">
                  <el-radio label="3">3-倾向是</el-radio>
                </div>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left flex_cs">1．得分:{{TableForm.tebingzhi}}</div>
            <div class="lh50 text_left ml-10 position_r mt-5">
              <el-radio-group v-model="tebingzhi">
                <el-radio label="2">2-是</el-radio>
                <div class="flex_cs w100">
                  <el-radio label="3">3-倾向是</el-radio>
                </div>
              </el-radio-group>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left flex_cs">1．得分:{{TableForm.pinghezhi}}</div>
            <div class="lh50 text_left ml-10 position_r mt-5">
              <el-radio-group v-model="pinghezhi">
                <el-radio label="2">2-是</el-radio>
                <div class="flex_cs w100">
                  <el-radio label="3">3-倾向是</el-radio>
                </div>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="6">
            <div class="center">中医药保健指导</div>
          </el-col>
          <el-col :span="2">
            <div class="text_left">
              1．情志调摄
              2．饮食调养
              3．起居调摄
              4．运动保健
              5．穴位保健
              6．其他：
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left">
              1．情志调摄
              2．饮食调养
              3．起居调摄
              4．运动保健
              5．穴位保健
              6．其他：
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left">
              1．情志调摄
              2．饮食调养
              3．起居调摄
              4．运动保健
              5．穴位保健
              6．其他：
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left">
              1．情志调摄
              2．饮食调养
              3．起居调摄
              4．运动保健
              5．穴位保健
              6．其他：
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left">
              1．情志调摄
              2．饮食调养
              3．起居调摄
              4．运动保健
              5．穴位保健
              6．其他：
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left">
              1．情志调摄
              2．饮食调养
              3．起居调摄
              4．运动保健
              5．穴位保健
              6．其他：
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left">
              1．情志调摄
              2．饮食调养
              3．起居调摄
              4．运动保健
              5．穴位保健
              6．其他：
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left">
              1．情志调摄
              2．饮食调养
              3．起居调摄
              4．运动保健
              5．穴位保健
              6．其他：
            </div>
          </el-col>
          <el-col :span="2">
            <div class="text_left">
              1．情志调摄
              2．饮食调养
              3．起居调摄
              4．运动保健
              5．穴位保健
              6．其他：
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="center">填表日期*</div>
          </el-col>
          <el-col :span="6">
            <div class>
              <el-form-item>
                <el-input
                  @change="DateConversion"
                  v-if="!readonly"
                  :disabled="this.status == 'view'? true : false"
                  :readonly="readonly"
                  v-model="TableForm.checkup_date"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="center">医生签名*</div>
          </el-col>
          <el-col :span="6">
            <div class>
              <el-select
                id="test"
                class="w100"
                v-if="!readonly"
                :disabled="this.status == 'view'? true : false"
                :readonly="readonly"
                v-model="TableForm.responsibility_doctor"
                filterable
                :default-first-option="true"
                placeholder="请选择"
              >
                <el-option
                  class="tttt"
                  v-for="item in selectOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </main>
    </el-form>
  </div>
</template>

<script>
 import { mapGetters, mapActions } from "vuex";
 import { onGet, onPost } from "@/api/public/public";
import { dateConversion } from "@/utils/common";
export default {
  name: "DocCmHlthMngmtPage3",
  components: {},
  data() {
    return {
      // 是否只读
      readonly: false,
      // input最大个数
      maxLength: 0,
      // 状态 新增 查看 编辑  view edit
      status: this.$store.state.table.tableStatus,
      rsdt_name:"", //姓名
      pap_doc_no:"", //编号
      // 表单数据
      TableForm: {
        question_29: "", //(29)您吃(喝)凉的东西会感到不舒服或者怕吃(喝)凉的东西吗？（指不喜欢吃凉的食物，或吃了凉的食物后会不舒服）
        question_30: "", //(30)您有大便黏滞不爽、解不尽的感觉吗?(大便容易粘在马桶或便坑壁上)
        question_31: "", //(31)您容易大便干燥吗?
        question_32: "", //(32)您舌苔厚腻或有舌苔厚厚的感觉吗?（如果自我感觉不清楚可由调查员观察后填写）
        question_33: "", //(33)您舌下静脉瘀紫或增粗吗？（可由调查员辅助观察后填写）
        qixuzhi: 0,
        yangxuzhi: 0,
        yinxuzhi: 0,
        tanshizhi: 0,
        shirezhi: 0,
        xueyuzhi: 0,
        qiyuzhi: 0,
        tebingzhi: 0,
        pinghezhi: 0,
        responsibility_doctor:'',
        checkup_date:''
      },
      qixuzhi: "",
      yangxuzhi: "",
      yinxuzhi: "",
      tanshizhi: "",
      shirezhi: "",
      xueyuzhi: "",
      qiyuzhi: "",
      tebingzhi: "",
      pinghezhi: "",
      // 责任医生 选择框数据
      selectOptions: [],
      // --- checkbox Data ---
      beforeData: {}
      // --- checkbox Data ---
    };
  },
  computed: {
    ...mapGetters("table", ['BaseMesData'])
    },
  created() {
    let AllStepData = this.$store.state.table.AllStepData;
    let endObj = {};
    AllStepData.forEach(el => {
      Object.assign(endObj, el);
    });
    console.log("endObj", endObj);
    this.onQueryUsersByHosId(null, "user");
    this.beforeData = endObj;
    this.EchoMethod();
    this.onGrade();

  },
  mounted() {
    if (this.status != "view") {
      this.init();
    }
    this.onGrade();
  },
  methods: {
    //计算分数
    // eslint-disable-next-line complexity
    onGrade() {
      //气虚质（2）（3）（4）（14）
      this.TableForm.qixuzhi =
        Number(this.beforeData.question_2) +
        Number(this.beforeData.question_3) +
        Number(this.beforeData.question_4) +
        Number(this.beforeData.question_14);
      if (this.TableForm.qixuzhi >= 11) {
        this.qixuzhi = "2";
      } else if (this.TableForm.qixuzhi <= 8) {
        this.qixuzhi = "";
      } else {
        this.qixuzhi = "3";
      }
      //阳虚质（11）（12）（13）（29）
      this.TableForm.yangxuzhi =
        Number(this.beforeData.question_11) +
        Number(this.beforeData.question_12) +
        Number(this.beforeData.question_13) +
        Number(this.TableForm.question_29);
      if (this.TableForm.yangxuzhi >= 11) {
        this.yangxuzhi = "2";
      } else if (this.TableForm.yangxuzhi <= 8) {
        this.yangxuzhi = "";
      } else {
        this.yangxuzhi = "3";
      }
      //阴虚质（10）（21）（26）（31）
      this.TableForm.yinxuzhi =
        Number(this.beforeData.question_10) +
        Number(this.beforeData.question_21) +
        Number(this.beforeData.question_26) +
        Number(this.TableForm.question_31);
      if (this.TableForm.yinxuzhi >= 11) {
        this.yinxuzhi = "2";
      } else if (this.TableForm.yinxuzhi <= 8) {
        this.yinxuzhi = "";
      } else {
        this.yinxuzhi = "3";
      }
      //痰湿质（9）（16）（28）（32）
      this.TableForm.tanshizhi =
        Number(this.beforeData.question_9) +
        Number(this.beforeData.question_16) +
        Number(this.beforeData.question_28) +
        Number(this.TableForm.question_32);
      if (this.TableForm.tanshizhi >= 11) {
        this.tanshizhi = "2";
      } else if (this.TableForm.tanshizhi <= 8) {
        this.tanshizhi = "";
      } else {
        this.tanshizhi = "3";
      }
      //湿热质（23）（25）（27）（30）
      this.TableForm.shirezhi =
        Number(this.beforeData.question_23) +
        Number(this.beforeData.question_25) +
        Number(this.beforeData.question_27) +
        Number(this.TableForm.question_30);
      if (this.TableForm.shirezhi >= 11) {
        this.shirezhi = "2";
      } else if (this.TableForm.shirezhi <= 8) {
        this.shirezhi = "";
      } else {
        this.shirezhi = "3";
      }
      //血瘀质（19）（22）（24）（33）
      this.TableForm.xueyuzhi =
        Number(this.beforeData.question_19) +
        Number(this.beforeData.question_22) +
        Number(this.beforeData.question_24) +
        Number(this.TableForm.question_33);
      if (this.TableForm.xueyuzhi >= 11) {
        this.xueyuzhi = "2";
      } else if (this.TableForm.xueyuzhi <= 8) {
        this.xueyuzhi = "";
      } else {
        this.xueyuzhi = "3";
      }
      //气郁质（5）（6）（7）（8）
      this.TableForm.qiyuzhi =
        Number(this.beforeData.question_5) +
        Number(this.beforeData.question_6) +
        Number(this.beforeData.question_7) +
        Number(this.beforeData.question_8);
      if (this.TableForm.qiyuzhi >= 11) {
        this.qiyuzhi = "2";
      } else if (this.TableForm.qiyuzhi <= 8) {
        this.qiyuzhi = "";
      } else {
        this.qiyuzhi = "3";
      }
      //特禀质（15）（17）（18）（20）
      this.TableForm.tebingzhi =
        Number(this.beforeData.question_15) +
        Number(this.beforeData.question_17) +
        Number(this.beforeData.question_18) +
        Number(this.beforeData.question_20);
      if (this.TableForm.tebingzhi >= 11) {
        this.tebingzhi = "2";
      } else if (this.TableForm.tebingzhi <= 8) {
        this.tebingzhi = "";
      } else {
        this.tebingzhi = "3";
      }
      //平和质（1）（2）（4）（5）（13）
      //（其中，（2）（4）（5）（13）反向计分，即 1→5，2→4，3→3，4→2，5→1）
      this.TableForm.pinghezhi =
        Number(this.beforeData.question_1) -
        Number(this.beforeData.question_2) -
        Number(this.beforeData.question_4) -
        Number(this.beforeData.question_5) -
        Number(this.beforeData.question_13) +
        24;
      if (
        this.TableForm.pinghezhi >= 17 &&
        this.TableForm.qixuzhi <= 8 &&
        this.TableForm.yangxuzhi <= 8 &&
        this.TableForm.yinxuzhi <= 8 &&
        this.TableForm.tanshizhi <= 8 &&
        this.TableForm.shirezhi <= 8 &&
        this.TableForm.xueyuzhi <= 8 &&
        this.TableForm.qiyuzhi <= 8 &&
        this.TableForm.tebingzhi <= 8 &&
        this.TableForm.pinghezhi <= 8
      ) {
        this.pinghezhi = "2";
      } else if (
        this.TableForm.pinghezhi >= 17 &&
        this.TableForm.qixuzhi <= 10 &&
        this.TableForm.yangxuzhi <= 10 &&
        this.TableForm.yinxuzhi <= 10 &&
        this.TableForm.tanshizhi <= 10 &&
        this.TableForm.shirezhi <= 10 &&
        this.TableForm.xueyuzhi <= 10 &&
        this.TableForm.qiyuzhi <= 10 &&
        this.TableForm.tebingzhi <= 10 &&
        this.TableForm.pinghezhi <= 10
      ) {
        this.pinghezhi = "3";
      } else {
        this.pinghezhi = "";
      }
      console.log("this.TableForm", this.TableForm);
    },
    init() {
      setTimeout(() => {
        this.initInput();
        this.addEnterListener();
      }, 10);
    },
    emptyData() {
      for (var obj in this.TableForm) {
        this.TableForm[obj] = ""
      };
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
    // 医生签名
    onQueryUsersByHosId(hosId, flg) {
      onPost({
        url: "/phss/sysPublic/onQueryUsersByHosId",
        data: { hosId: hosId }
      })
        .then(res => {
          console.log("====签名===========",res);
          if (res.code === 1) {
            this.selectOptions = res.data;
          } else {
            console.log("error", res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 返显方法
    EchoMethod() {
      console.log(
        "tableConfiguration**************",
        this.$store.state.table.tableConfiguration
      );
      this.pap_doc_no = this.BaseMesData.pap_doc_no;//编码
      this.rsdt_name = this.BaseMesData.rsdt_name;//姓名
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
        console.log("edit数据返显老年人中医药健康管理服务记录表", tableConfiguration);
      }
      for (let obj in this.TableForm) {
        this.TableForm[obj] = tableConfiguration.editData[obj];
      }
      if(tableConfiguration.editChObject){
        let editChObject = JSON.parse(tableConfiguration.editChObject);
        // console.log("tableConfiguration.editChObject", editChObject);
        for (let obj in this.chObject) {
          this.chObject[obj] = editChObject[obj];
        }
      }
      console.log("this.TableForm老年人中医药健康管理服务记录表", this.TableForm);
      console.log("this.chObject", this.chObject);
    }
  },
  watch: {}
};
</script>
