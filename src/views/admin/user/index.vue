<template>
  <div class="app-container" ref="page">
    <el-row :gutter="20" style="height: 100%">
      <el-col :span="5" style="height: 100%">
        <left-bar @_handleSelect="handleSelect" :isReset.sync="isReset" />
      </el-col>
      <el-col :span="14" style="height: 100%">
        <div class="btn_group">
          <el-form :inline="true" :model="form" ref="form">
            <el-form-item label>
              <el-input
                v-model="form.name"
                placeholder="请输入姓名/拼音/五笔"
              ></el-input>
            </el-form-item>
            <el-form-item label>
              <el-input
                v-model="form.userNo"
                placeholder="请输入员工编号"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-search"
                @click="handleQuery"
                >搜索</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                size="mini"
                icon="el-icon-refresh"
                type="primary"
                @click="handleReset"
                >刷新</el-button
              >
            </el-form-item>
          </el-form>
          <div class="action_group">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="handleAdd"
              >添加</el-button
            >
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-delete"
              @click="handleRemove"
              v-hasButton="['tetButton', 'testButton']"
              >删除</el-button
            >
          </div>
        </div>
        <user-table
          :list.sync="list"
          @selectionChange="handleSelectionChange"
          @editRow="handleEdit"
          @removeRow="handleDelete"
          @editStatus="handleEditStatus"
          @clickChange="handleuserInfo"
        />
        <div class="page">
          <pagination
            v-show="total > 0"
            :total="total"
            :pageSize.sync="form.pageSize"
            :page.sync="form.page"
            @pagination="changeSize"
          />
        </div>
      </el-col>
      <el-col :span="5" style="height: 100%" class="el_right">
        <l-card-title style="margin-top: -15px">
          <span slot="left">用户信息</span>
        </l-card-title>
        <div class="content">
          <div class="list">
            <span class="listTitle">员工编号 :</span>
            <span>{{ userInfo.userNo }}</span>
          </div>
          <div class="list">
            <span class="listTitle">
              姓
              <span style="padding: 0 14px"></span>名 :
            </span>
            <span>{{ userInfo.name }}</span>
          </div>
          <div class="list">
            <span class="listTitle">
              性
              <span style="padding: 0 14px"></span>别 :
            </span>
            <span>{{
              userInfo.gender === "M"
                ? "男"
                : userInfo.gender === "W"
                ? "女"
                : ""
            }}</span>
          </div>
          <div class="list">
            <span class="listTitle">
              年
              <span style="padding: 0 14px"></span>龄 :
            </span>
            <span>{{ userInfo.age }}</span>
          </div>
          <div class="list">
            <span class="listTitle">员工类型 :</span>
            <span
              :val="userInfo.workType"
              code="EmployeeMark"
              v-codeTransform
              v-if="userInfo.workType"
            ></span>
            <span v-else></span>
          </div>
          <div class="list">
            <span class="listTitle">
              职
              <span style="padding: 0 14px"></span>称 :
            </span>
            <span
              v-if="userInfo.title"
              :val="userInfo.title"
              code="doctorProfessionalTitle"
              v-codeTransform
            ></span>
          </div>
          <div class="list">
            <span class="listTitle">手术级别 :</span>
            <span
              v-if="userInfo.operationLevel"
              :val="userInfo.operationLevel"
              code="SurgicalGrade"
              v-codeTransform
            ></span>
          </div>
          <div class="list">
            <span class="listTitle">处 方 权 :</span>
            <span>{{
              userInfo.prescribe == "Yes"
                ? "是"
                : userInfo.prescribe == "No"
                ? "否"
                : ""
            }}</span>
          </div>
          <div class="list">
            <span class="listTitle">
              状
              <span style="padding: 0 14px"></span>态 :
            </span>
            <span>{{
              userInfo.status == 0 ? "启动" : userInfo.status == 1 ? "禁用" : ""
            }}</span>
          </div>
          <div class="list rolelist">
            <span class="listTitle">所属医院 :</span>
            <div :class="hos.length > 0 ? 'hanveInfo' : ''">
              <!-- <span v-for="(item,index) in hos" :key="index">{{item.hosNm}},</span> -->
              <div>{{ hos.map((item) => item.hosNm).join(",") }}</div>
            </div>
          </div>
          <div class="list rolelist">
            <span class="listTitle">
              账
              <span style="padding: 0 14px"></span>户 :
            </span>
            <div :class="accout.length > 0 ? 'hanveInfo' : ''">
              <!-- <span v-for="(item, index) in accout" :key="index"
                >{{ item.userName }},</span
              > -->

              <span>{{ accout.map((item) => item.userName).join(",") }}</span>
            </div>
          </div>
          <div class="list rolelist">
            <span class="listTitle">
              权
              <span style="padding: 0 14px"></span>限 :
            </span>
            <div :class="power.length > 0 ? 'hanveInfo' : ''">
              <!-- <div v-for="(item, index) in power" :key="index">
                {{ item.roleName }}-{{ item.deptName }},
              </div> -->
              <div>
                {{
                  power
                    .map((item) => `${item.roleName}-${item.deptName}`)
                    .join(",")
                }}
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogType === 'edit' ? '编辑用户' : '新建用户'"
      class="form_dialog"
      :before-close="handleClose"
    >
      <el-tabs
        v-model="activeName"
        type="card"
        @tab-click="handleClick"
        v-if="dialogType === 'edit'"
        style="padding-bottom: 0"
      >
        <el-tab-pane label="用户基本信息" name="user">
          <keep-alive>
            <user-infor
              @userSubmit="handleSubmit"
              :userForm.sync="userForm"
              @handleHosData="handleHosData"
              :hosNames.sync="hos"
              @handleisShowTip="handleisShowTip"
              :isShowTip.sync="isShowTip"
              @userClose="handleClose"
            />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane
          label="用户简介"
          name="userIntroduct"
          style="margin-bottom: 20px"
        >
          <keep-alive>
            <div>
              <user-introduction
                :userForm.sync="userForm"
                @userSubmit="handleSubmit"
                :dialogVisible.sync="dialogVisible"
              />
            </div>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="账户" name="account" style="margin-bottom: 20px">
          <keep-alive>
            <div>
              <el-button
                type="primary"
                size="mini"
                @click="handleAddAcount"
                style="margin-bottom: 15px"
                >添加账户</el-button
              >
              <account-infor
                :list.sync="accout"
                @saveAccount="handleAccout"
                @removeAccount="handleDeleteAccount"
                @resetPassword="handlePassword"
                @closeAccount="handleAccoutClose"
              />
            </div>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="权限控制" name="power" style="margin-bottom: 20px">
          <keep-alive>
            <div>
              <el-button
                type="primary"
                size="mini"
                @click="handleAddPower"
                style="margin-bottom: 15px"
                >添加权限</el-button
              >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-refresh"
                @click="handleResetPower"
                style="margin-bottom: 15px"
                >刷新</el-button
              >
              <power-list
                :list.sync="power"
                :userId.sync="this.userForm.id"
                :hosIds.sync="hosIds"
                @synUser="synUserInfo"
                @handleCancel="handleCancel"
                @savePower="handleSavePower"
                @removePower="handleRemovePower"
              ></power-list>
            </div>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="签名" name="sign" style="margin-bottom: 20px">
          <keep-alive>
            <div>
              <sign
                :imgUrl.sync="imgUrl"
                :id.sync="userForm.id"
                @handleupload="handleUpload"
              />
            </div>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
      <div v-else>
        <el-tabs
          v-model="activeName"
          type="card"
          @tab-click="handleClick"
          v-if="dialogType === 'add'"
          style="padding-bottom: 0"
        >
          <el-tab-pane label="用户基本信息" name="user">
            <keep-alive>
              <user-infor
                @userSubmit="handleSubmit"
                :userForm.sync="userForm"
                @userClose="handleClose"
                @handleisShowTip="handleisShowTip"
                :dialogType.sync="dialogType"
                :isShowTip.sync="isShowTip"
                :isShowBtn.sync="isShowBtn"
              />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane
            name="power"
            style="margin-bottom: 20px"
            :disabled="!userForm.id"
          >
            <span slot="label">
              <i class="el-icon-circle-close" v-if="!userForm.id"></i>
              <span>权限控制</span>
            </span>
            <keep-alive>
              <div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleAddPower"
                  style="margin-bottom: 15px"
                  >添加权限</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-refresh"
                  @click="handleResetPower"
                  style="margin-bottom: 15px"
                  >刷新</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleNext"
                  style="margin-bottom: 15px"
                  >下一步</el-button
                >
                <power-list
                  :list.sync="power"
                  :userId.sync="this.userForm.id"
                  :hosIds.sync="hosIds"
                  @synUser="synUserInfo"
                  @handleCancel="handleCancel"
                  @savePower="handleSavePower"
                  @removePower="handleRemovePower"
                ></power-list>
              </div>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane
            name="account"
            style="margin-bottom: 20px"
            :disabled="!userForm.id"
          >
            <span slot="label">
              <i class="el-icon-circle-close" v-if="!userForm.id"></i>账户
            </span>
            <keep-alive>
              <div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleAddAcount"
                  style="margin-bottom: 15px"
                  >添加账户</el-button
                >
                <account-infor
                  :list.sync="accout"
                  @saveAccount="handleAccout"
                  @removeAccount="handleDeleteAccount"
                  @resetPassword="handlePassword"
                  @closeAccount="handleAccoutClose"
                />
              </div>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryUsers,
  getUsers,
  addUsers,
  editUsers,
  deleteUsers,
  queryAccounts,
  addAccounts,
  editAccounts,
  deleteAccounts,
  getOrgTree,
  getOrgDeptList,
  deletedept,
  getHosData
} from "@/api/admin/user";
import { synUser } from "@/api/admin/synUser";
import { getRoleAll, getCurrRole, userAddRole } from "@/api/admin/role";
import _omit from "lodash/omit";
export default {
  components: {
    userInfor: () => import("./components/userInfor"),
    accountInfor: () => import("./components/accoutInfor"),
    userIntroduction: () => import("./components/userIntroduction"),
    userTable: () => import("./components/userTable"),
    powerList: () => import("./components/powerList"),
    sign: () => import("./components/sign"),
    leftBar: () => import("./components/leftBar")
  },

  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },

  data() {
    const generateData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        });
      }
      return data;
    };
    return {
      userInfo: {},
      imgUrl: "",
      isAdd: true,
      deptId: null,
      deptIds: [],
      deptName: "",
      roleId: "",
      roleName: "",
      form: {
        page: 1,
        pageSize: 50,
        orderBy: "updated_at desc"
      },
      dialogVisible: false,
      transferVisible: false,
      dialogType: "add",
      list: [],
      listLoading: true,
      activeName: "user",
      selection: [],
      accout: [],
      userForm: {
        hosName: "请选择医院"
      },
      total: 0,
      transferValue: [],
      transferData: [],
      props: {
        label: "name",
        key: "id"
      },
      userId: "",
      power: [],
      dept: [],
      hos: [],
      isReset: false,
      hosIds: [],
      isShowTip: true
    };
  },

  created() {
    this.fetchData();
    // this.queryOrgDeptList()
  },

  methods: {
    handleisShowTip() {
      this.isShowTip = true;
    },
    getHosData(data) {
      getHosData(data).then(res => {
        if (res.code == 1) {
          this.hos = res.data;
          this.hosIds = [];
          this.hos.map(val => {
            this.hosIds.push(val.hosId);
          });
        } else {
          this.$message({ message: "请求失败" + res.msg, type: "error" });
        }
      });
    },

    handleHosData(val) {
      this.getHosData({ userId: this.userForm.id });
      if (val == "dele") {
        this.handleResetPower();
      }
    },

    //选择科室或者角色
    handleSelect(val) {
      console.log("val", val);
      this.isReset = false;
      if (val.roleId) {
        this.form = {
          page: 1,
          pageSize: 10,
          rid: val.roleId,
          orderBy: "updated_at desc"
        };
      } else if (val.deptId) {
        this.form = {
          page: 1,
          pageSize: 10,
          did: val.deptId,
          orderBy: "updated_at desc"
        };
      }
      this.power = [];
      this.userInfo = {};
      this.fetchData();
    },

    removedept(val) {
      deletedept(val).then(res => {
        if (res.code === 1) {
          this.$message("删除数据成功");
          this.queryCurrRole({ id: this.userForm.id });
        } else {
          this.$message("删除数据失败");
        }
      });
    },

    queryOrgDeptList(data) {
      getOrgDeptList(data).then(res => {
        if (res.code === 1) {
          this.dept = res.data;
        } else {
          this.$message("获取数据失败");
        }
      });
    },

    //查询关联的权限
    queryCurrRole(data) {
      getCurrRole(data).then(res => {
        if (res.code === 1) {
          console.log("res.data-----------------------------");
          console.log(res.data);
          for (let index of res.data) {
            index.edit = false;
          }
          this.power = res.data;
          console.log("~~~~~~~~~~~~~", this.power);
        } else {
          this.$message("获取数据失败");
        }
      });
    },

    //重置
    handleResetPower() {
      this.queryCurrRole({ id: this.userForm.id });
    },

    userAddRole(data) {
      userAddRole(data).then(res => {
        if (res.code === 1) {
          this.$message("添加数据成功");
          //  this.queryCurrRole({id:data[0].userId})
        } else {
          this.$message("添加数据失败");
        }
      });
    },

    fetchData() {
      queryUsers(this.form).then(res => {
        if (res.code === 1) {
          this.list = res.data;
          this.total = res.total;
          this.userInfo = {};
          this.hos = [];
          this.accout = [];
          this.power = [];
        } else {
          this.$message("获取数据失败");
        }
      });
    },

    addUser(params) {
      addUsers(params).then(res => {
        if (res.code === 1) {
          this.$message("添加数据成功");
          this.fetchData();
          //添加用户，查询该用户下的账户

          if (
            this.activeName == "user" &&
            !this.userForm.hasOwnProperty("id")
          ) {
            this.activeName = "power";
          }
          this.userForm.id = res.data.id;
          this.queryAccount({ userId: res.data.id });
          this.queryCurrRole({ id: res.data.id });
          this.getHosData({ userId: res.data.id });
        } else {
          this.$message("添加数据失败," + res.msg);
        }
      });
    },

    editUser(params) {
      console.log(params);
      editUsers(params).then(res => {
        if (res.code === 1) {
          this.$message("修改数据成功");
          this.fetchData();
        } else {
          this.$message("修改数据失败", +res.msg);
        }
      });
    },

    getUsers(params) {
      getUsers(params).then(res => {
        if (res.code === 1) {
          if (res.data) {
            this.imgUrl = "data:png;base64," + res.data;
          } else {
            this.imgUrl = "";
          }
        } else {
          this.$message("加载图片失败");
        }
      });
    },

    handleUpload(val) {
      if (val == "success") {
        this.getUsers({ id: this.userForm.id });
      }
      if (val == "delSuccess") {
        this.getUsers({ id: this.userForm.id });
        return;
      }
      this.dialogVisible = false;

      this.imgUrl = "";
    },

    deleteUser(params) {
      deleteUsers(params).then(res => {
        if (res.code === 1) {
          this.$message("删除数据成功");
          this.fetchData();
        } else {
          this.$message("删除数据失败");
        }
      });
    },

    queryAccount(params) {
      queryAccounts(params).then(res => {
        if (res.code === 1) {
          this.accout = res.data;
          console.log("accout", res.data);
        } else {
          this.$message("获取数据失败");
        }
      });
    },

    addAccounts(params) {
      addAccounts(params).then(res => {
        if (res.code === 1) {
          this.$message("添加账户成功");
          this.queryAccount({ userId: this.userForm.id });
        } else {
          this.$message("添加账户失败," + res.msg);
        }
      });
    },

    editAccounts(params) {
      editAccounts(params).then(res => {
        if (res.code === 1) {
          this.$message("修改账户成功");
          this.queryAccount({ userId: this.userForm.id });
        } else {
          this.$message("修改账户失败," + res.msg);
        }
      });
    },

    deleteAccounts(params) {
      deleteAccounts(params).then(res => {
        if (res.code === 1) {
          this.$message("删除账户成功");
          this.queryAccount({ userId: this.userForm.id });
        } else {
          this.$message("删除账户失败");
        }
      });
    },

    handleClick(tab) {
      this.activeName = tab.name;
      if (tab.name === "account") {
        if (this.userForm.id) {
          this.queryAccount({ userId: this.userForm.id });
        }
      }
      if (tab.name == "sign" && this.dialogType == "edit" && !this.imgUrl) {
        this.getUsers({ id: this.userForm.id });
      }
      //加载账户数据并且把把每个对象里添加一个{edit:true}
    },

    handleOk() {},

    handleClose() {
      this.isShowTip = false;
      this.dialogVisible = false;
      this.imgUrl = "";
      this.userForm = {
        hosName: "请选择医院"
      };
      this.activeName = "user";
    },

    handleQuery() {
      this.isReset = true;
      let obj = {
        pageSize: 10,
        page: 1,
        orderBy: "updated_at desc",
        rid: "",
        did: null
      };
      //在此处添加搜索条件
      // this.form.rid = this.roleId;
      // this.form.did = this.deptId;
      this.form = { ...this.form, ...obj };
      // console.log("this.form",this.form)
      this.fetchData();
    },

    handleReset() {
      this.isReset = true;
      this.roleId = "";
      if (this.deptId) {
        this.deptId = null;
        this.deptIds = [];
      }
      this.$refs.form.resetFields();
      let obj = {
        rid: "",
        did: null,
        name: "",
        userNo: "",
        pageSize: 10,
        page: 1,
        orderBy: "updated_at desc"
      };
      this.form = { ...this.form, ...obj };
      this.fetchData();
    },

    handleAdd() {
      this.dialogVisible = true;
      this.dialogType = "add";
      this.userForm = {
        // hosNames: []
      };
    },

    handleSubmit(val) {
      this.imgUrl = "";

      if (this.userForm.hasOwnProperty("id")) {
        this.editUser(val);
        this.dialogVisible = false;
      } else {
        this.addUser(val);
      }
      // this.userForm = {
      //   // hosName: "请选择医院"
      // };
      // this.activeName = "user";
      // this.imgUrl = "";
    },

    handleNext() {
      this.activeName = "account";
    },

    handleSelectionChange(val) {
      this.selection = val;
    },

    handleRemove() {
      if (this.selection.length <= 0) {
        this.$message("请您先选中数据");
        return;
      }
      let arr = [];
      for (let index of this.selection) {
        arr.push(index.id);
      }
      this.handleDelete(arr);
    },

    handleEdit(row) {
      this.dialogVisible = true;
      this.dialogType = "edit";
      this.userForm = { ...row };
    },

    handleAccout(row) {
      let obj = { ...row };
      delete obj.edit;
      if (obj.hasOwnProperty("id")) {
        this.editAccounts(obj);
      } else {
        this.addAccounts(obj);
      }

      //保存的时候一定要把edit成
    },

    handleAccoutClose(row) {
      let obj = { ...row };
      delete obj.edit;
      this.queryAccount({ userId: obj.userId });
    },

    handleDelete(arr) {
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteUser(arr);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    handlePassword(row) {
      let obj = {
        id: row.id,
        userName: row.userName
      };
      console.log(obj);
      this.editAccounts(obj);
    },

    changeSize(obj) {
      console.log("obj", obj);
      this.form = { ...this.form, ...obj };
      console.log("this.form ", this.form);
      this.fetchData();
    },
    handleAddAcount() {
      this.accout.unshift({
        userName: "",
        userId: this.userForm.id,
        edit: true
      });
    },
    handleDeleteAccount(row) {
      let obj = {
        id: row.id
      };
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteAccounts(obj);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleChange(value) {
      let arr = [];
      for (let index of value) {
        let obj = {
          roleId: index,
          userId: this.userId
        };
        arr.push(obj);
      }
      this.userAddRole(arr);
    },
    handleAddPower() {
      if (this.power.length > 0) {
        if (this.power[0].edit) {
          this.$message("您还有未完成的添加权限操作！！！");
          return;
        }
      }
      this.power.unshift({
        userId: this.userForm.id,
        deptId: "",
        roleId: "",
        edit: true
      });
    },
    handleSavePower(val) {
      // let roleName = this.transferData.filter(item => item.id === val.roleId);
      // let deptName = this.dept.filter(item => item.id === val.deptId);
      // let obj = {
      //   ...val,
      //   ...{ roleName: roleName[0].name, deptName: deptName[0].orgNm }
      // };
      let arr = [];
      this.isAdd = true;
      arr.push(_omit(val, "edit"));
      this.power.shift();
      this.power.map(item => {
        if (item.roleName == val.roleName && item.deptName == val.deptName) {
          this.isAdd = false;
        }
      });
      // val.roleName = roleName[0].name;
      // val.deptName = deptName[0].orgNm;
      this.power.unshift(val);
      console.log("this.isAdd", this.isAdd);
      if (!this.isAdd) {
        this.power.shift();
        this.isAdd = true;
        this.$message({
          type: "error",
          message: "数据添加重复，请重新添加！！"
        });
        return;
      }
      this.isAdd = true;
      this.userAddRole(arr);
    },
    handleCancel() {
      this.power.shift();
    },
    handleRemovePower(val) {
      let obj = {
        userId: this.userForm.id,
        roleId: val.roleId,
        deptId: val.deptId
      };
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.removedept(obj);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleEditStatus(val) {
      let obj = {
        id: val.id,
        status: 1
      };
      this.$confirm("您是否要禁用当前用户?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.editUser(obj);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    synUserInfo() {
      let user = this.userForm;
      user.roleList = this.power;
      user.accountList = this.accout;
      console.log("========synUser", this.accout);
      synUser(user).then(res => {
        if (res.code === 1) {
          this.$message("同步成功");
        } else {
          this.$message("同步失败");
        }
      });
    },
    handleuserInfo(val) {
      console.log("1111", 1111);
      this.userInfo = val;
      this.queryCurrRole({ id: val.id });
      this.queryAccount({ userId: val.id });
      this.getHosData({ userId: val.id });
    }
  },
  computed: {
    isShowBtn() {
      return !this.userForm.id;
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  //   background-color: #ffffff;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
.el-row {
  .el-col {
    background: #fff;
    // padding: 20px !important;
  }
  .el-col-5 {
    // width: 12.5%;
    // width: 13.5%;
    padding-right: 0 !important;
    width: 17%;
    // padding: 20px !important;
  }
  .el_right {
    width: 21%;
    padding: 20px !important;
  }
  .el-col-14 {
    width: 59.6%;
    margin: 0 1.2%;
    padding: 20px !important;
  }
  // .el-col-4 {
  //   width: 16%;
  // }
}

//设置按钮
.el-button--mini {
  border-radius: 0;
}
.editBtn {
  margin-top: -20px !important;
  margin-left: 0px !important;
  color: #1f2d3d !important;
  font-weight: 800 !important;
}

.btn_group {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}
.action_group {
  float: right;
}
.form_dialog {
  /deep/.el-form-item {
    overflow: hidden;
  }
  /deep/.el-form-item__content {
    margin-left: 80px;
  }
}
.page {
  text-align: right;
}
.form_transfer {
  /deep/.el-dialog__body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.el-input {
  margin-bottom: 7px;
}
.el-tabs--card {
  padding: 10px 20px;
}
/deep/.el-dialog__body {
  .el-input--suffix {
    .el-input__inner {
      width: 255px;
    }
  }
}
// /deep/.el-pagination {
//   /deep/.el-input__inner {
//     height: 28px !important;
//   }
// }
.app-container {
  /deep/.el-dialog__wrapper {
    z-index: 999;
  }
}
.list {
  //   height: 35px;
  //   line-height: 35px;
  margin-left: 15px;
  color: #4a4b4c;
}

.listTitle {
  font-weight: 600;
  font-size: 15px;
  display: inline-block;
  padding: 10px;
}
.hanveInfo {
  padding-left: 90px !important;
  line-height: 2;
  margin-top: -30px;
}
/deep/.el-dialog {
  width: 1000px;
}

.content {
  height: 95%;
  overflow-y: auto;
}
/deep/.is-disabled {
  background: #f5f7fa;
}
.el-icon-circle-close {
  // color: #f56c6cb0;
  // position: absolute;
  // font-weight: 800;
  // right: 1px;
  // bottom: 1px;
  // font-size: 14px;
  color: #f56c6cb0;
  float: right;
  margin: 14px -9px 0 5px;
  font-weight: 800;
  bottom: 1px;
  font-size: 14px;
}
</style>
