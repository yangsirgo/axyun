<template>
  <div class="all-box">
    <copy-dialog ref="dialog" />

    <div class="nameList"> <!-- 左侧模板名称列表 -->
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
            @click="showDetail(index)"
            v-for="(item,index) in tname"
            :key="index"
            :style="item.isDetail||item.isEdit?'background-color:#FFE1D5':''"
            class="tname-item"
          >
            <span v-show="!item.isEdit">{{item.backname}}</span>
            <el-input
              class="addInput"
              :ref="'gain'+index"
              @blur="doneEdit(index)"
              v-show="item.isEdit"
              v-model="item.backname"
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

    <div class="detail">
      <div class="top-box">
        <span v-if="!realName">{{holderName}}</span>
        <p v-else>{{realName}}</p>
        <div class="operation float-right">
          <el-button @click="addDetail" type="primary">添加诊断明细</el-button>
          <el-button @click="copyTemplate(realName)" type="primary">复制模版</el-button>
        </div>
      </div>
      <my-tab-change :tableData="tableData" @mycb="tabseclast">
        <el-table
          hight="300"
          :data="tableData"
          border
          stripe
          style="width: 100%"
          v-loadmore="loadNextPage"
          element-loading-text="加载中..."
        >
          <el-table-column min-width="321" label="药品名称">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.itemName}}</span>
              <el-input v-else v-model="row.itemName" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column min-width="105" label="规格">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.spec}}</span>
              <el-input v-else v-model="row.spec" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column min-width="88" label="单价">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.price}}</span>
              <el-input v-else v-model="row.price" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column min-width="88" label="单次用量">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.oneDosage}}</span>
              <!-- <el-input v-else v-model="row.singleDosage" placeholder='请选择'></el-input> -->
              <el-input-number
                v-else
                v-model="row.oneDosage"
                controls-position="right"
                :min="1"
                placeholder
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column min-width="105" label="用量单位">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.dosageUnit}}</span>
              <!-- <el-input v-else v-model="row.dosageUnit" placeholder></el-input> -->
              <el-select v-else v-model="row.dosageUnit" clearable placeholder="请选择">
                <el-option
                  v-for="(item,index) in option.dosageUnitOptin"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column min-width="120" label="途径">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.useWay}}</span>
              <!-- <el-input v-else v-model="row.channel" placeholder></el-input> -->
              <el-select v-else v-model="row.useWay" clearable placeholder="请选择">
                <el-option
                  v-for="(item,index) in option.channelOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column min-width="105" label="频次">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.frequencyCode}}</span>
              <el-input v-else v-model="row.frequencyCode" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column min-width="105" label="数量">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.quantity}}</span>
              <!-- <el-input v-else v-model="row.quantity" placeholder></el-input> -->
              <el-input-number
                v-else
                v-model="row.quantity"
                controls-position="right"
                :min="1"
                placeholder
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column min-width="105" label="数量单位">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.unit}}</span>
              <!-- <el-input v-else v-model="row.quantityUnit" placeholder></el-input> -->
              <el-select v-else v-model="row.unit" clearable placeholder="请选择">
                <el-option
                  v-for="(item,index) in option.unitOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column min-width="88" label="天数">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.day}}</span>
              <!-- <el-input v-else v-model="row.days" placeholder></el-input> -->
              <el-input-number
                v-else
                v-model="row.day"
                controls-position="right"
                :min="1"
                placeholder
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column min-width="105" label="皮试">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.skinTest}}</span>
              <!-- <el-input v-else v-model="row.skinTest" placeholder></el-input> -->
              <el-select v-else v-model="row.skinTest" clearable placeholder="请选择">
                <el-option
                  v-for="(item,index) in option.skinTestOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column min-width="105" label="金额">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.amt}}</span>
              <el-input v-else v-model="row.amt" placeholder></el-input>
            </template>
          </el-table-column>
          <el-table-column min-width="258" label="备注">
            <template v-slot="{row}">
              <span v-if="!row.isEditing">{{row.remark}}</span>
              <el-input v-else v-model="row.remark" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="!isAddNew" min-width="160" label="操作">
            <template v-slot="{row}">
              <el-button
                v-if="!row.isEditing"
                class="modify-button float-left"
                @click="handleModify(row.templetDetailId)"
              >修改</el-button>
              <el-button
                v-if="row.isEditing"
                class="submit-button"
                @click="handleSubmit(row)"
              >提交修改</el-button>
              <el-button
                v-if="!row.isEditing"
                class="delete-button float-right"
                @click="handleDelete(row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </my-tab-change>
    </div>
  </div>
</template>

<script>
import { getUId, getUN } from "@/utils/crypto";
import diagnosisTemplateAPI from "@/api/systemManagement/templateSystem/diagnosisTemplate";
import myTabChange from "@/views/systemManagement/templateSystem/components/MyTabChange";
import copyDialog from "@/views/systemManagement/templateSystem/prescriptionTemplate/components/CopyDialog";
import {getOutpatientCisTemplate,saveOrUpdateCisTemplate,deleteCisTemplate,getOutpatientCisTemplateDetail,
  batchInsertTemplateDetails,updateTemplateDetails,deleteTemplateDetails} from "@/api/cis/order/order";
export default {
  name: "proscriptionDetail",
  components: {
    copyDialog,
    myTabChange
  },
  props: {

  },
  data() {
    return {
      loading: false, //左侧模板列表滑动加载状态
      noMore: false, // 左侧模板列表没有更多数据
      searchData: "",
      tname: [ //左侧模板列表
        // {
        //   tempName: "肾结石模版",
        //   backname: "肾结石模版",
        //   isEdit: false,  //是否是编辑状态
        //   popoverIsShow: false, // 是否显示弹出框
        //   isDetail: false //是否是右侧明细条目
        // }
      ],
      option: {
        dosageUnitOptin: [
          {
            value: "ml",
            label: "ml"
          },
          {
            value: "g",
            label: "g"
          },
          {
            value: "mg",
            label: "mg"
          }
        ],
        channelOption: [
          {
            value: "1",
            label: "静脉注射"
          },
          {
            value: "2",
            label: "点滴"
          },
          {
            value: "3",
            label: "口服"
          }
        ],
        unitOption: [
          {
            value: "1",
            label: "盒"
          },
          {
            value: "2",
            label: "瓶"
          },
          {
            value: "3",
            label: "袋"
          }
        ],
        skinTestOption: [
          {
            value: "1",
            label: "需要"
          },
          {
            value: "2",
            label: "不需要"
          }
        ]
      },
      isAddNew: false,
      curSelectTableList: [], // 当前已经选中的item
      holderName: "请选择模版",
      realName: "",
      tableData: [], // 申请表格详情
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
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
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
     // 加载左侧列表数据 CLINIC_TYPE
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
        type: "2",
        pageNum: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        name: this.searchData
      };

      getOutpatientCisTemplate(params).then(res => {
        this.tname = [];
        for(let i = 0;i < res.data.length;i++){
          let item = {};
          item.id = res.data[i].id;
          item.backname = res.data[i].templetName;
          item.isEdit = false;
          item.popoverIsShow = false;
          item.isDetail = false;
          item.dataVersion = res.data[i].dataVersion
          this.tname.push(item);
        }
        this.pageParams.pageNo = res.pageNo;
        this.pageParams.pageSize = res.pageSize;
        this.pageParams.total = res.total;
        this.showDetail(0);
      })
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
      this.currentTempId = this.tname[index].id;
      this.getTemplateDetail(this.tname[index].backname);
    },
    backEdit(index) {
      this.tname[index].name = this.tname[index].backname;
      this.doneEdit(index);
    },
    doneEdit(index) {
      this.$confirm("新增模板名称编辑完成, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.tname[index].isEdit = false;
        this.saveOrUpdateTemp(this.tname[index].id,this.tname[index].backname,this.tname[index].dataVersion);
      }).catch(() => {

      });
    },
    reName(index) { //重命名函数
      this.tname[index].popoverIsShow = false;
      this.tname[index].isEdit = true;
      this.focusInput(index);
    },
    showPopover(id) { //显示重命名和左侧删除弹出框
      this.tname.map(item => {
        if(item.id === id){
            item.popoverIsShow = !item.popoverIsShow;
        }else{
            item.popoverIsShow = false;
            item.isEdit = false;
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
          this.deleteCisTemplate(this.tname[index].id,index);
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
      this.loadDetail();
    },
    copyTemplate(realName) {
      this.tableData.map(item => {
        item.templetId = '';
        item.templetDetailId = '';
      })
      this.$refs.dialog.data = {
        // templetName: realName,
        outpatientCisTempDetails: this.tableData
      };
      this.$refs.dialog.isShow = true;
    },
    addDetail() {
      this.isAddNew = true;
      this.tableData.push({
        templetId: this.currentTempId,
        itemName: "", // 药品名称
        spec: "", // 规格
        price: null, //单价
        oneDosage: null, // 单次用量
        dosageUnit: null, //用量单位
        useWay: "", //途径
        frequencyCode: "", //频次
        quantity: null, // 数量
        unit: "", // 数量单位
        day: null, // 天数
        skinTest: "", //皮试
        amt: null, //金额
        remark: "", //备注
        isEditing: true // 是否为编辑状态
      });
    },
    tabseclast() {
      this.$confirm("添加医嘱明细完成, 是否提交?", "提示", {
        confirmButtonText: "提交",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.batchInsertTemplateDetails();
          this.isAddNew = false;
          // 键盘Tab 到最后一个 触发回调事件
          this.tableData.map(item => {
            item.isEditing = false;
          });
          this.$message({
            type: "success",
            message: "提交成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交"
          });
        });
    },
    handleModify(id) {
      this.tableData.map(item => {
        if (item.templetDetailId === id) {
          item.isEditing = true;
        }
      });
    },
    handleSubmit(row) {
      this.$confirm("修改完成准备提交修改, 是否继续?", "提示", {
        confirmButtonText: "提交",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.updateTemplateDetails(row);
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消提交修改"
        });
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该条明细, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteTemplateDetails(row);

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    saveOrUpdateTemp(id, templetName, dataVersion){
      let params = {
        id: id,
        templetName: templetName,
        dataVersion: dataVersion,
        shareLevel: "2",
        templetType: "2"
      };
      saveOrUpdateCisTemplate(params).then(res => {
        if(res.data === 1){
          this.$message({
            type: "success",
            message: "保存成功!"
          });
        }else{
          this.$message({
            type: "error",
            message: "保存失败!"
          });
        }
      }).catch(() => {
        this.$message({
          type: "error",
          message: "保存失败!"
        });
      })
    },
    deleteCisTemplate(id,index){
      let params = {
        id: id
      };
      deleteCisTemplate(params).then(res => {
        if(res.data === 1){
          this.tname[index].popoverIsShow = false;
          this.tname.splice(index, 1);
          this.showDetail(0);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        }else {
          this.$message({
            type: "error",
            message: "删除失败!"
          });
        }
      }).catch(() => {
        this.$message({
          type: "error",
          message: "删除失败!"
        });
      })
    },
    loadDetail(){
      this.tableData = [];
      let params = {
        templateId: this.currentTempId,
        pageNum: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize
      }
      getOutpatientCisTemplateDetail(params).then(res => {
        // this.tableData = res.data;
        res.data.map((item) =>{
          let temp = {};
          temp = item;
          temp.isEditing = false;
          this.tableData.push(temp);
        })
      }).catch(() => {

      })
    },
    batchInsertTemplateDetails(){
      let params = [];
      for(let i = 0;i < this.tableData.length;i++){
        if(this.tableData[i].templetDetailId == '' || this.tableData[i].templetDetailId == null){
          params.push(this.tableData[i]);
        }
      }
      batchInsertTemplateDetails(params).then( res => {
        if(res.data === 1){
          this.$message({
            type: "success",
            message: "批量保存模板明细成功!"
          });
        }else {
          this.$message({
            type: "error",
            message: "批量保存模板明细失败!"
          });
        }
      }).catch(()=>{
        this.$message({
          type: "error",
          message: "批量保存模板明细失败!"
        });
      })
    },
    updateTemplateDetails(row){
      updateTemplateDetails(row).then( res => {
        if(res.data === 1){
          this.tableData.map(item => {
            if (item.templetDetailId === row.templetDetailId) {
              item.isEditing = false;
            }
          });
          this.$message({
            type: "success",
            message: "保存修改模板明细成功!"
          });
        }else {
          this.$message({
            type: "success",
            message: "保存修改模板明细失败!"
          });
        }
      }).catch(() =>{
        this.$message({
          type: "success",
          message: "保存修改模板明细失败!"
        });
      })
    },
    deleteTemplateDetails(row){
      let params = {
        templetDetailId: row.templetDetailId
      }
      deleteTemplateDetails(params).then( res => {
        if(res.data === 1){
          this.tableData.map((item, index) => {
            if (item.templetDetailId === row.templetDetailId) {
              this.tableData.splice(index, 1);
            }
          });
          this.$message({
            type: "success",
            message: "删除医嘱模板明细成功!"
          });
        }else{
          this.$message({
            type: "error",
            message: "删除医嘱模板明细失败!"
          });
        }
      }).catch(()=>{
        this.$message({
          type: "error",
          message: "删除医嘱模板明细失败!"
        });
      })
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
