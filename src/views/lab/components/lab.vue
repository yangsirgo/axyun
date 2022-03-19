<template>
  <div>
    <div class="navBar">
      <el-select style="width: 80px" v-model="searchType">
        <el-option
          v-for="item in selectTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input size="medium" class="inputFind" v-model="searchData" style="width: 154px" placeholder="项目或拼音回车">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
      </el-input>
      <el-button type="text" class="lab-button-class">提交申请</el-button>
      <el-button type="text" class="lab-button-class">另存模版</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="changeDept">
      <el-tab-pane  name="1" label="检验科">
        <el-col :span="7">
          <lab-class></lab-class>
        </el-col>
        <el-col :span="17">
          <lab-table ref="labTable"></lab-table>
        </el-col>
      </el-tab-pane>
      <el-tab-pane  name="2" label="细菌室">
        <el-col :span="7">
          <lab-class></lab-class>
        </el-col>
        <el-col :span="17">
          <lab-table ref="labTable"></lab-table>
        </el-col>
      </el-tab-pane>
      <el-tab-pane name="3" label="床旁检验">
        <el-col :span="7">
          <lab-class></lab-class>
        </el-col>
        <el-col :span="17">
          <lab-table ref="labTable"></lab-table>

        </el-col>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    import labTable from "./labTable";
    import labClass from "./labClass";

    export default {
        name: "lab",
        components: {labTable, labClass},
        data() {
            return {
                activeName:'1',
                searchData: '',
                searchType: '1',
                selectTypeList: [
                    {
                        value: '1',
                        label: '组合'
                    }, {
                        value: '2',
                        label: '项目'

                    }
                ]
            }
        },
        created() {

        },
        methods: {
            search() {

            },
            changeDept(tab, event){
                console.log(tab.name);
                this.$refs.labTable.getLabItem(tab.name)
            },

        }

    }
</script>

<style scoped>
  .lab-button-class {
    margin-left: 20px;
  }
</style>
