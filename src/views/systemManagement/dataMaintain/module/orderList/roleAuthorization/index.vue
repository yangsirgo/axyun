<template>
  <div class="height100 cls-right">
    <el-row class="height100">
      <el-col
        :span="8"
        class="height100"
      >
        <el-card class="height100">
          <div class="utils">
            <el-input
              v-model="utils.adviceItemName"
              placeholder="输入关键字进行检索"
              style="width: 70%"
            ></el-input>
            <el-button
              class="fr"
              type="primary"
              @click="getRoleList"
            >查询</el-button>
          </div>
          <div class="list">
            <ul>
              <li
                @click="liClick(index, item)"
                v-for="(item, index) in list"
                :class="cls(index)"
              >{{item.name}}</li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col
        :span="16"
        class="height100"
        style="padding-left: 10px"
      >
        <el-card class="height100 rightCard">
          <div class="right-utils">
            <el-radio-group
              v-model="rightUtils.selectType"
              class="vertical10"
              @change="radioChange"
            >
              <el-radio :label="3">全部</el-radio>
              <el-radio :label="1">已选</el-radio>
              <el-radio :label="0">未选</el-radio>
            </el-radio-group>
            <LFormtTitle
              label="医嘱分类"
              required
              style="width: 50%;margin-left: 30px;"
            >
              <el-input
                v-model="rightUtils.adviceName"
                @keyup.enter.native ="search"
                placeholder="医嘱大类名称/别名"
              ></el-input>
            </LFormtTitle>
            <el-button
              type="primary"
              class="vertical10 btn"
              @click="search"
            >查询</el-button>
          </div>
          <div
            style="height: calc(100% - 58px);overflow-y: auto"
            v-loading="loading"
          >
            <el-tree
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              show-checkbox
              :data="tdata"
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :default-checked-keys="resIds"
              :props="defaultProps"
            >
            </el-tree>
          </div>
          <div class="bottomBtn">
            <el-button
              type="primary"
              @click="save"
            >保存</el-button>
            <el-button
              plain
              @click="reset"
            >重置</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  adviceItemListPage,
  oWQueryDoctorsAdviceTree,
  oWSaveDoctorsAdviceRoleRelation,
  oWQueryDoctorsAdviceRoleRelationByParams
} from "@/api/systemManagement/dataMaintain/adviceItem";
import { getDoctorsAdviceList } from "@/api/systemManagement/dataMaintain/doctorsAdvice";
import {
  getResourceAll,
  addRes,
  addResNew,
  getResRouter,
  addResource,
  editResource,
  removeResource
} from "@/api/admin/resource";
import { getMenuTree } from "@/api/admin/menu";
import { mapActions, mapGetters } from "vuex";
import {
  getRoleList,
  getDeptList,
  getBizRes,
  addRoleRes,
  RoleResList,
  DelRoleRes,
  editRoleRes
} from "@/api/admin/role";

export default {
  name: "index",
  components: {},
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "adviceName"
      },
      resIds: [],
      authId: "",
      tdata: [],
      utils: {
        adviceItemName: ""
      },
      list: [],
      current: "0",
      centerRow: {},
      rightUtils: {
        selectType: 3,
        adviceName: ""
      },
      loading: false,
      checkStrictly: false
    };
  },
  created() {
    // this.getMenuTree();
    this.oWQueryDoctorsAdviceRoleRelationByParams();
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    filterNode(value, data, node) {
      if (!value) {
        return true;
      }

      let _array = [];
      this.getReturnNode(node, _array, value);
      console.log("filterNodes", _array);
      let result = false;
      _array.forEach(item => {
        result = result || item;
      });
      return result;
    },
    getReturnNode(node, _array, value) {
      
      let isPass =
        node.data && node.data.adviceName && node.data.adviceName.indexOf(value) !== -1;
      // eslint-disable-next-line no-unused-expressions
      // isPass ? _array.push(isPass) : "";
            if(isPass) {
        _array.push(isPass)
      }
      if (!isPass && node.pid != 0 && node.children) {
        this.getReturnNode(node.children, _array, value);
      }
    },
    //选中 checkbox 事件回调  暂时没有用到
    treeCheckBoxChange(a, b, c) {
      if (a.children && a.children.length > 0) {
        let idList = a.children.map(item => {
          return item.id;
        });
        let allCheckedIds = this.$refs.tree.getCheckedNodes().map(item => {
          return item.id;
        });
        idList.push(a.id);
        if (b) {
          idList = Array.from(new Set([...idList, ...allCheckedIds]));
          this.$refs.tree.setCheckedKeys(idList);
        } else {
          console.log("过滤之钱的数组:::", allCheckedIds);
          allCheckedIds = allCheckedIds.filter(
            item => !idList.some(ele => ele === item)
          );
          console.log("过滤之后的数组:::", allCheckedIds);
          this.$refs.tree.setCheckedKeys(allCheckedIds);
        }
      }
    },
    getRoleList() {
      getRoleList({ name: this.utils.adviceItemName, pageSize: 9999 }).then(
        res => {
          if (res.code === 1) {
            this.list = res.data;
            this.centerRow = res.data[0] || {};
            this.oWQueryDoctorsAdviceRoleRelationByParams();
          } else {
            this.$message.error("获取数据失败");
          }
        }
      );
    },
    radioChange() {
      this.oWQueryDoctorsAdviceRoleRelationByParams();
      this.rightUtils.adviceName = "";
    },
    oWQueryDoctorsAdviceRoleRelationByParams() {
      this.loading = true;
      let obj = this.getParams();
      oWQueryDoctorsAdviceRoleRelationByParams(obj).then(res => {
        let arr = [];
        if (res.code === 1) {
          this.tdata = res.data;
          this.resIds = [];
          this.setCheckboxList(res.data);
          this.loading = false;
        } else {
          this.$message.error("获取数据失败");
          this.loading = false;
        }
      });
    },
    setCheckboxList(tree) {
      tree.forEach(item => {
        if (item.selectFlag) {
          this.resIds.push(item.id);
        }
        if (item.children && item.children.length > 0) {
          this.setCheckboxList(item.children);
        }
      });
    },
    getMenuTree(name) {
      this.loading = true;
      oWQueryDoctorsAdviceTree().then(res => {
        if (res.code === 1) {
          this.tdata = res.data;
          console.log(JSON.stringify(res.data[0]));
          this.oWQueryDoctorsAdviceRoleRelationByParams();
        } else {
          this.$message.error("获取数据失败");
        }
        this.loading = false;
      });
    },
    liClick(index, item) {
      this.current = index;
      this.centerRow = item;
      this.reset();
      // this.getMenuTree();
      this.oWQueryDoctorsAdviceRoleRelationByParams();
    },
    cls(index) {
      console.log(this.current, index);
      return {
        "list-item": true,
        active: this.current == index
      };
    },
    rowClick(row) {},
    search() {
      // this.oWQueryDoctorsAdviceRoleRelationByParams();
      console.log(this.tdata);
      this.$refs.tree.filter(this.rightUtils.adviceName);
    },
    getParams() {
      let obj = {
        ...this.rightUtils,
        ...{ roleCode: this.centerRow.id || "" }
      };
      if (this.rightUtils.selectType === 3) {
        delete obj.selectType;
      }
      return obj;
    },
    reset() {
      this.rightUtils = {
        selectType: 3,
        adviceName: ""
      };
      this.$refs.tree.filter("");
      this.$refs.tree.setCheckedKeys([]);
    },
    save() {
      let obj = {
        roleCode: this.centerRow.id,
        reqTreeDoctorsAdviceRoleRelationDTO: this.$refs.tree.getCheckedNodes()
      };

      if (this.rightUtils.selectType !== 3) {
        obj.selectType = this.rightUtils.selectType;
      }

      oWSaveDoctorsAdviceRoleRelation(obj).then(res => {
        if (res.code === 1) {
          this.$message.success("保存成功");
        } else {
          this.$message.error("获取数据失败");
        }
      });
    }
  },
  watch: {
    "rightUtils.selectType"() {
      if (this.rightUtils.selectType === 1) {
        this.checkStrictly = true;
      } else {
        this.checkStrictly = false;
      }
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.cls-right {
  /*margin-left: 360px;*/

  .utils {
    padding: 10px;
  }

  .list-item {
    line-height: 36px;
    padding: 0 10px;

    &.active {
      background-color: #e6e6e6;
    }
  }

  .centerTable {
    height: calc(100% - 96px);
  }

  .cls-right-center {
    margin-right: 750px;
    position: relative;
  }

  .cls-right-right {
    width: 740px;
    float: right;
  }

  .pagination {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  .right-utils {
    padding: 10px 20px;

    .vertical10 {
      vertical-align: 11px;
    }

    .btn {
      margin-left: 5px;
    }
  }

  .rightCard {
    position: relative;
  }

  .bottomBtn {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>
