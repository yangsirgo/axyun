<template>
  <div class="width100 height100">
    <el-card class="width100 height100" style="padding:20px">
      <div class="top-wrapper">
        <LFormtTitle label="项目名称" class="input-item float-left">
          <el-input v-model="searchParmas.itemName" placeholder="请输入"/>
        </LFormtTitle>
        <LFormtTitle label="项目类型" class="input-item float-left margin-left-10">
          <l-value-domain code="VitalItemType" :value.sync="searchParmas.itemType" placeholder="请选择"/>
          <!--<el-input v-model="searchParmas.itemName" placeholder="请输入"/>-->
        </LFormtTitle>
        <LFormtTitle label="控件类型" class="input-item float-left margin-left-10">
          <l-value-domain
            code="VitalControlType"
            :value.sync="searchParmas.controlType"
            placeholder="请选择"
          />
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
        <el-collapse v-model="activeNames">
          <l-collapse-item v-for="(item, $index) in collapseData" :name="$index" :key="$index" sty="1">
            <div slot="title" style="font-size: 14px;">
              <span class="margin-left-20">{{item.title}}</span>
            </div>
            <div slot="content" class="content-wrapper" @click="tableClick($index)">
              <div class="table-wrapper" style="margin-top: 5px;">
                <el-table
                  :data="item.data"
                  border
                  width="100%"
                  height="100%"
                  ref="table"
                  @current-change="setCurrent"
                  @select-all="checkSelectionAll(item.data)"
                  @selection-change="handleSelectionChange"
                  @select="checkSelection"
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
                    <span
                      v-if="item.codeTransform"
                      v-codeTransform
                      :code="item.codeTransformCode"
                      :val="scope.row[item.prop]"
                    ></span>
                      <span v-else-if="item.prop == 'itemFix'">
                        {{scope.row[item.prop] == '1' ? '是':'否'}}
                      </span>
                      <span v-else-if="item.prop == 'dataType'">
                        {{scope.row[item.prop] == '0' ? '是':'否'}}
                      </span>
                      <span v-else>{{scope.row[item.prop]}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </l-collapse-item>
        </el-collapse>
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogType==='new'?'新建项目':'修改项目'"
        width="470px"
      >
        <el-form :model="formData" ref="rform" :rules="rules" :center="true" class="dialog-wrapper">
          <el-form-item label prop="itemCode">
            <LFormtTitle label="项目编码" class="width100" disabled>
              <el-input v-model="formData.itemCode" placeholder="自动生成" disabled/>
            </LFormtTitle>
          </el-form-item>
          <el-form-item label prop="itemName" class="width100">
            <LFormtTitle label="项目名称">
              <el-input v-model="formData.itemName" placeholder="请输入"/>
            </LFormtTitle>
          </el-form-item>
          <el-form-item label prop="itemType">
            <LFormtTitle label="项目类型" class="width100">
              <l-value-domain code="VitalItemType" :value.sync="formData.itemType" placeholder="请选择"/>
            </LFormtTitle>
          </el-form-item>
          <el-form-item label prop="controlType">
            <LFormtTitle label="控件类型" class="width100">
              <l-value-domain
                code="VitalControlType"
                :value.sync="formData.controlType"
                placeholder="请选择"
              />
            </LFormtTitle>
          </el-form-item>
          <el-form-item label prop="dataType">
            <LFormtTitle label="数据类型" class="width100">
              <l-value-domain code="CareDataType" :value.sync="formData.dataType" placeholder="请选择"/>
            </LFormtTitle>
          </el-form-item>
          <el-form-item label prop="itemUnit">
            <LFormtTitle label="项目单位" class="width100">
              <l-value-domain code="VitalItemUnit" :value.sync="formData.itemUnit" placeholder="请选择"/>
            </LFormtTitle>
          </el-form-item>
          <el-form-item label prop="itemFix">
            <el-radio-group v-model="formData.itemFix">
              <el-radio label="1">固定项目</el-radio>
              <el-radio label="0">非固定项目</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label prop="dataType">
            <el-radio-group v-model="formData.dataType">
              <el-radio label="1">补测项目</el-radio>
              <el-radio label="0">非补测项目</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="confirmHandler">确 定</el-button>
          <el-button size="mini" type="primary" plain @click="closeHander">取 消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
  import {
    getItemListData,
    createOrUpdateItemListData,
    delItemListData
  } from "@/api/public/temperature";

  export default {
    data() {
      return {
        collaplseSelected: [{type: 1, data: []}, {type: 2, data: []}, {type: 3, data: []}],
        isDisabled: false,
        tableData: [],
        // 手风琴当前展开哪个
        activeNames: [0, 1, 2],
        collapseData: [
          {
            title: "体征项目",
            data: []
          },
          {
            title: "一般项目",
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
            width: "100",
            codeTransform: true,
            codeTransformCode: "VitalItemType"
          },
          {
            prop: "itemCode",
            label: "项目编码",
            width: "200",
            align: "left"
          },
          {
            prop: "itemName",
            label: "项目名称",
            width: "200",
            align: "left"
          },
          {
            prop: "itemFix",
            label: "固定项目",
            width: "100",
            align: "left"
          }, {
            prop: "dataType",
            label: "补测项目",
            width: "100",
            align: "left"
          },
          {
            prop: "itemUnit",
            label: "项目单位",
            width: "100",
            align: "left",
            codeTransform: true,
            codeTransformCode: "VitalItemUnit"
          },
          {
            prop: "controlType",
            label: "控件类型",
            width: "150",
            align: "left",
            codeTransform: true,
            codeTransformCode: "VitalControlType"
          },
          {
            prop: "dataType",
            label: "数据类型",
            width: "100",
            align: "left",
            codeTransform: true,
            codeTransformCode: "CareDataType"
          }
        ],
        rules: {
          itemName: [
            {required: true, message: "请输入体温单项目名称", trigger: "blur"}
          ],
          itemType: [
            {required: true, message: "请输入选择项目类型", trigger: "blur"}
          ]
        },
        searchParmas: {
          itemName: "",
          itemType: "",
          itemCode: "",
          controlType: ""
        },
        // 选中行id
        seledSelectionIds: [],
        seledSelection: {
          0: [],
          1: [],
          2: []
        },
        selections: [],
        // 当前操作编辑的数据
        formData: {},
        // 当前选中的数据
        curForm: {},
        dialogVisible: false,
        dialogType: "edit",
        //当前点击的表格
        tableIndex: 0
      };
    },
    mounted() {
      this.loadTable();
    },
    methods: {
      tableClick(index) {
        console.log(index);
        this.tableIndex = index;
      },
      searchHandler() {
        this.loadTable();
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
          this.tlm_isLoading = true;
          let params = {
            ...this.searchParmas
          };
          let response = await getItemListData(params);
          this.tableData = response.data;
          this.pipToCollapseData();
        } catch (error) {
          this.$message.error(error.msg);
        }
      },
      pipToCollapseData() {
        let signList = [];
        let otherList = [];
        let customList = [];
        this.tableData.forEach(item => {
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
      setCurrent(row) {
        //this.curForm = {...row};
      },
      //选项改变
      checkSelection(data, row) {
        //this.curForm = {...row};
        this.seledSelection[row.itemType] = [...data];
      },
      checkSelectionAll(data) {
        this.seledSelection[data[0].itemType] = [...this.selections];
        this.changeEditButtonStatus();
        // console.log("checkSelectionAll" + JSON.stringify(this.seledSelection));
      },
      handleSelectionChange(rows) {
        this.selections = rows;
        this.changeEditButtonStatus();

        // console.log("handleSelectionChange" + JSON.stringify(this.seledSelection));
      },
      changeEditButtonStatus() {
        let ids = [];
        // console.log(this.collaplseSelected);
        this.seledSelection[0].forEach(item => {
          ids.push(item.id);
        });
        this.seledSelection[1].forEach(item => {
          ids.push(item.id);
        });
        this.seledSelection[2].forEach(item => {
          ids.push(item.id);
        });
        this.seledSelectionIds = ids;
        if (ids.length > 1) {
          //修改按钮不可点击
          this.isDisabled = true;
        } else {
          this.isDisabled = false;
        }
      },
      // //点击行触发，选中或不选中复选框
      // handleRowClick(row, column, event) {
      //   // this.tableIndex;
      //   console.log(this.$refs.table[this.tableIndex]);
      //   this.$refs.table[this.tableIndex].toggleRowSelection(row);
      // },
      editForm() {
        if (this.seledSelection[0].length > 0) {
          this.curForm = this.seledSelection[0][0];
        } else if (this.seledSelection[1].length > 0) {
          this.curForm = this.seledSelection[1][0];
        } else if (this.seledSelection[2].length > 0) {
          this.curForm = this.seledSelection[2][0];
        }
        // console.log(this.seledSelection);
        // console.log(this.curForm);
        if (!this.curForm.itemName) {
          return this.$message.info("请选择要编辑的行");
        }
        this.formData = {...this.curForm};
        console.log(this.formData);
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
          let response = await createOrUpdateItemListData(this.formData);
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
      //删除某一项
      async deleteHandler() {
        if (this.seledSelectionIds.length === 0) {
          return this.$message.info("请勾选想要删除的行");
        }
        try {
          this.$showLoading();
          let response = await delItemListData(this.seledSelectionIds);
          if (response.code === 1) {
            /*this.tableData = this.tableData.filter(item => {
              return this.seledSelectionIds.indexOf(item.id) == -1;
            });*/
            this.loadTable();
            this.pipToCollapseData();
            this.seledSelectionIds = [];
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
    overflow-y: scroll;
  }

  .content-wrapper {
    height: 300px;
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
</style>
