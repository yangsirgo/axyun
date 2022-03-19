<template>
  <div class="height100 cls-right checkModule">
    <el-row class="height100">
      <el-col :span="8" class="height100">
        <el-card class="height100">
          <div class="utils">
            <el-input
              v-model="filterText"
              placeholder="输入名称进行检索"
              style="width: 70%"
            ></el-input>
            <!-- <el-button class="fr" type="primary" @click="search">查询</el-button> -->
          </div>
          <div class="centerTable">
            <el-tree
              highlight-current
              ref="tree"
              :data="treedata"
              class="filter-tree"
              node-key="id"
              :props="defaultProps"
              :default-expand-all="false"
              @node-click="handleNodeClick"
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              :default-expanded-keys="defaultExpandedKeys"
              @node-expand="handleExpand"
              @node-collapse="handleCollapse"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                  <el-button
                    v-if="data.pid != 0"
                    type="text"
                    size="mini"
                    @click.stop
                    @click="() => append(node, data, 1)"
                  >
                    添加同级
                  </el-button>
                  <el-button
                    type="text"
                    @click.stop
                    size="mini"
                    @click="() => append(node, data, 2)"
                  >
                    添加下级
                  </el-button>
                  <el-button
                    type="text"
                    @click.stop
                    v-if="data.pid != 0"
                    size="mini"
                    @click="() => append(node, data, 3)"
                  >
                    删除
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>
          <!--<el-pagination-->
          <!--class=""-->
          <!--@size-change="handleSizeChange"-->
          <!--@current-change="handleCurrentChange"-->
          <!--:current-page.sync="currentPage"-->
          <!--:page-sizes="[10, 20, 50, 100]"-->
          <!--:page-size="pageSize"-->
          <!--layout="total, sizes, prev, pager, next"-->
          <!--:total="totalPage">-->
          <!--</el-pagination>-->
        </el-card>
      </el-col>
      <el-col :span="16" class="height100" style="padding-left: 10px">
        <el-card class="height100">
          <!-- <l-card-title style="margin-left: 15px;">
            <span slot="left">关联医嘱项目</span>
          </l-card-title> -->
          <div class="utils-cls">
            <el-form
              :inline="true"
              :model="fromDataSubmit"
              :rules="fromDataRules"
              ref="sonRuleForm"
              label-width="0"
              class="demo-ruleForm"
            >
              <el-form-item prop="adviceCategory">
                <LFormtTitle label="医嘱分类" required disabled>
                  <el-select v-model="fromDataSubmit.adviceCategory" disabled>
                    <el-option label="检查申请" value="0"></el-option>
                    <el-option label="检验申请" value="1"></el-option>
                    <el-option label="治疗申请" value="2"></el-option>
                  </el-select>
                </LFormtTitle>
              </el-form-item>
              <!-- <el-form-item prop="category">
                <LFormtTitle label="使用范围" required>
                  <el-select v-model="fromDataSubmit.category">
                    <el-option label="检查申请" value="0"></el-option>
                    <el-option label="检验申请" value="1"></el-option>
                    <el-option label="治疗申请" value="2"></el-option>
                  </el-select>
                </LFormtTitle>
              </el-form-item> -->
              <el-form-item label="" prop="useRange">
                <l-formt-title label="使用范围" required>
                  <l-value-domain
                    code="AntimicrobialRanges"
                    multiple
                    :value.sync="fromDataSubmit.useRange"
                    placeholder="请选择使用范围"
                  ></l-value-domain>
                </l-formt-title>
              </el-form-item>
              <el-form-item prop="parentName">
                <LFormtTitle label="父级目录" disabled>
                  <el-input
                    v-model="fromDataSubmit.parentName"
                    disabled
                    style="line-height: 34px; width: 100%"
                    placeholder="请输入父级目录"
                  >
                  </el-input>
                </LFormtTitle>
              </el-form-item>
              <el-form-item prop="catalogName">
                <LFormtTitle label="目录名称" required>
                  <el-input
                    v-model="fromDataSubmit.catalogName"
                    style="line-height: 34px; width: 100%"
                    placeholder="请输入目录名称"
                  >
                  </el-input>
                </LFormtTitle>
              </el-form-item>
              <el-form-item prop="statusCode">
                <LFormtTitle label="状态标识" required>
                  <el-select v-model="fromDataSubmit.statusCode">
                    <el-option label="有效" value="0"></el-option>
                    <el-option label="禁用" value="1"></el-option>
                    <!-- <el-option label="作废" value="2"></el-option> -->
                  </el-select>
                </LFormtTitle>
              </el-form-item>
              <el-form-item prop="rank">
                <LFormtTitle label="排序" required>
                  <el-input
                    v-model.number="fromDataSubmit.rank"
                    onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    style="line-height: 34px; width: 100%"
                    placeholder="请输入排序"
                  >
                  </el-input>
                </LFormtTitle>
              </el-form-item>
              <el-form-item prop="specialReminder">
                <LFormtTitle label="特殊提醒">
                  <el-input
                    v-model="fromDataSubmit.specialReminder"
                    style="line-height: 34px; width: 100%"
                    placeholder="请输入特殊提醒"
                  >
                  </el-input>
                </LFormtTitle>
              </el-form-item>
            </el-form>
          </div>
          <checkItem
            ref="checkItem"
            :fromDataSubmit="fromDataSubmit"
            @saveItemAction="saveItemAction"
            style="height: calc(100% - 286px)"
          ></checkItem>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkItem from "./checkItem.vue";
import {
  adviceItemListPage,
  oWgetElectronicApplicationCatalogRelationListByAdviceCategory
} from "@/api/systemManagement/dataMaintain/adviceItem";
import { getDoctorsAdviceList } from "@/api/systemManagement/dataMaintain/doctorsAdvice";
import {
  findFieldList,
  getListByAdviceCategory,
  deleteAdviceCategory
} from "@/api/systemManagement/dataMaintain/adviceItem";

export default {
  name: "index",
  components: { checkItem },
  data() {
    const data = [];
    return {
      treedata: JSON.parse(JSON.stringify(data)),
      defaultExpandedKeys: [], // 树初始化要展开的节点key
      filterText: "",
      defaultProps: {
        children: "children",
        label: "catalogName"
      },
      fromDataSubmit: {
        adviceCategory: "0",
        children: [],
        useRange: "",
        parentId: "",
        parentName: "",
        catalogName: "",
        statusCode: "0",
        rank: "",
        specialReminder: ""
      },
      fromDataRules: {
        adviceCategory: [
          {
            required: true,
            message: "医嘱分类不能为空",
            trigger: "blur"
          }
        ],
        parentName: [
          {
            required: true,
            message: "医嘱父类不能为空",
            trigger: "blur"
          }
        ],
        rank: [
          {
            required: true,
            message: "排序不能为空",
            trigger: "blur"
          }
        ],
        sonDoctorsAdviceName: [
          {
            required: true,
            message: "子类名称不能为空",
            trigger: "blur"
          }
        ]
      },

      utils: {
        adviceItemName: ""
      },
      tableParams: [
        {
          prop: "name",
          label: "用法"
        }
        // ,
        //   {
        //   prop: 'remark',
        //   label: '说明'
        // }
      ],
      tableData: [],
      pageSize: 10,
      totalPage: 50,
      currentPage: 1,
      loading: false
    };
  },
  created() {
    // this.search();
    //查询字典项
    this.findFieldList();
  },
  mounted() {
    this.getListByAdviceCategory();
  },
  methods: {
    append(node, data, flag) {
      // console.log("append(node)",node)
      // console.log("append(data)",data)
      // console.log("append(flag)",flag)
      this.fromDataSubmit.adviceitem = [];
      this.$refs.checkItem.clickappend();

      if (flag == 2) {
        // 下级
        oWgetElectronicApplicationCatalogRelationListByAdviceCategory({
          categorysId: data.id
        }).then(res => {
          console.log(
            "oWgetElectronicApplicationCatalogRelationListByAdviceCategory",
            res
          );
          if (res.code === 1) {
            // this.tableData = resData;
            if (res.data && res.data.length > 0) {
              this.fromDataSubmit = {
                operationType: "2",
                adviceCategory: "",
                children: [],
                useRange: "",
                id: "",
                level: "",
                parentId: "",
                parentName: "",
                catalogName: "",
                statusCode: "0",
                rank: "",
                specialReminder: ""
              };
              this.$message("已有医嘱项目，不能增加下级目录。");
              // return false;
            } else {
              this.fromDataSubmit = {
                operationType: "2",
                adviceCategory: data.adviceCategory,
                children: [],
                useRange: "",
                id: data.id,
                level: data.level,
                parentId: data.id,
                parentName: data.catalogName,
                catalogName: "",
                statusCode: "0",
                rank: "",
                specialReminder: ""
              };
            }
          } else {
            this.$message("查询失败");
          }
        });
      } else if (flag == 1) {
        this.fromDataSubmit = {
          operationType: "1",
          adviceCategory: data.adviceCategory,
          children: [],
          useRange: "",
          id: data.id,
          level: data.level,
          parentId: data.pid,
          parentName: data.pcatalogName,
          catalogName: "",
          statusCode: "0",
          rank: "",
          specialReminder: ""
        };
      } else if (flag == 3) {
        console.log("append(node)", node);
        console.log("append(data)", data);
        console.log("append(flag)", flag);

        this.$confirm("此操作将删除此节点和它的所有子节点, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let datas = [data]; //是一个树结构的数据
            let expandedKeys = []; // 存储数据
            function setName(datas) {
              //遍历树  获取id数组
              for (var i in datas) {
                expandedKeys.push(datas[i].id);
                if (datas[i].children) {
                  setName(datas[i].children);
                }
              }
            }
            setName(datas);
            console.log("expandedKeys", expandedKeys);
            let nodesstring = expandedKeys.toString();
            console.log("nodesstring", nodesstring);
            deleteAdviceCategory({ ids: nodesstring })
              .then(res => {
                console.log("deleteAdviceCategory", res);
                if (res.code === 1) {
                  this.getListByAdviceCategory();
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                } else {
                  this.$message.error("删除失败");
                }
              })
              .catch(error => {
                this.$message.error("删除失败");
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }

      // const newChild = { id: id++, label: 'testtest', children: [] };
      // if (!data.children) {
      //   this.$set(data, 'children', []);
      // }
      // data.children.push(newChild);
    },
    // remove(node, data) {
    //   const parent = node.parent;
    //   const children = parent.data.children || parent.data;
    //   const index = children.findIndex(d => d.id === data.id);
    //   children.splice(index, 1);
    // },
    filterNode(value, data) {
      if (!value) return true;
      return data.catalogName.indexOf(value) !== -1;
    },
    getListByAdviceCategory() {
      // let adviceCategorys = [0,1]
      let json = {};
      json.adviceCategorys = "0,1";
      // json.type = 'item'
      console.log("json", json);
      getListByAdviceCategory(json).then(res => {
        if (res.code === 1) {
          console.log("res.data" + JSON.stringify(res.data));
          this.treedata = res.data;
        } else {
          this.$message("查询失败");
        }
      });
    },
    handleExpand(data) {
      console.log("handleExpand", data);
      const index = this.defaultExpandedKeys.indexOf(data.id);
      if (index == -1) {
        this.defaultExpandedKeys.push(data.id);
      }
      console.log("this.defaultExpandedKeys", this.defaultExpandedKeys);
    },
    handleCollapse(data) {
      console.log("handleCollapse", data);
      const index = this.defaultExpandedKeys.indexOf(data.id);
      if (index > -1) {
        this.defaultExpandedKeys.splice(index, 1);
      }
      console.log("this.defaultExpandedKeys", this.defaultExpandedKeys);
    },
    handleNodeClick(data) {
      this.$refs.checkItem.fromData.tableData = [];
      this.$refs.checkItem.tableLoding = true;
      console.log("handleNodeClick", data);
      this.fromDataSubmit = {
        operationType: "3",
        adviceCategory: data.adviceCategory,
        children: data.children,
        useRange: eval(data.useRange) || "",
        id: data.id,
        level: data.level,
        parentId: data.pid,
        parentName: data.pcatalogName,
        catalogName: data.catalogName,
        statusCode: data.statusCode,
        rank: data.rank,
        specialReminder: data.specialReminder || ""
      };
      console.log("handleNodeClick-this.fromDataSubmit", this.fromDataSubmit);
      oWgetElectronicApplicationCatalogRelationListByAdviceCategory({
        categorysId: data.id
      })
        .then(res => {
          console.log(
            "oWgetElectronicApplicationCatalogRelationListByAdviceCategory",
            res
          );
          if (res.code === 1) {
            // this.tableData = resData;
            this.fromDataSubmit.adviceitem = res.data;
            this.$refs.checkItem.clickappend();
          } else {
            this.$message("查询失败");
          }
          this.$refs.checkItem.tableLoding = false;
        })
        .catch(e => {
          this.$refs.checkItem.tableLoding = false;
        });
    },
    saveItemAction() {
      console.log("刷新树列表");
      this.getListByAdviceCategory();
      this.fromDataSubmit = {
        operationType: "3",
        adviceCategory: "",
        children: "",
        useRange: "",
        id: "",
        parentId: "",
        parentName: "",
        catalogName: "",
        statusCode: "",
        rank: "",
        specialReminder: "",
        adviceitem: []
      };
      this.$refs.checkItem.clickappend("save");
    },

    rowClick(row) {
      console.log("row" + JSON.stringify(row));
      this.$refs.checkItem && this.$refs.checkItem.loadData(row);
    },
    search() {
      // this.getAdviceItemFun(this.getParams());
      let json = {};
      json.val = this.utils.adviceItemName;
      this.findFieldList(json);
    },
    getParams() {
      let obj = {
        pageNo: this.currentPage,
        pageSize: this.pageSize
      };
      return { ...obj, ...this.itemFilter };
    },
    // getAdviceItemFun(obj) {
    //   adviceItemListPage(obj)
    //     .then(res => {
    //       if (res.code === 1) {
    //         // this.tableData = resData;
    //         this.tableData = res.data;
    //         for(let i = 0; i < this.tableData.length; i++) {
    //           let row = this.tableData[i];
    //           this.tableData[i].status = row.status == "0" ? "激活" : "禁用";
    //         }
    //         this.totalPage = res.total;
    //         this.pageNo = res.pageNo;
    //         this.pageSize = res.pageSize;
    //       } else {
    //         this.$message('查询失败')
    //       }
    //     })
    // },
    handleSizeChange(val) {
      this.search();
    },
    handleCurrentChange(val) {
      this.search();
    },

    findFieldList(obj) {
      findFieldList(obj).then(res => {
        if (res.code === 1) {
          console.log("res.data" + JSON.stringify(res.data));
          this.tableData = res.data;
        } else {
          this.$message("查询失败");
        }
      });
    }
  },
  filters: {
    rounding(value) {
      value = value !== "" ? new Number(value) : 0;
      return value.toFixed(4);
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.cls-right {
  /*margin-left: 360px;*/
  .utils {
    padding: 10px;
  }
  .centerTable {
    height: calc(100% - 96px);
    overflow-y: scroll;
  }
  .cls-right-center {
    margin-right: 750px;
    position: relative;
  }
  .cls-right-right {
    width: 740px;
    float: right;
  }
  .pagination {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
.checkModule {
  /deep/ .el-button--text {
    color: #004cff;
  }
  .utils-cls {
    // padding: 0 10px;
    margin: 10px;
  }
}
</style>
