<template>
  <div class="height100 drug">
    <l-layout
      :toolBoxs="toolBoxs"
      :defaultToolName="toolBoxs[0]"
      :boxExpanded="true"
      @message="messageHandler"
      patientCardType="default"
      pageName="signTriage"
    >
      <template #list>
        <l-side-tabs
          v-model="formVal"
          @tabs-change="handleClick"
          @read-card="readCard"
          @query="search"
          :form-list="formParams"
        >
          <template #firstBottom>
            <!--填入 第一个 tabs 的 搜索条件下部 内容-->
            <div class="botton-cont height100">
              <div class="table" style="height:99%">
                <el-table
                  v-loading="tlm_isLoading"
                  v-loadmore="loadNextPage"
                  :data="tableLeftData"
                  width="100%"
                  element-loading-text="加载中..."
                  height="100%"
                  border
                  :row-class-name="tableRowClassName"
                  @row-click="setPatientInfo"
                >
                  <el-table-column
                    v-for="(item, index) in tableLeftParams"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :min-width="item.width"
                    :fixed="item.fixed"
                    header-align="left"
                    :align="item.align || 'left'"
                  >
                    <template slot-scope="scope">
                      <template v-if="item.prop === 'hospitalnum'">
                        <span class="color-hospital">
                          {{ scope.row[item.prop] }}
                        </span>
                      </template>
                      <template v-else-if="item.prop === 'ouptDeptId'">
                        <span
                          tableName="sys_org"
                          :conditionMap="{
                            org_type: '_DEPT_',
                            id: scope.row['ouptDeptId']
                          }"
                          columns="org_nm"
                          v-tableTransform
                        ></span>
                      </template>
                      <template v-else-if="item.prop === 'appointmentMode'">
                        <span
                          :val="scope.row[item.prop]"
                          code="AppointmentMode"
                          v-codeTransform
                        ></span>
                      </template>
                      <template v-else>
                        <span>{{ scope.row[item.prop] }}</span>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </template>
          <template #second>
            <!--填入 第二个 tabs 的  内容-->
            第二卡片内容
          </template>
        </l-side-tabs>
      </template>
      <template #content>
        <div class="height100">
          <mainCon
            @updatePatient="updatePatientList"
            :rowData="rowData"
            :deptIdFrom="deptIdFrom"
            :appointmentTime="appointmentTime"
          ></mainCon>
        </div>
      </template>
    </l-layout>
  </div>
</template>

<script>
// 备注： hosp-state  属性 增加住院的人员状态包括 新入院 在院 预撤床 撤床 。 目前默认选择在院状态
// 目前form 表单有
// 院区：CourtyardArea
// 科室：technicalOffices
// 渠道：channelWay
// 时间：timeRange
// 搜索：search

import LSideTabs from "@/components/LSideTabs.vue";
import mainCon from "./components/index.vue";
import service from "@/api/appointment/appointment";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "leftBar",
  components: {
    mainCon,
    LSideTabs
  },
  data() {
    return {
      tlm_isLoading: false,
      toolBoxs: ["appointRecord", "Hotkey"],
      formParams: ["technicalOffices", "search"],
      tableLeftData: [],
      rowData: {},
      formVal: {
        technicalOffices: ""
      },
      deptIdFrom: "",
      appointmentTime: '',
      tableLeftParams: [
        {
          prop: "ouptDeptId",
          label: "科室",
          width: "100",
          align: "left",
          fixed: true
        },
        {
          prop: "patientName",
          label: "姓名",
          width: "100",
          align: "left",
          fixed: false
        },
        {
          prop: "appointmentMode",
          label: "来源",
          width: "80",
          align: "left",
          fixed: false
        },
        {
          prop: "appointmentTime",
          label: "时间",
          width: "180",
          align: "left",
          fixed: false
        }
      ],
      formObj: {},
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      patientId: "",
      apptList: []
    };
  },
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
    ...mapGetters("user", ["name", "role"])
  },
  mounted() {
    this.formVal.technicalOffices = this.role.deptId || '92';
    this.search({ technicalOffices: this.formVal.technicalOffices });
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData"
    }),
    updatePatientList(data) {
      this.getDataList();
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.scheduleSerialId) {
        return "success-row";
      }
      return "";
    },
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.getDataList(true);
    },
    messageHandler() {},
    handleClick() {
      // tab 的切换方法
    },
    // 获取预约列表
    async search(val) {
      // 查询方法
      try {
        this.formObj = val;
        if(this.formObj.technicalOffices == ''){
          this.formObj.technicalOffices = this.role.deptId;
        }
        this.tlm_isLoading = true;
        this.tableLeftData = [];
        this.getDataList();
      } catch (error) {
        this.tlm_isLoading = false;
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    async getDataList(isLoad = false) {
      try {
        const times =
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate();
        const sDate = `${times} 00:00:00`;
        const eDate = `${times} 23:59:59`;

        const res = await service.getOutpListBySelect({
          sDate,
          eDate,
          ouptDeptId: this.formObj.technicalOffices || "",
          patientName: this.formObj.search || "",
          ...this.pageParams
        });

        if (!isLoad) {
          this.tableLeftData.length = 0;
        }
        this.tableLeftData.push(...res.data);
        this.pageParams.total = res.total;

        if (res.data.length < 1) {
          this.$message("未查询到患者");
        } else {
          this.deptIdFrom = this.tableLeftData[0].ouptDeptId;
          this.appointmentTime = this.tableLeftData[0].appointmentTime;
          this.setPatientInfo(this.tableLeftData[0]);
        }
        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
      }
    },
    async readCard(val) {
      // 读卡方法
      try {
        if (val.search == "") {
          this.$message.warning("请输入卡号");
          return;
        }
        this.$showLoading();
        const { data } = await service.getCardDetailInfo({
          cardNum: val.search || ""
        });
        const times =
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate();
        const sDate = `${times} 00:00:00`;
        const eDate = `${times} 23:59:59`;

        const res = await service.getOutpListBySelect({
          sDate,
          eDate,
          outpDeptId: val.technicalOffices || "",
          patientId: data.patientId,
          ...this.pageParams
        });

        if (res.data && res.data.length > 0) {
          this.tableLeftData = res.data;
          this.setPatientInfo(res.data[0]);
          this.appointmentTime = this.tableLeftData[0].appointmentTime;
        }

        this.$hideLoading();
      } catch (error) {
        this.$message.error(error.msg || "标准错误提示");
        this.$hideLoading();
      }
    },
    setPatientInfo(row) {
      this.rowData = row;
      this.changeRecPatientData(row);
    }
  }
};
</script>

<style scoped lang="scss">
.botton-cont {
  margin: 0 20px;
}
.mar-top-10 {
  margin-top: 10px;
}
.color-hospital {
  color: #3d7dfb;
}
/deep/.el-table .success-row {
  background: #f0f9eb;
}
/deep/ .content-150 {
  height: calc(100% - 170px);
}
</style>
