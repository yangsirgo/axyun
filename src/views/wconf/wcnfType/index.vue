<template>
  <div class="container" ref="page">
    <el-row :gutter="20" style="height:100%">
      <el-col :span="8" style="height: 100%">
        <div class="tree_box" style="height: 100%;padding-bottom:20px;">
          <el-select placeholder="请选择1级类型" v-model="tl1" @change="handleSelectL1">
            <el-option label="请选择" value=""/>
            <el-option
              v-for="(item) in types_l1"
              :key="item.id"
              :label="item.paramName"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <br/><br/>

          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText"
          >

          </el-input>
          <el-tree
            :expand-on-click-node="false"
            :data="data"
            default-expand-all
            node-key="id"
            ref="tree"
            @node-click="handleChange"
            highlight-current
            :filter-node-method="filterNode"
            :props="defaultProps"
            style="height: 59%;overflow-y: auto"
          >
          </el-tree>
        </div>
      </el-col>
      <el-col :span="16" style="padding-left:30px;">
        <div class="table_box">
          <el-button type="primary" size="mini" round @click="handleAdd()">添加</el-button>
          <el-button type="primary" size="mini" round @click="handleRemove()">删除</el-button>
          <el-table
            :data="cnfanData"
            style="width: 100%;margin-top:20px;"
            tooltip-effect="dark"
            height='532'
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              prop="cnfField"
              label="配置字段"
              width="180">
            </el-table-column>
            <el-table-column
              prop="cnfFieldName"
              label="配置字段名称"
              width="180">
            </el-table-column>

            <el-table-column
              prop="cnfFieldType"
              label="配置字段类型">
            </el-table-column>
            <el-table-column
              prop="cnfFieldOrder"
              label="配置字段排序">
            </el-table-column>
            <el-table-column
              prop="cnfFieldValues"
              label="配置字段值域">
            </el-table-column>
            <el-table-column
              prop="cnfFieldLength"
              label="长度限制">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
            >
              <template slot-scope="scope">

                <el-button
                  @click.native.prevent="handleEdit(scope.row)"
                  type="text"
                  size="small"
                >
                  编辑
                </el-button>

                <!--                                <el-button-->
                <!--                                        @click.native.prevent="handleRemove(scope.row)"-->
                <!--                                        type="text"-->
                <!--                                        size="small">-->
                <!--                                    删除-->
                <!--                                </el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- 可以拆成组件 -->
    <el-dialog :visible.sync="visible" :title="visibleType==='edit'?'编辑配置':'新建配置'" :before-close="handleClose"  >
      <el-form :model="cnfan" label-width="100px" label-position="left" ref="cnfan" :rules="rules" status-icon style="height:360px;overflow-y:auto;">
        <el-form-item label="配置字段" prop="cnfField" >
          <el-input v-model="cnfan.cnfField" placeholder="请输入配置字段" :disabled="cnfan.cnfField === 'name' || cnfan.cnfField === 'code'" />
        </el-form-item>
        <el-form-item label="配置字段名称" prop="cnfFieldName">
          <el-input v-model="cnfan.cnfFieldName" placeholder="请输入类型值" />
        </el-form-item>

        <el-form-item label="配置字段类型" prop="cnfFieldType" >
          <el-select v-model="cnfan.cnfFieldType" placeholder="请选择类型" style="margin-left:7px;" @change="handleType">
            <el-option
              v-for="(item) in types"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            >

            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置字段排序" prop="cnfFieldOrder">
          <el-input v-model="cnfan.cnfFieldOrder" placeholder="请输入配置字段排序" />
        </el-form-item>
        <el-form-item label="长度限制" prop="cnfFieldLength">
          <el-input v-model="cnfan.cnfFieldLength" placeholder="请输入长度限制" />
        </el-form-item>
        <el-tabs v-model="cnfan.cnfFieldValueType" @tab-click="handleClick" v-if="cnfan.cnfFieldType === 'select'||cnfan.cnfFieldType === 'checkbox'">
          <el-tab-pane label="本地数据" name="local">
            <el-form-item label="配置字段值域"  prop="cnfFieldValues">
              <el-input type="textarea" :rows="4" v-model="cnfan.cnfFieldValues" placeholder="请输入配置字段值域" disabled style="margin-left:7px;" />


              <el-row :model="cnfValue" style="margin-top:20px;">
                <el-col
                  v-for="(item,index) in cnfValue"
                  :key="index"
                  style="display: flex;margin-bottom:20px;"
                >

                  <span style="padding-right:7px;">label</span>
                  <el-input v-model="item.label" placeholder="请填写配置字段值所显示的汉字" style="margin-right:8px;display: inline-block;width:225px;padding-left:0;" class="peizhi"></el-input>
                  <span style="padding-right:7px;">value</span>
                  <el-input v-model="item.value" placeholder="请填写配置字段值所选中的值" style="display: inline-block;width: 210px;padding-left:0;"></el-input>
                  <el-button @click="handleRe(index)" class="del">删除</el-button>
                </el-col>
              </el-row>

              <el-button type="primary" size="mini" @click="handleShow" round >添加</el-button>
              <el-button type="primary" size="mini" @click="handleSave" round >保存</el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="远程数据" name="remote">
            <el-form-item label="组织字段值域"  prop="orgFieldValues">
              <el-input type="textarea" :rows="4" v-model="cnfan.cnfFieldValues" placeholder="请输入组织字段"  style="width:300px" />
              <div>域值取name和code</div>
              <div>值域只能是code和name</div>
            </el-form-item>

          </el-tab-pane>
        </el-tabs>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round  size="mini" @click="handleOk">确认</el-button>
        <el-button type="primary" round size="mini" @click="handleCancel">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {getCnfanTypeTree,getCnfanTypeTable,addCnfanType,putCnfanType,deleteCnfanType,getCnfTypeL1s} from '@/api/wconf/wparam'

  export default {

    data(){
      var validatePass = (rule,value,callback) =>{
        if(!Number(value)){
          callback(new Error('请输入数字'))
        }else{
          callback()
        }

      }
      return{
        cnfValue:[
          {label: "", value: ""}
        ],
        dialogType:"add",
        dialogVisible:false,
        labelPosition:"right",
        visible: false,
        visibleType: 'add',
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        data: [],
        cnfanData:[],
        types:[
          {
            id: "1",
            label: "input",
            value: 'input'
          },
          {
            id: "2",
            label: "select",
            value: 'select'
          },
          {
            id:"3",
            label:'checkbox',
            value:'checkbox'
          }
        ],
        cnfan:{
          cnfFieldOrder:"",
          cnfFieldValueType:"local",
          cnfFieldLength:""
        },
        obj:{

        },
        cnfType:"",
        selection:[],
        rules:{
          cnfFieldOrder:[
            { validator: validatePass, trigger: 'blur' }
          ],
          cnfFieldLength:[
            { required: true,message: '请输入长度限制', trigger: 'blur'}
          ]
        },
        tl1:null,
        types_l1:[]
      }

    },
    mounted(){
      // this.getCnfanType()
      this.getCnfTypeL1s()
    },
    methods:{
      handleType(){
        this.cnfan.cnfFieldValueType=""
      },
      getCnfTypeL1s(){
        getCnfTypeL1s()
          .then(res =>{
            if(res.code === 1){
              console.log(res.data)
              this.types_l1 = res.data
            }else{
              this.$message('获取数据失败')
            }
          }).catch(error=>{
          console.log(error)
        })
      },
      handleSelectL1(){
        console.log(this.tl1)
        if( "" != this.tl1 && null != this.tl1 ){
          this.getCnfanType(this.tl1)
        }else{
          this.data = []
        }
      },
      getCnfanType(id){
        getCnfanTypeTree(id)
          .then(res =>{
            if(res.code === 1){
              this.data = res.data
            }else{
              this.$message('获取数据失败')
            }
          }).catch(error=>{
          console.log(error)
        })
      },
      getCnfanTable(params){
        console.log(params)
        getCnfanTypeTable({type:params.cnfType})
          .then(res =>{
            if(res.code === 1){
              console.log(res.data)
              this.cnfanData = res.data
            }else{
              this.$message("获取数据失败")
            }
          })
      },
      addCnfanType(params){
        addCnfanType(params)
          .then(res =>{
            if(res.code === 1){
              this.$message('添加类型定义成功')
              this.getCnfanTable({cnfType:this.cnfType})
            }else{
              this.$message('添加类型定义失败')
            }
            this.$refs["cnfan"].resetFields();
            this.visible = false
            this.cnfan = { cnfFieldValueType:"local"}
            this.cnfValue = [
              {label: "", value: ""}
            ]
          })
      },
      putCnfanType(params){
        putCnfanType(params)
          .then(res =>{
            if(res.code === 1){
              this.$message('修改类型定义成功')
              this.getCnfanTable({cnfType:this.cnfType})
            }else{
              this.$message("删除类型定义失败")
            }
            this.$refs["cnfan"].resetFields();
            this.visible = false
            this.cnfan = { cnfFieldValueType:"local"}
            this.cnfValue = [
              {label: "", value: ""}
            ]
          })
      },
      deleteCnfanType(params){
        deleteCnfanType(params)
          .then(res =>{
            if(res.code === 1){
              this.$message('删除类型定义成功')
              this.getCnfanTable({cnfType:this.cnfType})
            }else{
              this.$message("删除类型定义失败")
            }
            this.selection = []
          })
      },
      filterNode(value, data) {
        if(!value){
          return true;
        }
        return data.label.indexOf(value) !== -1;
      },
      handleChange(data){
        /*      if(data.hasOwnProperty('parentId')){*/
        this.id = data.id
        this.cnfType = data.exts.paramValue
        this.obj = {cnfType:data.exts.paramValue,cnfTypeName:data.exts.paramName}

        //this.getResource(data.id)
        this.getCnfanTable({cnfType:data.exts.paramValue})
        /*  }else{
              this.id = ""
          }*/


      },
      handleSelect(val){
        this.type = val
        //请求数据
      },
      handleAdd(){
        if(!this.id){
          this.$message("请您选取节点后再添加数据")
          return;
        }
        this.visible = true;
        this.visibleType = 'add'
        // this.cnfan = {};

      },
      handleEdit(row){
        console.log(row)
        this.visible = true;
        this.visibleType = 'edit'
        this.cnfan = {...row}
        if(row.hasOwnProperty('cnfFieldValues') && row.cnfFieldValues === 'remote'){
          this.cnfValue = JSON.parse(row.cnfFieldValues)
        }else{
          this.cnfValue = [
            {label: "", value: ""}
          ]
        }
      },
      handleOk(){

        this.$refs['cnfan'].validate((valid) => {
          //console.log("======================")
          //console.log(valid)

          if(valid){

            if(this.cnfan.hasOwnProperty('id')){
              if(this.cnfan['cnfFieldType'] === 'input'){

                this.putCnfanType({...this.obj,...this.cnfan,...{cnfFieldValues:""}})
              }else{
                this.putCnfanType({...this.obj,...this.cnfan})
              }

            }else{
              this.addCnfanType({...this.obj,...this.cnfan})
            }
          }else{
            return
          }


        })


      },
      handleSelectionChange(val){
        this.selection = val

      },
      handleRemove(){
        let hasName = this.selection.some(index => index.cnfField === 'name')
        if(hasName){
          this.$message("默认必须有name属性不能删除")
          return
        }
        let hasCode = this.selection.some(index => index.cnfField === 'code')
        if(hasCode){
          this.$message("默认必须有code属性不能删除")
          return
        }

        //
        if(this.selection.length <= 0){
          this.$alert("请正确选择需要操作的记录！", "警告", {
            confirmButtonText: "确定"
          });
          return
        }
        let arr = []
        for(let index of this.selection){
          arr.push(index.id)
        }



        this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteCnfanType(arr)
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });

      },
      handleShow(){
        console.log(this.cnfan)

        this.cnfValue.push({
          label: "",
          value: ""
        })
      },
      handleSave(cnfan){
        this.$set(this.cnfan,'cnfFieldValues',JSON.stringify(this.cnfValue))
      },
      handleClose(){
        this.visible = false
        this.cnfan = {}
        this.cnfValue = [
          {label: "", value: ""}
        ]
      },
      handleRe(index){
        this.cnfValue.splice(index,1)
      },
      handleClick(val){
        this.cnfan.orgFieldValueType = val.paneName
      },

      handleCancel(){
        this.visible = false;
        this.$refs["cnfan"].resetFields();
        this.cnfan = {}
      }


    }
  }
</script>
<style lang="scss" scoped>
  .container{
    // background-color: #ffffff;
    overflow: hidden;
    height: 100%;
  }
  .tree_box{
    padding:20px 10px 30px 20px;
  }
  .table_box{
    padding:20px 30px 30px 0;
    text-align: right;
  }
  /deep/.el-tree{
    border:1px solid #DCDFE6;
  }
  .btn_group{
    text-align:right;
    margin-bottom:20px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  //设置按钮
  .el-button--mini{
    border-radius: 0;
  }
  // 添加弹出框
  .el-form {
    padding: 30px;

  }
  .el-dialog__body .el-input{
    padding:7px;
  }

  // 左侧
  .el-col-8{
    background-color: #fff;
    // padding:20px 30px;
    height: 100%;
    min-height: 845px;
    box-sizing: border-box;
  }

  // 右侧
  .el-col-16{
    background-color: #fff;
    padding:0px 30px;
    width: 65.26667%;
    margin-left: 1.4%;
    height: 100%;

  }

  // 弹出框选择select最后一行
  .el-col-24{
    height: 50px;
    line-height: 50px;
  }
  .el-button--medium{
    margin: 13px 0 0 8px;
  }
  .el-input{
    padding: 7px 0;
  }
  .el-select{
    padding: 7px 0;
  }
  /deep/.el-form-item__error{
    position: static!important;
  }
  /deep/.el-dialog__body{
    .el-input__inner{
      width: 300px;
    }
    .el-textarea {
      width: 300px;
    }
    .el-tab-pane{
      .peizhi{
        .el-input__inner{
          width: 220px;
        }
      }
      .el-input__inner{
        width: 205px;
      }
      .el-button{
        font-size: 14px;
        height: 31px;
        padding: 0px 10px;
      }
      .del{
        height: 36px;
        padding: 5px 15px;
        margin-top: 13px;

      }
    }

  }

</style>
