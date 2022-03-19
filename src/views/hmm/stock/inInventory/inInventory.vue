<template>
  <div class="width100 height100">
    <el-card class="left-container position-relative padding10">
      <el-row class="line">
        <el-date-picker
          v-model="date"
          class="width100"
          type="datetimerange"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00', '08:00:00']"
        ></el-date-picker>
      </el-row>
      <el-row class="line" :gutter="10">
        <el-col :span="12">
          <el-select v-model="inType" clearable placeholder="请选择">
            <el-option
              v-for="item in inTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-select v-model="status" clearable placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="line" :gutter="10">
        <el-col :span="12">
          <el-input v-model="number"></el-input>
        </el-col>
        <el-col :span="12">
          <el-button class="inline-block" @click="search" type="primary" size="mini">搜索</el-button>
          <el-button class="inline-block" @click="clear" size="mini">重置</el-button>
        </el-col>
      </el-row>
      <div>
        <l-sort-label class="inline-block" label="入库单号" state="2" @click="cardListSort('key1')"></l-sort-label>
        <l-sort-label class="inline-block" label="入库单号" state="2" @click="cardListSort('key2')"></l-sort-label>
        <l-sort-label class="inline-block" label="入库单号" state="2" @click="cardListSort('key3')"></l-sort-label>
        <l-sort-label class="inline-block" label="入库单号" state="2" @click="cardListSort('key4')"></l-sort-label>
      </div>
      <div
        class="slip-container scroll-vertical scroll_content"
        v-infinite-scroll="loadCardList"
        infinite-scroll-disabled="cardListDisabled"
      >
        <l-card-icon v-for="(item, index) in list" :key="index" type="del" @del="delCard">
          <el-row v-for="(cardItem, cardIndex) in cardParams" :key="'card' + cardIndex">
            <div @click="findDetail(item.id)">
              <el-col :span="8">
                <span class="labelName">{{cardItem[0].label}}</span>
                {{item[cardItem[0].prop]}}
              </el-col>
              <el-col :span="16">
                <span class="labelName">{{cardItem[1].label}}</span>
                {{item[cardItem[1].prop]}}
              </el-col>
            </div>
          </el-row>
        </l-card-icon>
      </div>
    </el-card>
    <el-card class="right-container position-relative padding10">
      <div class="width100 tools-container">
        <div class="inline-block cursor-pointer margin-right-20" @click="createNumber">
          <i class="el-icon-plus margin-right-6" />新建
        </div>
        <div class="inline-block cursor-pointer margin-right-20" @click="showEditDrawer = true">
          <i class="el-icon-plus margin-right-6" />新增药品
        </div>
        <div class="inline-block cursor-pointer margin-right-20" @click="createNumber">
          <i class="el-icon-plus margin-right-6" />删除
        </div>
        <div class="inline-block cursor-pointer margin-right-20" @click="lastSubmit">
          <i class="el-icon-plus margin-right-6" />保存
        </div>
        <div class="inline-block cursor-pointer margin-right-20" @click="lastSubmit">
          <i class="el-icon-plus margin-right-6" />提交
        </div>
        <div class="inline-block cursor-pointer margin-right-20" @click="createNumber">
          <i class="el-icon-plus margin-right-6" />打印
        </div>
        <div class="inline-block cursor-pointer margin-right-20" @click="createNumber">
          <i class="el-icon-plus margin-right-6" />导出
        </div>
      </div>
      <div class="form-container">
        <p class="form-title">入库单</p>
        <el-row>
          <el-form
            label-position="right"
            label-width="100px"
            ref="formElem"
            :rules="rules"
            :model="this.stgForm"
            class="edit-form"
          >
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="单号" prop="inInventoryNum">
                  <el-input placeholder="请输入单号" v-model="stgForm.inInventoryNum" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总金额" prop="totalAmt">
                  <el-input placeholder="请输入" v-model="stgForm.totalAmt" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="入库类型" prop="inType">
                  <el-select v-model="stgForm.inType" clearable placeholder="请选择" class="width100">
                    <el-option
                      v-for="item in inTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="药库" prop="totalAmt">
                  <el-input placeholder="请输入" v-model="stgForm.totalAmt" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="供应商" prop="totalAmt">
                <el-input placeholder="请输入" v-model="stgForm.totalAmt" clearable></el-input>
              </el-form-item>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="录入人员" prop="entryPersonName">
                  <el-input placeholder="请输入" v-model="stgForm.entryPersonName" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="提交时间" prop="entryTime">
                  <el-input placeholder="请输入时间" v-model="stgForm.entryTime" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="提交人员" prop="entryPersonName">
                  <el-input placeholder="请输入" v-model="stgForm.entryPersonName" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="录入时间" prop="entryTime">
                  <el-input placeholder="请输入时间" v-model="stgForm.entryTime" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <el-table :data="tableData" border>
          <el-table-column type="selection" width="35px" header-align="center" align="center"></el-table-column>
          <el-table-column
            v-for="(item,index) in tableParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            class="overflow-point"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'left'"
          >
            <template slot-scope="scope">
              <l-editable-cell
                v-model="form[item.prop]"
                :editable="!!scope.row.editable"
                :stopTab="item.prop == 'address'"
                @stopTab="confirmHandler"
                @blur="blurHandler(scope, item.prop == 'address')"
              >
                <span
                  slot="content"
                  class="overflow-point display-inherit"
                >{{formatData(scope.row.editable ? form : scope.row, item)}}</span>
              </l-editable-cell>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="showEditDrawer" width="800" center class="scroll_content">
        <el-form
          label-position="right"
          label-width="100px"
          ref="formElem1"
          :rules="rules"
          :model="this.form"
          class="edit-form"
        >
          <l-divider title="基本信息"></l-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item label="药品名称" prop="drugName">
                <el-select
                  style="width:280px"
                  v-model="form.drugName"
                  placeholder="请输入关键词"
                  filterable
                  remote
                  :remote-method="remoteMethod"
                  :loading="loading"
                  @change="drugNameChange"
                  class="input-width-default"
                >
                  <el-option
                    v-for="item in testDatas"
                    :key="item.drugName"
                    :label="item.drugName"
                    :value="item.drugId"
                  >
                    <span style="float: left">{{ item.drugName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产地" prop="originCode">
                <!-- <l-value-domain
                  code="DS00.00.108"
                  :value.sync="form.originCode"
                  remoteShowKey="VALUE"
                  remoteValueKey="KEY"
                />-->
              </el-form-item>
              <el-form-item label="产地标识码" prop="originIdentificationCode">
                <!-- <l-value-domain
                  type="select"
                  code="CS08.50.909"
                  :value.sync="form.originIdentificationCode"
                  remoteShowKey="value"
                  remoteValueKey="key"
                />-->
              </el-form-item>
              <el-form-item label="进价" prop="purchasePrice">
                <el-input placeholder="进价" v-model="form.purchasePrice"></el-input>
              </el-form-item>
              <el-form-item label="生产批号" prop="batchNum">
                <el-input placeholder="生产批号" v-model="form.batchNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位" prop="drugUnit">
                <!-- <l-value-domain
                  type="select"
                  code="CS08.50.900"
                  :value.sync="form.drugUnit"
                  remoteShowKey="value"
                  remoteValueKey="key"
                  class="input-width-default"
                />-->
              </el-form-item>
              <el-form-item label="剂型" prop="formCode">
                <!-- <l-value-domain
                  code="DS00.00.109"
                  :value.sync="form.formCode"
                  remoteShowKey="VALUE"
                  remoteValueKey="KEY"
                />-->
              </el-form-item>
              <el-form-item label="规格" prop="spec">
                <el-input placeholder="规格" v-model="form.spec" :disabled="disabled"></el-input>
              </el-form-item>
              <el-form-item label="售价" prop="price">
                <el-input placeholder="售价" v-model="form.price" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <l-divider title="其他信息"></l-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入库数量" prop="inQuantity">
                <el-input placeholder="入库数量" v-model="form.inQuantity"></el-input>
              </el-form-item>
              <el-form-item label="总金额" prop="totalAmt">
                <el-input placeholder="总金额" v-model="totalAmt"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效期" prop="expDate" style="width:280px">
                <el-date-picker v-model="form.expDate" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="margin-left-100">
            <el-button @click="saveForm" type="primary" size="mini">保存</el-button>
            <el-button @click="cancel" size="mini">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import base from "@/api/hmm/base";
import stock from "@/api/hmm/stock";

export default {
  data() {
    return {
      date: "",
      inType: "",
      status: "",
      number: "",
      cardParams: [
        [
          {
            label: "入库单号",
            prop: "inInventoryNum"
          },
          { label: "药库", prop: "storageCode" }
        ],
        [
          {
            label: "总金额",
            prop: "totalAmt"
          },
          { label: "药库", prop: "supplierCode" }
        ],
        [
          {
            label: "录入人员",
            prop: "inInventoryNum"
          },
          { label: "录入时间", prop: "storageCode" }
        ],
        [
          {
            label: "提交人员",
            prop: "inInventoryNum"
          },
          { label: "提交时间", prop: "storageCode" }
        ]
      ],
      cardListLoading: false,
      list: [
        {
          inInventoryNum: "1",
          storageCode: "2",
          totalAmt: "3",
          supplierCode: "4"
        },
        {
          inInventoryNum: "1",
          storageCode: "2",
          totalAmt: "3",
          supplierCode: "4"
        },
        {
          inInventoryNum: "1",
          storageCode: "2",
          totalAmt: "3",
          supplierCode: "4"
        },
        {
          inInventoryNum: "1",
          storageCode: "2",
          totalAmt: "3",
          supplierCode: "4"
        },
        {
          inInventoryNum: "1",
          storageCode: "2",
          totalAmt: "3",
          supplierCode: "4"
        },
        {
          inInventoryNum: "1",
          storageCode: "2",
          totalAmt: "3",
          supplierCode: "4"
        },
        {
          inInventoryNum: "1",
          storageCode: "2",
          totalAmt: "3",
          supplierCode: "4"
        },
        {
          inInventoryNum: "1",
          storageCode: "2",
          totalAmt: "3",
          supplierCode: "4"
        }
      ],
      inTypeList: [
        {
          value: "0",
          label: "采购入库"
        },
        {
          value: "1",
          label: "调拨入库"
        },
        {
          value: "2",
          label: "退回入库"
        }
      ],
      statusList: [
        {
          value: "0",
          label: "未提交"
        },
        {
          value: "1",
          label: "已提交"
        },
        {
          value: "",
          label: "全部"
        }
      ],
      drgstrg: [],

      tableData: [],
      // 表格数据
      tableParams: [
        {
          label: "药品名称",
          prop: "drugName",
          width: "150",
          align: "left",
          fixed: "left"
        },
        {
          label: "规格",
          prop: "spec",
          width: "150",
          align: "left"
        },
        {
          label: "产地",
          prop: "originCode",
          width: "150",
          align: "left"
        },
        {
          label: "产地标识码",
          prop: "originIdentificationCode",
          width: "150",
          align: "left"
        },
        {
          label: "剂型",
          prop: "formCode",
          width: "150",
          align: "left"
        },
        {
          label: "入库数量",
          prop: "inQuantity",
          width: "150",
          align: "left"
        },
        {
          label: "单位",
          prop: "drugUnit",
          width: "150",
          align: "left"
        },
        {
          label: "进价",
          prop: "purchasePrice",
          width: "150",
          align: "left"
        },
        {
          label: "售价",
          prop: "price",
          width: "150",
          align: "left"
        },
        {
          label: "总金额",
          prop: "totalAmt",
          width: "150",
          align: "left"
        },
        {
          label: "生产批号",
          prop: "batchNum",
          width: "150",
          align: "left"
        },
        {
          label: "有效期",
          prop: "expDate",
          width: "150",
          align: "left"
        },
        {
          prop: "operate",
          label: "操作",
          width: "100",
          align: "center",
          fixed: "right"
        }
      ],

      // 入库单
      stgForm: {},
      copyStgForm: {},

      form: {},
      showEditDrawer: false,

      // 分页数据
      pagination: {
        currentPage: 1,
        pageSize: 99999,
        total: 1,
        layout: "sizes,prev,pager,next,jumper,total"
      },

      // 表单验证
      rules: {
        inType: [
          { required: true, message: "请选择入库类型", trigger: "blur" }
        ],
        supplierCode: [
          { required: true, message: "请选择供应商", trigger: "blur" }
        ],
        storageCode: [
          { required: true, message: "请选择库房", trigger: "blur" }
        ]
      },

      // 下拉表格
      testValue: "",
      testDatas: [],
      loading: false,
      itemIndex: null, // 修改时，记录索引号
      selectionItemIndexes: [], // 存放复选框选中的索引
      seledIds: [],
      supplierList: [],
      originList: [],
      formList: []
    };
  },
  computed: {
    totalAmt() {
      if (this.form.purchasePrice && this.form.inQuantity) {
        let p = (form.purchasePrice * form.inQuantity).toFixed(2);
        this.$set(this.form, "totalAmt", p);
        return p;
      }
      return 0;
    },
    cardListDisabled() {
      return this.cardListLoading;
    }
  },
  methods: {
    delCard(cardInfo) {},
    loadCardList() {
      console.log("load");
      this.cardListLoading = true;
      let self = this;
      setTimeout(() => {
        self.cardListLoading = false;
      }, 2000);
    },
    cardListSort(sortKey) {
      console.log("排序", sortKey);
    },

    async getAllList() {
      this.originList = await stock.getOriginList();
      this.formList = await stock.getFormList();
      this.drgstrg = await stock.getDrgstrgList(JSON.parse("[0, 1]"));
    },
    formatData(row, item) {
      return row[item.prop];
    },
    async search() {
      try {
        this.$showLoading();
        let pageNo = this.pagination.currentPage;
        let pageSize = this.pagination.pageSize;
        // 如果有查询条件，从第一页开始查询

        let response = await stock.listInInventory({
          pageNo,
          pageSize,
          inType: this.inType,
          status: this.status,
          number: this.number
        });
        let { data } = response;
        let list = [];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          list.push(item);
        }
        this.list = list;
        this.pagination.currentPage = response.pageNo;
        this.pagination.pageSize = response.pageSize;
        this.pagination.total = response.total;
        this.createNumber();
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    clear() {
      this.date = "";
      this.inType = "";
      this.status = "";
      this.number = "";
    },
    // 删除入库单
    async del() {
      try {
        this.$showLoading();
        if (this.stgForm.id) {
          await stock.delInInventory([this.stgForm.id]);
          this.search();
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },

    // button 保存
    async saveForm() {
      this.$refs["formElem1"].validate(async valid => {
        if (valid) {
          try {
            // 判断更新还是保存
            this.$showLoading();
            const tableData = [...this.tableData];
            let index = this.itemIndex;
            // 判段是否有重复数据，防止重复插入
            if (index || index == 0) {
              tableData[index] = this.form;
              this.itemIndex = null;
            } else {
              tableData.push(this.form);
            }
            this.tableData = tableData;
            this.showEditDrawer = false;
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg);
          }
        }
        return valid;
      });
    },
    // button 取消
    async cancel() {
      this.showEditDrawer = false;
    },
    deleteConfirm(rowIndex, row) {
      this.$confirm("此操作将删除当前记录, 是否继续?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (row.id) {
            this.deleteItems([row.id]);
          }
          this.$delete(this.tableData, rowIndex);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 删除数组
    deleteAllConfirm() {
      if (this.selectionItemIndexes.length > 0) {
        this.$confirm("此操作将删除当前记录, 是否继续?", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            if (this.seledIds.length != 0) {
              this.deleteItems();
            }
            // 删除本地缓存数据
            for (let index of this.selectionItemIndexes) {
              this.$delete(this.tableData, index);
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$alert("请正确选择需要操作的记录！", "警告", {
          confirmButtonText: "确定"
        });
      }
    },
    async deleteItems(ids) {
      let tmpIds = ids || this.seledIds;
      try {
        if (tmpIds.length == 0) {
          return;
        }
        this.$showLoading();

        if (!ids) {
          this.seledIds = [];
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 记录选中行
    getRowsIdx(rows) {
      let ids = [];
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        if (item.id) {
          ids.push(item.id);
        }
        this.selectionItemIndexes.push(item.index);
      }
      this.seledIds = ids;
    },
    tableRowClassName(row) {
      // 设置row对象的index
      row.row.index = row.rowIndex;
    },
    // 切换到某页
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.search();
    },
    // 翻页
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.search();
    },

    async remoteMethod(query) {
      let params = {
        pageNo: 1,
        pageSize: 1000,
        classCode: "",
        drugName: query
      };

      this.loading = true;
      let data = [];
      let result = await base.getDrugList(params);
      for (let i = 0; i < result.length; i++) {
        data.push({
          drugId: result[i].id,
          drugName: result[i].drugName,
          spec: result[i].spec,
          formCode: result[i].formCode,
          originCode: result[i].originCode,
          originIdentificationCode: result[i].originIdentificationCode,
          drugUnit: result[i].drugUnit,
          purchasePrice: result[i].purchasePrice,
          price: result[i].maxPrice,
          dataVersion: result[i].dataVersion
        });
      }
      this.testDatas = data;
      this.loading = false;
    },
    // 药品名称下拉跨事件
    drugNameChange(id) {
      let func = {};
      // 将选中的值放入form中
      // 根据id遍历testdatas[],将dose，drugName等放入form[]中
      for (let i = 0; i < this.testDatas.length; i++) {
        if (this.testDatas[i]["drugId"] === id) {
          func = this.testDatas[i];
        }
      }

      this.form.drugId = func["drugId"];
      this.form.drugName = func["drugName"];
      this.form.spec = func["spec"];
      this.form.formCode = func["formCode"];
      this.form.originCode = func["originCode"];
      this.form.originIdentificationCode = func["originIdentificationCode"];
      this.form.drugUnit = func["drugUnit"];
      this.form.purchasePrice = func["purchasePrice"];
      this.form.price = func["price"];
      console.log(this.form);
      // 将info与form合并
      // Object.assign(this.form, info);
    },
    createNumber() {
      this.$refs["formElem"].resetFields();
      this.stgForm = {};
      this.tableData = [];
    },
    // 入库单 保存事件
    async save() {
      this.$refs["formElem"].validate(async valid => {
        if (valid) {
          try {
            // 判断更新还是保存
            this.$showLoading();
            this.stgForm["inInventoryDPOList"] = this.tableData;
            if (this.stgForm.id) {
              let params = {
                oldInInventory: this.copyStgForm,
                newInInventory: this.stgForm
              };
              console.log(params);
              await stock.updateInInventory(params);
            } else {
              await stock.addInInventory(this.stgForm);
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg);
          }
        }
      });
    },

    // 根据当前id获取记录详情
    async findDetail(id) {
      try {
        // 判断更新还是保存
        this.$showLoading();
        let result = await stock.getDetail(id);
        this.stgForm = {
          id: result.id,
          inType: result.inType,
          storageCode: result.storageCode,
          supplierCode: result.supplierCode,
          inInventoryNum: result.inInventoryNum,
          totalAmt: result.totalAmt,
          entryPersonName: result.entryPersonName,
          entryTime: new Date(result.entryTime).format("yyyy-MM-dd"),
          dataVersion: result.dataVersion
        };
        this.copyStgForm = { ...result };
        this.tableData = [...result["inInventoryDPOList"]];
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    async lastSubmit() {
      try {
        // 判断更新还是保存
        this.$showLoading();
        await stock.updateInInventoryById(this.stgForm.id);
        this.stgForm = [];
        this.tableData = [];
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.left-container {
  float: left;
  width: 345px;
  height: 100%;
}

.right-container {
  margin-left: 355px;
  height: 100%;
}

.line {
  width: 100%;
  margin-bottom: 10px;
}

.slip-container {
  position: absolute;
  top: 200px;
  bottom: 4px;
  left: 4px;
  right: 4px;
  width: auto;
  height: auto;
  border: 1px solid $l-color-border-3;
}

.l-card-icon {
  margin-bottom: 1px;

  .el-col {
    line-height: 19px;
    margin-top: 5px;

    .labelName {
      color: $l-color-text-regular;
    }
  }
}

.tools-container {
  padding: 8px 15px;
  border-bottom: 1px solid $l-color-text-secondary;
}

.form-container {
  padding: 12px;
}

.form-title {
  font-size: 16px;
  font-weight: $l-font-weight;
  text-align: center;
}

.el-form-item {
  margin-bottom: 10px !important;
}
</style>
