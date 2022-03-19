<template>
  <div class="allergy-list">
    <l-card-title class="patient-info" v-show="receivePatientData.patientName">
      <div slot="left" class="info-box">
        <!-- {{ receivePatientData.patientName }}&nbsp;
        <span
          code="GENDER_CODE"
          :val="receivePatientData.patientGender"
          v-codeTransform
        ></span>
        &nbsp;
        <span v-if="receivePatientData.patientAge">{{
          receivePatientData.patientAge
        }}</span>
        <span v-else-if="receivePatientData.age"
          >{{ receivePatientData.age }}岁</span
        >
        &nbsp; -->
        过敏情况
      </div>
    </l-card-title>
    <l-card-title class="patient-info" v-if="!receivePatientData.patientName">
      <div slot="left" class="info-box">
        <span style="padding: 0 4px"> 姓名 </span>
        <span style="padding: 0 4px"> 性别 </span>
        <span style="padding: 0 4px"> 年龄 </span>
      </div>
    </l-card-title>

    <div class="patient-tree" v-loading="loading">
      <el-menu
        :default-openeds="['0']"
        default-active="0-0"
        :unique-opened="true"
        class="el-menu-vertical-demo type-list-menu"
      >
        <el-submenu
          v-for="(tab, index) in list"
          :index="'' + index"
          :key="index"
        >
          <template slot="title">
            <i class="filter-item iconfont icondaohangxialajiantou"></i>
            <span>{{ gmType[tab.type] }}</span>
            <span>({{ tab.children.length }})</span>
            <i
              class="iconfont iconxinzeng"
              :title="'新增' + gmType[tab.type] + '登记'"
              @click.stop="$emit('send-data', { type: tab.type, data: {} })"
            ></i>
          </template>
          <el-menu-item
            v-for="(item, idx) in tab.children"
            :key="item.id"
            :index="'' + index + '-' + idx"
            @click="
              $emit('send-data', { type: 'echo-' + tab.type, data: item })
            "
            :title="
              item.allergyName +
              (item.registerResult > -1
                ? ' (' + rType[item.registerResult] + ') '
                : '') +
              (item.registerTime ? item.registerTime.split(' ')[0] : '') +
              ' (' +
              statusType[item.status] +
              ') '
            "
          >
            <span>{{ item.allergyName || item.drugName }}</span>
            <span v-if="item.registerResult > -1"
              >({{ rType[item.registerResult] }})</span
            >
            <span v-if="item.registerTime">{{
              item.registerTime.split(" ")[0]
            }}</span>
            <span>({{ statusType[item.status] }})</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { getTree } from "@/api/allergy/index";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "",
  data() {
    return {
      // 列表loading
      loading: false,
      list: [
        {
          title: "药物过敏",
          type: "0",
          children: []
        },
        {
          title: "食物过敏",
          type: "1",
          children: []
        },
        {
          title: "其他过敏",
          type: "2",
          children: []
        }
      ],
      // 过敏类型
      gmType: {
        "0": "药物过敏",
        "1": "食物过敏",
        "2": "其他过敏"
      },
      // 过敏结果
      rType: {
        1: "阳性",
        2: "阴性"
      },
      //
      statusType: {
        0: "代执行",
        1: "皮试中",
        2: "有效",
        3: "过期",
        4: "手动登记"
      }
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      deep: true,
      immediate: false,
      handler(val) {
        console.log("患者信息", val);
        this.loadData();
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "base/changeRecPatientData",
      changeReloadPatient: "base/changeReloadPatient"
    }),
    // 加载树
    async loadData() {
      this.clearList();
      if (!this.receivePatientData.patientId) {
        return;
      }
      this.loading = true;
      try {
        let res = await getTree({
          patientId: this.receivePatientData.patientId
        });
        if (!this.receivePatientData.patientId) {
          this.clearList();
          this.loading = false;
          return;
        }

        if (res.code === 1) {
          let allergyNameList = this.getAllergyNameList(res.data);
          // 把对应的过敏类型放到list里
          const arr = this.list.map(item => {
            const element = res.data[item.type];
            if (element) {
              return {
                ...item,
                children: element
              };
            } else {
              return {
                ...item,
                children: []
              };
            }
          });
          this.list = arr;
          // 默认选中第一个
          let data = {};
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].children.length > 0) {
              data = this.list[i].children[0];
              break;
            }
          }

          //更新 过敏信息
          this.setPatientNewAllergyName(allergyNameList.toString());

          if (JSON.stringify(data) !== "{}") {
            let { allergyCategory = "0" } = data;

            // 给右侧发送默认第一个的数据
            this.$emit("send-data", {
              type: "echo-" + allergyCategory,
              data
            });
          } else {
            this.$emit("send-data", {
              type: "",
              data
            });
          }
        }
        this.loading = false;
      } catch (err) {
        this.clearList();
        this.loading = false;
        this.$message.error(err);
      }
    },
    //设置患者的最新的 过敏信息
    setPatientNewAllergyName(allergyName = "") {
      // debugger
      /* let addAllergyNamePatient = this.receivePatientData;
      this.$set(addAllergyNamePatient, "allergyName", allergyName);
      // addAllergyNamePatient = {...addAllergyNamePatient,...{ allergyName: this.form.allergyName }}
      // console.log(addAllergyNamePatient.allergyName);
      this.changeRecPatientData(addAllergyNamePatient); */
    },
    getAllergyNameList(allObj = {}) {
      let list = [];
      for (const key in allObj) {
        if (typeof this.gmType[key] != "undefined") {
          // console.log("allObj[key]", allObj[key]);
          list = list.concat(allObj[key]);
          // console.log("list", list);
        }
      }
      console.log(list);
      return list.map(item => {
        return item.allergyName;
      });
    },
    clearList() {
      this.list = [
        {
          title: "药物过敏",
          type: "0",
          children: []
        },
        {
          title: "食物过敏",
          type: "1",
          children: []
        },
        {
          title: "其他过敏",
          type: "2",
          children: []
        }
      ];
      this.$emit("send-data", {
        type: "",
        data: {}
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  overflow-y: auto;
}
.allergy-list {
  position: relative;
  width: 287px;
  height: 100%;
  float: left;
  border-right: 1px solid $l-color-bgcolor-11;
  .cardtitle {
    padding: 0 16px;
    /deep/ .titleleft::before {
      margin-top: 13px;
    }
  }
  .patient-info {
    line-height: 40px;
    /deep/ .titleleft {
      float: none;
      .info-box {
        float: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .patient-tree {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16px;
    padding-top: 0;
    padding-right: 12px;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-submenu__title {
    position: relative;
  }
  .type-menu-num {
    position: absolute;
    right: 8px;
    top: 50%;
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-top: -9px;
    border-radius: 50%;
    background-color: $l-color-primary;
    color: $l-color-white;
    text-align: center;
  }
  /deep/ .el-submenu__title {
    height: 44px;
    line-height: 44px;
  }
}
.type-list-menu {
  border-right: 0;
  /deep/ .el-submenu__title {
    background-color: $l-color-bgcolor-14;
    .el-submenu__icon-arrow {
      display: none;
    }
    .type-menu-num {
      margin-left: 10px;
    }

    &:hover {
      /deep/ .iconxinzeng {
        display: inline-block;
      }
    }
  }
  /deep/ .iconfont {
    display: inline-block;
  }
  /deep/ .iconxinzeng {
    float: right;
  }
  /deep/ .filter-item {
    margin-right: 8px;
    font-size: 12px;
    color: $l-color-fontcolor-3;
  }
  /deep/ .el-submenu {
    margin-bottom: 1px;

    &.is-opened .el-submenu__title {
      .icondaohangxialajiantou {
        transform: rotate(90deg);
      }
      span {
        font-weight: $l-font-weight;
      }
    }
  }
  /deep/ .el-menu-item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 45px !important;
    padding-right: 20px;
  }
  /deep/ .el-menu-item.is-active {
    background-color: $l-color-bgcolor-12;
  }
  /deep/ .el-badge__content.is-fixed.is-dot {
    top: 10px;
  }
}
</style>
