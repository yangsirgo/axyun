<template>
  <div class="document-operate width100 height100">
    <div class="doc-main height100">
      <div class="nav-bars clearfix">
        <el-row :gutter="24">
          <el-col :span="3">
            <LFormtTitle label="文书名称">
              <el-input
                v-model="searchData.documentName"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              >
              </el-input>
            </LFormtTitle>
          </el-col>

          <el-col :span="9">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" plain @click="reset">重置</el-button>
          </el-col>
          <el-col :span="12">
            <el-button
              type="primary"
              plain
              class="float-right margin-left-10"
              :disabled="selections.length < 1"
              @click="deleteData"
              >删除
            </el-button>
            <el-button
              type="primary"
              plain
              class="float-right margin-left-10"
              :disabled="selections.length != 1"
              @click="stopDocument"
              >停用
            </el-button>
            <el-button
              type="primary"
              plain
              class="float-right margin-left-10"
              :disabled="selections.length != 1"
              @click="openDocument"
              >启用
            </el-button>
            <el-button
              type="primary"
              plain
              class="float-right margin-left-10"
              :disabled="selections.length != 1"
              @click="checkDocument"
              >查看
            </el-button>

            <el-button
              type="primary"
              plain
              class="float-right"
              :disabled="selections.length != 1"
              @click="modifyData"
            >
              编辑
            </el-button>
            <el-button type="primary" plain class="float-right" @click="addData"
              >新建草稿
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table-cont">
        <el-table
          width="100%"
          height="100%"
          :data="tableData"
          style="width: 100%; margin-bottom: 20px"
          row-key="id"
          border
          @current-change="handleCurrentChange"
          highlight-current-row
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            v-for="(item, index) in documentParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :header-align="item.headerAlign || 'left'"
            :fixed="item.fixed"
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'documentModel'">
                <span
                  :val="scope.row['documentModel']"
                  code="CareDocType"
                  v-codeTransformEmr
                ></span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getDocClassVersionInfo,
    saveOrUpdateDocVersionInfo,
    deleteDocVersionInfo
  } from "@/api/emrRecord/nursingRecord/docInfoMaintain";

  export default {
    name: "",
    components: {},
    data() {
      return {
        selections: [],
        searchData: {documentName: ""},
        tableData: [],
        documentParams: [
          {
            prop: "documentType",
            label: "分类名称",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "documentName",
            label: "文书名称",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "versionNumber",
            label: "版本号",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "documentStatus",
            label: "文书状态",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "limitNums",
            label: "限制数量",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "documentModel",
            label: "文书类型",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "operator",
            label: "操作人",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "operateTime",
            label: "操作时间",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          }
        ]
      };
    },
    mounted() {
      this.search();
    },
    methods: {
      reset() {
        this.searchData.documentName = "";
      },
      async search() {
        await this.queryData();
      },
      checkChoosedItem() {
        if (!this.selections.length) {
          return;
        }
      },
      // 获取列表数据
      async queryData() {
        try {
          let resData = await getDocClassVersionInfo({});
          if (resData.code === 1) {
            console.log(resData.data, "resData.data");
            this.tableData = resData.data.map(item => {
              return {
                id: item.classCode,
                documentType: item.className || "",
                documentName: "",
                level: 0,
                children: this.parseClassList(item.lstDocInfo, item.className)
              };
            });
            console.log('this.tableData ', this.tableData);
          }
        } catch (error) {
          this.$message.error(error.msg || "获取文书列表数据报错");
        }
      },
      parseClassList(list, documentType) {
        let mapList = [];
        if (list) {
          mapList = list.map(item => {
            return {
              id: item.docCode,
              documentType: documentType,
              documentName: item.docName || "",
              level: 1,
              children: this.parseDocList(item, item.lstDocVersion, item.docCode)
              // children: this.parseDocList(item.docName, item.lstDocVersion)
            };
          });
        }

        return mapList;
      },
      parseDocList(docInfo, list, docCode) {
        let mapList = [];
        let statusObj = {
          0: "草稿",
          1: "启用",
          2: "历史"
        };
        if (list) {
          mapList = list.map(item => {
            return {
              id: item.versionId,
              documentType: "",
              documentName: docInfo.docName || "",
              documentStatus: statusObj[item.state] || "",
              documentStatusInit: item.state,
              documentModel: docInfo.docType || '',
              limitNums: "",
              versionNumber: item.docVersion,
              operateTime: item.updatedAt,
              operator: item.updatedByName,
              dataVersion: item.dataVersion,
              level: 2,
              docCode: docCode
            };
          });
        }
        return mapList;
      },
      // 新建草稿
      async addData() {
        await this.checkChoosedItem();
        if (this.selections[0].level == 1) {
          let isNew = '1';
          for (let i in this.selections[0].children) {
            let item = this.selections[0].children[i];
            if (item.documentStatusInit == 0) {
              this.$message.error('本条文书下已有草稿，请选中编辑');
              isNew = '0';
              return false;
            }
          }
          if (isNew == '1') {
            this.$showLoading();
            try {
              let params = {
                docCode: this.selections[0].id,
                state: 0
              };
              let res = await saveOrUpdateDocVersionInfo(params);
              if (res.code == "1") {
                this.$message('新增草稿成功');
                this.queryData();
              } else {
                this.$message.error(res.msg || '新增草稿失败');
              }
              this.$hideLoading();
            } catch (e) {
              this.$hideLoading();
              this.$message.error(e.msg || '新增草稿失败');
            }
          }
        } else {
          this.$message.error('请选择一个文书再进行新建草稿');
        }
      },
      // 编辑文书
      modifyData() {
        this.checkChoosedItem();
        if (this.selections[0].level == '2') {
          sessionStorage['docInfoHis'] = JSON.stringify(this.selections[0]);
          this.$router.push('/nursingRecord/maintenanceDocument');
        }
      },
      // 查看文书
      checkDocument() {
        this.checkChoosedItem();
      },
      // 启用文书
      async openDocument() {
        this.checkChoosedItem();
        if (this.selections[0].level == 2) {
          this.$showLoading();
          try {
            let params = {
              id: this.selections[0].id,
              state: 1,
              dataVersion: this.selections[0].dataVersion
            };
            let res = await saveOrUpdateDocVersionInfo(params);
            if (res.code == "1") {
              this.$message('启用成功');
              this.queryData();
            } else {
              this.$message.error(res.msg || '启用失败');
            }
            this.$hideLoading();
          } catch (e) {
            this.$hideLoading();
            this.$message.error(e.msg || '启用失败');
          }
        } else {
          this.$message.error('请选择一个版本再进行启用');
        }
      },
      // 停用文书
      async stopDocument() {
        this.checkChoosedItem();
        if (this.selections[0].level == 2) {
          this.$showLoading();
          try {
            let params = {
              id: this.selections[0].id,
              state: 2,
              dataVersion: this.selections[0].dataVersion
            };
            let res = await saveOrUpdateDocVersionInfo(params);
            if (res.code == "1") {
              this.$message('停用成功');
              this.queryData();
            } else {
              this.$message.error(res.msg || '停用失败');
            }
            this.$hideLoading();
          } catch (e) {
            this.$hideLoading();
            this.$message.error(e.msg || '停用失败');
          }
        } else {
          this.$message.error('请选择一个版本再进行停用');
        }
      },
      // 删除文书
      async deleteData() {
        this.checkChoosedItem();
        if (this.selections[0].level == 2) {
          if (this.selections[0].documentStatusInit == 1) {
            this.$message.error('本条版本已启用，不可删除');
            return false;
          } else if (this.selections[0].documentStatusInit == 2) {
            this.$message.error('本条版本已停用，不可删除');
            return false;
          } else {
            this.$confirm('是否删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              this.$showLoading();
              try {
                let params = {
                  id: this.selections[0].id,
                  state: this.selections[0].documentStatusInit,
                  dataVersion: this.selections[0].dataVersion
                };
                let res = await deleteDocVersionInfo(params);
                if (res.code == "1") {
                  this.$message('删除成功');
                  this.queryData();
                } else {
                  this.$message.error(res.msg || '删除失败');
                }
                this.$hideLoading();
              } catch (e) {
                this.$hideLoading();
                this.$message.error(e.msg || '删除失败');
              }
            });
          }
        } else {
          this.$message.error('请选择一个版本再进行删除');
        }
      },
      // 表格单选
      handleCurrentChange(val) {
        console.log(val);
        this.selections.length = 0;
        this.selections.push(val);
      },
      // 更新草稿和版本状态
      /*async updateDocInfo() {
        let params = {};
        try {
          let resData = await saveOrUpdateDocVersionInfo(params, true);
        } catch (error) {
          console.log(error);
        }
      }*/
    }
  };
</script>

<style lang='scss'>
.document-operate {
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  .table-cont {
    margin-top: 20px;
    height: calc(100% - 58px);
  }

  .el-table__row.el-table__row--level-0 {
    background-color: #f6f6f6;
  }

  .el-table__row.el-table__row--level-1 {
    background-color: #fbfbfb;
  }
}
</style>
