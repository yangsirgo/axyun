<template>
  <div class="page">
    <el-table
      ref="table"
      :data="data"
      border
      max-height="100%"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        width="60"
        :selectable="checkSelectable"
        type="selection">
      </el-table-column>
      <el-table-column
        v-for="(item, index) in tableParams"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
      >
        <template slot-scope="scope">
          <template v-if="item.prop == 'result'">
            <div>
              <i class="el-icon-error" v-if="scope.row.error.length > 0"></i>
              <i class="el-icon-success" v-else></i>
            </div>
          </template>
          <template v-else-if="item.prop == 'action'">
            <el-radio-group v-model="scope.row.isSave">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </template>
          <!-- "warning":[]
          "other":[],
          "error":[],
          "confirm":[], -->
          <template v-else-if="item.prop == 'error' || item.prop == 'warning' ||  item.prop == 'confirm' ||  item.prop == 'other'">
            <div>
              {{ scope.row[item.prop].toString() }}
            </div>
          </template>
          <template v-else>
            <div>
              {{ scope.row[item.prop] }}
            </div>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props:["data"],
  data() {
    return {
      multipleSelection: [],
      // tableList: [],
      tableParams: [
        {
          prop: "orderItemName",
          label: "医嘱名称",
          width: 210
        },
        {
          prop: "spec",
          label: "规格"
        },
        {
          prop: "result",
          label: "校验结果"
        },
        {
          prop: "confirm",
          label: "确认信息"
        },
        {
          prop: "error",
          label: "错误信息"
        },
        {
          prop: "warning",
          label: "提示"
        },
        // {
        //   prop: "action",
        //   label: "操作"
        // }
      ]
    };
  },
  methods: {
    
    checkSelectable(row) {
      if (row.error.length > 0){
        return 0;//禁用
      } 
      return 1;// 启用
      
    },
    // 获取用户选中
    getMultipleSelection (){
      return this.multipleSelection;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    tableRowClassName({row}) {
      let { error } = row;
      if (error.length > 0) {
        return 'disabledRow';
      } 
      return '';
    },
    toggleRowSelection (){
      let data = this.data;
      for(let i = 0; i < data.length; i++){
        let row = data[i];
        if(row.error.length == 0){
          this.$refs.table.toggleRowSelection(row, true);
        }
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler (val){
        this.$nextTick(()=>{
          this.toggleRowSelection();
        });

      }
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.page {
  min-height: 400px;
  max-height: 60vh;
  overflow: auto;
}
</style>
