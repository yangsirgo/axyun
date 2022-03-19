<template>
  <div class="jingdika">
    <div class="title">静滴卡</div>
    <div class="info">
      <span class="info-item">家床: <i>{{info.zhuyuan}}</i></span>
      <span class="info-item">床位: <i>{{info.chuangweihao}}</i></span>
      <span class="info-item">姓名: <i>{{info.xingming}}</i></span>
      <span class="info-item">性别: <i>{{info.xingbie}}</i></span>
      <span class="info-item">年龄: <i>{{info.nianling}}</i></span>
      <span class="info-item">诊断: <i>{{info.zhenduan}}</i></span>
    </div>
    <div class="table-info">
      <el-table
        :data="tableData"
        border
        style="width: 900px">
        <el-table-column
          prop="group"
          label="组"
          width="38"
          align="center">
        </el-table-column>
        <el-table-column
          prop="date"
          label="开始时间"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="yizhu"
          label="医嘱名称/规格"
          width="350"
          align="center">
        </el-table-column>
        <el-table-column
          prop="jiliang"
          label="剂量"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="pinci"
          label="频次"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          label="药物核对"
          width="100"
          align="center">
          <el-table-column
            prop="amount1"
            label=""
            width="30"
            align="center">
          </el-table-column>
          <el-table-column
            prop="amount2"
            label=""
            width="30"
            align="center">
          </el-table-column>
          <el-table-column
            prop="amount3"
            label=""
            width="30"
            align="center">
          </el-table-column>
          <el-table-column
            prop="amount4"
            label=""
            width="30"
            align="center">
          </el-table-column>
          <el-table-column
            prop="amount5"
            label=""
            width="30"
            align="center">
          </el-table-column>
          <el-table-column
            prop="amount6"
            label=""
            width="30"
            align="center">
          </el-table-column>
          <el-table-column
            prop="amount7"
            label=""
            width="30"
            align="center">
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div class="print-time clearfix">
      <div class="print-time-cont">打印时间: <i>{{info.printTime}}</i></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "jingdika",
    data() {
      return {
        info: {
          zhuyuan: 'A500577',
          chuangweihao: '48006',
          xingming: '呼吸测二',
          xingbie: '女',
          nianling: '31岁',
          zhenduan: '真菌性角膜炎',
          printTime: '2018年12月30日 14:12'
        },
        tableData: [{
          date: '2018-12-16',
          yizhu: '葡萄糖注射液',
          jiliang: '100ml',
          pinci: 'qd',
          amount1: '',
          amount2: '',
          amount3: '',
          amount4: '',
          amount5: '',
          amount6: '',
          amount7: ''
        },{
          date: '2018-12-16',
          yizhu: '葡萄糖注射液',
          jiliang: '100ml',
          pinci: 'qd',
          amount1: '',
          amount2: '',
          amount3: '',
          amount4: '',
          amount5: '',
          amount6: '',
          amount7: ''
        },{
          date: '2018-12-16',
          yizhu: '葡萄糖注射液',
          jiliang: '100ml',
          pinci: 'qd',
          amount1: '',
          amount2: '',
          amount3: '',
          amount4: '',
          amount5: '',
          amount6: '',
          amount7: ''
        }]
      }
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  i {
    font-style: normal;
  }

  .jingdika {
    width: 920px;
    margin: 20px auto;
    padding: 10px;
    background-color: #fff;

    .title {
      margin-bottom: 10px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }

    .info {
      .info-item {
        display: inline-block;
        margin: 0 0 10px 20px;
        font-size: 14px;
        font-weight: bold;

        i {
          display: inline-block;
          min-width: 50px;
          font-weight: normal;
        }
      }
    }

    .print-time {
      margin-top: 200px;

      .print-time-cont {
        width: 30%;
        float: right;
      }
    }
  }
</style>
