<template>
  <div class="page">
    <el-dialog
      :visible.sync="visible"
      title="病种选择"
      width="30%"
      :close-on-click-modal="false"
      center
      :before-close="OnClose"
    >
      <div class="alertBody">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="0"
          class="demo-ruleForm"
        >
          <div>
            <p>{{ tipText }}</p>
            <span>就诊类别：</span>
            <el-radio-group v-model="radio">
              <el-radio
                @change="changeRadio"
                v-for="item in visitType"
                :label="item.diseaseType"
                :key="item.diseaseType"
              >{{ item.diseaseTypeLabel }}</el-radio>
            </el-radio-group>
          </div>
          <div v-if="radio == '1' && options.length > 0">
            <el-form-item
              label=""
              prop="selectValue"
            >
              <LFormtTitle label="病种名称" class="diseaseName">
                <!-- <l-value-domain
                  :remoteUrl="'/finance-si/si-pub-one-stop-biz/patient-info/' + visitCode"
                  :remoteParams="{'emrNum': visitCode}"
                  :value.sync="selectValue"
                  placeholder="选择病种名称"
                  remoteShowKey="id"
                  multiple
                  remoteValueKey="name"
                  clearable
                /> -->
                <el-select
                  v-model="ruleForm.selectValue"
                  placeholder="选择病种名称"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.chronicDisease"
                    :label="item.chronicDiseaseName"
                    :value="item.chronicDisease"
                  >
                  </el-option>
                </el-select>
              </LFormtTitle>
            </el-form-item>

          </div>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="OnClose">取 消</el-button>
        <el-button
          type="primary"
          @click="isOkWrapper"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { patientInfo } from "@/api/cis/order/order.js";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    tipText: {
      type: String,
      default: ""
    },
    visitCode: {
      type: String
    },
    info:{}
  },
  data() {
    return {
      visible: false,
      radio: "0",
      remoteParams: {
        emrNum: this.visitCode
      },
      ruleForm: {
        selectValue: ""
      },
      selectItem:"",
      visitType: [
        {
          diseaseTypeLabel: "普通门诊",
          diseaseType: "0"
        },
        {
          diseaseTypeLabel: "慢病",
          diseaseType: "1"
        },
        {
          diseaseTypeLabel: "特病",
          diseaseType: "2"
        }
      ],
      options: [
        {
          chronicDisease: "01",
          chronicDiseaseName: "高血压"
        },
        {
          chronicDisease: "02",
          chronicDiseaseName: "糖尿病"
        }
      ],
      rules: {
        selectValue: [
          { required: true, message: "请选择病种名称", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.isOk();
    // this.getPatientInfo ();
  },
  components: {},
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      immediate: true,
      deep: true,
      // eslint-disable-next-line complexity
      async handler(val, old) {
        // console.log("请求接口");
        // this.getPatientInfo ();
      }
    },
    show: {
      immediate: true,
      handler(show) {
        this.visible = this.show;
      }
    },
    info (val){
      console.log("val2", val);
      // 病种选择赋值
      let { chronicDisease, diseaseType } = val;
      this.radio = diseaseType;
      this.ruleForm.selectValue = chronicDisease || "";
      // 整理数据
      let selectRadio = this.orgnazationData();
      //数据显示到界面
      this.setShowText(selectRadio);
    }
  },
  methods: {
    async getPatientInfo (){
      let { visitCode } = this.receivePatientData;

      try {
        let { data,code,msg } = await patientInfo(visitCode);
        if(code == 1) {
          let { siPatientDto } = data;
          let { hypertensionFlag, diabetesFlag } = siPatientDto;
          // hypertensionFlag 高血压标识
          // diabetesFlag 糖尿病标识

          // 若有值 可显示
          // 若无 不显示
          if (hypertensionFlag == "" || hypertensionFlag == null || hypertensionFlag == undefined) {
            this.options = this.options.filter((item)=>{
              return item.chronicDiseaseName !== "高血压";
            })
          }

          if (diabetesFlag == "" || diabetesFlag == null || diabetesFlag == undefined) {
            this.options = this.options.filter((item)=>{
              return item.chronicDiseaseName !== "糖尿病";
            })
          }
        } else {
          this.$message.error(msg || "病种名称接口获取错误");
        }
      } catch (error) {
        this.$message.error("病种名称接口获取错误");
      }
    },
    changeRadio (){
      // this.ruleForm.selectValue = "";
    },
    OnClose() {
      this.$emit("update:show", false);
    },
    isOkWrapper() {
      // if (this.radio == 1 && this.ruleForm.selectValue == "") {
      //   this.$message.error("请选择病种名称");
      //   return;
      // }
      // if (this.radio == 1) {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.isOk();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      // } else {
      //   this.isOk();
      // }
    },
    orgnazationData (){
      let selectRadio = this.visitType.find(item => {
        return this.radio == item.diseaseType;
      });

      if (this.ruleForm.selectValue != "") {
        let selectValueItem = this.options.find(item => {
          return this.ruleForm.selectValue == item.chronicDisease;
        });
        selectRadio = {
          ...selectRadio,
          ...selectValueItem
        }
      }
      console.log("selectRadio", selectRadio);
      return selectRadio;
    },
    isOk() {
      let selectRadio = this.orgnazationData();
      this.$emit("isOk", selectRadio);
    },
    setShowText (data){
      let selectRadio = this.orgnazationData();
      this.$emit("setShowText", selectRadio);
    }
  }
};
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}

.alertBody .diseaseName {
  margin: 10px 0;
}
</style>
