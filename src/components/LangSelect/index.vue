<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>请选择语言</div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">English</el-dropdown-item>
      <el-dropdown-item :disabled="language==='xz'" command="xz">བོད་སྐད།</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    language() {
      return this.$store.getters.language;
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch("app/setLanguage", lang);
      this.$message({
        message: "Switch Language Success",
        type: "success"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.international {
  width: 100px;
  text-align: center;
  color: #949da3;
  cursor: pointer;
  text-decoration: underline;
  font-size: 20px;
}
/deep/ .el-dropdown-menu__item:not(.is-disabled):hover {
  color: #606266;
}
</style>
