<template>
  <div class="schedulingTemplate">
    <l-layout
      :boxExpanded="false"
      :isToolBox="false"
      :hasThreeRouterFlag="false"
      :patientListShow="true"
      displayMode="expand"
    >
      <template #list>
        <el-card class="height100 width100 padding10">
          <SchedulingList
            :SchedulingContent="$refs.SchedulingContent"
            @listItemClick="SchedulingListHandle"
          ></SchedulingList>
        </el-card>
      </template>
      <template #content>
        <el-card class="height100 width100 padding10">
          <div style="display: flex" class="height100 width100">
            <SchedulingDeptList
              :SchedulingContent="$refs.SchedulingContent"
              @listItemClick="SchedulingContentHandle"
              style="margin-right: 10px"
            ></SchedulingDeptList>
            <SchedulingContent
              ref="SchedulingContent"
              :selectedTemplateInfo="selectedTemplateInfo"
              :selectedDeptInfo="selectedDeptInfo"
            ></SchedulingContent>
          </div>
        </el-card>
      </template>
    </l-layout>
  </div>
</template>

<script>
import SchedulingDeptList from "./components/SchedulingDeptList.vue";
import SchedulingList from "./components/SchedulingList.vue";
import SchedulingContent from "./components/SchedulingContent.vue";
import scheManagement from "@/api/schedule/scheduleManagement.js";
export default {
  components: {
    SchedulingList,
    SchedulingDeptList,
    SchedulingContent,
  },
  data() {
    return {
      selectedTemplateInfo: {}, //选中模板
      selectedDeptInfo: {}, //选中科室
    };
  },
  beforeRouteLeave(to, from, next) {
    let saveData = this.$refs.SchedulingContent.selectSaveData();
    let arr = saveData.concat(this.$refs.SchedulingContent.alDeleteArr);
    if (arr.length) {
      this.$confirm("当前页面有尚未保存的数据，确定要离开吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          next();
        })
        .catch(() => {
          next(false);
        });
    } else {
      next();
    }
  },
  mounted() {},
  methods: {
    SchedulingListHandle(data) {
      this.selectedTemplateInfo = data;
    },
    SchedulingContentHandle(data) {
      this.selectedDeptInfo = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.schedulingTemplate {
  height: 100%;
}
</style>