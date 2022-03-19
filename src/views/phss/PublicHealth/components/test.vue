<template>
  <div>
    <div class="test">
      <el-checkbox-group v-model="CheckboxList" :max="max">
        <el-checkbox
          v-for="(item,i) in options"
          @change="checkboxChange(i,$event)"
          :label="item.id"
          :key="i"
        >{{item.id}}、{{item.content}}</el-checkbox>
      </el-checkbox-group>
      <div class="flex fr">
        <PFormInput class="margin-2" v-for="(v,index) in form" :key="index">
          <el-form :model="v" :rules="rules" :show-message="false">
            <el-form-item prop="value">
              <el-input @input="inputTest(index)" v-model="v.value"></el-input>
            </el-form-item>
          </el-form>
        </PFormInput>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "test",
  components: {},
  props: {},
  data() {
    return {
      max: "",
      readonly: true,
      temp: "",
      CheckboxList: [],
      options: [],
      form: {},
      symptomCheckboxList: [],
      EatingHabitsCheckboxList: [],
      DrinkingTypesCheckboxList: [],
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
        { value: "", ref: "symptom1" },
        { value: "", ref: "symptom2" },
        { value: "", ref: "symptom3" },
        { value: "", ref: "symptom4" },
        { value: "", ref: "symptom5" },
        { value: "", ref: "symptom6" },
        { value: "", ref: "symptom7" },
        { value: "", ref: "symptom8" },
        { value: "", ref: "symptom9" },
        { value: "", ref: "symptom10" }
      ],
      EatingHabitsForm: [
        { value: "", ref: "EatingHabits1" },
        { value: "", ref: "EatingHabits2" },
        { value: "", ref: "EatingHabits3" },
        { value: "", ref: "EatingHabits4" }
      ],
      DrinkingTypesForm: [
        { value: "", ref: "DrinkingTypes1" },
        { value: "", ref: "DrinkingTypes2" },
        { value: "", ref: "DrinkingTypes3" },
        { value: "", ref: "DrinkingTypes" },
        { value: "", ref: "DrinkingTypes5" }
      ],
      rules: {
        value: [{ min: 1, max: 2, trigger: "change" }]
      }
    };
  },
  created() {
    this.options = this.EatingHabitsOptions;
    this.form = this.EatingHabitsForm;
    this.max = this.EatingHabitsForm.length;
  },
  mounted() {},
  methods: {
    // checkbox change事件
    checkboxChange(i, checked) {
      let tempId = this.symptomOptions[i].id;
      // if (tempId == "1" && checked) {
      //   this.CheckboxList = [];
      //   this.CheckboxList.push(tempId);
      //   this.form.forEach(el => {
      //     el.value = "";
      //   });
      // } else {
      //   this.CheckboxList.forEach((el, i) => {
      //     if (el == "1") {
      //       this.CheckboxList.splice(i, 1);
      //     }
      //   });
      //   this.form.forEach(el => {
      //     if (el.value == "1") {
      //       el.value = "";
      //     }
      //   });
      // }
      if (checked) {
        for (let j = 0; j < this.form.length; j++) {
          const el = this.form[j];
          // console.log("el", el);
          if (el.value == "") {
            el.value = tempId;
            break;
          }
        }
      } else {
        this.form.forEach(el => {
          if (el.value == tempId) {
            el.value = "";
          }
        });
      }
    },
    inputTest(index) {
      //  console.log(
      //   "this.form[index].value",
      //   this.form[index].value
      // );
      let temp = this.form[index].value;
      this.CheckboxList = [];
      this.form.forEach(el => {
        this.symptomOptions.forEach(item => {
          if (el.value == item.id) {
            this.CheckboxList.push(item.id);
          }
        });
      });
    }
  },
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
.test {
  background: #fff;
  /deep/.el-form-item.is-error .el-input__inner,
  .el-form-item.is-error .el-input__inner:focus,
  .el-form-item.is-error .el-textarea__inner,
  .el-form-item.is-error .el-textarea__inner:focus {
    border-color: #f56c6c;
    border: 1px solid #f56c6c;
  }
}
</style>