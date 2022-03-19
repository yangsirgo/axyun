<template>
  <div class="depMaintain clearfix width100 height100">
    <div class="left-doc float-left height100">
      <div class="nav-bars">
        <el-row :gutter="20">
          <el-col :span="6">
            <LFormtTitle label="文书名称">
              <el-input
                v-model="searchData.docName"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              ></el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <LFormtTitle label="拼音码">
              <el-input
                v-model="searchData.docInputcodePinyin"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              ></el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <LFormtTitle label="五笔码">
              <el-input
                v-model="searchData.docInputcodeFive"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              ></el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table-cont">
        <el-table
          ref="docTable"
          :data="docInfoData"
          width="100%"
          height="100%"
          :stripe="true"
          border
          v-loadmore="load"
          v-loading="tlm_isLoading"
          :element-loading-text="$t('retreat.loadInfo')"
          @row-click="rowClick"
          highlight-current-row
        >
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
              <template v-if="item.prop == 'docType'">
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
    </div>
    <div class="right-doc float-right height100">
      <div class="nav-bars">
        <el-row :gutter="20">
          <el-col :span="6">
            <LFormtTitle label="科室名称">
              <el-input
                v-model="depSearchData.depName"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              ></el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="searchDep">查询</el-button>
          </el-col>
          <el-col :span="6" :offset="6">
            <el-button type="primary" @click="save" class="float-right"
              >保存</el-button
            >
          </el-col>
        </el-row>
      </div>
      <div class="table-cont">
        <el-table
          ref="depTable"
          :data="depList"
          width="100%"
          height="100%"
          :stripe="true"
          border
          @select="select"
          @select-all="selectAll"
          @selection-change="selectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          ></el-table-column>
          <el-table-column
            v-for="(item, index) in depParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDepList,
  getDocDeptRightByDocCode,
  saveOrUpdateDocDepartRight
} from "@/api/emrRecord/nursingRecord/authorityMaintain";
import { getDocInfo } from "@/api/emrRecord/nursingRecord/docInfoMaintain";

export default {
  name: "depMaintain",
  data() {
    return {
      searchData: {
        docName: "",
        docInputcodePinyin: "",
        docInputcodeFive: ""
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
          fixed: false,
          width: "120"
        },
        {
          prop: "docType",
          label: "文书类型",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "docUser",
          label: "适用类型",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        }
      ],
      docInfoData: [],
      docInfoDataUnit: [],
      currentDocInfo: {},
      /*科室列表*/
      depSearchData: {
        depName: ""
      },
      depParams: [
        {
          prop: "orgNm",
          label: "科室名称",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        }
      ],
      depList: [],
      selection: [],
      delSelection: [], //删除的
      newSelection: [], //新增的
      /*当前文书科室权限列表*/
      authDepList: []
    };
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  created() {
    this.search();
    this.searchDep();
  },
  methods: {
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
    async search() {
      this.pageNo = 1;
      await this.getdocInfoData();
      this.docInfoData = this.docInfoDataUnit;
      this.$nextTick(() => {
        this.$refs.depTable.clearSelection();
      });
      if (this.docInfoData.length) {
        this.currentDocInfo = { ...this.docInfoData[0] };
        this.$refs.docTable.setCurrentRow(this.docInfoData[0]);
        await this.getDocAuth();
      }
    },
    reset() {
      this.pageNo = 1;
      this.searchData = {
        docName: "",
        docInputcodePinyin: "",
        docInputcodeFive: ""
      };
    },
    /*获取科室列表*/
    async getDep() {
      try {
        let data = await getDepList();
        if (data.code == "1") {
          this.depList = [...data.data];
        } else {
          this.$message.error(data.msg || "获取科室数据失败");
        }
      } catch (error) {
        this.$message.error(error.msg || "获取科室数据失败");
      }
    },
    async searchDep() {
      await this.getDep();
    },
    async rowClick(data) {
      this.currentDocInfo = { ...data };
      this.$nextTick(() => {
        this.$refs.depTable.clearSelection();
      });
      this.getDocAuth();
    },
    select(selection, row) {
      let arr = [];
      let delSelection = [...this.delSelection];
      let newSelection = [...this.newSelection];
      for (let i in selection) {
        if (selection[i].id == row.id) {
          arr.push(selection[i]);
        }
      }
      if (arr.length <= 0) {
        //删除数组
        for (let k in newSelection) {
          if (newSelection[k].inpDeptCode == row.id) {
            this.$delete(newSelection, k);
          }
        }
        this.newSelection = [...newSelection];
        for (let i in this.authDepList) {
          if (this.authDepList[i].inpDeptCode == row.id) {
            let arr1 = [];
            for (let j in delSelection) {
              if (delSelection[j].inpDeptCode == row.id) {
                arr1.push(row);
                this.$delete(delSelection, j);
              }
            }
            if (arr1.length <= 0) {
              delSelection.push({
                docCode: this.currentDocInfo.docCode,
                id: this.authDepList[i].id,
                inpDeptCode: this.authDepList[i].inpDeptCode
              });
            }
          }
        }
        this.delSelection = [...delSelection];
      } else {
        //新增数组
        for (let k in delSelection) {
          if (delSelection[k].inpDeptCode == row.id) {
            this.$delete(delSelection, k);
          }
        }
        this.delSelection = [...delSelection];
        let newArr = [];
        for (let i in this.authDepList) {
          if (this.authDepList[i].inpDeptCode == row.id) {
            newArr.push(this.authDepList[i]);
          }
        }
        if (newArr.length <= 0) {
          let arr2 = [];
          for (let j in newSelection) {
            if (newSelection[j].inpDeptCode == row.id) {
              arr2.push(newSelection[j]);
            }
          }
          if (arr2.length <= 0) {
            newSelection.push({
              docCode: this.currentDocInfo.docCode,
              id: "",
              inpDeptCode: row.id,
              inpDeptName: row.orgNm
            });
          }
        }
        this.newSelection = [...newSelection];
      }
      console.log("delSelection", delSelection);
      console.log("newSelection", newSelection);
    },
    selectionChange(selection) {
      // console.log(selection);
    },
    selectAll(selection) {
      if (selection.length <= 0) {
        this.newSelection = [];
        this.delSelection = [];
        let delSelection = [...this.delSelection];
        for (let i in this.authDepList) {
          delSelection.push({
            docCode: this.currentDocInfo.docCode,
            id: this.authDepList[i]["id"],
            inpDeptCode: this.authDepList[i].inpDeptCode
          });
        }
        this.delSelection = [...delSelection];
      } else {
        this.delSelection = [];
        let newSelection = [...selection];
        for (let i in this.authDepList) {
          for (let j in newSelection) {
            if (newSelection[j]["id"] == this.authDepList[i]["inpDeptCode"]) {
              this.$delete(newSelection, j);
            }
          }
        }
        let newSelectionCopy = [];
        for (let k in newSelection) {
          newSelectionCopy.push({
            docCode: this.currentDocInfo.docCode,
            id: "",
            inpDeptCode: newSelection[k].id,
            inpDeptName: newSelection[k].orgNm
          });
        }
        this.newSelection = [...newSelectionCopy];
      }
    },
    /*获取文书的科室权限列表*/
    async getDocAuth() {
      this.$showLoading();
      try {
        let params = {
          docCode: this.currentDocInfo.docCode
        };
        let data = await getDocDeptRightByDocCode(params);
        if (data.code == "1") {
          this.authDepList = [...data.data];
          this.$refs.depTable.clearSelection();
          //已选科室权限与右侧科室列表做匹配并切换选中状态
          for (let i in this.authDepList) {
            for (let j in this.depList) {
              if (this.depList[j]["id"] == this.authDepList[i]["inpDeptCode"]) {
                this.$nextTick(() => {
                  this.$refs.depTable.toggleRowSelection(this.depList[j], true);
                });
              }
            }
          }
        } else {
          this.$message.error(data.msg || "获取文书对应的科室权限失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取文书对应的科室权限失败");
      }
    },
    /*权限新增/删除*/
    async save() {
      this.$showLoading();
      try {
        let params = this.delSelection.concat(this.newSelection);
        let data = await saveOrUpdateDocDepartRight(params);
        if (data.code == "1") {
          this.$message("更新成功");
          this.delSelection = [];
          this.newSelection = [];
          this.$nextTick(() => {
            this.$refs.depTable.clearSelection();
          });
          await this.getDocAuth();
        } else {
          this.$message.error(data.msg || "更新失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "更新失败");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.depMaintain {
  .left-doc {
    width: calc(50% - 10px);
    margin-right: 20px;
    padding: 20px;
    border: 1px solid $l-color-bgcolor-11;

    .nav-bars {
      margin-bottom: 20px;
    }

    .table-cont {
      height: calc(100% - 58px);
    }
  }

  .right-doc {
    width: calc(50% - 10px);
    padding: 20px;
    border: 1px solid $l-color-bgcolor-11;

    .nav-bars {
      margin-bottom: 20px;
    }

    .table-cont {
      height: calc(100% - 58px);
    }
  }
}
</style>
