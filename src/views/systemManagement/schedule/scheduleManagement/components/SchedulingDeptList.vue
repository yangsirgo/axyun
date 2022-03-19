<template>
  <div class="SchedulingDeptList">
    <l-card-title>
      <span slot="left">科室列表</span>
    </l-card-title>
    <el-input v-model="deptName" @input="getDept" placeholder="请输入科室名称"></el-input>
    <div class="listContent">
      <div v-for="(item,index) in deptList" :key="index" class="deptItem" :class="{currentClass:item.deptId==currentItem.deptId}" @click="listItemClick(item)">{{item.deptName}}</div>
    </div>
  </div>
</template>

<script>
import { post, get, put, del } from "@/utils/request";
import scheManagement from "@/api/schedule/scheduleManagement.js";
export default {
  data() {
    return {
      deptName: "",
      deptList:[],//科室列表集合
      currentItem:{},//当前选中模板
      // 分页
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      }
    };
  },
  props: ["SchedulingContent"],
  mounted() {
    this.getDept();
  },
  methods: {
    //查询科室列表
    async getDept() {
      try {
        let res = await scheManagement.queryDept({
          deptName:this.deptName
        });
        this.deptList = res.data;
      } catch (error) {
        this.$message.error(error.msg || "查询科室列表失败");
      }
    },
    listItemClick(data) {
      if(data.deptId==this.currentItem.deptId){
        return
      }
      if (this.SchedulingContent) {
        //收集需要提交保存的数据
        let saveData = this.SchedulingContent.selectSaveData();
        let arr = saveData.concat(this.SchedulingContent.alDeleteArr);
        if (arr.length) {
          this.$confirm(
            "当前时间段有尚未保存的数据，确定要切换科室吗?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.currentItem = data;
              this.$emit("listItemClick", data);
            })
            .catch(() => {});
        } else {
          this.currentItem = data;
          this.$emit("listItemClick", data);
        }
      } else {
        this.currentItem = data;
        this.$emit("listItemClick", data);
      }
    },
  }
};
</script>

<style lang="scss">
.SchedulingDeptList {
  height: 100%;
  min-width:187px;
  padding-bottom: 40px;
  .mb10 {
    margin-bottom: 5px;
  }
  .buttonArea {
    display: flex;
    justify-content: space-between;
  }
  .listContent {
    height: calc(100% - 70px);
    overflow: auto;
    margin-top: 10px;
    border: 1px solid #e4e4e4;
    .deptItem{
      height:30px;
      border-bottom:1px solid #e4e4e4;
      padding:0 10px;
      line-height: 30px;
    }
    .noData {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #909399;
    }
    .listItem {
      padding: 10px;
      .one {
        line-height: 2;
        display: flex;
        justify-content: space-between;
        .patientCode {
          color: #0000ff;
          i {
            cursor: pointer;
            font-weight: bold !important;
          }
        }
      }
      .two {
        line-height: 2;
        display: flex;
        justify-content: flex-start;
      }
      .three {
        line-height: 2;
      }
    }
  }
  .pagination {
    position: fixed;
    bottom: 10px;
  }
  .currentClass{
    background:#f0f9eb;
  }
}
.table-wrap {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
</style>
