<template>
  <div class="height100 three-column">
    <!--中间内容-->
    <div id="center" class="column">
      <div class="box">
        <el-card class="height100">
          <div class="top-btn">
            <span class="float-right btn-label" @click="exportExcel"><i class="iconfont icon-dianzibinglikebianjizhuangtai"></i>导出Excel</span>
            <span class="float-right btn-label" @click="print"><i class="iconfont icondayin"></i>打印</span>
            <span class="float-right btn-label" @click="submitData"><i class="iconfont el-icon-success"></i>提交</span>
            <span class="float-right btn-label" @click="save"><i class="iconfont iconzancun"></i>保存</span>
            <span class="float-right btn-label" @click="del"><i class="iconfont iconshanchu"></i>删除</span>
            <span class="float-right btn-label" @click="adds"><i class="iconfont iconxinzeng"></i>新增药品</span>
            <span class="float-right btn-label" @click="newAdd"><i class="iconfont iconxinzeng"></i>新建出库单</span>
          </div>
          <div class="padding20">
            <div class="title">
              药房出库
            </div>
            <div class="apply-info">
              <div>
                <l-formt-title class="disabled form-item" label="出库单号" labelWidth="64">
                  <el-input v-model="applyInfo.inInventoryNum" placeholder="" :disabled="true"></el-input>
                </l-formt-title>
                <l-formt-title class="disabled form-item" label="总金额" labelWidth="52">
                  <el-input v-model="applyInfo.totalAmt" placeholder="" :disabled="true"></el-input>

                </l-formt-title>
              </div>
              <div>
                <l-formt-title class="disabled form-item" label="出库药房" labelWidth="64">
                  <el-input v-model="applyInfo.storageCode" placeholder="" :disabled="true"></el-input>
                </l-formt-title>
                <l-formt-title class="form-item" label="出库类型" labelWidth="64">
                  <el-select v-model="applyInfo.outStorageType" placeholder="">
                    <el-option
                      v-for="item in outStorageTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </l-formt-title>
                <l-formt-title class="form-item" label="出库目标" labelWidth="64">
                  <el-select v-model="applyInfo.outStorageTarget" placeholder="">
                    <el-option
                      v-for="item in outStorageTargetList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </l-formt-title>
              </div>
              <div>
                <l-formt-title class="disabled form-item" label="录入人员" labelWidth="64">
                  <el-input v-model="applyInfo.entryPersonName" placeholder="" :disabled="true"></el-input>
                </l-formt-title>
                <l-formt-title class="disabled form-item" label="录入时间" labelWidth="64">
                  <el-input v-model="applyInfo.entryTime" placeholder="" :disabled="true"></el-input>
                </l-formt-title>
                <l-formt-title class="disabled form-item" label="提交人员" labelWidth="64">
                  <el-input v-model="applyInfo.entryPersonName" placeholder="" :disabled="true"></el-input>
                </l-formt-title>
                <l-formt-title class="disabled form-item" label="提交时间" labelWidth="64">
                  <el-input v-model="applyInfo.entryTime" placeholder="" :disabled="true"></el-input>
                </l-formt-title>
              </div>
              <div>
                <l-tab-change :tableData="tableData" @cb="tablast">
                  <el-table
                    :data="tableData"
                    border
                    stripe
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                    <el-table-column
                      type="selection"
                      width="35">
                    </el-table-column>
                    <el-table-column
                      min-width="200"
                      label="药品名称">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.drugName}}</span>
                        <el-autocomplete
                          v-else
                          class="inline-input"
                          v-model="scope.row.drugName"
                          :fetch-suggestions="querySearch"
                          placeholder="请输入药品名称"
                          :trigger-on-focus="false"
                          @select="handleSelect"
                        ></el-autocomplete>
                      </template>
                    </el-table-column>
                    <el-table-column
                      min-width="150"
                      label="规格">
                      <template slot-scope="scope">
                        <span>{{scope.row.spec}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="进价">
                      <template slot-scope="scope">
                        <span>{{scope.row.purchasePrice}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="售价">
                      <template slot-scope="scope">
                        <span>{{scope.row.price}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="库存量">
                      <template slot-scope="scope">
                        <span>{{scope.row.stock}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      min-width="150"
                      label="库发数">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.sendNum}}单位</span>
                        <span v-else>
                          <el-input style="width: 35%" v-model="scope.row.sendNum" placeholder=""></el-input>单位
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      min-width="150"
                      label="备注">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.remark}}</span>
                        <span v-else>
                          <el-select
                            v-model="scope.row.remark"
                            filterable
                            allow-create
                            default-first-option
                            placeholder="">
                              <el-option
                                v-for="item in remarksList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      min-width="150"
                      label="批次">
                      <template slot-scope="scope">
                        <span>{{scope.row.batch}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      min-width="150"
                      label="批号">
                      <template slot-scope="scope">
                        <span>{{scope.row.batchNum}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      min-width="150"
                      label="厂家">
                      <template slot-scope="scope">
                        <span>{{scope.row.factory}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </l-tab-change>

              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!--左侧边栏-->
    <div id="left" class="column" ref="left">
      <div class="box">
        <el-card class="height100">
          <div class="padding20" ref="top">
            <!--标题-->
            <l-card-title>
              <span slot="left">出库单号列表</span>
            </l-card-title>
            <!--筛选条件-->
            <l-formt-title label="录入日期" labelWidth="64">
              <div>
                <el-date-picker
                  v-model="formSearch.startDate"
                  style="width: 130px;"
                  prefix-icon="null"
                  type="date"
                  placeholder="开始时间">
                </el-date-picker>
                <span style="display: inline-block;position: relative;left: -22px;">-</span>
                <el-date-picker
                  class="padding-left-10"
                  style="width: 170px;"
                  v-model="formSearch.endDate"
                  prefix-icon="iconfont iconriqi"
                  type="date"
                  placeholder="结束时间">
                </el-date-picker>
              </div>
            </l-formt-title>
            <div class="clearFloat">
              <div class="float-left">
                <l-formt-title label="出库类型" labelWidth="64">
                  <el-select v-model="formSearch.outStorageType" placeholder="">
                    <el-option
                      v-for="item in outStorageTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </l-formt-title>
              </div>
              <div class="float-right">
                <l-formt-title label="状态选择" labelWidth="64">
                  <el-select v-model="formSearch.state" placeholder="">
                    <el-option
                      v-for="item in stateList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </l-formt-title>
              </div>
            </div>
            <div class="clearFloat">
              <div class="float-left">
                <l-formt-title label="出库目标" labelWidth="64">
                  <el-select v-model="formSearch.outStorageTarget" placeholder="">
                    <el-option
                      v-for="item in outStorageTargetList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </l-formt-title>
              </div>
              <div class="float-right">
                <l-formt-title label="申请单号" labelWidth="64">
                  <el-input v-model="formSearch.inInventoryNum" placeholder=""></el-input>
                </l-formt-title>
              </div>
            </div>
            <div class="clearFloat">
              <div class="float-left">
                <el-button class="button" @click="search">查询</el-button>
                <el-button class="button reset" @click="reset">重置</el-button>
              </div>
            </div>
          </div>
          <!--排序-->
          <div class="sort-container">
            <l-sort-label class="inline-block" label="出库单号" state="2" @click="cardListSort('key1')"></l-sort-label>
            <l-sort-label class="inline-block" label="出库类型" state="2" @click="cardListSort('key1')"></l-sort-label>
            <l-sort-label class="inline-block" label="提交状态" state="2" @click="cardListSort('key2')"></l-sort-label>
            <l-sort-label class="inline-block" label="录入时间" state="2" @click="cardListSort('key3')"></l-sort-label>
            <l-sort-label class="inline-block" label="提交时间" state="2" @click="cardListSort('key4')"></l-sort-label>
          </div>
          <!--列表-->
          <div class="infinite-list-wrapper">
            <div class="list-container overflow-scroll-vertical"  v-infinite-scroll="load" infinite-scroll-disabled="disabled">
              <div :class="curSelectedIndex == i?'list-item active':'list-item'" v-for="(item, i) in applyList" :key="i" @click="curSelectedIndex = i">
                <div class="state">
                  未提交 <i class="iconfont iconzuofei"></i>
                </div>
                <div class="item-label">
                  <span class="label margin-right-6">申请单号:</span>
                  <span>{{item.inInventoryNum}}</span>
                </div>
                <div class="item-label">
                  <span class="label margin-right-6">出库类型:</span>
                  <span>{{item.outStorageType}}</span>
                  <span class="label margin-right-6">出库目标:</span>
                  <span>{{item.outStorageTarget}}</span>
                </div>
                <div class="item-label">
                  <span class="label margin-right-6">录入人员:</span>
                  <span class="margin-right-10">{{item.entryPersonName}}</span>
                  <span class="label margin-right-6">录入时间:</span>
                  <span>{{item.entryTime}}</span>
                </div>
                <div class="item-label">
                  <span class="label margin-right-6">提交人员:</span>
                  <span class="margin-right-10">{{item.entryPersonName}}</span>
                  <span class="label margin-right-6">提交时间:</span>
                  <span>{{item.entryTime}}</span>
                </div>
              </div>
              <p v-if="loading" class="bottom-container">加载中...</p>
              <p v-if="noMore" class="bottom-container">没有更多了</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "outStock",
    data (){
      return {
        outStorageTypeList: [ // 筛选药房列表
          {
            label: '药房',
            value: 1
          }
        ],
        stateList: [ // 筛选 提交状态列表
          {
            label: '未提交',
            value: 1
          },
          {
            label: '已提交',
            value: 2
          }
        ],
        outStorageTargetList: [ // 出库目标 列表
          {
            label: '未提交',
            value: 1
          },
          {
            label: '已提交',
            value: 2
          }
        ],
        formSearch: {
          inInventoryNum: '', // 单号
          startDate: '', // 开始日期
          endDate: '', // 结束日期
          outStorageType: '', // 药库
          state: '', // 提交状态
          outStorageTarget: '', // 出库目标
        },
        curSelectedIndex: 0, // 当前选择单号下标
        applyList: [
          {
            inInventoryNum: '00001', // 单号
            outStorageType: '12345', // 出库类型
            outStorageTarget: '', // 出库目标
            entryPersonName: '刘星', // 录入/提交人员
            entryTime: '2019-01-01 01:01:01', // 录入/提交时间
            state: 1, // 单号状态
          },
          {
            inInventoryNum: '00001', // 单号
            outStorageType: '12345', // 出库类型
            outStorageTarget: '', // 出库目标
            entryPersonName: '刘星', // 录入/提交人员
            entryTime: '2019-01-01 01:01:01', // 录入/提交时间
            state: 1, // 单号状态
          },
          {
            inInventoryNum: '00001', // 单号
            outStorageType: '12345', // 出库类型
            outStorageTarget: '', // 出库目标
            entryPersonName: '刘星', // 录入/提交人员
            entryTime: '2019-01-01 01:01:01', // 录入/提交时间
            state: 1, // 单号状态
          },
          {
            inInventoryNum: '00001', // 单号
            outStorageType: '12345', // 出库类型
            outStorageTarget: '', // 出库目标
            entryPersonName: '刘星', // 录入/提交人员
            entryTime: '2019-01-01 01:01:01', // 录入/提交时间
            state: 1, // 单号状态
          },
          {
            inInventoryNum: '00001', // 单号
            outStorageType: '12345', // 出库类型
            outStorageTarget: '', // 出库目标
            entryPersonName: '刘星', // 录入/提交人员
            entryTime: '2019-01-01 01:01:01', // 录入/提交时间
            state: 1, // 单号状态
          },
          {
            inInventoryNum: '00001', // 单号
            outStorageType: '12345', // 出库类型
            outStorageTarget: '', // 出库目标
            entryPersonName: '刘星', // 录入/提交人员
            entryTime: '2019-01-01 01:01:01', // 录入/提交时间
            state: 1, // 单号状态
          },
          {
            inInventoryNum: '00001', // 单号
            outStorageType: '12345', // 出库类型
            outStorageTarget: '', // 出库目标
            entryPersonName: '刘星', // 录入/提交人员
            entryTime: '2019-01-01 01:01:01', // 录入/提交时间
            state: 1, // 单号状态
          },
        ], // 申请列表
        loading: false, //左侧申请列表滑动加载状态
        noMore: false, // 左侧申请列表没有更多数据

        applyInfo: { // 出库单头部详情
          inInventoryNum: '', // 单号
          outStorageType: '', // 出库类型
          outStorageTarget: '', // 出库目标
          storageCode: '', // 药库
          entryPersonName: '', // 录入人员
          entryTime: '', // 录入时间
          submitPersonName: '', // 提交人员
          submitTime: '' // 提交时间
        },
        remarksList: [
          {
            label: '未提交',
            value: 1
          },
          {
            label: '已提交',
            value: 2
          }
        ],
        tableData: [
          {
            id: 1,
            drugName: '', // 药品名称
            spec: '', // 规格
            purchasePrice: '', // 进价
            price: '', // 售价
            stock: '', // 库存
            sendNum: '', // 库发数
            remark: '', // 备注
            batch: '', // 包装单位
            batchNum: '', // 剂型单位
            factory: '', // 厂家
            isEditing: false, // 是否为编辑状态
          },
          {
            id: 1,
            drugName: '', // 药品名称
            spec: '', // 规格
            purchasePrice: '', // 进价
            price: '', // 售价
            stock: '', // 库存
            sendNum: '', // 库发数
            remark: '', // 备注
            batch: '', // 包装单位
            batchNum: '', // 剂型单位
            factory: '', // 厂家
            isEditing: false, // 是否为编辑状态
          },
          {
            id: 1,
            drugName: '', // 药品名称
            spec: '', // 规格
            purchasePrice: '', // 进价
            price: '', // 售价
            stock: '', // 库存
            sendNum: '', // 库发数
            remark: '', // 备注
            batch: '', // 包装单位
            batchNum: '', // 剂型单位
            factory: '', // 厂家
            isEditing: false, // 是否为编辑状态
          },
          {
            id: 1,
            drugName: '', // 药品名称
            spec: '', // 规格
            purchasePrice: '', // 进价
            price: '', // 售价
            stock: '', // 库存
            sendNum: '', // 库发数
            remark: '', // 备注
            batch: '', // 包装单位
            batchNum: '', // 剂型单位
            factory: '', // 厂家
            isEditing: false, // 是否为编辑状态
          }
        ], // 申请表格详情
        curSelectTableList: [], // 当前已经选中的item 删除时使用
      }
    },
    computed: {
      disabled() { // 滑动加载组件禁用状态
        return this.loading || this.noMore;
      }
    },
    methods: {
      // 左侧边栏操作
      search (){ // 搜索

      },
      reset (){ // 筛选条件重置
        this.formSearch = {
          inInventoryNum: '', // 单号
          startDate: '', // 开始日期
          endDate: '', // 结束日期
          outStorageType: '', // 药库
          state: '', // 提交状态
          outStorageTarget: '', // 出库目标
        }
      },
      cardListSort (val){
        console.log(val)
      },
      async load (){ // 滑动加载
        try {
          this.page++
          this.loading = true
          const _this = this;
          setTimeout(function () {
            _this.applyList.push({
              inInventoryNum: '00001', // 单号
              outStorageType: '12345', // 出库类型
              outStorageTarget: '', // 出库目标
              entryPersonName: '刘星', // 录入/提交人员
              entryTime: '2019-01-01 01:01:01', // 录入/提交时间
              state: 1, // 单号状态
            },)
            // 加载完成后需要将loading置成fale, try catch中错误处理也要考虑
            _this.loading = false;
            // 通常异步操作完成后会根据返回值设定noMore
            _this.noMore = this.count >= 20;
          }, 5000)
        }catch (e) {
          console.log('报错了')
        }
      },
      // 中间模块操作
      handleSelectionChange (list){ // 选中表格
        this.curSelectTableList = list
      },
      exportExcel (){ // 导出Excel

      },
      print (){ // 打印

      },
      submitData (){ // 提交

      },
      save (){ // 保存

      },
      del (){ // 删除
        if(this.curSelectTableList.length == 0) {
          this.$message.warning('请选择！')
          return;
        }
        this.$confirm("", "", {
          showClose: "false",
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: "true",
          message:
            "<div>删除</div><p><span>确认删除吗？</p>",
          type: "warning"
        })
          .then(() => {
            let add = this.tableData.filter(item => !this.curSelectTableList.some(ele=>ele.id === item.id));
            this.tableData = add
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => { // 取消操作

          });

      },
      adds (){ // 新增药品
        this.tablast()
      },
      newAdd (){ // 新建申请单
        this.tableData = [
          {
            id: this.tableData.length,
            drugName: '', // 药品名称
            spec: '', // 规格
            stock: '', // 库存
            referencePurchasePrice: '', // 参考进价
            referenceSellPrice: '', // 参考售价
            remark: '', // 备注
            packing: '', // 包装单位
            dosagForm: '', // 剂型单位
            isEditing: true, // 是否为编辑状态
          }
        ]
      },
      tablast (){ // 键盘Tab 到最后一个 触发回调事件
        this.tableData.map(item => {
          item.isEditing = false;
        })
        this.tableData.push({
          id: this.tableData.length,
          drugName: '', // 药品名称
          spec: '', // 规格
          stock: '', // 库存
          referencePurchasePrice: '', // 参考进价
          referenceSellPrice: '', // 参考售价
          remark: '', // 备注
          packing: '', // 包装单位
          dosagForm: '', // 剂型单位
          isEditing: true, // 是否为编辑状态
        })
      },
      querySearch (queryString, cb){ // 输入药品后获取 输入建议list
        try{
          let res = []
          // 调用接口请求 queryString 相关药品list
          // 调用 cb(res) 返回结果
          cb(res)
        }catch (e) {
          // 请求出错
        }

      },
      handleSelect (item){ // 输入药品名称后 选中方法

      }
    }
  }
</script>

<style lang="scss" scoped>
  $leftWidth:440px;
  $rightWidth:287px;
  .three-column{
    min-width: 1024px;
    padding-left: $leftWidth;
    .column{
      float: left;
      height: 100%;
      .box{
        height: 100%;
        box-sizing: border-box;
        border-radius: 4px;
        .top{
          padding: 10px;
        }
        .bottom{
          padding: 10px;
        }
      }
    }
    #left{
      width: $leftWidth;
      margin-left: -100%;
      position: relative;
      right: $leftWidth;
      padding-left: 0;
    }
    #center{
      width: 100%;
      padding-right: 0;
    }
    #right{
      margin-right:-$rightWidth;
      width: $rightWidth;
      padding-right: 0;
    }
  }
  #left{
    position: relative;
    .el-card{
      .padding20{
        padding: 10px 20px;
      }
      .clearFloat{
        margin-top: 7px;
        overflow: hidden;
        &>div{
          width: 195px;
        }
        .button {
          width: 80px;
          height: 36px;
          margin-right: 10px;
          background: $l-color-primary;
          border-radius: 2px;
          font-size: 14px;
          
          font-weight: 500;
          color: $l-color-white;
        }
        .reset {
          background: $l-color-white;
          color: $l-color-primary;
          border-color: $l-color-primary;
          margin-left: 0px;
        }
      }
      .sort-container{
        margin-top: 10px;
        background: $l-color-bgcolor-18;
        padding: 0 16px;
        .inline-block{
          margin-right: 2px;
        }
      }
      .list-container{
        position: absolute;
        top: 300px;
        left: 0;
        width: 100%;
        bottom: 0;
        .list-item{
          padding: 6px 14px;
          position: relative;
          .state{
            position: absolute;
            right: 10px;
            top: 10px;
          }
          .item-label{
            line-height: 28px;
            .label{
              color: $l-color-fontcolor-3;
              font-size: $l-font-size;
            }
          }
        }
        .list-item:nth-child(even){
          background: $l-color-bgcolor-18;
        }
        .active {
          background-color: $l-color-bgcolor-12 !important;
        }
      }
    }
  }
  #center{
    padding: 0 20px;
    .top-btn{
      height: 68px;
      line-height: 68px;
      overflow: hidden;
      padding-right: 20px;
      border-bottom: 2px solid $l-color-bgcolor-11;
      .btn-label{
        font-size: $l-font-size;
        cursor: pointer;
        i{
          font-size: 18px;
          margin-left: 30px;
          margin-right: 5px;
          position: relative;
          top: 2px;
        }
      }
    }
    .title{
      text-align: center;
      font-weight: $l-font-weight;
      font-size: 20px;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .apply-info {
      &>div{
        margin-top: 10px;
        .disabled {
          background: $l-color-bgcolor-18;
        }
        .form-item {
          width: 257px;
          margin-right: 6px;
        }
        .form-item:last-child{
          margin-right: 0;
        }
      }
    }
  }
  .bottom-container {
    text-align: center;
    padding: 20px 0px;
  }
</style>
