<template>
  <el-dialog
    append-to-body
    :visible.sync="roleVisible"
    title="选择角色"
    class="form_dialog"
    :before-close="handleCancel"
  >
    <el-form :inline="true" :model="form"  style="margin: 15px 20px">
      <el-form-item >
        <el-input
          placeholder="角色名称"
          v-model="nameValue"
          style="margin-left: 20px"
          clearable
          @change="updataTable"
        ></el-input>
      </el-form-item>
      <el-form-item >
        <el-button
          size="mini"
          type="primary"
          style="margin-left: 20px"
          icon="el-icon-search"
          @click="updataTable"
        >查询</el-button>
      </el-form-item>
      <el-form-item >
        <el-button
          style="margin-left: 20px"
          size="mini"
          icon="el-icon-refresh"
          type="primary"
          plain
          @click="handleResetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table
        :data="tableData"
        border
        height="280"
        style="margin-left: 20px;width: 95%"
        ref="roleInfo"
      >
        <el-table-column align="center" label="" width="50">
          <template slot-scope="scope">
            <el-radio  :label="scope.row.id" v-model="roleid"  @change.native="toggleSelection(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="角色姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <pagination
          v-if="total>0"
          :total="total"
          :pageSize.sync="form.pageSize"
          :page.sync="form.page"
          @pagination="changeSize"
          style="margin-bottom: -10px"
        />
        <div v-else style="height: 90px;"></div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleOk">确 定</el-button>
          <el-button @click="handleCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import {getRoleList} from "@/api/admin/role";
  export default {
    data(){
      return{
        nameValue: "",
        tableData: [],
        form: {
          page: 1,
          pageSize: 10,
          status: 0,
          orderBy: "updated_at desc"
        },
        total:0,
        roleInfo:{},
        obj:{
          roleId:"",
          roleName:"",
          rid:""
        },
        flag:false,
      }
    },
    mounted(){
      this.updataTable();
    },
    props: {
      roleVisible: {
        type: Boolean,
        default() {
          return false
        }
      },
      id:{
        type:String,
        default() {
          return "";
        }
      },
    },
    methods:{
      //重置按钮
      handleResetQuery(){
        this.resetQuery()
        this.rid=this.obj.roleId
        this.roleid=""
        this.flag=true;

      },
      //主页重置按钮功能实现
      handleReset(){
        if(this.obj.roleId&&this.id==""&&!this.flag){
          this.obj.roleId=""
          this.obj.roleName=""
        }
      },
      //取消按钮
      handleCancel(){
        if(this.flag){
          this.obj.roleId=this.rid;
        }
        this.resetQuery()
        this.handleReset()
        this.flag=false;
        this.$emit("dialogRoleInfo",this.obj)
      },
      //确定按钮
      handleOk(){
        this.flag=false;
        this.obj.roleId=this.roleInfo.id;
        this.obj.roleName=this.roleInfo.name;
        this.handleReset()
        this.resetQuery()
        this.$emit("dialogRoleInfo",this.obj)
      },
      //刷新角色表格表单
      resetQuery() {
        this.nameValue = "";
        this.form= {
          page: 1,
          pageSize: 10,
          status: 0,
          orderBy: "updated_at desc"
        }
        this.updataTable();
      },
      //加载表格数据
      updataTable() {
        let params = {
          page: this.form.page,
          pageSize: this.form.pageSize,
          name: this.nameValue
        };
        getRoleList(params).then(res => {
          console.log(res);
          this.tableData = res.data;
          this.form.page = res.pageNo;
          this.form.pageSize = res.pageSize;
          this.total = res.total;
        });
      },
      //改变页数
      changeSize(obj) {
        console.log('obj',obj)
        this.form = { ...this.form, ...obj };
        console.log('this.form ',this.form )
        this.updataTable()
      },
      //单选
      toggleSelection(index,row) {
        this.roleInfo=row
      },
    },
    computed:{
      roleid: {
        get() {
          return this.id
        },
        set(s) {
          this.$emit('update:id', s);
        }
      },

    },

  }
</script>
<style lang="scss" scoped>
 /deep/.el-form-item__content {
    margin-left: 0px!important;
  }
 /deep/.el-pagination__sizes{
   /deep/.el-input__inner{
     width: 100px!important;
   }
 }
</style>
