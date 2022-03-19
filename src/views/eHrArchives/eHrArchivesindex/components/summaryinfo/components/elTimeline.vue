<template>
  <div class="elTimeline">
    <div class="elTimeline-box">
      <span class="line-top"></span>
      <div class="line-top-box" v-for="(patientItemListData, index) in patientItemListData" :key="index">
        <el-col :span="6" class="line-left">
          <span class="round"></span>
          <span class="round-time">{{ interception(patientItemListData.time) }}</span>
        </el-col>
        <el-col :span="18" class="line-right">
          <el-card class="elCard-style elCard-style-border" shadow="hover" @click.native="drawerrue(patientItemListData)">
            <el-col>
              <h4 class="elCard-h4">{{ patientItemListData.diag || '--' }}</h4>
              <span class="elCard-span">{{ patientItemListData.treatType == 'O' ? '门诊' : patientItemListData.treatType == 'I' ? '住院' : '急诊' }}</span>
              <div>{{ patientItemListData.deptName || '--' }}</div>
            </el-col>
          </el-card>
        </el-col>
      </div>
      <span class="line-top"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['patientItemList'],
  data() {
    return {
      patientItemListData: []
    };
  },
  created() {},
  methods: {
    drawerrue(a) {
      this.$emit('drawerrue', a);
    },
    // 截取
    interception(str) {
      return str.substring(str.length - 5);
    }
  },
  watch: {
    patientItemList: function() {
      this.patientItemListData = this.patientItemList;
      // console.log(this.patientItemListData,'==================this.patientItemListData==========')
    }
  }
};
</script>

<style scoped lang="scss">
.elTimeline {
  .line-top {
    display: block;
    width: 20px;
    height: 1px;
    background: rgba(228, 228, 228, 1);
    margin-left: 5px;
  }

  .elCard-style {
    padding: 8px;
    box-sizing: border-box;
    height: auto;
    cursor: pointer;
  }
  .elCard-style-border {
    border: 1px solid rgba(228, 228, 228, 1);
  }
  .elCard-h4 {
    display: inline-block;
    margin-top: 2px;
    margin-bottom: 3px;
  }
  .elCard-span {
    display: inline-block;
    font-size: 12px;
    color: rgba(241, 89, 36, 1);
    width: 30px;
    height: 18px;
    line-height: 18px;
    background: rgba(241, 89, 36, 0.3);
    text-align: center;
    border-radius: 5px;
    // opacity:0.1;
    border: 0px solid rgba(241, 89, 36, 0.3);
  }
  .round {
    position: absolute;
    left: -3.5px;
    top: 25px;
    display: inline-block;
    width: 7px;
    height: 7px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(228, 228, 228, 1);
    border-radius: 50%;
    z-index: 10;
  }
  .round-time {
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: rgba(148, 157, 163, 1);
    line-height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .line-left {
    width: 77px;
    height: 55px;
  }
  .line-right {
    height: 100%;
  }
  .line-top-box {
    position: relative;
    border-left: 1px solid rgba(228, 228, 228, 1);
    height: 70px;
    margin-left: 5px;
    padding-bottom: 10px;
    z-index: 1;
  }
}
</style>
