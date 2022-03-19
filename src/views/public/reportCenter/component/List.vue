<template>
  <div class="container">
    <div class="top-container">
      <!-- 类型下拉 -->
      <el-select
        class="inline-block select-container"
        v-model="typeVal"
        placeholder="请选择"
        @change="typeChange"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- 时间选择 -->
      <el-date-picker
        v-model="timeRange"
        type="daterange"
        value-format="yyyy-MM-dd"
        prefix-icon="icon iconfont iconriqi"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="inline-block date-picker"
        @change="timeChanage"
      ></el-date-picker>
    </div>
    <div class="content-loading" v-loading="loading" v-show="receivePatientData.patientId">
      <el-menu
        :default-openeds="['0']"
        default-active="0-0"
        :unique-opened="true"
        class="el-menu-vertical-demo type-list-menu"
        v-show="typeVal === '0'"
      >
        <el-submenu v-for="(item,index) in categoryList" :index="''+index" :key="index">
          <template slot="title">
            <i class="filter-item iconfont icondaohangxialajiantou"></i>
            <span>{{item.assayItemName}}</span>
            <span class="type-menu-num">{{item.countAssay}}次</span>
          </template>
          <el-menu-item
            v-for="(item2, idx) in item.assayPublishList"
            :key="item2.examPublishId"
            :index="''+index+ '-' +idx"
            @click="chooseReport(item2)"
          >
            <template>{{item2.createdAt}}送,{{item2.checkDate}}检</template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <el-timeline class="report-timeline" v-show="typeVal === '1'">
        <el-timeline-item
          v-for="(item, index) in categoryList"
          :key="index"
          :timestamp="item.date"
          placement="top"
        >
          <el-card
            v-for="card in item.assayPublishList"
            :data-id="card.examPublishId"
            :key="card.examPublishId"
            @click.native="chooseReport(card)"
            :class="{'is-active':showItemId === card.examPublishId}"
          >
            <h4>{{card.assayItemName}}</h4>
            <p>{{card.barCode||'--'}},{{card.assayDeptName||'--'}},已发布</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>
<script>
import { getExamList } from "@/api/reportCenter/report";
import { mapGetters } from "vuex";
import { getReportData2 } from "@/api/reportCenter/report";

export default {
  data() {
    return {
      // 类型下拉
      options: [
        {
          value: "0",
          label: "按分类"
        },
        {
          value: "1",
          label: "按时间"
        }
      ],
      // 类型数据code
      code: "CS00.00.001",
      // 类型值
      typeVal: "0",
      // 时间区间
      timeRange: [],
      // 列表loading
      loading: false,
      // 按分类列表
      categoryList: [],
      // 左侧列表选中项的id
      showItemId: "",
      // 报告状态
      reportStatus: {
        "0": "已发布",
        "1": "已打印"
      }
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    patientNo() {
      return this.$attrs.patien;
    }
  },
  watch: {
    timeRange: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log(val, "timeRange");
      }
    },
    patientNo: {
      immediate: true,
      handler(val) {
        if (val) {
          // this.loadData();
        }
      }
    },
    "receivePatientData.inpCode": {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.loadData2();
        }
      }
    },
    "receivePatientData.patientId": {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.loadData2();
        }
      }
    },
    categoryList: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val.length > 0) {
          this.chooseReport(this.categoryList[0].assayPublishList[0]);
        }
      }
    }
  },
  methods: {
    async loadData2() {
      this.isLoading = true;
      let params = {
        type: "1"
      };
      if (this.timeRange) {
        params = {
          ...params,
          createdAtStart: this.timeRange[0],
          createdAtEnd: this.timeRange[1]
        };
      }
      if (this.typeVal === "1") {
        params.patientId = this.receivePatientData.patientId;
        params.type = "2";
      } else if (this.receivePatientData.inpCode) {
        params.inpCode = this.receivePatientData.inpCode;
      } else if (this.receivePatientData.visitCode) {
        params.visitCode = this.receivePatientData.visitCode;
      }
      try {
        let { code, data, msg } = await getReportData2(params);
        if (code === 1) {
          console.log("data:", data);
          this.categoryList = data;
        } else {
          this.$message.error(msg);
        }
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    // 时间范围切换
    timeChanage(val) {
      this.loadData2();
    },
    // 类型切换
    typeChange(val) {
      this.loadData2();
    },
    // 获取选择列表子项
    chooseReport(data) {
      this.showItemId = data.assayPublishList;
      console.log(data, "列表子项");
      this.$emit("detail", data);
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 328px;
  position: relative;
  height: 100%;
  border: 0;
}

.select-container {
  width: 95px;
  vertical-align: top;
}
.content-loading {
  position: absolute;
  top: 51px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  .content {
    width: 100%;
    height: 100%;
  }
}
/deep/ .date-picker {
  width: 228px !important;
  .el-range-input {
    width: 80px;
    vertical-align: top;
    font-size: $l-font-size;
  }
  .el-range-separator {
    vertical-align: top;
    width: 14px;
  }
}
.type-list-menu {
  width: 100%;
  border-right: 0;
  /deep/ .el-submenu__title {
    background-color: $l-color-bgcolor-14;
    .el-submenu__icon-arrow {
      display: none;
    }
    .type-menu-num {
      margin-left: 10px;
    }
  }
  /deep/ .el-submenu {
    margin-bottom: 1px;
    .el-submenu__title {
      padding-left: 10px !important;
      padding-right: 0 !important;
    }
    .el-menu-item {
      padding-left: 26px !important;
      padding-right: 0 !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .iconfont {
      display: inline-block;
      color: $l-color-fontcolor-3;
      font-size: $l-font-size-min;
    }
    &.is-opened .el-submenu__title {
      .iconfont {
        transform: rotate(90deg);
      }
      span {
        font-weight: $l-font-weight;
      }
    }
  }
  /deep/ .el-menu-item.is-active {
    background-color: $l-color-bgcolor-12;
  }
  /deep/ .el-badge__content.is-fixed.is-dot {
    top: 10px;
  }
}
.report-timeline {
  padding-left: 1px;
  /deep/ .el-timeline-item__timestamp {
    margin-bottom: 12px;
    font-size: $l-font-size-max;
    color: $l-color-fontcolor-3;
  }
  /deep/ .el-timeline-item__timestamp.is-top {
    padding-top: 2px;
  }
  /deep/ .el-card {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 2px;
    cursor: pointer;
    &.is-active {
      border-color: $l-color-primary;
    }
    .el-card__body {
      h4 {
        margin: 0;
        color: $l-color-fontcolor-3;
        font-size: $l-font-size;
        margin-bottom: 7px;
      }
      p {
        color: $l-color-fontcolor-4;
        font-size: $l-font-size;
      }
    }
  }
  .el-card.is-always-shadow {
    box-shadow: none;
  }
}
.link-style {
  display: inline-block;
  padding: 6px 10px;
  border: 1px solid $l-color-bgcolor-11;
  margin-top: 8px;
}
.badge-item {
  /deep/ .el-badge__content.is-dot {
    border: 0;
  }
  /deep/ .el-badge__content.is-fixed.is-dot {
    right: 0;
  }
}
</style>