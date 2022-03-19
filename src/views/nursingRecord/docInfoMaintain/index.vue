<template>
  <div class="width100 height100 docInfoMaintain">
    <el-card class="tree height100 float-left">
      <l-card-title>
        <span slot="left">文书分类</span>
      </l-card-title>
      <div class="tree-cont">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          default-expand-all
          @node-click="treeClick"
        ></el-tree>
      </div>
    </el-card>
    <el-card class="docInfoMaintain-cont height100 float-right">
      <div class="nav-bars clearfix">
        <div class="float-left">
          <el-row class="fontSizeZero" :gutter="20">
            <el-col :span="5">
              <LFormtTitle label="文书编码">
                <el-input
                  v-model="searchData.docCode"
                  style="line-height: 34px; width: 100%"
                  placeholder="请输入"
                >
                </el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="文书名称">
                <el-input
                  v-model="searchData.docName"
                  style="line-height: 34px; width: 100%"
                  placeholder="请输入"
                >
                </el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="拼音码">
                <el-input
                  v-model="searchData.docInputcodePinyin"
                  style="line-height: 34px; width: 100%"
                  placeholder="请输入"
                >
                </el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="5">
              <LFormtTitle label="五笔码">
                <el-input
                  v-model="searchData.docInputcodeFive"
                  style="line-height: 34px; width: 100%"
                  placeholder="请输入"
                >
                </el-input>
              </LFormtTitle>
            </el-col>
            <el-col class="fontSizeZero" :span="4">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="primary" plain @click="reset">重置</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="fontSizeZero float-right">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-button type="primary" plain @click="addData">新建</el-button>
              <el-button
                type="primary"
                plain
                @click="modifyData"
                :disabled="selections.length != 1"
                >修改
              </el-button>
              <el-button
                type="primary"
                plain
                @click="deleteData"
                :disabled="selections.length < 1"
                >删除
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="table-cont">
        <el-table
          :data="docInfoData"
          width="100%"
          height="100%"
          :stripe="true"
          border
          v-loadmore="load"
          v-loading="tlm_isLoading"
          @selection-change="selectionChange"
          :element-loading-text="$t('retreat.loadInfo')"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in docInfoParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'classCode'">
                {{ getClassName(scope.row["classCode"]) }}
              </template>
              <template v-else-if="item.prop == 'docType'">
                <span
                  :val="scope.row['docType']"
                  code="CareDocType"
                  v-codeTransformEmr
                ></span>
              </template>
              <template v-else-if="item.prop == 'docUser'">
                <span
                  :val="scope.row['docUser']"
                  code="CareUserType"
                  v-codeTransformEmr
                ></span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog
      :title="dialogTitle"
      width="470px"
      :visible.sync="docInfoDisable"
      :close-on-click-modal="false"
    >
      <docInfo-add
        v-if="docInfoDisable"
        :form="form"
        :treeData="treeData"
        @docInfoAddConfirm="docInfoAddConfirm"
        @docInfoAddCancel="docInfoAddCancel"
      ></docInfo-add>
    </el-dialog>
  </div>
</template>

<script>
  import docInfoAdd from "./components/docInfoAdd";
  import {getClassifyData} from "@/api/emrRecord/nursingRecord/classifyMaintain";
  import {
    getDocInfo,
    batchDeleteDocInfo
  } from "@/api/emrRecord/nursingRecord/docInfoMaintain";

  export default {
    name: "index",
    components: {
      docInfoAdd
    },
    data() {
      return {
        //树数据
        treeData: [
          {
            className: "文书分类",
            children: []
          }
        ],
        defaultProps: {
          children: "children",
          label: "className"
        },
        searchData: {
          /*classCode: "",
          docName: "",
          docCode: "",
          docInputcodePinyin: "",
          docInputcodeFive: ""*/
        },
        /*分页信息*/
        pageSize: 20,
        pageNo: 1,
        total: 0,
        tlm_noMore: false,
        tlm_isLoading: false,
        docInfoParams: [
          {
            prop: "docCode",
            label: "文书编码",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "docName",
            label: "文书名称",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "120"
          },
          {
            prop: "classCode",
            label: "文书分类",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "docType",
            label: "文书类型",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "docUser",
            label: "适用类型",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "docNote",
            label: "描述",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "200"
          }
        ],
        docInfoData: [],
        docInfoDataUnit: [],
        //选择的项目
        selections: [],
        //弹框标题
        dialogTitle: "",
        //弹框显示
        docInfoDisable: false,
        //新增or修改form
        form: {}
      };
    },
    computed: {
      totalPage() {
        return Math.ceil(this.total / this.pageSize);
      }
    },
    async created() {
      await this.getClassifyData();
      await this.search();
      this.docInfoData = this.docInfoDataUnit;
    },
    methods: {
      /*点击树*/
      async treeClick(data) {
        if (data.classCode) {
          this.searchData.classCode = data.classCode;
          this.pageNo = 1;
          this.pageSize = 20;
          await this.getdocInfoData();
          this.docInfoData = this.docInfoDataUnit;
        }
      },
      /*获取文书分类数据*/
      async getClassifyData() {
        this.$showLoading();
        try {
          let data = await getClassifyData({});
          if (data.code == "1") {
            this.treeData[0].children = [...data.data];
          } else {
            this.$message.error(data.msg || "获取文书分类数据失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取文书分类数据失败");
        }
      },
      /*获取文书信息数据*/
      async getdocInfoData() {
        this.$showLoading();
        try {
          let params = {
            ...this.searchData,
            pageSize: this.pageSize,
            pageNo: this.pageNo
          };
          let data = await getDocInfo(params);
          if (data.code == "1") {
            this.docInfoDataUnit = [...data.data];
          } else {
            this.$message.error(data.msg || "获取文书信息数据失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取文书信息数据失败");
        }
      },
      load() {
        const _this = this;
        this.pageNo++;
        setTimeout(async () => {
          let docInfoData = [..._this.docInfoData];
          if (_this.pageNo > _this.totalPage) {
            _this.tlm_noMore = true;
            _this.pageNo = _this.totalPage;
          } else {
            await this.getdocInfoData();
            _this.docInfoData = [...docInfoData.concat(_this.docInfoDataUnit)];
          }
          _this.tlm_isLoading = false;
        }, 2000);
      },
      /*搜索*/
      async search() {
        this.pageNo = 1;
        this.pageSize = 20;
        this.searchData.classCode = "";
        await this.getdocInfoData();
      },
      /*重置*/
      reset() {
        this.searchData = {
          classCode: "",
          docName: "",
          docCode: "",
          docInputcodePinyin: "",
          docInputcodeFive: ""
        };
      },
      /*选择框改变*/
      selectionChange(selections) {
        this.selections = [...selections];
      },
      /*增加*/
      addData() {
        this.docInfoDisable = true;
        this.dialogTitle = "新建护理文书";
        this.form = {
          add: "1"
        };
      },
      /*修改*/
      modifyData() {
        if (this.selections && this.selections.length === 1) {
          this.docInfoDisable = true;
          this.dialogTitle = "修改护理文书";
          this.form = {
            ...this.selections[0],
            add: "0"
          };
        }
      },
      /*删除*/
      deleteData() {
        let selectionsArr = [];
        for (let i in this.selections) {
          selectionsArr.push(this.selections[i].id);
        }
        if (selectionsArr.length > 0) {
          this.$confirm("确定删除吗？", "文书删除", {
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            this.$showLoading();
            try {
              let data = await batchDeleteDocInfo(selectionsArr);
              if (data.code == "1") {
                this.$message("删除成功");
                this.pageNo = 1;
                this.pageSize = 20;
                await this.reset();
                await this.search();
                this.docInfoData = this.docInfoDataUnit;
              } else {
                this.$message.error(data.msg || "删除失败");
              }
              this.$hideLoading();
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "删除失败");
            }
          });
        }
      },
      /*dialog*/
      async docInfoAddConfirm() {
        this.docInfoDisable = false;
        this.pageNo = 1;
        this.pageSize = 20;
        await this.reset();
        await this.search();
        this.docInfoData = this.docInfoDataUnit;
      },
      docInfoAddCancel() {
        this.docInfoDisable = false;
      },
      /*dialog*/
      /*获取文书名称*/
      getClassName(classCode) {
        let arr = this.treeData[0].children;
        for (let i in arr) {
          if (arr[i].classCode == classCode) {
            return arr[i].className;
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss">
.docInfoMaintain {
  .tree {
    width: 287px;
    padding: 0 20px 20px 20px;
    margin-right: 20px;
  }

  .fontSizeZero {
    font-size: 0;
  }

  .docInfoMaintain-cont {
    width: calc(100% - 307px);
    padding: 20px;
  }

  .table-cont {
    height: calc(100% - 58px);
    margin-top: 20px;
  }
}
</style>
