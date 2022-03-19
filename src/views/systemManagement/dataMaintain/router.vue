<template>
  <div class="cls height100">
    <!--<el-card class="cls-left height100">-->
      <!--<left-tree @itemClick="loadData"></left-tree>-->
    <!--</el-card>-->
    <template v-if="componentList.includes(curIndex)">
      <div class="cls-right height100">
        <component :is="componentObj[curIndex]"></component>
      </div>
    </template>
    <template v-else>
      <div class="cls-right height100" v-if="!isRelation && !isRoleAuthorization && !isCheck">
        <el-card class="cls-right-right height100">
          <l-right @save="save" ref="details" v-if="type === 'son'||type === 'big'" :type="type"></l-right>
          <item-right @save="save" ref="details" v-else-if="type === 'item'"></item-right>
        </el-card>
        <el-card class="cls-right-center height100">
          <l-center
            @rowClick="centerRowClick"
            ref="center"
            :type="type"
            v-if="type === 'son'||type === 'big'"
          ></l-center>
          <item-center
            @rowClick="centerRowClick"
            ref="itemCenter"
            :type="type"
            v-else-if="type === 'item'"
          ></item-center>
        </el-card>
      </div>
      <div class="height100" v-else-if="isRelation &&  !isRoleAuthorization && !isCheck">
        <relation-module></relation-module>
      </div>
      <div class="height100" v-else-if="!isRelation && isRoleAuthorization && !isCheck">
        <role-authorization></role-authorization>
      </div>
      <div class="height100" v-else-if="!isRelation && !isRoleAuthorization && isCheck">
        <check-module></check-module>
      </div>
    </template>
  </div>
</template>

<script>
import leftTree from "./module/component/leftTree.vue";
import lCenter from "./module/component/centerModule/center.vue";
import itemCenter from "./module/component/centerModule/itemCenter.vue";
import lRight from "./module/component/rightModule/right.vue";
import itemRight from "./module/component/rightModule/itemRight.vue";
import relationModule from "./module/orderList/relationModule/index.vue";
import roleAuthorization from "./module/orderList/roleAuthorization/index.vue";
import checkModule from "./module/electronicList/checkModule/index.vue";
// 财务分类代码组件
import financeCode from "./module/financeCode/index";
// 收费项目维护组件
import payItems from "./module/payItems/index";
// 疾病字典维护
import diseaseModule from "./module/diseaseDicList/diseaseDictionaryModule/index.vue";

export default {
  name: "index.vue",
  components: {
    leftTree,
    lCenter,
    itemCenter,
    lRight,
    itemRight,
    relationModule,
    roleAuthorization,
    checkModule,
    financeCode,
    diseaseModule,
    payItems
  },
  data() {
    return {
      type: "item", // 分 子类 和大类,医嘱项目三种类型
      isRelation: false,
      isRoleAuthorization: false,
      isCheck: false,
      curIndex: null,
      /**
       * 新制作财务分类代码跟收费项目维护
       * componentList中的值是leftTree组件传过来的index
       * 根据index的值使用componentObj对应的组件
       */
      componentList: [0, 1, 8],
      componentObj: {
        0: financeCode,
        1: payItems,
        8: diseaseModule
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    loadData(index) {
      this.curIndex = index;
      if (index === 4) {
        this.type = "son";
        setTimeout(() => {
          this.$refs.center.loadData();
        }, 0);
        this.isRelation = false;
        this.isRoleAuthorization = false;
        this.isCheck = false;
      } else if (index === 3) {
        this.type = "big";
        setTimeout(() => {
          this.$refs.center.loadData();
        }, 0);
        this.isRelation = false;
        this.isRoleAuthorization = false;
        this.isCheck = false;
      } else if (index === 2) {
        this.type = "item";
        setTimeout(() => {
          this.$refs.itemCenter.search();
        }, 0);
        this.isRelation = false;
        this.isRoleAuthorization = false;
        this.isCheck = false;
      } else if (index === 5) {
        this.isRelation = true;
        this.isRoleAuthorization = false;
        this.isCheck = false;
      } else if (index === 6) {
        //角色医嘱授权
        this.isRelation = false;
        this.isRoleAuthorization = true;
        this.isCheck = false;
      } else if (index === 7) {
        //电子申请 检验检查 维护
        this.isRelation = false;
        this.isRoleAuthorization = false;
        this.isCheck = true;
      }
    },
    save(data) {
      this.loadData(data);
    },
    centerRowClick(row) {
      console.log("点击了row", row);
      setTimeout(() => {
        this.$refs.details.loadData(row);
      }, 0);
      // 得到数据后 通过 this.$refs.details.tableData 赋值
    }
  },
  watch: {},
  computed: {}
};
</script>

<style scoped lang="scss">
.cls {
  .cls-left {
    width: 350px;
    float: left;
  }
  .cls-right {
    /*margin-left: 360px;*/
    margin-left:0px;
    .cls-right-center {
      margin-right: 590px;
    }
    .cls-right-right {
      width: 580px;
      float: right;
    }
  }
}
</style>
