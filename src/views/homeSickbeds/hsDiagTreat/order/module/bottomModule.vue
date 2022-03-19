<template>
  <div class="bottomModule">
    <el-row :gutter="20" class="type">
      <el-col :span="5">
        <LFormtTitle label="医嘱类型">
          <el-select
            v-model="type"
            class="width100"
            placeholder="请选择"
            @change="selectChange"
          >
            <el-option label="饮食" value="1"> </el-option>
            <el-option label="护理" value="2"> </el-option>
          </el-select>
        </LFormtTitle>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="5" v-if="type === '1'">
        <LFormtTitle label="饮食级别" :required="true">
          <l-value-domain
            code="food"
            remoteShowKey="name"
            remoteValueKey="code"
            :value.sync="selectDrop.ruleForm.food"
            placeholder="请选择"
            @change="foodChange"
          ></l-value-domain>
        </LFormtTitle>
      </el-col>
      <el-col :span="5" v-show="type === '2'">
        <LFormtTitle label="护理级别" :required="true">
          <l-value-domain
            code="nursingLevel"
            remoteShowKey="name"
            remoteValueKey="code"
            :value.sync="selectDrop.ruleForm.nursingLevel"
            placeholder="请选择"
            @change="nursingLevelChange"
          ></l-value-domain>
        </LFormtTitle>
      </el-col>
      <el-col :span="5">
        <LFormtTitle label="开始日期" :required="true">
          <el-date-picker
            v-model="selectDrop.ruleForm.adviceTime"
            type="datetime"
            prefix-icon="aaa"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          ></el-date-picker>
        </LFormtTitle>
      </el-col>
      <el-col :span="5">
        <LFormtTitle label="停止日期">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="selectDrop.ruleForm.stopDoctorTime"
            type="datetime"
            prefix-icon="aaa"
            placeholder="选择日期"
          ></el-date-picker>
        </LFormtTitle>
      </el-col>
    </el-row>
    <el-row class="button-cont">
      <el-button type="primary" class="float-right" @click="save('ruleForm')"
        >保存</el-button
      >
    </el-row>
  </div>
</template>

<script>
import {
  getRecipeNo,
  saveOrders,
  getFirstDayCount
} from "@/api/cis/order/order";
import { temporary, getAdviceItem } from "@/api/cis/resident/residentAdvice";
import { mapActions, mapGetters } from "vuex";
import { get } from "@/utils/request";
export default {
  name: "bottomModule",
  props: ["row", "radioValue"],
  data() {
    return {
      radioType: "1", // 医嘱状态
      currentRowData: this.row,
      patientId: "",
      type: "1",

      selectDrop: {
        drugItem: {}, // 选中医嘱信息

        ruleForm: {
          prn: "",
          sos: "",
          takeMedicine: "0",
          firstDayCount: "",
          patientId: "",
          inpCode: "",
          bedNo: "",
          name: "",
          code: "",
          dataVersion: "",
          categoryCode: "",
          adviceId: "",
          uses: "", //用法
          adviceTime: new Date().format("yyyy-MM-dd hh:mm:ss"), //医嘱起始日期
          stopDoctorTime: "", //医嘱结束日期
          execDeptName: "", //执行科室
          basicDosage: "", //数量
          frequency: "", //频率
          normalDate: "", //常规时间
          basicDosageUnit: "", //单位
          onceDosage: undefined, //单次计量七叶皂苷钠注射液
          remark: "", //备注
          skinTest: "0", //皮试
          isUrgent: "0", //紧急
          isOneself: "0", //自备
          dropRate: undefined, //滴速
          adviceType: "19",
          entrust: "",
          status: "",
          originId: "0",
          dosageUnit: "",
          unit: "",
          packUnit: "",
          unitSaleFlg: "",
          halfUseFlg: "",
          dosageValue: "",
          food: "",
          nursingLevel: ""
        },
        rules: {
          frequency: [
            { required: true, message: "请选择频次", trigger: "blur" }
          ],

          adviceTime: [
            { required: true, message: "请填写医嘱起始日期", trigger: "blur" }
          ],

          remark: [
            // {required: false, message: '请选择数量', trigger: 'blur'}
          ]
        },

        selectOptions: []
      }
    };
  },
  methods: {
    ...mapActions({
      changeCurrentRow: "cis/changeCurrentRow"
    }),
    getRadioType() {
      this.$root.eventHub.$on("radioType", res => {
        this.radioType = res;
      });
    },
    //切换医嘱类型
    selectChange() {
      for (let i in this.form) {
        this.form[i] = "";
      }
    },
    resetAll() {},
    //切换护理级别
    nursingLevelChange(value, obj) {
      this.selectDrop.ruleForm.name = obj.name;
      this.selectDrop.ruleForm.code = value;
    },
    //切换饮食级别
    foodChange(value, obj) {
      this.selectDrop.ruleForm.name = obj.name;
      this.selectDrop.ruleForm.code = value;
    },
    //保存
    save() {
      this.selectDrop.ruleForm.categoryCode = this.radioValue;
      if (!this.receivePatientData.patientId) {
        this.$message.error("请选择患者！");
        return;
      }
      let form = this.selectDrop.ruleForm;
      temporary(form).then(res => {
        if (res.code === 1) {
          this.$message.success(res.msg ? res.msg : "医嘱暂存成功");
          this.resetAll();
          // save btn 存储 数据
          this.$emit("save");
        } else {
          this.$message.error(res.msg ? res.msg : "医嘱暂存失败");
        }
      });
    }
  },
  computed: {
    ...mapGetters("homeSickbeds", ["receivePatientData"])
  },
  watch: {
    radioValue: {
      immediate: true,
      handler(c) {
        this.resetAll();
      }
    },
    receivePatientData: {
      handler(c) {
        this.patientName = c.patientName;
        this.patientId = c.patientId;
        this.selectDrop.ruleForm.patientId = c.patientId;
        this.selectDrop.ruleForm.bedNo = c.bedCode;
        this.selectDrop.ruleForm.inpCode = c.inpCode;
        this.bedNo = c.bedCode;
        this.inpCode = c.inpCode;
        this.wardId = c.wardId;
      },
      immediate: true,
      deep: true //深度监听
    },
    row: {
      handler(c) {
        console.log(c);
        this.selectDrop.displayList.forEach(item => {
          if (c[item.prop] !== undefined) {
            item.value = c[item.prop];
          }
        });
        this.selectDrop.ruleForm.dataVersion = c.dataVersion;
        this.selectDrop.ruleForm.uses = c.uses;
        this.selectDrop.ruleForm.frequency = c.frequency;
        this.selectDrop.ruleForm.remark = c.remark;
        this.selectDrop.ruleForm.onceDosage = c.onceDosage;
        this.selectDrop.ruleForm.adviceTime = c.adviceTimes;
        this.selectDrop.ruleForm.adviceId = c.adviceId;
        this.selectDrop.ruleForm.patientId = c.patientId;
        this.selectDrop.ruleForm.basicDosageUnit = c.basicDosageUnit;
        this.selectDrop.ruleForm.basicDosage = c.basicDosage;
        this.selectDrop.ruleForm.stopDoctorTime = c.stopDoctorTime;
        this.selectDrop.ruleForm.normalDate = c.normalDate;
        this.selectDrop.ruleForm.entrust = c.entrust;
        this.selectDrop.ruleForm.status = c.status;
        this.selectDrop.ruleForm.skinTest = c.skinTest;
        this.selectDrop.ruleForm.isUrgent = c.isUrgent;
        this.selectDrop.ruleForm.isOneself = c.isOneself;
        this.selectDrop.ruleForm.dropRate = c.dropRate;
        this.selectDrop.ruleForm.dosageUnit = c.dosageUnit;
        this.selectDrop.ruleForm.unit = c.unit;
        this.selectDrop.ruleForm.packUnit = c.packUnit;
        this.selectDrop.ruleForm.dosageValue = c.dosageValue;
        this.selectDrop.ruleForm.unitSaleFlg = c.unitSaleFlg;
        this.selectDrop.ruleForm.firstDayCount = c.firstDayCount;
        this.selectDrop.ruleForm.takeMedicine = c.takeMedicine;
        this.selectDrop.ruleForm.sos = c.sos;
        this.selectDrop.ruleForm.prn = c.prn;
        this.currentRowData = c;
      },
      deep: true //深度监听
    }
  },
  mounted() {
    this.getRadioType();
  },
  beforeDestroy() {
    this.$root.eventHub.$off("radioType");
  }
};
</script>

<style scoped lang="scss">
.bottomModule {
  height: 100%;
  overflow: auto;

  .type {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid $l-color-bgcolor-11;
  }

  .button-cont {
    margin: 20px 0 10px 0;
    padding-right: 10px;
  }
}
</style>
