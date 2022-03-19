<template>
  <div>
    <el-table :data="list" border highlight-current-row style="width:100%;height:285px;overflow-y:auto;" height="320px">
      <el-table-column align="center" label="账号" width="120">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.userName"></el-input>
          </template>
          <span v-else>{{row.userName}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="类型" width="120">
                <template slot-scope="{row}">
                    <template v-if="row.edit">
                        <el-select v-model="row.type">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>

                    </template>
                    <span v-else>{{row.type}}</span>
                </template>
      </el-table-column>-->
      <el-table-column align="center" label="账号状态" width="120">
        <template slot-scope="{row}">
          <el-switch
            v-model=" row.status === '0' ? true:false"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="密码" width="120">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-button type="primary" size="mini"  @click="handleReset(row)" disabled>重置</el-button>
          </template>
          <template v-else>
            <el-button type="primary" size="mini"  @click="handleReset(row)">重置</el-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-button type="primary" size="mini"  @click="handleSave(row)">保存</el-button>
            <el-button type="primary" size="mini"  @click="handleCancel(row)">取消</el-button>
          </template>
          <template v-else>
            <el-button v-if="row.atype !== '40'" type="primary" size="mini"  @click="row.edit=true">编辑</el-button>
            <el-button v-if="row.atype !== '40'" type="primary" size="mini"  @click="handleRemove(row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      options: [
        {
          id: 1,
          value: "选项1",
          label: "黄金糕"
        },
        {
          id: 2,
          value: "选项2",
          label: "双皮奶"
        },
        {
          id: 3,
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          id: 4,
          value: "选项4",
          label: "龙须面"
        },
        {
          id: 5,
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
    };
  },
  methods: {
    handleSave(row) {
      //调用父组件方法修改并且刷新数据
      if(row.userName){
        this.$emit("saveAccount", row);
      }else{
        this.$message({
          message: '用户名不能为空，请重新输入！！',
          type: 'warning'
        });
      }
    },
    handleRemove(row) {
      //同上面方法
      this.$emit("removeAccount", row);
    },
    handleCancel(row){
     this.$emit("closeAccount", row);
    },

    handleReset(row) {
      console.log(row,row)
      this.$emit("resetPassword", row);
    }
  },

};
</script>
<style lang="scss" scoped>
//设置按钮
    .el-button--mini{
        border-radius: 0;
    }
 .el-table--medium .el-button--mini{
        height: 30px;
        padding: 5px 15px;
    }
</style>
