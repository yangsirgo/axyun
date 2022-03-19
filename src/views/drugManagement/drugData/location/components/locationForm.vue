<template>
  <div class="drugForm width100 height100">
    <el-card class="card-cont width100 height100">
      <el-row style="border-bottom: 1px solid #e4e4e4">
        <el-col :span="24" class="cardTitleStyle">
          <l-card-title>
            <span slot="left">药品位置信息</span>
          </l-card-title>
        </el-col>
      </el-row>

      <div class="tabs">
        <el-form ref="drugForm" :model="this.drugFormDeail">
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="24">
              <l-formt-title
                label="药品名称"
                labelWidth="48"
                :disabled="true"
                required
                v-if="!drugFormDeail.isnew"
              >
                <el-form-item label label-width prop="spec">
                  <el-input
                    v-model="drugFormDeail.drugName"
                    style="line-height: 34px"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
              <l-formt-title label="药品名称" labelWidth="76" v-else>
                <Linput
                  :popoverWidth="800"
                  v-model="drugFormDeail.drugName"
                  suffix-icon="el-icon-search"
                  :tableData="selectOptions"
                  @query="elsearch($event)"
                  @select="select"
                  @change="resetChooseDrug"
                  :tableParams="dropColumn"
                  placeholder="请选择药品"
                ></Linput>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="24">
              <l-formt-title label="规格" labelWidth="48" :disabled="true">
                <el-form-item label label-width prop="spec">
                  <el-input
                    v-model="drugFormDeail.spec"
                    style="line-height: 34px"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="24">
              <l-formt-title label="生产厂商" disabled labelWidth="76">
                <el-form-item label label-width prop="originCode">
                  <!-- <l-value-domain disabled code="Manufacturer" :value.sync="drugFormDeail.originCode" /> -->
                  <l-select-comp
                    code="Manufacturer"
                    :existKey="drugFormDeail.originCode"
                    disabled
                    :value.sync="drugFormDeail.originCode"
                  />
                </el-form-item>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="24">
              <l-formt-title label="库房" labelWidth="36" disabled>
                <el-select disabled v-model="storageCode" placeholder="请选择">
                  <el-option
                    v-for="item in drugStorageList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </l-formt-title>
            </el-col>
          </el-row>

          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="12">
              <l-formt-title label="参考进价" labelWidth="48" :disabled="true">
                <el-form-item label label-width prop="purchasePrice">
                  <el-input
                    v-model="drugFormDeail.purchasePrice"
                    style="line-height: 34px"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>

            <el-col :span="12">
              <l-formt-title label="参考售价" labelWidth="48" :disabled="true">
                <el-form-item label label-width prop="price">
                  <el-input
                    v-model="drugFormDeail.price"
                    style="line-height: 34px"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
          </el-row>

          <el-row
            style="margin-top: 10px"
            :gutter="10"
            v-for="(item, index) in tablelist"
            :key="index"
          >
            <el-col :span="4" style="line-height: 34px">
              货位
              <span>{{ index + 1 }}</span>
            </el-col>
            <el-col :span="8">
              <LFormtTitle label="大类" labelWidth="32">
                <el-select v-model="item.locationSort" placeholder="请选择">
                  <el-option
                    v-for="i in locationList"
                    :key="i.code"
                    :label="i.name"
                    :value="i.code"
                  />
                </el-select>
              </LFormtTitle>
            </el-col>
            <el-col :span="6">
              <LFormtTitle label="位置" labelWidth="32">
                <el-input
                  v-model.trim="item.locationSortNo"
                  style="line-height: 34px"
                ></el-input>
              </LFormtTitle>
            </el-col>
            <el-col :span="4">
              <span class="remove-button" @click="deleteAnoName(index)">
                <svg
                  t="1568190829279"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="13492"
                  width="18"
                  height="18"
                >
                  <path
                    d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z"
                    fill="#FFE3E2"
                    p-id="13493"
                  />
                  <path
                    d="M284.444444 455.111111h455.111112v113.777778H284.444444z"
                    fill="#E1140A"
                    p-id="13494"
                  />
                </svg>
              </span>
              <span
                class="add-button"
                @click="addAnoName(item)"
                v-if="index == tablelist.length - 1"
              >
                <svg
                  t="1568190873204"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="13604"
                  width="18"
                  height="18"
                >
                  <path
                    d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m0 56.888889a455.111111 455.111111 0 1 0 0 910.222222A455.111111 455.111111 0 0 0 512 56.888889z"
                    fill="#E4E4E4"
                    p-id="13605"
                  />
                  <path
                    d="M227.555556 455.111111h568.888888v113.777778H227.555556z"
                    fill="#2E323A"
                    p-id="13606"
                  />
                  <path
                    d="M455.111111 227.555556h113.777778v568.888888H455.111111z"
                    fill="#2E323A"
                    p-id="13607"
                  />
                </svg>
              </span>
            </el-col>
          </el-row>

          <el-row
            style="margin-top: 10px"
            :gutter="10"
            v-if="!drugFormDeail.isnew"
          >
            <el-col :span="12">
              <l-formt-title
                label="操作人"
                labelWidth="62"
                style="width: 100%"
                :disabled="true"
              >
                <el-form-item label label-width prop="updatedByName">
                  <el-input
                    v-model="drugFormDeail.updatedByName"
                    style="line-height: 34px; width: 100%"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>

            <el-col :span="12">
              <l-formt-title
                label="操作时间"
                labelWidth="76"
                style="width: 100%"
                :disabled="true"
              >
                <el-form-item label label-width prop="updatedAt">
                  <el-input
                    v-model="drugFormDeail.updatedAt"
                    style="line-height: 34px"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
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
import stock from "@/api/hmm/stock";
import { blukToOutfit, outfitToBluk } from "@/utils/drugManagement.js";

export default {
  name: "tender",
  props: ["drugForm", "drugStorageList"],
  components: {
    Linput
  },
  data() {
    return {
      favorites: [], //皮试液类型数据源
      tablelist: [], //货位需药品数据源
      drugFormDeail: {},
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
          prop: "formCode",
          label: "剂型",
          width: 50
        }
      ],
      selectlist: [], //药品快速选择
      rules: {
        drugName: [
          {
            required: true,
            message: "请输入药品名称",
            trigger: "blur"
          }
        ],
        spec: [
          {
            required: true,
            message: "请输入规格",
            trigger: "blur"
          }
        ],
        cwType: [
          {
            required: true,
            message: "请选择药品类型",
            trigger: "change"
          }
        ]
      },
      storageCode: "",
      curScode: "",
      locationList: [],
      curChooseDrug: {
        drugName: ""
      }
    };
  },
  created() {
    this.getUserStorage();
  },
  watch: {
    drugForm: {
      deep: true,
      handler(val) {
        if (val && val.drugId) {
          this.drugFormDeail = { ...val };
          val.storageCode && (this.storageCode = val.storageCode);
          val.storageCode && this.getLocation(val.storageCode);
          val.drugId && this.getList();
        }
      }
    }
  },
  methods: {
    getList() {
      let pharmacyPositionQueryVO = {
        drugId: this.drugFormDeail.drugId,
        storageCode: this.drugFormDeail.storageCode
      };
      stock.getPharmacyPositionDetail(pharmacyPositionQueryVO).then(res => {
        this.loading = false;
        if (res.length === 0) {
          this.tablelist = [
            {
              locationSort: "",
              locationSortNo: ""
            }
          ];
        } else {
          this.tablelist = res;
        }
      });
    },
    //修改某一条药品数据
    confirm() {
      if (!this.drugFormDeail.drugId) {
        this.$message.warning("请选择药品!");
        return;
      }
      const uniqList = this.tablelist.filter(
        item => item.locationSort && item.locationSortNo
      );
      if (uniqList.length === 0) {
        this.$message.warning("请选择药品的大类并填写位置");
        return;
      }
      // 过滤掉未填写完整的
      this.tablelist = this.tablelist.filter(
        item => item.locationSort && item.locationSortNo
      );
      // 药品大类跟位置去重
      const res = new Map();
      const validList = this.tablelist.filter(item => {
        const key = item.locationSort + item.locationSortNo;
        return !res.has(key) && res.set(key, 1);
      });
      if (validList.length !== this.tablelist.length) {
        this.$message.warning("药品位置重复!");
        return;
      }
      const list = this.tablelist.map(item => ({
        locationSort: item.locationSort,
        locationSortNo: item.locationSortNo
      }));

      const pharmacyPositionVO = {
        locationsList: list,
        id: this.drugFormDeail.id || "",
        storageCode: this.storageCode,
        drugId: this.drugFormDeail.drugId,
        drugName: this.drugFormDeail.drugName,
        price: this.drugFormDeail.price,
        purchasePrice: this.drugFormDeail.purchasePrice,
        originCode: this.drugFormDeail.originCode,
        spec: this.drugFormDeail.spec
      };
      this.$showLoading();
      stock
        .addPharmacyPosition(pharmacyPositionVO)
        .then(res => {
          if (res.code == 1) {
            this.$message.success("保存成功");
            this.$emit("getRefreshList", pharmacyPositionVO);
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

    //删除位置
    deleteAnoName(index) {
      if (this.tablelist.length <= 1) {
        this.$delete(this.tablelist, index);
        this.tablelist.push({
          locationSort: "",
          locationSortNo: ""
        });
      } else {
        this.$delete(this.tablelist, index);
      }
    },
    //新增位置
    addAnoName(item) {
      if (item.favoritesId == "" || item.huoweicon == "") {
        this.$message.error("不能为空");
      } else {
        this.tablelist.push({
          locationSort: "",
          locationSortNo: ""
        });
      }
    },
    //新增
    newadd() {
      this.$emit("newadd");
      this.tablelist = [
        {
          locationSort: "",
          locationSortNo: ""
        }
      ];
      this.drugFormDeail = {
        isnew: true,
        id: "",
        drugId: "",
        drugName: "",
        spec: "",
        originCode: "",
        purchasePrice: "",
        price: "",
        createdByName: "",
        createdAt: "",
        updatedByName: "",
        updatedAt: ""
      };
      this.storageCode = this.curScode;
      this.getLocation(this.curScode);
    },
    // 获取当前登录的药房
    getUserStorage() {
      hmmBaseApi
        .getCurDrugStorage()
        .then(res => {
          if (res.code === 1) {
            this.curScode = res.data.storageCode;
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
      const searchParams = {
        drugName: drugName,
        pageNo: 1,
        pageSize: 10000,
        storageCode: this.storageCode
      };
      this.selectOptions = [];
      this.getDrugList(searchParams);
    },
    //获取联想搜索结果
    getDrugList(params) {
      hmmBaseApi.getAssociation(params).then(res => {
        const list = res.data.map(drugWapper => {
          // 库存量转化
          const { out, bl } = blukToOutfit(
            drugWapper.drugStock,
            drugWapper.packQuantity
          );
          return {
            ...drugWapper,
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
      this.curChooseDrug = row;
      this.selectOptions = [];
      this.drugFormDeail = {
        ...this.drugFormDeail,
        ...row
      };
    },
    resetChooseDrug(val) {
      // 如果用户不选择药品，则自动默认到上一次选择的药品
      this.drugFormDeail.drugName = val;
      this.$nextTick(() => {
        if (val !== this.curChooseDrug.drugName) {
          this.$set(
            this.drugFormDeail,
            "drugName",
            this.curChooseDrug.drugName || ""
          );
        }
      });
    },
    getLocation(code) {
      hmmBaseApi
        .getSelectLocation(code)
        .then(res => {
          if (res.code === 1) {
            this.locationList = res.data;
          } else {
            this.$message.error("获取位置大类失败");
          }
        })
        .catch(err => {
          this.$message.error("获取位置大类失败");
        });
    }
  }
};
</script>


<style lang="scss" scoped>
.drugForm {
  .card-cont {
    padding: 0 20px 20px 20px;

    .cardTitleStyle {
      padding: 8px 0px;
    }

    .el-form-item {
      margin-bottom: 0;
    }

    .tabs {
      height: calc(100% - 150px);
      overflow-y: auto;
      /deep/ .el-row {
        // margin: 0,0 !important;
        margin-left: 0px !important;
        margin-right: 0px !important;
        margin-top: 4px;
      }
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
</style>
