<template>
  <div class="l-setting width100 inline-block">
    <el-select
      class="width100"
      ref="elem"
      remote
      filterable
      clearable
      reserve-keyword
      default-first-option
      v-model="currVal"
      v-bind="$attrs"
      :remote-method="request"
      :loading="loading"
      :placeholder="placeholder"
      :multiple="multiple"
      :disabled="disabled"
      @change="changeFunc"
      @clear="clearHandler"
      @focus="focusHandler"
      @blur="blurHandler"
      @visible-change="visibleChange"
    >
      <el-option
        v-for="(data, _index) in settingData"
        :key="`${_index}${data._id || data.id || data[remoteValueKey]}`"
        :label="data[remoteShowKey]"
        :value="data[remoteValueKey]"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { getSelectList } from "@/api/directive/directiveRequest.js";

export default {
  name: "",
  components: {},
  props: {
    // 单选|多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 值域Code
    code: {
      type: String,
      default: ""
    },
    // 双向数据绑定的值
    value: [String, Array, Number],
    // 自定义请求参数
    // 一定要注意如果使用这个参数，使用时不要在动态表达式中
    // 复制，这样两次值会默认是不一样的，会重复请求服务器去获取
    // 远程数据。
    remoteParams: {
      type: [String, Object, Array],
      default: ""
    },
    existKey: {
      type: [String, Array, Number],
      defalut: ""
    },
    // 显示哪个字段的值
    // 如果为自定义的远程请求，该字段必传
    remoteShowKey: {
      type: String,
      default: "name"
    },
    // 返回哪个字段的值
    // 如果为自定义的远程请求，该字段必传
    remoteValueKey: {
      type: String,
      default: "code"
    },
    placeholder: {
      type: String,
      default: "请搜索或选择"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      currVal: null,
      settingData: null
    };
  },
  watch: {
    value: {
      immediate: true,
      async handler(val) {
        if (this.currVal == val) {
          return;
        }
        this.currVal = val;
        console.log(999, "request");
        await this.request();
      }
    }
  },
  methods: {
    async request(query) {
      console.log(query, "query"); // 123
      try {
        this.loading = true;
        let params = { code: this.code, existKey: this.existKey };
        if (this.remoteParams && typeof this.remoteParams == "object") {
          params = Object.assign(params, this.remoteParams);
        }
        params["key"] = query;

        let { data } = await getSelectList(params);

        this.settingData = [...data];
      } catch (error) {
        // this.$message.error(error.errorMsg);
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    changeFunc(item) {
      this.$emit("update:value", item);
    },
    clearHandler() {},
    focusHandler() {},
    blurHandler() {},
    visibleChange() {}
  }
};
</script>

<style lang='scss' scoped>
</style>
