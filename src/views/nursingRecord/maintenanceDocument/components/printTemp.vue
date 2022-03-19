<template>
  <div class="printTemp height100" v-loading="loading">
    <div class="printTemp-top">
      <div class="tool-left height100">
        <el-checkbox v-model="toolValue.tpicked">重复表头</el-checkbox>
        <el-checkbox v-model="toolValue.crowed">横向</el-checkbox>
      </div>
      <div class="tool-right height100">
        <el-button type="primary" @click="preview">预览</el-button>
        <el-button type="primary" @click="addPrintTemp">保存</el-button>
        <el-button type="primary" plain @click="deletePrintTemp"
          >删除</el-button
        >
      </div>
    </div>
    <div class="printTemp-content">
      <axueditor
        style="width: 100%; height: 600px"
        :toolbars="toolbars"
        :isReDataEditor="true"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import {
  getDocPrintTemplateList,
  addOrUpDocPrintTemplate,
  deleteDocPrintTemplate
} from "@/api/emrRecord/nursingRecord/printTemp";

import { onPreview } from "@/utils/print";


let printTempData = {
  dataVersion: "",
  deletedStatus: "",
  id: "",
  printTemplateAttribute: "",
  printTemplateContent: ""
};
export default {
  name: "printTemp",
  props: {
    currentData: {
      type: Object,
      default() {
        return {};
      }
    },
    treeData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      toolbars: [
        //按需写入，不传有默认工具栏菜单
        "undo", //撤销
        "redo", //重做
        "source",
        "inserttable",
        "deletetable",
        "insertparagraphbeforetable",
        "insertrow",
        "deleterow",
        "insertcol",
        "deletecol",
        "mergecells",
        "mergeright",
        "mergedown",
        "splittocells",
        "splittorows",
        "splittocols",
        "edittd",
        "charts",
        "|",
        "horizontal",
        // "print",
        // "preview",
        "searchreplace",
        "fontfamily",
        "fontsize",
        "justifyleft",
        "justifyright",
        "justifycenter",
        "justifyjustify",
        "underline",
        "fontborder",
        "bold",
        "superscript",
        "subscript",
        "spechars",
        "forecolor",
        "lineheight",
        "fullscreen",
        "adaptbytext",
        "adaptbywindow"
      ],
      loading: false,
      //工具箱
      toolValue: {
        tpicked: true,
        crowed: false
      },
      //模板内容
      printTempData: {}
    };
  },
  watch: {
    currentData: {
      handler(val) {
        if (val.hasOwnProperty("templateCode") && val.level == 1) {
          window.copyContent =
            this.treeData.mrModelCd == 1
              ? `$T[${val.templateCode}]`
              : val.templateCode;
        } else if (val.hasOwnProperty("eleId")) {
          let content = "";
          if (this.treeData.mrModelCd == 1) {
            content = `$T[${val.eleId}]`;
          } else if (this.treeData.mrModelCd == 2) {
            content = this.toolValue.crowed
              ? `$F[${val.eleId}]`
              : `$V[${val.eleId}]`;
          }
          window.copyContent = content;
        }
      },
      immediate: true,
      deep: true
    },
    basicElement: {
      handler(val) {
        if (val.hasOwnProperty("mrShareEleId")) {
          window.copyContent = `$T[${val.mrShareEleCd}]`;
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapGetters("nurseDocument", ["basicElement"])
  },
  created() {},
  async mounted() {
    this.editor = UE_COMMON.getEditor("editor");
    this.editor.ready(async () => {
      await this.getPrintTemp();
    });
  },
  destroyed() {
    this.editor.destroy();
  },
  methods: {
    //获取打印模板
    async getPrintTemp() {
      let params = {
        docCode: this.treeData.templateCode,
        docVersion: this.treeData.templateVersion
      };
      this.loading = true;
      try {
        let res = await getDocPrintTemplateList(params);
        if (res.code === 1) {
          this.printTempData = {
            ...printTempData,
            ...res.data
          };
        } else {
          this.$message.error(res.msg || "查询模板失败!");
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
      this.editor.setContent(this.printTempData.printTemplateContent);
    },
    //更新模板
    async addPrintTemp() {
      // console.log(this.editor.getContent())
      let params = {
        dataVersion: this.printTempData.dataVersion,
        deletedStatus: this.printTempData.deletedStatus,
        docCode: this.treeData.templateCode,
        docVersion: this.treeData.templateVersion,
        id: this.printTempData.id,
        printTemplateAttribute: "",
        printTemplateContent: this.editor.getContent()
      };
      this.loading = true;
      try {
        let res = await addOrUpDocPrintTemplate(params);
        if (res.code === 1) {
          this.$message.success("更新模板成功!");
          await this.getPrintTemp();
        } else {
          this.$message.error(res.msg || "更新模板失败!");
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    //删除打印模板
    async deletePrintTemp() {
      if (!this.printTempData.id) {
        this.$message.error("当前文书没有打印模板!");
        return;
      }
      this.$confirm("是否删除该文书打印模板?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let params = {
            id: this.printTempData.id
          };
          this.loading = true;
          try {
            let res = await deleteDocPrintTemplate(params);
            if (res.code === 1) {
              this.$message.success("删除模板成功!");
              this.editor.setContent("");
            } else {
              this.$message.error(res.msg || "删除模板失败!");
            }
            this.loading = false;
          } catch (e) {
            this.loading = false;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //预览
    preview() {
      // console.log(this.editor.getContent())
      onPreview(
        {},
        {
          editorContent: this.editor.getContent(),
          tpicked: this.toolValue.tpicked ? "one" : "",
          title: "打印模板预览"
        }
      );
    }
  }
};
</script>
<style scoped lang="scss">
.printTemp {
  overflow: auto;
  padding: 10px;
  .printTemp-top {
    height: 50px;
    border: 1px solid $l-color-bgcolor-11;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .tool-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-left: 10px;
    }
    .tool-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-right: 10px;
    }
  }
  .printTemp-content {
    height: calc(100% - 60px);
    overflow-y: auto;
  }
}
</style>
