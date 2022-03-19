<template>
  <div class="InfoHeaderAside">
    <el-row>
      <el-col :span="8">
        <p-lable-input name="身份证号" :val="baseMes.id_no" />
        <p-lable-input class="mt-15" name="电话证号" :val="baseMes.telephone" />
        <p-lable-input class="mt-15" name="住址" :val="baseMes.current_address" />
      </el-col>
      <el-col :span="8">
        <p-lable-input width="100" name="档案编号" :val="baseMes.dig_doc_no" />
        <p-lable-input class="mt-15" width="100" name="纸质档案编号" :val="baseMes.pap_doc_no" />
        <p-lable-input class="mt-15" width="100" name="家庭档案编号" :val="baseMes.home_code" />
        <p-lable-input class="mt-15" width="100" name="档案状态" :val="baseMes.doc_status_desc" />
        <p-lable-input class="mt-15" width="100" name="签约状态" :val="'未签约'" />
      </el-col>
      <el-col :span="8">
        <p-lable-input name="当前机构" :val="baseMes.current_org_name" />
        <p-lable-input class="mt-15" name="责任医生" :val="baseMes.responsible_dr_name" />
        <p-lable-input class="mt-15" name="建档医生" :val="baseMes.create_doc_user_name" />
        <p-lable-input class="mt-15" name="建档日期" :val="baseMes.create_doc_date" />
        <p-lable-input class="mt-15" name="网格" :val="baseMes.grid_name" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "InfoHeaderAside",
    components: {},
    props: {
      baseMes: {
        type: Object
      }
    },
    data() {
      return {};
    },
    created() {},
    mounted() {},
    methods: {},
    watch: {},
    computed: {}
  };
</script>

<style lang="scss" scoped>
  .InfoHeaderAside {
    padding: 30px 0 0 40px;
  }
</style>