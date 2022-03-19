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
        <el-checkbox label="0">全院</el-checkbox>
        <el-checkbox label="1">科室</el-checkbox>
        <el-checkbox label="2">个人</el-checkbox>
      </el-checkbox-group>
      <!-- 是否检索当前文书类型下的片语 -->
      <el-checkbox
        @change="getSectionTempl"
        class="curr-record"
        v-model="currRecord"
        >当前文书</el-checkbox
      >
      <!-- 检索 -->
      <el-input
        class="keyword"
        placeholder="请输入检索条件"
        v-model="serachValue"
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
              <span>{{ item.name }}</span>
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
                  @dblclick.native="addParagraph(item.type, child)"
                  width="240"
                  offset="10"
                  :open-delay="0"
                  :close-delay="0"
                  :key="'pop' + cindex"
                  trigger="click"
                >
                  <template>
                    <div v-if="editors === '02'" v-html="child.templates"></div>
                    <div
                      v-else-if="editors === '01'"
                      v-html="child.content"
                    ></div>
                    <div
                      v-else-if="editors === '03'"
                      v-html="child.templates"
                    ></div>
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
    <el-dialog title="短语编辑" :visible.sync="dialogVisible" width="800px">
      <div class="padding20">
        <el-row class="card-space-bottom" :gutter="10">
          <l-formt-title label="短语名称" :required="true">
            <el-input
              v-model="templateInfo.phraseName"
              placeholder="请输入"
            ></el-input>
          </l-formt-title>
        </el-row>
        <el-row class="card-space-bottom" :gutter="10">
          <l-formt-title label="短语内容" :required="true">
            <el-input
              v-model="templateInfo.phraseContent"
              placeholder="请输入"
            ></el-input>
          </l-formt-title>
        </el-row>
        <el-row class="card-space-bottom" :gutter="10">
          <l-formt-title label="短语类型">
            <el-select v-model="templateInfo.phraseType" placeholder="请选择">
              <el-option label="全院" value="1"></el-option>
              <el-option label="科室" value="2"></el-option>
              <el-option label="个人" value="3"></el-option>
            </el-select>
          </l-formt-title>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="saveLoad" @click="submitTem"
          >确定</el-button
        >
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  getPhraseList,
  editPhraseData,
  deletePhraseById
} from "@/api/emrRecord/tools/nursingAssistant";
import { getContent } from "@/api/emrRecord/emr/sectionTemplate.js";
import { getUId } from "@/utils/crypto";

export default {
  props: {
    // 当前文书类型
    docTypeCode: {
      type: String,
      default: ""
    },
    //就诊类型
    visitType: {
      type: String,
      default: ""
    },
    //医护标识
    dnFlag: {
      type: String,
      default: ""
    }
    //编辑器示例
    /* editor: {
      type: Object,
      default: null
    } */
  },
  data() {
    return {
      saveLoad: false,
      templateInfo: {
        phraseName: "",
        phraseType: ""
      },
      listData: [],
      loading: false,
      resultLoading: false,
      actionType: 1,
      serachValue: "",
      dialogVisible: false,
      currRecord: true,
      docCode: "",
      scopeLevel: [],
      activeNames: [],
      paragraphs: [],
      type: {
        "1": "全院",
        "2": "科室",
        "3": "个人"
      },
      popoverContent: "" //'<p><span id="1561369193422" title="吸烟" issecret="false" start-stain="[" end-stain="]" cascadeid="" showcondition="" attrs="{&quot;metaData&quot;:&quot;请选择&quot;,&quot;id&quot;:&quot;1561369193422&quot;,&quot;name&quot;:&quot;吸烟&quot;,&quot;placeholderText&quot;:&quot;吸烟&quot;,&quot;tipText&quot;:&quot;吸烟&quot;,&quot;isDel&quot;:&quot;on&quot;,&quot;showBorder&quot;:&quot;on&quot;,&quot;isEmpty&quot;:&quot;on&quot;,&quot;isPrint&quot;:&quot;on&quot;,&quot;isRange&quot;:&quot;on&quot;,&quot;options&quot;:&quot;[{\&quot;index\&quot;:1,\&quot;id\&quot;:1561371373408,\&quot;value\&quot;:\&quot;不吸烟\&quot;,\&quot;key\&quot;:\&quot;1\&quot;,\&quot;LAY_TABLE_INDEX\&quot;:0},{\&quot;index\&quot;:2,\&quot;id\&quot;:1,\&quot;value\&quot;:\&quot;吸烟\&quot;,\&quot;key\&quot;:\&quot;0\&quot;,\&quot;LAY_TABLE_INDEX\&quot;:1}]&quot;,&quot;multiSelect&quot;:&quot;&quot;,&quot;cascadeId&quot;:&quot;&quot;,&quot;operator&quot;:&quot;=&quot;,&quot;showCondition&quot;:&quot;&quot;,&quot;readonly&quot;:&quot;&quot;,&quot;isSecret&quot;:&quot;&quot;,&quot;isHide&quot;:&quot;&quot;,&quot;quot&quot;:&quot;&quot;,&quot;source&quot;:&quot;&quot;,&quot;startStain&quot;:&quot;&quot;,&quot;endStain&quot;:&quot;&quot;}" contenteditable="false" axplugins="select" text="吸烟" value="0" selectval="0" oldval="吸烟" class="ctrl-bg ctrl-field" style="display: inline;"><span title="吸烟" secret-value="false" placeholder="吸烟" contenteditable="false" tabindex="20" class="ctrl-value">吸烟</span></span><span id="1561369266368" title="烟龄" issecret="false" start-stain="[" end-stain="]" cascadeid="1561369193422" showcondition="吸烟" attrs="{&quot;metaData&quot;:&quot;请选择&quot;,&quot;id&quot;:&quot;1561369266368&quot;,&quot;name&quot;:&quot;烟龄&quot;,&quot;placeholderText&quot;:&quot;烟龄&quot;,&quot;tipText&quot;:&quot;烟龄&quot;,&quot;defaultVal&quot;:&quot;三年&quot;,&quot;isDel&quot;:&quot;on&quot;,&quot;showBorder&quot;:&quot;on&quot;,&quot;isEmpty&quot;:&quot;on&quot;,&quot;isPrint&quot;:&quot;on&quot;,&quot;minLen&quot;:&quot;&quot;,&quot;maxLen&quot;:&quot;&quot;,&quot;cascadeId&quot;:&quot;1561369193422&quot;,&quot;operator&quot;:&quot;=&quot;,&quot;showCondition&quot;:&quot;吸烟&quot;,&quot;readonly&quot;:&quot;&quot;,&quot;isSecret&quot;:&quot;&quot;,&quot;isHide&quot;:&quot;&quot;,&quot;quot&quot;:&quot;&quot;,&quot;source&quot;:&quot;&quot;,&quot;startStain&quot;:&quot;&quot;,&quot;endStain&quot;:&quot;&quot;}" contenteditable="false" axplugins="text" oldval="三年" class="ctrl-bg ctrl-field" style="display: inline;"><span title="烟龄" secret-value="false" placeholder="烟龄" contenteditable="false" tabindex="21" class="ctrl-value">三年</span></span></p>'
    };
  },
  computed: {
    ...mapGetters("nurseDocument", ["nursingTreeData"]),
    ...mapGetters("nurseDocument", { editors: "editor" })
  },
  watch: {
    editors: {
      async handler(val) {
        await this.loadData();
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    quote(row, type) {
      //this.$emit("send-value", row.templateValue, type);
    },
    edit(data) {
      this.dialogVisible = true;
      //this.formSearch = this.$options.data().formSearch;
      this.$nextTick(() => {
        //this.$refs.orderTable.clearSelection();
        this.templateInfo = { ...this.templateInfo, ...data };
        this.loadData();
      });
    },
    del(data) {
      this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "删除中...";
            deletePhraseById(data.id)
              .then(res => {
                if (res.code === 1) {
                  this.$message.success("删除成功");
                  this.loadData();
                } else {
                  this.$message.error("删除失败");
                }
                instance.confirmButtonLoading = false;
                done();
              })
              .catch(err => {
                this.$message.error("删除失败");
                instance.confirmButtonLoading = false;
                done();
              });
          } else {
            instance.confirmButtonLoading = false;
            done();
          }
        }
      }).then();
    },
    // 确定
    submitTem() {
      let templateData = {
        id: this.templateInfo.id,
        phraseName: this.templateInfo.phraseName,
        phraseType: this.templateInfo.phraseType,
        phraseContent: this.templateInfo.phraseContent,
        dataVersion: this.templateInfo.dataVersion
      };
      this.saveLoad = true;
      editPhraseData(templateData)
        .then(res => {
          if (res.code === 1) {
            this.$message.success("编辑成功");
            this.dialogVisible = false;
            this.$emit("message", "");
            this.loadData();
          } else {
            this.$message.error(res.msg || "编辑失败");
          }
          this.saveLoad = false;
        })
        .catch(err => {
          this.saveLoad = false;
          this.$message.error(err.msg || "编辑失败");
        });
    },
    //获取片语模板
    loadData() {
      if (this.loading) return;
      this.loading = true;

      getPhraseList({
        serachValue: this.serachValue,
        scopeLevel: this.scopeLevel,
        dnFlag: "2",
        editor: this.editors || "",
        sectionTemplateStatus: "1",
        docTypeCode: this.currRecord
          ? this.nursingTreeData.length
            ? this.nursingTreeData[0]["docTypeCode"]
            : ""
          : ""
      })
        .then(async res => {
          if (res.code == 1) {
            this.paragraphs = [];
            if (res.data.length == 0) {
              return;
            }
            let paragraphJson = {};
            for (let i in res.data) {
              let item = res.data[i];
              let content = await this.getAxeditorContent(
                item.sectionTemplateId
              );
              let child = {
                id: item.sectionTemplateId,
                name: item.sectionTemplateName,
                template: item.sectionTemplateContent,
                templates: content || "",
                content: content
                  ? content.replace(
                      new RegExp('contenteditable="true"', "g"),
                      ""
                    )
                  : ""
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
                child.content = tems;
              }
              if (!paragraphJson[item.typeCode]) {
                paragraphJson[item.typeCode] = {
                  name: item.typeName,
                  type: item.typeCode,
                  children: [child]
                };
              } else {
                paragraphJson[item.typeCode].children.push(child);
              }
            }
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
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getSectionTempl() {
      this.loadData();
    },
    addParagraph(type, child) {
      this.$emit("message", "phrase", {
        ...child,
        actionType: this.actionType
      });
    },
    changeContent(content) {},
    // zhengyawen
    async getAxeditorContent(id) {
      return new Promise(async (resolve, reject) => {
        try {
          let res = await getContent(id);
          if (res.code === 1) {
            if (res.data.editor === "01") {
              resolve(res.data.content);
            } else {
              resolve(res.data.sectionTemplateContext);
            }
          } else {
            resolve("");
          }
        } catch (e) {
          resolve("");
        }
      });
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
        float: right;
        margin-right: 20px;
        font-weight: normal;
        color: #949da3;
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
  .act-word {
    color: $l-color-fontcolor-2;
  }
  .del-btn {
    color: $l-color-fontcolor-5 !important;
  }
}
</style>
