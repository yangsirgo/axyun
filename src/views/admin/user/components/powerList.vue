<template>
  <div>
    <el-table
      :data="list"
      border
      highlight-current-row
      style="width:100%;height:285px;overflow-y:auto;"
      height="320px"
    >
      <el-table-column align="center" label="操作" width="160" fixed>
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-button type="primary" size="mini" @click="handleSave(row)">保存</el-button>
            <el-button type="primary" size="mini" @click="handleCancel(row)">取消</el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="mini" @click="handleRemove(row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="医院" width="300">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <span v-if="!isTree">{{hosNameSelect.org_nm}}</span>
            <div v-else>
              <el-button
                v-if="!hosSelect.id"
                type="primary"
                size="mini"
                @click="handleHosSelect(row)"
              >选择医院</el-button>
              <span v-else>
                <span>{{hosSelect.org_nm}}</span>
                <el-button type="text" @click="handleHosSelect(row)" style="margin-left: 10px;">
                  <i
                    class="el-icon-edit"
                    style="margin-top: -20px!important;margin-left: -10px!important;color: #1f2d3d!important;font-weight: 800!important;"
                  ></i>
                </el-button>
              </span>
            </div>
          </template>
          <span v-else>{{row.hosName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室" width="170">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select
              v-model="row.deptId"
              filterable
              @change="handeleDept(row)"
              :disabled="!isTree||isSelect?false:true"
            >
              <el-option v-for="item in dept" :key="item.id" :label="item.orgNm" :value="item.id"></el-option>
            </el-select>
          </template>
          <span v-else>{{row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" width="170">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-select
              v-model="row.roleId"
              filterable
              @change="handeleDept(row)"
              :disabled="!isTree||isSelect?false:true"
            >
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                width="170px!important"
              ></el-option>
            </el-select>
          </template>
          <span v-else>{{row.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审签级别" width="160" class="sigerstyle">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <l-value-domain code="AuditType" :value.sync="row.auditType" />
          </template>
          <span v-else v-show="row.auditType" :val="row.auditType" code="AuditType" v-codeTransform></span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="一级审签人" width="100">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <span v-if="sigerFirst">
              {{sigerFirst}}&nbsp;&nbsp;&nbsp;
              <el-button type="text" @click="handleFirstSigner()" >
                <i
                  class="el-icon-edit"
                  style="margin-top: -20px!important;margin-left: -10px!important;color: #1f2d3d!important;font-weight: 800!important;"
                ></i>
              </el-button>
            </span>
            <el-button v-else type="primary" :class="form.rid && form.did?'':'el-icon-circle-close'" size="mini" @click="handleFirstSigner()" :style="form.rid && form.did?'':'opacity: 0.5;'">请选择</el-button>
          </template>
          <span v-else>{{row.sigerFirst}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="二级审签人" width="100">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <span v-if="sigerSecond">
              {{sigerSecond}}
              &nbsp;&nbsp;&nbsp;
              <el-button type="text" @click="handleSecondSigner()" >
                <i
                  class="el-icon-edit"
                  style="margin-top: -20px!important;margin-left: -10px!important;color: #1f2d3d!important;font-weight: 800!important;"
                ></i>
              </el-button>
            </span>
            <el-button v-else type="primary" :class="form.rid && form.did?'':'el-icon-circle-close'" size="mini" @click="handleSecondSigner()" :style="form.rid && form.did?'':'opacity: 0.5;'">请选择</el-button>
          </template>
          <span v-else>{{row.sigerSecond}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="三级审签人" width="100">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <span v-if="sigerThird">
              {{sigerThird}}
              &nbsp;&nbsp;&nbsp;
              <el-button type="text" @click="handleThirdSigner()">
                <i
                  class="el-icon-edit"
                  style="margin-top: -20px!important;margin-left: -10px!important;color: #1f2d3d!important;font-weight: 800!important;"
                ></i>
              </el-button>
            </span>
            <el-button v-else type="primary" :class="form.rid && form.did?'':'el-icon-circle-close'" size="mini" @click="handleThirdSigner()" :style="form.rid && form.did?'':'opacity: 0.5;'">请选择</el-button>
          </template>
          <span v-else>{{row.sigerThird}}</span>
        </template>
      </el-table-column>
    </el-table>
    <signer
      :dialogSigerType.sync="dialogSigerType"
      :dialogSigerVisible.sync="dialogSigerVisible"
      @dialogSigerinfo="changeDialogSigerinfo"
      :id.sync="signerId"
      :sigerList.sync="sigerList"
      @handleData="handleData"
      :total="total"
    />
    <div style="text-align:right;margin-right:30px;">
      <el-button v-if="synShow" type="primary" size="mini" @click="handleIMAccount">同步账号</el-button>
    </div>
    <selectHos
      :data.sync="this.hos"
      :hosVisible.sync="hosVisible"
      @handleHos="handleSelectHos"
      :hosIds.sync="hosIds"
    />
  </div>
</template>
<script>
import { queryUsers, getOrgDeptList, getHosTree } from "@/api/admin/user";
import { getRoleAll } from "@/api/admin/role";
export default {
  components: {
    signer: () => import("./signer"),
    selectHos: () => import("./selectHos"),
  },
  data() {
    return {
      synShow: false, //同步按钮显示标识
      dialogSigerVisible: false,
      dialogSigerType: "",
      sigerFirst: "",
      sigerSecond: "",
      sigerThird: "",
      sigerFirstId: "",
      sigerSecondId: "",
      sigerThirdId: "",
      signerId: "",
      signerIds: {},
      hos: [],
      hosNameSelect: {},
      form: {
        page: 1,
        pageSize: 10,
        status: 0,
        orderBy: "updated_at desc",
      },
      isSelect: false,
      sigerList: [],
      total: 0,
      roles: [],
      dept: [],
      isTree: false,
      hosVisible: false,
      hosSelect: {},
    };
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    hosIds: {
      type: Array,
      default() {
        return [];
      },
    },
    userId: {
      type: String,
      default() {
        return "";
      },
    },
    // hos: {
    //   type: Array,
    //   default() {
    //     return [];
    //   }
    // }
    // roles: {
    //   type: Array,
    //   default(){
    //     return []
    //   }
    // },
    // dept: {
    //   type: Array,
    //   default(){
    //     return []
    //   }
    // }
  },
  watch: {
    list: {
      immediate: true,
      deep: true,
      handler(val) {
        // this.isSelect = false;
        console.log("this.isSelect", this.isSelect);
        console.info("======watch");
        this.handleSynBtnShow();
      },
    },
    userId() {
      console.log('11111', 11111)
      this.isSelect = false;
      this.hosNameSelect = {};

      this.hosSelect = {};

      this.getHosTree();
    },
  },
  mounted() {
    this.getHosTree();
  },
  methods: {
    //请求用户所在医院
    //根据医院请求科室
    queryOrgDeptList(data) {
      getOrgDeptList(data).then((res) => {
        console.log("dept数据请求处------------------");
        console.log(res.data);
        if (res.code === 1) {
          this.dept = res.data;
        } else {
          this.$message("获取数据失败");
        }
      });
    },

    getHosTree() {
      getHosTree().then((res) => {
        console.log(res.data);
        if (res.code === 1) {
          console.log("res", res);
          if (res.data.isTree) {
            this.hos = res.data.data;
            this.isSelect = false;
          } else {
            this.isSelect = true;
            console.log("object", this.isSelect);
            this.hosNameSelect = res.data.data;
            this.queryOrgDeptList({
              hosId: this.hosNameSelect.id,
              // userId: this.userId
            });
            this.queryRole({ hosId: this.hosNameSelect.id });
          }
          this.isTree = res.data.isTree;
        } else {
          this.$message("获取数据失败");
        }
      });
    },

    handleHosSelect(row) {
      this.hosVisible = true;
      row.deptId = "";
      row.roleId = "";
    },

    handleSelectHos(val) {
      this.hosVisible = false;
      console.log("val", val);
      if (val) {
        val.org_nm = val.label;
        this.hosSelect = val;
        this.isSelect = true;
        this.queryOrgDeptList({
          hosId: val.id,
          // userId: this.userId
        });
        this.queryRole({ hosId: val.id });
      }
    },
    //根据医院请求角色
    queryRole(data) {
      getRoleAll(data).then((res) => {
        if (res.code === 1) {
          this.roles = res.data;
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    changeDialogSigerinfo(obj) {
      this.dialogSigerVisible = obj.dialogSigerVisible;
      this.dialogSigerType = obj.dialogSigerType;
      this.signerIds = obj.singerIds;
      if (obj.signerinfo) {
        if (this.dialogSigerType == "one") {
          this.sigerFirst = obj.signerinfo.name;
          this.sigerFirstId = obj.signerinfo.id;
        } else if (this.dialogSigerType == "two") {
          this.sigerSecond = obj.signerinfo.name;
          this.sigerSecondId = obj.signerinfo.id;
        } else if (this.dialogSigerType == "three") {
          this.sigerThird = obj.signerinfo.name;
          this.sigerThirdId = obj.signerinfo.id;
        }
      }
    },
    handeleDept(row) {
      console.log("row", row);
      if (row.deptId) {
        this.form.did = row.deptId;
      }
      if (row.roleId) {
        this.form.rid = row.roleId;
      }
      this.fetchData();
    },
    handleHos(row) {
      console.log("row", row);
      row.deptId = "";
      row.roleId = "";
      if (row.hosId) {
        this.form.hosId = row.hosId;
        this.isSelect = true;
        this.queryOrgDeptList({ hosId: row.hosId, id: this.userId });
        // this.queryRole({hosId:row.hosId})
      }
    },
    fetchData() {
      queryUsers(this.form).then((res) => {
        if (res.code === 1) {
          this.sigerList = res.data;
          console.log(this.sigerList);
          this.total = res.total;
        } else {
          this.$message("获取数据失败");
        }
      });
    },
    handleData(val) {
      const form = this.form;
      this.form = val;
      this.form.did = form.did;
      this.form.rid = form.rid;
      this.fetchData();
    },
    //点击显示一级审签人
    handleFirstSigner(obj) {
      if(!this.form.rid||!this.form.did){
        this.$message("请先选择科室和角色")
        return;
      }
      this.dialogSigerVisible = true;
      this.dialogSigerType = "one";
      if (!this.sigerFirst) {
        this.signerId = "";
        return;
      }
      this.signerId = this.signerIds.sigerFirstId;
    },
    handleSecondSigner(obj) {
      if(!this.form.rid||!this.form.did){
        this.$message("请先选择科室和角色")
        return;
      }
      this.dialogSigerVisible = true;
      this.dialogSigerType = "two";
      if (!this.sigerSecond) {
        this.signerId = "";
        return;
      }
      this.signerId = this.signerIds.sigerSecondId;
    },
    handleThirdSigner(obj) {
      if(!this.form.rid||!this.form.did){
        this.$message("请先选择科室和角色")
        return;
      }
      this.dialogSigerVisible = true;
      this.dialogSigerType = "three";
      if (!this.sigerThird) {
        this.signerId = "";
        return;
      }
      this.signerId = this.signerIds.sigerThirdId;
    },
    handleSave(row) {
      this.isSelect = false;
      row.sigerFirst = this.sigerFirst;
      row.sigerSecond = this.sigerSecond;
      row.sigerThird = this.sigerThird;

      row.sigerFirstId = this.sigerFirstId;
      row.sigerSecondId = this.sigerSecondId;
      row.sigerThirdId = this.sigerThirdId;
      if (this.isTree) {
        row.hosId = this.hosSelect.id;
      } else {
        row.hosId = this.hosNameSelect.id;
      }
      console.log("row*8*8*8*8", row);
      // console.log(this.list)
      if (row.hosId && row.deptId && row.roleId) {
        let roleName = this.roles.filter((item) => item.id === row.roleId);
        let deptName = this.dept.filter((item) => item.id === row.deptId);
        row.roleName = roleName[0].name;
        row.deptName = deptName[0].orgNm;
        if (this.isTree) {
          row.hosName = JSON.parse(JSON.stringify(this.hosSelect)).org_nm;
        } else {
          row.hosName = JSON.parse(JSON.stringify(this.hosNameSelect)).org_nm;
        }

        this.$emit("savePower", row);
        row.edit = false;
        this.sigerFirst = "";
        this.sigerSecond = "";
        this.sigerThird = "";
        this.sigerFirstId = "";
        this.sigerSecondId = "";
        this.sigerThirdId = "";
        this.form.rid="";
        this.form.did='';
        // 自动同步IM账户
        this.handleIMAccount();
      } else {
        row.edit == true;
        this.$message({
          type: "error",
          message: "信息不可为空",
        });
      }
      this.hosSelect = {};
    },
    handleCancel(row) {
      this.form.rid='';
      this.form.did='';
      this.$emit("handleCancel");
    },
    handleRemove(row) {
      if (row.deptId) {
        this.$emit("removePower", row);
      } else {
        this.list.shift();
      }
      this.hosSelect = {};
      this.isSelect = false;
      this.sigerFirst = "";
      this.sigerSecond = "";
      this.sigerThird = "";
      this.sigerFirstId = "";
      this.sigerSecondId = "";
      this.sigerThirdId = "";
    },

    handleSynBtnShow() {
      // console.info(this.list);
      let rolelist = this.list;
      this.synShow = false;
      // 如果绑定角色为互联网医院角色则进行以下操作
      rolelist.forEach((item, index) => {
        if (item.rtype === "1") {
          this.synShow = true;
        }
      });
    },

    handleIMAccount() {
      let synShow = this.synShow;
      if (synShow) {
        this.$emit("synUser");
        // 调用接口，将医生账号同步给IM
        // 回调成功之后将账号信息存入账号表
      }
    },
  },
};
</script>
<style lang="scss" scoped>
//设置按钮
.el-button--mini {
  border-radius: 0;
}
.el-table--medium .el-button--mini {
  height: 30px;
  padding: 5px 15px;
}
</style>
