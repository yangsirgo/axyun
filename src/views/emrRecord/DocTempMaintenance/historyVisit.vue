<template>
  <div class="tgm-container width100 height100">
    <el-card class="width100 height100">
      <div class="common-wrapper width100 height100">
        <div class="top-serach">
          <l-common-search rightAreaWidth="140">
            <template slot="leftCon">
              <div class="common-item">
                <l-formt-title label="管辖单位">
                  <!-- <el-input
                    clearabled
                    placeholder="请输入"
                    v-model="searchObj.hosId"
                  /> -->
                  <l-value-domain
                    type="select"
                    clearable
                    filterable
                    :value.sync="searchObj.hosId"
                    remoteUrl="/admin/org/hos-tree"
                    remoteShowKey="label"
                    remoteValueKey="id"
                    placeholder="请选择"
                  ></l-value-domain>
                </l-formt-title>
              </div>
              <div class="common-item">
                <el-radio-group v-model="searchObj.userang" class="radio-group">
                  <el-radio :label="0">全院</el-radio>
                  <el-radio :label="1">本科室</el-radio>
                  <el-radio :label="2">个人</el-radio>
                </el-radio-group>
              </div>
              <div class="common-item">
                <l-formt-title label="就诊号码">
                  <el-input
                    clearabled
                    placeholder="请输入"
                    v-model="searchObj.visitCode"
                  />
                </l-formt-title>
              </div>
              <div class="common-item">
                <l-formt-title label="就诊医生">
                  <el-select
                    v-model="searchObj.doctorId"
                    filterable
                    remote
                    clearable
                    reserve-keyword
                    placeholder="姓名/拼音/五笔"
                    :remote-method="selectAllUser"
                    :loading="selLoading"
                    @focus="selectAllUser('')"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </div>
              <div class="common-item">
                <l-formt-title label="结算类型">
                  <l-value-domain
                    clearable
                    filterable
                    code="settlementType"
                    :value.sync="searchObj.property"
                    placeholder="请选择"
                  ></l-value-domain>
                </l-formt-title>
              </div>
              <div class="common-item" style="width: 350px">
                <l-formt-title label="挂号时间">
                  <el-date-picker
                    v-model="timeList"
                    clearable
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </l-formt-title>
              </div>
              <div class="common-item">
                <l-formt-title label="患者姓名">
                  <el-input
                    clearable
                    placeholder="请输入"
                    v-model="searchObj.patientName"
                  />
                </l-formt-title>
              </div>
              <div class="common-item">
                <l-formt-title label="性别">
                  <l-value-domain-emr
                    clearable
                    filterable
                    code="GENDER_CODE"
                    :value.sync="searchObj.patientGender"
                    placeholder="请选择"
                  ></l-value-domain-emr>
                </l-formt-title>
              </div>
              <div class="common-item">
                <l-formt-title label="诊断">
                  <el-input
                    clearable
                    placeholder="请输入"
                    v-model="searchObj.diagName"
                  />
                </l-formt-title>
              </div>
              <div class="common-item">
                <l-formt-title label="年龄">
                  <el-input
                    v-model="searchObj.ageStart"
                    clearable
                    style="width: 60px; margin-left: 5px"
                  ></el-input>
                  <span>&nbsp;~&nbsp;</span>
                  <el-input
                    v-model="searchObj.ageEnd"
                    style="width: 60px"
                    clearable
                  ></el-input>
                </l-formt-title>
              </div>
            </template>
            <template slot="rightCon">
              <div class="btns-contain">
                <el-button
                  class="myBtn el-button--primary"
                  @click="searchHandler"
                  >查询</el-button
                >
                <el-button @click="resetData" class="myBtn el-button--default"
                  >重置</el-button
                >
              </div></template
            >
          </l-common-search>
        </div>
        <div class="bottom-table-content">
          <div class="table-btns">
            <el-button v-show="false" class="myBtn el-button--primary"
              >查看档案</el-button
            >
            <el-button v-show="false" class="myBtn el-button--default"
              >打印处方</el-button
            >
            <el-button v-show="false" class="myBtn el-button--default"
              >打印处置</el-button
            >
            <el-button v-show="false" class="myBtn el-button--default"
              >打印病历首页</el-button
            >
            <el-button
              @click="getCommonData"
              class="myBtn el-button--primary"
              >健康档案</el-button
            >
            <el-button
              @click="openRerecordHander"
              class="myBtn el-button--primary"
              >打开病历</el-button
            >
            <el-button
              @click="exportRecodHandler"
              class="myBtn el-button--primary"
              >导出</el-button
            >
          </div>
          <l-table
            :total="total"
            :pageSize.sync="pageParams.pageSize"
            :page.sync="pageParams.pageNo"
            :layout="layout"
            :singlePageShow="true"
            class="table-content"
            @changeSize="changeSize"
          >
            <el-table
              class="my-table"
              ref="recordTable"
              :data="recordTableData"
              border
              style="width: 100%"
              height="100%"
              v-loading="tableLoading"
              highlight-current-row
              @row-dblclick="dblclickOpen"
              @row-click="selectRow"
            >
              <el-table-column
                type="index"
                label="序号"
                :index="indexMethod"
                width="60px"
              ></el-table-column>
              <el-table-column
                v-for="(item, index) in eleParams"
                sortable
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :align="item.align || 'left'"
                :header-align="item.headerAlign || 'left'"
              >
                <template slot-scope="scope">
                  <div v-if="item.prop === 'patientGender'">
                    <span
                      :val="scope.row.patientGender"
                      code="GENDER_CODE"
                      v-codeTransform
                    ></span>
                  </div>
                  <div v-else-if="item.prop === 'settlementType'">
                    <span
                      :val="scope.row.settlementType"
                      code="settlementType"
                      v-codeTransform
                    ></span>
                  </div>
                  <div v-else-if="item.prop === 'isEndEmr'">
                    {{ scope.row[item.prop] === "1" ? "是" : "否" }}
                  </div>
                  <div v-else-if="item.prop === 'triageStatus'">
                    <span
                      code="FirstOrNo"
                      v-codeTransform
                      :val="scope.row[item.prop]"
                    ></span>
                  </div>
                  <div v-else-if="item.prop ==='careerCode'">
                    <span
                      code="OCCUPATIONAL_CLASSIFICATION_CODE"
                      v-codeTransform
                      :val="scope.row[item.prop]"
                    ></span>
                  </div>
                  <div v-else-if="item.prop === 'hosId'">
                    <span
                      tableName="sys_org"
                      :conditionMap="{
                        org_type: '_HOS_',
                        id: scope.row[item.prop],
                      }"
                      columns="org_nm"
                      v-tableTransform
                    ></span>
                  </div>
                  <div v-else-if="item.prop === 'amt'">
                    {{ scope.row[item.prop] | handlerSmallNumber }}
                  </div>
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </el-table-column>
            </el-table>
          </l-table>
        </div>
      </div>
    </el-card>
    <history-record-dialog
      ref="historyRecordDialog"
      :patientId="patientId"
      :visitCode="visitCode"
      @closeDialogHandler="closeDialogHandler"
    />
    <!-- 老 高 糖 -->
    <el-dialog
      :title="iframeTitle"
      :visible.sync="iframeVisible"
      :width="`${iframeW + 64}px`"
      top="5vh"
    >
      <div style="padding: 16px 32px 16px 32px;">
        <HealthFIleIframe
          v-if="iframeVisible"
          :thirdData="thirdDataObj"
          :iframeType="iframeType"
          @cancelIframe="cancelIframe"
          @updateBaseInfo="updateBaseInfo"
          :style="`height: ${iframeH}px;width:${iframeW}px`"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import historyRecordDialog from "./component/historyRecordDialog.vue";
import HealthFIleIframe from "@/views/cis/HealthFIleIframe/index.vue";

import { getHistoryVisitList, exportHistoryAndPrescriptionExcel } from "@/api/cis/order/order.js";
import service1 from "@/api/systemManagement/receipt/receipt";
import { getGroupFlag } from "@/api/third/third";
import { mapActions } from "vuex";

export default {
  name: "",
  components: {
    historyRecordDialog,
    HealthFIleIframe
  },
  data() {
    return {
      searchObj: {
        hosId: "",
        userang: 0,
        visitCode: "",
        doctorId: "",
        diagName: "",
        patientName: "",
        patientGender: "",
        property: "",
        ageStart: "",
        ageEnd: ""
      },
      timeList: [],
      selLoading: false,
      tableLoading: false,
      layout: "total,prev,pager,next,jumper",
      total: 1,
      pageParams: {
        pageNo: 1,
        pageSize: 20
      },
      options: [],
      recordTableData: [],
      eleParams: [
        {
          prop: "regTime",
          label: "挂号时间",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "140"
        },
        {
          prop: "doctorName",
          label: "就诊医生",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "120"
        },
        {
          prop: "patientName",
          label: "患者姓名",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "120"
        },
        {
          prop: "patientGender",
          label: "性别",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "120"
        },
        {
          prop: "phoneNum",
          label: "联系电话",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "120"
        },
        {
          prop: "patientAge",
          label: "年龄",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "80"
        },
        {
          prop: "settlementType",
          label: "结算类型",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "80"
        },
        {
          prop: "diagName",
          label: "病人诊断",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "120"
        },
        {
          prop: "outpDeptName",
          label: "就诊科室",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "120"
        },
        {
          prop: "drugNum",
          label: "药物处方数",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "100"
        },
        {
          prop: "adviceNum",
          label: "非药物处方数",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "100"
        },
        {
          prop: "amt",
          label: "金额",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "100"
        },
        {
          prop: "diagTime",
          label: "开始时间",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "140"
        },
        {
          prop: "isEndEmr",
          label: "是否完善病历",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "100"
        },
        {
          prop: "careerCode",
          label: "职业代码",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "80"
        },
        {
          prop: "identificationNum",
          label: "身份证号",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "180"
        },
        {
          prop: "relateAddr",
          label: "联系地址",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "180"
        },
        {
          prop: "triageStatus",
          label: "门诊类型",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "100"
        },
        {
          prop: "hosId",
          label: "就诊机构",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "120"
        },
        {
          prop: "visitCode",
          label: "就诊号码",
          align: "left",
          headerAlign: "left",
          fixed: "",
          width: "140"
        }
      ],
      patientId: "",
      visitCode: "",
      identificationType: "",
      identificationNum: "",
      iframeType: "",
      iframeH: 0,
      iframeW: 0,
      iframeTitle: "",
      iframeUrl: "",
      iframeVisible: false,
      thirdDataObj: {}
    };
  },
  filters: {
    handlerSmallNumber(number) {
      let num = parseFloat(number);
      if (num !== NaN) {
        return num === 0 ? 0 : num.toFixed(2);
      } else {
        return 0;
      }
    }
  },
  created() {
    // 默认登录机构
    let { hosIdNum, hosId } = this.getLoginPamars();
    this.searchObj.hosId = hosIdNum || hosId;

    // 挂号时间 默认当前的时间
    //时间默认当日
    let startTime = this.dayjs(new Date()).format(
      "YYYY-MM-DD"
    );

    this.timeList = [startTime, startTime];

    this.searchHandler();
  },
  methods: {
    ...mapActions({
      setPublicHealthPatientData: "base/setPublicHealthPatientData"
    }),
    getLoginPamars() {
      const Pamars = "pamars";
      return JSON.parse(localStorage.getItem(Pamars));
    },
    closeDialogHandler() {
      this.patientId = "";
      this.visitCode = "";
    },
    resetData() {
      for (let k in this.searchObj) {
        this.searchObj[k] = "";
      }
      this.timeList = [];
    },
    async selectAllUser(val) {
      try {
        this.selLoading = true;
        let res = await service1.getAllUser({
          userName: val || ""
        });
        this.options = res.data;
        this.selLoading = false;
      } catch (error) {
        this.selLoading = false;
        this.$message.error(error.msg || "搜索用户失败");
      }
    },
    searchHandler() {
      this.pageParams.pageNo = 1;
      this.query();
    },
    handlerAgeFunc(age, start = false) {
      const year = this.dayjs().format("YYYY");
      return age
        ? `${Number(year) - parseInt(age)}${start ? "-01-01" : "-12-31"}`
        : "";
    },
    query() {
      if (this.tableLoading) return;
      this.tableLoading = true;

      if (!this.timeList) {
        this.timeList = [];
      }

      const params = {
        ...this.pageParams,
        ...this.searchObj,
        startDate: this.timeList[0] || "",
        endDate: this.timeList[1] || "",
        ageStart: this.handlerAgeFunc(this.searchObj.ageEnd, true),
        ageEnd: this.handlerAgeFunc(this.searchObj.ageStart)
      };

      getHistoryVisitList(params)
        .then(res => {
          const { code, data = [], msg, pageNo, total } = res;
          if (code === 1) {
            this.recordTableData = data.map(item => {
              return {
                ...item,
                regTime: item.regTime
                  ? this.dayjs(item.regTime).format("YYYY-MM-DD HH:mm")
                  : "",
                diagTime: item.diagTime
                  ? this.dayjs(item.diagTime).format("YYYY-MM-DD HH:mm")
                  : ""
              };
            });

            this.pageParams.pageNo = pageNo;
            this.total = total;
          } else {
            this.$message.error(msg || "获取历史就诊操作失败");
          }
        })
        .catch(error => {})
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 打开病历
    openRerecordHander() {
      // this.patientId = "93bb948260b546588d14db3d9ea80d29";
      // this.visitCode = "VC20120100004";
      if (!this.patientId) {
        this.$message.warning("请选择具体病历");
        return;
      }
      this.$refs.historyRecordDialog.openDialog();
    },
    // 导出
    async exportRecodHandler() {
      const params = {
        ...this.searchObj,
        startDate: this.timeList[0] || "",
        endDate: this.timeList[1] || "",
        ageStart: this.handlerAgeFunc(this.searchObj.ageEnd, true),
        ageEnd: this.handlerAgeFunc(this.searchObj.ageStart),
        exportType: '1'
      };
      const res = await exportHistoryAndPrescriptionExcel(params);
      const blob = res;
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        const parent = document.getElementsByTagName('body')[0]
        const a = document.createElement('a');
        a.download = '历史就诊记录.xls';
        a.href = e.target.result;
        parent.appendChild(a);
        a.click();
        parent.removeChild(a);
      }
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.query();
    },
    indexMethod(index) {
      return (
        index + 1 + (this.pageParams.pageNo - 1) * this.pageParams.pageSize
      );
    },
    // 双击
    dblclickOpen(row) {
      this.patientId = row.patientId;
      this.visitCode = row.visitCode;
      console.log(
        this.$refs.historyRecordDialog,
        "this.$refs.historyRecordDialog"
      );
      this.$refs.historyRecordDialog.openDialog();
    },
    // 单击
    selectRow(row) {
      this.patientId = row.patientId;
      this.visitCode = row.visitCode;
      this.identificationType = row.identificationType;
      this.identificationNum = row.identificationNum;
    },
    //获取公卫老高糖签数据
    async getCommonData() {
      let params = {
        identificationType: this.identificationType || "1",
        identificationNum: this.identificationNum,
        identificationName: ""
      };
      try {
        let res = await getGroupFlag(params);
        if (res.code == "SUCCESS") {
          if(res.data && res.data.recordPerfection) {
            this.thirdDataObj = res.data;
            this.setPublicHealthPatientData(res.data);
            this.goHealthFile();
          } else {
            this.$message.error("当前患者还未建立健康档案!");
          }
        } else {
          this.$message.error("当前患者还未建立健康档案!");
        }
      } catch (e) {}
    },
    // 切换到健康档案
    goHealthFile() {
      this.iframeType = "healthFile";
      this.iframeW = 1200;
      this.iframeH = 750;
      this.iframeTitle = "健康档案";
      this.iframeVisible = true;
    },
    cancelIframe() {
      this.iframeVisible = false;
    },
    updateBaseInfo() {},
  }
};
</script>

<style lang='scss' scoped>
.tgm-container {
  overflow: hidden;
  .common-wrapper {
    padding: 8px;
    display: flex;
    flex-direction: column;
    .radio-group {
      /deep/ .el-radio {
        line-height: 32px;
      }
    }
    .bottom-table-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .table-btns {
        display: flex;
        justify-content: flex-end;
      }
      .table-content {
        flex: 1;
        margin-top: 12px;
        min-height: 0;
      }
    }
  }
}
</style>
