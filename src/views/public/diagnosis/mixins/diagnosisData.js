import { getCurrentDiagList } from "@/api/common/diagnosis";
import { mapActions } from "vuex";

const tableHead1 = [
  {
    prop: "diagType",
    label: "诊断类型",
    align: "left",
    fixed: "left",
    width: 80
  },
  {
    prop: "cwFlag",
    label: "中/西医",
    align: "left",
    fixed: false,
    width: 80
  },
  {
    prop: "diagCode",
    label: "诊断编码",
    align: "left",
    fixed: false,
    width: 90
  },
  {
    prop: "diagName",
    label: "诊断名称",
    align: "left",
    fixed: false,
    width: 90
  },
  {
    prop: "diagIcd",
    label: "诊断描述",
    align: "left",
    fixed: false,
    width: 90
  },
  {
    prop: "tcmSyndrome",
    label: "中医证型",
    align: "left",
    fixed: false,
    width: 90
  },
  {
    prop: "diagMain",
    label: "主诊断",
    align: "left",
    fixed: false,
    width: 76
  },
  {
    prop: "startTime",
    label: "发病日期",
    align: "left",
    fixed: false,
    width: 200
  },
  {
    prop: "diagDoctorName",
    label: "诊断医生",
    align: "left",
    fixed: false,
    width: 90
  },
  {
    prop: "diagTime",
    label: "诊断日期",
    align: "left",
    fixed: false,
    width: 200
  },
  {
    prop: "isFirst",
    label: "初复诊",
    align: "left",
    fixed: false,
    width: 80
  },
  {
    prop: "status",
    label: "状态",
    align: "left",
    fixed: false,
    width: 80
  }
];
const tableHead2 = [
  {
    prop: "diagType",
    label: "诊断类型",
    align: "left",
    fixed: "left",
    width: 80
  },
  {
    prop: "cwFlag",
    label: "中/西医",
    align: "left",
    fixed: false,
    width: 80
  },
  {
    prop: "diagCode",
    label: "诊断编码",
    align: "left",
    fixed: false,
    width: 90
  },
  {
    prop: "diagName",
    label: "诊断名称",
    align: "left",
    fixed: false,
    width: 90
  },
  {
    prop: "diagIcd",
    label: "诊断描述",
    align: "left",
    fixed: false,
    width: 90
  },
  {
    prop: "tcmSyndrome",
    label: "中医证型",
    align: "left",
    fixed: false,
    width: 90
  },
  {
    prop: "diagMain",
    label: "主诊断",
    align: "left",
    fixed: false,
    width: 76
  },
  {
    prop: "diagResults",
    label: "病情",
    align: "left",
    fixed: false,
    width: 150
  },
  {
    prop: "startTime",
    label: "发病日期",
    align: "left",
    fixed: false,
    width: 200
  },
  {
    prop: "diagDoctorName",
    label: "诊断医生",
    align: "left",
    fixed: false,
    width: 90
  },
  {
    prop: "diagTime",
    label: "诊断日期",
    align: "left",
    fixed: false,
    width: 200
  },
  {
    prop: "isFirst",
    label: "初复诊",
    align: "left",
    fixed: false,
    width: 80
  },
  {
    prop: "status",
    label: "状态",
    align: "left",
    fixed: false,
    width: 80
  }
];
export default {
  computed: {
    // 控制是否还可以继续加载
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageSize) <=
        this.pageParams.pageNo
      );
    },
    // 根据就诊类型显示不同的表头
    mainTableHead() {
      return this.hosType === "1" ? tableHead1 : tableHead2;
    },
    // 是否有主诊断
    hasDiagMain() {
      return this.diagAdd.some(item => {
        return item.diagMain === "1";
      });
    }
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: true,
      handler(val, old) {
        if (val && val.patientId) {
          this.reLoadData();
        }
      }
    }
  },
  /**
   * 刷新诊断列表方法（reLoadData）： 
   * 1. 刷新诊断列表方法,将页数置为1

   * 获取诊断列表（queryCurrentDiag）： 
   * 1. 获取诊断列表

   * 下拉加载下一页诊断列表（loadNextPage）： 
   * 1. 下拉加载下一页诊断列表
   * * */
  methods: {
    ...mapActions({
      setDiagnosisList: "cdss/setDiagnosisList"
    }),
    //刷新诊断列表方法
    reLoadData() {
      // this.$refs.multipleTable.setCurrentRow();
      this.pageParams.pageNo = 1;
      this.queryCurrentDiag();
    },
    //获取诊断列表
    async queryCurrentDiag() {
      this.tableLoading = true;
      try {
        let res = await getCurrentDiagList({
          ...this.pageParams,
          patientId: this.receivePatientData.patientId,
          inpCode: this.receivePatientData.treatNo,
          visitCode: this.receivePatientData.visitCode,
          clinicType: this.hosType
        });
        if (res.code === 1) {
          if (res.pageParams.pageNo === 1) {
            this.diagAdd = res.data;
          } else {
            this.diagAdd = this.diagAdd.concat(res.data);
          }
          // this.getMainDiagFromList(this.diagAdd);
          // this.$refs.multipleTable.setCurrentRow(this.diagAdd[0]);
          this.$emit("updateDiagAdds", this.diagAdd);
          this.setDiaName({
            ...this.diagAdd[0]
          });
          // cdss
          this.setDiagnosisList(this.diagAdd)
          this.pageParams = {
            ...res.pageParams
          };
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.tableLoading = false;
      }
    },
    // 从诊断列表中获取主诊断 并更新
    getMainDiagFromList(list) {
      let item = list.find(item => item.diagMain === "1");

      if (item) {
        const diagName = item.diagName;
        // 更新主诊断名称
        this.$root.$emit("updateDiagName", diagName);
      }
    },
    //下拉加载下一页诊断列表
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.queryCurrentDiag();
    }
  }
};
