<template>
  <div class="height100" style="padding: 20px">
    <el-table
      :data="showData.referral"
      border
      width="100%"
      height="100%"
      element-tlm_isLoading-text="加载中..."
      stripe
      v-loadmore="loadNextPage"
      v-loading="tlm_isLoading"
      @row-click="rowClick"
    >
      <!-- v-loadmore="{noMoreVar: 'tlm_noMore',loadingVar: 'tlm_isLoading',value: loadNextPage}" -->
      <el-table-column prop="visitCode" label="门诊号" min-width="100" align="center"></el-table-column>
      <el-table-column prop="patientName" label="姓名" min-width="100" align="center"></el-table-column>
      <el-table-column prop="operate" label="操作" min-width="80" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="handlePatientReferral(scope.row)"
          >{{ scope.row.optStr }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {saveSign, updateSign, findByPatientId} from "@/api/cis/order/order";
  import {
    getPatients2,
    getByPatientId,
    receive,
    findAllergy,
    selectPatientBySth
  } from "@/api/cis/visit/visit";
  import {mapActions, mapGetters} from "vuex";

  export default {
    name: "patientInf",
    data() {
      return {
        //分页信息
        pageNo: 1,
        pageSize: 10,
        total: 0,
        tlm_isLoading: false,
        params: {},
        rpForm: {
          type: "0"
        },
        ruleForm: {
          state: "",
          date1: []
        },
        showFilter: false,
        searchValue: "",
        searchReasult: "",
        activeName: "first",
        data: {
          bakList: [],
          referral: []
        },
        showData: {
          bakList: [],
          referral: []
        },
        referralInit: []
      };
    },
    mounted() {
      let date1 = new Date();
      let newDay =
        date1.getFullYear() +
        "-" +
        (date1.getMonth() + 1) +
        "-" +
        date1.getDate();
      let start = this.fun_date4Start(new Date(newDay.replace(/-/, "/")));
      let end = this.fun_date4End(new Date(newDay.replace(/-/, "/")));
      this.ruleForm.date1.push(start);
      this.ruleForm.date1.push(end);
      // this.loadData();
    },
    methods: {
      ...mapActions({
        changeRecPatientData: "base/changeRecPatientData"
      }),
      rowClick(row, index) {
        this.handlePatientReferral(row);

        getByPatientId({
          patientId: row.patientId
        }).then(resData => {
          console.log(row, "row");
          console.log(resData, "---resData");
        });
      },
      submitForm(formName) {
        // eslint-disable-next-line consistent-return
        this.$refs[formName].validate(valid => {
          if (valid) {
            let data = {};

            if (this.ruleForm.date1 == null) {
              this.ruleForm.date1 = [];
              let date1 = new Date();
              let newDay =
                date1.getFullYear() +
                "-" +
                (date1.getMonth() + 1) +
                "-" +
                date1.getDate();
              let start = this.fun_date4Start(new Date(newDay.replace(/-/, "/")));
              let end = this.fun_date4End(new Date(newDay.replace(/-/, "/")));
              this.ruleForm.date1.push(start);
              this.ruleForm.date1.push(end);
            }
            if (this.searchValue != null && this.searchValue != "") {
              data = {
                searchValue: this.searchValue
              };
              selectPatientBySth(data).then(res => {
                this.searchReasult = "";
                for (let i = 0; i < res.data.length; i++) {
                  this.searchReasult += res.data[i] + ",";
                }
                this.loadData();
                this.data.referral = [...this.referralInit];
              });
            } else {
              this.searchReasult = [];
              this.loadData();
              this.data.referral = [...this.referralInit];
            }
          } else {
            return false;
          }
          this.showFilter = false;
        });
      },
      handlePatientReferral(row) {
        this.changeRecPatientData(row);
      },
      async loadData(queryData) {
        // console.log(queryData, "1queryData");
        this.tlm_isLoading = true;
        this.showData = {
          referral: [],
          bakList: []
        };
        this.data = {
          referral: [],
          bakList: []
        };

        let date1 = new Date();
        let newDay =
          date1.getFullYear() +
          "-" +
          (date1.getMonth() + 1) +
          "-" +
          date1.getDate();
        // let data = {
        //   startDate: this.fun_date4TodayStart(new Date(newDay.replace(/-/, "/"))),
        //   stopDate: this.fun_date4End(new Date(newDay.replace(/-/, "/"))),
        //   visitCode: queryData.visitCode || "",
        //   ouptDeptId: queryData.technicalOffices || "",
        //   patientIds: queryData.patientIds || "",
        //   type:'third'
        // };
        // console.log(queryData, "queryData");
        // // 左侧边栏查询条件
        // queryData && Object.assign(data, queryData);
        // getPatients2(data, false)
        //   .then(res => {
        //     console.log(res, "res");
        //     this.data.bakList = res.data;
        //     for (let i = 0; i < this.data.bakList.length; i++) {
        //       // if (this.data.bakList[i].recordStatus == 6) {
        //       this.data.bakList[i].optStr = "转诊";
        //       this.data.referral.push(this.data.bakList[i]);
        //       // }
        //       // patientIds += res.data[i].patientId + ",";
        //     }
        //     this.showData = this.data;
        //     this.tlm_isLoading = false;
        //   })
        //   .catch(err => {
        //     this.tlm_isLoading = false;
        //   });
        let data = {
          startDate: this.fun_date4TodayStart(new Date(newDay.replace(/-/, "/"))),
          stopDate: this.fun_date4End(new Date(newDay.replace(/-/, "/"))),
          visitCode: queryData.visitCode || "",
          ouptDeptId: queryData.technicalOffices || "",
          patientIds: queryData.patientIds || "",
          type: "third"
        };
        queryData && Object.assign(data, queryData);
        queryData.startDate = data.startDate;
        queryData.stopDate = data.stopDate;
        console.log(queryData, "queryData");
        this.params = queryData;
        await getPatients2(queryData, false)
          .then(res => {
            this.referralInit = [];
            console.log(res, "res");
            this.data.bakList = res.data;
            for (let i = 0; i < this.data.bakList.length; i++) {
              // if (this.data.bakList[i].recordStatus == 6) {
              this.data.bakList[i].optStr = "转诊";
              // this.data.referral.push(this.data.bakList[i]);
              this.referralInit.push(this.data.bakList[i]);
              // }
              // patientIds += res.data[i].patientId + ",";
            }
            this.showData = this.data;
            this.total = res.total;
            this.tlm_isLoading = false;
          })
          .catch(err => {
            this.tlm_isLoading = false;
          });
      },
      async loadNextPage() {
        console.log("我加载了一次");
        if (this.tlm_noMore) {
          return;
        }
        this.pageNo++;
        await this.load();
      },
      //滑动加载更多信息
      async load() {
        // console.log("我加载了一次");
        this.tlm_isLoading = true;
        // ------------
        let referral = [...this.showData.referral];
        console.log(referral, referral.length, "原始数据");
        //获取分页列表
        let param = {
          ...this.params,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        };
        await this.loadData(param);
        this.showData.referral = [...referral.concat(this.referralInit)];
        console.log(
          this.showData.referral,
          this.showData.referral.length,
          "合并后的数据"
        );
        this.tlm_isLoading = false;
      },
      fun_date4Start(date1) {
        let date2 = new Date(date1);
        date2.setDate(date1.getDate() - 2);
        let time2 =
          date2.getFullYear() +
          "-" +
          (date2.getMonth() + 1) +
          "-" +
          date2.getDate();
        return new Date(time2.replace(/-/, "/"));
      },
      fun_date4TodayStart(date1) {
        let date2 = new Date(date1);
        date2.setDate(date1.getDate());
        let time2 =
          date2.getFullYear() +
          "-" +
          (date2.getMonth() + 1) +
          "-" +
          date2.getDate();
        return new Date(time2.replace(/-/, "/"));
      },
      fun_date4End(date1) {
        let date2 = new Date(date1);
        date2.setDate(date1.getDate() + 1);
        let time2 =
          date2.getFullYear() +
          "-" +
          (date2.getMonth() + 1) +
          "-" +
          date2.getDate();
        return new Date(time2.replace(/-/, "/"));
      },
      selectPatientBySth() {
        this.showData = [];
        if (this.searchValue != "" && this.searchValue != null) {
          this.showData.bakList = [];
          let data = {
            searchValue: this.searchValue
          };
          selectPatientBySth(data).then(res => {
            this.searchReasult = res.data;
            this.submitForm("ruleForm");
          });
        } else {
          this.submitForm("ruleForm");
        }
      }
    },
    computed: {
      tlm_noMore() {
        return Math.ceil(this.total / this.pageSize) <= this.pageNo;
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
