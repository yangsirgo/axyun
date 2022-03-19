<template>
  <el-card class="height100 padding20 content">
    <el-table
      :data="table.data"
      height="100%"
      border
      style="width: 100%"
      stripe
      v-loadmore="loadNext"
      @select="handleSelectUser"
      @select-all="handleSelectUser"
      @row-click="handleSelectRow"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column
        v-for="(item, index) in table.column"
        :key="index"
        :label="item.label"
        :min-width="item.width"
        :fixed="item.fixed"
      >
        <template slot-scope="scope">
          <div v-if="item.prop === 'patient'">
            <span>{{scope.row.patientName}}</span>
            <span>{{scope.row.patientGender}}</span>
            <span>{{scope.row.patientAge}}岁</span>
          </div>
          <div v-else>{{scope.row[item.prop]}}</div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "patientsList", // 患者列表
  data() {
    return {
      tlm_isLoading: false,
      tlm_noMore: false,
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共条数
        pageSize: 20 // 每页数据条数
      },
      table: {
        column: [
          {
            prop: "hosCode",
            label: "住院号",
            width: 180,
            fixed: true
          },
          {
            prop: "num",
            label: "住院次数",
            width: 120,
            fixed: true
          },
          {
            prop: "patient",
            label: "患者",
            width: 180,
            fixed: true
          },
          {
            prop: "medical_code",
            label: "病案号",
            width: 180,
            fixed: true
          },
          {
            prop: "in_time",
            label: "入院时间",
            width: 180,
            fixed: false
          },
          {
            prop: "admissionMode",
            label: "入院途径",
            width: 180,
            fixed: false
          },
          {
            prop: "planDepart",
            label: "计划科室",
            width: 180,
            fixed: false
          },
          {
            prop: "doctor",
            label: "入院医生",
            width: 180,
            fixed: false
          }
        ],
        data: [
          {
            hosCode: "000078732",
            num: 12,
            patientName: "黄逸夫",
            patientGender: "男",
            patientAge: 33,
            medical_code: "83818",
            in_condition: "临床未确定",
            in_time: "2019-06-01 18:30",
            admissionMode: "门诊",
            planDepart: "泌尿外科",
            doctor: "黄大贵"
          },
          {
            hosCode: "000078732",
            num: 12,
            patientName: "黄逸夫",
            patientGender: "男",
            patientAge: 33,
            medical_code: "83818",
            in_condition: "临床未确定",
            in_time: "2019-06-01 18:30",
            admissionMode: "门诊",
            planDepart: "泌尿外科",
            doctor: "黄大贵"
          }
        ]
      }
    };
  },
  methods: {
    loadNext() {
      // 滑动加载 method
    },
    handleSelectUser(selection) {
      console.log(selection);
      // 将已选中患者列表 selection 保存
    },
    handleSelectRow(row, column) {
      // 选中单行操作
      console.log(row);
    }
  }
};
</script>

<style scoped>
</style>
