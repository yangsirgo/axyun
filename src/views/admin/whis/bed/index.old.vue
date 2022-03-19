<template>
  <div class="container">
    <div class="RpCls">
    <div >
      <el-form
        :model="bedForm"
        ref="bedForm"
        class="demo-ruleForm"
        v-loadmore="{
                noMoreVar: tlm_noMore,
                loadingVar: tlm_isLoading,
                value: loadNextPage
              }"
      >

        <el-form-item label prop="wardCode">
          <l-formt-title label="所属病区" >
            <el-input
              class="wardCodeInput"
              v-model="bedForm.wardCode"
              :precision="4"
              step-strictly
              :controls="false"
            ></el-input>
          </l-formt-title>
        </el-form-item>

        <el-form-item label prop="bedType">
          <l-formt-title label="床位类型" >
            <el-input
              class="bedTypeInput"
              v-model="bedForm.bedType"
              :precision="4"
              step-strictly
              :controls="false"
            ></el-input>
          </l-formt-title>
        </el-form-item>

        <el-form-item label prop="bedCode">
          <l-formt-title label="床位号" >
            <el-input
              class="bedCodeInput"
              v-model="bedForm.bedCode"
              :precision="4"
              step-strictly
              :controls="false"
            ></el-input>
          </l-formt-title>
        </el-form-item>

      </el-form>
    </div>
    </div>
    <div class="header-button">
      <el-button type="primary" size="mini" @click="handleAdd">添加床位</el-button>
      <el-button type="primary" size="mini" @click="handleRemove">删除</el-button>
      <el-button type="primary" size="mini" @click="handleQuery">查询</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%;overflow-y: auto"
      ref="table"
      height="410"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="150px" header-align="center" align="center"></el-table-column>
      <el-table-column prop="bedCode" label="床位代码"></el-table-column>
      <el-table-column prop="roomNM" label="房间"></el-table-column>
        <el-table-column prop="nursingRank" label="护理等级"></el-table-column>
      <el-table-column label="状态"  align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.nature==0?"编制":scope.row.nature==1?"临时":"" }}</span>
            </template>
        </el-table-column>
       <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click.native.prevent="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click.native.prevent="handleClick(scope.row)" type="text" size="small">关联病房</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <pagination
        v-show="total>0"
        :total="total"
        :pageSize.sync="params.pageSize"
        :page.sync="params.page"
        @pagination="changeSize"
      />
    </div>
    <!-- 新建病区编辑病区 -->
    <el-dialog
      :visible.sync="dialogVisible1"
      :title="dialogType==='edit'?'编辑床位':'新建床位'"
      :before-close="handleClose1"
    >
      <el-form
        :model="bed"
        label-width="90px"
        label-position="right"
        ref="rform"
        :rules="rules"
        style="height:360px;overflow-y:auto"
      >
        <el-form-item label="护理等级" prop="nursingRank">
          <el-input v-model="bed.nursingRank" placeholder="请输入护理等级" style="width:360px;" />
        </el-form-item>
        <el-form-item label="床位代码" prop="bedCode">
          <el-input v-model="bed.bedCode" placeholder="请输入床位代码" style="width:360px;" />
        </el-form-item>
        <el-form-item label="状态" prop="nature">
          <el-select v-model="bed.nature" placeholder="请选择状态">
                <el-option label="编制" value="0"></el-option>
                <el-option label="临时" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="mini" type="primary" @click="handleOk1">确 定</el-button>
        <el-button round size="mini" @click="handleClose1">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 关联病房 -->
    <el-dialog :visible.sync="dialogVisible" title="关联病房" :before-close="handleClose">
      <div class="treeBox" style="height:360px;overflow-y:auto">
        <el-table
          :data="bedData"
          style="width:97%;padding-left:30px;overflow-y:auto;margin-top:30px"
          ref="BedTable"
          height="250px"
          :row-key="getRowKeys"
        >
             <el-table-column label="" width="25">
       <template slot-scope="scope">
            <el-radio  :label="scope.row.roomId" v-model="roomId"  @change.native="toggleSelection(scope.$index,scope.row)">&nbsp;</el-radio>
        </template>
    </el-table-column>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="roomName" label="病房名称"></el-table-column>
          <el-table-column prop="wardCode" label="病房代码"></el-table-column>
        </el-table>
        <div class="pages">
          <pagination
            v-show="total1>0"
            :total="total1"
            :pageSize.sync="params1.pageSize"
            :page.sync="params1.pageNo"
            @pagination="changeSize1"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round size="mini" @click="handleOk">确认</el-button>
        <el-button type="primary" round size="mini" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRoomAll } from "@/api/admin/whis/room.js";
import { getBedAll,addBed,editBed,removeBed,getSelectBed,addBedRelation,getBed } from "@/api/admin/whis/bed.js";

export default {
  data() {
    return {
      bedForm: {
        wardCode:'',
        bedType:'',
        bedCode:''
      },
      //分页信息
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      params1: {
        pageNo: 1,
        pageSize: 10,
        orderBy: "updated_at desc"
      },
      total1: 0,
      tableData: [],
      params: {
        pageNo: 1,
        pageSize: 10,
        orderBy: "updated_at desc"
      },
      all: "alone",
      total: 1,
      dialogVisible: false,
      dialogVisible1: false,
      dialogType: "add",
      bed: {},
      rules: {
        NURSING_RANK: [
          { required: true, message: "请输入护理等级", trigger: "blur" }
        ],
        bedCode: [
          { required: true, message: "请输入床位编码", trigger: "blur" }
        ]
      },
      bedIds: [],
      bedTree: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      roomId:null,
      bedData: [],
      selectIds: ["r0003", "r0005"],
      bedfunId:'',
      wbed:null
    };
  },
  created() {
      this.getBedData();
  },
  computed: {
    // 控制是否还可以继续加载
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageSize) <=
        this.pageParams.pageNo
      );
    },
  },
  methods: {
    // 分页查询数据
    getBedData(){
//        this.params.orderBy=" order by UPDATED_AT desc"
        console.log(this.params)
      getBed({...this.pageParams,
          wardCode: this.bedForm.wardCode,
        bedType: this.bedForm.bedType,
        bedCode: this.bedForm.bedCode}).then(res=>{
            console.log(res)
            let arr=res.data;
//            for(let i in arr){
//                if(i.NATURE==0){
//                    arr[i].NATURE="编制"
//                }else if(i.NATURE==1){
//                    arr[i].NATURE='临时'
//                }else{
//                     arr[i].NATURE=""
//                }
//            }
            this.tableData=arr
            this.total = res.total

      })
    },

    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.queryCurrentDiag();
    },
    toggleSelection(index,row) {
       console.log("~~~~~~~~~~~~~",row)
         // this.$refs.BedTable.toggleRowSelection(row);
          this.roomId = row.roomId

    },
    getRowKeys(row) {
      return row.id;
    },


    // 添加床位
    handleAdd() {
      this.dialogVisible1 = true;
      this.dialogType = "add";
      this.bed = {};
    },
    // 删除选中床位
    handleRemove() {
      if (this.bedIds.length <= 0) {
        this.$alert("请正确选择需要操作的记录！", "警告", {
          confirmButtonText: "确定"
        });
        return;
      }

      //
           this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
          this.deleteBed();

          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });

    },

    // 编辑
    handleEdit(row) {
      console.log(row);
      this.dialogVisible1 = true;
      this.dialogType = "edit";
      this.bed = { ...row };
    },
    // 删除当前床位
    handleDelete(row){
         this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
               this.handleRemoveBed(row)
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
    },
    // 单行删除操作
    handleRemoveBed(row){
       let arr = []
        arr.push(row.bedId)
        this.bedIds = [...arr]
        this.deleteBed()

    },
    // 删除公共接口
    deleteBed(){
        removeBed(this.bedIds).then(res=>{
            console.log(res)
            if(res.code==1){
                this.getBedData();
                this.$message("删除成功")

            }else{
                 this.$message("删除失败")
            }

        })
    },

    // 关联房间
    handleClick(row) {
        this.wbed = row
      this.dialogVisible = true;
         this.bedfunId = row.bedId;
      this.getSelectIds();
    },
    // 选中数据
    getSelectIds() {
       getSelectBed({bedId:this.bedfunId}).then(res=>{
           console.log("bedID------",res)
           if(res.data.length>0){
                 this.roomId=res.data[0].roomId
           }

       })
       this.getAllRoomData();
    },
    // 获取所有数据
    getAllRoomData() {

     getRoomAll(this.params1).then(res=>{
         this.bedData=res.data
         this.total1=res.total
         console.log("~~~~~",this.roomId,this.bedData)


                this.$nextTick(() => {
               // this.toggleSelection(0,this.roomId);
              });



     })


    },
    changeSize1(obj) {
      let val = {
        pageNo: obj.page
      };
      this.params1 = { ...this.params1, ...val };
      this.getAllAreaData();
    },
    //编辑新建框确认
    handleOk1() {
      this.dialogVisible1 = false;
       this.$refs['rform'].validate((valid) => {
          if (!valid) return;
          if (!this.bed.bedId) {
            this.handleAddBed();
          } else {
            this.handleEditBed();
          }
        })
    },
    // 添加床位
    handleAddBed(){
        this.bed={...this.bed,dataVersion:1,useStatus:0,roomId:0}
        console.log(this.bed)
        addBed(this.bed).then(res=>{
            console.log("res-****",res)
            if (res.code === 1) {
                this.$message({
                message: "数据添加成功",
                type: "success"
                });
                this.getBedData()
            } else {
              this.$message({
                    message: res.msg || '数据添加失败',
                    type: "error"
                    });
            }
            this.$refs.rform.resetFields();
            this.bed = {};
        })
    },
    // 编辑信息
    handleEditBed(){
      editBed(this.bed).then(res=>{
        //   console.log("res+++",res)
            if (res.code === 1) {
            this.$message({
              message: "数据修改成功",
              type: "success"
            });
            this.getBedData()
          } else {
            this.$message({
              message: res.msg || "数据修改失败",
              type: "error"
            });
          }
          this.$refs['rform'].resetFields();
          this.bed = {};
      })
    },
    //编辑新建框 取消按钮
    handleClose1() {
        this.wbed = null
      this.dialogVisible1 = false;
      this.ward = {};
      this.$refs["rform"].resetFields();
    },
    // 选中的床位
    handleSelectionChange(val) {
       console.log("val",val)
        let arr = [];
      for (let index of val) {
        arr.push(index.bedId);
      }
      this.bedIds = [...arr];
    },

    //关联病床确认按钮
    handleOk() {
      this.dialogVisible = false;
      this.wbed.roomId = this.roomId
      //console.log("!!!!",this.wbed)
      this.addBedRelation(this.wbed);
      this.$refs.BedTable.clearSelection();
    },
    addBedRelation(obj){
       editBed(obj).then(res=>{
           if (res.code === 1) {
                this.$message({
                message: "数据添加成功",
                type: "success"
                });
                this.getBedData()
            } else {
              this.$message({
                    message: res.msg || '数据添加失败',
                    type: "error"
                    });
            }
       })
    },
    //  关联病床取消按钮、
    handleClose() {
      this.dialogVisible = false;
      this.$refs.BedTable.clearSelection();
    },
    // 分页
    changeSize(obj) {
      let val = {
        pageNo: obj.page
      };
      this.params = { ...this.params, ...val };
       this.getBedData()
    },
    queryHandle(item) {
      this.params.pageNo = 1;

    },
    handleQuery() {
      let val = {
        pageNo: 1
      };
      this.params = { ...this.params, ...val };
      this.getBedData()

    }
  }
};
</script>
<style lang="scss" scoped>
.textRight {
  text-align: right;
}
//设置按钮
.el-button--mini {
  border-radius: 0;
}
.el-message-box__btns .el-button--small {
  border-radius: 0px !important;
}
.treeBox {
  height: 400px;
  overflow: hidden;
  overflow-y: auto;
}
.container {
  background-color: #ffffff;
  overflow: hidden;
  height: 100%;
  padding: 20px;
}
.header-button {
  padding: 7px 0;
}
// 添加弹出框
.el-form {
  padding: 20px;
}
.selectType {
  padding: 0 0 7px;
}
.el-form-item {
  margin-bottom: 10px;
}

.el-input {
  padding: 0;
}
.el-tree {
  padding-left: 30px;
}

/deep/.el-form-item__error {
  position: static !important;
}

/deep/.el-textarea__inner {
  // width: 300px;
}

// /deep/.el-input__inner{
//     width: 300px;

// }
// /deep/.el-dialog__body {
//   .el-input__inner {
//     width: 300px;
//   }
// }
/deep/.el-pagination {
  text-align: right;
}
/deep/.el-pagination {
  /deep/.el-input__inner {
    height: 28px !important;
  }
}
.RpCls {
.RpClsTitle {
  font-size: 4px;
  font-weight: bold;
  color: rgba(148, 157, 163, 1);
  line-height: 60px;
}

/deep/ .el-form-item {
         margin-bottom: 0;
         margin-right: 20px;
         display: inline-block;
       }

/deep/ .el-form-item__content {
         margin-left: 0 !important;
         line-height: 0;
         margin-top: 10px;
         width: 200px;
       }

.onceDosageInput {
/deep/ .el-input__inner {
         padding-right: 30px;
       }
}
}
</style>
