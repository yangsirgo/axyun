<template>
  <div class="drugForm width100 height100">
    <el-card class="card-cont width100 height100">
      <el-row style="border-bottom:1px solid #E4E4E4">
        <el-col :span="24" class="cardTitleStyle">
          <l-card-title>
            <span slot="left">招标药品信息</span>
          </l-card-title>
        </el-col>
      </el-row>

      <div class="tabs">
        <el-form ref="drugForm" :model="this.drugFormDeail" :rules="rules">
          <el-row>
            <el-col :span="24">
              <el-form-item label label-width prop="drugName">
                <l-formt-title
                  required
                  label="药品名称"
                  labelWidth="48"
                  :disabled="!drugFormDeail.isnew"
                >
                  <Linput
                    v-if="drugFormDeail.isnew"
                    :popoverWidth="800"
                    v-model="drugFormDeail.drugName"
                    suffix-icon="el-icon-search"
                    style="width:200px;"
                    :tableData="selectOptions"
                    @query="elsearch($event)"
                    @select="select"
                    :tableParams="dropColumn"
                    placeholder="请选择药品"
                  ></Linput>
                  <el-input
                    v-else
                    v-model="drugFormDeail.drugName"
                    style="line-height: 34px;"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label label-width prop="spec">
                <l-formt-title label="规格" labelWidth="48" :disabled="true">
                  <el-input
                    v-model="drugFormDeail.spec"
                    style="line-height: 34px;"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label label-width prop="originCode">
                <l-formt-title label="生产厂商" labelWidth="52" :disabled="true">
                  <span :val="drugFormDeail.originCode" code="Manufacturer" v-codeTransform></span>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label label-width prop="originIdentificationCode">
                <l-formt-title label="厂商标识" labelWidth="62" :disabled="true">
                  <span
                    :val="drugFormDeail.originIdentificationCode"
                    code="DrugManufacturerFlag"
                    v-codeTransform
                  ></span>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label label-width prop="supplierCode">
                <l-formt-title label="供应商" required labelWidth="76">
                  <Supplier clearable :value.sync="drugFormDeail.supplierCode" />
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label label-width prop="purchasePrice">
                <l-formt-title label="进价" required labelWidth="62">
                  <el-input v-model="drugFormDeail.purchasePrice" type="number" style="line-height: 34px;"></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label label-width prop="price">
                <l-formt-title label="售价" required labelWidth="62">
                  <el-input v-model="drugFormDeail.price" type="number" style="line-height: 34px;"></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="date">
                <l-formt-title label="时间" required labelWidth="62">
                  <el-date-picker
                    v-model="drugFormDeail.date"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions0"
                    :default-time="['00:00:00', '23:59:59']"
                  ></el-date-picker>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row style="margin-top:10px" :gutter="10">
            <el-col :span="24">
              <l-formt-title label="结束时间" labelWidth="62">
                <el-date-picker
                  v-model="drugFormDeail.stopTime"
                  type="datetime"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </l-formt-title>
            </el-col>
          </el-row>-->
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label label-width prop="status">
                <l-formt-title label="状态标识" required labelWidth="76" style="width:100%">
                  <el-select v-model="drugFormDeail.status" style="line-height: 34px;width:100%">
                    <el-option label="暂停" value="0"></el-option>
                    <el-option label="正常" value="1"></el-option>
                  </el-select>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="!drugFormDeail.isnew">
            <el-col :span="12">
              <el-form-item label label-width prop="createdByName">
                <l-formt-title label="创建人" labelWidth="62" style="width:100%" :disabled="true">
                  <el-input
                    v-model="drugFormDeail.createdByName"
                    style="line-height: 34px;width:100%"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label label-width prop="createdAt">
                <l-formt-title label="创建时间" labelWidth="76" style="width:100%" :disabled="true">
                  <el-input
                    v-model="drugFormDeail.createdAt"
                    style="line-height: 34px;"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="!drugFormDeail.isnew">
            <el-col :span="12">
              <el-form-item label label-width prop="updatedByName">
                <l-formt-title label="修改人" labelWidth="62" style="width:100%" :disabled="true">
                  <el-input
                    v-model="drugFormDeail.updatedByName"
                    style="line-height: 34px;width:100%"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label label-width prop="updatedAt">
                <l-formt-title label="修改时间" labelWidth="76" style="width:100%" :disabled="true">
                  <el-input
                    v-model="drugFormDeail.updatedAt"
                    style="line-height: 34px;"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="button-cont">
        <el-button class="confirm-button" @click="confirm">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import Linput from "./Linput";
import hmmBaseApi from "@/api/hmm/base";
import Supplier from "@/views/drugManagement/drugstock/purchase/component/supplier.vue";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";

export default {
  name: "tender",
  props: ["drugForm", "supplierList"],
  components: {
    Linput,
    Supplier
  },
  data() {
    return {
      drugFormDeail: {
        isnew: true,
        bidId: "",
        dataVersion: 0,
        deletedStatus: "",
        drugId: "",
        drugName: "",
        spec: "",
        id: "",
        originCode: "",
        originIdentificationCode: "",
        purchasePrice: "",
        price: "",
        startTime: "",
        status: "",
        stopTime: "",
        supplierCode: "",
        date: []
      },
      //表格编辑输入药品名称联想药品table数据源
      selectOptions: [],
      // 下拉 table 配置表头
      dropColumn: [
        {
          prop: "drugName",
          label: "药品名称",
          width: 150
        },
        {
          prop: "spec",
          label: "规格",
          width: 50
        },
        {
          prop: "price",
          label: "售价",
          width: 100
        },
        {
          prop: "packUnit",
          label: "包装单位",
          width: 100
        },
        {
          prop: "formCode",
          label: "剂型",
          width: 50
        }
      ],
      selectlist: [], //药品快速选择
      rules: {
        drugName: [
          { required: true, message: "请搜索并选择药品", trigger: "blur" }
        ],
        supplierCode: [
          { required: true, message: "请选择供应商", trigger: "change" }
        ],
        purchasePrice: [
          { required: true, message: "请输入进价", trigger: "blur" }
        ],
        price: [{ required: true, message: "请输入售价", trigger: "blur" }],
        date: [
          {
            type: "array",
            required: true,
            message: "请选择招标时间",
            trigger: "change"
          }
        ],
        status: [
          { required: true, message: "请选择状态标识", trigger: "change" }
        ]
      },
      storageCode: "",
      pageParams: {
        pageNo: 1,
        pageSize: 10000
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
     }
    };
  },
  watch: {
    drugForm() {
      this.$refs.drugForm && this.$refs.drugForm.resetFields();
      this.drugFormDeail = {
        ...this.drugForm,
        date: [this.drugForm.startTime, this.drugForm.stopTime]
      };
    }
  },
  created() {
    this.getUserStorage();
  },
  methods: {
    // 招标信息保存
    confirm() {
      this.$refs.drugForm.validate(valid => {
        if (valid) {
          let params = {
            startTime:
              this.drugFormDeail.date && this.drugFormDeail.date[0]
                ? this.drugFormDeail.date[0]
                : "",
            stopTime:
              this.drugFormDeail.date && this.drugFormDeail.date[1]
                ? this.drugFormDeail.date[1]
                : "",
            dataVersion: this.drugFormDeail.dataVersion,
            deletedStatus: this.drugFormDeail.deletedStatus,
            id: this.drugFormDeail.id || "",
            bidId: this.drugFormDeail.bidId,
            drugId: this.drugFormDeail.drugId,
            drugName: this.drugFormDeail.drugName,
            spec: this.drugFormDeail.spec,
            originCode: this.drugFormDeail.originCode,
            originIdentificationCode: this.drugFormDeail
              .originIdentificationCode,
            price: this.drugFormDeail.price,
            purchasePrice: this.drugFormDeail.purchasePrice,
            status: this.drugFormDeail.status,
            supplierCode: this.drugFormDeail.supplierCode
          };

          this.$showLoading();
          hmmBaseApi
            .saveBidDrug(params)
            .then(res => {
              if (res.code == 1) {
                this.$message.success("保存成功");
                this.$emit("getRefreshList", this.drugFormDeail);
              } else {
                this.$message.error(res.msg || "保存失败");
              }
              this.$hideLoading();
            })
            .catch(err => {
              this.$hideLoading();
              this.$message.error(err.msg || "保存失败");
            });
        }
      });
    },
    //新增
    newadd() {
      this.$refs.drugForm.resetFields();
      this.drugFormDeail = {
        isnew: true,
        bidId: "",
        dataVersion: 0,
        deletedStatus: 0,
        drugId: "",
        drugName: "",
        spec: "",
        id: "",
        originCode: "",
        originIdentificationCode: "",
        purchasePrice: "",
        price: "",
        startTime: "",
        status: "",
        stopTime: "",
        supplierCode: "",
        date: []
      };
    },
    // 获取当前登录的药房
    getUserStorage() {
      hmmBaseApi
        .getCurDrugStorage()
        .then(res => {
          if (res.code === 1) {
            console.log(res.data);
            this.storageCode = res.data.storageCode;
          } else {
            this.$message.error("获取当前库房失败");
          }
        })
        .catch(err => {
          this.$message.error("获取当前库房失败");
        });
    },
    //联想输入方法
    elsearch(drugName) {
      //搜索联想
      this.searchParams = { ...this.pageParams };
      this.searchParams.drugName = drugName;
      this.selectOptions = [];
      this.getDrugList(this.searchParams);
    },
    //获取联想搜索结果
    getDrugList(params) {
      hmmBaseApi.getDrugList(params).then(res => {
        const list = res.data.map(drugWapper => {
          // 库存量转化
          const { out, bl } = blukToOutfit(
            drugWapper.drugStock,
            drugWapper.packQuantity
          );
          return {
            ...drugWapper,
            id: "",
            drugId: drugWapper.id,
            kcOut: out,
            kcBl: bl,
            isEditing: true
          };
        });
        this.selectOptions = list;
      });
    },
    //回填
    select(row) {
      this.selectOptions = [];
      this.drugFormDeail = {
        ...this.drugFormDeail,
        ...row
      };
      this.$nextTick(() => {
        this.$refs.drugForm.validate();
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.drugForm {
  .card-cont {
    padding: 0 20px 20px 20px;
    .cardTitleStyle{
      padding: 8px 0px;
    }
    .el-form-item {
      margin-bottom: 0;
    }

    .tabs {
      height: calc(100% - 150px);
      overflow-y: auto;
      .remove-button,
      .add-button {
        width: 18px;
        height: 18px;
        margin-top: 8px;
        display: inline-block;
      }
      .add-button {
        margin-left: 10px;
      }
    }

    .button-cont {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid $l-color-bgcolor-11;

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
.tabs {
  padding-top: 4px;
  overflow-x: hidden;
  /deep/ .el-form-item--medium .el-form-item__content {
    height: 36px;
    margin-bottom: 4px;
  }
}
</style>
