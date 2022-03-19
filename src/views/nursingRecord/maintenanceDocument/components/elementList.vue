<template>
  <div class="element-list height100 width100">
    <div class="width100 elementMaintain">
      <div class="nav-bars clearfix">
        <el-row :gutter="24">
          <el-col :span="6">
            <LFormtTitle label="元素类型">
              <el-select
                v-model="searchData.elementBaseId"
                clearable
                filterable
                placeholder="请选择"
                @change="getEleData"
              >
                <el-option
                  v-for="item in eleTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </LFormtTitle>
          </el-col>
          <el-col :span="6">
            <LFormtTitle label="元素名称">
              <el-input
                v-model="searchData.elementName"
                style="line-height: 34px; width: 100%"
                placeholder="请输入"
                @keyup.enter="getEleData"
              ></el-input>
            </LFormtTitle>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" plain @click="reset">重置</el-button>
            <el-button
              type="primary"
              :disabled="selections.length === 0"
              plain
              @click="addEle"
              >添加</el-button
            >
            <el-button type="primary" plain @click="keep">保存</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table-cont">
        <div class="table-con-tan height100">
          <l-table
            :total="pageParams.total"
            :pageSize.sync="pageParams.pageSize"
            :page.sync="pageParams.pageNo"
            :layout="layout"
            :singlePageShow="true"
            @changeSize="changeSize"
          >
            <el-table
              ref="multipleTable"
              :data="eleData"
              width="100%"
              height="100%"
              :stripe="true"
              border
              v-loading="tlm_isLoading"
              @row-click="rowClick"
              @selection-change="selectionChange"
              :element-loading-text="$t('retreat.loadInfo')"
            >
              <el-table-column
                type="selection"
                width="55"
                align="center"
                :selectable="isSelectable"
              ></el-table-column>
              <el-table-column
                v-for="(item, index) in eleParams"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :align="item.align || 'left'"
                :header-align="item.headerAlign || 'left'"
                :fixed="item.fixed"
              ></el-table-column>
            </el-table>
            <l-card-title style="padding: 15px 0">
              <template slot="left">添加元素</template>
            </l-card-title>
          </l-table>
        </div>
      </div>
    </div>
    <div class="choosed-element-con">
      <div class="choosed-ele-data height100 width100">
        <!--
        <l-card-title style="padding: 15px 0">
          <template slot="left">添加元素</template>
        </l-card-title>
        -->
        <div class="choosed-ele">
          <el-table
            :data="choosedEleData"
            width="100%"
            height="100%"
            :stripe="true"
            border
          >
            <el-table-column
              v-for="(item, index) in eleParams0"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :align="item.align || 'left'"
              :header-align="item.headerAlign || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop == 'operate'">
                  <el-button
                    type="text"
                    @click="remove(scope.row, scope.$index)"
                    >移除</el-button
                  >
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { get } from "@/utils/requestEmr";
import {
  getDocElementByPage,
  batchDeleteDocInfo,
  getDocElementByPageGZ,
  detailQuery
} from "@/api/emrRecord/nursingRecord/elementMaintain";
import { getAll } from "@/api/emrRecord/emr/element";

let url = "/wdata/dic/single/CareDocControlType";
export default {
  name: "elementList",
  props: {
    activityName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      searchData: {
        elementBaseId: "",
        elementName: ""
      },
      /*分页信息*/
      pageParams: {
        pageSize: 20,
        pageNo: 1,
        total: 0
      },
      tlm_isLoading: false,
      layout: "total,prev,pager,next,jumper",
      eleTypeOptions: [],
      eleParams0: [
        {
          prop: "elementBaseName",
          label: "元素类型",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        },
        {
          prop: "dataElementName",
          label: "数据元",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "elementCode",
          label: "元素编码",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "elementName",
          label: "元素名称",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "placeholderText",
          label: "占位文本",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "tooltipText",
          label: "提示文本",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "defaultValues",
          label: "默认值",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "operate",
          label: "操作",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        }
      ],
      eleParams: [
        {
          prop: "elementBaseName",
          label: "元素类型",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "80"
        },
        {
          prop: "dataElementName",
          label: "数据元",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "elementCode",
          label: "元素编码",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "elementName",
          label: "元素名称",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "placeholderText",
          label: "占位文本",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "tooltipText",
          label: "提示文本",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        },
        {
          prop: "defaultValues",
          label: "默认值",
          align: "left",
          headerAlign: "left",
          fixed: false,
          width: "80"
        }
      ],
      eleData: [],
      choosedEleData: [],
      /*选中的元素*/
      selections: [],
      // 元素类型集合
      eleList: []
    };
  },
  watch: {
    basicElement: {
      handler(val) {
        if (
          JSON.stringify(val) !== "{}" &&
          this.activityName === "elementList"
        ) {
          this.choosedEleData = this.choosedEleData.concat([val]);
          for (let i in this.choosedEleData) {
            this.choosedEleData[i].idNew = this.createRandomId();
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageParams.pageSize);
    },
    ...mapGetters("nurseDocument", ["basicElement"])
  },
  async created() {
    this.changeBasicElement({});
    this.choosedEleData = [];
    await this.request(url);
    await this.search();
    this.initEleTypeData();
  },
  methods: {
    ...mapActions({
      changeBasicElement: "nurseDocument/changeBasicElement"
    }),
    //是否可以选择（某些元素类型比如组合元素不可选）
    isSelectable(row, index) {
      return row.elementBaseName != "组合元素";
    },
    //移除元素
    remove(row, index) {
      // this.choosedEleData
      this.$confirm("是否移除元素?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$delete(this.choosedEleData, index);
      });
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.getEleData();
    },
    /*查询所有元素*/
    async getEleData() {
      this.tlm_isLoading = true;
      try {
        let params = {
          ...this.searchData,
          ...this.pageParams
        };
        let { code, data } = await getDocElementByPageGZ(params);
        if (code == 1) {
          this.pageParams.total = data.total;
          this.eleData = data.elementPageContentDtoLst;
        } else {
          this.$message.error(data.msg || "获取元素列表失败");
        }
        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
        this.$message.error(error.msg || "获取元素列表失败");
      }
    },
    // 初始化搜索框的元素种类
    initEleTypeData() {
      getAll({}).then(res => {
        if (res.code == 1) {
          res.data.forEach(item => {
            if (item.baseElementName == "基本元素") {
              // 不要基本元素
              return;
            }
            let option = {
              value: item.id,
              label: item.baseElementName
            };
            this.eleTypeOptions.push(option);
          });
        }
      });
    },
    // 添加数据
    addEle() {
      this.choosedEleData = this.choosedEleData.concat(this.selections);
      for (let i in this.choosedEleData) {
        this.choosedEleData[i].idNew = this.createRandomId();
      }
      this.$refs.multipleTable.clearSelection();
    },
    //获取元素详情属性
    async getEleDetail() {
      let arr = [];
      let choData = this.choosedEleData;
      for (let i in choData) {
        if (choData[i].elementBaseName !== "基本元素") {
          let params = {
            id: choData[i]["id"]
          };
          let { code, data } = await detailQuery(params);
          arr.push(data);
        } else {
          arr.push(choData[i]);
        }
      }
      return arr;
    },
    // 保存按钮
    async keep() {
      let arr = await this.getEleDetail();
      await this.$emit("update", arr);
      this.choosedEleData = [];
      this.changeBasicElement({});
    },
    resetPageParams() {
      this.pageParams.pageNo = 1;
      this.pageParams.pageSize = 20;
    },
    /*搜索*/
    async search() {
      this.resetPageParams();
      await this.getEleData();
    },
    /*重置*/
    reset() {
      this.searchData = {};
    },
    /*点击某一行*/
    rowClick(row, column, event) {
      if (row.elementBaseName != "组合元素") {
        this.$refs.multipleTable.toggleRowSelection(row);
      }
    },
    /*多选*/
    selectionChange(selections) {
      this.selections = selections;
    },
    /*多选*/
    /*selectionChoosedChange(selections) {
        console.log(12)
      },*/
    /*dialog*/
    // 查询所有元素类型
    async request(url) {
      let { data } = await get(url, {});
      this.eleList.push(...data);
    },
    createRandomId() {
      return (
        (Math.random() * 10000000).toString(16).substr(0, 4) +
        "-" +
        new Date().getTime() +
        "-" +
        Math.random()
          .toString()
          .substr(2, 5)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.element-list {
  .choosed-element-con {
    padding: 0 10px;
    height: 30%;

    .choosed-ele {
      height: calc(100% - 63px);
    }
  }

  .elementMaintain {
    height: 70%;
    padding: 10px;

    .nav-bars {
      margin-bottom: 10px;
    }

    .table-cont {
      height: calc(100% - 36px);

      .table-con-tan {
        // margin-bottom: 10px;
      }
    }
  }
}
</style>
