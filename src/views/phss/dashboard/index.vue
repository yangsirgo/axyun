<template>
  <div class="dashboard">
    <header>
      <div class="dashboard_tabs">
        <div class="tab_pane_group">
          <div :class="tabPaneIndex==1?'tab_pane1':'tab_pane2'" @click="MenuSwitch(1)">个人指标</div>
          <div :class="tabPaneIndex==2?'tab_pane1':'tab_pane2'" @click="MenuSwitch(2)">医院指标</div>
        </div>
        <div class="tab_line"></div>
      </div>
      <main>
        <div v-if="tabPaneIndex == 1" class="FastStatistics">
          <FastStatistics class="FastStatistic" v-for="(v,i) in userList" :key="i" :percentage="v" />
        </div>
        <div v-if="tabPaneIndex == 2" class="FastStatistics">
          <FastStatistics class="FastStatistic" v-for="(v,i) in hosList" :key="i" :percentage="v" />
        </div>
      </main>
    </header>
    <footer>
      <div class="dashboard_tabs">
        <div class="tab_pane_group" style="background-color: #F1F4F6;">
          <!-- <div
            :class="footerTabPaneIndex==1?'tab_pane1':'tab_pane2'"
            @click="MenuSwitchFooter(1)"
          >待建档</div>-->
          <div :class="footerTabPaneIndex==2?'tab_pane1':'tab_pane2'" @click="MenuSwitchFooter(2)">待服务</div>
          <!-- <div
            :class="footerTabPaneIndex==3?'tab_pane1':'tab_pane2'"
            @click="MenuSwitchFooter(3)"
          >家庭医生签约到期</div>-->
        </div>
        <!-- <div class="tab_line"></div> -->
      </div>
      <main>
        <div class="dashboard_tab2s">
          <div class="tab_pane_group">
            <div :class="reqParams.dateType=='WEEK'?'tab_pane1':'tab_pane2'" @click="changeCondition('WEEK')">
              <div>本周</div>
              <div class="line" v-if="reqParams.dateType=='WEEK'"></div>
            </div>
            <div :class="reqParams.dateType=='MONTH'?'tab_pane1':'tab_pane2'" @click="changeCondition('MONTH')">
              <div>本月</div>
              <div class="line" v-if="reqParams.dateType=='MONTH'"></div>
            </div>
            <div :class="reqParams.dateType=='QUARTER'?'tab_pane1':'tab_pane2'" @click="changeCondition('QUARTER')">
              <div>本季度</div>
              <div class="line" v-if="reqParams.dateType=='QUARTER'"></div>
            </div>
          </div>
        </div>
        <div class="more" @click="goMore('/phss/healthRecord')">
          更多
          <i class="iconfont icongengduo-you"></i>
        </div>
        <div class="main_table">
          <el-table :data="tableData" style="width: 100%" border :show-header="false">
            <el-table-column prop="rsdtTypes" label="居民类型" width="180"></el-table-column>
            <el-table-column prop="rsdt_name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="id_no" label="身份证号"></el-table-column>
            <el-table-column prop="sex" label="性别"></el-table-column>
            <el-table-column prop="age" label="年龄"></el-table-column>
            <el-table-column prop="telephone" label="手机号"></el-table-column>
            <el-table-column prop="cmnt_cmt_name" label="居委会"></el-table-column>
            <el-table-column prop="current_address" label="现住址"></el-table-column>
            <el-table-column prop="responsible_dr_name" label="责任医生"></el-table-column>
            <el-table-column prop="next_follow_up_date" label="预约时间"></el-table-column>
            <el-table-column prop="form_name" label="随访类型"></el-table-column>
          </el-table>
        </div>
      </main>
    </footer>
  </div>
</template>

<script>
  import FastStatistics from "./components/FastStatistics";
  import { queryWaitForServiceDocIndex } from "@/api/phss/docIndex/docIndex";
  import { onPost, onGet } from "@/api/public/public";
  const url = "/phss";
  export default {
    name: "dashboard",
    components: { FastStatistics },
    props: {
      // props: {
      //   type: String
      // }
    },
    data() {
      return {
        tabPaneIndex: 1,
        footerTabPaneIndex: 2,
        userList: [],
        hosList: [],
        tableData: [],
        total: 0,
        reqParams: {
          dateType: "WEEK"
        }
      };
    },
    created() {
      this.onQueryWaitForServiceDocIndex();
      this.getDashBoardData();
    },
    mounted() {},
    methods: {
      // 查询
      onQueryWaitForServiceDocIndex() {
        queryWaitForServiceDocIndex(this.reqParams)
          .then(res => {
            if (res.code === 1) {
              this.tableData = res.data;
              this.total = res.total;
            } else {
              this.$message("获取数据失败");
              this.total = 0;
              this.tableData = [];
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      getDashBoardData() {
        onPost({ url: url +  "/homePage/getDashBoardData", data: null })
          .then(res => {
            console.log(res);
            if (res.code === 1) {
              this.userList = res.data.resultUser;
              this.hosList = res.data.resultHosp;
            } else {
              this.userList = [];
              this.hosList = [];
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      changeCondition(val) {
        this.reqParams.dateType = val;
        this.onQueryWaitForServiceDocIndex();
      },
      goMore(path) {
        this.$router.push(path);
      },
      // 按钮切换
      MenuSwitch(i) {
        this.tabPaneIndex = i;
      },
      // 按钮切换
      MenuSwitchFooter(i) {
        this.footerTabPaneIndex = i;
      }
    },
    watch: {},
    computed: {}
  };
</script>

<style lang="scss" scoped>
  .dashboard {
    padding: 30px;
    background: #ebeef0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;

    .dashboard_tabs {
      .tab_pane_group {
        display: flex;

        .tab_pane1 {
          cursor: pointer;
          text-align: center;
          padding: 0 20px;
          // width: 96px;
          height: 30px;
          line-height: 30px;
          background: #2c4583;
          border-radius: 4px 4px 0px 0px;
          font-size: 14px;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
        }

        .tab_pane2 {
          cursor: pointer;
          text-align: center;
          // width: 96px;
          padding: 0 20px;
          height: 30px;
          line-height: 30px;
          background: #f0f3f5;
          border-radius: 4px 4px 0px 0px;
          font-size: 14px;
          color: rgba(50, 53, 59, 1);
        }
      }

      .tab_line {
        width: 100%;
        height: 2px;
        background: #2c4583;
      }
    }

    .dashboard_tab2s {
      margin-left: 10px;

      .tab_pane_group {
        display: flex;

        .tab_pane1 {
          cursor: pointer;
          text-align: center;
          padding: 0 10px;
          line-height: 20px;
          font-size: 14px;
          font-weight: bold;
          color: rgba(43, 69, 131, 1);
        }

        .tab_pane2 {
          cursor: pointer;
          text-align: center;
          line-height: 20px;
          padding: 0 10px;
          font-size: 14px;
          color: rgba(148, 157, 163, 1);
        }

        .line {
          width: 100%;
          height: 2px;
          background: rgba(43, 69, 131, 1);
        }
      }

      .tab_line {
        width: 100%;
        height: 2px;
        background: #2c4583;
      }
    }

    header {
      main {
        margin-top: 10px;

        .FastStatistics {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 10px;
          margin-left: -10px;

          .FastStatistic {
            margin-left: 10px;
          }
        }
      }
    }

    footer {
      margin-top: 15px;
      // height: calc(100% - 670px);
      height: calc(100% - 440px);
      background-color: #fff;

      main {
        background-color: #fff;
        margin-top: 10px;

        .more {
          cursor: pointer;
          float: right;
          margin-right: 30px;
          margin-bottom: 15px;
          font-size: 14px;
          color: rgba(46, 50, 58, 1);
        }

        .main_table {
          padding: 0 20px;
        }
      }
    }
  }

  .dashboard::-webkit-scrollbar {
    position: absolute;
    right: 0;
    width: 10px;
    height: 10px;
  }

  .dashboard::-webkit-scrollbar-thumb {
    border-left: 2px solid #fff;
    border-right: 2px solid #fff;
    border-radius: 4px;
    background-color: #cccccc;
  }

  .dashboard::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color: #f1f1f1;
  }
</style>
