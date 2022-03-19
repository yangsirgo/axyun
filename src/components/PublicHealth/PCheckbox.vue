<template>
  <div class="PCheckbox" v-if="!dentition">
    <el-checkbox-group v-model="CheckboxList" :max="max">
      <el-checkbox
        v-for="(item, i) in options"
        @change="checkboxChange(i, $event)"
        :label="item.id"
        :key="i"
      >
        {{ item.id }}、{{ item.content }}
        <el-input
          v-if="
            item.content == '其他' ||
              item.content == '其他疾病' ||
              item.content == '其他残疾'
          "
          @input="otherInput(i)"
          :readonly="readonly"
          v-model="otherValue"
        ></el-input>
      </el-checkbox>
    </el-checkbox-group>
    <div class="flex fr">
      <PFormInput class="margin-2" v-for="(v, index) in form" :key="index">
        <!-- <el-form :model="v" :rules="rules" :show-message="false"> -->
        <el-form-item prop="value">
          <el-input
            @input="inputTest(index)"
            :readonly="readonly"
            v-model="v.value"
          ></el-input>
        </el-form-item>
        <!-- </el-form> -->
      </PFormInput>
    </div>
  </div>
  <div class="PCheckbox" v-else>
    <el-checkbox-group
      class="flex"
      style="flex-wrap:wrap;"
      v-model="CheckboxList"
      :max="max"
    >
      <div class="checkboxs" v-for="(item, i) in options" :key="i">
        <div>
          <el-checkbox
            class="pr-10"
            @change="checkboxChange(i, $event)"
            :label="item.id"
            >{{ item.id }}、{{ item.content }}</el-checkbox
          >
        </div>
        <div
          v-if="item.id == '2' || item.id == '3' || item.id == '4'"
          class="inputBoxs"
        >
          <div class="inputBox1">
            <el-input
              @input="toothInput(item.id, 'left_up', item.input.left_up)"
              :readonly="readonly"
              v-model="item.input.left_up"
            ></el-input>
          </div>
          <div class="inputBox2">
            <el-input
              @input="toothInput(item.id, 'right_up', item.input.right_up)"
              :readonly="readonly"
              v-model="item.input.right_up"
            ></el-input>
          </div>
          <div class="inputBox3">
            <el-input
              @input="toothInput(item.id, 'left_down', item.input.left_down)"
              :readonly="readonly"
              v-model="item.input.left_down"
            ></el-input>
          </div>
          <div class="inputBox4">
            <el-input
              @input="toothInput(item.id, 'right_down', item.input.right_down)"
              :readonly="readonly"
              v-model="item.input.right_down"
            ></el-input>
          </div>
        </div>
      </div>
    </el-checkbox-group>
    <div class="flex fr" style="margin-top:-40px">
      <PFormInput class="margin-2" v-for="(v, index) in form" :key="index">
        <!-- <el-form :model="v" :rules="rules" :show-message="false"> -->
        <el-form-item prop="value">
          <el-input
            @input="inputTest(index)"
            :readonly="readonly"
            v-model="v.value"
          ></el-input>
        </el-form-item>
        <!-- </el-form> -->
      </PFormInput>
    </div>
  </div>
</template>

<script>
export default {
  name: "PCheckbox",
  components: {},
  props: {
    formKey: {
      type: String
    },
    otherKey: {
      type: String
    },
    otherData: {
      type: String
    },
    checkboxOptions: {
      type: Array
    },
    checkboxForm: {
      type: Array
    },
    readonly: {
      type: Boolean,
      default: false
    },
    symptom: {
      type: Boolean,
      default: false
    },
    dentition: {
      type: Boolean,
      default: false
    },
    clearFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      max: "",
      CheckboxList: [],
      options: [],
      form: {},
      rules: {
        value: [{ min: 1, max: 2, trigger: "change" }]
      },
      otherValue: "",
      clearFlagdata: ''
    };
  },
  created() {
    console.log("this.checkboxOptions*******", this.checkboxOptions);
    console.log("this.checkboxForm", this.checkboxForm);

    this.options = this.checkboxOptions;
    this.form = this.checkboxForm;
    this.max = this.checkboxForm.length;
    this.checkboxForm.forEach(el => {
      if (el.value != "") {
        this.CheckboxList.push(el.value);
      }
    });
    this.otherValue = this.otherData;
    // this.CheckboxList = this.checkboxForm;
  },
  mounted() {},
  methods: {
    // checkbox change事件
    checkboxChange(i, checked) {
      let tempId = this.options[i].id;
      if (this.symptom) {
        if (tempId == "1" && checked) {
          this.CheckboxList = [];
          this.CheckboxList.push(tempId);
          this.form.forEach(el => {
            el.value = "";
          });
        } else {
          this.CheckboxList.forEach((el, i) => {
            if (el == "1") {
              this.CheckboxList.splice(i, 1);
            }
          });
          this.form.forEach(el => {
            if (el.value == "1") {
              el.value = "";
            }
          });
        }
      }
      if (checked) {
        for (let j = 0; j < this.form.length; j++) {
          const el = this.form[j];
          // //console.log("el", el);
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
      //console.log("this.CheckboxList", this.CheckboxList);
      this.$emit("childValInput", this.form, this.formKey);
    },
    inputTest(index) {
      //  //console.log(
      //   "this.form[index].value",
      //   this.form[index].value
      // );
      let temp = this.form[index].value;
      console.log(temp);
      this.CheckboxList = [];
      this.form.forEach(el => {
        this.options.forEach(item => {
          if (el.value == item.id) {
            this.CheckboxList.push(item.id);
          }
        });
      });
      this.$emit("childValInput", this.form, this.formKey);
    },
    otherInput(index) {
      this.$emit("otherValInput", this.otherValue, this.otherKey);
    },
    toothInput(id, key, val) {
      // //console.log("id", id);
      // //console.log("key", key);
      // //console.log("val", val);
      this.$emit("toothInput", val, key, id);
    },
    handleDeepMessage(val) {
      this.clearFlagdata = this.clearFlag
    console.log("this.form1111111111",this.form)
      this.checkboxForm = val;
      this.form = this.checkboxForm;
      console.log("this.clearFlag",this.clearFlag);
      if(this.clearFlag){
        this.CheckboxList = [];
        this.clearFlag = false;
      }
      console.log("====options====",this.options)
      console.log("this.form2222222222",this.form);
      console.log("this.CheckboxList",this.CheckboxList)

    },
    handleDeepcheckboxOptions(val) {
      this.checkboxOptions = val;
    }
  },
  watch: {
    checkboxForm: {
      handler: "handleDeepMessage",
      deep: true
    },
    checkboxOptions: {
      handler: "handleDeepcheckboxOptions",
      deep: true
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.PCheckbox {
  background: #fff;
  /deep/.el-form-item.is-error .el-input__inner,
  .el-form-item.is-error .el-input__inner:focus,
  .el-form-item.is-error .el-textarea__inner,
  .el-form-item.is-error .el-textarea__inner:focus {
    border-color: #f56c6c;
    border: 1px solid #f56c6c;
  }
  .checkboxs {
    display: flex;
    align-items: center;
    .inputBoxs {
      margin: 5px;
      width: 120px;
      display: flex;
      flex-wrap: wrap;
      /deep/.el-input--medium .el-input__inner {
        height: 30px !important;
        font-size: 14px;
        border: none;
        border-radius: 0;
      }
      .inputBox1 {
        line-height: 10px !important;
        width: 60px;
        // border: 1px solid #000;
        border-right: 1px solid #000;
        border-bottom: 1px solid #000;
      }
      .inputBox2 {
        line-height: 10px !important;
        width: 60px;
        border-left: 1px solid #000;
        border-bottom: 1px solid #000;
        // border-top: 1px solid #000;
      }
      .inputBox3 {
        line-height: 10px !important;
        width: 60px;
        border-top: 1px solid #000;
        border-right: 1px solid #000;
        // border-right: 1px solid #000;
        // border-bottom: 1px solid #000;
      }
      .inputBox4 {
        line-height: 10px !important;
        width: 60px;
        border-left: 1px solid #000;
        border-top: 1px solid #000;
      }
    }
  }
}
</style>
