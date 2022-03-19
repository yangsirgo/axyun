<template>
  <div class="checkTemp">
    <div class="box-title" v-text="tempTypeList[eleTemType]"></div>
    <div class="top-container">
      <el-radio-group v-model="cateogry" class="align-center" @change="typeChange">
        <!-- <el-radio :label="40">全院</el-radio> -->
        <el-radio label="1">科室</el-radio>
        <el-radio label="2">个人</el-radio>
      </el-radio-group>
      <el-input
        placeholder="请输入检索条件"
        v-model="keyword"
        @keydown.native="keywordUpdate"
        style="margin-top:8px;"
      >
        <!-- <el-button
          slot="append"
          icon="el-icon-search"
          @click="getTemList"
        ></el-button>-->
      </el-input>
    </div>
    <div class="content">
      <el-table
        ref="tableElem"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%;"
        height="100%"
        v-loading="loading"
        element-loading-text="加载中..."
      >
        <el-table-column prop="name" label="模板名" width="80" show-overflow-tooltip fixed>
          <template slot-scope="scope">
            <span :title="scope.row.name">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span class="act-word cursor-pointer margin-right-10" @click="quote(row)">引用</span>
            <span class="act-word cursor-pointer margin-right-10" @click="edit(row)">编辑</span>
            <span class="act-word del-btn cursor-pointer" @click="del(row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="模板编辑" :visible.sync="dialogVisible" width="800px">
      <div class="padding20">
        <el-row class="card-space-bottom" :gutter="10">
          <el-col :span="12">
            <l-formt-title label="模板名称" :required="true">
              <el-input v-model="templateInfo.name" placeholder="请输入"></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="12">
            <l-formt-title label="模板类型">
              <el-select v-model="templateInfo.type" placeholder="请选择">
                <el-option label="科室" value="1"></el-option>
                <el-option label="个人" value="2"></el-option>
              </el-select>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row class="card-space-bottom">
          <el-col>
            <l-formt-title label="备注">
              <el-input v-model="templateInfo.remark" placeholder="请输入"></el-input>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="card-space-bottom topseach">
          <el-col :span="4">
            <el-select v-model="formSearch.group" placeholder="组套" @change="search">
              <el-option v-for="item in groups" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="20">
            <el-input
              placeholder="项目名称或简拼查询"
              v-model="formSearch.inputop"
              @keydown.native="enterSearch($event)"
            >
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-table
          :data="templeteTableData"
          class="chargeTable"
          height="300px"
          row-key="groupId"
          border
          stripe
          ref="orderTable"
          @select="handlerSelectChange"
          @selection-change="handleSelectionChange"
          v-loading="tlm_isLoading"
          v-loadmore="{
            noMoreVar: 'tlm_noMore',
            loadingVar: 'tlm_isLoading',
            value: loadNextPage
          }"
        >
          <el-table-column type="selection" :reserve-selection="true" align="center" width="32"></el-table-column>
          <el-table-column prop="groupName" label="医嘱名称">
            <template slot-scope="scope">
              <div class="chargeItem">{{ scope.row.groupName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="yzname" label="项目名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <div
                class="chargeItem"
                v-for="item in scope.row.list"
                :key="item.id"
                :title="item.chargeItemName"
              >{{ item.chargeItemName }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="saveLoad" @click="submitTem">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getChargeTemplateList,
  saveTemplate,
  getAilItems,
  saveChargeTem,
  delChargeTem
} from "@/api/electronApply/chargeTemplate";
import { mapGetters } from "vuex";

export default {
  name: "checkTemp",
  props: {
    eleType: {
      type: Number
    }
  },
  data() {
    return {
      // 检索关键词
      keyword: "",
      // 类型值
      cateogry: "1",

      // 列表数据
      tableData: [],
      // 分页控制参数
      pageParams: {
        pageNo: 1, // 当前页数
        total: 0, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      // table 分页加载必须定义字段
      tlm_isLoading: false,
      // 模板数据
      templeteName: "模板编辑",
      templeteTableData: [],
      dialogVisible: false,
      loading: false,
      templateType: "",
      setmeal: [],
      persmeal: [],
      orderTable: [],
      tempTypeList: {
        "1": "检查申请",
        "3": "治疗申请",
        "4": "检验申请"
      },
      // 搜索
      formSearch: {
        group: "1",
        inputop: ""
      },
      //组套下拉
      groups: [
        {
          id: "1",
          label: "医嘱"
        },
        {
          id: "2",
          label: "项目"
        }
      ],
      searchDebounced: null,
      templateInfo: {
        name: "",
        type: "1"
      },
      //检验明细选中数据源
      checkedList: [],
      temCheckedList: [],
      saveLoad: false
    };
  },
  computed: {
    ...mapGetters("eleApply", ["eleTemType", "eleTemRefresh"]),
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
    temType() {
      return this.$attrs.templateType;
    }
  },
  watch: {
    // 监听科室个人类型切换
    eleTemType: {
      immediate: true,
      handler(val) {
        this.templateType = val;
        this.getTemList();
      }
    },
    eleTemRefresh() {
      this.getTemList();
    }
  },
  methods: {
    // table加载下一页
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.loadTableTem();
    },
    search() {
      this.pageParams.pageNo = 1;
      this.pageParams.total = 0;
      this.loadTableTem();
    },
    reTableData(data) {
      let obj = {};
      // 同组去重
      let list = data.reduce((item, next) => {
        if (!obj[next.groupName]) {
          obj[next.groupName] = true;
          item.push(next);
        }
        return item;
      }, []);
      // 同组放到相同的chidlren里
      let arr = list.map(item => {
        let children = data.filter(ele => ele.groupId === item.groupId);
        return {
          ...item,
          list: children
        };
      });
      return arr;
    },
    loadTableTem() {
      this.tlm_isLoading = true;
      //点击具体模板事件
      getChargeTemplateList({
        id: this.templateInfo.id,
        level: "2",
        outOrInpEnable: "1",
        tempType: "0",
        templateType: this.eleTemType,
        loadUseRange: this.eleType,
        queryType: this.formSearch.group,
        searchData: this.formSearch.inputop,
        ...this.pageParams
      })
        .then(result => {
          if (result.code == "1") {
            let dataList = this.reTableData(result.data.groupList);
            if (this.pageParams.pageNo === 1) {
              if (result.data.checkedList) {
                this.temCheckedList = this.reTableData(result.data.checkedList);
              }
              this.templeteTableData = dataList;
            } else {
              this.templeteTableData = this.templeteTableData.concat(dataList);
            }
            this.pageParams.total = result.total;
            this.$nextTick(() => {
              dataList.forEach(item => {
                if (item.checkStatus == 1) {
                  this.$refs.orderTable.toggleRowSelection(item, true);
                }
              });
            });
          }
          this.tlm_isLoading = false;
        })
        .catch(err => {
          this.tlm_isLoading = false;
        });
    },
    handlerSelectChange(rows, row) {
      /* if (this.temCheckedList.length === 0) {
        return;
      } */
      let selected = rows.length > 0 && rows.indexOf(row) !== -1;
      if (selected) {
        this.temCheckedList.push(row);
      } else {
        for (let i = this.temCheckedList.length - 1; i >= 0; i--) {
          let item = this.temCheckedList[i];
          if (item.groupId === row.groupId) {
            this.$delete(this.temCheckedList, i);
          }
        }
      }
    },
    //检验明细项选中
    handleSelectionChange(val) {
      this.checkedList = val;
    },
    // 搜索关键词
    keywordUpdate() {
      this.searchDebounced && clearInterval(this.searchDebounced);
      this.searchDebounced = setTimeout(() => {
        this.getTemList();
      }, 600);
    },
    // 分类切换
    typeChange(val) {
      this.showTemTable(val);
      this.templateInfo.type = val;
    },
    showTemTable(val) {
      if (val === "1") {
        this.tableData = this.setmeal;
      } else if (val === "2") {
        this.tableData = this.persmeal;
      }
    },
    // 获取模板数据
    getTemList() {
      this.setmeal = [];
      this.persmeal = [];
      this.loading = true;
      getChargeTemplateList({
        itemType: "1",
        templateType: this.templateType,
        level: "1",
        outOrInpEnable: "1",
        tempType: "0",
        searchData: this.keyword,
        loadUseRange: this.eleType
      })
        .then(res => {
          if (res.code === 1) {
            let setmealData = [];
            let persmealData = [];
            res.data.deptList.forEach(function(item) {
              setmealData.push({
                id: item.templateId,
                name: item.templateName,
                remark: item.remark
              });
            });
            res.data.personalList.forEach(function(item) {
              persmealData.push({
                id: item.templateId,
                name: item.templateName,
                remark: item.remark
              });
            });
            this.setmeal = setmealData;
            //个人套餐
            this.persmeal = persmealData;
            this.showTemTable(this.cateogry);
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err);
        });
    },
    quote(row) {
      this.$emit("message", row.id);
    },
    edit(data) {
      this.dialogVisible = true;
      this.formSearch = this.$options.data().formSearch;
      this.$nextTick(() => {
        this.$refs.orderTable.clearSelection();
        this.templateInfo = { ...this.templateInfo, ...data };
        this.temCheckedList = [];
        this.search();
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
            delChargeTem(data.id)
              .then(res => {
                if (res.code === 1) {
                  this.$message.success("删除成功");
                  this.getTemList();
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
      let submitData = [];
      this.temCheckedList.forEach(item => {
        let arr = item.list.map(ele => ({
          Id: ele.id,
          itemType: 2
        }));
        submitData.push({
          groupId: item.groupId,
          chargePackageDlist: arr
        });
      });
      if (submitData.length === 0) {
        this.$message.warning("请选择医嘱");
        return;
      }
      let templateData = {
        templateId: this.templateInfo.id,
        templateName: this.templateInfo.name,
        remark: this.templateInfo.remark,
        templateType: this.eleTemType,
        groupList: submitData,
        deptOrPerson: this.templateInfo.type
      };
      this.saveLoad = true;
      saveChargeTem(templateData)
        .then(res => {
          if (res.code === 1) {
            this.$message.success("编辑成功");
            this.dialogVisible = false;
            this.$emit("message", "");
            this.getTemList();
          } else {
            this.$message.error(res.msg || "编辑失败");
          }
          this.saveLoad = false;
        })
        .catch(err => {
          this.saveLoad = false;
          this.$message.error(err.msg || "编辑失败");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.box-title {
  height: 20px;
  line-height: 20px;
  font-weight: bold;
  font-size: $l-font-size;
  color: $l-color-fontcolor-3;
}
.checkTemp {
  width: 100%;
  height: 100%;
  background-color: #fff;
  /deep/ .cardtitle {
    height: 36px;
    line-height: 36px;
    .titleleft::before {
      margin-top: 6px;
    }
  }
  .top-container {
    height: 80px;
    padding: 10px 0;
  }
  .content {
    width: 100%;
    height: calc(100% - 100px);
  }
  .act-word {
    color: $l-color-fontcolor-2;
  }
  /deep/.el-radio__label {
    padding-left: 6px;
  }
}
.chargeTable {
  /deep/ thead {
    .el-checkbox {
      display: none;
    }
  }
  /deep/ tbody .cell {
    padding: 0;
    .chargeItem {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      border-top: 1px solid $l-color-bgcolor-11;
      &:first-child {
        border-top: 0;
      }
    }
  }
}
.del-btn {
  color: $l-color-fontcolor-5 !important;
}
</style>
