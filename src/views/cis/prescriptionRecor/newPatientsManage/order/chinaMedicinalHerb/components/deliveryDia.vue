<template>
  <div class="delivery-box">
    <el-radio-group
      v-model="deliveryForm.shipmentType"
      class="mgb8"
      @change="shipmentTypeChange"
    >
      <el-radio label="0">配送到家</el-radio>
      <el-radio label="1">配送到社康</el-radio>
    </el-radio-group>
    <el-form
      :model="deliveryForm"
      :rules="deliveryRules"
      ref="deliveryForm"
      class="demo-ruleForm"
    >
      <el-row :gutter="8" class="mgb8">
        <el-col :span="12">
          <el-form-item prop="recipients">
            <l-formt-title required label="收货人姓名">
              <el-input
                v-model="deliveryForm.recipients"
                placeholder="请输入"
              ></el-input>
            </l-formt-title>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="phoneNumber">
            <l-formt-title required label="联系电话">
              <el-input
                v-model="deliveryForm.phoneNumber"
                placeholder="请输入"
              ></el-input>
            </l-formt-title>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="mgb8">
          <!-- {{ deliveryForm.address }} -->
          <el-form-item prop="address" required>
            <LFormtTitle label="联系地址" required>
            <l-value-domain
              v-if="deliveryForm.address"
              type="cascader"
              code="AdministrativDivision"
              :value.sync="deliveryForm.address"
              remoteValueKey="id"
              remoteShowKey="label"
              :maxNum="3"
              :multiple="false"
              :relation="true"
              placeholder="联系地址"
            ></l-value-domain>
             </LFormtTitle>
          </el-form-item>
       
      </el-row>
      <el-row>
        <el-form-item prop="detail">
          <l-formt-title required label="具体联系地址">
            <el-input
              v-model="deliveryForm.detail"
              placeholder="请输入"
            ></el-input>
          </l-formt-title>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { deepClone } from "@/utils/index.js";
export default {
  name: "deliveryDia",
  props: {
    deliveryFormProp: {
      type: Object,
      default() {
        return {};
      }
    },
    receivePatientData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    const addressHandler = (rule, value, callback)=>{
      if(Array.isArray(value)&&value.length> 0){
        const flag = value.every(item=> !!item )
        if(flag){
          callback()
        }else{
          this.$message.warning('请选择地址')
          callback(new Error('请选择地址'))
        }
      }else{
        callback(new Error('地址数据格式不对或'))
      }
    }

    //手机号校验
        //联系方式（手机或者座机）
    // const concatPhone = (rule, value, callback) => {
    //   let str = /^1([38]\d|4[5-9]|5[0-35-9]|6[56]|7[0-8]|9[189])\d{8}$/;
    //   if (!value) {
    //     callback();
    //   } else if (String(value) !== String(parseInt(value))) {
    //     this.$message.error("联系方式应该数字");
    //     callback(new Error("联系方式应该数字"));
    //   } else {
    //     callback();
    //   }
    // };

    return {
      deliveryForm: {},
      deliveryRules: {
        recipients: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        phoneNumber: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
            pattern: /^1([38]\d|4[5-9]|5[0-35-9]|6[56]|7[0-8]|9[189])\d{8}$/
          }
        ],
        address: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
            validator: addressHandler
          }
        ],
        detail: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    deliveryFormProp: {
      handler(v) {
        this.deliveryForm = deepClone(v);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    //配送地址方式改变你
    shipmentTypeChange(val) {
      let datas = {};
      if (val == "0") {
        //如果之前配送到家已保存
        if (this.deliveryFormProp.shipmentType == "0") {
          datas = deepClone(this.deliveryFormProp);
        } else {
          //获取患者档案信息并填充
          datas = {
            ...this.deliveryForm,
            recipients: this.receivePatientData.patientName,
            phoneNumber:
              this.receivePatientData.phoneNum ||
              this.receivePatientData.mobileNum,
            address: this.receivePatientData.addrCode || [],
            detail: this.receivePatientData.address || ""
          };
        }
        this.deliveryForm = datas;
      } else if (val == "1") {
        if (this.deliveryFormProp.shipmentType == "1") {
          datas = deepClone(this.deliveryFormProp);
          this.deliveryForm = datas;
          return;
        }
        //清空配送地址信息
        this.resetAddress({});
      }
    },
    //清空配送地址信息
    resetAddress(data) {
      this.deliveryForm = {
        ...this.deliveryForm,
        recipients: "",
        phoneNumber: "",
        address: [],
        detail: "",
        ...data
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.delivery-box {
  padding: 20px;
}

.mgb8 {
  margin-bottom: 8px;
}

.demo-ruleForm {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
