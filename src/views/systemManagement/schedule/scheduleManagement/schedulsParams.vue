<template>
  <el-card class="schedulsParams height100">
    <div class="left float-left height100">
      <div class="sche-collapse">
        <el-collapse v-model="collapseValue">
          <el-collapse-item v-for="item in menuList" :key="item.name" :name="item.name">
            <template slot="title">{{item.title}}</template>
            <p
              v-for="(menu,index) in item.list"
              :key="index"
              :class="{'list-item':true, 'select':curItemName === item.name && curItemIndex === index}"
              @click="handlerClick(menu,item.name,index)"
            >{{menu.deptName}}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="right float-right height100">
      <component :is="curComponent"></component>
    </div>
  </el-card>
</template>

<script>
import treatRegionMaintain from "./components/treatRegionMaintain";
import channelMaintain from "./components/channelMaintain";
import treatRoomMaintain from "./components/treatRoomMaintain";
import treatTypeMaintain from "./components/treatTypeMaintain";
import treatClassesMaintain from "./components/treatClassesMaintain";
import triageStationManitain from "./components/triageStationManitain";

export default {
  name: "schedulsParams",
  components: {
    treatRegionMaintain,
    treatRoomMaintain,
    channelMaintain,
    treatTypeMaintain,
    treatClassesMaintain,
    triageStationManitain
  },
  data() {
    return {
      //展开列表
      collapseValue: ["deptList", "paramList"],
      menuList: [
        //诊室管理
        {
          name: "deptList",
          title: "诊室管理",
          list: [
            {
              deptName: "诊区维护",
              component: treatRegionMaintain
            },

            {
              deptName: "分诊站维护",
              component: triageStationManitain
            },
            {
              deptName: "诊室信息维护",
              component: treatRoomMaintain
            }
          ]
        },
        //参数管理
        {
          name: "paramList",
          title: "参数管理",
          list: [
            {
              deptName: "预约渠道维护",
              component: channelMaintain
            },
            {
              deptName: "诊疗类型维护",
              component: treatTypeMaintain
            },
            {
              deptName: "班次&号源维护",
              component: treatClassesMaintain
            }
          ]
        }
      ],
      curItemName: "deptList",
      curItemIndex: 0,
      curComponent: treatRegionMaintain
    };
  },
  methods: {
    handlerClick(menu, name, index) {
      this.curItemName = name;
      this.curItemIndex = index;
      this.curComponent = menu.component;
    }
  }
};
</script>

<style lang="scss">
.schedulsParams {
  .left {
    width: 287px;
    padding: 20px;
    border-right: 1px solid $l-color-bgcolor-11;

    .sche-collapse {
      .el-collapse-item__header {
        font-size: $l-font-size;
        
        font-weight: bold;
        color: $l-color-fontcolor-3;
      }

      .el-collapse-item__content {
        padding: 0;
      }

      .list-item {
        height: 44px;
        padding-left: 10px;
        font-size: $l-font-size;
        
        font-weight: 400;
        color: $l-color-fontcolor-3;
        line-height: 44px;
        cursor: pointer;
      }

      .select {
        
        font-weight: bold;
        background-color: $l-color-bgcolor-12;
      }
    }
  }

  .right {
    width: calc(100% - 288px);
  }
}
</style>
