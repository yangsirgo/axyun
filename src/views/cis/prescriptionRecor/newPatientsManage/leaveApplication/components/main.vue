/* eslint-disable no-else-return */
<template>
  <div class="wrapper height100">
    <h3 class="title">门诊病假证明单</h3>
    <div class="flex-box">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item label="临床诊断">
          <el-table border stripe :data="tableData">
            <el-table-column prop="code" label="诊断代码"></el-table-column>
            <el-table-column prop="name" label="诊断名称"></el-table-column>
          </el-table>
        </el-form-item>
        <el-row class="flex-item">
          <el-form-item prop="startDate" label="从">
            <el-date-picker
              v-model="ruleForm.startDate"
              type="date"
              style="width: 140px"
              @change="datepickerStartChange"
              :picker-options="pickerOptionsStart"
              placeholder="开始日期"
            ></el-date-picker>
            <el-select
              v-model="ruleForm.startTime"
              style="width: 90px"
              @change="startTimeChange"
              placeholder="请选择"
            >
              <el-option label="上午" value="0"></el-option>
              <el-option label="下午" value="1"></el-option>
            </el-select> </el-form-item
          >&nbsp;&nbsp;&nbsp;
          <el-form-item prop="endDate" label="至">
            <el-date-picker
              v-model="ruleForm.endDate"
              type="date"
              style="width: 140px"
              @change="datepickerStartChange"
              :picker-options="pickerOptionsEnd"
              placeholder="结束日期"
            ></el-date-picker>
            <el-select
              v-model="ruleForm.endTime"
              style="width: 90px"
              @change="endTimeChange"
              placeholder="请选择"
            >
              <el-option label="上午" value="0"></el-option>
              <el-option label="下午" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item>
          <l-formt-title label="建议休息" style="width: 200px">
            <el-input
              readonly
              v-model="ruleForm.days"
              controls-position="right"
            >
              <span slot="suffix">天</span>
            </el-input>
          </l-formt-title>
        </el-form-item>
        <el-form-item prop="content">
          <l-formt-title label="临床建议" required :isMultiRow="true">
            <el-input
              type="textarea"
              v-model="ruleForm.content"
              maxlength="180"
              :autosize="{ minRows: 6, maxRows: 8 }"
              show-word-limit
            ></el-input>
          </l-formt-title>
        </el-form-item>
        <!--<el-form-item class="bottom-button">-->
        <!--<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
    <div class="bottom-btn">
      <el-button
        type="primary"
        @click="submitForm('ruleForm')"
        class="bottom-button submitBtn fr"
        v-hotKey="{ func: 'func_submit' }"
        >提交（Alt + S）</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getDiaByClinicType } from "@/api/cis/visit/visit";
import { saveSickLeave } from "@/api/cis/order/order";
import { preview, onPreview } from "@/utils/print";
import { deepClone } from "@/utils/index.js";
import { transformCodeList } from "@/api/directive/directiveRequest.js";
import { leaveCardTpl, contentHtml, complierLeave, complierLeaveLogo } from "@/printTemplete/module/leaveCardTpl.js"
import { print } from "@/utils/print_new.js";
import pingAnLogo from "@/assets/companyLogo/luohu.jpg";

const maxDay = 7;
export default {
  name: "index",
  data() {
    return {
      patientData: {},
      saveDisabled: false,
      tableData: [],
      maxDay: maxDay,
      minDay: 0.5,
      formList: [
        {
          label: "临床诊断",
          // prop: 'cDiagnosis',
          type: "table"
        },
        {
          label: "",
          prop: "from",
          type: "time",
          dateList: [
            {
              label: "从",
              prop: "startDate",
              type: "startTime",
              rules: [
                { required: true, message: "请输入时间", trigger: "blur" }
              ]
            },
            {
              label: "至",
              prop: "endDate",
              type: "endTime",
              rules: [
                { required: true, message: "请输入时间", trigger: "blur" }
              ]
            }
          ]
        },
        {
          label: "建议休息",
          prop: "days",
          // rules: [{required: true, message: '请输入时间', trigger: 'blur'}, {validator:function(rule,value,callback){
          //     if(Number (value) == 0 || Number (value) > 7){
          //       callback(new Error("请重新选择起始日期"));
          //     }else{
          //       callback();
          //     }
          //   }, trigger: 'change'}],
          type: "input"
        },
        {
          label: "临床建议",
          prop: "content",
          rules: [
            { required: true, message: "请输入临床建议", trigger: "blur" }
          ],
          type: "textarea"
        }
      ],
      rules: {
        startDate: [{ required: true, message: "请输入时间", trigger: "blur" }],
        endDate: [{ required: true, message: "请输入时间", trigger: "blur" }],
        content: [
          { required: true, message: "请输入临床建议", trigger: "blur" }
        ]
      },
      ruleForm: {
        cDiagnosis: "",
        days: "",
        startDate: "",
        endDate: "",
        startTime: "0",
        endTime: "0",
        content: ""
        // endRadio: '1',
        // startRadio: '0',
        // selectValue: "0"
      },
      pickerOptionsStart: {
        disabledDate: time => {
          // console.log(time.getTime())
          // console.log(new Date(this.patientData.diagTime).getTime())
          if (
            time.getTime() <
            new Date(this.patientData.diagTime).getTime() - 24 * 60 * 60 * 1000
          ) {
            return true;
          }
          if (this.ruleForm.endDate) {
            let isOutMaxDay =
              time.getTime() <
              new Date(this.ruleForm.endDate).getTime() -
                (this.maxDay - 1) * 24 * 60 * 60 * 1000;
            let isOutMinDay =
              time.getTime() > new Date(this.ruleForm.endDate).getTime();
            return isOutMaxDay || isOutMinDay;
          }
          return false;
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (
            time.getTime() <
            new Date(this.patientData.diagTime).getTime() - 24 * 60 * 60 * 1000
          ) {
            return true;
          }
          if (this.ruleForm.startDate) {
            return (
              time.getTime() < new Date(this.ruleForm.startDate).getTime() ||
              time.getTime() >
                new Date(this.ruleForm.startDate).getTime() +
                  (this.maxDay - 1) * 24 * 60 * 60 * 1000
            );
          }
          return false;
        }
      }
    };
  },
  methods: {
    ...mapActions({
      setLeaveAppLoadKey: "cis/setLeaveAppLoadKey"
    }),
    submitForm(formName) {
      if (this.saveDisabled) {
        this.$message.warning("查询主诊断失败!");
        return;
      }
      let leaveData = this.ruleForm;
      let patientItem = this.$store.state.base.receivePatientData; //获取患者信息
      // eslint-disable-next-line complexity
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (
            this.ruleForm.patientId === undefined &&
            patientItem.patientId === ""
          ) {
            this.$message({
              type: "error",
              message: "没有选择任何患者！"
            });
            return;
          }

          //请假天数 的值 必须大于 0
          if (this.ruleForm.days == "0") {
            this.$message({
              type: "error",
              message: "请重新设置请假时间!"
            });
            return;
          }

          //
          if (
            new Date(this.ruleForm.endDate).getTime() <
            new Date(this.ruleForm.startDate).getTime()
          ) {
            this.$message({
              type: "error",
              message: "请填写正确的请假日期!"
            });
            return;
          }

          let res = await saveSickLeave({ ...this.ruleForm });
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: "保存成功!"
            });

            // 清空表单
            this.$set(this, "ruleForm", {
              ...this.ruleForm,
              startDate: "",
              endDate: "",
              startTime: "0",
              endTime: "0",
              content: "",
              days: ""
            });

            // 成功之后刷新右侧工具箱
            // this.setLeaveAppLoadKey(+new Date());
            // 打印病假单(可配置)
            // console.info(this.ruleForm);
          } else {
            this.$message({
              type: "error",
              message: res.message || "保存失败!"
            });
            return;
          }

          let data = {};
          // 数据字典转换, 性别转换
          let mutiMainObj = [
            {
              key: "patientGender",
              code: "GENDER_CODE",
              val: patientItem.patientGender,
              field: "name"
            }
          ];
          let resData = await transformCodeList(mutiMainObj);
          if (resData.code === 1) {
            // console.log(resData);
            data.patientGender = resData.data.patientGender;
          } else {
            this.$message({
              type: "error",
              message: res.message || "保存失败!"
            });
            return;
          }

          data.title = "病假单";
          data.patientName = patientItem.patientName;
          data.doctorName = patientItem.doctorName;
          data.patientAge = patientItem.patientAge;
          // data.patientGender = patientItem.patientGender;
          data.diagName = leaveData.diagName;
          data.createdAtDate = this.dayjs(patientItem.createdAt).format('YYYY年MM月DD日');
          data.days = this.formatDays(leaveData.days);
          data.startDate = this.dayjs(leaveData.startDate).format('YYYY年MM月DD日');
          data.endDate = this.dayjs(leaveData.endDate).format('YYYY年MM月DD日');
          data.nowDate = this.dayjs().format('YYYY年MM月DD日');


          data.content = leaveData.content;
          data.logoSrc = pingAnLogo;
          //临床建议 
          data.suguestContent = leaveData.content;
          data.endTime = leaveData.endTime == "0" ? "上午" : "下午";
          data.startTime = leaveData.startTime == "0" ? "上午" : "下午";

          console.log("临床建议：：：", leaveData.content, data.endTime,  data.startTime);

          // data.logoHtml = logoHtml;

          let { logoStr } = complierLeaveLogo(data);
          data.logoHtml = logoStr;

          let { htmlStr } = complierLeave(data);
          data.contentHtml = htmlStr;
          // console.info("=======data", data);
          // onPreview(data, "病假单");
          print(null, leaveCardTpl, {}, data, false);
        }
      });
    },
    formatDays(num = 0) {
      let reg = /^[1-9]\d*$/; // 非负非0整数
      if (reg.test(num)) {
        return this.numChange(num) + "天";
      } else if (num == "0.5") {
        return "半天";
      }
      let a = parseInt(num);
      return this.numChange(a) + "天半";
    },
    numChange(num) {
      let sCapital = "零壹贰叁肆伍陆柒捌玖";
      if (isNaN(num) || num >= 1000000) return "无效数字！";
      return sCapital.substring(num, num + 1);
    },
    getDiaByClinicType(val) {
      this.tableData = [];
      let params = {
        diagMain: "1",
        visitCode: val.visitCode
      };
      getDiaByClinicType(params)
        .then(res => {
          this.ruleForm.diagName = res.data[0].diagName;
          this.ruleForm.diagCode = res.data[0].diagCode;
          let data = {
            code: res.data[0].diagCode,
            name: res.data[0].diagName
          };
          this.tableData = [];
          this.tableData.push(data);
          this.saveDisabled = false;
        })
        .catch(() => {
          // this.$message({
          //   type: "error",
          //   message: "查询主诊断失败!"
          // });
          this.saveDisabled = true;
        });
    },
    datepickerStartChange(a) {
      if (!a) {
        return;
      }

      this.calcDay();
    },
    datepickerEndChange(a) {
      if (!a) {
        return;
      }
      this.calcDay();
    },
    calcDay() {
      if (this.ruleForm.startDate && this.ruleForm.endDate) {
        let _time =
          new Date(this.ruleForm.endDate).getTime() -
          new Date(this.ruleForm.startDate).getTime();
        this.ruleForm.days = _time / (1000 * 60 * 60 * 24);

        //如果是上午 是 0.5 天 如果下午 是一天
        if (this.ruleForm.endTime === this.ruleForm.startTime) {
          //同为上午 是日期相减 加上 0.5
          //同为下午 是日期相减 加上 0.5
          this.ruleForm.days += 0.5;
        } else {
          // 开始是 上午 结束时是下午日期相减  加上 1天
          if (
            this.ruleForm.startTime === "0" &&
            this.ruleForm.endTime === "1"
          ) {
            this.ruleForm.days += 1;
          }
          // 开始是 下午 结束时是上午 日期相减  加上 0天
        }
      }
    },
    startTimeChange(a) {
      this.calcDay();
    },
    endTimeChange(a) {
      this.calcDay();
    }
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      //深度监听，可监听到对象、数组的变化
      handler(val) {
        if (val.patientId === undefined) {
          return;
        }
        this.patientData = val;
        this.ruleForm.visitCode = val.visitCode;
        this.ruleForm.patientId = val.patientId;
        //console.log("))))))))))))")
        //console.log(JSON.stringify(val))
        this.getDiaByClinicType(val);
        console.log("receivePatientData", val); // 监听 患者 ID 变化 触发事件 reload table 数据
      },
      immediate: true,
      deep: true
    },
    ruleForm: {
      handler(n) {},
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .inline-block {
    white-space: nowrap;
  }
  /deep/.el-card__body {
    overflow: hidden;
    overflow-y: auto !important;
    position: relative;
  }
  .title {
    margin: 16px 0;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: $l-color-fontcolor-3;
  }

  /deep/ .el-form-item {
    margin-bottom: 2px;

    /deep/ .el-form-item {
      display: inline-block;
      margin-bottom: 0px;

      /deep/ .el-date-editor .el-input__inner {
        padding-left: 28px;
      }
    }
  }

  .time-item {
    display: inline-block;
    vertical-align: top;

    /deep/ .el-form-item__label {
      float: unset !important;
    }

    /deep/ .el-form-item__content {
      display: block;

      /deep/ .el-form-item__content {
        display: inline-block;
      }
    }
  }

  .from-item {
    display: inline-block;
    vertical-align: top;
    position: relative;

    /deep/ .el-form-item__content {
      display: block;
      // 从 至 隐藏 必填星
      .el-form-item.is-required:not(.is-no-asterisk)
        > .el-form-item__label:before,
      .el-form-item.is-required:not(.is-no-asterisk)
        .el-form-item__label-wrap
        > .el-form-item__label:before {
        visibility: hidden;
      }

      /deep/ .el-form-item__content {
        display: inline-block;
        .el-select {
          /deep/ .el-input__inner {
            // 修复 el-select 元素在 datepicker 元素 error后也会变成 红色
            border: 1px solid #e4e4e4 !important;
          }
        }
      }
    }
  }

  .suggest-item {
    /* margin-top: 40px; */
  }

  .flex-box {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
  }
  // 将按钮buton 放在 右下侧
  .demo-ruleForm {
    width: 682px;
    margin: auto;
  }

  /*.submitBtn {*/
  /*float: right;*/
  /*}*/

  .bottom-btn {
    border-top: #e4e4e4;
    background-color: transparent;
    text-align: right;
    padding: $l-padding-default-6;
  }
  .flex-item {
    display: flex;
    white-space: nowrap;
    .el-form-item {
      display: flex;
    }
  }
}
</style>
