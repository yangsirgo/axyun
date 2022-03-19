<template>
  <div class="height100">
    <el-card class="height100">
      <div class="top">
        <div class="float-left" style="width: 200px;border-radius: 2px;display: inline-block">
          <l-formt-title label="用法类型" labelWidth="64">
            <el-select v-model="type" placeholder="">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </l-formt-title>
        </div>
        <el-checkbox-group class="float-left" v-model="timeType" @change="handleTimeTypeChange">
          <el-checkbox v-for="type in timeTypeList" :label="type" :key="type"></el-checkbox>
        </el-checkbox-group>
        <el-button class="float-right right-btn" type="primary">发药确认</el-button>
        <el-button class="float-right right-btn" type="primary">配方确认</el-button>
      </div>
      <div class="table-container">
        <div class="table-header">
          <span>住院医嘱发药明细</span>
          <el-button class="float-right right-btn">打印勾选明细</el-button>
        </div>
        <el-checkbox-group v-model="batch" @change="handleBatchChange">
          <el-checkbox v-for="item in batchList" :label="item" :key="item"></el-checkbox>
        </el-checkbox-group>
        
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "advDispensing",
    data (){
      return {
        type: '', // 用法类型
        typeList: [ // 用法类型列表
          {
            label: '1111',
            value: '111',
          },
          {
            label: '2222',
            value: '222',
          }
        ],
        timeType: [], // 医嘱类型
        timeTypeList: [ // 医嘱类型列表
          '长期医嘱', '临时医嘱', '出院带药'
        ],
        batch: [], // 当前选择批次
        batchList: [ // 批次列表
          '第一批次', '第二批次', '第三批次', '第四批次', '第五批次'
        ],
      }
    },
    methods: {
      handleTimeTypeChange (val){ // 选择医嘱类型
        console.log(val);
      },
      handleBatchChange (val){ // 选择批次
        console.log(val);
      }
    }
  }
</script>

<style scoped lang="scss">
.top{
  overflow: hidden;
  padding: 20px;
  height: 76px;
  border-bottom: 1px solid $l-color-bgcolor-11;
  .float-left{
    line-height: 35px;
    margin-right: 20px;
  }
  .right-btn{
    width: 80px;
    height: 36px;
    margin-left: 10px;
    text-align: center;
    padding: 0px;
    border-radius: 2px;
  }
}
  .table-container{
    text-align: left;
    padding: 0 20px;
    .table-header{
      height: 64px;
      line-height: 64px;
      &>span{
        color: $l-color-fontcolor-3;
        font-weight: $l-font-weight;
        font-size: $l-font-size-max;
      }
      .right-btn{
        width: 124px;
        height: 36px;
        border: 1px solid $l-color-primary;
        border-radius: 2px;
        color: $l-color-primary;
        margin-top: 14px;
      }
    }
  }
</style>
