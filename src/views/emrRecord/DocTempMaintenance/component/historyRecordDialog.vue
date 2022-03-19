<template>
  <el-dialog
    title="历史文书"
    :visible.sync="dialogVisible"
    append-to-body
    :close-on-click-modal="true"
    width="1080px"
  >
    <div class="content">
      <div class="left-area height100">
        <div class="width100 height100 tree-con">
          <el-tree
            v-if="treeData.length"
            ref="recordTree"
            style="overflow: auto; display: inline-block; height: 100%"
            default-expand-all
            empty-text="暂无文书数据"
            node-key="mrId"
            :data="treeData"
            :props="defaultProps"
            :render-content="renderContent"
            @node-click="handleNodeClick"
          ></el-tree>
          <div v-else class="width100 height100 no-data-text">
            <span>暂无文书数据</span>
          </div>
        </div>
      </div>
      <div class="right-area">
        <div class="top">
          <el-button
            class="btns-content el-button--primary"
            @click="printRecord"
          >
            打印病历
          </el-button>
          <el-button @click="closeDialogHandler">取 消</el-button>
        </div>
        <div class="editor-con">
          <l-editor
            ref="axEditor"
            :isScrollBar="false"
            :isFullFlag="false"
            :configs="editorConfigs"
            :defaultMsg="defaultMsg"
            @ready="editorReady"
          >
          </l-editor>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getTree, contentQuery } from "@/api/emrRecord/emr/instrument";

export default {
  name: "historyRecordDialog",
  components: {},
  props: {
    patientId: {
      type: String,
      default: ""
    },
    visitCode: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogVisible: false,
      defaultProps: {
        children: "children",
        label: "text"
      },
      treeData: [],
      editorConfigs: {
        editorModel: "preview",
        defaultModel: "preview",
        showTabBar: false,
        initialFrameHeight: 350,
        tabToolbars: []
      },
      defaultMsg: null,
      editor: null,
      curData: null
    };
  },
  watch: {
    visitCode(val) {
      if (val) {
        this.initTree();
      }
    },
    dialogVisible(val) {
      if (val) {
        if (this.treeData.length) {
          // 模拟点击第一个
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.recordTree.setCurrentKey(
                this.treeData[0].children[0].exts.mrId
              );
              this.handleNodeClick(this.treeData[0].children[0]);
            });
          }, 1000);
        } else {
          this.defaultMsg = "";
        }
      }
    }
  },
  methods: {
    editorReady(instance) {
      this.editor = instance;
      this.editor.execCommand("setmodel", {
        modelType: "preview",
        showToolbar: false
      });
    },

    closeDialogHandler() {
      this.closeDialog();
      this.$emit("closeDialogHandler", "");
    },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    printRecord() {
      if (!this.curData) {
        this.$message.info("请选择需要打印的文书");
        return;
      }

      this.editor.execCommand("printpreview1");
    },
    renderContent(h, { node, data, store }) {
      let time = data.exts.bizTime
        ? this.dayjs(data.exts.bizTime).format("YYYY-MM-DD HH:mm")
        : "";
      if (!data.exts) {
        return <p>{data.text}</p>;
      }
      return (
        <div class="el-tree-node__content">
          <p>
            {data.text}
          </p>
        </div>
      );
    },
    //添加text属性，方便树加载
    addTextAttr(data) {
      data.text = data.label ? data.label : data.exts.mrName;
      if (data.children) {
        data.children.forEach(item => {
          this.addTextAttr(item);
        });
      }
    },
    initTree() {
      let data = {
        patientId: this.patientId,
        enId: this.visitCode,
        visitType: "01",
        isHome: "0",
        onlyHisFlag: 1,
        mrFlag: "02"
      };
      getTree(data).then(res => {
        if (res.code === 1) {
          res.data.forEach(item => {
            this.addTextAttr(item);
          });
          this.treeData = res.data;
        } else {
          this.$message.error("获取接口失败!");
          return;
        }
      });
    },
    handleNodeClick(data) {
      if (!data.exts.mrId) {
        return;
      }

      this.curData = data;

      let params = {
        mrId: data.exts.mrId,
        mrStaCd: data.exts.mrStaCd
      };

      contentQuery(params).then(res => {
        if (res.code === 1) {
          this.defaultMsg = res.data.docMongoContent;
        } else {
          this.$message.error("查询失败!");
          return;
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.no-data-text {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  font-size: 14px;
}
.content {
  height: 460px;
  padding: 16px;
  display: flex;
  flex-direction: row;

  .left-area {
    width: 240px;
    overflow: hidden;

    .tree-con {
      overflow: auto;
    }
  }
  .right-area {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .top {
      display: flex;
      justify-content: flex-end;
    }
    .editor-con {
      flex: 1;
      margin-top: 8px;

      border: 1px solid #dcdfe6;
    }
  }
}
</style>
