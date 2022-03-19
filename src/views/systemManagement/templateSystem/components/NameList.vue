<template>
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
          @keyup.enter="doneEdit(index)"
          @keyup.esc="backEdit(index)"
          @click="showDetail(index)"
          v-for="(item,index) in tname"
          :key="index"
          :style="item.isDetail||item.isEdit?'background-color:#FFE1D5':''"
          class="tname-item"
        >
          <span v-show="!item.isEdit">{{item.tempName}}</span>
          <el-input
            class="addInput"
            ref="gain"
            @blur.prevent="doneEdit(index)"
            v-show="item.isEdit"
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
            <ul style="color:#2E323A;font-weight:400" class="operation-box">
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
</template>

<script>
import { getUId, getUN } from "@/utils/crypto";
import diagnosisTemplateAPI from "@/api/systemManagement/templateSystem/diagnosisTemplate";
export default {
  name: "nameList",
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function(el) {
        // 聚焦元素
        el.querySelector("input").focus();
      }
    }
  },
  props: {
    temType: {
      type: String,
      default: "ppt" //person perscription template 个人处方模板
      // dpt department perscription template 科室处方模板
      // pdat person doctor advice template 个人医嘱模板
      // ddat department doctor advice template 科室医嘱模板
      // pdt person diagnosis template 个人诊断模板
      // ddt department diagnosis template 科室诊断模板
    }
  },
  created() {
    this.doSearch();
  },
  mounted() {
    // this.$nextTick()
    // this.$nextTick(() => {
      
    // });
  },
  computed: {
    disabled() {
      // 滑动加载组件禁用状态
      return this.loading || this.noMore;
    }
  },
  data() {
    return {
      loading: false, //左侧模板列表滑动加载状态
      noMore: false, // 左侧模板列表没有更多数据
      searchData: "",
      tname: [
        // {
        //   tempName: "肾结石模版",
        //   backname: "肾结石模版",
        //   isEdit: false,  //是否是编辑状态
        //   popoverIsShow: false, // 是否显示弹出框
        //   isDetail: false //是否是右侧明细条目
        // }
      ],
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共页数
        pageSize: 20 // 每页数据条数
      }
    };
  },
  methods: {
    // 加载列表数据 CLINIC_TYPE
    async load() {
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
      //   if (this.timeVal.length > 1) {
      //     params.timeVal = "3";
      //     params["createdAtStart"] = this.timeVal[0];
      //     params["createdAtEnd"] = this.timeVal[1];
      //   }
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
    doSearch() {
      //根据模板名称模糊查询
      let params = {
        tempName: this.searchData,
        doctorId: getUId(),
        deptId: this.$store.state.user.role.deptId
      };
      let tableList = [];
      diagnosisTemplateAPI.getTempNameList(params).then(res => {
        tableList = res;
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
    addTemplate() {
      this.tname.map(item => {
        item.popoverIsShow = false;
        item.isDetail = false;
      });
      this.tname.unshift({
        name: "",
        backname: "",
        isEdit: true,
        popoverIsShow: false,
        isDetail: false
      });
      this.focusInput(0);
    },
    showDetail(index) {
      this.tname.map(item => {
        item.isDetail = false;
      });
      this.tname[index].isDetail = true;
      this.$emit("getTemplateDetail", this.tname[index].name);
    },
    backEdit(index) {
      this.tname[index].name = this.tname[index].backname;
      this.doneEdit(index);
    },
    doneEdit(index) {
      // if (this.tname[0].name === "") {
      //   this.$message({
      //       type: "warning",
      //       message: "模板名称不可为空!"
      //     });
      // } else {
      this.$confirm("新增模板名称编辑完成, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tname[index].isEdit = false;
          // this.$message({
          //   type: "success",
          //   message: "删除成功!"
          // });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
      // }
    },
    reName(index) {
      this.tname[index].popoverIsShow = false;
      this.tname[index].isEdit = true;
      this.focusInput(index);
    },
    showPopover(id) {
      this.tname.map(item => {
        if(item.id === id){
            item.popoverIsShow = !item.popoverIsShow;
        }else{
            item.popoverIsShow = false;
        }
      });
    },
    delName(index) {
      this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.tname[index].popoverIsShow = false;
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
    focusInput(id) {
      this.$nextTick(function() {
        this.$refs.gain[id].focus();
      });
    }
  }
};
</script>
<style lang='scss' scoped>
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
