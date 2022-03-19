<template>
    <div class="app-container" ref="page">
        <div class="btn_group">
            <el-form :inline="true" :model="form" ref="form">
                <el-form-item label>
                    <el-input v-model="form.name" placeholder="请输入姓名/拼音/五笔"></el-input>
                </el-form-item>
                <el-form-item label>
                    <el-input v-model="form.userNo" placeholder="请输入员工编号"></el-input>
                </el-form-item>
                <el-form-item>
                  <span v-if="this.roleId" @click="handleRole">
                    {{roleName}}
                    <i class="el-icon-edit editBtn" ></i>
                  </span>
                  <el-button v-else type="primary" size="mini"  @click="handleRole">选择角色</el-button>
                </el-form-item>
                <el-form-item>
                  <span v-if="this.deptId" @click="handleDept">
                    {{deptName}}
                    <i class="el-icon-edit editBtn" ></i>
                  </span>
                  <el-button v-else type="primary" size="mini"  @click="handleDept">选择科室</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini"  icon="el-icon-search" @click="handleQuery">搜索</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button  size="mini" icon="el-icon-refresh" type="primary" plain  @click="handleReset" >重置</el-button>
                </el-form-item>

            </el-form>
            <div class="action_group">
                <el-button type="primary" size="mini"  icon="el-icon-search" @click="handleAdd">添加</el-button>
                <el-button type="primary" size="mini"  icon="el-icon-search" @click="handleRemove" v-hasButton="['tetButton','testButton']">删除</el-button>
            </div>
        </div>

        <user-table
                :list.sync="list"
                @selectionChange="handleSelectionChange"
                @editRow="handleEdit"
                @removeRow="handleDelete"
                @userAddRole="handleUserAddRole"
                @editStatus = "handleEditStatus"
        />
        <div class="page">
            <pagination
                    v-show="total>0"
                    :total="total"
                    :pageSize.sync="form.pageSize"
                    :page.sync="form.page"
                    @pagination="changeSize"
            />
        </div>
        <el-dialog
                :visible.sync="dialogVisible"
                :title="dialogType==='edit'?'编辑用户':'新建用户'"
                class="form_dialog"
                :before-close="handleClose"
        >
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-if="dialogType==='edit'" style="padding-bottom:0" >
                <el-tab-pane label="用户基本信息" name="user">
                    <keep-alive>
                        <user-infor
                                @userSubmit="handleSubmit"
                                :userForm.sync="userForm"
                                @userClose="handleClose"
                        />
                    </keep-alive>
                </el-tab-pane>
                <el-tab-pane label="用户简介" name="userIntroduct"   style="margin-bottom:20px;">
                    <keep-alive>
                        <div>
                         <user-introduction :userForm.sync="userForm" @userSubmit="handleSubmit"  :dialogVisible.sync="dialogVisible"/>
                        </div>
                    </keep-alive>
                </el-tab-pane>
                <el-tab-pane label="账户" name="account" style="margin-bottom:20px;">
                    <keep-alive>
                        <div>
                            <el-button type="primary" size="mini"  @click="handleAddAcount" style="margin-bottom:15px;">添加账户</el-button>
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
                <el-tab-pane label="权限控制" name="power" style="margin-bottom:20px;">
                    <keep-alive>
                        <div>
                            <el-button type="primary" size="mini"  @click="handleAddPower" style="margin-bottom:15px;">添加权限</el-button>
                            <power-list :list.sync="power" :roles.sync="transferData" :dept.sync="dept" @synUser="synUserInfo" @savePower="handleSavePower" @removePower="handleRemovePower"></power-list>
                        </div>
                    </keep-alive>
                </el-tab-pane>
                <el-tab-pane label="签名" name="sign"   style="margin-bottom:20px;">
                    <keep-alive>
                        <div >
                         <sign :imgUrl.sync="imgUrl" :id.sync="userForm.id" @handleupload="handleUpload"/>
                        </div>
                    </keep-alive>
                </el-tab-pane>
            </el-tabs>
            <div v-else>
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-if="dialogType==='add'" style="padding-bottom:0" >
                <el-tab-pane label="用户基本信息" name="user">
                    <keep-alive>
                        <user-infor
                                @userSubmit="handleSubmit"
                                :userForm.sync="userForm"
                                @userClose="handleClose"

                        />
                    </keep-alive>
                </el-tab-pane>
                <el-tab-pane label="用户简介" name="userIntroduct"   style="margin-bottom:20px;">
                    <keep-alive>
                        <div>
                         <user-introduction :userForm.sync="userForm" @userSubmit="handleSubmit" :dialogVisible.sync="dialogVisible" />
                        </div>
                    </keep-alive>
                </el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="transferVisible" title="给用户添加角色" class="form_transfer" >
            <el-transfer
                    v-model="transferValue"
                    :data="transferData"
                    @change="handleChange"
                    :props="props"
            ></el-transfer>

            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="transferVisible = false">确 定</el-button>
        <el-button @click="transferVisible = false">取 消</el-button>
      </span>
        </el-dialog>
      <roletable :roleVisible.sync="roleVisible" :id.sync="roleId"  @dialogRoleInfo="handleRoleInfo"/>
      <deptree :deptVisible.sync="deptVisible"  @dialogDept="handleDeptInfo" :id.sync="deptIds"/>
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
    } from "@/api/admin/user";
    import {
      synUser
    } from "@/api/admin/synUser";
    import { getRoleAll, getCurrRole, userAddRole } from "@/api/admin/role";
    import _omit from 'lodash/omit'
    export default {
        components: {
          userInfor:() => import("./components/userInfor") ,
          accountInfor:() => import("./components/accoutInfor") ,
          userIntroduction:() => import("./components/userIntroduction") ,
          userTable:() => import("./components/userTable") ,
          powerList:() => import("./components/powerList") ,
          roletable:() => import("./components/roleTable/index") ,
          deptree:() => import("./components/deptTree/index") ,
          sign:() => import("./components/sign") ,
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
                imgUrl:"",
                isAdd:true,
                deptId:null,
                deptIds:[],
                deptName:'',
                roleId:'',
                roleName:'',
                roleVisible:false,
                deptVisible:false,
                form: {
                    page: 1,
                    pageSize: 10,
                    status: 0,
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
                    hosName:"请选择医院",
                },
                total: 0,
                transferValue: [],
                transferData: [],
                props: {
                    label: "name",
                    key: "id"
                },
                userId: "",
                power:[],
                dept:[],

            };
        },
        created() {
            this.fetchData();
            this.queryRole();
            // this.queryOrgDeptList()
        },
        methods: {
          //选择科室
          handleDept(){
            this.deptVisible=true;
          },
          handleDeptInfo(data){
            this.deptVisible=false;
            this.deptId=data.id;
            this.deptIds=[];
            this.deptIds.push(this.deptId)
            this.deptName=data.label
          },
          handleRoleInfo(val){
            this.roleVisible=false;
            this.roleId = val.roleId;
            this.roleName=val.roleName;
          },
          //角色弹出框
          handleRole(){
            this.roleVisible=true;
          },
          removedept(val){
                deletedept(val)
                    .then(res=>{
                        if(res.code === 1){
                            this.$message("删除数据成功");
                            this.queryCurrRole({id:this.userForm.id})
                        }else{
                            this.$message("删除数据失败");
                        }
                    })
            },
            queryOrgDeptList(data){
                console.log()
                getOrgDeptList(data)

                    .then(res =>{
                        console.log("dept数据请求处------------------")
                        console.log(res.data)
                        if(res.code === 1){
                            this.dept = res.data
                        }else{
                            this.$message("获取数据失败");
                        }
                    })
            },
            queryRole() {
                getRoleAll().then(res => {
                    if (res.code === 1) {

                        this.transferData = res.data;
                    } else {
                        this.$message("获取数据失败");
                    }
                });
            },
            queryCurrRole(data) {
                getCurrRole(data).then(res => {
                    if (res.code === 1) {
                        console.log("res.data-----------------------------")
                        console.log(res.data)
                        for(let index of res.data){
                            index.edit = false
                        }
                        this.power = res.data
                        console.log("~~~~~~~~~~~~~",  this.power)

                    } else {
                        this.$message("获取数据失败");
                    }
                });
            },
            userAddRole(data) {
                userAddRole(data).then(res => {
                    if (res.code === 1) {
                        this.$message("添加数据成功");

                     // console.log("arr******",data[0].userId)
                    //  this.queryCurrRole({id:data[0].userId})

                    } else {
                        this.$message("添加数据失败");
                    }
                });
            },
            fetchData() {
                queryUsers(this.form).then(res => {
                    if (res.code === 1) {
                        console.log("list",res)
                        this.list = res.data;
                        this.total = res.total;
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

                    } else {
                        this.$message("添加数据失败");
                    }
                });
            },
            editUser(params) {
                console.log(params)
                editUsers(params).then(res => {
                    if (res.code === 1) {
                        this.$message("修改数据成功");
                        this.fetchData();
                    } else {
                        this.$message("修改数据失败");
                    }
                });
            },
            getUsers(params){
                getUsers(params).then(res => {
                    if (res.code === 1) {
                       console.log("res",res)
                       if(res.data){
                            this.imgUrl="data:png;base64," + res.data;
                       }else{
                           this.imgUrl="";
                       }
                        
                    } else {
                        this.$message("加载图片失败");
                    }
                });
            },
            handleUpload(val){
                if(val=="success"){
                    this.getUsers({id:this.userForm.id})
                }
                if(val=="delSuccess"){
                    this.getUsers({id:this.userForm.id})
                    return ;
                }
                 this.dialogVisible = false;
                
                this.imgUrl=""
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
                        console.log("accout",res.data)
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
                        this.$message("添加账户失败");
                    }
                });
            },
            editAccounts(params) {
                editAccounts(params).then(res => {
                    if (res.code === 1) {
                        this.$message("修改账户成功");
                        this.queryAccount({ userId: this.userForm.id });
                    } else {
                        this.$message("修改账户失败");
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
                    this.queryAccount({ userId: this.userForm.id });
                }
              
                if(tab.name=="sign"&&this.dialogType=="edit"&&!this.imgUrl){
                    this.getUsers({id:this.userForm.id})
                }
                //加载账户数据并且把把每个对象里添加一个{edit:true}
            },
            handleOk() {},
            handleClose() {
                this.dialogVisible = false;
                this.imgUrl=""
                this.userForm = {
                    hosName:"请选择医院",
                };
                this.activeName = "user";
            },

            handleQuery() {
                let obj = {
                    pageSize: 10,
                    page: 1,
                    orderBy: "updated_at desc"
                };
                //在此处添加搜索条件
              this.form.rid=this.roleId;
              this.form.did=this.deptId;
              this.form = { ...this.form, ...obj };
              // console.log("this.form",this.form)
                this.fetchData();
            },
            handleReset() {
                this.roleId="";
                if(this.deptId){
                  this.deptId=null;
                  this.deptIds=[];
                }
                this.$refs.form.resetFields();
                let obj = {
                    rid:"",
                    did:null,
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
                this.userForm={
                    hosName:"请选择医院",
                }
            },
            handleSubmit(val) {
                this.dialogVisible = false;
                this.imgUrl=""
                console.log("val",val)
                if (this.userForm.hasOwnProperty("id")) {
                    this.editUser(val);
                } else {
                    this.addUser(val);
                }
                this.userForm = {
                    hosName:"请选择医院"
                };
                this.activeName = "user";
                this.imgUrl=""
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
                console.log("5555555",row.id)
                // this.userForm = {...row,...{hosName:"请选择医院"}};
                // this.default_key=row.index
                this.userForm = {...row};
                console.log(row)
                this.queryOrgDeptList({id:this.userForm.id})
                this.queryCurrRole({id:this.userForm.id})
                console.log(this.userForm.id)
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
            handleAccoutClose(row){
                let obj={...row}
                delete obj.edit;
                console.log(obj)
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
                    userName: row.userName,
                    password: "11111111"
                };
                console.log(obj)
                this.editAccounts(obj);
            },
            changeSize(obj) {
                console.log('obj',obj)
                this.form = { ...this.form, ...obj };
                console.log('this.form ',this.form )
                this.fetchData();
            },
            handleAddAcount() {
                this.accout.unshift({
                    userName: "",
                    status: 0,
                    userId: this.userForm.id,
                    edit: true,
                    password: "11111111"
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
            handleUserAddRole(row) {
                this.transferVisible = true;
                this.queryCurrRole({ id: row.id });
                console.log(row.id)
                this.userId = row.id;
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
            handleAddPower(){
                this.power.unshift({
                    userId: this.userForm.id,
                    deptId: "",
                    roleId: "",
                    edit: true,

                })
            },
            handleSavePower(val){
                let roleName = this.transferData.filter(item=>item.id === val.roleId)
                let deptName = this.dept.filter(item=>item.id === val.deptId)
                let obj = {...val,...{roleName: roleName[0].name,deptName: deptName[0].orgNm}}
                let arr = []
                arr.push(_omit(obj,'edit'))
                this.power.map((val)=>{
                    console.log("val",val)
                    if(val.roleName==roleName[0].name&&val.deptName== deptName[0].orgNm){
                        this.isAdd=false;
                    }
                })

                    val.roleName= roleName[0].name
                    val.deptName= deptName[0].orgNm
                    if(!this.isAdd){
                        this.power.shift();
                        this.isAdd=true;
                    }

                console.log("-----------------------------------")
                console.log(arr)
                this.userAddRole(arr)





            },
            handleRemovePower(val){
                let obj = {
                    userId: this.userForm.id,
                    roleId: val.roleId,
                    deptId: val.deptId
                }
              this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
                distinguishCancelAndClose: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  this.removedept(obj)
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消删除"
                  });
                });

            },
            handleEditStatus(val){
                let obj = {
                    id: val.id,
                    status: 1
                }
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
              console.log("========synUser",this.accout)
              synUser(user).then(res => {
                if (res.code === 1) {
                  this.$message("同步成功");

                } else {
                  this.$message("同步失败");
                }
              });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .app-container{
        background-color: #ffffff;
        height: 100%;
        overflow: hidden;
    }
     //设置按钮
    .el-button--mini{
        border-radius: 0;
    }
  .editBtn{
    margin-top: -20px!important;
    margin-left: 0px!important;
    color: #1f2d3d!important;
    font-weight: 800!important;
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
.el-tabs--card{
    padding: 10px 20px;
}
/deep/.el-dialog__body{
    .el-input--suffix{
        .el-input__inner{
        width: 255px;
        }
    }
}
 /deep/.el-pagination{
    /deep/.el-input__inner{
      height: 28px!important;
    }
  }
  .app-container{
/deep/.el-dialog__wrapper{
      z-index:999;
  }
  }


</style>
