<template>
  <div id="phraseTools" class="phrase-tools" v-loading="loading">
    <div id="searchBox" class="search-box">
      <!-- 操作类型 -->
      <el-radio-group v-model="actionType" class="align-center">
        <el-radio :label="0">追加</el-radio>
        <el-radio :label="1">替换</el-radio>
      </el-radio-group>
      <!-- 片语类别 -->
      <el-checkbox-group
        class="scopeLevel"
        v-model="scopeLevel"
        @change="getSectionTempl"
      >
        <el-checkbox
          v-for="item in checkOptions"
          :key="item._id"
          :label="handlerValue(item.code)"
          >{{ item.name }}</el-checkbox
        >
        <!-- <el-checkbox label="level0">全院</el-checkbox>
        <el-checkbox label="level1">科室</el-checkbox>
        <el-checkbox label="level2">个人</el-checkbox> -->
      </el-checkbox-group>
      <!-- 是否检索当前文书类型下的片语 -->
      <el-checkbox
        @change="getSectionTempl"
        class="curr-record"
        v-model="currRecord"
        >当前文书</el-checkbox
      >
      <el-checkbox
        @change="getSectionTempl"
        class="curr-record"
        v-model="typeFlag"
        >类型</el-checkbox
      >
      <!-- 检索 -->
      <el-input
        class="keyword"
        placeholder="请输入检索条件"
        v-model="keyword"
        @keyup.enter.native="getSectionTempl"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click.native="getSectionTempl"
        ></el-button>
      </el-input>
    </div>
    <!-- 检索结果 -->
    <div id="results" v-loading="resultLoading">
      <el-collapse v-model="activeNames" v-if="paragraphs.length > 0">
        <l-collapse-item
          sty="2"
          v-for="(item, index) in paragraphs"
          :key="'pt' + index"
          :name="index"
        >
          <template #title>
            <div class="width-style">
              <span :title="item.name" class="item-title">{{ item.name }}</span>
              <div class="item-count">{{ item.children.length }}条</div>
            </div>
          </template>
          <template #content>
            <!-- 片语预览 -->
            <ul>
              <li
                v-for="(child, cindex) in item.children"
                :key="'detail' + cindex"
              >
                <el-popover
                  popper-class="phrase-popover"
                  placement="left"
                  @dblclick.native="
                    addParagraph(item.type, child.template, item.name)
                  "
                  width="240"
                  offset="10"
                  :open-delay="0"
                  :close-delay="0"
                  :key="'pop' + cindex"
                  trigger="click"
                >
                  <template>
                    <div v-html="child.templates"></div>
                  </template>
                  <span slot="reference">{{ child.name }}</span>
                </el-popover>
              </li>
            </ul>
          </template>
        </l-collapse-item>
      </el-collapse>
      <!-- 无结果提示 -->
      <div class="no-templates" v-else>
        <div>暂无可用片语！</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import hmm from "@/api/hmm/base.js";
import { getSectionTemplateList } from "@/api/emrRecord/emr/sectionTemplate";

import { getUId } from "@/utils/crypto";

export default {
  props: {
    //就诊类型
    visitType: {
      type: String,
      default: ""
    },
    //医护标识
    dnFlag: {
      type: String,
      default: "1"
    },
    //编辑器示例
    editor: {
      type: Object,
      default: null
    },
    currentTypeCode: {
      type: String,
      default: ""
    },
    editorType: {
      // 编辑器类型
      type: String,
      default: "01"
    }
  },
  data() {
    return {
      loading: false,
      resultLoading: false,
      actionType: 1,
      keyword: "",
      typeFlag: false,
      currRecord: true,
      scopeLevel: ["level0"],
      activeNames: [],
      paragraphs: [],
      checkOptions: [],
      popoverContent: "" //'<p><span id="1561369193422" title="吸烟" issecret="false" start-stain="[" end-stain="]" cascadeid="" showcondition="" attrs="{&quot;metaData&quot;:&quot;请选择&quot;,&quot;id&quot;:&quot;1561369193422&quot;,&quot;name&quot;:&quot;吸烟&quot;,&quot;placeholderText&quot;:&quot;吸烟&quot;,&quot;tipText&quot;:&quot;吸烟&quot;,&quot;isDel&quot;:&quot;on&quot;,&quot;showBorder&quot;:&quot;on&quot;,&quot;isEmpty&quot;:&quot;on&quot;,&quot;isPrint&quot;:&quot;on&quot;,&quot;isRange&quot;:&quot;on&quot;,&quot;options&quot;:&quot;[{\&quot;index\&quot;:1,\&quot;id\&quot;:1561371373408,\&quot;value\&quot;:\&quot;不吸烟\&quot;,\&quot;key\&quot;:\&quot;1\&quot;,\&quot;LAY_TABLE_INDEX\&quot;:0},{\&quot;index\&quot;:2,\&quot;id\&quot;:1,\&quot;value\&quot;:\&quot;吸烟\&quot;,\&quot;key\&quot;:\&quot;0\&quot;,\&quot;LAY_TABLE_INDEX\&quot;:1}]&quot;,&quot;multiSelect&quot;:&quot;&quot;,&quot;cascadeId&quot;:&quot;&quot;,&quot;operator&quot;:&quot;=&quot;,&quot;showCondition&quot;:&quot;&quot;,&quot;readonly&quot;:&quot;&quot;,&quot;isSecret&quot;:&quot;&quot;,&quot;isHide&quot;:&quot;&quot;,&quot;quot&quot;:&quot;&quot;,&quot;source&quot;:&quot;&quot;,&quot;startStain&quot;:&quot;&quot;,&quot;endStain&quot;:&quot;&quot;}" contenteditable="false" axplugins="select" text="吸烟" value="0" selectval="0" oldval="吸烟" class="ctrl-bg ctrl-field" style="display: inline;"><span title="吸烟" secret-value="false" placeholder="吸烟" contenteditable="false" tabindex="20" class="ctrl-value">吸烟</span></span><span id="1561369266368" title="烟龄" issecret="false" start-stain="[" end-stain="]" cascadeid="1561369193422" showcondition="吸烟" attrs="{&quot;metaData&quot;:&quot;请选择&quot;,&quot;id&quot;:&quot;1561369266368&quot;,&quot;name&quot;:&quot;烟龄&quot;,&quot;placeholderText&quot;:&quot;烟龄&quot;,&quot;tipText&quot;:&quot;烟龄&quot;,&quot;defaultVal&quot;:&quot;三年&quot;,&quot;isDel&quot;:&quot;on&quot;,&quot;showBorder&quot;:&quot;on&quot;,&quot;isEmpty&quot;:&quot;on&quot;,&quot;isPrint&quot;:&quot;on&quot;,&quot;minLen&quot;:&quot;&quot;,&quot;maxLen&quot;:&quot;&quot;,&quot;cascadeId&quot;:&quot;1561369193422&quot;,&quot;operator&quot;:&quot;=&quot;,&quot;showCondition&quot;:&quot;吸烟&quot;,&quot;readonly&quot;:&quot;&quot;,&quot;isSecret&quot;:&quot;&quot;,&quot;isHide&quot;:&quot;&quot;,&quot;quot&quot;:&quot;&quot;,&quot;source&quot;:&quot;&quot;,&quot;startStain&quot;:&quot;&quot;,&quot;endStain&quot;:&quot;&quot;}" contenteditable="false" axplugins="text" oldval="三年" class="ctrl-bg ctrl-field" style="display: inline;"><span title="烟龄" secret-value="false" placeholder="烟龄" contenteditable="false" tabindex="21" class="ctrl-value">三年</span></span></p>'
    };
  },
  watch: {
    changeRequest: {
      handler(newVal) {
        this.getSectionTempl();
      },
      deep: true
    },
    currentTypeCode: {
      handler(newVal) {
        if (newVal) {
          this.scopeLevel = ["level0"];
          this.currRecord = false;
          this.typeFlag = true;
          this.keyword = newVal;
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters("user", ["role"]),
    ...mapGetters("cis", ["docTypeCode"]),
    changeRequest() {
      return (
        this.editorType ||
        (this.editor && this.editor.options.selectParagraphType)
      );
    }
  },
  created() {
    if (!this.editor) {
      this.$message({
        type: "error",
        message: "请传入正确的编辑器实例！"
      });
      return;
    }

    console.log(this.editor, "this.editor");
    this.handlerOrgList();
    this.$nextTick(function() {
      if (document.getElementById("results")) {
        document.getElementById("results").style.height =
          document.getElementById("phraseTools").offsetHeight -
          document.getElementById("searchBox").offsetHeight +
          "px";
      }
      window.onresize = function() {
        if (document.getElementById("results")) {
          document.getElementById("results").style.height =
            document.getElementById("phraseTools").offsetHeight -
            document.getElementById("searchBox").offsetHeight +
            "px";
        }
      };
      this.getSectionTempl();
    });
  },
  methods: {
    handlerValue(code) {
      return `level${code}`;
    },
    async handlerOrgList() {
      try {
        const { code, data, msg } = await hmm.getDictListForCode(
          "AllLevelType"
        );
        if (code === 1 && data) {
          this.checkOptions = data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    //获取片语模板
    getSectionTempl() {
      this.resultLoading = true;
      var params = {
        visitType: this.visitType,
        dnFlag: this.dnFlag,
        key: this.keyword,
        docTypeCode: this.currRecord ? this.docTypeCode : "",
        editor: this.editorType,
        typeFlag: this.typeFlag ? 1 : 0
      };

      if (this.scopeLevel.length === 0) {
        params.currTenant = 1;
        params.currHos = 1;
        params.currDept = 1;
        params.currUser = 1;
        params.level0 = 0;
        params.level1 = 1;
        params.level2 = 2;
        params.level9 = 9;
      } else {
        params.currTenant = 0;
        params.currHos = 0;
        params.currDept = 0;
        params.currUser = 0;
        for (var i = 0; i < this.scopeLevel.length; i++) {
          params[this.scopeLevel[i]] = this.scopeLevel[i].substring(
            this.scopeLevel[i].length - 1,
            this.scopeLevel[i].length
          );

          if (params[this.scopeLevel[i]] == 0) {
            params.currHos = 1;
          } else if (params[this.scopeLevel[i]] == 1) {
            params.deptIds = this.role.deptId;
            params.currDept = 1;
          } else if (params[this.scopeLevel[i]] == 2) {
            params.persId = getUId();
            params.currUser = 1;
          } else if (params[this.scopeLevel[i]] == 9) {
            params.currTenant = 1;
          }
        }
      }

      if (this.editor) {
        var range = this.editor.selection.getRange();
        //判断光标是否在段落内
        var paragraphNode = AX.dom.domUtils.findParent(
          range.startContainer,
          function(dom) {
            return (
              dom.tagName === "DIV" &&
              dom.getAttribute("axplugins") == "paragraphele"
            );
          },
          true
        );
        // 在段落内则根据当前段落类型查找
        if (paragraphNode) {
          var pType = paragraphNode.getAttribute("paragraphtype");
          params.typeCode = pType;
        }
      }

      getSectionTemplateList(params).then(res => {

        if (res.code == 1) {
          this.paragraphs = [];
          if (res.data.length == 0) {
            return;
          }
          let paragraphJson = {};
          res.data.map(item => {
            let child = {
              id: item.sectionTemplateId,
              name: item.sectionTemplateName,
              template:
                item.editor === "01"
                  ? item.content
                  : item.sectionTemplateContent,
              templates:
                item.editor === "01"
                  ? item.content
                    ? item.content.replace(
                        new RegExp('contenteditable="true"', "g"),
                        ""
                      )
                    : ""
                  : item.sectionTemplateContent
            };
            // 创建节点，方便处理片语内容，清除分页等结构
            let div = document.createElement("div");
            let tems = "";
            div.innerHTML = child.templates;
            let contents = div.querySelectorAll(".ax-page-content");
            if (contents.length > 0) {
              for (let i = 0; i < contents.length; i++) {
                tems += contents[i].innerHTML;
              }
              child.templates = tems;
            }
            //
            if (!paragraphJson[item.typeCode]) {
              paragraphJson[item.typeCode] = {
                name: item.typeName,
                type: item.typeCode,
                children: [child]
              };
            } else {
              paragraphJson[item.typeCode].children.push(child);
            }
          });
          let openArr = [],
            count = 0;

          for (let key in paragraphJson) {
            this.paragraphs.push(paragraphJson[key]);
            openArr.push(count++);
          }

          this.activeNames = openArr;
        } else {
          this.$message({
            type: "error",
            message: "网络繁忙，请刷新重试！"
          });
        }
      }).finally(()=>{
        this.resultLoading = false;
      })
    },
    addParagraph(type, template, name) {
      console.log(999, this.editor.options.editorModel);
      if (
        this.editor.options.editorModel == "pure" ||
        this.editor.options.editorModel == "dirty" ||
        this.editor.options.editorModel == "secret"
      ) {
        this.$message({
          type: "warning",
          message: "浏览模式不允许编辑！"
        });
        return;
      }
      if (template == undefined || template == "") {
        this.$message({
          type: "info",
          message: "片语内容为空，请检查！"
        });
        return;
      }
      var vimDom = document.createElement("div");
      var templateContent = [];
      vimDom.innerHTML = template;
      var mainContent = vimDom.querySelectorAll(".ax-page-content");
      if (mainContent.length > 0) {
        mainContent.forEach(item => {
          templateContent.push(item.innerHTML);
        });
        template = templateContent.join("");
      }
      if (this.actionType == 0) {
        this.editor.execCommand("appendparagraphcontent", {
          type: type,
          content: template,
          name: name
        });
      } else {
        this.editor.execCommand("replaceparagraph", {
          type: type,
          content: template,
          name: name
        });
      }
    },
    changeContent(content) {
      this.popoverContent = content;
    }
  }
};
</script>
<style lang="scss">
.phrase-tools {
  padding: 0 !important;
  padding-left: 1px;
  .align-center {
    display: block;
    padding: 10px;
    border-bottom: 1px solid #e4e4e4;
  }
  .scopeLevel {
    margin: 10px 10px 0;
  }
  .curr-record {
    margin: 10px;
  }
  .keyword {
    padding: 0 10px 10px;
    box-sizing: border-box;
  }
  #results {
    overflow-y: auto;
    .el-collapse {
      border: none;
      .item-count {
        margin-right: 20px;
        font-weight: normal;
        color: #949da3;
      }
      .item-title {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .width-style {
        width: calc(100% - 20px);
        margin-left: 20px;
        display: flex;
        flex-direction: row;
      }
      .collapse-item-2 {
        margin-bottom: 0;
      }
      .el-collapse-item__content {
        padding: 0;
        .el-popover__reference {
          overflow: hidden;
          display: block;
          width: 100%;
          height: 44px;
          padding-left: 28px;
          line-height: 44px;
          box-sizing: border-box;
          text-overflow: ellipsis;
          word-wrap: none;
          white-space: nowrap;
          cursor: pointer;
          &:hover {
            color: $l-color-primary;
            background: $l-color-bgcolor-1;
          }
        }
      }
    }
  }
  .list li {
    cursor: pointer;
  }
  .no-templates {
    line-height: 40px;
    text-align: center;
    color: #949da3;
  }
}
.phrase-popover {
  height: 200px;
  overflow: auto;
  padding: 20px;
  margin-top: -6px !important;
  border: 1px solid $l-color-primary;
  border-radius: 0;
  user-select: none;
  .popper__arrow {
    display: none;
  }
  span.ctrl-field {
    padding: 0 8px;
    border-bottom: 1px solid #0000ff;
    text-indent: 0;
    cursor: pointer;
  }
  span.ctrl-field {
    padding: 0 8px;
    border-bottom: 1px solid #0000ff;
    text-indent: 0;
  }
  .ctrl-value:empty:before {
    content: attr(placeholder);
    color: #999;
  }
}
</style>
