<template>
  <div id="elementLibrary" class="element-library">
    <div id="searchBox" class="search-box">
      <!-- 操作类型 -->
      <el-select v-model="type" clearable class="type-select">
        <el-option
          v-for="item in types"
          :key="item.id"
          :label="item.baseElementName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <!-- 检索 -->
      <el-input
        class="keyword"
        placeholder="请输入检索条件"
        v-model="keyword"
        @keyup.enter.native="searchEles"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchEles"
        ></el-button>
      </el-input>
    </div>
    <!-- 检索结果 -->
    <el-table
      id="resultTable"
      ref="elementTable"
      highlight-current-row
      element-loading-text="加载中..."
      :data="tableData"
      :height="maxHeight"
      v-loadmore="load"
      v-loading="tlm_isLoading"
      @row-dblclick="insertElement"
    >
      <el-table-column
        label="元素名称"
        show-overflow-tooltip
        prop="elementName"
      ></el-table-column>
      <el-table-column
        label="类型"
        show-overflow-tooltip
        prop="elementBaseName"
      ></el-table-column>
      <el-table-column
        label="数据元"
        show-overflow-tooltip
        prop="dataElementName"
      >
        <template slot-scope="scope">
          {{ scope.row.dataElementName ? scope.row.dataElementName : "无" }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  getLibraryPageByCondition,
  getPageByCondition,
  detailQuery,
  getAll,
  getUuid
} from "@/api/emrRecord/emr/element";
import { getPamars } from "@/utils/auth";

export default {
  props: {
    editor: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      page: 0,
      pageSize: 25,
      tlm_isLoading: false,
      tlm_noMore: false,
      tableData: [],
      maxHeight: 250,
      type: "",
      types: [],
      keyword: ""
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.maxHeight =
        document.getElementById("elementLibrary").offsetHeight -
        document.getElementById("searchBox").offsetHeight;
      window.onresize = function() {
        this.maxHeight =
          document.getElementById("elementLibrary").offsetHeight -
          document.getElementById("searchBox").offsetHeight;
      };
      this.load();
    });
  },
  created() {
    if (!this.editor) {
      this.$message({
        type: "error",
        message: "请传入正确的编辑器实例！"
      });
      return;
    }
    this.getTypes();
  },
  methods: {
    async getTypes() {
      try {
        let response = await getAll();
        if (response.code == 1) {
          this.types = response.data.filter(item => {
            return item.baseElementCode != "00";
          });
        } else {
          this.$message({
            type: "error",
            message: "网络繁忙1，请重试！"
          });
        }
      } catch (e) {
        console.log(e);
        this.$message({
          type: "error",
          message: "网络繁忙2，请重试！"
        });
      }
    },
    //加载元素列表
    async load() {
      try {
        this.page++;
        this.tlm_isLoading = true;
        let response = await getLibraryPageByCondition({
          pageNo: this.page,
          pageSize: this.pageSize,
          baseElementId: this.type,
          elementName: this.keyword,
          hospitalId: JSON.parse(getPamars()).hosId
        });
        // let response=await getPageByCondition({pageNo:this.page,pageSize:this.pageSize,baseElementId:this.type,elementName:this.keyword,hospitalId:JSON.parse(getPamars()).hosId});
        this.tlm_isLoading = false;
        let newTableData = [];
        if (response.code == 1) {
          if (response.data) {
            newTableData = response.data.elementLibraryPageContentDto;
          }
        } else {
          this.$message({
            type: "error",
            message: "网络繁忙3，请重试！"
          });
        }
        if (newTableData.length == 0) {
          this.tlm_noMore = true;
        } else {
          this.tableData = this.tableData.concat(newTableData);
        }
      } catch (e) {
        this.tlm_isLoading = false;
        console.log(e);
        this.$message({
          type: "error",
          message: "网络繁忙4，请重试！"
        });
      }
    },
    //查询元素列表
    searchEles() {
      this.page = 0;
      this.tableData = [];
      this.load();
    },
    //双击插入元素
    async insertElement(row, column, event) {
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
      try {
        let details = await detailQuery({ id: row.elementId });
        console.log("111");
        if (details.code == 1) {
          let attrs = details.data;
          console.log("1112");

          this.editor.execCommand("insertelement", {
            type: row.elementBaseCode,
            data: await this.remakeData(attrs)
          });
          console.log("111266");
        } else {
          this.$message({
            type: "error",
            message: "网络繁忙5，请重试！"
          });
        }
      } catch (e) {
        console.log(e);
        this.$message({
          type: "error",
          message: "网络繁忙6，请重试！"
        });
      }
    },
    //重新构造元素数据
    async remakeData(data) {
      let metaIds = ["0402", "1202", "0502", "1302", "0805"];
      let metaCodes = ["0403", "1203", "0503", "1303", "0806"];
      let metaLabels = ["0404", "1204", "0504", "1304", "0807"];
      let resObj = await getUuid();
      console.log("111234");
      let metaData = {};
      var newData = {};
      // 基本属性转换
      newData.id = resObj.data;
      newData.name = data.elementName;

      // 通用属性转换
      newData.isDel = data.commonAttributeDto.checkDeletable == 1 ? "on" : "";
      newData.showBorder =
        data.commonAttributeDto.checkDisplay == 1 ? "on" : "";
      (newData.borderType = data.commonAttributeDto.borderType
        ? data.commonAttributeDto.borderType
        : "underline"),
        (newData.borderStyle = data.commonAttributeDto.borderStyle
          ? data.commonAttributeDto.borderStyle
          : ""),
        (newData.isFreeEdit =
          data.commonAttributeDto.checkEdit == 1 ? "on" : "");
      newData.checkDirectCite =
        data.commonAttributeDto.checkDirectCite == 1 ? "on" : "";
      newData.isEmpty = data.commonAttributeDto.checkEmpty == 1 ? "on" : "";
      newData.isHide = data.commonAttributeDto.checkHidden == 1 ? "on" : "";
      newData.isPrint = data.commonAttributeDto.checkPrintable == 1 ? "on" : "";
      newData.readonly = data.commonAttributeDto.checkReadonly == 1 ? "on" : "";
      newData.quot = data.commonAttributeDto.checkReference == 1 ? "on" : "";
      newData.isSecret = data.commonAttributeDto.checkSecret == 1 ? "on" : "";
      newData.source = data.commonAttributeDto.checkSource == 1 ? "on" : "";
      newData.placeholderText =
        data.commonAttributeDto.placeholderText || data.elementName;
      newData.tipText = data.commonAttributeDto.tooltipText || data.elementName;
      newData.defaultVal = data.commonAttributeDto.defaultValues;
      newData.namepos = data.commonAttributeDto.nameStyle;
      // 专有属性转换
      data.proprietaryAttributeVoLst.map(item => {
        if (item.proprietaryCode == "0101") {
          newData.minLen = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0100") {
          newData.maxLen = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0300") {
          newData.elemUnit = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0301") {
          newData.eleUnitContr = item.proprietaryContent == 0 ? "" : "on";
        }
        if (item.proprietaryCode == "0302") {
          newData.numAccuracy = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0303") {
          newData.valMin = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0304") {
          newData.valMax = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0305") {
          newData.normalMin = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0306") {
          newData.normalMax = item.proprietaryContent;
        }
        if (
          item.proprietaryCode == "0400" ||
          item.proprietaryCode == "0500" ||
          item.proprietaryCode == "1200" ||
          item.proprietaryCode == "1300"
        ) {
          newData.isRange = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0401") {
          newData.transferRadio = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0700") {
          newData.inserCurDate = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0701") {
          newData.dateFormat = item.proprietaryContent;
        }
        if (item.proprietaryCode == "1101") {
          newData.isCurrDoctor = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0800") {
          newData.notSuffixName = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0801") {
          newData.yesSuffixName = item.proprietaryContent;
        }
        if (item.proprietaryCode == "0900") {
          newData.content = item.proprietaryContent;
        }
        if (item.proprietaryCode == "1102") {
          newData.signtype = item.proprietaryContent;
        }
        if (item.proprietaryCode == "1103") {
          newData.placeholderText = item.proprietaryContent;
        }
        if (item.proprietaryCode == "1104") {
          newData.sort = item.proprietaryContent;
        }
        if (item.proprietaryCode == "1105") {
          newData.signatureLevel = JSON.parse(item.proprietaryContent);
        }
        if (item.proprietaryCode == "1106") {
          newData.placeholderTextArr = JSON.parse(item.proprietaryContent);
        }
        if (metaIds.indexOf(item.proprietaryCode) > -1) {
          metaData.id = item.proprietaryContent;
        }
        if (metaCodes.indexOf(item.proprietaryCode) > -1) {
          metaData.code = item.proprietaryContent;
        }
        if (metaLabels.indexOf(item.proprietaryCode) > -1) {
          metaData.label = item.proprietaryContent;
        }
        if (metaData.id !== "") {
          metaData.idx = 1;
          metaData.metaType = 1;
          newData.metaData = JSON.stringify(metaData);
        }
      });
      console.log("11123456");

      //单复选、下拉选项转换
      var valList = data.valueLst;
      newData.options = valList.map((item, index) => {
        if (item.defaultSelection == 1) {
          if (!newData.userDefault) {
            newData.userDefault = [item.vCode];
          } else {
            newData.userDefault.push(item.vCode);
          }
        } else {
          newData.userDefault = [];
        }
        return {
          index: index,
          key: item.vCode,
          value: item.vMean,
          score: item.score,
          isDefault: item.defaultSelection == 1 ? true : false
        };
      });
      console.log("111234567");

      return newData;
    }
  }
};
</script>
<style lang="scss">
.element-library {
  padding: 0 !important;
  padding-left: 1px;
  .search-box {
    padding: 10px;
    .type-select {
      margin-bottom: 10px;
    }
  }
  .el-table--scrollable-x .el-table__body-wrapper {
    overflow: hidden;
    overflow-y: auto !important;
  }
}
</style>
