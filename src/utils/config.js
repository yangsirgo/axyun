import Vue from "vue";

Vue.prototype._anx_config = {};

export function getServerConfig(key) {
  return process.env["VUE_APP_" + key];
}
