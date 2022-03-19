<template>
  <div class="pharmacy width100 height100">
    <div class="left">
      <div class="top">
        <el-table
          ref="multipleTable"
          :data="drugData"
          border
          stripe
          highlight-current-row
          width="100%"
          height="195px"
          @current-change="rowClick"
          @header-dragend="headerDragend"
          v-loading="topLoad"
        >
          <el-table-column
            v-for="(item, index) in drugParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'originCode'">
                <span
                  :val="scope.row.originCode"
                  code="Manufacturer"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'originIdentificationCode'">
                <span
                  :val="scope.row.originIdentificationCode"
                  code="DrugManufacturerFlag"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'status'">
                <span v-if="scope.row[item.prop] == '0'">禁用</span>
                <span v-if="scope.row[item.prop] == '1'">正常</span>
              </template>
              <template v-else-if="item.prop == 'drugStock'">
                <span>{{ scope.row.outfit }}</span>
                <span
                  :val="scope.row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <template v-if="scope.row.bluk !== 0">
                  <span>{{ scope.row.bluk }}</span>
                  <span
                    :val="scope.row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
              </template>
              <template v-else-if="item.prop == 'maxStock'">
                <span>{{ scope.row.gcOut }}</span>
                <span
                  :val="scope.row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'minStock'">
                <span>{{ scope.row.dcOut }}</span>
                <span
                  :val="scope.row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
              </template>
              <template v-else-if="item.prop == 'availableQuantity'">
                <span>{{ scope.row.ksfOut }}</span>
                <span
                  :val="scope.row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <template v-if="scope.row.ksfBl !== 0">
                  <span>{{ scope.row.ksfBl }}</span>
                  <span
                    :val="scope.row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
              </template>
              <template v-else>
                <span class="overflow-point">{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="center">
        <el-checkbox v-model="checked" @change="change"
          >只显示当前有库存的记录</el-checkbox
        >
      </div>
      <div class="bottom">
        <el-table
          :data="drugDetailData"
          border
          width="100%"
          height="100%"
          ref="singleTable"
          highlight-current-row
          v-loadmore="load"
          v-loading="tlm_isLoading"
        >
          <el-table-column
            v-for="(item, index) in drugDetailParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'left'"
            :fixed="item.fixed"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop == 'drugStock'">
                <span>{{ scope.row.outfit }}</span>
                <span
                  :val="scope.row.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <template v-if="scope.row.bluk !== 0">
                  <span>{{ scope.row.bluk }}</span>
                  <span
                    :val="scope.row.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
              </template>
              <template v-else-if="item.prop == 'availableQuantity'">
                <div class="no-wrap">
                  <el-input
                    @keyup.native="textValueSf($event, scope.$index)"
                    v-model.number="scope.row.sfOut"
                  ></el-input>
                  <span
                    :val="scope.row.drugUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <template v-if="scope.row.unitSaleFlg === '1'">
                    <el-input
                      @keyup.native="textValueSf($event, scope.$index)"
                      v-model.number="scope.row.sfBl"
                    ></el-input>
                    <span
                      :val="scope.row.packUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                </div>
              </template>
              <template v-else-if="item.prop == 'purchasePrice'">
                <span>{{ formatNum(scope.row.purchasePrice) }}</span>
              </template>
              <template v-else-if="item.prop == 'totalAmt'">
                <span>{{ formatNum(scope.row.totalAmt) }}</span>
              </template>
              <template v-else-if="item.prop == 'price'">
                <span>{{ formatNum(scope.row.price) }}</span>
              </template>
              <template v-else-if="item.prop == 'amt'">
                <span>{{ formatNum(scope.row.amt) }}</span>
              </template>
              <template v-else>
                <span class="overflow-point">{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="right-save">
        <el-button type="primary" @click="saveBatch">保存</el-button>
      </div>
    </div>
    <div class="right">
      <el-form ref="drugForm" :model="drugForm">
        <el-row :gutter="10">
          <el-col :span="24">
            <l-formt-title label="药房" labelWidth="48" :disabled="true">
              <el-form-item label label-width prop="drugVarieties">
                <el-input
                  v-model="drugForm.storageName"
                  :disabled="true"
                  style="line-height: 34px"
                ></el-input>
              </el-form-item>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px" :gutter="10">
          <el-col :span="24">
            <l-formt-title label="药品名称" labelWidth="76" :disabled="true">
              <el-form-item label label-width prop="drugName">
                <el-input
                  v-model="drugForm.drugName"
                  style="line-height: 34px"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px" :gutter="10">
          <el-col :span="12">
            <l-formt-title label="单位" labelWidth="48" :disabled="true">
              <el-form-item label label-width prop="drugUnit">
                <l-value-domain
                  code="DrugUnit"
                  :value.sync="drugForm.drugUnit"
                  :disabled="true"
                />
              </el-form-item>
            </l-formt-title>
          </el-col>
          <el-col :span="12">
            <l-formt-title label="剂型" labelWidth="48" :disabled="true">
              <el-form-item label label-width prop="formCode">
                <l-value-domain
                  :value.sync="drugForm.formCode"
                  remoteUrl="/hmm-stock/form/listForDropDown"
                  remoteShowKey="name"
                  remoteValueKey="code"
                  :localFilterKeys="['keyword']"
                  :disabled="true"
                  placeholder="请选择"
                ></l-value-domain>
              </el-form-item>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px" :gutter="10">
          <el-col :span="24">
            <l-formt-title label="规格" labelWidth="48" :disabled="true">
              <el-form-item label label-width prop="spec">
                <el-input
                  v-model="drugForm.spec"
                  style="line-height: 34px"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px" :gutter="10">
          <el-col :span="12">
            <l-formt-title label="进价" labelWidth="48" :disabled="true">
              <el-form-item label label-width prop="purchasePrice">
                <el-input
                  v-model="drugForm.purchasePrice"
                  style="line-height: 34px"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </l-formt-title>
          </el-col>
          <el-col :span="12">
            <l-formt-title label="售价" labelWidth="48" :disabled="true">
              <el-form-item label label-width prop="price">
                <el-input
                  v-model="drugForm.price"
                  style="line-height: 34px"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px" :gutter="10">
          <el-col :span="24">
            <l-formt-title
              label="药品报销类型"
              labelWidth="76"
              :disabled="true"
            >
              <el-form-item label label-width prop="controlLevel">
                <l-value-domain
                  code="DrugReimbursementType"
                  :value.sync="drugForm.controlLevel"
                  :disabled="true"
                ></l-value-domain>
              </el-form-item>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px" :gutter="10">
          <el-col :span="24">
            <l-formt-title label="管理类型" labelWidth="76" :disabled="true">
              <el-form-item label label-width prop="manageType">
                <l-value-domain
                  code="DrugManaType"
                  :value.sync="drugForm.manageType"
                  :disabled="true"
                />
              </el-form-item>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px" :gutter="10">
          <el-col :span="24">
            <l-formt-title label="库存量" labelWidth="62" :disabled="true">
              <div class="form-msg">
                {{ drugForm.outfit }}
                <span
                  :val="drugForm.drugUnit"
                  code="DrugUnit"
                  v-codeTransform
                ></span>
                <template v-if="drugForm.bluk !== 0">
                  <span>{{ drugForm.bluk }}</span>
                  <span
                    :val="drugForm.packUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </template>
              </div>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px" :gutter="10">
          <el-col :span="24">
            <l-formt-title label="高储数量" labelWidth="76">
              <el-form-item label label-width prop="maxStock">
                <!-- <el-input v-model="drugForm.maxStock" style="line-height: 34px;"></el-input> -->
                <div class="num-input">
                  <el-input
                    v-model="drugForm.gcOut"
                    style="line-height: 34px"
                    @keyup.native="
                      textValue($event, ['maxStock', 'gcOut', 'gcBl'])
                    "
                  ></el-input>
                  <span
                    :val="drugForm.drugUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </div>
              </el-form-item>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px" :gutter="10">
          <el-col :span="24">
            <l-formt-title label="低储数量" labelWidth="76">
              <el-form-item label label-width prop="minStock">
                <!-- <el-input v-model="drugForm.minStock" style="line-height: 34px;"></el-input> -->
                <div class="num-input">
                  <el-input
                    v-model="drugForm.dcOut"
                    style="line-height: 34px"
                    @keyup.native="
                      textValue($event, ['minStock', 'dcOut', 'dcBl'])
                    "
                  ></el-input>
                  <span
                    :val="drugForm.drugUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                </div>
              </el-form-item>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px" :gutter="10">
          <el-col :span="24">
            <l-formt-title label="可收费量" labelWidth="90" :disabled="true">
              <el-form-item label label-width prop="availableQuantity">
                <div class="num-input">
                  <el-input
                    v-model="drugForm.ksfOut"
                    style="line-height: 34px"
                    :disabled="true"
                    @keyup.native="
                      textValue($event, [
                        'availableQuantity',
                        'ksfOut',
                        'ksfBl',
                      ])
                    "
                  ></el-input>
                  <span
                    :val="drugForm.drugUnit"
                    code="DrugUnit"
                    v-codeTransform
                  ></span>
                  <template v-if="drugForm.unitSaleFlg === '1'">
                    <el-input
                      v-model="drugForm.ksfBl"
                      style="line-height: 34px"
                      :disabled="true"
                      @keyup.native="
                        textValue($event, [
                          'availableQuantity',
                          'ksfOut',
                          'ksfBl',
                        ])
                      "
                    ></el-input>
                    <span
                      :val="drugForm.packUnit"
                      code="DrugUnit"
                      v-codeTransform
                    ></span>
                  </template>
                </div>
              </el-form-item>
            </l-formt-title>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-cont">
        <el-button class="confirm-button" @click="confirm">保存修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import stock from "@/api/hmm/stock";
import {
  blukToOutfit,
  outfitToBluk,
  blukToOutfitFirst
} from "@/utils/drugManagement.js";
import formatNum from "@/utils/formatPrice.js";

export default {
  name: "pharmacy",
  props: ["drugId", "ddstorageCode", "ddstorageCodeList"],
  data() {
    return {
      //药品表格
      drugParams: [
        {
          prop: "storageName",
          label: "药房",
          align: "left",
          width: "150",
          fixed: "left"
        },
        {
          prop: "drugStock",
          label: "库存量",
          align: "left",
          width: "140",
          fixed: false
        },
        {
          prop: "originCode",
          label: "生产厂商",
          align: "left",
          width: "160",
          fixed: false
        },
        {
          prop: "originIdentificationCode",
          label: "生产厂商标识",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "maxStock",
          label: "高储数量",
          align: "left",
          width: "100",
          fixed: false
        },
        {
          prop: "minStock",
          label: "低储数量",
          align: "left",
          width: "100",
          fixed: false
        },
        {
          prop: "availableQuantity",
          label: "可收费用量",
          align: "left",
          width: "120",
          fixed: false
        }
      ],
      //药品表格数据
      drugData: [],
      checked: true,
      //详细表格
      drugDetailParams: [
        {
          prop: "drugStock",
          label: "库存量",
          align: "left",
          width: "140",
          fixed: false
        },
        {
          prop: "purchasePrice",
          label: "进价(元)",
          align: "right",
          width: "80",
          fixed: false
        },
        {
          prop: "totalAmt",
          label: "进价金额(元)",
          align: "right",
          width: "120",
          fixed: false
        },
        {
          prop: "price",
          label: "售价(元)",
          align: "right",
          width: "80",
          fixed: false
        },
        {
          prop: "amt",
          label: "售价金额(元)",
          align: "right",
          width: "120",
          fixed: false
        },
        {
          prop: "batchNum",
          label: "生产批号",
          align: "left",
          width: "120",
          fixed: false
        },
        {
          prop: "expDate",
          label: "有效期",
          align: "center",
          width: "100",
          fixed: false,
          tooltipShow:true
        },
        {
          prop: "availableQuantity",
          label: "可收费量",
          align: "left",
          width: "200",
          fixed: false
        },
        {
          prop: "inId",
          label: "批次",
          align: "left",
          width: "120",
          fixed: false
        }
      ],
      //详细表格数据
      drugDetailData: [],
      //分页详细表格数据
      drugDetailDataUnit: [],
      //分页数据
      page: 1,
      limit: 10,
      total: 0,
      tlm_isLoading: false,
      //表单数据
      drugForm: {},
      rules: {
        maxStock: [
          {
            required: true,
            message: "请输入高储数量",
            trigger: "blur"
          }
        ],
        minStock: [
          {
            required: true,
            message: "请输入低储数量",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择药品状态",
            trigger: "change"
          }
        ],
        availableQuantity: [
          {
            required: true,
            message: "请输入可收费用量",
            trigger: "blur"
          }
        ]
      },
      topLoad: false
    };
  },
  watch: {
    drugId: {
      handler(val) {
        if (val) {
          this.getDrugList();
        }
      },
      immediate: true
    }
  },
  computed: {
    tlm_noMore() {
      return Math.ceil(this.total / this.limit) <= this.page;
    }
  },
  methods: {
    formatNum(num) {
      return formatNum(num);
    },
    //获取药品列表
    getDrugList() {
      // this.$showLoading();
      let ndata = {};
      if (this.ddstorageCodeList) {
        ndata = {
          storageCodeList: this.ddstorageCodeList
        };
      }
      let params = {
        pageNo: this.page,
        pageSize: this.limit,
        stockType: 1,
        ids: this.drugId,
        currDrugStorageR: "1",
        orderBy: "a.class_code"
      };

      params.pageNo = this.page;
      params.pageSize = this.limit;
      params.stockType = 1;
      params.ids = this.drugId;
      stock
        .getStockList(params)
        .then(res => {
          if (res.code == 1) {
            let list = res.data.map(item => {
              let kcnum = blukToOutfitFirst(item.drugStock, item.packQuantity);

              let gcnum = blukToOutfit(item.maxStock, item.packQuantity);
              let dcnum = blukToOutfit(item.minStock, item.packQuantity);
              let ksfnum = blukToOutfitFirst(
                item.availableQuantity,
                item.packQuantity
              );
              return {
                ...item,
                outfit: kcnum.out,
                bluk: kcnum.bl,
                gcOut: gcnum.out,
                dcOut: dcnum.out,
                ksfOut: ksfnum.out,
                ksfBl: ksfnum.bl
              };
            });
            this.drugData = list;
            this.$refs.multipleTable.setCurrentRow(this.drugData[0]);
          } else {
            this.$message.error(res.msg || "获取药品药房信息数据失败");
          }
        })
        .catch(res => {});
    },
    //获取详细药品列表
    async getDrugDetailList() {
      if (!this.drugForm.drugId) {
        return;
      }
      this.tlm_isLoading = true;
      try {
        //获取药品数据接口,传参drugForm,page，limit
        let response = await stock.getStockDList({
          pageNo: this.page,
          pageSize: this.limit,
          storageCode: this.drugForm.storageCode,
          drugId: this.drugForm.drugId,
          hasStock: this.checked
        });
        let { data } = response;
        let batchTableData = [];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          let kcnum = blukToOutfitFirst(item.drugStock, item.packQuantity);
          let thnum = blukToOutfit(item.drugRefundQuantity, item.packQuantity);
          let sfnum = blukToOutfit(item.availableQuantity, item.packQuantity);
          let yjnum = blukToOutfit(
            item.drugEmergencyQuantity,
            item.packQuantity
          );
          batchTableData.push({
            ...item,
            outfit: kcnum.out,
            bluk: kcnum.bl,
            thOut: thnum.out,
            thBl: thnum.bl,
            sfOut: sfnum.out,
            sfBl: sfnum.bl,
            yjOut: yjnum.out,
            yjBl: yjnum.bl,
            batchNum: item.batchNum,
            drugId: item.drugId || "",
            drugName: item.drugName || "",
            spec: item.spec || "",
            formName: item.formName || "",
            originCode: item.originCode || "",
            originIdentificationCode: item.originIdentificationCode || "",
            dosageValue: item.dosageValue || "",
            dosageUnit: item.dosageUnit || "",
            purchasePrice: item.purchasePrice || "",
            formCode: item.formCode || "",
            totalAmt: item.totalAmt || "",
            price: item.price || "",
            amt: item.amt || "",
            drugUnit: item.drugUnit || "",
            packUnit: item.packUnit || "",
            packQuantity: item.packQuantity || "",
            drugStock: item.drugStock,
            supplierCode: item.supplierCode || "",
            approveNum: item.approveNum || "",
            expDate: item.expDate
              ? new Date(item.expDate).format("yyyy-MM-dd")
              : "",
            inTime: item.inTime
              ? new Date(item.inTime).format("yyyy-MM-dd")
              : "",
            createdByName: item.createdByName || "",
            createdAt: item.createdAt,
            dataVersion: item.dataVersion
          });
        }
        if (this.page === 1) {
          this.drugDetailData = batchTableData;
        } else {
          this.drugDetailData = this.drugDetailData.concat(batchTableData);
        }
        this.total = response.total;
        this.tlm_isLoading = false;
      } catch (error) {
        this.tlm_isLoading = false;
      }
    },
    //点击某一行药品
    rowClick(row) {
      this.drugForm = row;
      this.page = 1;
      this.getDrugDetailList();
    },
    //修改某一条药品数据
    confirm() {
      this.$refs["drugForm"].validate(async valid => {
        if (valid) {
          this.$showLoading();
          try {
            //保存修改接口，传参drugForm
            let res = await stock.updateStock(this.drugForm);
            console.log(res);
            if (res.code === 1) {
              this.$message.success("修改成功");
              this.getDrugList();
            } else {
              this.$message.error(res.msg || "修改失败");
            }
            this.$hideLoading();
          } catch (error) {
            this.$hideLoading();
            this.$message.error(error.msg || "修改失败");
          }
        }
      });
    },
    //滑动加载更多信息
    load() {
      if (this.tlm_noMore) {
        return;
      }
      this.page++;
      this.getDrugDetailList();
    },
    //显示内容是否有库存
    change() {
      this.page = 1;
      this.getDrugDetailList();
    },
    textValue(e, key) {
      this.validateResult = new RegExp("^[0-9][0-9]*$").test(e.target.value);
      if (!this.validateResult) {
        this.$message.warning("请输入数字");
        e.target.value = "";
      }
      let bluk = outfitToBluk(
        this.drugForm[key[1]],
        this.drugForm[key[2]],
        this.drugForm.packQuantity
      );
      this.$set(this.drugForm, key[0], bluk);
    },
    textValueSf(e, index) {
      this.validateResult = new RegExp("^[0-9][0-9]*$").test(e.target.value);
      if (!this.validateResult) {
        this.$message.warning("请输入数字");
        e.target.value = "";
      }
      let blnum = 0;
      if (this.drugDetailData[index].unitSaleFlg === "1") {
        blnum = this.drugDetailData[index].sfBl;
      }
      let bluk = outfitToBluk(
        this.drugDetailData[index].sfOut,
        blnum,
        this.drugDetailData[index].packQuantity
      );
      this.$set(this.drugDetailData, index, {
        ...this.drugDetailData[index],
        availableQuantity: bluk
      });
    },
    saveBatch() {
      this.$showLoading();
      stock
        .saveStockUpdate(this.drugDetailData)
        .then(res => {
          if (res.code === 1) {
            this.$message.success(res.msg || "保存成功");
            this.getDrugList();
          } else {
            this.$message.error(res.msg || "保存失败");
          }
          this.$hideLoading();
        })
        .catch(err => {
          this.$hideLoading();
          this.$message.error(err.msg || "保存失败");
        });
    },
    headerDragend() {
      this.$refs.multipleTable.doLayout();
    }
  }
};
</script>


<style scoped lang="scss">
.pharmacy {
  .el-form-item {
    margin-bottom: 0;
  }

  .left {
    width: calc(100% - 307px);
    height: 100%;
    margin-left: 20px;
    float: right;

    .top {
      height: 25%;
    }

    .center {
      margin: 20px 0;
    }

    .bottom {
      height: calc(75% - 110px);
    }
  }

  .right {
    width: 287px;
    height: 100%;
    padding: 20px;
    border-radius: 4px;
    border: 1px solid $l-color-bgcolor-11;
    float: left;

    .button-cont {
      .confirm-button {
        width: 80px;
        height: 36px;
        padding: 0;
        text-align: center;
        line-height: 36px;
        background: $l-color-primary;
        border-radius: 2px;
        font-size: $l-font-size;

        font-weight: 400;
        color: $l-color-white;
        float: right;
      }
    }
  }
}

.form-msg {
  line-height: 36px;
}

.num-input {
  .el-input {
    width: 45px;

    /deep/ .el-input__inner {
      padding-right: 0 !important;
    }
  }
}

.right-save {
  padding-top: 10px;
  text-align: right;
}

.no-wrap {
  white-space: nowrap;

  .el-input {
    width: 60px;
  }
}
</style>
