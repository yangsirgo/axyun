<template>
  <div class="height100 three-column">
    <!--center-->
    <div id="center" class="column">
      <div class="box">
        <el-card class="height100">
          <el-row class="top-btn">
            <el-col :span="24" style="text-align: right">
              <el-button type="text" icon="iconfont iconxinzeng" @click="newAdd">新建出库单</el-button>
              <el-button type="text" icon="iconfont iconxinzeng" @click="newAdd">申请列表</el-button>
              <el-button type="text" icon="iconfont iconguahaoguanli" @click="adddrug">新增药品</el-button>
              <el-button type="text" icon="iconfont iconshanchu" @click="del">删除</el-button>
              <el-button type="text" icon="iconfont iconzancun" @click="save">保存</el-button>
              <el-button type="text" icon="iconfont el-icon-success" @click="submitData">提交</el-button>
              <el-button type="text" icon="iconfont icondayin" @click="print">打印</el-button>
              <el-button
                type="text"
                icon="iconfont icon-dianzibinglikebianjizhuangtai"
                @click="exportExcel"
              >导出</el-button>
            </el-col>
          </el-row>
          <div class="padding20">
            <div class="title">入库单</div>
            <div class="purchaseinfo">
              <el-row :gutter="6">
                <el-col :span="5">
                  <l-formt-title class="disabled" label="申请单号" labelWidth="64">
                    <el-input v-model="purchaseinfo.inInventoryNum" placeholder :disabled="true"></el-input>
                  </l-formt-title>
                </el-col>
                <el-col :span="5">
                  <l-formt-title class="disabled" label="总进价金额" labelWidth="64">
                    <el-input v-model="purchaseinfo.totalprice" placeholder :disabled="true"></el-input>
                  </l-formt-title>
                </el-col>
                <el-col :span="5">
                  <l-formt-title label="入库类型" labelWidth="64">
                    <el-select v-model="purchaseinfo.storageType" placeholder="请选择">
                      <el-option
                        v-for="item in storageTypelist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </l-formt-title>
                </el-col>
                <el-col :span="5">
                  <l-formt-title class="form-item" label="采购药库" labelWidth="64">
                    <el-input
                      v-if="!purchaseinfo.isEditing"
                      v-model="purchaseinfo.drugname"
                      placeholder
                    ></el-input>
                    <el-select v-else v-model="purchaseinfo.drugname" placeholder="请选择">
                      <el-option
                        v-for="item in drugnamelist"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </l-formt-title>
                </el-col>
                <el-col :span="4">
                  <l-formt-title label="供应商" labelWidth="54">
                    <el-input
                      v-if="!purchaseinfo.isEditing"
                      v-model="purchaseinfo.supplier"
                      placeholder
                    ></el-input>
                    <el-select v-else v-model="purchaseinfo.supplier" placeholder="请选择">
                      <el-option
                        v-for="item in supplierList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </l-formt-title>
                </el-col>
              </el-row>
              <el-row :gutter="6">
                <el-col :span="6">
                  <l-formt-title class="disabled" label="录入人员" labelWidth="64">
                    <el-input v-model="purchaseinfo.entryPersonName" placeholder :disabled="true"></el-input>
                  </l-formt-title>
                </el-col>
                <el-col :span="6">
                  <l-formt-title class="disabled" label="录入时间" labelWidth="64">
                    <el-input v-model="purchaseinfo.entryTime" placeholder :disabled="true"></el-input>
                  </l-formt-title>
                </el-col>
                <el-col :span="6">
                  <l-formt-title class="disabled" label="提交人员" labelWidth="64">
                    <el-input v-model="purchaseinfo.entryPersonName" placeholder :disabled="true"></el-input>
                  </l-formt-title>
                </el-col>
                <el-col :span="6">
                  <l-formt-title class="disabled" label="提交时间" labelWidth="64">
                    <el-input v-model="purchaseinfo.entryTime" placeholder :disabled="true"></el-input>
                  </l-formt-title>
                </el-col>
              </el-row>

              <el-row>
                <l-tab-change :tableData="tableData">
                  <el-table :data="tableData" border stripe style="width: 100%">
                    <el-table-column type="selection" width="35"></el-table-column>
                    <el-table-column min-width="200" label="药品名称">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.drugName}}</span>
                        <el-input v-else v-model="scope.row.drugName" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="规格">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.spec}}</span>
                        <el-input v-else v-model="scope.row.spec" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="进价">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.referencePurchasePrice}}</span>
                        <el-input v-else v-model="scope.row.referencePurchasePrice" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="售价">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.referenceSellPrice}}</span>
                        <el-input v-else v-model="scope.row.referenceSellPrice" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="数量">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.rkNumber}}</span>
                        <el-input v-else v-model="scope.row.rkNumber" placeholder></el-input>
                      </template>
                    </el-table-column>

                    <el-table-column label="号">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.batch}}</span>
                        <el-input v-else v-model="scope.row.batch" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="有效期">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.validity}}</span>
                        <el-input v-else v-model="scope.row.validity" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="生产厂商">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.supplier}}</span>
                        <el-input v-else v-model="scope.row.supplier" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="生产标识">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.Identification}}</span>
                        <el-input v-else v-model="scope.row.Identification" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="原产地">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.habitat}}</span>
                        <el-input v-else v-model="scope.row.habitat" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="备注">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.remark}}</span>
                        <el-input v-else v-model="scope.row.remark" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="剂量">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.packing}}</span>
                        <el-input v-else v-model="scope.row.packing" placeholder></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column min-width="100" label="剂型单位">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">{{scope.row.dosagForm}}</span>
                        <el-input v-else v-model="scope.row.dosagForm" placeholder></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                </l-tab-change>
              </el-row>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!--left-->
    <div id="left" class="column" ref="left">
      <div class="box">
        <el-card class="height100">
          <el-row style="padding-left:20px;">
            <el-col :span="24">
              <l-card-title>
                <span slot="left">入库单号列表</span>
              </l-card-title>
            </el-col>
          </el-row>
          <el-row style="padding:0 20px;margin-bottom:10px">
            <el-col :span="24">
              <l-formt-title label="录入日期" labelWidth="64">
                <el-date-picker
                  style="width:100%"
                  :clearable="false"
                  v-model="formSearch.timepicker"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row :gutter="6" style="padding:0 20px;margin-bottom:10px">
            <el-col :span="12">
              <l-formt-title label="入库类型" labelWidth="64">
                <el-select v-model="formSearch.storageType" placeholder="请选择">
                  <el-option
                    v-for="item in storageTypelist"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
            <el-col :span="12">
              <l-formt-title label="单据状态" labelWidth="64">
                <el-select v-model="formSearch.documentStatus" placeholder="请选择">
                  <el-option
                    v-for="item in documentStatuslist"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row style="padding:0 20px;margin-bottom:10px">
            <el-col :span="12">
              <l-formt-title label="供应商" labelWidth="64">
                <el-select v-model="formSearch.drugNumber" placeholder="请选择">
                  <el-option
                    v-for="item in drugnamelist"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <el-button type="primary" size="small" @click="search">查询</el-button>
              <el-button type="primary" size="small" plain @click="reset">重置</el-button>
            </el-col>
          </el-row>

          <!--排序-->
          <div class="sorttitle">
            <l-sort-label class="inline-block" label="入库单号" state="2" @click="listsort('key1')"></l-sort-label>
            <l-sort-label class="inline-block" label="供应商" state="2" @click="listsort('key2')"></l-sort-label>
            <l-sort-label class="inline-block" label="提交状态" state="2" @click="listsort('key3')"></l-sort-label>
            <l-sort-label class="inline-block" label="录入时间" state="2" @click="listsort('key4')"></l-sort-label>
            <l-sort-label class="inline-block" label="提交时间" state="2" @click="listsort('key5')"></l-sort-label>
          </div>
          <!--表单-->
          <div class="infinite-list-wrapper" style="height:100%;">
            <div
              class="list-container overflow-scroll-vertical"
              v-infinite-scroll="load"
              infinite-scroll-disabled="disabled"
            >
              <div
                :class="curSelectedIndex == i?'list-item active':'list-item'"
                v-for="(item, i) in purchaseList"
                :key="i"
                @click="curSelectedIndex = i"
              >
                <div class="state">
                  未提交
                  <i class="iconfont iconzuofei"></i>
                </div>
                <div class="item-label">
                  <span class="label margin-right-6">入库单号:</span>
                  <span>{{item.inInventoryNum}}</span>
                  <span class="label margin-right-6">药库:</span>
                  <span>{{item.drugname}}</span>
                </div>
                <div class="item-label">
                  <span class="label margin-right-6">总进价金额:</span>
                  <span>{{item.totalprice}}</span>
                  <span class="label margin-right-6">供应商:</span>
                  <span>{{item.supplier}}</span>
                </div>
                <div class="item-label">
                  <span class="label margin-right-6">录入人员:</span>
                  <span class="margin-right-10">{{item.entryPersonName}}</span>
                  <span class="label margin-right-6">录入时间:</span>
                  <span>{{item.entryTime}}</span>
                </div>
                <div class="item-label">
                  <span class="label margin-right-6">提交人员:</span>
                  <span class="margin-right-10">{{item.submitPersonName}}</span>
                  <span class="label margin-right-6">提交时间:</span>
                  <span>{{item.submitTime}}</span>
                </div>
              </div>
              <p v-if="loading" class="bottom-container">加载中...</p>
              <p v-if="noMore" class="bottom-container">没有更多了</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!--right工具箱-->
    <div id="right" class="column" ref="right">
      <div class="box">我是right</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "apply",
  data() {
    return {
      totalAmtList: [
        // 筛选药房列表
        {
          label: "药房",
          value: 1
        }
      ],
      stateList: [
        // 筛选 提交状态列表
        {
          label: "未提交",
          value: 1
        },
        {
          label: "已提交",
          value: 2
        }
      ],

      drugnamelist: [],
      supplierList: [],
      storageTypelist: [],
      documentStatuslist: [],
      formSearch: {
        timepicker: [], //录入时间
        storageType: "", //入库类型
        documentStatus: "", //单据状态
        supplier: "" //供应商
      },

      curSelectedIndex: 0, // 当前选择单号下标
      purchaseList: [
        {
          inInventoryNum: "00001", // 采购单号
          supplier: "供应商", //供应商
          drugNumber: "123药库", // 采购药库
          totalprice: "200,000.00", //总进价金额：
          entryPersonName: "刘星", // 录入/提交人员
          entryTime: "2019-01-01 01:01:01", // 录入/提交时间
          submitPersonName: "刘星1", // 录入/提交人员
          submitTime: "2019-01-01 01:01:01", // 录入/提交时间
          state: 1 // 单号状态
        },
        {
          inInventoryNum: "00001", // 采购单号
          supplier: "供应商", //供应商
          drugNumber: "123药库", // 采购药库
          totalprice: "200,000.00", //总进价金额：
          entryPersonName: "刘星", // 录入/提交人员
          entryTime: "2019-01-01 01:01:01", // 录入/提交时间
          submitPersonName: "刘星1", // 录入/提交人员
          submitTime: "2019-01-01 01:01:01", // 录入/提交时间
          state: 1 // 单号状态
        },
        {
          inInventoryNum: "00001", // 采购单号
          supplier: "供应商", //供应商
          drugNumber: "123药库", // 采购药库
          totalprice: "200,000.00", //总进价金额：
          entryPersonName: "刘星", // 录入/提交人员
          entryTime: "2019-01-01 01:01:01", // 录入/提交时间
          submitPersonName: "刘星1", // 录入/提交人员
          submitTime: "2019-01-01 01:01:01", // 录入/提交时间
          state: 1 // 单号状态
        },
        {
          inInventoryNum: "00001", // 采购单号
          supplier: "供应商", //供应商
          drugNumber: "123药库", // 采购药库
          totalprice: "200,000.00", //总进价金额：
          entryPersonName: "刘星", // 录入/提交人员
          entryTime: "2019-01-01 01:01:01", // 录入/提交时间
          submitPersonName: "刘星1", // 录入/提交人员
          submitTime: "2019-01-01 01:01:01", // 录入/提交时间
          state: 1 // 单号状态
        },
        {
          inInventoryNum: "00001", // 采购单号
          supplier: "供应商", //供应商
          drugNumber: "123药库", // 采购药库
          totalprice: "200,000.00", //总进价金额：
          entryPersonName: "刘星", // 录入/提交人员
          entryTime: "2019-01-01 01:01:01", // 录入/提交时间
          submitPersonName: "刘星1", // 录入/提交人员
          submitTime: "2019-01-01 01:01:01", // 录入/提交时间
          state: 1 // 单号状态
        },
        {
          inInventoryNum: "00001", // 采购单号
          supplier: "供应商", //供应商
          drugNumber: "123药库", // 采购药库
          totalprice: "200,000.00", //总进价金额：
          entryPersonName: "刘星", // 录入/提交人员
          entryTime: "2019-01-01 01:01:01", // 录入/提交时间
          submitPersonName: "刘星1", // 录入/提交人员
          submitTime: "2019-01-01 01:01:01", // 录入/提交时间
          state: 1 // 单号状态
        },
        {
          inInventoryNum: "00001", // 采购单号
          supplier: "供应商", //供应商
          drugNumber: "123药库", // 采购药库
          totalprice: "200,000.00", //总进价金额：
          entryPersonName: "刘星", // 录入/提交人员
          entryTime: "2019-01-01 01:01:01", // 录入/提交时间
          submitPersonName: "刘星1", // 录入/提交人员
          submitTime: "2019-01-01 01:01:01", // 录入/提交时间
          state: 1 // 单号状态
        },
        {
          inInventoryNum: "00001", // 采购单号
          supplier: "供应商", //供应商
          drugNumber: "123药库", // 采购药库
          totalprice: "200,000.00", //总进价金额：
          entryPersonName: "刘星", // 录入/提交人员
          entryTime: "2019-01-01 01:01:01", // 录入/提交时间
          submitPersonName: "刘星1", // 录入/提交人员
          submitTime: "2019-01-01 01:01:01", // 录入/提交时间
          state: 1 // 单号状态
        }
      ], // 申请列表
      loading: false, //左侧申请列表滑动加载状态
      noMore: false, // 左侧申请列表没有更多数据

      purchaseInfo: {
        // 采购单详情
        inInventoryNum: "", // 申请单号
        totalprice: "", //总进价金额
        supplier: "", //供应商
        storageType: "", //入库类型
        drugNumber: "", // 药库
        remark: "", // 备注
        entryPersonName: "", // 录入/提交人员
        entryTime: "", // 录入/提交时间
        submitPersonName: "", // 录入/提交人员
        submitTime: "", // 录入/提交时间
        isEditing: false // 是否为编辑状态
      },

      tableData: [
        {
          id: 1,
          drugName: "", // 药品名称
          spec: "", // 规格
          stock: "", // 库存
          referencePurchasePrice: "", // 进价
          referenceSellPrice: "", // 售价
          remark: "", // 备注
          packing: "", // 剂量
          dosagForm: "", // 剂型单位
          rkNumber: "", //数量
          batch: "", //生产批号
          validity: "", //有效期
          supplier: "", //生产厂商
          Identification: "", //生产标识
          habitat: "", //原产地
          isEditing: false // 是否为编辑状态
        },
        {
          id: 1,
          drugName: "", // 药品名称
          spec: "", // 规格
          stock: "", // 库存
          referencePurchasePrice: "", // 进价
          referenceSellPrice: "", // 售价
          remark: "", // 备注
          packing: "", // 剂量
          dosagForm: "", // 剂型单位
          rkNumber: "", //数量
          batch: "", //生产批号
          validity: "", //有效期
          supplier: "", //生产厂商
          Identification: "", //生产标识
          habitat: "", //原产地
          isEditing: false // 是否为编辑状态
        }
      ], // 申请表格详情
      curSelectTableList: [] // 当前已经选中的item
    };
  },
  computed: {
    disabled() {
      // 滑动加载组件禁用状态
      return this.loading || this.noMore;
    }
  },
  methods: {
    // 左侧边栏操作
    search() {
      // 搜索
    },
    reset() {
      // 筛选条件重置
      this.formSearch = {
        inInventoryNum: "", // 采购单号
        timepicker: "", // 录入时间
        drugname: "" // 采购药库
      };
    },
    listsort(val) {
      console.log(val);
    },
    async load() {
      // 滑动加载
      try {
        this.page++;
        this.loading = true;
        const _this = this;
        setTimeout(function() {
          _this.purchaseList.push({
            inInventoryNum: "00001", // 采购单号
            supplier: "供应商", //供应商
            drugNumber: "123药库", // 采购药库
            totalprice: "200,000.00", //总进价金额：
            entryPersonName: "刘星", // 录入/提交人员
            entryTime: "2019-01-01 01:01:01", // 录入/提交时间
            submitPersonName: "刘星1", // 录入/提交人员
            submitTime: "2019-01-01 01:01:01", // 录入/提交时间
            state: 1 // 单号状态
          });
          // 加载完成后需要将loading置成fale, try catch中错误处理也要考虑
          _this.loading = false;
          // 通常异步操作完成后会根据返回值设定noMore
          _this.noMore = this.count >= 20;
        }, 5000);
      } catch (e) {
        console.log("报错了");
      }
    },
    // 中间模块操作
    // handleSelectionChange(list) {
    //   // 选中表格
    //   this.curSelectTableList = list;
    // },

    exportExcel() {
      // 导出Excel
    },
    print() {
      // 打印
    },
    submitData() {
      // 提交
    },
    save() {
      // 保存
      this.$confirm("", "", {
        showClose: "false",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: "true",
        message: "是否保存当前入库单",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    del() {
      // 删除
      if (this.curSelectTableList.length == 0) {
        this.$message.warning("请选择！");
        return;
      }
      this.$confirm("", "", {
        showClose: "false",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: "true",
        message: "是否删除当前入库明细</p>",
        type: "warning"
      })
        .then(() => {
          let add = this.tableData.filter(
            item => !this.curSelectTableList.some(ele => ele.id === item.id)
          );
          this.tableData = add;
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          // 取消操作
        });
    },

    newAdd() {
      // 新建入库
      this.purchaseinfo = {
        // 采购单详情
        inInventoryNum: "", // 申请单号
        totalprice: "", //总进价金额
        supplier: "", //供应商
        storageType: "", //入库类型
        drugNumber: "", // 药库
        remark: "", // 备注
        entryPersonName: "", // 录入/提交人员
        entryTime: "", // 录入/提交时间
        submitPersonName: "", // 录入/提交人员
        submitTime: "", // 录入/提交时间
        isEditing: true // 是否为编辑状态
      };
      this.tableData = [
        {
          id: 1,
          drugName: "", // 药品名称
          spec: "", // 规格
          stock: "", // 库存
          referencePurchasePrice: "", // 进价
          referenceSellPrice: "", // 售价
          remark: "", // 备注
          packing: "", // 剂量
          dosagForm: "", // 剂型单位
          rkNumber: "", //数量
          batch: "", //生产批号
          validity: "", //有效期
          supplier: "", //生产厂商
          Identification: "", //生产标识
          habitat: "", //原产地
          isEditing: true // 是否为编辑状态
        }
      ];
    },

    //新增药品
    adddrug() {
      this.tableData.push({
        id: this.tableData.length,
        drugName: "", // 药品名称
        spec: "", // 规格
        stock: "", // 库存
        referencePurchasePrice: "", // 参考进价
        referenceSellPrice: "", // 参考售价
        remark: "", // 备注
        packing: "", // 包装单位
        dosagForm: "", // 剂型单位
        isEditing: true // 是否为编辑状态
      });
    },

    //审核
    examine() {
      // 保存采购单
      this.$confirm("", "", {
        showClose: "false",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: "true",
        message: "是否审核当前采购单",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "审核成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }

    // tablast() {
    //   // 键盘Tab 到最后一个 触发回调事件
    //   this.tableData.map(item => {
    //     item.isEditing = false;
    //   });
    //   this.tableData.push({
    //     id: 1,
    //     drugName: "", // 药品名称
    //     spec: "", // 规格
    //     stock: "", // 库存
    //     referencePurchasePrice: "", // 进价
    //     referenceSellPrice: "", // 售价
    //     remark: "", // 备注
    //     packing: "", // 剂量
    //     dosagForm: "", // 剂型单位
    //     rkNumber: "", //数量
    //     batch: "", //生产批号
    //     validity: "", //有效期
    //     supplier: "", //生产厂商
    //     Identification: "", //生产标识
    //     habitat: "", //原产地
    //     isEditing: true // 是否为编辑状态
    //   });
    // }
  }
};
</script>

<style lang="scss" scoped>
$leftWidth: 440px;
$rightWidth: 287px;
.three-column {
  min-width: 1024px;
  padding-left: $leftWidth;
  padding-right: $rightWidth;
  .column {
    float: left;
    height: 100%;
    .box {
      height: 100%;
      box-sizing: border-box;
      border-radius: 4px;
      .top {
        padding: 10px;
      }
      .bottom {
        padding: 10px;
      }
    }
  }
  #left {
    width: $leftWidth;
    margin-left: -100%;
    position: relative;
    right: $leftWidth;
    padding-left: 0;
  }
  #center {
    width: 100%;
  }
  #right {
    margin-right: -$rightWidth;
    width: $rightWidth;
    padding-right: 0;
  }
}
#left {
  position: relative;
  .el-card {
    .padding20 {
      padding: 10px 20px;
    }

    .sorttitle {
      background: $l-color-bgcolor-18;
      padding: 0 16px;
      .inline-block {
        margin-right: 5px;
      }
    }
    .list-container {
      position: absolute;
      top: 265px;
      left: 0;
      width: 100%;
      bottom: 0;
      .list-item {
        padding: 6px 14px;
        position: relative;
        .state {
          position: absolute;
          right: 10px;
          top: 10px;
        }
        .item-label {
          line-height: 28px;
          .label {
            color: $l-color-fontcolor-3;
            font-size: $l-font-size;
          }
        }
      }
      .list-item:nth-child(even) {
        background: $l-color-bgcolor-18;
      }
      .active {
        background-color: $l-color-bgcolor-12 !important;
      }
    }
  }
}
#center {
  padding: 0 20px;
  .top-btn {
    height: 68px;
    line-height: 68px;
    overflow: hidden;
    padding-right: 20px;
    border-bottom: 2px solid $l-color-bgcolor-11;
    .el-button--text,
    .el-button--text:hover {
      font-size: $l-font-size;
      color: #2e323a;
    }
  }
  .title {
    text-align: center;
    font-weight: $l-font-weight;
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .purchaseinfo {
    & > .el-row {
      margin-top: 10px;
      .disabled {
        background: $l-color-bgcolor-18;
      }
    }
  }
}
.bottom-container {
  text-align: center;
  padding: 20px 0px;
}
</style>
