<template>
  <div class="drugForm width100 height100" v-loading="mainLoading">
    <el-card class="card-cont width100 height100">
      <el-row style="border-bottom: 1px solid #e4e4e4">
        <el-col :span="24" class="cardTitleStyle">
          <l-card-title>
            <span slot="left">物资信息</span>
          </l-card-title>
        </el-col>
      </el-row>
      <div class="tabs">

        <el-form ref="drugFormDeail" :model="drugFormDeail" :rules="rules">
          <el-row style="margin-top: 10px" :gutter="10">
            <el-col :span="24">
              <el-form-item label label-width prop="goodsName">
                <l-formt-title
                  label="物资名称"
                  labelWidth="76"
                  required
                  :disabled="!drugFormDeail.update"
                >
                  <el-input
                    maxlength="200"
                    v-model="drugFormDeail.goodsName"
                    style="line-height: 34px"
                    :disabled="!drugFormDeail.update"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="24">
              <el-form-item label label-width prop="tradeName">
                <l-formt-title
                  label="商品名/别名"
                  labelWidth="76"
                  :disabled="!drugFormDeail.update"
                >
                  <el-input
                    :disabled="!drugFormDeail.update"
                    v-model="drugFormDeail.tradeName"
                    style="line-height: 34px"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="24">
              <el-form-item label label-width prop="spec">
                <l-formt-title
                  label="规格"
                  labelWidth="48"
                  required
                  :disabled="!drugFormDeail.update"
                >
                  <el-input
                    maxlength="100"
                    v-model="drugFormDeail.spec"
                    style="line-height: 34px"
                    :disabled="!drugFormDeail.update"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
<!--          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="24">
              <el-form-item label label-width prop="goodsCode">
                <l-formt-title
                  label="物资编码"
                  labelWidth="62"
                >
                  <el-input
                    v-model="drugFormDeail.goodsCode"
                    style="line-height: 34px"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>-->
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="12">
              <el-form-item label label-width prop="phoneticCode">
                <l-formt-title
                  label="搜索简码"
                  labelWidth="62"
                  :disabled="!drugFormDeail.update"
                >
                  <el-input
                    v-model="drugFormDeail.phoneticCode"
                    :disabled="!drugFormDeail.update"
                    style="line-height: 34px"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label label-width prop="goodsType">
                <LFormtTitle label="物资类型" labelWidth="62" :disabled="!drugFormDeail.update">
                  <l-value-domain
                    class="select-right"
                    clearable
                    code="goodsType"
                    type="s"
                    :value.sync="drugFormDeail.goodsType"
                    :disabled="!drugFormDeail.update"
                  />
                </LFormtTitle>
                <!-- <l-value-domain code="DrugManaType" :value.sync="drugFormDeail.cwType" /> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="12">
              <el-form-item label label-width prop="packQuantity">
                <l-formt-title
                  label="包装量"
                  labelWidth="62"
                  required
                  :disabled="!drugFormDeail.update"
                >
                  <el-input
                    oninput="value=value.replace(/[^\d]/g, '')"
                    v-model="drugFormDeail.packQuantity"
                    style="line-height: 34px; width: 100%"
                    :disabled="!drugFormDeail.update"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label label-width prop="minUnit">
                <l-formt-title
                  label="最小单位"
                  labelWidth="76"
                  required
                  :disabled="!drugFormDeail.update"
                >
                  <!-- <l-value-domain
                    code="DrugUnit"
                    :disabled="!drugFormDeail.update"
                    :value.sync="drugFormDeail.packUnit"
                  /> -->
                  <l-select-comp
                    code="DrugUnit"
                    :existKey="drugFormDeail.minUnit"
                    :disabled="!drugFormDeail.update"
                    :value.sync="drugFormDeail.minUnit"
                  />
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="12">
              <el-form-item label label-width prop="packUnit">
                <l-formt-title
                  label="大包装单位"
                  labelWidth="48"
                  required
                  :disabled="!drugFormDeail.update"
                >
                  <!-- <l-value-domain
                    code="DrugUnit"
                    :value.sync="drugFormDeail.drugUnit"
                    :disabled="!drugFormDeail.update"
                  /> -->

                  <l-select-comp
                    code="DrugUnit"
                    :existKey="drugFormDeail.packUnit"
                    :disabled="!drugFormDeail.update"
                    :value.sync="drugFormDeail.packUnit"
                  />
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label label-width prop="regNo">
                <l-formt-title label="注册证号" labelWidth="62">
                  <el-input
                    v-model="drugFormDeail.regNo"
                    maxlength="20"
                    style="line-height: 34px; width: 100%"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="24">
              <el-form-item label label-width prop="quality">
                <l-formt-title
                  label="材质"
                  labelWidth="76"
                >
                  <el-input
                    maxlength="100"
                    v-model="drugFormDeail.quality"
                    style="line-height: 34px"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="24">
              <el-form-item label label-width prop="characteristic">
                <l-formt-title
                  label="特征"
                  labelWidth="76"
                >
                  <el-input
                    maxlength="100"
                    v-model="drugFormDeail.characteristic"
                    style="line-height: 34px"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="24">
              <el-form-item label label-width prop="originCode">
                <l-formt-title
                  label="生产厂商"
                  labelWidth="76"
                  required
                  :disabled="!drugFormDeail.update"
                >
                  <!-- <l-value-domain
                    code="Manufacturer"
                    :disabled="!drugFormDeail.update"
                    :value.sync="drugFormDeail.originCode"
                  /> -->

                  <l-select-comp
                    code="Manufacturer"
                    :existKey="drugFormDeail.originCode"
                    :disabled="!drugFormDeail.update"
                    :value.sync="drugFormDeail.originCode"
                  />
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="12">
              <el-form-item label label-width prop="originIdentificationCode">
                <l-formt-title
                  label="厂商标识"
                  labelWidth="104"
                  required
                  :disabled="!drugFormDeail.update"
                >
                  <l-value-domain
                    code="DrugManufacturerFlag"
                    :value.sync="drugFormDeail.originIdentificationCode"
                    :disabled="!drugFormDeail.update"
                  />
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label label-width prop="price">
                <l-formt-title label="单价 （元）" labelWidth="62">
                  <el-input
                    oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                    v-model="drugFormDeail.price"
                    maxlength="8"
                    style="line-height: 34px"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="12">
              <el-form-item label label-width prop="majorOrders">
                <l-formt-title label="医嘱大类" labelWidth="76" required >
                  <el-select
                    v-model="drugFormDeail.majorOrders"
                    @change="doctorsAdviceChange"
                  >
                    <el-option label="材料" value="1"></el-option>
                  </el-select>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label label-width prop="subclassOrders">
                <l-formt-title
                  label="医嘱子类"
                  :disabled="!drugFormDeail.majorOrders"
                  v-if="remoteSonParamsStyle"
                  labelWidth="76"
                  required
                >
                  <l-value-domain
                    :disabled="!drugFormDeail.majorOrders"
                    clearable
                    :remoteUrl="
                        '/doctorsAdvice/list?pageSize=10&parentCode=' +
                          remoteSonParams.parentId
                      "
                    type="select"
                    :value.sync="drugFormDeail.subclassOrders"
                    remoteShowKey="doctorsAdviceName"
                    remoteValueKey="doctorsAdviceCode"
                  ></l-value-domain>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="12">
              <el-form-item label label-width prop="generateOrder">
                <el-checkbox v-model="drugFormDeail.generateOrder"
                >是否面向患者销售</el-checkbox
                >
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label label-width prop="status">
                <l-formt-title label="启用状态" labelWidth="76" required>
                  <el-select
                    v-model="drugFormDeail.status"
                    style="line-height: 34px"
                  >
                    <el-option
                      v-for="item in statuslist"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="12">
              <el-form-item label label-width prop="siItemCode">
                <l-formt-title
                  :disabled="true"
                  label="医保编码"
                  labelWidth="90"
                >
                  <el-input
                    v-model="drugFormDeail.siItemCode"
                    disabled
                    style="line-height: 34px"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label label-width prop="siRestricDsp">
                <l-formt-title
                  :disabled="true"
                  label="限制性说明"
                  labelWidth="90"
                >
                  <el-input
                    v-model="drugFormDeail.siRestricDsp"
                    disabled
                    style="line-height: 34px"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-top: 4px" :gutter="10">
            <el-col :span="12">
              <el-form-item label label-width prop="siPayUpLimit">
                <l-formt-title
                  :disabled="true"
                  label="医保支付上限"
                  labelWidth="90"
                >
                  <el-input
                    v-model="drugFormDeail.siPayUpLimit"
                    disabled
                    style="line-height: 34px"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label label-width prop="siPayFlagName">
                <l-formt-title
                  :disabled="true"
                  label="记账标志"
                  labelWidth="90"
                >
                  <el-input
                    v-model="drugFormDeail.siPayFlagName"
                    disabled
                    style="line-height: 34px"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            style="margin-top: 4px"
            :gutter="10"
            v-if="!drugFormDeail.isnew"
          >
            <el-col :span="24">
              <el-form-item label label-width prop="createdByName">
                <l-formt-title
                  label="创建人"
                  labelWidth="62"
                  :disabled="true"
                >
                  <el-input
                    v-model="drugFormDeail.createdByName"
                    style="line-height: 34px"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            style="margin-top: 4px"
            :gutter="10"
            v-if="!drugFormDeail.isnew"
          >
            <el-col :span="24">
              <el-form-item label label-width prop="createdAt">
                <l-formt-title
                  label="创建时间"
                  labelWidth="76"
                  :disabled="true"
                >
                  <el-input
                    v-model="drugFormDeail.createdAt"
                    style="line-height: 34px"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            style="margin-top: 4px"
            :gutter="10"
            v-if="!drugFormDeail.isnew"
          >
            <el-col :span="24">
              <el-form-item label label-width prop="updatedByName">
                <l-formt-title
                  label="修改人"
                  labelWidth="62"
                  :disabled="true"
                >
                  <el-input
                    v-model="drugFormDeail.updatedByName"
                    style="line-height: 34px"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            style="margin-top: 4px"
            :gutter="10"
            v-if="!drugFormDeail.isnew"
          >
            <el-col :span="24">
              <el-form-item label label-width prop="updatedAt">
                <l-formt-title
                  label="修改时间"
                  labelWidth="76"
                  :disabled="true"
                >
                  <el-input
                    v-model="drugFormDeail.updatedAt"
                    style="line-height: 34px"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>



      </div>
      <div class="button-cont">
        <!-- :disabled="drugFormDeail.update == false"-->
        <el-button
          type="primary"
          @click="confirm"
          v-hotKey="{ func: 'func_save' }"
        >保存</el-button
        >
      </div>

    </el-card>
  </div>
</template>

<script>
import { get } from "@/utils/request";
import warehousingAPI from "@/api/materielStorage/warehousing.js";
//import CisValueDomain from "@/views/cis/components/CisValueDomain.vue";
import localForage from "localforage";
import { getPamars, setPamars } from "@/utils/auth";
import cloneDeep from "lodash/cloneDeep";
import { deltaImportQuery } from "@/api/admin/role.js";
import {deltaImportGoodsQuery} from "../../../../../api/admin/storageRoles";

export default {
  props: ["drugForm"],
  components: {

  },
  data() {
    return {
      remoteSonParamsStyle: true,
      //药品类型
      statuslist: [
        {
          code: "0",
          name: "暂停"
        },
        {
          code: "1",
          name: "正常"
        }
      ], //状态标识数据源
      drugFormright: {},
      drugFormDeail: {
        goodsName:'',
        isnew: true,
        tradeName:'',
        spec:'',
        phoneticCode:'',
        goodsType:'',
        minUnit:'',
        packUnit:'',
        regNo:'',
        quality:'',
       /* goodsCode:'',*/
        generateOrder:'',
        characteristic:'',
        originCode:'',
        originIdentificationCode:'',
        price:'',
        subclassOrders:'',
        majorOrders:'',
        status:'1',
        packQuantity:'',
        siItemCode:'',
        siRestricDsp:'',
        siPayUpLimit:'',
        siPayFlagName:'',
        createdByName:'',
        createdAt:'',
        updatedByName:'',
        updatedAt:'',
        update: true
      },
      favorites: [], //左侧下拉框数据
      rules: {
        goodsName: [
          {
            required: true,
            message: "请输入物资名称",
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
        packQuantity: [
          {
            required: true,
            message: "请输入包装量",
            trigger: "blur"
          }
        ],
        minUnit: [
          {
            required: true,
            message: "请选择最小单位",
            trigger: "blur"
          }
        ],
        packUnit: [
          {
            required: true,
            message: "请选择大包装单位",
            trigger: "change"
          }
        ],
        originCode: [
          {
            required: true,
            message: "请选择生产厂商",
            trigger: "change"
          }
        ],
        originIdentificationCode: [
          {
            required: true,
            message: "请选择厂商标识",
            trigger: "change"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择启用状态",
            trigger: "change"
          }
        ],
        majorOrders: [
          {
            required: true,
            message: "请选择医嘱大类",
            trigger: "change"
          }
        ],
        subclassOrders: [
          {
            required: true,
            message: "请选择医嘱子类",
            trigger: "change"
          }
        ]
      },
      mainLoading: false,
      remoteSonParams: {
        pageSize: 10,
        parentId: "-1"
      }, // 分页参数
      formCodeKey: new Date().getTime(),
      formCodeParams: "",
      // 2021 05 08 剂型bug
      DosageFormOptions: [],
      DosageFormLoading: false,
      DosageFormCode: 1
    };
  },
  watch: {
    drugFormDeail: {
      handler (val, oldVal) {
        console.log(val)
        if(!val.id){
          for (let i in this.drugFormDeail) {
            if (val[i] != '' && val[i] != true && val[i] != undefined) {
              window.sessionStorage.setItem("goodsFormDeailStyle",'true');
              break;
            } else {
              window.sessionStorage.setItem("goodsFormDeailStyle",'false');
            }
          }
        }

      },
      deep: true
    },
    drugForm(val) {
      if (val && val.id) {
        this.remoteSonParamsStyle = false;
        this.$refs.drugFormDeail.resetFields();
        this.drugFormright = { ...val };
        this.drugDeail(this.drugFormright.id);
        this.remoteSonParams.parentId = val.majorOrders;
        this.$nextTick(function() {
          this.remoteSonParamsStyle = true;
        });
      }
    },

  },
  created() {

    window.sessionStorage.setItem("goodsFormDeailStyle",'false');

    /* window.addEventListener('keydown',function(e){
        console.log(e);
      },false) */
  },
  methods: {

    theQueryFun(a) {
      let num = a.indexOf("(");
      let objList = "";
      if (num !== -1) {
        objList = a.split("(")[0];
      } else {
        objList = a;
      }
      return objList;
    },



    //获取右侧数据
    drugDeail(id) {
      this.mainLoading = true;
      warehousingAPI
        .getGoodsId(id)
        .then(res => {
          this.drugFormDeail = res.data;
          this.mainLoading = false;
        })
        .catch(err => {
          this.mainLoading = false;
        });
    },

    //新增
    newadd() {
      window.sessionStorage.setItem("goodsFormDeailStyle", 'false');
      this.drugFormDeail={
        goodsName:'',
        isnew: true,
        tradeName:'',
        spec:'',
        phoneticCode:'',
        goodsType:'',
        minUnit:'',
        packUnit:'',
        regNo:'',
        quality:'',
       /* goodsCode:'',*/
        generateOrder:'',
        characteristic:'',
        originCode:'',
        originIdentificationCode:'',
        price:'',
        subclassOrders:'',
        majorOrders:'',
        status:'1',
        packQuantity:'',
        siItemCode:'',
        siRestricDsp:'',
        siPayUpLimit:'',
        siPayFlagName:'',
        createdByName:'',
        createdAt:'',
        updatedByName:'',
        updatedAt:'',
        update: true
      }
      //this.drugFormDeail.id = '';

      this.$emit("newadd");
      this.$refs.drugFormDeail.resetFields();
    },

    //
    // 更新药品缓存
    async UpdateGoodsCache() {
      // 获取药品数据
      try {
        let tempUpdateTime = "";
        console.log(`tempUpdateTime`, tempUpdateTime);
        const res = await deltaImportGoodsQuery({ updateTime: "" });

        if (tempUpdateTime === "") {
          console.log(`GetGoodsData 新增--------`, res.data);
          this.setLocalForage("AllGoodsData", res.data);
        }
        this.setLocalForage(
          "goodsUpdateTime",
          this.dayjs(new Date()).format("YYYY-MM-DD")
        );
      } catch (err) {
        console.log("GetGoodsData失败", err);
        console.log(err);
      }
    },
    setLocalForage(name, data) {
      localForage
        .setItem(name, data)
        .then(function(value) {
          console.log("setLocalForage成功", value);
        })
        .catch(function(err) {
          onsole.log("setLocalForage失败", err);
        });
    },
    //修改某一条药品数据
    confirm() {
      this.$refs.drugFormDeail.validate(valid => {
        if (valid) {
          this.drugFormDeail.generateOrder = this.drugFormDeail.generateOrder == true ? '1' : '0'
          let params = {
            ...this.drugFormDeail
          };
          warehousingAPI
            .addGoods(params)
            .then(res => {
              if (res.code === 1) {
                window.sessionStorage.setItem("goodsFormDeailStyle", 'false');
                this.$message.success("保存成功");
                this.loading = false;
                this.$emit("getRefreshList", this.drugFormDeail);
                this.$hideLoading();
                this.UpdateGoodsCache();
              } else {
                this.$message.error(res.msg || "保存失败");
              }
            })
            .catch(err => {
              this.$hideLoading();
              this.$message.error(err.msg || "保存失败");
            });
        }
      });
    },

    doctorsAdviceChange(value) {
      this.remoteSonParamsStyle = false;
      this.$set(this.drugFormDeail, "subclassOrders", "");
      this.remoteSonParams = {
        pageSize: 10,
        parentId: value
      };
      this.remoteSonParams.parentId = value;
      this.$set(this.remoteSonParams, "parentId", value);

      this.$nextTick(function() {
        this.remoteSonParamsStyle = true;
      });
    },

  }
};
</script>

<style lang="scss" scoped>
.drugForm {
  .card-cont {
    padding: 0 20px 20px 20px;

    .el-form-item {
      margin-bottom: 0;

      /deep/ .el-form-item__content {
        height: 36px;
      }
    }

    .cardTitleStyle {
      padding: 8px 0px;
    }

    .tabs {
      max-height: calc(100% - 130px);
      overflow: hidden;
      overflow-y: auto;

    }

    .button-cont {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid $l-color-bgcolor-11;
      text-align: right;

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
