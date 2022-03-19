<template>
  <el-button type="primary" @click="onRegister">Register</el-button>
</template>

<script>
import Register from "./Register";
export default {
  methods: {
    onRegister() {
      this.$confirmBox({
        title: "注册账户",
        customClass: "w600",
        showCancelButton: true,
        confirmButtonText: "注册",
        component: Register,
        componentName: "Register",
        confirmValidate: (action, cpt, done) => {
          if (action === "cancel") {
            cpt.clearValidate();
            return done();
          }
          cpt.validate(valid => {
            if (!valid) return;
            console.log("{userData}: ", { ...cpt.userData });
            cpt.clearValidate();
            done();
          });
        }
      }).catch(() => {});
    }
  }
};
</script>
<style>
.el-message-box.w600 {
  width: 600px;
}
</style>
