<template>
  <!-- 病历处方 - 电子申请 -->
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
              v-model="filterText"
              v-if="activeName == 'first'"
              placeholder="输入关键词进行检索"
            ></el-input>
            <el-input
              v-model="filterTextKeShi"
              v-if="activeName == 'second'"
              placeholder="输入关键词进行检索"
            ></el-input>
            <el-input
              v-model="filterTextGeRen"
              v-if="activeName == 'third'"
              placeholder="输入关键词进行检索"
            ></el-input>
          </l-formt-title>

          <div class="apply-left-tabs">
            <el-tabs
              class="height100"
              v-model="activeName"
              @tab-click="changeTabClick"
            >
              <el-tab-pane label="目录" name="first">
                <el-col
                  :span="24"
                  class="tree-content-overflow tree-content-overflow-ml"
                >
                  <!-- :default-expanded-keys="[1, 2, 3]"
            default-expand-all-->
                  <el-tree
                    ref="tree"
                    :data="treedata"
                    class="filter-tree"
                    node-key="id"
                    :props="defaultProps"
                    lazy
                    :filter-node-method="filterNode"
                    :expand-on-click-node="true"
                    :load="loadNode"
                  >
                    <!-- @check="handleCheck" show-checkbox -->
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <el-popover
                        v-if="data.adviceItemJson"
                        placement="right-start"
                        width="500"
                        trigger="hover"
                        @show="clickHandle(node, data)"
                        :popper-class="'popperClass popperClass' + data.id"
                      >
                        <div style="font-weight: 700; font-size: 14px">
                          {{ node.label }}
                        </div>
                        <div>项目明细：</div>
                        <div
                          v-for="(v, k) in data.adviceItemJson.chargeList"
                          :key="k"
                          style="display: flex; justify-content: space-between"
                        >
                          <span style="width: 300px">{{
                            v.chargeItemName
                          }}</span>
                          <span style="width: 80px">{{ v.spec }}</span>
                          <span style="min-width: 80px"
                            >单价：{{ v.price || 0 }}</span
                          >
                          <span style="min-width: 80px" v-if="v.itemQuantity"
                            >数量：{{ v.itemQuantity }}</span
                          >
                        </div>
                        <span
                          slot="reference"
                          @dblclick="handleCheck([node.data])"
                          >{{ node.label }}</span
                        >
                      </el-popover>
                      <span v-else @dblclick="handleCheck([node.data])">{{
                        node.label
                      }}</span>
                    </span>
                  </el-tree>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="科室模板" name="second">
                <el-col :span="24" class="tree-content-overflow">
                  <el-tree
                    ref="keshitree"
                    :data="keshiTemList"
                    class="filter-tree"
                    node-key="templetDetailId"
                    :props="keshiProps"
                    default-expand-all
                    :filter-node-method="keshifilterNode"
                    :expand-on-click-node="true"
                  >
                    <!-- @check="handleCheckKeShi" show-checkbox -->
                    <span class="custom-tree-node" slot-scope="{ node }">
                      <el-popover
                        v-if="node.data.adviceItemJson"
                        placement="right-start"
                        width="400"
                        trigger="hover"
                      >
                        <div style="font-weight: 700; font-size: 14px">
                          {{ node.label }}
                        </div>
                        <div>项目明细：</div>
                        <div
                          v-for="(v, k) in node.data.adviceItemJson.chargeList"
                          :key="k"
                          style="display: flex; justify-content: space-between"
                        >
                          <span style="width: 300px">{{
                            v.chargeItemName
                          }}</span>
                          <span style="width: 80px">{{ v.spec }}</span>
                          <span>单价：{{ v.price || 0 }}</span>
                          <span v-if="v.itemQuantity"
                            >数量：{{ v.itemQuantity }}</span
                          >
                        </div>
                        <span
                          slot="reference"
                          @dblclick="handleCheckKeShi([node.data])"
                          >{{ node.label }}</span
                        >
                      </el-popover>
                      <span v-else @dblclick="handleCheckKeShi([node.data])">{{
                        node.label
                      }}</span>
                    </span>
                  </el-tree>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="个人模板" name="third">
                <el-col :span="24" class="tree-content-overflow">
                  <el-tree
                    ref="gerentree"
                    :data="gerenTemList"
                    class="filter-tree"
                    node-key="templetDetailId"
                    :props="keshiProps"
                    default-expand-all
                    :filter-node-method="keshifilterNode"
                    :expand-on-click-node="true"
                  >
                    <!-- @check="handleCheckGeRen" show-checkbox -->
                    <span class="custom-tree-node" slot-scope="{ node }">
                      <el-popover
                        v-if="node.data.adviceItemJson"
                        placement="right-start"
                        width="400"
                        trigger="hover"
                      >
                        <div style="font-weight: 700; font-size: 14px">
                          {{ node.label }}
                        </div>
                        <div>项目明细：</div>
                        <div
                          v-for="(v, k) in node.data.adviceItemJson.chargeList"
                          :key="k"
                          style="display: flex; justify-content: space-between"
                        >
                          <span style="width: 300px">{{
                            v.chargeItemName
                          }}</span>
                          <span style="width: 80px">{{ v.spec }}</span>
                          <span>单价：{{ v.price || 0 }}</span>
                          <span v-if="v.itemQuantity"
                            >数量：{{ v.itemQuantity }}</span
                          >
                        </div>
                        <span
                          slot="reference"
                          @dblclick="handleCheckGeRen([node.data])"
                          >{{ node.label }}</span
                        >
                      </el-popover>
                      <span v-else @dblclick="handleCheckGeRen([node.data])">{{
                        node.label
                      }}</span>
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
              <ApplyList
                ref="applyList"
                v-if="yhpzName === 'yhgl'"
                @loadGeRenTable="loadGeRenTable"
                @loadTable="loadTable"
              ></ApplyList>
            </el-tab-pane>
            <el-tab-pane label="历史申请" name="pzgl">
              <ApplyHistory v-if="yhpzName === 'pzgl'"></ApplyHistory>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </split-pane>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import ApplyHistory from "./ApplyHistory";
import ApplyList from "./ApplyList";

import { deepClone } from "@/utils/index";
import { getUN } from "@/utils/crypto";
import { getByTypeAndName } from "@/api/cis/toolBox/toolBox";
import {
  getListByAdviceCategory,
  getListByAdviceCategoryDetai,
} from "@/api/systemManagement/dataMaintain/adviceItem";
import mixins from "../mixins/Apply.js";
import { beforeLeaveConfirm } from "@/views/public/electronApply/component/eleUtils.js";

export default {
  name: "apply",
  mixins: [mixins],
  components: { ApplyList, ApplyHistory },
  data() {
    return {
      activeName: "first",
      yhpzName: "yhgl",
      treedata: [],
      checkedList: [],
      filterText: "",
      filterTextKeShi: "",
      filterTextGeRen: "",
      defaultProps: {
        children: "children",
        label: "catalogName",
        isLeaf: "leaf",
      },
      keshiTemList: [],
      gerenTemList: [],
      keshiProps: {
        children: "templetDetail",
        label: "itemName",
      },
    };
  },
  computed: {
    // 获取登录用户信息
    ...mapGetters("user", ["name", "role"]),
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
    },
  },
  created() {
    this.getListByAdviceCategory();
    this.loadTable();
    this.loadGeRenTable();
  },
  /**
   * 一级事件
   * 1.切换目录与模板页签(changeTabClick){将三个页签的树结构都置为非选中状态}
   * 2.左侧树结构鼠标悬浮事件(clickHandle){请求本条数据详细数据，并进行展示}
   * 3.目录树关键字搜索事件(filterNode){搜索关键字过滤目录树数据}
   * 4.科室模板树关键字搜索事件(filterNode){搜索关键字过滤科室模板树数据}
   * 5.目录树懒加载(loadNode){1.懒加载方法}
   * 6.目录树多选框勾选事件(handleCheck，handleCheckKeShi，handleCheckGeRen){勾选或者取消勾选，处理勾选的数据}
   * 7.左侧树添加按钮事件(addPro){将左侧处理后的数据添加到右侧表格中}
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
                resolve();
              } else {
                resolve();
              }
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
    // 检验申请 未提交的数据 外部组件使用
    getNewSelectedList (){
      console.log("执行了3");
      return this.$refs.applyList.getNewSelectedList();
    },
    // 检验申请 提交 函数  外部组件使用
    applicationSub (){
      return new Promise(async (resolve, reject) => {
        try {
          await this.$refs.applyList.applicationSub();
          resolve(true);
        } catch (error) {
          console.log("报错了1");
          reject (false)
        }
      }) 
    },
    resize() {},
    //切换目录与模板的tab
    changeTabClick() {},
    // 左侧树悬浮显示明细
    async clickHandle(node, data) {
      if (
        data.adviceItemJson.hasOwnProperty("chargeList")
      ) {
        return;
      }
      this.chargeListLoading = true;
      let params = {
        itemIds: data.itemId,
      };
      try {
        let detailsRes = await getListByAdviceCategoryDetai(params);
        if (detailsRes.code === 1 && detailsRes.data.length === 1) {
          this.$set(data.adviceItemJson, "chargeList", [
            ...detailsRes.data[0].chargeList,
          ]);
        }
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
        (data.pY && data.pY.indexOf(value) !== -1) ||
        (data.simplePY && data.simplePY.indexOf(value) !== -1)
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
      json.adviceCategorys = "1"; // 0检查 1检验
      json.type = "item"; // 带上医嘱项
      json.source = "0"; // 门诊0 住院1
      getListByAdviceCategory(json).then(async (res) => {
        if (res.code === 1) {
          let resData = res.data;
          await this.forCircleDataInit(resData, 1);
          this.treedata = resData;
          console.log("this.treedata", this.treedata);
          let data1 = new Date().getTime();
          let data2 = 0;
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
              this.$nextTick(async () => {
                data2 = new Date().getTime();
                console.log("目录树结构渲染时间（毫秒）", data2 - data1);
              });
            });
          });
        } else {
          this.$message.error("查询失败");
        }
      });
    },
    // 加载科室模板数据
    async loadTable() {
      try {
        let params = {
          type: 1, // 1科室 2个人
          itemCat: 6,
          name: "",
          pageNum: 1,
          pageSize: 200,
        };
        let response = await getByTypeAndName(params);
        response.data.forEach((item) => {
          item.itemName = item.templetName;
          // item.id = item.templetDetailId
        });
        if (response.pageNo === 1) {
          this.keshiTemList = response.data;
          console.log("加载科室模板数据", response.data);
        } else {
          this.keshiTemList = this.keshiTemList.concat(response.data);
        }
      } catch (error) {}
    },
    // 加载个人模板数据
    async loadGeRenTable() {
      try {
        let params = {
          type: 2, // 1科室 2个人
          itemCat: 6,
          name: "",
          pageNum: 1,
          pageSize: 200,
        };
        let response = await getByTypeAndName(params);
        response.data.forEach((item) => {
          item.itemName = item.templetName;
        });
        if (response.pageNo === 1) {
          this.gerenTemList = response.data;
          console.log("加载科室模板数据", response.data);
        } else {
          this.gerenTemList = this.gerenTemList.concat(response.data);
        }
      } catch (error) {}
    },
    // 左侧目录树check事件
    async handleCheck(list) {
      this.deptName = this.$store.state.user.role.deptName;
      // let checkedNodes = this.$refs.tree.getCheckedNodes();
      let checkedNodes = list;
      this.checkedList = [];
      let arr = [];
      let res = checkedNodes.filter((item) => {
        return item.hasOwnProperty("itemId");
      });
      // console.log("res_+_+_+", res);
      // return
      res = await this.getDetails(res);
      console.log("res_+_+_+", res);

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
              let itemAmt = itemdata.price * (itemdata.itemQuantity || 0);
              myprice = Number(itemAmt) + Number(myprice);
              console.log(myprice);
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
          item.deptName = this.$store.state.user.role.deptName;
          item.deptId = this.$store.state.user.role.deptId;
          item.execDeptName = this.$store.state.user.role.deptName;
          item.execDeptCode = this.$store.state.user.role.deptId;
          item.roleName = getUN();
          item.roleId = this.$store.state.user.role.roleId;
          //检查类型
          item.applyTypeName = item.mapName.name_2
            ? item.mapName.name_2.substring(0, 4)
            : item.mapName.name_1;
          item.advicePrompt = item.adviceItemJson.advicePrompt;
          item.quantity = 1;
          arr.push(item);
        }
      }
      this.checkedList = arr;
      console.log("handleCheck-this.data.checkedList", this.checkedList);
      this.addPro();
    },
    handleCheckKeShi(list) {
      this.deptName = this.$store.state.user.role.deptName;
      // let res = this.$refs.keshitree.getCheckedNodes();
      let res = list;
      console.log("handleCheck-res", res);
      this.checkedList = [];
      let arr = [];
      res.forEach((item) => {
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
          item.deptName = this.$store.state.user.role.deptName;
          item.deptId = this.$store.state.user.role.deptId;
          item.execDeptName = this.$store.state.user.role.deptName;
          item.execDeptCode = this.$store.state.user.role.deptId;
          item.roleName = getUN();
          item.roleId = this.$store.state.user.role.roleId;
          item.advicePrompt = item.advicePrompt || "";
          //检验类型
          // item.applyTypeName = item.mapName.name_2.substring(0,4)
          item.quantity = 1;
          arr.push(item);
        }
      });
      this.checkedList = arr;
      console.log("handleCheck-this.data.checkedList", this.checkedList);
      this.addPro();
    },
    handleCheckGeRen(list) {
      this.deptName = this.$store.state.user.role.deptName;
      // let res = this.$refs.gerentree.getCheckedNodes();
      let res = list;
      console.log("handleCheck-res", res);
      this.checkedList = [];
      let arr = [];
      res.forEach((item) => {
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
          item.deptName = this.$store.state.user.role.deptName;
          item.deptId = this.$store.state.user.role.deptId;
          item.execDeptName = this.$store.state.user.role.deptName;
          item.execDeptCode = this.$store.state.user.role.deptId;
          item.roleName = getUN();
          item.roleId = this.$store.state.user.role.roleId;
          item.advicePrompt = item.advicePrompt || "";
          //检验类型
          // item.applyTypeName = item.mapName.name_2.substring(0,4)
          item.quantity = 1;
          arr.push(item);
        }
      });
      this.checkedList = arr;
      console.log("handleCheck-this.data.checkedList", this.checkedList);
      this.addPro();
    },
    // 添加左侧目录到后侧表格
    addPro() {
      this.$refs.applyList.addPro(deepClone(this.checkedList));
      /* this.checkedList = [];
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.keshitree.setCheckedKeys([]);
      this.$refs.gerentree.setCheckedKeys([]); */
    },
  },
};
</script>
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
    // padding-top: 0;
  }

  .tree-content-overflow {
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
  /deep/ .el-tabs__nav-scroll {
    background-color: #ffffff !important;
  }
}
</style>
