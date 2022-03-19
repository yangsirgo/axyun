<template>
  <div class="container">
    <div v-if="radio == 0" class="template">
      <div class="ratio">
        <div class="title">全院&nbsp;近一个月</div>
        <el-row>
          <el-col class="row-title" :span="14">预约占比</el-col>
          <el-col class="row-data" :span="10">{{appt.appt}}%</el-col>
        </el-row>
        <el-row>
          <el-col class="row-title" :span="14">挂号占比</el-col>
          <el-col class="row-data" :span="10">{{appt.reg}}%</el-col>
        </el-row>
        <el-row>
          <el-col class="row-title" :span="14">签到率</el-col>
          <el-col class="row-data" :span="10">{{appt.signIn}}%</el-col>
        </el-row>
      </div>
      <div class="title">科室预约人数top10</div>
      <div
        class="content"
        :class="{ fir: index == 0, sec: index == 1, thir: index == 2 }"
        v-for="(item, index) in departmentList"
        :key="index"
      >
        <el-row>
          <el-col :span="14">
            {{ index + 1 }}、
            <span
              tableName="sys_org"
              :conditionMap="{
                        org_type: '_DEPT_',
                        id: item.deptId
                      }"
              columns="org_nm"
              v-tableTransform
            ></span>
          </el-col>
          <el-col :span="10">{{ item.num }}</el-col>
        </el-row>
      </div>
    </div>
    <div v-if="radio == 1" class="template patient">
      <div class="ratio">
        <div class="title">患者近10次预约信息</div>
        <div class="content doc">
          <el-row v-for="(item, index) in appointmentList" :key="index">
            <el-col class="row-title" :span="9">{{ item.date }}</el-col>
            <el-col class="row-title" :span="7">{{ item.dept }}</el-col>
            <el-col
              class="row-data"
              :class="{
                fir: item.finished == '未就诊',
                sec: item.finished == '已就诊'
              }"
              :span="8"
            >{{ item.finished }}</el-col>
          </el-row>
        </div>
      </div>
      <el-row>
        <el-col class="row-title" :span="14">签到率</el-col>
        <el-col class="row-data" :span="10">95%</el-col>
      </el-row>
    </div>
    <div v-if="radio == 3" class="template dept">
      <div class="ratio">
        <div class="title">
          <span
            tableName="sys_org"
            :conditionMap="{
                        org_type: '_DEPT_',
                        id: appt.ouptDeptId
                      }"
            columns="org_nm"
            v-tableTransform
          ></span>&nbsp;近一个月
        </div>
        <el-row>
          <el-col class="row-title" :span="14">预约占比</el-col>
          <el-col class="row-data" :span="10">{{appt.appt}}%</el-col>
        </el-row>
        <el-row>
          <el-col class="row-title" :span="14">挂号占比</el-col>
          <el-col class="row-data" :span="10">{{appt.reg}}%</el-col>
        </el-row>
        <el-row>
          <el-col class="row-title" :span="14">签到率</el-col>
          <el-col class="row-data" :span="10">{{appt.signIn}}%</el-col>
        </el-row>
      </div>
      <div class="title">医生预约挂号数量top10</div>
      <div
        class="content"
        :class="{ fir: index == 0, sec: index == 1, thir: index == 2 }"
        v-for="(item, index) in docList"
        :key="index"
      >
        <el-row>
          <el-col :span="14">{{ index + 1 }} {{ item.doctorName }}</el-col>
          <el-col :span="10">{{ item.num }}</el-col>
        </el-row>
      </div>
    </div>
    <div v-if="radio == 2" class="template doc">
      <div class="ratio">
        <div class="title">阮浩然医生&nbsp;近一个月</div>
        <el-row>
          <el-col class="row-title" :span="14">预约占比</el-col>
          <el-col class="row-data" :span="10">35%</el-col>
        </el-row>
        <el-row>
          <el-col class="row-title" :span="14">挂号占比</el-col>
          <el-col class="row-data" :span="10">65%</el-col>
        </el-row>
        <el-row>
          <el-col class="row-title" :span="14">签到率</el-col>
          <el-col class="row-data" :span="10">95%</el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/api/appointment/appointment";
import { mapGetters } from "vuex";
export default {
  name: "appointment",
  data() {
    return {
      loading: false,
      radio: "0",
      departmentList: [],
      docList: [],
      appointmentList: [
        { date: "2019-08-13", dept: "内分泌科", finished: "未就诊" },
        { date: "2019-07-23", dept: "泌尿科", finished: "已就诊" },
        { date: "2019-07-10", dept: "泌尿科", finished: "已就诊" }
      ],
      list: [], // 统计集合
      appt: {
        appt: 0,
        reg: 0,
        signIn: 0,
        ouptDeptId: ""
      } // 统计对象
    };
  },
  computed: {
    ...mapGetters("base", ["currentTitle"]),
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    currentTitle: {
      handler(data) {
        switch (data.title) {
          case "patient":
            this.radio = 1;
            break;
          case "office":
            this.radio = 3;
            this.appt.ouptDeptId = data.deptId;
            this.getDoctorList();
            break;
          case "doctor":
            this.radio = 2;
            break;
          default:
            this.radio = 0;
            break;
        }
      },
      deep: true,
      immediate: true
    },
    deptId: {
      handler(val) {
        this.appt.ouptDeptId = val;
        this.getDoctorList();
      },
      immediate: true
    }
  },
  methods: {
    handleNodeClick() {},
    async getDoctorList() {
      try {
        this.loading = true;
        this.departmentList = [];
        this.docList = [];
        let apptMode = [];
        let signIn = [];
        this.list = [];
        const res = await service.getApptInfo({ouptDeptId:this.appt.ouptDeptId});
        this.list = res.data;
        this.list.forEach(item => {
          if (item.deptId) {
            this.departmentList.push(item);
          } else if (item.appointmentMode) {
            apptMode.push(item);
          } else if (item.recordStatus) {
            signIn.push(item);
          }else if(item.doctorName){
            this.docList.push(item);
          }
        });
        this.getAppt(apptMode, signIn);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg);
      }
    },
    // 计算签到率...
    getAppt(apptMode, signIn) {
      try {
        let a = 0;
        let b = 0;
        apptMode.forEach(item => {
          if (item.appointmentMode == "1") {
            a = a + parseInt(item.num); // 挂号总数
          } else {
            b = b + parseInt(item.num); // 预约总数（非挂号）
          }
        });
        this.appt.appt = ((b / (a + b)) * 100).toFixed(2) || 0; // 预约率
        this.appt.reg = ((a / (a + b)) * 100).toFixed(2) || 0; // 挂号率
        a = 0;
        b = 0;
        signIn.forEach(val => {
          if (val.recordStatus == "1") {
            a = a + parseInt(val.num); // 未签到总数
          } else {
            b = b + parseInt(val.num); // 已签到总数
          }
        });
        this.appt.signIn = ((b / (a + b)) * 100).toFixed(2) || 0; // 签到率
        if(apptMode.length <= 0){
          this.appt.appt = 0; // 预约率
          this.appt.reg =  0; // 挂号率
        }
        if(signIn.length <= 0){
          this.appt.signIn = 0; // 签到率
        }
      } catch (error) {
        console.info(error)
      }
      
    }
  }
};
</script>

<style lang='scss' scoped>
.container {
  height: 100%;
  width: 100%;
  padding: 15px;
  .radio {
    padding: 0px 5px 15px 5px;
    border-bottom: 1px solid #e4e4e4;
  }
  .template {
    font-size: 14px;
    padding: 0 5px 15px 5px;
    .ratio {
      border-bottom: 1px solid #e4e4e4;
      margin-bottom: 15px;
    }
    .row-title {
      
      font-weight: 400;
      color: #949da3;
    }
    .row-data {
      
      font-weight: bold;
      color: #ff4040;
      &.fir {
        color: #d3c1c1;
        font-weight: bold;
      }
      &.sec {
        font-weight: bold;
        color: rgb(102, 204, 150);
      }
    }
    .el-row {
      margin-bottom: 15px;
    }
    .title {
      height: 24px;
      font-size: 15px;
      
      font-weight: bold;
      color: rgba(46, 50, 58, 1);
      line-height: 24px;
      margin-bottom: 10px;
    }
    .content {
      margin-bottom: 5px;
      color: #606266;
      &.fir {
        color: #e1140a;
        font-weight: bold;
      }
      &.sec {
        font-weight: bold;
        color: #ff4a13;
      }
      &.thir {
        font-weight: bold;
        color: #f7a820;
      }
    }
  }
}
</style>
