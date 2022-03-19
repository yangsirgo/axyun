<template>
  <div class="SchedulingList">
    <l-card-title>
      <span slot="left">模板列表</span>
    </l-card-title>
    <l-formt-title class="mb10" label="模板名称">
      <el-input
        v-model="scheduleTemplateName"
        @keyup.enter.native="search"
        placeholder="请输入"
      ></el-input>
    </l-formt-title>
    <div class="buttonArea">
      <el-button style="width: 80px" type="primary" plain @click="search"
        >查询</el-button
      >
      <el-button style="width: 80px" type="primary" @click="reSet"
        >重置</el-button
      >
      <el-button style="width: 100px" type="primary" @click="add"
        >新增模板</el-button
      >
    </div>
    <div class="listContent">
      <l-table
        :paginationSmall="true"
        :total="pageParams.total"
        :pageSize.sync="pageParams.pageSize"
        :page.sync="pageParams.pageNo"
        layout="pager"
        stripe
        :pagerCount="5"
        paginationAlign="center"
        :singlePageShow="true"
        @changeSize="handleSizeChange"
      >
        <div class="table-wrap">
          <el-card v-for="(item, index) in listData" :key="index">
            <div
              class="listItem"
              :class="[
                { currentClass: item.templateId == currentItem.templateId },
                { isBlue: !!(item.isDefaultTemplate * 1) },
              ]"
              @click="listItemClick(item)"
            >
              <div class="one">
                <div class="textEllipsis" :title="item.scheduleTemplateName">模板名称：{{ item.scheduleTemplateName }}</div>
                <div class="patientCode">
                  <i @click.stop="editTemplate(item)" class="el-icon-edit"></i>
                  &nbsp;
                  <i
                    @click.stop="delTemplate(item.templateId)"
                    class="el-icon-delete"
                  ></i>
                </div>
              </div>
              <div class="two">
                <div>修改人员：{{ item.updatedByName }}</div>
              </div>
              <div class="three">修改时间：{{ item.updatedAt }}</div>
            </div>
            <div class="noData" v-if="!listData.length">暂无数据</div>
          </el-card>
        </div>
      </l-table>
    </div>
    <!-- 新增和修改弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px">
      <div style="padding: 25px">
        <span>
          模板名称：
          <el-input
            v-model="dialogScheduleName"
            placeholder="请输入模板名称"
            style="width: 350px; margin-bottom: 10px"
          ></el-input>
        </span>
        <div>
          <el-checkbox v-model="isDefaultTemplate" style="margin-left: 75px"
            >设置为默认排班模板</el-checkbox
          >
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="appendNumSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { post, get, put, del } from "@/utils/request";
import scheManagement from "@/api/schedule/scheduleManagement.js";
export default {
  data() {
    return {
      listData: [],
      scheduleTemplateName: "",
      dialogFormVisible: false,
      dialogScheduleName: "", //弹窗中的模板名称
      isDefaultTemplate: false, //弹窗中默认开关
      title: "",
      currentItem: {}, //当前选中模板
      editTemplateItem: {}, //修改模板对象
      addOrEdit: 1, //1 新增   2 修改
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
    this.selectTemplateNew();
  },
  methods: {
    add() {
      this.dialogScheduleName = "";
      this.addOrEdit = 1;
      this.dialogFormVisible = true;
      this.title = "新增模板";
    },
    editTemplate(item) {
      this.addOrEdit = 2;
      this.dialogFormVisible = true;
      this.title = "修改模板";
      this.editTemplateItem = { ...item };
      this.dialogScheduleName = item.scheduleTemplateName;
      this.isDefaultTemplate = !!(item.isDefaultTemplate * 1);
    },
    // 删除模板
    async delTemplate(templateId) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          let res = await scheManagement.delTemplateNew({
            templateId
          });
          this.selectTemplateNew();
          this.$message.success(res.msg || "删除成功");
        } catch (error) {
          this.$message.error(error.msg || "删除失败");
        }
      });
    },
    //修改模板
    async updateTemplateNew() {
      try {
        this.editTemplateItem.scheduleTemplateName = this.dialogScheduleName;
        this.editTemplateItem.isDefaultTemplate = this.isDefaultTemplate * 1;
        let res = await scheManagement.updateTemplateNew(this.editTemplateItem);
        this.dialogFormVisible = false;
        this.selectTemplateNew();
        this.$message.success(res.msg || "修改成功");
      } catch (error) {
        this.$message.error(error.msg || "修改失败");
      }
    },
    search() {
      // if (
      //   !this.scheduleTemplateName
      // ) {
      //   this.$message.error("请输入模板名称");
      //   return;
      // }
      this.selectTemplateNew();
    },
    async addTemplateNew() {
      if (!this.dialogScheduleName) {
        this.$message.error("请输入模板名称");
      }
      try {
        let res = await scheManagement.addTemplateNew({
          scheduleTemplateName: this.dialogScheduleName,
          isDefaultTemplate: this.isDefaultTemplate * 1
        });
        this.dialogFormVisible = false;
        this.selectTemplateNew();
        this.$message.success(res.msg || "新增成功");
      } catch (error) {
        this.$message.error(error.msg || "新增失败");
      }
    },
    //获取模板列表
    async selectTemplateNew() {
      let res = await scheManagement.selectTemplateNew({
        scheduleTemplateName: this.scheduleTemplateName
      });
      this.listData = res.data;
      // this.currentItem = {};
      // if (res.data.length == 1) {
      //   this.currentItem = res.data[0];
      //   this.$emit("listItemClick", res.data[0]);
      // }
      this.pageParams.total = res.total;
    },
    listItemClick(data) {
      if (data.templateId == this.currentItem.templateId) {
        return;
      }
      if (this.SchedulingContent) {
        //收集需要提交保存的数据
        let saveData = this.SchedulingContent.selectSaveData();
        let arr = saveData.concat(this.SchedulingContent.alDeleteArr);
        if (arr.length) {
          this.$confirm(
            "当前时间段有尚未保存的数据，确定要切换模板吗?",
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
    readCard() {
      this.$message.error("没有外接设备");
    },
    reSet() {
      this.scheduleTemplateName = "";
    },
    // 分页
    handleSizeChange(val) {
      this.pageParams.pageNo = val.page;
      this.pageParams.pageSize = val.pageSize;
      this.selectTemplateNew();
    },
    //弹窗确定按钮点击
    appendNumSure() {
      if (this.addOrEdit == 1) {
        this.addTemplateNew();
      } else if (this.addOrEdit == 2) {
        this.updateTemplateNew();
      }
    }
  }
};
</script>

<style lang="scss">
.left {
  width: 254px !important;
  margin-right: 8px !important;
}
.SchedulingList {
  height: 100%;
  padding-bottom: 40px;
  .mb10 {
    margin-bottom: 5px;
  }
  .buttonArea {
    display: flex;
    justify-content: space-between;
  }
  // .el-button--medium {
  //   padding: 0px 0px !important;
  // }
  .isBlue {
    color: #409eff;
  }

  .listContent {
    height: calc(100% - 110px);
    overflow: auto;
    margin-top: 10px;
    border: 1px solid #e4e4e4;
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
        .defaultIcon {
          background: #409eff;
          color: white;
          font-size: 12px;
          margin-left: 5px;
          padding: 2px 5px;
          border-radius: 5px;
        }
        .patientCode {
          color: #409eff;
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
  .currentClass {
    background: #f0f9eb;
  }
}
.table-wrap {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
.textEllipsis {
  max-width: 164px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
