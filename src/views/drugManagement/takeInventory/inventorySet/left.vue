<template>
  <el-card class="height100">
    <div class="padding8" ref="top">
      <!--标题-->
      <l-card-title style="padding-bottom:8px;">
        <span slot="left">盘存模板查询</span>
      </l-card-title>
      <!--筛选条件-->
      <l-formt-title label="修改时间" labelWidth="64">
        <el-date-picker
          style="width:100%"
          :clearable="true"
          v-model="formSearch.entryTime"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </l-formt-title>
      <l-formt-title label="模板名称" labelWidth="64" style="margin-top: 8px">
        <el-input v-model="formSearch.templateName" placeholder="请输入"></el-input>
      </l-formt-title>
      <!-- 搜索按钮 重置按钮 -->
      <el-row style="margin-top: 8px">
        <el-col :span="24">
          <el-button type="primary" size="small" @click="search">查询</el-button>
          <el-button type="primary" size="small" plain @click="formSearchReset">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <!--排序-->
    <div class="sort-container">
      <l-sort-label class="inline-block" label="模板名称" state="2" @click="listsort('TEMPLATE_NAME')"></l-sort-label>
      <l-sort-label class="inline-block" label="修改时间" state="2" @click="listsort('UPDATED_AT')"></l-sort-label>
    </div>
    <!--列表-->
    <div class="infinite-list-wrapper" v-loading="loading">
      <div
        class="list-container overflow-scroll-vertical"
        v-infinite-scroll="loadNextPage"
        :infinite-scroll-disabled="listDisabled"
      >
        <div class="list-item" v-for="(item, i) in templateList" :key="i">
          <div
            :class="['tem-delete', chooseLeft ? '' : 'disabled']"
            @click.stop="handleSelectedItem(i, item)"
          >
            <i class="filter-item iconfont iconxinzeng" title="添加药品"></i>
          </div>
          <div class="state" @click.stop="starsHandleClick(item)">
            <svg
              :class="starsCls(item.frequencyStatus)"
              v-if="item.frequencyStatus === '0'"
              style="width: 20px; height: 20px"
              t="1567474720137"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7116"
              width="200"
              height="200"
            >
              <path
                d="M509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0z"
                fill="#F5F5F5"
                p-id="7117"
              />
              <path
                d="M434.189964 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636zM265.648873 973.405091A37.469091 37.469091 0 0 1 248.240873 977.454545a43.613091 43.613091 0 0 1-23.272728-7.028363c-12.101818-8.052364-17.733818-21.736727-15.220363-39.237818l41.146182-245.294546a75.357091 75.357091 0 0 0-20.340364-69.585454L57.218327 440.645818c-9.588364-10.519273-13.312-27.694545-8.378182-43.566545a34.816 34.816 0 0 1 28.57891-24.017455l234.309818-36.026182c27.508364-1.722182 47.476364-19.083636 59.345454-42.868363l105.285818-225.745455a35.653818 35.653818 0 0 1 33.512728-21.876363c13.777455 0 27.182545 8.657455 33.838545 22.434909l108.171637 224.116363c11.264 22.621091 29.602909 36.352 52.736 42.170182l241.198545 37.282909c13.544727 1.256727 24.296727 10.333091 28.532364 24.017455 6.050909 15.825455 2.327273 31.650909-9.821091 45.149091l-169.658182 171.799272c-18.152727 16.896-28.532364 46.173091-21.876364 73.076364l40.587637 245.061818c3.258182 16.384-2.420364 30.114909-15.918546 39.936a38.958545 38.958545 0 0 1-21.271273 5.864727 31.837091 31.837091 0 0 1-14.894545-3.211636l-213.876364-118.085818a66.001455 66.001455 0 0 0-34.769454-9.216c-12.706909 0-25.227636 3.025455-36.445091 10.146909l-210.757818 116.317091z"
                fill="#C5CBCF"
                p-id="7118"
              />
            </svg>
            <svg
              :class="starsCls(item.frequencyStatus)"
              v-if="item.frequencyStatus === '1'"
              style="width: 20px; height: 20px"
              t="1567474905040"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7228"
              width="200"
              height="200"
            >
              <path
                d="M509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0z"
                fill="#FFD2C2"
                p-id="7229"
              />
              <path
                d="M434.189964 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636zM265.648873 973.405091A37.469091 37.469091 0 0 1 248.240873 977.454545a43.613091 43.613091 0 0 1-23.272728-7.028363c-12.101818-8.052364-17.733818-21.736727-15.220363-39.237818l41.146182-245.294546a75.357091 75.357091 0 0 0-20.340364-69.585454L57.218327 440.645818c-9.588364-10.519273-13.312-27.694545-8.378182-43.566545a34.816 34.816 0 0 1 28.57891-24.017455l234.309818-36.026182c27.508364-1.722182 47.476364-19.083636 59.345454-42.868363l105.285818-225.745455a35.653818 35.653818 0 0 1 33.512728-21.876363c13.777455 0 27.182545 8.657455 33.838545 22.434909l108.171637 224.116363c11.264 22.621091 29.602909 36.352 52.736 42.170182l241.198545 37.282909c13.544727 1.256727 24.296727 10.333091 28.532364 24.017455 6.050909 15.825455 2.327273 31.650909-9.821091 45.149091l-169.658182 171.799272c-18.152727 16.896-28.532364 46.173091-21.876364 73.076364l40.587637 245.061818c3.258182 16.384-2.420364 30.114909-15.918546 39.936a38.958545 38.958545 0 0 1-21.271273 5.864727 31.837091 31.837091 0 0 1-14.894545-3.211636l-213.876364-118.085818a66.001455 66.001455 0 0 0-34.769454-9.216c-12.706909 0-25.227636 3.025455-36.445091 10.146909l-210.757818 116.317091z"
                fill="#F05A23"
                p-id="7230"
              />
            </svg>
          </div>
          <div class="drugName">{{ item.templateName }}</div>
          <div class="item-label">
            <span class="label">药物种类</span>
            <span>{{ item.drugNum }}</span>
            <span class="label margin-left-6">修改人</span>
            <span>{{ item.updatedByName }}</span>
          </div>
          <div class="item-label">
            <span class="label">创建时间</span>
            <span>{{ item.createdAt }}</span>
          </div>
          <div class="item-label">
            <span class="label">修改时间</span>
            <span>{{ item.updatedAt }}</span>
          </div>
        </div>
        <p v-if="loading" class="load-list-bottom">{{ $t("base.loading") }}</p>
        <p v-if="noMore" class="load-list-bottom">{{ $t("base.noMore") }}</p>
      </div>
    </div>
  </el-card>
</template>

<script>
import stockApi from "@/api/hmm/stock";
import listSort from "@/mixins/drugLeftChange.js";

export default {
  name: "left",
  mixins: [listSort],
  data() {
    return {
      selectId: "",
      formSearch: {
        entryTime: [], //
        templateName: "" //模板名称
      },
      curSelectedIndex: [], // 当前选择单号下标
      templateList: [], // 申请列表
      loading: false, //左侧申请列表滑动加载状态
      pageParams: {
        pageNo: 0, // 当前页数
        total: 5, // 总共条数
        pageSize: 10 // 每页数据条数
      },
      // 列表排序字段，默认时间倒序
      orderBy: "FREQUENCY_STATUS DESC",
      // 是否可以添加左侧模板药品
      chooseLeft: true
    };
  },
  computed: {
    listDisabled() {
      return this.loading || this.noMore;
    },
    noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    }
  },
  methods: {
    // 筛选条件重置
    formSearchReset() {
      this.formSearch = this.$options.data().formSearch;
    },
    newAdd() {
      this.$emit("newAdd");
    },
    starsHandleClick(item) {
      let fre, msg;
      if (item.frequencyStatus === "1") {
        fre = "0";
        msg = "取消常用模板";
      } else {
        fre = "1";
        msg = "设置常用模板";
      }
      stockApi
        .changeTemFre({
          id: item.id,
          frequencyStatus: fre,
          dataVersion: item.dataVersion
        })
        .then(res => {
          if (res.code === 1) {
            this.$message({
              type: "success",
              message: msg + "成功"
            });
            this.reList();
          } else {
            this.$message({
              type: "error",
              message: res.msg || msg + "失败"
            });
          }
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: err || msg + "失败"
          });
        });
    },
    starsCls(isStartOn) {
      return {
        normal: true,
        "el-icon-star-on": isStartOn === "1",
        selected: Boolean(isStartOn),
        "el-icon-star-off": isStartOn === "0"
      };
    },
    // 加载下一页
    loadNextPage() {
      if (this.noMore) {
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    loadTable() {
      let queryData = { ...this.pageParams };
      queryData.orderBy = this.orderBy; //按时间倒序
      queryData.sDate =
        this.formSearch.entryTime && this.formSearch.entryTime[0]
          ? this.formSearch.entryTime[0] + " 00:00:00"
          : ""; //开始日期
      queryData.eDate =
        this.formSearch.entryTime && this.formSearch.entryTime[1]
          ? this.formSearch.entryTime[1] + " 23:59:59"
          : ""; //结束日期
      queryData.name = this.formSearch.templateName || ""; //模板名称
      //queryData.recordStatus = '0';

      this.loading = true;
      stockApi
        .getSetList(queryData)
        .then(res => {
          if (res.code == 1) {
            if (res.pageNo === 1) {
              this.templateList = res.data;
            } else {
              let data = this.templateList.concat(res.data);
              this.templateList = data;
            }
          } else {
            this.$message.error(res.msg || "获取盘存单数据失败");
          }
          this.pageParams = res.pageParams;
          this.handleSelectedItem("", {});
          this.loading = false;
        })
        .catch(res => {
          this.loading = false;
        });
    },
    search() {
      this.pageParams.pageNo = 1;
      this.loadTable();
    },
    //默认左侧第一项选择右侧渲染数据
    handleSelectedItem(i, item) {
      if (!this.chooseLeft) {
        return;
      }
      this.curSelectedIndex.push(i);
      let data = {
        ...item,
        timeKeyFlag: Date.now()
      };
      this.$emit("selectIdChange", data);
    },
    // 重新请求列表
    reList() {
      this.pageParams.pageNo = 1;
      this.search();
    },
    // 清除当前选中
    clearSelectItem(val) {
      this.chooseLeft = val;
      this.curSelectedIndex = [];
      this.$emit("selectIdChange", {});
    }
  }
};
</script>

<style scoped lang="scss">
.el-card {
  position: relative;

  .padding20 {
    padding: 10px 20px;
  }

  .clearFloat {
    margin-top: 7px;
    overflow: hidden;

    & > div {
      width: 195px;
    }

    .button {
      width: 80px;
      height: 36px;
      margin-left: 10px;
      background: $l-color-primary;
      border-radius: 2px;
      font-size: 14px;
      font-weight: 500;
      color: $l-color-white;
    }

    .reset {
      background: $l-color-white;
      color: $l-color-primary;
      border-color: $l-color-primary;
    }
  }

  .sort-container {
    background: $l-color-bgcolor-18;
    padding: 0 16px;
    height: 30px;

    .inline-block {
      margin-right: 2px;
    }
  }
  .infinite-list-wrapper {
    position: absolute;
    top: 190px;
    left: 0;
    width: 100%;
    bottom: 0;
  }
  .list-container {
    height: 100%;

    .list-item {
      padding: 6px 14px;
      position: relative;

      .tem-delete {
        position: absolute;
        right: 40px;
        top: 11px;
        cursor: pointer;
        &.disabled {
          cursor: not-allowed;
          color: $l-color-bgcolor-16;
        }
      }
      .state {
        position: absolute;
        right: 10px;
        top: 10px;
      }

      .item-label {
        line-height: 28px;
        font-weight: 400;
        font-size: 14px;
        color: $l-color-fontcolor-3;

        .label {
          font-size: $l-font-size;
          font-weight: 400;
          color: $l-color-fontcolor-4;
          line-height: 20px;
        }
      }

      .selected {
        color: $l-color-primary !important;

        font-size: 20px;
      }

      .normal {
        color: $l-color-bgcolor-11;
        font-size: 20px;
        cursor: pointer;
      }

      .drugName {
        font-size: 16px;
        
        font-weight: bold;
        color: $l-color-fontcolor-3;
        line-height: 32px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 50px;
      }
    }

    .list-item:nth-child(even) {
      background: $l-color-bgcolor-18;
    }

    .active {
      background-color: $l-color-bgcolor-12 !important;
    }
  }
}
</style>
