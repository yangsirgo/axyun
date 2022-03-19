<template>
  <div class="drugForm width100 height100">
    <el-card class="card-cont width100 height100">
      <el-row style="border-bottom:1px solid #E4E4E4">
        <el-col :span="24" class="cardTitleStyle">
          <l-card-title>
            <span slot="left">药房信息</span>
          </l-card-title>
        </el-col>
      </el-row>

      <div class="tabs">
        <el-form ref="drugForm" :model="drugFormDeail" :rules="rules">
          <el-row style="margin-top:4px" :gutter="10">
            <el-col :span="24">
              <l-formt-title label="药房名称" labelWidth="48" :required="true">
                <el-form-item label label-width prop="pharName">
                  <el-input v-model="drugFormDeail.pharName" style="line-height: 34px;"></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row style="margin-top:4px;" :gutter="10">
            <el-col :span="24">
              <l-formt-title label="所属科室" labelWidth="76" :required="true">
                <el-form-item label label-width prop="deptId">
                  <l-value-domain
                    :value.sync="drugFormDeail.deptId"
                    remoteUrl="/wadmin/hos/dept"
                    remoteValueKey="id" 
                    remoteShowKey="orgNm"
                    placeholder="请选择"
                  ></l-value-domain>
                </el-form-item>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row style="margin-top:4px" :gutter="10" v-if="!drugFormDeail.isnew">
            <el-col :span="24">
              <l-formt-title label="药房编码" labelWidth="76" :disabled="true">
                <el-input
                  v-model="drugFormDeail.pharCode"
                  style="line-height: 34px;"
                  :disabled="true"
                ></el-input>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row style="margin-top:4px" :gutter="10" v-if="!drugFormDeail.isnew">
            <el-col :span="12">
              <l-formt-title label="拼音码" labelWidth="62" :disabled="true">
                <el-form-item label label-width prop="phoneticCode">
                  <el-input
                    v-model="drugFormDeail.phoneticCode"
                    style="line-height: 34px;"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
            <el-col :span="12">
              <l-formt-title label="五笔码" labelWidth="62" :disabled="true">
                <el-input
                  v-model="drugFormDeail.fiveStrokeCode"
                  style="line-height: 34px;"
                  :disabled="true"
                ></el-input>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row style="margin-top:4px" :gutter="10">
            <el-col :span="12">
              <l-formt-title label="自定义码" labelWidth="76">
                <el-input v-model="drugFormDeail.customizeCode" style="line-height: 34px;"></el-input>
              </l-formt-title>
            </el-col>
            <el-col class="padding-bottom10" :span="12">
              <l-formt-title :required="true" label="药房类型" labelWidth="76" style="width:100%">
                <el-form-item prop="pharType">
                  <el-select v-model="drugFormDeail.pharType" placeholder="请选择">
                    <el-option
                      v-for="item in pharmacyTypelist"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row style="margin-top:4px" :gutter="10">
            <el-col :span="8">
              <el-form-item label label-width prop="wmedicinePermit">
                <el-checkbox v-model="drugFormDeail.wmedicinePermit">西药发药权</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label label-width prop="cmedicinePermit">
                <el-checkbox v-model="drugFormDeail.cmedicinePermit">草药发药权</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label label-width prop="subdispensePermit">
                <el-checkbox v-model="drugFormDeail.subdispensePermit">是否允许代配</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label label-width prop="scrapPermit">
                <el-checkbox v-model="drugFormDeail.scrapPermit">是否允许报废</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label label-width prop="applyPermit">
                <el-checkbox v-model="drugFormDeail.applyPermit">是否允许申请</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="margin-top:4px"  :gutter="10">
            <el-col :span="12">
              <l-formt-title :required="true" label="状态标识" labelWidth="76" style="width:100%">
                <el-form-item label label-width prop="status">
                  <el-select v-model="drugFormDeail.status" style="line-height: 34px;width:100%">
                    <el-option label="暂停" value="0"></el-option>
                    <el-option label="正常" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row style="margin-top:4px" :gutter="10" v-if="!drugFormDeail.isnew">
            <el-col :span="12">
              <l-formt-title label="创建人" labelWidth="62" style="width:100%" :disabled="true">
                <el-form-item label label-width prop="createdByName">
                  <el-input
                    v-model="drugFormDeail.createdByName"
                    style="line-height: 34px;width:100%"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
            <el-col :span="12">
              <l-formt-title label="创建时间" labelWidth="76" style="width:100%" :disabled="true">
                <el-form-item label label-width prop="createdAt">
                  <el-input
                    v-model="drugFormDeail.createdAt"
                    style="line-height: 34px;"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row style="margin-top:4px" :gutter="10" v-if="!drugFormDeail.isnew">
            <el-col :span="12">
              <l-formt-title label="修改人" labelWidth="62" style="width:100%" :disabled="true">
                <el-form-item label label-width prop="updatedByName">
                  <el-input
                    v-model="drugFormDeail.updatedByName"
                    style="line-height: 34px;width:100%"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>

            <el-col :span="12">
              <l-formt-title label="修改时间" labelWidth="76" style="width:100%" :disabled="true">
                <el-form-item label label-width prop="updatedAt">
                  <el-input
                    v-model="drugFormDeail.updatedAt"
                    style="line-height: 34px;"
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
import base from "@/api/hmm/base";
export default {
  props: ["drugForm"],
  data() {
    return {
      pharmacyTypelist: [
        { id: "00", name: "门诊药房" },
        { id: "01", name: "住院药房" },
        { id: "02", name: "草药房" },
        { id: "03", name: "静配中心" },
        { id: "04", name: "病区科室药房" },
        { id: "05", name: "输液室药房" },
        { id: "06", name: "综合药房 " }
      ], //所属科室数据源
      drugFormDeail: {
        isnew: false
      },
      rules: {
        pharName: [{ required: true, message: "请输入", trigger: "blur" }],
        deptId: [{ required: true, message: "请选择", trigger: "change" }],
        pharType: [{ required: true, message: "请选择", trigger: "change" }],
        status: [{ required: true, message: "请选择", trigger: "change" }]
      }
    };
  },
  created() {},
  watch: {
    drugForm() {
      this.$refs.drugForm.resetFields();
      this.drugFormDeail = { ...this.drugForm };
      this.drugFormDeail.deptId =
        typeof this.drugFormDeail.deptId === "undefined"
          ? ""
          : this.drugFormDeail.deptId;
    }
  },
  mounted() {},
  methods: {
    //修改某一条药品数据
    confirm() {
      this.$refs.drugForm.validate(valid => {
        if (valid) {
          let data = {};
          if (!this.drugFormDeail.id) {
            data = {
              dataVersion: 0,
              id: ""
            };
          }
          let params = {
            ...this.drugFormDeail,
            ...data
          };
          this.$showLoading();
          base
            .addpharmacy(params)
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
      /* let params = {};
      if (this.drugFormDeail.id.length == 0) {
        params.dataVersion = 0;
        params.applyPermit = this.drugFormDeail.applyPermit;
        params.applyPermit = this.drugFormDeail.applyPermit;
        params.customizeCode = this.drugFormDeail.customizeCode;
        params.cpatentdrugPermit = this.drugFormDeail.cpatentdrugPermit;
        params.createdBy = this.drugFormDeail.createdBy;
        params.deletedStatus = this.drugFormDeail.deletedStatus;
        params.deptId = this.drugFormDeail.deptId;
        params.machineType = this.drugFormDeail.machineType;
        params.pharCode = this.drugFormDeail.pharCode;
        params.pharName = this.drugFormDeail.pharName;
        params.pharType = this.drugFormDeail.pharType;
        params.scrapPermit = this.drugFormDeail.scrapPermit;
        params.status = this.drugFormDeail.status;
        params.storageId = this.drugFormDeail.storageId;
        params.subdispensePermit = this.drugFormDeail.subdispensePermit;
        params.wmedicinePermit = this.drugFormDeail.wmedicinePermit;
      } else {
        params.dataVersion = this.drugFormDeail.dataVersion;
        params.id = this.drugFormDeail.id;
        params.customizeCode = this.drugFormDeail.customizeCode;
        params.applyPermit = this.drugFormDeail.applyPermit;
        params.cmedicinePermit = this.drugFormDeail.cmedicinePermit;
        params.cpatentdrugPermit = this.drugFormDeail.cpatentdrugPermit;
        params.createdBy = this.drugFormDeail.createdBy;
        params.deletedStatus = this.drugFormDeail.deletedStatus;
        params.deptId = this.drugFormDeail.deptId;
        params.machineType = this.drugFormDeail.machineType;
        params.pharCode = this.drugFormDeail.pharCode;
        params.pharName = this.drugFormDeail.pharName;
        params.pharType = this.drugFormDeail.pharType;
        params.scrapPermit = this.drugFormDeail.scrapPermit;
        params.status = this.drugFormDeail.status;
        params.storageId = this.drugFormDeail.storageId;
        params.subdispensePermit = this.drugFormDeail.subdispensePermit;
        params.wmedicinePermit = this.drugFormDeail.wmedicinePermit;
      } */
    },

    //新增
    newadd() {
      this.$emit("clear-high");
      this.$refs.drugForm.resetFields();
      this.$nextTick(() => {
        this.drugFormDeail = {
          isnew: true,
          applyPermit: false,
          dataVersion: 0,
          cmedicinePermit: false,
          cpatentdrugPermit: false,
          customizeCode: "",
          createdBy: "",
          deletedStatus: "",
          deptId: "",
          id: "",
          machineType: "",
          pharCode: "",
          pharName: "",
          pharType: "",
          scrapPermit: false,
          status: "",
          storageId: "",
          subdispensePermit: false,
          wmedicinePermit: false
        };
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
.padding-bottom10 {
  padding-bottom: 10px;
}
</style>
