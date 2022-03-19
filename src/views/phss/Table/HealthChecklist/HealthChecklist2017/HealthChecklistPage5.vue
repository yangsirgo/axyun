<template>
  <div>
    <el-form class="table_form" ref="refForm" :model="TableForm">
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
                  v-model="TableForm.checkup_date555"
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
      </main>
    </el-form>
  </div>
</template>

<script>
import { dateConversion } from "@/utils/common";
export default {
  name: "HealthChecklistPage2",
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
        checkup_date555: "" //体检日期
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
      chObject: {},
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
    if (this.status != "view") {
      this.init();
    }
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
      // this.initInput();
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
 