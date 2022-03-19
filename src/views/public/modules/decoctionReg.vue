<template>
  <div v-if="currentDrug.orderType === '11'" class="dec-box" v-loading="loading">
    <l-card-title class="dec-title mb10">
      <span slot="left">煎药登记</span>
    </l-card-title>
    <div class="pre-no mb10">处方号：{{form.recipeCode}}</div>
    <el-row class="mb10">
      是否代煎：
      <el-radio-group v-model="form.isBoil">
        <el-radio label="0">是</el-radio>
        <el-radio label="1">否</el-radio>
      </el-radio-group>
    </el-row>
    <!-- <el-row class="mb10">
      煎药费：10.00元
      <span class="not-charged">未收费</span>
    </el-row>-->
    <l-formt-title class="mb10" label="联系电话">
      <el-input v-model="form.phoneNum" placeholder="请输入内容"></el-input>
    </l-formt-title>
    <l-formt-title class="mb10" label="联系地址">
      <el-input v-model="form.patientAddr" :autosize="{ minRows: 2}" type="textarea" placeholder="请输入内容"></el-input>
    </l-formt-title>
    <div class="mb10">预计取药时间：</div>
    <el-date-picker
      class="mb10"
      v-model="form.predictTakeMedicineTime"
      type="datetime"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择日期时间"
    ></el-date-picker>
    <el-row class="mb10">登记人员：{{form.regUserName}}</el-row>
    <el-row class="mb10">登记时间：{{form.regTime}}</el-row>
    <div class="align-right" v-if="form.save">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
  <div class="no-data" v-else>暂无煎药登记</div>
</template>

<script>
import { mapGetters } from "vuex";
import opha from "@/api/hmm/opha";

export default {
  name: "decoctionReg",
  data() {
    return {
      radio: 0,
      form: {
        phoneNum: "",
        predictTakeMedicineTime: "",
        isBoil: "0",
        patientAddr: ""
      },
      loading: false
    };
  },
  computed: {
    ...mapGetters("drugManagement", ["currentDrug"])
  },
  watch: {
    currentDrug: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.recipeCode) {
          this.loadData(val.recipeCode);
        }
      }
    }
  },
  methods: {
    loadData(code) {
      this.loading = true;
      opha
        .getByRecipeCode(code)
        .then(res => {
          if (res.code === 1) {
            if(!res.data.predictTakeMedicineTime) {
              this.form.predictTakeMedicineTime = "";
            }
            this.form = {
              ...this.form,
              ...res.data
            };
            this.loading = false;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    save() {
      let params = {
        ...this.form
      };
      delete params.id;
      opha
        .regSave(params)
        .then(res => {
          if (res.code === 1) {
            this.$message.success("保存成功");
          } else {
            this.$message.error(res.msg || "保存失败");
          }
        })
        .catch(err => {
          this.$message.error(err.msg || "保存失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.dec-box {
  overflow-y: auto;
  font-size: $l-font-size;
}
.dec-title {
  height: 35px;
  line-height: 35px;
  /deep/ .titleleft::before {
    margin-top: 8px;
  }
}
.pre-no {
  font-size: $l-font-size-max;
  font-weight: bold;
}
.align-right {
  text-align: right;
}
.mb10 {
  margin-bottom: 10px;
}
.not-charged {
  color: $l-color-bgcolor-15;
}
.no-data {
  text-align: center;
  line-height: 30px;
}
</style>