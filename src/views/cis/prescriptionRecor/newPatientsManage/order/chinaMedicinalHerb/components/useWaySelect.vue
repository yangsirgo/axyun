<template>
  <el-dropdown
    @command="handleCommand"
    trigger="click"
    style="height: 32px;line-height: 32px;"
  >
    <span class="el-dropdown-link">
      <i
        class="el-icon-edit"
        v-if="fryingRemarkObj.code == '' "
      ></i>
      <span
        :title="fryingRemarkObj.name"
        class="ellipsis"
        v-else
      >{{fryingRemarkObj.name}}</span>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :command="item.code"
        v-for="(item,index) in fryingRemarkList"
        :key="index"
      >{{item.name}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script type="text/ecmascript-6">
import {
  deleteByIdWithVersion,
  single,
  validHerbalAdviceItem
} from "@/api/cis/order/order";

export default {
  props: {
    value: {
      type: [String, Number],
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      fryingRemarkList: [],
      fryingRemarkObj: {}
    };
  },
  created() {},
  mounted() {
    this.fryingRemark();
  },
  watch: {
    value(code) {
      this.fryingRemarkObj = this.getFryingRemarkObj(
        code,
        this.fryingRemarkList
      );
    }
  },
  methods: {
    getFryingRemarkObj(code = "", data = []) {
      if (code == "") {
        return {
          code: "",
          name: ""
        };
      }
      return data.find(item => {
        return code == item.code;
      });
    },
    handleCommand(code) {
      // console.log("val", val);
      let fryingRemarkList = this.fryingRemarkList;
      this.fryingRemarkObj = this.getFryingRemarkObj(
        code,
        this.fryingRemarkList
      );
      this.$emit("input", code);
    },
    async fryingRemark() {
      try {
        let res = await single("fryingRemark");
        if (res.code == "1") {
          this.fryingRemarkList = res.data;
          console.log(
            "value",
            this.value,
            "fryingRemarkList",
            this.fryingRemarkList
          );
          this.fryingRemarkObj = this.getFryingRemarkObj(
            this.value,
            this.fryingRemarkList
          );
          console.log("fryingRemarkObj", this.fryingRemarkObj);
        } else {
          this.$message.error(res.msg || "获取煎服法失败");
        }
      } catch (error) {
        this.$message.error(error.msg || "获取煎服法失败");
      }
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
/deep/ .el-dropdown {
  width: 60px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  display: inline-block;
}
</style>
