<template>
  <div class="height100">
    <div class="height100">
      <l-layout
        :toolBoxs="toolBoxs"
        :defaultToolName="toolBoxs[0]"
        :boxExpanded="true"
        @message="messageHandler"
        patientCardType="default"
        pageName="appointment"
      >
        <template #list>
          <l-side-tabs
            @tabs-change="handleClick"
            @read-card="readCard"
            :tabs-name="tabsName"
            @query="search"
            hideBtn
            :form-list="formParams"
          >
            <template #first>
              <!--填入 第一个 tabs 的 搜索条件下部 内容-->

              <div class="botton-cont height100">
                <div class="table height100">
                  <el-table
                    ref="officeTable"
                    v-loading="tlm_isLoading"
                    v-loadmore="{
                    noMoreVar: 'tlm_noOfficeMore',
                    loadingVar: 'tlm_isOfficeLoading',
                    value: loadOfficeNextPage
                  }"
                    :data="tableOfficeData"
                    element-loading-text="加载中..."
                    width="100%"
                    height="100%"
                    stripe
                    border
                    highlight-current-row
                    @row-click="setOffice"
                  >
                    <el-table-column
                      v-for="(item, index) in tableOfficeLeftParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      :fixed="item.fixed"
                      header-align="left"
                      :align="item.align || 'left'"
                    >
                      <div slot-scope="scope">
                        <div v-if="item.prop === 'deptId'">
                        <span
                          tableName="sys_org"
                          :conditionMap="{
                            org_type: '_DEPT_',
                            id: scope.row['deptId']
                          }"
                          columns="org_nm"
                          v-tableTransform
                        ></span>
                        </div>
                        <div v-else>
                        <span class="color-order">{{
                          scope.row[item.prop]
                        }}</span>
                        </div>
                      </div>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </template>
          </l-side-tabs>
        </template>
        <template #content>
          <reportList></reportList>
        </template>
      </l-layout>
    </div>
  </div>
</template>

<script>
  import service from "@/api/appointment/appointment";
  import {mapActions, mapGetters} from "vuex";
  import reportList from './components/reportList'

  export default {
    name: "index",
    components: {
      reportList
    },
    data() {
      return {
        tabsName: [
          {
            label: "科室列表",
            value: "first"
          }
        ],
        cutrrent: "patient",
        officeValue: "",
        pageParams: {
          pageNo: 1,
          pageSize: 20,
          total: 0
        },
        pageOfficeParams: {
          pageNo: 1,
          pageSize: 30,
          total: 0
        },
        formObj: {},
        tlm_isLoading: false,
        tlm_isOfficeLoading: false,
        toolBoxs: ["doctorOverview", "Hotkey"],
        tableLeftData: [],
        patientInfo: {},
        formParams: ["search"],
        tableLeftParams: [
          {
            prop: "patientName",
            label: "患者姓名",
            width: "120",
            align: "left",
            fixed: true
          },
          {
            prop: "identificationNum",
            label: "身份证号码",
            width: "200",
            align: "left",
            fixed: false
          }
        ],
        tableOfficeData: [],
        deptIdParams: "",
        tableOfficeLeftParams: [
          {
            prop: "deptId",
            label: "科室列表",
            width: "130",
            align: "left",
            fixed: true
          },
          {
            prop: "todayOrder",
            label: "近期预约",
            width: "100",
            align: "left",
            fixed: false
          }
        ]
      }
    },
    computed: {
      tlm_noMore() {
        return (
          Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
          this.pageParams.pageNo
        );
      },
      tlm_noOfficeMore() {
        return (
          Math.ceil(
            this.pageOfficeParams.total / this.pageOfficeParams.pageSize
          ) <= this.pageOfficeParams.pageNo
        );
      }
    },
    mounted() {
      this.getOfficeDataList();
    },
    methods: {
      ...mapActions({
        setCurrentTitle: "base/setCurrentTitle"
      }),
      ...mapActions({
        changeRecPatientData: "base/changeRecPatientData"
      }),
      updatePatientList(data) {
        this.getOfficeDataList();
      },
      getDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m =
          dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
        return y + "-" + m + "-" + d;
      },
      async getOfficeDataList(isLoad = false) {
        try {
          this.tlm_isOfficeLoading = true;
          let sDate = `${this.getDateStr(0)} 00:00:00`;
          let eDate = `${this.getDateStr(6)} 23:59:59`;
          let resData = await service.getOfficeOrderList({
            sDate,
            eDate,
            ...this.pageOfficeParams,
            deptName: this.officeValue
          });
          let _self = this;
          if (resData.code === 1 && resData.data) {
            if (resData.data.length > 0) {
              this.deptIdParams = resData.data[0].deptId;
              if (!isLoad) {
                this.tableOfficeData.length = 0;
              }
              this.tableOfficeData.push(
                ...resData.data.map(item => {
                  return {
                    deptId: item.deptId,
                    todayOrder: item.allNum
                      ? `${item.apptNum}/${item.allNum}`
                      : "0/0"
                  };
                })
              );
              this.setCurrent(this.tableOfficeData[0]);
              this.pageOfficeParams.total = resData.total;
            }
          }

          this.tlm_isOfficeLoading = false;
        } catch (error) {
          console.log(error);
          this.tlm_isOfficeLoading = false;
          this.$message.error(error.msg || "科室列表接口获取失败");
        }
      },
      //一进入页面 默认选中第一行
      setCurrent(row) {
        this.$refs.officeTable.setCurrentRow(row);
      },
      setOffice(row, index) {
        this.setCurrentTitle({
          title: "office",
          deptId: row.deptId
        });
        this.deptIdParams = row.deptId;
      },
      loadOfficeNextPage() {
        if (this.tlm_noOfficeMore) {
          return;
        }
        this.pageOfficeParams.pageNo++;
        this.getOfficeDataList(true);
      },
      // table 下滑加载更多
      loadNextPage() {
        if (this.tlm_noMore) {
          return;
        }
        this.pageParams.pageNo++;
        this.getDataList();
      },
      handleClick(data) {
        // tab 的切换方法
      },
      async setPatient(row, index) {
        this.$showLoading();
        try {
          const accountInfo = await service.getAccountInfo(row.patientId);
          const patientBaseInfo = await service.getPatientBaseInfo(row.patientId);
          if (accountInfo.code === 1 && patientBaseInfo.code === 1) {
            let baseInfo = patientBaseInfo.data.archInfo;
            let address =
              Array.isArray(patientBaseInfo.data.archAddrList) &&
              patientBaseInfo.data.archAddrList.length > 0
                ? patientBaseInfo.data.archAddrList[0].detailAddr
                : "";
            Object.assign(this.patientInfo, baseInfo, {
              address,
              balanceMoney: accountInfo.data.balanceMoney
            });
            row = {
              ...row,
              address,
              balanceMoney: accountInfo.data.balanceMoney
            };
          }
          this.changeRecPatientData(row);
          this.setCurrentTitle({
            title: "patient"
          });

          this.$hideLoading();
        } catch (error) {
          console.log(error);
          this.$hideLoading();
          this.$message.error(error.msg || "查询患者接口报错");
        }
      },
      async search(form) {
        // 搜索方法  查询患者  获取预约列表
        try {
          this.tlm_isLoading = true;
          this.formObj = form;
          this.tableLeftData = [];
          this.$hideLoading();
          this.getDataList();
          this.tlm_isLoading = false;
        } catch (error) {
          console.log(error);
          this.tlm_isLoading = false;
          this.$hideLoading();
        }
      },
      async getDataList() {
        // 查询预约列表
        try {
          const response = await service.getRecordList({
            search: this.formObj.search || "",
            ...this.pageParams
          });
          if (response.code === 1 && response.data) {
            this.tableLeftData.push(...response.data);
            this.pageParams.total = response.total;
          }
          this.tlm_isLoading = false;
        } catch (error) {
          console.log(error);
          this.tlm_isLoading = false;
          this.$message.error(error.msg || "查询预约列表报错");
        }
      },
      readCard(val) {
        // 读卡方法
        this.readCardFunc(val);
      },
      async readCardFunc(val) {
        try {
          if (val.search == "") {
            this.$message.warning("请输入卡号");
            return;
          }
          this.$showLoading();
          const {data} = await service.getCardDetailInfo({
            cardNum: val.search || ""
          });

          // 清除患者信息中的visitCode  重要！！！(会影响后边开电子申请流程)
          this.$delete(data, "visitCode");

          this.patientInfo = {...data};
          this.tableLeftData = [data];
          if (data && data.patientId) {
            const accountInfo = await service.getAccountInfo(data.patientId);
            this.balanceMoney = accountInfo.data.balanceMoney || "";
            this.info = {
              ...data,
              ...accountInfo.data
            };
          } else {
            this.$message.info("查无此人，请输入正确卡号");
          }
          this.changeRecPatientData(this.info);
          this.$hideLoading();
        } catch (error) {
          console.log(error, "error");
          this.$hideLoading();
          this.$message.error(error.msg);
        }
      },
      messageHandler() {
      }
    }
  }
</script>

<style scoped>

</style>
