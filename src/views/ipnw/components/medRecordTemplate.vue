<template>
  <div>
    <LFormtTitle label="选择类别">
      <el-select v-model="value" placeholder="请选择" @change="getDataList">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </LFormtTitle>
    <div class="title">模板名</div>
    <div
      class="content"
      v-for="(item,index) in contentList"
      :key="index"
      @click="getId(item.residentAdviceFormworkContentList)"
      v-loading="loading"
    >{{item.residentAdviceFormworkSbuject.adviceFormworkName}}</div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getTemplateList,queryId } from "@/api/ipnw/etHospital";
export default {
  data() {
    return {
      options: [
        { value: "1", label: "全院" },
        { value: "2", label: "科室" },
        { value: "3", label: "个人" }
      ],
      loading: false,
      value: "3",
      contentList:[]
    };
  },
  computed: {
    ...mapGetters("user", ["role"])
  },
  created() { 
    this.getDataList();
  },
  mounted() {},
  methods: {
    async getDataList() {
      try {
        this.loading = true; 
        let params = {
          adviceFormworkName: "",
          adviceFormworkType: this.value,
          deptId: this.role.deptId
        };
        let {data} = await getTemplateList(params);
        this.contentList = data;  
        console.log(this.contentList,'contentList');
        console.log(this.value);
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.msg);
      }
    },
    async getId(ids) {
        this.$emit("message",ids);
    }

  }
};
</script>
<style lang="scss" scoped>
.l-input-wrap {
  margin-bottom: 10px;
}
.title {
  height: 30px;
  background: rgba(246, 246, 246, 1);
  line-height: 30px;

  font-size: 14px;
  
  font-weight: 400;
  color: rgba(46, 50, 58, 1);
  padding-left: 10px;
}
.content {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(61, 125, 251, 1);
  border-bottom: 1px solid #e4e4e4;
  cursor: pointer;
  padding-left: 10px;
}
</style>
