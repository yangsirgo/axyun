<template>
  <div class="today-wait-sign">
    <div class="today-wait-top">
      <l-card-title class="clearfix card-header" ref="header">
        <span slot="left">今日待签到患者</span>
      </l-card-title>
      <el-input
        class="card-input"
        placeholder="医保卡号、身份证、就诊卡进行签到"
        suffix-icon="el-icon-search"
        v-model="searchValue"
        style="width: 280px; height:38px"
        v-on:keyup.native.enter="selectPatientBySth"
      >
      </el-input>
      <span class="readCard" @click="readPatientInfo"
        ><i class="icon iconfont iconduka"></i>读卡</span
      >
    </div>
    <!-- 今日待签患者列表 -->
    <div class="content">
      <el-table
        ref="tableElem"
        :data="tableData"
        stripe
        style="width: 100%;"
        v-loadmore="loadNextPage"
        element-loading-text="加载中..."
      >
        <el-table-column
          v-for="item in tableColumn"
          :key="item.label"
          :label="item.label"
          :min-width="item.width"
          :prop="item.prop"
          :align="item.align"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'appointmentNum'">
              <span
                class="outpatient-number"
                @click="showPatientSignModel(scope.row['patientId'])"
                >{{ scope.row[item.prop] }}</span
              >
            </template>
            <template v-else-if="item.prop === 'patientInfo'">
              <span class="patient-info-name">{{
                scope.row[item.prop].name
              }}</span>
              <span class="patient-info-sex">{{
                scope.row[item.prop].sex === 0 ? "男" : "女"
              }}</span>
              <span class="patient-info-age">{{
                scope.row[item.prop].age + "岁"
              }}</span>
              <span
                class="patient-info-source patient-info-border"
                :class="{
                  one: scope.row[item.prop].source === '114',
                  two: scope.row[item.prop].source == '微诊',
                  three: scope.row[item.prop].source === '平安'
                }"
                >{{ scope.row[item.prop].source }}</span
              >
            </template>
            <template v-else>
              <span>{{ scope.row[item.prop] }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗 -->
    <comfirm-order-model
      :show="isSignModelShow"
      :patientid="patientId"
      @closeConfirmSign="closeConfirmSignFlag"
    ></comfirm-order-model>
  </div>
</template>
<script>
import comfirmOrderModel from "./confirmOrderModel";
import {getNotArrivedList} from "@/api/appointment/appointment";

export default {
  components: {
    comfirmOrderModel
  },
  data() {
    return {
      // 控制弹窗是否显示
      isSignModelShow: false,
      tlm_isLoading: false, // 控制table loading
      curPage: 0, // 当前页数
      pageTotal: 5, // 总共页数
      pageSize: 20, // 每页数据条数
      patientId: 0, //具体患者的patientId
      tableColumn: [
        {
          prop: "queueUpNum",
          width: "80",
          label: "排队号",
          align: "left"
        },
        {
          prop: "appointmentNum",
          width: "120",
          label: "预约号",
          align: "left"
        },
        {
          prop: "patientInfo",
          width: "210",
          label: "患者",
          align: "left"
        },
        {
          prop: "appointmentTime",
          width: "90",
          label: "预约时间",
          align: "left"
        }
      ],
      searchValue: "", // 输入的数据
      // 渲染的数据源
      tableData: [
        {
          patientId: 1,
          queueUpNum: 1,
          appointmentNum: 20190102,
          patientInfo: {
            name: "吴兰",
            sex: 1,
            age: 23,
            source: "114"
          },
          appointmentTime: "15:30"
        },
        {
          patientId: 2,
          queueUpNum: 2,
          appointmentNum: 20190304,
          patientInfo: {
            name: "秦海明",
            sex: 0,
            age: 43,
            source: "平安"
          },
          appointmentTime: "19:30"
        },
        {
          patientId: 3,
          queueUpNum: 4,
          appointmentNum: 20190455,
          patientInfo: {
            name: "李秀丽1212121",
            sex: 1,
            age: 51,
            source: "微诊"
          },
          appointmentTime: "8:30"
        }
      ] // mack 数据
    };
  },
  mounted() {
    this.loadTable();
  },
  computed: {
    // 控制是否还可以继续加载
    tlm_noMore() {
      return this.pageTotal <= this.curPage;
    }
  },
  methods: {
    // 监听组件自定义事件 关闭弹窗
    closeConfirmSignFlag(data) {
      this.isSignModelShow = false;
    },
    // 点击读卡 可以读取卡中的信息出现  确认预约弹窗
    readPatientInfo() {
      // 获取到 patientId
      // TODO 写死 patientId
      let patientId = 123;
      this.$emit("showSignmodel", { patientId: patientId });
    },
    // 输入框回车查询具体患者
    selectPatientBySth() {
      console.log("查询患者");
      // 非空处理
      if (!this.searchValue) {
        return;
      }
      // 获取输入的 号码  传入接口
      let cardNum = this.searchValue;

      // TODO 异步请求获取数据
      this.loadTable();
    },
    // table加载下一页
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.curPage++;
      this.loadTable();
    },
    // 加载table数据
    async loadTable() {
      try {
        this.tlm_isLoading = true;
        // TODO await request 请求列表数据
        let res = getNotArrivedList({hosId:"1"}).then(res=>{
          console.log(res);
          if(res.code === 1){
            this.tableData = res.data;
          }
        });

        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
        this.$message.error(error.msg);
      }
    },
    // 点击门诊号 显示确认预约弹窗
    showPatientSignModel(patientId) {
      console.log("patientId", patientId);
      this.patientId = patientId;
      this.isSignModelShow = true;
      // this.$emit("showSignmodel", { patientId: patientId });
    }
  }
};
</script>

<style lang="scss" scoped>
.today-wait-sign {
  width: 100%;
  height: 100%;
  font-size: 0;
  background-color: #fff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .today-wait-top {
    padding: 0 20px;
    .card-input {
      font-size: 14px;
      
      .el-input__inner {
        height: 38px !important;
      }
    }
    .readCard {
      display: inline-block;
      margin-left: 10px;
      width: 170px;
      height: 38px;
      background: rgba(19, 71, 150, 1);
      border-radius: 2px;
      cursor: pointer;
      color: #fff;
      line-height: 38px;
      text-align: center;
      font-size: 14px;
      
      font-weight: 500;
    }
  }
  .content {
    margin-top: 20px;
    .outpatient-number {
      cursor: pointer;
      color: #3d7dfb;
    }
    .patient-info-name {
      display: inline-block;
      width: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: bottom;
      color: #2e323a;
    }
    .patient-info-sex {
      display: inline-block;
      margin-left: 10px;
      color: #2e323a;
    }
    .patient-info-age {
      display: inline-block;
      margin-left: 10px;
      color: #2e323a;
    }
    .patient-info-source {
      margin-left: 10px;
      color: #2e323a;
    }
    .patient-info-border {
      display: inline-block;
      width: 32px;
      height: 22px;
      line-height: 20px;
      font-size: 12px;
      text-align: center;
      border-radius: 2px;
      border: 1px solid rgba(228, 228, 228, 1);
    }
    .one {
      color: #e1140a;
    }
    .two {
      color: #134796;
    }
    .three {
      color: $l-color-primary;
    }
  }
}
</style>
