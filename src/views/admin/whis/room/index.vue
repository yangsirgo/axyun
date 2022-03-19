
<template>
  <div class="container">
    <div class="header-button">
      <el-button type="primary" size="mini" @click="handleAdd">添加病房</el-button>
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

      <el-table-column prop="roomName" label="病房名称"></el-table-column>
      <el-table-column prop="wardCode" label="病房代码"></el-table-column>
      <el-table-column prop="roomType" label="房间类型"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click.native.prevent="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click.native.prevent="handleClick(scope.row)" type="text" size="small">关联病区</el-button>
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

    <el-dialog
      :visible.sync="dialogVisible1"
      :title="dialogType==='edit'?'编辑病房':'新建病房'"
      :before-close="handleClose1"
    >
      <el-form
        :model="room"
        label-width="90px"
        label-position="right"
        ref="rform"
        :rules="rules"
        style="height:360px;overflow-y:auto"
      >
        <el-form-item label="病房名称" prop="roomName">
          <el-input v-model="room.roomName" placeholder="请输入病房名称" style="width:300px;" />
        </el-form-item>
        <el-form-item label="病房代码" prop="wardCode">
          <el-input v-model="room.wardCode" placeholder="请输入病房代码" style="width:300px;" />
        </el-form-item>
        <el-form-item label="房间类型" prop="roomType">
          <el-input v-model="room.roomType" placeholder="请输入房间类型" style="width:300px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="mini" type="primary" @click="handleOk1">确 定</el-button>
        <el-button round size="mini" @click="handleClose1">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 关联病房 -->
    <el-dialog :visible.sync="dialogVisible" title="关联病区" :before-close="handleClose">
      <div class="treeBox" style="height:360px;overflow-y:auto">
        <el-table
          :data="patientAreaData"
          style="width:97%;padding-left:30px;overflow-y:auto;margin-top:30px"
          ref="AreaTable"
          height="250px"
          @select-all="handleSelection"
          @select="handleSelection"
          :row-key="getRowKeys"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="wardName" label="病区名称"></el-table-column>
          <el-table-column prop="wardCode" label="病区代码"></el-table-column>
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
import {
  getRoomAll,
  getSelectRoom,
  addRoom,
  editRoom,
  removeRoom,
  addRoomRelation
} from "@/api/admin/whis/room";
import { getWardAll } from "@/api/admin/whis/ward";
export default {
  data() {
    return {
      tableData: [],
      params1: {
        pageNo: 1,
        pageSize: 10,
        orderBy: "updated_at desc"
      },
      total1: 0,
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
      room: {},
      rules: {
        roomName: [
          { required: true, message: "请输入病房名称", trigger: "blur" }
        ],
        wardCode: [
          { required: true, message: "请输入病房编码", trigger: "blur" }
        ],
        roomType: [
          { required: true, message: "请输入房间类型", trigger: "blur" }
        ]
      },
      wardIds: [],
      roomIds: [],
      roomTree: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      patientAreaData: [],
      patientArea: [],
      pareaIds: [],
      roomfunId: "", //选中房间id
      dataVersion: 1
    };
  },
  created() {
    this.getPageData();
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.AreaTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.AreaTable.clearSelection();
      }
    },
    getRowKeys(row) {
      return row.id;
    },
    handleSelection(selection, row) {
      let sid = row.id+""
      //console.log("row------------", );
      if (this.wardIds.indexOf(sid) <= -1) {
        // console.log("indexOf------------", sid);
        this.wardIds.push(sid);
      } else {
        this.wardIds = [...this.wardIds.filter(it => it !== sid)];
      }
     // console.log("this.wardIds------------", this.wardIds);
     // this.wardIds = [...Array.from(new Set(this.wardIds))];
    },

    // 加载数据


    getPageData(){
       this.params.orderBy=" order by UPDATED_AT desc"
       
       getRoomAll(this.params).then(res=>{
          console.log("res```",res)
          this.tableData=res.data;
          this.total = res.total
       })

    },
    changeSize(obj) {
      let val = {
        pageNo: obj.page
      };
      this.params = { ...this.params, ...val };
      this.getPageData();
    },
    // 添加
    handleAdd() {
      this.dialogVisible1 = true;
      this.dialogType = "add";
      this.room = {};
    },
    // 删除选中
    handleRemove() {
      if (this.roomIds.length <= 0) {
        this.$alert("请正确选择需要操作的记录！", "警告", {
          confirmButtonText: "确定"
        });
        return;
      }
      //删除选中的记录
      //判断选中那些
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteRoom();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 点击编辑
    handleEdit(row) {
      console.log(row);
      this.dialogVisible1 = true;
      this.dialogType = "edit";
      this.room = { ...row };
    },
    // 删除当前
    handleDelete(row) {
      // 删除当前行数据
      this.$confirm("此操作将永久删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.handleRemoveRoom(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除单行数据
    handleRemoveRoom(row) {
      let arr = [];
      arr.push(row.roomId);
      this.roomIds = [...arr];
      console.log("roomIds----", this.roomIds);
      this.deleteRoom();
    },
    // 删除操作
    deleteRoom() {
      removeRoom(this.roomIds).then(res => {
        if (res.code == 1) {
          this.getPageData();
          this.$message("删除数据成功");
        } else {
          this.$message("删除数据失败");
        }
      });
    },
    // 关联病区
    handleClick(row) {
      console.log("row", row);
      this.dialogVisible = true;
      console.log(row);
      this.roomfunId = row.roomId;
      this.getSelectIds();
    },
    changeSize1(obj) {
      let val = {
        pageNo: obj.page
      };
      this.params1 = { ...this.params1, ...val };
      this.getAllAreaData();
    },
    // 获取选中病区id数据
    getSelectIds() {
      console.log("this.roomfunId", this.roomfunId);
      getSelectRoom({ roomId: this.roomfunId }).then(res => {
        console.log("res-res--roomfunid", res);
        this.wardIds = res.data;
      });
      this.getAllAreaData();
    },
    // 获取所有数据
    getAllAreaData() {
      getWardAll(this.params1).then(res => {
        console.log("res", res);
        this.patientAreaData = res.data;
        this.total1 = res.total;
        let datas = Array.from(new Set(this.wardIds));
        console.log(datas);
        if (this.wardIds.length > 0) {
          datas.map(item => {
            this.patientAreaData.map((items, index) => {
              if (item == items.id) {
                console.log(
                  "this.patientAreaData[item]",
                  this.patientAreaData[index]
                );
                this.$nextTick(() => {
                  this.toggleSelection([this.patientAreaData[index]]);
                });
              }
            });
          });
        }
      });
    },
    //编辑新建框确认
    handleOk1() {
      this.dialogVisible1 = false;
      this.$refs["rform"].validate(valid => {
        if (!valid) return;
        //判断是新建还是编辑，调用相关方法
        if (!this.room.roomId) {
          this.handleAddRoom();
        } else {
          this.handleEditRoom(this.room.dataVersion);
        }
      });
    },
    // 增加病房
    handleAddRoom() {
      this.room = {
        ...this.room,
        sexPermission: 3,
        dataVersion: this.dataVersion
      };
      console.log("room", this.room);
      addRoom(this.room).then(res => {
        if (res.code === 1) {
          this.$message({
            message: "数据添加成功",
            type: "success"
          });
          this.getPageData();
        } else {
          this.$message({
            message: res.msg || "数据添加失败",
            type: "error"
          });
        }
        this.$refs.rform.resetFields();
        this.room = {};
      });
    },
    // 编辑病房
    handleEditRoom(dataVersion) {
      this.room = { ...this.room, sexPermission: 3, dataVersion: dataVersion };
      console.log(this.room);
      editRoom(this.room).then(res => {
        console.log("res", res);
        if (res.code === 1) {
          this.$message({
            message: "数据修改成功",
            type: "success"
          });
          this.getPageData();
        } else {
          this.$message({
            message: res.msg || "数据修改失败",
            type: "error"
          });
        }
        this.$refs.rform.resetFields();
        this.room = {};
      });
    },
    //编辑新建框 取消按钮
    handleClose1() {
      this.dialogVisible1 = false;
      this.room = {};
      this.$refs["rform"].resetFields();
    },
    // 选中的
    handleSelectionChange(val) {
      let arr = [];
      for (let index of val) {
        arr.push(index.roomId);
      }
      this.roomIds = [...arr];
    },
    //关联病床确认按钮
    handleOk() {
      this.dialogVisible = false;

      let obj = {
        roomId: this.roomfunId,
        wardIds: this.wardIds
      };
      this.addroomRelation(obj);
      this.$refs.AreaTable.clearSelection();
    },
    //  关联病区
    addroomRelation(obj) {
      console.log("obj", obj);
      addRoomRelation(obj).then(res => {
        console.log("res--ROOMIDS----", res);
         if(res.code==1){
             this.$message("关联病区成功")
         }else{
             this.$message("关联病区失败")
         }
      });
      this.wardIds=[];
    },
    //  关联病床取消按钮、
    handleClose() {
      this.dialogVisible = false;
      this.$refs.AreaTable.clearSelection();
    },
    queryHandle(item) {
      this.params.pageNo = 1;
      this.getPageData();
    },
    handleQuery() {
      let val = {
        pageNo: 1
      };
      this.params = { ...this.params, ...val };
      this.getPageData();
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
  width: 300px;
}
// /deep/.el-input__inner{
//     width: 300px;

// }
//     .page{
//  /deep/.el-dialog__body {
//       .el-input__inner{
//         width:300px;
//       }
//     }
//     }

/deep/.el-pagination {
  text-align: right;
}
/deep/.el-pagination {
  /deep/.el-input__inner {
    height: 28px !important;
  }
}
/deep/.digpage {
  .el-pagination .el-select .el-input .el-input__inner {
    padding-right: 25px;
    border-radius: 3px;
    width: 85px;
  }
  /deep/.el-dialog__body .el-input__inner {
    width: 30px;
  }
  .pages {
    /deep/.el-input__inner {
      width: 30px;
    }
    /deep/.el-pagination__sizes {
      width: 10px;
    }
    /deep/.el-input--suffix {
      width: 10px;
    }
  }
}
</style>
