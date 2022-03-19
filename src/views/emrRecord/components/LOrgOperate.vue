<template>
  <l-formt-title>
    <el-checkbox v-model="level9">通用</el-checkbox>
    <el-checkbox v-model="level0" @change="checkChange">机构</el-checkbox>
    <l-value-domain
      type="select"
      clearable
      filterable
      style="width: 220px"
      remoteUrl="/admin/org/hos-tree"
      remoteShowKey="label"
      remoteValueKey="id"
      placeholder="请选择机构"
      :value.sync="hosVal"
      @change="hosChange"
    ></l-value-domain>
    <el-checkbox v-model="level1" @change="isDeptHandle">科室</el-checkbox>
    <l-input-table
      placeholder="请输入科室"
      style="display: inline-block; width: 300px"
      :deptList="deptVal"
      :popoverWidth="680"
      :tableData="deptList"
      :tableParams="deptTableParams"
      :tableLoading="tableLoading"
      @delDeptHandler="delDeptHandler"
      @select="deptSelectHandler"
      @query="queryHandler"
    />
    <el-checkbox v-model="level2" @change="choosePerson"> 个人 </el-checkbox>
  </l-formt-title>
</template>

<script>
import { getHosTree } from "@/api/admin/user.js";
import rediagSetting from "@/api/appointmentNew/rediagSetting.js";

import LInputTable from "./LInputTable";
export default {
  name: "LOrgOperate",
  components: {
    LInputTable
  },
  data() {
    return {
      tableLoading: false,
      remoteParamsObj: {
        hosId: ""
      },
      level9: false,
      level0: false,
      level1: false,
      level2: false,
      hosVal: "",
      orgIdByAdmin: "",
      deptVal: [],
      deptList: [],
      deptTableParams: [
        {
          prop: "orgName",
          label: "机构",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "200"
        },
        {
          prop: "hosName",
          label: "医院",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "200"
        },
        {
          prop: "orgNm",
          label: "科室名称",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "200"
        },
        {
          prop: "selected",
          label: "选中",
          align: "left",
          headerAlign: "left",
          fixed: "left",
          width: "60"
        }
      ]
    };
  },
  watch: {
    "remoteParamsObj.hosId": {
      handler(val) {
        if (val) {
          this.getDeptListHandler(val);
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getHosIdHandler();
    this.getDeptListHandler();
  },
  /**
   * 1、click1
   * 提交
   *
   */
  methods: {
    choosePerson(val) {
      this.$emit("choosePerson", val);
    },
    judgeFlag() {
      const flagTenant = this.level9 === true;
      const flagHos = this.level0 === true;
      const flagDept = this.level1 === true;
      const flagUser = this.level2 === true;

      return {
        flagTenant,
        flagHos,
        flagDept,
        flagUser
      };
    },
    resetData() {
      this.level0 = false;
      this.level1 = false;
      this.level2 = false;
      this.level9 = false;

      this.hosVal = "";
      this.deptVal = [];
    },
    deptsHandler() {
      return this.deptVal.map(dept => dept.id).join(",");
    },
    hosValHandler() {
      return this.hosVal;
    },
    hosChange(data) {
      this.remoteParamsObj = {
        hosId: data
      };
      this.deptVal = [];
      if (data) {
        this.level0 = true;
      } else {
        this.level0 = false;
      }
    },
    checkChange(flag) {
      if (flag) {
        this.hosVal = this.orgIdByAdmin;
        this.remoteParamsObj = {
          hosId: this.hosVal
        };
      } else {
        this.hosVal = "";
        this.remoteParamsObj = {
          hosId: ""
        };
      }
    },
    isDeptHandle(data) {
      // if (data) {
      //   if (this.hosVal === this.orgIdByAdmin) {
      //     this.deptVal = [this.role.deptId || ""];
      //   } else {
      //     this.deptVal = [];
      //   }
      // } else {
      //   this.deptVal = [];
      // }
    },
    getHosIdHandler() {
      getHosTree(false).then(res => {
        const { code, data, msg } = res;
        if (code === 1) {
          let id = data.data.id || "";
          this.orgIdByAdmin = id;
        } else {
          this.orgIdByAdmin = "";
        }
      });
    },
    queryHandler(query) {
      this.getDeptListHandler(query);
    },
    getDeptListHandler(deptName = "") {
      this.tableLoading = true;
      rediagSetting
        .getDeptList({
          deptName
        })
        .then(res => {
          const { code, data, msg } = res;
          if (code === 1) {
            this.deptList = data.map(item => {
              return {
                ...item,
                selected: false
              };
            });
          } else {
            this.$message.error(msg);
          }
        })
        .catch(err => {
          console.log(err, "err");
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    delDeptHandler(row) {
      this.$set(row, "selected", false);
      this.deptVal.shift();
    },
    deptSelectHandler(row) {
      const flagIndex = this.deptVal.findIndex(dept => {
        return dept.id === row.id;
      });

      if (flagIndex >= 0) {
        this.$set(row, "selected", false);
        this.deptVal = this.deptVal.filter((dept, idx) => {
          return idx !== flagIndex;
        });
      } else {
        this.$set(row, "selected", true);
        this.deptVal.push(row);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
