<template>
  <!-- 点击申请的历史申请 -->
  <div class="applycontent width100 height100">
    <split-pane
      v-on:resize="resize"
      :min-percent="10"
      :default-percent="20"
      split="vertical"
    >
      <template slot="paneL">
    <div class="apply-left">
      <l-formt-title label="关键词">
        <el-input
          placeholder="输入关键词进行检索"
          v-model="filterText"
          v-if="activeName == 'first'"
        ></el-input>
        <el-input
          placeholder="输入关键词进行检索"
          v-model="filterTextKeShi"
          v-if="activeName == 'second'"
        ></el-input>
        <el-input
          placeholder="输入关键词进行检索"
          v-model="filterTextGeRen"
          v-if="activeName == 'third'"
        ></el-input>
      </l-formt-title>
      <div class="apply-left-tabs">
        <el-tabs class="height100" v-model="activeName">
          <el-tab-pane label="目录" name="first">
            <el-col
              :span="24"
              class="tree-content-overflow tree-content-overflow-ml"
            >
              <el-tree
                class="filter-tree"
                lazy
                ref="tree"
                node-key="id"
                :data="treedata"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :expand-on-click-node="true"
                :load="loadNode"
              >
              <!-- show-checkbox @check="handleCheck" -->
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <el-popover
                    v-if="data.adviceItemJson"
                    placement="right-start"
                    width="450"
                    trigger="hover"
                    @show="clickHandle(node, data)"
                  >
                    <div style="font-weight:700;font-size:14px;">{{node.label}}</div>
                    <div>项目明细：</div>
                    <div
                      v-for="(v, k) in data.adviceItemJson.chargeList"
                      :key="k"
                      style="display: flex; justify-content: space-between"
                    >
                      <span style="width: 300px">{{ v.chargeItemName }}</span>
                      <span style="width: 80px">{{ v.spec }}</span>
                      <span style="min-width: 80px"
                        >单价：{{ v.price || 0 }}</span
                      >
                      <span style="min-width: 80px" v-if="v.itemQuantity"
                        >数量：{{ v.itemQuantity }}</span
                      >
                    </div>
                    <span slot="reference" @dblclick="handleCheck([node.data])">{{ node.label }}</span>
                  </el-popover>
                  <span v-else @dblclick="handleCheck([node.data])">{{ node.label }}</span>
                </span>
              </el-tree>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="科室模板" name="second">
            <el-col :span="24" class="tree-content-overflow">
              <el-tree
                class="filter-tree"
                ref="keshitree"
                default-expand-all
                node-key="templetDetailId"
                :data="keshiTemList"
                :props="keshiProps"
                :filter-node-method="keshifilterNode"
                :expand-on-click-node="true"
              >
              <!-- @check="handleCheckKeShi" show-checkbox -->
                <span class="custom-tree-node" slot-scope="{ node }">
                  <el-popover
                    placement="right-start"
                    width="400"
                    trigger="hover"
                    v-if="node.data.adviceItemJson"
                  >
                    <div style="font-weight:700;font-size:14px;">{{node.label}}</div>
                    <div>项目明细：</div>
                    <div
                      style="display: flex; justify-content: space-between"
                      v-for="(v, k) in node.data.adviceItemJson.chargeList"
                      :key="k"
                    >
                      <span style="width: 300px">{{ v.chargeItemName }}</span>
                      <span style="width: 80px">{{ v.spec }}</span>
                      <span style="min-width: 80px"
                        >单价：{{ v.price || 0 }}</span
                      >
                      <span v-if="v.itemQuantity"
                        >数量：{{ v.itemQuantity }}</span
                      >
                    </div>
                    <span slot="reference" @dblclick="handleCheckKeShi([node.data])">{{ node.label }}</span>
                  </el-popover>
                  <span v-else @dblclick="handleCheckKeShi([node.data])">{{ node.label }}</span>
                </span>
              </el-tree>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="个人模板" name="third">
            <el-col :span="24" class="tree-content-overflow">
              <el-tree
                ref="gerentree"
                class="filter-tree"
                node-key="templetDetailId"
                default-expand-all
                :data="gerenTemList"
                :props="keshiProps"
                :filter-node-method="keshifilterNode"
                :expand-on-click-node="true"
              >
              <!-- @check="handleCheckGeRen" show-checkbox -->
                <span class="custom-tree-node" slot-scope="{ node }">
                  <el-popover
                    width="400"
                    placement="right-start"
                    trigger="hover"
                    v-if="node.data.adviceItemJson"
                  >
                    <div style="font-weight:700;font-size:14px;">{{node.label}}</div>
                    <div>项目明细：</div>
                    <div
                      style="display: flex; justify-content: space-between"
                      v-for="(v, k) in node.data.adviceItemJson.chargeList"
                      :key="k"
                    >
                      <span style="width: 300px">{{ v.chargeItemName }}</span>
                      <span style="width: 80px">{{ v.spec }}</span>
                      <span style="min-width: 80px"
                        >单价：{{ v.price || 0 }}</span
                      >
                      <span v-if="v.itemQuantity"
                        >数量：{{ v.itemQuantity }}</span
                      >
                    </div>
                    <span slot="reference" @dblclick="handleCheckGeRen([node.data])">{{ node.label }}</span>
                  </el-popover>
                  <span v-else @dblclick="handleCheckGeRen([node.data])">{{ node.label }}</span>
                </span>
              </el-tree>
            </el-col>
          </el-tab-pane>
        </el-tabs>
        <!-- <div class="add-pro">
          <el-button type="primary" @click="addPro">添加</el-button>
        </div> -->
      </div>
    </div>
    </template>
      <template slot="paneR">
    <div class="apply-right">
      <el-tabs class="height100" :before-leave="beforeLeave" v-model="yhpzName">
        <el-tab-pane label="申请列表" name="yhgl">
          <check-apply-table
            ref="checkApplyTable"
             v-if="yhpzName === 'yhgl'"
            @loadGeRenTable="loadGeRenTable"
            @loadTable="loadTable"
            v-bind="$attrs"
          />
        </el-tab-pane>
        <el-tab-pane label="历史申请" name="pzgl">
          <checkApplyHistory v-if="yhpzName === 'pzgl'"></checkApplyHistory>
        </el-tab-pane>
      </el-tabs>
    </div>
    </template>
    </split-pane>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import checkApplyHistory from "@/views/public/electronApply/component/checkApplyHistory.vue";
import CheckApplyTable from "@/views/public/electronApply/component/checkApplyTable.vue";
import { medicalInsuranceAudit } from "@/views/public/electronApply/component/eleUtils.js";

import {
  getListByAdviceCategory,
  getListByAdviceCategoryDetai
} from "@/api/systemManagement/dataMaintain/adviceItem";

import { deepClone } from "@/utils/index";
import { getUN } from "@/utils/crypto";
import { getRole } from "@/utils/auth";
import { beforeLeaveConfirm } from "@/views/public/electronApply/component/eleUtils.js";
import checkApply from "../mixins/checkApply";

export default {
  name: "checkApply",
  components: { checkApplyHistory, CheckApplyTable },
  mixins: [checkApply],
  data() {
    return {
      //目录树数据
      treedata: [],
      keshiTemList: [],
      gerenTemList: [],
      filterText: "",
      filterTextKeShi: "",
      filterTextGeRen: "",
      defaultProps: {
        children: "children",
        label: "catalogName",
        isLeaf: "leaf"
      },
      keshiProps: {
        children: "templetDetail",
        label: "itemName"
      },
      //左侧树选中的数据
      checkedList: [],

      // 默认显示tabs
      activeName: "first",
      yhpzName: "yhgl",

      chargeListLoading: false
    };
  },
  computed: {
    ...mapGetters("user", ["name", "role"]),
    ...mapGetters("base", ["receivePatientData"]),

    eleTypes() {
      return this.$attrs.elecType;
    },
    //默认执行科室
    defaultDeptId() {
      return JSON.parse(getRole()).deptId;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    filterTextKeShi(val) {
      this.$refs.keshitree.filter(val);
    },
    filterTextGeRen(val) {
      this.$refs.gerentree.filter(val);
    }
  },
  created() {
    this.getListByAdviceCategory();
  },
  /**
   * clickHandle （据图检验检查点击展示方法）
   * 1.获取当前点击具体检验数据
   * 2.展开弹窗组件，并把检验具体数据展示到页面
   *
   * filterNode （目录的树结构过滤方法）
   *
   * keshifilterNode （科室和个人的树 过滤方法）
   *
   * loadNode （目录下的检验检查树结构点击触发的异步加载方法）
   * 1.异步获取当前检验检查下的具体数据
   *
   * getListByAdviceCategory （获取目录树的方法）
   * 1.异步获取目录树的数据 ，并设置相关数据
   *
   * handleCheck 目录tab下的电子检查树结构下的处理已选的数据方法）
   * 1.对已选的数据进行处理并缓存到data中的变量中
   *
   * handleCheckKeShi 科室tab下的电子检查树结构下的处理已选的数据方法）
   * 1.对已选的数据进行处理并缓存到data中的变量中
   *
   * handleCheckGeRen （个人tab下的电子检查树结构下的处理已选的数据方法）
   * 1.对已选的数据进行处理并缓存到data中的变量中
   *
   *
   * addPro （添加已选数据到右侧列表方法）
   * 1.把当前选中的数据添加到右侧列表中
   *
   *
   */
  methods: {
    // 有未提交项 提示提交
    beforeLeave(item, a, b) {
      var p = new Promise(async (resolve, reject) => {   
        if (this.yhpzName == "yhgl") {
          let hasDatas = this.getNewSelectedList().length > 0;
          //有未提交的 项目
          if (hasDatas) {
            try {
              let { action } = await beforeLeaveConfirm();
              if (action == 'confirm') {
                await this.applicationSub();
              } 
              resolve();
            } catch (error) {
              reject();
            }
          } else {  
            resolve()
          }
        } else {
          resolve()
        }  
      })  
      return p
    },   
    // 新增项目 组件外调用
    getNewSelectedList (){
      return this.$refs.checkApplyTable.getNewSelectedList();
    },
    // 新增项目 提交 组件外调用
    applicationSub (){
      return new Promise(async (resolve, reject) => {
        try {
          await this.$refs.checkApplyTable.applicationSub();
          resolve(true);
        } catch (error) {
          console.log("报错了1");
          reject (false)
        }
      }) 
    },
    resize() {},
    async clickHandle(node, data) {
      if (
        data.adviceItemJson.hasOwnProperty("chargeList")
      ) {
        return;
      }
      this.chargeListLoading = true;
      let params = {
        itemIds: data.itemId
      };
      try {
        let { code, data: list } = await getListByAdviceCategoryDetai(params);
        if (code === 1 && list.length === 1) {
          this.$set(data.adviceItemJson, "chargeList", [...list[0].chargeList]);
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.chargeListLoading = false;
      }
    },
    // 关键字搜索目录
    filterNode(val, data) {
      if (!val) return true;
      let value = val.toUpperCase();
      return (
        data.catalogName.indexOf(value) !== -1 ||
        (data.pcatalogName && data.pcatalogName.indexOf(value) !== -1) ||
        (data.mapName &&
          data.mapName.name_1 &&
          data.mapName.name_1.indexOf(value) !== -1) ||
        (data.mapName &&
          data.mapName.name_2 &&
          data.mapName.name_2.indexOf(value) !== -1) ||
        (data.mapName &&
          data.mapName.name_3 &&
          data.mapName.name_3.indexOf(value) !== -1) ||
        (data.pY &&
          data.pY.indexOf(value) !== -1) ||
        (data.simplePY &&
          data.simplePY.indexOf(value) !== -1)
      );
    },
    // 关键字搜索
    keshifilterNode(value, data) {
      if (!value) return true;
      return (
        data.itemName.indexOf(value) !== -1 ||
        (data.templetName && data.templetName.indexOf(value) !== -1)
      );
    },
    // 懒加载下一级
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([]);
      }
      return resolve(node.data.children);
    },
    // 获取目录树
    getListByAdviceCategory() {
      let json = {};
      json.adviceCategorys = "0"; // 0检查 1检验
      json.type = "item"; // 带上医嘱项
      json.source = "0"; // 门诊0 住院1
      getListByAdviceCategory(json).then(async res => {
        if (res.code === 1) {
          let resData = res.data;
          await this.forCircleDataInit(resData, 1);
          this.treedata = resData;
          console.log("this.treedata", this.treedata);
          this.$nextTick(() => {
            let domOne = document
              .getElementsByClassName("tree-content-overflow-ml")[0]
              .getElementsByClassName("el-tree-node__content")[0];

            domOne.click();
            this.$nextTick(async () => {
              let domchildren = document
                .getElementsByClassName("tree-content-overflow-ml")[0]
                .getElementsByClassName("el-tree-node__children")[0].children;
              for (let i in domchildren) {
                try {
                  await domchildren[i].click();
                } catch (error) {}
              }
            });
          });
        } else {
          this.$message.error("查询失败");
        }
      });
    },
    // 左侧目录树check事件
    async handleCheck(list) {
      const roleObj = this.$store.state.user.role;
      // let checkedNodes = this.$refs.tree.getCheckedNodes();
      let checkedNodes = list;

      this.deptName = roleObj.deptName;
      this.checkedList = [];

      let arr = [];
      let res = checkedNodes.filter(item => {
        return item.hasOwnProperty("itemId");
      });
      res = await this.getDetails(res);

      for (let i in res) {
        let item = res[i];
        if (item.adviceItemJson) {
          item.expectExamTime = this.getNowFormatDate();
          if (
            item.adviceItemJson.chargeList &&
            item.adviceItemJson.chargeList.length > 0
          ) {
            let myprice = 0;
            let chargeList = item.adviceItemJson.chargeList;
            for (let j in chargeList) {
              let itemdata = chargeList[j];
              let itemAmt = itemdata.price * itemdata.itemQuantity;
              myprice = Number(itemAmt) + Number(myprice);
            }
            item.amt = myprice;
          } else {
            item.amt = 0;
          }
          item.amt = item.amt.toFixed(4);
          // 执行科室相关
          if (
            item.adviceItemJson.adviceExecRelateList &&
            item.adviceItemJson.adviceExecRelateList[0] &&
            item.adviceItemJson.adviceExecRelateList[0].execDeptCode
          ) {
            item.execDeptCode =
              item.adviceItemJson.adviceExecRelateList[0].execDeptCode;
          } else {
            item.execDeptCode = null;
          }

          item.isUrgent = 0;
          item.deptName = roleObj.deptName;
          item.deptId = roleObj.deptId;
          item.execDeptName = roleObj.deptName;
          item.execDeptCode = roleObj.deptId;
          item.roleName = getUN();
          item.roleId = roleObj.roleId;
          //检查类型
          item.applyTypeName = item.mapName.name_2
            ? item.mapName.name_2.substring(0, 4)
            : "";
          item.bodyPartsName = item.mapName.name_3; //.substring(0,4)
          item.advicePrompt = item.adviceItemJson.advicePrompt;
          item.quantity = 1;
          arr.push(item);
        }
      }
      this.checkedList = arr;
      this.addPro();
    },
    handleCheckKeShi(list) {
      const roleObj = this.$store.state.user.role;
      // let res = this.$refs.keshitree.getCheckedNodes();
      let res = list;

      this.deptName = roleObj.deptName;

      this.checkedList = [];
      let arr = [];
      res.forEach(item => {
        if (item.itemId) {
          item.sampleTypeCode = item.sampleTypeName;
          item.specimen = item.sampleTypeName;
          // item.itemName = item.itemName
          // item.itemId = item.itemId
          // item.id = item.id
          // 科室和个人模板，id必须唯一，目前先用templetDetailId代替
          item.id = item.templetDetailId;
          // item.unit = item.unit
          item.expectExamTime = this.getNowFormatDate();
          // 单价
          // item.amt = item.amt
          item.isUrgent = 0;
          item.deptName = roleObj.deptName;
          item.deptId = roleObj.deptId;
          item.execDeptName = roleObj.deptName;
          item.execDeptCode = roleObj.deptId;
          item.roleName = getUN();
          item.roleId = roleObj.roleId;
          //检验类型
          // item.applyTypeName = item.mapName.name_2.substring(0,4)
          // debugger
          item.position = item.bodyPartsName;
          item.quantity = 1;
          arr.push(item);
        }
      });
      this.checkedList = arr;
      this.addPro();
    },
    handleCheckGeRen(list) {
      const roleObj = this.$store.state.user.role;
      // let res = this.$refs.gerentree.getCheckedNodes();
      let res = list;

      this.deptName = roleObj.deptName;
      this.checkedList = [];
      let arr = [];
      res.forEach(item => {
        if (item.itemId) {
          item.sampleTypeCode = item.sampleTypeName;
          item.specimen = item.sampleTypeName;
          // item.itemName = item.itemName
          // item.itemId = item.itemId
          // item.id = item.id
          // 科室和个人模板，id必须唯一，目前先用templetDetailId代替
          item.id = item.templetDetailId;
          // item.unit = item.unit
          item.expectExamTime = this.getNowFormatDate();
          // 单价
          // item.amt = item.amt
          item.isUrgent = 0;
          item.deptName = roleObj.deptName;
          item.deptId = roleObj.deptId;
          item.roleName = getUN();
          item.roleId = roleObj.roleId;
          //检验类型
          // item.applyTypeName = item.mapName.name_2.substring(0,4)
          item.position = item.bodyPartsName;
          item.quantity = 1;
          arr.push(item);
        }
      });
      this.checkedList = arr;
      this.addPro();
    },
    // 添加左侧目录到后侧表格
    async addPro() {
      if (!this.receivePatientData.patientId) {
        this.$message.warning("请先选择患者再进行添加！");
        return;
      }

      if (this.checkedList.length === 0) {
        this.$message.warning("请选择检查项");
        return;
      }

      let data = this.checkedList;
      console.log( 111222333,  data);
      //医保审批 弹窗 START
      let itemData = null;
      try {
        itemData = await medicalInsuranceAudit(deepClone(data[0]));
      } catch (error) {
        return;
      }
      data = [itemData];
      //医保审批 弹窗 END

      this.$refs.checkApplyTable.concatTableData(deepClone(data));
      /* this.$refs.checkApplyTable.concatTableData(deepClone(this.checkedList));
      this.checkedList = [];
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.keshitree.setCheckedKeys([]);
      this.$refs.gerentree.setCheckedKeys([]); */
    }
  }
};
</script>
<style lang="scss">
.el-popover {
  padding: 8px;
}
</style>
<style lang="scss" scoped>
.applycontent {
  // display: flex;
  overflow: hidden;
  .cardtitle {
    margin-bottom: 8px;
  }
  .apply-left {
    display: flex;
    flex-direction: column;
    // width: 280px;
    height: 100%;
    padding: 16px;
    // border-right: 1px solid $l-color-bgcolor-11;
    .apply-left-top-search {
      margin-bottom: 8px;
    }
    .apply-left-tabs {
      flex: 1;
      height: 0;
      position: relative;
      .add-pro {
        position: absolute;
        top: 3px;
        right: 0;
        /deep/.el-button--medium {
          padding: 2px 8px;
          height: auto;
        }
      }
    }
  }
  .apply-right {
    // flex: 1;
    // width: 0;
    height: 100%;
    padding: 16px;
    .flex-column-box {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .apply-right-search {
      display: flex;
      align-items: center;
      padding-top: 16px;
      font-size: 0;
      .right-search-left {
        flex: 1;
        display: flex;
        align-items: center;
        width: 0;
        > div {
          margin-right: 8px;
        }
      }
    }
  }

  .tree-content-overflow {
    height: calc(100% - 60px);
    margin-top: 20px;
    overflow-y: auto;
  }

  .scrollheight {
    flex: 1;
    height: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  .total {
    margin-top: 8px;
  }

  /deep/ .el-tabs__header {
    margin: 0 0 0px;
  }
  /deep/ .el-tabs__nav-scroll {
    background-color: #ffffff !important;
  }

  .apply-content-tabs {
    height: 100%;

    /deep/ .el-tabs__header {
      padding: 0 5px;
    }

    /deep/ .el-tabs__content {
      height: calc(100% - 55px);
    }
  }

  .arearowall {
    height: 100%;

    .el-menu-vertical-demo {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      .el-menu-item-group {
        .el-menu-item {
          width: 100%;
          white-space: normal;
          word-break: break-all;
          word-wrap: break-word;
        }

        li {
          width: 100%;
          height: auto;
          line-height: 30px;
        }
      }
    }

    .arearowleft {
      height: 100%;
      padding-top: 10px;
      padding-bottom: 20px;
      border-right: 1px solid $l-color-bgcolor-11;
      overflow: hidden;
      // overflow-y: auto;

      .topseach {
        padding: 0 10px;
        margin: 0 0 15px;

        .el-button--text {
          color: $l-color-fontcolor-3;
        }
      }

      .table-type {
        padding: 0 10px;
        height: 30px;
        font-size: 0;

        span {
          display: inline-block;
          line-height: 30px;
          padding: 0 20px;
          background-color: $l-color-bgcolor-18;
          color: $l-color-fontcolor-4;
          font-size: $l-font-size;
          cursor: pointer;

          &.is-active {
            background-color: $l-color-primary;
            color: $l-color-white;
          }
        }
      }

      .navall {
        width: 100%;
        height: calc(100% - 72px);
        padding: 0 10px;
        overflow: hidden;

        &.shrink {
          height: calc(100% - 280px);
        }

        .navmenu {
          height: 100%;
          border-right: 0;

          .el-menu {
            border-right: 0;
          }

          .el-menu--inline {
            border-bottom: 1px solid $l-color-white;
            background-color: $l-color-bgcolor-18;
          }

          .el-submenu {
            border-bottom: 1px solid $l-color-white;
            background-color: $l-color-bgcolor-18;

            .el-menu-item.is-active {
              background-color: $l-color-bgcolor-12;
              color: $l-color-fontcolor-3;
            }
          }

          .el-menu-item {
            background-color: $l-color-bgcolor-18;
          }

          .el-submenu__icon-arrow {
            display: none;
          }

          .filter-item {
            font-size: 12px;
            display: inline-block;
            -webkit-transition: -webkit-transform 0.3s;
            transition: -webkit-transform 0.3s;
            transition: transform 0.3s;
            transition: transform 0.3s, -webkit-transform 0.3s;
          }

          .el-submenu.is-opened > .el-submenu__title .filter-item {
            transform: rotateZ(90deg);
            -ms-transform: rotate(90deg);
            -moz-transform: rotate(90deg);
            -webkit-transform: rotate(90deg);
          }
        }

        .el-table-column--selection .cell {
          padding-left: 10px;
        }
      }
    }
  }
  .handle-btn-box {
    font-size: 0;
    padding: 16px 0;
    overflow: hidden;
    .el-button {
      height: auto;
      padding: 0;
    }
    .filter-item {
      color: $l-color-fontcolor-3 !important;
    }
  }
  .righttable {
    height: 100%;

    .rightrow {
      height: 100%;
      padding: 0 10px;

      .rigmidtable {
        height: calc(280px);

        .el-table {
          height: 100%;
        }

        margin-bottom: 20px;
      }
      .rigmidtable2 {
        height: calc(600px);

        .el-table {
          height: 100%;
        }

        margin-bottom: 20px;
      }

      .bottomtext {
        width: 100%;
        height: 150px;
        background: $l-color-bgcolor-14;

        /deep/ .el-step__icon.is-icon {
          width: 24px;
          height: 24px;
          border-radius: 12px;
          background: $l-color-bgcolor-14;

          .is-status {
            background: $l-color-primary1;
            color: $l-color-white;
            padding: 2px;
            border-radius: 12px;
          }
        }

        .el-step__head.is-process {
          color: $l-color-primary1;
        }

        .el-step.is-horizontal .is-success .el-step__line {
          background: $l-color-primary1;
        }

        .el-step__title.is-success {
          font-weight: bold;
          color: $l-color-fontcolor-3;
        }
      }
    }
  }
}

.save-template-box {
  position: relative;
  margin-top: 10px;
  padding: 10px;
  /* border: 1px #000000; */
  border: 1px solid #e4e4e4;

  /deep/ .el-form-item {
    margin-bottom: 18px;

    .el-form-item__content {
      height: 36px;
    }
  }

  .allergy-form-btn {
    width: 100%;
    text-align: right;
  }
}

.consultation-step {
  .el-steps {
    padding-left: 20px;
    padding-right: 20px;
  }

  /deep/ .el-step__head.is-success {
    border-color: $l-color-primary;

    .el-step__line {
      background-color: $l-color-primary;
    }

    .el-step__icon-inner.is-status {
      background-color: $l-color-primary;
      border-radius: 12px;
      padding: 2px;
      color: $l-color-white;
    }
  }

  /deep/ .el-step__title {
    color: $l-color-fontcolor-3;
    font-size: $l-font-size;
  }

  /deep/ .el-step__description {
    color: $l-color-fontcolor-4;
    font-size: $l-font-size;
  }

  /deep/ .el-step__head.is-process {
    color: $l-color-primary;
  }
}

.right-search-left {
  margin-right: 200px;

  .el-date-editor {
    margin-right: 7px;
  }

  .el-select {
    margin-right: 7px;
  }
}

.right-search-right {
  line-height: 36px;
  .el-checkbox {
    margin-right: 7px;
  }
}
.state-color {
  color: $l-color-primary;
}
/deep/ .el-date-editor .el-range__close-icon {
  position: static;
}
.his-apply {
  width: 60px;
  height: 4px;
  background-color: $l-color-bgcolor-17;
  margin: 7px 0;
  .his-apply-bar {
    position: relative;
    width: 0;
    height: 100%;
    background-color: $l-color-bgcolor-9;
    .his-apply-circle {
      position: absolute;
      right: -5px;
      top: -3px;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: $l-color-bgcolor-9;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    }
  }
}
.save-template-sel {
  float: none !important;
  margin-left: 20px;
  margin-right: 20px;
  width: 100px;
  height: 36px;
}
.chargeTable {
  /deep/ thead {
    .el-checkbox {
      display: none;
    }
  }
  /deep/ tbody .cell {
    padding: 0;
    .chargeItem {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      border-top: 1px solid $l-color-bgcolor-11;
      &:first-child {
        border-top: 0;
      }
    }
  }
}
/deep/.el-table .freeRpRow {
  color: green;
}
</style>
