<template>
  <div class="l-setting inline-block">
    <el-select
      class="width100"
      ref="elem"
      filterable
      remote
      reserve-keyword
      default-first-option
      v-bind="$attrs"
      v-model="currVal"
      v-if="isRemoteSelect"
      :remote-method="debounceRequest"
      :placeholder="placeholder"
      :loading="loading"
      :multiple="multiple"
      :disabled="disabled"
      @change="changeFunc"
      @clear="clearHandler"
      @focus="clearSearchParam"
      @visible-change="visibleChange"
    >
      <el-option
        v-for="(data, _index) in settingData"
        :key="`${_index}${data[remoteValueKey]}`"
        :label="data[remoteShowKey]"
        :value="data[remoteValueKey]"
      ></el-option>
    </el-select>
    <el-select v-else class="width100"></el-select>
  </div>
</template>
<script>
import { get } from "@/utils/request";
import { Debounce, Throttle } from "@/utils/index.js";
let TMP_CACHE = {};

// 关闭allow-create，输入值也可用，为"诊断名称"专用
export default {
  data() {
    return {
      loading: false,
      url: this.remoteUrl || "",
      currVal: null, // 选择器绑定的值

      _orgSettingData: [], // 用来存放请求的数据
      settingData: null, // 遍历option
      diagId: "" // 诊断名称id
    };
  },
  props: {
    type: {
      // 有用 默认控件类型
      type: String,
      default: "select"
    },
    // 值域Code
    code: {
      // 有用 反显code
      type: String,
      default: ""
    },
    // 双向数据绑定的值
    value: [String, Array, Number], // 有用 下拉列表的key
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
      // 有用 自定义远程请求url
      type: String,
      default: ""
    },
    // 自定义请求参数
    // 一定要注意如果使用这个参数，使用时不要在动态表达式中
    // 复制，这样两次值会默认是不一样的，会重复请求服务器去获取
    // 远程数据。
    remoteParams: {
      // 有用 请求参数列表
      type: [String, Object, Array],
      default: ""
    },
    // 显示哪个字段的值
    // 如果为自定义的远程请求，该字段必传
    remoteShowKey: {
      // 有用 远程请求必填字段
      type: String,
      default: "name"
    },
    // 返回哪个字段的值
    // 如果为自定义的远程请求，该字段必传
    remoteValueKey: {
      // 有用 远程请求必填字段
      type: String,
      default: "code"
    },
    placeholder: {
      // 有用
      type: String,
      default: "请搜索或选择"
    },
    // 单选|多选
    multiple: {
      // 有用 控制单选|多选
      type: Boolean,
      default: false
    },
    // 多级值域情况下，是否返回关联的父子数据
    relation: {
      type: Boolean,
      default: false
    },
    disabled: {
      // 有用 控件是否禁用
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
    isUseInputValue: {
      type: Boolean,
      default: false
    },
    showNameSpecialCode: {
      type: String,
      default: ""
    }
  },
  computed: {
    isRemoteSelect() {
      return this.type === "select" && this.remoteUrl;
      /* 即：我目前应用到的诊断名称和中医证型 默认不传type，
      所以type就是select，判断的第一个参数有值，
      然后，这两个控件都会有url，所以返回true，
      结论：用第一个组件，不会用到第二个 */
    }
  },
  watch: {
    value: function(val) {
      if (this.currVal == val) {
        return;
      }
      this.currVal = val;
    },
    currVal: function(val) {
      if (!val) {
        this.localFilterHandler();
      }
    },
    remoteParams: {
      deep: true,
      immediate: true,
      async handler(newVal, oldVal) {
        if (newVal == oldVal) {
          return;
        }
        await this.request();
        this.updateCurrValue();
      }
    }
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
      let curItem = this.getValueByKey(this.settingData, item);
      // 清空操作的时候 需要删除
      if (item === "remoteValueKey") {
        // 自定义输入的 没有对应的code值 需要清空 引用类型会导致select出现问题  需要浅拷贝下
        curItem = {
          ...curItem
        };
        curItem[this.remoteValueKey] = "";
      } else if (!item) {
        curItem = null;
      } else {
        // 处理下返回的疾病名称
        curItem = {
          ...curItem
        };
        if (!this.multiple) {
          curItem[this.remoteShowKey] = curItem[this.remoteShowKey].split(
            " "
          )[0];
        }
      }

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
        return this.getDataByKey(this.settingData, this.remoteValueKey, value);
      }
      // return null;
    },
    updateCurrValue() {
      let currVal;
      if (
        this.defaultFirst &&
        !this.value &&
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
    debounceRequest: Debounce(function(query) {
      // console.log("query变化了",query);
      this.request(query);
    }, 1100),
    async request(query) {
      // console.log("query", query);
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

        let indexSetData = this._orgSettingData; // 用来存储上次查询的证型数据

        let { data } = await get(this.url, params);

        this._orgSettingData = data.map(option => {
          let returnObj = {
            ...option
          };
          if (!this.multiple) {
            // 兼容 医生站 诊断
            if (this.showNameSpecialCode) {
              returnObj[this.remoteShowKey] = `${
                option[this.remoteShowKey].split(" ")[0]
              } ${option[this.showNameSpecialCode]}`;
            } else {
              returnObj[this.remoteShowKey] = `${
                option[this.remoteShowKey].split(" ")[0]
              } ${option[this.remoteValueKey]}`;
            }
          }

          return returnObj;
        });

        if (this.diagId) {
          if (this.diagId === params.diagId) {
            if (data.length == 0) {
              this._orgSettingData = indexSetData;
            }
          } else {
            this.diagId = params.diagId;
          }
        }
        let options = this.filterHandler(query);

        options = options.map(option => {
          let returnObj = {
            ...option
          };
          if (!this.multiple) {
            // 兼容 医生站 诊断
            if (this.showNameSpecialCode) {
              returnObj[this.remoteShowKey] = `${
                option[this.remoteShowKey].split(" ")[0]
              } ${option[this.showNameSpecialCode]}`;
            } else {
              returnObj[this.remoteShowKey] = `${
                option[this.remoteShowKey].split(" ")[0]
              } ${option[this.remoteValueKey]}`;
            }
          }
          return returnObj;
        });

        if (this.isUseInputValue) {
          if (options.length) {
            let hasSameName = options.every(option => {
              return option[this.remoteShowKey] === query;
            });

            if (hasSameName || !query) {
              this.settingData = options;
            } else {
              let obj = {};

              obj[this.remoteShowKey] = query;
              obj[this.remoteValueKey] = "remoteValueKey";
              this.settingData = [obj, ...options];
            }
          } else {
            let obj = {};
            if (query === undefined) {
              this.settingData = [obj];
              return
            }
            obj[this.remoteShowKey] = query;
            obj[this.remoteValueKey] = "remoteValueKey";
            this.settingData = [obj];
            // 让组件通过key来查找 所以自定义输入的时候 需要传 空字符
            // this.changeFunc("remoteValueKey", 'diy');
            // 手动关闭
            // this.$refs.elem.blur();
          }
        } else {
          this.settingData = options;
        }
      } catch (error) {
        console.log(error);
        this.$message.error(error.errorMsg);
      } finally {
        this.loading = false;
      }
    },
    // 选择器绑定的值为null后触发
    localFilterHandler(query) {
      // this.settingData是option循环的对象
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
              .toLowerCase()
              .indexOf(keyword.toLowerCase()) != -1
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
