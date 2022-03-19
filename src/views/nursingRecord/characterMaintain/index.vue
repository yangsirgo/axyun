<template>
  <el-card class="width100 height100 characterMaintain">
    <div class="nav-bars clearfix">
      <div class="left float-left">
        <el-row :gutter="20">
          <el-col :span="8">
            <LFormtTitle label="类型">
              <l-value-domain-emr
                code="CharacterType"
                :value.sync="searchData.characterType"
                placeholder="请选择"
                clearable
              />
              <!--<el-input v-model="searchData.characterType"-->
              <!--style="line-height: 34px;width:100%"-->
              <!--placeholder="请输入">-->
              <!--</el-input>-->
            </LFormtTitle>
          </el-col>
          <el-col :span="8">
            <LFormtTitle label="符号">
              <el-input
                v-model="searchData.characterValue"
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
        :data="characterData"
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
          v-for="(item, index) in characterParams"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :align="item.align || 'left'"
          :header-align="item.headerAlign || 'left'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            <template v-if="item.prop == 'characterType'">
              <span
                :val="scope.row.characterType"
                code="CharacterType"
                v-codeTransformEmr
              ></span>
            </template>
            <template v-else>
              <span class="overflow-point">{{ scope.row[item.prop] }}</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dialogTitle"
      width="470px"
      :visible.sync="characterDisable"
      :close-on-click-modal="false"
    >
      <character-add
        v-if="characterDisable"
        :form="form"
        @characterAddConfirm="characterAddConfirm"
        @ccharacterAddCancel="characterAddCancel"
      ></character-add>
    </el-dialog>
  </el-card>
</template>

<script>
import characterAdd from "./components/characterAdd";
import {
  getCharacterData,
  batchDeleteCharacter
} from "@/api/emrRecord/nursingRecord/characterMaintain";

export default {
  name: "index",
  components: {
    characterAdd
  },
  data() {
    return {
      tlm_isLoading: false,
      searchData: {
        characterType: "",
        characterValue: ""
      },
      characterParams: [
        {
          prop: "sort",
          label: "序号",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        },
        {
          prop: "characterType",
          label: "类型",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        },
        {
          prop: "characterValue",
          label: "符号",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        },
        {
          prop: "characterNote",
          label: "描述",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "300"
        }
      ],
      characterData: [],
      //选择的项目
      selections: [],
      //弹框标题
      dialogTitle: "",
      //弹框显示
      characterDisable: false,
      //新增or修改form
      form: {}
    };
  },
  created() {
    this.getCharacterData();
  },
  methods: {
    /*获取字符数据*/
    async getCharacterData() {
      this.$showLoading();
      try {
        let params = { ...this.searchData };
        let data = await getCharacterData(params);
        if (data.code == "1") {
          this.characterData = [...data.data];
        } else {
          this.$message.error(data.msg || "获取符号数据失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取符号数据失败");
      }
    },
    /*搜索*/
    search() {
      this.getCharacterData();
    },
    /*重置*/
    reset() {
      this.searchData = {
        characterType: "",
        characterValue: ""
      };
    },
    /*选择框改变*/
    selectionChange(selections) {
      this.selections = [...selections];
    },
    /*增加*/
    addData() {
      this.characterDisable = true;
      this.dialogTitle = "新建符号";
      this.form = {
        add: "1"
      };
    },
    /*修改*/
    modifyData() {
      if (this.selections && this.selections.length === 1) {
        this.characterDisable = true;
        this.dialogTitle = "修改符号";
        this.form = {
          ...this.selections[0],
          add: "0"
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
        this.$confirm("确定删除吗？", "字符删除", {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          this.$showLoading();
          try {
            let data = await batchDeleteCharacter(selectionsArr);
            if (data.code == "1") {
              this.$message("删除成功");
              this.getCharacterData();
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
    characterAddConfirm() {
      this.characterDisable = false;
      this.getCharacterData();
    },
    characterAddCancel() {
      this.characterDisable = false;
    }
    /*dialog*/
  }
};
</script>

<style scoped lang="scss">
.characterMaintain {
  padding: 20px;

  .table-cont {
    height: calc(100% - 58px);
    margin-top: 20px;
  }
}
</style>
