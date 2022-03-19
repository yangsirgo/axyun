<template>
  <div class="width100 height100">
    <el-card class="width100 height100 option">
      <div class="top-wrapper">
        <LFormtTitle label="选项名称" class="input-item float-left margin-left-10">
          <el-input v-model="searchParmas.optionName" placeholder="请输入"/>
        </LFormtTitle>
        <el-button type="primary" class="float-left margin-left-10" @click="searchHandler">查询</el-button>
        <el-button class="float-left margin-left-10" @click="resetSearch">重置</el-button>
        <el-button class="float-right margin-right-10" @click="deleteHandler">删除</el-button>
        <el-button class="float-right margin-right-10" :disabled="isDisabled" @click="editForm">修改</el-button>
        <el-button class="float-right margin-right-10" @click="newForm">新建</el-button>
      </div>
      <div class="content">
        <el-table
          :data="tableData"
          border
          width="100%"
          height="100%"
          ref="singleTable"
          v-loadmore="loadNextPage"
          v-loading="tlm_isLoading"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
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
              <template v-if="item.prop == 'optionColor'">
                <span :val="scope.row[item.prop] || ''" code="VitalColorOpt" v-codeTransform></span>
              </template>
              <template v-else>{{scope.row[item.prop]}}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogType==='new'?'添加体温单选项':'修改体温单选项'"
        width="470px"
      >
        <el-form :model="formData" ref="rform" :rules="rules" :center="true" class="dialog-wrapper">
          <el-form-item label prop="optionCode">
            <LFormtTitle label="选项编码" class="width100" disabled>
              <el-input v-model="formData.optionCode" placeholder="自动生成" disabled/>
            </LFormtTitle>
          </el-form-item>
          <el-form-item label prop="optionName" class="width100">
            <LFormtTitle label="选项名称">
              <el-input v-model="formData.optionName" placeholder="请输入"/>
            </LFormtTitle>
          </el-form-item>
          <el-form-item label prop="optionColor">
            <LFormtTitle label="显示颜色" class="width100">
              <l-value-domain
                code="VitalColorOpt"
                :value.sync="formData.optionColor"
                placeholder="请选择"
              />
            </LFormtTitle>
          </el-form-item>
          <el-row class="margin-bottom-20">
            <LFormtTitle label="选项排序">
              <el-form-item prop="stampSort">
                <el-input-number
                  v-model="formData.optionSort"
                  controls-position="right"
                  style="line-height: 34px;width:100%"></el-input-number>
              </el-form-item>
            </LFormtTitle>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="confirmHandler">确 定</el-button>
          <el-button size="mini" @click="closeHander">取 消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
  import {
    getOptionListData,
    createOrUpdateOptionListData,
    delOptionListData
  } from "@/api/public/temperature";

  export default {
    data() {
      return {
        isDisabled: false,
        selectData: [],
        tableData: [],
        pageParams: {
          pageNo: 1, // 当前页数
          total: 5, // 总共页数
          pageSize: 20 // 每页数据条数
        },
        tlm_isLoading: false,
        tableParams: [
          {
            prop: "optionCode",
            label: "选项编号",
            width: "100"
          },
          {
            prop: "optionSort",
            label: "显示序号",
            width: "200",
            align: false
          },
          {
            prop: "optionName",
            label: "选项名称",
            width: "200",
            align: false
          },
          {
            prop: "optionColor",
            label: "显示颜色",
            width: "200",
            align: false
          }
        ],
        rules: {
          optionName: [
            {required: true, message: "请输入选项名称", trigger: "blur"}
          ]
        },
        searchParmas: {
          optionName: ""
        },
        // 选中行
        seledSelection: [],
        // 当前操作编辑的数据
        formData: {},
        // 当前选中的数据
        curForm: {},
        dialogVisible: false,
        dialogType: "edit"
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
    mounted() {
      this.loadTable();
    },
    methods: {
      searchHandler() {
        this.pageParams.pageNo = 1;
        this.loadTable();
      },
      resetSearch() {
        for (const key in this.searchParmas) {
          this.searchParmas[key] = "";
        }
        this.searchHandler();
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
        try {
          this.tlm_isLoading = true;
          let params = {
            ...this.searchParmas,
            ...this.pageParams
          };
          let response = await getOptionListData(params);
          this.tableData = response.data;
          this.pageParams = {...response.pageParams};
          this.tlm_isLoading = false;
        } catch (error) {
          this.tlm_isLoading = false;
          this.$message.error(error.msg);
        }
      },
      setCurrent(row) {
        this.curForm = {...row};
      },
      //点击行触发，选中或不选中复选框
      handleRowClick(row, column, event) {
        this.$refs.singleTable.toggleRowSelection(row);
      },
      handleSelectionChange(rows) {
        if (rows.length > 1) {
          //修改按钮不可点击
          this.isDisabled = true;
        } else {
          this.isDisabled = false;
        }
        let ids = [];
        rows.forEach(item => {
          ids.push(item.id);
        });
        this.seledSelection = ids;
        this.selectData = rows;
      },
      editForm() {
        if (this.selectData.length <= 0) {
          return this.$message.info("请选择要编辑的行");
        } else if (this.selectData.length > 1) {
          return this.$message.info("请选择一行进行编辑");
        }
        this.formData = {...this.selectData[0]};
        this.dialogVisible = true;
        this.dialogType = "edit";
      },
      newForm() {
        this.formData = {};
        this.dialogVisible = true;
        this.dialogType = "new";
      },
      async confirmHandler() {
        try {
          this.$showLoading();
          let response = await createOrUpdateOptionListData(this.formData);
          this.pageParams.pageNo = 1;
          this.loadTable();
          this.closeHander();
          this.$hideLoading();
        } catch (error) {
          this.closeHander();
          this.$hideLoading();
          this.$message.error(error.msg);
        }
      },
      closeHander() {
        this.dialogVisible = false;
        this.formData = {};
        this.$refs["rform"].resetFields();
      },
      async deleteHandler() {
        if (this.seledSelection.length === 0) {
          return this.$message.info("请勾选想要删除的行");
        }
        try {
          this.$showLoading();
          let response = await delOptionListData(this.seledSelection);
          if (response.code === 1) {
            this.tableData = this.tableData.filter(item => {
              return this.seledSelection.indexOf(item.id) == -1;
            });
            this.seledSelection = [];
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
  .option {
    padding: 20px;
  }

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
</style>
