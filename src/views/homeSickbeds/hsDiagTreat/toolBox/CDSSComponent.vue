<template>
  <div>
    <div v-if="state" class="assistwrap" id="assistwrap"></div>
    <div v-else>
      <el-alert title="请选择患者" type="error" effect="dark" :closable="false">
      </el-alert>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  getPamars,
  getToken,
  getRoles,
  getRole,
  getUserName,
  getUserId
} from "@/utils/auth";
import Base64 from "@/utils/base64.js";
import { PACdss } from "./luohu_cdss.js";
import { listDrugHistroy } from "@/api/CDSS/index.js";
export default {
  data() {
    return {
      cdss: null,
      state: false,
      time: null,
      baseInfo: {}
    };
  },
  mounted() {
    if (this.receivePatientData.patientId) {
      this.state = true;
      $("body>[class^='cdss-']").remove();
      this.$nextTick(() => {
        setTimeout(() => {
          this.csddInit();
        }, 500);
      });
    } else {
      this.state = false;
    }
  },
  computed: {
    ...mapGetters("cdss", [
      "size",
      "testList",
      "checkList",
      "diagnosisList",
      "drugConflictList",
      "tabName",
      "mainComplaint",
      "hisPresent"
    ]),
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    // 主诉
    mainComplaint(newValue, oldValue) {
      console.log(`mainComplaint----`, newValue);
      this.setRecommendInput();
    },
    // 主诉
    hisPresent(newValue, oldValue) {
      console.log(`hisPresent----`, newValue);
      this.setRecommendInput();
    },
    // 检验
    testList(newValue, oldValue) {
      console.log(`testList----`, newValue);
      this.CheckTestReport(newValue, 0);
    },
    // 检查
    checkList(newValue, oldValue) {
      console.log(`checkList----`, newValue);
      this.CheckTestReport(newValue, 1);
    },
    // 诊断
    diagnosisList(newValue, oldValue) {
      console.log(`诊断数据diagnosisList----`, newValue);
      if (this.tabName === "order") {
        this.checkDiseaseSupport([]);
        this.drugConflict(this.drugConflictList);
      } else {
        this.checkDiseaseSupport(newValue);
      }
    },
    // 处方
    drugConflictList(newValue, oldValue) {
      console.log(`处方数据drugConflictList----`, newValue);
      this.drugConflict(newValue);
    },
    receivePatientData(newValue, oldValue) {
      console.log(
        `CDSSComponent --- 患者详细信息`,
        JSON.parse(JSON.stringify(newValue))
      );
      if (newValue.patientId !== oldValue.patientId) {
        this.init();
      }
    }
  },
  methods: {
    ...mapActions("cdss", ["clearCDSSData"]),
    init() {
      const temp = Object.keys(this.receivePatientData);
      if (this.receivePatientData.patientId) {
        $("body>[class^='cdss-']").remove();
        setTimeout(() => {
          this.csddInit();
        }, 500);
        this.state = true;
      } else {
        this.state = false;
      }
    },
    csddInit() {
      if (window.destoryCdss) {
        console.log(`window.destoryCdss`, window.destoryCdss);
        window.destoryCdss();
      }
      this.baseInfo = {};
      this.cdss = null;
      console.group("CDSS 初始化逻辑 ---");
      let params = JSON.parse(getPamars());
      let role = JSON.parse(getRole());
      console.log(`role`, role);
      console.log(`params`, params)
      // CSDD 所需参数
      let info = {
        channelId: process.env.VUE_APP_CDSS_CHANNELID
          ? process.env.VUE_APP_CDSS_CHANNELID
          : // "0001040000", // 分配的接入渠道号
            "0001270000", // 分配的接入渠道号
        institutionId: process.env.VUE_APP_CDSS_INSTITUTIONID
          ? process.env.VUE_APP_CDSS_INSTITUTIONID
          : // "0021210100002460000000", // 分配的接入机构号
            "0044440300007630000000", // 分配的接入机构号
        hospitalId: params.hosIdNum, //医院 ID
        hospitalName: params.hosName, //医院名称
        hospitalCode: "SHSRMYY-1", //组织结构代码
        belongCity: process.env.VUE_APP_CDSS_BELONGCITY
          ? process.env.VUE_APP_CDSS_BELONGCITY
          : "深圳", // 所在城市
        physicianId: getUserId(), //医生 ID
        physicianName: Base64.decode(getUserName()), // 医生姓名
        patientId: this.receivePatientData.patientId, //患者唯一标识
        name: this.receivePatientData.patientName, //患者姓名
        outerSerialNo: this.receivePatientData.appointmentId, // 外部流水号
        age: this.receivePatientData.age, // 患者年龄
        gender:
          this.receivePatientData.patientGender == "1"
            ? "男"
            : this.receivePatientData.patientGender == "2"
            ? "女"
            : "未知",
        hospitalDepartment: role.deptName, // 科室
        renwei: false, // 是否启用人卫插件，没有该字段或者false就不启用人卫插件
        local: false, // 是否启用本地化部署(不能连外网),没有该字段或者false不启用,默认否,若启用去掉askbob服务
        nodruginfo: false, //是否显示精准用药推荐药品的厂商和规格信息，默认显示。无参数或者false显示，true不显示
        infection: false, //传染病开关，默认关闭，true时CDSS sdk提供传染病相关功能，没有该字段或者false则无传染病上报功能
        test: true, //诊断列表检验检查开关，true时SDK智能辅助诊断列表疾病下方有检验和检查，没有该字段或者false则无检验检查功能
        drugRecScale: 0, //公式量表和精准治疗开关，默认全部打开，没有该字段全部打开，0:公式量表+精准治疗，1:只有公式量表，2.只有精准治疗
        popMode: 1, //弹窗模式 0:全屏+浮窗+悬浮球；1:全屏+悬浮球,2:全屏
        RecScale: true,
        writeBackName: "现病史",
        departmentNameList: [],
        alwaysAddIcon: true, // 是否 总是显示 常用处方 常用药物回写按钮
        tabShow: 0 // 0 : 辅助诊疗和预警提示 1:辅助诊疗  2: 预警提示
      };
      console.group("CSDD 所需参数 *** ");
      var userInfo = {
        channelId: "0001270000", //请求头部渠道号
        institutionId: "0044440300007630000000", //请求头部机构号
        // channelId: "0001040001", //请求头部渠道号
        // institutionId: "0021210100002460000001", //请求头部机构号
        hospitalId: "001", //甘肃医院号
        hospitalName: "上海市人民医院", //医院名称
        hospitalCode: "SHSRMYY-1", //组织结构代码
        belongCity: "深圳市",
        physicianId: "D123456",
        physicianName: "张医生",
        patientId: this.receivePatientData.patientId, //患者唯一标识
        name: this.receivePatientData.patientName, //患者姓名
        outerSerialNo: "123123123",
        gender:
          this.receivePatientData.patientGender == "1"
            ? "男"
            : this.receivePatientData.patientGender == "2"
            ? "女"
            : "未知",
        age: this.receivePatientData.age, // 患者年龄
        hospitalDepartment: role.deptName, // 科室
        renwei: false, // 是否启用人卫插件，没有该字段或者false就不启用人卫插件
        local: false, // 是否启用本地化部署(不能连外网),没有该字段或者false不启用,默认否,若启用去掉askbob服务
        nodruginfo: false, //是否显示精准用药推荐药品的厂商和规格信息，默认显示。无参数或者false显示，true不显示
        infection: false, //传染病开关，默认关闭，true时CDSS sdk提供传染病相关功能，没有该字段或者false则无传染病上报功能
        test: true, //诊断列表检验检查开关，true时SDK智能辅助诊断列表疾病下方有检验和检查，没有该字段或者false则无检验检查功能
        drugRecScale: 0, //公式量表和精准治疗开关，默认全部打开，没有该字段全部打开，0:公式量表+精准治疗，1:只有公式量表，2.只有精准治疗
        popMode: 1, //弹窗模式 0:全屏+浮窗+悬浮球；1:全屏+悬浮球,2:全屏
        RecScale: true,
        writeBackName: "现病史",
        departmentNameList: [],
        alwaysAddIcon: true, // 是否 总是显示 常用处方 常用药物回写按钮
        tabShow: 0 // 0 : 辅助诊疗和预警提示 1:辅助诊疗  2: 预警提示
      };
      // console.log(`info`, JSON.parse(JSON.stringify(userInfo)));
      // console.log(`info`, JSON.parse(JSON.stringify(info)));
      // console.log("info json", JSON.stringify(info));
      if (process.env.VUE_APP_CDSS_CHANNELID === "0000340000") {
        this.cdss = new PACdss(userInfo);
      } else {
        console.log("生产环境----------", JSON.parse(JSON.stringify(info)));
        this.baseInfo = info;
        this.cdss = new PACdss(info);
      }
      console.log(`this.cdss`, this.cdss);
      console.log(`this.mainComplaint`, this.mainComplaint);
      // 注入dom
      this.cdss.createAssistPanel(
        "#assist-input",
        "#hisPresent-input",
        "#assistwrap"
      );
      console.log("CDSS初始化完成 ------");
      console.groupEnd();
      // 业务逻辑判断
      this.$nextTick(() => {
        this.timeFun(0);
      });
    },
    timeFun(num) {
      console.log(`num`, num);
      if (num >= 10) {
        return;
      }
      if ($(".cdss-diagnosis-wrap").length > 0) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.logicInit();
          }, 1000);
        });
      } else {
        setTimeout(() => {
          this.timeFun(num + 1);
        }, 500);
      }
    },
    logicInit() {
      console.log(`业务逻辑判断-----`);
      // 电子申请
      if (this.tabName === "electronApply") {
        // 检验检查
        this.checkDiseaseSupport(this.diagnosisList);
        this.CheckTestReport(this.testList);
        // this.CheckTestReport(this.checkList, 1);
      }
      // 电子处方
      else if (this.tabName === "order") {
        this.drugConflict(this.drugConflictList);
        this.checkDiseaseSupport(this.diagnosisList);
      } else {
        if (this.mainComplaint !== "" && this.mainComplaint !== undefined) {
          this.setRecommendInput();
        }
        this.checkDiseaseSupport(this.diagnosisList);
      }
    },
    // 检验检查
    async CheckTestReport() {
      console.log("CheckTestReport 检验检查逻辑 ---- ");
      console.log(`this.testList`, this.testList);
      console.log(`this.checkList`, this.checkList);
      try {
        const res = await listDrugHistroy(this.receivePatientData.patientId);
        let arrjson = [];
        let instructions = [];
        this.testList.forEach(el => {
          arrjson.push({
            name: el.itemName,
            type: 0
          });
          instructions.push({
            keyword: el.itemName,
            type: "check"
          });
        });
        this.checkList.forEach(el => {
          arrjson.push({
            name: el[0].catalogName,
            type: 0
          });
          instructions.push({
            keyword: el[0].catalogName,
            type: "check"
          });
        });
        let drugs = res.data;
        console.log(`arrjson`, arrjson);
        // let arrjson = [
        //   {
        //     name: "神经系统细胞学检查", // 辅助检查项的名称
        //     type: 1 // 辅助检查的类型（0:检验 1:检查,默认
        //   }
        // ];
        // let drugs = ["华法林钠片"]; // 用药史
        console.log(`instructions`, instructions);
        console.log(`arrjson`, arrjson);
        this.cdss.getInstructions(instructions);
        this.cdss.checkDiseaseSupport(this.diagnosisList);
        this.cdss.checkTestReport(arrjson, drugs);
      } catch (err) {
        console.error("err", err);
      }
    },
    // 诊断
    checkDiseaseSupport(arr) {
      console.log("诊断数据 --- ");
      console.log(`arr----`, arr);
      this.cdss.diagnosisListToDetail(arr, false);
    },
    // 处方合理用药
    drugConflict(arr) {
      console.log(`处方合理用药-----`, JSON.parse(JSON.stringify(arr)));
      let drugItems = [];
      let instructions = [];
      arr.forEach(el => {
        if (el.orderItemName !== "") {
          drugItems.push({
            commonName: el.orderItemName
          });
          instructions.push({
            keyword: el.orderItemName,
            type: "drug" // 类型
          });
        }
      });
      // if (drugItems.length === 0) {
      //   return;
      // }
      let diseases = [];
      this.diagnosisList.length &&
        this.diagnosisList.forEach(el => {
          diseases.push({
            diseaseName: el
          });
        });
      let params = JSON.parse(getPamars());
      let drugAndProfile = {
        // 1 男 2  女
        gender:
          this.receivePatientData.patientGender == "1"
            ? "男"
            : this.receivePatientData.patientGender == "2"
            ? "女"
            : "未知",
        age: "" + this.receivePatientData.age,
        hospitalId: params.hosIdNum, //医院 ID
        hospitalName: params.hosName, //医院名称
        belongCity: process.env.VUE_APP_CDSS_BELONGCITY
          ? process.env.VUE_APP_CDSS_BELONGCITY
          : "深圳", // 所在城市
        physicianId: getUserId(), //医生 ID
        physicianName: Base64.decode(getUserName()), // 医生姓名
        patientId: this.receivePatientData.patientId,
        name: this.receivePatientData.patientName,
        outerSerialNo: this.receivePatientData.appointmentId, // 外部流水号
        disease: this.diagnosisList,
        // disease: [],
        request: {
          diseases: diseases,
          drugItems: drugItems,
          patientInfo: {
            // 1 男 0 女
            gender:
              this.receivePatientData.patientGender == "1"
                ? "男"
                : this.receivePatientData.patientGender == "2"
                ? "女"
                : "未知",
            month: 12 * this.receivePatientData.age,
            weight: 40
          }
        }
      };
      console.log(`drugAndProfile`, JSON.stringify(drugAndProfile));
      console.log(JSON.parse(JSON.stringify(drugAndProfile)));
      if (instructions.length !== 0) {
        console.log(`getInstructions---`, instructions);
      }
      this.cdss.getInstructions(instructions);
      this.cdss.checkDiseaseSupport(this.diagnosisList);
      this.cdss.drugConflict(drugAndProfile);
    },
    // 主诉 现病史
    setRecommendInput() {
      console.log(`setRecommendInput---`);
      let patientInfo = {
        ...this.baseInfo,
        mainComplaint: this.mainComplaint,
        hisPresent: this.hisPresent
      };
      console.log(`patientInfo`, patientInfo);
      this.cdss.setRecommendInput(patientInfo);
    }
  }
};
</script>
