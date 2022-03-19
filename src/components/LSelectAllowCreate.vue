<template>
  <div class="LSelectAllowCreate">
    <el-select
      v-model="value"
      allow-create
      multiple
      filterable
      remote
      reserve-keyword
      v-bind="$attrs"
      :disabled="disabled"
      :placeholder="placeholder"
      :remote-method="remoteMethod"
      @remove-tag="removeTag"
      :loading="loading"
      @change="changeFunc"
    >
      <el-option
        v-for="(item, i) in options"
        :key="i + item.tcdCode"
        :label="item.tcdName"
        :value="item.tcdCode"
      >
        <span v-if="item.tcdName === item.tcdCode">
          {{ item.tcdName }}
        </span>
        <span v-else>{{ item.tcdName + " " + item.tcdCode }}</span>
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { get } from "@/utils/request";
import { Debounce, Throttle } from "@/utils/index.js";
export default {
  props: {
    accountRechargeForm: {
      type: [String, Object, Array],
      default: ""
    },
    remoteUrl: {
      // 有用 自定义远程请求url
      type: String,
      default: ""
    },
    placeholder: {
      // 有用
      type: String,
      default: "请搜索或选择"
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
    disabled: {
      // 有用 控件是否禁用
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tempOptions: [],
      tempMap: new Map(),
      value: [],
      options: [],
      settingData: null, // 遍历option
      loading: false
    };
  },
  watch: {
    "accountRechargeForm.tcmSyndrome3": {
      immediate: true,
      deep: true,
      handler(n, o) {
        console.log(`n`, n);
        if (!n) {
          return;
        }
        console.log(`this.accountRechargeForm`, this.accountRechargeForm)
        let tcmSyndrome = this.accountRechargeForm.tcmSyndrome
          .split(",")
          .filter(Boolean);
        let tcmSyndromeCode = this.accountRechargeForm.tcmSyndromeCode
          .split(",")
          .filter(Boolean);
        // console.log(`tcmSyndrome`, tcmSyndrome);
        // console.log(`tcmSyndromeCode`, tcmSyndromeCode);
        this.value = this.accountRechargeForm.tcmSyndrome2;
        this.options = [];
        tcmSyndrome.forEach((el, i) => {
          this.options.push({
            tcdName: el,
            tcdCode: tcmSyndromeCode[i]
          });
        });
        this.tempOptions = this.tempOptions.concat(this.options);
        console.log(`this.options`, this.options);
      }
    }
  },
  mounted() {},
  methods: {
    removeTag(tag) {
      console.group("removeTag");
      console.log(`tag`, tag);
      delete this.tempMap.delete(tag);
      console.log(`this.tempMap`, this.tempMap);
      let arr = [];
      this.tempMap.forEach(el => {
        arr.push(el);
      });
      this.$emit("change", arr);
      console.groupEnd();
    },
    // 触发父组件的change事件
    changeFunc(items) {
      console.log(`items`, items);
      console.log(`this.value`, this.value);
      console.log(`this.tempOptions`, this.tempOptions);
      this.tempMap = new Map();
      this.value.forEach(item => {
        let a = this.tempOptions.find(function(obj) {
          return obj.tcdCode == item;
        });
        if (a === undefined) {
          console.log(`11111`, 11111);
          this.tempMap.set(item, {
            tcdCode: item,
            tcdName: item
          });
        } else {
          this.tempOptions.forEach(el => {
            console.log(`22222`, 22222);
            if (el.tcdCode === item) {
              this.tempMap.set(el.tcdCode, {
                tcdCode: el.tcdCode,
                tcdName: el.tcdName
              });
            }
          });
        }
      });
      console.group("changeFunc");
      console.log(`this.tempMap----`, this.tempMap);
      let arr = [];
      this.tempMap.forEach(el => {
        arr.push(el);
      });
      this.$emit("change", arr);
      console.groupEnd();
    },
    remoteMethod: Debounce(function(query) {
      if (query !== "") {
        this.remoteParams.keyword = query;
        this.remoteParams.diagCodes = "";
        this.request(query);
      } else {
        this.remoteParams.keyword = "";
      }
    }, 1100),
    async request(query) {
      console.log("request-----");
      try {
        this.loading = true;
        let { data } = await get(this.remoteUrl, this.remoteParams);
        console.log(`data`, data);
        this.options = data;
        this.tempOptions = this.tempOptions.concat(this.options);
        console.group("options----");
        console.log(`this.options`, this.options);
        console.log(`this.tempOptions`, this.tempOptions);
        console.groupEnd();
      } catch (error) {
        this.$message.error(error.errorMsg);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.LSelectAllowCreate {
  .el-select {
    display: inline-block;
    position: relative;
    width: 100%;
  }
}
</style>
