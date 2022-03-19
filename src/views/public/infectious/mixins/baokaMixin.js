import {
  deepClone
} from "@/utils/index.js";
import Base64 from "@/utils/base64";
import {
  getRole
} from "@/utils/auth";
import {
  getHistoryDiagList
} from "@/api/common/diagnosis";
import {
  getPatientArchInfo
} from "@/api/common/report";
import {
  cacheInfectiousDiseaseCard
} from "@/api/common/report.js";
let baokaFormInit = {
  state: "",
  cardSource: "", // 报卡来源
  cardType: "", // 报卡类型
  cardCode: "", // 卡片编号
  pid: "", // 患者档案id
  patientName: "", // 患者姓名
  jiazhangxingming: "", // 家长姓名
  paperwork: "", // 有效身份证号码
  sex: "", // 性别
  birthday: "", // 出生日期
  regularAge: "", // 实足年龄
  inpNo: "", //住院号
  ageUnit: "", // 年龄单位
  workplace: "", // 工作单位
  telephone: "", // 联系电话
  patientAttribution: "", // 病人属于
  addrCode: [], // 现住址
  doorplateAddressCode: "", // 详细住址
  profession: "", // 人群分类
  diseaseClassificationOne: "", // 病例分类 必填
  diseaseClassificationTwo: "", // 病例分类
  chuzhenDate: "", // 初诊日期
  jiuzhenDate: "", // 就诊日期
  onsetDate: "", // 发病日期
  diagDate: "", // 诊断日期
  diagName: "", // 疾病诊断
  icd10Encoding: "", // 疾病编码
  deathDate: "", // 死亡日期
  fillCardDoctorName: "", // 报卡医生
  fillCardDate: "", // 报卡日期
  revisedDiagName: "", // 订正诊断
  keshiTelephone: "", // 科室联系电话
  keshiName: "", // 报告科室
  reportUnit: "", // 报告单位
  keshi: "", // 报告科室
  outfitPlace: "", //机构地址
  returnCardReason: "", // 退卡原因
  remark: "", // 备注
  provinceAddressCode: "", //省
  cityAddressCode: "", //市
  countyAddressCode: "", //区
  streetAddressCode: "", //街道
  villageAddressCode: "", //村
  doorplateAddressCode: "", //详细地址
};

export default {
  data() {
    return {
      // 传输给表单弹框的数据
      baokaFormData: {},
      // 初始化数据
      baokaFormDataInit: {},
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        diagMain: "1"
      }
    }
  },
  computed: {
    // ...mapGetters("base", ["receivePatientData"])
  },
  methods: {
    //  状态为空时候初始化数据
    assignmentFun(row, isStagSubmit) {
      this.baokaFormDataInit = deepClone(baokaFormInit);
      this.baokaFormDataInit.cardSource = row.cardSource ? row.cardSource.toString() : '1';
      this.baokaFormDataInit.patientName = row.patientName || "";
      this.baokaFormDataInit.pid = row.pid || "";
      this.baokaFormDataInit.paperwork = row.paperwork || "";
      this.baokaFormDataInit.inpNo = row.inpNo || "";
      this.baokaFormDataInit.jiuzhenDate = row.diagTime || "";
      this.baokaFormDataInit.diagName = row.diagName || "";
      this.baokaFormDataInit.onsetDate = row.onsetDate || "";
      this.baokaFormDataInit.fillCardDoctorName = Base64.decode(localStorage.getItem("userName"));
      this.baokaFormDataInit.fillCardDoctor = Base64.decode(localStorage.getItem("userId"));
      this.baokaFormDataInit.keshi = JSON.parse(getRole()).deptName;
      this.baokaFormDataInit.reportUnit = JSON.parse(localStorage.getItem("pamars")).hosName;
      this.baokaFormDataInit.outfitPlace = JSON.parse(localStorage.getItem("pamars")).hosName;
      this.patientInfo(row, isStagSubmit);
    },
    async patientInfo(row, isStagSubmit) {
      if (!row.pid) {
        return;
      }
      this.loading = true;
      try {
        let {
          code,
          data,
          msg
        } = await getPatientArchInfo({
          patientId: row.pid
        });
        if (code === 1 && data.length) {
          this.baokaFormDataInit.regularAge = data[0].patientArchiveInfoVO.patientAge;
          this.baokaFormDataInit.workplace = data[0].patientArchiveInfoVO.workUnit;
          this.baokaFormDataInit.sex = data[0].patientArchiveInfoVO.patientGender;
          this.baokaFormDataInit.patientName = data[0].patientArchiveInfoVO.patientName;
          this.baokaFormDataInit.paperwork = data[0].patientArchiveInfoVO.identificationNum;
          this.baokaFormDataInit.birthday = data[0].patientArchiveInfoVO.birthDate;
          this.baokaFormDataInit.telephone = data[0].patientArchiveInfoVO.mobileNum;
          this.baokaFormDataInit.doorplateAddressCode = data[0].patientEmpiInfoAddrssVO.currentDetail;
          this.baokaFormDataInit.addrCode = JSON.parse(data[0].patientEmpiInfoAddrssVO.currentAddress) || [];
          await this.queryHistoryDiag(row.pid, row.inpNo);
        } else {
          this.$message.error(msg);
        }
      } catch (error) {} finally {
        this.loading = false;
        if (isStagSubmit) {
          // 暂存数据
          await this.stagSubmit();
        } else {
          // TODO 将返回数据赋值给baokaFormData
          this.baokaFormData = deepClone(this.baokaFormDataInit);
        }
        this.dialogVisibleBK = true;
      }
    },
    // 暂存
    async stagSubmit() {
      this.loading = true;
      try {
        let params = {
          ...this.baokaFormDataInit,
          provinceAddressCode: this.baokaFormDataInit.addrCode[0] || '',
          cityAddressCode: this.baokaFormDataInit.addrCode[1] || '',
          countyAddressCode: this.baokaFormDataInit.addrCode[2] || '',
          streetAddressCode: this.baokaFormDataInit.addrCode[3] || '',
          villageAddressCode: this.baokaFormDataInit.addrCode[4] || '',
        };
        let {
          code,
          data,
          msg
        } = await cacheInfectiousDiseaseCard(params);
        if (code == 1) {
          // 暂存后的操作
          this.submitBK(data, true);
          // TODO 将返回数据赋值给baokaFormData
          this.baokaFormData = this.handleData(data);
        }
      } catch (error) {} finally {
        this.loading = false;
      }
    },
    // 处理查询到的报卡数据
    handleData(row) {
      let obj = deepClone(row);
      let addrCode = [
        Number(row.provinceAddressCode || ""),
        Number(row.cityAddressCode || ""),
        Number(row.countyAddressCode),
        Number(row.streetAddressCode || ""),
        Number(row.villageAddressCode || "")
      ];
      obj.addrCode = addrCode.filter(
        item => item !== 0
      );
      return obj;
    },
    //获取历史诊断
    async queryHistoryDiag(patientId, visitCode) {
      let res = await getHistoryDiagList({
        ...this.pageParams,
        patientId,
        visitCode
      });
      if (res.data) {
        for (let i in res.data) {
          if (res.data[i].diagMain == "1") {
            this.baokaFormDataInit.onsetDate = res.data[i].startTime; //发病日期
            this.baokaFormDataInit.diagDate = res.data[i].diagTime; //诊断日期
          }
        }
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
}
