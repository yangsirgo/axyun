<template>
  <div class="width100 height100">
    <el-card class="width100 height100 clearfix">
      <div class="left-cont height100 float-left">
        <el-row :gutter="20" class="top-wrapper">
          <el-col :span="6">
            <LFormtTitle label="项目名称" class="input-item">
              <el-input v-model="searchParmas.itemName" placeholder="请输入"/>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <LFormtTitle label="项目类型" class="input-item">
              <l-value-domain code="VitalItemType" :value.sync="searchParmas.itemType" placeholder="请选择" clearable/>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <LFormtTitle label="控件类型" class="input-item">
              <l-value-domain code="VitalControlType" :value.sync="searchParmas.controlType" placeholder="请选择"
                              clearable/>
            </LFormtTitle>
          </el-col>
          <el-col :span="3">
            <el-button class="float-right" type="primary" @click="searchHandler">查询</el-button>
          </el-col>
          <el-col :span="3">
            <el-button class="float-right" type="primary" plain @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>
        <div class="content" v-loading="loading">
          <el-collapse v-model="activeNames">
            <l-collapse-item v-for="(item, $index) in collapseData" :name="$index" :key="$index">
              <div slot="title" style="font-size: 14px;">
                <span class="margin-left-20">{{item.title}}</span>
              </div>
              <div slot="content">
                <div class="table-wrapper" style="margin-top: 5px;">
                  <el-table
                    ref="itemTable"
                    :data="item.data"
                    border
                    width="100%"
                    max-height="300px"
                    highlight-current-row
                    @row-click="rowClick"
                  >
                    <el-table-column
                      v-for="(item,index) in tableParams"
                      :key="index"
                      :prop="item.prop"
                      :label="item.label"
                      :min-width="item.width"
                      :align="item.align || 'center'"
                      header-align="center"
                      :fixed="item.fixed"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <template v-if="item.prop == 'itemUnit'">
                          <span :val="scope.row[item.prop] || ''" code="VitalItemUnit" v-codeTransform></span>
                        </template>
                        <template v-else-if="item.prop == 'controlType'">
                          <span :val="scope.row[item.prop] || ''" code="VitalControlType" v-codeTransform></span>
                        </template>
                        <template v-else-if="item.prop == 'dataType'">
                          <span :val="scope.row[item.prop] || ''" code="CareDataType" v-codeTransform></span>
                        </template>
                        <template v-else-if="item.prop == 'itemType'">
                          <span :val="scope.row[item.prop] || ''" code="VitalItemType" v-codeTransform></span>
                        </template>
                        <template v-else>{{scope.row[item.prop]}}</template>
                      </template>

                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </l-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="right-cont height100 float-right">
        <el-row class="top-wrapper" :gutter="20">
          <el-col :span="9">
            <LFormtTitle label="选项名称">
              <el-input v-model="searchParmas0.optionName" placeholder="请输入"/>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" class="float-left margin-left-10" @click="leftSearchHandler">查询</el-button>
          </el-col>
          <el-button type="primary" class="float-right margin-right-10" @click="save">保存</el-button>
        </el-row>
        <div class="content">
          <el-table
            :data="tableDataOption"
            border
            width="100%"
            height="100%"
            ref="singleTable"
            v-loadmore="loadNextPage"
            v-loading="tlm_isLoading"
            @select="checkSelection"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column
              v-for="(item,index) in leftTableParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'center'"
              header-align="center"
              :fixed="item.fixed"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <template v-if="item.prop == 'optionColor'">
                  <span :val="scope.row[item.prop] || ''" code="VitalColorOpt" v-codeTransform></span>
                </template>
                <template v-else>{{scope.row[item.prop]}}</template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {
    getOptionListData,
    getItemListData,
    createOrUpdateItemListData,
    delItemListData,
    getItemOptionByItemCodeList,
    addOrUpdate
  } from "@/api/public/temperature";

  export default {
    data() {
      return {
        /*体温单样式*/
        searchParmas0: {
          optionName: ''
        },
        leftTableParams: [
          {
            prop: "optionSort",
            label: "显示序号",
            width: "100"
          },
          {
            prop: "optionCode",
            label: "选项编号",
            width: "200"
          },
          {
            prop: "optionName",
            label: "选项名称",
            width: "200",
            align: "left"
          },
          {
            prop: "optionColor",
            label: "颜色",
            width: "100",
            align: "left"
          }
        ],
        tlm_isLoading: false,
        pageParams: {
          pageNo: 1, // 当前页数
          total: 5, // 总共页数
          pageSize: 20 // 每页数据条数
        },
        tableDataOption: [],
        currentRow: {},
        /*体温单项目*/
        tableData: [],
        // 手风琴当前展开哪个
        activeNames: [0, 1, 2],
        activeName: "",
        collapseData: [
          {
            title: "体征项目",
            data: []
          },
          {
            title: "特殊项目",
            data: []
          },
          {
            title: "自定义项目",
            data: []
          }
        ],
        tableParams: [
          {
            prop: "itemType",
            label: "项目类型",
            width: "100"
          },
          {
            prop: "itemName",
            label: "项目名称",
            width: "200",
            align: "left"
          },
          {
            prop: "itemCode",
            label: "项目编码",
            width: "200",
            align: "left"
          },
          {
            prop: "itemUnit",
            label: "项目单位",
            width: "200",
            align: "left"
          },
          {
            prop: "controlType",
            label: "控件类型",
            width: "200",
            align: "left"
          },
          {
            prop: "dataType",
            label: "数据类型",
            width: "400",
            align: "left"
          }
        ],
        loading: false,
        searchParmas: {
          itemName: "",
          itemType: "",
          controlType: ""
        },
        /*当前关系数据*/
        relations: [],
        // 选中行
        select: {},
        seledSelection: [],
        selections: []
      };
    },
    computed: {
      tlm_noMore() {
        return (
          Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
          this.pageParams.pageNo
        );
      }
    },
    async mounted() {
      await this.leftSearchHandler();
      await this.searchHandler();
      //await this.getRelation();
    },
    methods: {
      /*左侧体温单样式查询*/
      async loadTableOption() {
        try {
          this.tlm_isLoading = true;
          let params = {
            ...this.searchParmas0,
            ...this.pageParams
          };
          let response = await getOptionListData(params);
          this.tableDataOption = response.data;
          this.pageParams = {...response.pageParams};
          if (this.currentRow != null && this.currentRow.itemCode) {
            this.getRelation(this.currentRow.itemCode);
          }
          this.tlm_isLoading = false;
        } catch (error) {
          this.tlm_isLoading = false;
          this.$message.error(error.msg);
        }
      },
      loadNextPage() {
        if (this.tlm_noMore) {
          return;
        }
        this.pageParams.pageNo++;
        this.loadTableOption();
      },
      async leftSearchHandler() {
        this.pageParams.pageNo = 1;
        await this.loadTableOption();
      },
      rowClick(row) {
        for (let v in this.$refs.itemTable) {
          //取消不在同一个table里的数据行高亮
          this.$refs.itemTable[v].setCurrentRow(row);
        }
        this.currentRow = {...row};
        this.getRelation(this.currentRow.itemCode);
      },
      /*体温单项目*/
      async searchHandler() {
        await this.loadTable();
      },
      resetSearch() {
        for (const key in this.searchParmas) {
          this.searchParmas[key] = "";
        }
        this.searchHandler();
      },
      // 加载table数据
      async loadTable() {
        try {
          this.loading = true;
          let params = {
            ...this.searchParmas
          };
          let response = await getItemListData(params);
          this.tableData = response.data;
          this.pipToCollapseData();
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.msg);
        }
      },
      pipToCollapseData() {
        let signList = [];
        let otherList = [];
        let customList = [];
        this.tableData.forEach(item => {
          // 根据项目类型分类push
          if (item.itemType == "0") {
            signList.push(item);
          } else if (item.itemType == "1") {
            otherList.push(item);
          } else {
            customList.push(item);
          }
        });
        this.collapseData[0].data = signList;
        this.collapseData[1].data = otherList;
        this.collapseData[2].data = customList;
      },
      //选项改变
      checkSelection(data, row) {
        this.seledSelection = [...data];
        // console.log(this.seledSelection);
      },
      checkSelectionAll(data) {
        this.seledSelection = [...this.selections];
        // console.log(this.seledSelection);
      },
      handleSelectionChange(data) {
        this.selections = data;
      },
      /*查询*/
      async getRelation(itemCode) {
        //this.seledSelection = [];
        this.relations = [];
        this.$showLoading();
        try {
          let response = await getItemOptionByItemCodeList(itemCode);
          if (response.code == '1') {
            //渲染右侧列表
            this.relations = [...response.data];
            this.showTable();
          } else {
            this.$message.error(response.msg);
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg);
        }
      },
      /*渲染界面*/
      showTable() {
        this.$refs.singleTable.clearSelection();
        //已选科室权限与右侧科室列表做匹配并切换选中状态
        for (let i in this.relations) {
          for (let j in this.tableDataOption) {
            if (this.tableDataOption[j]['optionCode'] == this.relations[i]['optionCode']) {
              this.$nextTick(() => {
                this.$refs.singleTable.toggleRowSelection(this.tableDataOption[j], true);
              })
            }
          }
        }
      },
      /*更新关系*/
      async save() {
        let selectionSave = {}
        selectionSave.itemCode = this.currentRow.itemCode;
        selectionSave.vitalOptionVOs = this.selections;
        this.$showLoading();
        try {
          let response = await addOrUpdate(selectionSave);
          if (response.code == '1') {
            //刷新
            await this.getRelation(this.currentRow.itemCode);
          } else {
            this.$message.error(response.msg);
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg);
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .left-cont {
    width: 50%;
    padding: 20px;
    border-right: 1px solid $l-color-bgcolor-11;

    .top-wrapper {
      height: 52px;
      width: 100%;
    }

    .content {
      height: calc(100% - 52px);
      width: 100%;
      overflow: auto;
    }

    /*.input-item {
      width: 280px;
    }*/

    .dialog-wrapper {
      padding: 40px 90px;
    }

    .input-desc {
      margin: 5px 0;
    }
  }

  .right-cont {
    width: 50%;
    padding: 20px;
    margin: 0;

    .top-wrapper {
      height: 52px;
      width: 100%;
    }

    .content {
      height: calc(100% - 52px);
      width: 100%;
    }

    .input-item {
      width: 220px;
    }

    .dialog-wrapper {
      padding: 40px 90px;
    }

    .input-desc {
      margin: 5px 0;
    }
  }
</style>
