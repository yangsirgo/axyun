<template>
  <el-card class="container">
    <div class="label">医疗质量安全</div>
    <ul class="content">
      <li v-for="(tip,index) in tips" :key="index" class="block">
        <i :class="tip.icon+' icon'"></i>
          <div class="text">
            <div>{{tip.name}}</div>
            <div>
              <span class="font">{{tip.value}}</span>项
            </div>
          </div>
      </li>
    </ul>
  </el-card>
</template>
<script>


export default {
  name: "TreatQualityPortlet",
  data: function() {
    return {
      tips: [
        {
          "icon": "el-icon-warning",
          "name": "危急值",
          "value": 3
        },
        {
          "icon": "el-icon-document",
          "name": "未读报告",
          "value": 2
        },
        {
          "icon": "el-icon-star-on",
          "name": "体征异常",
          "value": 11
        },
        {
          "icon": "el-icon-edit-outline",
          "name": "病历质控消息",
          "value": 3
        },
        {
          "icon": "el-icon-view",
          "name": "待审抗菌药物",
          "value": 3
        },
        {
          "icon": "el-icon-service",
          "name": "会诊邀请",
          "value": 3
        }
      ]
    };
  },
  mounted() {},
  created() {
    this.getQualityTips();
  },
  methods: {
    async getQualityTips(){

    }
  }
};
</script>
<style lang="scss" scoped>

.container {
   /deep/.el-card__body{
     height:100%;
     padding:10px;
     display: inline-block;
   }
  .label {
    float: left;
    margin-top: 11px;
    color: #ff6a00;
    font-weight: 700;
    font-size: 14px;
  }
  .content {
    position: absolute;
    right: 0;
    height: 42px;
  }
}
.block {
  float: left;
  height: 100%;
  margin: 0 45px 0 30px;
  .icon {
    float: left;
    margin-top: 2px;
    font-size: 28px;
    color: rgba(253, 120, 88, 1);
  }
  .text {
    margin-left: 11px;
    float: left;
    color: #605D5A;
    font-size: 14px;
    div{
      height: 16px;
    }
    .font {
      font-size: 20px;
      color: #ff6a00;
    }
  }
}
</style>
