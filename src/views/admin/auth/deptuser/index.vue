<template>
    <div class="app-container" >
        <el-button type="primary" @click="handleRelevance">添加</el-button>
        <el-button  type="primary"  @click="handleQuery">查询</el-button>
        <el-table
                :data="tableData"
                style="width: 100%;overflow-y:auto;"
                height='410'
        >
            <el-table-column
                    prop="deptName"
                    label="科室"
                    width="200"
                    align='center'>
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="用户"
                    width="200"
                    align='center'>
            </el-table-column>
            <el-table-column
                    label="功能总数"
                    width="200"
                    align='center'>
                <template slot-scope="scope">
                    <span>{{scope.row.reses.length}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="功能"
                    align='center'
            >
                <template slot-scope="scope">
                    <el-button size="mini" type='primary' class="lookbtn"  v-if="scope.row.reses.length>0" @click="checkInfo(scope.row)" >查看</el-button>
                    <div v-else>
                        无功能
                    </div>
                    <!-- <ul>
                        <li v-for="item in scope.row.reses" :key="item.resIds">{{item.resName}}</li>
                    </ul> -->
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align='center'>
                <template slot-scope="scope">
                    <!--<el-button @click.native.prevent="handleEdit(scope.row)" type="text" size="small">编辑</el-button>-->
                    <el-button @click.native.prevent="handleRemove(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="relevanceTotal>0" :total="relevanceTotal" :pageSize.sync="relevanceParams.pageSize" :page.sync="relevanceParams.pageNo" @pagination="handleChangeSize" />
        <el-dialog
                title="用户关联功能"
                class="user"
                :visible.sync="dialogVisible"
                :before-close="handleClose"
                width="60%"
                :close-on-click-modal="false"

        >
            <el-form :model="relevance" label-position="left" label-width="80px" ref="relevance" >
                <el-form-item label="部门" prop="name" v-if="deptShow">
                    <el-input type="text" v-model="newDeptName" :disabled="deptShow"></el-input>
                </el-form-item>

                <el-form-item label="部门" prop="name" v-else label-width="80px" >
                    <el-select v-model="relevance.deptId" placeholder="请选择" multiple collapse-tags default-first-option>
                        <el-option :value="mineDept" style="height:300px;overflow-y:auto" disabled>
                            <el-tree
                                    :data="data"
                                    :expand-on-click-node="false"
                                    show-checkbox
                                    node-key="id"
                                    ref="tree"
                                    highlight-current
                                    :props="defaultProps"
                                    :check-strictly="true"
                                    @check-change="handleCheckChange"
                            >

                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户" prop="userNo" label-width="80px" >
                    <el-select
                            v-model="relevance.userId"
                            filterable
                            :disabled="deptShow"
                    >
                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动时间" label-width='80px'>
                    <el-date-picker
                            v-model="rangeDate"
                            type="datetimerange"
                            :default-time="['00:00:00', '23:59:59']"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-table
                        :data="resourceData"
                        style="width:100%;padding: 0px;height:200px;overflow-y:auto"
                        ref="resourceTable"
                        height='200'
                        @current-change="handleSelectionChange"
                        :row-key="getRowKeys"
                        :close-on-click-modal="false"
                >
                    <el-table-column
                            label="单选"
                            width="100">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.checked"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column
                            type="index"
                            label="序号"
                            width="100px"
                            header-align="center"
                            align="center"
                    ></el-table-column>
                    <el-table-column
                            prop="code"
                            label="资源编码"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="资源类型"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="资源名称"
                            width="180">
                    </el-table-column>
                </el-table>
                <pagination v-show="total>0" :total="total" :pageSize.sync="params.pageSize" :page.sync="params.page" @pagination="changeSize" />

                <div style="text-align:right;" class="footer">
                    <el-button type="primary"  size="mini" @click="handleOk">确认</el-button>
                    <el-button type="primary"  size="mini" @click="handleClose">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 查看功能弹出框 -->
        <el-dialog
                title="功能信息"
                :visible.sync="funVisible"
                width="50%"
                :before-close="handleViewDialog"
                class="functioninfo"
                :close-on-click-modal="false"
        >
            <el-table
                    :data="tagsData"
                    style="width: 100%"
                    border>
                <el-table-column
                        label="起始时间—结束时间"
                        width="380"

                >
                    <template  slot-scope="{row,$index}">
                        <template v-if="row.edit">

                            <el-date-picker
                                    @change=changeTime($event,row,$index)
                                    v-model="row.time"
                                    type="datetimerange"
                                    :default-time="['00:00:00', '23:59:59']"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>


                        </template>
                        <span v-else>{{row.startTime}}{{row.startTime || row.endTime ? '至' : ''}}{{row.endTime}}</span>
                    </template>

                </el-table-column>

                <el-table-column
                        prop="resName"
                        label="功能名称"
                        width="200px"
                >

                </el-table-column>
                <el-table-column
                        prop="desc"
                        label="功能描述"

                >

                </el-table-column>
                <el-table-column
                        label="状态"
                >
                    <template slot-scope="{row}">
                        <span>{{row.useable ==='1' ? '有效':' 无效' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align='center'>
                    <template slot-scope="{row,$index}">
                        <template v-if="row.edit">
                            <el-button type="primary" size="mini"  @click="handleSave(row)">保存</el-button>
                            <el-button type="primary" size="mini"  @click="row.edit=!row.edit">取消</el-button>
                        </template>
                        <template v-else>
                            <el-button type="primary" size="mini"  @click="handleEdit1(row,$index)">编辑</el-button>
                            <el-button type="primary" size="mini"  @click="handleRemove1(row)">删除</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total1>0" :total="total1" :pageSize.sync="params1.pageSize" :page.sync="params1.pageNo" @pagination="changeSize1" />
            <span slot="footer" class="dialog-footer">

              <el-button type="primary" @click="handleViewDialog()" >确定</el-button>
              <el-button type="primary"  @click="handleViewDialog()" style="margin-left:10px;">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
  import {
    getRoleList,
    getDeptList,
    getBizRes,
    addRoleRes,
    RoleResList,
    DelRoleRes
  } from "@/api/admin/role";
  import {
    queryUsers,
    addUserRes,
    UserResList,
    DelUserRes,
    fetchTags,
    editUserRes,
    deleteUserRes
  } from '@/api/admin/user'
  import {getResourceAll} from "@/api/admin/resource";
  import {arrayToTree} from"@/utils"
  import {dateFtt} from '@/utils'
  import {debounce} from 'lodash/debounce'
  export default {
    data(){
      return{
        reses: [],
        funVisible: false,
        tableData: [
        ],
        relevance: {

        },
        dialogVisible: false,
        mineDept: [],
        defaultProps: {
          children: "children",
          label: "orgNm"
        },
        data: [
        ],
        options: [],
        resourceData:[],
        resIds:[],
        params: {
          pageNo: 1,
          pageSize: 10,
          type: 'biz'
        },
        params1: {
          pageNo: 1,
          pageSize: 10,
          userId: "",
          deptId: ""
        },
        total:0,
        total1:0,
        relevanceParams: {
          pageNo: 1,
          pageSize: 10
        },
        relevanceTotal: 0,
        newDeptId: null,
        newDeptName: "",
        deptShow: false,
        rangeDate: [],
        tableParams: {},
        tagsData: []
      }
    },
    mounted(){

      this.RoleResList()
    },
    methods:{
      deleteUserRes(params){
        deleteUserRes(params)
          .then(res => {
             if(res.code === 1){
               this.$message('删除成功')
               this.fetchTags()
             }else{
               this.$message("删除失败")
             }
          })

      },
      editUserRes(params){
        editUserRes(params)
          .then(res=>{
            if(res.code === 1){
              this.$message('修改成功')
              this.fetchTags()
            }else{
              this.$message('修改失败')
            }
          })
      },
      fetchTags(){
        fetchTags(this.params1)
          .then(res=>{
            if(res.code === 1){
              for(let index of res.data){
                index.edit = false
                index.time = [index.startTime,index.endTime]
              }

              this.tagsData = res.data;
              console.log(this.tagsData)
              this.total1 = res.total
              this.funVisible = true
            }else{
              this.$message('获取数据失败')
            }
          })
      },
      DelRoleRes(params){
        DelUserRes(params)
          .then(res => {
            if(res.code === 1){

              this.$message('删除数据成功')
              this.RoleResList()
            }else {
              this.$message('删除数据失败')
            }
          })
      },

      RoleResList(){
        UserResList(this.relevanceParams)
          .then(res =>{
            if(res.code === 1){
              for(let index of res.data){
                index.checked = false
              }
              this.tableData = res.data
              this.relevanceTotal = res.total
            }else{
              this.$message('获取数据失败')
            }
          })
      },

      checkInfo(val){

        this.params1.deptId = val.deptId
        this.params1.userId = val.userId
        this.fetchTags()
      },
      // 关闭弹窗
      handleClosed(done) {
        this.funVisible=false;
      },
      addRoleRes(parmas){
        addUserRes(parmas)
          .then(res=>{
            console.log(res)
            if(res.code === 1){
              this.$message('授权成功')
              this.RoleResList()
            }else{
              this.$message('授权失败: ' + res.msg);
            }

            this.dialogVisible = false;
            this.resIds = []
            this.mineDept = []
            this.relevance = {}
            this.newDeptId = null
            this.deptShow = false
            this.rangeDate = []
            this.tableParams = {}
            this.$refs.relevance.resetFields();
          })
      },
      getResourceAll() {
        getBizRes(this.params)
          .then(res => {
            if (res.code === 1) {
              for(let index of res.data){
                index.checked = false
              }
              this.resourceData = res.data
              this.total = res.total

              let datas = Array.from(new Set(this.resIds))
              if(this.resIds.length > 0){
                datas.map(item=>{
                  this.resourceData.map((items,index)=>{
                    if(item === items.id){
                      this.$nextTick(()=>{
                        this.toggleSelection([this.resourceData[index]])
                      })
                    }
                  })
                })
              }
            } else {
              this.$message('获取数据失败')
            }
          })
      },
      getRoleList(){
        queryUsers()
          .then(res => {
            if(res.code === 1){
              this.options = res.data;
            }else{
              this.$message('获取数据失败')
            }
          })
      },
      getDeptList(){
        getDeptList()
          .then(res=>{
            if(res.code === 1){
              this.data = arrayToTree(res.data,'id','parentId');
            }else{
              this.$message('获取数据失败')
            }
          })
      },
      toggleSelection(rows){
        if(rows){
          rows.forEach(row=>{
            this.$refs.resourceTable.toggleRowSelection(row)
          })
        }else{
          this.$refs.resourceTable.clearSelection()
        }
      },
      handleRelevance(){
        this.deptShow = false
        this.dialogVisible = true
        this.getResourceAll()
        this.getDeptList()
        this.getRoleList()
      },
      handleClose(){
        this.dialogVisible = false
        this.resIds = []
        this.mineDept = []
        this.relevance = {}
        this.newDeptId = null
        this.deptShow = false
        this.rangeDate = []
        this.tableParams = {}
        this.$refs.relevance.resetFields();
      },
      handleOk(){
        this.$refs.relevance.validate(valid => {
          if (valid) {
            const resIds = this.resourceData.filter(item=> item.checked === true)
            if(resIds.length > 0){
              let resIdArr = []
              resIdArr.push(resIds[0].id)
              let deptId = null
              if(this.newDeptId){
                deptId = this.newDeptId
              }else{
                deptId = this.mineDept[0].id
              }
              let obj = {
                deptId: deptId,
                resIds: resIdArr,
                userId: this.relevance.userId
              }
              this.addRoleRes({...obj,...this.tableParams})
            }else {
              this.$message('请选择功能')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      handleCheckChange(data,checked,node) {
        console.log("-------------------------")
        if(checked === true){
          this.$refs.tree.setCheckedNodes([data])
        }
        let res = this.$refs.tree.getCheckedNodes(); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
        let arrLabel = [];
        let arr = [];
        res.forEach(item => {
          arrLabel.push(item.orgNm);
          arr.push(item);
        });
        this.mineDept = arr;
        this.relevance.deptId = arrLabel;
        console.log("===================================")
        console.log(this.relevance.deptId)
      },
      handleClick(data){
        console.log('===============')
        console.log(data)
        this.$refs.tree.setCheckedNodes([data])
      },
      handleSelection(selection,row){
        if(this.resIds.indexOf(row.id) <= -1){
          this.resIds.push(row.id)
        }else{
          this.resIds = [...this.resIds.filter(it=>it !== row.id)]
        }

        this.resIds = [...Array.from(new Set(this.resIds))]
      },
      getRowKeys(row){
        return row.id
      },
      changeSize(obj){
        let val = {
          pageNo:obj.page,
          pageSize:obj.pageSize
        }
        this.params = {...this.params, ...val}
        this.getResourceAll()
      },
      handleChangeSize(obj){
        let val = {
          pageNo:obj.page,
          pageSize:obj.pageSize
        }
        this.relevanceParams = {...this.relevanceParams, ...val}
        this.RoleResList()
      },
      handleEdit(row){
        this.dialogVisible = true
        this.getResourceAll()
        this.getDeptList()
        this.getRoleList()
        this.$nextTick(()=>{
          this.newDeptId = row.deptId
          this.newDeptName = row.deptName
          this.deptShow = true
          this.relevance = {
            deptId:row.deptId,
            userId:row.userId
          }
          this.rangeDate = [row.reses[0].startTime ? row.reses[0].startTime  : "",row.reses[0].endTime ? row.reses[0].endTime : ""]

          const arr = [...row.reses]
          console.log(arr)
          for(let index of arr){
            this.resIds.push(Number(index.resId))
          }
        })
      },
      handleRemove(row){
        let obj = {
          deptId: row.deptId,
          userId: row.userId
        }
        this.$confirm("您是否要删除当前数据?", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.DelRoleRes(obj);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      handleRemove1(row){
        let obj = {
          deptId: row.deptId,
          userId: row.userId,
          resId:row.resId
        }
        this.$confirm("您是否要删除当前数据?", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteUserRes(obj);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      handleSelectionChange (row) {
        this.resourceData.forEach(item => {
          // 排他,每次选择时把其他选项都清除
          if (item.id !== row.id) {
            item.checked = false
          }
        })
        console.log(this.resourceData)
      },
      changeSize1(){
        let val = {
          pageNo:obj.page,
          pageSize:obj.pageSize
        }
        this.params1 = {...this.params1, ...val}
        this.fetchTags()
      },
      changeTime(event,row,$index){
        console.log("============")
        console.log(event)
        console.log(row)
        console.log($index)

       let obj = {...row,...{time:[dateFtt(event[0]),dateFtt(event[1])],startTime: dateFtt(event[0]),endTime: dateFtt(event[1])}}
        this.tagsData[$index] = obj
        this.$set(this.tagsData,$index,this.tagsData[$index])
        console.log(this.tagsData)
      },
      handleSave(row){
          console.log(row)
          let obj = {
            deptId:row.deptId,
            resId:row.resId,
            userId:row.userId,
            startTime:row.startTime,
            endTime:row.endTime,

          }
          this.editUserRes(obj)
      },
      handleEdit1(row,$index){
          this.tagsData.forEach((item,index)=>{
            if(index ===  $index){
              item.edit = true
            }else{
              item.edit = false
            }
          })
          this.tagsData = [...this.tagsData]
          console.log(this.tagsData)
      },
      handleQuery(){
        let val = {
          pageNo: 1
        }
        this.params = {...this.params, ...val}
        this.RoleResList()
      },
      handleViewDialog() {
        this.funVisible = false;
        this.handleQuery();// 刷线一下表格数据
      }

    },
    watch:{
      relevance: function(val){
        console.log("============")
        console.log(val)
      },
      rangeDate: function (newVal, oldVal) {
        console.log(newVal)
        if (newVal.length>0) {
          this.tableParams.startTime = dateFtt(newVal[0])
          this.tableParams.endTime = dateFtt(newVal[1])
        } else {
          this.tableParams.startTime = null
          this.tableParams.endTime = null
        }

        console.log(this.tableParams)
      }
    }
  }
</script>
<style lang="scss" scoped>
    .app-container{
        padding: 20px;
        height: 100%;
        overflow: hidden;
        background-color: #ffffff
    }

    .el-button--medium{
        margin: 0 0 15px 0px;
    }
    .el-form--label-left{
        margin: 20px;
    }
    .el-select{
        margin: 5px 0;
    }
    .el-form-item__label{
        height: 40px;
        line-height: 40px;
    }
    /deep/.el-dialog__body{
        padding:0;
    }
    .el-date-editor{
        width: 300px;
        margin-bottom: 5px;
    }

    //设置按钮
    .el-button{
        border-radius: 0;
    }
    /deep/.el-dialog__body{
        padding: 20px;
        .info{
            height: 30px;
            line-height: 30px;
            margin-bottom: 5px;
        }
        // 设置标签
        .el-tag{
            margin:8px 5px 8px 10px;
            background-color: #ff6a00;
            font-size: 14px;
            padding: 0 12px;
            height:30px;
            line-height: 30px;
        }
    }
    //查看按钮
    .el-button--mini{
        height: 30px;
        font-size: 14px;
        padding: 0px 12px;
    }

    .footer{
        padding:  0 0;
    }
    /deep/.el-dialog{
        //
        .pagination-container{
            padding: 20px 16px;
        }
        .el-form-item{
            .el-input{
                width: 300px;
            }
        }

    }
    /deep/.el-dialog__footer{
        padding: 20px 20px 10px;
    }
    .functioninfo{
        /deep/.el-dialog__body{
            height: 340px;
            overflow-y: auto;
        }
    }
    /deep/.user{
        /deep/.el-tag{
            background-color: #fff;
            font-size: 14px;
            padding: 0 12px;
            height:30px;
            line-height: 30px;
        }
        .el-form--label-left{
            margin: 0 10px 5px;
        }
        /deep/.el-pagination {

            text-align: left;
        }

    }
    /deep/.el-pagination {

        text-align: right;
    }
    //
    /deep/.el-pagination{
        /deep/.el-input__inner{
            height: 28px!important;
        }
    }


</style>
