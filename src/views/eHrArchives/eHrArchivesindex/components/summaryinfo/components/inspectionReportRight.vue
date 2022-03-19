<template>
  <div class="inspectionReportRight" v-html="tableDataHtml">
  <!--  <h4 style="width: 100%;text-align: center;">检验申请单</h4>
    <el-col :span="24" style="margin-bottom: 15px;">
      <el-col :span="8">
        <span>姓名:</span>
        <span>{{ inspectionReportLeftObjData.patientName || '--'}}</span>
      </el-col>
      <el-col :span="8">
        <span>性别:</span>
        <span :val="inspectionReportLeftObjData.patientSex || '--'" code="GENDER_CODE" v-codeTransform></span>
      </el-col>
      <el-col :span="8">
        <span>年龄:</span>
        <span>{{ inspectionReportLeftObjData.patientAge || '--'}}</span>
      </el-col>
    </el-col>
    <el-col :span="24" style="margin-bottom: 15px;">
      <el-col :span="8">
        <span>送检科室:</span>
        <span>{{ inspectionReportLeftObjData.deptName || '--' }}</span>
      </el-col>
      <el-col :span="8">
        <span>送检医生:</span>
        <span>{{ inspectionReportLeftObjData.execDoctorName || '--' }}</span>
      </el-col>
      <el-col :span="8">
        <span>标本类型:</span>
        <span :val="inspectionReportLeftObjData.sampleTypeCode || '--'" code="SpecimenCategoryCode" v-codeTransform></span>
      </el-col>
    </el-col>
    <el-col style="margin-bottom: 15px;">
      <el-table :data="tableData" max-height="400px" border style="width: 100%">
        <el-table-column prop="itemChargeName" label="项目名称"></el-table-column>
        <el-table-column prop="itemChargeType" label="项目类别"></el-table-column>
        <el-table-column prop="itemChargeDefaultNum" label="项目维护数量"></el-table-column>
        <el-table-column prop="itemChargePrice" label="项目单价"></el-table-column>
        <el-table-column prop="temChargeCode" label="项目代码"></el-table-column>
        <el-table-column prop="applyNum" label="申请总次数"></el-table-column>
        <el-table-column prop="chargeStatus" label="费用状态">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              {{
                scope.row.chargeStatus == '1'
                  ? '未收费'
                  : scope.row.chargeStatus == '2'
                  ? '已计费'
                  : scope.row.chargeStatus == '3'
                  ? '已收费'
                  : scope.row.chargeStatus == '4'
                  ? '部分退费'
                  : '全部退费'
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="refundNumber" label="退费次数"></el-table-column>
        <el-table-column prop="adjustSign" label="价格调整">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.adjustSign == '0' ? '未调整' : '调整' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <el-col :span="24" style="margin-bottom: 15px;">
      <el-col :span="8">
        <span>申请人:</span>
        <span>{{inspectionReportLeftObjData.createdByName}}</span>
      </el-col>
      <el-col :span="8">
        <span>申请时间:</span>
        <span>{{inspectionReportLeftObjData.createdAt}}</span>
      </el-col>

    </el-col>
    -->
    <!-- <el-col><el-pagination background layout="prev, pager, next" @current-change="currentChange" :page-size="10" :total="total"></el-pagination></el-col> -->
  </div>
</template>

<script>
import { selectEasApplyAssayDetail } from '@/api/eHrArchives/eHrArchives';
export default {
  name: 'index',
  props: ['inspectionReportLeftObj'],
  data() {
    return {
      tableDataHtml:'',
      inspectionReportLeftObjData: {},
      obj: {
        inspectId: '',
        pageNo: 1,
        pageSize: 10
      },
      total: 0
    };
  },

  computed: {},
  watch: {
    inspectionReportLeftObj: function() {
      this.inspectionReportLeftObjData = this.inspectionReportLeftObj;
      this.obj.inspectId = this.inspectionReportLeftObjData.id;
      if(this.obj.inspectId){
         this.selectEasApplyAssayDetail(this.obj);
      }

    }
  },
  created() {},
  methods: {
    // 分页
    currentChange(a) {
      // console.log(a);
      this.obj.pageNo = a;
      this.selectEasApplyAssayDetail(this.obj);
    },
    // 左侧列表
    async selectEasApplyAssayDetail(obj) {
      let result = await selectEasApplyAssayDetail(obj);
      if (result.code == '1') {
        if(result.data.length>0){
            this.tableDataHtml = result.data[0].content;
        }else{
           this.tableDataHtml = "暂时没有数据";
        }

      }
    }
  }
};
</script>

<style scoped lang="scss">
.inspectionReportRight >>> .td300:last-child {
  width: 50px;

}
.inspectionReportRight >>> .td300{
  width: 350px;

}
</style>
