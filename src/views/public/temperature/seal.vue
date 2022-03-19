<template>
  <el-card class="width100 height100 seal">
    <div class="nav-bars clearfix">
      <div class="left-cont float-left">
        <el-row :gutter="20">
          <!--<el-col :span="8">
            <LFormtTitle label="图章名称">
              <el-input v-model="searchData.stampName"
                        style="line-height: 34px;width:100%"
                        placeholder="请输入">
              </el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="8">
            <LFormtTitle label="图章隶属">
              <el-input v-model="searchData.stampSunjection"
                        style="line-height: 34px;width:100%"
                        placeholder="请输入">
              </el-input>
            </LFormtTitle>
          </el-col>-->
          <el-col :span="8">
            <el-button type="primary" @click="search">查询</el-button>
            <!--<el-button type="primary" plain @click="reset">重置</el-button>-->
          </el-col>
        </el-row>
      </div>
      <div class="right-cont float-right">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-button type="primary" plain @click="addData">新建</el-button>
            <el-button type="primary" plain @click="modifyData"
                       :disabled="selections.length != 1">修改
            </el-button>
            <el-button type="primary" plain @click="deleteData"
                       :disabled="selections.length < 1">删除
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="table-cont">
      <el-table
        :data="stampData"
        width="100%"
        height="100%"
        :stripe="true"
        border
        v-loading="tlm_isLoading"
        @selection-change="selectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <!--<el-table-column
          type="index"
          width="55"
          align="center">
        </el-table-column>-->
        <el-table-column
          v-for="(item,index) in stampParams"
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
    <el-dialog :title="dialogTitle"
               width="470px"
               :visible.sync="dialogDisable"
               :close-on-click-modal="false"
    >
      <div class="stampAdd">
        <div class="cont">
          <el-form :model="stampAddForm"
                   :rules="rules"
                   ref="stampAddForm"
          >
            <el-row class="margin-bottom-20">
              <LFormtTitle label="图章编码" disabled>
                <el-form-item prop="stampCode">
                  <el-input v-model="stampAddForm.stampCode"
                            style="line-height: 34px;width:100%"
                            placeholder="自动生成"
                            disabled>
                  </el-input>
                </el-form-item>
              </LFormtTitle>
            </el-row>
            <el-row class="margin-bottom-20">
              <LFormtTitle label="图章名称" required>
                <el-form-item prop="stampName">
                  <el-input v-model="stampAddForm.stampName"
                            style="line-height: 34px;width:100%"
                            placeholder="请输入">
                  </el-input>
                </el-form-item>
              </LFormtTitle>
            </el-row>
            <el-row class="margin-bottom-20">
              <LFormtTitle label="图章隶属">
                <el-form-item prop="stampSunjection">
                  <l-value-domain
                    code="CareDocType"
                    :value.sync="stampAddForm.stampSunjection"
                    placeholder="请选择"
                  ></l-value-domain>
                </el-form-item>
              </LFormtTitle>
            </el-row>
            <el-row class="margin-bottom-20">
              <LFormtTitle label="图章位置">
                <el-form-item prop="stampPosition">
                  <l-value-domain
                    code="CareDocType"
                    :value.sync="stampAddForm.stampPosition"
                    placeholder="请选择"
                  ></l-value-domain>
                </el-form-item>
              </LFormtTitle>
            </el-row>
            <el-row class="margin-bottom-20">
              <LFormtTitle label="时间显示">
                <el-form-item prop="timeStyle">
                  <l-value-domain
                    code="CareUserType"
                    :value.sync="stampAddForm.timeStyle"
                    placeholder="请选择"
                  ></l-value-domain>
                </el-form-item>
              </LFormtTitle>
            </el-row>
            <el-row class="margin-bottom-20">
              <LFormtTitle label="文字颜色">
                <el-form-item prop="stampColor">
                  <l-value-domain
                    code="CareUserType"
                    :value.sync="stampAddForm.stampColor"
                    placeholder="请选择"
                  ></l-value-domain>
                </el-form-item>
              </LFormtTitle>
            </el-row>
            <el-row class="margin-bottom-20">
              <LFormtTitle label="排序">
                <el-form-item prop="stampSort">
                  <el-input-number
                    v-model="stampAddForm.stampSort"
                    controls-position="right"
                    style="line-height: 34px;width:100%"></el-input-number>
                </el-form-item>
              </LFormtTitle>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer clearfix">
          <div class="float-right">
            <el-button type="primary" @click="confirm">确认</el-button>
            <el-button type="primary" plain @click="cancel">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import {getVitalStampList, saveOrUpdateVitalStamp, batchDeleteVitalStyle} from "@/api/public/temperature.js";

  export default {
    name: "seal",
    data() {
      return {
        searchData: {},
        /*分页信息*/
        /*pageSize: 20,
        pageNo: 1,
        total: 0,*/
        tlm_isLoading: false,
        stampParams: [
          {
            prop: "stampCode",
            label: "图章编码",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "120"
          }, {
            prop: "stampName",
            label: "图章名称",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "stampSunjection",
            label: "图章隶属",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "stampPosition",
            label: "图章位置",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "timeStyle",
            label: "时间显示",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "stampColor",
            label: "文字颜色",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "80"
          }, {
            prop: "stampSort",
            label: "排序",
            align: "left",
            headerAlign: "left",
            fixed: false,
            width: "60"
          }
        ],
        stampData: [],
        stampDataUnit: [],
        //选中的项目
        selections: [],
        //弹框标题
        dialogTitle: '',
        //弹框显示
        dialogDisable: false,
        //新增or修改form
        stampAddForm: {},
        rules: {
          stampName: [{required: true, message: '请输入图章名称', trigger: 'blur'}]
        }
      }
    },
    /*computed: {
      totalPage() {
        return Math.ceil(this.total / this.pageSize);
      }
    },*/
    async created() {
      await this.search();
    },
    methods: {
      async search() {
        await this.getStampData();
        // this.stampData = this.stampDataUnit;
      },
      reset() {
        this.searchData = {};
      },
      //获取图章列表
      async getStampData() {
        this.$showLoading();
        try {
          let params = {
            ...this.searchData
          };
          let data = await getVitalStampList(params);
          if (data.code == "1") {
            // this.stampDataUnit = [...data.data];
            this.stampData = [...data.data];
          } else {
            this.$message.error(data.msg || "获取图章数据失败");
          }
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "获取图章数据失败");
        }
      },
      /*load() {},*/
      selectionChange(selection) {
        this.selections = [...selection];
      },
      addData() {
        this.dialogDisable = true;
        this.dialogTitle = "新建图章";
        this.stampAddForm = {};
      },
      modifyData() {
        if (this.selections && this.selections.length === 1) {
          this.dialogDisable = true;
          this.dialogTitle = "修改图章";
          this.stampAddForm = {...this.selections[0]};
        }
      },
      deleteData() {
        let selectionsArr = [];
        for (let i in this.selections) {
          selectionsArr.push(this.selections[i].id);
        }
        if (selectionsArr.length > 0) {
          this.$confirm("确定删除吗？", "图章删除", {
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            this.$showLoading();
            try {
              let data = await batchDeleteVitalStyle(selectionsArr);
              if (data.code == "1") {
                this.$message("删除成功");
                /*this.pageNo = 1;
                this.pageSize = 20;*/
                await this.search();
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
      //form
      confirm() {
        this.$refs['stampAddForm'].validate(async (valid) => {
          if (valid) {
            this.$showLoading();
            try {
              let form = {
                ...this.stampAddForm
              };
              let data = await saveOrUpdateVitalStamp(form);
              if (data.code == '1') {
                this.dialogDisable = false;
                this.$refs['stampAddForm'].resetFields();
                await this.search();
              } else {
                this.$message.error(data.msg || "保存失败");
              }
              this.$hideLoading();
            } catch (error) {
              this.$hideLoading();
              this.$message.error(error.msg || "保存失败");
            }
          }
        });
      },
      cancel() {
        this.dialogDisable = false;
        this.$refs['stampAddForm'].resetFields();
      },
    }
  }
</script>

<style scoped lang="scss">
  .seal {
    padding: 20px;

    .table-cont {
      height: calc(100% - 58px);
      margin-top: 20px;
    }
  }

  .stampAdd {
    .margin-bottom-20 {
      margin-bottom: 20px;
    }

    .cont {
      padding: 20px 34px 40px 34px;
    }

    .dialog-footer {
      padding: 20px;
      border-top: 1px solid $l-color-bgcolor-11;
    }
  }
</style>
