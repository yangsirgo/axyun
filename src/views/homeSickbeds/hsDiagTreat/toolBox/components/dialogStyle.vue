<template>

  <div class="width100 height100 dialogHeight">
    <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" height='410' style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column label="医嘱名称" width="434">
        <template slot-scope="scope">{{ scope.row.itemName }}</template>
      </el-table-column>
      <el-table-column label="组" prop="groupNoCls">
        <template slot-scope="scope"><span :class="scope.row.groupNoCls"></span></template>
      </el-table-column>
      <el-table-column prop="spec" label="规格" width="230">
      </el-table-column>
      <el-table-column prop="quantity" label="数量" show-overflow-tooltip width="60">
      </el-table-column>
      <el-table-column prop="unit" label="单位" show-overflow-tooltip width="60">
        <template slot-scope="scope">
          <span :val="scope.row.unit || '--'" code="DrugUnit" v-codeTransform></span>
        </template>
      </el-table-column>
      <el-table-column prop="oneDosage" label="一次用量" show-overflow-tooltip width="60">
      </el-table-column>
      <el-table-column prop="packageUnit" label="剂量单位" show-overflow-tooltip width="60">
        <template slot-scope="scope">
          <span :val="scope.row.dosageUnit || '--'" code="DrugDoseUnit" v-codeTransform></span>
        </template>
      </el-table-column>
      <el-table-column prop="frequencyCode" label="频次" show-overflow-tooltip>
        <template slot-scope='scope'>
          <!-- <span :val="scope.row.frequencyCode" code="Frequency" v-codeTransform></span> -->
          <span columns="FREQUENCY_NAME" :conditionMap="{
              FREQUENCY_CODE: scope.row.frequencyCode,
            }"
            tableName="hrp_frequency" v-tableTransform></span>
        </template>
      </el-table-column>
      <el-table-column prop="useWay" label="用法" show-overflow-tooltip v-if="currentTabsWrapper !== 'chmMedicine'">
        <template slot-scope='scope'>
          <span :val="scope.row.useWay"  code="MedicationRouteCode" v-codeTransform></span>
        </template>
      </el-table-column>
      <el-table-column prop="useWay" label="煎服法" show-overflow-tooltip v-if="currentTabsWrapper == 'chmMedicine'">
        <template slot-scope='scope'>
          <span :val="scope.row.useWay" code="fryingRemark" v-codeTransform></span>
        </template>
      </el-table-column>
      <el-table-column prop="day" label="天数" show-overflow-tooltip width="60">
        <template slot-scope='scope'>
          <span>{{calcFun(scope.row.day)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip width="60">
      </el-table-column>
      <!--  <el-table-column prop="urgent" label="加急" show-overflow-tooltip width="60">
     </el-table-column> -->
      <!-- <el-table-column prop="remark" label="附加说明" show-overflow-tooltip width="60">
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from "vuex";

  export default {
    name: "prescriptionTemp",
    props: ["templetDetailporso"],
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        treatIdList: [],
      };
    },
    computed: {
        ...mapGetters("homeSickbeds", ["currentTabsWrapper"])
    },
    mounted() {
      this.all()
    },
    methods: {
      grouping(list1) {
        // table 数据 成组操作
        // 将list 分组
        // return new Promise((resolve, reject) => {
        let list = [];
        let groupList = [];
        let filterList = [];
        let tableList = [];
        groupList = list1.map(item => {
          // 获取所有组
          return item.groupNo;
        });
        groupList = Array.from(new Set(groupList));
        groupList = groupList.filter((item, index) => {
          // 数组去undefind
          return item !== undefined && item != "";
        });
        groupList.forEach((item, index) => {
          //遍历 成map结构 分组
          // list = [];
          filterList = list1.filter((sonItem, sonIde) => {
            return item === sonItem.groupNo;
          });
          list.push({
            key: item,
            value: filterList
          });
        });
        list.forEach(item => {
          // 将有组item添加class
          let itemList = item.value;
          if (itemList.length == 1) return;
          itemList.map((sonItem, sonIndex) => {
            if (sonIndex === 0) {
              sonItem.groupNoCls = "bunchingUp";
            } else if (sonIndex === itemList.length - 1) {
              sonItem.groupNoCls = "bunchingDown";
            } else {
              sonItem.groupNoCls = "bunchingCenter";
            }
          });
        });
        list.map(item => {
          // 更改list格式
          item.value.map(val => {
            tableList.push(val);
          });
        });
        list1.map(item => {
          // 补充未成组项
          if (!item.groupNo) {
            tableList.push(item);
          }
        });
        return tableList
        // resolve(tableList);
        // });
      },

      calcFun(a) {
        let numStr = '--';
        if (a) {
          numStr = a.split(".")[0] ? a.split(".")[0] : '--';
        }
        return numStr;
      },
      all() {
        this.$nextTick(() => {
          for (let i = 0; i < this.tableData.length; i++) {
            this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true);
          }
        })
      },
      handleSelectionChange(val) {
        this.treatIdList = [];
        this.multipleSelection = val;
        console.log(val);
        for (let i = 0; i < val.length; i++) {
          this.treatIdList.push(val[i].templetDetailId);
        }
        console.log(this.treatIdList);
      },
    },
    watch: {
      templetDetailporso: {
        immediate: true,
        deep: true,
        handler(a) {
          console.log(this.templetDetailporso);
          this.tableData =  this.grouping(this.templetDetailporso);

        }
      }
    }
  };
</script>

<style lang='scss' scoped>
  .dialogHeight {
    height: 450px;
    overflow: auto;
    /* padding: 8px; */
    padding: 8px;

    .bunchingUp {
      display: inline-block;
      color: $l-color-primary1;

      &::after {
        content: "┓";
      }
    }

    .bunchingCenter {
      display: inline-block;
      color: $l-color-primary1;

      &::after {
        content: "┫";
      }
    }

    .bunchingDown {
      color: $l-color-primary1;
      display: inline-block;

      &::after {
        content: "┛";
      }
    }
  }
</style>
