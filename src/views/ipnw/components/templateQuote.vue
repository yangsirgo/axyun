<template>
  <div class="temp">
    <div class="top-container">
      <el-radio-group v-model="cateogry" class="align-center" @change="typeChange">
        <el-radio label="1">全院</el-radio>
        <el-radio label="2">科室</el-radio>
        <el-radio label="3">个人</el-radio>
      </el-radio-group>
      <el-input
        placeholder="请输入检索条件"
        v-model="keyword"
        @change="keywordUpdate"
        style="margin-top:8px;"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <!-- <div class="content">
      <el-table
        ref="tableElem"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%;"
        height="100%"
        v-loadmore="loadNextPage"
        element-loading-text="加载中..."
      >
        <el-table-column prop="templName" label="模板名" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              class="act-word cursor-pointer"
              @click="showDetail(scope.row)"
            >{{ scope.row.templName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="templ_remark" label="备注" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.templ_remark }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span class="act-word cursor-pointer" @click="operation(row)">明细</span>
          </template>
        </el-table-column>
      </el-table>
    </div>-->
    <div
      class="content overflow-scroll-vertical"
      v-infinite-scroll="loadNextPage"
      infinite-scroll-disabled="listDisabled"
    >
      <el-collapse v-model="activeNames">
        <l-collapse-item
          sty="2"
          v-for="(item, index) in tableData"
          :key="'list' + index"
          :name="index"
        >
          <template slot="title">
            <div class="width100">
              <span>{{item.residentAdviceFormworkSbuject.adviceFormworkName}}</span>
              <div
                v-if="activeNames.indexOf(index) != -1"
                @click.stop="quote()"
                class="float-right quote-button mini-button"
                type="primary"
              >{{$t('base.quote')}}</div>
            </div>
          </template>
          <template slot="content">
            <el-table
              ref="tableElem"
              :data="item.residentAdviceFormworkContentList"
              border
              tooltip-effect="dark"
              style="width: 100%;"
              @selection-change="handleSelectionChange"
            >
              >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column
                prop="name"
                :label="$t('base.toolBox.projectName')"
                min-width="102"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="spec" :label="$t('base.toolBox.spec')" min-width="102"></el-table-column>
              <!--<el-table-column label="操作" min-width="85">
                <template>
                  <span class="mini-button" @click="quote">{{$t('base.quote')}}</span>
                </template>
              </el-table-column>-->
            </el-table>
          </template>
        </l-collapse-item>
        <p v-if="tlm_isLoading" class="load-list-bottom">{{$t('base.loading')}}</p>
        <p v-if="tlm_noMore" class="load-list-bottom">{{$t('base.noMore')}}</p>
      </el-collapse>
    </div>
    <el-dialog :title="templeteName" :visible.sync="dialogVisible" width="600px">
      <div style="padding:5px;">
        <el-table :data="templeteTableData" border>
          <el-table-column
            v-for="(item,index) in templeteTableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
          ></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="quote">引 用</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getByTypeAndName } from "@/api/cis/toolBox/toolBox";
import {
  getAdviceFormwork,
  leadAdviceFormwork
} from "@/api/cis/resident/residentAdviceFormwork";
import { getRecipeCode, saveOrdersByTemp } from "@/api/cis/order/order";
import { mapGetters } from "vuex";

export default {
  name: "prescriptionTemp",
  data() {
    return {
      quoteStr: "", // 引用id字符串
      // 检索关键词
      keyword: "",
      // 类型值
      cateogry: "2",

      // 列表数据
      tableData: [],
      // 分页控制参数
      pageParams: {
        pageNo: 1, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      // table 分页加载必须定义字段
      tlm_isLoading: false,
      // 模板数据
      templeteName: "",
      templeteTableData: [
        {
          name: "阿莫西林胶囊",
          spec: "一盒24粒",
          formCode: "5",
          drugUnit: "g"
        }
      ],
      // 表格数据
      templeteTableParams: [
        {
          prop: "ITEM_NAME",
          label: "名称",
          width: "100"
        },
        {
          prop: "SPEC",
          label: "规格",
          width: "100"
        },
        {
          prop: "FORM_CODE",
          label: "剂量",
          width: "50"
        },
        {
          prop: "UNIT",
          label: "剂量单位",
          width: "50"
        }
      ],
      dialogVisible: false,
      activeNames: []
    };
  },
  computed: {
    ...mapGetters("cis", ["leaveAppLoadKey"]),
    ...mapGetters("base", ["receivePatientData"]),
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  mounted() {
    this.loadTable();
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val, "val");
      this.quoteStr = "";
      for (let index = 0; index < val.length; index++) {
        this.quoteStr =
          this.quoteStr === ""
            ? val[index].id
            : this.quoteStr + "," + val[index].id;
      }
      console.log(this.quoteStr, "this.quoteStr");
    },
    // table加载下一页
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    // 加载table数据
    async loadTable() {
      console.log("loadTable");
      try {
        this.tlm_isLoading = true;
        // TODO await request

        let params = {
          adviceFormworkType: this.cateogry,
          adviceFormworkName: this.keyword,
          pageNum: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize
        };

        let response = await getAdviceFormwork(params);
        this.tableData = response.data;
        this.pageParams = { ...response.pageParams };
        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
        this.$message.error(error.msg);
      }
    },
    // 搜索关键词
    keywordUpdate() {
      console.log("keywordUpdate", this.keyword);
      this.loadTable();
    },
    // 分类切换
    typeChange() {
      console.log("typeChange", this.cateogry);
      this.loadTable();
    },
    // 显示诊断详情
    showDetail(data) {
      this.templeteName = "";
      this.dialogVisible = true;
      this.templeteTableData = data.templetDetail;
    },

    // 引用
    async quote() {
      if (this.quoteStr !== "") {
        this.$emit("message", this.quoteStr);
      } else {
        this.$message.warning("请选择模板");
      }
    }
  },
  watch: {
    leaveAppLoadKey(n) {
      if (String(n).indexOf("CHANGEFORM") > -1) {
        let formObj = {};
        let urlString = n.substring(n.indexOf("?") + 1);
        let urlArray = urlString.split("&");
        for (let i = 0, len = urlArray.length; i < len; i++) {
          let urlItem = urlArray[i];
          let item = urlItem.split("=");
          if (item[0] === "radio") {
            this.cateogry = item[1];
          }
        }
      }
      this.loadTable();
    }
  }
};
</script>
<style lang='scss' scoped>
.temp {
  // width: 298px;
  // height: 500px;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .top-container {
    height: 80px;
    padding: 10px 0;
    // text-align: center;
  }
  .content {
    width: 100%;
    height: calc(100% - 80px);
  }
  .act-word {
    color: $l-color-fontcolor-2;
  }
  .quote-button {
    margin-top: 8px;
  }
}
</style>
