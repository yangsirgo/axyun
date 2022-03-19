<template>
  <div class="PHealthGuidance" v-if="disease==false">
    <el-checkbox-group v-model="CheckboxList" :max="max">
      <el-checkbox v-for="(item,i) in options" @change="checkboxChange(i,$event)" :label="item.id" :key="i">
        {{item.id}}、{{item.content}}
        <span v-if="item.id == 5">
          （目标
          <el-input style="width:120px" v-if="item.id>4" @input="otherInput(item.key,item.value)" :readonly="readonly"
            v-model="item.value"></el-input>kg）
        </span>
        <span v-else>
          <el-input style="width:120px" v-if="item.id>4" @input="otherInput(item.key,item.value)" :readonly="readonly"
            v-model="item.value"></el-input>
        </span>
      </el-checkbox>
    </el-checkbox-group>
    <div class="flex_c fr">
      <div style="margin-top:-3px">危险因素控制：</div>
      <PFormInput class="margin-2" v-for="(v,index) in form" :key="index">
        <el-form-item prop="value">
          <el-input @input="inputTest(index)" :readonly="readonly" v-model="v.value"></el-input>
        </el-form-item>
      </PFormInput>
    </div>
  </div>
  <div class="PHealthGuidance" v-else>
    <el-checkbox-group v-model="CheckboxList" :max="max">
      <el-checkbox v-for="(item,i) in options" @change="checkboxChange(i,$event)" :label="item.id" :key="i">
        {{item.id}}、{{item.content}}
        <span>
          <el-input style="width:120px" v-if="item.id==6||item.id==12||item.id==13" @input="otherInput(item.key,item.value)"
            :readonly="readonly" v-model="item.value"></el-input>
        </span>
      </el-checkbox>
    </el-checkbox-group>
    <div class="flex_c flex_wrap fl" v-for="(v,index) in form" :key="index">
      <PFormInput class="margin-10">
        <el-form-item prop="value">
          <el-input @input="inputTest(index)" :readonly="readonly" v-model="v.value"></el-input>
        </el-form-item>
      </PFormInput>
      <span class="flex_c">
        <div class="w80">确诊时间：</div>
        <el-input class="w120" @input="inputTest(index,'date')" :readonly="readonly" v-model="v.date"></el-input>
      </span>
    </div>
  </div>
</template>

<script>
  import {
    dateConversion
  } from "@/utils/common";
  export default {
    name: "PHealthGuidance",
    components: {},
    props: {
      disease: {
        type: Boolean,
        default: false
      },
      formKey: {
        type: String
      },
      otherKey: {
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
          value: [{
            min: 1,
            max: 2,
            trigger: "change"
          }]
        },
        otherValue: "",
        clearFlagdata: ''
      };
    },
    created() {
      //console.log("this.checkboxOptions", this.checkboxOptions);
      //console.log("this.checkboxForm", this.checkboxForm);
      this.options = this.checkboxOptions;
      this.form = this.checkboxForm;
      this.max = this.checkboxForm.length;
      this.checkboxForm.forEach(el => {
        if (el.value != "") {
          this.CheckboxList.push(el.value);
        }
      });
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
        this.$emit("childValInput", this.form);
      },
      inputTest(index, date) {
        //  //console.log(
        //   "this.form[index].value",
        //   this.form[index].value
        // );
        if (date == "date") {
          //console.log("index", index);
        }
        let temp = this.form[index].value;
        console.log(temp)
        this.CheckboxList = [];
        this.form.forEach(el => {
          this.options.forEach(item => {
            if (el.value == item.id) {
              this.CheckboxList.push(item.id);
            }
          });
        });
        //console.log("this.form", this.form);
        this.form.forEach(el => {
          if (el.date.length == 8) {
            el.date = dateConversion(el.date);
          }
        });
        this.$emit("childValInput", this.form, this.formKey);
      },
      otherInput(key, val) {
        this.$emit("otherInput", key, val);
      },
      handleDeepMessage(val) {
        this.clearFlagdata = this.clearFlag
        if (this.clearFlag) {
          this.CheckboxList = [];
          this.clearFlag = false;
        }
      }
    },
    watch: {
      checkboxForm: {
        handler: "handleDeepMessage",
        deep: true
      }
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
  .PHealthGuidance {
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
