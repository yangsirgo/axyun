<template>
  <div class="width100 height100">
    <el-card class="width100 height100 clearfix">
      <div class="left-cont height100 float-left">
        <el-row class="top-wrapper" :gutter="20">
          <el-col :span="9">
            <LFormtTitle label="体温单编码">
              <el-input v-model="searchParmas0.styleCode" placeholder="请输入" style="width:100%;"/>
            </LFormtTitle>
          </el-col>
          <el-col :span="9">
            <LFormtTitle label="体温单名称">
              <el-input v-model="searchParmas0.styleName" placeholder="请输入"/>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" class="float-left margin-left-10" @click="leftSearchHandler">查询</el-button>
          </el-col>
        </el-row>
        <div class="content">
          <el-table
            :data="leftTableData"
            border
            width="100%"
            height="100%"
            ref="singleTable"
            highlight-current-row
            v-loadmore="loadNextPage"
            v-loading="tlm_isLoading"
            @row-click="rowClick"
          >
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
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="right-cont height100 float-right">
        <div class="top-wrapper">
          <LFormtTitle label="项目名称" class="input-item float-left">
            <el-input v-model="searchParmas.itemName" placeholder="请输入"/>
          </LFormtTitle>
          <LFormtTitle label="项目类型" class="input-item float-left margin-left-10">
            <l-value-domain code="VitalItemType" :value.sync="searchParmas.itemType" placeholder="请选择" clearable/>
          </LFormtTitle>
          <LFormtTitle label="控件类型" class="input-item float-left margin-left-10">
            <l-value-domain code="VitalControlType" :value.sync="searchParmas.controlType" placeholder="请选择"
                            clearable/>
          </LFormtTitle>
          <el-button type="primary" class="float-left margin-left-10" @click="searchHandler">查询</el-button>
          <el-button class="float-left margin-left-10" @click="resetSearch">重置</el-button>
          <el-button type="primary" class="float-right margin-right-10" @click="save">保存</el-button>
        </div>
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
                    @select="checkSelection"
                    @select-all="checkSelectionAll(item.data)"
                    @selection-change="handleSelectionChange"
                  >
                    <el-table-column type="selection" width="45"></el-table-column>
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
    </el-card>
  </div>
</template>
<script>
  import {
    getTypeListData,
    getItemListData,
    createOrUpdateItemListData,
    delItemListData,
    getVitalStyleItemsList,
    saveOrUpdateStyleItemRelation
  } from "@/api/public/temperature";

  export default {
    data() {
      return {
        /*体温单样式*/
        searchParmas0: {
          styleCode: '',
          styleName: ''
        },
        leftTableParams: [
          {
            prop: "styleCode",
            label: "体温单编号",
            width: "100"
          },
          {
            prop: "styleName",
            label: "体温单名称",
            width: "200",
            align: "left"
          },
          {
            prop: "styleNote",
            label: "描述",
            width: "400",
            align: "left"
          }
        ],
        tlm_isLoading: false,
        pageParams: {
          pageNo: 1, // 当前页数
          total: 5, // 总共页数
          pageSize: 20 // 每页数据条数
        },
        leftTableData: [],
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
          itemCode: "",
          controlType: ""
        },
        /*当前关系数据*/
        relations: [],
        // 选中行
        select: {},
        seledSelection: {
          0: [],
          1: [],
          2: []
        },
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
      await this.getRelation();
    },
    methods: {
      /*左侧体温单样式查询*/
      async loadTableLeft() {
        try {
          this.tlm_isLoading = true;
          let params = {
            ...this.searchParmas0,
            ...this.pageParams
          };
          let response = await getTypeListData(params);
          this.leftTableData = response.data;
          this.pageParams = {...response.pageParams};
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
        this.loadTableLeft();
      },
      async leftSearchHandler() {
        this.pageParams.pageNo = 1;
        await this.loadTableLeft();
        this.currentRow = {...this.leftTableData[0]};
        await this.$refs.singleTable.setCurrentRow(this.leftTableData[0]);
      },
      rowClick(row) {
        this.currentRow = {...row};
        this.getRelation();
      },
      /*右侧体温单*/
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
        this.seledSelection[row.itemType] = [...data];
        // console.log(this.seledSelection);
      },
      checkSelectionAll(data) {
        this.seledSelection[data[0].itemType] = [...this.selections];
        // console.log(this.seledSelection);
      },
      handleSelectionChange(data) {
        this.selections = data;
      },
      /*查询*/
      async getRelation() {
        this.seledSelection = {
          0: [],
          1: [],
          2: []
        };
        this.relations = [];
        this.$showLoading();
        try {
          let params = {styleCode: this.currentRow.styleCode};
          let response = await getVitalStyleItemsList(params);
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
        for (let v in this.$refs.itemTable) {
          this.$refs.itemTable[v].clearSelection();
        }
        for (let i in this.relations) {
          for (let j in this.collapseData) {
            for (let k in this.collapseData[j].data) {
              if (this.collapseData[j].data[k]['itemCode'] == this.relations[i]['itemCode']) {
                this.$nextTick(() => {
                  this.$refs.itemTable[j].toggleRowSelection(this.collapseData[j].data[k], true);
                  //seledSelection为默认接口返回的数据
                  this.seledSelection[this.collapseData[j].data[k].itemType].push(this.collapseData[j].data[k]);
                })
              }
            }
          }
        }
        // console.log(this.seledSelection);
      },
      /*更新关系*/
      async save() {
        // console.log(this.seledSelection);
        let selections = [];
        let selectionSave = [];
        for (let i in this.seledSelection) {
          selections = selections.concat(this.seledSelection[i]);
        }
        for (let j in selections) {
          selectionSave.push({
            id: '',
            itemCode: selections[j].itemCode,
            itemName: selections[j].itemName,
            styleCode: this.currentRow.styleCode
          })
        }

        this.$showLoading();
        try {
          let response = await saveOrUpdateStyleItemRelation(selectionSave);
          if (response.code == '1') {
            //刷新
            await this.getRelation();
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
    width: 40%;
    padding: 20px;
    border-right: 1px solid $l-color-bgcolor-11;

    .top-wrapper {
      height: 52px;
      width: 100%;
    }

    .content {
      height: calc(100% - 52px);
      width: 100%;
    }

    .input-item {
      width: 280px;
    }

    .dialog-wrapper {
      padding: 40px 90px;
    }

    .input-desc {
      margin: 5px 0;
    }
  }

  .right-cont {
    width: 60%;
    padding: 20px;

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
