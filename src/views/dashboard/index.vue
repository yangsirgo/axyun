<template>
  <div class="width100 height100 wrapper">
    <div class="left fl height100">
      <base-info></base-info>
    </div>
    <div class="right height100">
      <div class="top">
        <div class="notice fl  height100">
          <iconList :iconList="iconList"></iconList>
        </div>
        <div class="charts height100">
          <apptdoctor></apptdoctor>
        </div>
      </div>
      <div class="bottom">
        <l-bottom></l-bottom>
      </div>
    </div>
  </div>
</template>
<script>
import iconList from "./components/iconList";
import apptdoctor from "../cis/appointTriage/apptdoctor/components/ApptDoctor";
import scheduleTime from "./components/scheduleTime";
import BaseInfo from "./components/BaseInfo";
import lBottom from "./components/performance";
import service from "@/api/admin/dashboard.js";
export default {
  data() {
    return {
      iconList: [
        {
          iconClass: "iconxiazhenduan",
          bgColor: "#134796",
          num: "0",
          tips: "今日门诊患者"
        },
        {
          iconClass: "iconbaochuang",
          bgColor: "$l-color-primary",
          num: "0",
          tips: "我的住院患者"
        },
        {
          iconClass: "iconshuxing",
          bgColor: "$l-color-fontcolor-5",
          num: "0条",
          tips: "待处理危机值"
        },
        {
          iconClass: "iconxiehuizhen",
          bgColor: "#26AAE6",
          num: "0人",
          tips: "待参加的会诊"
        },
        {
          iconClass: "iconkanbaogao",
          bgColor: "#F7A820",
          num: "0份",
          tips: "未读的报告"
        }
      ]
    };
  },
  components: {
    BaseInfo,
    iconList,
    lBottom,
    apptdoctor
  },
  mounted() {
    this.getIconList();
  },
  methods: {
    async getIconList() {
      try {
        let resData = await service.getDeshboardData();
        if (resData.code == 1) {
          this.iconList[0].num = resData.data.findCountOfTodayVisit + "人";
          this.iconList[1].num = resData.data.inpCount + "人";
        } else {
          this.$message.error(resData.msg);
        }
      } catch (error) {
        this.$message.error(error.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
  font-size: 20px;
  .left {
    background-color: #fff;
    width: 330px;
  }
  .right {
    margin-left: 350px;

    .top {
      height: 47%;
      padding-bottom: 10px;
      .notice {
        width: 448px;
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
      .charts {
        padding-bottom: 20px;
        margin-left: 468px;
        overflow: auto;
        background-color: #fff;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
    }
    .bottom {
      height: 53%;
      padding-top: 10px;
    }
  }
}
</style>
