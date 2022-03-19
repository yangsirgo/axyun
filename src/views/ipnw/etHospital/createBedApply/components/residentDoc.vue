<template>
  <div class="page">
    <el-row>
      <el-col>
        <l-card-title><span slot="left">居民上传文件</span></l-card-title>
      </el-col>
    </el-row>
    <template v-if="tData.length > 0">
      <el-row
        v-for="(item, index) in tData"
        :key="index"
      >
        <el-col
          :span="8"
          v-for="(sItem, sIndex) in item"
          :key="sIndex"
        >
          <div class="grid-content"><a
              :href="sItem.fileUrl"
              target="_blank"
            >{{ index * 3 + (sIndex + 1) }}.{{ sItem.fileName }}</a></div>
        </el-col>
      </el-row>
    </template>
    <el-row v-else>
      <el-col :span="24" class="noneDateCls"> 暂无数据 </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import { cutArrFunc } from "@/components/adviceCommon/adviceUtils.js";

export default {
  props: {
    data: {
      type: Array,
      default () {
        return [];
      } 
    }
  },
  data() {
    return {
      tData: []
    };
  },
  components: {},
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(n) {
        this.tData = cutArrFunc(n, 3);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}

.noneDateCls {
  // min-height: 36px;
  line-height: 36px;
  color: #909399;
  text-align: center;
  font-size: 14px;
}

.grid-content {
  border-radius: 4px;
  // min-height: 36px;
  text-align: left;
  padding: 0 10px;
  line-height: 36px;

  > a {
    font-size: 14px;
    color: #0000ff;
    text-decoration: underline;
  }
}

.page {
  min-height: 50px;
}
</style>
