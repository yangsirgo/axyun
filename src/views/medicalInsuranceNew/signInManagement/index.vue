<template>
  <el-card class="signInManagement height100">
    <div class="form-area">
      <el-row :gutter="10">
        <el-col :span="4">
          <LFormtTitle label="医保类型" disabled>
            <el-select
              v-model="form.medicareType"
              placeholder="请选择医保类型"
              clearable
              disabled
            >
              <el-option
                v-for="(item, index) in medicareTypeList"
                :key="index"
                :label="item.dictName"
                :value="item.dictCode"
              ></el-option>
            </el-select>
          </LFormtTitle>
        </el-col>
        <el-col :span="4">
          <l-formt-title label="人员">
            <el-select
              v-model="form.userId"
              placeholder="请选择人员"
              clearable
              @change="userChange"
            >
              <el-option
                v-for="item in roleData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </l-formt-title>
        </el-col>
        <el-col :span="10">
          <div style="padding: 8px 10px 0 0; display: inline-block">
            <el-radio-group v-model="radio">
              <el-radio :label="1">签到时间</el-radio>
              <el-radio :label="2">签退时间</el-radio>
            </el-radio-group>
          </div>
          <!-- </el-col>
        <el-col :span="6"> -->
          <l-formt-title label="日期" style="width: 300px">
            <el-date-picker
              v-model="form.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </l-formt-title>
        </el-col>
        <el-col :span="6">
          <div class="float-right">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="signIn">本人签到</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-cont">
      <l-table
        :showTotal="false"
        :pageSize="pagination.pageSize"
        :page="pagination.pageNo"
        :total="pagination.totalData"
        :background="false"
        layout="sizes,prev,pager,next,jumper,total"
        paginationAlign="right"
        @changeSize="changeSize"
      >
        <el-table :data="tableData" border width="100%" height="100%">
          <el-table-column
            v-for="(item, index) in signInManagementColumns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            :align="item.align || 'center'"
            :header-align="item.headerAlign || 'center'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'operate'">
                <el-button
                  type="text"
                  :disabled="scope.row.recordStatus != '1'"
                  @click="signOut(scope.row)"
                  >签退</el-button
                >
              </template>
              <template v-else-if="item.prop === 'recordStatus'">
                {{ recordStatusObj[scope.row[item.prop]] }}
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </l-table>
    </div>
  </el-card>
</template>
<script>
import Base64 from "@/utils/base64.js";
import { getUserId } from "@/utils/auth";
import { getMacLoaction, getIp } from "@/utils/print";
import { queryUsers } from "@/api/admin/user.js";
import { getPagemd } from "@/api/medicalInsurance/index.js";
import { signInManagementColumns } from "../common/signInManagement.js";
import service from "@/api/medicalInsuranceNew/signInManagement.js";

export default {
  name: "signInManagement",
  data() {
    return {
      radio: 1,
      form: {
        medicareType: "",
        userId: "",
        userName: "",
        date: [
          this.dayjs(new Date()).format("YYYY-MM-DD"),
          this.dayjs(new Date()).format("YYYY-MM-DD"),
        ],
      },
      medicareTypeList: [],
      roleData: [],
      pagination: {
        pageSize: 20,
        pageNo: 1,
        totalData: 0,
      },
      tableData: [],
      recordStatusObj: {
        1: "签到",
        2: "签退",
        9: "签到作废",
      },
      currentMac: "",
      currentIp: ""
    };
  },
  computed: {
    signInManagementColumns() {
      return signInManagementColumns;
    },
  },
  created() {
    this.getPagemd();
    this.getRoles();
    this.getMac();
    this.getIps();
  },
  methods: {
    async getPagemd() {
      let path = this.$route.path;
      let isNew = false;
      if(path.indexOf("medicalInsuranceNew") > -1) {
        isNew = true;
      } else {
        isNew = false;
      }
      let res = await getPagemd();
      if (res.code === 1) {
        this.medicareTypeList = res.data;
        this.form.medicareType = isNew ? res.data[0].dictCode : res.data[1].dictCode;
        this.search();
      }
    },
    async getRoles() {
      let userId = Base64.decode(getUserId());
      let res = await queryUsers({
        pageSize: 210,
        page: 1,
        orderBy: "updated_at desc",
      });
      if (res.code === 1) {
        this.roleData = res.data;
      }
      for (let i in res.data) {
        if (userId == res.data[i].id) {
          this.form.userId = res.data[i].id;
          this.form.userName = res.data[i].name;
        }
      }
    },
    userChange(val) {
      this.form.userName = "";
      for (let i in this.roleData) {
        if (val === this.roleData[i].id) {
          this.form.userName = this.roleData[i].name;
        }
      }
    },
    search() {
      this.pagination.pageNo = 1;
      this.loadTable();
    },
    async loadTable() {
      this.tableData = [];
      this.pagination.totalData = 0;
      if (!this.form.medicareType) {
        this.$message.warning("请先选择医保类型在进行查询！");
        return;
      }
      this.$showLoading();
      let params = {
        medicareType: this.form.medicareType,
        userId: this.form.userId,
        userName: this.form.userName,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      };
      if (this.radio === 1 && this.form.date && this.form.date.length) {
        delete params.signOutTimeStrat;
        delete params.signOutTimeStop;
        params.signInTimeStrat = this.form.date[0] + " 00:00:00";
        params.signInTimeStop = this.form.date[1] + " 23:59:59";
      }
      if (this.radio === 2 && this.form.date && this.form.date.length) {
        delete params.signInTimeStrat;
        delete params.signInTimeStop;
        params.signOutTimeStrat = this.form.date[0] + " 00:00:00";
        params.signOutTimeStop = this.form.date[1] + " 23:59:59";
      }
      try {
        let res = await service.getPageOperatorSignList(params);
        if (res.code == 1) {
          this.tableData = res.data;
          this.pagination.totalData = res.total;
        }
      } catch (error) {
      } finally {
        this.$hideLoading();
      }
    },
    async signIn() {
      if (!this.form.medicareType) {
        this.$message.warning("请先选择医保类型在进行查询！");
        return;
      }
      this.$showLoading();
      let params = {
        ipAddr: this.currentIp || "192.168.1.15",
        macAddr: this.currentMac,
        medicareType: this.form.medicareType,
      };
      try {
        let res = await service.signIn(params);
        if (res.code === 1) {
          this.$message.success(res.msg || "签到成功！");
          this.search();
        }
      } catch (error) {
      } finally {
        this.$hideLoading();
      }
    },
    async signOut(row) {
      if (row.recordStatus != "1") {
        this.$message.warning("状态为签到的记录才可签退！");
        return;
      }
      this.$confirm("确认签退吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        this.$showLoading();
        try {
          let res = await service.signOut({
            medicareType: this.form.medicareType,
            userId: row.userId
          });
          if (res.code === 1) {
            this.$message.success(res.msg || "签退成功！");
            this.search();
          }
        } catch (error) {
        } finally {
          this.$hideLoading();
        }
      });
    },
    changeSize(val) {
      this.pagination.pageNo = val.page;
      this.pagination.pageSize = val.pageSize;
      this.loadTable();
    },
    // 获取mac地址
    getMac() {
      try {
        let mac = { value: "" };
        getMacLoaction(mac).then((res) => {
          this.currentMac = res;
        });
      } catch (error) {
        this.$message.error(error.message || "获取本机主MAC地址失败");
      }
    },
    // 获取ip地址
    getIps() {
      getIp("NetworkAdapter.Count", { value: "" }).then(async (res) => {
        for (var i = 1; i <= Number(res); i++) {
          if (this.currentIp === "0.0.0.0" || this.currentIp === "") {
            await this.getIp("NetworkAdapter." + i + ".IPAddress");
          }
        }
      });
    },
    async getIp(name) {
      try {
        await getIp(name, {value: ''}).then((res) => {
          this.currentIp = res;
        });
      } catch (error) {
        this.$message.error(error.message || "获取ip地址失败");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.signInManagement {
  padding: 10px;
  .form-area {
    margin-bottom: 10px;
  }
  .table-cont {
    height: calc(100% - 44px);
  }
}
</style>