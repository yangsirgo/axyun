<template>
  <div class="common">
    <div class="sort">
      <div class="search">
        <el-input
          v-model="temName"
          placeholder="请输入模板名称"
          @keyup.enter.native="loadData"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="loadData"
          ></el-button>
        </el-input>
      </div>
      <el-radio-group v-model="sortType" @change="loadData">
        <el-radio label="1">个人</el-radio>
        <el-radio label="2">科室</el-radio>
      </el-radio-group>
      <!-- <el-button-group>
        <el-button size="mini">使用次数</el-button>
        <el-button size="mini">最近使用</el-button>
      </el-button-group>-->
    </div>
    <div class="content" v-loading="loading">
      <el-collapse v-model="activeNames" accordion>
        <l-collapse-item
          sty="2"
          v-for="(item, index) in listData"
          :key="'list' + index"
          :name="item.contentRange"
        >
          <template slot="title">
            <div class="cdiagTitle" :title="type[item.contentRange]">
              <span>{{ type[item.contentRange] }}</span>
            </div>
          </template>
          <template slot="content">
            <ul>
              <li class="listLi" v-for="diag in item.template" :key="diag.id">
                <div
                  @click.stop="quote(diag, item.contentRange)"
                  class="float-right quote-button mini-button"
                  type="primary"
                >
                  {{ $t("base.quote") }}
                </div>
                <div class="listReamrks" :title="diag.templateName">
                  {{ diag.templateName }}
                </div>
              </li>
            </ul>
          </template>
        </l-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { getTempList } from "@/api/tools/handoverTem.js";
import { mapGetters } from "vuex";

export default {
  name: "handoverTem",
  props: {
    loadListFlag: {
      type: Boolean
    }
  },
  data() {
    return {
      temName: "",
      sortType: "1",
      listData: [],
      activeNames: "",
      type: {
        "1": "总览",
        "2": "交班",
        "3": "接班"
      },
      loading: false
    };
  },
  computed: {
    ...mapGetters(["role"]),
    isLoad() {
      return this.loadListFlag;
    }
  },
  watch: {
    isLoad() {
      this.loadData();
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      getTempList({
        tempName: this.temName,
        operatorId: this.role.userId,
        deptId: this.role.deptId,
        recType: this.sortType
      })
        .then(res => {
          if (res.code === 1) {
            this.listData = res.data;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    quote(row, type) {
      this.$emit("send-value", row.templateValue, type);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-collapse-item__arrow {
  display: block;
}
.common {
  position: relative;
  // width: 100%;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .sort {
    width: 100%;
    line-height: 36px;
    overflow: hidden;
    font-size: $l-font-size;
    margin-bottom: 10px;
    .el-button {
      padding: 2px 5px !important;
      border-radius: 0;
    }
    .el-radio-group {
      display: block;
      .el-radio {
        margin-right: 0;
        margin-top: 11px;
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
  .table-title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: $l-color-bgcolor-11;
    padding: 0 20px;
  }
  .line-container {
    line-height: 30px;
    width: 100%;
    height: 30px;
    padding: 0 20px;
    border-bottom: 1px solid #e4e4e4;
  }
  .list-wrapper {
    overflow: scroll;
    height: calc(100% - 76px);
    .list-item {
      line-height: 30px;
      width: 100%;
      height: 30px;
      padding: 0 20px;
      border-bottom: 1px solid #e4e4e4;
    }
    .list-item:hover {
      background-color: $l-color-bgcolor-12;
    }
  }
  .listLi {
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    .quote-button {
      height: 20px;
      line-height: 20px;
      margin-top: 5px;
      padding: 0 4px;
      border-radius: 3px;
      cursor: pointer;
      float: right;
      color: #fff;
    }
  }
  .listReamrks {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 50px;
  }
  .cdiagTitle {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .content {
    position: absolute;
    top: 84px;
    bottom: 0;
    left: 10px;
    right: 10px;
  }
}
</style>
