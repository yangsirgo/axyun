<template>
  <div class="app-container" ref="page">
    <el-row :gutter="20" style="height:100%;">
      <el-col :span="8" style="height: 100%;">
        <div class="tree_box" style="height: 100%;padding-bottom:20px;">
          <el-form :inline="true" :model="params" ref="form" @submit.native.prevent>
            <el-form-item label>
              <el-input v-model="params.name" placeholder="请输入报表名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            </el-form-item>
          </el-form>
          <el-table
            id="tableShow"
            :data="tableData"
            style="width: 100%;overflow-y: auto"
            ref="table"
            height="410"
            border
          >
            <el-table-column
              type="index"
              label="序号"
              width="100px"
              header-align="center"
              align="center"
            ></el-table-column>

            <el-table-column prop="reportName" label="报表名称"></el-table-column>
            <el-table-column prop="reportCode" label="报表编码"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button @click.native.prevent="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                <el-button
                  @click.native.prevent="handleDelete(scope.row)"
                  type="text"
                  size="small"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page" style="width: 100%; overflow: auto;">
            <pagination
              v-show="total>0"
              :total="total"
              :pageSize.sync="params.pageSize"
              :page.sync="params.page"
              @pagination="changeSize"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="16" style="height: 100%; overflow: auto;">
        <div class="table_box">
          <div class="header-button">
            <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
            <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
            <el-button type="primary" size="mini" @click="clearContent">清空</el-button>
            <el-button type="primary" size="mini" @click="transferVisible = true">打印测试</el-button>
            <el-button type="primary" size="mini" @click="outExcel">导出测试</el-button>
            <el-button type="primary" size="mini" @click="tableExcel">表格导出测试</el-button>
            <!--<el-button  type="primary" size="mini" @click="onPreview">打印</el-button>-->
          </div>

          <div>
            <el-form :inline="true" :model="form" ref="form" class="print-form">
              <el-row>
                <el-form-item label="报表名称">
                  <el-input v-model="form.reportName" type="text" />
                </el-form-item>

                <el-form-item label="报表编码">
                  <el-input v-model="form.reportCode" type="text" />
                </el-form-item>

                <el-form-item label="标题高度">
                  <el-input v-model="form.theight" type="text" />
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="纸张宽度">
                  <el-input v-model="form.pageWidth" type="text" />
                </el-form-item>
                <el-form-item label="纸张高度">
                  <el-input v-model="form.pageHeight" type="text" />
                </el-form-item>
                <el-form-item label="单位">
                  <el-select v-model="form.selectunit" style="width: 80px">
                    <el-option
                      v-for="(unit, index) in units"
                      :key="index"
                      :value="unit.value"
                      :label="unit.text"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="上边距">
                  <el-input v-model="form.tmargins" type="text" />
                </el-form-item>
                <el-form-item label="左边距">
                  <el-input v-model="form.lmargins" type="text" />
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="页眉高度">
                  <el-input v-model="form.header" type="text" />
                </el-form-item>
                <el-form-item label="页脚高度">
                  <el-input v-model="form.footer" type="text" />
                </el-form-item>
                <el-form-item label="页眉内容">
                  <el-input v-model="form.headerMsg" type="text" />
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="页脚显示方式">
                  <el-select v-model="form.selected">
                    <el-option
                      v-for="(option, index) in options"
                      :key="index"
                      v-bind:value="option.value"
                      :label="option.text"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="纸张方向">
                  <el-radio v-model="form.picked" label="One">纵</el-radio>
                  <el-radio v-model="form.picked" label="Two">横</el-radio>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="每页是否有表头">
                  <el-radio v-model="form.tpicked" label="One">有</el-radio>
                  <el-radio v-model="form.tpicked" label="Two">无</el-radio>
                </el-form-item>
              </el-row>
              
              <!--              <el-row>-->
              <!--                <el-form-item label="打印机设定">-->
              <!--                  <el-input v-model="form.setPrinterIndex" type="text" />-->
              <!--                </el-form-item>-->
              <!--              </el-row>-->
            </el-form>
            <p class="title">报表模板维护:</p>
            <!-- <div class="rows">
              <el-collapse>
                <el-collapse-item title="参数辅助" name="1">
                  <el-row :gutter="24">
                    <el-col :span="3">$T[变量名]</el-col>
                    <el-col :span="3">$R[条形码]</el-col>
                    <el-col :span="3">$E[二维码]</el-col>
                    <el-col :span="3">$D[表格名]</el-col>
                    <el-col :span="3">$B[int]</el-col>
                    <el-col :span="3">$F[列名]</el-col>
                    <el-col :span="3">$V[列名]</el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="7">$VA[value1,+value2] (和)横向合计</el-col>
                    <el-col :span="5">$VA[value1,*value2] (积)</el-col>
                    <el-col :span="6">$VA[value1,/value2] (比值)</el-col>
                    <el-col :span="6">$VA[value1,-value2] (相减)</el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="12">$A[纵向合计]，可添加多个，多个时","隔开</el-col>
                    <el-col :span="6">$AD[平均数]</el-col>
                    <el-col :span="6">$ADD[平均数纵向合计]</el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="6">点状表格边框：$S[dotted]</el-col>
                    <el-col :span="6">实线表格边框：$S[solid]</el-col>
                    <el-col :span="6">虚线表格边框：$S[dashed]</el-col>
                    <el-col :span="6">隐藏所在行边框：$N[0]</el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="8">$FM[图片列] 表格图图片列</el-col>
                    <el-col :span="8">$VM[图片行] 表格图图片行</el-col>
                    <el-col :span="8">注:$VA[]只穿一个参数显示为空</el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="9">表头斜线中$L[项目]$R[年份]$H[50]  效果项目\年份</el-col>
                       <el-col :span="6">$N[0]所在行隐藏边框</el-col>
                       <el-col :span="9">$F[arr1-arr2]表格嵌套，显示数据为arr1中的arr2数组</el-col>
                  </el-row>
                  <el-row :gutter="20">
                 
                    
                  </el-row>
                  <el-row :gutter="20">
                      <el-col
                        :span="23">
                      $F[arr1-arr2-1-50-t-l-b]b,t,l无顺序,有b最后一条有下边框，有t第一条有上边框,l(居左)，c(居中)，r(居右), 1(border) 50(height)除arr1其他非必填</el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </div> -->
            <!-- <div id="editor" style="width: 900px;height: 400px"></div> -->
            <axueditor
              style="width:100%;height:400px;max-height:450px;"
              :toolbars="toolbars"
              :isReDataEditor="true"
            />
            <div>
              <!--              <div class="header-button">-->
              <!--                <el-button type="primary" size="mini"   @click="gettext">编辑器中模板转成数据</el-button>-->
              <!--                <el-button  type="primary" size="mini" @click="toeditor">数据转到编辑器中</el-button>-->
              <!--              </div>-->
              <!--              <span> HTML格式： </span><br/>
              <textarea v-model="editHtml" style="width: 900px;height: 400px"></textarea>-->
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="transferVisible" title="打印测试" class="form_transfer">
      <div style="padding-left:35px">
        <span>测试用例：</span>
        <br />
        <textarea v-model="dataResultStr" style="width: 500px;height: 450px"></textarea>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printPdf">静默打印</el-button>
        <el-button type="primary" @click="previewPdf">打印预览</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import "../../../../public/Ueditor/ueditor.config.js";
// import "../../../../public/Ueditor/ueditor.all.js";
import "../../../../public/Ueditor/lang/zh-cn/zh-cn.js";
import { reRatas } from "@/utils/reData";
import { jsonToExcel, tableToExcel } from "@/utils/excel/excel";
import { print, preview, onPreview, printDesign } from "@/utils/print";
import {
  saveReport,
  queryReportList,
  delReport,
  updateReport,
  page,
} from "@/api/admin/print/print";

export default {
  name: "uEditor",
  props: {
    datas: Object,
  },
  data() {
    return {
      pvisible: false,
      instillationData: null,
      subInjectionData: null,
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
      dialogVisible1: false,
      transferVisible: false,
      dialogType: "add",
      form: {
        id: null,
        reportName: "",
        reportCode: "",
        pageWidth: "",
        pageHeight: "",
        lmargins: "",
        tmargins: "",
        header: "",
        footer: "",
        picked: "",
        headerMsg: "",
        selected: "",
        selectunit: "px",
        tpicked: "One",
        theight: "",
        setPrinterIndex: "",
        editorContent: "",
      },
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
        "edittd",
        // "edittable",
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
        'adaptbywindow'
      ],
      options: [
        { text: "第#页/共&页", value: "第#页/共&页" },
        { text: "# / &", value: "# / &" },
        { text: "- # -", value: "- # -" },
      ],
      units: [
        { text: "px", value: "px" },
        { text: "mm", value: "mm" },
        { text: "in", value: "in" },
      ],
    };
  },
  mounted() {
    // 实例化editor编辑器
    this.editor = UE_COMMON.getEditor("editor");
    // this.instillationData = instillationList;
    // this.subInjectionData = subInjection;
  },
  destroyed() {
    // 将editor进行销毁
    this.editor.destroy();
  },
  created() {
    this.handleList();
  },
  methods: {
    handleCancel() {
      this.transferVisible = false;
    },

    //添加报表
    handleAdd() {
      this.clearContent();
    },
    handleList() {
      page(this.params)
        .then((res) => {
          console.log(res);
          this.tableData = res.data;
          this.total = res.total;
          this.params.pageNo = res.pageNo;
          this.params.pageSize = res.pageSize;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleQuery() {
      let obj = {
        pageSize: 10,
        pageNo: 1,
        orderBy: "updated_at desc",
      };
      this.params = { ...this.params, ...obj };
      this.handleList();
    },
    handleSave() {
      if (this.form.reportName.length == 0) {
        this.$message.error("请输入报表名称");
        return;
      }
      if (this.form.reportCode.length == 0) {
        this.$message.error("请输入报表编码");
        return;
      }
      this.form.editorContent = this.editor.getContent();
      if (this.form.id == null) {
        this.reportSave(this.form);
      } else {
        this.reportEdit(this.form);
      }
    },
    reportSave(dataR) {
      saveReport(dataR)
        .then((res) => {
          if (res.code === 1) {
            this.$message({
              message: "数据添加成功",
              type: "success",
            });
            this.handleList();
          } else {
            this.$message({
              message: res.msg || "数据添加失败",
              type: "error",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    reportEdit(dataR) {
      updateReport(dataR)
        .then((res) => {
          if (res.code === 1) {
            this.$message({
              message: "数据修改成功",
              type: "success",
            });
            this.handleList();
          } else {
            this.$message({
              message: res.msg || "数据修改失败",
              type: "error",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    clearContent() {
      this.params = {
        name: "",
        pageNo: 1,
        pageSize: 10,
        orderBy: "updated_at desc",
      };
      this.form = {
        id: null,
        reportName: "",
        reportCode: "",
        pageWidth: "",
        pageHeight: "",
        lmargins: "",
        tmargins: "",
        header: "",
        footer: "",
        picked: "",
        headerMsg: "",
        selected: "",
        selectunit: "px",
        tpicked: "",
        theight: "",
        setPrinterIndex: "",
        editorContent: "",
      };
      this.editorContent = "";
      this.editHtml = "";
      this.dataResultStr = null;
      this.editor.setContent("");
      this.handleList();
    },
    handleEdit(row) {
      this.form = { ...row };
      this.editor.setContent(row.editorContent);
    },
    handleDelete(row) {
      this.$confirm("此操作将执行删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delReport(row.id).then((res) => {
            console.log(res);
            if (res.code === 1) {
              this.$message("删除成功");
              this.handleList();
            } else {
              this.$message("删除失败");
            }
          });
        })
        .catch(() => {});
    },
    // 分页
    changeSize(obj) {
      let val = {
        pageNo: obj.page,
      };
      console.log("#############",obj)
      this.params = { ...this.params, ...val };
      this.handleList();
    },
    handleClose1() {
      this.dialogVisible1 = false;
      this.editor.setContent("");
      //this.$refs['rform'].resetFields();
    },
    gettext() {
      this.editHtml = this.editor.getContent();
    },
    toeditor() {
      this.editor.setContent(this.editHtml);
    },
    printPdf() {
      // let dataR = this.instillationData;
      // let context = '<p style="text-align: center;"><span style="font-size: 24px; ">静滴卡</span></p><p>住院号:$T[hospitalNum] 床位号：$T[bedNum] 姓名:$T[name] 性别：$T[sex] 年龄：$T[age] 诊断：$T[diagnosis]</p><table style="border-spacing:0px" border="1px"><tbody></tbody><caption style="border-color: rgb(221, 221, 221);">$D[instillation]</caption><tbody><tr class="firstRow"><th width="100">$L[项目]$R[年份]$H[50]</th><th width="38">组</th><th width="38">开始时间</th><th width="38">医嘱名称/规格</th><th width="38">剂量</th><th width="38">频次</th><th rowspan="1" colspan="7" width="38">药物核对</th></tr><tr><td colspan="1" rowspan="1" valign="null" width="38"><br/></td><td width="38">$F[group]</td><td width="38">$F[begin]</td><td width="38">$F[medicalName]</td><td width="38">$F[dose]</td><td width="38">$F[frequency]</td><td width="38"><br/></td><td width="38"><br/></td><td width="38"><br/></td><td width="38"><br/></td><td width="38"><br/></td><td width="38"><br/></td><td width="38"><br/></td></tr></tbody></table><p style="text-align: right;">打印时间：$T[printDate]</p><p>打印时间：$E[ercode]</p>'
      let dom = this.editor.getContent();
      let dataR = JSON.parse(this.dataResultStr);
      dataR.domStr = dom;
      //为表头添加<thead>用于打印出现分页时每页显示表头
      if (this.form.tpicked) {
        dataR.tpicked = this.form.tpicked;
      } else {
        dataR.tpicked = "One";
      }

      //获取html字符串
      let str = reRatas(dataR);
      print(str, this.form, "订货单");
    },
  previewPdf() {
      let dom = this.editor.getContent();
      // console.log("this.dataResultStr", this.dataResultStr);
      let dataR = JSON.parse(this.dataResultStr);
      // console.log(dataR);
      if (dataR == null) {
        dataR = {};
      }
      dataR.domStr = dom;
      //为表头添加<thead>用于打印出现分页时每页显示表头
      if (this.form.tpicked) {
        dataR.tpicked = this.form.tpicked;
      } else {
        dataR.tpicked = "One";
      }
      
      //获取html字符串
      let str = reRatas(dataR);
      this.replaceStr(str, "color: rgb(255, 0, 0)", "visibility:hidden");
      // preview(str, this.form, "订货单");
    },
    previewDesign() {
      let dom = this.editor.getContent();
      let dataR = JSON.parse(this.dataResultStr);
      // console.log(dataR);
      if (dataR == null) {
        dataR = {};
      }
      dataR.domStr = dom;
      //为表头添加<thead>用于打印出现分页时每页显示表头
      if (this.form.tpicked) {
        dataR.tpicked = this.form.tpicked;
      } else {
        dataR.tpicked = "One";
      }

      //获取html字符串
      let str = reRatas(dataR);
      printDesign(str, this.form, "打印");

      // printDesign();
    },
    // 不需要返回值调用写法
    //  onPreview(){
    //   onPreview({},'静滴卡')
    //   console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",true)
    // },

    //需要返回值调用写法
    async onPreview() {
      let flag = await onPreview({}, "静滴卡1");
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", flag);
    },
    replaceStr(str, str1, str2) {
      let str3;
      if (str.indexOf(str1) != -1) {
        str3 = str.replace(str1, str2);
        // console.log("str3", str3);
        this.replaceStr(str3, str1, str2);
      } else {
        preview(str, this.form, "订货单");
      }
    },
    tableExcel() {
      // console.log("str-outerHTML-",str.outerHTML)
      var excelData = {
        title: ["报表名单"], //标题
        // where : ['科室:内科','bbbbbb'],  //条件
        tableId: "tableShow", //表格id  得到table  在需要导出数据的table控件添加 id='tableShow'
        fileName: "报表名单",
        // sumVal : ['0']  //计算合计，只写第几列就行，从0开始
      };
      tableToExcel(excelData);
    },
    outExcel() {
      let list = []; //你要导出的数据list。
      var aa = {
        group: "┏",
        begin: "08.08 20:16",
        medicalName: "10%葡萄糖注射液/250ml*1",
        dose: "250ml",
        frequency: "qd",
        route: "注射",
        onwPrice: "20.33",
        price: "2.33",
        days: "10",
        drNote:
          "注意观察注意观察注意观察注意观察注意观察注意观察注意观察注意观察注意观察注意观察注意观察",
        nsNote:
          "无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常无异常",
      };
      for (var i = 0; i < 99; i++) {
        list[i] = aa;
      }
      this.$confirm("此操作将导出excel文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var excelData = {
            title: ["订货单", "", "", "", "", "", "", "", "", "", ""],
            where: ["科室:内科", "年龄:23", "", "", "", "", "", "", "", "", ""],
            tHeader: [
              "组",
              "开始时间",
              "医嘱名称/规格",
              "剂量",
              "频次",
              "用法",
              "总价",
              "单价",
              "天数",
              "医生备注",
              "护士备注",
            ],
            filterVal: [
              "group",
              "begin",
              "medicalName",
              "dose",
              "frequency",
              "route",
              "onwPrice",
              "price",
              "days",
              "drNote",
              "nsNote",
            ],
            listDate: list,
            fileName: "订货单",
            merges: ["A1:K1"],
            sumVal: ["onwPrice"],
          };
          jsonToExcel(excelData);
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.header-button {
  padding: 7px 0;
}
.app-container {
  // background-color: #ffffff;
  overflow: hidden;
  height: 100%;
  padding-top: 0;
}
//设置按钮
.el-button--mini {
  border-radius: 0;
}

// 左侧
.el-col-8 {
  background-color: #fff;
  // padding: 20px 30px;
  height: 100%;
}
// 添加弹出框
.el-form {
  padding-bottom: 10px;
}
.el-input {
  padding: 5px 0;
}
.el-select {
  padding: 5px 0;
}
// 右侧
.el-col-16 {
  background-color: #fff;
  padding: 20px;
  width: 65.26667%;
  margin-left: 1.4%;
  // height: 100%;
}
.tree_box {
  padding: 20px;
}
.table_box {
  padding: 0 20px;
  // text-align: right;
  // margin-top: 20px;
}
/deep/.el-tree {
  border: 1px solid #dcdfe6;
}
.btn_group {
  text-align: right;
  margin-bottom: 20px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
// 弹出框选择select最后一行
.el-col-24 {
  height: 50px;
  line-height: 50px;
}
.el-button--medium {
  margin: 13px 0 0;
}
/deep/.el-form-item__error {
  position: static !important;
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
</style>
