<template>
  <div class="width100 height100">
    <ul id="tags-view-container" class="tags-view-container" v-if="secondMenu.length > 0">
      <li
        class="tags-view-item"
        v-for="tag in secondMenu"
        ref="tag"
        :key="tag.path"
        @click="handleMenuItem(tag)"
      >
        <span
          :class="{ active: Active === tag.path }"
          :style="tag.isopen === true ? '' : 'background-color: #ccc;'"
        >
          <em class="tags-icon-box">
            <i
              :class="[
                'iconfont',
                tag.meta.icon ? tag.meta.icon : 'iconjibenxinxi'
              ]"
            ></i>
          </em>
          {{ tag.name }}
        </span>
      </li>
    </ul>
    <PatientInfoTop v-bind="$attrs" />
    <ul class="tags-tab-view" v-if="thirdMenu.length > 0">
      <li
        :class="[
          'tags-tab-view-item',
          activeLastPath === tag.path ? 'active' : ''
        ]"
        v-for="tag in thirdMenu"
        ref="tag"
        :key="tag.path"
        @click="handleMenuItemLast(tag)"
      >
        <span :style="tag.isopen === true ? '' : ''">
          <!-- <i class="el-icon-edit"></i> -->
          {{ tag.name }}
        </span>
      </li>
    </ul>
    <div
      :class="['width100', 'position-relative']"
      :style="{ height: 'calc(100% - ' + calcContentHeight + 'px)' }"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { checkMrSubmitStatus } from "@/api/cis/visit/visit";
import { getOrder } from "@/api/cis/order/order";
import { getRecipeStatus } from "@/utils/updateRecipeStatus.js";
import PatientInfoTop from "@/components/PatientInfoTop.vue";

export default {
  props: {
    patientCardType: {
      type: String
    }
  },
  components: {
    PatientInfoTop
  },
  data() {
    return {
      // 当前的二级菜单
      Active: "",
      // 当前的三级菜单
      activeLastPath: "",
      visitedViewsItemLast: [],
      // 二级菜单
      secondMenu: [],
      // 三级菜单
      thirdMenu: []
    };
  },
  computed: {
    ...mapGetters(["permission_routes"]),
    // 二级菜单
    visitedViewsItem() {
      return this.$store.state.permission.routesArr;
    },
    // 当前的二级菜单
    activePath() {
      return this.$store.state.permission.activePath;
    },
    // 三级菜单
    activeLastArr() {
      return this.$store.state.permission.activeLastArr;
    },
    // 当前的三级菜单
    activeLastRoute() {
      return this.$store.state.permission.activeLastRoute;
    },
    calcContentHeight() {
      let h = 0;
      if (this.secondMenu.length > 0) {
        h += 50;
      }
      if (this.thirdMenu.length > 0) {
        h += 30;
      }
      if (this.patientCardType) {
        h += 100;
      }
      return h;
      /* if (this.secondMenu.length === 0) {
        if (this.patientCardType) {
          return "150";
        }
        return "64";
      }
      if (this.patientCardType) {
        return "180";
      }
      return "94"; */
    }
  },
  watch: {
    // 监听路由(2019-10-18)
    $route: {
      immediate: true,
      handler(val) {
        this.setMenuShow(val.path);
      }
    }
  },
  methods: {
    // 根据当前路由高亮选中匹配的菜单(2019-10-18)
    setMenuShow(path) {
      //console.log("-------path------->",path)
      const arr = path.split("/").filter(item => !!item);
      this.Active = `/${arr[0]}/${arr[1]}`;
      this.activeLastPath = `/${arr[0]}/${arr[1]}/${arr[2]}`;

      const menuList = this.permission_routes;
      //console.log("menuList-----", menuList);

      // 二级菜单
      const menu1 = menuList.find(item => item.path === `/${arr[0]}`);
      if (menu1.isFlow === "1") {
        this.secondMenu = menu1.children;
        // console.log("~~~~~~~~~~~~11111111111111",  this.secondMenu )
        //vue id = pid && code = edit
        for (let ii in this.secondMenu) {
          this.compBiz(this.secondMenu[ii]);
        }
      } else {
        this.secondMenu.splice(0);
        //console.log("~~~~~~~~~~~~22222",  this.secondMenu )
      }

      // 三级菜单
      const menu2 = this.secondMenu.find(
        item => item.path === `/${arr[0]}/${arr[1]}`
      );
      this.thirdMenu = menu2.children || [];
      for (let ii in this.thirdMenu) {
        this.compBiz(this.thirdMenu[ii]);
      }
    },

    //
    compBiz(item) {
      //console.log("@@@@@@@@@@@@",item)
      let arr = this.$store.state.permission.bizs;
      for (let i = 0; i < arr.length; i++) {
        let _tmp = arr[i];
        if (_tmp.pid == item.id && _tmp.code == "edit") {
          //console.log("~~~~~~~~~~~~~~~~~~~~~~")
          //return true;
          item.isopen = true;
        }
      }
      //return false;
    },

    handleMenuItem(item) {
      if (!item.isopen) {
        this.$message({
          type: "warning",
          message: "您没有权限!"
        });
        return;
      }
      this.$store.dispatch("permission/activeLastArr", []);
      this.$store.dispatch("permission/activeRoute", item.path);
      if (item.hasOwnProperty("children") && item.children.length > 0) {
        if (
          item.children[0].hasOwnProperty("children") &&
          item.children[0].length > 0
        ) {
          this.$store.dispatch(
            "permission/activeLastArr",
            item.children[0].children
          );
          this.$store.dispatch(
            "permission/activeRouteLast",
            item.children[0].children[0].path
          );
          this.$nextTick(() => {
            this.$router.push(item.children[0].children[0].path);
            // this.comBizLast(item.children[0].children)
          });
        } else {
          this.$store.dispatch("permission/activeLastArr", item.children);
          this.$store.dispatch(
            "permission/activeRouteLast",
            item.children[0].path
          );
          this.$nextTick(() => {
            // this.$router.push(item.children[0].path);
            this.comBizLast(item.children);
          });
        }
      } else {
        this.$nextTick(() => {
          //console.log("-----", item);
          this.$router.push(item.path);
        });
      }
    },

    //
    handleMenuItemLast(item) {
      if (!item.isopen) {
        this.$message({
          type: "warning",
          message: "您没有权限!"
        });
        return;
      }
      this.$store.dispatch("permission/activeRouteLast", item.path);
      if (item.hasOwnProperty("children") && item.children.length > 0) {
        this.$nextTick(() => {
          this.$router.push(item.children[0].path);
        });
      } else {
        this.$nextTick(() => {
          this.$router.push(item.path);
        });
      }
    },

    //
    comBizLast(items) {
      let arr = this.$store.state.permission.bizs;
      for (let i = 0; i < arr.length; i++) {
        let temp = arr[i];
        for (let ii in items) {
          let item = items[ii];
          if (temp.pid == item.id && temp.code == "edit") {
            //console.log(temp.pid);
            this.$router.push(item.path);
            return;
          }
        }
      }

      this.$message({
        type: "warning",
        message: "此模块下级模块您没有权限!"
      });
    },

    //
    getStatus() {
      // console.info("this.$store.state.cis",this.$store.state.cis.RpTableData);
      let status = [
        {
          label: "诊断",
          status: "0"
        },
        {
          label: "病历",
          status: "1"
        },
        {
          label: "处方",
          status: "0"
        },
        {
          label: "回诊",
          status: "0"
        }
      ];
      let patient =
        typeof this.$store.state.base.receivePatientData !== "undefined"
          ? this.$store.state.base.receivePatientData
          : {};
      let patientId =
        typeof this.$store.state.base.receivePatientData["patientId"] !==
        "undefined"
          ? this.$store.state.base.receivePatientData["patientId"]
          : ""; //获取患者ID
      let visitCode =
        typeof this.$store.state.base.receivePatientData["visitCode"] !==
        "undefined"
          ? this.$store.state.base.receivePatientData["visitCode"]
          : ""; //获取患者就诊ID
      //获取诊断状态
      let d = { label: "诊断未保存", status: "0" };
      if (typeof patient.diagName == "undefined" || patient.diagName === "") {
        d = { label: "诊断未保存", status: "0" }; // 未保存
      } else {
        d = { label: "诊断已保存", status: "1" }; // 已保存
      }
      status[0] = d;

      // 获取电子病历状态
      let emrStatus = { label: "病历未填写", status: "0" };
      checkMrSubmitStatus({
        patientId: patient.patientId,
        enId: patient.visitCode
      }).then(res => {
        if (res.code === 1) {
          if (res.data === null) {
            emrStatus = { label: "病历未书写", status: "0" }; // 未书写
          } else {
            if (res.data.printStatus.indexOf("90") != -1) {
              emrStatus = { label: "病历已打印", status: "0" }; // 已打印
            } else {
              if (res.data.mrStaCds.indexOf("01") !== -1) {
                emrStatus = { label: "病历未填写", status: "1" }; // 未提交
              } else if (res.data.mrStaCds.indexOf("02") !== -1) {
                emrStatus = { label: "病历已填写", status: "2" }; // 已提交
              }
            }
          }
        }
      });
      status[1] = emrStatus;

      //获取处方状态
      getRecipeStatus(visitCode, this).then(res => {
        status[2] = res;
      });

      // 获取回诊情况
      let rediagStatus = { label: "未回诊", status: "0" };
      if (patient.rediagStatus === "1") {
        rediagStatus = { label: "已回诊", status: "1" }; // 已回诊
      } else {
        rediagStatus = { label: "未回诊", status: "0" }; // 未回诊
      }
      status[3] = rediagStatus;

      this.$store.dispatch("navBarMsg/changeList", status);
    }
  }
};
</script>
<style lang="scss" scoped>
.tags-tab-view {
  height: 30px;
  line-height: 30px;
  width: 100%;
  background: rgba(246, 246, 246, 1);
  .tags-tab-view-item {
    float: left;
    padding: 0 20px;
    color: #949da3;
    background-color: rgba(246, 246, 246, 1);
    cursor: pointer;
    &.active {
      background-color: $l-color-primary;
      color: #ffffff;
    }
    &:first-of-type {
      border-top-left-radius: 4px;
    }
  }
}
.tags-view-container {
  position: relative;
  width: 100%;
  background: rgba(234, 238, 241, 1);
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  /* border-bottom: 1px solid #d8dce5;
         box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);*/
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    z-index: 1;
    border-top: 1px solid #c5cbcf;
  }
  .tags-view-item {
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    span {
      position: relative;
      z-index: 5;
      min-width: 126px;
      color: #495060;
      background: #fff;
      //background-color: #ccc;
      font-size: 14px;
      border-radius: 4px;
      height: 40px;
      line-height: 40px;
      padding: 0 12px;
      box-shadow: 0px 0px 10px 0px #0000001a;
      &::before,
      &::after {
        position: absolute;
        content: "";
        top: 50%;
        width: 10px;
        border-top: 1px solid #eaeef1;
      }
      &::before {
        right: 100%;
      }
      &::after {
        left: 100%;
      }
      .tags-icon-box {
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        margin-top: 8px;
        margin-right: 3px;
        background-color: $l-color-primary;
        text-align: center;
        border-radius: 2px;
        vertical-align: top;
        i {
          color: #fff;
        }
      }
      &.active {
        background-color: $l-color-primary;
        color: #ffffff;
        font-weight: bold;
        .tags-icon-box {
          background-color: #fff;
          i {
            color: $l-color-primary;
          }
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
.content-64 {
  height: calc(100% - 54px);
}
.content-150 {
  height: calc(100% - 130px);
}
.content-94 {
  height: calc(100% - 84px);
}
.content-180 {
  height: calc(100% - 156px);
}
</style>
