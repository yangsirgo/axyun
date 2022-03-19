<template>
  <div class="height100 width100 bg-center">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :toolBoxShow="false"
      :patientListShow="false"
      @message="messageHandler"
      pageName="docSubmit"
    >
      <template #content>
        <div class="bg-contain width100 height100">
          <div class="m-contain height100">
            <waitWriteDocList />
          </div>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
import { waitDeptCheckSignList } from "@/api/emrRecord/ipnw/waitCheck/check.js";
import waitWriteDocList from "../component/waitWriteDocList";
export default {
  name: "",
  components: {
    waitWriteDocList
  },
  data() {
    return {
      toolBoxs: ["Hotkey"],
      formParams: ["CourtyardArea", "technicalOffices", "timeRange", "search"],
      searchForm: {
        dept: "",
        patientName: "",
        bedCd: "",
        enId: "",
        nm: "",
        mrStaCd: "",
        signLevel: ""
      },
      tlm_isLoading: false,
      total: 0,
      pageParams: {
        pageSize: 20,
        pageNo: 1
      },
      eleParams: [
        {
          prop: "recordStatus",
          label: "病历状态",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "120"
        },
        {
          prop: "recordName",
          label: "病历名称",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "120"
        },

        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        },
        {
          prop: "bedCd",
          label: "床号",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "60"
        },
        {
          prop: "inDoctorNumber",
          label: "住院号",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "100"
        },
        {
          prop: "pickUpPeoper",
          label: "起草人",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        },
        {
          prop: "busniessTime",
          label: "业务时间",
          align: "left",
          headerAlign: "left",
          width: "120"
        },
        {
          prop: "submitName",
          label: "提交人",
          align: "left",
          headerAlign: "left",
          width: "80"
        },
        {
          prop: "signLvlCd",
          label: "审签等级",
          align: "left",
          headerAlign: "left",
          width: "80"
        },
        {
          prop: "advice",
          label: "审签意见",
          align: "left",
          headerAlign: "left",
          width: "80"
        },
        {
          prop: "lastUpdateMan",
          label: "最后更新人",
          align: "left",
          headerAlign: "left",
          width: "100"
        },
        {
          prop: "lastUpdateDate",
          label: "最后更新时间时间",
          align: "left",
          headerAlign: "left",
          width: "200"
        }
      ],
      eleData: [
        {
          recordStatus: "1",
          recordName: "1",
          patientName: "1",
          bedCd: "12345",
          inDoctorNumber: "32",
          pickUpPeoper: "12",
          busniessTime: "ee",
          submitName: "e",
          signLvlCd: "e",
          advice: "dd",
          lastUpdateMan: "dd",
          lastUpdateDate: " dsd"
        }
      ],
      showEditorFlag: false,
      patientId: ""
    };
  },
  methods: {
    rowClickHandle(row) {
      console.log(row);
      this.patientId = row.patientId;
    },
    messageHandler() {},
    reset() {
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
    },
    queryTableList(isLoad = false) {
      // 拼接请求参数
      if (!isLoad) {
        this.pageParams.pageNo = 1;
      }
      let data = { ...this.searchForm, ...this.pageParams, isHome: 1 };
      this.tlm_isLoading = true;
      waitDeptCheckSignList(data)
        .then(resData => {
          console.log(resData, "resData");
          if (resData.code === 1 && resData.data) {
            if (isLoad) {
              this.eleData.push(...resData.data);
            } else {
              this.eleData = resData.data;
            }
            this.total = resData.total;
          } else {
            this.$message(resData.msg || "待本人审签接口报错");
          }
          this.tlm_isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.tlm_isLoading = false;
          this.$message(error || error.msg || "待本人审签接口报错");
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.bg-contain {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 0;
  box-sizing: border-box;
  .m-contain {
    padding: 10px 20px;
    box-sizing: border-box;
    .choose-con {
      .search-con {
        width: calc(100% - 180px);
        float: left;
        .common-item {
          float: left;
          margin-right: 10px;
          margin-top: 5px;
          width: 200px;
        }
      }
      .search-btns {
        margin-top: 5px;
        width: auto;
        float: right;
      }
    }
    .table-con {
      margin-top: 20px;
      height: calc(100% - 100px);
    }
  }
  .margin-top-10 {
    margin-top: 10px;
  }
}

/deep/ .el-col {
  padding-left: 0 !important;
}
/deep/ .el-tabs {
  height: calc(100% - 50px);
}
/deep/ .el-tabs__content {
  height: calc(100% - 50px);
}
</style>
