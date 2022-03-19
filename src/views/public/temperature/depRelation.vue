<template>
  <el-card class="depRelation clearfix height100">
    <div class="left-doc float-left height100">
      <div class="nav-bars">
        <el-row :gutter="20">
          <el-col :span="6">
            <LFormtTitle label="体温单名称">
              <el-input v-model="searchData.styleName"
                        style="line-height: 34px;width:100%"
                        placeholder="请输入">
              </el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <LFormtTitle label="适用类型">
              <l-value-domain code="careUserType" :value.sync="searchData.careUserType" placeholder="请选择" clearable/>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="searchHandler">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table-cont">
        <el-table
          ref="singleTable"
          :data="temperatureList"
          border
          width="100%"
          height="100%"
          highlight-current-row

          @row-click="rowClick"
        >
          <!--<el-table-column type="selection" width="45"></el-table-column>-->
          <el-table-column
            v-for="(item,index) in temperatureParams"
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
              <!--<template v-if="item.prop == 'careUserType'">
                <span :val="scope.row[item.prop] || ''" code="careUserType" v-codeTransform></span>
              </template>-->
              <template v-if="item.prop == 'ageRange'">
                <span>{{scope.row[item.prop]}}{{scope.row['ageUnit']}}</span>
              </template>
              <template v-else>{{scope.row[item.prop]}}</template>
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
              <el-input v-model="searchData.depName"
                        style="line-height: 34px;width:100%"
                        placeholder="请输入">
              </el-input>
            </LFormtTitle>
          </el-col>
          <!--<el-col :span="6">-->
          <!--<LFormtTitle label="输入码">-->
          <!--<el-input v-model="searchData.depCode"-->
          <!--style="line-height: 34px;width:100%"-->
          <!--placeholder="请输入">-->
          <!--</el-input>-->
          <!--</LFormtTitle>-->
          <!--</el-col>-->
          <el-col :span="6">
            <el-button type="primary" @click="searchDep">查询</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="save" class="float-right">保存</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table-cont">
        <el-table
          class="el-table-column--selection"
          ref="depTable"
          :data="depList"
          width="100%"
          height="100%"
          :stripe="true"
          border
          @selection-change="handleDepSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center">
          </el-table-column>
          <el-table-column
            v-for="(item,index) in depParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>

  </el-card>
</template>

<script>
  import {
    getTypeListData,
    addVitalDept,
    getDepList,
    getVitalDepartRightByStyleCode
  } from "@/api/public/temperature";

  export default {
    name: "depRelation",
    data() {
      return {
        /*科室选择项*/
        depSelect: [],
        /*体温单选择项*/
        tempSelect: {},
        /*新增数据*/
        saveData: {},
        /*科室列表*/
        searchData: {
          depName: '',
          depCode: '',
          styleName: '',
          careUserType: ''
        },
        depParams: [
          {
            prop: "orgNm",
            label: "科室名称",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "id",
            label: "科室编码",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          }
        ],
        temperatureParams: [
          {
            prop: "styleCode",
            label: "体温单编号",
            width: "140"
          },
          {
            prop: "styleName",
            label: "体温单名称",
            width: "140",
            align: false
          },
          {
            prop: "ageRange",
            label: "适用年龄",
            width: "100",
            align: false
          },
          {
            prop: "styleNote",
            label: "描述",
            width: "400",
            align: false
          }
        ],
        depList: [],
        temperatureList: []
      }
    },
    created() {
      // this.searchDep();
    },
    mounted() {
      this.searchDep();
      this.loadTemperatureData();
    },
    methods: {
      handleDepSelectionChange(data) {
        // if (data.length > 1) {
        //   this.$refs.depTable.clearSelection()
        //   this.$refs.depTable.toggleRowSelection(data.pop());
        //   this.depSelect = data;
        // }
        this.depSelect = data;
        console.info("handleDepSelectionChange" + JSON.stringify(data));
      },
      selectAll() {

      },
      handleTempSelectionChange(data) {
        this.tempSelect = data;
        console.info("handleTempSelectionChange" + JSON.stringify(data));
      },
      rowClick(row, column, event) {
        this.tempSelect = row;
        this.getVistaDeptRelation(row);
        console.info("rowClick" + JSON.stringify(row));
      },
      /*获取文书的科室权限列表*/
      async getVistaDeptRelation(row) {
        this.$showLoading();
        try {
          if (row.styleCode == null) {
            this.$message.info("体温单编号不能为空！");
          }
          let data = await getVitalDepartRightByStyleCode(row.styleCode);
          if (data.code == '1') {
            let authDepList = [...data.data];
            this.$refs.depTable.clearSelection();
            //已选科室权限与右侧科室列表做匹配并切换选中状态
            for (let i in authDepList) {
              for (let j in this.depList) {
                if (this.depList[j]['id'] == authDepList[i]['inpDeptCode']) {
                  this.$nextTick(() => {
                    this.$refs.depTable.toggleRowSelection(this.depList[j], true);
                  })
                }
              }
            }
          } else {
            this.$message.error(data.msg || "获取体温单对应的科室失败！");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取体温单对应的科室失败！");
        }
      },
      searchHandler() {
        this.loadTemperatureData();
      },
      resetSearch() {
        for (const key in this.searchData) {
          this.searchData[key] = "";
        }
        this.searchHandler();
      },
      /*获取科室列表*/
      async getDep() {
        try {
          this.$showLoading();
          let data = await getDepList();
          if (data.code == '1') {
            this.depList = [...data.data];
          } else {
            this.$message.error(data.msg || "获取科室数据失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取科室数据失败");
        }
      },
      async searchDep() {
        await this.getDep();
      },
      //新增科室体温单关系
      async save() {
        // if(this.depSelect.length<=0){
        //   this.$message.info("请选择科室数据！");
        //   return;
        // }
        if (this.tempSelect.length <= 0) {
          this.$message.info("请选择体温单数据！");
          return;
        }
        this.$showLoading();
        this.saveData.styleName = this.tempSelect.styleName;
        this.saveData.styleCode = this.tempSelect.styleCode;
        this.saveData.vitalDeptVOs = this.depSelect;
        try {
          let result = await addVitalDept(this.saveData);
          if (result.code == 1) {
            this.$message.info("更新成功");
          } else {
            this.$message.error("更新失败！" + result.msg);
          }
          this.$hideLoading();
        } catch (e) {
          this.$hideLoading();
          this.$message.error("更新失败！" + e.msg);
        }

      },
      // 加载table数据
      async loadTemperatureData() {
        this.$showLoading();
        try {
          let params = {
            styleName: this.searchData.styleName,
            careUserType: this.searchData.careUserType
          };
          let response = await getTypeListData(params);
          if (response.code == 1) {
            this.temperatureList = response.data;
          } else {
            this.$message.error("获取体温单数据失败！" + response.msg);
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error("获取体温单数据失败！" + error.msg);
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .depRelation {
    .left-doc {
      width: 50%;
      padding: 20px;
      border-right: 1px solid $l-color-bgcolor-11;

      .nav-bars {
        margin-bottom: 20px;
      }

      .table-cont {
        height: calc(100% - 58px);
      }
    }

    .right-doc {
      width: 50%;
      padding: 20px;

      .nav-bars {
        margin-bottom: 20px;
      }

      .table-cont {
        height: calc(100% - 58px);
      }

      /*.el-table-column--selection {*/
      /*.cell {*/
      /*display: none;*/
      /*}*/
      /*}*/
    }
  }
</style>
