<template>
  <div>
    <!-- <el-input v-selectInner v-model="input"></el-input> -->
    max： {{ max }}
    <br />
    input: {{ input }}
    <inputNumber @change="changeTest" @input="inputText" v-model="input" :max="max" :min="0"></inputNumber>
    <el-button @click="change"> 更改最大值 </el-button>
    <el-button @click="changeInput"> 更改输入框值 </el-button>

    <el-button @click="add">新增</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="680" fixed>
        <template slot-scope="scope">
          <l-shotcut-input
            v-axShotcut
            component="LInputTable"
            :shotindex="scope.$index + '1'"
            :shotready="true"
            :data-id="'lInputTable' + scope.row.row_id"
            :popoverWidth="1200"
            :tableData="selectOptions"
            v-model="scope.row.date"
            suffix-icon="el-icon-search"
            :tableParams="dropColumn"
            placeholder="请输入项目名称关键字"
            valueKey="name"
          />
        </template>
      </el-table-column>
      <el-table-column prop="aaa" fixed label="aaa" width="480">
        <template slot-scope="scope">
          <l-shotcut-input
            v-axShotcut
            component="el-input-number"
            :shotindex="scope.$index + '2'"
            :shotready="true"
            v-model.trim="scope.row.aaa"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
        <template slot-scope="scope">
          <l-shotcut-input
            v-axShotcut
            component="el-input-number"
            :shotindex="scope.$index + '3'"
            :shotready="true"
            v-model.trim="scope.row.name"
          />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址">
        <template slot-scope="scope">
          <l-shotcut-input
            v-axShotcut
            component="el-input"
            :shotindex="scope.$index + '4'"
            :shotready="true"
            @ended.native="shotcutEndHandler(scope, 'address')"
            v-model.trim="scope.row.address"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
import { getDataIdDom } from "@/utils/util.js";
import inputNumber from "@/components/adviceCommon/lInputNumber.vue";
export default {
  data() {
    return {
      tableData: [],
      selectOptions: [],
      dropColumn: [],
      input: "3",
      max: "10"
    };
  },
  directives: {
    selectInner: {
      inserted(el, vDir, vNode) {
        console.log(el);
        let targetInput = el.querySelector(".el-input__inner");
        // console.log("targetInput", targetInput);
        targetInput.addEventListener("focus", event => {
          // console.log(event, event.target);
          event.target.select();
        });
      }
    }
  },
  methods: {
    changeTest (){
      console.log("changeTest");
    },
    inputText (){
      console.log("inputText");
    },
    change() {
      this.max = Number(Math.random()).toFixed(1) * 10;
    },
    changeInput() {
      this.input = Number(Math.random()).toFixed(1) * 10;
    },
    shotcutEndHandler() {
      setTimeout(() => {
        this.add();
      }, 1000);
    },
    add() {
      let a = {
        date: "",
        name: "",
        row_id: +new Date()
      };
      this.tableData.push(a);
      setTimeout(() => {
        this.setComponentFocusFuncTest("lInputTable", a.row_id);
      }, 500);
    },
    //设置元素聚焦 test
    setComponentFocusFuncTest(refName, targetId) {
      // refs 方式 如果有fixed列会失效，直接用操作DOM处理
      this.$nextTick(() => {
        setTimeout(() => {
          let targetDataId = refName + targetId;
          console.log(targetDataId);
          let nodeList = getDataIdDom("div", "data-id", targetDataId);
          console.log(nodeList);
          if (nodeList.length > 0) {
            if (refName === "lInputTable") {
              console.log(
                nodeList[1].getElementsByClassName("el-input__inner")[0]
              );
              // 医嘱名称 跟 其他的 scope 内的定为的元素不一样
              nodeList[1].getElementsByClassName("el-input__inner")[0].focus();
            }
          }
        }, 100);
      });
    }
  },
  components: { inputNumber }
};
</script>

<style scoped lang="scss">
</style>
