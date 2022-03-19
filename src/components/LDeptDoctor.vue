<template>
  <el-row :gutter="gutter">
    <el-col :span="span">
      <el-form-item :prop="first.prop" :rules="first.rules || []">
        <l-formt-title :label="first.label" :required="first.required">
          <l-value-domain
            remoteUrl="/wadmin/hos/dept"
            :value.sync="fVal"
            :remoteShowKey="first.name"
            :remoteValueKey="first.value"
            placeholder="请选择"
            @change="getDeptId"
          />
        </l-formt-title>
      </el-form-item>
    </el-col>
    <el-col :span="span">
      <el-form-item :prop="second.prop" :rules="second.rules || []">
        <l-formt-title :label="second.label" :required="second.required">
          <el-select v-model="sVal" placeholder="请选择" @change="getValue">
            <el-option
              v-for="item in list"
              :key="item[second.value]"
              :label="item[second.name]"
              :value="item[second.value]"
            ></el-option>
          </el-select>
        </l-formt-title>
      </el-form-item>
    </el-col>
    <slot></slot>
  </el-row>
</template>

<script>
import { get } from "@/utils/request";

export default {
  props: {
    // el-col间距
    gutter: {
      type: Number,
      default: 20
    },
    // el-col宽度
    span: {
      type: Number,
      default: 6
    },
    first: {
      type: Object
    },
    second: {
      type: Object
    },
    remoteUrl: {
      type: String,
      required: true
    },
    // 清空数据标示
    clearParams: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      fVal: "",
      sVal: "",
      list: {}
    };
  },
  watch: {
    clearParams: {
      immediate: true,
      handler() {
        this.fVal = "";
        this.sVal = "";
      }
    }
  },
  methods: {
    getDeptId(val, cur) {
      this.$emit("first-value", val, cur);
      this.getDoctor(val);
    },
    getDoctor(id) {
      this.list = [];
      this.sVal = "";
      this.$emit("second-value", "", {});
      get(this.remoteUrl + "/" + id)
        .then(res => {
          if (res.code === 1) {
            this.list = res.data;
          }
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    getValue(val) {
      const data = this.list.find(item => item[this.second.value] === val);
      this.$emit("second-value", val, data);
    }
  }
};
</script>

<style>
</style>