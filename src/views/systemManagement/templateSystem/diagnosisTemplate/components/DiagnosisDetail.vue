<template>
  <div class="all-box">
    <copy-dialog ref="dialog" />
    <diagnosis-dialog
      :rowId="rowId"
      :indexGlobal="indexGlobal"
      @showDetail="showDetail"
      ref="diagnosis"
    />
    <diagnosis-dialog
      :dialogType="'change'"
      :indexGlobal="indexGlobal"
      @showDetail="showDetail"
      :title="'诊断修改'"
      :rowData="rowData"
      ref="modify"
    />

    <div class="nameList">
      <div class="top-box">
        <l-card-title>
          <template slot="left">模版名称</template>
        </l-card-title>
        <div class="search-box">
          <el-input
            class="inputFind"
            v-model="searchData"
            placeholder="模版名称查询"
            @keyup.enter.native="doSearch"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="doSearch"></i>
          </el-input>
          <el-button @click="addTemplate" type="primary">新增模版</el-button>
        </div>
      </div>
      <div class="infinite-list-wrapper">
        <ul class="tname-box" v-infinite-scroll="load">
          <li
            @keyup.esc="backEdit(index)"
            @click.self="showDetail(index)"
            v-for="(item,index) in tname"
            :key="index"
            :style="item.isDetail||item.isEdit?'background-color:#FFE1D5':''"
            class="tname-item"
          >
            <span v-show="!item.isEdit">{{item.tempName}}</span>
            <el-input
              class="addInput"
              :ref="'gain'+index"
              @blur="doneEdit(index)"
              v-if="item.isEdit"
              v-model="item.tempName"
              placeholder="请输入内容"
            ></el-input>
            <el-popover
              style="min-width:106px"
              placement="bottom-start"
              :visible-arrow="false"
              width="100"
              trigger="manual"
              v-model="item.popoverIsShow"
            >
              <ul
                @blur.prevent="showPopover(item.id)"
                style="color:#2E323A;font-weight:400"
                class="operation-box"
              >
                <li @click="reName(index)" style="margin-bottom:20px;cursor:pointer">
                  <i class="el-icon-edit"></i>
                  <span>重命名</span>
                </li>
                <li style="cursor:pointer" @click="delName(index)">
                  <i class="el-icon-delete-solid"></i>
                  <span>删除</span>
                </li>
              </ul>
              <div
                @click="showPopover(item.id)"
                v-show="!item.isEdit"
                slot="reference"
                class="ellipsis-box"
              >
                <i ref="ellipsis" class="el-icon-more"></i>
              </div>
            </el-popover>
          </li>
          <p v-if="loading" class="bottom-container">加载中...</p>
          <p v-if="noMore" class="bottom-container">没有更多了</p>
        </ul>
      </div>
    </div>

    <div class="detail">
      <div class="top-box">
        <span v-if="!realName">{{holderName}}</span>
        <p v-else>{{realName}}</p>
        <div class="operation float-right">
          <el-button @click="addDetail" type="primary">添加诊断明细</el-button>
        </div>
      </div>
      <el-table
        hight="300"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        v-loadmore="loadNextPage"
        element-loading-text="加载中..."
      >
        <el-table-column prop="diagType" min-width="141" label="诊断类型"></el-table-column>
        <el-table-column prop="cwFlag" min-width="133" label="中/西医"></el-table-column>
        <el-table-column prop="diagName" min-width="286" label="诊断名称"></el-table-column>
        <el-table-column prop="diagMain" min-width="119" label="主诊断"></el-table-column>
        <el-table-column prop="diagIcd" :show-overflow-tooltip="true" min-width="478" label="诊断描述"></el-table-column>
        <el-table-column prop="diagCode" min-width="207" label="诊断编码"></el-table-column>
        <el-table-column min-width="161" label="操作">
          <template v-slot="{row}">
            <el-button class="modify-button float-left" @click="handleModify(row)">修改</el-button>
            <el-button class="delete-button float-right" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getUId, getUN } from "@/utils/crypto";
import diagnosisTemplateAPI from "@/api/systemManagement/templateSystem/diagnosisTemplate";
import copyDialog from "@/views/systemManagement/templateSystem/components/CopyDialog";
import diagnosisDialog from "./DiagnosisDialog";
export default {
  name: "diagnosisDetail",
  components: {
    diagnosisDialog, //添加明细和修改明细弹窗
    copyDialog //复制模板弹窗
  },
  data() {
    return {
      loading: false, //左侧模板列表滑动加载状态
      noMore: false, // 左侧模板列表没有更多数据
      searchData: "",
      indexGlobal: 0,
      tname: [
        //左侧模板列表
        {
          tempName: "肾结石模版",
          backname: "肾结石模版",
          isEdit: false, //是否是编辑状态
          popoverIsShow: false, // 是否显示弹出框
          isDetail: false //是否是右侧明细条目
        }
      ],
      rowId: "",
      rowData: [],
      holderName: "请选择模版",
      realName: "",
      tableData: [],
      //      tableData: [
      //        {
      //          diagnosisType: "入院诊断",
      //          doctorType: "中医",
      //          diagnosisName: "酒精中毒",
      //          mainDiagnosis: "主诊断",
      //          diagnosisDes: "慢性酒精中毒",
      //          diagnosisCode: "MASDIFHSDIFER"
      //        },
      //        {
      //          diagnosisType: "入院诊断",
      //          doctorType: "中医",
      //          diagnosisName: "肾结石",
      //          mainDiagnosis: "主诊断",
      //          diagnosisDes: "肾结石",
      //          diagnosisCode: "MASDIFHSDIFER"
      //        }
      //      ], // 申请表格详情
      newDetails: [], //添加模板明细详情
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      },
      // table 分页加载必须定义字段
      tlm_isLoading: false
    };
  },
  computed: {
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  created() {
    this.doSearch();
  },
  mounted() {
    // this.loadTable();
  },
  methods: {
    // 滑动加载左侧列表数据 CLINIC_TYPE
    async load() {},
    //根据模板名称模糊查询
    doSearch() {
      let params = {
        tempName: this.searchData,
        doctorId: getUId()
      };
      let tableList = [];
      diagnosisTemplateAPI.getTempNameList(params).then(res => {
        tableList = res;
        console.log("kk:", res);
        tableList.map(item => {
          item.backname = item.tempName;
          item.isEdit = false;
          item.popoverIsShow = false;
          item.isDetail = false;
        });
        this.tname = tableList;
        this.showDetail(0);
      });
    },
    //添加模板
    addTemplate() {
      this.tname.map(item => {
        item.popoverIsShow = false;
        item.isDetail = false;
      });
      this.tname.unshift({
        id: "",
        tempName: "",
        isEdit: true,
        popoverIsShow: false,
        isDetail: false,
        doctorId: getUId(),
        useRange: 1
      });
      this.focusInput(0);
    },
    showDetail(index) {
      //显示模板明细
      this.tname.map(item => {
        item.isDetail = false;
      });
      this.tname[index].isDetail = true;
      let params = {
        tempId: this.tname[index].id
      };
      diagnosisTemplateAPI.getTempDoctorDiag(params).then(res => {
        this.tableData = res.data;
      });
      this.rowId = this.tname[index].id;
      this.indexGlobal = index;
      this.realName = this.tname[index].tempName;
    },
    //撤销重命名
    backEdit(index) {
      this.tname[index].name = this.tname[index].backname;
    },
    doneEdit(index) {
      //结束重命名
      console.log("cs11");
      this.$confirm("模板名称编辑完成, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tname[index].isEdit = false;
          let params = this.tname[index];
          if (params.id == "") {
            diagnosisTemplateAPI.addTempName(params).then(res => {
              if (res != null) {
                this.doSearch();
              }
            });
          } else {
            diagnosisTemplateAPI.updateTempName(params).then(res => {
              if (res != null) {
                this.doSearch();
              }
            });
          }
        })
        .catch();
    },
    //重命名函数
    reName(index) {
      this.tname[index].popoverIsShow = false;
      this.tname[index].isEdit = true;
      this.focusInput(index);
    },
    //显示重命名和删除弹出框
    showPopover(id) {
      this.tname.map(item => {
        if (item.id === id) {
          item.popoverIsShow = !item.popoverIsShow;
        } else {
          item.popoverIsShow = false;
          item.isEdit = false;
        }
      });
    },
    //删除模板
    delName(index) {
      this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tname[index].popoverIsShow = false;
          let params = this.tname[index];
          diagnosisTemplateAPI.deleteTempName(params).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            console.log("dd:", res);
            if (res != null) {
              this.doSearch();
            }
          });
          this.tname.splice(index, 1);
          this.showDetail(0);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //自动聚焦输入框
    focusInput(id) {
      // if (this.$refs.gain) {
      // this.$nextTick(function() {
      // this.$refs.gain[id].focus();
      // this.$refs["gain" + id].focus();
      // });
      // }
      this.$nextTick(() => {
        this.$refs["gain" + id][0].$refs.input.focus();
      });
    },

    // table加载下一页
    loadNextPage() {
      if (this.tlm_noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    // 加载列表数据 CLINIC_TYPE
    async loadTable() {
      // if (!this.receivePatientData.patientId) {
      //   this.tableData = [];
      //   return;
      // }
      // try {
      //   this.tlm_isLoading = true;
      //   let params = {
      //     clinicType: this.typeVal,
      //     timeVal: this.timeVal[0],
      //     patientId: this.receivePatientData.patientId,
      //     ...this.pageParams
      //   };
      //   let response = await getDiagLsit(params);
      //   let tableData = [];
      //   if (response.code == "1") {
      //     tableData = response.data;
      //     this.pageParams = { ...response.pageParams };
      //   }
      //   this.tableData = tableData;
      //   this.tlm_isLoading = false;
      // } catch (error) {
      //   this.tlm_isLoading = false;
      //   this.$message.error(error.msg);
      // }
    },
    getTemplateDetail(newval) {
      this.realName = newval;
    },
    copyTemplate() {
      this.$refs.dialog.isShow = true;
    },
    addDetail() {
      this.$refs.diagnosis.isShow = true;
      console.log(this.$refs.diagnosis.addInfo, "addDetail");
    },
    handleModify(row) {
      this.rowData = row;
      console.log("row:", this.rowData);
      this.$refs.modify.isShow = true;
      console.log(this.$refs.modify.addInfo);
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该条明细, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData.map((item, index) => {
            if (item.id === id) {
              diagnosisTemplateAPI.delTempDoctorDiag(id).then(res => {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              });
              this.tableData.splice(index, 1);
            }
          });
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
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/.el-input-number {
  width: 67px;
  .el-input-number__increase,
  .el-input-number__decrease {
    width: 20px;
  }
  .el-input {
    .el-input__inner {
      padding-left: 10px;
      padding-right: 0;
      text-align: left;
    }
  }
}
/deep/.el-table {
  height: 100%;
  .el-table__body-wrapper {
    height: calc(100% - 30px);
    overflow-y: auto;
  }
}
.all-box {
  width: 100%;
  height: 100%;
  .detail {
    width: calc(100% - 307px);
    height: calc(100% - 70px);
    float: right;
    overflow: visible;
    border-radius: 2px;
    border: 1px solid $l-color-bgcolor-11;
    .top-box {
      width: 100%;
      height: 76px;
      padding: 20px;
      span,
      p {
        float: left;
        font-size: $l-font-size-max;
        font-weight: 500;
        line-height: 36px;
        color: $l-color-fontcolor-4;
      }
      p {
        color: $l-color-fontcolor-3;
      }
      .operation {
        .el-button {
          border-radius: 2px;
        }
      }
    }
    .el-table {
      height: calc(100% - 76px);
      font-size: $l-font-size;
    }
    .modify-button,
    .delete-button {
      width: 68px;
      height: 28px;
      border-radius: 2px;
      margin: 0;
      border: 1px solid $l-color-bgcolor-11;
      background-color: $l-color-bgcolor-14;
      color: $l-color-fontcolor-3;
      
    }
  }
}

/deep/.nameList {
  width: 287px;
  height: calc(100% - 70px);
  float: left;
  overflow: visible;
  border-radius: 2px;
  border: 1px solid $l-color-bgcolor-11;
  margin-right: 20px;
  .top-box {
    width: 100%;
    height: 120px;
    padding: 0 20px;
    .search-box {
      .inputFind {
        width: 162px;
        height: 36px;
      }
      .el-input__inner,
      .el-button {
        border-radius: 2px;
      }
      .el-button {
        width: 80px;
        height: 36px;
        padding: 0;
        float: right;
      }
    }
  }
  .infinite-list-wrapper {
    width: 100%;
    height: calc(100% - 120px);
    .tname-box {
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      .tname-item {
        position: relative;
        width: 100%;
        height: 44px;
        cursor: pointer;
        padding: 0 0 0 20px;
        font-size: $l-font-size;
        font-weight: 400;
        color: $l-color-fontcolor-3;
        line-height: 44px;
        background-color: $l-color-bgcolor-18;
        .addInput {
          width: 265px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateY(-50%) translateX(-50%);
        }
        .el-input__inner {
          border-radius: 2px;
        }
      }
      .tname-item:nth-of-type(even) {
        background-color: #fff;
      }
      .tname-item:hover {
        background-color: $l-color-bgcolor-12;
      }
      .ellipsis-box {
        height: 20px;
        width: 30px;
        float: right;
        .el-icon-more {
          color: #ccb4aa;
          line-height: 44px;
          // display: none;
        }
      }
      .bottom-container {
        text-align: center;
        padding: 20px 0px;
      }
    }
  }
}
</style>
