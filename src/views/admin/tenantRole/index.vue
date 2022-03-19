
<template>
  <div class="app-container" ref="page">
    <div class="form-table">
      <el-row :gutter="20" style="height:100%">
        <el-col :span="4" style="height:100%;">
          <l-card-title style="margin-top: -15px;">
            <span slot="left">医院</span>
          </l-card-title>
          <el-tree
            :data="hos"
            default-expand-all
            style="height: 350px;overflow-y: auto;margin-left: 20px"
          ></el-tree>
        </el-col>
        <el-col :span="14" style="height:100%;">
          <!-- <l-table
            :pagination="pagination"
            hide-on-single-page="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >-->
          <l-table-form
            :total="pagination.total"
            :pageSize.sync="pagination.pageSize"
            :page.sync="pagination.currentPage"
            @changeSize="changeSize"
            :refresh="true"
          >
            <template slot="table-top-bar">
              <el-input
                placeholder="角色名称"
                v-model="nameValue"
                style="width:150px;"
                class="top-input"
                clearable
                @change="updataTable"
              ></el-input>
              <el-button
                size="mini"
                type="primary"
                class="button top-left-button cursor-pointer"
                icon="el-icon-search"
                @click="updataTable"
              >查询</el-button>
              <el-button
                size="mini"
                class="button top-left-button white-button cursor-pointer"
                icon="el-icon-refresh"
                type="primary"
                @click="resetQuery"
              >刷新</el-button>
              <el-button
                size="mini"
                type="primary"
                class="button top-right-button white-button cursor-pointer"
                icon="el-icon-delete"
                plain
                @click="deleteAllConfirm"
              >删除</el-button>
              <el-button
                type="primary"
                size="mini"
                class="button top-right-button cursor-pointer"
                icon="el-icon-plus"
                @click="addItem"
              >增加</el-button>
            </template>
            <template slot="table-body">
              <el-table
                :data="tableData"
                @selection-change="getRowsIdx"
                border
                highlight-current-row
                style="margin-top:30px;"
                height="420"
                @row-click="handleClick"
              >
                <el-table-column type="selection" width="40px" header-align="center" align="center"></el-table-column>
                <el-table-column
                  type="index"
                  label="序号"
                  width="50px"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column
                  v-for="(item,index) in tableParams"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  header-align="center"
                  align="center"
                >
                  <template slot-scope="scope">
                    <!--操作部分自定义-->
                    <template v-if="item.prop == 'operate'">
                      <el-button
                        @click.stop="editItem(scope.$index, scope.row)"
                        type="text"
                        size="small"
                      >编辑</el-button>
                      <el-button
                        @click.stop="deleteConfirm(scope.$index, scope.row)"
                        type="text"
                        size="small"
                      >删除</el-button>
                    </template>
                    <template v-else>
                      <span>{{ scope.row[item.prop]}}</span>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <!-- </l-table> -->
          </l-table-form>
        </el-col>
        <el-col :span="6">
          <div class="tree_box">
            <div class="tree_box_top">
              <span class="title">角色关联权限</span>
              <span
                style="float: left;color: #4a4b4c;margin-left: 20px; font-weight: 600;font-size: 15px;"
              >{{selectData.name}}</span>
              <el-button type="primary" size="mini" @click="confirmRoleToAuth">保存</el-button>
            </div>
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
            <el-tree
              :data="tdata"
              show-checkbox
              default-expand-all
              :default-checked-keys="raids"
              node-key="id"
              ref="tree"
              highlight-current
              :filter-node-method="filterNode"
              :check-strictly="true"
              :props="defaultProps"
              class="tree-list"
            >
              <span class="custom-tree-node" slot-scope="{node,data}">
                <span>{{node.label}}</span>
                <span style="margin-left:10px;">
                  <div
                    class="showBtn"
                    v-if=" typeof data.id === 'string' "
                  >{{typeof data.id === 'string' ? '功能':""}}</div>
                </span>
              </span>
            </el-tree>
          </div>
        </el-col>
      </el-row>

      <el-dialog
        :visible.sync="dialogVisible"
        :title="dialogType==='edit'?'编辑角色':'新建角色'"
        :before-close="handleClose"
      >
        <el-form :model="role" label-width="80px" label-position="right" ref="role" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="role.name" placeholder="请输入角色名" />
              </el-form-item>
              <el-form-item label="角色编码" prop="code">
                <el-input v-model="role.code" placeholder="请输入角色编码" />
              </el-form-item>
              <el-form-item label="角色类型" prop="rtype">
                <el-select v-model="role.rtype">
                  <el-option label="默认" value="0"></el-option>
                  <el-option label="互联网" value="1"></el-option>
                </el-select>
              </el-form-item>

              <!--<el-form-item label="描述" prop="description">
                                <el-input
                                        v-model="role.description"
                                        :autosize="{ minRows: 2, maxRows: 4}"
                                        type="textarea"
                                        placeholder="请输入角色描述"
                                />
              </el-form-item>-->
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="confirmRole">确认</el-button>
          <el-button type="primary" size="mini" @click="handleClose">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getRoleList,
  removeRole,
  addRole,
  editRole,
  getRoleAuth,
  saveRoleAuth,
} from "@/api/admin/role";
import { getMenuResTree } from "@/api/admin/menu";
import { getHosTree } from "@/api/admin/user";
import isChinese from '@/utils/isChinese';
export default {
  name: "UserAuthManagement",
  components: {
    lTable: () => import("../role/components/LTable.vue"),
    LTableForm: () => import("../role/components/LTableForm.vue"), //,
    //  lDrawer
  },
  data() {
    const validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入角色编码"));
      } else {
        let isChinesess = isChinese(value);
        if (isChinesess) {
          callback(new Error("角色编码不能包含汉字"));
        } else {
          callback();
        }
      }
    };
    return {
      isTree: true,
      hos: [],
      activeName: "first",
      routes: [],
      rolesList: [],
      dialogVisible: false,
      treeVisible: false,
      dialogType: "new",
      checkStrictly: false,
      role: {
        name: "",
        code: "",
        rtype: "",
      },
      seledIds: [],
      nameValue: "",
      filterText: "",
      formParams: [
        {
          label: "角色名称",
          prop: "name",
        },
        {
          label: "角色编码",
          prop: "code",
        },
      ],
      form: {},
      tableParams: [
        {
          prop: "name",
          label: "角色名称",
          width: "10%",
        },
        {
          prop: "code",
          label: "编码",
          width: "15%",
        },
        {
          prop: "rtypename",
          label: "角色类型",
          width: "15%",
        },
        {
          prop: "operate",
          label: "操作",
          width: "15%",
        },
      ],

      tableData: [],
      // 表单数据
      tabs: [
        {
          name: "角色权限",
          key: "form",
          form: {},
          formParams: [
            {
              label: "角色名称",
              prop: "name",
            },
          ],
        },
        {
          name: "菜单",
          key: "tree",
          checkedKeys: [],
        },
      ],
      tabIdx: 0,
      showEditDrawer: false,
      menuTree: [],
      defaultProps: {
        children: "children",
        label: "label",
      },

      // 分页数据
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 1,
        layout: "sizes,prev,pager,next,jumper,total",
      },
      selectData: {},
      tdata: [],
      radata: [],
      role_id: "",
      raids: [],
      data: [],
      show: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, trigger: "blur", validator: validateCode }],
      },
    };
  },
  created() {
    this.getHosTree();
  },
  async mounted() {
    await this.updataTable();
    //  await this.loadToTree();
    //<初始化-树>-这个树只有一次
    getMenuResTree().then((response) => {
      const menuTree = response.data;
      this.radata = menuTree;
    });
  },
  methods: {
    getHosTree() {
      getHosTree().then((res) => {
        if (res.code === 1) {
          console.log("res", res);
          if (res.data.isTree) {
            this.hos = res.data.data;
            // this.isSelect = false;
          } else {
            //   this.isSelect = true;
            // console.log("object", this.isSelect);
            this.hos = res.data.data;
            this.hos.label = this.hos.org_nm;
          }
          //   this.isTree = res.data.isTree;
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    filterNode(value, data, node) {
      if (!value) {
        return true;
      }
      /*//只到四级菜单
    let _node=node.parent;
        let if_one = data.label.indexOf(value) !== -1
        let if_two =_node.data.label && (_node.data.label.indexOf(value) !== -1)
        let if_three = _node.parent && _node.parent.data && _node.parent.data.label && (_node.parent.data.label.indexOf(value) !== -1)
        let if_four=_node.parent&&_node.parent.parent && _node.parent.parent.data && _node.parent.parent.data.label && (_node.parent.parent.data.label.indexOf(value) !== -1)
        let result_one = false;
        let result_two = false;
        let result_three = false;
        let result_four = false;
        node.level===1?result_one=if_one:node.level === 2?result_two = if_one || if_two:node.level === 3?result_three = if_one || if_two || if_three:node.level===4?result_four=if_one || if_two || if_three||if_four:false
        return result_one || result_two || result_three||result_four
        */
      //几级菜单都可使用
      let _array = [];
      this.getReturnNode(node, _array, value);
      let result = false;
      _array.forEach((item) => {
        result = result || item;
      });
      return result;
    },
    getReturnNode(node, _array, value) {
      let isPass =
        node.data && node.data.label && node.data.label.indexOf(value) !== -1;
      isPass ? _array.push(isPass) : "";
      this.index++;
      console.log(this.index);
      if (!isPass && node.level != 1 && node.parent) {
        this.getReturnNode(node.parent, _array, value);
      }
    },
    changeTab() {},
    // 加载解析功能tree
    async loadToTree() {
      // let menus = [{"id": "ef6791666b636d44016b64335c500029","name": "用户管理","parentId": "ff8080816b548350016b548e3d860002","url": "/auth/user","funcId": "ef6791666b636d44016b642330b40022","createdAt": "2019-06-17 14:50:16","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-17 15:00:51"},{"id": "ef6791666b636d44016b63f2f3540011","name": "功能管理","parentId": "ff8080816b548350016b548e3d860002","url": "/manage/func","funcId": "ef6791666b636d44016b637560170003","createdBy": "ff8080816b4eb700016b4eb700fa0000","createdByName": "1001","createdAt": "2019-06-17 13:39:54","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-17 13:43:02"},{"id": "ef6791666b636d44016b643580e0002c","name": "配置中心","parentId": "ff8080816b548350016b548e3d860002","url": "/manage/settings","funcId": "ef6791666b636d44016b6434f378002b","createdAt": "2019-06-17 14:52:36","updatedAt": "2019-06-17 14:52:36"},{"id": "ef6791666b636d44016b643c3e670031","name": "配置","url": "/setting","funcId": "0                               ","createdBy": "ff8080816b4eb700016b4eb700fa0000","createdByName": "1001","createdAt": "2019-06-17 14:59:58","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-17 15:00:12"},{"id": "ef6791666b636d44016b642a3b440028","name": "模块注册","parentId": "ff8080816b548350016b548e3d860002","url": "/manage/settingModulesConfig","funcId": "ef6791666b636d44016b64287e8e0026","createdBy": "ff8080816b4eb700016b4eb700fa0000","createdByName": "1001","createdAt": "2019-06-17 14:40:17","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-17 14:49:57"},{"id": "ef6791666b636d44016b643cce6e0032","name": "配置中心","parentId": "ef6791666b636d44016b643c3e670031","url": "/setting/settings","funcId": "ef6791666b636d44016b6434f378002b","createdAt": "2019-06-17 15:00:35","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-17 15:18:56"},{"id": "ef6791666b636d44016b643f6eda0036","name": "模块注册","parentId": "ef6791666b636d44016b643c3e670031","url": "/setting/settingModulesConfig","funcId": "ef6791666b636d44016b64287e8e0026","createdBy": "ff8080816b4eb700016b4eb700fa0000","createdByName": "1001","createdAt": "2019-06-17 15:03:27","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-17 15:03:27"},{"id": "ef6791666b636d44016b6485e7cd003e","name": "基础","url": "/base","funcId": "0                               ","createdBy": "ff8080816b4eb700016b4eb700fa0000","createdByName": "1001","createdAt": "2019-06-17 16:20:25","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-17 16:20:25"},{"id": "ef6791666b636d44016b6486c90a003f","name": "房间管理","parentId": "ef6791666b636d44016b6485e7cd003e","url": "/RoomManagement","funcId": "ef6791666b636d44016b6484cfe1003d","createdBy": "ff8080816b4eb700016b4eb700fa0000","createdByName": "1001","createdAt": "2019-06-17 16:21:23","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-17 16:36:36"},{"id": "ef6791666b5a3922016b5a5080cc0005","name": "菜单管理","parentId": "ff8080816b548350016b548e3d860002","url": "/manage/menu","funcId": "ef6791666b636d44016b6375decf0004","createdAt": "2019-06-15 16:45:53","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-17 13:43:17"},{"id": "ef6791666b5a3922016b5a50c4f10006","name": "角色权限管理","parentId": "ff8080816b548350016b548e3d860002","url": "/manage/role","funcId": "ef6791666b636d44016b63763fb10005","createdAt": "2019-06-15 16:46:11","updatedAt": "2019-06-17 11:48:37"},{"id": "ef6791666b5a3922016b5a4a57d10003","name": "用户管理2","parentId": "ef6791666b5a3922016b5a3922ae0000","url": "/user-manager2","createdAt": "2019-06-15 16:39:10","updatedAt": "2019-06-15 16:39:10"},{"id": "ff8080816b548350016b548e3d860002","code": "string    ","name": "系统","type": "1","status": "1","url": "/system","funcCode": "0","funcId": "0                               ","hospitalId": "1                               ","hospitalName": "弋矶山","orgId": "1                               ","orgName": "1","createdAt": "2019-06-14 13:55:36","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-17 14:40:06","dataVersion": 0,"deletedStatus": "1"},{"id": "ef6791666b636d44016b68a0cd5d004b","name": "配置注册","parentId": "ef6791666b636d44016b643c3e670031","url": "/setting/SettingRegist","funcId": "ef6791666b636d44016b68a030be004a","createdBy": "ff8080816b4eb700016b4eb700fa0000","createdByName": "1001","createdAt": "2019-06-18 11:28:17","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-18 11:28:17"},{"id": "ef6791666b636d44016b69afc115005b","name": "药房药库系统维护","url": "/hrp/system","funcId": "0                               ","createdBy": "ff8080816b4eb700016b4eb700fa0000","createdByName": "1001","createdAt": "2019-06-18 16:24:14","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-18 16:24:36"},{"id": "ef6791666b636d44016b69adf8890058","name": "系统维护","parentId": "ef6791666b636d44016b69ad9e2c0057","url": "/hrp/system","funcId": "0                               ","createdBy": "ff8080816b4eb700016b4eb700fa0000","createdByName": "1001","createdAt": "2019-06-18 16:22:17","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-18 16:22:17"},{"id": "ef6791666b636d44016b69ab3a000056","name": "系统维护","parentId": "ef6791666b636d44016b69aac1a10055","url": "/hrp/system/","funcId": "0                               ","createdBy": "ff8080816b4eb700016b4eb700fa0000","createdByName": "1001","createdAt": "2019-06-18 16:19:17","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-18 16:19:17"},{"id": "ef6791666b636d44016b69b023a5005c","name": "节假日维护","parentId": "ef6791666b636d44016b69afc115005b","url": "/hrp/system/PubHolArr","funcId": "ef6791666b636d44016b69a9c0c20053","createdBy": "ff8080816b4eb700016b4eb700fa0000","createdByName": "1001","createdAt": "2019-06-18 16:24:39","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-18 16:25:38"},{"id": "ef6791666b636d44016b69aee8ca0059","name": "药房药库系统维护","parentId": "ef6791666b636d44016b69aa58a90054","url": "/hrp/system","funcId": "0                               ","createdBy": "ff8080816b4eb700016b4eb700fa0000","createdByName": "1001","createdAt": "2019-06-18 16:23:18","updatedBy": "ff8080816b4eb700016b4eb700fa0000","updatedByName": "1001","updatedAt": "2019-06-18 16:23:18"}]
      let menus = [];
      let map = {};
      let menuTree = [];
      for (let menu of menus) {
        map[menu.id] = menu;
        menu.children = menu.children || [];
        if (!menu.parentId) {
          menuTree.push(menu);
        }
      }
      for (let menu of menus) {
        let parent = map[menu.parentId];
        if (parent) {
          parent.children.push(menu);
        }
      }
      this.menuTree = menuTree;
    },
    //从接口获取数据
    async updataTable() {
      let params = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        name: this.nameValue,
      };
      console.log("params******************", params);
      getRoleList(params).then((res) => {
        console.log(res);
        let data = res.data;
        data.map((val) => {
          if (val.rtype == "0") {
            val.rtypename = "默认";
          } else if (val.rtype == "1") {
            val.rtypename = "互联网";
          } else {
            val.rtypename = "";
          }
        });
        this.tableData = data;
        this.pagination.currentPage = res.pageNo;
        this.pagination.pageSize = res.pageSize;
        this.pagination.total = res.total;
      });
    },

    async resetQuery() {
      this.nameValue = "";
      await this.updataTable();
    },

    // 更新菜单树选中的节点
    updateTreeCheckedKeys(keys) {
      keys = keys || [];
      let tabs = [...this.tabs];
      tabs[1].checkedKeys = keys;
      this.tabs = tabs;
    },
    addItem() {
      /* this.showEditDrawer = true;
          this.updateTreeCheckedKeys([]);
          let tabs = [...this.tabs];
          tabs[0].form = {};
          this.tabs = tabs;*/
      this.dialogVisible = true;
      this.dialogType = "new";
      this.role = { rtype: "0" };
    },
    async editItem(index, row) {
      this.dialogVisible = true;
      this.dialogType = "edit";
      this.role = { ...row };
      console.log(row);
    },

    async saveItem() {},

    async cancel() {
      this.showEditDrawer = false;
    },

    async saveMenu() {
      let form = this.tabs[0].form;
      if (!form.id) {
        this.$message({
          type: "warning",
          message: "请先保存表单信息",
        });
        return;
      }
    },
    deleteConfirm(rowIndex, row) {
      console.log(row);
      console.log([row.id]);
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.seledIds = [row.id];
          this.deleteItems();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 删除数组
    deleteAllConfirm() {
      if (this.seledIds.length != 0) {
        this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.deleteItems();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
        this.$alert("请正确选择需要操作的记录！", "警告", {
          confirmButtonText: "确定",
        });
      }
    },

    async deleteItems() {
      let list = [];
      for (let index of this.seledIds) {
        list.push(index);
      }
      removeRole(list).then((res) => {
        if (res.code === 1) {
          //
          this.updataTable();
        }
      });
    },

    // 记录选中行
    getRowsIdx(rows) {
      let ids = [];
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        ids.push(item.id);
      }
      this.seledIds = ids;
    },
    // 切换到某页
    // handleSizeChange(val, param) {
    //   this.pagination.pageSize = val;
    //   this.updataTable();
    // },
    // // 翻页
    // handleCurrentChange(val, param) {
    //   this.pagination.currentPage = val;
    //   this.updataTable();
    // },
    changeSize(val) {
      console.log("val", val);
      this.pagination.currentPage = val.page;
      this.pagination.pageSize = val.pageSize;
      this.updataTable();
    },

    confirmRole() {
      this.$refs["role"].validate((valid) => {
        if (!valid) return;
        if (!this.role.id) {
          addRole(this.role).then((res) => {
            if (res.code === 1) {
              this.dialogVisible = false;
              this.$message({
                message: "数据添加成功",
                type: "success",
              });
              this.updataTable();
            } else {
              this.$message({
                message: "数据添加失败",
                type: "error",
              });
            }
            //this.$refs.form.resetFields();
            this.role = {};
          });
        } else {
          editRole(this.role).then((res) => {
            if (res.code === 1) {
              this.dialogVisible = false;
              this.$message({
                message: "数据修改成功",
                type: "success",
              });
              this.updataTable();
            } else {
              this.$message({
                message: "数据修改失败",
                type: "error",
              });
            }
            /* this.$refs['role'].resetFields();*/
            this.role = {};
          });
        }
        this.show = false;
      });
    },
    handleClick(row) {
      this.selectData = row;
      this.authToRole(row);
    },

    // 点击角色关联权限
    authToRole(row) {
      //不这样就有上次的记忆
      this.filterText = "";
      this.raids = [];
      this.tdata = [];
      for (let i = 0; i < this.radata.length; i++) {
        this.tdata.push(this.radata[i]);
      }
      console.log("tdata", this.tdata);
      //这里请求权限树

      //
      this.role_id = row.id;
      getRoleAuth(row).then((res) => {
        console.log("****", res);
        this.raids = res.data;
      });
    },
    // 角色关联权限确认按钮
    confirmRoleToAuth() {
      let params_ = {
        rid: this.role_id,
        aids: this.$refs.tree.getCheckedKeys(),
      };
      //
      saveRoleAuth(params_).then((response) => {
        this.$message({
          message: "保存成功",
          type: "success",
        });
        // this.$refs["role"].resetFields();
      });
    },
    /*checkChange(item, node, self){
          console.log(item)
          if (node == true) {//点击未选中复选框
              this.role.deptId = item.id;
              this.role.deptName = item.label
              this.$refs.tree.setCheckedKeys([item.id]);
          } else {
              if (this.role.deptId == item.id) {//点击已选中复选框，保证至少一个选中
                  this.$refs.tree.setCheckedKeys([item.id]);
              }
          }
      },
      nodeClick(item, node, self){
          this.role.deptId = item.id;
          this.role.deptName = item.label;
          this.$refs.tree.setCheckedKeys([item.id]);
      },*/
    handleClose() {
      this.dialogVisible = false;
      this.$refs["role"].resetFields();
    },
    handleClose1() {
      let arr = [];
      this.treeVisible = false;
      this.raids = [...arr];
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 0px !important;
  height: 100%;
  overflow: hidden;
  // background-color: #ffffff;
}
.form-table {
  height: 100%;
}
.el-button--mini {
  border-radius: 0;
}
.el-dialog__wrapper .el-dialog {
  height: 400px;
}

.el-form {
  margin: 20px 0;
}
.el-form-item--medium {
  margin: 10px 0;
}
.form-table {
  width: 100%;
}
.top-input {
  margin-right: 3px;
}
.top-left-button {
  margin-left: 10px;
  margin-right: 3px;
}
.top-right-button {
  float: right;
  margin-right: 5px;
}
.station {
  width: 55px;
  color: white;
  border-radius: 15px;
  text-align: center;
  vertical-align: middle;
}
.operate-btn {
  display: inline-block;
  margin-right: 10px;
}
.edit-form {
  padding-top: 20px;
}
.form-input {
  width: 150px;
}
.btn-container {
  margin: 20px 0;
}
/deep/.el-tabs__nav-wrap::after {
  background-color: transparent;
}
/deep/.el-tabs__item {
  border-radius: 15px;
  text-align: center;
  width: 96px;
  padding: 0;
  line-height: 30px;
  height: 30px;
  &:hover {
    color: #303133;
  }
}
/deep/.el-tabs__item.is-active {
  background-color: #ff6a00;
  color: #ffffff;
}
/deep/.el-tabs__active-bar {
  background-color: transparent;
}
.tree_dialog /deep/.el-dialog__body {
  height: 400px;
  /*max-height: 500px;*/
  /*overflow-y: auto;*/
}
.el-tree {
  // max-height: 300px;
  // overflow-y: auto;
}

.showBtn {
  padding: 2px 5px;
  border: 1px solid $l-color-primary;
  color: $l-color-primary;
  display: inline-block;
  margin-right: 10px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 13px;
}

// style="height:400px;overflow-y:auto"
/deep/.el-dialog__body {
  height: 360px;
  overflow-y: auto;
  /deep/.el-input--medium {
    width: 300px;
  }
}
/deep/.el-form-item__error {
  position: static !important;
}
/deep/.el-pagination {
  /deep/.el-input__inner {
    height: 28px !important;
  }
}

.el-row {
  /deep/.el-col-14 {
    background: #fff;
    padding: 20px !important;
    width: 52%;
  }
  /deep/.el-col-4 {
    background: #fff;
    padding: 20px !important;
    width: 16.8%;
    margin-right: 1.2%;
  }
  /deep/.el-col-6 {
    background: #fff;
    height: 100%;
    padding: 20px !important;
    width: 29%;
    margin-left: 1%;
  }
}
.tree-list {
  // border: 1px solid #dcdfe6;
  height: 85%;
  overflow: auto;
}
.tree_box {
  height: 100%;
  padding-bottom: 20px;
}
.tree_box_top {
  text-align: right;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
.title {
  float: left;
  font-size: 16px;
  font-weight: 600;
  color: #4a4b4c;
}
/deep/.el-dialog__body {
  padding-left: 20px;
}
</style>
