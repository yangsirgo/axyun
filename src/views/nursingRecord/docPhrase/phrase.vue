<template>
  <el-card class="width100 height100 phraseStyle">
    <div class="nav-bars clearfix">
      <div class="left float-left">
        <el-row :gutter="20">
          <el-col :span="6">
            <LFormtTitle label="短语分类">
              <l-value-domain-emr
                code="LevelType"
                :value.sync="searchData.phraseType"
                placeholder="请选择"
              ></l-value-domain-emr>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <LFormtTitle label="所属科室">
              <!--multiple 复选属性 放在下面-->
              <l-value-domain
                clearable
                :value.sync="searchData.inpDeptCode"
                remoteUrl="/wadmin/hos/dept"
                remoteShowKey="orgNm"
                remoteValueKey="id"
                placeholder="请选择所属科室"
              ></l-value-domain>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <LFormtTitle label="短语名称">
              <el-input
                v-model="searchData.phraseName"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
              >
              </el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
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
        :data="phraseData"
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
          <template slot-scope="scope">
            <template v-if="item.prop == 'phraseType'">
              <span
                :val="scope.row[item.prop] || ''"
                code="LevelType"
                v-codeTransformEmr
              ></span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="470px">
      <el-form
        :model="formData"
        ref="rform"
        :rules="rules"
        :center="true"
        class="dialog-wrapper"
      >
        <el-form-item label prop="phraseType">
          <LFormtTitle label="所属级别" class="width100">
            <l-value-domain-emr
              code="LevelType"
              :value.sync="formData.phraseType"
              placeholder="请选择"
            ></l-value-domain-emr>
          </LFormtTitle>
        </el-form-item>
        <el-form-item label prop="inpDeptCode" class="width100">
          <LFormtTitle label="所属科室">
            <l-value-domain
              clearable
              :value.sync="formData.inpDeptCode"
              remoteUrl="/wadmin/hos/dept"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择所属科室"
              @change="changeDept"
            ></l-value-domain>
          </LFormtTitle>
        </el-form-item>
        <el-form-item label prop="docCode">
          <LFormtTitle label="所属文书" class="width100">
            <el-select v-model="formData.docCode" placeholder="请选择">
              <el-option
                v-for="item in docOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </LFormtTitle>
        </el-form-item>
        <el-form-item label prop="phraseName" class="width100">
          <LFormtTitle label="短语名称">
            <el-input v-model="formData.phraseName" placeholder="请输入" />
          </LFormtTitle>
        </el-form-item>
        <el-row class="margin-bottom-20">
          <LFormtTitle label="选项排序">
            <el-form-item prop="sort">
              <el-input-number
                v-model="formData.sort"
                controls-position="right"
                style="line-height: 34px; width: 100%"
              ></el-input-number>
            </el-form-item>
          </LFormtTitle>
        </el-row>

        <p class="input-desc">短语内容</p>
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入短语内容"
          v-model="formData.phraseContent"
        ></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="phraseConfirm"
          >确 定</el-button
        >
        <el-button size="mini" @click="phraseCancel">取 消</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  deletePhrase,
  getPhraseAll,
  addOrUpdatePhrase
} from "@/api/emrRecord/nursingRecord/docPhrase";
import { getDocInfoNoPage } from "@/api/emrRecord/nursingRecord/docInfoMaintain";
import { getOrgDeptList } from "@/api/admin/user";

export default {
  name: "index",
  // components: {
  //   classifyAdd
  // },
  data() {
    return {
      tlm_isLoading: false,
      searchData: {
        phraseName: "",
        phraseType: "",
        inpDeptCode: ""
      },
      classifyParams: [
        {
          prop: "sort",
          label: "序号",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        },
        {
          prop: "phraseName",
          label: "短语名称",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        },
        {
          prop: "phraseType",
          label: "短语类型",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        },
        {
          prop: "inpDeptName",
          label: "所属科室",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "300"
        },
        {
          prop: "phraseContent",
          label: "短语内容",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "300"
        }
      ],
      phraseData: [],
      //选择的项目
      selections: [],
      //弹框标题
      dialogTitle: "",
      //弹框显示
      dialogVisible: false,
      //新增or修改form
      form: {},
      dialogType: "edit",
      rules: {
        optionName: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      // 当前操作编辑的数据
      formData: {},
      deptOptions: [],
      docOptions: []
    };
  },
  created() {
    this.getPhraseData();
    this.ininInfo();
  },
  methods: {
    changeDept(id, item) {
      console.log("---changeFunc---", item);
      this.formData.inpDeptName = item.orgNm;
    },

    async getPhraseData() {
      this.$showLoading();
      try {
        let params = { ...this.searchData };
        let data = await getPhraseAll(params);
        if (data.code == "1") {
          this.phraseData = [...data.data];
        } else {
          this.$message.error(data.msg || "获取文书分类数据失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取文书分类数据失败");
      }
    },
    //所属科室
    ininInfo() {
      getDocInfoNoPage({}).then(res => {
        if (res.code == 1) {
          res.data.forEach(item => {
            let opt = {
              value: item.docCode,
              label: item.docName
            };
            this.docOptions.push(opt);
          });
        }
      });
      //所属科室
      // getOrgDeptList({}).then(res=>{
      //   if (res.code == 1){
      //     res.data.forEach(item=>{
      //       let opt = {
      //         value: item.id,
      //         label: item.orgNm
      //       }
      //       this.deptOptions.push(opt);
      //     })
      //   }
      // })
    },
    /*搜索*/
    search() {
      this.getPhraseData();
    },
    /*重置*/
    reset() {
      this.searchData = {
        phraseName: "",
        phraseType: "",
        inpDeptCode: ""
      };
    },
    /*选择框改变*/
    selectionChange(selections) {
      this.selections = [...selections];
    },
    /*增加*/
    addData() {
      this.dialogVisible = true;
      this.dialogTitle = "新建";
      this.formData = {};
      this.dialogType = "new";
    },
    /*修改*/
    modifyData() {
      if (this.selections && this.selections.length === 1) {
        this.dialogVisible = true;
        this.dialogTitle = "修改";
        this.formData = {
          ...this.selections[0],
          add: "0"
        };
        this.formData.inpDeptCode = Number(this.formData.inpDeptCode);
      }
    },
    /*删除*/
    deleteData() {
      let selectionsArr = [];
      for (let i in this.selections) {
        selectionsArr.push(this.selections[i].id);
      }
      if (selectionsArr.length > 0) {
        this.$confirm("确定删除吗？", "短语删除", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          this.$showLoading();
          try {
            let data = await deletePhrase(selectionsArr);
            if (data.code == "1") {
              this.$message("删除成功");
              this.getPhraseData();
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
    async phraseConfirm() {
      try {
        this.$showLoading();
        //this.formData
        let response = await addOrUpdatePhrase(this.formData);
        this.getPhraseData();
        this.phraseCancel();
        this.$hideLoading();
      } catch (error) {
        //this.phraseCancel();
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    phraseCancel() {
      this.dialogVisible = false;
      this.formData = {};
      this.$refs["rform"].resetFields();
    }
    /*dialog*/
  }
};
</script>

<style scoped lang="scss">
.phraseStyle {
  padding: 20px;

  .table-cont {
    height: calc(100% - 58px);
    margin-top: 20px;
  }

  .dialog-wrapper {
    padding: 40px 90px;
  }
  .input-desc {
    margin: 5px 0;
  }
}
</style>
