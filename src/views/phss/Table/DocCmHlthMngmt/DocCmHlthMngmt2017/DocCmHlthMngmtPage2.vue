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
            <div class="center">
              没有
              <br />(根本不/从来没有)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              很少
              <br />(有一点/偶尔)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              有时
              <br />(有些/少数时间)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              经常
              <br />(相当/多数时间)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              总是
              <br />(非常/每天)
            </div>
          </el-col>
          <el-col :span="1">
            <div class="center lh60">得分</div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(14)您容易患感冒吗?（指每年感冒的次数）</div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              1
              <br />一年&lt;2 次
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              2
              <br />一年感冒2-4 次
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              3
              <br />一年感冒5-6 次
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              4
              <br />一年 8 次以上
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              5
              <br />几乎每月
            </div>
          </el-col>
          <el-col :span="1">
            <div class="margin-16">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_14"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(15)您没有感冒时也会鼻塞、流鼻涕吗?</div>
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
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_15"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(16)您有口粘口腻，或睡眠打鼾吗？</div>
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
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_16"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh90">
          <el-col :span="8">
            <div class="text_left">(17)您容易过敏(对药物、食物、气味、花粉或在季节交替、气候变化时)吗?</div>
          </el-col>
          <el-col :span="3" class="center">
            <div>1</div>
            <div>从来没有</div>
            <div>&#160;</div>
          </el-col>
          <el-col :span="3" class="center">
            <div>2</div>
            <div>一年 1、2 次</div>
            <div>&#160;</div>
          </el-col>
          <el-col :span="3" class="center">
            <div>3</div>
            <div>一年 3、4 次</div>
            <div>&#160;</div>
          </el-col>
          <el-col :span="3" class="center">
            <div>4</div>
            <div>一年 5、6 次</div>
            <div>&#160;</div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              5
              <br />每次遇到上述原因都过敏
            </div>
          </el-col>
          <el-col :span="1">
            <div class="margin-30">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_17"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(18)您的皮肤容易起荨麻疹吗? (包括风团、风疹块、风疙瘩)</div>
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
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_18"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(19)您的皮肤在不知不觉中会出现青紫瘀斑、皮下出血吗?（指皮肤在没有外伤的情况下出现青一块紫一块的情况）</div>
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
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_19"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(20)您的皮肤一抓就红，并出现抓痕吗?（指被指甲或钝物划过后皮肤的反应）</div>
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
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_20"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(21)您皮肤或口唇干吗?</div>
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
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_21"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(22)您有肢体麻木或固定部位疼痛的感觉吗？</div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              1
              <br />(BMI&lt;24)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              2
              <br />(24≤BMI&lt;25)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              3
              <br />(25≤BMI&lt;26)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              4
              <br />(26≤BMI&lt;28)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              5
              <br />(BMI≥28)
            </div>
          </el-col>
          <el-col :span="1">
            <div class="margin-16">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_22"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(23)您面部或鼻部有油腻感或者油亮发光吗?（指脸上或鼻子）</div>
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
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_23"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(24)您面色或目眶晦黯，或出现褐色斑块/斑点吗?</div>
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
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_24"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(25)您有皮肤湿疹、疮疖吗？</div>
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
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_25"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(26)您感到口干咽燥、总想喝水吗？</div>
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
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_26"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(27)您感到口苦或嘴里有异味吗?（指口苦或口臭）</div>
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
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_27"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(28)您腹部肥大吗?（指腹部脂肪肥厚）</div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              1
              <br />(腹围&lt;80cm，相当于 2.4 尺)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              2
              <br />(腹围 80-85cm，2.4-2.55 尺)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              3
              <br />(腹围 86-90cm，2.56-2.7 尺)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              4
              <br />(腹围91-105cm，2.71-3.15 尺)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center margin-16">
              5
              <br />(腹围&gt;105cm或3.15尺)
            </div>
          </el-col>
          <el-col :span="1">
            <div class="margin-30">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_28"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </main>
    </el-form>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from "vuex";
import { dateConversion } from "@/utils/common";
export default {
  name: "DocCmHlthMngmtPage2",
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
        question_14: "", //(14)您容易患感冒吗?（指每年感冒的次数）
        question_15: "", //(15)您没有感冒时也会鼻塞、流鼻涕吗?
        question_16: "", //(16)您有口粘口腻，或睡眠打鼾吗？
        question_17: "", //(17)您容易过敏(对药物、食物、气味、花粉或在季节交替、气候变化时)吗?
        question_18: "", //(18)您的皮肤容易起荨麻疹吗? (包括风团、风疹块、风疙瘩)
        question_19: "", //(19)您的皮肤在不知不觉中会出现青紫瘀斑、皮下出血吗?（指皮肤在没有外伤的情况下出现青一块紫一块的情况）
        question_20: "", //(20)您的皮肤一抓就红，并出现抓痕吗?（指被指甲或钝物划过后皮肤的反应）
        question_21: "", //(21)您皮肤或口唇干吗?
        question_22: "", //(22)您有肢体麻木或固定部位疼痛的感觉吗？
        question_23: "", //(23)您面部或鼻部有油腻感或者油亮发光吗?（指脸上或鼻子）
        question_24: "", //(24)您面色或目眶晦黯，或出现褐色斑块/斑点吗?
        question_25: "", //(25)您有皮肤湿疹、疮疖吗？
        question_26: "", //(26)您感到口干咽燥、总想喝水吗？
        question_27: "", //(27)您感到口苦或嘴里有异味吗?（指口苦或口臭）
        question_28: "" //(28)您腹部肥大吗?（指腹部脂肪肥厚）
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
  computed: {
    ...mapGetters("table", ['BaseMesData'])
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
        console.log("edit数据返显", tableConfiguration);
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
      console.log("this.TableForm", this.TableForm);
      console.log("this.chObject", this.chObject);
    }
  },
  watch: {}
};
</script>
