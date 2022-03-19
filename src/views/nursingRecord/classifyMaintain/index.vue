<template>
  <el-card class="width100 height100 classifyMaintain">
    <div class="nav-bars clearfix">
      <div class="left float-left">
        <el-row :gutter="20">
          <el-col :span="8">
            <LFormtTitle label="分类编码">
              <el-input
                v-model="searchData.classCode"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              >
              </el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="8">
            <LFormtTitle label="元素名称">
              <el-input
                v-model="searchData.className"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              >
              </el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" plain @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="right float-right">
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
        :data="classifyData"
        width="100%"
        height="100%"
        :stripe="true"
        border
        v-loading="tlm_isLoading"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in classifyParams"
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
    <el-dialog
      :title="dialogTitle"
      width="470px"
      :visible.sync="classifyDisable"
      :close-on-click-modal="false"
    >
      <classify-add
        v-if="classifyDisable"
        :form="form"
        @classifyAddConfirm="classifyAddConfirm"
        @classifyAddCancel="classifyAddCancel"
      ></classify-add>
    </el-dialog>
  </el-card>
</template>

<script>
  import classifyAdd from './components/classifyAdd';
  import {getClassifyData, batchDeleteDocClass} from '@/api/emrRecord/nursingRecord/classifyMaintain';

  export default {
    name: "index",
    components: {
      classifyAdd
    },
    data() {
      return {
        tlm_isLoading: false,
        searchData: {
          className: '',
          classCode: ''
        },
        classifyParams: [
          {
            prop: "classCode",
            label: "分类编码",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          }, {
            prop: "className",
            label: "分类名称",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          }, {
            prop: "classSort",
            label: "分类排序",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          }, {
            prop: "classNote",
            label: "描述",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "300"
          }
        ],
        classifyData: [],
        //选择的项目
        selections: [],
        //弹框标题
        dialogTitle: '',
        //弹框显示
        classifyDisable: false,
        //新增or修改form
        form: {}
      }
    },
    created() {
      this.getClassifyData();
    },
    methods: {
      /*获取文书分类数据*/
      async getClassifyData() {
        this.$showLoading();
        try {
          let params = {...this.searchData};
          let data = await getClassifyData(params);
          if (data.code == '1') {
            this.classifyData = [...data.data];
          } else {
            this.$message.error(data.msg || "获取文书分类数据失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取文书分类数据失败");
        }
      },
      /*搜索*/
      search() {
        this.getClassifyData();
      },
      /*重置*/
      reset() {
        this.searchData = {
          className: '',
          classCode: ''
        };
      },
      /*选择框改变*/
      selectionChange(selections) {
        this.selections = [...selections];
      },
      /*增加*/
      addData() {
        this.classifyDisable = true;
        this.dialogTitle = '新建分类';
        this.form = {
          add: '1'
        };
      },
      /*修改*/
      modifyData() {
        if (this.selections && this.selections.length === 1) {
          this.classifyDisable = true;
          this.dialogTitle = '修改分类';
          this.form = {
            ...this.selections[0],
            add: '0'
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
          this.$confirm('确定删除吗？', '文书分类删除', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.$showLoading();
            try {
              let data = await batchDeleteDocClass(selectionsArr);
              if (data.code == '1') {
                this.$message("删除成功");
                this.getClassifyData();
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
      classifyAddConfirm() {
        this.classifyDisable = false;
        this.getClassifyData();
      },
      classifyAddCancel() {
        this.classifyDisable = false;
      }
      /*dialog*/
    }
  }
</script>

<style scoped lang="scss">
.classifyMaintain {
  padding: 20px;

  .table-cont {
    height: calc(100% - 58px);
    margin-top: 20px;
  }
}
</style>
