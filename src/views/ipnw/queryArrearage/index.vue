<template>
  <div class="page-con">
    <div class="query-top">
      <span class="font-icon">
        <i class="icon iconfont icondacuikuandan"></i> 打催款单
      </span>
      <LSelectWithTitle
        style="margin-left: 20px;"
        :title="selectTitle"
        :value="selectValue"
      >
        <el-option
          v-for="item in selectList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </LSelectWithTitle>
      <div class="input-con"><el-input v-model="inputValue"></el-input></div>
      <div class="query-value">
        <el-input
          placeholder="住院号、病案号、姓名"
          suffix-icon="iconfont iconsousuo"
          v-model="inputName"
        >
        </el-input>
      </div>
      <el-button style="margin-left: 20px;" @click="queryData" type="primary"
        >查询</el-button
      >
    </div>
    <div class="query-table">
      <el-table
        header-cell-class-name="headerCls"
        row-class-name="rowStyleCls"
        ref="singleTable"
        :data="tabsList"
        highlight-current-row
        style="width: 100%"
        v-loadmore="load"
        stripe
        border
        v-loading="isLoading"
        element-loading-text="加载中..."
      >
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column
          v-for="item in tableColumn"
          :key="item.label"
          :label="item.label"
          :prop="item.prop"
          align="left"
          show-overflow-tooltip
          header-align="left"
          :min-width="item.width"
        >
          <!-- 状态列 处理 -->
          <template slot-scope="scope">
            <!-- 门诊号列 处理 -->
            <template v-if="item.prop === 'hospitalNum'">
              <span class="hospital-num">{{ scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'patientName'">
              <span
                >{{ scope.row.patientName }} {{ scope.row.patientSex }}
                {{ scope.row.patientAge }}岁</span
              >
            </template>
            <template v-else-if="item.prop === 'balance'">
              <span
                :class="{ 'abs-color': parseInt(scope.row[item.prop]) < 0 }"
                >{{ scope.row[item.prop] }}</span
              >
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

<script>
import LSelectWithTitle from "@/components/LSelectWithTitle.vue";
export default {
  name: "",
  methods: {
    queryData() {
      // 查询接口
    },
    initData() {
      // 初始化Table 数据
    }
  },
  mounted() {
    this.initData();
  },
  components: {
    LSelectWithTitle
  },
  data() {
    return {
      selectTitle: "余额",
      selectValue: "不足",
      inputValue: "",
      inputName: "",
      selectList: [
        {
          label: "不足",
          value: 0
        },
        {
          label: "足",
          value: 1
        },
        {
          label: "全部",
          value: 2
        }
      ],
      load: false,
      isLoading: false,
      // 表格数据源
      tabsList: [
        {
          id: 1,
          status: "在院",
          hospitalNum: "000088732",
          patientName: "李玉梅",
          patientSex: "女",
          patientAge: "22",
          bedNum: "04 床",
          currentOffice: "泌尿外科",
          inHospitalDate: "2019-06-01 08:30（30天）",
          inHospitalMethods: "窗口入院",
          pee: "100.00",
          prePay: "5000",
          balance: "4900",
          clearingForm: "本地自费"
        },
        {
          id: 2,
          status: "在院",
          hospitalNum: "000088732",
          patientName: "刘明海",
          patientSex: "男",
          patientAge: "34",
          bedNum: "05 床",
          currentOffice: "泌尿外科",
          inHospitalDate: "2019-06-11 09:00（41天）",
          inHospitalMethods: "窗口入院",
          pee: "2456.00",
          prePay: "5000",
          balance: "-1500.00",
          clearingForm: "本地自费"
        }
      ],
      tableColumn: [
        {
          prop: "status",
          label: "状态",
          width: "15"
        },
        {
          prop: "hospitalNum",
          label: "住院号",
          width: "30"
        },
        {
          prop: "patientName",
          label: "患者",
          width: "40"
        },
        {
          prop: "bedNum",
          label: "床号",
          width: "20"
        },
        {
          prop: "currentOffice",
          label: "当前科室",
          width: "40"
        },
        {
          prop: "inHospitalDate",
          label: "入院日期",
          width: "50"
        },
        {
          prop: "inHospitalMethods",
          label: "入院方式",
          width: "35"
        },
        {
          prop: "pee",
          label: "当前费用",
          width: "25"
        },
        {
          prop: "prePay",
          label: "预交金",
          width: "25"
        },
        {
          prop: "balance",
          label: "余额",
          width: "25"
        },
        {
          prop: "clearingForm",
          label: "结算方式",
          width: "30"
        }
      ]
    };
  }
};
</script>
<style lang='scss' scoped>
.page-con {
  padding: 20px;
  min-width: 1024px;
  width: 100%;
  height: 100%;
  font-size: 0;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .query-top {
    font-size: 14px;
    .input-con {
      display: inline-block;
      margin-left: 5px;
      width: 100px;
    }
    .query-value {
      display: inline-block;
      margin-left: 10px;
      width: 193px;
    }
  }
  .query-table {
    margin-top: 20px;
    .hospital-num {
      color: #3d7dfb;
    }
    .abs-color {
      color: $l-color-primary;
    }
  }
}
</style>
