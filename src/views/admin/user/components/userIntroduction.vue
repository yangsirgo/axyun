<template>
  <div class="app-container" ref="page" height="300px">
    <div class="table_box">
      <div class="header-button">
        <el-button type="primary" size="mini" @click="clearContent">清空</el-button>
        <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
      </div>

      <div style="height:325px">
        <!-- <div id="editor" style="width:100%;height: 240px"></div> -->
        <axueditor style="width:100%;height:240px;" :toolbars="toolbars" :isReDataEditor="false" />
      </div>
    </div>
  </div>
</template>
<script>
// import "../../../../../public/Ueditor/ueditor.config.js";
// import "../../../../../public/Ueditor/ueditor.all.js";
import "../../../../../public/Ueditor/lang/zh-cn/zh-cn.js";
// import { page } from "@/api/admin/print/print";
export default {
  name: "uEditor",
  props: {
    userForm: {
      type: Object,
      default() {
        return {
          name: "",
          userNo: "",
          age: "",
          gender: "",
          hosId: "",
          workType: "",
          hosName: "请选择医院",
          doctorProfessionalTitle: "",
          operationLevel: "",
          profile: "",
        };
      },
    },
    dialogVisible: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      edit: "",
      editor: null,
      editorContent: "",
      editHtml: "",
      dataResultStr: null,
      params: {
        name: "",
        pageNo: 1,
        pageSize: 10,
        orderBy: "updated_at desc",
      },
      all: "alone",
      total: 0,
      tableData: [],
      toolbars: [
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
        "charts",
        "|",
        "horizontal",
        "preview",
        "searchreplace",
        "fontfamily",
        "fontsize",
        "forecolor",
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
        "insertimage",
        "adaptbytext",
        "adaptbywindow",
      ],
      options: [
        { text: "第#页/共&页", value: "第#页/共&页" },
        { text: "# / &", value: "# / &" },
        { text: "- # -", value: "- # -" },
      ],
    };
  },
  mounted() {
    // 实例化editor编辑器
    // let profile = this.userForm.profile;
    let profile = "";
    profile = this.userForm.profile;
    let _this = this;
    this.editor = UE_COMMON.getEditor("editor");
    UE_COMMON.getEditor("editor").container.style.zIndex = 9999;

    this.editor.addListener("ready", function () {
      if (profile) {
        _this.editor.setContent(profile || "");
      } else {
        _this.editor.setContent("");
      }
      console.log("4444444");
    });
  },
  destroyed() {
    // 将editor进行销毁
    this.editor.destroy();
  },
  created() {
    // this.handleList();
  },
  methods: {
    handleSave() {
      this.userForm.profile = this.editor.getContent();
      this.$emit("userSubmit", this.userForm);
      this.editor.setContent("");
    },
    // handleList() {
    //   page(this.params)
    //     .then(res => {
    //       console.log(res);
    //       this.tableData = res.data;
    //       this.total = res.total;
    //       this.params.pageNo = res.pageNo;
    //       this.params.pageSize = res.pageSize;
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //     });
    // },
    clearContent() {
      this.params = {
        name: "",
        pageNo: 1,
        pageSize: 10,
        orderBy: "updated_at desc",
      };

      this.editorContent = "";
      this.editHtml = "";
      this.dataResultStr = null;
      this.editor.setContent("");
      // this.handleList();
    },
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.editor.setContent("");
      } else {
        if (this.userForm.profile) {
          this.editor.setContent(this.userForm.profile || "");
        } else {
          this.editor.setContent("");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.header-button {
  padding: 0px 0 7px;
}
.app-container {
  // background-color: #ffffff;
  overflow: hidden;
  height: 100%;
  padding-top: 0;
}

/deep/.el-textarea__inner {
  width: 300px;
}
/deep/.el-dialog__body {
  .el-input__inner {
    width: 300px;
  }

  .el-tabs__content {
    .orgin {
      width: 220px;
      .el-input__inner {
        width: 220px;
      }
    }
    .seleorgin {
      width: 205px;
      .el-input__inner {
        width: 205px;
      }
    }
    .el-button {
      font-size: 14px;
      height: 31px;
      padding: 2px 15px;
    }
    .del {
      height: 36px;
      padding: 5px 15px;
      margin-left: 20px;
    }
  }
}

.print-form {
  padding: 10px 0;

  /deep/ .el-form-item--medium .el-form-item__label {
    line-height: 45px;
    font-weight: 400;
  }
}
.title {
  color: #606266;
  margin-bottom: 10px;
}

.rows {
  .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
}
/deep/.edui-editor-breadcrumb {
  display: none;
}
</style>
