<template>
  <el-dialog
    append-to-body
    :visible.sync="dialogSigerVisible"
    :title="dialogSigerType==='one'?'一级审签人':dialogSigerType==='two'?'二级审签人':'三级审签人'"
    class="form_dialog"
    :before-close="handleCloseSiger"
  >
    <el-form :inline="true" :model="form" ref="form" style="margin: 15px 20px">
      <el-form-item >
        <el-input v-model="form.name" placeholder="请输入姓名/拼音/五笔" v-on:keyup.enter.native="handleQuery" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.userNo" placeholder="请输入员工编号" v-on:keyup.enter.native="handleQuery" ></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 50px">
        <el-button type="primary" size="mini"  icon="el-icon-search" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="sigerList"
      element-loading-text="Loading"
      height="300"
      ref="Siger"
      style="margin-left: 20px;width: 95%"
    >
      <!-- <el-table-column type="selection" width="50" align="center" label="1"></el-table-column>-->
      <el-table-column align="center" label="" width="50">
        <template slot-scope="scope">
          <el-radio  :label="scope.row.id" v-model="qid"  @change.native="toggleSelection(scope.$index,scope.row)">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="员工编号" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.userNo }}</template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">{{ scope.row.gender === 'M' ? '男':'女' }}</template>
      </el-table-column>
      <el-table-column label="年龄" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.age}}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工类型" align="center">
        <template slot-scope="scope">
          <span :val="scope.row.workType" code="EmployeeMark" v-codeTransform></span>
        </template>
      </el-table-column>
      <el-table-column label="职称" align="center">
        <template slot-scope="scope">
          <span  v-if="scope.row.title" :val="scope.row.title" code="doctorProfessionalTitle" v-codeTransform></span>
        </template>
      </el-table-column>
      <el-table-column label="手术级别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.operationLevel" :val="scope.row.operationLevel" code="SurgicalGrade" v-codeTransform></span>
        </template>
      </el-table-column>
      <el-table-column label="处方权" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.prescribe=="Yes"?"是":scope.row.prescribe=="No"?"否":""}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <pagination
        v-show="total>0"
        :total="total"
        :pageSize.sync="form.pageSize"
        :page.sync="form.page"
        @pagination="changeSize"
        style="text-align: right;"
      />
    </div>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleOk">确 定</el-button>
          <el-button @click="handleCancel">取 消</el-button>
      </span>
  </el-dialog>

</template>
<script>
  import {
    queryUsers
  } from "@/api/admin/user";
  export default {
    data(){
      return{
        // sigerList:[],
        singerid:'',
        signerInfo:{},
        singerIds:{
          oneSingerId:"",
          twoSingerId:"",
          threeSingerId:""
        },
        form: {
          page: 1,
          pageSize: 10,
          status: 0,
          orderBy: "updated_at desc"
        },

      }
    },
    mounted(){

    },
    props:{
      dialogSigerType:{
        type:String,
        default() {
          return ""
        }
      },
      sigerList:{
        type:Array,
        default() {
          return []
        }
      },
      id:{
        type:String,
        default() {
          return "";
        }
      },
      total:{
        type:Number,
      },
      dialogSigerVisible:{
        type:Boolean,
        default() {
          return false;
        }
      },
      },
    computed:{
      qid: {
        get() {
          //console.log("############",this.id)
          return this.id
        },
        set(s) {
          //console.log("@@@@@@@@@@@@@@@@@@")
          this.$emit('update:id', s);
        }
      }
    },
    methods:{
      handleOk(){
        if(this.dialogSigerType == "one"){
          this.singerIds.oneSingerId = this.id
        }else if(this.dialogSigerType == "two"){
          this.singerIds.twoSingerId = this.id
        }else if(this.dialogSigerType == "three"){
          this.singerIds.threeSingerId = this.id
        }
        let obj = {
          dialogSigerType:this.dialogSigerType,
          dialogSigerVisible:false,
          signerinfo:this.signerInfo,
          singerIds:this.singerIds
        };
        this.handleReset()
        this.$emit("dialogSigerinfo",obj)



      },

      handleCloseSiger(){
        let obj = {
          dialogSigerType:this.dialogSigerType,
          dialogSigerVisible:false,
          singerIds:this.singerIds
        };
        this.handleReset()
        this.$emit("dialogSigerinfo",obj)
      },
      handleCancel(){
        let obj = {
          dialogSigerType:this.dialogSigerType,
          dialogSigerVisible:false,
          singerIds:this.singerIds
        };
        this.form.rid="";
        this.form.did='';
        this.handleReset()
        this.$emit("dialogSigerinfo",obj)
      },
      //单选
      toggleSelection(index,row) {
        //this.id = row.id
        this.signerInfo = row
      },
      // 请求表格数据
      //条件查询
      handleQuery() {
        let obj = {
          pageSize: 10,
          page: 1,
          orderBy: "updated_at desc"
        };
        this.form = { ...this.form, ...obj };
        this.$emit("handleData",this.form)
      },
      //重置
      handleReset() {
        this.$refs.form.resetFields();
        let obj = {
          name: "",
          userNo: "",
          pageSize: 10,
          page: 1,
          orderBy: "updated_at desc"
        };
        this.form = { ...this.form, ...obj };
          this.$emit("handleData",this.form)
        // this.fetchData();
      },
      //改变页数
      changeSize(obj) {
        console.log('obj',obj)
        this.form = { ...this.form, ...obj };
        console.log('this.form ',this.form )
        // this.fetchData();
        this.$emit("handleData",this.form)
      }
    }
  }
</script>
