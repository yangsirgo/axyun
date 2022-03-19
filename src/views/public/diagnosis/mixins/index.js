import {
  mapGetters,
  mapActions
} from "vuex";
import {
  deleteDiagRelation
} from "@/api/emrRecord/common/diagnosis"; // 维护诊断关系
import diaAddEdit from "../components/addEdit";

export default {
  computed: {
    ...mapGetters("base", {
      cisPatient: "receivePatientData"
    }),
    ...mapGetters("homeSickbeds", {
      homeSickbedsPatient: "receivePatientData"
    }),
    // 获取登录用户信息
    ...mapGetters("user", ["name", "role"]),
    // 就诊类型 1:门诊；2:急症； 3:住院。
    clinicType() {
      return this.hosType;
    },
    diagAdd() {
      if (this.$refs.diagnosisData) {
        return this.$refs.diagnosisData.diagAdd;
      }
      return [];
    },
    // 是否有主诊断
    hasDiagMain() {
      return this.diagAdd.some(item => {
        return item.diagMain === "1";
      });
    }
  },
  watch: {
    //门诊患者
    cisPatient: {
      deep: true,
      immediate: true,
      handler(val, old) {
        if (!val.appointmentId) {
          return;
        }
        let oldId =
          old !== undefined && old.hasOwnProperty("appointmentId")
            ? old.appointmentId
            : "";
        if (val.appointmentId && val.appointmentId == oldId) {
          return;
        }
        if (val && val.patientId && this.hosType == "1") {
          this.receivePatientData = { ...val };
          // this.reLoadData();
        }
      }
    },
    //家床患者
    homeSickbedsPatient: {
      deep: true,
      immediate: true,
      handler(val, old) {
        if (!val.treatNo) {
          return;
        }
        let oldId =
          old !== undefined && old.hasOwnProperty("treatNo") ? old.treatNo : "";
        if (val.treatNo && val.treatNo == oldId) {
          return;
        }
        if (val && val.patientId && this.hosType == "3") {
          this.receivePatientData = { ...val };
          // this.reLoadData();
        }
      }
    },
    diagReloadData: {
      handler(val, old){
        this.$refs.diagnosisData.reLoadData();
      }
    }
  },
  created() {
    // 修改bug 默认打开 39943 2020-11-2
    this.curComponent = diaAddEdit;
    this.aOrE = true;
    // 修改 bug
  },
  /**
   * 接收右侧工具箱消息（messageHandler）： 
   * 1. 右侧工具箱发来消息，刷新当前诊断列表(历次诊断，常用诊断，诊断模板引用场景)

   * 诊断列表抛出的多选change方法（handleSelectionChange）： 
   * 1. 将选择的数据列表放入multipleSelection变量中

   * 诊断列表抛出的点击当前列方法（editTableRow）： 
   * 1. 将选中的进行编辑数据放入asd变量中
   * 2. 表单组件置为显示状态

   * 模板表单组件抛出的隐藏组件方法（dialogVisibleFalse）： 
   * 1. 隐藏模板表单组件

   * 表单组件抛出的添加诊断确认方法（rechargeConfirmAdd）： 
   * 1. 刷新诊断列表

   * 表单组件抛出的取消保存方法（rechargeCancelAdd）： 
   * 1. 隐藏模板表单组件

   * 删除诊断关系接口（deleteDiagRelationHandler）： 
   * 1. 删除诊断关系接口
   * * */
  methods: {
    ...mapActions({
      changeRef: "diagnosis/changeRef", //刷新工具箱历次诊断
      // changeRecPatientData: "base/changeRecPatientData",
      setDiaName: "cis/setDiaName"
    }),
    //接收工具箱消息
    messageHandler(val) {
      this.$refs.diagnosisData.reLoadData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    updateDiagAdds(val) {
      this.diagAdds = val;
    },
    editTableRow(row) {
      this.curComponent = diaAddEdit;
      this.asd = row;
      this.aOrE = false;
    },
    //添加诊断确认方法
    async rechargeConfirmAdd(data) {
      await this.$refs.diagnosisData.reLoadData();
      // this.curComponent = "";
      this.$emit("loadPatientData");
    },
    //取消添加
    rechargeCancelAdd() {
      this.curComponent = "";
    },
    dialogVisibleFalse() {
      this.curComponent = "";
    },
    //删除诊断关系
    async deleteDiagRelationHandler(params) {
      try {
        const {
          code,
          data,
          msg
        } = await deleteDiagRelation(params);
        if (code !== 1) {
          this.$message.error(msg || "删除诊断关系操作失败");
        }
      } catch (error) { }
    },
    cardLoadChange(val) {
      this.tableLoading = val;
    }
  }
}
