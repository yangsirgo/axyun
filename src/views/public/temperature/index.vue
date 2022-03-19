<template>
  <div class="width100 height100">
    <el-card class="width100 height100" style="padding:20px">
      <div class="top-wrapper">
        <LFormtTitle label="体温单编码" class="input-item float-left">
          <el-input v-model="searchParmas.styleCode" placeholder="请输入"/>
        </LFormtTitle>
        <LFormtTitle label="体温单名称" class="input-item float-left margin-left-10">
          <el-input v-model="searchParmas.styleName" placeholder="请输入"/>
        </LFormtTitle>
        <el-button type="primary" class="float-left margin-left-10" @click="searchHandler">查询</el-button>
        <el-button type="primary" plain class="float-left margin-left-10" @click="resetSearch">重置</el-button>
        <el-button type="primary" plain class="float-right margin-right-10" @click="deleteHandler">删除</el-button>
        <el-button type="primary" plain class="float-right margin-right-10" :disabled="isDisabled" @click="editForm">
          修改
        </el-button>
        <el-button type="primary" plain class="float-right margin-right-10" @click="newForm">新建</el-button>
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
      <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogType==='new'?'添加体温单样式':'修改体温单样式'"
        width="470px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form :model="formData" ref="rform" :rules="rules" :center="true" class="dialog-wrapper">
          <el-form-item label prop="styleCode">
            <LFormtTitle label="体温单编码" class="width100" disabled>
              <el-input v-model="formData.styleCode" placeholder="自动生成" disabled/>
            </LFormtTitle>
          </el-form-item>
          <el-form-item label prop="styleName" class="width100">
            <LFormtTitle label="体温单名称">
              <el-input v-model="formData.styleName" placeholder="请输入"/>
            </LFormtTitle>
          </el-form-item>
          <!--<el-form-item label prop="careUserType">
            <LFormtTitle label="体温单类型" class="width100">
              <l-value-domain
                code="CareUserType"
                :value.sync="formData.careUserType"
                placeholder="请选择"
              />
            </LFormtTitle>
          </el-form-item>-->
          <LFormtTitle label="适用年龄" class="width100">
            <el-input v-model="formData.ageRange1" placeholder="请输入" style="width:30%"/>
            <span style="width:10%">-</span>
            <el-input v-model="formData.ageRange2" placeholder="请输入" style="width:30%"/>
            <el-select v-model="formData.ageUnit" placeholder="单位" style="width:30%">
              <el-option label="岁" value="岁"></el-option>
              <el-option label="月" value="月"></el-option>
              <el-option label="天" value="天"></el-option>
              <el-option label="小时" value="小时"></el-option>
            </el-select>
          </LFormtTitle>
          <p class="input-desc">描述</p>
          <el-input type="textarea" :rows="4" placeholder="请输入描述" v-model="formData.styleNote"></el-input>
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
    getTypeListData,
    createOrUpdateTypeListData,
    delTypeListData
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
            prop: "styleCode",
            label: "体温单编号",
            width: "100"
          },
          {
            prop: "styleName",
            label: "体温单名称",
            width: "200",
            align: false
          },
          /*{
            prop: "careUserType",
            label: "适用类型",
            width: "100",
            align: false
          },*/
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
        rules: {
          styleName: [
            {required: true, message: "请输入体温单名称", trigger: "blur"}
          ]
        },
        searchParmas: {
          styleName: "",
          styleCode: ""
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
          let response = await getTypeListData(params);
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
        let formData = {
          ...this.selectData[0],
          ageRange1 : this.selectData[0]['ageRange'].split('-')[0],
          ageRange2 : this.selectData[0]['ageRange'].split('-')[1],
        };
        this.$delete(formData,'ageRange');
        // console.log(formData);
        this.formData = {...formData};
        this.dialogVisible = true;
        this.dialogType = "edit";
      },
      newForm() {
        this.formData = {};
        this.dialogVisible = true;
        this.dialogType = "new";
      },
      async confirmHandler() {
        if (this.formData['ageRange1'] > this.formData['ageRange2']) {
          this.$message.info('适用年龄范围最小年龄不能大于最大年龄');
          return false;
        }
        let ageRange = '';
        if (this.formData['ageRange1'] && !this.formData['ageRange2']) {
          this.$message.info('适用年龄范围最大年龄不能为空');
          return false;
        }
        if (!this.formData['ageRange1'] && this.formData['ageRange2']) {
          this.$message.info('适用年龄范围最小年龄不能为空');
          return false;
        }
        if (this.formData['ageRange1'] && this.formData['ageRange2']) {
          ageRange = this.formData['ageRange1'] + '-' + this.formData['ageRange2'];
        }
        try {
          this.$showLoading();
          let params = {
            ...this.formData,
            ageRange: ageRange
          };
          this.$delete(params, 'ageRange1');
          this.$delete(params, 'ageRange2');
          let response = await createOrUpdateTypeListData(params);
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
          let response = await delTypeListData(this.seledSelection);
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
