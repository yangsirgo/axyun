<template>
  <div class="width100 height100 container">
    <div class="right">
      <l-card-title>
        <span slot="left">床位管理</span>
        <span slot="right">
          <el-button type="primary" @click="newAddBed">新增床位</el-button>
        </span>
      </l-card-title>
      <div class="bed-form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="0"
          class="demo-ruleForm"
        >
          <el-form-item prop="wardCode">
            <l-formt-title label="所属病区(或科室)" :required="true">
              <l-value-domain
                remoteUrl="/wadmin/ward-hos?hosId=91"
                :value.sync="ruleForm.wardCode"
                remoteShowKey="wardName"
                remoteValueKey="wardCode"
                placeholder="请选择"
              />
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="sort">
            <l-formt-title label="床位排序">
              <el-input v-model="ruleForm.sort"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="bedNo">
            <l-formt-title label="床位号" :required="true">
              <el-input v-model="ruleForm.bedCode"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="bedType">
            <l-formt-title label="床位类型">
              <l-value-domain
                code="bedType"
                :value.sync="ruleForm.bedType"
                class="select-container"
              />
              <!--<l-value-domain-->
              <!--remoteUrl="/wadmin/ward-hos?hosId=91"-->
              <!--:value.sync="ruleForm.bedType"-->
              <!--remoteShowKey="wardName"-->
              <!--remoteValueKey="wardCode"-->
              <!--placeholder="请选择"-->
              <!--/>-->
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="roomType">
            <l-formt-title label="房间类型">
              <l-value-domain
                code="roomType"
                :value.sync="ruleForm.roomType"
                class="select-container"
              />
              <!--<l-value-domain-->
              <!--remoteUrl="/wadmin/ward-hos?hosId=91"-->
              <!--:value.sync="ruleForm.roomType"-->
              <!--remoteShowKey="wardName"-->
              <!--remoteValueKey="wardCode"-->
              <!--placeholder="请选择"-->
              <!--/>-->
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="roomNo">
            <l-formt-title label="房间号">
              <el-input v-model="ruleForm.roomCode"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="bedTable">
            <div class="form-title" style="margin-bottom:10px;">
              <span>*</span>床位收费项目
              <el-button type="primary" @click="proVisibility = true">添加项目</el-button>
            </div>
            <el-table :data="ruleForm.bedTable" border stripe style="width: 100%">
              <el-table-column prop="chargeItemName" label="收费项目名称" width="140"></el-table-column>
              <el-table-column prop="chargePrice" label="金额"></el-table-column>
              <el-table-column prop="zf" label="自费部分" width="100">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.zf" placeholder="请输入"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="handler" label="操作">
                <template slot-scope="scope">
                  <el-button @click="proRemove(scope.$index)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item prop="hosName">
            <l-formt-title label="院区">
              <el-input v-model="ruleForm.hosName"></el-input>
            </l-formt-title>
          </el-form-item>
          <el-form-item prop="state">
            <div class="form-title">
              <span>*</span>状态
              <el-radio-group v-model="ruleForm.status">
                <el-radio label="1">在用</el-radio>
                <el-radio label="2">停用</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item prop="remark">
            <l-formt-title label="备注">
              <el-input v-model="ruleForm.remark"></el-input>
            </l-formt-title>
          </el-form-item>
        </el-form>
      </div>
      <div class="bed-form-btn">
        <el-button type="primary" @click="saveBed">保存</el-button>
        <el-button type="primary" plain>删除</el-button>
        <el-button type="primary" plain>取消</el-button>
      </div>
    </div>
    <div class="cont">
      <div class="search-input">
        <el-row>
          <el-col :span="16">
            <el-row :gutter="20">
              <el-col :span="8">
                <l-formt-title label="所属病区">
                  <l-value-domain
                    remoteUrl="/wadmin/ward-hos?hosId=91"
                    :value.sync="bedForm.wardCode"
                    remoteShowKey="wardName"
                    remoteValueKey="wardCode"
                    placeholder="请选择"
                  />
                </l-formt-title>
              </el-col>
              <el-col :span="8">
                <l-formt-title label="床位类型">
                  <l-value-domain
                    code="bedType"
                    :value.sync="bedForm.bedType"
                    class="select-container"
                  />
                  <!--<l-value-domain-->
                  <!--remoteUrl="/wadmin/ward-hos?hosId=91"-->
                  <!--:value.sync="bedForm.bedType"-->
                  <!--remoteShowKey="wardName"-->
                  <!--remoteValueKey="wardCode"-->
                  <!--placeholder="请选择"-->
                  <!--/>-->
                </l-formt-title>
              </el-col>
              <el-col :span="8">
                <l-formt-title label="床位号">
                  <el-input v-model="bedForm.bedCode"></el-input>
                </l-formt-title>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8" class="search-btn">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button type="primary" plain @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table-box">
        <el-table :data="tableData" border stripe height="100%" style="width: 100%">
          <el-table-column prop="wardCode" label="所属病区" width="180"></el-table-column>
          <el-table-column prop="sort" label="排序" width="180"></el-table-column>
          <el-table-column prop="bedCode" label="床位号"></el-table-column>
          <el-table-column prop="bedType" label="床位类型">
            <template slot-scope="scope">
              <span :val="scope.row.bedType" code="bedType" v-codeTransform></span>
            </template>
          </el-table-column>
          <el-table-column prop="roomType" label="房间类型">
            <template slot-scope="scope">
              <span :val="scope.row.roomType" code="roomType" v-codeTransform></span>
            </template>
          </el-table-column>
          <el-table-column prop="roomCode" label="房间号"></el-table-column>
          <el-table-column prop="totalPrice" label="收费总金额"></el-table-column>
          <el-table-column prop="zfPrice" label="自费总金额"></el-table-column>
          <el-table-column prop="hosName" label="院区"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="handler" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="tableEdit(scope.row)" size="small">编辑</el-button>
              <el-button type="text" @click="tableRemove(scope.row)" size="small">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="updatedByName" label="操作人"></el-table-column>
          <el-table-column prop="updatedAt" label="操作时间"></el-table-column>
        </el-table>
      </div>
      <div class="pages">
        <pagination
          :total="pageParams.total"
          :pageSize.sync="pageParams.pageSize"
          :page.sync="pageParams.pageNo"
          @pagination="changeSize"
        />
      </div>
    </div>
    <el-dialog title="床位收费项目" :visible.sync="proVisibility" @close="closeDia">
      <div class="grid-table">
        <el-table
          :data="gridData"
          ref="multipleTable"
          border
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column property="chargeItemName" label="收费项目名称"></el-table-column>
          <el-table-column property="chargePrice" label="单价"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPro">确 定</el-button>
        <el-button @click="proVisibility = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBed,
  getItem,
  addBed,
  updateBed,
  getCharItemByBedId,
  deleteBed
} from "@/api/admin/whis/bed.js";
export default {
  data() {
    return {
      bedForm: {
        wardCode: "",
        bedType: "",
        bedCode: ""
      },
      tableData: [{ sort: "1" }],
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0
      },
      ruleForm: {
        wardCode: "",
        bedCode: "",
        sort: "",
        bedType: "",
        roomType: "",
        roomCode: "",
        bedTable: [],
        hosName: "",
        status: "",
        remark: ""
      },
      rules: {
        //        wardCode: [
        //          { required: true, message: "请选择病区", trigger: "change" }
        //        ],
        bedCode: [{ required: true, message: "请输入床号", trigger: "blur" }],
        bedTable: [
          {
            type: "array",
            required: true,
            message: "请添加项目",
            trigger: "change"
          }
        ],
        hosName: [{ required: true, message: "请输入院区", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      proVisibility: false,
      gridData: [
        {
          name: "收费项目1",
          price: 31
        }
      ],
      multipleSelection: []
    };
  },
  created() {
    this.loadTable();
    this.quertyItem();
  },
  methods: {
    newAddBed() {
      this.ruleForm = {};
    },
    handleQuery() {
      this.pageParams.pageNo = 1;
      this.loadTable();
    },
    handleReset() {
      this.bedForm = this.$options.data().bedForm;
    },
    loadTable() {
      getBed({
        ...this.pageParams,
        wardCode: this.bedForm.wardCode,
        bedType: this.bedForm.bedType,
        bedCode: this.bedForm.bedCode
      }).then(res => {
        console.log("hghag:", res);
        let arr = res.data;
        this.tableData = arr;
        this.pageParams.total = res.total;
      });
    },
    changeSize(val) {
      this.pageParams.pageNo = val.page;
      this.loadTable();
    },
    saveBed() {
      this.$refs.ruleForm.validate(valid => {
        console.log("this.ruleForm:", this.ruleForm);
        if (this.ruleForm.bedId == null) {
          // 保存
          let params = {
            bedInfo: this.ruleForm,
            bedChargeItemPOList: this.ruleForm.bedTable
          };
          addBed(params)
            .then(res => {
              if (res.code === 1) {
                this.$message.success("保存成功");
                this.ruleForm = {};
                this.loadTable();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(error => {
              this.$message.error(err);
            });
        } else {
          //修改
          let params = {
            bedInfo: this.ruleForm,
            bedChargeItemPOList: this.ruleForm.bedTable
          };
          updateBed(params)
            .then(res => {
              if (res.code === 1) {
                this.$message.success("修改成功");
                this.loadTable();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(error => {
              this.$message.error(err);
            });
        }
      });
    },
    //查询收费项目
    quertyItem() {
      getItem({
        finClassCode: "21",
        pageNo: 1,
        pageSize: 20
      }).then(res => {
        console.log("gridData:", res);
        let arr = res.data;
        this.gridData = arr;
      });
    },
    addPro() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择收费项目");
      }
      this.multipleSelection.forEach(item => {
        this.ruleForm.bedTable.push({
          ...item,
          zf: ""
        });
      });
      this.proVisibility = false;
    },
    proRemove(index) {
      this.$confirm("是否删除此收费项目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$delete(this.ruleForm.bedTable, index);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    closeDia() {
      this.$refs.multipleTable.clearSelection();
    },
    tableEdit(row) {
      getCharItemByBedId({
        bedId: row.bedId
      }).then(res => {
        console.log("char:", res);
        let arr = res.data;
        this.ruleForm = row;
        this.ruleForm.bedTable = arr;
        console.log("ruleForm:", this.ruleForm);
      });
    },
    //删除床位信息
    tableRemove(row) {
      deleteBed({
        bedId: row.bedId
      })
        .then(res => {
          if (res.code === 1) {
            this.$message.success("删除成功");
            this.loadTable();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(error => {
          this.$message.error(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: $l-color-white;
  overflow: hidden;
}
.right {
  float: right;
  width: 300px;
  height: 100%;
}
.cont {
  margin-right: 300px;
  height: 100%;
  overflow: hidden;
  padding: 20px;
  padding-bottom: 0;
}
.search-input {
  margin-bottom: 20px;
}
.search-btn {
  text-align: right;
}
.table-box {
  height: calc(100% - 130px);
}
.pagination-container {
  padding: 20px 16px;
  /deep/ .el-pagination {
    text-align: right;
  }
  /deep/ .el-pagination__editor.el-input .el-input__inner {
    height: 28px !important;
  }
}
.bed-form-btn {
  text-align: right;
  padding-right: 20px;
}
.bed-form {
  height: calc(100% - 120px);
  padding-right: 20px;
}
.form-title {
  span {
    font-size: 14px;
    padding-left: 5px;
    vertical-align: middle;
    color: #ef0f0f;
  }
  .el-button {
    margin-left: 20px;
  }
}
/deep/ .l-input-wrap .l-input-body {
  vertical-align: top;
}
.el-form-item {
  margin-bottom: 20px;
}
.cardtitle {
  /deep/ .titleright {
    margin-right: 20px;
  }
}
.grid-table {
  padding: 20px;
}
</style>
