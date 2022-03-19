<template>
  <el-form inline ref="queryForm" :model="allergyPatientInfoVO">
    <el-form-item>
      <el-date-picker
        v-model="value2"
        type="daterange"
        align="right"
        size="mini"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-input
        size="mini"
        placeholder="搜索病人"
        v-model="allergyPatientInfoVO.str"
        suffix-icon="el-icon-search"
        clearable>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="query()">查询</el-button>
    </el-form-item>
    <el-form-item right>
      <el-button type="primary">
        过敏登记
      </el-button>
    </el-form-item>
  </el-form>

</template>
<script>
  export default {
    data() {
      return {
        allergyPatientInfoVO: {doctorId: this.doctorId,  str: null},
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const endTime = new Date();
              const startTime = new Date();
              startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, endTime]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const endTime = new Date();
              const startTime = new Date();
              startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [startTime, endTime]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const endTime = new Date();
              const startTime = new Date();
              startTime.setTime(startTime.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [startTime, endTime]);
            }
          }]
        },
        value2: ''
      };
    },
    methods: {
      query() {
        // console.log(this.allergyPatientInfoVO);
        // console.log(this.value2);
      }
    }
  }

</script>
