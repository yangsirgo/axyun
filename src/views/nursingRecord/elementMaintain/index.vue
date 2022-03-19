<template>
  <el-card class="width100 height100 elementMaintain">
    <div class="nav-bars clearfix">
      <el-row :gutter="20">
        <el-col :span="3">
          <LFormtTitle label="元素类型">
            <l-value-domain-emr
              code="CareDocControlType"
              type="select"
              :value.sync="searchData.sEleCtrl"
              clearable
            ></l-value-domain-emr>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="元素名称">
            <el-input
              v-model="searchData.sEleName"
              style="line-height: 34px; width: 100%"
              @keyup.enter.native="search"
              placeholder="请输入"
            >
            </el-input>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="拼音码">
            <el-input
              v-model="searchData.inputPy"
              style="line-height: 34px; width: 100%"
              @keyup.enter.native="search"
              placeholder="请输入"
            >
            </el-input>
          </LFormtTitle>
        </el-col>
        <el-col :span="3">
          <LFormtTitle label="五笔码">
            <el-input
              v-model="searchData.inputWb"
              style="line-height: 34px; width: 100%"
              @keyup.enter.native="search"
              placeholder="请输入"
            >
            </el-input>
          </LFormtTitle>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" plain @click="reset">重置</el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            plain
            class="float-right margin-left-10"
            :disabled="selections.length != 1"
            @click="viewAttr"
            >属性
          </el-button>
          <el-button
            type="primary"
            plain
            class="float-right"
            :disabled="selections.length < 1"
            @click="deleteData"
            >删除
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
            >新建
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-cont">
      <el-table
        :data="eleData"
        width="100%"
        height="100%"
        :stripe="true"
        border
        v-loadmore="load"
        v-loading="tlm_isLoading"
        @selection-change="selectionChange"
        :element-loading-text="$t('retreat.loadInfo')"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in eleParams"
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
      :visible.sync="eleDisable"
      :close-on-click-modal="false"
    >
      <element-add
        :form="form"
        @eleAddConfirm="eleAddConfirm"
        @eleAddConfirmFalse="eleAddConfirmFalse"
        @eleAddCancel="eleAddCancel"
      ></element-add>
    </el-dialog>
  </el-card>
</template>

<script>
  import elementAdd from "./components/elementAdd";
  import {get} from "@/utils/requestEmr";
  import {
    getDocElementByPage,
    batchDeleteDocInfo
  } from "@/api/emrRecord/nursingRecord/elementMaintain";

  let url = "/wdata/dic/single/CareDocControlType";
  export default {
    name: "index",
    components: {elementAdd},
    data() {
      return {
        searchData: {
          sEleCtrl: "",
          sEleName: "",
          inputPy: "",
          inputWb: ""
        },
        /*分页信息*/
        pageParams: {
          pageSize: 20,
          pageNo: 1
        },
        total: 0,
        tlm_isLoading: false,
        eleParams: [
          {
            prop: "elementCode",
            label: "元素编码",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "elementName",
            label: "元素名称",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "elementShowname",
            label: "显示名称",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "elementSuffname",
            label: "名称后缀",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          },
          {
            prop: "elementType",
            label: "元素类型",
            align: "left",
            headerAlign: "left",
            fixed: "left",
            width: "80"
          }
        ],
        eleData: [],
        eleDataUnit: [],
        /*选中的元素*/
        selections: [],
        //弹框标题
        dialogTitle: "",
        //弹框显示
        eleDisable: false,
        //新增or修改form
        form: {},
        // 元素类型集合
        eleList: []
      };
    },
    computed: {
      totalPage() {
        return Math.ceil(this.total / this.pageParams.pageSize);
      }
    },
    async created() {
      await this.request(url);
      await this.search();
    },
    methods: {
      /*查询所有元素*/
      async getEleData() {
        this.tlm_isLoading = true;
        try {
          let params = {
            ...this.searchData,
            ...this.pageParams
          };
          console.log(params, "params");
          let {code, data, total} = await getDocElementByPage(params);

          if (code === 1) {
            console.log(data, "----data----");
            this.total = total;
            this.eleDataUnit = data.map(item => {
              let eleFindItem = this.eleList.find(it => {
                return item.elementControl === it.code;
              });
              return {
                ...item,
                elementType: eleFindItem ? eleFindItem.name : ""
              };
            });
          } else {
            this.$message.error(data.msg || "获取元素列表失败");
          }

          this.tlm_isLoading = false;
        } catch (error) {
          this.tlm_isLoading = false;
          this.$message.error(error.msg || "获取元素列表失败");
        }
      },
      load() {
        const _this = this;
        this.pageParams.pageNo++;
        setTimeout(async () => {
          let eleData = [..._this.eleData];
          if (_this.pageParams.pageNo > _this.totalPage) {
            _this.pageParams.pageNo = _this.totalPage;
          } else {
            await _this.getEleData();
            _this.eleData = [...eleData.concat(_this.eleDataUnit)];
          }
          _this.tlm_isLoading = false;
        }, 2000);
      },
      resetPageParams() {
        this.pageParams.pageNo = 1;
        this.pageParams.pageSize = 20;
      },
      /*搜索*/
      async search() {
        this.resetPageParams();
        await this.getEleData();
        this.eleData = this.eleDataUnit;
      },
      /*重置*/
      reset() {
        this.searchData = {};
      },
      /*多选*/
      selectionChange(selections) {
        this.selections = [...selections];
      },
      /*增加*/
      addData() {
        this.eleDisable = true;
        this.dialogTitle = "新建元素";
        this.form = {
          add: "1",
          elementControl: "0"
        };
      },
      /*修改*/
      modifyData() {
        if (this.selections && this.selections.length === 1) {
          this.eleDisable = true;
          this.dialogTitle = "修改元素";
          /*数据解析*/
          this.form = {
            ...this.selections[0],
            add: "0"
          };
        }
      },
      /*查看属性*/
      viewAttr() {
        if (this.selections && this.selections.length === 1) {
          this.eleDisable = true;
          this.dialogTitle = "属性";
          this.form = {
            ...this.selections[0],
            add: "2"
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
          this.$confirm("确定删除吗？", "元素删除", {
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            this.$showLoading();
            try {
              let data = await batchDeleteDocInfo(selectionsArr);
              console.log(data, "data");
              if (data.code == "1") {
                let msg = data.data.data || "";
                this.$message(msg || "删除成功");
                this.resetPageParams();
                await this.reset();
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
      /*dialog*/
      async eleAddConfirm() {
        this.eleDisable = false;
        await this.reset();
        await this.search();
      },
      async eleAddConfirmFalse() {
        await this.reset();
        await this.search();
      },
      eleAddCancel() {
        this.eleDisable = false;
      },
      /*dialog*/
      // 查询所有元素类型
      async request(url) {
        let {data} = await get(url, {});
        this.eleList.push(...data);
      }
    }
  };
</script>

<style scoped lang="scss">
.elementMaintain {
  padding: 20px 0 20px 0;

  .nav-bars {
    margin: 0 20px 20px 20px;
  }

  .table-cont {
    height: calc(100% - 58px);
  }
}
</style>
