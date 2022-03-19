<template>
  <div class="l-setting inline-block">
    <el-radio-group
      v-if="type === 'radio'"
      v-model="currVal"
      :disabled="disabled"
      ref="elem"
      v-bind="$attrs"
    >
      <el-radio
        v-for="data in settingData"
        :key="data[remoteValueKey]"
        :label="data[remoteValueKey]"
        @change="changeFunc"
        >{{ data[remoteShowKey] }}</el-radio
      >
    </el-radio-group>
    <el-checkbox-group
      v-model="currVal"
      v-else-if="type === 'checkbox'"
      :disabled="disabled"
      ref="elem"
      v-bind="$attrs"
    >
      <el-checkbox
        v-for="data in settingData"
        :key="data[remoteValueKey]"
        :label="data[remoteValueKey]"
        @change="changeFunc"
        >{{ data[remoteShowKey] }}</el-checkbox
      >
    </el-checkbox-group>
    <el-cascader
      v-else-if="type === 'cascader'"
      class="width100"
      ref="elem"
      :options="settingData"
      :props="{
        value: remoteValueKey || 'code',
        label: remoteShowKey || 'name',
        multiple: multiple,
      }"
      v-model="currVal"
      :show-all-levels="showAllLevels"
      :disabled="disabled"
      @change="changeFunc"
      :filterable="isFilterable"
      clearable
      v-bind="$attrs"
      @clear="clearHandler"
      @focus="clearSearchParam"
    ></el-cascader>
    <el-select
      v-else-if="isRemoteSelect"
      class="width100"
      ref="elem"
      :placeholder="placeholder"
      :filterable="isFilterable"
      remote
      reserve-keyword
      default-first-option
      :remote-method="request"
      :loading="loading"
      v-model="currVal"
      :multiple="multiple"
      :disabled="disabled"
      @change="changeFunc"
      v-bind="$attrs"
      @clear="clearHandler"
      @focus="clearSearchParam"
      @visible-change="visibleChange"
    >
      <el-option
        v-for="data in settingData"
        :key="data[remoteValueKey]"
        :label="data[remoteShowKey]"
        :value="data[remoteValueKey]"
      ></el-option>
    </el-select>
    <el-select
      v-else
      class="width100"
      ref="elem"
      v-model="currVal"
      :filterable="isFilterable"
      default-first-option
      :filter-method="localFilterHandler"
      :placeholder="placeholder"
      :multiple="multiple"
      :disabled="disabled"
      @change="changeFunc"
      v-bind="$attrs"
      @clear="clearHandler"
      @focus="clearSearchParam"
      @visible-change="visibleChange"
    >
      <el-option
        v-for="data in settingData"
        :key="data[remoteValueKey]"
        :label="data[remoteShowKey]"
        :value="data[remoteValueKey]"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
import { get } from "@/utils/requestEmr";

let TMP_CACHE = {};

export default {
  data() {
    return {
      loading: false,
      url: this.remoteUrl || "",
      _orgSettingData: [],
      settingData: null,
      currVal: null
    };
  },
  props: {
    // 值域Code
    code: {
      type: String,
      default: ""
    },
    // 组件展示类型
    // radio || switch || cascader || select
    type: {
      type: String,
      default: "select"
    },
    // 双向数据绑定的值
    value: [String, Array, Number],
    // 多选情况下, 输入框中是否显示选中值的完整路径
    showAllLevels: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    // 自定义的远程请求
    // 可以自定义url，通常是不需要的，都是通过配置中心配置
    remoteUrl: {
      type: String,
      default: ""
    },
    // 自定义请求参数
    // 一定要注意如果使用这个参数，使用时不要在动态表达式中
    // 复制，这样两次值会默认是不一样的，会重复请求服务器去获取
    // 远程数据。
    remoteParams: {
      type: [String, Object, Array],
      default: ""
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
    // 单选|多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 多级值域情况下，是否返回关联的父子数据
    relation: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 默认选择第一个
    defaultFirst: {
      type: Boolean,
      default: false
    },
    // 本地支持模糊过滤
    localFilterKeys: {
      type: Array,
      default: () => ["name", "wubi", "pinyin"]
    },
    // 本地支持模糊过滤
    isFilterable: {
      type: Boolean,
      default: true
    },
    isFilterNull: {
      // 是否匹配不上删除当前选项
      type: Boolean,
      default: false
    }
  },
  computed: {
    iscascader() {
      return this.type === "cascader";
    },
    isRemoteSelect() {
      return this.type === "select" && this.remoteUrl;
    }
  },
  watch: {
    value: function(val) {
      if (this.currVal == val) {
        return;
      }
      console.log("isFilterNull-currVal");

      this.currVal = val;
      if (this.isFilterNull && this.settingData && this.settingData.length) {
        let idx = this.settingData.findIndex(
          item => item[this.remoteValueKey] == this.currVal
        );
        if (idx < 0) {
          this.currVal = "";
        }
      }
    },
    currVal: function() {
      if (!this.currVal) {
        this.localFilterHandler();
      }
    },
    remoteParams: {
      deep: true,
      async handler(newVal, oldVal) {
        if (newVal == oldVal) {
          return;
        }
        await this.request();
        this.updateCurrValue();
      }
    }
  },
  async created() {
    if (this.code && TMP_CACHE[this.code]) {
      this._orgSettingData = [...TMP_CACHE[this.code]];
      this.settingData = [...TMP_CACHE[this.code]];
    } else {
      this.url =
        this.remoteUrl ||
        (this.iscascader
          ? `/wdata/dic/multi/${this.code}`
          : `/wdata/dic/single/${this.code}`);
      if (this.remoteUrl || this.code) {
        await this.request();
        if (this.code) {
          TMP_CACHE[this.code] = [...this._orgSettingData];
        }
      }
    }
    this.updateCurrValue();
  },
  methods: {
    clearHandler() {
      this.clearSearchParam();
    },
    visibleChange(value) {
      if (!value && this.settingData.length == 0) {
        this.clearSearchParam();
      }
    },
    // 触发父组件的change事件
    changeFunc(item) {
      console.log("---changeFunc---", item);
      this.$emit("update:value", item);

      let curItem = this.getValueByKey(this.settingData, item);
      this.$emit("change", item, curItem);
    },
    getDataByKey(datas, key, value) {
      for (let i = 0; i < datas.length; i++) {
        const item = datas[i];
        if (item[key] == value) {
          return item;
        }
        if (item.children && item.children.length > 0) {
          let rsl = this.getDataByKey(item.children, key, value);
          if (rsl) {
            return rsl;
          }
        }
      }
      return null;
    },
    getValueByKey(datas, value) {
      if (this.type === "cascader") {
        if (this.multiple) {
          let ret = [];
          for (let i = 0; i < value.length; i++) {
            const items = value[i];
            if (this.relation) {
              let datas = [];
              for (let j = 0; j < items.length; j++) {
                const item = items[j];
                datas.push(
                  this.getDataByKey(this.settingData, this.remoteValueKey, item)
                );
              }
              ret.push(datas);
            } else {
              ret.push(
                this.getDataByKey(
                  this.settingData,
                  this.remoteValueKey,
                  items[items.length - 1]
                )
              );
            }
          }
          return ret;
        } else {
          if (this.relation) {
            let datas = [];
            for (let j = 0; j < value.length; j++) {
              const item = value[j];
              datas.push(
                this.getDataByKey(this.settingData, this.remoteValueKey, item)
              );
            }
            return datas;
          } else {
            return this.getDataByKey(
              this.settingData,
              this.remoteValueKey,
              value[value.length - 1]
            );
          }
        }
      } else {
        if (this.multiple) {
          let ret = [];
          for (let i = 0; i < value.length; i++) {
            const item = value[i];
            ret.push(
              this.getDataByKey(this.settingData, this.remoteValueKey, item)
            );
          }
          return ret;
        } else {
          return this.getDataByKey(
            this.settingData,
            this.remoteValueKey,
            value
          );
        }
      }
      // return null;
    },
    updateCurrValue() {
      let currVal;
      if (
        this.defaultFirst &&
        !this.value &&
        (this.type === "select" ||
          this.type === "cascader" ||
          this.type === "radio") &&
        this.settingData &&
        this.settingData.length > 0
      ) {
        currVal = this.settingData[0][this.remoteValueKey];
        // HACK: fix 默认下拉组件，兼容选中第一个选项，出发change事件
        if (this.currVal !== currVal) {
          this.currVal = currVal;
          this.changeFunc(currVal);
        }
      } else {
        currVal = this.value;
      }
      if (this.currVal || currVal) {
        this.currVal = currVal;
      }
    },
    async request(query) {
      try {
        if (!this.url) {
          return;
        }
        this.loading = true;
        let params = {};
        if (this.remoteParams) {
          params = { ...this.remoteParams };
        }
        if (this.isRemoteSelect && query) {
          params["keyword"] = query;
        }
        let { data } = await get(this.url, params);
        this._orgSettingData = [...data];
        this.settingData = this.filterHandler(query);

        if (this.isFilterNull) {
          let idx = this.settingData.findIndex(
            item => item[this.remoteValueKey] == this.currVal
          );
          if (idx < 0) {
            this.currVal = "";
          }
        }
      } catch (error) {
        console.log(error);
        this.$message.error(error.errorMsg);
      } finally {
        this.loading = false;
      }
    },
    localFilterHandler(query) {
      this.settingData = this.filterHandler(query);
    },
    filterHandler(keyword) {
      if (!this._orgSettingData) {
        return [];
      }
      let datas = [...this._orgSettingData];
      if (
        !this.localFilterKeys.length ||
        !datas.length ||
        !keyword ||
        !keyword.length
      ) {
        return datas;
      }
      return datas.filter(item => {
        // 如果压根数据对象中都没有filterKeys中的字段
        // 那就认为filterKeys无效
        // 这里加这个过滤，主要是因为默认值，
        // 默认以name为搜索条件，但是自定义接口中不是所有表都有name字段
        // 这个时候就需要自定义localFilterKeys字段
        let hasKey = false;
        for (const key in item) {
          if (this.localFilterKeys.indexOf(key) != -1) {
            hasKey = true;
          }
          let value = item[key];
          if (
            this.localFilterKeys.indexOf(key) != -1 &&
            value
              .toString()
              .toUpperCase()
              .indexOf(keyword.toUpperCase()) != -1
          ) {
            return true;
          }
        }
        return !hasKey;
      });
    },
    focus() {
      let elem = this.$refs["elem"];
      if (elem && elem.focus) {
        elem.focus();
      }
    },
    clearSearchParam() {
      this.settingData = [...this._orgSettingData];
    }
  }
};
</script>
<style lang="scss" scoped>
.l-setting {
  width: 100%;
}
</style>
