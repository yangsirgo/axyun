<template>
  <div class="table-col">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark"></div>
      </el-col>
    </el-row>
    <el-row v-for="(itemObj, index) in colmnsObjList" :key="index">
      <el-col style="height: 112px" :span="4">
        <div style="height: 112px" class="grid-content bg-purple">121</div>
      </el-col>
      <el-col
        :span="20 / colmns"
        v-for="(item, idx) in itemObj.childEleList"
        :key="idx">
        <div
          class="grid-content common-colmns "
          :class="{
            'bg-purple-light': idx % 2 == 0,
            'bg-purple': idx % 2 != 0
          }">
          <LFormtTitle :label="item.label">
            <el-input
              style="line-height: 34px;width:100%"
              v-model="item.value"
              :placeholder="item.placeholder">
            </el-input>
          </LFormtTitle>
        </div>
      </el-col>
      <!-- <el-col v-else :span="20 - (20 / colmns) * itemObj.childEleList.length">
        <div class="grid-content bg-purple-light">
          {{ itemObj.childEleList.length }}
        </div>
      </el-col> -->
    </el-row>
    <!-- <el-row>
      <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="8"
        ><div class="grid-content bg-purple-light"></div
      ></el-col>
      <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"
        ><div class="grid-content bg-purple-light"></div
      ></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"
        ><div class="grid-content bg-purple-light"></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple-light"></div
      ></el-col>
      <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple-light"></div
      ></el-col>
      <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
      <el-col class="" :span="4"
        ><div class="grid-content common-colmns bg-purple-light">
          <LFormtTitle label="文书编码">
            <el-input style="line-height: 34px;width:100%" placeholder="请输入">
            </el-input>
          </LFormtTitle></div
      ></el-col>
    </el-row> -->
  </div>
</template>

<script>
  export default {
    name: "tableCol",
    data() {
      return {
        colmns: 4,
        colmnsObjList: [
          {
            name: "label",
            childEleList: [
              {
                name: "ele",
                label: "文书编码",
                value: "1",
                placeholder: "请输入"
              },
              {
                name: "ele",
                label: "备注",
                value: "",
                placeholder: "请输入"
              },
              {
                name: "ele",
                label: "身高",
                value: "2",
                placeholder: "请输入"
              },
              {
                name: "ele",
                label: "体重",
                value: "3",
                placeholder: "请输入"
              },
              {
                name: "ele",
                label: "血型",
                value: "4",
                placeholder: "请输入"
              }
            ]
          }
        ]
      };
    },
    methods: {},
    components: {}
  };
</script>

<style lang='scss' scoped>
  .table-col {
    .el-row {
      margin-bottom: 5px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .common-colmns {
      // box-sizing: border-box;
      padding: 10px;
    }

    .el-col {
      border-radius: 4px;
    }

    .bg-purple-dark {
      background: #99a9bf;
    }

    .bg-purple {
      background: #d3dce6;
    }

    .bg-purple-light {
      background: #e5e9f2;
    }

    .grid-content {
      height: 56px;
    }

    .row-bg {
      background-color: #f9fafc;
    }
  }
</style>
