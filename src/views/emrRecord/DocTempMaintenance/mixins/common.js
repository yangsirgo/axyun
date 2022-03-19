import { mapGetters } from "vuex";

import { getParamsByKey } from "@/api/emrRecord/emr/SysParam";
import { dicOprAuth } from "@/api/emrRecord/emr/template"

export default {
  data() {
    return {
      tenantAdminRoles: [],
      orgAdminRoles: [],
      deptAdminRoles: [],
      roleMap: {
        "tenant": "9",
        "org": "0",
        "dept": "1",
        "other": "2",
      },
      roleRevereMap: {
        "9": "tenant",
        "0": "org",
        "1": "dept",
        "2": "other",
      }
    }
  },
  computed: {
    ...mapGetters(["role"]),
  },
  async created() {
    await this.getUserRoleHandler();
  },
  methods: {
    getCurrRoleCodeHandler() {
      let result = '';

      if (this.tenantAdminRoles.includes(this.role.roleCode)) {
        result = 'tenant'
      } else if (this.orgAdminRoles.includes(this.role.roleCode)) {
        result = 'org'
      } else if (this.deptAdminRoles.includes(this.role.roleCode)) {
        result = 'dept'
      } else {
        result = 'other'
      }

      return result;
    },
    async getUserRoleHandler() {
      try {
        const { code, data, msg } = await getParamsByKey({
          key: [
            "tenantDictionaryAdminRoles",
            "orgDictionaryAdminRoles",
            "deptDictionaryAdminRoles"
          ]
        })
        if (code === 1) {
          this.tenantAdminRoles = data.tenantDictionaryAdminRoles.split(',') || [];
          this.orgAdminRoles = data.orgDictionaryAdminRoles.split(',') || [];
          this.deptAdminRoles = data.deptDictionaryAdminRoles.split(',') || [];
        } else {
          this.$message.error(msg)
        }
      }
      catch (error) {
        this.$message.error(error || "error");
      };
    },
    async authorityHandler(params) {
      try {
        const { code, msg } = await dicOprAuth(params);
        if (code === 1) {
          return true;
        } else {
          this.$message.warning(msg)
          return false;
        }
      } catch (error) {
        return false
      }
    }
  }
}
