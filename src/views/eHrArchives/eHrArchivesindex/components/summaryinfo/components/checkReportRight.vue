<template>
  <div class="inspectionReportRight" v-html="tableDataHtml">

  </div>
</template>

<script>
import { selectEasApplyExamDetail } from '@/api/eHrArchives/eHrArchives';
export default {
  name: 'index',
  props: ['inspectionReportLeftObj'],
  data() {
    return {
      tableDataHtml:'',
      inspectionReportLeftObjData: {},
      obj: {
        checkId: '',
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
      this.obj.checkId = this.inspectionReportLeftObjData.id;
      this.selectEasApplyExamDetail(this.obj);
    }
  },
  created() {},
  methods: {
    // 分页
    currentChange(a) {
      // console.log(a);
      this.obj.pageNo = a;
      this.selectEasApplyExamDetail(this.obj);
    },
    // 左侧列表
    async selectEasApplyExamDetail(obj) {
      let result = await selectEasApplyExamDetail(obj);
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
